"use client"

/**
 * JourneyDayView — one day of a journey: context card → calm reading →
 * Virgil's question → Trial → reward.
 *
 * THE MODE TRANSITION (plan requirement): the day opens in Explore mode —
 * storm-palette world tokens, Virgil present, game chrome visible. When
 * the reader chooses to read, the view crossfades into Reader mode: a
 * committed reader theme (data-theme="reader-day|reader-sepia|reader-
 * night", user-switchable), Literata (font-serif), narrow measure, no
 * game chrome. The transition is announced to assistive technology and
 * collapses to an instant swap under reduced motion. Completing the
 * reading returns to Explore mode for Virgil's question and the Trial.
 *
 * Completion persists via the journey progress store (best-score wins),
 * awards milestone/final Seals, and restores the committed Stoa reward
 * on the final day.
 */
import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { TrialPlayer } from "@/components/trials/session"
import type { CompletionSummary } from "@/lib/trials/engine"
import { Virgil } from "@/components/virgil"
import { WisdomChip } from "@/components/rewards"
import { la } from "@/components/trials/session/shared"
import { crossesLevel, levelForWisdom } from "@/lib/game/economy"
import { isStoaRewardId } from "@/lib/stoa/rewards"
import { restoreReward } from "@/lib/stoa/state"
import type { JourneyDay, JourneyTemplate } from "@/lib/journeys/types"
import { journeyTotalWisdom, useJourneyProgress } from "@/lib/journeys/progress"
import { JourneyCrescendo } from "./JourneyCrescendo"

export interface JourneyDayViewProps {
  template: JourneyTemplate
  day: JourneyDay
  totalDays: number
  onExit: () => void
  onOpenRecord: () => void
}

type Phase = "context" | "reading" | "trial" | "reward"

type ReaderTheme = "reader-day" | "reader-sepia" | "reader-night"

const READER_THEMES: { id: ReaderTheme; label: string }[] = [
  { id: "reader-day", label: "Day" },
  { id: "reader-sepia", label: "Sepia" },
  { id: "reader-night", label: "Night" },
]

interface PendingAward {
  wisdom: number
  leveledUp: boolean
  newLevel: number
  seal: { sealId: string; name: string } | null
  stoaTitle: string | null
}

export function JourneyDayView({ template, day, totalDays, onExit, onOpenRecord }: JourneyDayViewProps) {
  const reduced = useReducedMotion() === true
  const progress = useJourneyProgress(template.id)
  const priorResult = progress.days[String(day.day)]
  const isFinalDay = day.day === totalDays

  const [phase, setPhase] = useState<Phase>("context")
  const [readerTheme, setReaderTheme] = useState<ReaderTheme>("reader-sepia")
  const [trialNonce, setTrialNonce] = useState(0)
  const [pendingAward, setPendingAward] = useState<PendingAward | null>(null)
  const [lastSummary, setLastSummary] = useState<CompletionSummary | null>(null)
  const [announcement, setAnnouncement] = useState("Explore mode")
  const headingRef = useRef<HTMLHeadingElement | null>(null)

  // Move focus to the phase heading on each phase change.
  useEffect(() => {
    headingRef.current?.focus()
  }, [phase])

  const enterPhase = useCallback(
    (next: Phase) => {
      setPhase(next)
      setAnnouncement(next === "reading" ? "Reader mode — calm reading view" : "Explore mode")
    },
    [],
  )

  const handleTrialComplete = useCallback(
    (summary: CompletionSummary) => {
      const wisdomBefore = journeyTotalWisdom(progress)
      const wisdom = summary.wisdomEarned + day.wisdomAward
      const leveledUp = crossesLevel(wisdomBefore, wisdom)
      const newLevel = levelForWisdom(wisdomBefore + wisdom)

      progress.completeDay(day.day, {
        wisdomEarned: wisdom,
        correct: summary.answeredCorrect,
        total: summary.totalQuestions,
      })

      let seal: PendingAward["seal"] = null
      if (day.milestoneSeal) {
        progress.awardSeal(day.milestoneSeal.sealId)
        seal = { sealId: day.milestoneSeal.sealId, name: day.milestoneSeal.name }
      }
      let stoaTitle: string | null = null
      if (isFinalDay) {
        progress.awardSeal(template.finalReward.sealId)
        seal = { sealId: template.finalReward.sealId, name: template.finalReward.sealName }
        progress.restoreStoa()
        if (isStoaRewardId(template.finalReward.stoaRewardId)) {
          restoreReward(template.finalReward.stoaRewardId)
          stoaTitle = "The Storm over the Heath"
        }
      }

      setLastSummary(summary)
      setPendingAward({ wisdom, leveledUp, newLevel, seal, stoaTitle })
    },
    [day, isFinalDay, progress, template.finalReward],
  )

  const handleCrescendoDone = useCallback(() => {
    setPendingAward(null)
    enterPhase("reward")
  }, [enterPhase])

  const dayKicker = `Day ${day.day} of ${totalDays}`
  const target = day.readingTarget

  return (
    <div className="min-h-dvh">
      {/* mode announcement for assistive technology */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <AnimatePresence mode="wait">
        {phase === "reading" ? (
          <motion.div
            key="reading"
            data-theme={readerTheme}
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
            className="min-h-dvh"
            style={{ background: la.page, color: la.ink }}
          >
            {/* ── READER MODE — calm, text-first, no game chrome ── */}
            <div className="mx-auto w-full max-w-2xl px-5 pb-20 pt-8 sm:px-8">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => enterPhase("context")}
                  className="min-h-11 rounded-full px-4 font-sans text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                  style={{ color: la.inkMuted }}
                >
                  ← Leave reader
                </button>
                <div role="group" aria-label="Reader theme" className="flex gap-1">
                  {READER_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setReaderTheme(theme.id)}
                      aria-pressed={readerTheme === theme.id}
                      className="min-h-11 rounded-full px-3 font-sans text-xs focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                      style={{
                        background: readerTheme === theme.id ? la.surfaceSunken : "transparent",
                        color: readerTheme === theme.id ? la.ink : la.inkFaint,
                        fontWeight: readerTheme === theme.id ? 600 : 400,
                      }}
                    >
                      {theme.label}
                    </button>
                  ))}
                </div>
              </div>

              <header className="mt-10 space-y-2 text-center">
                <p className="font-sans text-xs uppercase tracking-[0.3em]" style={{ color: la.inkFaint }}>
                  {target.citation}
                </p>
                <h2 ref={headingRef} tabIndex={-1} className="font-serif text-2xl outline-none sm:text-3xl">
                  {target.excerptTitle}
                </h2>
                {target.excerptIntro && (
                  <p className="font-serif text-base italic" style={{ color: la.inkMuted }}>
                    {target.excerptIntro}
                  </p>
                )}
                <p className="font-sans text-xs" style={{ color: la.inkFaint }}>
                  About {target.estimatedMinutes} minute{target.estimatedMinutes === 1 ? "" : "s"}
                </p>
              </header>

              <div className="mt-10 space-y-1" role="document" aria-label={`Reading excerpt, ${target.citation}`}>
                {target.excerpt.map((line) => (
                  <div key={line.anchor} id={line.anchor}>
                    {line.speaker && (
                      <p
                        className="mt-5 font-sans text-xs font-semibold uppercase tracking-[0.18em]"
                        style={{ color: la.inkFaint }}
                      >
                        {line.speaker}
                      </p>
                    )}
                    <p className="font-serif text-lg leading-8" style={{ color: la.ink }}>
                      {line.text}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-10 text-center font-sans text-xs" style={{ color: la.inkFaint }}>
                {target.sourceNote}
              </p>

              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => enterPhase("trial")}
                  className="min-h-11 rounded-full px-6 py-3 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                  style={{ background: la.primary, color: la.primaryInk }}
                >
                  I’ve read — on to Virgil’s question
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="explore"
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={reduced ? { duration: 0 } : { duration: 0.45, ease: "easeOut" }}
            className="min-h-dvh"
            style={{
              background:
                "radial-gradient(120% 80% at 50% 0%, var(--la-world-macbeth-ground) 0%, var(--la-world-macbeth-deep) 70%)",
            }}
          >
            {/* ── EXPLORE MODE — storm palette, game chrome ── */}
            <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-8 sm:px-6">
              <button
                type="button"
                onClick={onExit}
                className="min-h-11 rounded-full px-4 font-sans text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                style={{ color: "var(--la-world-macbeth-glow)" }}
              >
                ← Back to the path
              </button>

              <header className="mt-6 space-y-2 text-center">
                <p
                  className="font-sans text-xs uppercase tracking-[0.3em]"
                  style={{ color: "var(--la-world-macbeth-glow)" }}
                >
                  {dayKicker}
                  {priorResult ? " · completed — walk it again" : ""}
                </p>
                <h2
                  ref={headingRef}
                  tabIndex={-1}
                  className="font-serif text-3xl outline-none sm:text-4xl"
                  style={{ color: "var(--la-ink-inverse)" }}
                >
                  {day.title}
                </h2>
                {day.subtitle && (
                  <p className="font-serif text-base italic" style={{ color: "var(--la-world-macbeth-glow)" }}>
                    {day.subtitle}
                  </p>
                )}
              </header>

              {phase === "context" && (
                <div className="mt-8 space-y-6">
                  {/* context card */}
                  <section
                    aria-label="Context for today’s reading"
                    className="rounded-2xl p-6"
                    style={{ background: la.surface, boxShadow: la.shadowRaised }}
                  >
                    <p className="font-sans text-xs uppercase tracking-[0.25em]" style={{ color: la.inkFaint }}>
                      Context — before you read
                    </p>
                    <p className="mt-3 font-serif text-base leading-7" style={{ color: la.ink }}>
                      {day.contextCard}
                    </p>
                    <p className="mt-4 font-sans text-xs" style={{ color: la.inkFaint }}>
                      Today’s reading: {target.citation} · about {target.estimatedMinutes} minute
                      {target.estimatedMinutes === 1 ? "" : "s"} · then a {day.trial.length}-question Trial
                    </p>
                  </section>

                  {/* Virgil's question */}
                  <section
                    aria-label="Virgil’s question for today"
                    className="flex items-start gap-4 rounded-2xl p-6"
                    style={{
                      background: "color-mix(in srgb, var(--la-world-macbeth-deep) 72%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--la-world-macbeth-glow) 22%, transparent)",
                    }}
                  >
                    <Virgil state="idle" variant="macbeth" size={72} bust className="shrink-0" />
                    <div>
                      <p className="font-sans text-xs uppercase tracking-[0.25em]" style={{ color: "var(--la-world-macbeth-accent)" }}>
                        Virgil asks
                      </p>
                      <p className="mt-2 font-serif text-base leading-7" style={{ color: "var(--la-ink-inverse)" }}>
                        {day.virgilPrompt}
                      </p>
                    </div>
                  </section>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => enterPhase("reading")}
                      className="min-h-11 rounded-full px-8 py-3 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                      style={{ background: "var(--la-world-macbeth-accent)", color: "#232a3d" }}
                    >
                      Enter reader mode — begin today’s reading
                    </button>
                  </div>
                </div>
              )}

              {phase === "trial" && (
                <div className="mt-8 space-y-6">
                  {/* Virgil's question, asked again at the Trial's door */}
                  <section
                    aria-label="Virgil’s question, once more"
                    className="flex items-start gap-4 rounded-2xl p-5"
                    style={{
                      background: "color-mix(in srgb, var(--la-world-macbeth-deep) 72%, transparent)",
                      border: "1px solid color-mix(in srgb, var(--la-world-macbeth-glow) 22%, transparent)",
                    }}
                  >
                    <Virgil state="think" variant="macbeth" size={64} bust className="shrink-0" />
                    <p className="mt-1 font-serif text-base leading-7" style={{ color: "var(--la-ink-inverse)" }}>
                      {day.virgilPrompt}
                    </p>
                  </section>

                  <div className="rounded-2xl" style={{ background: la.surface, boxShadow: la.shadowRaised }}>
                    <TrialPlayer
                      key={`${day.day}:${trialNonce}`}
                      items={day.trial}
                      seed={`${template.id}:day-${day.day}`}
                      title={`${dayKicker} Trial — ${day.title}`}
                      instruction="Answer from today’s reading. H for hints, Enter to continue."
                      virgilVariant="macbeth"
                      onComplete={handleTrialComplete}
                    />
                  </div>
                </div>
              )}

              {phase === "reward" && (
                <div className="mt-8 space-y-6">
                  <section
                    aria-label="Day complete"
                    className="space-y-4 rounded-2xl p-6 text-center"
                    style={{ background: la.surface, boxShadow: la.shadowRaised }}
                  >
                    <p className="font-sans text-xs uppercase tracking-[0.25em]" style={{ color: la.inkFaint }}>
                      {dayKicker} — complete
                    </p>
                    <h3 className="font-serif text-2xl" style={{ color: la.ink }}>
                      {isFinalDay ? "The storm is walked. All fourteen days." : "Well read. The path continues."}
                    </h3>
                    {lastSummary && (
                      <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
                        {lastSummary.answeredCorrect} of {lastSummary.totalQuestions} correct ·{" "}
                        {lastSummary.firstTryCorrect} first-try · best streak {lastSummary.bestStreak}
                      </p>
                    )}
                    <div className="flex justify-center">
                      <WisdomChip amount={progress.days[String(day.day)]?.wisdomEarned ?? 0} size="lg" />
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 pt-2">
                      {isFinalDay ? (
                        <button
                          type="button"
                          onClick={onOpenRecord}
                          className="min-h-11 rounded-full px-6 py-3 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                          style={{ background: "var(--la-world-macbeth-accent)", color: "#232a3d" }}
                        >
                          See your learning record
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={onExit}
                          className="min-h-11 rounded-full px-6 py-3 font-sans text-sm font-semibold focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                          style={{ background: la.primary, color: la.primaryInk }}
                        >
                          Return to the path
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setTrialNonce((n) => n + 1)
                          enterPhase("trial")
                        }}
                        className="min-h-11 rounded-full px-5 py-3 font-sans text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                        style={{ background: la.surfaceSunken, color: la.ink }}
                      >
                        Walk the Trial again
                      </button>
                      <button
                        type="button"
                        onClick={onExit}
                        className="min-h-11 rounded-full px-5 py-3 font-sans text-sm focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)]"
                        style={{ color: la.inkMuted }}
                      >
                        Back to the path
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <JourneyCrescendo
        open={pendingAward !== null}
        wisdomAward={pendingAward?.wisdom ?? 0}
        leveledUp={pendingAward?.leveledUp ?? false}
        newLevel={pendingAward?.newLevel}
        flameDays={progress.completedCount}
        sealEarned={pendingAward?.seal ?? null}
        stoaRestoredTitle={pendingAward?.stoaTitle ?? null}
        onDone={handleCrescendoDone}
      />
    </div>
  )
}
