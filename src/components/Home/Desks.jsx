import SectionHead from '../ui/SectionHead.jsx';
import MiniArc from '../ui/MiniArc.jsx';
import { desks } from '../../data/home.js';
import { clockAt, dayFraction } from '../../data/dayArc.js';
import './Desks.css';

/** Four roles, each pinned to the moment of the day they're busiest. */
export default function Desks() {
  return (
    <section className="section desks" data-theme="white" aria-labelledby="desks-title">
      <div className="container">
        <SectionHead id="desks-title" eyebrow={desks.eyebrow} title={desks.title} lede={desks.lede} />
        <ol className="desks__grid" data-animate="stagger">
          {desks.items.map((d) => (
            <li className="desk" key={d.role}>
              <div className="desk__top">
                <MiniArc time={d.time} />
                <time className="desk__time" dateTime={d.time}>{clockAt(dayFraction(d.time))}</time>
              </div>
              <h3 className="desk__role">{d.role}</h3>
              <p className="desk__line">{d.line}</p>
              <ul className="desk__points">
                {d.points.map((p) => <li key={p}>{p}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
