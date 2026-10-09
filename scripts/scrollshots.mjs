// Scrolls a route with the wheel (motion on) and screenshots the viewport
// every `step` px, so entrance animations are seen as a visitor sees them.
// Usage: node scripts/scrollshots.mjs /features 1536 760 [step]
import { chromium } from 'playwright';
const [route = '/', w = 1536, h = 760, step = 760] = process.argv.slice(2).map((v, i) => (i ? Number(v) : v));
const base = process.env.BASE_URL || 'http://localhost:5180';
const slug = route === '/' ? 'home' : route.slice(1).replace(/\W+/g, '-');
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(base + route, { waitUntil: 'networkidle' });
await p.waitForTimeout(1200);
await p.mouse.move(w / 2, h / 2);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
let n = 0;
for (let y = 0; y < total; y += step) {
  await p.screenshot({ path: `shots/scroll-${slug}-${String(n++).padStart(2, '0')}.png` });
  for (let k = 0; k < step; k += 190) { await p.mouse.wheel(0, 190); await p.waitForTimeout(60); }
  await p.waitForTimeout(1500);
}
const hidden = await p.evaluate(() => [...document.querySelectorAll('[data-animate]')].filter((el) => getComputedStyle(el).opacity === '0' || getComputedStyle(el).visibility === 'hidden').length);
console.log(`${n} shots; ${hidden} [data-animate] still hidden; ${errs.length ? 'ERRORS ' + errs.join(' | ') : 'no errors'}`);
await b.close();
