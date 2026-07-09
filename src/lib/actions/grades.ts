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
import { isStudentEligibleForAssignment } from "./assignments"

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

// ── Auto-finalize reading assignments ─────────────────────────────────────
// Called by the reader when a student's reading_progress advances. Reading
// completion is derived, never manually submitted: an assignment is "done"
// when the student's furthest chapter reaches the assigned range end. We mirror
// the exact convention the classroom_gradebook RPC uses:
//   reading_progress.chapter_index >= coalesce(chapter_range_end,
//                                               chapter_range_start, 0)
// For every covered-and-not-yet-graded reading assignment on this book across
// the student's classes, we mark the submission submitted and write a
// full-points grade (reading is pass/complete — no partial credit).

interface ReadingAssignmentRow {
  id: string
  classroom_id: string
  scope: "classroom" | "group" | "individuals"
  points_available: number
  chapter_range_start: number | null
  chapter_range_end: number | null
  title: string
}

export async function autoFinalizeReadingForBook(
  bookId: string,
  reachedChapter?: number,
): Promise<ActionResult<{ finalized: number }>> {
  if (!bookId) return fail("Missing book id.")
  try {
    const { user } = await requireUser()
    const admin = createAdminClient()

    // Furthest chapter the student has reached in this book. The reader may
    // pass its live cursor (reachedChapter) which can lead the debounced
    // reading_progress write; take the greater of the two so completion fires
    // without waiting for the DB mirror.
    const { data: rp } = await admin
      .from("reading_progress")
      .select("chapter_index")
      .eq("user_id", user.id)
      .eq("book_id", bookId)
      .maybeSingle<{ chapter_index: number | null }>()
    const dbReached = rp?.chapter_index ?? null
    const reached =
      reachedChapter != null
        ? Math.max(reachedChapter, dbReached ?? reachedChapter)
        : dbReached
    if (reached == null) return ok({ finalized: 0 })

    // The student's classrooms.
    const { data: memberships } = await admin
      .from("classroom_members")
      .select("classroom_id")
      .eq("student_id", user.id)
    const classroomIds = (memberships ?? []).map((m) => m.classroom_id)
    if (classroomIds.length === 0) return ok({ finalized: 0 })

    // Active reading assignments on this book in those classrooms.
    const { data: assignments } = await admin
      .from("assignments")
      .select(
        "id, classroom_id, scope, points_available, chapter_range_start, chapter_range_end, title",
      )
      .in("classroom_id", classroomIds)
      .eq("book_id", bookId)
      .eq("status", "active")
      .in("type", ["reading", "chapter_read"])
      .returns<ReadingAssignmentRow[]>()
    if (!assignments || assignments.length === 0) return ok({ finalized: 0 })

    let finalized = 0
    for (const a of assignments) {
      const target = a.chapter_range_end ?? a.chapter_range_start ?? 0
      if (reached < target) continue

      const eligible = await isStudentEligibleForAssignment(a.id, user.id)
      if (!eligible) continue

      // Existing submission for this student, if any.
      const { data: existing } = await admin
        .from("assignment_submissions")
        .select("id, status")
        .eq("assignment_id", a.id)
        .eq("student_id", user.id)
        .maybeSingle<{ id: string; status: string }>()
      if (existing && (existing.status === "submitted" || existing.status === "graded")) {
        continue
      }

      const nowIso = new Date().toISOString()
      let submissionId: string
      if (existing) {
        await admin
          .from("assignment_submissions")
          .update({
            status: "graded",
            score: a.points_available,
            submitted_at: nowIso,
            graded_at: nowIso,
          })
          .eq("id", existing.id)
        submissionId = existing.id
      } else {
        const { data: created, error: subErr } = await admin
          .from("assignment_submissions")
          .insert({
            assignment_id: a.id,
            student_id: user.id,
            status: "graded",
            score: a.points_available,
            submitted_at: nowIso,
            graded_at: nowIso,
          })
          .select("id")
          .single()
        if (subErr || !created) continue
        submissionId = created.id
      }

      // Canonical grade row (full points — reading is complete/pass).
      await admin
        .from("grades")
        .upsert(
          {
            submission_id: submissionId,
            score: a.points_available,
            max_score: a.points_available,
            is_auto_graded: true,
            graded_by: null,
            graded_at: nowIso,
          },
          { onConflict: "submission_id" },
        )

      await notify({
        recipientId: user.id,
        type: "assignment_graded",
        title: `Reading complete: ${a.title}`,
        body: `Full marks · ${a.points_available}/${a.points_available}`,
        actionUrl: `/classroom/${a.classroom_id}`,
        entityType: "submission",
        entityId: submissionId,
      })
      finalized += 1
    }

    return ok({ finalized })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Grade a submission (canonical write path) ─────────────────────────────
// `grades` is the single source of truth (one row per submission). This handles
// both the first grade and every re-grade: on re-grade it overwrites the row and
// flags was_overridden. The grade_history snapshot is written automatically by
// the trg_mirror_grade_to_history DB trigger (AFTER INSERT/UPDATE on grades), so
// this and every other write path is mirrored — no app code can bypass it. It
// mirrors the numeric score onto the denormalized assignment_submissions cache
// (which the grading queue + rosters still read) and notifies the student.
// Grader-gated by the grades RLS policy, which only admits owner/co_teacher/ta
// of the submission's classroom.

const GradeInput = z.object({
  submissionId: Uuid,
  score: z.number().min(0).max(10000),
  feedback: z.string().trim().max(5000).optional(),
})

export async function gradeSubmission(
  input: z.infer<typeof GradeInput>,
): Promise<ActionResult<{ gradeId: string; wasRegrade: boolean }>> {
  const parsed = GradeInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

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

    const maxScore = sub.assignments?.points_available ?? 100
    const score = Math.max(0, Math.min(parsed.data.score, maxScore))
    const feedback = parsed.data.feedback ?? null

    // One grade per submission (UNIQUE submission_id). Re-grade => overwrite +
    // flag was_overridden; first grade => insert. grade_history is written
    // automatically by the trg_mirror_grade_to_history trigger on grades (an
    // AFTER INSERT snapshots the new grade, an AFTER UPDATE snapshots the prior
    // state), so the app no longer mirrors by hand and no write path can bypass
    // the audit trail.
    const { data: existing } = await supabase
      .from("grades")
      .select("id")
      .eq("submission_id", parsed.data.submissionId)
      .maybeSingle<{ id: string }>()

    let gradeId: string
    if (existing) {
      const { error: updErr } = await supabase
        .from("grades")
        .update({
          score,
          max_score: maxScore,
          feedback,
          graded_by: user.id,
          is_auto_graded: false,
          was_overridden: true,
          graded_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
      if (updErr) return fail(updErr.message)
      gradeId = existing.id
    } else {
      const { data: grade, error } = await supabase
        .from("grades")
        .insert({
          submission_id: parsed.data.submissionId,
          score,
          max_score: maxScore,
          feedback,
          is_auto_graded: false,
          graded_by: user.id,
        })
        .select("id")
        .single()
      if (error) return fail(error.message)
      gradeId = grade.id
    }

    // Mirror onto the denormalized submission cache (read by the grading queue
    // + student progress). grades stays canonical.
    const admin = createAdminClient()
    await admin
      .from("assignment_submissions")
      .update({
        status: "graded",
        score: Math.round(score),
        feedback,
        graded_at: new Date().toISOString(),
        graded_by: user.id,
      })
      .eq("id", parsed.data.submissionId)

    await notify({
      recipientId: sub.student_id,
      type: "assignment_graded",
      title: `Your submission was graded: ${sub.assignments?.title ?? "Assignment"}`,
      body: `Score: ${score} / ${maxScore}`,
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
    return ok({ gradeId, wasRegrade: !!existing })
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
