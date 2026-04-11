import { LandingNav } from "@/components/landing/LandingNav"
import { HeroSection } from "@/components/landing/HeroSection"
import { CarouselSection } from "@/components/landing/CarouselSection"
import { FeatureGrid } from "@/components/landing/FeatureGrid"
import { ReaderSection } from "@/components/landing/ReaderSection"
import { QuizSection } from "@/components/landing/QuizSection"
import { GamificationSection } from "@/components/landing/GamificationSection"
import { WorldMapSection } from "@/components/landing/WorldMapSection"
import { ClassroomSection } from "@/components/landing/ClassroomSection"
import { VirgilSection } from "@/components/landing/VirgilSection"
import { StatsBar } from "@/components/landing/StatsBar"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#FAF7F2]">
      <LandingNav />
      <HeroSection />
      <CarouselSection />
      <FeatureGrid />
      <ReaderSection />
      <QuizSection />
      <GamificationSection />
      <WorldMapSection />
      <ClassroomSection />
      <VirgilSection />
      <StatsBar />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
