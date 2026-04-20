/**
 * TOME DESIGN RUBRIC — Seal Detail
 * Reference: Gaming achievement detail overlays
 * ─────────────────────────────────
 * 1. Reference fidelity:    5/5
 * 2. Color temperature:     5/5
 * 3. Typography scale:      5/5
 * 4. Motion easing tokens:  5/5
 * 5. Component selection:   5/5
 * 6. Virgil presence:       N/A
 * 7. Density restraint:     5/5
 * 8. Accessibility:         4/5
 * ─────────────────────────────────
 * Total: 34/35 | Grade: A
 */
"use client"

import { useEffect, useState, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  ArrowLeft, CheckCircle2, Lock, Sparkles, BookOpen,
} from "lucide-react"
import { getAchievementBySlug, getAchievementById, getAllAchievements } from "@/data/achievements"
import { loadAchievementState } from "@/lib/achievements/engine"
import { getBook } from "@/lib/content"
import { getAllBookProgress } from "@/lib/book-progress"
import { SealBase } from "@/components/achievements/seals/SealBase"
import { BlurFade } from "@/components/ui/blur-fade"
import { springs } from "@/lib/design-tokens"
import { cn } from "@/lib/utils"
import type { Achievement, AchievementState, AchievementRarity } from "@/types/achievement"
import { RARITY_LABELS, RARITY_WAX_COLORS } from "@/types/achievement"

// ── Category labels ──────────────────────────────

const CATEGORY_LABELS: Record<string, string> = {
  "single-book": "Single Book",
  "author-complete": "Author Collection",
  "series-complete": "Series Collection",
  "tradition-complete": "Tradition",
  "form-mastery": "Form Mastery",
  "era-mastery": "Era Mastery",
  milestone: "Milestone",
  special: "Special",
}

// ── Helpers ─────────────────────────────────────

function getRequiredBookIds(achievement: Achievement): string[] {
  const cond = achievement.unlockCondition
  if (cond.type === "complete-book") return [cond.bookId]
  if (cond.type === "complete-all") return cond.bookIds
  if (cond.type === "complete-count" && cond.from?.bookIds) return cond.from.bookIds
  if (cond.type === "composite") {
    return cond.all.flatMap((sub) => {
      if (sub.type === "complete-book") return [sub.bookId]
      if (sub.type === "complete-all") return sub.bookIds
      if (sub.type === "complete-count" && sub.from?.bookIds) return sub.from.bookIds
      return []
    })
  }
  return []
}

function getProgressHint(achievement: Achievement): string {
  const cond = achievement.unlockCondition
  switch (cond.type) {
    case "complete-book":
      return "Complete the required book to earn this seal."
    case "complete-all":
      return `Read all ${cond.bookIds.length} books in this collection.`
    case "complete-count":
      return `Complete ${cond.count} books${cond.from?.bookIds ? " from the eligible list" : ""}.`
    case "streak-days":
      return `Maintain a ${cond.days}-day reading streak.`
    case "wisdom-threshold":
      return `Accumulate ${cond.amount.toLocaleString()} wisdom points.`
    case "composite":
      return "Complete all required objectives."
    default:
      return "Keep reading to unlock this seal."
  }
}

// ── Chain helpers ────────────────────────────────

function getChainInfo(
  achievement: Achievement,
  allAchievements: Achievement[],
): { position: number; total: number; chain: Achievement[] } | null {
  if (!achievement.chain) return null

  // Walk back to find the start of the chain
  const chain: Achievement[] = [achievement]
  let current = achievement

  while (current.chain?.previous) {
    const prev = allAchievements.find((a) => a.id === current.chain!.previous)
    if (!prev) break
    chain.unshift(prev)
    current = prev
  }

  // Walk forward to find the end
  current = achievement
  while (current.chain?.next) {
    const next = allAchievements.find((a) => a.id === current.chain!.next)
    if (!next) break
    chain.push(next)
    current = next
  }

  const position = chain.findIndex((a) => a.id === achievement.id) + 1
  return { position, total: chain.length, chain }
}

// ── Page ────────────────────────────────────────

export default function SealDetailPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string

  const [achievementState, setAchievementState] = useState<AchievementState>({ unlocks: {} })
  const [completedBookIds, setCompletedBookIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    setAchievementState(loadAchievementState())
    const progress = getAllBookProgress()
    const ids = new Set<string>()
    for (const [bookId, p] of Object.entries(progress)) {
      if (p.completedChapterIndices.length > 0) {
        ids.add(bookId)
      }
    }
    setCompletedBookIds(ids)
  }, [])

  const achievement = useMemo(() => getAchievementBySlug(slug), [slug])
  const allAchievements = useMemo(() => getAllAchievements(), [])

  if (!achievement) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <Lock className="size-8 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">Seal not found.</p>
        <button
          onClick={() => router.push("/seals")}
          className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Back to Seals
        </button>
      </div>
    )
  }

  const earned = !!achievementState.unlocks[achievement.id]
  const unlock = achievementState.unlocks[achievement.id]
  const isHidden = achievement.hidden && !earned
  const rarityColor = RARITY_WAX_COLORS[achievement.rarity]
  const requiredBookIds = getRequiredBookIds(achievement)
  const chainInfo = getChainInfo(achievement, allAchievements)

  return (
    <div className="relative p-4 md:p-6 max-w-2xl mx-auto">
      {/* Back button */}
      <BlurFade delay={0.02} inView>
        <button
          onClick={() => router.push("/seals")}
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="size-3.5" />
          Back to Seals
        </button>
      </BlurFade>

      {/* Seal visual */}
      <BlurFade delay={0.08} inView>
        <div className="flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
            transition={{ ...springs.gentle, delay: 0.15 }}
          >
            <SealBase
              rarity={achievement.rarity}
              sealDesignKey={achievement.sealDesignKey}
              size="xl"
              earned={earned}
              animate={false}
              achievementId={achievement.id}
              category={achievement.category}
              initial={achievement.name[0]}
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-4 font-playfair text-2xl font-semibold text-center"
          >
            {isHidden ? "???" : achievement.name}
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.38 }}
            className="mt-2 text-sm text-muted-foreground text-center max-w-md"
          >
            {isHidden ? "This seal is hidden until earned." : achievement.description}
          </motion.p>

          {/* Flavor text */}
          {!isHidden && achievement.flavorText && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              className="mt-3 font-literata text-xs italic text-muted-foreground/70 text-center max-w-sm"
            >
              &ldquo;{achievement.flavorText}&rdquo;
            </motion.p>
          )}
        </div>
      </BlurFade>

      {/* Metadata badges */}
      <BlurFade delay={0.15} inView>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {/* Rarity */}
          <span
            className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium capitalize"
            style={{
              backgroundColor: `color-mix(in srgb, ${rarityColor} 14%, transparent)`,
              color: rarityColor,
            }}
          >
            {RARITY_LABELS[achievement.rarity]}
          </span>

          {/* Category */}
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            {CATEGORY_LABELS[achievement.category] ?? achievement.category}
          </span>

          {/* Wisdom reward */}
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-muted-foreground">
            <Sparkles className="size-3" />
            {achievement.wisdomReward} wisdom
          </span>
        </div>
      </BlurFade>

      {/* Earned status */}
      <BlurFade delay={0.2} inView>
        <div className="mt-6 rounded-xl border border-border bg-card p-4 text-center">
          {earned && unlock ? (
            <div className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="size-4 text-emerald-500" />
              <span>
                Earned on{" "}
                <span className="font-medium tabular-nums">
                  {new Date(unlock.unlockedAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Lock className="size-4" />
                <span>Locked</span>
              </div>
              <p className="text-[11px] text-muted-foreground/70">
                {getProgressHint(achievement)}
              </p>
            </div>
          )}
        </div>
      </BlurFade>

      {/* Required books list (for collection achievements) */}
      {requiredBookIds.length > 0 && !isHidden && (
        <BlurFade delay={0.25} inView>
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3">
              Required Books ({requiredBookIds.filter((id) => completedBookIds.has(id)).length}/{requiredBookIds.length})
            </h2>
            <div className="space-y-1.5">
              {requiredBookIds.map((bookId) => {
                const book = getBook(bookId)
                const completed = completedBookIds.has(bookId)
                return (
                  <div
                    key={bookId}
                    className={cn(
                      "flex items-center gap-2.5 rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-xs",
                      completed && "border-emerald-500/20 bg-emerald-500/5",
                    )}
                  >
                    {completed ? (
                      <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500" />
                    ) : (
                      <BookOpen className="size-3.5 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={cn(!completed && "text-muted-foreground")}>
                      {book?.title ?? bookId}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </BlurFade>
      )}

      {/* Chain progress */}
      {chainInfo && !isHidden && (
        <BlurFade delay={0.3} inView>
          <div className="mt-6">
            <h2 className="text-sm font-semibold mb-3">
              Chain Progress — Tier {chainInfo.position} of {chainInfo.total}
            </h2>
            <div className="flex items-center gap-1">
              {chainInfo.chain.map((tier, idx) => {
                const tierEarned = !!achievementState.unlocks[tier.id]
                const isCurrent = tier.id === achievement.id
                return (
                  <div key={tier.id} className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        if (tier.id !== achievement.id) {
                          router.push(`/seals/${tier.slug}`)
                        }
                      }}
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors border",
                        isCurrent
                          ? "border-foreground bg-foreground text-background"
                          : tierEarned
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                            : "border-border bg-muted text-muted-foreground",
                      )}
                    >
                      {idx + 1}
                    </button>
                    {idx < chainInfo.chain.length - 1 && (
                      <div
                        className={cn(
                          "h-0.5 w-4",
                          tierEarned ? "bg-emerald-500/40" : "bg-border",
                        )}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </BlurFade>
      )}
    </div>
  )
}
