"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, ArrowRight, Clock, ChevronRight, CheckCircle2 } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { listReadingProgress, type ReadingProgressEntry } from "@/lib/reading/positions"
import { getBook } from "@/lib/content"
import { BookCoverThumb } from "@/components/tome/book-cover-thumb"
import { Skeleton } from "@/components/ui/skeleton"
import type { TomeBook } from "@/data/books"

interface ReadingEntry {
  book: TomeBook
  entry: ReadingProgressEntry
  pct: number
}

function timeAgo(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
  if (days <= 0) return "Today"
  if (days === 1) return "Yesterday"
  return `${days}d ago`
}

export default function ReadingPage() {
  const [inProgress, setInProgress] = useState<ReadingEntry[]>([])
  const [completed, setCompleted] = useState<ReadingEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const rows = await listReadingProgress()
      if (cancelled) return
      const active: ReadingEntry[] = []
      const done: ReadingEntry[] = []
      for (const entry of rows) {
        const book = getBook(entry.bookId)
        if (!book) continue
        const pct = entry.percent ?? Math.round(((entry.chapterIndex + 1) / Math.max(book.chapters, 1)) * 100)
        const item = { book, entry, pct }
        if (pct >= 100) done.push(item)
        else active.push(item)
      }
      setInProgress(active)
      setCompleted(done)
      setLoading(false)
    })()
    return () => { cancelled = true }
  }, [])

  return (
    <div className="flex flex-col min-h-full">
      <div className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-sm px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <BookOpen className="size-6 shrink-0 text-foreground" />
          <h1 className="text-2xl font-bold tracking-tight">Reading</h1>
          {inProgress.length > 0 && (
            <p className="text-sm text-muted-foreground ml-auto">{inProgress.length} {inProgress.length === 1 ? "book" : "books"} in progress</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {loading ? (
          <div role="status" aria-busy="true" aria-live="polite" className="space-y-3">
            <span className="sr-only">Loading your books in progress…</span>
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        ) : inProgress.length === 0 && completed.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <BlurFade delay={0.1} inView>
              <div className="text-center max-w-md">
                <BookOpen className="size-12 text-[var(--gold-default)] mx-auto mb-4" />
                <h2 className="font-serif text-xl font-bold text-foreground mb-2">Nothing in progress</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Open the Library and start reading. Your progress will appear here and follow you across devices.
                </p>
                <Link
                  href="/library/browse"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--gold-default)] text-[var(--primary-foreground)] font-semibold text-sm hover:opacity-90 transition-opacity"
                >
                  <BookOpen className="size-4" />
                  Open the Library
                  <ArrowRight className="size-3.5" />
                </Link>
              </div>
            </BlurFade>
          </div>
        ) : (
          <>
            {inProgress.length > 0 && (
              <section className="space-y-2">
                {inProgress.map((item, i) => (
                  <BlurFade key={item.book.id} delay={0.03 + i * 0.02} inView>
                    <Link
                      href={`/read/${item.book.id}`}
                      className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-[var(--gold-default)]/40 transition-colors group"
                    >
                      <BookCoverThumb book={item.book} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{item.book.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{item.book.author}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                            <div className="h-full rounded-full bg-[var(--gold-default)]" style={{ width: `${item.pct}%` }} />
                          </div>
                          <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{item.pct}%</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
                          <span>Continue &middot; Ch {item.entry.chapterIndex + 1}</span>
                          <span>&middot;</span>
                          <Clock className="size-3" />
                          <span>{timeAgo(item.entry.updatedAt)}</span>
                        </div>
                      </div>
                      <ChevronRight className="size-4 text-muted-foreground/30 group-hover:text-[var(--gold-default)] transition-colors shrink-0" />
                    </Link>
                  </BlurFade>
                ))}
              </section>
            )}

            {completed.length > 0 && (
              <section>
                <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <CheckCircle2 className="size-3.5 text-[var(--green-default)]" /> Completed
                </h2>
                <div className="space-y-2">
                  {completed.map((item, i) => (
                    <BlurFade key={item.book.id} delay={0.03 + i * 0.02} inView>
                      <Link
                        href={`/read/${item.book.id}`}
                        className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 hover:border-border/80 transition-colors group"
                      >
                        <BookCoverThumb book={item.book} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{item.book.title}</p>
                          <p className="text-xs text-muted-foreground truncate">{item.book.author}</p>
                          <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] text-[var(--green-default)]">
                            <CheckCircle2 className="size-3" /> Finished &middot; {timeAgo(item.entry.updatedAt)}
                          </span>
                        </div>
                        <ChevronRight className="size-4 text-muted-foreground/30 shrink-0" />
                      </Link>
                    </BlurFade>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  )
}
