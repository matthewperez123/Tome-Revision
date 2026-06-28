<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:tome-cover-factory -->
# Tome Cover Factory

- The cover system lives in `src/features/covers`, `scripts/covers`, `docs/cover-system`, `/admin/covers`, and the `cover_*` Supabase migration.
- Use `npm run covers:generate -- --mock` for deterministic mock mode; paid generation is off by default.
- Validate Google credentials without generating an image with `npm run covers:validate-imagen`.
- Run cover tests with `npm run test:covers`; run `npm run lint`, `npm run typecheck`, and `npm run build` before shipping cover-system changes.
- Apply database changes through `supabase/migrations`; never make irreversible production data edits without an explicit rollback plan.
- Production artwork may use Google Imagen only. Do not add non-Imagen production fallbacks.
- Imagen artwork must be textless. Title, author, badges, and labels are rendered separately in Tome code.
- Bump style versions only when the visual identity changes; bump prompt versions when prompt behavior changes generated art.
- Approved assets are immutable. Publish by versioning and superseding, not by overwriting.
- For detailed workflows, use `.agents/skills/tome-cover-factory/SKILL.md`.
<!-- END:tome-cover-factory -->
