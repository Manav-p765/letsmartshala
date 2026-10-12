import { createElement, lazy } from 'react';

/** Route chunks, shared by App (lazy) and Layout (idle prefetch). */
// Everything but home loads on demand and is prefetched when the browser is idle.
export const lazyPages = {
  demo: () => import('./pages/DemoPage.jsx'),
  thanks: () => import('./pages/ThankYouPage.jsx'),
  features: () => import('./pages/FeaturesPage.jsx'),
  solutions: () => import('./pages/SolutionsPage.jsx'),
  pricing: () => import('./pages/PricingPage.jsx'),
  about: () => import('./pages/AboutPage.jsx'),
  contact: () => import('./pages/ContactPage.jsx'),
  security: () => import('./pages/SecurityPage.jsx'),
  legal: () => import('./pages/LegalPage.jsx'),
  blog: () => import('./pages/BlogPage.jsx'),
  blogPost: () => import('./pages/BlogPostPage.jsx'),
  admin: () => import('./pages/AdminPage.jsx')
};


/**
 * A lazy page that can also be loaded ahead of the first render. Once
 * preloaded it renders straight away, with no Suspense fallback in between —
 * so a prerendered page is never swapped for a blank screen while its code
 * arrives (see main.jsx).
 */
function page(load) {
  const Lazy = lazy(load);
  let Ready = null;
  const Page = (props) => createElement(Ready || Lazy, props);
  Page.preload = () => load().then((m) => { Ready = m.default; });
  return Page;
}

export const pages = Object.fromEntries(Object.entries(lazyPages).map(([key, load]) => [key, page(load)]));

/** Which page a URL path belongs to (null for the home page, which is never lazy). */
export function pageKeyFor(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return null;
  if (path === '/thank-you') return 'thanks';
  if (['/privacy', '/terms', '/refunds'].includes(path)) return 'legal';
  if (path.startsWith('/blog/')) return 'blogPost';
  const key = path.slice(1);
  return key in lazyPages ? key : null;
}
