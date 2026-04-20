"use client"

import { motion } from "motion/react"
import { Brain, Flame, Trophy } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 600 },
  { name: "profile", duration: 1200 },
  { name: "stats", duration: 1800 },
  { name: "tabs", duration: 2200 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TRIALS = [
  { date: "Apr 8", book: "The Odyssey", score: 95, diff: "Scholar" },
  { date: "Apr 5", book: "The Odyssey", score: 90, diff: "Scholar" },
  { date: "Mar 28", book: "The Odyssey", score: 85, diff: "Foundational" },
]

export function StudentProfileShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showProfile = phase !== "idle"
  const showStats = phase === "stats" || phase === "tabs"
  const showTabs = phase === "tabs"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="The complete student picture" subcopy="A complete view of each student — reading time, Trial history, annotations, discussion posts, Wisdom earned. And private notes just for you." layout="mockup-right" bgClass="bg-muted">
        <div className="bg-card rounded-xl border border-border p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded-full bg-[#4F46E5] flex items-center justify-center text-sm font-bold text-white">EC</div>
            <div>
              <p className="text-sm font-semibold">Emma Chen</p>
              <p className="text-[10px] text-muted-foreground">11th · AP Literature</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border p-2 text-center"><p className="text-lg font-bold">2,340</p><p className="text-[8px] text-muted-foreground">Wisdom</p></div>
            <div className="rounded-lg border p-2 text-center"><p className="text-lg font-bold">14</p><p className="text-[8px] text-muted-foreground">Flame</p></div>
            <div className="rounded-lg border p-2 text-center"><p className="text-lg font-bold">5</p><p className="text-[8px] text-muted-foreground">Seals</p></div>
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="The complete student picture" subcopy="A complete view of each student — reading time, Trial history, annotations, discussion posts, Wisdom earned. And private notes just for you." layout="mockup-right" bgClass="bg-muted">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-5 min-h-[300px]" style={{ willChange: "transform" }}>
        <motion.div animate={{ opacity: showProfile ? 1 : 0, y: showProfile ? 0 : 10 }} transition={{ duration: 0.5, ease: EASE }} style={{ willChange: "transform, opacity" }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-12 rounded-full bg-[#4F46E5] flex items-center justify-center text-sm font-bold text-white">EC</div>
            <div>
              <p className="font-[var(--font-display)] text-base font-bold">Emma Chen</p>
              <p className="text-[10px] text-muted-foreground">11th Grade · AP Literature — Period 3</p>
            </div>
          </div>

          <motion.div animate={{ opacity: showStats ? 1 : 0, y: showStats ? 0 : 8 }} transition={{ duration: 0.4, ease: EASE }} className="grid grid-cols-3 gap-2 mb-4" style={{ willChange: "transform, opacity" }}>
            {[
              { icon: <Brain className="size-3 text-indigo-500" />, value: "2,340", label: "Wisdom" },
              { icon: <Flame className="size-3 text-orange-500" />, value: "14", label: "Day Flame" },
              { icon: <Trophy className="size-3 text-amber-500" />, value: "5", label: "Seals" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: showStats ? 1 : 0, scale: showStats ? 1 : 0.9 }} transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }} className="rounded-lg border p-2.5 text-center" style={{ willChange: "transform, opacity" }}>
                <div className="flex items-center justify-center gap-1 mb-0.5">{s.icon}</div>
                <p className="text-lg font-bold">{s.value}</p>
                <p className="text-[8px] text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tabs switching to Trials */}
          <motion.div animate={{ opacity: showTabs ? 1 : 0 }} transition={{ duration: 0.3 }} style={{ willChange: "opacity" }}>
            <div className="flex gap-1 mb-3 border-b border-border pb-1">
              {["Overview", "Reading", "Trials", "Annotations"].map(t => (
                <span key={t} className={`text-[9px] px-2 py-0.5 ${t === "Trials" ? "font-semibold border-b border-foreground" : "text-muted-foreground"}`}>{t}</span>
              ))}
            </div>
            <div className="space-y-1.5">
              {TRIALS.map((t, i) => (
                <motion.div key={t.date} initial={{ opacity: 0, x: -8 }} animate={{ opacity: showTabs ? 1 : 0, x: showTabs ? 0 : -8 }} transition={{ delay: i * 0.12, duration: 0.3, ease: EASE }} className="flex items-center gap-2 text-[9px] py-1" style={{ willChange: "transform, opacity" }}>
                  <span className="text-muted-foreground w-10">{t.date}</span>
                  <span className="flex-1">{t.book}</span>
                  <span className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-1.5 py-px text-[8px] text-indigo-600 dark:text-indigo-400">{t.diff}</span>
                  <span className="font-bold w-8 text-right text-green-600">{t.score}%</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
