"use client"

// Questions Available chip (launch brief 2.8): "Questions Available · 1,240"
// with a lapis meter; vermilion when low (< 20% of a month's grant); an
// "Add questions" top-up CTA when exhausted. Renders nothing for students —
// getQuestionsSummary returns null for any non-teacher.

import { useCallback, useEffect, useState } from "react"
import { getQuestionsSummary, type QuestionsSummary } from "@/lib/actions/credits"

const LAPIS = "#2C4A7E"
const VERMILION = "#D7472F"

/** Shared fetch for the chip and for UI clamping (e.g. MAX_QUIZ_QUESTIONS). */
export function useQuestionsAvailable() {
  const [summary, setSummary] = useState<QuestionsSummary | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    try {
      setSummary(await getQuestionsSummary())
    } catch {
      setSummary(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  return { summary, loading, refresh }
}

/** Start a Questions top-up checkout (10,000 block). */
export async function startTopupCheckout(): Promise<void> {
  const res = await fetch("/api/stripe/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind: "topup" }),
  })
  const json = (await res.json().catch(() => null)) as { url?: string } | null
  if (json?.url) window.location.href = json.url
}

export function QuestionsAvailableChip({ className }: { className?: string }) {
  const { summary, loading } = useQuestionsAvailable()
  const [busy, setBusy] = useState(false)

  // Loading, signed out, or not a teacher (students never see a balance).
  if (loading || !summary) return null

  const alert = summary.low || summary.exhausted
  const color = alert ? VERMILION : LAPIS
  const pct =
    summary.accrualCap > 0
      ? Math.max(0, Math.min(100, (summary.balance / summary.accrualCap) * 100))
      : 0

  return (
    <div
      className={`inline-flex items-center gap-2 rounded-full border bg-white px-3 py-1.5 text-xs font-medium ${className ?? ""}`}
      style={{ borderColor: `${color}33`, color }}
      title={summary.renewalCopy}
    >
      <span className="whitespace-nowrap">
        Questions Available · {summary.balance.toLocaleString()}
      </span>
      <span
        className="relative h-1.5 w-16 overflow-hidden rounded-full"
        style={{ backgroundColor: `${color}22` }}
        aria-hidden
      >
        <span
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </span>
      {summary.exhausted && (
        <button
          type="button"
          disabled={busy}
          onClick={() => {
            setBusy(true)
            void startTopupCheckout().finally(() => setBusy(false))
          }}
          className="rounded-full px-2 py-0.5 text-[11px] font-semibold text-white disabled:opacity-60"
          style={{ backgroundColor: VERMILION }}
        >
          {busy ? "Opening…" : "Add questions"}
        </button>
      )}
    </div>
  )
}
