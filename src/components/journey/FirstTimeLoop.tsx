"use client"

/**
 * FirstTimeLoop — the loop explained by DOING.
 *
 * One guided tap-through for a first visit: read → trial → wisdom → flame →
 * seal → stoa. Every step's button performs the real micro-action (completes
 * the current path node, grants Trial Wisdom, secures the hearth) so the
 * page itself teaches the loop — no slides, no long tour. Skippable at any
 * step; completion and skip both persist in the journey showcase store, so
 * the loop never nags a second time.
 *
 * The current target gets a soft pulsing outline; reduced motion renders a
 * steady ring (motion-safe only). Escape skips the loop.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { WISDOM_AWARDS } from "@/lib/game/economy"
import { SEEDED_CURRENT_NODE_ID } from "@/lib/journey/macbeth-path"
import { useJourneyState } from "@/lib/journey/state"

interface LoopStep {
  id: string
  /** data-loop-target value to spotlight, if any. */
  target?: string
  eyebrow: string
  title: string
  body: string
  actionLabel: string
}

const STEPS: readonly LoopStep[] = [
  {
    id: "read",
    target: "path",
    eyebrow: "Read",
    title: "Reading moves you along the path",
    body:
      "Every book is a walked path of days and scenes. Take today's step now — " +
      "watch the next node wake up.",
    actionLabel: "Read today's pages",
  },
  {
    id: "trial",
    target: "trial",
    eyebrow: "Trial",
    title: "Trials prove the reading",
    body:
      "Short, kind challenges from the text itself — hints are free and never " +
      "shame. Passing one pays real Wisdom.",
    actionLabel: `Pass a Trial · +${WISDOM_AWARDS["trial-complete"]} Wisdom`,
  },
  {
    id: "wisdom",
    target: "wisdom",
    eyebrow: "Wisdom",
    title: "Wisdom compounds",
    body:
      "Wisdom is earned by reading and proving, never bought. It raises your " +
      "level and opens new shelves of the Archive.",
    actionLabel: `Take the Wisdom · +${WISDOM_AWARDS["trial-no-hints"]}`,
  },
  {
    id: "flame",
    target: "flame",
    eyebrow: "Flame",
    title: "The Flame is a hearth, not a whip",
    body:
      "One page a day keeps the hearth warm. Missed days spend pre-granted " +
      "freeze days — it keeps no grudge and never asks why.",
    actionLabel: "Secure today's hearth",
  },
  {
    id: "seal",
    target: "seal",
    eyebrow: "Seal",
    title: "Seals mark mastery",
    body:
      "Finish every chapter and pass every Trial in a book and its Seal is " +
      "yours — completion and understanding, never flawlessness.",
    actionLabel: "See the Seal goal",
  },
  {
    id: "stoa",
    target: "stoa",
    eyebrow: "Stoa",
    title: "The Stoa remembers",
    body:
      "Each passed Trial restores a painting to your courtyard — the visible, " +
      "permanent record of your reading. That is the whole loop.",
    actionLabel: "Finish the loop",
  },
]

interface Rect {
  top: number
  left: number
  width: number
  height: number
}

interface MeasuredTarget {
  target: string
  rect: Rect
}

function useTargetRect(target: string | undefined, stepIndex: number, open: boolean): Rect | null {
  const [measured, setMeasured] = useState<MeasuredTarget | null>(null)

  useEffect(() => {
    if (!open || !target) return
    let cancelled = false
    const measure = () => {
      const el = document.querySelector(`[data-loop-target="${target}"]`)
      if (!el || cancelled) return
      const box = el.getBoundingClientRect()
      setMeasured({
        target,
        rect: {
          top: box.top + window.scrollY,
          left: box.left + window.scrollX,
          width: box.width,
          height: box.height,
        },
      })
    }
    // Measure via frame callbacks so the effect body stays an external sync.
    const schedule = () => {
      window.requestAnimationFrame(measure)
    }
    schedule()
    window.addEventListener("resize", schedule)
    window.addEventListener("scroll", schedule, true)
    return () => {
      cancelled = true
      window.removeEventListener("resize", schedule)
      window.removeEventListener("scroll", schedule, true)
    }
  }, [target, stepIndex, open])

  // Ignore stale measurements from an earlier step/target.
  if (!open || !target || !measured || measured.target !== target) return null
  return measured.rect
}

export function FirstTimeLoop() {
  const { loop, completeLoop, skipLoop, completeNode, grantWisdom, secureFlame } =
    useJourneyState()
  const open = loop === "new"
  const [stepIndex, setStepIndex] = useState(0)
  const step = STEPS[Math.min(stepIndex, STEPS.length - 1)]!
  const rect = useTargetRect(step.target, stepIndex, open)
  const actionRef = useRef<HTMLButtonElement | null>(null)

  // Move keyboard focus into the dialog when a step begins.
  useEffect(() => {
    if (open) actionRef.current?.focus()
  }, [open, stepIndex])

  const handleEscape = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape" && open) skipLoop()
    },
    [open, skipLoop],
  )

  useEffect(() => {
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [handleEscape])

  if (!open) return null

  const advance = () => setStepIndex((index) => Math.min(index + 1, STEPS.length - 1))

  const handleAction = () => {
    switch (step.id) {
      case "read":
        completeNode(SEEDED_CURRENT_NODE_ID)
        advance()
        break
      case "trial":
        grantWisdom(WISDOM_AWARDS["trial-complete"])
        advance()
        break
      case "wisdom":
        grantWisdom(WISDOM_AWARDS["trial-no-hints"])
        advance()
        break
      case "flame":
        secureFlame()
        advance()
        break
      case "seal":
        advance()
        break
      case "stoa":
        completeLoop()
        break
    }
  }

  return (
    <>
      {/* spotlight ring on the step's target */}
      {rect && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-30 rounded-[var(--la-radius-l)] motion-safe:animate-pulse"
          style={{
            top: rect.top - 6,
            left: rect.left - 6,
            width: rect.width + 12,
            height: rect.height + 12,
            boxShadow:
              "0 0 0 3px var(--la-wisdom), 0 0 0 8px color-mix(in srgb, var(--la-wisdom) 25%, transparent)",
          }}
        />
      )}

      <div
        role="dialog"
        aria-modal="false"
        aria-label={`First visit guide, step ${stepIndex + 1} of ${STEPS.length}: ${step.eyebrow}`}
        className="fixed inset-x-3 bottom-20 z-50 rounded-[var(--la-radius-l)] border border-[var(--la-surface-sunken)] bg-[var(--la-surface-raised)] p-5 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-96"
        style={{ boxShadow: "var(--la-shadow-float)" }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--la-wisdom-deep)]">
            {step.eyebrow} · Step {stepIndex + 1} of {STEPS.length}
          </p>
          <button
            type="button"
            onClick={skipLoop}
            className="rounded text-xs text-[var(--la-ink-faint)] underline-offset-4 hover:text-[var(--la-ink-muted)] hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
          >
            Skip tour
          </button>
        </div>

        <h2 className="mt-2 text-lg font-bold tracking-tight text-[var(--la-ink)]">
          {step.title}
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-[var(--la-ink-muted)]">
          {step.body}
        </p>

        {/* progress dots */}
        <div className="mt-3 flex gap-1.5" aria-hidden="true">
          {STEPS.map((s, index) => (
            <span
              key={s.id}
              className="h-1.5 flex-1 rounded-full"
              style={{
                backgroundColor:
                  index <= stepIndex ? "var(--la-wisdom)" : "var(--la-surface-sunken)",
              }}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            ref={actionRef}
            type="button"
            onClick={handleAction}
            className="inline-flex h-11 items-center rounded-[var(--la-radius-m)] px-5 text-sm font-semibold text-[var(--la-primary-ink)] outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface-raised)]"
            style={{
              backgroundColor: "var(--la-primary)",
              boxShadow: "0 3px 0 var(--la-primary-edge)",
            }}
          >
            {step.actionLabel}
          </button>
          {step.id === "stoa" && (
            <Link
              href="/stoa"
              className="rounded text-sm font-medium text-[var(--la-primary)] underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
            >
              Peek at the Stoa first →
            </Link>
          )}
        </div>
      </div>
    </>
  )
}
