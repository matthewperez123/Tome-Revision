"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { AnimatedCircularProgressBar } from "@/components/ui/animated-circular-progress-bar"
import { setStoredDailyGoal } from "@/lib/economy"
import { saveOnboardingData } from "@/lib/onboarding"

// Mirrors the daily-goal tiers in profile settings.
const goals = [
  { id: "casual", label: "Casual", minutes: 10, progress: 25 },
  { id: "regular", label: "Regular", minutes: 20, progress: 50 },
  { id: "ambitious", label: "Ambitious", minutes: 30, progress: 75 },
  { id: "intense", label: "Intense", minutes: 60, progress: 100 },
]

export function StepGoal({
  onNext,
  onBack,
}: {
  onNext: () => void
  onBack: () => void
}) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleContinue = () => {
    const goal = goals.find((g) => g.id === selected)
    if (!goal) return
    // Persist to all three goal stores: the economy stats blob the dashboard
    // reads, the profile setting key, and the onboarding record.
    setStoredDailyGoal(goal.minutes)
    try {
      localStorage.setItem("tome:setting-goal", String(goal.minutes))
    } catch {}
    saveOnboardingData({ dailyGoalMinutes: goal.minutes })
    onNext()
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Set your daily goal
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        How much time do you want to read each day?
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {goals.map((g) => {
          const isSelected = selected === g.id
          return (
            <motion.button
              key={g.id}
              onClick={() => setSelected(g.id)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`flex flex-col items-center gap-3 rounded-xl border p-5 transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[var(--tome-accent)] bg-[var(--tome-accent)]/5"
                  : "border-border hover:border-foreground/20"
              }`}
            >
              <AnimatedCircularProgressBar
                value={g.progress}
                gaugePrimaryColor="var(--tome-accent)"
                gaugeSecondaryColor="var(--tome-surface-recessed)"
                className="size-16 text-sm"
              />
              <div>
                <p className="text-sm font-semibold">{g.label}</p>
                <p className="text-xs text-muted-foreground">
                  {g.minutes} min/day
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          className="flex-1"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
