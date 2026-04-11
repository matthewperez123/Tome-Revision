"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Bell, BookOpen, Brain, UserPlus, Trophy, AlertTriangle, Flame, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRealtimeNotifications, type DbNotification } from "@/hooks/use-realtime-notifications"

const TYPE_ICONS: Record<string, typeof Bell> = {
  quiz_completed: Brain,
  assignment_submitted: BookOpen,
  assignment_created: BookOpen,
  assignment_due_soon: AlertTriangle,
  submission_graded: Check,
  book_completed: Trophy,
  student_joined: UserPlus,
  student_at_risk: AlertTriangle,
  streak_milestone: Flame,
}

const TYPE_COLORS: Record<string, string> = {
  quiz_completed: "text-purple-500",
  assignment_submitted: "text-blue-500",
  assignment_created: "text-blue-500",
  assignment_due_soon: "text-amber-500",
  submission_graded: "text-green-500",
  book_completed: "text-green-500",
  student_joined: "text-indigo-500",
  student_at_risk: "text-amber-500",
  streak_milestone: "text-orange-500",
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  return `${days}d`
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useRealtimeNotifications()
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
      >
        <Bell className="size-4.5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
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
                  <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
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
  notification: DbNotification
  onRead: () => void
}) {
  const Icon = TYPE_ICONS[notification.type] ?? Bell
  const color = TYPE_COLORS[notification.type] ?? "text-muted-foreground"

  const content = (
    <div
      className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-muted/50 ${
        !notification.read ? "bg-indigo-50/50 dark:bg-indigo-950/10" : ""
      }`}
      onClick={onRead}
    >
      <Icon className={`mt-0.5 size-4 shrink-0 ${color}`} />
      <div className="min-w-0 flex-1">
        <p className={`text-sm leading-snug ${!notification.read ? "font-medium" : ""}`}>
          {notification.title}
        </p>
        {notification.body && (
          <p className="mt-0.5 text-xs text-muted-foreground truncate">{notification.body}</p>
        )}
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-muted-foreground">{timeAgo(notification.created_at)}</span>
        {!notification.read && (
          <span className="size-1.5 rounded-full bg-indigo-500" />
        )}
      </div>
    </div>
  )

  if (notification.action_url) {
    return <Link href={notification.action_url}>{content}</Link>
  }

  return <button className="w-full text-left">{content}</button>
}
