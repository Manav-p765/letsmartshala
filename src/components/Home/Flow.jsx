/**
 * FROM ADMISSION TO FEE RECEIPT — one student's file travels the school.
 *
 * What the viewer sees: five stations along a horizontal track — office
 * admin, class, principal, accountant, receipt. The section pins, and as you
 * scroll, Aarav's student file slides along the track from station to
 * station. Each station adds its line to the file (guardian and IDs, then
 * class, fee structure, payment) and the last one stamps it PAID. The active
 * station's explanation sits under the track.
 *
 * Desktop with motion, when it fits the screen: pinned and scroll-driven.
 * Otherwise (phones, reduced motion, very short screens): stations stack
 * vertically and the finished file shows at the top.
 */
import { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import useReveal from '../../hooks/useReveal.js';
import ModuleIcon from '../ui/ModuleIcon.jsx';
import { flow } from '../../data/home.js';
import './Flow.css';

gsap.registerPlugin(ScrollTrigger);

const PIN_MQ = '(min-width: 901px) and (min-height: 600px) and (prefers-reduced-motion: no-preference)';
const LAST = flow.steps.length - 1;
const STATION_ICONS = ['students', 'timetable', 'fees', 'receipt', 'reports'];

export default function Flow() {
  const revealRef = useReveal();
  const sectionRef = useRef(null);
  const [step, setStep] = useState(LAST);
  const [pinned, setPinned] = useState(false);

  const setRefs = (el) => { sectionRef.current = el; revealRef.current = el; };

  useLayoutEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(PIN_MQ, () => {
      // Pin only if the whole section fits on screen; otherwise it scrolls
      // normally with everything visible, rather than being cut off.
      // Measure the pinned (compact, horizontal) layout, not the stacked one.
      const el = sectionRef.current;
      el.classList.add('is-pinned');
      if (el.offsetHeight > window.innerHeight + 2) {
        el.classList.remove('is-pinned');
        return;
      }
      setPinned(true);
      setStep(0);
      ScrollTrigger.create({
        trigger: sectionRef.current,
        pin: true,
        start: 'top top',
        end: () => '+=' + LAST * window.innerHeight * 0.6,
        onUpdate: (self) => setStep(Math.min(LAST, Math.floor(self.progress * (LAST + 1) * 0.999))),
        invalidateOnRefresh: true
      });
      return () => { setPinned(false); setStep(LAST); };
    });
    return () => mm.revert();
  }, []);

  const x = (i) => 10 + (i * 80) / LAST;   // station positions along the track, in %

  return (
    <section
      ref={setRefs}
      className={`section flow${pinned ? ' is-pinned' : ''}`}
      data-theme="white"
      aria-labelledby="flow-title"
      style={{ '--x': x(step), '--s': step, '--last': LAST }}
    >
      <div className="container">
        <header className="flow__head">
          <p className="label flow__eyebrow" data-animate="fade-up">{flow.eyebrow}</p>
          <h2 className="display flow__heading" id="flow-title" data-animate="lines">
            {flow.title.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>)}
          </h2>
        </header>

        <div className="journey">
          {/* The travelling student file. */}
          <article className="file" aria-label="Sample student file">
            <header className="file__head">
              <span className="file__avatar">AS</span>
              <div>
                <strong>Aarav Sharma</strong>
                <span>Student file · 2026–27</span>
              </div>
              <span className={`file__stamp${step === LAST ? ' is-on' : ''}`}>Paid</span>
            </header>
            <ul className="file__lines">
              {flow.file.map((block, i) => (
                <li key={block.label} className={`${i <= step ? 'is-on' : ''}${i === step ? ' is-new' : ''}`}>
                  <span className="file__label">{block.label}</span>
                  <span className="file__value">{block.rows.map(([k, v]) => `${k} ${v}`).join(' · ')}</span>
                </li>
              ))}
            </ul>
          </article>

          {/* The track and its five stations. */}
          <ol className="track">
            {flow.steps.map((s, i) => (
              <li
                key={s.title}
                className={`station${i <= step ? ' is-lit' : ''}${i === step ? ' is-active' : ''}`}
                style={{ '--px': x(i) }}
              >
                <span className="station__dot"><ModuleIcon name={STATION_ICONS[i]} /></span>
                <span className="station__who">{s.who}</span>
                <span className="station__title">{s.title}</span>
                <p className="station__text">{s.text}</p>
              </li>
            ))}
          </ol>

          <p className="journey__now" aria-live="polite">
            <span className="label">Step {step + 1} of {LAST + 1}</span>
            {flow.steps[step].text}
          </p>
        </div>
      </div>
    </section>
  );
}
