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

/**
 * Store badges for the principal and teacher apps, from `site.apps`. An app
 * or store without a link is simply not shown, so nothing points to a
 * listing that doesn't exist (a different company's "Smartshala" app is on
 * Google Play — never send schools to a search).
 */
export default function AppBadges() {
  const apps = site.apps.filter((a) => a.play || a.appStore);
  if (!apps.length) return null;
  return (
    <div className="appb">
      <p className="label">Get the apps</p>
      {apps.map((a) => (
        <div className="appb__app" key={a.name}>
          <span className="appb__name">{a.name}</span>
          <div className="appb__row">
            {a.play && (
              <a className="appb__badge" href={a.play} target="_blank" rel="noreferrer" aria-label={`${a.name} on Google Play`}>
                {icons.play}<span><small>Get it on</small>Google Play</span>
              </a>
            )}
            {a.appStore && (
              <a className="appb__badge" href={a.appStore} target="_blank" rel="noreferrer" aria-label={`${a.name} on the App Store`}>
                {icons.apple}<span><small>Download on the</small>App Store</span>
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
