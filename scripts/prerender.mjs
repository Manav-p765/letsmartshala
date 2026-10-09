// Prerender: after `vite build`, load every route in a real browser and save
// its rendered HTML as dist/<route>/index.html — so crawlers, link previews
// and slow connections get real content and the right <title>/meta per page.
// The app still boots normally on top (createRoot replaces the markup).
//
// Also writes dist/app.html (the plain SPA shell, used for unknown URLs),
// dist/sitemap.xml and dist/robots.txt.
//
// Pages are captured with reduced motion, so no element is saved mid-entrance
// (hidden or offset) — the static HTML shows everything at rest.
//
// Usage: npm run build   (runs `vite build && node scripts/prerender.mjs`)
import { chromium } from 'playwright';
import { preview } from 'vite';
import { copyFileSync, mkdirSync, writeFileSync } from 'node:fs';

const SITE = 'https://letssmartshala.com';
// [route, indexed?]
const ROUTES = [
  ['/', true], ['/features', true], ['/solutions', true], ['/pricing', true],
  ['/about', true], ['/contact', true], ['/security', true], ['/demo', true],
  ['/thank-you', false], ['/privacy', false], ['/terms', false], ['/refunds', false]
];

copyFileSync('dist/index.html', 'dist/app.html');

// No browser available (e.g. a CI image without Chromium's libraries)?
// Ship the plain SPA rather than fail the deploy — it works, just without
// per-page static HTML.
let browser;
try {
  browser = await chromium.launch();
} catch (e) {
  console.warn('[prerender] skipped — could not start Chromium:', e.message.split('\n')[0]);
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
  const dir = route === '/' ? 'dist' : `dist${route}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, html);
  console.log('prerendered', route, '—', await page.title());
}

await browser.close();
await new Promise((r) => server.httpServer.close(r));

const today = new Date().toISOString().slice(0, 10);
writeFileSync('dist/sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${ROUTES.filter(([, i]) => i).map(([r]) => `  <url><loc>${SITE}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`);
writeFileSync('dist/robots.txt', `User-agent: *
Allow: /
Disallow: /thank-you

Sitemap: ${SITE}/sitemap.xml
`);

if (errors.length) {
  console.error('Page errors while prerendering:\n' + errors.join('\n'));
  process.exit(1);
}
console.log('sitemap.xml, robots.txt, app.html written');
