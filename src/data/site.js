/**
 * Site-wide facts. Anything marked `dummy: true` is a placeholder that is
 * shown on the page with a "Dummy" tag until the real value arrives —
 * see docs/content.md for the list of open questions.
 */
export const site = {
  name: 'SmartShala',
  tagline: 'School management CRM for Indian schools',
  legalName: 'Hybrid Monks LLP',

  // The CRM's current deployment. Swap for the production app domain once it exists.
  appUrl: 'https://campus-loom.vercel.app',
  loginUrl: 'https://campus-loom.vercel.app/login',

  contact: {
    phone: { value: '+91 78630 41196', href: 'tel:+917863041196' },
    // Same number as phone until HR confirms it is on WhatsApp.
    whatsapp: { value: '+91 78630 41196', href: 'https://wa.me/917863041196', dummy: true },
    email: { value: 'support@letssmartshala.com', href: 'mailto:support@letssmartshala.com' }
  },

  // Inbox that receives demo-form leads.
  leadsInbox: 'support@letssmartshala.com'
};

export const nav = [
  { label: 'Features', to: '/features' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];
