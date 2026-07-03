import { createAdminClient } from "@/lib/supabase/admin"
import { notify, type NotifyParams } from "@/lib/actions/_shared"

export const dynamic = "force-dynamic"
export const maxDuration = 60

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://tome-revision.vercel.app"

interface AssignmentRow {
  id: string
  classroom_id: string
  title: string
  due_date: string
}
interface SubmissionRow {
  assignment_id: string
  student_id: string
  status: string
}
interface ExistingNotif {
  recipient_id: string
  entity_id: string | null
}

function fmtDue(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  })
}

export async function GET(request: Request) {
  // ── Double-execution guard ──
  // Vercel schedules this cron on every deployment that ships this vercel.json.
  // Only the primary project (Tome-Revision) sets CRON_ENABLED=true; forks that
  // share this Supabase DB (e.g. tome-consumer) leave it unset so the job no-ops
  // here instead of processing every row twice.
  if (process.env.CRON_ENABLED !== "true") {
    return Response.json({ skipped: true, reason: "cron disabled on this deployment" })
  }

  // ── Auth: only the cron may call this ──
  const secret = process.env.CRON_SECRET
  const auth = request.headers.get("authorization")
  if (!secret || auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const db = createAdminClient()

  // Reminder window: assignments coming due within the next 24 hours.
  const now = new Date()
  const horizon = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const { data: assignmentsData } = await db
    .from("assignments")
    .select("id, classroom_id, title, due_date")
    .eq("status", "active")
    .gte("due_date", now.toISOString())
    .lte("due_date", horizon.toISOString())
  const assignments = (assignmentsData as AssignmentRow[] | null) ?? []

  if (assignments.length === 0) {
    return Response.json({ ok: true, notified: 0, assignments: 0 })
  }

  const assignmentIds = assignments.map((a) => a.id)
  const assignmentById = new Map(assignments.map((a) => [a.id, a]))

  // Students who have NOT finished — only they get a reminder.
  const { data: subsData } = await db
    .from("assignment_submissions")
    .select("assignment_id, student_id, status")
    .in("assignment_id", assignmentIds)
    .in("status", ["not_started", "in_progress"])
  const subs = (subsData as SubmissionRow[] | null) ?? []

  // Dedup: never send two due-soon reminders for the same (student, assignment).
  const { data: existingData } = await db
    .from("notifications")
    .select("recipient_id, entity_id")
    .eq("type", "class_assignment")
    .eq("payload->>kind", "due_soon")
    .in("entity_id", assignmentIds)
  const alreadySent = new Set(
    ((existingData as ExistingNotif[] | null) ?? []).map(
      (n) => `${n.recipient_id}:${n.entity_id}`,
    ),
  )

  // Classroom names for the notification body.
  const classroomIds = Array.from(new Set(assignments.map((a) => a.classroom_id)))
  const { data: classroomsData } = await db
    .from("classrooms")
    .select("id, name")
    .in("id", classroomIds)
  const classroomNameById = new Map(
    ((classroomsData as { id: string; name: string }[] | null) ?? []).map((c) => [
      c.id,
      c.name,
    ]),
  )

  const toNotify: NotifyParams[] = []
  for (const sub of subs) {
    const key = `${sub.student_id}:${sub.assignment_id}`
    if (alreadySent.has(key)) continue
    const a = assignmentById.get(sub.assignment_id)
    if (!a) continue
    toNotify.push({
      recipientId: sub.student_id,
      type: "class_assignment",
      title: `Due soon: ${a.title}`,
      body: `${classroomNameById.get(a.classroom_id) ?? "Your class"} · due ${fmtDue(a.due_date)}`,
      actionUrl: `${SITE_URL}/classroom/${a.classroom_id}/assignment/${a.id}`,
      entityType: "assignment",
      entityId: a.id,
      payload: { kind: "due_soon" },
    })
  }

  if (toNotify.length > 0) await notify(toNotify)

  return Response.json({
    ok: true,
    assignments: assignments.length,
    notified: toNotify.length,
  })
}
