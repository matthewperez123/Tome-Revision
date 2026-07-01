"use client"

import { useMemo, useState, useTransition } from "react"
import Link from "next/link"
import {
  Bell,
  BookOpen,
  UserPlus,
  Heart,
  Users,
  Megaphone,
  GraduationCap,
  Check,
  PenSquare,
  BookHeart,
  ShieldQuestion,
  MessageCircle,
  CheckCheck,
  X,
} from "lucide-react"
import {
  useRealtimeNotifications,
  type AppNotification,
} from "@/hooks/use-realtime-notifications"
import { useAuth } from "@/hooks/use-auth"
import {
  acceptRecommendation,
  rejectRecommendation,
} from "@/lib/actions/recommendations"

// ── Canonical type → icon / accent ─────────────────────────────────────────
// RUBRIC palette: lapis #2A4B8D, gold #C8A24B, vermilion #C8553D,
// verdigris #2E7D6F. Iridescence is reserved for Virgil — never used here.

const TYPE_ICONS: Record<string, typeof Bell> = {
  friend_request: UserPlus,
  friend_accepted: Heart,
  group_invite: Users,
  group_post: Megaphone,
  class_assignment: GraduationCap,
  assignment_graded: Check,
  parent_link_request: ShieldQuestion,
  session_summary: BookOpen,
  peer_review: PenSquare,
  book_recommendation: BookHeart,
  message: MessageCircle,
  system: Bell,
}

const LAPIS = "text-[#2A4B8D] dark:text-[#7BA0E0]"
const GOLD = "text-[#C8A24B]"
const VERMILION = "text-[#C8553D]"
const VERDIGRIS = "text-[#2E7D6F] dark:text-[#5FB3A1]"

const TYPE_COLORS: Record<string, string> = {
  friend_request: LAPIS,
  friend_accepted: VERMILION,
  group_invite: LAPIS,
  group_post: GOLD,
  class_assignment: LAPIS,
  assignment_graded: VERDIGRIS,
  parent_link_request: GOLD,
  session_summary: LAPIS,
  peer_review: LAPIS,
  book_recommendation: GOLD,
  message: VERDIGRIS,
  system: "text-muted-foreground",
}

// Grouping buckets for the filter chips.
type FilterId = "all" | "unread" | "classroom" | "social" | "family"

const FILTERS: { id: FilterId; label: string; types: string[] | null }[] = [
  { id: "all", label: "All", types: null },
  { id: "unread", label: "Unread", types: null },
  {
    id: "classroom",
    label: "Classroom",
    types: ["class_assignment", "assignment_graded", "peer_review", "session_summary"],
  },
  {
    id: "social",
    label: "Social",
    types: ["friend_request", "friend_accepted", "group_invite", "group_post", "book_recommendation", "message"],
  },
  { id: "family", label: "Family", types: ["parent_link_request"] },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// Deep link resolution. notify() already stores an action_url in the payload
// derived from the emitting entity, so that is the source of truth. This adds
// a defensive fallback from entity_type/entity_id for any legacy row that
// lacks one — never a fabricated destination.
function deepLink(n: AppNotification): string | null {
  if (n.actionUrl) return n.actionUrl
  if (!n.entityType || !n.entityId) return null
  switch (n.entityType) {
    case "classroom":
      return `/classroom/${n.entityId}`
    case "submission":
    case "assignment":
      return "/classroom"
    case "friendship":
      return "/friends"
    case "group":
      return `/clubs/${n.entityId}`
    case "conversation":
      return `/messages/${n.entityId}`
    case "session":
      return "/reading"
    default:
      return null
  }
}

export default function NotificationsPage() {
  const { user, isDemoMode } = useAuth()
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } =
    useRealtimeNotifications({ limit: 100 })
  const [filter, setFilter] = useState<FilterId>("all")

  const visible = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)!
    if (filter === "unread") return notifications.filter((n) => !n.read)
    if (!f.types) return notifications
    return notifications.filter((n) => f.types!.includes(n.type))
  }, [notifications, filter])

  if (isDemoMode || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="flex items-center gap-3">
          <Bell className="size-6 text-[#C8A24B]" />
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
        <div className="mt-12 flex flex-col items-center text-center">
          <Bell className="size-8 text-muted-foreground/40" />
          <p className="mt-3 text-sm font-medium">Sign in to see your notifications</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Friend requests, grades, and class updates will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <Bell className="size-6 text-[#C8A24B]" />
        <h1 className="text-2xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <span className="rounded-full bg-[#C8A24B]/15 px-2.5 py-0.5 text-xs font-medium text-[#C8A24B]">
            {unreadCount} unread
          </span>
        )}
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="ml-auto inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <CheckCheck className="size-4" /> Mark all read
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        {FILTERS.map((f) => {
          const count =
            f.id === "unread"
              ? unreadCount
              : f.types
                ? notifications.filter((n) => f.types!.includes(n.type)).length
                : notifications.length
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.id
                  ? "bg-foreground text-background"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {f.label}
              {count > 0 && <span className="ml-1.5 tabular-nums opacity-70">{count}</span>}
            </button>
          )
        })}
      </div>

      {/* List */}
      <div className="mt-6">
        {loading ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl border border-border bg-muted/30" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="mt-8 flex flex-col items-center text-center">
            <Bell className="size-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium">
              {filter === "unread" ? "No unread notifications" : "You're all caught up"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Friend requests, grades, and class updates will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {visible.map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onRead={() => markAsRead(n.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function NotificationRow({
  notification,
  onRead,
}: {
  notification: AppNotification
  onRead: () => void
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const color = TYPE_COLORS[notification.type] ?? "text-muted-foreground"

  if (
    notification.type === "book_recommendation" &&
    notification.payload?.status === "received" &&
    notification.entityId
  ) {
    return (
      <RecommendationRow
        notification={notification}
        onRead={onRead}
        Icon={Icon}
        color={color}
      />
    )
  }

  const href = deepLink(notification)
  const body = (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/40 ${
        notification.read
          ? "border-border bg-card"
          : "border-[#C8A24B]/30 bg-[#C8A24B]/[0.05]"
      }`}
    >
      <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${!notification.read ? "font-semibold" : ""}`}>
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground">{notification.body}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[10px] text-muted-foreground">{timeAgo(notification.createdAt)}</span>
        {!notification.read && <span className="size-2 rounded-full bg-[#C8A24B]" />}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link href={href} onClick={onRead} className="block">
        {body}
      </Link>
    )
  }
  return (
    <button type="button" onClick={onRead} className="block w-full text-left">
      {body}
    </button>
  )
}

function RecommendationRow({
  notification,
  onRead,
  Icon,
  color,
}: {
  notification: AppNotification
  onRead: () => void
  Icon: typeof Bell
  color: string
}) {
  const [pending, startTransition] = useTransition()
  const [resolved, setResolved] = useState<"accepted" | "rejected" | null>(null)
  const recId = notification.entityId!

  function handleAccept(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending || resolved) return
    startTransition(async () => {
      const result = await acceptRecommendation(recId)
      if (result.ok) {
        setResolved("accepted")
        setTimeout(onRead, 1000)
      }
    })
  }

  function handleReject(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending || resolved) return
    startTransition(async () => {
      const result = await rejectRecommendation(recId)
      if (result.ok) {
        setResolved("rejected")
        setTimeout(onRead, 400)
      }
    })
  }

  return (
    <div
      className={`flex items-start gap-3 rounded-xl border p-4 ${
        notification.read ? "border-border bg-card" : "border-[#C8A24B]/30 bg-[#C8A24B]/[0.05]"
      } ${resolved === "rejected" ? "opacity-50" : ""}`}
    >
      <Icon className={`mt-0.5 size-5 shrink-0 ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${!notification.read && !resolved ? "font-semibold" : ""}`}>
          {resolved === "accepted" ? "Added to your library" : notification.title}
        </p>
        {notification.body && resolved !== "accepted" && (
          <p className="mt-0.5 text-xs text-muted-foreground">{notification.body}</p>
        )}
        {!resolved && (
          <div className="mt-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAccept}
              disabled={pending}
              className="flex size-7 items-center justify-center rounded-full bg-[#C8A24B]/15 text-[#C8A24B] transition-colors hover:bg-[#C8A24B]/25 disabled:opacity-50"
              aria-label="Accept recommendation"
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="flex size-7 items-center justify-center rounded-full bg-[#C8553D]/10 text-[#C8553D] transition-colors hover:bg-[#C8553D]/20 disabled:opacity-50"
              aria-label="Reject recommendation"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className="text-[10px] text-muted-foreground">{timeAgo(notification.createdAt)}</span>
        {!notification.read && !resolved && <span className="size-2 rounded-full bg-[#C8A24B]" />}
      </div>
    </div>
  )
}
