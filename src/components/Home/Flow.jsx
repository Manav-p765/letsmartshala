/**
 * FROM ADMISSION TO FEE RECEIPT — one student's file, filled in across the
 * school.
 *
 * What the viewer sees: five stations on one line (office admin, office
 * admin, principal, accountant, accountant) and, under them, Aarav's student
 * file with one column per station. A blue line travels from station to
 * station; as it reaches each one, that station lights and its column of
 * the file fills in (a placeholder becomes the real rows). At the last
 * station the file is stamped PAID. Clicking a station shows it.
 *
 * Desktop: the section pins (the owner asked for this) and the scroll moves
 * the line along, half a screen per station, then lets go.
 * Phones: no pin; the stations hide, the file's columns stack, and the steps
 * play once on their own when the file is on screen.
 * Reduced motion: the finished file shows.
 */
import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReveal from '../../hooks/useReveal.js';
import useAutoStep from '../../hooks/useAutoStep.js';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import { flow } from '../../data/home.js';
import './Flow.css';

gsap.registerPlugin(ScrollTrigger);

const LAST = flow.steps.length - 1;
const STEP_ICONS = ['students', 'timetable', 'fees', 'receipt', 'reports'];
const PIN_MQ = '(min-width: 901px) and (prefers-reduced-motion: no-preference)';

export default function Flow() {
  const revealRef = useReveal();
  // Phones: starts once the file is fully on screen; one step every 1.9s.
  const [bodyRef, step, choose] = useAutoStep(flow.steps.length, 1900, { restIndex: LAST, threshold: 0.95 });

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(PIN_MQ, () => {
      const el = revealRef.current;
      el.classList.add('is-scrubbed');
      choose(0);   // also switches the autoplay off for good
      let last = 0;
      ScrollTrigger.create({
        trigger: el,
        pin: true,
        // If the section is taller than the screen, pin once its bottom is in.
        start: () => (el.offsetHeight > window.innerHeight ? 'bottom bottom' : 'top top'),
        end: () => '+=' + LAST * window.innerHeight * 0.5,
        invalidateOnRefresh: true,
        onUpdate: ({ progress }) => {
          const s = Math.min(LAST, Math.floor(progress * LAST + 0.35));
          if (s !== last) choose((last = s));
        }
      });
      return () => el.classList.remove('is-scrubbed');
    });
    return () => mm.revert();
  }, [revealRef, choose]);

  return (
    <section ref={revealRef} className="section section--screen flow" data-section="05 · Student journey" data-theme="white" aria-labelledby="flow-title">
      <div className="container">
        <header className="flow__head">
          <p className="label flow__eyebrow" data-animate="fade-up">{flow.eyebrow}</p>
          <h2 className="display flow__heading" id="flow-title" data-animate="lines">
            {flow.title.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>)}
          </h2>
        </header>

        <div className="journey" ref={bodyRef} style={{ '--s': step, '--last': LAST }} data-animate="fade-up">
          {/* The stations, on one line. */}
          <ol className="stations">
            {flow.steps.map((s, i) => (
              <li key={s.title} className={`station${i <= step ? ' is-lit' : ''}${i === step ? ' is-active' : ''}`}>
                <button type="button" className="station__btn" aria-current={i === step ? 'step' : undefined} onClick={() => choose(i)}>
                  <span className="station__dot"><ModuleIcon name={STEP_ICONS[i]} /></span>
                  <span className="station__who">{s.who}</span>
                  <span className="station__title">{s.title}</span>
                </button>
              </li>
            ))}
          </ol>

          {/* The student file: one column per station. */}
          <article className="file" aria-label="Sample student file">
            <header className="file__head">
              <span className="file__avatar">AS</span>
              <div className="file__name">
                <strong>Aarav Sharma</strong>
                <span>Student file · 2026–27</span>
              </div>
              <span className="file__meter" aria-hidden="true"><i /></span>
              <span className="file__count mono">{step + 1}/{LAST + 1}</span>
              <span className={`file__stamp${step === LAST ? ' is-on' : ''}`}>Paid</span>
            </header>
            <ul className="file__cols">
              {flow.file.map((block, i) => (
                <li key={block.label} className={`file__col${i <= step ? ' is-on' : ''}${i === step ? ' is-new' : ''}`}>
                  <span className="file__label">{block.label}</span>
                  <dl className="file__rows">
                    {block.rows.map(([k, v], r) => (
                      <div key={k} style={{ '--r': r }}>
                        <dt>{k}</dt><dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  <span className="file__ghost" aria-hidden="true"><i /><i /></span>
                </li>
              ))}
            </ul>
          </article>

          <p className="journey__now" key={step} aria-live="polite">{flow.steps[step].text}</p>
        </div>
      </div>
    </section>
  );
}
