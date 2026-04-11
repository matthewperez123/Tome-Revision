"use client"

import { useEffect, useState, useCallback } from "react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

export interface DbNotification {
  id: string
  type: string
  title: string
  body: string | null
  action_url: string | null
  read: boolean
  created_at: string
}

// Demo notifications for teacher preview
const DEMO_TEACHER_NOTIFICATIONS: DbNotification[] = [
  {
    id: "dn-1",
    type: "quiz_completed",
    title: "Sofia Rodriguez scored 97% on Odyssey Trial",
    body: "Books 1–6 Quiz · AP Literature — Period 3",
    action_url: "/classroom/class-1",
    read: false,
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
  },
  {
    id: "dn-2",
    type: "assignment_submitted",
    title: "Marcus Williams submitted Discussion Response",
    body: "The Odyssey — Books 1–6 · Hospitality theme analysis",
    action_url: "/classroom/grading",
    read: false,
    created_at: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: "dn-3",
    type: "quiz_completed",
    title: "Liam Foster scored 88% on Odyssey Trial",
    body: "Books 1–6 Quiz · AP Literature — Period 3",
    action_url: "/classroom/class-1",
    read: false,
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "dn-4",
    type: "student_joined",
    title: "New student joined AP Literature — Period 3",
    body: "Aisha Patel joined using code TOME42",
    action_url: "/classroom/class-1",
    read: false,
    created_at: new Date(Date.now() - 4 * 3600000).toISOString(),
  },
  {
    id: "dn-5",
    type: "book_completed",
    title: "Emma Chen finished The Odyssey",
    body: "First student in AP Lit to complete all 24 books!",
    action_url: "/classroom/class-1",
    read: true,
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
  },
  {
    id: "dn-6",
    type: "student_at_risk",
    title: "3 students behind on The Republic assignment",
    body: "Overdue since Apr 8 · World Literature",
    action_url: "/classroom/class-2",
    read: true,
    created_at: new Date(Date.now() - 8 * 3600000).toISOString(),
  },
  {
    id: "dn-7",
    type: "all_submitted",
    title: "All students submitted Pride & Prejudice essay",
    body: "24/24 submissions received · Ready to grade",
    action_url: "/classroom/grading",
    read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "dn-8",
    type: "streak_milestone",
    title: "Marcus Williams hit a 14-day reading streak",
    body: "AP Literature — Period 3",
    action_url: "/classroom/class-1",
    read: true,
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
  },
  {
    id: "dn-9",
    type: "assignment_submitted",
    title: "Aisha Patel submitted Annotation Assignment",
    body: "The Odyssey Books 1–6 · 8 annotations",
    action_url: "/classroom/grading",
    read: true,
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
  },
  {
    id: "dn-10",
    type: "quiz_completed",
    title: "James O'Brien scored 72% on Odyssey Trial",
    body: "Books 1–6 Quiz · Below passing threshold",
    action_url: "/classroom/class-1",
    read: true,
    created_at: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
]

// Demo notifications for student/reader preview
const DEMO_READER_NOTIFICATIONS: DbNotification[] = [
  {
    id: "rn-1",
    type: "chapter_completed",
    title: "Chapter completed: The Odyssey, Book 5",
    body: "+5 XP earned",
    action_url: "/read/the-odyssey",
    read: false,
    created_at: new Date(Date.now() - 30 * 60000).toISOString(),
  },
  {
    id: "rn-2",
    type: "flame_milestone",
    title: "5-day reading streak!",
    body: "Keep it going — read today to maintain your streak",
    action_url: "/dashboard",
    read: false,
    created_at: new Date(Date.now() - 3 * 3600000).toISOString(),
  },
  {
    id: "rn-3",
    type: "seal_earned",
    title: "Achievement unlocked: Odyssey Explorer",
    body: "Read 5 chapters of The Odyssey",
    action_url: "/achievements",
    read: true,
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
]

export function useRealtimeNotifications() {
  const { user, isDemoMode, role } = useAuth()
  const [notifications, setNotifications] = useState<DbNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch initial notifications
  useEffect(() => {
    // Demo mode: use demo notifications
    if (isDemoMode || !user) {
      const demoData = role === "teacher" ? DEMO_TEACHER_NOTIFICATIONS : DEMO_READER_NOTIFICATIONS
      setNotifications(demoData)
      setUnreadCount(demoData.filter((n) => !n.read).length)
      setLoading(false)
      return
    }

    async function fetchNotifications() {
      const supabase = createClient()

      const { data } = await supabase
        .from("db_notifications")
        .select("id, type, title, body, action_url, read, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20)

      if (data?.length) {
        setNotifications(data)
        setUnreadCount(data.filter((n) => !n.read).length)
      } else {
        // Fallback to demo if no real notifications
        const demoData = role === "teacher" ? DEMO_TEACHER_NOTIFICATIONS : DEMO_READER_NOTIFICATIONS
        setNotifications(demoData)
        setUnreadCount(demoData.filter((n) => !n.read).length)
      }

      setLoading(false)
    }

    fetchNotifications()
  }, [user, isDemoMode, role])

  // Subscribe to real-time inserts (only when authenticated)
  useEffect(() => {
    if (!user || isDemoMode) return

    const supabase = createClient()

    const channel = supabase
      .channel("notifications-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "db_notifications",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const newNotification = payload.new as DbNotification
          setNotifications((prev) => [newNotification, ...prev].slice(0, 50))
          setUnreadCount((prev) => prev + 1)
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, isDemoMode])

  const markAsRead = useCallback(async (id: string) => {
    if (!isDemoMode && user) {
      const supabase = createClient()
      await supabase.from("db_notifications").update({ read: true }).eq("id", id)
    }

    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
    setUnreadCount((prev) => Math.max(0, prev - 1))
  }, [user, isDemoMode])

  const markAllAsRead = useCallback(async () => {
    if (!isDemoMode && user) {
      const supabase = createClient()
      await supabase
        .from("db_notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)
    }

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    setUnreadCount(0)
  }, [user, isDemoMode])

  return { notifications, unreadCount, loading, markAsRead, markAllAsRead }
}
