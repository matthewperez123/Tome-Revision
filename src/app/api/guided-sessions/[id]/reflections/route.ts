import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/guided-sessions/[id]/reflections
 * Student upserts a reflection for a station.
 *
 * GET /api/guided-sessions/[id]/reflections
 * Teacher reads all; student reads own.
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await request.json()
  const { station_id, content, word_count, submit } = body

  if (!station_id || content == null) {
    return NextResponse.json({ error: "station_id and content required" }, { status: 400 })
  }

  // Verify student is a participant
  const { data: participant } = await supabase
    .from("guided_session_participants")
    .select("id")
    .eq("session_id", sessionId)
    .eq("student_id", user.id)
    .single()

  if (!participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 })
  }

  // Upsert reflection
  const { data: reflection, error } = await supabase
    .from("guided_session_reflections")
    .upsert(
      {
        session_id: sessionId,
        station_id,
        student_id: user.id,
        content,
        word_count: word_count ?? 0,
        submitted_at: submit ? new Date().toISOString() : null,
      },
      { onConflict: "session_id,station_id,student_id" },
    )
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reflection })
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: session } = await supabase
    .from("guided_sessions")
    .select("teacher_id")
    .eq("id", sessionId)
    .single()

  const isTeacher = session?.teacher_id === user.id

  let query = supabase
    .from("guided_session_reflections")
    .select("*")
    .eq("session_id", sessionId)

  if (!isTeacher) {
    query = query.eq("student_id", user.id)
  }

  const { data: reflections, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ reflections: reflections ?? [] })
}
