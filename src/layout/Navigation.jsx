import { useEffect, useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import Brand from '../components/Brand/Brand.jsx';
import { nav } from '../data/site.js';
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

  // Switch the pills to dark glass while a dark section (data-theme night,
  // navy or blue) sits under the bar. One check per frame at most, and only
  // the dark sections are measured — none on most pages, so no work at all.
  // (elementsFromPoint was used here before; its hit test cost ~1 s of a
  // slow phone's start-up.)
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      setScrolled(window.scrollY > 12);
      const dark = document.querySelectorAll('#main [data-theme="night"], #main [data-theme="navy"], #main [data-theme="blue"]');
      if (!dark.length) return setOnDark(false);
      const y = (headerRef.current?.getBoundingClientRect().bottom || 80) - 20;
      setOnDark([...dark].some((el) => { const r = el.getBoundingClientRect(); return r.top <= y && r.bottom > y; }));
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
          </ul>
        </div>
      )}
    </header>
  );
}
