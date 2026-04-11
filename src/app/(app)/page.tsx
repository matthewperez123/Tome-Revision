import { LandingNav } from "@/components/landing/LandingNav"
import { HeroSection } from "@/components/landing/HeroSection"
import { HomepageContent } from "@/components/landing/HomepageContent"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { AudienceProvider } from "@/contexts/AudienceContext"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AudienceProvider>
        <LandingNav />
        <HeroSection />
        <HomepageContent />
        <LandingFooter />
      </AudienceProvider>
    </div>
  )
}
