import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { applyMutation, loadOwnedPlan, mutationSchema } from "@/lib/semester-plan/mutations"

/**
 * POST /api/classroom/semester-plan/[planId]/mutate
 *
 * Teacher-only structured edits to a plan board: update/add/delete an item,
 * edit a week, or reorder weeks. Reading-scope changes re-pace in code.
 */
export async function POST(request: Request, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const plan = await loadOwnedPlan(supabase, planId, user.id)
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })
  if (plan.status !== "draft") {
    return NextResponse.json({ error: "Only draft plans can be edited" }, { status: 409 })
  }

  const parsed = mutationSchema.safeParse(await request.json())
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request", details: parsed.error.flatten() }, { status: 400 })
  }

  const result = await applyMutation(supabase, plan, parsed.data)
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status })
  }
  return NextResponse.json({ ok: true })
}
