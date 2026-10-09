import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import useReveal from '../../hooks/useReveal.js';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import { prefersReducedMotion } from '../../lib/motion.js';
import { desks } from '../../data/home.js';
import { clockAt, dayFraction } from '../../data/dayArc.js';
import './Desks.css';

/**
 * Four roles, four desks. Each card opens with a tiny live preview of that
 * person's screen, which plays once when the card is properly on screen
 * (after the card itself has faded in):
 *   principal  — today's three numbers count up as their bars fill
 *   admin      — a student list imports, the counter ticks to 412, then done
 *   teacher    — a roll call marks itself row by row, then the tally shows
 *   accountant — the amount counts up, PAID is stamped, the PDF is ready
 * Sample data throughout; reduced motion shows each preview finished.
 */

const inr = (v) => '₹' + Math.round(v).toLocaleString('en-IN');

/** Counts from 0 to `to` once `on` turns true, after `delay` seconds. */
function Count({ to, on, format = (v) => String(Math.round(v)), delay = 0, duration = 1.1 }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!on || prefersReducedMotion()) {
      el.textContent = format(on || prefersReducedMotion() ? to : 0);
      return;
    }
    const o = { v: 0 };
    const tw = gsap.to(o, { v: to, delay, duration, ease: 'power2.out', onUpdate: () => (el.textContent = format(o.v)) });
    return () => tw.kill();
  }, [on, to, delay, duration, format]);
  return <span ref={ref}>{format(0)}</span>;
}

/** True once the element is 60% on screen. */
function useOnScreen() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (prefersReducedMotion()) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setOn(true);
      io.disconnect();
    }, { threshold: 0.6 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, on];
}

const fmtStaff = (v) => `${Math.round(v)}/41`;
const fmtPct = (v) => `${Math.round(v)}%`;
const fmtLakh = (v) => `₹${v.toFixed(2)}L`;
const fmtImport = (v) => `${Math.round(v)} / 412`;

const previews = {
  principal: (on) => (
    <div className="pv pv-principal">
      {[['Staff in', 38, fmtStaff, 0.93], ['Attendance', 94, fmtPct, 0.94], ['Fees today', 1.84, fmtLakh, 0.72]].map(([k, v, f, p], i) => (
        <div key={k} style={{ '--p': p, '--i': i }}>
          <span>{k}</span>
          <strong><Count to={v} on={on} format={f} delay={0.55 + i * 0.15} /></strong>
          <i />
        </div>
      ))}
    </div>
  ),
  admin: (on) => (
    <div className="pv pv-admin">
      <div className="pv-admin__file"><ModuleIcon name="students" /><span>students_2026.xlsx</span></div>
      <div className="pv-admin__bar"><i /></div>
      <div className="pv-admin__row">
        <span className="pv-admin__status"><span>Importing records</span><span>✓ Import complete</span></span>
        <strong><Count to={412} on={on} format={fmtImport} delay={0.7} duration={1.6} /></strong>
      </div>
    </div>
  ),
  teacher: () => (
    <div className="pv pv-teacher">
      <span className="pv-teacher__head">7-B · Period 1</span>
      {[['Aarav', 'P'], ['Ananya', 'P'], ['Arjun', 'A'], ['Diya', 'P']].map(([n, m], i) => (
        <div key={n} style={{ '--i': i }}><span>{n}</span><b className={`is-${m}`}>{m}</b></div>
      ))}
      <span className="pv-teacher__sum">3 present · 1 absent · saved</span>
    </div>
  ),
  accountant: (on) => (
    <div className="pv pv-accountant">
      <div className="pv-accountant__top"><span>Receipt R-2041</span><span>UPI</span></div>
      <strong><Count to={12500} on={on} format={inr} delay={0.55} duration={1} /></strong>
      <span className="pv-accountant__who">Aarav Sharma · Term 2</span>
      <span className="pv-accountant__pdf"><ModuleIcon name="receipt" />Receipt PDF ready</span>
      <span className="pv-accountant__stamp">Paid</span>
    </div>
  )
};

function Desk({ d }) {
  const [ref, on] = useOnScreen();
  return (
    <li className={`desk${on ? ' is-in' : ''}`} ref={ref}>
      <div className="desk__preview" aria-hidden="true">{previews[d.preview](on)}</div>
      <div className="desk__body">
        <div className="desk__top">
          <h3 className="desk__role">{d.role}</h3>
          <time className="desk__time" dateTime={d.time}>{clockAt(dayFraction(d.time))}</time>
        </div>
        <p className="desk__line">{d.line}</p>
        <ul className="desk__points">
          {d.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
      </div>
    </li>
  );
}

export default function Desks() {
  const revealRef = useReveal();
  return (
    <section ref={revealRef} className="section section--screen desks" data-section="02 · Four desks" data-theme="white" aria-labelledby="desks-title">
      <div className="container">
        <header className="desks__head">
          <div>
            <p className="label desks__eyebrow" data-animate="fade-up">{desks.eyebrow}</p>
            <h2 className="display desks__title" id="desks-title" data-animate="lines">
              {desks.title.map((l) => (
                <span className="line-mask" key={l}><span>{l}</span></span>
              ))}
            </h2>
          </div>
          <p className="lede desks__lede" data-animate="fade-up">{desks.lede}</p>
        </header>

        <ol className="desks__grid" data-animate="stagger">
          {desks.items.map((d) => <Desk d={d} key={d.role} />)}
        </ol>
      </div>
    </section>
  );
}
