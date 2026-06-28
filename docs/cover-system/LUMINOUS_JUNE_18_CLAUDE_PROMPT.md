# Luminous June 18 Claude Code Prompt

Use this prompt in Claude Code or Codex when evolving Tome's cover system from the lighter June 18 cover suites into a repeatable Imagen-first production style for the full Tome corpus. This version doubles down on the first luminous example suite and adds the directly-left Plato/Republic suite as the secondary reference. The rightward 4:15 suite is not part of the active reference set.

## Reference Analysis

Primary reference images:

- `docs/cover-system/references/luminous-june-18/luminous-minimal-suite-a-2026-06-18-161222.png`
- `docs/cover-system/references/luminous-june-18/luminous-minimal-suite-b-2026-06-18-161341.png`

These are the lighter June 18 suites near 4:12 and 4:13 PM. Treat them as the visual north star, not the darker gothic/navy suites and not the rightward 4:15 suite.

### Shared Visual DNA

- The covers are textless editorial illustrations with a strong 3:4 poster rhythm that can crop safely into Tome's 2:3 app cover format.
- Each cover has one central idea: a road, river, garden axis, shore, window, cave, ship, field, tree, house, column, or animal-like silhouette. The best ones read in under one second at thumbnail size.
- Negative space is generous. Large quiet fields of warm paper, sky, sea, meadow, or wall occupy a meaningful portion of each cover.
- The image usually contains 3 to 7 big shapes: ground plane, sky or field, one destination or emblem, one narrative path, and zero to two tiny scale marks.
- The human presence is very small and anonymous. Faces, clothing detail, and literal character design are avoided.
- The path is the key unifying device. It may appear as a road, wake, stream, shoreline, beam of light, furrow, garden walk, staircase, cave opening, or compositional pull.
- Texture is matte and quiet: soft grain, paper fiber, restrained lithograph stipple, and gentle overprint. It should never feel glossy, digital, photorealistic, or fantasy-poster dramatic.
- The emotional temperature is luminous, calm, inviting, and literary. Drama is allowed, but the palette should stay open, sunlit, and breathable.

### Palette DNA

Use a greatly expanded light palette derived from the June 18 lighter suites:

- Warm ivory paper: aged vellum, cream, pearl, oat, linen, pale parchment.
- Greens: sage, moss, eucalyptus, lichen, fern shadow, celadon, grey olive.
- Blues: pale sky, washed cornflower, sea glass, light teal, harbor blue, clear dusk blue.
- Yellows and golds: wheat, saffron, dry grass, marigold, muted ochre, sun-washed straw.
- Reds and earths: terracotta, clay rose, faded coral, warm brick, soft umber.
- Neutrals: warm stone, mist grey, shell, chalk, graphite used sparingly.
- Deep ink is an accent, not the atmosphere. Avoid covers dominated by black, midnight navy, brown/orange espresso, or gothic purple.

### Suite A Notes: Plato/Republic Left Reference

The 4:12 suite is the directly-left reference the user identified: the lighter set containing the Plato/Republic-style classical-column cover. It is useful for social novels, philosophy, gardens, domestic fiction, rivers, classical inquiry, civic architecture, and calm symbolic approaches.

- Strong devices: garden approach, cliffside path, green wall with open door, key, river, meditating figure under a tree, classical columns, cave aperture, estate road, sun disk, soft clouds.
- It has enough human scale and garden/civic detail to support many genres while staying warm, light, literary, and usable for a thousand-book system.
- The Plato/Republic cover lesson is especially important: philosophical books can use daylight, columns, civic geometry, and an open path instead of darkness, caves, or gothic abstraction.
- Good for works like `Pride and Prejudice`, `Emma`, `Persuasion`, `The Secret Garden`, `The Wind in the Willows`, `Siddhartha`, `Meditations`, `The Republic`, and `Candide`.
- Keep figures anonymous and small. The point is not portraiture; it is a reader-sized mark moving through a symbolic literary space.

### Suite B Notes: First Example Anchor

The 4:13 suite is slightly more illustrative and adventurous. It is useful for sea, voyage, epic, pilgrimage, travel, satire, island, and quest books.

- Strong devices: harbor, ship, shore, distant castle, causeway, plain, palm silhouette, river/sea route, sun disk, large clean horizon.
- The image can include architectural or maritime detail, but the detail must be simplified into a few readable silhouettes.
- Good for works like `The Odyssey`, `The Aeneid`, `The Tempest`, `Don Quixote`, `Gulliver's Travels`, `Treasure Island`, and `Robinson Crusoe`.
- Avoid repeating giant moon plus tiny boat too often. Vary the narrative vector: wake, shoreline, road, sail, river mouth, beacon, compass, cloud gap.

### Excluded Rightward Reference

Do not use the rightward 4:15 suite as an active source for this prompt. It is attractive, but the requested direction is the first 4:13 example plus the leftward 4:12 Plato suite.

### What To Preserve

- Textless artwork only. Tome renders title, author, badges, labels, and series marks separately.
- Central-subject discipline. Keep all essential content inside the central 86 percent of the 3:4 width because Tome crops to 2:3.
- Repeatable composition families. Every book should receive a stable family, variant, palette, and prompt hash.
- Monumental clarity, but not darkness. The style may stay iconic and literary without becoming gothic.
- Original artwork. References guide style only; do not reproduce a reference composition.

### What To Reject

- Generated words, letters, numbers, signatures, inscriptions, runes, logos, watermarks, or faux typography.
- Dense plot collage, literal character portraits, detailed faces, movie-poster drama, generic fantasy concept art, anime, comics, glossy 3D, photorealism, or ornate frames.
- Overly dark palettes, excessive navy fields, black castles, stormy gothic atmospheres, horror lighting, and baroque detail.
- A thousand covers that all use the same moon, winding road, tiny traveler, or distant house.

## Copy-Paste Claude Code Prompt

```text
You are working in /Users/matthewperez/Tome Revision/Tome-Revision.

Goal:
Evolve Tome's existing Cover Factory into a repeatable Google Imagen cover system for the full Tome corpus of 1000+ books, using the lighter June 18 4:12 Plato suite and the 4:13 first-example suite as the visual model. The final system must place approved covers inside the Tome app, generate in safe batches, and avoid local overheating, runaway paid generation, and non-Imagen production art.

Read first:
1. AGENTS.md
2. docs/cover-system/STYLE_DNA.md
3. docs/cover-system/COVER_FACTORY.md
4. docs/cover-system/IMAGEN_OPERATIONS.md
5. docs/cover-system/REVIEW_GUIDE.md
6. src/features/covers/prompts/imagen-prompt.ts
7. src/features/covers/styles/palettes.ts
8. src/features/covers/compositions/library.ts
9. src/features/covers/briefs/semantic-brief.ts
10. scripts/covers/cover-factory.ts
11. If touching Next.js app routes/components, read the relevant local Next docs in node_modules/next/dist/docs/ before writing code.

Reference images to analyze:
- docs/cover-system/references/luminous-june-18/luminous-minimal-suite-a-2026-06-18-161222.png
- docs/cover-system/references/luminous-june-18/luminous-minimal-suite-b-2026-06-18-161341.png

Explicitly excluded from this run:
- Any rightward 4:15 suite or later minimalist variant not listed above.

Optional Standard Ebooks middle-content reference, if present:
- public/art-factory/generated/standard-ebooks-conversion-test/standard-ebooks-middle-reference-sheet.png

Hard constraints:
- Production artwork may use Google Imagen only.
- Do not add OpenAI image generation, Midjourney, Stable Diffusion, Flux, Replicate, Canva generation, or browser generator fallbacks for production artwork.
- Do not create procedural or Python-generated production cover art.
- Mock mode is allowed for deterministic development.
- The generated artwork must be textless. Tome code renders all title, author, badge, label, and UI text separately.
- Approved assets are immutable. Publish by versioning/superseding, not overwriting.
- Do not launch a 1000-book paid run. Use small batches, review gates, and budget/rate/concurrency controls.
- Do not send full book text to Imagen. Use metadata, synopsis, themes, genre, era, geography, and editorial interpretation only.

Visual target:
Create a "Tome Luminous Literary Paths" style mode that extrapolates from the first 4:13 example suite and the leftward 4:12 Plato suite.

The style should be:
- Light, warm, readable, calm, and literary.
- Built from 4 to 9 large readable shapes per cover, with Suite A allowed a little more garden/civic detail than Suite B.
- Centered on one visual metaphor per book.
- Guided by one narrative vector: path, river, wake, shore, beam, window, staircase, garden walk, furrow, shadow, or threshold.
- Richer in color than the earlier navy/parchment system, but still restrained and matte.
- Less dark, less gothic, less detailed, and less castle-heavy than the first two dark suites.
- Legible at 96 x 144 px.
- Especially preserve the Plato/Republic lesson: philosophical and civic books can be light, classical, open, and architectural without becoming dark cave allegories.

Palette direction:
Add light-first palettes, then rebalance the brief generator to prefer them for this style.

Include palette families like:
- luminous-ivory-sage: warm ivory, sage, moss, eucalyptus, pale gold, restrained deep ink.
- sea-glass-day: shell ivory, sea-glass teal, pale harbor blue, sunlit wheat, soft graphite.
- wheat-and-celadon: linen, celadon, dry grass, olive shadow, muted ochre.
- clay-rose-garden: pearl paper, clay rose, terracotta, lichen green, chalk, small dark accent.
- clear-sky-parchment: parchment, washed sky blue, stone grey, saffron, deep blue only as linework.
- orchard-mist: cream, mist grey, apple leaf, muted fern, pale coral.
- civic-stone-light: chalk, warm stone, eucalyptus, faded gold, soft blue grey.
- snowfield-ember-light: ivory snow, pale blue shadow, soft graphite, one small ember accent.

Deep inks should support silhouettes and linework, not dominate the field. Avoid adding new palettes that read as gothic, espresso, or purple-blue gradient systems.

Composition direction:
Add or adjust composition families so the corpus can vary without losing identity.

Useful new or revised families:
- luminous-path: one road, walk, stream, wake, furrow, or beam crossing a quiet field toward a small destination.
- quiet-emblem-field: one oversized symbolic object in a calm field, with no busy background.
- open-threshold: one door, window, cave mouth, stage opening, curtain gap, garden gate, or lit room edge.
- shore-and-vessel: one small vessel or shoreline vector in daylight, with broad sea/sky negative space.
- garden-approach-light: estate, orchard, maze, hedge, or garden route in soft daylight, not gothic.
- solitary-dwelling-day: one house, cabin, room, tent, or civic building set in a bright simplified field.
- botanical-monument: one plant, branch, leaf, field, animal trace, or natural specimen treated as monumental.
- civic-axis: plaza, road, courthouse, market, factory, school, prison wall, or city edge reduced to clean blocks and a single route.
- interior-light-vector: lamp, window, table, bed, mirror, letterless page shape, or shadow path for domestic and psychological books.
- elemental-force-light: wind, snow, wave, fire, rain, migration, or mountain rendered with daylight restraint.

For each family, define:
- suitable genres/themes
- unsuitable genres/themes
- hero object rules
- horizon behavior
- negative space region
- foreground/middleground/background behavior
- allowed narrative vectors
- figure count range, usually 0 to 1 or 0 to 2
- title-safe recommendation
- allowed light palettes
- thumbnail silhouette test
- forbidden repetitions

Prompt builder changes:
Update src/features/covers/prompts/imagen-prompt.ts so the stable style language can produce the Luminous Minimal direction. Keep prompts in English and under the existing token limit.

The prompt must include ideas like:
- TEXTLESS 3:4 portrait editorial illustration for Tome.
- Original vintage lithograph / restrained screen print / matte paper fiber / soft grain.
- Light-first, warm, sunlit, breathable, with large quiet negative space.
- One dominant symbolic scene and no more than three important objects.
- Tiny anonymous adult silhouettes only if needed for scale.
- Essential objects inside the central 86 percent width for the 3:4 to 2:3 crop.
- Exclude words, lettering, numbers, signage, inscriptions, logos, watermarks, borders, book mockups, detailed faces, photorealism, glossy 3D, anime, comic style, neon, crowded collage, generic fantasy-poster art, and literal plot reconstruction.

Brief generator changes:
Update src/features/covers/briefs/semantic-brief.ts so Luminous Minimal is the preferred style mode for corpus-wide generation.

For each book, generate or preserve a CoverBrief with:
- principalVisualMetaphor
- heroMotif
- narrativeVector
- secondaryMotifs, capped and nonliteral
- compositionFamily
- compositionVariant
- paletteMode
- textureProfile
- lightMode
- horizonPosition
- negativeSpaceRegion
- figureCount
- cropSafetyInstructions
- titlePlacementRecommendation
- authorPlacementRecommendation
- prompt hash and substituted fields

Book-specific interpretation:
- Use the Tome book catalog as the source of truth for book IDs and metadata. Do not hardcode a final 1000-book list unless the repo already stores that list in a generated data file.
- If Standard Ebooks source covers exist, use their middle visual content only as a subject clue. Do not copy their typography, ornamental border, layout, or exact composition.
- Convert the middle content into the June 18 Luminous Minimal grammar: one symbol, one path/vector, one quiet field, one palette.
- Never send full public-domain book text to the image provider; summarize from metadata/synopsis/themes.

Batch strategy:
Implement and test in stages. Do not overheat the machine or trigger runaway spending.

Stage 0 - analysis and style update:
- Write a short analysis note to docs/cover-system explaining the lighter June 18 style and why it differs from the darker suites.
- Add or update palettes, composition families, and prompt language.
- Run focused cover tests.

Stage 1 - deterministic mock pilot:
- Select 8 to 12 diverse books only.
- Include voyage, domestic novel, philosophy, nature writing, drama, gothic-but-lightened, satire, and poetry if available.
- Generate briefs and mock candidates only.
- Create a contact sheet.
- Review for style fit, duplicate motifs, crop safety, and textlessness.

Example command shape:
npm run covers:analyze-references
npm run test:covers
npm run covers:brief -- --books <comma-separated-book-ids> --out tmp/cover-factory/briefs/luminous-batch-001
npm run covers:rebalance -- --books <comma-separated-book-ids> --json
npm run covers:generate -- --books <comma-separated-book-ids> --out tmp/cover-factory/mock/luminous-batch-001
npm run covers:contact-sheet -- --in tmp/cover-factory/mock/luminous-batch-001 --out tmp/cover-factory/contact-sheets/luminous-batch-001.jpg
npm run covers:compose -- --books <comma-separated-book-ids> --out tmp/cover-factory/composites/luminous-batch-001

Note: package.json currently makes covers:generate mock by default. Do not use paid generation unless the repo exposes a fail-closed paid Imagen path and the user explicitly approves it.

Stage 2 - larger mock batches:
- Expand to batches of 16 books.
- Cap local concurrent image processing to a modest level if the CLI supports it.
- Create one contact sheet per batch.
- Stop and fix style drift if more than 15 percent of a batch is too dark, too detailed, too repetitive, or fails crop/text QA.
- Keep a batch manifest that records book IDs, style version, prompt version, candidate paths, prompt hashes, and review status.

Stage 3 - first paid Imagen proof:
- Validate credentials without generating artwork:
  npm run covers:validate-imagen
- Confirm environment settings:
  IMAGEN_TRANSPORT=vertex or genai
  IMAGEN_DRAFT_MODEL=<imagen model id>
  IMAGEN_PRODUCTION_MODEL=<imagen model id>
  IMAGEN_FEATURED_MODEL=<imagen model id>
  IMAGEN_ASPECT_RATIO=3:4
  IMAGEN_CANDIDATES_PER_BOOK=2
  IMAGEN_ALLOW_PAID_GENERATION=true only after approval
  COVER_ALLOW_PAID_GENERATION=true only after approval
  COVER_GENERATION_CONCURRENCY=1 for first proof
  COVER_REQUESTS_PER_MINUTE low for first proof
  COVER_DAILY_BUDGET_USD set conservatively
  COVER_REQUIRE_LARGE_BATCH_CONFIRMATION=true
  COVER_LARGE_BATCH_THRESHOLD=16
- Run exactly one book first, two candidates max, with explicit user approval.
- Review raw 3:4, Tome 2:3 crop, derivatives, QA, prompt hash, and duplicate warnings.
- Do not proceed to the next paid batch until the user approves the proof.

Stage 4 - paid rollout:
- Use paid batches of 8 books at first.
- Move to 16 only after multiple batches pass review.
- Never exceed 24 paid books in one run without explicit user approval.
- Keep COVER_GENERATION_CONCURRENCY at 1 or 2 unless provider rate limits and local derivative generation are proven stable.
- Pause between batches and review the contact sheet before continuing.
- If provider fails, budget pauses, credentials fail, or model IDs are not Imagen models, fail closed and leave jobs queued or paused. Do not switch providers.

App placement:
- Prefer the Cover Factory publication path: raw provider output, cropped master, derivatives, approved candidate, composite typography, and versioned publication row.
- Approved cover art remains textless. The Tome app renders typography separately through existing cover/typography code.
- If a temporary static Tome pipeline is needed for review, copy only approved textless PNGs to public/covers/tome/source/<book-id>.png, then run npm run covers:tome. This should be treated as an interim bridge, not the long-term source of truth if cover_publications is active.
- Ensure ClassicsCover or the relevant Tome cover component can resolve approved generated assets by book ID without breaking existing fallback behavior.

QA gates:
Reject or regenerate any candidate with:
- visible text or pseudo-text
- cropped-off hero object
- low thumbnail readability
- overly dark or gothic atmosphere
- crowded collage
- direct imitation of a reference cover
- repeated moon/road/tiny-traveler formula across too many adjacent books
- palette outside the light June 18 system
- faces, costumes, or literal plot scenes becoming the focus

Required deliverables:
1. Updated documentation describing "Tome Luminous Minimal Modernism" and the June 18 reference analysis.
2. New or updated palettes in src/features/covers/styles/palettes.ts.
3. New or updated composition families in src/features/covers/compositions/library.ts.
4. Updated Imagen prompt builder language in src/features/covers/prompts/imagen-prompt.ts.
5. Updated deterministic brief selection logic in src/features/covers/briefs/semantic-brief.ts.
6. Focused tests for palettes, composition selection, prompt token limits, textless constraints, and mock generation.
7. A first mock pilot contact sheet.
8. A clear batch plan for the full corpus.
9. No paid Imagen generation until the user explicitly approves a one-book proof.

Verification before final response:
- npm run test:covers
- npm run covers:analyze-references
- npm run covers:brief -- --books <pilot-book-ids> --out tmp/cover-factory/briefs/luminous-batch-001
- npm run covers:rebalance -- --books <pilot-book-ids> --json
- npm run covers:generate -- --books <pilot-book-ids> --out tmp/cover-factory/mock/luminous-batch-001
- npm run covers:contact-sheet -- --in tmp/cover-factory/mock/luminous-batch-001 --out tmp/cover-factory/contact-sheets/luminous-batch-001.jpg
- If app code changed, run lint/typecheck/build as practical and report any pre-existing failures honestly.

Final response should include:
- Files changed.
- The pilot book IDs used.
- Where the mock contact sheet was written.
- What was verified.
- Any blockers before paid Imagen, especially credentials, budget caps, and explicit approval.
```

## Suggested Pilot Sets

Use these only if the IDs exist in the local Tome catalog. Replace missing IDs with nearby equivalents from `src/data/books.ts` or generated catalog files.

### Pilot A: Balanced Luminous Corpus

- `the-odyssey`
- `pride-and-prejudice`
- `frankenstein`
- `the-republic`
- `walden`
- `the-secret-garden`
- `treasure-island`
- `a-dolls-house`
- `the-picture-of-dorian-gray`
- `leaves-of-grass`
- `middlemarch`
- `the-tempest`

### Pilot B: Standard Ebooks Middle-Content Conversion

- `a-room-with-a-view`
- `the-secret-garden`
- `treasure-island`
- `the-time-machine`
- `meditations`
- `candide`
- `great-expectations`
- `the-wind-in-the-willows`

For Pilot B, use only the central subject clues from Standard Ebooks cover art where available. The generated art must still become original Tome Luminous Minimal artwork.

## Full-Corpus Rollout Shape

1. Analyze references and update style code.
2. Run Pilot A in mock mode.
3. Review contact sheet and adjust prompt/palette/composition logic.
4. Run Pilot B in mock mode to test Standard Ebooks content conversion.
5. Generate 3 to 5 additional mock batches of 16 books across genres.
6. Validate Imagen credentials with `npm run covers:validate-imagen`.
7. Request explicit approval for one paid Imagen book.
8. Run one paid proof, review, compose typography, and publish/dry-run.
9. Continue paid batches of 8, then 16 after quality stabilizes.
10. Stop on style drift, duplicate motifs, provider warnings, budget pauses, or app integration failures.
