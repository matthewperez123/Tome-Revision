"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  Award,
  Brain,
  ChevronLeft,
  Crown,
  Flag,
  Link2,
  MessageSquare,
  NotebookPen,
  Plus,
  Send,
  Shield,
  Target,
  Trash2,
  Trophy,
  UserMinus,
  Users,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import {
  useStudyGroup,
  type StudyGoal,
  type StudyGroupMember,
  type StudyNote,
  type StudyPost,
} from "@/hooks/use-study-group"
import {
  GOAL_TARGET_TYPES,
  type GoalTargetType,
  type TrialsLeaderboardRow,
} from "@/lib/actions/groups"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"
const VERDIGRIS = "#2E7D6F"

const TARGET_LABEL: Record<GoalTargetType, string> = {
  chapters: "chapters read",
  trials: "Trials passed",
  minutes: "minutes",
}

export default function StudyGroupDetailPage() {
  const params = useParams()
  const groupId = params.groupId as string
  const group = useStudyGroup(groupId)

  if (group.mode === "demo") {
    return (
      <CenteredNote
        title="Sign in to view this study group"
        action={{ href: "/study-groups", label: "Back to study groups" }}
      />
    )
  }

  if (group.loading && !group.meta) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <div className="h-24 w-64 animate-pulse rounded-xl border border-border bg-muted/30" />
      </div>
    )
  }

  if (group.notFound || !group.meta) {
    return (
      <CenteredNote
        title="Study group not found"
        action={{ href: "/study-groups", label: "Back to study groups" }}
      />
    )
  }

  const meta = group.meta

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4 md:p-6">
        <Link
          href="/study-groups"
          className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" /> Back to study groups
        </Link>
        <div className="flex items-start gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: LAPIS }}
          >
            <Brain className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg font-semibold tracking-tight">
              {meta.name}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {group.members.length} members · {meta.privacy}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {group.isModerator && <InviteButton invite={group.invite} />}
            {group.isMember ? (
              group.myRole !== "owner" && (
                <button
                  type="button"
                  onClick={async () => {
                    const r = await group.leave()
                    if (r.ok) toast.success("Left the group")
                    else toast.error(r.error ?? "Could not leave.")
                  }}
                  className="rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-accent/30"
                >
                  Leave
                </button>
              )
            ) : meta.privacy === "public" ? (
              <button
                type="button"
                onClick={async () => {
                  const r = await group.join()
                  if (r.ok) toast.success("Joined the group")
                  else toast.error(r.error ?? "Could not join.")
                }}
                className="rounded-full bg-foreground px-3 py-1 text-xs font-medium text-background hover:opacity-90"
              >
                Join
              </button>
            ) : (
              <Badge variant="outline" className="text-[10px]">
                Invite only
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Tabs
          defaultValue="goals"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="shrink-0 px-4 pt-2">
            <TabsList>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
          </div>

          {/* Goals */}
          <TabsContent value="goals" className="flex-1 overflow-y-auto p-4">
            <GoalsTab group={group} />
          </TabsContent>

          {/* Leaderboard */}
          <TabsContent
            value="leaderboard"
            className="flex-1 overflow-y-auto p-4"
          >
            <LeaderboardTab
              leaderboard={group.leaderboard}
              isMember={group.isMember}
            />
          </TabsContent>

          {/* Notes */}
          <TabsContent value="notes" className="flex-1 overflow-y-auto p-4">
            <NotesTab group={group} />
          </TabsContent>

          {/* Discussion */}
          <TabsContent
            value="discussion"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <DiscussionTab group={group} />
          </TabsContent>

          {/* Members */}
          <TabsContent value="members" className="flex-1 overflow-y-auto p-4">
            <MembersTab group={group} />
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="flex-1 overflow-y-auto p-4">
            <div className="max-w-lg space-y-6">
              <Section title="Description">
                <p className="text-sm leading-relaxed">
                  {meta.description || "No description yet."}
                </p>
              </Section>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground">Created</span>
                  <p>
                    {meta.createdAt.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Privacy</span>
                  <p className="capitalize">{meta.privacy}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">
                    Max members
                  </span>
                  <p>{meta.memberLimit ?? "No limit"}</p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Members</span>
                  <p>{group.members.length}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ── Goals ────────────────────────────────────────────────────────────────────

function GoalsTab({ group }: { group: ReturnType<typeof useStudyGroup> }) {
  const [adding, setAdding] = useState(false)

  return (
    <div className="mx-auto max-w-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Shared study goals
        </h3>
        {group.isMember && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] hover:bg-accent/30"
          >
            <Plus className="size-2.5" /> Goal
          </button>
        )}
      </div>

      {adding && <GoalForm group={group} onDone={() => setAdding(false)} />}

      {group.goals.length === 0 ? (
        <div className="py-12 text-center">
          <Target className="mx-auto mb-3 size-8 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No shared goals yet</p>
          {group.isMember && (
            <p className="mt-1 text-xs text-muted-foreground">
              Set a target — chapters read, Trials passed, or minutes studied.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {group.goals.map((goal) => (
            <GoalCard key={goal.id} goal={goal} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}

function GoalForm({
  group,
  onDone,
}: {
  group: ReturnType<typeof useStudyGroup>
  onDone: () => void
}) {
  const [title, setTitle] = useState("")
  const [targetType, setTargetType] = useState<GoalTargetType>("trials")
  const [targetValue, setTargetValue] = useState("10")
  const [dueAt, setDueAt] = useState("")
  const [pending, setPending] = useState(false)

  async function add() {
    const value = Number(targetValue)
    if (!title.trim() || !Number.isFinite(value) || value <= 0) return
    setPending(true)
    const r = await group.addGoal({
      title: title.trim(),
      targetType,
      targetValue: value,
      dueAt: dueAt || undefined,
    })
    setPending(false)
    if (r.ok) {
      toast.success("Goal set")
      onDone()
    } else {
      toast.error(r.error ?? "Could not set goal.")
    }
  }

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Goal (e.g. Pass 20 Trials before the exam)"
        className="h-8 w-full rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex gap-2">
        <select
          value={targetType}
          onChange={(e) => setTargetType(e.target.value as GoalTargetType)}
          className="h-8 flex-1 rounded-md border bg-background px-2 text-xs"
        >
          {GOAL_TARGET_TYPES.map((t) => (
            <option key={t} value={t}>
              {TARGET_LABEL[t]}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={targetValue}
          onChange={(e) => setTargetValue(e.target.value)}
          min={1}
          placeholder="Target"
          className="h-8 w-24 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="date"
          value={dueAt}
          onChange={(e) => setDueAt(e.target.value)}
          className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onDone}
          className="rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={add}
          disabled={!title.trim() || pending}
          className="rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background disabled:opacity-50"
        >
          {pending ? "Adding…" : "Add goal"}
        </button>
      </div>
    </div>
  )
}

function GoalCard({
  goal,
  group,
}: {
  goal: StudyGoal
  group: ReturnType<typeof useStudyGroup>
}) {
  const { user } = useAuth()
  const done = goal.completedAt !== null
  const canManage = group.isModerator || goal.createdBy === user?.id

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">{goal.title}</p>
            {done && (
              <Badge
                variant="outline"
                className="shrink-0 border-[#2E7D6F]/40 text-[9px]"
                style={{ color: VERDIGRIS }}
              >
                Met
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Target: {goal.targetValue} {TARGET_LABEL[goal.targetType]}
            {goal.dueAt &&
              ` · due ${goal.dueAt.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}`}
          </p>
        </div>
        {canManage && (
          <div className="flex shrink-0 items-center gap-1">
            {group.isMember && (
              <button
                type="button"
                onClick={async () => {
                  const r = await group.toggleGoal(goal.id, !done)
                  if (r.ok)
                    toast.success(done ? "Goal reopened" : "Goal marked met")
                  else toast.error(r.error ?? "Failed.")
                }}
                className="rounded border border-border px-1.5 py-0.5 text-[9px] hover:bg-accent/30"
              >
                {done ? "Reopen" : "Mark met"}
              </button>
            )}
            <button
              type="button"
              onClick={async () => {
                const r = await group.removeGoal(goal.id)
                if (!r.ok) toast.error(r.error ?? "Failed.")
              }}
              className="rounded-full p-1 text-muted-foreground/60 hover:text-[#C8553D]"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Live group-wide progress */}
      {goal.current === null ? (
        <p className="mt-3 text-[10px] italic text-muted-foreground">
          Progress isn&apos;t tracked for this target yet.
        </p>
      ) : (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>
              {goal.current} / {goal.targetValue}{" "}
              {TARGET_LABEL[goal.targetType]}
            </span>
            <span>{goal.pct}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${goal.pct ?? 0}%`,
                backgroundColor: done ? VERDIGRIS : LAPIS,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

// ── Leaderboard ──────────────────────────────────────────────────────────────

function LeaderboardTab({
  leaderboard,
  isMember,
}: {
  leaderboard: TrialsLeaderboardRow[]
  isMember: boolean
}) {
  if (!isMember) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Join the group to see the Trials leaderboard.
      </p>
    )
  }
  const anyTrials = leaderboard.some((r) => r.trialsPassed > 0)
  if (!anyTrials) {
    return (
      <div className="py-12 text-center">
        <Trophy className="mx-auto mb-3 size-8 text-muted-foreground/20" />
        <p className="text-sm text-muted-foreground">No Trials passed yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Pass Trials in the reader to climb the leaderboard.
        </p>
      </div>
    )
  }
  return (
    <div className="mx-auto max-w-lg space-y-2">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Trials leaderboard
      </h3>
      {leaderboard.map((row, i) => (
        <div
          key={row.userId}
          className="flex items-center gap-3 rounded-xl border bg-card p-3"
        >
          <div
            className="flex size-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
            style={{
              backgroundColor: i === 0 ? `${GOLD}22` : "transparent",
              color: i === 0 ? GOLD : "var(--muted-foreground)",
            }}
          >
            {i + 1}
          </div>
          <Avatar
            member={{
              displayName: row.displayName,
              username: row.username,
              avatarUrl: row.avatarUrl,
            }}
            size={36}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <Link
                href={`/profile/${row.username}`}
                className="truncate text-sm font-medium hover:underline"
              >
                {row.displayName}
              </Link>
              <RoleIcon role={row.role} />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {row.trialsPassed} Trials passed
              {row.avgScore !== null && ` · ${row.avgScore}% avg`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1 text-xs font-semibold">
            <Award className="size-3.5" style={{ color: GOLD }} />
            {row.totalWisdom}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Notes ────────────────────────────────────────────────────────────────────

function NotesTab({ group }: { group: ReturnType<typeof useStudyGroup> }) {
  const [composing, setComposing] = useState(false)

  return (
    <div className="mx-auto max-w-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Collaborative notes
        </h3>
        {group.isMember && (
          <button
            type="button"
            onClick={() => setComposing((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] hover:bg-accent/30"
          >
            <Plus className="size-2.5" /> Note
          </button>
        )}
      </div>

      {composing && (
        <NoteForm
          onCancel={() => setComposing(false)}
          onSubmit={async (title, body) => {
            const r = await group.addNote({ title, body })
            if (r.ok) {
              toast.success("Note added")
              setComposing(false)
            } else {
              toast.error(r.error ?? "Could not add note.")
            }
          }}
        />
      )}

      {group.notes.length === 0 ? (
        <div className="py-12 text-center">
          <NotebookPen className="mx-auto mb-3 size-8 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No notes yet</p>
          {group.isMember && (
            <p className="mt-1 text-xs text-muted-foreground">
              Capture summaries, definitions, and study tips together.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2.5">
          {group.notes.map((note) => (
            <NoteCard key={note.id} note={note} group={group} />
          ))}
        </div>
      )}
    </div>
  )
}

function NoteForm({
  initialTitle = "",
  initialBody = "",
  submitLabel = "Add note",
  onCancel,
  onSubmit,
}: {
  initialTitle?: string
  initialBody?: string
  submitLabel?: string
  onCancel: () => void
  onSubmit: (title: string, body: string) => Promise<void>
}) {
  const [title, setTitle] = useState(initialTitle)
  const [body, setBody] = useState(initialBody)
  const [pending, setPending] = useState(false)

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Note title"
        className="h-8 w-full rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        autoFocus
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write your note…"
        rows={4}
        className="w-full resize-none rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full px-3 py-1 text-[11px] text-muted-foreground hover:text-foreground"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!title.trim() || pending}
          onClick={async () => {
            setPending(true)
            await onSubmit(title.trim(), body.trim())
            setPending(false)
          }}
          className="rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background disabled:opacity-50"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </div>
  )
}

function NoteCard({
  note,
  group,
}: {
  note: StudyNote
  group: ReturnType<typeof useStudyGroup>
}) {
  const { user } = useAuth()
  const [editing, setEditing] = useState(false)
  const canManage = group.isModerator || note.authorId === user?.id

  if (editing) {
    return (
      <NoteForm
        initialTitle={note.title}
        initialBody={note.body}
        submitLabel="Save"
        onCancel={() => setEditing(false)}
        onSubmit={async (title, body) => {
          const r = await group.editNote({ noteId: note.id, title, body })
          if (r.ok) {
            toast.success("Note updated")
            setEditing(false)
          } else {
            toast.error(r.error ?? "Could not save.")
          }
        }}
      />
    )
  }

  return (
    <div className="rounded-xl border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">{note.title}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            {note.author.displayName} · {timeAgo(note.updatedAt)}
          </p>
        </div>
        {canManage && (
          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded border border-border px-1.5 py-0.5 text-[9px] hover:bg-accent/30"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={async () => {
                const r = await group.removeNote(note.id)
                if (!r.ok) toast.error(r.error ?? "Failed.")
              }}
              className="rounded-full p-1 text-muted-foreground/60 hover:text-[#C8553D]"
            >
              <Trash2 className="size-3.5" />
            </button>
          </div>
        )}
      </div>
      {note.body && (
        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {note.body}
        </p>
      )}
    </div>
  )
}

// ── Discussion ───────────────────────────────────────────────────────────────

function DiscussionTab({ group }: { group: ReturnType<typeof useStudyGroup> }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  async function send() {
    if (!message.trim()) return
    setSending(true)
    const r = await group.post(message.trim())
    setSending(false)
    if (r.ok) setMessage("")
    else toast.error(r.error ?? "Could not post.")
  }

  return (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {group.posts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <MessageSquare className="mb-3 size-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              No discussion yet. Start the conversation.
            </p>
          </div>
        ) : (
          group.posts.map((post) => (
            <PostThread key={post.id} post={post} group={group} />
          ))
        )}
      </div>
      {group.isMember && (
        <div className="shrink-0 border-t border-border p-3">
          <div className="flex gap-2">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share your thoughts…"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && message.trim()) {
                  e.preventDefault()
                  send()
                }
              }}
              className="h-9 flex-1 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              type="button"
              disabled={!message.trim() || sending}
              onClick={send}
              className="flex size-9 shrink-0 items-center justify-center rounded-md bg-foreground text-background disabled:opacity-50"
            >
              <Send className="size-3.5" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

function PostThread({
  post,
  group,
}: {
  post: StudyPost
  group: ReturnType<typeof useStudyGroup>
}) {
  const [replying, setReplying] = useState(false)
  const [reply, setReply] = useState("")

  async function sendReply() {
    if (!reply.trim()) return
    const r = await group.post(reply.trim(), post.id)
    if (r.ok) {
      setReply("")
      setReplying(false)
    } else {
      toast.error(r.error ?? "Could not reply.")
    }
  }

  return (
    <div className="space-y-2">
      <PostRow
        post={post}
        group={group}
        onReply={() => setReplying((v) => !v)}
      />
      {post.replies.length > 0 && (
        <div className="ml-9 space-y-2 border-l border-border pl-3">
          {post.replies.map((r) => (
            <PostRow key={r.id} post={r} group={group} />
          ))}
        </div>
      )}
      {replying && group.isMember && (
        <div className="ml-9 flex gap-2">
          <input
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Reply…"
            onKeyDown={(e) => {
              if (e.key === "Enter" && reply.trim()) sendReply()
            }}
            autoFocus
            className="h-8 flex-1 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="button"
            onClick={sendReply}
            disabled={!reply.trim()}
            className="rounded-md bg-foreground px-2 text-[11px] font-medium text-background disabled:opacity-50"
          >
            Reply
          </button>
        </div>
      )}
    </div>
  )
}

function PostRow({
  post,
  group,
  onReply,
}: {
  post: StudyPost
  group: ReturnType<typeof useStudyGroup>
  onReply?: () => void
}) {
  const { user } = useAuth()
  const [reporting, setReporting] = useState(false)
  const mine = user?.id === post.author.id
  const canDelete = mine || group.isModerator

  return (
    <div className="flex gap-3">
      <Avatar member={post.author} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            href={`/profile/${post.author.username}`}
            className="text-xs font-semibold hover:underline"
          >
            {post.author.displayName}
          </Link>
          <span className="text-[9px] text-muted-foreground">
            {timeAgo(post.createdAt)}
            {post.editedAt && " · edited"}
          </span>
        </div>
        <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
          {post.body}
        </p>
        <div className="mt-1 flex items-center gap-3">
          {onReply && group.isMember && (
            <button
              type="button"
              onClick={onReply}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Reply
            </button>
          )}
          {canDelete && (
            <button
              type="button"
              onClick={async () => {
                const r = await group.deletePost(post.id)
                if (!r.ok) toast.error(r.error ?? "Could not delete.")
              }}
              className="flex items-center gap-0.5 text-[10px] text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="size-2.5" /> Delete
            </button>
          )}
          {!mine && (
            <button
              type="button"
              onClick={() => setReporting((v) => !v)}
              className="flex items-center gap-0.5 text-[10px] text-muted-foreground/60 hover:text-foreground"
            >
              <Flag className="size-2.5" /> Report
            </button>
          )}
        </div>
        {reporting && (
          <ReportForm
            onCancel={() => setReporting(false)}
            onSubmit={async (reason) => {
              const r = await group.reportPost(post.id, reason)
              if (r.ok) {
                toast.success("Report submitted. Thank you.")
                setReporting(false)
              } else {
                toast.error(r.error ?? "Could not submit report.")
              }
            }}
          />
        )}
      </div>
    </div>
  )
}

function ReportForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void
  onSubmit: (reason: string) => Promise<void>
}) {
  const [reason, setReason] = useState("")
  const [pending, setPending] = useState(false)
  return (
    <div className="mt-2 space-y-2 rounded-lg border border-border bg-muted/30 p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">
          Report this post
        </p>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full p-0.5 text-muted-foreground hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      </div>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="What's wrong with this? (required)"
        rows={2}
        className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8553D]"
        autoFocus
      />
      <div className="flex justify-end">
        <button
          type="button"
          disabled={pending || reason.trim().length === 0}
          onClick={async () => {
            setPending(true)
            await onSubmit(reason.trim())
            setPending(false)
          }}
          className="rounded-full bg-[#C8553D] px-3 py-1 text-[11px] font-medium text-white disabled:opacity-50"
        >
          {pending ? "Submitting…" : "Submit report"}
        </button>
      </div>
    </div>
  )
}

// ── Members ──────────────────────────────────────────────────────────────────

function MembersTab({ group }: { group: ReturnType<typeof useStudyGroup> }) {
  const { user } = useAuth()
  if (group.members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members yet.
      </p>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {group.members.map((m) => (
        <div
          key={m.userId}
          className="flex flex-col items-center gap-2 rounded-xl border bg-card p-4 text-center"
        >
          <Avatar member={m} size={48} />
          <div>
            <Link
              href={`/profile/${m.username}`}
              className="text-sm font-medium hover:underline"
            >
              {m.displayName}
            </Link>
            <div className="mt-0.5 flex items-center justify-center gap-1">
              <RoleIcon role={m.role} />
              <span className="text-[10px] capitalize text-muted-foreground">
                {m.role}
              </span>
            </div>
          </div>
          {group.isModerator && m.role !== "owner" && m.userId !== user?.id && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={async () => {
                  const next = m.role === "moderator" ? "member" : "moderator"
                  const r = await group.setRole(m.userId, next)
                  if (!r.ok) toast.error(r.error ?? "Failed.")
                }}
                className="rounded border border-border px-1.5 py-0.5 text-[9px] hover:bg-accent/30"
              >
                {m.role === "moderator" ? "Demote" : "Promote"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const r = await group.kick(m.userId)
                  if (r.ok) toast.success("Member removed")
                  else toast.error(r.error ?? "Failed.")
                }}
                className="flex items-center rounded border border-border px-1.5 py-0.5 text-[9px] text-[#C8553D] hover:bg-accent/30"
              >
                <UserMinus className="size-2.5" />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Invite ───────────────────────────────────────────────────────────────────

function InviteButton({
  invite,
}: {
  invite: ReturnType<typeof useStudyGroup>["invite"]
}) {
  const [busy, setBusy] = useState(false)

  async function mintCode() {
    setBusy(true)
    const r = await invite()
    setBusy(false)
    if (r.ok && r.code) {
      try {
        await navigator.clipboard.writeText(r.code)
        toast.success(`Invite code ${r.code} copied to clipboard`)
      } catch {
        toast.success(`Invite code: ${r.code}`)
      }
    } else {
      toast.error(r.error ?? "Could not create invite.")
    }
  }

  return (
    <button
      type="button"
      onClick={mintCode}
      disabled={busy}
      className="flex items-center gap-1 rounded-full border border-border px-3 py-1 text-xs font-medium hover:bg-accent/30 disabled:opacity-50"
    >
      <Link2 className="size-3" /> {busy ? "…" : "Invite"}
    </button>
  )
}

// ── Shared bits ──────────────────────────────────────────────────────────────

function Avatar({
  member,
  size = 28,
}: {
  member: { displayName: string; username: string; avatarUrl: string | null }
  size?: number
}) {
  const seed = encodeURIComponent(member.username)
  const src =
    member.avatarUrl ??
    `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=2A4B8D&textColor=C8A24B&fontSize=40`
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full border border-[#C8A24B]/20"
    />
  )
}

function RoleIcon({ role }: { role: StudyGroupMember["role"] }) {
  if (role === "owner")
    return <Crown className="size-3" style={{ color: GOLD }} />
  if (role === "moderator")
    return <Shield className="size-3" style={{ color: LAPIS }} />
  return null
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div>
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {title}
      </h3>
      {children}
    </div>
  )
}

function CenteredNote({
  title,
  action,
}: {
  title: string
  action: { href: string; label: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <Users className="size-8 text-muted-foreground/30" />
      <p className="text-sm text-muted-foreground">{title}</p>
      <Link
        href={action.href}
        className="text-xs text-muted-foreground hover:text-foreground"
      >
        ← {action.label}
      </Link>
    </div>
  )
}

function timeAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return "just now"
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}
