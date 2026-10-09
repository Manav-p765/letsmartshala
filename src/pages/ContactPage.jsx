import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import LeadForm from '../components/LeadForm/LeadForm.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { contact } from '../data/pages.js';
import { site } from '../data/site.js';
import './Pages.css';

const ways = [
  { icon: 'staff', label: 'Call', field: site.contact.phone },
  { icon: 'announcements', label: 'WhatsApp', field: site.contact.whatsapp, external: true },
  { icon: 'receipt', label: 'Email', field: site.contact.email }
];

export default function ContactPage() {
  usePageMeta({ title: 'Contact', description: contact.meta, path: '/contact' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="contact-title" eyebrow={contact.eyebrow} title={contact.title} lede={contact.lede} />

      <section className="section" data-theme="white" aria-label="Ways to reach us">
        <div className="container contact-grid">
          <div>
            <div className="contact-cards" data-animate="stagger">
              {ways.map((w) => (
                <a
                  key={w.label}
                  className="card"
                  href={w.field.href}
                  {...(w.external ? { target: '_blank', rel: 'noreferrer' } : {})}
                >
                  <span className="icon-tile"><ModuleIcon name={w.icon} /></span>
                  <div><span>{w.label}</span><strong>{w.field.value}</strong></div>
                </a>
              ))}
            </div>
            <p className="contact-hours">{site.legalName} · SmartShala</p>
          </div>
          <div data-animate="fade-up">
            <LeadForm title="Send us your details" note="We’ll call you back — about a demo, pricing or anything else." submit="Send" />
          </div>
        </div>
      </section>
    </div>
  );
}
