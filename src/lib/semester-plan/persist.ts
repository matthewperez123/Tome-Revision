import "server-only"

import type { createClient } from "@/lib/supabase/server"
import type {
  CandidateBook,
  GeneratedPlan,
  PlanSetup,
  PlanItem,
  PlanWeek,
  SemesterPlan,
} from "@/lib/semester-plan/types"
import {
  estimateItemMinutes,
  itemDueDate,
  weekDates,
  weekLoadMinutes,
  type BookPacing,
  type ChapterMinuteIndex,
} from "@/lib/semester-plan/pacing"

type DB = Awaited<ReturnType<typeof createClient>>

/** Load per-chapter minute data for the books a plan actually references. */
export async function fetchChapterMinutes(
  supabase: DB,
  candidates: CandidateBook[],
  bookIds: string[],
): Promise<ChapterMinuteIndex> {
  const index: ChapterMinuteIndex = new Map()
  if (bookIds.length === 0) return index

  const byId = new Map(candidates.map((c) => [c.id, c]))
  for (const id of bookIds) {
    const c = byId.get(id)
    index.set(id, {
      minutes: new Map(),
      reading_time_minutes: c?.reading_time_minutes ?? 0,
      chapter_count: c?.chapter_count ?? 0,
    } satisfies BookPacing)
  }

  const { data } = await supabase
    .from("chapters")
    .select("book_id, chapter_index, estimated_minutes")
    .in("book_id", bookIds)
  for (const row of (data ?? []) as { book_id: string; chapter_index: number; estimated_minutes: number }[]) {
    index.get(row.book_id)?.minutes.set(row.chapter_index, row.estimated_minutes)
  }
  return index
}

/**
 * Persist a repaired generated plan with deterministic pacing applied in code.
 * Returns the new plan id.
 */
export async function materializePlan(opts: {
  supabase: DB
  teacherId: string
  setup: PlanSetup
  plan: GeneratedPlan
  candidates: CandidateBook[]
  model: string
}): Promise<{ planId: string } | { error: string }> {
  const { supabase, teacherId, setup, plan, candidates, model } = opts

  const referencedBookIds = [
    ...new Set(
      plan.weeks.flatMap((w) => w.items.map((it) => it.book_id).filter((id): id is string => !!id)),
    ),
  ]
  const minuteIndex = await fetchChapterMinutes(supabase, candidates, referencedBookIds)
  const contentful = new Set(candidates.filter((c) => c.has_chapter_content).map((c) => c.id))

  const { data: planRow, error: planErr } = await supabase
    .from("semester_plans")
    .insert({
      teacher_id: teacherId,
      class_id: setup.classId ?? null,
      title: setup.title,
      term_start: setup.termStart ?? null,
      term_end: setup.termEnd ?? null,
      weeks: setup.weeks,
      cadence: setup.cadence,
      level: setup.level ?? null,
      goals: setup.goals,
      constraints: setup.constraints,
      status: "draft",
      generated_by_model: model,
      generation_params: { focus: setup.focus ?? null, ambition: setup.ambition, traditions: setup.traditions },
    })
    .select("id")
    .single()
  if (planErr || !planRow) return { error: planErr?.message ?? "Failed to create plan" }
  const planId = planRow.id as string

  await insertWeeksAndItems(supabase, planId, setup.termStart, plan, minuteIndex, contentful)
  return { planId }
}

/**
 * Replace an existing draft plan's weeks/items in place (keeps the plan id).
 * Used by free-text revise + per-week regeneration. Existing weeks cascade-
 * delete their items, then the freshly repaired plan is re-paced and inserted.
 */
export async function rematerializePlan(opts: {
  supabase: DB
  planId: string
  termStart: string | null | undefined
  plan: GeneratedPlan
  candidates: CandidateBook[]
  model: string
}): Promise<{ ok: true } | { error: string }> {
  const { supabase, planId, termStart, plan, candidates, model } = opts

  const referencedBookIds = [
    ...new Set(
      plan.weeks.flatMap((w) => w.items.map((it) => it.book_id).filter((id): id is string => !!id)),
    ),
  ]
  const minuteIndex = await fetchChapterMinutes(supabase, candidates, referencedBookIds)
  const contentful = new Set(candidates.filter((c) => c.has_chapter_content).map((c) => c.id))

  const { error: delErr } = await supabase.from("semester_plan_weeks").delete().eq("plan_id", planId)
  if (delErr) return { error: delErr.message }

  await insertWeeksAndItems(supabase, planId, termStart, plan, minuteIndex, contentful)
  await supabase.from("semester_plans").update({ generated_by_model: model }).eq("id", planId)
  return { ok: true }
}

async function insertWeeksAndItems(
  supabase: DB,
  planId: string,
  termStart: string | null | undefined,
  plan: GeneratedPlan,
  minuteIndex: ChapterMinuteIndex,
  contentful: Set<string>,
): Promise<void> {
  for (const week of plan.weeks) {
    const { date_start, date_end } = weekDates(termStart, week.week_index)
    const { data: weekRow, error: weekErr } = await supabase
      .from("semester_plan_weeks")
      .insert({
        plan_id: planId,
        week_index: week.week_index,
        date_start,
        date_end,
        theme: week.theme ?? null,
        notes: week.notes ?? null,
      })
      .select("id")
      .single()
    if (weekErr || !weekRow) continue
    const weekId = weekRow.id as string

    const itemRows = week.items.map((it, i) => ({
      week_id: weekId,
      sort_order: i,
      type: it.type,
      book_id: it.book_id ?? null,
      chapter_refs: it.chapter_refs ?? null,
      title: it.title,
      description: it.description ?? null,
      difficulty: it.type === "quiz" ? it.difficulty ?? null : null,
      due_date: itemDueDate(termStart, week.week_index, it.due_offset_days),
      est_minutes: estimateItemMinutes(it, minuteIndex),
      has_content: it.book_id ? contentful.has(it.book_id) : null,
      status: "planned",
    }))
    if (itemRows.length) {
      await supabase.from("semester_plan_items").insert(itemRows)
    }
  }
}

// ── Hydration (read a plan back with computed load) ───────────────────────────

const PLAN_COLS =
  "id, teacher_id, class_id, title, term_start, term_end, weeks, cadence, goals, constraints, status, generated_by_model"
const ITEM_COLS =
  "id, week_id, sort_order, type, book_id, chapter_refs, title, description, rubric, difficulty, due_date, est_minutes, custom_reading, has_content, status, teacher_quiz_id, guided_session_id, assignment_id"

export async function hydratePlan(supabase: DB, planId: string): Promise<SemesterPlan | null> {
  const { data: plan } = await supabase.from("semester_plans").select(PLAN_COLS).eq("id", planId).single()
  if (!plan) return null

  const { data: weeks } = await supabase
    .from("semester_plan_weeks")
    .select("id, plan_id, week_index, date_start, date_end, theme, notes")
    .eq("plan_id", planId)
    .order("week_index", { ascending: true })

  const weekIds = (weeks ?? []).map((w) => w.id as string)
  const { data: items } = weekIds.length
    ? await supabase
        .from("semester_plan_items")
        .select(ITEM_COLS)
        .in("week_id", weekIds)
        .order("sort_order", { ascending: true })
    : { data: [] as PlanItem[] }

  const itemsByWeek = new Map<string, PlanItem[]>()
  for (const it of (items ?? []) as PlanItem[]) {
    const list = itemsByWeek.get(it.week_id) ?? []
    list.push(it)
    itemsByWeek.set(it.week_id, list)
  }

  const cap = (plan.constraints as SemesterPlan["constraints"])?.maxMinutesPerWeek
  const week_list: PlanWeek[] = (weeks ?? []).map((w) => {
    const wItems = itemsByWeek.get(w.id as string) ?? []
    const load = weekLoadMinutes(wItems)
    return {
      id: w.id as string,
      plan_id: w.plan_id as string,
      week_index: w.week_index as number,
      date_start: w.date_start as string | null,
      date_end: w.date_end as string | null,
      theme: w.theme as string | null,
      notes: w.notes as string | null,
      items: wItems,
      load_minutes: load,
      over_cap: cap != null && load > cap,
    }
  })

  return {
    id: plan.id as string,
    teacher_id: plan.teacher_id as string,
    class_id: plan.class_id as string | null,
    title: plan.title as string,
    term_start: plan.term_start as string | null,
    term_end: plan.term_end as string | null,
    weeks: plan.weeks as number,
    cadence: plan.cadence as SemesterPlan["cadence"],
    goals: plan.goals as SemesterPlan["goals"],
    constraints: plan.constraints as SemesterPlan["constraints"],
    status: plan.status as SemesterPlan["status"],
    generated_by_model: plan.generated_by_model as string | null,
    week_list,
  }
}
