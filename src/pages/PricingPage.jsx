import { useId, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import LeadForm from '../components/LeadForm/LeadForm.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { pricing } from '../data/pages.js';
import { site } from '../data/site.js';
import './Pages.css';

const inr = (n) => '₹' + n.toLocaleString('en-IN');
const planFor = (students) => pricing.plans.find((p) => p.cap === null || students <= p.cap);
// Features a plan adds over the one before it (the first plan that has them).
const newIn = (id) => pricing.features.filter((f) => f.plans[0] === id).map((f) => f.name);

// The size slider runs to just past the last cap, so every plan is reachable.
const MIN = 50;
const MAX = 2500;
const STEP = 10;

/** Search engines read the plans as offers (prerendered into the page). */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SmartShala',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android',
  url: site.siteUrl + '/pricing',
  offers: pricing.plans.filter((p) => !p.from).map((p) => ({
    '@type': 'Offer',
    name: p.name,
    price: p.price,
    priceCurrency: 'INR',
    description: `${p.students}, per year, excluding GST`
  }))
};

/**
 * Plans and prices from the owner's pricing document (data/pages.js →
 * pricing). The signature moment is the size slider: drag to your number of
 * students and the plan that fits lights up, with what it works out to per
 * student. Nothing moves on its own.
 */
export default function PricingPage() {
  usePageMeta({ title: 'Pricing', description: pricing.meta, path: '/pricing' });
  const revealRef = useReveal();
  const [students, setStudents] = useState(450);
  const sliderId = useId();
  const plan = planFor(students);
  const perStudent = Math.round(plan.price / students);
  const fill = ((students - MIN) / (MAX - MIN)) * 100;

  return (
    <div ref={revealRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero id="pricing-title" eyebrow={pricing.eyebrow} title={pricing.title} lede={pricing.lede}>
        <span className="price-tag">No per-student billing · Prices exclude GST</span>
      </PageHero>

      <section className="section plans-section" data-theme="white" aria-labelledby="plans-title">
        <div className="container">
          <h2 className="sr-only" id="plans-title">Plans</h2>

          <div className="sizer" data-animate="fade-up">
            <div className="sizer__head">
              <label className="sizer__label" htmlFor={sliderId}>How many students do you have?</label>
              <output className="sizer__count" htmlFor={sliderId}>
                {students >= MAX ? `${MAX.toLocaleString('en-IN')}+` : students.toLocaleString('en-IN')}
              </output>
            </div>
            <input
              id={sliderId}
              className="sizer__range"
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={students}
              onChange={(e) => setStudents(Number(e.target.value))}
              aria-valuetext={`${students} students: ${plan.name} plan`}
              style={{ '--fill': `${fill}%` }}
            />
            <p className="sizer__result" aria-live="polite">
              {plan.from ? (
                <><strong>{plan.name}</strong> · from {inr(plan.price)} a year, quoted for your school</>
              ) : (
                <><strong>{plan.name}</strong> · {inr(plan.price)} a year, about <strong>{inr(perStudent)} per student</strong></>
              )}
            </p>
          </div>

          <ol className="plans" data-animate="stagger">
            {pricing.plans.map((p, i) => {
              const active = p.id === plan.id;
              const adds = newIn(p.id);
              return (
                <li key={p.id} className={`card plan${active ? ' is-active' : ''}`} aria-current={active ? 'true' : undefined}>
                  <div className="plan__head">
                    <h3>{p.name}</h3>
                    {active && <span className="plan__fit">Fits your school</span>}
                  </div>
                  <p className="plan__for">{p.bestFor} · {p.students}</p>
                  <p className="plan__price">
                    {p.from && <span className="plan__from">From</span>}
                    <span className="plan__amount">{inr(p.price)}</span>
                    <span className="plan__per">/ year</span>
                  </p>
                  <p className="plan__note">
                    {p.cap ? <>About {inr(Math.round(p.price / p.cap))} per student at {p.cap.toLocaleString('en-IN')}</> : 'Quoted for your school'}
                  </p>
                  {i > 0 && <p className="plan__plus">Everything in {pricing.plans[i - 1].name}, plus</p>}
                  <ul className="checks plan__list">
                    {adds.length ? adds.map((a) => <li key={a}>{a}</li>) : <li>Pricing and setup for your school’s size</li>}
                  </ul>
                  <a className={`btn btn--small plan__cta${active ? '' : ' btn--ghost'}`} href="#quote">
                    {p.from ? 'Get a quote' : 'Book a demo'}
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="plans__terms" data-animate="fade-up">{pricing.terms}</p>
        </div>
      </section>

      <section className="section" data-theme="paper" aria-labelledby="compare-title">
        <div className="container">
          <h2 className="display block-title" id="compare-title" data-animate="fade-up">Features by plan</h2>
          <div className="compare" data-animate="fade-up">
            <table>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {pricing.plans.map((p) => (
                    <th scope="col" key={p.id} className={p.id === plan.id ? 'is-active' : undefined}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricing.features.map((f) => (
                  <tr key={f.name}>
                    <th scope="row">{f.name}</th>
                    {pricing.plans.map((p) => {
                      const has = f.plans.includes(p.id);
                      return (
                        <td key={p.id} className={p.id === plan.id ? 'is-active' : undefined}>
                          {has ? (
                            <svg className="compare__yes" viewBox="0 0 16 16" role="img" aria-label="Included"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
                          ) : (
                            <span className="compare__no" aria-label="Not included">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="price-terms" data-animate="stagger">
            <div className="card">
              <h3>Every plan includes</h3>
              <ul className="checks">{pricing.included.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="card">
              <h3>Quoted separately</h3>
              <ul className="price-terms__extra">{pricing.extras.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="quote" data-theme="white" aria-labelledby="quote-title">
        <div className="container price-grid">
          <div data-animate="fade-up">
            <h2 className="display block-title" id="quote-title">See it on your school’s data</h2>
            <p className="lede" style={{ marginTop: '1rem', maxWidth: '32rem' }}>
              Tell us about your school. We’ll call to set up a demo and confirm the right plan, including anything quoted separately.
            </p>
          </div>
          <div data-animate="fade-up">
            <LeadForm title="Book a demo" note="A short call at a time that suits you. No obligation." submit="Book my demo" />
          </div>
        </div>
      </section>
    </div>
  );
}
