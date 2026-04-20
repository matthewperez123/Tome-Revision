import type { Annotation } from "../types"

// ── Don Juan Canto I — hand-authored scholarly annotations ─────────────
// Standard Ebooks text (E.H. Coleridge editorial lineage; 1833 Murray
// collected edition descent). Byron's Dedication to Southey is *absent*
// from this source and is therefore not annotated here; flagged for
// re-ingestion from a McGann-derived edition in a later pass.
//
// Chapter index: ch-2 in public/content/don-juan/ch-2.json.
// Canto I is 222 ottava rima stanzas. Anchors are stanza-level where the
// poem invites a frame annotation, and line-level where a specific
// phrase requires close reading (e.g. "Man's love is of man's life a
// thing apart"). Anchor strings match the Standard Ebooks HTML exactly,
// including curly apostrophes (U+2019); the overlay's normalize pass
// covers quote/dash variants.
//
// Density: 8 annotations. Opus-authored per spec Part 4 model allocation.

export const DON_JUAN_CANTO_1: Annotation[] = [
  // ── 1. Opening — "I want a hero" and the rejection of modern fame ──
  {
    id: "dj-1-opening",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "I want a hero: an uncommon want",
    anchorOccurrence: 1,
    title: "\"I want a hero\" — the epic tradition deflated in eight lines",
    quotedPassage:
      "I want a hero: an uncommon want, / When every year and month sends forth a new one, / Till, after cloying the gazettes with cant, / The age discovers he is not the true one; / Of such as these I should not care to vaunt, / I'll therefore take our ancient friend Don Juan — / We all have seen him, in the pantomime, / Sent to the Devil somewhat ere his time.",
    passageReference: "Canto I, stanza 1 · DJ I.1",
    commentary: `The first stanza is Byron's manifesto. Every previous epic in this catalog — Homer, Virgil, Dante, Milton — opens with an invocation that asserts the gravity of the subject. Byron opens by announcing he can't find one.

"I want a hero" is deliberately low-register: *want* in its plain English sense of "lack," not its literary sense of "desire." The line pretends to be a practical problem rather than a poetic announcement. Stanzas 2–4 then cycle through the actual candidates — Wellington, Nelson, Napoleon, the guillotined French revolutionaries — and dismisses all of them as "cloying the gazettes with cant." The modern heroes have been consumed by the newspaper; they cannot carry epic weight.

Byron's comic solution is to reach for a legendary figure the readers already know from the stage (Mozart's *Don Giovanni*; Shadwell's *Libertine*; Delpini's pantomime) — "We all have seen him, in the pantomime, / Sent to the Devil somewhat ere his time." The couplet's snap is doing two jobs: it admits the hero is a stock pantomime villain, and it quietly signals that Byron's Juan will *not* go to the Devil, or not in the way the stage sends him there. The poem will make something different of the figure.

The tradition this stanza talks back to is immediate: Milton begins with Man; Virgil with arms; Homer with anger and with wanderings. Byron begins by confessing he cannot begin the way they do. The poem that follows is the confession worked out in 16,000 lines.`,
    crossReferences: [
      {
        type: "parody",
        description:
          "Every classical and Christian epic in the catalog opens with a serious invocation. Byron's opening is the deliberate negation. The line 'I want a hero' is funny because the reader hears Virgil's 'Arma virumque cano' behind it and registers the demotion. Byron is not dismissing the tradition; he is refusing its ceremonial move while still writing in its form.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, line 1",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: "Arms, and the man I sing",
      },
      {
        type: "parody",
        description:
          "Milton's opening period is sixteen lines of suspended syntax announcing Man as the subject of the new Christian epic. Byron's opening stanza is eight lines that collapse that height back into 'I want a hero' — English plain speech where Milton reaches for suspended Latinate grandeur. The reader who knows Milton hears the deliberate demotion.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 1–16",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Of Man's first disobedience",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 2. Ottava rima — the form itself, as Byron's comic engine ──
  {
    id: "dj-1-ottava-rima",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "our ancient friend Don Juan",
    anchorOccurrence: 1,
    title: "Ottava rima — six rhymes that set up, two rhymes that snap",
    quotedPassage:
      "Of such as these I should not care to vaunt, / I'll therefore take our ancient friend Don Juan — / We all have seen him, in the pantomime, / Sent to the Devil somewhat ere his time.",
    passageReference: "Canto I, stanza 1, lines 5–8 · DJ I.1.5–8",
    commentary: `*Ottava rima* (Italian, "eighth-rhyme") is the form Ariosto used for *Orlando Furioso* and Tasso for *Gerusalemme Liberata*. Eight lines of iambic pentameter rhyming ABABABCC: six lines of alternating rhyme that accumulate a thought or image, closed by a final couplet that comments on, deflates, or twists what the six built.

Byron is one of the very few poets to write it natively in English, and the one who built the most out of its comic potential. Read the last two lines of almost any stanza in the poem as a punchline: the first six lines are the setup, the couplet is the snap. Here in stanza 1 the setup lists failed heroes; the couplet says the pantomime Juan will do, and admits why. Throughout the poem, the closing couplet will do the real argumentative work — insulting a rival, puncturing a sentiment, confessing a fact Byron would not state outside the rhyme.

Toggle "closing couplets" in the reader header to surface the structure visually. The feature is off by default because the form is not an etymological test but a joke, and jokes land better unmarked on first reading.`,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 3. Donna Inez — Byron's revenge portrait of Annabella Milbanke ──
  {
    id: "dj-1-inez",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "Her favourite science was the mathematical",
    anchorOccurrence: 1,
    title: "Donna Inez — the portrait of Lady Byron",
    quotedPassage:
      "Her favourite science was the mathematical, / Her noblest virtue was her magnanimity, / Her wit (she sometimes tried at wit) was Attic all, / Her serious sayings darkened to sublimity; / In short, in all things she was fairly what I call / A prodigy — her morning dress was dimity, / Her evening silk, or, in the summer, muslin, / And other stuffs, with which I won't stay puzzling.",
    passageReference: "Canto I, stanza 12 · DJ I.12",
    commentary: `Donna Inez, Juan's cold, learned, evangelical mother, is a thinly disguised portrait of Byron's estranged wife Annabella Milbanke — specifically of her mathematical bent ("the Princess of Parallelograms," Byron called her in letters), her moral self-seriousness, and the formal Anglican piety she shared with her family. The marriage had ended in 1816 amid Annabella's accusations, Byron's rumored incest with his half-sister Augusta, and a separation that drove Byron permanently from England. He never saw his daughter Ada again.

The satire is savage and personal. Each of Inez's "virtues" is turned into an indictment: the mathematical science means joyless abstraction; the magnanimity is a pose; the Attic wit is pretended; the serious sayings darken into self-importance. The closing couplet about morning dimity and evening silk pretends to be a descriptive aside — and is really a shrug: of course I know her wardrobe; I was married to her.

The poem published this portrait while Annabella was alive and while their daughter was in her care. Murray and Hobhouse tried to persuade Byron to cut or soften the stanzas; he refused. "They said I had used her ill; — I am now using her worse." (Letter to Moore, 1819.) The Inez stanzas are one of the bitterest private scores ever settled in a major English poem, and Byron's willingness to do it in public is one of the things that made *Don Juan* scandalous on publication.

Modern readers who know nothing of the Byrons will still feel the temperature of the stanza; readers who know the biography will feel it is almost indecent. Both readings are correct.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 4. Donna Julia — introduction of the first affair ──
  {
    id: "dj-1-julia-intro",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "The darkness of her Oriental eye",
    anchorOccurrence: 1,
    title: "Donna Julia — Moorish blood and the set-up for the affair",
    quotedPassage:
      "The darkness of her Oriental eye / Accorded with her Moorish origin; / (Her blood was not all Spanish; by the by, / In Spain, you know, this is a sort of sin;) / When proud Granada fell, and, forced to fly, / Boabdil wept: of Donna Julia's kin / Some went to Africa, some stayed in Spain — / Her great great grandmamma chose to remain.",
    passageReference: "Canto I, stanza 56 · DJ I.56",
    commentary: `Julia is twenty-three, married to the fifty-year-old Don Alfonso, and about to fall (without quite admitting it, even to herself) for the sixteen-year-old Juan. Before Byron narrates any of that, he gives her this ancestry. The "Oriental eye" and "Moorish origin" are period shorthand for a kind of beauty coded as non-Spanish, sensual, and slightly dangerous — and Byron is both exploiting the coding and mocking it. The parenthetical "in Spain, you know, this is a sort of sin" is the narrator rolling his eyes at the prejudice he has just invoked.

The reference to Boabdil — the last Moorish king of Granada, who wept as he left the Alhambra in 1492 when the city fell to Ferdinand and Isabella — gives Julia a lineage with actual historical weight. She is not merely attractive; she descends from the defeated. The poem will treat her seriously as a person, not only as Juan's first mistake.

Byron's own travels in Andalusia (1809) and his study of Moorish Spain show everywhere in this canto. He knew the culture he was writing into; the orientalism here is knowledgeable rather than generic, even when (as in stanza 56) it is also playful about its own tropes. The narrator's palette color (ink-blue, in the reader's legend) is doing slightly different work in these stanzas than in stanza 1: the tone has shifted from satirical demolition to a fond, slightly indulgent portraiture.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 5. The marriage digression — "Man's love is of man's life a thing apart" ──
  {
    id: "dj-1-mans-love",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "Man's love is of man's life a thing apart",
    anchorOccurrence: 1,
    title: "\"Man's love is of man's life a thing apart\" — the most quoted line in the poem",
    quotedPassage:
      "Man's love is of man's life a thing apart, / 'Tis a Woman's whole existence; Man may range / The Court, Camp, Church, the Vessel, and the Mart; / Sword, Gown, Gain, Glory, offer in exchange / Pride, Fame, Ambition, to fill up his heart, / And few there are whom these can not estrange; / Men have all these resources, / We but one, / To love again, and be again undone.",
    passageReference: "Canto I, stanza 194 · DJ I.194",
    commentary: `These eight lines are probably the most often quoted stanza in Byron's entire output. They are spoken by Donna Julia in her farewell letter — Byron is ventriloquizing a woman writing to the young man who has ruined her, and in the first line he gives her a distinction that is both devastating and seductive.

"Man's love is of man's life a thing apart" — the spatial word *apart* is doing the argument. A man's love lives in a separate compartment from the rest of his life (his work, his ambition, his other loves); a woman's love is coextensive with her existence. This is not simply 19c sexual-essentialism, though it has often been read that way. It is a specific observation about the structure of a life in a society where a man could have a career, a regiment, a Parliament seat, an ambition, and a mistress — and a woman of Julia's class could have none of those, only her marriage and whatever affection colored or ruined it.

The line has been used for two centuries as a kind of pop-sentimental truth about love and gender — but in context it is a letter of accusation, not a confession of weakness. Julia is telling Juan exactly what he is walking away from and what he has cost her. The form of the stanza — Byronic ottava rima's comic engine repurposed for the most serious speech Byron ever gives a woman character — is itself the argument: *this* voice, with *this* prosody, demands to be heard with the same seriousness we would give the Milton or the Virgil the poem began by displacing.

Keep the stanza in mind through Haidée (Cantos II–IV), through Gulbeyaz (V), through Catherine (IX–X), through Adeline (XI–XVII). Byron returns to Julia's claim and tests it — sometimes by confirming, more often by complicating. The poem does not finally settle whether "Man's love is of man's life a thing apart," but it never stops asking.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dido at the end of Aeneid IV is the classical template — a woman destroyed by love for a man who walks away to pursue his larger destiny. Byron knew Virgil's Book IV intimately. Julia's letter is a comic, domestic, epistolary Dido.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV",
        targetBookId: "the-aeneid",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 6. Julia's letter — farewell and the letter's opening ──
  {
    id: "dj-1-julia-letter",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "They tell me",
    anchorOccurrence: 1,
    title: "Julia's letter — stanzas 192–197, the emotional close of Canto I",
    quotedPassage:
      "They tell me 'tis decided you depart: / 'Tis wise — 'tis well, but not the less a pain; / I have no further claim on your young heart, / Mine is the victim, and would be again: / To love too much has been the only art / I used; — I write in haste, and if a stain / Be on this sheet, 'tis not what it appears; / My eyeballs burn and throb, but have no tears.",
    passageReference: "Canto I, stanza 192 · DJ I.192",
    commentary: `Juan has been discovered in Julia's bedroom, publicly disgraced, and sent abroad by his mother to repair the scandal. Julia is consigned to a convent by her husband. From the convent she writes Juan this letter — six stanzas of verse epistle (192–197) that close Canto I. The letter has the exact prosody of the poem around it, but the tonal shift is total: the sardonic narrator steps entirely aside and lets Julia speak.

The opening stanza is technically superb. "They tell me 'tis decided you depart" is in the passive-reportorial — Julia's fate is being told *to* her; she has no agency. The closing couplet — "My eyeballs burn and throb, but have no tears" — is a physiological detail that does more emotional work than any amount of sentimental adjective would: she has cried past the point where crying is still possible.

The closing couplet of stanza 194 ("Man's love is of man's life a thing apart, / 'Tis a Woman's whole existence") is the letter's thesis. Stanzas 195–197 work out the consequences: she accepts her fate, refuses to reproach him, and insists she will remember him "when the world shall be between us" — a line Byron's own circumstances had recently made literal for him, separated as he was from England and from his daughter.

These six stanzas are the reason Canto I does not read as satire alone. Byron was a great comic poet, but the letter forces the reader to acknowledge he could also do something Swift and Pope could not: a woman's interior life, in verse, without condescension. The rest of *Don Juan* — through Haidée, through Aurora, through the mature Byron of the English cantos — depends on this early demonstration that Byron's voice can do more than mock.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 7. "What is the end of Fame" — the first great digression ──
  {
    id: "dj-1-end-of-fame",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "What is the end of Fame",
    anchorOccurrence: 1,
    title: "\"What is the end of Fame?\" — the digression as the poem's real argument",
    quotedPassage:
      "What is the end of Fame? 'tis but to fill / A certain portion of uncertain paper: / Some liken it to climbing up a hill, / Whose summit, like all hills, is lost in vapour; / For this men write, speak, preach, and heroes kill, / And bards burn what they call their \"midnight taper,\" / To have, when the original is dust, / A name, a wretched picture and worse bust.",
    passageReference: "Canto I, stanza 218 · DJ I.218",
    commentary: `Canto I's closing movement is a string of digressions Byron openly labels — "I've half a mind to tumble down to prose, / But verse is more in fashion — so here goes" (221). Before the canto ends, he files through the great Romantic-age preoccupations: fame, youth, ambition, money, old age, death. Each stanza is eight lines; each closing couplet is a small deflation.

Stanza 218 is the most often anthologized of the batch. "What is the end of Fame? 'tis but to fill / A certain portion of uncertain paper" reduces the entire Romantic cult of posterity to a materialist joke: fame is ink on paper, and paper burns. The closing couplet — "To have, when the original is dust, / A name, a wretched picture and worse bust" — lands as a snap against the very commemoration mania Byron himself was subject to (the Phillips portrait you may be seeing on this book's cover is one of several; there were already at least a dozen Byron busts by 1819).

This is the rhythm of the whole poem: narrative, then digression, then back to narrative. Byron's great readers (Eliot, Auden, Calvino) have all pointed out that the digressions are the poem's real philosophical work. Juan's plot is the occasion; the narrator's voice in passages like this is what makes *Don Juan* a major poem rather than a very long picaresque.

Use the reader's canto-level navigation to return to this stanza — it's a touchstone for every subsequent canto's digressive passages.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 8. Virtuoso rhyme — "intellectual / henpecked you all" ──
  {
    id: "dj-1-rhyme-intellectual",
    bookId: "don-juan",
    chapterNumber: 2,
    anchorText: "hen-pecked you all",
    anchorOccurrence: 1,
    title: "Virtuoso rhyme — \"intellectual / henpecked you all\"",
    quotedPassage:
      "But — Oh! ye lords of ladies intellectual, / Inform us truly, have they not hen-pecked you all?",
    passageReference: "Canto I, stanza 22, closing couplet · DJ I.22",
    commentary: `One of Byron's signature moves is the deliberately outrageous multi-word rhyme — a stretch so comic it has to be called attention to. The couplet of stanza 22 is the earliest famous example in *Don Juan*: *intellectual* forced into rhyme with *henpecked you all*. The rhyme is almost a shrug at itself — you can hear Byron grinning as he writes it, because the only way to make the second phrase rhyme is to enjamb "you all" as a single sound with a deliberately awkward stress.

The content doubles the joke. The four lines are an attack on the bluestocking wives who dominate their intellectual husbands, and the whole attack lands on a rhyme that is itself conspicuously *un*-intellectual — a rhyme a sober critic might call vulgar. The form and content collapse into the same gag.

Throughout the poem Byron will reach for these: *Aristotle / bottle*, *new one / true one*, *gunnery / nunnery* (Canto VIII), *to Rome / entombed 'em*. Target: roughly 40–60 of these across the 17 cantos, one or two per canto annotated for the reader. The feature is called out here in Canto I so that in subsequent cantos readers can learn to listen for it unassisted.

The couplet highlight toggle (in the reader header) will surface the structural ABABAB-CC break when enabled; this annotation points to *what* to listen for inside that structure.`,
    crossReferences: [],
    tags: ["linguistic"],
  },
]
