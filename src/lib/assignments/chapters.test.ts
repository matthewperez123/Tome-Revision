import { test } from "node:test"
import assert from "node:assert/strict"
import {
  toReaderIndex,
  fromReaderIndex,
  isWithinRange,
  hasCompletedRange,
} from "./chapters"

// Real production row (project vjaezrcuuzmbmnsfrtwt, inspected 2026-09-18):
// assignments.id = 2866ee1d-6f46-4c37-a386-ac4d20f5a535
// "The Odyssey: Books I–III", book_id 'the-odyssey',
// chapter_range_start = 1, chapter_range_end = 3.
// the-odyssey reader index 0 = "Preface"; Books I–III = indexes 1–3.
const odysseyBooksItoIII = { chapter_range_start: 1, chapter_range_end: 3 }

test("identity mapping between range values and reader indexes", () => {
  assert.equal(toReaderIndex(0), 0)
  assert.equal(toReaderIndex(3), 3)
  assert.equal(fromReaderIndex(0), 0)
  assert.equal(fromReaderIndex(7), 7)
})

test("real row: Odyssey Books I–III spans reader indexes 1–3", () => {
  // Index 0 (Preface) is NOT part of the assignment.
  assert.equal(isWithinRange(0, odysseyBooksItoIII), false)
  assert.equal(isWithinRange(1, odysseyBooksItoIII), true) // Book I
  assert.equal(isWithinRange(2, odysseyBooksItoIII), true) // Book II
  assert.equal(isWithinRange(3, odysseyBooksItoIII), true) // Book III
  assert.equal(isWithinRange(4, odysseyBooksItoIII), false) // Book IV
})

test("real row: completion at chapter_range_end, matching grades.ts predicate", () => {
  assert.equal(hasCompletedRange(2, odysseyBooksItoIII), false)
  assert.equal(hasCompletedRange(3, odysseyBooksItoIII), true)
  assert.equal(hasCompletedRange(4, odysseyBooksItoIII), true)
})

test("null-range fallbacks mirror coalesce(end, start, 0)", () => {
  // null end → single-chapter assignment at start
  const single = { chapter_range_start: 2, chapter_range_end: null }
  assert.equal(isWithinRange(1, single), false)
  assert.equal(isWithinRange(2, single), true)
  assert.equal(isWithinRange(3, single), false)
  assert.equal(hasCompletedRange(2, single), true)

  // both null → only index 0
  const none = { chapter_range_start: null, chapter_range_end: null }
  assert.equal(isWithinRange(0, none), true)
  assert.equal(isWithinRange(1, none), false)
  assert.equal(hasCompletedRange(0, none), true)
})
