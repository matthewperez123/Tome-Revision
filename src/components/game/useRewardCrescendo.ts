"use client"

/**
 * useRewardCrescendo — post-Trial reward choreography orchestrator.
 *
 * Sequences the earned rewards in a fixed, skippable order
 * (motion principle 2: ceremony is short and never blocks):
 *
 *   wisdom → level → flame → seal → stoa
 *
 *   1. wisdom  — Wisdom count-up + sparkle (wisdomCountUp)
 *   2. level   — level check / crest ceremony (levelUp)
 *   3. flame   — Flame secured ignition (flameSecured)
 *   4. seal    — Seal reveal coin-turn (sealReveal)
 *   5. stoa    — Stoa restoration teaser (stoaRestoration)
 *
 * Only steps with something to celebrate are enabled. Each step:
 *   - auto-advances after its duration,
 *   - can be ended early with skip(),
 *   - the whole sequence ends instantly with skipAll().
 *
 * Reduced motion: every duration collapses and the final state
 * settles instantly — same information, no choreography.
 */

import { useReducedMotion } from "framer-motion"
import { useCallback, useEffect, useMemo, useState } from "react"
import { playSound, type SoundCueId } from "@/lib/game/sound"

export type CrescendoStepId = "wisdom" | "level" | "flame" | "seal" | "stoa"

export interface CrescendoStep {
  readonly id: CrescendoStepId
  /** Choreography length in ms (0 under reduced motion). */
  readonly durationMs: number
  readonly sound: SoundCueId | null
}

export interface RewardCrescendoInput {
  /** Wisdom just awarded; count-up step runs when > 0. */
  readonly wisdomAward?: number
  /** Whether the award crossed a level threshold. */
  readonly leveledUp?: boolean
  /** Whether the Flame was secured by this activity. */
  readonly flameSecured?: boolean
  /** Seal earned at this moment, if any. */
  readonly sealEarned?: { readonly sealId: string; readonly name: string } | null
  /** Stoa tile restored at this moment (tile id), if any. */
  readonly stoaTileRestored?: string | null
}

export interface RewardCrescendo {
  /** Enabled steps in presentation order. */
  readonly steps: readonly CrescendoStep[]
  /** Currently playing step, null when idle or finished. */
  readonly activeStep: CrescendoStepId | null
  /** Index into steps of the active step (-1 when not running). */
  readonly activeIndex: number
  /** True once the sequence has finished or been skipped whole. */
  readonly done: boolean
  /** True while the sequence is playing. */
  readonly running: boolean
  /** End the current step early and move on. */
  readonly skip: () => void
  /** Finish the whole crescendo immediately. */
  readonly skipAll: () => void
}

const STEP_LIBRARY: Record<CrescendoStepId, { durationMs: number; sound: SoundCueId | null }> = {
  wisdom: { durationMs: 1000, sound: "wisdom-sparkle" },
  level: { durationMs: 1100, sound: "seal-resonance" },
  flame: { durationMs: 720, sound: "flame-ignition" },
  seal: { durationMs: 900, sound: "seal-resonance" },
  stoa: { durationMs: 1200, sound: "stoa-restoration" },
}

export function useRewardCrescendo(input: RewardCrescendoInput): RewardCrescendo {
  const reduced = useReducedMotion() === true

  const steps = useMemo<readonly CrescendoStep[]>(() => {
    const enabled: CrescendoStepId[] = []
    if ((input.wisdomAward ?? 0) > 0) enabled.push("wisdom")
    if (input.leveledUp) enabled.push("level")
    if (input.flameSecured) enabled.push("flame")
    if (input.sealEarned) enabled.push("seal")
    if (input.stoaTileRestored) enabled.push("stoa")
    return enabled.map((id) => ({
      id,
      durationMs: reduced ? 0 : STEP_LIBRARY[id].durationMs,
      sound: reduced ? null : STEP_LIBRARY[id].sound,
    }))
  }, [input.wisdomAward, input.leveledUp, input.flameSecured, input.sealEarned, input.stoaTileRestored, reduced])

  const [activeIndex, setActiveIndex] = useState(-1)
  const [done, setDone] = useState(false)

  // Restart when the step sequence changes identity — React-sanctioned
  // state adjustment during render (no effect needed to start).
  const stepsKey = steps.map((s) => s.id).join(",")
  const [prevKey, setPrevKey] = useState<string | null>(null)
  if (prevKey !== stepsKey) {
    setPrevKey(stepsKey)
    if (steps.length === 0) {
      setActiveIndex(-1)
      setDone(true)
    } else {
      setActiveIndex(0)
      setDone(false)
    }
  }

  const advance = useCallback(
    (fromIndex: number) => {
      const next = fromIndex + 1
      if (next >= steps.length) {
        setActiveIndex(-1)
        setDone(true)
        return
      }
      setActiveIndex(next)
    },
    [steps.length],
  )

  // Drive the active step: cue its sound, then auto-advance. Reduced
  // motion durations are 0 → steps settle on the next tick, same order.
  useEffect(() => {
    if (activeIndex < 0 || activeIndex >= steps.length) return
    const step = steps[activeIndex]!
    if (step.sound) playSound(step.sound)
    const id = window.setTimeout(() => advance(activeIndex), Math.max(0, step.durationMs))
    return () => window.clearTimeout(id)
  }, [activeIndex, steps, advance])

  const skip = useCallback(() => {
    if (activeIndex >= 0) advance(activeIndex)
  }, [activeIndex, advance])

  const skipAll = useCallback(() => {
    setActiveIndex(-1)
    setDone(true)
  }, [])

  return {
    steps,
    activeStep: activeIndex >= 0 && activeIndex < steps.length ? steps[activeIndex]!.id : null,
    activeIndex,
    done,
    running: activeIndex >= 0,
    skip,
    skipAll,
  }
}
