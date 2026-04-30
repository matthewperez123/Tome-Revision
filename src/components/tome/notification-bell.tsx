"use client"

import { useState, useRef, useEffect, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Bell,
  BookOpen,
  Brain,
  UserPlus,
  Trophy,
  AlertTriangle,
  Flame,
  Check,
  Heart,
  Megaphone,
  PenSquare,
  Eye,
  X,
  Sparkles,
  Bookmark,
  BookmarkCheck,
  BookHeart,
  GraduationCap,
  Image as ImageIcon,
  Star,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  useRealtimeNotifications,
  type DbNotification,
} from "@/hooks/use-realtime-notifications"
import { categoryForType } from "@/lib/notifications/seed"
import {
  acceptRecommendation,
  rejectRecommendation,
} from "@/lib/actions/recommendations"

const TYPE_ICONS: Record<string, typeof Bell> = {
  // Existing
  quiz_completed: Brain,
  assignment_submitted: BookOpen,
  assignment_created: GraduationCap,
  assignment_due_soon: AlertTriangle,
  submission_graded: Check,
  book_completed: Trophy,
  student_joined: UserPlus,
  student_at_risk: AlertTriangle,
  streak_milestone: Flame,
  flame_milestone: Flame,
  chapter_completed: BookOpen,
  // Social layer
  friend_request_received: UserPlus,
  friend_request_accepted: Heart,
  friend_recommendation: BookHeart,
  friend_activity: Heart,
  classroom_invite: UserPlus,
  classroom_announcement: Megaphone,
  peer_review_assigned: PenSquare,
  peer_review_received: Eye,
  book_recommendation_received: BookHeart,
  book_recommendation_accepted: Heart,
  // Library / catalog
  new_book_in_canon: BookOpen,
  stoa_update: ImageIcon,
  seal_earned: Star,
}

const TYPE_COLORS: Record<string, string> = {
  // Existing
  quiz_completed: "text-purple-500",
  assignment_submitted: "text-blue-500",
  assignment_created: "text-indigo-500",
  assignment_due_soon: "text-amber-500",
  submission_graded: "text-green-500",
  book_completed: "text-green-500",
  student_joined: "text-indigo-500",
  student_at_risk: "text-amber-500",
  streak_milestone: "text-orange-500",
  flame_milestone: "text-orange-500",
  chapter_completed: "text-indigo-500",
  // Social layer
  friend_request_received: "text-indigo-500",
  friend_request_accepted: "text-rose-500",
  friend_recommendation: "text-[#C9A84C]",
  friend_activity: "text-rose-500",
  classroom_invite: "text-indigo-500",
  classroom_announcement: "text-amber-600",
  peer_review_assigned: "text-purple-500",
  peer_review_received: "text-purple-500",
  book_recommendation_received: "text-[#C9A84C]",
  book_recommendation_accepted: "text-rose-500",
  // Library / catalog
  new_book_in_canon: "text-indigo-500",
  stoa_update: "text-indigo-500",
  seal_earned: "text-[#C9A84C]",
}

const CATEGORY_ACCENT: Record<string, string> = {
  social: "border-l-rose-300/60",
  assignment: "border-l-indigo-400/70",
  achievement: "border-l-[#C9A84C]/70",
  system: "border-l-border",
}

/** Pull a UUID out of a `?rec=...` query param on a notification's action_url. */
function extractRecId(actionUrl: string | null): string | null {
  if (!actionUrl) return null
  const match = actionUrl.match(/[?&]rec=([0-9a-f-]{36})/i)
  return match ? match[1] : null
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function timeAgoSpoken(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useRealtimeNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [isOpen])

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#C9A84C] text-[9px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full mt-2 w-80 rounded-xl border bg-card shadow-xl z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-4 py-3">
              <h3 className="text-sm font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground hover:text-foreground"
                >
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center">
                  <Bell className="mx-auto size-6 text-muted-foreground/40" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <NotificationItem
                    key={notif.id}
                    notification={notif}
                    onRead={() => {
                      markAsRead(notif.id)
                      setIsOpen(false)
                    }}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function accessibleNameFor(notif: DbNotification): string {
  const time = timeAgoSpoken(notif.created_at)
  const lead = notif.read ? "" : "Unread notification: "
  const body = notif.body ? `. ${notif.body}` : ""
  return `${lead}${notif.title}${body}, ${time}`
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: DbNotification
  onRead: () => void
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const color = TYPE_COLORS[notification.type] ?? "text-muted-foreground"
  const category = categoryForType(notification.type, notification.category)
  const accent = CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT.system

  // Special case: book recommendation received → render inline accept/reject.
  if (notification.type === "book_recommendation_received") {
    return (
      <RecommendationItem
        notification={notification}
        onRead={onRead}
        Icon={Icon}
        color={color}
        accent={accent}
      />
    )
  }

  // Friend recommendation (demo): clickable row with an inline bookmark
  // "save for later" button that toggles local state.
  if (notification.type === "friend_recommendation") {
    return (
      <FriendRecommendationItem
        notification={notification}
        onRead={onRead}
        Icon={Icon}
        color={color}
        accent={accent}
      />
    )
  }

  return (
    <PlainNotificationItem
      notification={notification}
      onRead={onRead}
      Icon={Icon}
      color={color}
      accent={accent}
    />
  )
}

function PlainNotificationItem({
  notification,
  onRead,
  Icon,
  color,
  accent,
}: {
  notification: DbNotification
  onRead: () => void
  Icon: typeof Bell
  color: string
  accent: string
}) {
  const inner = (
    <div
      className={`flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-muted/50 ${accent} ${
        !notification.read ? "bg-indigo-50/40 dark:bg-indigo-950/10" : ""
      }`}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1 text-left">
        <p
          className={`text-sm leading-snug ${!notification.read ? "font-medium" : ""}`}
        >
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {notification.body}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(notification.created_at)}
        </span>
        {!notification.read && (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#C9A84C]"
          />
        )}
      </div>
    </div>
  )

  if (notification.action_url) {
    return (
      <Link
        href={notification.action_url}
        aria-label={accessibleNameFor(notification)}
        onClick={onRead}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-inset"
      >
        {inner}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onRead}
      aria-label={accessibleNameFor(notification)}
      className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-inset"
    >
      {inner}
    </button>
  )
}

/**
 * Reader-only: a friend recommended a book. Whole row routes to the book's
 * detail page. A small inline "Save for later" bookmark button toggles a
 * local saved state and fires a sonner toast. No backend persistence.
 */
function FriendRecommendationItem({
  notification,
  onRead,
  Icon,
  color,
  accent,
}: {
  notification: DbNotification
  onRead: () => void
  Icon: typeof Bell
  color: string
  accent: string
}) {
  const router = useRouter()
  const [saved, setSaved] = useState(false)

  function handleRowClick(e: React.MouseEvent) {
    // Prevent default Link navigation if click landed on the bookmark button
    // — the button itself stops propagation. This is just a fallback.
    e.stopPropagation()
    onRead()
    if (notification.action_url) {
      router.push(notification.action_url)
    }
  }

  function handleSave(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (saved) {
      setSaved(false)
      toast("Removed from saved")
      return
    }
    setSaved(true)
    const title = notification.bookmarkTitle
    toast.success(title ? `${title} saved for later` : "Saved for later")
  }

  return (
    <div
      className={`relative flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-muted/50 ${accent} ${
        !notification.read ? "bg-indigo-50/40 dark:bg-indigo-950/10" : ""
      }`}
    >
      {/* Whole-row click target */}
      <button
        type="button"
        onClick={handleRowClick}
        aria-label={accessibleNameFor(notification)}
        className="absolute inset-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-inset"
      />

      <Icon
        className={`relative mt-0.5 size-4 shrink-0 ${color}`}
        aria-hidden="true"
      />
      <div className="relative min-w-0 flex-1 text-left">
        <p
          className={`text-sm leading-snug ${!notification.read ? "font-medium" : ""}`}
        >
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">
            {notification.body}
          </p>
        )}
      </div>

      <div className="relative flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(notification.created_at)}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleSave}
            aria-label={saved ? "Remove from saved" : "Save for later"}
            aria-pressed={saved}
            className={`relative z-10 flex size-7 items-center justify-center rounded-full transition-colors ${
              saved
                ? "bg-[#C9A84C]/20 text-[#C9A84C]"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {saved ? (
              <BookmarkCheck className="size-3.5" aria-hidden="true" />
            ) : (
              <Bookmark className="size-3.5" aria-hidden="true" />
            )}
          </button>
          {!notification.read && (
            <span
              aria-hidden="true"
              className="size-1.5 rounded-full bg-[#C9A84C]"
            />
          )}
        </div>
      </div>
    </div>
  )
}

/**
 * Inline accept/reject for a book_recommendation_received notification.
 * The whole tile is still clickable (routes to /library); the accept/reject
 * buttons stop propagation. Successful accept fades the title to an
 * "Added to library" state for ~1.2s before dismissing the notification.
 */
function RecommendationItem({
  notification,
  onRead,
  Icon,
  color,
  accent,
}: {
  notification: DbNotification
  onRead: () => void
  Icon: typeof Bell
  color: string
  accent: string
}) {
  const [pending, startTransition] = useTransition()
  const [resolved, setResolved] = useState<"accepted" | "rejected" | null>(null)
  const recId = extractRecId(notification.action_url)

  function handleAccept(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!recId || pending || resolved) return
    startTransition(async () => {
      const result = await acceptRecommendation(recId)
      if (result.ok) {
        setResolved("accepted")
        setTimeout(onRead, 1200)
      }
    })
  }

  function handleReject(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!recId || pending || resolved) return
    startTransition(async () => {
      const result = await rejectRecommendation(recId)
      if (result.ok) {
        setResolved("rejected")
        setTimeout(onRead, 400)
      }
    })
  }

  const tile = (
    <div
      className={`flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-muted/50 ${accent} ${
        !notification.read ? "bg-indigo-50/40 dark:bg-indigo-950/10" : ""
      } ${resolved === "rejected" ? "opacity-50" : ""}`}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p
          className={`text-sm leading-snug ${
            !notification.read && !resolved ? "font-medium" : ""
          }`}
        >
          {resolved === "accepted"
            ? "Added to your library"
            : notification.title}
        </p>
        {notification.body && resolved !== "accepted" && (
          <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
            {notification.body}
          </p>
        )}
        {!resolved && recId && (
          <div className="mt-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleAccept}
              disabled={pending}
              className="flex size-7 items-center justify-center rounded-full bg-[#C9A84C]/15 text-[#C9A84C] transition-colors hover:bg-[#C9A84C]/25 disabled:opacity-50"
              aria-label="Accept recommendation"
            >
              <Check className="size-3.5" strokeWidth={2.5} />
            </button>
            <button
              type="button"
              onClick={handleReject}
              disabled={pending}
              className="flex size-7 items-center justify-center rounded-full bg-rose-500/10 text-rose-500/80 transition-colors hover:bg-rose-500/20 disabled:opacity-50"
              aria-label="Reject recommendation"
            >
              <X className="size-3.5" strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(notification.created_at)}
        </span>
        {!notification.read && !resolved && (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#C9A84C]"
          />
        )}
      </div>
    </div>
  )

  // The container is still a Link to /library so clicking the body navigates.
  if (notification.action_url) {
    return (
      <Link
        href={notification.action_url}
        aria-label={accessibleNameFor(notification)}
        onClick={() => {
          if (!pending && !resolved) onRead()
        }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tome-accent)] focus-visible:ring-inset"
      >
        {tile}
      </Link>
    )
  }
  return <div>{tile}</div>
}
