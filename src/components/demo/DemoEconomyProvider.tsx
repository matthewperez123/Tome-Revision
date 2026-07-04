"use client"

/**
 * DemoEconomyProvider — a sandboxed, in-memory economy for marketing demos.
 *
 * It satisfies the exact `useEconomy()` contract (so real components like
 * <QuestionCard> mount unchanged) but keeps all state in React memory:
 *   • NO localStorage reads/writes (never touches `tome-user-stats`)
 *   • NO Supabase, NO achievement engine, NO unlock overlay
 */
import { useCallback, useMemo, useState, type ReactNode } from "react"
import {
  type UserStats,
  type EconomyEvent,
  type EconomyResult,
  applyEvent,
  isDailyGoalMet,
  createDefaultStats,
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
  /** Seed the sandbox (e.g. a non-zero streak for a richer demo). */
  initialStats?: Partial<UserStats>
}) {
  const [stats, setStats] = useState<UserStats>(() => ({
    ...createDefaultStats(DEMO_USER_ID),
    ...initialStats,
  }))

  const dispatch = useCallback((event: EconomyEvent): EconomyResult => {
    let result: EconomyResult = { stats, notifications: [] }
    setStats((s) => {
      result = applyEvent(s, event)
      return result.stats
    })
    return result
  }, [stats])

  const dailyGoalMet = useMemo(() => isDailyGoalMet(stats), [stats])

  const value = useMemo<EconomyContextValue>(
    () => ({
      stats,
      dailyGoalMet,
      dispatch,
      syncStats: () => {},
    }),
    [stats, dailyGoalMet, dispatch]
  )

  return (
    <EconomyContext.Provider value={value}>{children}</EconomyContext.Provider>
  )
}
