// One screenshot per route (top of page + full page) at a given size.
// Usage: node scripts/pages.mjs [width] [height]
import { chromium } from 'playwright';
const [w = 1536, h = 760] = process.argv.slice(2).map(Number);
const base = process.env.BASE_URL || 'http://localhost:5180';
const routes = ['/demo', '/features', '/solutions', '/pricing', '/about', '/contact', '/security', '/privacy', '/terms', '/refunds', '/nope'];
const b = await chromium.launch();
const issues = [];
for (const r of routes) {
  const p = await b.newPage({ viewport: { width: w, height: h }, reducedMotion: 'reduce' });
  p.on('pageerror', (e) => issues.push(`${r}: ${e.message}`));
  p.on('console', (m) => m.type() === 'error' && issues.push(`${r}: ${m.text()}`));
  await p.goto(base + r, { waitUntil: 'networkidle' });
  await p.waitForTimeout(600);
  const slug = r.slice(1);
  await p.screenshot({ path: `shots/page-${w}-${slug}.png`, fullPage: true });
  const over = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (over > 0) issues.push(`${r}: horizontal overflow ${over}px`);
  console.log(r, await p.title());
  await p.close();
}
await b.close();
console.log(issues.length ? 'ISSUES:\n' + issues.join('\n') : 'no errors, no overflow');
