"use client"

/**
 * JourneyDayMap — the journey's day-map view (explore mode).
 *
 * A vertical PathMap trail of day nodes in the book's world palette
 * (macbeth storm tokens), with journey stats (Wisdom, Flame, Seals,
 * progress ring) above and a full day list below for fast navigation
 * and screen-reader clarity. Node states derive from persisted progress:
 * sequential unlock, replayable completed days, milestone Seal nodes,
 * and a Stoa-arch final node.
 */
import { motion, useReducedMotion } from "framer-motion"
import { PathMap, type PathNodeSpec } from "@/components/game"
import { FlameMeter, ProgressRing, SealMedallion, WisdomChip } from "@/components/rewards"
import { la } from "@/components/trials/session/shared"
import type { JourneyTemplate } from "@/lib/journeys/types"
import { journeyFlame, type JourneyProgress, journeyCompletedCount, journeyCurrentDay, journeyDayState, journeyTotalWisdom } from "@/lib/journeys/progress"

export interface JourneyDayMapProps {
  template: JourneyTemplate
  progress: JourneyProgress
  onSelectDay: (day: number) => void
  onOpenRecord: () => void
  onReset: () => void
}

/** Storm-palette node layout: gentle serpentine down the trail. */
function nodePositions(count: number, width: number, height: number): { x: number; y: number }[] {
  const padY = 40
  const usable = height - padY * 2
  const cx = width / 2
  const amplitude = width * 0.22
  return Array.from({ length: count }, (_, i) => {
    const t = count === 1 ? 0 : i / (count - 1)
    return {
      x: Math.round(cx + Math.sin(t * Math.PI * 2.4) * amplitude),
      y: Math.round(padY + t * usable),
    }
  })
}

export function JourneyDayMap({ template, progress, onSelectDay, onOpenRecord, onReset }: JourneyDayMapProps) {
  const reduced = useReducedMotion() === true
  const totalDays = template.days.length
  const completedCount = journeyCompletedCount(progress)
  const totalWisdom = journeyTotalWisdom(progress)
  const flame = journeyFlame(progress)
  const currentDay = journeyCurrentDay(progress, totalDays)
  const complete = completedCount >= totalDays

  const MAP_W = 400
  const MAP_H = Math.max(600, totalDays * 96)
  const positions = nodePositions(totalDays, MAP_W, MAP_H)

  const nodes: PathNodeSpec[] = template.days.map((day, index) => {
    const state = journeyDayState(progress, day.day)
    const isFinal = day.day === totalDays
    const kind: PathNodeSpec["kind"] = isFinal ? "stoa" : day.milestoneSeal ? "seal" : "chapter"
    return {
      id: `day-${day.day}`,
      kind,
      state: state === "done" ? "done" : day.day === currentDay ? "current" : state === "available" ? "available" : "locked",
      label: `Day ${day.day}`,
      x: positions[index]!.x,
      y: positions[index]!.y,
    }
  })

  const seals: { sealId: string; name: string; earned: boolean }[] = [
    ...template.days
      .filter((d) => d.milestoneSeal)
      .map((d) => ({
        sealId: d.milestoneSeal!.sealId,
        name: d.milestoneSeal!.name,
        earned: progress.seals.includes(d.milestoneSeal!.sealId),
      })),
    {
      sealId: template.finalReward.sealId,
      name: template.finalReward.sealName,
      earned: progress.seals.includes(template.finalReward.sealId),
    },
  ]

  return (
    <div className="mx-auto w-full max-w-5xl space-y-10 px-4 pb-16 sm:px-6">
      {/* header — explore mode, storm palette */}
      <header className="space-y-3 pt-10 text-center">
        <p
          className="font-sans text-xs uppercase tracking-[0.3em]"
          style={{ color: "var(--la-world-macbeth-glow)" }}
        >
          A Fourteen-Day Journey
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl" style={{ color: "var(--la-ink-inverse)" }}>
          {template.title}
        </h1>
        <p className="mx-auto max-w-xl font-sans text-sm sm:text-base" style={{ color: "var(--la-world-macbeth-glow)" }}>
          {template.tagline}
        </p>
        <p className="font-sans text-xs" style={{ color: "var(--la-world-macbeth-glow)", opacity: 0.7 }}>
          Showcase journey · progress is kept on this device only
        </p>
      </header>

      {/* stats bar */}
      <div
        className="mx-auto flex max-w-2xl flex-wrap items-center justify-center gap-4 rounded-2xl px-6 py-4"
        style={{ background: "color-mix(in srgb, var(--la-world-macbeth-deep) 72%, transparent)", border: "1px solid color-mix(in srgb, var(--la-world-macbeth-glow) 22%, transparent)" }}
      >
        <ProgressRing value={completedCount} max={totalDays} label={`${completedCount} of ${totalDays} days complete`} size={64} />
        <WisdomChip amount={totalWisdom} size="md" />
        <FlameMeter state={flame.state} days={flame.days} size="md" />
        <button
          type="button"
          onClick={onOpenRecord}
          className="min-h-11 rounded-full px-5 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
          style={{ background: "var(--la-world-macbeth-accent)", color: "#232a3d" }}
        >
          {complete ? "View learning record" : "Record so far"}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="min-h-11 rounded-full px-4 font-sans text-xs uppercase tracking-widest underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
          style={{ color: "var(--la-world-macbeth-glow)" }}
        >
          Start over
        </button>
      </div>

      {/* seals */}
      <section aria-label="Journey Seals" className="space-y-3">
        <h2 className="text-center font-sans text-xs uppercase tracking-[0.25em]" style={{ color: "var(--la-world-macbeth-glow)" }}>
          Seals of the storm
        </h2>
        <div
          className="flex flex-wrap items-start justify-center gap-6 rounded-2xl px-4 py-5"
          style={{ background: "var(--la-surface)" }}
        >
          {seals.map((seal) => (
            <SealMedallion
              key={seal.sealId}
              sealId={seal.sealId}
              name={seal.name}
              size={84}
              state={seal.earned ? "unlocked" : "locked"}
            />
          ))}
        </div>
      </section>

      {/* the trail + the day list */}
      <div className="grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-start">
        <motion.section
          aria-label="Journey path"
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4"
          style={{ background: "color-mix(in srgb, var(--la-world-macbeth-deep) 60%, transparent)", border: "1px solid color-mix(in srgb, var(--la-world-macbeth-glow) 18%, transparent)" }}
        >
          <PathMap
            nodes={nodes}
            width={MAP_W}
            height={MAP_H}
            label="Fourteen-day path through Macbeth"
            onNodeActivate={(id) => {
              const day = Number(id.replace("day-", ""))
              const spec = nodes.find((n) => n.id === id)
              if (Number.isFinite(day) && spec && spec.state !== "locked") onSelectDay(day)
            }}
          />
        </motion.section>

        <nav aria-label="All journey days" className="space-y-2">
          <h2 className="font-sans text-xs uppercase tracking-[0.25em]" style={{ color: "var(--la-world-macbeth-glow)" }}>
            The fourteen days
          </h2>
          <ol className="space-y-1.5">
            {template.days.map((day) => {
              const state = journeyDayState(progress, day.day)
              const locked = state === "locked"
              const isCurrent = day.day === currentDay
              const result = progress.days[String(day.day)]
              return (
                <li key={day.day}>
                  <button
                    type="button"
                    disabled={locked}
                    onClick={() => onSelectDay(day.day)}
                    aria-current={isCurrent ? "step" : undefined}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl px-4 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] disabled:cursor-not-allowed"
                    style={{
                      background: locked
                        ? "transparent"
                        : isCurrent
                          ? "var(--la-surface)"
                          : "color-mix(in srgb, var(--la-world-macbeth-deep) 55%, transparent)",
                      border: isCurrent
                        ? "2px solid var(--la-world-macbeth-accent)"
                        : "1px solid color-mix(in srgb, var(--la-world-macbeth-glow) 18%, transparent)",
                      opacity: locked ? 0.45 : 1,
                    }}
                  >
                    <span
                      className="font-mono text-xs"
                      style={{ color: isCurrent ? la.wisdomDeep : "var(--la-world-macbeth-glow)" }}
                    >
                      {String(day.day).padStart(2, "0")}
                    </span>
                    <span
                      className="flex-1 font-serif text-sm"
                      style={{ color: isCurrent ? la.ink : locked ? "var(--la-world-macbeth-glow)" : "var(--la-ink-inverse)" }}
                    >
                      {day.title}
                      {day.milestoneSeal && (
                        <span className="ml-2 font-sans text-xs" style={{ color: isCurrent ? "var(--la-seal)" : "var(--la-world-macbeth-accent)" }}>
                          ✦ {day.milestoneSeal.name}
                        </span>
                      )}
                    </span>
                    <span className="font-sans text-xs" style={{ color: isCurrent ? la.inkMuted : "var(--la-world-macbeth-glow)" }}>
                      {state === "done"
                        ? `Done · +${result?.wisdomEarned ?? 0}`
                        : isCurrent
                          ? "Up next"
                          : locked
                            ? "Locked"
                            : "Open"}
                    </span>
                  </button>
                </li>
              )
            })}
          </ol>
        </nav>
      </div>
    </div>
  )
}
