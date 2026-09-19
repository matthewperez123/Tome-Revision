/**
 * [2.2] Guard: no hardcoded dollar figures in marketing or billing code.
 *
 * Every price shown anywhere in the app must derive from
 * `src/lib/billing/config.ts` (the single source of truth). This test greps
 * the marketing/billing surface for `$<number>` literals and fails on any
 * hit outside config.ts. `$${EXPR}` template interpolation is fine — the
 * regex only matches a digit directly after the dollar sign.
 *
 * Run: npm run test:billing:dollars
 */
import { readdirSync, readFileSync, statSync } from "node:fs"
import path from "node:path"

const ROOT = path.resolve(__dirname, "..", "..")

/** Marketing + billing surfaces where a stray dollar literal is a bug. */
const SCAN_TARGETS = [
  "src/lib/billing",
  "src/lib/marketing",
  "src/lib/stripe",
  "src/lib/email",
  "src/lib/faqs.ts",
  "src/components/pricing",
  "src/components/landing",
  "src/app/(app)/pricing",
  "src/app/(app)/homeschool",
  "src/app/(app)/schools",
  "src/app/api/stripe",
  "src/app/api/billing",
]

/** The one place dollar numbers are allowed to live. */
const ALLOWED = new Set(["src/lib/billing/config.ts"])

const EXTENSIONS = new Set([".ts", ".tsx"])
const DOLLAR = /\$\d+(\.\d+)?/

/**
 * Strip comments (dollar figures in docs are documentation, not display
 * copy) and single-digit regex backreferences like "$1".
 */
function stripFalsePositives(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "") // block comments
    .replace(/(^|\s)\/\/.*$/gm, "$1") // line comments
    .replace(/(["'`])\$\d\1/g, "") // "$1"-style regex backrefs
}

function* walk(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry)
    if (statSync(full).isDirectory()) yield* walk(full)
    else if (EXTENSIONS.has(path.extname(full))) yield full
  }
}

const violations: string[] = []

for (const target of SCAN_TARGETS) {
  const abs = path.join(ROOT, target)
  let files: string[]
  try {
    files = statSync(abs).isDirectory() ? [...walk(abs)] : [abs]
  } catch {
    continue // surface doesn't exist (yet) — nothing to scan
  }
  for (const file of files) {
    const rel = path.relative(ROOT, file)
    if (ALLOWED.has(rel)) continue
    const lines = stripFalsePositives(readFileSync(file, "utf8")).split("\n")
    lines.forEach((line, i) => {
      const match = line.match(DOLLAR)
      if (match) violations.push(`${rel}:${i + 1} — "${match[0]}" in: ${line.trim().slice(0, 120)}`)
    })
  }
}

if (violations.length > 0) {
  console.error(
    `FAIL: ${violations.length} hardcoded dollar figure(s) outside src/lib/billing/config.ts:\n`,
  )
  for (const v of violations) console.error(`  ${v}`)
  console.error(
    "\nAll prices must derive from src/lib/billing/config.ts (via ./tiers for display).",
  )
  process.exit(1)
}

console.log("no-hardcoded-dollars: PASS (marketing/billing surface is clean)")
