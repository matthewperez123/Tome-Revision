/**
 * Supabase Realtime Presence helpers for live reading monitoring.
 */

import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface ReadingPresence {
  studentId: string
  studentName: string
  bookId: string
  bookTitle: string
  chapterTitle: string
  chapterIndex: number
  pageProgress: number // 0-100
  startedAt: string
  lastActivity: string
}

/**
 * Join a classroom reading presence channel and start broadcasting.
 */
export function joinReadingChannel(
  classroomId: string,
  initialPresence: ReadingPresence,
): RealtimeChannel {
  const supabase = createClient()
  const channel = supabase.channel(`classroom:${classroomId}:reading`, {
    config: { presence: { key: initialPresence.studentId } },
  })

  channel.subscribe(async (status) => {
    if (status === "SUBSCRIBED") {
      await channel.track(initialPresence)
    }
  })

  return channel
}

/**
 * Update the reading presence payload (e.g., on chapter change or scroll).
 */
export async function updateReadingPresence(
  channel: RealtimeChannel,
  presence: ReadingPresence,
) {
  await channel.track(presence)
}

/**
 * Leave the reading presence channel.
 */
export async function leaveReadingChannel(channel: RealtimeChannel) {
  await channel.untrack()
  const supabase = createClient()
  supabase.removeChannel(channel)
}

/**
 * Subscribe to a classroom's reading presence as a teacher.
 * Returns a channel and a callback to get current presences.
 */
export function subscribeToClassroomReading(
  classroomId: string,
  onSync: (readers: ReadingPresence[]) => void,
): RealtimeChannel {
  const supabase = createClient()
  const channel = supabase.channel(`classroom:${classroomId}:reading`)

  channel
    .on("presence", { event: "sync" }, () => {
      const state = channel.presenceState<ReadingPresence>()
      const readers: ReadingPresence[] = Object.values(state)
        .flat()
        .map((p) => p as unknown as ReadingPresence)
      onSync(readers)
    })
    .subscribe()

  return channel
}
