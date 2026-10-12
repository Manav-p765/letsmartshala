import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import LeadForm from '../components/LeadForm/LeadForm.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { pricing } from '../data/pages.js';
import './Pages.css';

/**
 * Prices are never shown on the site (owner's rule): pricing is shared in a
 * meeting. This page explains what pricing depends on
 * and asks for the school's details — no invented plan names or numbers.
 * When pricing arrives, add plans to data/pages.js and render them here.
 */
export default function PricingPage() {
  usePageMeta({ title: 'Pricing', description: pricing.meta, path: '/pricing' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="pricing-title" eyebrow={pricing.eyebrow} title={pricing.title} lede={pricing.lede}>
        <span className="price-tag">Shared in a meeting · billed in ₹ with GST invoices</span>
      </PageHero>

      <section className="section" data-theme="white" aria-label="Book a pricing meeting">
        <div className="container price-grid">
          <div>
            <h2 className="display block-title" data-animate="fade-up">What your pricing depends on</h2>
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
            <LeadForm title="Book a pricing meeting" note="Tell us about your school. We’ll call to fix a time and walk you through pricing." submit="Book my meeting" />
          </div>
        </div>
      </section>
    </div>
  );
}
