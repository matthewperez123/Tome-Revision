# Tome Color-Flood Cover Template

> Status: archived alternate direction. The current Tome app cover direction is
> the quieter Meridian white-marble underlay aesthetic in
> `docs/art-factory/meridian-signal-cover-template.md`.

## Source Read

Use `/Users/matthewperez/Downloads/Cover Tests For Codex` as the visual archive,
but prioritize the app-friendly front-cover direction inside it:

- the best Shakespeare covers, especially the large crowned/profile tragedy
  compositions
- Ben-Hur and other action covers where horses, figures, ships, or scenery push
  beyond the old rounded paper window
- Dumas and Sienkiewicz adventure/historical covers with clear movement,
  weapons, capes, roads, forts, sea, or battle atmosphere
- the January 18 and January 19 batches for soft figures, warm color, and
  readable literary tone
- Hemingway and Fitzgerald for modern social color fields and clear silhouettes
- religious texts, great poetry, and classic children's books for reverent,
  lyrical, or bright pastoral variants inside the same house style

Do not use the previous minimalist/white-underlay direction as the target. This
template is for Tome app covers, not paperback reproductions.

## Core Idea

A Tome cover should feel like the strongest illustration from the reference
folder has expanded to become the whole mobile cover. Keep the same soft
modern-classics color, grain, and literary polish, but remove the paperback
mechanics and let the image flood the available 2:3 rectangle.

The result should be immediately recognizable at small app sizes: one clear
figure or figure-pair, one setting, one object/action cue, and one color/light
cue. It should not depend on title text.

## Medium

- polished modern-classics illustration
- watercolor/gouache texture over subtle paper grain
- translucent layered color fields
- soft silhouettes with a few readable details
- matte editorial finish, not photorealism
- simplified enough for mobile thumbnails, but not abstract icon art

## Layout

- Canvas: vertical 2:3 Tome app cover.
- Full-bleed or near full-bleed image; no paperback title block, author block,
  annotation label, publisher band, or back-cover paragraph area.
- No white arcs. If the old reference has an arched/rounded window, translate it
  into a color-shaped compositional memory, not a literal white cutout.
- Let figures, horses, ships, flowers, gates, flames, seas, cities, or trees
  cross where the old paper frame would have been.
- Use one large foreground read, one middle-ground setting, and one background
  atmosphere. Avoid tiny secondary decorations.
- Keep the subject legible at 44 px, 80 px, and 160 px.

## Color

Stay close to the folder:

- muted teal and blue-green
- smoke blue and soft charcoal
- dusty coral and terracotta
- ochre, pale gold, and warm sun
- sage, sea green, faded garden green
- warm ivory only as texture or light, not as a large blank paper field

Avoid purple hue, pink-purple wash, neon color, glossy saturation, beige-only
covers, and heavy dark monochrome.

## Recognition Rubric

Each cover needs four readable signals:

- Figure: a large silhouette, profile, rider, pilgrim, child, poet, saint,
  soldier, lover pair, monarch, animal companion, or traveler.
- Setting: castle, storm, sea, garden, city, arena, forest, road, church,
  desert, battlefield, drawing room, river, or stage.
- Object/action: crown, dagger, letter, green light, bull, chariot, sword,
  lantern, cross, scroll, book, flower, key, ship, umbrella, toy, gate, or
  musical instrument.
- Light/color: sunset disk, storm flash, window glow, candle, halo-like warmth,
  moon, sea reflection, fire, dawn, snow brightness, or pastoral spring color.

If the book cannot be identified without text, the cover fails.

## Genre Lanes

- Shakespeare: large theatrical profiles and silhouettes, crowns, daggers,
  storms, castles, stage light, dark teal with coral/gold accents.
- Dumas/Sienkiewicz/adventure: capes, riders, swords, sea roads, forts, smoke,
  banners, warm action color; let motion break the old frame.
- Ben-Hur/classical epic: horses, chariots, arena, desert sun, Roman forms,
  ochre and teal, clear kinetic diagonals.
- Hemingway/Fitzgerald: social silhouettes, bullring, cafe, shore, city lights,
  modern flat color blocks, warm gold or green signal accents.
- Religious texts: reverent figures, pilgrim roads, candles, crosses, open
  books, church silhouettes, desert or mountain light; no kitsch or spectacle.
- Great poetry: lyric landscapes, one poet/reader silhouette, moon/sun/water,
  flowers, leaves, stars, quiet but colorful atmosphere.
- Classic children's books: brighter pastoral color, gardens, forests, roads,
  toys, houses, child silhouettes, friendly scale; still refined and not cartoon
  merchandising.

## Do

- Preserve the folder's soft color, grain, and fidelity.
- Make the cover more app-native than the paperback references.
- Use clear figures or silhouettes with a small number of meaningful details.
- Fill more of the cover with color and scenery.
- Let important forms cross the old rounded-window boundary.
- Keep faces simple and readable, not photographic.

## Do Not

- No readable title, author, publisher, annotation label, logo, fake typography,
  or back-cover blurb text.
- No white arcs, white frame cutouts, large blank paper fields, or old paperback
  scaffolding.
- No purple cast.
- No photorealism, cinematic 3D, glossy fantasy art, vector icon minimalism, or
  over-abstract symbolism.
- No gore, vulgarity, grotesque horror, or shock imagery.

## Master Prompt

```text
Create a textless Tome app cover artwork for [BOOK TITLE] by [AUTHOR].

Use the visual style of the supplied Tome/Meridian reference covers, especially
the strongest Shakespeare tragedy covers, Ben-Hur, Dumas/Sienkiewicz adventure
covers, Jan 18/Jan 19 figure covers, Hemingway/Fitzgerald modern covers,
religious text covers, great poetry covers, and classic children's covers.

Canvas: vertical 2:3 mobile app cover. Make it full-bleed or near full-bleed.
No paperback title area, no author text, no annotation label, no publisher band,
no back-cover text. No white arcs or white rounded-window cutouts. Translate the
old arched-window feeling into color and composition only, with figures/scenery
flooding beyond where the frame would have been.

Book-specific image:
- Main figure/silhouette: [LARGE READABLE FIGURE OR PAIR]
- Setting: [CLEAR SETTING]
- Object/action cue: [ONE RECOGNIZABLE PROP OR ACTION]
- Light/color cue: [SUN, MOON, WINDOW, FIRE, STORM, HALO, ETC.]

Style: polished modern-classics illustration, watercolor/gouache texture,
subtle paper grain, translucent layered color fields, matte editorial finish,
soft but distinct silhouettes, a few readable details, not too bright, not
photorealistic, not too abstract. Use more color and less empty paper than the
paperback references. Keep the subject legible at small mobile sizes.

Palette: muted teal, blue-green, smoke blue, soft charcoal, dusty coral,
terracotta, ochre, pale gold, warm sun, sage, sea green, faded garden green,
with warm ivory only as texture/light rather than a blank field.

Avoid: readable text, fake typography, logos, publisher bands, back-cover
paragraphs, white arcs, white frame cutouts, purple hue, pink-purple wash,
photorealism, glossy 3D, vector icon minimalism, over-abstract symbolism, gore,
grotesque horror, vulgarity.
```

## App Integration

Generate final textless covers first, then save the source images as:

- `public/covers/tome/source/<book-id>.png`
- `public/covers/tome/source/<book-id>.jpg`

Run `npm run covers:tome` to rebuild the generated path index used by
`ClassicsCover` and small list thumbnails. The script writes normalized app
assets to:

- `public/covers/tome/generated/images/<book-id>.jpg`
- `public/covers/tome/generated/thumbs/<book-id>.jpg`

The app prefers those Tome-ready assets before museum art. Do not run the Tome
asset script against `public/covers/covers`; those are paperback references and
many contain title, author, and publisher text.
