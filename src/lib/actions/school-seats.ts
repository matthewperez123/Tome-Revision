"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  createAdminClient,
  fail,
  notify,
  ok,
  requireUser,
} from "./_shared"
import { getEntitlement } from "@/lib/entitlements/server"

/**
 * School seat roster management. The School subscription owner (the "admin")
 * assigns the teacher accounts their seats cover. Covered teachers are ordinary
 * `profiles.role='teacher'` accounts — a seat just makes their paid educator
 * tools (assignments, gradebook, AI quiz/plan generation, reflection grading)
 * active. The admin always holds seat #1 and cannot be unseated here.
 *
 * Seat changes that affect the *count* (and therefore billing) go through
 * `/api/school/seats` so Stripe stays the source of truth for quantity. These
 * actions only assign already-purchased seats to specific teachers.
 */

const FRIEND_CODE_RE = /^[A-Za-z0-9]{8}$/

export interface SchoolSeatRow {
  teacherId: string
  seatRole: "admin" | "teacher"
  addedAt: string
  displayName: string | null
  username: string | null
  avatarUrl: string | null
}

export interface SchoolRoster {
  /** subscriptions.user_id that owns the plan. */
  adminId: string
  /** Purchased seats (Stripe quantity). */
  seats: number | null
  /** Currently assigned seats (incl. the admin). */
  used: number
  members: SchoolSeatRow[]
}

/** Require the caller to be the admin of an active School subscription. */
async function requireSchoolAdmin(): Promise<
  | { ok: true; userId: string; seats: number | null }
  | { ok: false; error: string }
> {
  const { user } = await requireUser()
  const entitlement = await getEntitlement(user.id)
  if (entitlement.tier !== "school") {
    return { ok: false, error: "No active School subscription." }
  }
  if (entitlement.schoolRole !== "admin") {
    return { ok: false, error: "Only the School plan admin can manage seats." }
  }
  return { ok: true, userId: user.id, seats: entitlement.seats }
}

/** Read the seat roster for the caller's School (admin or covered teacher). */
export async function listSchoolRoster(): Promise<SchoolRoster | null> {
  const { user } = await requireUser()
  const entitlement = await getEntitlement(user.id)
  if (entitlement.tier !== "school" || !entitlement.coveredBy) return null

  const adminId = entitlement.coveredBy
  const admin = createAdminClient()
  const { data: seats } = await admin
    .from("school_seats")
    .select("teacher_id, seat_role, added_at")
    .eq("subscription_user_id", adminId)
    .order("added_at", { ascending: true })

  const rows = (seats ?? []) as {
    teacher_id: string
    seat_role: "admin" | "teacher"
    added_at: string
  }[]

  // Two-step profile fetch (school_seats.teacher_id FK → auth.users blocks
  // PostgREST embedding of profiles).
  const ids = rows.map((r) => r.teacher_id)
  const profileById = new Map<
    string,
    { display_name: string | null; username: string | null; avatar_url: string | null }
  >()
  if (ids.length > 0) {
    const { data: profiles } = await admin
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .in("id", ids)
    for (const p of (profiles ?? []) as {
      id: string
      display_name: string | null
      username: string | null
      avatar_url: string | null
    }[]) {
      profileById.set(p.id, p)
    }
  }

  return {
    adminId,
    seats: entitlement.seats,
    used: rows.length,
    members: rows.map((r) => {
      const p = profileById.get(r.teacher_id)
      return {
        teacherId: r.teacher_id,
        seatRole: r.seat_role,
        addedAt: r.added_at,
        displayName: p?.display_name ?? null,
        username: p?.username ?? null,
        avatarUrl: p?.avatar_url ?? null,
      }
    }),
  }
}

const AddInput = z.object({ query: z.string().trim().min(1).max(120) })

/**
 * Assign a seat to a teacher, resolved by their friend code (8-char) or
 * username. The teacher must be a `profiles.role='teacher'` account and not
 * already hold a seat in any School plan.
 */
export async function addTeacherToSchool(
  input: z.infer<typeof AddInput>,
): Promise<ActionResult<{ teacherId: string }>> {
  const parsed = AddInput.safeParse(input)
  if (!parsed.success) return fail("Enter a teacher's friend code or username.")

  const guard = await requireSchoolAdmin()
  if (!guard.ok) return fail(guard.error)

  const admin = createAdminClient()

  // Resolve the teacher profile.
  const q = parsed.data.query
  const column = FRIEND_CODE_RE.test(q) ? "friend_code" : "username"
  const value = column === "friend_code" ? q.toUpperCase() : q
  const { data: profile } = await admin
    .from("profiles")
    .select("id, role, display_name")
    .eq(column, value)
    .maybeSingle<{ id: string; role: string; display_name: string | null }>()

  if (!profile) return fail("No teacher found for that code or username.")
  if (profile.role !== "teacher") {
    return fail("That account is not a teacher. Seats cover teacher accounts only.")
  }
  if (profile.id === guard.userId) {
    return fail("You already hold the admin seat.")
  }

  // Enforce the purchased seat count (admin seat included in `used`).
  const { count: used } = await admin
    .from("school_seats")
    .select("*", { count: "exact", head: true })
    .eq("subscription_user_id", guard.userId)
  if (guard.seats != null && (used ?? 0) >= guard.seats) {
    return fail(
      `All ${guard.seats} seats are assigned. Add more seats before inviting another teacher.`,
    )
  }

  const { error } = await admin.from("school_seats").insert({
    subscription_user_id: guard.userId,
    teacher_id: profile.id,
    seat_role: "teacher",
  })
  if (error) {
    // Global unique(teacher_id) → already seated in some school.
    if (error.code === "23505") {
      return fail("That teacher already holds a seat in a School plan.")
    }
    return fail(error.message)
  }

  await notify({
    recipientId: profile.id,
    type: "system",
    title: "You've been added to a School plan",
    body: "Your Tome educator tools are now unlocked.",
    actionUrl: "/classroom",
    actorId: guard.userId,
    entityType: "school_seat",
    entityId: guard.userId,
  })

  revalidatePath("/classroom/school")
  return ok({ teacherId: profile.id })
}

const RemoveInput = z.object({ teacherId: z.string().uuid() })

/** Release a teacher's seat. The admin seat cannot be released here. */
export async function removeTeacherFromSchool(
  input: z.infer<typeof RemoveInput>,
): Promise<ActionResult<void>> {
  const parsed = RemoveInput.safeParse(input)
  if (!parsed.success) return fail("Invalid teacher id.")

  const guard = await requireSchoolAdmin()
  if (!guard.ok) return fail(guard.error)

  if (parsed.data.teacherId === guard.userId) {
    return fail("The admin seat can't be removed. Cancel the plan instead.")
  }

  const admin = createAdminClient()
  const { error } = await admin
    .from("school_seats")
    .delete()
    .eq("subscription_user_id", guard.userId)
    .eq("teacher_id", parsed.data.teacherId)
    .eq("seat_role", "teacher")
  if (error) return fail(error.message)

  revalidatePath("/classroom/school")
  return ok(undefined)
}
