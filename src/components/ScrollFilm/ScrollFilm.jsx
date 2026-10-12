/**
 * The story film, driven by scroll.
 *
 * A tall section with the film pinned (CSS sticky) in the middle of the
 * screen; as the visitor scrolls through it, scroll progress picks the
 * film's frame and posts it into the iframe, which draws exactly that
 * frame (the film's draw(frame) is pure, so scrubbing is instant both ways).
 * The chapter caption under the frame and a progress rail follow along.
 *
 * Sound can't follow a scrub, so "Watch with sound" opens the film on its
 * own page, and the MP4 is offered for sharing.
 *
 * Reduced motion: no pinning (a pinned, scroll-driven scene is a vestibular
 * trigger) — the film sits in a normal frame with its own Play button.
 */
import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion, isMotionPaused } from '../../lib/motion.js';
import { stopScroll, startScroll } from '../../lib/smooth.js';
import './ScrollFilm.css';

const STORY = 47.5;            // the film's story-seconds (chapters and captions are in these)
const CHAPTERS = [
  [0, 'Paper registers'], [5, 'One student'], [10, 'Five copies'], [17.5, 'Things drift'],
  [25, 'One place'], [30, 'One record'], [35, 'Everyone connected'], [42.5, 'SmartShala']
];

/** The film's own captions [from, to, text] (kept in step with public/film/smartshala-story.html),
 *  shown as readable text under the frame on phones, where the in-film captions are tiny. */
const CAPTIONS = [[0.9,5,"Why is the school office always catching up?"],[5.6,10,"Aarav joins Class 7-B. The office writes him in."],[10.4,17.5,"Then four more people write him in. Again."],[17.8,20,"Copies drift: Roll 12 here, Roll 21 there."],[20.3,22.5,"The principal waits till evening for today’s fees."],[22.8,25,"Defaulters turn up at the end of term."],[27.8,30,"So we put the whole school in one place."],[30.3,35,"Aarav is written once. Every office reads it."],[37.6,42.3,"Principal, teachers, accountant, office — the same live numbers."]];

export default function ScrollFilm({ src, mp4, title }) {
  const sectionRef = useRef(null);
  const frameRef = useRef(null);
  const [scrubbing, setScrubbing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [watching, setWatching] = useState(false);
  const watchRef = useRef(null);
  const openerRef = useRef(null);

  // "Watch with sound": the film in an overlay on this page, starting with sound.
  // Close with ✕, Esc or a click on the backdrop; focus returns to the link.
  useEffect(() => {
    if (!watching) return;
    stopScroll();
    document.documentElement.style.overflow = 'hidden';
    const onKey = (e) => e.key === 'Escape' && setWatching(false);
    window.addEventListener('keydown', onKey);
    watchRef.current?.querySelector('.sfilm__close')?.focus();
    return () => {
      startScroll();
      document.documentElement.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      openerRef.current?.focus();
    };
  }, [watching]);
  const startWithSound = (e) => e.currentTarget.contentWindow?.postMessage({ smartshalaFilm: true, play: true }, location.origin);

  // Reduced motion (normal player): tell the film when it is on screen and
  // whether "Pause animations" is on, so its silent preview stops when unseen.
  useEffect(() => {
    if (!prefersReducedMotion()) return;
    const iframe = frameRef.current;
    let visible = false;
    const send = () => iframe.contentWindow?.postMessage({ smartshalaFilm: true, run: visible && !isMotionPaused() }, location.origin);
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; send(); }, { threshold: 0.15 });
    io.observe(iframe);
    iframe.addEventListener('load', send);
    window.addEventListener('motionpause', send);
    return () => { io.disconnect(); iframe.removeEventListener('load', send); window.removeEventListener('motionpause', send); };
  }, []);

  // Scroll-scrubbed mode.
  useEffect(() => {
    if (prefersReducedMotion()) return;
    setScrubbing(true);
    const section = sectionRef.current;
    const iframe = frameRef.current;
    let raf = 0;
    let last = -1;
    let ready = false;

    const post = (frame) => iframe.contentWindow?.postMessage({ smartshalaFilm: true, frame }, location.origin);
    const tick = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      const travel = Math.max(1, r.height - window.innerHeight);
      const p = Math.min(1, Math.max(0, -r.top / travel));
      // The film reports its own frame count (it plays faster than story time).
      const frames = iframe.contentWindow?.FRAMES || 1018;
      const frame = Math.round(p * (frames - 1));
      if (frame !== last && ready) { last = frame; post(frame); setProgress(p); }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(tick); };
    const onLoad = () => { ready = true; last = -1; tick(); };

    iframe.addEventListener('load', onLoad);
    // The iframe may already have loaded (cached) before this effect ran.
    try { if (iframe.contentDocument?.readyState === 'complete') onLoad(); } catch { /* not ready */ }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      iframe.removeEventListener('load', onLoad);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const t = progress * STORY;
  const chapter = [...CHAPTERS].reverse().find(([at]) => t >= at)?.[1];
  const say = CAPTIONS.find(([a, z]) => t >= a - 0.4 && t <= z + 0.4)?.[2] || (t >= 42.5 ? 'SmartShala — the whole school day, in one system.' : '');

  return (
    <section ref={sectionRef} className={`sfilm${scrubbing ? ' is-scrub' : ''}`} aria-label="The SmartShala story, an animated film">
      <div className="sfilm__stick">
        <div className="sfilm__frame">
          <iframe ref={frameRef} src={src} title={title} allow="autoplay" />
        </div>
        {scrubbing && <p className="sfilm__say" aria-hidden="true">{say}</p>}
        <div className="sfilm__bar">
          {scrubbing && (
            <div className="sfilm__rail" aria-hidden="true">
              <span className="sfilm__now">{chapter}</span>
              <span className="sfilm__track">
                <i style={{ transform: `scaleX(${progress})` }} />
                {CHAPTERS.map(([at]) => <b key={at} style={{ left: `${(at / STORY) * 100}%` }} className={t >= at ? 'is-past' : ''} />)}
              </span>
            </div>
          )}
          <p className="sfilm__links">
            {scrubbing && <span className="sfilm__hint">Scroll to play the story</span>}
            <button type="button" ref={openerRef} className="sfilm__watch" onClick={() => setWatching(true)}>▶ Watch with sound</button>
            <a href={mp4} download="SmartShala-story.mp4">Download MP4</a>
          </p>
        </div>
      </div>

      {watching && (
        <div className="sfilm__modal" ref={watchRef} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.target === e.currentTarget && setWatching(false)}>
          <div className="sfilm__modal-frame">
            <iframe src={src} title={title} allow="autoplay" onLoad={startWithSound} />
          </div>
          <button type="button" className="sfilm__close" onClick={() => setWatching(false)} aria-label="Close the film">✕ <span>Close</span></button>
        </div>
      )}
    </section>
  );
}
