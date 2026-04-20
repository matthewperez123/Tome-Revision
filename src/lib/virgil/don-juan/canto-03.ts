import type { Annotation } from "../types"

// ── Don Juan Canto III — hand-authored scholarly annotations ────────────
// ch-4 in public/content/don-juan/ch-4.json. Canto III (111 stanzas) is
// the canto of the Haidée idyll's apex and its first shadow: Lambro
// has returned to the island but not yet revealed himself, and the
// canto ends with him crossing his own threshold unseen. Embedded in
// the canto is "The Isles of Greece," Byron's most anthologized short
// poem — sung as the bard's performance at Haidée's feast — in a
// different meter from the surrounding ottava rima.
//
// Density: 5 annotations. Opus-authored per spec Part 4.

export const DON_JUAN_CANTO_3: Annotation[] = [
  // ── 1. "Hail, Muse! et cetera" — the mock-invocation ──
  {
    id: "dj-3-hail-muse",
    bookId: "don-juan",
    chapterNumber: 4,
    anchorText: "Hail, Muse! et cetera",
    anchorOccurrence: 1,
    title: "\"Hail, Muse! et cetera\" — the invocation Byron refuses to write",
    quotedPassage:
      "Hail, Muse! et cetera. — We left Juan sleeping, / Pillowed upon a fair and happy breast, / And watched by eyes that never yet knew weeping, / And loved by a young heart, too deeply blest / To feel the poison through her spirit creeping, / Or know who rested there, a foe to rest.",
    passageReference: "Canto III, stanza 1 · DJ III.1",
    commentary: `Every canto of *Don Juan* picks up a recognizable epic convention and handles it differently. Canto III opens with the invocation — and Byron dispatches the whole Homeric-Virgilian-Miltonic apparatus in three words: "Hail, Muse! et cetera." The reader is asked to supply the rest of the formula, which Byron could not be bothered to write.

The joke is precise. Every previous serious epic required the invocation to solicit divine assistance; every previous serious epic's reader submitted to the formula. Byron's "et cetera" acknowledges the convention and refuses the submission. He is the first great English poet to do this and to keep the poem itself fully serious afterwards — because the remainder of the stanza is not comic at all. Lines 2–6 modulate immediately into the tenderest mode the narrator has yet used about Haidée: "a young heart, too deeply blest / To feel the poison through her spirit creeping, / Or know who rested there, a foe to rest."

The "poison" is Juan — though he does not know it and would not wish it. The foreshadowing is immediate: this is the canto in which the idyll begins to be undone, and the first stanza already tells us so. Byron's comic demolition of the invocation gives way, within a single stanza, to the first announcement of the tragedy. The tonal range — "et cetera" to "a foe to rest" — is the whole poem in compressed form.`,
    crossReferences: [
      {
        type: "parody",
        description:
          "Every previous epic invocation — Homer's 'Tell me, O Muse,' Virgil's 'Arma virumque cano,' Milton's 'Of Man's first disobedience' — is the target. Byron does not reject the invocation; he reduces it to the minimum formula. The reduction is itself the argument: the Muse has been invoked often enough; the poem can proceed.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book I, opening",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: "Tell me, O Muse, of that sagacious man",
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 2. The Isles of Greece — framing and the interpolation ──
  {
    id: "dj-3-isles-of-greece",
    bookId: "don-juan",
    chapterNumber: 4,
    anchorText: "The Isles of Greece, the Isles of Greece",
    anchorOccurrence: 1,
    title: "\"The Isles of Greece\" — Byron's most anthologized short poem, embedded here",
    quotedPassage:
      "The Isles of Greece, the Isles of Greece! / Where burning Sappho loved and sung, / Where grew the arts of War and Peace, / Where Delos rose, and Phoebus sprung! / Eternal summer gilds them yet, / But all, except their Sun, is set.",
    passageReference: "Canto III, \"The Isles of Greece,\" stanza 1 (at DJ III.86)",
    commentary: `At Haidée's feast, a wandering bard performs before the guests. Byron interpolates, in place of Byron's own voice for sixteen stanzas, a shorter lyric in a different meter — six-line stanzas of iambic tetrameter rhyming ABABCC (note: not ottava rima). This is "The Isles of Greece," and since the early 19c it has been extracted from *Don Juan* and printed as a standalone poem in every English anthology that includes Byron.

The lyric is addressed to modern Greece, occupied by the Ottoman Empire. The speaker — the bard Byron imagines for Haidée's feast, but transparently Byron himself — catalogs the ancient glories (Marathon, Salamis, Sappho, Anacreon, Pericles) and measures the present servitude against them. "Eternal summer gilds them yet, / But all, except their Sun, is set." The closing stanzas explicitly call for revolution: "Place me on Sunium's marbled steep, / Where nothing, save the waves and I, / May hear our mutual murmurs sweep; / There, swan-like, let me sing and die."

Byron means it personally. He had fought the Ottoman Empire only with his purse (donations to the Greek cause) when he wrote this canto in the winter of 1819–20. Four years later, having spent a great portion of his fortune outfitting a brigade and sailed to Missolonghi, he died there in April 1824, preparing to fight. The Isles of Greece is the rehearsal for that decision. The figure who performs the lyric — a bard dismissed by the narrator in the stanzas that follow as a venal "trimmer" who sings whatever patron pays him — is Byron's own self-portrait at one remove, and the ironic frame is part of the meaning: the bard sings the revolutionary lyric cynically, because he will sing anything for his supper; but the lyric is the truth anyway.

The surrounding ottava rima returns at stanza III.87. Readers should let the lyric and the frame speak to each other: the lyric is not neutralized by its cynical performer, and the performer is not ennobled by the lyric. Both are real, and the uneasy fit between them is Byron's mature politics.`,
    crossReferences: [],
    tags: ["historical", "literary-influence", "philosophical"],
  },

  // ── 3. Marathon and the Persians' grave ──
  {
    id: "dj-3-marathon",
    bookId: "don-juan",
    chapterNumber: 4,
    anchorText: "The mountains look on Marathon",
    anchorOccurrence: 1,
    title: "\"The mountains look on Marathon\" — the stanza that became a political slogan",
    quotedPassage:
      "The mountains look on Marathon — / And Marathon looks on the sea; / And musing there an hour alone, / I dreamed that Greece might still be free; / For standing on the Persians' grave, / I could not deem myself a slave.",
    passageReference: "Canto III, \"The Isles of Greece,\" stanza 3 (at DJ III.86)",
    commentary: `The single most quoted stanza of "The Isles of Greece," and probably the single most politically consequential stanza Byron ever wrote. It was translated, set to music, and carried into battle by Greek revolutionaries in the War of Independence (1821–29), which erupted within two years of the poem's publication. The stanza is cited in the histories of every subsequent European national-liberation movement: Mazzini quotes it; Kossuth quotes it; Yeats borrows its structure.

The rhetorical move is a physical gesture: stand on the battlefield where the ancient Athenians defeated the Persians (490 BCE), stand on the grave of the invaders, and the very ground refuses to let you feel like a slave. Byron's logic is not abstract. He had actually stood at Marathon, in 1810, during his first tour of Greece with Hobhouse. The stanza records the experience and generalizes it: the place itself is an argument against tyranny.

"I dreamed that Greece might still be free" was the 19c equivalent of a revolutionary slogan. By 1823 it was on Greek banners. By 1824 Byron had gone to Missolonghi to help make it true, and died there before the dream was realized. The modern Greek state's independence was declared in 1830, six years after Byron's death; the new nation regarded him, correctly, as one of its founders. The most-read tourist plaque in 19c Europe was the Byron memorial at Missolonghi; Greek children studied the Isles of Greece lyric by heart in schools from 1830 until well into the 20c.

This is one of the rare passages in English verse where a specific stanza provably shaped a specific political outcome. Read it with that knowledge.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── 4. Lambro's return — the pirate-chief is home ──
  {
    id: "dj-3-lambro-return",
    bookId: "don-juan",
    chapterNumber: 4,
    anchorText: "Lambro, our sea-solicitor",
    anchorOccurrence: 1,
    title: "Lambro's return — the pirate-chief is home, and neither Juan nor Haidée knows",
    quotedPassage:
      "Lambro, our sea-solicitor, who had / Much less experience of dry land than Ocean, / On seeing his own chimney-smoke, felt glad; / But not knowing metaphysics, had no notion / Of the true reason of his not being sad, / Or that of any other strong emotion.",
    passageReference: "Canto III, stanza 23 · DJ III.23",
    commentary: `Lambro is Haidée's father, the pirate-chief of the island, presumed drowned or captive while Juan and Haidée's idyll has been unfolding. Canto III's narrative crisis is his quiet reappearance, unseen, at the margins of his own house. The canto ends with Lambro outside the threshold of the feast his daughter is giving with a young stranger she has taken as her lover — and Byron spares us, until Canto IV, the moment of recognition.

The phrase "sea-solicitor" is Byronic wordplay: Lambro, as a pirate, solicits tribute at sea. But the legal-professional term *solicitor* — a man who represents you in court — also reduces piracy to a genteel trade, which lets Byron set Lambro up as a figure the reader can sympathize with. Lambro is not a monster; he is a father coming home. What the idyll looks like from inside is different from what it looks like to a man whose daughter has given herself and his inheritance to an unknown shipwreck survivor.

The color Byron's palette gives Lambro (deep obsidian, in the reader legend) is doing the work of announcing his position: Lambro will be the destroyer of the idyll in Canto IV, but he is also, morally, the one who is wronged. Byron's achievement in Cantos III–IV is to make both things true without collapsing either. Haidée's love is the most tender thing in the poem; Lambro's return is the most justified intrusion. The poem does not arbitrate between them; it lets the tragedy take its course.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Odysseus returning to Ithaca unrecognized, observing his own household disordered by the suitors, is the closest classical template. Byron had Homer in mind: Lambro is a modern, morally ambiguous Odysseus — but the 'suitor' in his own house is his daughter's lover, and the daughter is not Penelope. Byron inverts the returning-hero template into tragedy.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books XIII–XVII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 13,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 5. The bard as "trimmer" — Byron's satire on himself ──
  {
    id: "dj-3-bard-trimmer",
    bookId: "don-juan",
    chapterNumber: 4,
    anchorText: "Dash down yon cup of Samian wine",
    anchorOccurrence: 1,
    title: "The bard who sings the lyric — a cynical self-portrait",
    quotedPassage:
      "Dash down yon cup of Samian wine! / Thus sung, or would, or could, or should have sung, / The modern Greek, in tolerable verse; / If not like Orpheus quite, when Greece was young, / Yet in these times he might have done much worse.",
    passageReference: "Canto III, stanza 87 · DJ III.87",
    commentary: `The sixteen-stanza lyric ends; the ottava rima resumes; Byron immediately pulls the reader back out with a joke. "Thus sung, or would, or could, or should have sung, / The modern Greek" — an Anglo-Saxon-style accumulation of modal verbs that refuses to commit the bard to actually having performed the lyric. The bard is, in the next stanzas, dismissed as a "trimmer" — a political weathercock who has sung royalist hymns to the Ottomans and republican ones to the Venetians and revolutionary ones to any nationalist audience.

Byron's inclusion of this satirical frame around his own most famous political lyric is not cowardice; it is sophistication. He is admitting in advance that political poetry is suspect — that any writer who will sing for a living will sing whatever pays — and that his own authority to write the revolutionary call is therefore not automatic. He has to earn it. The four years between writing this canto and dying at Missolonghi are the earning. The ironic frame is a promissory note Byron redeemed with his life.

The passage also allows Byron to include the lyric in *Don Juan* without seeming to break the poem's comic-satirical register. A straight patriotic hymn would have been tonally impossible; a hymn performed by a venal bard the narrator then dismisses is a hymn the comic narrator can include without contradiction. The poem absorbs the lyric without ceasing to be a satire. Very few other poets would have thought to frame the operation this way, and fewer still could have pulled it off.

Samian wine is the wine of Samos, the Aegean island. "Dash down yon cup" is the lyric's final repudiation-and-toast: no more pretending; pour it out; take up arms.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
]
