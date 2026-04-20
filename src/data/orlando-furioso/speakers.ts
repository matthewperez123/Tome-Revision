/**
 * Orlando Furioso speaker palette — Ariosto's Italian Renaissance chivalric epic.
 *
 * Design rationale:
 *   - The Ariosto-narrator (the poet's own voice — continuously present, digressive,
 *     ironic, courtly) is the palette's load-bearing choice. Ferrara-red with a
 *     burnished-gold undertone: deliberately distinct from Byron's cold ink-blue,
 *     even though Don Juan is Orlando Furioso's direct formal descendant. Byron
 *     is Regency London; Ariosto is Renaissance Ferrara, and the palettes honor
 *     that difference.
 *   - Orlando's palette heats as the poem progresses, foreshadowing his madness
 *     in Canto XXIII — an ember-red that readers should eventually feel as
 *     volatile rather than stable.
 *   - Angelica is light and moving — pale gold against dawn-rose — perpetually
 *     slipping out of every knight's grasp through the first half of the poem.
 *   - Ruggiero and Bradamante are the dynastic pair: gold/steel and silver/rose;
 *     their palette is deliberately *cooperative* rather than contrastive.
 *   - Alcina is iridescent gold shifting to crimson — the shift itself is the
 *     character. When her true face is revealed in VII.73, the reader's
 *     registration of the palette should tip.
 *   - St. John the Evangelist (XXXIV–XXXV) carries a pale luminous gold —
 *     deliberately the same register as Logistilla, who is allegorical reason;
 *     St. John is allegorical wisdom. The moon cantos wear a cool, clarified
 *     palette distinct from the rest of the poem.
 *   - Merlin's shade carries the same prophetic violet used for Anchises in the
 *     Aeneid palette — the two prophetic-genealogy scenes are directly parallel,
 *     and the visual rhyme reinforces the textual one.
 *
 * Colors are tuned for both light and dark reader themes.
 */

export interface OrlandoFuriosoSpeaker {
  id: string
  name: string
  color: string      // light-theme color
  darkColor: string  // dark-theme color
  group:
    | "narrator"
    | "paladins"
    | "women-warriors"
    | "angelica-orbit"
    | "saracens"
    | "sorcery"
    | "allegory"
    | "courts"
    | "classical"
  note?: string
}

export const ORLANDO_FURIOSO_SPEAKERS: OrlandoFuriosoSpeaker[] = [
  // ── The narrator (Ariosto) — the palette's load-bearing voice ──────
  {
    id: "Ariosto",
    name: "Ariosto (narrator)",
    color: "#8B1A1A",       // Ferrara carmine
    darkColor: "#D46C6C",
    group: "narrator",
    note:
      "Ferrara carmine with a burnished-gold undertone — courtly, confiding, ironic. " +
      "The narrator is continuously present: every canto opens with a proem in this voice, " +
      "and the poem's asides, addresses to patrons, reflections on women, and admissions of " +
      "craft-fatigue all belong to him. Deliberately distinguished from Byron's ink-blue: " +
      "Byron's narrator is Regency London; Ariosto's is a working courtier at the Este court.",
  },

  // ── Paladins (Matter of France — Christians) ───────────────────────
  {
    id: "Orlando",
    name: "Orlando (Roland)",
    color: "#B33A1F",       // ember-red, heated
    darkColor: "#E26A50",
    group: "paladins",
    note:
      "Ember-red, heated — the paladin who goes mad in Canto XXIII. " +
      "The palette should feel volatile; its saturation intensifies as the poem approaches " +
      "the forest-carving scene that breaks him.",
  },
  {
    id: "Rinaldo",
    name: "Rinaldo (Renaud)",
    color: "#1F3C7A",       // imperial blue
    darkColor: "#6E90D4",
    group: "paladins",
    note:
      "Imperial blue — the second great paladin, Orlando's cousin and rival in love. " +
      "Earlier the object of Angelica's unreciprocated love (from Boiardo's Innamorato); " +
      "in Furioso the fountain-waters are reversed, and now he loves and she flees.",
  },
  {
    id: "Astolfo",
    name: "Astolfo",
    color: "#7AA8C4",       // iridescent — shifts under different lights
    darkColor: "#B8D4E4",
    group: "paladins",
    note:
      "Iridescent, playful — the comic English paladin who rides the hippogriff and recovers " +
      "Orlando's wits from the moon. Palette deliberately distinct from every other character's: " +
      "Astolfo is the poem's tonal lightener, and the one paladin the narrator openly enjoys.",
  },
  {
    id: "Charlemagne",
    name: "Charlemagne",
    color: "#9A7A1A",       // imperial gold, distant
    darkColor: "#D4B45E",
    group: "paladins",
    note:
      "Imperial gold, distant and august — the framing monarch whose war with Agramante frames " +
      "the poem. Present more as institution than character.",
  },
  {
    id: "Brandimarte",
    name: "Brandimarte",
    color: "#4F6E48",       // forest-green, earnest
    darkColor: "#8CB080",
    group: "paladins",
    note:
      "Forest-green — Orlando's truest friend, killed in the three-on-three combat at Lampedusa " +
      "(Canto XLI). The poem's most grief-laden paladin death.",
  },
  {
    id: "Zerbino",
    name: "Zerbino",
    color: "#5E7A9E",       // Scottish blue-gray
    darkColor: "#9EB4CC",
    group: "paladins",
    note:
      "Scottish blue-gray — Ariosto's most tender young paladin, betrothed to Isabella. " +
      "Killed by Mandricardo in Canto XXIV; his death and Isabella's lament are one of the " +
      "poem's most admired lyric passages.",
  },

  // ── Women warriors (Matter of France — Christians, by adoption) ────
  {
    id: "Bradamante",
    name: "Bradamante",
    color: "#A8A0B4",       // silver with rose
    darkColor: "#D4CCD8",
    group: "women-warriors",
    note:
      "Silver with rose — the warrior maiden, Rinaldo's sister, Ruggiero's betrothed, " +
      "the dynastic mother of the Este line. Palette deliberately cooperative with Ruggiero's.",
  },
  {
    id: "Marfisa",
    name: "Marfisa",
    color: "#6E7078",       // silver-steel
    darkColor: "#AEB0B8",
    group: "women-warriors",
    note:
      "Silver-steel — the pagan warrior maiden, revealed in Canto XXV to be Ruggiero's long-lost " +
      "twin. Converts to Christianity. Sharper-edged than Bradamante's palette; she came up in " +
      "harder country.",
  },

  // ── Angelica and her orbit ─────────────────────────────────────────
  {
    id: "Angelica",
    name: "Angelica",
    color: "#D6B35C",       // pale gold with dawn-rose
    darkColor: "#EAD28E",
    group: "angelica-orbit",
    note:
      "Pale gold with dawn-rose — the Cathayan princess pursued through the entire first half " +
      "of the poem. The palette should feel *light and moving*, perpetually slipping away. " +
      "Chooses Medoro over every paladin and disappears from the poem after Canto XXIX.",
  },
  {
    id: "Medoro",
    name: "Medoro",
    color: "#D49A7C",       // warm rose-gold
    darkColor: "#EABA9E",
    group: "angelica-orbit",
    note:
      "Warm rose-gold — the young Saracen soldier who carves his name with Angelica's into the " +
      "forest trees, precipitating Orlando's madness. The narrative's unlikeliest beloved; " +
      "Ariosto treats him tenderly.",
  },
  {
    id: "Sacripante",
    name: "Sacripante",
    color: "#8C4E2A",       // worn leather brown
    darkColor: "#C48A64",
    group: "angelica-orbit",
    note:
      "Worn leather brown — the Circassian king perpetually almost-but-not-quite in possession " +
      "of Angelica. His lament under the fountain in Canto I is her first clear glimpse of how " +
      "men speak of her when they don't know she's listening.",
  },

  // ── Saracens (Matter of France — antagonists) ──────────────────────
  {
    id: "Agramante",
    name: "Agramante",
    color: "#8E1F2E",       // crimson with obsidian
    darkColor: "#CC5468",
    group: "saracens",
    note:
      "Crimson with obsidian — the young Saracen king whose invasion of France frames the war. " +
      "Killed by Orlando in single combat in Canto XLI.",
  },
  {
    id: "Rodomonte",
    name: "Rodomonte",
    color: "#7E0A14",       // blood-red iron
    darkColor: "#C44852",
    group: "saracens",
    note:
      "Blood-red iron — the most formidable and hyperbolic Saracen, who breaks the walls of " +
      "Paris single-handed in Canto XVI. Killed by Ruggiero at the poem's end (XLVI); his " +
      "dying speech echoes Turnus's in Aeneid XII.",
  },
  {
    id: "Mandricardo",
    name: "Mandricardo",
    color: "#7A5A26",       // scorched bronze
    darkColor: "#C49E5A",
    group: "saracens",
    note:
      "Scorched bronze — son of the Tartar king, heir to Hector's armor, killer of Zerbino. " +
      "One of the most active combatants of the middle cantos.",
  },
  {
    id: "Gradasso",
    name: "Gradasso",
    color: "#695E3C",       // dull gold
    darkColor: "#AEA074",
    group: "saracens",
    note:
      "Dull gold — king of Sericana, come from the East in search of Rinaldo's sword Durindana " +
      "and Orlando's horse Bayardo. Carried over from Boiardo.",
  },
  {
    id: "Ferrau",
    name: "Ferraù",
    color: "#8A6434",       // bronze with dust
    darkColor: "#C49866",
    group: "saracens",
    note:
      "Bronze with dust — the Saracen of Canto I, who drops his helmet in the stream and is " +
      "shamed by Argalìa's ghost. His vow to win Orlando's helmet threads through the poem.",
  },
  {
    id: "Sobrino",
    name: "Sobrino",
    color: "#566672",       // sober iron-gray
    darkColor: "#9AA6B0",
    group: "saracens",
    note:
      "Sober iron-gray — the aged Saracen counselor whose prudent voice in Canto XXXVIII " +
      "argues for ending the war by champions' combat rather than general slaughter. Converts " +
      "to Christianity at Lampedusa.",
  },
  {
    id: "Ruggiero",
    name: "Ruggiero",
    color: "#B39240",       // gold and steel
    darkColor: "#DCB870",
    group: "saracens",
    note:
      "Gold and steel — the dynastic hero, mythical ancestor of the Este family. Born to a " +
      "pagan father and a Christian mother; raised by Atlante. Converts to Christianity in " +
      "Canto XLI and is betrothed to Bradamante. The palette is warm but bears steel; he begins " +
      "the poem a Saracen and ends it the founder of Ariosto's patrons' line.",
  },

  // ── Sorcery — Atlante, Alcina, Logistilla, Melissa ─────────────────
  {
    id: "Atlante",
    name: "Atlante",
    color: "#6E5C94",       // muted violet
    darkColor: "#A89AC8",
    group: "sorcery",
    note:
      "Muted violet — the African sorcerer, Ruggiero's guardian. Benevolent by intent, " +
      "disastrous by effect: his iron castle and his palace of illusion are cages of love. " +
      "Dies (or vanishes) in Canto XXII when Astolfo breaks the enchantment.",
  },
  {
    id: "Alcina",
    name: "Alcina",
    color: "#C48A3C",       // iridescent gold (shifts to crimson)
    darkColor: "#E4B26E",
    group: "sorcery",
    note:
      "Iridescent gold shifting to crimson — the Circe-figure whose true, ancient, withered " +
      "face is revealed in VII.73 when Melissa gives Ruggiero the ring. The palette should " +
      "*shift* in the reader's sense of her as the passage turns. Direct source for Spenser's " +
      "Duessa (Faerie Queene I.viii).",
  },
  {
    id: "Logistilla",
    name: "Logistilla",
    color: "#E2D89A",       // pale luminous gold
    darkColor: "#F0E8BC",
    group: "sorcery",
    note:
      "Pale luminous gold — Alcina's virtuous sister, allegorical figure of Reason. Her realm " +
      "(Canto X) is where Ruggiero is tempered before the poem releases him back into the world.",
  },
  {
    id: "Melissa",
    name: "Melissa",
    color: "#7C6EA8",       // deep violet, prophetic
    darkColor: "#B4A8D6",
    group: "sorcery",
    note:
      "Deep prophetic violet — Merlin's priestess, Bradamante's guide, the agent of every " +
      "dynastic revelation in the poem.",
  },
  {
    id: "Merlin",
    name: "Merlin's shade",
    color: "#5E4A8C",       // prophetic violet — reused from Anchises
    darkColor: "#9A84C4",
    group: "sorcery",
    note:
      "Prophetic violet — the same palette used for Anchises's shade in the Aeneid ingestion. " +
      "The parallel between Merlin's unrolling of the House of Este and Anchises's unrolling of " +
      "Rome's heroes is Ariosto's most deliberate classical-epic citation, and the palettes " +
      "rhyme by design.",
  },

  // ── Allegory ───────────────────────────────────────────────────────
  {
    id: "StJohn",
    name: "St. John the Evangelist",
    color: "#E6DBA8",       // pale luminous gold (register with Logistilla)
    darkColor: "#F2EAC8",
    group: "allegory",
    note:
      "Pale luminous gold — the same register as Logistilla, deliberately. St. John conducts " +
      "Astolfo through the moon in Cantos XXXIV–XXXV and explains the poem's allegorical truth, " +
      "including a frank lecture on how poets have always lied about princes. One of the " +
      "strangest passages in European epic.",
  },
  {
    id: "PresterJohn",
    name: "Prester John (Senapo)",
    color: "#8E7436",       // aged gold-bronze
    darkColor: "#C8A868",
    group: "allegory",
    note:
      "Aged gold-bronze — the Ethiopian emperor-priest whose blinding Astolfo cures in " +
      "Canto XXXIII, before the ascent to the moon. A bridge figure between romance-geography " +
      "and allegorical cosmography.",
  },

  // ── Courts: Este patrons invoked directly ──────────────────────────
  {
    id: "Ippolito",
    name: "Cardinal Ippolito d'Este",
    color: "#9A3236",       // cardinal red, earthly
    darkColor: "#D26A70",
    group: "courts",
    note:
      "Cardinal red, earthly — the dedicatee and patron (Ariosto's direct employer 1503–17). " +
      "Addressed by name in Canto I's opening stanzas and at several junctures throughout. " +
      "The praise is court poetry; annotate it honestly, neither a hagiography nor an erasure.",
  },
  {
    id: "Alfonso",
    name: "Duke Alfonso I d'Este",
    color: "#6A4E24",       // aged bronze, ducal
    darkColor: "#B89868",
    group: "courts",
    note:
      "Aged bronze — Alfonso I, Duke of Ferrara (r. 1505–34), husband of Lucrezia Borgia, " +
      "and Ariosto's ultimate patron after Ippolito. Named in the dynastic panegyric passages.",
  },

  // ── Classical invocations (when they surface) ──────────────────────
  {
    id: "ClassicalGods",
    name: "Classical deities (invoked)",
    color: "#7E86A6",       // Virgilian classical palette
    darkColor: "#B0B8D0",
    group: "classical",
    note:
      "Reuses the Virgilian palette used in the Aeneid ingestion. Ariosto invokes the classical " +
      "pantheon rarely but deliberately — generally as a decorative or allegorical gesture " +
      "rather than as moving agents. Flag occurrences with this palette so the classical " +
      "register is consistent across Dante/Iliad/Odyssey/Aeneid/Orlando Furioso.",
  },
]

export const ORLANDO_FURIOSO_SPEAKERS_BY_ID: Record<string, OrlandoFuriosoSpeaker> =
  Object.fromEntries(ORLANDO_FURIOSO_SPEAKERS.map((s) => [s.id, s]))

/** Legend ordering for the in-reader palette panel. */
export const ORLANDO_FURIOSO_LEGEND_GROUPS: { heading: string; ids: string[] }[] = [
  { heading: "Narrator",          ids: ["Ariosto"] },
  { heading: "Paladins",          ids: ["Orlando", "Rinaldo", "Astolfo", "Charlemagne", "Brandimarte", "Zerbino"] },
  { heading: "Warrior women",     ids: ["Bradamante", "Marfisa"] },
  { heading: "Angelica's orbit",  ids: ["Angelica", "Medoro", "Sacripante"] },
  { heading: "Saracens",          ids: ["Ruggiero", "Agramante", "Rodomonte", "Mandricardo", "Gradasso", "Ferrau", "Sobrino"] },
  { heading: "Sorcery",           ids: ["Atlante", "Alcina", "Logistilla", "Melissa", "Merlin"] },
  { heading: "Allegory",          ids: ["StJohn", "PresterJohn"] },
  { heading: "Patrons",           ids: ["Ippolito", "Alfonso"] },
  { heading: "Classical",         ids: ["ClassicalGods"] },
]
