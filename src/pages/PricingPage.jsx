import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import LeadForm from '../components/LeadForm/LeadForm.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { pricing } from '../data/pages.js';
import './Pages.css';

/**
 * Prices aren't public yet, so this page explains what a quote depends on
 * and asks for the school's details — no invented plan names or numbers.
 * When pricing arrives, add plans to data/pages.js and render them here.
 */
export default function PricingPage() {
  usePageMeta({ title: 'Pricing', description: pricing.meta, path: '/pricing' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="pricing-title" eyebrow={pricing.eyebrow} title={pricing.title} lede={pricing.lede}>
        <span className="price-tag">Quotes in ₹ · GST invoices</span>
      </PageHero>

      <section className="section" data-theme="white" aria-label="Get a quote">
        <div className="container price-grid">
          <div>
            <h2 className="display block-title" data-animate="fade-up">What your quote depends on</h2>
            <div className="price-factors" style={{ marginTop: '1.5rem' }} data-animate="stagger">
              {pricing.factors.map((f) => (
                <div className="card" key={f.title}>
                  <span className="icon-tile"><ModuleIcon name={f.icon} /></span>
                  <div><h3>{f.title}</h3><p style={{ marginTop: '0.3rem', color: 'var(--fg-2)', fontSize: '0.93rem' }}>{f.text}</p></div>
                </div>
              ))}
            </div>
            <div className="card price-included" data-animate="fade-up">
              <h2>Every plan includes</h2>
              <ul className="checks">{pricing.included.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
          <div data-animate="fade-up">
            <LeadForm title="Get a quote" note="Tell us about your school and we’ll call with pricing that fits." submit="Get my quote" />
          </div>
        </div>
      </section>
    </div>
  );
}
