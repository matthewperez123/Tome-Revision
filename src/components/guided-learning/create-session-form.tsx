"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { useRouter } from "next/navigation"
import { BookOpen, Brain, Clock, Loader2, Search, X, Check, Layers, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TIME_LIMIT_PRESETS } from "@/lib/guided-learning-types"
import type { GuidedSessionType } from "@/lib/guided-learning-types"
import type { SupabaseBook } from "@/lib/supabase"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { useTeacherStudents, type TeacherStudent } from "@/hooks/use-teacher-students"
import { createDemoSession } from "@/lib/guided-learning-demo"

// ── Assignment type options ─────────────────────────────────────────────────

type AssignmentType = GuidedSessionType | "both"

const TYPE_OPTIONS: { value: AssignmentType; label: string; subtitle: string; icon: typeof BookOpen }[] = [
  { value: "chapter", label: "Chapter", subtitle: "Read a chapter", icon: BookOpen },
  { value: "trial", label: "Trial", subtitle: "Take a quiz", icon: Brain },
  { value: "both", label: "Both", subtitle: "Read then quiz", icon: Layers },
]

// ── Book Search Picker ──────────────────────────────────────────────────────

function BookSearchPicker({
  books,
  selectedId,
  onSelect,
}: {
  books: SupabaseBook[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const selected = books.find((b) => b.id === selectedId)

  const filtered = useMemo(() => {
    if (!query.trim()) return books.slice(0, 20)
    const q = query.toLowerCase()
    return books
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 20)
  }, [books, query])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          placeholder={selected ? `${selected.title} — ${selected.author}` : "Search books, authors\u2026"}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
          onFocus={() => setIsOpen(true)}
          className="h-9 w-full rounded-full border border-transparent bg-[var(--tome-surface-elevated)] pl-9 pr-8 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
        />
        {(query || selected) && (
          <button
            onClick={() => {
              if (query) { setQuery(""); inputRef.current?.focus() }
              else { onSelect(""); setQuery("") }
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="size-3" />
          </button>
        )}
      </div>

      {selected && !isOpen && (
        <div
          className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
          style={{ backgroundColor: "rgba(99, 102, 241, 0.06)", border: "1px solid rgba(99, 102, 241, 0.15)" }}
        >
          <BookOpen className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--tome-indigo, #6366F1)" }} />
          <span className="truncate font-medium">{selected.title}</span>
          <span className="shrink-0 text-xs opacity-50">by {selected.author}</span>
        </div>
      )}

      {isOpen && (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-64 overflow-y-auto rounded-xl border bg-card shadow-xl"
          style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs opacity-40">No books found</p>
          ) : (
            filtered.map((b) => {
              const isActive = b.id === selectedId
              return (
                <button
                  key={b.id}
                  onClick={() => { onSelect(b.id); setQuery(""); setIsOpen(false) }}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${isActive ? "bg-muted" : "hover:bg-muted/50"}`}
                >
                  <BookOpen className="size-3.5 shrink-0" style={{ color: "var(--tome-indigo, #6366F1)", opacity: 0.5 }} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-xs">{b.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{b.author}</p>
                  </div>
                  {isActive && <Check className="size-3.5 shrink-0 text-green-500" />}
                </button>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}

// ── Student Roster Selector ─────────────────────────────────────────────────

function StudentRosterSelector({
  roster,
  rosterLoading,
  selectedIds,
  onToggle,
  onSelectAll,
  onDeselectAll,
}: {
  roster: TeacherStudent[]
  rosterLoading: boolean
  selectedIds: Set<string>
  onToggle: (id: string) => void
  onSelectAll: () => void
  onDeselectAll: () => void
}) {
  const [searchQuery, setSearchQuery] = useState("")

  const students = useMemo(() => {
    if (!searchQuery.trim()) return roster
    const q = searchQuery.toLowerCase()
    return roster.filter((s) => s.name.toLowerCase().includes(q))
  }, [searchQuery, roster])

  if (rosterLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="size-5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  if (roster.length === 0) {
    return (
      <div
        className="rounded-xl border px-4 py-10 text-center"
        style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}
      >
        <Users className="mx-auto mb-2 size-6 opacity-30" />
        <p className="text-sm font-medium">No students yet</p>
        <p className="mt-1 text-xs opacity-50">
          Students appear here once they join one of your classrooms with your
          join code.
        </p>
      </div>
    )
  }

  const allSelected = selectedIds.size === roster.length

  return (
    <div className="space-y-3">
      {/* Search + bulk actions */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search students\u2026"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 w-full rounded-full border border-transparent bg-[var(--tome-surface-elevated)] pl-9 pr-3 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
          />
        </div>
        <button
          onClick={allSelected ? onDeselectAll : onSelectAll}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted/50"
          style={{ color: "var(--tome-indigo, #6366F1)" }}
        >
          {allSelected ? "Deselect All" : "Select All"}
        </button>
      </div>

      {/* Selected count */}
      <p className="text-xs opacity-50">
        {selectedIds.size} of {roster.length} students selected
      </p>

      {/* Student list */}
      <div className="max-h-56 overflow-y-auto rounded-xl border" style={{ borderColor: "rgba(128, 128, 128, 0.12)" }}>
        {students.map((s) => {
          const isSelected = selectedIds.has(s.id)
          return (
            <button
              key={s.id}
              onClick={() => onToggle(s.id)}
              className={`flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors border-b last:border-0 ${
                isSelected ? "bg-[rgba(99,102,241,0.04)]" : "hover:bg-muted/30"
              }`}
              style={{ borderColor: "rgba(128, 128, 128, 0.06)" }}
            >
              {/* Checkbox */}
              <div
                className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border transition-colors"
                style={{
                  borderColor: isSelected ? "var(--tome-indigo, #6366F1)" : "rgba(128, 128, 128, 0.3)",
                  backgroundColor: isSelected ? "var(--tome-indigo, #6366F1)" : "transparent",
                }}
              >
                {isSelected && <Check className="size-3 text-white" />}
              </div>

              {/* Avatar */}
              <div
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: s.avatarColor }}
              >
                {s.name[0]}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{s.name}</p>
                {s.classroomNames.length > 0 && (
                  <p className="text-[10px] text-muted-foreground truncate">
                    {s.classroomNames.join(" · ")}
                  </p>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ── Main Form ───────────────────────────────────────────────────────────────

export function CreateSessionForm() {
  const router = useRouter()
  const { user, isDemoMode } = useAuth()
  const { students: roster, loading: rosterLoading } = useTeacherStudents()
  const [type, setType] = useState<AssignmentType>("chapter")
  const [bookId, setBookId] = useState("")
  const [chapterIndex, setChapterIndex] = useState(0)
  const [trialId, setTrialId] = useState("")
  const [timeLimit, setTimeLimit] = useState(30)
  const [customTime, setCustomTime] = useState("")
  const [selectedStudentIds, setSelectedStudentIds] = useState<Set<string>>(new Set())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [books, setBooks] = useState<SupabaseBook[]>([])
  const [selectedBook, setSelectedBook] = useState<SupabaseBook | null>(null)

  const needsBook = type === "chapter" || type === "both"
  const needsTrial = type === "trial" || type === "both"

  // Load available books
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

  useEffect(() => {
    setSelectedBook(books.find((b) => b.id === bookId) ?? null)
  }, [bookId, books])

  const handleToggleStudent = useCallback((id: string) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const handleSelectAll = useCallback(() => {
    setSelectedStudentIds(new Set(roster.map((s) => s.id)))
  }, [roster])

  const handleDeselectAll = useCallback(() => {
    setSelectedStudentIds(new Set())
  }, [])

  const handleSubmit = useCallback(async () => {
    setError(null)
    setIsSubmitting(true)

    const finalTime = customTime ? parseInt(customTime) : timeLimit

    if (selectedStudentIds.size === 0) {
      setError("Select at least one student")
      setIsSubmitting(false)
      return
    }

    try {
      if (isDemoMode || !user) {
        // Demo mode: create session locally. Roster is empty in demo mode
        // (no fabricated students).
        const students = roster
          .filter((s) => selectedStudentIds.has(s.id))
          .map((s) => ({ id: s.id, name: s.name, avatarColor: s.avatarColor }))

        const demo = createDemoSession({
          type: type === "both" ? "chapter" : type,
          bookId: needsBook ? bookId : undefined,
          bookTitle: selectedBook?.title,
          bookAuthor: selectedBook?.author,
          chapterIndex: needsBook ? chapterIndex : undefined,
          trialId: needsTrial ? trialId : undefined,
          timeLimitMinutes: finalTime,
          students,
        })

        router.push(`/teacher/guided-learning/${demo.session.id}`)
      } else {
        // Real mode: API call
        const res = await fetch("/api/guided-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: type === "both" ? "chapter" : type,
            book_id: needsBook ? bookId : undefined,
            chapter_index: needsBook ? chapterIndex : undefined,
            trial_id: needsTrial ? trialId : undefined,
            time_limit_minutes: finalTime,
            mode: "strict",
          }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Failed to create session")
        }

        const { session } = await res.json()
        router.push(`/teacher/guided-learning/${session.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsSubmitting(false)
    }
  }, [type, bookId, chapterIndex, trialId, timeLimit, customTime, needsBook, needsTrial, selectedStudentIds, selectedBook, isDemoMode, user, router, roster])

  const canSubmit = (() => {
    if (isSubmitting) return false
    if (needsBook && !bookId) return false
    if (needsTrial && !trialId) return false
    if (selectedStudentIds.size === 0) return false
    return true
  })()

  return (
    <div className="mx-auto max-w-xl space-y-8 px-4 py-8">
      <div>
        <h1 className="mb-1 text-2xl font-bold">New Guided Session</h1>
        <p className="text-sm opacity-60">
          Create a proctored reading or trial session for your students.
        </p>
      </div>

      {/* Type selector */}
      <div className="space-y-2">
        <label className="text-sm font-semibold">Assignment Type</label>
        <div className="grid grid-cols-3 gap-3">
          {TYPE_OPTIONS.map((opt) => {
            const Icon = opt.icon
            const isActive = type === opt.value
            return (
              <button
                key={opt.value}
                onClick={() => setType(opt.value)}
                className="flex items-center gap-3 rounded-xl border-2 p-4 transition-colors"
                style={{
                  borderColor: isActive ? "var(--tome-indigo, #6366F1)" : "rgba(128, 128, 128, 0.15)",
                  backgroundColor: isActive ? "rgba(99, 102, 241, 0.06)" : "transparent",
                }}
              >
                <Icon className="h-5 w-5" style={{ color: "var(--tome-indigo, #6366F1)" }} />
                <div className="text-left">
                  <p className="text-sm font-semibold">{opt.label}</p>
                  <p className="text-xs opacity-50">{opt.subtitle}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Book selector */}
      {needsBook && (
        <div className="space-y-3">
          <label className="text-sm font-semibold">Select Book</label>
          <BookSearchPicker books={books} selectedId={bookId} onSelect={(id) => setBookId(id)} />
          {selectedBook && (
            <div className="space-y-2">
              <label className="text-sm font-semibold">Chapter</label>
              <Input
                type="number"
                min={0}
                max={(selectedBook.chapter_count ?? 1) - 1}
                value={chapterIndex}
                onChange={(e) => setChapterIndex(parseInt(e.target.value) || 0)}
                className="w-32"
              />
              <p className="text-xs opacity-50">{selectedBook.chapter_count ?? 0} chapters available</p>
            </div>
          )}
        </div>
      )}

      {/* Trial ID */}
      {needsTrial && (
        <div className="space-y-2">
          <label className="text-sm font-semibold">Trial ID</label>
          <Input value={trialId} onChange={(e) => setTrialId(e.target.value)} placeholder="Enter trial identifier" />
        </div>
      )}

      {/* Student Roster */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <Users className="h-4 w-4 opacity-60" />
          Students
        </label>
        <StudentRosterSelector
          roster={roster}
          rosterLoading={rosterLoading}
          selectedIds={selectedStudentIds}
          onToggle={handleToggleStudent}
          onSelectAll={handleSelectAll}
          onDeselectAll={handleDeselectAll}
        />
      </div>

      {/* Time limit */}
      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm font-semibold">
          <Clock className="h-4 w-4 opacity-60" />
          Time Limit
        </label>
        <div className="flex flex-wrap gap-2">
          {TIME_LIMIT_PRESETS.map((t) => (
            <button
              key={t}
              onClick={() => { setTimeLimit(t); setCustomTime("") }}
              className="rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
              style={{
                borderColor: timeLimit === t && !customTime ? "var(--tome-indigo, #6366F1)" : "rgba(128, 128, 128, 0.2)",
                backgroundColor: timeLimit === t && !customTime ? "rgba(99, 102, 241, 0.08)" : "transparent",
                color: timeLimit === t && !customTime ? "var(--tome-indigo, #6366F1)" : "inherit",
              }}
            >
              {t}m
            </button>
          ))}
          <Input
            type="number"
            min={1}
            max={180}
            value={customTime}
            onChange={(e) => setCustomTime(e.target.value)}
            placeholder="Custom"
            className="w-24 text-sm"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-sm font-medium" style={{ color: "var(--tome-error, #C84A52)" }}>{error}</p>
      )}

      {/* Submit */}
      <Button
        onClick={handleSubmit}
        disabled={!canSubmit}
        size="lg"
        className="w-full text-white"
        style={{ backgroundColor: canSubmit ? "var(--tome-indigo, #6366F1)" : undefined }}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        Create Session
      </Button>
    </div>
  )
}
