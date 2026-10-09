import DayArcHero from '../components/DayArc/DayArcHero.jsx';
import Desks from '../components/Home/Desks.jsx';
import Stream from '../components/Home/Stream.jsx';
import Modules from '../components/Home/Modules.jsx';
import Flow from '../components/Home/Flow.jsx';
import India from '../components/Home/India.jsx';
import Security from '../components/Home/Security.jsx';
import Faq from '../components/Home/Faq.jsx';
import CtaBand from '../components/Home/CtaBand.jsx';

/** Rhythm: night → paper → night → mist → white → paper → navy → white → blue → navy footer. */
export default function HomePage() {
  return (
    <>
      <DayArcHero />
      <Desks />
      <Stream />
      <Modules />
      <Flow />
      <India />
      <Security />
      <Faq />
      <CtaBand />
    </>
  );
}
