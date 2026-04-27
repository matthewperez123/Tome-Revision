"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  fail,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()

export async function createGroup(
  classroomId: string,
  name: string,
): Promise<ActionResult<{ id: string }>> {
  const cParsed = Uuid.safeParse(classroomId)
  const nParsed = z.string().trim().min(1).max(120).safeParse(name)
  if (!cParsed.success || !nParsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("classroom_groups")
      .insert({
        classroom_id: cParsed.data,
        name: nParsed.data,
        created_by: user.id,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/classroom/${cParsed.data}`)
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function addToGroup(
  groupId: string,
  userIds: string[],
): Promise<ActionResult<{ added: number }>> {
  const gParsed = Uuid.safeParse(groupId)
  const uParsed = z.array(Uuid).min(1).max(200).safeParse(userIds)
  if (!gParsed.success || !uParsed.success) return fail("Invalid input.")
  try {
    const { supabase } = await requireUser()
    const rows = uParsed.data.map((id) => ({
      group_id: gParsed.data,
      user_id: id,
    }))
    const { error } = await supabase
      .from("classroom_group_members")
      .upsert(rows, { onConflict: "group_id,user_id", ignoreDuplicates: true })
    if (error) return fail(error.message)
    return ok({ added: rows.length })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function removeFromGroup(
  groupId: string,
  userId: string,
): Promise<ActionResult<void>> {
  const gParsed = Uuid.safeParse(groupId)
  const uParsed = Uuid.safeParse(userId)
  if (!gParsed.success || !uParsed.success) return fail("Invalid input.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("classroom_group_members")
      .delete()
      .eq("group_id", gParsed.data)
      .eq("user_id", uParsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deleteGroup(
  groupId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("classroom_groups")
      .delete()
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}
