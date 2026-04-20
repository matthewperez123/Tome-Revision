import type { Annotation } from "../types"

// ── Don Juan Canto II — hand-authored scholarly annotations ─────────────
// ch-3 in public/content/don-juan/ch-3.json. Canto II is 216 ottava rima
// stanzas — one of the longest cantos. It covers Juan's departure from
// Cadiz, the shipwreck (stanzas ~24–108), the lifeboat and the drawing
// of lots (the cannibalism of Pedrillo), Juan alone reaching shore, and
// his discovery by Haidée and Zoe at the canto's close (stanzas
// ~129–216). Byron researched the shipwreck scenes from real incidents
// (the *Méduse*, the *Peggy*, Sir John Gower's *Narrative*).
//
// Density: 6 annotations. Opus-authored per spec Part 4.

export const DON_JUAN_CANTO_2: Annotation[] = [
  // ── 1. Opening — "Oh ye! who teach the ingenuous youth" ──
  {
    id: "dj-2-opening-education",
    bookId: "don-juan",
    chapterNumber: 3,
    anchorText: "Oh ye! who teach the ingenuous youth of nations",
    anchorOccurrence: 1,
    title: "\"Oh ye! who teach the ingenuous youth\" — the educational satire opens Canto II",
    quotedPassage:
      "Oh ye! who teach the ingenuous youth of nations, / Holland, France, England, Germany, or Spain, / I pray ye flog them upon all occasions — / It mends their morals, never mind the pain.",
    passageReference: "Canto II, stanza 1 · DJ II.1",
    commentary: `Canto I closed with Juan expelled from Seville after the Julia scandal; Canto II opens with Byron's sardonic address to the pedagogues who will now take him in hand. The first stanza is a mock-apology to European schoolmasters: since the lesson of Canto I (a sixteen-year-old seduced by his mother's friend) was not sufficiently edifying, the next canto will offer a different kind of corrective education — namely, shipwreck, famine, and a Greek-island idyll.

The joke is at the expense of the whole early-19c genre of *Bildung* and moral-improvement literature. Byron's own education had been brutal (Harrow, then Cambridge with a tame bear in his rooms because the statutes forbade dogs), and his sympathy for the flogging pedagogues is zero. The couplet — "It mends their morals, never mind the pain" — lands with the particular Byronic cruelty that seems to admire the thing it mocks, a tone the reader should now recognize as characteristic.

The transition from this opening satire to the horror of the lot-drawing scene 25 stanzas later is one of Canto II's great tonal maneuvers. Byron sets the canto up as a moral fable and then writes it as a survival-cannibalism narrative. Both tones are the canto's, and both are real.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 2. The shipwreck — realism and its sources ──
  {
    id: "dj-2-shipwreck",
    bookId: "don-juan",
    chapterNumber: 3,
    anchorText: "Thought it would be becoming to die drunk",
    anchorOccurrence: 1,
    title: "The shipwreck — realism, black comedy, and the Méduse",
    quotedPassage:
      "The crew, who, ere they sunk, / Thought it would be becoming to die drunk. / \"Give us more grog,\" they cried, \"for it will be / All one an hour hence.\"",
    passageReference: "Canto II, stanzas 34–35 · DJ II.34–35",
    commentary: `Byron's shipwreck is not generic. Roughly eighty stanzas (II.24–108) work through the specific phases of a real sinking: the storm, the leak, the pumps, the cutting of the masts, the rum broken into by the desperate crew, the launching of boats too small to hold everyone, and the slow starvation in the open lifeboat. Byron researched from specific sources: Sir J.G. Dalyell's *Shipwrecks and Disasters at Sea* (1812), the survivor's narrative of the *Peggy* (1765), and — most recently and famously — the sinking of the French frigate *Méduse* (1816), whose raft Géricault was painting in Paris while Byron was drafting these stanzas in Venice.

The black comedy of "it would be becoming to die drunk" is Byron's signature move: treat the horror with comic timing so the horror lands harder. The crew's dignity-through-grog is funny, but it also exposes the whole 19c adventure-literature convention that sailors drown stoically; Byron's sailors drown drunk, because they are frightened men who have no other consolation. The same comic-horror doubling will organize the cannibalism scene at stanzas 72–77 and (much later) the storming of Ismail in Cantos VII–VIII.

Readers who know Géricault's *Raft of the Medusa* (1818–19, Louvre) will feel the proximity. Byron probably knew the painting; he certainly knew the story. The poem and the canvas are two treatments of the same Regency-period obsession with the spectacle of men thrown on the moral edge by the sea.`,
    crossReferences: [],
    tags: ["historical"],
  },

  // ── 3. The lot-drawing and Pedrillo's death ──
  {
    id: "dj-2-lots-pedrillo",
    bookId: "don-juan",
    chapterNumber: 3,
    anchorText: "The lots were made, and marked, and mixed, and handed",
    anchorOccurrence: 1,
    title: "The lot-drawing — Pedrillo's death and the limit of satire",
    quotedPassage:
      "The lots were made, and marked, and mixed, and handed, / In silent horror, and their distribution / Lulled even the savage hunger which demanded, / Like the Promethean vulture, this pollution; / None in particular had sought or planned it, / 'Twas Nature gnawed them to this resolution, / By which none were permitted to be neuter — / And the lot fell on Juan's luckless Tutor.",
    passageReference: "Canto II, stanza 75 · DJ II.75",
    commentary: `Pedrillo is Juan's tutor, introduced at the canto's opening as a comic figure seasick in his hammock. By stanza 75 the starving lifeboat crew has drawn lots, and the lot has fallen on him. The next two stanzas describe his death and the eating of his body. This sequence (II.72–77) is the most-debated passage in *Don Juan* and the limit case of Byron's comic tone.

The scholarly consensus is that Byron had researched real incidents — the *Peggy* (1765), the *Nautilus* (1807), and others where starving castaways drew lots. He did not invent the survival-cannibalism template; he imported it from the historical record. The brilliance of the stanzas is the cold formality with which he writes them. The line "The lots were made, and marked, and mixed, and handed" is four coordinate verbs in asyndeton (no conjunctions), ritual in its rhythm — the mechanical procedure of an administration carrying out an unthinkable act. The closing couplet — "None in particular had sought or planned it, / 'Twas Nature gnawed them to this resolution" — is almost gentle: no one is blamed; no one is exonerated; it is simply what starvation does.

The Promethean-vulture simile in line 4 is doing serious work. Prometheus's liver was eaten by a vulture daily as punishment for stealing fire; here the starving men's own hunger is the vulture, gnawing at them until they become cannibals. The mythological inversion gives the passage its cold Romantic grandeur. Byron is not mocking the horror — the horror is real, and the tone knows it.

This is the sequence that led early readers to call *Don Juan* immoral and that has, since about 1900, been recognized as one of the most courageous passages in the English long poem. The satirist does not look away from what satire can sometimes make possible.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Byron names the cross-reference in the next stanza (\"Remember Ugolino\"): Dante's Count Ugolino in Inferno XXXIII, locked in the Tower of Hunger with his sons and dying of starvation, whose ambiguously cannibalistic ending Dante leaves unresolved. Byron is inviting the comparison — his Pedrillo is a modern, maritime, anti-heroic Ugolino, and the comparison lets him claim the Dantean precedent for the most shocking passage in his own poem.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno, Canto XXXIII",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "historical"],
  },

  // ── 4. Ugolino reference ──
  {
    id: "dj-2-ugolino",
    bookId: "don-juan",
    chapterNumber: 3,
    anchorText: "Remember Ugolino",
    anchorOccurrence: 1,
    title: "\"Remember Ugolino condescends to eat the head of his arch-enemy\"",
    quotedPassage:
      "And if Pedrillo's fate should shocking be, / Remember Ugolino condescends / To eat the head of his arch-enemy / The moment after he politely ends / His tale.",
    passageReference: "Canto II, stanza 83 · DJ II.83",
    commentary: `Five stanzas after Pedrillo is killed, Byron preempts his reader's objection with a Dante reference. Ugolino, in *Inferno* XXXIII, tells Dante his own story of being starved to death in a tower with his four sons — and the passage ends with the famously ambiguous line "then fasting had more power than grief" (*poscia più che 'l dolor, poté 'l digiuno*), which Dante scholarship has debated for seven centuries as either meaning Ugolino also starved or meaning he ate his dead sons. The canto's last image is of Ugolino gnawing the skull of Archbishop Ruggieri, his political enemy, in the frozen ninth circle of Hell.

Byron's joke is precise. He points to Dante — whom by 1819 no one could accuse of immorality; Dante was the unimpeachable Christian poet of the *Romantic* revival — and says: the greatest Christian poem also eats people. If Dante is a moral poet, the cannibalism stanza of *Don Juan* is morally legible. If the stanza in *Don Juan* is indecent, *Inferno* XXXIII is indecent too. The defense is mischievous and also serious: Byron is saying that high literature has always gone here, and that the 19c politeness that pretends otherwise is hypocrisy.

The word *condescends* in the anchor line is the tell — Ugolino *condescends* to the cannibalism (a mock-aristocratic verb choice), just as the starving sailors *condescend* to Pedrillo. Byron's Dante reference is not reverent homage; it is a claim of peerage. The English comic epic is as willing to name what Italian sacred narrative named.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Dante's Ugolino, Inferno XXXIII, is the explicit source Byron names. Both passages dramatize the collapse of human distinction under starvation; Byron's modern maritime setting is a secular translation of Dante's medieval political one.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno, Canto XXXIII, lines 1–90",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 5. Haidée's introduction ──
  {
    id: "dj-2-haidee-intro",
    bookId: "don-juan",
    chapterNumber: 3,
    anchorText: "He had an only daughter, called Haidée",
    anchorOccurrence: 1,
    title: "Haidée — the Greek island and the beginning of the idyll",
    quotedPassage:
      "He had an only daughter, called Haidée, / The greatest heiress of the Eastern Isles; / Besides, so very beautiful was she, / Her dowry was as nothing to her smiles: / Still in her teens, and like a lovely tree / She grew to womanhood, and between whiles / Rejected several suitors, just to learn / How to accept a better in his turn.",
    passageReference: "Canto II, stanza 128 · DJ II.128",
    commentary: `Juan, the sole survivor of the lifeboat, has washed up on a Greek island. He is found unconscious on the beach by the young Haidée and her Ionian attendant Zoe. Byron introduces Haidée here, twenty stanzas before she and Juan exchange a word, and the tone of the poem shifts completely: the black comedy of the shipwreck is behind us; the canto is about to become an idyll.

Haidée is the daughter of Lambro, the pirate chief of the island — but the reader will not learn that until much later. For now she is simply the most beautiful young woman on an uninhabited coast, the rescuer of a beautiful young man. Byron's palette color for her (sea-pearl with dawn-gold undertone, in the reader legend) is trying to catch this register: she is the poem's one unironic love, and the next two cantos are the only passages in *Don Juan* where Byron's satirical intelligence is suspended.

The closing couplet — "Rejected several suitors, just to learn / How to accept a better in his turn" — is the last trace of the satirical narrator before the idyll begins. From stanza 129 onward, Byron writes the Haidée sequence with a tenderness the rest of the poem will not see again until the very different tenderness he shows Aurora Raby in the English cantos. The experience of reading Cantos II–IV unfolds as the progressive quieting of the narrator's own voice — he steps aside for the idyll, and then, when Lambro returns at the end of III and the idyll is destroyed in IV, he steps back in to mourn.

Read Haidée's introduction, and hold it against Julia's introduction in Canto I (stanza 56, the Moorish-blood stanza). Byron is deliberately calibrating the difference. Julia has a history — grandmothers, lineage, a marriage, class. Haidée has none of that; she has only her own youth. The simpler portrait is doing the heavier work. Byron is building, for the one time in the poem, a figure who is not written as a social type.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The young woman who finds a shipwrecked man on a beach and takes him home is Homer's Nausicaa (Odyssey VI). Byron's Haidée is the Odyssey's Nausicaa transposed to a 19c Aegean island — the same mythic template, treated with Romantic tenderness rather than archaic formality.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book VI",
        targetBookId: "the-odyssey",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 6. Virtuoso rhyme — spaniel / planned it ──
  {
    id: "dj-2-rhyme-spaniel",
    bookId: "don-juan",
    chapterNumber: 3,
    anchorText: "Knowing, (dogs have such intellectual noses!)",
    anchorOccurrence: 1,
    title: "Virtuoso rhyme & the faithful spaniel — comedy inside disaster",
    quotedPassage:
      "Don José's spaniel — which had been Don José's, / His father's, whom he loved, as ye may think, / For on such things the memory reposes / With tenderness — stood howling on the brink, / Knowing, (dogs have such intellectual noses!) / No doubt, the vessel was about to sink.",
    passageReference: "Canto II, stanzas 35–36 · DJ II.35–36",
    commentary: `The spaniel stanzas land in the middle of the sinking — and Byron gives the dog its own miniature death scene, with genuine tenderness, in the middle of the canto's horror. The line "dogs have such intellectual noses!" is both a virtuoso comic rhyme (*noses / reposes* in the stanza's B-rhyme position) and a sincere acknowledgment that the dog is the character in this scene most certain of what is coming.

Byron's relationship to dogs was not metaphorical. His Newfoundland Boatswain, who died of rabies in 1808, is buried at Newstead Abbey under an epitaph Byron wrote that is one of his most serious short poems. When, in *Don Juan*, a spaniel stands howling on the edge of a sinking ship and Byron stops the narrative to give the dog its due, the reader should hear it as personal. The canto's horror is not cheapened by the dog's cameo; the dog's cameo concentrates the horror.

This is a useful early example of Byron's capacity to keep two tones alive in the same passage. A solemn epic tradition would either give the dog a dignified elegiac moment or omit it entirely. Byron does both and neither: the rhyme is comic, the feeling is real, the position of the stanza (inside the sinking) makes the comedy a kind of mercy for the reader.`,
    crossReferences: [],
    tags: ["linguistic"],
  },
]
