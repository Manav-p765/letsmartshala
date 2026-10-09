// Full-page check: scrolls the page with the wheel (so Lenis and every
// ScrollTrigger fire like they would for a visitor), then takes one tall
// screenshot per viewport. Usage: node scripts/fullpage.mjs [route]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const route = process.argv[2] || '/';
const base = process.env.BASE_URL || 'http://localhost:5180';
const slug = route === '/' ? 'home' : route.replace(/\W+/g, '-').replace(/^-|-$/g, '');
mkdirSync('shots', { recursive: true });

const views = [
  { name: 'desktop', viewport: { width: 1440, height: 900 } },
  { name: 'phone', viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }
];

const browser = await chromium.launch();
const issues = [];
for (const v of views) {
  for (const motion of ['no-preference', 'reduce']) {
    const ctx = await browser.newContext({ ...v, reducedMotion: motion });
    const page = await ctx.newPage();
    page.on('pageerror', (e) => issues.push(`${v.name}/${motion}: ${e.message}`));
    page.on('console', (m) => m.type() === 'error' && issues.push(`${v.name}/${motion}: ${m.text()}`));
    await page.goto(base + route, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);
    const height = await page.evaluate(() => document.documentElement.scrollHeight);
    if (v.isMobile) {
      for (let y = 0; y < height; y += 400) {
        await page.evaluate((y) => window.scrollTo(0, y), y);
        await page.waitForTimeout(120);
      }
    } else {
      await page.mouse.move(700, 450);
      for (let y = 0; y < height; y += 300) {
        await page.mouse.wheel(0, 300);
        await page.waitForTimeout(90);
      }
    }
    await page.waitForTimeout(1500);
    // Elements still invisible after a full scroll = a reveal that never fired.
    const stuck = await page.evaluate(() =>
      [...document.querySelectorAll('[data-animate]')].filter((el) => getComputedStyle(el).opacity === '0').length
    );
    if (stuck) issues.push(`${v.name}/${motion}: ${stuck} [data-animate] elements still hidden`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 0) issues.push(`${v.name}/${motion}: horizontal overflow ${overflow}px`);
    const file = `shots/${slug}-full-${v.name}-${motion === 'reduce' ? 'rm' : 'motion'}.png`;
    await page.screenshot({ path: file, fullPage: true });
    console.log(file);
    await ctx.close();
  }
}
await browser.close();
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'no errors, no stuck reveals, no horizontal overflow');
