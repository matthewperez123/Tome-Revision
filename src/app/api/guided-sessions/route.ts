import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateJoinCode } from "@/lib/guided-learning-types"
import type { GuidedSessionType, GuidedSessionMode } from "@/lib/guided-learning-types"

/**
 * POST /api/guided-sessions — Create a new guided learning session.
 * Teacher only.
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

  // Validate required fields
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
