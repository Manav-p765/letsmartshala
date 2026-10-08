// Turns the CRM's 1254px logo PNG into the small files the site actually ships.
// Run with `npm run brand` whenever assets-src/brand/logo-latest.png changes.
import sharp from 'sharp';

const src = 'assets-src/brand/logo-latest.png';
const out = 'public/brand';

// The source is a full-bleed blue square; nav and favicon want a rounded tile.
const rounded = (size, r) =>
  Buffer.from(`<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`);

for (const size of [64, 128, 256]) {
  await sharp(src)
    .resize(size, size)
    .composite([{ input: rounded(size, Math.round(size * 0.24)), blend: 'dest-in' }])
    .webp({ quality: 92 })
    .toFile(`${out}/mark-${size}.webp`);
}
await sharp(src).resize(32, 32).composite([{ input: rounded(32, 8), blend: 'dest-in' }]).png().toFile('public/favicon-32.png');
await sharp(src).resize(180, 180).png().toFile('public/apple-touch-icon.png');

// Sample the logo blue so the tokens match the mark, not a guess.
const { data } = await sharp(src).extract({ left: 40, top: 40, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
console.log('logo blue:', '#' + [...data.slice(0, 3)].map((v) => v.toString(16).padStart(2, '0')).join(''));
