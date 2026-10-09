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
 *
 * Roots can nest (a page wrapper around a shared section like CtaBand):
 * each root only animates elements whose nearest root is itself, so no
 * element is ever animated twice — a second gsap.from() would start from
 * the first one's hidden state and leave it invisible.
 */
export default function useReveal() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    root.setAttribute('data-reveal-root', '');
    const all = (sel) =>
      gsap.utils.toArray(root.querySelectorAll(sel)).filter((el) => el.closest('[data-reveal-root]') === root);

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
    }, root);

    // "in" uses an IntersectionObserver rather than ScrollTrigger, so pins
    // and late layout shifts elsewhere on the page can't stop it firing.
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -15% 0px' });
    all('[data-animate="in"]').forEach((el) => io.observe(el));

    // Webfonts shift layout when they land, which moves every start point.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      ctx.revert();
      io.disconnect();
    };
  }, []);

  return ref;
}
