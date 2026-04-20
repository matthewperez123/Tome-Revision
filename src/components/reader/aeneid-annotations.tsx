"use client"

/**
 * AeneidAnnotations — reader overlay for Virgil's Aeneid.
 *
 * Mirror of CommediaAnnotations: walks the rendered chapter HTML for
 * the-aeneid and inserts a clickable ✦ marker at the start of each
 * passage that has a scholarly annotation registered in
 * `@/lib/virgil/annotations` (via the Aeneid book-01 file and
 * forward). Also inserts small V. monogram markers at the five
 * canonical Virgilian authorial-apostrophe sites detected by the
 * apparatus — tu Marcellus eris, fortunati ambo, the Caieta
 * invocation, the Lausus apostrophe, the two gates of sleep.
 *
 * Clicks on ✦ forward the annotation id to the reader page, which
 * opens the shared VirgilDrawer. The V. monograms open the
 * corresponding apostrophe card in the drawer via a synthetic
 * annotation id.
 *
 * Only active for `bookId === "the-aeneid"`. No source HTML is
 * modified beyond marker insertion; markers are cleaned up between
 * chapter changes.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"
import { getAeneidApostrophesForBook } from "@/lib/virgil/aeneid-apparatus"
import { getAeneidGlossesForChapter } from "@/lib/virgil/aeneid-glosses"

interface AeneidAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-aeneid-anchor"
const APOSTROPHE_ATTR = "data-aeneid-apostrophe"
const GLOSS_CLASS = "tome-gloss"  // shared with commedia overlay CSS

export function AeneidAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: AeneidAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "the-aeneid") return

    // Suppress ✦ markers for the synthetic apostrophe annotations —
    // those are rendered by the separate V. monogram marker pass below.
    const anns = getAnnotationsForChapter(bookId, currentChapter).filter(
      (a) => !a.id.startsWith("aeneid-apostrophe-"),
    )
    // Book number is 1-indexed; ch-0.json is Book I.
    const apostrophes = getAeneidApostrophesForBook(currentChapter + 1)
    const glosses = getAeneidGlossesForChapter(currentChapter)
    if (anns.length === 0 && apostrophes.length === 0 && glosses.length === 0) return

    let cancelled = false
    let clickHandlerRoot: HTMLElement | null = null

    const onClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(
        `[${MARKER_ATTR}], [${APOSTROPHE_ATTR}]`,
      )
      if (!target) return
      e.preventDefault()
      const id =
        target.getAttribute(MARKER_ATTR) ??
        target.getAttribute(APOSTROPHE_ATTR)
      if (id) onOpenAnnotation(id)
    }

    function tryDecorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      // Guard: Aeneid-specific markup.
      const hasBookContent = !!root.querySelector(
        "section[role='doc-chapter'] [data-aeneid-line]",
      )
      if (!hasBookContent) return false

      // Clean up prior-pass markers so re-runs are idempotent.
      root.querySelectorAll(`[${MARKER_ATTR}], [${APOSTROPHE_ATTR}]`).forEach((el) =>
        el.remove(),
      )
      root.querySelectorAll(`.${GLOSS_CLASS}`).forEach((el) => {
        const t = document.createTextNode(el.textContent ?? "")
        el.parentNode?.replaceChild(t, el)
      })
      root.normalize()

      function collectTextNodes(): Text[] {
        const walker = document.createTreeWalker(root!, NodeFilter.SHOW_TEXT, {
          acceptNode: (node: Node): number => {
            const parent = (node as Text).parentElement
            if (!parent) return NodeFilter.FILTER_REJECT
            if (parent.closest("script, style")) return NodeFilter.FILTER_REJECT
            if (parent.hasAttribute(MARKER_ATTR)) return NodeFilter.FILTER_REJECT
            if (parent.hasAttribute(APOSTROPHE_ATTR)) return NodeFilter.FILTER_REJECT
            return NodeFilter.FILTER_ACCEPT
          },
        })
        const out: Text[] = []
        let nn: Node | null = walker.nextNode()
        while (nn) {
          out.push(nn as Text)
          nn = walker.nextNode()
        }
        return out
      }

      // ── Pass 1: ✦ annotation markers ─────────────────────────────
      // Dryden's HTML uses curly apostrophes (U+2019) and em-dashes
      // (U+2014). We normalize both the needle and the text node when
      // searching, then map the index back to the original text so
      // splitText hits the right character.
      const normalize = (s: string) =>
        s.replace(/[\u2018\u2019]/g, "'").replace(/[\u2013\u2014]/g, "-")
      let textNodes = collectTextNodes()
      for (const ann of anns) {
        const needle = normalize(ann.anchorText.trim())
        if (!needle) continue

        let remaining = Math.max(1, ann.anchorOccurrence)
        let matched: { node: Text; offset: number } | null = null

        for (const tn of textNodes) {
          const text = tn.nodeValue ?? ""
          const normText = normalize(text)
          if (!normText.includes(needle)) continue
          let from = 0
          while (true) {
            const idx = normText.indexOf(needle, from)
            if (idx === -1) break
            remaining -= 1
            if (remaining === 0) {
              matched = { node: tn, offset: idx }
              break
            }
            from = idx + needle.length
          }
          if (matched) break
        }

        if (!matched) continue

        const { node, offset } = matched
        const before = node.splitText(offset)
        const btn = document.createElement("button")
        btn.type = "button"
        btn.setAttribute(MARKER_ATTR, ann.id)
        btn.setAttribute("aria-label", `Scholarly annotation: ${ann.title}`)
        btn.title = ann.title
        btn.textContent = "✦"
        btn.className = "aeneid-anchor"
        before.parentNode?.insertBefore(btn, before)
      }

      // ── Pass 2b: gloss phrase wrappers ───────────────────────────
      // Wrap each gloss phrase's first occurrence per chapter. Longer
      // phrases first so multi-word glosses don't fragment under
      // shorter overlapping phrases ("Pallas Athene" before "Pallas").
      if (glosses.length > 0) {
        const sorted = [...glosses].sort((a, b) => b.phrase.length - a.phrase.length)
        for (const g of sorted) {
          const needle = g.phrase
          if (!needle) continue
          textNodes = collectTextNodes()
          for (const tn of textNodes) {
            const text = tn.nodeValue ?? ""
            const idx = text.indexOf(needle)
            if (idx === -1) continue
            const afterHead = tn.splitText(idx)
            afterHead.splitText(needle.length)
            const span = document.createElement("span")
            span.className = GLOSS_CLASS
            span.setAttribute("data-definition", g.definition)
            span.setAttribute("tabindex", "0")
            span.textContent = afterHead.nodeValue
            afterHead.parentNode?.replaceChild(span, afterHead)
            break  // first occurrence per phrase only
          }
        }
      }

      // ── Pass 2: V. monogram markers for apostrophes ──────────────
      textNodes = collectTextNodes()
      for (const apo of apostrophes) {
        if (!apo.anchorText) continue
        const needle = apo.anchorText.trim().slice(0, 40)
        if (!needle) continue
        for (const tn of textNodes) {
          const text = tn.nodeValue ?? ""
          const idx = text.indexOf(needle)
          if (idx === -1) continue
          const before = tn.splitText(idx)
          const span = document.createElement("span")
          span.setAttribute(APOSTROPHE_ATTR, `aeneid-apostrophe-${apo.id}`)
          span.setAttribute("role", "button")
          span.setAttribute("tabindex", "0")
          span.setAttribute("aria-label", `Virgilian apostrophe: ${apo.title}`)
          span.title = `${apo.title} — ${apo.latinTag}`
          span.textContent = "V."
          span.className = "aeneid-apostrophe"
          before.parentNode?.insertBefore(span, before)
          break
        }
      }

      if (clickHandlerRoot && clickHandlerRoot !== root) {
        clickHandlerRoot.removeEventListener("click", onClick)
      }
      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [60, 200, 500, 1000, 2000]
    for (const d of delays) {
      timers.push(setTimeout(() => { if (!cancelled) tryDecorate() }, d))
    }

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
      if (clickHandlerRoot) clickHandlerRoot.removeEventListener("click", onClick)
    }
  }, [bookId, currentChapter, onOpenAnnotation])

  return null
}
