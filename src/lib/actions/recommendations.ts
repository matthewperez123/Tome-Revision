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

const RecommendInput = z.object({
  recipientId: Uuid,
  bookId: z.string().min(1).max(200),
  message: z.string().trim().max(1000).optional(),
})

export async function recommendBook(
  input: z.infer<typeof RecommendInput>,
): Promise<ActionResult<{ id: string }>> {
  const parsed = RecommendInput.safeParse(input)
  if (!parsed.success) return fail("Invalid input.")
  try {
    const { supabase, user } = await requireUser()

    // RLS enforces can_recommend_to(); we still surface a friendly error
    // up front by checking explicitly so the UI can guide the user.
    const { data: allowed } = await supabase.rpc("can_recommend_to", {
      p_sender: user.id,
      p_recipient: parsed.data.recipientId,
    })
    if (!allowed) {
      return fail(
        "You can only recommend books to friends or people in your classes.",
      )
    }

    const { data: row, error } = await supabase
      .from("book_recommendations")
      .insert({
        sender_id: user.id,
        recipient_id: parsed.data.recipientId,
        book_id: parsed.data.bookId,
        message: parsed.data.message ?? null,
        status: "pending",
      })
      .select("id")
      .single()
    if (error) return fail(error.message)

    const admin = createAdminClient()
    const [{ data: book }, { data: profile }] = await Promise.all([
      admin
        .from("books")
        .select("title")
        .eq("id", parsed.data.bookId)
        .single(),
      admin
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single(),
    ])

    await notify({
      recipientId: parsed.data.recipientId,
      type: "book_recommendation",
      title: `${profile?.display_name ?? "Someone"} recommends ${book?.title ?? "a book"}`,
      body: parsed.data.message ?? undefined,
      actionUrl: "/library/browse",
      actorId: user.id,
      // entity_id carries the rec id so the bell can offer inline
      // accept/reject without an extra round-trip to look it up.
      entityType: "recommendation",
      entityId: row.id,
      payload: { status: "received", bookId: parsed.data.bookId, bookTitle: book?.title ?? null },
    })

    revalidatePath("/library/browse")
    return ok({ id: row.id })
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function acceptRecommendation(
  recommendationId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(recommendationId)
  if (!parsed.success) return fail("Invalid id.")
  try {
    const { supabase, user } = await requireUser()

    const { data: rec, error: updErr } = await supabase
      .from("book_recommendations")
      .update({ status: "accepted", responded_at: new Date().toISOString() })
      .eq("id", parsed.data)
      .eq("recipient_id", user.id)
      .select("id, sender_id, book_id")
      .single()
    if (updErr) return fail(updErr.message)
    if (!rec) return fail("Recommendation not found.")

    // Add to library (or update existing entry's recommended_by attribution).
    const { error: libErr } = await supabase.from("library_entries").upsert(
      {
        user_id: user.id,
        book_id: rec.book_id,
        recommended_by: rec.sender_id,
      },
      { onConflict: "user_id,book_id" },
    )
    if (libErr) return fail(libErr.message)

    const admin = createAdminClient()
    const [{ data: profile }, { data: book }] = await Promise.all([
      admin
        .from("profiles")
        .select("display_name")
        .eq("id", user.id)
        .single(),
      admin
        .from("books")
        .select("title")
        .eq("id", rec.book_id)
        .single(),
    ])

    await notify({
      recipientId: rec.sender_id,
      type: "book_recommendation",
      title: `${profile?.display_name ?? "Someone"} added ${book?.title ?? "your recommendation"} to their library`,
      actionUrl: "/library/browse",
      actorId: user.id,
      entityType: "recommendation",
      entityId: rec.id,
      payload: { status: "accepted" },
    })

    revalidatePath("/library/browse")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

export async function rejectRecommendation(
  recommendationId: string,
): Promise<ActionResult<void>> {
  const parsed = Uuid.safeParse(recommendationId)
  if (!parsed.success) return fail("Invalid id.")
  try {
    const { supabase, user } = await requireUser()
    const { error } = await supabase
      .from("book_recommendations")
      .update({ status: "rejected", responded_at: new Date().toISOString() })
      .eq("id", parsed.data)
      .eq("recipient_id", user.id)
    if (error) return fail(error.message)
    revalidatePath("/library/browse")
    return ok(undefined)
  } catch (e) {
    return fail((e as Error).message)
  }
}

const ListInput = z.object({
  status: z.enum(["pending", "accepted", "rejected"]).optional(),
})

export async function listMyRecommendations(
  input: z.infer<typeof ListInput> = {},
) {
  const parsed = ListInput.safeParse(input)
  if (!parsed.success) throw new Error("Invalid input.")
  const { supabase, user } = await requireUser()
  let q = supabase
    .from("book_recommendations")
    .select(
      `
      id, status, message, created_at, responded_at, book_id,
      sender:profiles!book_recommendations_sender_id_fkey(id, display_name, username, avatar_url),
      book:books!book_recommendations_book_id_fkey(id, title, author, cover_image_path)
    `,
    )
    .eq("recipient_id", user.id)
    .order("created_at", { ascending: false })
  if (parsed.data.status) q = q.eq("status", parsed.data.status)
  const { data, error } = await q
  if (error) throw new Error(error.message)
  return data ?? []
}
