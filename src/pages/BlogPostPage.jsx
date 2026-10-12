/**
 * /blog/:slug — one post. Markdown body rendered with `marked`; links to
 * other pages on this site stay inside the app. Ends with the demo ask and
 * up to two more posts. Unknown slugs fall through to the 404 page.
 */
import { useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { marked } from 'marked';
import PostCover from '../components/Blog/PostCover.jsx';
import ModuleIcon from '../components/ui/ModuleIcon.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { posts, findPost, readingTime, formatDate } from '../data/blog.js';
import { site } from '../data/site.js';
import './Pages.css';
import './Blog.css';

marked.setOptions({ gfm: true, breaks: false });

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = findPost(slug);
  if (!post) return <NotFoundPage />;
  return <Post post={post} />;
}

function Post({ post }) {
  usePageMeta({ title: post.title, description: post.excerpt, path: `/blog/${post.slug}` });
  const revealRef = useReveal();
  const navigate = useNavigate();
  const html = useMemo(() => marked.parse(post.body || ''), [post.body]);
  const more = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const url = `${site.siteUrl}/blog/${post.slug}`;

  // Internal links in the markdown navigate without a full page load.
  const onBodyClick = (e) => {
    const a = e.target.closest('a');
    const href = a?.getAttribute('href');
    if (href && href.startsWith('/') && !e.metaKey && !e.ctrlKey) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <div ref={revealRef}>
      <article className="section post" data-theme="paper" aria-labelledby="post-title">
        <div className="linework" aria-hidden="true" />
        <div className="container post__wrap">
          <Link to="/blog" className="post__back">← All posts</Link>
          <header className="post__head" data-animate="fade-up">
            <p className="post-card__meta">
              {post.tags?.map((t) => <span className="tag" key={t}>{t}</span>)}
            </p>
            <h1 className="display post__title" id="post-title">{post.title}</h1>
            <p className="post__excerpt">{post.excerpt}</p>
            <p className="post__byline">
              {post.author} · <time dateTime={post.date}>{formatDate(post.date)}</time> · {readingTime(post.body)} min read
            </p>
          </header>
          <div data-animate="fade-up"><PostCover post={post} size="xl" /></div>

          <div className="prose" onClick={onBodyClick} dangerouslySetInnerHTML={{ __html: html }} />

          <footer className="post__foot">
            <span className="label">Share</span>
            <a href={`https://wa.me/?text=${encodeURIComponent(post.title + ' ' + url)}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} target="_blank" rel="noreferrer">LinkedIn</a>
          </footer>

          <aside className="post__cta">
            <span className="icon-tile"><ModuleIcon name="reports" /></span>
            <div>
              <strong>See it with your school’s own data</strong>
              <p>A short call — we’ll walk through the modules your office needs.</p>
            </div>
            <Link className="btn" to="/demo">Book a demo <span className="btn__arrow" aria-hidden="true">→</span></Link>
          </aside>
        </div>
      </article>

      {more.length > 0 && (
        <section className="section" data-theme="white" aria-label="More posts">
          <div className="container">
            <h2 className="display block-title">More from the blog</h2>
            <div className="blog-grid" style={{ marginTop: '1.5rem' }} data-animate="stagger">
              {more.map((p) => (
                <Link key={p.slug} to={`/blog/${p.slug}`} className="post-card post-card__link">
                  <PostCover post={p} />
                  <div className="post-card__body">
                    <p className="post-card__meta"><span>{formatDate(p.date)}</span></p>
                    <h3 className="post-card__title">{p.title}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
