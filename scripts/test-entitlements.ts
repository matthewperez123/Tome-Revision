/**
 * Entitlement gate — quick test. Run with: npx tsx scripts/test-entitlements.ts
 *
 * Exercises the pure decision shared by the client and server gates
 * (`canReadBook`) plus the explicit free sampler. The server helper
 * `getEntitlement()` is DB-backed and verified separately against Supabase.
 */
import assert from "node:assert/strict"
import { canReadBook } from "@/lib/stripe/entitlements"
import { isFreeSample, FREE_SAMPLE_BOOK_IDS } from "@/lib/stripe/free-books"

// A book NOT in the free foundational set (a "paid" book) and one that is.
const PAID_BOOK = "the-brothers-karamazov"
const FREE_BOOK = "hamlet"

let passed = 0
function check(label: string, actual: unknown, expected: unknown) {
  assert.deepEqual(actual, expected, `${label}: expected ${expected}, got ${actual}`)
  passed++
  console.log(`  ✓ ${label}`)
}

console.log("Free sampler is explicit (not a magic number):")
check("foundational set has 20 books", FREE_SAMPLE_BOOK_IDS.length, 20)
check("hamlet is free", isFreeSample(FREE_BOOK), true)
check("the-brothers-karamazov is paid", isFreeSample(PAID_BOOK), false)

console.log("\ncanReadBook decision:")
check("Free reader BLOCKED from a paid book", canReadBook("free", "reader", PAID_BOOK), false)
check("Free reader ALLOWED a foundational book", canReadBook("free", "reader", FREE_BOOK), true)
check("active Solo reader ALLOWED any book", canReadBook("solo", "reader", PAID_BOOK), true)
check("Family ALLOWED full library", canReadBook("family", "reader", PAID_BOOK), true)
check("School ALLOWED full library", canReadBook("school", "reader", PAID_BOOK), true)
check("teacher ALLOWED regardless of tier", canReadBook("free", "teacher", PAID_BOOK), true)
check("student ALLOWED regardless of tier", canReadBook("free", "student", PAID_BOOK), true)

console.log(`\n${passed} checks passed.`)
