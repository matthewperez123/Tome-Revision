"use client"

import { motion } from "motion/react"
import { Bookmark } from "lucide-react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 600 },
  { name: "card1", duration: 1200 },
  { name: "card2", duration: 1200 },
  { name: "card3", duration: 1200 },
  { name: "save", duration: 1800 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const QUOTES = [
  { text: "Call me Ishmael.", author: "Herman Melville", work: "Moby-Dick", theme: "Identity" },
  { text: "All happy families are alike; each unhappy family is unhappy in its own way.", author: "Leo Tolstoy", work: "Anna Karenina", theme: "Family" },
  { text: "It is a truth universally acknowledged...", author: "Jane Austen", work: "Pride and Prejudice", theme: "Society" },
]

export function QuotesShowcase() {
  const { phase, phaseIndex, containerRef, isReduced } = useAnimationLoop(PHASES)
  const visibleCards = phase === "idle" ? 0 : phase === "card1" ? 1 : phase === "card2" ? 2 : 3
  const showSave = phase === "save"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="The lines that made it last" subcopy="Save, share, and return to the passages that define the canon." layout="mockup-left" bgClass="bg-background">
        <div className="space-y-3">
          {QUOTES.map(q => (
            <div key={q.text} className="bg-card rounded-xl border border-border p-4">
              <p className="text-sm italic">&ldquo;{q.text}&rdquo;</p>
              <p className="text-[10px] text-muted-foreground mt-1">— {q.author}, {q.work}</p>
            </div>
          ))}
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="The lines that made it last" subcopy="Save, share, and return to the passages that define the canon." layout="mockup-left" bgClass="bg-background">
      <div ref={containerRef} className="space-y-3 min-h-[260px]" style={{ willChange: "transform" }}>
        {QUOTES.map((q, i) => (
          <motion.div key={q.text} initial={{ opacity: 0, y: 12 }} animate={{ opacity: i < visibleCards ? 1 : 0, y: i < visibleCards ? 0 : 12 }} transition={{ duration: 0.5, ease: EASE }} className="bg-card rounded-xl border border-border p-4 relative" style={{ willChange: "transform, opacity" }}>
            <p className="text-sm italic font-[var(--font-body)]">&ldquo;{q.text}&rdquo;</p>
            <div className="flex items-center justify-between mt-2">
              <p className="text-[10px] text-muted-foreground">— {q.author}, <span className="italic">{q.work}</span></p>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-0.5 text-[8px] text-indigo-600 dark:text-indigo-400">{q.theme}</span>
                <motion.div animate={{ scale: showSave && i === 0 ? [1, 1.3, 1] : 1, color: showSave && i === 0 ? "#D4AF37" : "var(--muted-foreground)" }} transition={{ duration: 0.4 }}>
                  <Bookmark className="size-3.5" />
                </motion.div>
              </div>
            </div>
            {showSave && i === 0 && (
              <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: [0, 1, 0] }} transition={{ duration: 0.8 }} className="absolute top-2 right-2 size-6 rounded-full border-2 border-[#D4AF37]" style={{ willChange: "transform, opacity" }} />
            )}
          </motion.div>
        ))}
      </div>
    </TeacherShowcaseShell>
  )
}
