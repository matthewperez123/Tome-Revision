/**
 * backfill-page-maps.ts — compute + store canonical whole-book page maps
 * (codex spec §5.4) into public.book_page_maps.
 *
 *   npx tsx scripts/reader/backfill-page-maps.ts --book=the-odyssey
 *   npx tsx scripts/reader/backfill-page-maps.ts --book=the-odyssey,the-iliad
 *   npx tsx scripts/reader/backfill-page-maps.ts --base=http://localhost:3000 --book=…
 *
 * How it works: drives a headless Chromium (Playwright) to the /reader-map
 * harness route, which lays every chapter out with REAL DOM layout at the
 * canonical typography (Literata 16/24, justified, recto-open off) using the
 * exact same shared measurement code as the live reader
 * (src/lib/reader/folio-map.ts), then reads window.__pageMap and upserts the
 * row with the service role.
 *
 * Requires a dev/preview server running at --base (default localhost:3000).
 * Env: NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (.env.local).
 */
import "../load-env"
import { createClient } from "@supabase/supabase-js"
import { chromium } from "playwright"

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

const BASE = arg("base") ?? "http://localhost:3000"
const BOOKS = (arg("book") ?? "").split(",").map(s => s.trim()).filter(Boolean)
if (BOOKS.length === 0) {
  console.error("Usage: npx tsx scripts/reader/backfill-page-maps.ts --book=<slug>[,<slug>…] [--base=http://localhost:3000]")
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

async function main() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 1024 } })
  let failures = 0

  for (const bookId of BOOKS) {
    process.stdout.write(`→ ${bookId} … `)
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
        { timeout: 300_000, polling: 1000 }
      ).then(h => h.jsonValue())) as PageMapResult | { status: "error"; message: string }

      if (result.status !== "done") {
        console.log(`FAILED: ${"message" in result ? result.message : "unknown"}`)
        failures++
        continue
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
      if (error) {
        console.log(`UPSERT FAILED: ${error.message}`)
        failures++
        continue
      }
      console.log(
        `${result.totalPages} pages / ${result.counts.length} chapters ` +
        `(front: ${result.matter.filter(m => m === "front").length}) — stored`
      )
    } catch (e) {
      console.log(`ERROR: ${e instanceof Error ? e.message : String(e)}`)
      failures++
    }
  }

  await browser.close()
  if (failures > 0) {
    console.error(`${failures}/${BOOKS.length} book(s) failed`)
    process.exit(1)
  }
  console.log(`Done — ${BOOKS.length} book(s) backfilled.`)
}

main().catch(e => { console.error(e); process.exit(1) })
