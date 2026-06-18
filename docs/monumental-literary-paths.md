# Monumental Literary Paths

Monumental Literary Paths is Tome's scalable cover language for public-domain classics. It turns each book into a textless, high-readability symbolic landscape: one large monument, one guiding path or light source, and tiny silhouettes for scale.

## Core Rules

- Use a 2:3 portrait canvas. Tome exports source art at 1024 x 1536 and thumbnails at 512 x 768.
- Keep covers textless. Titles, authors, wordmarks, and bands are added by the app layer.
- Make one scenic symbol dominate: mountain, sea, wall, castle, garden, room, road, river, gate, window, tower, moon, or beacon.
- Include one visual vector that guides the eye: road, path, water reflection, light beam, doorway, river, shoreline, rail line, or staircase.
- Keep human figures tiny and iconic. No faces, no portrait details, no gore.
- Favor flat editorial masses, subtle cubist compression, screenprint grain, and matte paper texture.
- Ensure mobile readability: the cover should still read at roughly 80 px wide.

## Palette System

The original references leaned on ivory paper, ink navy, deep teal, weathered blue, ochre, and small coral accents. This system keeps that scholarly base but expands it into reusable families:

- Ochre plain: wind, field, comedy, satire.
- Ink sea: epics, voyages, storms, islands.
- Alpine blue: ice, mountains, revelation.
- Cypress estate: social novels, courtship, gardens.
- Moon castle: tragedy, surveillance, power.
- Storm moor: Gothic houses and exposed landscapes.
- Oxblood city: revolution, social pressure, historical violence.
- Frost Russia: snow, rail, conscience, vastness.
- Ember night: infernal, cosmic, apocalyptic, or haunted scenes.
- Moss garden: provincial, organic, restorative works.
- Mineral teal: science, machinery, perception, modernity.
- Plum dusk: romance, chivalry, allegory, artifice.
- Rose fog: social danger, memory, station, ambiguity.
- Slate gold: philosophy, strategy, civic order.
- Lamp black: moral darkness with a single light source.
- Saffron jade: spiritual, travel, fable, comic worldliness.

## Generation Contract

The generator lives at:

```bash
node scripts/generate-monumental-path-covers.mjs
```

It writes textless source PNGs to `public/covers/tome/source`. Existing source PNGs are skipped unless `--overwrite` is passed, so hand-picked or AI-generated covers can be protected while new books are added in bulk.

After generating source art, normalize app-ready JPGs and thumbnails with:

```bash
node scripts/prepare-tome-generated-covers.mjs --review-count 96
```

The app's `ClassicsCover` component prefers these generated assets automatically through `src/data/generated/tome-generated-cover-paths.ts`.

## Scaling To 1000 Books

For a new book, choose:

1. A motif that compresses the book into a single monumental place.
2. A palette family that matches era, genre, and emotional temperature.
3. One guide vector, usually a path, river, gate, window, or light.
4. One to three tiny figures or vessels only when they clarify scale.
5. A restrained accent, normally coral, gold, green-gold, or flame.

When in doubt, make the monument simpler and the path clearer.
