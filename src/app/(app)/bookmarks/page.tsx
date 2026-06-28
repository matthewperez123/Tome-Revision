"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Trash2, ArrowRight, ChevronDown, ChevronRight } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getBooks } from "@/lib/content"
import { SectionVirgilPanel } from "@/components/virgil/SectionVirgilPanel"

interface Highlight {
  id: string
  book_id: string
  chapter_index: number
  selected_text: string
  color: string
  created_at: string
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60_000)
  const hours = Math.floor(diff / 3_600_000)
  const days  = Math.floor(diff / 86_400_000)
  if (mins  < 1)   return "just now"
  if (mins  < 60)  return `${mins}m ago`
  if (hours < 24)  return `${hours}h ago`
  if (days  < 30)  return `${days}d ago`
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// ── Highlight card ────────────────────────────────────────────────────────

function HighlightCard({
  highlight,
  bookId,
  onDelete,
}: {
  highlight: Highlight
  bookId: string
  onDelete: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)

  return (
    <div
      className="relative flex gap-3 rounded-lg border border-border bg-card p-3.5 hover:bg-accent/20 transition-colors"
      style={{ borderLeft: `3px solid ${highlight.color}` }}
    >
      <div className="flex-1 min-w-0 space-y-1.5">
        <p className="text-[11px] text-muted-foreground">Ch. {highlight.chapter_index + 1}</p>

        <p className="text-sm italic text-foreground/85 leading-relaxed line-clamp-3">
          “{highlight.selected_text}”
        </p>

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-muted-foreground">
            {relativeTime(highlight.created_at)}
          </span>

          <div className="flex items-center gap-1">
            {deleting ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
                Delete?
                <button
                  onClick={() => onDelete(highlight.id)}
                  className="underline font-medium hover:opacity-80"
                >
                  Yes
                </button>
                <button
                  onClick={() => setDeleting(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  No
                </button>
              </span>
            ) : (
              <>
                <button
                  onClick={() => setDeleting(true)}
                  className="p-1 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="size-3.5" />
                </button>
                <Link
                  href={`/read/${bookId}`}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Jump to book"
                >
                  <ArrowRight className="size-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Book accordion ────────────────────────────────────────────────────────

function BookAccordion({
  bookId,
  bookTitle,
  coverColors,
  tradition,
  highlights,
  onDelete,
}: {
  bookId: string
  bookTitle: string
  coverColors?: { primary: string; secondary: string; accent: string }
  tradition?: string
  highlights: Highlight[]
  onDelete: (id: string) => void
}) {
  const [open, setOpen] = useState(true)
  const accent = coverColors?.primary ?? "#1E3A5F"

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 bg-card hover:bg-accent/30 transition-colors text-left"
      >
        <div
          className="shrink-0 rounded-sm"
          style={{
            width: 28,
            height: 42,
            background: `linear-gradient(160deg, ${coverColors?.secondary ?? "#0F2744"} 0%, ${accent} 100%)`,
          }}
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate">{bookTitle}</p>
          {tradition && <p className="text-[11px] text-muted-foreground">{tradition}</p>}
        </div>
        <span className="shrink-0 inline-flex items-center justify-center rounded-full bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 min-w-[26px]">
          {highlights.length}
        </span>
        {open
          ? <ChevronDown className="size-4 text-muted-foreground shrink-0" />
          : <ChevronRight className="size-4 text-muted-foreground shrink-0" />}
      </button>

      {open && (
        <div className="p-3 space-y-2 bg-background">
          {highlights.map((h) => (
            <HighlightCard key={h.id} highlight={h} bookId={bookId} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────

export default function BookmarksPage() {
  const [mounted, setMounted] = useState(false)
  const [highlights, setHighlights] = useState<Highlight[]>([])

  useEffect(() => {
    let cancelled = false
    async function load() {
      const supabase = createClient()
      const { data: userData } = await supabase.auth.getUser()
      const userId = userData.user?.id
      if (!userId) {
        if (!cancelled) setMounted(true)
        return
      }
      const { data } = await supabase
        .from("highlights")
        .select("id, book_id, chapter_index, selected_text, color, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (cancelled) return
      setHighlights((data as Highlight[]) ?? [])
      setMounted(true)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  async function handleDelete(id: string) {
    setHighlights((prev) => prev.filter((h) => h.id !== id))
    await createClient().from("highlights").delete().eq("id", id)
  }

  const allBooks = useMemo(() => getBooks(), [])

  // Group by book, preserving newest-first order of first appearance.
  const byBook = useMemo(() => {
    const map = new Map<string, Highlight[]>()
    for (const h of highlights) {
      if (!map.has(h.book_id)) map.set(h.book_id, [])
      map.get(h.book_id)!.push(h)
    }
    return map
  }, [highlights])

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Highlights</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mounted ? (
              <>
                <span className="font-semibold text-foreground">{highlights.length}</span>
                {" "}saved highlight{highlights.length !== 1 ? "s" : ""}
              </>
            ) : (
              "Loading…"
            )}
          </p>
        </div>

        {/* Virgil search assistant */}
        <SectionVirgilPanel
          title="Search your highlights with Virgil"
          placeholder="Ask Virgil to find a passage or theme…"
          hint="Describe a quote or idea you saved, and I'll help you trace it back to its book."
        />

        {!mounted ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : highlights.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-xl border border-dashed border-border text-muted-foreground">
            <BookOpen className="size-12 opacity-30" />
            <p className="text-sm font-medium">No highlights yet</p>
            <p className="text-xs opacity-70 text-center max-w-xs">
              As you read, select any passage and tap Highlight to save it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from(byBook.entries()).map(([bookId, hs]) => {
              const book = allBooks.find((b) => b.id === bookId)
              return (
                <BookAccordion
                  key={bookId}
                  bookId={bookId}
                  bookTitle={book?.title ?? bookId}
                  coverColors={book?.coverColors}
                  tradition={book?.tradition}
                  highlights={hs}
                  onDelete={handleDelete}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
