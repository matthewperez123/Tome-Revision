"use client"

import { useEffect } from "react"
import {
  LiveblocksProvider,
  RoomProvider,
  useOthers,
  useUpdateMyPresence,
} from "@liveblocks/react"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

const MAX_VISIBLE = 4

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return "?"
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase()
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase()
}

/**
 * Live avatar stack for everyone else reading the same book. Writes our own
 * chapterIndex into presence; reads others' presence to ring-highlight the
 * co-readers who are on the same chapter as us right now.
 */
function PresenceAvatars({ chapterIndex }: { chapterIndex: number }) {
  const updateMyPresence = useUpdateMyPresence()
  const others = useOthers()

  useEffect(() => {
    updateMyPresence({ chapterIndex })
  }, [chapterIndex, updateMyPresence])

  if (others.length === 0) return null

  const visible = others.slice(0, MAX_VISIBLE)
  const overflow = others.length - visible.length

  return (
    <div
      className="flex items-center"
      aria-label={`${others.length} ${others.length === 1 ? "reader" : "readers"} here now`}
      title={`${others.length} reading now`}
    >
      <div className="flex -space-x-2">
        {visible.map((other) => {
          const name = other.info?.name ?? "Reader"
          const avatar = other.info?.avatar
          const sameChapter = other.presence?.chapterIndex === chapterIndex
          return (
            <span
              key={other.connectionId}
              title={
                sameChapter ? `${name} · on this page` : name
              }
              className={cn(
                "relative inline-flex size-6 items-center justify-center overflow-hidden rounded-full border bg-muted text-[9px] font-semibold uppercase text-muted-foreground ring-1 ring-background",
                sameChapter
                  ? "border-[#D4A04C] text-foreground"
                  : "border-border",
              )}
            >
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={name}
                  className="size-full object-cover"
                />
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
    </div>
  )
}

/**
 * Mounts live reader presence for the current book. Renders nothing unless
 * the visitor is signed in with a real Supabase session — demo/guest readers
 * have no auth.uid() for the secure Liveblocks endpoint to authorize, so they
 * stay invisible (and incur no Liveblocks connection).
 */
export function ReaderPresence({
  bookId,
  chapterIndex,
}: {
  bookId: string
  chapterIndex: number
}) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading || !isAuthenticated) return null

  return (
    <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
      <RoomProvider
        id={`reader:${bookId}`}
        initialPresence={{ chapterIndex }}
      >
        <PresenceAvatars chapterIndex={chapterIndex} />
      </RoomProvider>
    </LiveblocksProvider>
  )
}
