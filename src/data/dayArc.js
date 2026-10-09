/**
 * The hero's school day, as seen by each role.
 *
 * Every event is something the CRM really does (see the product brief:
 * staff punch-in, attendance marking, fee payments + receipt PDFs, homework,
 * marks entry, leave approvals, payroll, daily principal report).
 * The names and numbers are SAMPLE DATA — the hero labels them as such.
 *
 * `time` is 24h "HH:MM" and must sit inside DAY_START..DAY_END.
 * Layout: on desktop the cards ride the arc around the headline. A card
 * whose spot would cover the headline is nudged outward (arcGeometry.js);
 * one that still can't fit is left off the arc, so keep times spread out.
 * `tone` picks the CRM status colour for the card's chip; `icon` is a ModuleIcon name.
 */
export const DAY_START = '07:30';
export const DAY_END = '16:30';

// Hour ticks drawn along the arc.
export const TICKS = ['08:00', '10:00', '12:00', '14:00', '16:00'];

export const roles = [
  {
    id: 'principal',
    label: 'Principal',
    events: [
      { time: '07:50', icon: 'staff', title: 'Staff in today', value: '38 of 41', chip: 'Live', tone: 'ok' },
      { time: '08:40', icon: 'students', title: 'New admission', value: 'Aarav S. · 7-B', chip: 'Added', tone: 'info' },
      { time: '10:10', icon: 'attendance', title: 'Attendance marked', value: '24 / 24 classes', chip: 'Done', tone: 'ok' },
      { time: '12:05', icon: 'fees', title: 'Fees collected today', value: '₹1,84,500', chip: '+12 payments', tone: 'info' },
      { time: '13:50', icon: 'leave', title: 'Leave requests', value: '3 waiting', chip: 'Approve', tone: 'warn' },
      { time: '15:10', icon: 'announcements', title: 'Announcement', value: 'PTM on Saturday', chip: 'Sent', tone: 'ok' },
      { time: '16:05', icon: 'reports', title: 'Daily report', value: 'Ready to read', chip: 'PDF', tone: 'info' }
    ]
  },
  {
    id: 'teacher',
    label: 'Teacher',
    events: [
      { time: '07:45', icon: 'timetable', title: 'Punched in', value: 'Shift 07:45 – 14:30', chip: 'On time', tone: 'ok' },
      { time: '08:35', icon: 'timetable', title: 'Today’s timetable', value: '5 periods · 2 free', chip: 'P1 7-B', tone: 'info' },
      { time: '09:50', icon: 'attendance', title: 'Class 7-B attendance', value: '38 present · 2 absent', chip: 'Saved', tone: 'ok' },
      { time: '12:00', icon: 'homework', title: 'Homework set', value: 'Science · due Friday', chip: '7-B', tone: 'info' },
      { time: '14:00', icon: 'exams', title: 'Unit Test 2 marks', value: 'Mathematics · 40 students', chip: 'Entered', tone: 'ok' },
      { time: '15:05', icon: 'payroll', title: 'Salary slip', value: 'October · ready', chip: 'View', tone: 'info' },
      { time: '15:55', icon: 'leave', title: 'Leave request', value: 'Sat, 18 Oct', chip: 'Approved', tone: 'ok' }
    ]
  },
  {
    id: 'accountant',
    label: 'Accountant',
    events: [
      { time: '08:05', icon: 'fees', title: 'Payment recorded', value: '₹12,500 · UPI', chip: 'Term 2', tone: 'ok' },
      { time: '08:50', icon: 'fees', title: 'Cheque recorded', value: '₹8,000 · Class 4-A', chip: 'Cheque', tone: 'info' },
      { time: '10:20', icon: 'receipt', title: 'Receipt R-2041', value: 'PDF generated', chip: 'Ready', tone: 'info' },
      { time: '12:10', icon: 'students', title: 'Defaulters list', value: '23 students', chip: 'Review', tone: 'warn' },
      { time: '14:10', icon: 'transport', title: 'Transport fee', value: 'Route 4 added', chip: 'Adjusted', tone: 'info' },
      { time: '15:15', icon: 'payroll', title: 'Payroll run', value: '41 staff · October', chip: 'Done', tone: 'ok' },
      { time: '16:15', icon: 'fees', title: 'Collected today', value: '₹1,84,500', chip: 'Closed', tone: 'ok' }
    ]
  }
];

/** "HH:MM" → fraction of the school day, 0 at DAY_START, 1 at DAY_END. */
export function dayFraction(time) {
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  return (toMin(time) - toMin(DAY_START)) / (toMin(DAY_END) - toMin(DAY_START));
}

/** Fraction of the day → "9:05 AM" style clock text. */
export function clockAt(f) {
  const [h0, m0] = DAY_START.split(':').map(Number);
  const [h1, m1] = DAY_END.split(':').map(Number);
  const start = h0 * 60 + m0;
  const mins = Math.round(start + f * (h1 * 60 + m1 - start));
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
}
