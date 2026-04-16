import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/guided-sessions/[id]/messages
 * Teacher sends a message to students (broadcast or targeted).
 *
 * GET /api/guided-sessions/[id]/messages
 * Retrieve messages. Teacher sees all; student sees own + broadcasts.
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify teacher owns session
  const { data: session } = await supabase
    .from("guided_sessions")
    .select("teacher_id, status")
    .eq("id", sessionId)
    .single()

  if (!session || session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Not authorized" }, { status: 403 })
  }

  if (session.status !== "active" && session.status !== "paused") {
    return NextResponse.json({ error: "Session is not active" }, { status: 400 })
  }

  const body = await request.json()
  const { message_type, content, recipient_id, station_index } = body

  if (!message_type || !content) {
    return NextResponse.json({ error: "message_type and content required" }, { status: 400 })
  }

  const { data: message, error } = await supabase
    .from("guided_session_messages")
    .insert({
      session_id: sessionId,
      sender_id: user.id,
      recipient_id: recipient_id || null,
      message_type,
      content,
      station_index: station_index ?? null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // If this is a hint and targeted to a specific student, increment their hints_used
  if (message_type === "hint" && recipient_id) {
    // Fetch current hints_used and increment
    const { data: participant } = await supabase
      .from("guided_session_participants")
      .select("id, hints_used")
      .eq("session_id", sessionId)
      .eq("student_id", recipient_id)
      .single()

    if (participant) {
      await supabase
        .from("guided_session_participants")
        .update({ hints_used: (participant.hints_used ?? 0) + 1 })
        .eq("id", participant.id)
    }
  }

  return NextResponse.json({ message })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Check if user is teacher or participant
  const { data: session } = await supabase
    .from("guided_sessions")
    .select("teacher_id")
    .eq("id", sessionId)
    .single()

  const isTeacher = session?.teacher_id === user.id

  let query = supabase
    .from("guided_session_messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })

  if (!isTeacher) {
    // Student: only see broadcasts and messages addressed to them
    query = query.or(`recipient_id.is.null,recipient_id.eq.${user.id}`)
  }

  const { data: messages, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ messages: messages ?? [] })
}
