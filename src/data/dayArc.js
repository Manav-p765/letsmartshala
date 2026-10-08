/**
 * The hero's school day, as seen by each role.
 *
 * Every event is something the CRM really does (see the product brief:
 * staff punch-in, attendance marking, fee payments + receipt PDFs, homework,
 * marks entry, leave approvals, payroll, daily principal report).
 * The names and numbers are SAMPLE DATA — the hero labels them as such.
 *
 * `time` is 24h "HH:MM" and must sit inside DAY_START..DAY_END.
 * Layout rule: on desktop the cards ride the arc around the headline, so
 * times must avoid the arc's flanks beside it. Keep each time either
 * before 08:15 / after 15:45 (low on the arc, beside the buttons) or
 * between 09:45 and 14:15 (over the top, above the headline).
 * `tone` picks the CRM status colour for the card's chip.
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
      { time: '07:50', title: 'Staff in today', value: '38 of 41', chip: 'Live', tone: 'ok' },
      { time: '10:10', title: 'Attendance marked', value: '24 / 24 classes', chip: 'Done', tone: 'ok' },
      { time: '12:05', title: 'Fees collected today', value: '₹1,84,500', chip: '+12 payments', tone: 'info' },
      { time: '13:50', title: 'Leave requests', value: '3 waiting', chip: 'Approve', tone: 'warn' },
      { time: '16:05', title: 'Daily report', value: 'Ready to read', chip: 'PDF', tone: 'info' }
    ]
  },
  {
    id: 'teacher',
    label: 'Teacher',
    events: [
      { time: '07:45', title: 'Punched in', value: 'Shift 07:45 – 14:30', chip: 'On time', tone: 'ok' },
      { time: '09:50', title: 'Class 7-B attendance', value: '38 present · 2 absent', chip: 'Saved', tone: 'ok' },
      { time: '12:00', title: 'Homework set', value: 'Science · due Friday', chip: '7-B', tone: 'info' },
      { time: '14:00', title: 'Unit Test 2 marks', value: 'Mathematics · 40 students', chip: 'Entered', tone: 'ok' },
      { time: '15:55', title: 'Leave request', value: 'Sat, 18 Oct', chip: 'Approved', tone: 'ok' }
    ]
  },
  {
    id: 'accountant',
    label: 'Accountant',
    events: [
      { time: '08:05', title: 'Payment recorded', value: '₹12,500 · UPI', chip: 'Term 2', tone: 'ok' },
      { time: '10:20', title: 'Receipt R-2041', value: 'PDF generated', chip: 'Ready', tone: 'info' },
      { time: '12:10', title: 'Defaulters list', value: '23 students', chip: 'Review', tone: 'warn' },
      { time: '14:10', title: 'Transport fee', value: 'Route 4 added', chip: 'Adjusted', tone: 'info' },
      { time: '16:15', title: 'Collected today', value: '₹1,84,500', chip: 'Closed', tone: 'ok' }
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
