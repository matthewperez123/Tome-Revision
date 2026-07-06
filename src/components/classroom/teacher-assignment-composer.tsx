"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  ClipboardList,
  Sparkles,
  Users,
  UserPlus,
  Layers,
  BookOpen,
  Brain,
  PenTool,
  X,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { createAssignment, publishAssignment } from "@/lib/actions/assignments"
import { getBooks, getChapters } from "@/lib/content"

type Scope = "classroom" | "group" | "individuals"
type Type = "reading" | "trial" | "essay"

// Reading + essay ship end-to-end; Trial is the existing quiz path. Discussion
// and annotation are intentionally omitted here (coming soon) so the composer
// only offers types with a complete student loop.
const TYPE_META: { v: Type; label: string; Icon: typeof BookOpen }[] = [
  { v: "reading", label: "Reading", Icon: BookOpen },
  { v: "trial", label: "Trial", Icon: Brain },
  { v: "essay", label: "Essay", Icon: PenTool },
]

interface Member {
  id: string
  name: string
}
interface Group {
  id: string
  name: string
}

/**
 * "New assignment" composer for the classroom detail page.
 *
 * Renders only for real-mode owner/co_teacher of THIS classroom. Covers all
 * five assignment types (reading / trial / annotation / discussion / essay),
 * targeting (whole class / group / individuals → assignment_targets), and the
 * draft → publish flow: "Save draft" creates a hidden draft; "Publish" creates
 * then publishes (eager submissions + class_assignment notifications).
 */
export function TeacherAssignmentComposer({
  classroomId,
}: {
  classroomId: string
}) {
  const router = useRouter()
  const { user, isDemoMode, isLoading: authLoading } = useAuth()
  const [allowed, setAllowed] = useState(false)
  const [open, setOpen] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState<Type>("reading")
  const [bookId, setBookId] = useState("")
  const [bookLabel, setBookLabel] = useState("")
  const [bookQuery, setBookQuery] = useState("")
  const [chapterStart, setChapterStart] = useState("")
  const [chapterEnd, setChapterEnd] = useState("")
  const [trialId, setTrialId] = useState("")
  const [essayPrompt, setEssayPrompt] = useState("")
  const [essayWordMin, setEssayWordMin] = useState("")
  const [essayWordMax, setEssayWordMax] = useState("")
  const [dueAt, setDueAt] = useState("")
  const [gracePeriodDays, setGracePeriodDays] = useState("0")
  const [latePenaltyPercent, setLatePenaltyPercent] = useState("0")
  const [points, setPoints] = useState(100)
  const [scope, setScope] = useState<Scope>("classroom")
  const [members, setMembers] = useState<Member[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [targetUserIds, setTargetUserIds] = useState<string[]>([])
  const [targetGroupIds, setTargetGroupIds] = useState<string[]>([])
  const [peerReviewEnabled, setPeerReviewEnabled] = useState(false)
  const [reviewersPer, setReviewersPer] = useState(2)
  const [pending, startTransition] = useTransition()

  // Book search (reading type) — filter the local catalog by title/author.
  const bookMatches = useMemo(() => {
    const q = bookQuery.trim().toLowerCase()
    if (!q) return []
    return getBooks()
      .filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q),
      )
      .slice(0, 8)
  }, [bookQuery])

  // Chapters for the selected book (0-based index = reader/reading_progress cursor).
  const chapterOptions = useMemo(
    () => (bookId ? getChapters(bookId) : []),
    [bookId],
  )

  useEffect(() => {
    // Wait for auth to settle before treating a null user as signed-out.
    if (authLoading) return
    if (!user || isDemoMode) {
      setAllowed(false)
      return
    }
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("classroom_members")
        .select("role")
        .eq("classroom_id", classroomId)
        .eq("student_id", user.id)
        .maybeSingle<{ role: string }>()
      if (cancelled) return
      // A failed role read is not "not staff" — keep hidden but observable.
      if (error) {
        console.warn("[assignment-composer] role read failed:", error.message)
        setAllowed(false)
        return
      }
      setAllowed(data?.role === "owner" || data?.role === "co_teacher")
    })()
    return () => {
      cancelled = true
    }
  }, [classroomId, user, isDemoMode, authLoading])

  // Load the roster + groups once the composer opens, so targeting is real.
  useEffect(() => {
    if (!open || !allowed) return
    let cancelled = false
    ;(async () => {
      const supabase = createClient()
      const [{ data: memberData }, { data: groupData }] = await Promise.all([
        supabase
          .from("classroom_members")
          .select("student_id, profiles(id, display_name)")
          .eq("classroom_id", classroomId)
          .eq("role", "student"),
        supabase
          .from("classroom_groups")
          .select("id, name")
          .eq("classroom_id", classroomId),
      ])
      if (cancelled) return
      setMembers(
        (memberData ?? []).map((m) => {
          const row = m as unknown as {
            student_id: string
            profiles?: { id: string; display_name: string } | null
          }
          return {
            id: row.profiles?.id ?? row.student_id,
            name: row.profiles?.display_name ?? "Student",
          }
        }),
      )
      setGroups((groupData as Group[] | null) ?? [])
    })()
    return () => {
      cancelled = true
    }
  }, [open, allowed, classroomId])

  if (!allowed) return null

  function reset() {
    setTitle("")
    setDescription("")
    setType("reading")
    setBookId("")
    setBookLabel("")
    setBookQuery("")
    setChapterStart("")
    setChapterEnd("")
    setTrialId("")
    setEssayPrompt("")
    setEssayWordMin("")
    setEssayWordMax("")
    setDueAt("")
    setGracePeriodDays("0")
    setLatePenaltyPercent("0")
    setPoints(100)
    setScope("classroom")
    setTargetUserIds([])
    setTargetGroupIds([])
    setPeerReviewEnabled(false)
    setReviewersPer(2)
  }

  function buildInput() {
    return {
      classroomId,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      bookId: type === "reading" ? bookId.trim() || undefined : undefined,
      chapterRangeStart:
        type === "reading" && chapterStart !== ""
          ? parseInt(chapterStart, 10)
          : undefined,
      chapterRangeEnd:
        type === "reading" && chapterEnd !== ""
          ? parseInt(chapterEnd, 10)
          : undefined,
      trialId: type === "trial" ? trialId.trim() || undefined : undefined,
      essayPrompt: type === "essay" ? essayPrompt.trim() || undefined : undefined,
      essayWordMin:
        type === "essay" && essayWordMin ? parseInt(essayWordMin, 10) : undefined,
      essayWordMax:
        type === "essay" && essayWordMax ? parseInt(essayWordMax, 10) : undefined,
      dueAt: dueAt ? new Date(dueAt).toISOString() : undefined,
      gracePeriodDays: parseInt(gracePeriodDays || "0", 10),
      latePenaltyPercent: parseInt(latePenaltyPercent || "0", 10),
      points,
      scope,
      targetGroupIds: scope === "group" ? targetGroupIds : undefined,
      targetUserIds: scope === "individuals" ? targetUserIds : undefined,
      peerReviewEnabled,
      peerReviewersPerSubmission: reviewersPer,
    }
  }

  function save(publish: boolean) {
    if (title.trim().length === 0) return
    startTransition(async () => {
      const result = await createAssignment(buildInput())
      if (!result.ok) {
        toast.error(result.error)
        return
      }
      if (publish) {
        const pub = await publishAssignment(result.data.id)
        if (!pub.ok) {
          toast.error(pub.error)
          router.refresh()
          return
        }
        toast.success(
          pub.data.published > 0
            ? `Published to ${pub.data.published} student${pub.data.published === 1 ? "" : "s"}`
            : "Assignment published",
        )
      } else {
        toast.success("Draft saved")
      }
      reset()
      setOpen(false)
      router.refresh()
    })
  }

  const canSubmit =
    title.trim().length > 0 &&
    !(type === "reading" && !bookId.trim()) &&
    !(type === "trial" && !trialId.trim()) &&
    !(type === "essay" && !essayPrompt.trim()) &&
    !(scope === "group" && targetGroupIds.length === 0) &&
    !(scope === "individuals" && targetUserIds.length === 0)

  function toggleUser(id: string) {
    setTargetUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
  }
  function toggleGroup(id: string) {
    setTargetGroupIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    )
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Instructions (optional)"
                rows={2}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
              />

              {/* Type picker */}
              <div className="flex flex-wrap items-center gap-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Type:
                </label>
                <div className="flex flex-wrap gap-1">
                  {TYPE_META.map(({ v, label, Icon }) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setType(v)}
                      className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs ${
                        type === v
                          ? "bg-foreground text-background"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <Icon className="size-3" /> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Conditional content fields */}
              {type === "reading" && (
                <div className="space-y-2">
                  {bookId ? (
                    <div className="flex items-center justify-between gap-2 rounded-md border border-border bg-muted/30 px-3 py-2">
                      <span className="flex items-center gap-1.5 text-sm">
                        <BookOpen className="size-3.5 text-muted-foreground" />
                        {bookLabel}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setBookId("")
                          setBookLabel("")
                          setBookQuery("")
                          setChapterStart("")
                          setChapterEnd("")
                        }}
                        className="rounded p-0.5 text-muted-foreground hover:text-foreground"
                        aria-label="Change book"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <Input
                        value={bookQuery}
                        onChange={(e) => setBookQuery(e.target.value)}
                        placeholder="Search a book by title or author…"
                        className="h-9 text-sm"
                      />
                      {bookMatches.length > 0 && (
                        <div className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-popover shadow-md">
                          {bookMatches.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                setBookId(b.id)
                                setBookLabel(`${b.title} — ${b.author}`)
                                setBookQuery("")
                              }}
                              className="flex w-full flex-col items-start px-3 py-1.5 text-left text-sm hover:bg-muted"
                            >
                              <span className="font-medium">{b.title}</span>
                              <span className="text-[11px] text-muted-foreground">
                                {b.author}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {bookId && chapterOptions.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                        From chapter
                        <select
                          value={chapterStart}
                          onChange={(e) => setChapterStart(e.target.value)}
                          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                        >
                          <option value="">— start —</option>
                          {chapterOptions.map((c) => (
                            <option key={c.id} value={String(c.number)}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="flex flex-col gap-1 text-[11px] text-muted-foreground">
                        Through chapter
                        <select
                          value={chapterEnd}
                          onChange={(e) => setChapterEnd(e.target.value)}
                          className="h-9 rounded-md border border-border bg-background px-2 text-sm"
                        >
                          <option value="">— same —</option>
                          {chapterOptions.map((c) => (
                            <option key={c.id} value={String(c.number)}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                  )}
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
              {type === "essay" && (
                <div className="space-y-2">
                  <textarea
                    value={essayPrompt}
                    onChange={(e) => setEssayPrompt(e.target.value)}
                    placeholder="Essay prompt"
                    rows={2}
                    className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={essayWordMin}
                      onChange={(e) => setEssayWordMin(e.target.value)}
                      placeholder="Min words (opt)"
                      type="number"
                      min={0}
                      className="h-9 text-sm"
                    />
                    <Input
                      value={essayWordMax}
                      onChange={(e) => setEssayWordMax(e.target.value)}
                      placeholder="Max words (opt)"
                      type="number"
                      min={1}
                      className="h-9 text-sm"
                    />
                  </div>
                </div>
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

              {/* Grace + late penalty */}
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-1.5">
                  <label className="whitespace-nowrap text-[10px] text-muted-foreground">
                    Grace (days)
                  </label>
                  <Input
                    value={gracePeriodDays}
                    onChange={(e) => setGracePeriodDays(e.target.value)}
                    type="number"
                    min={0}
                    max={60}
                    className="h-9 text-sm"
                  />
                </div>
                <div className="flex items-center gap-1.5">
                  <label className="whitespace-nowrap text-[10px] text-muted-foreground">
                    Late penalty %
                  </label>
                  <Input
                    value={latePenaltyPercent}
                    onChange={(e) => setLatePenaltyPercent(e.target.value)}
                    type="number"
                    min={0}
                    max={100}
                    className="h-9 text-sm"
                  />
                </div>
              </div>

              {/* Scope picker */}
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

                {scope === "individuals" && (
                  <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border border-border p-2">
                    {members.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">
                        No students enrolled yet.
                      </p>
                    ) : (
                      members.map((m) => (
                        <label
                          key={m.id}
                          className="flex cursor-pointer items-center gap-2 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={targetUserIds.includes(m.id)}
                            onChange={() => toggleUser(m.id)}
                            className="size-3.5 rounded border-border"
                          />
                          {m.name}
                        </label>
                      ))
                    )}
                  </div>
                )}
                {scope === "group" && (
                  <div className="mt-2 max-h-40 space-y-1 overflow-y-auto rounded-md border border-border p-2">
                    {groups.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground">
                        No groups yet — create one from Manage.
                      </p>
                    ) : (
                      groups.map((g) => (
                        <label
                          key={g.id}
                          className="flex cursor-pointer items-center gap-2 text-xs"
                        >
                          <input
                            type="checkbox"
                            checked={targetGroupIds.includes(g.id)}
                            onChange={() => toggleGroup(g.id)}
                            className="size-3.5 rounded border-border"
                          />
                          {g.name}
                        </label>
                      ))
                    )}
                  </div>
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
                  variant="outline"
                  className="text-xs"
                  onClick={() => save(false)}
                  disabled={pending || !canSubmit}
                >
                  {pending ? "Saving…" : "Save draft"}
                </Button>
                <Button
                  size="sm"
                  className="text-xs"
                  onClick={() => save(true)}
                  disabled={pending || !canSubmit}
                >
                  {pending ? "Publishing…" : "Publish"}
                </Button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
