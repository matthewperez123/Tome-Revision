"use client"

/**
 * Reading positions — the single read-side helper for the `reading_progress`
 * table. Every surface that shows "where the reader left off" (the /reading
 * page, the dashboard "Continue Reading" card) reads through here so there is
 * one query, not several ad-hoc ones.
 *
 * The write path lives in `@/lib/reader/reader-sync` (debounced, reader-only).
 * All calls are guarded on an authenticated user and swallow errors — a signed
 * out or offline visitor simply gets an empty list.
 */

import { supabase } from "@/lib/supabase"

export interface ReadingProgressEntry {
  bookId: string
  chapterIndex: number
  percent: number | null
  paragraphAnchor: string | null
  page: number | null
  scrollRatio: number | null
  updatedAt: string
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

function mapRow(row: {
  book_id: string
  chapter_index: number | null
  percent: number | null
  paragraph_anchor: string | null
  page: number | null
  scroll_ratio: number | null
  updated_at: string
}): ReadingProgressEntry {
  return {
    bookId: row.book_id,
    chapterIndex: row.chapter_index ?? 0,
    percent: row.percent,
    paragraphAnchor: row.paragraph_anchor,
    page: row.page,
    scrollRatio: row.scroll_ratio,
    updatedAt: row.updated_at,
  }
}

/** All of the signed-in reader's book positions, most recently read first. */
export async function listReadingProgress(): Promise<ReadingProgressEntry[]> {
  const uid = await getUserId()
  if (!uid) return []
  try {
    const { data } = await supabase
      .from("reading_progress")
      .select("book_id, chapter_index, percent, paragraph_anchor, page, scroll_ratio, updated_at")
      .eq("user_id", uid)
      .order("updated_at", { ascending: false })
    return (data ?? []).map(mapRow)
  } catch {
    return []
  }
}

/** The signed-in reader's saved position for one book, if any. */
export async function fetchReadingProgress(bookId: string): Promise<ReadingProgressEntry | null> {
  const uid = await getUserId()
  if (!uid) return null
  try {
    const { data } = await supabase
      .from("reading_progress")
      .select("book_id, chapter_index, percent, paragraph_anchor, page, scroll_ratio, updated_at")
      .eq("user_id", uid)
      .eq("book_id", bookId)
      .maybeSingle()
    return data ? mapRow(data) : null
  } catch {
    return null
  }
}
