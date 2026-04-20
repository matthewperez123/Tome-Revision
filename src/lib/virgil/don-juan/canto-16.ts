import type { Annotation } from "../types"

// ── Don Juan Canto XVI — hand-authored scholarly annotations ────────────
// ch-17 in public/content/don-juan/ch-17.json. Canto XVI (123 stanzas,
// including interpolated ballad lines that raise the per-stanza line
// count). The Black Friar appears — twice — and the canto pivots on
// "mobility," Byron's French-term self-portrait of rapid emotional
// change. The poem's last completed canto.

export const DON_JUAN_CANTO_16: Annotation[] = [
  {
    id: "dj-16-antique-persians",
    bookId: "don-juan",
    chapterNumber: 17,
    anchorText: "antique Persians taught three useful things",
    anchorOccurrence: 1,
    title: "\"The antique Persians taught three useful things\" — a civilizational joke",
    quotedPassage:
      "The antique Persians taught three useful things, / To draw the bow, to ride, and speak the truth, / This was the mode of Cyrus, best of kings — / A mode adopted since by modern youth. / Bows have they, generally with two strings; / Horses they ride without remorse or ruth; / At speaking truth perhaps they are less clever, / But draw the long bow better now than ever.",
    passageReference: "Canto XVI, stanza 1 · DJ XVI.1",
    commentary: `The opening stanza is characteristic Byronic civilizational satire. The reference is to Herodotus (*Histories* I.136): the Persians taught their sons three things — to ride, to shoot, and to speak the truth. Byron preserves the formula and flips its closing term: modern youth can do the first two ("bows with two strings" — the beau's *two strings to his bow*, meaning he has alternative lovers or political positions; horsemanship they retain) but cannot do the third. Instead of *speaking* truth, they *draw the long bow* — 19c British slang for "exaggerate," "lie handsomely."

The joke works as both civilizational and personal satire. Civilizationally, Byron is arguing that modern European aristocracy has retained the decorative accomplishments of the ancient Persian nobility (archery, riding) while abandoning the ethical foundation (truth-telling); the decline is ornamental-preserved, moral-lost. Personally, Byron is naming something close to his own practice — he himself was an accomplished horseman and a decent marksman, and his relation to "truth" was, in his own letters, explicitly casual when the truth was inconvenient to his reputation or his peers.

Cyrus the Great (c. 600–530 BCE), founder of the Achaemenid Persian Empire, is "best of kings" in Herodotus and in Xenophon's *Cyropaedia* — the model of the ideal ruler that Renaissance and Enlightenment political theory kept returning to. Byron's use of him here is not flippant; it is a genuine invocation of a classical ideal from which the modern world has fallen away.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "dj-16-black-friar",
    bookId: "don-juan",
    chapterNumber: 17,
    anchorText: "Black Friar of late",
    anchorOccurrence: 1,
    title: "The Black Friar — the apparition appears",
    quotedPassage:
      "\"Black Friar of late.\" / \"What Friar?\" said Juan; and he did his best / To put the question with an air sedate, / Or careless; but the effort was not valid / To hinder him from growing still more pallid.",
    passageReference: "Canto XVI, stanza 31 · DJ XVI.31",
    commentary: `The canto's central event: Juan, wandering the gallery of Norman Abbey at night, meets the Black Friar — a hooded figure in Dominican black, the ghost of the ballad Adeline sang in Canto XV. The apparition appears twice; the second appearance (at the canto's end) is resolved into the Duchess of Fitz-Fulke, who has disguised herself as the ghost to visit Juan in the small hours. But the first apparition is not resolved — Byron leaves the reader (and Juan) genuinely uncertain whether the first Friar was the Duchess or a real spectral presence.

The structural cleverness of the canto is that it gives the reader *two* supernatural options and refuses to adjudicate between them. The Duchess's prank-Friar works as a naturalistic explanation; but the narrative voice treats the first apparition with enough gravity that a reader cannot simply collapse both into the prank. Byron is playing with the ghost-story genre (very fashionable in the 1820s — *Frankenstein* was from the 1816 Villa Diodati contest, and the Gothic novel was at its peak) but refusing to let the genre's machinery resolve cleanly.

The Canto XVII fragment picks up the morning after the second apparition and was moving toward, apparently, further supernatural comedy involving Aurora Raby and the Friar's return. Byron's plan for the ghost-story resolution is not known. The unfinished canto leaves both the apparition and the Duchess's prank in suspension — which is, in its way, the ghost story's most honest ending.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Hamlet Act I — the appearance of the father's ghost on the battlements. Byron's ghost-story is in a comic register, but the machinery is Shakespearean: an ambiguous apparition in a great house, appearing twice, interpreted by the young male protagonist with difficulty. Byron's Juan is in some ways an inversion of Hamlet — a young man to whom the ghost of the past comes not as a duty but as an erotic comedy.",
        workTitle: "Hamlet",
        workAuthor: "William Shakespeare",
        passageReference: "Act I, scenes i and iv",
        targetBookId: "hamlet",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "dj-16-mobility",
    bookId: "don-juan",
    chapterNumber: 17,
    anchorText: "mobility",
    anchorOccurrence: 1,
    title: "\"Mobility\" — the most important concept for understanding Byron",
    quotedPassage:
      "Mobility, / A thing of temperament and not of art, / Though seeming so, from its supposed facility; / And false — though true; for, surely, they're sincerest / Who are strongly acted on by what is nearest.",
    passageReference: "Canto XVI, stanza 97 · DJ XVI.97",
    commentary: `The canto introduces — and Byron attaches a footnote to — the French term *mobilité*, which Byron here anglicises as *mobility*. The term names a specific psychological condition: the capacity to shift rapidly between strong emotional states, to be genuinely moved by whatever is present, and to leave behind (without repression or betrayal) the state that was present a moment before. Byron applies it to Adeline — she is *mobile* in this sense, moved by each thing in turn, and the mobility is neither insincerity nor superficiality but a genuine temperament.

This is the single most important self-analytical term in Byron's work. He knew himself to be mobile in exactly this way — tender with Haidée, brutal with Wellington, tender again with Aurora, all within the same week, all genuinely felt. The conventional 19c view would call this inconsistency or theatrical insincerity. Byron's footnote (in the published poem) insists it is neither; it is a real psychological type, more common among women and actors than among "settled" men, and it is the quality that makes a character like Adeline (and a poet like himself) seem shallow to judges who have never felt more than one thing at a time.

The stanza is one of Byron's most generous descriptions of a mind that is also his own. The closing couplet — "for, surely, they're sincerest / Who are strongly acted on by what is nearest" — is a philosophical defence of the mobile character against the charge of insincerity. To be strongly moved by what is before you, now, is not insincerity; it is the most fully present form of feeling.

For readers trying to understand why *Don Juan* swings so violently between satire and tenderness, between digression and narrative, between savagery and grief, stanza XVI.97 is the key. The poem is written by a mobile sensibility, and it is best read as the record of a mind that does not pretend to unity.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "dj-16-duchess-fitz-fulke",
    bookId: "don-juan",
    chapterNumber: 17,
    anchorText: "Duchess of Fitz-Fulke",
    anchorOccurrence: 1,
    title: "The Duchess of Fitz-Fulke — the poem's last coup de théâtre",
    quotedPassage:
      "The Duchess of Fitz-Fulke played with her veil, / And looked at Juan hard, but nothing uttered.",
    passageReference: "Canto XVI, stanza 107 · DJ XVI.107",
    commentary: `The canto's final movement resolves the ghost-apparition into the Duchess of Fitz-Fulke: she has disguised herself as the Black Friar, visited Juan's chamber in the small hours, and (the canto leaves it implicit) spent the night there. The morning stanzas leave Juan looking "wan and worn" — the ambiguity of whether from a real supernatural encounter or from a night with the Duchess is deliberate, and deliberately unresolved.

The Duchess is the English cantos' most worldly figure. Married to a Duke she ignores, she is a type of Regency libertine: beautiful, calculating, socially invulnerable because of rank, capable of costuming herself as a ghost for sexual access and enjoying the joke. Her palette color in the reader legend (warm flushed rose) is trying to catch the register: not Adeline's English-rose-with-silver (which has moral pretension) but the rose of a woman for whom pretension is beneath her.

Fitz-Fulke is Byron's comic parting-shot at the aristocracy he is anatomizing. She embodies the argument: the English upper class's real erotic life takes place behind costumes and country-house theatricals, and the moral frame of public society is a fiction that the class itself does not take seriously. The Black Friar prank is both a local joke and the canto's satirical thesis.

Canto XVII's fragment opens the morning after. The poem then breaks off.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
]
