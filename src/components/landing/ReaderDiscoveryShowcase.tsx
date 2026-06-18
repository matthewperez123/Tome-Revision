"use client"

/**
 * Reader discovery (R5 additions) — two demo-only shelves that reuse the real
 * <BookCard> over the curated DEMO_LIBRARY_BOOKS slice:
 *   • TrendingBooksShowcase     — what the community is reading now
 *   • RecommendationsShowcase   — "Because you read X" suggestions
 * Cards are display-only (interactive={false}) so the marketing surface never
 * navigates or writes to localStorage.
 */

import Link from "next/link"
import { ArrowRight, Flame } from "lucide-react"
import { TeacherShowcaseShell } from "./teacher/TeacherShowcaseShell"
import { BookCard } from "@/components/tome/book-card"
import { DEMO_LIBRARY_BOOKS } from "@/lib/demo/data"

// ── Trending ────────────────────────────────────────────────────────

export function TrendingBooksShowcase() {
  const books = DEMO_LIBRARY_BOOKS.slice(0, 5)

  return (
    <TeacherShowcaseShell
      heading="See what the world is reading."
      subcopy="A living shelf of the works readers are moving through right now. Find your next book in the company of others."
      layout="mockup-right"
      bgClass="bg-background"
    >
      <div>
        <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Flame className="size-3.5 text-orange-500" />
          Trending this week
        </div>
        <div
          className="-mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]"
          role="list"
          aria-label="Trending books"
        >
          {books.map((book) => (
            <div key={book.id} role="listitem" className="w-[130px] shrink-0 snap-start">
              <BookCard book={book} size="sm" interactive={false} />
            </div>
          ))}
        </div>
        <Link
          href="/library"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          Explore the full library
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </TeacherShowcaseShell>
  )
}

// ── Recommendations ─────────────────────────────────────────────────

const RECS = [
  { id: "frankenstein", by: { displayName: "Ada", username: "ada" } },
  { id: "jane-eyre", by: { displayName: "Colette", username: "colette" } },
  { id: "the-divine-comedy", by: { displayName: "Dante", username: "dante" } },
]

export function RecommendationsShowcase() {
  const because = DEMO_LIBRARY_BOOKS.find((b) => b.id === "crime-and-punishment")
  const recs = RECS.map((r) => ({
    book: DEMO_LIBRARY_BOOKS.find((b) => b.id === r.id),
    by: r.by,
  })).filter((r): r is { book: NonNullable<typeof r.book>; by: typeof r.by } =>
    Boolean(r.book),
  )

  return (
    <TeacherShowcaseShell
      heading="Recommendations that know your taste."
      subcopy="Virgil and your Circle suggest where to go next — grounded in what you've already loved, never random."
      layout="mockup-left"
      bgClass="bg-muted"
    >
      <div>
        <p className="mb-3 text-xs text-muted-foreground">
          Because you read{" "}
          <span className="font-semibold text-foreground">
            {because?.title ?? "Crime and Punishment"}
          </span>
          …
        </p>
        <div className="grid grid-cols-3 gap-3">
          {recs.map(({ book, by }) => (
            <BookCard
              key={book.id}
              book={book}
              size="sm"
              interactive={false}
              recommendedBy={by}
            />
          ))}
        </div>
      </div>
    </TeacherShowcaseShell>
  )
}
