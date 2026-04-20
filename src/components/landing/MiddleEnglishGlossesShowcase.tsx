"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

// Reader loop target: ~5s.
const PHASES = [
  { name: "read", duration: 1000 },
  { name: "tap1", duration: 1400 },
  { name: "tap2", duration: 1600 },
  { name: "reset", duration: 400 },
]

const GLOSSED_LINE = [
  { text: "Whan that " },
  { word: "Aprille", gloss: "April", key: "aprille" },
  { text: " with his " },
  { word: "shoures soote", gloss: "sweet showers", key: "shoures" },
  { text: "," },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function MiddleEnglishGlossesShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const activeGloss = phase === "tap1" ? "aprille" : phase === "tap2" ? "shoures" : null

  return (
    <TeacherShowcaseShell
      heading="Middle English, made readable."
      subcopy="Read Chaucer, Malory, or Gawain in the original. Tap any hard word for a modern paraphrase \u2014 word-level glosses that keep you in the text, not the footnotes."
      layout="mockup-right"
      bgClass="bg-background"
    >
      <div
        ref={isReduced ? undefined : containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[260px] relative overflow-hidden"
        aria-label="Middle English glosses demonstration"
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
          The Canterbury Tales &middot; General Prologue
        </p>
        <p className="text-[11px] font-semibold text-foreground mb-4">
          Chaucer &middot; c. 1387
        </p>

        <div className="font-serif text-base text-foreground leading-[1.9] mb-4">
          {GLOSSED_LINE.map((part, i) => {
            if ("text" in part) return <span key={i}>{part.text}</span>
            const active = activeGloss === part.key
            return (
              <span key={i} className="relative inline-block">
                <motion.span
                  className="border-b border-dashed cursor-pointer"
                  animate={{
                    color: active ? "#6366F1" : "currentColor",
                    borderColor: active
                      ? "#6366F1"
                      : "hsl(var(--muted-foreground) / 0.4)",
                  }}
                  transition={{ duration: 0.2, ease: EASE }}
                >
                  {part.word}
                </motion.span>
                <AnimatePresence>
                  {active && (
                    <motion.span
                      key="pop"
                      initial={{ opacity: 0, y: 4, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.25, ease: EASE }}
                      className="absolute left-1/2 -translate-x-1/2 top-full mt-1 rounded-md border border-border bg-background shadow-md px-2.5 py-1 text-[11px] text-muted-foreground whitespace-nowrap z-10"
                    >
                      <span className="text-indigo-500 font-semibold mr-1">
                        =
                      </span>
                      {part.gloss}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            )
          })}
          <span className="block mt-1 text-sm text-muted-foreground">
            The droghte of March hath perced to the roote,
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-indigo-500 inline-block" />
          Dotted underline = tap for gloss
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
