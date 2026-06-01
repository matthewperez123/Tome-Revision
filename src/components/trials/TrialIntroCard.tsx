"use client"

import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight, Heart } from "lucide-react"
import type { QuizDifficulty } from "@/lib/book-progress"
import { getTierDef } from "@/components/tome/trial-difficulty-cards"
import { tierSigils } from "@/components/trials/sigils"
import { trialDurations } from "@/lib/animations/trial-tokens"
import { MAX_HEARTS } from "@/lib/economy"

/**
 * Shown between difficulty selection and the first question. Auto-advances
 * after ~2.5s or when the user taps "Begin".
 */
export function TrialIntroCard({
  tier,
  unitDisplay,
  questionCount,
  hearts,
  onBegin,
}: {
  tier: QuizDifficulty
  unitDisplay: string
  questionCount: number
  hearts: number
  onBegin: () => void
}) {
  const reduced = useReducedMotion()
  const [begun, setBegun] = useState(false)
  const tierDef = getTierDef(tier)
  const Sigil = tierSigils[tier]

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
        <Sigil size={80} color={tierDef.accentColor} />
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

        <div className="flex items-center gap-1" aria-label={`${hearts} hearts remaining`}>
          {Array.from({ length: MAX_HEARTS }).map((_, i) => (
            <Heart
              key={i}
              className={`w-4 h-4 ${
                i < hearts
                  ? "fill-rose-500 text-rose-500"
                  : "fill-transparent text-stone-400"
              }`}
            />
          ))}
        </div>
      </div>

      <Button
        onClick={handleBegin}
        className="mt-2 rounded-xl px-8 py-3 text-base font-semibold gap-2"
        style={{ background: tierDef.accentColor, color: tierDef.onAccent }}
      >
        Begin
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  )
}
