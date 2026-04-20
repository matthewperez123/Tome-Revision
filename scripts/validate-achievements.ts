#!/usr/bin/env npx tsx
// ─────────────���───────────────────────────────
// Achievement Validation Script
// ─────────────────────────────────────────────
// Ensures catalog-achievement contract integrity.
// Run: pnpm validate:achievements

import { BOOKS } from '../src/data/books'
import { getAllAchievements } from '../src/data/achievements'
import type { Achievement, UnlockCondition } from '../src/types/achievement'

let errors = 0
let warnings = 0

function error(msg: string) {
  console.error(`  ERROR: ${msg}`)
  errors++
}

function warn(msg: string) {
  console.warn(`  WARN:  ${msg}`)
  warnings++
}

// ── Build book ID set ────────────────────────

const bookIds = new Set(BOOKS.map((b) => b.id))
// TODO: Filter to canonical books once the `canonical` flag is added
// const canonicalBookIds = new Set(BOOKS.filter(b => b.canonical).map(b => b.id))

console.log(`\nValidating achievements against ${bookIds.size} books...\n`)

const achievements = getAllAchievements()
console.log(`Total achievements: ${achievements.length}`)

// ── 1. Every bookId in conditions exists in catalog ──

console.log('\n[1] Checking bookId references...')

function extractBookIds(condition: UnlockCondition): string[] {
  switch (condition.type) {
    case 'complete-book':
      return [condition.bookId]
    case 'complete-all':
      return condition.bookIds
    case 'complete-count':
      return condition.from?.bookIds ?? []
    case 'composite':
      return condition.all.flatMap(extractBookIds)
    default:
      return []
  }
}

for (const a of achievements) {
  const refs = extractBookIds(a.unlockCondition)
  for (const ref of refs) {
    if (!bookIds.has(ref)) {
      error(`Achievement "${a.id}" references unknown bookId "${ref}"`)
    }
  }
}

// ── 2. Every canonical book has a single-book achievement ──

console.log('[2] Checking single-book coverage...')

const singleBookAchievements = achievements.filter(
  (a) => a.category === 'single-book',
)
const coveredBookIds = new Set(
  singleBookAchievements
    .map((a) => {
      if (a.unlockCondition.type === 'complete-book') {
        return a.unlockCondition.bookId
      }
      return null
    })
    .filter(Boolean) as string[],
)

// TODO: Check against canonical books once flag is added
// for (const id of canonicalBookIds) {
//   if (!coveredBookIds.has(id)) {
//     error(`Canonical book "${id}" has no single-book achievement`)
//   }
// }

console.log(`  Single-book achievements: ${singleBookAchievements.length}`)
console.log(`  Books covered: ${coveredBookIds.size}`)

// ── 3. No duplicate achievement IDs ──

console.log('[3] Checking for duplicate IDs...')

const idCounts = new Map<string, number>()
for (const a of achievements) {
  idCounts.set(a.id, (idCounts.get(a.id) || 0) + 1)
}
for (const [id, count] of idCounts) {
  if (count > 1) {
    error(`Duplicate achievement ID: "${id}" (appears ${count} times)`)
  }
}

// ── 4. Chain references resolve ──

console.log('[4] Checking chain references...')

const achievementIds = new Set(achievements.map((a) => a.id))
for (const a of achievements) {
  if (a.chain?.previous && !achievementIds.has(a.chain.previous)) {
    error(`Achievement "${a.id}" chain.previous "${a.chain.previous}" not found`)
  }
  if (a.chain?.next && !achievementIds.has(a.chain.next)) {
    error(`Achievement "${a.id}" chain.next "${a.chain.next}" not found`)
  }
}

// ── 5. Wisdom rewards within bounds ──

console.log('[5] Checking wisdom rewards...')

for (const a of achievements) {
  if (a.rarity === 'mythic') {
    if (a.wisdomReward > 100000) {
      warn(`Achievement "${a.id}" has very high reward: ${a.wisdomReward}`)
    }
  } else if (a.wisdomReward > 50000) {
    error(`Non-mythic achievement "${a.id}" has reward > 50000: ${a.wisdomReward}`)
  }
  if (a.wisdomReward < 0) {
    error(`Achievement "${a.id}" has negative reward: ${a.wisdomReward}`)
  }
}

// ── 6. No duplicate slugs ──

console.log('[6] Checking for duplicate slugs...')

const slugCounts = new Map<string, number>()
for (const a of achievements) {
  slugCounts.set(a.slug, (slugCounts.get(a.slug) || 0) + 1)
}
for (const [slug, count] of slugCounts) {
  if (count > 1) {
    error(`Duplicate achievement slug: "${slug}" (appears ${count} times)`)
  }
}

// ── 7. Flavor text length check ──

console.log('[7] Checking flavor text lengths...')

// Books published after 1928 need flavor text under 15 words for copyright safety
// We check all flavor texts for now; the canonical book year will be used once available
for (const a of achievements) {
  if (a.flavorText) {
    const wordCount = a.flavorText.split(/\s+/).length
    if (wordCount > 25) {
      warn(`Achievement "${a.id}" flavor text is ${wordCount} words (check copyright)`)
    }
  }
}

// ── Summary ──────────────────────────────────

console.log('\n' + '─'.repeat(50))

// Category breakdown
const byCat: Record<string, number> = {}
for (const a of achievements) {
  byCat[a.category] = (byCat[a.category] || 0) + 1
}
console.log('\nBy category:')
for (const [cat, count] of Object.entries(byCat).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${cat}: ${count}`)
}

// Rarity breakdown
const byRarity: Record<string, number> = {}
for (const a of achievements) {
  byRarity[a.rarity] = (byRarity[a.rarity] || 0) + 1
}
console.log('\nBy rarity:')
for (const [rarity, count] of Object.entries(byRarity).sort((a, b) => b[1] - a[1])) {
  console.log(`  ${rarity}: ${count}`)
}

console.log(`\nResult: ${errors} errors, ${warnings} warnings`)
if (errors > 0) {
  console.error('\nFAILED — fix errors before merging.')
  process.exit(1)
} else {
  console.log('\nPASSED')
  process.exit(0)
}
