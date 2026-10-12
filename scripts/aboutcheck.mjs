// Screenshots each 3D chapter of /about (scrolls each chapter to the middle
// of the screen and waits for the scene to settle). Usage:
//   node scripts/aboutcheck.mjs [width] [height]
import { chromium } from 'playwright';
const [w = 1536, h = 760] = process.argv.slice(2).map(Number);
const base = process.env.BASE_URL || 'http://localhost:5180';
const phone = w < 700;
const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone, deviceScaleFactor: Number(process.env.DSF || 1) });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => (m.type() === 'error' || m.text().includes('[about]')) && errs.push(m.text()));
await p.goto(base + '/about', { waitUntil: 'networkidle' });
await p.waitForTimeout(2500);
const n = await p.locator('.st-ch').count();
for (let i = 0; i < n; i++) {
  await p.evaluate((i) => {
    const el = document.querySelector(`.st-ch[data-i="${i}"]`);
    const y = el.getBoundingClientRect().top + scrollY + el.offsetHeight / 2 - innerHeight / 2;
    window.scrollTo(0, y);
  }, i);
  await p.waitForTimeout(3200);
  await p.screenshot({ path: `shots/about3d-${w}-${i}.png` });
}
const gl = await p.evaluate(() => Boolean(document.querySelector('.st-stage__gl canvas')));
console.log(`${n} chapters; canvas: ${gl}; ${errs.length ? 'ERRORS ' + errs.join(' | ') : 'no errors'}`);
await b.close();
