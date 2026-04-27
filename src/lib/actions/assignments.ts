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
const Scope = z.enum(["classroom", "group", "individuals"])
const Type = z.enum(["chapter_read", "trial"])

const CreateInput = z.object({
  classroomId: Uuid,
  title: z.string().trim().min(1).max(200),
  instructions: z.string().trim().max(5000).optional(),
  type: Type,
  bookId: z.string().min(1).optional(),
  chapterNumber: z.number().int().positive().optional(),
  trialId: z.string().min(1).optional(),
  dueAt: z.string().datetime().optional(),
  points: z.number().int().min(0).max(10000).default(100),
  scope: Scope,
  targetGroupIds: z.array(Uuid).optional(),
  targetUserIds: z.array(Uuid).optional(),
  peerReviewEnabled: z.boolean().default(false),
  peerReviewersPerSubmission: z.number().int().min(1).max(5).default(2),
})

// ── Eligibility helper ────────────────────────────────────────────────────
// Decides whether a given user is an eligible target for an assignment
// based on its scope. Used by submitAssignment and the submission
// pre-create step.

export async function isStudentEligibleForAssignment(
  assignmentId: string,
  userId: string,
): Promise<boolean> {
  const admin = createAdminClient()
  const { data: a } = await admin
    .from("assignments")
    .select("classroom_id, scope")
    .eq("id", assignmentId)
    .single()
  if (!a) return false

  const { data: membership } = await admin
    .from("classroom_members")
    .select("id")
    .eq("classroom_id", a.classroom_id)
    .eq("student_id", userId)
    .maybeSingle()
  if (!membership) return false

  if (a.scope === "classroom") return true

  if (a.scope === "group") {
    const { data: targets } = await admin
      .from("assignment_targets")
      .select("group_id")
      .eq("assignment_id", assignmentId)
      .eq("target_type", "group")
    const groupIds = (targets ?? []).map((t) => t.group_id).filter(Boolean) as string[]
    if (groupIds.length === 0) return false
    const { data: gm } = await admin
      .from("classroom_group_members")
      .select("group_id")
      .in("group_id", groupIds)
      .eq("user_id", userId)
      .limit(1)
    return (gm?.length ?? 0) > 0
  }

  // scope === 'individuals'
  const { data: t } = await admin
    .from("assignment_targets")
    .select("id")
    .eq("assignment_id", assignmentId)
    .eq("target_type", "user")
    .eq("user_id", userId)
    .limit(1)
  return (t?.length ?? 0) > 0
}

// ── Mutations ─────────────────────────────────────────────────────────────

export async function createAssignment(
  input: z.infer<typeof CreateInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  const i = parsed.data

  if (i.scope === "group" && (!i.targetGroupIds || i.targetGroupIds.length === 0)) {
    return fail("Group scope requires at least one target group.")
  }
  if (i.scope === "individuals" && (!i.targetUserIds || i.targetUserIds.length === 0)) {
    return fail("Individuals scope requires at least one target user.")
  }
  if (i.type === "chapter_read" && !i.bookId) {
    return fail("chapter_read requires a bookId.")
  }
  if (i.type === "trial" && !i.trialId) {
    return fail("trial requires a trialId.")
  }

  try {
    const { supabase, user } = await requireUser()

    const { data: assignment, error } = await supabase
      .from("assignments")
      .insert({
        classroom_id: i.classroomId,
        teacher_id: user.id,
        type: i.type,
        title: i.title,
        description: i.instructions ?? null,
        book_id: i.bookId ?? null,
        chapter_range_start: i.chapterNumber ?? null,
        chapter_range_end: i.chapterNumber ?? null,
        trial_id: i.trialId ?? null,
        due_date: i.dueAt ?? null,
        points_available: i.points,
        scope: i.scope,
        peer_review_enabled: i.peerReviewEnabled,
        peer_reviewers_per_submission: i.peerReviewersPerSubmission,
        status: "active",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    // Insert assignment_targets for non-classroom scopes.
    if (i.scope === "group" && i.targetGroupIds) {
      const rows = i.targetGroupIds.map((gid) => ({
        assignment_id: assignment.id,
        target_type: "group" as const,
        group_id: gid,
        user_id: null,
      }))
      const { error: tErr } = await supabase
        .from("assignment_targets")
        .insert(rows)
      if (tErr) return fail(tErr.message)
    } else if (i.scope === "individuals" && i.targetUserIds) {
      const rows = i.targetUserIds.map((uid) => ({
        assignment_id: assignment.id,
        target_type: "user" as const,
        group_id: null,
        user_id: uid,
      }))
      const { error: tErr } = await supabase
        .from("assignment_targets")
        .insert(rows)
      if (tErr) return fail(tErr.message)
    }

    // Resolve the eligible student set, pre-create submissions, and notify.
    // Uses admin client because we're writing on behalf of multiple students.
    const admin = createAdminClient()
    const eligibleIds = await resolveEligibleStudents(
      admin,
      assignment.id,
      i.classroomId,
      i.scope,
      i.targetGroupIds ?? [],
      i.targetUserIds ?? [],
    )

    if (eligibleIds.length > 0) {
      const submissionRows = eligibleIds.map((sid) => ({
        assignment_id: assignment.id,
        student_id: sid,
        status: "not_started" as const,
      }))
      await admin.from("assignment_submissions").insert(submissionRows)

      const { data: classroom } = await admin
        .from("classrooms")
        .select("name")
        .eq("id", i.classroomId)
        .single()

      await notify(
        eligibleIds.map((sid) => ({
          userId: sid,
          type: "assignment_created",
          title: `New assignment: ${i.title}`,
          body: classroom?.name ?? undefined,
          actionUrl: `/classroom/${i.classroomId}/assignment/${assignment.id}`,
          sourceUserId: user.id,
          classroomId: i.classroomId,
        })),
      )
    }

    revalidatePath(`/classroom/${i.classroomId}`)
    return ok({ id: assignment.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

async function resolveEligibleStudents(
  admin: ReturnType<typeof createAdminClient>,
  assignmentId: string,
  classroomId: string,
  scope: "classroom" | "group" | "individuals",
  groupIds: string[],
  userIds: string[],
): Promise<string[]> {
  if (scope === "classroom") {
    const { data } = await admin
      .from("classroom_members")
      .select("student_id")
      .eq("classroom_id", classroomId)
      .eq("role", "student")
    return (data ?? []).map((r) => r.student_id)
  }
  if (scope === "group") {
    if (groupIds.length === 0) return []
    const { data } = await admin
      .from("classroom_group_members")
      .select("user_id")
      .in("group_id", groupIds)
    return Array.from(new Set((data ?? []).map((r) => r.user_id)))
  }
  // individuals — server-validate that each is a classroom member.
  if (userIds.length === 0) return []
  const { data } = await admin
    .from("classroom_members")
    .select("student_id")
    .eq("classroom_id", classroomId)
    .in("student_id", userIds)
  return (data ?? []).map((r) => r.student_id)
}

export async function deleteAssignment(
  assignmentId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(assignmentId)
  if (!parsed.success) return fail("Invalid assignment id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("assignments")
      .delete()
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

const SubmitInput = z.object({
  assignmentId: Uuid,
  payload: z.record(z.string(), z.unknown()).default({}),
})

export async function submitAssignment(
  input: z.infer<typeof SubmitInput>,
): Promise<ActionResult<{ submissionId: string }>> {
  const parsed = SubmitInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    const eligible = await isStudentEligibleForAssignment(
      parsed.data.assignmentId,
      user.id,
    )
    if (!eligible) return fail("You are not an eligible target for this assignment.")

    // Find or create the submission row.
    const { data: existing } = await supabase
      .from("assignment_submissions")
      .select("id")
      .eq("assignment_id", parsed.data.assignmentId)
      .eq("student_id", user.id)
      .maybeSingle()

    let submissionId: string
    if (existing) {
      submissionId = existing.id
      const { error } = await supabase
        .from("assignment_submissions")
        .update({
          status: "submitted",
          submitted_at: new Date().toISOString(),
          annotations: parsed.data.payload,
        })
        .eq("id", existing.id)
      if (error) return fail(error.message)
    } else {
      const { data, error } = await supabase
        .from("assignment_submissions")
        .insert({
          assignment_id: parsed.data.assignmentId,
          student_id: user.id,
          status: "submitted",
          submitted_at: new Date().toISOString(),
          annotations: parsed.data.payload,
        })
        .select("id")
        .single()
      if (error) return fail(error.message)
      submissionId = data.id
    }

    return ok({ submissionId })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export async function listAssignmentsForClassroom(classroomId: string) {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) throw new Error("Invalid classroom id.")
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from("assignments")
    .select(
      "id, title, type, scope, due_date, points_available, peer_review_enabled, status, created_at, book_id, trial_id",
    )
    .eq("classroom_id", parsed.data)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function listMyAssignments() {
  const { supabase, user } = await requireUser()
  // RLS already filters assignments to ones in the user's classrooms.
  // Join with our submission row to get our personal status.
  const { data, error } = await supabase
    .from("assignment_submissions")
    .select(
      `
      id, status, submitted_at, score,
      assignment:assignments!inner(
        id, title, type, due_date, points_available, classroom_id,
        peer_review_enabled
      )
    `,
    )
    .eq("student_id", user.id)
    .order("submitted_at", { ascending: false, nullsFirst: true })
  if (error) throw new Error(error.message)
  return data ?? []
}
