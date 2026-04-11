"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { HeroCTA } from "./HeroCTA"

export function FinalCTA() {
  return (
    <section
      className="py-24 px-6 text-center relative"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%), #0A0A0A",
      }}
    >
      <BlurFade delay={0.1} inView>
        <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[#FAF7F2] mb-4">
          Begin your journey.
        </h2>
        <p className="text-lg text-[#7A756D] mb-8 max-w-md mx-auto">
          Join readers exploring the greatest books ever written.
        </p>
        <HeroCTA />
        <p className="mt-4 text-[13px] text-[#7A756D]">
          No credit card. No ads. Just great books.
        </p>
      </BlurFade>
    </section>
  )
}
