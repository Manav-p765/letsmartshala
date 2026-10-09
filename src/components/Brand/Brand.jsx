import { Link } from 'react-router-dom';
import { MARK_VIEWBOX, MARK_TILE, MARK_PATH } from './markPath.js';
import './Brand.css';

/**
 * The CRM's interlocking SS mark as free-standing letters in the logo blue,
 * cropped tight to the letters. `tile` puts it back on its blue square
 * (favicon, app-icon style) where a container is wanted.
 */
const LETTERS_VIEWBOX = '360 330 512 585';
export function Mark({ className = 'brand__mark', tile = false }) {
  if (tile) {
    const t = MARK_TILE;
    return (
      <svg className={className} viewBox={MARK_VIEWBOX} aria-hidden="true">
        <rect x={t.x} y={t.y} width={t.size} height={t.size} rx={t.r} fill="var(--blue)" />
        <path d={MARK_PATH} fill="#fff" fillRule="evenodd" />
      </svg>
    );
  }
  return (
    <svg className={className} viewBox={LETTERS_VIEWBOX} aria-hidden="true">
      <path d={MARK_PATH} fill="currentColor" fillRule="evenodd" />
    </svg>
  );
}

/**
 * The official logo (docs/logo/logo.png): white SS on the rounded blue
 * tile, with the wordmark in one ink colour beside it.
 */
export default function Brand({ to = '/', size = 'md' }) {
  return (
    <Link to={to} className={`brand brand--${size}`} aria-label="SmartShala home">
      <Mark tile />
      <span className="brand__word">
        Smart<span className="brand__word-2">Shala</span>
      </span>
    </Link>
  );
}
