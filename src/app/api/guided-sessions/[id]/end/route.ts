import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import type { NextRequest } from "next/server"

/**
 * POST /api/guided-sessions/[id]/end — Teacher ends the session.
 * Computes summary data including per-station breakdowns and marks session as completed.
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
    .select("id, teacher_id, status, starts_at, actual_start_at")
    .eq("id", id)
    .single()

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 })
  }

  if (session.teacher_id !== user.id) {
    return NextResponse.json({ error: "Only the session owner can end it" }, { status: 403 })
  }

  if (session.status === "ended" || session.status === "completed") {
    return NextResponse.json({ error: "Session already ended" }, { status: 400 })
  }

  // Compute summary
  const { data: participants } = await supabase
    .from("guided_session_participants")
    .select("progress_pct, violation_count, score, status, hints_used, station_progress")
    .eq("session_id", id)

  const total = participants?.length ?? 0
  const completed = participants?.filter(
    (p) => p.status === "submitted" || p.status === "completed",
  ).length ?? 0
  const avgProgress = total > 0
    ? Math.round((participants?.reduce((sum, p) => sum + p.progress_pct, 0) ?? 0) / total)
    : 0
  const scores = participants?.filter((p) => p.score !== null).map((p) => p.score!) ?? []
  const avgScore = scores.length > 0
    ? Math.round(scores.reduce((s, v) => s + v, 0) / scores.length)
    : null
  const totalViolations = participants?.reduce((s, p) => s + p.violation_count, 0) ?? 0
  const hintsTotal = participants?.reduce((s, p) => s + (p.hints_used ?? 0), 0) ?? 0

  const now = new Date()
  const startTime = session.actual_start_at ?? session.starts_at
  const durationSeconds = startTime
    ? Math.round((now.getTime() - new Date(startTime).getTime()) / 1000)
    : 0

  // Per-station summary
  const { data: stations } = await supabase
    .from("guided_session_stations")
    .select("station_index, type")
    .eq("session_id", id)
    .order("station_index", { ascending: true })

  const stationSummaries = (stations ?? []).map((station: any) => {
    const stationCompletedCount = (participants ?? []).filter((p) => {
      const sp = (p.station_progress as Record<string, any>) ?? {}
      return sp[station.station_index]?.completed_at != null
    }).length

    const stationProgressValues = (participants ?? []).map((p) => {
      const sp = (p.station_progress as Record<string, any>) ?? {}
      return sp[station.station_index]?.progress_pct ?? 0
    })

    const avgStationProgress = stationProgressValues.length > 0
      ? Math.round(stationProgressValues.reduce((a, b) => a + b, 0) / stationProgressValues.length)
      : 0

    return {
      station_index: station.station_index,
      station_type: station.type,
      avg_progress_pct: avgStationProgress,
      completion_count: stationCompletedCount,
    }
  })

  const summaryData = {
    total_participants: total,
    completed_count: completed,
    avg_progress_pct: avgProgress,
    avg_score: avgScore,
    total_violations: totalViolations,
    duration_seconds: durationSeconds,
    hints_total: hintsTotal,
    stations: stationSummaries.length > 0 ? stationSummaries : undefined,
  }

  // End the session — use 'completed' for new sessions
  const { data: updated, error } = await supabase
    .from("guided_sessions")
    .update({
      status: "completed",
      ended_at: now.toISOString(),
      actual_end_at: now.toISOString(),
      summary_data: summaryData,
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 })
  }

  // Mark all non-completed participants as completed
  await supabase
    .from("guided_session_participants")
    .update({ status: "completed", submitted_at: now.toISOString() })
    .eq("session_id", id)
    .in("status", ["lobby", "invited", "joined", "active"])

  return NextResponse.json({ session: updated, summary: summaryData })
}
