import "server-only"

import { planSetupSchema } from "@/lib/semester-plan/types"
import { assembleCandidates } from "@/lib/semester-plan/catalog"
import { generateSemesterPlan } from "@/lib/semester-plan/generate"
import type { VirgilDB } from "@/lib/virgil/profile"

export interface CreateSemesterPlanInput {
  weeks: number
  level: string
  theme?: string
  constraints?: string
}

/**
 * create_semester_plan — read-only. Buckets content-complete books into `weeks`
 * via the existing planning pipeline and returns the structured plan for
 * display. No DB writes this pass — this is a preview, not a saved plan.
 */
export async function executeCreateSemesterPlan(
  supabase: VirgilDB,
  raw: CreateSemesterPlanInput,
): Promise<Record<string, unknown>> {
  const weeks = Math.max(1, Math.min(40, Math.round(raw.weeks)))

  const setupParsed = planSetupSchema.safeParse({
    title: raw.theme?.trim() || `${weeks}-week plan`,
    weeks,
    cadence: { meetingsPerWeek: 3 },
    level: raw.level?.slice(0, 120),
    goals: { themes: raw.theme?.trim() ? [raw.theme.trim()] : [], objectives: [] },
    constraints: { requiredBookIds: [], breakWeeks: [] },
    focus: raw.constraints?.slice(0, 1000),
    traditions: [],
    ambition: weeks >= 16 ? "ambitious" : "standard",
  })
  if (!setupParsed.success) {
    return { status: "error", message: "Could not build a valid plan setup from those inputs." }
  }
  const setup = setupParsed.data

  // Content-gate: only sequence books that have readable chapters.
  const candidates = (await assembleCandidates(supabase, setup)).filter((c) => c.has_chapter_content)
  if (candidates.length === 0) {
    return { status: "empty", message: "No readable books are available to build a plan from yet." }
  }

  const gen = await generateSemesterPlan({ setup, candidates })

  return {
    status: "ok",
    note: "Preview only — this plan is not saved. The teacher can build it for real in the semester planner.",
    weeks: gen.plan.weeks,
    level: raw.level ?? null,
    theme: raw.theme ?? null,
  }
}
