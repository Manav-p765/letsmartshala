/**
 * /about — the SmartShala story told in 3D (AboutStory), then how we build
 * it and real recent releases, then the demo ask.
 */
import AboutStory from '../components/About3D/AboutStory.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { aboutMeta, principles, releases } from '../data/about.js';
import { site } from '../data/site.js';
import './Pages.css';
import './About.css';

const Lines = ({ lines }) => lines.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>);

export default function AboutPage() {
  usePageMeta({ title: aboutMeta.title, description: aboutMeta.description, path: '/about' });
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      <AboutStory />

      <section className="section ab-principles" data-theme="white" aria-labelledby="principles-title">
        <div className="container">
          <header className="ab-head">
            <p className="label ab-eyebrow" data-animate="fade-up">{principles.eyebrow}</p>
            <h2 className="display block-title" id="principles-title" data-animate="lines"><Lines lines={principles.title} /></h2>
          </header>
          <ol className="ab-principle-grid" data-animate="stagger">
            {principles.items.map((p) => (
              <li key={p.n} className="ab-principle">
                <span className="ab-principle__n">{p.n}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section ab-releases" data-theme="paper" aria-labelledby="releases-title">
        <div className="container ab-releases__grid">
          <header className="ab-head">
            <p className="label ab-eyebrow" data-animate="fade-up">{releases.eyebrow}</p>
            <h2 className="display block-title" id="releases-title" data-animate="lines"><Lines lines={releases.title} /></h2>
            <p className="lede" data-animate="fade-up">{releases.lede}</p>
            <p className="ab-company" data-animate="fade-up">SmartShala is a product of {site.legalName}.</p>
          </header>
          <ol className="ab-timeline" data-animate="in">
            {releases.items.map((r, i) => (
              <li key={r.title} style={{ '--i': i }}>
                <span className="ab-timeline__dot" aria-hidden="true" />
                <span className="ab-timeline__when">{r.when}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
