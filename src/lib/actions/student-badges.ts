"use server"

import { createHash, randomBytes } from "node:crypto"
import QRCode from "qrcode"
import { z } from "zod"
import {
  type ActionResult,
  createAdminClient,
  fail,
  ok,
  requireUser,
  type SupaClient,
} from "./_shared"
import { generateStudentCode } from "@/lib/student-code"
import { generateBadgeToken, wrapBadgeQrPayload } from "@/lib/badge-token"

// ─── Badge / roster provisioning (teacher-only) ─────────────────────────────
//
// Everything here is gated to the classroom's owner/co_teacher through the
// canonical SECURITY DEFINER RPC `user_has_classroom_role` — never a raw
// classroom_members read (that recursion caused the June crash). Writes use the
// service-role admin client because provisioning spans auth.users + profiles +
// classroom_members + student_access_codes, which no single RLS policy can
// express, but every action first proves the caller is staff of that room.
//
// COPPA: a student is created with a SYNTHETIC address on the reserved
// `.invalid` TLD (RFC 2606 — can never receive mail), immediately confirmed so
// Supabase sends nothing. That address exists only to satisfy auth's schema; it
// is never shown, never entered, never recoverable, and carries no real PII.

const Uuid = z.string().uuid()

// A human display label only — "Beatrice C.", no full surnames, no email, no
// DOB. Letters (incl. accents), spaces, and the punctuation a short name needs.
const DisplayName = z
  .string()
  .trim()
  .min(1, "Enter the student's name.")
  .max(40, "That name is too long.")
  .regex(/^[\p{L}][\p{L} .'-]*$/u, "Use letters, spaces, apostrophes, or a period.")

function sha256hex(input: string): string {
  return createHash("sha256").update(input).digest("hex")
}

/** Prove the caller is owner/co_teacher of the room via the canonical RPC. */
async function requireClassroomStaff(
  supabase: SupaClient,
  userId: string,
  classroomId: string,
): Promise<boolean> {
  const { data } = await supabase.rpc("user_has_classroom_role", {
    p_user_id: userId,
    p_classroom_id: classroomId,
    p_roles: ["owner", "co_teacher"],
  })
  return data === true
}

/** Generate a code that isn't already taken (retry on the unique collision). */
async function mintUniqueCode(admin: SupaClient): Promise<string> {
  for (let i = 0; i < 6; i++) {
    const code = generateStudentCode()
    const { data } = await admin
      .from("student_access_codes")
      .select("user_id")
      .eq("code", code)
      .maybeSingle()
    if (!data) return code
  }
  throw new Error("Could not generate a unique code. Try again.")
}

/**
 * Mint a badge token whose HASH isn't already taken, returning both the
 * plaintext (drawn into the QR once, then discarded) and its hash (stored).
 */
async function mintUniqueBadgeToken(
  admin: SupaClient,
): Promise<{ token: string; hash: string }> {
  for (let i = 0; i < 6; i++) {
    const token = generateBadgeToken()
    const hash = sha256hex(token)
    const { data } = await admin
      .from("student_access_codes")
      .select("user_id")
      .eq("badge_token_hash", hash)
      .maybeSingle()
    if (!data) return { token, hash }
  }
  throw new Error("Could not generate a unique badge. Try again.")
}

// ── Read: the roster of code-login students for a room ──────────────────────

export interface StudentCodeRow {
  userId: string
  displayName: string
  code: string
  active: boolean
  /** A badge has been minted and not since revoked. */
  badgeActive: boolean
  badgeIssuedAt: string | null
}

export async function listClassroomStudentCodes(
  classroomId: string,
): Promise<ActionResult<StudentCodeRow[]>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom.")
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, parsed.data))) {
      return fail("Only this classroom's teacher can manage student codes.")
    }
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("student_access_codes")
      .select(
        "user_id, display_name, code, active, badge_token_hash, badge_issued_at, badge_revoked_at",
      )
      .eq("classroom_id", parsed.data)
      .order("display_name", { ascending: true })
    if (error) return fail(error.message)
    const rows: StudentCodeRow[] = (data ?? []).map((r) => ({
      userId: r.user_id as string,
      displayName: r.display_name as string,
      code: r.code as string,
      active: r.active as boolean,
      badgeActive: Boolean(r.badge_token_hash) && r.badge_revoked_at == null,
      badgeIssuedAt: (r.badge_issued_at as string | null) ?? null,
    }))
    return ok(rows)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Write: add a fresh code-only student by name ────────────────────────────

const AddStudentInput = z.object({
  classroomId: Uuid,
  name: DisplayName,
})

export async function addStudentWithCode(
  input: z.input<typeof AddStudentInput>,
): Promise<ActionResult<{ userId: string; displayName: string; code: string }>> {
  const parsed = AddStudentInput.safeParse(input)
  if (!parsed.success) {
    return fail(parsed.error.issues[0]?.message ?? "Check the student's name.")
  }
  const { classroomId, name } = parsed.data
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, classroomId))) {
      return fail("Only this classroom's teacher can add students.")
    }
    const admin = createAdminClient()

    // Capacity cap against the live member count.
    const { data: room } = await admin
      .from("classrooms")
      .select("max_students")
      .eq("id", classroomId)
      .maybeSingle()
    if (room?.max_students != null) {
      const { count } = await admin
        .from("classroom_members")
        .select("*", { count: "exact", head: true })
        .eq("classroom_id", classroomId)
      if ((count ?? 0) >= room.max_students) {
        return fail("This classroom is full.")
      }
    }

    // Synthetic, non-deliverable identity. Random local part, reserved TLD,
    // pre-confirmed so no mail is ever attempted. Never shown to anyone.
    const syntheticEmail = `s-${randomBytes(12).toString("hex")}@students.tome.invalid`
    const { data: created, error: createErr } =
      await admin.auth.admin.createUser({
        email: syntheticEmail,
        password: randomBytes(24).toString("base64url"),
        email_confirm: true,
        user_metadata: { full_name: name, is_student: true },
      })
    const newUserId = created?.user?.id
    if (createErr || !newUserId) {
      return fail(createErr?.message ?? "Could not create the student.")
    }

    // From here, any failure must delete the just-created auth user so we never
    // strand a half-provisioned account.
    try {
      // handle_new_user already inserted a profiles row; promote it to a
      // code-login student and skip onboarding (they never see that funnel).
      const { error: profErr } = await admin
        .from("profiles")
        .update({
          role: "student",
          display_name: name,
          full_name: name,
          onboarding_completed: true,
        })
        .eq("id", newUserId)
      if (profErr) throw new Error(profErr.message)

      const { error: memberErr } = await admin
        .from("classroom_members")
        .insert({ classroom_id: classroomId, student_id: newUserId, role: "student" })
      if (memberErr) throw new Error(memberErr.message)

      const code = await mintUniqueCode(admin)
      const { error: codeErr } = await admin
        .from("student_access_codes")
        .insert({
          user_id: newUserId,
          classroom_id: classroomId,
          display_name: name,
          code,
          created_by: user.id,
        })
      if (codeErr) throw new Error(codeErr.message)

      // Seed not_started rows for already-active classroom assignments so the
      // new student shows on the teacher roster exactly like publish-time ones.
      const { data: active } = await admin
        .from("assignments")
        .select("id")
        .eq("classroom_id", classroomId)
        .eq("scope", "classroom")
        .eq("status", "active")
      const ids = (active ?? []).map((a) => a.id as string)
      if (ids.length > 0) {
        await admin.from("assignment_submissions").upsert(
          ids.map((assignment_id) => ({
            assignment_id,
            student_id: newUserId,
            status: "not_started" as const,
          })),
          { onConflict: "assignment_id,student_id", ignoreDuplicates: true },
        )
      }

      return ok({ userId: newUserId, displayName: name, code })
    } catch (inner) {
      await admin.auth.admin.deleteUser(newUserId)
      return fail((inner as Error).message)
    }
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Write: rotate / (de)activate a typed code ───────────────────────────────

/** Confirm this code row exists and belongs to the staff-gated classroom. */
async function codeRowInClassroom(
  admin: SupaClient,
  userId: string,
  classroomId: string,
): Promise<boolean> {
  const { data } = await admin
    .from("student_access_codes")
    .select("user_id")
    .eq("user_id", userId)
    .eq("classroom_id", classroomId)
    .maybeSingle()
  return Boolean(data)
}

const StudentRef = z.object({ classroomId: Uuid, userId: Uuid })

export async function rotateStudentCode(
  input: z.input<typeof StudentRef>,
): Promise<ActionResult<{ code: string }>> {
  const parsed = StudentRef.safeParse(input)
  if (!parsed.success) return fail("Invalid request.")
  const { classroomId, userId } = parsed.data
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, classroomId))) {
      return fail("Only this classroom's teacher can rotate codes.")
    }
    const admin = createAdminClient()
    if (!(await codeRowInClassroom(admin, userId, classroomId))) {
      return fail("That student isn't in this classroom.")
    }
    const code = await mintUniqueCode(admin)
    const { error } = await admin
      .from("student_access_codes")
      .update({ code, rotated_at: new Date().toISOString() })
      .eq("user_id", userId)
    if (error) return fail(error.message)
    return ok({ code })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function setStudentCodeActive(
  input: z.input<typeof StudentRef> & { active: boolean },
): Promise<ActionResult<{ active: boolean }>> {
  const parsed = StudentRef.extend({ active: z.boolean() }).safeParse(input)
  if (!parsed.success) return fail("Invalid request.")
  const { classroomId, userId, active } = parsed.data
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, classroomId))) {
      return fail("Only this classroom's teacher can change codes.")
    }
    const admin = createAdminClient()
    if (!(await codeRowInClassroom(admin, userId, classroomId))) {
      return fail("That student isn't in this classroom.")
    }
    const { error } = await admin
      .from("student_access_codes")
      .update({ active })
      .eq("user_id", userId)
    if (error) return fail(error.message)
    return ok({ active })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Write: issue / revoke scan badges ───────────────────────────────────────

export interface BadgePrintCard {
  userId: string
  displayName: string
  /** Typed fallback, always printed alongside the QR. */
  code: string
  /**
   * The finished QR as an SVG string. The QR is rendered HERE, on the server,
   * so the opaque token only ever reaches the browser as QR pixels — never as a
   * parseable value in the page data.
   */
  qrSvg: string
}

/** Mint (or re-mint) one badge; returns the card data to draw the QR ONCE. */
async function issueOne(
  admin: SupaClient,
  row: { user_id: string; display_name: string; code: string },
): Promise<BadgePrintCard> {
  const { token, hash } = await mintUniqueBadgeToken(admin)
  const { error } = await admin
    .from("student_access_codes")
    .update({
      badge_token_hash: hash,
      badge_issued_at: new Date().toISOString(),
      badge_revoked_at: null,
    })
    .eq("user_id", row.user_id)
  if (error) throw new Error(error.message)
  const qrSvg = await QRCode.toString(wrapBadgeQrPayload(token), {
    type: "svg",
    margin: 1,
    errorCorrectionLevel: "M",
  })
  return {
    userId: row.user_id,
    displayName: row.display_name,
    code: row.code,
    qrSvg,
  }
}

/**
 * Mint fresh badges for every ACTIVE student in the room and return the cards
 * to print. Each call rotates the token, so any previously printed badge for
 * these students stops scanning the moment this runs (reprint = rotate). The
 * plaintext token is returned only in this response and never stored.
 */
export async function issueBadgesForClassroom(
  classroomId: string,
): Promise<ActionResult<BadgePrintCard[]>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom.")
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, parsed.data))) {
      return fail("Only this classroom's teacher can print badges.")
    }
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("student_access_codes")
      .select("user_id, display_name, code")
      .eq("classroom_id", parsed.data)
      .eq("active", true)
      .order("display_name", { ascending: true })
    if (error) return fail(error.message)
    const rows = (data ?? []) as {
      user_id: string
      display_name: string
      code: string
    }[]
    const cards: BadgePrintCard[] = []
    for (const row of rows) cards.push(await issueOne(admin, row))
    return ok(cards)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Mint a fresh badge for a single student (same rotate-on-issue semantics). */
export async function issueBadge(
  input: z.input<typeof StudentRef>,
): Promise<ActionResult<BadgePrintCard>> {
  const parsed = StudentRef.safeParse(input)
  if (!parsed.success) return fail("Invalid request.")
  const { classroomId, userId } = parsed.data
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, classroomId))) {
      return fail("Only this classroom's teacher can print badges.")
    }
    const admin = createAdminClient()
    const { data } = await admin
      .from("student_access_codes")
      .select("user_id, display_name, code")
      .eq("user_id", userId)
      .eq("classroom_id", classroomId)
      .maybeSingle()
    if (!data) return fail("That student isn't in this classroom.")
    const card = await issueOne(
      admin,
      data as { user_id: string; display_name: string; code: string },
    )
    return ok(card)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Kill a badge without touching the typed code. Sets badge_revoked_at so any
 * scan is rejected immediately (a lost/photographed badge dies with one click);
 * the student can still type their code to get in.
 */
export async function revokeBadge(
  input: z.input<typeof StudentRef>,
): Promise<ActionResult<void>> {
  const parsed = StudentRef.safeParse(input)
  if (!parsed.success) return fail("Invalid request.")
  const { classroomId, userId } = parsed.data
  try {
    const { supabase, user } = await requireUser()
    if (!(await requireClassroomStaff(supabase, user.id, classroomId))) {
      return fail("Only this classroom's teacher can revoke badges.")
    }
    const admin = createAdminClient()
    if (!(await codeRowInClassroom(admin, userId, classroomId))) {
      return fail("That student isn't in this classroom.")
    }
    const { error } = await admin
      .from("student_access_codes")
      .update({ badge_revoked_at: new Date().toISOString() })
      .eq("user_id", userId)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}
