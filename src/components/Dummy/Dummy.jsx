import './Dummy.css';

/**
 * Wraps placeholder content so nobody mistakes it for a real fact.
 * Every use is listed in docs/content.md and must be replaced before launch.
 */
export default function Dummy({ children, note = 'Dummy' }) {
  return (
    <span className="dummy">
      {children}
      <span className="dummy__tag" title="Placeholder — to be replaced before launch">{note}</span>
    </span>
  );
}

/** Renders a site.js field: shows the "Dummy" tag only when the value is a placeholder. */
export function Fact({ field }) {
  return field.dummy ? <Dummy>{field.value}</Dummy> : field.value;
}
