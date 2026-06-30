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

export interface FriendCandidate {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

// ── Discovery ─────────────────────────────────────────────────────────────
// Resolution goes exclusively through the SECURITY DEFINER RPCs so we never
// expose a fuzzy / email / full-name search that could surface a student. A
// friend code is a shared secret (resolves any account); a handle resolves
// only profiles that opted into discovery.

const FRIEND_CODE_RE = /^[A-Za-z0-9]{8}$/

async function resolveCandidate(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  rawQuery: string,
): Promise<FriendCandidate | null> {
  const query = rawQuery.trim()
  const handle = query.replace(/^@/, "")
  const looksLikeCode = FRIEND_CODE_RE.test(query)

  // Try the most-likely resolver first, then fall back to the other so a
  // single input box accepts both a handle and a code.
  const order = looksLikeCode
    ? (["code", "handle"] as const)
    : (["handle", "code"] as const)

  for (const kind of order) {
    const { data } =
      kind === "code"
        ? await supabase.rpc("find_friend_candidate_by_code", { p_code: query })
        : await supabase.rpc("find_friend_candidate_by_handle", {
            p_handle: handle,
          })
    const row = (data as FriendCandidate[] | null)?.[0]
    if (row) return row
  }
  return null
}

/** Resolve a handle or friend code to a candidate without sending a request. */
export async function findFriendCandidate(
  query: string,
): Promise<ActionResult<FriendCandidate | null>> {
  if (query.trim().length < 2) return fail("Enter a handle or friend code.")
  try {
    const { supabase } = await requireUser()
    return ok(await resolveCandidate(supabase, query))
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Mutations ─────────────────────────────────────────────────────────────

async function sendToAddressee(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  userId: string,
  addresseeId: string,
): Promise<ActionResult<{ id: string }>> {
  if (addresseeId === userId) return fail("You can't friend yourself.")

  // The unordered-pair unique index means at most one row can exist between
  // any two users. Reconcile against it before inserting.
  const { data: existing } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status")
    .or(
      `and(requester_id.eq.${userId},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${userId})`,
    )
    .maybeSingle()

  if (existing) {
    const row = existing as {
      id: string
      requester_id: string
      addressee_id: string
      status: string
    }
    if (row.status === "accepted") return fail("You're already friends.")
    if (row.status === "blocked") return fail("This user can't be added.")
    if (row.status === "pending") {
      if (row.addressee_id === userId) {
        // They already requested me — accept instead of duplicating.
        const accepted = await respondToFriendRequest(row.id, true)
        if (!accepted.ok) return fail(accepted.error)
        return ok({ id: row.id })
      }
      return fail("Request already sent.")
    }
    // Previously declined: re-open as a fresh pending request from me.
    const { error } = await supabase
      .from("friendships")
      .update({
        status: "pending",
        responded_at: null,
      })
      .eq("id", row.id)
    if (error) return fail(error.message)
    await sendRequestNotification(supabase, userId, addresseeId, row.id)
    revalidatePath("/friends")
    return ok({ id: row.id })
  }

  const { data, error } = await supabase
    .from("friendships")
    .insert({
      requester_id: userId,
      addressee_id: addresseeId,
      status: "pending",
    })
    .select("id")
    .single()
  if (error) return fail(error.message)

  await sendRequestNotification(supabase, userId, addresseeId, data.id)
  revalidatePath("/friends")
  return ok({ id: data.id })
}

async function sendRequestNotification(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  userId: string,
  addresseeId: string,
  friendshipId: string,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .single()
  await notify({
    recipientId: addresseeId,
    type: "friend_request",
    title: `${profile?.display_name ?? "Someone"} sent you a friend request`,
    actionUrl: "/friends",
    actorId: userId,
    entityType: "friendship",
    entityId: friendshipId,
  })
}

/** Send a friend request directly to a known user id. */
export async function sendFriendRequest(
  addresseeId: string,
): Promise<ActionResult<{ id: string }>> {
  const parsed = Uuid.safeParse(addresseeId)
  if (!parsed.success) return fail("Invalid user.")
  try {
    const { supabase, user } = await requireUser()
    return sendToAddressee(supabase, user.id, parsed.data)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Resolve a handle or friend code and send a request in one step. */
export async function addFriendByQuery(
  query: string,
): Promise<ActionResult<{ id: string; candidate: FriendCandidate }>> {
  if (query.trim().length < 2) return fail("Enter a handle or friend code.")
  try {
    const { supabase, user } = await requireUser()
    const candidate = await resolveCandidate(supabase, query)
    if (!candidate) return fail("No discoverable reader found for that handle or code.")
    const result = await sendToAddressee(supabase, user.id, candidate.id)
    if (!result.ok) return fail(result.error)
    return ok({ id: result.data.id, candidate })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function respondToFriendRequest(
  friendshipId: string,
  accept: boolean,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(friendshipId)
  if (!parsed.success) return fail("Invalid request id.")
  try {
    const { supabase, user } = await requireUser()
    const status = accept ? "accepted" : "declined"

    // RLS already restricts updates to the addressee for accept/decline; the
    // explicit addressee filter makes the intent clear and scopes the row.
    const { data: row, error } = await supabase
      .from("friendships")
      .update({ status, responded_at: new Date().toISOString() })
      .eq("id", parsed.data)
      .eq("addressee_id", user.id)
      .eq("status", "pending")
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
        recipientId: row.requester_id,
        type: "friend_accepted",
        title: `${profile?.display_name ?? "Someone"} accepted your friend request`,
        actionUrl: "/friends",
        actorId: user.id,
        entityType: "friendship",
        entityId: parsed.data,
      })
    }

    revalidatePath("/friends")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Remove a friendship row entirely (either party may unfriend). */
export async function unfriend(
  friendshipId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(friendshipId)
  if (!parsed.success) return fail("Invalid friendship id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    revalidatePath("/friends")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/** Block the other party on an existing friendship/request row. */
export async function blockFriend(
  friendshipId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(friendshipId)
  if (!parsed.success) return fail("Invalid friendship id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("friendships")
      .update({ status: "blocked", responded_at: new Date().toISOString() })
      .eq("id", parsed.data)
    if (error) return fail(error.message)
    revalidatePath("/friends")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}
