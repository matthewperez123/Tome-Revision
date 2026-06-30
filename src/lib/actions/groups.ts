"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  createAdminClient,
  fail,
  generateJoinCode,
  notify,
  ok,
  requireUser,
} from "./_shared"

// ── Shared enums (mirror the public.group_* enums exactly) ──────────────────

export const GROUP_KINDS = ["book_club", "study_group"] as const
export type GroupKind = (typeof GROUP_KINDS)[number]

export const GROUP_PRIVACY = ["public", "private", "invite"] as const
export type GroupPrivacy = (typeof GROUP_PRIVACY)[number]

export const GROUP_MEMBER_ROLES = ["owner", "moderator", "member"] as const
export type GroupMemberRole = (typeof GROUP_MEMBER_ROLES)[number]

const Uuid = z.string().uuid()

// Translate the SECURITY DEFINER RPCs' raised exceptions into friendly copy.
function friendlyError(message: string): string {
  const map: Record<string, string> = {
    UNAUTHENTICATED: "Please sign in.",
    NAME_REQUIRED: "Give your group a name.",
    GROUP_NOT_FOUND: "That group no longer exists.",
    NOT_PUBLIC: "This group isn't open to join — you need an invite.",
    GROUP_FULL: "This group is full.",
    INVITE_NOT_FOUND: "That invite no longer exists.",
    INVITE_NOT_PENDING: "That invite has already been used.",
    NOT_INVITEE: "This invite isn't addressed to you.",
    CODE_NOT_FOUND: "No group found for that code.",
    NOT_A_MEMBER: "You need to be a member to see this.",
  }
  // RPC errors arrive like: 'UNAUTHENTICATED' or a wrapped postgres message.
  for (const key of Object.keys(map)) {
    if (message.includes(key)) return map[key]
  }
  return message
}

/** Route notifications + revalidation to the right surface for a group kind. */
function basePathFor(kind: string | null | undefined): string {
  return kind === "study_group" ? "/study-groups" : "/clubs"
}

// ── Create ──────────────────────────────────────────────────────────────────

const CreateInput = z.object({
  kind: z.enum(GROUP_KINDS).default("book_club"),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(2000).optional(),
  bookId: z.string().trim().min(1).max(200).optional(),
  privacy: z.enum(GROUP_PRIVACY).default("private"),
  memberLimit: z.number().int().positive().max(10000).optional(),
  cover: z.string().trim().max(500).optional(),
})

/**
 * Create a group (book club or study group) and atomically bootstrap the
 * owner membership via the create_group SECURITY DEFINER RPC. Returns the new
 * group's id + slug for routing.
 */
export async function createGroup(
  input: z.input<typeof CreateInput>,
): Promise<ActionResult<{ id: string; slug: string }>> {
  const parsed = CreateInput.safeParse(input)
  if (!parsed.success) return fail("Invalid group details.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.rpc("create_group", {
      p_kind: parsed.data.kind,
      p_name: parsed.data.name,
      p_description: parsed.data.description ?? null,
      p_book_id: parsed.data.bookId ?? null,
      p_privacy: parsed.data.privacy,
      p_member_limit: parsed.data.memberLimit ?? null,
      p_cover: parsed.data.cover ?? null,
    })
    if (error) return fail(friendlyError(error.message))
    const row = data as { id: string; slug: string }
    revalidatePath("/clubs")
    return ok({ id: row.id, slug: row.slug })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Join / leave ─────────────────────────────────────────────────────────────

/** Join a public group as yourself (→ join_group RPC; enforces member_limit). */
export async function joinGroup(groupId: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.rpc("join_group", { p_group: parsed.data })
    if (error) return fail(friendlyError(error.message))
    revalidatePath("/clubs")
    revalidatePath(`/clubs/${parsed.data}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Redeem a shareable invite code → join the group (→ join_group_by_code RPC). */
export async function joinGroupByCode(
  code: string,
): Promise<ActionResult<{ groupId: string }>> {
  const parsed = z.string().trim().toUpperCase().min(1).max(20).safeParse(code)
  if (!parsed.success) return fail("Invalid code.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.rpc("join_group_by_code", {
      p_code: parsed.data,
    })
    if (error) return fail(friendlyError(error.message))
    const groupId = data as string
    revalidatePath("/clubs")
    revalidatePath(`/clubs/${groupId}`)
    return ok({ groupId })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Accept an invite addressed to you by invite id (→ accept_group_invite RPC). */
export async function acceptGroupInvite(
  inviteId: string,
): Promise<ActionResult<{ groupId: string }>> {
  const parsed = Uuid.safeParse(inviteId)
  if (!parsed.success) return fail("Invalid invite.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.rpc("accept_group_invite", {
      p_invite: parsed.data,
    })
    if (error) return fail(friendlyError(error.message))
    const groupId = data as string
    revalidatePath("/clubs")
    revalidatePath(`/clubs/${groupId}`)
    return ok({ groupId })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Leave a group — delete your own membership row. Owners can't leave (delete). */
export async function leaveGroup(groupId: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase, user } = await requireUser()
    // Owners shouldn't orphan a group by leaving — block it.
    const { data: group } = await supabase
      .from("groups")
      .select("owner_id")
      .eq("id", parsed.data)
      .maybeSingle()
    if (group?.owner_id === user.id) {
      return fail("Owners can't leave — delete the group instead.")
    }
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", parsed.data)
      .eq("user_id", user.id)
    if (error) return fail(error.message)
    revalidatePath("/clubs")
    revalidatePath(`/clubs/${parsed.data}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Delete a group entirely (owner-only; RLS enforces). Cascades members/posts. */
export async function deleteGroup(groupId: string): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase.from("groups").delete().eq("id", parsed.data)
    if (error) return fail(error.message)
    revalidatePath("/clubs")
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Posts (threaded discussion) ──────────────────────────────────────────────

const PostInput = z.object({
  groupId: Uuid,
  body: z.string().trim().min(1).max(5000),
  parentPostId: Uuid.optional(),
})

/**
 * Post to a group thread. RLS guarantees the author is an active member.
 * Notifies the other active members (group_post) — best-effort, never blocks.
 */
export async function createGroupPost(
  input: z.infer<typeof PostInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = PostInput.safeParse(input)
  if (!parsed.success) return fail("Write something first.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("group_posts")
      .insert({
        group_id: parsed.data.groupId,
        author_id: user.id,
        parent_post_id: parsed.data.parentPostId ?? null,
        body: parsed.data.body,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    // Notify fellow active members. Read roster + group meta via service role.
    const admin = createAdminClient()
    const [{ data: group }, { data: members }, { data: actor }] =
      await Promise.all([
        admin
          .from("groups")
          .select("name, kind")
          .eq("id", parsed.data.groupId)
          .single(),
        admin
          .from("group_members")
          .select("user_id")
          .eq("group_id", parsed.data.groupId)
          .eq("status", "active"),
        admin
          .from("profiles")
          .select("display_name, username")
          .eq("id", user.id)
          .maybeSingle(),
      ])
    const actorName =
      actor?.display_name ?? actor?.username ?? "Someone"
    const groupName = group?.name ?? "your group"
    const base = basePathFor(group?.kind)
    const recipients = ((members ?? []) as { user_id: string }[])
      .map((m) => m.user_id)
      .filter((id) => id !== user.id)
    if (recipients.length > 0) {
      await notify(
        recipients.map((recipientId) => ({
          recipientId,
          type: "group_post" as const,
          actorId: user.id,
          entityType: "group",
          entityId: parsed.data.groupId,
          title: `${actorName} posted in ${groupName}`,
          body: parsed.data.body.slice(0, 140),
          actionUrl: `${base}/${parsed.data.groupId}`,
        })),
      )
    }

    revalidatePath(`${base}/${parsed.data.groupId}`)
    return ok({ id: (data as { id: string }).id })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

const EditInput = z.object({
  postId: Uuid,
  body: z.string().trim().min(1).max(5000),
})

/** Edit your own post (RLS: author or moderator). Stamps edited_at. */
export async function editGroupPost(
  input: z.infer<typeof EditInput>,
): Promise<ActionResult<void>> {
  const parsed = EditInput.safeParse(input)
  if (!parsed.success) return fail("Invalid edit.")
  try {
    const { supabase } = await requireUser()
    const { data: post, error } = await supabase
      .from("group_posts")
      .update({ body: parsed.data.body, edited_at: new Date().toISOString() })
      .eq("id", parsed.data.postId)
      .select("group_id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/clubs/${(post as { group_id: string }).group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Soft-delete a post (RLS: author or moderator). Stamps deleted_at. */
export async function deleteGroupPost(
  postId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(postId)
  if (!parsed.success) return fail("Invalid post id.")
  try {
    const { supabase } = await requireUser()
    const { data: post, error } = await supabase
      .from("group_posts")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", parsed.data)
      .select("group_id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/clubs/${(post as { group_id: string }).group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Report a post for moderation. Insert-only into the shared reports table. */
export async function reportGroupPost(
  postId: string,
  reason: string,
): Promise<ActionResult<void>> {
  const parsedId = Uuid.safeParse(postId)
  if (!parsedId.success) return fail("Invalid post id.")
  const parsedReason = z.string().trim().min(1).max(2000).safeParse(reason)
  if (!parsedReason.success) return fail("Please add a short reason.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase.from("reports").insert({
      content_type: "group_post",
      content_id: parsedId.data,
      reporter_id: user.id,
      reason: parsedReason.data,
    })
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Moderation (owner / moderator) ───────────────────────────────────────────

const RoleChangeInput = z.object({
  groupId: Uuid,
  userId: Uuid,
  role: z.enum(["moderator", "member"]),
})

/** Change a member's role (RLS: moderator only; can't touch the owner row). */
export async function changeMemberRole(
  input: z.infer<typeof RoleChangeInput>,
): Promise<ActionResult<void>> {
  const parsed = RoleChangeInput.safeParse(input)
  if (!parsed.success) return fail("Invalid role change.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("group_members")
      .update({ role: parsed.data.role })
      .eq("group_id", parsed.data.groupId)
      .eq("user_id", parsed.data.userId)
      .neq("role", "owner")
    if (error) return fail(error.message)
    revalidatePath(`/clubs/${parsed.data.groupId}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Remove a member (RLS: moderator only; can't remove the owner). */
export async function removeMember(
  groupId: string,
  userId: string,
): Promise<ActionResult<void>> {
  const parsedGroup = Uuid.safeParse(groupId)
  const parsedUser = Uuid.safeParse(userId)
  if (!parsedGroup.success || !parsedUser.success) return fail("Invalid input.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", parsedGroup.data)
      .eq("user_id", parsedUser.data)
      .neq("role", "owner")
    if (error) return fail(error.message)
    revalidatePath(`/clubs/${parsedGroup.data}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Invites ──────────────────────────────────────────────────────────────────

const InviteInput = z.object({
  groupId: Uuid,
  /** Invite a specific user by id, OR omit to mint a shareable code. */
  inviteeId: Uuid.optional(),
})

/**
 * Issue an invite (RLS: member only). With an inviteeId we notify that user
 * (group_invite); without one we mint a unique shareable code. Returns the
 * invite id + code (code null for a direct invite).
 */
export async function createGroupInvite(
  input: z.infer<typeof InviteInput>,
): Promise<ActionResult<{ inviteId: string; code: string | null }>> {
  const parsed = InviteInput.safeParse(input)
  if (!parsed.success) return fail("Invalid invite.")
  try {
    const { supabase, user } = await requireUser()
    const admin = createAdminClient()

    let code: string | null = null
    if (!parsed.data.inviteeId) {
      // Mint a unique shareable code.
      code = generateJoinCode()
      for (let i = 0; i < 5; i++) {
        const { data: existing } = await admin
          .from("group_invites")
          .select("id")
          .eq("code", code)
          .maybeSingle()
        if (!existing) break
        code = generateJoinCode()
      }
    }

    const { data: invite, error } = await supabase
      .from("group_invites")
      .insert({
        group_id: parsed.data.groupId,
        inviter_id: user.id,
        invitee_id: parsed.data.inviteeId ?? null,
        code,
      })
      .select("id, code")
      .single()
    if (error) return fail(error.message)
    const row = invite as { id: string; code: string | null }

    // Direct invite → notify the target.
    if (parsed.data.inviteeId) {
      const [{ data: group }, { data: actor }] = await Promise.all([
        admin
          .from("groups")
          .select("name, kind")
          .eq("id", parsed.data.groupId)
          .single(),
        admin
          .from("profiles")
          .select("display_name, username")
          .eq("id", user.id)
          .maybeSingle(),
      ])
      const actorName = actor?.display_name ?? actor?.username ?? "Someone"
      await notify({
        recipientId: parsed.data.inviteeId,
        type: "group_invite",
        actorId: user.id,
        entityType: "group_invite",
        entityId: row.id,
        title: `${actorName} invited you to ${group?.name ?? "a group"}`,
        actionUrl: `${basePathFor(group?.kind)}/${parsed.data.groupId}`,
      })
    }

    revalidatePath(`/clubs/${parsed.data.groupId}`)
    revalidatePath(`/study-groups/${parsed.data.groupId}`)
    return ok({ inviteId: row.id, code: row.code })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Reading schedule (book clubs) ────────────────────────────────────────────

const ScheduleInput = z.object({
  groupId: Uuid,
  label: z.string().trim().min(1).max(200),
  chapterOrSection: z.string().trim().max(200).optional(),
  targetDate: z.string().trim().optional(),
})

/**
 * Add a milestone to a group's shared reading plan (RLS: moderator only).
 * Notifies active members of the new milestone (system) — best-effort.
 */
export async function createScheduleItem(
  input: z.infer<typeof ScheduleInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = ScheduleInput.safeParse(input)
  if (!parsed.success) return fail("Invalid schedule entry.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("group_schedule")
      .insert({
        group_id: parsed.data.groupId,
        label: parsed.data.label,
        chapter_or_section: parsed.data.chapterOrSection ?? null,
        target_date: parsed.data.targetDate || null,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    const admin = createAdminClient()
    const [{ data: group }, { data: members }] = await Promise.all([
      admin
        .from("groups")
        .select("name, kind")
        .eq("id", parsed.data.groupId)
        .single(),
      admin
        .from("group_members")
        .select("user_id")
        .eq("group_id", parsed.data.groupId)
        .eq("status", "active"),
    ])
    const groupName = group?.name ?? "your group"
    const base = basePathFor(group?.kind)
    const recipients = ((members ?? []) as { user_id: string }[])
      .map((m) => m.user_id)
      .filter((id) => id !== user.id)
    if (recipients.length > 0) {
      await notify(
        recipients.map((recipientId) => ({
          recipientId,
          type: "system" as const,
          actorId: user.id,
          entityType: "group",
          entityId: parsed.data.groupId,
          title: `New milestone in ${groupName}`,
          body: parsed.data.label,
          actionUrl: `${base}/${parsed.data.groupId}`,
        })),
      )
    }

    revalidatePath(`${base}/${parsed.data.groupId}`)
    return ok({ id: (data as { id: string }).id })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Remove a schedule milestone (RLS: moderator only). */
export async function deleteScheduleItem(
  scheduleId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(scheduleId)
  if (!parsed.success) return fail("Invalid schedule id.")
  try {
    const { supabase } = await requireUser()
    const { data: row, error } = await supabase
      .from("group_schedule")
      .delete()
      .eq("id", parsed.data)
      .select("group_id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/clubs/${(row as { group_id: string }).group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Member progress (read live from reading_progress, no duplication) ────────

export interface MemberProgress {
  userId: string
  displayName: string
  username: string
  avatarUrl: string | null
  role: GroupMemberRole
  chapterIndex: number | null
  updatedAt: string | null
}

/** Each active member's progress on the club's book (→ group_member_progress RPC). */
export async function listMemberProgress(
  groupId: string,
): Promise<ActionResult<MemberProgress[]>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.rpc("group_member_progress", {
      p_group: parsed.data,
    })
    if (error) return fail(friendlyError(error.message))
    type Row = {
      user_id: string
      display_name: string | null
      username: string | null
      avatar_url: string | null
      role: GroupMemberRole
      chapter_index: number | null
      updated_at: string | null
    }
    const rows = (data ?? []) as Row[]
    return ok(
      rows.map((r) => ({
        userId: r.user_id,
        displayName: r.display_name ?? r.username ?? "Reader",
        username: r.username ?? r.user_id.slice(0, 8),
        avatarUrl: r.avatar_url,
        role: r.role,
        chapterIndex: r.chapter_index,
        updatedAt: r.updated_at,
      })),
    )
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Study goals (group_goals — study-group surface, built on the foundation) ──

export const GOAL_TARGET_TYPES = ["chapters", "trials", "minutes"] as const
export type GoalTargetType = (typeof GOAL_TARGET_TYPES)[number]

/** Notify a group's other active members of a study event (best-effort). */
async function notifyGroupMembers(
  admin: ReturnType<typeof createAdminClient>,
  groupId: string,
  actorId: string,
  title: string,
  body?: string,
) {
  const [{ data: group }, { data: members }] = await Promise.all([
    admin.from("groups").select("name, kind").eq("id", groupId).single(),
    admin
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId)
      .eq("status", "active"),
  ])
  const base = basePathFor(group?.kind)
  const recipients = ((members ?? []) as { user_id: string }[])
    .map((m) => m.user_id)
    .filter((id) => id !== actorId)
  if (recipients.length > 0) {
    await notify(
      recipients.map((recipientId) => ({
        recipientId,
        type: "system" as const,
        actorId,
        entityType: "group",
        entityId: groupId,
        title,
        body,
        actionUrl: `${base}/${groupId}`,
      })),
    )
  }
}

const GoalInput = z.object({
  groupId: Uuid,
  title: z.string().trim().min(1).max(200),
  targetType: z.enum(GOAL_TARGET_TYPES),
  targetValue: z.number().int().positive().max(1_000_000),
  dueAt: z.string().trim().optional(),
})

/** Create a shared study goal (RLS: active member). Notifies fellow members. */
export async function createGroupGoal(
  input: z.infer<typeof GoalInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = GoalInput.safeParse(input)
  if (!parsed.success) return fail("Invalid goal.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("group_goals")
      .insert({
        group_id: parsed.data.groupId,
        title: parsed.data.title,
        target_type: parsed.data.targetType,
        target_value: parsed.data.targetValue,
        due_at: parsed.data.dueAt || null,
        created_by: user.id,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    await notifyGroupMembers(
      createAdminClient(),
      parsed.data.groupId,
      user.id,
      "New study goal set",
      parsed.data.title,
    )
    revalidatePath(`/study-groups/${parsed.data.groupId}`)
    return ok({ id: (data as { id: string }).id })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Mark a goal complete / reopen it (RLS: active member). Notifies on completion. */
export async function setGoalComplete(
  goalId: string,
  complete: boolean,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(goalId)
  if (!parsed.success) return fail("Invalid goal id.")
  try {
    const { supabase, user } = await requireUser()
    const { data: goal, error } = await supabase
      .from("group_goals")
      .update({ completed_at: complete ? new Date().toISOString() : null })
      .eq("id", parsed.data)
      .select("group_id, title")
      .single()
    if (error) return fail(error.message)
    const row = goal as { group_id: string; title: string }
    if (complete) {
      await notifyGroupMembers(
        createAdminClient(),
        row.group_id,
        user.id,
        "Study goal met",
        row.title,
      )
    }
    revalidatePath(`/study-groups/${row.group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Delete a goal (RLS: creator or moderator). */
export async function deleteGroupGoal(
  goalId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(goalId)
  if (!parsed.success) return fail("Invalid goal id.")
  try {
    const { supabase } = await requireUser()
    const { data: row, error } = await supabase
      .from("group_goals")
      .delete()
      .eq("id", parsed.data)
      .select("group_id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/study-groups/${(row as { group_id: string }).group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Collaborative notes (group_notes) ────────────────────────────────────────

const NoteInput = z.object({
  groupId: Uuid,
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().max(20000).optional(),
})

/** Create a collaborative note (RLS: active member). Notifies fellow members. */
export async function createGroupNote(
  input: z.infer<typeof NoteInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = NoteInput.safeParse(input)
  if (!parsed.success) return fail("Give your note a title.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("group_notes")
      .insert({
        group_id: parsed.data.groupId,
        author_id: user.id,
        title: parsed.data.title,
        body: parsed.data.body ?? "",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    await notifyGroupMembers(
      createAdminClient(),
      parsed.data.groupId,
      user.id,
      "New shared note",
      parsed.data.title,
    )
    revalidatePath(`/study-groups/${parsed.data.groupId}`)
    return ok({ id: (data as { id: string }).id })
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

const NoteEditInput = z.object({
  noteId: Uuid,
  title: z.string().trim().min(1).max(200),
  body: z.string().trim().max(20000).optional(),
})

/** Edit a note (RLS: author or moderator). Stamps updated_at. */
export async function updateGroupNote(
  input: z.infer<typeof NoteEditInput>,
): Promise<ActionResult<void>> {
  const parsed = NoteEditInput.safeParse(input)
  if (!parsed.success) return fail("Invalid note.")
  try {
    const { supabase } = await requireUser()
    const { data: row, error } = await supabase
      .from("group_notes")
      .update({
        title: parsed.data.title,
        body: parsed.data.body ?? "",
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.noteId)
      .select("group_id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/study-groups/${(row as { group_id: string }).group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

/** Delete a note (RLS: author or moderator). */
export async function deleteGroupNote(
  noteId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(noteId)
  if (!parsed.success) return fail("Invalid note id.")
  try {
    const { supabase } = await requireUser()
    const { data: row, error } = await supabase
      .from("group_notes")
      .delete()
      .eq("id", parsed.data)
      .select("group_id")
      .single()
    if (error) return fail(error.message)
    revalidatePath(`/study-groups/${(row as { group_id: string }).group_id}`)
    return ok(undefined)
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}

// ── Trials leaderboard (read live from quiz_results, no duplication) ─────────

export interface TrialsLeaderboardRow {
  userId: string
  displayName: string
  username: string
  avatarUrl: string | null
  role: GroupMemberRole
  trialsPassed: number
  totalWisdom: number
  avgScore: number | null
  lastTrialAt: string | null
}

/** Each active member's passed-Trial stats (→ group_trials_leaderboard RPC). */
export async function listTrialsLeaderboard(
  groupId: string,
): Promise<ActionResult<TrialsLeaderboardRow[]>> {
  const parsed = Uuid.safeParse(groupId)
  if (!parsed.success) return fail("Invalid group id.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase.rpc("group_trials_leaderboard", {
      p_group: parsed.data,
    })
    if (error) return fail(friendlyError(error.message))
    type Row = {
      user_id: string
      display_name: string | null
      username: string | null
      avatar_url: string | null
      role: GroupMemberRole
      trials_passed: number | string
      total_wisdom: number | string
      avg_score: number | string | null
      last_trial_at: string | null
    }
    const rows = (data ?? []) as Row[]
    return ok(
      rows.map((r) => ({
        userId: r.user_id,
        displayName: r.display_name ?? r.username ?? "Reader",
        username: r.username ?? r.user_id.slice(0, 8),
        avatarUrl: r.avatar_url,
        role: r.role,
        trialsPassed: Number(r.trials_passed ?? 0),
        totalWisdom: Number(r.total_wisdom ?? 0),
        avgScore: r.avg_score === null ? null : Number(r.avg_score),
        lastTrialAt: r.last_trial_at,
      })),
    )
  } catch (e) {
    return fail(friendlyError((e as Error).message))
  }
}
