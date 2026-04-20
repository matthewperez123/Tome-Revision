// ─────────────────────────────────────────────
// Tome Achievement Unlock Engine
// ─────────────────────────────────────────────
// Evaluates unlock conditions, manages persistence,
// and integrates with the economy system.

import type {
  Achievement,
  AchievementState,
  AchievementUnlock,
  UnlockCondition,
} from '@/types/achievement'
import type { UserStats } from '@/lib/economy'

// ── Persistence (localStorage) ───────────────

const STORAGE_KEY = 'tome-achievement-unlocks'

export function loadAchievementState(): AchievementState {
  if (typeof window === 'undefined') return { unlocks: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { unlocks: {} }
    return JSON.parse(raw) as AchievementState
  } catch {
    return { unlocks: {} }
  }
}

export function saveAchievementState(state: AchievementState): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function unlockAchievement(
  achievement: Achievement,
  state: AchievementState,
): AchievementState {
  if (state.unlocks[achievement.id]) return state // already unlocked

  const unlock: AchievementUnlock = {
    achievementId: achievement.id,
    unlockedAt: new Date().toISOString(),
    wisdomAwarded: achievement.wisdomReward,
  }

  return {
    ...state,
    unlocks: {
      ...state.unlocks,
      [achievement.id]: unlock,
    },
  }
}

// ── Condition evaluation ─────────────────────

export function isConditionMet(
  condition: UnlockCondition,
  completedBookIds: Set<string>,
  stats: UserStats,
): boolean {
  switch (condition.type) {
    case 'complete-book':
      return completedBookIds.has(condition.bookId)

    case 'complete-all':
      return condition.bookIds.every((id) => completedBookIds.has(id))

    case 'complete-count': {
      if (condition.from?.bookIds) {
        const completed = condition.from.bookIds.filter((id) =>
          completedBookIds.has(id),
        )
        return completed.length >= condition.count
      }
      return completedBookIds.size >= condition.count
    }

    case 'streak-days':
      return stats.current_streak >= condition.days

    case 'wisdom-threshold':
      return stats.xp_total >= condition.amount

    case 'composite':
      return condition.all.every((sub) =>
        isConditionMet(sub, completedBookIds, stats),
      )

    default:
      return false
  }
}

// ── Achievement evaluation ───────────────────

/**
 * Evaluates all achievements and returns the ones that are newly unlocked.
 * Idempotent — never returns an achievement that is already in the state.
 */
export function evaluateAchievements(
  allAchievements: Achievement[],
  completedBookIds: string[],
  stats: UserStats,
  currentState: AchievementState,
): Achievement[] {
  const completedSet = new Set(completedBookIds)
  const newlyUnlocked: Achievement[] = []

  for (const achievement of allAchievements) {
    // Skip if already unlocked
    if (currentState.unlocks[achievement.id]) continue

    // Evaluate condition
    if (isConditionMet(achievement.unlockCondition, completedSet, stats)) {
      newlyUnlocked.push(achievement)
    }
  }

  return newlyUnlocked
}

/**
 * Pre-filters achievements to a smaller candidate set relevant to a specific
 * trigger event, avoiding iteration over the full ~450 achievement list.
 */
export function getRelevantAchievements(
  allAchievements: Achievement[],
  bookIdToAchievements: Map<string, Achievement[]>,
  trigger:
    | { type: 'book-complete'; bookId: string }
    | { type: 'streak-change' }
    | { type: 'wisdom-change' },
): Achievement[] {
  switch (trigger.type) {
    case 'book-complete': {
      // The single-book achievement + any collection containing this book
      const directMatches = bookIdToAchievements.get(trigger.bookId) ?? []
      // Also check volume milestones
      const milestones = allAchievements.filter(
        (a) =>
          a.category === 'milestone' &&
          a.unlockCondition.type === 'complete-count',
      )
      return [...directMatches, ...milestones]
    }

    case 'streak-change':
      return allAchievements.filter(
        (a) => a.unlockCondition.type === 'streak-days',
      )

    case 'wisdom-change':
      return allAchievements.filter(
        (a) => a.unlockCondition.type === 'wisdom-threshold',
      )

    default:
      return []
  }
}

// ── Index builder ────────────────────────────

/**
 * Builds a Map from bookId → Achievement[] for O(1) lookup during evaluation.
 * Every bookId referenced in any unlock condition maps to all achievements
 * that depend on it.
 */
export function buildBookIdIndex(
  achievements: Achievement[],
): Map<string, Achievement[]> {
  const index = new Map<string, Achievement[]>()

  function indexCondition(condition: UnlockCondition, achievement: Achievement) {
    switch (condition.type) {
      case 'complete-book':
        pushToIndex(condition.bookId, achievement)
        break
      case 'complete-all':
        for (const bookId of condition.bookIds) {
          pushToIndex(bookId, achievement)
        }
        break
      case 'complete-count':
        if (condition.from?.bookIds) {
          for (const bookId of condition.from.bookIds) {
            pushToIndex(bookId, achievement)
          }
        }
        break
      case 'composite':
        for (const sub of condition.all) {
          indexCondition(sub, achievement)
        }
        break
    }
  }

  function pushToIndex(bookId: string, achievement: Achievement) {
    const existing = index.get(bookId)
    if (existing) {
      existing.push(achievement)
    } else {
      index.set(bookId, [achievement])
    }
  }

  for (const achievement of achievements) {
    indexCondition(achievement.unlockCondition, achievement)
  }

  return index
}
