"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { PurchasableTier } from "@/lib/billing/tiers"

interface CheckoutButtonProps {
  tier: PurchasableTier
  /** Student seats (line-item quantity) for classroom/school. */
  seats?: number
  className?: string
  children: React.ReactNode
}

/**
 * Posts to /api/stripe/checkout, then redirects the browser to the
 * Stripe-hosted checkout URL. Sends tier + seats (the server resolves the
 * Stripe price id from env, so price ids never ship to the client).
 * All billing is annual. Shows inline loading + surfaces errors as a toast.
 */
export function CheckoutButton({
  tier,
  seats,
  className,
  children,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)

  async function startCheckout() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier, seats }),
      })
      // Not signed in: don't dead-end at a toast. Send them to sign in and carry
      // the plan intent so they land back on pricing to resume checkout.
      if (res.status === 401) {
        const resume = `/pricing?plan=${tier}`
        window.location.href = `/login?redirect=${encodeURIComponent(resume)}`
        return
      }
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
