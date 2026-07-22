"use client"

/**
 * Lab galleries: scales + silhouettes, expression sheet, full state sheet
 * (the reduced-motion still of every state), and the book-world variants.
 */

import { VIRGIL_STATES, virgilStatesByCategory } from "@/lib/virgil/state-machine"
import { VIRGIL_VARIANTS, VIRGIL_VARIANT_IDS } from "@/lib/virgil/variants"
import type { VirgilCategory, VirgilVariantId } from "@/lib/virgil/types"
import { VIRGIL_EXPRESSIONS, VIRGIL_EXPRESSION_IDS } from "../expressions"
import { VirgilArt } from "../VirgilArt"
import { LabSection } from "./controls"

const CATEGORY_LABELS: Record<VirgilCategory, string> = {
  ambient: "Ambient",
  conversational: "Conversational",
  hint: "Hint ladder",
  assessment: "Assessment reactions",
  reward: "Reward reactions",
  system: "System",
}

const SCALES = [24, 40, 64, 128, 256] as const

export function ScaleGallery({ variant }: { variant: VirgilVariantId }) {
  return (
    <LabSection id="scales" kicker="01 · Silhouette discipline" title="Scales & silhouette tests">
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#9A9484]">
        Virgil must read at 24px: pointed hood, bell hem, lantern dot with glow.
        Each size shows the color render beside its single-color silhouette —
        the silhouette is the pass/fail test, not a courtesy.
      </p>
      <div className="space-y-3">
        {SCALES.map((size) => (
          <div
            key={size}
            className="flex items-end gap-6 rounded-lg border border-[#33363F] bg-[#1B1D24] p-4"
          >
            <span className="w-12 font-mono text-[11px] text-[#C8A24B]">{size}px</span>
            <div className="rounded-md bg-[#F5EFE0] p-2">
              <VirgilArt state="idle" variant={variant} size={size} title={`Virgil at ${size}px`} />
            </div>
            <div className="rounded-md bg-[#F5EFE0] p-2">
              <VirgilArt
                state="idle"
                variant={variant}
                size={size}
                tone="silhouette"
                toneColor="#232A38"
                title={`Virgil silhouette at ${size}px`}
              />
            </div>
            <div className="rounded-md bg-[#232A38] p-2">
              <VirgilArt
                state="idle"
                variant={variant}
                size={size}
                tone="mono"
                toneColor="#F2C14E"
                title={`Virgil single-color mark at ${size}px`}
              />
            </div>
            {size >= 128 && (
              <div className="rounded-md bg-[#F5EFE0] p-2">
                <VirgilArt state="idle" variant={variant} size={Math.round(size * 0.6)} bust title={`Virgil compact bust`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </LabSection>
  )
}

export function ExpressionGallery({ variant }: { variant: VirgilVariantId }) {
  return (
    <LabSection id="expressions" kicker="02 · Face system" title="Expression sheet">
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#9A9484]">
        Sixteen expressions from three articulators: eye style, brow offset,
        mouth shape. Never a frown that shames; concern is honest, not sad.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {VIRGIL_EXPRESSION_IDS.map((id) => (
          <figure
            key={id}
            className="rounded-lg border border-[#33363F] bg-[#F5EFE0] p-3 text-center"
          >
            <VirgilArt
              state="idle"
              expression={id}
              variant={variant}
              size={96}
              bust
              title={`Virgil expression: ${id}`}
            />
            <figcaption className="mt-1">
              <span className="block text-xs font-semibold text-[#232A38]">{id}</span>
              <span className="mt-0.5 block text-[10px] leading-snug text-[#6B6556]">
                {VIRGIL_EXPRESSIONS[id].note}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>
    </LabSection>
  )
}

export function StateGallery({ variant }: { variant: VirgilVariantId }) {
  const categories = Object.keys(CATEGORY_LABELS) as VirgilCategory[]
  const total = Object.keys(VIRGIL_STATES).length
  return (
    <LabSection
      id="states"
      kicker="03 · State machine coverage"
      title={`Every state as its reduced-motion still (${total})`}
    >
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#9A9484]">
        Each card is the exact pose the reduced-motion path holds for that
        state — meaning survives with zero movement. Loops park at rest;
        transients park at their meaning pose.
      </p>
      <div className="space-y-6" data-contact-sheet-source>
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#C8A24B]">
              {CATEGORY_LABELS[category]}
            </h3>
            <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-5 lg:grid-cols-7">
              {virgilStatesByCategory(category).map((defn) => (
                <figure
                  key={defn.id}
                  className="rounded-lg border border-[#33363F] bg-[#F5EFE0] p-2 text-center"
                >
                  <VirgilArt
                    state={defn.id}
                    variant={variant}
                    size={88}
                    title={`Virgil state: ${defn.label}`}
                  />
                  <figcaption className="mt-1">
                    <span className="block text-[11px] font-semibold leading-tight text-[#232A38]">
                      {defn.label}
                    </span>
                    <span className="font-mono text-[9px] uppercase tracking-wide text-[#8A8474]">
                      {defn.id} · {defn.kind}
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        ))}
      </div>
    </LabSection>
  )
}

export function VariantGallery({
  variant,
  onSelect,
}: {
  variant: VirgilVariantId
  onSelect: (variant: VirgilVariantId) => void
}) {
  return (
    <LabSection id="variants" kicker="04 · Book-world costumes" title="The twelve book-world variants">
      <p className="mb-5 max-w-2xl text-sm leading-relaxed text-[#9A9484]">
        Restrained adaptations: palette slots, one chest motif, one glow hue.
        The silhouette never changes — Virgil is always Virgil. Select a card
        to dress the stage.
      </p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {VIRGIL_VARIANT_IDS.map((id) => {
          const defn = VIRGIL_VARIANTS[id]
          const active = id === variant
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              aria-pressed={active}
              className={`group rounded-lg border p-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-[#C8A24B] ${
                active
                  ? "border-[#C8A24B] bg-[#F5EFE0]"
                  : "border-[#33363F] bg-[#EFE8D6] hover:border-[#8A8474]"
              }`}
            >
              <div className="flex justify-center">
                <VirgilArt state="greet" variant={id} size={120} title={`Virgil, ${defn.label} variant`} />
              </div>
              <p className="mt-2 text-xs font-bold text-[#232A38]">{defn.label}</p>
              <p className="text-[10px] italic text-[#6B6556]">{defn.work}</p>
              <p className="mt-1 text-[10px] leading-snug text-[#6B6556]">{defn.note}</p>
              <span className="mt-2 flex gap-1" aria-label="Palette swatches">
                {[defn.palette.cloak, defn.palette.trim, defn.glow, defn.palette.laurel].map(
                  (hex) => (
                    <span
                      key={hex}
                      title={hex}
                      className="h-3 w-3 rounded-sm border border-black/10"
                      style={{ backgroundColor: hex }}
                    />
                  ),
                )}
              </span>
            </button>
          )
        })}
      </div>
    </LabSection>
  )
}
