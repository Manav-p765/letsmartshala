import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotion } from '../lib/motion.js';

gsap.registerPlugin(ScrollTrigger);

// Entrances play once and the trigger retires itself.
const ONCE = { toggleActions: 'play none none none', once: true };

/**
 * Scroll entrances for one section. Put the returned ref on the section;
 * every [data-animate] inside it gets its trigger when the section mounts
 * and loses it when the section unmounts (route change or hot reload).
 *
 * Nothing is hidden by CSS. GSAP sets the "before" state itself in a layout
 * effect (so before first paint), which means if JS fails or motion is
 * reduced, content simply shows — it can never get stuck invisible.
 *
 *   data-animate="fade-up"  element rises in
 *   data-animate="lines"    each .line-mask > * rises out of its mask, in turn
 *   data-animate="stagger"  children rise in one after another
 *   data-animate="in"       gets class .is-in once (CSS does the rest)
 */
export default function useReveal() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const all = (sel) => gsap.utils.toArray(root.querySelectorAll(sel));

    if (prefersReducedMotion()) {
      all('[data-animate="in"]').forEach((el) => el.classList.add('is-in'));
      return;
    }

    const ctx = gsap.context(() => {
      all('[data-animate="fade-up"]').forEach((el) => {
        gsap.from(el, {
          y: 32, autoAlpha: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', ...ONCE }
        });
      });
      all('[data-animate="lines"]').forEach((group) => {
        gsap.from(group.querySelectorAll('.line-mask > *'), {
          yPercent: 110, duration: 1.1, stagger: 0.1, ease: 'power4.out',
          scrollTrigger: { trigger: group, start: 'top 88%', ...ONCE }
        });
      });
      all('[data-animate="stagger"]').forEach((group) => {
        gsap.from(group.children, {
          y: 36, autoAlpha: 0, duration: 0.85, stagger: 0.09, ease: 'power3.out',
          scrollTrigger: { trigger: group, start: 'top 88%', ...ONCE }
        });
      });
      all('[data-animate="in"]').forEach((el) => {
        ScrollTrigger.create({
          trigger: el, start: 'top 80%', once: true,
          onEnter: () => el.classList.add('is-in')
        });
      });
    }, root);

    // Webfonts shift layout when they land, which moves every start point.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => ctx.revert();
  }, []);

  return ref;
}
