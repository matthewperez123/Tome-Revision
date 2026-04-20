// ─────────────────────────────────────────────
// Tome Achievement ("Seals") Type Definitions
// ─────────────────────────────────────────────

/** Stable category tags for achievements. */
export type AchievementCategory =
  | 'single-book'
  | 'author-complete'
  | 'series-complete'
  | 'tradition-complete'
  | 'form-mastery'
  | 'era-mastery'
  | 'milestone'
  | 'special'

/** Rarity tier — determines wax seal color and wisdom reward scale. */
export type AchievementRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic'

/**
 * Discriminated union describing what must be true to unlock an achievement.
 * The engine evaluates these recursively for composite conditions.
 */
export type UnlockCondition =
  | { type: 'complete-book'; bookId: string }
  | { type: 'complete-all'; bookIds: string[] }
  | { type: 'complete-count'; count: number; from?: { bookIds: string[] } }
  | { type: 'streak-days'; days: number }
  | { type: 'wisdom-threshold'; amount: number }
  | { type: 'composite'; all: UnlockCondition[] }

/** A single achievement definition. */
export interface Achievement {
  /** Kebab-case stable identifier, e.g. "odyssey-completed" */
  id: string
  /** URL-safe slug for the detail page, e.g. "the-long-way-home" */
  slug: string
  /** Display name — evocative, classical, never generic */
  name: string
  /** 1-2 sentence reader-facing description */
  description: string
  /** Optional italic quote or epigraph */
  flavorText?: string
  /** Key into the seal SVG/illustration registry */
  sealDesignKey: string
  /** Primary category bucket */
  category: AchievementCategory
  /** Rarity tier — drives seal color and reward scale */
  rarity: AchievementRarity
  /** Wisdom (XP) awarded on unlock */
  wisdomReward: number
  /** What must be true to earn this seal */
  unlockCondition: UnlockCondition
  /** Hidden until unlocked — shows as silhouette with "???" */
  hidden?: boolean
  /** Optional chain linkage for tiered series */
  chain?: {
    /** ID of the previous tier achievement */
    previous?: string
    /** ID of the next tier achievement */
    next?: string
  }
}

/** A record of an achievement that a user has unlocked. */
export interface AchievementUnlock {
  achievementId: string
  unlockedAt: string // ISO timestamp
  wisdomAwarded: number
}

/** Persisted achievement state for a user. */
export interface AchievementState {
  unlocks: Record<string, AchievementUnlock>
}

// ── Rarity metadata ────────────────────────────

/** Wax seal colors keyed by rarity. */
export const RARITY_WAX_COLORS: Record<AchievementRarity, string> = {
  common:    '#8B6F47',
  uncommon:  '#A86B3D',
  rare:      '#7C1F2E',
  epic:      '#2A1F5C',
  legendary: '#C9A961',
  mythic:    '#C9A961', // animated shimmer applied via CSS
}

/** Gold leaf accent for epic+ seals. */
export const RARITY_GOLD_LEAF = '#C9A961'

/** Default wisdom rewards by rarity. */
export const RARITY_WISDOM: Record<AchievementRarity, number> = {
  common:    100,
  uncommon:  200,
  rare:      400,
  epic:      800,
  legendary: 1500,
  mythic:    50000,
}

/** Human-friendly rarity labels. */
export const RARITY_LABELS: Record<AchievementRarity, string> = {
  common:    'Common',
  uncommon:  'Uncommon',
  rare:      'Rare',
  epic:      'Epic',
  legendary: 'Legendary',
  mythic:    'Mythic',
}
