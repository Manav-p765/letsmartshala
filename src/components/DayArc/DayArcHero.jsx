/**
 * HOME HERO — "the whole school day, on one arc".
 *
 * What the viewer sees: a wide blue arch rises over the headline like the
 * sun's path. A small sun travels along it from 7:30 AM to 4:30 PM, a clock
 * riding with it. As the sun passes each moment of the day, a card from the
 * CRM floats up on the arc at that spot: staff punched in, attendance marked,
 * fees collected, report ready. Then the day replays from another chair:
 * the principal's day, the teacher's day, the accountant's day. Same school,
 * same system, each person seeing their own part of it.
 *
 * Motion is one GSAP timeline per day. It pauses while the hero is off
 * screen, and auto-advance stops for good the moment someone picks a role.
 * Reduced motion: the whole day is shown at rest (every card visible, sun at
 * the end of the day) and role switches swap the cards instantly.
 */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { makeArc, placeCards } from './arcGeometry.js';
import { roles, TICKS, dayFraction, clockAt } from '../../data/dayArc.js';
import { prefersReducedMotion, hasFinePointer } from '../../lib/motion.js';
import './DayArcHero.css';

const NARROW = '(max-width: 900px)';
const DAY_SECONDS = 6.5;   // one school day, sun from start to end
const HOLD_SECONDS = 3.2;  // pause on the finished day before the next role

const to12h = (t) => clockAt(dayFraction(t));

export default function DayArcHero() {
  const stageRef = useRef(null);
  const svgRef = useRef(null);
  const sunRef = useRef(null);
  const clockRef = useRef(null);
  const progressRef = useRef(null);
  const cardsRef = useRef(null);
  const rolesRef = useRef(null);
  const copyRef = useRef(null);

  const [arc, setArc] = useState(null);
  const [narrow, setNarrow] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);

  const fRef = useRef(0);            // where the sun is now (0..1 of the day)
  const arcRef = useRef(null);       // latest arc, read by the running timeline
  const autoRef = useRef(true);      // auto-advance until the visitor chooses
  const introDoneRef = useRef(false);
  const tlRef = useRef(null);

  const role = roles[roleIndex];

  // ---- Measure the stage and the copy, then rebuild the arc ----
  // Runs on resize, when the narrow breakpoint flips, and when webfonts
  // land (they change the headline's size, so the cards' keep-out box).
  const measure = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const isNarrow = window.matchMedia(NARROW).matches;
    setNarrow(isNarrow);
    const s = stage.getBoundingClientRect();
    const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) * 16 || 72;

    // The copy's real ink box: union of its children, in stage pixels.
    const kids = [...copyRef.current.children].map((el) => el.getBoundingClientRect());
    const copy = {
      l: Math.min(...kids.map((r) => r.left)) - s.left,
      r: Math.max(...kids.map((r) => r.right)) - s.left,
      t: Math.min(...kids.map((r) => r.top)) - s.top,
      b: Math.max(...kids.map((r) => r.bottom)) - s.top
    };
    const cardsTop = cardsRef.current.getBoundingClientRect().top - s.top;
    // offset* sizes ignore GSAP's entrance scale, so hidden cards measure true.
    const sample = cardsRef.current.querySelector('.day-card__body');
    const card = { w: sample?.offsetWidth || 216, h: sample?.offsetHeight || 96 };

    const next = makeArc({ w: s.width, h: s.height, narrow: isNarrow, navH: navH + 14, cardsTop });
    next.copy = copy;
    next.card = card;
    next.minTop = navH + 22;
    setArc(next);
  }, []);

  useLayoutEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stageRef.current);
    ro.observe(copyRef.current);
    document.fonts?.ready.then(measure);
    const mq = window.matchMedia(NARROW);
    mq.addEventListener('change', measure);
    return () => {
      ro.disconnect();
      mq.removeEventListener('change', measure);
    };
  }, [measure]);

  // The narrow layout moves the card row, so measure again once it applies.
  useLayoutEffect(() => measure(), [narrow, measure]);

  // Card spots on the arc for the current role (wide screens only).
  const spots = useMemo(() => {
    if (!arc || narrow) return null;
    return placeCards(arc, role.events.map((e) => dayFraction(e.time)), arc.card, arc.copy, arc.minTop);
  }, [arc, narrow, role]);

  // ---- Put the sun, the progress stroke and the clock at fraction f ----
  // Reads the arc through a ref: a day that is mid-play must follow the
  // arc as it is now, not the one that existed when the day started.
  arcRef.current = arc;
  const placeSun = useCallback(
    (f) => {
      fRef.current = f;
      const arc = arcRef.current;
      if (!arc) return;
      const p = arc.at(f);
      const sun = sunRef.current;
      if (sun) {
        sun.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
        // Low on the arc the clock would collide with the end cards or the
        // screen edge, so it moves to the inside of the curve.
        const low = p.y > arc.cy - arc.ry * 0.35;
        sun.dataset.clock = !low ? 'above' : p.x < arc.cx ? 'right' : 'left';
      }
      if (progressRef.current) progressRef.current.style.strokeDashoffset = String(1 - f);
      if (clockRef.current) clockRef.current.textContent = clockAt(f);
      rolesRef.current?.style.setProperty('--day', f.toFixed(4));
    },
    []
  );

  // Keep the sun on the curve when the arc is rebuilt by a resize.
  useLayoutEffect(() => placeSun(fRef.current), [arc, placeSun]);

  // ---- Play one day for the current role ----
  useLayoutEffect(() => {
    if (!arc) return;
    const cards = gsap.utils.toArray('.day-card__body', cardsRef.current);
    const fractions = role.events.map((e) => dayFraction(e.time));

    if (prefersReducedMotion()) {
      gsap.set(cards, { autoAlpha: 1, y: 0, scale: 1 });
      placeSun(1);
      return;
    }

    const proxy = { f: 0 };
    let shown = 0;
    const tl = gsap.timeline({
      onComplete: () => {
        if (autoRef.current) setRoleIndex((i) => (i + 1) % roles.length);
      }
    });

    gsap.set(cards, { autoAlpha: 0, y: 14, scale: 0.94 });
    gsap.set(svgRef.current.querySelectorAll('.arc__pin'), { autoAlpha: 0 });
    placeSun(0);

    if (!introDoneRef.current) {
      introDoneRef.current = true;
      const lines = copyRef.current.querySelectorAll('.line-mask > *');
      const rest = copyRef.current.querySelectorAll('[data-intro]');
      tl.fromTo(lines, { yPercent: 110 }, { yPercent: 0, duration: 1.1, stagger: 0.09, ease: 'power4.out' }, 0)
        .fromTo(rest, { y: 18, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, stagger: 0.08, ease: 'power3.out' }, 0.35)
        .fromTo('.arc__band, .arc__track', { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.2)
        .fromTo([sunRef.current, '.arc__tick'], { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6, stagger: 0.04 }, 1.1)
        .fromTo(rolesRef.current, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out' }, 0.9);
    }

    tl.to(proxy, {
      f: 1,
      duration: DAY_SECONDS,
      ease: 'sine.inOut',
      onUpdate: () => {
        placeSun(proxy.f);
        while (shown < cards.length && proxy.f >= fractions[shown]) {
          gsap.to(cards[shown], { autoAlpha: 1, y: 0, scale: 1, duration: 0.7, ease: 'back.out(1.6)' });
          const pin = svgRef.current?.querySelector(`[data-pin="${shown}"]`);
          if (pin) gsap.to(pin, { autoAlpha: 1, duration: 0.5 });
          shown++;
        }
      }
    }, introDoneRef.current && tl.duration() ? 1.3 : 0.2);

    tl.to({}, { duration: HOLD_SECONDS });
    tlRef.current = tl;
    return () => tl.kill();
    // The arc object changes on resize; the day must not restart for that.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roleIndex, !!arc]);

  // ---- Pause the day while the hero is off screen ----
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => {
      const tl = tlRef.current;
      if (!tl) return;
      entry.isIntersecting ? tl.resume() : tl.pause();
    });
    io.observe(stageRef.current);
    return () => io.disconnect();
  }, []);

  // ---- Cards drift a little against the pointer (mouse/trackpad only) ----
  useEffect(() => {
    if (narrow || !hasFinePointer() || prefersReducedMotion()) return;
    const stage = stageRef.current;
    const floats = gsap.utils.toArray('.day-card__float', stage);
    const movers = floats.map((el, i) => {
      const depth = 6 + (i % 3) * 5;
      return {
        depth,
        x: gsap.quickTo(el, 'x', { duration: 1.1, ease: 'power3.out' }),
        y: gsap.quickTo(el, 'y', { duration: 1.1, ease: 'power3.out' })
      };
    });
    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      const dx = (e.clientX - r.left) / r.width - 0.5;
      const dy = (e.clientY - r.top) / r.height - 0.5;
      movers.forEach((m) => { m.x(-dx * m.depth * 2); m.y(-dy * m.depth * 2); });
    };
    stage.addEventListener('pointermove', onMove);
    return () => stage.removeEventListener('pointermove', onMove);
  }, [narrow, roleIndex]);

  const choose = (i) => {
    autoRef.current = false;
    if (i === roleIndex) {
      tlRef.current?.restart();
      return;
    }
    setRoleIndex(i);
  };

  return (
    <section className="hero section" data-theme="paper" aria-labelledby="hero-title">
      <div className="ruled" aria-hidden="true" />

      <div className={`hero__stage${narrow ? ' is-narrow' : ''}`} ref={stageRef}>
        {arc && (
          <svg
            ref={svgRef}
            className="arc"
            width={arc.w}
            height={arc.h}
            viewBox={`0 0 ${arc.w} ${arc.h}`}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="arc-band" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="var(--blue)" stopOpacity="0.04" />
                <stop offset="0.5" stopColor="var(--blue)" stopOpacity="0.13" />
                <stop offset="1" stopColor="var(--blue)" stopOpacity="0.04" />
              </linearGradient>
            </defs>
            <path className="arc__glow" d={arc.d} />
            <path className="arc__band" d={arc.d} pathLength="1" stroke="url(#arc-band)" />
            <path className="arc__track" d={arc.d} pathLength="1" />
            <path className="arc__progress" d={arc.d} pathLength="1" ref={progressRef} />
            {TICKS.map((t) => {
              const p = arc.at(dayFraction(t));
              return <circle className="arc__tick" key={t} cx={p.x} cy={p.y} r="3" />;
            })}
            {/* Connectors for cards that had to step off the arc. */}
            {spots?.map((c, i) =>
              c.visible && c.pushed ? (
                <g className="arc__pin" key={`${role.id}-pin-${i}`} data-pin={i}>
                  <line x1={c.ax} y1={c.ay} x2={c.x} y2={c.y} />
                  <circle cx={c.ax} cy={c.ay} r="4" />
                </g>
              ) : null
            )}
          </svg>
        )}

        <div className="arc__sun" ref={sunRef} aria-hidden="true">
          <span className="arc__sun-dot" />
          <span className="arc__clock" ref={clockRef}>7:30 AM</span>
        </div>

        <div className="hero__copy container" ref={copyRef}>
          <p className="label hero__eyebrow" data-intro>
            School management CRM<span className="hero__eyebrow-more"> · Built for Indian schools</span>
          </p>
          <h1 id="hero-title" className="display hero__title">
            <span className="line-mask"><span>The whole school day,</span></span>
            <span className="line-mask"><span>in <em className="serif hi">one</em> system.</span></span>
          </h1>
          <p className="lede hero__lede" data-intro>
            Admissions, attendance, fees, exams, transport and payroll, connected. The principal,
            teachers and accountant finally work from the same numbers.
          </p>
          <div className="hero__ctas" data-intro>
            <Link className="btn" to="/demo">
              Book a demo <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn--ghost" to="/features">See every module</Link>
          </div>
        </div>

        {/* Cards: on wide screens they ride the arc; on narrow ones they
            become a swipeable row under the buttons. */}
        <ol
          className="day-cards"
          ref={cardsRef}
          aria-label={`A sample school day for the ${role.label.toLowerCase()}`}
        >
          {role.events.map((e, i) => {
            const c = spots?.[i];
            return (
              <li
                key={`${role.id}-${i}`}
                className={`day-card${c && !c.visible ? ' is-off' : ''}`}
                style={c ? { left: `${c.x}px`, top: `${c.y}px` } : undefined}
              >
                <div className="day-card__float" style={{ '--i': i }}>
                  <article className="day-card__body">
                    <header>
                      <time className="day-card__time" dateTime={e.time}>{to12h(e.time)}</time>
                      <span className={`chip chip--${e.tone}`}>{e.chip}</span>
                    </header>
                    <p className="day-card__title">{e.title}</p>
                    <p className="day-card__value">{e.value}</p>
                  </article>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="hero__roles container" ref={rolesRef}>
        <p className="label" id="role-label">Watch the day as</p>
        <div className="role-switch" role="group" aria-labelledby="role-label">
          {roles.map((r, i) => (
            <button
              key={r.id}
              type="button"
              className="role-switch__btn"
              aria-pressed={i === roleIndex}
              onClick={() => choose(i)}
            >
              {r.label}
              <span className="role-switch__fill" aria-hidden="true" />
            </button>
          ))}
        </div>
        <p className="hero__note">Sample data, shown for illustration.</p>
      </div>
    </section>
  );
}
