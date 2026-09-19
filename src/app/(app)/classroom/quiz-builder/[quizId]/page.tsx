"use client"

import { use, useEffect, useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Save, Eye, Sparkles,
  Check, Feather, Clock, Target, Send, BarChart2, Radio,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBooks } from "@/lib/content"
import { publishTeacherQuiz, assignQuiz, saveTeacherQuiz } from "@/lib/actions/teacher-quizzes"
import { launchLiveQuiz } from "@/lib/actions/live-quiz"
import { QuestionsAvailableChip } from "@/components/credits/questions-available-chip"
import { QuizQuestionEditor, type QuizQuestion } from "@/components/classroom/quiz-question-editor"

interface QuizSettings {
  timeLimit: number | null
  passingScore: number
  allowRetakes: boolean
  randomizeOrder: boolean
  showAnswers: boolean
}

// ── Component ──────────────────────────────────────────────

export default function QuizEditorPage({ params }: { params: Promise<{ quizId: string }> }) {
  const { quizId } = use(params)
  const router = useRouter()
  const { user, isDemoMode } = useAuth()
  const [title, setTitle] = useState("Untitled Quiz")
  const [bookId, setBookId] = useState("")
  const [bookSearch, setBookSearch] = useState("")
  const [difficulty, setDifficulty] = useState("scholar")
  const [settings, setSettings] = useState<QuizSettings>({
    timeLimit: null,
    passingScore: 60,
    allowRetakes: true,
    randomizeOrder: true,
    showAnswers: true,
  })
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>("draft")
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([])
  const [assignClassrooms, setAssignClassrooms] = useState<string[]>([])
  const [dueDate, setDueDate] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [launching, setLaunching] = useState(false)
  // Unsaved-changes tracking. hydratedRef flips true one tick after the initial
  // load so the load's own state writes don't mark the draft dirty; genuine
  // edits after that set `dirty`, which drives the Save-Draft indicator and a
  // beforeunload guard.
  const [dirty, setDirty] = useState(false)
  const hydratedRef = useRef(false)

  const books = getBooks()
  const selectedBook = books.find((b) => b.id === bookId)
  const filteredBooks = bookSearch
    ? books.filter((b) =>
        b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
        b.author.toLowerCase().includes(bookSearch.toLowerCase()),
      ).slice(0, 6)
    : []

  // Load quiz data
  useEffect(() => {
    if (isDemoMode || !user) {
      setLoading(false)
      return
    }

    // Real mode: load from Supabase
    async function fetchQuiz() {
      const supabase = createClient()

      const { data: quiz } = await supabase
        .from("teacher_quizzes")
        .select("*")
        .eq("id", quizId)
        .single()

      if (quiz) {
        setTitle(quiz.title)
        setBookId(quiz.book_id ?? "")
        setDifficulty(quiz.difficulty ?? "scholar")
        setStatus(quiz.status ?? "draft")
        setSettings({
          timeLimit: quiz.time_limit_minutes,
          passingScore: quiz.passing_score ?? 60,
          allowRetakes: quiz.allow_retakes ?? true,
          randomizeOrder: quiz.randomize_order ?? true,
          showAnswers: quiz.show_answers ?? true,
        })
      }

      const { data: questionData } = await supabase
        .from("teacher_quiz_questions")
        .select("*")
        .eq("quiz_id", quizId)
        .order("sort_order", { ascending: true })

      if (questionData) {
        // `...q` carries the passthrough metadata (rubric / reference_answer /
        // max_points / hints / …) so a Tome Assistant-generated free-response question
        // survives a load → save round-trip and stays auto-gradable.
        setQuestions(
          questionData.map((q) => ({
            ...q,
            options: q.options as string[] | null,
            meta: (q.meta ?? null) as Record<string, unknown> | null,
          })),
        )
      }

      // Teacher's own classrooms, for the "Assign to class" picker.
      const { data: classData } = await supabase
        .from("classrooms")
        .select("id, name")
        .eq("teacher_id", user!.id)
        .order("created_at", { ascending: false })

      if (classData) setClassrooms(classData)

      setLoading(false)
    }

    fetchQuiz()
  }, [user, quizId, isDemoMode])

  // Allow dirty tracking only after the load-driven state writes have settled.
  useEffect(() => {
    if (loading) return
    const t = setTimeout(() => { hydratedRef.current = true }, 0)
    return () => clearTimeout(t)
  }, [loading])

  // Mark the draft dirty on any content edit (after hydration).
  useEffect(() => {
    if (hydratedRef.current) setDirty(true)
  }, [title, bookId, difficulty, settings, questions])

  // Warn before leaving with unsaved edits.
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  // Returns true only when the draft actually persisted. The save routes through
  // the authoritative saveTeacherQuiz server action, so a failed write is
  // surfaced (toast) instead of being swallowed while the UI claims "Saved".
  const handleSave = useCallback(async (): Promise<boolean> => {
    setSaving(true)

    if (isDemoMode || !user) {
      // Demo mode: no backing account to write to — show local feedback only.
      await new Promise((r) => setTimeout(r, 500))
      setSaving(false)
      setSaved(true)
      setDirty(false)
      setTimeout(() => setSaved(false), 2000)
      return true
    }

    const res = await saveTeacherQuiz({
      quizId,
      title,
      bookId: bookId || null,
      difficulty: difficulty as "apprentice" | "scholar" | "master",
      settings,
      questions: questions.map((q) => ({
        question_type: q.question_type,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        points: q.points,
        meta: q.meta ?? null,
        rubric: q.rubric,
        reference_answer: q.reference_answer ?? null,
        max_points: q.max_points ?? null,
        difficulty: q.difficulty ?? null,
        category: q.category ?? null,
        hints: q.hints,
        distractor_eliminations: q.distractor_eliminations,
        source_anchor: q.source_anchor,
      })),
    })

    setSaving(false)
    if (!res.ok) {
      // Keep the teacher's edits on screen; nothing was silently lost.
      toast.error(res.error || "Couldn't save your changes. Please try again.")
      return false
    }
    setSaved(true)
    setDirty(false)
    setTimeout(() => setSaved(false), 2000)
    return true
  }, [user, isDemoMode, quizId, title, bookId, difficulty, settings, questions])

  const handlePublish = useCallback(async () => {
    const savedOk = await handleSave()
    if (isDemoMode || !user) {
      router.push("/classroom/quiz-builder")
      return
    }
    // Don't publish on top of a save that didn't land — the error toast from
    // handleSave already told the teacher what went wrong.
    if (!savedOk) return
    // Server action enforces teacher ownership + ≥1 question under RLS.
    const res = await publishTeacherQuiz(quizId)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    setStatus("published")
    toast.success("Quiz published")
  }, [handleSave, quizId, router, isDemoMode, user])

  const toggleAssignClassroom = useCallback((id: string) => {
    setAssignClassrooms((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }, [])

  const handleAssign = useCallback(async () => {
    if (assignClassrooms.length === 0) return
    setAssigning(true)
    const points = questions.reduce((sum, q) => sum + q.points, 0)
    // datetime-local is wall-clock local; convert to an ISO instant for the API.
    const dueAt = dueDate ? new Date(dueDate).toISOString() : undefined

    let totalStudents = 0
    let sentClasses = 0
    let resentClasses = 0
    const failed: string[] = []
    // Sequential so each class's duplicate check + seed lands before the next.
    for (const cid of assignClassrooms) {
      const res = await assignQuiz({ quizId, classroomId: cid, points, dueAt })
      if (res.ok) {
        sentClasses += 1
        totalStudents += res.data.assigned
        if (res.data.reused) resentClasses += 1
      } else {
        failed.push(classrooms.find((c) => c.id === cid)?.name ?? "a class")
      }
    }
    setAssigning(false)

    if (sentClasses > 0) {
      const s = totalStudents === 1 ? "" : "s"
      const cls = sentClasses === 1 ? "class" : "classes"
      const resentNote = resentClasses > 0 ? ` (${resentClasses} updated, no re-notify)` : ""
      toast.success(`Sent to ${totalStudents} student${s} across ${sentClasses} ${cls}${resentNote}`)
      setAssignClassrooms([])
      setDueDate("")
    }
    if (failed.length > 0) {
      toast.error(`Couldn't send to ${failed.join(", ")}`)
    }
  }, [assignClassrooms, dueDate, quizId, questions, classrooms])

  const handleLaunchLive = useCallback(async () => {
    // Live quizzes run for a single class on a shared screen.
    if (assignClassrooms.length !== 1) return
    setLaunching(true)
    const res = await launchLiveQuiz({ quizId, classroomId: assignClassrooms[0] })
    setLaunching(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    router.push(`/classroom/live/${res.data.sessionId}`)
  }, [assignClassrooms, quizId, router])

  const handleAIGenerate = useCallback(async () => {
    if (!bookId) return
    setGenerating(true)

    try {
      const res = await fetch("/api/quiz-generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, difficulty, count: 5 }),
      })

      if (res.ok) {
        const { questions: generated } = await res.json()
        const newQuestions: QuizQuestion[] = generated.map(
          (g: { type: string; question: string; options?: string[]; correctAnswer: string; explanation: string }, i: number) => ({
            id: `ai-${Date.now()}-${i}`,
            question_type: g.type,
            question_text: g.question,
            options: g.options ?? null,
            correct_answer: g.correctAnswer,
            explanation: g.explanation,
            points: 10,
            sort_order: questions.length + i,
          }),
        )
        setQuestions((prev) => [...prev, ...newQuestions])
      }
    } catch {
      // AI generation is optional
    }

    setGenerating(false)
  }, [bookId, difficulty, questions.length])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      {/* Header */}
      <Link
        href="/classroom/quiz-builder"
        className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" /> Back to quizzes
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex size-10 items-center justify-center rounded-xl bg-[var(--tome-accent)]">
          <Feather className="size-5 text-white" />
        </div>
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-bold border-none px-0 h-auto focus-visible:ring-0"
            placeholder="Quiz title..."
          />
        </div>
        <QuestionsAvailableChip className="hidden md:inline-flex" />
      </div>

      {/* Book selector + difficulty + settings */}
      <div className="rounded-xl border bg-card p-4 space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Input
              value={bookSearch || selectedBook?.title || ""}
              onChange={(e) => { setBookSearch(e.target.value); setBookId("") }}
              placeholder="Search for a book..."
              className="text-sm"
            />
            {bookSearch && filteredBooks.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border bg-card shadow-lg max-h-48 overflow-y-auto">
                {filteredBooks.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => { setBookId(b.id); setBookSearch("") }}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 flex items-center justify-between"
                  >
                    <span className="font-medium">{b.title}</span>
                    <span className="text-xs text-muted-foreground">{b.author}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="apprentice">Apprentice</option>
            <option value="scholar">Scholar</option>
            <option value="master">Master</option>
          </select>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-1.5 text-xs"
          >
            <Target className="size-3.5" />
            Settings
          </Button>
        </div>

        {/* Quiz stats */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="font-medium">{questions.length} questions</span>
          <span>{totalPoints} points total</span>
          <span>Passing: {settings.passingScore}%</span>
          {settings.timeLimit && <span className="flex items-center gap-1"><Clock className="size-3" />{settings.timeLimit} min</span>}
        </div>

        {/* Settings panel */}
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="border-t pt-3 grid grid-cols-2 gap-3"
          >
            <div>
              <label className="text-xs font-medium text-muted-foreground">Time limit (minutes)</label>
              <Input
                type="number"
                min={0}
                value={settings.timeLimit ?? ""}
                onChange={(e) => setSettings((s) => ({ ...s, timeLimit: e.target.value ? Number(e.target.value) : null }))}
                placeholder="No limit"
                className="mt-1 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Passing score (%)</label>
              <Input
                type="number"
                min={0}
                max={100}
                value={settings.passingScore}
                onChange={(e) => setSettings((s) => ({ ...s, passingScore: Number(e.target.value) }))}
                className="mt-1 text-sm"
              />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={settings.allowRetakes} onChange={(e) => setSettings((s) => ({ ...s, allowRetakes: e.target.checked }))} className="size-4 rounded" />
              Allow retakes
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={settings.randomizeOrder} onChange={(e) => setSettings((s) => ({ ...s, randomizeOrder: e.target.checked }))} className="size-4 rounded" />
              Randomize order
            </label>
            <label className="flex items-center gap-2 text-sm cursor-pointer col-span-2">
              <input type="checkbox" checked={settings.showAnswers} onChange={(e) => setSettings((s) => ({ ...s, showAnswers: e.target.checked }))} className="size-4 rounded" />
              Show correct answers after submission
            </label>
          </motion.div>
        )}
      </div>

      {/* Questions — shared 16-type editor (same component as assignment create) */}
      <div className="mt-6">
        <QuizQuestionEditor questions={questions} onChange={setQuestions} />
      </div>

      {/* AI Generate button */}
      {bookId && (
        <Button
          variant="outline"
          onClick={handleAIGenerate}
          disabled={generating}
          className="mt-3 w-full gap-2 border-[var(--tome-accent)]/30 text-[var(--tome-accent)] hover:bg-[var(--tome-accent)]/5"
        >
          <Sparkles className="size-4" />
          {generating ? "Generating questions..." : "AI-Assist: Generate 5 questions"}
        </Button>
      )}

      {/* Action bar */}
      <div className="mt-8 space-y-4 border-t pt-6">
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSave} disabled={saving} className="gap-1.5">
            {saved ? (
              <Check className="size-3.5 text-green-500" />
            ) : dirty ? (
              <span className="size-2 rounded-full bg-amber-500" aria-hidden />
            ) : (
              <Save className="size-3.5" />
            )}
            {saving ? "Saving..." : saved ? "Saved!" : dirty ? "Save Draft*" : "Save Draft"}
          </Button>
          <Button onClick={handlePublish} disabled={questions.length === 0} className="flex-1 gap-1.5 bg-[var(--tome-accent)] hover:bg-[color-mix(in_srgb,var(--tome-accent)_85%,black)] text-white">
            <Eye className="size-3.5" />
            {status === "published" ? "Save & Re-publish" : "Publish Quiz"}
          </Button>
        </div>

        {/* Assign + results — only once the quiz is published */}
        {status === "published" && !isDemoMode && (
          <div className="rounded-xl border bg-card p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">Assign to a class</p>
              <Link
                href={`/classroom/quiz-builder/${quizId}/results`}
                className="flex items-center gap-1.5 text-xs text-[var(--tome-accent)] hover:underline"
              >
                <BarChart2 className="size-3.5" />
                View results
              </Link>
            </div>
            {classrooms.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                You have no classes yet. Create one to assign this quiz.
              </p>
            ) : (
              <>
                {/* Multi-class picker — check every class that should get it. */}
                <div className="space-y-1 max-h-44 overflow-y-auto rounded-lg border bg-background p-1.5">
                  {classrooms.map((c) => {
                    const checked = assignClassrooms.includes(c.id)
                    return (
                      <label
                        key={c.id}
                        className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors ${
                          checked ? "bg-[var(--tome-accent)]/10 text-[var(--tome-accent)]" : "hover:bg-muted/50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleAssignClassroom(c.id)}
                          className="size-4 rounded"
                        />
                        <span className="flex-1">{c.name}</span>
                      </label>
                    )
                  })}
                </div>

                {/* Optional due date. */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Due date (optional)</label>
                  <Input
                    type="datetime-local"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="mt-1 text-sm"
                  />
                </div>

                <Button
                  onClick={handleAssign}
                  disabled={assignClassrooms.length === 0 || assigning}
                  className="w-full gap-1.5"
                >
                  <Send className="size-3.5" />
                  {assigning
                    ? "Sending…"
                    : assignClassrooms.length > 1
                      ? `Send to ${assignClassrooms.length} classes`
                      : "Send to class"}
                </Button>
              </>
            )}
            {classrooms.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  Or run it live — students race to answer on a shared big screen.
                  Select exactly one class.
                </p>
                <Button
                  onClick={handleLaunchLive}
                  disabled={assignClassrooms.length !== 1 || launching}
                  className="mt-2 w-full gap-1.5 bg-[#6C2D5C] text-white hover:bg-[#7d3a6c]"
                >
                  <Radio className="size-3.5" />
                  {launching ? "Launching…" : "Launch Live Quiz"}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
