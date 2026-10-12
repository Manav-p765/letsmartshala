/**
 * /api/admin?action=… — the blog admin's backend.
 *
 *   GET  me                      → { ok, authed, storage }
 *   POST login   { password }    → sets the session cookie
 *   POST logout
 *   GET  list                    → { posts: [...] } (drafts included)
 *   POST save    { post, previousSlug? }
 *   POST delete  { slug }
 *   POST upload  { name, data }  → { path } — data is a base64 image
 *
 * Storage: in production, posts are committed to the GitHub repo
 * (content/blog/<slug>.json, images in public/blog-media/), and Vercel
 * rebuilds the site from that push — so a saved post is live in about a
 * minute, with no database. In local dev without a GitHub token, the same
 * actions write straight to the files on disk.
 *
 * Environment (Vercel → Settings → Environment Variables):
 *   ADMIN_PASSWORD   the admin login password (required in production)
 *   ADMIN_SECRET     signs the session cookie (defaults to ADMIN_PASSWORD)
 *   GITHUB_TOKEN     fine-grained token: Contents read/write on the repo
 *   GITHUB_REPO      "owner/repo", default Manav-p765/letsmartshala
 *   GITHUB_BRANCH    default main
 */
import crypto from 'node:crypto';

const POSTS_DIR = 'content/blog';
const MEDIA_DIR = 'public/blog-media';
const SESSION_HOURS = 12;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

const isProd = Boolean(process.env.VERCEL);
const password = process.env.ADMIN_PASSWORD || (isProd ? '' : 'admin');
const secret = process.env.ADMIN_SECRET || password;

// ---------- auth ----------
const sign = (v) => crypto.createHmac('sha256', secret).update(v).digest('base64url');
const safeEqual = (a, b) => {
  const x = Buffer.from(String(a)), y = Buffer.from(String(b));
  return x.length === y.length && crypto.timingSafeEqual(x, y);
};
function sessionCookie(value, maxAge) {
  return `ss_admin=${value}; Path=/api/admin; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${isProd ? '; Secure' : ''}`;
}
function authed(req) {
  const m = /(?:^|;\s*)ss_admin=([^;]+)/.exec(req.headers.cookie || '');
  if (!m || !secret) return false;
  const [exp, sig] = m[1].split('.');
  return Boolean(exp && sig) && Number(exp) > Date.now() && safeEqual(sig, sign(exp));
}

// ---------- validation ----------
const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 80);
const str = (v, max) => String(v ?? '').trim().slice(0, max);
function cleanPost(p) {
  const post = {
    slug: slugify(p.slug || p.title),
    title: str(p.title, 160),
    excerpt: str(p.excerpt, 300),
    date: /^\d{4}-\d{2}-\d{2}$/.test(p.date) ? p.date : new Date().toISOString().slice(0, 10),
    author: str(p.author, 80) || 'SmartShala team',
    tags: (Array.isArray(p.tags) ? p.tags : String(p.tags || '').split(',')).map((t) => str(t, 30)).filter(Boolean).slice(0, 5),
    status: p.status === 'published' ? 'published' : 'draft',
    cover: /^\/blog-media\/[\w.-]+$/.test(p.cover || '') ? p.cover : '',
    body: String(p.body ?? '').slice(0, 100_000)
  };
  const errors = [];
  if (post.title.length < 3) errors.push('Title is too short.');
  if (!post.slug) errors.push('Slug is empty.');
  if (post.status === 'published' && post.body.trim().length < 20) errors.push('Write the post before publishing it.');
  return { post, errors };
}

// ---------- storage: GitHub (production) or local files (dev) ----------
const gh = {
  repo: process.env.GITHUB_REPO || 'Manav-p765/letsmartshala',
  branch: process.env.GITHUB_BRANCH || 'main',
  async call(path, init = {}) {
    const r = await fetch(`https://api.github.com/repos/${this.repo}/contents/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
        ...(init.headers || {})
      }
    });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error(`GitHub ${r.status}: ${(await r.text()).slice(0, 200)}`);
    return r.json();
  },
  async list() {
    const dir = (await this.call(`${POSTS_DIR}?ref=${this.branch}`)) || [];
    const files = dir.filter((f) => f.name.endsWith('.json'));
    return Promise.all(files.map(async (f) => {
      const full = await this.call(`${f.path}?ref=${this.branch}`);
      return JSON.parse(Buffer.from(full.content, 'base64').toString('utf8'));
    }));
  },
  async sha(path) {
    return (await this.call(`${path}?ref=${this.branch}`))?.sha;
  },
  async put(path, contentB64, message) {
    const sha = await this.sha(path);
    await this.call(path, { method: 'PUT', body: JSON.stringify({ message, content: contentB64, branch: this.branch, ...(sha ? { sha } : {}) }) });
  },
  async remove(path, message) {
    const sha = await this.sha(path);
    if (sha) await this.call(path, { method: 'DELETE', body: JSON.stringify({ message, sha, branch: this.branch }) });
  }
};

const local = {
  async fs() { return import('node:fs/promises'); },
  async list() {
    const fs = await this.fs();
    const names = (await fs.readdir(POSTS_DIR).catch(() => [])).filter((n) => n.endsWith('.json'));
    return Promise.all(names.map(async (n) => JSON.parse(await fs.readFile(`${POSTS_DIR}/${n}`, 'utf8'))));
  },
  async put(path, contentB64) {
    const fs = await this.fs();
    await fs.mkdir(path.split('/').slice(0, -1).join('/'), { recursive: true });
    await fs.writeFile(path, Buffer.from(contentB64, 'base64'));
  },
  async remove(path) {
    const fs = await this.fs();
    await fs.rm(path, { force: true });
  }
};

const store = process.env.GITHUB_TOKEN ? gh : isProd ? null : local;
const storageName = process.env.GITHUB_TOKEN ? 'github' : isProd ? 'none' : 'local';

// ---------- handler ----------
export default async function handler(req, res) {
  const action = new URL(req.url, 'http://x').searchParams.get('action') || '';
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};
  const send = (code, data) => res.status(code).json(data);
  res.setHeader('Cache-Control', 'no-store');

  if (action === 'me') return send(200, { ok: true, authed: authed(req), storage: storageName, configured: Boolean(password) });

  if (action === 'login' && req.method === 'POST') {
    if (!password) return send(503, { ok: false, error: 'ADMIN_PASSWORD is not set on the server.' });
    // A small fixed delay makes guessing slow without any state.
    await new Promise((r) => setTimeout(r, 600));
    if (!safeEqual(body.password || '', password)) return send(401, { ok: false, error: 'Wrong password.' });
    const exp = String(Date.now() + SESSION_HOURS * 3600_000);
    res.setHeader('Set-Cookie', sessionCookie(`${exp}.${sign(exp)}`, SESSION_HOURS * 3600));
    return send(200, { ok: true });
  }

  if (action === 'logout') {
    res.setHeader('Set-Cookie', sessionCookie('', 0));
    return send(200, { ok: true });
  }

  if (!authed(req)) return send(401, { ok: false, error: 'Please sign in again.' });
  if (!store) return send(503, { ok: false, error: 'GITHUB_TOKEN is not set on the server, so posts can’t be saved.' });

  try {
    if (action === 'list') {
      const posts = (await store.list()).sort((a, b) => (a.date < b.date ? 1 : -1));
      return send(200, { ok: true, posts });
    }

    if (action === 'save' && req.method === 'POST') {
      const { post, errors } = cleanPost(body.post || {});
      if (errors.length) return send(400, { ok: false, error: errors.join(' ') });
      const existing = await store.list();
      const prev = slugify(body.previousSlug || '');
      if (existing.some((p) => p.slug === post.slug) && post.slug !== prev) {
        return send(409, { ok: false, error: `Another post already uses the address “${post.slug}”. Change the slug.` });
      }
      const json = Buffer.from(JSON.stringify(post, null, 2) + '\n').toString('base64');
      await store.put(`${POSTS_DIR}/${post.slug}.json`, json, `Blog: ${post.status === 'published' ? 'publish' : 'save draft'} “${post.title}”`);
      if (prev && prev !== post.slug) await store.remove(`${POSTS_DIR}/${prev}.json`, `Blog: rename ${prev} → ${post.slug}`);
      return send(200, { ok: true, post });
    }

    if (action === 'delete' && req.method === 'POST') {
      const slug = slugify(body.slug || '');
      if (!slug) return send(400, { ok: false, error: 'No post given.' });
      await store.remove(`${POSTS_DIR}/${slug}.json`, `Blog: delete ${slug}`);
      return send(200, { ok: true });
    }

    if (action === 'upload' && req.method === 'POST') {
      const m = /^data:(image\/(?:jpeg|png|webp));base64,(.+)$/.exec(body.data || '');
      if (!m) return send(400, { ok: false, error: 'Upload a JPG, PNG or WebP image.' });
      const bytes = Buffer.byteLength(m[2], 'base64');
      if (bytes > MAX_IMAGE_BYTES) return send(413, { ok: false, error: 'That image is over 2.5 MB — please use a smaller one.' });
      const base = slugify(String(body.name || 'image').replace(/\.[a-z]+$/i, '')) || 'image';
      const file = `${base}-${Date.now().toString(36)}.${IMAGE_TYPES[m[1]]}`;
      await store.put(`${MEDIA_DIR}/${file}`, m[2], `Blog: upload ${file}`);
      return send(200, { ok: true, path: `/blog-media/${file}` });
    }

    return send(404, { ok: false, error: 'Unknown action.' });
  } catch (e) {
    console.error('[admin]', action, e);
    return send(502, { ok: false, error: 'Couldn’t reach storage. Try again in a minute.' });
  }
}
