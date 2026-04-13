import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"
import type { ControlAction } from "@/lib/guided-learning-types"

/**
 * POST /api/guided-sessions/[id]/control — Teacher session controls.
 * Actions: pause, resume, extend, kick, message
 */
export async function POST(
  request: NextRequest,
  ctx: RouteContext<"/api/guided-sessions/[id]/control">,
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: session } = await supabase
    .from("guided_sessions")
    .select("id, teacher_id, status, ends_at, paused_at")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Only the session owner can control it" }, { status: 403 })
  }

  const body = await request.json()
  const action = body.action as ControlAction | undefined

  if (!action) {
    return NextResponse.json({ error: "action required" }, { status: 400 })
  }

  const now = new Date()

  switch (action) {
    case "pause": {
      if (session.status !== "active") {
        return NextResponse.json({ error: "Can only pause active sessions" }, { status: 400 })
      }

      const { data: updated } = await supabase
        .from("guided_sessions")
        .update({ status: "paused", paused_at: now.toISOString() })
        .eq("id", id)
        .select()
        .single()

      return NextResponse.json({ session: updated })
    }

    case "resume": {
      if (session.status !== "paused") {
        return NextResponse.json({ error: "Can only resume paused sessions" }, { status: 400 })
      }

      // Extend ends_at by the duration of the pause
      let newEndsAt = session.ends_at
      if (session.paused_at && session.ends_at) {
        const pauseDuration = now.getTime() - new Date(session.paused_at).getTime()
        newEndsAt = new Date(new Date(session.ends_at).getTime() + pauseDuration).toISOString()
      }

      const { data: updated } = await supabase
        .from("guided_sessions")
        .update({ status: "active", paused_at: null, ends_at: newEndsAt })
        .eq("id", id)
        .select()
        .single()

      return NextResponse.json({ session: updated })
    }

    case "extend": {
      const minutes = body.minutes as number | undefined
      if (!minutes || minutes < 1 || minutes > 60) {
        return NextResponse.json({ error: "minutes must be between 1 and 60" }, { status: 400 })
      }

      if (!session.ends_at) {
        return NextResponse.json({ error: "Session has no end time set" }, { status: 400 })
      }

      const newEndsAt = new Date(
        new Date(session.ends_at).getTime() + minutes * 60 * 1000,
      ).toISOString()

      const { data: updated } = await supabase
        .from("guided_sessions")
        .update({ ends_at: newEndsAt })
        .eq("id", id)
        .select()
        .single()

      return NextResponse.json({ session: updated })
    }

    case "kick": {
      const studentId = body.student_id as string | undefined
      if (!studentId) {
        return NextResponse.json({ error: "student_id required for kick" }, { status: 400 })
      }

      const { error } = await supabase
        .from("guided_session_participants")
        .update({ status: "kicked" })
        .eq("session_id", id)
        .eq("student_id", studentId)

      if (error) {
        return NextResponse.json({ error: "Failed to kick student" }, { status: 500 })
      }

      return NextResponse.json({ ok: true })
    }

    case "message": {
      const message = body.message as string | undefined
      if (!message) {
        return NextResponse.json({ error: "message required" }, { status: 400 })
      }

      // Insert a message event for all active participants
      const { data: participants } = await supabase
        .from("guided_session_participants")
        .select("student_id")
        .eq("session_id", id)
        .eq("status", "active")

      if (participants?.length) {
        const events = participants.map((p) => ({
          session_id: id,
          student_id: p.student_id,
          event_type: "message_received",
          payload: { message, from: "teacher" },
        }))

        await supabase.from("guided_session_events").insert(events)
      }

      return NextResponse.json({ ok: true })
    }

    default:
      return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  }
}
