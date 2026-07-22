"use client"

/**
 * RewardCrescendo — beat 6: the post-Trial reward choreography.
 *
 * Sequences the committed reward system (src/components/game/
 * useRewardCrescendo) across five beats, each rendered with the committed
 * reward components:
 *
 *   wisdom  — WisdomChip count-up (+120 on the canonical path, with the
 *             real economy breakdown from src/lib/game/economy)
 *   level   — LevelUpBadge (level curve from the economy)
 *   flame   — FlameMeter ignites: "Today secured"
 *   seal    — SealMedallion reveal: "The Dagger in the Dark"
 *   stoa    — restoration teaser, then the full StoaRestore ceremony
 *             (marks the macbeth reward restored in the showcase store)
 *
 * Every beat is skippable and the whole sequence collapses under reduced
 * motion — the committed hook owns that behavior.
 */

import { useMemo } from "react"
import { useRewardCrescendo, LevelUpBadge } from "@/components/game"
import { FlameMeter, SealMedallion, WisdomChip } from "@/components/rewards"
import { StoaRestore } from "@/components/stoa"
import { getBookExperience } from "@/lib/books/registry"
import {
  sessionAwardLines,
  sessionAwardTotal,
  sessionFlame,
  sessionLevels,
  sessionLeveledUp,
  type SessionOutcome,
} from "@/lib/showcase/session"

export function RewardCrescendo({
  outcome,
  onEnterStoa,
}: {
  outcome: SessionOutcome | null
  onEnterStoa: () => void
}) {
  const award = sessionAwardTotal(outcome)
  const lines = useMemo(() => sessionAwardLines(outcome), [outcome])
  const levels = sessionLevels(outcome)
  const leveledUp = sessionLeveledUp(outcome)
  const flame = useMemo(() => sessionFlame(), [])
  const sealName = getBookExperience("macbeth")?.sealName ?? "The Dagger in the Dark"

  const crescendo = useRewardCrescendo({
    wisdomAward: award,
    leveledUp,
    flameSecured: true,
    sealEarned: { sealId: "macbeth", name: sealName },
    stoaTileRestored: "macbeth",
  })

  const { activeStep, done } = crescendo

  return (
    <section aria-label="Reward crescendo" className="mx-auto max-w-2xl">
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.24em] text-[var(--la-wisdom-deep)]">
        The proving is done
      </p>
      <h2 className="mt-1 text-center font-serif text-2xl text-[var(--la-ink)]">
        What the scene paid you
      </h2>

      {!done && (
        <div
          aria-live="polite"
          className="mt-5 rounded-2xl border border-[var(--la-wisdom)] bg-[var(--la-page)] p-6 text-center shadow-[var(--la-shadow-float,0_8px_28px_rgba(20,27,46,0.12))]"
        >
          {activeStep === "wisdom" && (
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.18em] text-[var(--la-ink-faint)]">
                Wisdom earned
              </p>
              <div className="mt-3 flex justify-center">
                <WisdomChip amount={award} animate size="lg" />
              </div>
              <ul className="mx-auto mt-4 max-w-xs space-y-1 text-left">
                {lines.map((l) => (
                  <li
                    key={l.action}
                    className="flex items-center justify-between font-sans text-xs text-[var(--la-ink-muted)]"
                  >
                    <span>{l.label}{l.conditional ? " · earned this run" : ""}</span>
                    <span className={l.amount > 0 ? "font-semibold text-[var(--la-wisdom-deep)]" : "opacity-50"}>
                      {l.amount > 0 ? `+${l.amount}` : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {activeStep === "level" && (
            <div>
              <LevelUpBadge level={levels.after} show />
              <p className="mt-2 font-sans text-sm text-[var(--la-ink-muted)]">
                Level {levels.before} → <strong className="text-[var(--la-ink)]">Level {levels.after}</strong>
                {" "}on the economy’s own curve
              </p>
            </div>
          )}
          {activeStep === "flame" && (
            <div>
              <FlameMeter state="secured" days={flame.days} size="lg" />
              <p className="mt-2 font-sans text-sm font-semibold text-[var(--la-flame-deep)]">
                Today secured — the hearth holds at {flame.days} days
              </p>
            </div>
          )}
          {activeStep === "seal" && (
            <div>
              <SealMedallion sealId="macbeth" name={sealName} size={110} state="new" />
            </div>
          )}
          {activeStep === "stoa" && (
            <div>
              <p className="font-serif text-lg italic text-[var(--la-ink)]">
                Far off, in a quiet courtyard, an empty niche begins to glow…
              </p>
            </div>
          )}

          <div className="mt-5 flex justify-center gap-2">
            <button
              type="button"
              onClick={crescendo.skip}
              className="rounded-full border border-[var(--la-surface-sunken)] px-4 py-1.5 font-sans text-xs font-semibold text-[var(--la-ink-muted)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
            >
              Skip this beat
            </button>
            <button
              type="button"
              onClick={crescendo.skipAll}
              className="rounded-full px-4 py-1.5 font-sans text-xs text-[var(--la-ink-faint)] hover:bg-[var(--la-surface-sunken)] focus-visible:outline-2 focus-visible:outline-[var(--la-focus)]"
            >
              Skip the ceremony
            </button>
          </div>
        </div>
      )}

      {done && (
        <div className="mt-5 space-y-4">
          <StoaRestore rewardId="macbeth" wisdomAwarded={award} />
          <div className="text-center">
            <button
              type="button"
              onClick={onEnterStoa}
              className="rounded-full bg-[var(--la-primary)] px-6 py-2.5 font-sans text-sm font-semibold text-[var(--la-primary-ink)] hover:bg-[var(--la-primary-edge)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--la-focus)]"
            >
              Enter the Stoa →
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
