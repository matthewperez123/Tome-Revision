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

const STATE_CLASSES: Record<OptionButtonProps["state"], string> = {
  idle:
    "border-stone-300 bg-stone-100 dark:border-[#333333] dark:bg-[#222222] text-foreground hover:border-indigo-400",
  selected:
    "border-indigo-500 bg-indigo-50 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-200",
  correct:
    "border-emerald-500 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/30 dark:text-emerald-200",
  wrong:
    "border-rose-500 bg-rose-50 text-rose-800 dark:border-rose-500 dark:bg-rose-950/30 dark:text-rose-200",
  disabled:
    "border-stone-300 bg-stone-100 dark:border-[#333333] dark:bg-[#1A1A1A] text-muted-foreground opacity-60",
}

const BADGE_CLASSES: Record<OptionButtonProps["state"], string> = {
  idle: "bg-stone-200 text-stone-700 dark:bg-[#2A2A2A] dark:text-[#B0A898]",
  selected: "bg-indigo-500 text-white",
  correct: "bg-emerald-500 text-white",
  wrong: "bg-rose-500 text-white",
  disabled: "bg-stone-200 text-stone-500",
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
  const sizeCls =
    size === "lg"
      ? "px-5 py-5 text-base"
      : size === "sm"
        ? "px-3 py-2 text-xs"
        : "px-4 py-3.5 text-sm"

  return (
    <motion.button
      whileTap={reduced || disabled ? undefined : { scale: 0.97 }}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-pressed={state === "selected" || state === "correct" || state === "wrong"}
      className={`w-full flex items-center gap-3 rounded-xl border-2 transition-all duration-200 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 ${sizeCls} ${STATE_CLASSES[state]} ${disabled ? "cursor-default" : ""}`}
    >
      <span
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold font-sans ${BADGE_CLASSES[state]}`}
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
