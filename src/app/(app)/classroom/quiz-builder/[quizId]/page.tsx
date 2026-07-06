"use client"

import { use, useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import {
  ArrowLeft, Plus, Trash2, Save, Eye, Sparkles,
  ChevronDown, ChevronUp, Check, Feather, Clock, Target, Send, BarChart2, Radio,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { getBooks } from "@/lib/content"
import { publishTeacherQuiz, assignQuiz, saveTeacherQuiz } from "@/lib/actions/teacher-quizzes"
import { launchLiveQuiz } from "@/lib/actions/live-quiz"

// Kept as a broad string so Virgil-authored types (multiple_select,
// vocabulary_in_context, tf_with_reason, fill_blank, free_response, …) round-trip
// through the editor even though the manual "add" buttons only cover a few.
type QuestionType = string

interface QuizQuestion {
  id: string
  question_type: QuestionType
  question_text: string
  options: string[] | null
  correct_answer: string
  explanation: string
  points: number
  sort_order: number
  // Passthrough metadata — Virgil-generated free-response questions carry a
  // rubric / reference_answer / max_points that MUST survive a save cycle so
  // they stay auto-gradable. Manually-added questions leave these null.
  rubric?: unknown
  reference_answer?: string | null
  max_points?: number | null
  difficulty?: string | null
  category?: string | null
  hints?: unknown
  distractor_eliminations?: unknown
  source_anchor?: unknown
}

const OPEN_ENDED = new Set(["free_response", "tf_with_reason", "short_answer"])

// Rubric <-> textarea. Virgil authors rubric as
// { max_points, criteria: [{ name, points, descriptor }] }; teachers edit the
// criteria as one-line-per-criterion text. Untouched rubrics keep their full
// object (onChange never fires) so points/descriptors survive a save.
function rubricToText(rubric: unknown): string {
  if (rubric == null) return ""
  if (typeof rubric === "string") return rubric
  if (Array.isArray(rubric)) {
    return rubric.map((c) => (typeof c === "string" ? c : String((c as { name?: string; criterion?: string }).name ?? (c as { criterion?: string }).criterion ?? ""))).filter(Boolean).join("\n")
  }
  const criteria = (rubric as { criteria?: unknown }).criteria
  if (Array.isArray(criteria)) {
    return criteria
      .map((c) => {
        if (typeof c === "string") return c
        const o = c as { name?: string; descriptor?: string }
        return o.descriptor ? `${o.name ?? ""} — ${o.descriptor}` : (o.name ?? "")
      })
      .filter(Boolean)
      .join("\n")
  }
  return ""
}

function textToRubric(text: string): { criteria: { name: string }[] } | null {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean)
  if (lines.length === 0) return null
  return { criteria: lines.map((name) => ({ name })) }
}

interface QuizSettings {
  timeLimit: number | null
  passingScore: number
  allowRetakes: boolean
  randomizeOrder: boolean
  showAnswers: boolean
}

const QUESTION_TYPES: { key: QuestionType; label: string; icon: string }[] = [
  { key: "multiple_choice", label: "Multiple Choice", icon: "A" },
  { key: "true_false", label: "True / False", icon: "T" },
  { key: "short_answer", label: "Short Answer", icon: "?" },
  { key: "passage_id", label: "Passage ID", icon: '"' },
  { key: "vocabulary", label: "Vocabulary", icon: "V" },
  { key: "free_response", label: "Free Response", icon: "¶" },
]

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
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [saved, setSaved] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<string>("draft")
  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([])
  const [assignClassroom, setAssignClassroom] = useState("")
  const [assigning, setAssigning] = useState(false)
  const [launching, setLaunching] = useState(false)

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
        // max_points / hints / …) so a Virgil-generated free-response question
        // survives a load → save round-trip and stays auto-gradable.
        setQuestions(
          questionData.map((q) => ({
            ...q,
            options: q.options as string[] | null,
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

  const addQuestion = useCallback((type: QuestionType) => {
    const newQ: QuizQuestion = {
      id: `new-${Date.now()}`,
      question_type: type,
      question_text: "",
      options: type === "multiple_choice" ? ["", "", "", ""] : type === "true_false" ? ["True", "False"] : null,
      correct_answer: "",
      explanation: "",
      points: 10,
      sort_order: questions.length,
      ...(OPEN_ENDED.has(type) ? { reference_answer: "", rubric: null, max_points: 10 } : {}),
    }
    setQuestions((prev) => [...prev, newQ])
    setExpandedQuestion(newQ.id)
  }, [questions.length])

  const updateQuestion = useCallback((id: string, updates: Partial<QuizQuestion>) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }, [])

  const removeQuestion = useCallback((id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id))
    if (expandedQuestion === id) setExpandedQuestion(null)
  }, [expandedQuestion])

  const moveQuestion = useCallback((index: number, direction: "up" | "down") => {
    setQuestions((prev) => {
      const next = [...prev]
      const swapIdx = direction === "up" ? index - 1 : index + 1
      if (swapIdx < 0 || swapIdx >= next.length) return prev
      ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
      return next.map((q, i) => ({ ...q, sort_order: i }))
    })
  }, [])

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

  const handleAssign = useCallback(async () => {
    if (!assignClassroom) return
    setAssigning(true)
    const points = questions.reduce((sum, q) => sum + q.points, 0)
    const res = await assignQuiz({
      quizId,
      classroomId: assignClassroom,
      points,
    })
    setAssigning(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Assigned to class")
    setAssignClassroom("")
  }, [assignClassroom, quizId, questions])

  const handleLaunchLive = useCallback(async () => {
    if (!assignClassroom) return
    setLaunching(true)
    const res = await launchLiveQuiz({ quizId, classroomId: assignClassroom })
    setLaunching(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    router.push(`/classroom/live/${res.data.sessionId}`)
  }, [assignClassroom, quizId, router])

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
            question_type: g.type as QuestionType,
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

      {/* Questions list */}
      <div className="mt-6 space-y-2">
        {questions.length === 0 && (
          <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
            <Feather className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No questions yet</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Add questions manually or use AI to generate them</p>
          </div>
        )}

        {questions.map((q, i) => {
          const isExpanded = expandedQuestion === q.id
          const typeConfig = QUESTION_TYPES.find((t) => t.key === q.question_type)
          return (
            <motion.div
              key={q.id}
              layout
              className={`rounded-xl border transition-colors ${isExpanded ? "border-[var(--tome-accent)]/30 bg-[var(--tome-accent)]/5" : "bg-card"}`}
            >
              {/* Collapsed header */}
              <div className="flex items-center gap-2 p-3">
                <div className="flex flex-col gap-0.5">
                  <button onClick={() => moveQuestion(i, "up")} disabled={i === 0} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                    <ChevronUp className="size-3" />
                  </button>
                  <button onClick={() => moveQuestion(i, "down")} disabled={i === questions.length - 1} className="text-muted-foreground hover:text-foreground disabled:opacity-20">
                    <ChevronDown className="size-3" />
                  </button>
                </div>
                <button
                  onClick={() => setExpandedQuestion(isExpanded ? null : q.id)}
                  className="flex flex-1 items-center gap-3 text-left"
                >
                  <span className="flex size-6 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                    {typeConfig?.icon ?? "?"}
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {q.question_text || <span className="italic text-muted-foreground">New question...</span>}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{q.points}pts</span>
                </button>
                <Button variant="ghost" size="sm" onClick={() => removeQuestion(q.id)} className="size-7 p-0 text-muted-foreground hover:text-red-500">
                  <Trash2 className="size-3.5" />
                </Button>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  className="border-t px-4 pb-4 pt-3 space-y-3"
                >
                  {/* Question type selector */}
                  <div className="flex gap-1">
                    {QUESTION_TYPES.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          const newOptions = t.key === "multiple_choice" ? (q.options?.length === 4 ? q.options : ["", "", "", ""]) : t.key === "true_false" ? ["True", "False"] : null
                          updateQuestion(q.id, { question_type: t.key, options: newOptions })
                        }}
                        className={`rounded-md px-2 py-1 text-[10px] font-medium transition-colors ${
                          q.question_type === t.key
                            ? "bg-[var(--tome-accent)]/10 text-[var(--tome-accent)]"
                            : "text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Question text */}
                  <textarea
                    value={q.question_text}
                    onChange={(e) => updateQuestion(q.id, { question_text: e.target.value })}
                    placeholder="Enter your question..."
                    rows={2}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />

                  {/* Multiple Choice options */}
                  {q.question_type === "multiple_choice" && q.options && (
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-muted-foreground">Options — click the letter to mark the correct answer</label>
                      {q.options.map((opt, oi) => (
                        <div key={oi} className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuestion(q.id, { correct_answer: opt })}
                            className={`flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                              q.correct_answer === opt && opt !== ""
                                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                : "border-border text-muted-foreground hover:border-foreground/30"
                            }`}
                          >
                            {String.fromCharCode(65 + oi)}
                          </button>
                          <Input
                            value={opt}
                            onChange={(e) => {
                              const newOpts = [...(q.options ?? [])]
                              newOpts[oi] = e.target.value
                              // If this was the correct answer, update it too
                              const updates: Partial<QuizQuestion> = { options: newOpts }
                              if (q.correct_answer === opt) updates.correct_answer = e.target.value
                              updateQuestion(q.id, updates)
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                            className="text-sm"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* True/False */}
                  {q.question_type === "true_false" && (
                    <div className="flex gap-2">
                      {["True", "False"].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateQuestion(q.id, { correct_answer: val })}
                          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium transition-colors ${
                            q.correct_answer === val
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              : "border-border text-muted-foreground hover:border-foreground/30"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Short answer / Passage ID / Vocabulary */}
                  {(q.question_type === "short_answer" || q.question_type === "passage_id" || q.question_type === "vocabulary") && (
                    <>
                      {q.question_type === "vocabulary" && q.options === null && (
                        <Button variant="outline" size="sm" onClick={() => updateQuestion(q.id, { options: ["", "", "", ""] })} className="text-xs">
                          Add multiple choice options
                        </Button>
                      )}
                      {q.options && q.options.length > 0 && (
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-muted-foreground">Options</label>
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuestion(q.id, { correct_answer: opt })}
                                className={`flex size-7 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                                  q.correct_answer === opt && opt !== ""
                                    ? "border-green-500 bg-green-50 text-green-700"
                                    : "border-border text-muted-foreground"
                                }`}
                              >
                                {String.fromCharCode(65 + oi)}
                              </button>
                              <Input
                                value={opt}
                                onChange={(e) => {
                                  const newOpts = [...(q.options ?? [])]
                                  newOpts[oi] = e.target.value
                                  const updates: Partial<QuizQuestion> = { options: newOpts }
                                  if (q.correct_answer === opt) updates.correct_answer = e.target.value
                                  updateQuestion(q.id, updates)
                                }}
                                placeholder={`Option ${String.fromCharCode(65 + oi)}`}
                                className="text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      )}
                      {!q.options && (
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Correct answer</label>
                          <Input
                            value={q.correct_answer}
                            onChange={(e) => updateQuestion(q.id, { correct_answer: e.target.value })}
                            placeholder="Enter the correct answer..."
                            className="mt-1 text-sm"
                          />
                        </div>
                      )}
                    </>
                  )}

                  {/* Free response — Virgil grades against the rubric + reference answer */}
                  {OPEN_ENDED.has(q.question_type) && q.question_type !== "short_answer" && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Reference answer (guides Virgil's grading)</label>
                        <textarea
                          value={q.reference_answer ?? ""}
                          onChange={(e) => updateQuestion(q.id, { reference_answer: e.target.value })}
                          placeholder="A model answer for Virgil to grade against..."
                          rows={3}
                          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Rubric (one criterion per line)</label>
                        <textarea
                          value={rubricToText(q.rubric)}
                          onChange={(e) => updateQuestion(q.id, { rubric: textToRubric(e.target.value) })}
                          placeholder={"Identifies the central theme\nCites textual evidence\nExplains significance"}
                          rows={3}
                          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div>
                    <label className="text-xs font-medium text-muted-foreground">Explanation (shown after answering)</label>
                    <Input
                      value={q.explanation}
                      onChange={(e) => updateQuestion(q.id, { explanation: e.target.value })}
                      placeholder="Why is this the correct answer?"
                      className="mt-1 text-sm"
                    />
                  </div>

                  {/* Points */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-muted-foreground">Points:</label>
                    <Input
                      type="number"
                      min={1}
                      value={q.points}
                      onChange={(e) => updateQuestion(q.id, { points: Number(e.target.value) })}
                      className="w-16 text-sm"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )
        })}
      </div>

      {/* Add question row */}
      <div className="mt-4 flex flex-wrap gap-2">
        {QUESTION_TYPES.map((t) => (
          <Button
            key={t.key}
            variant="outline"
            size="sm"
            onClick={() => addQuestion(t.key)}
            className="gap-1.5 text-xs"
          >
            <Plus className="size-3" />
            {t.label}
          </Button>
        ))}
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
            {saved ? <Check className="size-3.5 text-green-500" /> : <Save className="size-3.5" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Draft"}
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
              <div className="flex gap-2">
                <select
                  value={assignClassroom}
                  onChange={(e) => setAssignClassroom(e.target.value)}
                  className="flex-1 rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Choose a class…</option>
                  {classrooms.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Button onClick={handleAssign} disabled={!assignClassroom || assigning} className="gap-1.5">
                  <Send className="size-3.5" />
                  {assigning ? "Assigning…" : "Assign"}
                </Button>
              </div>
            )}
            {classrooms.length > 0 && (
              <div className="border-t pt-3">
                <p className="text-xs text-muted-foreground">
                  Or run it live — students race to answer on a shared big screen.
                </p>
                <Button
                  onClick={handleLaunchLive}
                  disabled={!assignClassroom || launching}
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
