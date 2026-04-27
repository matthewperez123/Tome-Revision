import { cn } from "@/lib/utils"

export interface TomeWordmarkProps {
  showBeta?: boolean
  /** Optional override for the wordmark colour. Defaults to `currentColor` so
   *  the wordmark inherits whatever foreground colour its parent sets. */
  color?: string
  /** Classes applied to the outer span — use this for font, weight, size,
   *  tracking, etc. The component does NOT impose its own typography so the
   *  call site can keep whatever style the previous hardcoded `<span>` had. */
  className?: string
  /** Pixel size of the Beta superscript. Defaults to 8px (sized to sit
   *  comfortably above a `text-sm` wordmark; tune per use site if needed). */
  betaPx?: number
}

/**
 * Tome wordmark with optional indigo italic "Beta" superscript.
 *
 * The component intentionally does not impose font / size / colour — those are
 * inherited from the parent so each nav surface keeps its own treatment. The
 * only opinion this component has is where the "Beta" sits and how it looks.
 */
export function TomeWordmark({
  showBeta = true,
  color = "currentColor",
  className,
  betaPx = 8,
}: TomeWordmarkProps) {
  return (
    <span
      className={cn("relative inline-flex leading-none", className)}
      style={{ color }}
    >
      Tome
      {showBeta && (
        <span
          aria-label="Beta"
          className="pointer-events-none absolute italic font-serif leading-none"
          style={{
            top: -Math.round(betaPx * 0.35),
            right: -Math.round(betaPx * 1.9),
            fontSize: betaPx,
            color: "#6366F1",
          }}
        >
          Beta
        </span>
      )}
    </span>
  )
}
