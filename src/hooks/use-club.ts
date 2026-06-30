"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { getBook } from "@/lib/content"
import {
  acceptGroupInvite,
  changeMemberRole,
  createGroupInvite,
  createGroupPost,
  createScheduleItem,
  deleteGroupPost,
  deleteScheduleItem,
  joinGroup,
  leaveGroup,
  listMemberProgress,
  removeMember,
  reportGroupPost,
  type GroupMemberRole,
  type GroupPrivacy,
  type MemberProgress,
} from "@/lib/actions/groups"

export interface ClubMeta {
  id: string
  slug: string
  name: string
  description: string | null
  cover: string | null
  bookId: string | null
  bookTitle: string | null
  privacy: GroupPrivacy
  memberLimit: number | null
  ownerId: string
  createdAt: Date
}

export interface ClubMember {
  userId: string
  displayName: string
  username: string
  avatarUrl: string | null
  role: GroupMemberRole
  joinedAt: Date
}

export interface ClubPostAuthor {
  id: string
  displayName: string
  username: string
  avatarUrl: string | null
}

export interface ClubPost {
  id: string
  author: ClubPostAuthor
  body: string
  parentId: string | null
  createdAt: Date
  editedAt: Date | null
  /** Top-level posts carry their thread replies (sorted oldest→newest). */
  replies: ClubPost[]
}

export interface ClubScheduleItem {
  id: string
  label: string
  chapterOrSection: string | null
  targetDate: Date | null
}

export interface ClubAPI {
  mode: "real" | "demo"
  loading: boolean
  notFound: boolean
  meta: ClubMeta | null
  members: ClubMember[]
  posts: ClubPost[]
  schedule: ClubScheduleItem[]
  progress: MemberProgress[]
  myRole: GroupMemberRole | null
  isMember: boolean
  isModerator: boolean
  refresh: () => Promise<void>
  join: () => Promise<{ ok: boolean; error?: string }>
  leave: () => Promise<{ ok: boolean; error?: string }>
  acceptInvite: (inviteId: string) => Promise<{ ok: boolean; error?: string }>
  post: (
    body: string,
    parentPostId?: string,
  ) => Promise<{ ok: boolean; error?: string }>
  deletePost: (postId: string) => Promise<{ ok: boolean; error?: string }>
  reportPost: (
    postId: string,
    reason: string,
  ) => Promise<{ ok: boolean; error?: string }>
  addSchedule: (input: {
    label: string
    chapterOrSection?: string
    targetDate?: string
  }) => Promise<{ ok: boolean; error?: string }>
  removeSchedule: (id: string) => Promise<{ ok: boolean; error?: string }>
  invite: (
    inviteeId?: string,
  ) => Promise<{ ok: boolean; code?: string | null; error?: string }>
  kick: (userId: string) => Promise<{ ok: boolean; error?: string }>
  setRole: (
    userId: string,
    role: "moderator" | "member",
  ) => Promise<{ ok: boolean; error?: string }>
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
  owner_id: string
  created_at: string
}

interface MemberRow {
  user_id: string
  role: GroupMemberRole
  status: string
  joined_at: string
}

interface PostRow {
  id: string
  author_id: string
  body: string
  parent_post_id: string | null
  created_at: string
  edited_at: string | null
}

interface ProfileRow {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

interface ScheduleRow {
  id: string
  label: string
  chapter_or_section: string | null
  target_date: string | null
}

function toAuthor(p: ProfileRow | undefined, id: string): ClubPostAuthor {
  return {
    id,
    displayName: p?.display_name ?? p?.username ?? "Reader",
    username: p?.username ?? id.slice(0, 8),
    avatarUrl: p?.avatar_url ?? null,
  }
}

/** Live state + mutations for a single book club (by group UUID). */
export function useClub(clubId: string): ClubAPI {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode

  const [meta, setMeta] = useState<ClubMeta | null>(null)
  const [members, setMembers] = useState<ClubMember[]>([])
  const [posts, setPosts] = useState<ClubPost[]>([])
  const [schedule, setSchedule] = useState<ClubScheduleItem[]>([])
  const [progress, setProgress] = useState<MemberProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const refresh = useCallback(async () => {
    if (!isReal || !user || !clubId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = createClient()

    const { data: groupRow } = await supabase
      .from("groups")
      .select(
        "id, slug, name, description, cover, book_id, privacy, member_limit, owner_id, created_at",
      )
      .eq("id", clubId)
      .maybeSingle()

    if (!groupRow) {
      setNotFound(true)
      setLoading(false)
      return
    }
    const g = groupRow as GroupRow
    setNotFound(false)
    setMeta({
      id: g.id,
      slug: g.slug,
      name: g.name,
      description: g.description,
      cover: g.cover,
      bookId: g.book_id,
      bookTitle: g.book_id ? getBook(g.book_id)?.title ?? null : null,
      privacy: g.privacy,
      memberLimit: g.member_limit,
      ownerId: g.owner_id,
      createdAt: new Date(g.created_at),
    })

    const [membersRes, postsRes, scheduleRes] = await Promise.all([
      supabase
        .from("group_members")
        .select("user_id, role, status, joined_at")
        .eq("group_id", clubId)
        .eq("status", "active"),
      supabase
        .from("group_posts")
        .select("id, author_id, body, parent_post_id, created_at, edited_at")
        .eq("group_id", clubId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true }),
      supabase
        .from("group_schedule")
        .select("id, label, chapter_or_section, target_date")
        .eq("group_id", clubId)
        .order("target_date", { ascending: true, nullsFirst: false }),
    ])

    const memberRows = (membersRes.data ?? []) as MemberRow[]
    const postRows = (postsRes.data ?? []) as PostRow[]
    const scheduleRows = (scheduleRes.data ?? []) as ScheduleRow[]

    // Resolve profiles for members + post authors in one batch.
    const profileIds = Array.from(
      new Set([
        ...memberRows.map((m) => m.user_id),
        ...postRows.map((p) => p.author_id),
      ]),
    )
    const profileMap = new Map<string, ProfileRow>()
    if (profileIds.length > 0) {
      const { data: profileRows } = await supabase
        .from("profiles")
        .select("id, display_name, username, avatar_url")
        .in("id", profileIds)
      for (const p of (profileRows ?? []) as ProfileRow[]) {
        profileMap.set(p.id, p)
      }
    }

    setMembers(
      memberRows.map((m) => {
        const p = profileMap.get(m.user_id)
        return {
          userId: m.user_id,
          displayName: p?.display_name ?? p?.username ?? "Reader",
          username: p?.username ?? m.user_id.slice(0, 8),
          avatarUrl: p?.avatar_url ?? null,
          role: m.role,
          joinedAt: new Date(m.joined_at),
        }
      }),
    )

    // Build threaded structure: top-level posts + their replies.
    const byId = new Map<string, ClubPost>()
    const tops: ClubPost[] = []
    for (const r of postRows) {
      byId.set(r.id, {
        id: r.id,
        author: toAuthor(profileMap.get(r.author_id), r.author_id),
        body: r.body,
        parentId: r.parent_post_id,
        createdAt: new Date(r.created_at),
        editedAt: r.edited_at ? new Date(r.edited_at) : null,
        replies: [],
      })
    }
    for (const r of postRows) {
      const node = byId.get(r.id)!
      if (r.parent_post_id && byId.has(r.parent_post_id)) {
        byId.get(r.parent_post_id)!.replies.push(node)
      } else {
        tops.push(node)
      }
    }
    // Newest threads first; replies stay oldest→newest within a thread.
    tops.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    setPosts(tops)

    setSchedule(
      scheduleRows.map((s) => ({
        id: s.id,
        label: s.label,
        chapterOrSection: s.chapter_or_section,
        targetDate: s.target_date ? new Date(s.target_date) : null,
      })),
    )

    // Member progress (gated server-side on membership; ignore if not a member).
    const isMember = memberRows.some((m) => m.user_id === user.id)
    if (isMember) {
      const res = await listMemberProgress(clubId)
      setProgress(res.ok ? res.data : [])
    } else {
      setProgress([])
    }

    setLoading(false)
  }, [isReal, user, clubId])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live discussion: any change to this group's posts re-fetches.
  useEffect(() => {
    if (!isReal || !user || !clubId) return
    const supabase = createClient()
    const channel = supabase
      .channel(`club:${clubId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "group_posts",
          filter: `group_id=eq.${clubId}`,
        },
        () => refresh(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isReal, user, clubId, refresh])

  const myRole = useMemo<GroupMemberRole | null>(() => {
    if (!user) return null
    return members.find((m) => m.userId === user.id)?.role ?? null
  }, [members, user])

  const isMember = myRole !== null
  const isModerator = myRole === "owner" || myRole === "moderator"

  // ── Mutations (call action, then refresh) ───────────────────────────────
  const wrap = useCallback(
    async (
      fn: () => Promise<{ ok: boolean; error?: string }>,
    ): Promise<{ ok: boolean; error?: string }> => {
      const result = await fn()
      await refresh()
      return result
    },
    [refresh],
  )

  const join = useCallback(
    () => wrap(() => joinGroup(clubId).then((r) => (r.ok ? { ok: true } : { ok: false, error: r.error }))),
    [wrap, clubId],
  )
  const leave = useCallback(
    () => wrap(() => leaveGroup(clubId).then((r) => (r.ok ? { ok: true } : { ok: false, error: r.error }))),
    [wrap, clubId],
  )
  const acceptInvite = useCallback(
    (inviteId: string) =>
      wrap(() => acceptGroupInvite(inviteId).then((r) => (r.ok ? { ok: true } : { ok: false, error: r.error }))),
    [wrap],
  )
  const post = useCallback(
    (body: string, parentPostId?: string) =>
      wrap(() =>
        createGroupPost({ groupId: clubId, body, parentPostId }).then((r) =>
          r.ok ? { ok: true } : { ok: false, error: r.error },
        ),
      ),
    [wrap, clubId],
  )
  const deletePost = useCallback(
    (postId: string) =>
      wrap(() => deleteGroupPost(postId).then((r) => (r.ok ? { ok: true } : { ok: false, error: r.error }))),
    [wrap],
  )
  const reportPost = useCallback(
    async (postId: string, reason: string) => {
      const r = await reportGroupPost(postId, reason)
      return r.ok ? { ok: true } : { ok: false, error: r.error }
    },
    [],
  )
  const addSchedule = useCallback(
    (input: { label: string; chapterOrSection?: string; targetDate?: string }) =>
      wrap(() =>
        createScheduleItem({ groupId: clubId, ...input }).then((r) =>
          r.ok ? { ok: true } : { ok: false, error: r.error },
        ),
      ),
    [wrap, clubId],
  )
  const removeSchedule = useCallback(
    (id: string) =>
      wrap(() => deleteScheduleItem(id).then((r) => (r.ok ? { ok: true } : { ok: false, error: r.error }))),
    [wrap],
  )
  const invite = useCallback(
    async (inviteeId?: string) => {
      const r = await createGroupInvite({ groupId: clubId, inviteeId })
      await refresh()
      return r.ok
        ? { ok: true, code: r.data.code }
        : { ok: false, error: r.error }
    },
    [clubId, refresh],
  )
  const kick = useCallback(
    (userId: string) =>
      wrap(() => removeMember(clubId, userId).then((r) => (r.ok ? { ok: true } : { ok: false, error: r.error }))),
    [wrap, clubId],
  )
  const setRole = useCallback(
    (userId: string, role: "moderator" | "member") =>
      wrap(() =>
        changeMemberRole({ groupId: clubId, userId, role }).then((r) =>
          r.ok ? { ok: true } : { ok: false, error: r.error },
        ),
      ),
    [wrap, clubId],
  )

  return useMemo(
    () => ({
      mode: isReal ? "real" : "demo",
      loading,
      notFound,
      meta,
      members,
      posts,
      schedule,
      progress,
      myRole,
      isMember,
      isModerator,
      refresh,
      join,
      leave,
      acceptInvite,
      post,
      deletePost,
      reportPost,
      addSchedule,
      removeSchedule,
      invite,
      kick,
      setRole,
    }),
    [
      isReal,
      loading,
      notFound,
      meta,
      members,
      posts,
      schedule,
      progress,
      myRole,
      isMember,
      isModerator,
      refresh,
      join,
      leave,
      acceptInvite,
      post,
      deletePost,
      reportPost,
      addSchedule,
      removeSchedule,
      invite,
      kick,
      setRole,
    ],
  )
}
