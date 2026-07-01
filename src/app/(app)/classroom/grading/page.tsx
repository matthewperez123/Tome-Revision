"use client"

import { useEffect, useState, useCallback } from "react"
import { ClipboardCheck, ChevronRight, Send } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { gradeSubmission } from "@/lib/actions/grades"

interface GradingItem {
  submission_id: string
  student_name: string
  assignment_title: string
  assignment_type: string
  classroom_name: string
  response_text: string | null
  submitted_at: string
  points_available: number
  // grading fields
  score: number | null
  feedback: string
}

export default function GradingQueuePage() {
  const { user, isDemoMode } = useAuth()
  const [items, setItems] = useState<GradingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [grading, setGrading] = useState(false)

  useEffect(() => {
    if (isDemoMode || !user) {
      setItems([])
      setLoading(false)
      return
    }

    async function fetchQueue() {
      const supabase = createClient()

      const { data } = await supabase
        .from("assignment_submissions")
        .select(`
          id,
          response_text,
          submitted_at,
          score,
          student_id,
          profiles!assignment_submissions_student_id_fkey(display_name),
          assignments!inner(title, type, classroom_id, teacher_id, points_available, classrooms(name))
        `)
        .eq("status", "submitted")
        .eq("assignments.teacher_id", user!.id)
        .order("submitted_at", { ascending: false })

      setItems(
        (data ?? []).map((d) => ({
          submission_id: d.id,
          student_name: ((d as any).profiles as { display_name: string } | null)?.display_name ?? "Student",
          assignment_title: ((d as any).assignments as { title: string })?.title ?? "",
          assignment_type: ((d as any).assignments as { type: string })?.type ?? "",
          classroom_name: (((d as any).assignments as { classrooms: { name: string } })?.classrooms as { name: string })?.name ?? "",
          response_text: d.response_text,
          submitted_at: d.submitted_at,
          points_available: ((d as any).assignments as { points_available: number })?.points_available ?? 100,
          score: d.score,
          feedback: "",
        })),
      )

      setLoading(false)
    }

    fetchQueue()
  }, [user, isDemoMode])

  const handleGrade = useCallback(async (index: number) => {
    const item = items[index]
    if (!item || item.score === null) return
    setGrading(true)

    // Canonical write: grades table (+ grade_history audit on re-grade) with the
    // denormalized submission cache mirrored and the student notified — all via
    // the grader-gated server action, never a direct client write.
    const res = await gradeSubmission({
      submissionId: item.submission_id,
      score: item.score,
      feedback: item.feedback.trim() || undefined,
    })
    setGrading(false)
    if (!res.ok) {
      toast.error(res.error)
      return
    }
    toast.success("Grade saved")
    // Remove from queue
    setItems((prev) => prev.filter((_, i) => i !== index))
    setSelectedIndex(null)
  }, [items])

  const updateItem = (index: number, updates: Partial<GradingItem>) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...updates } : item)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="size-6 text-amber-500" />
        <h1 className="text-2xl font-bold">Grading Queue</h1>
        {items.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            {items.length} to grade
          </span>
        )}
      </div>

      {items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950/30">
            <ClipboardCheck className="size-7 text-green-500" />
          </div>
          <h2 className="mt-4 text-lg font-semibold">All caught up!</h2>
          <p className="mt-1 text-sm text-muted-foreground">No submissions to grade right now.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1fr]">
          {/* Submission list */}
          <div className="space-y-2">
            {items.map((item, i) => (
              <button
                key={item.submission_id}
                onClick={() => setSelectedIndex(i)}
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
                  selectedIndex === i
                    ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30"
                    : "border-border bg-card hover:bg-muted/50"
                }`}
              >
                <div className="flex size-9 items-center justify-center rounded-full bg-muted text-sm font-medium">
                  {item.student_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.student_name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.assignment_title} · {item.classroom_name}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(item.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Grading panel */}
          {selectedIndex !== null && items[selectedIndex] && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{items[selectedIndex].student_name}</h3>
              <p className="text-xs text-muted-foreground">
                {items[selectedIndex].assignment_title} · {items[selectedIndex].assignment_type}
              </p>

              <div className="mt-4 rounded-lg border bg-muted/30 p-4">
                <p className="text-sm whitespace-pre-wrap">
                  {items[selectedIndex].response_text || "No written response submitted."}
                </p>
              </div>

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Score (of {items[selectedIndex].points_available})
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={items[selectedIndex].points_available}
                    value={items[selectedIndex].score ?? ""}
                    onChange={(e) => updateItem(selectedIndex, { score: Number(e.target.value) })}
                    placeholder={`0-${items[selectedIndex].points_available}`}
                    className="w-24"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Feedback</label>
                  <textarea
                    value={items[selectedIndex].feedback}
                    onChange={(e) => updateItem(selectedIndex, { feedback: e.target.value })}
                    placeholder="Write feedback for the student..."
                    rows={3}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button
                  onClick={() => handleGrade(selectedIndex)}
                  disabled={items[selectedIndex].score === null || grading}
                  className="w-full gap-1.5"
                >
                  <Send className="size-3.5" />
                  {grading ? "Submitting..." : "Submit Grade"}
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
