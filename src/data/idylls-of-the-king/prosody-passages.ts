/**
 * Curated prosody passages — moments in Idylls of the King where
 * Tennyson's sound-effects are unusually concentrated and worth the
 * reader's deliberate attention.
 *
 * The spec counsels restraint: "Do not over-annotate sound. Tennyson's
 * music works best when the reader hears it rather than being told
 * about it. Reserve sound-annotations for roughly 10–15 passages
 * across the whole cycle, the ones where the sound-effect is
 * unusually concentrated."
 *
 * Each passage is anchored to a line range (Tennyson's own line
 * numbering within the idyll; the idyll's content uses `data-iotk-line`
 * attributes set by scripts/idylls/transform-book.ts). A short note
 * names the specific sound-technique — alliteration, vowel-music,
 * rhythmic slowing for pathos — without explaining the effect itself,
 * which the reader should experience.
 *
 * Flagged passages receive a subtle visual accent (left-margin mark)
 * only when the reader has enabled the "prosodic features" toggle;
 * the toggle also activates an automatic per-line alliteration
 * highlighter, mirroring the Beowulf mechanism but with a looser
 * threshold (3+ matches per line rather than 2+), because Tennyson
 * uses alliteration as texturing rather than as structural form.
 */

export interface ProsodyPassage {
  /** Chapter (0-indexed, matching ch-N.json and IDYLL_METADATA keys) */
  chapterIndex: number
  /** First and last line within the idyll */
  fromLine: number
  toLine: number
  /** Short descriptor for the tooltip / margin-mark label */
  technique: string
  /** One-sentence scholarly note for the prosody-panel list */
  note: string
}

export const PROSODY_PASSAGES: ProsodyPassage[] = [
  // ── Coming of Arthur ──────────────────────────────────────────────
  {
    chapterIndex: 1,
    fromLine: 402,
    toLine: 410,
    technique: "Long vowels, slowing",
    note: "Arthur's coronation speech — the pentameter slows under the weight of long vowels ('the old order changeth, yielding place to new'), the line rhythm enacting historical deceleration.",
  },

  // ── Gareth and Lynette ────────────────────────────────────────────
  {
    chapterIndex: 2,
    fromLine: 248,
    toLine: 280,
    technique: "Alliteration, bright registers",
    note: "The opening descriptions of Camelot — silver-sliver spires, the moonlit arches, the fountain-water. Tennyson's most sustained alliterative texturing at the cycle's bright morning, pairing s-sounds and l-sounds across the passage.",
  },
  {
    chapterIndex: 2,
    fromLine: 1180,
    toLine: 1220,
    technique: "Consonance, quickened pulse",
    note: "Gareth's final combat with Night-the-knight — Tennyson quickens the line with hard consonants and drops the vowel-music in favor of chopped pentameters, the first of his sound-changes-with-action in the cycle.",
  },

  // ── Merlin and Vivien ─────────────────────────────────────────────
  {
    chapterIndex: 6,
    fromLine: 170,
    toLine: 212,
    technique: "Sibilance, Vivien's voice",
    note: "Vivien's flattery of Merlin — Tennyson gives her a sibilant over-smoothed line-music that the reader can hear as excessive, artificial, oily. The sound-texture is the poem's most direct editorial judgment on the character.",
  },
  {
    chapterIndex: 6,
    fromLine: 940,
    toLine: 970,
    technique: "Thunderstorm, consonantal strike",
    note: "The storm in Broceliande at the moment Merlin yields the charm — consonantal thickness, hard plosives, the line-rhythm wrenched. Tennyson paints the storm by ear, not by picture.",
  },

  // ── Lancelot and Elaine — the signature sound-passages ───────────
  {
    chapterIndex: 7,
    fromLine: 998,
    toLine: 1015,
    technique: "Lyric insertion, vowel-song",
    note: "Elaine's song — 'Sweet is true love though given in vain, in vain' — a deliberately inserted lyric within the blank-verse narrative. The passage is built of long vowels and inner-rhyme echoes; one of the two or three most-imitated passages in Victorian poetry.",
  },
  {
    chapterIndex: 7,
    fromLine: 1340,
    toLine: 1395,
    technique: "Funeral-barge, slowing pentameter",
    note: "The barge bearing Elaine's body down the river to Camelot — Tennyson's most sustained ekphrastic sound-painting. Long open vowels, the pentameter dragged across its normal caesurae by liquid consonants, the whole passage slowed to the barge's own pace.",
  },

  // ── The Holy Grail ────────────────────────────────────────────────
  {
    chapterIndex: 8,
    fromLine: 400,
    toLine: 440,
    technique: "Temptation-vision, sensuous layering",
    note: "Percivale's temptation — the phantasmal pavilion and the beautiful woman. Tennyson's sound here is deliberately over-rich (the thick l-sounds, the sweet vowels, the feminine caesurae), and the ear tells the reader this is exactly what austerity would call a trap.",
  },
  {
    chapterIndex: 8,
    fromLine: 745,
    toLine: 790,
    technique: "Galahad's vision, luminous vowels",
    note: "Percivale's glimpse of Galahad in the chariot of fire — sustained high vowels, silver-sibilants, the line-music keyed to luminosity rather than weight. The sound carries the theological claim the text cannot quite state.",
  },

  // ── The Last Tournament ──────────────────────────────────────────
  {
    chapterIndex: 10,
    fromLine: 1,
    toLine: 30,
    technique: "Autumn rain, liquid consonants",
    note: "The opening — Dagonet dances like a withered leaf. Tennyson sets the whole idyll's melancholy in the sound-texture of the first thirty lines: liquid l's and r's, the rain-music, the pentameter dampened.",
  },
  {
    chapterIndex: 10,
    fromLine: 425,
    toLine: 460,
    technique: "Tristram's song, sardonic lyric",
    note: "Tristram's song at the tournament, a cynical inversion of the idyll's earlier lyric mode (cf. Elaine's song). The meter keeps the lyric form but the sound-texture is harsh — the contrast is the idyll's argument.",
  },

  // ── Guinevere ─────────────────────────────────────────────────────
  {
    chapterIndex: 11,
    fromLine: 550,
    toLine: 610,
    technique: "Arthur's departure, slowing caesurae",
    note: "After Arthur's long speech, his ride away from Almesbury — the pentameter is broken by pauses within the line (medial caesurae), slowing the departure and matching Guinevere's prostrate watching. One of Tennyson's most deliberate rhythmic effects.",
  },

  // ── Passing of Arthur — the bookend passages ─────────────────────
  {
    chapterIndex: 12,
    fromLine: 170,
    toLine: 220,
    technique: "Excalibur cast, sound-painting of water",
    note: "Bedivere finally flinging Excalibur into the lake — the arm rising, the great splash, the vanishing. This passage descends from Tennyson's 1833 'Morte d'Arthur' (the oldest passage in the cycle); its liquid sound-texture is so famous it has been imitated and parodied for 180 years.",
  },
  {
    chapterIndex: 12,
    fromLine: 360,
    toLine: 410,
    technique: "Avalon barge, numinous long vowels",
    note: "Arthur borne away — 'from the great deep to the great deep he goes.' The closing passage of the cycle, the cycle's most-quoted line. Tennyson keys the sound to long open vowels (great deep, goes) and suspends the pentameter, leaving the ending musically resolved but narratively unresolved.",
  },
]

/** Map from chapterIndex to its passages for fast lookup */
export const PROSODY_BY_CHAPTER: Map<number, ProsodyPassage[]> = (() => {
  const m = new Map<number, ProsodyPassage[]>()
  for (const p of PROSODY_PASSAGES) {
    const arr = m.get(p.chapterIndex) ?? []
    arr.push(p)
    m.set(p.chapterIndex, arr)
  }
  return m
})()
