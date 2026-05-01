"use client"

import { motion } from "motion/react"
import { useAnimationLoop } from "./useAnimationLoop"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"

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
  year: number
}

const BOOKS: Book[] = [
  { title: "The Odyssey", progress: 0.72, color: "#6366F1", year: -700 },
  { title: "The Republic", progress: 0.45, color: "#8B5CF6", year: -380 },
  { title: "Meditations", progress: 1.0, color: "#059669", year: 180 },
  { title: "The Aeneid", progress: 0.18, color: "#D97706", year: -20 },
  { title: "Hamlet", progress: 0.61, color: "#DB2777", year: 1603 },
  { title: "Don Quixote", progress: 0.33, color: "#2563EB", year: 1605 },
]

const AUTHORS = [
  { initials: "H", name: "Homer", year: "~800 BCE", color: "#0EA5E9" },
  { initials: "V", name: "Virgil", year: "70 BCE", color: "#6366F1" },
  { initials: "D", name: "Dante", year: "1265", color: "#F59E0B" },
  { initials: "S", name: "Shakespeare", year: "1564", color: "#EF4444" },
  { initials: "A", name: "Austen", year: "1775", color: "#F43F5E" },
  { initials: "T", name: "Tolstoy", year: "1828", color: "#3B82F6" },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

const RECENT_ORDER = BOOKS
const CHRONO_ORDER = [...BOOKS].sort((a, b) => a.year - b.year)

export function MergedLibraryTimelineBlock() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)
  const isChrono = phase === "chronological"
  const books = isChrono ? CHRONO_ORDER : RECENT_ORDER

  return (
    <TeacherShowcaseShell
      heading="Your library, in your order or history's."
      subcopy="Every book you've started, finished, and annotated. Sort by your reading order, or reshuffle chronologically and watch three thousand years of literature line up in sequence."
      layout="mockup-right"
      bgClass="bg-muted"
    >
      <div>
          <div
            ref={isReduced ? undefined : containerRef}
            className="bg-card rounded-xl border border-border p-6"
          >
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground">My Library &middot; 6 books</p>
              <div className="flex items-center gap-1 rounded-full border border-border bg-muted p-0.5 text-[10px] font-medium">
                <Pill label="Recent" active={!isChrono} />
                <Pill label="Chronological" active={isChrono} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {books.map((book, i) => (
                <motion.div
                  key={book.title}
                  layout={!isReduced}
                  transition={{ duration: 0.45, ease: EASE, delay: i * 0.02 }}
                >
                  <BookCard book={book} showYear={isChrono} />
                </motion.div>
              ))}
            </div>
          </div>

        {/* Timeline strip */}
          <div className="mt-4 bg-card rounded-xl border border-border p-6">
            <p className="text-[10px] text-muted-foreground mb-4 uppercase tracking-wider font-medium">
              The canon, in chronological order
            </p>
            <div className="relative h-1 bg-muted rounded-full mb-6 mt-2">
              <div className="absolute inset-y-0 left-0 right-0 bg-gradient-to-r from-[#0EA5E9] via-[#F59E0B] to-[#3B82F6] rounded-full" />
            </div>
            <div className="flex items-start justify-between">
              {AUTHORS.map((a) => (
                <div key={a.initials} className="flex flex-col items-center gap-1">
                  <div
                    className="size-9 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: a.color }}
                  >
                    {a.initials}
                  </div>
                  <span className="text-[9px] text-muted-foreground font-medium">
                    {a.name}
                  </span>
                  <span className="text-[8px] text-muted-foreground/60">
                    {a.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
      </div>
    </TeacherShowcaseShell>
  )
}

function Pill({ label, active }: { label: string; active: boolean }) {
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full transition-colors duration-200 ${
        active
          ? "bg-card text-foreground shadow-sm"
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
