"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

export interface RecommendedBy {
  displayName: string
  username: string
}

/**
 * Returns a `bookId → recommender` map for every accepted book recommendation
 * the current user has in their library. Empty in demo mode and while
 * loading. Used by the library grid to render a "Recommended by X" pill on
 * the matching book cards.
 */
export function useLibraryRecommendations(): Record<string, RecommendedBy> {
  const { user, isDemoMode } = useAuth()
  const [map, setMap] = useState<Record<string, RecommendedBy>>({})

  useEffect(() => {
    if (!user || isDemoMode) {
      setMap({})
      return
    }
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("library_entries")
        .select(
          `
          book_id,
          recommender:profiles!library_entries_recommended_by_fkey(display_name, username)
        `,
        )
        .eq("user_id", user.id)
        .not("recommended_by", "is", null)
      if (cancelled) return

      type Row = {
        book_id: string
        recommender: { display_name: string | null; username: string | null } | null
      }

      const next: Record<string, RecommendedBy> = {}
      for (const r of (data as unknown as Row[] | null) ?? []) {
        if (!r.recommender) continue
        next[r.book_id] = {
          displayName: r.recommender.display_name ?? r.recommender.username ?? "Someone",
          username: r.recommender.username ?? "",
        }
      }
      setMap(next)
    })()
    return () => {
      cancelled = true
    }
  }, [user, isDemoMode])

  return map
}
