"use client"

/**
 * Virgil — the animated runtime.
 *
 * - Driven by semantic events via useVirgilMachine → reduceVirgil; never by
 *   arbitrary timers. The only scheduled callback is ANIMATION_COMPLETE,
 *   fired when a transient state's own animation has finished.
 * - Framer Motion transforms + opacity only (no layout properties).
 * - Pauses when the tab hides: visibilitychange dispatches APP_HIDDEN →
 *   sleep state parks every loop; APP_VISIBLE returns with welcomeBack.
 * - Reduced motion (media query or prop): every state renders its still
 *   pose with a 150ms opacity crossfade. Loops and blink never run.
 * - Accessible: role="img" label + a visually-hidden polite live region
 *   announcing only state changes that carry meaning.
 */

import { motion, useReducedMotion } from "framer-motion"
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react"
import { VIRGIL_VARIANTS } from "@/lib/virgil/variants"
import { VIRGIL_STATES, reduceVirgil } from "@/lib/virgil/state-machine"
import type {
  VirgilEvent,
  VirgilStateId,
  VirgilVariantId,
} from "@/lib/virgil/types"
import { VIRGIL_EXPRESSIONS } from "./expressions"
import { resolveVirgilPose } from "./poses"
import {
  Cloak,
  Face,
  GroundShadow,
  LanternArm,
  LanternGlow,
  Motif,
  OpenBook,
  Pupils,
  Satchel,
} from "./parts"

/* ── state machine hook ─────────────────────────────────────────────── */

export interface VirgilMachine {
  state: VirgilStateId
  announcement: string | null
  dispatch: (event: VirgilEvent) => void
}

export function useVirgilMachine(initial: VirgilStateId = "idle"): VirgilMachine {
  const [state, setState] = useState<VirgilStateId>(initial)
  const [announcement, setAnnouncement] = useState<string | null>(null)
  const stateRef = useRef(state)
  const completionTimer = useRef<number | null>(null)
  stateRef.current = state

  const clearCompletion = useCallback(() => {
    if (completionTimer.current !== null) {
      window.clearTimeout(completionTimer.current)
      completionTimer.current = null
    }
  }, [])

  const scheduleCompletion = useCallback(
    (entered: VirgilStateId) => {
      clearCompletion()
      const defn = VIRGIL_STATES[entered]
      if (defn.kind !== "transient") return
      // ANIMATION_COMPLETE is the animation-finished event: scheduled for
      // exactly this state's animation duration, cancelled on hide/unmount.
      completionTimer.current = window.setTimeout(() => {
        completionTimer.current = null
        const t = reduceVirgil(stateRef.current, { type: "ANIMATION_COMPLETE" })
        if (!t.unchanged) {
          stateRef.current = t.state
          setState(t.state)
          if (t.announcement) setAnnouncement(t.announcement)
          scheduleCompletion(t.state)
        }
      }, defn.durationMs ?? 1200)
    },
    [clearCompletion],
  )

  const dispatch = useCallback(
    (event: VirgilEvent) => {
      const t = reduceVirgil(stateRef.current, event)
      if (t.unchanged) return
      stateRef.current = t.state
      setState(t.state)
      if (t.announcement) setAnnouncement(t.announcement)
      scheduleCompletion(t.state)
    },
    [scheduleCompletion],
  )

  // Pause on hidden tab: APP_HIDDEN parks all loops in the sleep state.
  useEffect(() => {
    const onVisibility = () => {
      dispatch({ type: document.hidden ? "APP_HIDDEN" : "APP_VISIBLE" })
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => document.removeEventListener("visibilitychange", onVisibility)
  }, [dispatch])

  useEffect(() => clearCompletion, [clearCompletion])

  return { state, announcement, dispatch }
}

/* ── animation config ───────────────────────────────────────────────── */

const SPRING = { type: "spring", stiffness: 260, damping: 24 } as const
const REDUCED = { duration: 0.15, ease: "easeOut" } as const

interface LoopConfig {
  figureY?: number[]
  figureScaleY?: number[]
  lanternRotate?: number[]
  glowOpacity?: [number, number]
  pupilsX?: number[]
  pupilsY?: number[]
  headRotate?: number[]
  headY?: number[]
  armRotate?: number[]
  loopDuration: number
}

function loopConfigFor(state: VirgilStateId, glow: number): LoopConfig | null {
  switch (state) {
    case "idle":
      return {
        figureY: [0, -3, 0],
        lanternRotate: [3.5, -3.5, 3.5],
        glowOpacity: [glow, Math.min(1, glow + 0.12)],
        loopDuration: 3.4,
      }
    case "compactIdle":
      return { figureY: [0, -2.5, 0], loopDuration: 3.6 }
    case "readAlong":
      return { pupilsY: [3, 4.5, 3], figureY: [0, -2, 0], loopDuration: 4 }
    case "think":
      return { pupilsX: [-3, -4.5, -3], lanternRotate: [1.5, -1.5, 1.5], loopDuration: 3.2 }
    case "searchText":
      return { lanternRotate: [-8, 8, -8], pupilsX: [-4, 4, -4], loopDuration: 1.8 }
    case "explain":
      return { armRotate: [-10, -2, -10], headY: [0, 1.5, 0], loopDuration: 2.2 }
    case "compare":
      return { armRotate: [-12, 2, -12], headRotate: [4, -4, 4], loopDuration: 2.6 }
    case "loading":
      return { lanternRotate: [-6, 6, -6], pupilsX: [-3, 3, -3], loopDuration: 1.8 }
    default:
      return null
  }
}

/* ── component ──────────────────────────────────────────────────────── */

export interface VirgilProps {
  state: VirgilStateId
  variant?: VirgilVariantId
  size?: number
  bust?: boolean
  /** animation timescale, 0.25–4 (default 1) */
  speed?: number
  /** override the prefers-reduced-motion media query */
  reducedMotion?: boolean
  /** live-region announcement from useVirgilMachine */
  announcement?: string | null
  className?: string
}

export function Virgil({
  state,
  variant = "canon",
  size = 256,
  bust = false,
  speed = 1,
  reducedMotion: reducedMotionOverride,
  announcement,
  className,
}: VirgilProps) {
  const gradientUid = `virgil-glow-${useId().replace(/:/g, "")}`
  const systemReduced = useReducedMotion()
  const reduced = reducedMotionOverride ?? systemReduced ?? false

  const defn = VIRGIL_STATES[state]
  const pose = resolveVirgilPose(state)
  const expression = VIRGIL_EXPRESSIONS[pose.expression]
  const variantDef = VIRGIL_VARIANTS[variant]
  const palette = variantDef.palette

  const s = Math.min(4, Math.max(0.25, speed))
  const loop = reduced ? null : loopConfigFor(state, pose.glow)
  const loopDuration = (loop?.loopDuration ?? 3) / s
  const celebratory =
    !reduced && defn.kind === "transient" &&
    (defn.category === "assessment" || defn.category === "reward")
  const blink =
    !reduced &&
    state !== "sleep" &&
    (expression.eyes === "open" || expression.eyes === "soft" || expression.eyes === "wink")

  const valueTransition = reduced ? REDUCED : SPRING

  const figureAnimate = useMemo(
    () =>
      reduced
        ? { opacity: 1 }
        : {
            y: loop?.figureY ?? pose.bodyY,
            rotate: pose.bodyLean,
            scaleY: celebratory ? [1, 0.96, 1.04, 1] : loop?.figureScaleY ?? pose.squash,
            opacity: 1,
          },
    [reduced, loop, pose, celebratory],
  )

  const figureTransition = reduced
    ? REDUCED
    : loop?.figureY
      ? { duration: loopDuration, repeat: Infinity, ease: "easeInOut" as const }
      : celebratory
        ? { duration: 0.7 / s, ease: "easeOut" as const }
        : SPRING

  return (
    <span className={className} style={{ display: "inline-block", lineHeight: 0 }}>
      <motion.svg
        viewBox={bust ? "56 14 128 150" : "0 0 240 320"}
        width={size}
        height={bust ? Math.round((size * 150) / 128) : Math.round((size * 320) / 240)}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Virgil — ${defn.label}`}
        data-virgil-state={state}
        data-reduced-motion={reduced ? "true" : undefined}
        initial={false}
      >
        <defs>
          <radialGradient id={gradientUid} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={variantDef.glow} stopOpacity={0.85} />
            <stop offset="55%" stopColor={variantDef.glow} stopOpacity={0.32} />
            <stop offset="100%" stopColor={variantDef.glow} stopOpacity={0} />
          </radialGradient>
        </defs>

        <motion.g
          data-part="figure"
          style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          animate={figureAnimate}
          transition={figureTransition}
        >
          {!bust && <GroundShadow palette={palette} />}

          <motion.g
            data-part="arm"
            style={{ transformBox: "fill-box", transformOrigin: "37% 11%" }}
            animate={
              reduced
                ? { rotate: pose.armAngle, y: pose.lanternLift }
                : {
                    rotate: loop?.armRotate ?? pose.armAngle,
                    y: pose.lanternLift,
                  }
            }
            transition={
              reduced
                ? REDUCED
                : loop?.armRotate
                  ? { duration: loopDuration, repeat: Infinity, ease: "easeInOut" as const }
                  : valueTransition
            }
          >
            <motion.g
              data-part="lantern-swing"
              style={{ transformBox: "fill-box", transformOrigin: "50% 36%" }}
              animate={
                reduced
                  ? { rotate: pose.lanternSwing }
                  : { rotate: loop?.lanternRotate ?? pose.lanternSwing }
              }
              transition={
                reduced
                  ? REDUCED
                  : loop?.lanternRotate
                    ? { duration: loopDuration, repeat: Infinity, ease: "easeInOut" as const }
                    : valueTransition
              }
            >
              <motion.g
                data-part="glow"
                animate={{ opacity: reduced ? pose.glow : (loop?.glowOpacity ?? pose.glow) }}
                transition={
                  reduced
                    ? REDUCED
                    : loop?.glowOpacity
                      ? { duration: loopDuration, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" as const }
                      : valueTransition
                }
              >
                <LanternGlow palette={palette} gradientId={gradientUid} />
              </motion.g>
              <LanternArm palette={palette} />
            </motion.g>
          </motion.g>

          <Cloak palette={palette} />

          {!bust && (
            <motion.g
              data-part="satchel"
              style={{ transformBox: "fill-box", transformOrigin: "50% 19%" }}
              animate={reduced ? { rotate: 0 } : { rotate: loop?.lanternRotate ? [-2, 2, -2] : pose.satchelSwing }}
              transition={
                reduced
                  ? REDUCED
                  : loop?.lanternRotate
                    ? { duration: loopDuration, repeat: Infinity, ease: "easeInOut" as const }
                    : valueTransition
              }
            >
              <Satchel palette={palette} />
            </motion.g>
          )}

          <motion.g
            data-part="head"
            style={{ transformBox: "fill-box", transformOrigin: "50% 65%" }}
            animate={
              reduced
                ? { rotate: pose.headTilt, x: pose.headX, y: pose.headY }
                : {
                    rotate: loop?.headRotate ?? pose.headTilt,
                    x: pose.headX,
                    y: loop?.headY ?? pose.headY,
                  }
            }
            transition={
              reduced
                ? REDUCED
                : loop?.headRotate || loop?.headY
                  ? { duration: loopDuration, repeat: Infinity, ease: "easeInOut" as const }
                  : valueTransition
            }
          >
            {/* face base + brows + mouth (pupils/lids composed separately) */}
            <Face palette={palette} expression={expression} pupils={false} lids={false} />

            {/* pupils translate for glances; wrapped separately from lids */}
            <motion.g
              data-part="pupil-drift"
              animate={
                reduced
                  ? { x: pose.eyeLookX, y: pose.eyeLookY }
                  : {
                      x: loop?.pupilsX ?? pose.eyeLookX,
                      y: loop?.pupilsY ?? pose.eyeLookY,
                    }
              }
              transition={
                reduced
                  ? REDUCED
                  : loop?.pupilsX || loop?.pupilsY
                    ? { duration: loopDuration, repeat: Infinity, ease: "easeInOut" as const }
                    : valueTransition
              }
            >
              <Pupils palette={palette} expression={expression} />
            </motion.g>

            {/* blink: eyelid layer scaleY, pure keyframes — no timers */}
            {blink && (
              <motion.g
                data-part="blink"
                style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 0, 1, 0, 0] }}
                transition={{
                  duration: 4.6 / s,
                  times: [0, 0.9, 0.94, 0.97, 1],
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <rect x={97} y={99} width={14} height={19} rx={7} fill={palette.face} />
                <rect x={129} y={99} width={14} height={19} rx={7} fill={palette.face} />
              </motion.g>
            )}
          </motion.g>

          <Motif motif={variantDef.motif} color={palette.laurel} />

          {!bust && pose.bookOpen && <OpenBook palette={palette} />}
        </motion.g>
      </motion.svg>

      {/* live region: only meaningful state changes announce */}
      <span
        role="status"
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {announcement ?? ""}
      </span>
    </span>
  )
}
