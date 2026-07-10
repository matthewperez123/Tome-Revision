"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"

export type ActivitySurface = "reading" | "quiz" | "essay"

export interface ActivityBeacon {
  /** The classroom whose Lectern should see this presence. Null = don't beacon. */
  classroomId: string | null | undefined
  surface: ActivitySurface
  bookId?: string | null
  /** 0-based, only meaningful for the reading surface. */
  chapterIndex?: number | null
  assignmentId?: string | null
  /** Short human label, e.g. "Ch. 3" or an essay title. */
  detail?: string | null
}

const HEARTBEAT_MS = 45_000
const THROTTLE_MS = 5_000

// The classroom id arrives from a client-controlled `?classroom=` URL param, so
// it can be a hand-typed or display-truncated value (e.g. "5b191168-…"). Writing
// that straight into the uuid `classroom_id` column throws Postgres 22P02
// ("invalid input syntax for type uuid"). Validate at this boundary and skip the
// beacon on anything that isn't a full canonical UUID.
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/**
 * Live-presence heartbeat for the reader / quiz / essay student surfaces. It
 * upserts a single `student_activity` cursor row (PK user_id) so the teacher's
 * Lectern can render who's working where, right now. Only fires for signed-in
 * students inside a classroom context — readers/teachers and demo mode are no-
 * ops. Beats on mount, on any prop change, and every 45s while the tab is
 * visible; a 5s throttle collapses rapid changes into one write. Idleness is
 * derived board-side from last_seen_at, so this never writes an "online" flag.
 */
export function useActivityBeacon(beacon: ActivityBeacon) {
  const { user, role, isDemoMode } = useAuth()
  const lastWriteRef = useRef(0)

  const { classroomId, surface, bookId, chapterIndex, assignmentId, detail } = beacon

  useEffect(() => {
    if (isDemoMode || !user || role !== "student" || !classroomId) return
    if (!UUID_RE.test(classroomId)) return

    const supabase = createClient()
    let cancelled = false

    const send = async (force = false) => {
      const now = Date.now()
      if (!force && now - lastWriteRef.current < THROTTLE_MS) return
      lastWriteRef.current = now
      await supabase.from("student_activity").upsert(
        {
          user_id: user.id,
          classroom_id: classroomId,
          surface,
          book_id: bookId ?? null,
          chapter_index: chapterIndex ?? null,
          assignment_id: assignmentId ?? null,
          detail: detail ?? null,
          last_seen_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      )
    }

    void send(true)

    const interval = setInterval(() => {
      if (!cancelled && document.visibilityState === "visible") void send()
    }, HEARTBEAT_MS)

    const onVisible = () => {
      if (document.visibilityState === "visible") void send()
    }
    document.addEventListener("visibilitychange", onVisible)

    return () => {
      cancelled = true
      clearInterval(interval)
      document.removeEventListener("visibilitychange", onVisible)
    }
  }, [
    isDemoMode,
    user,
    role,
    classroomId,
    surface,
    bookId,
    chapterIndex,
    assignmentId,
    detail,
  ])
}
