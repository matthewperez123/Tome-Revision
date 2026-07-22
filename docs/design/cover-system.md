# Tome Cover System

The cover system for the twelve featured books: a typed Book Experience
Registry, a procedural vector-art generator, React components, and the
provenance rules that keep original Tome art visibly distinct from
public-domain source art (MASTER_EXECUTION_PLAN §10).

## Pieces

| Piece | Path | Role |
| --- | --- | --- |
| Registry types | `src/lib/books/types.ts` | `BookSlug`, `CoverArchetype`, `CoverProvenance`, `BookPalette`, `BookExperience` |
| Registry | `src/lib/books/registry.ts` | The twelve typed experiences + `getBookExperience()` accessors |
| Generator | `scripts/covers/tome-vector-covers.mjs` | Procedural SVG → PNG/WebP pipeline |
| Generated art | `public/covers/tome-generated/` | SVG + PNG + WebP per book, `manifest.json`, `contact-sheet.svg` |
| Components | `src/components/covers/TomeCover.tsx`, `CoverStack.tsx` | Rendering, loading states, provenance badge, tactile stack |

## The twelve archetypes

Each featured book owns exactly one archetype. Archetypes differ in
**composition**, not in dialect — every cover shares the same geometry
language (matte rounded forms, gold hairline double frame, lantern-gold
accents, seeded paper-grain scatter, radial vignette).

| # | Archetype | Book | Motif rendered |
| --- | --- | --- | --- |
| 1 | Emblem / Relic | Macbeth | gold crown, upright dagger, storm arcs |
| 2 | Horizon / Negative Space | Moby-Dick | pale sky, teal sea band, breaching whale curve, compass star |
| 3 | Constellation / Cabinet | Alice | scattered doors, keys, card diamonds, dotted connectors |
| 4 | Threshold / Portal | Paradise Lost | rounded gold gate, falling star, celestial rings |
| 5 | Ascent / Journey | Divine Comedy | rising concentric arcs, steps, glowing lantern |
| 6 | Map / Voyage | Odyssey | islands, dotted gold route, star field |
| 7 | Fragment / Evidence | Iliad | shield in three rotated fragments, spear, ochre shoreline |
| 8 | Experiment / Spark | Frankenstein | alpine peaks, pale moon, cyan energy line |
| 9 | Social Geometry / Letter | Pride and Prejudice | overlapping circles, ribbon curves, sealed letter |
| 10 | Window / Ember | Jane Eyre | four-paned ember window, moor line |
| 11 | Quiet Symbol / Tablet | Meditations | wax tablet, stylus, dawn band |
| 12 | Cave / City / Light | Republic | geometric city, cave mouth, sun beam |

## Palette table

Palettes are the Living Archive book-world slots (plan §7). They are
defined once in `src/lib/books/registry.ts` and mirrored into the
generator config — change both together and re-run the generator.

| Slot | Ground | Ink | Primary | Accent | Gold |
| --- | --- | --- | --- | --- | --- |
| macbeth | `#1B2437` | `#0E1420` | `#3D4E6E` | `#B03A2E` | `#E3B34C` |
| moby-dick | `#0F3B4C` | `#082430` | `#1F6E8C` | `#E9F1F2` | `#E8C46A` |
| alice | `#F6EFE3` | `#2A2438` | `#5B4E8C` | `#D94F5C` | `#DFAF4F` |
| paradise-lost | `#171226` | `#0B0817` | `#43346B` | `#D98E4A` | `#F0C766` |
| divine-comedy | `#26160F` | `#170D08` | `#7A4A2B` | `#4E7D5B` | `#EFC25E` |
| iliad | `#26354A` | `#141E2C` | `#4A6B8A` | `#C57B3A` | `#D9A94E` |
| odyssey | `#14243F` | `#0A1426` | `#2E4E86` | `#3FA08C` | `#E6BC58` |
| frankenstein | `#101C26` | `#070F16` | `#23455A` | `#5FD3D0` | `#E3C169` |
| pride-prejudice | `#F4EBDD` | `#3A2E2A` | `#8C6A4F` | `#5E7D4F` | `#D9A94E` |
| jane-eyre | `#2B1E24` | `#180F14` | `#5C3A46` | `#C4553B` | `#E0B45C` |
| meditations | `#F0E7D8` | `#2E2620` | `#6E5B49` | `#9C3D33` | `#CFA050` |
| republic | `#16233D` | `#0B1322` | `#2C4A7C` | `#3FA08C` | `#EAC35E` |

## Generation pipeline

```bash
node scripts/covers/tome-vector-covers.mjs
```

1. **Compose** — each book's archetype function paints SVG shapes over its
   palette ground at 768 × 1024 (3:4). Grain is a deterministic seeded
   scatter (mulberry32 over the slug), so re-runs are reproducible.
2. **Rasterize** — when `sharp` is available (devDependency), each SVG is
   exported at 2× (1536 × 2048) to PNG and WebP. Without sharp, SVG sources
   and the manifest are still written and the manifest records
   `raster: "svg-only"`.
3. **Manifest** — `public/covers/tome-generated/manifest.json` records per
   book: slug, canonical `bookId`, archetype, palette, asset paths, alt
   text, provenance (`"original Tome vector art"`), and generator metadata
   (script, version, node runtime, raster backend).
4. **Contact sheet** — `contact-sheet.svg` tiles all twelve covers with
   slug/archetype labels for the visual-balance QA pass.

The generator never touches the existing Standard Ebooks /
`public/covers/tome/` pipeline outputs; it writes only to
`public/covers/tome-generated/`.

## Provenance rules

Four classes of cover art exist in Tome, and they must never be blurred:

- **Public-domain source** — historical art from the existing cover-factory
  pipeline. Keep source attribution; never overwrite.
- **Tome-generated** — original art made for Tome (this vector set, or
  briefed image generation). Marked with the "Tome original" badge in
  `TomeCover` and `provenance: "tome-generated"` in the registry. Never
  presented as a historical source.
- **Procedural fallback** — runtime-composed placeholder (e.g.
  `ClassicsCover`) used when no art exists. Functional, not decorative
  provenance.
- **Stoa reward art** — `stoa_paintings` rows, unlocked 1:1 per book when
  the reader passes a Trial for that book (unlock derived from
  `quiz_results.passed`; see `docs/architecture/supabase-data-map.md`).
  Reward art is earned, not chrome, and uses `provenance: "stoa-reward"`.

Hard constraints (plan §7/§10): no baked-in title/author text in any
generated image; real text is typeset over the art by the UI. Alt text
comes from the registry, and the same string is embedded as the SVG
`aria-label`.

## QA checklist

- [ ] Re-run `node scripts/covers/tome-vector-covers.mjs` after any palette
      or archetype change; confirm outputs are byte-stable for unchanged
      books (deterministic seed).
- [ ] Open `contact-sheet.svg`: the set reads as one curated family —
      shared frame, grain, gold accent discipline; no cover dominates.
- [ ] No title/author text, letters, or numerals inside any artwork
      (connector dots and tablet strokes are abstract marks, not glyphs).
- [ ] No malformed anatomy — this set is object/landscape-only by design.
- [ ] No duplicated motifs across books (each archetype renders its own
      symbol vocabulary).
- [ ] No cultural errors (Greek bronze for Iliad, not medieval plate;
      Regency letter/ribbon for Austen, etc.).
- [ ] Contrast: motif shapes readable against ground at 96 px thumb size;
      gold frame visible on both dark and light grounds.
- [ ] `manifest.json` entry count is 12; every entry has alt text and
      `provenance: "original Tome vector art"`.
- [ ] `TomeCover` loading state shows a palette-matched panel, never a
      gray box; unknown slugs render the quiet fallback.
- [ ] `CoverStack` fans on hover/focus with `motion-safe:` only; with
      reduced motion the stack is static and every cover stays reachable
      by keyboard.
- [ ] Registry and generator palettes match (spot-check one hex per book).
