"use client"

/**
 * SealMedallion — the violet mastery medallion, one per book.
 *
 * Contract: { sealId: string; name: string; size?: number; state: 'locked'|'unlocked'|'new' }
 *
 * - 'new' plays the reveal choreography (tactile moment #14
 *   sealReveal): coin-turn (rotateY 90°→0, medallion spring, single
 *   overshoot) + one gold ring pulse + name plate fade.
 * - 'locked' is a silhouette in --la-ink-faint, focusable, and its
 *   description states the earning path — never a paywall.
 * - Motif rotation derives deterministically from sealId so every
 *   book's medallion is distinct without introducing new colors.
 * - Reduced motion: front-on fade, no rotation.
 */

import { motion, useReducedMotion } from "framer-motion"
import { useId } from "react"
import { laSprings } from "@/lib/design/motion"
import { playSound } from "@/lib/game/sound"
import { cn } from "@/lib/utils"

export interface SealMedallionProps {
  sealId: string
  name: string
  size?: number
  state: "locked" | "unlocked" | "new"
}

/** Stable 0..359 rotation from the seal id. */
function motifRotation(sealId: string): number {
  let hash = 0
  for (let i = 0; i < sealId.length; i += 1) {
    hash = (hash * 31 + sealId.charCodeAt(i)) >>> 0
  }
  return hash % 360
}

function monogram(name: string): string {
  const words = name.split(/\s+/).filter(Boolean)
  if (words.length === 0) return "?"
  return words
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("")
}

export function SealMedallion({ sealId, name, size = 96, state }: SealMedallionProps) {
  const reduced = useReducedMotion() === true
  const titleId = useId()
  const locked = state === "locked"
  const revealing = state === "new" && !reduced

  return (
    <span
      className="inline-flex flex-col items-center gap-2"
      role="img"
      aria-labelledby={titleId}
    >
      <span id={titleId} className="sr-only">
        {locked
          ? `Seal of ${name}, locked. Earned by reading every chapter and passing every Trial in this book.`
          : `Seal of ${name}, earned.`}
      </span>
      <motion.span
        tabIndex={0}
        title={
          locked
            ? `Seal of ${name} — earned by completing this book's path.`
            : `Seal of ${name}`
        }
        className={cn(
          "inline-flex rounded-full outline-none [perspective:600px]",
          "focus-visible:ring-[3px] focus-visible:ring-[var(--la-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--la-surface)]",
        )}
        initial={state === "new" ? (reduced ? { opacity: 0 } : { opacity: 0, rotateY: 90, scale: 0.8 }) : false}
        animate={
          state === "new"
            ? reduced
              ? { opacity: 1, transition: { duration: 0.2 } }
              : { opacity: 1, rotateY: 0, scale: 1, transition: laSprings.medallion }
            : { opacity: 1, rotateY: 0, scale: 1 }
        }
        onAnimationComplete={() => {
          if (state === "new") playSound("seal-resonance")
        }}
        style={{ transformStyle: "preserve-3d" }}
      >
        <span className="relative inline-flex">
          <MedallionArt
            size={size}
            locked={locked}
            label={monogram(name)}
            rotation={motifRotation(sealId)}
          />
          {revealing && (
            <motion.span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ border: "3px solid var(--la-wisdom)" }}
              initial={{ opacity: 0.9, scale: 0.9 }}
              animate={{ opacity: 0, scale: 1.35, transition: { duration: 0.6, delay: 0.25 } }}
            />
          )}
        </span>
      </motion.span>
      <motion.span
        className="max-w-[10rem] text-center font-mono text-[11px] uppercase tracking-[0.14em]"
        style={{ color: locked ? "var(--la-ink-faint)" : "var(--la-ink-muted)" }}
        initial={state === "new" ? { opacity: 0 } : false}
        animate={{ opacity: 1 }}
        transition={state === "new" ? { delay: reduced ? 0 : 0.25, duration: 0.3 } : { duration: 0 }}
        aria-hidden="true"
      >
        {name}
      </motion.span>
    </span>
  )
}

function MedallionArt({
  size,
  locked,
  label,
  rotation,
}: {
  size: number
  locked: boolean
  label: string
  rotation: number
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" aria-hidden="true" focusable="false">
      {/* outer gold rim */}
      <circle cx="48" cy="48" r="46" fill={locked ? "none" : "var(--la-wisdom)"} opacity={locked ? 0 : 1} />
      {/* medallion body */}
      <circle
        cx="48"
        cy="48"
        r="42"
        fill={locked ? "none" : "var(--la-seal)"}
        stroke={locked ? "var(--la-ink-faint)" : "var(--la-seal-deep)"}
        strokeWidth={locked ? 2 : 2.5}
        strokeDasharray={locked ? "5 4" : undefined}
      />
      {/* inner ring */}
      <circle
        cx="48"
        cy="48"
        r="34"
        fill="none"
        stroke={locked ? "var(--la-ink-faint)" : "var(--la-seal-soft)"}
        strokeWidth={1.5}
      />
      {/* motif spokes, rotated per seal */}
      {!locked && (
        <g transform={`rotate(${rotation} 48 48)`} stroke="var(--la-seal-deep)" strokeWidth={2} strokeLinecap="round">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line key={deg} x1="48" y1="17" x2="48" y2="23" transform={`rotate(${deg} 48 48)`} />
          ))}
        </g>
      )}
      {locked ? (
        /* lock glyph, same footprint as the monogram */
        <g stroke="var(--la-ink-faint)" strokeWidth={2.4} fill="none" strokeLinecap="round">
          <rect x="39" y="44" width="18" height="14" rx="3" />
          <path d="M42.5 44v-4a5.5 5.5 0 0 1 11 0v4" />
        </g>
      ) : (
        <text
          x="48"
          y="54"
          textAnchor="middle"
          fontSize="22"
          fontWeight={700}
          fontFamily="var(--font-mono, ui-monospace, monospace)"
          fill="var(--la-seal-ink)"
        >
          {label}
        </text>
      )}
    </svg>
  )
}
