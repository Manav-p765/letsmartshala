/** True when the visitor asked for less motion. Read at call time, never cached,
 *  so a change in OS settings is respected on the next navigation. */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** True for a mouse or trackpad — the only pointers that get hover parallax. */
export const hasFinePointer = () =>
  typeof window !== 'undefined' && window.matchMedia('(pointer: fine)').matches;

/*
 * "Pause animations" (WCAG 2.2.2 Pause, Stop, Hide): the footer button stops
 * every looping animation — marquee, module stream, floating cards, the 3D
 * stage's ambient motion. Stored per visitor and applied before first paint
 * by the inline script in index.html (html.motion-paused).
 */
const KEY = 'ss-motion';
export const isMotionPaused = () =>
  typeof document !== 'undefined' && document.documentElement.classList.contains('motion-paused');

export function setMotionPaused(paused) {
  document.documentElement.classList.toggle('motion-paused', paused);
  try { localStorage.setItem(KEY, paused ? 'paused' : 'on'); } catch { /* storage blocked: still works for this page */ }
  window.dispatchEvent(new CustomEvent('motionpause', { detail: paused }));
}

/*
 * "Static boot": the first page of a visit, when its prerendered HTML was
 * already on screen before the app started. Entrance animations skip
 * anything the visitor can already see (hiding it again just to animate it
 * in would read as a blink). Cleared on the first navigation.
 */
let staticBoot = false;
export const setStaticBoot = (value) => { staticBoot = value; };
export const isStaticBoot = () => staticBoot;

/** True if any part of the element is inside the window right now. */
export const isOnScreen = (el) => {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < window.innerHeight;
};
