import { Link } from 'react-router-dom';
import './Brand.css';

/** The CRM's interlocking SS mark plus the wordmark set in the display face. */
export default function Brand({ to = '/', size = 'md' }) {
  return (
    <Link to={to} className={`brand brand--${size}`} aria-label="SmartShala home">
      <img
        className="brand__mark"
        src="/brand/mark-64.webp"
        srcSet="/brand/mark-64.webp 1x, /brand/mark-128.webp 2x"
        width="32"
        height="32"
        alt=""
      />
      <span className="brand__word">
        Smart<span className="brand__word-2">Shala</span>
      </span>
    </Link>
  );
}
