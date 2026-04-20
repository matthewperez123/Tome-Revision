'use client'

// ─────────────────────────────────────────────
// SealBase — Layered Wax Seal Component
// ─────────────────────────────────────────────
// Renders a visually unique wax seal by compositing
// five layers: wax base shape, ornamental border ring,
// central motif, book-initial monogram, and tradition
// accent dot.

import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import { cn } from '@/lib/utils'
import { springs } from '@/lib/design-tokens'
import type { AchievementRarity, AchievementCategory } from '@/types/achievement'
import {
  SEAL_MOTIFS,
  RARITY_WAX_COLORS,
  GOLD_LEAF,
  CATEGORY_RING_GENERATORS,
  pickWaxEdge,
  WAX_EDGE_PATHS,
} from './SealRegistry'

// ── Size tokens ─────────────────────────────────

type SealSize = 'sm' | 'md' | 'lg' | 'xl'

const SIZE_PX: Record<SealSize, number> = {
  sm: 40,
  md: 64,
  lg: 96,
  xl: 160,
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
  /** Used to deterministically select wax edge shape variant */
  achievementId?: string
  /** Drives the ornamental border ring style */
  category?: AchievementCategory
  /** First letter of book title — shown as embossed monogram */
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
  initial,
  traditionColor,
}: SealBaseProps) {
  const px = SIZE_PX[size]
  const waxColor = RARITY_WAX_COLORS[rarity]
  const resolvedMotifKey = motifKey ?? sealDesignKey ?? 'book'
  const motifPath = SEAL_MOTIFS[resolvedMotifKey] ?? SEAL_MOTIFS.book
  const hasGoldBorder = rarity === 'epic' || rarity === 'legendary' || rarity === 'mythic'
  const isMythic = rarity === 'mythic'

  // Unique id suffix to avoid SVG filter/def collisions
  const uid = achievementId
    ? `seal-${achievementId.replace(/[^a-zA-Z0-9]/g, '')}`
    : `seal-${rarity}-${motifKey}-${size}`

  // Layer 1: Pick wax edge shape based on achievement ID
  const waxEdgePath = achievementId
    ? pickWaxEdge(achievementId)
    : WAX_EDGE_PATHS[0]

  // Layer 2: Category ring markup
  const ringStrokeColor = hasGoldBorder
    ? GOLD_LEAF
    : lighten(waxColor, 0.25)
  const categoryRingSvg = category && CATEGORY_RING_GENERATORS[category]
    ? CATEGORY_RING_GENERATORS[category](uid, ringStrokeColor)
    : ''

  // Motif fill color — slightly lighter than wax for embossed look
  const motifFillColor = lighten(waxColor, 0.12)
  const motifStrokeColor = darken(waxColor, 0.2)

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
      <svg
        viewBox="0 0 100 100"
        width={px}
        height={px}
        aria-hidden="true"
      >
        <defs>
          {/* ── Radial highlight gradient ── */}
          <radialGradient id={`wax-${uid}`} cx="40%" cy="35%" r="60%">
            <stop offset="0%" stopColor={lighten(waxColor, 0.15)} />
            <stop offset="100%" stopColor={waxColor} />
          </radialGradient>

          {/* ── Drop shadow ── */}
          <filter id={`shadow-${uid}`}>
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3" />
          </filter>

          {/* ── Emboss filter for motif (debossed into wax) ── */}
          <filter id={`emboss-${uid}`} x="-10%" y="-10%" width="120%" height="120%">
            {/* Dark shadow offset down-right */}
            <feOffset in="SourceAlpha" dx="0.5" dy="0.5" result="shadowOffset" />
            <feGaussianBlur in="shadowOffset" stdDeviation="0.4" result="shadowBlur" />
            <feFlood floodColor={darken(waxColor, 0.35)} floodOpacity="0.6" result="shadowColor" />
            <feComposite in="shadowColor" in2="shadowBlur" operator="in" result="shadow" />
            {/* Light highlight offset up-left */}
            <feOffset in="SourceAlpha" dx="-0.4" dy="-0.4" result="highlightOffset" />
            <feGaussianBlur in="highlightOffset" stdDeviation="0.3" result="highlightBlur" />
            <feFlood floodColor={lighten(waxColor, 0.3)} floodOpacity="0.5" result="highlightColor" />
            <feComposite in="highlightColor" in2="highlightBlur" operator="in" result="highlight" />
            {/* Merge: shadow + highlight + original */}
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="highlight" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* ── Clip path for wax shape ── */}
          <clipPath id={`clip-${uid}`}>
            <path d={waxEdgePath} />
          </clipPath>

          {/* ── Mythic animated shimmer gradient ── */}
          {isMythic && (
            <linearGradient id={`shimmer-${uid}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#C9A961">
                <animate
                  attributeName="stopColor"
                  values="#C9A961;#F5E6B8;#C9A961"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#8B6914">
                <animate
                  attributeName="stopColor"
                  values="#8B6914;#C9A961;#8B6914"
                  dur="3s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>
          )}
        </defs>

        {/* ═══ LAYER 1: Wax Seal Body ═══ */}
        <path
          d={waxEdgePath}
          fill={isMythic ? `url(#shimmer-${uid})` : `url(#wax-${uid})`}
          filter={`url(#shadow-${uid})`}
        />

        {/* Gold leaf border accent for epic+ */}
        {hasGoldBorder && (
          <path
            d={waxEdgePath}
            fill="none"
            stroke={GOLD_LEAF}
            strokeWidth="1.5"
            strokeOpacity="0.7"
          />
        )}

        {/* Clipped group — all inner content stays within wax shape */}
        <g clipPath={`url(#clip-${uid})`}>

          {/* ═══ LAYER 2: Ornamental Border Ring ═══ */}
          {categoryRingSvg && (
            <g dangerouslySetInnerHTML={{ __html: categoryRingSvg }} />
          )}

          {/* ═══ LAYER 4: Book Initial / Monogram (behind motif) ═══ */}
          {initial && (
            <text
              x="50"
              y="56"
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="'Georgia', 'Times New Roman', serif"
              fontWeight="bold"
              fontSize="40"
              fill={lighten(waxColor, 0.08)}
              fillOpacity="0.55"
              style={{ userSelect: 'none' }}
            >
              {initial.charAt(0).toUpperCase()}
            </text>
          )}

          {/* ═══ LAYER 3: Central Motif (embossed/filled) ═══ */}
          <g
            transform="translate(28, 28) scale(1.833)"
            filter={`url(#emboss-${uid})`}
          >
            {/* Filled motif shape */}
            <path
              d={motifPath}
              fill={motifFillColor}
              fillOpacity="0.85"
              stroke={motifStrokeColor}
              strokeWidth="0.6"
              strokeOpacity="0.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Lighter inner highlight stroke for definition */}
            <path
              d={motifPath}
              fill="none"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="0.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>

          {/* ═══ LAYER 5: Tradition Accent Dot ═══ */}
          {traditionColor && (
            <>
              {/* Outer glow */}
              <circle
                cx="50"
                cy="88"
                r="4"
                fill={traditionColor}
                fillOpacity="0.2"
              />
              {/* Main accent dot */}
              <circle
                cx="50"
                cy="88"
                r="2.5"
                fill={traditionColor}
                fillOpacity="0.85"
                stroke={darken(traditionColor, 0.2)}
                strokeWidth="0.5"
                strokeOpacity="0.6"
              />
              {/* Tiny highlight reflection */}
              <circle
                cx="49.2"
                cy="87"
                r="0.8"
                fill="white"
                fillOpacity="0.4"
              />
            </>
          )}
        </g>
      </svg>

      {/* Lock overlay when unearned */}
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Lock
            size={px * 0.3}
            className="text-stone-400"
            strokeWidth={2.5}
          />
        </div>
      )}
    </motion.div>
  )
}

// ── Helpers ──────────────────────────────────

/** Lighten a hex colour by a ratio (0-1). */
function lighten(hex: string, ratio: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.min(255, ((num >> 16) & 0xff) + Math.round(255 * ratio))
  const g = Math.min(255, ((num >> 8) & 0xff) + Math.round(255 * ratio))
  const b = Math.min(255, (num & 0xff) + Math.round(255 * ratio))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

/** Darken a hex colour by a ratio (0-1). */
function darken(hex: string, ratio: number): string {
  const num = parseInt(hex.replace('#', ''), 16)
  const r = Math.max(0, Math.round(((num >> 16) & 0xff) * (1 - ratio)))
  const g = Math.max(0, Math.round(((num >> 8) & 0xff) * (1 - ratio)))
  const b = Math.max(0, Math.round((num & 0xff) * (1 - ratio)))
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
