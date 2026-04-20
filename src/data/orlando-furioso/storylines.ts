/**
 * Orlando Furioso — Storyline Tracker (Part 3A of the ingestion spec).
 *
 * THE load-bearing reader-facing feature for this book. Ariosto's narrative
 * interlace (entrelacement) suspends storylines for 10–20 cantos and resumes
 * them without preamble. A reader who arrives at Canto XXIII — Orlando's
 * madness — cannot be expected to remember what happened last to the
 * Orlando-Angelica thread in Canto XII, or what pursuit was active at
 * Canto I. This file is that memory.
 *
 * Reader surface: a "Storylines" sidebar in the reader. When the reader
 * opens a canto, it shows which threads appear here, summarizes what
 * happened to each thread in this canto, and links back to the most recent
 * previous canto in which each thread appeared. This is not a convenience
 * feature; without it casual readers give up by Canto X.
 *
 * Canto numbers below are 1-indexed (Ariosto's) and equal the ch-N index
 * in public/content/orlando-furioso/ (ch-0 is the editor's introduction).
 */

export type StorylineId =
  | "orlando-angelica"          // Orlando's pursuit, then loss, then madness, then recovery
  | "ruggiero-bradamante"       // Dynastic romance — the Este progenitors
  | "astolfo-hippogriff"        // Astolfo, hippogriff, moon-journey
  | "charlemagne-agramante"     // Framing war: Franks vs Saracens
  | "rinaldo-angelica"          // Early sub-plot: Rinaldo's reversed love
  | "marfisa"                   // Marfisa's trajectory into the Christian camp
  | "zerbino-isabella"          // Zerbino + Isabella's tragedy
  | "olimpia"                   // Olimpia's abduction and rescue arc
  | "rodomonte-isabella"        // Rodomonte's jealous withdrawal, Isabella's death, the bridge-tower
  | "alcina"                    // Alcina's island — Ruggiero's captivity and release
  | "atlante"                   // The sorcerer's interventions — iron castle, palace of illusion
  | "dynastic-prophecy"         // Merlin / Melissa / Este-genealogy set-pieces
  | "narrator-digressions"      // Ariosto-the-narrator's set-piece proems and asides

export interface StorylineAppearance {
  canto: number                 // Ariostan canto number (== ch-N)
  startStanza?: number          // omitted when the storyline opens the canto
  endStanza?: number            // omitted when it closes the canto
  summary: string               // what happens to this thread in this canto
}

export interface Storyline {
  id: StorylineId
  label: string                 // reader-facing short label
  description: string           // one-sentence overview
  palette: string               // CSS color (light-theme) to tint the sidebar entry
  darkPalette: string           // dark-theme variant
  appearances: StorylineAppearance[]
}

/**
 * Hand-curated storyline index. Populated with the major threads and their
 * canto appearances. Summaries are deliberately short and action-focused —
 * the reader wants "where did we leave this?" not a lit-crit gloss.
 */
export const ORLANDO_FURIOSO_STORYLINES: Storyline[] = [
  // ── Orlando & Angelica — the titular catastrophe ───────────────────
  {
    id: "orlando-angelica",
    label: "Orlando & Angelica",
    description:
      "Orlando's pursuit of Angelica through the first half of the poem; his discovery of her " +
      "marriage to Medoro in Canto XXIII, his madness, and eventual cure by Astolfo in Canto XXXIX.",
    palette: "#B33A1F",
    darkPalette: "#E26A50",
    appearances: [
      { canto: 1,  summary: "Angelica flees the captured camp; Orlando is mentioned as her absent pursuer — the thread opens in longing." },
      { canto: 8,  summary: "Sleepless, Orlando deserts Charlemagne's camp in disguise to search for Angelica." },
      { canto: 9,  summary: "Orlando rescues Olimpia from Cimosco en route, still seeking Angelica." },
      { canto: 11, summary: "Orlando kills the orc at Ebuda and recovers Olimpia; Angelica, invisible with the ring, slips past him." },
      { canto: 12, summary: "Orlando enters Atlante's palace of illusion, chasing a phantom Angelica down its endless corridors." },
      { canto: 19, startStanza: 17, summary: "Medoro, wounded, is found by Angelica; she falls in love and marries him in a forest chapel. Orlando's catastrophe is seeded — he is not yet present." },
      { canto: 23, startStanza: 102, summary: "ORLANDO ARRIVES AT THE FOREST CHAPEL. Reads Angelica's and Medoro's names carved into the trees; the proof breaks him; he strips his armor and runs mad." },
      { canto: 24, summary: "Orlando raging naked across the countryside; his armor is found by Zerbino and Isabella." },
      { canto: 29, summary: "Orlando's mad rampage reaches Africa; Angelica encounters him, does not recognize him at once, escapes. Her last appearance in the poem." },
      { canto: 30, summary: "Orlando's madness devastates Spain and North Africa; this is the pure madness canto." },
      { canto: 39, summary: "Astolfo, returned from the moon with Orlando's wits in a phial, meets his cousin and restores him. Orlando is himself again." },
    ],
  },

  // ── Ruggiero & Bradamante — the dynastic romance ───────────────────
  {
    id: "ruggiero-bradamante",
    label: "Ruggiero & Bradamante",
    description:
      "The dynastic romance between the Saracen hero Ruggiero and the Christian warrior " +
      "Bradamante — the mythical progenitors of the Este dynasty of Ferrara, Ariosto's patrons.",
    palette: "#B39240",
    darkPalette: "#DCB870",
    appearances: [
      { canto: 1,  summary: "Bradamante, armed, unhorses Sacripante (unnamed until canto's end) — her first appearance." },
      { canto: 2,  summary: "Bradamante seeks Ruggiero; a pagan knight lures her and she falls into an enchanted cave." },
      { canto: 3,  summary: "In Merlin's tomb, Melissa shows Bradamante the parade of her Este descendants — the poem's Anchises scene." },
      { canto: 4,  summary: "Bradamante rides to Atlante's iron castle; breaks the enchantment; the hippogriff carries Ruggiero off before she can reach him." },
      { canto: 6,  summary: "Ruggiero arrives at Alcina's island; Bradamante, absent, is the comparison that Ruggiero must prove worthy of." },
      { canto: 7,  summary: "Alcina's true face revealed; Ruggiero freed by Melissa with the magic ring." },
      { canto: 10, summary: "Ruggiero tempered in Logistilla's realm; flies the hippogriff back across Europe." },
      { canto: 13, summary: "Bradamante given the Este-genealogy catalogue for a second time." },
      { canto: 22, summary: "Atlante's palace of illusion destroyed by Astolfo; Ruggiero and Bradamante meet again and ride off together." },
      { canto: 25, summary: "Ruggiero learns he is Marfisa's twin brother — the dynastic shape tightens." },
      { canto: 32, summary: "Bradamante, believing Ruggiero has forsaken her for Marfisa, rides out in armor to die." },
      { canto: 35, summary: "Bradamante defeats a line of champions defending Ullania's queens." },
      { canto: 36, summary: "Bradamante and Marfisa fight; the truth of Ruggiero's loyalty and of their sibling kinship is spoken." },
      { canto: 41, summary: "Shipwrecked, Ruggiero is baptized on a hermit's island — the conversion the plot has required from the start." },
      { canto: 44, summary: "Ruggiero and Bradamante's betrothal set; the families prepare for the wedding at Charlemagne's court." },
      { canto: 46, summary: "The wedding; Rodomonte's challenge; Ruggiero kills Rodomonte. The Este line is mythologically founded." },
    ],
  },

  // ── Astolfo, the hippogriff, the moon ──────────────────────────────
  {
    id: "astolfo-hippogriff",
    label: "Astolfo & the moon",
    description:
      "The English paladin's adventures — transformed into a myrtle, restored, given the " +
      "hippogriff, armed with magic horn and book, eventually flying to the moon to recover " +
      "Orlando's wits.",
    palette: "#7AA8C4",
    darkPalette: "#B8D4E4",
    appearances: [
      { canto: 6, summary: "Astolfo, turned into a myrtle by Alcina, speaks to Ruggiero from his tree — the allegorical warning." },
      { canto: 7, summary: "Astolfo among the ex-lovers of Alcina, all transformed into plants and stones." },
      { canto: 8, summary: "Melissa's ring restores Astolfo; Logistilla shelters him." },
      { canto: 15, summary: "Astolfo receives the magic horn and book of spells at Damietta; rides the hippogriff across Asia and Africa toward home." },
      { canto: 22, summary: "Astolfo destroys Atlante's palace of illusion with the horn; Ruggiero and Bradamante reunited." },
      { canto: 33, summary: "Astolfo flies the hippogriff to Ethiopia; lifts the curse from Prester John; ascends toward the Earthly Paradise." },
      { canto: 34, summary: "Astolfo descends briefly into Hell for the tale of Lydia, then ascends the mountain of the Earthly Paradise." },
      { canto: 35, summary: "ASTOLFO ON THE MOON. St. John shows him the valley of things lost on earth; he recovers Orlando's wits stoppered in a phial." },
      { canto: 39, summary: "Astolfo meets mad Orlando, restores his wits with the phial, and rejoins the war." },
      { canto: 40, summary: "Astolfo commands Christian forces at the fall of Biserta." },
    ],
  },

  // ── The framing war ────────────────────────────────────────────────
  {
    id: "charlemagne-agramante",
    label: "War: Franks vs Saracens",
    description:
      "The framing war: Charlemagne's defense of France against Agramante's invasion from " +
      "North Africa, paralleling and shadowing the Roncevaux tradition of the Chanson de Roland.",
    palette: "#9A7A1A",
    darkPalette: "#D4B45E",
    appearances: [
      { canto: 1, summary: "The poem opens after the Franks' rout; Angelica, the reward for valor in the lost battle, flees." },
      { canto: 14, summary: "Agramante musters his Saracen host before Paris; Rodomonte rages at the walls." },
      { canto: 16, summary: "Rodomonte breaks through Paris's walls single-handed and butchers the defenders inside — the siege's peak horror." },
      { canto: 17, summary: "Within the burning city, Rodomonte fights as a wolf among sheep; Charlemagne rallies the paladins." },
      { canto: 18, summary: "Rodomonte, cheated of victory, quits Paris in a rage; the night-sortie of Cloridano and Medoro begins." },
      { canto: 27, summary: "Feuds in the Saracen camp over Doralice, Frontino, Durindana — the pagans devour their own alliance." },
      { canto: 30, summary: "Ruggiero and Mandricardo fight; the Saracen command decays further." },
      { canto: 31, summary: "Rinaldo, back from England with reinforcements, reconciles with his estranged brothers and sisters." },
      { canto: 38, summary: "Charlemagne and Agramante agree to end the general war by single combat — the device to force resolution." },
      { canto: 40, summary: "Christian fleet takes the war to Africa; Biserta falls." },
      { canto: 41, summary: "Orlando kills Agramante at Lampedusa in single combat." },
      { canto: 45, summary: "The three-on-three at Lampedusa concluded — Brandimarte dies, Orlando victorious, Christian war won." },
    ],
  },

  // ── Rinaldo & Angelica — the fountain-reversal ─────────────────────
  {
    id: "rinaldo-angelica",
    label: "Rinaldo & the fountain-reversal",
    description:
      "The early sub-plot inherited from Boiardo: Rinaldo and Angelica, once crossed in love " +
      "by the opposed fountains of Arden, now each pursuing the other in the wrong direction.",
    palette: "#1F3C7A",
    darkPalette: "#6E90D4",
    appearances: [
      { canto: 1,  summary: "Rinaldo and Ferraù fight for Angelica; Bayardo escapes; Angelica flees both." },
      { canto: 2,  summary: "Rinaldo clashes with Sacripante over Angelica; a hermit's false report sends him back to Paris." },
      { canto: 8,  summary: "Rinaldo sails to Scotland to rally aid for Charlemagne — the thread steps out of the Angelica-pursuit frame." },
      { canto: 31, summary: "Rinaldo, returning with English aid, is by this point a man Angelica no longer matters to. The sub-plot is quietly closed." },
      { canto: 42, summary: "Rinaldo refuses the cup of wife-testing — Ariosto's rebuke to the earlier fountain-reversal." },
    ],
  },

  // ── Alcina's island ────────────────────────────────────────────────
  {
    id: "alcina",
    label: "Alcina's island",
    description:
      "The Circe/Calypso/Dido set-piece: Ruggiero's captivity by the sorceress Alcina, the " +
      "revelation of her true face, and his escape to her sister Logistilla.",
    palette: "#C48A3C",
    darkPalette: "#E4B26E",
    appearances: [
      { canto: 6, summary: "Ruggiero arrives at Alcina's island; the myrtle-that-was-Astolfo warns him; Alcina's first appearance, all gold and seduction." },
      { canto: 7, summary: "Alcina's feast and bed; Melissa arrives with the ring; her true, ancient, withered face is revealed (VII.73)." },
      { canto: 8, summary: "Ruggiero flees Alcina's island; Logistilla's realm shelters him." },
      { canto: 10, summary: "Logistilla tempers Ruggiero and sends him on across Europe on the hippogriff." },
    ],
  },

  // ── Atlante's enchantments ─────────────────────────────────────────
  {
    id: "atlante",
    label: "Atlante's enchantments",
    description:
      "The African sorcerer's interventions to protect Ruggiero from his fated death in " +
      "battle — the iron castle of Canto IV, the palace of illusion of Canto XII, destroyed " +
      "at last in XXII.",
    palette: "#6E5C94",
    darkPalette: "#A89AC8",
    appearances: [
      { canto: 2,  summary: "The pagan knight who lures Bradamante into the cave is the first shadow of Atlante's project." },
      { canto: 4,  summary: "Bradamante reaches the iron castle; Atlante defeated; the hippogriff carries Ruggiero off." },
      { canto: 12, summary: "Atlante's palace of illusion — each knight pursues his own phantom." },
      { canto: 22, summary: "Astolfo destroys the palace with the magic horn; Atlante disappears from the poem." },
    ],
  },

  // ── Marfisa ────────────────────────────────────────────────────────
  {
    id: "marfisa",
    label: "Marfisa",
    description:
      "The pagan warrior maiden — introduced mid-poem, revealed late to be Ruggiero's lost " +
      "twin, eventually Christian.",
    palette: "#6E7078",
    darkPalette: "#AEB0B8",
    appearances: [
      { canto: 18, summary: "Marfisa enters the poem, a full-grown pagan warrior, fighting her way across the Mediterranean." },
      { canto: 20, summary: "Marfisa among the Amazons of the Femine Homicide; her combat law tested." },
      { canto: 25, summary: "Revealed to be Ruggiero's twin sister; receives their joint history from a hermit." },
      { canto: 36, summary: "Fights Bradamante; the truth of Ruggiero's loyalty and the siblings' history is spoken over a grave." },
      { canto: 38, summary: "Fully integrated into the Christian camp; fights for Charlemagne's cause." },
    ],
  },

  // ── Zerbino & Isabella ─────────────────────────────────────────────
  {
    id: "zerbino-isabella",
    label: "Zerbino & Isabella",
    description:
      "The tenderest romance of the paladin generation — the young Scottish prince and the " +
      "Galician princess he saves from brigands. His death at Mandricardo's hand is one of " +
      "the most admired lyric passages in the poem.",
    palette: "#5E7A9E",
    darkPalette: "#9EB4CC",
    appearances: [
      { canto: 13, summary: "Orlando rescues Isabella from a cave of brigands; she tells her tale — her love for Zerbino, now lost." },
      { canto: 23, summary: "Zerbino and Isabella encounter Orlando's abandoned armor by a stream; they mourn him as dead." },
      { canto: 24, summary: "Zerbino is killed by Mandricardo; his death and Isabella's lament — the poem's great paladin-death lyric." },
      { canto: 29, summary: "Isabella, pursued by the woman-hating Rodomonte, tricks him into beheading her rather than violating her vow to Zerbino." },
    ],
  },

  // ── Olimpia's story ────────────────────────────────────────────────
  {
    id: "olimpia",
    label: "Olimpia",
    description:
      "The Dutch princess betrayed first by her villainous suitor Cimosco, then by her rescued " +
      "husband Bireno. Orlando rescues her twice.",
    palette: "#B8A3C4",
    darkPalette: "#D6C4E0",
    appearances: [
      { canto: 9,  summary: "Orlando intervenes in Olimpia's war against Cimosco; Ariosto's lament for firearms opens here." },
      { canto: 10, summary: "Olimpia's husband Bireno abandons her on a desert island while she sleeps — Ariadne echo." },
      { canto: 11, summary: "Olimpia stripped and bound on the rock at Ebuda for the orc; Orlando kills the orc and rescues her." },
    ],
  },

  // ── Rodomonte → Isabella → the bridge-tower ────────────────────────
  {
    id: "rodomonte-isabella",
    label: "Rodomonte & the bridge-tower",
    description:
      "Rodomonte's jealous withdrawal from the Saracen camp, his woman-hating rampage, his " +
      "encounter with the bereaved Isabella, and the bridge-tower he builds to her memory.",
    palette: "#7E0A14",
    darkPalette: "#C44852",
    appearances: [
      { canto: 16, summary: "Rodomonte breaks the walls of Paris and butchers the inhabitants single-handed." },
      { canto: 17, summary: "Rodomonte within the burning city — the martial apex of his violence." },
      { canto: 18, summary: "Loses Doralice to Mandricardo; withdraws from the Saracen camp in a jealous rage." },
      { canto: 27, summary: "In isolation, Rodomonte swears vengeance on all women." },
      { canto: 28, summary: "An innkeeper tells Rodomonte the misogynist tale of Giocondo and Astolfo (NOT the English Astolfo) — Ariosto's most notorious embedded novella." },
      { canto: 29, summary: "Rodomonte attempts to force Isabella; she tricks him into beheading her; he builds a bridge-tower to her memory and exacts toll-combats from passing knights." },
      { canto: 46, summary: "Rodomonte rides into Ruggiero and Bradamante's wedding and is killed by Ruggiero. The poem ends on his furious dying soul." },
    ],
  },

  // ── Dynastic prophecy — the poem's Aeneid thread ───────────────────
  {
    id: "dynastic-prophecy",
    label: "Dynastic prophecy",
    description:
      "The set-piece passages in which Ariosto unrolls the history of the Este family for " +
      "Bradamante (and thereby for his patrons) — the poem's most sustained classical imitation.",
    palette: "#5E4A8C",
    darkPalette: "#9A84C4",
    appearances: [
      { canto: 3,  summary: "In Merlin's tomb, Melissa shows Bradamante the parade of her Este descendants — the direct imitation of Aeneid VI's Anchises parade." },
      { canto: 13, summary: "Bradamante given the names of the future Este women — the dynastic catalogue extended." },
      { canto: 26, summary: "An allegorical fountain's carving foretells battles to come — the genealogy updated." },
      { canto: 33, summary: "A painted hall in Prester John's palace shows the wars of the future Este dukes against the French — overt court poetry." },
      { canto: 42, summary: "Rinaldo shown the portraits of future Ferrarese women at Mantua — the domestic arm of the panegyric." },
      { canto: 46, summary: "The final canto's catalogue of Ariosto's own contemporaries at the wedding-feast closes the panegyric cycle." },
    ],
  },

  // ── The narrator's set-pieces ─────────────────────────────────────
  {
    id: "narrator-digressions",
    label: "Ariosto's voice",
    description:
      "The canto-opening proems and the poet's sustained authorial asides. Continuously present, " +
      "but flagged here for the passages where Ariosto speaks longest in his own voice.",
    palette: "#8B1A1A",
    darkPalette: "#D46C6C",
    appearances: [
      { canto: 1,  summary: "Opening stanzas: \"Of loves and ladies, knights and arms, I sing\" — the Virgilian incipit reset for Ferrara. Dedication to Ippolito." },
      { canto: 9,  summary: "The anti-firearm lament — one of the first sustained critiques of gunpowder in European literature." },
      { canto: 18, summary: "On the stone-throwing habits of men in combat; asides on his own slowing craft." },
      { canto: 28, summary: "The Giocondo novella — framed as \"not my view, reader, but offered because it is in the tradition.\" Ariosto's most ironic distancing move." },
      { canto: 35, summary: "St. John on how poets have always flattered princes — Ariosto's meta-commentary on his own Este encomia." },
      { canto: 37, summary: "The querelle des femmes passage — sustained defense of women's capacity, complicated by his court position." },
      { canto: 43, summary: "The slow boat down the Po past the villas of Ariosto's own Ferrarese patrons — the most openly autobiographical canto." },
      { canto: 46, summary: "The closing stanzas: the poet returns to harbor after long voyage; his friends named one by one on the dock." },
    ],
  },
]

/**
 * Look up all storylines active in a given canto. Returns the array of
 * (storyline, appearance) pairs so the reader sidebar can render them.
 */
export function getStorylinesForCanto(
  canto: number
): Array<{ storyline: Storyline; appearance: StorylineAppearance }> {
  const results: Array<{ storyline: Storyline; appearance: StorylineAppearance }> = []
  for (const storyline of ORLANDO_FURIOSO_STORYLINES) {
    for (const appearance of storyline.appearances) {
      if (appearance.canto === canto) {
        results.push({ storyline, appearance })
      }
    }
  }
  return results
}

/**
 * For a given storyline and canto, return the most recent previous canto in
 * which the storyline appeared — lets the reader jump back to re-orient.
 */
export function previousCantoForStoryline(
  storylineId: StorylineId,
  currentCanto: number
): number | null {
  const storyline = ORLANDO_FURIOSO_STORYLINES.find((s) => s.id === storylineId)
  if (!storyline) return null
  const prior = storyline.appearances
    .filter((a) => a.canto < currentCanto)
    .sort((a, b) => b.canto - a.canto)
  return prior[0]?.canto ?? null
}
