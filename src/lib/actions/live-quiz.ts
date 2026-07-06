"use server"

import { z } from "zod"
import { type ActionResult, createAdminClient, fail, ok, requireUser } from "./_shared"

/**
 * Live (Kahoot-style) quiz server actions.
 *
 * These are the HOST controls only — every write here goes through the caller's
 * own RLS-scoped client, so the live_quiz_sessions insert/update policies
 * (user_has_classroom_role owner|co_teacher|ta) are the real authorization
 * gate; a non-staff caller simply gets zero rows updated.
 *
 * Student writes (join / submit answer / finalize) do NOT live here: they are
 * the SECURITY DEFINER RPCs join_live_quiz / submit_live_quiz_answer /
 * finalize_live_quiz_for_me, called directly from the client so scoring stays
 * server-authoritative and answer latency is minimal. finalize_live_quiz_for_me
 * consumes record_trial_result as the sole quiz_results write path.
 */

const Uuid = z.string().uuid()

const STAFF_ROLES = ["owner", "co_teacher", "ta"]

// ── Launch ──────────────────────────────────────────────────────────────────

const LaunchInput = z.object({
  quizId: Uuid,
  classroomId: Uuid,
})

/**
 * Create a live game from a teacher_quiz for a classroom. Snapshots the quiz's
 * book / chapter / difficulty / question count at launch so each student's
 * self-finalize can call record_trial_result without re-reading the bank. The
 * insert runs under the caller's client, so RLS requires them to staff the
 * class (owner|co_teacher|ta) AND be the host.
 */
export async function launchLiveQuiz(
  input: z.input<typeof LaunchInput>,
): Promise<ActionResult<{ sessionId: string }>> {
  const parsed = LaunchInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase, user } = await requireUser()
    const admin = createAdminClient()

    // Snapshot the quiz (admin read — teacher_quiz_questions RLS may not grant
    // a co-teacher direct SELECT; the RLS insert below still gates the launch).
    const { data: quiz } = await admin
      .from("teacher_quizzes")
      .select("id, book_id, chapter_range_start, difficulty, status")
      .eq("id", i.quizId)
      .maybeSingle<{
        id: string
        book_id: string | null
        chapter_range_start: number | null
        difficulty: string | null
        status: string
      }>()
    if (!quiz) return fail("Quiz not found.")
    if (quiz.status !== "published") return fail("Publish the quiz before launching it live.")
    if (!quiz.book_id) return fail("Attach a book to this quiz before launching it live.")

    const { count } = await admin
      .from("teacher_quiz_questions")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", i.quizId)
    const totalQuestions = count ?? 0
    if (totalQuestions === 0) return fail("Add at least one question before launching.")

    const { data: session, error } = await supabase
      .from("live_quiz_sessions")
      .insert({
        classroom_id: i.classroomId,
        quiz_id: i.quizId,
        host_id: user.id,
        book_id: quiz.book_id,
        chapter_index: quiz.chapter_range_start ?? 0,
        difficulty: quiz.difficulty ?? "apprentice",
        total_questions: totalQuestions,
        status: "lobby",
        current_question_index: -1,
      })
      .select("id")
      .single()
    if (error || !session) {
      return fail(error?.message ?? "Only class staff can launch a live quiz.")
    }
    return ok({ sessionId: session.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Host state-machine controls ─────────────────────────────────────────────

/** Move a session from the lobby into its first question. */
export async function startLiveQuiz(sessionId: string): Promise<ActionResult<void>> {
  if (!Uuid.safeParse(sessionId).success) return fail("Invalid session id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("live_quiz_sessions")
      .update({
        status: "question",
        current_question_index: 0,
        question_started_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
      .eq("status", "lobby")
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Freeze answers and reveal the correct answer + tally for the live question. */
export async function revealLiveQuiz(sessionId: string): Promise<ActionResult<void>> {
  if (!Uuid.safeParse(sessionId).success) return fail("Invalid session id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("live_quiz_sessions")
      .update({ status: "reveal" })
      .eq("id", sessionId)
      .eq("status", "question")
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Advance from a reveal to the next question — or end the game when the last
 * question has been revealed. Reads the session (RLS: member) to decide.
 */
export async function advanceLiveQuiz(sessionId: string): Promise<ActionResult<{ ended: boolean }>> {
  if (!Uuid.safeParse(sessionId).success) return fail("Invalid session id.")
  try {
    const { supabase } = await requireUser()
    const { data: session } = await supabase
      .from("live_quiz_sessions")
      .select("id, current_question_index, total_questions")
      .eq("id", sessionId)
      .maybeSingle<{ id: string; current_question_index: number; total_questions: number }>()
    if (!session) return fail("Session not found.")

    const nextIndex = session.current_question_index + 1
    if (nextIndex >= session.total_questions) {
      const { error } = await supabase
        .from("live_quiz_sessions")
        .update({ status: "ended", ended_at: new Date().toISOString() })
        .eq("id", sessionId)
      if (error) return fail(error.message)
      return ok({ ended: true })
    }

    const { error } = await supabase
      .from("live_quiz_sessions")
      .update({
        status: "question",
        current_question_index: nextIndex,
        question_started_at: new Date().toISOString(),
      })
      .eq("id", sessionId)
    if (error) return fail(error.message)
    return ok({ ended: false })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** End the game immediately (host abort). */
export async function endLiveQuiz(sessionId: string): Promise<ActionResult<void>> {
  if (!Uuid.safeParse(sessionId).success) return fail("Invalid session id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("live_quiz_sessions")
      .update({ status: "ended", ended_at: new Date().toISOString() })
      .eq("id", sessionId)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── View (leak-safe question payload) ───────────────────────────────────────

export interface LiveQuizViewQuestion {
  index: number
  question_type: string
  question_text: string
  options: string[] | null
  points: number
  /** Only populated once the question has been revealed (or for staff). */
  correct_answer: string | null
  explanation: string | null
}

export interface LiveQuizSessionMeta {
  id: string
  classroom_id: string
  quiz_id: string
  host_id: string
  book_id: string
  status: "lobby" | "question" | "reveal" | "ended"
  current_question_index: number
  question_started_at: string | null
  total_questions: number
}

export interface LiveQuizView {
  session: LiveQuizSessionMeta
  questions: LiveQuizViewQuestion[]
  isHost: boolean
  isStaff: boolean
}

/**
 * Load the session + its questions for either the host or a player. The answer
 * key (correct_answer / explanation) is stripped for students on any question
 * that has NOT yet been revealed — the reveal gate is computed server-side, so a
 * player can never read the answer ahead of the host revealing it. Staff always
 * see the full key.
 */
export async function getLiveQuizView(sessionId: string): Promise<ActionResult<LiveQuizView>> {
  if (!Uuid.safeParse(sessionId).success) return fail("Invalid session id.")
  try {
    const { supabase, user } = await requireUser()

    // RLS: live_quiz_sessions_select requires the caller be a class member.
    const { data: session } = await supabase
      .from("live_quiz_sessions")
      .select(
        "id, classroom_id, quiz_id, host_id, book_id, status, current_question_index, question_started_at, total_questions",
      )
      .eq("id", sessionId)
      .maybeSingle<LiveQuizSessionMeta>()
    if (!session) return fail("This live quiz isn't available.")

    const isHost = session.host_id === user.id
    let isStaff = isHost
    if (!isStaff) {
      const { data: staff } = await supabase.rpc("user_has_classroom_role", {
        p_user_id: user.id,
        p_classroom_id: session.classroom_id,
        p_roles: STAFF_ROLES,
      })
      isStaff = staff === true
    }

    const admin = createAdminClient()
    const { data: rawQuestions } = await admin
      .from("teacher_quiz_questions")
      .select("question_type, question_text, options, correct_answer, explanation, points, sort_order")
      .eq("quiz_id", session.quiz_id)
      .order("sort_order", { ascending: true })

    const revealed = (index: number) =>
      isStaff ||
      index < session.current_question_index ||
      (index === session.current_question_index &&
        (session.status === "reveal" || session.status === "ended"))

    const questions: LiveQuizViewQuestion[] = (rawQuestions ?? []).map((q, index) => ({
      index,
      question_type: q.question_type as string,
      question_text: q.question_text as string,
      options: (q.options as string[] | null) ?? null,
      points: (q.points as number | null) ?? 1,
      correct_answer: revealed(index) ? ((q.correct_answer as string | null) ?? null) : null,
      explanation: revealed(index) ? ((q.explanation as string | null) ?? null) : null,
    }))

    return ok({ session, questions, isHost, isStaff })
  } catch (e) {
    return fail((e as Error).message)
  }
}
