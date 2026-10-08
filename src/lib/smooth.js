/**
 * Lenis singleton. Layout owns its lifecycle; everything else goes through
 * these helpers so links still work when Lenis is off (reduced motion).
 */
let lenis = null;

export const setLenis = (instance) => { lenis = instance; };
export const getLenis = () => lenis;

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

export const stopScroll = () => lenis?.stop();
export const startScroll = () => lenis?.start();
