"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"
import { TeacherShowcaseShell } from "./TeacherShowcaseShell"

const PHASES = [
  { name: "idle", duration: 2000 },
  { name: "selectBook", duration: 2500 },
  { name: "chapters", duration: 3000 },
  { name: "dueDate", duration: 2000 },
  { name: "create", duration: 2500 },
  { name: "reset", duration: 600 },
]

const CHAPTERS = [
  "Book I: Athena Inspires the Prince",
  "Book II: Telemachus Sets Sail",
  "Book III: King Nestor Remembers",
  "Book IV: The King and Queen of Sparta",
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function AssignmentBuilderShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const phaseOrder = ["idle", "selectBook", "chapters", "dueDate", "create", "reset"]
  const phaseIdx = phaseOrder.indexOf(phase)

  const bookVisible = phaseIdx >= 1 && phase !== "reset"
  const checkedCount = phase === "chapters"
    ? 4
    : phaseIdx > 2
      ? 4
      : 0
  const dueDateVisible = phaseIdx >= 3 && phase !== "reset"
  const buttonGlow = phase === "create"

  if (isReduced) {
    return (
      <TeacherShowcaseShell
        heading="Assign any text, any chapter"
        subcopy="Pick a book, select chapters, set a due date. Tome handles the rest."
        layout="mockup-right"
        bgClass="bg-muted"
      >
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-sm font-semibold text-foreground mb-4">New Assignment</p>
          <div className="flex items-center gap-3 mb-4">
            <div className="size-10 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-serif font-bold text-indigo-500">
              O
            </div>
            <span className="text-sm text-foreground font-medium">The Odyssey</span>
          </div>
          <div className="space-y-2 mb-4">
            {CHAPTERS.map((ch, i) => (
              <label key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-4 rounded border border-indigo-500 bg-indigo-500 flex items-center justify-center">
                  <CheckIcon />
                </div>
                {ch}
              </label>
            ))}
          </div>
          <div className="bg-muted rounded-lg px-3 py-2 text-sm text-foreground mb-4">
            Mar 15, 2026
          </div>
          <button className="bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-semibold">
            Create assignment
          </button>
        </div>
      </TeacherShowcaseShell>
    )
  }

  return (
    <TeacherShowcaseShell
      heading="Assign any text, any chapter"
      subcopy="Pick a book, select chapters, set a due date. Tome handles the rest."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated assignment builder demonstration"
      >
        {/* Card header */}
        <p className="text-sm font-semibold text-foreground mb-4">New Assignment</p>

        {/* Book selector */}
        <div className="mb-4 h-12 relative">
          <AnimatePresence>
            {bookVisible ? (
              <motion.div
                key="book"
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.45, ease: EASE }}
                style={{ willChange: "transform, opacity" }}
              >
                <div className="size-10 rounded bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-xs font-serif font-bold text-indigo-500">
                  O
                </div>
                <span className="text-sm text-foreground font-medium">The Odyssey</span>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                className="flex items-center gap-3 h-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25, ease: EASE }}
                style={{ willChange: "opacity" }}
              >
                <div className="size-10 rounded bg-muted border border-border" />
                <span className="text-sm text-muted-foreground">Select a book&hellip;</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Chapter checkboxes */}
        <div className="space-y-2.5 mb-4">
          {CHAPTERS.map((ch, i) => {
            const isChecked = i < checkedCount
            // Stagger checkbox animations during "chapters" phase
            const checkDelay = phase === "chapters" ? i * 0.4 : 0

            return (
              <motion.label
                key={i}
                className="flex items-center gap-2 text-xs text-muted-foreground cursor-default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: EASE }}
                style={{ willChange: "transform, opacity" }}
              >
                <motion.div
                  className="size-4 rounded flex items-center justify-center"
                  animate={{
                    backgroundColor: isChecked ? "rgb(99 102 241)" : "transparent",
                    borderColor: isChecked ? "rgb(99 102 241)" : "hsl(var(--border))",
                  }}
                  transition={{ delay: checkDelay, duration: 0.3, ease: EASE }}
                  style={{
                    willChange: "transform, opacity",
                    border: "1.5px solid",
                  }}
                >
                  <AnimatePresence>
                    {isChecked && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ delay: checkDelay + 0.1, duration: 0.2, ease: EASE }}
                        style={{ willChange: "transform, opacity" }}
                      >
                        <CheckIcon />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
                {ch}
              </motion.label>
            )
          })}
        </div>

        {/* Due date field */}
        <div className="mb-4">
          <motion.div
            className="bg-muted rounded-lg px-3 py-2 text-sm"
            animate={{
              color: dueDateVisible ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
            }}
            transition={{ duration: 0.35, ease: EASE }}
            style={{ willChange: "opacity" }}
          >
            <AnimatePresence mode="wait">
              {dueDateVisible ? (
                <motion.span
                  key="date"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  style={{ willChange: "opacity" }}
                >
                  Mar 15, 2026
                </motion.span>
              ) : (
                <motion.span
                  key="placeholder"
                  className="text-muted-foreground"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: EASE }}
                  style={{ willChange: "opacity" }}
                >
                  Due date&hellip;
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Create assignment button */}
        <motion.button
          className="bg-indigo-500 text-white rounded-lg px-4 py-2 text-sm font-semibold cursor-default"
          animate={
            buttonGlow
              ? {
                  boxShadow: [
                    "0 0 0px rgba(99,102,241,0)",
                    "0 0 20px rgba(99,102,241,0.5)",
                    "0 0 0px rgba(99,102,241,0)",
                  ],
                }
              : { boxShadow: "0 0 0px rgba(99,102,241,0)" }
          }
          transition={
            buttonGlow
              ? { duration: 1.5, repeat: Infinity, ease: EASE }
              : { duration: 0.3 }
          }
          style={{ willChange: "transform, opacity" }}
        >
          Create assignment
        </motion.button>

      </div>
    </TeacherShowcaseShell>
  )
}

function CheckIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 10 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 5L4.5 7.5L8 3"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
