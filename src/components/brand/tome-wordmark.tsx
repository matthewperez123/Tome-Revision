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
  /**
   * @deprecated kept for backwards compatibility with existing call sites; the
   * Beta indicator is now a flat pill rather than a sized superscript so this
   * prop is a no-op.
   */
  betaPx?: number
}

/**
 * Tome wordmark with optional laurel-gold "Beta" pill.
 *
 * The pill replaces the previous indigo italic superscript ("blue exponent").
 * It sits at the visual midline of the wordmark, gold fill (#C9A84C) with
 * white text, flat — no animation, glow, or gradient. The wordmark itself
 * inherits typography from the parent so each nav surface keeps its own
 * treatment.
 */
export function TomeWordmark({
  showBeta = true,
  color = "currentColor",
  className,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  betaPx: _betaPx,
}: TomeWordmarkProps) {
  return (
    <span
      className={cn("inline-flex items-center gap-1.5 leading-none", className)}
      style={{ color }}
      aria-label={showBeta ? "Tome Beta" : undefined}
    >
      <span>Tome</span>
      {showBeta && (
        <span
          aria-hidden="true"
          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium tracking-wide leading-none"
          style={{
            backgroundColor: "#C9A84C",
            color: "#FFFFFF",
            // Lock the pill's own typography so it never inherits the
            // parent's display font / italic / weight settings.
            fontFamily: "var(--font-sans)",
            fontStyle: "normal",
          }}
        >
          Beta
        </span>
      )}
    </span>
  )
}
