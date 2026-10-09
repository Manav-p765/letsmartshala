import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Brand from '../components/Brand/Brand.jsx';
import { nav, site } from '../data/site.js';
import { stopScroll, startScroll } from '../lib/smooth.js';
import './Navigation.css';

/**
 * Three floating pills — brand, links, actions — that sit over the hero.
 * Once the page scrolls, the pills gain a frosted backing so they stay
 * readable over any section.
 */
export default function Navigation({ minimal = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const headerRef = useRef(null);
  const { pathname } = useLocation();

  // Read which section sits under the bar (its data-theme) so the pills
  // switch to dark glass over dark sections. One check per frame at most.
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 12);
      const y = (headerRef.current?.getBoundingClientRect().bottom || 80) - 20;
      const under = document
        .elementsFromPoint(window.innerWidth / 2, y)
        .find((el) => !headerRef.current?.contains(el))
        ?.closest('[data-theme]');
      setOnDark(['night', 'navy', 'blue'].includes(under?.dataset.theme));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    // Sections mount and restyle after the first frame; look again shortly.
    const late = setTimeout(check, 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(late);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [pathname]);

  // Close the menu on navigation.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    stopScroll();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      startScroll();
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <header
      ref={headerRef}
      className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}${onDark && !open ? ' is-dark' : ''}`}
      data-theme="paper"
    >
      <div className="nav__bar container">
        <div className="nav__pill nav__pill--brand">
          <Brand />
        </div>

        {!minimal && (
          <nav className="nav__pill nav__pill--links" aria-label="Main">
            <ul>
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className="nav__link">
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}

        <div className="nav__pill nav__pill--actions">
          {!minimal && (
            <a className="nav__login" href={site.loginUrl}>
              Log in
            </a>
          )}
          <Link className="btn btn--small" to="/demo">
            Book a demo
          </Link>
          {!minimal && (
            <button
              className="nav__burger"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((v) => !v)}
            >
              <span />
              <span />
            </button>
          )}
        </div>
      </div>

      {!minimal && (
        <div id="mobile-menu" className="nav__menu" hidden={!open}>
          <ul>
            {nav.map((item, i) => (
              <li key={item.to} style={{ '--i': i }}>
                <NavLink to={item.to}>{item.label}</NavLink>
              </li>
            ))}
            <li style={{ '--i': nav.length }}>
              <a href={site.loginUrl}>Log in</a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
