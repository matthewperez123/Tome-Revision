"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 2000 },
  { name: "tapGC", duration: 2000 },
  { name: "loading", duration: 2500 },
  { name: "imported", duration: 3500 },
  { name: "reset", duration: 600 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const IMPORTED_STUDENTS = [
  { name: "Marcus Aurelius", email: "marcus@school.edu" },
  { name: "Livia Drusilla", email: "livia@school.edu" },
  { name: "Gaius Cassius", email: "gaius@school.edu" },
  { name: "Helena Augusta", email: "helena@school.edu" },
  { name: "Diana Nemorensis", email: "diana@school.edu" },
]

export function RosterImportShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const gcActive = phase === "tapGC" || phase === "loading"
  const showSpinner = phase === "loading"
  const showImported = phase === "imported"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Import your roster in seconds"
        subcopy="One-click sync with Google Classroom, or drop in a CSV."
        layout="mockup-right"
        bgClass="bg-muted"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-xs text-muted-foreground mb-4">Roster Import</p>
          <div className="flex gap-3">
            <div className="flex-1 p-4 rounded-lg border border-border bg-muted/50 flex flex-col items-center gap-2">
              <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg">
                G
              </div>
              <span className="text-xs text-muted-foreground font-medium">Google Classroom</span>
            </div>
            <div className="flex-1 p-4 rounded-lg border border-border bg-muted/50 flex flex-col items-center gap-2">
              <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                CSV
              </div>
              <span className="text-xs text-muted-foreground font-medium">Upload CSV</span>
            </div>
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Import your roster in seconds"
      subcopy="One-click sync with Google Classroom, or drop in a CSV."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated roster import demonstration"
      >
        <p className="text-xs text-muted-foreground mb-4">Roster Import</p>

        <AnimatePresence mode="wait">
          {!showImported ? (
            <motion.div
              key="import-options"
              className="flex gap-3"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{ willChange: "transform, opacity" }}
            >
              {/* Google Classroom card */}
              <motion.div
                className={`flex-1 p-4 rounded-lg border bg-muted/50 flex flex-col items-center gap-2 cursor-pointer ${
                  gcActive ? "border-indigo-500" : "border-border"
                }`}
                animate={{
                  borderColor: gcActive
                    ? "rgb(99 102 241)"
                    : "var(--border)",
                }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{ willChange: "transform, opacity" }}
              >
                <div className="size-10 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-500 font-bold text-lg">
                  G
                </div>
                {showSpinner ? (
                  <div className="size-5 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
                ) : (
                  <span className="text-xs text-muted-foreground font-medium">Google Classroom</span>
                )}
              </motion.div>

              {/* CSV card */}
              <div className="flex-1 p-4 rounded-lg border border-border bg-muted/50 flex flex-col items-center gap-2 cursor-pointer">
                <div className="size-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500 font-bold text-xs">
                  CSV
                </div>
                <span className="text-xs text-muted-foreground font-medium">Upload CSV</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="roster-list"
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 60 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="space-y-2"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="size-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                  <CheckIcon />
                </div>
                <span className="text-xs font-semibold text-foreground">
                  5 students imported
                </span>
              </div>

              {IMPORTED_STUDENTS.map((student, i) => (
                <motion.div
                  key={student.email}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: i * 0.08,
                    duration: 0.3,
                    ease: EASE,
                  }}
                  className="flex items-center gap-3 py-1.5"
                  style={{ willChange: "transform, opacity" }}
                >
                  <div className="size-4 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                    <CheckIcon />
                  </div>
                  <span className="text-sm text-foreground font-medium">
                    {student.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {student.email}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </TeacherShowcaseShell>
  )
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      className="text-emerald-500"
    >
      <path
        d="M2 5.5L4 7.5L8 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
