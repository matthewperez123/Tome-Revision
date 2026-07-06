"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  createAdminClient,
  fail,
  notify,
  ok,
  requireSchoolTools,
  requireUser,
} from "./_shared"
import {
  autoGradeObjective,
  answerToString,
  gradeFreeResponseWithVirgil,
  isOpenEndedType,
  questionMaxPoints,
} from "@/lib/teacher-quiz/grade"
import { parseHints, type Hint } from "@/lib/quiz-hints"

const Uuid = z.string().uuid()

/**
 * Teacher-quiz lifecycle server actions on the EXISTING teacher_quizzes /
 * teacher_quiz_questions / teacher_quiz_responses / teacher_quiz_results tables
 * (distinct from the built-in book quizzes/questions/quiz_results).
 *
 * Builder + assign are teacher-gated (requireSchoolTools). The student take
 * path (getQuizForAttempt / submitQuizAttempt) is student-facing: it verifies
 * enrollment + published + assigned, then uses the admin client for grade
 * writes (students have no DELETE policy on responses, and teacher_quiz_results
 * has no student UPDATE policy — retakes must replace prior rows).
 *
 * Free-response grading reuses the single model-calling path
 * (gradeFreeResponseWithVirgil), the same one the teacher grade_response Virgil
 * task uses. graded_by is 'virgil' (DB check = {auto, virgil, teacher}).
 */

// ── Builder ───────────────────────────────────────────────────────────────

const CreateQuizInput = z.object({
  title: z.string().trim().min(1).max(200).default("Untitled Quiz"),
  bookId: z.string().min(1).optional(),
  chapterRangeStart: z.number().int().nonnegative().optional(),
  chapterRangeEnd: z.number().int().nonnegative().optional(),
  difficulty: z.enum(["apprentice", "scholar", "master"]).default("scholar"),
})

/** Create an empty draft quiz owned by the teacher. */
export async function createTeacherQuiz(
  input: z.input<typeof CreateQuizInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateQuizInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data, error } = await supabase
      .from("teacher_quizzes")
      .insert({
        teacher_id: user.id,
        title: i.title,
        book_id: i.bookId ?? null,
        chapter_range_start: i.chapterRangeStart ?? null,
        chapter_range_end: i.chapterRangeEnd ?? null,
        difficulty: i.difficulty,
        status: "draft",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Publish a draft quiz (status draft → published). Teacher-owned only. */
export async function publishTeacherQuiz(
  quizId: string,
): Promise<ActionResult<{ published: true }>> {
  const parsed = Uuid.safeParse(quizId)
  if (!parsed.success) return fail("Invalid quiz id.")
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    // Ownership + a publishable question set.
    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select("id, teacher_id")
      .eq("id", parsed.data)
      .maybeSingle<{ id: string; teacher_id: string }>()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")

    const { count } = await supabase
      .from("teacher_quiz_questions")
      .select("id", { count: "exact", head: true })
      .eq("quiz_id", parsed.data)
    if ((count ?? 0) === 0) return fail("Add at least one question before publishing.")

    const { error } = await supabase
      .from("teacher_quizzes")
      .update({ status: "published" })
      .eq("id", parsed.data)
    if (error) return fail(error.message)

    revalidatePath(`/classroom/quiz-builder/${parsed.data}`)
    return ok({ published: true })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Draft save ──────────────────────────────────────────────────────────────

const SaveQuestionInput = z.object({
  question_type: z.string().min(1),
  question_text: z.string().default(""),
  options: z.array(z.string()).nullable().default(null),
  correct_answer: z.string().default(""),
  explanation: z.string().nullable().default(null),
  points: z.number().int().min(0).default(10),
  // Grading metadata Virgil (or a teacher) authored — must survive the round-trip.
  rubric: z.unknown().optional(),
  reference_answer: z.string().nullable().optional(),
  max_points: z.number().int().min(0).nullable().optional(),
  difficulty: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  hints: z.unknown().optional(),
  distractor_eliminations: z.unknown().optional(),
  source_anchor: z.unknown().optional(),
})

const SaveQuizInput = z.object({
  quizId: Uuid,
  title: z.string().trim().min(1).max(200).default("Untitled Quiz"),
  bookId: z.string().nullable().optional(),
  difficulty: z.enum(["apprentice", "scholar", "master"]).default("scholar"),
  settings: z.object({
    timeLimit: z.number().int().min(0).nullable().default(null),
    passingScore: z.number().int().min(0).max(100).default(60),
    allowRetakes: z.boolean().default(true),
    randomizeOrder: z.boolean().default(true),
    showAnswers: z.boolean().default(true),
  }),
  questions: z.array(SaveQuestionInput).default([]),
})

/**
 * Persist a draft quiz — the authoritative, owner-gated, error-returning save
 * path (replaces the old inline client update+delete+insert that swallowed every
 * error and could empty a quiz mid-save).
 *
 * The question set is replaced atomically-safe: the new rows are INSERTED first,
 * and only then are the prior rows (those not in the freshly-inserted id set)
 * deleted. If the insert fails we return before deleting, so a failed save can
 * never leave an existing quiz with zero questions.
 */
export async function saveTeacherQuiz(
  input: z.input<typeof SaveQuizInput>,
): Promise<ActionResult<{ questionCount: number }>> {
  const parsed = SaveQuizInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select("id, teacher_id")
      .eq("id", i.quizId)
      .maybeSingle<{ id: string; teacher_id: string }>()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")

    const { error: updErr } = await supabase
      .from("teacher_quizzes")
      .update({
        title: i.title,
        book_id: i.bookId || null,
        difficulty: i.difficulty,
        time_limit_minutes: i.settings.timeLimit,
        passing_score: i.settings.passingScore,
        allow_retakes: i.settings.allowRetakes,
        randomize_order: i.settings.randomizeOrder,
        show_answers: i.settings.showAnswers,
        updated_at: new Date().toISOString(),
      })
      .eq("id", i.quizId)
    if (updErr) return fail(updErr.message)

    if (i.questions.length > 0) {
      const rows = i.questions.map((q, idx) => ({
        quiz_id: i.quizId,
        question_type: q.question_type,
        question_text: q.question_text,
        options: q.options,
        correct_answer: q.correct_answer,
        explanation: q.explanation || null,
        points: q.points,
        sort_order: idx,
        rubric: q.rubric ?? null,
        reference_answer: q.reference_answer ?? null,
        max_points: q.max_points ?? q.points,
        difficulty: q.difficulty ?? null,
        category: q.category ?? null,
        hints: q.hints ?? null,
        distractor_eliminations: q.distractor_eliminations ?? null,
        source_anchor: q.source_anchor ?? null,
      }))
      const { data: inserted, error: insErr } = await supabase
        .from("teacher_quiz_questions")
        .insert(rows)
        .select("id")
      if (insErr || !inserted) return fail(insErr?.message ?? "Failed to save questions.")

      // Delete the prior rows now that the new set is safely in place. UUIDs
      // carry no PostgREST-special chars, so the id list is safe to join.
      const newIds = (inserted as { id: string }[]).map((r) => r.id)
      const { error: delErr } = await supabase
        .from("teacher_quiz_questions")
        .delete()
        .eq("quiz_id", i.quizId)
        .not("id", "in", `(${newIds.join(",")})`)
      if (delErr) return fail(delErr.message)
    } else {
      // The teacher explicitly cleared every question.
      const { error: delErr } = await supabase
        .from("teacher_quiz_questions")
        .delete()
        .eq("quiz_id", i.quizId)
      if (delErr) return fail(delErr.message)
    }

    revalidatePath(`/classroom/quiz-builder/${i.quizId}`)
    return ok({ questionCount: i.questions.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Duplicate a quiz the teacher owns into a fresh DRAFT copy (title + " (copy)"),
 * carrying over every setting and question (with answer key + grading metadata)
 * so it can be edited independently. The copy is never published automatically.
 */
export async function duplicateTeacherQuiz(
  quizId: string,
): Promise<ActionResult<{ id: string }>> {
  const parsed = Uuid.safeParse(quizId)
  if (!parsed.success) return fail("Invalid quiz id.")
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select(
        "id, teacher_id, title, book_id, chapter_range_start, chapter_range_end, difficulty, time_limit_minutes, passing_score, randomize_order, show_answers, hints_enabled, hint_point_penalty, allow_retakes",
      )
      .eq("id", parsed.data)
      .maybeSingle()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")

    const { data: copy, error: copyErr } = await supabase
      .from("teacher_quizzes")
      .insert({
        teacher_id: user.id,
        title: `${quiz.title} (copy)`,
        book_id: quiz.book_id,
        chapter_range_start: quiz.chapter_range_start,
        chapter_range_end: quiz.chapter_range_end,
        difficulty: quiz.difficulty,
        time_limit_minutes: quiz.time_limit_minutes,
        passing_score: quiz.passing_score,
        randomize_order: quiz.randomize_order,
        show_answers: quiz.show_answers,
        hints_enabled: quiz.hints_enabled,
        hint_point_penalty: quiz.hint_point_penalty,
        allow_retakes: quiz.allow_retakes,
        status: "draft",
      })
      .select("id")
      .single()
    if (copyErr || !copy) return fail(copyErr?.message ?? "Failed to duplicate quiz.")

    const { data: questions } = await supabase
      .from("teacher_quiz_questions")
      .select(
        "question_type, question_text, options, correct_answer, explanation, points, sort_order, rubric, reference_answer, max_points, difficulty, category, hints, distractor_eliminations, source_anchor",
      )
      .eq("quiz_id", parsed.data)
      .order("sort_order", { ascending: true })

    if (questions && questions.length > 0) {
      const { error: qErr } = await supabase
        .from("teacher_quiz_questions")
        .insert(questions.map((q) => ({ ...q, quiz_id: copy.id })))
      if (qErr) return fail(qErr.message)
    }

    revalidatePath("/classroom/quiz-builder")
    return ok({ id: copy.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Assign ────────────────────────────────────────────────────────────────

const AssignInput = z.object({
  quizId: Uuid,
  classroomId: Uuid,
  dueAt: z.string().datetime().optional(),
  points: z.number().int().min(0).max(10000).default(100),
})

/**
 * Assign a published quiz to a classroom by creating (and immediately
 * publishing) a type='quiz' assignment linked via assignments.quiz_id. Seeds
 * not_started submissions for the roster + fires class_assignment notifications
 * — the same broadcast shape as publishAssignment.
 */
export async function assignQuiz(
  input: z.input<typeof AssignInput>,
): Promise<ActionResult<{ assignmentId: string; assigned: number }>> {
  const parsed = AssignInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    // Ownership: quiz + classroom must both belong to this teacher, and the
    // quiz must be published.
    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select("id, teacher_id, status, title, book_id, chapter_range_start, chapter_range_end")
      .eq("id", i.quizId)
      .maybeSingle<{
        id: string
        teacher_id: string
        status: string
        title: string
        book_id: string | null
        chapter_range_start: number | null
        chapter_range_end: number | null
      }>()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")
    if (quiz.status !== "published") return fail("Publish the quiz before assigning it.")

    const { data: classroom } = await supabase
      .from("classrooms")
      .select("id, teacher_id, name")
      .eq("id", i.classroomId)
      .maybeSingle<{ id: string; teacher_id: string; name: string }>()
    if (!classroom || classroom.teacher_id !== user.id) return fail("You don't own that classroom.")

    // Create the assignment as active (published) directly.
    const { data: assignment, error: aErr } = await supabase
      .from("assignments")
      .insert({
        classroom_id: i.classroomId,
        teacher_id: user.id,
        type: "quiz",
        quiz_id: i.quizId,
        title: quiz.title,
        book_id: quiz.book_id,
        chapter_range_start: quiz.chapter_range_start,
        chapter_range_end: quiz.chapter_range_end,
        due_date: i.dueAt ?? null,
        points_available: i.points,
        scope: "classroom",
        status: "active",
      })
      .select("id")
      .single()
    if (aErr || !assignment) return fail(aErr?.message ?? "Failed to create assignment.")

    // Seed submissions + notify the roster (admin — writes on behalf of many).
    const admin = createAdminClient()
    const { data: members } = await admin
      .from("classroom_members")
      .select("student_id")
      .eq("classroom_id", i.classroomId)
      .eq("role", "student")
    const studentIds = (members ?? []).map((m) => m.student_id as string)

    if (studentIds.length > 0) {
      await admin.from("assignment_submissions").upsert(
        studentIds.map((sid) => ({
          assignment_id: assignment.id,
          student_id: sid,
          status: "not_started" as const,
        })),
        { onConflict: "assignment_id,student_id", ignoreDuplicates: true },
      )
      await notify(
        studentIds.map((sid) => ({
          recipientId: sid,
          type: "class_assignment" as const,
          title: `New quiz: ${quiz.title}`,
          body: classroom.name,
          actionUrl: `/classroom/${i.classroomId}/quiz/${i.quizId}`,
          actorId: user.id,
          entityType: "assignment",
          entityId: assignment.id,
        })),
      )
    }

    revalidatePath(`/classroom/${i.classroomId}`)
    return ok({ assignmentId: assignment.id, assigned: studentIds.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Take (student) ──────────────────────────────────────────────────────────

export interface AttemptQuestion {
  id: string
  question_type: string
  question_text: string
  options: string[] | null
  points: number
  max_points: number
  category: string | null
  difficulty: string | null
  /** Progressive hint ladder (never contains the answer). */
  hints: Hint[]
  /** MC-only distractor eliminations, in reveal order. */
  distractor_eliminations: string[] | null
  sort_order: number
}

export interface AttemptQuiz {
  id: string
  title: string
  book_id: string | null
  time_limit_minutes: number | null
  passing_score: number
  randomize_order: boolean
  show_answers: boolean
  hints_enabled: boolean
  hint_point_penalty: number
  allow_retakes: boolean
  questions: AttemptQuestion[]
  /** Server clock at fetch — the client anchors its timer/started_at here. */
  startedAt: string
  /** A prior completed attempt, if any (for the "already taken" surface). */
  priorResult: { percentage: number; score: number; total_points: number } | null
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Verify the signed-in user may take this quiz in this classroom: they are an
 * enrolled student AND the published quiz is assigned to the class via an
 * active type='quiz' assignment. Returns the linking assignment id. Uses the
 * admin client for these lookups after resolving the caller's own id.
 */
async function verifyStudentQuizAccess(
  admin: ReturnType<typeof createAdminClient>,
  quizId: string,
  classroomId: string,
  userId: string,
): Promise<{ ok: true; assignmentId: string } | { ok: false; error: string }> {
  const { data: quiz } = await admin
    .from("teacher_quizzes")
    .select("id, status")
    .eq("id", quizId)
    .maybeSingle<{ id: string; status: string }>()
  if (!quiz || quiz.status !== "published") return { ok: false, error: "This quiz isn't available." }

  const { data: membership } = await admin
    .from("classroom_members")
    .select("id")
    .eq("classroom_id", classroomId)
    .eq("student_id", userId)
    .eq("role", "student")
    .maybeSingle()
  if (!membership) return { ok: false, error: "You're not enrolled in this class." }

  const { data: assignment } = await admin
    .from("assignments")
    .select("id")
    .eq("quiz_id", quizId)
    .eq("classroom_id", classroomId)
    .eq("status", "active")
    .maybeSingle<{ id: string }>()
  if (!assignment) return { ok: false, error: "This quiz isn't assigned to your class." }

  return { ok: true, assignmentId: assignment.id }
}

/**
 * Load a quiz for a student to take — answer-key fields (correct_answer,
 * reference_answer, rubric, explanation) are NEVER returned to the client.
 */
export async function getQuizForAttempt(
  quizId: string,
  classroomId: string,
): Promise<ActionResult<AttemptQuiz>> {
  if (!Uuid.safeParse(quizId).success || !Uuid.safeParse(classroomId).success) {
    return fail("Invalid id.")
  }
  try {
    const { user } = await requireUser()
    const admin = createAdminClient()

    const access = await verifyStudentQuizAccess(admin, quizId, classroomId, user.id)
    if (!access.ok) return fail(access.error)

    const { data: quiz } = await admin
      .from("teacher_quizzes")
      .select(
        "id, title, book_id, time_limit_minutes, passing_score, randomize_order, show_answers, hints_enabled, hint_point_penalty, allow_retakes",
      )
      .eq("id", quizId)
      .single<{
        id: string
        title: string
        book_id: string | null
        time_limit_minutes: number | null
        passing_score: number
        randomize_order: boolean
        show_answers: boolean
        hints_enabled: boolean
        hint_point_penalty: number
        allow_retakes: boolean
      }>()
    if (!quiz) return fail("Quiz not found.")

    const { data: rawQuestions } = await admin
      .from("teacher_quiz_questions")
      .select(
        "id, question_type, question_text, options, points, max_points, category, difficulty, hints, distractor_eliminations, sort_order",
      )
      .eq("quiz_id", quizId)
      .order("sort_order", { ascending: true })

    const questions: AttemptQuestion[] = (rawQuestions ?? []).map((q) => ({
      id: q.id as string,
      question_type: q.question_type as string,
      question_text: q.question_text as string,
      options: (q.options as string[] | null) ?? null,
      points: (q.points as number | null) ?? 1,
      max_points: questionMaxPoints({
        question_type: q.question_type as string,
        max_points: q.max_points as number | null,
        points: q.points as number | null,
      }),
      category: (q.category as string | null) ?? null,
      difficulty: (q.difficulty as string | null) ?? null,
      hints: quiz.hints_enabled ? parseHints(q.hints) : [],
      distractor_eliminations: (q.distractor_eliminations as string[] | null) ?? null,
      sort_order: (q.sort_order as number) ?? 0,
    }))

    // Prior completed attempt (for retake gating / result surface).
    const { data: prior } = await admin
      .from("teacher_quiz_results")
      .select("percentage, score, total_points")
      .eq("quiz_id", quizId)
      .eq("student_id", user.id)
      .order("completed_at", { ascending: false })
      .limit(1)
      .maybeSingle<{ percentage: number; score: number; total_points: number }>()

    return ok({
      id: quiz.id,
      title: quiz.title,
      book_id: quiz.book_id,
      time_limit_minutes: quiz.time_limit_minutes,
      passing_score: quiz.passing_score,
      randomize_order: quiz.randomize_order,
      show_answers: quiz.show_answers,
      hints_enabled: quiz.hints_enabled,
      hint_point_penalty: Number(quiz.hint_point_penalty ?? 0),
      allow_retakes: quiz.allow_retakes,
      questions: quiz.randomize_order ? shuffle(questions) : questions,
      startedAt: new Date().toISOString(),
      priorResult: prior ?? null,
    })
  } catch (e) {
    return fail((e as Error).message)
  }
}

const HintUsageSchema = z.object({
  used: z.number().int().min(0).max(3).default(0),
  maxLevel: z.number().int().min(0).max(3).default(0),
})

const SubmitAttemptInput = z.object({
  quizId: Uuid,
  classroomId: Uuid,
  startedAt: z.string().datetime().optional(),
  /** questionId → the student's raw answer (option text, joined selection, or free text). */
  answers: z.record(z.string(), z.unknown()).default({}),
  /** questionId → hint usage. */
  hints: z.record(z.string(), HintUsageSchema).default({}),
})

export interface AttemptResult {
  score: number
  totalPoints: number
  percentage: number
  passed: boolean
  needsReview: boolean
}

/**
 * Finalize a student attempt. Auto-grades objective questions against
 * correct_answer (graded_by='auto'); grades open-ended answers with Virgil
 * against the rubric/reference_answer (graded_by='virgil' + ai_feedback +
 * ai_rubric_breakdown, flagged for teacher review). Writes one
 * teacher_quiz_responses row per question and a single teacher_quiz_results
 * summary. On retake, prior rows for this quiz+student are replaced.
 */
export async function submitQuizAttempt(
  input: z.input<typeof SubmitAttemptInput>,
): Promise<ActionResult<AttemptResult>> {
  const parsed = SubmitAttemptInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { user } = await requireUser()
    const admin = createAdminClient()

    const access = await verifyStudentQuizAccess(admin, i.quizId, i.classroomId, user.id)
    if (!access.ok) return fail(access.error)

    const { data: quiz } = await admin
      .from("teacher_quizzes")
      .select("id, passing_score, allow_retakes, hint_point_penalty")
      .eq("id", i.quizId)
      .single<{ id: string; passing_score: number; allow_retakes: boolean; hint_point_penalty: number }>()
    if (!quiz) return fail("Quiz not found.")

    // Retake gating.
    const { data: existingResult } = await admin
      .from("teacher_quiz_results")
      .select("id")
      .eq("quiz_id", i.quizId)
      .eq("student_id", user.id)
      .limit(1)
      .maybeSingle<{ id: string }>()
    if (existingResult && !quiz.allow_retakes) {
      return fail("You've already completed this quiz.")
    }

    const { data: questions } = await admin
      .from("teacher_quiz_questions")
      .select(
        "id, question_type, question_text, options, correct_answer, rubric, reference_answer, max_points, points",
      )
      .eq("quiz_id", i.quizId)
    if (!questions || questions.length === 0) return fail("This quiz has no questions.")

    const hintPenalty = Number(quiz.hint_point_penalty ?? 0)
    const now = new Date().toISOString()

    interface ResponseRow {
      quiz_id: string
      question_id: string
      student_id: string
      response: unknown
      is_correct: boolean | null
      score: number
      max_points: number
      graded_by: "auto" | "virgil"
      ai_feedback: string | null
      ai_rubric_breakdown: unknown
      graded_at: string | null
      hints_used: number
      hint_max_level: number
    }

    const responseRows: ResponseRow[] = []
    let totalScore = 0
    let totalPoints = 0
    let needsReview = false

    for (const q of questions) {
      const qid = q.id as string
      const type = q.question_type as string
      const maxPoints = questionMaxPoints({
        question_type: type,
        max_points: q.max_points as number | null,
        points: q.points as number | null,
      })
      totalPoints += maxPoints

      const rawAnswer = i.answers[qid]
      const usage = i.hints[qid] ?? { used: 0, maxLevel: 0 }
      const penalty = Math.min(usage.used * hintPenalty, maxPoints)

      if (isOpenEndedType(type)) {
        // Free-response → Virgil rubric grade (same model path as the teacher
        // grade_response task). Flag for teacher review.
        needsReview = true
        let score = 0
        let isCorrect: boolean | null = null
        let feedback: string | null = null
        let breakdown: unknown = []
        try {
          const grade = await gradeFreeResponseWithVirgil({
            questionText: q.question_text as string,
            rubric: q.rubric,
            referenceAnswer: (q.reference_answer as string | null) ?? null,
            maxPoints,
            answerText: answerToString(rawAnswer),
          })
          score = Math.max(0, grade.score - penalty)
          isCorrect = grade.isCorrect
          feedback = grade.feedback
          breakdown = grade.rubricBreakdown
        } catch (err) {
          console.error("[teacher-quiz] free-response grade failed:", err)
          // Leave ungraded for the teacher; contributes 0 until reviewed.
          feedback = null
        }
        totalScore += score
        responseRows.push({
          quiz_id: i.quizId,
          question_id: qid,
          student_id: user.id,
          response: rawAnswer ?? null,
          is_correct: isCorrect,
          score,
          max_points: maxPoints,
          graded_by: "virgil",
          ai_feedback: feedback,
          ai_rubric_breakdown: breakdown,
          graded_at: now,
          hints_used: usage.used,
          hint_max_level: usage.maxLevel,
        })
      } else {
        // Objective → deterministic auto-grade against correct_answer.
        const verdict = autoGradeObjective(
          {
            question_type: type,
            correct_answer: (q.correct_answer as string | null) ?? null,
            options: q.options,
          },
          rawAnswer,
        )
        const isCorrect = verdict === true
        const score = Math.max(0, (isCorrect ? maxPoints : 0) - penalty)
        totalScore += score
        responseRows.push({
          quiz_id: i.quizId,
          question_id: qid,
          student_id: user.id,
          response: rawAnswer ?? null,
          is_correct: verdict === null ? null : isCorrect,
          score,
          max_points: maxPoints,
          graded_by: "auto",
          ai_feedback: null,
          ai_rubric_breakdown: null,
          graded_at: now,
          hints_used: usage.used,
          hint_max_level: usage.maxLevel,
        })
      }
    }

    // Replace prior attempt rows (students have no DELETE policy; retakes must
    // not accumulate).
    await admin.from("teacher_quiz_responses").delete().eq("quiz_id", i.quizId).eq("student_id", user.id)
    await admin.from("teacher_quiz_results").delete().eq("quiz_id", i.quizId).eq("student_id", user.id)

    const { error: respErr } = await admin.from("teacher_quiz_responses").insert(responseRows)
    if (respErr) return fail(respErr.message)

    const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0
    const passed = percentage >= quiz.passing_score

    const answersSnapshot: Record<string, unknown> = {}
    for (const [qid, val] of Object.entries(i.answers)) answersSnapshot[qid] = val

    const { error: resultErr } = await admin.from("teacher_quiz_results").insert({
      quiz_id: i.quizId,
      student_id: user.id,
      classroom_id: i.classroomId,
      assignment_id: access.assignmentId,
      // results.score / total_points are integer columns; Virgil can award
      // fractional partial credit, so round the summary.
      score: Math.round(totalScore),
      total_points: Math.round(totalPoints),
      percentage,
      answers: answersSnapshot,
      started_at: i.startedAt ?? now,
      completed_at: now,
    })
    if (resultErr) return fail(resultErr.message)

    // Reflect completion on the assignment roster. Fully-objective quizzes are
    // graded; anything with a free-response awaits teacher review.
    await admin
      .from("assignment_submissions")
      .upsert(
        {
          assignment_id: access.assignmentId,
          student_id: user.id,
          status: needsReview ? "submitted" : "graded",
          score: percentage,
          submitted_at: now,
          ...(needsReview ? {} : { graded_at: now }),
        },
        { onConflict: "assignment_id,student_id" },
      )

    return ok({ score: totalScore, totalPoints, percentage, passed, needsReview })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Teacher review ──────────────────────────────────────────────────────────

const OverrideInput = z.object({
  responseId: Uuid,
  score: z.number().nonnegative(),
  feedback: z.string().max(5000).optional(),
})

/**
 * Teacher override of a single response score. Sets teacher_override + graded_by
 * ='teacher', then recomputes the student's teacher_quiz_results summary from
 * the full response set (results has no UPDATE policy → admin recompute).
 */
export async function overrideResponseScore(
  input: z.input<typeof OverrideInput>,
): Promise<ActionResult<{ percentage: number }>> {
  const parsed = OverrideInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data: response } = await supabase
      .from("teacher_quiz_responses")
      .select("id, quiz_id, student_id, max_points")
      .eq("id", i.responseId)
      .maybeSingle<{ id: string; quiz_id: string; student_id: string; max_points: number }>()
    if (!response) return fail("Response not found.")

    // Ownership: the response's quiz must belong to this teacher.
    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select("id, teacher_id, passing_score")
      .eq("id", response.quiz_id)
      .maybeSingle<{ id: string; teacher_id: string; passing_score: number }>()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")

    const clamped = Math.min(i.score, response.max_points)
    const isCorrect = clamped >= response.max_points * 0.6
    const { error: updErr } = await supabase
      .from("teacher_quiz_responses")
      .update({
        score: clamped,
        is_correct: isCorrect,
        teacher_override: true,
        graded_by: "teacher",
        ...(i.feedback ? { ai_feedback: i.feedback } : {}),
        graded_at: new Date().toISOString(),
      })
      .eq("id", i.responseId)
    if (updErr) return fail(updErr.message)

    // Recompute the summary from every response for this quiz+student.
    const admin = createAdminClient()
    const { data: all } = await admin
      .from("teacher_quiz_responses")
      .select("score, max_points")
      .eq("quiz_id", response.quiz_id)
      .eq("student_id", response.student_id)
    const totalScore = (all ?? []).reduce((s, r) => s + Number(r.score ?? 0), 0)
    const totalPoints = (all ?? []).reduce((s, r) => s + Number(r.max_points ?? 0), 0)
    const percentage = totalPoints > 0 ? Math.round((totalScore / totalPoints) * 100) : 0

    await admin
      .from("teacher_quiz_results")
      .update({ score: Math.round(totalScore), total_points: Math.round(totalPoints), percentage })
      .eq("quiz_id", response.quiz_id)
      .eq("student_id", response.student_id)

    return ok({ percentage })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Teacher results view query ──────────────────────────────────────────────

export interface QuizResultRow {
  studentId: string
  studentName: string
  percentage: number
  score: number
  totalPoints: number
  completedAt: string
  needsReview: boolean
}

export interface StudentResponseRow {
  responseId: string
  questionId: string
  questionText: string
  questionType: string
  response: unknown
  correctAnswer: string | null
  referenceAnswer: string | null
  isCorrect: boolean | null
  score: number
  maxPoints: number
  gradedBy: string
  teacherOverride: boolean
  aiFeedback: string | null
  aiRubricBreakdown: unknown
  isOpenEnded: boolean
}

/**
 * One student's per-question responses for a quiz (teacher drill-down). Includes
 * the answer key + Virgil's draft grade so the teacher can review and override.
 */
export async function listStudentResponses(
  quizId: string,
  studentId: string,
): Promise<ActionResult<StudentResponseRow[]>> {
  if (!Uuid.safeParse(quizId).success || !Uuid.safeParse(studentId).success) {
    return fail("Invalid id.")
  }
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select("id, teacher_id")
      .eq("id", quizId)
      .maybeSingle<{ id: string; teacher_id: string }>()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")

    const admin = createAdminClient()
    const [{ data: responses }, { data: questions }] = await Promise.all([
      admin
        .from("teacher_quiz_responses")
        .select(
          "id, question_id, response, is_correct, score, max_points, graded_by, teacher_override, ai_feedback, ai_rubric_breakdown",
        )
        .eq("quiz_id", quizId)
        .eq("student_id", studentId),
      admin
        .from("teacher_quiz_questions")
        .select("id, question_text, question_type, correct_answer, reference_answer, sort_order")
        .eq("quiz_id", quizId)
        .order("sort_order", { ascending: true }),
    ])

    const respByQuestion = new Map(
      (responses ?? []).map((r) => [r.question_id as string, r]),
    )

    const rows: StudentResponseRow[] = (questions ?? [])
      .filter((q) => respByQuestion.has(q.id as string))
      .map((q) => {
        const r = respByQuestion.get(q.id as string)!
        const type = q.question_type as string
        return {
          responseId: r.id as string,
          questionId: q.id as string,
          questionText: q.question_text as string,
          questionType: type,
          response: r.response,
          correctAnswer: (q.correct_answer as string | null) ?? null,
          referenceAnswer: (q.reference_answer as string | null) ?? null,
          isCorrect: (r.is_correct as boolean | null) ?? null,
          score: Number(r.score ?? 0),
          maxPoints: Number(r.max_points ?? 0),
          gradedBy: (r.graded_by as string) ?? "auto",
          teacherOverride: Boolean(r.teacher_override),
          aiFeedback: (r.ai_feedback as string | null) ?? null,
          aiRubricBreakdown: r.ai_rubric_breakdown,
          isOpenEnded: isOpenEndedType(type),
        }
      })

    return ok(rows)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Per-student results for a quiz, for the teacher results surface. */
export async function listQuizResults(quizId: string): Promise<ActionResult<QuizResultRow[]>> {
  const parsed = Uuid.safeParse(quizId)
  if (!parsed.success) return fail("Invalid quiz id.")
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data: quiz } = await supabase
      .from("teacher_quizzes")
      .select("id, teacher_id")
      .eq("id", parsed.data)
      .maybeSingle<{ id: string; teacher_id: string }>()
    if (!quiz || quiz.teacher_id !== user.id) return fail("You don't own that quiz.")

    const admin = createAdminClient()
    const { data: results } = await admin
      .from("teacher_quiz_results")
      .select("student_id, percentage, score, total_points, completed_at")
      .eq("quiz_id", parsed.data)
      .order("completed_at", { ascending: false })

    const studentIds = Array.from(new Set((results ?? []).map((r) => r.student_id as string)))
    if (studentIds.length === 0) return ok([])

    const [{ data: profiles }, { data: reviewRows }] = await Promise.all([
      admin.from("profiles").select("id, display_name, username").in("id", studentIds),
      admin
        .from("teacher_quiz_responses")
        .select("student_id, graded_by, teacher_override")
        .eq("quiz_id", parsed.data)
        .in("student_id", studentIds),
    ])
    const nameFor = new Map(
      (profiles ?? []).map((p) => [
        p.id as string,
        (p.display_name as string) || (p.username as string) || "Student",
      ]),
    )
    // A student needs review if any Virgil-graded response hasn't been overridden.
    const needsReviewBy = new Map<string, boolean>()
    for (const r of reviewRows ?? []) {
      const sid = r.student_id as string
      const pending = r.graded_by === "virgil" && !r.teacher_override
      needsReviewBy.set(sid, (needsReviewBy.get(sid) ?? false) || pending)
    }

    return ok(
      (results ?? []).map((r) => ({
        studentId: r.student_id as string,
        studentName: nameFor.get(r.student_id as string) ?? "Student",
        percentage: Number(r.percentage ?? 0),
        score: Number(r.score ?? 0),
        totalPoints: Number(r.total_points ?? 0),
        completedAt: r.completed_at as string,
        needsReview: needsReviewBy.get(r.student_id as string) ?? false,
      })),
    )
  } catch (e) {
    return fail((e as Error).message)
  }
}
