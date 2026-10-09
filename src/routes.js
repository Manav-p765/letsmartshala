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
  legal: () => import('./pages/LegalPage.jsx')
};

