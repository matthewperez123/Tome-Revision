"use client"

import "@liveblocks/react-ui/styles.css"

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
  type SyntheticEvent,
} from "react"
import {
  LiveblocksProvider,
  RoomProvider,
  useThreads,
  useSelf,
  useOthers,
  useEditThreadMetadata,
  useDeleteThread,
} from "@liveblocks/react"
import { Composer, Thread } from "@liveblocks/react-ui"
import type { ThreadData } from "@liveblocks/client"
import { useAuth } from "@/hooks/use-auth"
import {
  computeAnchor,
  findAnchorRange,
  type AnnotationAnchor,
} from "@/lib/annotations/anchor"

// Peer annotations are human-to-human → a flat RUBRIC accent (lapis), never
// iridescent. Iridescence is reserved for Virgil (PR4).
const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B" // endorsed / official clarification (PR2+)

type AnnotationThread = ThreadData<Liveblocks["ThreadMetadata"]>

function markersEqual(a: Marker[], b: Marker[]): boolean {
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const x = a[i]!
    const y = b[i]!
    if (
      x.threadId !== y.threadId ||
      x.replies !== y.replies ||
      x.endorsed !== y.endorsed ||
      x.top !== y.top ||
      x.rects.length !== y.rects.length
    ) {
      return false
    }
    for (let j = 0; j < x.rects.length; j++) {
      const rx = x.rects[j]!
      const ry = y.rects[j]!
      if (
        rx.left !== ry.left ||
        rx.top !== ry.top ||
        rx.width !== ry.width ||
        rx.height !== ry.height
      ) {
        return false
      }
    }
  }
  return true
}

interface AnnotationLayerProps {
  /** Base room `gs:{sessionId}:{bookId}:{chapterIndex}` (collaborative). */
  roomId: string
  chapterIndex: number
  /** The relative-positioned reader region we overlay (contains the page). */
  regionRef: RefObject<HTMLElement | null>
  /** Current page index — recompute highlight positions when it changes. */
  currentPage: number
  enabled: boolean
  /**
   * Privacy topology. `private_to_teacher` puts each student in their own
   * per-student room (`{roomId}:{uid}`) so only they and the teacher can read
   * it — enforced server-side by the auth endpoint, not client-side hiding.
   */
  visibility?: "collaborative" | "private_to_teacher"
  /** Show live presence avatars of others reading the same passage. */
  presenceEnabled?: boolean
}

/**
 * Mounts collaborative margin annotations over the locked reader. Renders
 * nothing for guest/unauthenticated readers (no auth.uid() for the secure
 * Liveblocks endpoint to authorize) or when annotations are disabled.
 */
export function AnnotationLayer({
  roomId,
  chapterIndex,
  regionRef,
  currentPage,
  enabled,
  visibility = "collaborative",
  presenceEnabled = false,
}: AnnotationLayerProps) {
  const { isAuthenticated, isLoading, user } = useAuth()

  if (!enabled || isLoading || !isAuthenticated) return null

  // In private mode every student gets their own room. Don't mount until we
  // know the student's id (the room id depends on it).
  if (visibility === "private_to_teacher" && !user) return null
  const effectiveRoom =
    visibility === "private_to_teacher" && user
      ? `${roomId}:${user.id}`
      : roomId

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider id={effectiveRoom} initialPresence={{ chapterIndex }}>
        <AnnotationCanvas
          chapterIndex={chapterIndex}
          regionRef={regionRef}
          currentPage={currentPage}
          presenceEnabled={presenceEnabled}
        />
      </RoomProvider>
    </LiveblocksProvider>
  )
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

interface Marker {
  threadId: string
  top: number // top of the highlight, relative to the region
  rects: Rect[] // highlight rectangles, relative to the region
  replies: number
  endorsed: boolean
}

interface PendingSelection {
  anchor: AnnotationAnchor
  left: number
  top: number
}

function AnnotationCanvas({
  chapterIndex,
  regionRef,
  currentPage,
  presenceEnabled,
}: {
  chapterIndex: number
  regionRef: RefObject<HTMLElement | null>
  currentPage: number
  presenceEnabled: boolean
}) {
  const { threads } = useThreads()
  const [markers, setMarkers] = useState<Marker[]>([])
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null)
  const [pending, setPending] = useState<PendingSelection | null>(null)
  const [composing, setComposing] = useState<PendingSelection | null>(null)
  const rafRef = useRef<number | undefined>(undefined)

  // Teacher moderation: the role is server-derived (auth endpoint) and lives in
  // userInfo — never trust a client-set value. Only a teacher sees endorse /
  // delete affordances.
  const isTeacher = useSelf((me) => me.info.role === "teacher") ?? false
  const editThreadMetadata = useEditThreadMetadata()
  const deleteThread = useDeleteThread()

  // Read the latest threads from a ref so `recompute` can stay referentially
  // stable — deriving `pageThreads` inline would change its identity every
  // render and spin the rAF/effect loop into infinite re-renders.
  const threadsRef = useRef(threads)
  threadsRef.current = threads

  const pageThreads = (threads ?? []).filter(
    (t): t is AnnotationThread => t.metadata.chapterIndex === chapterIndex,
  )

  // ── Re-find each thread's quote on the currently-rendered page ────────────
  const recompute = useCallback(() => {
    const region = regionRef.current
    if (!region) return
    const textEl = region.querySelector<HTMLElement>("[data-reader-text]")
    if (!textEl) {
      setMarkers((prev) => (prev.length ? [] : prev))
      return
    }
    const regionRect = region.getBoundingClientRect()
    const list = (threadsRef.current ?? []).filter(
      (t): t is AnnotationThread => t.metadata.chapterIndex === chapterIndex,
    )
    const next: Marker[] = []
    for (const thread of list) {
      const range = findAnchorRange(textEl, thread.metadata)
      if (!range) continue
      const rects = Array.from(range.getClientRects())
      if (rects.length === 0) continue
      const rel = rects.map((r) => ({
        left: r.left - regionRect.left,
        top: r.top - regionRect.top,
        width: r.width,
        height: r.height,
      }))
      next.push({
        threadId: thread.id,
        top: Math.min(...rel.map((r) => r.top)),
        rects: rel,
        replies: Math.max(0, thread.comments.length - 1),
        endorsed: thread.metadata.endorsed === true,
      })
    }
    // Skip the state update when nothing changed so we don't re-render (and
    // re-trigger) on every animation frame.
    setMarkers((prev) => (markersEqual(prev, next) ? prev : next))
    // Close a thread panel whose highlight is no longer on this page.
    setActiveThreadId((id) =>
      id && next.some((m) => m.threadId === id) ? id : null,
    )
  }, [regionRef, chapterIndex])

  const scheduleRecompute = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(recompute)
  }, [recompute])

  // Recompute on page change (immediately and after the turn animation
  // settles), on thread changes, on resize, and on DOM mutations.
  useLayoutEffect(() => {
    scheduleRecompute()
    const t = setTimeout(scheduleRecompute, 260)
    return () => clearTimeout(t)
  }, [currentPage, scheduleRecompute, threads])

  useEffect(() => {
    const region = regionRef.current
    if (!region) return
    const onResize = () => scheduleRecompute()
    window.addEventListener("resize", onResize)
    const mo = new MutationObserver(() => scheduleRecompute())
    mo.observe(region, { childList: true, subtree: true, characterData: true })
    return () => {
      window.removeEventListener("resize", onResize)
      mo.disconnect()
    }
  }, [regionRef, scheduleRecompute])

  // ── Capture text selection → offer to annotate ───────────────────────────
  useEffect(() => {
    const region = regionRef.current
    if (!region) return

    const onPointerUp = () => {
      // Defer so the browser finalizes the selection.
      setTimeout(() => {
        const sel = window.getSelection()
        const textEl = region.querySelector<HTMLElement>("[data-reader-text]")
        if (!sel || sel.isCollapsed || !textEl || sel.rangeCount === 0) {
          setPending(null)
          return
        }
        const range = sel.getRangeAt(0)
        if (
          !textEl.contains(range.startContainer) ||
          !textEl.contains(range.endContainer)
        ) {
          setPending(null)
          return
        }
        const anchor = computeAnchor(range, textEl, chapterIndex)
        if (!anchor) {
          setPending(null)
          return
        }
        const regionRect = region.getBoundingClientRect()
        const r = range.getBoundingClientRect()
        setPending({
          anchor,
          left: r.right - regionRect.left,
          top: r.top - regionRect.top,
        })
      }, 0)
    }

    region.addEventListener("pointerup", onPointerUp)
    return () => region.removeEventListener("pointerup", onPointerUp)
  }, [regionRef, chapterIndex])

  // Stop a selection drag (or marker click) from turning the page. Capture
  // phase on the region fires before PaginatedReader's bubble handlers.
  useEffect(() => {
    const region = regionRef.current
    if (!region) return
    const swallowIfSelecting = (e: Event) => {
      const sel = window.getSelection()
      if (sel && !sel.isCollapsed && sel.toString().trim()) e.stopPropagation()
    }
    region.addEventListener("click", swallowIfSelecting, true)
    region.addEventListener("pointerup", swallowIfSelecting, true)
    return () => {
      region.removeEventListener("click", swallowIfSelecting, true)
      region.removeEventListener("pointerup", swallowIfSelecting, true)
    }
  }, [regionRef])

  const activeThread = pageThreads.find((t) => t.id === activeThreadId) ?? null
  const activeMarker = markers.find((m) => m.threadId === activeThreadId) ?? null
  const regionH = regionRef.current?.clientHeight ?? 600

  const stop = (e: SyntheticEvent) => e.stopPropagation()

  const toggleEndorse = useCallback(
    (thread: AnnotationThread) => {
      editThreadMetadata({
        threadId: thread.id,
        metadata: { endorsed: !(thread.metadata.endorsed === true) },
      })
      scheduleRecompute()
    },
    [editThreadMetadata, scheduleRecompute],
  )

  const removeThread = useCallback(
    (threadId: string) => {
      deleteThread(threadId)
      setActiveThreadId((id) => (id === threadId ? null : id))
    },
    [deleteThread],
  )

  return (
    <div className="rubric-annotations pointer-events-none absolute inset-0 z-30">
      {/* Live presence — classmates reading the same passage */}
      {presenceEnabled && <PresenceAvatars />}

      {/* Highlights + gutter markers */}
      {markers.map((m) => (
        <div key={m.threadId}>
          {m.rects.map((r, i) => (
            <button
              key={i}
              type="button"
              onClick={(e) => {
                stop(e)
                setPending(null)
                setComposing(null)
                setActiveThreadId(m.threadId)
              }}
              className="pointer-events-auto absolute cursor-pointer"
              style={{
                left: r.left,
                top: r.top,
                width: r.width,
                height: r.height,
                backgroundColor: `${m.endorsed ? GOLD : LAPIS}2e`,
                borderBottom: `2px solid ${m.endorsed ? GOLD : LAPIS}`,
              }}
              aria-label="Open annotation"
            />
          ))}
          <button
            type="button"
            onClick={(e) => {
              stop(e)
              setPending(null)
              setComposing(null)
              setActiveThreadId(m.threadId)
            }}
            className="pointer-events-auto absolute flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-white shadow-sm"
            style={{
              right: 8,
              top: m.top,
              backgroundColor: m.endorsed ? GOLD : LAPIS,
              fontFamily: "var(--font-sans)",
            }}
            aria-label="Open annotation thread"
          >
            {m.endorsed ? "★" : "✎"}
            {m.replies > 0 && <span>{m.replies}</span>}
          </button>
        </div>
      ))}

      {/* "Annotate" affordance over a fresh selection */}
      {pending && !activeThreadId && !composing && (
        <div
          className="pointer-events-auto absolute"
          style={{
            left: Math.max(0, pending.left - 8),
            top: Math.max(0, pending.top - 36),
          }}
          onPointerUp={stop}
          onClick={stop}
        >
          <button
            type="button"
            onClick={(e) => {
              stop(e)
              setComposing(pending)
              setPending(null)
            }}
            className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-md"
            style={{ backgroundColor: LAPIS, fontFamily: "var(--font-sans)" }}
          >
            Annotate
          </button>
        </div>
      )}

      {/* New-annotation composer */}
      {composing && (
        <div
          className="pointer-events-auto absolute w-80 max-w-[80vw] overflow-hidden rounded-xl border bg-white shadow-xl"
          style={{
            right: 8,
            top: Math.min(composing.top, regionH - 200),
            borderColor: `${LAPIS}33`,
          }}
          onPointerUp={stop}
          onClick={stop}
        >
          <div
            className="border-b px-3 py-2"
            style={{ borderColor: `${LAPIS}22` }}
          >
            <p
              className="text-xs font-semibold"
              style={{ color: LAPIS, fontFamily: "var(--font-sans)" }}
            >
              New annotation
            </p>
            <p
              className="mt-1 line-clamp-2 text-xs italic text-gray-500"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              “{composing.anchor.quote}”
            </p>
          </div>
          <Composer
            metadata={{
              quote: composing.anchor.quote,
              prefix: composing.anchor.prefix,
              suffix: composing.anchor.suffix,
              startOffset: composing.anchor.startOffset,
              endOffset: composing.anchor.endOffset,
              chapterIndex: composing.anchor.chapterIndex,
            }}
            onComposerSubmit={() => {
              setComposing(null)
              scheduleRecompute()
            }}
            autoFocus
          />
        </div>
      )}

      {/* Existing-thread panel */}
      {activeThread && activeMarker && (
        <div
          className="pointer-events-auto absolute w-80 max-w-[80vw] rounded-xl border bg-white shadow-xl"
          style={{
            right: 8,
            top: Math.min(activeMarker.top, regionH - 160),
            borderColor: `${LAPIS}33`,
          }}
          onPointerUp={stop}
          onClick={stop}
        >
          <div
            className="flex items-center justify-between border-b px-3 py-2 text-xs font-semibold"
            style={{
              borderColor: `${LAPIS}22`,
              fontFamily: "var(--font-sans)",
              color: activeMarker.endorsed ? GOLD : LAPIS,
            }}
          >
            <span>
              {activeMarker.endorsed ? "Teacher clarification" : "Annotation"}
            </span>
            <div className="flex items-center gap-2">
              {isTeacher && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      stop(e)
                      toggleEndorse(activeThread)
                    }}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold hover:bg-black/5"
                    style={{ color: activeMarker.endorsed ? GOLD : LAPIS }}
                    aria-label={
                      activeMarker.endorsed ? "Remove endorsement" : "Endorse annotation"
                    }
                  >
                    {activeMarker.endorsed ? "★ Endorsed" : "☆ Endorse"}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      stop(e)
                      removeThread(activeThread.id)
                    }}
                    className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-gray-400 hover:bg-black/5 hover:text-red-600"
                    aria-label="Delete annotation"
                  >
                    Delete
                  </button>
                </>
              )}
              <button
                type="button"
                onClick={(e) => {
                  stop(e)
                  setActiveThreadId(null)
                }}
                className="text-gray-400 hover:text-gray-700"
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="max-h-[60vh] overflow-y-auto p-1">
            <Thread thread={activeThread} showResolveAction />
          </div>
        </div>
      )}
    </div>
  )
}

/** Avatar cluster of others connected to this room (gated on presence_enabled). */
function PresenceAvatars() {
  const others = useOthers()
  if (others.length === 0) return null
  const shown = others.slice(0, 4)
  const extra = others.length - shown.length
  return (
    <div className="pointer-events-none absolute left-2 top-2 flex items-center -space-x-2">
      {shown.map((other) => {
        const name = other.info?.name ?? "Reader"
        const avatar = other.info?.avatar
        const isTeacher = other.info?.role === "teacher"
        return (
          <div
            key={other.connectionId}
            title={name}
            className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border-2 border-white text-[11px] font-semibold text-white shadow-sm"
            style={{
              backgroundColor: isTeacher ? GOLD : LAPIS,
              fontFamily: "var(--font-sans)",
            }}
          >
            {avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatar} alt={name} className="h-full w-full object-cover" />
            ) : (
              name.charAt(0).toUpperCase()
            )}
          </div>
        )
      })}
      {extra > 0 && (
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-gray-500 text-[11px] font-semibold text-white shadow-sm"
          style={{ fontFamily: "var(--font-sans)" }}
        >
          +{extra}
        </div>
      )}
    </div>
  )
}
