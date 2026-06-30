"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import {
  Bell, BookCheck, Trophy, Sparkles, Flame, Shield, Palette,
  Target, BookOpen, Landmark, MessageSquare, CheckCheck, Filter,
} from "lucide-react"
import { AnimatePresence, motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  subscribeNotifications,
  formatNotificationTime,
  groupNotificationsByDay,
  type TomeNotification,
  type NotificationCategory,
  seedNotificationsIfEmpty,
} from "@/lib/notifications"
import { cn } from "@/lib/utils"

// ── Icon map ────────────────────────────────────────────────────────────────

const ICON_MAP: Record<string, typeof Bell> = {
  BookCheck, Trophy, Sparkles, Flame, Shield, Palette,
  Target, BookOpen, Landmark, MessageSquare, Bell,
}

function getNotifIcon(iconName?: string) {
  if (!iconName) return Bell
  return ICON_MAP[iconName] ?? Bell
}

// ── Priority colors ─────────────────────────────────────────────────────────

function getPriorityColor(priority: string): string {
  switch (priority) {
    case "celebration": return "text-[#D4A04C]"
    case "high": return "text-[#D4A04C]"
    case "low": return "text-muted-foreground"
    default: return "text-foreground"
  }
}

function getPriorityBg(priority: string): string {
  switch (priority) {
    case "celebration": return "bg-[#D4A04C]/5 dark:bg-[#D4A04C]/10"
    default: return ""
  }
}

// ── Filter options ──────────────────────────────────────────────────────────

const FILTER_OPTIONS: { label: string; value: NotificationCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Achievements", value: "achievements" },
  { label: "Reading", value: "reading" },
  { label: "Streaks", value: "streaks" },
  { label: "Unlocks", value: "unlocks" },
  { label: "Virgil", value: "virgil" },
]

// ── Component ───────────────────────────────────────────────────────────────

export function NotificationBell() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<TomeNotification[]>([])
  const [unread, setUnread] = useState(0)
  const [filter, setFilter] = useState<NotificationCategory | "all">("all")
  const [showFilters, setShowFilters] = useState(false)
  const [pulse, setPulse] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const prevUnread = useRef(0)

  // Load notifications
  const refresh = useCallback(() => {
    const all = getNotifications()
    setNotifications(all)
    const count = getUnreadCount()
    // Pulse animation when new notifications arrive
    if (count > prevUnread.current && prevUnread.current >= 0) {
      setPulse(true)
      setTimeout(() => setPulse(false), 1000)
    }
    prevUnread.current = count
    setUnread(count)
  }, [])

  useEffect(() => {
    seedNotificationsIfEmpty()
    refresh()
    return subscribeNotifications(refresh)
  }, [refresh])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
        setShowFilters(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setOpen(false); setShowFilters(false) }
    }
    document.addEventListener("keydown", handleKey)
    return () => document.removeEventListener("keydown", handleKey)
  }, [open])

  const filtered = filter === "all"
    ? notifications
    : notifications.filter((n) => n.category === filter)

  const grouped = groupNotificationsByDay(filtered)

  function handleClick(notif: TomeNotification) {
    markAsRead(notif.id)
    if (notif.link) {
      router.push(notif.link)
      setOpen(false)
    }
  }

  function handleMarkAllRead() {
    markAllAsRead()
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "relative flex size-8 items-center justify-center rounded-md transition-colors",
          "text-muted-foreground hover:text-foreground hover:bg-muted"
        )}
        aria-label="Notifications"
      >
        <motion.div
          animate={pulse ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : { scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Bell className="size-4" />
        </motion.div>
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 rounded-full bg-[#D4A04C] text-[9px] font-bold text-[#111] px-1 tabular-nums">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Dropdown popover */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute top-full right-0 mt-2 z-50",
              "w-[380px] max-h-[520px] rounded-xl",
              "bg-popover border border-border",
              "shadow-xl shadow-black/10 dark:shadow-black/30",
              "flex flex-col overflow-hidden"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-border">
              <h3 className="text-sm font-semibold">Notifications</h3>
              <div className="flex items-center gap-1">
                {/* Filter toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md text-xs transition-colors",
                    showFilters ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                  title="Filter notifications"
                >
                  <Filter className="size-3.5" />
                </button>
                {/* Mark all read */}
                {unread > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-md hover:bg-muted"
                    title="Mark all as read"
                  >
                    <CheckCheck className="size-3" />
                    Mark all read
                  </button>
                )}
              </div>
            </div>

            {/* Filter pills */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="overflow-hidden border-b border-border"
                >
                  <div className="flex flex-wrap gap-1 px-3 py-2">
                    {FILTER_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setFilter(opt.value)}
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-medium transition-colors",
                          filter === opt.value
                            ? "bg-[var(--tome-accent)] text-[#111]"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                  <Bell className="size-8 text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground font-medium">No notifications yet</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    Start reading to earn your first Seal.
                  </p>
                </div>
              ) : (
                grouped.map((group) => (
                  <div key={group.label}>
                    {/* Day divider */}
                    <div className="sticky top-0 px-4 py-1.5 text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider bg-popover/95 backdrop-blur-sm border-b border-border/30">
                      {group.label}
                    </div>
                    {group.notifications.map((notif) => {
                      const Icon = getNotifIcon(notif.icon)
                      return (
                        <button
                          key={notif.id}
                          onClick={() => handleClick(notif)}
                          className={cn(
                            "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors border-b border-border/30 last:border-0",
                            "hover:bg-muted/50",
                            !notif.read && "bg-[#D4A04C]/[0.03]",
                            getPriorityBg(notif.priority)
                          )}
                        >
                          {/* Unread dot */}
                          <div className="flex flex-col items-center gap-1 pt-1">
                            {!notif.read && (
                              <div className="size-1.5 rounded-full bg-[#D4A04C] shrink-0" />
                            )}
                            {notif.read && <div className="size-1.5 shrink-0" />}
                          </div>

                          {/* Icon */}
                          <div
                            className={cn(
                              "flex size-8 shrink-0 items-center justify-center rounded-lg mt-0.5",
                              notif.priority === "celebration" ? "bg-[#D4A04C]/15" : "bg-muted"
                            )}
                          >
                            <Icon className={cn("size-4", getPriorityColor(notif.priority))} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className={cn(
                              "text-xs leading-snug",
                              !notif.read ? "font-semibold text-foreground" : "font-medium text-foreground/80"
                            )}>
                              {notif.title}
                            </p>
                            {notif.body && (
                              <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                                {notif.body}
                              </p>
                            )}
                            <p className="text-[10px] text-muted-foreground/50 mt-1">
                              {formatNotificationTime(notif.createdAt)}
                            </p>
                          </div>

                          {/* Painting thumbnail (if present) */}
                          {notif.imageUrl && (
                            <div className="size-10 shrink-0 rounded-md overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={notif.imageUrl}
                                alt=""
                                className="size-full object-cover"
                              />
                            </div>
                          )}
                        </button>
                      )
                    })}
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {filtered.length > 0 && (
              <div className="border-t border-border px-4 py-2">
                <button
                  onClick={() => { router.push("/notifications"); setOpen(false) }}
                  className="text-[11px] text-[var(--tome-accent)] hover:underline underline-offset-2 font-medium"
                >
                  See all notifications →
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
