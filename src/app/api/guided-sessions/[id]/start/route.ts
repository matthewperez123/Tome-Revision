import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

/**
 * POST /api/guided-sessions/[id]/start — Teacher starts the session.
 * Sets status to 'active', computes ends_at from time_limit_minutes.
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
    .select("id, teacher_id, status, time_limit_minutes")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Only the session owner can start it" }, { status: 403 })
  }

  if (session.status !== "lobby") {
    return NextResponse.json({ error: `Cannot start session in '${session.status}' status` }, { status: 400 })
  }

  const now = new Date()
  const endsAt = new Date(now.getTime() + session.time_limit_minutes * 60 * 1000)

  // Update session to active
  const { data: updated, error: sessionError } = await supabase
    .from("guided_sessions")
    .update({
      status: "active",
      starts_at: now.toISOString(),
      ends_at: endsAt.toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (sessionError) {
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 })
  }

  // Update all lobby participants to active
  await supabase
    .from("guided_session_participants")
    .update({ status: "active" })
    .eq("session_id", id)
    .eq("status", "lobby")

  return NextResponse.json({ session: updated })
}
