import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import {
  ALL_QUESTION_TYPES,
  TEACHER_QUIZ_DIFFICULTIES,
  QUESTION_CATEGORIES,
  rubricSchema,
  sourceAnchorSchema,
  isObjectiveType,
  answerStringsForLeakCheck,
} from "@/lib/teacher-quiz-types"
import { hintLadderSchema, stripLeakingHints } from "@/lib/quiz-hints"

const editedQuestionSchema = z.object({
  question_type: z.enum(ALL_QUESTION_TYPES),
  question_text: z.string().min(1),
  options: z.array(z.string()).nullable().optional(),
  correct_answer: z.string().nullable().optional(),
  explanation: z.string().nullable().optional(),
  difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES).nullable().optional(),
  category: z.enum(QUESTION_CATEGORIES).nullable().optional(),
  points: z.number().int().positive().optional(),
  max_points: z.number().int().positive().nullable().optional(),
  rubric: rubricSchema.nullable().optional(),
  reference_answer: z.string().nullable().optional(),
  source_anchor: sourceAnchorSchema.nullable().optional(),
  hints: hintLadderSchema.nullable().optional(),
  distractor_eliminations: z.array(z.string()).nullable().optional(),
})

const updateQuizSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(["draft", "published"]).optional(),
  questions: z.array(editedQuestionSchema).min(1),
})

/**
 * PUT /api/guided-sessions/quiz/[quizId]
 *
 * Teacher-only. Replaces the question set for a draft quiz with the teacher's
 * reviewed/edited version and optionally publishes it. Ownership enforced.
 */
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Ownership check
  const { data: quiz } = await supabase
    .from("teacher_quizzes")
    .select("id, teacher_id")
    .eq("id", quizId)
    .single()
  if (!quiz) return NextResponse.json({ error: "Quiz not found" }, { status: 404 })
  if (quiz.teacher_id !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const parsed = updateQuizSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const { title, status, questions } = parsed.data

  // Update quiz metadata
  const quizPatch: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (title) quizPatch.title = title
  if (status) quizPatch.status = status
  await supabase.from("teacher_quizzes").update(quizPatch).eq("id", quizId)

  // Replace questions wholesale (simplest consistent path for a reviewed draft)
  await supabase.from("teacher_quiz_questions").delete().eq("quiz_id", quizId)

  const rows = questions.map((q, i) => {
    const objective = isObjectiveType(q.question_type)
    const maxPoints = q.max_points ?? q.rubric?.max_points ?? q.points ?? (objective ? 1 : 4)
    // Re-check teacher-edited hints: never persist one that leaks the answer.
    const cleanHints = q.hints
      ? stripLeakingHints(q.hints, answerStringsForLeakCheck(q))
      : []
    return {
      quiz_id: quizId,
      question_type: q.question_type,
      question_text: q.question_text,
      options: q.options ?? null,
      correct_answer: objective ? (q.correct_answer ?? null) : null,
      explanation: q.explanation ?? null,
      difficulty: q.difficulty ?? null,
      category: q.category ?? null,
      points: q.points ?? maxPoints,
      max_points: maxPoints,
      rubric: objective ? null : (q.rubric ?? null),
      reference_answer: objective ? null : (q.reference_answer ?? null),
      source_anchor: q.source_anchor ?? null,
      hints: cleanHints.length > 0 ? cleanHints : null,
      distractor_eliminations:
        objective && q.distractor_eliminations?.length ? q.distractor_eliminations : null,
      sort_order: i,
    }
  })

  const { data: inserted, error } = await supabase
    .from("teacher_quiz_questions")
    .insert(rows)
    .select(
      "id, quiz_id, question_type, question_text, options, correct_answer, explanation, difficulty, category, points, max_points, rubric, reference_answer, source_anchor, hints, distractor_eliminations, sort_order",
    )
    .order("sort_order", { ascending: true })

  if (error) {
    console.error("Failed to save quiz questions:", error)
    return NextResponse.json({ error: "Failed to save questions" }, { status: 500 })
  }

  return NextResponse.json({
    quiz: { id: quizId, title, status },
    questions: inserted,
  })
}
