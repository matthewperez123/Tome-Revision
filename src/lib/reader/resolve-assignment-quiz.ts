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

    // 3. Generate on demand — Phase 2 (classroom Questions Available pool).
    // Until then an empty bank is an honest 'none'.
    return ok({ kind: "none" })
  } catch (e) {
    return fail((e as Error).message)
  }
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
