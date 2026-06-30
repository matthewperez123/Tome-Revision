"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import {
  BookOpen,
  Calendar,
  ChevronLeft,
  Crown,
  Flag,
  Link2,
  MessageSquare,
  Plus,
  Send,
  Shield,
  Trash2,
  UserMinus,
  Users,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import {
  useClub,
  type ClubMember,
  type ClubPost,
} from "@/hooks/use-club"
import type { MemberProgress } from "@/lib/actions/groups"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"

export default function ClubDetailPage() {
  const params = useParams()
  const clubId = params.clubId as string
  const club = useClub(clubId)

  if (club.mode === "demo") {
    return (
      <CenteredNote
        title="Sign in to view this club"
        action={{ href: "/clubs", label: "Back to clubs" }}
      />
    )
  }

  if (club.loading && !club.meta) {
    return (
      <div className="flex h-[calc(100vh-3rem)] items-center justify-center">
        <div className="h-24 w-64 animate-pulse rounded-xl border border-border bg-muted/30" />
      </div>
    )
  }

  if (club.notFound || !club.meta) {
    return (
      <CenteredNote
        title="Club not found"
        action={{ href: "/clubs", label: "Back to clubs" }}
      />
    )
  }

  const meta = club.meta

  return (
    <div className="flex h-[calc(100vh-3rem)] flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border p-4 md:p-6">
        <Link
          href="/clubs"
          className="mb-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" /> Back to clubs
        </Link>
        <div className="flex items-start gap-4">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-xl text-white"
            style={{ backgroundColor: meta.cover ?? LAPIS }}
          >
            <BookOpen className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="font-display text-lg font-semibold tracking-tight">
              {meta.name}
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {meta.bookId && meta.bookTitle ? (
                <Link href={`/book/${meta.bookId}`} className="hover:underline">
                  {meta.bookTitle}
                </Link>
              ) : (
                "No book set"
              )}{" "}
              · {club.members.length} members · {meta.privacy}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {club.isModerator && <InviteButton invite={club.invite} />}
            {club.isMember ? (
              club.myRole !== "owner" && (
                <button
                  type="button"
                  onClick={async () => {
                    const r = await club.leave()
                    if (r.ok) toast.success("Left the club")
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
                  const r = await club.join()
                  if (r.ok) toast.success("Joined the club")
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
          defaultValue="discussion"
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="shrink-0 px-4 pt-2">
            <TabsList>
              <TabsTrigger value="discussion">Discussion</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="schedule">Schedule</TabsTrigger>
              <TabsTrigger value="progress">Progress</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
          </div>

          {/* Discussion */}
          <TabsContent
            value="discussion"
            className="flex flex-1 flex-col overflow-hidden"
          >
            <DiscussionTab club={club} />
          </TabsContent>

          {/* Members */}
          <TabsContent value="members" className="flex-1 overflow-y-auto p-4">
            <MembersTab club={club} />
          </TabsContent>

          {/* Schedule */}
          <TabsContent value="schedule" className="flex-1 overflow-y-auto p-4">
            <ScheduleTab club={club} />
          </TabsContent>

          {/* Progress */}
          <TabsContent value="progress" className="flex-1 overflow-y-auto p-4">
            <ProgressTab progress={club.progress} isMember={club.isMember} />
          </TabsContent>

          {/* About */}
          <TabsContent value="about" className="flex-1 overflow-y-auto p-4">
            <div className="max-w-lg space-y-6">
              <Section title="Description">
                <p className="text-sm leading-relaxed">
                  {meta.description || "No description yet."}
                </p>
              </Section>
              {meta.bookTitle && (
                <Section title="Book">
                  <Link
                    href={`/book/${meta.bookId}`}
                    className="text-sm hover:underline"
                  >
                    {meta.bookTitle}
                  </Link>
                </Section>
              )}
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
                  <p>{club.members.length}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// ── Discussion ───────────────────────────────────────────────────────────────

function DiscussionTab({ club }: { club: ReturnType<typeof useClub> }) {
  const [message, setMessage] = useState("")
  const [sending, setSending] = useState(false)

  async function send() {
    if (!message.trim()) return
    setSending(true)
    const r = await club.post(message.trim())
    setSending(false)
    if (r.ok) setMessage("")
    else toast.error(r.error ?? "Could not post.")
  }

  return (
    <>
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {club.posts.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <MessageSquare className="mb-3 size-8 text-muted-foreground/20" />
            <p className="text-sm text-muted-foreground">
              No discussion yet. Start the conversation.
            </p>
          </div>
        ) : (
          club.posts.map((post) => (
            <PostThread key={post.id} post={post} club={club} />
          ))
        )}
      </div>
      {club.isMember && (
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
  club,
}: {
  post: ClubPost
  club: ReturnType<typeof useClub>
}) {
  const [replying, setReplying] = useState(false)
  const [reply, setReply] = useState("")

  async function sendReply() {
    if (!reply.trim()) return
    const r = await club.post(reply.trim(), post.id)
    if (r.ok) {
      setReply("")
      setReplying(false)
    } else {
      toast.error(r.error ?? "Could not reply.")
    }
  }

  return (
    <div className="space-y-2">
      <PostRow post={post} club={club} onReply={() => setReplying((v) => !v)} />
      {post.replies.length > 0 && (
        <div className="ml-9 space-y-2 border-l border-border pl-3">
          {post.replies.map((r) => (
            <PostRow key={r.id} post={r} club={club} />
          ))}
        </div>
      )}
      {replying && club.isMember && (
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
  club,
  onReply,
}: {
  post: ClubPost
  club: ReturnType<typeof useClub>
  onReply?: () => void
}) {
  const { user } = useAuth()
  const [reporting, setReporting] = useState(false)
  const mine = user?.id === post.author.id
  const canDelete = mine || club.isModerator

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
          {onReply && club.isMember && (
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
                const r = await club.deletePost(post.id)
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
              const r = await club.reportPost(post.id, reason)
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

function MembersTab({ club }: { club: ReturnType<typeof useClub> }) {
  const { user } = useAuth()
  if (club.members.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-muted-foreground">
        No members yet.
      </p>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
      {club.members.map((m) => (
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
          {club.isModerator && m.role !== "owner" && m.userId !== user?.id && (
            <div className="flex gap-1">
              <button
                type="button"
                onClick={async () => {
                  const next = m.role === "moderator" ? "member" : "moderator"
                  const r = await club.setRole(m.userId, next)
                  if (!r.ok) toast.error(r.error ?? "Failed.")
                }}
                className="rounded border border-border px-1.5 py-0.5 text-[9px] hover:bg-accent/30"
              >
                {m.role === "moderator" ? "Demote" : "Promote"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  const r = await club.kick(m.userId)
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

// ── Schedule ─────────────────────────────────────────────────────────────────

function ScheduleTab({ club }: { club: ReturnType<typeof useClub> }) {
  const [adding, setAdding] = useState(false)
  const [label, setLabel] = useState("")
  const [unit, setUnit] = useState("")
  const [date, setDate] = useState("")

  async function add() {
    if (!label.trim()) return
    const r = await club.addSchedule({
      label: label.trim(),
      chapterOrSection: unit.trim() || undefined,
      targetDate: date || undefined,
    })
    if (r.ok) {
      setLabel("")
      setUnit("")
      setDate("")
      setAdding(false)
    } else {
      toast.error(r.error ?? "Could not add milestone.")
    }
  }

  return (
    <div className="max-w-lg space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Reading schedule
        </h3>
        {club.isModerator && (
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-1 rounded-full border border-border px-2 py-0.5 text-[10px] hover:bg-accent/30"
          >
            <Plus className="size-2.5" /> Milestone
          </button>
        )}
      </div>

      {adding && (
        <div className="space-y-2 rounded-xl border border-border bg-muted/20 p-3">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Milestone label (e.g. Books I–IV)"
            className="h-8 w-full rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <div className="flex gap-2">
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Chapter / section"
              className="h-8 flex-1 rounded-md border bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={add}
              disabled={!label.trim()}
              className="rounded-full bg-foreground px-3 py-1 text-[11px] font-medium text-background disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>
      )}

      {club.schedule.length === 0 ? (
        <div className="py-12 text-center">
          <Calendar className="mx-auto mb-3 size-8 text-muted-foreground/20" />
          <p className="text-sm text-muted-foreground">No reading schedule set</p>
          {club.isModerator && (
            <p className="mt-1 text-xs text-muted-foreground">
              Add milestones to set a shared pace.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {club.schedule.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border bg-card p-4"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{s.label}</p>
                <p className="text-[10px] text-muted-foreground">
                  {s.chapterOrSection ?? ""}
                  {s.chapterOrSection && s.targetDate ? " · " : ""}
                  {s.targetDate
                    ? s.targetDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>
              {club.isModerator && (
                <button
                  type="button"
                  onClick={async () => {
                    const r = await club.removeSchedule(s.id)
                    if (!r.ok) toast.error(r.error ?? "Failed.")
                  }}
                  className="rounded-full p-1 text-muted-foreground/60 hover:text-[#C8553D]"
                >
                  <Trash2 className="size-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Progress ─────────────────────────────────────────────────────────────────

function ProgressTab({
  progress,
  isMember,
}: {
  progress: MemberProgress[]
  isMember: boolean
}) {
  if (!isMember) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        Join the club to see member progress.
      </p>
    )
  }
  if (progress.length === 0) {
    return (
      <p className="py-12 text-center text-sm text-muted-foreground">
        No reading progress yet.
      </p>
    )
  }
  return (
    <div className="max-w-lg space-y-2">
      <h3 className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Where everyone is
      </h3>
      {progress.map((p) => (
        <div
          key={p.userId}
          className="flex items-center gap-3 rounded-xl border bg-card p-3"
        >
          <Avatar
            member={{
              displayName: p.displayName,
              username: p.username,
              avatarUrl: p.avatarUrl,
            }}
            size={36}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-sm font-medium">
                {p.displayName}
              </span>
              <RoleIcon role={p.role} />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {p.chapterIndex !== null
                ? `Chapter ${p.chapterIndex + 1}`
                : "Not started"}
              {p.updatedAt &&
                ` · ${timeAgo(new Date(p.updatedAt))}`}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Invite ───────────────────────────────────────────────────────────────────

function InviteButton({
  invite,
}: {
  invite: ReturnType<typeof useClub>["invite"]
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

function RoleIcon({ role }: { role: ClubMember["role"] }) {
  if (role === "owner") return <Crown className="size-3" style={{ color: GOLD }} />
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
