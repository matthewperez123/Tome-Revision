/**
 * Don Juan speaker palette — Byron's comic counter-epic.
 *
 * Design rationale:
 *   - The narrator ("Byron-the-narrator", the poet's own voice) is the true
 *     protagonist of the poem. The palette honors that: the narrator carries
 *     a distinctive ink-blue with a slight gold undertone — sardonic,
 *     aristocratic, constantly present — and takes the base text in every
 *     canto. Every other voice is marked off *from* this narrator.
 *   - Don Juan himself is a warm Spanish gold: young, beautiful, reactive.
 *     Byron's joke is that the legendary seducer is actually seduced
 *     throughout. The color is warm but not commanding.
 *   - Donna Inez is austere violet — Byron's estranged wife Annabella
 *     Milbanke, unmistakably. Cold, formal, unloved.
 *   - The three great loves (Julia, Haidée, Adeline) each get their own
 *     palette register: dawn-rose, sea-pearl/dawn-gold, English-rose with
 *     silver. Haidée's is the most tender — deliberately so, since her
 *     death is the poem's emotional center.
 *   - The political/martial figures (Lambro, Gulbeyaz, Catherine) read
 *     heavier: obsidian, imperial crimson, imperial gold.
 *   - Aurora Raby, introduced late, carries pearl-violet — deliberately
 *     distinct from Adeline's palette because she is the only character
 *     in the English cantos who genuinely interests both Juan and the
 *     narrator.
 *
 * Colors are tuned for both light and dark reader themes.
 */

export interface DonJuanSpeaker {
  id: string
  name: string
  color: string      // light-theme color
  darkColor: string  // dark-theme color
  group: "narrator" | "juan" | "women" | "rivals" | "english" | "satirical"
  note?: string
}

export const DON_JUAN_SPEAKERS: DonJuanSpeaker[] = [
  // ── Narrator (Byron) — the poem's true protagonist ────────────────
  {
    id: "Byron",
    name: "Byron (narrator)",
    color: "#1F3A5F",       // ink-blue with slight warm undertone
    darkColor: "#8AA6CC",
    group: "narrator",
    note:
      "Ink-blue with a slight gold undertone — sardonic, aristocratic, constantly present. " +
      "The narrator is the poem's protagonist, not Juan. Roughly half the poem is digression " +
      "in this voice; the palette makes the narrator legible as a distinct speaking presence.",
  },

  // ── Don Juan himself ──────────────────────────────────────────────
  {
    id: "Juan",
    name: "Don Juan",
    color: "#B8862C",       // warm Spanish gold
    darkColor: "#E8C478",
    group: "juan",
    note:
      "Warm Spanish gold — young, beautiful, reactive rather than active. " +
      "Byron's joke: the legendary seducer is seduced throughout.",
  },

  // ── The women (chronological through the poem) ────────────────────
  {
    id: "Inez",
    name: "Donna Inez",
    color: "#5D4A78",       // austere violet
    darkColor: "#A893C4",
    group: "women",
    note:
      "Austere violet — modeled (savagely) on Byron's estranged wife Annabella Milbanke. " +
      "Cold formality; unloved learning.",
  },
  {
    id: "Julia",
    name: "Donna Julia",
    color: "#C46A7A",       // dawn-rose
    darkColor: "#E094A4",
    group: "women",
    note:
      "Dawn-rose — the first affair, married older woman, Canto I. " +
      "Her letter at I.192–97 is one of the poem's most quoted passages.",
  },
  {
    id: "Haidee",
    name: "Haidée",
    color: "#9AAAB4",       // sea-pearl with dawn-gold undertone
    darkColor: "#C8D4DC",
    group: "women",
    note:
      "Sea-pearl and dawn-gold — the Greek-island idyll of Cantos II–IV. " +
      "The poem's one unironic love; her death is its emotional center. " +
      "Palette deliberately soft, Edenic, brief.",
  },
  {
    id: "Gulbeyaz",
    name: "Gulbeyaz (the Sultana)",
    color: "#A8303C",       // imperial crimson
    darkColor: "#D66670",
    group: "women",
    note:
      "Imperial crimson — Cantos V–VI, the harem episode. " +
      "Power fused with thwarted desire.",
  },
  {
    id: "Catherine",
    name: "Catherine the Great",
    color: "#8F6A1A",       // imperial gold, sharp-edged
    darkColor: "#D4AA55",
    group: "women",
    note:
      "Imperial gold with a sharp edge — Cantos IX–X. " +
      "Empress-as-devourer; Byron's politics (Russia as despotism, Poland as cause) matter here.",
  },
  {
    id: "Adeline",
    name: "Lady Adeline Amundeville",
    color: "#B87070",       // English rose with silver
    darkColor: "#DE9898",
    group: "english",
    note:
      "English-rose with silver — the English cantos' (XI–XVII) primary female interest. " +
      "Aristocratic society at its most polished and most hollow. " +
      "Components of Lady Holland, Caroline Lamb, and Byron's imagined ideal.",
  },
  {
    id: "Aurora",
    name: "Aurora Raby",
    color: "#8A7AAC",       // pearl with violet undertone
    darkColor: "#C0B2D8",
    group: "english",
    note:
      "Pearl with violet — the Catholic orphan in the English cantos. " +
      "Introduced late; the only character in the late cantos who genuinely interests Juan and Byron. " +
      "Palette deliberately distinct from Adeline's.",
  },
  {
    id: "FitzFulke",
    name: "The Duchess of Fitz-Fulke",
    color: "#A25070",       // flushed rose, more worldly than Adeline
    darkColor: "#D080A0",
    group: "english",
    note:
      "Warm flushed rose — the Duchess who disguises herself as the Black Friar ghost in Canto XVI. " +
      "The poem's last coup de théâtre.",
  },

  // ── Rivals / patriarchs / martial figures ─────────────────────────
  {
    id: "Lambro",
    name: "Lambro",
    color: "#2C2C33",       // obsidian
    darkColor: "#848490",
    group: "rivals",
    note:
      "Deep obsidian — Haidée's father, the pirate-chief. " +
      "Implacable; his return destroys the idyll.",
  },
  {
    id: "Alfonso",
    name: "Don Alfonso",
    color: "#4A3F2C",       // muddy brown — the cuckold
    darkColor: "#9A8A70",
    group: "rivals",
    note:
      "Muddy brown — Julia's elderly husband in Canto I. " +
      "The ridiculed cuckold of the opening affair.",
  },
  {
    id: "Suwarrow",
    name: "Field-Marshal Suwarrow",
    color: "#6E5A2A",       // worn military bronze
    darkColor: "#B09860",
    group: "rivals",
    note:
      "Worn military bronze — the Russian field-marshal of the Ismail cantos (VII–VIII). " +
      "Historically accurate; Byron's anti-war satire is pointed at his real record.",
  },
  {
    id: "LordHenry",
    name: "Lord Henry Amundeville",
    color: "#4C5E4A",       // sober English green — old-stock Tory
    darkColor: "#96A896",
    group: "english",
    note:
      "Sober English green — Adeline's husband, old-stock Tory peer, " +
      "partly a Byron political self-projection (the peer Byron was and was exiled from).",
  },
]

export const DON_JUAN_SPEAKERS_BY_ID: Record<string, DonJuanSpeaker> =
  Object.fromEntries(DON_JUAN_SPEAKERS.map((s) => [s.id, s]))

/** Legend ordering for the in-reader palette panel. */
export const DON_JUAN_LEGEND_GROUPS: { heading: string; ids: string[] }[] = [
  { heading: "Narrator",           ids: ["Byron"] },
  { heading: "Hero",               ids: ["Juan"] },
  { heading: "The women",          ids: ["Julia", "Haidee", "Gulbeyaz", "Catherine"] },
  { heading: "English cantos",     ids: ["Adeline", "Aurora", "FitzFulke", "LordHenry"] },
  { heading: "Family & rivals",    ids: ["Inez", "Alfonso", "Lambro", "Suwarrow"] },
]
