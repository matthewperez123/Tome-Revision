"use client"

/**
 * TeacherView — the seeded classroom dashboard.
 *
 * Fixed demo roster (src/lib/showcase/demo-data.ts): assignment status,
 * completion, mastery, Flame, and the students who need help — surfaced
 * first, each with a concrete next step. Includes one teacher-review
 * thread, a REAL CSV export (generated locally from the same fixture), and
 * an "Assign next chapter" action that stages the next seeded assignment.
 * Clearly labeled as showcase data; nothing writes to Supabase.
 */

import { useState } from "react"
import { FlameMeter } from "@/components/rewards"
import { useShowcaseState } from "@/lib/showcase/store"
import {
  buildAssignmentCsv,
  DEMO_ASSIGNMENT,
  DEMO_REVIEW,
  DEMO_STUDENTS,
} from "@/lib/showcase/demo-data"

export function TeacherView() {
  const { nextChapterAssigned, update } = useShowcaseState()
  const [exported, setExported] = useState(false)

  const sorted = [...DEMO_STUDENTS].sort((a, b) => Number(b.needsHelp) - Number(a.needsHelp))
  const avgCompletion = Math.round(
    DEMO_STUDENTS.reduce((n, s) => n + s.completion, 0) / DEMO_STUDENTS.length,
  )
  const avgMastery = Math.round(
    DEMO_STUDENTS.filter((s) => s.mastery > 0).reduce((n, s) => n + s.mastery, 0) /
      DEMO_STUDENTS.filter((s) => s.mastery > 0).length,
  )

  const exportCsv = () => {
    const csv = buildAssignmentCsv(DEMO_STUDENTS)
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tome-showcase-macbeth-act-i-roster.csv"
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    setExported(true)
    window.setTimeout(() => setExported(false), 2200)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-teacher)]">
            Teacher view · seeded classroom
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[var(--la-ink)]">{DEMO_ASSIGNMENT.title}</h2>
          <p className="mt-0.5 font-sans text-xs text-[var(--la-ink-faint)]">
            {DEMO_ASSIGNMENT.chapterTarget} · {DEMO_ASSIGNMENT.assignedLabel} · {DEMO_ASSIGNMENT.dueLabel}
          </p>
        </div>
        <div className="flex gap-4 rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] px-4 py-2 text-center">
          <div>
            <p className="font-mono text-lg font-bold text-[var(--la-ink)]">{avgCompletion}%</p>
            <p className="font-sans text-[10px] uppercase tracking-wide text-[var(--la-ink-faint)]">completion</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold text-[var(--la-ink)]">{avgMastery}%</p>
            <p className="font-sans text-[10px] uppercase tracking-wide text-[var(--la-ink-faint)]">mastery</p>
          </div>
          <div>
            <p className="font-mono text-lg font-bold text-[var(--la-flame-deep)]">
              {DEMO_STUDENTS.filter((s) => s.needsHelp).length}
            </p>
            <p className="font-sans text-[10px] uppercase tracking-wide text-[var(--la-ink-faint)]">need help</p>
          </div>
        </div>
      </div>

      {/* roster */}
      <div data-tour="teacher-table" className="overflow-x-auto rounded-xl border border-[var(--la-surface-sunken)]">
        <table className="w-full min-w-[560px] border-collapse bg-[var(--la-surface)] text-left">
          <caption className="sr-only">
            Seeded roster for {DEMO_ASSIGNMENT.title}: completion, mastery, flame, and who needs help
          </caption>
          <thead>
            <tr className="border-b border-[var(--la-surface-sunken)] bg-[var(--la-page)]">
              {["Student", "Completion", "Mastery", "Flame", "Last active", "Signal"].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="px-4 py-2.5 font-sans text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--la-ink-faint)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr
                key={s.id}
                className={`border-b border-[var(--la-surface-sunken)] last:border-0 ${
                  s.needsHelp ? "bg-[var(--la-flame-soft)]/40" : ""
                }`}
              >
                <th scope="row" className="px-4 py-3 font-sans text-sm font-semibold text-[var(--la-ink)]">
                  {s.name}
                </th>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-1.5 w-20 overflow-hidden rounded-full bg-[var(--la-surface-sunken)]"
                    >
                      <span
                        className="block h-full rounded-full bg-[var(--la-primary)]"
                        style={{ width: `${s.completion}%` }}
                      />
                    </span>
                    <span className="font-mono text-xs text-[var(--la-ink-muted)]">{s.completion}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-[var(--la-ink-muted)]">
                  {s.mastery > 0 ? `${s.mastery}%` : "—"}
                </td>
                <td className="px-4 py-3">
                  <FlameMeter state={s.flameDays > 0 ? "secured" : "unlit"} days={s.flameDays} size="sm" />
                </td>
                <td className="px-4 py-3 font-sans text-xs text-[var(--la-ink-muted)]">{s.lastActive}</td>
                <td className="px-4 py-3 font-sans text-xs">
                  {s.needsHelp ? (
                    <span className="font-semibold text-[var(--la-flame-deep)]">{s.helpNote}</span>
                  ) : (
                    <span className="text-[var(--la-ink-faint)]">On track</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* teacher review */}
      <section
        aria-label="Teacher review — one reflection"
        className="rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-5"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--la-teacher)]">
          Teacher review · {DEMO_REVIEW.submittedLabel}
        </p>
        <p className="mt-1 font-sans text-xs text-[var(--la-ink-faint)]">
          {DEMO_REVIEW.student} on: “{DEMO_REVIEW.prompt}”
        </p>
        <blockquote className="mt-2 border-l-2 border-[var(--la-teacher)] pl-3 font-serif text-sm leading-relaxed text-[var(--la-ink)]">
          {DEMO_REVIEW.response}
        </blockquote>
        <div className="mt-3 rounded-lg bg-[var(--la-teacher-soft)] p-3">
          <p className="font-sans text-[11px] font-semibold text-[var(--la-teacher)]">
            {DEMO_REVIEW.teacherReply.author} · {DEMO_REVIEW.teacherReply.label}
          </p>
          <p className="mt-1 font-sans text-sm leading-relaxed text-[var(--la-ink)]">
            {DEMO_REVIEW.teacherReply.body}
          </p>
        </div>
      </section>

      {/* actions */}
      <div data-tour="teacher-csv" className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-full bg-[var(--la-primary)] px-5 py-2 font-sans text-sm font-semibold text-[var(--la-primary-ink)] hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
        >
          {exported ? "CSV downloaded ✓" : "Export roster CSV"}
        </button>
        <button
          type="button"
          disabled={nextChapterAssigned}
          onClick={() => update({ nextChapterAssigned: true })}
          title={nextChapterAssigned ? "Already staged" : "Stage the next seeded assignment"}
          className="rounded-full border border-[var(--la-primary)] px-5 py-2 font-sans text-sm font-semibold text-[var(--la-primary)] hover:bg-[var(--la-primary-soft)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {nextChapterAssigned ? "Act II assigned ✓" : "Assign next chapter →"}
        </button>
        {nextChapterAssigned && (
          <p aria-live="polite" className="font-sans text-xs text-[var(--la-ink-muted)]">
            “Macbeth — Act II” staged for Monday (seeded demo assignment — no real classroom writes).
          </p>
        )}
      </div>

      <p className="font-sans text-[11px] text-[var(--la-ink-faint)]">
        Showcase data: five seeded students, fixed scores, no real classroom.
      </p>
    </div>
  )
}
