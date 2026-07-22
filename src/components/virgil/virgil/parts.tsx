/**
 * Virgil layered SVG parts.
 *
 * Pure presentational components — no animation libraries, no hooks — so the
 * same parts render in the animated runtime, static galleries, posters, and
 * single-color utility marks. Articulation groups are composed by
 * VirgilArt.tsx and animated by Virgil.tsx.
 *
 * Construction sheet (viewBox 240×320):
 *   hood peak (120,18) · face center (120,114) · hem y≈300
 *   lantern center (190,216) · satchel center (57,228) · chest motif (120,176)
 */

import type { VirgilPalette } from "@/lib/virgil/palette"
import type { VirgilMotifId } from "@/lib/virgil/variants"
import type { VirgilExpressionDef, VirgilMouthId } from "./expressions"

const EYE_LEFT = { cx: 104, cy: 108 }
const EYE_RIGHT = { cx: 136, cy: 108 }

/* ── Ground ─────────────────────────────────────────────────────────── */

export function GroundShadow({ palette }: { palette: VirgilPalette }) {
  return (
    <ellipse cx={120} cy={306} rx={78} ry={9} fill={palette.ink} opacity={0.1} />
  )
}

/* ── Cloak (body + hood) ────────────────────────────────────────────── */

export function Cloak({ palette }: { palette: VirgilPalette }) {
  return (
    <g data-part="cloak">
      <path
        d="M120 18
           C148 22 168 44 172 74
           C196 96 206 130 208 168
           C210 220 212 262 212 296
           Q181 306 150 298
           Q120 308 90 298
           Q59 306 28 296
           C28 262 30 220 32 168
           C34 130 44 96 68 74
           C72 44 92 22 120 18 Z"
        fill={palette.cloak}
      />
      {/* left-side shade, follows the hem curve */}
      <path
        d="M68 74 C44 96 34 130 32 168 C30 220 28 262 28 296 Q59 306 90 298
           C78 240 66 150 68 74 Z"
        fill={palette.cloakShadow}
        opacity={0.45}
      />
      {/* hem trim band */}
      <path
        d="M28 296 Q59 306 90 298 Q120 308 150 298 Q181 306 212 296
           L212 288 Q181 297 150 289 Q120 299 90 289 Q59 297 28 288 Z"
        fill={palette.trim}
        opacity={0.9}
      />
      {/* hood opening shadow */}
      <ellipse cx={120} cy={112} rx={47} ry={52} fill={palette.cloakShadow} />
    </g>
  )
}

/* ── Satchel with a peeking book ────────────────────────────────────── */

export function Satchel({ palette }: { palette: VirgilPalette }) {
  return (
    <g data-part="satchel">
      {/* shoulder strap */}
      <path
        d="M170 128 C130 160 92 190 60 214"
        stroke={palette.satchelFlap}
        strokeWidth={7}
        strokeLinecap="round"
        fill="none"
        opacity={0.85}
      />
      {/* the book that always rides along */}
      <rect
        x={40}
        y={198}
        width={32}
        height={13}
        rx={3}
        fill={palette.book}
        transform="rotate(-7 56 204)"
      />
      <rect
        x={43}
        y={201}
        width={26}
        height={3}
        rx={1.5}
        fill={palette.bookPages}
        transform="rotate(-7 56 204)"
      />
      {/* satchel body */}
      <rect x={34} y={208} width={46} height={42} rx={11} fill={palette.satchel} />
      <path
        d="M34 219 Q57 232 80 219 L80 214 Q57 226 34 214 Z"
        fill={palette.satchelFlap}
      />
      <circle cx={57} cy={228} r={3.5} fill={palette.trim} />
    </g>
  )
}

/* ── Face: base, eyes (pupils + eyelid layer), brows, mouth ─────────── */

function Mouth({ id, palette }: { id: VirgilMouthId; palette: VirgilPalette }) {
  const stroke = {
    stroke: palette.eye,
    strokeWidth: 3,
    strokeLinecap: "round" as const,
    fill: "none",
  }
  switch (id) {
    case "smile":
      return <path d="M112 132 Q120 139 128 132" {...stroke} />
    case "grin":
      return (
        <path
          d="M109 131 Q120 144 131 131 Q120 137 109 131 Z"
          fill={palette.eye}
        />
      )
    case "neutral":
      return <path d="M114 134 L126 134" {...stroke} />
    case "speak":
      return <ellipse cx={120} cy={134} rx={4} ry={5.5} fill={palette.eye} />
    case "oh":
      return <circle cx={120} cy={134} r={3.5} fill={palette.eye} />
    case "flat":
      return <path d="M113 135 Q120 133.5 127 135" {...stroke} />
    case "soft":
      return (
        <path
          d="M114 133 Q120 137 126 133"
          {...stroke}
          strokeWidth={2.5}
        />
      )
    case "determined":
      return <path d="M113 134.5 L127 133.5" {...stroke} />
  }
}

function EyeOpen({
  cx,
  cy,
  palette,
  soft,
}: {
  cx: number
  cy: number
  palette: VirgilPalette
  soft: boolean
}) {
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={5.5} ry={soft ? 5 : 7} fill={palette.eye} />
      <circle cx={cx - 1.6} cy={cy - 2.6} r={1.8} fill={palette.face} opacity={0.95} />
    </g>
  )
}

/** Eye marks only (open/soft ellipses, happy/closed arcs, wink mix). */
export function Pupils({
  palette,
  expression,
}: {
  palette: VirgilPalette
  expression: VirgilExpressionDef
}) {
  const { eyes } = expression

  const renderEye = (side: "left" | "right") => {
    const { cx, cy } = side === "left" ? EYE_LEFT : EYE_RIGHT
    const style =
      eyes === "wink" ? (side === "left" ? "closed" : "open") : eyes
    switch (style) {
      case "open":
        return <EyeOpen key={side} cx={cx} cy={cy} palette={palette} soft={false} />
      case "soft":
        return <EyeOpen key={side} cx={cx} cy={cy} palette={palette} soft />
      case "happy":
        return (
          <path
            key={side}
            d={`M${cx - 5.5} ${cy + 1} Q${cx} ${cy - 6.5} ${cx + 5.5} ${cy + 1}`}
            stroke={palette.eye}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        )
      case "closed":
        return (
          <path
            key={side}
            d={`M${cx - 5.5} ${cy - 1} Q${cx} ${cy + 4.5} ${cx + 5.5} ${cy - 1}`}
            stroke={palette.eye}
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        )
    }
  }

  return (
    <g data-part="pupils">
      {renderEye("left")}
      {renderEye("right")}
    </g>
  )
}

/**
 * Whether an expression uses the eyelid shutter layer (blink) — false when
 * the eyes are drawn as closed/happy arcs instead.
 */
export function expressionHasLids(expression: VirgilExpressionDef): boolean {
  return (
    expression.eyes === "open" ||
    expression.eyes === "soft" ||
    expression.eyes === "wink"
  )
}

export function Face({
  palette,
  expression,
  pupils = true,
  lids = true,
  pupilsTransform,
}: {
  palette: VirgilPalette
  expression: VirgilExpressionDef
  /** set false when the caller composes <Pupils /> itself (animated path) */
  pupils?: boolean
  /** set false when the caller renders its own blink shutters */
  lids?: boolean
  pupilsTransform?: string
}) {
  const { browLeft, browRight, mouth, blush } = expression

  return (
    <g data-part="face">
      <ellipse cx={120} cy={114} rx={38} ry={40} fill={palette.face} />
      {/* lower-face shade */}
      <path
        d="M88 126 Q120 156 152 126 Q152 148 120 152 Q88 148 88 126 Z"
        fill={palette.faceShadow}
        opacity={0.5}
      />
      {blush && (
        <g fill={palette.blush} opacity={0.55}>
          <ellipse cx={96} cy={126} rx={6} ry={3.4} />
          <ellipse cx={144} cy={126} rx={6} ry={3.4} />
        </g>
      )}

      {pupils && (
        <g data-part="pupil-wrap" transform={pupilsTransform}>
          <Pupils palette={palette} expression={expression} />
        </g>
      )}

      {/*
       * Eyelid layer: face-colored shutters above the eyes, resting at
       * scaleY 0 (open). Virgil.tsx animates scaleY 0→1 for the blink;
       * static art keeps them parked. Closed/happy eye styles draw their
       * own arcs and hide this layer.
       */}
      {lids && expressionHasLids(expression) && (
        <g
          data-part="eyelids"
          style={{
            transform: "scaleY(0)",
            transformBox: "fill-box",
            transformOrigin: "top",
          }}
        >
          <rect x={97} y={99} width={14} height={19} rx={7} fill={palette.face} />
          <rect x={129} y={99} width={14} height={19} rx={7} fill={palette.face} />
        </g>
      )}

      {/* brows */}
      <g
        data-part="brows"
        stroke={palette.eye}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      >
        <path
          d={`M${EYE_LEFT.cx - 6} ${EYE_LEFT.cy - 15} Q${EYE_LEFT.cx} ${EYE_LEFT.cy - 18} ${EYE_LEFT.cx + 6} ${EYE_LEFT.cy - 16}`}
          transform={`translate(0 ${browLeft.dy}) rotate(${browLeft.rotate} ${EYE_LEFT.cx} ${EYE_LEFT.cy - 16})`}
        />
        <path
          d={`M${EYE_RIGHT.cx - 6} ${EYE_RIGHT.cy - 16} Q${EYE_RIGHT.cx} ${EYE_RIGHT.cy - 18} ${EYE_RIGHT.cx + 6} ${EYE_RIGHT.cy - 15}`}
          transform={`translate(0 ${browRight.dy}) rotate(${browRight.rotate} ${EYE_RIGHT.cx} ${EYE_RIGHT.cy - 16})`}
        />
      </g>

      <Mouth id={mouth} palette={palette} />
    </g>
  )
}

/* ── Chest motif (per book-world variant) ───────────────────────────── */

export function Motif({ motif, color }: { motif: VirgilMotifId; color: string }) {
  const stroke = {
    stroke: color,
    strokeWidth: 2.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    fill: "none",
  }
  // glyphs are drawn centered on (120,176), roughly 22×22
  switch (motif) {
    case "laurel":
      return (
        <g data-part="motif" {...stroke}>
          <path d="M113 186 Q108 174 114 165" />
          <path d="M127 186 Q132 174 126 165" />
          <path d="M113 180 L108 178 M113 173 L109 170 M114 167 L111 163" strokeWidth={2} />
          <path d="M127 180 L132 178 M127 173 L131 170 M126 167 L129 163" strokeWidth={2} />
        </g>
      )
    case "thistle":
      return (
        <g data-part="motif" {...stroke}>
          <circle cx={120} cy={172} r={5} />
          <path d="M120 177 L120 187 M114 187 L126 187" />
          <path d="M115 167 L113 163 M120 166 L120 161 M125 167 L127 163" strokeWidth={2} />
        </g>
      )
    case "compass":
      return (
        <g data-part="motif" {...stroke}>
          <circle cx={120} cy={176} r={9} />
          <path d="M120 169 L123 176 L120 183 L117 176 Z" fill={color} stroke="none" />
        </g>
      )
    case "key":
      return (
        <g data-part="motif" {...stroke}>
          <circle cx={116} cy={171} r={4.5} />
          <path d="M119 174 L128 183 M125 180 L128 177 M127 182 L130 179" />
        </g>
      )
    case "falling-star":
      return (
        <g data-part="motif" {...stroke}>
          <path
            d="M122 168 L124 173 L129 173 L125 176 L126 181 L122 178 L118 181 L119 176 L115 173 L120 173 Z"
            fill={color}
            stroke="none"
          />
          <path d="M110 164 Q114 168 117 170 M108 170 Q112 172 115 174" strokeWidth={2} />
        </g>
      )
    case "ascent":
      return (
        <g data-part="motif" {...stroke}>
          <path d="M112 184 L120 177 L128 184" />
          <path d="M112 176 L120 169 L128 176" />
          <path d="M116 168 L120 164 L124 168" strokeWidth={2} />
        </g>
      )
    case "shield":
      return (
        <g data-part="motif" {...stroke}>
          <path d="M112 168 L128 168 L128 178 Q120 187 112 178 Z" />
          <circle cx={120} cy={174} r={2.5} fill={color} stroke="none" />
        </g>
      )
    case "north-star":
      return (
        <g data-part="motif" {...stroke}>
          <path d="M120 163 L120 189 M107 176 L133 176" />
          <path d="M114 170 L126 182 M126 170 L114 182" strokeWidth={1.8} />
        </g>
      )
    case "spark":
      return (
        <path
          data-part="motif"
          d="M123 163 L114 177 L120 177 L117 189 L128 174 L122 174 Z"
          fill={color}
        />
      )
    case "ribbon":
      return (
        <g data-part="motif" {...stroke}>
          <path d="M120 176 L111 170 Q108 176 111 182 Z" />
          <path d="M120 176 L129 170 Q132 176 129 182 Z" />
          <circle cx={120} cy={176} r={2.4} fill={color} stroke="none" />
        </g>
      )
    case "ember-window":
      return (
        <g data-part="motif" {...stroke}>
          <rect x={112} y={166} width={16} height={18} rx={2} />
          <path d="M120 166 L120 184 M112 175 L128 175" strokeWidth={1.8} />
          <circle cx={120} cy={180} r={2} fill={color} stroke="none" />
        </g>
      )
    case "tablet":
      return (
        <g data-part="motif" {...stroke}>
          <rect x={112} y={166} width={16} height={20} rx={3} />
          <path d="M115 172 L125 172 M115 176 L125 176 M115 180 L122 180" strokeWidth={1.8} />
        </g>
      )
    case "city-glyph":
      return (
        <g data-part="motif" {...stroke}>
          <path d="M110 184 L110 174 L116 174 L116 184 M124 184 L124 174 L130 174 L130 184" />
          <path d="M116 184 L116 170 L120 164 L124 170 L124 184" />
          <path d="M108 184 L132 184" />
        </g>
      )
  }
}

/* ── Lantern arm (sleeve, hand) + lantern, grouped for articulation ── */

export function LanternGlow({
  palette,
  gradientId,
}: {
  palette: VirgilPalette
  gradientId: string
}) {
  return (
    <g data-part="glow">
      <circle cx={190} cy={216} r={54} fill={`url(#${gradientId})`} />
      <circle cx={190} cy={216} r={26} fill={palette.glow} opacity={0.28} />
    </g>
  )
}

export function LanternArm({ palette }: { palette: VirgilPalette }) {
  return (
    <g data-part="lantern-arm">
      {/* sleeve emerging from the cloak */}
      <path
        d="M172 154 Q196 158 198 180 Q198 188 190 190 Q178 190 176 178 Q172 166 172 154 Z"
        fill={palette.cloak}
      />
      <path
        d="M172 154 Q196 158 198 180 Q190 176 182 170 Q176 162 172 154 Z"
        fill={palette.cloakShadow}
        opacity={0.5}
      />
      {/* hand */}
      <circle cx={191} cy={186} r={7} fill={palette.face} />
      {/* handle */}
      <path
        d="M183 200 Q191 188 199 200"
        stroke={palette.lanternFrame}
        strokeWidth={3}
        strokeLinecap="round"
        fill="none"
      />
      {/* lantern body */}
      <path
        d="M177 200 L205 200 L211 216 L205 238 L177 238 L171 216 Z"
        fill={palette.lanternFrame}
      />
      <path
        d="M181 206 L201 206 L205 216 L201 232 L181 232 L177 216 Z"
        fill={palette.lanternGlass}
      />
      {/* flame */}
      <ellipse cx={191} cy={220} rx={4.5} ry={6.5} fill={palette.face} opacity={0.95} />
      <ellipse cx={191} cy={222} rx={2.4} ry={3.6} fill={palette.glow} />
      {/* cap + base */}
      <rect x={184} y={195} width={14} height={6} rx={2} fill={palette.lanternFrame} />
      <rect x={181} y={238} width={20} height={6} rx={2.5} fill={palette.lanternFrame} />
    </g>
  )
}

/* ── Open book (reading poses) ──────────────────────────────────────── */

export function OpenBook({ palette }: { palette: VirgilPalette }) {
  return (
    <g data-part="open-book">
      <path
        d="M120 204 C106 197 90 197 78 204 L78 230 C90 223 106 223 120 230 Z"
        fill={palette.bookPages}
        stroke={palette.book}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path
        d="M120 204 C134 197 150 197 162 204 L162 230 C150 223 134 223 120 230 Z"
        fill={palette.bookPages}
        stroke={palette.book}
        strokeWidth={3}
        strokeLinejoin="round"
      />
      <path d="M120 204 L120 230" stroke={palette.book} strokeWidth={3} />
      <path
        d="M86 210 Q100 205 114 210 M86 217 Q100 212 114 217 M126 210 Q140 205 154 210 M126 217 Q140 212 154 217"
        stroke={palette.ink}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
        opacity={0.45}
      />
    </g>
  )
}
