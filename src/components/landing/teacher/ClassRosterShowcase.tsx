"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 600 },
  { name: "populate", duration: 900 },
  { name: "hover", duration: 750 },
  { name: "tooltip", duration: 900 },
  { name: "reset", duration: 200 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const STUDENTS = [
  { name: "Marcus A.", initials: "MA", bg: "bg-indigo-500/20", text: "text-indigo-500", online: true },
  { name: "Livia C.", initials: "LC", bg: "bg-amber-500/20", text: "text-amber-500", online: true },
  { name: "Aurelius T.", initials: "AT", bg: "bg-emerald-500/20", text: "text-emerald-500", online: false },
  { name: "Helena P.", initials: "HP", bg: "bg-rose-500/20", text: "text-rose-500", online: true },
  { name: "Cassius D.", initials: "CD", bg: "bg-sky-500/20", text: "text-sky-500", online: false },
  { name: "Diana M.", initials: "DM", bg: "bg-violet-500/20", text: "text-violet-500", online: true },
]

const HOVERED_INDEX = 1 // Livia C.

export function ClassRosterShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showRows = phase === "populate" || phase === "hover" || phase === "tooltip"
  const highlightRow = phase === "hover" || phase === "tooltip"
  const showTooltip = phase === "tooltip"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Set up your classroom in minutes."
        subcopy="Create classes, invite students by code or roster import, organize by section or period. Bulk import from CSV or your SIS."
        layout="mockup-left"
        bgClass="bg-background"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-start justify-between mb-4 gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">AP Literature &middot; Period 3</p>
            <p className="text-[10px] text-muted-foreground">28 students &middot; Join code <span className="font-mono text-foreground">TOME-7Q4</span></p>
          </div>
        </div>
          <div className="space-y-3">
            {STUDENTS.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${s.bg} ${s.text}`}>
                  {s.initials}
                </div>
                <span className="text-sm text-foreground">{s.name}</span>
                <div className="ml-auto">
                  <div className={`size-2 rounded-full ${s.online ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Your class, in one place"
      subcopy="Add students, organize them into sections, and track every reader at a glance."
      layout="mockup-left"
      bgClass="bg-background"
      paddingClass="py-20"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated class roster demonstration"
      >
        <div className="flex items-start justify-between mb-4 gap-2">
          <div>
            <p className="text-sm font-semibold text-foreground">AP Literature &middot; Period 3</p>
            <p className="text-[10px] text-muted-foreground">28 students &middot; Join code <span className="font-mono text-foreground">TOME-7Q4</span></p>
          </div>
        </div>

        <div className="space-y-1">
          {STUDENTS.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{
                opacity: showRows ? 1 : 0,
                y: showRows ? 0 : 12,
              }}
              transition={{
                delay: phase === "populate" ? i * 0.15 : 0,
                duration: 0.4,
                ease: EASE,
              }}
              className={`flex items-center gap-3 px-2 py-2 transition-colors ${
                highlightRow && i === HOVERED_INDEX ? "bg-indigo-500/5 rounded-lg" : ""
              }`}
              style={{ willChange: "transform, opacity" }}
            >
              <div className={`size-8 rounded-full flex items-center justify-center text-xs font-bold ${s.bg} ${s.text}`}>
                {s.initials}
              </div>
              <span className="text-sm text-foreground">{s.name}</span>
              <div className="ml-auto">
                <div className={`size-2 rounded-full ${s.online ? "bg-emerald-500" : "bg-muted-foreground/30"}`} />
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="absolute left-[140px] top-[100px] bg-card border border-border rounded-lg p-3 shadow-lg z-20"
              style={{ willChange: "transform, opacity" }}
            >
              <p className="text-xs text-muted-foreground leading-relaxed">
                Currently reading: <span className="text-foreground font-medium">The Iliad</span>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                Wisdom: <span className="text-foreground font-medium">Level 3</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </TeacherShowcaseShell>
  )
}
