"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { Sparkles, Check, Pencil } from "lucide-react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

interface Detail {
  virgilChats: string
  readingTime: string
  annotations: string
  /** Virgil's drafted reflection score, out of 4. */
  rubricDraft: number
  rubricNote: string
}

interface Student {
  name: string
  t1: number
  t2: number
  avg: number
  detail: Detail
}

const STUDENTS: Student[] = [
  {
    name: "Marcus A.",
    t1: 92,
    t2: 88,
    avg: 90,
    detail: {
      virgilChats: "9",
      readingTime: "3.6h",
      annotations: "6",
      rubricDraft: 4,
      rubricNote: "Cites the loom passage; strong on Penelope's cunning.",
    },
  },
  {
    name: "Livia C.",
    t1: 85,
    t2: 91,
    avg: 88,
    detail: {
      virgilChats: "12",
      readingTime: "4.2h",
      annotations: "8",
      rubricDraft: 3,
      rubricNote: "Clear thesis on hospitality; thin textual evidence.",
    },
  },
  {
    name: "Aurelius T.",
    t1: 78,
    t2: 82,
    avg: 80,
    detail: {
      virgilChats: "4",
      readingTime: "1.9h",
      annotations: "2",
      rubricDraft: 2,
      rubricNote: "Summarizes plot; little analysis of theme yet.",
    },
  },
  {
    name: "Helena P.",
    t1: 95,
    t2: 97,
    avg: 96,
    detail: {
      virgilChats: "15",
      readingTime: "5.1h",
      annotations: "11",
      rubricDraft: 4,
      rubricNote: "Connects nostos to identity across three books.",
    },
  },
]

function ScoreCell({ value }: { value: number }) {
  return (
    <span
      className={`text-sm font-mono ${value >= 90 ? "text-emerald-500" : "text-foreground"}`}
    >
      {value}
    </span>
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
          className="h-1.5 rounded-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width }}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
        />
      </div>
    </div>
  )
}

function ReflectionRubric({ detail }: { detail: Detail }) {
  const [decision, setDecision] = useState<"pending" | "accepted" | "override">(
    "pending",
  )
  const [score, setScore] = useState(detail.rubricDraft)

  return (
    <div className="mt-2 rounded-lg border border-primary/20 bg-background p-3">
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles className="size-3 text-primary" />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-primary">
          Virgil rubric draft
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed mb-2.5">
        &ldquo;{detail.rubricNote}&rdquo;
      </p>

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-muted-foreground">Reflection</span>
          {decision === "override" ? (
            <div className="inline-flex items-center gap-0.5" role="group" aria-label="Override score">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  aria-pressed={score === n}
                  onClick={() => setScore(n)}
                  className={`size-5 rounded text-[10px] font-mono font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    score === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          ) : (
            <span className="text-sm font-mono font-bold text-foreground">
              {score}/4
            </span>
          )}
        </div>

        {decision === "accepted" ? (
          <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[var(--codex-success-text)]">
            <Check className="size-3" strokeWidth={3} />
            Recorded
          </span>
        ) : (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setDecision("accepted")}
              className="inline-flex items-center gap-1 rounded-md border border-[var(--codex-success-edge)] bg-[var(--codex-success-soft)] px-2 py-1 text-[10px] font-semibold text-[var(--codex-success-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Check className="size-3" strokeWidth={3} />
              Accept
            </button>
            <button
              type="button"
              onClick={() =>
                setDecision((d) => (d === "override" ? "accepted" : "override"))
              }
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[10px] font-semibold text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Pencil className="size-3" />
              {decision === "override" ? "Save" : "Override"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function GradebookDemo() {
  const [open, setOpen] = useState<string | null>("Livia C.")

  return (
    <TeacherShowcaseShell
      heading="See how they&rsquo;re really reading"
      subcopy="Scores, time on page, Virgil conversations, and annotation density &mdash; all in one gradebook."
      layout="mockup-right"
      bgClass="bg-muted"
      paddingClass="py-20"
    >
      <DemoFrame
        ariaLabel="Interactive gradebook"
        hint="Open a row"
        onReset={open !== "Livia C." ? () => setOpen("Livia C.") : undefined}
      >
        <p className="text-xs text-muted-foreground mb-4">
          Gradebook &middot; The Odyssey
        </p>

        {/* Header */}
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

        {STUDENTS.map((student) => {
          const isOpen = open === student.name
          return (
            <div key={student.name}>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : student.name)}
                className={`grid grid-cols-4 gap-2 px-2 py-1.5 w-full text-left rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  isOpen ? "bg-primary/5" : "hover:bg-muted"
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
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="bg-muted/50 rounded-lg p-3 mt-2 mb-1 mx-2 space-y-2">
                      <DetailBar
                        label="Virgil chats"
                        value={student.detail.virgilChats}
                        width="60%"
                      />
                      <DetailBar
                        label="Reading time"
                        value={student.detail.readingTime}
                        width="80%"
                      />
                      <DetailBar
                        label="Annotations"
                        value={student.detail.annotations}
                        width="45%"
                      />
                      <ReflectionRubric
                        key={student.name}
                        detail={student.detail}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </DemoFrame>
    </TeacherShowcaseShell>
  )
}
