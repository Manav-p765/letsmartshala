import usePageMeta from '../hooks/usePageMeta.js';
import { legal } from '../data/legal.js';
import './Pages.css';

/** One template for privacy, terms and refunds. Unreviewed drafts say so, and aren't indexed. */
export default function LegalPage({ doc }) {
  const d = legal[doc];
  usePageMeta({ title: d.title, description: d.meta, path: d.path, noindex: !d.reviewed });
  return (
    <section className="section" data-theme="paper" aria-labelledby="legal-title" style={{ paddingTop: 'calc(var(--nav-h) + 4rem)' }}>
      <div className="container legal">
        {!d.reviewed && (
          <p className="legal__draft" role="note">
            Draft — this page is pending legal review and is not final. Text in [brackets] still needs to be completed.
          </p>
        )}
        <h1 className="display block-title" id="legal-title" style={{ marginTop: '1.5rem' }}>{d.title}</h1>
        <p className="legal__meta">Last updated {d.updated}</p>
        {d.sections.map((s) => (
          <div key={s.h}>
            <h2>{s.h}</h2>
            {s.p.map((p) => <p key={p}>{p}</p>)}
          </div>
        ))}
      </div>
    </section>
  );
}
