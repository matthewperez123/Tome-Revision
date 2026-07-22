"use client"

/**
 * PathNode — a typed stop on the journey trail.
 *
 * Contract: { state: 'locked'|'available'|'current'|'done'; kind: 'chapter'|'trial'|'seal'|'stoa'; label: string }
 * (optional extras: onActivate — contract fields unchanged.)
 *
 * Shape carries content type (component-inventory §2):
 *   chapter → circle disc with book glyph
 *   trial   → diamond
 *   seal    → star medallion
 *   stoa    → column arch
 *
 * - locked → available plays pathNodeUnlock (wake pop, moment #16).
 * - 48px hit area, Enter/Space activates, focus ring always visible.
 * - Locked nodes stay focusable with aria-disabled + the earning
 *   path in the description — never silent dead ends.
 * - Reduced motion: state swap only, ring appears pre-drawn.
 */

import { motion, useReducedMotion } from "framer-motion"
import { useEffect, useState } from "react"
import { playSound } from "@/lib/game/sound"
import { cn } from "@/lib/utils"

export interface PathNodeProps {
  state: "locked" | "available" | "current" | "done"
  kind: "chapter" | "trial" | "seal" | "stoa"
  label: string
  /** Called on Enter/Space/click when the node is not locked. */
  onActivate?: () => void
}

const HIT = 48

export function PathNode({ state, kind, label, onActivate }: PathNodeProps) {
  const reduced = useReducedMotion() === true

  // Derive the just-unlocked beat during render (React-sanctioned
  // state adjustment): true only on the locked→unlocked transition.
  const [prevState, setPrevState] = useState(state)
  let justUnlocked = false
  if (prevState !== state) {
    justUnlocked = prevState === "locked" && state !== "locked"
    setPrevState(state)
  }

  useEffect(() => {
    if (justUnlocked && !reduced) playSound("hint-chime")
  }, [justUnlocked, reduced])

  const locked = state === "locked"
  const done = state === "done"
  const interactive = !locked && onActivate !== undefined

  const handleKey = (event: React.KeyboardEvent) => {
    if (!interactive) return
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      onActivate()
    }
  }

  return (
    <motion.span
      role={interactive || locked ? "button" : undefined}
      tabIndex={interactive || locked ? 0 : undefined}
      aria-disabled={locked || undefined}
      aria-label={
        locked
          ? `${label}, locked. Complete the previous chapter to unlock.`
          : state === "current"
            ? `${label}, current step.`
            : done
              ? `${label}, completed.`
              : label
      }
      onClick={interactive ? onActivate : undefined}
      onKeyDown={handleKey}
      className={cn(
        "relative inline-flex select-none items-center justify-center outline-none",
        "focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-page)]",
        interactive && "cursor-pointer",
      )}
      style={{ width: HIT, height: HIT, borderRadius: kind === "chapter" ? "50%" : "var(--la-radius-m)" }}
      initial={false}
      animate={state}
      variants={{
        locked: { opacity: 0.55, scale: 0.94 },
        available: justUnlocked
          ? reduced
            ? { opacity: 1, transition: { duration: 0.15 } }
            : { opacity: 1, scale: [0.94, 1.1, 1], transition: { duration: 0.6, times: [0, 0.6, 1], ease: [0.34, 1.56, 0.64, 1] } }
          : { opacity: 1, scale: 1 },
        current: { opacity: 1, scale: 1 },
        done: { opacity: 1, scale: 1 },
      }}
      whileHover={interactive && !reduced ? { scale: 1.06 } : undefined}
      whileTap={interactive && !reduced ? { scale: 0.94, y: 2 } : undefined}
    >
      <NodeShape kind={kind} state={state} />
      {state === "current" && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ border: "2px solid var(--la-primary)" }}
          animate={reduced ? { opacity: 0.8 } : { opacity: [0.3, 0.9, 0.3], scale: [1, 1.08, 1] }}
          transition={reduced ? { duration: 0 } : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      )}
    </motion.span>
  )
}

function NodeShape({ kind, state }: { kind: PathNodeProps["kind"]; state: PathNodeProps["state"] }) {
  const locked = state === "locked"
  const done = state === "done"
  const fill = locked
    ? "var(--la-surface-sunken)"
    : done
      ? "var(--la-success)"
      : "var(--la-primary)"
  const glyph = locked ? "var(--la-ink-faint)" : done ? "var(--la-success-soft)" : "var(--la-primary-ink)"

  switch (kind) {
    case "chapter":
      return (
        <svg width={36} height={36} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
          <circle cx="18" cy="18" r="16" fill={fill} stroke={locked ? "var(--la-ink-faint)" : "none"} strokeWidth={1.5} strokeDasharray={locked ? "4 3" : undefined} />
          {locked ? (
            <LockGlyph x={18} y={18} color={glyph} />
          ) : (
            <path d="M13 12h6.5a2 2 0 0 1 2 2v10a2 2 0 0 0-2-2H13V12Zm0 0v10m0-10h-1.5v10H13" fill="none" stroke={glyph} strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" transform="translate(1.5 0)" />
          )}
          {done && <CheckGlyph color={glyph} />}
        </svg>
      )
    case "trial":
      return (
        <svg width={36} height={36} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
          <rect x="7" y="7" width="22" height="22" rx="4" transform="rotate(45 18 18)" fill={fill} stroke={locked ? "var(--la-ink-faint)" : "none"} strokeWidth={1.5} strokeDasharray={locked ? "4 3" : undefined} />
          {locked ? (
            <LockGlyph x={18} y={18} color={glyph} />
          ) : (
            <path d="M14 13.5h8M14 18h8M14 22.5h5" stroke={glyph} strokeWidth={1.7} strokeLinecap="round" />
          )}
          {done && <CheckGlyph color={glyph} />}
        </svg>
      )
    case "seal":
      return (
        <svg width={36} height={36} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
          <path
            d="M18 4l3.6 7.3 8 1.2-5.8 5.7 1.4 8L18 22.4l-7.2 3.8 1.4-8-5.8-5.7 8-1.2L18 4Z"
            fill={locked ? "var(--la-surface-sunken)" : done ? "var(--la-success)" : "var(--la-seal)"}
            stroke={locked ? "var(--la-ink-faint)" : done ? "var(--la-success-soft)" : "var(--la-seal-deep)"}
            strokeWidth={1.4}
            strokeDasharray={locked ? "4 3" : undefined}
            strokeLinejoin="round"
          />
          {locked && <LockGlyph x={18} y={16} color={glyph} />}
        </svg>
      )
    case "stoa":
      return (
        <svg width={36} height={36} viewBox="0 0 36 36" aria-hidden="true" focusable="false">
          <path
            d="M8 30V16a10 10 0 0 1 20 0v14"
            fill="none"
            stroke={locked ? "var(--la-ink-faint)" : done ? "var(--la-success)" : "var(--la-secondary)"}
            strokeWidth={3}
            strokeDasharray={locked ? "4 3" : undefined}
            strokeLinecap="round"
          />
          <path d="M6 30h24" stroke={locked ? "var(--la-ink-faint)" : done ? "var(--la-success)" : "var(--la-secondary)"} strokeWidth={3} strokeLinecap="round" />
          {locked && <LockGlyph x={18} y={22} color={glyph} />}
        </svg>
      )
  }
}

function LockGlyph({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g stroke={color} strokeWidth={1.7} fill="none" strokeLinecap="round" transform={`translate(${x - 5} ${y - 5})`}>
      <rect x="1" y="4" width="8" height="6" rx="1.5" />
      <path d="M3 4V2.5a2 2 0 0 1 4 0V4" />
    </g>
  )
}

function CheckGlyph({ color }: { color: string }) {
  return (
    <path
      d="M13 18.5l3.4 3.4L24 14.5"
      fill="none"
      stroke={color}
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}
