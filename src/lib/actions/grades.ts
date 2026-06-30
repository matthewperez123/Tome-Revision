"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  createAdminClient,
  fail,
  notify,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()

// ── Auto-grade a trial submission ─────────────────────────────────────────
// Pulls the score from the submission payload and writes a grade row. The
// integration with the trials engine writes `score` (0-100) into the
// submission payload before calling this; here we just lift it onto a
// proper grade row.

export async function autoGradeTrialSubmission(
  submissionId: string,
): Promise<ActionResult<{ gradeId: string }>> {
  const parsed = Uuid.safeParse(submissionId)
  if (!parsed.success) return fail("Invalid submission id.")
  try {
    const admin = createAdminClient()
    const { data: sub } = await admin
      .from("assignment_submissions")
      .select(
        "id, assignment_id, student_id, annotations, assignments(points_available, type)",
      )
      .eq("id", parsed.data)
      .single<{
        id: string
        assignment_id: string
        student_id: string
        annotations: Record<string, unknown> | null
        assignments: { points_available: number; type: string } | null
      }>()
    if (!sub) return fail("Submission not found.")
    if (sub.assignments?.type !== "trial") {
      return fail("Auto-grade only supports trial submissions.")
    }

    const payload = sub.annotations ?? {}
    const rawScore = typeof payload.score === "number" ? payload.score : null
    if (rawScore == null) return fail("No score in submission payload.")

    const max = sub.assignments?.points_available ?? 100
    const { data: grade, error } = await admin
      .from("grades")
      .upsert(
        {
          submission_id: parsed.data,
          score: rawScore,
          max_score: max,
          is_auto_graded: true,
          graded_by: null,
          graded_at: new Date().toISOString(),
        },
        { onConflict: "submission_id" },
      )
      .select("id")
      .single()
    if (error) return fail(error.message)

    // Mirror onto the submission for back-compat with existing code.
    await admin
      .from("assignment_submissions")
      .update({
        status: "graded",
        score: Math.round(rawScore),
        graded_at: new Date().toISOString(),
      })
      .eq("id", parsed.data)

    await notify({
      recipientId: sub.student_id,
      type: "assignment_graded",
      title: `Your submission was auto-graded: ${rawScore}/${max}`,
      actionUrl: `/classroom`,
      entityType: "submission",
      entityId: parsed.data,
    })

    return ok({ gradeId: grade.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Manual grade (first-time) ────────────────────────────────────────────

const GradeInput = z.object({
  submissionId: Uuid,
  score: z.number().min(0).max(10000),
  feedback: z.string().trim().max(5000).optional(),
})

export async function manualGrade(
  input: z.infer<typeof GradeInput>,
): Promise<ActionResult<{ gradeId: string }>> {
  const parsed = GradeInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    // Pull max_score from the assignment via the submission.
    const { data: sub } = await supabase
      .from("assignment_submissions")
      .select("id, student_id, assignments(points_available, classroom_id, title)")
      .eq("id", parsed.data.submissionId)
      .single<{
        id: string
        student_id: string
        assignments: {
          points_available: number
          classroom_id: string
          title: string
        } | null
      }>()
    if (!sub) return fail("Submission not found.")

    const { data: grade, error } = await supabase
      .from("grades")
      .insert({
        submission_id: parsed.data.submissionId,
        score: parsed.data.score,
        max_score: sub.assignments?.points_available ?? 100,
        feedback: parsed.data.feedback ?? null,
        is_auto_graded: false,
        graded_by: user.id,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    // Mirror onto the submission.
    const admin = createAdminClient()
    await admin
      .from("assignment_submissions")
      .update({
        status: "graded",
        score: Math.round(parsed.data.score),
        feedback: parsed.data.feedback ?? null,
        graded_at: new Date().toISOString(),
        graded_by: user.id,
      })
      .eq("id", parsed.data.submissionId)

    await notify({
      recipientId: sub.student_id,
      type: "assignment_graded",
      title: `Your submission was graded: ${sub.assignments?.title ?? "Assignment"}`,
      body: `Score: ${parsed.data.score} / ${sub.assignments?.points_available ?? 100}`,
      actionUrl: sub.assignments?.classroom_id
        ? `/classroom/${sub.assignments.classroom_id}`
        : "/classroom",
      actorId: user.id,
      entityType: "submission",
      entityId: parsed.data.submissionId,
    })

    if (sub.assignments?.classroom_id) {
      revalidatePath(`/classroom/${sub.assignments.classroom_id}`)
    }
    return ok({ gradeId: grade.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Override an existing grade (writes to grade_history) ──────────────────

export async function overrideGrade(
  input: z.infer<typeof GradeInput>,
): Promise<ActionResult<{ gradeId: string }>> {
  const parsed = GradeInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    const { data: existing } = await supabase
      .from("grades")
      .select("id, score, feedback, graded_by")
      .eq("submission_id", parsed.data.submissionId)
      .single()
    if (!existing) return fail("No existing grade to override.")

    // Audit: snapshot the previous state.
    const { error: histErr } = await supabase.from("grade_history").insert({
      grade_id: existing.id,
      previous_score: existing.score,
      previous_feedback: existing.feedback,
      previous_graded_by: existing.graded_by,
      changed_by: user.id,
    })
    if (histErr) return fail(histErr.message)

    const { error: updErr } = await supabase
      .from("grades")
      .update({
        score: parsed.data.score,
        feedback: parsed.data.feedback ?? null,
        graded_by: user.id,
        was_overridden: true,
        graded_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
    if (updErr) return fail(updErr.message)

    return ok({ gradeId: existing.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export async function listGradesForAssignment(assignmentId: string) {
  const parsed = Uuid.safeParse(assignmentId)
  if (!parsed.success) throw new Error("Invalid assignment id.")
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from("grades")
    .select(
      `
      id, score, max_score, feedback, is_auto_graded, was_overridden, graded_at,
      submission:assignment_submissions!inner(
        id, student_id, status,
        student:profiles!assignment_submissions_student_id_fkey(id, display_name, username)
      )
    `,
    )
    .eq("submission.assignment_id", parsed.data)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listGradesForClassroom(classroomId: string) {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) throw new Error("Invalid classroom id.")
  const { supabase } = await requireUser()
  // Pull all assignments + every grade in the classroom in one query.
  const { data, error } = await supabase
    .from("assignments")
    .select(
      `
      id, title, points_available, due_date,
      submissions:assignment_submissions(
        id, student_id, status,
        grade:grades(score, max_score, is_auto_graded, was_overridden)
      )
    `,
    )
    .eq("classroom_id", parsed.data)
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listMyGrades() {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("grades")
    .select(
      `
      id, score, max_score, feedback, was_overridden, graded_at,
      submission:assignment_submissions!inner(
        id, assignment_id, student_id,
        assignment:assignments(id, title, classroom_id)
      )
    `,
    )
    .eq("submission.student_id", user.id)
    .order("graded_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
