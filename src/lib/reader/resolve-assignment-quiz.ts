"use server"

// Quiz resolution ladder for reading assignments — called by the reader's
// openAssignmentQuiz() when a student reaches the end of the assigned range.
//
//   1. Teacher quiz  — assignments.quiz_id set (quiz_mode 'teacher') → the
//      reader opens <QuizAttemptRunner> in an overlay; submitQuizAttempt owns
//      grading and the gradebook chain.
//   2. Platform quiz — quiz_mode 'platform' (the default): the platform bank
//      for the assigned range (preferring the range-end chapter, else the
//      book-level set). Difficulty comes from the planner's
//      assignment_items.platform_quiz_difficulty when present, else Apprentice.
//   3. Generate on demand — Phase 2 (Questions Available pool). Until it
//      lands, an empty bank resolves to 'none'.
//   4. None — quiz_mode 'none' or nothing resolvable; the reader's CTA reads
//      "Mark as read" and finalizes via autoFinalizeReadingForBook.
//
// finalizePlatformQuizForAssignment closes the loop for platform quizzes:
// grades the roster row and writes the canonical grades row exactly like
// submitQuizAttempt does for teacher quizzes.

import {
  type ActionResult,
  createAdminClient,
  fail,
  notify,
  ok,
  requireUser,
} from "@/lib/actions/_shared"
import { createClient } from "@/lib/supabase/server"
import { fromReaderIndex } from "@/lib/assignments/chapters"
import { classroomPoolForAssignment, withQuestionCredits } from "@/lib/credits/consume"
import { generateQuizQuestions } from "@/lib/teacher-quiz/generate"
import { prepareScope } from "@/lib/teacher-quiz/draft-service"
import type { GenerateQuizRequest, GeneratedQuestion } from "@/lib/teacher-quiz-types"

export type ResolvedAssignmentQuiz =
  | { kind: "teacher"; quizId: string }
  | { kind: "platform"; quizId: string; difficulty: string; chapterIndex: number | null }
  | { kind: "none" }

interface AssignmentRow {
  id: string
  classroom_id: string
  book_id: string | null
  quiz_id: string | null
  quiz_mode: string | null
  platform_quiz_difficulty: string | null
  chapter_range_start: number | null
  chapter_range_end: number | null
  status: string
}

export async function resolveAssignmentQuiz(
  assignmentId: string,
): Promise<ActionResult<ResolvedAssignmentQuiz>> {
  try {
    await requireUser()
    const supabase = await createClient()

    // RLS scopes this to classroom members — a non-member resolves nothing.
    const { data: a } = await supabase
      .from("assignments")
      .select(
        "id, classroom_id, book_id, quiz_id, quiz_mode, platform_quiz_difficulty, chapter_range_start, chapter_range_end, status",
      )
      .eq("id", assignmentId)
      .maybeSingle<AssignmentRow>()
    if (!a || a.status !== "active") return ok({ kind: "none" })

    const mode = a.quiz_mode ?? (a.quiz_id ? "teacher" : "platform")
    if (mode === "none") return ok({ kind: "none" })

    // 1. Teacher quiz.
    if (a.quiz_id) return ok({ kind: "teacher", quizId: a.quiz_id })
    if (mode === "teacher") return ok({ kind: "none" })

    // 2. Platform bank for the range.
    if (!a.book_id) return ok({ kind: "none" })
    const rangeStart = fromReaderIndex(a.chapter_range_start ?? 0)
    const rangeEnd = fromReaderIndex(a.chapter_range_end ?? a.chapter_range_start ?? 0)

    // Difficulty: the composer writes assignments.platform_quiz_difficulty;
    // planner-authored assignments may instead carry it on assignment_items.
    let difficulty = a.platform_quiz_difficulty
    if (!difficulty) {
      const { data: item } = await supabase
        .from("assignment_items")
        .select("platform_quiz_difficulty")
        .eq("assignment_id", assignmentId)
        .not("platform_quiz_difficulty", "is", null)
        .limit(1)
        .maybeSingle<{ platform_quiz_difficulty: string | null }>()
      difficulty = item?.platform_quiz_difficulty ?? null
    }
    difficulty = difficulty ?? "Apprentice"

    // Chapter-level quiz inside the range, preferring the range end.
    const { data: chapterQuiz } = await supabase
      .from("quizzes")
      .select("id, chapter_index")
      .eq("book_id", a.book_id)
      .eq("difficulty", difficulty)
      .gte("chapter_index", rangeStart)
      .lte("chapter_index", rangeEnd)
      .order("chapter_index", { ascending: false })
      .limit(1)
      .maybeSingle<{ id: string; chapter_index: number }>()
    if (chapterQuiz) {
      return ok({
        kind: "platform",
        quizId: chapterQuiz.id,
        difficulty,
        chapterIndex: chapterQuiz.chapter_index,
      })
    }

    // Book-level set (chapter_index is null).
    const { data: bookQuiz } = await supabase
      .from("quizzes")
      .select("id")
      .eq("book_id", a.book_id)
      .eq("difficulty", difficulty)
      .is("chapter_index", null)
      .limit(1)
      .maybeSingle<{ id: string }>()
    if (bookQuiz) {
      return ok({ kind: "platform", quizId: bookQuiz.id, difficulty, chapterIndex: null })
    }

    // 3. Generate on demand — 5 questions at the resolved difficulty, debited
    // from the CLASSROOM's Questions Available pool (never the student), then
    // cached as platform quizzes/questions rows so every later student in
    // every class reuses the bank for free.
    const generatedId = await generateAndCacheAssignmentQuiz(a, rangeStart, rangeEnd, difficulty)
    if (generatedId) {
      return ok({ kind: "platform", quizId: generatedId, difficulty, chapterIndex: rangeEnd })
    }

    // 4. Nothing resolvable (pool empty, generation failed, or book has no
    // readable text) — the reader falls back to "Mark as read".
    return ok({ kind: "none" })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── On-demand generation (ladder step 3) ─────────────────────────────────────

const ON_DEMAND_QUESTION_COUNT = 5
const READER_TO_TEACHER_DIFFICULTY: Record<string, "apprentice" | "scholar" | "master"> = {
  Apprentice: "apprentice",
  Scholar: "scholar",
  Master: "master",
}

/**
 * Generate + cache a platform quiz for an assignment whose range has no bank.
 * Consume-first: 5 Questions are debited from the classroom pool, refunded
 * automatically if generation or caching fails. Called from a student's
 * resolve, but the student is never charged — the pool belongs to the
 * classroom's owning teacher. A concurrent double-resolve can in rare cases
 * generate twice; the second bank is harmless and later resolves hit the
 * cached quiz at ladder step 2.
 */
async function generateAndCacheAssignmentQuiz(
  a: AssignmentRow,
  rangeStart: number,
  rangeEnd: number,
  difficulty: string,
): Promise<string | null> {
  try {
    if (!a.book_id) return null
    const poolId = await classroomPoolForAssignment(a.classroom_id)
    if (!poolId) return null

    const admin = createAdminClient()

    // Grounding scope: the assigned chapters (capped to bound cost).
    const indexes: number[] = []
    for (let i = rangeStart; i <= rangeEnd && indexes.length < 8; i++) indexes.push(i)
    const teacherDifficulty = READER_TO_TEACHER_DIFFICULTY[difficulty] ?? "apprentice"
    const req: GenerateQuizRequest = {
      bookId: a.book_id,
      scope: { chapterIndexes: indexes },
      difficultyMix: {
        apprentice: teacherDifficulty === "apprentice" ? ON_DEMAND_QUESTION_COUNT : 0,
        scholar: teacherDifficulty === "scholar" ? ON_DEMAND_QUESTION_COUNT : 0,
        master: teacherDifficulty === "master" ? ON_DEMAND_QUESTION_COUNT : 0,
      },
      types: ["multiple_choice", "true_false"],
      totalCount: ON_DEMAND_QUESTION_COUNT,
    }

    const scoped = await prepareScope(admin as unknown as Parameters<typeof prepareScope>[0], req)
    if (scoped.error) return null
    const { book, passage } = scoped.data

    return await withQuestionCredits(
      poolId,
      ON_DEMAND_QUESTION_COUNT,
      { assignment_id: a.id },
      async () => {
        const result = await generateQuizQuestions({
          passage,
          bookTitle: book.title,
          bookAuthor: book.author,
          req,
        })

        const rows = result.questions
          .map((q) => toPlatformQuestionRow(q, a.id))
          .filter((r): r is NonNullable<typeof r> => r !== null)
        // A thin bank is worse than none — throwing refunds the credits.
        if (rows.length < 3) throw new Error("on-demand quiz: too few valid questions")

        const { data: quiz, error: quizErr } = await admin
          .from("quizzes")
          .insert({
            book_id: a.book_id!,
            chapter_index: rangeEnd,
            difficulty,
            title: `${book.title} — ${difficulty} Quiz`,
            question_count: rows.length,
          })
          .select("id")
          .single()
        if (quizErr || !quiz) {
          throw new Error(quizErr?.message ?? "on-demand quiz: failed to save quiz")
        }

        const { error: qErr } = await admin
          .from("questions")
          .insert(rows.map((r, i) => ({ ...r, quiz_id: quiz.id as string, order: i })))
        if (qErr) {
          await admin.from("quizzes").delete().eq("id", quiz.id as string)
          throw new Error(qErr.message)
        }

        return quiz.id as string
      },
    )
  } catch (e) {
    console.error("[resolve-assignment-quiz] on-demand generation failed:", (e as Error).message)
    return null
  }
}

const OPTION_LETTERS = ["A", "B", "C", "D"] as const

/**
 * Map a generated question onto the reader `questions` dual encoding
 * (legacy option_a–d/correct_option kept in lockstep with JSONB options +
 * text correct_answer). Returns null for anything that can't be encoded
 * losslessly — the caller filters those out.
 */
function toPlatformQuestionRow(q: GeneratedQuestion, assignmentId: string) {
  const base = {
    category: q.category,
    explanation: q.explanation,
    hints: q.hints ?? null,
    distractor_eliminations: q.distractor_eliminations ?? null,
    meta: { generated_for_assignment: assignmentId },
  }

  if (q.type === "multiple_choice") {
    const options = (q.options ?? []).map((o) => o.trim()).filter(Boolean)
    if (options.length !== 4 || new Set(options).size !== 4) return null
    const correctIdx = options.findIndex((o) => o === q.correct_answer?.trim())
    if (correctIdx < 0) return null
    return {
      ...base,
      type: "multiple_choice",
      question_text: q.prompt,
      option_a: options[0],
      option_b: options[1],
      option_c: options[2],
      option_d: options[3],
      options,
      correct_option: OPTION_LETTERS[correctIdx],
      correct_answer: options[correctIdx],
    }
  }

  if (q.type === "true_false") {
    const answer = q.correct_answer?.trim().toLowerCase()
    if (answer !== "true" && answer !== "false") return null
    const text = /^true or false[:,]?\s/i.test(q.prompt)
      ? q.prompt
      : `True or False: ${q.prompt}`
    return {
      ...base,
      type: "true_false",
      question_text: text,
      option_a: "True",
      option_b: "False",
      option_c: "n/a",
      option_d: "n/a",
      options: ["True", "False"],
      correct_option: answer === "true" ? "A" : "B",
      correct_answer: answer === "true" ? "True" : "False",
    }
  }

  return null
}

/**
 * Grades the roster row for a platform-quiz assignment after the student
 * completes the resolved quiz in the reader. Mirrors the tail of
 * submitQuizAttempt (teacher-quizzes.ts): assignment_submissions → graded,
 * canonical grades row (grade_history fires by trigger), notify.
 */
export async function finalizePlatformQuizForAssignment(
  assignmentId: string,
  quizId: string,
  correct: number,
  total: number,
): Promise<ActionResult<{ score: number; maxScore: number }>> {
  try {
    const { user } = await requireUser()
    const supabase = await createClient()

    // The student must be able to see the assignment (RLS) and it must be a
    // live platform-mode assignment — never grade against a stale URL.
    const { data: a } = await supabase
      .from("assignments")
      .select("id, classroom_id, quiz_id, quiz_mode, points_available, title, status")
      .eq("id", assignmentId)
      .maybeSingle<{
        id: string
        classroom_id: string
        quiz_id: string | null
        quiz_mode: string | null
        points_available: number | null
        title: string
        status: string
      }>()
    if (!a || a.status !== "active") return fail("Assignment not found.")
    if (a.quiz_id) return fail("This assignment uses a teacher quiz.")
    if ((a.quiz_mode ?? "platform") === "none") return fail("This assignment has no quiz.")
    if (total <= 0 || correct < 0 || correct > total) return fail("Invalid quiz result.")

    // Verify the student is actually enrolled before admin writes.
    const { data: membership } = await supabase
      .from("classroom_members")
      .select("student_id")
      .eq("classroom_id", a.classroom_id)
      .eq("student_id", user.id)
      .maybeSingle()
    if (!membership) return fail("You're not enrolled in this class.")

    const admin = createAdminClient()
    const now = new Date().toISOString()
    const maxScore = a.points_available ?? 100
    const score = Math.round((correct / total) * maxScore)
    const percentage = Math.round((correct / total) * 100)

    const { data: submission, error: subErr } = await admin
      .from("assignment_submissions")
      .upsert(
        {
          assignment_id: assignmentId,
          student_id: user.id,
          status: "graded",
          score: percentage,
          submitted_at: now,
          graded_at: now,
        },
        { onConflict: "assignment_id,student_id" },
      )
      .select("id")
      .single()
    if (subErr || !submission) return fail(subErr?.message ?? "Failed to record submission.")

    const { error: gradeErr } = await admin.from("grades").upsert(
      {
        submission_id: submission.id as string,
        score,
        max_score: maxScore,
        is_auto_graded: true,
        graded_by: null,
        graded_at: now,
      },
      { onConflict: "submission_id" },
    )
    if (gradeErr) return fail(gradeErr.message)

    await notify({
      recipientId: user.id,
      type: "assignment_graded",
      title: `Quiz graded: ${a.title}`,
      body: `${score}/${maxScore}`,
      actionUrl: `/classroom/${a.classroom_id}`,
      entityType: "assignment",
      entityId: assignmentId,
      payload: { quizId },
    })

    return ok({ score, maxScore })
  } catch (e) {
    return fail((e as Error).message)
  }
}
