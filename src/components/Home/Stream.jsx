/**
 * STREAM — "everything lands on the principal's phone".
 *
 * What the viewer sees: a ribbon of the school's modules — attendance, fees,
 * exams, transport, payroll… — drifting along a long S-curve out of the left
 * edge and slipping in behind a gently floating phone, as if into it. Each time one lands, the phone's
 * "Today" feed gets that update on top and the numbers at the top tick up,
 * so over one pass the principal's day fills in. After the day is complete
 * the feed stops changing; the ribbon keeps drifting quietly.
 *
 * The motion is CSS offset-path (one keyframe per tile, cheap), started only
 * while the section is on screen. A tile finishing its run fires
 * `animationiteration`, which is exactly when it lands — so the feed and the
 * ribbon can't drift apart. Reduced motion: tiles rest along the curve and
 * the phone shows the finished day.
 */
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import SectionHead from '../ui/SectionHead.jsx';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import useReveal from '../../hooks/useReveal.js';
import { stream } from '../../data/stream.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import './Stream.css';

const GAP_S = 2.1;                        // seconds between landings
const RUN_S = GAP_S * stream.length;      // one tile's trip along the curve
const FEED_MAX = 5;
const NARROW = '(max-width: 900px)';

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/**
 * Desktop: in from the left edge along the bottom, *under* the copy (so no
 * tile ever crosses the text), then a smooth rise and a dive into the
 * phone's screen. Narrow: a short swoop from the left into the phone.
 */
function buildPath(w, h, phone, copy, narrow) {
  // The ribbon ends behind the phone, so tiles slip in under its bezel.
  const ex = phone.x + phone.w * 0.5;
  const ey = phone.y + phone.h * (narrow ? 0.22 : 0.3);
  if (narrow) {
    // A wide loop over the phone: in from the left, across to the right
    // edge, then back down into the screen — long enough to keep tiles apart.
    const top = phone.y - 150;
    return `M -60 ${top + 40} C ${w * 0.55} ${top - 90}, ${w + 30} ${top + 10}, ${ex} ${ey}`;
  }
  const yb = Math.min(h - 46, Math.max(copy.b + 70, h * 0.84));   // the low lane
  const c2 = { x: copy.r - 40, y: yb + 6 };
  const p = { x: copy.r + 60, y: yb - 24 };                        // where it starts to rise
  const c3 = { x: p.x + (p.x - c2.x) * 1.6, y: p.y + (p.y - c2.y) * 1.6 }; // same tangent: no kink
  const c4 = { x: ex - w * 0.06, y: ey - h * 0.42 };
  return [
    `M -160 ${yb}`,
    `C ${copy.r * 0.45} ${yb + 4}, ${c2.x} ${c2.y}, ${p.x} ${p.y}`,
    `C ${c3.x} ${c3.y}, ${c4.x} ${c4.y}, ${ex} ${ey}`
  ].join(' ');
}

export default function Stream() {
  const revealRef = useReveal();
  const stageRef = useRef(null);
  const phoneRef = useRef(null);
  const statRefs = { staff: useRef(null), attendance: useRef(null), fees: useRef(null) };
  const feesBarRef = useRef(null);
  const [path, setPath] = useState('');
  const [feed, setFeed] = useState([]);
  const landed = useRef(0);
  const reduced = useRef(false);

  // ---- Fit the curve to the stage and the phone ----
  const measure = useCallback(() => {
    const stage = stageRef.current;
    const s = stage.getBoundingClientRect();
    const p = phoneRef.current.getBoundingClientRect();
    const phone = { x: p.left - s.left, y: p.top - s.top, w: p.width, h: p.height };
    const kids = [...stage.querySelector('.stream__copy').children].map((el) => el.getBoundingClientRect());
    const copy = {
      r: Math.max(...kids.map((r) => r.right)) - s.left,
      b: Math.max(...kids.map((r) => r.bottom)) - s.top
    };
    setPath(buildPath(s.width, s.height, phone, copy, window.matchMedia(NARROW).matches));
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageRef.current);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [measure]);

  // ---- Reduced motion: show the finished day straight away ----
  useLayoutEffect(() => {
    reduced.current = prefersReducedMotion();
    if (!reduced.current) return;
    setFeed(stream.map((item, key) => ({ ...item, key })).slice(-FEED_MAX).reverse());
    setStat('staff', 38); setStat('attendance', 94); setStat('fees', 184500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function setStat(key, value, animate = false) {
    const el = statRefs[key].current;
    if (!el) return;
    const fmt = key === 'fees' ? inr : key === 'attendance' ? (v) => `${Math.round(v)}%` : (v) => `${Math.round(v)}/41`;
    if (key === 'fees') feesBarRef.current?.style.setProperty('--p', Math.min(1, value / 240000));
    if (!animate) { el.textContent = fmt(value); return; }
    const from = { v: Number(el.dataset.v || 0) };
    gsap.to(from, { v: value, duration: 1.1, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(from.v)) });
    el.dataset.v = value;
  }

  // ---- A tile landed: add its update to the feed (one day only) ----
  const onLand = (i) => {
    if (reduced.current || landed.current >= stream.length) return;
    landed.current++;
    const item = stream[i];
    setFeed((f) => [{ ...item, key: i }, ...f].slice(0, FEED_MAX));
    if (item.stat) Object.entries(item.stat).forEach(([k, v]) => setStat(k, v, true));
  };

  // ---- Run the ribbon only while the section is on screen ----
  useEffect(() => {
    const stage = stageRef.current;
    const io = new IntersectionObserver(([e]) => stage.classList.toggle('is-running', e.isIntersecting), { threshold: 0.15 });
    io.observe(stage);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={revealRef} className="section stream" data-section="03 · Phone feed" data-theme="mist" aria-labelledby="stream-title">
      <div className="stream__bg" aria-hidden="true" />
      <div className="stream__stage" ref={stageRef}>
        <div className="container stream__copy">
          <SectionHead
            id="stream-title"
            eyebrow="On the principal’s phone"
            title={['Everything the school does,', 'lands in one place.']}
            lede="Every module feeds the same live picture. The principal sees the day as it happens — on the web, or in the principal app. Teachers get an app of their own."
          />
          <ul className="stream__chips" data-animate="stagger">
            <li>Web app</li>
            <li>Principal app</li>
            <li>Teacher app</li>
          </ul>
        </div>

        <ul className="stream__ribbon" aria-hidden="true" style={{ '--path': path ? `path("${path}")` : 'none' }}>
          {stream.map((t, i) => (
            <li
              key={i}
              className="stream__tile"
              style={{
                '--delay': `${-(RUN_S - (i + 1) * GAP_S)}s`,
                '--run': `${RUN_S}s`,
                '--rest': `${((i + 0.5) / stream.length) * 92}%`
              }}
              onAnimationIteration={() => onLand(i)}
            >
              <span className="stream__icon"><ModuleIcon name={t.icon} /></span>
              {t.label}
            </li>
          ))}
        </ul>

        <div className="stream__phone" ref={phoneRef}>
          <div className="stream__screen">
            <div className="stream__status"><span><i className="stream__live" />Live</span><span>Principal</span></div>
            <p className="stream__hello">Good morning</p>
            <div className="stream__stats">
              <div><span>Staff in</span><strong ref={statRefs.staff}>—</strong></div>
              <div><span>Attendance</span><strong ref={statRefs.attendance}>—</strong></div>
              <div className="wide">
                <span>Fees today</span><strong ref={statRefs.fees}>—</strong>
                <i className="stream__bar" ref={feesBarRef} />
              </div>
            </div>
            <p className="stream__sub">Live feed</p>
            <ol className="stream__feed" aria-live="off">
              {feed.length === 0 && <li className="stream__empty">Waiting for the first bell…</li>}
              {feed.map((f) => (
                <li key={f.key} className="stream__item">
                  <span className="stream__item-icon"><ModuleIcon name={f.icon} /></span>
                  <div>
                    <strong>{f.note}</strong>
                    <span>{f.detail}</span>
                  </div>
                  <time>{f.time}</time>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
