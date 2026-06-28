#!/usr/bin/env tsx

import { mkdir, readFile, readdir, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { BOOKS } from "../../src/data/books"
import { analyzeReferenceLibrary } from "../../src/features/covers/references/analyze"
import { DeterministicSemanticBriefGenerator, developmentFixtureBooks } from "../../src/features/covers/briefs/semantic-brief"
import { rebalanceAssignments, diversityStats } from "../../src/features/covers/briefs/diversity"
import { MockCoverProvider } from "../../src/features/covers/providers/mock-cover-provider"
import { GoogleImagenProvider } from "../../src/features/covers/providers/google-imagen-provider"
import { readCoverFactoryConfig } from "../../src/features/covers/providers/config"
import { buildImagenPrompt } from "../../src/features/covers/prompts/imagen-prompt"
import { renderCoverDerivatives } from "../../src/features/covers/rendering/assets"
import { runLocalImageQA } from "../../src/features/covers/qa/image-qa"
import { typographySvg } from "../../src/features/covers/rendering/typography"
import { COVER_STYLE_VERSION } from "../../src/features/covers/styles/palettes"
import { IMAGEN_PROMPT_VERSION } from "../../src/features/covers/schemas/cover-brief"

interface CliOptions {
  json: boolean
  dryRun: boolean
  mock: boolean
  out?: string
  input?: string
  batch?: string
  file?: string
  bookIds: string[]
  command: string
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  if (!options.command || options.command === "help" || options.command === "--help") {
    printHelp()
    return
  }

  switch (options.command) {
    case "analyze-references":
      await output(options, await analyzeReferenceLibrary({ outputDir: options.out ?? "docs/cover-system" }))
      return
    case "validate-imagen":
      await output(options, await new GoogleImagenProvider(readCoverFactoryConfig()).healthCheck())
      return
    case "import":
      await output(options, await importBooks(options))
      return
    case "brief":
      await output(options, await briefBooks(options))
      return
    case "rebalance":
      await output(options, await rebalanceBooks(options))
      return
    case "generate":
      await output(options, await generateMockCandidates(options))
      return
    case "status":
      await output(options, status())
      return
    case "qa":
      await output(options, await qaCandidate(options))
      return
    case "contact-sheet":
      await output(options, await makeCandidateContactSheet(options))
      return
    case "compose":
      await output(options, await composeTypography(options))
      return
    case "publish":
      await output(options, publishDryRun(options))
      return
    default:
      throw new Error(`Unknown covers command: ${options.command}`)
  }
}

function parseArgs(argv: string[]): CliOptions {
  const [command, ...rest] = argv
  const options: CliOptions = { command, json: false, dryRun: false, mock: false, bookIds: [] }
  for (let index = 0; index < rest.length; index += 1) {
    const arg = rest[index]
    const next = rest[index + 1]
    if (arg === "--json") options.json = true
    else if (arg === "--dry-run") options.dryRun = true
    else if (arg === "--mock") options.mock = true
    else if (arg === "--out" && next) {
      options.out = next
      index += 1
    } else if (arg === "--in" && next) {
      options.input = next
      index += 1
    } else if (arg === "--batch" && next) {
      options.batch = next
      index += 1
    } else if (arg === "--file" && next) {
      options.file = next
      index += 1
    } else if (arg === "--books" && next) {
      options.bookIds = next.split(",").map((item) => item.trim()).filter(Boolean)
      index += 1
    } else if (arg === "--help" || arg === "-h") {
      options.command = "help"
    }
  }
  return options
}

function printHelp() {
  console.log(`Tome Cover Factory v2

Usage:
  npm run covers:<command> -- [options]
  npx tsx scripts/covers/cover-factory.ts <command> [options]

Commands:
  analyze-references   Preserve originals, split contact sheets, write manifest/contact sheet
  validate-imagen      Validate Google Imagen config/credentials without generating a paid image
  import               Validate CSV/JSON/book-id import
  brief                Generate deterministic CoverBrief records
  rebalance            Preview batch diversity balancing
  generate             Generate deterministic mock candidates unless paid Imagen is explicitly enabled
  status               Print local provider and config status
  qa                   Run local QA against a candidate image file
  contact-sheet        Regenerate the reference contact sheet
  compose              Render deterministic typography SVG
  publish              Dry-run publication/versioning operation

Options:
  --json               Print JSON
  --dry-run            Validate and preview without mutating durable stores
  --mock               Force mock provider behavior
  --out <dir>          Output directory
  --in <dir>           Input directory for contact-sheet
  --file <path>        CSV/JSON/image path depending on command
  --books a,b,c        Comma-separated book IDs
  --batch <id>         Batch identifier
`)
}

async function importBooks(options: CliOptions) {
  const ids = options.file ? await parseImportFile(options.file) : options.bookIds
  const found = BOOKS.filter((book) => ids.includes(book.id))
  const missing = ids.filter((id) => !found.some((book) => book.id === id))
  return { valid: missing.length === 0, count: found.length, missing, books: found.map(({ id, title, author }) => ({ id, title, author })) }
}

async function briefBooks(options: CliOptions) {
  const books = selectedBooks(options)
  const generator = new DeterministicSemanticBriefGenerator()
  const briefs = books.map((book) => generator.generate(book, { batchSeed: options.batch ?? "cli" }))
  if (options.out) {
    await mkdir(options.out, { recursive: true })
    await writeFile(path.join(options.out, "cover-briefs.json"), `${JSON.stringify(briefs, null, 2)}\n`)
  }
  return { count: briefs.length, briefs }
}

async function rebalanceBooks(options: CliOptions) {
  const generator = new DeterministicSemanticBriefGenerator()
  const assignments = selectedBooks(options).map((book) => {
    const brief = generator.generate(book, { batchSeed: options.batch ?? "cli" })
    return {
      bookId: book.id,
      compositionFamily: brief.artDirection.compositionFamily,
      paletteMode: brief.artDirection.paletteMode,
    }
  })
  const rebalanced = rebalanceAssignments(assignments, { seed: options.batch ?? "cli" })
  return { assignments: rebalanced, stats: diversityStats(rebalanced) }
}

async function generateMockCandidates(options: CliOptions) {
  const books = selectedBooks(options)
  const generator = new DeterministicSemanticBriefGenerator()
  const provider = new MockCoverProvider()
  const outDir = options.out ?? "tmp/cover-factory/mock"
  if (!options.dryRun) await mkdir(outDir, { recursive: true })
  const results = []
  for (const book of books) {
    const brief = generator.generate(book, { batchSeed: options.batch ?? "cli" })
    const prompt = brief.imagenPrompt ?? buildImagenPrompt(brief)
    const candidates = await provider.generateImages({
      prompt: prompt.finalPrompt,
      config: {
        ...brief.imagenRequest!,
        provider: "mock-cover",
        transport: "mock",
        allowPaidGeneration: false,
      },
      bookId: book.id,
      briefVersion: 1,
    })
    for (const candidate of candidates) {
      const source = Buffer.from(candidate.bytesBase64, "base64")
      const png = await sharp(source).png().toBuffer()
      const { cropRect, derivatives } = await renderCoverDerivatives(png)
      const candidatePath = path.join(outDir, `${book.id}-${candidate.candidateId}.png`)
      if (!options.dryRun) {
        await writeFile(candidatePath, derivatives[0].bytes)
      }
      results.push({
        bookId: book.id,
        title: book.title,
        author: book.author,
        candidateId: candidate.candidateId,
        path: options.dryRun ? undefined : candidatePath,
        styleVersion: brief.styleVersion,
        promptVersion: prompt.promptVersion,
        promptHash: prompt.promptHash,
        reviewStatus: "mock-generated",
        cropRect,
        derivatives: derivatives.map(({ type, width, height, sha256 }) => ({ type, width, height, sha256 })),
      })
    }
  }
  if (!options.dryRun) {
    await writeFile(path.join(outDir, "batch-manifest.json"), `${JSON.stringify({
      schemaVersion: "cover-batch-manifest.v1",
      batchId: options.batch ?? "cli",
      generatedAt: new Date().toISOString(),
      styleVersion: COVER_STYLE_VERSION,
      promptVersion: IMAGEN_PROMPT_VERSION,
      mock: true,
      bookIds: books.map((book) => book.id),
      reviewGate: "Review contact sheet for light palette fit, textlessness, crop safety, duplicate motifs, and thumbnail readability before paid Imagen.",
      candidates: results,
    }, null, 2)}\n`)
  }
  return { count: results.length, outDir: options.dryRun ? undefined : outDir, candidates: results }
}

function status() {
  const config = readCoverFactoryConfig()
  return {
    styleVersion: COVER_STYLE_VERSION,
    paidGenerationEnabled: config.allowPaidGeneration,
    transport: config.transport,
    models: {
      draft: config.draftModel,
      production: config.productionModel,
      featured: config.featuredModel,
    },
    mockMode: !config.allowPaidGeneration,
  }
}

async function qaCandidate(options: CliOptions) {
  if (!options.file) throw new Error("--file is required for qa")
  const image = await readFile(options.file)
  return runLocalImageQA({ source: image, selectedPalette: ["#102332", "#F7E8CE", "#B5823C"] })
}

async function makeCandidateContactSheet(options: CliOptions) {
  const inputDir = options.input ?? options.file
  if (!inputDir) throw new Error("--in is required for contact-sheet")
  const outFile = options.out ?? "tmp/cover-factory/contact-sheets/contact-sheet.jpg"
  const files = (await readdir(inputDir))
    .filter((file) => /\.(png|jpe?g|webp)$/i.test(file))
    .sort()
  if (files.length === 0) throw new Error(`No image candidates found in ${inputDir}`)

  const tileW = 192
  const tileH = 288
  const labelH = 44
  const gap = 16
  const pad = 24
  const cols = Math.min(4, files.length)
  const rows = Math.ceil(files.length / cols)
  const width = pad * 2 + cols * tileW + (cols - 1) * gap
  const height = pad * 2 + rows * (tileH + labelH) + (rows - 1) * gap
  const composites: sharp.OverlayOptions[] = []

  for (let index = 0; index < files.length; index += 1) {
    const file = files[index]
    const col = index % cols
    const row = Math.floor(index / cols)
    const left = pad + col * (tileW + gap)
    const top = pad + row * (tileH + labelH + gap)
    const label = file.replace(/\.(png|jpe?g|webp)$/i, "")
    composites.push({
      input: await sharp(path.join(inputDir, file)).resize(tileW, tileH, { fit: "cover" }).jpeg({ quality: 90 }).toBuffer(),
      left,
      top,
    })
    composites.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${labelH}">
        <rect width="100%" height="100%" fill="#f6ecd8"/>
        <text x="0" y="16" font-family="Arial" font-size="12" fill="#2f3a35">${escapeXml(label.slice(0, 31))}</text>
        <text x="0" y="32" font-family="Arial" font-size="10" fill="#6d7468">mock luminous candidate</text>
      </svg>`),
      left,
      top: top + tileH + 4,
    })
  }

  if (!options.dryRun) {
    await mkdir(path.dirname(outFile), { recursive: true })
    await sharp({ create: { width, height, channels: 3, background: "#f6ecd8" } })
      .composite(composites)
      .jpeg({ quality: 90 })
      .toFile(outFile)
  }

  return { count: files.length, inputDir, outFile: options.dryRun ? undefined : outFile }
}

async function composeTypography(options: CliOptions) {
  const book = selectedBooks(options)[0] ?? developmentFixtureBooks()[0]
  const svg = typographySvg({ title: book.title, author: book.author, template: "archive-band" })
  if (options.out && !options.dryRun) {
    await mkdir(options.out, { recursive: true })
    await writeFile(path.join(options.out, `${book.id}-typography.svg`), svg)
  }
  return { bookId: book.id, bytes: svg.length, out: options.out ? path.join(options.out, `${book.id}-typography.svg`) : undefined }
}

function publishDryRun(options: CliOptions) {
  return {
    dryRun: true,
    batch: options.batch,
    publication: {
      action: "publish",
      immutableAssets: true,
      rollbackAvailable: true,
      requiresApprovedCandidate: true,
    },
  }
}

function selectedBooks(options: CliOptions) {
  if (options.bookIds.length > 0) {
    return BOOKS.filter((book) => options.bookIds.includes(book.id))
  }
  return developmentFixtureBooks()
}

async function parseImportFile(file: string): Promise<string[]> {
  const text = await readFile(file, "utf8")
  if (file.endsWith(".json")) {
    const parsed = JSON.parse(text) as Array<string | { bookId?: string; id?: string }>
    return parsed.map((item) => typeof item === "string" ? item : item.bookId ?? item.id).filter((item): item is string => Boolean(item))
  }
  return text.split(/\r?\n/).flatMap((line) => line.split(",")[0]?.trim() ? [line.split(",")[0].trim()] : [])
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

async function output(options: CliOptions, value: unknown) {
  if (options.json) {
    console.log(JSON.stringify(value, null, 2))
  } else if (typeof value === "object" && value !== null) {
    console.log(JSON.stringify(value, null, 2))
  } else {
    console.log(String(value))
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exitCode = 1
})
