/**
 * Journey seed validator — run with:
 *   ./node_modules/.bin/tsx content/journeys/validate-macbeth-14.ts
 *
 * Validates content/journeys/macbeth-14.json against the JourneyTemplate
 * zod schema (which embeds the committed TrialItemSchema from
 * src/lib/trials/types), then independently re-parses every Trial item
 * through the trials zod union and cross-checks that every item anchor
 * references an excerpt line anchor that actually exists in its day.
 *
 * Prints a day-map summary and item counts per family. Exits non-zero on
 * any failure.
 */
import { readFileSync } from "node:fs"
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

import { safeParseJourneyTemplate } from "../../src/lib/journeys/types"
import { safeParseTrialItem, TRIAL_FAMILIES, type TrialFamily } from "../../src/lib/trials/types"

const here = dirname(fileURLToPath(import.meta.url))
const seedPath = join(here, "macbeth-14.json")

let failures = 0
const fail = (msg: string) => {
  failures += 1
  console.error(`  ✗ ${msg}`)
}

const raw: unknown = JSON.parse(readFileSync(seedPath, "utf8"))
const template = safeParseJourneyTemplate(raw)
if (!template) {
  console.error("JourneyTemplateSchema.parse failed; see zod issues above")
  process.exit(1)
}

console.log(`Journey: ${template.title} (${template.id})`)
console.log(`Days: ${template.days.length} · Book: ${template.bookSlug}`)
console.log("")

const familyCounts = new Map<TrialFamily, number>(TRIAL_FAMILIES.map((f) => [f, 0]))
let totalItems = 0
let totalWisdom = 0

for (const day of template.days) {
  const anchors = new Set(day.readingTarget.excerpt.map((l) => l.anchor))
  if (day.trial.length < 3 || day.trial.length > 5) {
    fail(`day ${day.day}: trial has ${day.trial.length} items (need 3–5)`)
  }
  for (const item of day.trial) {
    totalItems += 1
    totalWisdom += item.wisdom
    // Independent re-parse through the committed trials zod union.
    const parsed = safeParseTrialItem(item)
    if (!parsed) {
      fail(`day ${day.day} item ${item.id}: TrialItemSchema.safeParse failed`)
      continue
    }
    familyCounts.set(parsed.family, (familyCounts.get(parsed.family) ?? 0) + 1)
    // Cross-check anchors against the day's excerpt.
    for (const anchor of item.anchors) {
      if (!anchors.has(anchor.paragraphId)) {
        fail(`day ${day.day} item ${item.id}: anchor "${anchor.paragraphId}" not in excerpt`)
      }
    }
    if (item.evidenceAnchor && !anchors.has(item.evidenceAnchor.paragraphId)) {
      fail(`day ${day.day} item ${item.id}: evidenceAnchor "${item.evidenceAnchor.paragraphId}" not in excerpt`)
    }
  }
  const seal = day.milestoneSeal ? ` · SEAL: ${day.milestoneSeal.name}` : ""
  const minutes = day.readingTarget.estimatedMinutes
  console.log(
    `Day ${String(day.day).padStart(2)} — ${day.title} (${day.trial.length} items, +${day.wisdomAward} bonus, ~${minutes} min read)${seal}`,
  )
}

console.log("")
console.log(`Final reward: ${template.finalReward.sealName} + Stoa “${template.finalReward.stoaRewardId}”`)
console.log("")
console.log("Items per family (used):")
for (const [family, count] of familyCounts) {
  if (count > 0) console.log(`  ${family}: ${count}`)
}
console.log("")
console.log(`Total items: ${totalItems} · Per-item Wisdom pool: ${totalWisdom} · Completion bonuses: ${template.days.reduce((s, d) => s + d.wisdomAward, 0)}`)

if (failures > 0) {
  console.error(`\n${failures} validation failure(s)`)
  process.exit(1)
}
console.log("\nAll checks passed.")
