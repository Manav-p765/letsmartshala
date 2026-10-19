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
// Features a plan adds over the one before it (the first plan that has them).
const newIn = (id) => pricing.features.filter((f) => f.plans[0] === id).map((f) => f.name);
const prevOf = (id) => pricing.plans[pricing.plans.findIndex((p) => p.id === id) - 1];
const capped = pricing.plans.filter((p) => p.cap);
const perStudentAtCap = (p) => Math.round(p.price / p.cap);

// The size slider runs to just past the last cap, so every plan is reachable.
const MIN = 50;
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
  offers: pricing.plans.filter((p) => !p.from).map((p) => ({
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
  const price = useCountTo(current.price);
  const perStudent = useCountTo(Math.round(current.price / students));
  const prev = prevOf(current.id);
  const adds = newIn(current.id);
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
        <div className="est__price">
          {current.from && <span className="est__from">From</span>}
          <strong>{inr(price)}</strong>
          <span>/ year</span>
        </div>
        <p className="est__per">
          {current.from ? 'Quoted for your school' : <>About <strong>{inr(perStudent)}</strong> per student a year</>}
        </p>
      </div>

      <div className="est__includes">
        <p>{prev ? `Everything in ${prev.name}, plus` : 'Includes'}</p>
        <ul className="checks">
          {(adds.length ? adds : ['Pricing and setup for your school’s size']).map((a) => <li key={a}>{a}</li>)}
        </ul>
      </div>

      <a className="btn est__cta" href="#quote">
        {current.from ? 'Get a quote' : `Book a demo for ${current.name}`} <span className="btn__arrow" aria-hidden="true">→</span>
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
            {pricing.plans.map((p, i) => {
              const active = p.id === current.id;
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
                    <Amount value={p.price} />
                    <span className="plan__per">/ year</span>
                  </p>
                  <p className="plan__note">
                    {p.cap ? <>About {inr(perStudentAtCap(p))} per student at {p.cap.toLocaleString('en-IN')}</> : 'Quoted for your school'}
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

      <section className="section" data-theme="paper" aria-labelledby="compare-title">
        <div className="container">
          <h2 className="display block-title" id="compare-title" data-animate="fade-up">Features by plan</h2>
          <div className="compare" data-animate="in">
            <table>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  {pricing.plans.map((p) => (
                    <th scope="col" key={p.id} className={p.id === current.id ? 'is-active' : undefined}>{p.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricing.features.map((f, r) => (
                  <tr key={f.name} style={{ '--r': r }}>
                    <th scope="row">{f.name}</th>
                    {pricing.plans.map((p, c) => (
                      <td key={p.id} className={p.id === current.id ? 'is-active' : undefined} style={{ '--c': c }}>
                        {f.plans.includes(p.id) ? (
                          <svg className="compare__yes" viewBox="0 0 16 16" role="img" aria-label="Included"><path d="M3 8.5l3.2 3L13 4.5" /></svg>
                        ) : (
                          <span className="compare__no" aria-label="Not included">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

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
