import type { SigilProps } from "./ApprenticeSigil"

/**
 * Scholar sigil — two crossed laurel leaves forming a wreath arc.
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
      {/* Left leaf: stem from bottom-center to upper-left */}
      <path d="M12 20 L5 8" />
      <path d="M5 8 C 3 9.5, 3 12, 5 13.5 C 7 13, 7.5 11, 7.5 9.5" />
      <path d="M5 8 C 7 7, 8.5 8, 8.5 10 C 7.5 11.5, 6 11.5, 5 11" opacity={0.9} />

      {/* Right leaf: stem from bottom-center to upper-right */}
      <path d="M12 20 L19 8" />
      <path d="M19 8 C 21 9.5, 21 12, 19 13.5 C 17 13, 16.5 11, 16.5 9.5" />
      <path d="M19 8 C 17 7, 15.5 8, 15.5 10 C 16.5 11.5, 18 11.5, 19 11" opacity={0.9} />

      {/* Ribbon tie */}
      <path d="M10.5 19.5 L13.5 19.5" />
      <circle cx={12} cy={20} r={0.8} fill={color} stroke="none" />
    </svg>
  )
}
