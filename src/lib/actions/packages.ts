"use server"

// Assignment packages + student gradebook actions.
//
// An assignment "package" bundles several assignment_items (readings, quizzes,
// writing prompts…) under one assignment row. Per-item completion lives in
// assignment_item_progress (RLS: students write only their own rows; staff
// read the class). Grade math lives in ONE place — the classroom_grade_summary
// SQL function — never re-derived in TypeScript.

import { z } from "zod"
import {
  type ActionResult,
  fail,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()

// ── Types mirrored from the migration ─────────────────────────────────────

export interface AssignmentItemRow {
  id: string
  assignment_id: string
  kind: string
  title: string
  book_id: string | null
  chapter_start: number | null
  chapter_end: number | null
  quiz_id: string | null
  platform_quiz_difficulty: string | null
  prompt: string | null
  is_required: boolean
  sort_order: number
}

export interface ItemProgressRow {
  assignment_item_id: string
  status: "not_started" | "in_progress" | "complete"
  completed_at: string | null
  score: number | null
}

export interface GradeSummaryRow {
  category_id: string | null
  category_name: string
  weight: number | null
  normalized_weight: number | null
  earned: number | null
  possible: number | null
  pct: number | null
  graded_count: number
  included: boolean
}

// ── Items + my progress for a set of assignments ──────────────────────────

export async function listAssignmentItemsWithProgress(
  assignmentIds: string[],
): Promise<
  ActionResult<{
    items: AssignmentItemRow[]
    progress: ItemProgressRow[]
  }>
> {
  const parsed = z.array(Uuid).min(1).max(200).safeParse(assignmentIds)
  if (!parsed.success) return fail("Invalid assignment ids.")
  try {
    const { supabase, user } = await requireUser()
    const { data: items, error } = await supabase
      .from("assignment_items")
      .select(
        "id, assignment_id, kind, title, book_id, chapter_start, chapter_end, quiz_id, platform_quiz_difficulty, prompt, is_required, sort_order",
      )
      .in("assignment_id", parsed.data)
      .order("sort_order", { ascending: true })
    if (error) return fail(error.message)

    const itemIds = (items ?? []).map((i: AssignmentItemRow) => i.id)
    let progress: ItemProgressRow[] = []
    if (itemIds.length > 0) {
      const { data: prog, error: pErr } = await supabase
        .from("assignment_item_progress")
        .select("assignment_item_id, status, completed_at, score")
        .eq("student_id", user.id)
        .in("assignment_item_id", itemIds)
      if (pErr) return fail(pErr.message)
      progress = (prog ?? []) as ItemProgressRow[]
    }
    return ok({ items: (items ?? []) as AssignmentItemRow[], progress })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Per-item progress upsert (student, own rows only via RLS) ─────────────

const SetProgressInput = z.object({
  assignmentItemId: Uuid,
  status: z.enum(["not_started", "in_progress", "complete"]),
})

export async function setItemProgress(
  input: z.input<typeof SetProgressInput>,
): Promise<ActionResult<{ status: string }>> {
  const parsed = SetProgressInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  const { assignmentItemId, status } = parsed.data
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase.from("assignment_item_progress").upsert(
      {
        assignment_item_id: assignmentItemId,
        student_id: user.id,
        status,
        completed_at: status === "complete" ? new Date().toISOString() : null,
      },
      { onConflict: "assignment_item_id,student_id" },
    )
    if (error) return fail(error.message)
    return ok({ status })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Weighted grade summary (single source of truth = SQL function) ────────

export async function getMyGradeSummary(
  classroomId: string,
): Promise<ActionResult<GradeSummaryRow[]>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom id.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase.rpc("classroom_grade_summary", {
      p_classroom: parsed.data,
      p_student: user.id,
    })
    if (error) return fail(error.message)
    return ok((data ?? []) as GradeSummaryRow[])
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Syllabus (active term plan → units → packages) ────────────────────────
// RLS already scopes what a student may see: only ACTIVE plans of their class,
// and only packages that have been published to a real assignment.

export interface SyllabusUnit {
  id: string
  title: string
  description: string | null
  starts_on: string | null
  ends_on: string | null
  book_id: string | null
  sort_order: number
  packages: SyllabusPackage[]
}

export interface SyllabusPackage {
  id: string
  title: string
  due_at: string | null
  points: number
  published_assignment_id: string | null
  sort_order: number
}

export async function getClassSyllabus(classroomId: string): Promise<
  ActionResult<{
    plan: {
      id: string
      title: string
      term_start: string | null
      term_end: string | null
    } | null
    units: SyllabusUnit[]
  }>
> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom id.")
  try {
    const { supabase } = await requireUser()
    const { data: plan, error: planErr } = await supabase
      .from("semester_plans")
      .select("id, title, term_start, term_end")
      .eq("class_id", parsed.data)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (planErr) return fail(planErr.message)
    if (!plan) return ok({ plan: null, units: [] })

    const { data: units, error: uErr } = await supabase
      .from("plan_units")
      .select("id, title, description, starts_on, ends_on, book_id, sort_order")
      .eq("plan_id", plan.id)
      .order("sort_order", { ascending: true })
    if (uErr) return fail(uErr.message)

    const unitIds = (units ?? []).map((u: { id: string }) => u.id)
    let packages: (SyllabusPackage & { unit_id: string })[] = []
    if (unitIds.length > 0) {
      const { data: pkgs, error: pkErr } = await supabase
        .from("plan_packages")
        .select(
          "id, unit_id, title, due_at, points, published_assignment_id, sort_order",
        )
        .in("unit_id", unitIds)
        .order("sort_order", { ascending: true })
      if (pkErr) return fail(pkErr.message)
      packages = (pkgs ?? []) as (SyllabusPackage & { unit_id: string })[]
    }

    const byUnit = new Map<string, SyllabusPackage[]>()
    for (const p of packages) {
      const list = byUnit.get(p.unit_id) ?? []
      list.push(p)
      byUnit.set(p.unit_id, list)
    }
    return ok({
      plan,
      units: (units ?? []).map((u: Omit<SyllabusUnit, "packages">) => ({
        ...u,
        packages: byUnit.get(u.id) ?? [],
      })),
    })
  } catch (e) {
    return fail((e as Error).message)
  }
}
