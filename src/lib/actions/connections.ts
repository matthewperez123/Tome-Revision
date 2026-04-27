"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import {
  type ActionResult,
  fail,
  notify,
  ok,
  requireUser,
} from "./_shared"

const Uuid = z.string().uuid()

// ── Mutations ─────────────────────────────────────────────────────────────

export async function sendFriendRequest(
  recipientId: string,
): Promise<ActionResult<{ id: string }>> {
  const parsed = Uuid.safeParse(recipientId)
  if (!parsed.success) return fail("Invalid recipient.")
  try {
    const { supabase, user } = await requireUser()
    if (parsed.data === user.id) return fail("Cannot friend yourself.")

    const { data, error } = await supabase
      .from("connections")
      .insert({
        requester_id: user.id,
        recipient_id: parsed.data,
        status: "pending",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single()

    await notify({
      userId: parsed.data,
      type: "friend_request_received",
      title: `${profile?.display_name ?? "Someone"} sent you a friend request`,
      actionUrl: "/friends",
      sourceUserId: user.id,
    })

    revalidatePath("/friends")
    return ok({ id: data.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function respondToFriendRequest(
  requestId: string,
  accept: boolean,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(requestId)
  if (!parsed.success) return fail("Invalid request id.")
  try {
    const { supabase, user } = await requireUser()
    const status = accept ? "accepted" : "declined"

    const { data: row, error } = await supabase
      .from("connections")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", parsed.data)
      .eq("recipient_id", user.id)
      .select("requester_id")
      .single()
    if (error) return fail(error.message)
    if (!row) return fail("Request not found.")

    if (accept) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single()
      await notify({
        userId: row.requester_id,
        type: "friend_request_accepted",
        title: `${profile?.display_name ?? "Someone"} accepted your friend request`,
        actionUrl: "/friends",
        sourceUserId: user.id,
      })
    }

    revalidatePath("/friends")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function removeFriend(
  connectionId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(connectionId)
  if (!parsed.success) return fail("Invalid connection id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("connections")
      .delete()
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    revalidatePath("/friends")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Queries ───────────────────────────────────────────────────────────────

export interface FriendListItem {
  connectionId: string
  friend: {
    id: string
    display_name: string | null
    username: string | null
    avatar_url: string | null
  }
  friendsSince: string
}

export async function listFriends(): Promise<FriendListItem[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("connections")
    .select(
      `
      id, requester_id, recipient_id, created_at,
      requester:profiles!connections_requester_id_fkey(id, display_name, username, avatar_url),
      recipient:profiles!connections_recipient_id_fkey(id, display_name, username, avatar_url)
    `,
    )
    .eq("status", "accepted")
    .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
  if (error) throw new Error(error.message)

  type Row = {
    id: string
    requester_id: string
    recipient_id: string
    created_at: string
    requester: FriendListItem["friend"] | null
    recipient: FriendListItem["friend"] | null
  }

  return ((data ?? []) as unknown as Row[]).map((c) => {
    const other = c.requester_id === user.id ? c.recipient : c.requester
    return {
      connectionId: c.id,
      friend: other!,
      friendsSince: c.created_at,
    }
  })
}

export interface PendingRequestItem {
  id: string
  created_at: string
  requester: {
    id: string
    display_name: string | null
    username: string | null
    avatar_url: string | null
  } | null
}

export async function listPendingRequests(): Promise<PendingRequestItem[]> {
  const { supabase, user } = await requireUser()
  const { data, error } = await supabase
    .from("connections")
    .select(
      `
      id, requester_id, created_at,
      requester:profiles!connections_requester_id_fkey(id, display_name, username, avatar_url)
    `,
    )
    .eq("status", "pending")
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
  if (error) throw new Error(error.message)
  return (data ?? []) as unknown as PendingRequestItem[]
}
