// Load timing for a page on a throttled "mid-range phone on 4G" profile.
//   node scripts/perf.mjs https://letsmartshala.vercel.app home demo about
import { chromium } from 'playwright';

const [base = 'http://localhost:4173', ...names] = process.argv.slice(2);
const routes = (names.length ? names : ['home']).map((n) => (n === 'home' ? '/' : `/${n}`));

const browser = await chromium.launch();
// Warm the browser up first: the first page ever loaded pays a cold-start cost.
{ const p = await browser.newPage(); await p.goto(base + routes[0]); await p.close(); }
for (const route of routes) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, isMobile: true });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 });
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  let bytes = 0;
  let requests = 0;
  cdp.on('Network.loadingFinished', (e) => { bytes += e.encodedDataLength; requests += 1; });
  await page.addInitScript(() => {
    window.__lcp = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
    window.__long = 0;
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__long += Math.max(0, e.duration - 50); }).observe({ type: 'longtask', buffered: true });
  });
  await page.goto(base + route, { waitUntil: 'load' });
  await page.waitForTimeout(4000);
  const m = await page.evaluate(() => ({
    fcp: performance.getEntriesByName('first-contentful-paint')[0]?.startTime,
    lcp: window.__lcp,
    blocked: window.__long,
    load: performance.getEntriesByType('navigation')[0].loadEventEnd
  }));
  const s = (n) => (n == null ? '—' : (n / 1000).toFixed(2) + 's');
  console.log(`${route.padEnd(10)} first paint ${s(m.fcp)} | main content ${s(m.lcp)} | load ${s(m.load)} | blocked ${Math.round(m.blocked)}ms | ${requests} requests, ${(bytes / 1024).toFixed(0)} kB`);
  await ctx.close();
}
await browser.close();
