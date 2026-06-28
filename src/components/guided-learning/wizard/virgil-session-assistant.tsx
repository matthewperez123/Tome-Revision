"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import {
  Sparkles,
  Send,
  Search,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { SupabaseBook } from "@/lib/supabase"
import type { DraftStation } from "@/lib/guided-learning-types"
import {
  QUESTION_TYPE_LABELS,
  type TeacherQuizDraft,
  type TeacherQuizDraftQuestion,
} from "@/lib/teacher-quiz-types"

// Iridescent treatment is reserved for Virgil affordances only.
const IRIDESCENT =
  "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  draft?: TeacherQuizDraft
  draftAdded?: boolean
}

interface ChapterOpt {
  chapter_index: number
  title: string | null
}

interface Props {
  /** Append a ready-made quiz station to the wizard's station queue. */
  onAttachQuiz: (station: DraftStation) => void
}

const GREETING: ChatMessage = {
  id: "greeting",
  role: "assistant",
  content:
    "I'm Virgil. Pick a book and the sections you'd like — in any order — then just tell me what kind of quiz to build (e.g. \u201csix questions on Book IX, focus on fate\u201d).",
}

export function VirgilSessionAssistant({ onAttachQuiz }: Props) {
  const [open, setOpen] = useState(true)

  // ── Grounding scope ──
  const [books, setBooks] = useState<SupabaseBook[]>([])
  const [bookId, setBookId] = useState<string | null>(null)
  const [bookQuery, setBookQuery] = useState("")
  const [bookDropdownOpen, setBookDropdownOpen] = useState(false)
  const [chapters, setChapters] = useState<ChapterOpt[]>([])
  const [selected, setSelected] = useState<number[]>([])

  // ── Chat ──
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState("")
  const [sending, setSending] = useState(false)
  const threadRef = useRef<HTMLDivElement>(null)
  const bookBoxRef = useRef<HTMLDivElement>(null)

  const selectedBook = books.find((b) => b.id === bookId)

  // Load books once.
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

  // Load chapters when the book changes.
  useEffect(() => {
    if (!bookId) {
      setChapters([])
      setSelected([])
      return
    }
    const supabase = createClient()
    supabase
      .from("chapters")
      .select("chapter_index, title")
      .eq("book_id", bookId)
      .order("chapter_index", { ascending: true })
      .then(({ data }) => {
        setChapters((data as ChapterOpt[]) ?? [])
        setSelected([])
      })
  }, [bookId])

  // Keep the thread pinned to the latest message.
  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight, behavior: "smooth" })
  }, [messages, sending])

  // Close the book dropdown on any click outside the search box.
  useEffect(() => {
    if (!bookDropdownOpen) return
    const onDown = (e: MouseEvent) => {
      if (bookBoxRef.current && !bookBoxRef.current.contains(e.target as Node)) {
        setBookDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", onDown)
    return () => document.removeEventListener("mousedown", onDown)
  }, [bookDropdownOpen])

  const filteredBooks = useMemo(() => {
    if (!bookQuery.trim()) return books.slice(0, 20)
    const q = bookQuery.toLowerCase()
    return books
      .filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
      .slice(0, 20)
  }, [books, bookQuery])

  const toggleChapter = (idx: number) =>
    setSelected((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx],
    )

  const send = useCallback(async () => {
    const text = input.trim()
    if (!text || sending) return
    const userMsg: ChatMessage = { id: crypto.randomUUID(), role: "user", content: text }
    const history = [...messages.filter((m) => m.id !== "greeting"), userMsg]
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setSending(true)
    try {
      const res = await fetch("/api/guided-sessions/quiz/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({ role: m.role, content: m.content })),
          bookId,
          bookTitle: selectedBook?.title,
          bookAuthor: selectedBook?.author,
          chapterIndexes: selected,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: data.reply ?? "Something went wrong on my end.",
          draft: data.draft as TeacherQuizDraft | undefined,
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", content: "Network hiccup — try sending that again." },
      ])
    } finally {
      setSending(false)
    }
  }, [input, sending, messages, bookId, selectedBook, selected])

  const addToSession = useCallback(
    async (msgId: string, draft: TeacherQuizDraft) => {
      // Publish the draft so the referenced quiz is live for students.
      try {
        await fetch(`/api/guided-sessions/quiz/${draft.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: "published",
            questions: draft.questions.map((q) => ({
              question_type: q.question_type,
              question_text: q.question_text,
              options: q.options,
              correct_answer: q.correct_answer,
              explanation: q.explanation,
              difficulty: q.difficulty,
              category: q.category,
              points: q.points,
              max_points: q.max_points,
              rubric: q.rubric,
              reference_answer: q.reference_answer,
              source_anchor: q.source_anchor,
            })),
          }),
        })
      } catch {
        // Non-fatal: the station still references the draft id.
      }

      const count = draft.questions.length
      const summary = `${count} question${count === 1 ? "" : "s"} · ${draft.difficulty ?? "scholar"}`
      onAttachQuiz({
        id: crypto.randomUUID(),
        type: "quiz",
        title: selectedBook ? `${selectedBook.title} — Quiz` : "Virgil Quiz",
        book_id: bookId,
        book_title: selectedBook?.title,
        chapter_start: selected.length ? Math.min(...selected) : null,
        chapter_end: selected.length ? Math.max(...selected) : null,
        section_range: null,
        quiz_id: null,
        teacher_quiz_id: draft.id,
        teacher_quiz_summary: summary,
        quiz_config: null,
        reflection_prompt: null,
        min_words: null,
        target_minutes: 10,
        require_completion: false,
      })
      setMessages((prev) =>
        prev.map((m) => (m.id === msgId ? { ...m, draftAdded: true } : m)),
      )
    },
    [bookId, selectedBook, selected, onAttachQuiz],
  )

  return (
    <div
      className="mb-8 overflow-hidden rounded-2xl border"
      style={{ borderColor: "rgba(99,102,241,0.35)" }}
    >
      {/* Iridescent header (Virgil signature) */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-white"
        style={{ backgroundImage: IRIDESCENT }}
      >
        <Sparkles className="h-4 w-4" />
        <span className="text-sm font-semibold tracking-wide">Build a quiz with Virgil</span>
        <span className="ml-1 text-xs font-normal opacity-80">— ask in plain language</span>
        {open ? (
          <ChevronUp className="ml-auto h-4 w-4" />
        ) : (
          <ChevronDown className="ml-auto h-4 w-4" />
        )}
      </button>

      {open && (
        <div className="space-y-3 bg-card p-4">
          {/* Scope: book + out-of-order section picker */}
          <div className="space-y-2">
            <div className="relative" ref={bookBoxRef}>
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={selectedBook ? `${selectedBook.title} — ${selectedBook.author}` : "Search a book to ground the quiz..."}
                value={bookQuery}
                onChange={(e) => {
                  setBookQuery(e.target.value)
                  setBookDropdownOpen(true)
                }}
                onFocus={() => setBookDropdownOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setBookDropdownOpen(false)
                }}
                className="h-9 w-full rounded-full border border-transparent bg-[var(--tome-surface-elevated)] pl-9 pr-3 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
              />
              {bookDropdownOpen && filteredBooks.length > 0 && (
                <div
                  className="absolute left-0 right-0 top-full z-50 mt-1 max-h-48 overflow-y-auto rounded-xl border bg-card shadow-xl"
                  style={{ borderColor: "rgba(128,128,128,0.12)" }}
                >
                  {filteredBooks.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setBookId(b.id)
                        setBookQuery("")
                        setBookDropdownOpen(false)
                      }}
                      className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors ${b.id === bookId ? "bg-muted" : "hover:bg-muted/50"}`}
                    >
                      <span className="truncate font-medium">{b.title}</span>
                      <span className="shrink-0 opacity-40">by {b.author}</span>
                      {b.id === bookId && <Check className="ml-auto size-3 text-green-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Section chips — multi-select, any order, non-contiguous. */}
            {selectedBook && chapters.length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold opacity-70">
                    Sections{" "}
                    <span className="font-normal opacity-50">
                      {selected.length ? `· ${selected.length} selected` : "· all (tap to narrow)"}
                    </span>
                  </label>
                  {selected.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelected([])}
                      className="text-[10px] underline opacity-50 hover:opacity-100"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {chapters.map((c) => {
                    const on = selected.includes(c.chapter_index)
                    const order = selected.indexOf(c.chapter_index) + 1
                    return (
                      <button
                        key={c.chapter_index}
                        type="button"
                        onClick={() => toggleChapter(c.chapter_index)}
                        title={c.title ?? `Chapter ${c.chapter_index}`}
                        className="flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
                        style={{
                          borderColor: on ? "var(--tome-indigo, #6366F1)" : "rgba(128,128,128,0.2)",
                          backgroundColor: on ? "rgba(99,102,241,0.1)" : "transparent",
                        }}
                      >
                        {on && (
                          <span className="flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[9px] font-bold text-white" style={{ backgroundColor: "var(--tome-indigo,#6366F1)" }}>
                            {order}
                          </span>
                        )}
                        {c.title?.trim() ? c.title : `Ch. ${c.chapter_index}`}
                      </button>
                    )
                  })}
                </div>
                <p className="text-[10px] opacity-40">
                  Numbers show the order you picked — selection need not be chronological.
                </p>
              </div>
            )}
          </div>

          {/* Chat thread */}
          <div
            ref={threadRef}
            className="max-h-72 space-y-2.5 overflow-y-auto rounded-xl border p-3"
            style={{ borderColor: "rgba(128,128,128,0.12)" }}
          >
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
                <div className="max-w-[85%]">
                  <div
                    className="rounded-2xl px-3 py-2 text-sm"
                    style={
                      m.role === "user"
                        ? { backgroundColor: "rgba(99,102,241,0.1)" }
                        : { backgroundColor: "var(--tome-surface-elevated)" }
                    }
                  >
                    {m.content}
                  </div>
                  {m.draft && (
                    <DraftPreview
                      draft={m.draft}
                      added={!!m.draftAdded}
                      onAdd={() => addToSession(m.id, m.draft!)}
                    />
                  )}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex items-center gap-2 text-xs opacity-50">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Virgil is reading…
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  send()
                }
              }}
              rows={1}
              placeholder={bookId ? "Ask Virgil to build a quiz…" : "Pick a book above first…"}
              className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border border-transparent bg-[var(--tome-surface-elevated)] px-3 py-2 text-sm focus:border-[var(--tome-accent)] focus:outline-none"
            />
            <Button
              onClick={send}
              disabled={sending || !input.trim()}
              className="h-10 gap-1.5 px-4 text-white"
              style={{ backgroundImage: IRIDESCENT }}
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Inline draft preview with an "add to session" action ──────────────────────

function DraftPreview({
  draft,
  added,
  onAdd,
}: {
  draft: TeacherQuizDraft
  added: boolean
  onAdd: () => void
}) {
  return (
    <div
      className="mt-2 space-y-2 rounded-xl border p-2.5"
      style={{ borderColor: "rgba(99,102,241,0.35)" }}
    >
      <p className="text-[11px] font-semibold opacity-70">
        {draft.questions.length} draft question{draft.questions.length === 1 ? "" : "s"}
      </p>
      <ol className="space-y-1.5">
        {draft.questions.map((q, i) => (
          <li key={q.id} className="text-xs">
            <span className="mr-1 font-bold opacity-40">{i + 1}.</span>
            <span
              className="mr-1.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium"
              style={{ backgroundColor: "rgba(99,102,241,0.08)", color: "var(--tome-indigo,#6366F1)" }}
            >
              {QUESTION_TYPE_LABELS[q.question_type]}
            </span>
            {q.question_text}
            {correctLine(q) && (
              <span className="ml-1 italic opacity-50">→ {correctLine(q)}</span>
            )}
          </li>
        ))}
      </ol>
      <Button
        onClick={onAdd}
        disabled={added}
        className="w-full gap-1.5 text-white"
        style={{ backgroundImage: added ? undefined : IRIDESCENT, backgroundColor: added ? "var(--tome-success,#2D9A47)" : undefined }}
      >
        {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
        {added ? "Added to session" : "Add quiz to session"}
      </Button>
    </div>
  )
}

function correctLine(q: TeacherQuizDraftQuestion): string | null {
  if (q.correct_answer) return q.correct_answer
  if (q.reference_answer) return q.reference_answer
  return null
}
