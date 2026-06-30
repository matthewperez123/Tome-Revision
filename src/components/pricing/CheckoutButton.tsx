"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { BillingPeriod } from "@/lib/pricing"
import type { PaidTier } from "@/lib/stripe/plans"

interface CheckoutButtonProps {
  tier: PaidTier
  period?: BillingPeriod
  className?: string
  children: React.ReactNode
}

/**
 * Posts to /api/checkout, then redirects the browser to the Stripe-hosted
 * checkout URL. Shows inline loading + surfaces server errors as a toast.
 */
export function CheckoutButton({
  tier,
  period = "monthly",
  className,
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  async function startCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, period }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout.")
      }
      window.location.href = data.url
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not start checkout.",
      )
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={loading}
      aria-busy={loading}
      className={className}
    >
      {loading ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : (
        children
      )}
    </button>
  )
}
