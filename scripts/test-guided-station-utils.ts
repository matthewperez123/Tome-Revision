/**
 * Unit tests for guided-station-utils.ts
 * Run with: npx tsx scripts/test-guided-station-utils.ts
 */

import {
  computeStationProgress,
  isStationComplete,
  getNextStation,
  getStationByIndex,
  getTotalStationMinutes,
  parseStationProgress,
  parseSessionSettings,
  getDefaultSessionSettings,
} from "../src/lib/guided-station-utils"
import type { Station, StationProgress } from "../src/lib/guided-learning-types"

let passed = 0
let failed = 0

function assert(condition: boolean, name: string) {
  if (condition) {
    passed++
    console.log(`  ✓ ${name}`)
  } else {
    failed++
    console.error(`  ✗ ${name}`)
  }
}

function makeStation(overrides: Partial<Station> = {}): Station {
  return {
    id: "test-station",
    session_id: "test-session",
    station_index: 0,
    type: "reading",
    title: null,
    book_id: null,
    chapter_start: null,
    chapter_end: null,
    section_range: null,
    quiz_id: null,
    quiz_config: null,
    reflection_prompt: null,
    min_words: null,
    target_minutes: 10,
    require_completion: false,
    settings: {},
    ...overrides,
  }
}

// ── computeStationProgress ──────────────────────────────────────────────────

console.log("\ncomputeStationProgress:")

assert(
  computeStationProgress(makeStation({ type: "reading" }), { chaptersRead: 3, totalChapters: 5 }) === 60,
  "reading: 3/5 = 60%",
)

assert(
  computeStationProgress(makeStation({ type: "reading" }), { chaptersRead: 5, totalChapters: 5 }) === 100,
  "reading: 5/5 = 100%",
)

assert(
  computeStationProgress(makeStation({ type: "quiz" }), { questionsAnswered: 7, totalQuestions: 10 }) === 70,
  "quiz: 7/10 = 70%",
)

assert(
  computeStationProgress(makeStation({ type: "reflection", min_words: 100 }), { wordCount: 50 }) === 50,
  "reflection: 50/100 = 50%",
)

assert(
  computeStationProgress(makeStation({ type: "reflection", min_words: 100 }), { wordCount: 150 }) === 100,
  "reflection: 150/100 = capped at 100%",
)

// ── isStationComplete ───────────────────────────────────────────────────────

console.log("\nisStationComplete:")

const progress100: StationProgress = { station_index: 0, progress_pct: 100, score: null, started_at: null, completed_at: "2026-01-01" }
const progress50: StationProgress = { station_index: 0, progress_pct: 50, score: null, started_at: null, completed_at: null }
const progress50WithComplete: StationProgress = { station_index: 0, progress_pct: 50, score: null, started_at: null, completed_at: "2026-01-01" }

assert(
  isStationComplete(makeStation({ require_completion: true }), progress100) === true,
  "required + 100% = complete",
)

assert(
  isStationComplete(makeStation({ require_completion: true }), progress50) === false,
  "required + 50% = not complete",
)

assert(
  isStationComplete(makeStation({ require_completion: false }), progress50WithComplete) === true,
  "not required + completed_at set = complete",
)

assert(
  isStationComplete(makeStation({ require_completion: false }), progress50) === false,
  "not required + no completed_at = not complete",
)

// ── getNextStation ──────────────────────────────────────────────────────────

console.log("\ngetNextStation:")

const stations = [
  makeStation({ station_index: 0, id: "s0" }),
  makeStation({ station_index: 1, id: "s1" }),
  makeStation({ station_index: 2, id: "s2" }),
]

assert(getNextStation(stations, 0)?.id === "s1", "next after 0 is s1")
assert(getNextStation(stations, 1)?.id === "s2", "next after 1 is s2")
assert(getNextStation(stations, 2) === null, "next after 2 is null (end)")

// ── getStationByIndex ───────────────────────────────────────────────────────

console.log("\ngetStationByIndex:")

assert(getStationByIndex(stations, 0)?.id === "s0", "index 0 = s0")
assert(getStationByIndex(stations, 5) === null, "index 5 = null")

// ── getTotalStationMinutes ──────────────────────────────────────────────────

console.log("\ngetTotalStationMinutes:")

const timedStations = [
  makeStation({ target_minutes: 10 }),
  makeStation({ target_minutes: 15 }),
  makeStation({ target_minutes: 5 }),
]

assert(getTotalStationMinutes(timedStations) === 30, "10+15+5 = 30")

// ── parseStationProgress ────────────────────────────────────────────────────

console.log("\nparseStationProgress:")

assert(Object.keys(parseStationProgress(null)).length === 0, "null returns empty")
assert(Object.keys(parseStationProgress(undefined)).length === 0, "undefined returns empty")
assert(Object.keys(parseStationProgress("bad")).length === 0, "string returns empty")

const rawProgress = { 0: { station_index: 0, progress_pct: 75, score: null, started_at: null, completed_at: null } }
const parsed = parseStationProgress(rawProgress)
assert(parsed[0]?.progress_pct === 75, "valid object parses correctly")

// ── parseSessionSettings ────────────────────────────────────────────────────

console.log("\nparseSessionSettings:")

const defaults = getDefaultSessionSettings()
assert(defaults.allowEarlyExit === true, "default allowEarlyExit = true")
assert(defaults.lockNavigation === true, "default lockNavigation = true")
assert(defaults.hintBudgetPerStudent === null, "default hintBudget = null")

const custom = parseSessionSettings({ hintBudgetPerStudent: 5, allowEarlyExit: false })
assert(custom.hintBudgetPerStudent === 5, "custom hintBudget = 5")
assert(custom.allowEarlyExit === false, "custom allowEarlyExit = false")
assert(custom.lockNavigation === true, "missing fields get defaults")

// ── Summary ─────────────────────────────────────────────────────────────────

console.log(`\n${"═".repeat(50)}`)
console.log(`Results: ${passed} passed, ${failed} failed`)
if (failed > 0) process.exit(1)
