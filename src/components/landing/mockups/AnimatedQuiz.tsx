"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check, X, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "../useAnimationLoop"

const PHASES = [
  { name: "question", duration: 3000 },
  { name: "correct", duration: 3000 },
  { name: "nextQuestion", duration: 3000 },
  { name: "wrong", duration: 3000 },
]

const Q1 = {
  question: "What does Telemachus resolve to do after Athena's visit?",
  options: [
    "Sail to Troy to find his father",
    "Challenge the suitors to combat",
    "Journey to Pylos and Sparta for news of Odysseus",
    "Pray to Poseidon for his father's return",
  ],
  correctIndex: 2,
}

const Q2 = {
  question: "Homer's epithet 'rosy-fingered Dawn' is an example of:",
  options: [
    "Metaphor",
    "Formulaic epithet",
    "Synecdoche",
    "Personification",
  ],
  correctIndex: 1,
  wrongIndex: 3,
}

export function AnimatedQuiz() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const hearts = phase === "wrong" ? 3 : phase === "correct" ? 5 : 4

  if (isReduced) {
    return (
      <div className="bg-card rounded-xl border border-border p-6">
        <p className="text-xs text-primary mb-3">Book I Trial</p>
        <p className="font-serif text-sm text-foreground font-semibold mb-4">{Q1.question}</p>
        <div className="space-y-2.5">
          {Q1.options.map((opt, i) => (
            <div key={i} className={cn(
              "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm",
              i === Q1.correctIndex ? "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "border-border bg-muted text-foreground"
            )}>
              <span className="font-semibold text-xs">{String.fromCharCode(65 + i)}</span>
              <span>{opt}</span>
              {i === Q1.correctIndex && <Check className="size-4 ml-auto" />}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const showQ1 = phase === "question" || phase === "correct"
  const currentQ = showQ1 ? Q1 : Q2

  return (
    <div
      ref={containerRef}
      className="bg-card rounded-xl border border-border p-6 min-h-[350px]"
      aria-label="Animated quiz demonstration"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs text-primary font-semibold">Book I Trial</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Heart
              key={i}
              className={cn(
                "size-3.5 transition-all duration-300",
                i < hearts ? "text-rose-500 fill-rose-500" : "text-muted-foreground/30"
              )}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={showQ1 ? "q1" : "q2"}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.35 }}
        >
          {/* Question */}
          <p className="font-serif text-sm text-foreground font-semibold mb-4">
            {currentQ.question}
          </p>

          {/* Options */}
          <div className="space-y-2.5">
            {currentQ.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i)
              let variant: "default" | "correct" | "wrong" = "default"

              if (showQ1 && phase === "correct" && i === Q1.correctIndex) variant = "correct"
              if (!showQ1 && phase === "wrong") {
                if (i === Q2.wrongIndex) variant = "wrong"
                if (i === Q2.correctIndex) variant = "correct"
              }

              return (
                <motion.div
                  key={`${showQ1 ? "q1" : "q2"}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{
                    opacity: (phase === "correct" && showQ1 && i !== Q1.correctIndex) ? 0.4 : 1,
                    y: 0,
                    x: variant === "wrong" ? [0, -4, 4, -4, 0] : 0,
                  }}
                  transition={{
                    delay: phase === "question" || phase === "nextQuestion" ? i * 0.08 : 0,
                    duration: 0.3,
                  }}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors duration-300",
                    variant === "correct" && "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                    variant === "wrong" && "border-rose-500/50 bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400",
                    variant === "default" && "border-border bg-muted text-foreground"
                  )}
                >
                  <span className="font-semibold text-xs w-4">{letter}</span>
                  <span className="flex-1">{opt}</span>
                  {variant === "correct" && <Check className="size-4 text-emerald-600 dark:text-emerald-400" />}
                  {variant === "wrong" && <X className="size-4 text-rose-600 dark:text-rose-400" />}
                </motion.div>
              )
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {phase === "correct" && showQ1 && (
              <motion.p
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [1, 1, 0], y: -15 }}
                transition={{ duration: 1.2, times: [0, 0.6, 1] }}
                className="text-sm text-primary font-semibold mt-3 text-center"
              >
                +10 Wisdom
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
