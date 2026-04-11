"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { AnimatedQuiz } from "./mockups/AnimatedQuiz"

const CALLOUTS = [
  { label: "Multiple choice, passage identification, vocabulary in context", desc: "Every question tests real comprehension of what you just read." },
  { label: "Apprentice, Scholar, and Master difficulty", desc: "Three tiers that adapt to your skill level." },
  { label: "Earn Wisdom for every correct answer", desc: "Your knowledge becomes your currency." },
]

export function QuizSection() {
  return (
    <section className="bg-[#161616] py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 items-center">
        {/* Callouts */}
        <div className="order-2 md:order-1">
          <BlurFade delay={0.1} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[#FAF7F2] mb-2">
              Prove what you&apos;ve learned.
            </h2>
            <p className="text-sm text-[#7A756D] mb-8 leading-relaxed max-w-sm">
              Every chapter ends with a Trial &mdash; questions that test comprehension, vocabulary, and critical thinking. Pass the Trial to unlock the next chapter.
            </p>
          </BlurFade>
          <div className="space-y-5">
            {CALLOUTS.map((item, i) => (
              <BlurFade key={item.label} delay={0.2 + i * 0.08} inView>
                <div className="flex gap-3 items-start">
                  <div className="size-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-[#FAF7F2] text-sm">{item.label}</h4>
                    <p className="text-xs text-[#7A756D] mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        {/* Animated Quiz Mockup */}
        <BlurFade delay={0.1} inView>
          <div className="order-1 md:order-2">
            <AnimatedQuiz />
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
