"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 800 },
  { name: "render", duration: 1500 },
  { name: "authors", duration: 2000 },
  { name: "hover", duration: 2000 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const AUTHORS = [
  { initials: "H", name: "Homer", year: "~800 BCE", color: "#0EA5E9" },
  { initials: "V", name: "Virgil", year: "70 BCE", color: "#6366F1" },
  { initials: "D", name: "Dante", year: "1265", color: "#F59E0B" },
  { initials: "S", name: "Shakespeare", year: "1564", color: "#EF4444" },
  { initials: "A", name: "Austen", year: "1775", color: "#F43F5E" },
  { initials: "T", name: "Tolstoy", year: "1828", color: "#3B82F6" },
]

export function TimelinesShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showAuthors = phase === "authors" || phase === "hover"
  const showHover = phase === "hover"

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading="The canon, charted through time" subcopy="Follow each tradition from its first masters to its latest voices. Every author lives in context." layout="mockup-left" bgClass="bg-background">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            {AUTHORS.map(a => (
              <div key={a.initials} className="flex flex-col items-center gap-1">
                <div className="size-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: a.color }}>{a.initials}</div>
                <span className="text-[8px] text-muted-foreground">{a.year}</span>
              </div>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading="The canon, charted through time" subcopy="Follow each tradition from its first masters to its latest voices. Every author lives in context." layout="mockup-left" bgClass="bg-background">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-6 min-h-[220px] relative overflow-hidden" style={{ willChange: "transform" }}>
        <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider font-medium">Ancient Greek Tradition</p>
        <div className="relative h-1 bg-muted rounded-full mb-8 mt-2">
          <motion.div className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0EA5E9] to-[#6366F1] rounded-full" animate={{ width: phase === "idle" ? "0%" : "100%" }} transition={{ duration: 1.2, ease: EASE }} style={{ willChange: "transform" }} />
        </div>
        <div className="flex items-start justify-between">
          {AUTHORS.map((a, i) => (
            <motion.div key={a.initials} className="flex flex-col items-center gap-1 relative" initial={{ opacity: 0, y: 10 }} animate={{ opacity: showAuthors ? 1 : 0, y: showAuthors ? 0 : 10 }} transition={{ delay: i * 0.12, duration: 0.4, ease: EASE }} style={{ willChange: "transform, opacity" }}>
              <div className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm" style={{ backgroundColor: a.color }}>{a.initials}</div>
              <span className="text-[8px] text-muted-foreground font-medium">{a.name}</span>
              <span className="text-[7px] text-muted-foreground/60">{a.year}</span>
              {showHover && i === 2 && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, ease: EASE }} className="absolute top-full mt-2 w-32 rounded-lg border bg-card p-2 shadow-lg z-10" style={{ willChange: "transform, opacity" }}>
                  <p className="text-[9px] font-semibold">Divine Comedy</p>
                  <p className="text-[7px] text-muted-foreground">Epic poem, 1320</p>
                  <p className="text-[9px] font-semibold mt-1">Vita Nuova</p>
                  <p className="text-[7px] text-muted-foreground">Prose & poetry, 1294</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
