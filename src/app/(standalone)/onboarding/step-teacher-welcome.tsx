"use client"

import { motion } from "framer-motion"
import { GraduationCap, BookOpen, Brain, Users, BarChart2 } from "lucide-react"
import { springs } from "@/lib/design-tokens"
import { Button } from "@/components/ui/button"

const features = [
  { icon: Users, label: "Create classrooms & track students", color: "text-indigo-500" },
  { icon: BookOpen, label: "Assign reading from 1,000+ classics", color: "text-blue-500" },
  { icon: Brain, label: "Build quizzes with AI assistance", color: "text-purple-500" },
  { icon: BarChart2, label: "Monitor live reading activity", color: "text-green-500" },
]

export function StepTeacherWelcome({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={springs.gentle}
        className="flex size-20 items-center justify-center rounded-2xl bg-[#D4A04C]/10"
      >
        <GraduationCap className="size-10 text-[#D4A04C]" />
      </motion.div>

      <h2
        className="mt-6 font-serif text-2xl font-semibold tracking-tight"
        style={{ letterSpacing: "-0.02em" }}
      >
        Your classroom is ready
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Here&apos;s what you can do with Tome
      </p>

      <div className="mt-8 w-full space-y-3">
        {features.map((f, i) => (
          <motion.div
            key={f.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.1 }}
            className="flex items-center gap-3 rounded-xl border bg-card p-4 text-left"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
              <f.icon className={`size-4.5 ${f.color}`} />
            </div>
            <span className="text-sm font-medium">{f.label}</span>
          </motion.div>
        ))}
      </div>

      <Button className="mt-8 w-full" onClick={onComplete}>
        Go to Dashboard
      </Button>
    </div>
  )
}
