import SectionHead from '../ui/SectionHead.jsx';
import { faq } from '../../data/home.js';
import './Faq.css';

/** Native <details> accordion: keyboard and screen-reader friendly for free. */
export default function Faq() {
  return (
    <section className="section faq" data-theme="white" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <SectionHead id="faq-title" eyebrow="Questions" title={['Asked by', 'principals.']} />
        <div className="faq__list" data-animate="stagger">
          {faq.map((f) => (
            <details key={f.q} className="faq__item">
              <summary>
                <span>{f.q}</span>
                <span className="faq__icon" aria-hidden="true" />
              </summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
