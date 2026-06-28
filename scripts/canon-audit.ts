#!/usr/bin/env npx tsx
// ─────────────────────────────────────────────
// Canon audit — Step 0 preflight, run every time.
// Re-derives all worklists from live row counts (never trusts
// ingestion_status or in-memory state) and writes canon-progress.json so the
// pipeline is resumable across sessions.
//
// Run: node --import ./node_modules/tsx/dist/loader.mjs scripts/canon-audit.ts
//      (add --json to print the full worklists)
// ─────────────────────────────────────────────

import { getClient, fetchAuditData, buildWorklists, writeCheckpoint, type Checkpoint } from './canon-lib'

async function main() {
  const printJson = process.argv.includes('--json')
  const client = getClient()
  const data = await fetchAuditData(client)
  const wl = buildWorklists(data)
  const s = wl.summary

  const perChapterBacklog = s.chaptersTotalIngested * 3 * 10

  console.log('── Canon audit ───────────────────────────────')
  console.log(`books total:                 ${s.booksTotal}`)
  console.log(`  status='success' (noisy):  ${s.statusSuccess}`)
  console.log(`books with chapters:         ${s.booksWithChapters}`)
  console.log(`chapters ingested (total):   ${s.chaptersTotalIngested}`)
  console.log(`books w/ any quiz:           ${s.booksWithQuizzes}`)
  console.log(`books w/ full whole-book set:${s.booksFullWholeBookSet}`)
  console.log(`chapter-scoped quizzes:      ${s.chapterScopedQuizzes}`)
  console.log(`chapters w/ full per-ch set: ${s.chaptersWithFullPerChapterSet}`)
  console.log('── Worklists ─────────────────────────────────')
  console.log(`① ingestion (0 chapters):    ${wl.ingestion.length} books`)
  console.log(`② whole-book quiz gap:       ${wl.wholeBookQuiz.length} ingested books`)
  console.log(`③ per-chapter quiz gap:      ${wl.perChapter.length} chapters`)
  console.log('── Scope estimate ────────────────────────────')
  console.log(`per-chapter Qs for ingested backlog: ~${perChapterBacklog.toLocaleString()} (${s.chaptersTotalIngested} ch × 3 × 10)`)
  console.log('──────────────────────────────────────────────')
  console.log('Top 10 ingestion targets (tier1 → featured → A–Z):')
  for (const b of wl.ingestion.slice(0, 10)) console.log(`   ${b.id}  —  ${b.title}`)

  const cp: Checkpoint = {
    updatedAt: new Date().toISOString(),
    summary: s,
    worklistSizes: {
      ingestion: wl.ingestion.length,
      wholeBookQuiz: wl.wholeBookQuiz.length,
      perChapter: wl.perChapter.length,
    },
    scopeEstimate: { perChapterQuestionsForIngestedBacklog: perChapterBacklog },
    notes: 'Derived from live row counts. Worklists re-derive on every run.',
  }
  writeCheckpoint(cp)
  console.log(`\nCheckpoint written → scripts/canon-progress.json`)

  if (printJson) {
    console.log('\n── Full worklists (JSON) ──')
    console.log(JSON.stringify(wl, null, 2))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
