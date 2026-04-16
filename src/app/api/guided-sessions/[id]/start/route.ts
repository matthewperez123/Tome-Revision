import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

/**
 * POST /api/guided-sessions/[id]/start — Teacher starts the session.
 * Sets status to 'active', computes ends_at from time_limit_minutes.
 * For multi-station sessions, initializes current_station_index to 0
 * on the session and all participants.
 */
export async function POST(
  _req: NextRequest,
  ctx: RouteContext<"/api/guided-sessions/[id]/start">,
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify teacher owns the session
  const { data: session } = await supabase
    .from("guided_sessions")
    .select("id, teacher_id, status, time_limit_minutes, duration_minutes")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Only the session owner can start it" }, { status: 403 })
  }

  // Allow starting from lobby, draft, or scheduled states
  if (!["lobby", "draft", "scheduled"].includes(session.status)) {
    return NextResponse.json({ error: `Cannot start session in '${session.status}' status` }, { status: 400 })
  }

  const now = new Date()
  const durationMinutes = session.duration_minutes ?? session.time_limit_minutes
  const endsAt = new Date(now.getTime() + durationMinutes * 60 * 1000)

  // Update session to active
  const { data: updated, error: sessionError } = await supabase
    .from("guided_sessions")
    .update({
      status: "active",
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
      actual_start_at: now.toISOString(),
      current_station_index: 0,
    })
    .eq("id", id)
    .select()
    .single()

  if (sessionError) {
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 })
  }

  // Update all lobby/invited/joined participants to active with station_index 0
  await supabase
    .from("guided_session_participants")
    .update({
      status: "active",
      current_station_index: 0,
    })
    .eq("session_id", id)
    .in("status", ["lobby", "invited", "joined"])

  // Log start event
  const { data: participants } = await supabase
    .from("guided_session_participants")
    .select("student_id")
    .eq("session_id", id)
    .eq("status", "active")

  if (participants?.length) {
    const events = participants.map((p) => ({
      session_id: id,
      student_id: p.student_id,
      event_type: "station_started",
      payload: { station_index: 0 },
    }))
    await supabase.from("guided_session_events").insert(events)
  }

  return NextResponse.json({ session: updated })
}
