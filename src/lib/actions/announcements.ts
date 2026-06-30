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

const Uuid = z.string().uuid()

const CreateInput = z.object({
  classroomId: Uuid,
  title: z.string().trim().max(200).optional(),
  body: z.string().trim().min(1).max(10000),
  pinned: z.boolean().default(false),
})

export async function createAnnouncement(
  input: z.infer<typeof CreateInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    const { data: row, error } = await supabase
      .from("classroom_announcements")
      .insert({
        classroom_id: parsed.data.classroomId,
        teacher_id: user.id,
        title: parsed.data.title ?? null,
        content: parsed.data.body,
        pinned: parsed.data.pinned,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    // Notify every classroom member.
    const admin = createAdminClient()
    const [{ data: members }, { data: classroom }, { data: profile }] =
      await Promise.all([
        admin
          .from("classroom_members")
          .select("student_id")
          .eq("classroom_id", parsed.data.classroomId),
        admin
          .from("classrooms")
          .select("name")
          .eq("id", parsed.data.classroomId)
          .single(),
        admin
          .from("profiles")
          .select("display_name")
          .eq("id", user.id)
          .single(),
      ])

    if (members && members.length > 0) {
      await notify(
        members
          .filter((m) => m.student_id !== user.id)
          .map((m) => ({
            recipientId: m.student_id,
            type: "group_post" as const,
            title: parsed.data.title
              ? `New announcement: ${parsed.data.title}`
              : `${profile?.display_name ?? "Your teacher"} posted in ${classroom?.name ?? "your classroom"}`,
            body: parsed.data.body.slice(0, 200),
            actionUrl: `/classroom/${parsed.data.classroomId}`,
            actorId: user.id,
            entityType: "classroom",
            entityId: parsed.data.classroomId,
          })),
      )
    }

    revalidatePath(`/classroom/${parsed.data.classroomId}`)
    return ok({ id: row.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

const UpdateInput = z.object({
  id: Uuid,
  title: z.string().trim().max(200).nullable().optional(),
  body: z.string().trim().min(1).max(10000).optional(),
  pinned: z.boolean().optional(),
})

export async function updateAnnouncement(
  input: z.infer<typeof UpdateInput>,
): Promise<ActionResult<void>> {
  const parsed = UpdateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase } = await requireUser()
    const patch: Record<string, unknown> = {}
    if (parsed.data.title !== undefined) patch.title = parsed.data.title
    if (parsed.data.body !== undefined) patch.content = parsed.data.body
    if (parsed.data.pinned !== undefined) patch.pinned = parsed.data.pinned
    if (Object.keys(patch).length === 0) return ok(undefined)
    patch.updated_at = new Date().toISOString()

    const { error } = await supabase
      .from("classroom_announcements")
      .update(patch)
      .eq("id", parsed.data.id)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function deleteAnnouncement(
  id: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(id)
  if (!parsed.success) return fail("Invalid id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("classroom_announcements")
      .delete()
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function listAnnouncements(classroomId: string) {
  const parsed = Uuid.safeParse(classroomId)
  if (!parsed.success) throw new Error("Invalid classroom id.")
  const { supabase } = await requireUser()
  const { data, error } = await supabase
    .from("classroom_announcements")
    .select(
      `
      id, title, content, pinned, created_at, updated_at, teacher_id,
      author:profiles!classroom_announcements_teacher_id_fkey(id, display_name, username, avatar_url)
    `,
    )
    .eq("classroom_id", parsed.data)
    .order("pinned", { ascending: false })
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return data ?? []
}
