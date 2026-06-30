"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

/**
 * A notification as consumed by the bell. Flattened from the normalized
 * `public.notifications` row: the human-readable title/body/action_url live
 * in `payload`; `read` is derived from `read_at`.
 */
export interface AppNotification {
  id: string
  type: string
  title: string
  body: string | null
  actionUrl: string | null
  read: boolean
  createdAt: string
  actorId: string | null
  entityType: string | null
  entityId: string | null
  payload: Record<string, unknown>
}

interface NotificationRow {
  id: string
  type: string
  actor_id: string | null
  entity_type: string | null
  entity_id: string | null
  payload: Record<string, unknown> | null
  read_at: string | null
  created_at: string
}

function toAppNotification(row: NotificationRow): AppNotification {
  const payload = (row.payload ?? {}) as {
    title?: string
    body?: string | null
    action_url?: string | null
  }
  return {
    id: row.id,
    type: row.type,
    title: payload.title ?? "",
    body: payload.body ?? null,
    actionUrl: payload.action_url ?? null,
    read: row.read_at != null,
    createdAt: row.created_at,
    actorId: row.actor_id,
    entityType: row.entity_type,
    entityId: row.entity_id,
    payload: (row.payload ?? {}) as Record<string, unknown>,
  }
}

export function useRealtimeNotifications() {
  const { user, isDemoMode } = useAuth()
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch initial notifications. A signed-out / demo session has no inbox —
  // it shows a true empty state, never mock rows.
  useEffect(() => {
    if (isDemoMode || !user) {
      setNotifications([])
      setUnreadCount(0)
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchNotifications() {
      const supabase = createClient()
      const { data } = await supabase
        .from("notifications")
        .select(
          "id, type, actor_id, entity_type, entity_id, payload, read_at, created_at",
        )
        .eq("recipient_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(30)

      if (cancelled) return
      const rows = (data ?? []).map((r) =>
        toAppNotification(r as NotificationRow),
      )
      setNotifications(rows)
      setUnreadCount(rows.filter((n) => !n.read).length)
      setLoading(false)
    }

    fetchNotifications()
    return () => {
      cancelled = true
    }
  }, [user, isDemoMode])

  // Subscribe to realtime changes for a live unread badge. RLS guarantees the
  // user only ever receives rows where recipient_id = their own id.
  useEffect(() => {
    if (!user || isDemoMode) return

    const supabase = createClient()
    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const next = toAppNotification(payload.new as NotificationRow)
          setNotifications((prev) =>
            prev.some((n) => n.id === next.id)
              ? prev
              : [next, ...prev].slice(0, 50),
          )
          if (!next.read) setUnreadCount((prev) => prev + 1)
        },
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `recipient_id=eq.${user.id}`,
        },
        (payload) => {
          const next = toAppNotification(payload.new as NotificationRow)
          setNotifications((prev) => {
            const updated = prev.map((n) => (n.id === next.id ? next : n))
            setUnreadCount(updated.filter((n) => !n.read).length)
            return updated
          })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isDemoMode])

  const markAsRead = useCallback(
    async (id: string) => {
      setNotifications((prev) => {
        const updated = prev.map((n) =>
          n.id === id ? { ...n, read: true } : n,
        )
        setUnreadCount(updated.filter((n) => !n.read).length)
        return updated
      })
      if (!isDemoMode && user) {
        const supabase = createClient()
        await supabase
          .from("notifications")
          .update({ read_at: new Date().toISOString() })
          .eq("id", id)
          .is("read_at", null)
      }
    },
    [user, isDemoMode],
  )

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
    if (!isDemoMode && user) {
      const supabase = createClient()
      await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("recipient_id", user.id)
        .is("read_at", null)
    }
  }, [user, isDemoMode])

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead }
}
