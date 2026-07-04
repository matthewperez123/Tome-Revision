"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import {
  Heart, Bookmark, BookOpen, Check, ArrowRight, Clock, BookMarked,
} from "lucide-react"
import {
  listShelfItems,
  removeFromShelf,
  SHELF_LABELS,
  type Shelf,
  type ShelfItem,
} from "@/lib/shelves/shelves"
import { listReadingProgress, type ReadingProgressEntry } from "@/lib/reading/positions"
import { getBook } from "@/lib/content"
import { ClassicsCover } from "@/components/tome/ClassicsCover"
import { cn } from "@/lib/utils"

// "reading" is a virtual tab derived from reading_progress, never stored.
type Tab = Shelf | "reading"

const TABS: { type: Tab; label: string; icon: React.FC<{ className?: string }> }[] = [
  { type: "favorites",    label: "Favorites",    icon: Heart    },
  { type: "want_to_read", label: "Want to Read", icon: Bookmark },
  { type: "reading",      label: "Reading",      icon: BookOpen },
  { type: "completed",    label: "Completed",    icon: Check    },
]

function relativeDate(iso: string): string {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000)
  if (days < 1) return "Today"
  if (days === 1) return "Yesterday"
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" })
}

function TinyCover({ bookId, width = 40, height = 60 }: { bookId: string; width?: number; height?: number }) {
  const book = getBook(bookId)
  if (!book) return <div className="rounded-sm bg-muted shrink-0" style={{ width, height }} />
  return (
    <div className="shrink-0" style={{ width, height }}>
      <ClassicsCover
        bookId={book.id}
        title={book.title}
        author={book.author}
        tradition={book.tradition}
        fallbackColors={book.coverColors}
        className="w-full h-full"
        showTomeWordmark={false}
      />
    </div>
  )
}

export default function ShelvesPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>("favorites")
  const [items, setItems] = useState<ShelfItem[]>([])
  const [reading, setReading] = useState<ReadingProgressEntry[]>([])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [shelf, progress] = await Promise.all([listShelfItems(), listReadingProgress()])
      if (cancelled) return
      setItems(shelf)
      setReading(progress)
      setMounted(true)
    })()
    return () => { cancelled = true }
  }, [])

  const byShelf = useMemo(() => {
    const map: Record<Shelf, ShelfItem[]> = { favorites: [], want_to_read: [], completed: [] }
    for (const it of items) map[it.shelf]?.push(it)
    return map
  }, [items])

  const counts = useMemo<Record<Tab, number>>(() => ({
    favorites: byShelf.favorites.length,
    want_to_read: byShelf.want_to_read.length,
    completed: byShelf.completed.length,
    reading: reading.filter((r) => (r.percent ?? 0) < 100).length,
  }), [byShelf, reading])

  async function handleRemove(bookId: string, shelf: Shelf) {
    setItems((prev) => prev.filter((it) => !(it.bookId === bookId && it.shelf === shelf)))
    await removeFromShelf(bookId, shelf)
  }

  function renderShelfGrid(shelf: Shelf) {
    const list = byShelf[shelf]
    if (list.length === 0) {
      return (
        <EmptyState
          icon={TABS.find((t) => t.type === shelf)!.icon}
          title={`Nothing in ${SHELF_LABELS[shelf]} yet`}
          subtitle="Add books from the Library or a book's page."
          action={
            <Link href="/library/browse" className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
              Browse Library
            </Link>
          }
        />
      )
    }
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-3">
        {list.map((entry) => {
          const book = getBook(entry.bookId)
          if (!book) return null
          return (
            <div key={entry.bookId} className="relative group">
              <button
                onClick={() => handleRemove(entry.bookId, shelf)}
                className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-black/50 text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
                title={`Remove from ${SHELF_LABELS[shelf]}`}
              >
                <Check className="size-3.5" />
              </button>
              <Link href={`/book/${book.id}`} className="block">
                <ClassicsCover
                  bookId={book.id}
                  title={book.title}
                  author={book.author}
                  tradition={book.tradition}
                  fallbackColors={book.coverColors}
                  className="w-full"
                  showTomeWordmark={false}
                />
                <p className="mt-1.5 text-xs font-medium leading-tight line-clamp-2 text-foreground">{book.title}</p>
                <p className="text-[10px] text-muted-foreground truncate">{book.author}</p>
              </Link>
            </div>
          )
        })}
      </div>
    )
  }

  function renderReading() {
    const active = reading.filter((r) => (r.percent ?? 0) < 100)
    if (active.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title="No books in progress"
          subtitle="Start reading from the Library — your progress appears here."
          action={
            <Link href="/library/browse" className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">
              Browse Library
            </Link>
          }
        />
      )
    }
    return (
      <div className="space-y-3">
        {active.map((entry) => {
          const book = getBook(entry.bookId)
          if (!book) return null
          const pct = entry.percent ?? Math.round(((entry.chapterIndex + 1) / Math.max(book.chapters, 1)) * 100)
          return (
            <Link
              key={entry.bookId}
              href={`/read/${book.id}`}
              className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-[var(--gold-default)]/40 transition-colors"
            >
              <TinyCover bookId={entry.bookId} width={56} height={84} />
              <div className="flex-1 min-w-0 space-y-2">
                <div>
                  <p className="font-semibold leading-tight truncate">{book.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-[var(--gold-default)]" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums shrink-0">{pct}%</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>Continue &middot; Ch {entry.chapterIndex + 1}</span>
                  <span>&middot;</span>
                  <Clock className="size-3" />
                  <span>{relativeDate(entry.updatedAt)}</span>
                </div>
              </div>
              <ArrowRight className="size-4 text-muted-foreground/40 self-center shrink-0" />
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex items-center gap-2.5">
          <BookMarked className="size-6 shrink-0 text-foreground" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Shelves</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Your personal reading collection</p>
          </div>
        </div>

        <div className="flex gap-1 p-1 bg-muted rounded-xl overflow-x-auto">
          {TABS.map(({ type, label, icon: Icon }) => {
            const count = counts[type]
            return (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap flex-1 justify-center",
                  activeTab === type ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="size-3.5 shrink-0" />
                <span>{label}</span>
                {mounted && count > 0 && (
                  <span className={cn(
                    "inline-flex items-center justify-center rounded-full text-[10px] font-semibold px-1.5 py-0.5 min-w-[18px] leading-none",
                    activeTab === type ? "bg-muted text-foreground" : "bg-background/60 text-muted-foreground",
                  )}>
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {!mounted ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : activeTab === "reading" ? (
          renderReading()
        ) : (
          renderShelfGrid(activeTab)
        )}
      </div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.FC<{ className?: string }>
  title: string
  subtitle: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20 rounded-xl border border-dashed border-border text-muted-foreground">
      <Icon className="size-12 opacity-30" />
      <p className="text-sm font-medium text-foreground">{title}</p>
      <p className="text-xs opacity-70 text-center max-w-xs">{subtitle}</p>
      {action}
    </div>
  )
}
