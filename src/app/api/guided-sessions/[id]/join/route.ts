import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeJoinCode, isValidJoinCode } from "@/lib/guided-learning-types"
import type { NextRequest } from "next/server"

/**
 * POST /api/guided-sessions/[id]/join — Student joins a session.
 * Validates join code, creates participant record.
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
    .select("id, status, join_code")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.join_code !== code) {
    return NextResponse.json({ error: "Invalid join code" }, { status: 400 })
  }

  if (session.status !== "lobby") {
    return NextResponse.json({ error: "Session has already started" }, { status: 400 })
  }

  // Check if student already joined
  const { data: existing } = await supabase
    .from("guided_session_participants")
    .select("id")
    .eq("session_id", id)
    .eq("student_id", user.id)
    .single()

  if (existing) {
    return NextResponse.json({ error: "Already joined this session" }, { status: 409 })
  }

  // Create participant record
  const { data: participant, error } = await supabase
    .from("guided_session_participants")
    .insert({
      session_id: id,
      student_id: user.id,
      status: "lobby",
    })
    .select()
    .single()

  if (error) {
    console.error("Failed to join session:", error)
    return NextResponse.json({ error: "Failed to join session" }, { status: 500 })
  }

  return NextResponse.json({ participant })
}
