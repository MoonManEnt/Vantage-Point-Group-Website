import HeroSection from '@/components/hero/HeroSection'
import ARMQuizSection from '@/components/quiz/ARMQuizSection'
import ArmBentoSection from '@/components/sections/ArmBentoSection'
import KrakenMethodSection from '@/components/sections/KrakenMethodSection'
import EntityCardsSection from '@/components/sections/EntityCardsSection'
import MissionSection from '@/components/sections/MissionSection'
import IpaStrip from '@/components/sections/IpaStrip'
import EventsSection from '@/components/sections/EventsSection'
import SiteFooter from '@/components/sections/SiteFooter'

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ARMQuizSection />
      <ArmBentoSection />
      <KrakenMethodSection />
      <EntityCardsSection />
      <MissionSection />
      <IpaStrip />
      <EventsSection />
      <SiteFooter />
    </>
  )
}
