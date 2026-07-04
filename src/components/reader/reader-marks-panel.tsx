"use client"

import { useCallback, useEffect, useState } from "react"
import { Bookmark, Highlighter, X, BookMarked } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

type MarkKind = "bookmark" | "highlight"

interface Mark {
  id: string
  chapter_index: number
  kind: MarkKind
  selected_text: string | null
  label: string | null
  note: string | null
  color: string
  created_at: string
}

/**
 * ReaderMarksPanel — a slide-in drawer listing the reader's bookmarks and
 * highlights for the current book, grouped by chapter. Clicking a mark jumps
 * the reader to that chapter. Additive to ReaderHighlights (which owns
 * selection → mark creation); this panel is read + navigate only.
 */
export function ReaderMarksPanel({
  bookId,
  chapterTitles,
  onJump,
}: {
  bookId: string
  chapterTitles?: string[]
  onJump: (chapterIndex: number) => void
}) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [marks, setMarks] = useState<Mark[]>([])

  const load = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data: userData } = await supabase.auth.getUser()
    const userId = userData.user?.id
    if (!userId) {
      setMarks([])
      setLoading(false)
      return
    }
    const { data } = await supabase
      .from("highlights")
      .select("id, chapter_index, kind, selected_text, label, note, color, created_at")
      .eq("user_id", userId)
      .eq("book_id", bookId)
      .order("chapter_index", { ascending: true })
      .order("created_at", { ascending: true })
    setMarks((data as Mark[]) ?? [])
    setLoading(false)
  }, [bookId])

  useEffect(() => {
    if (open) void load()
  }, [open, load])

  // Group by chapter in ascending order.
  const chapters = Array.from(new Set(marks.map((m) => m.chapter_index))).sort((a, b) => a - b)

  function chapterLabel(idx: number) {
    return chapterTitles?.[idx] || `Chapter ${idx + 1}`
  }

  function jump(idx: number) {
    onJump(idx)
    setOpen(false)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open bookmarks and highlights"
        className="fixed bottom-24 right-4 z-40 flex size-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md hover:border-[var(--gold-default)]/50 transition-colors"
      >
        <BookMarked className="size-5" />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-label="Marks">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative w-[min(88vw,360px)] h-full bg-background border-l border-border shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookMarked className="size-4 text-[var(--gold-default)]" />
                <h2 className="text-sm font-semibold">Marks</h2>
                {marks.length > 0 && (
                  <span className="text-xs text-muted-foreground">{marks.length}</span>
                )}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              {loading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 rounded-lg bg-muted animate-pulse" />
                  ))}
                </div>
              ) : marks.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-16 px-4">
                  No bookmarks or highlights in this book yet. Select a passage to highlight it, or tap Bookmark.
                </div>
              ) : (
                chapters.map((ci) => (
                  <section key={ci} className="space-y-1.5">
                    <button
                      onClick={() => jump(ci)}
                      className="text-xs font-semibold text-foreground hover:text-[var(--gold-default)] transition-colors w-full text-left truncate"
                    >
                      {chapterLabel(ci)}
                    </button>
                    <div className="space-y-1.5">
                      {marks.filter((m) => m.chapter_index === ci).map((m) => (
                        <button
                          key={m.id}
                          onClick={() => jump(m.chapter_index)}
                          className="w-full text-left flex gap-2 rounded-lg border border-border bg-card p-2.5 hover:bg-accent/20 transition-colors"
                          style={{ borderLeft: `3px solid ${m.color}` }}
                        >
                          <span className="shrink-0 mt-0.5 text-muted-foreground">
                            {m.kind === "bookmark" ? <Bookmark className="size-3.5" /> : <Highlighter className="size-3.5" />}
                          </span>
                          <span className="min-w-0 flex-1">
                            {m.label && <span className="block text-xs font-medium text-foreground truncate">{m.label}</span>}
                            {m.selected_text && (
                              <span className={cn("block text-xs italic text-foreground/80 line-clamp-2", m.label && "mt-0.5")}>
                                &ldquo;{m.selected_text}&rdquo;
                              </span>
                            )}
                            {m.note && <span className="block text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{m.note}</span>}
                          </span>
                        </button>
                      ))}
                    </div>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
