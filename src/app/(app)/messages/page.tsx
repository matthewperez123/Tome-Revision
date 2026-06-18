"use client"

// Server-rendered dynamically: this page reads Supabase auth via useAuth /
// server actions, so it must not be statically prerendered at build time.
export const dynamic = "force-dynamic"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Plus, Send, ArrowLeft, Loader2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { useConversationMessages } from "@/hooks/use-conversation-messages"
import {
  listConversations,
  listMessageableUsers,
  startConversation,
  type ConversationSummary,
  type MessageableUser,
} from "@/lib/actions/messages"

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d`
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export default function MessagesPage() {
  const { user, isLoading } = useAuth()
  const [conversations, setConversations] = useState<ConversationSummary[]>([])
  const [loadingList, setLoadingList] = useState(true)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [composing, setComposing] = useState(false)

  const refreshList = useCallback(async () => {
    const data = await listConversations().catch(() => [])
    setConversations(data)
    setLoadingList(false)
  }, [])

  useEffect(() => {
    if (isLoading) return
    if (!user) {
      setLoadingList(false)
      return
    }
    refreshList()
  }, [isLoading, user, refreshList])

  const active = conversations.find((c) => c.id === activeId) ?? null

  if (!isLoading && !user) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-muted">
          <MessageCircle className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Sign in to view messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Correspondence with your classroom is available once you sign in.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto h-[calc(100svh-4rem)] max-w-5xl px-0 sm:px-4">
      <div className="grid h-full grid-cols-1 sm:grid-cols-[20rem_1fr]">
        {/* List pane */}
        <aside
          className={`flex h-full flex-col border-r border-border ${
            activeId ? "hidden sm:flex" : "flex"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-4">
            <h1 className="text-lg font-semibold">Messages</h1>
            <Button size="sm" className="gap-1.5" onClick={() => setComposing(true)}>
              <Plus className="size-4" />
              New
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loadingList ? (
              <div className="space-y-2 px-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
                ))}
              </div>
            ) : conversations.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-muted-foreground">
                No conversations yet. Start one with the New button.
              </div>
            ) : (
              <ul>
                {conversations.map((c) => {
                  const title =
                    c.subject ||
                    c.participants.map((p) => p.name).join(", ") ||
                    "Conversation"
                  const other = c.participants[0]
                  return (
                    <li key={c.id}>
                      <button
                        onClick={() => setActiveId(c.id)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-muted ${
                          activeId === c.id ? "bg-muted" : ""
                        }`}
                      >
                        <Avatar>
                          {other?.avatarUrl && <AvatarImage src={other.avatarUrl} />}
                          <AvatarFallback>
                            {other ? initials(other.name) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">{title}</span>
                            <span className="shrink-0 text-[11px] text-muted-foreground">
                              {relativeTime(c.lastMessageAt)}
                            </span>
                          </div>
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-xs text-muted-foreground">
                              {c.lastMessage?.body ?? "No messages yet"}
                            </span>
                            {c.unreadCount > 0 && (
                              <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[var(--tome-accent)] text-[10px] font-semibold text-white">
                                {c.unreadCount}
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </aside>

        {/* Thread pane */}
        <section className={`h-full ${activeId ? "flex" : "hidden sm:flex"} flex-col`}>
          {active ? (
            <Thread
              key={active.id}
              conversation={active}
              currentUserId={user?.id ?? ""}
              onBack={() => setActiveId(null)}
              onSent={refreshList}
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
              <MessageCircle className="size-10" />
              <p className="mt-3 text-sm">Select a conversation</p>
            </div>
          )}
        </section>
      </div>

      {composing && (
        <ComposeDialog
          onClose={() => setComposing(false)}
          onStarted={async (id) => {
            setComposing(false)
            await refreshList()
            setActiveId(id)
          }}
        />
      )}
    </div>
  )
}

function Thread({
  conversation,
  currentUserId,
  onBack,
  onSent,
}: {
  conversation: ConversationSummary
  currentUserId: string
  onBack: () => void
  onSent: () => void
}) {
  const { messages, loading, sending, send } = useConversationMessages(conversation.id)
  const [draft, setDraft] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages.length])

  const title =
    conversation.subject ||
    conversation.participants.map((p) => p.name).join(", ") ||
    "Conversation"

  const handleSend = useCallback(async () => {
    const body = draft.trim()
    if (!body) return
    const okSend = await send(body)
    if (okSend) {
      setDraft("")
      onSent()
    }
  }, [draft, send, onSent])

  return (
    <>
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="rounded-md p-1 text-muted-foreground hover:bg-muted sm:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{title}</p>
          {conversation.participants.length > 0 && (
            <p className="truncate text-xs text-muted-foreground">
              {conversation.participants.map((p) => p.name).join(", ")}
            </p>
          )}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages yet — say hello.
          </p>
        ) : (
          messages.map((m) => {
            const mine = m.senderId === currentUserId
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                    mine
                      ? "bg-[var(--tome-accent)] text-white"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{m.body}</p>
                  <span
                    className={`mt-1 block text-right text-[10px] ${
                      mine ? "text-white/70" : "text-muted-foreground"
                    }`}
                  >
                    {relativeTime(m.createdAt)}
                  </span>
                </div>
              </motion.div>
            )
          })
        )}
      </div>

      <form
        className="flex items-center gap-2 border-t border-border px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Write a message…"
          className="flex-1"
        />
        <Button type="submit" size="sm" disabled={sending || !draft.trim()} className="gap-1.5">
          {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
          Send
        </Button>
      </form>
    </>
  )
}

function ComposeDialog({
  onClose,
  onStarted,
}: {
  onClose: () => void
  onStarted: (conversationId: string) => void
}) {
  const [people, setPeople] = useState<MessageableUser[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [classroomId, setClassroomId] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [firstMessage, setFirstMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listMessageableUsers()
      .then((data) => setPeople(data))
      .catch(() => setPeople([]))
      .finally(() => setLoading(false))
  }, [])

  // Group people by classroom; only one classroom's recipients can be selected
  // at a time because start_conversation is scoped to a single classroom.
  const byClassroom = useMemo(() => {
    const map = new Map<string, { name: string; members: MessageableUser[] }>()
    for (const p of people) {
      const entry = map.get(p.classroomId) ?? { name: p.classroomName, members: [] }
      entry.members.push(p)
      map.set(p.classroomId, entry)
    }
    return map
  }, [people])

  const toggle = useCallback(
    (p: MessageableUser) => {
      setError(null)
      setSelected((prev) => {
        const next = new Set(prev)
        if (next.has(p.id)) {
          next.delete(p.id)
        } else {
          // Switching classroom resets the selection to keep recipients within one room.
          if (classroomId && classroomId !== p.classroomId) {
            next.clear()
          }
          next.add(p.id)
        }
        return next
      })
      setClassroomId((prev) => (prev === p.classroomId ? prev : p.classroomId))
    },
    [classroomId],
  )

  const handleStart = useCallback(async () => {
    if (!classroomId || selected.size === 0 || !firstMessage.trim()) return
    setSubmitting(true)
    setError(null)
    const res = await startConversation({
      classroomId,
      recipientIds: [...selected],
      subject: subject.trim() || undefined,
      firstMessage: firstMessage.trim(),
    })
    setSubmitting(false)
    if (res.ok) {
      onStarted(res.data.conversationId)
    } else {
      setError(res.error)
    }
  }, [classroomId, selected, subject, firstMessage, onStarted])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-base font-semibold">New conversation</h2>

        <div className="mt-4 max-h-52 overflow-y-auto rounded-xl border border-border">
          {loading ? (
            <div className="p-4 text-sm text-muted-foreground">Loading…</div>
          ) : people.length === 0 ? (
            <div className="p-4 text-sm text-muted-foreground">
              You can only message people in your classrooms. Join or create one first.
            </div>
          ) : (
            [...byClassroom.entries()].map(([cid, group]) => (
              <div key={cid}>
                <p className="bg-muted/50 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {group.name}
                </p>
                {group.members.map((p) => {
                  const checked = selected.has(p.id)
                  const dimmed = classroomId !== null && classroomId !== p.classroomId
                  return (
                    <button
                      key={`${cid}:${p.id}`}
                      onClick={() => toggle(p)}
                      className={`flex w-full items-center gap-2.5 px-3 py-2 text-left transition-colors hover:bg-muted ${
                        checked ? "bg-muted" : ""
                      } ${dimmed ? "opacity-40" : ""}`}
                    >
                      <Avatar size="sm">
                        {p.avatarUrl && <AvatarImage src={p.avatarUrl} />}
                        <AvatarFallback>{initials(p.name)}</AvatarFallback>
                      </Avatar>
                      <span className="flex-1 truncate text-sm">{p.name}</span>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {p.role}
                      </span>
                      <input type="checkbox" checked={checked} readOnly className="size-4" />
                    </button>
                  )
                })}
              </div>
            ))
          )}
        </div>

        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject (optional)"
          className="mt-3"
        />
        <textarea
          value={firstMessage}
          onChange={(e) => setFirstMessage(e.target.value)}
          placeholder="Write your first message…"
          rows={3}
          className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />

        {error && <p className="mt-2 text-sm text-[var(--tome-error)]">{error}</p>}

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={submitting || selected.size === 0 || !firstMessage.trim()}
            onClick={handleStart}
            className="gap-1.5"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Start
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
