import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeJoinCode, isValidJoinCode } from "@/lib/guided-learning-types"
import type { NextRequest } from "next/server"

/**
 * POST /api/guided-sessions/[id]/join — Student joins a session.
 * Validates join code, creates participant record.
 * Supports late joins: if the session is already active and within
 * the first 50% of its duration, the student joins at the session's
 * current station with a proportionally reduced timer.
 */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/guided-sessions/[id]/join">,
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const rawCode = body.join_code as string | undefined

  if (!rawCode) {
    return NextResponse.json({ error: "join_code required" }, { status: 400 })
  }

  const code = normalizeJoinCode(rawCode)
  if (!isValidJoinCode(code)) {
    return NextResponse.json({ error: "Invalid join code format" }, { status: 400 })
  }

  // Verify session exists and code matches
  const { data: session } = await supabase
    .from("guided_sessions")
    .select("id, status, join_code, starts_at, ends_at, time_limit_minutes, duration_minutes, current_station_index")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.join_code !== code) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 400 })
  }

  // Check if student already joined
  const { data: existing } = await supabase
    .from("guided_session_participants")
    .select("id, status")
    .eq("session_id", id)
    .eq("student_id", user.id)
    .single()

  if (existing) {
    // If they were previously invited, upgrade to joined
    if (existing.status === "invited") {
      await supabase
        .from("guided_session_participants")
        .update({ status: session.status === "active" ? "active" : "joined" })
        .eq("id", existing.id)
      return NextResponse.json({ participant: existing, late_join: session.status === "active" })
    }
    return NextResponse.json({ error: "Already joined this session" }, { status: 409 })
  }

  // Determine join status based on session state
  let joinStatus: string
  let currentStationIndex = 0

  if (session.status === "lobby" || session.status === "scheduled" || session.status === "draft") {
    // Normal pre-session join
    joinStatus = session.status === "lobby" ? "lobby" : "joined"
  } else if (session.status === "active" || session.status === "paused") {
    // Late join — check if within the 50% window
    const now = Date.now()
    const startTime = session.starts_at ? new Date(session.starts_at).getTime() : now
    const totalDuration = (session.duration_minutes ?? session.time_limit_minutes) * 60 * 1000
    const elapsed = now - startTime
    const halfwayPoint = totalDuration * 0.5

    if (elapsed > halfwayPoint) {
      return NextResponse.json(
        { error: "Cannot join — session is more than 50% complete" },
        { status: 400 },
      )
    }

    // Place student at the session's current station
    currentStationIndex = session.current_station_index ?? 0
    joinStatus = "active"
  } else {
    return NextResponse.json({ error: "Session is not accepting new participants" }, { status: 400 })
  }

  // Create participant record
  const { data: participant, error } = await supabase
    .from("guided_session_participants")
    .insert({
      session_id: id,
      student_id: user.id,
      status: joinStatus,
      current_station_index: currentStationIndex,
    })
    .select()
    .single()

  if (error) {
    console.error("Failed to join session:", error)
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 })
  }

  return NextResponse.json({
    participant,
    late_join: joinStatus === "active",
    current_station_index: currentStationIndex,
  })
}
