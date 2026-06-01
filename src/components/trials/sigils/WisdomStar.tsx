import type { SigilProps } from "./ApprenticeSigil"

/**
 * Wisdom star — 6-pointed star with inner gold gradient.
 * Used for the "+N Wisdom" floating element.
 */
export function WisdomStar({ size = 16, color, ...rest }: SigilProps) {
  const gradId = `wisdom-star-${Math.random().toString(36).slice(2, 8)}`
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      {...rest}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--trial-laureate-bright)" />
          <stop offset="100%" stopColor={color ?? "var(--trial-laureate)"} />
        </radialGradient>
      </defs>
      <path
        d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z"
        fill={`url(#${gradId})`}
        stroke={color ?? "var(--trial-laureate)"}
        strokeWidth={0.75}
        strokeLinejoin="round"
      />
    </svg>
  )
}
