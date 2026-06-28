#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"

const VERSION = "monumental-literary-paths-v2"
const RAW_ROOT = path.join("art", "generated", VERSION)
const PUBLIC_ROOT = path.join("public", "living-archive", "assets")
const REVIEW_ROOT = path.join("public", "living-archive", "review", VERSION)
const MANIFEST_PATH = path.join(RAW_ROOT, "manifest.json")

function parseArgs(argv) {
  const options = {
    slug: undefined,
    cover: undefined,
    stoa: undefined,
    latestCover: false,
    latestStoa: false,
    provider: "openai-imagegen-built-in",
    model: "best-available-image-tool",
    promptVersion: "mlp-cover-stoa-v2",
    sheets: false,
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    const next = argv[index + 1]
    if (arg === "--slug" && next) {
      options.slug = next
      index += 1
    } else if (arg === "--cover" && next) {
      options.cover = next
      index += 1
    } else if (arg === "--stoa" && next) {
      options.stoa = next
      index += 1
    } else if (arg === "--latest-cover") {
      options.latestCover = true
    } else if (arg === "--latest-stoa") {
      options.latestStoa = true
    } else if (arg === "--provider" && next) {
      options.provider = next
      index += 1
    } else if (arg === "--model" && next) {
      options.model = next
      index += 1
    } else if (arg === "--prompt-version" && next) {
      options.promptVersion = next
      index += 1
    } else if (arg === "--sheets") {
      options.sheets = true
    } else if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

function printHelp() {
  console.log(`Process generated Tome art into app-ready derivatives.

Usage:
  node scripts/tome-art/process-generated-art.mjs --slug <book-id> --cover <png> --stoa <png>
  node scripts/tome-art/process-generated-art.mjs --slug <book-id> --cover <png> --latest-stoa
  node scripts/tome-art/process-generated-art.mjs --sheets
`)
}

async function fileExists(file) {
  try {
    await fs.access(file)
    return true
  } catch {
    return false
  }
}

async function loadManifest() {
  if (!(await fileExists(MANIFEST_PATH))) {
    return { version: VERSION, generatedAt: new Date().toISOString(), entries: {} }
  }
  return JSON.parse(await fs.readFile(MANIFEST_PATH, "utf8"))
}

async function saveManifest(manifest) {
  await fs.mkdir(path.dirname(MANIFEST_PATH), { recursive: true })
  manifest.generatedAt = new Date().toISOString()
  await fs.writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`)
}

async function copySource(source, target) {
  await fs.mkdir(path.dirname(target), { recursive: true })
  await fs.copyFile(source, target)
}

async function findLatestGeneratedImage() {
  const root = path.join(process.env.HOME ?? "", ".codex", "generated_images")
  const candidates = []

  async function walk(dir) {
    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      return
    }

    for (const entry of entries) {
      const file = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(file)
      } else if (entry.isFile() && /\.(png|jpg|jpeg|webp)$/i.test(entry.name)) {
        const stat = await fs.stat(file)
        candidates.push({ file, mtimeMs: stat.mtimeMs })
      }
    }
  }

  await walk(root)
  candidates.sort((a, b) => b.mtimeMs - a.mtimeMs)
  return candidates[0]?.file
}

function png(file, quality = 92) {
  return sharp(file)
    .rotate()
    .toColorspace("srgb")
    .png({ compressionLevel: 9, quality })
}

function webp(file, quality = 88) {
  return sharp(file)
    .rotate()
    .toColorspace("srgb")
    .webp({ quality, effort: 5 })
}

async function renderCoverDerivatives(source, outDir) {
  await fs.mkdir(outDir, { recursive: true })

  const coverMasterPng = path.join(outDir, "cover-master-2x3.png")
  const coverMasterWebp = path.join(outDir, "cover-master-2x3.webp")
  const coverAppPng = path.join(outDir, "cover-app-3x4.png")
  const coverAppWebp = path.join(outDir, "cover-app-3x4.webp")
  const coverSquarePng = path.join(outDir, "cover-square.png")
  const coverSquareWebp = path.join(outDir, "cover-square.webp")
  const coverThumb = path.join(outDir, "cover-thumbnail-96x144.png")

  await png(source)
    .resize(1536, 2304, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(coverMasterPng)
  await webp(coverMasterPng, 90).toFile(coverMasterWebp)

  await png(coverMasterPng)
    .resize(1200, 1600, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(coverAppPng)
  await webp(coverAppPng, 88).toFile(coverAppWebp)

  await png(coverMasterPng)
    .resize(1200, 1200, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(coverSquarePng)
  await webp(coverSquarePng, 88).toFile(coverSquareWebp)

  await png(coverMasterPng)
    .resize(96, 144, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(coverThumb)
}

async function renderStoaDerivatives(source, outDir) {
  await fs.mkdir(outDir, { recursive: true })

  const desktopPng = path.join(outDir, "stoa-desktop-16x9.png")
  const desktopWebp = path.join(outDir, "stoa-desktop-16x9.webp")
  const tabletPng = path.join(outDir, "stoa-tablet-4x3.png")
  const tabletWebp = path.join(outDir, "stoa-tablet-4x3.webp")
  const mobilePng = path.join(outDir, "stoa-mobile-3x4.png")
  const mobileWebp = path.join(outDir, "stoa-mobile-3x4.webp")

  await png(source)
    .resize(1920, 1080, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(desktopPng)
  await webp(desktopPng, 88).toFile(desktopWebp)

  await png(desktopPng)
    .resize(1440, 1080, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(tabletPng)
  await webp(tabletPng, 87).toFile(tabletWebp)

  await png(desktopPng)
    .resize(1200, 1600, { fit: "cover", position: sharp.strategy.attention, kernel: sharp.kernel.lanczos3 })
    .toFile(mobilePng)
  await webp(mobilePng, 86).toFile(mobileWebp)
}

async function averageHex(file) {
  const stats = await sharp(file).resize(1, 1, { fit: "fill" }).raw().toBuffer()
  return `#${Array.from(stats.slice(0, 3))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
    .toUpperCase()}`
}

function publicPath(file) {
  return `/${path.relative("public", file).split(path.sep).join("/")}`
}

async function processSlug(options) {
  if (!options.slug) throw new Error("Missing --slug")
  if (options.latestCover) options.cover = await findLatestGeneratedImage()
  if (options.latestStoa) options.stoa = await findLatestGeneratedImage()
  if (!options.cover && !options.stoa) throw new Error("Provide --cover, --stoa, or both")

  const rawDir = path.join(RAW_ROOT, options.slug)
  const publicDir = path.join(PUBLIC_ROOT, options.slug)
  await fs.mkdir(rawDir, { recursive: true })
  await fs.mkdir(publicDir, { recursive: true })

  const manifest = await loadManifest()
  const entry = manifest.entries[options.slug] ?? {
    slug: options.slug,
    provider: options.provider,
    model: options.model,
    promptVersion: options.promptVersion,
    processedAt: undefined,
    source: {},
    publicAssets: {},
  }

  if (options.cover) {
    const coverSource = path.join(rawDir, "cover-source.png")
    await copySource(options.cover, coverSource)
    await renderCoverDerivatives(coverSource, publicDir)
    entry.source.cover = coverSource
    entry.publicAssets.coverMaster2x3 = publicPath(path.join(publicDir, "cover-master-2x3.webp"))
    entry.publicAssets.coverApp3x4 = publicPath(path.join(publicDir, "cover-app-3x4.webp"))
    entry.publicAssets.coverSquare = publicPath(path.join(publicDir, "cover-square.webp"))
    entry.publicAssets.coverThumbnail = publicPath(path.join(publicDir, "cover-thumbnail-96x144.png"))
    entry.coverAverage = await averageHex(path.join(publicDir, "cover-master-2x3.png"))
  }

  if (options.stoa) {
    const stoaSource = path.join(rawDir, "stoa-source.png")
    await copySource(options.stoa, stoaSource)
    await renderStoaDerivatives(stoaSource, publicDir)
    entry.source.stoa = stoaSource
    entry.publicAssets.stoaDesktop16x9 = publicPath(path.join(publicDir, "stoa-desktop-16x9.webp"))
    entry.publicAssets.stoaTablet4x3 = publicPath(path.join(publicDir, "stoa-tablet-4x3.webp"))
    entry.publicAssets.stoaMobile3x4 = publicPath(path.join(publicDir, "stoa-mobile-3x4.webp"))
    entry.stoaAverage = await averageHex(path.join(publicDir, "stoa-desktop-16x9.png"))
  }

  entry.processedAt = new Date().toISOString()
  manifest.entries[options.slug] = entry
  await saveManifest(manifest)
  console.log(`Processed ${options.slug}`)
}

async function listPublishedSlugs() {
  try {
    const entries = await fs.readdir(PUBLIC_ROOT, { withFileTypes: true })
    const slugs = []
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      const dir = path.join(PUBLIC_ROOT, entry.name)
      const required = [
        "cover-master-2x3.webp",
        "cover-app-3x4.webp",
        "cover-square.webp",
        "cover-thumbnail-96x144.png",
        "stoa-desktop-16x9.webp",
        "stoa-tablet-4x3.webp",
        "stoa-mobile-3x4.webp",
      ]
      const complete = await Promise.all(required.map((file) => fileExists(path.join(dir, file))))
      if (complete.every(Boolean)) slugs.push(entry.name)
    }
    return slugs.sort()
  } catch {
    return []
  }
}

async function makeCoverSheet(slugs) {
  if (slugs.length === 0) return undefined
  await fs.mkdir(REVIEW_ROOT, { recursive: true })

  const tileW = 128
  const tileH = 192
  const labelH = 26
  const gap = 14
  const padding = 22
  const cols = 8
  const rows = Math.ceil(slugs.length / cols)
  const width = padding * 2 + cols * tileW + (cols - 1) * gap
  const height = padding * 2 + rows * (tileH + labelH) + (rows - 1) * gap
  const composites = []

  for (let index = 0; index < slugs.length; index += 1) {
    const slug = slugs[index]
    const left = padding + (index % cols) * (tileW + gap)
    const top = padding + Math.floor(index / cols) * (tileH + labelH + gap)
    const input = await sharp(path.join(PUBLIC_ROOT, slug, "cover-thumbnail-96x144.png"))
      .resize(tileW, tileH, { fit: "cover" })
      .toBuffer()
    const label = Buffer.from(`<svg width="${tileW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F4F1E8"/>
      <text x="0" y="16" font-family="Arial, sans-serif" font-size="10" fill="#27323A">${escapeXml(slug).slice(0, 26)}</text>
    </svg>`)
    composites.push({ input, left, top })
    composites.push({ input: label, left, top: top + tileH + 4 })
  }

  const sheetPath = path.join(REVIEW_ROOT, "cover-contact-sheet.jpg")
  await sharp({ create: { width, height, channels: 3, background: "#F4F1E8" } })
    .composite(composites)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(sheetPath)
  return sheetPath
}

async function makeStoaSheet(slugs) {
  if (slugs.length === 0) return undefined
  await fs.mkdir(REVIEW_ROOT, { recursive: true })

  const tileW = 240
  const tileH = 135
  const labelH = 24
  const gap = 14
  const padding = 22
  const cols = 4
  const rows = Math.ceil(slugs.length / cols)
  const width = padding * 2 + cols * tileW + (cols - 1) * gap
  const height = padding * 2 + rows * (tileH + labelH) + (rows - 1) * gap
  const composites = []

  for (let index = 0; index < slugs.length; index += 1) {
    const slug = slugs[index]
    const left = padding + (index % cols) * (tileW + gap)
    const top = padding + Math.floor(index / cols) * (tileH + labelH + gap)
    const input = await sharp(path.join(PUBLIC_ROOT, slug, "stoa-desktop-16x9.webp"))
      .resize(tileW, tileH, { fit: "cover" })
      .toBuffer()
    const label = Buffer.from(`<svg width="${tileW}" height="${labelH}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F4F1E8"/>
      <text x="0" y="15" font-family="Arial, sans-serif" font-size="10" fill="#27323A">${escapeXml(slug).slice(0, 42)}</text>
    </svg>`)
    composites.push({ input, left, top })
    composites.push({ input: label, left, top: top + tileH + 4 })
  }

  const sheetPath = path.join(REVIEW_ROOT, "stoa-contact-sheet.jpg")
  await sharp({ create: { width, height, channels: 3, background: "#F4F1E8" } })
    .composite(composites)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(sheetPath)
  return sheetPath
}

async function makeResponsiveSheet(slugs) {
  if (slugs.length === 0) return undefined
  await fs.mkdir(REVIEW_ROOT, { recursive: true })

  const sample = slugs.slice(0, 8)
  const rowW = 820
  const rowH = 230
  const padding = 22
  const gap = 16
  const width = padding * 2 + rowW
  const height = padding * 2 + sample.length * rowH + (sample.length - 1) * gap
  const composites = []

  for (let index = 0; index < sample.length; index += 1) {
    const slug = sample[index]
    const top = padding + index * (rowH + gap)
    const dir = path.join(PUBLIC_ROOT, slug)
    const files = [
      ["cover-master-2x3.webp", 90, 135],
      ["cover-app-3x4.webp", 90, 120],
      ["cover-square.webp", 110, 110],
      ["cover-thumbnail-96x144.png", 72, 108],
      ["stoa-desktop-16x9.webp", 192, 108],
      ["stoa-tablet-4x3.webp", 144, 108],
      ["stoa-mobile-3x4.webp", 90, 120],
    ]
    let left = padding
    for (const [file, w, h] of files) {
      const input = await sharp(path.join(dir, file)).resize(w, h, { fit: "cover" }).toBuffer()
      composites.push({ input, left, top: top + 36 })
      left += w + 14
    }
    const label = Buffer.from(`<svg width="${rowW}" height="28" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#F4F1E8"/>
      <text x="0" y="18" font-family="Arial, sans-serif" font-size="13" font-weight="700" fill="#27323A">${escapeXml(slug)}</text>
    </svg>`)
    composites.push({ input: label, left: padding, top })
  }

  const sheetPath = path.join(REVIEW_ROOT, "responsive-crop-sheet.jpg")
  await sharp({ create: { width, height, channels: 3, background: "#F4F1E8" } })
    .composite(composites)
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(sheetPath)
  return sheetPath
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

async function makeSheets() {
  const slugs = await listPublishedSlugs()
  const coverSheet = await makeCoverSheet(slugs)
  const stoaSheet = await makeStoaSheet(slugs)
  const responsiveSheet = await makeResponsiveSheet(slugs)
  const manifest = await loadManifest()
  manifest.review = {
    generatedAt: new Date().toISOString(),
    count: slugs.length,
    coverSheet,
    stoaSheet,
    responsiveSheet,
  }
  await saveManifest(manifest)
  console.log(`Review sheets for ${slugs.length} complete packs`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (options.sheets) {
    await makeSheets()
    return
  }
  await processSlug(options)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
