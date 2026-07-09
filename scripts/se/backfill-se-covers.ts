#!/usr/bin/env tsx
/**
 * backfill-se-covers.ts — pull each book's TEXT-FREE Standard Ebooks cover
 * painting into Supabase Storage and record cover_image_path + cover_colors.
 *
 * SE ships the artwork textless at images/cover.jpg (the title/author text lives
 * only in cover.svg, which we never fetch). We resize to a sane card/detail size,
 * upload to the public `covers` bucket at `{book.id}.jpg`, derive a 2-colour
 * blur-up palette, and write both back to the row.
 *
 * Flags:
 *   --limit N        process only the first N eligible books (sampling)
 *   --ids a,b,c      process only these book ids (sampling)
 *   --force          re-upload even if cover_image_path is already set
 *   --concurrency N  parallel workers (default 6)
 *
 * Idempotent/resumable: skips books that already have cover_image_path unless
 * --force. Failures are collected to reports/covers-failures.md.
 */
import { readFileSync, writeFileSync } from "node:fs"
import { createClient } from "@supabase/supabase-js"
import sharp from "sharp"

const URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!URL || !KEY) throw new Error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY (.env.local)")
const db = createClient(URL, KEY, { auth: { persistSession: false } })

const BUCKET = "covers"
const arg = (name: string) => {
  const i = process.argv.indexOf(name)
  return i >= 0 ? process.argv[i + 1] : undefined
}
const FORCE = process.argv.includes("--force")
const LIMIT = arg("--limit") ? parseInt(arg("--limit")!, 10) : undefined
const IDS = arg("--ids")?.split(",").map((s) => s.trim()).filter(Boolean)
const CONCURRENCY = arg("--concurrency") ? parseInt(arg("--concurrency")!, 10) : 6

const TARGET_W = 1080 // 2:3 -> 1080x1620; smaller than SE's 1400x2100, plenty crisp

interface Book {
  id: string
  se_slug: string
  cover_image_path: string | null
}

async function ensureBucket() {
  const { data: buckets, error } = await db.storage.listBuckets()
  if (error) throw error
  if (buckets?.some((b) => b.name === BUCKET)) return
  const { error: cErr } = await db.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: "5MB",
    allowedMimeTypes: ["image/jpeg"],
  })
  if (cErr) throw cErr
  console.log(`created public bucket "${BUCKET}"`)
}

async function loadBooks(): Promise<Book[]> {
  const out: Book[] = []
  let from = 0
  const n = 1000
  for (;;) {
    const { data, error } = await db
      .from("books")
      .select("id, se_slug, cover_image_path")
      .not("se_slug", "is", null)
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

const toHex = (r: number, g: number, b: number) =>
  "#" + [r, g, b].map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0")).join("")

/** Derive a 2-colour palette [dominant, secondary] for blur-up backgrounds. */
async function palette(buf: Buffer): Promise<string[]> {
  const { dominant } = await sharp(buf).stats()
  const primary = toHex(dominant.r, dominant.g, dominant.b)
  // secondary = average of a 2x2 downsample corner-ish, gives a complementary tone
  const raw = await sharp(buf).resize(2, 3, { fit: "fill" }).removeAlpha().raw().toBuffer()
  // pixel at (1,2) bottom-right region
  const idx = (2 * 2 + 1) * 3
  const secondary = toHex(raw[idx], raw[idx + 1], raw[idx + 2])
  return [primary, secondary]
}

const rawCoverUrl = (slug: string) =>
  `https://raw.githubusercontent.com/standardebooks/${slug}/master/images/cover.jpg`

async function fetchWithRetry(url: string, tries = 3): Promise<Buffer> {
  let lastErr: unknown
  for (let t = 0; t < tries; t++) {
    try {
      const res = await fetch(url)
      if (res.status === 404) throw new Error("404")
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return Buffer.from(await res.arrayBuffer())
    } catch (e) {
      lastErr = e
      if (String(e).includes("404")) throw e // don't retry a hard miss
      await new Promise((r) => setTimeout(r, 400 * (t + 1)))
    }
  }
  throw lastErr
}

interface Failure {
  id: string
  slug: string
  reason: string
}

async function processBook(b: Book): Promise<Failure | null> {
  try {
    const src = await fetchWithRetry(rawCoverUrl(b.se_slug))
    const jpg = await sharp(src)
      .resize(TARGET_W, null, { withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer()
    const colors = await palette(jpg)
    const path = `${b.id}.jpg`
    const { error: upErr } = await db.storage.from(BUCKET).upload(path, jpg, {
      contentType: "image/jpeg",
      upsert: true,
    })
    if (upErr) throw new Error(`upload: ${upErr.message}`)
    const publicUrl = db.storage.from(BUCKET).getPublicUrl(path).data.publicUrl
    const { error: dbErr } = await db
      .from("books")
      .update({ cover_image_path: publicUrl, cover_colors: colors })
      .eq("id", b.id)
    if (dbErr) throw new Error(`db: ${dbErr.message}`)
    return null
  } catch (e) {
    return { id: b.id, slug: b.se_slug, reason: String(e instanceof Error ? e.message : e) }
  }
}

async function run() {
  await ensureBucket()
  let books = await loadBooks()
  if (IDS) books = books.filter((b) => IDS.includes(b.id))
  if (!FORCE) books = books.filter((b) => !b.cover_image_path)
  if (LIMIT) books = books.slice(0, LIMIT)

  console.log(`processing ${books.length} book cover(s) — concurrency=${CONCURRENCY} force=${FORCE}`)
  const failures: Failure[] = []
  let done = 0
  let ok = 0

  const queue = [...books]
  async function worker() {
    for (;;) {
      const b = queue.shift()
      if (!b) return
      const f = await processBook(b)
      done++
      if (f) failures.push(f)
      else ok++
      if (done % 25 === 0 || done === books.length) {
        process.stdout.write(`\r${done}/${books.length} ok=${ok} fail=${failures.length}`)
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, books.length || 1) }, worker))
  process.stdout.write("\n")

  if (failures.length) {
    const lines = [
      `# SE cover backfill failures`,
      ``,
      `- generated: ${new Date().toISOString()}`,
      `- failures: ${failures.length}/${books.length}`,
      ``,
      ...failures.map((f) => `- \`${f.id}\` (\`${f.slug}\`): ${f.reason}`),
    ]
    writeFileSync("reports/covers-failures.md", lines.join("\n"))
    console.log(`wrote reports/covers-failures.md (${failures.length} failures)`)
  } else {
    console.log(`no failures.`)
  }
  console.log(`DONE: uploaded ${ok}/${books.length} covers.`)
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
