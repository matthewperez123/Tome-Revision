'use client'

// ─────────────────────────────────────────────
// UnlockAnimation — Full-screen achievement unlock modal
// ───────��───────────────────��─────────────────
// Stamp-down wax seal with bounce spring, impact shake,
// confetti burst, and navigation actions.

import { useCallback, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import confetti from 'canvas-confetti'
import { SealBase } from '@/components/achievements/seals/SealBase'
import { springs } from '@/lib/design-tokens'
import type { Achievement } from '@/types/achievement'
import { RARITY_LABELS, RARITY_WAX_COLORS } from '@/types/achievement'

interface UnlockAnimationProps {
  achievement: Achievement | null
  onDismiss: () => void
}

/** Gold confetti burst fired when the seal stamps down. */
function fireConfetti() {
  const gold = ['#C9A961', '#E8D5A3', '#A88B4A', '#F5E6B8']
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 35,
    gravity: 0.8,
    ticks: 120,
    colors: gold,
    origin: { x: 0.5, y: 0.45 },
    shapes: ['circle', 'square'],
    scalar: 0.9,
  })
}

/** Bounce spring for the stamp-down effect. */
const stampSpring = {
  type: 'spring' as const,
  stiffness: 350,
  damping: 18,
  mass: 1.2,
}

/** Shake keyframes after stamp impact. */
const shakeVariants = {
  initial: { x: 0 },
  shake: {
    x: [0, -4, 4, -3, 3, -1, 1, 0],
    transition: { duration: 0.4, delay: 0.35 },
  },
}

export function UnlockAnimation({ achievement, onDismiss }: UnlockAnimationProps) {
  // Fire confetti once when achievement appears
  const handleStampComplete = useCallback(() => {
    fireConfetti()
  }, [])

  // Keyboard dismiss
  useEffect(() => {
    if (!achievement) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter') onDismiss()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [achievement, onDismiss])

  return (
    <AnimatePresence>
      {achievement && (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={onDismiss}
        >
          {/* Card with shake on impact */}
          <motion.div
            variants={shakeVariants}
            initial="initial"
            animate="shake"
            onClick={(e) => e.stopPropagation()}
            className="relative w-[340px] rounded-2xl border border-border bg-card p-8 shadow-2xl text-center"
          >
            {/* "Seal Earned" label */}
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium"
            >
              Seal Earned
            </motion.p>

            {/* Seal stamp-down: scale 1.4 → 1 with bounce + slight rotation */}
            <motion.div
              initial={{ scale: 1.4, rotate: -8, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ ...stampSpring, delay: 0.2 }}
              onAnimationComplete={handleStampComplete}
              className="mt-5 flex justify-center"
            >
              <SealBase
                rarity={achievement.rarity}
                motifKey={achievement.sealDesignKey}
                size="xl"
                earned
              />
            </motion.div>

            {/* Achievement name */}
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, ...springs.gentle }}
              className="mt-5 font-playfair text-xl font-semibold leading-tight"
            >
              {achievement.name}
            </motion.h2>

            {/* Flavor text */}
            {achievement.flavorText && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mt-2 font-literata text-[11px] italic text-muted-foreground/60"
              >
                &ldquo;{achievement.flavorText}&rdquo;
              </motion.p>
            )}

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="mt-2 text-xs text-muted-foreground leading-relaxed"
            >
              {achievement.description}
            </motion.p>

            {/* Wisdom XP display */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, ...springs.interactive }}
              className="mt-4 flex items-center justify-center gap-2"
            >
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize"
                style={{
                  backgroundColor: `color-mix(in srgb, ${RARITY_WAX_COLORS[achievement.rarity]} 14%, transparent)`,
                  color: RARITY_WAX_COLORS[achievement.rarity],
                }}
              >
                {RARITY_LABELS[achievement.rarity]}
              </span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-amber-600">
                <Sparkles className="size-4" />
                +{achievement.wisdomReward} Wisdom
              </span>
            </motion.div>

            {/* Action buttons */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.95 }}
              className="mt-6 flex items-center justify-center gap-3"
            >
              <button
                onClick={onDismiss}
                className="rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Continue
              </button>
              <Link
                href={`/seals/${achievement.slug}`}
                className="rounded-lg border border-border px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground hover:border-foreground/20"
              >
                View in Seals
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
