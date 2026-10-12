/**
 * The About page's 3D stage (three.js, everything modelled in code — no
 * model files to download).
 *
 * Six chapters, each a set of target poses the objects ease toward:
 *   0 paper   — two stacks of registers on the floor, loose pages drifting
 *   1 copies  — the registers stand in a row; Aarav's name card appears and
 *               is copied, one by one, onto each register
 *   2 break   — registers tilt, cards and pages swirl, red warnings pop up
 *               and a clock spins (the principal waiting)
 *   3 one     — a SmartShala screen rises; every page, card and register
 *               flies into it
 *   4 connect — principal, teacher, accountant and office tiles around the
 *               screen, linked by lines with data pulses running along them
 *   5 yours   — a dome closes over this school; other schools sit apart
 *               under their own
 *
 * Usage: const stage = await createStoryScene(container, { reduced });
 *        stage.setChapter(i); stage.dispose();
 * The loop runs only while the stage is on screen and the tab is visible.
 * Reduced motion: poses snap instead of easing, and nothing idles.
 */
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { isMotionPaused } from '../../lib/motion.js';

const COL = {
  paper: '#FFFDF6', ivory: '#F5EFE6', navy: '#0E1D61', blue: '#003DE5', blue2: '#2456E6',
  gold: '#B8964F', red: '#C8242C', ok: '#0F8A4A', ink: '#0E1D61'
};
const SANS = '"Plus Jakarta Sans Variable", "Plus Jakarta Sans", system-ui, sans-serif';
const SERIF = '"Instrument Serif", Georgia, serif';
const MONO = '"JetBrains Mono", ui-monospace, monospace';

// ---------- canvas textures ----------
// Drawn in layout units but rasterised at TEX_SCALE× so text and lines stay
// crisp even when a card fills a large part of a high-DPI screen.
const TEX_SCALE = 3;
let maxAniso = 8;
function canvasTexture(w, h, draw, scale = TEX_SCALE) {
  const c = document.createElement('canvas');
  c.width = Math.round(w * scale);
  c.height = Math.round(h * scale);
  const g = c.getContext('2d');
  g.scale(scale, scale);
  g.imageSmoothingQuality = 'high';
  draw(g, w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = maxAniso;
  t.minFilter = THREE.LinearMipmapLinearFilter;
  t.magFilter = THREE.LinearFilter;
  t.generateMipmaps = true;
  return t;
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}
const paperTex = (seed) => canvasTexture(256, 340, (g, w, h) => {
  g.fillStyle = COL.paper; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(14,29,97,0.12)'; g.lineWidth = 2;
  for (let y = 46; y < h; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  g.strokeStyle = 'rgba(200,36,44,0.35)'; g.beginPath(); g.moveTo(38, 0); g.lineTo(38, h); g.stroke();
  // a few "handwritten" strokes
  g.strokeStyle = 'rgba(14,29,97,0.55)'; g.lineWidth = 2.5; g.lineCap = 'round';
  for (let i = 0; i < 6; i++) {
    const y = 64 + i * 24 + (i > 2 ? 24 : 0);
    const len = 80 + ((seed * 37 + i * 53) % 110);
    g.beginPath(); g.moveTo(50, y - 6);
    for (let x = 50; x < 50 + len; x += 10) g.lineTo(x, y - 6 + Math.sin(x * 0.3 + i + seed) * 3);
    g.stroke();
  }
});
const coverTex = (title, color) => canvasTexture(256, 360, (g, w, h) => {
  g.fillStyle = color; g.fillRect(0, 0, w, h);
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.fillRect(0, 0, 22, h);
  g.strokeStyle = COL.gold; g.lineWidth = 3; g.strokeRect(36, 40, w - 72, 120);
  g.fillStyle = '#F2E2B8'; g.textAlign = 'center';
  g.font = `600 22px ${MONO}`;
  const words = title.split(' ');
  words.forEach((wd, i) => g.fillText(wd, w / 2, 92 + i * 30 - (words.length - 1) * 12));
  g.font = `italic 30px ${SERIF}`; g.fillText('2026–27', w / 2, h - 60);
});
const pagesTex = () => canvasTexture(64, 256, (g, w, h) => {
  g.fillStyle = '#F4ECDD'; g.fillRect(0, 0, w, h);
  g.strokeStyle = 'rgba(14,29,97,0.08)';
  for (let x = 2; x < w; x += 3) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
});
const nameCardTex = (label) => canvasTexture(320, 180, (g, w, h) => {
  g.fillStyle = COL.paper; roundRect(g, 0, 0, w, h, 18); g.fill();
  g.strokeStyle = 'rgba(14,29,97,0.15)'; g.lineWidth = 3; g.stroke();
  g.fillStyle = 'rgba(14,29,97,0.5)'; g.font = `500 18px ${MONO}`; g.fillText(label.toUpperCase(), 22, 40);
  g.fillStyle = COL.navy; g.font = `italic 48px ${SERIF}`; g.fillText("Aarav Sharma", 22, 106);
  g.fillStyle = COL.red; g.font = `italic 30px ${SERIF}`; g.fillText('7-B · Roll 12', 22, 152);
});
const screenTex = () => canvasTexture(960, 600, (g, w, h) => {
  g.fillStyle = '#F7F8FB'; g.fillRect(0, 0, w, h);
  g.fillStyle = COL.blue; g.fillRect(0, 0, w, 74);
  g.fillStyle = '#fff'; g.font = `800 34px ${SANS}`; g.fillText('SmartShala', 32, 49);
  g.font = `500 22px ${SANS}`; g.globalAlpha = 0.8; g.fillText('Principal · Today', w - 230, 47); g.globalAlpha = 1;
  const kpis = [['Staff in', '38 / 41'], ['Attendance', '94%'], ['Fees today', '₹1,84,500']];
  kpis.forEach(([k, v], i) => {
    const x = 32 + i * 304;
    g.fillStyle = i === 2 ? COL.blue2 : '#fff'; roundRect(g, x, 104, 284, 128, 16); g.fill();
    if (i !== 2) { g.strokeStyle = 'rgba(14,29,97,0.12)'; g.lineWidth = 2; g.stroke(); }
    g.fillStyle = i === 2 ? 'rgba(255,255,255,0.8)' : 'rgba(14,29,97,0.55)'; g.font = `500 22px ${SANS}`; g.fillText(k, x + 22, 146);
    g.fillStyle = i === 2 ? '#fff' : COL.navy; g.font = `800 44px ${SANS}`; g.fillText(v, x + 22, 204);
  });
  const rows = [['Aarav Sharma', '7-B', 'Admission', COL.blue2], ['Attendance', '24 / 24', 'Marked', COL.ok], ['Fee received', '₹12,500', 'UPI', COL.ok], ['Unit Test 2', 'Maths', 'Entered', COL.blue2]];
  rows.forEach(([a, b, c, col], i) => {
    const y = 270 + i * 76;
    g.fillStyle = '#fff'; roundRect(g, 32, y, w - 64, 62, 12); g.fill();
    g.fillStyle = COL.navy; g.font = `600 24px ${SANS}`; g.fillText(a, 56, y + 40);
    g.fillStyle = 'rgba(14,29,97,0.55)'; g.font = `500 22px ${SANS}`; g.fillText(b, 420, y + 40);
    g.fillStyle = col; g.globalAlpha = 0.12; roundRect(g, w - 230, y + 14, 170, 34, 17); g.fill(); g.globalAlpha = 1;
    g.fillStyle = col; g.font = `600 20px ${SANS}`; g.fillText(c, w - 210, y + 38);
  });
}, 2.5);
const roleTex = (role, line, color) => canvasTexture(420, 170, (g, w, h) => {
  g.fillStyle = '#FFFDF8'; roundRect(g, 0, 0, w, h, 26); g.fill();
  g.fillStyle = color; g.beginPath(); g.arc(70, h / 2, 38, 0, Math.PI * 2); g.fill();
  g.fillStyle = '#fff'; g.font = `800 36px ${SANS}`; g.textAlign = 'center'; g.fillText(role[0], 70, h / 2 + 13);
  g.textAlign = 'left';
  g.fillStyle = COL.navy; g.font = `800 38px ${SANS}`; g.fillText(role, 130, 76);
  g.fillStyle = 'rgba(14,29,97,0.6)'; g.font = `500 24px ${SANS}`; g.fillText(line, 130, 118);
});
const warnTex = (text) => canvasTexture(300, 110, (g, w, h) => {
  g.fillStyle = COL.red; roundRect(g, 0, 0, w, h, 55); g.fill();
  g.fillStyle = '#fff'; g.font = `800 34px ${SANS}`; g.textAlign = 'center'; g.fillText(text, w / 2, 70);
});
const glowTex = () => canvasTexture(256, 256, (g, w, h) => {
  const r = g.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
  r.addColorStop(0, 'rgba(79,123,255,0.55)'); r.addColorStop(0.45, 'rgba(79,123,255,0.18)'); r.addColorStop(1, 'rgba(79,123,255,0)');
  g.fillStyle = r; g.fillRect(0, 0, w, h);
});
const floorTex = () => canvasTexture(512, 512, (g, w, h) => {
  const r = g.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, w / 2);
  r.addColorStop(0, 'rgba(14,29,97,0.16)'); r.addColorStop(0.5, 'rgba(14,29,97,0.05)'); r.addColorStop(1, 'rgba(14,29,97,0)');
  g.fillStyle = r; g.fillRect(0, 0, w, h);
});

// ---------- poses ----------
const P = (p, r = [0, 0, 0], s = 1, o = 1) => ({ p, r, s, o });
const HIDE = (p = [0, 1.6, 0]) => P(p, [0, 0, 0], 0, 0);
const rand = (i, k) => { const x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); };

const BOOKS = [
  ['ADMISSION REGISTER', '#0E1D61'],
  ['ATTENDANCE REGISTER', '#8C2F39'],
  ['FEE RECEIPTS', '#2F6B4F'],
  ['BUS LIST', '#9A7A3A'],
  ['MARK SHEETS', '#4A5B8C']
];
const CARD_LABELS = ['Admission', 'Attendance', 'Fee card', 'Bus list', 'Mark sheet'];
const ROLES = [
  ['Principal', 'Live dashboard', COL.blue],
  ['Teacher', 'Roll call · marks', COL.ok],
  ['Accountant', 'Receipts · ledger', COL.gold],
  ['Office', 'Students · classes', '#8C2F39']
];
const SCREEN_AT = [0, 1.75, 0];
const ROLE_AT = [[-3.1, 2.9, 0.6], [3.3, 2.9, 0.6], [-3.1, 0.6, 0.8], [3.3, 0.6, 0.8]];
const CAMERA = [
  { p: [0, 4.4, 9.8], t: [0, 1.2, 0] },
  { p: [0, 3.2, 8.6], t: [0, 1.4, 0] },
  { p: [1.4, 3.8, 8.2], t: [0, 1.5, 0] },
  { p: [0, 2.5, 6.8], t: [0, 1.7, 0] },
  { p: [0, 3.6, 11.4], t: [0, 1.7, 0] },
  { p: [0, 7.2, 16.5], t: [0, 1.4, 0] }
];

export async function createStoryScene(container, { reduced = false } = {}) {
  // Text on canvas textures needs the webfonts loaded first.
  await Promise.race([
    Promise.all([
      document.fonts.load(`800 40px ${SANS}`), document.fonts.load(`italic 40px ${SERIF}`), document.fonts.load(`500 20px ${MONO}`)
    ]),
    new Promise((r) => setTimeout(r, 1500))
  ]).catch(() => {});

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  // Full device sharpness (capped at 2.5 to keep 4K phones smooth).
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2.5));
  maxAniso = renderer.capabilities.getMaxAnisotropy();
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  scene.add(new THREE.HemisphereLight('#FFF8EC', '#9AA3C7', 1.6));
  const sun = new THREE.DirectionalLight('#ffffff', 1.4);
  sun.position.set(4, 8, 6);
  scene.add(sun);
  const rim = new THREE.DirectionalLight('#8FB0FF', 0.6);
  rim.position.set(-6, 3, -4);
  scene.add(rim);

  const disposables = [];
  const track = (x) => { disposables.push(x); return x; };
  const items = [];
  /** Registers an object with one pose per chapter. */
  const add = (obj, poses, opts = {}) => {
    const mats = [];
    obj.traverse((o) => { if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => { m.transparent = true; mats.push(m); }); });
    const f = poses[0];
    const item = {
      obj, poses, mats, delay: opts.delay || [0, 0, 0, 0, 0, 0], speed: opts.speed || 3.2, idle: opts.idle,
      cur: { p: new THREE.Vector3(...f.p), r: new THREE.Vector3(...f.r), s: f.s, o: f.o }
    };
    items.push(item);
    scene.add(obj);
    return item;
  };

  // Floor shadow
  const floor = new THREE.Mesh(track(new THREE.PlaneGeometry(26, 26)), track(new THREE.MeshBasicMaterial({ map: track(floorTex()), transparent: true, depthWrite: false })));
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // ---- Registers (books) ----
  const bookGeo = track(new THREE.BoxGeometry(1.05, 1.45, 0.24));
  const pages = track(pagesTex());
  BOOKS.forEach(([title, color], i) => {
    const cover = track(new THREE.MeshStandardMaterial({ map: track(coverTex(title, color)), roughness: 0.75 }));
    const plain = track(new THREE.MeshStandardMaterial({ color, roughness: 0.8 }));
    const page = track(new THREE.MeshStandardMaterial({ map: pages, roughness: 0.95 }));
    const mesh = new THREE.Mesh(bookGeo, [page, plain, page, page, cover, plain]);
    const stackA = i < 3;
    const flat = P(stackA ? [-1.9 + rand(i, 1) * 0.2, 0.13 + i * 0.25, 0.6] : [2.3 + rand(i, 2) * 0.2, 0.13 + (i - 3) * 0.25, -0.2], [-Math.PI / 2, 0, (rand(i, 3) - 0.5) * 0.5]);
    const x = (i - 2) * 1.5;
    const z = -Math.abs(i - 2) * 0.55;
    const row = P([x, 0.73, z], [0, -(i - 2) * 0.16, 0]);
    const tilt = [0.28, -0.34, 0.2, -0.26, 0.32][i];
    const broken = P([x + tilt * 0.6, 0.66, z], [0.12 * (i % 2 ? 1 : -1), -(i - 2) * 0.16, tilt]);
    const into = P(SCREEN_AT, [0, 0, 0], 0.05, 0);
    add(mesh, [flat, row, broken, into, HIDE(SCREEN_AT), HIDE(SCREEN_AT)], { delay: [0, i * 0.06, i * 0.05, 0.3 + i * 0.08, 0, 0] });
  });

  // ---- Loose pages ----
  const paperGeo = track(new THREE.PlaneGeometry(0.62, 0.82));
  for (let i = 0; i < 16; i++) {
    const mat = track(new THREE.MeshStandardMaterial({ map: track(paperTex(i)), side: THREE.DoubleSide, roughness: 1 }));
    const mesh = new THREE.Mesh(paperGeo, mat);
    const a = rand(i, 4) * Math.PI * 2;
    const rr = 2.2 + rand(i, 5) * 2.6;
    const cloud = P([Math.cos(a) * rr * 1.25, 1.3 + rand(i, 6) * 2.6, Math.sin(a) * rr * 0.6 - 0.5], [rand(i, 7) - 0.5, rand(i, 8) * 2, rand(i, 9) - 0.5]);
    const away = P([cloud.p[0] * 1.15, cloud.p[1] + 1.4, cloud.p[2] - 2], cloud.r, 0.9, 0.12);
    const swirl = P([Math.cos(a) * 3.6, 1 + rand(i, 10) * 3, Math.sin(a) * 2.2], [rand(i, 11) * 3, rand(i, 12) * 3, rand(i, 13) * 3]);
    const into = P(SCREEN_AT, [0, 0, 0], 0.05, 0);
    add(mesh, [cloud, away, swirl, into, HIDE(SCREEN_AT), HIDE(SCREEN_AT)], {
      delay: [0, 0, 0, i * 0.04, 0, 0],
      speed: 2.4,
      idle: (o, t, ch) => {
        if (ch === 0) { o.position.y += Math.sin(t * 0.8 + i) * 0.12; o.rotation.z += Math.sin(t * 0.5 + i) * 0.15; }
        if (ch === 2) { o.rotation.x += t * 0.9 + i; o.rotation.y += t * 0.6; o.position.y += Math.sin(t * 2 + i) * 0.25; }
      }
    });
  }

  // ---- Aarav's name cards (copied onto each register) ----
  const cardGeo = track(new THREE.PlaneGeometry(0.98, 0.55));
  CARD_LABELS.forEach((label, i) => {
    const mat = track(new THREE.MeshStandardMaterial({ map: track(nameCardTex(label)), side: THREE.DoubleSide, roughness: 0.9 }));
    const mesh = new THREE.Mesh(cardGeo, mat);
    const x = (i - 2) * 1.5;
    const z = -Math.abs(i - 2) * 0.55 + 0.25;
    const origin = P([0, 3.1, 1.2], [0, 0, 0], 0, 0);
    const onBook = P([x, 1.9, z], [-0.1, -(i - 2) * 0.16, 0]);
    const jumbled = P([x + (rand(i, 14) - 0.5), 2.2 + rand(i, 15) * 0.7, z + 0.3], [rand(i, 16) - 0.5, -(i - 2) * 0.16, (rand(i, 17) - 0.5) * 1.2]);
    add(mesh, [origin, onBook, jumbled, P(SCREEN_AT, [0, 0, 0], 0.05, 0), HIDE(SCREEN_AT), HIDE(SCREEN_AT)], {
      delay: [0, 0.35 + i * 0.32, 0, 0.15 + i * 0.05, 0, 0],
      idle: (o, t, ch) => { if (ch === 2) { o.rotation.z += Math.sin(t * 3 + i) * 0.08; o.position.x += Math.sin(t * 2.4 + i) * 0.05; } }
    });
  });

  // ---- Warnings ----
  const warnGeo = track(new THREE.PlaneGeometry(1.25, 0.46));
  [['Roll no.?', 0], ['Fees today?', 2], ['23 pending', 4]].forEach(([text, b], i) => {
    const mesh = new THREE.Mesh(warnGeo, track(new THREE.MeshBasicMaterial({ map: track(warnTex(text)), depthWrite: false })));
    const x = (b - 2) * 1.5;
    const show = P([x, 2.95, -Math.abs(b - 2) * 0.55 + 0.4]);
    add(mesh, [HIDE([x, 2.2, 0]), HIDE([x, 2.2, 0]), show, HIDE([x, 2.4, 0]), HIDE(), HIDE()], {
      delay: [0, 0, 0.5 + i * 0.25, 0, 0, 0],
      idle: (o, t, ch) => { if (ch === 2) o.position.y += Math.sin(t * 3 + i * 2) * 0.06; }
    });
  });

  // ---- The clock (the principal waiting) ----
  const clock = new THREE.Group();
  const face = new THREE.Mesh(track(new THREE.CircleGeometry(0.55, 96)), track(new THREE.MeshStandardMaterial({ color: COL.paper })));
  const rimMesh = new THREE.Mesh(track(new THREE.TorusGeometry(0.56, 0.05, 24, 96)), track(new THREE.MeshStandardMaterial({ color: COL.navy, metalness: 0.2, roughness: 0.4 })));
  const handMat = track(new THREE.MeshStandardMaterial({ color: COL.navy }));
  const hourHand = new THREE.Mesh(track(new THREE.BoxGeometry(0.05, 0.3, 0.02)), handMat);
  const minHand = new THREE.Mesh(track(new THREE.BoxGeometry(0.035, 0.44, 0.02)), track(new THREE.MeshStandardMaterial({ color: COL.red })));
  hourHand.geometry.translate(0, 0.13, 0.02);
  minHand.geometry.translate(0, 0.2, 0.03);
  clock.add(face, rimMesh, hourHand, minHand);
  add(clock, [HIDE([0, 3.4, -0.5]), HIDE([0, 3.4, -0.5]), P([0, 3.45, -0.6]), HIDE([0, 3.4, -0.5]), HIDE(), HIDE()], {
    delay: [0, 0, 0.3, 0, 0, 0],
    idle: (o, t, ch) => { if (ch === 2) { minHand.rotation.z = -t * 6; hourHand.rotation.z = -t * 0.5; } }
  });

  // ---- The SmartShala screen ----
  const tablet = new THREE.Group();
  const body = new THREE.Mesh(track(new RoundedBoxGeometry(3.3, 2.18, 0.14, 4, 0.12)), track(new THREE.MeshStandardMaterial({ color: '#1A2347', metalness: 0.35, roughness: 0.35 })));
  const screen = new THREE.Mesh(track(new THREE.PlaneGeometry(3.08, 1.925)), track(new THREE.MeshBasicMaterial({ map: track(screenTex()), toneMapped: false })));
  screen.position.z = 0.075;
  const glow = new THREE.Mesh(track(new THREE.PlaneGeometry(7, 5)), track(new THREE.MeshBasicMaterial({ map: track(glowTex()), transparent: true, opacity: 1, depthWrite: false, toneMapped: false })));
  glow.position.z = -0.12;
  tablet.add(glow, body, screen);
  const tabletItem = add(tablet, [
    HIDE([0, 0.4, 0]), HIDE([0, 0.4, 0]), HIDE([0, 0.4, 0]),
    P(SCREEN_AT, [-0.04, 0, 0], 1), P(SCREEN_AT, [0, 0, 0], 0.92), P([0, 1.9, 0], [0, 0, 0], 0.92)
  ], { delay: [0, 0, 0, 0.05, 0, 0], idle: (o, t, ch) => { if (ch >= 3) { o.position.y += Math.sin(t * 1.1) * 0.05; o.rotation.y += Math.sin(t * 0.5) * 0.05; } } });

  // ---- Roles around the screen ----
  const roleGeo = track(new RoundedBoxGeometry(1.75, 0.71, 0.08, 3, 0.06));
  ROLES.forEach(([role, line, color], i) => {
    const g = new THREE.Group();
    const backing = new THREE.Mesh(roleGeo, track(new THREE.MeshStandardMaterial({ color: '#FFFDF8', roughness: 0.6 })));
    const faceM = new THREE.Mesh(track(new THREE.PlaneGeometry(1.7, 0.69)), track(new THREE.MeshBasicMaterial({ map: track(roleTex(role, line, color)), toneMapped: false })));
    faceM.position.z = 0.045;
    g.add(backing, faceM);
    const at = ROLE_AT[i];
    const out = P(at, [0, at[0] < 0 ? 0.22 : -0.22, 0]);
    add(g, [HIDE(SCREEN_AT), HIDE(SCREEN_AT), HIDE(SCREEN_AT), HIDE(SCREEN_AT), out, P([at[0] * 0.95, at[1] + 0.1, at[2]], out.r, 0.92)], {
      delay: [0, 0, 0, 0, 0.2 + i * 0.12, 0],
      idle: (o, t, ch) => { if (ch >= 4) o.position.y += Math.sin(t * 1.3 + i * 1.7) * 0.07; }
    });
  });

  // ---- Links + pulses (screen ↔ roles) ----
  const linkMat = track(new THREE.MeshBasicMaterial({ color: COL.blue2, transparent: true, opacity: 0, depthWrite: false }));
  const pulseMat = track(new THREE.MeshBasicMaterial({ color: '#7FA2FF', transparent: true, opacity: 0, toneMapped: false }));
  const links = new THREE.Group();
  const pulses = [];
  const linkGeo = track(new THREE.CylinderGeometry(0.018, 0.018, 1, 12));
  const pulseGeo = track(new THREE.SphereGeometry(0.07, 24, 24));
  const from = new THREE.Vector3(...SCREEN_AT);
  ROLE_AT.forEach((at, i) => {
    const to = new THREE.Vector3(...at);
    const dir = to.clone().sub(from);
    const m = new THREE.Mesh(linkGeo, linkMat);
    m.position.copy(from).addScaledVector(dir, 0.5);
    m.scale.y = dir.length();
    m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.clone().normalize());
    links.add(m);
    for (let k = 0; k < 2; k++) {
      const p = new THREE.Mesh(pulseGeo, pulseMat);
      links.add(p);
      pulses.push({ mesh: p, from, to, offset: k * 0.5 + i * 0.13, back: k === 1 });
    }
  });
  scene.add(links);

  // ---- Dome + other schools ----
  const domeMat = track(new THREE.MeshStandardMaterial({ color: '#4F7BFF', transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false, roughness: 0.2 }));
  const domeWire = track(new THREE.MeshBasicMaterial({ color: COL.gold, wireframe: true, transparent: true, opacity: 0, depthWrite: false }));
  const domeGeo = track(new THREE.SphereGeometry(5.6, 48, 20, 0, Math.PI * 2, 0, Math.PI / 2));
  const dome = new THREE.Group();
  dome.add(new THREE.Mesh(domeGeo, domeMat), new THREE.Mesh(domeGeo, domeWire));
  scene.add(dome);
  const others = [];
  [[-10.5, -5], [10.5, -5]].forEach(([x, z], i) => {
    const g = new THREE.Group();
    const t = new THREE.Mesh(track(new RoundedBoxGeometry(2, 1.3, 0.1, 3, 0.08)), track(new THREE.MeshStandardMaterial({ color: '#9AA0B8', roughness: 0.6 })));
    t.position.y = 1.1;
    const d = new THREE.Mesh(track(new THREE.SphereGeometry(2.4, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2)), track(new THREE.MeshBasicMaterial({ color: '#9AA0B8', wireframe: true, transparent: true, opacity: 0.3 })));
    g.add(t, d);
    g.position.set(x, 0, z);
    others.push(add(g, [HIDE([x, 0, z]), HIDE([x, 0, z]), HIDE([x, 0, z]), HIDE([x, 0, z]), HIDE([x, 0, z]), P([x, 0, z], [0, i ? -0.4 : 0.4, 0], 1, 0.75)], { delay: [0, 0, 0, 0, 0, 0.4 + i * 0.2] }));
  });

  // ---------- loop ----------
  let chapter = 0;
  let changedAt = 0;
  const camPos = new THREE.Vector3(...CAMERA[0].p);
  const camLook = new THREE.Vector3(...CAMERA[0].t);
  const pointer = new THREE.Vector2();
  const clockT = new THREE.Clock();
  let raf = 0;
  let visible = true;
  let w = 1, h = 1;
  let camDistance = 1;
  let ambientT = 0;

  const resize = () => {
    w = container.clientWidth || 1;
    h = container.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // On wide screens the story text sits on the left: shift the scene right.
    // Wide screens: the story text sits on the left, so shift the scene right.
    // Phones: the text card covers the lower half, so frame the scene in the
    // upper half and pull the camera back until the whole scene fits.
    if (w > 900) camera.setViewOffset(w, h, -w * 0.17, 0, w, h);
    else camera.setViewOffset(w, h, 0, h * 0.24, w, h);
    camera.fov = w > 900 ? 38 : 44;
    camDistance = w > 900 ? 1 : Math.min(2.3, Math.max(1, 0.9 / (w / h)));
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(container);

  const onPointer = (e) => { pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1); };
  if (!reduced && window.matchMedia('(pointer: fine)').matches) window.addEventListener('pointermove', onPointer, { passive: true });

  const tmpP = new THREE.Vector3();
  const frame = () => {
    raf = 0;
    if (!visible || document.hidden) return;
    const dt = Math.min(clockT.getDelta(), 0.05);
    // "Pause animations": chapter changes still happen, ambient motion freezes.
    const still = reduced || isMotionPaused();
    if (!still) ambientT += dt;
    const t = ambientT;
    const since = clockT.elapsedTime - changedAt;

    for (const it of items) {
      const pose = it.poses[chapter];
      const k = reduced ? 1 : since < it.delay[chapter] ? 0 : 1 - Math.exp(-dt * it.speed);
      it.cur.p.lerp(tmpP.set(...pose.p), k);
      it.cur.r.x += (pose.r[0] - it.cur.r.x) * k;
      it.cur.r.y += (pose.r[1] - it.cur.r.y) * k;
      it.cur.r.z += (pose.r[2] - it.cur.r.z) * k;
      it.cur.s += (pose.s - it.cur.s) * k;
      it.cur.o += (pose.o - it.cur.o) * k;
      const o = it.obj;
      o.position.copy(it.cur.p);
      o.rotation.set(it.cur.r.x, it.cur.r.y, it.cur.r.z);
      o.scale.setScalar(Math.max(it.cur.s, 0.0001));
      o.visible = it.cur.s > 0.01 && it.cur.o > 0.01;
      for (const m of it.mats) m.opacity = it.cur.o * (m.userData.base ?? 1);
      if (it.idle && !still) it.idle(o, t, chapter);
    }
    glow.material.opacity = tabletItem.cur.o;

    // Links and pulses: chapters 4–5.
    const linkTarget = chapter >= 4 ? 0.55 : 0;
    const kk = reduced ? 1 : 1 - Math.exp(-dt * 2.5);
    linkMat.opacity += (linkTarget - linkMat.opacity) * kk;
    pulseMat.opacity = linkMat.opacity > 0.05 ? Math.min(1, linkMat.opacity * 1.8) : 0;
    links.visible = linkMat.opacity > 0.02;
    for (const p of pulses) {
      const f = reduced ? 0.5 : (t * 0.45 + p.offset) % 1; // frozen while paused (t stops)
      p.mesh.position.lerpVectors(p.back ? p.to : p.from, p.back ? p.from : p.to, f);
    }
    // Dome: chapter 5.
    const domeTarget = chapter === 5 ? 1 : 0;
    domeMat.opacity += (domeTarget * 0.07 - domeMat.opacity) * kk;
    domeWire.opacity += (domeTarget * 0.22 - domeWire.opacity) * kk;
    dome.visible = domeWire.opacity > 0.01;

    // Camera eases to the chapter's view, with a little pointer parallax.
    const cam = CAMERA[chapter];
    const ck = reduced ? 1 : 1 - Math.exp(-dt * 1.6);
    tmpP.set(cam.p[0] - cam.t[0], cam.p[1] - cam.t[1], cam.p[2] - cam.t[2]).multiplyScalar(camDistance);
    camPos.lerp(tmpP.set(cam.t[0] + tmpP.x + pointer.x * 0.5, cam.t[1] + tmpP.y - pointer.y * 0.3, cam.t[2] + tmpP.z), ck);
    camLook.lerp(tmpP.set(...cam.t), ck);
    camera.position.copy(camPos);
    camera.lookAt(camLook);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  };
  const start = () => { if (!raf && visible && !document.hidden) { clockT.getDelta(); raf = requestAnimationFrame(frame); } };

  const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; start(); });
  io.observe(container);
  const onVis = () => start();
  document.addEventListener('visibilitychange', onVis);
  start();

  return {
    setChapter(i) {
      if (i === chapter) return;
      chapter = Math.max(0, Math.min(CAMERA.length - 1, i));
      changedAt = clockT.elapsedTime;
      start();
    },
    dispose() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('pointermove', onPointer);
      disposables.forEach((d) => d.dispose?.());
      renderer.dispose();
      renderer.domElement.remove();
    }
  };
}
