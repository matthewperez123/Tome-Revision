"use client"

/**
 * BeowulfEnhancements — scholarly apparatus chrome for the anonymous
 * Old English Beowulf (ca. 1000 CE manuscript, 7th-10th c. composition),
 * as presented in John Lesslie Hall's 1892 alliterative-verse translation
 * (the Standard Ebooks edition).
 *
 * Renders, between the chapter H1 and the verse body:
 *   1. A FittHeader block with the Roman numeral, a one-sentence scholarly
 *      argument, and (where this fitt sits inside a known digression) a
 *      digression-aware callout.
 *   2. An edition note acknowledging the Hall translation, the alliterative
 *      form, and the manuscript's single-survivor status.
 *   3. Reader toggles:
 *        • "Highlight alliteration" — subtle gold accent on alliterating
 *          stressed syllables. Default OFF. Off by spec: marked alliteration
 *          on every line is visual noise.
 *        • "Show Old English" — bilingual scaffolding hook. When on, the
 *          reader root receives `data-beowulf-bilingual="1"`; the actual
 *          OE source alignment comes from a later ingestion step.
 *
 * Only active for `bookId === "beowulf"`. Silently no-ops otherwise.
 */

import { useEffect, useRef, useState } from "react"
import { FITT_METADATA } from "@/data/beowulf/fitt-metadata"
import {
  BEOWULF_KENNINGS_BY_ID,
  type Kenning,
} from "@/data/beowulf/kennings"

interface BeowulfEnhancementsProps {
  bookId: string
  currentChapter: number
}

// LocalStorage keys — persist toggles across chapters and reloads.
const LS_ALLITERATION = "beowulf:highlightAlliteration"
const LS_BILINGUAL = "beowulf:showOldEnglish"

// ch-0 = Preface, ch-1 = Introduction ("The Story"), ch-2..ch-44 = Fitts I..XLIII.
function chapterIndexToFittNumber(ci: number): number | null {
  const n = ci - 1 // fitt 1 lives in ch-2 (index 2), so ci - 1 = fitt number
  return n >= 1 && n <= 43 ? n : null
}

export function BeowulfEnhancements({
  bookId,
  currentChapter,
}: BeowulfEnhancementsProps) {
  const [highlightAlliteration, setHighlightAlliteration] = useState(false)
  const [showOldEnglish, setShowOldEnglish] = useState(false)

  // Hydrate toggle state from localStorage on mount.
  useEffect(() => {
    if (typeof window === "undefined") return
    setHighlightAlliteration(
      window.localStorage.getItem(LS_ALLITERATION) === "1"
    )
    setShowOldEnglish(window.localStorage.getItem(LS_BILINGUAL) === "1")
  }, [])

  // Project toggle state onto the [data-reader-text] root so CSS can
  // show/hide the decorations without source-HTML mutation.
  // The verse HTML is injected via dangerouslySetInnerHTML by the
  // paginated reader, which happens AFTER this effect runs on chapter
  // change. We use a MutationObserver to wait for verse line spans to
  // appear, then apply the pass. Idempotent and self-cleaning.
  useEffect(() => {
    if (bookId !== "beowulf") return
    const root = document.querySelector<HTMLElement>("[data-reader-text]")
    if (!root) return
    if (showOldEnglish) {
      root.setAttribute("data-beowulf-bilingual", "1")
      // Inject OE sibling lines when the toggle is on. Non-blocking;
      // silently no-ops if the OE data fetch fails. We call after a
      // short delay so line spans have been mounted.
      window.setTimeout(() => {
        injectOldEnglish(root, currentChapter).catch(() => {})
      }, 400)
    } else {
      root.removeAttribute("data-beowulf-bilingual")
      removeOldEnglish(root)
    }

    let cancelled = false
    const apply = () => {
      if (cancelled) return
      const r = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!r) return false
      if (r.querySelectorAll("[data-beowulf-line]").length === 0) return false
      if (highlightAlliteration) {
        r.setAttribute("data-beowulf-alliteration", "1")
        markAlliteration(r)
      } else {
        r.removeAttribute("data-beowulf-alliteration")
        unmarkAlliteration(r)
      }
      return true
    }
    // Delay the alliteration pass so sister components (BeowulfAnnotations)
    // can place ✦ markers against whole text nodes before we split them
    // into alliterating <em> wrappers. 250ms is enough time for the
    // annotation walker's setTimeout retries to succeed on initial mount.
    const delayedApply = () => {
      if (apply()) return
      const observer = new MutationObserver(() => {
        if (apply()) observer.disconnect()
      })
      const r = document.querySelector<HTMLElement>("[data-reader-text]")
      if (r) observer.observe(r, { childList: true, subtree: true })
      window.setTimeout(() => observer.disconnect(), 5000)
    }
    const initialDelay = window.setTimeout(delayedApply, 300)

    return () => {
      cancelled = true
      window.clearTimeout(initialDelay)
    }
  }, [bookId, currentChapter, highlightAlliteration, showOldEnglish])

  // Kenning tooltips — hover/focus on any [data-beowulf-kenning]
  // reveals a fixed-position gloss card. Reattaches on chapter change.
  const tooltipRef = useRef<HTMLDivElement | null>(null)
  const [activeKenning, setActiveKenning] = useState<Kenning | null>(null)
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null)

  useEffect(() => {
    if (bookId !== "beowulf") return
    const root = document.querySelector<HTMLElement>("[data-reader-text]")
    if (!root) return
    const handler = (event: Event, show: boolean) => {
      const target = event.target as HTMLElement | null
      const el = target?.closest<HTMLElement>("[data-beowulf-kenning]")
      if (!el) {
        if (!show) {
          setActiveKenning(null)
          setTooltipPos(null)
        }
        return
      }
      const id = el.getAttribute("data-beowulf-kenning") ?? ""
      const k = BEOWULF_KENNINGS_BY_ID.get(id)
      if (!k) return
      if (show) {
        const r = el.getBoundingClientRect()
        // Position the tooltip below the word, clamped to viewport.
        const top = Math.min(
          window.innerHeight - 160,
          r.bottom + 8
        )
        const left = Math.max(
          8,
          Math.min(window.innerWidth - 360, r.left)
        )
        setActiveKenning(k)
        setTooltipPos({ top, left })
      } else {
        setActiveKenning(null)
        setTooltipPos(null)
      }
    }
    const onOver = (e: Event) => handler(e, true)
    const onOut = (e: Event) => handler(e, false)
    const onFocus = (e: Event) => handler(e, true)
    const onBlur = (e: Event) => handler(e, false)
    root.addEventListener("mouseover", onOver)
    root.addEventListener("mouseout", onOut)
    root.addEventListener("focusin", onFocus)
    root.addEventListener("focusout", onBlur)
    return () => {
      root.removeEventListener("mouseover", onOver)
      root.removeEventListener("mouseout", onOut)
      root.removeEventListener("focusin", onFocus)
      root.removeEventListener("focusout", onBlur)
    }
  }, [bookId, currentChapter])

  if (bookId !== "beowulf") return null

  const fittNumber = chapterIndexToFittNumber(currentChapter)
  const fitt = fittNumber ? FITT_METADATA[fittNumber] : null

  // For the preface (ci 0) and the Story/argument (ci 1) we show only the
  // edition note, not a fitt header — those chapters are Hall's front matter.
  const isFrontMatter = currentChapter <= 1

  return (
    <div className="beowulf-enhancements mt-3 mb-5">
      {/* ── Fitt header: Roman numeral + scholarly argument ─────────── */}
      {fitt && !isFrontMatter && (
        <div
          className="beowulf-fitt-header pb-3 mb-3"
          style={{
            borderBottom: "1px solid var(--color-border-subtle, #d6cdb9)",
          }}
        >
          <div
            className="text-xs uppercase tracking-widest opacity-60"
            style={{ color: "var(--beowulf-narrator, #B8864D)" }}
          >
            Fitt {toRoman(fitt.number)} · lines of the scop
          </div>
          <div
            className="mt-1 text-sm italic opacity-80"
            style={{ color: "var(--beowulf-narrator, #B8864D)" }}
          >
            {fitt.argument}
          </div>
          {fitt.digression && (
            <div
              className="mt-2 text-xs"
              style={{ color: "var(--beowulf-narrator, #B8864D)" }}
            >
              <span className="font-semibold">Digression:</span>{" "}
              {digressionLabel(fitt.digression)}
            </div>
          )}
        </div>
      )}

      {/* ── Edition note ───────────────────────────────────────────── */}
      <div className="beowulf-edition-note text-xs opacity-70 leading-relaxed">
        <strong>Edition:</strong> John Lesslie Hall, 1892 alliterative-verse
        translation, via Standard Ebooks (2019). Hall preserves four-stress
        half-lines and the caesura of the Old English original; end-rhyme is
        incidental. The poem survives in a single manuscript (Cotton Vitellius
        A.xv, British Library, ca. 1000 CE), nearly destroyed in the 1731
        Cotton Library fire and first read as literature after Tolkien's 1936
        lecture.
      </div>

      {/* ── Toggles ────────────────────────────────────────────────── */}
      <div className="beowulf-toggles mt-3 flex flex-wrap items-center gap-3 text-xs">
        <button
          type="button"
          className="beowulf-toggle rounded border px-2 py-1 opacity-80 hover:opacity-100"
          onClick={() => {
            const next = !highlightAlliteration
            setHighlightAlliteration(next)
            if (typeof window !== "undefined") {
              window.localStorage.setItem(LS_ALLITERATION, next ? "1" : "0")
            }
          }}
          aria-pressed={highlightAlliteration}
        >
          {highlightAlliteration ? "✓ " : ""}Highlight alliteration
        </button>
        <button
          type="button"
          className="beowulf-toggle rounded border px-2 py-1 opacity-80 hover:opacity-100"
          onClick={() => {
            const next = !showOldEnglish
            setShowOldEnglish(next)
            if (typeof window !== "undefined") {
              window.localStorage.setItem(LS_BILINGUAL, next ? "1" : "0")
            }
          }}
          aria-pressed={showOldEnglish}
        >
          {showOldEnglish ? "✓ " : ""}Show Old English
        </button>
      </div>

      {/* ── Kenning tooltip (portal via fixed positioning) ─────────── */}
      {activeKenning && tooltipPos && (
        <div
          ref={tooltipRef}
          className="beowulf-kenning-tooltip"
          role="tooltip"
          style={{ top: tooltipPos.top, left: tooltipPos.left }}
        >
          <span className="kn-oe">{activeKenning.oldEnglish}</span>
          <span className="kn-arrow">→</span>
          <span>{activeKenning.meaning}</span>
          <span className="kn-literal">literally, "{activeKenning.literal}"</span>
          {activeKenning.note && (
            <span className="kn-note">{activeKenning.note}</span>
          )}
        </div>
      )}
    </div>
  )
}

function digressionLabel(kind: string): string {
  const map: Record<string, string> = {
    "scyld-prologue":
      "Scyld Scefing prologue — the poem's opening frame (lines 1–52).",
    sigemund:
      "Sigemund and Heremod — embedded lays contrasting heroic virtue and kingly failure.",
    heremod:
      "Heremod — the negative exemplum: the Danish king whose pride undid him.",
    finnsburg:
      "Finnsburg Episode — the embedded lay of Danes, Frisians, and a broken peace (lines 1063–1159).",
    modthryth:
      "Modthryth — the contrastive queen-digression: Hygd's wise youth vs. Modthryth's murderous rule.",
    "freawaru-ingeld":
      "Freawaru and Ingeld — foreshadowed Heathobard feud, Beowulf's retrospective at Hygelac's court.",
    "geatish-swedish":
      "Geatish-Swedish wars — the historical-dynastic background pressing in on the poem's second half.",
    retrospective:
      "Beowulf's retrospective narration — memories of Hrethel, Heathcyn, Herebeald.",
  }
  return map[kind] ?? kind
}

// ── Old English bilingual injection ─────────────────────────────────
//
// Harrison & Sharp 1893 (Gutenberg #9700) OE text lives at
// /content/beowulf/original.json — a fitt-keyed JSON with line-level
// anchors. Hall's 1892 English has ~3,069 lines; H&S's OE has ~3,292.
// Because Hall occasionally collapses two half-lines into one English
// line, the alignment is proportional rather than 1:1 — Hall line N
// within fitt F maps to OE line round(N * OEcount / HallCount) within
// the same fitt. This is good enough for a reader who wants to see
// the OE neighbor of a given English line.
//
// Injected OE lines are sibling spans following each line span, marked
// with `data-beowulf-oe-line` so the existing CSS rule styles them.
//
// Module-level cache so we don't refetch the 445KB JSON on every
// chapter change.

interface OELinePayload {
  klaeberLine?: number
  hsLine: number
  text: string
  fitt: number
}
interface OEFitt {
  fitt: number
  title: string
  lineCount: number
  lines: OELinePayload[]
}
interface OEDoc {
  totalLines: number
  fittCount: number
  fitts: OEFitt[]
}

let oeCache: OEDoc | null = null
let oeFetchPromise: Promise<OEDoc | null> | null = null

async function loadOE(): Promise<OEDoc | null> {
  if (oeCache) return oeCache
  if (oeFetchPromise) return oeFetchPromise
  oeFetchPromise = (async () => {
    try {
      const r = await fetch("/content/beowulf/original.json")
      if (!r.ok) return null
      const doc = (await r.json()) as OEDoc
      oeCache = doc
      return doc
    } catch {
      return null
    } finally {
      oeFetchPromise = null
    }
  })()
  return oeFetchPromise
}

async function injectOldEnglish(
  root: HTMLElement,
  currentChapter: number
): Promise<void> {
  // Remove any previously-injected OE lines to stay idempotent.
  removeOldEnglish(root)

  // ch-2..ch-44 correspond to fitts 1..43 (ch-0 preface, ch-1 intro).
  const fittNumber = currentChapter - 1
  if (fittNumber < 1 || fittNumber > 43) return

  const doc = await loadOE()
  if (!doc) return
  const fitt = doc.fitts.find((f) => f.fitt === fittNumber)
  if (!fitt || fitt.lines.length === 0) return

  const halls = root.querySelectorAll<HTMLElement>("[data-beowulf-line]")
  if (halls.length === 0) return

  const scale = fitt.lines.length / halls.length
  halls.forEach((span, i) => {
    // Don't double-inject.
    if (span.nextElementSibling?.hasAttribute("data-beowulf-oe-line")) return
    const hallIdx = i + 1 // 1-based Hall line within fitt
    // Proportional mapping → OE index (1-based, clamped).
    const oeIdx = Math.max(
      1,
      Math.min(fitt.lines.length, Math.round(hallIdx * scale))
    )
    const oeLine = fitt.lines[oeIdx - 1]
    if (!oeLine) return
    const oeEl = document.createElement("span")
    oeEl.setAttribute("data-beowulf-oe-line", String(oeLine.hsLine))
    if (oeLine.klaeberLine !== undefined) {
      oeEl.setAttribute("data-beowulf-oe-klaeber", String(oeLine.klaeberLine))
    }
    oeEl.textContent = oeLine.text
    // Insert AFTER the Hall line span, BEFORE the trailing <br>.
    const afterNode = span.nextSibling
    if (afterNode) {
      span.parentNode?.insertBefore(oeEl, afterNode)
    } else {
      span.parentNode?.appendChild(oeEl)
    }
  })
}

function removeOldEnglish(root: HTMLElement): void {
  root
    .querySelectorAll<HTMLElement>("[data-beowulf-oe-line]")
    .forEach((el) => el.remove())
}

// ── Alliteration detection (best-effort on Hall's English) ─────────
//
// Old English alliterative verse has a strict rule: the first stress of
// the b-half-line (the "head-stave") alliterates with either or both
// stresses of the a-half-line; the final stress does NOT alliterate.
// Hall's 1892 English preserves the pattern approximately.
//
// The detector here is deliberately best-effort: find the dominant
// initial consonant (or the vowel-class "V") among content words in a
// line, and mark 2+ words sharing that initial. This is the toggle's
// payoff — the reader can see the pattern without the poet claiming
// certainty about every syllable.
//
// Uncertain lines are left unmarked rather than guessed at (per spec).
const ALLIT_STOPWORDS = new Set<string>([
  "a", "an", "the", "and", "but", "or", "nor", "yet", "so", "for",
  "of", "in", "on", "at", "to", "by", "up", "as", "is", "it", "its",
  "he", "his", "him", "she", "her", "they", "them", "their", "we", "us",
  "you", "your", "i", "my", "me", "mine", "thou", "thy", "thine", "ye",
  "be", "was", "were", "been", "are", "am", "had", "has", "have",
  "do", "did", "does", "not", "no", "yes", "with", "from", "into",
  "that", "this", "these", "those", "which", "who", "whom", "what",
  "if", "then", "than", "when", "where", "how", "why",
])
const ALLIT_CLASS_VOWEL = "V"

function alliterationKey(word: string): string {
  // Strip surrounding punctuation and quotes.
  const w = word.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, "")
  if (w.length < 3) return ""
  if (ALLIT_STOPWORDS.has(w.toLowerCase())) return ""
  const ch = w.charAt(0).toLowerCase()
  if (!/[a-z]/.test(ch)) return ""
  // Vowels alliterate together in OE alliterative verse.
  if (/[aeiou]/.test(ch)) return ALLIT_CLASS_VOWEL
  // Consonant clusters: st, sp, sc (sk) are treated as a unit in OE.
  const head2 = w.slice(0, 2).toLowerCase()
  if (head2 === "st" || head2 === "sp" || head2 === "sc" || head2 === "sk") {
    return head2
  }
  return ch
}

function markAlliterationInLine(span: HTMLElement): void {
  if (span.querySelector("[data-beowulf-allit]")) return // idempotent
  // Walk only the text inside the line span, not nested <a>/footnote links.
  const walker = document.createTreeWalker(span, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue) return NodeFilter.FILTER_REJECT
      // Skip text inside noteref anchors (footnotes).
      const parent = node.parentElement
      if (parent && parent.closest('a[role="doc-noteref"], a[epub\\:type]')) {
        return NodeFilter.FILTER_REJECT
      }
      return NodeFilter.FILTER_ACCEPT
    },
  })
  const textNodes: Text[] = []
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    textNodes.push(n as Text)
  }
  // Concatenate to find the alliteration key, then tag.
  const fullText = textNodes.map((t) => t.nodeValue).join("")
  const words = fullText.split(/(\s+)/)
  const keyCounts = new Map<string, number>()
  for (const w of words) {
    const k = alliterationKey(w)
    if (k) keyCounts.set(k, (keyCounts.get(k) ?? 0) + 1)
  }
  // Find the dominant key with at least 2 occurrences.
  let dominant = ""
  let best = 1
  for (const [k, c] of keyCounts) {
    if (c > best) {
      best = c
      dominant = k
    }
  }
  if (!dominant) return // no alliteration detected (or uncertain)

  // Walk text nodes and wrap matching words in <em data-beowulf-allit>.
  for (const tn of textNodes) {
    const txt = tn.nodeValue ?? ""
    if (!txt) continue
    const parts = txt.split(/(\s+)/)
    const marked = parts.some((p) => alliterationKey(p) === dominant)
    if (!marked) continue
    const frag = document.createDocumentFragment()
    for (const p of parts) {
      const k = alliterationKey(p)
      if (k === dominant) {
        const em = document.createElement("em")
        em.setAttribute("data-beowulf-allit", dominant)
        em.textContent = p
        frag.appendChild(em)
      } else {
        frag.appendChild(document.createTextNode(p))
      }
    }
    tn.parentNode?.replaceChild(frag, tn)
  }
}

function markAlliteration(root: HTMLElement): void {
  const lines = root.querySelectorAll<HTMLElement>("[data-beowulf-line]")
  lines.forEach(markAlliterationInLine)
}

function unmarkAlliteration(root: HTMLElement): void {
  root
    .querySelectorAll<HTMLElement>("em[data-beowulf-allit]")
    .forEach((em) => {
      const text = document.createTextNode(em.textContent ?? "")
      em.parentNode?.replaceChild(text, em)
    })
  // Normalize adjacent text nodes in each touched parent so future
  // passes see a clean structure.
  root
    .querySelectorAll<HTMLElement>("[data-beowulf-line]")
    .forEach((line) => line.normalize())
}

function toRoman(n: number): string {
  if (n <= 0 || n > 3999) return String(n)
  const vals = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
  const syms = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
  let out = ""
  for (let i = 0; i < vals.length; i++) {
    while (n >= vals[i]) {
      out += syms[i]
      n -= vals[i]
    }
  }
  return out
}
