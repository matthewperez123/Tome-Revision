#!/usr/bin/env tsx

import assert from "node:assert/strict"
import { mkdtemp, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import path from "node:path"
import sharp from "sharp"
import { detectContactSheetCrops, analyzeReferenceLibrary } from "../../src/features/covers/references/analyze"
import { DeterministicSemanticBriefGenerator, developmentFixtureBooks } from "../../src/features/covers/briefs/semantic-brief"
import { buildImagenPrompt, estimatePromptTokens, MAX_IMAGEN_PROMPT_TOKENS } from "../../src/features/covers/prompts/imagen-prompt"
import { MockCoverProvider } from "../../src/features/covers/providers/mock-cover-provider"
import { GoogleImagenProvider } from "../../src/features/covers/providers/google-imagen-provider"
import { readCoverFactoryConfig } from "../../src/features/covers/providers/config"
import { centeredTwoByThreeCrop, renderCoverDerivatives } from "../../src/features/covers/rendering/assets"
import { InMemoryCoverJobQueue, retryDelayMs } from "../../src/features/covers/queue/job-queue"
import { evaluateBudget } from "../../src/features/covers/queue/budget"
import { rebalanceAssignments, diversityStats } from "../../src/features/covers/briefs/diversity"
import { runLocalImageQA } from "../../src/features/covers/qa/image-qa"
import { layoutCoverTypography } from "../../src/features/covers/rendering/typography"
import { COVER_STYLE_VERSION, LUMINOUS_LIGHT_PALETTE_IDS } from "../../src/features/covers/styles/palettes"
import { IMAGEN_PROMPT_VERSION } from "../../src/features/covers/schemas/cover-brief"

const luminousPaletteIds = new Set<string>(LUMINOUS_LIGHT_PALETTE_IDS)

async function run() {
  await testReferenceDetection()
  await testManifestGeneration()
  testBriefAndPrompt()
  await testProviders()
  await testRenderingAndQa()
  testQueueBudgetAndDiversity()
  testTypographyAndPublication()
  console.log("cover-factory tests passed")
}

async function testReferenceDetection() {
  const crops = await detectContactSheetCrops("docs/cover-system/references/luminous-june-18/luminous-minimal-suite-a-2026-06-18-161222.png")
  assert.equal(crops.length, 8)
  assert.ok(crops.every((crop) => crop.width > 300 && crop.height > 400))
}

async function testManifestGeneration() {
  const dir = await mkdtemp(path.join(tmpdir(), "cover-system-"))
  try {
    const manifest = await analyzeReferenceLibrary({ outputDir: path.relative(process.cwd(), dir) })
    assert.equal(manifest.styleVersion, COVER_STYLE_VERSION)
    assert.equal(manifest.references.length, 16)
    assert.equal(manifest.references.filter((item) => item.sourceType === "contact-sheet-crop").length, 16)
    assert.equal(manifest.references.filter((item) => item.sourceType === "anchor").length, 0)
    assert.ok(manifest.references.every((item) => item.sha256.length === 64))
    assert.ok(manifest.references.every((item) => item.dominantMode === "light"))
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

function testBriefAndPrompt() {
  const book = developmentFixtureBooks()[0]
  const brief = new DeterministicSemanticBriefGenerator().generate(book, { batchSeed: "test" })
  assert.equal(brief.schemaVersion, "cover-brief.v2.0.0")
  assert.equal(brief.styleVersion, COVER_STYLE_VERSION)
  assert.ok(luminousPaletteIds.has(brief.artDirection.paletteMode))
  const prompt = buildImagenPrompt(brief)
  assert.ok(prompt.finalPrompt.includes("TEXTLESS 3:4"))
  assert.ok(prompt.finalPrompt.includes("Luminous Minimal Modernism"))
  assert.ok(prompt.finalPrompt.includes("gothic darkness"))
  assert.ok(estimatePromptTokens(prompt.finalPrompt) <= MAX_IMAGEN_PROMPT_TOKENS)
  assert.ok(/^[\x00-\x7F]+$/.test(prompt.finalPrompt))
}

async function testProviders() {
  const book = developmentFixtureBooks()[0]
  const brief = new DeterministicSemanticBriefGenerator().generate(book, { batchSeed: "provider" })
  const mock = new MockCoverProvider()
  const health = await mock.healthCheck()
  assert.equal(health.available, true)
  const candidates = await mock.generateImages({
    prompt: brief.imagenPrompt!.finalPrompt,
    config: { ...brief.imagenRequest!, provider: "mock-cover", transport: "mock", allowPaidGeneration: false },
    bookId: book.id,
    briefVersion: 1,
  })
  assert.equal(candidates.length, brief.imagenRequest!.candidateCount)

  const google = new GoogleImagenProvider(readCoverFactoryConfig({ IMAGEN_ALLOW_PAID_GENERATION: "false" } as NodeJS.ProcessEnv))
  const startup = await google.validateStartup()
  assert.equal(startup.available, false)
}

async function testRenderingAndQa() {
  const image = await sharp({
    create: { width: 1536, height: 2048, channels: 3, background: "#102332" },
  }).png().toBuffer()
  const crop = centeredTwoByThreeCrop(1536, 2048)
  assert.equal(crop.width, 1365)
  assert.equal(crop.height, 2048)
  assert.equal(crop.y, 0)
  assert.ok(Math.abs(crop.x - (1536 - crop.width) / 2) <= 1)
  const rendered = await renderCoverDerivatives(image)
  assert.equal(rendered.derivatives[0].width, 1024)
  assert.equal(rendered.derivatives.find((item) => item.type === "thumb")?.height, 144)
  const qa = await runLocalImageQA({ source: image, master: rendered.derivatives[0].bytes, selectedPalette: ["#102332"] })
  assert.equal(qa.structural.pass, true)
}

function testQueueBudgetAndDiversity() {
  const queue = new InMemoryCoverJobQueue()
  const job = queue.enqueue({
    batchId: "batch",
    bookId: "the-odyssey",
    briefVersion: 1,
    styleVersion: COVER_STYLE_VERSION,
    promptVersion: IMAGEN_PROMPT_VERSION,
    provider: "mock-cover",
    modelId: "mock",
    requestMode: "production",
    idempotencyKey: "idem",
    maxAttempts: 3,
    estimatedCostUsd: 0,
  })
  assert.equal(queue.enqueue({ ...job, id: undefined, status: "queued", attemptCount: 0, createdAt: Date.now() }).id, job.id)
  const claimed = queue.claim({ owner: "worker", concurrency: 1 })
  assert.equal(claimed.length, 1)
  queue.fail(job.id, "worker", "rate limited")
  assert.ok(retryDelayMs(1, "idem") > 0)
  assert.equal(evaluateBudget({ dailyBudgetUsd: 1, spentTodayUsd: 0, estimatedCostPerImageUsd: 0.1 }, 5).allowed, true)
  assert.equal(evaluateBudget({ dailyBudgetUsd: 0, spentTodayUsd: 0, estimatedCostPerImageUsd: 0.1 }, 1).allowed, false)

  const assignments = developmentFixtureBooks().map((book) => ({
    bookId: book.id,
    compositionFamily: "processional-causeway" as const,
    paletteMode: "luminous-ivory-sage" as const,
  }))
  const rebalanced = rebalanceAssignments(assignments, { seed: "diversity" })
  assert.ok(Object.keys(diversityStats(rebalanced).familyCounts).length > 1)
  assert.ok(rebalanced.every((assignment) => luminousPaletteIds.has(assignment.paletteMode)))
}

function testTypographyAndPublication() {
  const layout = layoutCoverTypography({
    title: "The Strange Case of Dr. Jekyll and Mr. Hyde",
    author: "Robert Louis Stevenson",
    template: "archive-band",
  })
  assert.ok(layout.titleLines.length <= 4)
  assert.equal(layout.overflow, false)
}

run().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
