import DayArcHero from '../components/DayArc/DayArcHero.jsx';
import Desks from '../components/Home/Desks.jsx';
import Stream from '../components/Home/Stream.jsx';
import Tour from '../components/Home/Tour.jsx';
import Flow from '../components/Home/Flow.jsx';
import India from '../components/Home/India.jsx';
import Security from '../components/Home/Security.jsx';
import Faq from '../components/Home/Faq.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';
import usePageMeta from '../hooks/usePageMeta.js';

/** One light palette, alternating surfaces: paper → white → mist → paper → white → paper → mist → white → paper → white footer. */
export default function HomePage() {
  usePageMeta({
    title: 'SmartShala — School management CRM for Indian schools',
    description: 'SmartShala brings admissions, attendance, fees, exams, transport and payroll into one system built for Indian schools — on the web and in principal and teacher apps.',
    path: '/'
  });
  return (
    <>
      <DayArcHero />
      <Desks />
      <Stream />
      <Tour />
      <Flow />
      <India />
      <Security />
      <Faq />
      <CtaBand />
    </>
  );
}
