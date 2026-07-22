# The Living Archive — Visual System Bible

**Author:** Living_Archive_Design_Engineer (Tome rebuild team)
**Date:** 2026-07-22 · **Branch:** `kimi/tome-virgil-maximalist-demo-20260722`
**Source of truth:** `src/styles/living-archive.css` (runtime) · `src/lib/design/tokens.ts` (typed mirror)
**Inputs:** Master Plan §7 (visual world) · `docs/research/mobbin-pattern-synthesis.md` (principles)

---

## 1. Direction

The Living Archive is Tome's original visual world: **bright literary dioramas on warm paper, built from matte rounded forms, held together by midnight ink and lit by lantern gold.** It is a place you enter, not a dashboard you scan.

The system serves the three-mode rhythm (Master Plan §6):

| Mode | Character | How the tokens express it |
|---|---|---|
| **Explore** | colorful, animated, playful | world palettes, raised surfaces, shadows, full grain |
| **Read** | calm, typographic, quiet | reader themes; grain off in day/night, minimal chrome, one accent |
| **Prove & celebrate** | tactile, immediate, joyful | pressed edges, jade/amber/vermilion feedback, gold/violet ceremony |

Two reference-derived principles are load-bearing (see synthesis doc):

- **Useful beauty** (bar.digital): every decorative choice must carry orientation, information, or emotion. Grain exists to kill flat digital sheen; world palettes exist to tell you *which book you are inside*. Ornament that does no work is cut.
- **Modes, not one dashboard**: the interface deliberately transitions between Explore / Read / Prove. Token themes (`light`/`dark` vs. `reader-*`) are the mechanism.

## 2. Palette

### 2.1 Core colors (light day values; dark lifts in §5)

| Color | Hex | Role | Contrast on `--la-page` `#F7F3EA` |
|---|---|---|---|
| Paper white | `#FFFDF8` | card surface | — |
| Warm ivory | `#F6F1E6` | base page tint | — |
| Midnight ink | `#141B2E` | body text | 15.0:1 AAA |
| Deep navy | `#1B2745` | dark anchors, world deeps | 13.5:1 AAA |
| Luminous sky | `#7FB4E8` | secondary fills, highlights | fills only — pair with `#14233C` ink |
| Electric cobalt | `#2E5BE6` | primary actions, focus | 4.9:1 AA |
| Lantern gold | `#D9A63C` | Wisdom, ceremony, accents | 2.3:1 — **decorative/large only**; text uses `--la-wisdom-deep` `#8A6317` (5.4:1 AA) |
| Coral | `#F27059` | warm accents | decorative; pair with deep ink |
| Jade | `#2E8C6A` | accent family; success text uses `#1F8A5B` (4.6:1 AA) | 4.0:1 (large) |
| Violet | `#7C5CD6` | Seal medallions | large/decorative; text uses `--la-seal-deep` `#553AA8` (6.0:1 AA) |
| Vermilion | `#C93A2E` | error, wax-seal warmth | 4.8:1 AA |

**Contrast rules that matter:**

1. Lantern gold is never body text. Wisdom *labels* use `wisdom-deep`; Wisdom *chips/medallions* use gold fill + `wisdom-ink` `#3A2B08` (10.1:1 on gold).
2. Luminous sky is a fill, not ink. Text on it is always `secondary-ink` `#14233C`.
3. Every `-soft` tint (e.g. `primary-soft`, `success-soft`) must pair with its deep/full token for text, never `ink-faint`.
4. `ink-faint` `#8B93A6` is metadata-only (timestamps, counts) — never body, never instructions, never feedback.

### 2.2 Semantic tokens

Full runtime definitions live in `living-archive.css`; the typed mirror is `laThemes` in `tokens.ts`. Grouping:

- **Surfaces:** `page`, `surface`, `surface-raised`, `surface-sunken`, `overlay`, `overlay-solid`
- **Ink:** `ink`, `ink-muted`, `ink-faint`, `ink-inverse`
- **Actions:** `primary` (+`-ink`/`-edge`/`-soft`), `secondary` (+`-ink`/`-edge`/`-soft`)
- **Game loop:** `wisdom` (+`-deep`/`-ink`/`-soft`), `flame` (+`-deep`/`-ink`/`-soft`), `seal` (+`-deep`/`-ink`/`-soft`)
- **Feedback:** `success`, `near-miss`, `error` (each +`-soft`)
- **System/roles:** `focus`, `teacher` (+`-soft`), `parent` (+`-soft`)

The `-edge` tokens are the color of the **pressed bottom edge** (the Codex/tactile button pattern already in `globals.css`); Living Archive components consume them instead of inventing per-component shadow colors.

### 2.3 Book-world palette slots

Twelve worlds, four slots each — `ground` (dominant diorama color), `deep` (world ink/shadow), `accent` (bright motif), `glow` (luminous highlight). CSS: `--la-world-{id}-{slot}`; TS: `laWorlds[id]`, `laWorldCss(id, slot)`.

| World | Mood | Ground | Deep | Accent | Glow |
|---|---|---|---|---|---|
| Macbeth | storm | `#45506B` | `#232A3D` | `#E4B95B` lightning gold | `#9AA7C7` |
| Moby-Dick | maritime | `#2F6E8F` | `#12303F` | `#E8D9B5` whale-bone | `#7FC4D9` |
| Alice | cabinet | `#4E9BA6` | `#233A4A` | `#E05A6B` card red | `#F2D98C` key gold |
| Paradise Lost | threshold | `#4A3F78` | `#1C1830` | `#E4C66B` falling star | `#B8A9E8` |
| Divine Comedy | ascent | `#7C6BA8` | `#2A1E3F` | `#E8B23C` paradise gold | `#9FD8E8` |
| Iliad | bronze | `#A6643A` | `#3E2A1C` | `#2E5E8C` Achaean blue | `#E0A75B` ochre |
| Odyssey | sea | `#2C4E7C` | `#14233C` | `#D9C08A` nav sand | `#6FA8D8` |
| Frankenstein | alpine | `#4A6070` | `#1E2A33` | `#63C7E0` lab spark | `#A8E4F0` |
| Pride & Prejudice | garden | `#6E9A6B` | `#2E4030` | `#D98CA6` ribbon rose | `#F2E4BC` |
| Jane Eyre | ember | `#7A3E34` | `#2E1E22` | `#E0885B` ember | `#C9A9BC` moor dusk |
| Meditations | dawn | `#B8895A` | `#3A2E24` | `#A03A30` stoic red | `#F0D9B5` |
| Republic | geometry | `#2E5BE6` | `#1A2340` | `#D9A63C` cave-light gold | `#7FB0F0` |

Rules: world palettes color **portals, dioramas, map trails, node art, and Virgil costume accents** — never body text, never the reader canvas, never teacher data surfaces. `accent` may touch UI only as icon/motif fills ≥24px.

## 3. Typography

The existing four-family system is preserved and formalized (families are already wired via `--font-display`/`--font-serif`/`--font-sans`/`--font-mono` in `globals.css`):

| Family | Slot | Rules |
|---|---|---|
| **Fraunces** | Expressive display | Hero statements, chapter titles, book titles, Seal names, ceremony moments. Optical size up; weight 500–700. Never body copy, never buttons. |
| **Literata** | Reading canvas | All long-form text in `/read`. Also quotes/evidence passages in Trials. Line length 58–74ch, line-height 1.5–1.65 (per ebook-typography synthesis). |
| **Inter** | Interface | Every control, label, nav item, form field, teacher surface. Weight 400–600. |
| **JetBrains Mono** | Metadata | Join codes, streak counts, coordinates, IDs, tabular numbers in data cards. Never prose. |

Hard rules (Master Plan §7): **real text over generated artwork** — titles, authors, scores, and UI copy are never baked into images. Display numerals in reward moments may use Fraunces; data numerals use JetBrains Mono with `tabular-nums`.

## 4. Texture, grain, and depth

- **Grain:** one SVG fractal-noise tile (`--la-grain-size: 180px`) at `--la-grain-opacity` 0.035 (light) / 0.05 (dark) / 0.045 (sepia) / **0 in reader-day, reader-night, and high-contrast**. Apply via the opt-in `.la-grain` class on Explore-mode surfaces and dioramas only — never over reading text. Grain is procedural (no asset download, no licensing).
- **Elevation:** three shadow tokens — `raised` (cards), `float` (sheets/trays), `portal` (dragged items, portals). Do not invent one-off shadows.
- **Edges:** tactile components get a solid bottom edge in their `-edge` token (2–4px) that compresses on press, per the existing `.codex-pressable` pattern. Matte, not glossy.
- **Radius:** `8 / 14 / 22px` (+ `999px` round). Diorama forms use 22px; controls 8–14px.

## 5. Themes

| Theme | Selector | Purpose | Overrides |
|---|---|---|---|
| Light (default) | `:root`, `[data-theme="light"]` | Explore/Prove day | full token set |
| Dark | `[data-theme="dark"]` | night app shell | all semantic tokens lifted for contrast |
| System | `[data-theme="system"]` + `prefers-color-scheme` | follow OS | mirrors dark values in the media query |
| Reader day | `[data-theme="reader-day"]` | bright reading | paper/ink only; grain off |
| Reader sepia | `[data-theme="reader-sepia"]` | lamplight reading | sepia paper/ink + brown primary/focus; most grain |
| Reader night | `[data-theme="reader-night"]` | dark reading | warm dim ink, desaturated primary; grain off |
| High contrast | `[data-theme="high-contrast"]` or `prefers-contrast: more` | forced HC | pure ink, stronger borders, grain off |
| Reduced transparency | `[data-transparency="reduced"]` or `prefers-reduced-transparency` | solid overlays | scrims solid, `--la-backdrop-blur: 0` |

Reader themes deliberately inherit world palettes and shadows untouched — in Read mode they are simply never invoked by reader components. Dark `ink` is warm (`#ECE7DA`) rather than pure white to keep the paper metaphor at night.

## 6. Do / Don't (from Master Plan §7, operationalized)

**Do**

- Keep the blue/white/gold brand affinity — cobalt + paper + lantern gold are the spine.
- Let world palettes own Explore surfaces so each book feels like a place.
- Use gold sparingly: Wisdom, Seals, lantern glow, rim highlights.
- Give every interactive element all eight states (idle/hover/focus/pressed/loading/success/error/disabled) — see `component-inventory.md`.
- Meet AA minimums using the `-deep` text variants wherever an accent would fail.

**Don't**

- Don't let dusty museum brown dominate (sepia is a reader theme, not the brand).
- Don't use generic purple SaaS gradients; violet appears only as the Seal token and flat world fills.
- Don't use constant glassmorphism; overlays are one scrim token, and reduced-transparency removes blur entirely.
- Don't build generic dashboard card walls — the home is a portal + trail (synthesis §3).
- Don't let game UI compete with reading text (reader themes strip grain and color).
- Don't imitate Duo/Headspace/Brilliant pixels or copyrighted cover art.
- Don't spread fake antique parchment everywhere — grain is 3.5% noise, not a texture photo.
- Don't use baby-proportioned or excessively childish forms.

## 7. Token reference (quick table)

| Token | Light | Dark | Notes |
|---|---|---|---|
| `--la-page` | `#F7F3EA` | `#0F1420` | app ground |
| `--la-surface` | `#FFFDF8` | `#171D2C` | cards |
| `--la-surface-raised` | `#FFFFFF` | `#1F2637` | sheets, trays |
| `--la-ink` | `#141B2E` | `#ECE7DA` | body text |
| `--la-ink-muted` | `#5A6478` | `#A3ABBE` | secondary text (AA) |
| `--la-primary` | `#2E5BE6` | `#7AA2F2` | actions, focus |
| `--la-secondary` | `#7FB4E8` | `#8ABCE8` | fills w/ deep ink |
| `--la-wisdom` / `-deep` | `#D9A63C` / `#8A6317` | `#E4B95B` / `#E9C887` | decorative / text-safe |
| `--la-flame` | `#E4572E` | `#F08A55` | streak hearth |
| `--la-seal` | `#7C5CD6` | `#A08AE8` | medallions |
| `--la-success` | `#1F8A5B` | `#4CC38A` | feedback + icon always |
| `--la-near-miss` | `#B97A10` | `#E0A94A` | warm, never punishing |
| `--la-error` | `#C93A2E` | `#F07568` | paired w/ icon + placement |
| `--la-focus` | `#2E5BE6` | `#8AB0F5` | 3px ring, 2px offset |
| `--la-teacher` | `#2F4A6E` | `#7D96BA` | sober steel navy |
| `--la-parent` | `#96506E` | `#C98AA6` | warm plum |

Durations (`--la-dur-*`), grain, radii, shadows, and the 48 world slots: see the stylesheet header comments. TS consumers use `laVar(name)` / `laCss(name)` / `laWorldCss(world, slot)` rather than hand-writing var names.
