// Browser check: screenshots of a route at desktop and phone sizes, with
// normal and reduced motion. Usage: npm run shots -- [route] [delays ms...]
// Output goes to shots/ (git-ignored). Needs the dev server on :5180.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [route = '/', ...rest] = process.argv.slice(2);
const delays = rest.length ? rest.map(Number) : [1500, 5000, 9000];
const base = process.env.BASE_URL || 'http://localhost:5180';
const slug = route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '');
mkdirSync('shots', { recursive: true });

const views = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'laptop', viewport: { width: 1280, height: 720 } },
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }
];

const browser = await chromium.launch();
const errors = [];
for (const v of views) {
  for (const motion of ['no-preference', 'reduce']) {
    const ctx = await browser.newContext({ ...v, reducedMotion: motion });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => errors.push(`${v.name}/${motion}: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && errors.push(`${v.name}/${motion}: ${m.text()}`));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    const steps = motion === 'reduce' ? [800] : delays;
    let waited = 0;
    for (const d of steps) {
      await page.waitForTimeout(d - waited);
      waited = d;
      const file = `shots/${slug}-${v.name}-${motion === 'reduce' ? 'rm' : d}.png`;
      await page.screenshot({ path: file });
      console.log(file);
    }
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) errors.push(`${v.name}/${motion}: horizontal overflow ${overflow}px`);
    await ctx.close();
  }
}
await browser.close();
console.log(errors.length ? 'ISSUES:\n' + errors.join('\n') : 'no console errors, no horizontal overflow');
