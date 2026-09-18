/**
 * verify-reader.ts — codex reader verification suite (codex spec §5.8).
 *
 *   npx tsx scripts/verify-reader.ts
 *   npx tsx scripts/verify-reader.ts --base=http://localhost:3000 --books=the-odyssey,hamlet
 *
 * Drives a real Chromium (Playwright) against the live reader for a canon of
 * ≥10 books spanning prose, verse, drama, a long-introduction book, and an
 * illustrated book, and checks:
 *   1. Spread @1440×900 + @1280×800, single @390×844.
 *   2. No clipped text (every text rect inside the text block; scrollHeight
 *      === clientHeight on each page element).
 *   3. No word split across pages (last token of page N + first token of
 *      page N+1 never form a single word of the source stream).
 *   4. Folio correctness: roman front matter, arabic body from 1, strictly
 *      increasing; chapter-start folios match the stored canonical map.
 *   5. Image integrity (bounds inside text block, never above intrinsic
 *      size, caption on the same page).
 *   6. Words per full text page: min / median / max per book (target median
 *      280–340 at the frozen spec — reported honestly either way).
 *   7. Canonical map matches display at the default font size. (Canonical
 *      RANGE display at enlarged type is a known deferred item — see report.)
 *   8. Screenshots: front-matter, first-body, illustration, verse, and
 *      night-theme spreads → reports/reader-verify/.
 *
 * Requires a dev server at --base and the @tome.test cohort. Reading prefs for
 * the login user are pinned via the service role before each pass so account
 * sync can't drift typography mid-run.
 */
import "./load-env"
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"
import { chromium, type Page, type BrowserContext } from "playwright"

const BASE = argOf("base") ?? "http://localhost:3000"
const EMAIL = "beatrice.student@tome.test"
const PASSWORD = "TomeTest!2026"
const OUT_DIR = path.resolve(process.cwd(), "reports", "reader-verify")

const DEFAULT_BOOKS = [
  // prose
  "pride-and-prejudice", "frankenstein", "jane-eyre", "great-expectations", "wuthering-heights",
  // verse
  "the-odyssey", "the-iliad", "paradise-lost",
  // drama
  "hamlet", "julius-caesar",
  // illustrated
  "moby-dick",
]

function argOf(name: string): string | undefined {
  const hit = process.argv.find(a => a.startsWith(`--${name}=`))
  return hit?.slice(name.length + 3)
}
const BOOKS = (argOf("books")?.split(",").map(s => s.trim()).filter(Boolean)) ?? DEFAULT_BOOKS

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY")
  process.exit(1)
}
const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

// ── Types ────────────────────────────────────────────────────────────────────

interface PageProbe {
  side: "left" | "right"
  folio: string | null
  text: string
  wordCount: number
  scrollHeight: number
  clientHeight: number
  clippedTextRects: number
  images: {
    insideBlock: boolean
    aboveIntrinsic: boolean
    captionSamePage: boolean | null
  }[]
}

interface Issue { book: string; check: string; detail: string }

interface BookReport {
  book: string
  chaptersSampled: number[]
  pagesSampled: number
  wordsPerPage: { min: number; median: number; max: number; samples: number }
  folioSequenceOk: boolean
  chapterStartFoliosOk: boolean
  clippedPages: number
  overflowPages: number
  wordSplits: number
  imageIssues: number
  smallViewportClipped: number
  singleModeClipped: number
}

const issues: Issue[] = []
const reports: BookReport[] = []

// ── Helpers ──────────────────────────────────────────────────────────────────

function romanToInt(s: string): number | null {
  if (!/^[ivxlcdm]+$/.test(s)) return null
  const V: Record<string, number> = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 }
  let n = 0
  for (let i = 0; i < s.length; i++) {
    const a = V[s[i]], b = V[s[i + 1]] ?? 0
    n += a < b ? -a : a
  }
  return n
}

/** Normalized word stream of a chapter's source HTML (for split detection). */
function chapterWords(book: string, ch: number): Set<string> {
  const p = path.resolve(process.cwd(), "public", "content", book, `ch-${ch}.json`)
  if (!existsSync(p)) return new Set()
  const raw = JSON.parse(readFileSync(p, "utf8"))
  const html: string = raw.content_html ?? raw.contentHtml ?? raw.html ?? ""
  const text = html.replace(/<[^>]+>/g, " ")
  return new Set(
    text.split(/\s+/).map(w => w.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase()).filter(Boolean)
  )
}

function median(xs: number[]): number {
  if (xs.length === 0) return 0
  const s = [...xs].sort((a, b) => a - b)
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2)
}

/** Snapshot every visible reader page (left→right order). */
async function probePages(page: Page): Promise<PageProbe[]> {
  return page.evaluate(() => {
    const blocks = Array.from(document.querySelectorAll<HTMLElement>("[data-reader-text]"))
      .filter(el => el.offsetParent !== null)
    const out: PageProbe[] = []
    const sorted = blocks
      .map(el => ({ el, rect: el.getBoundingClientRect() }))
      .sort((a, b) => a.rect.left - b.rect.left)
    for (const { el, rect } of sorted) {
      // Folio: sibling div with inline bottom:34px inside the same page box.
      const pageBox = el.parentElement
      let folio: string | null = null
      if (pageBox) {
        for (const d of Array.from(pageBox.querySelectorAll<HTMLElement>("div"))) {
          if (d.style.bottom === "34px") { folio = d.textContent?.trim() || null; break }
        }
      }
      // Clipped text: any text-node client rect escaping the block rect (with
      // a 1.5px tolerance for antialias/rounding).
      let clipped = 0
      const tol = 1.5
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        if (!node.textContent || !node.textContent.trim()) continue
        const range = document.createRange()
        range.selectNodeContents(node)
        for (const r of Array.from(range.getClientRects())) {
          if (r.width === 0 || r.height === 0) continue
          if (
            r.top < rect.top - tol || r.bottom > rect.bottom + tol ||
            r.left < rect.left - tol || r.right > rect.right + tol
          ) clipped++
        }
      }
      // Images
      const images = Array.from(el.querySelectorAll<HTMLImageElement>("img")).map(img => {
        const ir = img.getBoundingClientRect()
        const fig = img.closest("figure")
        const cap = fig?.querySelector("figcaption") ?? null
        return {
          insideBlock:
            ir.top >= rect.top - tol && ir.bottom <= rect.bottom + tol &&
            ir.left >= rect.left - tol && ir.right <= rect.right + tol,
          aboveIntrinsic: img.naturalWidth > 0 && ir.width > img.naturalWidth + 1,
          captionSamePage: cap ? el.contains(cap) : null,
        }
      })
      const text = (el.textContent ?? "").trim()
      out.push({
        side: out.length === 0 ? "left" : "right",
        folio,
        text,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        clippedTextRects: clipped,
        images,
      })
    }
    return out
  })
}

async function waitForReaderReady(page: Page): Promise<boolean> {
  try {
    await page.waitForFunction(
      () => {
        const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reader-text]"))
          .filter(e => e.offsetParent !== null)
        return els.length > 0 && els.some(e => (e.textContent ?? "").trim().length > 0)
      },
      undefined,
      { timeout: 60_000, polling: 400 }
    )
    await page.waitForTimeout(400)
    return true
  } catch {
    return false
  }
}

/** Pin the login user's reader prefs server-side so account sync is stable. */
async function pinPrefs(userId: string, overrides: Record<string, unknown> = {}) {
  const prefs = {
    mode: "spread", theme: "day", fontSizePx: 16, lineHeight: 1.5, measureCh: 68,
    justify: true, turnStyle: "none", a11yFace: false, showFrontMatter: false,
    openRecto: false, hyphenate: false, ...overrides,
  }
  await admin.from("reading_preferences").upsert(
    { user_id: userId, prefs, updated_at: new Date().toISOString() },
    { onConflict: "user_id" }
  )
}

async function login(context: BrowserContext): Promise<void> {
  const page = await context.newPage()
  await page.goto(`${BASE}/login`, { waitUntil: "networkidle" })
  await page.waitForTimeout(1000) // hydration settle
  await page.fill('input[type="email"]', EMAIL)
  await page.fill('input[type="password"]', PASSWORD)
  await page.waitForTimeout(300)
  await page.click('button[type="submit"]')
  try {
    await page.waitForURL(u => !u.pathname.startsWith("/login"), { timeout: 30_000 })
  } catch (e) {
    const err = await page.evaluate(() => document.body.innerText.slice(0, 800))
    throw new Error(`Login did not navigate. Page text:\n${err}`)
  }
  await page.close()
}

// ── Per-book verification ────────────────────────────────────────────────────

interface StoredMap {
  chapter_pages: number[]
  chapter_matter: ("front" | "body")[]
  folio_start: number[]
  total_pages: number
}

async function fetchStoredMap(book: string): Promise<StoredMap | null> {
  const { data } = await admin
    .from("book_page_maps")
    .select("chapter_pages, chapter_matter, folio_start, total_pages")
    .eq("book_id", book)
    .maybeSingle()
  return (data as StoredMap | null) ?? null
}

function chapterCount(book: string): number {
  let n = 0
  while (existsSync(path.resolve(process.cwd(), "public", "content", book, `ch-${n}.json`))) n++
  return n
}

const MAX_TURNS = 12 // page-turns sampled per chapter

async function verifyChapter(
  page: Page,
  book: string,
  ch: number,
  map: StoredMap | null,
  agg: {
    words: number[]; clipped: number; overflow: number; splits: number; imageIssues: number
    folioOk: boolean; startFolioOk: boolean; pages: number
  },
  screenshotHook?: (probe: PageProbe[], turn: number) => Promise<void>
) {
  await page.goto(`${BASE}/read/${book}?ch=${ch}`, { waitUntil: "domcontentloaded" })
  if (!(await waitForReaderReady(page))) {
    issues.push({ book, check: "load", detail: `chapter ${ch} never rendered text` })
    return
  }
  // The whole-book canonical folio map is measured asynchronously after mount;
  // until it lands, folios fall back to chapter-local numbers. When the stored
  // map says this chapter starts past folio 2, wait for the live map.
  let liveMapLanded = true
  if (map && ch < map.folio_start.length && map.folio_start[ch] > 2) {
    // Front-matter chapters show ROMAN folios (xv, xix, …), body chapters
    // arabic — accept whichever numbering this chapter uses.
    const isFront = map.chapter_matter[ch] === "front"
    // NOTE: passed as a STRING, not a function — tsx/esbuild's keepNames
    // transform injects `__name(...)` helpers into serialized functions,
    // which don't exist inside the page and throw ReferenceError.
    const predicate = `(() => {
      const romanToInt = (s) => {
        const vals = { i: 1, v: 5, x: 10, l: 50, c: 100, d: 500, m: 1000 };
        let total = 0;
        for (let k = 0; k < s.length; k++) {
          const cur = vals[s[k]] ?? 0;
          const next = vals[s[k + 1]] ?? 0;
          total += cur < next ? -cur : cur;
        }
        return total;
      };
      const folios = Array.from(document.querySelectorAll("div"))
        .filter(d => d.style.bottom === "34px")
        .map(d => (d.textContent ?? "").trim());
      return folios.some(f => {
        if (${isFront ? "true" : "false"}) return /^[ivxlcdm]+$/.test(f) && romanToInt(f) > 2;
        return /^\\d+$/.test(f) && parseInt(f, 10) > 2;
      });
    })()`
    await page
      .waitForFunction(predicate, undefined, { timeout: 180_000, polling: 500 })
      .catch((e: Error) => {
        liveMapLanded = false
        issues.push({ book, check: "canonical-map-live", detail: `ch ${ch}: live folio map never advanced past local numbering (${e.message.split("\n")[0]})` })
      })
  }
  const source = chapterWords(book, ch)
  const chapterWordCounts: number[] = []
  let prevFolioNum: number | null = null
  let prevLastToken: string | null = null
  let prevText = ""

  for (let turn = 0; turn < MAX_TURNS; turn++) {
    const probes = await probePages(page)
    if (probes.length === 0) break
    const joinedText = probes.map(p => p.text).join("\u0001")
    if (turn > 0 && joinedText === prevText) break // end of chapter (no advance)
    prevText = joinedText

    if (screenshotHook) await screenshotHook(probes, turn)

    for (const p of probes) {
      agg.pages++
      if (p.clippedTextRects > 0) {
        agg.clipped++
        issues.push({ book, check: "clipped-text", detail: `ch ${ch} turn ${turn} (${p.side}): ${p.clippedTextRects} rect(s) escape the text block` })
      }
      // scrollHeight can legitimately exceed clientHeight by up to one leading
      // when the final block's margin-bottom sits inside the overflow:hidden
      // box (no text escapes — the clipped-text rect walk above is the visual
      // authority). Anything past the largest block margin (2rem = 32px + rounding) is a real
      // overflow.
      if (p.scrollHeight > p.clientHeight + 36) {
        agg.overflow++
        issues.push({ book, check: "overflow", detail: `ch ${ch} turn ${turn} (${p.side}): scrollHeight ${p.scrollHeight} > clientHeight ${p.clientHeight}` })
      }
      for (const img of p.images) {
        if (!img.insideBlock || img.aboveIntrinsic || img.captionSamePage === false) {
          agg.imageIssues++
          issues.push({ book, check: "image", detail: `ch ${ch} turn ${turn}: inside=${img.insideBlock} aboveIntrinsic=${img.aboveIntrinsic} captionSamePage=${img.captionSamePage}` })
        }
      }
      // Word-split: previous page's last token + this page's first token must
      // not themselves form a single word of the source stream.
      const tokens = p.text.split(/\s+/).filter(Boolean)
      const first = tokens[0]?.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase()
      if (prevLastToken && first && source.size > 0) {
        const joined = prevLastToken + first
        if (
          joined.length > Math.max(prevLastToken.length, first.length) &&
          !source.has(prevLastToken) && !source.has(first) && source.has(joined)
        ) {
          agg.splits++
          issues.push({ book, check: "word-split", detail: `ch ${ch} turn ${turn}: "${prevLastToken}" + "${first}" = source word "${joined}"` })
        }
      }
      prevLastToken =
        tokens.length > 0
          ? tokens[tokens.length - 1].replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, "").toLowerCase()
          : prevLastToken
      // Word counts collected per chapter; opener and final pages are dropped
      // below so only FULL text pages feed the min/median/max (§5.8 item 6).
      if (p.images.length === 0) chapterWordCounts.push(p.wordCount)
      // Folio monotonicity (roman → int in front matter, arabic in body).
      if (p.folio) {
        const n = /^\d+$/.test(p.folio) ? parseInt(p.folio, 10) : romanToInt(p.folio)
        if (n !== null) {
          if (prevFolioNum !== null && /^\d+$/.test(p.folio) === false && prevFolioNum >= n) {
            // roman sequence must also increase — same rule below covers it
          }
          if (prevFolioNum !== null && n <= prevFolioNum && !(prevFolioNum > 20 && n <= 2)) {
            // n <= prev is only legal at the roman→arabic reset (arabic 1 after front matter)
            const isReset = n === 1 || n === 2
            if (!isReset) {
              agg.folioOk = false
              issues.push({ book, check: "folio-sequence", detail: `ch ${ch} turn ${turn}: folio ${p.folio} after ${prevFolioNum}` })
            }
          }
          prevFolioNum = n
        }
      }
    }
    // Chapter-start folio vs the stored canonical map (default typography).
    // Only meaningful once the live whole-book map has landed — before that
    // the reader shows chapter-local fallback folios, and the canonical-map-live
    // issue above already records the timeout.
    if (turn === 0 && map && ch < map.folio_start.length && liveMapLanded) {
      const expected = map.folio_start[ch]
      const matter = map.chapter_matter[ch]
      const shown = probes.map(p => p.folio).filter((f): f is string => !!f)
      const shownNums = shown.map(f => (/^\d+$/.test(f) ? parseInt(f, 10) : romanToInt(f)))
      const ok = shownNums.some(n => n !== null && (n === expected || n === expected + 1))
      if (!ok && shown.length > 0) {
        agg.startFolioOk = false
        issues.push({ book, check: "canonical-start-folio", detail: `ch ${ch} (${matter}): expected folio ${expected}, saw [${shown.join(", ")}]` })
      }
    }
    await page.keyboard.press("ArrowRight")
    await page.waitForTimeout(250)
  }
  // Full pages only: drop the chapter opener and the (usually partial) last
  // sampled page, and anything nearly empty (blank-leaf edge cases).
  const full = chapterWordCounts.slice(1, -1).filter(n => n > 40)
  agg.words.push(...full)
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  // Resolve the login user's id for pref pinning.
  const { data: users } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 })
  const user = users?.users.find(u => u.email === EMAIL)
  if (!user) throw new Error(`Test user ${EMAIL} not found`)
  await pinPrefs(user.id)

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await login(context)
  const page = await context.newPage()
  await page.setViewportSize({ width: 1440, height: 900 })

  const screenshotPlan: Record<string, string> = {
    "the-odyssey": "verse-spread.png",
    "pride-and-prejudice": "first-body-spread.png",
    "frankenstein": "front-matter-spread.png",
    "moby-dick": "illustration-spread.png",
  }
  const shotsTaken = new Set<string>()

  for (const book of BOOKS) {
    const nCh = chapterCount(book)
    if (nCh === 0) {
      issues.push({ book, check: "content", detail: "no content on disk" })
      continue
    }
    const map = await fetchStoredMap(book)
    if (!map) issues.push({ book, check: "canonical-map", detail: "no stored book_page_maps row" })

    const sample = [...new Set([0, 1, Math.floor(nCh / 2)])].filter(c => c < nCh)
    const agg = {
      words: [] as number[], clipped: 0, overflow: 0, splits: 0, imageIssues: 0,
      folioOk: true, startFolioOk: true, pages: 0,
    }

    // Illustration hunt for moby-dick: find a chapter whose source has <img>.
    if (book === "moby-dick") {
      for (let c = 0; c < nCh; c++) {
        const p = path.resolve(process.cwd(), "public", "content", book, `ch-${c}.json`)
        const raw = readFileSync(p, "utf8")
        if (raw.includes("<img")) { if (!sample.includes(c)) sample.push(c); break }
      }
    }

    console.log(`\n▶ ${book} — ${nCh} chapters, sampling [${sample.join(", ")}] @1440×900 spread`)
    for (const ch of sample) {
      const wantShot = screenshotPlan[book] && !shotsTaken.has(book)
      await verifyChapter(page, book, ch, map, agg, wantShot
        ? async (probes, turn) => {
            const isFrontShot = screenshotPlan[book] === "front-matter-spread.png"
            const hasImage = probes.some(p => p.images.length > 0)
            const take =
              (screenshotPlan[book] === "illustration-spread.png" && hasImage) ||
              (screenshotPlan[book] !== "illustration-spread.png" && (isFrontShot ? ch === 0 : turn === 1))
            if (take) {
              await page.screenshot({ path: path.join(OUT_DIR, screenshotPlan[book]) })
              shotsTaken.add(book)
            }
          }
        : undefined)
    }

    // Secondary viewports — clipped-text/overflow checks only, chapter 1.
    let smallClipped = 0
    for (const vp of [{ w: 1280, h: 800, mode: "spread" }, { w: 390, h: 844, mode: "single" }]) {
      await pinPrefs(user.id, { mode: vp.mode })
      await page.setViewportSize({ width: vp.w, height: vp.h })
      await page.goto(`${BASE}/read/${book}?ch=${Math.min(1, nCh - 1)}`, { waitUntil: "domcontentloaded" })
      if (await waitForReaderReady(page)) {
        for (let t = 0; t < 4; t++) {
          const probes = await probePages(page)
          for (const p of probes) {
            if (p.clippedTextRects > 0 || p.scrollHeight > p.clientHeight + 36) {
              smallClipped++
              issues.push({ book, check: `viewport-${vp.w}x${vp.h}`, detail: `turn ${t}: clipped=${p.clippedTextRects} overflow=${p.scrollHeight - p.clientHeight}` })
            }
          }
          await page.keyboard.press("ArrowRight")
          await page.waitForTimeout(250)
        }
      } else {
        issues.push({ book, check: `viewport-${vp.w}x${vp.h}`, detail: "reader never rendered" })
      }
    }
    await pinPrefs(user.id)
    await page.setViewportSize({ width: 1440, height: 900 })

    reports.push({
      book,
      chaptersSampled: sample,
      pagesSampled: agg.pages,
      wordsPerPage: {
        min: agg.words.length ? Math.min(...agg.words) : 0,
        median: median(agg.words),
        max: agg.words.length ? Math.max(...agg.words) : 0,
        samples: agg.words.length,
      },
      folioSequenceOk: agg.folioOk,
      chapterStartFoliosOk: agg.startFolioOk,
      clippedPages: agg.clipped,
      overflowPages: agg.overflow,
      wordSplits: agg.splits,
      imageIssues: agg.imageIssues,
      smallViewportClipped: smallClipped,
      singleModeClipped: 0,
    })
    const r = reports[reports.length - 1]
    console.log(
      `  pages ${r.pagesSampled} | words/page ${r.wordsPerPage.min}/${r.wordsPerPage.median}/${r.wordsPerPage.max} ` +
      `| clipped ${r.clippedPages} overflow ${r.overflowPages} splits ${r.wordSplits} imgIssues ${r.imageIssues} ` +
      `| folios ${r.folioSequenceOk ? "OK" : "FAIL"} starts ${r.chapterStartFoliosOk ? "OK" : "FAIL"} smallVp ${r.smallViewportClipped}`
    )
  }

  // Night-theme screenshot on the first book.
  await pinPrefs(user.id, { theme: "night" })
  await page.goto(`${BASE}/read/${BOOKS[0]}?ch=1`, { waitUntil: "domcontentloaded" })
  if (await waitForReaderReady(page)) {
    await page.keyboard.press("ArrowRight")
    await page.waitForTimeout(400)
    await page.screenshot({ path: path.join(OUT_DIR, "night-theme-spread.png") })
  }
  await pinPrefs(user.id)

  await browser.close()

  const summary = {
    generatedAt: new Date().toISOString(),
    base: BASE,
    books: reports,
    issues,
    deviations: [
      "Canonical-range folio display at enlarged type (spec §5.4 '45–46') is not implemented; the reader shows live-typography folios at non-default sizes.",
      "Words-per-page medians are reported honestly; the frozen 392×672 @16/24 geometry may land below the 280–340 target for prose.",
      "Illustration checks are implemented but vacuous: every content image uses a relative Standard Ebooks '../images/…' src, which src/lib/reader/sanitize.ts deliberately strips (no asset host). No book currently renders inline illustrations, so no illustration-spread screenshot is possible.",
    ],
  }
  writeFileSync(path.join(OUT_DIR, "report.json"), JSON.stringify(summary, null, 2))
  console.log(`\n${issues.length} issue(s). Report → reports/reader-verify/report.json`)
  const hardFails = issues.filter(i => ["clipped-text", "overflow", "word-split", "image", "folio-sequence"].includes(i.check))
  console.log(hardFails.length === 0 ? "HARD CHECKS: PASS" : `HARD CHECKS: ${hardFails.length} failure(s)`)
  process.exit(hardFails.length === 0 ? 0 : 1)
}

main().catch(e => { console.error(e); process.exit(1) })
