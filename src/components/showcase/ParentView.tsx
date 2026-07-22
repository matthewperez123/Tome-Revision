"use client"

/**
 * ParentView — the seeded weekly summary.
 *
 * Fixed demo data (src/lib/showcase/demo-data.ts): a week of reading
 * minutes, the current book's status, the Flame, the Seal in progress, and
 * a privacy-safe summary that says plainly what parents do NOT see.
 */

import { FlameMeter, SealMedallion, WisdomChip } from "@/components/rewards"
import { getBookExperience } from "@/lib/books/registry"
import {
  DEMO_CHILD,
  DEMO_CHILD_BOOK,
  DEMO_WEEK_MINUTES,
  PARENT_PRIVACY_NOTE,
} from "@/lib/showcase/demo-data"

export function ParentView() {
  const maxMinutes = Math.max(...DEMO_WEEK_MINUTES.map((d) => d.minutes), 1)
  const total = DEMO_WEEK_MINUTES.reduce((n, d) => n + d.minutes, 0)
  const sealName = getBookExperience("macbeth")?.sealName ?? "The Dagger in the Dark"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-parent)]">
            Parent view · seeded family link
          </p>
          <h2 className="mt-1 font-serif text-2xl text-[var(--la-ink)]">
            {DEMO_CHILD.name}’s week
          </h2>
          <p className="mt-0.5 font-sans text-xs text-[var(--la-ink-faint)]">{DEMO_CHILD.weekLabel}</p>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] px-4 py-2">
          <WisdomChip amount={DEMO_CHILD_BOOK.wisdomThisWeek} size="sm" />
          <FlameMeter state="secured" days={7} size="sm" />
        </div>
      </div>

      {/* weekly minutes */}
      <section
        aria-label={`Reading minutes this week — ${total} minutes total`}
        className="rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-5"
      >
        <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--la-ink-faint)]">
          Reading time · {total} min this week
        </p>
        <div className="mt-4 flex h-28 items-end gap-2">
          {DEMO_WEEK_MINUTES.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center gap-1">
              <span className="font-mono text-[10px] text-[var(--la-ink-faint)]">
                {d.minutes > 0 ? d.minutes : ""}
              </span>
              <div
                role="img"
                aria-label={`${d.day}: ${d.minutes} minutes`}
                className="w-full max-w-10 rounded-t-md"
                style={{
                  height: `${Math.max(4, (d.minutes / maxMinutes) * 76)}px`,
                  background: d.minutes > 0 ? "var(--la-wisdom)" : "var(--la-surface-sunken)",
                }}
              />
              <span className="font-sans text-[10px] text-[var(--la-ink-muted)]">{d.day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* book status + seal */}
      <div className="grid gap-4 @md:grid-cols-2">
        <section
          aria-label="Current book"
          className="rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-5"
        >
          <p className="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-[var(--la-ink-faint)]">
            Now reading
          </p>
          <h3 className="mt-1 font-serif text-lg text-[var(--la-ink)]">{DEMO_CHILD_BOOK.title}</h3>
          <p className="font-sans text-sm text-[var(--la-ink-muted)]">{DEMO_CHILD_BOOK.status}</p>
          <div className="mt-3">
            <div className="flex justify-between font-sans text-[11px] text-[var(--la-ink-faint)]">
              <span>{DEMO_CHILD_BOOK.currentPlace}</span>
              <span>{DEMO_CHILD_BOOK.progressPct}%</span>
            </div>
            <span aria-hidden className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[var(--la-surface-sunken)]">
              <span
                className="block h-full rounded-full bg-[var(--la-primary)]"
                style={{ width: `${DEMO_CHILD_BOOK.progressPct}%` }}
              />
            </span>
          </div>
          <p className="mt-3 font-sans text-xs text-[var(--la-ink-muted)]">
            {DEMO_CHILD_BOOK.trialsPassed} Trials passed · {DEMO_CHILD_BOOK.wisdomThisWeek} Wisdom this week
          </p>
        </section>

        <section
          aria-label="Seal in progress"
          className="flex flex-col items-center justify-center rounded-xl border border-[var(--la-surface-sunken)] bg-[var(--la-page)] p-5 text-center"
        >
          <SealMedallion sealId="macbeth" name={sealName} size={84} state="locked" />
          <p className="mt-2 max-w-56 font-sans text-xs text-[var(--la-ink-muted)]">
            The {sealName} seal unlocks when every chapter is read and every
            Trial passed — never bought, never rushed.
          </p>
        </section>
      </div>

      {/* privacy */}
      <p
        data-tour="parent-privacy"
        className="rounded-xl border border-[var(--la-parent)]/30 bg-[var(--la-parent-soft)] p-4 font-sans text-sm leading-relaxed text-[var(--la-ink)]"
      >
        <strong className="font-semibold">What this view never shows. </strong>
        {PARENT_PRIVACY_NOTE}
      </p>

      <p className="font-sans text-[11px] text-[var(--la-ink-faint)]">
        Showcase data: one seeded learner, a fixed week, no real family account.
      </p>
    </div>
  )
}
