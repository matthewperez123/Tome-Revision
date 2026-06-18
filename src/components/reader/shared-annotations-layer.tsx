"use client"

/**
 * SharedAnnotationsLayer — renders classmates' SHARED highlights over the
 * current chapter, live.
 *
 * A highlight becomes visible to a classmate only when its owner sets
 * `shared = true` + a `classroom_id` the viewer belongs to; the
 * `highlights_shared_read` RLS policy (can_access_classroom) does the
 * authorization, so this component simply selects shared rows for the book +
 * chapter and trusts RLS to filter them. Each shared passage is underlined in
 * the accent color and carries a native tooltip with the author + note.
 *
 * Realtime: subscribes to all `highlights` changes for this book. Because the
 * publication respects RLS, we only receive rows we may read; on any change we
 * reconcile by clearing and re-applying. Own highlights are excluded — those
 * are owned by <ReaderHighlights/>.
 */

import { useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase/client"

interface SharedAnnotationsLayerProps {
  bookId: string
  chapterIndex: number
}

interface SharedRow {
  id: string
  user_id: string
  start_offset: number
  end_offset: number
  selected_text: string
  note: string | null
}

const READER_SELECTOR = "[data-reader-text]"
const MARK_CLASS = "tome-shared-annotation"

// ── DOM helpers ───────────────────────────────────────────────────────

function textNodesIn(root: HTMLElement): Text[] {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const nodes: Text[] = []
  let n: Node | null
  while ((n = walker.nextNode())) nodes.push(n as Text)
  return nodes
}

/** Wrap [start, end) under `root` in a shared-annotation <mark>. */
function applyShared(
  root: HTMLElement,
  start: number,
  end: number,
  id: string,
  tooltip: string,
) {
  if (end <= start) return
  if (root.querySelector(`mark.${MARK_CLASS}[data-shared-id="${id}"]`)) return

  const targets: { node: Text; from: number; to: number }[] = []
  let acc = 0
  for (const node of textNodesIn(root)) {
    const len = node.nodeValue?.length ?? 0
    const nodeStart = acc
    const nodeEnd = acc + len
    acc = nodeEnd
    if (nodeEnd <= start || nodeStart >= end) continue
    // Don't nest inside an existing highlight/annotation mark.
    if (node.parentElement?.closest(".tome-highlight, ." + MARK_CLASS)) continue
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
    mark.className = MARK_CLASS
    mark.dataset.sharedId = id
    mark.title = tooltip
    try {
      range.surroundContents(mark)
    } catch {
      // Range crossed a non-text boundary within this slice; skip it.
    }
  }
}

/** Unwrap every shared-annotation mark, restoring plain text. */
function clearShared(root: HTMLElement) {
  const marks = root.querySelectorAll<HTMLElement>(`mark.${MARK_CLASS}`)
  marks.forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  })
}

// ── Component ─────────────────────────────────────────────────────────

export function SharedAnnotationsLayer({
  bookId,
  chapterIndex,
}: SharedAnnotationsLayerProps) {
  const myIdRef = useRef<string | null>(null)

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    async function reconcile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (cancelled) return
      myIdRef.current = user?.id ?? null
      if (!user) return

      const { data: rows, error } = await supabase
        .from("highlights")
        .select("id, user_id, start_offset, end_offset, selected_text, note")
        .eq("book_id", bookId)
        .eq("chapter_index", chapterIndex)
        .eq("shared", true)
        .neq("user_id", user.id)
      if (cancelled || error) return

      const shared = (rows as SharedRow[]) ?? []

      // Resolve author display names (profiles are publicly readable).
      const authorIds = Array.from(new Set(shared.map((r) => r.user_id)))
      const names = new Map<string, string>()
      if (authorIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", authorIds)
        for (const p of (profiles as { id: string; display_name: string | null }[]) ?? []) {
          names.set(p.id, p.display_name ?? "A classmate")
        }
      }

      // Wait for the chapter HTML to mount, then (re)apply.
      let attempts = 0
      const tick = () => {
        if (cancelled) return
        const root = document.querySelector<HTMLElement>(READER_SELECTOR)
        if (root && root.textContent && root.textContent.length > 0) {
          clearShared(root)
          for (const r of shared) {
            const author = names.get(r.user_id) ?? "A classmate"
            const tooltip = r.note
              ? `${author}: ${r.note}`
              : `Shared by ${author}`
            applyShared(root, r.start_offset, r.end_offset, r.id, tooltip)
          }
          return
        }
        attempts += 1
        if (attempts > 25) return
        setTimeout(tick, 80)
      }
      tick()
    }

    reconcile()

    // Live updates: any change to a highlight for this book may add/remove a
    // shared annotation we can see. RLS gates the payloads; we just re-run.
    const channel = supabase
      .channel(`shared-highlights:${bookId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "highlights",
          filter: `book_id=eq.${bookId}`,
        },
        () => {
          reconcile()
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      const root = document.querySelector<HTMLElement>(READER_SELECTOR)
      if (root) clearShared(root)
      supabase.removeChannel(channel)
    }
  }, [bookId, chapterIndex])

  return null
}
