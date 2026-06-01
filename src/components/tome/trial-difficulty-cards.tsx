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
  sigil: FC<SigilProps>
  /** Solid accent — AA against `onAccent` text. */
  accentColor: string
  /** Text/label color for the accent on light/soft surfaces (AA). */
  accentText: string
  /** Text color to place on top of a solid `accentColor` fill (AA). */
  onAccent: string
  /** Soft tint background for the accent. */
  accentSoft: string
  questions: number
  /** Wisdom per correct answer */
  wisdomPerCorrect: number
}

export const TRIAL_TIERS: TrialTierDef[] = [
  {
    key: "Apprentice",
    label: "Initiate",
    subcopy: "Check your understanding.",
    sigil: ApprenticeSigil,
    accentColor: "var(--trial-initiate)",
    accentText: "var(--trial-initiate-text)",
    onAccent: "var(--trial-initiate-on)",
    accentSoft: "var(--trial-initiate-soft)",
    questions: 5,
    wisdomPerCorrect: 5,
  },
  {
    key: "Scholar",
    label: "Adept",
    subcopy: "Read between the lines.",
    sigil: ScholarSigil,
    accentColor: "var(--trial-adept)",
    accentText: "var(--trial-adept-text)",
    onAccent: "var(--trial-adept-on)",
    accentSoft: "var(--trial-adept-soft)",
    questions: 8,
    wisdomPerCorrect: 10,
  },
  {
    key: "Master",
    label: "Laureate",
    subcopy: "Prove your mastery.",
    sigil: MasterSigil,
    accentColor: "var(--trial-laureate)",
    accentText: "var(--trial-laureate-text)",
    onAccent: "var(--trial-laureate-on)",
    accentSoft: "var(--trial-laureate-soft)",
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
          const Sigil = tier.sigil
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
              className="group flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-center transition-all bg-card shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
              style={{
                borderColor: `color-mix(in srgb, ${tier.accentColor} 30%, transparent)`,
                // @ts-expect-error — CSS custom property for ring
                "--tw-ring-color": tier.accentColor,
              }}
            >
              {/* Sigil */}
              <div
                className="flex size-14 items-center justify-center rounded-xl"
                style={{ background: tier.accentSoft }}
              >
                <Sigil size={28} color={tier.accentColor} />
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
                className="mt-2 inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold transition-colors"
                style={{ background: tier.accentColor, color: tier.onAccent }}
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
