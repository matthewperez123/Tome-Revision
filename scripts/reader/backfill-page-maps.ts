/**
 * backfill-page-maps.ts — compute + store canonical whole-book page maps
 * (codex spec §5.4) into public.book_page_maps.
 *
 *   npx tsx scripts/reader/backfill-page-maps.ts --book=the-odyssey
 *   npx tsx scripts/reader/backfill-page-maps.ts --book=the-odyssey,the-iliad
 *   npx tsx scripts/reader/backfill-page-maps.ts --all            # whole library
 *   npx tsx scripts/reader/backfill-page-maps.ts --all --force    # recompute even if stored
 *   npx tsx scripts/reader/backfill-page-maps.ts --all --concurrency=4
 *
 * How it works: drives a headless Chromium (Playwright) to the /reader-map
 * harness route, which lays every chapter out with REAL DOM layout at the
 * canonical typography (Literata 16/24, justified, recto-open off) using the
 * exact same shared measurement code as the live reader
 * (src/lib/reader/folio-map.ts), then reads window.__pageMap and upserts the
 * row with the service role.
 *
 * RESUMABLE: `--all` enumerates every book with content on disk
 * (public/content/<slug>/ch-0.json) and skips slugs that already have a
 * stored map (the book_page_maps table IS the progress ledger), so an
 * interrupted run picks up where it left off. Progress is logged per book.
 *
 * Requires a dev/preview server running at --base (default localhost:3000).
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (.env.local).
 */
import "../load-env"
import { readdirSync, existsSync } from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { chromium, type Browser } from "playwright"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local")
  process.exit(1)
}

const admin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

function arg(name: string): string | undefined {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`))
  return hit?.slice(name.length + 3)
}
function flag(name: string): boolean {
  return process.argv.includes(`--${name}`)
}

const BASE = arg("base") ?? "http://localhost:3000"
const ALL = flag("all")
const FORCE = flag("force")
const CONCURRENCY = Math.max(1, Math.min(8, Number(arg("concurrency") ?? 3)))
const EXPLICIT = (arg("book") ?? "").split(",").map(s => s.trim()).filter(Boolean)

if (!ALL && EXPLICIT.length === 0) {
  console.error(
    "Usage: npx tsx scripts/reader/backfill-page-maps.ts --book=<slug>[,<slug>…] | --all [--force] [--concurrency=N] [--base=http://localhost:3000]"
  )
  process.exit(1)
}

type PageMapResult = {
  status: "done"
  bookId: string
  specVersion: number
  fontSizePx: number
  lineHeight: number
  openRecto: boolean
  totalPages: number
  counts: number[]
  matter: ("front" | "body")[]
  folioStart: number[]
}

/** Every slug with reader content on disk (public/content/<slug>/ch-0.json). */
function slugsWithContent(): string[] {
  const root = path.resolve(process.cwd(), "public", "content")
  return readdirSync(root, { withFileTypes: true })
    .filter(d => d.isDirectory() && existsSync(path.join(root, d.name, "ch-0.json")))
    .map(d => d.name)
    .sort()
}

/** Slugs that already have a stored map (spec_version 1) — the resume ledger. */
async function storedSlugs(): Promise<Set<string>> {
  const done = new Set<string>()
  const PAGE = 1000
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await admin
      .from("book_page_maps")
      .select("book_id")
      .eq("spec_version", 1)
      .range(from, from + PAGE - 1)
    if (error) throw new Error(`book_page_maps read failed: ${error.message}`)
    for (const r of data ?? []) done.add(r.book_id as string)
    if (!data || data.length < PAGE) break
  }
  return done
}

async function processBook(browser: Browser, bookId: string): Promise<string | null> {
  const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } })
  try {
    await page.goto(`${BASE}/reader-map?book=${encodeURIComponent(bookId)}`, {
      waitUntil: "domcontentloaded",
    })
    // Long books take a while: each chapter is a full DOM layout pass.
    const result = (await page.waitForFunction(
      () => {
        const m = (window as unknown as { __pageMap?: { status: string } }).__pageMap
        return m && m.status !== "pending" ? m : null
      },
      undefined,
      { timeout: 600_000, polling: 1000 }
    ).then(h => h.jsonValue())) as PageMapResult | { status: "error"; message: string }

    if (result.status !== "done") {
      return `harness: ${"message" in result ? result.message : "unknown"}`
    }

    const { error } = await admin.from("book_page_maps").upsert({
      book_id: result.bookId,
      spec_version: result.specVersion,
      font_size_px: result.fontSizePx,
      line_height: result.lineHeight,
      open_recto: result.openRecto,
      chapter_pages: result.counts,
      chapter_matter: result.matter,
      folio_start: result.folioStart,
      total_pages: result.totalPages,
      computed_at: new Date().toISOString(),
    })
    if (error) return `upsert: ${error.message}`
    console.log(
      `✓ ${bookId} — ${result.totalPages} pages / ${result.counts.length} chapters ` +
      `(front: ${result.matter.filter(m => m === "front").length})`
    )
    return null
  } catch (e) {
    return e instanceof Error ? e.message : String(e)
  } finally {
    await page.close()
  }
}

async function main() {
  let books: string[]
  if (ALL) {
    const onDisk = slugsWithContent()
    const done = FORCE ? new Set<string>() : await storedSlugs()
    books = onDisk.filter(s => !done.has(s))
    console.log(
      `Library backfill: ${onDisk.length} books with content, ${done.size} already mapped, ` +
      `${books.length} to compute (concurrency ${CONCURRENCY}).`
    )
  } else {
    books = EXPLICIT
  }
  if (books.length === 0) {
    console.log("Nothing to do.")
    return
  }

  const browser = await chromium.launch({ headless: true })
  const failures: { bookId: string; reason: string }[] = []
  let nextIdx = 0
  let doneCount = 0
  const startedAt = Date.now()

  async function worker() {
    for (;;) {
      const i = nextIdx++
      if (i >= books.length) return
      const bookId = books[i]
      const reason = await processBook(browser, bookId)
      doneCount++
      if (reason) {
        failures.push({ bookId, reason })
        console.log(`✗ ${bookId} — ${reason}`)
      }
      if (doneCount % 25 === 0 || doneCount === books.length) {
        const mins = ((Date.now() - startedAt) / 60000).toFixed(1)
        console.log(`— progress: ${doneCount}/${books.length} (${failures.length} failed) in ${mins} min`)
      }
    }
  }

  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, books.length) }, worker))
  await browser.close()

  if (failures.length > 0) {
    console.error(`\n${failures.length}/${books.length} book(s) failed:`)
    for (const f of failures) console.error(`  ${f.bookId}: ${f.reason}`)
    // Explicit-list mode is strict; --all reports but exits 0 so a partial
    // library run still counts as progress (rerun resumes the remainder).
    if (!ALL) process.exit(1)
  }
  console.log(`Done — ${books.length - failures.length}/${books.length} book(s) backfilled.`)
}

main().catch(e => { console.error(e); process.exit(1) })
