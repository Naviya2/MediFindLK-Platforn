import HeroSearch from '../features/landing/HeroSearch'
import LiveStatsBar from '../features/landing/LiveStatsBar'
import MedicineCrisisSection from '../features/landing/MedicineCrisisSection'
import HowItWorksSection from '../features/landing/HowItWorksSection'
import EmergencyBanner from '../features/landing/EmergencyBanner'

/** Public MediFind LK home / landing page. */
function LandingPage() {
  return (
    <div className="flex flex-col w-full">
      <HeroSearch />
      <LiveStatsBar />
      <MedicineCrisisSection />
      <HowItWorksSection />
      <EmergencyBanner />
    </div>
  )
}

export default LandingPage
