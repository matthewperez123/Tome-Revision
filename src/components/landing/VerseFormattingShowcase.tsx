"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

// Reader loop target: ~5s.
const PHASES = [
  { name: "plain", duration: 1800 },
  { name: "rhyme", duration: 2800 },
  { name: "reset", duration: 400 },
]

const SONNET = [
  { n: 1, text: "Shall I compare thee to a summer\u2019s day?", rhyme: "A" },
  { n: 2, text: "Thou art more lovely and more temperate:", rhyme: "B" },
  { n: 3, text: "Rough winds do shake the darling buds of May,", rhyme: "A" },
  { n: 4, text: "And summer\u2019s lease hath all too short a date.", rhyme: "B" },
]

const RHYME_COLORS: Record<string, string> = {
  A: "#6366F1",
  B: "#EC4899",
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function VerseFormattingShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const showRhyme = phase === "rhyme"

  return (
    <TeacherShowcaseShell
      heading="Verse, laid out as verse."
      subcopy="Block-style line breaks, preserved indentation, numbered stanzas. Toggle rhyme-scheme view to see the pattern the poet composed in."
      layout="mockup-left"
      bgClass="bg-background"
    >
      <div
        ref={isReduced ? undefined : containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[280px] relative overflow-hidden"
        aria-label="Verse formatting with rhyme-scheme toggle"
      >
        <div className="flex items-center justify-between mb-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
            Sonnet 18 &middot; Shakespeare
          </p>
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-[10px] font-medium">
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                !showRhyme
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Plain
            </span>
            <span
              className={`px-2 py-0.5 rounded-full transition-colors ${
                showRhyme
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              Rhyme
            </span>
          </div>
        </div>

        <div className="font-serif text-sm text-foreground leading-[2] space-y-0.5 relative">
          {SONNET.map((line) => (
            <div key={line.n} className="flex gap-3 items-baseline">
              <span className="text-[10px] text-muted-foreground w-4 tabular-nums">
                {line.n}
              </span>
              <span className="flex-1 relative">
                {line.text}
                <AnimatePresence>
                  {showRhyme && (
                    <motion.span
                      key="r"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="absolute -right-6 top-1/2 -translate-y-1/2 text-[10px] font-bold tabular-nums"
                      style={{ color: RHYME_COLORS[line.rhyme] }}
                    >
                      {line.rhyme}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </div>
          ))}

          {/* Rhyme arcs */}
          <AnimatePresence>
            {showRhyme && (
              <motion.svg
                key="arcs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="absolute right-2 top-[10px] bottom-2 w-6 pointer-events-none"
                viewBox="0 0 20 140"
                preserveAspectRatio="none"
              >
                <path
                  d="M 4 14 Q 18 50, 4 86"
                  fill="none"
                  stroke={RHYME_COLORS.A}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
                <path
                  d="M 4 42 Q 18 78, 4 114"
                  fill="none"
                  stroke={RHYME_COLORS.B}
                  strokeWidth="1.5"
                  strokeOpacity="0.5"
                />
              </motion.svg>
            )}
          </AnimatePresence>
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
