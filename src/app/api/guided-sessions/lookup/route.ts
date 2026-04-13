import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { normalizeJoinCode, isValidJoinCode } from "@/lib/guided-learning-types"

/**
 * GET /api/guided-sessions/lookup?code=LAUREL-XXX
 * Lookup a session by join code. Returns minimal info for the join preview.
 */
export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const rawCode = searchParams.get("code")

  if (!rawCode) {
    return NextResponse.json({ error: "code query parameter required" }, { status: 400 })
  }

  const code = normalizeJoinCode(rawCode)
  if (!isValidJoinCode(code)) {
    return NextResponse.json({ error: "Invalid join code format" }, { status: 400 })
  }

  const { data: session, error } = await supabase
    .from("guided_sessions")
    .select(`
      id, type, book_id, chapter_index, trial_id,
      time_limit_minutes, mode, status, join_code,
      books:book_id (title, author)
    `)
    .eq("join_code", code)
    .eq("status", "lobby")
    .single()

  if (error || !session) {
    return NextResponse.json({ error: "Session not found or already started" }, { status: 404 })
  }

  return NextResponse.json({ session })
}
