/**
 * /admin — the blog admin. Sign in with the admin password, then list,
 * write, edit, publish and delete posts. The editor writes markdown with a
 * small toolbar and a live preview; covers are uploaded from the computer.
 * Saving commits the post to GitHub and Vercel republishes the site, so a
 * change is live in about a minute. Not indexed, not linked from the site.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { marked } from 'marked';
import { Mark } from '../components/Brand/Brand.jsx';
import PostCover from '../components/Blog/PostCover.jsx';
import usePageMeta from '../hooks/usePageMeta.js';
import './Admin.css';
import './Blog.css';

const api = async (action, body) => {
  const r = await fetch(`/api/admin?action=${action}`, {
    method: body ? 'POST' : 'GET',
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: 'same-origin'
  });
  const data = await r.json().catch(() => ({ ok: false, error: 'The server didn’t answer properly.' }));
  return { status: r.status, ...data };
};

const today = () => new Date().toISOString().slice(0, 10);
const blank = () => ({ slug: '', title: '', excerpt: '', date: today(), author: 'SmartShala team', tags: [], status: 'draft', cover: '', body: '' });
const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 80);

export default function AdminPage() {
  usePageMeta({ title: 'Blog admin', description: 'SmartShala blog admin.', path: '/admin', noindex: true });
  const [me, setMe] = useState(null);

  useEffect(() => { api('me').then(setMe); }, []);

  if (!me) return <div className="adm adm--center"><p>Loading…</p></div>;
  if (!me.authed) return <Login configured={me.configured} onIn={() => api('me').then(setMe)} />;
  return <Dashboard storage={me.storage} onOut={() => api('logout', {}).then(() => api('me').then(setMe))} />;
}

function Login({ configured, onIn }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const r = await api('login', { password });
    setBusy(false);
    r.ok ? onIn() : setError(r.error || 'Couldn’t sign in.');
  };
  return (
    <div className="adm adm--center">
      <form className="adm-login" onSubmit={submit}>
        <span className="adm-login__mark"><Mark tile /></span>
        <h1>Blog admin</h1>
        <p>Sign in to write and publish posts.</p>
        {!configured && <p className="adm-note adm-note--warn">ADMIN_PASSWORD isn’t set on the server yet.</p>}
        <label htmlFor="adm-pw">Password</label>
        <input id="adm-pw" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} autoFocus />
        {error && <p className="adm-error" role="alert">{error}</p>}
        <button className="btn" type="submit" disabled={busy || !password}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <Link to="/" className="adm-login__back">← Back to the website</Link>
      </form>
    </div>
  );
}

function Dashboard({ storage, onOut }) {
  const [posts, setPosts] = useState(null);
  const [editing, setEditing] = useState(null); // { post, previousSlug }
  // Kept in sessionStorage too: in local dev, saving a post file makes Vite
  // reload the page, and the confirmation should survive that.
  const [flash, setFlash] = useState(() => {
    try { const f = sessionStorage.getItem('adm-flash') || ''; sessionStorage.removeItem('adm-flash'); return f; } catch { return ''; }
  });
  const [error, setError] = useState('');

  const load = async () => {
    const r = await api('list');
    if (r.ok) setPosts(r.posts);
    else setError(r.error);
  };
  useEffect(() => { load(); }, []);

  const say = (msg) => {
    setFlash(msg);
    try { sessionStorage.setItem('adm-flash', msg); setTimeout(() => sessionStorage.removeItem('adm-flash'), 3000); } catch { /* ignore */ }
    setTimeout(() => setFlash(''), 6000);
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete “${p.title}”? This can’t be undone from here.`)) return;
    const r = await api('delete', { slug: p.slug });
    if (!r.ok) return setError(r.error);
    say('Deleted. The website updates in about a minute.');
    load();
  };

  return (
    <div className="adm">
      <header className="adm-bar">
        <Link to="/" className="adm-bar__brand"><Mark tile /> SmartShala <span>Blog admin</span></Link>
        <div className="adm-bar__right">
          {storage === 'local' && <span className="adm-pill">Local files (dev)</span>}
          <button type="button" className="btn btn--ghost btn--small" onClick={onOut}>Sign out</button>
        </div>
      </header>

      {flash && <p className="adm-flash" role="status">{flash}</p>}
      {error && <p className="adm-error adm-error--bar" role="alert">{error} <button type="button" onClick={() => setError('')}>Dismiss</button></p>}

      {editing ? (
        <Editor
          initial={editing.post}
          previousSlug={editing.previousSlug}
          takenSlugs={(posts || []).map((p) => p.slug).filter((s) => s !== editing.previousSlug)}
          onCancel={() => setEditing(null)}
          onSaved={(p) => {
            setEditing(null);
            say(p.status === 'published' ? 'Published. It will be live on the website in about a minute.' : 'Draft saved. It isn’t visible on the website.');
            load();
          }}
        />
      ) : (
        <main className="adm-main">
          <div className="adm-head">
            <div>
              <h1>Posts</h1>
              <p>{posts ? `${posts.filter((p) => p.status === 'published').length} published · ${posts.filter((p) => p.status !== 'published').length} drafts` : 'Loading…'}</p>
            </div>
            <button type="button" className="btn" onClick={() => setEditing({ post: blank(), previousSlug: '' })}>+ New post</button>
          </div>
          <ul className="adm-list">
            {posts?.length === 0 && <li className="adm-empty">No posts yet. Write the first one.</li>}
            {posts?.map((p) => (
              <li key={p.slug} className="adm-row">
                <div className="adm-row__cover"><PostCover post={p} /></div>
                <div className="adm-row__main">
                  <strong>{p.title}</strong>
                  <span>{p.date} · /blog/{p.slug}</span>
                </div>
                <span className={`adm-status adm-status--${p.status}`}>{p.status === 'published' ? 'Published' : 'Draft'}</span>
                <div className="adm-row__actions">
                  {p.status === 'published' && <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer">View</a>}
                  <button type="button" onClick={() => setEditing({ post: { ...p }, previousSlug: p.slug })}>Edit</button>
                  <button type="button" className="danger" onClick={() => remove(p)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </main>
      )}
    </div>
  );
}

function Editor({ initial, previousSlug, takenSlugs, onCancel, onSaved }) {
  const [post, setPost] = useState({ ...initial, tags: Array.isArray(initial.tags) ? initial.tags.join(', ') : initial.tags });
  const [slugTouched, setSlugTouched] = useState(Boolean(previousSlug));
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [tab, setTab] = useState('write');
  const bodyRef = useRef(null);
  const fileRef = useRef(null);

  const set = (k, v) => setPost((p) => {
    const next = { ...p, [k]: v };
    if (k === 'title' && !slugTouched) next.slug = slugify(v);
    return next;
  });
  const preview = useMemo(() => marked.parse(post.body || ''), [post.body]);
  const slugTaken = takenSlugs.includes(slugify(post.slug));

  // Wrap the selection (or insert at the cursor) in the textarea.
  const wrap = (before, after = '', placeholder = '') => {
    const ta = bodyRef.current;
    const { selectionStart: s, selectionEnd: e, value } = ta;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    set('body', next);
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + before.length, s + before.length + sel.length); });
  };
  const line = (prefix) => {
    const ta = bodyRef.current;
    const { selectionStart: s, value } = ta;
    const start = value.lastIndexOf('\n', s - 1) + 1;
    set('body', value.slice(0, start) + prefix + value.slice(start));
    requestAnimationFrame(() => { ta.focus(); ta.setSelectionRange(s + prefix.length, s + prefix.length); });
  };

  const upload = async (file, then) => {
    if (!file) return;
    if (file.size > 2.5 * 1024 * 1024) return setError('That image is over 2.5 MB — please use a smaller one.');
    setBusy('upload');
    const data = await new Promise((res) => { const r = new FileReader(); r.onload = () => res(r.result); r.readAsDataURL(file); });
    const r = await api('upload', { name: file.name, data });
    setBusy('');
    if (!r.ok) return setError(r.error);
    then(r.path);
  };

  const save = async (status) => {
    setError('');
    setBusy(status);
    const r = await api('save', {
      previousSlug,
      post: { ...post, status, tags: post.tags.split(',').map((t) => t.trim()).filter(Boolean) }
    });
    setBusy('');
    r.ok ? onSaved(r.post) : setError(r.error);
  };

  return (
    <main className="adm-main adm-editor">
      <div className="adm-head">
        <button type="button" className="adm-link" onClick={onCancel}>← All posts</button>
        <div className="adm-head__actions">
          <button type="button" className="btn btn--ghost" disabled={!!busy} onClick={() => save('draft')}>{busy === 'draft' ? 'Saving…' : 'Save draft'}</button>
          <button type="button" className="btn" disabled={!!busy || slugTaken} onClick={() => save('published')}>{busy === 'published' ? 'Publishing…' : post.status === 'published' && previousSlug ? 'Update post' : 'Publish'}</button>
        </div>
      </div>
      {error && <p className="adm-error" role="alert">{error}</p>}

      <div className="adm-editor__grid">
        <section className="adm-card">
          <input className="adm-title" placeholder="Post title" value={post.title} onChange={(e) => set('title', e.target.value)} aria-label="Title" />
          <textarea className="adm-excerpt" rows={2} placeholder="One or two sentences that sum up the post (shown on the blog page and in link previews)" value={post.excerpt} onChange={(e) => set('excerpt', e.target.value)} aria-label="Summary" maxLength={300} />

          <div className="adm-tabs" role="tablist">
            <button type="button" role="tab" aria-selected={tab === 'write'} onClick={() => setTab('write')}>Write</button>
            <button type="button" role="tab" aria-selected={tab === 'preview'} onClick={() => setTab('preview')}>Preview</button>
          </div>

          {tab === 'write' ? (
            <>
              <div className="adm-toolbar" aria-label="Formatting">
                <button type="button" onClick={() => line('## ')} title="Heading">H2</button>
                <button type="button" onClick={() => line('### ')} title="Sub-heading">H3</button>
                <button type="button" onClick={() => wrap('**', '**', 'bold text')} title="Bold"><b>B</b></button>
                <button type="button" onClick={() => wrap('*', '*', 'italic text')} title="Italic"><i>I</i></button>
                <button type="button" onClick={() => line('- ')} title="Bullet list">• List</button>
                <button type="button" onClick={() => line('1. ')} title="Numbered list">1. List</button>
                <button type="button" onClick={() => line('> ')} title="Quote">“ Quote</button>
                <button type="button" onClick={() => wrap('[', '](https://)', 'link text')} title="Link">Link</button>
                <button type="button" onClick={() => fileRef.current.click()} title="Image" disabled={busy === 'upload'}>{busy === 'upload' ? 'Uploading…' : 'Image'}</button>
                <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files[0], (path) => wrap(`![`, `](${path})`, 'describe the image'))} />
              </div>
              <textarea
                ref={bodyRef}
                className="adm-body"
                value={post.body}
                onChange={(e) => set('body', e.target.value)}
                placeholder={'Write the post here.\n\n## A heading\n\nA paragraph. **Bold**, *italic*, [a link](/demo).\n\n- a list item'}
                aria-label="Post body (markdown)"
              />
              <p className="adm-hint">Formatting uses Markdown. Use the buttons above, or Preview to check how it looks.</p>
            </>
          ) : (
            <div className="prose adm-preview" dangerouslySetInnerHTML={{ __html: preview || '<p>Nothing to preview yet.</p>' }} />
          )}
        </section>

        <aside className="adm-side">
          <div className="adm-card">
            <h2>Cover image</h2>
            <PostCover post={{ ...post, slug: post.slug || 'new', tags: post.tags.split(',').map((t) => t.trim()) }} />
            <div className="adm-side__row">
              <label className="btn btn--ghost btn--small">
                {busy === 'upload' ? 'Uploading…' : post.cover ? 'Replace' : 'Upload image'}
                <input type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={(e) => upload(e.target.files[0], (path) => set('cover', path))} />
              </label>
              {post.cover && <button type="button" className="adm-link" onClick={() => set('cover', '')}>Remove</button>}
            </div>
            <p className="adm-hint">Wide images work best (16:9). Without one, a drawn cover is used.</p>
          </div>

          <div className="adm-card adm-fields">
            <h2>Details</h2>
            <label>Address
              <span className="adm-slug"><span>/blog/</span><input value={post.slug} onChange={(e) => { setSlugTouched(true); set('slug', slugify(e.target.value)); }} /></span>
            </label>
            {slugTaken && <p className="adm-error">Another post already uses this address.</p>}
            <label>Date <input type="date" value={post.date} onChange={(e) => set('date', e.target.value)} /></label>
            <label>Author <input value={post.author} onChange={(e) => set('author', e.target.value)} /></label>
            <label>Tags <input value={post.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Fees, School office" /></label>
            <p className="adm-hint">Separate tags with commas. The first tag shows on the cover.</p>
          </div>
        </aside>
      </div>
    </main>
  );
}
