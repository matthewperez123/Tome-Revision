"use client"

import { Lock } from "lucide-react"
import Link from "next/link"

const LAPIS = "#2A4B8D"

/** What the reader was trying to do when they hit the wall — drives the copy. */
export type PaywallReason = "book" | "virgil" | "advanced-trials"

interface PaywallCopy {
  title: string
  body: string
}

function copyFor(reason: PaywallReason, subject?: string): PaywallCopy {
  switch (reason) {
    case "virgil":
      return {
        title: "Tome Assistant is a teacher tool",
        body: "The assistant works for teachers — drafting quizzes, grading, and planning. Teachers use Tome free; students reach it through their teacher's classroom.",
      }
    case "advanced-trials":
      return {
        title: "Advanced Trials come through a classroom",
        body: "Scholar and Master Trials are part of classroom reading. Ask your teacher for a class code — or if you're the teacher, start a classroom free.",
      }
    case "book":
    default:
      return {
        title: subject ? `${subject} is beyond the free sampler` : "This book is beyond the free sampler",
        body: "Teachers read the entire library free. Students read through their school — ask your teacher for a class code, or start a classroom free.",
      }
  }
}

/**
 * Reusable RUBRIC paywall interstitial. Renders in place of gated content and
 * routes visitors to the free teacher signup (teachers are never charged; the
 * money path is student seats). The matching server gate (redirect / 402) is
 * the real boundary; this is the styled UX that explains it.
 */
export function PaywallGate({
  reason = "book",
  subject,
}: {
  reason?: PaywallReason
  /** e.g. a book title, used in the "book" headline. */
  subject?: string
}) {
  const { title, body } = copyFor(reason, subject)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="flex size-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${LAPIS}14` }}
      >
        <Lock className="size-7" style={{ color: LAPIS }} />
      </div>

      <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{body}</p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          href="/signup?as=teacher"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A4B8D] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Start a classroom free
        </Link>
        <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground">
          See all plans
        </Link>
      </div>
    </div>
  )
}
