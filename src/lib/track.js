/**
 * Analytics and ad conversions. Every tag is opt-in through an env var
 * (set in Vercel → Environment Variables, then redeploy); with none set,
 * nothing third-party loads at all.
 *
 *   VITE_GA4_ID           GA4 measurement ID, "G-XXXXXXX"
 *   VITE_GADS_ID          Google Ads tag ID, "AW-XXXXXXXXX"
 *   VITE_GADS_LEAD_LABEL  conversion label for the demo-request action
 *   VITE_META_PIXEL_ID    Meta (Facebook/Instagram) pixel ID
 *
 * The lead conversion fires on /thank-you, but only when the form has just
 * been submitted in this tab (a sessionStorage flag) — so a refresh, a
 * bookmark or a shared link never counts as a second lead.
 */
const env = import.meta.env;
const GA4 = env.VITE_GA4_ID;
const GADS = env.VITE_GADS_ID;
const GADS_LABEL = env.VITE_GADS_LEAD_LABEL;
const PIXEL = env.VITE_META_PIXEL_ID;

const FLAG = 'ss-lead-submitted';
let started = false;

function script(src) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** Load whichever tags are configured. Safe to call more than once. */
export function initTracking() {
  if (started || typeof window === 'undefined') return;
  started = true;

  if (GA4 || GADS) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    // Page views are sent per route by trackPageView, not on load.
    if (GA4) window.gtag('config', GA4, { send_page_view: false });
    if (GADS) window.gtag('config', GADS);
    script(`https://www.googletagmanager.com/gtag/js?id=${GA4 || GADS}`);
  }

  if (PIXEL) {
    /* eslint-disable */
    !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0'; n.queue = []; }(window, document);
    /* eslint-enable */
    window.fbq('init', PIXEL);
    script('https://connect.facebook.net/en_US/fbevents.js');
  }
}

export function trackPageView(path) {
  if (GA4 && window.gtag) window.gtag('event', 'page_view', { page_path: path, page_location: location.href, page_title: document.title });
  if (PIXEL && window.fbq) window.fbq('track', 'PageView');
}

/** Called by the form right after a successful submit. */
export function markLeadSubmitted(role) {
  try { sessionStorage.setItem(FLAG, role || '1'); } catch { /* storage blocked: conversion just won't fire */ }
}

/** Called by /thank-you. Fires the conversion once per real submission. */
export function trackLeadConversion() {
  let role;
  try {
    role = sessionStorage.getItem(FLAG);
    sessionStorage.removeItem(FLAG);
  } catch { return false; }
  if (!role) return false;

  if (GA4 && window.gtag) window.gtag('event', 'generate_lead', { role });
  if (GADS && GADS_LABEL && window.gtag) window.gtag('event', 'conversion', { send_to: `${GADS}/${GADS_LABEL}` });
  if (PIXEL && window.fbq) window.fbq('track', 'Lead');
  return true;
}
