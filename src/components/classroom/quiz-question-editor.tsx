"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Plus, Trash2, ChevronDown, ChevronUp, Feather,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Kept as a broad string so Virgil-authored types (multiple_select,
// vocabulary_in_context, tf_with_reason, fill_blank, free_response, …) round-trip
// through the editor even though the manual "add" buttons only cover a few.
export type QuestionType = string

export interface QuizQuestion {
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

export const OPEN_ENDED = new Set(["free_response", "tf_with_reason", "short_answer"])

export const QUESTION_TYPES: { key: QuestionType; label: string; icon: string }[] = [
  { key: "multiple_choice", label: "Multiple Choice", icon: "A" },
  { key: "true_false", label: "True / False", icon: "T" },
  { key: "short_answer", label: "Short Answer", icon: "?" },
  { key: "passage_id", label: "Passage ID", icon: '"' },
  { key: "vocabulary", label: "Vocabulary", icon: "V" },
  { key: "free_response", label: "Free Response", icon: "¶" },
]

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

/** A blank question of the given type, ready to append to a quiz. */
export function blankQuestion(type: QuestionType, sortOrder: number): QuizQuestion {
  return {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    question_type: type,
    question_text: "",
    options: type === "multiple_choice" ? ["", "", "", ""] : type === "true_false" ? ["True", "False"] : null,
    correct_answer: "",
    explanation: "",
    points: 10,
    sort_order: sortOrder,
    ...(OPEN_ENDED.has(type) ? { reference_answer: "", rubric: null, max_points: 10 } : {}),
  }
}

/**
 * The shared teacher quiz question authoring surface: add / edit / reorder /
 * delete question cards across MC, T/F, short-answer, passage-ID, vocabulary,
 * and free-response (rubric + reference answer). A controlled component —
 * `questions` in, `onChange` out — reused by the standalone quiz builder and
 * the inline quiz authoring in the assignment create flow.
 */
export function QuizQuestionEditor({
  questions,
  onChange,
}: {
  questions: QuizQuestion[]
  onChange: (next: QuizQuestion[]) => void
}) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null)

  const addQuestion = (type: QuestionType) => {
    const newQ = blankQuestion(type, questions.length)
    onChange([...questions, newQ])
    setExpandedQuestion(newQ.id)
  }

  const updateQuestion = (id: string, updates: Partial<QuizQuestion>) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const removeQuestion = (id: string) => {
    onChange(questions.filter((q) => q.id !== id))
    if (expandedQuestion === id) setExpandedQuestion(null)
  }

  const moveQuestion = (index: number, direction: "up" | "down") => {
    const next = [...questions]
    const swapIdx = direction === "up" ? index - 1 : index + 1
    if (swapIdx < 0 || swapIdx >= next.length) return
    ;[next[index], next[swapIdx]] = [next[swapIdx], next[index]]
    onChange(next.map((q, i) => ({ ...q, sort_order: i })))
  }

  return (
    <>
      {/* Questions list */}
      <div className="space-y-2">
        {questions.length === 0 && (
          <div className="rounded-xl border border-dashed bg-muted/30 p-8 text-center">
            <Feather className="mx-auto size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">No questions yet</p>
            <p className="mt-1 text-xs text-muted-foreground/60">Add questions with the buttons below</p>
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
    </>
  )
}
