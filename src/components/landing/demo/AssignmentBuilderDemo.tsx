"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import {
  BookOpen,
  CheckSquare,
  MessageCircle,
  PenLine,
  Highlighter,
  Check,
} from "lucide-react"
import { DemoFrame } from "@/components/demo/DemoFrame"
import { TeacherShowcaseShell } from "../teacher/TeacherShowcaseShell"

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const TYPES = [
  { key: "reading", label: "Reading", Icon: BookOpen },
  { key: "trial", label: "Trial", Icon: CheckSquare },
  { key: "discussion", label: "Discussion", Icon: MessageCircle },
  { key: "essay", label: "Essay", Icon: PenLine },
  { key: "annotation", label: "Annotation", Icon: Highlighter },
] as const

type TypeKey = (typeof TYPES)[number]["key"]

const CHAPTERS = [
  "Book I: Athena Inspires the Prince",
  "Book II: Telemachus Sets Sail",
  "Book III: King Nestor Remembers",
  "Book IV: The King and Queen of Sparta",
]

const DUE_DATES = ["Mar 15, 2026", "Mar 22, 2026", "Apr 1, 2026"]

export function AssignmentBuilderDemo() {
  const [type, setType] = useState<TypeKey>("trial")
  const [chapters, setChapters] = useState<Set<number>>(new Set([0, 1]))
  const [due, setDue] = useState(DUE_DATES[0])
  const [created, setCreated] = useState(false)

  const dirty =
    type !== "trial" ||
    chapters.size !== 2 ||
    !chapters.has(0) ||
    !chapters.has(1) ||
    due !== DUE_DATES[0] ||
    created

  const reset = () => {
    setType("trial")
    setChapters(new Set([0, 1]))
    setDue(DUE_DATES[0])
    setCreated(false)
  }

  const toggleChapter = (i: number) => {
    setCreated(false)
    setChapters((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  const typeLabel = TYPES.find((t) => t.key === type)!.label
  const canCreate = chapters.size > 0

  return (
    <TeacherShowcaseShell
      heading="Assign chapters, Trials, and reflections."
      subcopy="Five assignment types &mdash; chapter readings, Trials, Virgil-graded reflections, annotation prompts, and quote collections. Set due dates, scope to a class or a student, attach a rubric."
      layout="mockup-right"
      bgClass="bg-muted"
      paddingClass="py-20"
    >
      <DemoFrame
        ariaLabel="Interactive assignment builder"
        hint="Build one"
        onReset={dirty ? reset : undefined}
      >
        <p className="text-sm font-semibold text-foreground mb-3">
          New Assignment
        </p>

        {/* Type picker */}
        <div className="mb-4 grid grid-cols-5 gap-1.5" role="group" aria-label="Assignment type">
          {TYPES.map((t) => {
            const active = type === t.key
            return (
              <button
                key={t.key}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setType(t.key)
                  setCreated(false)
                }}
                className={`rounded-md border px-1.5 py-1.5 flex flex-col items-center gap-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  active
                    ? "border-primary/50 bg-primary/10"
                    : "border-border hover:border-primary/40"
                }`}
              >
                <t.Icon
                  className={`size-3.5 ${active ? "text-primary" : "text-muted-foreground"}`}
                />
                <span
                  className={`text-[9px] font-medium leading-none ${
                    active ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t.label}
                </span>
              </button>
            )
          })}
        </div>

        {/* Book (fixed for the demo) */}
        <div className="flex items-center gap-3 mb-4">
          <div className="size-10 rounded bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-serif font-bold text-primary">
            O
          </div>
          <div className="min-w-0">
            <p className="text-sm text-foreground font-medium leading-tight">
              The Odyssey
            </p>
            <p className="text-[11px] text-muted-foreground">Homer</p>
          </div>
        </div>

        {/* Chapter checkboxes */}
        <div className="space-y-2 mb-4">
          {CHAPTERS.map((ch, i) => {
            const checked = chapters.has(i)
            return (
              <button
                key={ch}
                type="button"
                aria-pressed={checked}
                onClick={() => toggleChapter(i)}
                className="flex items-center gap-2 text-xs text-left w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
              >
                <span
                  className={`size-4 rounded flex items-center justify-center shrink-0 border-[1.5px] transition-colors ${
                    checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border"
                  }`}
                >
                  {checked && <Check className="size-3" strokeWidth={3} />}
                </span>
                <span className={checked ? "text-foreground" : "text-muted-foreground"}>
                  {ch}
                </span>
              </button>
            )
          })}
        </div>

        {/* Due date */}
        <div className="mb-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
            Due date
          </p>
          <div className="flex flex-wrap gap-1.5">
            {DUE_DATES.map((d) => {
              const active = due === d
              return (
                <button
                  key={d}
                  type="button"
                  aria-pressed={active}
                  onClick={() => {
                    setDue(d)
                    setCreated(false)
                  }}
                  className={`rounded-md border px-2.5 py-1 text-[11px] font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    active
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>

        {/* Create */}
        <button
          type="button"
          disabled={!canCreate}
          onClick={() => setCreated(true)}
          className="bg-primary text-primary-foreground rounded-lg px-4 py-2 text-sm font-semibold transition-opacity disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {created ? "Assignment created" : "Create assignment"}
        </button>

        <AnimatePresence>
          {created && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mt-3 flex items-start gap-2 rounded-lg border border-[var(--codex-success-edge)] bg-[var(--codex-success-soft)] px-3 py-2"
            >
              <Check className="size-3.5 mt-0.5 text-[var(--codex-success-text)] shrink-0" strokeWidth={3} />
              <p className="text-[11px] text-[var(--codex-success-text)] leading-relaxed">
                {typeLabel} assigned to AP Literature &middot; {chapters.size}{" "}
                chapter{chapters.size !== 1 ? "s" : ""} &middot; due {due}.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DemoFrame>
    </TeacherShowcaseShell>
  )
}
