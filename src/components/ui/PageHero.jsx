/**
 * Header for inner pages: eyebrow, masked title lines, lede, optional
 * actions — on ivory, with the school linework at the edges and the home
 * hero's arc as a faint blur behind, so every page starts from the same idea.
 */
export default function PageHero({ eyebrow, title, lede, id, children, align = 'center' }) {
  return (
    <section className={`section page-hero page-hero--${align}`} data-theme="paper" aria-labelledby={id}>
      <div className="linework" aria-hidden="true" />
      <svg className="page-hero__arc" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true">
        <path d="M 80 500 A 420 420 0 0 1 920 500" />
      </svg>
      <div className="container page-hero__inner">
        {eyebrow && <p className="label page-hero__eyebrow" data-animate="fade-up">{eyebrow}</p>}
        <h1 className="display page-hero__title" id={id} data-animate="lines">
          {title.map((l) => <span className="line-mask" key={l}><span>{l}</span></span>)}
        </h1>
        {lede && <p className="lede page-hero__lede" data-animate="fade-up">{lede}</p>}
        {children && <div className="page-hero__actions" data-animate="fade-up">{children}</div>}
      </div>
    </section>
  );
}
