#!/usr/bin/env tsx
/**
 * map-se-slugs.ts — map the Tome catalogue to Standard Ebooks repos and write
 * se_slug + standard_ebooks_url.
 *
 * Ground-truth sources:
 *  - reports/se-repo-index.json  (live SE org repo list; run fetch-se-repos.ts first)
 *  - scripts/se-slug-overrides.json  (prior human-tuned bookId -> repo map, 1172 entries)
 *  - books table (id, title, author, author_id, se_slug, standard_ebooks_url)
 *
 * Resolution per book:
 *   1. derive `slug(author)_slug(title)` and match the index (exact, else the
 *      unique/fewest-segment translator variant `prefix_...`)
 *   2. fall back to the override map entry IF that repo exists in the index
 * The report records the source so mismatches are auditable.
 *
 * DEFAULT = dry run: writes reports/se-mapping.{md,json} and prints the
 * 50-book sanity gate (resolved must reproduce every stored se_slug). Pass
 * --write to UPDATE the DB (only after the gate passes / is reviewed).
 */
import { readFileSync, writeFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local)")
const db = createClient(URL, KEY, { auth: { persistSession: false } })

const WRITE = process.argv.includes("--write")

const slug = (s: string) =>
  (s || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/['’]/g, "") // apostrophes vanish (alice's -> alices), not a separator
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

const repoUrl = (repo: string) =>
  `https://standardebooks.org/ebooks/${repo.replace(/_/g, "/")}`

interface Book {
  id: string
  title: string
  author: string
  author_id: string | null
  se_slug: string | null
  standard_ebooks_url: string | null
}

async function loadBooks(): Promise<Book[]> {
  const out: Book[] = []
  let from = 0
  const n = 1000
  for (;;) {
    const { data, error } = await db
      .from("books")
      .select("id, title, author, author_id, se_slug, standard_ebooks_url")
      .order("id")
      .range(from, from + n - 1)
    if (error) throw error
    if (!data?.length) break
    out.push(...(data as Book[]))
    if (data.length < n) break
    from += n
  }
  return out
}

function main() {
  const index: string[] = JSON.parse(readFileSync("reports/se-repo-index.json", "utf8")).repos
  const repoSet = new Set(index)
  const overrides: Record<string, string> = JSON.parse(
    readFileSync("scripts/se-slug-overrides.json", "utf8"),
  )

  // Index repos by their translator-tolerant prefix `author_title`.
  const byPrefix = new Map<string, string[]>()
  for (const r of index) {
    const parts = r.split("_")
    if (parts.length < 2) continue
    const prefix = `${parts[0]}_${parts[1]}`
    if (!byPrefix.has(prefix)) byPrefix.set(prefix, [])
    byPrefix.get(prefix)!.push(r)
  }
  const fewestSeg = (arr: string[]) =>
    arr.slice().sort((a, b) => a.split("_").length - b.split("_").length)

  type Source = "derived" | "override" | "none"
  function resolve(b: Book): { repo: string | null; source: Source; ambiguous: boolean } {
    // 1. derive author_title and match the index (translator-tolerant)
    const prefix = `${slug(b.author)}_${slug(b.title)}`
    if (repoSet.has(prefix)) return { repo: prefix, source: "derived", ambiguous: false }
    const variants = byPrefix.get(prefix)
    if (variants?.length) {
      const sorted = fewestSeg(variants)
      const ambiguous = sorted.length > 1 && sorted[0].split("_").length === sorted[1].split("_").length
      return { repo: sorted[0], source: "derived", ambiguous }
    }
    // 2. fall back to prior human-tuned override, validated against the index
    const ov = overrides[b.id]
    if (ov && repoSet.has(ov)) return { repo: ov, source: "override", ambiguous: false }
    return { repo: null, source: "none", ambiguous: false }
  }

  return { index, repoSet, overrides, resolve }
}

async function run() {
  const { repoSet, resolve } = main()
  const books = await loadBooks()

  const resolved: Array<{ book: Book; repo: string | null; source: string; ambiguous: boolean }> = []
  for (const b of books) resolved.push({ book: b, ...resolve(b) })

  // --- 50-book sanity gate: resolved must reproduce every stored se_slug ---
  const stored = resolved.filter((r) => r.book.se_slug)
  const disagreements = stored.filter((r) => r.repo !== r.book.se_slug)
  const gatePass = disagreements.length === 0

  // --- validity: every resolved repo must exist in the live index ---
  const invalid = resolved.filter((r) => r.repo && !repoSet.has(r.repo))

  const matched = resolved.filter((r) => r.repo)
  const unmatched = resolved.filter((r) => !r.repo)
  const ambiguous = resolved.filter((r) => r.ambiguous)
  const newWrites = resolved.filter((r) => r.repo && r.repo !== r.book.se_slug)

  // machine artifact
  writeFileSync(
    "reports/se-mapping.json",
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        total: books.length,
        matched: matched.length,
        unmatched: unmatched.length,
        gatePass,
        disagreements: disagreements.map((r) => ({
          id: r.book.id,
          stored: r.book.se_slug,
          resolved: r.repo,
          source: r.source,
        })),
        mapping: matched.map((r) => ({ id: r.book.id, repo: r.repo, source: r.source, url: repoUrlFor(r.repo!) })),
      },
      null,
      0,
    ),
  )

  // human report
  const lines: string[] = []
  lines.push(`# Standard Ebooks catalogue mapping`)
  lines.push(``)
  lines.push(`- generated: ${new Date().toISOString()}`)
  lines.push(`- books: ${books.length}`)
  lines.push(`- matched to an SE repo: ${matched.length}`)
  lines.push(`- unmatched: ${unmatched.length}`)
  lines.push(`- already had se_slug: ${stored.length}`)
  lines.push(`- new/changed se_slug writes pending: ${newWrites.length}`)
  lines.push(`- ambiguous (multiple same-depth translator variants): ${ambiguous.length}`)
  lines.push(`- resolved-but-not-in-index (INVALID): ${invalid.length}`)
  lines.push(``)
  lines.push(`## Sanity gate (resolved must reproduce stored se_slug)`)
  lines.push(``)
  lines.push(gatePass ? `PASS — all ${stored.length} stored slugs reproduced.` : `FAIL — ${disagreements.length} disagreement(s):`)
  for (const r of disagreements) {
    lines.push(`- \`${r.book.id}\`: stored=\`${r.book.se_slug}\` resolved=\`${r.repo ?? "(none)"}\` (via ${r.source})`)
  }
  lines.push(``)
  if (invalid.length) {
    lines.push(`## INVALID (resolved repo not in live SE index)`)
    for (const r of invalid.slice(0, 50)) lines.push(`- \`${r.book.id}\` -> \`${r.repo}\``)
    lines.push(``)
  }
  if (ambiguous.length) {
    lines.push(`## Ambiguous (picked fewest-segment)`)
    for (const r of ambiguous.slice(0, 60)) lines.push(`- \`${r.book.id}\` -> \`${r.repo}\``)
    lines.push(``)
  }
  lines.push(`## Unmatched (${unmatched.length})`)
  lines.push(unmatched.map((r) => `\`${r.book.id}\``).join(" "))
  lines.push(``)
  writeFileSync("reports/se-mapping.md", lines.join("\n"))

  console.log(`books=${books.length} matched=${matched.length} unmatched=${unmatched.length}`)
  console.log(`storedSeSlug=${stored.length} pendingWrites=${newWrites.length} ambiguous=${ambiguous.length} invalid=${invalid.length}`)
  console.log(`SANITY GATE: ${gatePass ? "PASS" : "FAIL (" + disagreements.length + " disagreements)"}`)
  if (!gatePass) {
    for (const r of disagreements) {
      console.log(`  ! ${r.book.id}: stored=${r.book.se_slug} resolved=${r.repo ?? "(none)"} [${r.source}]`)
    }
  }

  if (!WRITE) {
    console.log(`\nDRY RUN. reports/se-mapping.md + reports/se-mapping.json written. Pass --write to update the DB.`)
    return
  }

  if (!gatePass) {
    console.error(`\nREFUSING TO WRITE: sanity gate failed. Resolve disagreements first.`)
    process.exit(1)
  }
  if (invalid.length) {
    console.error(`\nREFUSING TO WRITE: ${invalid.length} resolved repos not in the live index.`)
    process.exit(1)
  }

  let wrote = 0
  for (const r of newWrites) {
    const { error } = await db
      .from("books")
      .update({ se_slug: r.repo, standard_ebooks_url: repoUrlFor(r.repo!) })
      .eq("id", r.book.id)
    if (error) throw new Error(`update ${r.book.id}: ${error.message}`)
    wrote++
    if (wrote % 100 === 0) process.stdout.write(`\rwrote ${wrote}/${newWrites.length}`)
  }
  process.stdout.write("\n")
  console.log(`WROTE ${wrote} se_slug + standard_ebooks_url rows.`)
}

function repoUrlFor(repo: string) {
  return `https://standardebooks.org/ebooks/${repo.replace(/_/g, "/")}`
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
