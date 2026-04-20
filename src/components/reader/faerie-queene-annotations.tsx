"use client"

/**
 * FaerieQueeneAnnotations — reader overlay for Edmund Spenser's
 * *The Faerie Queene*.
 *
 * Mirror of OrlandoFuriosoAnnotations / DonJuanAnnotations /
 * ParadiseLostAnnotations / AeneidAnnotations / CommediaAnnotations:
 * walks the rendered chapter HTML for `the-faerie-queene` and inserts
 * clickable ✦ markers at each anchor text registered in
 * `@/lib/virgil/annotations` (sourced from
 * `src/lib/virgil/faerie-queene/…` — Letter to Ralegh cluster already
 * ships; canto-level clusters land with subsequent Opus/Sonnet passes).
 *
 * Clicks on ✦ forward the annotation id to the reader page, which
 * opens the shared VirgilDrawer.
 *
 * Only active for `bookId === "the-faerie-queene"`. Silently no-ops
 * otherwise.
 *
 * Anchor matching normalizes curly quotes and en/em dashes — the
 * Standard Ebooks HTML for Spenser uses curly quotes heavily, and the
 * hand-authored annotations use straight quotes in `anchorText` for
 * portability. It also normalizes whitespace across <br> and <span>
 * boundaries so multi-line Spenserian-stanza anchor phrases match
 * against the reader's `[data-reader-text]` subtree.
 *
 * Design differences from OrlandoFuriosoAnnotations:
 *   - No dependency on a FaerieQueeneEnhancements stanza-tagging pass
 *     (that component does not yet exist). Decoration runs as soon as
 *     `[data-reader-text]` contains non-placeholder content.
 *   - No gloss pass (Spenser-glosses ship in a later Part 5 pass;
 *     loader hook is stubbed for forward-compatibility).
 *   - Multi-node anchor matching: anchor phrases that cross a
 *     <span>/<br>/<p> boundary (a very common occurrence in the
 *     Letter to Ralegh's long sentences) fall back to a "visible-text
 *     index" match that walks the subtree's accumulated textContent
 *     and locates the first surrounding text node for marker insertion.
 */

import { useEffect } from "react"
import { getAnnotationsForChapter } from "@/lib/virgil/annotations"

interface FaerieQueeneAnnotationsProps {
  bookId: string
  currentChapter: number
  onOpenAnnotation: (id: string) => void
}

const MARKER_ATTR = "data-fq-anchor"

export function FaerieQueeneAnnotations({
  bookId,
  currentChapter,
  onOpenAnnotation,
}: FaerieQueeneAnnotationsProps) {
  useEffect(() => {
    if (bookId !== "the-faerie-queene") return

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

    // Normalize curly quotes, em/en dashes, and collapse internal whitespace
    // (the SE Letter to Ralegh is a single long <p> wrapped by <br>-free
    // inline flow — straight indexOf works — but the canto HTML later will
    // break anchor phrases across <span>/<br> boundaries, so we go through
    // whitespace-normalization up front).
    const normalize = (s: string) =>
      s
        .replace(/[\u2018\u2019]/g, "'")
        .replace(/[\u201C\u201D]/g, '"')
        .replace(/[\u2013\u2014]/g, "-")
        .replace(/\s+/g, " ")

    function tryDecorate(): boolean {
      if (cancelled) return true
      const root = document.querySelector<HTMLElement>("[data-reader-text]")
      if (!root) return false
      // Bail until the chapter HTML has actually loaded (the reader's
      // placeholder is ~450 chars; the shortest real chapter here —
      // ch-0 Forward — is >1,500 chars). Below 1,200 we retry.
      if ((root.textContent ?? "").trim().length < 1200) return false

      // Clean up any prior-pass decorations.
      root.querySelectorAll(`[${MARKER_ATTR}]`).forEach((el) => el.remove())
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

      // ── Pass 1: ✦ annotation markers ───────────────────────────────
      for (const ann of anns) {
        const needle = normalize(ann.anchorText)
        let occurrencesLeft = ann.anchorOccurrence
        const textNodes = collectTextNodes()

        // First attempt: single-text-node match (works for the Letter to
        // Ralegh, whose long sentences run inside a single <p>).
        let placed = false
        outer: for (const tn of textNodes) {
          const raw = tn.nodeValue ?? ""
          // Use the normalizer on the raw text BUT keep an index map so we
          // slice the raw text — not the normalized — to preserve curly
          // quotes and dashes in the rendered output.
          const rawNorm = raw
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2013\u2014]/g, "-")
          // Whitespace-normalize the needle match against a whitespace-
          // normalized-but-length-preserving form of raw.
          const rawWsFlat = rawNorm.replace(/\s+/g, " ")
          let from = 0
          while (true) {
            const idx = rawWsFlat.indexOf(needle, from)
            if (idx < 0) break
            occurrencesLeft -= 1
            if (occurrencesLeft === 0) {
              // Since our "\s+/g" collapse replaces every run of whitespace
              // with a single space, character offsets in rawWsFlat match
              // rawNorm for non-whitespace characters; boundary whitespace
              // is safe to split on directly.
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
              // Reuse the shared ✦ marker styling (Paradise Lost / Orlando
              // Furioso / Don Juan all use pl-anchor-marker).
              marker.className = "pl-anchor-marker"
              marker.textContent = "\u2726" // ✦
              const beforeNode = document.createTextNode(before)
              const afterNode = document.createTextNode(after)
              parent.insertBefore(beforeNode, tn)
              parent.insertBefore(marker, tn)
              parent.insertBefore(afterNode, tn)
              parent.removeChild(tn)
              placed = true
              break outer
            }
            from = idx + needle.length
          }
        }
        if (placed) continue

        // Second attempt: cross-node anchor match. Build a flat string of
        // the subtree's text content (with a concurrent index → node/offset
        // map), search the flat string for the needle, and drop the
        // marker at the text node containing the match's start offset.
        const flat: string[] = []
        const nodeMap: Array<{ node: Text; offsetInFlat: number }> = []
        let runningLen = 0
        for (const tn of textNodes) {
          const s = (tn.nodeValue ?? "")
            .replace(/[\u2018\u2019]/g, "'")
            .replace(/[\u201C\u201D]/g, '"')
            .replace(/[\u2013\u2014]/g, "-")
          if (!s) continue
          nodeMap.push({ node: tn, offsetInFlat: runningLen })
          flat.push(s)
          runningLen += s.length
        }
        const flatJoined = flat.join("")
        const flatWsFlat = flatJoined.replace(/\s+/g, " ")
        // Because of \s+→" " collapsing, flatWsFlat is shorter than
        // flatJoined. We need an index in flatJoined, not flatWsFlat, to
        // locate the node. Walk both strings in parallel to translate.
        const idxInFlatWsFlat = flatWsFlat.indexOf(needle)
        if (idxInFlatWsFlat < 0) continue
        // Translate idxInFlatWsFlat → idxInFlatJoined.
        let i = 0, j = 0 // i indexes flatJoined, j indexes flatWsFlat
        while (j < idxInFlatWsFlat && i < flatJoined.length) {
          const cJ = flatJoined[i]
          if (/\s/.test(cJ)) {
            // Skip to end of whitespace run in flatJoined, advance j by 1.
            while (i < flatJoined.length && /\s/.test(flatJoined[i])) i++
            j++
          } else {
            i++
            j++
          }
        }
        const idxInFlatJoined = i
        // Find the node whose range contains idxInFlatJoined.
        let chosen: { node: Text; localOffset: number } | null = null
        for (let k = 0; k < nodeMap.length; k++) {
          const entry = nodeMap[k]
          const next = nodeMap[k + 1]?.offsetInFlat ?? Infinity
          if (idxInFlatJoined >= entry.offsetInFlat && idxInFlatJoined < next) {
            chosen = { node: entry.node, localOffset: idxInFlatJoined - entry.offsetInFlat }
            break
          }
        }
        if (!chosen) continue
        const raw = chosen.node.nodeValue ?? ""
        const before = raw.slice(0, chosen.localOffset)
        const after = raw.slice(chosen.localOffset)
        const parent = chosen.node.parentNode
        if (!parent) continue
        const marker = document.createElement("span")
        marker.setAttribute(MARKER_ATTR, ann.id)
        marker.setAttribute("role", "button")
        marker.setAttribute("tabindex", "0")
        marker.setAttribute("aria-label", `Open annotation: ${ann.title}`)
        marker.className = "pl-anchor-marker"
        marker.textContent = "\u2726" // ✦
        const beforeNode = document.createTextNode(before)
        const afterNode = document.createTextNode(after)
        parent.insertBefore(beforeNode, chosen.node)
        parent.insertBefore(marker, chosen.node)
        parent.insertBefore(afterNode, chosen.node)
        parent.removeChild(chosen.node)
      }

      root.addEventListener("click", onClick)
      clickHandlerRoot = root
      return true
    }

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
