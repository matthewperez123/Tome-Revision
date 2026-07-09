"use client"

import { useEffect, useState, useCallback } from "react"
import { ClipboardCheck, ChevronRight, Send, Sparkles, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"
import { gradeSubmission } from "@/lib/actions/grades"

// The iridescent gradient is reserved app-wide for Virgil affordances only —
// identical to the guided-session assistant + semester-planner signature.
const VIRGIL_IRIDESCENT =
  "linear-gradient(110deg, #6366F1 0%, #8B5CF6 35%, #06B6D4 70%, #6366F1 100%)"

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
  // Virgil draft provenance: the score Virgil proposed (null until drafted), and
  // whatever it flagged as strengths / improvements for the teacher to weigh.
  ai_draft_score: number | null
  ai_notes: { strengths: string[]; improvements: string[] } | null
}

interface VirgilDraftResponse {
  score?: number
  feedback?: string
  strengths?: string[]
  improvements?: string[]
  error?: string
}

export default function GradingQueuePage() {
  const { user, isDemoMode } = useAuth()
  const [items, setItems] = useState<GradingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [grading, setGrading] = useState(false)
  const [virgilBusy, setVirgilBusy] = useState<string | null>(null)
  const [draftingAll, setDraftingAll] = useState(false)

  const fetchQueue = useCallback(async () => {
    if (isDemoMode || !user) {
      setItems([])
      setLoading(false)
      return
    }
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
      .eq("assignments.teacher_id", user.id)
      .order("submitted_at", { ascending: false })

    // Preserve any in-flight Virgil drafts / edits the teacher has open so a
    // background refetch never wipes unsaved work.
    setItems((prev) => {
      const byId = new Map(prev.map((it) => [it.submission_id, it]))
      return (data ?? []).map((d) => {
        const existing = byId.get(d.id)
        return {
          submission_id: d.id,
          student_name: ((d as any).profiles as { display_name: string } | null)?.display_name ?? "Student",
          assignment_title: ((d as any).assignments as { title: string })?.title ?? "",
          assignment_type: ((d as any).assignments as { type: string })?.type ?? "",
          classroom_name: (((d as any).assignments as { classrooms: { name: string } })?.classrooms as { name: string })?.name ?? "",
          response_text: d.response_text,
          submitted_at: d.submitted_at,
          points_available: ((d as any).assignments as { points_available: number })?.points_available ?? 100,
          score: existing?.score ?? d.score,
          feedback: existing?.feedback ?? "",
          ai_draft_score: existing?.ai_draft_score ?? null,
          ai_notes: existing?.ai_notes ?? null,
        }
      })
    })

    setLoading(false)
  }, [user, isDemoMode])

  useEffect(() => {
    void fetchQueue()
  }, [fetchQueue])

  // Live: a new student submission drops into the queue without a reload. RLS
  // scopes realtime delivery to this teacher's classrooms (submissions_staff_
  // select via user_has_classroom_role), so an unfiltered subscription is safe.
  useEffect(() => {
    if (isDemoMode || !user) return
    const supabase = createClient()
    const channel = supabase
      .channel(`grading-queue:${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assignment_submissions" },
        () => void fetchQueue(),
      )
      .subscribe()
    return () => {
      void supabase.removeChannel(channel)
    }
  }, [user, isDemoMode, fetchQueue])

  const updateItem = useCallback((submissionId: string, updates: Partial<GradingItem>) => {
    setItems((prev) => prev.map((it) => (it.submission_id === submissionId ? { ...it, ...updates } : it)))
  }, [])

  // Ask Virgil for a DRAFT — a proposed score + feedback that is NOT persisted.
  // It pre-fills the editable inputs for the teacher to review, tweak, and
  // finalize. Repeatable (Regenerate), bounded per-object per day server-side.
  const draftWithVirgil = useCallback(
    async (submissionId: string): Promise<boolean> => {
      const res = await fetch("/api/virgil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: "grade_response", input: { submissionId } }),
      })
      const data = (await res.json().catch(() => null)) as VirgilDraftResponse | null
      if (!res.ok || !data || typeof data.score !== "number") {
        toast.error(data?.error ?? "Virgil couldn't draft a grade.")
        return false
      }
      updateItem(submissionId, {
        score: data.score,
        feedback: data.feedback ?? "",
        ai_draft_score: data.score,
        ai_notes: {
          strengths: data.strengths ?? [],
          improvements: data.improvements ?? [],
        },
      })
      return true
    },
    [updateItem],
  )

  const handleVirgilDraft = useCallback(
    async (submissionId: string) => {
      setVirgilBusy(submissionId)
      try {
        await draftWithVirgil(submissionId)
      } finally {
        setVirgilBusy(null)
      }
    },
    [draftWithVirgil],
  )

  // Sequentially draft every ungraded essay that Virgil hasn't drafted yet. Each
  // draft stays a proposal — the teacher still reviews + finalizes each one.
  const handleDraftRemaining = useCallback(async () => {
    const targets = items.filter(
      (it) => it.assignment_type === "essay" && it.response_text && it.ai_draft_score === null,
    )
    if (targets.length === 0) return
    setDraftingAll(true)
    let done = 0
    try {
      for (const it of targets) {
        setVirgilBusy(it.submission_id)
        const okDraft = await draftWithVirgil(it.submission_id)
        if (okDraft) done += 1
        else break // a cap or error — stop the batch rather than hammer the API
      }
    } finally {
      setVirgilBusy(null)
      setDraftingAll(false)
      if (done > 0) {
        toast.success(
          `Virgil drafted ${done} ${done === 1 ? "essay" : "essays"} — review each before finalizing.`,
        )
      }
    }
  }, [items, draftWithVirgil])

  // Finalize: the canonical write goes through gradeSubmission (grades table +
  // submission cache mirror + student notify). The grade_history audit row is
  // written automatically by the trg_mirror_grade_to_history DB trigger, so no
  // write path can bypass the mirror.
  const handleFinalize = useCallback(
    async (submissionId: string) => {
      const item = items.find((it) => it.submission_id === submissionId)
      if (!item || item.score === null) return
      setGrading(true)
      const res = await gradeSubmission({
        submissionId,
        score: item.score,
        feedback: item.feedback.trim() || undefined,
      })
      setGrading(false)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success("Grade saved")
      setItems((prev) => prev.filter((it) => it.submission_id !== submissionId))
      setSelectedIndex(null)
    },
    [items],
  )

  const essayDraftableCount = items.filter(
    (it) => it.assignment_type === "essay" && it.response_text && it.ai_draft_score === null,
  ).length

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="size-6 animate-spin rounded-full border-2 border-muted border-t-foreground" />
      </div>
    )
  }

  const selected = selectedIndex !== null ? items[selectedIndex] : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex flex-wrap items-center gap-3">
        <ClipboardCheck className="size-6 text-amber-500" />
        <h1 className="text-2xl font-bold">Grading Queue</h1>
        {items.length > 0 && (
          <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            {items.length} to grade
          </span>
        )}
        {essayDraftableCount > 0 && (
          <button
            onClick={handleDraftRemaining}
            disabled={draftingAll || grading}
            className="ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-opacity disabled:opacity-60"
            style={{ backgroundImage: VIRGIL_IRIDESCENT }}
          >
            <Sparkles className="size-3.5" />
            {draftingAll ? "Virgil is drafting…" : `Draft remaining with Virgil (${essayDraftableCount})`}
          </button>
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
                {item.ai_draft_score !== null && (
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold text-white"
                    style={{ backgroundImage: VIRGIL_IRIDESCENT }}
                  >
                    Draft
                  </span>
                )}
                <span className="text-xs text-muted-foreground">
                  {new Date(item.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </span>
                <ChevronRight className="size-4 text-muted-foreground" />
              </button>
            ))}
          </div>

          {/* Grading panel */}
          {selected && (
            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-semibold">{selected.student_name}</h3>
              <p className="text-xs text-muted-foreground">
                {selected.assignment_title} · {selected.assignment_type}
              </p>

              <div className="mt-4 max-h-64 overflow-y-auto rounded-lg border bg-muted/30 p-4">
                <p className="whitespace-pre-wrap text-sm">
                  {selected.response_text || "No written response submitted."}
                </p>
              </div>

              {selected.ai_draft_score !== null && (
                <div className="mt-4 rounded-lg p-[1.5px]" style={{ backgroundImage: VIRGIL_IRIDESCENT }}>
                  <div className="rounded-[calc(0.5rem-1.5px)] bg-card p-3">
                    <div className="flex items-center gap-1.5 text-xs font-semibold">
                      <Sparkles className="size-3.5 text-indigo-500" />
                      Virgil&apos;s draft — review before finalizing
                    </div>
                    {selected.ai_notes && selected.ai_notes.strengths.length > 0 && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">Strengths:</span>{" "}
                        {selected.ai_notes.strengths.join("; ")}
                      </p>
                    )}
                    {selected.ai_notes && selected.ai_notes.improvements.length > 0 && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        <span className="font-medium text-foreground">To improve:</span>{" "}
                        {selected.ai_notes.improvements.join("; ")}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Score (of {selected.points_available})
                  </label>
                  <Input
                    type="number"
                    min={0}
                    max={selected.points_available}
                    value={selected.score ?? ""}
                    onChange={(e) => updateItem(selected.submission_id, { score: Number(e.target.value) })}
                    placeholder={`0-${selected.points_available}`}
                    className="w-24"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Feedback</label>
                  <textarea
                    value={selected.feedback}
                    onChange={(e) => updateItem(selected.submission_id, { feedback: e.target.value })}
                    placeholder="Write feedback for the student..."
                    rows={4}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <Button
                  onClick={() => handleFinalize(selected.submission_id)}
                  disabled={selected.score === null || grading || virgilBusy !== null}
                  className="w-full gap-1.5"
                >
                  <Send className="size-3.5" />
                  {grading
                    ? "Saving…"
                    : selected.ai_draft_score !== null
                      ? "Accept & finalize"
                      : "Submit Grade"}
                </Button>
                {selected.assignment_type === "essay" && (
                  <Button
                    variant="outline"
                    onClick={() => handleVirgilDraft(selected.submission_id)}
                    disabled={grading || virgilBusy !== null || !selected.response_text}
                    className="w-full gap-1.5"
                  >
                    {selected.ai_draft_score !== null ? (
                      <RefreshCw className="size-3.5" />
                    ) : (
                      <Sparkles className="size-3.5" />
                    )}
                    {virgilBusy === selected.submission_id
                      ? "Virgil is grading…"
                      : selected.ai_draft_score !== null
                        ? "Regenerate draft"
                        : "Grade with Virgil"}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
