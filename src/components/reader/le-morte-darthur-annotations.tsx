"use client"

/**
 * LeMorteDarthurAnnotations — reader overlay for Thomas Malory's
 * *Le Morte d'Arthur* (Caxton 1485 via Standard Ebooks / Pollard).
 *
 * Close clone of IdyllsOfTheKingAnnotations, adapted for Malory's
 * prose structure:
 *
 *   Pass 1: inserts a clickable ✦ marker at the start of each passage
 *           that has a scholarly annotation. Click forwards the
 *           annotation id to the reader page, which opens the shared
 *           VirgilDrawer.
 *
 *   Pass 2: wraps each vocabulary-gloss phrase in a dotted-underline
 *           span with a one-sentence definition. CSS in tome.css renders
 *           a tooltip on hover/tap. MALORY USES THIS HEAVILY — the
 *           archaic-vocabulary layer is the book's accessibility surface.
 *
 * Gate: only active for `bookId === "le-morte-darthur"`. Silently
 * no-ops otherwise.
 *
 * Malory body chapters emit HTML shaped like:
 *   <section data-parent="book-N" id="chapter-B-C">
 *     <header><h3>I</h3><p>The rubric…</p></header>
 *     <p>It befell in the days of Uther…</p>
 *     …
 *   </section>
 *
 * We use `section[data-parent^="book-"]` as the "this is a body chapter"
 * guard so that we do not attempt to decorate the Bibliographical Note,
 * Caxton's Preface, or the Glossary at the back of the book.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"
import { getLeMorteDarthurGlossesForChapter } from "@/lib/virgil/le-morte-darthur-glosses"

interface LeMorteDarthurAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-malory-anchor"
const GLOSS_CLASS = "tome-gloss"

export function LeMorteDarthurAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: LeMorteDarthurAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "le-morte-darthur") return

    const anns = getAnnotationsForChapter(bookId, currentChapter)
    const glosses = getLeMorteDarthurGlossesForChapter(currentChapter)
    if (anns.length === 0 && glosses.length === 0) return

    let cancelled = false
    let clickHandlerRoot: HTMLElement | null = null

    const onClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(`[${MARKER_ATTR}]`)
      if (!target) return
      e.preventDefault()
      const id = target.getAttribute(MARKER_ATTR)
      if (id) onOpenAnnotation(id)
    }

    function tryDecorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      // Guard: Malory body-chapter markup must be present.
      const hasBody = !!root.querySelector(`section[data-parent^="book-"]`)
      if (!hasBody) return false

      // Idempotent: clean up prior-pass markers and gloss-wraps before redecorating.
      root.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove())
      root.querySelectorAll(`.${GLOSS_CLASS}`).forEach((el) => {
        const t = document.createTextNode(el.textContent ?? "")
        el.parentNode?.replaceChild(t, el)
      })
      root.normalize()

      // ── Helpers ──
      const normalize = (s: string) =>
        s
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2013\u2014\u2E3A\u2E3B]/g, "-")
          .replace(/\u2060/g, "")
          .replace(/\u00A0/g, " ")

      // Exclude the header block (argumentum + chapter number) from gloss
      // and annotation matching — the rubrics are Caxton's editorial
      // paraphrase, not Malory's prose, and they would produce false
      // hits (e.g. glossing "wit" inside a rubric). The reader should
      // only annotate the body paragraphs.
      function collectBodyTextNodes(): Text[] {
        const out: Text[] = []
        const sections = root!.querySelectorAll<HTMLElement>(`section[data-parent^="book-"]`)
        for (const section of sections) {
          const walker = document.createTreeWalker(section, NodeFilter.SHOW_TEXT, {
            acceptNode: (node: Node): number => {
              const parent = (node as Text).parentElement
              if (!parent) return NodeFilter.FILTER_REJECT
              if (parent.closest("header, script, style")) return NodeFilter.FILTER_REJECT
              if (parent.hasAttribute(MARKER_ATTR)) return NodeFilter.FILTER_REJECT
              if (parent.classList.contains(GLOSS_CLASS)) return NodeFilter.FILTER_REJECT
              return NodeFilter.FILTER_ACCEPT
            },
          })
          let nn: Node | null = walker.nextNode()
          while (nn) {
            out.push(nn as Text)
            nn = walker.nextNode()
          }
        }
        return out
      }

      // ── Pass 1: ✦ annotation markers ───────────────────────────────
      for (const ann of anns) {
        const needle = normalize(ann.anchorText)
        if (!needle) continue
        let occurrencesLeft = ann.anchorOccurrence
        const textNodes = collectBodyTextNodes()
        outer: for (const tn of textNodes) {
          const raw = tn.nodeValue ?? ""
          const norm = normalize(raw)
          let from = 0
          while (true) {
            const idx = norm.indexOf(needle, from)
            if (idx < 0) break
            occurrencesLeft -= 1
            if (occurrencesLeft === 0) {
              const splitIdx = idx
              const before = raw.slice(0, splitIdx)
              const after = raw.slice(splitIdx)
              const parent = tn.parentNode
              if (!parent) break
              const marker = document.createElement("span")
              marker.setAttribute(MARKER_ATTR, ann.id)
              marker.setAttribute("role", "button")
              marker.setAttribute("tabindex", "0")
              marker.setAttribute("aria-label", `Open annotation: ${ann.title}`)
              marker.className = "malory-anchor-marker"
              marker.textContent = "\u2726" // ✦
              const beforeNode = document.createTextNode(before)
              const afterNode = document.createTextNode(after)
              parent.insertBefore(beforeNode, tn)
              parent.insertBefore(marker, tn)
              parent.insertBefore(afterNode, tn)
              parent.removeChild(tn)
              break outer
            }
            from = idx + needle.length
          }
        }
      }

      // ── Pass 2: gloss decorations ───────────────────────────────────
      // Match whole words, case-insensitive. Decorate only the first
      // occurrence per gloss per chapter — enough to teach the word;
      // avoids spackling every paragraph with underlines.
      for (const g of glosses) {
        const needle = normalize(g.phrase).toLowerCase()
        if (!needle) continue
        const textNodes = collectBodyTextNodes()
        let done = false
        for (const tn of textNodes) {
          if (done) break
          const raw = tn.nodeValue ?? ""
          const norm = normalize(raw).toLowerCase()
          // Word-boundary regex built from the (escaped) needle.
          const pattern = new RegExp(
            `(^|[^a-z'’-])(${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})(?=[^a-z'’-]|$)`,
            "i",
          )
          const m = pattern.exec(norm)
          if (!m) continue
          const matchStart = m.index + m[1].length
          const before = raw.slice(0, matchStart)
          const matched = raw.slice(matchStart, matchStart + m[2].length)
          const after = raw.slice(matchStart + m[2].length)
          const parent = tn.parentNode
          if (!parent) continue
          const wrap = document.createElement("span")
          wrap.className = GLOSS_CLASS
          wrap.setAttribute("data-definition", g.definition)
          wrap.setAttribute("tabindex", "0")
          wrap.textContent = matched
          const beforeNode = document.createTextNode(before)
          const afterNode = document.createTextNode(after)
          parent.insertBefore(beforeNode, tn)
          parent.insertBefore(wrap, tn)
          parent.insertBefore(afterNode, tn)
          parent.removeChild(tn)
          done = true
        }
      }

      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

    // Retry until the reader's dangerouslySetInnerHTML body is mounted.
    let attempts = 0
    const tick = () => {
      if (tryDecorate()) return
      attempts += 1
      if (attempts > 20) return
      setTimeout(tick, 60)
    }
    tick()

    return () => {
      cancelled = true
      clickHandlerRoot?.removeEventListener("click", onClick)
    }
  }, [bookId, currentChapter, onOpenAnnotation])

  return null
}
