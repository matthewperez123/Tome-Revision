"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import type { GroupPrivacy } from "@/lib/actions/groups"

export interface ClubSummary {
  id: string
  slug: string
  name: string
  description: string | null
  cover: string | null
  bookId: string | null
  bookTitle: string | null
  privacy: GroupPrivacy
  memberLimit: number | null
  memberCount: number
  /** Whether the signed-in user is an active member. */
  isMember: boolean
  createdAt: Date
}

export interface ClubsDirectoryAPI {
  /** "real" when signed in; "demo" otherwise → true empty state. */
  mode: "real" | "demo"
  loading: boolean
  myClubs: ClubSummary[]
  discover: ClubSummary[]
  refresh: () => Promise<void>
}

interface GroupRow {
  id: string
  slug: string
  name: string
  description: string | null
  cover: string | null
  book_id: string | null
  privacy: GroupPrivacy
  member_limit: number | null
  created_at: string
}

interface MemberRow {
  group_id: string
  user_id: string
  status: string
}

/** Directory of book clubs: the ones I'm in + public ones to discover. */
export function useClubs(): ClubsDirectoryAPI {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode

  const [groups, setGroups] = useState<ClubSummary[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!isReal || !user) {
      setGroups([])
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = createClient()

    // RLS limits this to visible groups: all public clubs + any I belong to.
    const { data: groupRows } = await supabase
      .from("groups")
      .select(
        "id, slug, name, description, cover, book_id, privacy, member_limit, created_at",
      )
      .eq("kind", "book_club")
      .order("created_at", { ascending: false })
    const rows = (groupRows ?? []) as GroupRow[]

    if (rows.length === 0) {
      setGroups([])
      setLoading(false)
      return
    }

    // Member roster for visible groups (drives counts + my membership).
    const ids = rows.map((r) => r.id)
    const { data: memberRows } = await supabase
      .from("group_members")
      .select("group_id, user_id, status")
      .in("group_id", ids)
      .eq("status", "active")
    const members = (memberRows ?? []) as MemberRow[]

    const countMap = new Map<string, number>()
    const mineSet = new Set<string>()
    for (const m of members) {
      countMap.set(m.group_id, (countMap.get(m.group_id) ?? 0) + 1)
      if (m.user_id === user.id) mineSet.add(m.group_id)
    }

    setGroups(
      rows.map((r) => ({
        id: r.id,
        slug: r.slug,
        name: r.name,
        description: r.description,
        cover: r.cover,
        bookId: r.book_id,
        bookTitle: r.book_id ? getBook(r.book_id)?.title ?? null : null,
        privacy: r.privacy,
        memberLimit: r.member_limit,
        memberCount: countMap.get(r.id) ?? 0,
        isMember: mineSet.has(r.id),
        createdAt: new Date(r.created_at),
      })),
    )
    setLoading(false)
  }, [isReal, user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const { myClubs, discover } = useMemo(() => {
    const mine = groups.filter((g) => g.isMember)
    const pub = groups.filter((g) => g.privacy === "public" && !g.isMember)
    return { myClubs: mine, discover: pub }
  }, [groups])

  return useMemo(
    () => ({
      mode: isReal ? "real" : "demo",
      loading,
      myClubs,
      discover,
      refresh,
    }),
    [isReal, loading, myClubs, discover, refresh],
  )
}
