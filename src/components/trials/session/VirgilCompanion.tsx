"use client"

/**
 * VirgilCompanion — the compact Virgil presence in the Trial shell corner.
 *
 * Owns a useVirgilMachine instance (the event-driven 52-state machine); the
 * TrialPlayer forwards engine outcomes as VirgilEvents (HINT_USED level,
 * ANSWER_CORRECT streak, ANSWER_ELEGANT, ANSWER_NEAR_MISS, ANSWER_INCORRECT,
 * WISDOM_EARNED). Reduced motion and tab-hide pausing are handled inside the
 * Virgil runtime itself.
 */
import { forwardRef, useImperativeHandle } from "react"
import { Virgil, useVirgilMachine } from "@/components/virgil"
import type { VirgilEvent, VirgilVariantId } from "@/lib/virgil/types"
import type { VirgilMachine } from "@/components/virgil"

export interface VirgilCompanionHandle {
  dispatch: (event: VirgilEvent) => void
}

export const VirgilCompanion = forwardRef<
  VirgilCompanionHandle,
  {
    variant?: VirgilVariantId
    size?: number
    reducedMotion?: boolean
  }
>(function VirgilCompanion({ variant = "canon", size = 72, reducedMotion }, ref) {
  const machine: VirgilMachine = useVirgilMachine("compactIdle")

  useImperativeHandle(ref, () => ({ dispatch: machine.dispatch }), [machine.dispatch])

  return (
    <Virgil
      state={machine.state}
      variant={variant}
      size={size}
      bust
      reducedMotion={reducedMotion}
      announcement={machine.announcement}
      className="shrink-0"
    />
  )
})
