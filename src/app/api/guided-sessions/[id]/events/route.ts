import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import type { SessionEventType } from "@/lib/guided-learning-types"

/**
 * POST /api/guided-sessions/[id]/events — Batched event insert.
 * Student submits focus/progress events. Handles violation counting
 * and auto-submit in strict mode.
 */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/guided-sessions/[id]/events">,
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Verify session is active and not expired
  const { data: session } = await supabase
    .from("guided_sessions")
    .select("id, status, ends_at, mode")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.status !== "active") {
    return NextResponse.json({ error: "Session is not active" }, { status: 400 })
  }

  // Server-side timer check: reject events after expiry
  if (session.ends_at && new Date() > new Date(session.ends_at)) {
    return NextResponse.json({ error: "Session has expired" }, { status: 400 })
  }

  // Verify student is a participant
  const { data: participant } = await supabase
    .from("guided_session_participants")
    .select("id, status, violation_count")
    .eq("session_id", id)
    .eq("student_id", user.id)
    .single()

  if (!participant) {
    return NextResponse.json({ error: "Not a participant in this session" }, { status: 403 })
  }

  if (participant.status === "submitted" || participant.status === "kicked") {
    return NextResponse.json({ error: "Participation already ended" }, { status: 400 })
  }

  const body = await request.json()
  const events = body.events as Array<{
    event_type: SessionEventType
    payload?: Record<string, unknown>
  }> | undefined

  if (!events || !Array.isArray(events) || events.length === 0) {
    return NextResponse.json({ error: "events array required" }, { status: 400 })
  }

  // Cap batch size
  if (events.length > 50) {
    return NextResponse.json({ error: "Maximum 50 events per batch" }, { status: 400 })
  }

  // Insert events
  const rows = events.map((e) => ({
    session_id: id,
    student_id: user.id,
    event_type: e.event_type,
    payload: e.payload ?? {},
  }))

  const { error: insertError } = await supabase
    .from("guided_session_events")
    .insert(rows)

  if (insertError) {
    console.error("Failed to insert events:", insertError)
    return NextResponse.json({ error: "Failed to log events" }, { status: 500 })
  }

  // Count violations in this batch
  const newViolations = events.filter((e) => e.event_type === "violation").length

  if (newViolations > 0) {
    const totalViolations = participant.violation_count + newViolations

    // Update violation count
    const updateData: Record<string, unknown> = {
      violation_count: totalViolations,
    }

    // Auto-submit in strict mode at 3+ violations
    if (session.mode === "strict" && totalViolations >= 3) {
      updateData.status = "submitted"
      updateData.submitted_at = new Date().toISOString()
    }

    await supabase
      .from("guided_session_participants")
      .update(updateData)
      .eq("id", participant.id)
  }

  // Handle progress updates
  const progressEvent = events.findLast((e) => e.event_type === "progress_update")
  if (progressEvent?.payload?.progress_pct !== undefined) {
    await supabase
      .from("guided_session_participants")
      .update({ progress_pct: progressEvent.payload.progress_pct as number })
      .eq("id", participant.id)
  }

  // Handle submit event
  const submitEvent = events.find((e) => e.event_type === "submit")
  if (submitEvent) {
    await supabase
      .from("guided_session_participants")
      .update({
        status: "submitted",
        submitted_at: new Date().toISOString(),
        score: (submitEvent.payload?.score as number) ?? null,
        progress_pct: 100,
      })
      .eq("id", participant.id)
  }

  return NextResponse.json({ ok: true })
}
