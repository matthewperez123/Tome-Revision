"use client"

/**
 * TrialShell — the shared chrome around every Trial family.
 *
 * Layout: header (family chip · progress · Wisdom · Virgil companion in the
 * corner), instructions, the family renderer (children), the hint drawer,
 * and the feedback panel. The shell is presentational — TrialPlayer wires
 * the engine and forwards callbacks. All color comes from --la-* tokens.
 */
import type { ReactNode } from "react"
import { Lamp } from "lucide-react"
import { nextHint } from "@/lib/trials/engine"
import type { TrialSession } from "@/lib/trials/engine"
import type { TrialItem } from "@/lib/trials/types"
import { FAMILY_LABELS, Kbd, la } from "./shared"
import { WisdomChip } from "./WisdomChip"
import { VirgilCompanion, type VirgilCompanionHandle } from "./VirgilCompanion"
import type { RefObject } from "react"
import type { VirgilVariantId } from "@/lib/virgil/types"

export interface TrialShellProps {
  title: string
  instruction?: string
  session: TrialSession
  item: TrialItem
  virgilRef: RefObject<VirgilCompanionHandle | null>
  virgilVariant?: VirgilVariantId
  showVirgil?: boolean
  hintOpen: boolean
  onToggleHints: () => void
  onUseHint: () => void
  hintDrawer: ReactNode
  feedback: ReactNode
  children: ReactNode
  reduced?: boolean
}

export function TrialShell({
  title,
  instruction,
  session,
  item,
  virgilRef,
  virgilVariant,
  showVirgil = true,
  hintOpen,
  onToggleHints,
  hintDrawer,
  feedback,
  children,
  reduced,
}: TrialShellProps) {
  const total = session.items.length
  const answeredCount = session.questions.filter((q) => q.attempts > 0).length
  const progress = total === 0 ? 0 : answeredCount / total
  const hasHint = nextHint(session) !== null && session.questions[session.index]?.status !== "correct"

  return (
    <div
      className="mx-auto w-full max-w-2xl space-y-5 p-5 sm:p-7"
      style={{ background: la.page, color: la.ink, borderRadius: la.radiusL }}
      data-trial-shell
    >
      {/* ── header ─────────────────────────────────────────── */}
      <header className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="px-2.5 py-1 font-sans text-[11px] font-semibold uppercase tracking-wider"
              style={{ background: la.primarySoft, color: la.primaryEdge, borderRadius: la.radiusS }}
            >
              {FAMILY_LABELS[item.family]}
            </span>
            <span className="font-sans text-xs" style={{ color: la.inkFaint }}>
              Question {session.index + 1} of {total}
            </span>
          </div>
          <h2 className="font-serif text-2xl leading-snug" style={{ color: la.ink }}>
            {title}
          </h2>

          {/* progress */}
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={answeredCount}
            aria-label={`Trial progress: ${answeredCount} of ${total} answered`}
            className="h-1.5 w-full overflow-hidden"
            style={{ background: la.surfaceSunken, borderRadius: 99 }}
          >
            <div
              className="h-full transition-[width]"
              style={{
                width: `${Math.round(progress * 100)}%`,
                background: `linear-gradient(90deg, ${la.wisdom}, ${la.primary})`,
                borderRadius: 99,
                transitionDuration: "var(--la-dur-normal)",
              }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <WisdomChip total={session.wisdomTotal} lastAward={session.questions[session.index]?.feedback?.wisdomAwarded ?? null} reduced={reduced} />
          {session.streak > 1 && (
            <span className="font-sans text-xs font-semibold" style={{ color: la.flame }}>
              {session.streak} in a row
            </span>
          )}
          {showVirgil && (
            <VirgilCompanion ref={virgilRef} variant={virgilVariant} size={64} reducedMotion={reduced} />
          )}
        </div>
      </header>

      {/* ── instructions + hint toggle ─────────────────────── */}
      <div className="flex items-center justify-between gap-3">
        {instruction && (
          <p className="font-sans text-sm" style={{ color: la.inkMuted }}>
            {instruction}
          </p>
        )}
        <button
          type="button"
          onClick={onToggleHints}
          aria-expanded={hintOpen}
          aria-controls="trial-hint-drawer"
          disabled={!hasHint && !hintOpen}
          className="ml-auto inline-flex min-h-[40px] items-center gap-2 border-2 px-3 py-1.5 font-sans text-sm font-semibold transition-colors focus-visible:outline-2 disabled:opacity-40"
          style={{
            borderRadius: la.radiusM,
            borderColor: la.wisdom,
            color: la.wisdomDeep,
            background: hintOpen ? la.wisdomSoft : "transparent",
            outlineColor: la.focus,
          }}
        >
          <Lamp size={14} aria-hidden />
          Hints <Kbd>H</Kbd>
        </button>
      </div>

      {/* ── hint drawer ────────────────────────────────────── */}
      <div id="trial-hint-drawer">{hintDrawer}</div>

      {/* ── family renderer ────────────────────────────────── */}
      <div>{children}</div>

      {/* ── feedback ───────────────────────────────────────── */}
      {feedback}
    </div>
  )
}
