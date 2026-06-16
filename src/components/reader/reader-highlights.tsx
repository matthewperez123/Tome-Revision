"use client"

/**
 * ReaderHighlights — minimal text-selection highlight flow for the reader.
 *
 * On selecting text inside `[data-reader-text]`, a small popover offers two
 * actions:
 *   • Highlight  — wraps the selection in <mark class="tome-highlight">
 *                  (warm-yellow background, black text) and persists it to
 *                  Supabase scoped to user + book + chapter + character range.
 *   • Ask Virgil — opens the existing Virgil chat with the selected passage
 *                  seeded as page context (reuses useVirgil()).
 *
 * Saved highlights are re-applied to the rendered chapter on load. Anchoring
 * uses character offsets into the chapter's concatenated text content, which
 * is stable across reloads because wrapping a passage in <mark> does not
 * change the surrounding text content.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useVirgil } from "@/lib/virgil-context"

interface ReaderHighlightsProps {
  bookId: string
  bookTitle: string
  bookAuthor: string
  chapterIndex: number
  chapterTitle: string
}

interface HighlightRow {
  id: string
  start_offset: number
  end_offset: number
  color: string
}

interface PopoverState {
  text: string
  start: number
  end: number
  top: number
  left: number
}

const READER_SELECTOR = "[data-reader-text]"
const DEFAULT_COLOR = "#FFE08A"

// ── Offset / DOM helpers ──────────────────────────────────────────────

/** All text nodes under `root`, in document order. */
function textNodesIn(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) nodes.push(n as Text)
  return nodes
}

/**
 * Character offset of (container, offset) within `root`'s text content.
 * Works whether the boundary sits in a text node or an element node.
 */
function globalOffset(root: HTMLElement, container: Node, offset: number): number {
  const range = document.createRange()
  range.selectNodeContents(root)
  range.setEnd(container, offset)
  return range.toString().length
}

/**
 * Wrap the character range [start, end) under `root` in a highlight <mark>.
 * Splits across text nodes as needed; applies in reverse so earlier node
 * references stay valid. No-ops on portions already inside a highlight.
 */
function applyHighlight(
  root: HTMLElement,
  start: number,
  end: number,
  color: string,
  id: string,
) {
  if (end <= start) return
  // Already applied? Skip (effect can run more than once).
  if (root.querySelector(`mark.tome-highlight[data-highlight-id="${id}"]`)) return

  const targets: { node: Text; from: number; to: number }[] = []
  let acc = 0
  for (const node of textNodesIn(root)) {
    const len = node.nodeValue?.length ?? 0
    const nodeStart = acc
    const nodeEnd = acc + len
    acc = nodeEnd
    if (nodeEnd <= start || nodeStart >= end) continue
    if (node.parentElement?.closest(".tome-highlight")) continue
    const from = Math.max(start, nodeStart) - nodeStart
    const to = Math.min(end, nodeEnd) - nodeStart
    if (to > from) targets.push({ node, from, to })
  }

  for (let i = targets.length - 1; i >= 0; i--) {
    const { node, from, to } = targets[i]
    const range = document.createRange()
    range.setStart(node, from)
    range.setEnd(node, to)
    const mark = document.createElement("mark")
    mark.className = "tome-highlight"
    mark.dataset.highlightId = id
    if (color && color !== DEFAULT_COLOR) mark.style.backgroundColor = color
    try {
      range.surroundContents(mark)
    } catch {
      // Range crossed a non-text boundary within this node slice; skip it.
    }
  }
}

// ── Component ─────────────────────────────────────────────────────────

export function ReaderHighlights({
  bookId,
  bookTitle,
  bookAuthor,
  chapterIndex,
  chapterTitle,
}: ReaderHighlightsProps) {
  const { openChat, setPageContext, addMessage } = useVirgil()
  const [popover, setPopover] = useState<PopoverState | null>(null)
  const userIdRef = useRef<string | null>(null)

  // Resolve the signed-in user once.
  useEffect(() => {
    let cancelled = false
    createClient()
      .auth.getUser()
      .then(({ data }) => {
        if (!cancelled) userIdRef.current = data.user?.id ?? null
      })
    return () => {
      cancelled = true
    }
  }, [])

  // Load + re-apply saved highlights for this book + chapter. Retries until
  // the chapter HTML has mounted into [data-reader-text].
  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data: userData } = await createClient().auth.getUser()
      const userId = userData.user?.id
      userIdRef.current = userId ?? null
      if (!userId) return

      const { data, error } = await createClient()
        .from("highlights")
        .select("id, start_offset, end_offset, color")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .eq("chapter_index", chapterIndex)
      if (cancelled || error || !data) return

      let attempts = 0
      const tick = () => {
        if (cancelled) return
        const root = document.querySelector<HTMLElement>(READER_SELECTOR)
        if (root && root.textContent && root.textContent.length > 0) {
          for (const h of data as HighlightRow[]) {
            applyHighlight(root, h.start_offset, h.end_offset, h.color, h.id)
          }
          return
        }
        attempts += 1
        if (attempts > 25) return
        setTimeout(tick, 80)
      }
      tick()
    }

    load()
    return () => {
      cancelled = true
    }
  }, [bookId, chapterIndex])

  // Show the popover when there is a non-empty selection inside the reader.
  const refreshPopover = useCallback(() => {
    const sel = window.getSelection()
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setPopover(null)
      return
    }
    const text = sel.toString().trim()
    if (!text) {
      setPopover(null)
      return
    }
    const root = document.querySelector<HTMLElement>(READER_SELECTOR)
    const range = sel.getRangeAt(0)
    if (!root || !root.contains(range.commonAncestorContainer)) {
      setPopover(null)
      return
    }
    const start = globalOffset(root, range.startContainer, range.startOffset)
    const end = start + sel.toString().length
    const rect = range.getBoundingClientRect()
    setPopover({
      text,
      start,
      end,
      top: rect.top - 8,
      left: rect.left + rect.width / 2,
    })
  }, [])

  useEffect(() => {
    function onMouseUp() {
      // Defer so the selection is finalized before we read it.
      setTimeout(refreshPopover, 0)
    }
    function onScroll() {
      setPopover(null)
    }
    document.addEventListener("mouseup", onMouseUp)
    document.addEventListener("scroll", onScroll, true)
    return () => {
      document.removeEventListener("mouseup", onMouseUp)
      document.removeEventListener("scroll", onScroll, true)
    }
  }, [refreshPopover])

  const handleHighlight = useCallback(async () => {
    if (!popover) return
    const root = document.querySelector<HTMLElement>(READER_SELECTOR)
    if (!root) return

    const tempId = `pending-${Date.now()}`
    applyHighlight(root, popover.start, popover.end, DEFAULT_COLOR, tempId)
    window.getSelection()?.removeAllRanges()
    setPopover(null)

    const userId = userIdRef.current
    if (!userId) return

    const { data, error } = await createClient()
      .from("highlights")
      .insert({
        user_id: userId,
        book_id: bookId,
        chapter_index: chapterIndex,
        selected_text: popover.text,
        start_offset: popover.start,
        end_offset: popover.end,
        color: DEFAULT_COLOR,
      })
      .select("id")
      .single()

    // Swap the optimistic id for the persisted one so a later reload matches.
    if (!error && data) {
      root
        .querySelectorAll<HTMLElement>(`mark.tome-highlight[data-highlight-id="${tempId}"]`)
        .forEach((el) => {
          el.dataset.highlightId = data.id
        })
    }
  }, [popover, bookId, chapterIndex])

  const handleAskVirgil = useCallback(() => {
    if (!popover) return
    const passage = popover.text
    setPageContext({
      page: "reader",
      bookTitle,
      bookAuthor,
      chapterTitle,
      chapterContent: passage,
    })
    addMessage("user", `About this passage:\n\n"${passage}"`)
    openChat()
    window.getSelection()?.removeAllRanges()
    setPopover(null)
  }, [popover, bookTitle, bookAuthor, chapterTitle, setPageContext, addMessage, openChat])

  if (!popover) return null

  return (
    <div
      role="menu"
      aria-label="Selection actions"
      style={{
        position: "fixed",
        top: popover.top,
        left: popover.left,
        transform: "translate(-50%, -100%)",
        zIndex: 60,
      }}
      // Keep the selection alive when the popover is clicked.
      onMouseDown={(e) => e.preventDefault()}
    >
      <div
        style={{
          display: "flex",
          gap: 2,
          padding: 4,
          borderRadius: 10,
          background: "var(--popover, #1a1611)",
          border: "1px solid var(--border, rgba(0,0,0,0.12))",
          boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
        }}
      >
        <button
          type="button"
          onClick={handleHighlight}
          className="reader-highlight-action"
          style={popoverButtonStyle}
        >
          Highlight
        </button>
        <span style={{ width: 1, background: "var(--border, rgba(255,255,255,0.15))" }} />
        <button
          type="button"
          onClick={handleAskVirgil}
          className="reader-highlight-action"
          style={popoverButtonStyle}
        >
          Ask Virgil
        </button>
      </div>
    </div>
  )
}

const popoverButtonStyle: React.CSSProperties = {
  appearance: "none",
  border: "none",
  background: "transparent",
  color: "var(--popover-foreground, #fbf8f3)",
  fontSize: 13,
  fontWeight: 600,
  padding: "6px 12px",
  borderRadius: 6,
  cursor: "pointer",
  whiteSpace: "nowrap",
}
