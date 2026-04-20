"use client"

import { motion } from "motion/react"
import { Flame, Trophy } from "lucide-react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 450 },
  { name: "chart", duration: 1400 },
  { name: "streak", duration: 1150 },
  { name: "seals", duration: 1550 },
  { name: "reset", duration: 400 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const DAYS = [
  { day: "Mon", mins: 35 },
  { day: "Tue", mins: 28 },
  { day: "Wed", mins: 42 },
  { day: "Thu", mins: 15 },
  { day: "Fri", mins: 50 },
  { day: "Sat", mins: 38 },
  { day: "Sun", mins: 25 },
]

const SEALS = [
  { name: "First Trial", color: "#6366F1" },
  { name: "Book Worm", color: "#22C55E" },
  { name: "Flame Keeper", color: "#F59E0B" },
]

export function ReadingInsightsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showChart = phase !== "idle"
  const showStreak = phase === "streak" || phase === "seals"
  const showSeals = phase === "seals"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="Know your reading life" subcopy="Time on the page, books finished, Flames kept, Seals earned — your reading becomes visible." layout="mockup-right" bgClass="bg-muted">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-end gap-1.5 h-16 mb-3">
            {DAYS.map(d => (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
                <div className="w-full rounded-t bg-indigo-500/70" style={{ height: `${(d.mins / 50) * 50}px` }} />
                <span className="text-[7px] text-muted-foreground">{d.day}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            {SEALS.map(s => <span key={s.name} className="rounded-full px-2 py-0.5 text-[8px] text-white" style={{ backgroundColor: s.color }}>{s.name}</span>)}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="Know your reading life" subcopy="Time on the page, books finished, Flames kept, Seals earned — your reading becomes visible." layout="mockup-right" bgClass="bg-muted">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-5 min-h-[260px]" style={{ willChange: "transform" }}>
        <p className="text-[10px] text-muted-foreground mb-3 uppercase tracking-wider font-medium">This Week</p>

        {/* Bar chart */}
        <div className="flex items-end gap-1.5 h-20 mb-4">
          {DAYS.map((d, i) => (
            <div key={d.day} className="flex-1 flex flex-col items-center gap-0.5">
              <motion.div className="w-full rounded-t bg-indigo-500/70" animate={{ height: showChart ? `${(d.mins / 50) * 60}px` : "0px" }} transition={{ delay: i * 0.08, duration: 0.5, ease: EASE }} style={{ willChange: "transform" }} />
              <span className="text-[7px] text-muted-foreground">{d.day}</span>
            </div>
          ))}
        </div>

        {/* Streak */}
        <motion.div animate={{ opacity: showStreak ? 1 : 0, y: showStreak ? 0 : 8 }} transition={{ duration: 0.4, ease: EASE }} className="flex items-center gap-3 mb-4" style={{ willChange: "transform, opacity" }}>
          <div className="flex items-center gap-1.5">
            <Flame className="size-4 text-orange-500" />
            <motion.span className="text-lg font-bold" animate={{ opacity: showStreak ? 1 : 0 }}>14</motion.span>
            <span className="text-[10px] text-muted-foreground">day Flame</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="text-lg font-bold">233</span>
            <span className="text-[10px] text-muted-foreground">min this week</span>
          </div>
        </motion.div>

        {/* Seals */}
        <motion.div animate={{ opacity: showSeals ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ willChange: "opacity" }}>
          <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-2">Recent Seals</p>
          <div className="flex gap-2">
            {SEALS.map((s, i) => (
              <motion.div key={s.name} initial={{ scale: 0, opacity: 0 }} animate={{ scale: showSeals ? 1 : 0, opacity: showSeals ? 1 : 0 }} transition={{ delay: i * 0.15, duration: 0.4, ease: EASE }} className="flex items-center gap-1.5 rounded-full px-2.5 py-1" style={{ backgroundColor: `${s.color}15`, willChange: "transform, opacity" }}>
                <Trophy className="size-3" style={{ color: s.color }} />
                <span className="text-[9px] font-medium" style={{ color: s.color }}>{s.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
