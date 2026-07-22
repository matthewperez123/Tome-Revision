/**
 * VirgilArt — the static, fully-composed layered SVG.
 *
 * Resolves a semantic state (or an explicit pose/expression override) into
 * baked SVG transforms. No animation library: this is the render target for
 * galleries, posters, contact sheets, single-color marks, and the
 * reduced-motion still path. Virgil.tsx mirrors this composition with
 * motion.g wrappers for the animated path.
 */

import { useId } from "react"
import type { VirgilPalette } from "@/lib/virgil/palette"
import { VIRGIL_VARIANTS } from "@/lib/virgil/variants"
import type {
  VirgilExpressionId,
  VirgilPose,
  VirgilStateId,
  VirgilVariantId,
} from "@/lib/virgil/types"
import { VIRGIL_EXPRESSIONS } from "./expressions"
import { resolveVirgilPose } from "./poses"
import {
  Cloak,
  Face,
  GroundShadow,
  LanternArm,
  LanternGlow,
  Motif,
  OpenBook,
  Satchel,
} from "./parts"

export type VirgilArtTone = "color" | "silhouette" | "mono"

export interface VirgilArtProps {
  /** semantic state to pose from (default: idle) */
  state?: VirgilStateId
  /** explicit pose overrides, applied after the state's pose */
  pose?: Partial<VirgilPose>
  /** expression override (expression gallery uses this) */
  expression?: VirgilExpressionId
  variant?: VirgilVariantId
  /** "silhouette"/"mono" flatten every fill to toneColor and drop the glow */
  tone?: VirgilArtTone
  toneColor?: string
  /** palette slot overrides (grayscale marks, theme probes) */
  paletteOverride?: Partial<VirgilPalette>
  /** width in px; height follows the 3:4 construction ratio */
  size?: number
  /** compact mobile bust crop (head + shoulders) */
  bust?: boolean
  title?: string
  className?: string
}

function flattenPalette(palette: VirgilPalette, color: string): VirgilPalette {
  return Object.keys(palette).reduce(
    (acc, key) => ({ ...acc, [key]: color }),
    {} as VirgilPalette,
  )
}

export function VirgilArt({
  state = "idle",
  pose: poseOverride,
  expression: expressionOverride,
  variant = "canon",
  tone = "color",
  toneColor = "#232A38",
  paletteOverride,
  size = 256,
  bust = false,
  title,
  className,
}: VirgilArtProps) {
  const gradientUid = `virgil-glow-${useId().replace(/:/g, "")}`
  const variantDef = VIRGIL_VARIANTS[variant]
  const basePalette = {
    ...(tone === "color"
      ? variantDef.palette
      : flattenPalette(variantDef.palette, toneColor)),
    ...paletteOverride,
  }

  const resolved: VirgilPose = {
    ...resolveVirgilPose(state),
    ...poseOverride,
    ...(expressionOverride ? { expression: expressionOverride } : {}),
  }
  const expression = VIRGIL_EXPRESSIONS[resolved.expression]

  // squash pivots at the hem (y=320), so the figure never floats
  const figureTransform = `translate(0 ${resolved.bodyY}) rotate(${resolved.bodyLean} 120 300) translate(0 ${Math.round(320 * (1 - resolved.squash))}) scale(1 ${resolved.squash})`
  const headTransform = `translate(${resolved.headX} ${resolved.headY}) rotate(${resolved.headTilt} 120 150)`
  const pupilsTransform = `translate(${resolved.eyeLookX} ${resolved.eyeLookY})`
  const armTransform = `translate(0 ${resolved.lanternLift}) rotate(${resolved.armAngle} 186 164)`
  const lanternSwingTransform = `rotate(${resolved.lanternSwing} 191 186)`
  const satchelTransform = `rotate(${resolved.satchelSwing} 57 208)`

  return (
    <svg
      viewBox={bust ? "56 14 128 150" : "0 0 240 320"}
      width={size}
      height={bust ? Math.round((size * 150) / 128) : Math.round((size * 320) / 240)}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title ?? `Virgil, ${variantDef.label} variant`}
      className={className}
      data-virgil-art={state}
    >
      {tone === "color" && (
        <defs>
          <radialGradient id={gradientUid} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={variantDef.glow} stopOpacity={0.85} />
            <stop offset="55%" stopColor={variantDef.glow} stopOpacity={0.32} />
            <stop offset="100%" stopColor={variantDef.glow} stopOpacity={0} />
          </radialGradient>
        </defs>
      )}

      <g data-part="figure" transform={figureTransform}>
        {!bust && <GroundShadow palette={basePalette} />}

        {/* lantern glow lives behind the cloak silhouette but reads through */}
        {tone === "color" && (
          <g data-part="glow-wrap" opacity={resolved.glow}>
            <g transform={armTransform}>
              <g transform={lanternSwingTransform}>
                <LanternGlow palette={basePalette} gradientId={gradientUid} />
              </g>
            </g>
          </g>
        )}

        <Cloak palette={basePalette} />

        {!bust && (
          <g data-part="satchel-wrap" transform={satchelTransform}>
            <Satchel palette={basePalette} />
          </g>
        )}

        <g data-part="head" transform={headTransform}>
          <Face
            palette={basePalette}
            expression={expression}
            pupilsTransform={pupilsTransform}
          />
        </g>

        {tone === "color" && <Motif motif={variantDef.motif} color={basePalette.laurel} />}

        {!bust && resolved.bookOpen && <OpenBook palette={basePalette} />}

        {/* articulated lantern arm sits above everything but the glow bloom */}
        <g data-part="arm" transform={armTransform}>
          <g data-part="lantern-swing" transform={lanternSwingTransform}>
            <LanternArm palette={basePalette} />
          </g>
        </g>
      </g>
    </svg>
  )
}
