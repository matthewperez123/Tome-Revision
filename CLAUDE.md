@AGENTS.md

## Stoa Gallery Invariant

The Stoa (painting gallery) enforces a strict 1:1 painting-to-book relationship:

- Every painting in `src/data/stoa-collection.ts` has a required `unlockingBookId`
- No two paintings share the same book; no book has more than one painting
- Run `pnpm audit:stoa` to validate — this runs in CI and will fail the build
- When adding a new book, add its paired painting at the same time
- See `src/components/stoa/README.md` for the four-tier curation hierarchy and sourcing rules
