"use client"

/**
 * CanterburyTalesAnnotations — reader overlay for Chaucer's
 * *Canterbury Tales* (Standard Ebooks / Purves).
 *
 * Mirror of IdyllsOfTheKingAnnotations / ParadiseLostAnnotations: walks
 * the rendered chapter HTML in two passes:
 *
 *   Pass 1: inserts a clickable ✦ marker at the start of each passage
 *           that has a hand-authored Virgil annotation. Click forwards
 *           the annotation id to the reader page, which opens the shared
 *           VirgilDrawer.
 *
 *   Pass 2: wraps each gloss-phrase in a dotted-underline span with a
 *           one-sentence definition in `data-definition`. CSS in
 *           `tome.css` renders a tooltip on hover/tap.
 *
 * NOTE (Phase 1): this is the legacy dotted-underline gloss model (same
 * as Malory/Decameron). The Chaucer-specific FacingGlossBlock two-column
 * layout is a Phase 2 build. Both will coexist; the data file
 * `canterbury-tales-glosses.ts` feeds both.
 *
 * Only active for `bookId === "the-canterbury-tales"`. Silently no-ops
 * otherwise.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"
import { getCanterburyTalesGlossesForChapter } from "@/lib/virgil/canterbury-tales-glosses"

interface CanterburyTalesAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-ct-anchor"
const GLOSS_CLASS = "tome-gloss"

export function CanterburyTalesAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: CanterburyTalesAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "the-canterbury-tales") return

    const anns = getAnnotationsForChapter(bookId, currentChapter)
    const glosses = getCanterburyTalesGlossesForChapter(currentChapter)
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

      // Guard: Canterbury-specific markup must be present (SE serves
      // section role='doc-chapter' or role='doc-prologue' for the GP).
      const hasBookContent = !!root.querySelector(
        "section[role='doc-chapter'], section[role='doc-prologue']",
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

      // Purves's SE source uses curly quotes, em-dashes, and diacritics
      // (ë, é, ó, á) to mark Chaucer's pronounced final-e. We DO NOT
      // normalize the diacritics away — they are load-bearing for
      // matching ME-specific phrases. We do normalize punctuation.
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
              marker.className = "ct-anchor-marker"
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
      //
      // Phase 2 will replace this with the FacingGlossBlock two-column
      // layout. Until then, the dotted-underline model applies; density
      // is higher for Canterbury than for other books because Middle
      // English diction requires it.
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

    // Retry until the dangerouslySetInnerHTML body is present. Canterbury
    // often mounts the reader text asynchronously after the initial render
    // (chapter switching via localStorage rehydration, HMR, etc.), so we
    // widen the retry window and also fall back to a MutationObserver on
    // the reader container so late-arriving content still gets decorated.
    let attempts = 0
    let observer: MutationObserver | null = null
    const tick = () => {
      if (cancelled) return
      if (tryDecorate()) return
      attempts += 1
      if (attempts > 60) return    // ~6s; sufficient for slow-hydration paths
      setTimeout(tick, 100)
    }
    tick()

    // Watch for reader text appearing after our tick gave up. We observe
    // only the reader-text container and only childList mutations (not
    // attribute changes), and we only re-run if no anchors have been
    // placed — this prevents feedback loops with other effects (such as
    // the rhyme-scheme tagging) that mutate spans inside the container.
    if (typeof window !== "undefined" && "MutationObserver" in window) {
      observer = new MutationObserver((mutations) => {
        if (cancelled) return
        const placed = document.querySelectorAll(`[${MARKER_ATTR}]`).length
        if (placed > 0) return
        // ignore if mutations only added our own marker/gloss/rhyme nodes
        const hasMeaningful = mutations.some((m) =>
          Array.from(m.addedNodes).some((n) => {
            if (!(n instanceof HTMLElement)) return n.nodeType === 3  // text node
            if (n.hasAttribute(MARKER_ATTR)) return false
            if (n.classList.contains(GLOSS_CLASS)) return false
            if (n.classList.contains("ct-rhyme-chip")) return false
            return true
          }),
        )
        if (hasMeaningful) tryDecorate()
      })
      const readerRoot = document.querySelector<HTMLElement>("[data-reader-text]") ?? document.body
      observer.observe(readerRoot, { childList: true, subtree: true })
    }

    return () => {
      cancelled = true
      observer?.disconnect()
      clickHandlerRoot?.removeEventListener("click", onClick)
    }
  }, [bookId, currentChapter, onOpenAnnotation])

  return null
}
