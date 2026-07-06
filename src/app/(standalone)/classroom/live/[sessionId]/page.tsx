"use client"

import { useParams } from "next/navigation"
import { useLiveQuiz } from "@/hooks/use-live-quiz"
import { LiveQuizHost } from "@/components/classroom/live/live-quiz-host"
import { LiveQuizPlayer } from "@/components/classroom/live/live-quiz-player"
import { Loader2 } from "lucide-react"

/**
 * Full-bleed live quiz surface. The same route serves both roles: staff (host)
 * get the projector "Amphitheater" host controls; everyone else plays. The
 * server-computed isStaff flag on the leak-safe view is the authority — a
 * student can never render the host controls (their view also strips the answer
 * key until reveal).
 */
export default function LiveQuizPage() {
  const params = useParams<{ sessionId: string }>()
  const sessionId = params.sessionId
  const { view, loading, error } = useLiveQuiz(sessionId)

  if (loading && !view) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1420] text-white/60">
        <Loader2 className="mr-2 size-5 animate-spin" /> Loading the arena…
      </div>
    )
  }

  if (error || !view) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 bg-[#0F1420] px-6 text-center text-white/60">
        <p className="text-lg font-semibold text-white">This live quiz isn&apos;t available.</p>
        <p className="text-sm">{error ?? "Ask your teacher for a fresh link."}</p>
      </div>
    )
  }

  return view.isStaff ? (
    <LiveQuizHost sessionId={sessionId} />
  ) : (
    <LiveQuizPlayer sessionId={sessionId} />
  )
}
