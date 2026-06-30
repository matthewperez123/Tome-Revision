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

export interface LinkCandidate {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  role: string | null
}

// The two roles a caller can claim when opening a link. The OTHER party always
// plays the complementary role, so a directed (parent_id, student_id) pair is
// fully determined by who the caller is.
export type LinkRole = "parent" | "student"

// ── Discovery ─────────────────────────────────────────────────────────────
// A link code is the student's / guardian's shared secret (profiles.friend_code).
// There is NO open handle/email/name search — that is deliberate, so a minor
// can never be surfaced by browsing. Resolution goes exclusively through the
// SECURITY DEFINER RPC, which excludes the caller.

async function resolveLinkCandidate(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  rawCode: string,
): Promise<LinkCandidate | null> {
  const code = rawCode.trim()
  if (!code) return null
  const { data } = await supabase.rpc("find_user_by_link_code", {
    p_code: code,
  })
  return (data as LinkCandidate[] | null)?.[0] ?? null
}

/** Resolve a link code to a candidate without opening a link. */
export async function findLinkCandidate(
  code: string,
): Promise<ActionResult<LinkCandidate | null>> {
  if (code.trim().length < 4) return fail("Enter a link code.")
  try {
    const { supabase } = await requireUser()
    return ok(await resolveLinkCandidate(supabase, code))
  } catch (e) {
    return fail((e as Error).message)
  }
}

// ── Mutations ─────────────────────────────────────────────────────────────

async function sendLinkRequestNotification(
  supabase: Awaited<ReturnType<typeof requireUser>>["supabase"],
  initiatorId: string,
  recipientId: string,
  linkId: string,
  recipientRole: LinkRole,
) {
  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", initiatorId)
    .single()
  const who = profile?.display_name ?? "Someone"
  const title =
    recipientRole === "student"
      ? `${who} wants to follow your reading as your guardian`
      : `${who} wants to link to you as their child`
  await notify({
    recipientId,
    type: "parent_link_request",
    title,
    body: "Confirm to approve. You can revoke access at any time.",
    actionUrl: "/family",
    actorId: initiatorId,
    entityType: "parent_link",
    entityId: linkId,
  })
}

/**
 * Open (or re-open) a consent link to another user found by their link code.
 * `iAm` declares the caller's role; the candidate takes the other role. The
 * link is created `pending` and only becomes `active` once the OTHER party
 * confirms — see confirmParentLink.
 */
export async function linkByCode(
  code: string,
  iAm: LinkRole,
): Promise<ActionResult<{ id: string; candidate: LinkCandidate }>> {
  if (code.trim().length < 4) return fail("Enter a link code.")
  try {
    const { supabase, user } = await requireUser()
    const candidate = await resolveLinkCandidate(supabase, code)
    if (!candidate) return fail("No reader found for that link code.")
    if (candidate.id === user.id) return fail("You can't link to yourself.")

    const parentId = iAm === "parent" ? user.id : candidate.id
    const studentId = iAm === "parent" ? candidate.id : user.id
    // The recipient plays the complementary role.
    const recipientRole: LinkRole = iAm === "parent" ? "student" : "parent"

    // The unique (parent_id, student_id) index means at most one row exists for
    // this directed pair. Reconcile against it before inserting.
    const { data: existing } = await supabase
      .from("parent_links")
      .select("id, status, initiated_by")
      .eq("parent_id", parentId)
      .eq("student_id", studentId)
      .maybeSingle()

    if (existing) {
      const row = existing as {
        id: string
        status: string
        initiated_by: string
      }
      if (row.status === "active") return fail("You're already linked.")
      if (row.status === "pending") {
        if (row.initiated_by === user.id) return fail("Request already sent.")
        // The other party already invited me — confirm instead of duplicating.
        const confirmed = await confirmParentLink(row.id)
        if (!confirmed.ok) return fail(confirmed.error)
        return ok({ id: row.id, candidate })
      }
      // Previously revoked: re-open as a fresh pending request from me.
      const { error } = await supabase
        .from("parent_links")
        .update({ status: "pending", consented_at: null })
        .eq("id", row.id)
      if (error) return fail(error.message)
      await sendLinkRequestNotification(
        supabase,
        user.id,
        candidate.id,
        row.id,
        recipientRole,
      )
      revalidatePath("/family")
      return ok({ id: row.id, candidate })
    }

    const { data, error } = await supabase
      .from("parent_links")
      .insert({
        parent_id: parentId,
        student_id: studentId,
        initiated_by: user.id,
        status: "pending",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    await sendLinkRequestNotification(
      supabase,
      user.id,
      candidate.id,
      data.id,
      recipientRole,
    )
    revalidatePath("/family")
    return ok({ id: data.id, candidate })
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Confirm a pending link. RLS forbids the initiator from activating their own
 * request (auth.uid() <> initiated_by), so the `neq` here mirrors that gate and
 * makes "never auto-active" explicit.
 */
export async function confirmParentLink(
  linkId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(linkId)
  if (!parsed.success) return fail("Invalid link id.")
  try {
    const { supabase, user } = await requireUser()
    const { data: row, error } = await supabase
      .from("parent_links")
      .update({ status: "active", consented_at: new Date().toISOString() })
      .eq("id", parsed.data)
      .eq("status", "pending")
      .neq("initiated_by", user.id)
      .select("initiated_by")
      .single()
    if (error) return fail(error.message)
    if (!row) return fail("Request not found.")

    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", user.id)
      .single()
    await notify({
      recipientId: row.initiated_by,
      type: "system",
      title: `${profile?.display_name ?? "Someone"} confirmed your family link`,
      actionUrl: "/family",
      actorId: user.id,
      entityType: "parent_link",
      entityId: parsed.data,
    })

    revalidatePath("/family")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Decline an incoming request or withdraw one you sent — either way the pending
 * row is deleted so the pair can be re-linked later. Either party may call it.
 */
export async function cancelParentLink(
  linkId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(linkId)
  if (!parsed.success) return fail("Invalid link id.")
  try {
    const { supabase } = await requireUser()
    const { error } = await supabase
      .from("parent_links")
      .delete()
      .eq("id", parsed.data)
      .eq("status", "pending")
    if (error) return fail(error.message)
    revalidatePath("/family")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

/**
 * Revoke an active link. Either party may revoke; the dashboard RPCs gate on an
 * `active` link, so this immediately severs the parent's read access.
 */
export async function revokeParentLink(
  linkId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(linkId)
  if (!parsed.success) return fail("Invalid link id.")
  try {
    const { supabase, user } = await requireUser()
    const { data: row, error } = await supabase
      .from("parent_links")
      .update({ status: "revoked" })
      .eq("id", parsed.data)
      .eq("status", "active")
      .select("parent_id, student_id")
      .single()
    if (error) return fail(error.message)
    if (!row) return fail("Link not found.")

    const other = row.parent_id === user.id ? row.student_id : row.parent_id
    await notify({
      recipientId: other,
      type: "system",
      title: "A family link was revoked",
      body: "Reading-progress sharing has been turned off.",
      actionUrl: "/family",
      actorId: user.id,
      entityType: "parent_link",
      entityId: parsed.data,
    })

    revalidatePath("/family")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}
