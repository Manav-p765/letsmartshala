/**
 * /about — redesigned with the motion skills.
 *
 *   1. Hero: the headline rises line by line out of masks (kinetic-typography),
 *      then the story film (javascript-animation + soundtrack), driven by
 *      scroll (ScrollFilm): scrolling plays it forward and back.
 *   2. The difference: three before → after lines. The old way is struck
 *      through by a red-pen stroke that draws itself on (svg-animation), then
 *      the new way rises in (kinetic-typography).
 *   3. Principles, real releases on a drawn timeline, and the demo ask.
 *
 * One "wow" per page (motion-art-direction): the film. Everything else is calm.
 */
import CtaBand from '../components/Home/CtaBand.jsx';
import ScrollFilm from '../components/ScrollFilm/ScrollFilm.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { aboutMeta, hero, difference, principles, releases } from '../data/about.js';
import { site } from '../data/site.js';
import './Pages.css';
import './About.css';

const Lines = ({ lines }) => lines.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>);

export default function AboutPage() {
  usePageMeta({ title: aboutMeta.title, description: aboutMeta.description, path: '/about' });
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      <section className="section ab-hero" data-theme="paper" aria-labelledby="about-title">
        <div className="linework" aria-hidden="true" />
        <div className="container">
          <header className="ab-hero__head">
            <p className="label ab-eyebrow" data-animate="fade-up">{hero.eyebrow}</p>
            <h1 className="display ab-hero__title" id="about-title" data-animate="lines"><Lines lines={hero.title} /></h1>
            <p className="lede ab-hero__lede" data-animate="fade-up">{hero.lede}</p>
          </header>


        </div>
      </section>

      <ScrollFilm src={hero.film.src} title={hero.film.title} />

      <section className="section ab-diff" data-theme="white" aria-labelledby="diff-title">
        <div className="container">
          <header className="ab-head">
            <p className="label ab-eyebrow" data-animate="fade-up">{difference.eyebrow}</p>
            <h2 className="display block-title" id="diff-title" data-animate="lines"><Lines lines={difference.title} /></h2>
          </header>
          <ol className="ab-diff__rows">
            {difference.rows.map((r, i) => (
              <li key={r.after} className="ab-diff__row" data-animate="in" style={{ '--i': i }}>
                <p className="ab-diff__before">
                  <span className="sr-only">Before: </span>
                  <span className="ab-diff__old">{r.before}</span>
                  <svg className="ab-diff__strike" viewBox="0 0 300 20" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M4 13 C 70 6, 150 15, 220 8 S 290 10, 296 7" />
                  </svg>
                </p>
                <p className="ab-diff__after">
                  <span className="sr-only">Now: </span>
                  <span className="ab-diff__mask"><span>{r.after}</span></span>
                </p>
                <p className="ab-diff__detail">{r.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section ab-principles" data-theme="paper" aria-labelledby="principles-title">
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

      <section className="section ab-releases" data-theme="white" aria-labelledby="releases-title">
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
