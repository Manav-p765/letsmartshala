import DayArcHero from '../components/DayArc/DayArcHero.jsx';
import Desks from '../components/Home/Desks.jsx';
import Stream from '../components/Home/Stream.jsx';
import Tour from '../components/Home/Tour.jsx';
import Flow from '../components/Home/Flow.jsx';
import India from '../components/Home/India.jsx';
import Security from '../components/Home/Security.jsx';
import Faq from '../components/Home/Faq.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';

/** One light palette, alternating surfaces: paper → white → mist → paper → white → paper → mist → white → paper → white footer. */
export default function HomePage() {
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
