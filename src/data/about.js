/**
 * The About page: a 3D story in six chapters (components/About3D), then
 * principles and real releases. Every claim maps to a real CRM feature
 * (docs/content.md); the release list comes from the CRM's own commit
 * history (Sep–Oct 2026). The founding story (who, when, why) is NOT here
 * because we haven't been told it — see docs/content.md, open questions.
 */
export const aboutMeta = {
  title: 'About',
  description: 'Why SmartShala exists: the registers, re-typing and waiting that slow down Indian school offices, and how one system fixes them.'
};

/** One entry per 3D chapter; `scene` names what the 3D stage shows. */
export const chapters = [
  {
    scene: 'paper',
    eyebrow: 'About SmartShala',
    title: ['A school runs on', 'a thousand small records.'],
    text: 'Admission registers, attendance registers, fee receipt books, mark sheets, bus lists. Every office keeps its own — on paper, or in a spreadsheet only one person understands.',
    hint: 'Scroll to see what happens to them'
  },
  {
    scene: 'copies',
    eyebrow: 'Where it starts',
    title: ['One new student.', 'Five registers.'],
    text: 'When Aarav joins Class 7-B, the office writes his name in the admission register. Then the class teacher copies it. Then the accountant. Then transport. Then every exam’s mark sheet.'
  },
  {
    scene: 'break',
    eyebrow: 'Where the day breaks',
    title: ['Five copies drift', 'five different ways.'],
    points: [
      'A roll number changes in one register, not the other four.',
      'The principal asks for today’s fees — and waits till evening.',
      'Defaulters are found at the end of term, not the first missed instalment.'
    ]
  },
  {
    scene: 'one',
    eyebrow: 'What we built',
    title: ['So we put it all', 'in one place.'],
    text: 'SmartShala keeps one record for every student — guardian details, Aadhaar and APAAR IDs, class, fees, attendance, marks — entered once, and read by every office that needs it.'
  },
  {
    scene: 'connect',
    eyebrow: 'Everyone, one school',
    title: ['Every desk works from', 'the same numbers.'],
    points: [
      'The principal sees staff in, classes marked and fees collected — live.',
      'Teachers mark attendance and enter marks on their app.',
      'The accountant records UPI, cheque or DD payments; receipts and ledgers update.',
      'The office adds and imports students once.'
    ]
  },
  {
    scene: 'yours',
    eyebrow: 'Your data stays yours',
    title: ['Your school, in', 'its own database.'],
    text: 'Every school on SmartShala gets its own separate database. Inside the school, each person sees only their part — checked on the server for every request — and every change is logged.'
  }
];

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
