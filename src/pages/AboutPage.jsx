import PageHero from '../components/ui/PageHero.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { about } from '../data/pages.js';
import './Pages.css';

/** What SmartShala believes, without invented history or numbers. */
export default function AboutPage() {
  usePageMeta({ title: 'About', description: about.meta, path: '/about' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="about-title" eyebrow={about.eyebrow} title={about.title} lede={about.lede} />

      <section className="section" data-theme="white" aria-label="What we believe">
        <div className="container">
          <ol className="about-beliefs" data-animate="stagger">
            {about.beliefs.map((b, i) => (
              <li className="card" key={b.title}>
                <span className="num">{String(i + 1).padStart(2, '0')}</span>
                <h3>{b.title}</h3>
                <p>{b.text}</p>
              </li>
            ))}
          </ol>
          <p className="about-company">{about.company}</p>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
