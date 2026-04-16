import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

/**
 * GET /api/guided-sessions/[id] — Fetch session details.
 * Teacher sees full participant list; student sees own participation only.
 */
export async function GET(
  _req: NextRequest,
  ctx: RouteContext<"/api/guided-sessions/[id]">,
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Fetch session
  const { data: session, error } = await supabase
    .from("guided_sessions")
    .select(`
      *,
      books:book_id (id, title, author, cover_colors)
    `)
    .eq("id", id)
    .single()

  if (error || !session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  // Check access: teacher owner or participant
  const isTeacher = session.teacher_id === user.id

  if (!isTeacher) {
    const { data: participant } = await supabase
      .from("guided_session_participants")
      .select("id")
      .eq("session_id", id)
      .eq("student_id", user.id)
      .single()

    if (!participant) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 })
    }
  }

  // Fetch participants (with profile info for teacher)
  const { data: participants } = await supabase
    .from("guided_session_participants")
    .select(`
      *,
      profiles:student_id (display_name, username, avatar_url)
    `)
    .eq("session_id", id)
    .order("joined_at", { ascending: true })

  // Fetch stations (multi-station sessions)
  const { data: stations } = await supabase
    .from("guided_session_stations")
    .select("*")
    .eq("session_id", id)
    .order("station_index", { ascending: true })

  return NextResponse.json({
    session: {
      ...session,
      stations: stations ?? [],
    },
    participants: isTeacher ? participants : participants?.filter((p) => p.student_id === user.id),
  })
}
