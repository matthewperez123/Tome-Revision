"use client"

import { motion } from "motion/react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 800 },
  { name: "profile", duration: 1500 },
  { name: "books", duration: 1800 },
  { name: "influences", duration: 2200 },
  { name: "reset", duration: 500 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const BOOKS = ["The Odyssey", "The Iliad", "Hymns"]
const INFLUENCES = ["Oral tradition", "Hesiod", "Near Eastern myths"]
const INFLUENCED = ["Virgil", "Dante", "Joyce", "Walcott"]

type Audience = "reader" | "teacher"

const COPY: Record<Audience, { heading: string; subcopy: string }> = {
  reader: {
    heading: "Every author, in depth",
    subcopy:
      "Biographies, literary context, influences, and complete bibliographies \u2014 a scholar's dossier for every voice in the canon.",
  },
  teacher: {
    heading: "A dossier per voice",
    subcopy:
      "Hand students a vetted author page instead of a Wikipedia tab. Biographies, influences, works, and movement context \u2014 the background reading, already written.",
  },
}

export function AuthorShowcase({ audience = "reader" }: { audience?: Audience } = {}) {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showProfile = phase !== "idle"
  const showBooks = phase === "books" || phase === "influences"
  const showInfluences = phase === "influences"
  const { heading, subcopy } = COPY[audience]

  if (isReduced) {
    return (
      <TeacherShowcaseShell heading={heading} subcopy={subcopy} layout="mockup-right" bgClass="bg-muted">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-14 rounded-full bg-[#0EA5E9] flex items-center justify-center text-lg font-bold text-white">H</div>
            <div>
              <p className="font-[var(--font-display)] text-lg font-bold">Homer</p>
              <p className="text-xs text-muted-foreground">~800 BCE · Ancient Greek</p>
            </div>
          </div>
          <div className="flex gap-2">
            {BOOKS.map(b => <span key={b} className="rounded-lg bg-muted px-2 py-1 text-[9px]">{b}</span>)}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell heading={heading} subcopy={subcopy} layout="mockup-right" bgClass="bg-muted">
      <div ref={containerRef} className="bg-card rounded-xl border border-border p-6 min-h-[280px] relative overflow-hidden" style={{ willChange: "transform" }}>
        <motion.div animate={{ opacity: showProfile ? 1 : 0, y: showProfile ? 0 : 15 }} transition={{ duration: 0.5, ease: EASE }} style={{ willChange: "transform, opacity" }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="size-14 rounded-full bg-[#0EA5E9] flex items-center justify-center text-lg font-bold text-white shadow-sm">H</div>
            <div>
              <p className="font-[var(--font-display)] text-lg font-bold">Homer</p>
              <p className="text-xs text-muted-foreground">~800 BCE · Ancient Greek</p>
              <p className="text-[10px] text-muted-foreground/60 mt-0.5">3 works in library</p>
            </div>
          </div>

          <motion.div className="flex gap-2 mb-4" animate={{ opacity: showBooks ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ willChange: "opacity" }}>
            {BOOKS.map((b, i) => (
              <motion.div key={b} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: showBooks ? 1 : 0, scale: showBooks ? 1 : 0.9 }} transition={{ delay: i * 0.1, duration: 0.3, ease: EASE }} className="flex-1 rounded-lg border bg-muted/50 p-2.5 text-center" style={{ willChange: "transform, opacity" }}>
                <div className="h-12 rounded bg-gradient-to-b from-[#0EA5E9]/20 to-transparent mb-1.5" />
                <p className="text-[9px] font-medium">{b}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div animate={{ opacity: showInfluences ? 1 : 0 }} transition={{ duration: 0.4, ease: EASE }} style={{ willChange: "opacity" }}>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1.5">Influences</p>
            <div className="flex gap-1 mb-3">
              {INFLUENCES.map((inf, i) => (
                <motion.span key={inf} initial={{ opacity: 0 }} animate={{ opacity: showInfluences ? 1 : 0 }} transition={{ delay: i * 0.15, duration: 0.3 }} className="rounded-full bg-blue-50 dark:bg-blue-950/30 px-2 py-0.5 text-[8px] text-blue-600 dark:text-blue-400" style={{ willChange: "opacity" }}>{inf}</motion.span>
              ))}
            </div>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mb-1.5">Influenced</p>
            <div className="flex gap-1">
              {INFLUENCED.map((inf, i) => (
                <motion.span key={inf} initial={{ opacity: 0 }} animate={{ opacity: showInfluences ? 1 : 0 }} transition={{ delay: 0.4 + i * 0.1, duration: 0.3 }} className="rounded-full bg-indigo-50 dark:bg-indigo-950/30 px-2 py-0.5 text-[8px] text-indigo-600 dark:text-indigo-400" style={{ willChange: "opacity" }}>{inf}</motion.span>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </TeacherShowcaseShell>
  )
}
