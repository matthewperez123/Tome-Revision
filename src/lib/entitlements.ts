import "server-only"

import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"
import { getEntitlement, type EntitlementTier } from "@/lib/entitlements/server"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

/** Subscription statuses that still confer entitlement. */
const ACTIVE_STATUSES = ["active", "trialing", "past_due"] as const

function isActive(status: string | null | undefined): boolean {
  return !!status && (ACTIVE_STATUSES as readonly string[]).includes(status)
}

/**
 * True when the user personally holds a subscription in an entitling state
 * (`active`, `trialing`, or `past_due`). Reads the canonical `subscriptions`
 * row via the service role so it can't be spoofed from the client.
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("subscriptions")
    .select("status")
    .eq("user_id", userId)
    .maybeSingle()
  return isActive(data?.status as string | null | undefined)
}

/**
 * True when the user may read the full library. Either:
 *   1. they hold their own active subscription (any paid tier), or
 *   2. they are a member of a classroom whose owning teacher occupies a
 *      `school_seats` seat under an active School subscription.
 *
 * This is the gate the existing paywall surface consults; it invents no new
 * paywall of its own.
 */
export async function hasLibraryAccess(userId: string): Promise<boolean> {
  if (await hasActiveSubscription(userId)) return true

  const admin = createAdminClient()

  // Classrooms this user belongs to (the member's id is `student_id`).
  const { data: memberships } = await admin
    .from("classroom_members")
    .select("classroom_id")
    .eq("student_id", userId)
  const classroomIds = (memberships ?? [])
    .map((m) => m.classroom_id as string | null)
    .filter((id): id is string => !!id)
  if (classroomIds.length === 0) return false

  // The teachers who own those classrooms.
  const { data: classrooms } = await admin
    .from("classrooms")
    .select("teacher_id")
    .in("id", classroomIds)
  const teacherIds = Array.from(
    new Set(
      (classrooms ?? [])
        .map((c) => c.teacher_id as string | null)
        .filter((id): id is string => !!id),
    ),
  )
  if (teacherIds.length === 0) return false

  // A seat held by any of those teachers, tied to a School subscription owner.
  const { data: seats } = await admin
    .from("school_seats")
    .select("subscription_user_id")
    .in("teacher_id", teacherIds)
  const ownerIds = Array.from(
    new Set(
      (seats ?? [])
        .map((s) => s.subscription_user_id as string | null)
        .filter((id): id is string => !!id),
    ),
  )
  if (ownerIds.length === 0) return false

  // Is any owning School subscription active?
  const { data: owning } = await admin
    .from("subscriptions")
    .select("status, tier")
    .in("user_id", ownerIds)
  return (owning ?? []).some(
    (s) => (s.tier as string | null) === "school" && isActive(s.status as string | null),
  )
}

// ── Canonical entitlement helpers ─────────────────────────────────────────
// The ONLY entitlement helpers billing paths should call. Prefer these over
// re-implementing tier/role checks inline.

/** Minimal profile shape the role predicates need. */
export interface ProfileLike {
  role?: string | null
}

/** Thrown by `assertVirgilAccess` when the profile isn't a teacher. */
export class VirgilAccessError extends Error {
  constructor(message = "Virgil is available to teacher accounts only.") {
    super(message)
    this.name = "VirgilAccessError"
  }
}

/** The account's resolved billing tier (`free` when no active plan). */
export async function getTier(userId: string): Promise<EntitlementTier> {
  const entitlement = await getEntitlement(userId)
  return entitlement.tier
}

/** Whether a profile holds the teacher role. */
export function isTeacher(profile: ProfileLike | null | undefined): boolean {
  return profile?.role === "teacher"
}

/**
 * Guard for Virgil surfaces (teacher-only). Throws `VirgilAccessError` when the
 * profile isn't a teacher so callers can map it to a 403.
 */
export function assertVirgilAccess(profile: ProfileLike | null | undefined): void {
  if (!isTeacher(profile)) throw new VirgilAccessError()
}
