/**
 * Orlando Furioso — canto-proem and set-piece digression index.
 *
 * Ariosto opens nearly every canto with a 1–5 stanza authorial proem —
 * addressed to Ippolito or to the reader, commenting on love, war, fortune,
 * the poem itself. These are a signature feature of the genre and direct
 * ancestors of Byron's digressions in Don Juan. The reader surface treats
 * them the way Don Juan treats Byron's: flagged with a subtle marker and
 * listed in an optional sidebar.
 *
 * Coverage in this first pass is populated for the demo-critical cantos
 * (I, VI–VIII, XXIII–XXIV, XXXIII–XXXV, XLVI) and seeded lightly elsewhere.
 * A second pass can extend.
 */

export type DigressionTone =
  | "proem"              // canto-opening proem (signature Ariostan form)
  | "panegyric"          // Este court poetry
  | "philosophical"      // on love, fortune, craft
  | "misogyny-frame"     // the querelle-des-femmes passages, ironic
  | "querelle-defense"   // defense of women — in tension with the above
  | "autobiographical"   // Alessandra, Ferrara, Ariosto's own life
  | "classical-aside"    // meditation that invokes the classical tradition
  | "lament"             // e.g. the firearms lament (IX), the moon catalogue (XXXV)

export interface OrlandoFuriosoDigression {
  canto: number
  chapterIndex: number         // index into public/content/orlando-furioso/ch-N.json
  startStanza: number
  endStanza: number
  topic: string
  tone: DigressionTone
  firstLine: string            // opening line of the digression (Rose text)
}

/**
 * Hand-curated digression index. Ariosto's proems are the backbone; the
 * longer philosophical and panegyric set-pieces fill the rest.
 */
export const ORLANDO_FURIOSO_DIGRESSIONS: OrlandoFuriosoDigression[] = [
  // ── Canto I ────────────────────────────────────────────────────────
  {
    canto: 1,
    chapterIndex: 1,
    startStanza: 1,
    endStanza: 4,
    topic: "The poet's incipit — \"Of loves and ladies, knights and arms\"",
    tone: "proem",
    firstLine: "Of loves and ladies, knights and arms, I sing",
  },
  {
    canto: 1,
    chapterIndex: 1,
    startStanza: 2,
    endStanza: 4,
    topic: "Dedication to Cardinal Ippolito d'Este",
    tone: "panegyric",
    firstLine: "Good seed of Hercules, give ear and deign",
  },

  // ── Canto VI ───────────────────────────────────────────────────────
  {
    canto: 6,
    chapterIndex: 6,
    startStanza: 1,
    endStanza: 3,
    topic: "On the man of evil mind — wickedness always finds itself out",
    tone: "proem",
    firstLine: "Most wretched is the man of evil mind",
  },

  // ── Canto VII ──────────────────────────────────────────────────────
  {
    canto: 7,
    chapterIndex: 7,
    startStanza: 1,
    endStanza: 2,
    topic: "On what the well-travelled see that the home-kept cannot believe",
    tone: "proem",
    firstLine: "He who beyond his country's narrow sphere",
  },

  // ── Canto VIII ─────────────────────────────────────────────────────
  {
    canto: 8,
    chapterIndex: 8,
    startStanza: 1,
    endStanza: 2,
    topic: "On enchantment in its many forms",
    tone: "proem",
    firstLine: "Oh! how my soul with sore misgiving grieves",
  },

  // ── Canto IX ───────────────────────────────────────────────────────
  {
    canto: 9,
    chapterIndex: 9,
    startStanza: 1,
    endStanza: 2,
    topic: "On love as tyranny over reason",
    tone: "proem",
    firstLine: "What will not love impel a gentle breast",
  },
  {
    canto: 9,
    chapterIndex: 9,
    startStanza: 88,
    endStanza: 91,
    topic: "The firearms lament — the malign invention that ends chivalry",
    tone: "lament",
    firstLine: "O foul and pestilent discovery",
  },

  // ── Canto XVIII — the Nisus/Euryalus imitation ─────────────────────
  {
    canto: 18,
    chapterIndex: 18,
    startStanza: 1,
    endStanza: 3,
    topic: "On the mercy of princes",
    tone: "proem",
    firstLine: "Magnanimous, my lord, is all your race",
  },

  // ── Canto XXIII — the structural center ────────────────────────────
  {
    canto: 23,
    chapterIndex: 23,
    startStanza: 1,
    endStanza: 2,
    topic: "On the knight's duty to return good for good",
    tone: "proem",
    firstLine: "With deep attention that good shepherd heard",
  },

  // ── Canto XXIV — post-madness ──────────────────────────────────────
  {
    canto: 24,
    chapterIndex: 24,
    startStanza: 1,
    endStanza: 3,
    topic: "On love as madness — the classical tradition invoked",
    tone: "proem",
    firstLine: "Who in the toils of love himself doth bind",
  },

  // ── Canto XXVIII — the Giocondo novella frame ──────────────────────
  {
    canto: 28,
    chapterIndex: 28,
    startStanza: 1,
    endStanza: 3,
    topic: "Apology before the misogynist novella — \"not my view, reader\"",
    tone: "misogyny-frame",
    firstLine: "Ladies, and you that ladies hold in prize",
  },

  // ── Canto XXXIII — the moon-journey begins ─────────────────────────
  {
    canto: 33,
    chapterIndex: 33,
    startStanza: 1,
    endStanza: 3,
    topic: "On the painted hall — Este wars read prophetically on the wall",
    tone: "panegyric",
    firstLine: "Of old, in Thunor's ire, Lycaon's race",
  },

  // ── Canto XXXIV — the descent ──────────────────────────────────────
  {
    canto: 34,
    chapterIndex: 34,
    startStanza: 1,
    endStanza: 3,
    topic: "On the harpies — allegory of court greed",
    tone: "proem",
    firstLine: "O hungry, fierce, and rav'nous Harpy-brood",
  },

  // ── Canto XXXV — the moon catalogue and poets' lies ────────────────
  {
    canto: 35,
    chapterIndex: 35,
    startStanza: 1,
    endStanza: 3,
    topic: "Proem to the moon's valley — the things men lose on earth",
    tone: "proem",
    firstLine: "Who, lady, shall to that far region soar",
  },
  {
    canto: 35,
    chapterIndex: 35,
    startStanza: 18,
    endStanza: 30,
    topic: "The valley catalogue — vows, prayers, gifts, old lovers' sighs",
    tone: "lament",
    firstLine: "There lost nobility's recovered seen",
  },
  {
    canto: 35,
    chapterIndex: 35,
    startStanza: 26,
    endStanza: 30,
    topic: "St. John on how poets have always flattered princes",
    tone: "classical-aside",
    firstLine: "Well are the bards of Homer's honour'd line",
  },

  // ── Canto XXXVII — the querelle des femmes defense ────────────────
  {
    canto: 37,
    chapterIndex: 37,
    startStanza: 1,
    endStanza: 23,
    topic: "Sustained defense of women's capacity — the querelle's most extended passage",
    tone: "querelle-defense",
    firstLine: "If to our present times, when women show",
  },

  // ── Canto XLIII — the autobiographical Po voyage ──────────────────
  {
    canto: 43,
    chapterIndex: 43,
    startStanza: 1,
    endStanza: 3,
    topic: "On friendship and the passing of time",
    tone: "autobiographical",
    firstLine: "Detestable, O avarice! — and how low",
  },

  // ── Canto XLVI — the return to harbor ──────────────────────────────
  {
    canto: 46,
    chapterIndex: 46,
    startStanza: 1,
    endStanza: 19,
    topic: "The ship returns to port — the poet's friends named one by one on the dock",
    tone: "autobiographical",
    firstLine: "If'er, my lord, I saw your gracious face",
  },
  {
    canto: 46,
    chapterIndex: 46,
    startStanza: 140,
    endStanza: 140,
    topic: "Closing line — Rodomonte's soul echoes Turnus",
    tone: "classical-aside",
    firstLine: "The shade, which was so haughty and so bold",
  },
]

/** Index digressions by canto number for O(1) canto lookup. */
export const DIGRESSIONS_BY_CANTO: Record<number, OrlandoFuriosoDigression[]> =
  ORLANDO_FURIOSO_DIGRESSIONS.reduce<Record<number, OrlandoFuriosoDigression[]>>((acc, d) => {
    ;(acc[d.canto] ??= []).push(d)
    return acc
  }, {})

/** For the reader's canto-header sidebar — list of this canto's digressions. */
export function getDigressionsForChapter(
  chapterIndex: number
): OrlandoFuriosoDigression[] {
  return ORLANDO_FURIOSO_DIGRESSIONS.filter((d) => d.chapterIndex === chapterIndex)
}

/** Is a given stanza inside a flagged proem? */
export function isProemStanza(canto: number, stanza: number): boolean {
  const ds = DIGRESSIONS_BY_CANTO[canto] ?? []
  return ds.some((d) => d.tone === "proem" && stanza >= d.startStanza && stanza <= d.endStanza)
}
