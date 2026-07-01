"use client"

/**
 * ReaderHighlights — minimal text-selection highlight flow for the reader.
 *
 * On selecting text inside `[data-reader-text]`, a small popover offers a
 * colour dot per RUBRIC hue that wraps the selection in
 * <mark class="tome-highlight"> and persists it to Supabase scoped to
 * user + book + chapter + character range. Clicking a saved highlight opens an
 * editor to add a note or share it to a classroom.
 *
 * Saved highlights are re-applied to the rendered chapter on load. Anchoring
 * uses character offsets into the chapter's concatenated text content, which
 * is stable across reloads because wrapping a passage in <mark> does not
 * change the surrounding text content.
 */

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  listMyClassrooms,
  type MyClassroomItem,
} from "@/lib/actions/classrooms"
import {
  createHighlight,
  deleteHighlight,
  toggleShared,
  updateHighlightNote,
} from "@/lib/actions/highlights"

interface ReaderHighlightsProps {
  bookId: string
  chapterIndex: number
  // When the reader is opened inside a classroom, classmates' shared
  // highlights for this (book, chapter, classroom) are also painted — visually
  // distinct from the reader's own marks — and kept live via realtime.
  classroomId?: string | null
}

interface HighlightRow {
  id: string
  start_offset: number
  end_offset: number
  color: string
  note: string | null
  shared: boolean
  classroom_id: string | null
}

/** A classmate's shared highlight, painted as a peer annotation. */
interface PeerHighlightRow {
  id: string
  user_id: string
  start_offset: number
  end_offset: number
  note: string | null
  authorName: string
}

interface EditorState {
  row: HighlightRow
  top: number
  left: number
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

// RUBRIC highlight palette offered in the selection popover.
const HIGHLIGHT_COLORS: { name: string; hex: string }[] = [
  { name: "Lapis", hex: "#2A4B8D" },
  { name: "Gold", hex: "#C8A24B" },
  { name: "Verdigris", hex: "#2E7D6F" },
  { name: "Vermilion", hex: "#C8553D" },
]

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

/** Initials for the peer-highlight hover label. */
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/**
 * Paint a classmate's shared highlight as a thin dotted underline (never a
 * fill — that's reserved for the reader's own marks, and never iridescent —
 * that's Virgil's). The author's name + note surface on hover via `title`.
 */
function applyPeerHighlight(root: HTMLElement, peer: PeerHighlightRow) {
  const { id, start_offset: start, end_offset: end } = peer
  if (end <= start) return
  if (root.querySelector(`mark.tome-shared-annotation[data-shared-id="${id}"]`)) return

  const label = peer.note
    ? `${peer.authorName} (${initialsOf(peer.authorName)}) — ${peer.note}`
    : `${peer.authorName} (${initialsOf(peer.authorName)})`

  const targets: { node: Text; from: number; to: number }[] = []
  let acc = 0
  for (const node of textNodesIn(root)) {
    const len = node.nodeValue?.length ?? 0
    const nodeStart = acc
    const nodeEnd = acc + len
    acc = nodeEnd
    if (nodeEnd <= start || nodeStart >= end) continue
    // Don't wrap inside the reader's own highlight mark.
    if (node.parentElement?.closest("mark.tome-highlight")) continue
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
    mark.className = "tome-shared-annotation"
    mark.dataset.sharedId = id
    mark.title = label
    try {
      range.surroundContents(mark)
    } catch {
      // Crossed a non-text boundary in this slice; skip it.
    }
  }
}

/** Unwrap every <mark> matching `selector` under `root`, restoring the text. */
function unwrapMarks(root: HTMLElement, selector: string) {
  root.querySelectorAll<HTMLElement>(selector).forEach((mark) => {
    const parent = mark.parentNode
    if (!parent) return
    while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
    parent.removeChild(mark)
    parent.normalize()
  })
}

// ── Component ─────────────────────────────────────────────────────────

export function ReaderHighlights({
  bookId,
  chapterIndex,
  classroomId,
}: ReaderHighlightsProps) {
  const [popover, setPopover] = useState<PopoverState | null>(null)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [classrooms, setClassrooms] = useState<MyClassroomItem[] | null>(null)
  const userIdRef = useRef<string | null>(null)
  // Persisted own-highlight rows for this chapter, keyed by id, so a click on
  // a <mark> can open the note/share editor with the current state.
  const ownRowsRef = useRef<Map<string, HighlightRow>>(new Map())
  // Classmates' shared highlights painted in this chapter (classroom only).
  const peerRowsRef = useRef<Map<string, PeerHighlightRow>>(new Map())

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
        .select("id, start_offset, end_offset, color, note, shared, classroom_id")
        .eq("user_id", userId)
        .eq("book_id", bookId)
        .eq("chapter_index", chapterIndex)
      if (cancelled || error || !data) return

      const rows = data as HighlightRow[]
      ownRowsRef.current = new Map(rows.map((h) => [h.id, h]))

      let attempts = 0
      const tick = () => {
        if (cancelled) return
        const root = document.querySelector<HTMLElement>(READER_SELECTOR)
        if (root && root.textContent && root.textContent.length > 0) {
          for (const h of rows) {
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

  // ── Classmates' shared highlights + realtime fanout (classroom only) ──
  // Paints peer annotations for this (book, chapter, classroom) and keeps them
  // live: subscribes to highlights changes filtered by classroom_id and
  // adds/removes marks as classmates share/unshare. RLS (highlights_shared_read)
  // means we only ever receive rows we're allowed to see.
  useEffect(() => {
    if (!classroomId) return
    let cancelled = false
    const supabase = createClient()

    // Paint once the reader HTML has mounted (retry until it has).
    function paintWhenReady(peer: PeerHighlightRow) {
      let attempts = 0
      const tick = () => {
        if (cancelled) return
        const root = document.querySelector<HTMLElement>(READER_SELECTOR)
        if (root && root.textContent && root.textContent.length > 0) {
          applyPeerHighlight(root, peer)
          return
        }
        attempts += 1
        if (attempts > 25) return
        setTimeout(tick, 80)
      }
      tick()
    }

    function removePeer(id: string) {
      peerRowsRef.current.delete(id)
      const root = document.querySelector<HTMLElement>(READER_SELECTOR)
      if (root) {
        unwrapMarks(root, `mark.tome-shared-annotation[data-shared-id="${id}"]`)
      }
    }

    async function resolveName(userId: string): Promise<string> {
      const { data } = await supabase
        .from("profiles")
        .select("display_name")
        .eq("id", userId)
        .maybeSingle<{ display_name: string | null }>()
      return data?.display_name ?? "Classmate"
    }

    async function load() {
      const { data: userData } = await supabase.auth.getUser()
      const me = userData.user?.id ?? null
      userIdRef.current = me

      const { data, error } = await supabase
        .from("highlights")
        .select("id, user_id, start_offset, end_offset, note")
        .eq("classroom_id", classroomId)
        .eq("book_id", bookId)
        .eq("chapter_index", chapterIndex)
        .eq("shared", true)
      if (cancelled || error || !data) return

      const others = (
        data as {
          id: string
          user_id: string
          start_offset: number
          end_offset: number
          note: string | null
        }[]
      ).filter((h) => h.user_id !== me)
      if (others.length === 0) return

      // Resolve author display names in one batch for hover attribution.
      const ids = [...new Set(others.map((h) => h.user_id))]
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, display_name")
        .in("id", ids)
      const nameById = new Map(
        (
          (profiles as { id: string; display_name: string | null }[] | null) ?? []
        ).map((p) => [p.id, p.display_name ?? "Classmate"]),
      )

      for (const h of others) {
        const peer: PeerHighlightRow = {
          ...h,
          authorName: nameById.get(h.user_id) ?? "Classmate",
        }
        peerRowsRef.current.set(peer.id, peer)
        paintWhenReady(peer)
      }
    }

    load()

    const channel = supabase
      .channel(`highlights:classroom:${classroomId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "highlights",
          filter: `classroom_id=eq.${classroomId}`,
        },
        (payload) => {
          if (cancelled) return
          const next = payload.new as {
            id?: string
            user_id?: string
            book_id?: string
            chapter_index?: number
            start_offset?: number
            end_offset?: number
            note?: string | null
            shared?: boolean
          } | null
          const prev = payload.old as { id?: string } | null
          const id = next?.id ?? prev?.id
          if (!id) return

          // Removal: deleted, or updated to no-longer-shared.
          if (payload.eventType === "DELETE" || next?.shared !== true) {
            removePeer(id)
            return
          }
          // Only this chapter's passages, never our own row.
          if (next.book_id !== bookId || next.chapter_index !== chapterIndex) return
          if (next.user_id === userIdRef.current) return

          // (Re)paint — strip any stale mark first (e.g. offsets changed).
          removePeer(id)
          void resolveName(next.user_id!).then((authorName) => {
            if (cancelled) return
            const peer: PeerHighlightRow = {
              id,
              user_id: next.user_id!,
              start_offset: next.start_offset!,
              end_offset: next.end_offset!,
              note: next.note ?? null,
              authorName,
            }
            peerRowsRef.current.set(peer.id, peer)
            paintWhenReady(peer)
          })
        },
      )
      .subscribe()

    return () => {
      cancelled = true
      const root = document.querySelector<HTMLElement>(READER_SELECTOR)
      if (root) unwrapMarks(root, "mark.tome-shared-annotation")
      peerRowsRef.current.clear()
      void supabase.removeChannel(channel)
    }
  }, [classroomId, bookId, chapterIndex])

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

  // Click an existing OWN highlight to open the note / share editor.
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null
      const mark = target?.closest<HTMLElement>("mark.tome-highlight")
      const id = mark?.dataset.highlightId
      if (!mark || !id) return
      const row = ownRowsRef.current.get(id)
      if (!row) return
      const rect = mark.getBoundingClientRect()
      setPopover(null)
      window.getSelection()?.removeAllRanges()
      setEditor({ row, top: rect.bottom + 8, left: rect.left })
    }
    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  // Lazy-load the viewer's classrooms the first time the editor opens.
  useEffect(() => {
    if (editor && classrooms === null) {
      listMyClassrooms()
        .then((list) => setClassrooms(list.filter((c) => !c.archived)))
        .catch(() => setClassrooms([]))
    }
  }, [editor, classrooms])

  const handleHighlight = useCallback(
    async (color: string) => {
      if (!popover) return
      const root = document.querySelector<HTMLElement>(READER_SELECTOR)
      if (!root) return

      const tempId = `pending-${Date.now()}`
      applyHighlight(root, popover.start, popover.end, color, tempId)
      const text = popover.text
      const start = popover.start
      const end = popover.end
      window.getSelection()?.removeAllRanges()
      setPopover(null)

      const res = await createHighlight({
        bookId,
        chapterIndex,
        selectedText: text,
        startOffset: start,
        endOffset: end,
        color,
        note: "",
      })

      // Swap the optimistic id for the persisted one so a later reload matches.
      if (res.ok) {
        root
          .querySelectorAll<HTMLElement>(`mark.tome-highlight[data-highlight-id="${tempId}"]`)
          .forEach((el) => {
            el.dataset.highlightId = res.data.id
          })
      }
    },
    [popover, bookId, chapterIndex],
  )

  // ── Editor (note + share) for own highlights ──────────────────────────

  const patchRow = useCallback((id: string, patch: Partial<HighlightRow>) => {
    const current = ownRowsRef.current.get(id)
    if (!current) return
    const next = { ...current, ...patch }
    ownRowsRef.current.set(id, next)
    setEditor((prev) => (prev && prev.row.id === id ? { ...prev, row: next } : prev))
  }, [])

  const handleSaveNote = useCallback(
    async (id: string, note: string) => {
      const trimmed = note.trim()
      patchRow(id, { note: trimmed || null })
      await updateHighlightNote({ highlightId: id, note: trimmed || null })
    },
    [patchRow],
  )

  const handleShare = useCallback(
    async (id: string, classroomId: string) => {
      patchRow(id, { shared: true, classroom_id: classroomId })
      const res = await toggleShared({ id, shared: true, classroomId })
      if (!res.ok) patchRow(id, { shared: false, classroom_id: null })
    },
    [patchRow],
  )

  const handleUnshare = useCallback(
    async (id: string) => {
      // Keep classroom_id (see toggleShared) — only the shared flag changes.
      patchRow(id, { shared: false })
      await toggleShared({ id, shared: false })
    },
    [patchRow],
  )

  const handleDelete = useCallback(async (id: string) => {
    const root = document.querySelector<HTMLElement>(READER_SELECTOR)
    root
      ?.querySelectorAll<HTMLElement>(`mark.tome-highlight[data-highlight-id="${id}"]`)
      .forEach((mark) => {
        const parent = mark.parentNode
        if (!parent) return
        while (mark.firstChild) parent.insertBefore(mark.firstChild, mark)
        parent.removeChild(mark)
        parent.normalize()
      })
    ownRowsRef.current.delete(id)
    setEditor(null)
    await deleteHighlight({ id })
  }, [])

  if (!popover && !editor) return null

  return (
    <>
      {editor ? (
        <HighlightEditor
          key={editor.row.id}
          state={editor}
          classrooms={classrooms}
          onSaveNote={handleSaveNote}
          onShare={handleShare}
          onUnshare={handleUnshare}
          onDelete={handleDelete}
          onClose={() => setEditor(null)}
        />
      ) : null}
      {popover ? (
        <SelectionPopover popover={popover} onHighlight={handleHighlight} />
      ) : null}
    </>
  )
}

// ── Selection popover (colour dots) ───────────────────────────────────

function SelectionPopover({
  popover,
  onHighlight,
}: {
  popover: PopoverState
  onHighlight: (color: string) => void
}) {
  return (
    <div
      role="menu"
      aria-label="Highlight colours"
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
          alignItems: "center",
          gap: 6,
          padding: "6px 8px",
          borderRadius: 10,
          background: "var(--popover, #1a1611)",
          border: "1px solid var(--border, rgba(0,0,0,0.12))",
          boxShadow: "0 6px 20px rgba(0,0,0,0.22)",
        }}
      >
        <div style={{ display: "flex", gap: 5, padding: "0 2px" }}>
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.hex}
              type="button"
              onClick={() => onHighlight(c.hex)}
              title={`Highlight — ${c.name}`}
              aria-label={`Highlight in ${c.name}`}
              style={{
                width: 16,
                height: 16,
                borderRadius: "50%",
                background: c.hex,
                border: "1.5px solid rgba(255,255,255,0.6)",
                cursor: "pointer",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Highlight editor (note + share to a classroom) ────────────────────

function HighlightEditor({
  state,
  classrooms,
  onSaveNote,
  onShare,
  onUnshare,
  onDelete,
  onClose,
}: {
  state: EditorState
  classrooms: MyClassroomItem[] | null
  onSaveNote: (id: string, note: string) => void | Promise<void>
  onShare: (id: string, classroomId: string) => void | Promise<void>
  onUnshare: (id: string) => void | Promise<void>
  onDelete: (id: string) => void | Promise<void>
  onClose: () => void
}) {
  const { row } = state
  const [note, setNote] = useState(row.note ?? "")
  const [picking, setPicking] = useState(false)

  // Close on outside click / Escape.
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) onClose()
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose()
    }
    // Defer so the opening click doesn't immediately close it.
    const t = setTimeout(() => {
      document.addEventListener("mousedown", onDocClick)
      document.addEventListener("keydown", onKey)
    }, 0)
    return () => {
      clearTimeout(t)
      document.removeEventListener("mousedown", onDocClick)
      document.removeEventListener("keydown", onKey)
    }
  }, [onClose])

  const noteChanged = (note.trim() || null) !== (row.note ?? null)

  return (
    <div
      ref={ref}
      role="dialog"
      aria-label="Edit highlight"
      style={{
        position: "fixed",
        top: Math.min(state.top, window.innerHeight - 280),
        left: Math.min(state.left, window.innerWidth - 296),
        zIndex: 60,
        width: 280,
      }}
      className="rounded-xl border border-border bg-popover text-popover-foreground p-3 shadow-xl"
    >
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note…"
        rows={3}
        autoFocus
        className="w-full resize-none rounded-md border border-border bg-background px-2.5 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)]"
      />

      <div className="mt-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onDelete(row.id)}
          className="text-xs font-medium text-rose-500 hover:text-rose-400"
        >
          Delete
        </button>
        <button
          type="button"
          disabled={!noteChanged}
          onClick={() => onSaveNote(row.id, note)}
          className="rounded-md bg-[var(--tome-accent)] px-3 py-1 text-xs font-semibold text-white disabled:opacity-40"
        >
          Save note
        </button>
      </div>

      <div className="mt-3 border-t border-border pt-2">
        {row.shared ? (
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-emerald-500">
              Shared with your class
            </span>
            <button
              type="button"
              onClick={() => onUnshare(row.id)}
              className="text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              Unshare
            </button>
          </div>
        ) : picking ? (
          classrooms === null ? (
            <p className="text-[11px] text-muted-foreground">Loading classes…</p>
          ) : classrooms.length === 0 ? (
            <p className="text-[11px] text-muted-foreground">
              Join a class to share annotations.
            </p>
          ) : (
            <div className="space-y-1">
              {classrooms.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onShare(row.id, c.id)}
                  className="block w-full truncate rounded-md px-2 py-1 text-left text-xs hover:bg-accent"
                >
                  {c.name}
                </button>
              ))}
            </div>
          )
        ) : (
          <button
            type="button"
            onClick={() => setPicking(true)}
            className="text-xs font-medium text-[var(--tome-accent)] hover:opacity-80"
          >
            Share with a class
          </button>
        )}
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
