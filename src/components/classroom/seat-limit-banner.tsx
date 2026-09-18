"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { getSeatStatus, type SeatStatusView } from "@/lib/actions/classrooms"

/**
 * "Seat limit reached" banner for `/classroom/[id]/manage`. Renders nothing
 * until the teacher's live seat usage meets/exceeds their plan allowance.
 * Self-serve plans get an "Add seats" checkout (seats = usage + 10); teachers
 * covered by someone else's School plan are told to ask their school admin.
 */
export function SeatLimitBanner() {
  const [status, setStatus] = useState<SeatStatusView | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false
    getSeatStatus().then((s) => {
      if (!cancelled) setStatus(s)
    })
    return () => {
      cancelled = true
    }
  }, [])

  if (!status || status.used < status.allowance) return null

  async function addSeats() {
    if (!status || busy) return
    setBusy(true)
    try {
      if (status.tier === "school") {
        // School owner: update the live subscription quantity (prorated).
        const res = await fetch("/api/school/seats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ seats: status.used + 10 }),
        })
        const data = (await res.json()) as { seats?: number; error?: string }
        if (data.seats != null) {
          toast.success(`Your plan now covers ${data.seats} students.`)
          setStatus({ ...status, allowance: data.seats })
        } else {
          toast.error(data.error ?? "Could not add seats.")
        }
        setBusy(false)
        return
      }
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: "classroom", seats: status.used + 10 }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error ?? "Could not start checkout.")
        setBusy(false)
      }
    } catch {
      toast.error("Could not add seats.")
      setBusy(false)
    }
  }

  return (
    <div
      role="status"
      className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D7472F]/30 bg-[#D7472F]/5 px-4 py-3"
    >
      <div>
        <p className="font-medium text-[#D7472F]">Seat limit reached</p>
        <p className="text-sm text-[#1C1914]/70">
          {status.used} of {status.allowance} student seats on your plan are in
          use. New students can&apos;t join until seats are added.
        </p>
      </div>
      {status.coveredBySchool ? (
        <p className="text-sm font-medium text-[#2C4A7E]">
          Ask your school admin to add seats.
        </p>
      ) : (
        <button
          type="button"
          onClick={addSeats}
          disabled={busy}
          className="rounded-lg bg-[#2C4A7E] px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Opening checkout…" : "Add seats"}
        </button>
      )}
    </div>
  )
}
