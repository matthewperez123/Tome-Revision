import type { CSSProperties } from "react"
import type { TomeBookVisualBible } from "@/data/living-archive"
import { cn } from "@/lib/utils"

interface LivingArchiveFallbackArtProps {
  book: TomeBookVisualBible
  alt: string
  className?: string
  variant?: "cover" | "square" | "stoa"
}

function MacbethMark({ book }: { book: TomeBookVisualBible }) {
  return (
    <>
      <circle cx="64" cy="27" r="9" fill={book.palette[3]} opacity="0.88" />
      <path
        d="M38 43 L45 31 L51 43 L58 31 L65 43 Z"
        fill={book.accent}
        opacity="0.94"
      />
      <rect x="39" y="43" width="25" height="5" fill={book.accent} opacity="0.86" />
      <path
        d="M52 49 L57 78 L51 88 L46 78 L50 49 Z"
        fill="#D8D8D0"
        opacity="0.92"
      />
      <path
        d="M18 76 C31 65 45 69 58 78 C68 85 79 84 89 75"
        fill="none"
        stroke={book.palette[4]}
        strokeWidth="2.4"
        opacity="0.68"
      />
      <path
        d="M25 65 C31 57 37 56 44 62"
        fill="none"
        stroke="#171B26"
        strokeWidth="3"
        opacity="0.82"
      />
    </>
  )
}

function MobyDickMark({ book }: { book: TomeBookVisualBible }) {
  return (
    <>
      <path
        d="M64 12 C88 31 91 70 66 96 C55 82 50 68 53 51 C55 35 59 24 64 12 Z"
        fill="#F2EAD8"
        opacity="0.94"
      />
      <path
        d="M0 72 C20 65 34 76 52 69 C72 61 87 68 100 61 L100 100 L0 100 Z"
        fill={book.palette[2]}
        opacity="0.72"
      />
      <path
        d="M21 58 L24 42 L27 58 M19 58 H34"
        fill="none"
        stroke={book.accent}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M15 23 L85 23 M24 34 L76 34"
        stroke="#D8D8D0"
        strokeWidth="0.8"
        opacity="0.36"
      />
      {[
        [18, 18],
        [34, 14],
        [49, 25],
        [73, 17],
        [83, 35],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="1.1" fill="#F2CF8B" />
      ))}
    </>
  )
}

function AliceMark({ book }: { book: TomeBookVisualBible }) {
  const objects = [
    { x: 49, y: 20, r: 7, fill: "#F2CF8B" },
    { x: 76, y: 38, r: 5, fill: book.accent },
    { x: 67, y: 72, r: 6, fill: "#7C5A77" },
    { x: 30, y: 72, r: 5, fill: "#3E7B72" },
    { x: 22, y: 39, r: 6, fill: "#D9A03C" },
  ]

  return (
    <>
      <ellipse
        cx="50"
        cy="50"
        rx="34"
        ry="27"
        fill="none"
        stroke="#7C5A77"
        strokeWidth="1.4"
        opacity="0.42"
        transform="rotate(-18 50 50)"
      />
      <path
        d="M45 42 H58 V66 H45 Z M49 46 H54 V59 H49 Z"
        fill="#F2EAD8"
        opacity="0.9"
      />
      {objects.map((item) => (
        <circle
          key={`${item.x}-${item.y}`}
          cx={item.x}
          cy={item.y}
          r={item.r}
          fill={item.fill}
          opacity="0.88"
        />
      ))}
      <path
        d="M20 82 H80"
        stroke="#171B26"
        strokeWidth="2"
        strokeDasharray="5 5"
        opacity="0.24"
      />
    </>
  )
}

function Symbol({ book }: { book: TomeBookVisualBible }) {
  if (book.templateFamily === "horizon") return <MobyDickMark book={book} />
  if (book.templateFamily === "constellation") return <AliceMark book={book} />
  return <MacbethMark book={book} />
}

export function LivingArchiveFallbackArt({
  book,
  alt,
  className,
  variant = "cover",
}: LivingArchiveFallbackArtProps) {
  const style = {
    "--living-archive-accent": book.accent,
    background:
      variant === "stoa"
        ? `linear-gradient(115deg, ${book.palette[0]}, ${book.palette[1]} 48%, ${book.palette[2]} 100%)`
        : `radial-gradient(circle at ${book.assets.coverFocalPoint?.x ?? 50}% ${book.assets.coverFocalPoint?.y ?? 45}%, ${book.palette[2]}55, transparent 34%), linear-gradient(160deg, ${book.palette[0]}, ${book.palette[1]})`,
  } as CSSProperties

  return (
    <div
      role="img"
      aria-label={alt}
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        className
      )}
      style={style}
      data-testid={`living-archive-fallback-${book.slug}`}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        className={cn(
          "h-full w-full",
          variant === "square" ? "scale-95" : "scale-105"
        )}
        preserveAspectRatio="xMidYMid slice"
      >
        <rect width="100" height="100" fill="transparent" />
        <circle cx="50" cy="50" r="46" fill="#F2EAD8" opacity="0.08" />
        <Symbol book={book} />
      </svg>
    </div>
  )
}
