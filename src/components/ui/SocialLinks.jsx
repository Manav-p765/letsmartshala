import { site } from '../../data/site.js';
import './SocialLinks.css';

/** Brand glyphs, drawn on a 24px grid as single paths. */
const icons = {
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M13.6 21.5v-8.2h2.8l.4-3.2h-3.2V8c0-.9.3-1.6 1.6-1.6h1.7V3.6a22 22 0 0 0-2.5-.1c-2.500 0-4.200 1.500-4.200 4.300v2.300H7.400v3.200h2.800v8.200h3.400Z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M4.4 9.300h3.300V20H4.400V9.300ZM6 3.800a1.900 1.900 0 1 1 0 3.800 1.900 1.900 0 0 1 0-3.800ZM9.700 9.300h3.100v1.500c.5-.9 1.600-1.800 3.300-1.800 3.400 0 4 2.200 4 5.100V20h-3.300v-5.200c0-1.300 0-2.900-1.700-2.900s-2 1.400-2 2.800V20H9.700V9.300Z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.2a9.7 9.7 0 0 0-8.4 14.6L2.3 21.7l5-1.3A9.7 9.7 0 1 0 12 2.2Zm0 17.7a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 19.9Zm4.4-6c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.5.1l-.8 1c-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.5-.4h-.5a.9.9 0 0 0-.7.3 2.8 2.8 0 0 0-.9 2.1 4.9 4.9 0 0 0 1 2.6 11.2 11.2 0 0 0 4.3 3.8c1.6.7 2.2.7 3 .6.5-.1 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1l-.5-.4Z" />
    </svg>
  )
};

/**
 * Icon buttons for SmartShala's social profiles (from site.social).
 * `withHandle` also prints the handle next to each icon.
 */
export default function SocialLinks({ withHandle = false, className = '' }) {
  return (
    <ul className={`social${withHandle ? ' social--handles' : ''} ${className}`} aria-label="SmartShala on social media">
      {site.social.map((s) => (
        <li key={s.id}>
          <a href={s.href} target="_blank" rel="noreferrer" aria-label={`${s.label}: ${s.handle}`} title={`${s.label} · ${s.handle}`}>
            <span className={`social__icon social__icon--${s.id}`}>{icons[s.id]}</span>
            {withHandle && <span className="social__text"><span>{s.label}</span><strong>{s.handle}</strong></span>}
          </a>
        </li>
      ))}
    </ul>
  );
}
