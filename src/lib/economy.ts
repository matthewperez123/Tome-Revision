// ─────────────────────────────────────────────
// Tome Engagement Economy — Calculation Functions
// ─────────────────────────────────────────────

// ── Types ──────────────────────────────────────

export type UserStats = {
  user_id: string
  xp_total: number
  current_streak: number
  longest_streak: number
  hearts: number
  coins: number
  daily_goal_minutes: number
  daily_progress_minutes: number
  last_active_date: string // ISO date string (YYYY-MM-DD)
  streak_freeze_available: boolean
  hearts_last_regen: string // ISO timestamp
}

export type EconomyEvent =
  | { type: "quiz_correct"; xp?: number; coins?: number }
  | { type: "quiz_wrong" }
  | { type: "chapter_complete" }
  | { type: "book_complete" }
  | { type: "reading_minutes"; minutes: number }
  | { type: "buy_streak_freeze" }
  | { type: "use_streak_freeze" }
  | { type: "heart_refill_with_coins" }
  | { type: "achievement_unlock"; achievementId: string; wisdomReward: number }

export type EconomyResult = {
  stats: UserStats
  xpGained: number
  coinsGained: number
  notifications: string[]
}

// ── Constants ──────────────────────────────────

export const MAX_HEARTS = 5
export const HEART_REGEN_INTERVAL_MS = 60 * 60 * 1000 // 1 hour
export const STREAK_FREEZE_COST = 10
export const HEART_REFILL_COIN_COST = 15

export const XP_REWARDS = {
  quiz_correct: 10,
  chapter_complete: 5,
  book_complete: 25,
} as const

export const COIN_REWARDS = {
  quiz_correct: 1,
  chapter_complete: 5,
  book_complete: 10,
} as const

export const STREAK_MILESTONES = [7, 30, 100, 365] as const
export const STREAK_MILESTONE_XP = 50

// ── Heart Regeneration ─────────────────────────

export function calculateHearts(
  currentHearts: number,
  lastRegenTime: string
): { hearts: number; nextRegenAt: Date | null } {
  if (currentHearts >= MAX_HEARTS) {
    return { hearts: MAX_HEARTS, nextRegenAt: null }
  }

  const lastRegen = new Date(lastRegenTime).getTime()
  const now = Date.now()
  const elapsed = now - lastRegen
  const regened = Math.floor(elapsed / HEART_REGEN_INTERVAL_MS)

  const newHearts = Math.min(MAX_HEARTS, currentHearts + regened)

  const nextRegenAt =
    newHearts < MAX_HEARTS
      ? new Date(lastRegen + (regened + 1) * HEART_REGEN_INTERVAL_MS)
      : null

  return { hearts: newHearts, nextRegenAt }
}

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
          notifications.push(`Streak milestone: ${milestone} days! +${STREAK_MILESTONE_XP} Wisdom`)
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
  // Start with regenerated hearts
  const { hearts: regenHearts } = calculateHearts(stats.hearts, stats.hearts_last_regen)
  const s = { ...stats, hearts: regenHearts }

  let xpGained = 0
  let coinsGained = 0
  const notifications: string[] = []

  switch (event.type) {
    case "quiz_correct": {
      xpGained = event.xp ?? XP_REWARDS.quiz_correct
      coinsGained = event.coins ?? COIN_REWARDS.quiz_correct
      s.xp_total += xpGained
      s.coins += coinsGained
      break
    }

    case "heart_refill_with_coins": {
      if (s.coins >= HEART_REFILL_COIN_COST && s.hearts < MAX_HEARTS) {
        s.coins -= HEART_REFILL_COIN_COST
        s.hearts = MAX_HEARTS
        s.hearts_last_regen = new Date().toISOString()
        notifications.push(`Hearts refilled! -${HEART_REFILL_COIN_COST} coins`)
      } else if (s.hearts >= MAX_HEARTS) {
        notifications.push("Hearts already full.")
      } else {
        notifications.push(
          `Not enough coins. Need ${HEART_REFILL_COIN_COST}, have ${s.coins}.`
        )
      }
      break
    }

    case "quiz_wrong": {
      if (s.hearts > 0) {
        s.hearts -= 1
        if (s.hearts === 0) {
          notifications.push("Out of hearts! Wait for regeneration or earn more.")
        }
      }
      break
    }

    case "chapter_complete": {
      xpGained = XP_REWARDS.chapter_complete
      coinsGained = COIN_REWARDS.chapter_complete
      s.xp_total += xpGained
      s.coins += coinsGained
      notifications.push(`Chapter complete! +${xpGained} XP, +${coinsGained} coins`)
      break
    }

    case "book_complete": {
      xpGained = XP_REWARDS.book_complete
      coinsGained = COIN_REWARDS.book_complete
      s.xp_total += xpGained
      s.coins += coinsGained
      notifications.push(`Book finished! +${xpGained} XP, +${coinsGained} coins`)
      break
    }

    case "reading_minutes": {
      s.daily_progress_minutes += event.minutes
      break
    }

    case "buy_streak_freeze": {
      if (s.coins >= STREAK_FREEZE_COST) {
        s.coins -= STREAK_FREEZE_COST
        s.streak_freeze_available = true
        notifications.push("Streak freeze purchased!")
      } else {
        notifications.push(`Not enough coins. Need ${STREAK_FREEZE_COST}, have ${s.coins}.`)
      }
      break
    }

    case "use_streak_freeze": {
      if (s.streak_freeze_available) {
        s.streak_freeze_available = false
        notifications.push("Streak freeze used!")
      }
      break
    }

    case "achievement_unlock": {
      xpGained = event.wisdomReward
      s.xp_total += xpGained
      notifications.push(`Seal earned! +${xpGained} wisdom`)
      break
    }
  }

  // Update last active
  s.last_active_date = new Date().toISOString().slice(0, 10)

  // Update hearts_last_regen if hearts changed
  if (s.hearts !== regenHearts) {
    s.hearts_last_regen = new Date().toISOString()
  }

  return { stats: s, xpGained, coinsGained, notifications }
}

// ── Daily Goal Check ───────────────────────────

export function isDailyGoalMet(stats: UserStats): boolean {
  return stats.daily_progress_minutes >= stats.daily_goal_minutes
}

// ── Wisdom Ranks (the single, canonical progression ladder) ────
//
// Wisdom is the one primary progression currency — it is the value stored in
// `xp_total`. "XP" is NOT a separate currency; it is a legacy field name for the
// same number. Every surface (dashboard, profile, …) must derive a reader's rank
// from `getRank(stats.xp_total)` so the tier name, threshold, and progress all
// agree. Trial *difficulty* (Apprentice/Scholar/Master) and *Seals*
// (Initiate/Adept/Sage/…) are separate axes — do not conflate them with ranks.

export interface WisdomRank {
  /** 1-based position in the ladder (for "Rank N" / badge displays). */
  level: number
  name: string
  minWisdom: number
}

export const WISDOM_RANKS: WisdomRank[] = [
  { level: 1, name: "Novice", minWisdom: 0 },
  { level: 2, name: "Reader", minWisdom: 300 },
  { level: 3, name: "Scholar", minWisdom: 700 },
  { level: 4, name: "Sage", minWisdom: 1500 },
  { level: 5, name: "Luminary", minWisdom: 3000 },
  { level: 6, name: "Laureate", minWisdom: 6000 },
]

export interface RankProgress {
  /** Current rank. */
  rank: WisdomRank
  /** Next rank, or null when at the top of the ladder. */
  next: WisdomRank | null
  /** Wisdom earned past the current rank's floor. */
  wisdomIntoRank: number
  /** Wisdom span from current floor to the next rank's floor. */
  wisdomForNext: number
  /** Wisdom remaining until the next rank (0 when maxed). */
  wisdomToNext: number
  /** Progress to the next rank, 0–100 (100 when maxed). */
  pct: number
}

export function getRank(wisdom: number): RankProgress {
  let index = 0
  for (let i = 0; i < WISDOM_RANKS.length; i++) {
    if (wisdom >= WISDOM_RANKS[i].minWisdom) index = i
    else break
  }

  const rank = WISDOM_RANKS[index]
  const next = WISDOM_RANKS[index + 1] ?? null
  const wisdomIntoRank = wisdom - rank.minWisdom
  const wisdomForNext = next ? next.minWisdom - rank.minWisdom : 0
  const wisdomToNext = next ? next.minWisdom - wisdom : 0
  const pct = next ? Math.min(100, Math.round((wisdomIntoRank / wisdomForNext) * 100)) : 100

  return { rank, next, wisdomIntoRank, wisdomForNext, wisdomToNext, pct }
}

// ── Stats persistence helpers ──────────────────
// Mirrors the keys used by EconomyProvider so surfaces outside the provider
// (e.g. the standalone onboarding flow) can seed stats before navigation.
export const STATS_STORAGE_KEY = "tome-user-stats"
const GUEST_USER_ID = "00000000-0000-0000-0000-000000000000"

/**
 * Persist the daily reading goal directly to the economy stats blob. Used by
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
    xp_total: 0,
    current_streak: 0,
    longest_streak: 0,
    hearts: MAX_HEARTS,
    coins: 0,
    daily_goal_minutes: 20,
    daily_progress_minutes: 0,
    last_active_date: new Date().toISOString().slice(0, 10),
    streak_freeze_available: false,
    hearts_last_regen: new Date().toISOString(),
  }
}
