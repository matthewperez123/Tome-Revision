"use client"

import { useState, useCallback } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { IRIDESCENT } from "@/lib/semester-plan/rubric"
import { startGuidedSession } from "@/lib/actions/virgil-sessions"
import { GuidedReadingPanel } from "./guided-reading-panel"

interface GuidedReadingLauncherProps {
  bookId: string
  bookTitle: string
  chapter: number | null
  chapterTitle?: string | null
}

/**
 * Reader-mounted entry point for Virgil's guided reading mode. Opens (or
 * resumes) a session scoped to the current chapter and streams a real Virgil
 * conversation. Iridescence on the trigger marks it as a Virgil surface.
 */
export function GuidedReadingLauncher({
  bookId,
  bookTitle,
  chapter,
  chapterTitle,
}: GuidedReadingLauncherProps) {
  const { user, isDemoMode } = useAuth()
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [starting, setStarting] = useState(false)

  const launch = useCallback(async () => {
    if (!user || isDemoMode) {
      toast("Sign in to read with Virgil.")
      return
    }
    if (starting) return
    setStarting(true)
    const res = await startGuidedSession(bookId, chapter)
    setStarting(false)
    if (!res.ok) {
      toast(res.error)
      return
    }
    setSessionId(res.data.sessionId)
    setOpen(true)
  }, [user, isDemoMode, starting, bookId, chapter])

  const chapterLabel =
    chapterTitle?.trim() || (chapter != null ? `Chapter ${chapter + 1}` : null)

  return (
    <>
      <button
        onClick={launch}
        disabled={starting}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium transition-opacity disabled:opacity-50",
          "text-white",
        )}
        style={{ backgroundImage: IRIDESCENT }}
        aria-label="Read with Virgil"
        title="Read this chapter with Virgil"
      >
        {starting ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <span aria-hidden className="text-sm leading-none">✦</span>
        )}
        <span className="max-sm:hidden">Read with Virgil</span>
      </button>

      {open && sessionId && (
        <GuidedReadingPanel
          sessionId={sessionId}
          bookTitle={bookTitle}
          chapterLabel={chapterLabel}
          mode="floating"
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}
