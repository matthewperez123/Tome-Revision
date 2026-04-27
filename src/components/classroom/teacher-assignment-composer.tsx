"use client"

import { useEffect, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { ClipboardList, Sparkles, Users, UserPlus, Layers } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { createAssignment } from "@/lib/actions/assignments"

type Scope = "classroom" | "group" | "individuals"
type Type = "chapter_read" | "trial"

/**
 * "New assignment" composer for the classroom detail page.
 *
 * Renders only for real-mode owner/co_teacher of THIS classroom. Activates
 * the new `scope` (classroom/group/individuals) and peer-review fields on
 * the assignments table — features the existing /classroom/[id]/assignments/
 * create flow doesn't yet expose. Demo mode and student members never see it.
 */
export function TeacherAssignmentComposer({
  classroomId,
}: {
  classroomId: string
}) {
  const router = useRouter()
  const { user, isDemoMode } = useAuth()
  const [allowed, setAllowed] = useState(false)
  const [open, setOpen] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [instructions, setInstructions] = useState("")
  const [type, setType] = useState<Type>("chapter_read")
  const [bookId, setBookId] = useState("")
  const [chapterNumber, setChapterNumber] = useState<string>("")
  const [trialId, setTrialId] = useState("")
  const [dueAt, setDueAt] = useState("")
  const [points, setPoints] = useState(100)
  const [scope, setScope] = useState<Scope>("classroom")
  const [peerReviewEnabled, setPeerReviewEnabled] = useState(false)
  const [reviewersPer, setReviewersPer] = useState(2)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    if (!user || isDemoMode) {
      setAllowed(false)
      return
    }
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("classroom_members")
        .select("role")
        .eq("classroom_id", classroomId)
        .eq("student_id", user.id)
        .maybeSingle<{ role: string }>()
      if (cancelled) return
      setAllowed(data?.role === "owner" || data?.role === "co_teacher")
    })()
    return () => {
      cancelled = true
    }
  }, [classroomId, user, isDemoMode])

  if (!allowed) return null

  function reset() {
    setTitle("")
    setInstructions("")
    setType("chapter_read")
    setBookId("")
    setChapterNumber("")
    setTrialId("")
    setDueAt("")
    setPoints(100)
    setScope("classroom")
    setPeerReviewEnabled(false)
    setReviewersPer(2)
  }

  function submit() {
    if (title.trim().length === 0) return
    startTransition(async () => {
      const result = await createAssignment({
        classroomId,
        title: title.trim(),
        instructions: instructions.trim() || undefined,
        type,
        bookId: type === "chapter_read" ? bookId.trim() || undefined : undefined,
        chapterNumber: chapterNumber ? parseInt(chapterNumber, 10) : undefined,
        trialId: type === "trial" ? trialId.trim() || undefined : undefined,
        dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
        points,
        scope,
        targetGroupIds: undefined,
        targetUserIds: undefined,
        peerReviewEnabled,
        peerReviewersPerSubmission: reviewersPer,
      })
      if (result.ok) {
        toast.success("Assignment created")
        reset()
        setOpen(false)
        router.refresh()
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <div className="mb-4">
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-xl border border-dashed border-border bg-muted/30 px-4 py-3 text-left text-sm text-muted-foreground transition-colors hover:border-[var(--tome-accent)]/40 hover:bg-muted/50"
        >
          <ClipboardList className="size-4 text-indigo-500" />
          <span>Create a new assignment…</span>
        </button>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center gap-2">
              <Sparkles className="size-3.5 text-[#D4A04C]" />
              <h3 className="text-sm font-semibold">New assignment</h3>
            </div>

            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Assignment title"
                className="h-9 text-sm"
                autoFocus
              />

              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Instructions (optional)"
                rows={2}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
              />

              {/* Type picker */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Type:
                </label>
                <div className="flex gap-1">
                  {(["chapter_read", "trial"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`rounded-full px-3 py-1 text-xs ${
                        type === t
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {t === "chapter_read" ? "Chapter read" : "Trial"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional content fields */}
              {type === "chapter_read" && (
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    value={bookId}
                    onChange={(e) => setBookId(e.target.value)}
                    placeholder="Book id (slug)"
                    className="h-9 text-sm"
                  />
                  <Input
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(e.target.value)}
                    placeholder="Chapter #"
                    type="number"
                    min={1}
                    className="h-9 text-sm"
                  />
                </div>
              )}
              {type === "trial" && (
                <Input
                  value={trialId}
                  onChange={(e) => setTrialId(e.target.value)}
                  placeholder="Trial id"
                  className="h-9 text-sm"
                />
              )}

              {/* Due + points */}
              <div className="grid grid-cols-2 gap-2">
                <Input
                  value={dueAt}
                  onChange={(e) => setDueAt(e.target.value)}
                  type="datetime-local"
                  className="h-9 text-sm"
                />
                <Input
                  value={points}
                  onChange={(e) => setPoints(parseInt(e.target.value || "0", 10))}
                  type="number"
                  min={0}
                  max={10000}
                  placeholder="Points"
                  className="h-9 text-sm"
                />
              </div>

              {/* Scope picker — the new field */}
              <div>
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Who gets this assignment?
                </label>
                <div className="flex gap-1">
                  {(
                    [
                      { v: "classroom", label: "Whole class", Icon: Users },
                      { v: "group", label: "Group", Icon: Layers },
                      { v: "individuals", label: "Individuals", Icon: UserPlus },
                    ] as const
                  ).map(({ v, label, Icon }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setScope(v)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                        scope === v
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-3" /> {label}
                    </button>
                  ))}
                </div>
                {scope !== "classroom" && (
                  <p className="mt-1 text-[10px] italic text-muted-foreground">
                    Pick groups/individuals after creating — coming next session.
                  </p>
                )}
              </div>

              {/* Peer review toggle */}
              <div className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2">
                <label className="flex cursor-pointer items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={peerReviewEnabled}
                    onChange={(e) => setPeerReviewEnabled(e.target.checked)}
                    className="size-3.5 rounded border-border"
                  />
                  Enable peer review
                </label>
                {peerReviewEnabled && (
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    Reviewers each:
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={reviewersPer}
                      onChange={(e) =>
                        setReviewersPer(
                          Math.max(1, Math.min(5, parseInt(e.target.value || "1", 10))),
                        )
                      }
                      className="h-6 w-12 rounded border border-border bg-background px-2 text-xs"
                    />
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-xs"
                  onClick={() => {
                    setOpen(false)
                    reset()
                  }}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={submit}
                  disabled={
                    pending ||
                    title.trim().length === 0 ||
                    (type === "chapter_read" && !bookId.trim()) ||
                    (type === "trial" && !trialId.trim())
                  }
                >
                  {pending ? "Creating…" : "Create assignment"}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
