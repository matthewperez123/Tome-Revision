import type { Annotation } from "../types"

// ── Don Juan Canto V — hand-authored scholarly annotations ──────────────
// ch-6 in public/content/don-juan/ch-6.json. Canto V (159 stanzas) opens
// the harem episode: Juan, sold in the Constantinople slave market, is
// bought by a eunuch acting for the Sultana Gulbeyaz; smuggled into the
// seraglio disguised as a woman; and taken before the Sultana, who
// demands his love. Juan — still mourning Haidée — refuses.

export const DON_JUAN_CANTO_5: Annotation[] = [
  {
    id: "dj-5-opening-amatory",
    bookId: "don-juan",
    chapterNumber: 6,
    anchorText: "When amatory poets sing their loves",
    anchorOccurrence: 1,
    title: "\"When amatory poets sing their loves\" — the warning that opens Canto V",
    quotedPassage:
      "When amatory poets sing their loves / In liquid lines mellifluously bland, / And pair their rhymes as Venus yokes her doves, / They little think what mischief is in hand.",
    passageReference: "Canto V, stanza 1 · DJ V.1",
    commentary: `Canto IV closed with Haidée's death; Canto V opens with Juan in the Constantinople slave market, and Byron prefaces the new episode with a warning about love-poetry. The first stanza names Ovid (exiled from Rome for *Ars Amatoria*) and Petrarch (the supreme European love-poet) as cautionary examples: the prettier the verse, the greater the mischief in what it celebrates or disguises.

The move prepares the reader for the harem episode. What follows is not another idyll but a Turkish slave market, a eunuch's bribe, female dress forced on Juan, and the Sultana's autocratic appetite — an *anti*-idyll, satirical and orientalist, where the "love" on offer is power exercised on a body. The tonal reset is complete within eight lines.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },
  {
    id: "dj-5-slave-market",
    bookId: "don-juan",
    chapterNumber: 6,
    anchorText: "I wish to G‑d that somebody would buy us",
    anchorOccurrence: 1,
    title: "The Constantinople slave market — \"I wish to God that somebody would buy us\"",
    quotedPassage:
      "\"But I have lived too long to be surprised / At anything (although the eunuch seems to eye us) / I wish to G‑d that somebody would buy us.\"",
    passageReference: "Canto V, stanza 12 · DJ V.12",
    commentary: `The speaker is Juan's English fellow-slave Johnson, a seasoned survivor who treats the situation with sardonic comedy — the line lands as a black joke that also records the actual legal-commercial situation: the slaves *want* to be bought because a buyer means shelter and employment, while remaining unsold means continued chained exposure in a courtyard.

Byron had walked through the actual Constantinople slave markets in 1810 with Hobhouse. The details in these stanzas — the assessing buyers, the grouping of slaves by nationality and skill, the eunuchs moving among the stock — are observational, not generic orientalism. The anger behind the comic surface is real and Byron's abolitionist sympathies are consistent with it.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
  {
    id: "dj-5-most-men-slaves",
    bookId: "don-juan",
    chapterNumber: 6,
    anchorText: "Most men are slaves",
    anchorOccurrence: 1,
    title: "\"Most men are slaves\" — Johnson's comparative-slavery argument",
    quotedPassage:
      "\"But after all, what is our present state? / 'Tis bad, and may be better — all men's lot: / Most men are slaves, none more so than the great.\"",
    passageReference: "Canto V, stanza 17 · DJ V.17",
    commentary: `The line is doing two things at once: (a) mocking the pretensions of aristocratic "freedom" (the great are more constrained by etiquette, debt, dependency than any labourer), and (b) genuinely arguing that the category *slavery* is broader than its chattel form. This is the 18c–19c radical-Whig position — Blake's, Shelley's, Cobbett's — articulated inside a comic ottava rima stanza.

Byron's contribution is the form: getting the argument into the closing couplet gives it memorability and aristocratic legitimacy. The argument comes from inside the aristocracy: Byron is Lord Byron, peer, and its force is that he knows the great from the inside and reports they are enslaved too. The canto's orientalist surface is real, but under it runs a consistent political claim: *all* hierarchical societies contain coercion; the Turkish seraglio is not exotic to the East; the British reader should feel the same horror about the British factory and the British marriage market.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "dj-5-gulbeyaz",
    bookId: "don-juan",
    chapterNumber: 6,
    anchorText: "Gulbeyaz, though she knew not why",
    anchorOccurrence: 1,
    title: "Gulbeyaz — the Sultana's desire and its refusal",
    quotedPassage:
      "Gulbeyaz, though she knew not why, / Felt an odd glistening moisture in her eye.",
    passageReference: "Canto V, stanza 117 · DJ V.117",
    commentary: `The Sultana Gulbeyaz — the favorite wife of the Sultan — has had Juan bought and smuggled into her apartments. She demands that he love her. Juan, still in mourning for Haidée, refuses. The canto's central dramatic confrontation is this refusal.

Byron's Gulbeyaz is a complicated figure. She has absolute power (she can have Juan executed on a word; the eunuch has warned him). She is beautiful, accustomed to being obeyed. She is *also* lonely: the Sultan sees her rarely, and the harem women exist as decorative property. Her demand on Juan is the demand of a person used to getting what she wants — and Juan's refusal breaks her, briefly, into ordinary human grief. The "odd glistening moisture" restores her dignity: the satire does not deny her the humanity the plot pretends to strip from her. Her palette color in the reader legend (imperial crimson) is trying to capture this: power fused with thwarted desire.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
]
