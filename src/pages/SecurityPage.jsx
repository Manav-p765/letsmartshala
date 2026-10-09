import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { securityPage } from '../data/pages.js';
import './Pages.css';

/** Only what the CRM's code shows; hosting region, backups and certifications are asked, not claimed. */
export default function SecurityPage() {
  usePageMeta({ title: 'Security & data', description: securityPage.meta, path: '/security' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="security-title" eyebrow={securityPage.eyebrow} title={securityPage.title} lede={securityPage.lede} />

      <section className="section" data-theme="white" aria-label="How your data is protected">
        <div className="container">
          <ul className="sec-grid" data-animate="stagger">
            {securityPage.points.map((p) => (
              <li className="card" key={p.title}>
                <span className="icon-tile"><ModuleIcon name={p.icon} /></span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ul>
          <p className="sec-note" data-animate="fade-up">
            {securityPage.note} <Link to="/contact">Contact us</Link>.
          </p>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
