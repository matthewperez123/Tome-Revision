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

// ── Assign N peer reviewers to a submission ──────────────────────────────
// Called automatically when a submission is finalized for an assignment
// where peer_review_enabled = true. Selection: random sample of other
// students who are also eligible targets, excluding the submitting
// student. Idempotent: if reviewers are already assigned, no-op.

export async function assignPeerReviewers(
  submissionId: string,
): Promise<ActionResult<{ assigned: number }>> {
  const parsed = Uuid.safeParse(submissionId)
  if (!parsed.success) return fail("Invalid submission id.")
  try {
    const admin = createAdminClient()

    // Pull submission + assignment context.
    const { data: sub } = await admin
      .from("assignment_submissions")
      .select(
        "id, student_id, assignment_id, assignments(classroom_id, peer_review_enabled, peer_reviewers_per_submission, scope)",
      )
      .eq("id", parsed.data)
      .single<{
        id: string
        student_id: string
        assignment_id: string
        assignments: {
          classroom_id: string
          peer_review_enabled: boolean
          peer_reviewers_per_submission: number
          scope: string
        } | null
      }>()
    if (!sub) return fail("Submission not found.")
    if (!sub.assignments?.peer_review_enabled) {
      return fail("Assignment does not have peer review enabled.")
    }

    // Already assigned?
    const { data: existing } = await admin
      .from("peer_review_assignments")
      .select("id")
      .eq("submission_id", parsed.data)
    if ((existing?.length ?? 0) > 0) {
      return ok({ assigned: existing!.length })
    }

    // Pool of candidate reviewers: other students who have a submission
    // row for the same assignment (i.e. they were eligible targets).
    const { data: pool } = await admin
      .from("assignment_submissions")
      .select("student_id")
      .eq("assignment_id", sub.assignment_id)
      .neq("student_id", sub.student_id)

    const candidates = (pool ?? []).map((r) => r.student_id)
    if (candidates.length === 0) return ok({ assigned: 0 })

    // Random sample without replacement.
    const n = Math.min(
      sub.assignments.peer_reviewers_per_submission,
      candidates.length,
    )
    for (let i = candidates.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[candidates[i], candidates[j]] = [candidates[j], candidates[i]]
    }
    const chosen = candidates.slice(0, n)

    const rows = chosen.map((rid) => ({
      submission_id: parsed.data,
      reviewer_id: rid,
      status: "pending" as const,
    }))
    const { error } = await admin.from("peer_review_assignments").insert(rows)
    if (error) return fail(error.message)

    await notify(
      chosen.map((rid) => ({
        userId: rid,
        type: "peer_review_assigned",
        title: "You have a peer review to complete",
        actionUrl: `/classroom/${sub.assignments?.classroom_id}`,
        classroomId: sub.assignments?.classroom_id,
      })),
    )

    return ok({ assigned: chosen.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Reviewer submits their review ─────────────────────────────────────────

const ReviewInput = z.object({
  peerReviewAssignmentId: Uuid,
  rating: z.number().int().min(1).max(5).optional(),
  feedback: z.string().trim().min(1).max(5000),
})

export async function submitPeerReview(
  input: z.infer<typeof ReviewInput>,
): Promise<ActionResult<void>> {
  const parsed = ReviewInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    const { error: insertErr } = await supabase.from("peer_reviews").insert({
      peer_review_assignment_id: parsed.data.peerReviewAssignmentId,
      rating: parsed.data.rating ?? null,
      feedback: parsed.data.feedback,
    })
    if (insertErr) return fail(insertErr.message)

    const { error: updateErr } = await supabase
      .from("peer_review_assignments")
      .update({ status: "completed" })
      .eq("id", parsed.data.peerReviewAssignmentId)
      .eq("reviewer_id", user.id)
    if (updateErr) return fail(updateErr.message)

    // Notify the submission's student that they have a new peer review.
    const admin = createAdminClient()
    const { data: pra } = await admin
      .from("peer_review_assignments")
      .select(
        "submission_id, assignment_submissions(student_id, assignment_id, assignments(classroom_id))",
      )
      .eq("id", parsed.data.peerReviewAssignmentId)
      .single<{
        submission_id: string
        assignment_submissions: {
          student_id: string
          assignment_id: string
          assignments: { classroom_id: string } | null
        } | null
      }>()
    if (pra?.assignment_submissions) {
      await notify({
        userId: pra.assignment_submissions.student_id,
        type: "peer_review_received",
        title: "Someone reviewed your work",
        actionUrl: `/classroom/${pra.assignment_submissions.assignments?.classroom_id ?? ""}`,
        classroomId: pra.assignment_submissions.assignments?.classroom_id,
      })
    }

    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export async function listMyPeerReviewTasks() {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("peer_review_assignments")
    .select(
      `
      id, status, assigned_at,
      submission:assignment_submissions(
        id, assignment_id,
        assignment:assignments(id, title, classroom_id)
      )
    `,
    )
    .eq("reviewer_id", user.id)
    .eq("status", "pending")
    .order("assigned_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listPeerReviewsForSubmission(submissionId: string) {
  const parsed = Uuid.safeParse(submissionId)
  if (!parsed.success) throw new Error("Invalid submission id.")
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from("peer_reviews")
    .select(
      `
      id, rating, feedback, submitted_at,
      peer_review_assignment_id,
      peer_review_assignment:peer_review_assignments!inner(submission_id)
    `,
    )
    .eq("peer_review_assignment.submission_id", parsed.data)
  if (error) throw new Error(error.message)
  return data ?? []
}
