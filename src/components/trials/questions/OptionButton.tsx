"use client"

import { motion } from "framer-motion"
import { CheckCircle2, XCircle } from "lucide-react"

export interface OptionButtonProps {
  label: string
  text: string
  state: "idle" | "correct" | "wrong" | "disabled" | "selected"
  disabled: boolean
  size?: "sm" | "md" | "lg"
  onClick: () => void
  reduced: boolean
}

// Token-driven state styles. Border stays 2px in every state so there is no
// layout shift between idle → selected → correct/incorrect. The option label
// always uses --foreground (verified AA on every soft fill); only the leading
// badge swaps to a solid accent with its matching on-accent text.
const STATE_STYLE: Record<
  OptionButtonProps["state"],
  { borderColor: string; background: string; color: string }
> = {
  idle: {
    borderColor: "var(--border)",
    background: "var(--card)",
    color: "var(--foreground)",
  },
  selected: {
    borderColor: "var(--codex-primary)",
    background: "var(--codex-primary-soft)",
    color: "var(--foreground)",
  },
  correct: {
    borderColor: "var(--codex-success)",
    background: "var(--codex-success-soft)",
    color: "var(--foreground)",
  },
  wrong: {
    borderColor: "var(--codex-danger)",
    background: "var(--codex-danger-soft)",
    color: "var(--foreground)",
  },
  disabled: {
    borderColor: "var(--border)",
    background: "var(--muted)",
    color: "var(--muted-foreground)",
  },
}

const BADGE_STYLE: Record<
  OptionButtonProps["state"],
  { background: string; color: string }
> = {
  idle: { background: "var(--muted)", color: "var(--muted-foreground)" },
  selected: { background: "var(--codex-primary)", color: "var(--codex-on-primary)" },
  correct: { background: "var(--codex-success)", color: "var(--codex-success-on)" },
  wrong: { background: "var(--codex-danger)", color: "var(--codex-danger-on)" },
  disabled: { background: "var(--muted)", color: "var(--muted-foreground)" },
}

export function OptionButton({
  label,
  text,
  state,
  disabled,
  size = "md",
  onClick,
  reduced,
}: OptionButtonProps) {
  // Sizes on the 4px grid; md clears a 44px touch target (16px text + 16px×2
  // padding ≈ 56px) and reads at body size for legibility.
  const sizeCls =
    size === "lg"
      ? "px-5 py-5 text-lg gap-3.5"
      : size === "sm"
        ? "px-3 py-2.5 text-sm gap-2.5"
        : "px-4 py-4 text-base gap-3"

  const isHoverable = state === "idle" && !disabled

  return (
    <motion.button
      whileTap={reduced || disabled ? undefined : { scale: 0.98 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={state === "selected" || state === "correct" || state === "wrong"}
      style={{ ...STATE_STYLE[state], borderRadius: "var(--codex-radius-btn)" }}
      className={`w-full min-h-[44px] flex items-center border-2 transition-[background-color,border-color,box-shadow] duration-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--codex-primary)] focus-visible:ring-offset-2 ${sizeCls} ${isHoverable ? "hover:border-[var(--codex-primary)] hover:bg-[var(--codex-primary-soft)]" : ""} ${disabled ? "cursor-default" : ""} ${state === "disabled" ? "opacity-60" : ""}`}
    >
      <span
        style={BADGE_STYLE[state]}
        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold font-sans"
      >
        {state === "correct" ? (
          <CheckCircle2 className="w-4 h-4" />
        ) : state === "wrong" ? (
          <XCircle className="w-4 h-4" />
        ) : (
          label
        )}
      </span>
      <span className="leading-snug font-serif">{text}</span>
    </motion.button>
  )
}
