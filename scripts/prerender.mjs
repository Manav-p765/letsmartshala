// Prerender: after `vite build`, load every route in a real browser and save
// its rendered HTML as dist/<route>/index.html — so crawlers, link previews
// and slow connections get real content and the right <title>/meta per page.
// The app still boots normally on top (createRoot replaces the markup).
//
// Also writes dist/app.html and dist/404.html (the plain SPA shell),
// dist/sitemap.xml and dist/robots.txt.
//
// Pages are captured with reduced motion, so no element is saved mid-entrance
// (hidden or offset) — the static HTML shows everything at rest.
//
// Usage: npm run build   (runs `vite build && node scripts/prerender.mjs`)
import { chromium } from 'playwright';
import { preview } from 'vite';
import { copyFileSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';

const SITE = 'https://letssmartshala.com';
// [route, indexed?]
const ROUTES = [
  ['/', true], ['/features', true], ['/solutions', true], ['/pricing', true],
  ['/about', true], ['/contact', true], ['/security', true], ['/demo', true],
  ['/thank-you', false], ['/privacy', false], ['/terms', false], ['/refunds', false],
  ['/blog', true],
  // Every published post, from content/blog/*.json.
  ...readdirSync('content/blog')
    .filter((f) => f.endsWith('.json'))
    .map((f) => JSON.parse(readFileSync(`content/blog/${f}`, 'utf8')))
    .filter((p) => p.status === 'published')
    .map((p) => [`/blog/${p.slug}`, true])
];
// Shell-only routes: a real file so direct visits work, never prerendered or listed.
const SHELL_ONLY = ['/admin'];

copyFileSync('dist/index.html', 'dist/app.html');

// Every route gets a real file first — the plain SPA shell — so the host
// serves /demo, /features… directly with no rewrite rules. 404.html is the
// shell too: the app renders its own not-found page. If the browser step
// below runs, it overwrites these with fully rendered HTML.
for (const [route] of ROUTES) {
  if (route === '/') continue;
  mkdirSync(`dist${route}`, { recursive: true });
  copyFileSync('dist/app.html', `dist${route}/index.html`);
}
for (const route of SHELL_ONLY) {
  mkdirSync(`dist${route}`, { recursive: true });
  copyFileSync('dist/app.html', `dist${route}/index.html`);
}
copyFileSync('dist/app.html', 'dist/404.html');

// Written first, so they ship even if the browser step below is skipped.
const today = new Date().toISOString().slice(0, 10);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.filter(([, i]) => i).map(([r]) => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync('dist/robots.txt', `User-agent: *
Allow: /
Disallow: /thank-you
Disallow: /admin

Sitemap: ${SITE}/sitemap.xml
`);

// No browser available (e.g. a CI image without Chromium's libraries)?
// Ship the plain SPA rather than fail the deploy — it works, just without
// per-page static HTML.
// dist/prerender.txt says what happened, so a deploy can be checked from
// outside (curl) without opening the build log.
const report = (text) => writeFileSync('dist/prerender.txt', text + '\n');

// Vercel's build image has no system libraries for Playwright's own Chromium,
// so there we start the self-contained build made for that image instead.
async function launch() {
  if (process.env.VERCEL && process.platform === 'linux') {
    const { default: packed } = await import('@sparticuz/chromium');
    return chromium.launch({ executablePath: await packed.executablePath(), args: packed.args, headless: true });
  }
  return chromium.launch();
}

let browser;
try {
  browser = await launch();
} catch (e) {
  const why = e.message.split('\n')[0];
  console.warn('[prerender] skipped — could not start Chromium:', why);
  report('skipped: ' + why);
  process.exit(0);
}
const server = await preview({ preview: { port: 4179, strictPort: true }, logLevel: 'silent' });
const base = 'http://localhost:4179';
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));

for (const [route] of ROUTES) {
  await page.goto(base + route, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('#main')?.children.length > 0);
  await page.waitForTimeout(400);
  let html = await page.content();
  // Runtime-only bits that shouldn't be baked into the static file.
  html = html.replace(/ class="js"/, '').replace(/<html([^>]*) class="lenis[^"]*"/, '<html$1');
  // Links the app added for this page's own code and styles carry the
  // preview server's address; make them relative so they work when deployed.
  html = html.replaceAll(base, '');
  // Marks the file as saved HTML until the app takes over (see global.css, main.jsx).
  html = html.replace('<html ', '<html data-static ');
  if (!html.includes('<html data-static ')) throw new Error('could not mark ' + route + ' as static');
  const dir = route === '/' ? 'dist' : `dist${route}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, html);
  console.log('prerendered', route, '—', await page.title());
}

await browser.close();
await new Promise((r) => server.httpServer.close(r));

if (errors.length) {
  console.error('Page errors while prerendering:\n' + errors.join('\n'));
  report('failed: page errors');
  process.exit(1);
}
report(`ok: ${ROUTES.length} pages`);
console.log('prerender done');
