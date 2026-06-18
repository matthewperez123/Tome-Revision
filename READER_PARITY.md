# Reader Parity — Scroll vs. Single/Spread

Goal: Single-page and Two-page (column) modes must be **visually identical to
Scroll mode** in coloring, fonts, spacing, and sizing — differing *only* in
layout. **Scroll is the source of truth** and must not change.

Surfaces:
- **Scroll**: `src/app/(app)/read/[bookId]/page.tsx` → `chapterBodyElement`
  (`.prose-reader.reader-measure` inside `mx-auto max-w-[680px] px-6 py-12
  md:px-8 md:py-16`), inline `font-size`/`line-height`/`--measure`.
- **Paginated**: `src/components/tome/paginated-reader.tsx` → `.reader-single-paper`
  paper(s) with per-page `padding: 40px 48px`; width `min(92vw,640px)` (single)
  / `min(45vw,500px)` per column (spread). Page breaks measured by
  `src/lib/paginator.ts` using `PAGE_PADDING_H=96 / PAGE_PADDING_V=80` from
  `page.tsx`.

Shared layer that already exists: `.prose-reader` (typography + form-aware
`content-prose|content-verse|content-drama` rules), `[data-reader-theme]`
palette tokens (`--reader-bg/-ink/-muted/-edge/-accent/-shadow`),
`.reader-surface`, `.reader-justify/.reader-ragged`, `.reader-a11y-face`,
`.reader-single-paper`. **Both branches descend from one `.reader-surface`
ancestor (page.tsx:856)** — so reading tokens set there cascade to both.

## Parity table

| Property | Scroll value | Paginated value | Drift? | Action / pass |
|---|---|---|---|---|
| **Fonts** | | | | |
| reading body family | `font-serif` → `var(--font-serif)` (Literata) | `font-serif` (Literata) | no | — (already shared) |
| body weight | inherit (400) | inherit (400) | no | — |
| optical-sizing / feature-settings / text-rendering / -webkit-font-smoothing | none set (browser default) | none set | no | — (neither sets any; parity holds) |
| heading family | `.prose-reader h2/h3/h4` → inherits Literata, weight 600 (NOT Fraunces) | same | no (shared) | NOTE: in-reader headings use Literata in BOTH modes; RUBRIC reserves Fraunces for display. Not a parity drift — surfaced for your call, not changed. |
| a11y reading face | `.reader-a11y-face` → `var(--font-sans)` | same | no | — |
| **Coloring** | | | | |
| surface background | `.reader-surface` + inline `var(--reader-bg)` | `.reader-single-paper` `var(--reader-bg)` | no | verify Pass 2 |
| ink / foreground | `var(--reader-ink)` | `var(--reader-ink)` | no | — |
| muted (page no., progress, footer) | `var(--reader-muted)` | `var(--reader-muted)` | no | — |
| accent (rule, progress fill) | `var(--reader-accent)` | `var(--reader-accent)` | no | — |
| selection color | (inherited; not reader-scoped) — TBD | (same) — TBD | verify | Pass 2: confirm both, add reader-scoped selection if scroll has none |
| two-page gutter / page edge | n/a | spine `var(--reader-edge)` + `var(--reader-shadow)` (theme-derived) | no | verify Pass 2 (confirm no separately-chosen gray) |
| hardcoded hex on paginated surface | — | none known on the reading surface (drama/verse enrichments use literal hex in BOTH modes via `.prose-reader`) | no | Pass 2: grep-confirm paginated component has zero literal colors |
| **Sizing** | | | | |
| base font-size | inline `${prefs.fontSizePx}px` | prop `${fontSize}px` (= same prefs value) | no (value) | tokenize → `--reader-font-size` (Pass 1) |
| line-height | inline `prefs.lineHeight` | prop `prefs.lineHeight` | no (value) | tokenize → `--reader-line-height` (Pass 1) |
| **measure (line width)** | `.reader-measure` `max-width: ${prefs.measureCh}ch` (centered in 680px col) | **px-based**: single = `min(640,w) − 96`; spread col = `(w−1)/2 − 96` | **YES** | **Pass 3**: route paginated text width through `--reader-measure` (ch) + update paginator measurement to match → identical chars/line |
| **Spacing** | | | | |
| paragraph margin | `.prose-reader p { margin-bottom:1.5em }` | shared | no | — |
| first-line indent | `.prose-reader p+p { text-indent:2em }` | shared | no | — |
| verse stanza spacing / size | `.content-verse p { margin-bottom:1.5em; font-size:.95em; line-height:1.7 }` | shared | no | — |
| drama speaker / line spacing | `.content-drama` table rules (small-caps, 0.75em row pad) | shared | no | — |
| text-align / hyphens | `.reader-justify`/`.reader-ragged` (+ hard verse/drama guards) | shared (class passed through) | no | — |
| **horizontal text padding** | container `px-6` (24px) / `md:px-8` (32px) | per-page `48px` | **YES** | **Pass 3**: unify via `--reader-pad-x` |
| **vertical text padding** | container `py-12` (48px) / `md:py-16` (64px) | per-page `40px` | **YES** (layout-ish) | **Pass 3**: unify via `--reader-pad-y` (note: paginated top/bottom is partly layout — reconcile with progress strip) |
| **Layout (intentional differences — NOT drift)** | | | | |
| overflow / advance | vertical scroll | fixed-height page, horizontal translate page-turn | intentional | keep |
| column gap (spread) | n/a | spine/gutter | intentional | keep |
| paper card (shadow/radius) | none (full-bleed surface) | `.reader-single-paper` soft edge | intentional (book-leaf affordance) | keep |
| progress strip / page number | scroll footer "min remaining" | bottom progress strip + page no. | intentional | keep |

## Drift summary (worklist for Passes 2–3) — RESOLVED
1. **measure** — ✅ FIXED. Paginated content now carries `.reader-measure` (`max-width: var(--reader-measure)` = 68ch) and consumes `var(--reader-font-size)`/`var(--reader-line-height)`. Single paper widened `min(92vw,640px)` → `min(92vw,680px)` to match scroll's `max-w-[680px]` column. Result: single-page text width = **616px = identical to scroll** (68ch cap doesn't engage since the column is narrower; the column governs in both modes). Paginator measurement moved in lockstep (`usableW` clamp 640→680, `PAGE_PADDING_H` 96→64) so page breaks reflect the rendered width. Spread columns are physically narrower (436px) — intentional layout, not a typography drift; their font/size/leading/inset still match scroll.
2. **horizontal padding** — ✅ FIXED. Per-page padding routed through `var(--reader-pad-x)` (2rem = 32px/side), matching scroll's `md:px-8`. Paginator `PAGE_PADDING_H` = 64.
3. **vertical padding** — kept at 40px/page (paginated `PADDING_V`) as a deliberate page-layout constant (scroll's `py-16` pads only the chapter's start/end, not every screenful; mirroring 64px per page would waste a fixed page and fight the progress strip). Documented as intentional layout, not drift.
4. **Color/font** — ✅ VERIFIED no drift. Paginated component has ZERO literal colors — every surface/edge/spine/shadow/progress/muted value is a `var(--reader-*)` token; reading + heading families resolve to Literata/Fraunces identically. Live sample (parchment): surface bg, paper bg, body ink, tokens all equal across modes.

## Pass 2–3 result (parity achieved)
Single-page and spread now share scroll's typography 1:1 — Literata 19px / line-height 1.8 / ink `#2b2620` / 68ch measure / 32px horizontal inset, all from the one `.reader-surface` token layer. The only remaining differences are intentional layout: scroll = full-bleed vertical scroll; paginated = fixed-height paper card(s) + horizontal page-turn + spine/gutter + progress strip; spread columns narrower by physical necessity. Scroll itself is unchanged (verified: 19px / 34.2px / 748px-cap→616px / Literata / ink — byte-identical before and after).

## Pass 1 refactor (shared token scaffold — no visual change)
Reading tokens defined once on `.reader-surface` (set inline from prefs in
`page.tsx`), consumed by the scroll body now and the paginated surface in
Pass 3:
- `--reader-font-size`, `--reader-line-height`, `--reader-measure`,
  `--reader-pad-x`, `--reader-pad-y`.
Scroll body switched from per-element inline `font-size`/`line-height`/`--measure`
to the cascading tokens (identical resolved values ⇒ no visual change).
Paginated still consumes its props this pass; Pass 3 flips it to the tokens and
updates the paginator constants together.
