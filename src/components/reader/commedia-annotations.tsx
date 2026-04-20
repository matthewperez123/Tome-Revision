"use client"

/**
 * CommediaAnnotations — reader overlay for Dante's Commedia.
 *
 * Walks the rendered canto HTML for the-divine-comedy and inserts a
 * clickable ✦ marker at the start of each passage that has a scholarly
 * annotation registered in `@/lib/virgil/commedia-annotations`. Clicks
 * are forwarded up to the reader page, which opens the shared
 * VirgilDrawer. No source HTML is modified — markers are appended and
 * cleaned up across chapter changes.
 *
 * Anchor logic: each annotation declares an `anchorText`. We find the
 * first matching text node whose text contains it, then insert the
 * marker right before the matched phrase. We only decorate anchors the
 * first time they appear (annotation.anchorOccurrence is respected by
 * counting matches). If the anchor is not found, the annotation is
 * silently skipped; this is tolerant of canto-to-canto HTML drift.
 *
 * Only active for `bookId === "the-divine-comedy"`.
 */

import { useEffect } from "react"
import { getCommediaAnnotationsForCanto } from "@/lib/virgil/commedia-annotations"
import { getCommediaGlossesForCanto } from "@/lib/virgil/commedia-glosses"

interface CommediaAnnotationsProps {
  bookId: string
  currentChapter: number         // flat canto index 0–99
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-commedia-anchor"
const GLOSS_CLASS = "tome-gloss"           // styled in src/styles/tome.css

export function CommediaAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: CommediaAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "the-divine-comedy") return

    const anns = getCommediaAnnotationsForCanto(currentChapter)
    const glosses = getCommediaGlossesForCanto(currentChapter)
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

    /** Attempt to decorate anchors; returns true once we've seen
     *  Commedia-looking canto content in the DOM. We retry a few times
     *  on a ramp because the reader loads chapter HTML asynchronously
     *  and this effect can fire before that HTML has mounted. */
    function tryDecorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      // Look for Commedia-specific markup so we don't try to annotate a
      // stale chapter or the placeholder text.
      const hasCantoContent = !!root.querySelector("section[role='doc-chapter'], section[role='doc-preface']")
      if (!hasCantoContent) return false

      // Clean up markers and glosses from a prior pass on this root.
      root.querySelectorAll(`[${MARKER_ATTR}]`).forEach(el => el.remove())
      root.querySelectorAll(`.${GLOSS_CLASS}`).forEach(el => {
        const t = document.createTextNode(el.textContent ?? "")
        el.parentNode?.replaceChild(t, el)
      })
      root.normalize()

      /** Re-collect text nodes, skipping script/style and anything
       *  already inside an anchor button or gloss wrapper. Refreshed
       *  between passes because decoration mutates the tree. */
      function collectTextNodes(): Text[] {
        const walker = document.createTreeWalker(root!, NodeFilter.SHOW_TEXT, {
          acceptNode: (node: Node): number => {
            const parent = (node as Text).parentElement
            if (!parent) return NodeFilter.FILTER_REJECT
            if (parent.closest("script, style")) return NodeFilter.FILTER_REJECT
            if (parent.hasAttribute(MARKER_ATTR)) return NodeFilter.FILTER_REJECT
            if (parent.closest(`.${GLOSS_CLASS}`)) return NodeFilter.FILTER_REJECT
            return NodeFilter.FILTER_ACCEPT
          },
        })
        const out: Text[] = []
        let nn: Node | null = walker.nextNode()
        while (nn) { out.push(nn as Text); nn = walker.nextNode() }
        return out
      }

      // --- Pass 1: annotation anchor markers -------------------------
      let textNodes = collectTextNodes()
      for (const ann of anns) {
        const needle = ann.anchorText.trim()
        if (!needle) continue

        let remaining = Math.max(1, ann.anchorOccurrence)
        let matched: { node: Text; offset: number } | null = null

        for (const tn of textNodes) {
          const text = tn.nodeValue ?? ""
          if (!text.includes(needle)) continue
          let from = 0
          while (true) {
            const idx = text.indexOf(needle, from)
            if (idx === -1) break
            remaining -= 1
            if (remaining === 0) { matched = { node: tn, offset: idx }; break }
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
        btn.className = "commedia-anchor"
        before.parentNode?.insertBefore(btn, before)
      }

      // --- Pass 2: glosses -------------------------------------------
      // Wrap every occurrence of each gloss phrase in a styled span
      // bearing the definition as a data attribute. Longest phrases
      // first so multi-word glosses don't get fragmented by shorter
      // overlapping phrases ("Count Ugolino" before "Ugolino").
      if (glosses.length > 0) {
        const sorted = [...glosses].sort((a, b) => b.phrase.length - a.phrase.length)
        for (const g of sorted) {
          const needle = g.phrase
          if (!needle) continue
          // Refresh text nodes between glosses — each wrap changes the tree.
          textNodes = collectTextNodes()
          for (const tn of textNodes) {
            const text = tn.nodeValue ?? ""
            const idx = text.indexOf(needle)
            if (idx === -1) continue
            // Split at the match start, then split the remainder at needle.length
            const afterHead = tn.splitText(idx)
            afterHead.splitText(needle.length)
            const span = document.createElement("span")
            span.className = GLOSS_CLASS
            span.setAttribute("data-definition", g.definition)
            span.setAttribute("tabindex", "0")
            span.textContent = afterHead.nodeValue
            afterHead.parentNode?.replaceChild(span, afterHead)
            // Don't break — let later text nodes get their own wraps.
          }
        }
      }

      // (Re)attach delegated click handler on the current root.
      if (clickHandlerRoot && clickHandlerRoot !== root) {
        clickHandlerRoot.removeEventListener("click", onClick)
      }
      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

    // Try immediately, then ramp retries until we see canto content.
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
