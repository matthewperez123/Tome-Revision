"use client"

import { BlurFade } from "@/components/ui/blur-fade"
import { AnimatedClassroom } from "./mockups/AnimatedClassroom"

const CALLOUTS = [
  { label: "Live reading presence \u2014 see who\u2019s reading right now" },
  { label: "AI-assisted quiz builder with manual editing" },
  { label: "Assignment types: reading, quiz, discussion, essay, annotation" },
  { label: "Quiz completion notifications in real time" },
]

export function ClassroomSection() {
  return (
    <section className="bg-[#161616] py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 items-center">
        {/* Callouts */}
        <div>
          <BlurFade delay={0.1} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-[#FAF7F2] mb-2">
              Built for classrooms.
            </h2>
            <p className="text-sm text-[#7A756D] mb-8 leading-relaxed max-w-sm">
              Teachers assign books, build custom quizzes, monitor reading in real time, and track every student&apos;s progress. Students join with a 6-character code.
            </p>
          </BlurFade>
          <div className="space-y-4">
            {CALLOUTS.map((item, i) => (
              <BlurFade key={item.label} delay={0.2 + i * 0.08} inView>
                <div className="flex gap-3 items-start">
                  <div className="size-1.5 rounded-full bg-[#D4AF37] mt-2 shrink-0" />
                  <p className="text-sm text-[#C4BFB6] leading-relaxed">{item.label}</p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>

        {/* Animated Classroom Mockup */}
        <BlurFade delay={0.1} inView>
          <AnimatedClassroom />
        </BlurFade>
      </div>
    </section>
  )
}
