"use client"

import { useState, useEffect, useMemo } from "react"
import { X, BookOpen, Brain, PenTool, Search, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { DraftStation, StationType } from "@/lib/guided-learning-types"
import type { SupabaseBook } from "@/lib/supabase"
import { createClient } from "@/lib/supabase/client"
import { STATION_TYPE_LABELS } from "@/lib/guided-station-utils"

interface Props {
  station: DraftStation
  onSave: (station: DraftStation) => void
  onClose: () => void
}

export function StationEditorModal({ station: initial, onSave, onClose }: Props) {
  const [station, setStation] = useState<DraftStation>({ ...initial })
  const [books, setBooks] = useState<SupabaseBook[]>([])
  const [bookQuery, setBookQuery] = useState("")
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false)

  // Load books
  useEffect(() => {
    const supabase = createClient()
    supabase
      .from("books")
      .select("id, title, author, chapter_count, difficulty")
      .order("title")
      .then(({ data }) => {
        if (data) setBooks(data as SupabaseBook[])
      })
  }, [])

  const filteredBooks = useMemo(() => {
    if (!bookQuery.trim()) return books.slice(0, 20)
    const q = bookQuery.toLowerCase()
    return books
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 20)
  }, [books, bookQuery])

  const selectedBook = books.find((b) => b.id === station.book_id)

  const update = (partial: Partial<DraftStation>) =>
    setStation((prev) => ({ ...prev, ...partial }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="relative mx-4 w-full max-w-lg rounded-2xl border bg-card p-6 shadow-xl"
        style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-bold">
            {initial.title ? "Edit Station" : `New ${STATION_TYPE_LABELS[station.type]} Station`}
          </h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)]"
            aria-label="Close station editor"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>

        <div className="space-y-5">
          {/* Station type tabs */}
          <div className="flex gap-2">
            {(["reading", "quiz", "reflection"] as StationType[]).map((t) => (
              <button
                key={t}
                onClick={() => update({ type: t })}
                className="flex-1 rounded-lg border-2 px-3 py-2 text-center text-xs font-semibold capitalize transition-colors"
                style={{
                  borderColor: station.type === t ? "var(--tome-indigo, #6366F1)" : "rgba(128,128,128,0.15)",
                  backgroundColor: station.type === t ? "rgba(99,102,241,0.06)" : "transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Station Title</label>
            <Input
              value={station.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder={`e.g., "Read Book IX" or "Comprehension Quiz"`}
              className="text-sm"
            />
          </div>

          {/* Book picker (reading & quiz) */}
          {(station.type === "reading" || station.type === "quiz") && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Book</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  placeholder={selectedBook ? `${selectedBook.title} — ${selectedBook.author}` : "Search books..."}
                  value={bookQuery}
                  onChange={(e) => { setBookQuery(e.target.value); setBookDropdownOpen(true) }}
                  onFocus={() => setBookDropdownOpen(true)}
                  className="h-9 w-full rounded-full border border-transparent bg-[var(--tome-surface-elevated)] pl-9 pr-3 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
                />
                {bookDropdownOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border bg-card shadow-xl" style={{ borderColor: "rgba(128,128,128,0.12)" }}>
                    {filteredBooks.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => {
                          update({ book_id: b.id, book_title: b.title })
                          setBookQuery("")
                          setBookDropdownOpen(false)
                        }}
                        className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${b.id === station.book_id ? "bg-muted" : "hover:bg-muted/50"}`}
                      >
                        <span className="truncate font-medium">{b.title}</span>
                        <span className="shrink-0 opacity-40">by {b.author}</span>
                        {b.id === station.book_id && <Check className="ml-auto size-3 text-green-500" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Chapter range (reading) */}
          {station.type === "reading" && selectedBook && (
            <div className="flex gap-3">
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold">Start Chapter</label>
                <Input
                  type="number"
                  min={1}
                  max={selectedBook.chapter_count ?? 1}
                  value={station.chapter_start ?? ""}
                  onChange={(e) => update({ chapter_start: parseInt(e.target.value) || null })}
                  className="text-sm"
                />
              </div>
              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold">End Chapter</label>
                <Input
                  type="number"
                  min={station.chapter_start ?? 1}
                  max={selectedBook.chapter_count ?? 1}
                  value={station.chapter_end ?? ""}
                  onChange={(e) => update({ chapter_end: parseInt(e.target.value) || null })}
                  className="text-sm"
                />
              </div>
              <p className="self-end text-xs opacity-40 pb-2">
                of {selectedBook.chapter_count ?? 0}
              </p>
            </div>
          )}

          {/* Quiz config */}
          {station.type === "quiz" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">
                Trial ID <span className="font-normal opacity-40">(or leave empty for auto-generated)</span>
              </label>
              <Input
                value={station.quiz_id ?? ""}
                onChange={(e) => update({ quiz_id: e.target.value || null })}
                placeholder="e.g., odyssey-book-9-trial"
                className="text-sm"
              />
            </div>
          )}

          {/* Reflection config */}
          {station.type === "reflection" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">Reflection Prompt</label>
                <textarea
                  value={station.reflection_prompt ?? ""}
                  onChange={(e) => update({ reflection_prompt: e.target.value })}
                  placeholder="What did you find most surprising about this passage?"
                  rows={3}
                  className="w-full rounded-lg border border-transparent bg-[var(--tome-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--tome-accent)] focus:outline-none resize-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold">
                  Minimum Words <span className="font-normal opacity-40">(optional)</span>
                </label>
                <Input
                  type="number"
                  min={0}
                  value={station.min_words ?? ""}
                  onChange={(e) => update({ min_words: parseInt(e.target.value) || null })}
                  placeholder="50"
                  className="w-24 text-sm"
                />
              </div>
            </>
          )}

          {/* Target time */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Target Time (minutes)</label>
            <Input
              type="number"
              min={1}
              max={120}
              value={station.target_minutes}
              onChange={(e) => update({ target_minutes: parseInt(e.target.value) || 10 })}
              className="w-24 text-sm"
            />
          </div>

          {/* Require completion */}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={station.require_completion}
              onChange={(e) => update({ require_completion: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300"
            />
            <div>
              <p className="text-sm font-medium">Require completion</p>
              <p className="text-xs opacity-50">
                Student cannot advance without finishing this station
              </p>
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(station)}
            className="text-white"
            style={{ backgroundColor: "var(--tome-indigo, #6366F1)" }}
          >
            {initial.title ? "Update Station" : "Add Station"}
          </Button>
        </div>
      </div>
    </div>
  )
}
