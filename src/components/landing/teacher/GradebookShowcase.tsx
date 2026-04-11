"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 2000 },
  { name: "fillRows", duration: 3000 },
  { name: "hoverRow", duration: 2000 },
  { name: "expand", duration: 3500 },
  { name: "reset", duration: 600 },
]

const STUDENTS = [
  { name: "Marcus A.", t1: 92, t2: 88, avg: 90 },
  { name: "Livia C.", t1: 85, t2: 91, avg: 88 },
  { name: "Aurelius T.", t1: 78, t2: 82, avg: 80 },
  { name: "Helena P.", t1: 95, t2: 97, avg: 96 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function GradebookShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const rowsVisible = phase !== "idle"
  const highlightLivia = phase === "hoverRow" || phase === "expand"
  const showExpanded = phase === "expand"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="See how they&rsquo;re really reading"
        subcopy="Scores, time on page, Virgil conversations, and annotation density &mdash; all in one gradebook."
        layout="mockup-right"
        bgClass="bg-muted"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-xs text-muted-foreground mb-4">
            Gradebook &middot; The Odyssey
          </p>
          <GradebookTable
            rowsVisible
            highlightLivia={false}
            showExpanded={false}
          />
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="See how they&rsquo;re really reading"
      subcopy="Scores, time on page, Virgil conversations, and annotation density &mdash; all in one gradebook."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated gradebook demonstration"
      >
        <p className="text-xs text-muted-foreground mb-4">
          Gradebook &middot; The Odyssey
        </p>

        <GradebookTable
          rowsVisible={rowsVisible}
          highlightLivia={highlightLivia}
          showExpanded={showExpanded}
        />

      </div>
    </TeacherShowcaseShell>
  )
}

function ScoreCell({ value }: { value: number }) {
  return (
    <span
      className={`text-sm font-mono ${
        value >= 90 ? "text-emerald-500" : "text-foreground"
      }`}
    >
      {value}
    </span>
  )
}

function GradebookTable({
  rowsVisible,
  highlightLivia,
  showExpanded,
}: {
  rowsVisible: boolean
  highlightLivia: boolean
  showExpanded: boolean
}) {
  return (
    <div className="space-y-0">
      {/* Table header */}
      <div className="grid grid-cols-4 gap-2 px-2 pb-2 border-b border-border mb-1">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">
          Student
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-right">
          Trial 1
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-right">
          Trial 2
        </span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider text-right">
          Avg
        </span>
      </div>

      {/* Student rows */}
      {STUDENTS.map((student, i) => {
        const isLivia = i === 1

        return (
          <div key={student.name}>
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={
                rowsVisible
                  ? { opacity: 1, y: 0 }
                  : { opacity: 0, y: 8 }
              }
              transition={{
                delay: rowsVisible ? i * 0.18 : 0,
                duration: 0.4,
                ease: EASE,
              }}
              style={{ willChange: "transform, opacity" }}
              className={`grid grid-cols-4 gap-2 px-2 py-1.5 ${
                isLivia && highlightLivia
                  ? "bg-indigo-500/5 rounded-lg"
                  : ""
              }`}
            >
              <span className="text-sm text-foreground">{student.name}</span>
              <span className="text-right">
                <ScoreCell value={student.t1} />
              </span>
              <span className="text-right">
                <ScoreCell value={student.t2} />
              </span>
              <span className="text-right">
                <ScoreCell value={student.avg} />
              </span>
            </motion.div>

            {/* Expanded detail panel for Livia */}
            {isLivia && (
              <AnimatePresence>
                {showExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-hidden"
                    style={{ willChange: "transform, opacity" }}
                  >
                    <div className="bg-muted/50 rounded-lg p-3 mt-2 mb-1 mx-2 space-y-2">
                      <DetailBar label="Virgil chats" value="12" width="60%" />
                      <DetailBar
                        label="Reading time"
                        value="4.2h"
                        width="80%"
                      />
                      <DetailBar
                        label="Annotations"
                        value="8"
                        width="45%"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        )
      })}
    </div>
  )
}

function DetailBar({
  label,
  value,
  width,
}: {
  label: string
  value: string
  width: string
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-muted-foreground w-20 shrink-0">
        {label}:
      </span>
      <span className="text-xs font-mono text-foreground w-8 shrink-0">
        {value}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-1.5 rounded-full bg-indigo-500"
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          style={{ willChange: "transform, opacity" }}
        />
      </div>
    </div>
  )
}
