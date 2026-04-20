#!/usr/bin/env npx tsx
/**
 * For every non-landing Odyssey gloss, try to repair the phrase or drop
 * the gloss. Writes the surviving set to a JSON file for human review,
 * and emits a patch that removes the drops from the .ts source.
 */

import * as fs from "fs"
import * as path from "path"
import { ODYSSEY_GLOSSES, type OdysseyGloss } from "../../src/lib/virgil/odyssey-glosses"

const ROOT = path.resolve(__dirname, "..", "..")
const CONTENT_DIR = path.join(ROOT, "public/content/the-odyssey")
const DIR = path.join(ROOT, "src/lib/virgil/odyssey")
const norm = (s: string) => s.replace(/\uFEFF/g, "")

const cache = new Map<number, string>()
function content(b: number): string {
  if (!cache.has(b)) cache.set(b, norm(JSON.parse(fs.readFileSync(path.join(CONTENT_DIR, `ch-${b}.json`), "utf8")).html))
  return cache.get(b)!
}

interface Patch { g: OdysseyGloss; action: "keep" | "repair" | "drop"; newPhrase?: string; reason?: string }
const patches: Patch[] = []

for (const g of ODYSSEY_GLOSSES) {
  const html = content(g.chapterIndex)
  if (html.includes(norm(g.phrase))) { patches.push({ g, action: "keep" }); continue }

  // Try some known alias corrections
  const tries: string[] = []
  const p = g.phrase
  // common Bryant-vs-my-spelling mappings
  const aliases: Record<string, string[]> = {
    "Achaeans": ["Achaians", "Achaian"],
    "Pisistratus": ["Peisistratus", "Pisistratus"],
    "Peisistratus": ["Pisistratus"],
    "agora": ["assembly", "council"],
    "xenia": ["stranger", "guest"],
    "mētis": ["wiles", "wisdom"],
    "nostos": ["return", "home"],
    "anagnorisis": [],   // not in text; drop
    "Helen": ["Helen"],  // Helen might be in different form
    "Thracian": ["Thracian"],
  }
  const forms = aliases[p] ?? []
  for (const f of forms) if (html.includes(f)) { tries.push(f); break }

  // Try lowercase single-word variants
  if (tries.length === 0 && /^[A-Z]/.test(p) && !p.includes(" ")) {
    const cap = p[0].toUpperCase() + p.slice(1)
    if (html.includes(cap)) tries.push(cap)
  }

  if (tries.length > 0) {
    patches.push({ g, action: "repair", newPhrase: tries[0], reason: `alias ${p}→${tries[0]}` })
  } else {
    patches.push({ g, action: "drop", reason: "phrase not in book content" })
  }
}

const kept = patches.filter(p => p.action === "keep").length
const rep = patches.filter(p => p.action === "repair").length
const drop = patches.filter(p => p.action === "drop").length
console.log(`Glosses: ${patches.length} total → keep ${kept}, repair ${rep}, drop ${drop}`)

// Apply patches to the two source files
function applyToFile(filePath: string, affected: Patch[]) {
  let src = fs.readFileSync(filePath, "utf8")
  for (const p of affected) {
    if (p.action === "keep") continue
    const escPhrase = p.g.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    // Match the full gloss object line by `phrase: "..."` + book index line above
    // We rely on phrase uniqueness within a book (approximate)
    if (p.action === "repair") {
      const re = new RegExp(`(chapterIndex:\\s*${p.g.chapterIndex},\\s*phrase:\\s*)"${escPhrase}"`)
      if (re.test(src)) src = src.replace(re, `$1"${p.newPhrase!.replace(/"/g,'\\"')}"`)
    } else {
      // Drop: remove the whole `{ chapterIndex: X, phrase: "...", definition: "..." }` object line
      const reDrop = new RegExp(`\\s*\\{\\s*chapterIndex:\\s*${p.g.chapterIndex},\\s*phrase:\\s*"${escPhrase}",[\\s\\S]*?\\},?`, "m")
      if (reDrop.test(src)) src = src.replace(reDrop, "")
    }
  }
  fs.writeFileSync(filePath, src, "utf8")
}

const file1 = path.join(DIR, "glosses-1-12.ts")
const file2 = path.join(DIR, "glosses-13-24.ts")
applyToFile(file1, patches.filter(p => p.g.chapterIndex >= 1 && p.g.chapterIndex <= 12))
applyToFile(file2, patches.filter(p => p.g.chapterIndex >= 13 && p.g.chapterIndex <= 24))

console.log(`Patches applied.`)
