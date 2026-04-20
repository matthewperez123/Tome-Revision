"use client"

import { useState, type ComponentType } from "react"
import { motion } from "framer-motion"
import {
  Landmark,
  Crown,
  Flower2,
  Star,
  Flag,
  BookOpen,
  Globe,
  Brain,
  type LucideProps,
} from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"
import { saveOnboardingData } from "@/lib/onboarding"

const traditions: { id: string; label: string; Icon: ComponentType<LucideProps> }[] = [
  { id: "ancient-greek", label: "Ancient Greek", Icon: Landmark },
  { id: "latin", label: "Latin / Roman", Icon: Crown },
  { id: "english", label: "English", Icon: Flower2 },
  { id: "american", label: "American", Icon: Star },
  { id: "french", label: "French", Icon: Flag },
  { id: "russian", label: "Russian", Icon: BookOpen },
  { id: "world", label: "World Literature", Icon: Globe },
  { id: "philosophy", label: "Philosophy", Icon: Brain },
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
              <t.Icon className="size-4 shrink-0" aria-hidden="true" />
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
