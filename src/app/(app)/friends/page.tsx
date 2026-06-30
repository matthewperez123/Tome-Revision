"use client"

import { useState } from "react"
import {
  UserPlus,
  Check,
  X,
  HeartHandshake,
  Clock,
  Copy,
  CheckCircle2,
  UserMinus,
  Ban,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import {
  useFriendsData,
  type FriendItem,
  type RequestItem,
} from "@/hooks/use-friends-data"

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

export default function FriendsPage() {
  const {
    mode,
    loading,
    myFriendCode,
    friends,
    incoming,
    outgoing,
    addByQuery,
    accept,
    decline,
    unfriend,
    block,
  } = useFriendsData()

  const [query, setQuery] = useState("")
  const [adding, setAdding] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (trimmed.length < 2) {
      toast.error("Enter a handle or friend code.")
      return
    }
    setAdding(true)
    try {
      const result = await addByQuery(trimmed)
      if (result.ok) {
        toast.success(`Friend request sent to ${result.name ?? "reader"}.`)
        setQuery("")
      } else {
        toast.error(result.error ?? "Couldn't send that request.")
      }
    } finally {
      setAdding(false)
    }
  }

  function copyCode() {
    if (!myFriendCode) return
    navigator.clipboard.writeText(myFriendCode)
    setCopied(true)
    toast.success("Friend code copied.")
    setTimeout(() => setCopied(false), 1600)
  }

  if (mode === "demo") {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <Header friendCount={0} />
        <BlurFade delay={0.06} inView>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
            <div
              className="mb-4 flex size-14 items-center justify-center rounded-full font-serif text-xl font-bold"
              style={{ background: "rgba(42,75,141,0.1)", color: "#2A4B8D" }}
            >
              V
            </div>
            <h2 className="font-serif text-lg font-semibold">
              Sign in to find your fellow readers
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Friends, requests, and your shareable friend code live in your
              account. Create one to start building your reading circle.
            </p>
          </div>
        </BlurFade>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <Header friendCount={friends.length} />

      {/* Add friend + my code */}
      <BlurFade delay={0.05} inView>
        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <form onSubmit={handleAdd} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Add by @handle or friend code"
              className="h-10 flex-1 focus-visible:border-[#2A4B8D]"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={adding}
              className="h-10 gap-1.5"
              style={{ background: "#2A4B8D" }}
            >
              <UserPlus className="size-4" />
              {adding ? "Sending…" : "Add friend"}
            </Button>
          </form>
          {myFriendCode && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Your friend code:</span>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-sm font-semibold tracking-widest text-foreground transition-colors hover:border-[#C8A24B]"
                title="Copy friend code"
              >
                {myFriendCode}
                {copied ? (
                  <CheckCircle2 className="size-3.5 text-[#2E7D6F]" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
              <span className="hidden sm:inline">— share it to get added.</span>
            </div>
          )}
        </div>
      </BlurFade>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading your circle…
        </div>
      ) : (
        <div className="space-y-10">
          {/* Incoming requests */}
          {incoming.length > 0 && (
            <Section
              title="Incoming requests"
              count={incoming.length}
              accent="#C8A24B"
            >
              <div className="space-y-3">
                {incoming.map((req) => (
                  <IncomingCard
                    key={req.friendshipId}
                    req={req}
                    onAccept={() => handleAccept(req, accept)}
                    onDecline={() => decline(req.friendshipId)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Outgoing requests */}
          {outgoing.length > 0 && (
            <Section
              title="Pending sent"
              count={outgoing.length}
              accent="#2A4B8D"
            >
              <div className="space-y-3">
                {outgoing.map((req) => (
                  <OutgoingCard
                    key={req.friendshipId}
                    req={req}
                    onCancel={() => unfriend(req.friendshipId)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Friends */}
          <Section title="Friends" count={friends.length} accent="#2E7D6F">
            {friends.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-14 text-center">
                <HeartHandshake className="mb-3 size-7 text-muted-foreground/60" />
                <p className="text-sm text-muted-foreground">
                  No friends yet. Share your code or add someone by their handle.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {friends.map((friend) => (
                  <FriendCard
                    key={friend.friendshipId}
                    friend={friend}
                    onUnfriend={() => unfriend(friend.friendshipId)}
                    onBlock={() => block(friend.friendshipId)}
                  />
                ))}
              </div>
            )}
          </Section>
        </div>
      )}
    </div>
  )

  async function handleAccept(
    req: RequestItem,
    acceptFn: (id: string) => Promise<void>,
  ) {
    await acceptFn(req.friendshipId)
    toast.success(`You're now friends with ${req.profile.displayName}.`)
  }
}

function Header({ friendCount }: { friendCount: number }) {
  return (
    <BlurFade delay={0.04} inView>
      <div className="mb-6 flex items-center gap-2.5">
        <HeartHandshake className="size-6 shrink-0 text-foreground" />
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">
            Friends
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {friendCount === 0
              ? "Build your reading circle"
              : `${friendCount} ${friendCount === 1 ? "friend" : "friends"}`}
          </p>
        </div>
      </div>
    </BlurFade>
  )
}

function Section({
  title,
  count,
  accent,
  children,
}: {
  title: string
  count: number
  accent: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
          {title}
        </h2>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold"
          style={{ background: `${accent}1a`, color: accent }}
        >
          {count}
        </span>
      </div>
      {children}
    </section>
  )
}

function Avatar({ url, name }: { url: string; name: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt={name}
      className="size-11 shrink-0 rounded-full border border-[#C8A24B]/25"
    />
  )
}

function IncomingCard({
  req,
  onAccept,
  onDecline,
}: {
  req: RequestItem
  onAccept: () => void
  onDecline: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Avatar url={req.profile.avatarUrl} name={req.profile.displayName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {req.profile.displayName}
        </p>
        <p className="text-[11px] text-muted-foreground">
          @{req.profile.username} · {timeAgo(req.sentAt)}
        </p>
      </div>
      <div className="flex items-center gap-1.5">
        <Button
          size="sm"
          className="h-8 gap-1 text-xs"
          style={{ background: "#2E7D6F" }}
          onClick={onAccept}
        >
          <Check className="size-3.5" /> Accept
        </Button>
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs text-muted-foreground"
          onClick={onDecline}
          title="Decline"
        >
          <X className="size-3.5" />
        </Button>
      </div>
    </div>
  )
}

function OutgoingCard({
  req,
  onCancel,
}: {
  req: RequestItem
  onCancel: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Avatar url={req.profile.avatarUrl} name={req.profile.displayName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {req.profile.displayName}
        </p>
        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="size-3" /> Sent {timeAgo(req.sentAt)}
        </p>
      </div>
      <Button
        size="sm"
        variant="ghost"
        className="h-8 text-xs text-muted-foreground"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  )
}

function FriendCard({
  friend,
  onUnfriend,
  onBlock,
}: {
  friend: FriendItem
  onUnfriend: () => void
  onBlock: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  return (
    <div className="group relative flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-[#2A4B8D]/30">
      <Avatar url={friend.profile.avatarUrl} name={friend.profile.displayName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {friend.profile.displayName}
        </p>
        <p className="text-[11px] text-muted-foreground">
          @{friend.profile.username}
        </p>
      </div>
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="rounded-md px-2 py-1 text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
          aria-label="Friend options"
        >
          ⋯
        </button>
        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-50 mt-1 w-40 overflow-hidden rounded-lg border border-border bg-card shadow-xl">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onUnfriend()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-foreground hover:bg-muted"
              >
                <UserMinus className="size-3.5" /> Unfriend
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onBlock()
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs text-[#C8553D] hover:bg-muted"
              >
                <Ban className="size-3.5" /> Block
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
