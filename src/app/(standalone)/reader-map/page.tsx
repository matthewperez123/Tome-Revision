"use client"

/**
 * Headless canonical page-map harness (codex spec §5.4).
 *
 * Renders nothing meaningful — it exists so a headless browser (see
 * scripts/reader/backfill-page-maps.ts) can load `/reader-map?book=<slug>`,
 * let the real DOM lay out every chapter at the CANONICAL typography
 * (Literata 16/24, justified, hyphens none, recto-open off), and read the
 * resulting folio map from `window.__pageMap`.
 *
 * Uses the exact same shared measurement code as the live reader
 * (`computeBookFolioMap` in @/lib/reader/folio-map), so a stored map can
 * never disagree with what a reader at default settings sees.
 */

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { getBook, getChapters } from "@/lib/content"
import type { TomeBook, BookPart } from "@/data/books"
import type { TomeChapter } from "@/data/chapters"
import { CODEX } from "@/lib/reader/codex-spec"
import { computeBookFolioMap, type FolioMap } from "@/lib/reader/folio-map"

declare global {
  interface Window {
    __pageMap?:
      | { status: "pending"; bookId: string }
      | { status: "error"; bookId: string; message: string }
      | ({
          status: "done"
          bookId: string
          specVersion: number
          fontSizePx: number
          lineHeight: number
          openRecto: boolean
          totalPages: number
        } & FolioMap)
  }
}

/** Mirrors the reader's genre → content-type-class mapping (kept tiny here:
 *  the canonical map only needs the same CSS bucket the reader would use). */
function contentTypeClassFor(genres: string[]): string {
  const hasExplicitDrama = genres.some(g => g === "Drama" || g === "History Play")
  const isNovel = genres.some(g => g.includes("Novel") || g.includes("Short Stor"))
  if (hasExplicitDrama && !isNovel) return "content-drama"
  const hasVerse = genres.some(g =>
    ["Poetry", "Epic Poetry", "War Poetry", "Didactic Poetry",
     "Mythological Poetry", "Novel in Verse", "Verse"].some(v => g === v)
  )
  const hasEpic = genres.some(g => ["Epic", "National Epic"].includes(g))
  if ((hasVerse || hasEpic) && !isNovel) return "content-verse"
  return "content-prose"
}

function ReaderMapHarness() {
  const params = useSearchParams()
  const bookId = params.get("book") ?? ""
  const [status, setStatus] = useState("waiting for ?book=")

  useEffect(() => {
    if (!bookId) return
    let cancelled = false
    window.__pageMap = { status: "pending", bookId }
    setStatus(`measuring ${bookId}…`)

    const book = getBook(bookId)
    const chapters = getChapters(bookId)
    if (!book || chapters.length === 0) {
      window.__pageMap = { status: "error", bookId, message: "unknown book or no chapters" }
      setStatus(`error: unknown book ${bookId}`)
      return
    }

    // Header chrome derivation — must be byte-identical to the live reader's
    // chapterHeaderPartsFor (read/[bookId]/page.tsx): parts matched by partId,
    // subtitle only on the part's first chapter.
    const tomeBook = book as TomeBook
    const parts: BookPart[] | undefined = tomeBook.parts
    const headerParts = (i: number) => {
      const ch = chapters[i] as TomeChapter | undefined
      const part = parts?.find(p => p.id === ch?.partId)
      const eyebrow = part ? `${book.title} · ${part.title}` : book.title
      let subtitle: string | undefined
      if (part?.subtitle) {
        const firstIdx = chapters.findIndex(c => (c as TomeChapter).partId === part.id)
        if (firstIdx === i) subtitle = part.subtitle
      }
      return { eyebrow, title: ch?.title ?? "", subtitle }
    }

    ;(async () => {
      try {
        const map = await computeBookFolioMap({
          bookId,
          chapterTitles: chapters.map(c => c.title ?? ""),
          headerParts,
          contentTypeClass: contentTypeClassFor(tomeBook.genres ?? []),
          // Canonical typography — the codex defaults, NOT any user prefs.
          fontSizePx: CODEX.bodyFontPx,
          lineHeight: CODEX.bodyLinePx / CODEX.bodyFontPx,
          justify: true,
          a11yFace: false,
          openRecto: false,
          isCancelled: () => cancelled,
        })
        if (cancelled || !map) return
        const totalPages = map.counts.reduce((a, b) => a + b, 0)
        window.__pageMap = {
          status: "done",
          bookId,
          specVersion: 1,
          fontSizePx: CODEX.bodyFontPx,
          lineHeight: CODEX.bodyLinePx / CODEX.bodyFontPx,
          openRecto: false,
          totalPages,
          ...map,
        }
        setStatus(`done: ${bookId} → ${totalPages} pages / ${map.counts.length} chapters`)
      } catch (e) {
        if (cancelled) return
        window.__pageMap = { status: "error", bookId, message: String(e) }
        setStatus(`error: ${String(e)}`)
      }
    })()
    return () => { cancelled = true }
  }, [bookId])

  return (
    <main style={{ fontFamily: "monospace", padding: 24 }}>
      <p data-harness-status>{status}</p>
    </main>
  )
}

export default function ReaderMapPage() {
  return (
    <Suspense fallback={null}>
      <ReaderMapHarness />
    </Suspense>
  )
}
