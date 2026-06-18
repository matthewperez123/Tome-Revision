#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const TARGET_WIDTH = 1024
const TARGET_HEIGHT = 1536
const THUMB_WIDTH = 512
const THUMB_HEIGHT = 768

const DEFAULT_SOURCE_DIR = "public/covers/tome/source"
const DEFAULT_OUT_DIR = "public/covers/tome/generated"
const DEFAULT_DATA_FILE = "src/data/generated/tome-generated-cover-paths.ts"

function parseArgs(argv) {
  const options = {
    source: DEFAULT_SOURCE_DIR,
    out: DEFAULT_OUT_DIR,
    data: DEFAULT_DATA_FILE,
    reviewCount: 96,
    allowPaperbackSource: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]

    if ((arg === "--source" || arg === "-s") && next) {
      options.source = next
      index += 1
    } else if ((arg === "--out" || arg === "-o") && next) {
      options.out = next
      index += 1
    } else if (arg === "--data" && next) {
      options.data = next
      index += 1
    } else if (arg === "--review-count" && next) {
      options.reviewCount = Number.parseInt(next, 10)
      index += 1
    } else if (arg === "--allow-paperback-source") {
      options.allowPaperbackSource = true
    } else if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

function printHelp() {
  console.log(`Prepare textless Tome app cover assets.

Usage:
  node scripts/prepare-tome-generated-covers.mjs [options]

Put final textless generated images in:
  ${DEFAULT_SOURCE_DIR}/<book-id>.png

Options:
  --source <dir>        Source folder of textless generated covers.
  --out <dir>           Output folder. Default: ${DEFAULT_OUT_DIR}
  --data <file>         Generated TypeScript path index. Default: ${DEFAULT_DATA_FILE}
  --review-count <n>    Number of covers shown in the review sheet.
`)
}

function isPaperbackSource(source) {
  return path.normalize(source) === path.normalize("public/covers/covers")
}

async function listImageFiles(sourceDir) {
  try {
    const entries = await fs.readdir(sourceDir, { withFileTypes: true })
    const byBookId = new Map()
    const extensionPriority = new Map([
      [".png", 0],
      [".jpg", 1],
      [".jpeg", 1],
      [".webp", 2],
    ])

    const files = entries
      .filter((entry) => entry.isFile() && /\.(jpe?g|png|webp)$/i.test(entry.name))
      .map((entry) => path.join(sourceDir, entry.name))
      .sort((a, b) => a.localeCompare(b))

    for (const file of files) {
      const bookId = bookIdFromFile(file)
      const existing = byBookId.get(bookId)
      const priority = extensionPriority.get(path.extname(file).toLowerCase()) ?? 99
      const existingPriority = existing
        ? extensionPriority.get(path.extname(existing).toLowerCase()) ?? 99
        : 99

      if (!existing || priority < existingPriority) {
        byBookId.set(bookId, file)
      }
    }

    return Array.from(byBookId.values())
      .sort((a, b) => a.localeCompare(b))
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return []
    }
    throw error
  }
}

function bookIdFromFile(file) {
  return path.basename(file).replace(/\.(jpe?g|png|webp)$/i, "")
}

async function renderCover(sourcePath, imagePath, thumbPath) {
  await sharp(sourcePath)
    .rotate()
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "cover",
      position: sharp.strategy.attention,
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: 92, mozjpeg: true })
    .toFile(imagePath)

  await sharp(imagePath)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, {
      fit: "cover",
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(thumbPath)
}

async function makeReviewSheet(entries, outDir, reviewCount) {
  const sheetEntries = entries.slice(0, reviewCount)
  if (sheetEntries.length === 0) return undefined

  const tileWidth = 128
  const tileHeight = 192
  const labelHeight = 22
  const columns = 8
  const gap = 14
  const padding = 20
  const rows = Math.ceil(sheetEntries.length / columns)
  const width = padding * 2 + columns * tileWidth + (columns - 1) * gap
  const height = padding * 2 + rows * (tileHeight + labelHeight) + (rows - 1) * gap
  const composites = []

  for (let index = 0; index < sheetEntries.length; index += 1) {
    const entry = sheetEntries[index]
    const col = index % columns
    const row = Math.floor(index / columns)
    const left = padding + col * (tileWidth + gap)
    const top = padding + row * (tileHeight + labelHeight + gap)
    const thumb = await sharp(entry.thumbPath)
      .resize(tileWidth, tileHeight, { fit: "cover" })
      .toBuffer()
    const label = Buffer.from(
      `<svg width="${tileWidth}" height="${labelHeight}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f4f1e8"/>
        <text x="0" y="14" font-family="Arial, sans-serif" font-size="10" fill="#2f3f3b">${escapeXml(entry.bookId).slice(0, 28)}</text>
      </svg>`,
    )

    composites.push({ input: thumb, left, top })
    composites.push({ input: label, left, top: top + tileHeight + 3 })
  }

  const sheetPath = path.join(outDir, "review-sheet.jpg")
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#f4f1e8",
    },
  })
    .composite(composites)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(sheetPath)

  return sheetPath
}

function writeGeneratedData(entries) {
  const rows = entries
    .map((entry) => {
      return `  ${JSON.stringify(entry.bookId)}: { image: ${JSON.stringify(entry.publicPath)}, thumbnail: ${JSON.stringify(entry.publicThumbPath)}, source: ${JSON.stringify(entry.publicSourcePath)} },`
    })
    .join("\n")

  return `// Auto-generated by scripts/prepare-tome-generated-covers.mjs - do not edit manually

export interface TomeGeneratedCoverPaths {
  image: string
  thumbnail: string
  source: string
}

export const TOME_GENERATED_COVER_PATHS: Record<string, TomeGeneratedCoverPaths> = {
${rows}
}

export function getTomeGeneratedCoverPaths(bookId: string): TomeGeneratedCoverPaths | undefined {
  return TOME_GENERATED_COVER_PATHS[bookId]
}
`
}

function toPublicPath(file) {
  const publicDir = path.resolve("public")
  const relative = path.relative(publicDir, path.resolve(file)).split(path.sep).join("/")
  return `/${relative}`
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

async function ensureDirs(options) {
  await fs.mkdir(options.source, { recursive: true })
  await fs.rm(path.join(options.out, "images"), { recursive: true, force: true })
  await fs.rm(path.join(options.out, "thumbs"), { recursive: true, force: true })
  await fs.rm(path.join(options.out, "review-sheet.jpg"), { force: true })
  await fs.mkdir(path.join(options.out, "images"), { recursive: true })
  await fs.mkdir(path.join(options.out, "thumbs"), { recursive: true })
  await fs.mkdir(path.dirname(options.data), { recursive: true })
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (isPaperbackSource(options.source) && !options.allowPaperbackSource) {
    throw new Error(
      "Refusing to prepare from public/covers/covers because those are paperback reference covers with text. Use public/covers/tome/source for final textless art.",
    )
  }

  await ensureDirs(options)

  const files = await listImageFiles(options.source)
  console.log(`Preparing ${files.length} textless Tome cover slots from ${options.source}`)

  const entries = []

  for (let index = 0; index < files.length; index += 1) {
    const sourcePath = files[index]
    const bookId = bookIdFromFile(sourcePath)
    const imagePath = path.join(options.out, "images", `${bookId}.jpg`)
    const thumbPath = path.join(options.out, "thumbs", `${bookId}.jpg`)

    await renderCover(sourcePath, imagePath, thumbPath)

    entries.push({
      bookId,
      sourcePath,
      imagePath,
      thumbPath,
      publicPath: toPublicPath(imagePath),
      publicThumbPath: toPublicPath(thumbPath),
      publicSourcePath: toPublicPath(sourcePath),
    })
  }

  entries.sort((a, b) => a.bookId.localeCompare(b.bookId))
  await fs.writeFile(options.data, writeGeneratedData(entries))

  const reviewSheetPath = await makeReviewSheet(entries, options.out, options.reviewCount)
  const manifest = {
    generatedAt: new Date().toISOString(),
    sourceDir: options.source,
    outputDir: options.out,
    dataFile: options.data,
    targetSize: { width: TARGET_WIDTH, height: TARGET_HEIGHT },
    thumbnailSize: { width: THUMB_WIDTH, height: THUMB_HEIGHT },
    count: entries.length,
    reviewSheetPath,
    entries: entries.map((entry) => ({
      bookId: entry.bookId,
      sourcePath: entry.sourcePath,
      publicPath: entry.publicPath,
      publicThumbPath: entry.publicThumbPath,
    })),
  }

  await fs.writeFile(path.join(options.out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)

  console.log("Done.")
  console.log(`Generated data: ${options.data}`)
  console.log(`Manifest: ${path.join(options.out, "manifest.json")}`)
  if (reviewSheetPath) console.log(`Review sheet: ${reviewSheetPath}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
