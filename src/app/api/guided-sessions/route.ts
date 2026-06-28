import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateJoinCode } from "@/lib/guided-learning-types"
import type { GuidedSessionType, GuidedSessionMode, GuidedSessionStatus } from "@/lib/guided-learning-types"

/**
 * POST /api/guided-sessions — Create a new guided learning session.
 * Teacher only. Supports both legacy single-task and multi-station sessions.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can create sessions" }, { status: 403 })
  }

  const body = await request.json()

  // Detect multi-station mode: if `stations` array is provided, use new flow
  const isMultiStation = Array.isArray(body.stations) && body.stations.length > 0

  // Generate unique join code with retry
  let joinCode = generateJoinCode()
  let retries = 0
  while (retries < 5) {
    const { data: existing } = await supabase
      .from("guided_sessions")
      .select("id")
      .eq("join_code", joinCode)
      .single()

    if (!existing) break
    joinCode = generateJoinCode()
    retries++
  }

  if (isMultiStation) {
    // ── Multi-station session creation ──────────────────────────────────────
    const {
      title,
      description,
      classroom_id,
      scheduled_start_at,
      duration_minutes,
      mode = "strict",
      status = "draft",
      settings = {},
      annotations_enabled = true,
      annotation_visibility = "collaborative",
      presence_enabled = true,
      stations,
      student_ids,
    } = body

    if (!title?.trim()) {
      return NextResponse.json({ error: "title is required" }, { status: 400 })
    }

    if (!duration_minutes || duration_minutes < 1 || duration_minutes > 480) {
      return NextResponse.json({ error: "duration_minutes must be between 1 and 480" }, { status: 400 })
    }

    // Validate status
    const validStatuses: GuidedSessionStatus[] = ["draft", "scheduled", "lobby"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "status must be draft, scheduled, or lobby" }, { status: 400 })
    }

    if (!["collaborative", "private_to_teacher"].includes(annotation_visibility)) {
      return NextResponse.json(
        { error: "annotation_visibility must be 'collaborative' or 'private_to_teacher'" },
        { status: 400 },
      )
    }

    // Insert session
    const { data: session, error: sessionError } = await supabase
      .from("guided_sessions")
      .insert({
        teacher_id: user.id,
        classroom_id: classroom_id ?? null,
        join_code: joinCode,
        type: "chapter" as GuidedSessionType, // default for multi-station
        time_limit_minutes: duration_minutes,
        mode,
        status,
        title,
        description: description ?? null,
        scheduled_start_at: scheduled_start_at ?? null,
        duration_minutes,
        settings,
        annotations_enabled: annotations_enabled !== false,
        annotation_visibility,
        presence_enabled: presence_enabled !== false,
        current_station_index: 0,
      })
      .select()
      .single()

    if (sessionError || !session) {
      console.error("Failed to create guided session:", sessionError)
      return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
    }

    // Insert stations
    const stationRows = stations.map((s: any, i: number) => ({
      session_id: session.id,
      station_index: s.station_index ?? i,
      type: s.type,
      title: s.title ?? null,
      book_id: s.book_id ?? null,
      chapter_start: s.chapter_start ?? null,
      chapter_end: s.chapter_end ?? null,
      section_range: s.section_range ?? null,
      quiz_id: s.quiz_id ?? null,
      teacher_quiz_id: s.teacher_quiz_id ?? null,
      quiz_config: s.quiz_config ?? null,
      reflection_prompt: s.reflection_prompt ?? null,
      min_words: s.min_words ?? null,
      target_minutes: s.target_minutes ?? 10,
      require_completion: s.require_completion ?? false,
    }))

    const { error: stationsError } = await supabase
      .from("guided_session_stations")
      .insert(stationRows)

    if (stationsError) {
      console.error("Failed to create stations:", stationsError)
      // Clean up the session
      await supabase.from("guided_sessions").delete().eq("id", session.id)
      return NextResponse.json({ error: "Failed to create stations" }, { status: 500 })
    }

    // Invite students if provided
    if (Array.isArray(student_ids) && student_ids.length > 0) {
      const participantRows = student_ids.map((studentId: string) => ({
        session_id: session.id,
        student_id: studentId,
        status: "invited",
        current_station_index: 0,
      }))

      await supabase.from("guided_session_participants").insert(participantRows)
    }

    // Fetch the full session with stations for the response
    const { data: fullSession } = await supabase
      .from("guided_sessions")
      .select("*, guided_session_stations(*)")
      .eq("id", session.id)
      .single()

    return NextResponse.json({
      session: {
        ...fullSession,
        stations: fullSession?.guided_session_stations ?? [],
      },
    })
  }

  // ── Legacy single-task session creation ──────────────────────────────────
  const {
    type,
    book_id,
    chapter_index,
    trial_id,
    time_limit_minutes,
    mode = "strict",
    classroom_id,
  } = body as {
    type?: GuidedSessionType
    book_id?: string
    chapter_index?: number
    trial_id?: string
    time_limit_minutes?: number
    mode?: GuidedSessionMode
    classroom_id?: string
  }

  if (!type || !["chapter", "trial"].includes(type)) {
    return NextResponse.json({ error: "type must be 'chapter' or 'trial'" }, { status: 400 })
  }

  if (type === "chapter" && !book_id) {
    return NextResponse.json({ error: "book_id required for chapter type" }, { status: 400 })
  }

  if (type === "trial" && !trial_id) {
    return NextResponse.json({ error: "trial_id required for trial type" }, { status: 400 })
  }

  if (!time_limit_minutes || time_limit_minutes < 1 || time_limit_minutes > 180) {
    return NextResponse.json({ error: "time_limit_minutes must be between 1 and 180" }, { status: 400 })
  }

  if (!["strict", "lenient"].includes(mode)) {
    return NextResponse.json({ error: "mode must be 'strict' or 'lenient'" }, { status: 400 })
  }

  const { data: session, error } = await supabase
    .from("guided_sessions")
    .insert({
      teacher_id: user.id,
      classroom_id: classroom_id ?? null,
      join_code: joinCode,
      type,
      book_id: type === "chapter" ? book_id : null,
      chapter_index: type === "chapter" ? (chapter_index ?? 0) : null,
      trial_id: type === "trial" ? trial_id : null,
      time_limit_minutes,
      mode,
      status: "lobby",
    })
    .select()
    .single()

  if (error) {
    console.error("Failed to create guided session:", error)
    return NextResponse.json({ error: "Failed to create session" }, { status: 500 })
  }

  return NextResponse.json({ session })
}
