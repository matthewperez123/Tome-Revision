/**
 * Don Juan — per-canto metadata used by the reader's header chrome.
 *
 * Each canto gets:
 *   - a Roman numeral (Byron's own numbering)
 *   - a one-sentence scholarly argument (who/what/where, no spoilers
 *     beyond what a 19c reader would have known from table-of-contents
 *     style summaries)
 *   - an "opening" — the first line of the canto's first stanza, to
 *     use as a subtle epigraph
 *   - an optional structural note — e.g. the Isles of Greece lyric
 *     interpolation in Canto III, or the Black Friar ballad in XVI.
 *
 * The chapter files are zero-indexed in the reader:
 *   ch-0  = Introduction (editor's preface; NOT Byron's Dedication,
 *           which is absent from the Standard Ebooks source)
 *   ch-1  = Preface to Cantos VI, VII, VIII
 *   ch-2  = Canto I
 *   ...
 *   ch-18 = Canto XVII (fragment — 14 stanzas only)
 *
 * Byron died in Greece in April 1824 with Canto XVII still in progress.
 * The fragment ends mid-scene. Honored, not papered over.
 */

export const DON_JUAN_CANTO_COUNT = 17
export const DON_JUAN_FRAGMENT_CANTO = 17

/** Maps ch-N index → canto number (I–XVII), or null for front matter. */
export function cantoNumberForChapter(chapterIndex: number): number | null {
  // ch-0 = Introduction, ch-1 = Preface, ch-2 = Canto I, ...
  if (chapterIndex < 2) return null
  return chapterIndex - 1
}

export const ROMAN: Record<number, string> = {
  1:  "I",   2:  "II",   3:  "III",  4:  "IV",   5:  "V",
  6:  "VI",  7:  "VII",  8:  "VIII", 9:  "IX",   10: "X",
  11: "XI",  12: "XII",  13: "XIII", 14: "XIV",  15: "XV",
  16: "XVI", 17: "XVII",
}

export const CANTO_ARGUMENTS: Record<number, string> = {
  1:
    "Byron rejects the epic roster of modern heroes and adopts the legendary Don Juan — " +
    "recounts his Sevillian birth, his mother Donna Inez's cold Evangelical education, " +
    "and his first affair with the married Donna Julia, which ends in public scandal.",
  2:
    "Juan is shipped to Cadiz and abroad; his vessel founders in a storm; " +
    "the survivors draw lots in the lifeboat and consume the tutor Pedrillo; " +
    "Juan alone is cast ashore on a Greek island, where the young Haidée finds him.",
  3:
    "Haidée and Juan live in idyll while her pirate father Lambro is believed lost at sea. " +
    "A feast is held; a wandering bard sings “The Isles of Greece”; Lambro returns, unseen, " +
    "and the canto ends as he crosses the threshold of his own house.",
  4:
    "Lambro reveals himself; Juan is wounded and taken captive aboard the pirate ship; " +
    "Haidée, pregnant and abandoned, dies of grief. Byron mourns her in his own voice — " +
    "the emotional core of the poem.",
  5:
    "Juan is sold in the Constantinople slave market, bought by a eunuch for the Sultana Gulbeyaz, " +
    "and smuggled into the harem disguised as a woman. He refuses the Sultana's advances.",
  6:
    "Juan, still disguised, sleeps among the harem women; scandal breaks at dawn; " +
    "the Sultana, enraged, orders him drowned in the Bosphorus.",
  7:
    "Juan escapes Constantinople and is swept into the Russian siege of Ismail under " +
    "Field-Marshal Suwarrow. Byron's anti-war argument begins — the glory of the gazettes " +
    "measured against real slaughter.",
  8:
    "The storming of Ismail. Byron names real generals, real regiments, real atrocities, " +
    "and indicts military glory while telling its story with savage clarity. " +
    "Juan rescues an orphaned Turkish girl, Leila, from the carnage.",
  9:
    "Juan carries news of the victory to Catherine's court in St Petersburg. " +
    "The canto opens with Byron's sustained attack on the Duke of Wellington " +
    "— the post-Waterloo settlement and its price.",
  10:
    "Juan is installed as Catherine's new favorite. Byron satirizes the empress's court, " +
    "the favorites system, and the politics of imperial Russia. " +
    "Juan falls ill and is sent as an envoy to England.",
  11:
    "Juan arrives in London. Byron compares the poet's old London to the present, " +
    "sets down his most philosophically despairing stanzas on fame and vanity, " +
    "and launches the sustained English portrait of Cantos XI–XVII.",
  12:
    "Juan moves in London society; Byron digresses on money, marriage, old age, " +
    "and the prosaic foundations of aristocratic life.",
  13:
    "Juan is invited to Norman Abbey, the country seat of Lord Henry and Lady Adeline " +
    "Amundeville. Byron's thesis-statement attack on English hypocrisy runs through the canto.",
  14:
    "Country-house society — the hunt, the dinner, the talk. Adeline fears Juan may be " +
    "ensnared by the Duchess of Fitz-Fulke and resolves to watch over him.",
  15:
    "Adeline sings an old ballad of the Black Friar of Norman Abbey — a phantom said " +
    "to walk the cloisters before family misfortunes. The supernatural enters the comedy.",
  16:
    "Juan, wandering the gallery at night, meets the Black Friar. The apparition appears " +
    "twice; the canto pivots on “mobility” (Byron's French term for Adeline's rapid " +
    "emotional range — and a deliberate self-portrait).",
  17:
    "Fragment — 14 stanzas. Byron introduces a reflection on contradictions in character, " +
    "begins a morning scene at Norman Abbey, and breaks off. He died at Missolonghi, " +
    "preparing to fight for Greek independence, in April 1824.",
}

/** The first line of each canto, used as a subtle epigraph under the Roman numeral. */
export const CANTO_OPENINGS: Record<number, string> = {
  1:  "I want a hero: an uncommon want",
  2:  "Oh ye! who teach the ingenuous youth of nations",
  3:  "Hail, Muse! et cetera.—We left Juan sleeping",
  4:  "Nothing so difficult as a beginning",
  5:  "When amatory poets sing their loves",
  6:  "“There is a tide in the affairs of women”",
  7:  "O love! O glory! what are ye who fly",
  8:  "Oh blood and thunder! and oh blood and wounds!",
  9:  "Oh, Wellington! (or 'Villainton'—for Fame)",
  10: "When Newton saw an apple fall, he found",
  11: "When Bishop Berkeley said “there was no matter,”",
  12: "Of all the barbarous middle ages, that",
  13: "I now mean to be serious;—it is time",
  14: "If from great nature's or our own abyss",
  15: "Ah!—What should follow slips from my reflection",
  16: "The antique Persians taught three useful things",
  17: "The world is full of orphans: firstly, those",
}

/** Optional structural notes — interpolated lyrics, ballads, etc. */
export const CANTO_STRUCTURAL_NOTES: Partial<Record<number, string>> = {
  3:
    "Includes the interpolated lyric “The Isles of Greece,” the bard's song at Haidée's feast. " +
    "The lyric is in a different meter from the surrounding ottava rima and is Byron's most " +
    "anthologized short poem.",
  16:
    "Includes the ballad of the Black Friar, a ghost-story interpolation in a separate meter. " +
    "Byron was moving toward a supernatural comedy that Canto XVII's fragment was developing.",
  17:
    "Canto XVII breaks off at stanza 14. The poem ends mid-movement; Byron died at Missolonghi " +
    "in April 1824. The fragment is the truest ending he could have given it.",
}

/** A minor structural flag — the poem opens with editor's front matter before Byron's text. */
export const FRONT_MATTER_CHAPTERS: Record<number, { title: string; note: string }> = {
  0: {
    title: "Introduction",
    note:
      "A 19c editor's introduction (not Byron's Dedication to Southey, which the Standard " +
      "Ebooks source omits). Useful for historical context on composition and reception.",
  },
  1: {
    title: "Preface to Cantos VI, VII, and VIII",
    note:
      "Byron's own prose preface to the anti-war cantos of the siege of Ismail — " +
      "published July 1823. A sharp, sustained attack on Castlereagh; unusually un-ironic.",
  },
}
