"use client"

import { useCallback, useEffect, useState } from "react"
import { isOnShelf, toggleShelf } from "@/lib/shelves/shelves"

/**
 * Account-backed favorite toggle for a single book. Reads the initial state
 * from `shelf_items` after mount (SSR-safe default = not favorited) and mirrors
 * every toggle back to the account so favorites follow the reader across
 * devices.
 */
export function useFavorite(bookId: string): {
  isFavorite: boolean
  ready: boolean
  toggle: () => void
} {
  const [isFavorite, setIsFavorite] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const on = await isOnShelf(bookId, "favorites")
      if (!cancelled) {
        setIsFavorite(on)
        setReady(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [bookId])

  const toggle = useCallback(() => {
    setIsFavorite((prev) => !prev) // optimistic
    toggleShelf(bookId, "favorites").then((next) => setIsFavorite(next))
  }, [bookId])

  return { isFavorite, ready, toggle }
}
