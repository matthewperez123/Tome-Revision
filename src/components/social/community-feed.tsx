"use client"

import { useState } from "react"
import Link from "next/link"
import {
  BookOpen,
  CheckCircle2,
  Flag,
  Flame,
  Lightbulb,
  PartyPopper,
  ScrollText,
  Trophy,
  Users,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { BlurFade } from "@/components/ui/blur-fade"
import {
  useCommunityFeed,
  type FeedItem,
  type FeedScope,
} from "@/hooks/use-community-feed"
import type { ActivityType, ReactionKind } from "@/lib/actions/activities"
import { cn } from "@/lib/utils"

// ── RUBRIC palette ──────────────────────────────────────────────────────────
const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"
const VERDIGRIS = "#2E7D6F"

const TYPE_META: Record<
  ActivityType,
  { icon: typeof BookOpen; color: string; verb: string }
> = {
  book_started: { icon: BookOpen, color: LAPIS, verb: "started reading" },
  book_completed: { icon: CheckCircle2, color: GOLD, verb: "finished" },
  trial_passed: { icon: Trophy, color: VERDIGRIS, verb: "passed a Trial in" },
  seal_earned: { icon: ScrollText, color: GOLD, verb: "earned a Seal" },
  club_joined: { icon: Users, color: LAPIS, verb: "joined a book club" },
  session_completed: { icon: ScrollText, color: VERDIGRIS, verb: "completed a guided session" },
}

const REACTION_META: Record<ReactionKind, { icon: typeof Flame; label: string }> = {
  cheer: { icon: PartyPopper, label: "Cheer" },
  insight: { icon: Lightbulb, label: "Insight" },
  same: { icon: BookOpen, label: "Reading too" },
  inspired: { icon: Flame, label: "Inspired" },
}

const REACTION_ORDER: ReactionKind[] = ["cheer", "insight", "same", "inspired"]

function timeAgo(d: Date): string {
  const secs = Math.floor((Date.now() - d.getTime()) / 1000)
  if (secs < 60) return "just now"
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  const weeks = Math.floor(days / 7)
  return `${weeks}w ago`
}

export function CommunityFeed() {
  const feed = useCommunityFeed()

  if (feed.mode === "demo") {
    return (
      <EmptyState
        title="Sign in to see the Community"
        body="Connect with fellow readers and follow their journey through the classics."
      />
    )
  }

  return (
    <div className="space-y-4">
      {/* Friends / Public toggle */}
      <div
        className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 p-0.5"
        role="tablist"
        aria-label="Feed scope"
      >
        <ScopeTab scope="friends" active={feed.scope} onSelect={feed.setScope} label="Friends" />
        {feed.publicAvailable && (
          <ScopeTab scope="public" active={feed.scope} onSelect={feed.setScope} label="Public" />
        )}
      </div>

      {feed.loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-muted/30" />
          ))}
        </div>
      ) : feed.items.length === 0 ? (
        <EmptyState
          title={feed.scope === "friends" ? "No reading activity yet" : "No public activity yet"}
          body={
            feed.scope === "friends"
              ? "Add friends to see their reading here."
              : "When readers share milestones publicly, they'll appear here."
          }
        />
      ) : (
        <div className="space-y-2">
          {feed.items.map((item, i) => (
            <BlurFade key={item.id} delay={0.03 + i * 0.03} inView>
              <FeedRow
                item={item}
                onReact={feed.react}
                onUnreact={feed.unreact}
                onReport={feed.report}
              />
            </BlurFade>
          ))}
        </div>
      )}
    </div>
  )
}

function ScopeTab({
  scope,
  active,
  onSelect,
  label,
}: {
  scope: FeedScope
  active: FeedScope
  onSelect: (s: FeedScope) => void
  label: string
}) {
  const isActive = active === scope
  return (
    <button
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(scope)}
      className={cn(
        "rounded-full px-3.5 py-1 text-xs font-medium transition-colors",
        isActive
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  )
}

function FeedRow({
  item,
  onReact,
  onUnreact,
  onReport,
}: {
  item: FeedItem
  onReact: (id: string, kind: ReactionKind) => Promise<void>
  onUnreact: (id: string, kind: ReactionKind) => Promise<void>
  onReport: (id: string, reason: string) => Promise<{ ok: boolean; error?: string }>
}) {
  const [reporting, setReporting] = useState(false)
  const meta = TYPE_META[item.type]
  const Icon = meta.icon

  const reactionFor = (kind: ReactionKind) =>
    item.reactions.find((r) => r.kind === kind)

  async function toggle(kind: ReactionKind) {
    const existing = reactionFor(kind)
    if (existing?.mine) await onUnreact(item.id, kind)
    else await onReact(item.id, kind)
  }

  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.actor.avatarUrl}
          alt=""
          className="size-8 shrink-0 rounded-full border border-[#C8A24B]/20"
        />

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="text-xs leading-relaxed">
            <Link
              href={`/profile/${item.actor.username}`}
              className="font-semibold hover:underline"
            >
              {item.actor.displayName}
            </Link>{" "}
            <span className="text-muted-foreground">{meta.verb}</span>
            {item.bookId && item.bookTitle && (
              <>
                {" "}
                <Link
                  href={`/book/${item.bookId}`}
                  className="font-medium text-foreground hover:underline"
                >
                  {item.bookTitle}
                </Link>
              </>
            )}
          </p>

          {/* Meta row: type chip + time */}
          <div className="mt-1 flex items-center gap-1.5">
            <span
              className="flex size-4 items-center justify-center rounded"
              style={{ backgroundColor: `${meta.color}20` }}
            >
              <Icon className="size-2.5" style={{ color: meta.color }} />
            </span>
            <span className="text-[10px] text-muted-foreground/60">{timeAgo(item.createdAt)}</span>
          </div>

          {/* Reactions */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {REACTION_ORDER.map((kind) => {
              const r = reactionFor(kind)
              const RIcon = REACTION_META[kind].icon
              const mine = !!r?.mine
              const count = r?.count ?? 0
              return (
                <button
                  key={kind}
                  type="button"
                  onClick={() => toggle(kind)}
                  aria-pressed={mine}
                  aria-label={REACTION_META[kind].label}
                  title={REACTION_META[kind].label}
                  className={cn(
                    "flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] transition-colors",
                    mine
                      ? "border-[#2A4B8D]/40 bg-[#2A4B8D]/10 text-[#2A4B8D] dark:text-[#9bb4e8]"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30",
                  )}
                >
                  <RIcon className="size-3" />
                  {count > 0 && <span className="tabular-nums">{count}</span>}
                </button>
              )
            })}
          </div>
        </div>

        {/* Report */}
        <button
          type="button"
          onClick={() => setReporting((v) => !v)}
          aria-label="Report this activity"
          className="shrink-0 rounded-full p-1 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
        >
          <Flag className="size-3.5" />
        </button>
      </div>

      {reporting && (
        <ReportForm
          onCancel={() => setReporting(false)}
          onSubmit={async (reason) => {
            const result = await onReport(item.id, reason)
            if (result.ok) {
              toast.success("Report submitted. Thank you.")
              setReporting(false)
            } else {
              toast.error(result.error ?? "Could not submit report.")
            }
          }}
        />
      )}
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
    <div className="mt-3 space-y-2 rounded-lg border border-border bg-muted/30 p-2.5">
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-medium text-muted-foreground">Report this activity</p>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel report"
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
        className="w-full resize-none rounded-md border border-border bg-background px-2 py-1.5 text-xs shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#C8553D]"
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

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-border py-12 text-center">
      <Users className="size-6 text-muted-foreground/40" />
      <p className="text-sm font-medium">{title}</p>
      <p className="max-w-xs text-xs text-muted-foreground">{body}</p>
    </div>
  )
}
