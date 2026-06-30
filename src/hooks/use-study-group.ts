"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import {
  acceptGroupInvite,
  changeMemberRole,
  createGroupGoal,
  createGroupInvite,
  createGroupNote,
  createGroupPost,
  deleteGroupGoal,
  deleteGroupNote,
  deleteGroupPost,
  joinGroup,
  leaveGroup,
  listMemberProgress,
  listTrialsLeaderboard,
  removeMember,
  reportGroupPost,
  setGoalComplete,
  updateGroupNote,
  type GoalTargetType,
  type GroupMemberRole,
  type GroupPrivacy,
  type MemberProgress,
  type TrialsLeaderboardRow,
} from "@/lib/actions/groups"

export interface StudyGroupMeta {
  id: string
  slug: string
  name: string
  description: string | null
  privacy: GroupPrivacy
  memberLimit: number | null
  ownerId: string
  createdAt: Date
}

export interface StudyGroupMember {
  userId: string
  displayName: string
  username: string
  avatarUrl: string | null
  role: GroupMemberRole
  joinedAt: Date
}

export interface StudyPostAuthor {
  id: string
  displayName: string
  username: string
  avatarUrl: string | null
}

export interface StudyPost {
  id: string
  author: StudyPostAuthor
  body: string
  parentId: string | null
  createdAt: Date
  editedAt: Date | null
  replies: StudyPost[]
}

/** A shared study goal, enriched with live group-wide progress. */
export interface StudyGoal {
  id: string
  title: string
  targetType: GoalTargetType
  targetValue: number
  dueAt: Date | null
  completedAt: Date | null
  createdBy: string
  createdAt: Date
  /** Live group-wide progress toward the target; null when not tracked. */
  current: number | null
  /** 0–100 completion percent; null when progress isn't tracked. */
  pct: number | null
}

export interface StudyNote {
  id: string
  authorId: string
  author: StudyPostAuthor
  title: string
  body: string
  updatedAt: Date
  createdAt: Date
}

type Mutation = Promise<{ ok: boolean; error?: string }>

export interface StudyGroupAPI {
  mode: "real" | "demo"
  loading: boolean
  notFound: boolean
  meta: StudyGroupMeta | null
  members: StudyGroupMember[]
  posts: StudyPost[]
  goals: StudyGoal[]
  notes: StudyNote[]
  leaderboard: TrialsLeaderboardRow[]
  myRole: GroupMemberRole | null
  isMember: boolean
  isModerator: boolean
  refresh: () => Promise<void>
  join: () => Mutation
  leave: () => Mutation
  acceptInvite: (inviteId: string) => Mutation
  post: (body: string, parentPostId?: string) => Mutation
  deletePost: (postId: string) => Mutation
  reportPost: (postId: string, reason: string) => Mutation
  addGoal: (input: {
    title: string
    targetType: GoalTargetType
    targetValue: number
    dueAt?: string
  }) => Mutation
  toggleGoal: (goalId: string, complete: boolean) => Mutation
  removeGoal: (goalId: string) => Mutation
  addNote: (input: { title: string; body?: string }) => Mutation
  editNote: (input: { noteId: string; title: string; body?: string }) => Mutation
  removeNote: (noteId: string) => Mutation
  invite: (
    inviteeId?: string,
  ) => Promise<{ ok: boolean; code?: string | null; error?: string }>
  kick: (userId: string) => Mutation
  setRole: (userId: string, role: "moderator" | "member") => Mutation
}

interface GroupRow {
  id: string
  slug: string
  name: string
  description: string | null
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

interface GoalRow {
  id: string
  title: string
  target_type: GoalTargetType
  target_value: number
  due_at: string | null
  completed_at: string | null
  created_by: string
  created_at: string
}

interface NoteRow {
  id: string
  author_id: string
  title: string
  body: string
  updated_at: string
  created_at: string
}

interface ProfileRow {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

function toAuthor(p: ProfileRow | undefined, id: string): StudyPostAuthor {
  return {
    id,
    displayName: p?.display_name ?? p?.username ?? "Reader",
    username: p?.username ?? id.slice(0, 8),
    avatarUrl: p?.avatar_url ?? null,
  }
}

/** Live state + mutations for a single study group (by group UUID). */
export function useStudyGroup(groupId: string): StudyGroupAPI {
  const { user, isDemoMode } = useAuth()
  const isReal = !!user && !isDemoMode

  const [meta, setMeta] = useState<StudyGroupMeta | null>(null)
  const [members, setMembers] = useState<StudyGroupMember[]>([])
  const [posts, setPosts] = useState<StudyPost[]>([])
  const [goalRows, setGoalRows] = useState<GoalRow[]>([])
  const [notes, setNotes] = useState<StudyNote[]>([])
  const [progress, setProgress] = useState<MemberProgress[]>([])
  const [leaderboard, setLeaderboard] = useState<TrialsLeaderboardRow[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  const refresh = useCallback(async () => {
    if (!isReal || !user || !groupId) {
      setLoading(false)
      return
    }
    setLoading(true)
    const supabase = createClient()

    const { data: groupRow } = await supabase
      .from("groups")
      .select(
        "id, slug, name, description, privacy, member_limit, owner_id, created_at",
      )
      .eq("id", groupId)
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
      privacy: g.privacy,
      memberLimit: g.member_limit,
      ownerId: g.owner_id,
      createdAt: new Date(g.created_at),
    })

    const [membersRes, postsRes, goalsRes, notesRes] = await Promise.all([
      supabase
        .from("group_members")
        .select("user_id, role, status, joined_at")
        .eq("group_id", groupId)
        .eq("status", "active"),
      supabase
        .from("group_posts")
        .select("id, author_id, body, parent_post_id, created_at, edited_at")
        .eq("group_id", groupId)
        .is("deleted_at", null)
        .order("created_at", { ascending: true }),
      supabase
        .from("group_goals")
        .select(
          "id, title, target_type, target_value, due_at, completed_at, created_by, created_at",
        )
        .eq("group_id", groupId)
        .order("due_at", { ascending: true, nullsFirst: false }),
      supabase
        .from("group_notes")
        .select("id, author_id, title, body, updated_at, created_at")
        .eq("group_id", groupId)
        .order("updated_at", { ascending: false }),
    ])

    const memberRows = (membersRes.data ?? []) as MemberRow[]
    const postRows = (postsRes.data ?? []) as PostRow[]
    const noteRows = (notesRes.data ?? []) as NoteRow[]
    setGoalRows((goalsRes.data ?? []) as GoalRow[])

    // Resolve profiles for members + post authors + note authors in one batch.
    const profileIds = Array.from(
      new Set([
        ...memberRows.map((m) => m.user_id),
        ...postRows.map((p) => p.author_id),
        ...noteRows.map((n) => n.author_id),
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
    const byId = new Map<string, StudyPost>()
    const tops: StudyPost[] = []
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
    tops.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    setPosts(tops)

    setNotes(
      noteRows.map((n) => ({
        id: n.id,
        authorId: n.author_id,
        author: toAuthor(profileMap.get(n.author_id), n.author_id),
        title: n.title,
        body: n.body,
        updatedAt: new Date(n.updated_at),
        createdAt: new Date(n.created_at),
      })),
    )

    // Member-scoped reads (gated server-side on membership).
    const isMember = memberRows.some((m) => m.user_id === user.id)
    if (isMember) {
      const [progressRes, lbRes] = await Promise.all([
        listMemberProgress(groupId),
        listTrialsLeaderboard(groupId),
      ])
      setProgress(progressRes.ok ? progressRes.data : [])
      setLeaderboard(lbRes.ok ? lbRes.data : [])
    } else {
      setProgress([])
      setLeaderboard([])
    }

    setLoading(false)
  }, [isReal, user, groupId])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Live collaboration: posts, goals, and notes all re-fetch on change.
  useEffect(() => {
    if (!isReal || !user || !groupId) return
    const supabase = createClient()
    const filter = `group_id=eq.${groupId}`
    const channel = supabase
      .channel(`study-group:${groupId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_posts", filter },
        () => refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_goals", filter },
        () => refresh(),
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "group_notes", filter },
        () => refresh(),
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [isReal, user, groupId, refresh])

  const myRole = useMemo<GroupMemberRole | null>(() => {
    if (!user) return null
    return members.find((m) => m.userId === user.id)?.role ?? null
  }, [members, user])

  const isMember = myRole !== null
  const isModerator = myRole === "owner" || myRole === "moderator"

  // Group-wide live progress per goal target type (no duplicated storage).
  const goals = useMemo<StudyGoal[]>(() => {
    const trialsTotal = leaderboard.reduce((sum, r) => sum + r.trialsPassed, 0)
    // Each member's furthest chapter reached (index is 0-based → +1 chapters).
    const chaptersTotal = progress.reduce(
      (sum, p) => sum + (p.chapterIndex === null ? 0 : p.chapterIndex + 1),
      0,
    )
    return goalRows.map((r) => {
      let current: number | null
      if (r.target_type === "trials") current = trialsTotal
      else if (r.target_type === "chapters") current = chaptersTotal
      else current = null // minutes: not tracked yet
      const pct =
        current === null
          ? null
          : Math.min(100, Math.round((current / r.target_value) * 100))
      return {
        id: r.id,
        title: r.title,
        targetType: r.target_type,
        targetValue: r.target_value,
        dueAt: r.due_at ? new Date(r.due_at) : null,
        completedAt: r.completed_at ? new Date(r.completed_at) : null,
        createdBy: r.created_by,
        createdAt: new Date(r.created_at),
        current,
        pct,
      }
    })
  }, [goalRows, leaderboard, progress])

  // ── Mutations (call action, then refresh) ───────────────────────────────
  const wrap = useCallback(
    async (fn: () => Mutation): Mutation => {
      const result = await fn()
      await refresh()
      return result
    },
    [refresh],
  )

  const norm = <T,>(r: { ok: true; data: T } | { ok: false; error: string }) =>
    r.ok ? { ok: true as const } : { ok: false as const, error: r.error }

  const join = useCallback(
    () => wrap(() => joinGroup(groupId).then(norm)),
    [wrap, groupId],
  )
  const leave = useCallback(
    () => wrap(() => leaveGroup(groupId).then(norm)),
    [wrap, groupId],
  )
  const acceptInvite = useCallback(
    (inviteId: string) => wrap(() => acceptGroupInvite(inviteId).then(norm)),
    [wrap],
  )
  const post = useCallback(
    (body: string, parentPostId?: string) =>
      wrap(() => createGroupPost({ groupId, body, parentPostId }).then(norm)),
    [wrap, groupId],
  )
  const deletePost = useCallback(
    (postId: string) => wrap(() => deleteGroupPost(postId).then(norm)),
    [wrap],
  )
  const reportPost = useCallback(
    async (postId: string, reason: string) => norm(await reportGroupPost(postId, reason)),
    [],
  )
  const addGoal = useCallback(
    (input: {
      title: string
      targetType: GoalTargetType
      targetValue: number
      dueAt?: string
    }) => wrap(() => createGroupGoal({ groupId, ...input }).then(norm)),
    [wrap, groupId],
  )
  const toggleGoal = useCallback(
    (goalId: string, complete: boolean) =>
      wrap(() => setGoalComplete(goalId, complete).then(norm)),
    [wrap],
  )
  const removeGoal = useCallback(
    (goalId: string) => wrap(() => deleteGroupGoal(goalId).then(norm)),
    [wrap],
  )
  const addNote = useCallback(
    (input: { title: string; body?: string }) =>
      wrap(() => createGroupNote({ groupId, ...input }).then(norm)),
    [wrap, groupId],
  )
  const editNote = useCallback(
    (input: { noteId: string; title: string; body?: string }) =>
      wrap(() => updateGroupNote(input).then(norm)),
    [wrap],
  )
  const removeNote = useCallback(
    (noteId: string) => wrap(() => deleteGroupNote(noteId).then(norm)),
    [wrap],
  )
  const invite = useCallback(
    async (inviteeId?: string) => {
      const r = await createGroupInvite({ groupId, inviteeId })
      await refresh()
      return r.ok
        ? { ok: true, code: r.data.code }
        : { ok: false, error: r.error }
    },
    [groupId, refresh],
  )
  const kick = useCallback(
    (userId: string) => wrap(() => removeMember(groupId, userId).then(norm)),
    [wrap, groupId],
  )
  const setRole = useCallback(
    (userId: string, role: "moderator" | "member") =>
      wrap(() => changeMemberRole({ groupId, userId, role }).then(norm)),
    [wrap, groupId],
  )

  return useMemo(
    () => ({
      mode: isReal ? "real" : "demo",
      loading,
      notFound,
      meta,
      members,
      posts,
      goals,
      notes,
      leaderboard,
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
      addGoal,
      toggleGoal,
      removeGoal,
      addNote,
      editNote,
      removeNote,
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
      goals,
      notes,
      leaderboard,
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
      addGoal,
      toggleGoal,
      removeGoal,
      addNote,
      editNote,
      removeNote,
      invite,
      kick,
      setRole,
    ],
  )
}
