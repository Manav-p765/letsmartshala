import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Navigation from './Navigation.jsx';
import Footer from './Footer.jsx';
import { setLenis, scrollToTop } from '../lib/smooth.js';
import { prefersReducedMotion } from '../lib/motion.js';
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

  useEffect(() => scrollToTop(), [pathname]);

  // Analytics (only if IDs are configured) and one page view per route.
  useEffect(() => { initTracking(); }, []);
  useEffect(() => {
    // After the route's title has been set by usePageMeta.
    const t = setTimeout(() => trackPageView(pathname), 0);
    return () => clearTimeout(t);
  }, [pathname]);

  // Once the page is idle, fetch the other routes' code so clicks are instant.
  useEffect(() => {
    const idle = window.requestIdleCallback || ((cb) => setTimeout(cb, 2500));
    const id = idle(() => Object.values(lazyPages).forEach((load) => load().catch(() => {})));
    return () => (window.cancelIdleCallback || clearTimeout)(id);
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
