"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import {
  addReaction,
  removeReaction,
  reportContent,
  type ActivityType,
  type ReactionKind,
} from "@/lib/actions/activities"

export type FeedScope = "friends" | "public"

export interface ActivityActor {
  id: string
  displayName: string
  username: string
  avatarUrl: string
}

export interface ReactionSummary {
  kind: ReactionKind
  count: number
  /** Whether the current user has this reaction on the activity. */
  mine: boolean
}

export interface FeedItem {
  id: string
  type: ActivityType
  actor: ActivityActor
  entityType: string | null
  entityId: string | null
  /** Resolved book slug for book/trial entities (for the entity link). */
  bookId: string | null
  bookTitle: string | null
  createdAt: Date
  reactions: ReactionSummary[]
}

export interface CommunityFeedAPI {
  /** "real" when signed in; "demo" (signed-out / demo) → true empty state. */
  mode: "real" | "demo"
  loading: boolean
  scope: FeedScope
  setScope: (s: FeedScope) => void
  /** Student accounts have the public surface OFF — hide the Public toggle. */
  publicAvailable: boolean
  items: FeedItem[]
  refresh: () => Promise<void>
  react: (activityId: string, kind: ReactionKind) => Promise<void>
  unreact: (activityId: string, kind: ReactionKind) => Promise<void>
  report: (activityId: string, reason: string) => Promise<{ ok: boolean; error?: string }>
}

interface ActivityRow {
  id: string
  actor_id: string
  type: ActivityType
  entity_type: string | null
  entity_id: string | null
  visibility: string
  created_at: string
}

interface ProfileRow {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

interface ReactionRow {
  activity_id: string
  user_id: string
  kind: ReactionKind
}

function toActor(p: ProfileRow): ActivityActor {
  const seed = encodeURIComponent(p.username ?? p.id)
  const fallbackAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=2A4B8D&textColor=C8A24B&fontSize=40`
  return {
    id: p.id,
    displayName: p.display_name ?? p.username ?? "Reader",
    username: p.username ?? p.id.slice(0, 8),
    avatarUrl: p.avatar_url ?? fallbackAvatar,
  }
}

/** Derive the book slug an activity points at (book/trial entities). */
function bookIdFor(row: ActivityRow): string | null {
  if (!row.entity_id) return null
  if (row.entity_type === "book") return row.entity_id
  if (row.entity_type === "trial") return row.entity_id.split(":")[0] ?? null
  return null
}

export function useCommunityFeed(): CommunityFeedAPI {
  const { user, profile, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode
  const publicAvailable = (profile?.role as string | undefined) !== "student"

  const [scope, setScope] = useState<FeedScope>("friends")
  const [items, setItems] = useState<FeedItem[]>([])
  const [loading, setLoading] = useState(true)

  // Students can never reach the public surface — force them to Friends.
  useEffect(() => {
    if (!publicAvailable && scope === "public") setScope("friends")
  }, [publicAvailable, scope])

  const refresh = useCallback(async () => {
    if (!isReal || !user) {
      setItems([])
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = createClient()

    // Build the activity query. RLS already gates visibility; we further scope
    // the Friends tab to my own + my friends' activities (vs. the global public
    // tab). Fetch my accepted-friend ids for the friends scope.
    let rows: ActivityRow[] = []
    if (scope === "public") {
      const { data } = await supabase
        .from("activities")
        .select("id, actor_id, type, entity_type, entity_id, visibility, created_at")
        .eq("visibility", "public")
        .order("created_at", { ascending: false })
        .limit(50)
      rows = (data ?? []) as ActivityRow[]
    } else {
      const { data: friendRows } = await supabase
        .from("friendships")
        .select("requester_id, addressee_id, status")
        .eq("status", "accepted")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
      const friendIds = (friendRows ?? []).map(
        (f: { requester_id: string; addressee_id: string }) =>
          f.requester_id === user.id ? f.addressee_id : f.requester_id,
      )
      const actorIds = Array.from(new Set([user.id, ...friendIds]))
      const { data } = await supabase
        .from("activities")
        .select("id, actor_id, type, entity_type, entity_id, visibility, created_at")
        .in("actor_id", actorIds)
        .order("created_at", { ascending: false })
        .limit(50)
      rows = (data ?? []) as ActivityRow[]
    }

    if (rows.length === 0) {
      setItems([])
      setLoading(false)
      return
    }

    // Resolve actor profiles (FK → auth.users, so no embed) + reactions, batched.
    const actorIds = Array.from(new Set(rows.map((r) => r.actor_id)))
    const activityIds = rows.map((r) => r.id)
    const [profilesRes, reactionsRes] = await Promise.all([
      supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", actorIds),
      supabase
        .from("activity_reactions")
        .select("activity_id, user_id, kind")
        .in("activity_id", activityIds),
    ])

    const profileMap = new Map<string, ActivityActor>()
    for (const p of (profilesRes.data ?? []) as ProfileRow[]) {
      profileMap.set(p.id, toActor(p))
    }

    // Aggregate reactions per activity → { kind: { count, mine } }.
    const reactionMap = new Map<string, Map<ReactionKind, { count: number; mine: boolean }>>()
    for (const r of (reactionsRes.data ?? []) as ReactionRow[]) {
      let perActivity = reactionMap.get(r.activity_id)
      if (!perActivity) {
        perActivity = new Map()
        reactionMap.set(r.activity_id, perActivity)
      }
      const cur = perActivity.get(r.kind) ?? { count: 0, mine: false }
      cur.count += 1
      if (r.user_id === user.id) cur.mine = true
      perActivity.set(r.kind, cur)
    }

    const next: FeedItem[] = []
    for (const row of rows) {
      const actor = profileMap.get(row.actor_id)
      if (!actor) continue
      const bookId = bookIdFor(row)
      const bookTitle = bookId ? getBook(bookId)?.title ?? null : null
      const perActivity = reactionMap.get(row.id)
      const reactions: ReactionSummary[] = perActivity
        ? Array.from(perActivity.entries()).map(([kind, v]) => ({
            kind,
            count: v.count,
            mine: v.mine,
          }))
        : []
      next.push({
        id: row.id,
        type: row.type,
        actor,
        entityType: row.entity_type,
        entityId: row.entity_id,
        bookId,
        bookTitle,
        createdAt: new Date(row.created_at),
        reactions,
      })
    }

    setItems(next)
    setLoading(false)
  }, [isReal, user, scope])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live updates: any change to activities or reactions re-fetches. RLS gates
  // which rows reach this client.
  useEffect(() => {
    if (!isReal || !user) return
    const supabase = createClient()
    const channel = supabase
      .channel(`community:${user.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "activities" }, () => refresh())
      .on("postgres_changes", { event: "*", schema: "public", table: "activity_reactions" }, () => refresh())
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isReal, user, refresh])

  const react = useCallback(
    async (activityId: string, kind: ReactionKind) => {
      await addReaction({ activityId, kind })
      await refresh()
    },
    [refresh],
  )

  const unreact = useCallback(
    async (activityId: string, kind: ReactionKind) => {
      await removeReaction({ activityId, kind })
      await refresh()
    },
    [refresh],
  )

  const report = useCallback(
    async (activityId: string, reason: string) => {
      const result = await reportContent({
        contentType: "activity",
        contentId: activityId,
        reason,
      })
      return result.ok ? { ok: true } : { ok: false, error: result.error }
    },
    [],
  )

  return useMemo(
    () => ({
      mode: isReal ? "real" : "demo",
      loading,
      scope,
      setScope,
      publicAvailable,
      items,
      refresh,
      react,
      unreact,
      report,
    }),
    [isReal, loading, scope, publicAvailable, items, refresh, react, unreact, report],
  )
}
