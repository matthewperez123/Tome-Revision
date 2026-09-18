# Codex Reader — Calibration Report (spec_version 1)

Date: 2026-09-17 · Verified with `scripts/verify-reader.ts` (Playwright, real login as
beatrice.student@tome.test) against a local dev server + the production
`book_page_maps` table on `vjaezrcuuzmbmnsfrtwt`.

## Frozen geometry

`src/lib/reader/codex-spec.ts` — page 528×816, text block 392×672, Literata
16px/24px justified, hyphenation off, chapters-open-recto off (user-settable).
672px = exactly 28 lines at the canonical leading. The canonical whole-book
page map is computed at this geometry only (`spec_version = 1`); any change to
the geometry must bump the spec version and re-run the backfill.

## Library backfill

`scripts/reader/backfill-page-maps.ts --all --concurrency=4` drives the
`/reader-map` harness (same shared measurement code as the live reader,
`src/lib/reader/folio-map.ts`) and upserts `book_page_maps`.

- 1000 books with content on disk → **999 mapped** in 17.3 min.
- Only failure: `de-bello-gallico` ("unknown book or no chapters" — no content
  on disk; expected).
- The 210 table-containing (drama) books were force-recomputed twice after the
  verse-speech and prose-speech-cell pagination fixes (210/210, ~3.5 min each).
- The run is resumable: `book_page_maps` itself is the progress ledger; rerun
  with `--all` to pick up stragglers, `--all --force` after any paginator or
  spec change.

## verify-reader.ts results (final clean run)

11 books spanning prose, verse (epic + blank verse), drama, and long front
matter. Viewports: spread 1440×900 + 1280×800, single 390×844. All hard checks
(clipped text, scrollHeight overflow, cross-page word splits, image bounding
boxes, folio monotonicity) and soft checks (canonical-map-live, canonical
start folio vs stored map) pass with **0 issues**.

| Book | Chapters | Pages sampled | Words/page min / median / max |
| --- | --- | --- | --- |
| pride-and-prejudice | 61 | 51 | 48 / 168 / 255 |
| frankenstein | 30 | 70 | 49 / 171 / 257 |
| jane-eyre | 40 | 67 | 82 / 160 / 227 |
| great-expectations | 59 | 71 | 57 / 172 / 251 |
| wuthering-heights | 34 | 69 | 41 / 164 / 247 |
| the-odyssey | 25 | 60 | 53 / 145 / 245 |
| the-iliad | 25 | 70 | 42 / 162 / 246 |
| paradise-lost | 12 | 71 | 44 / 158 / 240 |
| hamlet | 26 | 59 | 44 / 96 / 111 |
| julius-caesar | 24 | 69 | 51 / 100 / 183 |
| moby-dick | 138 | 90 | 43 / 122 / 252 |

Folio behaviour verified: roman front matter from i (frankenstein opens
i…xiv letters, ch 1 starts xv; jane-eyre preface i–v), arabic body restarting
at 1, strictly increasing, chapter-start folios match the stored canonical
map once the live whole-book map lands.

Screenshots (in `reports/reader-verify/`): `front-matter-spread.png`,
`first-body-spread.png`, `verse-spread.png`, `night-theme-spread.png`.

## Honest deviations from the §5.8 targets

1. **Words per page median is ~145–172 for prose/verse (target 280–340).**
   The 392×672 @16/24 text block holds 28 lines; at ~10–12 words per justified
   line that is a physical ceiling of ~280–330 words, and real pages average
   well below it (paragraph breaks, dialogue). Hitting 280–340 median would
   require a materially larger text block or smaller type than the approved
   design. Geometry was frozen per the user's visual sign-off; the numbers are
   reported as measured. Drama (~96–100) is lower still by nature of the form.
2. **Canonical-range folio display at enlarged font sizes ("45–46") is
   deferred.** At non-default sizes folios follow the live re-measured map for
   that size rather than showing the canonical range.
3. **Illustration checks are implemented but vacuous.** Every content image in
   the library uses a relative Standard Ebooks `../images/…` src, which
   `src/lib/reader/sanitize.ts` deliberately strips (no asset host). No book
   currently renders inline illustrations, so no illustration-spread
   screenshot is possible. If image assets are ever hosted, the bounding-box,
   intrinsic-size, and caption-same-page assertions in verify-reader.ts will
   engage automatically.

## Tooling gotcha (recorded for future Playwright scripts)

`tsx` (esbuild `keepNames`) injects `__name(...)` helper calls into any
serialized page function that contains inner named functions. Playwright
serializes the function source into the browser, where `__name` does not
exist → instant `ReferenceError` that looks like a timeout. Pass such
predicates to `waitForFunction` as **strings**, or avoid inner named
functions in page functions.
