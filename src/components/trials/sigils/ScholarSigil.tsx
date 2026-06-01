import type { SigilProps } from "./ApprenticeSigil"

/**
 * Adept sigil (tier key "Scholar") — a paired laurel sprig rising in a V.
 *
 * Tier 2 of the Trials sigil family: the single Initiate leaf doubled into
 * two mirrored blades springing from a shared base node. Same leaf
 * primitive, stroke 1.5, round joins, and half-opacity midribs as Initiate.
 */
export function ScholarSigil({
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
      {/* Left blade + stem */}
      <path d="M12 21C12 16.5 10 12.5 6.5 9.5" />
      <path d="M6.5 9.5C3.9 9.9 3 12.6 4.4 15.4C7 15 7.9 12.3 6.5 9.5Z" />
      <path d="M6 11.4C6.4 12.7 6.8 13.7 5.6 14.6" opacity={0.45} />
      {/* Right blade + stem */}
      <path d="M12 21C12 16.5 14 12.5 17.5 9.5" />
      <path d="M17.5 9.5C20.1 9.9 21 12.6 19.6 15.4C17 15 16.1 12.3 17.5 9.5Z" />
      <path d="M18 11.4C17.6 12.7 17.2 13.7 18.4 14.6" opacity={0.45} />
      {/* Base node */}
      <circle cx={12} cy={21} r={0.85} fill={color} stroke="none" />
    </svg>
  )
}
