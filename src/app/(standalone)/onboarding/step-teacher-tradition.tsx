"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { saveOnboardingData } from "@/lib/onboarding"

const traditions = [
  { id: "ancient-greek", label: "Ancient Greek", emoji: "🏛️" },
  { id: "latin", label: "Latin / Roman", emoji: "🦅" },
  { id: "english", label: "English", emoji: "🌹" },
  { id: "american", label: "American", emoji: "🗽" },
  { id: "french", label: "French", emoji: "🇫🇷" },
  { id: "russian", label: "Russian", emoji: "📖" },
  { id: "world", label: "World Literature", emoji: "🌍" },
  { id: "philosophy", label: "Philosophy", emoji: "🤔" },
]

export function StepTeacherTradition({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [selected, setSelected] = useState<string[]>([])

  function toggle(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    )
  }

  function handleContinue() {
    saveOnboardingData({ traditions: selected })
    onNext()
  }

  return (
    <div className="flex flex-col items-center text-center">
      <h2
        className="font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        What traditions do you teach?
      </h2>
      <p className="mt-2 text-xs text-muted-foreground/70">
        Select all that apply. We&apos;ll surface relevant books for your classrooms.
      </p>

      <div className="mt-8 grid w-full grid-cols-2 gap-2">
        {traditions.map((t) => {
          const isSelected = selected.includes(t.id)
          return (
            <motion.button
              key={t.id}
              onClick={() => toggle(t.id)}
              animate={{ scale: isSelected ? 1.02 : 1 }}
              transition={springs.interactive}
              className={`flex items-center gap-2.5 rounded-xl border px-4 py-3.5 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-[#D4A04C] bg-[#D4A04C]/5 text-foreground"
                  : "border-border text-muted-foreground hover:border-foreground/20"
              }`}
            >
              <span className="text-base">{t.emoji}</span>
              {t.label}
            </motion.button>
          )
        })}
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button className="flex-1" disabled={selected.length === 0} onClick={handleContinue}>
          Continue
        </Button>
      </div>
    </div>
  )
}
