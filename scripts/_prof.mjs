import { chromium } from 'playwright';
const [url = 'http://localhost:4173/'] = process.argv.slice(2);
const b = await chromium.launch();
{ const p = await b.newPage(); await p.goto(url); await p.close(); }
const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, deviceScaleFactor: 2, isMobile: true });
const page = await ctx.newPage();
const cdp = await ctx.newCDPSession(page);
await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
await cdp.send('Profiler.enable');
await cdp.send('Profiler.setSamplingInterval', { interval: 200 });
await cdp.send('Profiler.start');
await page.goto(url, { waitUntil: 'load' });
await page.waitForTimeout(5000);
const { profile } = await cdp.send('Profiler.stop');
const byId = new Map(profile.nodes.map((n) => [n.id, n]));
const self = new Map();
const dt = profile.timeDeltas; 
profile.samples.forEach((id, i) => self.set(id, (self.get(id) || 0) + (dt[i] || 0)));
const agg = new Map();
for (const [id, t] of self) {
  const f = byId.get(id).callFrame;
  const key = `${f.functionName || '(anon)'} ${f.url.split('/').pop()}:${f.lineNumber}`;
  agg.set(key, (agg.get(key) || 0) + t);
}
const byFile = new Map();
for (const [id, t] of self) { const f = byId.get(id).callFrame; const k = f.url.split('/').pop() || f.functionName; byFile.set(k, (byFile.get(k) || 0) + t); }
console.log('BY FILE'); [...byFile].sort((a, b) => b[1] - a[1]).slice(0, 8).forEach(([k, t]) => console.log((t / 1000).toFixed(0).padStart(6) + 'ms', k));
console.log('TOP FUNCTIONS'); [...agg].sort((a, b) => b[1] - a[1]).slice(0, 25).forEach(([k, t]) => console.log((t / 1000).toFixed(0).padStart(6) + 'ms', k));
await b.close();
