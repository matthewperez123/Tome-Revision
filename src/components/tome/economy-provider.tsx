"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  type ReactNode,
} from "react"
import {
  type UserStats,
  type EconomyEvent,
  type EconomyResult,
  applyEvent,
  calculateStreak,
  isDailyGoalMet,
  createDefaultStats,
} from "@/lib/economy"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

// ── Context Types ──────────────────────────────

export type EconomyContextValue = {
  stats: UserStats
  dailyGoalMet: boolean
  dispatch: (event: EconomyEvent) => EconomyResult
  /** Reconcile the local display from an authoritative user_stats row returned
   *  by a server path (e.g. economy_sync). No-op for guests. */
  syncStats: (row: Record<string, unknown> | null) => void
}

// Exported so sandboxed surfaces (e.g. marketing demos) can supply an
// in-memory economy value that satisfies `useEconomy()` without ever touching
// the real localStorage stats. See components/demo/DemoEconomyProvider.
export const EconomyContext = createContext<EconomyContextValue | null>(null)

// ── Hook ───────────────────────────────────────

export function useEconomy() {
  const ctx = useContext(EconomyContext)
  if (!ctx) {
    throw new Error("useEconomy must be used within a TomeEconomyProvider")
  }
  return ctx
}

// ── Provider ───────────────────────────────────

const STORAGE_KEY = "tome-user-stats"

// Guest / demo readers (no real session) keep their stats in localStorage.
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

const supabase = createClient()

/** Map a user_stats RPC row onto the in-memory UserStats shape. */
function rowToStats(row: Record<string, unknown> | null, userId: string): UserStats {
  const base = createDefaultStats(userId)
  if (!row) return base
  return {
    user_id: userId,
    current_streak: Number(row.current_streak ?? base.current_streak),
    longest_streak: Number(row.longest_streak ?? base.longest_streak),
    daily_goal_minutes: Number(row.daily_goal_minutes ?? base.daily_goal_minutes),
    daily_progress_minutes: Number(row.daily_progress_minutes ?? base.daily_progress_minutes),
    last_active_date: (row.last_active_date as string) ?? base.last_active_date,
    streak_freeze_available: Boolean(row.streak_freeze_available ?? base.streak_freeze_available),
  }
}

/** The economy_* RPCs return a single user_stats composite (sometimes wrapped in an array). */
function unwrapRow(data: unknown): Record<string, unknown> | null {
  if (Array.isArray(data)) return (data[0] as Record<string, unknown>) ?? null
  return (data as Record<string, unknown>) ?? null
}

/**
 * Apply an economy event to the authoritative server store (user_stats) via the
 * SECURITY DEFINER RPCs and return the reconciled row. Streak is recomputed
 * server-side, so this is also the anti-spoof boundary.
 */
async function persistEvent(event: EconomyEvent): Promise<Record<string, unknown> | null> {
  switch (event.type) {
    case "reading_minutes": {
      const { data } = await supabase.rpc("economy_add_minutes", { p_minutes: event.minutes })
      return unwrapRow(data)
    }
    case "use_streak_freeze": {
      const { data } = await supabase.rpc("economy_use_streak_freeze")
      return unwrapRow(data)
    }
    default:
      return null
  }
}

export function TomeEconomyProvider({ children }: { children: ReactNode }) {
  const { user, isLoading: authLoading } = useAuth()
  const userId = user?.id ?? null
  const [stats, setStats] = useState<UserStats>(() => {
    if (typeof window === "undefined") return createDefaultStats(GUEST_USER_ID)

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored) as UserStats
      }
    } catch {
      // ignore parse errors
    }

    return createDefaultStats(GUEST_USER_ID)
  })

  // Authenticated readers are DB-backed: hydrate from the authoritative
  // user_stats row (server recomputes streak on read).
  useEffect(() => {
    if (authLoading || !userId) return
    let cancelled = false
    ;(async () => {
      const { data, error } = await supabase.rpc("economy_sync")
      if (cancelled || error) return
      setStats(rowToStats(unwrapRow(data), userId))
    })()
    return () => {
      cancelled = true
    }
  }, [userId, authLoading])

  // Persist to localStorage on change — GUESTS ONLY. Authenticated stats live in
  // user_stats (written via the economy_* RPCs), never localStorage.
  useEffect(() => {
    if (userId) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats, userId])

  // Check streak on load — guests only (the server normalizes it for authed users).
  useEffect(() => {
    if (authLoading || userId) return
    const goalMet = isDailyGoalMet(stats)
    const { streak, longestStreak, freezeUsed } = calculateStreak(
      stats.current_streak,
      stats.longest_streak,
      stats.last_active_date,
      goalMet,
      stats.streak_freeze_available
    )

    if (
      streak !== stats.current_streak ||
      longestStreak !== stats.longest_streak ||
      (freezeUsed && stats.streak_freeze_available)
    ) {
      setStats((s) => ({
        ...s,
        current_streak: streak,
        longest_streak: longestStreak,
        streak_freeze_available: freezeUsed ? false : s.streak_freeze_available,
        last_active_date: new Date().toISOString().slice(0, 10),
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, userId])

  // Dispatch economy events
  const dispatch = useCallback((event: EconomyEvent): EconomyResult => {
    let result: EconomyResult = { stats, notifications: [] }
    setStats((s) => {
      result = applyEvent(s, event)
      return result.stats
    })

    // Authenticated readers: persist to the authoritative server store and
    // reconcile with the server-computed row (anti-spoof). The optimistic local
    // update above keeps the UI instant; the RPC result is the source of truth.
    if (userId) {
      void persistEvent(event).then((row) => {
        if (row) setStats(rowToStats(row, userId))
      })
    }

    return result
  }, [stats, userId])

  // Reconcile the display from an authoritative server row. Guests have no
  // server row → ignore.
  const syncStats = useCallback((row: Record<string, unknown> | null) => {
    if (!userId || !row) return
    setStats(rowToStats(row, userId))
  }, [userId])

  // Derived values
  const dailyGoalMet = useMemo(() => isDailyGoalMet(stats), [stats])

  const value = useMemo<EconomyContextValue>(
    () => ({ stats, dailyGoalMet, dispatch, syncStats }),
    [stats, dailyGoalMet, dispatch, syncStats]
  )

  return (
    <EconomyContext.Provider value={value}>
      {children}
    </EconomyContext.Provider>
  )
}
