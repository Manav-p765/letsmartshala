import { Link } from 'react-router-dom';
import usePageMeta from '../hooks/usePageMeta.js';
import './NotFoundPage.css';

export default function NotFoundPage() {
  usePageMeta({ title: 'Page not found', description: 'This page doesn’t exist.', path: '/404', noindex: true });
  return (
    <section className="section notfound" data-theme="paper">
      <div className="ruled" aria-hidden="true" />
      <div className="container notfound__inner">
        <p className="label">Error 404 · Marked absent</p>
        <h1 className="display notfound__title">
          This page didn’t <em className="serif hi">show up</em> today.
        </h1>
        <p className="lede">The link may be old, or the page may have moved.</p>
        <div className="notfound__ctas">
          <Link className="btn" to="/">Back to home</Link>
          <Link className="btn btn--ghost" to="/demo">Book a demo</Link>
        </div>
      </div>
    </section>
  );
}
