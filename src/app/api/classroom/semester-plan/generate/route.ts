import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { planSetupSchema } from "@/lib/semester-plan/types"
import { assembleCandidates } from "@/lib/semester-plan/catalog"
import { generateSemesterPlan } from "@/lib/semester-plan/generate"
import { materializePlan } from "@/lib/semester-plan/persist"
import { hasActiveSchoolEntitlement } from "@/lib/entitlements/server"

export const maxDuration = 120

/**
 * POST /api/classroom/semester-plan/generate
 *
 * Teacher-only. Virgil drafts a full term plan grounded ONLY in a pre-filtered
 * candidate catalog (metadata, never full text). Pacing is computed in code on
 * persist. Returns the new draft plan id.
 */
export async function POST(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()
  if (profile?.role !== "teacher") {
    return NextResponse.json({ error: "Only teachers can plan semesters" }, { status: 403 })
  }

  // The AI semester planner is a paid educator tool — gate behind School.
  if (!(await hasActiveSchoolEntitlement(user.id))) {
    return NextResponse.json(
      { error: "The semester planner requires an active School plan." },
      { status: 403 },
    )
  }

  const parsed = planSetupSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten() },
      { status: 400 },
    )
  }
  const setup = parsed.data

  // Authorize the class (if attaching one): the teacher must own it.
  if (setup.classId) {
    const { data: cls } = await supabase
      .from("classrooms")
      .select("teacher_id")
      .eq("id", setup.classId)
      .single()
    if (!cls || cls.teacher_id !== user.id) {
      return NextResponse.json({ error: "Not your classroom" }, { status: 403 })
    }
  }

  const candidates = await assembleCandidates(supabase, setup)
  if (candidates.length === 0) {
    return NextResponse.json(
      { error: "no_candidates", message: "No catalog books match these filters. Loosen the tradition/difficulty filters." },
      { status: 422 },
    )
  }

  let result
  try {
    result = await generateSemesterPlan({ setup, candidates })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed"
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 502
    console.error("Virgil semester planning failed:", message)
    return NextResponse.json({ error: "generation_failed", message }, { status })
  }

  console.log(
    `[virgil-plan] weeks=${setup.weeks} model=${result.model} ` +
      `in=${result.usage.input_tokens} out=${result.usage.output_tokens} ` +
      `cache_read=${result.usage.cache_read ?? 0} cache_write=${result.usage.cache_write ?? 0} ` +
      `candidates=${candidates.length} invalid_ids=${result.invalidBookIds.length}`,
  )

  const materialized = await materializePlan({
    supabase,
    teacherId: user.id,
    setup,
    plan: result.plan,
    candidates,
    model: result.model,
  })
  if ("error" in materialized) {
    return NextResponse.json({ error: "persist_failed", message: materialized.error }, { status: 500 })
  }

  return NextResponse.json({
    planId: materialized.planId,
    model: result.model,
    invalidBookIds: result.invalidBookIds,
  })
}
