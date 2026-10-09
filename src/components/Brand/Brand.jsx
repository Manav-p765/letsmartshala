import { Link } from 'react-router-dom';
import { MARK_VIEWBOX, MARK_TILE, MARK_PATH } from './markPath.js';
import './Brand.css';

/** The CRM's interlocking SS mark, as a vector so it stays sharp at any size. */
export function Mark({ className = 'brand__mark' }) {
  const t = MARK_TILE;
  return (
    <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true">
      <rect x={t.x} y={t.y} width={t.size} height={t.size} rx={t.r} fill="var(--blue)" />
      <path d={MARK_PATH} fill="#fff" fillRule="evenodd" />
    </svg>
  );
}

/** Mark plus the wordmark set in the display face. */
export default function Brand({ to = '/', size = 'md' }) {
  return (
    <Link to={to} className={`brand brand--${size}`} aria-label="SmartShala home">
      <Mark />
      <span className="brand__word">
        Smart<span className="brand__word-2">Shala</span>
      </span>
    </Link>
  );
}
