import { india } from '../../data/home.js';
import './India.css';
import useReveal from '../../hooks/useReveal.js';

/**
 * Two rows of the words an Indian school office actually uses, drifting in
 * opposite directions. Pure CSS animation, so it costs no JS per frame;
 * reduced motion turns it into a still, wrapped list.
 */
export default function India() {
  const revealRef = useReveal();
  const half = Math.ceil(india.terms.length / 2);
  const rows = [india.terms.slice(0, half), india.terms.slice(half)];
  return (
    <section ref={revealRef} className="section india" data-section="06 · Indian terms" data-theme="paper" aria-labelledby="india-title">
      <div className="container india__head">
        <p className="label india__eyebrow" data-animate="fade-up">{india.eyebrow}</p>
        <h2 className="display india__title" id="india-title" data-animate="fade-up">{india.title}</h2>
        <p className="lede" data-animate="fade-up">{india.lede}</p>
      </div>
      <div className="marquee" aria-label="Indian school terms SmartShala supports">
        {rows.map((row, r) => (
          <div className={`marquee__row${r ? ' marquee__row--rev' : ''}`} key={r}>
            {/* The list is doubled so the loop is seamless; the copy is hidden from screen readers. */}
            {[0, 1].map((copy) => (
              <ul className="marquee__track" key={copy} aria-hidden={copy === 1 || undefined}>
                {row.map((t) => <li key={t}>{t}</li>)}
              </ul>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
