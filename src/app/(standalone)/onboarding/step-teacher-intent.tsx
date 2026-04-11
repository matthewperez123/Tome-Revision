"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { BookOpen, GraduationCap, Sparkles, Target } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { saveOnboardingData } from "@/lib/onboarding"
import type { LucideIcon } from "lucide-react"

const options: { label: string; icon: LucideIcon; id: string }[] = [
  { label: "Assign readings & track progress", icon: BookOpen, id: "assign" },
  { label: "Build quizzes & assessments", icon: Target, id: "assess" },
  { label: "Inspire a love of reading", icon: Sparkles, id: "inspire" },
  { label: "Supplement my curriculum", icon: GraduationCap, id: "supplement" },
]

export function StepTeacherIntent({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string | null>(null)

  function handleContinue() {
    if (!selected) return
    saveOnboardingData({ intent: selected })
    onNext()
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        How will you use Tome in class?
      </h2>
      <p className="mt-2 text-xs text-muted-foreground/70">
        We&apos;ll tailor your teacher tools to match.
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.id
          return (
            <motion.button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              animate={{ scale: isSelected ? 1.03 : 1 }}
              transition={springs.interactive}
              className={`flex flex-col items-center gap-2 rounded-xl border p-5 text-sm font-medium transition-colors duration-[var(--tome-duration-fast)] ${
                isSelected
                  ? "border-[#D4A04C] bg-[#D4A04C]/5 text-[#D4A04C]"
                  : "border-border text-muted-foreground hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              <opt.icon className="size-5" />
              {opt.label}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button className="flex-1" disabled={!selected} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
