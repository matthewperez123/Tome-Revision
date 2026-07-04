// ─────────────────────────────────────────────
// Tome Reading Stats — streak, daily goal, reading time.
// ─────────────────────────────────────────────

// ── Types ──────────────────────────────────────

export type UserStats = {
  user_id: string
  current_streak: number
  longest_streak: number
  daily_goal_minutes: number
  daily_progress_minutes: number
  last_active_date: string // ISO date string (YYYY-MM-DD)
  streak_freeze_available: boolean
}

export type EconomyEvent =
  | { type: "reading_minutes"; minutes: number }
  | { type: "use_streak_freeze" }

export type EconomyResult = {
  stats: UserStats
  notifications: string[]
}

// ── Constants ──────────────────────────────────

export const STREAK_MILESTONES = [7, 30, 100, 365] as const

// ── Streak Calculation ─────────────────────────

export function calculateStreak(
  currentStreak: number,
  longestStreak: number,
  lastActiveDate: string,
  dailyGoalMet: boolean,
  hasFreezeAvailable: boolean
): {
  streak: number
  longestStreak: number
  freezeUsed: boolean
  notifications: string[]
} {
  const today = new Date().toISOString().slice(0, 10)
  const last = lastActiveDate
  const notifications: string[] = []

  // Same day — no streak change
  if (last === today) {
    return { streak: currentStreak, longestStreak, freezeUsed: false, notifications }
  }

  // Calculate days missed
  const lastDate = new Date(last + "T00:00:00Z")
  const todayDate = new Date(today + "T00:00:00Z")
  const daysDiff = Math.floor(
    (todayDate.getTime() - lastDate.getTime()) / (24 * 60 * 60 * 1000)
  )

  // Yesterday — streak continues if goal was met
  if (daysDiff === 1) {
    if (dailyGoalMet) {
      const newStreak = currentStreak + 1
      const newLongest = Math.max(longestStreak, newStreak)

      // Check milestones
      for (const milestone of STREAK_MILESTONES) {
        if (newStreak === milestone) {
          notifications.push(`Streak milestone: ${milestone} days!`)
        }
      }

      return { streak: newStreak, longestStreak: newLongest, freezeUsed: false, notifications }
    }
    // Goal not met but still active — streak resets
    return { streak: 0, longestStreak, freezeUsed: false, notifications }
  }

  // Missed days
  if (daysDiff === 2 && hasFreezeAvailable) {
    // Freeze saves the streak for 1 missed day
    notifications.push("Streak freeze activated! Your streak is safe.")
    return { streak: currentStreak, longestStreak, freezeUsed: true, notifications }
  }

  // Streak broken
  if (currentStreak > 0) {
    notifications.push(`Streak reset. Previous: ${currentStreak} days.`)
  }
  return { streak: 0, longestStreak, freezeUsed: false, notifications }
}

// ── Apply Economy Event ────────────────────────

export function applyEvent(
  stats: UserStats,
  event: EconomyEvent
): EconomyResult {
  const s = { ...stats }
  const notifications: string[] = []

  switch (event.type) {
    case "reading_minutes": {
      s.daily_progress_minutes += event.minutes
      break
    }

    case "use_streak_freeze": {
      if (s.streak_freeze_available) {
        s.streak_freeze_available = false
        notifications.push("Streak freeze used!")
      }
      break
    }
  }

  // Update last active
  s.last_active_date = new Date().toISOString().slice(0, 10)

  return { stats: s, notifications }
}

// ── Daily Goal Check ───────────────────────────

export function isDailyGoalMet(stats: UserStats): boolean {
  return stats.daily_progress_minutes >= stats.daily_goal_minutes
}

// ── Stats persistence helpers ──────────────────
// Mirrors the keys used by EconomyProvider so surfaces outside the provider
// (e.g. the standalone onboarding flow) can seed stats before navigation.
export const STATS_STORAGE_KEY = "tome-user-stats"
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

/**
 * Persist the daily reading goal directly to the reading-stats blob. Used by
 * the onboarding goal step, which runs in the (standalone) route group with no
 * EconomyProvider, so it patches localStorage that the dashboard reads on mount.
 */
export function setStoredDailyGoal(minutes: number): void {
  if (typeof window === "undefined") return
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY)
    const stats: UserStats = raw ? JSON.parse(raw) : createDefaultStats(GUEST_USER_ID)
    stats.daily_goal_minutes = minutes
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats))
  } catch {
    // localStorage unavailable — non-fatal; dashboard falls back to defaults.
  }
}

// ── Default Stats ──────────────────────────────

export function createDefaultStats(userId: string): UserStats {
  return {
    user_id: userId,
    current_streak: 0,
    longest_streak: 0,
    daily_goal_minutes: 20,
    daily_progress_minutes: 0,
    last_active_date: new Date().toISOString().slice(0, 10),
    streak_freeze_available: false,
  }
}
