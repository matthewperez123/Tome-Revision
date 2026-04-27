"use client"

import { Flag } from "lucide-react"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const STUDENTS = [
  "Marcus A.", "Livia C.", "Aurelius T.", "Helena P.",
  "Cassius D.", "Diana M.", "Octavia R.", "Felix B.",
]

// 8 students × 6 chapters; values: 0=none, 1=started, 2=halfway, 3=complete
const HEATMAP: number[][] = [
  [3, 3, 3, 2, 1, 0],
  [3, 3, 2, 1, 0, 0],
  [3, 2, 1, 0, 0, 0],
  [3, 3, 3, 3, 3, 2],
  [3, 3, 2, 2, 1, 0],
  [3, 3, 3, 2, 2, 1],
  [3, 2, 1, 1, 0, 0],
  [3, 3, 3, 3, 2, 1],
]

const CELL_COLOR = (v: number) => {
  if (v === 0) return "bg-muted"
  if (v === 1) return "bg-indigo-500/20"
  if (v === 2) return "bg-indigo-500/55"
  return "bg-indigo-500"
}

const NEEDS_ATTENTION = [
  { name: "Aurelius T.", reason: "No activity in 5 days" },
  { name: "Cassius D.", reason: "Failed Book III Trial twice" },
]

export function ClassProgressShowcase() {
  return (
    <TeacherShowcaseShell
      heading="See who&rsquo;s reading and who&rsquo;s stuck."
      subcopy="Real-time view of which chapter every student is on, time spent reading, last active, and which Trials are tripping the class up. Identify struggling readers before the test, not after."
      layout="mockup-left"
      bgClass="bg-background"
      paddingClass="py-20"
    >
      <div
        className="bg-card rounded-xl border border-border p-5 min-h-[280px]"
        aria-label="Class progress heatmap"
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-3">
          AP Literature &middot; The Odyssey
        </p>

        {/* Heatmap */}
        <div className="space-y-1 mb-4">
          {/* Header */}
          <div className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 text-[8px] text-muted-foreground tabular-nums">
            <span />
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <span key={n} className="text-center">Bk {n}</span>
            ))}
          </div>
          {STUDENTS.map((s, i) => (
            <div
              key={s}
              className="grid grid-cols-[80px_repeat(6,minmax(0,1fr))] gap-1 items-center"
            >
              <span className="text-[10px] text-foreground truncate">{s}</span>
              {HEATMAP[i].map((v, j) => (
                <span
                  key={j}
                  className={`h-3 rounded-sm ${CELL_COLOR(v)}`}
                />
              ))}
            </div>
          ))}
        </div>

        {/* Needs attention */}
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
            <Flag className="size-3" />
            Needs attention
          </p>
          <div className="space-y-1.5">
            {NEEDS_ATTENTION.map((s) => (
              <div key={s.name} className="flex items-center justify-between gap-2 text-[11px]">
                <span className="text-foreground font-medium">{s.name}</span>
                <span className="text-muted-foreground">{s.reason}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
