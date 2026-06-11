"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { HeartCrack, Clock, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEconomy } from "@/components/tome/economy-provider"
import { HEART_REFILL_COIN_COST } from "@/lib/economy"

function formatCountdown(ms: number): string {
  const seconds = Math.max(0, Math.round(ms / 1000))
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

/**
 * Fullscreen pause modal shown when hearts hit zero mid-Trial. Offers review,
 * coin refill, or wait for regeneration. Resume is automatic once hearts > 0.
 */
export function HeartsZeroModal({
  open,
  onResume,
  onReviewChapter,
}: {
  open: boolean
  onResume: () => void
  onReviewChapter: () => void
}) {
  const reduced = useReducedMotion()
  const { stats, heartsRegenAt, dispatch } = useEconomy()
  const [now, setNow] = useState(() => Date.now())

  useEffect(() => {
    if (!open) return
    const iv = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(iv)
  }, [open])

  // Auto-resume when hearts regenerate or refill
  useEffect(() => {
    if (open && stats.hearts > 0) onResume()
  }, [open, stats.hearts, onResume])

  const msToNext = heartsRegenAt ? heartsRegenAt.getTime() - now : null
  const canRefill = stats.coins >= HEART_REFILL_COIN_COST

  function handleRefill() {
    dispatch({ type: "heart_refill_with_coins" })
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="hearts-zero-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduced ? 0.1 : 0.25 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="hearts-zero-title"
        >
          <motion.div
            initial={reduced ? false : { scale: 0.9, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="w-full max-w-md bg-card border-2 p-8 space-y-6 text-center shadow-xl"
            style={{
              borderRadius: "var(--codex-radius-card)",
              borderColor:
                "color-mix(in srgb, var(--codex-danger) 35%, var(--border))",
            }}
          >
            <div className="flex justify-center">
              <HeartCrack
                className="w-16 h-16"
                style={{ color: "var(--codex-danger)" }}
                aria-hidden
              />
            </div>

            <div className="space-y-2">
              <h2
                id="hearts-zero-title"
                className="font-serif text-2xl font-bold text-ink"
              >
                Out of hearts
              </h2>
              <p className="text-sm text-muted-foreground">
                Your Trial is paused. Resume when you have at least one heart.
              </p>
            </div>

            {msToNext !== null && msToNext > 0 && (
              <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 dark:bg-stone-800 px-4 py-2 text-sm text-ink font-sans">
                <Clock className="w-4 h-4" aria-hidden />
                Next heart in{" "}
                <span className="tabular-nums font-semibold">
                  {formatCountdown(msToNext)}
                </span>
              </div>
            )}

            <div className="space-y-2">
              <Button
                type="button"
                onClick={handleRefill}
                disabled={!canRefill}
                className="codex-pressable-danger w-full min-h-[44px] gap-2"
                style={
                  canRefill
                    ? {
                        background: "var(--codex-danger)",
                        color: "var(--codex-danger-on)",
                        borderRadius: "var(--codex-radius-btn)",
                      }
                    : { borderRadius: "var(--codex-radius-btn)" }
                }
              >
                <Coins className="w-4 h-4" />
                Use {HEART_REFILL_COIN_COST} coins to refill (you have {stats.coins})
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={onReviewChapter}
                className="w-full"
                style={{ borderRadius: "var(--codex-radius-btn)" }}
              >
                Review chapter
              </Button>

              <button
                type="button"
                onClick={onResume}
                className="text-xs text-muted-foreground hover:text-ink underline underline-offset-2"
              >
                Wait for hearts
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
