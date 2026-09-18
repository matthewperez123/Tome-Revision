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
import { sendSeatInvite } from "@/lib/email/billing"

/**
 * School teacher-roster management. Launch model: `subscriptions.seats` caps
 * STUDENTS, not teachers — a school may cover any number of teachers, whose
 * classrooms all draw from the shared student-seat allowance. `school_seats`
 * rows exist only for actual teachers (the admin + explicitly added/invited
 * teachers); there are NO pending placeholder rows sized to the Stripe
 * quantity. Adding a teacher INSERTS a row; removing one DELETES it.
 *
 * Student-seat count changes (billing) go through `/api/school/seats` so
 * Stripe stays the source of truth for quantity.
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
  /** Purchased STUDENT seats (Stripe quantity). */
  seats: number | null
  /** Teachers currently on the plan (incl. the admin). */
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
    .not("teacher_id", "is", null) // exclude outstanding invites (no teacher yet)
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

  // Add the teacher to the roster. No teacher cap — student seats are the
  // billable unit; the global unique(teacher_id) blocks double-seating.
  const { error: insertError } = await admin.from("school_seats").insert({
    subscription_user_id: guard.userId,
    teacher_id: profile.id,
    seat_role: "teacher",
    status: "active",
  })
  if (insertError) {
    if (insertError.code === "23505") {
      return fail("That teacher already holds a seat in a School plan.")
    }
    return fail(insertError.message)
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
  // Teachers aren't a billed quantity — removing one simply deletes the row.
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

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

/** A random URL-safe single-use invite token. */
function randomInviteToken(): string {
  return (crypto.randomUUID() + crypto.randomUUID()).replace(/-/g, "")
}

const InviteInput = z.object({ email: z.string().trim().min(3).max(200) })

/**
 * Invite a teacher to the caller's School plan by email. Inserts a pending
 * roster row with a single-use token and hands off to `sendSeatInvite`.
 * The invitee claims the seat via `/join/seat/[token]`.
 */
export async function inviteTeacherSeat(
  input: z.infer<typeof InviteInput>,
): Promise<ActionResult<{ email: string }>> {
  const parsed = InviteInput.safeParse(input)
  if (!parsed.success) return fail("Enter a valid email address.")
  const email = parsed.data.email.toLowerCase()
  if (!EMAIL_RE.test(email)) return fail("Enter a valid email address.")

  const guard = await requireSchoolAdmin()
  if (!guard.ok) return fail(guard.error)

  const admin = createAdminClient()

  // Record the invitation as a fresh pending row (no placeholder pool — a row
  // per outstanding invite, deleted/activated when claimed).
  const token = randomInviteToken()
  const { error } = await admin.from("school_seats").insert({
    subscription_user_id: guard.userId,
    teacher_id: null,
    seat_role: "teacher",
    status: "pending",
    invite_email: email,
    invite_token: token,
    invited_at: new Date().toISOString(),
  })
  if (error) return fail(error.message)

  await sendSeatInvite(admin, email, { token, adminId: guard.userId })

  revalidatePath("/classroom/school")
  return ok({ email })
}

/**
 * Accept a seat invitation. The signed-in user claims the pending seat tied to
 * `token` (pending → active) and is granted the teacher role. Idempotency: an
 * already-consumed token is simply "no longer valid".
 */
export async function claimSeatInvite(
  token: string,
): Promise<ActionResult<{ ownerId: string }>> {
  const t = typeof token === "string" ? token.trim() : ""
  if (!t) return fail("This invitation link is invalid.")

  let userId: string
  try {
    const { user } = await requireUser()
    userId = user.id
  } catch {
    return fail("Sign in to accept your seat invitation.")
  }

  const admin = createAdminClient()
  const { data: seat } = await admin
    .from("school_seats")
    .select("id, subscription_user_id")
    .eq("invite_token", t)
    .eq("status", "pending")
    .maybeSingle<{ id: string; subscription_user_id: string }>()
  if (!seat) return fail("This invitation is no longer valid.")

  const { error } = await admin
    .from("school_seats")
    .update({
      teacher_id: userId,
      status: "active",
      invite_token: null,
    })
    .eq("id", seat.id)
    .eq("status", "pending")
  if (error) {
    if (error.code === "23505") {
      return fail("You already hold a seat in a School plan.")
    }
    return fail(error.message)
  }

  await admin.from("profiles").update({ role: "teacher" }).eq("id", userId)

  await notify({
    recipientId: seat.subscription_user_id,
    type: "system",
    title: "A teacher joined your School plan",
    body: "Your invitation was accepted and their seat is now active.",
    actionUrl: "/classroom/school",
    actorId: userId,
    entityType: "school_seat",
    entityId: seat.subscription_user_id,
  })

  revalidatePath("/classroom/school")
  return ok({ ownerId: seat.subscription_user_id })
}
