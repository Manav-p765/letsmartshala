/**
 * Copy for every page except home. Every product claim maps to something
 * the CRM codebase does (docs/content.md). Things it doesn't prove yet —
 * WhatsApp messages to parents, the AI assistant, a parent app, library,
 * inventory, live GPS, multi-branch, specific boards, app-store listings —
 * are left out on purpose.
 */

export const demo = {
  meta: 'Book a free SmartShala demo. See admissions, attendance, fees, exams, transport and payroll for your school in one CRM.',
  eyebrow: 'Free demo · For Indian schools',
  title: ['See your school', 'run on one system.'],
  accent: 'one system.',
  lede: 'Tell us a little about your school and we’ll call to set up a demo built around how your office works today.',
  points: [
    { icon: 'fees', text: 'Fees, receipts and defaulters, without the registers' },
    { icon: 'attendance', text: 'Attendance, exams and homework for every class' },
    { icon: 'staff', text: 'Principal and teacher apps, plus the web app' }
  ],
  next: [
    { title: 'We call you', text: 'Someone from SmartShala calls the number you gave to fix a time that suits you.' },
    { title: 'A demo for your school', text: 'We walk through the modules your school needs, using the way your office works today.' },
    { title: 'Your questions answered', text: 'Setup, importing your student data, and pricing for your school’s size.' }
  ],
  covers: [
    { icon: 'students', name: 'Admissions & student records' },
    { icon: 'attendance', name: 'Attendance' },
    { icon: 'fees', name: 'Fees & receipts' },
    { icon: 'exams', name: 'Exams & report cards' },
    { icon: 'transport', name: 'Transport' },
    { icon: 'payroll', name: 'Staff & payroll' },
    { icon: 'reports', name: 'Reports & dashboards' }
  ]
};

export const thanks = {
  meta: 'Thanks for booking a SmartShala demo.',
  title: 'Thank you',
  lede: 'Your demo request is in. We’ll call you to fix a time.',
  meanwhile: [
    { icon: 'timetable', title: 'Keep your phone handy', text: 'We call from our sales number, the one below.' },
    { icon: 'students', title: 'Have your numbers ready', text: 'Roughly how many students and staff — it helps us show the right setup.' },
    { icon: 'announcements', title: 'Bring your questions', text: 'Fee structures, transport, report cards — anything your office deals with.' }
  ]
};

export const features = {
  meta: 'Every SmartShala module: admissions, student records, attendance, fees, exams, homework, timetable, transport, payroll, communication and reports.',
  eyebrow: 'Features',
  title: ['Everything the office,', 'staff room and principal use.'],
  lede: 'One system, shared students, classes and staff. Start with what you need; every module reads from the same records.',
  groups: [
    {
      name: 'Students & admissions',
      icon: 'students',
      text: 'One record per student, from enquiry to leaving.',
      items: ['Student profiles with guardian, father and mother details', 'Aadhaar and APAAR IDs, previous school, documents', 'Bulk import of existing student lists', 'Behaviour notes, with restricted counsellor notes', 'Full edit history on every profile', 'Activate and deactivate students']
    },
    {
      name: 'Classes & timetable',
      icon: 'timetable',
      text: 'Classes, sections, subjects and who teaches what.',
      items: ['Classes with sections, stream and medium of instruction', 'Class teacher and maximum strength', 'Subjects and teacher period assignments', 'Weekly timetable with your period times', 'Academic years and year-end rollover']
    },
    {
      name: 'Attendance',
      icon: 'attendance',
      text: 'Roll call in a few taps, reports without counting.',
      items: ['Present, absent, late and half-day', 'Daily and monthly reports by class and student', 'Holidays on the school calendar', 'See which classes haven’t been marked, and nudge teachers', 'Staff punch-in, breaks and punch-out']
    },
    {
      name: 'Fees & receipts',
      icon: 'fees',
      text: 'Every rupee recorded, receipted and reconciled.',
      items: ['Fee structures with heads and instalments', 'Assign fees by class or by student', 'Payments by UPI, cheque or DD', 'Adjustments kept on the student’s ledger', 'Receipt PDFs for every payment', 'Defaulters list and fee reminders', 'Transport fee added for bus students']
    },
    {
      name: 'Exams & report cards',
      icon: 'exams',
      text: 'Marks in once, report cards out.',
      items: ['Exams with terms, subjects, maximum and passing marks', 'Teachers enter marks for the subjects they teach', 'Grading and results', 'Report-card PDFs', 'Exam, subject-wise and student performance reports']
    },
    {
      name: 'Homework',
      icon: 'homework',
      text: 'Set, track and check, by class and subject.',
      items: ['Homework by class and subject with due dates', 'Maximum marks where needed', 'Submission tracking and status', 'Shows on each student’s profile']
    },
    {
      name: 'Transport',
      icon: 'transport',
      text: 'Buses, routes and who rides them.',
      items: ['Vehicles and routes', 'Ordered stops on each route', 'Assign students to routes and stops', 'Transport fee on the student’s fees', 'Transport report']
    },
    {
      name: 'Staff, leave & payroll',
      icon: 'payroll',
      text: 'From punch-in to pay slip.',
      items: ['Shifts and pay profiles', 'Salary calculated from staff attendance', 'Pay slips staff can see themselves', 'Leave requests with attachments and approvals']
    },
    {
      name: 'Communication & calendar',
      icon: 'announcements',
      text: 'The school’s notices, in one place.',
      items: ['Announcements to everyone, staff, teachers or parents', 'Priority and read receipts', 'Message templates and communication logs', 'School calendar with events and holidays']
    },
    {
      name: 'Reports & dashboards',
      icon: 'reports',
      text: 'The day’s picture, without asking for it.',
      items: ['Role-based dashboards', 'Daily principal report', 'Attendance and fee risk insights', 'Class, exam, teacher and transport reports', 'Activity logs of who changed what']
    }
  ]
};

export const solutions = {
  meta: 'How SmartShala works for principals, office admins, teachers and accountants in Indian schools.',
  eyebrow: 'Solutions',
  title: ['Built around the people', 'who run a school.'],
  lede: 'Everyone signs in to their own view of the same school. Here’s what each desk gets.',
  roles: [
    {
      id: 'principal',
      name: 'For principals',
      icon: 'reports',
      line: 'See the whole school before the first bell, on the web or the principal app.',
      points: ['Who is in today, who is on leave', 'Attendance and fee risk at a glance', 'Leave approvals and announcements', 'Daily report and school-wide analytics', 'Billing and settings for your school'],
      quote: 'Morning: staff in, classes marked. Afternoon: fees collected, leave approved. Evening: the daily report.'
    },
    {
      id: 'admin',
      name: 'For office admins',
      icon: 'students',
      line: 'Keep student records, classes and timetables in order without the registers.',
      points: ['Add or bulk-import students', 'Classes, sections, subjects, class teachers', 'Period times and timetables', 'Documents, Aadhaar and APAAR IDs', 'Year-end rollover to the new session'],
      quote: 'Admission today, in the right class by lunch, with fees assigned before the parent leaves.'
    },
    {
      id: 'teacher',
      name: 'For teachers',
      icon: 'homework',
      line: 'Get through the paperwork between periods, on the teacher app.',
      points: ['Attendance for their own classes', 'Homework and marks for their subjects', 'Their own timetable', 'Punch-in, breaks and leave requests', 'Their own pay slips'],
      quote: 'Roll call in Period 1, homework set by lunch, marks entered before the bell.'
    },
    {
      id: 'accountant',
      name: 'For accountants',
      icon: 'fees',
      line: 'Close the day with every rupee recorded and receipted.',
      points: ['Fee structures, instalments, adjustments', 'Payments by UPI, cheque or DD', 'Receipt PDFs and student ledgers', 'Defaulters list and reminders', 'Transport fees on the same ledger'],
      quote: 'Payment in, receipt out, ledger updated, defaulters list shorter.'
    }
  ]
};

export const pricing = {
  meta: 'SmartShala pricing depends on your school’s size. Book a demo for a quote.',
  eyebrow: 'Pricing',
  title: ['Priced for your', 'school’s size.'],
  lede: 'Plans depend on how many students and staff your school has. Tell us about your school and we’ll share a quote — no obligation.',
  // Plan names and prices are not public yet (owner: "will give later").
  included: [
    'Every module in your plan, on the web app',
    'Principal and teacher apps',
    'Your own separate database',
    'Bulk import of your existing student lists',
    'GST invoices for your subscription',
    'Pay online by payment link'
  ],
  factors: [
    { icon: 'students', title: 'Number of students', text: 'Plans are sized by the students you have on roll.' },
    { icon: 'staff', title: 'Number of staff', text: 'Teachers, office staff and everyone who signs in.' },
    { icon: 'reports', title: 'Modules you need', text: 'Start with what your office uses today.' }
  ]
};

export const about = {
  meta: 'SmartShala is a school management CRM built for Indian schools, by Hybrid Monks LLP.',
  eyebrow: 'About',
  title: ['A school runs on', 'a thousand small records.'],
  lede: 'Admissions forms, attendance registers, fee receipts, mark sheets, bus lists, salary sheets. SmartShala puts them in one system, so the people who run a school spend their day on the school.',
  beliefs: [
    { title: 'Built for Indian schools', text: 'Class and section, roll numbers, Aadhaar and APAAR, fee heads and instalments, UPI, cheque and DD, the academic session. The words your office already uses.' },
    { title: 'Everyone, one school', text: 'The principal, office, teachers and accountant work from the same records, each in their own view. Nobody re-types what someone else entered.' },
    { title: 'Your data stays yours', text: 'Every school gets its own database, and access inside the school depends on each person’s role.' }
  ],
  company: 'SmartShala is a product of Hybrid Monks LLP.'
};

export const contact = {
  meta: 'Contact SmartShala: call or WhatsApp +91 78630 41196, email support@letssmartshala.com, or book a demo.',
  eyebrow: 'Contact',
  title: ['Talk to', 'SmartShala.'],
  lede: 'Questions about the product, a demo, or pricing for your school — call, WhatsApp or email us, or use the form.'
};

export const securityPage = {
  meta: 'How SmartShala keeps school data separate, role-restricted and logged.',
  eyebrow: 'Security & data',
  title: ['Your school’s data,', 'in its own database.'],
  lede: 'Student records are the most sensitive thing a school holds. This is how SmartShala is built around that.',
  points: [
    { icon: 'students', title: 'A separate database for each school', text: 'Every school gets its own database. Your records are never stored in a shared table with another school’s.' },
    { icon: 'staff', title: 'Access by role, checked on the server', text: 'Principal, admin, teacher, accountant and parent each see only their part. Every request is checked on the server, not just hidden in the app. Teachers see their own classes, and fee details are hidden from them.' },
    { icon: 'reports', title: 'A record of every change', text: 'Activity logs show who changed what and when, and student profiles keep their full edit history.' },
    { icon: 'timetable', title: 'Secure sign-in', text: 'Sessions use short-lived access tokens with secure, http-only cookies, and each sign-in is tied to its own school.' },
    { icon: 'receipt', title: 'Payments through Razorpay', text: 'Subscription payments go through Razorpay’s checkout; SmartShala doesn’t store card details.' },
    { icon: 'leave', title: 'Your data, on request', text: 'Need an export or want your school’s data deleted? Ask us — the principal can also request deletion from settings.' }
  ],
  // Hosting region, backup schedule and certifications are not confirmed in code → not stated.
  note: 'Questions about where data is hosted, backups or compliance for your school? Ask us and we’ll answer specifically.'
};
