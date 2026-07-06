"use client"

/**
 * Reader account sync — mirrors reader preferences and reading position to
 * Supabase for logged-in users so they follow the account across devices.
 *
 * localStorage remains the instant/offline source of truth (see reader-prefs.ts
 * and the reader page's existing position writes); this layer is additive.
 *
 * All network calls are guarded on an authenticated user and swallow errors:
 * the backing tables (`reading_preferences`, `reading_progress`) are introduced
 * by a migration that may not be applied yet, and a missing table must never
 * break reading.
 */

import { useEffect, useRef } from "react"
import { supabase } from "@/lib/supabase"
import { fetchReadingProgress } from "@/lib/reading/positions"
import {
  applyRemoteReaderPrefs,
  getReaderPrefs,
  subscribeReaderPrefs,
  type ReaderPrefs,
} from "@/lib/reader/reader-prefs"

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

/**
 * One-shot remote load + debounced save of reader preferences.
 * Mount once near the top of the reader.
 */
export function useReaderPrefsSync(): void {
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const userIdRef = useRef<string | null>(null)
  const loadedRef = useRef(false)

  // Initial load from the account (overrides localStorage if present).
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const uid = await getUserId()
      if (cancelled) return
      userIdRef.current = uid
      if (!uid) {
        loadedRef.current = true
        return
      }
      try {
        const { data } = await supabase
          .from("reading_preferences")
          .select("prefs")
          .eq("user_id", uid)
          .maybeSingle()
        if (!cancelled && data?.prefs) {
          applyRemoteReaderPrefs(data.prefs as Partial<ReaderPrefs>)
        }
      } catch {
        /* table missing / offline — keep local prefs */
      } finally {
        if (!cancelled) loadedRef.current = true
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  // Debounced save of local prefs changes to the account.
  useEffect(() => {
    function scheduleSave() {
      const uid = userIdRef.current
      if (!uid || !loadedRef.current) return
      if (saveTimer.current) clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(async () => {
        const { error } = await supabase
          .from("reading_preferences")
          .upsert(
            { user_id: uid, prefs: getReaderPrefs(), updated_at: new Date().toISOString() },
            { onConflict: "user_id" }
          )
        // Non-fatal for local reading (localStorage is the source of truth), but
        // no longer invisible: a cross-device sync failure is now observable.
        if (error) console.warn("[reader-sync] reading_preferences upsert failed:", error.message)
      }, 800)
    }

    // Same-tab changes: store notifies directly. Cross-tab: localStorage event.
    const unsubscribe = subscribeReaderPrefs(scheduleSave)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "tome-reader-prefs") scheduleSave()
    }
    window.addEventListener("storage", onStorage)

    return () => {
      unsubscribe()
      window.removeEventListener("storage", onStorage)
      if (saveTimer.current) clearTimeout(saveTimer.current)
    }
  }, [])
}

// ── Reading position ─────────────────────────────────────────────────────────

export interface ReadingPosition {
  chapterIndex: number
  page: number | null
  scrollRatio: number | null
  paragraphAnchor?: string | null
  percent?: number | null
}

let positionTimer: ReturnType<typeof setTimeout> | null = null

/** Debounced upsert of reading position for the logged-in user (~3s). */
export function saveReadingPosition(bookId: string, pos: ReadingPosition): void {
  if (positionTimer) clearTimeout(positionTimer)
  positionTimer = setTimeout(async () => {
    const uid = await getUserId()
    if (!uid) return
    const { error } = await supabase.from("reading_progress").upsert(
      {
        user_id: uid,
        book_id: bookId,
        chapter_index: pos.chapterIndex,
        page: pos.page,
        scroll_ratio: pos.scrollRatio,
        paragraph_anchor: pos.paragraphAnchor ?? null,
        percent: pos.percent ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,book_id" }
    )
    // Non-fatal (local position still tracked), but a failed cross-device sync
    // is now observable rather than silently dropped.
    if (error) console.warn("[reader-sync] reading_progress upsert failed:", error.message)
  }, 3000)
}

/** Fetch the last saved reading position for the logged-in user, if any. */
export async function fetchReadingPosition(bookId: string): Promise<ReadingPosition | null> {
  const entry = await fetchReadingProgress(bookId)
  if (!entry) return null
  return {
    chapterIndex: entry.chapterIndex,
    page: entry.page,
    scrollRatio: entry.scrollRatio,
    paragraphAnchor: entry.paragraphAnchor,
    percent: entry.percent,
  }
}
