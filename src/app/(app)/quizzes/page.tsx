"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Brain, ArrowRight, Search, History as HistoryIcon, GraduationCap } from "lucide-react"
import { getBook } from "@/lib/content"
import { BookCoverThumb } from "@/components/tome/book-cover-thumb"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { TomeBook } from "@/data/books"
import {
  loadPracticeData,
  QUIZ_TIERS,
  type QuizAttempt,
  type QuizBookEntry,
  type QuizTier,
} from "@/lib/quizzes/practice"

// RUBRIC palette — practice tiers map to the canonical accents. Master carries
// tyrian; Scholar lapis; Apprentice verdigris. (Iridescence stays Virgil-only.)
const TIER_COLOR: Record<QuizTier, string> = {
  Apprentice: "#2E7D6F",
  Scholar: "#2A4B8D",
  Master: "#6B2D5C",
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days = Math.floor(diff / 86_400_000)
  if (mins < 1) return "just now"
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

interface Row {
  entry: QuizBookEntry
  book: TomeBook
}

export default function QuizzesPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<Row[]>([])
  const [history, setHistory] = useState<QuizAttempt[]>([])
  const [query, setQuery] = useState("")

  useEffect(() => {
    let cancelled = false
    async function load() {
      const { books, history } = await loadPracticeData()
      if (cancelled) return
      const mapped: Row[] = []
      for (const entry of books) {
        const book = getBook(entry.bookId)
        if (book) mapped.push({ entry, book })
      }
      // Assigned first, then books you've practiced, then alphabetical.
      mapped.sort((a, b) => {
        if (!!a.entry.assignedIn !== !!b.entry.assignedIn) return a.entry.assignedIn ? -1 : 1
        const aPracticed = Object.keys(a.entry.stats).length > 0
        const bPracticed = Object.keys(b.entry.stats).length > 0
        if (aPracticed !== bPracticed) return aPracticed ? -1 : 1
        return a.book.title.localeCompare(b.book.title)
      })
      setRows(mapped)
      setHistory(history)
      setLoading(false)
    }
    load()
    return () => { cancelled = true }
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(
      (r) => r.book.title.toLowerCase().includes(q) || r.book.author.toLowerCase().includes(q),
    )
  }, [rows, query])

  const titleFor = (bookId: string) => getBook(bookId)?.title ?? bookId

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-start gap-2.5">
          <Brain className="size-6 shrink-0 text-foreground mt-0.5" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Practice Quizzes</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Free, unlimited practice across three tiers. Practice never counts toward a grade.
            </p>
          </div>
        </div>

        {/* Recent attempts */}
        {!loading && history.length > 0 && (
          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              <HistoryIcon className="size-3.5" /> Recent attempts
            </h2>
            <ul className="space-y-1.5">
              {history.map((a, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                  <span className="flex-1 min-w-0 truncate">
                    <span className="font-medium text-foreground">{titleFor(a.bookId)}</span>
                    <span className="text-muted-foreground"> · Ch. {a.chapterIndex + 1}</span>
                    {a.tier && <span className="text-muted-foreground"> · {a.tier}</span>}
                  </span>
                  <span
                    className={cn(
                      "shrink-0 tabular-nums font-semibold",
                      a.percent >= 80 ? "text-[#2E7D6F]" : a.percent >= 50 ? "text-[var(--amber-default)]" : "text-muted-foreground",
                    )}
                  >
                    {a.percent}%
                  </span>
                  <span className="shrink-0 w-16 text-right text-[11px] text-muted-foreground">
                    {relativeTime(a.createdAt)}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Search */}
        {!loading && rows.length > 0 && (
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search books with quizzes…"
              className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm outline-none focus:border-[var(--gold-default)]/50"
            />
          </div>
        )}

        {/* Book index */}
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            {rows.length === 0 ? "No quizzes available yet." : "No books match your search."}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map(({ entry, book }) => (
              <QuizBookCard key={entry.bookId} entry={entry} book={book} />
            ))}
          </div>
        )}

        <div className="text-center pt-2">
          <Link
            href="/library/browse"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--gold-default)] hover:opacity-80 transition-opacity"
          >
            Browse the full library <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}

function QuizBookCard({ entry, book }: { entry: QuizBookEntry; book: TomeBook }) {
  return (
    <div className="flex gap-4 rounded-xl border border-border bg-card p-4">
      <BookCoverThumb book={book} className="w-12" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{book.title}</p>
            <p className="text-xs text-muted-foreground truncate">{book.author}</p>
          </div>
          {entry.assignedIn && (
            <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-[var(--gold-default)]/40 bg-[var(--gold-default)]/10 px-2 py-0.5 text-[10px] font-medium text-[var(--gold-default)]">
              <GraduationCap className="size-3" /> Assigned in {entry.assignedIn}
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {QUIZ_TIERS.map((tier) => {
            const cov = entry.tiers.find((t) => t.tier === tier)
            if (!cov) return null
            const stat = entry.stats[tier]
            const color = TIER_COLOR[tier]
            return (
              <Link
                key={tier}
                href={`/quiz/${cov.quizId}`}
                className="group flex items-center gap-2 rounded-lg border px-2.5 py-1.5 transition-colors"
                style={{ borderColor: `${color}55` }}
              >
                <span className="text-xs font-semibold" style={{ color }}>
                  {tier}
                </span>
                {stat ? (
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    best {stat.bestPercent}% · {stat.attempts} {stat.attempts === 1 ? "try" : "tries"}
                  </span>
                ) : (
                  <span className="text-[11px] text-muted-foreground">Practice</span>
                )}
                <ArrowRight className="size-3 text-muted-foreground/50 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
