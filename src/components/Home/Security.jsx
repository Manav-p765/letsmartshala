import SectionHead from '../ui/SectionHead.jsx';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import useReveal from '../../hooks/useReveal.js';
import { security } from '../../data/home.js';
import './Security.css';

/**
 * "Your data, in its own database", drawn rather than told: three schools
 * side by side, each with its own database. In yours, the principal,
 * teacher and accountant send data down into *your* database only — little
 * packets travel the lines — while the neighbours sit behind dashed walls.
 */
const icons = [
  <svg viewBox="0 0 40 40" key="db"><ellipse cx="20" cy="9" rx="12" ry="4" /><path d="M8 9v8c0 2.2 5.4 4 12 4s12-1.8 12-4V9" /><path d="M8 17v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8" /><path d="M8 25v6c0 2.2 5.4 4 12 4s12-1.8 12-4v-6" /></svg>,
  <svg viewBox="0 0 40 40" key="key"><circle cx="13" cy="20" r="7" /><path d="M20 20h14M29 20v5M34 20v4" /></svg>,
  <svg viewBox="0 0 40 40" key="log"><path d="M6 10h18M6 18h14M6 26h10" /><circle cx="28" cy="27" r="7" /><path d="M28 23v4l3 2" /></svg>
];

const Db = () => (
  <svg className="vault__db" viewBox="0 0 40 40" aria-hidden="true"><ellipse cx="20" cy="9" rx="12" ry="4" /><path d="M8 9v8c0 2.2 5.4 4 12 4s12-1.8 12-4V9" /><path d="M8 17v8c0 2.2 5.4 4 12 4s12-1.8 12-4v-8" /><path d="M8 25v6c0 2.2 5.4 4 12 4s12-1.8 12-4v-6" /></svg>
);

export default function Security() {
  const revealRef = useReveal();
  return (
    <section ref={revealRef} className="section section--screen security" data-section="07 · Your data" data-theme="mist" aria-labelledby="security-title">
      <div className="container">
        <div className="security__grid">
          <SectionHead id="security-title" eyebrow={security.eyebrow} title={security.title} lede={security.lede} />

          <div className="vaults" aria-hidden="true" data-animate="in">
            <div className="vault vault--other"><span className="vault__name">School B</span><Db /><span className="vault__lock">Separate</span></div>
            <div className="vault vault--yours">
              <span className="vault__name">Your school</span>
              <div className="vault__roles">
                {[['Principal', 'reports'], ['Teacher', 'homework'], ['Accountant', 'fees']].map(([r, ic], i) => (
                  <span key={r} className="vault__role" style={{ '--i': i }}>
                    <ModuleIcon name={ic} />{r}
                    <i className="vault__line"><b /></i>
                  </span>
                ))}
              </div>
              <Db />
              <span className="vault__tag">Your own database</span>
            </div>
            <div className="vault vault--other"><span className="vault__name">School C</span><Db /><span className="vault__lock">Separate</span></div>
          </div>
        </div>

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
