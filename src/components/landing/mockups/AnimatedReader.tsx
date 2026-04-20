"use client"

import { motion, AnimatePresence } from "motion/react"
import { useAnimationLoop } from "../useAnimationLoop"

// Reader-side loop target: ~5.5s per cycle.
const PHASES = [
  { name: "chapter", duration: 1500 },
  { name: "canto", duration: 1500 },
  { name: "scene", duration: 1500 },
  { name: "reset", duration: 400 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

type Unit = {
  crumb: string
  unitLabel: string
  unitNumber: string
  heading: string
  body: React.ReactNode
  progress: number
}

const UNITS: Record<string, Unit> = {
  chapter: {
    crumb: "The Odyssey · Homer",
    unitLabel: "Book",
    unitNumber: "I",
    heading: "The Gods in Council",
    body: (
      <>
        Tell me, O muse, of that ingenious hero who travelled far and wide
        after he had sacked the famous town of Troy. Many cities did he visit,
        and many were the nations with whose manners and customs he was
        acquainted&hellip;
      </>
    ),
    progress: 0.28,
  },
  canto: {
    crumb: "The Divine Comedy · Dante",
    unitLabel: "Canto",
    unitNumber: "I",
    heading: "The Dark Wood",
    body: (
      <>
        <em>Nel mezzo del cammin di nostra vita</em>
        <br />
        <em>mi ritrovai per una selva oscura,</em>
        <br />
        <em>ché la diritta via era smarrita.</em>
      </>
    ),
    progress: 0.42,
  },
  scene: {
    crumb: "Hamlet · Shakespeare",
    unitLabel: "Act I, Scene ii",
    unitNumber: "",
    heading: "A room of state in the castle",
    body: (
      <>
        <span className="font-semibold">HAMLET.</span>{" "}
        O that this too too solid flesh would melt,
        <br />
        Thaw, and resolve itself into a dew!
      </>
    ),
    progress: 0.66,
  },
}

export function AnimatedReader() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const active = phase === "reset" ? "chapter" : phase
  const unit = UNITS[active] ?? UNITS.chapter

  if (isReduced) {
    return (
      <div className="bg-card rounded-xl border border-border p-6 relative overflow-hidden">
        <div className="w-full h-1 bg-muted rounded-full mb-5">
          <div
            className="h-1 bg-primary rounded-full"
            style={{ width: `${UNITS.chapter.progress * 100}%` }}
          />
        </div>
        <UnitCard unit={UNITS.chapter} />
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="bg-card rounded-xl border border-border p-6 relative overflow-hidden min-h-[320px]"
      aria-label="Animated reader with structural unit switching"
    >
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted rounded-full mb-5">
        <motion.div
          className="h-1 bg-primary rounded-full"
          animate={{ width: `${unit.progress * 100}%` }}
          transition={{ duration: 0.5, ease: EASE }}
          style={{ willChange: "transform" }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.35, ease: EASE }}
          style={{ willChange: "transform, opacity" }}
        >
          <UnitCard unit={unit} />
        </motion.div>
      </AnimatePresence>

      {/* Unit-type chips (visual legend) */}
      <div className="absolute bottom-3 left-6 right-6 flex flex-wrap gap-1.5">
        {Object.entries(UNITS).map(([key, u]) => (
          <span
            key={key}
            className={`text-[9px] px-2 py-0.5 rounded-full border transition-colors duration-300 ${
              active === key
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border bg-muted text-muted-foreground"
            }`}
          >
            {u.unitLabel}
          </span>
        ))}
      </div>
    </div>
  )
}

function UnitCard({ unit }: { unit: Unit }) {
  return (
    <>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">
        {unit.crumb}
      </p>
      <div className="flex items-baseline gap-2 mb-3">
        <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">
          {unit.unitLabel}
          {unit.unitNumber ? ` ${unit.unitNumber}` : ""}
        </span>
      </div>
      <h3 className="font-[var(--font-display)] text-base font-semibold text-foreground mb-3">
        {unit.heading}
      </h3>
      <p className="font-serif text-sm text-foreground leading-[1.8]">
        {unit.body}
      </p>
    </>
  )
}
