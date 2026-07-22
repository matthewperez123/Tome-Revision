"use client"

/**
 * HintDrawer — the 3-level hint ladder UI.
 *
 * Pedagogy (matches src/lib/quiz-hints): L1 gentle nudge (where to look),
 * L2 narrow the field (approach / eliminate a path), L3 point to evidence
 * (very close — but the learner still commits). Levels unlock in order; each
 * reveal dispatches HINT_USED so Virgil reacts. Wisdom cost per level is
 * shown up front — help is always allowed, never hidden, never free of
 * visible consequence.
 */
import { AnimatePresence, motion } from "framer-motion"
import { Lamp, Lock } from "lucide-react"
import { laDurations, useReducedMotionSafe } from "@/lib/design/motion"
import { nextHint, hintLadder } from "@/lib/trials/engine"
import type { TrialSession } from "@/lib/trials/engine"
import type { TrialItem } from "@/lib/trials/types"
import { Kbd, la } from "./shared"

const LEVEL_META: Record<number, { label: string; aim: string }> = {
  1: { label: "Gentle nudge", aim: "where to look — nothing given away" },
  2: { label: "Narrow the field", aim: "the approach; a path closes" },
  3: { label: "Point to evidence", aim: "very close — you still commit" },
}

export function HintDrawer({
  open,
  session,
  item,
  onUseHint,
  onClose,
  reduced,
}: {
  open: boolean
  session: TrialSession
  item: TrialItem
  onUseHint: () => void
  onClose: () => void
  reduced?: boolean
}) {
  const systemReduced = useReducedMotionSafe()
  const isReduced = reduced ?? systemReduced
  const q = session.questions[session.index]
  const ladder = hintLadder(item)
  const upcoming = nextHint(session)

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          role="complementary"
          aria-label="Hint ladder"
          initial={isReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          animate={isReduced ? { opacity: 1 } : { opacity: 1, height: "auto" }}
          exit={isReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
          transition={{ duration: laDurations.normal / 1000 }}
          className="overflow-hidden border-2"
          style={{ borderRadius: la.radiusM, borderColor: la.wisdom, background: la.wisdomSoft }}
        >
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 font-sans text-sm font-semibold" style={{ color: la.wisdomDeep }}>
                <Lamp size={15} aria-hidden /> Virgil&rsquo;s lantern — three lights, one at a time
              </p>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close hints"
                className="font-sans text-sm focus-visible:outline-2"
                style={{ color: la.inkMuted, outlineColor: la.focus, borderRadius: la.radiusS }}
              >
                Close <Kbd>Esc</Kbd>
              </button>
            </div>

            {ladder.length === 0 && (
              <p className="font-serif text-base" style={{ color: la.inkMuted }}>
                This question carries no lantern — trust your reading.
              </p>
            )}

            <ol className="space-y-2">
              {ladder.map((hint) => {
                const used = q?.hintsUsed.includes(hint.level) ?? false
                const meta = LEVEL_META[hint.level]
                return (
                  <li
                    key={hint.level}
                    className="border-2 px-4 py-3"
                    style={{
                      borderRadius: la.radiusM,
                      borderColor: used ? la.wisdom : "transparent",
                      background: used ? la.surfaceRaised : la.surfaceSunken,
                      opacity: used ? 1 : 0.75,
                    }}
                  >
                    <p className="flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-wider" style={{ color: used ? la.wisdomDeep : la.inkFaint }}>
                      {used ? null : <Lock size={12} aria-hidden />}
                      Level {hint.level} · {meta?.label}
                    </p>
                    {used ? (
                      <p className="mt-1 font-serif text-base" style={{ color: la.ink }}>
                        {hint.text}
                      </p>
                    ) : (
                      <p className="mt-1 font-sans text-sm" style={{ color: la.inkFaint }}>
                        {meta?.aim}
                      </p>
                    )}
                  </li>
                )
              })}
            </ol>

            {upcoming && q?.status !== "correct" && (
              <button
                type="button"
                onClick={onUseHint}
                className="min-h-[44px] w-full border-2 px-4 py-2 font-sans text-sm font-semibold transition-colors focus-visible:outline-2"
                style={{
                  borderRadius: la.radiusM,
                  borderColor: la.wisdom,
                  background: la.wisdom,
                  color: la.wisdomInk,
                  outlineColor: la.focus,
                }}
              >
                Reveal level {upcoming.level} — {LEVEL_META[upcoming.level]?.label}{" "}
                <span style={{ fontWeight: 400 }}>
                  (−{Math.round((session.rules.hintPenalty[upcoming.level - 1] ?? 0) * 100)}% Wisdom)
                </span>
              </button>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}
