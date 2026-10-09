// Contact sheet: lays shots/<prefix>-NN.png side by side, `per` per image.
// Usage: node scripts/sheet.mjs scroll-home-390 4
import sharp from 'sharp';
import { readdirSync } from 'node:fs';
const [prefix, per = 4] = process.argv.slice(2);
const files = readdirSync('shots').filter((f) => f.startsWith(prefix + '-') && /-\d\d\.png$/.test(f)).sort();
for (let i = 0; i < files.length; i += Number(per)) {
  const group = files.slice(i, i + Number(per));
  const metas = await Promise.all(group.map((f) => sharp('shots/' + f).metadata()));
  const w = metas[0].width, h = Math.max(...metas.map((m) => m.height)), gap = 16;
  const out = `shots/sheet-${prefix}-${i / per}.png`;
  await sharp({ create: { width: group.length * (w + gap) - gap, height: h, channels: 3, background: '#999' } })
    .composite(group.map((f, k) => ({ input: 'shots/' + f, left: k * (w + gap), top: 0 })))
    .png().toFile(out);
  console.log(out, group.join(' '));
}
