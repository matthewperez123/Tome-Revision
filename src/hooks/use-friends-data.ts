"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  addFriendByQuery,
  respondToFriendRequest,
  unfriend as unfriendAction,
  blockFriend,
} from "@/lib/actions/friendships"

// ── Shapes consumed by the Friends UI ───────────────────────────────────────

export interface FriendProfile {
  id: string
  displayName: string
  username: string
  avatarUrl: string
}

export interface FriendItem {
  friendshipId: string
  profile: FriendProfile
  since: string
}

export interface RequestItem {
  friendshipId: string
  profile: FriendProfile
  sentAt: Date
}

export interface AddFriendResult {
  ok: boolean
  error?: string
  name?: string
}

export interface FriendsDataAPI {
  /** "real" when signed in; "demo" (signed-out / demo) shows true empty state. */
  mode: "real" | "demo"
  loading: boolean
  myFriendCode: string | null
  friends: FriendItem[]
  incoming: RequestItem[]
  outgoing: RequestItem[]
  refresh: () => Promise<void>
  addByQuery: (query: string) => Promise<AddFriendResult>
  accept: (friendshipId: string) => Promise<void>
  decline: (friendshipId: string) => Promise<void>
  unfriend: (friendshipId: string) => Promise<void>
  block: (friendshipId: string) => Promise<void>
}

interface FriendshipRow {
  id: string
  requester_id: string
  addressee_id: string
  status: string
  created_at: string
}

interface ProfileRow {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

function toProfile(p: ProfileRow): FriendProfile {
  const seed = encodeURIComponent(p.username ?? p.id)
  const fallbackAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=2A4B8D&textColor=C8A24B&fontSize=40`
  return {
    id: p.id,
    displayName: p.display_name ?? p.username ?? "Reader",
    username: p.username ?? p.id.slice(0, 8),
    avatarUrl: p.avatar_url ?? fallbackAvatar,
  }
}

const EMPTY: {
  friends: FriendItem[]
  incoming: RequestItem[]
  outgoing: RequestItem[]
} = { friends: [], incoming: [], outgoing: [] }

export function useFriendsData(): FriendsDataAPI {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode

  const [friends, setFriends] = useState<FriendItem[]>([])
  const [incoming, setIncoming] = useState<RequestItem[]>([])
  const [outgoing, setOutgoing] = useState<RequestItem[]>([])
  const [myFriendCode, setMyFriendCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isReal || !user) {
      // Signed-out / demo: a true empty state, never seeded rows.
      setFriends(EMPTY.friends)
      setIncoming(EMPTY.incoming)
      setOutgoing(EMPTY.outgoing)
      setMyFriendCode(null)
      setLoading(false)
      return
    }

    const supabase = createClient()

    // All friendships I'm part of, plus my own friend code (to share).
    const [friendshipsRes, meRes] = await Promise.all([
      supabase
        .from("friendships")
        .select("id, requester_id, addressee_id, status, created_at")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`),
      supabase
        .from("profiles")
        .select("friend_code")
        .eq("id", user.id)
        .maybeSingle(),
    ])

    setMyFriendCode(
      (meRes.data as { friend_code: string } | null)?.friend_code ?? null,
    )

    const rows = (friendshipsRes.data ?? []) as FriendshipRow[]

    // Resolve the "other party" profile for every row in one batch query. The
    // friendships FK points at auth.users, so we can't embed profiles directly.
    const otherIds = Array.from(
      new Set(
        rows.map((r) =>
          r.requester_id === user.id ? r.addressee_id : r.requester_id,
        ),
      ),
    )

    const profileMap = new Map<string, FriendProfile>()
    if (otherIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", otherIds)
      for (const p of (profs ?? []) as ProfileRow[]) {
        profileMap.set(p.id, toProfile(p))
      }
    }

    const nextFriends: FriendItem[] = []
    const nextIncoming: RequestItem[] = []
    const nextOutgoing: RequestItem[] = []

    for (const r of rows) {
      const otherId = r.requester_id === user.id ? r.addressee_id : r.requester_id
      const profile = profileMap.get(otherId)
      if (!profile) continue

      if (r.status === "accepted") {
        nextFriends.push({ friendshipId: r.id, profile, since: r.created_at })
      } else if (r.status === "pending") {
        if (r.addressee_id === user.id) {
          nextIncoming.push({
            friendshipId: r.id,
            profile,
            sentAt: new Date(r.created_at),
          })
        } else {
          nextOutgoing.push({
            friendshipId: r.id,
            profile,
            sentAt: new Date(r.created_at),
          })
        }
      }
      // declined / blocked rows are intentionally hidden from all sections.
    }

    nextIncoming.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    nextOutgoing.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())

    setFriends(nextFriends)
    setIncoming(nextIncoming)
    setOutgoing(nextOutgoing)
    setLoading(false)
  }, [isReal, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live updates: any change to a friendship I'm part of re-fetches. RLS
  // guarantees the realtime stream only carries rows where I'm a party.
  useEffect(() => {
    if (!isReal || !user) return
    const supabase = createClient()
    const channel = supabase
      .channel(`friendships:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "friendships" },
        () => {
          refresh()
        },
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isReal, user, refresh])

  // ── Mutations ──────────────────────────────────────────────────────────

  const addByQuery = useCallback(
    async (query: string): Promise<AddFriendResult> => {
      const result = await addFriendByQuery(query)
      if (result.ok) {
        await refresh()
        return { ok: true, name: result.data.candidate.display_name ?? "Reader" }
      }
      return { ok: false, error: result.error }
    },
    [refresh],
  )

  const accept = useCallback(
    async (friendshipId: string) => {
      await respondToFriendRequest(friendshipId, true)
      await refresh()
    },
    [refresh],
  )

  const decline = useCallback(
    async (friendshipId: string) => {
      await respondToFriendRequest(friendshipId, false)
      await refresh()
    },
    [refresh],
  )

  const unfriend = useCallback(
    async (friendshipId: string) => {
      await unfriendAction(friendshipId)
      await refresh()
    },
    [refresh],
  )

  const block = useCallback(
    async (friendshipId: string) => {
      await blockFriend(friendshipId)
      await refresh()
    },
    [refresh],
  )

  return {
    mode: isReal ? "real" : "demo",
    loading,
    myFriendCode,
    friends,
    incoming,
    outgoing,
    refresh,
    addByQuery,
    accept,
    decline,
    unfriend,
    block,
  }
}
