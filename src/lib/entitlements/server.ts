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
import {
  FAMILY_STUDENT_LIMIT,
  FREE_TEACHER_CLASSROOM_LIMIT,
  FREE_TEACHER_STUDENT_LIMIT,
  MIN_STUDENT_SEATS,
  SCHOOL_MIN_SEATS,
} from "@/lib/billing/config"
import type { UserRole } from "@/lib/navigation"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export type EntitlementTier = "free" | "solo" | "family" | "classroom" | "school"

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
  tier: "solo" | "family" | "classroom",
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

  // 3. A paid reader/teacher plan (Solo grandfathered, Family, Classroom).
  if (
    isActiveStatus(status) &&
    (tier === "solo" || tier === "family" || tier === "classroom")
  ) {
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
 * Teachers are free forever: every account with `profiles.role = 'teacher'`
 * gets the full educator toolset (assignments, gradebook, quiz builder,
 * planner). What paid plans buy is student SEATS and Questions, not tools.
 * This is the sole gate for educator features.
 */
export async function hasEducatorTools(userId: string): Promise<boolean> {
  return (await getUserRole(userId)) === "teacher"
}

/** The launch billing plans a teacher can be on. */
export type PlanTier = "free_teacher" | "classroom" | "school" | "family" | "solo"

export interface PlanContext {
  tier: PlanTier
  status: string | null
  /** Student seats on the paying subscription (null = none/uncapped-by-plan). */
  seats: number | null
  /**
   * The `subscriptions.user_id` that pays for this teacher. Equal to the
   * teacher's own id unless they're covered by someone else's School plan;
   * null on the free tier.
   */
  coveringSubscriptionUserId: string | null
}

/**
 * Resolve which billing plan governs a teacher. Order:
 *   1. own active classroom/school/family subscription,
 *   2. a school_seats row covered by someone else's active School plan,
 *   3. own grandfathered Solo subscription,
 *   4. free teacher.
 */
export async function getPlanContext(teacherId: string): Promise<PlanContext> {
  const admin = createAdminClient()
  const { data } = await admin
    .from("subscriptions")
    .select("tier, status, seats")
    .eq("user_id", teacherId)
    .maybeSingle()

  const status = (data?.status as string | null) ?? null
  const tier = (data?.tier as string | null) ?? null
  const seats = (data?.seats as number | null) ?? null

  if (
    isActiveStatus(status) &&
    (tier === "classroom" || tier === "school" || tier === "family")
  ) {
    return {
      tier,
      status,
      seats: tier === "family" ? FAMILY_STUDENT_LIMIT : seats,
      coveringSubscriptionUserId: teacherId,
    }
  }

  const covered = await resolveCoveringSchool(admin, teacherId)
  if (covered) {
    return {
      tier: "school",
      status: covered.status,
      seats: covered.seats,
      coveringSubscriptionUserId: covered.ownerId,
    }
  }

  if (isActiveStatus(status) && tier === "solo") {
    // Grandfathered Solo: full reading, but seat limits mirror the free tier.
    return { tier: "solo", status, seats: null, coveringSubscriptionUserId: teacherId }
  }

  return { tier: "free_teacher", status, seats: null, coveringSubscriptionUserId: null }
}

export interface SeatAllowance {
  tier: PlanTier
  /** Max distinct students the plan covers. */
  allowance: number
  /** Distinct students currently enrolled across the counted classrooms. */
  used: number
  /** The paying `subscriptions.user_id` (null on the free tier). */
  payerId: string | null
}

/**
 * Student-seat allowance vs. usage for a teacher's governing plan.
 * School plans share one allowance across every covered teacher: usage is
 * the count of DISTINCT students across all classrooms owned or co-taught
 * by the admin and every active-seat teacher. Other plans count only the
 * teacher's own classrooms.
 */
export async function getSeatAllowance(teacherId: string): Promise<SeatAllowance> {
  const admin = createAdminClient()
  const plan = await getPlanContext(teacherId)

  if (plan.tier === "school" && plan.coveringSubscriptionUserId) {
    const ownerId = plan.coveringSubscriptionUserId
    const { data: seatRows } = await admin
      .from("school_seats")
      .select("teacher_id")
      .eq("subscription_user_id", ownerId)
      .eq("status", "active")
    const teacherIds = new Set<string>([ownerId])
    for (const row of seatRows ?? []) {
      const id = (row as { teacher_id: string | null }).teacher_id
      if (id) teacherIds.add(id)
    }
    const used = await countDistinctStudents(admin, [...teacherIds])
    return {
      tier: plan.tier,
      allowance: plan.seats ?? SCHOOL_MIN_SEATS,
      used,
      payerId: ownerId,
    }
  }

  const used = await countDistinctStudents(admin, [teacherId])
  if (plan.tier === "classroom") {
    return {
      tier: plan.tier,
      allowance: plan.seats ?? MIN_STUDENT_SEATS,
      used,
      payerId: teacherId,
    }
  }
  if (plan.tier === "family") {
    return { tier: plan.tier, allowance: FAMILY_STUDENT_LIMIT, used, payerId: teacherId }
  }
  // free_teacher + grandfathered solo → free classroom limits.
  return {
    tier: plan.tier,
    allowance: FREE_TEACHER_STUDENT_LIMIT,
    used,
    payerId: plan.tier === "solo" ? teacherId : null,
  }
}

/**
 * How many classrooms a teacher may own (null = unlimited). Only the free
 * tier (and grandfathered Solo, which never bought seats) is capped.
 */
export async function getClassroomAllowance(teacherId: string): Promise<number | null> {
  const plan = await getPlanContext(teacherId)
  return plan.tier === "free_teacher" || plan.tier === "solo"
    ? FREE_TEACHER_CLASSROOM_LIMIT
    : null
}

/**
 * Distinct students across every classroom owned (classrooms.teacher_id) or
 * staffed (classroom_members owner/co_teacher) by the given teachers.
 */
async function countDistinctStudents(
  admin: SupabaseClient<any, "public", any>,
  teacherIds: string[],
): Promise<number> {
  if (teacherIds.length === 0) return 0

  const [{ data: owned }, { data: staffed }] = await Promise.all([
    admin.from("classrooms").select("id").in("teacher_id", teacherIds),
    admin
      .from("classroom_members")
      .select("classroom_id")
      .in("student_id", teacherIds)
      .in("role", ["owner", "co_teacher"]),
  ])

  const classroomIds = new Set<string>()
  for (const row of owned ?? []) {
    const id = (row as { id: string | null }).id
    if (id) classroomIds.add(id)
  }
  for (const row of staffed ?? []) {
    const id = (row as { classroom_id: string | null }).classroom_id
    if (id) classroomIds.add(id)
  }
  if (classroomIds.size === 0) return 0

  const { data: students } = await admin
    .from("classroom_members")
    .select("student_id")
    .in("classroom_id", [...classroomIds])
    .eq("role", "student")
  const distinct = new Set<string>()
  for (const row of students ?? []) {
    const id = (row as { student_id: string | null }).student_id
    if (id) distinct.add(id)
  }
  return distinct.size
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
