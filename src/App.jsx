import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import { pages } from './routes.js';

const {
  demo: DemoPage, thanks: ThankYouPage, features: FeaturesPage, solutions: SolutionsPage,
  pricing: PricingPage, about: AboutPage, contact: ContactPage, security: SecurityPage,
  legal: LegalPage, blog: BlogPage, blogPost: BlogPostPage, admin: AdminPage
} = pages;

// A blank screen the height of a page, so the footer doesn't jump up while a route loads.
const Fallback = () => <div style={{ minHeight: '100svh' }} aria-busy="true" />;

export default function App() {
  return (
    <Suspense fallback={<Fallback />}>
      <Routes>
        {/* Ad landing and thank-you: brand + one button, nothing to wander off to. */}
        {/* The blog admin is a tool: no site chrome. */}
        <Route path="admin" element={<AdminPage />} />
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
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
