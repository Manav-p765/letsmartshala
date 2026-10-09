/**
 * The demo-request form: name, school, role, mobile, email (optional).
 *
 * Validates as you go (on blur, then live once a field has an error),
 * keeps UTM/click IDs from the landing URL so the lead email says which ad
 * it came from, and on success marks the submission for the thank-you
 * page's conversion tag and navigates there. If the server can't deliver
 * (not configured, network down) it says so plainly and offers the phone
 * and WhatsApp instead — a lead is never silently lost.
 */
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validate } from '../../../api/lead.js';
import { markLeadSubmitted } from '../../lib/track.js';
import { site } from '../../data/site.js';
import './LeadForm.css';

const ROLES = ['Principal', 'Owner / Trustee', 'Administrator', 'Accountant', 'Teacher', 'Other'];
const UTM = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'fbclid'];
const EMPTY = { name: '', school: '', role: '', phone: '', email: '', website: '' };

export default function LeadForm({ title = 'Book a free demo', note = 'A short call at a time that suits you. No obligation.', submit = 'Book my demo', compact = false }) {
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | failed
  const opened = useRef(Date.now());
  const utm = useRef({});

  // Keep ad parameters from the landing URL for this visit.
  useEffect(() => {
    const p = new URLSearchParams(location.search);
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem('ss-utm') || '{}'); } catch { /* ignore */ }
    for (const k of UTM) if (p.get(k)) saved[k] = p.get(k);
    utm.current = saved;
    try { sessionStorage.setItem('ss-utm', JSON.stringify(saved)); } catch { /* ignore */ }
  }, []);

  const check = (next) => validate({ ...next, role: next.role || '' }).errors || {};

  const onChange = (e) => {
    const next = { ...values, [e.target.name]: e.target.value };
    setValues(next);
    if (touched[e.target.name]) setErrors(check(next));
  };
  const onBlur = (e) => {
    if (!values[e.target.name]) return;
    setTouched((t) => ({ ...t, [e.target.name]: true }));
    setErrors(check(values));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = check(values);
    setErrors(errs);
    setTouched({ name: true, school: true, role: true, phone: true, email: true });
    if (Object.keys(errs).length) {
      e.currentTarget.querySelector(`[name="${Object.keys(errs)[0]}"]`)?.focus();
      return;
    }
    setStatus('sending');
    try {
      const r = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...values, ...utm.current, page: location.pathname, elapsed: Date.now() - opened.current })
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.ok) {
        markLeadSubmitted(values.role);
        navigate('/thank-you', { state: { name: values.name.split(' ')[0] } });
        return;
      }
      if (data.errors) { setErrors(data.errors); setStatus('idle'); return; }
      setStatus('failed');
    } catch {
      setStatus('failed');
    }
  };

  const field = (name, label, props = {}) => (
    <div className={`lf__field${errors[name] && touched[name] ? ' has-error' : ''}`}>
      <label htmlFor={`lf-${name}`}>{label}</label>
      <input
        id={`lf-${name}`}
        name={name}
        value={values[name]}
        onChange={onChange}
        onBlur={onBlur}
        aria-invalid={Boolean(errors[name] && touched[name])}
        aria-describedby={errors[name] && touched[name] ? `lf-${name}-err` : undefined}
        {...props}
      />
      {errors[name] && touched[name] && <p className="lf__error" id={`lf-${name}-err`}>{errors[name]}</p>}
    </div>
  );

  return (
    <form className={`lf${compact ? ' lf--compact' : ''}`} onSubmit={onSubmit} noValidate>
      <header className="lf__head">
        <h2 className="lf__title">{title}</h2>
        {note && <p className="lf__note">{note}</p>}
      </header>

      {field('name', 'Your name', { autoComplete: 'name', placeholder: 'e.g. Sunita Sharma' })}
      {field('school', 'School name', { autoComplete: 'organization', placeholder: 'e.g. Green Valley Public School' })}

      <div className={`lf__field${errors.role && touched.role ? ' has-error' : ''}`}>
        <span className="lf__label" id="lf-role-label">Your role</span>
        <div className="lf__roles" role="radiogroup" aria-labelledby="lf-role-label">
          {ROLES.map((r) => (
            <label key={r} className={`lf__role${values.role === r ? ' is-on' : ''}`}>
              <input
                type="radio"
                name="role"
                value={r}
                checked={values.role === r}
                onChange={(e) => { onChange(e); setTouched((t) => ({ ...t, role: true })); setErrors(check({ ...values, role: r })); }}
              />
              {r}
            </label>
          ))}
        </div>
        {errors.role && touched.role && <p className="lf__error">{errors.role}</p>}
      </div>

      <div className="lf__row">
        {field('phone', 'Mobile number', { type: 'tel', inputMode: 'tel', autoComplete: 'tel', placeholder: '98765 43210' })}
        {field('email', 'Email (optional)', { type: 'email', autoComplete: 'email', placeholder: 'you@school.edu.in' })}
      </div>

      {/* Honeypot: hidden from people and screen readers, filled by bots. */}
      <div className="lf__hp" aria-hidden="true">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={onChange} /></label>
      </div>

      <button className="btn lf__submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : <>{submit} <span className="btn__arrow" aria-hidden="true">→</span></>}
      </button>

      <p className="lf__fine" role={status === 'failed' ? 'alert' : undefined}>
        {status === 'failed' ? (
          <>
            We couldn’t send that just now. Please call or WhatsApp us on{' '}
            <a href={site.contact.whatsapp.href}>{site.contact.whatsapp.value}</a> or email{' '}
            <a href={site.contact.email.href}>{site.contact.email.value}</a>.
          </>
        ) : (
          <>We’ll only use these details to arrange your demo. Prefer WhatsApp? <a href={site.contact.whatsapp.href} target="_blank" rel="noreferrer">Message us</a>.</>
        )}
      </p>
    </form>
  );
}
