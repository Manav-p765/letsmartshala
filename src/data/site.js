/**
 * Site-wide facts. Anything marked `dummy: true` is a placeholder that is
 * shown on the page with a "Dummy" tag until the real value arrives —
 * see docs/content.md for the list of open questions.
 */
export const site = {
  name: 'SmartShala',
  tagline: 'School management CRM for Indian schools',
  legalName: 'Hybrid Monks LLP',

  siteUrl: 'https://letssmartshala.com',

  // The CRM's current deployment. Swap for the production app domain once it exists.
  appUrl: 'https://campus-loom.vercel.app',
  loginUrl: 'https://campus-loom.vercel.app/login',

  contact: {
    phone: { value: '+91 78630 41196', href: 'tel:+917863041196' },
    whatsapp: { value: '+91 78630 41196', href: 'https://wa.me/917863041196' },
    email: { value: 'support@letssmartshala.com', href: 'mailto:support@letssmartshala.com' }
  },

  // Official social profiles. Add more here (facebook, linkedin, youtube,
  // x); each needs an icon in components/ui/SocialLinks.jsx.
  social: [
    { id: 'instagram', label: 'Instagram', handle: '@letssmartshala', href: 'https://www.instagram.com/letssmartshala/' },
    { id: 'whatsapp', label: 'WhatsApp', handle: '+91 78630 41196', href: 'https://wa.me/917863041196' }
  ],

  // Store links for the Flutter apps. An empty link shows that badge as
  // "Coming soon" (not clickable); paste the real listing URL to make it live,
  // e.g. https://play.google.com/store/apps/details?id=…
  apps: [
    { name: 'Principal app', play: '', appStore: '' },
    { name: 'Teacher app', play: '', appStore: '' }
  ],

  // Inbox that receives demo-form leads.
  leadsInbox: 'support@letssmartshala.com'
};

export const nav = [
  { label: 'Features', to: '/features' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' }
];
