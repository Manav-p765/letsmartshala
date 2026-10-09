/**
 * Geometry for the hero's half-ellipse "day path".
 *
 * Everything is measured along the curve's real length, not its angle,
 * so the sun, the blue progress stroke (a pathLength=1 dash) and the cards
 * all agree on where "11:00" is, even though an ellipse isn't a circle.
 */
const SAMPLES = 240;
/** How far every card hangs off the arc, on its dotted string. */
export const HANG = 44;

/**
 * Wide screens: a tall arch that frames the headline.
 * Narrow screens: a shallow arch that sits on top of the card row.
 */
export function makeArc({ w, h, narrow, navH, cardsTop, copyTop, legTo }) {
  let cx, cy, rx, ry;
  // The day runs between the two points where the ellipse crosses y = base.
  // On narrow screens that is the ellipse's own ends. On wide screens the
  // ellipse is centred lower, on the section's bottom edge, so it keeps
  // curving down past the day's ends until it meets that edge.
  let base;
  if (narrow) {
    cx = w / 2;
    cy = cardsTop + 4;
    base = cy;
    rx = w / 2 - 22;
    ry = Math.min(110, w * 0.26);
  } else {
    const sidePad = Math.min(150, w * 0.11);
    cx = w / 2;
    base = h - 18;
    cy = Math.max(base, legTo ?? base);
    rx = w / 2 - sidePad;
    // The crown sits high enough for a card to hang above it, and always
    // clear of the copy: the band (and its soft glow) never crosses text.
    const crown = Math.min(navH + 70 + HANG, (copyTop ?? h) - 70);
    ry = Math.max(160, cy - crown);
  }

  // Angle where the ellipse crosses y = base (0 when base is its centre line).
  const t0 = Math.asin(Math.min(1, (cy - base) / ry));
  const pointAt = (t) => [cx + rx * Math.cos(t), cy - ry * Math.sin(t)];

  // Sample the left→right day-arc once and keep cumulative lengths.
  const pts = [];
  let len = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const t = Math.PI - t0 - (Math.PI - 2 * t0) * (i / SAMPLES);
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

  const [sx, sy] = pointAt(Math.PI - t0);
  const [ex, ey] = pointAt(t0);
  const r1 = (n) => n.toFixed(1);
  return {
    w, h, cx, cy, rx, ry, at,
    // The day's path: the sun and the progress stroke travel this.
    d: `M ${r1(sx)} ${r1(sy)} A ${rx} ${ry} 0 0 1 ${r1(ex)} ${r1(ey)}`,
    // The whole half-ellipse, down to the section's edge: glow, band, track.
    dFull: `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`,
    // The stretch below the day's start is already "lived": drawn as progress.
    dStartLeg: cy > base ? `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${r1(sx)} ${r1(sy)}` : null
  };
}

const overlaps = (a, b) => a.l < b.r && a.r > b.l && a.t < b.b && a.b > b.t;

/**
 * Places each card just outside its moment of the arc, hanging off it on a
 * dotted string (HANG px out along the arc's normal). Where that would cover
 * the headline or another card, it slides further out until clear; if it
 * runs out of room above, it tries hanging closer in. A card that still
 * can't be placed is dropped from the arc rather than cover the copy.
 */
export function placeCards(arc, fractions, card, avoid, minTop) {
  const pad = 14;
  const keepOut = { l: avoid.l - pad, r: avoid.r + pad, t: avoid.t - pad, b: avoid.b + pad };
  const placed = [];

  return fractions.map((f) => {
    const p = arc.at(f);
    const tries = [];
    for (let push = HANG; push <= 240; push += 6) tries.push(push);
    for (let push = HANG - 6; push >= 0; push -= 6) tries.push(push);
    for (const push of tries) {
      let x = p.x + p.nx * push;
      const y = p.y + p.ny * push;
      // Never hang off the sides of the stage.
      x = Math.min(arc.w - card.w / 2 - 12, Math.max(card.w / 2 + 12, x));
      const r = { l: x - card.w / 2, r: x + card.w / 2, t: y - card.h / 2, b: y + card.h / 2 };
      if (r.t < minTop) continue;
      if (overlaps(r, keepOut) || placed.some((o) => overlaps(r, o))) continue;
      placed.push(r);
      return { x, y, ax: p.x, ay: p.y, pushed: push > 0, visible: true };
    }
    return { x: p.x, y: p.y, ax: p.x, ay: p.y, pushed: false, visible: false };
  });
}
