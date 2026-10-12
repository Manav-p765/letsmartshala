/**
 * The About page: the story film (public/film/smartshala-story.html, made
 * with the javascript-animation + soundtrack skills; storyboard in
 * film/storyboard.md), "the difference" in three before/after lines, then
 * principles and real releases. Claims map to CRM features (docs/content.md);
 * the release list comes from the CRM's commit history (Sep–Oct 2026). The
 * founding story is NOT here because we haven't been told it.
 */
export const aboutMeta = {
  title: 'About',
  description: 'Why SmartShala exists: one new student, five registers, and an office always catching up — told in a 34-second film, and how one system fixes it.'
};

export const hero = {
  eyebrow: 'About SmartShala',
  title: ['A school runs on', 'a thousand small records.'],
  lede: 'We built SmartShala so the people who run a school spend their day on the school, not on the registers. Scroll, and the story plays.',
  film: {
    src: '/film/smartshala-story.html',
    title: 'SmartShala — the story (34 seconds, animated)',
    note: '34 seconds · press Play for sound'
  }
};

/** Before (struck through in red pen) → after. */
export const difference = {
  eyebrow: 'The difference',
  title: ['What changes on', 'the first day.'],
  rows: [
    { before: 'Written five times', after: 'Written once', detail: 'One student record that the office, class teacher, accountant, transport and exam teachers all read.' },
    { before: 'Fees known by evening', after: 'Fees live, all day', detail: 'The principal sees staff in, classes marked and fees collected as they happen — on the web or the principal app.' },
    { before: 'Defaulters found at term end', after: 'Defaulters from the first missed instalment', detail: 'Instalments, UPI, cheque and DD payments, receipts and ledgers keep the defaulters list current.' }
  ]
};

export const principles = {
  eyebrow: 'How we build it',
  title: ['Three things we', 'don’t compromise on.'],
  items: [
    { n: '01', title: 'Built for Indian schools', text: 'Class and section, roll numbers, Aadhaar and APAAR, fee heads and instalments, UPI, cheque and DD, the academic session — the words your office already uses.' },
    { n: '02', title: 'Everyone, one school', text: 'The principal, office, teachers and accountant work from the same records, each in their own view. Nobody re-types what someone else entered.' },
    { n: '03', title: 'Your data stays yours', text: 'Every school gets its own separate database, and access inside the school depends on each person’s role, checked on the server.' }
  ]
};

/** Real releases, from the CRM's commit history. */
export const releases = {
  eyebrow: 'Built release by release',
  title: ['Shipping what schools', 'ask for.'],
  lede: 'SmartShala grows in small releases, shaped by the schools that use it. A few from the last two months:',
  items: [
    { when: 'Sep 2026', title: 'Pay by link, invoices accountants accept', text: 'Schools pay their subscription through a payment link and get GST invoices.' },
    { when: 'Sep 2026', title: 'Principal and teacher apps', text: 'The principal’s home mirrors the web dashboard; teachers punch in, ask for leave and see their day.' },
    { when: 'Sep 2026', title: 'Transport', text: 'Vehicles, routes with ordered stops, and who rides which bus.' },
    { when: 'Sep 2026', title: 'Who’s in today', text: 'The principal sees which teachers are in, on leave or not in — on the web and in the app.' },
    { when: 'Oct 2026', title: 'Shifts, breaks and payroll', text: 'Teachers punch in again after breaks, and pay is worked out from their shifts.' }
  ]
};
