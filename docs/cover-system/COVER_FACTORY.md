# Tome Cover Factory

This system lives under `src/features/covers`, with operational commands in `scripts/covers`, durable state in the `cover_*` Supabase tables, and the editor surface at `/admin/covers`.

The active production style is `tome-luminous-minimal-modernism-v1`, derived from the lighter June 18 4:12 Plato/Republic-left suite and 4:13 first-example suite. See `docs/cover-system/LUMINOUS_MINIMAL_MODERNISM.md`.

## First Mock Batch

```bash
npm run covers:analyze-references
npm run covers:brief -- --books the-odyssey,pride-and-prejudice,frankenstein,the-republic,walden,the-secret-garden,treasure-island,a-dolls-house,the-picture-of-dorian-gray,leaves-of-grass,middlemarch,the-tempest --out tmp/cover-factory/briefs/luminous-batch-001
npm run covers:rebalance -- --books the-odyssey,pride-and-prejudice,frankenstein,the-republic,walden,the-secret-garden,treasure-island,a-dolls-house,the-picture-of-dorian-gray,leaves-of-grass,middlemarch,the-tempest --json
npm run covers:generate -- --mock --books the-odyssey,pride-and-prejudice,frankenstein,the-republic,walden,the-secret-garden,treasure-island,a-dolls-house,the-picture-of-dorian-gray,leaves-of-grass,middlemarch,the-tempest --out tmp/cover-factory/mock/luminous-batch-001
npm run covers:contact-sheet -- --in tmp/cover-factory/mock/luminous-batch-001 --out tmp/cover-factory/contact-sheets/luminous-batch-001.jpg
npm run covers:qa -- --file tmp/cover-factory/mock/the-odyssey-<candidate>.png
npm run covers:compose -- --books the-odyssey --out tmp/cover-factory/composites/luminous-batch-001
```

Mock mode is deterministic and never makes paid provider calls.

## First Paid Imagen Batch

1. Apply `supabase/migrations/20260621000000_cover_factory_v2.sql`.
2. Enable the Vertex AI API or Gemini/Gen AI API for the selected transport.
3. Grant the server identity permission to call Imagen, for example Vertex AI User on the Google Cloud project for Vertex transport.
4. Configure `GOOGLE_CLOUD_PROJECT`, `GOOGLE_CLOUD_LOCATION`, and service-account/application-default credentials for Vertex, or `GOOGLE_API_KEY` for Gen AI transport.
5. Set all `IMAGEN_*_MODEL` variables explicitly.
6. Run `npm run covers:validate-imagen`.
7. Set `IMAGEN_ALLOW_PAID_GENERATION=true` and `COVER_ALLOW_PAID_GENERATION=true`.
8. Run a one-book production batch first, review QA, approve, compose typography, then publish.

## Environment Variables

- `IMAGEN_TRANSPORT=vertex|genai`
- `IMAGEN_DRAFT_MODEL=imagen-4.0-fast-generate-001`
- `IMAGEN_PRODUCTION_MODEL=imagen-4.0-generate-001`
- `IMAGEN_FEATURED_MODEL=imagen-4.0-ultra-generate-001`
- `IMAGEN_ASPECT_RATIO=3:4`
- `IMAGEN_PRODUCTION_IMAGE_SIZE=2K`
- `IMAGEN_CANDIDATES_PER_BOOK=2`
- `IMAGEN_PERSON_GENERATION=allow_adult`
- `IMAGEN_ALLOW_PAID_GENERATION=false`
- `IMAGEN_MODEL_DEPRECATION_DATE`
- `IMAGEN_MODEL_RETIREMENT_DATE`
- `GOOGLE_CLOUD_PROJECT`
- `GOOGLE_CLOUD_LOCATION`
- `GOOGLE_APPLICATION_CREDENTIALS`
- `GOOGLE_SERVICE_ACCOUNT_JSON`
- `GOOGLE_API_KEY`
- `COVER_GENERATION_CONCURRENCY`
- `COVER_REQUESTS_PER_MINUTE`
- `COVER_MAX_RETRIES`
- `COVER_DAILY_BUDGET_USD`
- `COVER_ESTIMATED_COST_PER_IMAGE_USD`
- `COVER_REQUIRE_LARGE_BATCH_CONFIRMATION`
- `COVER_LARGE_BATCH_THRESHOLD`
- `COVER_ALLOW_PAID_GENERATION`

## Import Examples

CSV:

```csv
bookId,title,author
the-odyssey,The Odyssey,Homer
the-republic,The Republic,Plato
```

JSON:

```json
[
  { "bookId": "the-odyssey" },
  { "bookId": "the-republic" }
]
```

## CoverBrief Example

```json
{
  "schemaVersion": "cover-brief.v2.0.0",
  "styleVersion": "tome-luminous-minimal-modernism-v1",
  "promptVersion": "imagen-prompt.v2.1.0",
  "source": {
    "bookId": "the-odyssey",
    "title": "The Odyssey",
    "author": "Homer"
  },
  "semantic": {
    "principalVisualMetaphor": "a pale shore or vessel route moving across open water",
    "heroMotif": "one small vessel, sail, shore, wake, or harbor route in daylight",
    "narrativeVector": "wake"
  },
  "artDirection": {
    "compositionFamily": "shore-and-vessel",
    "paletteMode": "sea-glass-day",
    "textureProfile": "soft-lithograph"
  }
}
```

## Prompt Construction

Prompts are assembled by `buildImagenPrompt` in `src/features/covers/prompts/imagen-prompt.ts`. The prompt builder:

- outputs English text
- keeps prompts under 440 estimated tokens
- deduplicates repeated clauses
- stores substituted fields and a SHA-256 prompt hash
- includes prohibitions in the prompt body instead of relying on unsupported negative-prompt fields
- never sends book text beyond metadata, synopsis, themes, and editorial interpretation

## 3:4 Source to 2:3 Master

Imagen is requested at 3:4. Raw provider output is preserved. Tome crops to 2:3 by removing equal left/right width, preserving full height, and allowing only a small saliency adjustment. The default master is `1024 x 1536` PNG with WebP derivatives at `768`, `512`, `256`, and `96` thumbnail sizes.

## Adding Palettes or Composition Families

Add palettes in `src/features/covers/styles/palettes.ts`; add composition families in `src/features/covers/compositions/library.ts`. Bump the style version only when the collection identity changes. Bump the prompt version when prompt behavior changes in a way that affects generated art.

## Troubleshooting

- Provider unavailable: keep jobs queued or paused; do not switch to another image provider.
- Prompt too long: shorten semantic interpretation and motifs before a paid request.
- Failed crop safety: regenerate with a targeted note to keep essential objects inside the central 86%.
- Text detected: reject or regenerate; generated artwork must remain textless.
- Budget paused: raise `COVER_DAILY_BUDGET_USD` or resume next day.
