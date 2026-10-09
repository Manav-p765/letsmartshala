import './SectionHead.css';

/**
 * Eyebrow + masked multi-line display title + lede. `title` is an array of
 * lines; each line rises out of its own mask when the section scrolls in.
 */
export default function SectionHead({ eyebrow, title, lede, align = 'left', id, children }) {
  const lines = Array.isArray(title) ? title : [title];
  return (
    <header className={`shead shead--${align}`}>
      {eyebrow && <p className="label shead__eyebrow" data-animate="fade-up">{eyebrow}</p>}
      <h2 className="display shead__title" id={id} data-animate="lines">
        {lines.map((l) => (
          <span className="line-mask" key={l}><span>{l}</span></span>
        ))}
      </h2>
      {lede && <p className="lede shead__lede" data-animate="fade-up">{lede}</p>}
      {children}
    </header>
  );
}
