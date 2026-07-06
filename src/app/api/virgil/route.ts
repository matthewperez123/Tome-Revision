import { createClient } from "@/lib/supabase/server"
import { isTeacherTask, handleTeacherTask } from "@/lib/virgil/teacher-tasks"
import { isOverTaskCap, CAP_MESSAGE } from "@/lib/virgil/task-config"

export const runtime = "nodejs"
export const maxDuration = 60

/**
 * POST /api/virgil — the teacher task dispatcher (quiz builder, assignment
 * draft, grader, announcement, student note, class insights). Virgil is a
 * teacher-only system: one role gate covers the entire endpoint before any
 * task runs. The request envelope is STRICT — only `{ task, input }` — so the
 * client can never influence the model, token ceiling, or temperature; the
 * task registry (TASK_CONFIG) is the sole authority for those.
 *
 * The student-era streaming chat surface ({ messages, surface }) was removed;
 * this endpoint no longer accepts it.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profileRow } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profileRow?.role !== "teacher") {
    return Response.json({ error: "Virgil is available to teachers only." }, { status: 403 })
  }

  const raw = await request.json().catch(() => null)
  if (!raw || typeof raw !== "object" || !("task" in raw)) {
    return Response.json({ error: "Send { task, input }." }, { status: 400 })
  }

  // STRICT envelope: any top-level key beyond task/input is rejected so the
  // client can never smuggle a model/system/max_tokens override.
  const extra = Object.keys(raw as Record<string, unknown>).filter(
    (k) => k !== "task" && k !== "input",
  )
  if (extra.length > 0) {
    return Response.json(
      { error: `Unexpected field(s): ${extra.join(", ")}. Send only { task, input }.` },
      { status: 400 },
    )
  }

  const task = (raw as { task?: unknown }).task
  if (!isTeacherTask(task)) {
    return Response.json({ error: "Unknown task" }, { status: 400 })
  }

  // Per-task daily cap, checked BEFORE any model call so cost is bounded at the
  // door regardless of what the task goes on to do.
  if (await isOverTaskCap(user.id, task)) {
    return Response.json({ error: CAP_MESSAGE }, { status: 429 })
  }

  return handleTeacherTask(task, raw, {
    userId: user.id,
    supabase,
    signal: request.signal,
  })
}
