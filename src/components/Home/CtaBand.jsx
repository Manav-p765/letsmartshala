import { Link } from 'react-router-dom';
import { site } from '../../data/site.js';
import './CtaBand.css';
import useReveal from '../../hooks/useReveal.js';

/** The closing ask: calm paper, a soft blue arc rising behind it, one clear button. */
export default function CtaBand() {
  const revealRef = useReveal();
  return (
    <section ref={revealRef} className="section section--screen cta" data-theme="paper" aria-labelledby="cta-title">
      <svg className="cta__arc" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 40 500 A 460 440 0 0 1 960 500" />
      </svg>
      <div className="container cta__inner">
        <h2 className="display cta__title" id="cta-title" data-animate="lines">
          <span className="line-mask"><span>See your school’s day</span></span>
          <span className="line-mask"><span>in <em className="serif hi">SmartShala.</em></span></span>
        </h2>
        <p className="lede" data-animate="fade-up">
          A short call, on your schedule. We’ll walk through the modules your school needs.
        </p>
        <div className="cta__actions" data-animate="fade-up">
          <Link className="btn cta__btn" to="/demo">
            Book a demo <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
          <a className="btn btn--ghost" href={site.contact.whatsapp.href} target="_blank" rel="noreferrer">
            WhatsApp {site.contact.whatsapp.value}
          </a>
        </div>
      </div>
    </section>
  );
}
