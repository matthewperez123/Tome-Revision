"use client"

import { motion, AnimatePresence } from "motion/react"
import { Lock, Radio, ChevronLeft, ChevronRight } from "lucide-react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

// Teacher loop target: ~4s.
const PHASES = [
  { name: "idle", duration: 900 },
  { name: "advance", duration: 1100 },
  { name: "sync", duration: 1400 },
  { name: "reset", duration: 300 },
]

const PARAGRAPHS = [
  "Call me Ishmael. Some years ago\u2014never mind how long precisely\u2014",
  "having little or no money in my purse, and nothing particular to interest me on shore,",
  "I thought I would sail about a little and see the watery part of the world.",
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function GuidedLearningShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const classIndex = phase === "advance" || phase === "sync" ? 1 : 0
  const showSyncPulse = phase === "sync"

  return (
    <TeacherShowcaseShell
      heading="Read together, in real time."
      subcopy="Pace your class through a passage. Navigation locks to the instructor, a live marker shows which paragraph is in focus, and student clocks resync automatically if they drift."
      layout="mockup-right"
      bgClass="bg-background"
    >
      <div
        ref={isReduced ? undefined : containerRef}
        className="bg-card rounded-xl border border-border overflow-hidden min-h-[300px]"
        aria-label="Guided Learning session demonstration"
      >
        {/* Instructor banner */}
        <div className="bg-indigo-500/10 border-b border-indigo-500/20 px-4 py-2 flex items-center gap-2">
          <motion.div
            animate={showSyncPulse ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.6, repeat: showSyncPulse ? 1 : 0 }}
          >
            <Radio className="size-3 text-indigo-500" />
          </motion.div>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
            Mr. Perez is pacing &middot; Moby-Dick, Ch. 1
          </span>
          <span className="ml-auto text-[10px] text-muted-foreground">
            28 students in session
          </span>
        </div>

        {/* Locked reader nav */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/50">
          <button
            type="button"
            disabled
            className="flex items-center gap-1 text-[11px] text-muted-foreground/50 cursor-not-allowed"
          >
            <ChevronLeft className="size-3" /> Prev
          </button>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Lock className="size-2.5" />
            Locked to instructor
          </div>
          <button
            type="button"
            disabled
            className="flex items-center gap-1 text-[11px] text-muted-foreground/50 cursor-not-allowed"
          >
            Next <ChevronRight className="size-3" />
          </button>
        </div>

        {/* Passage with live focus marker */}
        <div className="p-5 relative">
          {PARAGRAPHS.map((p, i) => {
            const isFocus = i === classIndex
            return (
              <div key={i} className="flex gap-3 mb-3">
                <AnimatePresence>
                  {isFocus && (
                    <motion.span
                      key={`marker-${i}`}
                      layoutId="focus-marker"
                      className="absolute left-2 w-0.5 rounded-full bg-indigo-500"
                      style={{
                        top: `${20 + i * 58}px`,
                        height: "44px",
                      }}
                      transition={{ duration: 0.4, ease: EASE }}
                    />
                  )}
                </AnimatePresence>
                <motion.p
                  animate={{
                    color: isFocus
                      ? "hsl(var(--foreground))"
                      : "hsl(var(--muted-foreground))",
                    opacity: isFocus ? 1 : 0.5,
                  }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="font-serif text-sm leading-[1.8] pl-2"
                >
                  {p}
                </motion.p>
              </div>
            )
          })}
        </div>

        {/* Sync footer */}
        <div className="px-4 py-2 border-t border-border bg-muted/50 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Paragraph {classIndex + 1} / 14</span>
          <AnimatePresence mode="wait">
            {showSyncPulse ? (
              <motion.span
                key="syncing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-indigo-500 font-semibold"
              >
                Resyncing clock&hellip;
              </motion.span>
            ) : (
              <motion.span
                key="insync"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                In sync with class
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
