/**
 * Geometry for the hero's half-ellipse "day path".
 *
 * Everything is measured along the curve's real length, not its angle,
 * so the sun, the blue progress stroke (a pathLength=1 dash) and the cards
 * all agree on where "11:00" is, even though an ellipse isn't a circle.
 */
const SAMPLES = 240;

/**
 * Wide screens: a tall arch that frames the headline.
 * Narrow screens: a shallow arch that sits on top of the card row.
 */
export function makeArc({ w, h, narrow, navH, cardsTop }) {
  let cx, cy, rx, ry;
  if (narrow) {
    cx = w / 2;
    cy = cardsTop + 4;
    rx = w / 2 - 22;
    ry = Math.min(110, w * 0.26);
  } else {
    const sidePad = Math.min(150, w * 0.11);
    cx = w / 2;
    cy = h - 18;
    rx = w / 2 - sidePad;
    ry = Math.max(160, cy - (navH + 70));
  }

  // Sample the left→right half-ellipse once and keep cumulative lengths.
  const pts = [];
  let len = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const t = Math.PI * (1 - i / SAMPLES);
    const x = cx + rx * Math.cos(t);
    const y = cy - ry * Math.sin(t);
    if (i) len += Math.hypot(x - pts[i - 1].x, y - pts[i - 1].y);
    pts.push({ x, y, len });
  }
  const total = len;

  /** Point at fraction f (0..1) of the arc's length, with its outward normal. */
  function at(f) {
    const target = Math.min(1, Math.max(0, f)) * total;
    let i = 1;
    while (i < SAMPLES && pts[i].len < target) i++;
    const a = pts[i - 1];
    const b = pts[i];
    const k = b.len === a.len ? 0 : (target - a.len) / (b.len - a.len);
    const x = a.x + (b.x - a.x) * k;
    const y = a.y + (b.y - a.y) * k;
    // Outward normal of an ellipse is the gradient of (x/rx)² + (y/ry)².
    const nx = (x - cx) / (rx * rx);
    const ny = (y - cy) / (ry * ry);
    const n = Math.hypot(nx, ny) || 1;
    return { x, y, nx: nx / n, ny: ny / n };
  }

  return {
    w, h, cx, cy, rx, ry, at,
    d: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`
  };
}

const overlaps = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

/**
 * Places each card centred on its moment of the arc. Where that would cover
 * the headline block, the card slides outward along the arc's normal until
 * it is clear (the hero then draws a short connector back to the arc).
 * A card that can't be placed without leaving the stage is dropped from the
 * arc rather than allowed to cover the copy.
 */
export function placeCards(arc, fractions, card, avoid, minTop) {
  const pad = 14;
  const keepOut = { l: avoid.l - pad, r: avoid.r + pad, t: avoid.t - pad, b: avoid.b + pad };
  const placed = [];

  return fractions.map((f) => {
    const p = arc.at(f);
    for (let push = 0; push <= 220; push += 6) {
      let x = p.x + p.nx * push;
      const y = p.y + p.ny * push;
      // Never hang off the sides of the stage.
      x = Math.min(arc.w - card.w / 2 - 12, Math.max(card.w / 2 + 12, x));
      const r = { l: x - card.w / 2, r: x + card.w / 2, t: y - card.h / 2, b: y + card.h / 2 };
      if (r.t < minTop) break;
      if (overlaps(r, keepOut) || placed.some((o) => overlaps(r, o))) continue;
      placed.push(r);
      return { x, y, ax: p.x, ay: p.y, pushed: push > 0, visible: true };
    }
    return { x: p.x, y: p.y, ax: p.x, ay: p.y, pushed: false, visible: false };
  });
}
