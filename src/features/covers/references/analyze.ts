import { createHash } from "node:crypto"
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises"
import path from "node:path"
import sharp from "sharp"
import { perceptualHashFromPixels } from "../qa/image-qa"

export interface ReferenceSource {
  id: string
  sourcePath: string
  sourceType: "contact-sheet" | "anchor"
  paletteFamily: string
  description: string
}

export interface ReferenceManifestEntry {
  id: string
  sourceFilename: string
  sourceType: "contact-sheet-crop" | "anchor"
  originalPath: string
  cropPath: string
  cropCoordinates?: { x: number; y: number; width: number; height: number }
  width: number
  height: number
  sha256: string
  perceptualHash: string
  dominantColors: string[]
  paletteFamily: string
  approximateBackgroundColor: string
  approximateInkColors: string[]
  accentColor?: string
  temperature: "warm" | "cool" | "mixed"
  dominantMode: "light" | "dark" | "mixed"
  textureProfile: string
  estimatedHorizonPosition: "low" | "middle" | "high"
  estimatedNegativeSpacePercentage: number
  dominantLandmarkOrSymbol: string
  secondaryMotifs: string[]
  compositionFamily: string
  narrativeVector: string
  routePresence: boolean
  routeType?: string
  celestialElement?: string
  figureCount: number
  architecturalPresence: boolean
  waterPresence: boolean
  titleSafeRegion: string
  visualDensityEstimate: "low" | "medium" | "high"
  description: string
}

export interface ReferenceManifest {
  schemaVersion: "cover-reference-manifest.v2"
  generatedAt: string
  styleVersion: "tome-luminous-minimal-modernism-v1"
  gutterDetection: {
    method: string
    fallback: string
  }
  originals: Array<{ id: string; path: string; sha256: string }>
  references: ReferenceManifestEntry[]
}

export const DEFAULT_REFERENCE_SOURCES: ReferenceSource[] = [
  {
    id: "luminous-suite-a",
    sourcePath: "docs/cover-system/references/luminous-june-18/luminous-minimal-suite-a-2026-06-18-161222.png",
    sourceType: "contact-sheet",
    paletteFamily: "luminous-ivory-sage",
    description: "Lighter June 18 4:12 Plato/Republic-left suite with garden, civic, threshold, and philosophical daylight cues.",
  },
  {
    id: "luminous-suite-b",
    sourcePath: "docs/cover-system/references/luminous-june-18/luminous-minimal-suite-b-2026-06-18-161341.png",
    sourceType: "contact-sheet",
    paletteFamily: "sea-glass-day",
    description: "Lighter June 18 4:13 first-example suite with shore, vessel, causeway, route, and open horizon cues.",
  },
]

export async function analyzeReferenceLibrary(options: {
  rootDir?: string
  outputDir?: string
  sources?: ReferenceSource[]
} = {}): Promise<ReferenceManifest> {
  const rootDir = options.rootDir ?? process.cwd()
  const outputDir = options.outputDir ?? "docs/cover-system"
  const sources = options.sources ?? DEFAULT_REFERENCE_SOURCES
  const originalsDir = path.join(rootDir, outputDir, "references/originals")
  const cropsDir = path.join(rootDir, outputDir, "references/crops")
  await mkdir(originalsDir, { recursive: true })
  await mkdir(cropsDir, { recursive: true })

  const originals: ReferenceManifest["originals"] = []
  const references: ReferenceManifestEntry[] = []

  for (const source of sources) {
    const absoluteSource = path.join(rootDir, source.sourcePath)
    const originalFilename = path.basename(source.sourcePath)
    const originalPath = path.join(originalsDir, originalFilename)
    await copyFile(absoluteSource, originalPath)
    originals.push({
      id: source.id,
      path: toPosix(path.relative(rootDir, originalPath)),
      sha256: await sha256File(originalPath),
    })

    if (source.sourceType === "contact-sheet") {
      const cropRects = await detectContactSheetCrops(originalPath)
      for (let index = 0; index < cropRects.length; index += 1) {
        const rect = cropRects[index]
        const cropId = `${source.id}-${String(index + 1).padStart(2, "0")}`
        const cropPath = path.join(cropsDir, `${cropId}.png`)
        await sharp(originalPath)
          .extract({ left: rect.x, top: rect.y, width: rect.width, height: rect.height })
          .png()
          .toFile(cropPath)
        references.push(await describeReference({
          id: cropId,
          source,
          sourceFilename: originalFilename,
          originalPath,
          cropPath,
          cropCoordinates: rect,
          rootDir,
        }))
      }
    } else {
      const anchorPath = path.join(cropsDir, `${source.id}.png`)
      await copyFile(originalPath, anchorPath)
      references.push(await describeReference({
        id: source.id,
        source,
        sourceFilename: originalFilename,
        originalPath,
        cropPath: anchorPath,
        rootDir,
      }))
    }
  }

  const manifest: ReferenceManifest = {
    schemaVersion: "cover-reference-manifest.v2",
    generatedAt: new Date().toISOString(),
    styleVersion: "tome-luminous-minimal-modernism-v1",
    gutterDetection: {
      method: "Detect pale vertical and horizontal gutter runs by low-saturation high-lightness projections, then crop cells between gutter runs.",
      fallback: "If detection does not produce a 4x2 grid, use proportional 4x2 cells with 1.0% outer margin and 0.9% gutters, matching the inspected 1448x1086 reference sheets.",
    },
    originals,
    references,
  }

  await writeFile(path.join(rootDir, outputDir, "reference-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
  await makeReferenceContactSheet(references, rootDir, path.join(rootDir, outputDir, "reference-contact-sheet.webp"))
  await writeStyleDna(rootDir, outputDir, references)
  return manifest
}

export async function detectContactSheetCrops(filePath: string): Promise<Array<{ x: number; y: number; width: number; height: number }>> {
  const { data, info } = await sharp(filePath).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width, height, channels } = info
  const colRuns = runs(projection(data, width, height, channels, "x"), 0.82, Math.max(8, Math.floor(width * 0.004)))
  const rowRuns = runs(projection(data, width, height, channels, "y"), 0.82, Math.max(8, Math.floor(height * 0.004)))

  if (colRuns.length >= 5 && rowRuns.length >= 3) {
    const xs = intervalsBetween(colRuns.slice(0, 5), width)
    const ys = intervalsBetween(rowRuns.slice(0, 3), height)
    if (xs.length === 4 && ys.length === 2) {
      return ys.flatMap((y) => xs.map((x) => ({
        x: x.start,
        y: y.start,
        width: x.end - x.start + 1,
        height: y.end - y.start + 1,
      })))
    }
  }

  return fallbackFourByTwo(width, height)
}

function projection(data: Buffer, width: number, height: number, channels: number, axis: "x" | "y"): number[] {
  const length = axis === "x" ? width : height
  const outer = axis === "x" ? height : width
  const result: number[] = []
  for (let primary = 0; primary < length; primary += 1) {
    let paleCount = 0
    let count = 0
    for (let secondary = 0; secondary < outer; secondary += 4) {
      const x = axis === "x" ? primary : secondary
      const y = axis === "x" ? secondary : primary
      const index = (y * width + x) * channels
      if (isPaleGutterPixel(data[index], data[index + 1], data[index + 2])) paleCount += 1
      count += 1
    }
    result.push(paleCount / count)
  }
  return result
}

function isPaleGutterPixel(r: number, g: number, b: number): boolean {
  const avg = (r + g + b) / 3
  const spread = Math.max(r, g, b) - Math.min(r, g, b)
  return avg > 215 && spread < 48
}

function runs(values: number[], threshold: number, minLength: number): Array<[number, number]> {
  const result: Array<[number, number]> = []
  let start = -1
  for (let index = 0; index < values.length; index += 1) {
    if (values[index] >= threshold) {
      if (start < 0) start = index
    } else if (start >= 0) {
      if (index - start >= minLength) result.push([start, index - 1])
      start = -1
    }
  }
  if (start >= 0 && values.length - start >= minLength) result.push([start, values.length - 1])
  return result
}

function intervalsBetween(runsInput: Array<[number, number]>, max: number): Array<{ start: number; end: number }> {
  return runsInput.slice(0, -1)
    .map((run, index) => ({ start: run[1] + 1, end: runsInput[index + 1][0] - 1 }))
    .filter((interval) => interval.start < interval.end && interval.end < max)
}

function fallbackFourByTwo(width: number, height: number): Array<{ x: number; y: number; width: number; height: number }> {
  const outerX = Math.round(width * 0.01)
  const outerY = Math.round(height * 0.013)
  const gutterX = Math.round(width * 0.009)
  const gutterY = Math.round(height * 0.013)
  const cellW = Math.floor((width - outerX * 2 - gutterX * 3) / 4)
  const cellH = Math.floor((height - outerY * 2 - gutterY) / 2)
  const rects = []
  for (let row = 0; row < 2; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      rects.push({
        x: outerX + col * (cellW + gutterX),
        y: outerY + row * (cellH + gutterY),
        width: cellW,
        height: cellH,
      })
    }
  }
  return rects
}

async function describeReference(input: {
  id: string
  source: ReferenceSource
  sourceFilename: string
  originalPath: string
  cropPath: string
  cropCoordinates?: { x: number; y: number; width: number; height: number }
  rootDir: string
}): Promise<ReferenceManifestEntry> {
  const metadata = await sharp(input.cropPath).metadata()
  const width = metadata.width ?? 0
  const height = metadata.height ?? 0
  const colors = await representativeColors(input.cropPath)
  const raw = await sharp(input.cropPath).resize(32, 32, { fit: "fill" }).removeAlpha().raw().toBuffer()
  const signature = inferReferenceSignature(input.id, input.source.description, colors)
  return {
    id: input.id,
    sourceFilename: input.sourceFilename,
    sourceType: input.cropCoordinates ? "contact-sheet-crop" : "anchor",
    originalPath: toPosix(path.relative(input.rootDir, input.originalPath)),
    cropPath: toPosix(path.relative(input.rootDir, input.cropPath)),
    cropCoordinates: input.cropCoordinates,
    width,
    height,
    sha256: await sha256File(input.cropPath),
    perceptualHash: perceptualHashFromPixels(raw, 32, 32),
    dominantColors: colors,
    paletteFamily: input.source.paletteFamily,
    approximateBackgroundColor: colors[0] ?? "#000000",
    approximateInkColors: colors.slice(1, 3),
    accentColor: colors[3],
    temperature: signature.temperature,
    dominantMode: signature.dominantMode,
    textureProfile: "matte lithograph with restrained overprint texture",
    estimatedHorizonPosition: signature.horizon,
    estimatedNegativeSpacePercentage: signature.negativeSpace,
    dominantLandmarkOrSymbol: signature.landmark,
    secondaryMotifs: signature.motifs,
    compositionFamily: signature.compositionFamily,
    narrativeVector: signature.vector,
    routePresence: signature.routePresence,
    routeType: signature.routeType,
    celestialElement: signature.celestial,
    figureCount: signature.figureCount,
    architecturalPresence: signature.architecture,
    waterPresence: signature.water,
    titleSafeRegion: signature.titleSafe,
    visualDensityEstimate: signature.density,
    description: input.source.description,
  }
}

async function representativeColors(filePath: string): Promise<string[]> {
  const { data, info } = await sharp(filePath).resize(96, 144, { fit: "fill" }).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const buckets = new Map<string, number>()
  for (let index = 0; index < data.length; index += info.channels * 8) {
    const r = quant(data[index])
    const g = quant(data[index + 1])
    const b = quant(data[index + 2])
    const key = `#${hex(r)}${hex(g)}${hex(b)}`
    buckets.set(key, (buckets.get(key) ?? 0) + 1)
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([color]) => color)
}

function inferReferenceSignature(id: string, description: string, colors: string[]) {
  const text = `${id} ${description}`.toLowerCase()
  const cropFamilyOverrides: Record<string, string> = {
    "luminous-suite-a-01": "garden-approach-light",
    "luminous-suite-a-02": "luminous-path",
    "luminous-suite-a-03": "open-threshold",
    "luminous-suite-a-04": "quiet-emblem-field",
    "luminous-suite-a-05": "botanical-monument",
    "luminous-suite-a-06": "civic-axis",
    "luminous-suite-a-07": "open-threshold",
    "luminous-suite-a-08": "garden-approach-light",
    "luminous-suite-b-01": "shore-and-vessel",
    "luminous-suite-b-02": "luminous-path",
    "luminous-suite-b-03": "shore-and-vessel",
    "luminous-suite-b-04": "solitary-dwelling-day",
    "luminous-suite-b-05": "civic-axis",
    "luminous-suite-b-06": "elemental-force-light",
    "luminous-suite-b-07": "quiet-emblem-field",
    "luminous-suite-b-08": "shore-and-vessel",
    "core-canon-01": "windmill-procession",
    "core-canon-02": "cosmic-ascent",
    "core-canon-03": "luminous-sea-route",
    "core-canon-04": "coastal-citadel",
    "core-canon-05": "moonlit-sentinel",
    "core-canon-06": "alpine-refuge",
    "core-canon-07": "monumental-emblem",
    "core-canon-08": "estate-approach",
    "expanded-canon-01": "coastal-citadel",
    "expanded-canon-02": "estate-approach",
    "expanded-canon-03": "isolated-dwelling",
    "expanded-canon-04": "moonlit-sentinel",
    "expanded-canon-05": "coastal-citadel",
    "expanded-canon-06": "solitary-voyage",
    "expanded-canon-07": "labyrinth-gate",
    "expanded-canon-08": "horizon-beacon",
  }
  const isLuminous = text.includes("luminous")
  const isWarm = colors.slice(0, 3).some((color) => /#(f|e|d|c|b|a|9|8)/i.test(color.slice(1, 2))) && !text.includes("odyssey")
  const water = /sea|odyssey|coastal|voyage|harbor|current|vessel|island|beacon/.test(text)
  const architecture = /citadel|castle|estate|republic|aeneid|iliad|dwelling|gate|harbor/.test(text)
  const override = cropFamilyOverrides[id]
  const compositionFamily = override ?? (
    text.includes("aeneid") ? "processional-causeway" :
    text.includes("divine") ? "cosmic-ascent" :
    text.includes("iliad") ? "monumental-emblem" :
    text.includes("odyssey") ? "luminous-sea-route" :
    text.includes("republic") ? "framed-revelation" :
    text.includes("expanded-canon-07") ? "labyrinth-gate" :
    text.includes("expanded-canon-08") ? "horizon-beacon" :
    water ? "luminous-sea-route" :
    architecture ? "estate-approach" :
    "monumental-ascent"
  )
  return {
    temperature: isWarm ? "warm" as const : water ? "cool" as const : "mixed" as const,
    dominantMode: isLuminous ? "light" as const : text.includes("nocturne") || text.includes("odyssey") || text.includes("republic") ? "dark" as const : "mixed" as const,
    horizon: water ? "high" as const : "middle" as const,
    negativeSpace: text.includes("aeneid") ? 56 : text.includes("odyssey") ? 42 : 34,
    landmark: dominantLandmark(compositionFamily),
    motifs: water ? ["current", "distant destination"] : ["route", "scale contrast"],
    compositionFamily,
    vector: water ? "current" : compositionFamily.includes("ascent") ? "ascent" : "threshold",
    routePresence: !compositionFamily.includes("emblem") || text.includes("iliad"),
    routeType: water ? "luminous current" : "path or threshold",
    celestial: /moon|star|sun|divine|odyssey|iliad/.test(text) ? "restrained celestial element" : undefined,
    figureCount: /aeneid|divine|republic|odyssey|iliad|canon/.test(text) ? 1 : 0,
    architecture,
    water,
    titleSafe: "upper controlled negative space",
    density: text.includes("divine") ? "high" as const : "medium" as const,
  }
}

function dominantLandmark(compositionFamily: string): string {
  if (compositionFamily === "luminous-path") return "one sunlit path or route"
  if (compositionFamily === "quiet-emblem-field") return "one oversized quiet emblem"
  if (compositionFamily === "open-threshold") return "open door, window, gate, or stage aperture"
  if (compositionFamily === "shore-and-vessel") return "daylight shore, vessel, wake, or harbor route"
  if (compositionFamily === "garden-approach-light") return "garden or estate approach in daylight"
  if (compositionFamily === "solitary-dwelling-day") return "one bright dwelling or room edge"
  if (compositionFamily === "botanical-monument") return "monumental plant or natural trace"
  if (compositionFamily === "civic-axis") return "columns, plaza, road, or civic blocks"
  if (compositionFamily === "interior-light-vector") return "interior light path"
  if (compositionFamily === "elemental-force-light") return "daylight elemental force"
  if (compositionFamily === "processional-causeway") return "monumental arch or gate"
  if (compositionFamily === "cosmic-ascent") return "terraced ascent"
  if (compositionFamily === "monumental-emblem") return "oversized symbolic emblem"
  if (compositionFamily === "luminous-sea-route") return "luminous water route"
  if (compositionFamily === "framed-revelation") return "dark aperture and illuminated city"
  return "simplified monumental landscape"
}

async function makeReferenceContactSheet(references: ReferenceManifestEntry[], rootDir: string, outPath: string): Promise<void> {
  const tileW = 180
  const tileH = 270
  const labelH = 42
  const gap = 18
  const pad = 24
  const cols = 7
  const rows = Math.ceil(references.length / cols)
  const width = pad * 2 + cols * tileW + (cols - 1) * gap
  const height = pad * 2 + rows * (tileH + labelH) + (rows - 1) * gap
  const composites: sharp.OverlayOptions[] = []
  for (let index = 0; index < references.length; index += 1) {
    const ref = references[index]
    const col = index % cols
    const row = Math.floor(index / cols)
    const left = pad + col * (tileW + gap)
    const top = pad + row * (tileH + labelH + gap)
    composites.push({
      input: await sharp(path.join(rootDir, ref.cropPath)).resize(tileW, tileH, { fit: "cover" }).webp().toBuffer(),
      left,
      top,
    })
    composites.push({
      input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${tileW}" height="${labelH}">
        <rect width="100%" height="100%" fill="#f4ead6"/>
        <text x="0" y="15" font-family="Arial" font-size="12" fill="#102332">${escapeXml(ref.id)}</text>
        <text x="0" y="31" font-family="Arial" font-size="10" fill="#475963">${escapeXml(ref.compositionFamily)}</text>
      </svg>`),
      left,
      top: top + tileH + 4,
    })
  }
  await sharp({ create: { width, height, channels: 3, background: "#f4ead6" } })
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(outPath)
}

async function writeStyleDna(rootDir: string, outputDir: string, references: ReferenceManifestEntry[]): Promise<void> {
  const families = Array.from(new Set(references.map((ref) => ref.compositionFamily))).join(", ")
  const palettes = Array.from(new Set(references.map((ref) => ref.paletteFamily))).join(", ")
  await writeFile(path.join(rootDir, outputDir, "STYLE_DNA.md"), `# Tome Luminous Minimal Modernism Style DNA

Generated from ${references.length} protected internal references from the lighter June 18 4:12 and 4:13 suites.

## Core Grammar

- One light world, one dominant symbol, one narrative vector, one optional human-scale mark, one disciplined light palette.
- Vintage editorial printmaking, matte paper, soft grain, quiet stipple, controlled edge roughness, and restrained overprint texture.
- Four to nine large readable shapes with approximately 35-65% calm negative space.
- Deep ink supports linework and small silhouettes; it does not dominate the atmosphere.
- Typography is never generated in artwork. Tome renders title and author separately.

## Reference-Derived Composition Families

${families}

## Reference-Derived Palette Families

${palettes}

## June 18 Anchor Lessons

- The 4:12 Plato/Republic-left suite proves that philosophy and civic inquiry can be open, architectural, classical, and daylight-filled instead of dark cave allegory.
- The 4:13 first-example suite proves that voyages, islands, harbors, and epics can stay pale, warm, and breathable while remaining book-specific.
- The path is the unifying device: road, river, wake, shore, beam, garden walk, staircase, window light, furrow, or threshold.
- Keep figures tiny, anonymous, and optional; avoid portraiture and costume detail.
- Reject repeated moon/road/traveler formulas when a batch starts to look too similar.

## Non-Negotiables

- Production artwork uses Google Imagen only.
- Reference assets are internal source material and must not be republished as generated covers.
- Final masters preserve raw 3:4 provider output and derive deterministic 2:3 Tome assets.
- Artwork is textless; title, author, badges, and labels are rendered separately in Tome code.
`)
}

async function sha256File(filePath: string): Promise<string> {
  return createHash("sha256").update(await readFile(filePath)).digest("hex")
}

function quant(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value / 32) * 32))
}

function hex(value: number): string {
  return value.toString(16).padStart(2, "0")
}

function toPosix(value: string): string {
  return value.split(path.sep).join("/")
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}
