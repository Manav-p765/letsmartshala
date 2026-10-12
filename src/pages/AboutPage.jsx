/**
 * /about — a visual story of the problem and what SmartShala does about it.
 *
 * What the viewer sees:
 *   1. Hero — the headline with six paper registers (admission, attendance,
 *      fee receipts, marks, bus list, salary) scattered around it, floating.
 *   2. "One new student. Five registers." — Aarav's name is dealt onto five
 *      paper slips one after another, each tagged in red pen.
 *   3. The story — six rows. On the left, a page from a paper register with
 *      a red-pen scrawl of the problem; an arrow draws across; on the right,
 *      SmartShala's answer slides in. Rows alternate sides.
 *   4. Three principles, then real releases on a drawn timeline, then the ask.
 *
 * All entrances play once as each part scrolls in (no pinning). Reduced
 * motion shows everything at rest.
 */
import { Link } from 'react-router-dom';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { aboutMeta, aboutHero, problem, story, principles, releases } from '../data/about.js';
import { site } from '../data/site.js';
import './Pages.css';
import './About.css';

const Lines = ({ lines }) => lines.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>);

export default function AboutPage() {
  usePageMeta({ title: aboutMeta.title, description: aboutMeta.description, path: '/about' });
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      {/* 1 — Hero with scattered registers */}
      <section className="section ab-hero" data-theme="paper" aria-labelledby="about-title">
        <div className="linework" aria-hidden="true" />
        <ul className="ab-papers" aria-hidden="true">
          {aboutHero.registers.map((r, i) => (
            <li key={r.name} className={`ab-paper ab-paper--${i}`} style={{ '--tilt': `${r.tilt}deg`, '--i': i }}>
              <span className="ab-paper__name">{r.name}</span>
              <span className="ab-paper__line">{r.line}</span>
            </li>
          ))}
        </ul>
        <div className="container ab-hero__inner">
          <p className="label ab-eyebrow" data-animate="fade-up">{aboutHero.eyebrow}</p>
          <h1 className="display ab-hero__title" id="about-title" data-animate="lines"><Lines lines={aboutHero.title} /></h1>
          <p className="lede ab-hero__lede" data-animate="fade-up">{aboutHero.lede}</p>
        </div>
      </section>

      {/* 2 — One student, five registers */}
      <section className="section ab-problem" data-theme="white" aria-labelledby="problem-title">
        <div className="container">
          <header className="ab-head">
            <p className="label ab-eyebrow" data-animate="fade-up">{problem.eyebrow}</p>
            <h2 className="display block-title" id="problem-title" data-animate="lines"><Lines lines={problem.title} /></h2>
            <p className="lede" data-animate="fade-up">{problem.lede}</p>
          </header>
          <ol className="ab-copies" data-animate="in">
            {problem.copies.map((c, i) => (
              <li key={c.where} className="ab-copy" style={{ '--i': i }}>
                <span className="ab-copy__who">{c.who}</span>
                <span className="ab-copy__slip">
                  <span className="ab-copy__where">{c.where}</span>
                  <span className="ab-copy__name">Aarav Sharma</span>
                  <svg className="ab-copy__scrawl" viewBox="0 0 120 40" aria-hidden="true">
                    <path d="M8 28 C 30 6, 70 4, 112 18" />
                  </svg>
                  <span className="ab-copy__note">{c.note}</span>
                </span>
              </li>
            ))}
          </ol>
          <p className="ab-kicker" data-animate="fade-up">{problem.kicker}</p>
        </div>
      </section>

      {/* 3 — Before → after */}
      <section className="section ab-story" data-theme="paper" aria-labelledby="story-title">
        <div className="container">
          <header className="ab-head ab-head--center">
            <p className="label ab-eyebrow" data-animate="fade-up">{story.eyebrow}</p>
            <h2 className="display block-title" id="story-title" data-animate="lines"><Lines lines={story.title} /></h2>
            <p className="ab-legend" data-animate="fade-up">
              <span className="ab-legend__before">Before — on paper</span>
              <span className="ab-legend__arrow" aria-hidden="true">→</span>
              <span className="ab-legend__after">After — in SmartShala</span>
            </p>
          </header>

          <ol className="ab-pairs">
            {story.pairs.map((p, i) => (
              <li key={p.before.title} className={`ab-pair${i % 2 ? ' ab-pair--flip' : ''}`} data-animate="in">
                <div className="ab-before">
                  <span className="ab-before__num">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{p.before.title}</h3>
                  <p className="ab-before__scrawl">{p.before.scrawl}</p>
                  <svg className="ab-before__circle" viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M14 34 C 10 10, 120 2, 186 18 C 200 34, 150 56, 70 54 C 24 52, 6 44, 22 26" />
                  </svg>
                </div>
                <svg className="ab-arrow" viewBox="0 0 80 24" aria-hidden="true">
                  <path className="ab-arrow__line" d="M2 12 H 72" />
                  <path className="ab-arrow__head" d="M64 4 L 76 12 L 64 20" />
                </svg>
                <div className="ab-after">
                  <span className="icon-tile"><ModuleIcon name={p.icon} /></span>
                  <div>
                    <h3>{p.after.title}</h3>
                    <p>{p.after.text}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <p className="ab-more" data-animate="fade-up">
            See every module working on the <Link to="/features">features page</Link>.
          </p>
        </div>
      </section>

      {/* 4 — Principles */}
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

      {/* 5 — Releases */}
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
