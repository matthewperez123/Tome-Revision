"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import type { QuizDifficulty } from "@/lib/book-progress"
import { getTierDef } from "@/components/tome/trial-difficulty-cards"
import { DifficultyBars } from "@/components/trials/DifficultyBars"
import { trialDurations } from "@/lib/animations/trial-tokens"

/**
 * Shown between difficulty selection and the first question. Auto-advances
 * after ~2.5s or when the user taps "Begin".
 */
export function TrialIntroCard({
  tier,
  unitDisplay,
  questionCount,
  onBegin,
}: {
  tier: QuizDifficulty
  unitDisplay: string
  questionCount: number
  onBegin: () => void
}) {
  const reduced = useReducedMotion()
  const [begun, setBegun] = useState(false)
  const tierDef = getTierDef(tier)

  useEffect(() => {
    if (begun) return
    const t = setTimeout(() => {
      setBegun(true)
      onBegin()
    }, trialDurations.intro)
    return () => clearTimeout(t)
  }, [begun, onBegin])

  function handleBegin() {
    if (begun) return
    setBegun(true)
    onBegin()
  }

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-6 text-center">
      <motion.div
        initial={reduced ? false : { scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className="flex items-center justify-center"
      >
        <DifficultyBars level={tierDef.level} size={72} color={tierDef.accentColor} />
      </motion.div>

      <div className="space-y-1">
        <h2 className="font-serif text-3xl font-bold text-ink tracking-tight">
          Chapter Trial — {tierDef.label}
        </h2>
        <p className="text-muted-foreground text-sm">{unitDisplay}</p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-serif text-lg text-ink">
          {questionCount} {questionCount === 1 ? "question" : "questions"}
        </p>
      </div>

      <Button
        onClick={handleBegin}
        className="codex-pressable-edge mt-2 min-h-[44px] px-8 py-3 text-base font-semibold gap-2"
        style={{
          background: tierDef.accentColor,
          color: tierDef.onAccent,
          borderRadius: "var(--codex-radius-btn)",
          // @ts-expect-error — CSS custom property for pressed edge
          "--codex-edge": tierDef.accentEdge,
        }}
      >
        Begin
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
