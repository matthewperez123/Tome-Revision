"use server"

// Read-side of Questions Available (launch brief 2.8): the chip and the
// manage-page ledger. Teacher-only — students (and readers) get null so no
// balance ever renders for them. Writes stay in src/lib/credits/*.

import { createAdminClient, requireUser } from "@/lib/actions/_shared"
import {
  QUESTIONS_ACCRUAL_MONTHS,
  QUESTIONS_PER_SEAT_PER_MONTH,
} from "@/lib/billing/config"

export interface QuestionsPoolSummary {
  poolId: string
  classroomId: string | null
  classroomName: string | null
  balance: number
  monthlyGrant: number
  accrualCap: number
}

export interface QuestionsSummary {
  balance: number
  monthlyGrant: number
  accrualCap: number
  /** Below QUESTIONS_LOW_BALANCE_RATIO of a month's grant. */
  low: boolean
  exhausted: boolean
  pools: QuestionsPoolSummary[]
  /** Tooltip copy, derived from config so numbers can't drift. */
  renewalCopy: string
}

interface PoolRow {
  id: string
  classroom_id: string | null
  balance: number
  monthly_grant: number
  accrual_cap: number
}

/** Balance summary across every pool the caller owns. Null for non-teachers. */
export async function getQuestionsSummary(): Promise<QuestionsSummary | null> {
  try {
    const { user, supabase } = await requireUser()
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<{ role: string | null }>()
    if (profile?.role !== "teacher") return null

    const admin = createAdminClient()
    const { data } = await admin
      .from("question_credit_pools")
      .select("id, classroom_id, balance, monthly_grant, accrual_cap")
      .eq("owner_id", user.id)
    const rows = (data ?? []) as PoolRow[]

    const classroomIds = rows
      .map((r) => r.classroom_id)
      .filter((id): id is string => Boolean(id))
    const names = new Map<string, string>()
    if (classroomIds.length > 0) {
      const { data: rooms } = await admin
        .from("classrooms")
        .select("id, name")
        .in("id", classroomIds)
      for (const room of (rooms ?? []) as { id: string; name: string }[]) {
        names.set(room.id, room.name)
      }
    }

    const pools: QuestionsPoolSummary[] = rows.map((r) => ({
      poolId: r.id,
      classroomId: r.classroom_id,
      classroomName: r.classroom_id ? (names.get(r.classroom_id) ?? null) : null,
      balance: r.balance,
      monthlyGrant: r.monthly_grant,
      accrualCap: r.accrual_cap,
    }))
    const balance = pools.reduce((sum, p) => sum + p.balance, 0)
    const monthlyGrant = pools.reduce((sum, p) => sum + p.monthlyGrant, 0)
    const accrualCap = pools.reduce((sum, p) => sum + p.accrualCap, 0)

    return {
      balance,
      monthlyGrant,
      accrualCap,
      low: monthlyGrant > 0 && balance > 0 && balance < monthlyGrant * 0.2,
      exhausted: balance <= 0,
      pools,
      renewalCopy: `Renews ${QUESTIONS_PER_SEAT_PER_MONTH.classroom} per student every 30 days · holds up to ${QUESTIONS_ACCRUAL_MONTHS} months`,
    }
  } catch {
    return null
  }
}

export interface QuestionsLedgerEntry {
  id: string
  createdAt: string
  delta: number
  reason: string
  classroomName: string | null
}

/** Last 30 days of ledger movement across the caller's pools (manage page). */
export async function getQuestionsLedger(): Promise<QuestionsLedgerEntry[]> {
  try {
    const { user, supabase } = await requireUser()
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle<{ role: string | null }>()
    if (profile?.role !== "teacher") return []

    const admin = createAdminClient()
    const { data: poolRows } = await admin
      .from("question_credit_pools")
      .select("id, classroom_id")
      .eq("owner_id", user.id)
    const pools = (poolRows ?? []) as { id: string; classroom_id: string | null }[]
    if (pools.length === 0) return []

    const names = new Map<string, string>()
    const classroomIds = pools
      .map((p) => p.classroom_id)
      .filter((id): id is string => Boolean(id))
    if (classroomIds.length > 0) {
      const { data: rooms } = await admin
        .from("classrooms")
        .select("id, name")
        .in("id", classroomIds)
      for (const room of (rooms ?? []) as { id: string; name: string }[]) {
        names.set(room.id, room.name)
      }
    }
    const poolClassroom = new Map(pools.map((p) => [p.id, p.classroom_id]))

    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    const { data: ledger } = await admin
      .from("question_credit_ledger")
      .select("id, pool_id, delta, reason, created_at")
      .in(
        "pool_id",
        pools.map((p) => p.id),
      )
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(100)

    return ((ledger ?? []) as {
      id: string
      pool_id: string
      delta: number
      reason: string
      created_at: string
    }[]).map((row) => {
      const classroomId = poolClassroom.get(row.pool_id) ?? null
      return {
        id: row.id,
        createdAt: row.created_at,
        delta: row.delta,
        reason: row.reason,
        classroomName: classroomId ? (names.get(classroomId) ?? null) : null,
      }
    })
  } catch {
    return []
  }
}
