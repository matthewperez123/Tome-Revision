"use client"

/**
 * Difficulty logo styled like a volume/signal selector: three ascending bars
 * where the first `level` bars are filled in the tier accent and the rest sit
 * muted. Easy = 1 bar, Medium = 2, Hard = 3. Purely decorative (aria-hidden);
 * the surrounding control owns the accessible label.
 */
export function DifficultyBars({
  level,
  size = 22,
  color = "currentColor",
  className,
}: {
  level: 1 | 2 | 3
  size?: number
  color?: string
  className?: string
}) {
  const gap = Math.max(2, Math.round(size * 0.12))
  const barW = (size - gap * 2) / 3
  const heights = [0.5, 0.75, 1]

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "flex-end",
        gap,
        height: size,
        width: size,
      }}
      aria-hidden="true"
    >
      {heights.map((h, i) => {
        const filled = i < level
        return (
          <span
            key={i}
            style={{
              width: barW,
              height: size * h,
              borderRadius: Math.max(1, barW * 0.32),
              background: filled ? color : "var(--muted-foreground)",
              opacity: filled ? 1 : 0.3,
              transition: "opacity 150ms ease, background-color 150ms ease",
            }}
          />
        )
      })}
    </span>
  )
}
