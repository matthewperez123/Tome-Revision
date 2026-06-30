"use client"

import { Lock, Sparkles } from "lucide-react"
import Link from "next/link"
import { CheckoutButton } from "@/components/pricing/CheckoutButton"

const LAPIS = "#2A4B8D"
const GOLD = "#C8A24B"

/**
 * Interstitial shown in place of the reader body when a free-tier reader
 * opens a book outside the free sampler. Offers a Tome Solo subscription.
 */
export function UpgradeGate({ bookTitle }: { bookTitle: string }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center px-6 py-16 text-center">
      <div
        className="flex size-16 items-center justify-center rounded-2xl"
        style={{ backgroundColor: `${LAPIS}14` }}
      >
        <Lock className="size-7" style={{ color: LAPIS }} />
      </div>

      <h1 className="mt-6 font-serif text-2xl font-semibold tracking-tight">
        {bookTitle} is part of Tome Solo
      </h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Unlock the full library — every great book, unlimited reading, and
        Virgil at your side. Start with a free 7-day trial.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3">
        <CheckoutButton
          tier="solo"
          period="monthly"
          className="inline-flex items-center gap-2 rounded-xl bg-[#2A4B8D] px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <Sparkles className="size-4" style={{ color: GOLD }} />
          Start free trial
        </CheckoutButton>
        <Link
          href="/pricing"
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          See all plans
        </Link>
      </div>
    </div>
  )
}
