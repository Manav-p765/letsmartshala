import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionHead from '../ui/SectionHead.jsx';
import { flow } from '../../data/home.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import './Flow.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * One student followed through the system. The heading stays put on the
 * left while the steps scroll past on the right; a blue line draws down
 * the steps with the scroll (scaleY, so the compositor does it), and each
 * step lights up as the line reaches it.
 */
export default function Flow() {
  const listRef = useRef(null);
  const lineRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const steps = list.querySelectorAll('.flow__step');
    if (prefersReducedMotion()) {
      steps.forEach((s) => s.classList.add('is-lit'));
      gsap.set(lineRef.current, { scaleY: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleY: 0 }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: 0.6 }
      });
      steps.forEach((s) => {
        ScrollTrigger.create({
          trigger: s,
          start: 'top 60%',
          once: true,
          onEnter: () => s.classList.add('is-lit')
        });
      });
    }, list);
    return () => ctx.revert();
  }, []);

  return (
    <section className="section flow" data-theme="navy" aria-labelledby="flow-title">
      <div className="container flow__grid">
        <div className="flow__head">
          <SectionHead id="flow-title" eyebrow={flow.eyebrow} title={flow.title} lede={flow.lede} />
        </div>
        <div className="flow__list" ref={listRef}>
          <span className="flow__rail" aria-hidden="true"><span ref={lineRef} /></span>
          <ol className="flow__steps">
          {flow.steps.map((s, i) => (
            <li className="flow__step" key={s.title}>
              <span className="flow__num" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <p className="label flow__who">{s.who}</p>
                <h3 className="flow__title">{s.title}</h3>
                <p className="flow__text">{s.text}</p>
              </div>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
