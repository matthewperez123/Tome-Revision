"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  sendClassroomInviteEmail,
  sendClassroomJoinInvite,
} from "@/lib/email/classroom-invite"
import {
  type ActionResult,
  createAdminClient,
  fail,
  notify,
  ok,
  requireUser,
} from "./_shared"
// Classroom join codes are the 6-char uppercase alphanumeric format the student
// join UI (isValidJoinCode) and invite links expect — NOT the 4-4 group code.
import { generateJoinCode, generateUniqueJoinCode } from "@/lib/classroom-utils"
import { hasActiveSchoolEntitlement } from "@/lib/entitlements/server"

const Uuid = z.string().uuid()
const Role = z.enum(["owner", "co_teacher", "ta", "student"])

/** Free Classroom tier: one class, capped at this many students. */
const FREE_CLASS_LIMIT = 1
const FREE_STUDENT_CAP = 30

const CreateInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  subject: z.string().trim().max(120).optional(),
  gradeLevel: z.string().trim().max(120).optional(),
  maxStudents: z.number().int().min(1).max(100).optional(),
  leaderboardEnabled: z.boolean().optional(),
})

// ── Mutations ─────────────────────────────────────────────────────────────

export async function createClassroom(
  input: z.infer<typeof CreateInput>,
): Promise<ActionResult<{ id: string; joinCode: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    // Free Classroom tier = one class, ≤30 students. An active School plan
    // lifts both caps. The cap is enforced on owned (teacher_id) classrooms.
    const hasSchool = await hasActiveSchoolEntitlement(user.id)
    let maxStudents = parsed.data.maxStudents ?? null
    if (!hasSchool) {
      const admin = createAdminClient()
      const { count: owned } = await admin
        .from("classrooms")
        .select("*", { count: "exact", head: true })
        .eq("teacher_id", user.id)
      if ((owned ?? 0) >= FREE_CLASS_LIMIT) {
        return fail(
          "The free Classroom tier includes one class. Upgrade to School for more.",
        )
      }
      if (maxStudents == null || maxStudents > FREE_STUDENT_CAP) {
        maxStudents = FREE_STUDENT_CAP
      }
    }

    // Generate a unique join code (retry on collision).
    let joinCode = generateJoinCode()
    for (let i = 0; i < 5; i++) {
      const admin = createAdminClient()
      const { data: existing } = await admin
        .from("classrooms")
        .select("id")
        .eq("join_code", joinCode)
        .maybeSingle()
      if (!existing) break
      joinCode = generateJoinCode()
    }

    const { data: classroom, error } = await supabase
      .from("classrooms")
      .insert({
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        subject: parsed.data.subject ?? null,
        grade_level: parsed.data.gradeLevel ?? null,
        max_students: maxStudents,
        leaderboard_enabled: parsed.data.leaderboardEnabled ?? true,
        teacher_id: user.id,
        join_code: joinCode,
      })
      .select("id, join_code")
      .single()
    if (error) return fail(error.message)

    // Bootstrap the owner classroom_members row using the admin client —
    // the role-based RLS can't satisfy this until at least one owner row
    // exists.
    const admin = createAdminClient()
    const { error: memberErr } = await admin
      .from("classroom_members")
      .insert({
        classroom_id: classroom.id,
        student_id: user.id,
        role: "owner",
      })
    if (memberErr) {
      // Roll back the classroom row to keep state consistent.
      await admin.from("classrooms").delete().eq("id", classroom.id)
      return fail(memberErr.message)
    }

    revalidatePath("/classroom")
    return ok({ id: classroom.id, joinCode: classroom.join_code })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function lookupClassroomByCode(
  code: string,
): Promise<ActionResult<{ id: string; name: string; subject: string | null }>> {
  const parsed = z
    .string()
    .trim()
    .toUpperCase()
    .min(1)
    .max(20)
    .safeParse(code)
  if (!parsed.success) return fail("Invalid code.")
  try {
    // Must run as admin: the classrooms SELECT policy only returns rooms the
    // viewer already belongs to, so a prospective student can't preview a
    // room by its code through the user client.
    await requireUser()
    const admin = createAdminClient()
    const { data, error } = await admin
      .from("classrooms")
      .select("id, name, subject")
      .eq("join_code", parsed.data)
      .maybeSingle()
    if (error) return fail(error.message)
    if (!data) return fail("No classroom found for that code.")
    return ok({ id: data.id, name: data.name, subject: data.subject ?? null })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function joinClassroomByCode(
  code: string,
): Promise<ActionResult<{ classroomId: string }>> {
  const parsed = z
    .string()
    .trim()
    .toUpperCase()
    .min(1)
    .max(20)
    .safeParse(code)
  if (!parsed.success) return fail("Invalid code.")
  try {
    const { user } = await requireUser()
    const admin = createAdminClient()

    const { data: classroom, error: lookupErr } = await admin
      .from("classrooms")
      .select("id, name, archived, max_students")
      .eq("join_code", parsed.data)
      .maybeSingle()
    if (lookupErr) return fail(lookupErr.message)
    if (!classroom) return fail("No classroom found for that code.")
    if (classroom.archived) {
      return fail("This classroom is archived and no longer accepting students.")
    }

    // Idempotent: already-enrolled users just get sent in.
    const { data: existing } = await admin
      .from("classroom_members")
      .select("id")
      .eq("classroom_id", classroom.id)
      .eq("student_id", user.id)
      .maybeSingle()
    if (existing) return ok({ classroomId: classroom.id })

    // Enforce the capacity cap against the live member count.
    if (classroom.max_students != null) {
      const { count } = await admin
        .from("classroom_members")
        .select("*", { count: "exact", head: true })
        .eq("classroom_id", classroom.id)
      if ((count ?? 0) >= classroom.max_students) {
        return fail("This classroom is full.")
      }
    }

    const { error: insertErr } = await admin
      .from("classroom_members")
      .insert({
        classroom_id: classroom.id,
        student_id: user.id,
        role: "student",
      })
    if (insertErr) return fail(insertErr.message)

    // Late-joiner backfill: seed not_started submission rows for assignments that
    // were already published (active) before this student joined, so they appear
    // on the teacher roster exactly like students enrolled at publish time. Only
    // classroom-scoped assignments backfill — group/individual scopes target a
    // fixed student set that a new member is not automatically part of.
    await backfillActiveAssignments(admin, classroom.id, user.id)

    revalidatePath("/classroom")
    revalidatePath(`/classroom/${classroom.id}`)
    return ok({ classroomId: classroom.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Seed missing not_started submissions for a newly-enrolled student across
 * every active classroom-scoped assignment. Mirrors publishAssignment's upsert
 * shape (idempotent on assignment_id,student_id). */
async function backfillActiveAssignments(
  admin: ReturnType<typeof createAdminClient>,
  classroomId: string,
  studentId: string,
): Promise<void> {
  const { data: active } = await admin
    .from("assignments")
    .select("id")
    .eq("classroom_id", classroomId)
    .eq("scope", "classroom")
    .eq("status", "active")
  const ids = (active ?? []).map((a) => a.id as string)
  if (ids.length === 0) return
  await admin.from("assignment_submissions").upsert(
    ids.map((assignment_id) => ({
      assignment_id,
      student_id: studentId,
      status: "not_started" as const,
    })),
    { onConflict: "assignment_id,student_id", ignoreDuplicates: true },
  )
}

const InviteInput = z.object({
  classroomId: Uuid,
  emails: z.array(z.string().trim().email()).min(1).max(50),
  role: z.enum(["student", "co_teacher", "ta"]).default("student"),
})

/**
 * COPPA-safe email invite. Sends each address a link to /join?code=<join_code>;
 * students self-join through the link after authenticating, so NO member row
 * (and no student PII) is created here. Teacher-only (owner/co_teacher).
 */
export async function inviteToClassroom(
  input: z.input<typeof InviteInput>,
): Promise<ActionResult<{ sent: number }>> {
  const parsed = InviteInput.safeParse(input)
  if (!parsed.success) return fail("Enter one or more valid email addresses.")
  const { classroomId, emails, role } = parsed.data
  try {
    const { supabase, user } = await requireUser()

    // Only owners/co-teachers may invite. The RPC is the canonical role gate.
    const { data: allowed } = await supabase.rpc("user_has_classroom_role", {
      p_user_id: user.id,
      p_classroom_id: classroomId,
      p_roles: ["owner", "co_teacher"],
    })
    if (!allowed) return fail("Only classroom staff can send invites.")

    const { data: classroom } = await supabase
      .from("classrooms")
      .select("name, join_code, archived")
      .eq("id", classroomId)
      .maybeSingle()
    if (!classroom) return fail("Classroom not found.")
    if (classroom.archived) return fail("This classroom is archived.")

    const { data: inviter } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://usetome.app"
    const joinUrl = `${appUrl}/join?code=${encodeURIComponent(classroom.join_code)}`

    // De-dupe addresses (case-insensitive) before sending.
    const unique = Array.from(
      new Map(emails.map((e) => [e.toLowerCase(), e])).values(),
    )

    let sent = 0
    for (const email of unique) {
      const res = await sendClassroomJoinInvite({
        toEmail: email,
        classroomName: classroom.name,
        inviterName: inviter?.display_name ?? "Your teacher",
        roleLabel: role === "student" ? "student" : role.replace("_", "-"),
        joinCode: classroom.join_code,
        joinUrl,
      })
      if (res.ok) sent++
    }

    return ok({ sent })
  } catch (e) {
    return fail((e as Error).message)
  }
}

const CoTeacherInput = z.object({
  classroomId: Uuid,
  profileId: Uuid,
  role: z.enum(["co_teacher", "ta"]),
})

/**
 * Add an existing user as staff (co-teacher or TA). Owner-only. Inserts the
 * classroom_members row directly (they're already a Tome account, so this is
 * not a COPPA self-join path) and notifies them.
 */
export async function addCoTeacher(
  input: z.infer<typeof CoTeacherInput>,
): Promise<ActionResult<void>> {
  const parsed = CoTeacherInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  const { classroomId, profileId, role } = parsed.data
  try {
    const { supabase, user } = await requireUser()

    const { data: isOwner } = await supabase.rpc("user_has_classroom_role", {
      p_user_id: user.id,
      p_classroom_id: classroomId,
      p_roles: ["owner"],
    })
    if (!isOwner) return fail("Only the classroom owner can add staff.")

    // RLS (members_owner_coteacher_insert) also enforces staff-only insert.
    const { error } = await supabase.from("classroom_members").insert({
      classroom_id: classroomId,
      student_id: profileId,
      role,
    })
    if (error) {
      if (/duplicate key/i.test(error.message)) {
        return fail("That person is already a member of this classroom.")
      }
      return fail(error.message)
    }

    const { data: classroom } = await supabase
      .from("classrooms")
      .select("name")
      .eq("id", classroomId)
      .maybeSingle()
    const classroomName = classroom?.name ?? "a classroom"
    const inviterName = (
      await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .maybeSingle()
    ).data?.display_name

    await notify({
      recipientId: profileId,
      type: "group_invite",
      title: `You were added to ${classroomName}`,
      body: `You're now a ${role === "co_teacher" ? "co-teacher" : "teaching assistant"}.`,
      actionUrl: `/classroom/${classroomId}`,
      actorId: user.id,
      entityType: "classroom",
      entityId: classroomId,
    })

    // Best-effort in-app/email notice (preference-gated in the helper).
    await sendClassroomInviteEmail({
      inviteeId: profileId,
      classroomId,
      classroomName,
      inviterName: inviterName ?? "Your teacher",
      role,
    })

    revalidatePath(`/classroom/${classroomId}`)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function updateMemberRole(
  classroomId: string,
  userId: string,
  newRole: z.infer<typeof Role>,
): Promise<ActionResult<void>> {
  const cParsed = Uuid.safeParse(classroomId)
  const uParsed = Uuid.safeParse(userId)
  const rParsed = Role.safeParse(newRole)
  if (!cParsed.success || !uParsed.success || !rParsed.success) {
    return fail("Invalid input.")
  }
  try {
    const { supabase } = await requireUser()
    // RLS will block co_teachers from setting role='owner' via WITH CHECK.
    const { error } = await supabase
      .from("classroom_members")
      .update({ role: rParsed.data })
      .eq("classroom_id", cParsed.data)
      .eq("student_id", uParsed.data)
    if (error) return fail(error.message)
    revalidatePath(`/classroom/${cParsed.data}`)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function removeMember(
  classroomId: string,
  userId: string,
): Promise<ActionResult<void>> {
  const cParsed = Uuid.safeParse(classroomId)
  const uParsed = Uuid.safeParse(userId)
  if (!cParsed.success || !uParsed.success) return fail("Invalid input.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("classroom_members")
      .delete()
      .eq("classroom_id", cParsed.data)
      .eq("student_id", uParsed.data)
    if (error) return fail(error.message)
    revalidatePath(`/classroom/${cParsed.data}`)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function archiveClassroom(
  classroomId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("classrooms")
      .update({ archived_at: new Date().toISOString(), archived: true })
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    revalidatePath("/classroom")
    revalidatePath(`/classroom/${parsed.data}`)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Rotate a classroom's join code (invalidates the old one — e.g. if a code
 * leaked). Owner/co_teacher only. Generates a fresh unique code (throws if it
 * can't after max attempts). Enrolled members are unaffected.
 */
export async function rotateJoinCode(
  classroomId: string,
): Promise<ActionResult<{ joinCode: string }>> {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) return fail("Invalid classroom id.")
  try {
    const { supabase, user } = await requireUser()

    const { data: allowed } = await supabase.rpc("user_has_classroom_role", {
      p_user_id: user.id,
      p_classroom_id: parsed.data,
      p_roles: ["owner", "co_teacher"],
    })
    if (!allowed) return fail("Only classroom staff can change the join code.")

    const admin = createAdminClient()
    const joinCode = await generateUniqueJoinCode(async (code) => {
      const { data: existing } = await admin
        .from("classrooms")
        .select("id")
        .eq("join_code", code)
        .maybeSingle()
      return existing != null
    })

    const { error } = await supabase
      .from("classrooms")
      .update({ join_code: joinCode })
      .eq("id", parsed.data)
    if (error) return fail(error.message)

    revalidatePath(`/classroom/${parsed.data}`)
    revalidatePath(`/classroom/${parsed.data}/manage`)
    return ok({ joinCode })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export interface MyClassroomItem {
  id: string
  name: string
  description: string | null
  joinCode: string
  myRole: "owner" | "co_teacher" | "ta" | "student"
  archived: boolean
}

export async function listMyClassrooms(): Promise<MyClassroomItem[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("classroom_members")
    .select(
      `
      role,
      classroom:classrooms!inner(id, name, description, join_code, archived)
    `,
    )
    .eq("student_id", user.id)
  if (error) throw new Error(error.message)

  type Row = {
    role: MyClassroomItem["myRole"]
    classroom: {
      id: string
      name: string
      description: string | null
      join_code: string
      archived: boolean | null
    }
  }

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.classroom.id,
    name: r.classroom.name,
    description: r.classroom.description,
    joinCode: r.classroom.join_code,
    myRole: r.role,
    archived: r.classroom.archived ?? false,
  }))
}
