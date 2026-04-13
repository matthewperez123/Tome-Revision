/**
 * Supabase Realtime helpers for Guided Learning Mode.
 *
 * Follows the pattern from src/lib/supabase/presence.ts:
 * - Presence channels for live focus status (student → teacher)
 * - Postgres Changes on guided_session_events for durable event logging
 */

import { createClient } from "@/lib/supabase/client"
import type { RealtimeChannel } from "@supabase/supabase-js"
import type {
  GuidedPresence,
  GuidedSessionEvent,
  GuidedSessionParticipant,
} from "@/lib/guided-learning-types"

// ── Student-Side: Presence Broadcasting ─────────────────────────────────────

/**
 * Join a guided session's presence channel and start broadcasting focus state.
 */
export function joinGuidedChannel(
  sessionId: string,
  initialPresence: GuidedPresence,
): RealtimeChannel {
  const supabase = createClient()
  const channel = supabase.channel(`guided:${sessionId}:presence`, {
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
 * Update the student's presence payload (focus state, progress, etc.).
 */
export async function updateGuidedPresence(
  channel: RealtimeChannel,
  presence: GuidedPresence,
) {
  await channel.track(presence)
}

/**
 * Leave the guided session presence channel.
 */
export async function leaveGuidedChannel(channel: RealtimeChannel) {
  await channel.untrack()
  const supabase = createClient()
  supabase.removeChannel(channel)
}

// ── Teacher-Side: Monitoring Subscriptions ──────────────────────────────────

export interface GuidedSessionSubscription {
  presenceChannel: RealtimeChannel
  eventsChannel: RealtimeChannel
  participantsChannel: RealtimeChannel
  cleanup: () => void
}

/**
 * Subscribe to a guided session for teacher monitoring.
 *
 * Sets up three subscriptions:
 * 1. Presence channel — live focus states of all students
 * 2. Postgres Changes on guided_session_events — new event inserts
 * 3. Postgres Changes on guided_session_participants — status/progress updates
 */
export function subscribeToGuidedSession(
  sessionId: string,
  callbacks: {
    onPresenceSync: (presences: GuidedPresence[]) => void
    onNewEvent: (event: GuidedSessionEvent) => void
    onParticipantUpdate: (participant: Partial<GuidedSessionParticipant>) => void
  },
): GuidedSessionSubscription {
  const supabase = createClient()

  // 1. Presence: live focus states
  const presenceChannel = supabase.channel(`guided:${sessionId}:presence`)
  presenceChannel
    .on("presence", { event: "sync" }, () => {
      const state = presenceChannel.presenceState<GuidedPresence>()
      const presences: GuidedPresence[] = Object.values(state)
        .flat()
        .map((p) => p as unknown as GuidedPresence)
      callbacks.onPresenceSync(presences)
    })
    .subscribe()

  // 2. Events: durable event inserts
  const eventsChannel = supabase
    .channel(`guided:${sessionId}:events`)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "guided_session_events",
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        callbacks.onNewEvent(payload.new as GuidedSessionEvent)
      },
    )
    .subscribe()

  // 3. Participants: status and progress changes
  const participantsChannel = supabase
    .channel(`guided:${sessionId}:participants`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "guided_session_participants",
        filter: `session_id=eq.${sessionId}`,
      },
      (payload) => {
        callbacks.onParticipantUpdate(
          payload.new as Partial<GuidedSessionParticipant>,
        )
      },
    )
    .subscribe()

  const cleanup = () => {
    supabase.removeChannel(presenceChannel)
    supabase.removeChannel(eventsChannel)
    supabase.removeChannel(participantsChannel)
  }

  return { presenceChannel, eventsChannel, participantsChannel, cleanup }
}

// ── Student-Side: Session Status Subscription ───────────────────────────────

/**
 * Subscribe to session status changes (for student: detect start, pause, end).
 */
export function subscribeToSessionStatus(
  sessionId: string,
  onStatusChange: (status: string, endsAt: string | null) => void,
): RealtimeChannel {
  const supabase = createClient()
  const channel = supabase
    .channel(`guided:${sessionId}:status`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "guided_sessions",
        filter: `id=eq.${sessionId}`,
      },
      (payload) => {
        const updated = payload.new as { status: string; ends_at: string | null }
        onStatusChange(updated.status, updated.ends_at)
      },
    )
    .subscribe()

  return channel
}
