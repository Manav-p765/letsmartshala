import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './Navigation.jsx';
import Footer from './Footer.jsx';
import { setLenis, scrollToTop } from '../lib/smooth.js';
import { prefersReducedMotion, isStaticBoot, setStaticBoot } from '../lib/motion.js';
import { initTracking, trackPageView } from '../lib/track.js';
import { lazyPages } from '../routes.js';

/**
 * Page chrome. `minimal` is for the ad landing page and thank-you page:
 * no nav links to wander off through, just the brand and the one action.
 */
export default function Layout({ minimal = false }) {
  const { pathname } = useLocation();

  // Lenis drives scroll and feeds ScrollTrigger from GSAP's own ticker,
  // so there is exactly one rAF loop on the page.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({ lerp: 0.12 });
    setLenis(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Top of the page on every navigation — but not when taking over a
  // prerendered page, where the visitor may already have scrolled.
  const landedOn = useRef(pathname);
  useEffect(() => {
    if (pathname === landedOn.current && isStaticBoot()) return;
    landedOn.current = null;
    setStaticBoot(false);
    scrollToTop();
  }, [pathname]);

  // Sections that render late (content-visibility, lazy pages, webfonts)
  // change the page's height; scroll entrances are measured against it.
  useEffect(() => {
    let t;
    const ro = new ResizeObserver(() => {
      clearTimeout(t);
      // `true`: wait for scrolling to stop, so re-measuring never interrupts it.
      t = setTimeout(() => ScrollTrigger.refresh(true), 150);
    });
    ro.observe(document.getElementById('main'));
    return () => {
      clearTimeout(t);
      ro.disconnect();
    };
  }, []);

  // Analytics (only if IDs are configured) and one page view per route.
  useEffect(() => { initTracking(); }, []);
  useEffect(() => {
    // After the route's title has been set by usePageMeta.
    const t = setTimeout(() => trackPageView(pathname), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Once this page has fully loaded and the browser is idle, fetch the other
  // routes' code so clicks are instant. Not on slow or data-saving
  // connections, where it would compete with the page itself.
  useEffect(() => {
    // Nor while the build is saving this page as HTML (an automated browser):
    // the saved file should link only the code this page needs.
    if (navigator.webdriver) return;
    const c = navigator.connection;
    if (c && (c.saveData || /2g|3g/.test(c.effectiveType || ''))) return;
    let id;
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2500));
    const go = () => {
      id = idle(() => Object.entries(lazyPages).forEach(([k, load]) => k !== 'admin' && load().catch(() => {})));
    };
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
    return () => {
      window.removeEventListener('load', go);
      if (id) (window.cancelIdleCallback || clearTimeout)(id);
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navigation minimal={minimal} />
      <main id="main">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
