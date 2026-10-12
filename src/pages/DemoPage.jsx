/**
 * /demo — the ad landing page. One job: get the demo request.
 *
 * What the viewer sees: the form on the right of the first screen, the
 * pitch on the left, and behind both the home hero's arc, faint, with a few
 * of its day cards resting on it. Below the hero it is a copy of the home
 * page: every home section, in the same order (owner's call, 2026-10-12).
 * Only the hero differs. The closing button scrolls back up to the form.
 */
import LeadForm from '../components/LeadForm/LeadForm.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import Desks from '../components/Home/Desks.jsx';
import Stream from '../components/Home/Stream.jsx';
import Tour from '../components/Home/Tour.jsx';
import Flow from '../components/Home/Flow.jsx';
import India from '../components/Home/India.jsx';
import Security from '../components/Home/Security.jsx';
import Faq from '../components/Home/Faq.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { demo } from '../data/pages.js';
import { site } from '../data/site.js';
import './DemoPage.css';

export default function DemoPage() {
  usePageMeta({ title: 'Book a free demo', description: demo.meta, path: '/demo' });
  const revealRef = useReveal();

  return (
    <div ref={revealRef}>
      <section className="section demo-hero" data-theme="paper" aria-labelledby="demo-title">
        <div className="linework" aria-hidden="true" />
        <svg className="demo-hero__arc" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">
          <path d="M 60 600 A 440 520 0 0 1 940 600" />
        </svg>

        <div className="container demo-hero__grid">
          <div className="demo-hero__copy">
            <p className="label demo-hero__eyebrow" data-animate="fade-up">{demo.eyebrow}</p>
            <h1 className="display demo-hero__title" id="demo-title" data-animate="lines">
              {demo.title.map((l, i) => (
                <span className="line-mask" key={l}>
                  <span>{i === demo.title.length - 1 ? <>{l.replace(demo.accent, '')}<em className="serif hi">{demo.accent}</em></> : l}</span>
                </span>
              ))}
            </h1>
            <p className="lede demo-hero__lede" data-animate="fade-up">{demo.lede}</p>
            <ul className="demo-hero__points" data-animate="stagger">
              {demo.points.map((p) => (
                <li key={p.text}><span className="demo-hero__icon"><ModuleIcon name={p.icon} /></span>{p.text}</li>
              ))}
            </ul>
            <p className="demo-hero__call" data-animate="fade-up">
              Rather talk now? Call or WhatsApp <a href={site.contact.phone.href}>{site.contact.phone.value}</a>
            </p>
          </div>

          <div className="demo-hero__form" data-animate="fade-up">
            <LeadForm />
          </div>
        </div>
      </section>

      {/* From here down it is the home page, section for section. */}
      <Desks />
      <Stream />
      <Tour />
      <Flow />
      <India />
      <Security />
      <Faq />
      <CtaBand toForm />
    </div>
  );
}
