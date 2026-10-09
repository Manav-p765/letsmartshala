/**
 * Legal pages. These are DRAFTS written from what the site and product
 * actually do; every page shows a "draft, pending legal review" banner
 * until a lawyer has approved the text. Set `reviewed: true` per document
 * once it has been, and fill in the registered address (open question in
 * docs/content.md).
 */
const company = 'Hybrid Monks LLP';
const email = 'support@letssmartshala.com';
const updated = '9 October 2026';

export const legal = {
  privacy: {
    path: '/privacy',
    title: 'Privacy policy',
    meta: 'How SmartShala and Hybrid Monks LLP collect and use personal data on this website and in the SmartShala product.',
    reviewed: false,
    updated,
    sections: [
      { h: 'Who we are', p: [`SmartShala is a school management product of ${company} (“we”, “us”). This policy covers this website and the SmartShala product. Contact: ${email}.`] },
      { h: 'What we collect on this website', p: ['When you request a demo or a quote we collect your name, your school’s name, your role, your mobile number and, if you give it, your email address. We also keep the page you came from and any advertising campaign tags in the link you followed, so we know which campaign brought you.', 'If analytics or advertising tags are enabled, Google and Meta may set cookies and receive information about your visit, such as pages viewed and whether you submitted a request.'] },
      { h: 'How we use it', p: ['To contact you about the demo or quote you asked for, to answer your questions, and to measure which of our campaigns work. We do not sell your personal data.'] },
      { h: 'Data in the SmartShala product', p: ['Schools that use SmartShala enter data about their students, parents and staff. For that data the school decides what is collected and why, and we process it on the school’s behalf. Each school’s data is kept in its own separate database, and access is limited by role.'] },
      { h: 'Who we share it with', p: ['Service providers that help us run the website and product — for example hosting, email delivery, payments (Razorpay) and, where enabled, analytics and advertising (Google, Meta). They may only use the data to provide their service to us. We may disclose data if the law requires it.'] },
      { h: 'How long we keep it', p: ['Demo and quote requests are kept for as long as needed to follow up and for a reasonable period afterwards, unless you ask us to delete them sooner.'] },
      { h: 'Your choices and rights', p: [`You can ask to see, correct or delete the personal data we hold about you, or withdraw consent to being contacted, by writing to ${email}. You can block cookies in your browser.`] },
      { h: 'Grievances', p: [`Questions or complaints about how your data is handled can be sent to ${email}. [Grievance officer name and registered address to be added.]`] },
      { h: 'Changes', p: ['We will update this page when the policy changes and change the date at the top.'] }
    ]
  },
  terms: {
    path: '/terms',
    title: 'Terms of use',
    meta: 'Terms for using the SmartShala website and product, by Hybrid Monks LLP.',
    reviewed: false,
    updated,
    sections: [
      { h: 'About these terms', p: [`These terms apply to this website and to the SmartShala product provided by ${company}. Schools that subscribe may also sign an order or agreement with us; if they conflict, that agreement applies.`] },
      { h: 'Using the website', p: ['You may use this website to learn about SmartShala and to contact us. Please don’t misuse it — for example by trying to break it, scrape it at scale or send false requests.'] },
      { h: 'Accounts in the product', p: ['Schools are responsible for who they give accounts to, for keeping passwords private, and for the data they enter. Each user should only access what their role allows.'] },
      { h: 'Subscriptions and payment', p: ['Subscriptions are billed as agreed in your quote or invoice, in Indian rupees, with GST where applicable. Payments are made through Razorpay or as otherwise agreed.'] },
      { h: 'Your school’s data', p: ['Your school owns the data it enters. We use it only to provide the service. You can ask for an export, and you can ask for your school’s data to be deleted.'] },
      { h: 'Availability', p: ['We work to keep SmartShala available and secure, but cannot promise it will never be interrupted. We may update features over time.'] },
      { h: 'Liability', p: ['[To be completed with legal advice: limitation of liability, indemnity, governing law and jurisdiction.]'] },
      { h: 'Contact', p: [`Questions about these terms: ${email}.`] }
    ]
  },
  refunds: {
    path: '/refunds',
    title: 'Refund & cancellation policy',
    meta: 'Refund and cancellation policy for SmartShala subscriptions.',
    reviewed: false,
    updated,
    sections: [
      { h: 'Cancelling', p: [`A school can cancel its subscription by writing to ${email} from the principal’s or owner’s email address. Cancellation takes effect at the end of the current billing period unless agreed otherwise.`] },
      { h: 'Refunds', p: ['[To be confirmed by SmartShala: whether and how unused periods are refunded, any time limit for refund requests, and how long refunds take to reach the original payment method.]'] },
      { h: 'Your data after cancelling', p: ['Before your access ends you can ask for an export of your school’s data. After that, you can ask for it to be deleted.'] },
      { h: 'Contact', p: [`Refund or cancellation questions: ${email}, or call/WhatsApp +91 78630 41196.`] }
    ]
  }
};
