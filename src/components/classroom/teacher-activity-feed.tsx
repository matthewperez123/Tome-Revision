"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trophy, BookOpen, Brain, UserPlus, AlertTriangle, Flame } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface ActivityItem {
  id: string
  type: string
  title: string
  body: string | null
  action_url: string | null
  created_at: string
}

const TYPE_ICONS: Record<string, typeof Trophy> = {
  quiz_completed: Brain,
  assignment_submitted: BookOpen,
  book_completed: Trophy,
  student_joined: UserPlus,
  student_at_risk: AlertTriangle,
  streak_milestone: Flame,
}

const TYPE_COLORS: Record<string, string> = {
  quiz_completed: "text-purple-500 bg-purple-50 dark:bg-purple-950/30",
  assignment_submitted: "text-blue-500 bg-blue-50 dark:bg-blue-950/30",
  book_completed: "text-green-500 bg-green-50 dark:bg-green-950/30",
  student_joined: "text-indigo-500 bg-indigo-50 dark:bg-indigo-950/30",
  student_at_risk: "text-amber-500 bg-amber-50 dark:bg-amber-950/30",
  streak_milestone: "text-orange-500 bg-orange-50 dark:bg-orange-950/30",
}

const DEMO_ACTIVITY_CLASS1: ActivityItem[] = [
  { id: "d1", type: "quiz_completed", title: "Sofia Rodriguez scored 97% on Odyssey Trial", body: "Books 1–6 Quiz", action_url: "/classroom/class-1", created_at: new Date(Date.now() - 30 * 60000).toISOString() },
  { id: "d2", type: "assignment_submitted", title: "Liam Foster completed The Odyssey Books 1–6", body: null, action_url: "/classroom/class-1", created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: "d4", type: "book_completed", title: "Emma Chen finished The Odyssey", body: "First student to complete!", action_url: "/classroom/class-1", created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
  { id: "d5", type: "streak_milestone", title: "Marcus Williams hit a 14-day streak", body: null, action_url: "/classroom/class-1", created_at: new Date(Date.now() - 24 * 3600000).toISOString() },
  { id: "d7", type: "quiz_completed", title: "James O'Brien scored 72% on Odyssey Trial", body: "Below passing threshold", action_url: "/classroom/class-1", created_at: new Date(Date.now() - 36 * 3600000).toISOString() },
]

const DEMO_ACTIVITY_CLASS2: ActivityItem[] = [
  { id: "d3", type: "student_at_risk", title: "3 students haven't started The Republic", body: "Books I–IV overdue", action_url: "/classroom/class-2", created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: "d6", type: "student_joined", title: "New student joined World Literature", body: "Aisha Patel", action_url: "/classroom/class-2", created_at: new Date(Date.now() - 48 * 3600000).toISOString() },
  { id: "d8", type: "assignment_submitted", title: "Tobias Grant submitted Republic essay", body: "1,200 words", action_url: "/classroom/class-2", created_at: new Date(Date.now() - 4 * 3600000).toISOString() },
  { id: "d9", type: "quiz_completed", title: "Linnaeus Park scored 84% on Republic Quiz", body: "Books I–IV", action_url: "/classroom/class-2", created_at: new Date(Date.now() - 12 * 3600000).toISOString() },
  { id: "d10", type: "book_completed", title: "Cordelia Shaw finished The Republic", body: null, action_url: "/classroom/class-2", created_at: new Date(Date.now() - 72 * 3600000).toISOString() },
]

const DEMO_ACTIVITY_ALL: ActivityItem[] = [
  ...DEMO_ACTIVITY_CLASS1.slice(0, 3),
  ...DEMO_ACTIVITY_CLASS2.slice(0, 2),
  ...DEMO_ACTIVITY_CLASS1.slice(3),
].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

function getDemoActivity(classroomId?: string): ActivityItem[] {
  if (classroomId === "class-1") return DEMO_ACTIVITY_CLASS1
  if (classroomId === "class-2") return DEMO_ACTIVITY_CLASS2
  return DEMO_ACTIVITY_ALL
}

function formatTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function TeacherActivityFeed({ classroomId }: { classroomId?: string }) {
  const { user, isDemoMode } = useAuth()
  const [items, setItems] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode || !user) {
      setItems(getDemoActivity(classroomId))
      setLoading(false)
      return
    }

    async function fetchActivity() {
      const supabase = createClient()

      const { data } = await supabase
        .from("notifications")
        .select("id, type, payload, created_at")
        .eq("recipient_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(8)

      const rows: ActivityItem[] | undefined = data?.map((n) => {
        const p = (n.payload ?? {}) as {
          title?: string
          body?: string | null
          action_url?: string | null
        }
        return {
          id: n.id,
          type: n.type,
          title: p.title ?? "",
          body: p.body ?? null,
          action_url: p.action_url ?? null,
          created_at: n.created_at,
        }
      })

      setItems(rows?.length ? rows : getDemoActivity(classroomId))
      setLoading(false)
    }

    fetchActivity()
  }, [user, isDemoMode, classroomId])

  return (
    <div className="rounded-2xl border bg-card p-5">
      <h3 className="text-sm font-semibold">Recent Activity</h3>

      {loading ? (
        <div className="mt-4 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="size-8 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 space-y-1.5">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? BookOpen
            const colorClass = TYPE_COLORS[item.type] ?? "text-muted-foreground bg-muted"

            const content = (
              <div className="flex items-start gap-3 rounded-lg p-2 transition-colors hover:bg-muted/50">
                <div className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${colorClass}`}>
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-snug">{item.title}</p>
                  {item.body && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">{item.body}</p>
                  )}
                </div>
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  {formatTimeAgo(item.created_at)}
                </span>
              </div>
            )

            return item.action_url ? (
              <Link key={item.id} href={item.action_url}>
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            )
          })}
        </div>
      )}
    </div>
  )
}
