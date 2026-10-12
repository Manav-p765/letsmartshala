/**
 * The About page story: where the school office's day breaks, and what
 * SmartShala does about each break. Every "after" maps to a real CRM
 * feature (docs/content.md). The release timeline is taken from the CRM's
 * own commit history (Sep–Oct 2026). The founding story (who started it,
 * when, why) is NOT here because we haven't been told it — see
 * docs/content.md, open questions.
 */
export const aboutMeta = {
  title: 'About',
  description: 'Why SmartShala exists: the registers, re-typing and waiting that slow down Indian school offices, and how one system fixes each of them.'
};

export const aboutHero = {
  eyebrow: 'About SmartShala',
  title: ['A school runs on', 'a thousand small records.'],
  lede: 'Admission forms, attendance registers, fee receipts, mark sheets, bus lists, salary sheets. We built SmartShala so the people who run a school spend their day on the school, not on the registers.',
  // The paper registers scattered around the hero.
  registers: [
    { name: 'Admission register', line: 'Aarav Sharma · 7-B', tilt: -7 },
    { name: 'Attendance register', line: 'P P A P P L P', tilt: 5 },
    { name: 'Fee receipt book', line: 'No. 2041 · ₹12,500', tilt: -4 },
    { name: 'Mark sheet', line: 'Maths 36 / 40', tilt: 6 },
    { name: 'Bus list', line: 'Route 4 · Sector 4', tilt: -5 },
    { name: 'Salary sheet', line: '24 / 25 days', tilt: 4 }
  ]
};

export const problem = {
  eyebrow: 'Where it starts',
  title: ['One new student.', 'Five registers.'],
  lede: 'When Aarav joins Class 7-B, his name is written again and again — by five different people, in five different places.',
  copies: [
    { who: 'Office', where: 'Admission register', note: 'written' },
    { who: 'Class teacher', where: 'Attendance register', note: 'copied' },
    { who: 'Accountant', where: 'Fee card', note: 'copied again' },
    { who: 'Transport', where: 'Bus list', note: 'and again' },
    { who: 'Subject teachers', where: 'Mark sheets', note: 'every exam' }
  ],
  kicker: 'Same child. Same spelling — hopefully. And when a roll number changes, five registers need fixing.'
};

/** The story: each "before" (on paper) and the "after" (in SmartShala). */
export const story = {
  eyebrow: 'What we set out to fix',
  title: ['Where the day broke,', 'and what we built.'],
  pairs: [
    {
      icon: 'students',
      before: { title: 'The same details, written five times', scrawl: 'Roll no. changed — fix in 5 places!' },
      after: { title: 'One student record every office reads', text: 'Added once, with guardian details, Aadhaar and APAAR IDs and documents. The class teacher, accountant, transport and exam teachers all work from it.' }
    },
    {
      icon: 'reports',
      before: { title: 'The principal waits for numbers', scrawl: 'Fees today? — will tell by evening' },
      after: { title: 'The day’s picture, before anyone asks', text: 'Staff in, classes marked, fees collected and leave waiting — on the principal’s dashboard and phone, plus a daily report.' }
    },
    {
      icon: 'fees',
      before: { title: 'Defaulters found at the end of term', scrawl: '23 pending?? since July' },
      after: { title: 'Defaulters visible from the first missed instalment', text: 'Fee heads and instalments per class, payments by UPI, cheque or DD, receipt PDFs, ledgers — and a defaulters list that is always current.' }
    },
    {
      icon: 'attendance',
      before: { title: 'Periods spent on registers', scrawl: 'Roll call: 10 min × 6 periods' },
      after: { title: 'Roll call and marks on the teacher app', text: 'Teachers mark attendance, set homework and enter marks for their own subjects — and see their own timetable and pay slips.' }
    },
    {
      icon: 'payroll',
      before: { title: 'Salaries worked out by hand', scrawl: 'Count the punch register again' },
      after: { title: 'Payroll from punch-ins and shifts', text: 'Staff punch in on the app; shifts and pay profiles turn attendance into salary slips that staff can see themselves.' }
    },
    {
      icon: 'timetable',
      before: { title: 'Last year in a cupboard', scrawl: 'Which almirah has 2024–25?' },
      after: { title: 'History that stays with the record', text: 'Every student profile keeps its edit history and activity logs show who changed what; the new session starts with a rollover, not a new register.' }
    }
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
