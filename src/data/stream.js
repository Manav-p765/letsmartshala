/**
 * The hero stream: every module that flows along the S-curve into the
 * principal's phone, and the update it leaves in the phone's feed when it
 * lands. All of these are real CRM features (see docs/content.md); names
 * and numbers are SAMPLE DATA and the hero says so.
 *
 * `stat` (optional) nudges one of the three numbers at the top of the
 * phone, so the screen visibly fills up as the day flows in.
 */
export const stream = [
  { icon: 'staff', label: 'Staff attendance', note: 'Staff in today', detail: '38 of 41 punched in', time: '7:52 AM', stat: { staff: 38 } },
  { icon: 'attendance', label: 'Attendance', note: 'Attendance marked', detail: '24 of 24 classes', time: '9:05 AM', stat: { attendance: 94 } },
  { icon: 'students', label: 'Admissions', note: 'New admission', detail: 'Aarav S. · Class 7-B', time: '9:40 AM' },
  { icon: 'fees', label: 'Fees', note: 'Fee received', detail: '₹12,500 · UPI', time: '10:15 AM', stat: { fees: 12500 } },
  { icon: 'receipt', label: 'Receipts', note: 'Receipt R-2041', detail: 'PDF generated', time: '10:16 AM' },
  { icon: 'homework', label: 'Homework', note: 'Homework set', detail: 'Science · 7-B · due Fri', time: '11:20 AM' },
  { icon: 'exams', label: 'Exams', note: 'Marks entered', detail: 'Unit Test 2 · Maths', time: '12:30 PM' },
  { icon: 'fees', label: 'Collections', note: 'Fees collected', detail: '₹1,84,500 today', time: '1:10 PM', stat: { fees: 184500 } },
  { icon: 'leave', label: 'Leave', note: 'Leave requests', detail: '3 waiting for you', time: '1:45 PM' },
  { icon: 'transport', label: 'Transport', note: 'Route 4 updated', detail: '2 stops added', time: '2:30 PM' },
  { icon: 'announcements', label: 'Announcements', note: 'Announcement sent', detail: 'PTM on Saturday', time: '3:05 PM' },
  { icon: 'payroll', label: 'Payroll', note: 'Salary slips', detail: 'October · generated', time: '3:40 PM' },
  { icon: 'reports', label: 'Reports', note: 'Daily report', detail: 'Ready to read', time: '4:10 PM' }
];

