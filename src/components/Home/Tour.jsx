/**
 * MODULES TOUR — the product, one module at a time.
 *
 * What the viewer sees: the section pins to the screen. On the left, the
 * module list with a progress rail; on the right, a SmartShala app window.
 * The tour moves through the modules — Fees, Attendance, Exams, Students,
 * Transport, Payroll — and the window changes to that screen: rows slide in,
 * numbers count up, bars fill, the sidebar highlights the module.
 *
 * Desktop: the section pins and the scroll moves through the modules, then
 * lets go (the owner asked for this). Phones: the window plays through the
 * modules once when in view, then rests. Clicking a module takes over.
 */
import { useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReveal from '../../hooks/useReveal.js';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import { Mark } from '../Brand/Brand.jsx';
import { tour, tourHead, tourMore } from '../../data/tour.js';
import useAutoStep from '../../hooks/useAutoStep.js';
import './Tour.css';

gsap.registerPlugin(ScrollTrigger);

const PIN_MQ = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';

const inr = (n) => '₹' + Math.round(n).toLocaleString('en-IN');

/** Counts up to `value` whenever `active` turns on. */
function Count({ value, money, active }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const fmt = (v) => (money ? inr(v) : String(Math.round(v)));
    if (!active || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = fmt(value);
      return;
    }
    const o = { v: 0 };
    const tw = gsap.to(o, { v: value, duration: 1.2, ease: 'power2.out', onUpdate: () => (el.textContent = fmt(o.v)) });
    return () => tw.kill();
  }, [active, value, money]);
  return <span ref={ref} />;
}

/* ---- One sketch per module. `--r` staggers each row's entrance. ---- */
function FeesScreen({ s, active }) {
  return (
    <>
      <div className="scr__kpis">
        {s.kpis.map((k) => (
          <div className="scr__kpi" key={k.label}>
            <span>{k.label}</span>
            <strong><Count value={k.value} money={k.money} active={active} /></strong>
          </div>
        ))}
      </div>
      <div className="scr__meter"><span style={{ '--p': s.progress }} /><em>{Math.round(s.progress * 100)}% of term target</em></div>
      <table className="scr__table">
        <thead><tr><th>Student</th><th>Class</th><th>Mode</th><th>Amount</th><th>Receipt</th></tr></thead>
        <tbody>
          {s.rows.map((r, i) => (
            <tr key={r[4]} style={{ '--r': i }}>
              <td>{r[0]}</td><td>{r[1]}</td><td><span className="tag">{r[2]}</span></td><td>{r[3]}</td><td className="mono">{r[4]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function AttendanceScreen({ s }) {
  return (
    <div className="scr__split">
      <ul className="scr__roster">
        {s.students.map(([n, st], i) => (
          <li key={n} style={{ '--r': i }}>
            <span>{n}</span>
            <span className="scr__marks">
              {['P', 'A', 'L', 'H'].map((m) => (
                <i key={m} className={m === st ? `on is-${m}` : ''}>{m}</i>
              ))}
            </span>
          </li>
        ))}
      </ul>
      <div className="scr__side">
        {s.summary.map(([l, v]) => (
          <div className="scr__kpi" key={l}><span>{l}</span><strong>{v}</strong></div>
        ))}
        <div className="scr__card">
          <span className="scr__label">Not marked yet</span>
          {s.pending.map((p) => <p key={p}>{p}</p>)}
          <button type="button" tabIndex={-1} className="scr__btn">{s.action}</button>
        </div>
      </div>
    </div>
  );
}

function ExamsScreen({ s }) {
  const grade = (m) => (m >= 36 ? 'A1' : m >= 32 ? 'A2' : m >= 28 ? 'B1' : 'B2');
  return (
    <>
      <table className="scr__table scr__table--marks">
        <thead><tr><th>Student</th>{s.subjects.map((x) => <th key={x}>{x}</th>)}<th>Grade</th></tr></thead>
        <tbody>
          {s.rows.map(([n, marks], i) => {
            const avg = marks.reduce((a, b) => a + b, 0) / marks.length;
            return (
              <tr key={n} style={{ '--r': i }}>
                <td>{n}</td>
                {marks.map((m, j) => (
                  <td key={j}><span className="scr__score" style={{ '--p': m / 40 }}>{m}</span></td>
                ))}
                <td><span className="tag tag--ok">{grade(avg)}</span></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="scr__foot"><button type="button" tabIndex={-1} className="scr__btn">{s.action}</button><span>Report-card PDFs for the whole class</span></div>
    </>
  );
}

function StudentScreen({ s }) {
  return (
    <div className="scr__profile">
      <div className="scr__who" style={{ '--r': 0 }}>
        <span className="scr__avatar">{s.name.split(' ').map((p) => p[0]).join('')}</span>
        <div><strong>{s.name}</strong><span>{s.meta}</span></div>
      </div>
      <div className="scr__tabs" style={{ '--r': 1 }}>{s.tabs.map((t, i) => <span key={t} className={i === 0 ? 'on' : ''}>{t}</span>)}</div>
      <div className="scr__fields">
        {s.fields.map(([k, v], i) => (
          <div key={k} style={{ '--r': i + 2 }}><span>{k}</span><strong>{v}</strong></div>
        ))}
      </div>
      <div className="scr__kpis">
        {s.stats.map(([k, v]) => <div className="scr__kpi" key={k}><span>{k}</span><strong>{v}</strong></div>)}
      </div>
    </div>
  );
}

function TransportScreen({ s }) {
  return (
    <div className="scr__split">
      <ol className="scr__route">
        {s.stops.map(([name, time, n], i) => (
          <li key={name} style={{ '--r': i }}>
            <i />
            <div><strong>{name}</strong><span>{time}</span></div>
            {n > 0 && <span className="tag">{n} students</span>}
          </li>
        ))}
      </ol>
      <div className="scr__side">
        <div className="scr__kpi"><span>Students assigned</span><strong>{s.assigned}</strong></div>
        <div className="scr__kpi"><span>Stops</span><strong>{s.stops.length}</strong></div>
        <div className="scr__kpi"><span>Transport fee</span><strong>Added to ledgers</strong></div>
      </div>
    </div>
  );
}

function PayrollScreen({ s }) {
  return (
    <>
      <table className="scr__table">
        <thead><tr><th>Staff</th><th>Role</th><th>Days present</th><th>Slip</th></tr></thead>
        <tbody>
          {s.rows.map((r, i) => (
            <tr key={r[0]} style={{ '--r': i }}>
              <td>{r[0]}</td><td>{r[1]}</td>
              <td><span className="scr__days" style={{ '--p': Number(r[2].split(' / ')[0]) / 25 }}>{r[2]}</span></td>
              <td><span className={`tag ${r[3] === 'Generated' ? 'tag--ok' : 'tag--warn'}`}>{r[3]}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="scr__foot"><button type="button" tabIndex={-1} className="scr__btn">{s.action}</button><span>Shifts and punch-ins feed the calculation</span></div>
    </>
  );
}

const screens = { fees: FeesScreen, attendance: AttendanceScreen, exams: ExamsScreen, students: StudentScreen, transport: TransportScreen, payroll: PayrollScreen };

export default function Tour() {
  const revealRef = useReveal();
  // Phones: plays through the modules once when the section is in view, then
  // rests; clicking a module takes over.
  const [stepRef, active, choose] = useAutoStep(tour.length, 4200, { threshold: 0.9 });

  const setRefs = (el) => { revealRef.current = el; stepRef.current = el; };
  const go = choose;

  // Desktop: the section pins (the owner asked for this, as with Flow) and
  // the scroll moves through the modules, half a screen each, then lets go.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(PIN_MQ, () => {
      const el = revealRef.current;
      el.classList.add('is-scrubbed');
      choose(0);   // also switches the autoplay off for good
      let last = 0;
      const n = tour.length - 1;
      ScrollTrigger.create({
        trigger: el,
        pin: true,
        start: () => (el.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
        end: () => '+=' + n * window.innerHeight * 0.5,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const s = Math.min(n, Math.floor(progress * n + 0.35));
          if (s !== last) choose((last = s));
        }
      });
      return () => el.classList.remove('is-scrubbed');
    });
    return () => mm.revert();
  }, [revealRef, choose]);

  const cur = tour[active];

  return (
    <section ref={setRefs} className="section section--screen tour" data-section="04 · Module tour" data-theme="paper" aria-labelledby="tour-title">
      <div className="container tour__grid">
        <div className="tour__left">
          <p className="label tour__eyebrow" data-animate="fade-up">{tourHead.eyebrow}</p>
          <h2 className="display tour__title" id="tour-title" data-animate="lines">
            {tourHead.title.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>)}
          </h2>

          <ol className="tour__list" style={{ '--a': active, '--n': tour.length }}>
            {tour.map((m, i) => (
              <li key={m.id}>
                <button type="button" className={`tour__item${i === active ? ' is-active' : ''}`} onClick={() => go(i)} aria-pressed={i === active}>
                  <span className="tour__icon"><ModuleIcon name={m.icon} /></span>
                  <span className="tour__text">
                    <strong>{m.name}</strong>
                    <span>{m.line}</span>
                    {i === active && <i className="tour__timer" key={active} aria-hidden="true" />}
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <p className="tour__more"><span className="label">Also included</span> {tourMore.join(' · ')}</p>
        </div>

        <div className="tour__window" aria-live="polite">
          <div className="win">
            <div className="win__bar"><i /><i /><i /><span>app.smartshala · {cur.name}</span></div>
            <div className="win__body">
              <aside className="win__side" aria-hidden="true">
                <span className="win__logo"><Mark /></span>
                {tour.map((m, i) => (
                  <span key={m.id} className={`win__nav${i === active ? ' on' : ''}`}><ModuleIcon name={m.icon} /></span>
                ))}
              </aside>
              <div className="win__main">
                {tour.map((m, i) => {
                  const Screen = screens[m.id];
                  const on = i === active;
                  return (
                    <div key={m.id} className={`scr${on ? ' is-active' : ''}`} aria-hidden={!on}>
                      <header className="scr__head">
                        <div>
                          <h3>{m.screen.title || m.screen.name}</h3>
                          <span>{m.screen.sub || m.name}</span>
                        </div>
                        {m.screen.action && m.id === 'fees' && <button type="button" tabIndex={-1} className="scr__btn">{m.screen.action}</button>}
                      </header>
                      <Screen s={m.screen} active={on} />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          {/* A notification for the module on screen; re-keyed so it pops in each time. */}
          <div className="tour__note" key={cur.id} aria-hidden="true">
            <span className="tour__note-icon"><ModuleIcon name={cur.icon} /></span>
            <span><strong>{cur.note[0]}</strong><em>{cur.note[1]}</em></span>
          </div>
        </div>
      </div>
    </section>
  );
}
