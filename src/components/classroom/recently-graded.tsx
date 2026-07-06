"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BookOpen, Brain, MessageCircle, PenTool, Highlighter, ChevronRight } from "lucide-react"
import { BlurFade } from "@/components/ui/blur-fade"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { RUBRIC } from "@/lib/semester-plan/rubric"

interface GradedItem {
  submissionId: string
  assignmentId: string
  classroomId: string
  title: string
  type: keyof typeof TYPE_ICONS
  score: number | null
  pointsAvailable: number
  feedback: string | null
  gradedAt: string
}

const TYPE_ICONS = {
  reading: BookOpen,
  quiz: Brain,
  discussion: MessageCircle,
  essay: PenTool,
  annotation: Highlighter,
  trial: Brain,
  chapter_read: BookOpen,
}

// Score → RUBRIC accent. Gold for strong, verdigris for solid, vermilion for low.
function scoreColor(pct: number): string {
  if (pct >= 85) return RUBRIC.goldLeaf
  if (pct >= 60) return RUBRIC.verdigris
  return RUBRIC.vermilion
}

export function RecentlyGraded() {
  const { user, isLoading: authLoading } = useAuth()
  const [items, setItems] = useState<GradedItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Wait for auth to settle before treating a null user as signed-out.
    if (authLoading) return
    if (!user) {
      setLoading(false)
      return
    }

    async function fetchGraded() {
      const supabase = createClient()
      const { data } = await supabase
        .from("assignment_submissions")
        .select(
          "id, assignment_id, score, feedback, graded_at, assignment:assignments(title, type, classroom_id, points_available)",
        )
        .eq("student_id", user!.id)
        .eq("status", "graded")
        .not("graded_at", "is", null)
        .order("graded_at", { ascending: false })
        .limit(3)

      type Row = {
        id: string
        assignment_id: string
        score: number | null
        feedback: string | null
        graded_at: string | null
        assignment: {
          title: string
          type: string
          classroom_id: string
          points_available: number | null
        } | null
      }

      const rows = ((data ?? []) as unknown as Row[]).filter((r) => r.assignment)
      setItems(
        rows.map((r) => ({
          submissionId: r.id,
          assignmentId: r.assignment_id,
          classroomId: r.assignment!.classroom_id,
          title: r.assignment!.title,
          type: (r.assignment!.type as GradedItem["type"]) ?? "reading",
          score: r.score,
          pointsAvailable: r.assignment!.points_available ?? 100,
          feedback: r.feedback,
          gradedAt: r.graded_at!,
        })),
      )
      setLoading(false)
    }

    fetchGraded()
  }, [user, authLoading])

  if (loading || items.length === 0) return null

  return (
    <BlurFade delay={0.1}>
      <div className="rounded-2xl border bg-card p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Recently graded</h3>
          <Link
            href="/classroom"
            className="flex items-center gap-0.5 text-xs text-muted-foreground hover:text-foreground"
          >
            View all <ChevronRight className="size-3" />
          </Link>
        </div>

        <div className="mt-3 space-y-2">
          {items.map((item) => {
            const Icon = TYPE_ICONS[item.type] ?? BookOpen
            const pct =
              item.score != null
                ? Math.round((item.score / Math.max(item.pointsAvailable, 1)) * 100)
                : null
            return (
              <Link
                key={item.submissionId}
                href={`/classroom/${item.classroomId}/assignment/${item.assignmentId}`}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 transition-colors hover:border-border hover:bg-muted/50"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Icon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  {item.feedback && (
                    <p className="truncate text-xs text-muted-foreground">{item.feedback}</p>
                  )}
                </div>
                {pct != null && (
                  <span
                    className="shrink-0 text-sm font-bold tabular-nums"
                    style={{ color: scoreColor(pct) }}
                  >
                    {pct}%
                  </span>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </BlurFade>
  )
}
