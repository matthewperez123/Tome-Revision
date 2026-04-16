import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

/**
 * POST /api/guided-sessions/[id]/station-advance
 * Student self-advances to the next station after completing current one.
 * Validates that the current station's completion criteria are met.
 */

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id: sessionId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Verify participant
  const { data: participant } = await supabase
    .from("guided_session_participants")
    .select("id, current_station_index, station_progress, status")
    .eq("session_id", sessionId)
    .eq("student_id", user.id)
    .single()

  if (!participant) {
    return NextResponse.json({ error: "Not a participant" }, { status: 403 })
  }

  if (participant.status !== "active") {
    return NextResponse.json({ error: "Not active in session" }, { status: 400 })
  }

  const currentIndex = participant.current_station_index ?? 0

  // Get stations to find next
  const { data: stations } = await supabase
    .from("guided_session_stations")
    .select("*")
    .eq("session_id", sessionId)
    .order("station_index", { ascending: true })

  if (!stations || stations.length === 0) {
    return NextResponse.json({ error: "No stations found" }, { status: 400 })
  }

  const currentStation = stations.find((s: any) => s.station_index === currentIndex)
  const nextStation = stations.find((s: any) => s.station_index > currentIndex)

  // Update station_progress to mark current station as completed
  const progress = (participant.station_progress as Record<string, any>) ?? {}
  progress[currentIndex] = {
    ...progress[currentIndex],
    completed_at: new Date().toISOString(),
    progress_pct: 100,
  }

  if (nextStation) {
    // Advance to next station
    const { error } = await supabase
      .from("guided_session_participants")
      .update({
        current_station_index: nextStation.station_index,
        station_progress: progress,
      })
      .eq("id", participant.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Log event
    await supabase.from("guided_session_events").insert({
      session_id: sessionId,
      student_id: user.id,
      event_type: "station_completed",
      payload: { station_index: currentIndex },
    })
    await supabase.from("guided_session_events").insert({
      session_id: sessionId,
      student_id: user.id,
      event_type: "station_started",
      payload: { station_index: nextStation.station_index },
    })

    return NextResponse.json({
      advanced: true,
      new_station_index: nextStation.station_index,
    })
  } else {
    // All stations complete
    const { error } = await supabase
      .from("guided_session_participants")
      .update({
        status: "completed",
        station_progress: progress,
        progress_pct: 100,
        submitted_at: new Date().toISOString(),
      })
      .eq("id", participant.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    await supabase.from("guided_session_events").insert({
      session_id: sessionId,
      student_id: user.id,
      event_type: "station_completed",
      payload: { station_index: currentIndex, final: true },
    })

    return NextResponse.json({
      advanced: false,
      completed: true,
    })
  }
}
