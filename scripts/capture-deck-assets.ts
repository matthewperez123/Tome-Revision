/**
 * pitch deck asset capture pipeline
 *
 * subcommands:
 *   audit            — scan public/ for static assets, copy logos/paintings, emit manifest seed
 *   capture-static   — playwright: full-page + per-component screenshots of homepage / app routes
 *   capture-anim     — playwright: animation frame sequences + webm video recordings
 *   render-brand     — playwright: render brand-system poster + swatches from a temp html page
 *   slide-mapping    — append SLIDE MAPPING section + summary footer to MANIFEST.md
 *   all              — run every phase in order
 *
 * usage:  npx tsx scripts/capture-deck-assets.ts <subcommand> [--base-url=<url>]
 */

import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawn } from 'node:child_process'

// resolve repo root (this script lives in <repo>/scripts/)
const __filename = fileURLToPath(import.meta.url)
const REPO_ROOT = path.resolve(path.dirname(__filename), '..')
const PUBLIC_DIR = path.join(REPO_ROOT, 'public')
const OUT_DIR = path.join(REPO_ROOT, 'pitch-deck-assets')
const MANIFEST_PATH = path.join(OUT_DIR, 'MANIFEST.md')

const SUBFOLDERS = {
  logos: '01-logos',
  paintings: '02-paintings',
  homepage: '03-homepage',
  appUi: '04-app-ui',
  animations: '05-animations',
  brand: '06-brand-system',
} as const

// retina capture config
const VIEWPORT = { width: 1920, height: 1080 } as const
const DEVICE_SCALE = 2

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

async function ensureDir(p: string): Promise<void> {
  await fs.mkdir(p, { recursive: true })
}

function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / 1024 / 1024).toFixed(2)} MB`
}

async function walk(dir: string): Promise<string[]> {
  const out: string[] = []
  let entries: import('node:fs').Dirent[]
  try {
    entries = await fs.readdir(dir, { withFileTypes: true })
  } catch {
    return out
  }
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) out.push(...(await walk(full)))
    else out.push(full)
  }
  return out
}

const IMAGE_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif', '.mp4', '.webm'])

// captured-asset log shared across phases — written into MANIFEST.md by slide-mapping
type CaptureLog = {
  rel: string                // path relative to OUT_DIR
  source: string             // url + section name
  status: 'ok' | 'missing' | 'auth-required' | 'error'
  bytes?: number
  note?: string
}
const CAPTURE_LOG: CaptureLog[] = []
const CAPTURE_LOG_PATH = path.join(OUT_DIR, '.capture-log.json')

async function loadCaptureLog(): Promise<CaptureLog[]> {
  try {
    const raw = await fs.readFile(CAPTURE_LOG_PATH, 'utf8')
    return JSON.parse(raw) as CaptureLog[]
  } catch { return [] }
}

async function saveCaptureLog(): Promise<void> {
  await fs.writeFile(CAPTURE_LOG_PATH, JSON.stringify(CAPTURE_LOG, null, 2), 'utf8')
}

async function recordCapture(rel: string, source: string, status: CaptureLog['status'], note?: string): Promise<void> {
  let bytes: number | undefined
  if (status === 'ok') {
    try {
      const stat = await fs.stat(path.join(OUT_DIR, rel))
      bytes = stat.size
    } catch { /* ignore */ }
  }
  CAPTURE_LOG.push({ rel, source, status, bytes, note })
  console.log(`  ${status === 'ok' ? 'captured' : status}: ${rel}${note ? '  (' + note + ')' : ''}`)
}

// ---------------------------------------------------------------------------
// classify
// ---------------------------------------------------------------------------

type AssetRow = {
  src: string
  rel: string
  size: number
  width?: number
  height?: number
  ext: string
  category: 'logo' | 'painting' | 'cover' | 'avatar' | 'map' | 'content' | 'other'
  copiedTo?: string
  description: string
}

function classify(rel: string): AssetRow['category'] {
  const lower = rel.toLowerCase()
  if (lower.includes('/paintings/')) return 'painting'
  if (lower.includes('/covers/'))    return 'cover'
  if (lower.includes('/avatars/'))   return 'avatar'
  if (lower.includes('/map/'))       return 'map'
  if (lower.includes('/content/'))   return 'content'
  if (
    lower.includes('/branding/') ||
    /\b(logo|wordmark|monogram|lockup)\b/.test(lower) ||
    lower.endsWith('/icon.svg') ||
    lower.endsWith('/apple-touch-icon.png') ||
    lower.includes('/virgil/')
  ) return 'logo'
  return 'other'
}

function describe(rel: string, category: AssetRow['category']): string {
  const base = path.basename(rel)
  switch (category) {
    case 'logo':    return `Brand asset (${base})`
    case 'painting':return `Public-domain painting (${base.replace(/\.[^.]+$/, '').replace(/-/g, ' ')})`
    case 'cover':   return `Book cover thumbnail (${base})`
    case 'avatar':  return `Character avatar (${base})`
    case 'map':     return `World-map / globe asset (${base})`
    case 'content': return `Book content asset (${base})`
    default:        return `Asset (${base})`
  }
}

// ---------------------------------------------------------------------------
// phase: audit
// ---------------------------------------------------------------------------

async function phaseAudit(): Promise<void> {
  console.log('audit phase: scanning public/ for image assets')
  for (const sub of Object.values(SUBFOLDERS)) await ensureDir(path.join(OUT_DIR, sub))
  await ensureDir(path.join(OUT_DIR, SUBFOLDERS.animations, 'videos'))

  let sharp: typeof import('sharp') | null = null
  try { sharp = (await import('sharp')).default as unknown as typeof import('sharp') } catch {
    console.log('  warn: sharp not available — dimensions will be omitted')
  }

  const all = await walk(PUBLIC_DIR)
  const rows: AssetRow[] = []
  for (const abs of all) {
    const ext = path.extname(abs).toLowerCase()
    if (!IMAGE_EXT.has(ext)) continue
    const rel = path.relative(REPO_ROOT, abs)
    const stat = await fs.stat(abs)
    const category = classify(rel)
    const row: AssetRow = { src: abs, rel, size: stat.size, ext, category, description: describe(rel, category) }
    if (sharp && ext !== '.mp4' && ext !== '.webm') {
      try {
        const meta = await sharp(abs).metadata()
        if (meta.width)  row.width  = meta.width
        if (meta.height) row.height = meta.height
      } catch { /* unreadable */ }
    }
    rows.push(row)
  }

  for (const r of rows) {
    let destSub: string | null = null
    if (r.category === 'logo')     destSub = SUBFOLDERS.logos
    else if (r.category === 'painting' && (r.ext === '.jpg' || r.ext === '.jpeg' || r.ext === '.png')) destSub = SUBFOLDERS.paintings
    if (!destSub) continue
    const destAbs = path.join(OUT_DIR, destSub, path.basename(r.src))
    await fs.copyFile(r.src, destAbs)
    r.copiedTo = path.relative(OUT_DIR, destAbs)
  }

  try {
    await fs.copyFile(path.join(PUBLIC_DIR, 'paintings', 'manifest.json'),
                     path.join(OUT_DIR, SUBFOLDERS.paintings, 'manifest.json'))
  } catch { /* ignore */ }

  // group + write manifest
  const byCat = new Map<AssetRow['category'], AssetRow[]>()
  for (const r of rows) {
    const arr = byCat.get(r.category) ?? []
    arr.push(r)
    byCat.set(r.category, arr)
  }
  for (const arr of byCat.values()) arr.sort((a, b) => a.rel.localeCompare(b.rel))

  const totalBytes = rows.reduce((s, r) => s + r.size, 0)
  const lines: string[] = []
  lines.push('# Pitch deck asset manifest')
  lines.push('')
  lines.push(`Generated: ${new Date().toISOString()}`)
  lines.push(`Repo root: \`${REPO_ROOT}\``)
  lines.push(`Output:    \`${OUT_DIR}\``)
  lines.push('')
  lines.push('## Phase 1 summary — static assets')
  lines.push('')
  lines.push(`- Image / video files scanned: **${rows.length}**`)
  lines.push(`- Total size: **${formatBytes(totalBytes)}**`)
  lines.push(`- Logos copied → \`01-logos/\`: **${rows.filter(r => r.category === 'logo' && r.copiedTo).length}**`)
  lines.push(`- Paintings copied → \`02-paintings/\`: **${rows.filter(r => r.category === 'painting' && r.copiedTo).length}**`)
  lines.push(`- Covers (not copied): **${rows.filter(r => r.category === 'cover').length}** — left in \`public/covers/\`, captured via library-grid screenshot in phase 2`)
  lines.push(`- Avatars (not copied): **${rows.filter(r => r.category === 'avatar').length}** — character portraits, used in app UI`)
  lines.push(`- Map assets (not copied): **${rows.filter(r => r.category === 'map').length}** — globe / world-map raster tiles`)
  lines.push(`- Other / book content (not copied): **${rows.filter(r => r.category === 'content' || r.category === 'other').length}**`)
  lines.push('')

  const sectionTitles: Record<AssetRow['category'], string> = {
    logo:     '01 — Logos & brand marks (copied)',
    painting: '02 — Paintings (copied)',
    cover:    'Notes — Book covers (NOT copied)',
    avatar:   'Notes — Character avatars (NOT copied)',
    map:      'Notes — World-map / globe assets (NOT copied)',
    content:  'Notes — Book content assets (NOT copied)',
    other:    'Notes — Other (NOT copied)',
  }
  const order: AssetRow['category'][] = ['logo', 'painting', 'cover', 'avatar', 'map', 'content', 'other']

  for (const cat of order) {
    const list = byCat.get(cat) ?? []
    if (list.length === 0) continue
    lines.push(`## ${sectionTitles[cat]}`)
    lines.push('')
    if (cat === 'cover' && list.length > 30) {
      lines.push(`${list.length} cover thumbnails under \`public/covers/covers/\`. Sample:`)
      lines.push('')
      lines.push('| Path | Size | Dim | Note |')
      lines.push('|---|---|---|---|')
      for (const r of list.slice(0, 10)) {
        lines.push(`| \`${r.rel}\` | ${formatBytes(r.size)} | ${r.width ?? '?'}×${r.height ?? '?'} | ${r.description} |`)
      }
      lines.push(`| … | | | (${list.length - 10} more — see \`public/covers/covers/\`) |`)
    } else {
      lines.push('| Path | Size | Dim | Copied to | Description |')
      lines.push('|---|---|---|---|---|')
      for (const r of list) {
        lines.push(`| \`${r.rel}\` | ${formatBytes(r.size)} | ${r.width ?? '?'}×${r.height ?? '?'} | ${r.copiedTo ? '`' + r.copiedTo + '`' : '—'} | ${r.description} |`)
      }
    }
    lines.push('')
  }

  lines.push('## Phase 2+ — captured assets (populated by capture phases)')
  lines.push('')
  lines.push('See `Phase 2 captures`, `Phase 3 animations`, `Phase 4 brand system`, and `SLIDE MAPPING` sections appended below.')
  lines.push('')

  await fs.writeFile(MANIFEST_PATH, lines.join('\n'), 'utf8')
  console.log(`audit phase complete — wrote ${MANIFEST_PATH}`)
  console.log(`  files scanned: ${rows.length}, total size: ${formatBytes(totalBytes)}`)
  console.log(`  logos copied:    ${rows.filter(r => r.category === 'logo' && r.copiedTo).length}`)
  console.log(`  paintings copied:${rows.filter(r => r.category === 'painting' && r.copiedTo).length}`)
}

// ---------------------------------------------------------------------------
// shared playwright helpers
// ---------------------------------------------------------------------------

async function newBrowser() {
  const { chromium } = await import('playwright')
  const browser = await chromium.launch({ headless: true })
  return browser
}

async function newContextWithViewport(browser: import('playwright').Browser, opts?: { videoDir?: string; colorScheme?: 'light' | 'dark' }) {
  const { videoDir, colorScheme = 'light' } = opts ?? {}
  const ctx = await browser.newContext({
    viewport: { width: VIEWPORT.width, height: VIEWPORT.height },
    deviceScaleFactor: DEVICE_SCALE,
    colorScheme,
    recordVideo: videoDir ? { dir: videoDir, size: { width: VIEWPORT.width, height: VIEWPORT.height } } : undefined,
  })
  return ctx
}

async function gotoSafely(
  page: import('playwright').Page,
  url: string,
  opts?: { waitUntil?: 'load' | 'domcontentloaded' | 'networkidle'; timeout?: number },
): Promise<{ ok: boolean; status: number; finalUrl: string }> {
  // first try networkidle for clean static pages, fall back to 'load' for app routes that
  // never reach networkidle due to ongoing animations / websockets / streaming
  const primary = opts?.waitUntil ?? 'networkidle'
  const timeout = opts?.timeout ?? 25_000
  try {
    const resp = await page.goto(url, { waitUntil: primary, timeout })
    const status = resp?.status() ?? 0
    return { ok: status >= 200 && status < 400, status, finalUrl: page.url() }
  } catch {
    try {
      const resp = await page.goto(url, { waitUntil: 'load', timeout })
      const status = resp?.status() ?? 0
      return { ok: status >= 200 && status < 400, status, finalUrl: page.url() }
    } catch (e2) {
      console.log(`  goto failed for ${url}: ${(e2 as Error).message}`)
      return { ok: false, status: 0, finalUrl: page.url() }
    }
  }
}

async function waitForFontsAndPaint(page: import('playwright').Page): Promise<void> {
  try {
    await page.evaluate(() => (document as any).fonts?.ready)
    await page.waitForTimeout(400) // settle motion entrance animations
  } catch { /* ignore */ }
}

// ---------------------------------------------------------------------------
// phase: capture-static
// ---------------------------------------------------------------------------

type Target = {
  out: string                  // file path relative to OUT_DIR
  url: string
  description: string
  mode: 'fullpage' | 'locator'
  selector?: string            // for mode === 'locator'
  scrollIntoView?: string      // selector to scroll into view before capture
  omitBackground?: boolean
  setViewportHeight?: number   // override viewport height for very tall sections
  preAction?: (page: import('playwright').Page) => Promise<void>
}

function buildTargets(baseUrl: string): Target[] {
  // helper: section by index on /readers (HomepageContent reader-audience order is well-known)
  // 0=Hero, 1=Carousel, 2=MergedReader, 3=MergedVirgil, 4=MergedTrials,
  // 5=WorldMap, 6=MergedLibraryTimeline, 7=MergedSocial, 8=ReadingInsights,
  // 9=ReaderPricing, 10=FinalCTA
  const sec = (n: number) => `section >> nth=${n}`

  const t: Target[] = [
    // -------- HOMEPAGE / ABOUT -------------------------------------------
    { out: '03-homepage/01-hero-full.png',
      url: `${baseUrl}/`, description: 'Full hero — Barque of Dante painting + headline + CTA', mode: 'fullpage' },

    { out: '03-homepage/02-hero-text-only.png',
      url: `${baseUrl}/`, description: 'Hero headline + tagline (cropped over painting)',
      mode: 'locator', selector: 'h1 >> nth=0',
      preAction: async (p) => { await p.waitForTimeout(900) } }, // BlurFade reveal

    // wordmark from nav — capture against the scrolled-down (solid bg) state on /readers
    { out: '01-logos/wordmark-from-nav.png',
      url: `${baseUrl}/readers`, description: 'Tome wordmark from landing nav (scrolled, solid bg)',
      mode: 'locator', selector: 'nav a:has-text("Tome") >> nth=0',
      omitBackground: true,
      preAction: async (p) => { await p.evaluate(() => window.scrollTo(0, 200)); await p.waitForTimeout(500) } },

    // crisis / chart / decline counter / pillars are all orphaned in code — log MISSING below
    { out: '03-homepage/07-ortelius-map.png',
      url: `${baseUrl}/readers`, description: 'Ortelius world-map showcase (authors-by-country)',
      mode: 'locator', selector: sec(5), scrollIntoView: sec(5) },

    { out: '03-homepage/07b-painting-carousel.png',
      url: `${baseUrl}/readers`, description: 'Painting carousel (Marquee)',
      mode: 'locator', selector: sec(1), scrollIntoView: sec(1) },

    { out: '03-homepage/08-cta-section.png',
      url: `${baseUrl}/readers`, description: 'Final CTA — Begin your journey',
      mode: 'locator', selector: sec(10), scrollIntoView: sec(10) },

    { out: '03-homepage/09-readers-fullpage.png',
      url: `${baseUrl}/readers`, description: 'Reader landing — full marketing page (long stitch)',
      mode: 'fullpage' },

    // -------- READER (in-app reader pages) -------------------------------
    { out: '04-app-ui/01-reader-full.png',
      url: `${baseUrl}/reading`, description: 'In-app /reading view (may be auth-walled)', mode: 'fullpage' },

    { out: '04-app-ui/02-reader-with-virgil.png',
      url: `${baseUrl}/reading`, description: 'Reader with Virgil drawer triggered (best-effort)',
      mode: 'fullpage',
      preAction: async (p) => {
        // try to click any annotation marker / virgil trigger
        const candidates = ['[data-virgil-trigger]', 'button:has-text("Virgil")', '.annotation', '[role="button"]:has-text("Virgil")']
        for (const s of candidates) {
          const el = p.locator(s).first()
          if (await el.count() > 0) { try { await el.click({ timeout: 1500 }); break } catch { /* keep trying */ } }
        }
        await p.waitForTimeout(600)
      } },

    { out: '04-app-ui/03-virgil-annotation-card.png',
      url: `${baseUrl}/readers`, description: 'Virgil annotation card (Iliad patronymic example) — landing showcase',
      mode: 'locator', selector: sec(3), scrollIntoView: sec(3) },

    // -------- EDUCATOR ----------------------------------------------------
    { out: '04-app-ui/04-educator-dashboard.png',
      url: `${baseUrl}/educators`, description: 'Educator landing (full marketing page)', mode: 'fullpage' },

    { out: '04-app-ui/05-classroom-ui.png',
      url: `${baseUrl}/classroom`, description: 'Classroom UI (in-app — may show empty or auth state)', mode: 'fullpage' },

    // -------- LIBRARY -----------------------------------------------------
    { out: '04-app-ui/06-library-grid.png',
      url: `${baseUrl}/library/browse`, description: 'Library / book catalog grid', mode: 'fullpage' },

    { out: '04-app-ui/07-book-card.png',
      url: `${baseUrl}/library/browse`, description: 'Single book card (first in grid)',
      mode: 'locator', selector: '[data-href^="/book/"]',
      preAction: async (p) => {
        // wait for client-rendered grid to populate (BookCard uses data-href, not <a>)
        try { await p.waitForSelector('[data-href^="/book/"]', { timeout: 12_000 }) } catch {}
        await p.waitForTimeout(800)
      } },

    // -------- TRIAL / QUIZ ------------------------------------------------
    { out: '04-app-ui/08-trial-question.png',
      url: `${baseUrl}/readers`, description: 'Trial question UI (landing showcase — Homer "wine-dark sea" Q)',
      mode: 'locator', selector: sec(4), scrollIntoView: sec(4) },

    { out: '04-app-ui/09-reward-state.png',
      url: `${baseUrl}/readers`, description: 'Wisdom / Flames / Seals reward state (insights showcase)',
      mode: 'locator', selector: sec(8), scrollIntoView: sec(8) },

    { out: '04-app-ui/09b-seals-page.png',
      url: `${baseUrl}/seals`, description: 'In-app /seals page', mode: 'fullpage' },

    // -------- DASHBOARD --------------------------------------------------
    { out: '04-app-ui/10-user-dashboard.png',
      url: `${baseUrl}/dashboard`, description: 'In-app /dashboard with progress', mode: 'fullpage' },

    { out: '04-app-ui/11-flames-streak.png',
      url: `${baseUrl}/readers`, description: 'Flames + streak component (reading insights showcase, mid-phase)',
      mode: 'locator', selector: sec(8), scrollIntoView: sec(8),
      preAction: async (p) => {
        // wait one full cycle so the streak phase reveals
        await p.waitForTimeout(2200)
      } },
  ]

  return t
}

async function captureOne(page: import('playwright').Page, t: Target): Promise<void> {
  const dest = path.join(OUT_DIR, t.out)
  await ensureDir(path.dirname(dest))

  const nav = await gotoSafely(page, t.url)
  if (!nav.ok) {
    await recordCapture(t.out, t.url, 'missing', `route returned ${nav.status}`)
    return
  }
  // detect login-wall redirects (e.g. /login or /signup after navigating to /dashboard)
  if (/\/(login|signup|auth)(\/|$)/.test(new URL(nav.finalUrl).pathname) && !/\/(login|signup)$/.test(new URL(t.url).pathname)) {
    await recordCapture(t.out, t.url, 'auth-required', `redirected to ${nav.finalUrl}`)
    return
  }

  await waitForFontsAndPaint(page)

  if (t.scrollIntoView) {
    try {
      await page.locator(t.scrollIntoView).first().scrollIntoViewIfNeeded({ timeout: 5000 })
      await page.waitForTimeout(700) // let in-view-triggered motion settle
    } catch { /* selector may not exist */ }
  }
  if (t.preAction) {
    try { await t.preAction(page) } catch (e) { console.log(`  preAction threw: ${(e as Error).message}`) }
  }

  try {
    if (t.mode === 'fullpage') {
      await page.screenshot({ path: dest, fullPage: true, omitBackground: t.omitBackground ?? false })
    } else {
      const loc = page.locator(t.selector!).first()
      await loc.waitFor({ state: 'visible', timeout: 8000 })
      await loc.screenshot({ path: dest, omitBackground: t.omitBackground ?? false })
    }
    await recordCapture(t.out, t.url, 'ok', t.description)
  } catch (e) {
    await recordCapture(t.out, t.url, 'error', `screenshot failed: ${(e as Error).message}`)
  }
}

async function phaseCaptureStatic(baseUrl: string): Promise<void> {
  console.log(`capture-static phase: navigating from base ${baseUrl}`)
  const targets = buildTargets(baseUrl)
  const browser = await newBrowser()
  const ctx = await newContextWithViewport(browser)
  const page = await ctx.newPage()

  for (const t of targets) {
    console.log(`  → ${t.out}  (${t.url})`)
    await captureOne(page, t)
  }

  // record MISSING items the user explicitly listed (orphan / unbuilt UI)
  const missingHomepage = [
    ['03-homepage/03-crisis-section.png', 'Reading-crisis section with NEA decline counter — components exist (AnimatedCounter) but are NOT mounted on `/` (orphaned per code comment).'],
    ['03-homepage/04-naep-chart.png',     'NAEP line chart — `AnimatedLineChart.tsx` is orphaned per code comment ("Not imported by `/` after the summary-page rewrite").'],
    ['03-homepage/05-decline-counter.png','Decline counter standalone — `AnimatedCounter.tsx` is orphaned (same).'],
    ['03-homepage/06-solution-pillars.png','Three-pillar solution section — no such section exists in current codebase.'],
  ]
  for (const [rel, note] of missingHomepage) {
    await recordCapture(rel, baseUrl, 'missing', note)
  }

  await ctx.close()
  await browser.close()
  await saveCaptureLog()
  console.log('capture-static phase complete')
}

// ---------------------------------------------------------------------------
// phase: capture-anim
// ---------------------------------------------------------------------------

type AnimTarget = {
  name: string                 // used in filenames + folders
  url: string
  selector?: string            // selector to scroll into view (and crop video region)
  description: string
}

function buildAnimTargets(baseUrl: string): AnimTarget[] {
  return [
    { name: 'hero-bounce',       url: `${baseUrl}/`,         description: 'Hero ChevronDown bounce + BlurFade reveal' },
    { name: 'painting-carousel', url: `${baseUrl}/readers`,  selector: 'section >> nth=1', description: 'Marquee painting carousel' },
    { name: 'trials-phase',      url: `${baseUrl}/readers`,  selector: 'section >> nth=4', description: 'Trial question → select → correct → wisdom' },
    { name: 'world-map',         url: `${baseUrl}/readers`,  selector: 'section >> nth=5', description: 'Authors-by-country world-map reveal' },
    { name: 'reading-insights',  url: `${baseUrl}/readers`,  selector: 'section >> nth=8', description: 'Reading insights — chart → streak → seals' },
  ]
}

async function captureFrameSequence(page: import('playwright').Page, t: AnimTarget): Promise<number> {
  const folder = path.join(OUT_DIR, SUBFOLDERS.animations, t.name)
  await ensureDir(folder)

  const nav = await gotoSafely(page, t.url)
  if (!nav.ok) {
    await recordCapture(`${SUBFOLDERS.animations}/${t.name}/`, t.url, 'missing', `route returned ${nav.status}`)
    return 0
  }
  await waitForFontsAndPaint(page)

  if (t.selector) {
    try { await page.locator(t.selector).first().scrollIntoViewIfNeeded({ timeout: 5000 }) }
    catch { /* keep going */ }
    await page.waitForTimeout(300) // trigger in-view animations
  }

  // 8 frames at 250ms intervals = 2 seconds
  let written = 0
  for (let i = 1; i <= 8; i++) {
    const dest = path.join(folder, `frame-${String(i).padStart(2, '0')}.png`)
    try {
      if (t.selector) {
        const loc = page.locator(t.selector).first()
        await loc.screenshot({ path: dest })
      } else {
        await page.screenshot({ path: dest, fullPage: false })
      }
      written++
    } catch (e) {
      console.log(`    frame ${i} failed: ${(e as Error).message}`)
    }
    if (i < 8) await page.waitForTimeout(250)
  }
  await recordCapture(`${SUBFOLDERS.animations}/${t.name}/frame-01.png`, t.url, written > 0 ? 'ok' : 'error',
                      `${written}/8 frames — ${t.description}`)
  return written
}

async function captureVideo(t: AnimTarget): Promise<{ webm?: string; mp4?: string }> {
  const browser = await newBrowser()
  const videoDir = path.join(OUT_DIR, SUBFOLDERS.animations, 'videos')
  await ensureDir(videoDir)

  const ctx = await newContextWithViewport(browser, { videoDir })
  const page = await ctx.newPage()
  const nav = await gotoSafely(page, t.url)
  if (!nav.ok) { await ctx.close(); await browser.close(); return {} }
  await waitForFontsAndPaint(page)
  if (t.selector) {
    try { await page.locator(t.selector).first().scrollIntoViewIfNeeded({ timeout: 5000 }) } catch {}
  }
  await page.waitForTimeout(4000) // record 4 seconds
  const videoHandle = page.video()
  await page.close()
  await ctx.close()
  await browser.close()

  if (!videoHandle) return {}
  const tmpPath = await videoHandle.path()
  const webmName = `${t.name}.webm`
  const webmDest = path.join(videoDir, webmName)
  try { await fs.rename(tmpPath, webmDest) } catch (e) {
    // cross-device — fall back to copy
    try { await fs.copyFile(tmpPath, webmDest); await fs.unlink(tmpPath) } catch {}
  }
  await recordCapture(`${SUBFOLDERS.animations}/videos/${webmName}`, t.url, 'ok', `4s recording — ${t.description}`)

  // optional MP4 conversion via ffmpeg if present (try playwright bundled, then system)
  const mp4Name = `${t.name}.mp4`
  const mp4Dest = path.join(videoDir, mp4Name)
  const ffmpegBin = await resolveFfmpeg()
  let ok = false
  if (ffmpegBin) {
    ok = await runCmd(ffmpegBin, ['-y', '-i', webmDest, '-c:v', 'libx264', '-crf', '23', '-preset', 'medium', '-pix_fmt', 'yuv420p', mp4Dest])
  }
  if (ok) await recordCapture(`${SUBFOLDERS.animations}/videos/${mp4Name}`, t.url, 'ok', `h.264 conversion of webm (ffmpeg: ${ffmpegBin ? 'bundled' : 'none'})`)
  else    await recordCapture(`${SUBFOLDERS.animations}/videos/${mp4Name}`, t.url, 'missing', ffmpegBin ? 'ffmpeg conversion failed' : 'ffmpeg not available — webm only')

  return { webm: webmDest, mp4: ok ? mp4Dest : undefined }
}

function runCmd(cmd: string, args: string[]): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { stdio: 'ignore' })
    child.on('error', () => resolve(false))
    child.on('close', (code) => resolve(code === 0))
  })
}

// playwright bundles ffmpeg under ~/Library/Caches/ms-playwright/ffmpeg-*/ffmpeg-mac;
// fall back to system ffmpeg if not found
async function resolveFfmpeg(): Promise<string | null> {
  const cache = path.join(process.env.HOME ?? '', 'Library/Caches/ms-playwright')
  try {
    const entries = await fs.readdir(cache)
    for (const e of entries) {
      if (e.startsWith('ffmpeg-')) {
        const candidate = path.join(cache, e, 'ffmpeg-mac')
        try { await fs.access(candidate); return candidate } catch {}
      }
    }
  } catch {}
  // try system path
  return new Promise((resolve) => {
    const which = spawn('which', ['ffmpeg'])
    let out = ''
    which.stdout.on('data', (d) => { out += String(d) })
    which.on('close', (code) => resolve(code === 0 ? out.trim() : null))
    which.on('error', () => resolve(null))
  })
}

async function phaseCaptureAnim(baseUrl: string): Promise<void> {
  console.log(`capture-anim phase: frame sequences + 4s videos for animated components`)
  const targets = buildAnimTargets(baseUrl)
  CAPTURE_LOG.push(...await loadCaptureLog())

  // frame sequences share one browser
  const browser = await newBrowser()
  const ctx = await newContextWithViewport(browser)
  const page = await ctx.newPage()
  for (const t of targets) {
    console.log(`  → frames: ${t.name}  (${t.url})`)
    await captureFrameSequence(page, t)
  }
  await ctx.close()
  await browser.close()

  // each video needs its own context (one video file per context)
  for (const t of targets) {
    console.log(`  → video: ${t.name}`)
    await captureVideo(t)
  }

  await saveCaptureLog()
  console.log('capture-anim phase complete')
}

// ---------------------------------------------------------------------------
// phase: render-brand
// ---------------------------------------------------------------------------

const BRAND_TOKENS = {
  // exact hex from src/styles/globals.css
  background: '#FAFAF8',
  foreground: '#1A1816',
  card:       '#FFFFFF',
  border:     '#DDD9CF',
  muted:      '#F2F0EC',
  // semantic
  gold:       '#B8924A',
  goldHover:  '#9A7A38',
  goldMuted:  '#F2EAD0',
  indigo:     '#6366F1',
  indigoHover:'#4F46E5',
  indigoMuted:'#EEF0FB',
  green:      '#2D9A47',
  red:        '#C84A52',
  blue:       '#2E75B6',
  amber:      '#C8801F',
  flameStreak:'#D14820',
  // fonts
  fontDisplay:'Playfair Display',
  fontSans:   'Plus Jakarta Sans',
  fontSerif:  'Literata',
} as const

function brandPosterHtml(): string {
  const t = BRAND_TOKENS
  return `<!doctype html>
<html><head>
<meta charset="utf-8"/>
<title>Tome — brand system</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Literata:ital,wght@0,400;0,500;0,700;1,400&display=swap" rel="stylesheet"/>
<style>
  :root {
    --bg: ${t.background}; --fg: ${t.foreground}; --card: ${t.card}; --border: ${t.border}; --muted: ${t.muted};
    --gold: ${t.gold}; --indigo: ${t.indigo};
  }
  *, *::before, *::after { box-sizing: border-box; }
  html, body { margin: 0; padding: 0; background: var(--bg); color: var(--fg); }
  body { font-family: '${t.fontSans}', system-ui, sans-serif; padding: 96px 80px 64px; min-height: 1080px; }
  .stack { display: grid; gap: 56px; max-width: 1760px; margin: 0 auto; }
  .wordmark { font-family: '${t.fontDisplay}', serif; font-size: 192px; font-weight: 900; letter-spacing: -0.04em; color: var(--gold); line-height: 1; }
  .wordmark sup { font-family: '${t.fontSerif}', serif; font-style: italic; font-size: 28px; color: var(--indigo); vertical-align: super; margin-left: 6px; font-weight: 500; }
  .tagline { font-family: '${t.fontDisplay}', serif; font-size: 36px; line-height: 1.15; color: var(--fg); margin-top: 8px; max-width: 880px; }
  h2.section { font-family: '${t.fontDisplay}', serif; font-size: 14px; letter-spacing: 0.16em; text-transform: uppercase; color: #7A7468; margin: 0 0 16px; font-weight: 600; }
  /* swatches */
  .swatches { display: grid; grid-template-columns: repeat(6, 1fr); gap: 16px; }
  .swatch { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 16px; }
  .swatch .chip { width: 100%; height: 96px; border-radius: 10px; }
  .swatch .name { font-weight: 600; font-size: 14px; margin-top: 10px; }
  .swatch .hex { font-family: ui-monospace, monospace; font-size: 12px; color: #7A7468; margin-top: 2px; }
  /* type specimens */
  .type { display: grid; grid-template-columns: 220px 1fr; gap: 24px; align-items: baseline; padding: 20px 0; border-bottom: 1px solid var(--border); }
  .type .label { font-size: 13px; color: #7A7468; text-transform: uppercase; letter-spacing: 0.12em; }
  .type .specimen { font-size: 36px; line-height: 1.15; }
  .type .specimen.body { font-size: 17px; line-height: 1.55; max-width: 760px; color: #2A2620; }
  /* sample components */
  .components { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .card-sample { background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 22px; border-radius: 999px; font-weight: 600; font-size: 14px; border: 1px solid transparent; cursor: pointer; }
  .btn-primary { background: var(--gold); color: white; }
  .btn-secondary { background: white; color: var(--fg); border-color: var(--border); }
  .btn-ghost { background: var(--indigo); color: white; }
  .input { display: block; width: 100%; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); background: #F7F5F1; font-size: 14px; }
  .pill { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 999px; font-size: 12px; font-weight: 600; background: ${t.indigoMuted}; color: var(--indigo); }
</style>
</head>
<body>
  <div class="stack">
    <div>
      <div class="wordmark">Tome<sup>Beta</sup></div>
      <div class="tagline">The canon, in your pocket. <span style="color: ${t.indigo};">Virgil</span> in the margin, your library on every device.</div>
    </div>

    <section>
      <h2 class="section">Color — semantic palette</h2>
      <div class="swatches">
        ${[
          ['Gold (brand)',     t.gold],
          ['Gold hover',       t.goldHover],
          ['Indigo (Virgil)',  t.indigo],
          ['Indigo hover',     t.indigoHover],
          ['Warm stone',       t.background],
          ['Border stone',     t.border],
          ['Green (success)',  t.green],
          ['Red (destructive)',t.red],
          ['Blue (info)',      t.blue],
          ['Amber',            t.amber],
          ['Flame streak',     t.flameStreak],
          ['Foreground',       t.foreground],
        ].map(([n, h]) => `
          <div class="swatch">
            <div class="chip" style="background: ${h}; border: 1px solid ${h === t.background || h === '#FFFFFF' ? t.border : 'transparent'};"></div>
            <div class="name">${n}</div>
            <div class="hex">${(h as string).toUpperCase()}</div>
          </div>`).join('')}
      </div>
    </section>

    <section>
      <h2 class="section">Type — three voices</h2>
      <div class="type">
        <div class="label">Display · ${t.fontDisplay}</div>
        <div class="specimen" style="font-family: '${t.fontDisplay}', serif; font-weight: 900;">Read the books that shaped the world.</div>
      </div>
      <div class="type">
        <div class="label">Serif · ${t.fontSerif}</div>
        <div class="specimen body" style="font-family: '${t.fontSerif}', serif;">In every grain of sand I see the divine handwriting of a patient hand. The shoreline remembers the sea, and the sea forgets nothing.</div>
      </div>
      <div class="type">
        <div class="label">Sans · ${t.fontSans}</div>
        <div class="specimen body" style="font-family: '${t.fontSans}', sans-serif;">Tap any annotation to open Virgil's drawer — a scholarly note up top, a live chat at the bottom. Highlight what stops you, leave a note for your future self.</div>
      </div>
    </section>

    <section>
      <h2 class="section">Components — primitives</h2>
      <div class="components">
        <div class="card-sample">
          <div style="font-family: '${t.fontDisplay}', serif; font-size: 22px; font-weight: 700; margin-bottom: 6px;">Buttons</div>
          <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-top: 10px;">
            <button class="btn btn-primary">Start reading</button>
            <button class="btn btn-secondary">For Educators</button>
            <button class="btn btn-ghost">Ask Virgil</button>
          </div>
        </div>
        <div class="card-sample">
          <div style="font-family: '${t.fontDisplay}', serif; font-size: 22px; font-weight: 700; margin-bottom: 12px;">Input</div>
          <input class="input" placeholder="Search 1,000+ books in the canon" />
          <div style="margin-top: 14px; display: flex; gap: 8px;">
            <span class="pill">Ⓥ Virgil</span>
            <span class="pill" style="background: ${t.goldMuted}; color: ${t.goldHover};">⛯ Trial</span>
            <span class="pill" style="background: rgba(209,72,32,0.10); color: ${t.flameStreak};">🜂 14-day Flame</span>
          </div>
        </div>
        <div class="card-sample">
          <div style="font-family: '${t.fontDisplay}', serif; font-size: 22px; font-weight: 700;">Annotation card</div>
          <div style="font-family: '${t.fontSerif}', serif; font-size: 15px; line-height: 1.55; margin-top: 10px; color: ${t.foreground};">
            <em style="color: ${t.indigo}; font-style: normal; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em;">Patronymic</em><br/>
            "Son of Peleus" is an epithet identifying Achilles by his father. Homer uses patronymics to remind the audience of inherited glory or doom.
          </div>
        </div>
      </div>
    </section>
  </div>
</body></html>`
}

async function phaseRenderBrand(_baseUrl: string): Promise<void> {
  console.log('render-brand phase: rendering brand poster + swatches')
  CAPTURE_LOG.push(...await loadCaptureLog())
  await ensureDir(path.join(OUT_DIR, SUBFOLDERS.brand))

  const browser = await newBrowser()
  const ctx = await newContextWithViewport(browser)
  const page = await ctx.newPage()

  // poster html lives in pitch-deck-assets so we can inspect it later
  const posterHtmlPath = path.join(OUT_DIR, SUBFOLDERS.brand, '_brand-poster.html')
  await fs.writeFile(posterHtmlPath, brandPosterHtml(), 'utf8')

  await page.setViewportSize({ width: 1920, height: 1500 })
  await page.goto('file://' + posterHtmlPath, { waitUntil: 'networkidle' })
  await waitForFontsAndPaint(page)
  await page.waitForTimeout(800)

  const posterDest = path.join(OUT_DIR, SUBFOLDERS.brand, '01-brand-system-poster.png')
  await page.screenshot({ path: posterDest, fullPage: true })
  await recordCapture(`${SUBFOLDERS.brand}/01-brand-system-poster.png`, posterHtmlPath, 'ok', 'Full brand-system poster')

  // individual swatches: render solid-color tiles + hex label
  const swatches: { out: string; label: string; hex: string }[] = [
    { out: '02-color-indigo.png',     label: 'Indigo',     hex: BRAND_TOKENS.indigo },
    { out: '03-color-gold.png',       label: 'Gold',       hex: BRAND_TOKENS.gold },
    { out: '04-color-warm-stone.png', label: 'Warm stone', hex: BRAND_TOKENS.background },
  ]
  for (const s of swatches) {
    const html = `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@900&family=Plus+Jakarta+Sans:wght@600&display=swap" rel="stylesheet"/>
<style>html,body{margin:0;height:100%;font-family:'Plus Jakarta Sans',system-ui;}
body{display:flex;flex-direction:column;justify-content:flex-end;padding:80px;background:${s.hex};color:${s.hex === BRAND_TOKENS.background ? BRAND_TOKENS.foreground : '#FFFFFF'};}
h1{font-family:'Playfair Display',serif;font-size:128px;margin:0 0 8px;font-weight:900;letter-spacing:-0.02em;}
p{margin:0;font-family:ui-monospace,monospace;font-size:36px;opacity:0.85;}</style></head>
<body><h1>${s.label}</h1><p>${s.hex.toUpperCase()}</p></body></html>`
    const tmp = path.join(OUT_DIR, SUBFOLDERS.brand, `_${s.out}.html`)
    await fs.writeFile(tmp, html, 'utf8')
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('file://' + tmp, { waitUntil: 'networkidle' })
    await waitForFontsAndPaint(page)
    const dest = path.join(OUT_DIR, SUBFOLDERS.brand, s.out)
    await page.screenshot({ path: dest, fullPage: false })
    await recordCapture(`${SUBFOLDERS.brand}/${s.out}`, tmp, 'ok', `${s.label} swatch (${s.hex})`)
  }

  // typography specimen
  const typeHtml = `<!doctype html><html><head><meta charset="utf-8"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Plus+Jakarta+Sans:wght@400;500;700&family=Literata:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet"/>
<style>html,body{margin:0;background:${BRAND_TOKENS.background};color:${BRAND_TOKENS.foreground};}
body{padding:80px;font-family:'Plus Jakarta Sans',system-ui;}
.row{padding:28px 0;border-bottom:1px solid ${BRAND_TOKENS.border};}
.label{font-size:12px;letter-spacing:0.16em;text-transform:uppercase;color:#7A7468;margin-bottom:10px;}
.disp{font-family:'Playfair Display',serif;font-size:84px;font-weight:900;letter-spacing:-0.02em;line-height:1.05;}
.serif{font-family:'Literata',serif;font-size:24px;line-height:1.5;max-width:1200px;}
.sans{font-family:'Plus Jakarta Sans',sans-serif;font-size:20px;line-height:1.55;max-width:1200px;}
</style></head><body>
<div class="row"><div class="label">Display · Playfair Display</div><div class="disp">The canon, in your pocket.</div></div>
<div class="row"><div class="label">Serif · Literata</div><div class="serif">In every grain of sand I see the divine handwriting of a patient hand. The shoreline remembers the sea, and the sea forgets nothing.</div></div>
<div class="row"><div class="label">Sans · Plus Jakarta Sans</div><div class="sans">Tap any annotation to open Virgil's drawer — a scholarly note up top, a live chat at the bottom. Highlight what stops you, leave a note for your future self.</div></div>
</body></html>`
  const typeTmp = path.join(OUT_DIR, SUBFOLDERS.brand, '_05-typography-specimen.html')
  await fs.writeFile(typeTmp, typeHtml, 'utf8')
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.goto('file://' + typeTmp, { waitUntil: 'networkidle' })
  await waitForFontsAndPaint(page)
  const typeDest = path.join(OUT_DIR, SUBFOLDERS.brand, '05-typography-specimen.png')
  await page.screenshot({ path: typeDest, fullPage: true })
  await recordCapture(`${SUBFOLDERS.brand}/05-typography-specimen.png`, typeTmp, 'ok', 'Typography specimen — display, serif, sans')

  await ctx.close()
  await browser.close()
  await saveCaptureLog()
  console.log('render-brand phase complete')
}

// ---------------------------------------------------------------------------
// phase: slide-mapping (append SLIDE MAPPING + summary to MANIFEST.md)
// ---------------------------------------------------------------------------

async function phaseSlideMapping(): Promise<void> {
  console.log('slide-mapping phase: appending SLIDE MAPPING + summary to MANIFEST.md')
  const log = await loadCaptureLog()

  // group log by phase
  const homepage = log.filter(l => l.rel.startsWith('03-homepage/'))
  const appUi    = log.filter(l => l.rel.startsWith('04-app-ui/'))
  const anim     = log.filter(l => l.rel.startsWith('05-animations/'))
  const brand    = log.filter(l => l.rel.startsWith('06-brand-system/'))
  const logos    = log.filter(l => l.rel.startsWith('01-logos/'))

  const lines: string[] = []
  lines.push('')
  lines.push('---')
  lines.push('')
  lines.push('## Phase 2 captures — homepage / app UI')
  lines.push('')
  lines.push('| File | Source | Status | Note |')
  lines.push('|---|---|---|---|')
  for (const l of [...homepage, ...appUi, ...logos.filter(l => l.rel === '01-logos/wordmark-from-nav.png')]) {
    lines.push(`| \`${l.rel}\` | ${l.source} | **${l.status}** | ${l.note ?? ''} |`)
  }
  lines.push('')

  lines.push('## Phase 3 — animations')
  lines.push('')
  lines.push('| File | Source | Status | Note |')
  lines.push('|---|---|---|---|')
  for (const l of anim) {
    lines.push(`| \`${l.rel}\` | ${l.source} | **${l.status}** | ${l.note ?? ''} |`)
  }
  lines.push('')

  lines.push('## Phase 4 — brand system')
  lines.push('')
  lines.push('| File | Source | Status | Note |')
  lines.push('|---|---|---|---|')
  for (const l of brand) {
    lines.push(`| \`${l.rel}\` | ${l.source} | **${l.status}** | ${l.note ?? ''} |`)
  }
  lines.push('')

  lines.push('## SLIDE MAPPING')
  lines.push('')
  lines.push('Mapping of captured assets to investor-deck slides. `MISSING` means the underlying UI is not yet built and needs hand-build in Pitch.')
  lines.push('')
  lines.push('```')
  lines.push('Slide 1 (Cover):')
  lines.push('  - 02-paintings/barque-of-dante.jpg')
  lines.push('  - 01-logos/tome-wordmark.svg            (or tome-wordmark-dark.svg for dark cover)')
  lines.push('  - 01-logos/tome-lockup-stacked.svg      (alternate full lockup)')
  lines.push('')
  lines.push('Slide 2 (Problem — reading crisis):')
  lines.push('  - 03-homepage/04-naep-chart.png         MISSING (component orphaned in code)')
  lines.push('  - 03-homepage/05-decline-counter.png    MISSING (component orphaned in code)')
  lines.push('  - fallback: 03-homepage/03-crisis-section.png  MISSING')
  lines.push('  - usable instead: 03-homepage/01-hero-full.png  ("We are in a reading crisis." hero)')
  lines.push('')
  lines.push('Slide 3 (Opportunity hidden in problem):')
  lines.push('  - (no asset yet — needs hand-build in Pitch)')
  lines.push('')
  lines.push('Slide 4 (Why now):')
  lines.push('  - (icons only — no asset capture)')
  lines.push('')
  lines.push('Slide 5 (Solution):')
  lines.push('  - 03-homepage/06-solution-pillars.png   MISSING (no three-pillar section in current code)')
  lines.push('  - 04-app-ui/01-reader-full.png')
  lines.push('  - 04-app-ui/06-library-grid.png')
  lines.push('  - 04-app-ui/10-user-dashboard.png')
  lines.push('')
  lines.push('Slide 6 (Product demo):')
  lines.push('  - 04-app-ui/02-reader-with-virgil.png   ← MOST IMPORTANT')
  lines.push('  - alt: 04-app-ui/03-virgil-annotation-card.png  (Iliad patronymic showcase from /readers)')
  lines.push('')
  lines.push('Slide 7 (Defensibility):')
  lines.push('  - 04-app-ui/03-virgil-annotation-card.png')
  lines.push('  - 03-homepage/07-ortelius-map.png      (proof: depth across the canon)')
  lines.push('')
  lines.push('Slide 8 (Market size):')
  lines.push('  - (no asset — chart needs to be built separately)')
  lines.push('')
  lines.push('Slide 9 (Business model):')
  lines.push('  - (typography only — no asset capture)')
  lines.push('')
  lines.push('Slide 9b (Competition 2x2):')
  lines.push('  - (no asset — matrix needs to be built separately)')
  lines.push('')
  lines.push('Slide 10 (Traction):')
  lines.push('  - 03-homepage/01-hero-full.png         (homepage screenshot)')
  lines.push('  - 04-app-ui/06-library-grid.png        (proof of catalog — 800+ covers visible)')
  lines.push('  - 04-app-ui/04-educator-dashboard.png  (educator landing as second persona)')
  lines.push('')
  lines.push('Slide 11 (Team):')
  lines.push('  - 06-brand-system/01-brand-system-poster.png   (as backdrop)')
  lines.push('')
  lines.push('Slide 12 (Ask):')
  lines.push('  - 02-paintings/creation-of-adam.jpg     (or 02-paintings/school-of-athens.jpg for educators close)')
  lines.push('')
  lines.push('Bonus / B-roll for animated slides (drop the .mp4 if present, fall back to .webm or frame sequences):')
  lines.push('  - 05-animations/videos/painting-carousel.mp4')
  lines.push('  - 05-animations/videos/trials-phase.mp4')
  lines.push('  - 05-animations/videos/reading-insights.mp4')
  lines.push('```')
  lines.push('')

  // summary
  const counts = { ok: 0, missing: 0, error: 0, auth: 0 }
  for (const l of log) {
    if (l.status === 'ok') counts.ok++
    else if (l.status === 'missing') counts.missing++
    else if (l.status === 'auth-required') counts.auth++
    else counts.error++
  }
  let totalBytes = 0
  for (const l of log) if (l.bytes) totalBytes += l.bytes

  lines.push('## Run summary')
  lines.push('')
  lines.push(`- Captures attempted: **${log.length}**`)
  lines.push(`- ok: **${counts.ok}**, missing/orphan: **${counts.missing}**, auth-walled: **${counts.auth}**, errors: **${counts.error}**`)
  lines.push(`- Captured bytes: **${formatBytes(totalBytes)}**`)
  lines.push('')

  const existing = await fs.readFile(MANIFEST_PATH, 'utf8')
  // strip any prior phase 2+ section if re-running
  const cut = existing.split('\n## Phase 2 captures —')[0]
  await fs.writeFile(MANIFEST_PATH, cut.trimEnd() + '\n' + lines.join('\n'), 'utf8')

  // print final console summary
  let folderTotal = 0
  for (const f of await walk(OUT_DIR)) {
    try { folderTotal += (await fs.stat(f)).size } catch {}
  }
  console.log('')
  console.log('================================================================')
  console.log('PITCH DECK ASSET PIPELINE — RUN SUMMARY')
  console.log('================================================================')
  console.log(`folder:      ${OUT_DIR}`)
  console.log(`folder size: ${formatBytes(folderTotal)}`)
  console.log(`captures:    ${log.length} attempted (${counts.ok} ok, ${counts.missing} missing, ${counts.auth} auth-walled, ${counts.error} errors)`)
  console.log('')
  console.log('items still missing — need to be built before deck is complete:')
  for (const l of log) if (l.status === 'missing') console.log(`  ✗ ${l.rel}  — ${l.note ?? ''}`)
  for (const l of log) if (l.status === 'auth-required') console.log(`  ⊗ ${l.rel}  (auth-walled) — ${l.note ?? ''}`)
  for (const l of log) if (l.status === 'error') console.log(`  ! ${l.rel}  (error) — ${l.note ?? ''}`)
  console.log('')
  console.log(`open in finder:  open "${OUT_DIR}"`)
  console.log('================================================================')
}

// ---------------------------------------------------------------------------
// entrypoint
// ---------------------------------------------------------------------------

function getArg(name: string, fallback: string): string {
  const prefix = `--${name}=`
  for (const a of process.argv.slice(2)) if (a.startsWith(prefix)) return a.slice(prefix.length)
  return fallback
}

async function main(): Promise<void> {
  const sub = process.argv[2] ?? 'audit'
  const baseUrl = getArg('base-url', 'http://localhost:3000')
  console.log(`base url: ${baseUrl}`)

  switch (sub) {
    case 'audit':           await phaseAudit(); break
    case 'capture-static':  await phaseCaptureStatic(baseUrl); break
    case 'capture-anim':    await phaseCaptureAnim(baseUrl); break
    case 'render-brand':    await phaseRenderBrand(baseUrl); break
    case 'slide-mapping':   await phaseSlideMapping(); break
    case 'all':
      await phaseAudit()
      await phaseCaptureStatic(baseUrl)
      await phaseCaptureAnim(baseUrl)
      await phaseRenderBrand(baseUrl)
      await phaseSlideMapping()
      break
    default:
      console.error(`unknown subcommand: ${sub}`)
      process.exit(2)
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
