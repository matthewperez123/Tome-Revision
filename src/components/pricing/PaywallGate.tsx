"use client"

import { Lock, Sparkles } from "lucide-react"
import Link from "next/link"
import { CheckoutButton } from "@/components/pricing/CheckoutButton"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"

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
        title: "You've reached today's Virgil limit",
        body: "Free readers get a few questions a day. Upgrade to Tome Solo for unlimited conversations with Virgil at your side.",
      }
    case "advanced-trials":
      return {
        title: "Advanced Trials are part of Tome Solo",
        body: "Scholar and Master Trials — the harder, deeper assessments — are unlocked with a subscription. Start with a free 7-day trial.",
      }
    case "book":
    default:
      return {
        title: subject ? `${subject} is part of Tome Solo` : "This book is part of Tome Solo",
        body: "Unlock the full library — every great book, unlimited reading, and Virgil at your side. Start with a free 7-day trial.",
      }
  }
}

/**
 * Reusable RUBRIC paywall interstitial. Renders in place of gated content and
 * routes free readers toward a subscription with context about what they hit.
 * The matching server gate (redirect / 402) is the real boundary; this is the
 * styled UX that explains it.
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
        <CheckoutButton
          tier="solo"
          period="monthly"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A4B8D] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Sparkles className="size-4" style={{ color: GOLD }} />
          Start free trial
        </CheckoutButton>
        <Link href="/pricing" className="text-xs text-muted-foreground hover:text-foreground">
          See all plans
        </Link>
      </div>
    </div>
  )
}
