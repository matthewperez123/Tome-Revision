"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAnimationLoop } from "./useAnimationLoop"

const PHASES = [
  { name: "question", duration: 3500 },
  { name: "select", duration: 2500 },
  { name: "correct", duration: 3500 },
  { name: "wisdom", duration: 3000 },
]

const QUESTION = {
  text: "What literary device does Homer employ with the phrase 'wine-dark sea'?",
  options: ["Simile", "Kenning", "Formulaic epithet", "Hyperbole"],
  correctIndex: 2,
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function TrialsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showSelected = phase === "select" || phase === "correct" || phase === "wisdom"
  const showCorrect = phase === "correct" || phase === "wisdom"
  const showWisdom = phase === "wisdom"

  if (isReduced) {
    return (
      <TrialsShell>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-xs text-indigo-500 font-semibold mb-3">Book I Trial</p>
          <p className="font-serif text-sm text-foreground font-semibold mb-4">{QUESTION.text}</p>
          <div className="space-y-2.5">
            {QUESTION.options.map((opt, i) => (
              <div key={i} className={cn(
                "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm",
                i === QUESTION.correctIndex ? "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" : "border-border bg-muted text-foreground"
              )}>
                <span className="font-semibold text-xs">{String.fromCharCode(65 + i)}</span>
                <span>{opt}</span>
                {i === QUESTION.correctIndex && <Check className="size-4 ml-auto" />}
              </div>
            ))}
          </div>
        </div>
      </TrialsShell>
    )
  }

  return (
    <TrialsShell>
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[320px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated quiz demonstration"
      >
        <p className="text-xs text-indigo-500 font-semibold mb-3">Book I Trial</p>
        <p className="font-serif text-sm text-foreground font-semibold mb-4">{QUESTION.text}</p>

        <div className="space-y-2.5">
          {QUESTION.options.map((opt, i) => {
            const letter = String.fromCharCode(65 + i)
            const isCorrect = i === QUESTION.correctIndex
            let variant: "default" | "selected" | "correct" = "default"
            if (isCorrect && showSelected) variant = "selected"
            if (isCorrect && showCorrect) variant = "correct"

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{
                  opacity: showCorrect && !isCorrect ? 0.4 : 1,
                  y: 0,
                }}
                transition={{ delay: phase === "question" ? i * 0.06 : 0, duration: 0.25, ease: EASE }}
                className={cn(
                  "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors duration-300",
                  variant === "correct" && "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                  variant === "selected" && "border-indigo-500/50 bg-indigo-500/10 text-foreground",
                  variant === "default" && "border-border bg-muted text-foreground"
                )}
                style={{ willChange: "transform, opacity" }}
              >
                <span className="font-semibold text-xs w-4">{letter}</span>
                <span className="flex-1">{opt}</span>
                {variant === "correct" && <Check className="size-4 text-emerald-600 dark:text-emerald-400" />}
              </motion.div>
            )
          })}
        </div>

        <AnimatePresence>
          {showWisdom && (
            <motion.p
              initial={{ opacity: 0, y: 0 }}
              animate={{ opacity: [1, 1, 0], y: -18 }}
              transition={{ duration: 1, times: [0, 0.5, 1], ease: EASE }}
              className="text-sm text-primary font-semibold mt-3 text-center"
              style={{ willChange: "transform, opacity" }}
            >
              +10 Wisdom
            </motion.p>
          )}
        </AnimatePresence>

      </div>
    </TrialsShell>
  )
}

function TrialsShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-muted py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 items-center">
        <div className="order-2 md:order-1">
          <BlurFade delay={0.1} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
              Prove your understanding.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Earn Wisdom by completing Trials after each chapter. Every question tests comprehension, vocabulary, and critical thinking &mdash; at Apprentice, Scholar, or Master difficulty.
            </p>
          </BlurFade>
        </div>
        <BlurFade delay={0.1} inView>
          <div className="order-1 md:order-2">
            {children}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
