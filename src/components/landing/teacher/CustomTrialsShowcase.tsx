"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"
import { TRIAL_REGISTRY } from "@/lib/trials/registry"
import type { TrialQuestionType } from "@/lib/trials/question-types"

const PHASES = [
  { name: "idle", duration: 500 },
  { name: "highlight", duration: 600 },
  { name: "generate", duration: 500 },
  { name: "question1", duration: 500 },
  { name: "question2", duration: 500 },
  { name: "question3", duration: 600 },
  { name: "reset", duration: 200 },
]

const PASSAGE_LINES = [
  "Sing, O goddess, the anger of Achilles",
  "son of Peleus, that brought countless ills",
  "upon the Achaeans.",
]

// Each generated question is tagged with a real Trial type from the shared
// registry, so the educator demo showcases the variety of question types Tome
// can author — not a single generic multiple-choice shape.
const QUESTIONS: { type: TrialQuestionType; text: string }[] = [
  { type: "fill_the_line", text: "Restore the opening: \u201cSing, O goddess, the ___ of Achilles.\u201d" },
  { type: "word_in_context", text: "What does \u201canger\u201d mean as Homer uses it here?" },
  { type: "find_the_evidence", text: "Which line names Achilles as the son of Peleus?" },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function CustomTrialsShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const isHighlighted =
    phase === "highlight" ||
    phase === "generate" ||
    phase === "question1" ||
    phase === "question2" ||
    phase === "question3"

  const showButton =
    phase === "generate" ||
    phase === "question1" ||
    phase === "question2" ||
    phase === "question3"

  const buttonPulsing = phase === "generate"

  const visibleQuestions =
    phase === "question1"
      ? 1
      : phase === "question2"
        ? 2
        : phase === "question3"
          ? 3
          : 0

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Write your own Trials &mdash; or let Virgil"
        subcopy="Author questions by hand or generate them from any passage with one click \u2014 across all six Trial types."
        layout="mockup-left"
        bgClass="bg-background"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-xs text-muted-foreground mb-3">Trial Generator</p>
          <div className="font-serif text-sm text-foreground leading-[1.9]">
            {PASSAGE_LINES.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Write your own Trials &mdash; or let Virgil"
      subcopy="Author questions by hand or generate them from any passage with one click."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated trial generation demonstration"
      >
        <p className="text-xs text-muted-foreground mb-3">Trial Generator</p>

        {/* Passage */}
        <div className="font-serif text-sm text-foreground leading-[1.9] mb-4">
          {PASSAGE_LINES.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                delay: phase === "idle" ? i * 0.12 : 0,
                duration: 0.35,
                ease: EASE,
              }}
              style={{ willChange: "transform, opacity" }}
            >
              {isHighlighted ? (
                <motion.span
                  initial={{ backgroundColor: "transparent" }}
                  animate={{ backgroundColor: "rgba(99,102,241,0.15)" }}
                  className="bg-indigo-500/15 rounded px-0.5"
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ willChange: "background-color" }}
                >
                  {line}
                </motion.span>
              ) : (
                line
              )}
            </motion.p>
          ))}
        </div>

        {/* Generate Trial button */}
        <AnimatePresence>
          {showButton && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="mb-4"
              style={{ willChange: "transform, opacity" }}
            >
              <motion.button
                className="bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-semibold pointer-events-none"
                animate={
                  buttonPulsing
                    ? { scale: [1, 1.05, 1], opacity: [1, 0.85, 1] }
                    : { scale: 1, opacity: 1 }
                }
                transition={
                  buttonPulsing
                    ? { duration: 1.2, repeat: Infinity, ease: EASE }
                    : { duration: 0.3 }
                }
                style={{ willChange: "transform, opacity" }}
              >
                Generate Trial
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quiz questions */}
        <div className="flex flex-col gap-2">
          <AnimatePresence>
            {QUESTIONS.slice(0, visibleQuestions).map(({ type, text }, i) => {
              const { label, icon: Icon } = TRIAL_REGISTRY[type]
              return (
                <motion.div
                  key={text}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{
                    duration: 0.4,
                    ease: EASE,
                    delay: i * 0.05,
                  }}
                  className="border-l-2 border-[#D4AF37] bg-[#D4AF37]/5 rounded-r-lg p-3 text-xs text-foreground"
                  style={{ willChange: "transform, opacity" }}
                >
                  <span className="mb-1.5 inline-flex items-center gap-1 rounded-full bg-[#D4AF37]/15 px-2 py-0.5 text-[10px] font-semibold text-[#8A6D1F]">
                    <Icon className="size-3" />
                    {label}
                  </span>
                  <p>{text}</p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </TeacherShowcaseShell>
  )
}
