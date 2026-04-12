"use client"

import { motion } from "motion/react"
import { BlurFade } from "@/components/ui/blur-fade"
import { useAnimationLoop } from "./useAnimationLoop"

const PHASES = [
  { name: "idle", duration: 3500 },
  { name: "select", duration: 2500 },
  { name: "fill", duration: 4000 },
  { name: "select2", duration: 2500 },
  { name: "fill2", duration: 4000 },
  { name: "reset", duration: 600 },
]

const BOOKS = [
  { title: "The Odyssey", progress: 0.72, color: "#6366F1" },
  { title: "The Republic", progress: 0.45, color: "#8B5CF6" },
  { title: "Meditations", progress: 1.0, color: "#059669" },
  { title: "The Aeneid", progress: 0.18, color: "#D97706" },
  { title: "Hamlet", progress: 0.61, color: "#DB2777" },
  { title: "Don Quixote", progress: 0.33, color: "#2563EB" },
]

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function LibraryShowcase() {
  const { phase, containerRef, isReduced } = useAnimationLoop(PHASES)

  const selectIdx = (phase === "select2" || phase === "fill2") ? 3 : 0
  const showSelect = phase === "select" || phase === "fill" || phase === "select2" || phase === "fill2"
  const showFill = phase === "fill" || phase === "fill2"

  if (isReduced) {
    return (
      <LibraryShell>
        <div className="bg-card rounded-xl border border-border p-6">
          <p className="text-xs text-muted-foreground mb-4">My Library &middot; 6 books</p>
          <div className="grid grid-cols-3 gap-3">
            {BOOKS.map((book) => (
              <BookCard key={book.title} book={book} active={false} filling={false} />
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
        className="bg-card rounded-xl border border-border p-6 min-h-[280px] relative overflow-hidden"
        style={{ willChange: "transform" }}
        aria-label="Animated library demonstration"
      >
        <p className="text-xs text-muted-foreground mb-4">My Library &middot; 6 books</p>
        <div className="grid grid-cols-3 gap-3">
          {BOOKS.map((book, i) => (
            <motion.div
              key={book.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: phase === "idle" ? i * 0.06 : 0, duration: 0.25, ease: EASE }}
              style={{ willChange: "transform, opacity" }}
            >
              <BookCard
                book={book}
                active={showSelect && i === selectIdx}
                filling={showFill && i === selectIdx}
              />
            </motion.div>
          ))}
        </div>

      </div>
    </LibraryShell>
  )
}

function BookCard({ book, active, filling }: {
  book: typeof BOOKS[number]
  active: boolean
  filling: boolean
}) {
  const displayProgress = filling ? Math.min(book.progress + 0.15, 1.0) : book.progress
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = circumference * (1 - displayProgress)

  return (
    <div className={`rounded-lg border p-3 text-center transition-all duration-300 ${active ? "border-indigo-500/50 bg-indigo-500/5" : "border-border bg-muted"}`}>
      <div className="relative mx-auto mb-2 size-12">
        <svg viewBox="0 0 40 40" className="size-12 -rotate-90">
          <circle
            cx="20" cy="20" r="18"
            className="fill-none stroke-border"
            strokeWidth="2.5"
          />
          <motion.circle
            cx="20" cy="20" r="18"
            className="fill-none"
            stroke={book.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            animate={{ strokeDashoffset }}
            transition={{ duration: filling ? 1.5 : 0, ease: EASE }}
            style={{ willChange: "stroke-dashoffset" }}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-foreground tabular-nums">
          {Math.round(displayProgress * 100)}%
        </span>
      </div>
      <p className="text-xs font-semibold text-foreground leading-tight line-clamp-2">{book.title}</p>
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
              Track every book you&apos;ve started, finished, and annotated. Your library grows with you &mdash; a living record of your literary journey.
            </p>
          </BlurFade>
        </div>
        <BlurFade delay={0.1} inView>
          <div className="order-1 md:order-2">
            {children}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
