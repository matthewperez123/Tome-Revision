"use client"

/**
 * Shelves — the account-backed read/write helper for the `shelf_items` table.
 *
 * Three manual shelves persist per user (favorites / want_to_read / completed);
 * the "Reading" shelf is DERIVED from `reading_progress`, never stored here.
 *
 * All calls are guarded on an authenticated user and swallow errors — a signed
 * out or offline visitor simply gets empty results and no-op writes. RLS is
 * owner-only (`auth.uid() = user_id`), so these reads/writes are safe from the
 * browser client.
 */

import { supabase } from "@/lib/supabase"

export type Shelf = "favorites" | "want_to_read" | "completed"

export const SHELVES: Shelf[] = ["favorites", "want_to_read", "completed"]

export const SHELF_LABELS: Record<Shelf, string> = {
  favorites: "Favorites",
  want_to_read: "Want to Read",
  completed: "Completed",
}

export interface ShelfItem {
  bookId: string
  shelf: Shelf
  createdAt: string
}

async function getUserId(): Promise<string | null> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return user?.id ?? null
  } catch {
    return null
  }
}

/** Every shelf row for the signed-in reader, most recently added first. */
export async function listShelfItems(): Promise<ShelfItem[]> {
  const uid = await getUserId()
  if (!uid) return []
  try {
    const { data } = await supabase
      .from("shelf_items")
      .select("book_id, shelf, created_at")
      .eq("user_id", uid)
      .order("created_at", { ascending: false })
    return (data ?? []).map((r) => ({
      bookId: r.book_id,
      shelf: r.shelf as Shelf,
      createdAt: r.created_at,
    }))
  } catch {
    return []
  }
}

/** Add a book to a shelf. Idempotent (unique user/book/shelf). */
export async function addToShelf(bookId: string, shelf: Shelf): Promise<void> {
  const uid = await getUserId()
  if (!uid) return
  try {
    await supabase
      .from("shelf_items")
      .upsert(
        { user_id: uid, book_id: bookId, shelf },
        { onConflict: "user_id,book_id,shelf" },
      )
  } catch {
    /* non-fatal */
  }
}

/** Remove a book from a shelf. */
export async function removeFromShelf(bookId: string, shelf: Shelf): Promise<void> {
  const uid = await getUserId()
  if (!uid) return
  try {
    await supabase
      .from("shelf_items")
      .delete()
      .eq("user_id", uid)
      .eq("book_id", bookId)
      .eq("shelf", shelf)
  } catch {
    /* non-fatal */
  }
}

/** Toggle a book on a shelf; returns the resulting membership state. */
export async function toggleShelf(bookId: string, shelf: Shelf): Promise<boolean> {
  const uid = await getUserId()
  if (!uid) return false
  try {
    const { data } = await supabase
      .from("shelf_items")
      .select("id")
      .eq("user_id", uid)
      .eq("book_id", bookId)
      .eq("shelf", shelf)
      .maybeSingle()
    if (data) {
      await removeFromShelf(bookId, shelf)
      return false
    }
    await addToShelf(bookId, shelf)
    return true
  } catch {
    return false
  }
}

/** Whether one book is on one shelf for the signed-in reader. */
export async function isOnShelf(bookId: string, shelf: Shelf): Promise<boolean> {
  const uid = await getUserId()
  if (!uid) return false
  try {
    const { data } = await supabase
      .from("shelf_items")
      .select("id")
      .eq("user_id", uid)
      .eq("book_id", bookId)
      .eq("shelf", shelf)
      .maybeSingle()
    return !!data
  } catch {
    return false
  }
}
