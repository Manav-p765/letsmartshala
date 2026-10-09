/**
 * FAQ as a chat. The questions principals ask are chips on the left; tapping
 * one sends it as a message on the right, "SmartShala is typing…" shows for
 * a beat, then the answer arrives — the conversation a school would actually
 * have with us on WhatsApp. The first question is answered already.
 */
import { useEffect, useRef, useState } from 'react';
import SectionHead from '../ui/SectionHead.jsx';
import { Mark } from '../Brand/Brand.jsx';
import useReveal from '../../hooks/useReveal.js';
import { faq } from '../../data/home.js';
import { prefersReducedMotion } from '../../lib/motion.js';
import './Faq.css';

const TYPING_MS = 900;

export default function Faq() {
  const revealRef = useReveal();
  const [thread, setThread] = useState([{ q: 0 }]);   // asked questions, in order
  const [typing, setTyping] = useState(false);
  const logRef = useRef(null);
  const timer = useRef(0);

  const ask = (i) => {
    if (typing) return;
    const wait = prefersReducedMotion() ? 0 : TYPING_MS;
    setThread((t) => [...t.filter((m) => m.q !== i), { q: i, pending: wait > 0 }]);
    if (!wait) return;
    setTyping(true);
    timer.current = setTimeout(() => {
      setTyping(false);
      setThread((t) => t.map((m) => (m.q === i ? { q: i } : m)));
    }, wait);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  // Keep the newest message in view inside the chat (not the page).
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTo({ top: log.scrollHeight, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  }, [thread, typing]);

  const asked = new Set(thread.map((m) => m.q));

  return (
    <section ref={revealRef} className="section section--screen faq" data-theme="white" aria-labelledby="faq-title">
      <div className="container faq__grid">
        <div>
          <SectionHead id="faq-title" eyebrow="Questions" title={['Asked by', 'principals.']} lede="Tap a question. We answer the way we would on WhatsApp — short and straight." />
          <ul className="faq__chips" data-animate="stagger">
            {faq.map((f, i) => (
              <li key={f.q}>
                <button type="button" className={`faq__chip${asked.has(i) ? ' is-asked' : ''}`} onClick={() => ask(i)} aria-controls="faq-log">
                  {f.q}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="chat" data-animate="fade-up">
          <header className="chat__head">
            <span className="chat__avatar"><Mark /></span>
            <div>
              <strong>SmartShala</strong>
              <span>{typing ? 'typing…' : 'Usually replies within a few minutes'}</span>
            </div>
          </header>
          <div className="chat__log" id="faq-log" ref={logRef} aria-live="polite">
            <p className="chat__day">Today</p>
            {thread.map((m) => (
              <div key={m.q} className="chat__pair">
                <p className="bubble bubble--out">{faq[m.q].q}</p>
                {!m.pending && <p className="bubble bubble--in">{faq[m.q].a}</p>}
              </div>
            ))}
            {typing && (
              <p className="bubble bubble--in bubble--typing" aria-label="SmartShala is typing">
                <i /><i /><i />
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
