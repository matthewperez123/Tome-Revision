"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import {
  subscribeToGuidedSession,
  subscribeToSessionStatus,
  type GuidedSessionSubscription,
} from "@/lib/supabase/guided-presence"
import type {
  GuidedSession,
  GuidedSessionEvent,
  GuidedPresence,
  ParticipantWithProfile,
} from "@/lib/guided-learning-types"
import type { RealtimeChannel } from "@supabase/supabase-js"

interface UseGuidedSessionOptions {
  /** Whether to subscribe to realtime updates (teacher dashboard) */
  realtime?: boolean
}

interface UseGuidedSessionReturn {
  session: GuidedSession | null
  participants: ParticipantWithProfile[]
  events: GuidedSessionEvent[]
  presences: Map<string, GuidedPresence>
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

/**
 * Hook to fetch and subscribe to a guided learning session.
 * Works for both teachers (full participant/event view) and students (own view).
 */
export function useGuidedSession(
  sessionId: string | null,
  options: UseGuidedSessionOptions = {},
): UseGuidedSessionReturn {
  const { realtime = false } = options
  const { user } = useAuth()

  const [session, setSession] = useState<GuidedSession | null>(null)
  const [participants, setParticipants] = useState<ParticipantWithProfile[]>([])
  const [events, setEvents] = useState<GuidedSessionEvent[]>([])
  const [presences, setPresences] = useState<Map<string, GuidedPresence>>(new Map())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const subscriptionRef = useRef<GuidedSessionSubscription | null>(null)
  const statusChannelRef = useRef<RealtimeChannel | null>(null)

  const fetchSession = useCallback(async () => {
    if (!sessionId) return
    try {
      const res = await fetch(`/api/guided-sessions/${sessionId}`)
      if (!res.ok) {
        const body = await res.json()
        throw new Error(body.error || "Failed to fetch session")
      }
      const data = await res.json()
      setSession(data.session)
      setParticipants(data.participants ?? [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error")
    } finally {
      setIsLoading(false)
    }
  }, [sessionId])

  // Initial fetch
  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  // Realtime subscriptions (teacher dashboard)
  useEffect(() => {
    if (!realtime || !sessionId || !user) return

    const sub = subscribeToGuidedSession(sessionId, {
      onPresenceSync: (list) => {
        const map = new Map<string, GuidedPresence>()
        list.forEach((p) => map.set(p.studentId, p))
        setPresences(map)
      },
      onNewEvent: (event) => {
        setEvents((prev) => [event, ...prev].slice(0, 200))
      },
      onParticipantUpdate: (updated) => {
        setParticipants((prev) =>
          prev.map((p) =>
            p.id === updated.id ? { ...p, ...updated } : p,
          ),
        )
      },
    })

    subscriptionRef.current = sub

    return () => {
      sub.cleanup()
      subscriptionRef.current = null
    }
  }, [realtime, sessionId, user])

  // Session status subscription (for students: detect start/pause/end)
  useEffect(() => {
    if (!sessionId || !user || realtime) return
    // Students subscribe to session status changes
    const supabase = createClient()
    const channel = subscribeToSessionStatus(sessionId, (status, endsAt) => {
      setSession((prev) => prev ? { ...prev, status: status as GuidedSession["status"], ends_at: endsAt } : prev)
    })
    statusChannelRef.current = channel

    return () => {
      supabase.removeChannel(channel)
      statusChannelRef.current = null
    }
  }, [sessionId, user, realtime])

  return {
    session,
    participants,
    events,
    presences,
    isLoading,
    error,
    refetch: fetchSession,
  }
}
