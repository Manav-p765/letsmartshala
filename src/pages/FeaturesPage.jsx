import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { features } from '../data/pages.js';
import './Pages.css';

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

/** Every module, grouped, with a jump bar at the top. */
export default function FeaturesPage() {
  usePageMeta({ title: 'Features', description: features.meta, path: '/features' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="features-title" eyebrow={features.eyebrow} title={features.title} lede={features.lede}>
        <nav className="feat-jump" aria-label="Jump to a module">
          {features.groups.map((g) => (
            <a key={g.name} href={`#${slug(g.name)}`}><ModuleIcon name={g.icon} />{g.name}</a>
          ))}
        </nav>
      </PageHero>

      <section className="section" data-theme="white" aria-label="All modules">
        <div className="container feat-grid" data-animate="stagger">
          {features.groups.map((g) => (
            <article className="card feat-card" id={slug(g.name)} key={g.name}>
              <span className="icon-tile"><ModuleIcon name={g.icon} /></span>
              <h2 className="feat-card__name"><span>{g.name}</span></h2>
              <p style={{ gridColumn: 2 }}>{g.text}</p>
              <ul className="checks">{g.items.map((i) => <li key={i}>{i}</li>)}</ul>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
