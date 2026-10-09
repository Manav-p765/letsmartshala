import { dayFraction } from '../../data/dayArc.js';

/**
 * A thumbnail of the hero's day arc with the sun parked at `time` — a quiet
 * callback that ties later sections to the hero. The sun rides the curve
 * with CSS offset-path, so a parent can animate it from dawn to that hour.
 */
export default function MiniArc({ time, width = 96, height = 34 }) {
  const f = dayFraction(time);
  const rx = width / 2 - 4;
  const ry = height - 6;
  const cx = width / 2;
  const cy = height - 2;
  const d = `M ${cx - rx} ${cy} A ${rx} ${ry} 0 0 1 ${cx + rx} ${cy}`;
  return (
    <svg className="mini-arc" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
      <path d={d} fill="none" stroke="currentColor" strokeOpacity="0.15" strokeWidth="1.5" />
      <path
        className="mini-arc__run"
        d={d}
        fill="none"
        stroke="var(--blue)"
        strokeWidth="1.75"
        pathLength="1"
        strokeDasharray="1 1"
        style={{ '--to': 1 - f }}
      />
      <circle
        className="mini-arc__sun"
        r="4"
        fill="var(--blue)"
        style={{ offsetPath: `path("${d}")`, '--at': `${f * 100}%` }}
      />
    </svg>
  );
}
