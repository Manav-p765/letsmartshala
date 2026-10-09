import SectionHead from '../ui/SectionHead.jsx';
import { modules } from '../../data/home.js';
import './Modules.css';

/**
 * Bento of the six biggest modules. Each tile carries a small, honest
 * sketch of that screen in the CRM (built in HTML, sample values), so the
 * grid reads as "the product" rather than a wall of icons.
 */
const visuals = {
  fees: (
    <div className="mv mv-fees">
      <div className="mv-fees__head">
        <span>Term 2 · Class 7-B</span>
        <strong>₹4,18,000</strong>
      </div>
      <div className="mv-fees__bar"><span style={{ '--p': 0.72 }} /></div>
      <ul>
        <li><span>Aarav S.</span><span>UPI</span><b className="ok">Paid</b></li>
        <li><span>Diya M.</span><span>Cheque</span><b className="ok">Paid</b></li>
        <li><span>Kabir R.</span><span>Instalment 2</span><b className="warn">Due</b></li>
        <li><span>Meera T.</span><span>DD</span><b className="ok">Paid</b></li>
      </ul>
    </div>
  ),
  attendance: (
    <div className="mv mv-att">
      {['P', 'P', 'A', 'P', 'L', 'P', 'P', 'P', 'H', 'P', 'P', 'A', 'P', 'P', 'P', 'P'].map((s, i) => (
        <span key={i} className={`mv-att__cell is-${s}`}>{s}</span>
      ))}
    </div>
  ),
  exams: (
    <div className="mv mv-exams">
      {[['Maths', 0.86], ['Science', 0.74], ['English', 0.9], ['Hindi', 0.68]].map(([s, v]) => (
        <div key={s} className="mv-exams__row">
          <span>{s}</span>
          <i style={{ '--p': v }} />
        </div>
      ))}
    </div>
  ),
  students: (
    <div className="mv mv-student">
      <span className="mv-student__avatar">AS</span>
      <div>
        <strong>Aarav Sharma</strong>
        <span>7-B · Roll 12 · APAAR linked</span>
      </div>
    </div>
  ),
  transport: (
    <div className="mv mv-route">
      {['Depot', 'Sector 4', 'Main Gate', 'School'].map((s) => (
        <span key={s} className="mv-route__stop">{s}</span>
      ))}
    </div>
  ),
  payroll: (
    <div className="mv mv-pay">
      <div><span>Present</span><strong>24 days</strong></div>
      <div><span>Shift</span><strong>07:45–14:30</strong></div>
      <div><span>Slip</span><strong className="ok">Generated</strong></div>
    </div>
  )
};

export default function Modules() {
  return (
    <section className="section modules" data-theme="mist" aria-labelledby="modules-title">
      <div className="container">
        <SectionHead id="modules-title" eyebrow={modules.eyebrow} title={modules.title} lede={modules.lede} />
        <div className="bento" data-animate="stagger">
          {modules.tiles.map((t) => (
            <article key={t.id} className={`tile tile--${t.id}`}>
              <div className="tile__visual" aria-hidden="true">{visuals[t.id]}</div>
              <h3 className="tile__name">{t.name}</h3>
              <p className="tile__text">{t.text}</p>
            </article>
          ))}
        </div>
        <div className="modules__more" data-animate="fade-up">
          <span className="label">Also included</span>
          <ul>
            {modules.more.map((m) => <li key={m}>{m}</li>)}
          </ul>
        </div>
        <p className="modules__note">Names and figures in these previews are sample data.</p>
      </div>
    </section>
  );
}
