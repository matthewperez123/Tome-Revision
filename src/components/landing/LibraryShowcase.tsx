"use client"

import { motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAnimationLoop } from "./useAnimationLoop"

// Reader-side loop target: ~5.5s per cycle.
const PHASES = [
  { name: "recent", duration: 1600 },
  { name: "toggle", duration: 500 },
  { name: "chronological", duration: 2400 },
  { name: "reset", duration: 400 },
]

type Book = {
  title: string
  progress: number
  color: string
  year: number // approximate composition year for chronological sort
}

const BOOKS: Book[] = [
  { title: "The Odyssey", progress: 0.72, color: "#6366F1", year: -700 },
  { title: "The Republic", progress: 0.45, color: "#8B5CF6", year: -380 },
  { title: "Meditations", progress: 1.0, color: "#059669", year: 180 },
  { title: "The Aeneid", progress: 0.18, color: "#D97706", year: -20 },
  { title: "Hamlet", progress: 0.61, color: "#DB2777", year: 1603 },
  { title: "Don Quixote", progress: 0.33, color: "#2563EB", year: 1605 },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const RECENT_ORDER = BOOKS
const CHRONO_ORDER = [...BOOKS].sort((a, b) => a.year - b.year)

export function LibraryShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const isChrono = phase === "chronological"
  const books = isChrono ? CHRONO_ORDER : RECENT_ORDER

  if (isReduced) {
    return (
      <LibraryShell>
        <div className="bg-card rounded-xl border border-border p-6">
          <Toolbar mode="recent" />
          <div className="grid grid-cols-3 gap-3 mt-3">
            {RECENT_ORDER.map((book) => (
              <BookCard key={book.title} book={book} />
            ))}
          </div>
        </div>
      </LibraryShell>
    )
  }

  return (
    <LibraryShell>
      <div
        ref={containerRef}
        className="bg-card rounded-xl border border-border p-6 min-h-[300px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Library with chronological toggle demonstration"
      >
        <Toolbar mode={isChrono ? "chronological" : "recent"} pressed={phase === "toggle"} />
        <div className="grid grid-cols-3 gap-3 mt-3">
          {books.map((book, i) => (
            <motion.div
              key={book.title}
              layout
              transition={{ duration: 0.45, ease: EASE, delay: i * 0.02 }}
              style={{ willChange: "transform" }}
            >
              <BookCard book={book} showYear={isChrono} />
            </motion.div>
          ))}
        </div>
      </div>
    </LibraryShell>
  )
}

function Toolbar({
  mode,
  pressed = false,
}: {
  mode: "recent" | "chronological"
  pressed?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-muted-foreground">My Library &middot; 6 books</p>
      <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-[10px] font-medium">
        <Pill label="Recent" active={mode === "recent"} pressed={pressed && mode === "chronological"} />
        <Pill
          label="Chronological"
          active={mode === "chronological"}
          pressed={pressed && mode === "recent"}
        />
      </div>
    </div>
  )
}

function Pill({
  label,
  active,
  pressed,
}: {
  label: string
  active: boolean
  pressed: boolean
}) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full transition-colors duration-200 ${
        active
          ? "bg-card text-foreground shadow-sm"
          : pressed
            ? "text-primary"
            : "text-muted-foreground"
      }`}
    >
      {label}
    </span>
  )
}

function BookCard({ book, showYear = false }: { book: Book; showYear?: boolean }) {
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference * (1 - book.progress)

  const yearLabel =
    book.year < 0 ? `${Math.abs(book.year)} BCE` : `${book.year}`

  return (
    <div className="rounded-lg border border-border bg-muted p-3 text-center">
      <div className="relative mx-auto mb-2 size-12">
        <svg viewBox="0 0 40 40" className="size-12 -rotate-90">
          <circle
            cx="20"
            cy="20"
            r="18"
            className="fill-none stroke-border"
            strokeWidth="2.5"
          />
          <circle
            cx="20"
            cy="20"
            r="18"
            className="fill-none"
            stroke={book.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground tabular-nums">
          {Math.round(book.progress * 100)}%
        </span>
      </div>
      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">
        {book.title}
      </p>
      {showYear && (
        <p className="text-[9px] text-muted-foreground mt-0.5 tabular-nums">
          {yearLabel}
        </p>
      )}
    </div>
  )
}

function LibraryShell({ children }: { children: React.ReactNode }) {
  return (
    <section className="bg-muted py-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 items-center">
        <div className="order-2 md:order-1">
          <BlurFade delay={0.1} inView>
            <h2 className="font-[var(--font-display)] text-3xl md:text-4xl font-bold text-foreground mb-2">
              Your personal canon.
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
              Every book you&apos;ve started, finished, and annotated. Sort by
              the order you&apos;ve read them or reshuffle chronologically to
              watch three thousand years of literature line up in sequence.
            </p>
          </BlurFade>
        </div>
        <BlurFade delay={0.1} inView>
          <div className="order-1 md:order-2">{children}</div>
        </BlurFade>
      </div>
    </section>
  )
}
