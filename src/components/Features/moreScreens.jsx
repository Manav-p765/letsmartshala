/**
 * Screens for the modules the home tour doesn't show: timetable, homework,
 * announcements and reports. Same `scr__*` vocabulary as Tour.jsx, so all
 * ten feel like one app. Sample data throughout.
 */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const PERIODS = [
  ['Maths', 'English', 'Science', 'Hindi', 'Maths'],
  ['Science', 'Maths', 'Social', 'Maths', 'English'],
  ['Hindi', 'Science', 'Maths', 'English', 'Science'],
  ['English', 'Social', 'English', 'Science', 'Art'],
  ['Social', 'Hindi', 'Games', 'Social', 'Hindi']
];

export function TimetableScreen() {
  return (
    <div className="xs-tt">
      <span />
      {DAYS.map((d) => <b key={d}>{d}</b>)}
      {PERIODS.map((row, p) => (
        <div className="xs-tt__row" key={p} style={{ '--r': p }}>
          <i>P{p + 1}</i>
          {row.map((s, d) => <span key={d} className={s === 'Maths' ? 'is-hi' : ''}>{s}</span>)}
        </div>
      ))}
    </div>
  );
}

export function HomeworkScreen() {
  const items = [
    ['Science', 'Chapter 6 — Light: questions 1–10', 'Fri', 32, 40],
    ['Maths', 'Exercise 4.2, all sums', 'Thu', 38, 40],
    ['English', 'Essay: My favourite festival', 'Mon', 12, 40]
  ];
  return (
    <div className="xs-hw">
      {items.map(([sub, task, due, done, all], i) => (
        <div className="xs-hw__item" key={task} style={{ '--r': i }}>
          <div className="xs-hw__top"><span className="tag">{sub}</span><span>Due {due}</span></div>
          <strong>{task}</strong>
          <div className="xs-hw__bar"><i style={{ '--p': done / all }} /></div>
          <span className="xs-hw__count">{done} of {all} submitted</span>
        </div>
      ))}
    </div>
  );
}

export function AnnounceScreen() {
  return (
    <div className="xs-an">
      <div className="xs-an__card" style={{ '--r': 0 }}>
        <div className="xs-an__top"><span className="tag tag--warn">High priority</span><span>To: Parents · All classes</span></div>
        <strong>Parent–teacher meeting on Saturday</strong>
        <p>Meetings run 9:00 AM to 12:30 PM in each class. Please bring the report card.</p>
        <div className="xs-an__reads"><i style={{ '--p': 0.78 }} /><span>78% read</span></div>
      </div>
      <div className="xs-an__card is-small" style={{ '--r': 1 }}>
        <div className="xs-an__top"><span className="tag">Staff</span><span>Yesterday</span></div>
        <strong>Unit Test 2 marks due by Monday</strong>
      </div>
      <div className="xs-an__card is-small" style={{ '--r': 2 }}>
        <div className="xs-an__top"><span className="tag">Calendar</span><span>Holiday</span></div>
        <strong>School closed on 20 Oct for Diwali</strong>
      </div>
    </div>
  );
}

export function ReportsScreen() {
  const bars = [['6-A', 0.92], ['6-B', 0.88], ['7-A', 0.95], ['7-B', 0.9], ['8-A', 0.81], ['8-B', 0.86], ['9-A', 0.93]];
  return (
    <div className="xs-rp">
      <div className="scr__kpis" style={{ '--r': 0 }}>
        <div className="scr__kpi"><span>Attendance today</span><strong>94%</strong></div>
        <div className="scr__kpi"><span>Fee collection</span><strong>86%</strong></div>
        <div className="scr__kpi"><span>At-risk students</span><strong>7</strong></div>
      </div>
      <div className="xs-rp__chart" style={{ '--r': 1 }}>
        <span className="scr__label">Attendance by class · this week</span>
        <div className="xs-rp__bars">
          {bars.map(([c, v], i) => (
            <div key={c}><i style={{ '--p': v, '--i': i }} /><span>{c}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const moreScreens = {
  timetable: { title: 'Class 7-B · Timetable', sub: 'Week of 6 Oct · 5 periods shown', Screen: TimetableScreen },
  homework: { title: 'Homework · 7-B', sub: 'This week', Screen: HomeworkScreen },
  comms: { title: 'Announcements', sub: 'Sent and scheduled', Screen: AnnounceScreen },
  reports: { title: 'Principal dashboard', sub: 'Thursday, 9 Oct', Screen: ReportsScreen }
};
