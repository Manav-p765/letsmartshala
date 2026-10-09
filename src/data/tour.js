/**
 * The modules tour: one stop per module, each with a sketch of that CRM
 * screen. Labels mirror the CRM's own UI copy where it exists ("Collection
 * Command Center", "Nudge Teachers", "Send Fee Reminder"). Every name and
 * number below is SAMPLE DATA for the illustration.
 */
export const tourHead = {
  eyebrow: 'Inside SmartShala',
  title: ['Every office in', 'the school, connected.']
};

export const tour = [
  {
    id: 'fees',
    icon: 'fees',
    name: 'Fees & receipts',
    line: 'Fee heads, instalments, ledgers, defaulters and receipt PDFs.',
    screen: {
      title: 'Collection Command Center',
      sub: 'Term 2 · 2026–27',
      kpis: [
        { label: 'Collected this term', value: 1842000, money: true },
        { label: 'Pending', value: 310500, money: true },
        { label: 'Defaulters', value: 23 }
      ],
      progress: 0.86,
      rows: [
        ['Aarav Sharma', '7-B', 'UPI', '₹12,500', 'R-2041'],
        ['Diya Mehta', '4-A', 'Cheque', '₹8,000', 'R-2040'],
        ['Kabir Rao', '9-C', 'DD', '₹15,200', 'R-2039'],
        ['Meera Thakur', '7-B', 'UPI', '₹12,500', 'R-2038'],
        ['Ishaan Gupta', '11-A', 'UPI', '₹21,000', 'R-2037']
      ],
      action: 'Send Fee Reminder'
    }
  },
  {
    id: 'attendance',
    icon: 'attendance',
    name: 'Attendance',
    line: 'Class roll call with present, absent, late and half-day.',
    screen: {
      title: 'Mark attendance',
      sub: 'Class 7-B · Thursday, 9 Oct',
      students: [
        ['Aarav Sharma', 'P'], ['Ananya Iyer', 'P'], ['Arjun Nair', 'A'], ['Diya Mehta', 'P'],
        ['Farhan Khan', 'L'], ['Ishaan Gupta', 'P'], ['Kavya Reddy', 'P'], ['Meera Thakur', 'H']
      ],
      summary: [['Present', 38], ['Absent', 2], ['Late', 1]],
      pending: ['8-A · Period 1', '10-B · Period 1'],
      action: 'Nudge Teachers'
    }
  },
  {
    id: 'exams',
    icon: 'exams',
    name: 'Exams & report cards',
    line: 'Terms, subjects, marks entry, grading and report-card PDFs.',
    screen: {
      title: 'Unit Test 2 · Marks',
      sub: 'Class 7-B · Max 40',
      subjects: ['Maths', 'Science', 'English', 'Hindi'],
      rows: [
        ['Aarav Sharma', [36, 33, 38, 31]],
        ['Ananya Iyer', [39, 35, 34, 37]],
        ['Diya Mehta', [28, 31, 36, 33]],
        ['Ishaan Gupta', [33, 38, 29, 30]]
      ],
      action: 'Generate report cards'
    }
  },
  {
    id: 'students',
    icon: 'students',
    name: 'Student records',
    line: 'Guardians, Aadhaar, APAAR, documents and full edit history.',
    screen: {
      name: 'Aarav Sharma',
      meta: 'Class 7-B · Roll 12 · Adm. no. 2019/0412',
      fields: [
        ['Guardian', 'Rakesh Sharma (Father)'],
        ['Aadhaar', 'XXXX XXXX 4821'],
        ['APAAR ID', 'Linked'],
        ['Transport', 'Route 4 · Sector 4']
      ],
      tabs: ['Overview', 'Attendance', 'Academics', 'Fees', 'Documents', 'Behaviour'],
      stats: [['Attendance', '94%'], ['Fee balance', '₹0'], ['Last exam', 'A1']]
    }
  },
  {
    id: 'transport',
    icon: 'transport',
    name: 'Transport',
    line: 'Vehicles, routes with ordered stops, and who rides which bus.',
    screen: {
      title: 'Route 4',
      sub: 'Bus RJ-14 PB 2041 · 42 seats',
      stops: [
        ['Depot', '6:50 AM', 0],
        ['Sector 4', '7:05 AM', 11],
        ['Shastri Nagar', '7:15 AM', 9],
        ['Main Gate Colony', '7:25 AM', 14],
        ['School', '7:40 AM', 0]
      ],
      assigned: 34
    }
  },
  {
    id: 'payroll',
    icon: 'payroll',
    name: 'Staff & payroll',
    line: 'Punch-in, shifts, attendance-based salary and pay slips.',
    screen: {
      title: 'Payroll · October',
      sub: 'Calculated from staff attendance',
      rows: [
        ['Neha Verma', 'Teacher', '24 / 25', 'Generated'],
        ['Suresh Patel', 'Teacher', '25 / 25', 'Generated'],
        ['Pooja Singh', 'Accountant', '23 / 25', 'Generated'],
        ['Ravi Kumar', 'Driver', '25 / 25', 'Pending']
      ],
      action: 'Generate slips'
    }
  }
];

export const tourMore = ['Homework', 'Timetable', 'Calendar & holidays', 'Leave', 'Announcements', 'Reports & dashboards', 'Activity logs'];
