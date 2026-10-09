import SectionHead from '../ui/SectionHead.jsx';
import { security } from '../../data/home.js';
import './Security.css';
import useReveal from '../../hooks/useReveal.js';

const icons = [
  // separate databases: three stacked cylinders, one highlighted
  <svg viewBox="0 0 40 40" key="db"><ellipse cx="20" cy="9" rx="12" ry="4" /><path d="M8 9v8c0 2.2 5.4 4 12 4s12-1.8 12-4V9" /><path d="M8 17v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8" /><path d="M8 25v6c0 2.2 5.4 4 12 4s12-1.8 12-4v-6" /></svg>,
  // role access: a key
  <svg viewBox="0 0 40 40" key="key"><circle cx="13" cy="20" r="7" /><path d="M20 20h14M29 20v5M34 20v4" /></svg>,
  // activity log: lines with a clock
  <svg viewBox="0 0 40 40" key="log"><path d="M6 10h18M6 18h14M6 26h10" /><circle cx="28" cy="27" r="7" /><path d="M28 23v4l3 2" /></svg>
];

export default function Security() {
  const revealRef = useReveal();
  return (
    <section ref={revealRef} className="section security" data-theme="navy" aria-labelledby="security-title">
      <div className="container security__grid">
        <SectionHead id="security-title" eyebrow={security.eyebrow} title={security.title} lede={security.lede} />
        <ul className="security__points" data-animate="stagger">
          {security.points.map((p, i) => (
            <li key={p.title}>
              <span className="security__icon" aria-hidden="true">{icons[i]}</span>
              <div>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
