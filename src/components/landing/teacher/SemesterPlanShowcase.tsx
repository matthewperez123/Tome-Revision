"use client"

import { motion } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 800 },
  { name: "grid", duration: 1200 },
  { name: "distribute", duration: 2200 },
  { name: "expand", duration: 2000 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const WEEKS = [
  { num: 1, content: "Books 1–4", filled: false },
  { num: 2, content: "Books 5–8", filled: false },
  { num: 3, content: "Books 9–12", filled: false },
  { num: 4, content: "Books 13–16", filled: false },
  { num: 5, content: "Books 17–20", filled: false },
  { num: 6, content: "Books 21–24", filled: false },
]

export function SemesterPlanShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showGrid = phase !== "idle"
  const showFilled = phase === "distribute" || phase === "expand"
  const showExpand = phase === "expand"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Plan a semester in minutes" subcopy="Map every week: books, chapters, Trials, discussions, due dates. Auto-distribute a novel across your semester, then refine by hand." layout="mockup-left" bgClass="bg-background">
        <div className="bg-card rounded-xl border border-border p-5">
          <p className="text-[10px] text-muted-foreground mb-3">The Odyssey — 6-week plan</p>
          <div className="grid grid-cols-3 gap-2">
            {WEEKS.map(w => (
              <div key={w.num} className="rounded-lg border bg-stone-50 dark:bg-stone-900/30 p-2">
                <p className="text-[8px] font-bold text-muted-foreground">Week {w.num}</p>
                <p className="text-[9px]">{w.content}</p>
              </div>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Plan a semester in minutes" subcopy="Map every week: books, chapters, Trials, discussions, due dates. Auto-distribute a novel across your semester, then refine by hand." layout="mockup-left" bgClass="bg-background">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-5 min-h-[280px] relative overflow-hidden" style={{ willChange: "transform" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] text-muted-foreground">The Odyssey — 6-week plan</p>
          <motion.button animate={{ backgroundColor: showFilled ? "#22C55E" : "#6366F1", scale: phase === "distribute" ? [1, 1.05, 1] : 1 }} transition={{ duration: 0.3 }} className="rounded-full px-2.5 py-0.5 text-[9px] font-medium text-white" style={{ willChange: "transform" }}>
            {showFilled ? "✓ Distributed" : "Auto-distribute"}
          </motion.button>
        </div>

        <motion.div animate={{ opacity: showGrid ? 1 : 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-3 gap-2" style={{ willChange: "opacity" }}>
          {WEEKS.map((w, i) => (
            <motion.div key={w.num} initial={{ opacity: 0 }} animate={{ opacity: showGrid ? 1 : 0, backgroundColor: showFilled ? "rgb(120 113 108 / 0.08)" : "transparent" }} transition={{ delay: showFilled ? i * 0.12 : i * 0.06, duration: 0.4, ease: EASE }} className="rounded-lg border p-2.5 relative overflow-hidden" style={{ willChange: "transform, opacity" }}>
              <p className="text-[8px] font-bold text-muted-foreground mb-0.5">Week {w.num}</p>
              <motion.p animate={{ opacity: showFilled ? 1 : 0, y: showFilled ? 0 : 5 }} transition={{ delay: i * 0.12 + 0.2, duration: 0.3, ease: EASE }} className="text-[9px] font-medium" style={{ willChange: "transform, opacity" }}>
                {w.content}
              </motion.p>
              {showFilled && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.4, duration: 0.3 }} className="mt-1 flex gap-1" style={{ willChange: "opacity" }}>
                  <span className="rounded bg-indigo-100 dark:bg-indigo-950/30 px-1 py-px text-[7px] text-indigo-600 dark:text-indigo-400">Trial</span>
                  <span className="rounded bg-green-100 dark:bg-green-950/30 px-1 py-px text-[7px] text-green-600 dark:text-green-400">Discussion</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Expanded week detail */}
        {showExpand && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: EASE }} className="absolute bottom-3 left-3 right-3 rounded-lg border bg-card p-3 shadow-lg" style={{ willChange: "transform, opacity" }}>
            <p className="text-[9px] font-bold mb-1">Week 1 — Books 1–4</p>
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-[8px]"><span className="size-1.5 rounded-full bg-stone-400" />Reading: Books 1–4 (Telemachy)</div>
              <div className="flex items-center gap-1.5 text-[8px]"><span className="size-1.5 rounded-full bg-indigo-500" />Trial: Books 1–4 (Foundational)</div>
              <div className="flex items-center gap-1.5 text-[8px]"><span className="size-1.5 rounded-full bg-green-500" />Discussion: Xenia in Books 1–4</div>
            </div>
          </motion.div>
        )}
      </div>
    </TeacherShowcaseShell>
  )
}
