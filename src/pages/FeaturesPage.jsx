/**
 * /features — every module, shown working.
 *
 * What the viewer sees: under the header, a sticky bar of all ten modules
 * that highlights whichever one is on screen. Each module is a row: the
 * words on one side (what it does, a two-column checklist) and on the other
 * a SmartShala app window showing that screen. When the row scrolls in,
 * the window's rows slide in, numbers count up and bars fill. Rows
 * alternate sides and surfaces so ten modules don't read as one long list.
 */
import { useEffect, useRef, useState } from 'react';
import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import { screens as tourScreens } from '../components/Home/Tour.jsx';
import { moreScreens } from '../components/Features/moreScreens.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { features } from '../data/pages.js';
import { tour } from '../data/tour.js';
import { prefersReducedMotion } from '../lib/motion.js';
import '../components/Home/Tour.css';
import './Pages.css';
import './FeaturesPage.css';

const slug = (s) => s.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, '');

/** The app window for one module; plays its entrance once it's on screen. */
function FeatureWindow({ group }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) { setOn(true); return; }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setOn(true); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  const t = tour.find((m) => m.id === group.screen);
  const more = moreScreens[group.screen];
  const Screen = t ? tourScreens[t.id] : more.Screen;
  const title = t ? t.screen.title || t.screen.name : more.title;
  const sub = t ? t.screen.sub || t.name : more.sub;

  return (
    <div className="fx-win" ref={ref} aria-hidden="true">
      <div className="win">
        <div className="win__bar"><i /><i /><i /><span>app.smartshala · {group.name}</span></div>
        <div className="win__main fx-win__main">
          <div className={`scr${on ? ' is-active' : ''}`}>
            <header className="scr__head">
              <div><h3>{title}</h3><span>{sub}</span></div>
            </header>
            <Screen s={t?.screen} active={on} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  usePageMeta({ title: 'Features', description: features.meta, path: '/features' });
  const revealRef = useReveal();
  const [current, setCurrent] = useState(slug(features.groups[0].name));
  const barRef = useRef(null);

  // Highlight the module whose row is in the middle band of the screen,
  // and keep its chip scrolled into view on narrow screens.
  useEffect(() => {
    const rows = document.querySelectorAll('.fx-row');
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && setCurrent(e.target.id));
    }, { rootMargin: '-45% 0px -50% 0px' });
    rows.forEach((r) => io.observe(r));
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    const chip = barRef.current?.querySelector(`[href="#${current}"]`);
    const bar = barRef.current;
    if (chip && bar) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.offsetWidth / 2, behavior: 'smooth' });
  }, [current]);

  return (
    <div ref={revealRef}>
      <PageHero id="features-title" eyebrow={features.eyebrow} title={features.title} lede={features.lede} />

      {/* The bar is sticky only within this wrapper, so it leaves with the last module. */}
      <div className="fx-modules">
      <nav className="fx-bar" aria-label="Modules">
        <div className="container">
          <div className="fx-bar__track" ref={barRef}>
            {features.groups.map((g) => {
              const id = slug(g.name);
              return (
                <a key={id} href={`#${id}`} className={id === current ? 'is-on' : ''} aria-current={id === current ? 'true' : undefined}>
                  <ModuleIcon name={g.icon} />{g.short}
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {features.groups.map((g, i) => (
        <section
          key={g.name}
          id={slug(g.name)}
          className={`section fx-row${i % 2 ? ' fx-row--flip' : ''}`}
          data-theme={i % 2 ? 'white' : 'paper'}
          aria-labelledby={`${slug(g.name)}-title`}
        >
          <div className="container fx-row__grid">
            <div className="fx-row__copy" data-animate="fade-up">
              <span className="fx-row__num">{String(i + 1).padStart(2, '0')} / {String(features.groups.length).padStart(2, '0')}</span>
              <div className="fx-row__head">
                <span className="icon-tile"><ModuleIcon name={g.icon} /></span>
                <h2 id={`${slug(g.name)}-title`}>{g.name}</h2>
              </div>
              <p className="fx-row__line">{g.text}</p>
              <ul className="checks fx-row__checks">{g.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </div>
            <FeatureWindow group={g} />
          </div>
        </section>
      ))}
      </div>

      <CtaBand />
    </div>
  );
}
