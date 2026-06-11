import type { SigilProps } from "./ApprenticeSigil"

/**
 * Laureate sigil (tier key "Master") — a closed laurel crown.
 *
 * Tier 3 / apex of the Trials sigil family: the paired Adept sprig closed
 * into a full wreath, crowning a mastery star. Rendered in the warm gold
 * tier token (var(--codex-tier-laureate)); shares stroke 1.5 + round joins with
 * the lower tiers. The leaf ticks reuse the family's blade curvature.
 */
export function MasterSigil({
  size = 24,
  color = "currentColor",
  ...rest
}: SigilProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {/* Wreath arcs meeting under the crown, open ribbon at the base */}
      <path d="M12 5C7.5 5 4.5 8.4 4.5 12.4C4.5 16 6.4 18.8 9.2 20.2" />
      <path d="M12 5C16.5 5 19.5 8.4 19.5 12.4C19.5 16 17.6 18.8 14.8 20.2" />

      {/* Left leaf ticks */}
      <path d="M5.6 9.2C4.3 9.4 3.8 10.7 4.5 11.9" opacity={0.85} />
      <path d="M4.6 13.4C3.4 13.7 3.1 15 4.1 16" opacity={0.85} />
      <path d="M6.4 17.2C5.3 17.8 5.2 19.1 6.3 19.8" opacity={0.85} />
      {/* Right leaf ticks */}
      <path d="M18.4 9.2C19.7 9.4 20.2 10.7 19.5 11.9" opacity={0.85} />
      <path d="M19.4 13.4C20.6 13.7 20.9 15 19.9 16" opacity={0.85} />
      <path d="M17.6 17.2C18.7 17.8 18.8 19.1 17.7 19.8" opacity={0.85} />

      {/* Mastery star at the crown */}
      <path
        d="M12 8L13.1 10.3L15.6 10.6L13.8 12.4L14.2 14.9L12 13.7L9.8 14.9L10.2 12.4L8.4 10.6L10.9 10.3Z"
        fill={color}
        fillOpacity={0.18}
      />
    </svg>
  )
}
