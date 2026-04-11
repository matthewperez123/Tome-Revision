"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { HeroCTA } from "@/components/landing/HeroCTA"

export function ClosingCTA() {
  return (
    <section
      className="py-24 px-6 text-center relative"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(212,175,55,0.06) 0%, transparent 70%), #0A0A0A",
      }}
    >
      <BlurFade delay={0.1} inView>
        <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-[#FAF7F2] mb-4">
          Begin your journey through the canon.
        </h2>
        <p className="text-lg text-[#7A756D] mb-8 max-w-md mx-auto">
          Start reading the great books today.
        </p>
        <HeroCTA />
        <p className="mt-4 text-[13px] text-[#7A756D]">
          No credit card. No ads. Just great books.
        </p>
      </BlurFade>
    </section>
  )
}
