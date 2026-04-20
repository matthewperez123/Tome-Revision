import { LandingNav } from "@/components/landing/LandingNav"
import { HeroSection } from "@/components/landing/HeroSection"
import { HomepageContent } from "@/components/landing/HomepageContent"
import { LandingFooter } from "@/components/landing/LandingFooter"
import { StickyMobileCTA } from "@/components/landing/StickyMobileCTA"
import { AudienceProvider } from "@/contexts/AudienceContext"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <AudienceProvider>
        <LandingNav />
        <HeroSection />
        <HomepageContent />
        <LandingFooter />
        {/* Rendered last so it sits after any bottom navigator in DOM order,
            and z-index keeps it visually above iOS safe-area chrome. */}
        <StickyMobileCTA />
      </AudienceProvider>
    </div>
  )
}
