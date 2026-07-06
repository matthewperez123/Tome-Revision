"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  MessageCircle,
  Plus,
  Send,
  ArrowLeft,
  Loader2,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useConversations, type ConversationSummary } from "@/hooks/use-conversations"
import { useConversation } from "@/hooks/use-conversation"
import {
  listMessagingContacts,
  startConversation,
  type MessagingClassroomContacts,
} from "@/lib/actions/messages"
import { RUBRIC } from "@/lib/semester-plan/rubric"

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex max-w-5xl items-center justify-center py-24">
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <MessagesInner />
    </Suspense>
  )
}

function MessagesInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, isDemoMode } = useAuth()
  const { conversations, loading, refresh } = useConversations()
  const selectedId = searchParams.get("c")
  const [composing, setComposing] = useState(false)

  const select = (id: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id) params.set("c", id)
    else params.delete("c")
    router.replace(`/messages${params.toString() ? `?${params}` : ""}`)
    setComposing(false)
  }

  if (isDemoMode || !user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted">
          <MessageCircle className="size-7 text-muted-foreground" />
        </div>
        <h1 className="mt-4 text-lg font-semibold">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Sign in to message your teachers and classmates.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="flex items-center gap-2.5">
        <MessageCircle className="size-6 shrink-0 text-foreground" />
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-[320px_1fr]">
        {/* List pane — hidden on mobile when a thread is open. */}
        <div
          className={`${selectedId || composing ? "hidden md:block" : "block"}`}
        >
          <Button
            onClick={() => {
              setComposing(true)
              select(null)
            }}
            size="sm"
            className="mb-3 w-full gap-1.5 text-white"
            style={{ backgroundColor: RUBRIC.lapis }}
          >
            <Plus className="size-4" />
            New message
          </Button>
          <ConversationList
            conversations={conversations}
            loading={loading}
            selectedId={selectedId}
            onSelect={select}
          />
        </div>

        {/* Detail pane. */}
        <div
          className={`${selectedId || composing ? "block" : "hidden md:block"}`}
        >
          {composing ? (
            <ComposeNew
              onBack={() => setComposing(false)}
              onStarted={(id) => {
                setComposing(false)
                refresh()
                select(id)
              }}
            />
          ) : selectedId ? (
            <Thread
              conversation={conversations.find((c) => c.id === selectedId)}
              conversationId={selectedId}
              onBack={() => select(null)}
            />
          ) : (
            <div className="hidden h-full min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-border text-center md:flex">
              <MessageCircle className="size-8 text-muted-foreground" />
              <p className="mt-3 text-sm text-muted-foreground">
                Select a conversation or start a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ConversationList({
  conversations,
  loading,
  selectedId,
  onSelect,
}: {
  conversations: ConversationSummary[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-16 animate-pulse rounded-xl bg-muted" />
        ))}
      </div>
    )
  }
  if (conversations.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        No conversations yet.
      </div>
    )
  }
  return (
    <div className="space-y-1.5">
      {conversations.map((c) => {
        const title =
          c.subject ||
          c.participants.map((p) => p.displayName).join(", ") ||
          "Conversation"
        const active = c.id === selectedId
        return (
          <button
            key={c.id}
            onClick={() => onSelect(c.id)}
            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${
              active
                ? "border-transparent"
                : "border-border hover:bg-muted/60"
            }`}
            style={
              active ? { backgroundColor: `${RUBRIC.lapis}14` } : undefined
            }
          >
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
              {initials(c.participants[0]?.displayName ?? "?")}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-medium">{title}</p>
                {c.unread && (
                  <span
                    className="ml-auto inline-block size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: RUBRIC.vermilion }}
                    aria-label="Unread"
                  />
                )}
              </div>
              <p className="truncate text-xs text-muted-foreground">
                {c.lastMessage ?? "No messages yet"}
              </p>
            </div>
          </button>
        )
      })}
    </div>
  )
}

function Thread({
  conversation,
  conversationId,
  onBack,
}: {
  conversation: ConversationSummary | undefined
  conversationId: string
  onBack: () => void
}) {
  const { messages, loading, sending, send } = useConversation(conversationId)
  const [draft, setDraft] = useState("")
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const title =
    conversation?.subject ||
    conversation?.participants.map((p) => p.displayName).join(", ") ||
    "Conversation"

  const submit = async () => {
    const body = draft.trim()
    if (!body) return
    const okSend = await send(body)
    if (okSend) setDraft("")
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[400px] flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="md:hidden"
          aria-label="Back to conversations"
        >
          <ArrowLeft className="size-5 text-muted-foreground" />
        </button>
        <p className="truncate text-sm font-semibold">{title}</p>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : messages.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No messages yet. Say hello.
          </p>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.mine ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                  m.mine ? "text-white" : "bg-muted text-foreground"
                }`}
                style={m.mine ? { backgroundColor: RUBRIC.lapis } : undefined}
              >
                {!m.mine && (
                  <p className="mb-0.5 text-[11px] font-medium opacity-70">
                    {m.senderName}
                  </p>
                )}
                <p className="whitespace-pre-wrap break-words">{m.body}</p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-end gap-2 border-t border-border p-3">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              submit()
            }
          }}
          rows={1}
          placeholder="Write a message…"
          className="max-h-32 flex-1 resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
          style={{ ["--tw-ring-color" as string]: RUBRIC.lapis }}
        />
        <Button
          onClick={submit}
          disabled={!draft.trim() || sending}
          size="icon"
          className="text-white"
          style={{ backgroundColor: RUBRIC.lapis }}
          aria-label="Send"
        >
          {sending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
        </Button>
      </div>
    </div>
  )
}

function ComposeNew({
  onBack,
  onStarted,
}: {
  onBack: () => void
  onStarted: (conversationId: string) => void
}) {
  const [groups, setGroups] = useState<MessagingClassroomContacts[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [body, setBody] = useState("")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    listMessagingContacts()
      .then((g) => {
        if (!cancelled) {
          setGroups(g)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  // A recipient maps to the classroom it was selected from (RPC needs a
  // classroom for the shares_classroom check to succeed).
  const classroomForContact = useMemo(() => {
    const map = new Map<string, string>()
    for (const g of groups) {
      for (const c of g.contacts) {
        if (!map.has(c.id)) map.set(c.id, g.classroomId)
      }
    }
    return map
  }, [groups])

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const submit = async () => {
    if (selected.size === 0 || !body.trim()) return
    setSending(true)
    setError(null)
    const recipientIds = Array.from(selected)
    const classroomId = classroomForContact.get(recipientIds[0]) ?? null
    const res = await startConversation({
      classroomId,
      recipientIds,
      firstMessage: body.trim(),
    })
    setSending(false)
    if (res.ok) onStarted(res.data.conversationId)
    else setError(res.error)
  }

  return (
    <div className="flex h-[calc(100vh-220px)] min-h-[400px] flex-col rounded-2xl border border-border bg-card">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <button onClick={onBack} className="md:hidden" aria-label="Back">
          <ArrowLeft className="size-5 text-muted-foreground" />
        </button>
        <p className="text-sm font-semibold">New message</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : groups.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Users className="size-7 text-muted-foreground" />
            <p className="mt-3 text-sm text-muted-foreground">
              No classmates to message yet. Join or create a classroom first.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {groups.map((g) => (
              <div key={g.classroomId}>
                <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {g.classroomName}
                </p>
                <div className="space-y-1">
                  {g.contacts.map((c) => (
                    <label
                      key={`${g.classroomId}:${c.id}`}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted/60"
                    >
                      <input
                        type="checkbox"
                        checked={selected.has(c.id)}
                        onChange={() => toggle(c.id)}
                        className="size-4 accent-[color:var(--lapis)]"
                        style={{ ["--lapis" as string]: RUBRIC.lapis }}
                      />
                      <div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {initials(c.displayName)}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{c.displayName}</p>
                        {c.role && (
                          <p className="text-[11px] capitalize text-muted-foreground">
                            {c.role}
                          </p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {groups.length > 0 && (
        <div className="border-t border-border p-3">
          {error && (
            <p className="mb-2 text-xs" style={{ color: RUBRIC.vermilion }}>
              {error}
            </p>
          )}
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={2}
            placeholder="Write your message…"
            className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2"
            style={{ ["--tw-ring-color" as string]: RUBRIC.lapis }}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {selected.size} selected
            </span>
            <Button
              onClick={submit}
              disabled={selected.size === 0 || !body.trim() || sending}
              size="sm"
              className="gap-1.5 text-white"
              style={{ backgroundColor: RUBRIC.lapis }}
            >
              {sending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Send className="size-4" />
              )}
              Send
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
}
