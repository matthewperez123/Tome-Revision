"use client"

/**
 * JourneyExperience — the top-level journey orchestrator.
 *
 * Three views: the day map (explore mode, storm palette), one day
 * (context → reader → trial → reward), and the shareable learning
 * record. Progress comes from the journey showcase store
 * (`tome-showcase:journey:<id>`), so map state survives reloads and the
 * whole journey can be reset with one click.
 *
 * Reusability: this component is fully data-driven from the validated
 * JourneyTemplate — see src/lib/journeys/types.ts for the plug-in steps
 * for another book.
 */
import { useCallback, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import type { JourneyTemplate } from "@/lib/journeys/types"
import { useJourneyProgress } from "@/lib/journeys/progress"
import { JourneyDayMap } from "./JourneyDayMap"
import { JourneyDayView } from "./JourneyDayView"
import { JourneyRecord } from "./JourneyRecord"

export interface JourneyExperienceProps {
  template: JourneyTemplate
}

type View = { kind: "map" } | { kind: "day"; day: number } | { kind: "record" }

export function JourneyExperience({ template }: JourneyExperienceProps) {
  const reduced = useReducedMotion() === true
  const progress = useJourneyProgress(template.id)
  const [view, setView] = useState<View>({ kind: "map" })
  const [confirmReset, setConfirmReset] = useState(false)

  const goMap = useCallback(() => setView({ kind: "map" }), [])
  const goDay = useCallback((day: number) => setView({ kind: "day", day }), [])
  const goRecord = useCallback(() => setView({ kind: "record" }), [])

  const handleReset = useCallback(() => {
    if (!confirmReset) {
      setConfirmReset(true)
      return
    }
    progress.reset()
    setConfirmReset(false)
    setView({ kind: "map" })
  }, [confirmReset, progress])

  const selectedDay =
    view.kind === "day" ? template.days.find((d) => d.day === view.day) : undefined

  return (
    <main
      className="min-h-dvh"
      style={{
        background:
          view.kind === "day"
            ? "transparent"
            : "radial-gradient(120% 90% at 50% 0%, var(--la-world-macbeth-ground) 0%, var(--la-world-macbeth-deep) 65%)",
      }}
    >
      <AnimatePresence mode="wait">
        {view.kind === "map" && (
          <motion.div
            key="map"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          >
            <JourneyDayMap
              template={template}
              progress={progress}
              onSelectDay={goDay}
              onOpenRecord={goRecord}
              onReset={handleReset}
            />
            {confirmReset && (
              <p
                role="alert"
                className="mx-auto -mt-6 max-w-5xl px-4 pb-8 text-center font-sans text-sm"
                style={{ color: "var(--la-world-macbeth-accent)" }}
              >
                Press “Start over” once more to erase this journey’s progress on this device.
              </p>
            )}
          </motion.div>
        )}
        {view.kind === "day" && selectedDay && (
          <motion.div
            key={`day-${selectedDay.day}`}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25 }}
          >
            <JourneyDayView
              template={template}
              day={selectedDay}
              totalDays={template.days.length}
              onExit={goMap}
              onOpenRecord={goRecord}
            />
          </motion.div>
        )}
        {view.kind === "record" && (
          <motion.div
            key="record"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.25 }}
            className="mx-auto w-full max-w-4xl px-4 pb-20 pt-10 sm:px-6"
          >
            <button
              type="button"
              onClick={goMap}
              className="min-h-11 rounded-full px-4 font-sans text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
              style={{ color: "var(--la-world-macbeth-glow)" }}
            >
              ← Back to the path
            </button>
            <div className="mt-6 space-y-3">
              <h1 className="font-serif text-3xl" style={{ color: "var(--la-ink-inverse)" }}>
                Your learning record
              </h1>
              <p className="font-sans text-sm" style={{ color: "var(--la-world-macbeth-glow)" }}>
                Everything below is drawn from your real progress on this device — days walked,
                Wisdom earned, Seals held. Nothing is claimed that you have not done.
              </p>
              <div className="pt-4" style={{ colorScheme: "light" }}>
                <JourneyRecord template={template} progress={progress} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
