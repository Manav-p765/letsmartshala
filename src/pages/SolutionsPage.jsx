import PageHero from '../components/ui/PageHero.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { solutions } from '../data/pages.js';
import './Pages.css';

/**
 * One block per role, alternating sides. Each has a slightly tilted note
 * on ruled paper — that person's day in one line — which straightens on
 * hover. A quiet nod to the exercise-book texture elsewhere.
 */
export default function SolutionsPage() {
  usePageMeta({ title: 'Solutions', description: solutions.meta, path: '/solutions' });
  const revealRef = useReveal();
  return (
    <div ref={revealRef}>
      <PageHero id="solutions-title" eyebrow={solutions.eyebrow} title={solutions.title} lede={solutions.lede}>
        {solutions.roles.map((r) => (
          <a key={r.id} className="btn btn--ghost btn--small" href={`#${r.id}`}>{r.name.replace('For ', '')}</a>
        ))}
      </PageHero>

      <section className="section" data-theme="white" aria-label="By role">
        <div className="container">
          {solutions.roles.map((r) => (
            <article className="role-block" id={r.id} key={r.id}>
              <div data-animate="fade-up">
                <div className="role-block__head">
                  <span className="icon-tile"><ModuleIcon name={r.icon} /></span>
                  <h2>{r.name}</h2>
                </div>
                <p className="role-block__line">{r.line}</p>
                <ul className="checks">{r.points.map((p) => <li key={p}>{p}</li>)}</ul>
              </div>
              <figure className="role-block__note" data-animate="fade-up">
                <figcaption className="label">A day at this desk</figcaption>
                <blockquote>{r.quote}</blockquote>
              </figure>
            </article>
          ))}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
