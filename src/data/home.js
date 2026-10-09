/**
 * Home page copy. Every claim here maps to something the CRM codebase
 * actually does (see docs/content.md). Things the code doesn't prove yet —
 * WhatsApp to parents, AI, parent app, library, GPS — are left out on purpose.
 */

export const desks = {
  eyebrow: 'One school, four desks',
  title: ['Everyone opens', 'the same school.'],
  lede: 'Each person signs in to their own view. Nobody re-types what someone else already entered.',
  // `preview` picks the little animated screen at the top of each card (Desks.jsx). Sample data.
  items: [
    {
      role: 'Principal',
      time: '07:50',
      preview: 'principal',
      line: 'Sees the whole school before the first bell.',
      points: ['Who is in, who is on leave', 'Attendance and fee risk', 'Daily report and analytics']
    },
    {
      role: 'Office admin',
      time: '08:30',
      preview: 'admin',
      line: 'Keeps records, classes and timetables in order.',
      points: ['Student records and bulk import', 'Classes, sections, subjects', 'Year-end rollover']
    },
    {
      role: 'Teacher',
      time: '09:50',
      preview: 'teacher',
      line: 'Gets through the paperwork between periods.',
      points: ['Attendance for their classes', 'Homework and marks', 'Timetable, leave, pay slips']
    },
    {
      role: 'Accountant',
      time: '10:20',
      preview: 'accountant',
      line: 'Closes the day with every rupee accounted for.',
      points: ['Fee structures and instalments', 'UPI, cheque or DD payments', 'Receipts, ledgers, defaulters']
    }
  ]
};


/**
 * `file` is what each step adds to the student's file on the left of the
 * section, so the record visibly builds up as you scroll. SAMPLE DATA.
 */
export const flow = {
  eyebrow: 'How it fits together',
  title: ['From admission', 'to fee receipt.'],
  lede: 'One student, followed through the system. Each step uses what the step before it already knows.',
  steps: [
    { who: 'Office admin', title: 'Add or import the student', text: 'Guardian details, Aadhaar and APAAR IDs, previous school, documents. Import a whole list at once.' },
    { who: 'Office admin', title: 'Place them in a class', text: 'Class and section, class teacher, subjects and timetable are already set up for that class.' },
    { who: 'Principal', title: 'Assign the fee structure', text: 'Fee heads and instalments for the class, plus a transport fee if the student takes the bus.' },
    { who: 'Accountant', title: 'Record the payment', text: 'UPI, cheque or DD, against the right instalment. Adjustments are kept on the ledger.' },
    { who: 'Accountant', title: 'Receipt and ledger, done', text: 'A receipt PDF is generated and the student’s ledger and the defaulters list update themselves.' }
  ],
  file: [
    { label: 'Admitted', rows: [['Guardian', 'Rakesh Sharma'], ['Aadhaar', 'XXXX XXXX 4821'], ['APAAR ID', 'Linked']] },
    { label: 'Class', rows: [['Class', '7-B · Roll 12'], ['Class teacher', 'Neha Verma']] },
    { label: 'Fees', rows: [['Term 2', '₹24,000 · 2 instalments'], ['Transport', 'Route 4 · ₹3,600']] },
    { label: 'Payment', rows: [['Paid', '₹12,500 · UPI']] },
    { label: 'Receipt', rows: [['Receipt', 'R-2041 · PDF'], ['Balance', '₹15,100']] }
  ]
};

export const india = {
  eyebrow: 'Built for Indian schools',
  title: 'Speaks the language of your office.',
  lede: 'The fields, documents and payment types your staff already use, not a foreign template.',
  terms: ['Aadhaar', 'APAAR ID', 'Class & section', 'Roll number', 'Admission number', 'Fee heads', 'Instalments', 'UPI', 'Cheque', 'Demand draft', 'Academic session', 'Year-end rollover', 'Class teacher', 'Guardian details', 'Transport fee']
};

export const security = {
  eyebrow: 'Your data',
  title: ['Your school’s data,', 'in its own database.'],
  lede: 'Student records are the most sensitive thing a school holds. SmartShala is built around that.',
  points: [
    { title: 'A separate database for each school', text: 'Your records are never stored in a shared table with another school’s.' },
    { title: 'Everyone sees only their part', text: 'Access is checked on the server for every request. Teachers see their own classes, and fee details are hidden from them.' },
    { title: 'A record of every change', text: 'Activity logs show who changed what, and student profiles keep their edit history.' }
  ]
};

export const apps = {
  eyebrow: 'On the phone too',
  title: ['Principal and', 'teacher apps.'],
  lede: 'The principal checks the school from anywhere. Teachers punch in, mark attendance and see their day without opening a laptop.',
  points: ['Principal home mirrors the web dashboard', 'Teachers: punch-in, breaks, timetable, homework, marks', 'Students, fees, exams and reports for the principal']
};

export const faq = [
  {
    q: 'Who is SmartShala for?',
    a: 'Schools in India that want admissions records, attendance, fees, exams, transport and staff in one system instead of registers, spreadsheets and separate apps.'
  },
  {
    q: 'Can we bring in our existing student data?',
    a: 'Yes. Student records can be imported in bulk, so you don’t have to type in every student by hand.'
  },
  {
    q: 'Is our data kept separate from other schools?',
    a: 'Yes. Every school gets its own database, and access inside the school is limited by role.'
  },
  {
    q: 'Can teachers see fee details?',
    a: 'No. Teachers see the students and classes they teach. Fee information is for the principal, admin and accountant.'
  },
  {
    q: 'Does it work on phones?',
    a: 'The web app works in a phone browser, and there are separate apps for principals and teachers.'
  },
  {
    q: 'How much does it cost?',
    a: 'It depends on the size of your school. Book a demo and we’ll share a quote that fits.'
  }
];
