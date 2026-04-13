"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { ClipboardCheck, ChevronRight, Send, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/hooks/use-auth"

interface GradingItem {
  submission_id: string
  student_name: string
  assignment_title: string
  assignment_type: string
  classroom_name: string
  response_text: string | null
  submitted_at: string
  // grading fields
  score: number | null
  feedback: string
}

const DEMO_GRADING: GradingItem[] = [
  {
    submission_id: "demo-1",
    student_name: "Marcus Williams",
    assignment_title: "The Odyssey — Books 1–6 Discussion",
    assignment_type: "discussion",
    classroom_name: "AP Literature — Period 3",
    response_text: "The theme of hospitality (xenia) in The Odyssey serves as both a moral compass and a narrative device. Homer uses the contrast between proper hosts like Nestor and Menelaus versus the Cyclops to illustrate the civilization–barbarism divide. The elaborate feasting scenes aren't just filler — they establish a code of conduct that Odysseus relies on throughout his journey. When Polyphemus violates xenia, it's not just rude — it's an affront to Zeus himself. This connects to the broader theme of divine justice that runs through the epic.",
    submitted_at: new Date(Date.now() - 3 * 3600000).toISOString(),
    score: null,
    feedback: "",
  },
  {
    submission_id: "demo-2",
    student_name: "Aisha Patel",
    assignment_title: "The Odyssey — Books 1–6 Discussion",
    assignment_type: "discussion",
    classroom_name: "AP Literature — Period 3",
    response_text: "I think the most interesting part of Books 1-6 is how Telemachus grows up. At the start he's basically helpless against the suitors, but by the time Athena sends him on his journey, he's starting to become more like his father. The parallel between father and son's journeys is really effective storytelling.",
    submitted_at: new Date(Date.now() - 8 * 3600000).toISOString(),
    score: null,
    feedback: "",
  },
  {
    submission_id: "es-1",
    student_name: "Emma Chen",
    assignment_title: "The Odyssey — Metis vs. Bie Essay",
    assignment_type: "essay",
    classroom_name: "AP Literature — Period 3",
    response_text: "In Homer's Odyssey, the concept of heroism undergoes a fundamental transformation...",
    submitted_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    score: null,
    feedback: "",
  },
  {
    submission_id: "es-2",
    student_name: "James O'Brien",
    assignment_title: "The Odyssey — Metis vs. Bie Essay",
    assignment_type: "essay",
    classroom_name: "AP Literature — Period 3",
    response_text: "The Odyssey by Homer is about Odysseus trying to get home after the Trojan War...",
    submitted_at: new Date(Date.now() - 20 * 3600000).toISOString(),
    score: null,
    feedback: "",
  },
  {
    submission_id: "es-3",
    student_name: "Sofia Rodriguez",
    assignment_title: "Pride and Prejudice — Irony Analysis Essay",
    assignment_type: "essay",
    classroom_name: "AP Literature — Period 3",
    response_text: "Jane Austen opens Pride and Prejudice with one of literature's most celebrated examples of verbal irony...",
    submitted_at: new Date(Date.now() - 18 * 3600000).toISOString(),
    score: null,
    feedback: "",
  },
  {
    submission_id: "es-4",
    student_name: "Olivia Kim",
    assignment_title: "Pride and Prejudice — Irony Analysis Essay",
    assignment_type: "essay",
    classroom_name: "AP Literature — Period 3",
    response_text: "Pride and Prejudice uses irony a lot. The first sentence is ironic...",
    submitted_at: new Date(Date.now() - 16 * 3600000).toISOString(),
    score: null,
    feedback: "",
  },
]

export default function GradingQueuePage() {
  const { user, isDemoMode } = useAuth()
  const [items, setItems] = useState<GradingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [grading, setGrading] = useState(false)

  useEffect(() => {
    if (isDemoMode || !user) {
      setItems(DEMO_GRADING)
      setSelectedIndex(0)
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
          assignments!inner(title, type, classroom_id, teacher_id, classrooms(name))
        `)
        .eq("status", "submitted")
        .eq("assignments.teacher_id", user!.id)
        .order("submitted_at", { ascending: false })

      if (data?.length) {
        setItems(
          data.map((d) => ({
            submission_id: d.id,
            student_name: ((d as any).profiles as { display_name: string } | null)?.display_name ?? "Student",
            assignment_title: ((d as any).assignments as { title: string })?.title ?? "",
            assignment_type: ((d as any).assignments as { type: string })?.type ?? "",
            classroom_name: (((d as any).assignments as { classrooms: { name: string } })?.classrooms as { name: string })?.name ?? "",
            response_text: d.response_text,
            submitted_at: d.submitted_at,
            score: d.score,
            feedback: "",
          })),
        )
      } else {
        setItems(DEMO_GRADING)
        setSelectedIndex(0)
      }

      setLoading(false)
    }

    fetchQueue()
  }, [user])

  const handleGrade = useCallback(async (index: number) => {
    const item = items[index]
    if (!item || item.score === null) return
    setGrading(true)

    const supabase = createClient()

    await supabase
      .from("assignment_submissions")
      .update({
        status: "graded",
        score: item.score,
        feedback: item.feedback || null,
        graded_at: new Date().toISOString(),
        graded_by: user!.id,
      })
      .eq("id", item.submission_id)

    // Remove from queue
    setItems((prev) => prev.filter((_, i) => i !== index))
    setSelectedIndex(null)
    setGrading(false)
  }, [items, user])

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

              {/* AI essay grading link */}
              {items[selectedIndex].assignment_type === "essay" && (
                <Link href={`/classroom/grading/essay/${items[selectedIndex].submission_id}`}>
                  <Button variant="outline" className="w-full mt-3 gap-1.5 border-[var(--tome-accent)]/30 text-[var(--tome-accent)] hover:bg-[var(--tome-accent)]/5">
                    <Sparkles className="size-3.5" /> Open AI Grading Assistant
                  </Button>
                </Link>
              )}

              <div className="mt-4 space-y-3">
                <div>
                  <label className="mb-1 block text-sm font-medium">Score</label>
                  <Input
                    type="number"
                    min={0}
                    max={100}
                    value={items[selectedIndex].score ?? ""}
                    onChange={(e) => updateItem(selectedIndex, { score: Number(e.target.value) })}
                    placeholder="0-100"
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
