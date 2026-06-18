#!/usr/bin/env node

import fs from "node:fs/promises"
import path from "node:path"
import process from "node:process"
import sharp from "sharp"

const DEFAULT_SOURCE_DIR = "/Users/matthewperez/Downloads/Cover Tests For Codex"
const DEFAULT_OUT_DIR = "public/covers/app-ready"
const DEFAULT_REVIEW_DIR =
  "public/art-factory/review/2026-06-17/cover-tests-for-codex/app-ready"
const TARGET_WIDTH = 1024
const TARGET_HEIGHT = 1536
const THUMB_WIDTH = 512
const THUMB_HEIGHT = 768
const TARGET_RATIO = TARGET_WIDTH / TARGET_HEIGHT

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"])

function parseArgs(argv) {
  const options = {
    source: DEFAULT_SOURCE_DIR,
    out: DEFAULT_OUT_DIR,
    review: DEFAULT_REVIEW_DIR,
    limit: 240,
    minFrontScore: 0.38,
    sampleWidth: 256,
    reviewCount: 72,
    enhance: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    const next = argv[i + 1]
    if (arg === "--source" && next) {
      options.source = next
      i += 1
    } else if (arg === "--out" && next) {
      options.out = next
      i += 1
    } else if (arg === "--review" && next) {
      options.review = next
      i += 1
    } else if (arg === "--limit" && next) {
      options.limit = Number.parseInt(next, 10)
      i += 1
    } else if (arg === "--min-front-score" && next) {
      options.minFrontScore = Number.parseFloat(next)
      i += 1
    } else if (arg === "--review-count" && next) {
      options.reviewCount = Number.parseInt(next, 10)
      i += 1
    } else if (arg === "--enhance") {
      options.enhance = true
    } else if (arg === "--help" || arg === "-h") {
      printHelp()
      process.exit(0)
    } else {
      throw new Error(`Unknown option: ${arg}`)
    }
  }

  if (!Number.isFinite(options.limit) || options.limit < 0) {
    throw new Error("--limit must be 0 or a positive integer")
  }
  if (!Number.isFinite(options.minFrontScore)) {
    throw new Error("--min-front-score must be a number")
  }

  return options
}

function printHelp() {
  console.log(`Prepare generated cover art for Tome.

Usage:
  node scripts/prepare-cover-library.mjs [options]

Options:
  --source <dir>           Source cover library.
                           Default: ${DEFAULT_SOURCE_DIR}
  --out <dir>              Output folder under the app public tree.
                           Default: ${DEFAULT_OUT_DIR}
  --review <dir>           Review artifacts folder.
                           Default: ${DEFAULT_REVIEW_DIR}
  --limit <n>              Number of ranked front covers to export.
                           Use 0 to export every eligible front cover.
                           Default: 240
  --min-front-score <n>    Minimum front-cover score before export.
                           Default: 0.38
  --review-count <n>       Number of exported covers in the review sheet.
                           Default: 72
  --enhance                Apply very light resize sharpening only.
`)
}

async function listImages(sourceDir) {
  const entries = await fs.readdir(sourceDir, { withFileTypes: true })
  const images = []

  for (const entry of entries) {
    if (!entry.isFile()) continue
    const extension = path.extname(entry.name).toLowerCase()
    if (!IMAGE_EXTENSIONS.has(extension)) continue
    images.push(path.join(sourceDir, entry.name))
  }

  return images.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
}

async function analyzeImage(file, sampleWidth) {
  const image = sharp(file).rotate()
  const metadata = await image.metadata()
  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not read dimensions for ${file}`)
  }

  const sample = await sharp(file)
    .rotate()
    .resize({ width: sampleWidth, withoutEnlargement: true })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const { data, info } = sample
  const { width, height, channels } = info
  const background = estimateBackground(data, width, height, channels)
  const stats = pixelStats(data, width, height, channels, background)
  const mask = makeInterestingMask(data, width, height, channels, background)
  const textMetrics = detectTextMetrics(data, width, height, channels, background)
  const dilated = dilateMask(mask, width, height, 3)
  const components = connectedComponents(dilated, width, height)
    .map((component) => scoreComponent(component, width, height))
    .filter((component) => component.area > Math.max(18, width * height * 0.0006))
    .sort((a, b) => b.componentScore - a.componentScore)

  const best = components[0] ?? fallbackComponent(width, height)
  const componentCrop = componentToSourceCrop(best, width, height, metadata.width, metadata.height)
  const artCrop = artBandToSourceCrop(mask, width, height, metadata.width, metadata.height, textMetrics)
  const crop = artCrop ?? componentCrop
  const cropAreaRatio = (crop.width * crop.height) / (metadata.width * metadata.height)
  const cropStats = estimateCropStats(
    data,
    width,
    height,
    channels,
    sourceCropToSampleCrop(crop, metadata, width, height),
    background,
  )
  const textBands = textMetrics.upperBands.length
  const frontScore = scoreFrontCover(best, stats, cropStats, textBands, width, height, cropAreaRatio)
  const rankScore = scoreRank(best, stats, cropStats, textBands, frontScore, width, height, cropAreaRatio)

  return {
    sourcePath: file,
    sourceName: path.basename(file),
    sourceWidth: metadata.width,
    sourceHeight: metadata.height,
    crop,
    textBands,
    textMetrics: {
      lastUpperTextBottomRatio: textMetrics.lastUpperBottom >= 0 ? round(textMetrics.lastUpperBottom / height) : null,
      firstLowerTextTopRatio: textMetrics.firstLowerTop < height ? round(textMetrics.firstLowerTop / height) : null,
    },
    frontScore: round(frontScore),
    rankScore: round(rankScore),
    imageStats: {
      averageSaturation: round(stats.averageSaturation),
      colorPixelRatio: round(stats.colorPixelRatio),
      whitePixelRatio: round(stats.whitePixelRatio),
      darkPixelRatio: round(stats.darkPixelRatio),
      detailScore: round(stats.detailScore),
      backgroundPixelRatio: round(stats.backgroundPixelRatio),
    },
    cropStats: {
      whitePixelRatio: round(cropStats.whitePixelRatio),
      colorPixelRatio: round(cropStats.colorPixelRatio),
      cropAreaRatio: round(cropAreaRatio),
      backgroundPixelRatio: round(cropStats.backgroundPixelRatio),
    },
    background: {
      r: background.r,
      g: background.g,
      b: background.b,
      threshold: round(background.threshold),
    },
    component: {
      areaRatio: round(best.area / (width * height)),
      widthRatio: round((best.maxX - best.minX + 1) / width),
      heightRatio: round((best.maxY - best.minY + 1) / height),
      centerX: round(((best.minX + best.maxX) / 2) / width),
      centerY: round(((best.minY + best.maxY) / 2) / height),
    },
  }
}

function estimateBackground(data, width, height, channels) {
  const marginX = Math.max(2, Math.round(width * 0.055))
  const marginY = Math.max(2, Math.round(height * 0.055))
  const borderPixels = []

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const onBorder = x < marginX || x >= width - marginX || y < marginY || y >= height - marginY
      if (!onBorder) continue
      const i = (y * width + x) * channels
      borderPixels.push([data[i], data[i + 1], data[i + 2]])
    }
  }

  const r = median(borderPixels.map((pixel) => pixel[0]))
  const g = median(borderPixels.map((pixel) => pixel[1]))
  const b = median(borderPixels.map((pixel) => pixel[2]))
  const distances = borderPixels.map((pixel) => colorDistance(pixel[0], pixel[1], pixel[2], r, g, b))
  const spread = median(distances)
  const threshold = clamp(spread * 2.8 + 24, 34, 82)
  const [luma, saturation, chroma] = pixelShape(r, g, b)

  return { r, g, b, luma, saturation, chroma, threshold }
}

function pixelStats(data, width, height, channels, background) {
  let saturationSum = 0
  let colorPixels = 0
  let whitePixels = 0
  let darkPixels = 0
  let backgroundPixels = 0
  let detailSum = 0
  const total = width * height

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels
      const [luma, saturation, chroma] = pixelShape(data[i], data[i + 1], data[i + 2])
      const backgroundLike = isBackgroundLike(data[i], data[i + 1], data[i + 2], luma, background)
      saturationSum += saturation
      if (!backgroundLike && saturation > 0.11 && chroma > 18 && luma < 246) colorPixels += 1
      if (isPaperWhite(data[i], data[i + 1], data[i + 2], luma, chroma)) whitePixels += 1
      if (luma < 115) darkPixels += 1
      if (backgroundLike) backgroundPixels += 1
      if (x > 0 && y > 0) {
        const prevX = i - channels
        const prevY = i - width * channels
        detailSum +=
          Math.abs(data[i] - data[prevX]) +
          Math.abs(data[i + 1] - data[prevX + 1]) +
          Math.abs(data[i + 2] - data[prevX + 2]) +
          Math.abs(data[i] - data[prevY]) +
          Math.abs(data[i + 1] - data[prevY + 1]) +
          Math.abs(data[i + 2] - data[prevY + 2])
      }
    }
  }

  return {
    averageSaturation: saturationSum / total,
    colorPixelRatio: colorPixels / total,
    whitePixelRatio: whitePixels / total,
    darkPixelRatio: darkPixels / total,
    backgroundPixelRatio: backgroundPixels / total,
    detailScore: Math.min(1, detailSum / total / 260),
  }
}

function makeInterestingMask(data, width, height, channels, background) {
  const mask = new Uint8Array(width * height)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const [luma, saturation, chroma] = pixelShape(r, g, b)
      const paper = isPaperWhite(r, g, b, luma, chroma) || isBackgroundLike(r, g, b, luma, background)
      const colorfulArt = saturation > 0.1 && chroma > 16 && luma < 247
      const darkInkOrLine = luma < 158 && chroma > 6
      const texturedMidtone = chroma > 24 && luma > 80 && luma < 238

      if (!paper && (colorfulArt || darkInkOrLine || texturedMidtone)) {
        mask[y * width + x] = 1
      }
    }
  }

  return mask
}

function pixelShape(r, g, b) {
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const chroma = max - min
  const saturation = max === 0 ? 0 : chroma / max
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b
  return [luma, saturation, chroma]
}

function isPaperWhite(r, g, b, luma, chroma) {
  return luma > 226 && chroma < 34 && r > 218 && g > 212 && b > 202
}

function isBackgroundLike(r, g, b, luma, background) {
  const distance = colorDistance(r, g, b, background.r, background.g, background.b)
  const lumaDistance = Math.abs(luma - background.luma)
  return distance < background.threshold && lumaDistance < 58
}

function colorDistance(r1, g1, b1, r2, g2, b2) {
  return Math.sqrt((r1 - r2) ** 2 + (g1 - g2) ** 2 + (b1 - b2) ** 2)
}

function median(values) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) return Math.round((sorted[middle - 1] + sorted[middle]) / 2)
  return sorted[middle]
}

function dilateMask(mask, width, height, radius) {
  const out = new Uint8Array(mask.length)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      let found = false
      for (let oy = -radius; oy <= radius && !found; oy += 1) {
        const yy = y + oy
        if (yy < 0 || yy >= height) continue
        for (let ox = -radius; ox <= radius; ox += 1) {
          const xx = x + ox
          if (xx < 0 || xx >= width) continue
          if (mask[yy * width + xx]) {
            found = true
            break
          }
        }
      }
      if (found) out[y * width + x] = 1
    }
  }

  return out
}

function connectedComponents(mask, width, height) {
  const visited = new Uint8Array(mask.length)
  const components = []
  const queueX = new Int32Array(mask.length)
  const queueY = new Int32Array(mask.length)

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = y * width + x
      if (!mask[index] || visited[index]) continue

      let head = 0
      let tail = 0
      let area = 0
      let minX = x
      let maxX = x
      let minY = y
      let maxY = y

      queueX[tail] = x
      queueY[tail] = y
      tail += 1
      visited[index] = 1

      while (head < tail) {
        const cx = queueX[head]
        const cy = queueY[head]
        head += 1
        area += 1
        if (cx < minX) minX = cx
        if (cx > maxX) maxX = cx
        if (cy < minY) minY = cy
        if (cy > maxY) maxY = cy

        for (let oy = -1; oy <= 1; oy += 1) {
          for (let ox = -1; ox <= 1; ox += 1) {
            if (ox === 0 && oy === 0) continue
            const nx = cx + ox
            const ny = cy + oy
            if (nx < 0 || nx >= width || ny < 0 || ny >= height) continue
            const nIndex = ny * width + nx
            if (!mask[nIndex] || visited[nIndex]) continue
            visited[nIndex] = 1
            queueX[tail] = nx
            queueY[tail] = ny
            tail += 1
          }
        }
      }

      components.push({ area, minX, maxX, minY, maxY })
    }
  }

  return components
}

function scoreComponent(component, width, height) {
  const componentWidth = component.maxX - component.minX + 1
  const componentHeight = component.maxY - component.minY + 1
  const areaRatio = component.area / (width * height)
  const widthRatio = componentWidth / width
  const heightRatio = componentHeight / height
  const centerX = (component.minX + component.maxX) / 2 / width
  const centerY = (component.minY + component.maxY) / 2 / height
  const centered = clamp(1 - Math.abs(centerX - 0.5) * 1.8, 0, 1)
  const verticalPlacement = centerY > 0.18 && centerY < 0.86 ? 1 : 0.68
  const textLikePenalty = heightRatio < 0.13 ? 0.15 : 1
  const substantialArtBonus = clamp(heightRatio * 1.55, 0.35, 1.35)

  return {
    ...component,
    componentScore:
      areaRatio *
      (0.8 + centered * 0.55) *
      verticalPlacement *
      textLikePenalty *
      substantialArtBonus *
      clamp(widthRatio * 1.35, 0.35, 1.2),
  }
}

function fallbackComponent(width, height) {
  return scoreComponent(
    {
      area: Math.round(width * height * 0.2),
      minX: Math.round(width * 0.15),
      maxX: Math.round(width * 0.85),
      minY: Math.round(height * 0.24),
      maxY: Math.round(height * 0.82),
    },
    width,
    height,
  )
}

function componentToSourceCrop(component, sampleWidth, sampleHeight, sourceWidth, sourceHeight) {
  const padX = Math.round((component.maxX - component.minX + 1) * 0.045)
  const padY = Math.round((component.maxY - component.minY + 1) * 0.045)
  const sampleCrop = {
    left: clamp(component.minX - padX, 0, sampleWidth - 1),
    top: clamp(component.minY - padY, 0, sampleHeight - 1),
    right: clamp(component.maxX + padX, 0, sampleWidth - 1),
    bottom: clamp(component.maxY + padY, 0, sampleHeight - 1),
  }

  let left = Math.floor((sampleCrop.left / sampleWidth) * sourceWidth)
  let top = Math.floor((sampleCrop.top / sampleHeight) * sourceHeight)
  let right = Math.ceil(((sampleCrop.right + 1) / sampleWidth) * sourceWidth)
  let bottom = Math.ceil(((sampleCrop.bottom + 1) / sampleHeight) * sourceHeight)

  if (right - left < sourceWidth * 0.22 || bottom - top < sourceHeight * 0.22) {
    left = Math.round(sourceWidth * 0.12)
    top = Math.round(sourceHeight * 0.22)
    right = Math.round(sourceWidth * 0.88)
    bottom = Math.round(sourceHeight * 0.82)
  }

  left = clamp(left, 0, sourceWidth - 2)
  top = clamp(top, 0, sourceHeight - 2)
  right = clamp(right, left + 2, sourceWidth)
  bottom = clamp(bottom, top + 2, sourceHeight)

  return {
    left,
    top,
    width: right - left,
    height: bottom - top,
  }
}

function artBandToSourceCrop(mask, sampleWidth, sampleHeight, sourceWidth, sourceHeight, textMetrics) {
  const rowRatios = new Float32Array(sampleHeight)

  for (let y = 0; y < sampleHeight; y += 1) {
    let count = 0
    for (let x = 0; x < sampleWidth; x += 1) {
      if (mask[y * sampleWidth + x]) count += 1
    }
    rowRatios[y] = count / sampleWidth
  }

  const smoothed = new Float32Array(sampleHeight)
  for (let y = 0; y < sampleHeight; y += 1) {
    let sum = 0
    let samples = 0
    for (let offset = -2; offset <= 2; offset += 1) {
      const yy = y + offset
      if (yy < 0 || yy >= sampleHeight) continue
      sum += rowRatios[yy]
      samples += 1
    }
    smoothed[y] = sum / samples
  }

  const bands = []
  let activeStart = -1
  const threshold = 0.085
  for (let y = 0; y < sampleHeight; y += 1) {
    const active = smoothed[y] > threshold
    if (active && activeStart < 0) {
      activeStart = y
    } else if (!active && activeStart >= 0) {
      bands.push({ start: activeStart, end: y - 1 })
      activeStart = -1
    }
  }
  if (activeStart >= 0) bands.push({ start: activeStart, end: sampleHeight - 1 })

  const merged = []
  for (const band of bands) {
    const last = merged[merged.length - 1]
    if (last && band.start - last.end <= 5) {
      last.end = band.end
    } else {
      merged.push({ ...band })
    }
  }

  const textClearStart =
    textMetrics.lastUpperBottom >= 0 && textMetrics.lastUpperBottom < sampleHeight * 0.68
      ? textMetrics.lastUpperBottom + Math.round(sampleHeight * 0.018)
      : Math.round(sampleHeight * 0.18)
  const lowerTextCut =
    textMetrics.firstLowerTop < sampleHeight
      ? textMetrics.firstLowerTop - Math.round(sampleHeight * 0.018)
      : sampleHeight - Math.round(sampleHeight * 0.08)

  let bestBand = null
  for (const band of merged) {
    const start = Math.max(band.start, textClearStart)
    const end = Math.min(band.end, lowerTextCut)
    const height = end - start + 1
    if (height < sampleHeight * 0.12) continue

    let area = 0
    for (let y = start; y <= end; y += 1) area += smoothed[y]

    const centerY = (start + end) / 2 / sampleHeight
    const heightRatio = height / sampleHeight
    const verticalBonus = centerY > 0.28 && centerY < 0.82 ? 1.18 : 0.76
    const score = area * (0.5 + heightRatio * 1.7) * verticalBonus

    if (!bestBand || score > bestBand.score) {
      bestBand = { start, end, score }
    }
  }

  if (!bestBand) {
    if (lowerTextCut - textClearStart < sampleHeight * 0.18) return null
    bestBand = {
      start: textClearStart,
      end: lowerTextCut,
      score: 0,
    }
  }

  const columnCounts = new Int32Array(sampleWidth)
  for (let y = bestBand.start; y <= bestBand.end; y += 1) {
    for (let x = 0; x < sampleWidth; x += 1) {
      if (mask[y * sampleWidth + x]) columnCounts[x] += 1
    }
  }

  const bandHeight = bestBand.end - bestBand.start + 1
  const columnThreshold = Math.max(2, Math.round(bandHeight * 0.035))
  let minX = sampleWidth
  let maxX = -1
  for (let x = 0; x < sampleWidth; x += 1) {
    if (columnCounts[x] >= columnThreshold) {
      if (x < minX) minX = x
      if (x > maxX) maxX = x
    }
  }

  if (maxX < minX) return null

  if ((maxX - minX + 1) / sampleWidth < 0.34) {
    const center = (minX + maxX) / 2
    const expandedWidth = sampleWidth * 0.58
    minX = Math.round(center - expandedWidth / 2)
    maxX = Math.round(center + expandedWidth / 2)
  }

  const padX = Math.round((maxX - minX + 1) * 0.045)
  const padY = Math.round((bestBand.end - bestBand.start + 1) * 0.035)
  const leftSample = clamp(minX - padX, 0, sampleWidth - 1)
  const rightSample = clamp(maxX + padX, leftSample + 1, sampleWidth - 1)
  const topSample = clamp(bestBand.start - padY, textClearStart, sampleHeight - 2)
  const bottomSample = clamp(
    Math.max(bestBand.end + padY, lowerTextCut),
    topSample + 1,
    sampleHeight - 1,
  )

  const left = Math.floor((leftSample / sampleWidth) * sourceWidth)
  const top = Math.floor((topSample / sampleHeight) * sourceHeight)
  const right = Math.ceil(((rightSample + 1) / sampleWidth) * sourceWidth)
  const bottom = Math.ceil(((bottomSample + 1) / sampleHeight) * sourceHeight)

  if (right - left < sourceWidth * 0.24 || bottom - top < sourceHeight * 0.18) {
    return null
  }

  return {
    left: clamp(left, 0, sourceWidth - 2),
    top: clamp(top, 0, sourceHeight - 2),
    width: clamp(right - left, 2, sourceWidth - left),
    height: clamp(bottom - top, 2, sourceHeight - top),
  }
}

function sourceCropToSampleCrop(crop, metadata, sampleWidth, sampleHeight) {
  return {
    left: Math.floor((crop.left / metadata.width) * sampleWidth),
    top: Math.floor((crop.top / metadata.height) * sampleHeight),
    width: Math.max(1, Math.ceil((crop.width / metadata.width) * sampleWidth)),
    height: Math.max(1, Math.ceil((crop.height / metadata.height) * sampleHeight)),
  }
}

function estimateCropStats(data, width, height, channels, crop, background) {
  const left = clamp(crop.left, 0, width - 1)
  const top = clamp(crop.top, 0, height - 1)
  const right = clamp(crop.left + crop.width, left + 1, width)
  const bottom = clamp(crop.top + crop.height, top + 1, height)
  let total = 0
  let whitePixels = 0
  let colorPixels = 0
  let backgroundPixels = 0

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const i = (y * width + x) * channels
      const [luma, saturation, chroma] = pixelShape(data[i], data[i + 1], data[i + 2])
      const backgroundLike = isBackgroundLike(data[i], data[i + 1], data[i + 2], luma, background)
      total += 1
      if (isPaperWhite(data[i], data[i + 1], data[i + 2], luma, chroma)) whitePixels += 1
      if (!backgroundLike && saturation > 0.11 && chroma > 18 && luma < 246) colorPixels += 1
      if (backgroundLike) backgroundPixels += 1
    }
  }

  return {
    whitePixelRatio: total ? whitePixels / total : 1,
    colorPixelRatio: total ? colorPixels / total : 0,
    backgroundPixelRatio: total ? backgroundPixels / total : 1,
  }
}

function detectTextMetrics(data, width, height, channels, background) {
  const upperBands = detectTextBands(data, width, height, channels, background, 0, Math.floor(height * 0.58))
  const lowerBands = detectTextBands(
    data,
    width,
    height,
    channels,
    background,
    Math.floor(height * 0.8),
    height,
  )

  return {
    upperBands,
    lowerBands,
    lastUpperBottom: upperBands.length > 0 ? upperBands[upperBands.length - 1][1] : -1,
    firstLowerTop: lowerBands.length > 0 ? lowerBands[0][0] : height,
  }
}

function detectTextBands(data, width, height, channels, background, startY, endY) {
  const bands = []
  let inBand = false
  let start = 0

  for (let y = startY; y < endY; y += 1) {
    let inkPixels = 0
    let transitions = 0
    let previousInk = false

    for (let x = 0; x < width; x += 1) {
      const i = (y * width + x) * channels
      const [luma, saturation, chroma] = pixelShape(data[i], data[i + 1], data[i + 2])
      const backgroundLike = isBackgroundLike(data[i], data[i + 1], data[i + 2], luma, background)
      const ink =
        !backgroundLike &&
        ((luma < background.luma - 19 && chroma > 5) ||
          (luma < 188 && chroma > 6) ||
          (saturation > 0.16 && chroma > 20 && luma < 220))
      if (ink) inkPixels += 1
      if (x > 0 && ink !== previousInk) transitions += 1
      previousInk = ink
    }

    const ratio = inkPixels / width
    const textLikeRow = ratio > 0.015 && ratio < 0.72 && transitions > 4

    if (textLikeRow && !inBand) {
      start = y
      inBand = true
    } else if (!textLikeRow && inBand) {
      if (y - start >= 2) bands.push([start, y - 1])
      inBand = false
    }
  }

  if (inBand && endY - start >= 2) bands.push([start, endY - 1])
  return bands
}

function scoreFrontCover(component, stats, cropStats, textBands, width, height, cropAreaRatio) {
  const componentWidth = component.maxX - component.minX + 1
  const componentHeight = component.maxY - component.minY + 1
  const areaRatio = component.area / (width * height)
  const widthRatio = componentWidth / width
  const heightRatio = componentHeight / height
  const centerX = (component.minX + component.maxX) / 2 / width
  const centerY = (component.minY + component.maxY) / 2 / height
  const centered = clamp(1 - Math.abs(centerX - 0.5) * 1.75, 0, 1)
  const topParagraphPenalty = textBands > 20 && centerY > 0.54 ? 0.26 : 0
  const heavyTextPenalty = textBands > 15 ? 0.1 : 0
  const paperPenalty = cropStats.whitePixelRatio > 0.55 ? 0.12 : 0
  const tinyCropPenalty = cropAreaRatio < 0.18 ? 0.22 : cropAreaRatio < 0.25 ? 0.1 : 0

  return clamp(
    areaRatio * 3.1 +
      heightRatio * 0.28 +
      widthRatio * 0.14 +
      centered * 0.14 +
      stats.colorPixelRatio * 0.38 +
      stats.detailScore * 0.12 -
      topParagraphPenalty -
      heavyTextPenalty -
      paperPenalty -
      tinyCropPenalty -
      (areaRatio > 0.9 && textBands > 6 ? 0.42 : 0),
    0,
    1,
  )
}

function scoreRank(component, stats, cropStats, textBands, frontScore, width, height, cropAreaRatio) {
  const heightRatio = (component.maxY - component.minY + 1) / height
  const textPenalty = Math.max(0, textBands - 12) * 0.009
  const usableCropBonus = clamp(cropAreaRatio * 0.42, 0, 0.18)
  const tinyCropPenalty = cropAreaRatio < 0.18 ? 0.34 : cropAreaRatio < 0.25 ? 0.16 : 0
  return clamp(
    frontScore +
      stats.detailScore * 0.14 +
      stats.colorPixelRatio * 0.1 +
      heightRatio * 0.08 -
      cropStats.whitePixelRatio * 0.08 -
      textPenalty +
      usableCropBonus -
      tinyCropPenalty,
    0,
    1.25,
  )
}

async function exportCover(entry, rank, options) {
  const basename = `cover-${String(rank).padStart(3, "0")}`
  const imageName = `${basename}.jpg`
  const thumbName = `${basename}.jpg`
  const imageOutputPath = path.join(options.out, "images", imageName)
  const thumbOutputPath = path.join(options.out, "thumbs", thumbName)

  let pipeline = sharp(entry.sourcePath)
    .rotate()
    .extract(entry.crop)
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: "cover",
      position: sharp.strategy.attention,
      kernel: sharp.kernel.lanczos3,
    })

  if (options.enhance) {
    pipeline = pipeline.sharpen({ sigma: 0.55, m1: 0.35, m2: 0.12 })
  }

  await pipeline.jpeg({ quality: 92, mozjpeg: true }).toFile(imageOutputPath)

  await sharp(imageOutputPath)
    .resize(THUMB_WIDTH, THUMB_HEIGHT, {
      fit: "cover",
      kernel: sharp.kernel.lanczos3,
    })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(thumbOutputPath)

  return {
    ...entry,
    rank,
    outputPath: imageOutputPath,
    thumbPath: thumbOutputPath,
    publicPath: `/covers/app-ready/images/${imageName}`,
    publicThumbPath: `/covers/app-ready/thumbs/${thumbName}`,
  }
}

async function makeReviewSheet(selected, reviewDir, reviewCount) {
  const sheetEntries = selected.slice(0, reviewCount)
  if (sheetEntries.length === 0) return undefined

  const tileWidth = 150
  const tileHeight = 225
  const labelHeight = 34
  const gap = 18
  const padding = 24
  const columns = 6
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
        <text x="0" y="13" font-family="Arial, sans-serif" font-size="11" fill="#33413d">#${entry.rank} score ${entry.rankScore}</text>
        <text x="0" y="29" font-family="Arial, sans-serif" font-size="9" fill="#766e64">${escapeXml(entry.sourceName).slice(0, 33)}</text>
      </svg>`,
    )
    composites.push({ input: thumb, left, top })
    composites.push({ input: label, left, top: top + tileHeight + 4 })
  }

  const sheetPath = path.join(reviewDir, "review-sheet.jpg")
  await sharp({
    create: {
      width,
      height,
      channels: 3,
      background: "#f4f1e8",
    },
  })
    .composite(composites)
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(sheetPath)

  return sheetPath
}

async function writeReviewHtml(selected, reviewDir) {
  const cards = selected
    .map(
      (entry) => `<article>
  <a href="${entry.publicPath}"><img src="${entry.publicThumbPath}" alt="Prepared cover ${entry.rank}"></a>
  <p><strong>#${entry.rank}</strong> score ${entry.rankScore}</p>
  <p>${escapeHtml(entry.sourceName)}</p>
</article>`,
    )
    .join("\n")

  const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Tome App-Ready Cover Exports</title>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #f4f1e8; color: #27342f; }
    main { max-width: 1280px; margin: 0 auto; padding: 28px; }
    h1 { font-size: 24px; line-height: 1.2; margin: 0 0 8px; letter-spacing: 0; }
    .meta { color: #766e64; margin: 0 0 24px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 18px; }
    article { min-width: 0; }
    img { width: 100%; aspect-ratio: 2 / 3; object-fit: cover; display: block; background: #e6dfd2; box-shadow: 0 1px 5px rgb(39 52 47 / 18%); }
    p { margin: 7px 0 0; font-size: 12px; line-height: 1.3; overflow-wrap: anywhere; }
  </style>
</head>
<body>
  <main>
    <h1>Tome App-Ready Cover Exports</h1>
    <p class="meta">Generated from the supplied cover library only. Click any cover to open the 1024 x 1536 asset.</p>
    <section class="grid">
${cards}
    </section>
  </main>
</body>
</html>
`

  await fs.writeFile(path.join(reviewDir, "index.html"), html)
}

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function escapeHtml(value) {
  return escapeXml(value).replaceAll("'", "&#39;")
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function round(value) {
  return Math.round(value * 1000) / 1000
}

async function ensureDirs(options) {
  await fs.mkdir(path.join(options.out, "images"), { recursive: true })
  await fs.mkdir(path.join(options.out, "thumbs"), { recursive: true })
  await fs.mkdir(options.review, { recursive: true })
}

function toSerializableEntry(entry) {
  return {
    rank: entry.rank,
    sourceName: entry.sourceName,
    sourcePath: entry.sourcePath,
    outputPath: entry.outputPath,
    thumbPath: entry.thumbPath,
    publicPath: entry.publicPath,
    publicThumbPath: entry.publicThumbPath,
    sourceWidth: entry.sourceWidth,
    sourceHeight: entry.sourceHeight,
    crop: entry.crop,
    frontScore: entry.frontScore,
    rankScore: entry.rankScore,
    textBands: entry.textBands,
    textMetrics: entry.textMetrics,
    imageStats: entry.imageStats,
    cropStats: entry.cropStats,
    component: entry.component,
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2))
  await ensureDirs(options)

  const files = await listImages(options.source)
  if (files.length === 0) {
    throw new Error(`No supported images found in ${options.source}`)
  }

  console.log(`Analyzing ${files.length} cover images from ${options.source}`)

  const analyses = []
  for (let index = 0; index < files.length; index += 1) {
    const file = files[index]
    try {
      analyses.push(await analyzeImage(file, options.sampleWidth))
    } catch (error) {
      console.warn(`Skipping ${file}: ${error instanceof Error ? error.message : error}`)
    }
    if ((index + 1) % 100 === 0 || index + 1 === files.length) {
      console.log(`  analyzed ${index + 1}/${files.length}`)
    }
  }

  const ranked = analyses.sort((a, b) => b.rankScore - a.rankScore)
  const eligible = ranked.filter((entry) => entry.frontScore >= options.minFrontScore)
  const selectedBase = options.limit === 0 ? eligible : eligible.slice(0, options.limit)

  console.log(
    `Exporting ${selectedBase.length} app-ready covers from ${eligible.length} eligible front-cover candidates`,
  )

  const selected = []
  for (let index = 0; index < selectedBase.length; index += 1) {
    const exported = await exportCover(selectedBase[index], index + 1, options)
    selected.push(exported)
    if ((index + 1) % 50 === 0 || index + 1 === selectedBase.length) {
      console.log(`  exported ${index + 1}/${selectedBase.length}`)
    }
  }

  const reviewSheetPath = await makeReviewSheet(selected, options.review, options.reviewCount)
  await writeReviewHtml(selected, options.review)

  const generatedAt = new Date().toISOString()
  const manifest = {
    generatedAt,
    sourceDir: options.source,
    outputDir: options.out,
    reviewDir: options.review,
    targetSize: { width: TARGET_WIDTH, height: TARGET_HEIGHT },
    thumbnailSize: { width: THUMB_WIDTH, height: THUMB_HEIGHT },
    analyzedCount: analyses.length,
    eligibleCount: eligible.length,
    selectedCount: selected.length,
    minFrontScore: options.minFrontScore,
    limit: options.limit,
    enhance: options.enhance,
    reviewSheetPath,
    selected: selected.map(toSerializableEntry),
  }

  await fs.writeFile(path.join(options.out, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)
  await fs.writeFile(
    path.join(options.review, "ranked-candidates.json"),
    `${JSON.stringify(ranked, null, 2)}\n`,
  )
  await fs.writeFile(path.join(options.review, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`)

  console.log(`Done.`)
  console.log(`Manifest: ${path.join(options.out, "manifest.json")}`)
  if (reviewSheetPath) console.log(`Review sheet: ${reviewSheetPath}`)
  console.log(`Review gallery: ${path.join(options.review, "index.html")}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
