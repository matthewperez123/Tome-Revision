"use client"

/**
 * DemoEconomyProvider — a sandboxed, in-memory economy for marketing demos.
 *
 * It satisfies the exact `useEconomy()` contract (so real components like
 * <QuestionCard> mount unchanged) but keeps all state in React memory:
 *   • NO localStorage reads/writes (never touches `tome-user-stats`)
 *   • NO Supabase, NO achievement engine, NO unlock overlay
 *
 * A visitor playing with a homepage Trial therefore earns Wisdom *inside the
 * demo only* — nothing leaks into a real (guest or signed-in) profile.
 */
import { useCallback, useMemo, useState, type ReactNode } from "react"
import {
  type UserStats,
  type EconomyEvent,
  type EconomyResult,
  applyEvent,
  getRank,
  isDailyGoalMet,
  createDefaultStats,
  MAX_HEARTS,
  HEART_REGEN_INTERVAL_MS,
} from "@/lib/economy"
import {
  EconomyContext,
  type EconomyContextValue,
} from "@/components/tome/economy-provider"

const DEMO_USER_ID = "demo-0000-0000-0000-000000000000"

export function DemoEconomyProvider({
  children,
  initialStats,
}: {
  children: ReactNode
  /** Seed the sandbox (e.g. a non-zero Wisdom total for a richer demo). */
  initialStats?: Partial<UserStats>
}) {
  const [stats, setStats] = useState<UserStats>(() => ({
    ...createDefaultStats(DEMO_USER_ID),
    ...initialStats,
  }))

  const dispatch = useCallback((event: EconomyEvent): EconomyResult => {
    let result: EconomyResult = {
      stats,
      xpGained: 0,
      coinsGained: 0,
      notifications: [],
    }
    setStats((s) => {
      result = applyEvent(s, event)
      return result.stats
    })
    return result
  }, [stats])

  const rank = useMemo(() => getRank(stats.xp_total), [stats.xp_total])
  const dailyGoalMet = useMemo(() => isDailyGoalMet(stats), [stats])
  const heartsRegenAt = useMemo(() => {
    if (stats.hearts >= MAX_HEARTS) return null
    const lastRegen = new Date(stats.hearts_last_regen).getTime()
    return new Date(lastRegen + HEART_REGEN_INTERVAL_MS)
  }, [stats.hearts, stats.hearts_last_regen])

  const value = useMemo<EconomyContextValue>(
    () => ({
      stats,
      rank,
      dailyGoalMet,
      heartsRegenAt,
      dispatch,
      syncStats: () => {},
      refreshHearts: () => {},
      pendingUnlocks: [],
      dismissUnlock: () => {},
    }),
    [stats, rank, dailyGoalMet, heartsRegenAt, dispatch]
  )

  return (
    <EconomyContext.Provider value={value}>{children}</EconomyContext.Provider>
  )
}
