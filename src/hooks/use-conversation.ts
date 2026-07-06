"use client"

import { useCallback, useEffect, useId, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { markConversationRead, sendMessage } from "@/lib/actions/messages"

export interface ThreadMessage {
  id: string
  senderId: string
  body: string
  createdAt: string
  senderName: string
  senderAvatar: string | null
  mine: boolean
}

interface MessageRow {
  id: string
  sender_id: string
  body: string
  created_at: string
}

/**
 * A single conversation thread: messages oldest→newest, live-appended on
 * insert, plus a send helper. Marks the thread read on open and whenever a new
 * message arrives while it is focused.
 */
export function useConversation(conversationId: string | null) {
  const instanceId = useId()
  const { user, isDemoMode } = useAuth()
  const [messages, setMessages] = useState<ThreadMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const nameCache = useRef(new Map<string, { name: string; avatar: string | null }>())

  const resolveSenders = useCallback(
    async (ids: string[]) => {
      const missing = ids.filter((id) => !nameCache.current.has(id))
      if (missing.length === 0) return
      const supabase = createClient()
      const { data } = await supabase
        .from("profiles")
        .select("id, display_name, avatar_url")
        .in("id", missing)
      for (const p of (data ?? []) as {
        id: string
        display_name: string | null
        avatar_url: string | null
      }[]) {
        nameCache.current.set(p.id, {
          name: p.display_name ?? "Unknown",
          avatar: p.avatar_url,
        })
      }
    },
    [],
  )

  const toThreadMessage = useCallback(
    (row: MessageRow): ThreadMessage => {
      const meta = nameCache.current.get(row.sender_id)
      return {
        id: row.id,
        senderId: row.sender_id,
        body: row.body,
        createdAt: row.created_at,
        senderName: meta?.name ?? "…",
        senderAvatar: meta?.avatar ?? null,
        mine: row.sender_id === user?.id,
      }
    },
    [user?.id],
  )

  const load = useCallback(async () => {
    if (isDemoMode || !user || !conversationId) {
      setMessages([])
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from("messages")
      .select("id, sender_id, body, created_at")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
    const rows = (data ?? []) as MessageRow[]
    await resolveSenders(Array.from(new Set(rows.map((r) => r.sender_id))))
    setMessages(rows.map(toThreadMessage))
    setLoading(false)
    void markConversationRead(conversationId)
  }, [conversationId, user, isDemoMode, resolveSenders, toThreadMessage])

  useEffect(() => {
    load()
  }, [load])

  // Realtime append for this conversation only.
  useEffect(() => {
    if (!user || isDemoMode || !conversationId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`thread:${conversationId}:${instanceId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const row = payload.new as MessageRow
          await resolveSenders([row.sender_id])
          setMessages((prev) =>
            prev.some((m) => m.id === row.id)
              ? prev
              : [...prev, toThreadMessage(row)],
          )
          void markConversationRead(conversationId)
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, user, isDemoMode, instanceId, resolveSenders, toThreadMessage])

  const send = useCallback(
    async (body: string): Promise<boolean> => {
      const trimmed = body.trim()
      if (!trimmed || !conversationId) return false
      setSending(true)
      const res = await sendMessage({ conversationId, body: trimmed })
      setSending(false)
      return res.ok
    },
    [conversationId],
  )

  return { messages, loading, sending, send, refresh: load }
}
