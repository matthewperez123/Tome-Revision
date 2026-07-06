"use server"

import { z } from "zod"
import { sendNewMessageEmails } from "@/lib/email/new-message"
import {
  type ActionResult,
  createAdminClient,
  fail,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()

// ── Start a conversation ────────────────────────────────────────────────────
// Wraps the SECURITY DEFINER `start_conversation` RPC, which validates that
// every recipient shares a classroom with the sender (COPPA-safe: it never
// exposes non-classmates). Best-effort emails the first message afterward.

const StartInput = z.object({
  classroomId: Uuid.nullable().optional(),
  recipientIds: z.array(Uuid).min(1).max(50),
  subject: z.string().trim().max(200).optional(),
  firstMessage: z.string().trim().min(1).max(10000),
})

export async function startConversation(
  input: z.infer<typeof StartInput>,
): Promise<ActionResult<{ conversationId: string }>> {
  const parsed = StartInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()
    const { data: conversationId, error } = await supabase.rpc(
      "start_conversation",
      {
        _classroom_id: parsed.data.classroomId ?? null,
        _recipient_ids: parsed.data.recipientIds,
        _subject: parsed.data.subject ?? null,
        _first_message: parsed.data.firstMessage,
      },
    )
    if (error) return fail(error.message)
    if (!conversationId) return fail("Could not start conversation.")

    await sendNewMessageEmails({
      conversationId: conversationId as string,
      senderId: user.id,
      body: parsed.data.firstMessage,
    })

    return ok({ conversationId: conversationId as string })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Send a message to an existing conversation ──────────────────────────────
// The RLS insert policy requires sender_id = auth.uid() AND participant. An
// AFTER INSERT trigger fans the in-app 'message' notification and bumps
// last_message_at; we then fire the debounced email best-effort.

const SendInput = z.object({
  conversationId: Uuid,
  body: z.string().trim().min(1).max(10000),
})

export async function sendMessage(
  input: z.infer<typeof SendInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = SendInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()
    const { data: row, error } = await supabase
      .from("messages")
      .insert({
        conversation_id: parsed.data.conversationId,
        sender_id: user.id,
        body: parsed.data.body,
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    await sendNewMessageEmails({
      conversationId: parsed.data.conversationId,
      senderId: user.id,
      body: parsed.data.body,
    })

    return ok({ id: row.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Mark a conversation read ────────────────────────────────────────────────
// Stamps the caller's participant row so the inbox unread count clears.

export async function markConversationRead(
  conversationId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(conversationId)
  if (!parsed.success) return fail("Invalid id.")
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

// ── Messaging contacts ──────────────────────────────────────────────────────
// Everyone the caller shares a classroom with (any role), grouped by classroom.
// COPPA-safe: returns only safe profile fields (display_name / username /
// avatar_url), never the synthetic student email. Uses the service-role client
// because reading OTHER members' profiles across a classroom would be hidden by
// profile RLS in some configurations; the classroom-membership check is done
// explicitly here so no non-classmate ever leaks.

export interface MessagingContact {
  id: string
  displayName: string
  username: string | null
  avatarUrl: string | null
  role: string | null
}

export interface MessagingClassroomContacts {
  classroomId: string
  classroomName: string
  contacts: MessagingContact[]
}

export async function listMessagingContacts(): Promise<
  MessagingClassroomContacts[]
> {
  const { user } = await requireUser()
  const admin = createAdminClient()

  // Classrooms the caller belongs to (as any role — owner rows live here too).
  const { data: myRows } = await admin
    .from("classroom_members")
    .select("classroom_id")
    .eq("student_id", user.id)
  const classroomIds = Array.from(
    new Set((myRows ?? []).map((r: { classroom_id: string }) => r.classroom_id)),
  )
  if (classroomIds.length === 0) return []

  const [{ data: classrooms }, { data: members }] = await Promise.all([
    admin.from("classrooms").select("id, name").in("id", classroomIds),
    admin
      .from("classroom_members")
      .select("classroom_id, student_id")
      .in("classroom_id", classroomIds),
  ])

  const otherIds = Array.from(
    new Set(
      (members ?? [])
        .map((m: { student_id: string }) => m.student_id)
        .filter((id: string) => id !== user.id),
    ),
  )
  if (otherIds.length === 0) return []

  const { data: profiles } = await admin
    .from("profiles")
    .select("id, display_name, username, avatar_url, role")
    .in("id", otherIds)
  const profileById = new Map(
    (profiles ?? []).map((p: {
      id: string
      display_name: string | null
      username: string | null
      avatar_url: string | null
      role: string | null
    }) => [p.id, p]),
  )

  const nameById = new Map(
    (classrooms ?? []).map((c: { id: string; name: string }) => [c.id, c.name]),
  )

  const groups: MessagingClassroomContacts[] = []
  for (const cid of classroomIds) {
    const contacts: MessagingContact[] = (members ?? [])
      .filter(
        (m: { classroom_id: string; student_id: string }) =>
          m.classroom_id === cid && m.student_id !== user.id,
      )
      .map((m: { student_id: string }) => profileById.get(m.student_id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((p) => ({
        id: p.id,
        displayName: p.display_name ?? "Unknown",
        username: p.username,
        avatarUrl: p.avatar_url,
        role: p.role,
      }))
    if (contacts.length > 0) {
      groups.push({
        classroomId: cid,
        classroomName: nameById.get(cid) ?? "Classroom",
        contacts,
      })
    }
  }
  return groups
}
