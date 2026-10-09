/**
 * Line icons for the CRM's modules — one stroke weight, one 24px grid,
 * drawn here so the stream and the cards share one visual language.
 */
const paths = {
  attendance: <><rect x="4" y="4" width="16" height="17" rx="2.5" /><path d="M8 2.5v3M16 2.5v3M4 9h16M8.5 14.5l2 2 4-4.5" /></>,
  fees: <><rect x="3" y="6" width="18" height="12" rx="2.5" /><path d="M9.5 9.5h5M9.5 12h5M11 9.5c1.7 0 2.5 1 2.5 2.5S11 14.8 10 15l3.5 2" /></>,
  exams: <><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4M9 12h7M9 15.5h7M9 8.5h3" /></>,
  students: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5" /></>,
  transport: <><rect x="4" y="4" width="16" height="13" rx="3" /><path d="M4 11h16M7.5 20v-3M16.5 20v-3" /><circle cx="8" cy="14" r=".8" /><circle cx="16" cy="14" r=".8" /></>,
  payroll: <><rect x="3" y="5" width="18" height="14" rx="2.5" /><circle cx="12" cy="12" r="2.8" /><path d="M6.5 9v6M17.5 9v6" /></>,
  homework: <><path d="M5 4.5h9.5a3 3 0 0 1 3 3V20H8a3 3 0 0 1-3-3z" /><path d="M5 17a3 3 0 0 1 3-3h9.5M9 8h5" /></>,
  timetable: <><circle cx="12" cy="12" r="8.5" /><path d="M12 7v5l3.5 2" /></>,
  leave: <><path d="M4 20c6-1 11-6 13-14l3-2-1 4c-2 8-7 11.5-15 12z" /><path d="M8 16c2-3 4.5-5 7.5-6.5" /></>,
  announcements: <><path d="M4 10v4l3 .5L17 19V5L7 9.5z" /><path d="M7.5 14.5 9 20h2.5M20 10v4" /></>,
  reports: <><path d="M4 20h16" /><rect x="5.5" y="12" width="3" height="6" rx="1" /><rect x="10.5" y="7" width="3" height="11" rx="1" /><rect x="15.5" y="9.5" width="3" height="8.5" rx="1" /></>,
  calendar: <><rect x="4" y="5" width="16" height="15" rx="2.5" /><path d="M8 3v4M16 3v4M4 10h16" /><circle cx="15.5" cy="15" r="1.4" /></>,
  staff: <><circle cx="9" cy="8.5" r="3" /><circle cx="16.5" cy="9.5" r="2.4" /><path d="M3.5 19c.6-3 2.8-4.8 5.5-4.8s4.9 1.8 5.5 4.8M15 14.3c2.6-.3 4.8 1.2 5.5 4.2" /></>,
  receipt: <><path d="M6 3h12v18l-2-1.5-2 1.5-2-1.5-2 1.5-2-1.5L6 21z" /><path d="M9 8h6M9 11.5h6M9 15h3.5" /></>
};

export default function ModuleIcon({ name, className = 'micon' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
