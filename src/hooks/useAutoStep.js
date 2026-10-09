import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * Steps through `count` items once, `ms` apart, starting when the element
 * behind the returned ref is well into view: `threshold` of it showing, or,
 * for an element taller than the screen, 70% of the screen filled by it.
 * It never loops: it stops on the last item, and stops for good the moment
 * the visitor picks one. Nothing is tied to scroll position, so the page
 * scrolls normally.
 *
 * Reduced motion: no autoplay; starts on `restIndex` (default 0).
 */
export default function useAutoStep(count, ms, { restIndex = 0, startIndex = 0, threshold = 0.45 } = {}) {
  const ref = useRef(null);
  const [index, setIndex] = useState(startIndex);
  const manual = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setIndex(restIndex);
      return;
    }
    let timer = 0;
    let at = startIndex;
    const tick = () => {
      if (manual.current) return;
      at = Math.min(count - 1, at + 1);
      setIndex(at);
      if (at < count - 1) timer = setTimeout(tick, ms);
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || manual.current) return;
      const fills = e.intersectionRect.height >= 0.7 * (e.rootBounds?.height ?? window.innerHeight);
      if (e.intersectionRatio < threshold - 0.01 && !fills) return;
      io.disconnect();
      timer = setTimeout(tick, ms);
    }, { threshold: [0, 0.2, 0.4, 0.45, 0.6, 0.8, 0.9, 0.95, 1] });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [count, ms, restIndex, startIndex, threshold]);

  const choose = useCallback((i) => {
    manual.current = true;
    setIndex(i);
  }, []);

  return [ref, index, choose];
}
