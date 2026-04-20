import type { Annotation } from "../types"

// ── Orlando Furioso Canto XLVI — the ending ──────────────────────────
// Ruggiero and Bradamante's wedding at Charlemagne's court. Rodomonte
// rides in, challenges Ruggiero, fights him, is killed. The poem's
// closing stanzas — Rodomonte's furious soul, complaining, flying to
// the shades — are Ariosto's deliberate imitation of the final lines
// of the Aeneid, where Turnus's soul flies to the shades with the same
// indignation.
//
// Density: 6 annotations. The ending is a demo-critical Opus cluster;
// the Rodomonte/Turnus parallel is one of the two most important
// cross-references for the Great Epics curriculum.

export const ORLANDO_FURIOSO_CANTO_46: Annotation[] = [
  // ── 1. The opening proem — return to harbor ──
  {
    id: "of-46-harbor-return",
    bookId: "orlando-furioso",
    chapterNumber: 46,
    anchorText: "I, if my chart deceives me not, shall now",
    anchorOccurrence: 1,
    title: "The return to harbor — Ariosto's friends named on the dock",
    quotedPassage:
      "I, if my chart deceives me not, shall now / In little time behold the neighbouring shore.",
    passageReference: "Canto XLVI, stanzas 1–19 · OF XLVI.1–19",
    commentary: `The canto opens with one of the most admired proems in European poetry: the poet's ship returns to port after long voyage, and he imagines his friends gathered on the dock to greet him. Over nineteen stanzas Ariosto names them, one by one — Pietro Bembo, Baldassare Castiglione, Jacopo Sannazaro, Pietro Aretino, Isabella d'Este, Lucrezia Borgia, and many others less remembered now but central to the Ferrarese and Venetian humanism of the 1520s.

The proem is court poetry in its purest form. Ariosto is flattering his patrons, his allies, and his rivals all at once; every name named is a position staked. But it is also a farewell — to the three decades of work (1505–1532) the poem represents, to the friends the poet has outlived and the ones he has not yet outlived but will, and to the narrator-voice that has run the poem for 45 cantos. When the proem ends at stanza 19, Ariosto will not again speak in this register. The rest of the canto is narrative closure.

Pietro Bembo, named first in the catalogue, matters. Bembo was the Venetian humanist who codified Italian as a literary language, arguing that modern Tuscan-based Italian could do everything Latin did. Ariosto had revised his poem heavily between editions (1516, 1521, 1532) following Bembo's linguistic advice. Naming Bembo first is Ariosto acknowledging his most influential reader.

The proem also closes a formal arc. Ariosto's first Canto opened with the Virgilian "Arma virumque cano" translated and expanded. Here at the end he closes on the Horatian harbor-trope of the long voyage home. The poem has moved from one classical starting-point to another, and will end, in a few stanzas, on a direct Virgilian imitation.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 2. The wedding — dynastic closure ──
  {
    id: "of-46-wedding",
    bookId: "orlando-furioso",
    chapterNumber: 46,
    anchorText: "Would see her cherished consort risk his life",
    anchorOccurrence: 1,
    title: "The wedding — the dynastic plot resolved",
    quotedPassage:
      "Would see her cherished consort risk his life.",
    passageReference: "Canto XLVI · OF XLVI.73",
    commentary: `The poem ends where Ariosto's patrons required it to end: at Ruggiero and Bradamante's wedding. The marriage is the mythological founding of the House of Este. Every encomium the poem has delivered through 46 cantos — the parade of descendants in Canto III, the genealogical catalogue in XIII, the painted hall in XXXIII, the dozen smaller gestures — funnels into this moment. The dynastic plot, which has been braided through the Orlando and Angelica narrative from Canto I, is now the plot that closes the poem.

A Renaissance reader understood the closure as a triple one. First, the romance convention: the lovers achieve their union after trials. Second, the mythic founding: the Este dynasty begins. Third, the political: the poem, commissioned as court entertainment, pays its patrons the return that commissioning implied.

What is worth noticing is that the wedding is almost immediately disturbed. Rodomonte rides in and challenges Ruggiero. The poem cannot end on the pure wedding-closure the dynastic plot demands; something has to be fought and killed before the frame can close. That the something is Rodomonte — the Saracen warrior whose woman-hating rampage has been the poem's darkest register — is Ariosto's way of saying that the founding of a peaceful dynasty cannot happen without the expulsion of the figure who represents unconverted violence. The wedding requires a killing to close it.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 3. Rodomonte's arrival — the unfinished business ──
  {
    id: "of-46-rodomonte-arrival",
    bookId: "orlando-furioso",
    chapterNumber: 46,
    anchorText: "Such was the shock wherewith King Rodomont",
    anchorOccurrence: 1,
    title: "Rodomonte rides into the wedding — Ariosto's unexpected coda",
    quotedPassage:
      "Such was the shock wherewith King Rodomont.",
    passageReference: "Canto XLVI · OF XLVI.107",
    commentary: `Rodomonte's appearance at the wedding breaks the frame every Renaissance reader expected. The poem has, by this point, resolved its major storylines. Orlando is sane; Agramante is dead; Astolfo has restored the wits; the war is won; the wedding is underway. And then a single unresolved thread — a pagan champion sworn to single combat — comes through the door.

The effect is deliberately disproportionate. Rodomonte's earlier career in the poem was monumental: in Canto XVI he broke the walls of Paris single-handed; in XVIII he withdrew from the Saracen camp in jealousy; in XXIX he killed the grieving Isabella and built a bridge-tower in her memory. He has been, across the middle cantos, the figure through whom the poem's darkest energies ran. For the poem to end without settling him would be a kind of moral fraud; Ariosto has him ride in precisely so that the settlement can happen.

The combat itself is longer and more clinical than any other single-combat in the poem. Ariosto slows down time and goes through the fight blow by blow — twenty stanzas of close infighting, wrestling, dagger-work on the ground. This is not chivalric glory; it is the specific, exhausted killing that a poem of Ariosto's sophistication reserves for its final action. Orlando's long duels are set-pieces; this duel is the work that had to be done.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  // ── 4. Ruggiero's dagger — the killing blow ──
  {
    id: "of-46-dagger",
    bookId: "orlando-furioso",
    chapterNumber: 46,
    anchorText: "His dagger, buried it in Rodomont",
    anchorOccurrence: 1,
    title: "The dagger — Ariosto's quiet naming of the Aeneid parallel",
    quotedPassage:
      "His dagger, buried it in Rodomont.",
    passageReference: "Canto XLVI · OF XLVI.139",
    commentary: `Ruggiero's final blow — a dagger into Rodomonte's forehead as the Saracen wrestles with him on the ground — is the exact structural rhyme of the Aeneid's final blow. Virgil's Aeneas at the end of Book XII catches sight of Pallas's sword-belt on Turnus, loses what pity he had felt, and drives his sword (*ferrum*) into his enemy's chest. Ariosto chooses the dagger rather than the sword so that the gesture is not a direct visual quote, but the formal analogy is unmistakable: the two great verse-epics of the Western tradition end with a hero who has every motive for mercy refusing it and killing his beaten opponent.

Both killings are, deliberately, *not* triumphal. Virgil's Aeneas kills Turnus in a sudden surge of *furor* — the same *furor* the Roman civilizing mission is supposed to have transcended, returning at the critical moment. Ariosto's Ruggiero kills Rodomonte because mercy would be unsafe — Rodomonte would rise again — but also, the text implies, because dynasties cannot be founded over a surviving enemy. Both killings are necessary and both are troubled.

The parallel is the single most important cross-reference in the Great Epics curriculum. Virgil wrote the tradition's first great troubled ending; Ariosto wrote its Renaissance counterpart fifteen centuries later; they are in direct conversation. Between them they set the pattern for how serious epic ends: not with the hero's triumph but with a killing the poem cannot fully celebrate.

The next great ending in this lineage is Milton's *Paradise Lost*, which refuses the tradition entirely — Adam and Eve walk out of Eden holding hands, and no one is killed, and no catharsis is granted. Milton's refusal is a deliberate answer to the Virgil–Ariosto pattern.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Aeneid XII: the final blow. Aeneas buries his sword in Turnus's chest after catching sight of Pallas's sword-belt. The structural rhyme with Ruggiero's dagger into Rodomonte is the single most demonstrable classical-inheritance moment in the Great Epics curriculum. Both are troubled killings; both end their poems; both send the slain to the shades with indignation.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, closing lines",
        targetBookId: "the-aeneid",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 5. The closing line — soul flies to the shades ──
  {
    id: "of-46-final-line",
    bookId: "orlando-furioso",
    chapterNumber: 46,
    anchorText: "The indignant spirit fled, blaspheming loud",
    anchorOccurrence: 1,
    title: "The final line — the Virgilian closing, translated",
    quotedPassage:
      "The indignant spirit fled, blaspheming loud.",
    passageReference: "Canto XLVI, final stanza · OF XLVI.140",
    commentary: `The final line of the poem is Ariosto's translation of the final line of the Aeneid. Virgil's Latin:

*vitaque cum gemitu fugit indignata sub umbras*
"and his life fled, groaning and indignant, beneath the shades."

Ariosto's Italian (Rose's English above): the indignant spirit, complaining, flies to the shades. The vocabulary matches Virgil word for word: *indignata* → indignant, *gemitu* → groaning / complaining, *sub umbras* → to the shades, *fugit* → fled.

No Renaissance reader could miss this. It is a closing signature — Ariosto naming the tradition he has just added a major monument to. The Aeneid ends with Turnus's soul in indignation; Orlando Furioso ends with Rodomonte's soul in indignation; the two epics are sealed as siblings.

More subtly: the indignation is the point. Both Turnus and Rodomonte die *protesting*. Neither accepts the killing. The poems do not grant the slain the dignified acceptance of death that a fully triumphal epic would require; they end on the protest of the defeated. The reader is left not with the hero's serenity but with the enemy's grievance.

Milton knew this. When he ended Paradise Lost on Adam and Eve walking out of Eden with "wandering steps and slow," he was refusing exactly this closing register. Ariosto and Virgil end on the indignant fleeing soul; Milton ends on the human figures walking with uncertainty into the future. Three great epics; three deliberately different closing registers. The Aeneid and Orlando Furioso are paired against Paradise Lost.

This is one of the demo-critical cross-references for the Great Epics curriculum. Worth spending a moment on.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Aeneid XII, final line — 'vitaque cum gemitu fugit indignata sub umbras' — is Ariosto's exact model. Word for word: indignata → indignant, gemitu → complaining/groaning, sub umbras → to the shades. The closing signature names the tradition and its most important Renaissance continuer simultaneously.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, final line",
        targetBookId: "the-aeneid",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Paradise Lost's ending deliberately refuses this Virgil–Ariosto register. Where both classical and Renaissance epic end on the indignant fleeing soul of the defeated, Milton ends on Adam and Eve walking hand in hand out of Eden — the human future substituted for the closing enemy's protest.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book XII, lines 646–649",
        targetBookId: "paradise-lost",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 6. The three endings — Ariosto's place in the tradition ──
  {
    id: "of-46-three-endings",
    bookId: "orlando-furioso",
    chapterNumber: 46,
    anchorText: "As to demand my heart and soul from me",
    anchorOccurrence: 1,
    title: "Ariosto, Virgil, and the troubled-ending tradition",
    quotedPassage:
      "As to demand my heart and soul from me.",
    passageReference: "Canto XLVI · OF XLVI.60",
    commentary: `By choosing to end with Rodomonte's death — rather than with Ruggiero and Bradamante walking in procession, or with the wedding-feast's last toast, or with the narrator saluting the reader — Ariosto is deliberately locating his poem inside Virgil's tradition rather than Homer's. The Iliad ends with Hector's funeral and a day of grief; the Odyssey ends with Odysseus reconciling with Penelope and Athena imposing peace. Both are closures that allow the reader out of the poem on a stable note. Virgil refused that stability; Ariosto follows.

The Aeneid's troubled ending was controversial in antiquity — there were ancient readers who wished Virgil had ended a few stanzas earlier, with Aeneas having reason and mercy enough to spare Turnus. Renaissance readers carried this debate forward, and Ariosto's decision to echo the ending precisely is his verdict on the question: Virgil's ending is the right one for serious epic, and the tradition should continue.

Reading outward from this closing stanza, the chain is:
- Homer's Iliad / Odyssey: endings that settle.
- Virgil's Aeneid: ending that does not settle — indignant soul to the shades.
- Dante's Commedia: ending that settles at the highest possible register (the love that moves the sun and stars).
- Ariosto's Orlando Furioso: Virgilian, deliberately.
- Spenser's Faerie Queene (unfinished): the tradition's incompletion mirrored structurally.
- Milton's Paradise Lost: deliberate refusal of the Virgilian troubled ending.
- Byron's Don Juan: the poem unfinished, death of the poet at Missolonghi. The ending's refusal to settle is total.

Ariosto's position in this chain is not decorative. He is the hinge between the classical tradition that founded the troubled-ending convention and the Christian-Protestant tradition that would challenge it. Any serious reading of European epic passes through this closing stanza.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
]
