// Draws the background linework (public/school-lines.svg): school things
// drawn as thin gold line art, the way a field-notes page would sketch them.
// A small library (book, pencil, ruler, protractor, compass, set square,
// globe, abacus, bell, slate, pen, books, cap); only a few are placed, in the
// far corners, so the middle where the copy goes stays empty. Deterministic.
// Usage: node scripts/school-lines.mjs
import { writeFileSync } from 'node:fs';

const W = 1600, H = 1000;
const STROKE = '#B8964F'; // --gold; an SVG background can't read CSS variables

// Each icon is drawn in a 100×100 box, centred on 50,50, stroke only.
const ticks = (x0, y, n, step, long = 3) =>
  Array.from({ length: n }, (_, k) => `M${x0 + k * step} ${y}v${k % long === 0 ? 7 : 4}`).join('');
const arc = (cx, cy, r, a0, a1) => {
  const p = (a) => [cx + r * Math.cos(a), cy - r * Math.sin(a)].map((v) => v.toFixed(1)).join(' ');
  return `M${p(a0)}A${r} ${r} 0 0 ${a0 < a1 ? 0 : 1} ${p(a1)}`;
};
const icons = {
  book: `<path d="M50 30C38 22 20 22 8 26v48c12-4 30-4 42 4 12-8 30-8 42-4V26c-12-4-30-4-42 4zM50 30v48"/>
    <path d="M16 36c8-2 18-2 26 1M16 46c8-2 18-2 26 1M16 56c8-2 18-2 26 1M58 37c8-3 18-3 26-1M58 47c8-3 18-3 26-1M58 57c8-3 18-3 26-1" stroke-width="0.6"/>`,
  pencil: `<path d="M8 44h70l16 6-16 6H8zM78 44v12M86 47l8 3-8 3M8 44v12M16 44v12"/>
    <path d="M16 50h62" stroke-width="0.6"/>`,
  ruler: `<rect x="2" y="38" width="96" height="22" rx="2"/><path d="${ticks(8, 38, 18, 5)}" stroke-width="0.6"/>`,
  protractor: `<path d="M6 70h88M6 70a44 44 0 0 1 88 0"/><path d="${arc(50, 70, 22, 0, Math.PI)}M50 70v-6"/>
    <path d="${Array.from({ length: 19 }, (_, k) => {
      const a = (k * Math.PI) / 18, r1 = k % 3 === 0 ? 36 : 39;
      return `M${(50 + 44 * Math.cos(a)).toFixed(1)} ${(70 - 44 * Math.sin(a)).toFixed(1)}L${(50 + r1 * Math.cos(a)).toFixed(1)} ${(70 - r1 * Math.sin(a)).toFixed(1)}`;
    }).join('')}" stroke-width="0.6"/>`,
  compass: `<circle cx="50" cy="14" r="5"/><path d="M50 8V2M47 18 24 92M53 18l23 74M24 92l-1 5M76 92l2-6-5 1M34 58h32"/>`,
  setSquare: `<path d="M10 90V10l80 80z"/><path d="M22 78V40l38 38z"/><path d="${ticks(14, 90, 14, 5, 2).replace(/v/g, 'v-')}" stroke-width="0.6"/>`,
  globe: `<circle cx="50" cy="42" r="30"/><ellipse cx="50" cy="42" rx="13" ry="30"/><path d="M20 42h60M24 27h52M24 57h52"/>
    <path d="M18 18a40 40 0 0 0 52 60M50 80v10M36 92h28"/>`,
  abacus: `<rect x="8" y="12" width="84" height="76" rx="3"/><path d="M8 24h84M8 76h84M14 34h72M14 46h72M14 58h72M14 68h72" stroke-width="0.6"/>
    ${[[34, [24, 30, 36, 62]], [46, [24, 30, 56, 62, 68]], [58, [24, 50, 56, 62]], [68, [24, 30, 36, 42, 68]]]
      .map(([y, xs]) => xs.map((x) => `<ellipse cx="${x}" cy="${y}" rx="3.2" ry="4"/>`).join('')).join('')}`,
  bell: `<path d="M50 8v10M44 8h12M50 18c-16 0-24 14-24 34 0 14-6 20-12 24h72c-6-4-12-10-12-24 0-20-8-34-24-34z"/>
    <circle cx="50" cy="82" r="5"/><path d="M34 40c2-8 6-12 12-14" stroke-width="0.6"/>`,
  slate: `<rect x="6" y="16" width="88" height="68" rx="5"/><rect x="14" y="24" width="72" height="52" rx="2"/>
    <path d="M22 38c4-6 8 6 12 0s8 6 12 0M22 52h20M50 52h6m4 0h6M54 48v8M22 64c6-4 12 4 18 0s12 4 18 0" stroke-width="0.7"/>
    <path d="M70 92l18-10M66 92h4" />`,
  pen: `<path d="M50 4l10 22v34H40V26zM40 60h20v8H40zM44 68l6 26 6-26M50 76v18"/><path d="M50 14v40" stroke-width="0.6"/>`,
  books: `<rect x="10" y="64" width="80" height="16" rx="2"/><rect x="16" y="48" width="70" height="16" rx="2"/><rect x="8" y="32" width="76" height="16" rx="2"/>
    <path d="M20 64v16M78 64v16M26 48v16M74 48v16M18 32v16M72 32v16" stroke-width="0.6"/><path d="M40 32V14l8 6 8-6v18"/>`,
  cap: `<path d="M50 22 4 42l46 20 46-20zM24 51v20c14 10 38 10 52 0V51M88 46v26"/><circle cx="88" cy="74" r="3"/>`,
};

// [icon, centre x, centre y, size px, rotation°]. Kept out of the central oval.
const placed = [
  ['book', 110, 150, 110, -12], ['protractor', 1490, 210, 110, -14],
  ['pencil', 150, 860, 150, 10], ['globe', 1470, 820, 100, 6],
]; // Kept few, small and in the far corners: the owner wants the school references subtle.

const body = placed.map(([name, x, y, size, rot]) => {
  const s = size / 100;
  // Hold the stroke near 1px on screen whatever the icon's size.
  return `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s.toFixed(3)}) translate(-50 -50)" stroke-width="${(1.1 / s).toFixed(2)}">${icons[name].replace(/\s*\n\s*/g, '')}</g>`;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" fill="none" stroke="${STROKE}" stroke-linecap="round" stroke-linejoin="round">${body}</svg>\n`;
writeFileSync('public/school-lines.svg', svg);
console.log('public/school-lines.svg', (svg.length / 1024).toFixed(1) + ' KB');
