import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import LeadForm from '../components/LeadForm/LeadForm.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { prefersReducedMotion, isStaticBoot, isOnScreen } from '../lib/motion.js';
import { pricing } from '../data/pages.js';
import { site } from '../data/site.js';
import './Pages.css';
import './Pricing.css';

gsap.registerPlugin(ScrollTrigger);

const inr = (n) => '₹' + n.toLocaleString('en-IN');
const planFor = (students) => pricing.plans.find((p) => p.cap === null || students <= p.cap);
const capped = pricing.plans.filter((p) => p.cap);
const perStudentAtCap = (p) => Math.round(p.price / p.cap);

// The size slider starts at Starter's 300 and runs past the last cap into
// the custom plan.
const MIN = 300;
const MAX = 2500;
const STEP = 10;
const at = (n) => (n - MIN) / (MAX - MIN);

/** Search engines read the plans as offers (prerendered into the page). */
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'SmartShala',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Web, Android',
  url: site.siteUrl + '/pricing',
  offers: pricing.plans.filter((p) => p.price).map((p) => ({
    '@type': 'Offer',
    name: p.name,
    price: p.price,
    priceCurrency: 'INR',
    description: `${p.students}, per year, excluding GST`
  }))
};

/** A number that runs to its new value when it changes (instant with reduced motion). */
function useCountTo(value) {
  const [shown, setShown] = useState(value);
  const current = useRef(value);
  useEffect(() => {
    if (current.current === value) return;
    if (prefersReducedMotion()) { current.current = value; setShown(value); return; }
    const o = { v: current.current };
    const tween = gsap.to(o, {
      v: value, duration: 0.6, ease: 'power3.out',
      onUpdate: () => { current.current = Math.round(o.v); setShown(current.current); }
    });
    return () => tween.kill();
  }, [value]);
  return shown;
}

/** A plan price that counts up once when its card scrolls into view. */
function Amount({ value }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(value);
  useLayoutEffect(() => {
    const el = ref.current;
    // Already visible on a prerendered first load, or less motion asked: leave it.
    if (prefersReducedMotion() || (isStaticBoot() && isOnScreen(el))) return;
    // Count from 40% up, starting the moment the price enters the screen, so a
    // half-visible card never reads "₹0".
    const o = { v: Math.round(value * 0.4) };
    setShown(o.v);
    const st = ScrollTrigger.create({
      trigger: el, start: 'top bottom', once: true,
      onEnter: () => gsap.to(o, { v: value, duration: 1.1, ease: 'power3.out', onUpdate: () => setShown(Math.round(o.v)) })
    });
    return () => { st.kill(); gsap.killTweensOf(o); setShown(value); };
  }, [value]);
  return <span ref={ref} className="plan__amount">{inr(shown)}</span>;
}

/**
 * The hero's price card — the page's signature moment. Drag to your number
 * of students: the plan, its price and the cost per student update, and the
 * same plan lights up everywhere below (cards, chart, table).
 */
function Estimator({ students, setStudents, current }) {
  const sliderId = useId();
  const custom = !current.price;
  // The custom plan shows no price; keep the count parked on Premium's so
  // coming back down doesn't run up from zero.
  const price = useCountTo(current.price ?? capped[capped.length - 1].price);
  const perStudent = useCountTo(custom ? 0 : Math.round(current.price / students));
  return (
    <div className="est" data-animate="fade-up">
      <span className="est__tag est__tag--top" aria-hidden="true"><ModuleIcon name="students" /> No per-student billing</span>
      <span className="est__tag est__tag--bottom" aria-hidden="true"><ModuleIcon name="receipt" /> GST invoice</span>

      <div className="est__head">
        <label className="est__label" htmlFor={sliderId}>How many students do you have?</label>
        <output className="est__count" htmlFor={sliderId}>
          {students >= MAX ? `${MAX.toLocaleString('en-IN')}+` : students.toLocaleString('en-IN')}
        </output>
      </div>
      <div className="est__track">
        <span className="est__zone" style={{ '--from': at(Math.max(current.min, MIN)), '--to': current.cap ? at(current.cap) : 1 }} aria-hidden="true" />
        <input
          id={sliderId}
          className="est__range"
          type="range"
          min={MIN}
          max={MAX}
          step={STEP}
          value={students}
          onChange={(e) => setStudents(Number(e.target.value))}
          aria-valuetext={`${students} students: ${current.name} plan`}
          style={{ '--fill': `${at(students) * 100}%` }}
        />
        <div className="est__scale" aria-hidden="true">
          {capped.map((p) => (
            <span key={p.id} className={students > p.cap ? 'is-past' : undefined} style={{ '--at': at(p.cap) }}>
              {p.cap.toLocaleString('en-IN')}
            </span>
          ))}
        </div>
      </div>

      <div className="est__result" aria-live="polite">
        <div className="est__plan">
          <span className="est__badge" key={current.id}>{current.name}</span>
          <span className="est__for">{current.bestFor}</span>
        </div>
        {custom ? (
          <>
            <div className="est__price est__price--custom"><strong>Custom pricing</strong></div>
            <p className="est__per">Planned around your school’s size and needs</p>
          </>
        ) : (
          <>
            <div className="est__price">
              <strong>{inr(price)}</strong>
              <span>/ year</span>
            </div>
            <p className="est__per">About <strong>{inr(perStudent)}</strong> per student a year</p>
          </>
        )}
      </div>

      <div className="est__includes">
        <p>Every feature included</p>
        <ul className="est__tags">
          {pricing.featureTags.map((f) => <li key={f}>{f}</li>)}
        </ul>
      </div>

      <a className="btn est__cta" href="#quote">
        {custom ? 'Talk to us about a custom plan' : `Book a demo for ${current.name}`} <span className="btn__arrow" aria-hidden="true">→</span>
      </a>
    </div>
  );
}

/**
 * Plans and prices from the owner's pricing document (data/pages.js →
 * pricing). The hero holds the estimator; the cards, the per-student chart
 * and the table below follow the plan it picks.
 */
export default function PricingPage() {
  usePageMeta({ title: 'Pricing', description: pricing.meta, path: '/pricing' });
  const revealRef = useReveal();
  const [students, setStudents] = useState(450);
  const current = planFor(students);
  const tallest = Math.max(...capped.map(perStudentAtCap));

  return (
    <div ref={revealRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="section page-hero price-hero" data-theme="paper" aria-labelledby="pricing-title">
        <div className="linework" aria-hidden="true" />
        <svg className="page-hero__arc" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 80 500 A 420 420 0 0 1 920 500" />
        </svg>
        <div className="container price-hero__grid">
          <div className="price-hero__copy">
            <p className="label page-hero__eyebrow" data-animate="fade-up">{pricing.eyebrow}</p>
            <h1 className="display price-hero__title" id="pricing-title" data-animate="lines">
              {pricing.title.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>)}
            </h1>
            <p className="lede price-hero__lede" data-animate="fade-up">{pricing.lede}</p>
            <ul className="checks price-hero__points" data-animate="stagger">
              {pricing.points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <div className="price-hero__actions" data-animate="fade-up">
              <a className="btn" href="#quote">Book a demo <span className="btn__arrow" aria-hidden="true">→</span></a>
              <a className="btn btn--ghost" href="#plans">Compare plans</a>
            </div>
            <p className="price-hero__terms" data-animate="fade-up">{pricing.terms}</p>
          </div>
          <Estimator students={students} setStudents={setStudents} current={current} />
        </div>
      </section>

      <section className="section plans-section" id="plans" data-theme="white" aria-labelledby="plans-title">
        <div className="container">
          <h2 className="display block-title block-title--center" id="plans-title" data-animate="fade-up">Four plans, by school size</h2>
          <ol className="plans" data-animate="stagger">
            {pricing.plans.map((p) => {
              const active = p.id === current.id;
              return (
                <li key={p.id} className={`card plan${active ? ' is-active' : ''}`} aria-current={active ? 'true' : undefined}>
                  <div className="plan__head">
                    <h3>{p.name}</h3>
                    {active && <span className="plan__fit">Fits your school</span>}
                  </div>
                  <p className="plan__for">{p.bestFor} · {p.students}</p>
                  {p.price ? (
                    <>
                      <p className="plan__price">
                        <Amount value={p.price} />
                        <span className="plan__per">/ year</span>
                      </p>
                      <p className="plan__note">About {inr(perStudentAtCap(p))} per student at {p.cap.toLocaleString('en-IN')}</p>
                    </>
                  ) : (
                    <>
                      <p className="plan__price"><span className="plan__amount plan__amount--custom">Custom pricing</span></p>
                      <p className="plan__note">Planned around your school</p>
                    </>
                  )}
                  <ul className="checks plan__list">
                    <li>Every feature included</li>
                    <li>{p.students}</li>
                  </ul>
                  <a className={`btn btn--small plan__cta${active ? '' : ' btn--ghost'}`} href="#quote">
                    {p.price ? 'Book a demo' : 'Talk to us'}
                  </a>
                </li>
              );
            })}
          </ol>
          <p className="plans__terms" data-animate="fade-up">{pricing.terms}</p>
        </div>
      </section>

      <section className="section" data-theme="mist" aria-labelledby="scale-title">
        <div className="container scale">
          <div className="scale__copy">
            <p className="label scale__eyebrow" data-animate="fade-up">No per-student billing</p>
            <h2 className="display block-title" id="scale-title" data-animate="lines">
              <span className="line-mask"><span>Your school grows.</span></span>
              <span className="line-mask"><span>Your cost per student falls.</span></span>
            </h2>
            <p className="lede scale__lede" data-animate="fade-up">
              Each plan is one yearly price, not a charge for every child. Filled to its limit, each plan works out to this much per student.
            </p>
          </div>
          <figure className="scale__chart" data-animate="in">
            <ol>
              {capped.map((p, i) => (
                <li key={p.id} className={p.id === current.id ? 'is-active' : undefined} style={{ '--h': perStudentAtCap(p) / tallest, '--i': i }}>
                  <span className="scale__value">{inr(perStudentAtCap(p))}</span>
                  <span className="scale__bar" />
                  <span className="scale__plan">{p.name}</span>
                  <span className="scale__n">{p.cap.toLocaleString('en-IN')} students</span>
                </li>
              ))}
            </ol>
            <figcaption>Per student per year: the plan’s yearly price divided by its top student count, before GST.</figcaption>
          </figure>
        </div>
      </section>

      <section className="section" data-theme="paper" aria-labelledby="terms-title">
        <div className="container">
          <h2 className="display block-title" id="terms-title" data-animate="fade-up">What comes with every plan</h2>
          <div className="price-terms" data-animate="stagger">
            <div className="card">
              <div className="price-terms__head">
                <span className="icon-tile"><ModuleIcon name="receipt" /></span>
                <h3>Every plan includes</h3>
              </div>
              <ul className="checks">{pricing.included.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
            <div className="card">
              <div className="price-terms__head">
                <span className="icon-tile"><ModuleIcon name="fees" /></span>
                <h3>Quoted separately</h3>
              </div>
              <ul className="price-terms__extra">{pricing.extras.map((i) => <li key={i}>{i}</li>)}</ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="quote" data-theme="white" aria-labelledby="quote-title">
        <div className="container price-grid">
          <div>
            <h2 className="display block-title" id="quote-title" data-animate="lines">
              <span className="line-mask"><span>See it on your</span></span>
              <span className="line-mask"><span>school’s data.</span></span>
            </h2>
            <p className="lede" style={{ marginTop: '1rem', maxWidth: '32rem' }} data-animate="fade-up">
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
