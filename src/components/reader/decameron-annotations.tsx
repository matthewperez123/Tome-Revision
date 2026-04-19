"use client"

/**
 * DecameronAnnotations — ✦ annotation markers for Boccaccio's Decameron
 * (Payne / Standard Ebooks). Mirrors CanterburyTalesAnnotations / the
 * Idylls overlay, but ONLY does the annotation-marker pass. Vocabulary
 * glosses are already decorated by DecameronEnhancements.
 *
 * For each Virgil annotation scoped to this chapter, walks the rendered
 * prose to find the anchor text (matching anchorOccurrence-th occurrence),
 * splits the text node, and inserts a clickable ✦ marker that forwards
 * the annotation id to the page's VirgilDrawer.
 *
 * Only active for `bookId === "the-decameron"`. Silently no-ops otherwise.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"

interface DecameronAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-dec-anchor"

export function DecameronAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: DecameronAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "the-decameron") return

    const anns = getAnnotationsForChapter(bookId, currentChapter)
    if (anns.length === 0) return

    let cancelled = false
    let clickHandlerRoot: HTMLElement | null = null

    const onClick = (e: Event) => {
      const target = (e.target as HTMLElement).closest?.(`[${MARKER_ATTR}]`)
      if (!target) return
      e.preventDefault()
      const id = target.getAttribute(MARKER_ATTR)
      if (id) onOpenAnnotation(id)
    }

    const normalize = (s: string) =>
      s
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\u00A0/g, " ")

    function tryDecorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      // Wait until the Decameron chapter body is actually rendered. The
      // paginated reader injects chapter HTML into this container via
      // dangerouslySetInnerHTML; before that, the placeholder is in
      // place and we shouldn't attempt marker insertion.
      const hasBody = !!root.querySelector(
        "section[role='doc-chapter'], section[role='doc-preface'], section[role='doc-conclusion']",
      )
      if (!hasBody) return false

      // Idempotent re-run: remove markers from prior pass.
      root.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove())
      root.normalize()

      const collectTextNodes = (): Text[] => {
        const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
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

      for (const ann of anns) {
        const needle = normalize(ann.anchorText)
        if (!needle) continue
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
              const before = raw.slice(0, idx)
              const after = raw.slice(idx)
              const parent = tn.parentNode
              if (!parent) break
              const marker = document.createElement("span")
              marker.setAttribute(MARKER_ATTR, ann.id)
              marker.setAttribute("role", "button")
              marker.setAttribute("tabindex", "0")
              marker.setAttribute("aria-label", `Open annotation: ${ann.title}`)
              marker.className = "dec-anchor-marker"
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

      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

    // Retry until chapter body is present.
    let attempts = 0
    const tick = () => {
      if (tryDecorate()) return
      attempts += 1
      if (attempts > 25) return
      setTimeout(tick, 80)
    }
    tick()

    return () => {
      cancelled = true
      clickHandlerRoot?.removeEventListener("click", onClick)
    }
  }, [bookId, currentChapter, onOpenAnnotation])

  return null
}
