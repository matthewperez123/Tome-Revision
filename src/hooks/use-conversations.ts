"use client"

import { useCallback, useEffect, useId, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

export interface ConversationSummary {
  id: string
  subject: string | null
  classroomId: string | null
  lastMessageAt: string
  lastReadAt: string | null
  /** Other participants (never the current user). */
  participants: {
    id: string
    displayName: string
    avatarUrl: string | null
  }[]
  /** Preview of the most recent message body. */
  lastMessage: string | null
  /** True when there is a message newer than the caller's last_read_at. */
  unread: boolean
}

interface ParticipantRow {
  conversation_id: string
  last_read_at: string | null
}

/**
 * Inbox list of the caller's conversations, newest first, with per-thread
 * unread flags. Refetches on any message insert (realtime) so a new incoming
 * message lights up the list without a reload. Signed-out / demo → empty.
 */
export function useConversations() {
  const instanceId = useId()
  const { user, isDemoMode } = useAuth()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    if (isDemoMode || !user) {
      setConversations([])
      setLoading(false)
      return
    }
    const supabase = createClient()

    // Conversations I participate in + my last_read_at.
    const { data: myParts } = await supabase
      .from("conversation_participants")
      .select("conversation_id, last_read_at")
      .eq("profile_id", user.id)
    const myPartRows = (myParts ?? []) as ParticipantRow[]
    const convIds = myPartRows.map((p) => p.conversation_id)
    if (convIds.length === 0) {
      setConversations([])
      setLoading(false)
      return
    }
    const lastReadByConv = new Map(
      myPartRows.map((p) => [p.conversation_id, p.last_read_at]),
    )

    const [{ data: convs }, { data: allParts }] = await Promise.all([
      supabase
        .from("conversations")
        .select("id, subject, classroom_id, last_message_at")
        .in("id", convIds)
        .order("last_message_at", { ascending: false }),
      supabase
        .from("conversation_participants")
        .select("conversation_id, profile_id")
        .in("conversation_id", convIds),
    ])

    // Resolve other participants' safe profile fields.
    const otherIds = Array.from(
      new Set(
        (allParts ?? [])
          .map((p: { profile_id: string }) => p.profile_id)
          .filter((id: string) => id !== user.id),
      ),
    )
    const { data: profiles } = otherIds.length
      ? await supabase
          .from("profiles")
          .select("id, display_name, avatar_url")
          .in("id", otherIds)
      : { data: [] }
    const profileById = new Map(
      (profiles ?? []).map((p: {
        id: string
        display_name: string | null
        avatar_url: string | null
      }) => [p.id, p]),
    )

    // Latest message per conversation for the preview.
    const { data: latest } = await supabase
      .from("messages")
      .select("conversation_id, body, created_at")
      .in("conversation_id", convIds)
      .order("created_at", { ascending: false })
    const lastMsgByConv = new Map<string, { body: string; created_at: string }>()
    for (const m of (latest ?? []) as {
      conversation_id: string
      body: string
      created_at: string
    }[]) {
      if (!lastMsgByConv.has(m.conversation_id)) {
        lastMsgByConv.set(m.conversation_id, {
          body: m.body,
          created_at: m.created_at,
        })
      }
    }

    const partsByConv = new Map<string, string[]>()
    for (const p of (allParts ?? []) as {
      conversation_id: string
      profile_id: string
    }[]) {
      const arr = partsByConv.get(p.conversation_id) ?? []
      if (p.profile_id !== user.id) arr.push(p.profile_id)
      partsByConv.set(p.conversation_id, arr)
    }

    const summaries: ConversationSummary[] = (
      (convs ?? []) as {
        id: string
        subject: string | null
        classroom_id: string | null
        last_message_at: string
      }[]
    ).map((c) => {
      const lastRead = lastReadByConv.get(c.id) ?? null
      const last = lastMsgByConv.get(c.id) ?? null
      const unread =
        !!last &&
        (!lastRead || new Date(last.created_at) > new Date(lastRead))
      return {
        id: c.id,
        subject: c.subject,
        classroomId: c.classroom_id,
        lastMessageAt: c.last_message_at,
        lastReadAt: lastRead,
        participants: (partsByConv.get(c.id) ?? []).map((pid) => {
          const p = profileById.get(pid)
          return {
            id: pid,
            displayName: p?.display_name ?? "Unknown",
            avatarUrl: p?.avatar_url ?? null,
          }
        }),
        lastMessage: last?.body ?? null,
        unread,
      }
    })

    setConversations(summaries)
    setLoading(false)
  }, [user, isDemoMode])

  useEffect(() => {
    load()
  }, [load])

  // Realtime: any new message re-derives the inbox (cheap; small N).
  useEffect(() => {
    if (!user || isDemoMode) return
    const supabase = createClient()
    const channel = supabase
      .channel(`inbox:${user.id}:${instanceId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        () => {
          load()
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isDemoMode, instanceId, load])

  const unreadTotal = conversations.filter((c) => c.unread).length

  return { conversations, loading, unreadTotal, refresh: load }
}
