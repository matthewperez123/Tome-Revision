# Tome Luminous Minimal Modernism Cover Factory - Implementation Plan

## Architecture Discovered

- Tome is a Next.js 16 App Router application under `src/app` with React 19 and Tailwind/shadcn-style UI primitives.
- Book catalog data currently lives in `src/data/books.ts`; live covers flow through `ClassicsCover` and `getTomeGeneratedCoverPaths`.
- Supabase is the existing database/auth/storage platform, with migrations in `supabase/migrations` and server-only admin access in `src/lib/supabase/admin.ts`.
- There is no existing durable image-generation queue, so the cover factory adds normalized Supabase tables and a PostgreSQL-style leasing/idempotency queue contract.
- Existing cover review work lives under `/dev/covers`; the new operational surface is added at `/admin/covers`.
- Next.js 16 docs were checked for environment variables, Route Handlers, Server/Client boundaries, data security, and async request APIs before implementation.

## Implementation Steps

1. Preserve the seven supplied source images under `docs/cover-system/references/originals`.
2. Split the two 4x2 reference sheets into sixteen crops using pale-gutter detection with a documented coordinate fallback.
3. Generate `reference-manifest.json`, cryptographic hashes, perceptual hashes, representative palettes, crop metadata, and a labeled contact sheet.
4. Add versioned palette, texture, composition, prompt, CoverBrief, QA, typography, queue, provider, and publication modules under `src/features/covers`.
5. Add `GoogleImagenProvider` and `MockCoverProvider` only; Google Imagen is the sole real provider and the system fails closed when unavailable.
6. Add scripts for reference analysis, Imagen validation, import, brief generation, rebalance, generation, status, QA, contact sheets, composition, and publication.
7. Add a Supabase migration for durable cover style, reference, batch, brief, job, candidate, asset, QA, review, publication, and audit tables.
8. Add tests for reference detection, manifest generation, schemas, prompt limits, provider fail-closed behavior, mock generation, crop/derivatives, queue, budget, QA, typography, and publication rollback.
9. Add `/admin/covers` and `/api/covers/health` for operational review and provider status.
10. Update repository-level durable instructions and add `.agents/skills/tome-cover-factory/SKILL.md`.

## Constraints

- Production art must be generated only by Google Imagen through an official Google API transport.
- When credentials are missing or paid generation is disabled, the system operates in deterministic mock mode.
- No generated artwork may contain typography; title/author composition is rendered separately by Tome code.
- No source reference asset is overwritten or published as new generated art.
- Approved assets are immutable; publication creates new versions and rollback points to prior approved versions.
