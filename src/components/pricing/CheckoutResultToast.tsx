"use client"

import { useEffect } from "react"
import { toast } from "sonner"

/** Maps the `?tier=` param to its display name so the toast reflects the real plan. */
const TIER_LABELS: Record<string, string> = {
  solo: "Tome Solo",
  family: "Tome Family",
  school: "Tome School",
}

/**
 * Reads the `?checkout=` query param set by Stripe's success/cancel redirect
 * and surfaces a toast, then strips the param so a refresh won't re-fire it.
 * Uses window.location directly to avoid a Suspense boundary for useSearchParams.
 */
export function CheckoutResultToast() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const result = params.get("checkout")
    if (!result) return

    if (result === "success") {
      const tier = params.get("tier")
      const label = (tier && TIER_LABELS[tier]) || "Tome"
      toast.success(`Welcome to ${label}! Your subscription is active.`)
    } else if (result === "cancelled") {
      toast("Checkout cancelled — no charge was made.")
    }

    params.delete("checkout")
    params.delete("tier")
    const qs = params.toString()
    window.history.replaceState(
      {},
      "",
      window.location.pathname + (qs ? `?${qs}` : ""),
    )
  }, [])

  return null
}
