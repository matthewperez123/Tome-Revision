"use client"

/**
 * Shared primitives for the Trial session UI.
 *
 * All colors come from the Living Archive tokens (--la-* custom properties,
 * see src/styles/living-archive.css); motion comes from the tactile presets
 * in src/lib/design/motion.ts via pickTactile. No new colors are invented.
 */
import { motion } from "framer-motion"
import type { CSSProperties, ReactNode } from "react"
import type { QuestionFeedback } from "@/lib/trials/engine"
import type { TrialFamily, TrialItem, TrialResponseByFamily } from "@/lib/trials/types"

// ── Renderer contract ────────────────────────────────────

/** Props every family renderer receives from the TrialPlayer. */
export interface FamilyRendererProps<F extends TrialFamily = TrialFamily> {
  item: Extract<TrialItem, { family: F }>
  /** Session seed — all shuffles derive from this, never Math.random. */
  seed: string | number
  /** True once the engine has recorded an answer for this attempt. */
  answered: boolean
  /** Engine feedback for the latest attempt (null while pending). */
  feedback: QuestionFeedback | null
  /** The raw response the learner submitted for the latest attempt. */
  lastResponse: TrialResponseByFamily[F] | null
  /** Option/item ids the learner ruled out (distractor elimination). */
  eliminated: string[]
  onToggleEliminate?: (optionId: string) => void
  onSubmit: (response: TrialResponseByFamily[F]) => void
  /** Reduced-motion preference (resolved by the shell). */
  reduced: boolean
}

// ── Family metadata ──────────────────────────────────────

export const FAMILY_LABELS: Record<TrialFamily, string> = {
  "fill-the-line": "Fill the Line",
  "find-the-evidence": "Find the Evidence",
  "word-in-context": "Word in Context",
  "match-pairs": "Match the Pairs",
  "who-said-it": "Who Said It?",
  recitation: "Recitation",
  "multiple-choice": "Multiple Choice",
  "true-false-with-reason": "True or False — and Why",
  ordering: "Put It in Order",
  "close-reading": "Close Reading",
  "passage-identification": "Name the Passage",
  "vocabulary-in-context": "Vocabulary in Context",
  "cross-reference": "Cross-Reference",
  reflection: "Reflection",
  "short-answer": "Short Answer",
}

export const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"] as const

// ── Token shortcuts ──────────────────────────────────────

export const la = {
  page: "var(--la-page)",
  surface: "var(--la-surface)",
  surfaceRaised: "var(--la-surface-raised)",
  surfaceSunken: "var(--la-surface-sunken)",
  ink: "var(--la-ink)",
  inkMuted: "var(--la-ink-muted)",
  inkFaint: "var(--la-ink-faint)",
  primary: "var(--la-primary)",
  primaryInk: "var(--la-primary-ink)",
  primaryEdge: "var(--la-primary-edge)",
  primarySoft: "var(--la-primary-soft)",
  wisdom: "var(--la-wisdom)",
  wisdomDeep: "var(--la-wisdom-deep)",
  wisdomInk: "var(--la-wisdom-ink)",
  wisdomSoft: "var(--la-wisdom-soft)",
  flame: "var(--la-flame)",
  flameSoft: "var(--la-flame-soft)",
  success: "var(--la-success)",
  successSoft: "var(--la-success-soft)",
  nearMiss: "var(--la-near-miss)",
  nearMissSoft: "var(--la-near-miss-soft)",
  error: "var(--la-error)",
  errorSoft: "var(--la-error-soft)",
  focus: "var(--la-focus)",
  radiusS: "var(--la-radius-s)",
  radiusM: "var(--la-radius-m)",
  radiusL: "var(--la-radius-l)",
  shadowRaised: "var(--la-shadow-raised)",
} as const

// ── Option row (choice families) ─────────────────────────

export type OptionVisualState =
  | "idle"
  | "eliminated"
  | "correct"
  | "wrong"
  | "near-miss"
  | "dimmed"

export function optionStyle(state: OptionVisualState): CSSProperties {
  switch (state) {
    case "correct":
      return { borderColor: la.success, background: la.successSoft, color: la.ink }
    case "wrong":
      return { borderColor: la.error, background: la.errorSoft, color: la.ink }
    case "near-miss":
      return { borderColor: la.nearMiss, background: la.nearMissSoft, color: la.ink }
    case "eliminated":
      return {
        borderColor: "transparent",
        background: la.surfaceSunken,
        color: la.inkFaint,
        textDecoration: "line-through",
        opacity: 0.6,
      }
    case "dimmed":
      return { borderColor: la.surfaceSunken, background: la.surface, color: la.inkFaint }
    default:
      return { borderColor: la.surfaceSunken, background: la.surfaceRaised, color: la.ink }
  }
}

interface OptionRowProps {
  letter: string
  text: string
  state: OptionVisualState
  disabled: boolean
  /** Distractor note surfaced after answering (why this tempts). */
  note?: string
  onSelect: () => void
  onEliminate?: () => void
  selectLabel?: string
}

/**
 * One selectable option row: letter chip + text + optional rule-out control.
 * A real <button>, so keyboard focus/activation and visible focus rings come
 * free; the rule-out control is a sibling button (no nested interactives).
 */
export function OptionRow({
  letter,
  text,
  state,
  disabled,
  note,
  onSelect,
  onEliminate,
  selectLabel,
}: OptionRowProps) {
  const style = optionStyle(state)
  return (
    <div
      className="flex items-stretch gap-2"
      data-option-state={state}
    >
      <motion.button
        type="button"
        onClick={onSelect}
        disabled={disabled || state === "eliminated"}
        aria-label={selectLabel ?? `Option ${letter}: ${text}`}
        whileTap={disabled ? undefined : { scale: 0.985 }}
        className="flex flex-1 items-center gap-3 border-2 px-4 py-3 text-left font-serif text-base leading-snug transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-default"
        style={{
          ...style,
          borderRadius: la.radiusM,
          outlineColor: la.focus,
          minHeight: 48,
        }}
      >
        <span
          aria-hidden
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-sans font-semibold"
          style={{
            borderColor: style.borderColor === "transparent" ? la.inkFaint : style.borderColor,
            color: state === "idle" ? la.inkMuted : style.color,
            background: state === "correct" ? la.success : state === "wrong" ? la.error : state === "near-miss" ? la.nearMiss : "transparent",
            ...(state === "correct" || state === "wrong" || state === "near-miss" ? { color: la.primaryInk } : {}),
          }}
        >
          {letter}
        </span>
        <span className="flex-1">
          {text}
          {note && (state === "wrong" || state === "near-miss" || state === "correct") && (
            <span className="mt-1 block text-sm" style={{ color: la.inkMuted }}>
              {note}
            </span>
          )}
        </span>
      </motion.button>
      {onEliminate && !disabled && state !== "eliminated" && (
        <button
          type="button"
          onClick={onEliminate}
          aria-label={`Rule out option ${letter}`}
          title="Rule out (X)"
          className="w-10 shrink-0 border-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{
            borderRadius: la.radiusM,
            borderColor: la.surfaceSunken,
            color: la.inkFaint,
            background: la.surface,
            outlineColor: la.focus,
          }}
        >
          ✕
        </button>
      )}
    </div>
  )
}

// ── Small shared bits ────────────────────────────────────

/** Keyboard hint chip. */
export function Kbd({ children }: { children: ReactNode }) {
  return (
    <kbd
      className="inline-flex min-w-[1.5rem] items-center justify-center border px-1.5 py-0.5 font-sans text-[11px] font-medium"
      style={{
        borderRadius: la.radiusS,
        borderColor: la.surfaceSunken,
        background: la.surfaceSunken,
        color: la.inkMuted,
      }}
    >
      {children}
    </kbd>
  )
}

/** Passage card used by choice families that carry a passage. */
export function PassageCard({
  citation,
  children,
  highlight,
}: {
  citation?: string
  children: ReactNode
  highlight?: string
}) {
  return (
    <figure
      className="border-l-4 py-3 pl-4 pr-3"
      style={{ borderColor: la.wisdom, background: la.surface, borderRadius: `0 ${la.radiusM} ${la.radiusM} 0` }}
    >
      <blockquote className="font-serif text-lg leading-relaxed" style={{ color: la.ink }}>
        {highlight ? <HighlightPhrase text={String(children)} phrase={highlight} /> : children}
      </blockquote>
      {citation && (
        <figcaption className="mt-2 font-sans text-xs uppercase tracking-wider" style={{ color: la.inkFaint }}>
          {citation}
        </figcaption>
      )}
    </figure>
  )
}

/** Underline one phrase inside a text (evidence/focus highlight). */
export function HighlightPhrase({ text, phrase }: { text: string; phrase: string }) {
  const at = text.toLowerCase().indexOf(phrase.toLowerCase())
  if (at < 0) return <>{text}</>
  return (
    <>
      {text.slice(0, at)}
      <mark
        className="px-0.5"
        style={{ background: la.wisdomSoft, color: la.ink, borderRadius: la.radiusS, boxDecorationBreak: "clone" }}
      >
        {text.slice(at, at + phrase.length)}
      </mark>
      {text.slice(at + phrase.length)}
    </>
  )
}

/** Primary action button (Check / Continue / Try again). */
export function TrialActionButton({
  children,
  onClick,
  disabled,
  variant = "primary",
  autoFocus,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: "primary" | "ghost"
  autoFocus?: boolean
}) {
  const primary = variant === "primary"
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      className="px-6 py-3 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 disabled:opacity-50"
      style={{
        borderRadius: la.radiusM,
        background: primary ? la.primary : "transparent",
        color: primary ? la.primaryInk : la.primary,
        border: primary ? "none" : `2px solid ${la.primary}`,
        outlineColor: la.focus,
        minHeight: 48,
      }}
    >
      {children}
    </motion.button>
  )
}
