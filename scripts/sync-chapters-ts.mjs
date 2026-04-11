#!/usr/bin/env node
/**
 * Sync src/data/chapters.ts entries with the actual content in public/content/
 * for all plays that were expanded by expand-plays-to-scenes.mjs.
 *
 * Also updates chapter counts in src/data/books.ts.
 */

import fs from "fs"
import path from "path"

const CONTENT_DIR = path.resolve("public/content")
const CHAPTERS_TS = path.resolve("src/data/chapters.ts")
const BOOKS_TS = path.resolve("src/data/books.ts")

// Get all expanded plays (those with Scene titles in meta.json)
function getExpandedPlays() {
  const dirs = fs.readdirSync(CONTENT_DIR)
  const plays = []
  for (const d of dirs) {
    const metaPath = path.join(CONTENT_DIR, d, "meta.json")
    if (!fs.existsSync(metaPath)) continue
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"))
    const hasActs = meta.chapters?.some(c => /^act\s/i.test(c.title))
    const hasScenes = meta.chapters?.some(c => /^scene\s/i.test(c.title))
    if (hasActs && hasScenes) {
      plays.push({ bookId: d, meta })
    }
  }
  return plays
}

// Generate chapters.ts entry for a chapter
function genChapterEntry(bookId, ch) {
  return `  {
    id: "${bookId}-ch-${ch.index}",
    bookId: "${bookId}",
    number: ${ch.index},
    title: "${ch.title.replace(/"/g, '\\"')}",
    wordCount: ${ch.wordCount},
    estimatedMinutes: ${ch.estimatedMinutes},
    summary: "",
    quizAvailable: false,
  },`
}

// Replace chapters for a bookId in chapters.ts content
function replaceChaptersInTS(tsContent, bookId, meta) {
  // Find the range of entries for this bookId
  const bookIdStr = `bookId: "${bookId}"`
  const firstIdx = tsContent.indexOf(bookIdStr)
  if (firstIdx === -1) return { content: tsContent, updated: false }

  // Find the start of the first entry's opening brace
  let startBrace = tsContent.lastIndexOf("{", firstIdx)

  // Find the last entry for this bookId
  let lastIdx = firstIdx
  let searchFrom = firstIdx + bookIdStr.length
  while (true) {
    const next = tsContent.indexOf(bookIdStr, searchFrom)
    if (next === -1) break
    lastIdx = next
    searchFrom = next + bookIdStr.length
  }

  // Find the end of the last entry (closing brace + comma)
  let endBrace = tsContent.indexOf("},", lastIdx) + 2

  // Extract the old block
  const oldBlock = tsContent.substring(startBrace, endBrace)

  // Generate new block
  const newEntries = meta.chapters.map(ch => genChapterEntry(bookId, ch))
  const newBlock = newEntries.join("\n")

  return {
    content: tsContent.substring(0, startBrace) + newBlock + tsContent.substring(endBrace),
    updated: true,
  }
}

// Update chapter count in books.ts
function updateBookChapterCount(booksContent, bookId, newCount) {
  // Find the book entry
  const idStr = `id: "${bookId}"`
  const idx = booksContent.indexOf(idStr)
  if (idx === -1) return booksContent

  // Find the chapters: N line after this id
  const afterId = booksContent.substring(idx)
  const chapMatch = afterId.match(/chapters:\s*\d+/)
  if (!chapMatch) return booksContent

  const chapIdx = idx + chapMatch.index
  const oldStr = chapMatch[0]
  const newStr = `chapters: ${newCount}`

  return booksContent.substring(0, chapIdx) + newStr + booksContent.substring(chapIdx + oldStr.length)
}

// Main
const plays = getExpandedPlays()
console.log(`Found ${plays.length} expanded plays to sync`)

let chaptersContent = fs.readFileSync(CHAPTERS_TS, "utf8")
let booksContent = fs.readFileSync(BOOKS_TS, "utf8")

let updatedCount = 0
let booksUpdated = 0

for (const { bookId, meta } of plays) {
  const result = replaceChaptersInTS(chaptersContent, bookId, meta)
  if (result.updated) {
    chaptersContent = result.content
    updatedCount++
  }

  const oldBooksContent = booksContent
  booksContent = updateBookChapterCount(booksContent, bookId, meta.chapterCount)
  if (booksContent !== oldBooksContent) booksUpdated++

  console.log(`  ${bookId}: ${meta.chapterCount} chapters ${result.updated ? '✓' : '(not in chapters.ts)'}`)
}

fs.writeFileSync(CHAPTERS_TS, chaptersContent)
fs.writeFileSync(BOOKS_TS, booksContent)

console.log(`\nDone. Updated ${updatedCount} books in chapters.ts, ${booksUpdated} in books.ts`)
