import { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion.js';

/**
 * Steps through `count` items once, `ms` apart, starting when the element
 * behind the returned ref is well into view. It never loops: it stops on
 * the last item, and stops for good the moment the visitor picks one.
 * Nothing is tied to scroll position, so the page scrolls normally.
 *
 * Reduced motion: no autoplay; starts on `restIndex` (default 0).
 */
export default function useAutoStep(count, ms, { restIndex = 0, startIndex = 0 } = {}) {
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
    const tick = () => {
      if (manual.current) return;
      setIndex((i) => {
        const next = Math.min(count - 1, i + 1);
        if (next < count - 1 && !manual.current) timer = setTimeout(tick, ms);
        return next;
      });
    };
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || manual.current) return;
      io.disconnect();
      timer = setTimeout(tick, ms);
    }, { threshold: 0.45 });
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timer);
    };
  }, [count, ms, restIndex]);

  const choose = useCallback((i) => {
    manual.current = true;
    setIndex(i);
  }, []);

  return [ref, index, choose];
}
