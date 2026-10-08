/**
 * Site-wide facts. Anything marked `dummy: true` is a placeholder that is
 * shown on the page with a "Dummy" tag until the real value arrives —
 * see docs/content.md for the list of open questions.
 */
export const site = {
  name: 'SmartShala',
  tagline: 'School management CRM for Indian schools',

  // The CRM's current deployment. Swap for the production app domain once it exists.
  appUrl: 'https://campus-loom.vercel.app',
  loginUrl: 'https://campus-loom.vercel.app/login',

  contact: {
    phone: { value: '+91 98765 43210', dummy: true },
    whatsapp: { value: '+91 98765 43210', dummy: true },
    email: { value: 'hello@smartshala.example', dummy: true },
    address: { value: 'Office address to be confirmed', dummy: true }
  }
};

export const nav = [
  { label: 'Features', to: '/features' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Pricing', to: '/pricing' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' }
];
