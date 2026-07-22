# Virgil — Character Bible

The design source of truth for Virgil, Tome's lantern-bearing literary guide.
Everything described here is implemented in `src/components/virgil/` and
`src/lib/virgil/`, rendered live in the `/virgil/lab` route, and exported as
static sheets in `public/virgil/posters/`.

- Historical seed: `public/marketing/virgil-master-home.png` (hooded face,
  laurel, lantern gold on midnight blue). This system is an original
  rebuild — full body, articulated layers, own geometry — keeping only the
  brand's midnight/lantern-gold affinity and a laurel motif as continuity.

---

## 1. Character concept

Virgil is a small, hooded, lantern-bearing guide — a reader's companion who
lights the text rather than explaining it away. The three signature props:

- **the lantern** (right hand) — attention, evidence, "let's look at this
  line." Its glow is the emotional meter of the whole character.
- **the book satchel** (left hip) — a coral-spined book always rides along;
  reading is carried, not assigned.
- **the pointed hood and bell cloak** — scholar without being a wizard;
  warm, slightly monastic, original silhouette.

Personality rendered visually: warm (smile default, blush), curious (one
brow up), calm under struggle (no frown states for wrong answers),
celebratory without frenzy (measured glow crescendos, never confetti).

## 2. Construction & proportions

Coordinate system: `viewBox="0 0 240 320"` (3:4). Rendered construction
sheet: `public/virgil/source/virgil-construction.svg`.

| Landmark | Coordinates | Rule |
| --- | --- | --- |
| Hood peak | (120, 18) | single pointed apex — the silhouette's signature |
| Hood opening | ellipse (120,112) r≈47×52 | frames the face as a shadowed arch |
| Face center | (120, 114), r≈38×40 | eyes at y=108, mouth at y≈134 |
| Chest motif | (120, 176), 22×22 | one emblem per book-world variant |
| Lantern center | (190, 216) | hangs from the hand at (191,186) |
| Satchel center | (57, 228) | strap runs right-shoulder → left hip |
| Hem | y ≈ 296–306 | three scallops; ground shadow ellipse at y=306 |

Proportion rule: hood peak → hem ≈ 5 head-heights; face occupies the top
third; the figure is bottom-weighted (bell cloak) so it always feels
planted, never floaty. Squash-and-stretch pivots at the hem (y=320).

Compact mobile bust: the same art cropped to `viewBox="56 14 128 150"`
(hood + face + shoulders) — implemented as `bust` on `VirgilArt`/`Virgil`,
not a separate asset.

## 3. Layer stack

Back → front (each is an independent React component in
`src/components/virgil/parts.tsx`):

1. `GroundShadow` — soft ink ellipse, 10% opacity
2. `LanternGlow` — radial gradient (3 stops) + warm core, opacity-driven
3. `Cloak` — body, left-side shade, hem trim band, hood-opening shadow
4. `Satchel` — strap, peeking book, body, flap, trim button
5. `Face` — face base, lower-face shade, blush, then features:
   - `Pupils` — eye marks (open/soft ellipses, happy/closed arcs, wink)
   - **eyelid layer** — two face-colored shutter rects above the eyes,
     resting at `scaleY(0)`; the blink animates this layer 0→1→0
   - brows — two articulated strokes (dy + rotate per expression)
   - mouth — 8 shapes (smile, grin, neutral, speak, oh, flat, soft,
     determined)
6. `Motif` — chest emblem per variant
7. `OpenBook` — present only in reading poses
8. `LanternArm` — sleeve, hand, handle, hexagonal lantern, flame, cap/base

Articulation groups (transform-based hooks used by the runtime): figure
(lean/bob/squash), head (tilt/translate), pupil drift (glance), eyelids
(blink), lantern arm (shoulder rotation), lantern swing (pendulum),
glow (opacity), satchel (sway).

## 4. Canon palette

Source of truth: `src/lib/virgil/palette.ts`. Poster:
`public/virgil/posters/palette.svg`.

| Slot | Hex | Use |
| --- | --- | --- |
| ink | `#1F2430` | ground shadow, book text lines |
| cloak | `#2F3E66` | hood + cloak body |
| cloakShadow | `#232F4E` | shade side, hood opening |
| trim | `#C8A24B` | hem band (Tome brand gold) |
| face | `#F7EBD4` | warm ivory face |
| faceShadow | `#E9D6B4` | lower-face shade |
| eye | `#232A38` | eyes, brows, mouth, linework |
| blush | `#E0A27E` | cheeks at 55% opacity |
| lanternFrame | `#7A5B2A` | aged brass |
| lanternGlass | `#F7D98A` | warm glass |
| glow | `#F2C14E` | radial glow, flame core |
| satchel | `#8A5A3B` | leather |
| satchelFlap | `#6F4527` | flap + strap |
| book | `#E07856` | coral spine (restrained accent) |
| bookPages | `#F4E9D3` | pages |
| laurel | `#C8A24B` | chest motif |

Contrast: face `#F7EBD4` on cloakShadow `#232F4E` ≈ 12.9:1; eye `#232A38`
on face ≈ 12.6:1; trim gold is decorative only (never carries meaning
alone). Glow is additive light, never an information channel by itself.

## 5. Line, shape, texture, highlight, shadow rules

- **No strokes on the silhouette.** Shapes read as filled masses; strokes
  appear only for facial features (3px, round caps) and motif glyphs (2.4px).
- **One shade per mass.** Cloak gets a single left-side shade at 45%
  opacity of `cloakShadow`; face gets one lower-face shade at 50%. No
  gradients on the body — the only gradient in the system is the lantern
  glow.
- **Texture: none.** Flat color; richness comes from palette and motion.
- **Highlight: eyes only** (small face-colored dot, offset up-left). The
  lantern is the light source; nothing else shines.
- **Shadow: the ground ellipse only.** No drop shadows on layers.

## 6. Lantern behavior & glow rules

- Rest glow opacity **0.72**; pulse ±0.12 on a 3.4s breath in idle.
- Raised glow (evidence, celebrations): 0.85–1.0, held deliberately.
- Lowered glow: whisper 0.4, offline 0.3, sleep 0.25, flame-at-risk 0.35 —
  **low, never out.** An extinguished lantern is forbidden art: it reads as
  punishment.
- The glow is a radial gradient behind the lantern (`LanternGlow`), tinted
  per variant (`glow` slot), and is the only layer whose opacity is
  choreographed independently.

## 7. Expression sheet

Sixteen expressions, data-defined in
`src/components/virgil/expressions.ts` from three articulators (eye style ×
brow dy/rotate × mouth shape) + blush flag. Rendered:
`/virgil/lab` expression gallery and
`public/virgil/posters/expression-sheet.svg`.

`neutral · smile · grin · curious · thoughtful · surprised · whisper ·
proud · gentle · encouraging · concerned · celebratory · sleepy ·
listening · wink · determined`

Rules: no shaming frown (concern is honest, not sad); `celebratory` uses
happy-closed eyes; `sleepy` eyes are closed arcs, lids parked.

## 8. Pose sheet

Every semantic state owns a pose (`src/components/virgil/poses.ts`,
52 entries) composed from: body bob/lean/squash, head tilt, pupil look,
lantern-arm angle, lantern lift/swing, glow, satchel sway, book-open flag,
expression. The full sheet renders in `/virgil/lab` (state gallery) and
`public/virgil/posters/contact-sheet.svg`.

Pose grammar: the **lantern arm is the narrator** — raised = evidence or
celebration (−24°…−40°), lowered = patience or rest (+4°…+8°). The **book**
appears whenever Virgil reads, explains, or hands the moment back to the
text. The **head tilt** carries social warmth (listen 7°, whisper 8°).

## 9. Hand / gesture sheet

One visible hand (lantern hand), one implied hand inside the cloak:

- lantern hold (rest) · lantern raise (greet/point/seal) · lantern lowered
  (patience, system states)
- hand-to-chin (think — implied by pose + thoughtful face)
- palm-up offer (near-miss, encouraging poses — arm angle −8°, open book)
- book presentation (readAlong, explain, citeParagraph, parentMode)

## 10. Prop sheet

- **Lantern** — hexagonal brass frame, warm glass, flame; articulated at
  shoulder + handle swing; glow layer (see §6).
- **Book satchel** — leather, strap, coral book peeking out; sways ±2° in
  locomotion-adjacent loops.
- **Open book** — two-page spread with suggested text lines; reading states.
- **Chest motif** — 13 glyphs (laurel + 12 book-world emblems), 22×22,
  single hue from the variant's `laurel` slot.

## 11. Book-world costume variants

Twelve variants in `src/lib/virgil/variants.ts`, each a **restrained**
adaptation — palette slots + one chest motif + one glow hue; silhouette
untouched. Rendered: `/virgil/lab` variant gallery and
`public/virgil/posters/variant-sheet.svg`.

| Variant | Cloak | Trim | Glow | Motif |
| --- | --- | --- | --- | --- |
| Macbeth | `#3B3F4D` storm | `#8E3B3B` | `#E8B64C` | thistle/crown |
| Moby-Dick | `#2E5266` maritime | `#E8E3D3` sea-spray | `#F0CE7A` | compass |
| Alice | `#4A6FA5` | `#C0473B` card red | `#F4D06F` | gold key |
| Paradise Lost | `#262640` void | `#E5C15D` | `#F6E3A1` | falling star |
| Divine Comedy | `#4E3A5C` | `#B3402A` vermilion | `#F2D38A` | ascent chevrons |
| Iliad | `#4E5A6E` | `#B07D3A` bronze | `#EFC56A` | shield |
| Odyssey | `#333F6E` indigo | `#C9B28A` rope | `#F0D28A` | north star |
| Frankenstein | `#43536B` slate | `#7FD4D9` | `#9FE6E6` icy cyan | spark |
| Pride & Prejudice | `#66795C` sage | `#C9898E` rose | `#F2D18C` | ribbon |
| Jane Eyre | `#5B4E5E` heather | `#8E3B3B` red-room | `#D97B4A` ember | ember window |
| Meditations | `#6E6156` dawn wool | `#A14A3A` stoic red | `#EFC98A` | wax tablet |
| The Republic | `#2F4C8E` cobalt | `#D4AF5A` gold | `#F6DC92` | city glyph |

## 12. Turnarounds

`public/virgil/posters/turnaround.svg` — front and three-quarter rendered
from the component system over a 5-head proportion grid; side and back as
labeled construction schematics (cloak mass, strap run, lantern carriage).

## 13. Silhouette rules

Test: `public/virgil/posters/silhouette-test.svg` and the `/virgil/lab`
scale gallery (24 / 40 / 64 / 128 / 256 px, color beside single-ink
silhouette beside inverted mono mark).

Pass criteria at **24px**: (1) pointed hood peak, (2) bell hem with
scallops, (3) lantern mass with bump on the right flank. If any of the
three is lost, the render is too small — switch to the bust crop rather
than shrinking further. Single-color and grayscale utility marks live in
`public/virgil/runtime/virgil-mark.svg` and `virgil-grayscale.svg`
(luminance-mapped palette).

## 14. Error / offline / loading fallback art

Static state renders, exported from the same components (no special-case
art that could drift): `public/virgil/runtime/virgil-offline.svg` (offline
pose, glow 0.3, book open) and `virgil-loading.svg` (lantern pendulum
pose). The runtime falls back to `VirgilArt` stills automatically under
reduced motion (see motion bible §3).

## 15. Favicon / app-icon adaptation

`public/virgil/runtime/virgil-app-icon.svg` — the **bust crop on a midnight
tile with the glow ring behind the hood** (rounded-square 512). Rule: never
shrink Virgil to an unreadable face disc; the icon keeps the hood peak and
the glow, which are the recognizable marks at 16–64px.

## 16. Accessibility

- Runtime SVG: `role="img"` with a state-aware `aria-label`
  ("Virgil — {state label}"); decorative state changes stay silent.
- Meaningful state changes announce through a visually-hidden
  `aria-live="polite"` region (announcement strings live in
  `src/lib/virgil/state-machine.ts`).
- Reduced motion: `prefers-reduced-motion` (or prop) collapses every state
  to its still pose with a 150 ms opacity crossfade — mapping is total (52
  of 52 states; see `VIRGIL_REDUCED_MOTION_STILLS`).
- Tab hidden → all loops park in the `sleep` state; nothing animates
  offscreen or off-tab.
- Color never carries meaning alone (glow changes pair with posture and
  copy; contrast ratios in §4).
