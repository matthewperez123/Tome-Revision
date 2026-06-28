import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateQuizRequestSchema } from "@/lib/teacher-quiz-types"
import { generateQuizQuestions } from "@/lib/teacher-quiz/generate"
import { prepareScope, persistDraftQuiz } from "@/lib/teacher-quiz/draft-service"

export const maxDuration = 60

/**
 * POST /api/guided-sessions/quiz/generate
 *
 * Teacher-only. Generates a text-grounded quiz with Virgil from the selected
 * reading scope. Persists a draft teacher_quiz (+ questions) and returns it,
 * unless `single` is set — then it returns one un-persisted replacement question.
 *
 * Answer fields never leave this server except to the owning teacher, who is
 * the only caller (auth + role gated below).
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can generate quizzes" }, { status: 403 })
  }

  const parsed = generateQuizRequestSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const req = parsed.data

  // Grounding: resolve book + the selected (possibly out-of-order) chapter scope.
  const scope = await prepareScope(supabase, req)
  if (scope.error) {
    return NextResponse.json(scope.error.json, { status: scope.error.status })
  }
  const { book, rows, passage } = scope.data

  let result
  try {
    result = await generateQuizQuestions({
      passage,
      bookTitle: book.title,
      bookAuthor: book.author,
      req,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed"
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 502
    console.error("Virgil quiz generation failed:", message)
    return NextResponse.json({ error: "generation_failed", message }, { status })
  }

  // Cost / usage logging
  console.log(
    `[virgil-quiz] book=${req.bookId} model=${result.model} ` +
      `in=${result.usage.input_tokens} out=${result.usage.output_tokens} ` +
      `cache_read=${result.usage.cache_read ?? 0} cache_write=${result.usage.cache_write ?? 0} ` +
      `count=${result.questions.length}${req.single ? " (single)" : ""}`,
  )

  // Single-question regeneration: return without persisting; the client swaps
  // it into local draft state and it is saved on publish.
  if (req.single) {
    return NextResponse.json({ question: result.questions[0], model: result.model })
  }

  const persisted = await persistDraftQuiz(
    supabase,
    user.id,
    req,
    result.questions,
    rows,
    book,
    result.model,
  )
  return NextResponse.json(
    { ...persisted.json, model: result.model },
    { status: persisted.status },
  )
}
