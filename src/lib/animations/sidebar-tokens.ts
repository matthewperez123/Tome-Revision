// ─────────────────────────────────────────────
// Sidebar Icon Animation Tokens
// ─────────────────────────────────────────────

import { hues } from "@/lib/design-tokens"

// ── Durations (seconds — Framer Motion format) ──

export const iconDurations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.35,
  slow: 0.5,
  reveal: 0.8,
  maxAnimation: 0.6,
} as const

// ── Spring Configs ──────────────────────────

export const iconSprings = {
  interactive: { type: "spring" as const, stiffness: 300, damping: 25 },
  gentle: { type: "spring" as const, stiffness: 120, damping: 20 },
  snappy: { type: "spring" as const, stiffness: 400, damping: 22 },
  stamp: { type: "spring" as const, stiffness: 500, damping: 18 },
  bookOpen: { type: "spring" as const, stiffness: 200, damping: 15 },
  tilt: { type: "spring" as const, stiffness: 260, damping: 20 },
} as const

// ── Stagger ─────────────────────────────────

export const iconStagger = 0.04

// ── Glow Colors ─────────────────────────────

export const glowColors = {
  gold: hues.gold,
  amber: hues.amber,
  goldAlpha40: "rgba(234, 179, 8, 0.4)",
  goldAlpha20: "rgba(234, 179, 8, 0.2)",
  amberAlpha30: "rgba(245, 158, 11, 0.3)",
  cream: "#FFF8E1",
} as const

// ── Flame Flicker Parameters ────────────────

export const flicker = {
  amplitude: 1.5,
  frequency: 3,
  phaseOffsets: [0, 2.09, 4.19] as const,
} as const

// ── Path Drawing Defaults ───────────────────

export const pathDraw = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: iconDurations.slow, ease: "easeOut" },
  },
} as const

// ── Shared Stroke Attributes ────────────────

export const iconStroke = {
  width: 1.5,
  linecap: "round" as const,
  linejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
} as const

// ── Easing Curves ───────────────────────────

export const iconEase = {
  scholarly: [0.25, 0.46, 0.45, 0.94] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  dactylic: [0.22, 0.61, 0.36, 1] as const,
} as const

// ── Teacher-Specific Tokens ─────────────────
// ~15% heavier visual weight, slower pacing

export const teacherStroke = {
  width: 1.75,
  linecap: "round" as const,
  linejoin: "round" as const,
  vectorEffect: "non-scaling-stroke" as const,
} as const

export const teacherDurations = {
  recite: 0.45,
  oration: 0.6,
  deliberate: 0.75,
} as const

export const teacherStagger = 0.08

export const teacherColors = {
  indigo: hues.indigo,
  indigoAlpha40: "rgba(99, 102, 241, 0.4)",
  indigoAlpha20: "rgba(99, 102, 241, 0.2)",
  goldHighlight: hues.gold,
  goldAlpha30: "rgba(234, 179, 8, 0.3)",
} as const

export const teacherSprings = {
  overshoot: { type: "spring" as const, stiffness: 350, damping: 18 },
  deliberate: { type: "spring" as const, stiffness: 150, damping: 22 },
  authoritative: { type: "spring" as const, stiffness: 280, damping: 24 },
} as const
