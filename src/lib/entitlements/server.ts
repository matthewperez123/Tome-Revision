/**
 * Server-side entitlements — the single source of truth for what a paid plan
 * unlocks. Reads the canonical `public.subscriptions` row via the service role
 * (bypasses RLS) so the decision can't be spoofed from the client.
 *
 * `import "server-only"` keeps this out of any client bundle. The UI mirrors
 * entitlement via `useEntitlement()`, but every action that costs money is
 * gated by calling into here from a route handler or server component.
 */
import "server-only"

import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import { isFreeSample, FREE_BOOK_LIMIT } from "@/lib/stripe/free-books"
import type { UserRole } from "@/lib/navigation"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export type EntitlementTier = "free" | "solo" | "family" | "school"

export interface EntitlementFeatures {
  /** Read the whole catalog (vs. only the free sampler). */
  fullLibrary: boolean
  /** No daily cap on Virgil messages. */
  unlimitedVirgil: boolean
  /** Free-tier Virgil messages allowed per UTC day (null = unlimited). */
  virgilDailyLimit: number | null
  /** Scholar / Master ("advanced") Trials. */
  advancedTrials: boolean
  /**
   * Paid educator tools: creating assignments, the gradebook, the AI quiz
   * generator, the semester planner, and Virgil reflection grading. Only the
   * School tier unlocks these — free Classroom teachers and paid *readers*
   * (Solo/Family) do not.
   */
  teacherTools: boolean
}

export interface Entitlement {
  tier: EntitlementTier
  status: string | null
  /** Subscription is `active` or `trialing`. */
  isActive: boolean
  /** Max books readable (null = unlimited). */
  bookLimit: number | null
  /** School plans only: paid teacher seats on the subscription (else null). */
  seats: number | null
  /** School plans only: 'admin' (the purchaser) or 'teacher' (covered). */
  schoolRole: "admin" | "teacher" | null
  /**
   * School plans only: the `subscriptions.user_id` that pays for this account.
   * Equal to the user's own id when they are the admin, otherwise the admin's.
   */
  coveredBy: string | null
  features: EntitlementFeatures
}

/** Free accounts get the foundational sampler and a capped Virgil. */
const FREE_FEATURES: EntitlementFeatures = {
  fullLibrary: false,
  unlimitedVirgil: false,
  virgilDailyLimit: 10,
  advancedTrials: false,
  teacherTools: false,
}

/** Paid *reader* tiers (Solo/Family) unlock the full reading product. */
const PAID_READER_FEATURES: EntitlementFeatures = {
  fullLibrary: true,
  unlimitedVirgil: true,
  virgilDailyLimit: null,
  advancedTrials: true,
  teacherTools: false,
}

/** School unlocks everything a reader gets, plus the paid educator tools. */
const SCHOOL_FEATURES: EntitlementFeatures = {
  ...PAID_READER_FEATURES,
  teacherTools: true,
}

function freeEntitlement(status: string | null): Entitlement {
  return {
    tier: "free",
    status,
    isActive: false,
    bookLimit: FREE_BOOK_LIMIT,
    seats: null,
    schoolRole: null,
    coveredBy: null,
    features: FREE_FEATURES,
  }
}

function readerEntitlement(
  tier: "solo" | "family",
  status: string | null,
): Entitlement {
  return {
    tier,
    status,
    isActive: true,
    bookLimit: null,
    seats: null,
    schoolRole: null,
    coveredBy: null,
    features: PAID_READER_FEATURES,
  }
}

function schoolEntitlement(args: {
  status: string | null
  seats: number | null
  schoolRole: "admin" | "teacher"
  coveredBy: string
}): Entitlement {
  return {
    tier: "school",
    status: args.status,
    isActive: true,
    bookLimit: null,
    seats: args.seats,
    schoolRole: args.schoolRole,
    coveredBy: args.coveredBy,
    features: SCHOOL_FEATURES,
  }
}

function isActiveStatus(status: string | null): boolean {
  return status === "active" || status === "trialing"
}

/**
 * Resolve an account's entitlement. Order matters:
 *   1. own School subscription (the admin/purchaser),
 *   2. a seat covered by someone else's active School subscription,
 *   3. own Solo/Family reader subscription,
 *   4. Free.
 * Only `active`/`trialing` subscriptions confer a paid tier; everything else
 * (no row, past_due, canceled, incomplete, …) falls back to Free.
 */
export async function getEntitlement(userId: string): Promise<Entitlement> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("subscriptions")
    .select("tier, status, seats")
    .eq("user_id", userId)
    .maybeSingle()

  const status = (data?.status as string | null) ?? null
  const tier = (data?.tier as string | null) ?? null
  const seats = (data?.seats as number | null) ?? null

  // 1. The purchasing admin of a School subscription.
  if (isActiveStatus(status) && tier === "school") {
    return schoolEntitlement({
      status,
      seats,
      schoolRole: "admin",
      coveredBy: userId,
    })
  }

  // 2. A teacher covered by someone else's active School subscription.
  const covered = await resolveCoveringSchool(admin, userId)
  if (covered) {
    return schoolEntitlement({
      status: covered.status,
      seats: covered.seats,
      schoolRole: "teacher",
      coveredBy: covered.ownerId,
    })
  }

  // 3. A paid reader (Solo/Family).
  if (isActiveStatus(status) && (tier === "solo" || tier === "family")) {
    return readerEntitlement(tier, status)
  }

  // 4. Free.
  return freeEntitlement(status)
}

/**
 * Find an active School subscription that pays for `userId` via a `school_seats`
 * row (the user is a covered teacher, not the purchaser). Returns the owning
 * subscription's id, status, and seat count, or null.
 */
async function resolveCoveringSchool(
  admin: SupabaseClient<any, "public", any>,
  userId: string,
): Promise<{ ownerId: string; status: string | null; seats: number | null } | null> {
  const { data: seat } = await admin
    .from("school_seats")
    .select("subscription_user_id")
    .eq("teacher_id", userId)
    .maybeSingle()
  const ownerId = (seat?.subscription_user_id as string | null) ?? null
  if (!ownerId) return null
  if (ownerId === userId) return null // own-admin case handled by the caller

  const { data: sub } = await admin
    .from("subscriptions")
    .select("status, seats, tier")
    .eq("user_id", ownerId)
    .maybeSingle()
  const status = (sub?.status as string | null) ?? null
  const tier = (sub?.tier as string | null) ?? null
  if (tier !== "school" || !isActiveStatus(status)) return null

  return { ownerId, status, seats: (sub?.seats as number | null) ?? null }
}

/**
 * True when `userId` has an active School entitlement (as the admin OR a covered
 * teacher). The gate for paid educator tools.
 */
export async function hasActiveSchoolEntitlement(userId: string): Promise<boolean> {
  const entitlement = await getEntitlement(userId)
  return entitlement.tier === "school" && entitlement.features.teacherTools
}

/** Read a profile's role via the service role (independent of the caller's RLS). */
export async function getUserRole(userId: string): Promise<UserRole | null> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()
  return ((data?.role as UserRole | null) ?? null)
}

/**
 * Authoritative "may this account open `bookId`?" check — the server twin of
 * `canReadBook`. Teachers & students read everything (classroom context);
 * paid readers read everything; free readers get only the foundational sampler.
 */
export async function canUserReadBook(userId: string, bookId: string): Promise<boolean> {
  const role = await getUserRole(userId)
  if (role === "teacher" || role === "student") return true
  const entitlement = await getEntitlement(userId)
  if (entitlement.features.fullLibrary) return true
  return isFreeSample(bookId)
}
