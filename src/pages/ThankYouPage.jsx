/**
 * /thank-you — after a demo request. Fires the lead conversion (GA4, Google
 * Ads, Meta) exactly once per real submission; a refresh or a direct visit
 * shows the page but counts nothing. Not indexed.
 */
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import { trackLeadConversion } from '../lib/track.js';
import { thanks } from '../data/pages.js';
import { site } from '../data/site.js';
import './Pages.css';

export default function ThankYouPage() {
  usePageMeta({ title: 'Thank you', description: thanks.meta, path: '/thank-you', noindex: true });
  const { state } = useLocation();
  const name = state?.name;

  useEffect(() => { trackLeadConversion(); }, []);

  return (
    <section className="section ty" data-theme="paper" aria-labelledby="ty-title">
      <div className="linework" aria-hidden="true" />
      <div className="container ty__inner">
        <span className="ty__tick" aria-hidden="true">
          <svg viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>
        </span>
        <h1 className="display ty__title" id="ty-title">
          {thanks.title}{name ? <>, <em className="serif hi">{name}</em></> : ''}.
        </h1>
        <p className="lede">{thanks.lede}</p>

        <ul className="ty__steps">
          {thanks.meanwhile.map((m) => (
            <li className="card" key={m.title}>
              <span className="icon-tile"><ModuleIcon name={m.icon} /></span>
              <h3>{m.title}</h3>
              <p>{m.text}</p>
            </li>
          ))}
        </ul>

        <div className="ty__actions">
          <a className="btn" href={site.contact.whatsapp.href} target="_blank" rel="noreferrer">WhatsApp {site.contact.whatsapp.value}</a>
          <Link className="btn btn--ghost" to="/">Back to the website</Link>
        </div>
      </div>
    </section>
  );
}
