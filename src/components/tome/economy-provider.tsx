"use client"

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react"
import {
  type UserStats,
  type EconomyEvent,
  type EconomyResult,
  applyEvent,
  calculateHearts,
  calculateStreak,
  isDailyGoalMet,
  getRank,
  type RankProgress,
  createDefaultStats,
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
  XP_REWARDS,
  COIN_REWARDS,
} from "@/lib/economy"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import {
  loadAchievementState,
  saveAchievementState,
  unlockAchievement,
  evaluateAchievements,
  getRelevantAchievements,
} from "@/lib/achievements/engine"
import {
  getAllAchievements,
  getBookIdIndex,
} from "@/data/achievements"
import { getAllBookProgress } from "@/lib/book-progress"
import { UnlockAnimation } from "@/components/achievements/UnlockAnimation"
import type { Achievement, AchievementState } from "@/types/achievement"

// ── Context Types ──────────────────────────────

export type EconomyContextValue = {
  stats: UserStats
  rank: RankProgress
  dailyGoalMet: boolean
  heartsRegenAt: Date | null
  dispatch: (event: EconomyEvent) => EconomyResult
  /** Reconcile the local display from an authoritative user_stats row returned
   *  by a server award path (e.g. record_trial_result). No-op for guests. */
  syncStats: (row: Record<string, unknown> | null) => void
  refreshHearts: () => void
  pendingUnlocks: Achievement[]
  dismissUnlock: () => void
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
    xp_total: Number(row.xp_total ?? base.xp_total),
    current_streak: Number(row.current_streak ?? base.current_streak),
    longest_streak: Number(row.longest_streak ?? base.longest_streak),
    hearts: Number(row.hearts ?? base.hearts),
    coins: Number(row.coins ?? base.coins),
    daily_goal_minutes: Number(row.daily_goal_minutes ?? base.daily_goal_minutes),
    daily_progress_minutes: Number(row.daily_progress_minutes ?? base.daily_progress_minutes),
    last_active_date: (row.last_active_date as string) ?? base.last_active_date,
    streak_freeze_available: Boolean(row.streak_freeze_available ?? base.streak_freeze_available),
    hearts_last_regen: (row.hearts_last_regen as string) ?? base.hearts_last_regen,
  }
}

/** The economy_* RPCs return a single user_stats composite (sometimes wrapped in an array). */
function unwrapRow(data: unknown): Record<string, unknown> | null {
  if (Array.isArray(data)) return (data[0] as Record<string, unknown>) ?? null
  return (data as Record<string, unknown>) ?? null
}

/**
 * Apply an economy event to the authoritative server store (user_stats) via the
 * SECURITY DEFINER RPCs and return the reconciled row. Hearts-regen and streak
 * are recomputed server-side, so this is also the anti-spoof boundary.
 */
async function persistEvent(event: EconomyEvent): Promise<Record<string, unknown> | null> {
  switch (event.type) {
    case "quiz_correct": {
      const { data } = await supabase.rpc("economy_award", {
        p_xp: event.xp ?? XP_REWARDS.quiz_correct,
        p_coins: event.coins ?? COIN_REWARDS.quiz_correct,
      })
      return unwrapRow(data)
    }
    case "chapter_complete": {
      const { data } = await supabase.rpc("economy_award", {
        p_xp: XP_REWARDS.chapter_complete,
        p_coins: COIN_REWARDS.chapter_complete,
      })
      return unwrapRow(data)
    }
    case "book_complete": {
      const { data } = await supabase.rpc("economy_award", {
        p_xp: XP_REWARDS.book_complete,
        p_coins: COIN_REWARDS.book_complete,
      })
      return unwrapRow(data)
    }
    case "achievement_unlock": {
      const { data } = await supabase.rpc("economy_award", { p_xp: event.wisdomReward, p_coins: 0 })
      return unwrapRow(data)
    }
    case "quiz_wrong": {
      const { data } = await supabase.rpc("economy_lose_heart")
      return unwrapRow(data)
    }
    case "reading_minutes": {
      const { data } = await supabase.rpc("economy_add_minutes", { p_minutes: event.minutes })
      return unwrapRow(data)
    }
    case "buy_streak_freeze": {
      const { data } = await supabase.rpc("economy_buy_streak_freeze")
      return unwrapRow(data)
    }
    case "use_streak_freeze": {
      const { data } = await supabase.rpc("economy_use_streak_freeze")
      return unwrapRow(data)
    }
    case "heart_refill_with_coins": {
      const { data } = await supabase.rpc("economy_refill_hearts")
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
        const parsed = JSON.parse(stored) as UserStats
        // Regenerate hearts on load
        const { hearts } = calculateHearts(parsed.hearts, parsed.hearts_last_regen)
        return { ...parsed, hearts }
      }
    } catch {
      // ignore parse errors
    }

    return createDefaultStats(GUEST_USER_ID)
  })

  // Achievement unlock queue
  const [pendingUnlocks, setPendingUnlocks] = useState<Achievement[]>([])
  const achievementStateRef = useRef<AchievementState>(loadAchievementState())

  // Authenticated readers are DB-backed: hydrate from the authoritative
  // user_stats row (server recomputes hearts-regen + streak on read).
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

  // Heart regeneration timer
  useEffect(() => {
    if (stats.hearts >= MAX_HEARTS) return

    const interval = setInterval(() => {
      setStats((s) => {
        const { hearts } = calculateHearts(s.hearts, s.hearts_last_regen)
        if (hearts !== s.hearts) {
          return { ...s, hearts, hearts_last_regen: new Date().toISOString() }
        }
        return s
      })
    }, 60000) // check every minute

    return () => clearInterval(interval)
  }, [stats.hearts])

  // ── Achievement evaluation helper ──────────────

  const evaluateAfterEvent = useCallback(
    (
      updatedStats: UserStats,
      trigger:
        | { type: "book-complete"; bookId: string }
        | { type: "streak-change" }
        | { type: "wisdom-change" },
    ) => {
      const allAchievements = getAllAchievements()
      const bookIdIndex = getBookIdIndex()

      // Get completed book IDs from progress
      const progress = getAllBookProgress()
      const completedBookIds = Object.keys(progress).filter(
        (bookId) => progress[bookId].completedChapterIndices.length > 0,
      )

      // Narrow candidate set based on trigger type
      const candidates = getRelevantAchievements(allAchievements, bookIdIndex, trigger)

      // Evaluate which candidates are newly unlocked
      const currentState = achievementStateRef.current
      const newlyUnlocked = evaluateAchievements(
        candidates,
        completedBookIds,
        updatedStats,
        currentState,
      )

      if (newlyUnlocked.length > 0) {
        // Persist unlocks
        let state = currentState
        for (const achievement of newlyUnlocked) {
          state = unlockAchievement(achievement, state)
        }
        saveAchievementState(state)
        achievementStateRef.current = state

        // Queue unlock animations
        setPendingUnlocks((prev) => [...prev, ...newlyUnlocked])
      }
    },
    [],
  )

  // Dispatch economy events
  const dispatch = useCallback((event: EconomyEvent): EconomyResult => {
    let result: EconomyResult = { stats, xpGained: 0, coinsGained: 0, notifications: [] }
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

    // Evaluate achievements after economy-changing events
    if (event.type === "book_complete") {
      // The bookId is not on the event type currently, so we evaluate broadly
      evaluateAfterEvent(result.stats, { type: "book-complete", bookId: "" })
      evaluateAfterEvent(result.stats, { type: "wisdom-change" })
    } else if (event.type === "chapter_complete") {
      evaluateAfterEvent(result.stats, { type: "wisdom-change" })
    }

    // Streak changes are handled on mount, but also check after any XP-granting event
    if (event.type === "quiz_correct" || event.type === "chapter_complete" || event.type === "book_complete") {
      evaluateAfterEvent(result.stats, { type: "streak-change" })
    }

    return result
  }, [stats, evaluateAfterEvent, userId])

  // Reconcile the display from an authoritative server row (record_trial_result
  // returns the reconciled user_stats). Guests have no server row → ignore.
  const syncStats = useCallback((row: Record<string, unknown> | null) => {
    if (!userId || !row) return
    setStats(rowToStats(row, userId))
  }, [userId])

  // Dismiss the front of the unlock queue
  const dismissUnlock = useCallback(() => {
    setPendingUnlocks((prev) => prev.slice(1))
  }, [])

  // Manual heart refresh
  const refreshHearts = useCallback(() => {
    setStats((s) => {
      const { hearts } = calculateHearts(s.hearts, s.hearts_last_regen)
      return { ...s, hearts }
    })
  }, [])

  // Derived values
  const rank = useMemo(() => getRank(stats.xp_total), [stats.xp_total])
  const dailyGoalMet = useMemo(() => isDailyGoalMet(stats), [stats])
  const heartsRegenAt = useMemo(() => {
    if (stats.hearts >= MAX_HEARTS) return null
    const lastRegen = new Date(stats.hearts_last_regen).getTime()
    return new Date(lastRegen + HEART_REGEN_INTERVAL_MS)
  }, [stats.hearts, stats.hearts_last_regen])

  const value = useMemo<EconomyContextValue>(
    () => ({ stats, rank, dailyGoalMet, heartsRegenAt, dispatch, syncStats, refreshHearts, pendingUnlocks, dismissUnlock }),
    [stats, rank, dailyGoalMet, heartsRegenAt, dispatch, syncStats, refreshHearts, pendingUnlocks, dismissUnlock]
  )

  return (
    <EconomyContext.Provider value={value}>
      {children}
      {/* Unlock animation overlay */}
      <UnlockAnimation
        achievement={pendingUnlocks[0] ?? null}
        onDismiss={dismissUnlock}
      />
    </EconomyContext.Provider>
  )
}
