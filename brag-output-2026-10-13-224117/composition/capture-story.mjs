import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { chromium } from 'playwright';

const sourcePath = resolve('../../public/film/smartshala-story.html');
const outputPath = resolve(process.argv[2] || '../raw.webm');
const audioPath = resolve(process.argv[3] || '../score.wav');
let html = await readFile(sourcePath, 'utf8');
if (!html.includes('const SPEED = 1.4;')) throw new Error('Unexpected source film version');
html = html.replace('const SPEED = 1.4;', 'const SPEED = 1.9;');

const server = createServer((_req, res) => {
  res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
  res.end(html);
});
await new Promise((done) => server.listen(0, '127.0.0.1', done));

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  await page.goto(`http://127.0.0.1:${server.address().port}/story`, { waitUntil: 'load' });
  await page.evaluate(() => {
    window.__bragScore = window.SCORE;
    const stream = document.querySelector('canvas').captureStream(30);
    const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
    window.__bragChunks = [];
    recorder.ondataavailable = (event) => { if (event.data.size) window.__bragChunks.push(event.data); };
    window.__bragRecorder = recorder;
    recorder.start(500);
  });

  await page.locator('#play').click();
  await page.waitForFunction(() => document.querySelector('#play')?.textContent.includes('Watch again'), null, { timeout: 45000 });
  const recordings = await page.evaluate(async () => {
    const recorder = window.__bragRecorder;
    await new Promise((done) => { recorder.addEventListener('stop', done, { once: true }); recorder.stop(); });
    const webm = new Blob(window.__bragChunks, { type: recorder.mimeType });
    const audio = new OfflineAudioContext(2, 48000 * 25, 48000);
    window.__bragScore(audio);
    const buffer = await audio.startRendering();
    const wavBytes = new ArrayBuffer(44 + buffer.length * buffer.numberOfChannels * 2);
    const view = new DataView(wavBytes);
    const put = (offset, value) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
    put(0, 'RIFF'); view.setUint32(4, wavBytes.byteLength - 8, true); put(8, 'WAVE');
    put(12, 'fmt '); view.setUint32(16, 16, true); view.setUint16(20, 1, true);
    view.setUint16(22, buffer.numberOfChannels, true); view.setUint32(24, buffer.sampleRate, true);
    view.setUint32(28, buffer.sampleRate * buffer.numberOfChannels * 2, true);
    view.setUint16(32, buffer.numberOfChannels * 2, true); view.setUint16(34, 16, true);
    put(36, 'data'); view.setUint32(40, wavBytes.byteLength - 44, true);
    let offset = 44;
    for (let frame = 0; frame < buffer.length; frame++) {
      for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        const sample = Math.max(-1, Math.min(1, buffer.getChannelData(channel)[frame]));
        view.setInt16(offset, sample < 0 ? sample * 32768 : sample * 32767, true);
        offset += 2;
      }
    }
    const encode = (blob) => new Promise((done, fail) => {
      const reader = new FileReader();
      reader.onload = () => done(reader.result);
      reader.onerror = fail;
      reader.readAsDataURL(blob);
    });
    return { webm: (await encode(webm)).split(',')[1], wav: (await encode(new Blob([wavBytes]))).split(',')[1], videoBytes: webm.size };
  });
  if (recordings.videoBytes < 100000) throw new Error(`Canvas recording unexpectedly small: ${recordings.videoBytes} bytes`);
  await Promise.all([
    writeFile(outputPath, Buffer.from(recordings.webm, 'base64')),
    writeFile(audioPath, Buffer.from(recordings.wav, 'base64'))
  ]);
  console.log(`Captured ${outputPath} (${recordings.videoBytes} bytes) and ${audioPath}`);
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}
