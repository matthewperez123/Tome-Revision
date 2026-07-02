"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

/**
 * Opens the Stripe Billing Portal for the signed-in user. Rendered only when
 * the account already has a Stripe customer id, so the portal route always has
 * a customer to open (a 403 here means the row went missing — surface it).
 */
export function ManageBillingButton() {
  const [loading, setLoading] = useState(false)

  async function openPortal() {
    setLoading(true)
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" })
      const data = (await res.json()) as { url?: string; error?: string }
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal.")
      }
      window.location.href = data.url
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Could not open billing portal.",
      )
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={openPortal}
      disabled={loading}
      aria-busy={loading}
      className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
    >
      {loading ? <Loader2 className="size-4 animate-spin" aria-hidden /> : "Manage billing"}
    </button>
  )
}
