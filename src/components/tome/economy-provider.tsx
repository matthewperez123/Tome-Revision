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
  getLevel,
  createDefaultStats,
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
} from "@/lib/economy"
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
  level: { level: number; xpInLevel: number; xpForNext: number }
  dailyGoalMet: boolean
  heartsRegenAt: Date | null
  dispatch: (event: EconomyEvent) => EconomyResult
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

// Use a guest user ID until auth is implemented
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

export function TomeEconomyProvider({ children }: { children: ReactNode }) {
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

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stats))
  }, [stats])

  // Check streak on load
  useEffect(() => {
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
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
  }, [stats, evaluateAfterEvent])

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
  const level = useMemo(() => getLevel(stats.xp_total), [stats.xp_total])
  const dailyGoalMet = useMemo(() => isDailyGoalMet(stats), [stats])
  const heartsRegenAt = useMemo(() => {
    if (stats.hearts >= MAX_HEARTS) return null
    const lastRegen = new Date(stats.hearts_last_regen).getTime()
    return new Date(lastRegen + HEART_REGEN_INTERVAL_MS)
  }, [stats.hearts, stats.hearts_last_regen])

  const value = useMemo<EconomyContextValue>(
    () => ({ stats, level, dailyGoalMet, heartsRegenAt, dispatch, refreshHearts, pendingUnlocks, dismissUnlock }),
    [stats, level, dailyGoalMet, heartsRegenAt, dispatch, refreshHearts, pendingUnlocks, dismissUnlock]
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
