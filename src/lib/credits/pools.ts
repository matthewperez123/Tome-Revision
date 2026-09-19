import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import { getPlanContext, type PlanTier } from "@/lib/entitlements/server"
import {
  FAMILY_STUDENT_LIMIT,
  QUESTIONS_ACCRUAL_MONTHS,
  QUESTIONS_FREE_TEACHER_PER_MONTH,
  QUESTIONS_PAID_TEACHER_PERSONAL_PER_MONTH,
  QUESTIONS_PER_SEAT_PER_MONTH,
} from "@/lib/billing/config"

type Admin = SupabaseClient<any, "public", any>
const admin = (): Admin =>
  createAdminClientUntyped() as unknown as Admin

/**
 * Size every Questions pool a teacher owns to their current plan + rosters.
 * Run on classroom create, on every subscription change (webhook), and daily
 * by the question-grants cron. Idempotent; freshly created pools receive
 * their first month's grant immediately.
 *
 * Sizing (launch brief 2.6):
 * - classroom pools: enrolled students × QUESTIONS_PER_SEAT_PER_MONTH[tier]
 * - free teachers (and grandfathered Solo): QUESTIONS_FREE_TEACHER_PER_MONTH
 *   on their single classroom; personal pool 0
 * - paid teachers: personal pool QUESTIONS_PAID_TEACHER_PERSONAL_PER_MONTH
 * - family: household classroom pool = FAMILY_STUDENT_LIMIT × family rate
 * - accrual_cap = monthly_grant × QUESTIONS_ACCRUAL_MONTHS
 */
export async function syncPoolSizes(ownerId: string): Promise<void> {
  const db = admin()
  const plan = await getPlanContext(ownerId)
  const paid =
    plan.tier === "classroom" || plan.tier === "school" || plan.tier === "family"

  const { data: rooms } = await db
    .from("classrooms")
    .select("id")
    .eq("teacher_id", ownerId)
    .order("created_at", { ascending: true })
  const roomIds = ((rooms ?? []) as { id: string }[]).map((r) => r.id)

  // Enrolled students per classroom (role='student' members).
  const enrolled = new Map<string, number>()
  if (roomIds.length > 0) {
    const { data: members } = await db
      .from("classroom_members")
      .select("classroom_id")
      .in("classroom_id", roomIds)
      .eq("role", "student")
    for (const m of (members ?? []) as { classroom_id: string }[]) {
      enrolled.set(m.classroom_id, (enrolled.get(m.classroom_id) ?? 0) + 1)
    }
  }

  const grants: { classroomId: string | null; monthly: number }[] = []
  for (const [i, classroomId] of roomIds.entries()) {
    grants.push({
      classroomId,
      monthly: classroomMonthlyGrant(plan.tier, enrolled.get(classroomId) ?? 0, i),
    })
  }
  grants.push({
    classroomId: null,
    monthly: paid ? QUESTIONS_PAID_TEACHER_PERSONAL_PER_MONTH : 0,
  })

  for (const g of grants) {
    await syncOnePool(db, ownerId, g.classroomId, g.monthly, paid)
  }
}

function classroomMonthlyGrant(
  tier: PlanTier,
  students: number,
  classroomIndex: number,
): number {
  switch (tier) {
    case "classroom":
      return students * QUESTIONS_PER_SEAT_PER_MONTH.classroom
    case "school":
      return students * QUESTIONS_PER_SEAT_PER_MONTH.school
    case "family":
      return FAMILY_STUDENT_LIMIT * QUESTIONS_PER_SEAT_PER_MONTH.family
    default:
      // Free (and grandfathered Solo): one classroom gets the free grant.
      return classroomIndex === 0 ? QUESTIONS_FREE_TEACHER_PER_MONTH : 0
  }
}

async function syncOnePool(
  db: Admin,
  ownerId: string,
  classroomId: string | null,
  monthly: number,
  paid: boolean,
): Promise<void> {
  const { data: poolId, error } = await db.rpc("ensure_question_pool", {
    p_owner: ownerId,
    p_classroom: classroomId,
  })
  if (error || !poolId) return

  const cap = monthly * QUESTIONS_ACCRUAL_MONTHS
  await db
    .from("question_credit_pools")
    .update({
      monthly_grant: monthly,
      accrual_cap: cap,
      updated_at: new Date().toISOString(),
    })
    .eq("id", poolId as string)

  // First month lands immediately on a brand-new pool (no ledger history).
  if (monthly > 0) {
    const { count } = await db
      .from("question_credit_ledger")
      .select("*", { count: "exact", head: true })
      .eq("pool_id", poolId as string)
    if ((count ?? 0) === 0) {
      await db.rpc("grant_question_credits", {
        p_pool: poolId as string,
        p_count: monthly,
        p_reason: paid ? "seat_grant" : "free_tier",
        p_stripe_event_id: null,
      })
    }
  }
}

/** The personal-pool id for a teacher (created on demand). */
export async function ensurePersonalPool(ownerId: string): Promise<string | null> {
  const db = admin()
  const { data, error } = await db.rpc("ensure_question_pool", {
    p_owner: ownerId,
    p_classroom: null,
  })
  return error ? null : ((data as string) ?? null)
}

/** The classroom-pool id for (owner, classroom), created on demand. */
export async function ensureClassroomPool(
  ownerId: string,
  classroomId: string,
): Promise<string | null> {
  const db = admin()
  const { data, error } = await db.rpc("ensure_question_pool", {
    p_owner: ownerId,
    p_classroom: classroomId,
  })
  return error ? null : ((data as string) ?? null)
}
