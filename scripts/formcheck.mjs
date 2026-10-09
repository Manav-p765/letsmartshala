// End-to-end check of the demo form: validation, submit, thank-you, and
// that the conversion flag is consumed (fires once, not on refresh).
import { chromium } from 'playwright';
const base = process.env.BASE_URL || 'http://localhost:5180';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1536, height: 760 } });
const errs = [];
p.on('pageerror', (e) => errs.push(e.message));
let posted = null;
p.on('request', (r) => { if (r.url().endsWith('/api/lead')) posted = r.postDataJSON(); });
await p.goto(base + '/demo?utm_source=google&utm_campaign=test', { waitUntil: 'networkidle' });
await p.waitForTimeout(800);
await p.screenshot({ path: 'shots/demo-empty.png' });
await p.click('.lf__submit');
await p.waitForTimeout(300);
console.log('errors shown on empty submit:', await p.locator('.lf__error').count());
await p.screenshot({ path: 'shots/demo-errors.png' });
await p.fill('#lf-name', 'Sunita Sharma');
await p.fill('#lf-school', 'Green Valley Public School');
await p.click('.lf__role:has-text("Principal")');
await p.fill('#lf-phone', '98765 43210');
await p.fill('#lf-email', 'sunita@example.com');
await p.waitForTimeout(2100); // honeypot timer
await p.click('.lf__submit');
await p.waitForURL('**/thank-you', { timeout: 8000 });
await p.waitForTimeout(1200);
console.log('landed on', new URL(p.url()).pathname, '| posted:', JSON.stringify(posted));
console.log('flag after thank-you:', await p.evaluate(() => sessionStorage.getItem('ss-lead-submitted')));
await p.screenshot({ path: 'shots/thank-you.png' });
console.log(errs.length ? 'ERRORS ' + errs.join('\n') : 'no page errors');
await b.close();
