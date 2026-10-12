import { useEffect, useState } from 'react';
import { isMotionPaused, setMotionPaused } from '../../lib/motion.js';

/** Footer control that pauses or resumes every looping animation on the site. */
export default function MotionToggle() {
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    setPaused(isMotionPaused());
    const on = (e) => setPaused(e.detail);
    window.addEventListener('motionpause', on);
    return () => window.removeEventListener('motionpause', on);
  }, []);
  return (
    <button type="button" className="motion-toggle" aria-pressed={paused} onClick={() => setMotionPaused(!paused)}>
      <span aria-hidden="true" className="motion-toggle__icon">{paused ? '▶' : '❚❚'}</span>
      {paused ? 'Play animations' : 'Pause animations'}
    </button>
  );
}
