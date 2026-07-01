import "server-only"

import Anthropic from "@anthropic-ai/sdk"
import { z } from "zod"
import { stripHtml } from "@/lib/teacher-quiz/generate"

/**
 * Shared teacher-quiz grading primitives.
 *
 * The free-response grader here is the single model-calling path — it is reused
 * by BOTH the teacher-triggered `grade_response` Virgil task (in teacher-tasks.ts)
 * and the student finalize action (submitQuizAttempt). Opus, temperature 0.
 *
 * graded_by uses "virgil" to satisfy the DB check
 * (teacher_quiz_responses_graded_by_check = {auto, virgil, teacher}).
 */

const MODEL_OPUS = "claude-opus-4-8"

const gradeResultSchema = z.object({
  score: z.number().nonnegative(),
  is_correct: z.boolean(),
  feedback: z.string().min(1),
  rubric_breakdown: z
    .array(z.object({ criterion: z.string(), points: z.number(), note: z.string() }))
    .default([]),
})

export interface VirgilGrade {
  score: number
  isCorrect: boolean
  feedback: string
  rubricBreakdown: { criterion: string; points: number; note: string }[]
}

export function isVirgilConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY)
}

/** Grade one free-response answer against its rubric / reference answer. */
export async function gradeFreeResponseWithVirgil(params: {
  questionText: string
  rubric: unknown
  referenceAnswer: string | null
  maxPoints: number
  answerText: string
}): Promise<VirgilGrade> {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) throw new Error("not_configured")
  const client = new Anthropic({ apiKey })

  const { questionText, rubric, referenceAnswer, maxPoints, answerText } = params
  const system: Anthropic.TextBlockParam[] = [
    {
      type: "text",
      text: "You are Virgil grading a student's free-response answer against a rubric. Award partial credit fairly. Feedback is warm, concrete, and tied to the text — never generic. You output strictly valid JSON.",
    },
  ]
  const prompt = `Question: ${questionText}

Rubric (max ${maxPoints} points): ${JSON.stringify(rubric ?? { max_points: maxPoints })}
Reference answer: ${referenceAnswer ?? "(none provided)"}

Student's answer:
${stripHtml(answerText)}

Grade it. Return ONLY JSON:
{"score":<0..${maxPoints}>,"is_correct":<bool, true if score >= 60% of max>,"feedback":"warm, specific feedback","rubric_breakdown":[{"criterion":"...","points":<int>,"note":"..."}]}
No prose, no fences.`

  const msg = await client.messages.create({
    model: MODEL_OPUS,
    max_tokens: 1200,
    temperature: 0,
    system,
    messages: [{ role: "user", content: prompt }],
  })
  const block = msg.content.find((b) => b.type === "text")
  const text = block && block.type === "text" ? block.text : ""
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  const raw = fenced ? fenced[1] : text
  const match = raw.match(/[[{][\s\S]*[\]}]/)
  if (!match) throw new Error("No JSON in model response")
  const grade = gradeResultSchema.parse(JSON.parse(match[0]))
  const score = Math.min(grade.score, maxPoints)
  return {
    score,
    isCorrect: grade.is_correct,
    feedback: grade.feedback,
    rubricBreakdown: grade.rubric_breakdown,
  }
}

// ── Objective auto-grading ────────────────────────────────────────────────────

/** Types that carry a machine-checkable correct_answer. */
const OBJECTIVE_TYPES = new Set([
  "multiple_choice",
  "multiple_select",
  "true_false",
  "fill_blank",
  "vocabulary_in_context",
  "passage_id",
  "vocabulary",
  "short_answer",
])

/** Types that must be graded by Virgil against a rubric / reference answer. */
const OPEN_ENDED_TYPES = new Set(["free_response", "tf_with_reason"])

export function isOpenEndedType(t: string): boolean {
  return OPEN_ENDED_TYPES.has(t)
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ")
    .replace(/[.,;:!?"'`]+$/g, "")
}

/** Pull a plain answer string out of the stored jsonb response. */
export function answerToString(response: unknown): string {
  if (response == null) return ""
  if (typeof response === "string") return response
  if (Array.isArray(response)) return response.map((r) => String(r)).join(", ")
  if (typeof response === "object") {
    const v = (response as { value?: unknown }).value
    if (Array.isArray(v)) return v.map((r) => String(r)).join(", ")
    if (v != null) return String(v)
  }
  return String(response)
}

/**
 * Grade an objective question. Returns null when the question isn't
 * machine-gradable (no correct_answer, or an open-ended type) — the caller
 * then routes it to Virgil or to teacher review.
 */
export function autoGradeObjective(
  question: { question_type: string; correct_answer: string | null; options: unknown },
  response: unknown,
): boolean | null {
  const type = question.question_type
  const correct = question.correct_answer
  if (isOpenEndedType(type)) return null
  if (!OBJECTIVE_TYPES.has(type) || correct == null || correct.trim() === "") return null

  const given = answerToString(response)
  if (type === "multiple_select") {
    const expected = new Set(correct.split(",").map((s) => norm(s)).filter(Boolean))
    const got = new Set(given.split(",").map((s) => norm(s)).filter(Boolean))
    if (expected.size !== got.size) return false
    for (const e of expected) if (!got.has(e)) return false
    return true
  }
  return norm(given) === norm(correct)
}

/** Per-question max points, defaulting sensibly by kind. */
export function questionMaxPoints(q: {
  question_type: string
  max_points: number | null
  points: number | null
}): number {
  if (q.max_points != null) return q.max_points
  if (q.points != null) return q.points
  return isOpenEndedType(q.question_type) ? 4 : 1
}
