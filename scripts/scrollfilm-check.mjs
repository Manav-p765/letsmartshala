// Scroll-film check: scrolls through the pinned film and screenshots it at
// several points; confirms the frame advances with scroll and rewinds back.
// Usage: node scripts/scrollfilm-check.mjs [width] [height]
import { chromium } from 'playwright';
const [w = 1536, h = 760] = process.argv.slice(2).map(Number);
const base = process.env.BASE_URL || 'http://localhost:5180';
const phone = w < 700;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
await p.goto(base + '/about', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const film = () => p.frames().find((f) => f.url().includes('smartshala-story'));
const sec = await p.evaluate(() => { const r = document.querySelector('.sfilm').getBoundingClientRect(); return { top: r.top + scrollY, h: r.height }; });
const travel = sec.h - h;
const sig = async () => (await film().evaluate(() => document.querySelector('canvas').toDataURL('image/jpeg', 0.3))).length;
const out = [];
for (const q of [0.02, 0.2, 0.38, 0.55, 0.7, 0.97]) {
  await p.evaluate((y) => window.scrollTo(0, y), Math.round(sec.top + travel * q));
  await p.waitForTimeout(phone ? 700 : 1300);
  await p.screenshot({ path: `shots/sfilm-${w}-${Math.round(q * 100)}.png` });
  out.push([q, await sig(), await p.locator('.sfilm__now').innerText().catch(() => '')]);
}
console.log(out.map(([q, s, c]) => `${Math.round(q * 100)}% → "${c}" (${s})`).join('\n'));
await p.evaluate((y) => window.scrollTo(0, y), Math.round(sec.top + travel * 0.2));
await p.waitForTimeout(1300);
console.log('rewinds to the same frame:', Math.abs((await sig()) - out[1][1]) < 50 ? 'yes' : 'no');
const stuck = await p.evaluate(() => getComputedStyle(document.querySelector('.sfilm__stick')).position);
console.log('pinned via:', stuck, '| errors:', errs.length ? errs.join(' | ') : 'none');
await b.close();
