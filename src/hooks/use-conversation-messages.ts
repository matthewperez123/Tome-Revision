"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import {
  getMessages,
  sendMessage,
  markConversationRead,
  type ChatMessage,
} from "@/lib/actions/messages"

/**
 * Loads a conversation's history, then subscribes to realtime INSERTs on
 * `messages` filtered to this conversation. RLS still applies on the
 * publication, so only participants receive rows. New messages are
 * de-duplicated against optimistic/echoed inserts by id.
 */
export function useConversationMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const seenIds = useRef<Set<string>>(new Set())

  const upsert = useCallback((m: ChatMessage) => {
    if (seenIds.current.has(m.id)) return
    seenIds.current.add(m.id)
    setMessages((prev) =>
      [...prev, m].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    )
  }, [])

  // Initial load + mark read.
  useEffect(() => {
    if (!conversationId) {
      setMessages([])
      seenIds.current = new Set()
      return
    }
    let active = true
    setLoading(true)
    seenIds.current = new Set()
    getMessages(conversationId).then((res) => {
      if (!active) return
      if (res.ok) {
        seenIds.current = new Set(res.data.map((m) => m.id))
        setMessages(res.data)
      }
      setLoading(false)
    })
    markConversationRead(conversationId)
    return () => {
      active = false
    }
  }, [conversationId])

  // Realtime subscription.
  useEffect(() => {
    if (!conversationId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as {
            id: string
            conversation_id: string
            sender_id: string
            body: string
            created_at: string
          }
          upsert({
            id: row.id,
            conversationId: row.conversation_id,
            senderId: row.sender_id,
            body: row.body,
            createdAt: row.created_at,
          })
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, upsert])

  const send = useCallback(
    async (body: string): Promise<boolean> => {
      if (!conversationId || !body.trim()) return false
      setSending(true)
      const res = await sendMessage({ conversationId, body })
      setSending(false)
      if (res.ok) {
        // Echo immediately; realtime INSERT for our own row is de-duped by id.
        upsert(res.data)
        return true
      }
      return false
    },
    [conversationId, upsert],
  )

  return { messages, loading, sending, send }
}
