"use client"

import { BookOpen, GraduationCap } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAudience } from "@/contexts/AudienceContext"

const glowBtn =
  "inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-border bg-card text-foreground font-semibold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:border-indigo-400/40 hover:scale-[1.03] transition-all duration-200"

export function TeacherCTA() {
  const { setAudience } = useAudience()

  return (
    <section
      className="py-24 px-6 text-center relative bg-background"
      style={{
        backgroundImage:
          "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)",
      }}
    >
      <BlurFade delay={0.1} inView>
        <h2 className="font-[var(--font-display)] text-4xl md:text-5xl font-bold text-foreground mb-4">
          Bring Tome to your classroom
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto">
          Set up your roster, assign your first text, and see how your students engage.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => setAudience("teacher")} className={glowBtn}>
            <GraduationCap className="size-4" />
            Start teaching
          </button>
          <button onClick={() => setAudience("reader")} className={glowBtn}>
            <BookOpen className="size-4" />
            Start reading
          </button>
        </div>
      </BlurFade>
    </section>
  )
}
