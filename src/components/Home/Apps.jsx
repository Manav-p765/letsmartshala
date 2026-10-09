import SectionHead from '../ui/SectionHead.jsx';
import { apps } from '../../data/home.js';
import './Apps.css';

/**
 * Two phones built in HTML — the principal's home and the teacher's day —
 * leaning against each other. Sample values; labelled below.
 */
const periods = [
  ['P1', '7-B', 'Mathematics'],
  ['P2', '8-A', 'Mathematics'],
  ['P3', '—', 'Free period'],
  ['P4', '7-B', 'Mathematics'],
  ['P5', '6-C', 'Mathematics']
];

export default function Apps() {
  return (
    <section className="section apps" data-theme="mist" aria-labelledby="apps-title">
      <div className="container apps__grid">
        <div>
          <SectionHead id="apps-title" eyebrow={apps.eyebrow} title={apps.title} lede={apps.lede} />
          <ul className="apps__points" data-animate="stagger">
            {apps.points.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>

        <div className="phones" aria-hidden="true" data-animate="fade-up">
          <div className="phone phone--back">
            <div className="phone__screen">
              <p className="phone__hello">Teacher · Today</p>
              <div className="phone__punch">
                <span>Punched in</span>
                <strong>07:45 AM</strong>
              </div>
              <p className="phone__sub">Timetable</p>
              {periods.map(([p, c, s]) => (
                <div className="phone__period" key={p}><b>{p}</b><span>{s}</span><i>{c}</i></div>
              ))}
              <p className="phone__sub">Due this week</p>
              <div className="phone__row"><span>Homework · 7-B</span><b>Fri</b></div>
              <div className="phone__row"><span>Unit Test 2 marks</span><b className="warn">Mon</b></div>
            </div>
          </div>
          <div className="phone phone--front">
            <div className="phone__screen">
              <p className="phone__hello">Good morning, Principal</p>
              <div className="phone__stats">
                <div><span>Staff in</span><strong>38/41</strong></div>
                <div><span>Attendance</span><strong>94%</strong></div>
                <div className="wide"><span>Fees today</span><strong>₹1,84,500</strong></div>
              </div>
              <p className="phone__sub">Needs you</p>
              <div className="phone__row"><span>Leave requests</span><b className="warn">3</b></div>
              <div className="phone__row"><span>Classes not marked</span><b className="ok">0</b></div>
              <div className="phone__row"><span>Daily report</span><b>Ready</b></div>
              <div className="phone__row"><span>Fee defaulters</span><b className="warn">23</b></div>
              <p className="phone__sub">Today</p>
              <div className="phone__row"><span>Staff on leave</span><b>2</b></div>
              <div className="phone__row"><span>Homework set</span><b className="ok">14</b></div>
            </div>
          </div>
        </div>
      </div>
      <p className="container apps__note">App screens shown with sample data.</p>
    </section>
  );
}
