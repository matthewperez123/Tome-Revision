"use client"

/**
 * OrlandoFuriosoAnnotations — reader overlay for Ariosto's Orlando Furioso.
 *
 * Mirror of DonJuanAnnotations / ParadiseLostAnnotations / AeneidAnnotations /
 * CommediaAnnotations: walks the rendered chapter HTML for orlando-furioso
 * and inserts:
 *   1. Clickable ✦ markers at each anchor text registered in
 *      `@/lib/virgil/annotations` (via orlando-furioso-annotations.ts and
 *      the per-canto files in src/lib/virgil/orlando-furioso/).
 *   2. Gloss decorations (dotted underline + hover tooltip) for difficult
 *      words / proper names / Carolingian figures / 19c Rose vocabulary
 *      registered in orlando-furioso-glosses.ts.
 *
 * Clicks on ✦ forward the annotation id to the reader page, which opens
 * the shared VirgilDrawer.
 *
 * Only active for `bookId === "orlando-furioso"`. Silently no-ops otherwise.
 *
 * Anchor matching normalizes curly quotes and en/em dashes — the Rose
 * Standard Ebooks HTML uses curly quotes heavily, and the hand-authored
 * annotations use straight quotes in anchorText for portability.
 *
 * Waits for the OrlandoFuriosoEnhancements stanza-tagging pass (the
 * `[data-of-stanza]` attribute) before matching anchors, so the overlay
 * never races against a partial DOM.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"
import { getOrlandoFuriosoGlossesForChapter } from "@/lib/virgil/orlando-furioso-glosses"

interface OrlandoFuriosoAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-of-anchor"
const GLOSS_CLASS = "tome-gloss"

export function OrlandoFuriosoAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: OrlandoFuriosoAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "orlando-furioso") return

    const anns = getAnnotationsForChapter(bookId, currentChapter)
    const glosses = getOrlandoFuriosoGlossesForChapter(currentChapter)
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

      // Wait for OrlandoFuriosoEnhancements to have tagged the stanzas
      // so anchor-matching runs against the finalized DOM shape.
      const hasCantoContent = !!root.querySelector(
        "section[role='doc-chapter'] [data-of-stanza]",
      )
      if (!hasCantoContent) return false

      // Clean up prior-pass decorations.
      root.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove())
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

      // Rose's SE HTML uses curly quotes and em-dashes; normalize both sides.
      const normalize = (s: string) =>
        s
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2013\u2014]/g, "-")

      // ── Pass 1: ✦ annotation markers ───────────────────────────────
      for (const ann of anns) {
        const needle = normalize(ann.anchorText)
        let occurrencesLeft = ann.anchorOccurrence
        const textNodes = collectTextNodes()
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
              // Reuse the Paradise Lost marker styling — same ✦ UI.
              marker.className = "pl-anchor-marker"
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

      // ── Pass 2: gloss decorations ──────────────────────────────────
      for (const g of glosses) {
        const needle = normalize(g.phrase)
        const textNodes = collectTextNodes()
        for (const tn of textNodes) {
          const raw = tn.nodeValue ?? ""
          const norm = normalize(raw)
          const idx = norm.indexOf(needle)
          if (idx < 0) continue
          const before = raw.slice(0, idx)
          const matched = raw.slice(idx, idx + needle.length)
          const after = raw.slice(idx + needle.length)
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
          break // decorate first occurrence per gloss entry only
        }
      }

      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

    // Retry loop — waits for the chapter body and the enhancements'
    // stanza tagging to both be present.
    let attempts = 0
    const tick = () => {
      if (tryDecorate()) return
      attempts += 1
      if (attempts > 30) return
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
