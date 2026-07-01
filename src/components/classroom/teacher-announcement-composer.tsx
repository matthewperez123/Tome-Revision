"use client"

import { useEffect, useState, useTransition } from "react"
import { Megaphone, Pin, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { createClient } from "@/lib/supabase/client"
import { createAnnouncement } from "@/lib/actions/announcements"

/**
 * "Post announcement" composer for the classroom detail page.
 *
 * Renders only when:
 *  - The viewer is authenticated and not in demo mode.
 *  - The viewer's role in THIS classroom is owner or co_teacher.
 *
 * Otherwise returns null. Demo mode and student-role members never see it.
 *
 * Successful post fires the new `classroom_announcement` notifications to
 * every classroom member (handled by the server action) and surfaces a
 * toast.
 */
export function TeacherAnnouncementComposer({
  classroomId,
}: {
  classroomId: string
}) {
  const { user, isDemoMode } = useAuth()
  const [allowed, setAllowed] = useState<boolean | null>(null)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [pinned, setPinned] = useState(false)
  const [pending, startTransition] = useTransition()
  const [drafting, setDrafting] = useState(false)

  // Resolve the viewer's role in this classroom.
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
      setAllowed(
        data?.role === "owner" || data?.role === "co_teacher",
      )
    })()
    return () => {
      cancelled = true
    }
  }, [classroomId, user, isDemoMode])

  if (!allowed) return null

  // Ask Virgil to expand the teacher's brief into a polished title + body.
  // Virgil never posts — it fills the composer for the teacher to review.
  async function draftWithVirgil() {
    const brief = body.trim() || title.trim()
    if (brief.length === 0) {
      toast.error("Jot a quick brief first, then let Virgil polish it.")
      return
    }
    setDrafting(true)
    try {
      const res = await fetch("/api/virgil", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "announcement_draft",
          input: { classroomId, brief },
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "Virgil couldn't draft that. Try again.")
        return
      }
      if (data.title) setTitle(String(data.title))
      if (data.content) setBody(String(data.content))
      toast.success("Virgil drafted your announcement — review and post.")
    } catch {
      toast.error("Virgil couldn't be reached. Try again.")
    } finally {
      setDrafting(false)
    }
  }

  function handleSubmit() {
    const trimmed = body.trim()
    if (trimmed.length === 0) return
    startTransition(async () => {
      const result = await createAnnouncement({
        classroomId,
        title: title.trim() || undefined,
        body: trimmed,
        pinned,
      })
      if (result.ok) {
        toast.success(
          pinned ? "Pinned announcement posted" : "Announcement posted",
        )
        setTitle("")
        setBody("")
        setPinned(false)
        setOpen(false)
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
          <Megaphone className="size-4 text-[#D4A04C]" />
          <span>Post an announcement to your class…</span>
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
              <h3 className="text-sm font-semibold">New announcement</h3>
            </div>
            <div className="space-y-3">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title (optional)"
                className="h-9 text-sm"
              />
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Share something with your class…"
                rows={3}
                className="w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--tome-accent)]"
                autoFocus
              />
              <div className="flex items-center justify-between gap-2">
                <label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="size-3.5 rounded border-border"
                  />
                  <Pin className="size-3" /> Pin to top
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs"
                    onClick={() => {
                      setOpen(false)
                      setTitle("")
                      setBody("")
                      setPinned(false)
                    }}
                    disabled={pending || drafting}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-xs"
                    onClick={draftWithVirgil}
                    disabled={pending || drafting || (body.trim().length === 0 && title.trim().length === 0)}
                  >
                    <Sparkles className="size-3 text-[#D4A04C]" />
                    {drafting ? "Drafting…" : "Draft with Virgil"}
                  </Button>
                  <Button
                    size="sm"
                    className="text-xs"
                    onClick={handleSubmit}
                    disabled={pending || drafting || body.trim().length === 0}
                  >
                    {pending ? "Posting…" : "Post"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  )
}
