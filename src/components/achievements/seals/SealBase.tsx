'use client'

// ─────────────────────────────────────────────
// SealBase — Neon Symbol Seal Component
// ─────────────────────────────────────────────
// Renders a clean neon emblem matching the icon style
// used elsewhere in the app: the rarity-colored motif on
// a soft, translucent tint of the same color — no heavy
// shading, no dark disc.

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/design-tokens'
import type { AchievementRarity, AchievementCategory } from '@/types/achievement'
import { SEAL_MOTIFS, CATEGORY_RING_GENERATORS } from './SealRegistry'

// ── Size tokens ─────────────────────────────────

type SealSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_PX: Record<SealSize, number> = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 160,
}

// ── Rarity neon colors (match the /seals gallery tokens) ──

const RARITY_NEON: Record<AchievementRarity, string> = {
  common: '#10b981', // emerald
  uncommon: '#0ea5e9', // sky
  rare: '#8b5cf6', // violet
  epic: '#d946ef', // fuchsia
  legendary: '#f59e0b', // amber
  mythic: '#f59e0b', // amber
}

// ── Component ────────────────────────────────────

interface SealBaseProps {
  rarity: AchievementRarity
  /** Key into SEAL_MOTIFS registry — accepts either prop name */
  motifKey?: string
  /** Alias for motifKey (used by achievement data) */
  sealDesignKey?: string
  size?: SealSize
  earned?: boolean
  className?: string
  /** Set false to disable entrance animation */
  animate?: boolean
  /** Used to deterministically vary def ids */
  achievementId?: string
  /** Drives the optional decorative inner ring style */
  category?: AchievementCategory
  /** First letter of book title — kept for API compatibility (unused) */
  initial?: string
  /** Hex color for tradition accent dot at bottom */
  traditionColor?: string
}

export function SealBase({
  rarity,
  motifKey,
  sealDesignKey,
  size = 'md',
  earned = false,
  className,
  animate = true,
  achievementId,
  category,
  traditionColor,
}: SealBaseProps) {
  const px = SIZE_PX[size]
  const neon = RARITY_NEON[rarity]
  const resolvedMotifKey = motifKey ?? sealDesignKey ?? 'book'
  const motifPath = SEAL_MOTIFS[resolvedMotifKey] ?? SEAL_MOTIFS.book
  const isMythic = rarity === 'mythic'

  // Unique id suffix to avoid SVG def collisions
  const uid = achievementId
    ? `seal-${achievementId.replace(/[^a-zA-Z0-9]/g, '')}`
    : `seal-${rarity}-${resolvedMotifKey}-${size}`

  // Optional decorative inner ring, drawn faintly in neon
  const categoryRingSvg = category && CATEGORY_RING_GENERATORS[category]
    ? CATEGORY_RING_GENERATORS[category](uid, neon)
    : ''

  return (
    <motion.div
      className={cn(
        'relative inline-flex items-center justify-center',
        !earned && 'grayscale opacity-40',
        isMythic && earned && 'animate-pulse',
        className,
      )}
      style={{ width: px, height: px }}
      initial={animate ? { scale: 0.8, opacity: 0 } : false}
      animate={animate ? { scale: 1, opacity: 1 } : undefined}
      transition={animate ? springs.gentle : undefined}
    >
      <svg viewBox="0 0 100 100" width={px} height={px} aria-hidden="true">
        {/* Soft tinted background disc */}
        <circle cx="50" cy="50" r="47" fill={neon} fillOpacity="0.1" />
        {/* Thin neon ring */}
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={neon}
          strokeWidth="1.5"
          strokeOpacity="0.3"
        />

        {/* Optional decorative category ring (faint neon) */}
        {categoryRingSvg && (
          <g opacity="0.3" dangerouslySetInnerHTML={{ __html: categoryRingSvg }} />
        )}

        {/* Central motif — solid neon symbol */}
        <g transform="translate(28, 28) scale(1.833)">
          <path d={motifPath} fill={neon} />
        </g>

        {/* Tradition accent dot */}
        {traditionColor && (
          <circle cx="50" cy="86" r="2.5" fill={traditionColor} />
        )}
      </svg>

      {/* Lock overlay when unearned */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock size={px * 0.3} className="text-stone-400" strokeWidth={2.5} />
        </div>
      )}
    </motion.div>
  )
}
