/**
 * POST /api/lead — a demo request from the site's form.
 *
 * Validates the fields, drops obvious bots (honeypot + too-fast submits),
 * and emails the lead to the sales inbox through Resend's HTTP API (plain
 * fetch, no SDK). Runs as a Vercel serverless function; in local dev the
 * same handler is mounted by vite.config.js.
 *
 * Environment (set in Vercel → Project → Settings → Environment Variables):
 *   RESEND_API_KEY  required in production
 *   LEAD_TO         inbox that receives leads (default support@letssmartshala.com)
 *   LEAD_FROM       verified sender, e.g. "SmartShala Website <leads@letssmartshala.com>"
 *                   (the letssmartshala.com domain must be verified in Resend — DNS records)
 *
 * Without RESEND_API_KEY: in local dev the lead is printed to the terminal
 * and accepted; in production it answers 503 so the form can show the
 * phone/WhatsApp fallback instead of pretending it worked.
 */

const ROLES = ['Principal', 'Owner / Trustee', 'Administrator', 'Accountant', 'Teacher', 'Other'];
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];

const clean = (v, max = 200) => String(v ?? '').replace(/[\u0000-\u001f]/g, ' ').trim().slice(0, max);
const esc = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Returns { lead } or { errors } — field name → message. */
export function validate(body) {
  const lead = {
    name: clean(body.name, 80),
    school: clean(body.school, 120),
    role: clean(body.role, 40),
    phone: clean(body.phone, 20).replace(/[^\d+]/g, ''),
    email: clean(body.email, 120).toLowerCase(),
    page: clean(body.page, 200)
  };
  for (const k of UTM) if (body[k]) lead[k] = clean(body[k], 120);

  const errors = {};
  if (lead.name.length < 2) errors.name = 'Please enter your name.';
  if (lead.school.length < 2) errors.school = 'Please enter your school’s name.';
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
    ['Name', lead.name], ['School', lead.school], ['Role', lead.role],
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
  // Answer "ok" so they don't retry, but send nothing.
  if (body.website || (Number(body.elapsed) > 0 && Number(body.elapsed) < 2000)) {
    return res.status(200).json({ ok: true });
  }

  const { lead, errors } = validate(body);
  if (errors) return res.status(400).json({ ok: false, errors });

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    if (!process.env.VERCEL) {
      console.log('\n[lead] (dev, not emailed — no RESEND_API_KEY)\n', lead, '\n');
      return res.status(200).json({ ok: true, dev: true });
    }
    console.error('[lead] RESEND_API_KEY is not set; lead not delivered:', lead);
    return res.status(503).json({ ok: false, error: 'not_configured' });
  }

  const { html, text } = emailBody(lead);
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: process.env.LEAD_FROM || 'SmartShala Website <onboarding@resend.dev>',
      to: [process.env.LEAD_TO || 'support@letssmartshala.com'],
      reply_to: lead.email || undefined,
      subject: `Demo request: ${lead.school} (${lead.role})`,
      html,
      text
    })
  });

  if (!r.ok) {
    console.error('[lead] Resend error', r.status, await r.text().catch(() => ''), lead);
    return res.status(502).json({ ok: false, error: 'send_failed' });
  }
  return res.status(200).json({ ok: true });
}
