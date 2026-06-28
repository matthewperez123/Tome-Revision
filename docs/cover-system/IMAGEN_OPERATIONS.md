# Imagen Operations

Google Imagen is the only real production image provider for Tome covers.

Allowed implementations:

- `GoogleImagenProvider`
- `MockCoverProvider`

Not allowed for production artwork:

- OpenAI image models
- Gemini native image generation models
- Midjourney
- Stable Diffusion
- Flux
- Replicate image models
- Canva image generation
- browser-based generators

## Transports

`GoogleImagenProvider` supports:

- Vertex AI REST predict endpoint for Imagen publisher models.
- Gen AI/Gemini API Imagen image-generation REST transport when configured with an Imagen model and image-generation operation.

The provider validates that configured real model IDs include `imagen`.

## Credential Validation

Run:

```bash
npm run covers:validate-imagen
```

This validates configuration and credentials without generating a paid image. It may acquire an access token or verify API-key presence, but it does not call image generation.

## Fail-Closed Behavior

When Imagen credentials are missing, paid generation is disabled, the provider is unavailable, or the configured model is not an Imagen model:

- paid jobs are not generated
- queues remain intact
- affected jobs should move to `provider_unavailable` or `budget_paused`
- `/admin/covers` shows a visible provider warning
- mock mode remains available for deterministic development

## Model Lifecycle

Model IDs are supplied only by environment variables. Configure:

- `IMAGEN_MODEL_DEPRECATION_DATE`
- `IMAGEN_MODEL_RETIREMENT_DATE`

When a configured retirement date is within 90 days, provider health includes an admin warning. Migrating to a future Imagen model requires changing env vars, running mock and paid spot checks, and recording the model change in audit events. Do not preserve visual identity by switching to a non-Imagen model.

## Security

- Keep Google credentials server-side.
- Never prefix Google credentials with `NEXT_PUBLIC_`.
- Never log API keys, service-account JSON, bearer tokens, or authorization headers.
- Use application default credentials, workload identity, or secure service-account JSON.
- Use signed storage URLs for private assets when exposing candidates to reviewers.

## Production Checklist

- Supabase migration applied.
- Private storage bucket created for raw and derived cover assets.
- Google API enabled for the selected transport.
- IAM role granted to the server identity.
- `npm run covers:validate-imagen` succeeds.
- `COVER_DAILY_BUDGET_USD` and `COVER_ESTIMATED_COST_PER_IMAGE_USD` configured.
- `IMAGEN_ALLOW_PAID_GENERATION=true` and `COVER_ALLOW_PAID_GENERATION=true` set only in the intended environment.
- First paid run is one book, one batch, explicit human approval.
