"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { sendNewMessageEmails } from "@/lib/email/new-message"
import { type ActionResult, fail, ok, requireUser } from "./_shared"

const Uuid = z.string().uuid()

// ── DTOs ──────────────────────────────────────────────────────────────────

export interface Participant {
  id: string
  name: string
  avatarUrl: string | null
}

export interface ConversationSummary {
  id: string
  subject: string | null
  classroomId: string | null
  lastMessageAt: string
  participants: Participant[]
  lastMessage: { body: string; senderId: string; createdAt: string } | null
  unreadCount: number
}

export interface ChatMessage {
  id: string
  conversationId: string
  senderId: string
  body: string
  createdAt: string
}

export interface MessageableUser {
  id: string
  name: string
  avatarUrl: string | null
  role: string
  classroomId: string
  classroomName: string
}

// ── Queries ─────────────────────────────────────────────────────────────────

/**
 * Every conversation the caller participates in, newest first, hydrated with
 * the other participants' names, the latest message, and an unread count
 * (messages newer than the caller's last_read_at). RLS gates each table so a
 * non-participant can never read these rows.
 */
export async function listConversations(): Promise<ConversationSummary[]> {
  const { supabase, user } = await requireUser()

  // Conversations I'm in + my read cursor.
  const { data: myParts, error: partErr } = await supabase
    .from("conversation_participants")
    .select("conversation_id, last_read_at")
    .eq("profile_id", user.id)
  if (partErr) throw new Error(partErr.message)

  const convIds = (myParts ?? []).map((p) => p.conversation_id)
  if (convIds.length === 0) return []

  const lastReadByConv = new Map<string, string | null>(
    (myParts ?? []).map((p) => [p.conversation_id, p.last_read_at]),
  )

  const [{ data: convs, error: convErr }, { data: parts }, { data: msgs }] =
    await Promise.all([
      supabase
        .from("conversations")
        .select("id, subject, classroom_id, last_message_at")
        .in("id", convIds)
        .order("last_message_at", { ascending: false }),
      supabase
        .from("conversation_participants")
        .select("conversation_id, profile_id, profiles!inner(id, display_name, avatar_url)")
        .in("conversation_id", convIds),
      supabase
        .from("messages")
        .select("id, conversation_id, sender_id, body, created_at")
        .in("conversation_id", convIds)
        .order("created_at", { ascending: true }),
    ])
  if (convErr) throw new Error(convErr.message)

  type PartRow = {
    conversation_id: string
    profile_id: string
    profiles: { id: string; display_name: string | null; avatar_url: string | null }
  }
  type MsgRow = {
    id: string
    conversation_id: string
    sender_id: string
    body: string
    created_at: string
  }

  const partsByConv = new Map<string, Participant[]>()
  for (const r of (parts ?? []) as unknown as PartRow[]) {
    const list = partsByConv.get(r.conversation_id) ?? []
    // Exclude self from the displayed participant list.
    if (r.profile_id !== user.id) {
      list.push({
        id: r.profiles.id,
        name: r.profiles.display_name ?? "Reader",
        avatarUrl: r.profiles.avatar_url,
      })
    }
    partsByConv.set(r.conversation_id, list)
  }

  const lastMsgByConv = new Map<string, MsgRow>()
  const unreadByConv = new Map<string, number>()
  for (const m of (msgs ?? []) as unknown as MsgRow[]) {
    lastMsgByConv.set(m.conversation_id, m) // asc order → last wins
    const cursor = lastReadByConv.get(m.conversation_id)
    const isUnread =
      m.sender_id !== user.id && (!cursor || m.created_at > cursor)
    if (isUnread) {
      unreadByConv.set(
        m.conversation_id,
        (unreadByConv.get(m.conversation_id) ?? 0) + 1,
      )
    }
  }

  return ((convs ?? []) as { id: string; subject: string | null; classroom_id: string | null; last_message_at: string }[]).map(
    (c) => {
      const lm = lastMsgByConv.get(c.id)
      return {
        id: c.id,
        subject: c.subject,
        classroomId: c.classroom_id,
        lastMessageAt: c.last_message_at,
        participants: partsByConv.get(c.id) ?? [],
        lastMessage: lm
          ? { body: lm.body, senderId: lm.sender_id, createdAt: lm.created_at }
          : null,
        unreadCount: unreadByConv.get(c.id) ?? 0,
      }
    },
  )
}

/** Full message history for one conversation, oldest first. RLS-gated. */
export async function getMessages(
  conversationId: string,
): Promise<ActionResult<ChatMessage[]>> {
  const parsed = Uuid.safeParse(conversationId)
  if (!parsed.success) return fail("Invalid conversation id.")
  try {
    const { supabase } = await requireUser()
    const { data, error } = await supabase
      .from("messages")
      .select("id, conversation_id, sender_id, body, created_at")
      .eq("conversation_id", parsed.data)
      .order("created_at", { ascending: true })
    if (error) return fail(error.message)
    return ok(
      (data ?? []).map((m) => ({
        id: m.id,
        conversationId: m.conversation_id,
        senderId: m.sender_id,
        body: m.body,
        createdAt: m.created_at,
      })),
    )
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** People who share at least one classroom with the caller, grouped per room. */
export async function listMessageableUsers(): Promise<MessageableUser[]> {
  const { supabase, user } = await requireUser()

  const { data: myRooms, error: roomErr } = await supabase
    .from("classroom_members")
    .select("classroom_id, classrooms!inner(id, name)")
    .eq("student_id", user.id)
  if (roomErr) throw new Error(roomErr.message)

  const roomIds = (myRooms ?? []).map((r) => r.classroom_id)
  if (roomIds.length === 0) return []

  type RoomRow = { classroom_id: string; classrooms: { id: string; name: string } }
  const roomNameById = new Map<string, string>(
    (myRooms as unknown as RoomRow[]).map((r) => [r.classroom_id, r.classrooms.name]),
  )

  const { data: members, error: memErr } = await supabase
    .from("classroom_members")
    .select("classroom_id, student_id, role, profiles!inner(id, display_name, avatar_url)")
    .in("classroom_id", roomIds)
  if (memErr) throw new Error(memErr.message)

  type MemberRow = {
    classroom_id: string
    student_id: string
    role: string
    profiles: { id: string; display_name: string | null; avatar_url: string | null }
  }

  return ((members ?? []) as unknown as MemberRow[])
    .filter((m) => m.student_id !== user.id)
    .map((m) => ({
      id: m.profiles.id,
      name: m.profiles.display_name ?? "Reader",
      avatarUrl: m.profiles.avatar_url,
      role: m.role,
      classroomId: m.classroom_id,
      classroomName: roomNameById.get(m.classroom_id) ?? "Classroom",
    }))
}

// ── Mutations ───────────────────────────────────────────────────────────────

const StartInput = z.object({
  classroomId: Uuid,
  recipientIds: z.array(Uuid).min(1).max(50),
  subject: z.string().trim().max(200).optional(),
  firstMessage: z.string().trim().min(1).max(5000),
})

/**
 * Start a conversation via the start_conversation RPC, which validates (in
 * SECURITY DEFINER) that every recipient shares a classroom with the caller
 * before creating the thread, participants, and first message atomically.
 */
export async function startConversation(
  input: z.infer<typeof StartInput>,
): Promise<ActionResult<{ conversationId: string }>> {
  const parsed = StartInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase.rpc("start_conversation", {
      _classroom_id: parsed.data.classroomId,
      _recipient_ids: parsed.data.recipientIds,
      _subject: parsed.data.subject ?? null,
      _first_message: parsed.data.firstMessage,
    })
    if (error) return fail(error.message)

    // Notify the recipients of the opening message (preference-gated +
    // debounced in the helper). Best-effort.
    await sendNewMessageEmails({
      conversationId: data as string,
      senderId: user.id,
      body: parsed.data.firstMessage,
    })

    revalidatePath("/messages")
    return ok({ conversationId: data as string })
  } catch (e) {
    return fail((e as Error).message)
  }
}

const SendInput = z.object({
  conversationId: Uuid,
  body: z.string().trim().min(1).max(5000),
})

/** Append a message. RLS enforces sender = caller AND caller is a participant. */
export async function sendMessage(
  input: z.infer<typeof SendInput>,
): Promise<ActionResult<ChatMessage>> {
  const parsed = SendInput.safeParse(input)
  if (!parsed.success) return fail("Message can't be empty.")
  try {
    const { supabase, user } = await requireUser()
    const { data, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: parsed.data.conversationId,
        sender_id: user.id,
        body: parsed.data.body,
      })
      .select("id, conversation_id, sender_id, body, created_at")
      .single()
    if (error) return fail(error.message)

    // Best-effort email fan-out to the other participants (preference-gated +
    // debounced inside the helper). Never blocks or fails the send.
    await sendNewMessageEmails({
      conversationId: parsed.data.conversationId,
      senderId: user.id,
      body: parsed.data.body,
    })

    return ok({
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      body: data.body,
      createdAt: data.created_at,
    })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Advance the caller's read cursor to now for one conversation. */
export async function markConversationRead(
  conversationId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(conversationId)
  if (!parsed.success) return fail("Invalid conversation id.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("conversation_participants")
      .update({ last_read_at: new Date().toISOString() })
      .eq("conversation_id", parsed.data)
      .eq("profile_id", user.id)
    if (error) return fail(error.message)
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}
