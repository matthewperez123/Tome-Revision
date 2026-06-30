"use client"

import { useCallback, useEffect, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  linkByCode,
  confirmParentLink,
  cancelParentLink,
  revokeParentLink,
  type LinkRole,
} from "@/lib/actions/parent-links"

// ── Shapes consumed by the Family UI ───────────────────────────────────────

export interface FamilyProfile {
  id: string
  displayName: string
  username: string
  avatarUrl: string
}

export interface ChildOverview {
  studentId: string
  currentStreak: number
  totalWisdom: number
  booksStarted: number
  chaptersRead: number
  trialsPassed: number
  avgScore: number
  achievementsCount: number
  lastActiveAt: string | null
  activeDays30: number
}

export interface ChildLink {
  linkId: string
  profile: FamilyProfile
  since: string
  overview: ChildOverview | null
}

export interface GuardianLink {
  linkId: string
  profile: FamilyProfile
  since: string
}

export interface LinkRequest {
  linkId: string
  profile: FamilyProfile
  /** True when the current user is the parent in this row (the other is their child). */
  iAmParent: boolean
  sentAt: Date
}

export interface ChildActivityItem {
  occurredAt: string | null
  kind: string
  bookId: string | null
  detail: string
}

export interface ChildAchievementItem {
  name: string
  description: string | null
  icon: string | null
  rarity: string | null
  earnedAt: string | null
}

export interface LinkActionResult {
  ok: boolean
  error?: string
  name?: string
}

export interface FamilyDataAPI {
  /** "real" when signed in; "demo" (signed-out / demo) shows true empty state. */
  mode: "real" | "demo"
  loading: boolean
  myLinkCode: string | null
  children: ChildLink[]
  guardians: GuardianLink[]
  incoming: LinkRequest[]
  outgoing: LinkRequest[]
  refresh: () => Promise<void>
  link: (code: string, iAm: LinkRole) => Promise<LinkActionResult>
  confirm: (linkId: string) => Promise<void>
  cancel: (linkId: string) => Promise<void>
  revoke: (linkId: string) => Promise<void>
  loadChildDetail: (studentId: string) => Promise<{
    activity: ChildActivityItem[]
    achievements: ChildAchievementItem[]
  }>
}

interface ParentLinkRow {
  id: string
  parent_id: string
  student_id: string
  status: string
  initiated_by: string
  created_at: string
  consented_at: string | null
}

interface ProfileRow {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

function toProfile(p: ProfileRow): FamilyProfile {
  const seed = encodeURIComponent(p.username ?? p.id)
  const fallbackAvatar = `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=2A4B8D&textColor=C8A24B&fontSize=40`
  return {
    id: p.id,
    displayName: p.display_name ?? p.username ?? "Reader",
    username: p.username ?? p.id.slice(0, 8),
    avatarUrl: p.avatar_url ?? fallbackAvatar,
  }
}

export function useFamilyData(): FamilyDataAPI {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode

  const [children, setChildren] = useState<ChildLink[]>([])
  const [guardians, setGuardians] = useState<GuardianLink[]>([])
  const [incoming, setIncoming] = useState<LinkRequest[]>([])
  const [outgoing, setOutgoing] = useState<LinkRequest[]>([])
  const [myLinkCode, setMyLinkCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isReal || !user) {
      // Signed-out / demo: a true empty state, never seeded rows.
      setChildren([])
      setGuardians([])
      setIncoming([])
      setOutgoing([])
      setMyLinkCode(null)
      setLoading(false)
      return
    }

    const supabase = createClient()

    // Every link I'm a party to, plus my own link code (= friend_code) to share.
    const [linksRes, meRes] = await Promise.all([
      supabase
        .from("parent_links")
        .select(
          "id, parent_id, student_id, status, initiated_by, created_at, consented_at",
        )
        .or(`parent_id.eq.${user.id},student_id.eq.${user.id}`),
      supabase
        .from("profiles")
        .select("friend_code")
        .eq("id", user.id)
        .maybeSingle(),
    ])

    setMyLinkCode(
      (meRes.data as { friend_code: string } | null)?.friend_code ?? null,
    )

    const rows = (linksRes.data ?? []) as ParentLinkRow[]

    // Resolve the "other party" profile per row in one batch (FK → auth.users
    // blocks PostgREST embedding).
    const otherIds = Array.from(
      new Set(
        rows.map((r) => (r.parent_id === user.id ? r.student_id : r.parent_id)),
      ),
    )

    const profileMap = new Map<string, FamilyProfile>()
    if (otherIds.length > 0) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", otherIds)
      for (const p of (profs ?? []) as ProfileRow[]) {
        profileMap.set(p.id, toProfile(p))
      }
    }

    const nextChildren: ChildLink[] = []
    const nextGuardians: GuardianLink[] = []
    const nextIncoming: LinkRequest[] = []
    const nextOutgoing: LinkRequest[] = []

    for (const r of rows) {
      const iAmParent = r.parent_id === user.id
      const otherId = iAmParent ? r.student_id : r.parent_id
      const profile = profileMap.get(otherId)
      if (!profile) continue

      if (r.status === "active") {
        if (iAmParent) {
          nextChildren.push({
            linkId: r.id,
            profile,
            since: r.consented_at ?? r.created_at,
            overview: null,
          })
        } else {
          nextGuardians.push({
            linkId: r.id,
            profile,
            since: r.consented_at ?? r.created_at,
          })
        }
      } else if (r.status === "pending") {
        const item: LinkRequest = {
          linkId: r.id,
          profile,
          iAmParent,
          sentAt: new Date(r.created_at),
        }
        if (r.initiated_by === user.id) nextOutgoing.push(item)
        else nextIncoming.push(item)
      }
      // revoked rows are intentionally hidden.
    }

    // Pull a live progress overview for each linked child via the gated RPC.
    await Promise.all(
      nextChildren.map(async (child) => {
        const { data } = await supabase.rpc("parent_child_overview", {
          p_student: child.profile.id,
        })
        const row = (data as RawOverview[] | null)?.[0]
        if (row) child.overview = mapOverview(row)
      }),
    )

    nextIncoming.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())
    nextOutgoing.sort((a, b) => b.sentAt.getTime() - a.sentAt.getTime())

    setChildren(nextChildren)
    setGuardians(nextGuardians)
    setIncoming(nextIncoming)
    setOutgoing(nextOutgoing)
    setLoading(false)
  }, [isReal, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live updates: any change to a link I'm part of re-fetches. RLS guarantees
  // the realtime stream only carries rows where I'm a party.
  useEffect(() => {
    if (!isReal || !user) return
    const supabase = createClient()
    const channel = supabase
      .channel(`parent_links:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "parent_links" },
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

  const link = useCallback(
    async (code: string, iAm: LinkRole): Promise<LinkActionResult> => {
      const result = await linkByCode(code, iAm)
      if (result.ok) {
        await refresh()
        return { ok: true, name: result.data.candidate.display_name ?? "Reader" }
      }
      return { ok: false, error: result.error }
    },
    [refresh],
  )

  const confirm = useCallback(
    async (linkId: string) => {
      await confirmParentLink(linkId)
      await refresh()
    },
    [refresh],
  )

  const cancel = useCallback(
    async (linkId: string) => {
      await cancelParentLink(linkId)
      await refresh()
    },
    [refresh],
  )

  const revoke = useCallback(
    async (linkId: string) => {
      await revokeParentLink(linkId)
      await refresh()
    },
    [refresh],
  )

  const loadChildDetail = useCallback(async (studentId: string) => {
    const supabase = createClient()
    const [activityRes, achievementsRes] = await Promise.all([
      supabase.rpc("parent_child_activity", { p_student: studentId }),
      supabase.rpc("parent_child_achievements", { p_student: studentId }),
    ])
    const activity = ((activityRes.data as RawActivity[] | null) ?? []).map(
      (a) => ({
        occurredAt: a.occurred_at,
        kind: a.kind,
        bookId: a.book_id,
        detail: a.detail,
      }),
    )
    const achievements = (
      (achievementsRes.data as RawAchievement[] | null) ?? []
    ).map((a) => ({
      name: a.name,
      description: a.description,
      icon: a.icon,
      rarity: a.rarity,
      earnedAt: a.earned_at,
    }))
    return { activity, achievements }
  }, [])

  return {
    mode: isReal ? "real" : "demo",
    loading,
    myLinkCode,
    children,
    guardians,
    incoming,
    outgoing,
    refresh,
    link,
    confirm,
    cancel,
    revoke,
    loadChildDetail,
  }
}

// ── RPC row shapes (snake_case from Postgres) ──────────────────────────────

interface RawOverview {
  student_id: string
  current_streak: number
  total_wisdom: number
  books_started: number
  chapters_read: number
  trials_passed: number
  avg_score: number
  achievements_count: number
  last_active_at: string | null
  active_days_30: number
}

function mapOverview(r: RawOverview): ChildOverview {
  return {
    studentId: r.student_id,
    currentStreak: Number(r.current_streak) || 0,
    totalWisdom: Number(r.total_wisdom) || 0,
    booksStarted: Number(r.books_started) || 0,
    chaptersRead: Number(r.chapters_read) || 0,
    trialsPassed: Number(r.trials_passed) || 0,
    avgScore: Number(r.avg_score) || 0,
    achievementsCount: Number(r.achievements_count) || 0,
    lastActiveAt: r.last_active_at,
    activeDays30: Number(r.active_days_30) || 0,
  }
}

interface RawActivity {
  occurred_at: string | null
  kind: string
  book_id: string | null
  detail: string
}

interface RawAchievement {
  name: string
  description: string | null
  icon: string | null
  rarity: string | null
  earned_at: string | null
}
