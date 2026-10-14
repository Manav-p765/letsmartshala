import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const html = await readFile(resolve('index.html'));
const output = resolve(process.argv[2] || '../raw.webm');
const server = createServer((_req, res) => { res.writeHead(200, { 'content-type': 'text/html' }); res.end(html); });
await new Promise((done) => server.listen(0, '127.0.0.1', done));
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${server.address().port}/?render`, { waitUntil: 'load' });
  await page.evaluate(() => {
    const stream = document.querySelector('canvas').captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    window.__chunks = [];
    recorder.ondataavailable = (event) => { if (event.data.size) window.__chunks.push(event.data); };
    window.__recorder = recorder;
    recorder.start(500);
    window.start();
  });
  await page.waitForFunction(() => window.__done === true, null, { timeout: 30000 });
  const data = await page.evaluate(async () => {
    const r = window.__recorder;
    await new Promise((done) => { r.addEventListener('stop', done, { once: true }); r.stop(); });
    const blob = new Blob(window.__chunks, { type: r.mimeType });
    const url = await new Promise((done, fail) => { const reader = new FileReader(); reader.onload = () => done(reader.result); reader.onerror = fail; reader.readAsDataURL(blob); });
    return { bytes: blob.size, base64: url.split(',')[1] };
  });
  if (data.bytes < 100000) throw new Error(`Canvas capture unexpectedly small: ${data.bytes}`);
  await writeFile(output, Buffer.from(data.base64, 'base64'));
  console.log(`Captured ${output} (${data.bytes} bytes)`);
} finally { await browser.close(); await new Promise((done) => server.close(done)); }
