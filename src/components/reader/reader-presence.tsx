"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  type RefObject,
} from "react"
import { createPortal } from "react-dom"
import {
  LiveblocksProvider,
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
} from "@liveblocks/react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const MAX_VISIBLE = 4

// Muted RUBRIC accents (lapis / verdigris / gold / vermilion). Peers are
// colored deterministically by connection id. Deliberately NOT iridescent —
// iridescence is reserved for Virgil.
const PEER_COLORS = ["#2A4B8D", "#2E7D6F", "#9c6e2b", "#C8553D", "#3B5BA5"] as const
function peerColor(connectionId: number): string {
  return PEER_COLORS[connectionId % PEER_COLORS.length]!
}

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/** roomId convention: classroom-scoped when opened from a class, else global. */
function roomIdFor(bookId: string, classroomId?: string | null): string {
  return classroomId ? `classroom:${classroomId}:book:${bookId}` : `book:${bookId}`
}

// Signals to the toolbar avatar stack whether a presence room is mounted, so it
// can safely call room hooks (which throw with no RoomProvider ancestor) only
// when one exists.
const PresenceMountedContext = createContext(false)

/**
 * Wraps the reader in a Liveblocks room and paints ephemeral co-reader presence
 * (live cursors + text selections) over the reading surface. Renders its
 * children untouched — with NO Liveblocks connection — when presence is off:
 *   - visitor is signed out / demo (no auth.uid() for the secure endpoint), or
 *   - a classroom room whose classrooms.live_presence_enabled is false.
 * Presence is ephemeral only; highlights and notes are Supabase, never here.
 */
export function ReaderPresenceRoom({
  bookId,
  classroomId,
  chapterIndex,
  surfaceRef,
  children,
}: {
  bookId: string
  classroomId?: string | null
  chapterIndex: number
  surfaceRef: RefObject<HTMLDivElement | null>
  children: ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  // Classroom rooms are gated on the class's live_presence_enabled flag; plain
  // book rooms are always allowed for signed-in readers. null = still checking.
  const [presenceAllowed, setPresenceAllowed] = useState<boolean | null>(
    classroomId ? null : true,
  )

  useEffect(() => {
    if (!classroomId) {
      setPresenceAllowed(true)
      return
    }
    let cancelled = false
    const supabase = createClient()
    void supabase
      .from("classrooms")
      .select("live_presence_enabled")
      .eq("id", classroomId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setPresenceAllowed(data?.live_presence_enabled !== false)
      })
    return () => {
      cancelled = true
    }
  }, [classroomId])

  const enabled = !isLoading && isAuthenticated && presenceAllowed === true

  if (!enabled) {
    return (
      <PresenceMountedContext.Provider value={false}>
        {children}
      </PresenceMountedContext.Provider>
    )
  }

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={roomIdFor(bookId, classroomId)}
        initialPresence={{ cursor: null, selection: null, chapterIndex }}
      >
        <PresenceMountedContext.Provider value={true}>
          {children}
          <PresenceWriter chapterIndex={chapterIndex} surfaceRef={surfaceRef} />
          <PeerCursorLayer chapterIndex={chapterIndex} surfaceRef={surfaceRef} />
        </PresenceMountedContext.Provider>
      </RoomProvider>
    </LiveblocksProvider>
  )
}

/**
 * Broadcasts our own ephemeral presence: current chapter, pointer position
 * (as a fraction of the reader surface), and active text selection rects.
 * Writes nothing to storage — presence disappears when we disconnect.
 */
function PresenceWriter({
  chapterIndex,
  surfaceRef,
}: {
  chapterIndex: number
  surfaceRef: RefObject<HTMLDivElement | null>
}) {
  const updateMyPresence = useUpdateMyPresence()

  useEffect(() => {
    updateMyPresence({ chapterIndex })
  }, [chapterIndex, updateMyPresence])

  // Live pointer position over the reading surface (rAF-throttled).
  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    let raf = 0
    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const xPct = (e.clientX - rect.left) / rect.width
      const yPct = (e.clientY - rect.top) / rect.height
      if (raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        updateMyPresence({ cursor: { xPct, yPct, chapterIndex } })
      })
    }
    const onLeave = () => {
      if (raf) cancelAnimationFrame(raf)
      updateMyPresence({ cursor: null })
    }
    el.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)
    return () => {
      el.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [surfaceRef, updateMyPresence, chapterIndex])

  // Active text selection, mirrored as fractional rects of the reading surface.
  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    const onSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        updateMyPresence({ selection: null })
        return
      }
      const range = selection.getRangeAt(0)
      if (!el.contains(range.commonAncestorContainer)) {
        updateMyPresence({ selection: null })
        return
      }
      const rect = el.getBoundingClientRect()
      if (rect.width === 0 || rect.height === 0) return
      const rects = Array.from(range.getClientRects())
        .filter((r) => r.width > 0 && r.height > 0)
        .map((r) => ({
          xPct: (r.left - rect.left) / rect.width,
          yPct: (r.top - rect.top) / rect.height,
          wPct: r.width / rect.width,
          hPct: r.height / rect.height,
        }))
      updateMyPresence({
        selection: rects.length > 0 ? { chapterIndex, rects } : null,
      })
    }
    document.addEventListener("selectionchange", onSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", onSelectionChange)
    }
  }, [surfaceRef, updateMyPresence, chapterIndex])

  return null
}

/**
 * Paints other readers' live cursors and selections. Portaled to <body> and
 * positioned with fixed coordinates derived from the reader surface's viewport
 * rect, so it never distorts the reader layout or scrolls with the content.
 * Only peers on the same chapter are drawn (fractions are viewport-relative).
 */
function PeerCursorLayer({
  chapterIndex,
  surfaceRef,
}: {
  chapterIndex: number
  surfaceRef: RefObject<HTMLDivElement | null>
}) {
  const others = useOthers()
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    const el = surfaceRef.current
    if (!el) return
    const update = () => setRect(el.getBoundingClientRect())
    update()
    window.addEventListener("resize", update)
    // Capture phase catches scrolling inside the reader surface too.
    window.addEventListener("scroll", update, true)
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => {
      window.removeEventListener("resize", update)
      window.removeEventListener("scroll", update, true)
      ro.disconnect()
    }
  }, [surfaceRef])

  if (!rect || typeof document === "undefined") return null

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-30">
      {others.map((other) => {
        const color = peerColor(other.connectionId)
        const name = other.info?.name ?? "Reader"
        const selection = other.presence?.selection
        const cursor = other.presence?.cursor

        const selectionRects =
          selection && selection.chapterIndex === chapterIndex
            ? selection.rects
            : []

        const showCursor = cursor && cursor.chapterIndex === chapterIndex
        const cursorLeft = cursor ? rect.left + cursor.xPct * rect.width : 0
        const cursorTop = cursor ? rect.top + cursor.yPct * rect.height : 0
        const cursorInBounds =
          cursor &&
          cursor.xPct >= 0 &&
          cursor.xPct <= 1 &&
          cursor.yPct >= 0 &&
          cursor.yPct <= 1

        return (
          <div key={other.connectionId}>
            {selectionRects.map((r, i) => (
              <div
                key={i}
                className="fixed rounded-[2px]"
                style={{
                  left: rect.left + r.xPct * rect.width,
                  top: rect.top + r.yPct * rect.height,
                  width: r.wPct * rect.width,
                  height: r.hPct * rect.height,
                  backgroundColor: color,
                  opacity: 0.18,
                }}
              />
            ))}
            {showCursor && cursorInBounds && (
              <div
                className="fixed flex items-center gap-1"
                style={{ left: cursorLeft, top: cursorTop }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 14 14"
                  fill="none"
                  style={{ color }}
                  className="drop-shadow-sm"
                >
                  <path
                    d="M2 1.5L11 6.5L6.5 7.5L5 12L2 1.5Z"
                    fill="currentColor"
                    stroke="white"
                    strokeWidth="1"
                    strokeLinejoin="round"
                  />
                </svg>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[9px] font-medium text-white"
                  style={{ backgroundColor: color }}
                >
                  {name}
                </span>
              </div>
            )}
          </div>
        )
      })}
    </div>,
    document.body,
  )
}

/**
 * Avatar stack of everyone else in the room with an "N reading now" label.
 * Renders nothing outside a mounted presence room (signed-out / presence off).
 * Co-readers on the same chapter as us get a gold ring.
 */
export function ReaderPresenceAvatars({ chapterIndex }: { chapterIndex: number }) {
  const mounted = useContext(PresenceMountedContext)
  if (!mounted) return null
  return <AvatarStack chapterIndex={chapterIndex} />
}

function AvatarStack({ chapterIndex }: { chapterIndex: number }) {
  const others = useOthers()
  if (others.length === 0) return null

  const visible = others.slice(0, MAX_VISIBLE)
  const overflow = others.length - visible.length

  return (
    <div
      className="flex items-center gap-1.5"
      aria-label={`${others.length} ${others.length === 1 ? "reader" : "readers"} reading now`}
    >
      <div className="flex -space-x-2">
        {visible.map((other) => {
          const name = other.info?.name ?? "Reader"
          const avatar = other.info?.avatar
          const sameChapter = other.presence?.chapterIndex === chapterIndex
          return (
            <span
              key={other.connectionId}
              title={sameChapter ? `${name} · on this page` : name}
              className={cn(
                "relative inline-flex size-6 items-center justify-center overflow-hidden rounded-full border bg-muted text-[9px] font-semibold uppercase text-muted-foreground ring-1 ring-background",
                sameChapter ? "border-[#D4A04C] text-foreground" : "border-border",
              )}
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={name} className="size-full object-cover" />
              ) : (
                initialsOf(name)
              )}
            </span>
          )
        })}
        {overflow > 0 && (
          <span
            className="relative inline-flex size-6 items-center justify-center rounded-full border border-border bg-muted text-[9px] font-semibold text-muted-foreground ring-1 ring-background"
            title={`${overflow} more reading now`}
          >
            +{overflow}
          </span>
        )}
      </div>
      <span className="whitespace-nowrap text-[10px] text-muted-foreground">
        {others.length} reading now
      </span>
    </div>
  )
}
