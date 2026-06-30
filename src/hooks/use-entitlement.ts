"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { Tier } from "@/lib/stripe/entitlements"

interface EntitlementState {
  tier: Tier
  loading: boolean
}

const supabase = createClient()

/**
 * Reads the signed-in user's subscription tier from `public.subscriptions`.
 * Demo / signed-out sessions resolve to "free". Only active or trialing
 * subscriptions confer a paid tier.
 */
export function useEntitlement(): EntitlementState {
  const [state, setState] = useState<EntitlementState>({
    tier: "free",
    loading: true,
  })

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        if (!cancelled) setState({ tier: "free", loading: false })
        return
      }

      const { data } = await supabase
        .from("subscriptions")
        .select("tier, status")
        .eq("user_id", user.id)
        .maybeSingle()

      const active = data?.status === "active" || data?.status === "trialing"
      const tier: Tier =
        active && (data?.tier === "solo" || data?.tier === "family")
          ? data.tier
          : "free"

      if (!cancelled) setState({ tier, loading: false })
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  return state
}
