// About page check: the film frame loads and draws, Play starts the film,
// the before→after rows animate in, and nothing errors. Usage:
//   node scripts/aboutcheck.mjs [width] [height]
import { chromium } from 'playwright';
const [w = 1536, h = 760] = process.argv.slice(2).map(Number);
const base = process.env.BASE_URL || 'http://localhost:5180';
const phone = w < 700;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: w, height: h }, isMobile: phone, hasTouch: phone });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
await p.goto(base + '/about', { waitUntil: 'networkidle' });
await p.waitForTimeout(2200);
await p.screenshot({ path: `shots/about-${w}-hero.png` });
const film = p.frameLocator('.ab-film iframe');
await p.evaluate(() => document.querySelector('.ab-film').scrollIntoView({ block: 'center' }));
await p.waitForTimeout(1500);
const f1 = await p.frames().find((f) => f.url().includes('smartshala-story')).evaluate(() => document.querySelector('canvas').toDataURL().length);
await p.waitForTimeout(1200);
const f2 = await p.frames().find((f) => f.url().includes('smartshala-story')).evaluate(() => document.querySelector('canvas').toDataURL().length);
console.log('film preview animating:', f1 !== f2);
await film.locator('#play').click();
await p.waitForTimeout(800);
console.log('after Play, button says:', await film.locator('#play').innerText(), '| pause visible:', await film.locator('#pause').isVisible());
await p.screenshot({ path: `shots/about-${w}-film.png` });
await p.evaluate(() => document.querySelector('.ab-diff').scrollIntoView({ block: 'start' }));
await p.waitForTimeout(2200);
await p.screenshot({ path: `shots/about-${w}-diff.png` });
const inCount = await p.evaluate(() => document.querySelectorAll('.ab-diff__row.is-in').length);
console.log('difference rows animated:', inCount, '| errors:', errs.length ? errs.join(' | ') : 'none');
await b.close();
