import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

// Entrances play once and the trigger retires itself, so live triggers
// thin out as the reader goes down the page.
const ONCE = { toggleActions: 'play none none none', once: true };

/**
 * Wires scroll entrances for anything marked data-animate inside the page.
 * Rebuilt per route because every route brings entirely new elements.
 * Reduced motion: CSS already shows [data-animate] at rest; register nothing.
 */
export default function useScrollAnimations(routeKey) {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-animate="fade-up"]').forEach((el) => {
        gsap.fromTo(el, { y: 32, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', ...ONCE }
        });
      });

      // Masked lines inside one group resolve in sequence.
      gsap.utils.toArray('[data-animate="lines"]').forEach((group) => {
        gsap.set(group, { opacity: 1 });
        gsap.fromTo(group.querySelectorAll('.line-mask > *'), { yPercent: 110 }, {
          yPercent: 0, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: group, start: 'top 88%', ...ONCE }
        });
      });

      gsap.utils.toArray('[data-animate="stagger"]').forEach((group) => {
        gsap.set(group, { opacity: 1 });
        gsap.fromTo(group.children, { y: 28, opacity: 0 }, {
          y: 0, opacity: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 88%', ...ONCE }
        });
      });
    });

    // Webfonts shift layout when they land, which moves every start point.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, [routeKey]);
}
