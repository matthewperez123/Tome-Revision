"use client"

import { motion } from "motion/react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

// Reader loop target: ~5s.
const PHASES = [
  { name: "scene", duration: 800 },
  { name: "hamlet", duration: 1100 },
  { name: "stage", duration: 900 },
  { name: "horatio", duration: 1100 },
  { name: "reset", duration: 300 },
]

const SPEAKERS = {
  HAMLET: "#2563EB",
  HORATIO: "#059669",
} as const

type Beat =
  | { kind: "direction"; text: string }
  | { kind: "line"; speaker: keyof typeof SPEAKERS; text: string }

const SCRIPT: Beat[] = [
  { kind: "line", speaker: "HAMLET", text: "Angels and ministers of grace defend us!" },
  { kind: "line", speaker: "HAMLET", text: "Be thou a spirit of health or goblin damn\u2019d," },
  { kind: "direction", text: "[The Ghost beckons HAMLET.]" },
  { kind: "line", speaker: "HORATIO", text: "It beckons you to go away with it," },
  { kind: "line", speaker: "HORATIO", text: "As if it some impartment did desire" },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function PlaysFormattingShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const reveal = {
    scene: 0,
    hamlet: 2,
    stage: 3,
    horatio: 5,
    reset: 5,
  } as const
  const revealCount = reveal[phase as keyof typeof reveal] ?? 0

  return (
    <TeacherShowcaseShell
      heading="Plays, staged on the page."
      subcopy="Speaker names in distinct colors, stage directions italicized, scene breaks preserved. The rhythm of a performance, held in type."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div
        ref={isReduced ? undefined : containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px]"
        aria-label="Plays formatting with speakers and stage directions"
      >
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
          Hamlet &middot; Shakespeare
        </p>
        <p className="text-[11px] font-semibold text-foreground mb-4">
          Act I, Scene iv &mdash; The platform before the castle
        </p>

        <div className="font-serif text-sm leading-[1.8] space-y-2">
          {SCRIPT.map((beat, i) => {
            const visible = isReduced ? true : i < revealCount
            if (beat.kind === "direction") {
              return (
                <motion.p
                  key={i}
                  initial={isReduced ? false : { opacity: 0, y: 4 }}
                  animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="italic text-xs text-muted-foreground pl-8"
                >
                  {beat.text}
                </motion.p>
              )
            }
            return (
              <motion.div
                key={i}
                initial={isReduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 4 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="flex gap-3"
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wider w-16 shrink-0 pt-[3px]"
                  style={{ color: SPEAKERS[beat.speaker] }}
                >
                  {beat.speaker}
                </span>
                <span className="text-foreground flex-1">{beat.text}</span>
              </motion.div>
            )
          })}
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
