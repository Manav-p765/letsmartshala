import useReveal from '../../hooks/useReveal.js';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import { desks } from '../../data/home.js';
import { clockAt, dayFraction } from '../../data/dayArc.js';
import './Desks.css';

/**
 * Four roles, four desks. Each card opens with a tiny live preview of that
 * person's screen, which plays once as the card scrolls in:
 *   principal  — today's three numbers fill their bars
 *   admin      — a student import runs to 100%
 *   teacher    — a roll call marks itself, one student at a time
 *   accountant — a receipt is stamped PAID
 * Sample data throughout; reduced motion shows each preview finished.
 */
const previews = {
  principal: (
    <div className="pv pv-principal">
      {[['Staff in', '38/41', 0.93], ['Attendance', '94%', 0.94], ['Fees today', '₹1.84L', 0.72]].map(([k, v, p], i) => (
        <div key={k} style={{ '--p': p, '--i': i }}>
          <span>{k}</span><strong>{v}</strong><i />
        </div>
      ))}
    </div>
  ),
  admin: (
    <div className="pv pv-admin">
      <div className="pv-admin__file"><ModuleIcon name="students" /><span>students_2026.xlsx</span></div>
      <div className="pv-admin__bar"><i /></div>
      <div className="pv-admin__row"><span>Importing records</span><strong>412 / 412</strong></div>
    </div>
  ),
  teacher: (
    <div className="pv pv-teacher">
      <span className="pv-teacher__head">7-B · Period 1</span>
      {[['Aarav', 'P'], ['Ananya', 'P'], ['Arjun', 'A'], ['Diya', 'P']].map(([n, m], i) => (
        <div key={n} style={{ '--i': i }}><span>{n}</span><b className={`is-${m}`}>{m}</b></div>
      ))}
    </div>
  ),
  accountant: (
    <div className="pv pv-accountant">
      <div className="pv-accountant__top"><span>Receipt R-2041</span><span>UPI</span></div>
      <strong>₹12,500</strong>
      <span className="pv-accountant__who">Aarav Sharma · Term 2</span>
      <span className="pv-accountant__stamp">Paid</span>
    </div>
  )
};

export default function Desks() {
  const revealRef = useReveal();
  return (
    <section ref={revealRef} className="section section--screen desks" data-theme="white" aria-labelledby="desks-title">
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
          {desks.items.map((d) => (
            <li className="desk" key={d.role} data-animate="in">
              <div className="desk__preview" aria-hidden="true">{previews[d.preview]}</div>
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
          ))}
        </ol>
      </div>
    </section>
  );
}
