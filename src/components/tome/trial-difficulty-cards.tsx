"use client"

import type { FC } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import type { QuizDifficulty } from "@/lib/book-progress"
import {
  ApprenticeSigil,
  ScholarSigil,
  MasterSigil,
  type SigilProps,
} from "@/components/trials/sigils"
import { DifficultyBars } from "@/components/trials/DifficultyBars"

// ─────────────────────────────────────────────
// Tier definitions. The data/storage keys stay canonical
// (Apprentice / Scholar / Master) so saved attempts and per-question
// difficulty tags are untouched; only the user-facing `label`, sigils and
// colors change. Colors escalate up the cool-indigo ramp, with gold
// reserved for the Laureate (mastery) tier. All driven by tier tokens.
// Wisdom rewards are per-correct-answer (5/10/15 per spec).
// ─────────────────────────────────────────────

export interface TrialTierDef {
  key: QuizDifficulty
  label: string
  subcopy: string
  /** Filled-bar count for the volume-style difficulty logo (Easy 1 → Hard 3). */
  level: 1 | 2 | 3
  sigil: FC<SigilProps>
  /** Solid accent — AA against `onAccent` text. */
  accentColor: string
  /** Text/label color for the accent on light/soft surfaces (AA). */
  accentText: string
  /** Text color to place on top of a solid `accentColor` fill (AA). */
  onAccent: string
  /** Soft tint background for the accent. */
  accentSoft: string
  /** Darker edge color for the Codex pressed-edge button. */
  accentEdge: string
  questions: number
  /** Wisdom per correct answer */
  wisdomPerCorrect: number
}

export const TRIAL_TIERS: TrialTierDef[] = [
  {
    key: "Apprentice",
    label: "Easy",
    subcopy: "Check your understanding.",
    level: 1,
    sigil: ApprenticeSigil,
    accentColor: "var(--codex-tier-initiate)",
    accentText: "var(--codex-tier-initiate-text)",
    onAccent: "var(--codex-tier-initiate-on)",
    accentSoft: "var(--codex-tier-initiate-soft)",
    accentEdge: "var(--codex-tier-initiate-edge)",
    questions: 5,
    wisdomPerCorrect: 5,
  },
  {
    key: "Scholar",
    label: "Medium",
    subcopy: "Read between the lines.",
    level: 2,
    sigil: ScholarSigil,
    accentColor: "var(--codex-tier-adept)",
    accentText: "var(--codex-tier-adept-text)",
    onAccent: "var(--codex-tier-adept-on)",
    accentSoft: "var(--codex-tier-adept-soft)",
    accentEdge: "var(--codex-tier-adept-edge)",
    questions: 8,
    wisdomPerCorrect: 10,
  },
  {
    key: "Master",
    label: "Hard",
    subcopy: "Prove your mastery.",
    level: 3,
    sigil: MasterSigil,
    accentColor: "var(--codex-tier-laureate)",
    accentText: "var(--codex-tier-laureate-text)",
    onAccent: "var(--codex-tier-laureate-on)",
    accentSoft: "var(--codex-tier-laureate-soft)",
    accentEdge: "var(--codex-tier-laureate-edge)",
    questions: 10,
    wisdomPerCorrect: 15,
  },
]

export function getTierDef(tier: QuizDifficulty): TrialTierDef {
  return TRIAL_TIERS.find((t) => t.key === tier) ?? TRIAL_TIERS[0]
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

interface TrialDifficultyCardsProps {
  /** Display label for the unit, e.g. "Canto III" or "Chapter 5" */
  unitDisplay: string
  onSelectDifficulty: (difficulty: QuizDifficulty) => void
  onSkip: () => void
}

export function TrialDifficultyCards({
  unitDisplay,
  onSelectDifficulty,
  onSkip,
}: TrialDifficultyCardsProps) {
  const reduced = useReducedMotion()

  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
      {/* Headline */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-2"
      >
        <h2 className="font-serif text-3xl font-bold text-ink tracking-tight">
          Choose your Trial
        </h2>
        <p className="text-muted-foreground text-base max-w-md mx-auto">
          You&apos;ve finished {unitDisplay}. How deep do you want to go?
        </p>
      </motion.div>

      {/* Three cards */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl"
      >
        {TRIAL_TIERS.map((tier, i) => {
          return (
            <motion.button
              key={tier.key}
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, ...springs.gentle }}
              whileHover={reduced ? undefined : { y: -4, borderColor: tier.accentColor }}
              whileTap={reduced ? undefined : { scale: 0.98 }}
              onClick={() => onSelectDifficulty(tier.key)}
              aria-label={`Choose ${tier.label} tier: ${tier.subcopy}. ${tier.questions} questions, ${tier.wisdomPerCorrect} Wisdom per correct answer.`}
              className="group flex flex-col items-center gap-4 border-2 p-6 text-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderRadius: "var(--codex-radius-card)",
                borderColor: `color-mix(in srgb, ${tier.accentColor} 30%, transparent)`,
                background: "var(--codex-surface)",
                // @ts-expect-error — CSS custom property for ring
                "--tw-ring-color": tier.accentColor,
              }}
            >
              {/* Sigil */}
              <div
                className="flex size-14 items-center justify-center rounded-xl"
                style={{ background: tier.accentSoft }}
              >
                <DifficultyBars level={tier.level} size={28} color={tier.accentColor} />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-ink">{tier.label}</h3>
                <p className="text-sm text-muted-foreground leading-snug">{tier.subcopy}</p>
              </div>

              {/* Meta */}
              <div className="flex flex-col items-center gap-1.5 mt-auto pt-2">
                <span className="text-xs text-muted-foreground">{tier.questions} questions</span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ background: tier.accentSoft, color: tier.accentText }}
                >
                  +{tier.wisdomPerCorrect} Wisdom per correct
                </span>
              </div>

              {/* CTA */}
              <span
                className="codex-pressable-edge mt-2 inline-flex min-h-[44px] items-center justify-center px-6 py-2.5 text-sm font-semibold"
                style={{
                  background: tier.accentColor,
                  color: tier.onAccent,
                  borderRadius: "var(--codex-radius-btn)",
                  // @ts-expect-error — CSS custom property for pressed edge
                  "--codex-edge": tier.accentEdge,
                }}
              >
                Begin
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Skip link */}
      <motion.button
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        onClick={onSkip}
        className="text-sm text-muted-foreground hover:text-ink underline underline-offset-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded"
      >
        Skip and continue reading
      </motion.button>
    </div>
  )
}
