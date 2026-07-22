#!/usr/bin/env tsx

// Deterministic tests for the game economy (src/lib/game/economy.ts).
// Run: ./node_modules/.bin/tsx src/lib/game/economy.test.ts

import assert from "node:assert/strict"
import {
  ACTION_RATE_CAPS,
  FLAME_MAX_FREEZES,
  WISDOM_AWARDS,
  WISDOM_DAILY_TOTAL_CAP,
  advanceFlame,
  awardWisdom,
  checkRateCap,
  countWithinWindow,
  crossesLevel,
  dayDiff,
  initialFlame,
  levelForWisdom,
  levelProgress,
  sealProgressFraction,
  sealUnlocked,
  stoaTileIdForSeal,
  wisdomForLevel,
} from "./economy"

const HOUR_MS = 3_600_000
const DAY_MS = 86_400_000
const NOW = Date.UTC(2026, 6, 22, 12, 0, 0)

function run() {
  testWisdomAwards()
  testRateCaps()
  testLevelCurve()
  testFlame()
  testSeals()
  console.log("economy tests passed")
}

function testWisdomAwards() {
  // Proving dominates clicking.
  assert.ok(WISDOM_AWARDS["trial-complete"] > WISDOM_AWARDS["read-chapter"])
  assert.ok(WISDOM_AWARDS["read-chapter"] > WISDOM_AWARDS["read-page"])
  // Every action pays something; nothing is negative or purchasable-shaped.
  for (const amount of Object.values(WISDOM_AWARDS)) {
    assert.ok(amount > 0, "all awards are positive")
  }

  const grant = awardWisdom("trial-complete", { payoutTimestamps: [], todayTotal: 0 }, NOW)
  assert.equal(grant.granted, 50)
  assert.equal(grant.capped, false)
  assert.equal(grant.reason, "ok")
}

function testRateCaps() {
  const cap = ACTION_RATE_CAPS["journal-entry"]
  const stamps = Array.from({ length: cap.perHour }, (_, i) => NOW - i * 60_000)
  assert.equal(checkRateCap("journal-entry", stamps, NOW), false, "hourly cap blocks")
  assert.equal(checkRateCap("journal-entry", [], NOW), true, "empty history allows")

  // Rolling window: old stamps fall out of the hour.
  const old = Array.from({ length: cap.perHour }, (_, i) => NOW - HOUR_MS - i * 1000)
  assert.equal(checkRateCap("journal-entry", old, NOW), true, "expired window reopens")

  // Per-day cap binds when hourly stamps are spread out.
  const dayCap = ACTION_RATE_CAPS["journal-entry"].perDay
  const spread = Array.from({ length: dayCap }, (_, i) => NOW - i * (HOUR_MS * 2))
  assert.equal(checkRateCap("journal-entry", spread, NOW), false, "daily cap blocks")

  assert.equal(countWithinWindow([NOW, NOW - HOUR_MS + 1, NOW - DAY_MS], NOW, HOUR_MS), 2)

  // Action cap → zero grant, not an error.
  const capped = awardWisdom("journal-entry", { payoutTimestamps: stamps, todayTotal: 0 }, NOW)
  assert.equal(capped.granted, 0)
  assert.equal(capped.reason, "action-cap")

  // Daily total cap truncates the grant.
  const nearCap = awardWisdom(
    "trial-complete",
    { payoutTimestamps: [], todayTotal: WISDOM_DAILY_TOTAL_CAP - 10 },
    NOW,
  )
  assert.equal(nearCap.granted, 10)
  assert.equal(nearCap.capped, true)

  const exhausted = awardWisdom(
    "trial-complete",
    { payoutTimestamps: [], todayTotal: WISDOM_DAILY_TOTAL_CAP },
    NOW,
  )
  assert.equal(exhausted.granted, 0)
  assert.equal(exhausted.reason, "daily-total-cap")

  assert.ok(WISDOM_DAILY_TOTAL_CAP > 0)
  assert.ok(DAY_MS > 0) // guard against accidental constant edits
}

function testLevelCurve() {
  assert.equal(wisdomForLevel(1), 0, "level 1 is free")
  // Strictly increasing.
  for (let n = 1; n < 60; n += 1) {
    assert.ok(wisdomForLevel(n + 1) > wisdomForLevel(n), `curve increases at level ${n}`)
  }
  // Rounded to 25s.
  for (let n = 2; n <= 40; n += 1) {
    assert.equal(wisdomForLevel(n) % 25, 0, `level ${n} rounded to 25`)
  }
  // Round-trip: a total exactly at a level's threshold reaches that level.
  for (const n of [2, 3, 5, 10, 25]) {
    assert.equal(levelForWisdom(wisdomForLevel(n)), n, `threshold reaches level ${n}`)
    assert.equal(levelForWisdom(wisdomForLevel(n) - 1), n - 1, `one below stays at ${n - 1}`)
  }
  assert.equal(levelForWisdom(0), 1)
  assert.equal(levelForWisdom(-50), 1, "negative totals clamp to level 1")

  const progress = levelProgress(wisdomForLevel(4) + 25)
  assert.equal(progress.level, 4)
  assert.equal(progress.intoLevel, 25)
  assert.ok(progress.fraction > 0 && progress.fraction < 1)
  assert.ok(progress.toNext > 0)

  assert.equal(crossesLevel(wisdomForLevel(3) - 5, 5), true)
  assert.equal(crossesLevel(wisdomForLevel(3) - 10, 5), false)
  assert.equal(crossesLevel(0, 0), false)
}

function testFlame() {
  // First activity ever.
  let flame = advanceFlame(initialFlame(), { today: "2026-07-20", activeToday: true })
  assert.equal(flame.state, "secured")
  assert.equal(flame.days, 1)
  assert.equal(flame.event, "secured")

  // Consecutive day continues the chain.
  flame = advanceFlame(flame, { today: "2026-07-21", activeToday: true })
  assert.equal(flame.days, 2)
  assert.equal(flame.event, "secured")

  // Next day, no activity yet → gentle at-risk (never shame).
  const atRisk = advanceFlame(flame, { today: "2026-07-22", activeToday: false })
  assert.equal(atRisk.state, "at-risk")
  assert.equal(atRisk.days, 2, "count preserved")
  assert.equal(atRisk.event, "at-risk")
  assert.equal(atRisk.freezesUsed, 0)

  // Same-day secure completes the day.
  const secured = advanceFlame(atRisk, { today: "2026-07-22", activeToday: true })
  assert.equal(secured.state, "secured")
  assert.equal(secured.days, 3)
  assert.equal(secured.event, "secured")

  // Idempotence: same inputs, no double-count.
  const again = advanceFlame(secured, { today: "2026-07-22", activeToday: true })
  assert.equal(again.days, 3)
  assert.equal(again.event, "unchanged")

  // Grace: one fully missed day auto-consumes a pre-granted freeze,
  // streak intact, no user action required.
  const grace = advanceFlame(secured, { today: "2026-07-24", activeToday: true })
  assert.equal(grace.event, "freeze-applied")
  assert.equal(grace.freezesUsed, 1)
  assert.equal(grace.days, 4, "streak survives the gap")
  assert.equal(grace.freezesAvailable, FLAME_MAX_FREEZES - 1)

  // Freezes exhausted: two missed days with only one freeze left.
  const out = advanceFlame(grace, { today: "2026-07-27", activeToday: false })
  assert.equal(out.state, "unlit")
  assert.equal(out.days, 0, "extinguishment resets the count")
  assert.equal(out.event, "extinguished")

  // Earn-back path: returning after extinguishment rekindles warmly.
  const rekindled = advanceFlame(out, { today: "2026-07-28", activeToday: true })
  assert.equal(rekindled.state, "secured")
  assert.equal(rekindled.days, 1)
  assert.equal(rekindled.event, "rekindled")
  assert.equal(
    rekindled.freezesAvailable,
    FLAME_MAX_FREEZES,
    "freezes are re-granted on rekindle — grace is structural, not earned",
  )

  // Freeze with no activity yet today: hearth held, still at-risk.
  const held = advanceFlame(secured, { today: "2026-07-24", activeToday: false })
  assert.equal(held.state, "at-risk")
  assert.equal(held.days, 3, "freeze preserves the count")
  assert.equal(held.freezesUsed, 1)

  // Freeze never applies twice for the same day.
  const heldAgain = advanceFlame(held, { today: "2026-07-24", activeToday: false })
  assert.equal(heldAgain.event, "unchanged")

  // Clock skew is swallowed, never punished.
  const skew = advanceFlame(secured, { today: "2026-07-21", activeToday: false })
  assert.equal(skew.event, "unchanged")

  assert.equal(dayDiff("2026-07-01", "2026-07-03"), 2)
  assert.equal(dayDiff("2026-07-03", "2026-07-01"), -2)
}

function testSeals() {
  const req = { chaptersRequired: 8, trialsRequired: 4 }
  assert.equal(sealUnlocked(req, { chaptersCompleted: 8, trialsPassed: 4 }), true)
  assert.equal(sealUnlocked(req, { chaptersCompleted: 8, trialsPassed: 3 }), false)
  assert.equal(sealUnlocked(req, { chaptersCompleted: 7, trialsPassed: 4 }), false)
  // Extra progress is fine; perfection is never part of the rule.
  assert.equal(sealUnlocked(req, { chaptersCompleted: 9, trialsPassed: 5 }), true)

  assert.equal(sealProgressFraction(req, { chaptersCompleted: 4, trialsPassed: 2 }), 0.5)
  assert.equal(sealProgressFraction(req, { chaptersCompleted: 0, trialsPassed: 0 }), 0)
  assert.equal(sealProgressFraction(req, { chaptersCompleted: 99, trialsPassed: 99 }), 1)
  assert.equal(sealProgressFraction({ chaptersRequired: 0, trialsRequired: 0 }, { chaptersCompleted: 0, trialsPassed: 0 }), 1)

  assert.equal(stoaTileIdForSeal("macbeth"), "stoa-tile-macbeth")
  assert.notEqual(stoaTileIdForSeal("macbeth"), stoaTileIdForSeal("odyssey"))
}

run()
