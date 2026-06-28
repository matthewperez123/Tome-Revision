"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Lock } from "lucide-react"
import { IRIDESCENT } from "@/lib/semester-plan/rubric"
import type { Hint } from "@/lib/quiz-hints"

/**
 * Single-hint affordance — a Virgil surface, so it carries the iridescent
 * treatment (reserved for Virgil). Each question has one hint; revealing it
 * spends one from the attempt-wide hint pool (a consumable budget, like hearts).
 * MC distractor elimination is driven separately by `revealed` in the parent.
 *
 * Hint text is Literata (--font-serif); it is reading. Labels use the app sans.
 */
export interface HintPanelProps {
  /** The question's single hint, or null if none authored. */
  hint: Hint | null
  /** Whether this question's hint has been revealed. */
  revealed: boolean
  /** Spend one hint from the pool and reveal; the parent tracks usage. */
  onReveal: () => void
  /** Friction gate — affordance is inert until the student has had a beat. */
  unlocked: boolean
  /** Hints left in the attempt-wide pool. */
  hintsRemaining: number
  /** Total pool size, for the heart-style pip display. */
  hintBudget: number
  /** Soft point cost per revealed hint, for the pre-reveal cost preview. */
  pointPenalty: number
  reduced?: boolean
}

export function HintPanel({
  hint,
  revealed,
  onReveal,
  unlocked,
  hintsRemaining,
  hintBudget,
  pointPenalty,
  reduced = false,
}: HintPanelProps) {
  if (!hint) return null
  const depleted = hintsRemaining <= 0
  const costLabel =
    pointPenalty > 0 ? `−${pointPenalty % 1 === 0 ? pointPenalty : pointPenalty.toFixed(1)} pt` : null

  return (
    <div className="mt-6">
      <AnimatePresence initial={false}>
        {revealed && (
          <motion.div
            key="hint"
            initial={reduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-2.5 overflow-hidden rounded-[var(--codex-radius-card)] bg-card"
            style={{
              border: "2px solid transparent",
              backgroundImage: `linear-gradient(var(--card), var(--card)), ${IRIDESCENT}`,
              backgroundOrigin: "border-box",
              backgroundClip: "padding-box, border-box",
            }}
          >
            <div className="p-3.5">
              <div className="mb-1 flex items-center gap-1.5">
                <span
                  className="inline-flex size-5 items-center justify-center rounded-md text-white"
                  style={{ background: IRIDESCENT }}
                >
                  <Sparkles className="size-3" />
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground font-sans">
                  Hint
                </span>
              </div>
              <p className="font-serif text-sm leading-relaxed text-foreground">{hint.text}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!revealed && (
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={unlocked && !depleted ? onReveal : undefined}
            disabled={!unlocked || depleted}
            className="inline-flex items-center gap-2 rounded-[var(--codex-radius-btn)] px-3.5 py-2 text-sm font-semibold text-white transition-opacity disabled:opacity-40 font-sans"
            style={{ background: IRIDESCENT }}
            aria-label="Need a hint?"
          >
            {unlocked && !depleted ? <Sparkles className="size-4" /> : <Lock className="size-4" />}
            Need a hint?
          </button>
          <div className="flex items-center gap-2">
            {/* Heart-style budget pips — filled sparkles for hints still available. */}
            <span
              className="flex items-center gap-0.5"
              aria-label={`${hintsRemaining} of ${hintBudget} hints left`}
            >
              {Array.from({ length: hintBudget }).map((_, i) => (
                <Sparkles
                  key={i}
                  className="size-3.5"
                  style={{
                    color: i < hintsRemaining ? "var(--codex-primary, #6C63FF)" : "var(--muted-foreground)",
                    opacity: i < hintsRemaining ? 1 : 0.3,
                  }}
                />
              ))}
            </span>
            {costLabel && (
              <span className="text-[11px] text-muted-foreground font-sans">{costLabel}</span>
            )}
          </div>
        </div>
      )}

      {!revealed && !unlocked && (
        <p className="mt-1 text-[11px] text-muted-foreground font-sans">Take a moment first…</p>
      )}
      {!revealed && unlocked && depleted && (
        <p className="mt-1 text-[11px] text-muted-foreground font-sans">No hints left</p>
      )}
    </div>
  )
}
