/**
 * Semester Planning types + zod contracts.
 *
 * Shared by the planning service (server) and the plan board UI (client),
 * so this file must stay free of server-only imports.
 *
 * Difficulty is lowercase (apprentice | scholar | master) to match the
 * teacher_quizzes / semester_plan_items check constraints.
 */

import { z } from "zod"
import { TEACHER_QUIZ_DIFFICULTIES } from "@/lib/teacher-quiz-types"

// ── Item + plan vocabulary ──────────────────────────────────────────────────

export const PLAN_ITEM_TYPES = [
  "reading",
  "quiz",
  "guided_session",
  "essay",
  "discussion",
  "custom_reading",
] as const
export type PlanItemType = (typeof PLAN_ITEM_TYPES)[number]

export const PLAN_ITEM_TYPE_LABELS: Record<PlanItemType, string> = {
  reading: "Reading",
  quiz: "Trial / Quiz",
  guided_session: "Guided Session",
  essay: "Essay",
  discussion: "Discussion",
  custom_reading: "Outside Reading",
}

/** Item types that, when grounded in a catalog book, require ingested content. */
export const CONTENT_DEPENDENT_TYPES = new Set<PlanItemType>(["quiz", "guided_session"])

export const PLAN_STATUSES = ["draft", "active", "archived"] as const
export type PlanStatus = (typeof PLAN_STATUSES)[number]

export const ITEM_STATUSES = ["planned", "provisioned"] as const
export type ItemStatus = (typeof ITEM_STATUSES)[number]

// ── Setup wizard inputs ─────────────────────────────────────────────────────

export const planCadenceSchema = z.object({
  meetingsPerWeek: z.number().int().min(1).max(7).default(3),
  minutesPerMeeting: z.number().int().min(10).max(300).optional(),
})
export type PlanCadence = z.infer<typeof planCadenceSchema>

export const planGoalsSchema = z.object({
  themes: z.array(z.string().min(1)).default([]),
  objectives: z.array(z.string().min(1)).default([]),
})
export type PlanGoals = z.infer<typeof planGoalsSchema>

export const planConstraintsSchema = z.object({
  maxMinutesPerWeek: z.number().int().min(15).max(2000).optional(),
  difficultyCeiling: z.enum(TEACHER_QUIZ_DIFFICULTIES).optional(),
  requiredBookIds: z.array(z.string()).default([]),
  /** ISO week_index values that are breaks (no assigned reading). */
  breakWeeks: z.array(z.number().int().nonnegative()).default([]),
})
export type PlanConstraints = z.infer<typeof planConstraintsSchema>

export const planSetupSchema = z.object({
  classId: z.string().uuid().nullable().optional(),
  title: z.string().min(1).max(200),
  termStart: z.string().optional(), // ISO date
  termEnd: z.string().optional(),
  weeks: z.number().int().min(1).max(40),
  cadence: planCadenceSchema,
  level: z.string().max(120).optional(),
  goals: planGoalsSchema,
  constraints: planConstraintsSchema,
  /** Free-text steer for the survey; e.g. "epic poetry then the novel". */
  focus: z.string().max(1000).optional(),
  /** Pre-filter knobs the server uses to assemble the candidate catalog. */
  traditions: z.array(z.string()).default([]),
  /** "ambitious" routes to a stronger model for whole-term thematic threading. */
  ambition: z.enum(["standard", "ambitious"]).default("standard"),
})
export type PlanSetup = z.infer<typeof planSetupSchema>

// ── Plan JSON contract (what Virgil emits; pacing is computed in code) ────────

export const generatedItemSchema = z.object({
  type: z.enum(PLAN_ITEM_TYPES),
  book_id: z.string().optional(),
  chapter_refs: z.array(z.number().int().nonnegative()).optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  difficulty: z.enum(TEACHER_QUIZ_DIFFICULTIES).optional(),
  /** Days-from-week-start offset (0-6); concrete due_date is computed in code. */
  due_offset_days: z.number().int().min(0).max(6).optional(),
})
export type GeneratedItem = z.infer<typeof generatedItemSchema>

export const generatedWeekSchema = z.object({
  week_index: z.number().int().min(1),
  theme: z.string().min(1),
  notes: z.string().optional(),
  items: z.array(generatedItemSchema).default([]),
})
export type GeneratedWeek = z.infer<typeof generatedWeekSchema>

export const generatedPlanSchema = z.object({
  weeks: z.array(generatedWeekSchema).min(1),
})
export type GeneratedPlan = z.infer<typeof generatedPlanSchema>

// ── Hydrated / persisted shapes returned to the client ───────────────────────

export interface PlanItem {
  id: string
  week_id: string
  sort_order: number
  type: PlanItemType
  book_id: string | null
  chapter_refs: number[] | null
  title: string
  description: string | null
  rubric: { max_points: number; criteria: { name: string; points: number; descriptor: string }[] } | null
  difficulty: (typeof TEACHER_QUIZ_DIFFICULTIES)[number] | null
  due_date: string | null
  est_minutes: number | null
  custom_reading: { title?: string; url?: string; filePath?: string; notes?: string } | null
  has_content: boolean | null
  status: ItemStatus
  teacher_quiz_id: string | null
  guided_session_id: string | null
  assignment_id: string | null
}

export interface PlanWeek {
  id: string
  plan_id: string
  week_index: number
  date_start: string | null
  date_end: string | null
  theme: string | null
  notes: string | null
  items: PlanItem[]
  /** Code-computed load fields (not persisted; derived for display). */
  load_minutes: number
  over_cap: boolean
}

export interface SemesterPlan {
  id: string
  teacher_id: string
  class_id: string | null
  title: string
  term_start: string | null
  term_end: string | null
  weeks: number
  cadence: PlanCadence
  goals: PlanGoals
  constraints: PlanConstraints
  status: PlanStatus
  generated_by_model: string | null
  week_list: PlanWeek[]
}

// ── Candidate catalog (metadata only — never full text) ───────────────────────

export interface CandidateBook {
  id: string
  title: string
  author: string
  tradition: string
  era: string
  difficulty: string
  tier: 1 | null
  chapter_count: number
  word_count: number
  reading_time_minutes: number
  has_chapter_content: boolean
}
