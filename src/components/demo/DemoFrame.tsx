"use client"

import type { ReactNode } from "react"
import { MousePointerClick, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * DemoFrame — the shared chrome around an interactive homepage demo panel.
 *
 * Renders the demo surface as a bordered card with a subtle "Live demo" badge
 * (so visitors know it's tappable, not a static screenshot) and an optional
 * reset affordance. Theme-token driven — works in day and night.
 */
export function DemoFrame({
  children,
  className,
  label = "Live demo",
  hint = "Try it",
  onReset,
  ariaLabel,
}: {
  children: ReactNode
  className?: string
  /** Badge label, top-left. */
  label?: string
  /** Small affordance hint, top-right (hidden when onReset is provided). */
  hint?: string
  /** When provided, shows a reset button instead of the hint. */
  onReset?: () => void
  ariaLabel?: string
}) {
  return (
    <div
      className={cn(
        "relative rounded-xl border border-border bg-card overflow-hidden",
        className,
      )}
      aria-label={ariaLabel}
    >
      {/* Top affordance row */}
      <div className="flex items-center justify-between px-4 pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
          <span className="size-1.5 rounded-full bg-primary animate-pulse" />
          {label}
        </span>
        {onReset ? (
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <RotateCcw className="size-3" />
            Reset
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-muted-foreground">
            <MousePointerClick className="size-3" />
            {hint}
          </span>
        )}
      </div>

      <div className="p-4 sm:p-5">{children}</div>
    </div>
  )
}
