"use client"

import { useCallback, useMemo, useState } from "react"
import {
  Sparkles,
  Wand2,
  RefreshCw,
  Trash2,
  Plus,
  ChevronUp,
  ChevronDown,
  Loader2,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  OBJECTIVE_QUESTION_TYPES,
  QUESTION_TYPE_LABELS,
  TEACHER_QUIZ_DIFFICULTIES,
  MAX_QUIZ_QUESTIONS,
  isObjectiveType,
  type ObjectiveQuestionType,
  type TeacherQuizDifficulty,
  type TeacherQuizDraftQuestion,
  type TeacherQuizQuestionType,
} from "@/lib/teacher-quiz-types"

// Editable question — server draft shape, mutated locally before publish.
type EditableQuestion = Omit<TeacherQuizDraftQuestion, "quiz_id" | "sort_order"> & {
  quiz_id?: string
}

interface Props {
  bookId: string | null
  bookTitle?: string
  /** Already-generated quiz attached to this station (edit mode). */
  initialQuizId?: string | null
  onQuizReady: (quizId: string, summary: string) => void
  onClear: () => void
}

type Phase = "config" | "generating" | "review"

// Iridescent treatment is reserved for Virgil affordances only.
const IRIDESCENT =
  "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)"

export function VirgilQuizPanel({ bookId, bookTitle, initialQuizId, onQuizReady, onClear }: Props) {
  const [phase, setPhase] = useState<Phase>(initialQuizId ? "review" : "config")
  const [error, setError] = useState<string | null>(null)
  const [draftQuizId, setDraftQuizId] = useState<string | null>(initialQuizId ?? null)
  const [questions, setQuestions] = useState<EditableQuestion[]>([])
  const [saving, setSaving] = useState(false)
  const [regenIndex, setRegenIndex] = useState<number | null>(null)

  // ── Config form ──
  const [mix, setMix] = useState<Record<TeacherQuizDifficulty, number>>({
    apprentice: 3,
    scholar: 2,
    master: 1,
  })
  const [types, setTypes] = useState<Set<ObjectiveQuestionType>>(
    new Set<ObjectiveQuestionType>(["multiple_choice", "true_false"]),
  )
  const [focus, setFocus] = useState("")
  const [chapterStart, setChapterStart] = useState<number | "">("")
  const [chapterEnd, setChapterEnd] = useState<number | "">("")

  const totalCount = mix.apprentice + mix.scholar + mix.master

  const scope = useMemo(() => {
    if (chapterStart !== "" && chapterEnd !== "" && chapterEnd >= chapterStart) {
      const idxs: number[] = []
      for (let i = Number(chapterStart); i <= Number(chapterEnd); i++) idxs.push(i)
      return { chapterIndexes: idxs }
    }
    return {}
  }, [chapterStart, chapterEnd])

  const buildRequest = useCallback(
    (single?: { type: TeacherQuizQuestionType; difficulty: TeacherQuizDifficulty; instruction?: string }) => ({
      bookId,
      scope,
      difficultyMix: mix,
      types: Array.from(types),
      totalCount: Math.max(1, Math.min(MAX_QUIZ_QUESTIONS, totalCount)),
      focus: focus.trim() || undefined,
      single,
    }),
    [bookId, scope, mix, types, totalCount, focus],
  )

  const handleGenerate = useCallback(async () => {
    if (!bookId) {
      setError("Select a book for this station first.")
      return
    }
    if (totalCount < 1) {
      setError("Set at least one question in the difficulty mix.")
      return
    }
    if (types.size === 0) {
      setError("Choose at least one question type.")
      return
    }
    setError(null)
    setPhase("generating")
    try {
      const res = await fetch("/api/guided-sessions/quiz/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildRequest()),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || data.error || "Generation failed")
        setPhase("config")
        return
      }
      setDraftQuizId(data.draft.id)
      setQuestions(data.draft.questions as EditableQuestion[])
      setPhase("review")
    } catch {
      setError("Network error during generation.")
      setPhase("config")
    }
  }, [bookId, totalCount, types, buildRequest])

  const handleRegenerateOne = useCallback(
    async (index: number) => {
      if (!bookId) return
      const q = questions[index]
      setRegenIndex(index)
      try {
        const res = await fetch("/api/guided-sessions/quiz/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            buildRequest({
              type: q.question_type,
              difficulty: (q.difficulty ?? "scholar") as TeacherQuizDifficulty,
            }),
          ),
        })
        const data = await res.json()
        if (res.ok && data.question) {
          const gen = data.question
          setQuestions((prev) =>
            prev.map((item, i) =>
              i === index
                ? {
                    ...item,
                    question_text: gen.prompt,
                    options: gen.options ?? null,
                    correct_answer: gen.correct_answer ?? null,
                    explanation: gen.explanation ?? null,
                    category: gen.category ?? item.category,
                    rubric: gen.rubric ?? null,
                    reference_answer: gen.reference_answer ?? null,
                    source_anchor: gen.source_anchor ?? null,
                    hints: gen.hints ?? item.hints ?? null,
                    distractor_eliminations:
                      gen.distractor_eliminations ?? item.distractor_eliminations ?? null,
                  }
                : item,
            ),
          )
        }
      } finally {
        setRegenIndex(null)
      }
    },
    [bookId, questions, buildRequest],
  )

  const patchQuestion = (index: number, patch: Partial<EditableQuestion>) =>
    setQuestions((prev) => prev.map((q, i) => (i === index ? { ...q, ...patch } : q)))

  const move = (index: number, dir: -1 | 1) =>
    setQuestions((prev) => {
      const next = [...prev]
      const j = index + dir
      if (j < 0 || j >= next.length) return prev
      ;[next[index], next[j]] = [next[j], next[index]]
      return next
    })

  const removeQuestion = (index: number) =>
    setQuestions((prev) => prev.filter((_, i) => i !== index))

  const addBlank = () =>
    setQuestions((prev) => [
      ...prev,
      {
        id: `new-${crypto.randomUUID()}`,
        question_type: "multiple_choice",
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
        explanation: "",
        difficulty: "scholar",
        category: "factual",
        points: 1,
        max_points: 1,
        rubric: null,
        reference_answer: null,
        source_anchor: null,
        hints: null,
        distractor_eliminations: null,
      },
    ])

  const handleSave = useCallback(async () => {
    if (!draftQuizId) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/guided-sessions/quiz/${draftQuizId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "published",
          questions: questions.map((q) => ({
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
            hints: q.hints,
            distractor_eliminations: q.distractor_eliminations,
          })),
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || data.error || "Failed to save quiz")
        return
      }
      const dominant = (Object.entries(mix) as [TeacherQuizDifficulty, number][])
        .sort((a, b) => b[1] - a[1])[0]?.[0]
      onQuizReady(draftQuizId, `${questions.length} questions · ${dominant ?? "scholar"}`)
    } catch {
      setError("Network error while saving.")
    } finally {
      setSaving(false)
    }
  }, [draftQuizId, questions, mix, onQuizReady])

  // ── Iridescent header (Virgil signature) ──
  const header = (
    <div
      className="flex items-center gap-2 rounded-t-xl px-3 py-2 text-white"
      style={{ backgroundImage: IRIDESCENT }}
    >
      <Sparkles className="h-4 w-4" />
      <span className="text-xs font-semibold tracking-wide">Generate a quiz with Virgil</span>
    </div>
  )

  if (phase === "config" || phase === "generating") {
    const generating = phase === "generating"
    return (
      <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(99,102,241,0.35)" }}>
        {header}
        <div className="space-y-4 p-3">
          {/* Difficulty mix */}
          <div>
            <label className="text-xs font-semibold">Difficulty mix</label>
            <div className="mt-1.5 grid grid-cols-3 gap-2">
              {TEACHER_QUIZ_DIFFICULTIES.map((d) => (
                <div key={d} className="rounded-lg border p-2 text-center" style={{ borderColor: "rgba(128,128,128,0.15)" }}>
                  <p className="text-[10px] font-semibold capitalize opacity-60">{d}</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setMix((m) => ({ ...m, [d]: Math.max(0, m[d] - 1) }))}
                      className="h-5 w-5 rounded-full border text-xs leading-none"
                      aria-label={`Fewer ${d} questions`}
                    >
                      −
                    </button>
                    <span className="w-4 text-sm font-bold tabular-nums">{mix[d]}</span>
                    <button
                      type="button"
                      onClick={() => setMix((m) => ({ ...m, [d]: Math.min(20, m[d] + 1) }))}
                      className="h-5 w-5 rounded-full border text-xs leading-none"
                      aria-label={`More ${d} questions`}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-1 text-[11px] opacity-50">{totalCount} questions total</p>
          </div>

          {/* Question types (objective in this release) */}
          <div>
            <label className="text-xs font-semibold">Question types</label>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {OBJECTIVE_QUESTION_TYPES.map((t) => {
                const on = types.has(t)
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() =>
                      setTypes((prev) => {
                        const next = new Set(prev)
                        if (next.has(t)) next.delete(t)
                        else next.add(t)
                        return next
                      })
                    }
                    className="rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors"
                    style={{
                      borderColor: on ? "var(--tome-indigo, #6366F1)" : "rgba(128,128,128,0.2)",
                      backgroundColor: on ? "rgba(99,102,241,0.08)" : "transparent",
                    }}
                  >
                    {QUESTION_TYPE_LABELS[t]}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Chapter scope */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold">From chapter</label>
              <Input
                type="number"
                min={0}
                value={chapterStart}
                onChange={(e) => setChapterStart(e.target.value === "" ? "" : parseInt(e.target.value))}
                placeholder="all"
                className="text-sm"
              />
            </div>
            <div className="flex-1 space-y-1">
              <label className="text-xs font-semibold">To chapter</label>
              <Input
                type="number"
                min={0}
                value={chapterEnd}
                onChange={(e) => setChapterEnd(e.target.value === "" ? "" : parseInt(e.target.value))}
                placeholder="all"
                className="text-sm"
              />
            </div>
          </div>

          {/* Focus */}
          <div className="space-y-1">
            <label className="text-xs font-semibold">
              Focus <span className="font-normal opacity-40">(optional)</span>
            </label>
            <Input
              value={focus}
              onChange={(e) => setFocus(e.target.value)}
              placeholder="e.g. theme of fate, Odysseus's cunning"
              className="text-sm"
            />
          </div>

          {error && <p className="text-xs font-medium text-red-500">{error}</p>}

          <Button
            onClick={handleGenerate}
            disabled={generating || !bookId}
            className="w-full gap-2 text-white"
            style={{ backgroundImage: IRIDESCENT }}
          >
            {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {generating ? "Virgil is reading…" : `Generate ${totalCount} questions`}
          </Button>
          {!bookId && <p className="text-[11px] opacity-50">Select a book above to enable generation.</p>}
        </div>
      </div>
    )
  }

  // ── Review phase ──
  return (
    <div className="overflow-hidden rounded-xl border" style={{ borderColor: "rgba(99,102,241,0.35)" }}>
      {header}
      <div className="space-y-3 p-3">
        <div className="flex items-center justify-between">
          <p className="text-xs opacity-60">
            {questions.length} draft question{questions.length === 1 ? "" : "s"} — review and edit
          </p>
          <button
            type="button"
            onClick={() => {
              setPhase("config")
              setDraftQuizId(null)
              setQuestions([])
              onClear()
            }}
            className="text-[11px] underline opacity-60 hover:opacity-100"
          >
            Start over
          </button>
        </div>

        <div className="space-y-2.5">
          {questions.map((q, i) => (
            <QuestionCard
              key={q.id}
              q={q}
              index={i}
              total={questions.length}
              regenerating={regenIndex === i}
              onPatch={(patch) => patchQuestion(i, patch)}
              onRegenerate={() => handleRegenerateOne(i)}
              onRemove={() => removeQuestion(i)}
              onMove={(dir) => move(i, dir)}
              bookTitle={bookTitle}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={addBlank}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed py-2 text-xs opacity-60 hover:opacity-100"
          style={{ borderColor: "rgba(128,128,128,0.3)" }}
        >
          <Plus className="h-3.5 w-3.5" /> Add a question
        </button>

        {error && <p className="text-xs font-medium text-red-500">{error}</p>}

        <Button
          onClick={handleSave}
          disabled={saving || questions.length === 0}
          className="w-full gap-2 text-white"
          style={{ backgroundImage: IRIDESCENT }}
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
          Attach quiz to station
        </Button>
      </div>
    </div>
  )
}

// ── Single editable question card ─────────────────────────────────────────────

function QuestionCard({
  q,
  index,
  total,
  regenerating,
  onPatch,
  onRegenerate,
  onRemove,
  onMove,
}: {
  q: EditableQuestion
  index: number
  total: number
  regenerating: boolean
  onPatch: (patch: Partial<EditableQuestion>) => void
  onRegenerate: () => void
  onRemove: () => void
  onMove: (dir: -1 | 1) => void
  bookTitle?: string
}) {
  const objective = isObjectiveType(q.question_type)
  return (
    <div className="rounded-lg border p-2.5" style={{ borderColor: "rgba(128,128,128,0.15)" }}>
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[10px] font-bold opacity-40">#{index + 1}</span>
        <span className="rounded-full px-1.5 py-0.5 text-[10px] font-medium" style={{ backgroundColor: "rgba(99,102,241,0.08)", color: "var(--tome-indigo,#6366F1)" }}>
          {QUESTION_TYPE_LABELS[q.question_type]}
        </span>
        {q.difficulty && <span className="text-[10px] capitalize opacity-40">{q.difficulty}</span>}
        <div className="ml-auto flex items-center gap-0.5">
          <button type="button" onClick={() => onMove(-1)} disabled={index === 0} className="rounded p-1 opacity-50 hover:opacity-100 disabled:opacity-20" aria-label="Move up">
            <ChevronUp className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={() => onMove(1)} disabled={index === total - 1} className="rounded p-1 opacity-50 hover:opacity-100 disabled:opacity-20" aria-label="Move down">
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
          <button type="button" onClick={onRegenerate} disabled={regenerating} className="rounded p-1 opacity-50 hover:opacity-100" aria-label="Regenerate question">
            {regenerating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
          </button>
          <button type="button" onClick={onRemove} className="rounded p-1 text-red-400 opacity-60 hover:opacity-100" aria-label="Delete question">
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <textarea
        value={q.question_text}
        onChange={(e) => onPatch({ question_text: e.target.value })}
        rows={2}
        className="w-full resize-none rounded-md border border-transparent bg-[var(--tome-surface-elevated)] px-2 py-1.5 text-sm focus:border-[var(--tome-accent)] focus:outline-none"
        placeholder="Question prompt"
      />

      {/* Objective answer editing */}
      {objective && q.question_type === "true_false" && (
        <div className="mt-1.5 flex gap-2">
          {["true", "false"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => onPatch({ correct_answer: v })}
              className="flex-1 rounded-md border py-1 text-xs font-medium capitalize"
              style={{
                borderColor: q.correct_answer?.toLowerCase() === v ? "var(--tome-success,#2D9A47)" : "rgba(128,128,128,0.2)",
                backgroundColor: q.correct_answer?.toLowerCase() === v ? "rgba(45,154,71,0.08)" : "transparent",
              }}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {objective && (q.question_type === "multiple_choice" || q.question_type === "multiple_select" || q.question_type === "vocabulary_in_context") && (
        <div className="mt-1.5 space-y-1">
          {(q.options ?? []).map((opt, oi) => {
            const correctSet = new Set((q.correct_answer ?? "").split(",").map((s) => s.trim()))
            const isCorrect = correctSet.has(opt)
            return (
              <div key={oi} className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (q.question_type === "multiple_select") {
                      const next = new Set(correctSet)
                      if (next.has(opt)) next.delete(opt)
                      else next.add(opt)
                      onPatch({ correct_answer: Array.from(next).join(", ") })
                    } else {
                      onPatch({ correct_answer: opt })
                    }
                  }}
                  className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border"
                  style={{ borderColor: isCorrect ? "var(--tome-success,#2D9A47)" : "rgba(128,128,128,0.4)", backgroundColor: isCorrect ? "var(--tome-success,#2D9A47)" : "transparent" }}
                  aria-label="Mark correct"
                >
                  {isCorrect && <Check className="h-2.5 w-2.5 text-white" />}
                </button>
                <input
                  value={opt}
                  onChange={(e) => {
                    const wasCorrect = isCorrect
                    const newOpts = (q.options ?? []).map((o, k) => (k === oi ? e.target.value : o))
                    const patch: Partial<EditableQuestion> = { options: newOpts }
                    if (wasCorrect && q.question_type !== "multiple_select") patch.correct_answer = e.target.value
                    onPatch(patch)
                  }}
                  className="h-7 flex-1 rounded-md border border-transparent bg-[var(--tome-surface-elevated)] px-2 text-xs focus:border-[var(--tome-accent)] focus:outline-none"
                />
              </div>
            )
          })}
        </div>
      )}

      {objective && q.question_type === "fill_blank" && (
        <Input
          value={q.correct_answer ?? ""}
          onChange={(e) => onPatch({ correct_answer: e.target.value })}
          placeholder="Correct answer"
          className="mt-1.5 text-xs"
        />
      )}

      <textarea
        value={q.explanation ?? ""}
        onChange={(e) => onPatch({ explanation: e.target.value })}
        rows={2}
        className="mt-1.5 w-full resize-none rounded-md border border-transparent bg-[var(--tome-surface-elevated)] px-2 py-1.5 text-[11px] opacity-80 focus:border-[var(--tome-accent)] focus:outline-none"
        placeholder="Explanation (why the answer is correct)"
      />
      {q.source_anchor?.quote && (
        <p className="mt-1 text-[10px] italic opacity-40">
          ⟶ ch.{q.source_anchor.chapter_index}: “{q.source_anchor.quote}”
        </p>
      )}
    </div>
  )
}
