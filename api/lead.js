/**
 * POST /api/lead — a demo request from the site's form.
 *
 * Validates the fields, drops obvious bots (honeypot + too-fast submits),
 * then delivers the lead to two places at once:
 *   1. the SmartShala sales CRM (POST to CRM_LEAD_URL), so it lands in the
 *      leads pipeline — the contract is in docs/crm-lead-endpoint.md;
 *   2. the sales inbox, by email through Resend's HTTP API (plain fetch).
 * The visitor sees success if at least one of them took the lead.
 *
 * Runs as a Vercel serverless function; in local dev the same handler is
 * mounted by vite.config.js.
 *
 * Environment (Vercel → Project → Settings → Environment Variables):
 *   CRM_LEAD_URL    CRM endpoint that creates a lead
 *   CRM_LEAD_TOKEN  shared secret, sent as "Authorization: Bearer <token>"
 *   RESEND_API_KEY  email delivery
 *   LEAD_TO         inbox for leads (default support@letssmartshala.com)
 *   LEAD_FROM       verified sender, e.g. "SmartShala <leads@letssmartshala.com>"
 *   LEAD_TEMPLATE   Resend template id (default "demo-lead-notification");
 *                   set to "none" to send the plain built-in email instead
 *
 * With neither CRM nor email configured: in local dev the lead is printed
 * to the terminal and accepted; in production it answers 503 so the form
 * shows the phone/WhatsApp fallback instead of pretending it worked.
 */

const ROLES = ['Principal', 'Owner / Trustee', 'Administrator', 'Accountant', 'Teacher', 'Other'];
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

const clean = (v, max = 200) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Returns { lead } or { errors } — field name → message. Shared with the form. */
export function validate(body) {
  const lead = {
    name: clean(body.name, 80),
    school: clean(body.school, 120),
    students: clean(body.students, 8).replace(/[^\d]/g, ''),
    role: clean(body.role, 40),
    phone: clean(body.phone, 20).replace(/[^\d+]/g, ''),
    email: clean(body.email, 120).toLowerCase(),
    page: clean(body.page, 200)
  };
  for (const k of UTM) if (body[k]) lead[k] = clean(body[k], 120);

  const errors = {};
  if (lead.name.length < 2) errors.name = 'Please enter your name.';
  if (lead.school.length < 2) errors.school = 'Please enter your school’s name.';
  const n = Number(lead.students);
  if (!lead.students || !(n >= 1 && n <= 10000)) errors.students = 'Roughly how many students? (1–10,000)';
  else lead.students = n;
  if (!ROLES.includes(lead.role)) errors.role = 'Please choose your role.';
  // Indian mobile numbers: 10 digits starting 6–9, optional +91 / 0 prefix.
  const digits = lead.phone.replace(/^\+?91/, '').replace(/^0/, '');
  if (!/^[6-9]\d{9}$/.test(digits)) errors.phone = 'Please enter a 10-digit mobile number.';
  else lead.phone = '+91 ' + digits.slice(0, 5) + ' ' + digits.slice(5);
  if (lead.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(lead.email)) errors.email = 'Please check the email address.';

  return Object.keys(errors).length ? { errors } : { lead };
}

function emailBody(lead) {
  const rows = [
    ['Name', lead.name], ['School', lead.school], ['Students', String(lead.students)], ['Role', lead.role],
    ['Phone', lead.phone], ['Email', lead.email || '—'], ['Page', lead.page || '—'],
    ...UTM.filter((k) => lead[k]).map((k) => [k, lead[k]])
  ];
  const wa = 'https://wa.me/' + lead.phone.replace(/\D/g, '');
  const html = `
    <h2 style="font-family:sans-serif;margin:0 0 12px">New demo request</h2>
    <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
      ${rows.map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0"><b>${esc(v)}</b></td></tr>`).join('')}
    </table>
    <p style="font-family:sans-serif;font-size:14px"><a href="tel:${esc(lead.phone.replace(/\s/g, ''))}">Call</a> · <a href="${esc(wa)}">WhatsApp</a></p>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join('\n');
  return { html, text };
}

/** POSTs the lead to the CRM (docs/crm-lead-endpoint.md). True on 2xx. */
async function sendToCrm(url, lead) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, {
      method: 'POST',
      signal: ctrl.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.CRM_LEAD_TOKEN ? { Authorization: `Bearer ${process.env.CRM_LEAD_TOKEN}` } : {})
      },
      body: JSON.stringify({
        source: 'website',
        name: lead.name,
        schoolName: lead.school,
        numberOfStudents: lead.students,
        role: lead.role,
        phone: lead.phone.replace(/\s/g, ''),
        email: lead.email || null,
        page: lead.page || null,
        utm: Object.fromEntries(UTM.filter((k) => lead[k]).map((k) => [k, lead[k]])),
        submittedAt: new Date().toISOString()
      })
    });
    if (!r.ok) console.error('[lead] CRM error', r.status, await r.text().catch(() => ''));
    return r.ok;
  } catch (e) {
    console.error('[lead] CRM unreachable:', e.message);
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** The values the Resend template (LEAD_TEMPLATE) fills in. All strings. */
function templateVariables(lead) {
  const digits = lead.phone.replace(/\D/g, '');
  return {
    LEAD_NAME: lead.name,
    SCHOOL: lead.school,
    STUDENTS: String(lead.students),
    ROLE: lead.role,
    PHONE: lead.phone,
    PHONE_TEL: `tel:+${digits}`,
    WHATSAPP_URL: `https://wa.me/${digits}`,
    // Email is optional on the form; a template variable must not be empty.
    LEAD_EMAIL: lead.email || 'Not given',
    PAGE: lead.page || '/',
    RECEIVED_AT: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' }) + ' IST'
  };
}

async function postEmail(key, content) {
  const lead = content.lead;
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_FROM || 'SmartShala Website <onboarding@resend.dev>',
      to: [process.env.LEAD_TO || 'support@letssmartshala.com'],
      reply_to: lead.email || undefined,
      subject: `Demo request: ${lead.school} (${lead.students} students, ${lead.role})`,
      ...content.body
    })
  });
  if (!r.ok) console.error(`[lead] Resend error (${content.kind})`, r.status, await r.text().catch(() => ''));
  return r.ok;
}

/**
 * Emails the lead with the Resend template. If Resend rejects that (template
 * missing, unpublished, a variable renamed), the plain built-in email goes
 * out instead — a lead is never lost to a template problem.
 */
async function sendEmail(key, lead) {
  const template = process.env.LEAD_TEMPLATE || 'demo-lead-notification';
  try {
    if (template !== 'none') {
      const sent = await postEmail(key, { kind: 'template', lead, body: { template: { id: template, variables: templateVariables(lead) } } });
      if (sent) return true;
    }
    return await postEmail(key, { kind: 'plain', lead, body: emailBody(lead) });
  } catch (e) {
    console.error('[lead] Resend unreachable:', e.message);
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Bots: a hidden field humans never fill, and forms submitted in under 2s.
  // Answer "ok" so they don't retry, but deliver nothing.
  if (body.website || (Number(body.elapsed) > 0 && Number(body.elapsed) < 2000)) {
    return res.status(200).json({ ok: true });
  }

  const { lead, errors } = validate(body);
  if (errors) return res.status(400).json({ ok: false, errors });

  const crm = process.env.CRM_LEAD_URL;
  const key = process.env.RESEND_API_KEY;
  if (!crm && !key) {
    if (!process.env.VERCEL) {
      console.log('\n[lead] (dev — no CRM_LEAD_URL or RESEND_API_KEY; not delivered)\n', lead, '\n');
      return res.status(200).json({ ok: true, dev: true });
    }
    console.error('[lead] no delivery configured; lead not delivered:', lead);
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const [toCrm, toEmail] = await Promise.all([
    crm ? sendToCrm(crm, lead) : null,
    key ? sendEmail(key, lead) : null
  ]);
  if (toCrm === true || toEmail === true) return res.status(200).json({ ok: true });
  console.error('[lead] every delivery failed:', lead);
  return res.status(502).json({ ok: false, error: 'send_failed' });
}
