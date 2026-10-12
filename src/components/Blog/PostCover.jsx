/**
 * A post's cover: its uploaded image, or — when there isn't one — a
 * generated cover in the site's own language: ivory paper, a ruled margin,
 * the day arc and the post's first tag. Every post looks finished even
 * without a photo.
 */
export default function PostCover({ post, size = 'md' }) {
  if (post.cover) {
    return (
      <div className={`pcover pcover--${size}`}>
        <img src={post.cover} alt="" loading="lazy" decoding="async" />
      </div>
    );
  }
  // Vary the arc a little per post so a grid of covers isn't identical.
  const seed = [...post.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const sun = 0.2 + (seed % 60) / 100;
  const t = Math.PI * (1 - sun);
  const x = 200 + 150 * Math.cos(t);
  const y = 230 - 150 * Math.sin(t);
  return (
    <div className={`pcover pcover--${size} pcover--drawn`} aria-hidden="true">
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
        <path d="M 50 240 A 150 150 0 0 1 350 240" className="pcover__band" />
        <path d="M 50 240 A 150 150 0 0 1 350 240" className="pcover__arc" />
        <circle cx={x} cy={y} r="7" className="pcover__sun" />
      </svg>
      <span className="pcover__tag">{post.tags?.[0] || 'SmartShala'}</span>
    </div>
  );
}
