/**
 * /blog — the newest post as a wide feature card, the rest in a grid,
 * with a tag filter when there are enough posts to need one.
 */
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/ui/PageHero.jsx';
import PostCover from '../components/Blog/PostCover.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import useReveal from '../hooks/useReveal.js';
import usePageMeta from '../hooks/usePageMeta.js';
import { posts, readingTime, formatDate } from '../data/blog.js';
import './Pages.css';
import './Blog.css';

function PostCard({ post, feature = false }) {
  return (
    <article className={`post-card${feature ? ' post-card--feature' : ''}`}>
      <Link to={`/blog/${post.slug}`} className="post-card__link">
        <PostCover post={post} size={feature ? 'lg' : 'md'} />
        <div className="post-card__body">
          <p className="post-card__meta">
            {post.tags?.[0] && <span className="tag">{post.tags[0]}</span>}
            <span>{formatDate(post.date)} · {readingTime(post.body)} min read</span>
          </p>
          <h2 className="post-card__title">{post.title}</h2>
          <p className="post-card__excerpt">{post.excerpt}</p>
          <span className="post-card__more">Read the post <span aria-hidden="true">→</span></span>
        </div>
      </Link>
    </article>
  );
}

export default function BlogPage() {
  usePageMeta({
    title: 'Blog',
    description: 'Practical notes for Indian school offices: fees, attendance, admissions, exams and running a school with less paperwork.',
    path: '/blog'
  });
  const revealRef = useReveal();
  const tags = useMemo(() => [...new Set(posts.flatMap((p) => p.tags || []))], []);
  const [tag, setTag] = useState('');
  const shown = tag ? posts.filter((p) => p.tags?.includes(tag)) : posts;
  const [first, ...rest] = shown;

  return (
    <div ref={revealRef}>
      <PageHero
        id="blog-title"
        eyebrow="Blog"
        title={['Notes from the', 'school office.']}
        lede="Practical guides on fees, attendance, admissions and exams — for principals and the people who run the office."
      >
        {posts.length > 3 && tags.length > 1 && (
          <div className="blog-tags" role="group" aria-label="Filter by topic">
            <button type="button" className={!tag ? 'is-on' : ''} onClick={() => setTag('')}>All</button>
            {tags.map((t) => (
              <button type="button" key={t} className={tag === t ? 'is-on' : ''} onClick={() => setTag(t)}>{t}</button>
            ))}
          </div>
        )}
      </PageHero>

      <section className="section blog-list" data-theme="white" aria-label="Posts">
        <div className="container">
          {!first && <p className="blog-empty">No posts yet — check back soon.</p>}
          {first && <div data-animate="fade-up"><PostCard post={first} feature /></div>}
          {rest.length > 0 && (
            <div className="blog-grid" data-animate="stagger">
              {rest.map((p) => <PostCard key={p.slug} post={p} />)}
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </div>
  );
}
