# Cover Review Guide

## Reviewer Workflow

1. Open `/admin/covers`.
2. Confirm provider status and lifecycle warnings.
3. Inspect the reference library and Style DNA.
4. Import or select books.
5. Generate deterministic briefs.
6. Rebalance ungenerated briefs and resolve diversity warnings.
7. Approve briefs for generation.
8. Generate candidates in mock or paid Imagen mode.
9. Review raw 3:4, cropped 2:3, derivatives, QA reasons, duplicate warnings, and prompt hash.
10. Approve the strongest candidate per book or reject/regenerate with a targeted note.
11. Render typography separately.
12. Publish an approved composite.
13. Roll back by superseding the publication pointer, never by overwriting assets.

## QA Decisions

- Structural failure: reject until bytes, dimensions, ratio, and derivatives are valid.
- Text or pseudo-text: reject or regenerate.
- Crop failure: regenerate with central-content instructions.
- Palette failure: regenerate with selected palette reinforced.
- Luminous style failure: reject if the cover is dominated by navy, black, espresso, purple, gothic storm light, or heavy cave atmosphere instead of the active ivory/sage/sea-glass/celadon/clay-rose light palette.
- Duplicate warning: compare against current batch and protected references.
- Style failure: inspect individual style dimensions; do not rely on one aggregate score.

## Publication Safety

Approved source, master, derivatives, and composite assets are immutable. Publication creates a versioned row in `cover_publications`. Rollback creates an audit event and points product code at a prior approved publication.
