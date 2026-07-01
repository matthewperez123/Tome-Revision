import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient as createAdminClientUntyped } from "@/lib/supabase/admin"
import type { SupabaseClient } from "@supabase/supabase-js"

const createAdminClient = () =>
  createAdminClientUntyped() as unknown as SupabaseClient<any, "public", any>

export const runtime = "nodejs"

/** A subscription status that still confers entitlement. */
function isLiveStatus(status: string | null): boolean {
  return status === "active" || status === "trialing" || status === "past_due"
}

/**
 * Assign a teacher to a seat on the caller's School subscription.
 *
 * Auth: the caller must be a `teacher` who OWNS an active School subscription
 * (`subscriptions.user_id = caller`, tier='school'). Body: { teacherEmail }.
 *
 * Guard: the number of occupied seats (`school_seats` rows for this owner —
 * the admin's own seat #1 counts) must be `< subscriptions.seats`, else 402.
 *
 * On success: inserts `school_seats { subscription_user_id: owner, teacher_id,
 * seat_role: 'teacher' }` and sets that teacher's `profiles.role = 'teacher'`
 * so they gain the covered entitlement immediately.
 */
export async function POST(req: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: "Sign in to invite teachers." }, { status: 401 })
  }

  let body: { teacherEmail?: unknown }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }
  const teacherEmail =
    typeof body.teacherEmail === "string" ? body.teacherEmail.trim().toLowerCase() : ""
  if (!teacherEmail || !teacherEmail.includes("@")) {
    return NextResponse.json({ error: "A teacher email is required." }, { status: 400 })
  }

  const admin = createAdminClient()

  // Caller must be a teacher.
  const { data: profile } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle()
  if ((profile?.role as string | null) !== "teacher") {
    return NextResponse.json({ error: "Only teachers can invite." }, { status: 403 })
  }

  // Caller must OWN an active School subscription.
  const { data: sub } = await admin
    .from("subscriptions")
    .select("tier, status, seats")
    .eq("user_id", user.id)
    .maybeSingle()
  const tier = (sub?.tier as string | null) ?? null
  const status = (sub?.status as string | null) ?? null
  const seats = (sub?.seats as number | null) ?? null
  if (tier !== "school" || !isLiveStatus(status) || !seats || seats < 1) {
    return NextResponse.json(
      { error: "You need an active School subscription to invite teachers." },
      { status: 403 },
    )
  }

  // Seat-limit guard (the admin's own seat counts toward the total).
  const { count: occupied } = await admin
    .from("school_seats")
    .select("id", { count: "exact", head: true })
    .eq("subscription_user_id", user.id)
  if ((occupied ?? 0) >= seats) {
    return NextResponse.json({ error: "seat limit reached" }, { status: 402 })
  }

  // Resolve the invited teacher's account by email (service-role auth lookup).
  const teacherId = await findUserIdByEmail(admin, teacherEmail)
  if (!teacherId) {
    return NextResponse.json(
      { error: "No Tome account found for that email." },
      { status: 404 },
    )
  }
  if (teacherId === user.id) {
    return NextResponse.json(
      { error: "You already hold the admin seat." },
      { status: 400 },
    )
  }

  // A teacher can occupy only one seat globally (UNIQUE teacher_id).
  const { data: existingSeat } = await admin
    .from("school_seats")
    .select("subscription_user_id")
    .eq("teacher_id", teacherId)
    .maybeSingle()
  if (existingSeat) {
    if ((existingSeat.subscription_user_id as string) === user.id) {
      return NextResponse.json({ ok: true, alreadySeated: true })
    }
    return NextResponse.json(
      { error: "That teacher is already on another school's plan." },
      { status: 409 },
    )
  }

  // Assign the seat + grant the teacher role (covered entitlement).
  const { error: seatErr } = await admin.from("school_seats").insert({
    subscription_user_id: user.id,
    teacher_id: teacherId,
    seat_role: "teacher",
  })
  if (seatErr) {
    // A concurrent insert may have taken the last seat / this teacher.
    return NextResponse.json({ error: "Could not assign the seat." }, { status: 409 })
  }
  await admin.from("profiles").update({ role: "teacher" }).eq("id", teacherId)

  return NextResponse.json({ ok: true, teacherId })
}

/**
 * Find an auth user's id by email via the service role. Scans a bounded number
 * of pages (self-serve schools are small); returns null if not found.
 */
async function findUserIdByEmail(
  admin: SupabaseClient<any, "public", any>,
  email: string,
): Promise<string | null> {
  const perPage = 1000
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage })
    if (error || !data) return null
    const match = data.users.find((u) => (u.email ?? "").toLowerCase() === email)
    if (match) return match.id
    if (data.users.length < perPage) break
  }
  return null
}
