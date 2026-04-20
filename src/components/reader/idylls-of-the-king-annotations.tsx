"use client"

/**
 * IdyllsOfTheKingAnnotations — reader overlay for Tennyson's Idylls.
 *
 * Mirror of ParadiseLostAnnotations / AeneidAnnotations: walks the
 * rendered chapter HTML for idylls-of-the-king in two passes:
 *
 *   Pass 1: inserts a clickable ✦ marker at the start of each passage
 *           that has a scholarly annotation. Click forwards the
 *           annotation id to the reader page, which opens the shared
 *           VirgilDrawer.
 *
 *   Pass 2: wraps each gloss-phrase in a dotted-underline span with a
 *           one-sentence definition in data-definition. CSS in tome.css
 *           renders a tooltip on hover/tap.
 *
 * Only active for `bookId === "idylls-of-the-king"`. Silently no-ops
 * otherwise.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"
import { getIdyllsOfTheKingGlossesForChapter } from "@/lib/virgil/idylls-of-the-king-glosses"

interface IdyllsOfTheKingAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-iotk-anchor"
const GLOSS_CLASS = "tome-gloss"

export function IdyllsOfTheKingAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: IdyllsOfTheKingAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "idylls-of-the-king") return

    const anns = getAnnotationsForChapter(bookId, currentChapter)
    const glosses = getIdyllsOfTheKingGlossesForChapter(currentChapter)
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

      // Guard: idylls-specific markup must be present.
      const hasBookContent = !!root.querySelector(
        "section[role='doc-chapter'] [data-iotk-line]",
      )
      if (!hasBookContent) return false

      // Clean up prior-pass markers and gloss-wraps for idempotent re-runs.
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
            if (parent.classList.contains(GLOSS_CLASS)) return NodeFilter.FILTER_REJECT
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

      // Tennyson's SE-sourced HTML uses curly quotes and em-dashes;
      // normalize both needle and haystack for matching, then map the
      // found index back to the original text for splitting.
      const normalize = (s: string) =>
        s
          .replace(/[\u2018\u2019]/g, "'")
          .replace(/[\u201C\u201D]/g, '"')
          .replace(/[\u2013\u2014\u2E3A\u2E3B]/g, "-")
          .replace(/\u2060/g, "")
          .replace(/\u00A0/g, " ")

      // ── Pass 1: ✦ annotation markers ───────────────────────────────
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
              marker.className = "iotk-anchor-marker"
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

      // ── Pass 2: gloss decorations (dotted-underline w/ tooltip) ────
      for (const g of glosses) {
        const needle = normalize(g.phrase)
        if (!needle) continue
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

    // Retry until the dangerouslySetInnerHTML body is present.
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
