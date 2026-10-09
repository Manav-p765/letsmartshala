// Lists visible elements that stick out past the viewport's right edge
// (and aren't inside a scroller meant to scroll sideways), per route.
// Usage: node scripts/overflow.mjs [width]
import { chromium } from 'playwright';
const w = Number(process.argv[2] || 360);
const base = process.env.BASE_URL || 'http://localhost:5180';
const routes = ['/', '/demo', '/thank-you', '/features', '/solutions', '/pricing', '/about', '/contact', '/security', '/privacy'];
const b = await chromium.launch();
for (const r of routes) {
  const p = await b.newPage({ viewport: { width: w, height: 800 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  await p.goto(base + r, { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  const bad = await p.evaluate((vw) => {
    const out = [];
    const scrollsX = (el) => { for (let a = el.parentElement; a; a = a.parentElement) { const s = getComputedStyle(a); if (/(auto|scroll)/.test(s.overflowX) || a.classList.contains('marquee') || a.classList.contains('stream__ribbon') || a.classList.contains('arc')) return true; } return false; };
    for (const el of document.querySelectorAll('body *')) {
      const rc = el.getBoundingClientRect();
      if (!rc.width || rc.right <= vw + 1 || scrollsX(el)) continue;
      const s = getComputedStyle(el);
      if (s.visibility === 'hidden' || s.display === 'none' || s.position === 'fixed') continue;
      if (el.closest('svg') && el.tagName !== 'svg') continue;
      out.push(`${el.tagName.toLowerCase()}.${[...el.classList].join('.')} right=${Math.round(rc.right)} w=${Math.round(rc.width)}`);
    }
    return out.slice(0, 12);
  }, w);
  console.log(r, bad.length ? '\n  ' + bad.join('\n  ') : 'ok');
  await p.close();
}
await b.close();
