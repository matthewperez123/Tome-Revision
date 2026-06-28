import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { assembleCandidates } from "@/lib/semester-plan/catalog"
import { loadOwnedPlan, setupFromPlanRow } from "@/lib/semester-plan/mutations"

/**
 * GET /api/classroom/semester-plan/[planId]/candidates
 *
 * The metadata-only catalog the plan was drafted from — drives the book-swap
 * picker on the editable board. Teacher-only; never returns book text.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const plan = await loadOwnedPlan(supabase, planId, user.id)
  if (!plan) return NextResponse.json({ error: "Plan not found" }, { status: 404 })

  const candidates = await assembleCandidates(supabase, setupFromPlanRow(plan))
  return NextResponse.json({ candidates })
}
