import { NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"
import { assembleCandidates } from "@/lib/semester-plan/catalog"
import { generateSemesterPlan } from "@/lib/semester-plan/generate"
import { hydratePlan, rematerializePlan } from "@/lib/semester-plan/persist"
import { loadOwnedPlan, planToGenerated, setupFromPlanRow } from "@/lib/semester-plan/mutations"

export const maxDuration = 120

const reviseSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("revise"), instruction: z.string().min(1).max(1000) }),
  z.object({ action: z.literal("regenerate_week"), weekIndex: z.number().int().min(1), instruction: z.string().max(1000).optional() }),
])

/**
 * POST /api/classroom/semester-plan/[planId]/revise
 *
 * Teacher-only. Re-asks Virgil to revise a draft plan — either applying a
 * free-text instruction across the term, or regenerating a single week while
 * holding the rest stable. The catalog stays the same (cached) and pacing is
 * recomputed in code on persist. Draft-only; provisioned plans are frozen.
 */
export async function POST(request: Request, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const planRow = await loadOwnedPlan(supabase, planId, user.id)
  if (!planRow) return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  if (planRow.status !== "draft") {
    return NextResponse.json({ error: "Only draft plans can be revised" }, { status: 409 })
  }

  const parsed = reviseSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }

  const hydrated = await hydratePlan(supabase, planId)
  if (!hydrated) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  const setup = setupFromPlanRow(planRow)
  const candidates = await assembleCandidates(supabase, setup)
  if (candidates.length === 0) {
    return NextResponse.json({ error: "no_candidates" }, { status: 422 })
  }

  const instruction =
    parsed.data.action === "revise"
      ? parsed.data.instruction
      : `Regenerate ONLY week ${parsed.data.weekIndex}, keeping every other week exactly as-is.` +
        (parsed.data.instruction ? ` Guidance: ${parsed.data.instruction}` : "")

  let result
  try {
    result = await generateSemesterPlan({
      setup,
      candidates,
      revise: { current: planToGenerated(hydrated), instruction },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Revision failed"
    const status = message.includes("ANTHROPIC_API_KEY") ? 503 : 502
    console.error("Virgil plan revise failed:", message)
    return NextResponse.json({ error: "revision_failed", message }, { status })
  }

  const re = await rematerializePlan({
    supabase,
    planId,
    termStart: setup.termStart,
    plan: result.plan,
    candidates,
    model: result.model,
  })
  if ("error" in re) {
    return NextResponse.json({ error: "persist_failed", message: re.error }, { status: 500 })
  }

  return NextResponse.json({ ok: true, model: result.model, invalidBookIds: result.invalidBookIds })
}
