import "server-only"

import type { createClient } from "@/lib/supabase/server"
import type { TeacherTaskKey } from "@/lib/virgil/task-config"

type DB = Awaited<ReturnType<typeof createClient>>

export interface OwnershipCtx {
  userId: string
  supabase: DB
}

/** ok → proceed; otherwise a ready-to-return Response with the right status. */
export type OwnershipResult = { ok: true } | { ok: false; response: Response }

const OK: OwnershipResult = { ok: true }
function deny(status: number, error: string): OwnershipResult {
  return { ok: false, response: Response.json({ error }, { status }) }
}

/** Teacher owns the classroom (owner or co-teacher) via the canonical helper. */
async function ownsClassroom(ctx: OwnershipCtx, classroomId: string): Promise<boolean> {
  const { data, error } = await ctx.supabase.rpc("user_has_classroom_role", {
    p_user_id: ctx.userId,
    p_classroom_id: classroomId,
    p_roles: ["owner", "co_teacher"],
  })
  if (!error && typeof data === "boolean") return data
  // Fallback to the direct owner check if the helper's arg names differ.
  const { data: cls } = await ctx.supabase
    .from("classrooms")
    .select("teacher_id")
    .eq("id", classroomId)
    .maybeSingle()
  return !!cls && cls.teacher_id === ctx.userId
}

/** Book exists AND has at least one ingested chapter (readable/quizzable). */
async function bookIsReadable(ctx: OwnershipCtx, bookId: string): Promise<boolean> {
  const { count } = await ctx.supabase
    .from("chapters")
    .select("id", { count: "exact", head: true })
    .eq("book_id", bookId)
  return (count ?? 0) > 0
}

/**
 * Object-level authorization for every teacher task. Table-driven: one place
 * that maps a task + its already-validated input to the ownership predicate.
 * The role gate happens earlier in the route; this proves the teacher owns the
 * SPECIFIC object they're acting on, not merely that they are a teacher.
 *
 * Grading fails with 404 (not 403) so a probe can't confirm an object exists.
 */
export async function assertOwnership(
  task: TeacherTaskKey,
  input: Record<string, unknown>,
  ctx: OwnershipCtx,
): Promise<OwnershipResult> {
  switch (task) {
    case "grade_response": {
      const responseId = typeof input.responseId === "string" ? input.responseId : null
      const submissionId = typeof input.submissionId === "string" ? input.submissionId : null

      if (responseId) {
        const { data: resp } = await ctx.supabase
          .from("teacher_quiz_responses")
          .select("quiz_id")
          .eq("id", responseId)
          .maybeSingle()
        if (!resp) return deny(404, "Not found.")
        const { data: quiz } = await ctx.supabase
          .from("teacher_quizzes")
          .select("teacher_id")
          .eq("id", resp.quiz_id)
          .maybeSingle()
        if (!quiz || quiz.teacher_id !== ctx.userId) return deny(404, "Not found.")
        return OK
      }
      if (submissionId) {
        const { data: sub } = await ctx.supabase
          .from("assignment_submissions")
          .select("assignment:assignments(classroom_id)")
          .eq("id", submissionId)
          .maybeSingle<{ assignment: { classroom_id: string } | null }>()
        if (!sub?.assignment?.classroom_id) return deny(404, "Not found.")
        if (!(await ownsClassroom(ctx, sub.assignment.classroom_id))) return deny(404, "Not found.")
        return OK
      }
      return deny(404, "Not found.")
    }

    case "teacher_quiz": {
      const bookId = typeof input.bookId === "string" ? input.bookId : null
      if (!bookId || !(await bookIsReadable(ctx, bookId))) {
        return deny(400, "That book isn't readable in Tome yet.")
      }
      return OK
    }

    case "assignment_draft": {
      const classroomId = typeof input.classroomId === "string" ? input.classroomId : null
      if (input.bookId != null) {
        const bookId = String(input.bookId)
        if (!(await bookIsReadable(ctx, bookId))) {
          return deny(400, "That book isn't readable in Tome yet.")
        }
      }
      if (!classroomId || !(await ownsClassroom(ctx, classroomId))) {
        return deny(403, "You don't own that classroom.")
      }
      return OK
    }

    case "announcement_draft":
    case "class_insights":
    case "student_note": {
      const classroomId = typeof input.classroomId === "string" ? input.classroomId : null
      if (!classroomId || !(await ownsClassroom(ctx, classroomId))) {
        return deny(403, "You don't own that classroom.")
      }
      return OK
    }

    // The production planner runs through /api/classroom/semester-plan/generate
    // (School-gated, classroom-owned, catalog-repaired). No /api/virgil path.
    case "semester_plan":
      return deny(404, "Not found.")

    default:
      return deny(400, "Unknown task.")
  }
}
