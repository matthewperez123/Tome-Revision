"use client"

import { useState, useRef, useEffect, useTransition } from "react"
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
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useRealtimeNotifications,
  type AppNotification,
} from "@/hooks/use-realtime-notifications"
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
  system: "text-muted-foreground",
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

function accessibleNameFor(n: AppNotification): string {
  const time = timeAgoSpoken(n.createdAt)
  const lead = n.read ? "" : "Unread notification: "
  const body = n.body ? `. ${n.body}` : ""
  return `${lead}${n.title}${body}, ${time}`
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } =
    useRealtimeNotifications()
  const [isOpen, setIsOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-[#C8A24B] text-[9px] font-bold text-white tabular-nums">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            role="menu"
            className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h3 className="font-display text-sm font-semibold">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
                  <Bell className="size-7 text-muted-foreground/40" />
                  <p className="mt-3 text-sm font-medium text-foreground">
                    You&rsquo;re all caught up
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Friend requests, grades, and class updates will appear here.
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

function NotificationItem({
  notification,
  onRead,
}: {
  notification: AppNotification
  onRead: () => void
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const color = TYPE_COLORS[notification.type] ?? "text-muted-foreground"

  // A received book recommendation gets inline accept / reject controls.
  if (
    notification.type === "book_recommendation" &&
    notification.payload?.status === "received" &&
    notification.entityId
  ) {
    return (
      <RecommendationItem
        notification={notification}
        onRead={onRead}
        Icon={Icon}
        color={color}
      />
    )
  }

  return (
    <PlainNotificationItem
      notification={notification}
      onRead={onRead}
      Icon={Icon}
      color={color}
    />
  )
}

function NotificationBody({
  notification,
  Icon,
  color,
}: {
  notification: AppNotification
  Icon: typeof Bell
  color: string
}) {
  return (
    <div
      className={`flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-muted/50 ${
        notification.read
          ? "border-l-transparent"
          : "border-l-[#C8A24B] bg-[#C8A24B]/[0.06]"
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
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {notification.body}
          </p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(notification.createdAt)}
        </span>
        {!notification.read && (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#C8A24B]"
          />
        )}
      </div>
    </div>
  )
}

function PlainNotificationItem({
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
  const inner = (
    <NotificationBody notification={notification} Icon={Icon} color={color} />
  )

  if (notification.actionUrl) {
    return (
      <Link
        href={notification.actionUrl}
        aria-label={accessibleNameFor(notification)}
        onClick={onRead}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2A4B8D]"
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
      className="block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2A4B8D]"
    >
      {inner}
    </button>
  )
}

/**
 * Inline accept / reject for a received book recommendation. The rec id is
 * carried on the notification's entity_id. Accepting adds the book to the
 * reader's library and dismisses the row.
 */
function RecommendationItem({
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
        setTimeout(onRead, 1200)
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

  const tile = (
    <div
      className={`flex items-start gap-3 border-l-2 px-4 py-3 transition-colors hover:bg-muted/50 ${
        notification.read
          ? "border-l-transparent"
          : "border-l-[#C8A24B] bg-[#C8A24B]/[0.06]"
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
          <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
            {notification.body}
          </p>
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
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">
          {timeAgo(notification.createdAt)}
        </span>
        {!notification.read && !resolved && (
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[#C8A24B]"
          />
        )}
      </div>
    </div>
  )

  if (notification.actionUrl) {
    return (
      <Link
        href={notification.actionUrl}
        aria-label={accessibleNameFor(notification)}
        onClick={() => {
          if (!pending && !resolved) onRead()
        }}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#2A4B8D]"
      >
        {tile}
      </Link>
    )
  }
  return <div>{tile}</div>
}
