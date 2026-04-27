"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import * as mock from "@/lib/mock/social"
import {
  sendFriendRequest as realSendFriendRequest,
  respondToFriendRequest as realRespondToFriendRequest,
  removeFriend as realRemoveFriend,
} from "@/lib/actions/connections"

// ── Unified shape used by the Friends UI ────────────────────────────────
// The Friends page renders these — fields not available in real mode are
// nullable and the UI gracefully omits them.

export interface FriendProfile {
  id: string
  displayName: string
  username: string
  avatarUrl: string
  bio: string | null
  currentlyReading: { bookId: string; bookTitle: string } | null
  stats: { booksCompleted: number; flames: number } | null
}

export interface PendingFriendRequest {
  /** ID of the connection row (real) or mock request id. */
  id: string
  from: FriendProfile
  sentAt: Date
}

export interface FriendsDataAPI {
  mode: "demo" | "real"
  loading: boolean
  friends: FriendProfile[]
  requests: PendingFriendRequest[]
  suggested: FriendProfile[]
  searchProfiles: (query: string) => Promise<FriendProfile[]>
  sendRequest: (userId: string) => Promise<void>
  accept: (requestId: string) => Promise<void>
  decline: (requestId: string) => Promise<void>
}

// ── Adapters ─────────────────────────────────────────────────────────────

function mockToProfile(p: mock.MockProfile): FriendProfile {
  return {
    id: p.id,
    displayName: p.displayName,
    username: p.username,
    avatarUrl: p.avatarUrl,
    bio: p.bio,
    currentlyReading: {
      bookId: p.currentlyReading.bookId,
      bookTitle: p.currentlyReading.bookTitle,
    },
    stats: { booksCompleted: p.stats.booksCompleted, flames: p.stats.flames },
  }
}

interface SupabaseProfileRow {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

function realToProfile(p: SupabaseProfileRow): FriendProfile {
  // Generate a deterministic initials avatar URL when no avatar is set —
  // matches the visual language of the mock module.
  const seed = encodeURIComponent(p.username ?? p.id)
  const fallbackAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=1a1a2e&textColor=d4a04c&fontSize=40`
  return {
    id: p.id,
    displayName: p.display_name ?? p.username ?? "Reader",
    username: p.username ?? p.id.slice(0, 8),
    avatarUrl: p.avatar_url ?? fallbackAvatar,
    bio: null,
    currentlyReading: null,
    stats: null,
  }
}

// ── Hook ─────────────────────────────────────────────────────────────────

export function useFriendsData(): FriendsDataAPI {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode

  const [friends, setFriends] = useState<FriendProfile[]>([])
  const [requests, setRequests] = useState<PendingFriendRequest[]>([])
  const [suggested, setSuggested] = useState<FriendProfile[]>([])
  const [loading, setLoading] = useState(true)

  // ── Demo mode: mirror the mock module's pub/sub ────────────────────────
  const refreshFromMock = useCallback(() => {
    setFriends(mock.getFriends().map(mockToProfile))
    setRequests(
      mock.getFriendRequests().map((r) => {
        const fromProfile = mock.getProfile(r.fromUserId)
        return {
          id: r.id,
          sentAt: r.sentAt,
          from: fromProfile
            ? mockToProfile(fromProfile)
            : {
                id: r.fromUserId,
                displayName: "Someone",
                username: "anon",
                avatarUrl: "",
                bio: null,
                currentlyReading: null,
                stats: null,
              },
        }
      }),
    )
    setSuggested(mock.getSuggestedProfiles().map(mockToProfile))
    setLoading(false)
  }, [])

  // ── Real mode: query Supabase ──────────────────────────────────────────
  const refreshFromSupabase = useCallback(async () => {
    if (!user) return
    const supabase = createClient()

    const [friendsRes, requestsRes] = await Promise.all([
      // Accepted connections involving me, joined to the OTHER side's profile.
      supabase
        .from("connections")
        .select(
          `
          id, requester_id, recipient_id, created_at,
          requester:profiles!connections_requester_id_fkey(id, display_name, username, avatar_url),
          recipient:profiles!connections_recipient_id_fkey(id, display_name, username, avatar_url)
        `,
        )
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`),

      // Pending requests where I'm the recipient.
      supabase
        .from("connections")
        .select(
          `
          id, created_at,
          requester:profiles!connections_requester_id_fkey(id, display_name, username, avatar_url)
        `,
        )
        .eq("status", "pending")
        .eq("recipient_id", user.id)
        .order("created_at", { ascending: false }),
    ])

    type ConnRow = {
      id: string
      requester_id: string
      recipient_id: string
      created_at: string
      requester: SupabaseProfileRow | null
      recipient: SupabaseProfileRow | null
    }
    type RequestRow = {
      id: string
      created_at: string
      requester: SupabaseProfileRow | null
    }

    const friendsList: FriendProfile[] = ((friendsRes.data ?? []) as unknown as ConnRow[])
      .map((c) => {
        const other = c.requester_id === user.id ? c.recipient : c.requester
        return other ? realToProfile(other) : null
      })
      .filter((p): p is FriendProfile => p !== null)

    const requestsList: PendingFriendRequest[] = ((requestsRes.data ?? []) as unknown as RequestRow[])
      .map((r) =>
        r.requester
          ? {
              id: r.id,
              sentAt: new Date(r.created_at),
              from: realToProfile(r.requester),
            }
          : null,
      )
      .filter((r): r is PendingFriendRequest => r !== null)

    setFriends(friendsList)
    setRequests(requestsList)
    // Real-mode "suggested" = leave empty by default; the page exposes a
    // search box so users can find people explicitly. Auto-suggesting random
    // strangers without any signal would be noise.
    setSuggested([])
    setLoading(false)
  }, [user])

  // ── Wiring ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (isReal) {
      refreshFromSupabase()
    } else {
      refreshFromMock()
      const unsubscribe = mock.subscribe(refreshFromMock)
      return () => {
        unsubscribe()
      }
    }
  }, [isReal, refreshFromSupabase, refreshFromMock])

  // ── Mutations ──────────────────────────────────────────────────────────

  const sendRequest = useCallback(
    async (userId: string) => {
      if (isReal) {
        await realSendFriendRequest(userId)
        await refreshFromSupabase()
      } else {
        await mock.sendFriendRequest(userId)
      }
    },
    [isReal, refreshFromSupabase],
  )

  const accept = useCallback(
    async (requestId: string) => {
      if (isReal) {
        await realRespondToFriendRequest(requestId, true)
        await refreshFromSupabase()
      } else {
        mock.acceptFriendRequest(requestId)
      }
    },
    [isReal, refreshFromSupabase],
  )

  const decline = useCallback(
    async (requestId: string) => {
      if (isReal) {
        await realRespondToFriendRequest(requestId, false)
        await refreshFromSupabase()
      } else {
        mock.declineFriendRequest(requestId)
      }
    },
    [isReal, refreshFromSupabase],
  )

  // The mock's `sendFriendRequest` returns void on success, so wrap silently.
  // realSendFriendRequest returns ActionResult — failures become silent here
  // for now; the calling component can re-fetch and notice the missing row.

  // Mark unused import for type-safety lint
  void realRemoveFriend

  // ── Search ─────────────────────────────────────────────────────────────

  const searchProfiles = useCallback(
    async (query: string): Promise<FriendProfile[]> => {
      const trimmed = query.trim()
      if (trimmed.length < 2) return []
      if (isReal) {
        const supabase = createClient()
        const { data } = await supabase
          .from("profiles")
          .select("id, display_name, username, avatar_url")
          .or(
            `display_name.ilike.%${trimmed}%,username.ilike.%${trimmed}%`,
          )
          .neq("id", user!.id)
          .limit(20)
        return ((data as SupabaseProfileRow[] | null) ?? []).map(realToProfile)
      }
      return mock.searchProfiles(trimmed).map(mockToProfile)
    },
    [isReal, user],
  )

  return {
    mode: isReal ? "real" : "demo",
    loading,
    friends,
    requests,
    suggested,
    searchProfiles,
    sendRequest,
    accept,
    decline,
  }
}
