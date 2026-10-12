/**
 * Blog posts. Each post is one JSON file in content/blog/, written by the
 * admin panel (/admin → api/admin.js commits it to GitHub → Vercel rebuilds).
 * Only `status: "published"` posts appear on the site.
 *
 * Shape: { slug, title, excerpt, date: "YYYY-MM-DD", author, tags: [],
 *          status: "published" | "draft", cover: "/blog-media/x.jpg" | "",
 *          body: markdown }
 */
const files = import.meta.glob('/content/blog/*.json', { eager: true, import: 'default' });

export const posts = Object.values(files)
  .filter((p) => p.status === 'published')
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export const findPost = (slug) => posts.find((p) => p.slug === slug);

/** ~200 words a minute, at least one. */
export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).length / 200));

export const formatDate = (d) =>
  new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
