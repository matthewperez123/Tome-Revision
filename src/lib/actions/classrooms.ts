"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sendClassroomInviteEmail } from "@/lib/email/classroom-invite"
import {
  type ActionResult,
  createAdminClient,
  fail,
  generateJoinCode,
  notify,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()
const Role = z.enum(["owner", "co_teacher", "ta", "student"])

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
        max_students: parsed.data.maxStudents ?? null,
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
      .select("id, name")
      .eq("join_code", parsed.data)
      .maybeSingle()
    if (lookupErr) return fail(lookupErr.message)
    if (!classroom) return fail("No classroom found for that code.")

    // Check existing membership.
    const { data: existing } = await admin
      .from("classroom_members")
      .select("id")
      .eq("classroom_id", classroom.id)
      .eq("student_id", user.id)
      .maybeSingle()
    if (existing) return fail("You're already in this classroom.")

    const { error: insertErr } = await admin
      .from("classroom_members")
      .insert({
        classroom_id: classroom.id,
        student_id: user.id,
        role: "student",
      })
    if (insertErr) return fail(insertErr.message)

    revalidatePath("/classroom")
    revalidatePath(`/classroom/${classroom.id}`)
    return ok({ classroomId: classroom.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function inviteToClassroom(
  classroomId: string,
  userId: string,
  role: z.infer<typeof Role>,
): Promise<ActionResult<void>> {
  const cParsed = Uuid.safeParse(classroomId)
  const uParsed = Uuid.safeParse(userId)
  const rParsed = Role.safeParse(role)
  if (!cParsed.success || !uParsed.success || !rParsed.success) {
    return fail("Invalid input.")
  }
  if (rParsed.data === "owner") {
    return fail("Cannot invite as owner. Use transfer-ownership instead.")
  }
  try {
    const { supabase, user } = await requireUser()

    // RLS will block this if the actor isn't owner/co_teacher; we still
    // try via the user client so the policy is exercised.
    const { error } = await supabase.from("classroom_members").insert({
      classroom_id: cParsed.data,
      student_id: uParsed.data,
      role: rParsed.data,
    })
    if (error) return fail(error.message)

    const { data: classroom } = await supabase
      .from("classrooms")
      .select("name")
      .eq("id", cParsed.data)
      .single()
    const classroomName = classroom?.name ?? "a classroom"

    await notify({
      recipientId: uParsed.data,
      type: "group_invite",
      title: `You were added to ${classroomName}`,
      actionUrl: `/classroom/${cParsed.data}`,
      actorId: user.id,
      entityType: "classroom",
      entityId: cParsed.data,
    })

    // Best-effort invite email (preference-gated in the helper).
    const { data: inviter } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .maybeSingle()
    await sendClassroomInviteEmail({
      inviteeId: uParsed.data,
      classroomId: cParsed.data,
      classroomName,
      inviterName: inviter?.display_name ?? "Your teacher",
      role: rParsed.data,
    })

    revalidatePath(`/classroom/${cParsed.data}`)
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
