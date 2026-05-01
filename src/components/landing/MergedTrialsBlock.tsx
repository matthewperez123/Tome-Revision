"use client"

import { motion, AnimatePresence } from "motion/react"
import { Check, Flame, Trophy } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

const PHASES = [
  { name: "question", duration: 1400 },
  { name: "select", duration: 1000 },
  { name: "correct", duration: 1400 },
  { name: "wisdom", duration: 1200 },
]

const QUESTION = {
  text: "What literary device does Homer employ with the phrase 'wine-dark sea'?",
  options: ["Simile", "Kenning", "Formulaic epithet", "Hyperbole"],
  correctIndex: 2,
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function MergedTrialsBlock() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const showSelected = phase === "select" || phase === "correct" || phase === "wisdom"
  const showCorrect = phase === "correct" || phase === "wisdom"
  const showWisdom = phase === "wisdom"

  return (
    <TeacherShowcaseShell
      heading="Every chapter is a Trial."
      subcopy="Earn Wisdom by completing Trials at the end of each chapter — comprehension, vocabulary, critical thinking, and a Virgil-graded reflection. Keep your Flame alive with daily reading."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div>
        {/* Trial card */}
          <div
            ref={isReduced ? undefined : containerRef}
            className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
            aria-label="Animated quiz demonstration"
          >
            <p className="text-xs text-indigo-500 font-semibold mb-3">Book I Trial</p>
            <p className="font-serif text-sm text-foreground font-semibold mb-4">
              {QUESTION.text}
            </p>

            <div className="space-y-2.5">
              {QUESTION.options.map((opt, i) => {
                const letter = String.fromCharCode(65 + i)
                const isCorrect = i === QUESTION.correctIndex
                let variant: "default" | "selected" | "correct" = "default"
                if (isReduced && isCorrect) variant = "correct"
                if (!isReduced && isCorrect && showSelected) variant = "selected"
                if (!isReduced && isCorrect && showCorrect) variant = "correct"

                return (
                  <motion.div
                    key={i}
                    initial={isReduced ? false : { opacity: 0, y: 6 }}
                    animate={
                      isReduced
                        ? {}
                        : {
                            opacity: showCorrect && !isCorrect ? 0.4 : 1,
                            y: 0,
                          }
                    }
                    transition={{
                      delay: phase === "question" ? i * 0.06 : 0,
                      duration: 0.25,
                      ease: EASE,
                    }}
                    className={cn(
                      "flex items-center gap-3 rounded-lg border px-4 py-2.5 text-sm transition-colors duration-300",
                      variant === "correct" &&
                        "border-emerald-500/50 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400",
                      variant === "selected" &&
                        "border-indigo-500/50 bg-indigo-500/10 text-foreground",
                      variant === "default" &&
                        "border-border bg-muted text-foreground"
                    )}
                  >
                    <span className="font-semibold text-xs w-4">{letter}</span>
                    <span className="flex-1">{opt}</span>
                    {variant === "correct" && (
                      <Check className="size-4 text-emerald-600 dark:text-emerald-400" />
                    )}
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
                >
                  +110 Wisdom
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Wisdom strip */}
          <div className="mt-4 rounded-xl border border-border bg-card p-4 flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="size-7 rounded-full bg-amber-500/15 border border-amber-500/40 flex items-center justify-center">
                <Trophy className="size-3.5 text-amber-500" />
              </div>
              <div className="leading-tight">
                <p className="text-[11px] font-semibold text-foreground">
                  Scholar Level 7
                </p>
                <p className="text-[10px] text-muted-foreground tabular-nums">
                  340 / 600 Wisdom
                </p>
              </div>
            </div>

            <div className="flex-1 min-w-[120px] h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-600"
                style={{ width: `${(340 / 600) * 100}%` }}
              />
            </div>

            <div className="flex items-center gap-2">
              <Flame className="size-3.5 text-orange-500" />
              <span className="text-[11px] text-muted-foreground tabular-nums">
                14-day Flame
              </span>
            </div>

            <span className="ml-auto rounded-full bg-amber-500/15 border border-amber-500/40 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              +110 Wisdom
            </span>
          </div>
      </div>
    </TeacherShowcaseShell>
  )
}
