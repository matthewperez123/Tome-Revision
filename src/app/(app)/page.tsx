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
import { AnnotationShowcase } from "@/components/landing/AnnotationShowcase"
import { TrialsShowcase } from "@/components/landing/TrialsShowcase"
import { SealsShowcase } from "@/components/landing/SealsShowcase"
import { LibraryShowcase } from "@/components/landing/LibraryShowcase"
import { FinalCTA } from "@/components/landing/FinalCTA"
import { LandingFooter } from "@/components/landing/LandingFooter"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
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
      <AnnotationShowcase />
      <TrialsShowcase />
      <SealsShowcase />
      <LibraryShowcase />
      <FinalCTA />
      <LandingFooter />
    </div>
  )
}
