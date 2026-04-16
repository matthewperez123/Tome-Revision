# Stoa — The Painting Gallery

The Stoa is the reward gallery where readers unlock public-domain paintings by completing books. Every painting maps to exactly one book (strict 1:1).

## The 1:1 Invariant

- Every painting in `src/data/stoa-collection.ts` has a required `unlockingBookId`
- No two paintings may share the same `unlockingBookId`
- Every book in the active catalog should have exactly one painting
- The audit script (`pnpm audit:stoa`) validates this invariant

**Breaking this invariant will fail CI.**

## Four-Tier Curation Hierarchy

When assigning a painting to a book, use the highest tier possible:

| Tier | Name | Description | Example |
|------|------|-------------|---------|
| 1 | Exact Scene | Painting literally depicts a scene from the book | Waterhouse "Ulysses and the Sirens" → The Odyssey |
| 2 | Same Source | Same myth/characters, different moment | Moreau "Oedipus and the Sphinx" → Oedipus at Colonus |
| 3 | Thematic Match | Same era or emotional register as the book | Goya "Third of May" → Germinal |
| 4 | Atmospheric | Last resort — mood/palette resonance only | Friedrich "Abbey in the Oakwood" → Wuthering Heights |

Tier 4 matches should be flagged for future upgrade with a note in `curationNote`.

## Adding a New Book + Painting Pair

A book and its painting must be added together. Never ship one without the other.

1. Add the book entry to `src/data/books.ts`
2. Add the painting image to `public/paintings/` (min 2000px long edge)
3. Add the painting to `public/paintings/manifest.json`
4. Add the Stoa entry to `src/data/stoa-collection.ts` with all required fields
5. Run `pnpm audit:stoa` to validate
6. Commit both the book and painting together

### Required fields for a Stoa entry:

```typescript
{
  id: string                    // matches painting filename and manifest ID
  unlockingBookId: string       // FK to books.ts — REQUIRED, NON-NULLABLE
  title: string                 // painting title
  painter: string               // artist name
  year: number | string         // e.g., 1851 or "c.1820"
  sourceInstitution: string     // e.g., "The Met", "Rijksmuseum"
  sourceUrl: string             // direct link to institution's page
  imageUrl: string              // /paintings/{id}.jpg
  publicDomainStatus: string    // "CC0" | "PD-Old" | "PD-Art"
  curationTier: 1 | 2 | 3 | 4  // see hierarchy above
  curationNote: string          // reader-facing, 1-2 sentences
}
```

## Approved Public-Domain Sources

Only use images from these verified open-access collections:

- **The Metropolitan Museum of Art** — CC0 Open Access
- **Art Institute of Chicago** — CC0 Open Access
- **Rijksmuseum** — CC0 Open Access
- **National Gallery of Art (Washington)** — Open Access
- **National Gallery (London)** — some CC0
- **Wikimedia Commons** — verify PD status individually
- **Galleria degli Uffizi** — verify individually
- **Musée du Louvre** — verify individually
- **Museo del Prado** — verify individually
- **Tretyakov Gallery** — PD-Art for pre-1900 works

## Sourcing Rules

- Public domain only — verify PD status from a primary source
- Minimum 2000px on the long edge
- Prefer paintings over engravings/sketches (unless famously associated)
- Avoid graphic violence or sexual content as reward screens
- No AI-generated or AI-upscaled images

## File Structure

```
src/
  components/stoa/
    PaintingCard.tsx        — Grid card (locked/unlocked states)
    PaintingDetail.tsx      — Lightbox/modal detail view
    PaintingMetadata.tsx    — Shared metadata block
    README.md              — This file
  data/
    stoa-collection.ts     — Authoritative painting-to-book mapping
  lib/
    stoa.ts                — Lookup helpers, unlock detection
    paintings.ts           — Painting manifest + image helpers
scripts/
  audit-stoa-collection.ts — Validation script (pnpm audit:stoa)
public/
  paintings/
    manifest.json          — All painting metadata
    *.jpg                  — Painting images
```
