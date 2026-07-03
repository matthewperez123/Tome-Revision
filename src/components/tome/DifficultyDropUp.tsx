"use client"

import * as React from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Loader2, RotateCcw, ScrollText, X } from "lucide-react"
import type { QuizDifficulty } from "@/lib/book-progress"
import { TRIAL_TIERS } from "@/components/tome/trial-difficulty-cards"
import { DifficultyBars } from "@/components/trials/DifficultyBars"
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
  /**
   * Drives what the panel body shows:
   *  - "select"      → the tier picker (default)
   *  - "resolving"   → a spinner while the Trial ladder is resolved
   *  - "unavailable" → an honest "being forged" empty state (no dead button)
   */
  status?: "select" | "resolving" | "unavailable"
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
  status = "select",
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
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Centered search-style command panel */}
          <motion.div
            key="difficulty-dropup"
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: -8 }}
            transition={reduced ? { duration: 0.15 } : springs.gentle}
            className="fixed left-1/2 top-[15vh] z-[80] w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-background shadow-[0_24px_60px_-12px_rgba(0,0,0,0.45)]"
            role="dialog"
            aria-modal="true"
            aria-label="Choose a trial difficulty"
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2.5">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  End of {unitDisplay}
                </p>
                <h3 className="mt-0.5 font-serif text-base font-semibold leading-tight tracking-tight">
                  {status === "resolving"
                    ? "Preparing your Trial…"
                    : status === "unavailable"
                      ? "Trial not ready yet"
                      : "Choose your difficulty"}
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)]"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Resolving — the Trial ladder is being resolved */}
            {status === "resolving" && (
              <div className="flex flex-col items-center gap-3 px-6 py-10 text-center">
                <Loader2 className="size-7 animate-spin text-muted-foreground" aria-hidden="true" />
                <p className="text-sm text-muted-foreground">
                  Searching for a Trial for this passage…
                </p>
              </div>
            )}

            {/* Unavailable — honest empty state, no dead button */}
            {status === "unavailable" && (
              <div className="flex flex-col items-center gap-3 px-6 py-8 text-center">
                <span
                  className="flex size-11 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--tome-surface-elevated)" }}
                >
                  <ScrollText className="size-5 text-muted-foreground" aria-hidden="true" />
                </span>
                <div className="space-y-1">
                  <p className="font-serif text-base font-semibold tracking-tight">
                    Trials for this book are being forged
                  </p>
                  <p className="text-[13px] leading-relaxed text-muted-foreground">
                    We haven&apos;t written a Trial for this passage yet. Keep reading —
                    your progress is saved.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-1 rounded-lg border border-border px-3.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)]"
                >
                  Back to reading
                </button>
              </div>
            )}

            {/* Resume row — shown when a saved in-progress attempt exists */}
            {status === "select" && resumeTier && (
              <div className="px-2 pb-1.5">
                <button
                  type="button"
                  onClick={() => onSelect(resumeTier)}
                  className={cn(
                    "group flex w-full items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-[background-color,border-color] duration-150",
                    "hover:bg-[var(--tome-surface-elevated)]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                  )}
                  style={{
                    borderColor: "color-mix(in srgb, var(--codex-tier-laureate) 45%, transparent)",
                    backgroundColor: "var(--codex-tier-laureate-soft)",
                  }}
                  aria-label={`Resume your ${resumeTier} trial${resumeCopy ? `, ${resumeCopy}` : ""}`}
                >
                  <span
                    className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                    style={{ backgroundColor: "color-mix(in srgb, var(--codex-tier-laureate) 18%, transparent)" }}
                  >
                    <RotateCcw className="size-4" style={{ color: "var(--codex-tier-laureate-text)" }} />
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span
                      className="text-sm font-semibold tracking-tight"
                      style={{ color: "var(--codex-tier-laureate-text)" }}
                    >
                      Resume where you left off
                    </span>
                    <span className="truncate text-[11px] text-muted-foreground">
                      {resumeCopy ?? `${resumeTier} trial — pick up where you stopped.`}
                    </span>
                  </span>
                  <span
                    className="shrink-0 text-[10px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--codex-tier-laureate-text)" }}
                  >
                    Continue
                  </span>
                </button>
              </div>
            )}

            {/* Tier rows */}
            {status === "select" && (
            <ul className="px-2 pb-1.5">
              {TRIAL_TIERS.map((tier) => {
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
                        "group flex w-full items-center gap-2.5 rounded-xl border border-transparent px-2.5 py-2 text-left transition-[background-color,border-color] duration-150",
                        "hover:bg-[var(--tome-surface-elevated)]",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
                      )}
                      style={
                        isRecommended
                          ? {
                              borderColor: `color-mix(in srgb, ${tier.accentColor} 35%, transparent)`,
                              backgroundColor: tier.accentSoft,
                            }
                          : undefined
                      }
                      aria-label={`${tier.label}${isRecommended ? " (recommended)" : ""}: ${tier.subcopy}`}
                    >
                      <span
                        className="flex size-8 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: tier.accentSoft }}
                      >
                        <DifficultyBars level={tier.level} size={16} color={tier.accentColor} />
                      </span>
                      <span className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className="text-sm font-semibold tracking-tight"
                          style={{ color: tier.accentColor }}
                        >
                          {tier.label}
                        </span>
                        <span className="truncate text-[11px] text-muted-foreground">
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
                          +{tier.wisdomPerCorrect}
                        </span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
            )}

            {/* Footer */}
            {status === "select" && (
            <div className="flex items-center justify-between gap-3 border-t border-border px-4 py-2.5">
              <p className="truncate text-[10px] text-muted-foreground/80">
                Hearts regenerate over time.
              </p>
              <button
                type="button"
                onClick={onSkip}
                className="shrink-0 rounded-md px-2.5 py-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)]"
              >
                Skip trial
              </button>
            </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
