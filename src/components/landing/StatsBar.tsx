"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { NumberTicker } from "@/components/ui/number-ticker"

const STATS = [
  { value: 500, suffix: "+", label: "books" },
  { value: 36, suffix: "", label: "traditions" },
  { value: 3000, suffix: "", label: "years of literature" },
  { value: 12, suffix: "", label: "ancient languages" },
]

export function StatsBar() {
  return (
    <section className="bg-[#161616] py-20 px-6">
      <BlurFade delay={0.1} inView>
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-x-16 gap-y-8 md:gap-x-20">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center flex flex-col items-center"
            >
              <div className="font-[var(--font-display)] text-3xl md:text-5xl font-bold text-[#D4AF37]">
                <NumberTicker value={stat.value} delay={0.1 + i * 0.15} />
                {stat.suffix && <span>{stat.suffix}</span>}
              </div>
              <p className="text-xs text-[#7A756D] mt-1 uppercase tracking-wider">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </BlurFade>
    </section>
  )
}
