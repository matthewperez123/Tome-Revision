"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { AnimatedGamification } from "./mockups/AnimatedGamification"

export function GamificationSection() {
  return (
    <section className="bg-background py-24 px-6 md:px-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <BlurFade delay={0.1} inView>
          <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-4">
            Every page earns its reward.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Wisdom replaces XP. Flames replace streaks. Seals replace badges. The language is classical, but the psychology is Duolingo.
          </p>
        </BlurFade>
      </div>
      <div className="max-w-[700px] mx-auto">
        <BlurFade delay={0.2} inView>
          <AnimatedGamification />
        </BlurFade>
      </div>
    </section>
  )
}
