import { dayFraction } from '../../data/dayArc.js';

/**
 * A thumbnail of the hero's day arc with the sun parked at `time` —
 * a quiet callback that ties later sections to the hero.
 */
export default function MiniArc({ time, width = 96, height = 34 }) {
  const f = dayFraction(time);
  const t = Math.PI * (1 - f);
  const rx = width / 2 - 4;
  const ry = height - 6;
  const cx = width / 2;
  const cy = height - 2;
  const x = cx + rx * Math.cos(t);
  const y = cy - ry * Math.sin(t);
  const d = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
  return (
    <svg className="mini-arc" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="var(--blue)" strokeWidth="1.5" pathLength="1" strokeDasharray={`${f} 1`} />
      <circle cx={x} cy={y} r="4" fill="var(--blue)" />
    </svg>
  );
}
