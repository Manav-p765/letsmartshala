import { site } from '../../data/site.js';
import './AppBadges.css';

const icons = {
  play: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.2 2.6a1.3 1.3 0 0 0-.6 1.1v16.6c0 .5.2.9.6 1.1l9.3-9.4-9.3-9.4Zm10.5 8.2 2.5-2.5L6.6 2.2l8.1 8.6Zm0 2.4-8.1 8.6 10.6-6.1-2.5-2.5Zm5.6-3.3-2.8-1.6-2.7 2.7 2.7 2.7 2.8-1.6c.8-.5.8-1.7 0-2.2Z" /></svg>
  ),
  apple: (
    <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.4 12.6c0-2.4 2-3.6 2.1-3.7a4.5 4.5 0 0 0-3.5-1.9c-1.5-.2-2.9.9-3.7.9-.8 0-1.9-.9-3.2-.8a4.7 4.7 0 0 0-4 2.4c-1.7 3-.4 7.3 1.2 9.7.8 1.2 1.8 2.5 3 2.4 1.2 0 1.7-.8 3.2-.8s1.9.8 3.2.8c1.3 0 2.2-1.2 3-2.4a10.6 10.6 0 0 0 1.4-2.8 4.3 4.3 0 0 1-2.7-3.8Zm-2.4-7.1A4.3 4.3 0 0 0 15 2.4a4.4 4.4 0 0 0-2.9 1.5 4.1 4.1 0 0 0-1 3 3.6 3.6 0 0 0 2.9-1.4Z" /></svg>
  )
};

const STORES = [
  { key: 'play', icon: icons.play, small: 'Get it on', name: 'Google Play' },
  { key: 'appStore', icon: icons.apple, small: 'Download on the', name: 'App Store' }
];

/**
 * Store badges for the principal and teacher apps, from `site.apps`.
 *
 * A store with a link in site.js is a real, clickable badge. A store without
 * one shows as "Coming soon" — not a link, on purpose: a different company's
 * "Smartshala" app is on Google Play, so we never send schools to a search
 * or a listing that isn't ours. Fill in the URLs and the badges go live.
 */
export default function AppBadges() {
  if (!site.apps.length) return null;
  return (
    <div className="appb">
      <p className="label">Get the apps</p>
      {site.apps.map((a) => (
        <div className="appb__app" key={a.name}>
          <span className="appb__name">{a.name}</span>
          <div className="appb__row">
            {STORES.map((s) =>
              a[s.key] ? (
                <a key={s.key} className="appb__badge" href={a[s.key]} target="_blank" rel="noreferrer" aria-label={`${a.name} on ${s.name}`}>
                  {s.icon}<span><small>{s.small}</small>{s.name}</span>
                </a>
              ) : (
                <span key={s.key} className="appb__badge appb__badge--soon" aria-label={`${a.name} on ${s.name}: coming soon`}>
                  {s.icon}<span><small>Coming soon on</small>{s.name}</span>
                </span>
              )
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
