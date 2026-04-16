import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * GET /api/guided-sessions/[id]/review
 * Aggregated analytics for post-session review.
 * Returns session, stations, participants with per-station breakdowns,
 * messages, and reflections.
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Fetch session
  const { data: session, error: sessionError } = await supabase
    .from("guided_sessions")
    .select("*")
    .eq("id", sessionId)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  // Verify access: teacher or participant
  const isTeacher = session.teacher_id === user.id
  if (!isTeacher) {
    const { data: participant } = await supabase
      .from("guided_session_participants")
      .select("id")
      .eq("session_id", sessionId)
      .eq("student_id", user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 })
    }
  }

  // Fetch stations
  const { data: stations } = await supabase
    .from("guided_session_stations")
    .select("*")
    .eq("session_id", sessionId)
    .order("station_index", { ascending: true })

  // Fetch participants with profiles
  let participantsQuery = supabase
    .from("guided_session_participants")
    .select("*, profiles:student_id(display_name, username, avatar_url)")
    .eq("session_id", sessionId)

  if (!isTeacher) {
    participantsQuery = participantsQuery.eq("student_id", user.id)
  }

  const { data: participants } = await participantsQuery

  // Fetch messages (teacher sees all, student sees own + broadcasts)
  let messagesQuery = supabase
    .from("guided_session_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })

  if (!isTeacher) {
    messagesQuery = messagesQuery.or(`recipient_id.is.null,recipient_id.eq.${user.id}`)
  }

  const { data: messages } = await messagesQuery

  // Fetch reflections
  let reflectionsQuery = supabase
    .from("guided_session_reflections")
    .select("*")
    .eq("session_id", sessionId)

  if (!isTeacher) {
    reflectionsQuery = reflectionsQuery.eq("student_id", user.id)
  }

  const { data: reflections } = await reflectionsQuery

  return NextResponse.json({
    session,
    stations: stations ?? [],
    participants: participants ?? [],
    messages: messages ?? [],
    reflections: reflections ?? [],
  })
}
