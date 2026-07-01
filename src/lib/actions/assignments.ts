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

const Uuid = z.string().uuid()
const Scope = z.enum(["classroom", "group", "individuals"])
// Supported assignment types. `chapter_read` is kept as a legacy alias for
// `reading`; the DB `assignments_type_check` accepts both.
const Type = z.enum([
  "reading",
  "trial",
  "annotation",
  "discussion",
  "essay",
  "chapter_read",
])

const CreateInput = z
  .object({
    classroomId: Uuid,
    title: z.string().trim().min(1).max(200),
    description: z.string().trim().max(5000).optional(),
    type: Type,
    bookId: z.string().min(1).optional(),
    chapterRangeStart: z.number().int().positive().optional(),
    chapterRangeEnd: z.number().int().positive().optional(),
    trialId: z.string().min(1).optional(),
    discussionPrompt: z.string().trim().max(5000).optional(),
    essayPrompt: z.string().trim().max(5000).optional(),
    essayWordMin: z.number().int().nonnegative().max(100000).optional(),
    essayWordMax: z.number().int().positive().max(100000).optional(),
    annotationTarget: z.number().int().positive().max(1000).optional(),
    dueAt: z.string().datetime().optional(),
    gracePeriodDays: z.number().int().min(0).max(60).default(0),
    latePenaltyPercent: z.number().int().min(0).max(100).default(0),
    points: z.number().int().min(0).max(10000).default(100),
    autoGrade: z.boolean().default(false),
    scope: Scope,
    targetGroupIds: z.array(Uuid).optional(),
    targetUserIds: z.array(Uuid).optional(),
    peerReviewEnabled: z.boolean().default(false),
    peerReviewersPerSubmission: z.number().int().min(1).max(5).default(2),
  })
  .refine(
    (v) =>
      v.essayWordMin == null ||
      v.essayWordMax == null ||
      v.essayWordMin <= v.essayWordMax,
    { message: "essayWordMin must be ≤ essayWordMax." },
  )

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

/**
 * Create an assignment as a DRAFT. Nothing is broadcast to students yet — no
 * submission rows, no notifications. Call publishAssignment(id) to go live.
 * Teacher-gated (owner/co_teacher of the class via the assignments RLS write
 * policy + the paid School entitlement).
 */
export async function createAssignment(
  input: z.input<typeof CreateInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data

  if (i.scope === "group" && (!i.targetGroupIds || i.targetGroupIds.length === 0)) {
    return fail("Group scope requires at least one target group.")
  }
  if (i.scope === "individuals" && (!i.targetUserIds || i.targetUserIds.length === 0)) {
    return fail("Individuals scope requires at least one target user.")
  }
  if ((i.type === "reading" || i.type === "chapter_read" || i.type === "annotation") && !i.bookId) {
    return fail("Reading and annotation assignments require a book.")
  }
  if (i.type === "trial" && !i.trialId) {
    return fail("Trial assignments require a trial id.")
  }
  if (i.type === "discussion" && !i.discussionPrompt) {
    return fail("Discussion assignments require a prompt.")
  }
  if (i.type === "essay" && !i.essayPrompt) {
    return fail("Essay assignments require a prompt.")
  }
  if (i.type === "annotation" && !i.annotationTarget) {
    return fail("Annotation assignments require an annotation target.")
  }

  const rangeStart = i.chapterRangeStart ?? null
  const rangeEnd = i.chapterRangeEnd ?? i.chapterRangeStart ?? null

  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    const { data: assignment, error } = await supabase
      .from("assignments")
      .insert({
        classroom_id: i.classroomId,
        teacher_id: user.id,
        type: i.type,
        title: i.title,
        description: i.description ?? null,
        book_id: i.bookId ?? null,
        chapter_range_start: rangeStart,
        chapter_range_end: rangeEnd,
        trial_id: i.trialId ?? null,
        discussion_prompt: i.discussionPrompt ?? null,
        essay_prompt: i.essayPrompt ?? null,
        essay_word_min: i.essayWordMin ?? null,
        essay_word_max: i.essayWordMax ?? null,
        annotation_target: i.annotationTarget ?? null,
        due_date: i.dueAt ?? null,
        grace_period_days: i.gracePeriodDays,
        late_penalty_percent: i.latePenaltyPercent,
        points_available: i.points,
        auto_grade: i.autoGrade,
        scope: i.scope,
        peer_review_enabled: i.peerReviewEnabled,
        peer_reviewers_per_submission: i.peerReviewersPerSubmission,
        status: "draft",
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

    revalidatePath(`/classroom/${i.classroomId}`)
    return ok({ id: assignment.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Publish a draft assignment. Flips status draft → active (the DB
 * `assignments_status_check` allows only draft/active/closed, so "published"
 * is represented as `active`), eagerly creates one assignment_submissions row
 * per intended student for a clean status roster, and fires a
 * `class_assignment` notification to each. Idempotent: re-publishing an already
 * active assignment tops up any missing submission rows without duplicating.
 */
export async function publishAssignment(
  assignmentId: string,
): Promise<ActionResult<{ published: number }>> {
  const parsed = Uuid.safeParse(assignmentId)
  if (!parsed.success) return fail("Invalid assignment id.")

  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    // Load the assignment. The RLS write policy already restricts the update
    // below to owner/co_teacher; we read scope/classroom here to resolve the
    // student set.
    const { data: a, error: loadErr } = await supabase
      .from("assignments")
      .select("id, classroom_id, scope, title, status")
      .eq("id", parsed.data)
      .single<{
        id: string
        classroom_id: string
        scope: "classroom" | "group" | "individuals"
        title: string
        status: string
      }>()
    if (loadErr || !a) return fail(loadErr?.message ?? "Assignment not found.")

    // Flip to active. RLS enforces teacher authorship of this classroom.
    const { error: upErr } = await supabase
      .from("assignments")
      .update({ status: "active" })
      .eq("id", a.id)
    if (upErr) return fail(upErr.message)

    // Resolve the eligible student set from the class / stored targets, then
    // eagerly create submissions + notify. Admin client because we write on
    // behalf of multiple students.
    const admin = createAdminClient()
    const { groupIds, userIds } = await loadTargetIds(admin, a.id, a.scope)
    const eligibleIds = await resolveEligibleStudents(
      admin,
      a.id,
      a.classroom_id,
      a.scope,
      groupIds,
      userIds,
    )

    if (eligibleIds.length > 0) {
      const submissionRows = eligibleIds.map((sid) => ({
        assignment_id: a.id,
        student_id: sid,
        status: "not_started" as const,
      }))
      await admin
        .from("assignment_submissions")
        .upsert(submissionRows, {
          onConflict: "assignment_id,student_id",
          ignoreDuplicates: true,
        })

      const { data: classroom } = await admin
        .from("classrooms")
        .select("name")
        .eq("id", a.classroom_id)
        .single()

      await notify(
        eligibleIds.map((sid) => ({
          recipientId: sid,
          type: "class_assignment" as const,
          title: `New assignment: ${a.title}`,
          body: classroom?.name ?? undefined,
          actionUrl: `/classroom/${a.classroom_id}/assignment/${a.id}`,
          actorId: user.id,
          entityType: "assignment",
          entityId: a.id,
        })),
      )
    }

    revalidatePath(`/classroom/${a.classroom_id}`)
    return ok({ published: eligibleIds.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Load stored assignment_targets ids for group/individual-scoped assignments. */
async function loadTargetIds(
  admin: ReturnType<typeof createAdminClient>,
  assignmentId: string,
  scope: "classroom" | "group" | "individuals",
): Promise<{ groupIds: string[]; userIds: string[] }> {
  if (scope === "group") {
    const { data } = await admin
      .from("assignment_targets")
      .select("group_id")
      .eq("assignment_id", assignmentId)
      .eq("target_type", "group")
    return {
      groupIds: (data ?? []).map((r) => r.group_id).filter(Boolean) as string[],
      userIds: [],
    }
  }
  if (scope === "individuals") {
    const { data } = await admin
      .from("assignment_targets")
      .select("user_id")
      .eq("assignment_id", assignmentId)
      .eq("target_type", "user")
    return {
      groupIds: [],
      userIds: (data ?? []).map((r) => r.user_id).filter(Boolean) as string[],
    }
  }
  return { groupIds: [], userIds: [] }
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

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

interface AssignmentGrading {
  type: string
  book_id: string | null
  chapter_range_start: number | null
  chapter_range_end: number | null
  essay_word_min: number | null
  essay_word_max: number | null
  annotation_target: number | null
}

const SaveDraftInput = z.object({
  assignmentId: Uuid,
  responseText: z.string().max(200000).default(""),
})

/**
 * Save an in-progress response without submitting. Advances the roster status
 * to in_progress (never regresses a submitted/graded row) and stores the
 * current draft text + word count.
 */
export async function saveDraft(
  input: z.input<typeof SaveDraftInput>,
): Promise<ActionResult<{ submissionId: string }>> {
  const parsed = SaveDraftInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  const { assignmentId, responseText } = parsed.data
  try {
    const { supabase, user } = await requireUser()

    const eligible = await isStudentEligibleForAssignment(assignmentId, user.id)
    if (!eligible) return fail("You are not an eligible target for this assignment.")

    const { data: existing } = await supabase
      .from("assignment_submissions")
      .select("id, status")
      .eq("assignment_id", assignmentId)
      .eq("student_id", user.id)
      .maybeSingle<{ id: string; status: string }>()

    const patch = {
      response_text: responseText,
      word_count: countWords(responseText),
    }

    if (existing) {
      // Keep a submitted/graded status; only nudge not_started → in_progress.
      const nextStatus =
        existing.status === "not_started" ? "in_progress" : existing.status
      const { error } = await supabase
        .from("assignment_submissions")
        .update({ ...patch, status: nextStatus })
        .eq("id", existing.id)
      if (error) return fail(error.message)
      return ok({ submissionId: existing.id })
    }

    const { data, error } = await supabase
      .from("assignment_submissions")
      .insert({
        assignment_id: assignmentId,
        student_id: user.id,
        status: "in_progress",
        ...patch,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)
    return ok({ submissionId: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

const SubmitInput = z.object({
  assignmentId: Uuid,
  responseText: z.string().max(200000).optional(),
  payload: z.record(z.string(), z.unknown()).default({}),
})

/**
 * Submit an assignment. Validates per type before flipping the submission to
 * `submitted`:
 *   • essay     → response word count within essay_word_min/max
 *   • discussion→ a non-empty response
 *   • annotation→ the student has ≥ annotation_target highlights on the book
 * Reading / trial completion stays derived from reading_progress / quiz_results
 * (the classroom_gradebook RPC) — there is no manual "submit" for those.
 */
export async function submitAssignment(
  input: z.input<typeof SubmitInput>,
): Promise<ActionResult<{ submissionId: string }>> {
  const parsed = SubmitInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  const { assignmentId, responseText, payload } = parsed.data
  try {
    const { supabase, user } = await requireUser()

    const eligible = await isStudentEligibleForAssignment(assignmentId, user.id)
    if (!eligible) return fail("You are not an eligible target for this assignment.")

    const { data: a, error: loadErr } = await supabase
      .from("assignments")
      .select(
        "type, book_id, chapter_range_start, chapter_range_end, essay_word_min, essay_word_max, annotation_target",
      )
      .eq("id", assignmentId)
      .single<AssignmentGrading>()
    if (loadErr || !a) return fail(loadErr?.message ?? "Assignment not found.")

    const text = responseText ?? ""
    const wordCount = countWords(text)

    // ── Per-type validation ──────────────────────────────────────────────
    if (a.type === "essay") {
      if (wordCount === 0) return fail("Write your essay before submitting.")
      if (a.essay_word_min != null && wordCount < a.essay_word_min) {
        return fail(
          `This essay needs at least ${a.essay_word_min} words (you have ${wordCount}).`,
        )
      }
      if (a.essay_word_max != null && wordCount > a.essay_word_max) {
        return fail(
          `This essay allows at most ${a.essay_word_max} words (you have ${wordCount}).`,
        )
      }
    } else if (a.type === "discussion") {
      if (wordCount === 0) return fail("Write a response before submitting.")
    } else if (a.type === "annotation") {
      const target = a.annotation_target ?? 1
      let q = supabase
        .from("highlights")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user.id)
      if (a.book_id) q = q.eq("book_id", a.book_id)
      const { count } = await q
      const have = count ?? 0
      if (have < target) {
        return fail(
          `This assignment requires at least ${target} annotations (you have ${have}).`,
        )
      }
    }

    const submittedPatch = {
      status: "submitted" as const,
      submitted_at: new Date().toISOString(),
      response_text: text || null,
      word_count: wordCount,
      annotations: payload,
    }

    const { data: existing } = await supabase
      .from("assignment_submissions")
      .select("id")
      .eq("assignment_id", assignmentId)
      .eq("student_id", user.id)
      .maybeSingle<{ id: string }>()

    if (existing) {
      const { error } = await supabase
        .from("assignment_submissions")
        .update(submittedPatch)
        .eq("id", existing.id)
      if (error) return fail(error.message)
      return ok({ submissionId: existing.id })
    }

    const { data, error } = await supabase
      .from("assignment_submissions")
      .insert({
        assignment_id: assignmentId,
        student_id: user.id,
        ...submittedPatch,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)
    return ok({ submissionId: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Launch (student opens the reading/Trial) ──────────────────────────────
// Marks the student's submission in_progress so the roster reflects that they
// have begun. Actual completion stays derived live from reading_progress /
// quiz_results via the classroom_gradebook RPC — we never fake a score here.

export async function startAssignment(
  assignmentId: string,
): Promise<ActionResult<{ submissionId: string }>> {
  const parsed = Uuid.safeParse(assignmentId)
  if (!parsed.success) return fail("Invalid assignment id.")
  try {
    const { supabase, user } = await requireUser()

    const eligible = await isStudentEligibleForAssignment(parsed.data, user.id)
    if (!eligible) return fail("You are not an eligible target for this assignment.")

    const { data: existing } = await supabase
      .from("assignment_submissions")
      .select("id, status")
      .eq("assignment_id", parsed.data)
      .eq("student_id", user.id)
      .maybeSingle<{ id: string; status: string }>()

    let submissionId: string
    if (existing) {
      submissionId = existing.id
      // Only advance from not_started → in_progress; never regress a
      // submitted/graded row.
      if (existing.status === "not_started") {
        const { error } = await supabase
          .from("assignment_submissions")
          .update({ status: "in_progress" })
          .eq("id", existing.id)
        if (error) return fail(error.message)
      }
    } else {
      const { data, error } = await supabase
        .from("assignment_submissions")
        .insert({
          assignment_id: parsed.data,
          student_id: user.id,
          status: "in_progress",
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

/** Spec alias for startAssignment (status → in_progress on first open). */
export const startSubmission = startAssignment

// ── Queries ───────────────────────────────────────────────────────────────

/**
 * Per-assignment submission counts by status for a classroom, for the teacher
 * assignment list. Keyed by assignment id. RLS on assignment_submissions grants
 * classroom staff a read of every student's row.
 */
export async function listSubmissionStatusCounts(
  classroomId: string,
): Promise<Record<string, Record<string, number>>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) throw new Error("Invalid classroom id.")
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from("assignment_submissions")
    .select("status, assignment:assignments!inner(id, classroom_id)")
    .eq("assignment.classroom_id", parsed.data)
  if (error) throw new Error(error.message)
  const counts: Record<string, Record<string, number>> = {}
  for (const row of (data ?? []) as unknown as {
    status: string
    assignment: { id: string } | { id: string }[]
  }[]) {
    const a = Array.isArray(row.assignment) ? row.assignment[0] : row.assignment
    if (!a) continue
    counts[a.id] ??= {}
    counts[a.id][row.status] = (counts[a.id][row.status] ?? 0) + 1
  }
  return counts
}

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
