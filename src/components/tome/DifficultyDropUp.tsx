"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { RotateCcw, X } from "lucide-react"
import type { QuizDifficulty } from "@/lib/book-progress"
import { TRIAL_TIERS } from "@/components/tome/trial-difficulty-cards"
import { springs } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"

export interface DifficultyDropUpProps {
  isOpen: boolean
  /** e.g. "Canto III" or "Fitt XXIII" — shown in the toast header. */
  unitDisplay: string
  onSelect: (tier: QuizDifficulty) => void
  onSkip: () => void
  onClose: () => void
  /** Tier to pre-focus on open (e.g. the reader's level). Defaults to Apprentice. */
  recommendedTier?: QuizDifficulty
  /** If set, surfaces a "Resume where you left off" row at the top that
   *  selects this tier. The parent decides what counts as resumable. */
  resumeTier?: QuizDifficulty | null
  /** Optional progress copy for the resume row (e.g. "Question 3 of 8"). */
  resumeCopy?: string
}

/**
 * Compact bottom sheet ("drop-up") that slides up over the reader to let
 * the user pick Apprentice / Scholar / Master before the quiz starts.
 * Replaces the full-screen difficulty page so readers stay in context.
 */
export function DifficultyDropUp({
  isOpen,
  unitDisplay,
  onSelect,
  onSkip,
  onClose,
  recommendedTier = "Apprentice",
  resumeTier = null,
  resumeCopy,
}: DifficultyDropUpProps) {
  const reduced = useReducedMotion() ?? false
  const tierBtnRefs = React.useRef<Record<QuizDifficulty, HTMLButtonElement | null>>({
    Apprentice: null,
    Scholar: null,
    Master: null,
  })

  // Close on Escape
  React.useEffect(() => {
    if (!isOpen) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [isOpen, onClose])

  // Pre-focus the recommended tier when the toast opens.
  React.useEffect(() => {
    if (!isOpen) return
    const id = window.requestAnimationFrame(() => {
      tierBtnRefs.current[recommendedTier]?.focus()
    })
    return () => window.cancelAnimationFrame(id)
  }, [isOpen, recommendedTier])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            key="difficulty-dropup-scrim"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Drop-up sheet */}
          <motion.div
            key="difficulty-dropup"
            initial={reduced ? { opacity: 0 } : { y: "100%" }}
            animate={reduced ? { opacity: 1 } : { y: 0 }}
            exit={reduced ? { opacity: 0 } : { y: "100%" }}
            transition={reduced ? { duration: 0.2 } : springs.gentle}
            className="fixed inset-x-0 bottom-0 z-50 mx-auto max-w-2xl rounded-t-2xl border border-b-0 border-border bg-background shadow-[0_-8px_40px_rgba(0,0,0,0.25)]"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a trial difficulty"
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1" aria-hidden="true">
              <span className="h-1 w-10 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-1 pb-2">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  End of {unitDisplay}
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-semibold leading-tight tracking-tight">
                  Choose your trial
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent,#6366f1)]"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Resume row — shown when a saved in-progress attempt exists */}
            {resumeTier && (
              <div className="px-3 pt-1 pb-2">
                <button
                  type="button"
                  onClick={() => onSelect(resumeTier)}
                  className={cn(
                    "group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-[background-color,border-color] duration-150",
                    "hover:bg-[var(--tome-surface-elevated)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  )}
                  style={{
                    borderColor: "rgba(212,175,55,0.45)",
                    backgroundColor: "rgba(212,175,55,0.06)",
                  }}
                  aria-label={`Resume your ${resumeTier} trial${resumeCopy ? `, ${resumeCopy}` : ""}`}
                >
                  <span
                    className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "rgba(212,175,55,0.10)" }}
                  >
                    <RotateCcw className="size-[18px]" style={{ color: "#D4AF37" }} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className="text-sm font-semibold tracking-tight"
                      style={{ color: "#D4AF37" }}
                    >
                      Resuming where you left off
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {resumeCopy ?? `${resumeTier} trial — pick up where you stopped.`}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span
                      className="block text-[10px] font-medium uppercase tracking-wider"
                      style={{ color: "#D4AF37" }}
                    >
                      Continue
                    </span>
                  </span>
                </button>
              </div>
            )}

            {/* Tier rows */}
            <ul className="px-3 pb-2">
              {TRIAL_TIERS.map((tier) => {
                const Sigil = tier.sigil
                const isRecommended = tier.key === recommendedTier
                return (
                  <li key={tier.key}>
                    <button
                      ref={(el) => {
                        tierBtnRefs.current[tier.key] = el
                      }}
                      type="button"
                      onClick={() => onSelect(tier.key)}
                      className={cn(
                        "group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-[background-color,border-color] duration-150",
                        "hover:bg-[var(--tome-surface-elevated)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
                        isRecommended && "ring-1 ring-offset-0"
                      )}
                      style={{
                        borderColor: tier.borderColor,
                        backgroundColor: "transparent",
                      }}
                      aria-label={`${tier.label}${isRecommended ? " (recommended)" : ""}: ${tier.subcopy}`}
                    >
                      <span
                        className="flex size-10 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: tier.accentBg }}
                      >
                        <Sigil size={22} color={tier.accentColor} />
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col">
                        <span
                          className="text-sm font-semibold tracking-tight"
                          style={{ color: tier.accentColor }}
                        >
                          {tier.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          {tier.subcopy}
                        </span>
                      </span>
                      <span className="shrink-0 text-right">
                        <span className="block text-xs font-semibold tabular-nums text-foreground">
                          {tier.questions}Q
                        </span>
                        <span
                          className="block text-[10px] font-medium tabular-nums"
                          style={{ color: tier.accentColor }}
                        >
                          +{tier.wisdomPerCorrect}/ans
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 border-t border-border px-5 py-3">
              <p className="text-[10px] text-muted-foreground/80">
                Hearts regenerate over time — pick the tier that matches your focus.
              </p>
              <button
                type="button"
                onClick={onSkip}
                className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent,#6366f1)]"
              >
                Skip trial
              </button>
            </div>

            {/* Safe-area bottom padding on mobile */}
            <div className="h-[env(safe-area-inset-bottom,0px)]" aria-hidden="true" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
