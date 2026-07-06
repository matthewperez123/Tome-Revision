"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { BookOpen, Trash2, ArrowRight, Bookmark, Highlighter } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { getBooks } from "@/lib/content"
import { cn } from "@/lib/utils"

type MarkKind = "bookmark" | "highlight"

interface Mark {
  id: string
  book_id: string
  chapter_index: number
  kind: MarkKind
  selected_text: string | null
  label: string | null
  note: string | null
  color: string
  created_at: string
}

// RUBRIC reader-highlight palette (see reader-highlights.tsx).
const COLOR_LABELS: Record<string, string> = {
  "#2A4B8D": "Lapis",
  "#C8A24B": "Gold",
  "#2E7D6F": "Verdigris",
  "#C8553D": "Vermilion",
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

function MarkCard({
  mark,
  bookTitle,
  onDelete,
}: {
  mark: Mark
  bookTitle: string
  onDelete: (id: string) => void
}) {
  const [deleting, setDeleting] = useState(false)
  const isBookmark = mark.kind === "bookmark"

  return (
    <div
      className="relative flex gap-3 rounded-lg border border-border bg-card p-3.5 hover:bg-accent/20 transition-colors"
      style={{ borderLeft: `3px solid ${mark.color}` }}
    >
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          {isBookmark ? <Bookmark className="size-3" /> : <Highlighter className="size-3" />}
          <span>{bookTitle}</span>
          <span>&middot;</span>
          <span>Ch. {mark.chapter_index + 1}</span>
        </div>

        {mark.label && (
          <p className="text-sm font-semibold text-foreground">{mark.label}</p>
        )}

        {mark.selected_text && (
          <p className="text-sm italic text-foreground/85 leading-relaxed line-clamp-3">
            &ldquo;{mark.selected_text}&rdquo;
          </p>
        )}

        {mark.note && (
          <p className="text-xs text-muted-foreground leading-relaxed border-l-2 border-border pl-2.5">
            {mark.note}
          </p>
        )}

        <div className="flex items-center justify-between pt-0.5">
          <span className="text-[11px] text-muted-foreground">{relativeTime(mark.created_at)}</span>

          <div className="flex items-center gap-1">
            {deleting ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-destructive">
                Delete?
                <button onClick={() => onDelete(mark.id)} className="underline font-medium hover:opacity-80">Yes</button>
                <button onClick={() => setDeleting(false)} className="text-muted-foreground hover:text-foreground">No</button>
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
                  href={`/read/${mark.book_id}?ch=${mark.chapter_index}`}
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Jump to passage"
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

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
        active ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  )
}

export default function BookmarksPage() {
  const [mounted, setMounted] = useState(false)
  const [marks, setMarks] = useState<Mark[]>([])
  const [kindFilter, setKindFilter] = useState<MarkKind | "all">("all")
  const [colorFilter, setColorFilter] = useState<string | "all">("all")
  const [bookFilter, setBookFilter] = useState<string | "all">("all")

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
        .select("id, book_id, chapter_index, kind, selected_text, label, note, color, created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
      if (cancelled) return
      setMarks((data as Mark[]) ?? [])
      setMounted(true)
    }
    load()
    return () => { cancelled = true }
  }, [])

  async function handleDelete(id: string) {
    setMarks((prev) => prev.filter((m) => m.id !== id))
    await createClient().from("highlights").delete().eq("id", id)
  }

  const allBooks = useMemo(() => getBooks(), [])
  const titleFor = (bookId: string) => allBooks.find((b) => b.id === bookId)?.title ?? bookId

  const booksWithMarks = useMemo(() => {
    const ids = new Set(marks.map((m) => m.book_id))
    return Array.from(ids).map((id) => ({ id, title: titleFor(id) })).sort((a, b) => a.title.localeCompare(b.title))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marks])

  const colorsPresent = useMemo(() => Array.from(new Set(marks.map((m) => m.color))), [marks])

  const filtered = useMemo(() => marks.filter((m) => {
    if (kindFilter !== "all" && m.kind !== kindFilter) return false
    if (colorFilter !== "all" && m.color !== colorFilter) return false
    if (bookFilter !== "all" && m.book_id !== bookFilter) return false
    return true
  }), [marks, kindFilter, colorFilter, bookFilter])

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookmarks &amp; Highlights</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {mounted ? (
              <>
                <span className="font-semibold text-foreground">{marks.length}</span>{" "}
                saved mark{marks.length !== 1 ? "s" : ""} across your reading
              </>
            ) : "Loading…"}
          </p>
        </div>

        {mounted && marks.length > 0 && (
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <FilterChip active={kindFilter === "all"} onClick={() => setKindFilter("all")}>All</FilterChip>
              <FilterChip active={kindFilter === "bookmark"} onClick={() => setKindFilter("bookmark")}>Bookmarks</FilterChip>
              <FilterChip active={kindFilter === "highlight"} onClick={() => setKindFilter("highlight")}>Highlights</FilterChip>
            </div>
            {colorsPresent.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                <FilterChip active={colorFilter === "all"} onClick={() => setColorFilter("all")}>Any color</FilterChip>
                {colorsPresent.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColorFilter(colorFilter === c ? "all" : c)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors border",
                      colorFilter === c ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <span className="size-2.5 rounded-full" style={{ backgroundColor: c }} />
                    {COLOR_LABELS[c] ?? c}
                  </button>
                ))}
              </div>
            )}
            {booksWithMarks.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                <FilterChip active={bookFilter === "all"} onClick={() => setBookFilter("all")}>All books</FilterChip>
                {booksWithMarks.map((b) => (
                  <FilterChip key={b.id} active={bookFilter === b.id} onClick={() => setBookFilter(bookFilter === b.id ? "all" : b.id)}>
                    {b.title}
                  </FilterChip>
                ))}
              </div>
            )}
          </div>
        )}

        {!mounted ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : marks.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-20 rounded-xl border border-dashed border-border text-muted-foreground">
            <BookOpen className="size-12 opacity-30" />
            <p className="text-sm font-medium">No bookmarks or highlights yet</p>
            <p className="text-xs opacity-70 text-center max-w-xs">
              As you read, bookmark a paragraph or select any passage to save it here.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-muted-foreground">
            No marks match these filters.
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((m) => (
              <MarkCard key={m.id} mark={m} bookTitle={titleFor(m.book_id)} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
