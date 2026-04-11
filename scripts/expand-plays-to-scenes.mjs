#!/usr/bin/env node
/**
 * Expand play content from act-level chapters to scene-level chapters.
 *
 * For each play that has act-level chapters with embedded scene markers (<h3>Scene X</h3>),
 * this script:
 * 1. Splits act HTML into individual scene files
 * 2. Regenerates meta.json with scene-level entries
 * 3. Keeps non-act chapters (Dramatis Personae, Prologue, Epilogue, etc.) as-is
 *
 * Usage: node scripts/expand-plays-to-scenes.mjs [--dry-run] [--book <id>]
 */

import fs from "fs"
import path from "path"

const CONTENT_DIR = path.resolve("public/content")
const DRY_RUN = process.argv.includes("--dry-run")
const SINGLE_BOOK = process.argv.includes("--book")
  ? process.argv[process.argv.indexOf("--book") + 1]
  : null

// Regex to detect act-level chapters
const ACT_PATTERN = /^act\s+[ivxlcdm\d]+$/i

// Regex to split HTML on scene headers — matches <h3><span>Scene</span> <span>I</span></h3> etc.
// We split BEFORE each scene header
const SCENE_SPLIT_RE = /(?=<h3[^>]*>\s*(?:<span[^>]*>)?\s*Scene\s*(?:<\/span>\s*<span[^>]*>)?\s*[IVXLCDM\d]+\s*(?:<\/span>)?\s*<\/h3>)/i

// Extract scene number from a scene HTML chunk
function extractSceneTitle(html) {
  const m = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i)
  if (!m) return null
  // Strip tags to get plain text
  const plain = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  return plain // e.g. "Scene I", "Scene II"
}

// Count words in HTML (strip tags)
function countWords(html) {
  const text = html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()
  if (!text) return 0
  return text.split(/\s+/).length
}

function processBook(bookId) {
  const bookDir = path.join(CONTENT_DIR, bookId)
  if (!fs.existsSync(bookDir)) return null

  const metaPath = path.join(bookDir, "meta.json")
  if (!fs.existsSync(metaPath)) return null

  const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))

  // Check if already expanded (has Scene titles in meta)
  const hasScenes = meta.chapters?.some(c => /^scene\s/i.test(c.title))
  if (hasScenes) return { bookId, status: "already-expanded", chapters: meta.chapterCount }

  // Check if any chapters are acts with scene content
  const actChapters = []
  const nonActChapters = []

  for (const ch of meta.chapters) {
    const chPath = path.join(bookDir, `ch-${ch.index}.json`)
    if (!fs.existsSync(chPath)) continue

    const chData = JSON.parse(fs.readFileSync(chPath, "utf8"))

    if (ACT_PATTERN.test(ch.title)) {
      // Check if this act contains scene markers
      const scenes = chData.html.match(/<h3[^>]*>[\s\S]*?Scene[\s\S]*?<\/h3>/gi)
      if (scenes && scenes.length > 0) {
        actChapters.push({ ...ch, html: chData.html, sceneCount: scenes.length })
      } else {
        // Act without scene markers — keep as leaf
        nonActChapters.push({ ...ch, html: chData.html, isAct: true })
      }
    } else {
      nonActChapters.push({ ...ch, html: chData.html, isAct: false })
    }
  }

  if (actChapters.length === 0) return { bookId, status: "no-scenes-to-split", chapters: meta.chapterCount }

  // Build new chapter list
  const newChapters = []
  let newIndex = 0

  // Process in original order
  const allOriginal = [...meta.chapters].sort((a, b) => a.index - b.index)

  for (const orig of allOriginal) {
    const actData = actChapters.find(a => a.index === orig.index)

    if (actData) {
      // This is an act with scenes — split it
      // First, add the act container entry (0 words, just a structural marker)
      // Extract the act heading HTML (everything before first scene)
      const parts = actData.html.split(SCENE_SPLIT_RE)

      // parts[0] is everything before the first scene (act heading, possibly empty)
      // parts[1..n] are the scene chunks

      const actHtml = parts[0].trim()
      newChapters.push({
        index: newIndex,
        title: actData.title,
        wordCount: 0,
        estimatedMinutes: 0,
        html: actHtml || `<p>${actData.title}</p>`,
      })
      newIndex++

      // Add each scene
      for (let i = 1; i < parts.length; i++) {
        const sceneHtml = parts[i].trim()
        const sceneTitle = extractSceneTitle(sceneHtml) || `Scene ${i}`
        const wc = countWords(sceneHtml)
        newChapters.push({
          index: newIndex,
          title: sceneTitle,
          wordCount: wc,
          estimatedMinutes: Math.max(1, Math.round(wc / 200)),
          html: sceneHtml,
        })
        newIndex++
      }
    } else {
      // Non-act chapter — keep as-is
      const nonAct = nonActChapters.find(n => n.index === orig.index)
      if (nonAct) {
        newChapters.push({
          index: newIndex,
          title: nonAct.title,
          wordCount: nonAct.wordCount || countWords(nonAct.html),
          estimatedMinutes: nonAct.estimatedMinutes || Math.max(1, Math.round(countWords(nonAct.html) / 200)),
          html: nonAct.html,
        })
        newIndex++
      }
    }
  }

  if (DRY_RUN) {
    console.log(`[DRY RUN] ${bookId}: ${meta.chapterCount} → ${newChapters.length} chapters`)
    newChapters.forEach(c => console.log(`  ${c.index}: ${c.title} (${c.wordCount} words)`))
    return { bookId, status: "would-expand", from: meta.chapterCount, to: newChapters.length }
  }

  // Delete old chapter files
  const oldFiles = fs.readdirSync(bookDir).filter(f => f.startsWith("ch-") && f.endsWith(".json"))
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(bookDir, f))
  }

  // Write new chapter files
  for (const ch of newChapters) {
    const chData = {
      bookId,
      chapterIndex: ch.index,
      title: ch.title,
      wordCount: ch.wordCount,
      estimatedMinutes: ch.estimatedMinutes,
      html: ch.html,
    }
    fs.writeFileSync(
      path.join(bookDir, `ch-${ch.index}.json`),
      JSON.stringify(chData, null, 2) + "\n"
    )
  }

  // Update meta.json
  const totalWords = newChapters.reduce((sum, c) => sum + c.wordCount, 0)
  const totalMinutes = newChapters.reduce((sum, c) => sum + c.estimatedMinutes, 0)

  const newMeta = {
    bookId: meta.bookId,
    title: meta.title,
    author: meta.author,
    chapterCount: newChapters.length,
    totalWords,
    totalEstimatedMinutes: totalMinutes,
    chapters: newChapters.map(c => ({
      index: c.index,
      title: c.title,
      wordCount: c.wordCount,
      estimatedMinutes: c.estimatedMinutes,
    })),
  }

  fs.writeFileSync(metaPath, JSON.stringify(newMeta, null, 2) + "\n")

  return { bookId, status: "expanded", from: meta.chapterCount, to: newChapters.length }
}

// Get list of plays to process
function getPlayBookIds() {
  if (SINGLE_BOOK) return [SINGLE_BOOK]

  // Read all content directories and check for act-pattern chapters
  const dirs = fs.readdirSync(CONTENT_DIR).filter(d => {
    const stat = fs.statSync(path.join(CONTENT_DIR, d))
    if (!stat.isDirectory()) return false
    const metaPath = path.join(CONTENT_DIR, d, "meta.json")
    if (!fs.existsSync(metaPath)) return false
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
    return meta.chapters?.some(c => ACT_PATTERN.test(c.title))
  })
  return dirs
}

// Main
const bookIds = getPlayBookIds()
console.log(`Found ${bookIds.length} plays with act-level chapters`)

const results = []
for (const id of bookIds) {
  const result = processBook(id)
  if (result) {
    results.push(result)
    if (result.status === "expanded") {
      console.log(`✓ ${id}: ${result.from} → ${result.to} chapters`)
    } else {
      console.log(`  ${id}: ${result.status}`)
    }
  }
}

const expanded = results.filter(r => r.status === "expanded")
console.log(`\nDone. Expanded ${expanded.length} plays.`)
if (expanded.length > 0) {
  console.log("\nRemember to update src/data/chapters.ts and src/data/books.ts!")
}
