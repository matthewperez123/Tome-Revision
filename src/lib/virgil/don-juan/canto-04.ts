import type { Annotation } from "../types"

// ── Don Juan Canto IV — hand-authored scholarly annotations ─────────────
// ch-5 in public/content/don-juan/ch-5.json. Canto IV (117 stanzas) is
// the breaking of the idyll: Lambro reveals himself; Juan is wounded,
// captured, and shipped away; Haidée — pregnant, severed from Juan —
// loses her reason, falls into a twelve-day fever, and dies. The canto
// is the poem's emotional core.
//
// Density: 5 annotations. Opus-authored per spec Part 4.

export const DON_JUAN_CANTO_4: Annotation[] = [
  // ── 1. Opening — "Nothing so difficult as a beginning" ──
  {
    id: "dj-4-opening",
    bookId: "don-juan",
    chapterNumber: 5,
    anchorText: "Nothing so difficult as a beginning",
    anchorOccurrence: 1,
    title: "\"Nothing so difficult as a beginning\" — the Lucifer-fall opening",
    quotedPassage:
      "Nothing so difficult as a beginning / In poesy, unless perhaps the end; / For oftentimes when Pegasus seems winning / The race, he sprains a wing, and down we tend, / Like Lucifer when hurled from Heaven for sinning.",
    passageReference: "Canto IV, stanza 1 · DJ IV.1",
    commentary: `Canto IV is the canto in which Haidée dies, and Byron signals the tonal weight of what is coming in the very first stanza — by naming Lucifer. The reference is calibrated: Milton's Satan hurled from Heaven is the archetypal fall from grace, and Byron's image of Pegasus (the poet's winged horse) spraining a wing in mid-race invokes the same descent.

Read the stanza as programmatic. The canto will be a falling motion: from the idyll's height (Canto III's feast, the bard's lyric) to the ground of Haidée's death. The difficulty of the beginning the narrator confesses to is real — Byron could not have found it easy to write Haidée's death, and stanza 1 registers the difficulty honestly before starting.

The Lucifer allusion is also the first Paradise Lost cross-reference of the canto. Byron knew Milton intimately and his Satan-sympathies are explicit elsewhere (see *Cain: A Mystery*, 1821). The fallen-angel figure will haunt Canto IV: Juan as Adam-cast-out, Haidée as unfallen Eve now fallen, Lambro as the angry God of the garden. The Miltonic template is not invoked solemnly — nothing in *Don Juan* ever is — but the tonal permission is claimed. Byron is telling the reader that the next 117 stanzas have a weight the Juan-plot alone could not license.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Paradise Lost I.44–49, Satan 'hurl'd headlong flaming from th' Ethereal Skie.' Byron's stanza names Lucifer explicitly and invokes the cadence of Milton's opening book. The Haidée canto that follows treats the idyll's end as a fall, and Milton's is the template.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 44–49",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Him the Almighty Power",
      },
      {
        type: "compare",
        description:
          "Biographical link — Villa Diodati, June 1816. In the summer Byron was exiled from England he rented the Villa Diodati on Lake Geneva; his companions were Percy and Mary Shelley, Claire Clairmont (carrying Byron's daughter Allegra), and Byron's physician John Polidori. On a wet June night Byron proposed each write a ghost story. Mary's became *Frankenstein* (published 1818); Polidori's became *The Vampyre* (1819), the first English vampire novel. Both are Byronic in lineage — *Frankenstein*'s creature reads *Paradise Lost* and demands to know why his creator has made him; Polidori's vampire is a Byron-portrait. Byron himself abandoned his fragment, and wrote *Don Juan* instead. The three-way cluster — Milton's Satan → Byron's Byronic narrator → Mary Shelley's Creature — is one of the most consequential creative chains in English letters; Canto IV's Lucifer opening sits at its center.",
        workTitle: "Frankenstein",
        workAuthor: "Mary Shelley",
        passageReference: "Villa Diodati, June 1816 (not a textual passage — a biographical link)",
        targetBookId: "frankenstein",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological", "historical"],
  },

  // ── 2. The idyll's last moment ──
  {
    id: "dj-4-last-idyll",
    bookId: "don-juan",
    chapterNumber: 5,
    anchorText: "Haidée and Juan thought not of the dead",
    anchorOccurrence: 1,
    title: "The idyll's last moment — before Lambro reveals himself",
    quotedPassage:
      "Haidée and Juan thought not of the dead — / The Heavens, and Earth, and Air, seemed made for them: / They found no fault with Time, save that he fled; / They saw not in themselves aught to condemn: / Each was the other's mirror, and but read / Joy sweetened by each smile.",
    passageReference: "Canto IV, stanza 11 · DJ IV.11",
    commentary: `Before the storm breaks, Byron gives the lovers one last stanza of the idyll. The structural cruelty of placing this stanza here — four stanzas before Lambro's public revelation, eleven stanzas before Juan is wounded and taken — is deliberate. The reader already knows what is coming (Canto III ended with Lambro at the threshold); Haidée and Juan do not. Byron lets them have their final undisturbed happiness *inside our foreknowledge*, which is the mechanism by which the reader's grief is constructed.

"Each was the other's mirror, and but read / Joy sweetened by each smile" — the line compresses the entire Romantic theory of love (the beloved as the self reflected and completed) into six iambic feet. Byron is not a poet usually credited with this kind of sentimental acuity, and the line is often quoted against the grain of Byron's reputation for brittleness. But the Haidée canto is the answer to the caricature: Byron could write sincerity when a sequence required it, and he could write it with the prosodic precision of his more satirical passages.

Note that the narrator is silent of digression here. The ink-blue Byronic voice that dominates most of the poem is almost absent across Cantos III–IV; the narrator recedes so the tragedy can unfold. When he returns, at stanza 74, it is to mourn. Between this last-idyll stanza and that later mourning-stanza lies Haidée's whole death.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 3. Lambro reveals himself ──
  {
    id: "dj-4-lambro-revelation",
    bookId: "don-juan",
    chapterNumber: 5,
    anchorText: "fixed upon the pair",
    anchorOccurrence: 1,
    title: "Lambro reveals himself — the recognition scene",
    quotedPassage:
      "And starting, she awoke, and what to view? / Oh! Powers of Heaven! what dark eye meets she there? / 'Tis — 'tis her Father's — fixed upon the pair!",
    passageReference: "Canto IV, stanza 34 · DJ IV.34",
    commentary: `Haidée, lying with Juan, wakes to see her father at the foot of the bed. The scene is compressed into two and a half lines. Byron refuses to elaborate the horror — he lets the recognition be the whole event.

The dramatic form of the scene is recognition (Greek *anagnorisis*), the classical device Aristotle names in the *Poetics* as the central turn of tragedy. Every major recognition-tragedy in the Western tradition is built around the moment when one character realizes the identity of another and the previous relation becomes impossible: Oedipus recognizing his mother; Odysseus revealing himself to Penelope; Isolde recognizing the sword-notch. Byron gives the *anagnorisis* to the daughter, not the father. It is Haidée who sees, and in her seeing the world collapses: the idyll, the prospect of marriage, the prospect of legitimacy for the child she is carrying, the possibility of continuing to be her father's daughter — all gone in a dash.

The punctuation of the line is Byronic performance. "'Tis — 'tis her Father's — fixed upon the pair" uses the em-dashes as small collapses, the rhythm of breath catching. The three short phrases — 'Tis — 'tis her Father's — fixed upon the pair — are the shape of Haidée's realization. Read them aloud; the pacing is the whole drama.

Within 20 stanzas, Juan will be wounded, bound, and carried away to a ship bound for the Turkish slave markets. Haidée will not see him again.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },

  // ── 4. Haidée's death ──
  {
    id: "dj-4-haidee-death",
    bookId: "don-juan",
    chapterNumber: 5,
    anchorText: "She died, but not alone",
    anchorOccurrence: 1,
    title: "Haidée's death — the emotional core of the poem",
    quotedPassage:
      "She died, but not alone; she held, within, / A second principle of Life, which might / Have dawned a fair and sinless child of sin; / But closed its little being without light, / And went down to the grave unborn, wherein / Blossom and bough lie withered with one blight.",
    passageReference: "Canto IV, stanza 70 · DJ IV.70",
    commentary: `The central stanza of *Don Juan*. Haidée, kept alive by her father's servants for twelve days after the shock, refusing food, wasting into a fever, finally dies — and Byron tells us she dies with her child unborn. The stanza's precision is what gives it its grief: she is not alone in dying, because the child is dying with her.

The phrase *a fair and sinless child of sin* is the stanza's load-bearing paradox. The child would have been, in its parents' society and their orthodox religion, illegitimate — "of sin" — and therefore compromised in birth. But the child itself is sinless; it has not been born yet, cannot have sinned, will never be given the chance to. Byron refuses the moral category of *bastardy* while admitting the social category of *shame* — and in the refusal writes one of the sharpest Romantic protests against Christian ethics' treatment of illegitimate children in the period's literature.

The stanza's imagery — *blossom and bough lie withered with one blight* — is pastoral rather than religious. Byron reaches for Virgil and for the English elegiac tradition (Milton's *Lycidas*, Shelley's *Adonais* six years later) rather than for the Church. Haidée is mourned as a broken natural thing, not as a soul.

This stanza is the emotional point around which the poem organizes. Every subsequent canto's comedy is set against the fact of Haidée's death. The narrator's acid cynicism in the English cantos (XI–XVII), the savage satire in the Ismail cantos (VII–VIII), the anti-war stanzas against Wellington (IX) — all are the voice of a poet who has already written this stanza and is earning the right to be bitter elsewhere. The tenderness of Canto IV is Byron's claim, against the whole subsequent poem, that he could write the other register when the material required it.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dido's death at the end of Aeneid IV is the Latin prototype. Both are women destroyed by love for a man shipped off to a larger fate; both deaths are the canto's formal close. Byron makes the debt explicit by modeling Canto IV on Aeneid IV — both are the fourth canto/book of their poems, both are the poem's emotional centerpiece, both are the moment the hero's course is redirected by the woman's end.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV, Dido's immolation",
        targetBookId: "the-aeneid",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "mythological"],
  },

  // ── 5. The narrator's return — mourning ──
  {
    id: "dj-4-thus-world-goes",
    bookId: "don-juan",
    chapterNumber: 5,
    anchorText: "risen from death, to be",
    anchorOccurrence: 1,
    title: "The narrator's return — Byron steps back in to mourn",
    quotedPassage:
      "She was buried, risen from death, to be / Perchance the death of one she loved too well: / Dear as her father had been to Haidée, / It was a moment of that awful kind — / I have seen such — but must not call to mind.",
    passageReference: "Canto IV, stanza 33 (of the recognition sequence; mourning passage resumes at 74) · DJ IV",
    commentary: `After a stretch where the narrator has been almost absent — letting the idyll and the catastrophe speak for themselves — Byron steps back in to mourn in his own voice. The phrase "I have seen such — but must not call to mind" is the clearest admission of personal grief the narrator makes anywhere in the poem. Byron had lost his own daughter Allegra (Claire Clairmont's child) to typhus in a convent in April 1822, and had been separated from his legitimate daughter Ada since infancy. The parenthetical refusal to call the memory to mind is a Byronic mannerism — the narrator admitting he cannot speak what he is already half-speaking — and it is one of the rare moments in the poem where the mask slips entirely.

The line "risen from death, to be / Perchance the death of one she loved too well" is a double syntax: Haidée, kept alive by her servants, "rises" from her initial collapse only to die again — and to be, in that second death, the death of the child she carries, who has loved her in the only way possible for the unborn. The Latinate grief of the construction is Byron reaching for Milton's cadences at the moment when comic ottava rima is no longer sufficient.

From this stanza forward through the close of Canto IV, the poem enters what scholars have called its *hinge*: Haidée buried, Juan shipped to Turkish slavery, the idyll irrecoverable. Canto V opens in the Constantinople slave market and the whole satirical-orientalist register of the middle cantos begins. The reader should feel the tonal gap between IV and V — it is Byron's deliberate signal that the poem has passed through its most serious movement and will now return to comedy, but a comedy that now carries Haidée's death as its undertone.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },
]
