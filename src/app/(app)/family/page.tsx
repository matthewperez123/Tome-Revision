"use client"

import { useState } from "react"
import {
  Users,
  UserPlus,
  Check,
  X,
  Clock,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Flame,
  BookOpen,
  Trophy,
  Sparkles,
  ChevronDown,
  Eye,
} from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getBook } from "@/lib/content"
import {
  useFamilyData,
  type ChildLink,
  type GuardianLink,
  type LinkRequest,
  type ChildActivityItem,
  type ChildAchievementItem,
} from "@/hooks/use-family-data"
import type { LinkRole } from "@/lib/actions/parent-links"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"
const VERDIGRIS = "#2E7D6F"
const VERMILION = "#C8553D"

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

function bookTitle(bookId: string | null): string | null {
  if (!bookId) return null
  return getBook(bookId)?.title ?? null
}

export default function FamilyPage() {
  const {
    mode,
    loading,
    myLinkCode,
    children,
    guardians,
    incoming,
    outgoing,
    link,
    confirm,
    cancel,
    revoke,
    loadChildDetail,
  } = useFamilyData()

  const [role, setRole] = useState<LinkRole>("parent")
  const [code, setCode] = useState("")
  const [linking, setLinking] = useState(false)
  const [copied, setCopied] = useState(false)

  async function handleLink(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = code.trim()
    if (trimmed.length < 4) {
      toast.error("Enter a link code.")
      return
    }
    setLinking(true)
    try {
      const result = await link(trimmed, role)
      if (result.ok) {
        toast.success(
          role === "parent"
            ? `Invite sent to ${result.name ?? "reader"} — they must confirm before you can see anything.`
            : `Invite sent to ${result.name ?? "reader"} — they must confirm to follow your reading.`,
        )
        setCode("")
      } else {
        toast.error(result.error ?? "Couldn't send that invite.")
      }
    } finally {
      setLinking(false)
    }
  }

  function copyCode() {
    if (!myLinkCode) return
    navigator.clipboard.writeText(myLinkCode)
    setCopied(true)
    toast.success("Link code copied.")
    setTimeout(() => setCopied(false), 1600)
  }

  if (mode === "demo") {
    return (
      <div className="mx-auto max-w-4xl p-4 md:p-6">
        <Header childCount={0} />
        <BlurFade delay={0.06} inView>
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card py-16 text-center">
            <div
              className="mb-4 flex size-14 items-center justify-center rounded-full"
              style={{ background: "rgba(42,75,141,0.1)", color: LAPIS }}
            >
              <Users className="size-7" />
            </div>
            <h2 className="font-serif text-lg font-semibold">
              Sign in to follow a reader&rsquo;s progress
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Family links let a parent or guardian follow a reader&rsquo;s
              progress — but only after that reader confirms. Create an account
              to get started.
            </p>
          </div>
        </BlurFade>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl p-4 md:p-6">
      <Header childCount={children.length} />

      {/* Link a reader + my code */}
      <BlurFade delay={0.05} inView>
        <div className="mb-8 rounded-2xl border border-border bg-card p-5">
          <div className="mb-3 inline-flex rounded-lg border border-border bg-muted/40 p-0.5 text-xs font-semibold">
            <button
              onClick={() => setRole("parent")}
              className="rounded-md px-3 py-1.5 transition-colors"
              style={
                role === "parent"
                  ? { background: LAPIS, color: "white" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              Follow my child
            </button>
            <button
              onClick={() => setRole("student")}
              className="rounded-md px-3 py-1.5 transition-colors"
              style={
                role === "student"
                  ? { background: LAPIS, color: "white" }
                  : { color: "var(--muted-foreground)" }
              }
            >
              Invite my guardian
            </button>
          </div>

          <form onSubmit={handleLink} className="flex flex-col gap-2 sm:flex-row">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={
                role === "parent"
                  ? "Enter your child's link code"
                  : "Enter your guardian's link code"
              }
              className="h-10 flex-1 font-mono tracking-widest focus-visible:border-[#2A4B8D]"
              autoComplete="off"
            />
            <Button
              type="submit"
              disabled={linking}
              className="h-10 gap-1.5"
              style={{ background: LAPIS }}
            >
              <UserPlus className="size-4" />
              {linking ? "Sending…" : "Send invite"}
            </Button>
          </form>

          <p className="mt-2 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted-foreground">
            <ShieldCheck
              className="mt-px size-3.5 shrink-0"
              style={{ color: VERDIGRIS }}
            />
            {role === "parent"
              ? "Following requires your child to confirm. You'll see their reading progress only — never their messages or friends — and they can revoke access anytime."
              : "Your guardian must confirm before anything is shared. They'll see your reading progress only, and you can revoke access anytime."}
          </p>

          {myLinkCode && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <span>Your link code:</span>
              <button
                onClick={copyCode}
                className="inline-flex items-center gap-1.5 rounded-md border border-border bg-muted/50 px-2 py-1 font-mono text-sm font-semibold tracking-widest text-foreground transition-colors hover:border-[#C8A24B]"
                title="Copy link code"
              >
                {myLinkCode}
                {copied ? (
                  <CheckCircle2 className="size-3.5" style={{ color: VERDIGRIS }} />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
              <span className="hidden sm:inline">— share it to be linked.</span>
            </div>
          )}
        </div>
      </BlurFade>

      {loading ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Loading your family links…
        </div>
      ) : (
        <div className="space-y-10">
          {/* Incoming requests awaiting MY confirmation */}
          {incoming.length > 0 && (
            <Section title="Awaiting your confirmation" count={incoming.length} accent={GOLD}>
              <div className="space-y-3">
                {incoming.map((req) => (
                  <IncomingCard
                    key={req.linkId}
                    req={req}
                    onConfirm={async () => {
                      await confirm(req.linkId)
                      toast.success(
                        req.iAmParent
                          ? `You're now following ${req.profile.displayName}.`
                          : `${req.profile.displayName} can now follow your reading.`,
                      )
                    }}
                    onDecline={() => cancel(req.linkId)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Pending invites I sent */}
          {outgoing.length > 0 && (
            <Section title="Pending invites" count={outgoing.length} accent={LAPIS}>
              <div className="space-y-3">
                {outgoing.map((req) => (
                  <OutgoingCard
                    key={req.linkId}
                    req={req}
                    onCancel={() => cancel(req.linkId)}
                  />
                ))}
              </div>
            </Section>
          )}

          {/* Children I follow */}
          <Section title="Readers you follow" count={children.length} accent={VERDIGRIS}>
            {children.length === 0 ? (
              <EmptyState
                icon={<Users className="size-7 text-muted-foreground/60" />}
                text="You're not following any readers yet. Use a link code above to invite your child."
              />
            ) : (
              <div className="space-y-4">
                {children.map((child) => (
                  <ChildCard
                    key={child.linkId}
                    child={child}
                    onRevoke={async () => {
                      await revoke(child.linkId)
                      toast.success(`Stopped following ${child.profile.displayName}.`)
                    }}
                    loadDetail={() => loadChildDetail(child.profile.id)}
                  />
                ))}
              </div>
            )}
          </Section>

          {/* Guardians following me */}
          {guardians.length > 0 && (
            <Section
              title="Following your reading"
              count={guardians.length}
              accent={LAPIS}
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {guardians.map((g) => (
                  <GuardianCard
                    key={g.linkId}
                    guardian={g}
                    onRevoke={async () => {
                      await revoke(g.linkId)
                      toast.success(`Removed ${g.profile.displayName}'s access.`)
                    }}
                  />
                ))}
              </div>
            </Section>
          )}
        </div>
      )}
    </div>
  )
}

function Header({ childCount }: { childCount: number }) {
  return (
    <BlurFade delay={0.04} inView>
      <div className="mb-6 flex items-center gap-2.5">
        <Users className="size-6 shrink-0 text-foreground" />
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-tight">Family</h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {childCount === 0
              ? "Follow a young reader's progress — with their consent"
              : `Following ${childCount} ${childCount === 1 ? "reader" : "readers"}`}
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

function EmptyState({
  icon,
  text,
}: {
  icon: React.ReactNode
  text: string
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-14 text-center">
      <div className="mb-3">{icon}</div>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
    </div>
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
  onConfirm,
  onDecline,
}: {
  req: LinkRequest
  onConfirm: () => void
  onDecline: () => void
}) {
  // iAmParent: the other party is my child, inviting me to follow them.
  // else: the other party is a guardian asking to follow MY reading.
  const message = req.iAmParent
    ? "invited you to follow their reading."
    : "wants to follow your reading as your guardian."
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar url={req.profile.avatarUrl} name={req.profile.displayName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm">
            <span className="font-semibold">{req.profile.displayName}</span>{" "}
            <span className="text-muted-foreground">{message}</span>
          </p>
          <p className="text-[11px] text-muted-foreground">
            @{req.profile.username} · {timeAgo(req.sentAt)}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="h-8 gap-1 text-xs"
            style={{ background: VERDIGRIS }}
            onClick={onConfirm}
          >
            <Check className="size-3.5" /> Confirm
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
      {!req.iAmParent && (
        <p className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-muted/40 px-3 py-2 text-[11px] leading-relaxed text-muted-foreground">
          <Eye className="mt-px size-3.5 shrink-0" style={{ color: LAPIS }} />
          If you confirm, they&rsquo;ll see your reading progress, trials, and
          achievements — never your messages or friends. You can revoke this
          anytime.
        </p>
      )}
    </div>
  )
}

function OutgoingCard({
  req,
  onCancel,
}: {
  req: LinkRequest
  onCancel: () => void
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Avatar url={req.profile.avatarUrl} name={req.profile.displayName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{req.profile.displayName}</p>
        <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Clock className="size-3" /> Waiting for confirmation ·{" "}
          {timeAgo(req.sentAt)}
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

function Stat({
  icon,
  value,
  label,
  accent,
}: {
  icon: React.ReactNode
  value: string | number
  label: string
  accent: string
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-2.5 text-center">
      <div className="mb-0.5 flex items-center justify-center gap-1" style={{ color: accent }}>
        {icon}
        <span className="font-serif text-lg font-bold">{value}</span>
      </div>
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  )
}

function ChildCard({
  child,
  onRevoke,
  loadDetail,
}: {
  child: ChildLink
  onRevoke: () => void
  loadDetail: () => Promise<{
    activity: ChildActivityItem[]
    achievements: ChildAchievementItem[]
  }>
}) {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState<{
    activity: ChildActivityItem[]
    achievements: ChildAchievementItem[]
  } | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [confirmRevoke, setConfirmRevoke] = useState(false)
  const ov = child.overview

  async function toggle() {
    const next = !expanded
    setExpanded(next)
    if (next && !detail) {
      setLoadingDetail(true)
      try {
        setDetail(await loadDetail())
      } finally {
        setLoadingDetail(false)
      }
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-3">
        <Avatar url={child.profile.avatarUrl} name={child.profile.displayName} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {child.profile.displayName}
          </p>
          <p className="text-[11px] text-muted-foreground">
            @{child.profile.username}
            {ov?.lastActiveAt
              ? ` · last active ${timeAgo(new Date(ov.lastActiveAt))}`
              : " · no activity yet"}
          </p>
        </div>
        {confirmRevoke ? (
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              className="h-8 text-xs"
              style={{ background: VERMILION }}
              onClick={onRevoke}
            >
              Revoke access
            </Button>
            <Button
              size="sm"
              variant="ghost"
              className="h-8 text-xs text-muted-foreground"
              onClick={() => setConfirmRevoke(false)}
            >
              Keep
            </Button>
          </div>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => setConfirmRevoke(true)}
          >
            Revoke
          </Button>
        )}
      </div>

      {ov && (
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Stat
            icon={<Flame className="size-3.5" />}
            value={ov.currentStreak}
            label="Day streak"
            accent={VERMILION}
          />
          <Stat
            icon={<Sparkles className="size-3.5" />}
            value={ov.totalWisdom}
            label="Wisdom"
            accent={GOLD}
          />
          <Stat
            icon={<BookOpen className="size-3.5" />}
            value={ov.chaptersRead}
            label="Chapters"
            accent={LAPIS}
          />
          <Stat
            icon={<Trophy className="size-3.5" />}
            value={ov.trialsPassed}
            label="Trials"
            accent={VERDIGRIS}
          />
        </div>
      )}

      {ov && (
        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
          <span>{ov.booksStarted} books started</span>
          <span>{ov.avgScore}% avg trial score</span>
          <span>{ov.achievementsCount} achievements</span>
          <span>{ov.activeDays30} active days (30d)</span>
        </div>
      )}

      <button
        onClick={toggle}
        className="mt-3 flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronDown
          className="size-3.5 transition-transform"
          style={{ transform: expanded ? "rotate(180deg)" : undefined }}
        />
        {expanded ? "Hide" : "Recent activity & achievements"}
      </button>

      {expanded && (
        <div className="mt-3 border-t border-border pt-3">
          {loadingDetail ? (
            <p className="text-xs text-muted-foreground">Loading…</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Recent activity
                </h4>
                {detail && detail.activity.length > 0 ? (
                  <ul className="space-y-1.5">
                    {detail.activity.slice(0, 8).map((a, i) => (
                      <li key={i} className="text-xs">
                        <span className="text-foreground">{a.detail}</span>
                        {bookTitle(a.bookId) && (
                          <span className="text-muted-foreground">
                            {" "}· {bookTitle(a.bookId)}
                          </span>
                        )}
                        {a.occurredAt && (
                          <span className="text-muted-foreground/70">
                            {" "}· {timeAgo(new Date(a.occurredAt))}
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">No activity yet.</p>
                )}
              </div>
              <div>
                <h4 className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Achievements
                </h4>
                {detail && detail.achievements.length > 0 ? (
                  <ul className="space-y-1.5">
                    {detail.achievements.slice(0, 8).map((a, i) => (
                      <li key={i} className="flex items-center gap-1.5 text-xs">
                        <Trophy className="size-3 shrink-0" style={{ color: GOLD }} />
                        <span className="text-foreground">{a.name}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    No achievements yet.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function GuardianCard({
  guardian,
  onRevoke,
}: {
  guardian: GuardianLink
  onRevoke: () => void
}) {
  const [confirmRevoke, setConfirmRevoke] = useState(false)
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <Avatar url={guardian.profile.avatarUrl} name={guardian.profile.displayName} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">
          {guardian.profile.displayName}
        </p>
        <p className="text-[11px] text-muted-foreground">
          @{guardian.profile.username} · follows your reading
        </p>
      </div>
      {confirmRevoke ? (
        <div className="flex items-center gap-1.5">
          <Button
            size="sm"
            className="h-8 text-xs"
            style={{ background: VERMILION }}
            onClick={onRevoke}
          >
            Remove
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-8 text-xs text-muted-foreground"
            onClick={() => setConfirmRevoke(false)}
          >
            Keep
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          variant="ghost"
          className="h-8 text-xs text-muted-foreground"
          onClick={() => setConfirmRevoke(true)}
        >
          Revoke
        </Button>
      )}
    </div>
  )
}
