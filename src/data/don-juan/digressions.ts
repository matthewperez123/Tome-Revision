/**
 * Don Juan — major digression index (Part 3B of the ingestion spec).
 *
 * *Don Juan* is roughly half narrative and half digression. This index
 * flags only the *major set-piece* digressions — the passages where
 * Byron steps entirely away from Juan's plot for a sustained span of
 * stanzas on a single topic. Minor parenthetical asides are deliberately
 * not flagged; the feature is the rhythm of the set pieces, not every
 * interruption.
 *
 * The reader surface is a small "Show digressions" toggle in the canto
 * header. When enabled, a sidebar lists the canto's flagged digressions
 * with their opening-line previews so readers can jump to them directly.
 * This is the "find that brilliant thing Byron said about marriage"
 * feature the spec calls for.
 */

export type DigressionTone =
  | "satirical"
  | "elegiac"
  | "philosophical"
  | "personal"

export interface DonJuanDigression {
  canto: number
  chapterIndex: number       // index into public/content/don-juan/ch-N.json
  startStanza: number
  endStanza: number
  topic: string              // short label for the sidebar
  tone: DigressionTone
  firstLine: string          // opening line of the digression, for preview
}

/**
 * Hand-curated index of the major set-piece digressions.
 * Populated for Cantos I, II, III, IV, IX (demo-critical); remaining
 * cantos' digressions have lighter coverage for now.
 */
export const DON_JUAN_DIGRESSIONS: DonJuanDigression[] = [
  // ── Canto I ────────────────────────────────────────────────────────
  {
    canto: 1,
    chapterIndex: 2,
    startStanza: 1,
    endStanza: 5,
    topic: "The search for a hero — modern fame deflated",
    tone: "satirical",
    firstLine: "I want a hero: an uncommon want.",
  },
  {
    canto: 1,
    chapterIndex: 2,
    startStanza: 22,
    endStanza: 22,
    topic: "Attack on bluestockings (\"hen-pecked you all\")",
    tone: "satirical",
    firstLine: "But — Oh! ye lords of ladies intellectual.",
  },
  {
    canto: 1,
    chapterIndex: 2,
    startStanza: 194,
    endStanza: 194,
    topic: "\"Man's love is of man's life a thing apart\" — on love and gender",
    tone: "philosophical",
    firstLine: "Man's love is of man's life a thing apart.",
  },
  {
    canto: 1,
    chapterIndex: 2,
    startStanza: 218,
    endStanza: 222,
    topic: "\"What is the end of Fame?\" — the Cheops / vanity sequence",
    tone: "philosophical",
    firstLine: "What is the end of Fame? 'tis but to fill.",
  },

  // ── Canto II ───────────────────────────────────────────────────────
  {
    canto: 2,
    chapterIndex: 3,
    startStanza: 1,
    endStanza: 4,
    topic: "On education and the pedagogues — mock apology",
    tone: "satirical",
    firstLine: "Oh ye! who teach the ingenuous youth of nations.",
  },
  {
    canto: 2,
    chapterIndex: 3,
    startStanza: 83,
    endStanza: 83,
    topic: "Ugolino invoked as cannibalism precedent",
    tone: "satirical",
    firstLine: "Remember Ugolino condescends.",
  },

  // ── Canto III ──────────────────────────────────────────────────────
  {
    canto: 3,
    chapterIndex: 4,
    startStanza: 1,
    endStanza: 1,
    topic: "\"Hail, Muse! et cetera\" — the invocation refused",
    tone: "satirical",
    firstLine: "Hail, Muse! et cetera. — We left Juan sleeping.",
  },
  {
    canto: 3,
    chapterIndex: 4,
    startStanza: 86,
    endStanza: 86,
    topic: "\"The Isles of Greece\" — interpolated political lyric",
    tone: "elegiac",
    firstLine: "The Isles of Greece, the Isles of Greece!",
  },

  // ── Canto IV ───────────────────────────────────────────────────────
  {
    canto: 4,
    chapterIndex: 5,
    startStanza: 1,
    endStanza: 1,
    topic: "\"Nothing so difficult as a beginning\" — the Lucifer-fall opening",
    tone: "personal",
    firstLine: "Nothing so difficult as a beginning.",
  },
  {
    canto: 4,
    chapterIndex: 5,
    startStanza: 70,
    endStanza: 75,
    topic: "Haidée's death and the narrator's grief",
    tone: "elegiac",
    firstLine: "She died, but not alone.",
  },

  // ── Canto IX ───────────────────────────────────────────────────────
  {
    canto: 9,
    chapterIndex: 10,
    startStanza: 1,
    endStanza: 10,
    topic: "Wellington attack — \"Villainton,\" pensions, Castlereagh",
    tone: "satirical",
    firstLine: "Oh, Wellington! (or \"Villainton\" — for Fame).",
  },

  // ── Canto XI ───────────────────────────────────────────────────────
  {
    canto: 11,
    chapterIndex: 12,
    startStanza: 1,
    endStanza: 3,
    topic: "Bishop Berkeley and universal egotism",
    tone: "philosophical",
    firstLine: "When Bishop Berkeley said \"there was no matter.\"",
  },
  {
    canto: 11,
    chapterIndex: 12,
    startStanza: 76,
    endStanza: 85,
    topic: "Ubi sunt — Regency London's vanished names",
    tone: "elegiac",
    firstLine: "Where is the world, cries Young, at eighty?",
  },

  // ── Canto XII ──────────────────────────────────────────────────────
  {
    canto: 12,
    chapterIndex: 13,
    startStanza: 1,
    endStanza: 5,
    topic: "The middle age of man — \"black letter upon foolscap\"",
    tone: "personal",
    firstLine: "Of all the barbarous middle ages, that.",
  },

  // ── Canto XIII ─────────────────────────────────────────────────────
  {
    canto: 13,
    chapterIndex: 14,
    startStanza: 1,
    endStanza: 1,
    topic: "\"I now mean to be serious\" — against satire-as-criminal",
    tone: "satirical",
    firstLine: "I now mean to be serious; — it is time.",
  },

  // ── Canto XIV ──────────────────────────────────────────────────────
  {
    canto: 14,
    chapterIndex: 15,
    startStanza: 1,
    endStanza: 3,
    topic: "\"One system eats another up\" — the Saturnian stanza",
    tone: "philosophical",
    firstLine: "If from great Nature's or our own abyss.",
  },

  // ── Canto XV ───────────────────────────────────────────────────────
  {
    canto: 15,
    chapterIndex: 16,
    startStanza: 1,
    endStanza: 2,
    topic: "\"All present life is but an Interjection\" — life as grammatical register",
    tone: "philosophical",
    firstLine: "Ah! — What should follow slips from my reflection.",
  },

  // ── Canto XVI ──────────────────────────────────────────────────────
  {
    canto: 16,
    chapterIndex: 17,
    startStanza: 97,
    endStanza: 97,
    topic: "\"Mobility\" — Byron's self-portrait through Adeline",
    tone: "personal",
    firstLine: "So well she acted, all and every part.",
  },

  // ── Canto XVII (fragment) ──────────────────────────────────────────
  {
    canto: 17,
    chapterIndex: 18,
    startStanza: 1,
    endStanza: 14,
    topic: "\"The world is full of orphans\" — the fragment's opening",
    tone: "personal",
    firstLine: "The world is full of orphans: firstly, those.",
  },
]

/** Index digressions by canto number for O(1) canto lookup. */
export const DIGRESSIONS_BY_CANTO: Record<number, DonJuanDigression[]> =
  DON_JUAN_DIGRESSIONS.reduce<Record<number, DonJuanDigression[]>>((acc, d) => {
    ;(acc[d.canto] ??= []).push(d)
    return acc
  }, {})

/** For the reader's canto-header sidebar — list of the canto's digressions. */
export function getDigressionsForChapter(chapterIndex: number): DonJuanDigression[] {
  return DON_JUAN_DIGRESSIONS.filter((d) => d.chapterIndex === chapterIndex)
}
