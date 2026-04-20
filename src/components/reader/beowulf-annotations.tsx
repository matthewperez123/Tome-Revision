"use client"

/**
 * BeowulfAnnotations — reader overlay for the Old English epic.
 *
 * Mirror of ParadiseLostAnnotations / AeneidAnnotations: walks the
 * rendered Hall-translation HTML for bookId === "beowulf" and inserts a
 * clickable ✦ marker at the start of each passage that has a scholarly
 * annotation registered in `@/lib/virgil/annotations` (via the
 * src/lib/virgil/beowulf/ cluster files). Clicks on ✦ forward the
 * annotation id to the reader page, which opens the shared VirgilDrawer.
 *
 * Only active for bookId === "beowulf". No source HTML is modified
 * beyond marker insertion; markers are cleaned between chapter changes.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"
import { getBeowulfGlossesForChapter } from "@/lib/virgil/beowulf-glosses"

interface BeowulfAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-beowulf-anchor"
const GLOSS_CLASS = "tome-gloss"

export function BeowulfAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: BeowulfAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "beowulf") return

    const anns = getAnnotationsForChapter(bookId, currentChapter)
    const glosses = getBeowulfGlossesForChapter(currentChapter)
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

    // Hall's SE HTML uses curly quotes (U+2018/U+2019) and em-dashes
    // (U+2014) — normalize both needle and haystack.
    const normalize = (s: string) =>
      s
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")

    function tryDecorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false

      // Guard: beowulf verse body must be present. For front matter
      // (preface / introduction) the data-beowulf-line attribute is
      // absent; allow tryDecorate to still run on those chapters for
      // annotations that anchor on preface/introduction text.
      const hasVerseBody =
        root.querySelector("[data-beowulf-line]") ||
        root.querySelector("section[id^='chapter-']") ||
        root.querySelector("h2") // preface / introduction sections
      if (!hasVerseBody) return false

      // Clean prior markers for idempotency.
      root.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove())
      root.querySelectorAll(`.${GLOSS_CLASS}`).forEach((el) => {
        const t = document.createTextNode(el.textContent ?? "")
        el.parentNode?.replaceChild(t, el)
      })
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
        let occurrencesLeft = ann.anchorOccurrence || 1
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
              marker.className = "beowulf-anchor-marker"
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

      // ── Pass 2: gloss decorations (dotted underline + tooltip) ────
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
          break // first occurrence per gloss per chapter
        }
      }

      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

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
