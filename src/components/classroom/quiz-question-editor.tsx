"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Plus, Trash2, ChevronDown, ChevronUp, Feather, GripVertical, X,
} from "lucide-react"
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { QUESTION_TYPE_LABELS, ALL_QUESTION_TYPES } from "@/lib/teacher-quiz-types"

// Kept as a broad string so any stored type (including legacy rows) round-trips
// through the editor; the add buttons cover the 16 canonical types.
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
  // Per-type payload (items/correctOrder, matching pairs, passage, tfReasons,
  // acceptedAnswers/acceptedVariants, …) — grader + attempt renderer read this.
  meta?: Record<string, unknown> | null
  // Passthrough metadata — Tome Assistant-generated open questions carry a
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

/** Types graded by teacher/Tome Assistant review (short_answer is objective when keyed). */
export const OPEN_ENDED = new Set(["free_response", "reflection"])

/** Types that render + grade against a single-correct option list. */
const OPTION_TYPES = new Set([
  "multiple_choice",
  "vocabulary_in_context",
  "passage_id",
  "close_reading",
  "theme_analysis",
  "cross_reference",
  "identification",
])

/** Types whose editor shows a source-passage block. */
const PASSAGE_TYPES = new Set(["passage_id", "close_reading"])

const TYPE_ICONS: Record<string, string> = {
  multiple_choice: "A",
  multiple_select: "☑",
  true_false: "T",
  tf_with_reason: "T?",
  fill_blank: "_",
  short_answer: "?",
  vocabulary_in_context: "V",
  passage_id: '"',
  matching: "⇄",
  ordering: "↕",
  close_reading: "¶",
  theme_analysis: "Θ",
  cross_reference: "⧉",
  identification: "ID",
  reflection: "✍",
  free_response: "¶¶",
}

export const QUESTION_TYPES: { key: QuestionType; label: string; icon: string }[] =
  ALL_QUESTION_TYPES.map((key) => ({
    key,
    label: QUESTION_TYPE_LABELS[key],
    icon: TYPE_ICONS[key] ?? "?",
  }))

// ── meta helpers ─────────────────────────────────────────────────────────────

function metaOf(q: QuizQuestion): Record<string, unknown> {
  return (q.meta && typeof q.meta === "object" ? q.meta : {}) as Record<string, unknown>
}

function metaStrings(q: QuizQuestion, key: string): string[] {
  const v = metaOf(q)[key]
  return Array.isArray(v) ? v.map((x) => String(x)) : []
}

function metaStr(q: QuizQuestion, key: string): string {
  const v = metaOf(q)[key]
  return typeof v === "string" ? v : ""
}

/** Merge a patch into q.meta; `undefined` values delete the key. */
function patchMeta(
  q: QuizQuestion,
  patch: Record<string, unknown>,
): Record<string, unknown> | null {
  const next: Record<string, unknown> = { ...metaOf(q) }
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined) delete next[k]
    else next[k] = v
  }
  return Object.keys(next).length > 0 ? next : null
}

// Rubric <-> textarea. Tome Assistant authors rubric as
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
  const base: QuizQuestion = {
    id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    question_type: type,
    question_text: "",
    options: null,
    correct_answer: "",
    explanation: "",
    points: 10,
    sort_order: sortOrder,
    meta: null,
  }
  return { ...base, ...seedForType(type) }
}

/** Type-appropriate seed state applied when adding or switching type. */
function seedForType(type: QuestionType): Partial<QuizQuestion> {
  if (OPTION_TYPES.has(type) || type === "multiple_select") {
    return { options: ["", "", "", ""], correct_answer: "", meta: null }
  }
  switch (type) {
    case "true_false":
      return { options: ["true", "false"], correct_answer: "", meta: null }
    case "tf_with_reason":
      return { options: ["true", "false"], correct_answer: "", meta: { tfReasons: ["", "", ""] } }
    case "ordering": {
      const items = ["", "", "", ""]
      return { options: items, correct_answer: "", meta: { items, correctOrder: items } }
    }
    case "matching":
      return {
        options: null,
        correct_answer: "",
        meta: { matchingLeft: ["", "", ""], matchingRight: ["", "", ""], correctPairs: {} },
      }
    case "reflection":
    case "free_response":
      return { options: null, correct_answer: "", meta: null, reference_answer: "", rubric: null, max_points: 10 }
    default:
      // fill_blank, short_answer — free-text keyed types.
      return { options: null, correct_answer: "", meta: null }
  }
}

// ── Sortable list (ordering editor) ─────────────────────────────────────────

function SortableRow({
  id,
  value,
  index,
  onEdit,
  onRemove,
  canRemove,
}: {
  id: string
  value: string
  index: number
  onEdit: (v: string) => void
  onRemove: () => void
  canRemove: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-2 rounded-md border bg-background p-1.5 ${isDragging ? "opacity-60" : ""}`}
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>
      <span className="w-4 text-center text-xs font-semibold text-muted-foreground">{index + 1}</span>
      <Input value={value} onChange={(e) => onEdit(e.target.value)} placeholder={`Step ${index + 1}`} className="h-8 text-sm" />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="text-muted-foreground hover:text-red-500 disabled:opacity-20"
        aria-label="Remove item"
      >
        <X className="size-3.5" />
      </button>
    </div>
  )
}

function OrderingEditor({
  q,
  update,
}: {
  q: QuizQuestion
  update: (updates: Partial<QuizQuestion>) => void
}) {
  const items = metaStrings(q, "items")
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )
  // Stable per-position ids for dnd (values may repeat while blank).
  const ids = items.map((_, i) => `item-${i}`)

  const commit = (next: string[]) => {
    update({
      options: next,
      correct_answer: JSON.stringify(next),
      meta: patchMeta(q, { items: next, correctOrder: next }),
    })
  }

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e
    if (!over || active.id === over.id) return
    commit(arrayMove(items, ids.indexOf(String(active.id)), ids.indexOf(String(over.id))))
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Items in the CORRECT order — students see them shuffled
      </label>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-1.5">
            {items.map((item, i) => (
              <SortableRow
                key={ids[i]}
                id={ids[i]}
                value={item}
                index={i}
                canRemove={items.length > 4}
                onEdit={(v) => commit(items.map((x, xi) => (xi === i ? v : x)))}
                onRemove={() => commit(items.filter((_, xi) => xi !== i))}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      {items.length < 6 && (
        <Button variant="outline" size="sm" onClick={() => commit([...items, ""])} className="gap-1 text-xs">
          <Plus className="size-3" /> Add item
        </Button>
      )}
    </div>
  )
}

// ── Matching editor ─────────────────────────────────────────────────────────

function MatchingEditor({
  q,
  update,
}: {
  q: QuizQuestion
  update: (updates: Partial<QuizQuestion>) => void
}) {
  const left = metaStrings(q, "matchingLeft")
  const right = metaStrings(q, "matchingRight")
  const pairs = (metaOf(q).correctPairs ?? {}) as Record<string, string>

  const commit = (nextLeft: string[], nextRight: string[], nextPairs: Record<string, string>) => {
    // Drop pairs whose sides no longer exist.
    const pruned: Record<string, string> = {}
    for (const [l, r] of Object.entries(nextPairs)) {
      if (nextLeft.includes(l) && nextRight.includes(r)) pruned[l] = r
    }
    update({
      correct_answer: JSON.stringify(pruned),
      meta: patchMeta(q, { matchingLeft: nextLeft, matchingRight: nextRight, correctPairs: pruned }),
    })
  }

  const editSide = (side: "left" | "right", i: number, v: string) => {
    const prev = side === "left" ? left[i] : right[i]
    const nextLeft = side === "left" ? left.map((x, xi) => (xi === i ? v : x)) : left
    const nextRight = side === "right" ? right.map((x, xi) => (xi === i ? v : x)) : right
    // Rename inside pairs so an in-progress mapping survives typing.
    const nextPairs: Record<string, string> = {}
    for (const [l, r] of Object.entries(pairs)) {
      const nl = side === "left" && l === prev ? v : l
      const nr = side === "right" && r === prev ? v : r
      nextPairs[nl] = nr
    }
    commit(nextLeft, nextRight, nextPairs)
  }

  const addRow = () => commit([...left, ""], [...right, ""], pairs)
  const removeRow = (i: number) =>
    commit(left.filter((_, xi) => xi !== i), right.filter((_, xi) => xi !== i), pairs)

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        Matching pairs — pick each left item&apos;s correct right-column match
      </label>
      <div className="space-y-1.5">
        {left.map((l, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              value={l}
              onChange={(e) => editSide("left", i, e.target.value)}
              placeholder={`Left ${i + 1}`}
              className="h-8 flex-1 text-sm"
            />
            <Input
              value={right[i] ?? ""}
              onChange={(e) => editSide("right", i, e.target.value)}
              placeholder={`Right ${i + 1}`}
              className="h-8 flex-1 text-sm"
            />
            <select
              value={pairs[l] ?? ""}
              onChange={(e) => commit(left, right, { ...pairs, [l]: e.target.value })}
              disabled={!l}
              className="h-8 w-32 rounded-md border bg-background px-1.5 text-xs"
              aria-label={`Correct match for ${l || `left ${i + 1}`}`}
            >
              <option value="">match…</option>
              {right.filter(Boolean).map((r, ri) => (
                <option key={ri} value={r}>{r}</option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => removeRow(i)}
              disabled={left.length <= 3}
              className="text-muted-foreground hover:text-red-500 disabled:opacity-20"
              aria-label="Remove pair"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
      </div>
      {left.length < 5 && (
        <Button variant="outline" size="sm" onClick={addRow} className="gap-1 text-xs">
          <Plus className="size-3" /> Add pair
        </Button>
      )}
    </div>
  )
}

// ── Option-list editor (single or multi correct) ────────────────────────────

function OptionsEditor({
  q,
  update,
  multi,
}: {
  q: QuizQuestion
  update: (updates: Partial<QuizQuestion>) => void
  multi: boolean
}) {
  const options = q.options ?? []
  const selected = multi
    ? q.correct_answer.split(",").map((s) => s.trim()).filter(Boolean)
    : [q.correct_answer]

  const setOptions = (newOpts: string[], renamedFrom?: string, renamedTo?: string) => {
    let nextCorrect = q.correct_answer
    if (renamedFrom !== undefined && renamedTo !== undefined) {
      if (multi) {
        nextCorrect = selected.map((s) => (s === renamedFrom ? renamedTo : s)).filter(Boolean).join(", ")
      } else if (q.correct_answer === renamedFrom) {
        nextCorrect = renamedTo
      }
    }
    update({ options: newOpts, correct_answer: nextCorrect })
  }

  const toggle = (opt: string) => {
    if (!opt) return
    if (!multi) {
      update({ correct_answer: opt })
      return
    }
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]
    // Keep option order in the joined key so it matches the generator format.
    update({ correct_answer: options.filter((o) => next.includes(o)).join(", ") })
  }

  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-muted-foreground">
        {multi
          ? "Options — check every correct answer (2+)"
          : "Options — click the letter to mark the correct answer"}
      </label>
      {options.map((opt, oi) => {
        const isCorrect = opt !== "" && selected.includes(opt)
        return (
          <div key={oi} className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggle(opt)}
              className={`flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors ${
                isCorrect
                  ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              }`}
              aria-pressed={isCorrect}
            >
              {multi ? (isCorrect ? "✓" : "") || String.fromCharCode(65 + oi) : String.fromCharCode(65 + oi)}
            </button>
            <Input
              value={opt}
              onChange={(e) => {
                const newOpts = [...options]
                newOpts[oi] = e.target.value
                setOptions(newOpts, opt, e.target.value)
              }}
              placeholder={`Option ${String.fromCharCode(65 + oi)}`}
              className="text-sm"
            />
            <button
              type="button"
              onClick={() => setOptions(options.filter((_, xi) => xi !== oi), opt, "")}
              disabled={options.length <= (multi ? 4 : 3)}
              className="text-muted-foreground hover:text-red-500 disabled:opacity-20"
              aria-label="Remove option"
            >
              <X className="size-3.5" />
            </button>
          </div>
        )
      })}
      {options.length < 6 && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOptions([...options, ""])}
          className="gap-1 text-xs"
        >
          <Plus className="size-3" /> Add option
        </Button>
      )}
    </div>
  )
}

// ── tf_with_reason editor ───────────────────────────────────────────────────

function TfWithReasonEditor({
  q,
  update,
}: {
  q: QuizQuestion
  update: (updates: Partial<QuizQuestion>) => void
}) {
  const reasons = metaStrings(q, "tfReasons")
  const m = /^(true|false)\|(\d+)$/i.exec(q.correct_answer)
  const bool = m ? m[1].toLowerCase() : ""
  const reasonIdx = m ? Number(m[2]) : -1

  const setKey = (nextBool: string, nextIdx: number) => {
    update({
      correct_answer: nextBool && nextIdx >= 0 ? `${nextBool}|${nextIdx}` : nextBool ? `${nextBool}|0` : "",
    })
  }

  const commitReasons = (next: string[]) => {
    update({
      meta: patchMeta(q, { tfReasons: next }),
      correct_answer: reasonIdx >= next.length && bool ? `${bool}|0` : q.correct_answer,
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {["true", "false"].map((val) => (
          <button
            key={val}
            type="button"
            onClick={() => setKey(val, Math.max(0, reasonIdx))}
            className={`flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors ${
              bool === val
                ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                : "border-border text-muted-foreground hover:border-foreground/30"
            }`}
          >
            {val}
          </button>
        ))}
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Reasons (3–4) — select the one that justifies the answer
        </label>
        {reasons.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              type="radio"
              name={`tf-reason-${q.id}`}
              checked={reasonIdx === i}
              onChange={() => setKey(bool || "true", i)}
              className="size-4"
              aria-label={`Mark reason ${i + 1} correct`}
            />
            <Input
              value={r}
              onChange={(e) => commitReasons(reasons.map((x, xi) => (xi === i ? e.target.value : x)))}
              placeholder={`Reason ${i + 1}`}
              className="h-8 text-sm"
            />
            <button
              type="button"
              onClick={() => commitReasons(reasons.filter((_, xi) => xi !== i))}
              disabled={reasons.length <= 3}
              className="text-muted-foreground hover:text-red-500 disabled:opacity-20"
              aria-label="Remove reason"
            >
              <X className="size-3.5" />
            </button>
          </div>
        ))}
        {reasons.length < 4 && (
          <Button variant="outline" size="sm" onClick={() => commitReasons([...reasons, ""])} className="gap-1 text-xs">
            <Plus className="size-3" /> Add reason
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * The shared teacher quiz question authoring surface: add / edit / reorder /
 * delete question cards across all 16 canonical question types, each writing
 * its per-type payload into `meta` (the same keys the renderer adapter and the
 * server grader read). A controlled component — `questions` in, `onChange`
 * out — reused by the standalone quiz builder and the inline quiz authoring
 * in the assignment create flow.
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
                  <span className="flex size-6 shrink-0 items-center justify-center rounded bg-muted text-[10px] font-bold text-muted-foreground">
                    {typeConfig?.icon ?? "?"}
                  </span>
                  <span className="flex-1 text-sm truncate">
                    {q.question_text || <span className="italic text-muted-foreground">New {typeConfig?.label.toLowerCase() ?? "question"}...</span>}
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
                  <div className="flex flex-wrap gap-1">
                    {QUESTION_TYPES.map((t) => (
                      <button
                        key={t.key}
                        onClick={() => {
                          if (t.key === q.question_type) return
                          updateQuestion(q.id, { question_type: t.key, ...seedForType(t.key) })
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
                    placeholder={
                      q.question_type === "fill_blank"
                        ? "Write the sentence with ____ where the blank goes..."
                        : "Enter your question..."
                    }
                    rows={2}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    autoFocus
                  />

                  {/* Source passage (passage_id, close_reading) */}
                  {PASSAGE_TYPES.has(q.question_type) && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Passage (quoted for the student)</label>
                      <textarea
                        value={metaStr(q, "passage")}
                        onChange={(e) =>
                          updateQuestion(q.id, { meta: patchMeta(q, { passage: e.target.value || undefined }) })
                        }
                        placeholder="Paste the excerpt the question is about..."
                        rows={3}
                        className="mt-1 w-full rounded-md border bg-background px-3 py-2 font-serif text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                  )}

                  {/* Per-type context fields */}
                  {q.question_type === "vocabulary_in_context" && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Vocabulary word</label>
                      <Input
                        value={metaStr(q, "vocabWord")}
                        onChange={(e) =>
                          updateQuestion(q.id, { meta: patchMeta(q, { vocabWord: e.target.value || undefined }) })
                        }
                        placeholder="The word being tested"
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                  {q.question_type === "identification" && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">What is identified?</label>
                      <select
                        value={metaStr(q, "identificationSubject") || "character"}
                        onChange={(e) =>
                          updateQuestion(q.id, { meta: patchMeta(q, { identificationSubject: e.target.value }) })
                        }
                        className="mt-1 block rounded-md border bg-background px-3 py-2 text-sm"
                      >
                        <option value="character">Character</option>
                        <option value="speaker">Speaker</option>
                        <option value="book">Book / work</option>
                      </select>
                    </div>
                  )}
                  {q.question_type === "theme_analysis" && (
                    <div>
                      <label className="text-xs font-medium text-muted-foreground">Theme under analysis</label>
                      <Input
                        value={metaStr(q, "theme")}
                        onChange={(e) =>
                          updateQuestion(q.id, { meta: patchMeta(q, { theme: e.target.value || undefined }) })
                        }
                        placeholder="e.g. hubris, homecoming, providence"
                        className="mt-1 text-sm"
                      />
                    </div>
                  )}
                  {q.question_type === "cross_reference" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Compared book id (slug)</label>
                        <Input
                          value={metaStr(q, "crossRefBookId")}
                          onChange={(e) =>
                            updateQuestion(q.id, { meta: patchMeta(q, { crossRefBookId: e.target.value || undefined }) })
                          }
                          placeholder="the-odyssey"
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Displayed label</label>
                        <Input
                          value={metaStr(q, "crossRefLabel")}
                          onChange={(e) =>
                            updateQuestion(q.id, { meta: patchMeta(q, { crossRefLabel: e.target.value || undefined }) })
                          }
                          placeholder="The Odyssey"
                          className="mt-1 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Answer key editors by type */}
                  {OPTION_TYPES.has(q.question_type) && q.options && (
                    <OptionsEditor q={q} update={(u) => updateQuestion(q.id, u)} multi={false} />
                  )}
                  {q.question_type === "multiple_select" && q.options && (
                    <OptionsEditor q={q} update={(u) => updateQuestion(q.id, u)} multi />
                  )}

                  {q.question_type === "true_false" && (
                    <div className="flex gap-2">
                      {["true", "false"].map((val) => (
                        <button
                          key={val}
                          onClick={() => updateQuestion(q.id, { correct_answer: val })}
                          className={`flex-1 rounded-lg border py-2.5 text-sm font-medium capitalize transition-colors ${
                            q.correct_answer.toLowerCase() === val
                              ? "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                              : "border-border text-muted-foreground hover:border-foreground/30"
                          }`}
                        >
                          {val}
                        </button>
                      ))}
                    </div>
                  )}

                  {q.question_type === "tf_with_reason" && (
                    <TfWithReasonEditor q={q} update={(u) => updateQuestion(q.id, u)} />
                  )}

                  {q.question_type === "ordering" && (
                    <OrderingEditor q={q} update={(u) => updateQuestion(q.id, u)} />
                  )}

                  {q.question_type === "matching" && (
                    <MatchingEditor q={q} update={(u) => updateQuestion(q.id, u)} />
                  )}

                  {(q.question_type === "fill_blank" || q.question_type === "short_answer") && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Correct answer</label>
                        <Input
                          value={q.correct_answer}
                          onChange={(e) => {
                            const key = e.target.value
                            const variants = metaStrings(q, "acceptedVariants")
                            updateQuestion(q.id, {
                              correct_answer: key,
                              meta: patchMeta(q, {
                                acceptedAnswers:
                                  q.question_type === "short_answer" && key.trim()
                                    ? [key, ...variants]
                                    : undefined,
                              }),
                            })
                          }}
                          placeholder="The expected answer..."
                          className="mt-1 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">
                          Accepted variants (one per line — spelling/phrasing that also counts)
                        </label>
                        <textarea
                          value={metaStrings(q, "acceptedVariants").join("\n")}
                          onChange={(e) => {
                            const variants = e.target.value.split("\n").map((l) => l.trim()).filter(Boolean)
                            updateQuestion(q.id, {
                              meta: patchMeta(q, {
                                acceptedVariants: variants.length > 0 ? variants : undefined,
                                acceptedAnswers:
                                  q.question_type === "short_answer" && q.correct_answer.trim()
                                    ? [q.correct_answer, ...variants]
                                    : undefined,
                              }),
                            })
                          }}
                          placeholder={"Odysseus\nUlysses"}
                          rows={2}
                          className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                        {q.question_type === "short_answer" && !q.correct_answer.trim() && (
                          <p className="mt-1 text-[11px] text-muted-foreground">
                            No key yet — answers will wait for your review instead of auto-grading.
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Open-ended — graded against the rubric + reference answer */}
                  {OPEN_ENDED.has(q.question_type) && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Reference answer (guides Tome Assistant&apos;s grading)</label>
                        <textarea
                          value={q.reference_answer ?? ""}
                          onChange={(e) => updateQuestion(q.id, { reference_answer: e.target.value })}
                          placeholder="A model answer for Tome Assistant to grade against..."
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
                      <div className="flex items-center gap-3">
                        <label className="text-xs font-medium text-muted-foreground">Word count</label>
                        <Input
                          type="number"
                          min={0}
                          value={(metaOf(q).reflectionWordMin as number | undefined) ?? ""}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              meta: patchMeta(q, {
                                reflectionWordMin: e.target.value ? Number(e.target.value) : undefined,
                              }),
                            })
                          }
                          placeholder="min"
                          className="w-20 text-sm"
                        />
                        <span className="text-xs text-muted-foreground">to</span>
                        <Input
                          type="number"
                          min={0}
                          value={(metaOf(q).reflectionWordMax as number | undefined) ?? ""}
                          onChange={(e) =>
                            updateQuestion(q.id, {
                              meta: patchMeta(q, {
                                reflectionWordMax: e.target.value ? Number(e.target.value) : undefined,
                              }),
                            })
                          }
                          placeholder="max"
                          className="w-20 text-sm"
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
