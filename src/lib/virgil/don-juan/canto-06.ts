import type { Annotation } from "../types"

// ── Don Juan Canto VI — hand-authored scholarly annotations ─────────────
// ch-7 in public/content/don-juan/ch-7.json. Canto VI (120 stanzas):
// Juan, still disguised as the odalisque "Juanna," is placed among the
// harem women for the night. In the small hours he is summoned to one
// of the sleeping chambers. Morning brings scandal; Gulbeyaz, enraged,
// orders him drowned. Byron closes the canto with a detour into
// warfare, setting up the Ismail cantos that follow.

export const DON_JUAN_CANTO_6: Annotation[] = [
  {
    id: "dj-6-opening-tide",
    bookId: "don-juan",
    chapterNumber: 7,
    anchorText: "tide in the affairs of men",
    anchorOccurrence: 1,
    title: "\"There is a tide in the affairs of men\" — Byron borrows from Brutus",
    quotedPassage:
      "\"There is a tide in the affairs of men, / Which — taken at the flood,\" — you know the rest, / And most of us have found it now and then.",
    passageReference: "Canto VI, stanza 1 · DJ VI.1",
    commentary: `The opening is a Shakespearean quotation — Brutus in *Julius Caesar* IV.iii.218, arguing for marching on Antony's forces at Philippi. Byron quotes only the famous phrase and tags it with "you know the rest," trusting the reader to complete the passage. The rhetorical move is the same as Canto III's "Hail, Muse! et cetera" — compressing a canonical formulation to its recognizable fragment and letting the reader do the work of expansion.

The substance of the stanza is the women's version of Brutus's claim. Byron's narrator observes that *tides in the affairs of men* matter less than the moment at which a woman makes a decision — and the rest of the canto bears this out: the whole plot-engine of Canto VI is a woman (Gulbeyaz) making a decision (to order Juan killed) on the basis of scandal, and the comic catastrophe of Juan's near-drowning at the canto's close follows directly from her decision. Brutus's theory of historical opportunity is recast as a theory of domestic pique.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Shakespeare's Julius Caesar IV.iii.218: 'There is a tide in the affairs of men, / Which, taken at the flood, leads on to fortune.' Byron's 'you know the rest' is confident the reader will complete the quotation.",
        workTitle: "Julius Caesar",
        workAuthor: "William Shakespeare",
        passageReference: "Act IV, scene iii, line 218",
        targetBookId: "julius-caesar",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "dj-6-lolah-dudu",
    bookId: "don-juan",
    chapterNumber: 7,
    anchorText: "Lolah, Katinka",
    anchorOccurrence: 1,
    title: "The harem trio — Lolah, Katinka, Dudù",
    quotedPassage:
      "Lolah, Katinka, and Dudù — in short / (To save description), fair as fair can be / Were they, according to the best report, / Though differing in stature and degree.",
    passageReference: "Canto VI, stanza 40 · DJ VI.40",
    commentary: `Byron introduces the three harem women with whom Juan will share the night — Lolah (from Georgia), Katinka (from the Caucasus), Dudù (from Anatolia). The trio is genuinely ethnographic: the Ottoman harem did draw its women from across the Black Sea and the Balkans, and the names are period-accurate. Byron's "to save description" is a gesture of comic economy — he declines the full oriental-inventory mode and collapses it into a throwaway line.

The canto's most-read sequence is Juan's night with Dudù (stanzas 62–82) — the harem's innocent-minded beauty who, mistakenly given Juan as a sleeping companion (neither realising their mistake), wakes in the morning having experienced an unsettling dream. Byron writes the sequence as high comedy, but the joke has an edge: Dudù, unlike Gulbeyaz, has not chosen the encounter, and the morning's scandal falls on her more than on Juan. The comic tone does not quite absolve the setup of its coercive mechanics, and careful readers should register the asymmetry: Byron's narrator laughs, but he also shows Dudù bewildered and frightened at dawn.

The three women are essentially type-characters and do not return in the poem. But their names persist in the Byronic reception of *Don Juan* — the "Dudù" sequence is one of the most-anthologized in 19c readers' selections.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "dj-6-gulbeyaz-wrong",
    bookId: "don-juan",
    chapterNumber: 7,
    anchorText: "Gulbeyaz was extremely wrong",
    anchorOccurrence: 1,
    title: "\"Gulbeyaz was extremely wrong\" — the narrator's judgment",
    quotedPassage:
      "Gulbeyaz was extremely wrong; I own it, / I deplore it, I condemn it; / But I detest all fiction even in song, / And so must tell the truth, howe'er you blame it.",
    passageReference: "Canto VI, stanza 112 · DJ VI.112",
    commentary: `After the morning scandal — Dudù waking with Juan in her bed — Gulbeyaz orders both of them executed. The narrator steps in to judge her and immediately half-retracts: "Gulbeyaz was extremely wrong" is followed by an apparent owning and condemning, but the fourth line pivots to "I detest all fiction even in song" — Byron's narrator, as always, more interested in telling the truth than in being a moralist. The stanza is one of Byron's clearest statements of his satirical method: the poem reserves the right to report what people do, including things the narrator disapproves of, without pretending to fix them.

The stanza's closing couplet — "Her reason being weak, her passions strong" (not included in the anchor excerpt, but worth seeking out in the reader) — is standard 19c shorthand for a character driven by appetite rather than judgment. Byron's Gulbeyaz, over Cantos V and VI, has become the portrait of autocratic appetite-in-power: a woman who can order deaths to relieve her jealousy. The palette color (imperial crimson) now reads more sharply than in Canto V; the comic sympathy of the Sultana's first tears is gone.

Juan escapes (the canto's narrative machinery is contrived — Baba the eunuch, a Russian raid, a confusion — but Byron is already eager to be done with the seraglio). By canto's end Juan is out of Constantinople and on his way to the Russian army besieging Ismail.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "dj-6-warfare-pivot",
    bookId: "don-juan",
    chapterNumber: 7,
    anchorText: "The Muse will take a little touch at warfare",
    anchorOccurrence: 1,
    title: "The pivot to warfare — from harem to siege",
    quotedPassage:
      "(Although his situation now seems strange, / And scarce secure) — as such digressions are fair, / The Muse will take a little touch at warfare.",
    passageReference: "Canto VI, stanza 120 · DJ VI.120",
    commentary: `The canto's final couplet announces the shift. Byron is signing off the harem episode and warning the reader that the next two cantos will be something different: warfare, specifically the Russian siege of the Ottoman fortress of Ismail in December 1790. The phrase "a little touch at warfare" is deliberately understated — in fact the Ismail cantos (VII and VIII) are the most sustained anti-war argument in English verse, not a "little touch" at all. The comic preface misrepresents the coming weight on purpose, so that the horror lands harder when it arrives.

This is a structural feature of *Don Juan* that repays attention: Byron often announces his upcoming material in a comic register that understates it, and the reader's registration of the mismatch (between the flippant preface and the serious section that follows) is part of the effect. The shipwreck was prefaced this way in Canto II; Haidée's death was prefaced this way in Canto IV; the Ismail siege is prefaced this way in Canto VI. The pattern is Byronic: the narrator is an ironist who will never announce a solemn thing solemnly, which is why the solemn things hit as hard as they do.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
]
