"use client"

import { useEffect } from "react"
import { INTERCOM_APP_ID } from "@/lib/support"

interface IntercomWindow extends Window {
  Intercom?: ((command: string, ...args: unknown[]) => void) & {
    q?: unknown[]
    c?: (args: unknown) => void
  }
  intercomSettings?: Record<string, unknown>
}

/**
 * Loads the Intercom messenger client-side, gated on a configured app id.
 * With no NEXT_PUBLIC_INTERCOM_APP_ID set this renders nothing and loads
 * nothing. Boots with minimal data only — no student PII is ever passed.
 */
export function IntercomMessenger() {
  useEffect(() => {
    if (!INTERCOM_APP_ID) return

    const w = window as IntercomWindow
    w.intercomSettings = {
      app_id: INTERCOM_APP_ID,
      // Minimal boot — anonymous visitor, no PII.
    }

    if (typeof w.Intercom === "function") {
      w.Intercom("reattach_activator")
      w.Intercom("update", w.intercomSettings)
      return
    }

    const ic = function (...args: unknown[]) {
      ;(ic as unknown as { c: (a: unknown) => void }).c(args)
    } as IntercomWindow["Intercom"]
    if (ic) {
      ic.q = []
      ic.c = (args: unknown) => {
        ic.q!.push(args)
      }
      w.Intercom = ic
    }

    const script = document.createElement("script")
    script.async = true
    script.src = `https://widget.intercom.io/widget/${INTERCOM_APP_ID}`
    document.body.appendChild(script)

    w.Intercom?.("boot", w.intercomSettings)

    return () => {
      w.Intercom?.("shutdown")
      script.remove()
    }
  }, [])

  return null
}
