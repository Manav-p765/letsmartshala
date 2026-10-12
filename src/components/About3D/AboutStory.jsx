/**
 * ABOUT — the story, in 3D.
 *
 * Layout: a sticky full-screen 3D stage (storyScene.js) with the chapter
 * texts scrolling over it — the page scrolls normally; nothing is pinned or
 * hijacked. Whichever chapter is in the middle of the screen becomes active:
 * the 3D stage eases to that chapter's scene, and the chapter's card plays
 * a small 2D motion graphic of its own (a name being copied five times,
 * alerts popping, records merging, roles lighting up, a lock closing).
 *
 * No WebGL: the stage shows a soft gradient and the story still reads.
 * Reduced motion: scenes snap, motion graphics show their end state.
 */
import { useEffect, useRef, useState } from 'react';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import { chapters } from '../../data/about.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import './AboutStory.css';

/* ---- One small motion graphic per chapter ---- */
const REGISTERS = ['Admission', 'Attendance', 'Fees', 'Bus list', 'Marks'];
const ROLES = [['Principal', 'reports'], ['Teacher', 'attendance'], ['Accountant', 'fees'], ['Office', 'students']];

function Motion({ scene }) {
  switch (scene) {
    case 'paper':
      return (
        <div className="mg mg-stack" aria-hidden="true">
          {REGISTERS.map((r, i) => <span key={r} style={{ '--i': i }}>{r}</span>)}
        </div>
      );
    case 'copies':
      return (
        <div className="mg mg-copies" aria-hidden="true">
          {REGISTERS.map((r, i) => (
            <div key={r} style={{ '--i': i }}>
              <small>{r}</small>
              <b>Aarav Sharma</b>
            </div>
          ))}
          <span className="mg-copies__count"><em>×</em>5</span>
        </div>
      );
    case 'break':
      return (
        <div className="mg mg-break" aria-hidden="true">
          <span style={{ '--i': 0 }}>Roll no. mismatch</span>
          <span style={{ '--i': 1 }}>Fees: waiting…</span>
          <span style={{ '--i': 2 }}>23 defaulters</span>
        </div>
      );
    case 'one':
      return (
        <div className="mg mg-one" aria-hidden="true">
          <svg viewBox="0 0 300 120">
            {[14, 38, 62, 86, 110].map((y, i) => (
              <path key={y} style={{ '--i': i }} d={`M 6 ${y} C 120 ${y}, 150 60, 222 60`} />
            ))}
          </svg>
          <span className="mg-one__dot"><ModuleIcon name="students" /></span>
        </div>
      );
    case 'connect':
      return (
        <div className="mg mg-roles" aria-hidden="true">
          {ROLES.map(([r, icon], i) => (
            <span key={r} style={{ '--i': i }}><ModuleIcon name={icon} />{r}</span>
          ))}
        </div>
      );
    case 'yours':
      return (
        <div className="mg mg-lock" aria-hidden="true">
          <svg viewBox="0 0 64 64">
            <rect x="12" y="28" width="40" height="28" rx="6" />
            <path className="mg-lock__shackle" d="M20 28 V 20 a 12 12 0 0 1 24 0 V 28" />
          </svg>
          <span>Your own database</span>
        </div>
      );
    default:
      return null;
  }
}

export default function AboutStory() {
  const stageRef = useRef(null);
  const sceneRef = useRef(null);
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);

  // Build the 3D stage (three.js is loaded only on this page).
  useEffect(() => {
    let alive = true;
    let stage;
    import('./storyScene.js')
      .then(({ createStoryScene }) => createStoryScene(stageRef.current, { reduced: prefersReducedMotion() }))
      .then((s) => {
        if (!alive) return s.dispose();
        stage = s;
        sceneRef.current = s;
        s.setChapter(active);
      })
      .catch((e) => { console.warn('[about] 3D stage unavailable:', e?.message); if (alive) setFailed(true); });
    return () => { alive = false; stage?.dispose(); sceneRef.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { sceneRef.current?.setChapter(active); }, [active]);

  // The chapter crossing the middle of the screen is the active one.
  useEffect(() => {
    const els = document.querySelectorAll('.st-ch');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setActive(Number(e.target.dataset.i)));
    }, { rootMargin: '-48% 0px -48% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  const goTo = (i) => {
    const el = document.querySelector(`.st-ch[data-i="${i}"]`);
    el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'center' });
  };

  return (
    <section className="st" data-theme="paper" aria-labelledby="about-title">
      <div className={`st-stage${failed ? ' is-flat' : ''}`}>
        <div className="st-stage__gl" ref={stageRef} aria-hidden="true" />
        <div className="st-stage__fade" aria-hidden="true" />
        <nav className="st-dots" aria-label="Story chapters">
          {chapters.map((c, i) => (
            <button
              key={c.scene}
              type="button"
              className={i === active ? 'is-on' : ''}
              aria-current={i === active ? 'step' : undefined}
              aria-label={c.eyebrow}
              onClick={() => goTo(i)}
            >
              <span className="st-dots__label">{c.eyebrow}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="st-chapters">
        {chapters.map((c, i) => {
          const H = i === 0 ? 'h1' : 'h2';
          return (
            <article key={c.scene} className={`st-ch${i === active ? ' is-active' : ''}${i === 0 ? ' st-ch--first' : ''}`} data-i={i}>
              <div className="container">
                <div className="st-card">
                  <p className="label st-card__eyebrow"><span>{String(i + 1).padStart(2, '0')}</span>{c.eyebrow}</p>
                  <H className="display st-card__title" id={i === 0 ? 'about-title' : undefined}>
                    {c.title.map((l) => <span key={l}>{l}</span>)}
                  </H>
                  {c.text && <p className="st-card__text">{c.text}</p>}
                  {c.points && (
                    <ul className="st-card__points">
                      {c.points.map((p) => <li key={p}>{p}</li>)}
                    </ul>
                  )}
                  <Motion scene={c.scene} />
                  {c.hint && <p className="st-card__hint">{c.hint} <span aria-hidden="true">↓</span></p>}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
