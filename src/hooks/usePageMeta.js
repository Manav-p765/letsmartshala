import { useEffect } from 'react';
import { site } from '../data/site.js';

const setMeta = (attr, key, value) => {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
};

/**
 * Per-route title, description, canonical and link-preview tags. The
 * prerender step (scripts/prerender.mjs) captures them into each page's
 * static HTML, so crawlers and WhatsApp previews see the right text.
 */
export default function usePageMeta({ title, description, path = '/', noindex = false }) {
  useEffect(() => {
    const full = path === '/' ? title : `${title} · SmartShala`;
    const url = site.siteUrl + (path === '/' ? '/' : path);
    document.title = full;
    setMeta('name', 'description', description);
    setMeta('property', 'og:title', full);
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', full);
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : 'index, follow');
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.rel = 'canonical';
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, path, noindex]);
}
