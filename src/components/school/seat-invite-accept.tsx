"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Check } from "lucide-react"
import { claimSeatInvite } from "@/lib/actions/school-seats"

// RUBRIC verdigris — the "confirmed / complete" accent (iridescence is reserved
// for Virgil surfaces, so this uses a flat single hue).
const VERDIGRIS = "#2E7D6F"

/**
 * Accept-a-seat card. Claims the pending seat tied to `token` (granting the
 * teacher role) and routes into the classroom on success.
 */
export function SeatInviteAccept({ token }: { token: string }) {
  const router = useRouter()
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle")
  const [error, setError] = useState<string | null>(null)

  async function accept() {
    setState("loading")
    setError(null)
    const result = await claimSeatInvite(token)
    if (result.ok) {
      setState("done")
      router.push("/classroom")
      router.refresh()
    } else {
      setState("error")
      setError(result.error)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
      <div
        className="mx-auto flex size-14 items-center justify-center rounded-full"
        style={{ backgroundColor: `${VERDIGRIS}1a`, color: VERDIGRIS }}
      >
        <Check className="size-7" aria-hidden />
      </div>

      <h1 className="mt-6 font-[var(--font-display)] text-2xl font-bold text-foreground">
        Join your School plan
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        You&apos;ve been invited to a seat on a Tome School plan. Accept to unlock
        your educator tools.
      </p>

      {error ? (
        <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/5 px-4 py-3 text-sm text-rose-600">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        onClick={accept}
        disabled={state === "loading" || state === "done"}
        aria-busy={state === "loading"}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-60"
      >
        {state === "loading" || state === "done" ? (
          <Loader2 className="size-4 animate-spin" aria-hidden />
        ) : (
          "Accept invitation"
        )}
      </button>
    </div>
  )
}
