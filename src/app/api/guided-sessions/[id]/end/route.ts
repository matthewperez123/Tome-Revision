import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

/**
 * POST /api/guided-sessions/[id]/end — Teacher ends the session.
 * Computes summary data and marks session as ended.
 */
export async function POST(
  _req: NextRequest,
  ctx: RouteContext<"/api/guided-sessions/[id]/end">,
) {
  const { id } = await ctx.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: session } = await supabase
    .from("guided_sessions")
    .select("id, teacher_id, status, starts_at")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Only the session owner can end it" }, { status: 403 })
  }

  if (session.status === "ended") {
    return NextResponse.json({ error: "Session already ended" }, { status: 400 })
  }

  // Compute summary
  const { data: participants } = await supabase
    .from("guided_session_participants")
    .select("progress_pct, violation_count, score, status")
    .eq("session_id", id)

  const total = participants?.length ?? 0
  const completed = participants?.filter((p) => p.status === "submitted").length ?? 0
  const avgProgress = total > 0
    ? Math.round((participants?.reduce((sum, p) => sum + p.progress_pct, 0) ?? 0) / total)
    : 0
  const scores = participants?.filter((p) => p.score !== null).map((p) => p.score!) ?? []
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
    : null
  const totalViolations = participants?.reduce((s, p) => s + p.violation_count, 0) ?? 0

  const now = new Date()
  const durationSeconds = session.starts_at
    ? Math.round((now.getTime() - new Date(session.starts_at).getTime()) / 1000)
    : 0

  const summaryData = {
    total_participants: total,
    completed_count: completed,
    avg_progress_pct: avgProgress,
    avg_score: avgScore,
    total_violations: totalViolations,
    duration_seconds: durationSeconds,
  }

  // End the session
  const { data: updated, error } = await supabase
    .from("guided_sessions")
    .update({
      status: "ended",
      ended_at: now.toISOString(),
      summary_data: summaryData,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 })
  }

  // Mark all non-submitted participants as submitted
  await supabase
    .from("guided_session_participants")
    .update({ status: "submitted", submitted_at: now.toISOString() })
    .eq("session_id", id)
    .in("status", ["lobby", "active"])

  return NextResponse.json({ session: updated, summary: summaryData })
}
