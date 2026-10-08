/** True when the visitor asked for less motion. Read at call time, never cached,
 *  so a change in OS settings is respected on the next navigation. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True for a mouse or trackpad — the only pointers that get hover parallax. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;
