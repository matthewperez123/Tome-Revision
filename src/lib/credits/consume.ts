import "server-only"

import type { SupabaseClient } from "@supabase/supabase-js"
import { createAdminClient } from "@/lib/supabase/admin"
import { ensurePersonalPool } from "@/lib/credits/pools"

// The credit tables/RPCs postdate the generated database.types — same
// untyped-admin pattern as pools.ts.
type Admin = SupabaseClient<any, "public", any>
const admin = (): Admin => createAdminClient() as unknown as Admin

/** Friendly copy for an exhausted balance (402 payloads and chat replies). */
export const INSUFFICIENT_QUESTIONS_MESSAGE =
  "You're out of Questions Available. Add questions from Billing, or wait for your monthly renewal."

export class InsufficientQuestionsError extends Error {
  constructor() {
    super("insufficient_questions")
    this.name = "InsufficientQuestionsError"
  }
}

export function isInsufficientQuestions(err: unknown): boolean {
  return (
    err instanceof InsufficientQuestionsError ||
    (err instanceof Error && err.message.includes("insufficient_questions"))
  )
}

interface PoolRow {
  id: string
  classroom_id: string | null
  balance: number
}

/**
 * The pool a teacher's generation should draw from: their classroom pools
 * first (largest balance first — seat grants live there), then the personal
 * pool (paid monthly grant + topups). If no pool covers `count`, return the
 * richest pool anyway so consume_question_credits raises the honest
 * `insufficient_questions`; if the teacher has no pools at all, create the
 * personal one.
 */
export async function findSpendablePool(
  userId: string,
  count: number,
): Promise<string | null> {
  const db = admin()
  const { data } = await db
    .from("question_credit_pools")
    .select("id, classroom_id, balance")
    .eq("owner_id", userId)
  const pools = (data ?? []) as PoolRow[]
  if (pools.length === 0) return ensurePersonalPool(userId)

  const classroom = pools
    .filter((p) => p.classroom_id !== null)
    .sort((a, b) => b.balance - a.balance)
  const personal = pools.find((p) => p.classroom_id === null)
  const ordered = [...classroom, ...(personal ? [personal] : [])]

  const covering = ordered.find((p) => p.balance >= count)
  if (covering) return covering.id

  return ordered.sort((a, b) => b.balance - a.balance)[0]?.id ?? null
}

/** The pool for an assignment's classroom (owner = classrooms.teacher_id). */
export async function classroomPoolForAssignment(
  classroomId: string,
): Promise<string | null> {
  const db = admin()
  const { data: room } = await db
    .from("classrooms")
    .select("teacher_id")
    .eq("id", classroomId)
    .maybeSingle<{ teacher_id: string | null }>()
  if (!room?.teacher_id) return null
  const { data, error } = await db.rpc("ensure_question_pool", {
    p_owner: room.teacher_id,
    p_classroom: classroomId,
  })
  return error ? null : ((data as string) ?? null)
}

/**
 * Charge `count` Questions from a pool, run `fn`, refund on failure.
 * Consume-first so concurrent requests can't overdraw; the refund restores
 * the balance if generation throws, so a failed call never costs anything.
 */
export async function withQuestionCredits<T>(
  poolId: string,
  count: number,
  ref: Record<string, string>,
  fn: () => Promise<T>,
): Promise<T> {
  if (count <= 0) return fn()
  const db = admin()

  const { error: consumeErr } = await db.rpc("consume_question_credits", {
    p_pool: poolId,
    p_count: count,
    p_reason: "generate",
    p_ref: ref,
  })
  if (consumeErr) {
    if (consumeErr.message.includes("insufficient_questions")) {
      throw new InsufficientQuestionsError()
    }
    throw new Error(consumeErr.message)
  }

  try {
    return await fn()
  } catch (err) {
    const { error: refundErr } = await db.rpc("refund_question_credits", {
      p_pool: poolId,
      p_count: count,
      p_ref: ref,
    })
    if (refundErr) {
      console.error(
        `[questions] refund of ${count} to pool ${poolId} failed: ${refundErr.message}`,
      )
    }
    throw err
  }
}
