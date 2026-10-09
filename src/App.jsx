import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { lazyPages } from './routes.js';

const DemoPage = lazy(lazyPages.demo);
const ThankYouPage = lazy(lazyPages.thanks);
const FeaturesPage = lazy(lazyPages.features);
const SolutionsPage = lazy(lazyPages.solutions);
const PricingPage = lazy(lazyPages.pricing);
const AboutPage = lazy(lazyPages.about);
const ContactPage = lazy(lazyPages.contact);
const SecurityPage = lazy(lazyPages.security);
const LegalPage = lazy(lazyPages.legal);

// A blank screen the height of a page, so the footer doesn't jump up while a route loads.
const Fallback = () => <div style={{ minHeight: '100svh' }} aria-busy="true" />;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Ad landing and thank-you: brand + one button, nothing to wander off to. */}
        <Route element={<Layout minimal />}>
          <Route path="demo" element={<DemoPage />} />
          <Route path="thank-you" element={<ThankYouPage />} />
        </Route>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="features" element={<FeaturesPage />} />
          <Route path="solutions" element={<SolutionsPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="security" element={<SecurityPage />} />
          <Route path="privacy" element={<LegalPage doc="privacy" />} />
          <Route path="terms" element={<LegalPage doc="terms" />} />
          <Route path="refunds" element={<LegalPage doc="refunds" />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
