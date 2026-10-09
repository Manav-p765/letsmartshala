// One viewport screenshot per home section, scrolled there with the wheel
// (so Lenis, pins and reveals behave as for a visitor).
// Usage: node scripts/sections.mjs [width] [height]
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const [w = 1920, h = 940] = process.argv.slice(2).map(Number);
const base = process.env.BASE_URL || 'http://localhost:5180';
const sections = ['.hero', '.desks', '.stream', '.tour', '.flow', '.india', '.security', '.faq', '.cta', '.footer'];
mkdirSync('shots', { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: w, height: h } });
const issues = [];
page.on('pageerror', (e) => issues.push(e.message));
page.on('console', (m) => m.type() === 'error' && issues.push(m.text()));
await page.goto(base + '/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1200);
await page.mouse.move(w / 2, h / 2);

for (const sel of sections) {
  // Step the wheel until the section's top reaches the viewport top.
  for (let k = 0; k < 60; k++) {
    const top = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().top, sel);
    if (Math.abs(top) < 4) break;
    await page.mouse.wheel(0, Math.max(-600, Math.min(600, top)));
    await page.waitForTimeout(140);
  }
  await page.waitForTimeout(2200);
  const name = `shots/sec-${w}-${sel.slice(1)}.png`;
  await page.screenshot({ path: name });
  const tall = await page.evaluate((s) => document.querySelector(s).getBoundingClientRect().height, sel);
  console.log(name, 'height', Math.round(tall));
}
await browser.close();
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'no errors');
