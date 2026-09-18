"use server"

// Teacher semester planner — terms, units, grading categories, packages,
// auto-pacing, templates, and publish-to-assignments.
//
// The planner is the SOURCE: publishing a package creates (or re-syncs) a real
// assignment + its assignment_items; students only ever see published work.
// Reads go through the teacher's RLS (semester_plans.teacher_id = auth.uid()
// owns every child row). Mutations that create assignments are additionally
// gated behind the paid School entitlement, matching createAssignment.

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { assignmentReaderHref } from "@/lib/assignments/links"
import {
  type ActionResult,
  createAdminClient,
  fail,
  notify,
  ok,
  requireSchoolTools,
  requireUser,
  type SupaClient,
} from "./_shared"

const Uuid = z.string().uuid()
const IsoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD")

// ── Row shapes (mirror the 20260917 migration) ────────────────────────────

export interface TermPlanRow {
  id: string
  class_id: string | null
  title: string
  term_start: string | null
  term_end: string | null
  status: "draft" | "active" | "archived"
  meeting_days: number[]
  no_class_dates: string[]
}

export interface CategoryRow {
  id: string
  plan_id: string
  name: string
  weight: number
  sort_order: number
  drop_lowest: number
}

export interface UnitRow {
  id: string
  plan_id: string
  title: string
  description: string | null
  starts_on: string | null
  ends_on: string | null
  sort_order: number
  book_id: string | null
}

export interface PlanItemRow {
  id: string
  unit_id: string | null
  sort_order: number
  type: string
  book_id: string | null
  chapter_start: number | null
  chapter_end: number | null
  title: string
  description: string | null
  prompt: string | null
  is_required: boolean
  due_date: string | null
  difficulty: string | null
}

export interface PackageRow {
  id: string
  unit_id: string
  title: string
  due_at: string | null
  release_at: string | null
  points: number
  grading_category_id: string | null
  late_policy: { accept_late: boolean; penalty_pct_per_day: number; cutoff_days: number | null }
  sort_order: number
  published_assignment_id: string | null
}

export interface PackageItemLink {
  package_id: string
  plan_item_id: string
  sort_order: number
}

export interface TemplateRow {
  id: string
  name: string
  is_shared: boolean
  created_at: string
}

export interface PlannerState {
  plan: TermPlanRow | null
  categories: CategoryRow[]
  units: UnitRow[]
  items: PlanItemRow[]
  packages: PackageRow[]
  packageItems: PackageItemLink[]
}

const PLAN_COLS = "id, class_id, title, term_start, term_end, status, meeting_days, no_class_dates"
const ITEM_COLS =
  "id, unit_id, sort_order, type, book_id, chapter_start, chapter_end, title, description, prompt, is_required, due_date, difficulty"
const PKG_COLS =
  "id, unit_id, title, due_at, release_at, points, grading_category_id, late_policy, sort_order, published_assignment_id"

// ── Read: full planner state for a classroom ──────────────────────────────

export async function getPlannerState(
  classroomId: string,
): Promise<ActionResult<PlannerState>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom id.")
  try {
    const { supabase, user } = await requireUser()
    // Most-recent plan the teacher owns for this class (draft first, so an
    // in-progress term edits ahead of an older active one).
    const { data: plan, error } = await supabase
      .from("semester_plans")
      .select(PLAN_COLS)
      .eq("class_id", parsed.data)
      .eq("teacher_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) return fail(error.message)
    if (!plan) {
      return ok({ plan: null, categories: [], units: [], items: [], packages: [], packageItems: [] })
    }

    const [cats, units] = await Promise.all([
      supabase
        .from("grading_categories")
        .select("id, plan_id, name, weight, sort_order, drop_lowest")
        .eq("plan_id", plan.id)
        .order("sort_order"),
      supabase
        .from("plan_units")
        .select("id, plan_id, title, description, starts_on, ends_on, sort_order, book_id")
        .eq("plan_id", plan.id)
        .order("sort_order"),
    ])
    if (cats.error) return fail(cats.error.message)
    if (units.error) return fail(units.error.message)

    const unitIds = (units.data ?? []).map((u: { id: string }) => u.id)
    let items: PlanItemRow[] = []
    let packages: PackageRow[] = []
    let packageItems: PackageItemLink[] = []
    if (unitIds.length > 0) {
      const [it, pk] = await Promise.all([
        supabase
          .from("semester_plan_items")
          .select(ITEM_COLS)
          .in("unit_id", unitIds)
          .order("sort_order"),
        supabase.from("plan_packages").select(PKG_COLS).in("unit_id", unitIds).order("sort_order"),
      ])
      if (it.error) return fail(it.error.message)
      if (pk.error) return fail(pk.error.message)
      items = (it.data ?? []) as PlanItemRow[]
      packages = (pk.data ?? []) as PackageRow[]
      const pkgIds = packages.map((p) => p.id)
      if (pkgIds.length > 0) {
        const { data: links, error: lErr } = await supabase
          .from("plan_package_items")
          .select("package_id, plan_item_id, sort_order")
          .in("package_id", pkgIds)
          .order("sort_order")
        if (lErr) return fail(lErr.message)
        packageItems = (links ?? []) as PackageItemLink[]
      }
    }

    return ok({ plan: plan as TermPlanRow, categories: (cats.data ?? []) as CategoryRow[], units: (units.data ?? []) as UnitRow[], items, packages, packageItems })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Term plan ─────────────────────────────────────────────────────────────

const CreateTermInput = z.object({
  classroomId: Uuid,
  title: z.string().min(1).max(200),
  termStart: IsoDate,
  termEnd: IsoDate,
  meetingDays: z.array(z.number().int().min(0).max(6)).default([1, 3, 5]),
  noClassDates: z.array(IsoDate).default([]),
})

export async function createTermPlan(
  input: z.input<typeof CreateTermInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateTermInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  if (i.termEnd <= i.termStart) return fail("Term end must be after term start.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("semester_plans")
      .insert({
        teacher_id: user.id,
        class_id: i.classroomId,
        title: i.title,
        term_start: i.termStart,
        term_end: i.termEnd,
        meeting_days: i.meetingDays,
        no_class_dates: i.noClassDates,
        status: "draft",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/classroom/${i.classroomId}/planner`)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

const UpdateTermInput = z.object({
  planId: Uuid,
  title: z.string().min(1).max(200).optional(),
  termStart: IsoDate.optional(),
  termEnd: IsoDate.optional(),
  meetingDays: z.array(z.number().int().min(0).max(6)).optional(),
  noClassDates: z.array(IsoDate).optional(),
  status: z.enum(["draft", "active", "archived"]).optional(),
})

export async function updateTermPlan(
  input: z.input<typeof UpdateTermInput>,
): Promise<ActionResult<void>> {
  const parsed = UpdateTermInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase } = await requireUser()
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (i.title !== undefined) patch.title = i.title
    if (i.termStart !== undefined) patch.term_start = i.termStart
    if (i.termEnd !== undefined) patch.term_end = i.termEnd
    if (i.meetingDays !== undefined) patch.meeting_days = i.meetingDays
    if (i.noClassDates !== undefined) patch.no_class_dates = i.noClassDates
    if (i.status !== undefined) patch.status = i.status
    const { error } = await supabase.from("semester_plans").update(patch).eq("id", i.planId)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Grading categories ────────────────────────────────────────────────────

const UpsertCategoryInput = z.object({
  id: Uuid.optional(),
  planId: Uuid,
  name: z.string().min(1).max(100),
  weight: z.number().min(0).max(100),
  dropLowest: z.number().int().min(0).default(0),
  sortOrder: z.number().int().default(0),
})

export async function upsertCategory(
  input: z.input<typeof UpsertCategoryInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = UpsertCategoryInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase } = await requireUser()
    const row = {
      plan_id: i.planId,
      name: i.name,
      weight: i.weight,
      drop_lowest: i.dropLowest,
      sort_order: i.sortOrder,
    }
    const q = i.id
      ? supabase.from("grading_categories").update(row).eq("id", i.id).select("id").single()
      : supabase.from("grading_categories").insert(row).select("id").single()
    const { data, error } = await q
    if (error) return fail(error.message)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deleteCategory(id: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(id)
  if (!parsed.success) return fail("Invalid category id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.from("grading_categories").delete().eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Units ─────────────────────────────────────────────────────────────────

const UpsertUnitInput = z.object({
  id: Uuid.optional(),
  planId: Uuid,
  title: z.string().min(1).max(200),
  description: z.string().max(2000).nullish(),
  startsOn: IsoDate.nullish(),
  endsOn: IsoDate.nullish(),
  bookId: z.string().max(120).nullish(),
  sortOrder: z.number().int().default(0),
})

export async function upsertUnit(
  input: z.input<typeof UpsertUnitInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = UpsertUnitInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase } = await requireUser()
    const row = {
      plan_id: i.planId,
      title: i.title,
      description: i.description ?? null,
      starts_on: i.startsOn ?? null,
      ends_on: i.endsOn ?? null,
      book_id: i.bookId || null,
      sort_order: i.sortOrder,
      updated_at: new Date().toISOString(),
    }
    const q = i.id
      ? supabase.from("plan_units").update(row).eq("id", i.id).select("id").single()
      : supabase.from("plan_units").insert(row).select("id").single()
    const { data, error } = await q
    if (error) return fail(error.message)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deleteUnit(id: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(id)
  if (!parsed.success) return fail("Invalid unit id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.from("plan_units").delete().eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Plan items (unit-scoped) ──────────────────────────────────────────────

const ITEM_TYPES = [
  "reading",
  "quiz",
  "essay",
  "discussion",
  "assessment",
  "note",
  "custom_reading",
] as const

const UpsertItemInput = z.object({
  id: Uuid.optional(),
  unitId: Uuid,
  type: z.enum(ITEM_TYPES),
  title: z.string().min(1).max(300),
  description: z.string().max(4000).nullish(),
  prompt: z.string().max(8000).nullish(),
  bookId: z.string().max(120).nullish(),
  chapterStart: z.number().int().min(0).nullish(),
  chapterEnd: z.number().int().min(0).nullish(),
  difficulty: z.enum(["apprentice", "scholar", "master"]).nullish(),
  isRequired: z.boolean().default(true),
  dueDate: IsoDate.nullish(),
  sortOrder: z.number().int().default(0),
  /** Attach the item to a package (replaces any prior link for this item). */
  packageId: Uuid.nullish(),
})

export async function upsertPlanItem(
  input: z.input<typeof UpsertItemInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = UpsertItemInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase } = await requireUser()
    const row = {
      unit_id: i.unitId,
      type: i.type,
      title: i.title,
      description: i.description ?? null,
      prompt: i.prompt ?? null,
      book_id: i.bookId || null,
      chapter_start: i.chapterStart ?? null,
      chapter_end: i.chapterEnd ?? i.chapterStart ?? null,
      difficulty: i.difficulty ?? null,
      is_required: i.isRequired,
      due_date: i.dueDate ?? null,
      sort_order: i.sortOrder,
      updated_at: new Date().toISOString(),
    }
    const q = i.id
      ? supabase.from("semester_plan_items").update(row).eq("id", i.id).select("id").single()
      : supabase.from("semester_plan_items").insert(row).select("id").single()
    const { data, error } = await q
    if (error) return fail(error.message)

    if (i.packageId !== undefined) {
      // Re-link: an item belongs to at most one package in this UI.
      const { error: delErr } = await supabase
        .from("plan_package_items")
        .delete()
        .eq("plan_item_id", data.id)
      if (delErr) return fail(delErr.message)
      if (i.packageId) {
        const { error: linkErr } = await supabase.from("plan_package_items").insert({
          package_id: i.packageId,
          plan_item_id: data.id,
          sort_order: i.sortOrder,
        })
        if (linkErr) return fail(linkErr.message)
      }
    }
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deletePlanItem(id: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(id)
  if (!parsed.success) return fail("Invalid item id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.from("semester_plan_items").delete().eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Packages ──────────────────────────────────────────────────────────────

const UpsertPackageInput = z.object({
  id: Uuid.optional(),
  unitId: Uuid,
  title: z.string().min(1).max(200),
  dueAt: z.string().datetime({ offset: true }).nullish(),
  releaseAt: z.string().datetime({ offset: true }).nullish(),
  points: z.number().int().min(0).default(100),
  gradingCategoryId: Uuid.nullish(),
  latePolicy: z
    .object({
      accept_late: z.boolean(),
      penalty_pct_per_day: z.number().min(0).max(100),
      cutoff_days: z.number().int().min(0).nullable(),
    })
    .optional(),
  sortOrder: z.number().int().default(0),
})

export async function upsertPackage(
  input: z.input<typeof UpsertPackageInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = UpsertPackageInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase } = await requireUser()
    const row: Record<string, unknown> = {
      unit_id: i.unitId,
      title: i.title,
      due_at: i.dueAt ?? null,
      release_at: i.releaseAt ?? null,
      points: i.points,
      grading_category_id: i.gradingCategoryId ?? null,
      sort_order: i.sortOrder,
      updated_at: new Date().toISOString(),
    }
    if (i.latePolicy) row.late_policy = i.latePolicy
    const q = i.id
      ? supabase.from("plan_packages").update(row).eq("id", i.id).select("id").single()
      : supabase.from("plan_packages").insert(row).select("id").single()
    const { data, error } = await q
    if (error) return fail(error.message)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deletePackage(id: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(id)
  if (!parsed.success) return fail("Invalid package id.")
  try {
    const { supabase } = await requireUser()
    // Refuse to delete a published package (its assignment would orphan);
    // unpublish/close the assignment first.
    const { data: pkg, error: loadErr } = await supabase
      .from("plan_packages")
      .select("id, published_assignment_id")
      .eq("id", parsed.data)
      .single()
    if (loadErr) return fail(loadErr.message)
    if (pkg.published_assignment_id) {
      return fail("This package is published. Close its assignment before deleting.")
    }
    const { error } = await supabase.from("plan_packages").delete().eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Auto-pace: distribute item due dates across the unit's meeting days ───

function meetingDatesBetween(
  start: string,
  end: string,
  meetingDays: number[],
  noClassDates: string[],
): string[] {
  const out: string[] = []
  const skip = new Set(noClassDates)
  const days = meetingDays.length > 0 ? new Set(meetingDays) : new Set([0, 1, 2, 3, 4, 5, 6])
  const cur = new Date(`${start}T00:00:00Z`)
  const stop = new Date(`${end}T00:00:00Z`)
  while (cur <= stop) {
    const iso = cur.toISOString().slice(0, 10)
    if (days.has(cur.getUTCDay()) && !skip.has(iso)) out.push(iso)
    cur.setUTCDate(cur.getUTCDate() + 1)
  }
  return out
}

/**
 * Evenly spread the unit's items (by sort_order) across the unit's meeting
 * days, writing due_date on each item. Pure date math — no AI.
 */
export async function autoPaceUnit(unitId: string): Promise<ActionResult<{ paced: number }>> {
  const parsed = Uuid.safeParse(unitId)
  if (!parsed.success) return fail("Invalid unit id.")
  try {
    const { supabase } = await requireUser()
    const { data: unit, error: uErr } = await supabase
      .from("plan_units")
      .select("id, plan_id, starts_on, ends_on")
      .eq("id", parsed.data)
      .single()
    if (uErr) return fail(uErr.message)
    if (!unit.starts_on || !unit.ends_on) return fail("Set the unit's start and end dates first.")

    const { data: plan, error: pErr } = await supabase
      .from("semester_plans")
      .select("meeting_days, no_class_dates")
      .eq("id", unit.plan_id)
      .single()
    if (pErr) return fail(pErr.message)

    const { data: items, error: iErr } = await supabase
      .from("semester_plan_items")
      .select("id, sort_order")
      .eq("unit_id", unit.id)
      .order("sort_order")
    if (iErr) return fail(iErr.message)
    const list = items ?? []
    if (list.length === 0) return ok({ paced: 0 })

    const dates = meetingDatesBetween(
      unit.starts_on,
      unit.ends_on,
      (plan.meeting_days ?? []) as number[],
      (plan.no_class_dates ?? []) as string[],
    )
    if (dates.length === 0) return fail("No meeting days fall inside this unit's date range.")

    for (let k = 0; k < list.length; k++) {
      // Spread indices proportionally across the available meeting dates,
      // landing the last item on the unit's final meeting day.
      const di =
        list.length === 1
          ? dates.length - 1
          : Math.round((k / (list.length - 1)) * (dates.length - 1))
      const { error } = await supabase
        .from("semester_plan_items")
        .update({ due_date: dates[di], updated_at: new Date().toISOString() })
        .eq("id", list[k].id)
      if (error) return fail(error.message)
    }
    return ok({ paced: list.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Publish: package → real assignment + assignment_items ─────────────────

/** Map a plan-item type onto an assignment_items.kind value. */
function itemKind(type: string): string {
  switch (type) {
    case "reading":
    case "custom_reading":
      return "reading"
    case "quiz":
      return "quiz"
    case "assessment":
      return "assessment"
    case "essay":
      return "writing"
    case "discussion":
      return "discussion"
    default:
      return "note"
  }
}

/**
 * Publish (or re-publish) a package. Creates the assignment on first publish;
 * afterwards syncs title/due/points/category/late-policy and rebuilds the
 * assignment_items from the current package contents. Seeds a submission row
 * per enrolled student and notifies on FIRST publish only.
 */
export async function publishPackage(
  packageId: string,
): Promise<ActionResult<{ assignmentId: string; students: number }>> {
  const parsed = Uuid.safeParse(packageId)
  if (!parsed.success) return fail("Invalid package id.")
  try {
    const gate = await requireSchoolTools()
    if (!gate.ok) return fail(gate.error)
    const { supabase, user } = gate

    // Load package → unit → plan (RLS: only the owning teacher can see these).
    const { data: pkg, error: pkErr } = await supabase
      .from("plan_packages")
      .select(PKG_COLS)
      .eq("id", parsed.data)
      .single()
    if (pkErr || !pkg) return fail(pkErr?.message ?? "Package not found.")
    const { data: unit, error: uErr } = await supabase
      .from("plan_units")
      .select("id, plan_id")
      .eq("id", pkg.unit_id)
      .single()
    if (uErr) return fail(uErr.message)
    const { data: plan, error: plErr } = await supabase
      .from("semester_plans")
      .select("id, class_id, teacher_id")
      .eq("id", unit.plan_id)
      .single()
    if (plErr) return fail(plErr.message)
    if (plan.teacher_id !== user.id) return fail("Only the plan owner can publish.")
    if (!plan.class_id) return fail("This plan is not linked to a classroom.")

    // Package contents (ordered).
    const { data: links, error: lErr } = await supabase
      .from("plan_package_items")
      .select("plan_item_id, sort_order")
      .eq("package_id", pkg.id)
      .order("sort_order")
    if (lErr) return fail(lErr.message)
    const itemIds = (links ?? []).map((l: { plan_item_id: string }) => l.plan_item_id)
    if (itemIds.length === 0) return fail("Add at least one item to the package before publishing.")
    const { data: planItems, error: piErr } = await supabase
      .from("semester_plan_items")
      .select(ITEM_COLS)
      .in("id", itemIds)
    if (piErr) return fail(piErr.message)
    const orderPos = new Map(
      (links ?? []).map((l: { plan_item_id: string }, idx: number) => [l.plan_item_id, idx]),
    )
    const ordered = ((planItems ?? []) as PlanItemRow[])
      .slice()
      .sort((a, b) => (orderPos.get(a.id) ?? 0) - (orderPos.get(b.id) ?? 0))

    // Assignment top-level type/fields derive from the dominant content.
    const firstReading = ordered.find((it) => itemKind(it.type) === "reading" && it.book_id)
    const firstWriting = ordered.find((it) => itemKind(it.type) === "writing")
    const firstDiscussion = ordered.find((it) => itemKind(it.type) === "discussion")
    const aType = firstReading ? "reading" : firstWriting ? "essay" : firstDiscussion ? "discussion" : "reading"

    const assignmentPatch = {
      title: pkg.title,
      type: aType,
      book_id: firstReading?.book_id ?? null,
      chapter_range_start: firstReading?.chapter_start ?? null,
      chapter_range_end: firstReading?.chapter_end ?? firstReading?.chapter_start ?? null,
      essay_prompt: aType === "essay" ? firstWriting?.prompt ?? firstWriting?.description ?? pkg.title : null,
      discussion_prompt:
        aType === "discussion" ? firstDiscussion?.prompt ?? firstDiscussion?.description ?? pkg.title : null,
      due_date: pkg.due_at,
      release_at: pkg.release_at,
      points_available: pkg.points,
      grading_category_id: pkg.grading_category_id,
      late_policy: pkg.late_policy,
      package_id: pkg.id,
      status: "active" as const,
    }

    let assignmentId = pkg.published_assignment_id as string | null
    const firstPublish = !assignmentId
    if (assignmentId) {
      const { error } = await supabase
        .from("assignments")
        .update(assignmentPatch)
        .eq("id", assignmentId)
      if (error) return fail(error.message)
    } else {
      const { data: created, error } = await supabase
        .from("assignments")
        .insert({
          ...assignmentPatch,
          classroom_id: plan.class_id,
          teacher_id: user.id,
          scope: "classroom",
        })
        .select("id")
        .single()
      if (error) return fail(error.message)
      assignmentId = created.id
      const { error: markErr } = await supabase
        .from("plan_packages")
        .update({ published_assignment_id: assignmentId, updated_at: new Date().toISOString() })
        .eq("id", pkg.id)
      if (markErr) return fail(markErr.message)
    }

    // Rebuild assignment_items from the package contents (idempotent sync).
    const { error: wipeErr } = await supabase
      .from("assignment_items")
      .delete()
      .eq("assignment_id", assignmentId)
    if (wipeErr) return fail(wipeErr.message)
    const itemRows = ordered.map((it, idx) => ({
      assignment_id: assignmentId,
      kind: itemKind(it.type),
      title: it.title,
      book_id: it.book_id,
      chapter_start: it.chapter_start,
      chapter_end: it.chapter_end,
      platform_quiz_difficulty:
        it.type === "quiz" && it.difficulty
          ? it.difficulty.charAt(0).toUpperCase() + it.difficulty.slice(1)
          : null,
      prompt: it.prompt,
      is_required: it.is_required,
      sort_order: idx,
    }))
    const { error: insErr } = await supabase.from("assignment_items").insert(itemRows)
    if (insErr) return fail(insErr.message)

    // Seed submissions for every enrolled student; notify on first publish.
    const admin = createAdminClient()
    const students = await classroomStudentIds(admin, plan.class_id)
    if (students.length > 0) {
      await admin.from("assignment_submissions").upsert(
        students.map((sid) => ({
          assignment_id: assignmentId,
          student_id: sid,
          status: "not_started" as const,
        })),
        { onConflict: "assignment_id,student_id", ignoreDuplicates: true },
      )
      if (firstPublish) {
        await notify(
          students.map((sid) => ({
            recipientId: sid,
            type: "class_assignment" as const,
            title: `New assignment: ${pkg.title}`,
            actionUrl: assignmentReaderHref({
              id: assignmentId as string,
              classroom_id: plan.class_id,
              book_id: assignmentPatch.book_id,
              chapter_range_start: assignmentPatch.chapter_range_start,
            }),
            actorId: user.id,
            entityType: "assignment",
            entityId: assignmentId as string,
          })),
        )
      }
    }

    revalidatePath(`/classroom/${plan.class_id}`)
    revalidatePath(`/classroom/${plan.class_id}/planner`)
    return ok({ assignmentId: assignmentId as string, students: students.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

async function classroomStudentIds(admin: SupaClient, classroomId: string): Promise<string[]> {
  const { data } = await admin
    .from("classroom_members")
    .select("student_id")
    .eq("classroom_id", classroomId)
    .eq("role", "student")
  return (data ?? []).map((r: { student_id: string }) => r.student_id)
}

// ── Templates ─────────────────────────────────────────────────────────────
// A template captures the plan's structure with dates converted to day
// offsets from term_start, so it can be re-applied to any future term.

interface TemplatePayload {
  title: string
  meeting_days: number[]
  categories: { name: string; weight: number; drop_lowest: number; sort_order: number }[]
  units: {
    title: string
    description: string | null
    book_id: string | null
    sort_order: number
    start_offset: number | null
    end_offset: number | null
    items: {
      type: string
      title: string
      description: string | null
      prompt: string | null
      book_id: string | null
      chapter_start: number | null
      chapter_end: number | null
      difficulty: string | null
      is_required: boolean
      sort_order: number
      due_offset: number | null
      package_index: number | null
    }[]
    packages: {
      title: string
      points: number
      category_name: string | null
      sort_order: number
      due_offset: number | null
    }[]
  }[]
}

function dayOffset(base: string, date: string | null): number | null {
  if (!date) return null
  const ms = new Date(`${date}T00:00:00Z`).getTime() - new Date(`${base}T00:00:00Z`).getTime()
  return Math.round(ms / 86400000)
}

function offsetDate(base: string, offset: number | null): string | null {
  if (offset == null) return null
  const d = new Date(`${base}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + offset)
  return d.toISOString().slice(0, 10)
}

export async function saveTemplate(
  planId: string,
  name: string,
): Promise<ActionResult<{ id: string }>> {
  if (!Uuid.safeParse(planId).success) return fail("Invalid plan id.")
  const cleanName = name.trim()
  if (!cleanName) return fail("Template name is required.")
  try {
    const { supabase, user } = await requireUser()
    const stateByPlan = await plannerStateForPlan(supabase, planId)
    if (!stateByPlan.ok) return stateByPlan
    const { plan, categories, units, items, packages, packageItems } = stateByPlan.data
    if (!plan?.term_start) return fail("Plan needs a term start date to templatize.")
    const base = plan.term_start

    const payload: TemplatePayload = {
      title: plan.title,
      meeting_days: plan.meeting_days ?? [],
      categories: categories.map((c) => ({
        name: c.name,
        weight: Number(c.weight),
        drop_lowest: c.drop_lowest,
        sort_order: c.sort_order,
      })),
      units: units.map((u) => {
        const unitPkgs = packages.filter((p) => p.unit_id === u.id)
        const pkgIndex = new Map(unitPkgs.map((p, idx) => [p.id, idx]))
        const linkByItem = new Map(packageItems.map((l) => [l.plan_item_id, l.package_id]))
        return {
          title: u.title,
          description: u.description,
          book_id: u.book_id,
          sort_order: u.sort_order,
          start_offset: dayOffset(base, u.starts_on),
          end_offset: dayOffset(base, u.ends_on),
          items: items
            .filter((it) => it.unit_id === u.id)
            .map((it) => ({
              type: it.type,
              title: it.title,
              description: it.description,
              prompt: it.prompt,
              book_id: it.book_id,
              chapter_start: it.chapter_start,
              chapter_end: it.chapter_end,
              difficulty: it.difficulty,
              is_required: it.is_required,
              sort_order: it.sort_order,
              due_offset: dayOffset(base, it.due_date),
              package_index: pkgIndex.get(linkByItem.get(it.id) ?? "") ?? null,
            })),
          packages: unitPkgs.map((p) => ({
            title: p.title,
            points: p.points,
            category_name: categories.find((c) => c.id === p.grading_category_id)?.name ?? null,
            sort_order: p.sort_order,
            due_offset: dayOffset(base, p.due_at ? p.due_at.slice(0, 10) : null),
          })),
        }
      }),
    }

    const { data, error } = await supabase
      .from("term_templates")
      .insert({ owner_id: user.id, name: cleanName, payload })
      .select("id")
      .single()
    if (error) return fail(error.message)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function listTemplates(): Promise<ActionResult<TemplateRow[]>> {
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase
      .from("term_templates")
      .select("id, name, is_shared, created_at")
      .order("created_at", { ascending: false })
    if (error) return fail(error.message)
    return ok((data ?? []) as TemplateRow[])
  } catch (e) {
    return fail((e as Error).message)
  }
}

const ApplyTemplateInput = z.object({
  templateId: Uuid,
  classroomId: Uuid,
  termStart: IsoDate,
  termEnd: IsoDate,
  title: z.string().min(1).max(200).optional(),
})

export async function applyTemplate(
  input: z.input<typeof ApplyTemplateInput>,
): Promise<ActionResult<{ planId: string }>> {
  const parsed = ApplyTemplateInput.safeParse(input)
  if (!parsed.success) return fail(parsed.error.issues[0]?.message ?? "Invalid input.")
  const i = parsed.data
  try {
    const { supabase, user } = await requireUser()
    const { data: tpl, error: tErr } = await supabase
      .from("term_templates")
      .select("payload")
      .eq("id", i.templateId)
      .single()
    if (tErr) return fail(tErr.message)
    const payload = tpl.payload as TemplatePayload
    const base = i.termStart

    const { data: plan, error: pErr } = await supabase
      .from("semester_plans")
      .insert({
        teacher_id: user.id,
        class_id: i.classroomId,
        title: i.title ?? payload.title,
        term_start: i.termStart,
        term_end: i.termEnd,
        meeting_days: payload.meeting_days ?? [],
        status: "draft",
      })
      .select("id")
      .single()
    if (pErr) return fail(pErr.message)

    const catIdByName = new Map<string, string>()
    for (const c of payload.categories ?? []) {
      const { data, error } = await supabase
        .from("grading_categories")
        .insert({
          plan_id: plan.id,
          name: c.name,
          weight: c.weight,
          drop_lowest: c.drop_lowest,
          sort_order: c.sort_order,
        })
        .select("id")
        .single()
      if (error) return fail(error.message)
      catIdByName.set(c.name, data.id)
    }

    for (const u of payload.units ?? []) {
      const { data: unit, error: uErr } = await supabase
        .from("plan_units")
        .insert({
          plan_id: plan.id,
          title: u.title,
          description: u.description,
          book_id: u.book_id,
          sort_order: u.sort_order,
          starts_on: offsetDate(base, u.start_offset),
          ends_on: offsetDate(base, u.end_offset),
        })
        .select("id")
        .single()
      if (uErr) return fail(uErr.message)

      const pkgIds: string[] = []
      for (const p of u.packages ?? []) {
        const due = offsetDate(base, p.due_offset)
        const { data: pkg, error } = await supabase
          .from("plan_packages")
          .insert({
            unit_id: unit.id,
            title: p.title,
            points: p.points,
            grading_category_id: p.category_name ? catIdByName.get(p.category_name) ?? null : null,
            sort_order: p.sort_order,
            due_at: due ? `${due}T23:59:00Z` : null,
          })
          .select("id")
          .single()
        if (error) return fail(error.message)
        pkgIds.push(pkg.id)
      }

      for (const it of u.items ?? []) {
        const { data: item, error } = await supabase
          .from("semester_plan_items")
          .insert({
            unit_id: unit.id,
            type: it.type,
            title: it.title,
            description: it.description,
            prompt: it.prompt,
            book_id: it.book_id,
            chapter_start: it.chapter_start,
            chapter_end: it.chapter_end,
            difficulty: it.difficulty,
            is_required: it.is_required,
            sort_order: it.sort_order,
            due_date: offsetDate(base, it.due_offset),
          })
          .select("id")
          .single()
        if (error) return fail(error.message)
        if (it.package_index != null && pkgIds[it.package_index]) {
          const { error: linkErr } = await supabase.from("plan_package_items").insert({
            package_id: pkgIds[it.package_index],
            plan_item_id: item.id,
            sort_order: it.sort_order,
          })
          if (linkErr) return fail(linkErr.message)
        }
      }
    }

    revalidatePath(`/classroom/${i.classroomId}/planner`)
    return ok({ planId: plan.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Shared: full state for one plan (used by saveTemplate) ────────────────

async function plannerStateForPlan(
  supabase: SupaClient,
  planId: string,
): Promise<ActionResult<PlannerState>> {
  const { data: plan, error } = await supabase
    .from("semester_plans")
    .select(PLAN_COLS)
    .eq("id", planId)
    .single()
  if (error) return fail(error.message)

  const [cats, units] = await Promise.all([
    supabase
      .from("grading_categories")
      .select("id, plan_id, name, weight, sort_order, drop_lowest")
      .eq("plan_id", planId)
      .order("sort_order"),
    supabase
      .from("plan_units")
      .select("id, plan_id, title, description, starts_on, ends_on, sort_order, book_id")
      .eq("plan_id", planId)
      .order("sort_order"),
  ])
  if (cats.error) return fail(cats.error.message)
  if (units.error) return fail(units.error.message)
  const unitIds = (units.data ?? []).map((u: { id: string }) => u.id)

  let items: PlanItemRow[] = []
  let packages: PackageRow[] = []
  let packageItems: PackageItemLink[] = []
  if (unitIds.length > 0) {
    const [it, pk] = await Promise.all([
      supabase.from("semester_plan_items").select(ITEM_COLS).in("unit_id", unitIds).order("sort_order"),
      supabase.from("plan_packages").select(PKG_COLS).in("unit_id", unitIds).order("sort_order"),
    ])
    if (it.error) return fail(it.error.message)
    if (pk.error) return fail(pk.error.message)
    items = (it.data ?? []) as PlanItemRow[]
    packages = (pk.data ?? []) as PackageRow[]
    const pkgIds = packages.map((p) => p.id)
    if (pkgIds.length > 0) {
      const { data: links, error: lErr } = await supabase
        .from("plan_package_items")
        .select("package_id, plan_item_id, sort_order")
        .in("package_id", pkgIds)
        .order("sort_order")
      if (lErr) return fail(lErr.message)
      packageItems = (links ?? []) as PackageItemLink[]
    }
  }
  return ok({ plan: plan as TermPlanRow, categories: (cats.data ?? []) as CategoryRow[], units: (units.data ?? []) as UnitRow[], items, packages, packageItems })
}
