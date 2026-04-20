// ─────────────────────────────────────────────
// Tome Achievement Registry — Master Index
// ─────────────────────────────────────────────
// Aggregates all achievement categories into a single queryable
// registry with O(1) lookups by ID and slug.

import type { Achievement } from '@/types/achievement'
import { SINGLE_BOOK_ACHIEVEMENTS } from './single-book'
import { AUTHOR_COLLECTION_ACHIEVEMENTS } from './author-collections'
import { SERIES_COLLECTION_ACHIEVEMENTS } from './series-collections'
import { THEMATIC_COLLECTION_ACHIEVEMENTS } from './thematic-collections'
import { MILESTONE_ACHIEVEMENTS } from './milestones'
import { buildBookIdIndex } from '@/lib/achievements/engine'

// ── Lazy initialization ──────────────────────

let _allAchievements: Achievement[] | null = null
let _byId: Map<string, Achievement> | null = null
let _bySlug: Map<string, Achievement> | null = null
let _bookIdIndex: Map<string, Achievement[]> | null = null

function ensureInitialized() {
  if (_allAchievements) return

  _allAchievements = [
    ...SINGLE_BOOK_ACHIEVEMENTS,
    ...AUTHOR_COLLECTION_ACHIEVEMENTS,
    ...SERIES_COLLECTION_ACHIEVEMENTS,
    ...THEMATIC_COLLECTION_ACHIEVEMENTS,
    ...MILESTONE_ACHIEVEMENTS,
  ]

  _byId = new Map()
  _bySlug = new Map()

  for (const a of _allAchievements) {
    _byId.set(a.id, a)
    _bySlug.set(a.slug, a)
  }

  _bookIdIndex = buildBookIdIndex(_allAchievements)
}

// ── Public API ───────────────────────────────

/** Returns all achievements across all categories. */
export function getAllAchievements(): Achievement[] {
  ensureInitialized()
  return _allAchievements!
}

/** O(1) lookup by achievement ID. */
export function getAchievementById(id: string): Achievement | undefined {
  ensureInitialized()
  return _byId!.get(id)
}

/** O(1) lookup by URL slug. */
export function getAchievementBySlug(slug: string): Achievement | undefined {
  ensureInitialized()
  return _bySlug!.get(slug)
}

/** Returns the pre-built bookId → Achievement[] index for the engine. */
export function getBookIdIndex(): Map<string, Achievement[]> {
  ensureInitialized()
  return _bookIdIndex!
}

/** Returns achievement count by category. */
export function getAchievementCounts(): Record<string, number> {
  ensureInitialized()
  const counts: Record<string, number> = {}
  for (const a of _allAchievements!) {
    counts[a.category] = (counts[a.category] || 0) + 1
  }
  return counts
}
