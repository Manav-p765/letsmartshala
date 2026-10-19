import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import PageHero from '../components/ui/PageHero.jsx';
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
const capped = pricing.plans.filter((p) => p.cap);
const perStudentAtCap = (p) => Math.round(p.price / p.cap);
const plan = (id) => pricing.plans.find((p) => p.id === id);

// The size slider runs to just past the last cap, so every plan is reachable.
const MIN = 50;
const MAX = 2500;
const STEP = 10;
const at = (n) => (n - MIN) / (MAX - MIN);

// Two chains of cards hanging at the hero's edges (wide screens only): a pin
// under the nav, then string, card, string, card. `len` is each string's
// length in rem.
const card = (id, icon) => ({ icon, label: plan(id).name, title: plan(id).students, value: `${inr(plan(id).price)} / year` });
const FLOATS = [
  { side: 'left', cards: [{ len: 4.5, ...card('starter', 'students') }, { len: 3, icon: 'receipt', label: 'Every plan', title: 'Billed yearly in advance', value: 'GST invoice' }] },
  { side: 'right', cards: [{ len: 3, ...card('growth', 'attendance') }, { len: 3.5, ...card('premium', 'reports') }] }
];

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
    const o = { v: 0 };
    setShown(0);
    const st = ScrollTrigger.create({
      trigger: el, start: 'top 92%', once: true,
      onEnter: () => gsap.to(o, { v: value, duration: 1.2, ease: 'power3.out', onUpdate: () => setShown(Math.round(o.v)) })
    });
    return () => { st.kill(); gsap.killTweensOf(o); setShown(value); };
  }, [value]);
  return <span ref={ref} className="plan__amount">{inr(shown)}</span>;
}

/** The hero's hanging cards: strings drop, cards settle, then a slow sway (CSS). */
function HeroFloats() {
  const ref = useRef(null);
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || prefersReducedMotion() || isStaticBoot() || getComputedStyle(root).display === 'none') return;
    const ctx = gsap.context(() => {
      gsap.from('.price-float__string', { scaleY: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out', delay: 0.3 });
      gsap.from('.price-float__body', { y: -18, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out', delay: 0.75 });
    }, root);
    return () => ctx.revert();
  }, []);
  return (
    <div className="price-floats" ref={ref} aria-hidden="true">
      {FLOATS.map((f, i) => (
        <div className={`price-float price-float--${f.side}`} key={f.side} style={{ '--i': i }}>
          <span className="price-float__pin" />
          {f.cards.map((c) => (
            <Fragment key={c.label}>
              <span className="price-float__string" style={{ '--len': `${c.len}rem` }} />
              <div className="price-float__body">
                <span className="price-float__icon"><ModuleIcon name={c.icon} /></span>
                <span className="price-float__main">
                  <span className="price-float__label">{c.label}</span>
                  <span className="price-float__title">{c.title}</span>
                  <span className="price-float__value">{c.value}</span>
                </span>
              </div>
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Plans and prices from the owner's pricing document (data/pages.js →
 * pricing). The signature moment is the size slider: drag to your number of
 * students and the plan that fits lights up everywhere on the page — its
 * card, its bar in the per-student chart, its column in the table.
 */
export default function PricingPage() {
  usePageMeta({ title: 'Pricing', description: pricing.meta, path: '/pricing' });
  const revealRef = useReveal();
  const [students, setStudents] = useState(450);
  const sliderId = useId();
  const current = planFor(students);
  const price = useCountTo(current.price);
  const perStudent = useCountTo(Math.round(current.price / students));
  const zoneFrom = at(Math.max(current.min, MIN));
  const zoneTo = current.cap ? at(current.cap) : 1;
  const tallest = Math.max(...capped.map(perStudentAtCap));

  return (
    <div ref={revealRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero id="pricing-title" eyebrow={pricing.eyebrow} title={pricing.title} lede={pricing.lede} decor={<HeroFloats />}>
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
            <div className="sizer__track">
              <span className="sizer__zone" style={{ '--from': zoneFrom, '--to': zoneTo }} aria-hidden="true" />
              <input
                id={sliderId}
                className="sizer__range"
                type="range"
                min={MIN}
                max={MAX}
                step={STEP}
                value={students}
                onChange={(e) => setStudents(Number(e.target.value))}
                aria-valuetext={`${students} students: ${current.name} plan`}
                style={{ '--fill': `${at(students) * 100}%` }}
              />
              <div className="sizer__scale" aria-hidden="true">
                {capped.map((p) => (
                  <span key={p.id} className={students > p.cap ? 'is-past' : undefined} style={{ '--at': at(p.cap) }}>
                    {p.cap.toLocaleString('en-IN')}
                  </span>
                ))}
              </div>
            </div>
            <p className="sizer__result" aria-live="polite">
              <span className="sizer__plan" key={current.id}>{current.name}</span>
              {current.from ? (
                <> · from <strong>{inr(price)}</strong> a year, quoted for your school</>
              ) : (
                <> · <strong>{inr(price)}</strong> a year, about <strong>{inr(perStudent)} per student</strong></>
              )}
            </p>
          </div>

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
              Each plan is one yearly price, not a charge for every child. Filled to its limit, each plan works out to:
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
