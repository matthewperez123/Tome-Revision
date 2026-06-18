"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Flag, Clock, BookMarked } from "lucide-react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Reader {
  name: string
  /** Per-book progress, 0=none 1=started 2=halfway 3=complete. */
  progress: number[]
  lastActive: string
  flag?: string
}

// 8 readers × 6 books of The Odyssey.
const READERS: Reader[] = [
  { name: "Marcus A.", progress: [3, 3, 3, 2, 1, 0], lastActive: "2 hours ago" },
  { name: "Livia C.", progress: [3, 3, 2, 1, 0, 0], lastActive: "5 hours ago" },
  {
    name: "Aurelius T.",
    progress: [3, 2, 1, 0, 0, 0],
    lastActive: "5 days ago",
    flag: "No activity in 5 days",
  },
  { name: "Helena P.", progress: [3, 3, 3, 3, 3, 2], lastActive: "1 hour ago" },
  {
    name: "Cassius D.",
    progress: [3, 3, 2, 2, 1, 0],
    lastActive: "Yesterday",
    flag: "Failed Book III Trial twice",
  },
  { name: "Diana M.", progress: [3, 3, 3, 2, 2, 1], lastActive: "30 min ago" },
  { name: "Octavia R.", progress: [3, 2, 1, 1, 0, 0], lastActive: "3 days ago" },
  { name: "Felix B.", progress: [3, 3, 3, 3, 2, 1], lastActive: "4 hours ago" },
]

const CELL_COLOR = (v: number) => {
  if (v === 0) return "bg-muted"
  if (v === 1) return "bg-primary/20"
  if (v === 2) return "bg-primary/55"
  return "bg-primary"
}

function currentBook(progress: number[]) {
  const idx = progress.findIndex((v) => v > 0 && v < 3)
  if (idx === -1) {
    const lastDone = progress.lastIndexOf(3)
    return lastDone === progress.length - 1
      ? "Finished all books"
      : `Book ${lastDone + 2}`
  }
  return `Book ${idx + 1}`
}

export function ClassProgressDemo() {
  const [selected, setSelected] = useState<string | null>("Aurelius T.")
  const reader = READERS.find((r) => r.name === selected) ?? null

  return (
    <TeacherShowcaseShell
      heading="See who&rsquo;s reading and who&rsquo;s stuck."
      subcopy="Real-time view of which chapter every student is on, time spent reading, last active, and which Trials are tripping the class up. Identify struggling readers before the test, not after."
      layout="mockup-left"
      bgClass="bg-background"
      paddingClass="py-20"
    >
      <DemoFrame
        ariaLabel="Interactive class progress heatmap"
        hint="Tap a reader"
        onReset={selected !== "Aurelius T." ? () => setSelected("Aurelius T.") : undefined}
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-3">
          AP Literature &middot; The Odyssey
        </p>

        {/* Heatmap */}
        <div className="space-y-1 mb-4">
          <div className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 text-[8px] text-muted-foreground tabular-nums">
            <span />
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <span key={n} className="text-center">
                Bk {n}
              </span>
            ))}
          </div>
          {READERS.map((r) => {
            const active = selected === r.name
            return (
              <button
                key={r.name}
                type="button"
                aria-pressed={active}
                onClick={() => setSelected(active ? null : r.name)}
                className={`grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 items-center w-full rounded-md px-1 py-0.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active ? "bg-primary/5 ring-1 ring-primary/30" : "hover:bg-muted"
                }`}
              >
                <span className="text-[10px] text-foreground truncate text-left flex items-center gap-1">
                  {r.flag && <Flag className="size-2.5 text-amber-500 shrink-0" />}
                  {r.name}
                </span>
                {r.progress.map((v, j) => (
                  <span key={j} className={`h-3 rounded-sm ${CELL_COLOR(v)}`} />
                ))}
              </button>
            )
          })}
        </div>

        {/* Inspector */}
        <AnimatePresence mode="wait">
          {reader ? (
            <motion.div
              key={reader.name}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: EASE }}
              className={`rounded-lg border p-3 ${
                reader.flag
                  ? "border-amber-500/30 bg-amber-500/5"
                  : "border-border bg-muted/40"
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-sm font-semibold text-foreground">
                  {reader.name}
                </span>
                {reader.flag && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <Flag className="size-3" />
                    Needs attention
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <BookMarked className="size-3" />
                  {currentBook(reader.progress)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3" />
                  Last active {reader.lastActive}
                </span>
              </div>
              {reader.flag && (
                <p className="mt-2 text-[11px] text-amber-700 dark:text-amber-300">
                  {reader.flag}
                </p>
              )}
            </motion.div>
          ) : (
            <motion.p
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-dashed border-border p-3 text-center text-[11px] text-muted-foreground"
            >
              Tap any reader to see where they are and when they were last active.
            </motion.p>
          )}
        </AnimatePresence>
      </DemoFrame>
    </TeacherShowcaseShell>
  )
}
