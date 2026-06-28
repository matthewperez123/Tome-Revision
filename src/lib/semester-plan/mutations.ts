import "server-only"

import { z } from "zod"
import type { createClient } from "@/lib/supabase/server"
import {
  PLAN_ITEM_TYPES,
  type GeneratedItem,
  type GeneratedPlan,
  type PlanItemType,
  type PlanSetup,
  type SemesterPlan,
} from "@/lib/semester-plan/types"
import { TEACHER_QUIZ_DIFFICULTIES } from "@/lib/teacher-quiz-types"
import { estimateItemMinutes, weekDates, type ChapterMinuteIndex } from "@/lib/semester-plan/pacing"

type DB = Awaited<ReturnType<typeof createClient>>

/** A draft plan row the requesting teacher owns, enough to reconstruct setup. */
export interface OwnedPlanRow {
  id: string
  teacher_id: string
  class_id: string | null
  title: string
  term_start: string | null
  term_end: string | null
  weeks: number
  level: string | null
  cadence: PlanSetup["cadence"]
  goals: PlanSetup["goals"]
  constraints: PlanSetup["constraints"]
  status: SemesterPlan["status"]
  generation_params: { focus?: string | null; ambition?: "standard" | "ambitious"; traditions?: string[] } | null
}

const PLAN_ROW_COLS =
  "id, teacher_id, class_id, title, term_start, term_end, weeks, level, cadence, goals, constraints, status, generation_params"

/** Load a plan and confirm the user owns it. Returns null if missing/forbidden. */
export async function loadOwnedPlan(
  supabase: DB,
  planId: string,
  userId: string,
): Promise<OwnedPlanRow | null> {
  const { data } = await supabase.from("semester_plans").select(PLAN_ROW_COLS).eq("id", planId).single()
  if (!data || (data as OwnedPlanRow).teacher_id !== userId) return null
  return data as OwnedPlanRow
}

/** Rebuild the PlanSetup that generated a plan, for candidate assembly + revise. */
export function setupFromPlanRow(row: OwnedPlanRow): PlanSetup {
  return {
    classId: row.class_id,
    title: row.title,
    termStart: row.term_start ?? undefined,
    termEnd: row.term_end ?? undefined,
    weeks: row.weeks,
    cadence: row.cadence,
    level: row.level ?? undefined,
    goals: row.goals,
    constraints: row.constraints,
    focus: row.generation_params?.focus ?? undefined,
    traditions: row.generation_params?.traditions ?? [],
    ambition: row.generation_params?.ambition ?? "standard",
  }
}

/** Convert a hydrated plan back into the generator's plan contract for revise. */
export function planToGenerated(plan: SemesterPlan): GeneratedPlan {
  return {
    weeks: plan.week_list.map((w) => ({
      week_index: w.week_index,
      theme: w.theme ?? `Week ${w.week_index}`,
      notes: w.notes ?? undefined,
      items: w.items.map((it) => ({
        type: it.type,
        book_id: it.book_id ?? undefined,
        chapter_refs: it.chapter_refs ?? undefined,
        title: it.title,
        description: it.description ?? undefined,
        difficulty: it.difficulty ?? undefined,
      })),
    })),
  }
}

// ── Per-item minute recompute (for structured edits that change reading scope) ──

/** Recompute est_minutes for one item by reading its book's chapter minutes. */
async function itemMinutes(
  supabase: DB,
  type: string,
  bookId: string | null,
  chapterRefs: number[] | null,
): Promise<number | null> {
  const itemType = type as PlanItemType
  if (!bookId || (type !== "reading" && type !== "quiz")) {
    return estimateItemMinutes({ type: itemType, title: "" } satisfies GeneratedItem, new Map())
  }
  const { data: book } = await supabase
    .from("books")
    .select("chapter_count, reading_time_minutes")
    .eq("id", bookId)
    .single()
  const { data: chapters } = await supabase
    .from("chapters")
    .select("chapter_index, estimated_minutes")
    .eq("book_id", bookId)

  const minutes = new Map<number, number>()
  for (const c of (chapters ?? []) as { chapter_index: number; estimated_minutes: number }[]) {
    minutes.set(c.chapter_index, c.estimated_minutes)
  }
  const index: ChapterMinuteIndex = new Map([
    [
      bookId,
      {
        minutes,
        reading_time_minutes: (book as { reading_time_minutes?: number } | null)?.reading_time_minutes ?? 0,
        chapter_count: (book as { chapter_count?: number } | null)?.chapter_count ?? 0,
      },
    ],
  ])
  return estimateItemMinutes(
    {
      type: itemType,
      book_id: bookId,
      chapter_refs: chapterRefs ?? undefined,
      title: "",
    } satisfies GeneratedItem,
    index,
  )
}

/** True when a catalog book has at least one chapter with non-empty content. */
async function bookHasContent(supabase: DB, bookId: string): Promise<boolean> {
  const { data } = await supabase
    .from("chapters")
    .select("book_id")
    .eq("book_id", bookId)
    .not("content_html", "is", null)
    .neq("content_html", "")
    .limit(1)
  return (data ?? []).length > 0
}

// ── Structured edit actions ───────────────────────────────────────────────────

const itemPatchSchema = z.object({
  book_id: z.string().nullable().optional(),
  chapter_refs: z.array(z.number().int().nonnegative()).nullable().optional(),
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES).nullable().optional(),
  due_date: z.string().nullable().optional(),
  custom_reading: z
    .object({
      title: z.string().optional(),
      url: z.string().optional(),
      filePath: z.string().optional(),
      notes: z.string().optional(),
    })
    .nullable()
    .optional(),
})

export const mutationSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("update_item"), itemId: z.string().uuid(), patch: itemPatchSchema }),
  z.object({
    action: z.literal("add_item"),
    weekId: z.string().uuid(),
    type: z.enum(PLAN_ITEM_TYPES),
    title: z.string().min(1),
    book_id: z.string().optional(),
    chapter_refs: z.array(z.number().int().nonnegative()).optional(),
    difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES).optional(),
    description: z.string().optional(),
  }),
  z.object({ action: z.literal("delete_item"), itemId: z.string().uuid() }),
  z.object({
    action: z.literal("update_week"),
    weekId: z.string().uuid(),
    theme: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
  }),
  z.object({ action: z.literal("reorder_weeks"), order: z.array(z.string().uuid()).min(1) }),
])
export type PlanMutation = z.infer<typeof mutationSchema>

/** Confirm an item belongs to a week of this plan (guards cross-plan edits). */
async function itemInPlan(supabase: DB, planId: string, itemId: string): Promise<string | null> {
  const { data } = await supabase
    .from("semester_plan_items")
    .select("id, week_id, type, book_id, semester_plan_weeks!inner(plan_id)")
    .eq("id", itemId)
    .single()
  const row = data as { week_id: string; semester_plan_weeks: { plan_id: string } } | null
  if (!row || row.semester_plan_weeks.plan_id !== planId) return null
  return row.week_id
}

async function weekInPlan(supabase: DB, planId: string, weekId: string): Promise<boolean> {
  const { data } = await supabase
    .from("semester_plan_weeks")
    .select("plan_id")
    .eq("id", weekId)
    .single()
  return !!data && (data as { plan_id: string }).plan_id === planId
}

/** Apply one structured edit. Recomputes minutes/content flags where relevant. */
export async function applyMutation(
  supabase: DB,
  plan: OwnedPlanRow,
  mut: PlanMutation,
): Promise<{ ok: true } | { error: string; status: number }> {
  switch (mut.action) {
    case "update_item": {
      const weekId = await itemInPlan(supabase, plan.id, mut.itemId)
      if (!weekId) return { error: "Item not in plan", status: 404 }

      const { data: existing } = await supabase
        .from("semester_plan_items")
        .select("type, book_id, chapter_refs")
        .eq("id", mut.itemId)
        .single()
      const cur = existing as { type: string; book_id: string | null; chapter_refs: number[] | null }

      const update: Record<string, unknown> = {}
      const p = mut.patch
      if (p.title !== undefined) update.title = p.title
      if (p.description !== undefined) update.description = p.description
      if (p.difficulty !== undefined) update.difficulty = p.difficulty
      if (p.due_date !== undefined) update.due_date = p.due_date
      if (p.custom_reading !== undefined) update.custom_reading = p.custom_reading

      const nextBook = p.book_id !== undefined ? p.book_id : cur.book_id
      const nextRefs = p.chapter_refs !== undefined ? p.chapter_refs : cur.chapter_refs
      const scopeChanged = p.book_id !== undefined || p.chapter_refs !== undefined
      if (p.book_id !== undefined) {
        update.book_id = p.book_id
        update.has_content = p.book_id ? await bookHasContent(supabase, p.book_id) : null
      }
      if (p.chapter_refs !== undefined) update.chapter_refs = p.chapter_refs
      if (scopeChanged) {
        update.est_minutes = await itemMinutes(supabase, cur.type, nextBook ?? null, nextRefs ?? null)
      }

      const { error } = await supabase.from("semester_plan_items").update(update).eq("id", mut.itemId)
      return error ? { error: error.message, status: 500 } : { ok: true }
    }

    case "add_item": {
      if (!(await weekInPlan(supabase, plan.id, mut.weekId)))
        return { error: "Week not in plan", status: 404 }
      const { data: tail } = await supabase
        .from("semester_plan_items")
        .select("sort_order")
        .eq("week_id", mut.weekId)
        .order("sort_order", { ascending: false })
        .limit(1)
      const nextOrder = ((tail?.[0] as { sort_order: number } | undefined)?.sort_order ?? -1) + 1
      const est = await itemMinutes(supabase, mut.type, mut.book_id ?? null, mut.chapter_refs ?? null)
      const { error } = await supabase.from("semester_plan_items").insert({
        week_id: mut.weekId,
        sort_order: nextOrder,
        type: mut.type,
        book_id: mut.book_id ?? null,
        chapter_refs: mut.chapter_refs ?? null,
        title: mut.title,
        description: mut.description ?? null,
        difficulty: mut.type === "quiz" ? mut.difficulty ?? null : null,
        est_minutes: est,
        has_content: mut.book_id ? await bookHasContent(supabase, mut.book_id) : null,
        status: "planned",
      })
      return error ? { error: error.message, status: 500 } : { ok: true }
    }

    case "delete_item": {
      const weekId = await itemInPlan(supabase, plan.id, mut.itemId)
      if (!weekId) return { error: "Item not in plan", status: 404 }
      const { error } = await supabase.from("semester_plan_items").delete().eq("id", mut.itemId)
      return error ? { error: error.message, status: 500 } : { ok: true }
    }

    case "update_week": {
      if (!(await weekInPlan(supabase, plan.id, mut.weekId)))
        return { error: "Week not in plan", status: 404 }
      const update: Record<string, unknown> = {}
      if (mut.theme !== undefined) update.theme = mut.theme
      if (mut.notes !== undefined) update.notes = mut.notes
      const { error } = await supabase
        .from("semester_plan_weeks")
        .update(update)
        .eq("id", mut.weekId)
      return error ? { error: error.message, status: 500 } : { ok: true }
    }

    case "reorder_weeks": {
      const { data: weeks } = await supabase
        .from("semester_plan_weeks")
        .select("id")
        .eq("plan_id", plan.id)
      const owned = new Set((weeks ?? []).map((w) => (w as { id: string }).id))
      if (mut.order.length !== owned.size || mut.order.some((id) => !owned.has(id))) {
        return { error: "Reorder set does not match plan weeks", status: 400 }
      }
      // Renumber 1..N and recompute each week's date window from term start.
      for (let i = 0; i < mut.order.length; i++) {
        const { date_start, date_end } = weekDates(plan.term_start, i + 1)
        await supabase
          .from("semester_plan_weeks")
          .update({ week_index: i + 1, date_start, date_end })
          .eq("id", mut.order[i])
      }
      return { ok: true }
    }
  }
}
