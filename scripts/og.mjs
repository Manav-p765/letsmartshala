// Renders the link-preview image (public/share/og.png, 1200×630) in a real
// browser with the site's own fonts, logo and palette — what WhatsApp,
// LinkedIn and X show when someone shares a SmartShala link.
// Usage: node scripts/og.mjs
import { chromium } from 'playwright';
import { mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { MARK_PATH } from '../src/components/Brand/markPath.js';

const font = (p) => pathToFileURL(`node_modules/${p}`).href;
const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: Jakarta; src: url(${font('@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2')}); font-weight: 200 800; }
@font-face { font-family: Serif; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}); font-style: italic; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; overflow: hidden; position: relative; font-family: Jakarta; color: #0E1D61;
  background: radial-gradient(ellipse 60% 55% at 50% 105%, rgb(0 61 229 / 0.16), transparent 70%), #F5EFE6; }
.rule { position: absolute; inset: 0; background: repeating-linear-gradient(180deg, transparent 0 39px, rgb(14 29 97 / 0.06) 39px 40px); }
.margin { position: absolute; top: 0; bottom: 0; left: 96px; width: 2px; background: rgb(200 36 44 / 0.18); }
svg.arc { position: absolute; left: 0; top: 0; }
.brand { position: absolute; left: 150px; top: 72px; display: flex; align-items: center; gap: 16px; font-weight: 800; font-size: 40px; letter-spacing: -0.04em; }
.brand svg { width: 38px; height: 44px; color: #003DE5; }
.brand b { color: #003DE5; font-weight: 800; }
h1 { position: absolute; left: 150px; top: 200px; font-size: 80px; line-height: 1.02; letter-spacing: -0.045em; font-weight: 750; }
h1 em { font-family: Serif; font-style: italic; font-weight: 400; color: #84662A; font-size: 1.08em; letter-spacing: -0.01em; }
p { position: absolute; left: 152px; bottom: 74px; font-size: 26px; color: rgb(14 29 97 / 0.66); letter-spacing: -0.01em; }
.sun { position: absolute; width: 22px; height: 22px; border-radius: 50%; background: #003DE5; box-shadow: 0 0 0 8px rgb(0 61 229 / 0.15), 0 0 30px 8px rgb(0 61 229 / 0.35); }
</style></head><body>
<div class="rule"></div><div class="margin"></div>
<svg class="arc" width="1200" height="630" viewBox="0 0 1200 630">
  <path d="M 960 660 A 270 520 0 0 1 1500 660" fill="none" stroke="rgb(0 61 229 / 0.12)" stroke-width="70" style="filter: blur(14px)"/>
  <path d="M 960 660 A 270 520 0 0 1 1500 660" fill="none" stroke="#003DE5" stroke-width="3"/>
</svg>
<span class="sun" style="left: 1093px; top: 189px"></span>
<div class="brand"><svg viewBox="360 330 512 585"><path d="${MARK_PATH}" fill="currentColor" fill-rule="evenodd"/></svg><span>Smart<b>Shala</b></span></div>
<h1>The whole school day,<br>in <em>one</em> system.</h1>
<p>School management CRM for Indian schools · letssmartshala.com</p>
</body></html>`;

mkdirSync('public/share', { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
// Loaded from a file (not setContent) so Chromium allows the local font files.
const tmp = resolve('shots/og.html');
mkdirSync('shots', { recursive: true });
writeFileSync(tmp, html);
await p.goto(pathToFileURL(tmp).href, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: 'public/share/og.png' });
await b.close();
rmSync(tmp);
console.log('public/share/og.png');
