"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  createAdminClient,
  fail,
  generateJoinCode,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()

const CreateInput = z.object({
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
})

export async function createStudyGroup(
  input: z.infer<typeof CreateInput>,
): Promise<ActionResult<{ id: string; joinCode: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    // is_teacher_led is derived from the creator's profile role.
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()
    const isTeacherLed = profile?.role === "teacher"

    let joinCode = generateJoinCode()
    const admin = createAdminClient()
    for (let i = 0; i < 5; i++) {
      const { data: existing } = await admin
        .from("study_groups")
        .select("id")
        .eq("join_code", joinCode)
        .maybeSingle()
      if (!existing) break
      joinCode = generateJoinCode()
    }

    const { data: group, error } = await supabase
      .from("study_groups")
      .insert({
        name: parsed.data.name,
        description: parsed.data.description ?? null,
        creator_id: user.id,
        is_teacher_led: isTeacherLed,
        join_code: joinCode,
      })
      .select("id, join_code")
      .single()
    if (error) return fail(error.message)

    // Bootstrap the admin membership via service-role client.
    const { error: memberErr } = await admin.from("study_group_members").insert({
      group_id: group.id,
      user_id: user.id,
      role: "admin",
    })
    if (memberErr) {
      await admin.from("study_groups").delete().eq("id", group.id)
      return fail(memberErr.message)
    }

    revalidatePath("/study-groups")
    return ok({ id: group.id, joinCode: group.join_code })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function joinStudyGroupByCode(
  code: string,
): Promise<ActionResult<{ groupId: string }>> {
  const parsed = z.string().trim().toUpperCase().min(1).max(20).safeParse(code)
  if (!parsed.success) return fail("Invalid code.")
  try {
    const { user } = await requireUser()
    const admin = createAdminClient()

    const { data: group, error: lookupErr } = await admin
      .from("study_groups")
      .select("id")
      .eq("join_code", parsed.data)
      .maybeSingle()
    if (lookupErr) return fail(lookupErr.message)
    if (!group) return fail("No study group found for that code.")

    const { data: existing } = await admin
      .from("study_group_members")
      .select("id")
      .eq("group_id", group.id)
      .eq("user_id", user.id)
      .maybeSingle()
    if (existing) return fail("You're already in this group.")

    const { error: insertErr } = await admin
      .from("study_group_members")
      .insert({
        group_id: group.id,
        user_id: user.id,
        role: "member",
      })
    if (insertErr) return fail(insertErr.message)

    revalidatePath("/study-groups")
    revalidatePath(`/study-groups/${group.id}`)
    return ok({ groupId: group.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function leaveStudyGroup(
  groupId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("study_group_members")
      .delete()
      .eq("group_id", parsed.data)
      .eq("user_id", user.id)
    if (error) return fail(error.message)
    revalidatePath("/study-groups")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deleteStudyGroup(
  groupId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("study_groups")
      .delete()
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    revalidatePath("/study-groups")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export interface MyStudyGroupItem {
  id: string
  name: string
  description: string | null
  joinCode: string
  isTeacherLed: boolean
  myRole: "admin" | "member"
}

export async function listMyStudyGroups(): Promise<MyStudyGroupItem[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("study_group_members")
    .select(
      `
      role,
      group:study_groups!inner(id, name, description, join_code, is_teacher_led)
    `,
    )
    .eq("user_id", user.id)
  if (error) throw new Error(error.message)

  type Row = {
    role: MyStudyGroupItem["myRole"]
    group: {
      id: string
      name: string
      description: string | null
      join_code: string
      is_teacher_led: boolean
    }
  }

  return ((data ?? []) as unknown as Row[]).map((r) => ({
    id: r.group.id,
    name: r.group.name,
    description: r.group.description,
    joinCode: r.group.join_code,
    isTeacherLed: r.group.is_teacher_led,
    myRole: r.role,
  }))
}
