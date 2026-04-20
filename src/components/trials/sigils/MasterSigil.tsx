import type { SigilProps } from "./ApprenticeSigil"

/**
 * Master sigil — a full laurel wreath encircling a small inner flame.
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
      {/* Wreath ring — left arc */}
      <path d="M12 3 C 6 3, 3 7, 3 12 C 3 17, 6 20, 9 21" />
      {/* Wreath ring — right arc */}
      <path d="M12 3 C 18 3, 21 7, 21 12 C 21 17, 18 20, 15 21" />

      {/* Left-side leaves (3) */}
      <path d="M5 8 C 3.5 8.5, 3 10, 4 11" opacity={0.85} />
      <path d="M3 12 C 1.8 12.5, 1.8 13.5, 3 14.5" opacity={0.85} />
      <path d="M4.5 16.5 C 3.2 17, 3.2 18, 4.5 18.5" opacity={0.85} />

      {/* Right-side leaves (3) */}
      <path d="M19 8 C 20.5 8.5, 21 10, 20 11" opacity={0.85} />
      <path d="M21 12 C 22.2 12.5, 22.2 13.5, 21 14.5" opacity={0.85} />
      <path d="M19.5 16.5 C 20.8 17, 20.8 18, 19.5 18.5" opacity={0.85} />

      {/* Ribbon gap at bottom */}
      <path d="M10 21 L14 21" />

      {/* Inner flame */}
      <path d="M12 9 C 10.5 11, 10.5 13, 12 14.5 C 13.5 13, 13.5 11, 12 9 Z" />
      <path d="M12 11 C 11.5 12, 11.5 13, 12 13.5" opacity={0.6} />
    </svg>
  )
}
