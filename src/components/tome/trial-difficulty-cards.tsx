"use client"

import { motion } from "framer-motion"
import { BookOpen, Scroll, Crown } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import type { QuizDifficulty } from "@/lib/book-progress"

// ─────────────────────────────────────────────
// Difficulty tier definitions
// ─────────────────────────────────────────────

export const TRIAL_TIERS: {
  key: QuizDifficulty
  label: string
  subcopy: string
  icon: typeof BookOpen
  accentColor: string
  accentBg: string
  borderColor: string
  questions: number
  xpReward: number
}[] = [
  {
    key: "Foundational",
    label: "Foundational",
    subcopy: "Check your understanding.",
    icon: BookOpen,
    accentColor: "#78716C",      // warm stone
    accentBg: "rgba(120,113,108,0.08)",
    borderColor: "rgba(120,113,108,0.25)",
    questions: 5,
    xpReward: 10,
  },
  {
    key: "Scholar",
    label: "Scholar",
    subcopy: "Read between the lines.",
    icon: Scroll,
    accentColor: "#6366F1",      // indigo
    accentBg: "rgba(99,102,241,0.08)",
    borderColor: "rgba(99,102,241,0.25)",
    questions: 8,
    xpReward: 25,
  },
  {
    key: "Sage",
    label: "Sage",
    subcopy: "Prove your mastery.",
    icon: Crown,
    accentColor: "#D4AF37",      // laurel gold
    accentBg: "rgba(212,175,55,0.08)",
    borderColor: "rgba(212,175,55,0.25)",
    questions: 10,
    xpReward: 50,
  },
]

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
  return (
    <div className="flex flex-col items-center justify-center h-full gap-8 px-6 text-center">
      {/* Headline */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl"
      >
        {TRIAL_TIERS.map((tier, i) => {
          const Icon = tier.icon
          return (
            <motion.button
              key={tier.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, ...springs.gentle }}
              whileHover={{ y: -4, borderColor: tier.accentColor }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectDifficulty(tier.key)}
              className="group flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-center transition-all bg-card shadow-sm"
              style={{
                borderColor: tier.borderColor,
              }}
            >
              {/* Icon */}
              <div
                className="flex size-12 items-center justify-center rounded-xl"
                style={{ background: tier.accentBg }}
              >
                <Icon className="size-5" style={{ color: tier.accentColor }} />
              </div>

              {/* Name */}
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-ink">
                  {tier.label}
                </h3>
                <p className="text-sm text-muted-foreground leading-snug">
                  {tier.subcopy}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-col items-center gap-1.5 mt-auto pt-2">
                <span className="text-xs text-muted-foreground">
                  {tier.questions} questions
                </span>
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{
                    background: tier.accentBg,
                    color: tier.accentColor,
                  }}
                >
                  +{tier.xpReward} Wisdom
                </span>
              </div>

              {/* CTA */}
              <span
                className="mt-2 inline-flex items-center justify-center rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-colors"
                style={{ background: tier.accentColor }}
              >
                Begin
              </span>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Skip link */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.55 }}
        onClick={onSkip}
        className="text-sm text-muted-foreground hover:text-ink underline underline-offset-2 transition-colors"
      >
        Skip and continue reading
      </motion.button>
    </div>
  )
}
