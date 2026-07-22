"use client"

/**
 * ProgressDock — the learning-game rail on /journey.
 *
 * One column carrying the daily goal (kit DailyGoalCard), Wisdom level on
 * the real economy curve, the next Trial, the current Seal goal, and the
 * most recent Stoa restoration (live from the showcase Stoa store).
 * Numbers are seeded demo values; guided-loop actions raise them live.
 */

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DailyGoalCard } from "@/components/game"
import { ProgressRing, SealMedallion, WisdomChip } from "@/components/rewards"
import { getBookExperience } from "@/lib/books/registry"
import { levelProgress, sealProgressFraction } from "@/lib/game/economy"
import {
  MACBETH_CHAPTER_COUNT,
  MACBETH_TRIAL_COUNT,
  chaptersRead,
  nextTrial,
  trialsPassed,
  unlockRequirement,
} from "@/lib/journey/macbeth-path"
import { useJourneyState } from "@/lib/journey/state"
import { getStoaReward } from "@/lib/stoa/rewards"
import { useStoaState } from "@/lib/stoa/state"

// ── Seeded demo story ────────────────────────
const SEEDED_TOTAL_WISDOM = 380
const SEEDED_WISDOM_TODAY = 45
const SEEDED_FLAME_DAYS = 6
const DAILY_GOAL_PAGES = 8
const PAGES_READ_BEFORE_LOOP = 3

const FOCUS_RING =
  "outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface)]"

function DockCard({
  title,
  target,
  children,
}: {
  title: string
  target?: string
  children: React.ReactNode
}) {
  return (
    <section
      aria-label={title}
      data-loop-target={target}
      className="rounded-[var(--la-radius-l)] border border-[var(--la-surface-sunken)] bg-[var(--la-surface)] p-5"
      style={{ boxShadow: "var(--la-shadow-raised)" }}
    >
      {children}
    </section>
  )
}

export function ProgressDock() {
  const router = useRouter()
  const { nodesCompleted, wisdomBonus, flameSecuredToday } = useJourneyState()
  const { restored, isRestored } = useStoaState()

  const totalWisdom = SEEDED_TOTAL_WISDOM + wisdomBonus
  const wisdomToday = SEEDED_WISDOM_TODAY + wisdomBonus
  const level = levelProgress(totalWisdom)
  const pagesRead = flameSecuredToday ? DAILY_GOAL_PAGES : PAGES_READ_BEFORE_LOOP

  const macbeth = getBookExperience("macbeth")!
  const read = chaptersRead(nodesCompleted)
  const passed = trialsPassed(nodesCompleted)
  const sealFraction = sealProgressFraction(
    { chaptersRequired: MACBETH_CHAPTER_COUNT, trialsRequired: MACBETH_TRIAL_COUNT },
    { chaptersCompleted: read, trialsPassed: passed },
  )
  const sealPercent = Math.round(sealFraction * 100)

  const trial = nextTrial(nodesCompleted)
  const trialGate = trial ? unlockRequirement(trial.id) : undefined

  // Most recent restoration anywhere in the Stoa; falls back to the
  // Macbeth niche teaser while the courtyard is still empty.
  const latestRewardId = restored[restored.length - 1]
  const teaserReward = latestRewardId
    ? getStoaReward(latestRewardId)
    : getStoaReward("macbeth")
  const teaserRestored = teaserReward ? isRestored(teaserReward.id) : false

  return (
    <div className="flex flex-col gap-5">
      <div data-loop-target="flame">
        <DailyGoalCard
          goalPages={DAILY_GOAL_PAGES}
          pagesRead={pagesRead}
          flameState={flameSecuredToday ? "secured" : "at-risk"}
          flameDays={SEEDED_FLAME_DAYS}
          wisdomToday={wisdomToday}
          onContinue={() => router.push("/read/macbeth")}
          continueLabel="Continue reading"
        />
      </div>

      {/* Wisdom level */}
      <DockCard title="Wisdom level" target="wisdom">
        <div className="flex items-center gap-4">
          <ProgressRing
            value={Math.round(level.fraction * 100)}
            max={100}
            label={`Level ${level.level}, ${Math.round(level.fraction * 100)} percent to the next`}
            size={72}
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--la-ink)]">
              Wisdom level {level.level}
            </p>
            <p className="mt-0.5 text-xs text-[var(--la-ink-muted)]">
              {level.toNext} more Wisdom to level {level.level + 1} — earned by
              reading and proving, never bought.
            </p>
            <div className="mt-2">
              <WisdomChip amount={totalWisdom} size="sm" />
            </div>
          </div>
        </div>
      </DockCard>

      {/* Next Trial */}
      {trial && (
        <DockCard title="Next Trial" target="trial">
          <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--la-secondary-edge)]">
            Next Trial
          </p>
          <h3 className="mt-1.5 text-lg font-bold tracking-tight text-[var(--la-ink)]">
            {trial.title}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-[var(--la-ink-muted)]">
            Trials test {macbeth.trialEmphasis}.
          </p>
          <p className="mt-2 text-xs text-[var(--la-ink-faint)]">
            {trialGate
              ? `Unlocks after ${trialGate.title}.`
              : "Available now."}
          </p>
          <Link
            href="/dev/trials"
            className={`mt-3 inline-flex h-10 items-center rounded-[var(--la-radius-m)] px-4 text-sm font-semibold text-[var(--la-secondary-ink)] ${FOCUS_RING}`}
            style={{
              backgroundColor: "var(--la-secondary-soft)",
              boxShadow: "0 3px 0 var(--la-secondary-edge)",
            }}
          >
            Preview a Trial
          </Link>
        </DockCard>
      )}

      {/* Seal goal */}
      <DockCard title="Current Seal goal" target="seal">
        <div className="flex items-center gap-4">
          <SealMedallion
            sealId="macbeth"
            name={macbeth.sealName}
            size={72}
            state="locked"
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--la-seal-deep)]">
              Seal goal
            </p>
            <h3 className="mt-1 text-base font-bold tracking-tight text-[var(--la-ink)]">
              {macbeth.sealName}
            </h3>
            <p className="mt-1 text-xs text-[var(--la-ink-muted)]">
              Read every chapter and pass every Trial — {read} of{" "}
              {MACBETH_CHAPTER_COUNT} chapters, {passed} of{" "}
              {MACBETH_TRIAL_COUNT} Trials ({sealPercent}%).
            </p>
            <div
              role="progressbar"
              aria-valuenow={sealPercent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Seal progress, ${sealPercent} percent`}
              className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--la-surface-sunken)]"
            >
              <div
                className="h-full rounded-full bg-[var(--la-seal)] transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${sealPercent}%` }}
              />
            </div>
          </div>
        </div>
      </DockCard>

      {/* Stoa teaser */}
      {teaserReward && (
        <DockCard title="The Stoa" target="stoa">
          <div className="flex items-center gap-4">
            <span className="relative block h-24 w-[4.5rem] shrink-0 overflow-hidden rounded-[var(--la-radius-s)] border border-[var(--la-surface-sunken)] bg-[var(--la-surface-sunken)]">
              {teaserRestored ? (
                <Image
                  src={teaserReward.artSrc}
                  alt={teaserReward.altText}
                  width={72}
                  height={96}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="m-3 block h-[4.5rem] rounded-full border border-dashed border-[var(--la-ink-faint)]"
                />
              )}
            </span>
            <div className="min-w-0">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--la-wisdom-deep)]">
                The Stoa
              </p>
              <h3 className="mt-1 text-base font-bold tracking-tight text-[var(--la-ink)]">
                {teaserRestored
                  ? `Recently restored: ${teaserReward.title}`
                  : "An empty niche waits"}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[var(--la-ink-muted)]">
                {teaserRestored
                  ? `${teaserReward.restoredCopy.body} From ${teaserReward.bookTitle}.`
                  : teaserReward.emptyCopy.body}
              </p>
              <Link
                href="/stoa"
                className={`mt-2 inline-flex items-center text-sm font-semibold text-[var(--la-primary)] underline-offset-4 hover:underline ${FOCUS_RING} rounded`}
              >
                Enter the Stoa
                <span aria-hidden="true" className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </DockCard>
      )}
    </div>
  )
}
