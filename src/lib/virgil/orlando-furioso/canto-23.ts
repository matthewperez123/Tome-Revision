import type { Annotation } from "../types"

// ── Orlando Furioso Canto XXIII — THE structural center ───────────────
// Orlando, having stumbled on the forest chapel where Angelica and
// Medoro were married, reads their names carved in the trees and the
// grotto's inscription in Medoro's own hand; the proof of her love for
// the Saracen youth destroys him. He strips off his armor and runs mad.
// The poem's titular moment ("furioso" = "gone mad"), the event around
// which the whole 46-canto architecture is built.
//
// Density: 6 annotations. Demo-critical Opus cluster per spec Part 4.

export const ORLANDO_FURIOSO_CANTO_23: Annotation[] = [
  // ── 1. The carving-of-names — literary-historical context ──
  {
    id: "of-23-carved-names",
    bookId: "orlando-furioso",
    chapterNumber: 23,
    anchorText: "Beheld engraved, upon the woody shore",
    anchorOccurrence: 1,
    title: "The carved names — the slow revelation that breaks Orlando",
    quotedPassage:
      "Beheld engraved, upon the woody shore.",
    passageReference: "Canto XXIII, stanza 102 · OF XXIII.102",
    commentary: `Orlando, riding through an unfamiliar wood, dismounts to drink at a stream and sees, carved into the bark of a hundred trees, two names intertwined: Angelica and Medoro. The revelation is narrated slowly. Ariosto lets Orlando read and reread, then look around at other trees, then see more carvings. He lets Orlando try to convince himself he is misreading — that some other Angelica must be meant, that the carver is some impostor using the name. The poem holds Orlando at the edge of recognition for a long time before letting him cross it.

This is one of the great narrative techniques in European literature: the hero who already knows slowly forcing himself to know. Dante had done something like it at the death of Beatrice (in the *Vita Nuova*); but Ariosto's version, in forty stanzas of slow intake, is the model for the later novel's scene of devastating realization. Flaubert's Charles Bovary reading Emma's letters, Proust's Marcel discovering Albertine's past — they are descendants of this passage.

Orlando's discovery has three stages. First (XXIII.102–109), the trees: the carved names in a hundred places, which he tries to misread. Second (XXIII.110–115), the grotto: a cave where the fuller story is written out in verse, in Medoro's own hand, describing the nights the lovers spent there. Third (XXIII.116–118), the encounter with the shepherd who lodged them and recounts the whole affair, producing as proof the golden bracelet Angelica had left as a gift. Each stage tightens the knot. Ariosto will not let his hero miss any of it.

The sequence is deliberately slow because it has to be. Orlando's reason will snap; he will not recover it until Astolfo returns from the moon in Canto XXXIX. Sixteen cantos of his rampage depend on this moment being absolutely grounded. Ariosto grounds it with patient reading of the carvings, word by word.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 2. Medoro's inscription — Arabic verses as the second blow ──
  {
    id: "of-23-medoro-inscription",
    bookId: "orlando-furioso",
    chapterNumber: 23,
    anchorText: "I, poor Medoro, can but in my lays",
    anchorOccurrence: 1,
    title: "Medoro's inscription — Orlando's translation of the Arabic verse",
    quotedPassage:
      "I, poor Medoro, can but in my lays.",
    passageReference: "Canto XXIII, stanza 110 · OF XXIII.110",
    commentary: `The grotto's inscription is in Arabic verse, written by Medoro himself in the hand of a cultivated Saracen youth. Orlando reads Arabic — Ariosto's poem assumes its paladin's culture extended that far, a courtly Renaissance flattery — and translates it for himself as he reads. The passage is one of the small wonders of the poem: Orlando's mind offering the translation as it moves through the verses, the Italian ottava rima containing an Arabic original that is simultaneously being translated. We see the hand of the translator at work in real time.

Ariosto's choice to make the inscription Arabic (rather than, say, a vernacular love-song carved into stone) is doing two things at once. First, it forces Orlando to slow down — he cannot skim; he has to read word by word. Second, it locates the lovers outside the paladin's civilizational frame. Angelica has not gone to another knight; she has gone to a Saracen boy who writes poetry. The social hierarchy Orlando has taken for granted — Christian paladin above Saracen commoner — is what the inscription quietly breaks.

Stanza 111, where Orlando concludes his translation "and such in ours the sense," is the moment the poem makes the reader conscious that Orlando has done the work of linguistic intimacy with Medoro's verses. To translate a text is to enter it. Orlando has entered the testimony of his own heartbreak, syllable by syllable. By the time he steps away from the wall of the grotto, the translation has been the second blow — worse, in some ways, than the first.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 3. The stripping of armor — classical furor ──
  {
    id: "of-23-stripping-armor",
    bookId: "orlando-furioso",
    chapterNumber: 23,
    anchorText: "He from his limbs tore plate and mail away",
    anchorOccurrence: 1,
    title: "The stripping of armor — classical furor in the paladin tradition",
    quotedPassage:
      "He from his limbs tore plate and mail away.",
    passageReference: "Canto XXIII, stanza 134 · OF XXIII.134",
    commentary: `Orlando tears off his armor piece by piece, casts away Durindana (the sword that had won him all his fame), and runs naked into the countryside uprooting pines and oaks. The sequence is Ariosto's most sustained engagement with the classical *furor* — the irrational possession that the Latin epic tradition had at its disposal for moments when a hero slipped out of reason's jurisdiction.

The immediate literary ancestor is Seneca's *Hercules Furens*, the tragedy in which Hercules, driven mad by Juno, slaughters his own wife and children. Ariosto's Orlando does not kill his loved ones, but the gesture — the stripping of everything that marked him as a civilized hero, followed by mindless violence on the landscape itself — is Senecan. Orlando uprooting pines is Hercules tearing his children apart, lifted into a displaced register where the violence falls on trees rather than people.

Behind Seneca is Virgil. The end of Aeneid XII, when Aeneas kills Turnus in the final *furor* of the poem, is Ariosto's real long-range reference — and the poem's ending, thirty cantos later, will deliberately echo it. Virgil treats *furor* as a tragic flaw that the Roman civilizing mission cannot quite exorcise from even its best hero; Ariosto takes the same material and makes Orlando's *furor* the structural center of a poem in which reason and unreason are in constant fluid traffic.

What makes the stripping-of-armor scene so powerful is its specificity. Ariosto names each piece of armor as it comes off — helmet, cuirass, greaves, sword, shield — because the paladin's armor is the paladin's identity. Strip Orlando, and you have an uncomprehending animal in a forest. The poem is showing what remains when honor, fame, and chivalric self-definition are removed. The answer is unsettling.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Hercules Furens, Seneca's tragedy of the hero driven mad by Juno and slaughtering his family. Ariosto's Orlando-furor is the Senecan madness displaced onto the landscape instead of loved ones.",
        workTitle: "Hercules Furens",
        workAuthor: "Seneca",
        passageReference: "passim",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Aeneid XII's closing furor — Aeneas's final killing of Turnus — is the long-range Virgilian reference. Ariosto will return to Aeneid XII directly at the poem's close (Canto XLVI), when Rodomonte dies echoing Turnus.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, final lines",
        targetBookId: "the-aeneid",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 4. Proem — on the debts of love and friendship ──
  {
    id: "of-23-proem-love-debts",
    bookId: "orlando-furioso",
    chapterNumber: 23,
    anchorText: "Let each assist the other in his need",
    anchorOccurrence: 1,
    title: "The canto-opening proem — on mutual assistance, and what no hero can pay",
    quotedPassage:
      "Let each assist the other in his need; / Seldom good actions go without their due.",
    passageReference: "Canto XXIII, stanza 1 · OF XXIII.1",
    commentary: `The canto opens with a two-stanza proem on the obligation of heroes to return good for good — an apparently conventional moral preamble. Read it again after finishing the canto. The proem sets up, by anticipated contrast, everything the canto is about: Orlando has given Angelica his life's service and receives in return a love that has been granted elsewhere. No obligation is breached (Angelica never promised him anything); but the ideal of proportionate return, the chivalric economy in which service earns love, is what the canto systematically dismantles.

Ariosto positions his most classically moral opening above his most destabilizing episode. The proem tells the reader what the chivalric world assumes; the canto shows the world that assumption does not map onto. By the time Orlando is running mad through the wood, the proem's clean moral scheme is the irony against which the madness measures itself.

This is Ariosto's proem-technique at its most developed. A less complex poet would either put a sober proem over a sober canto or lift the proem for satire. Ariosto does neither; he lets the sincere moral frame sit unaltered above the action that strains it. The result is a canto that mourns and judges at the same time, without either register subsuming the other.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 5. The shepherd and the bracelet ──
  {
    id: "of-23-shepherd-bracelet",
    bookId: "orlando-furioso",
    chapterNumber: 23,
    anchorText: "Seeking another sense than was exprest",
    anchorOccurrence: 1,
    title: "Orlando seeking another sense — the mind's final defense",
    quotedPassage:
      "Seeking another sense than was exprest.",
    passageReference: "Canto XXIII, stanza 114 · OF XXIII.114",
    commentary: `Orlando, reading and rereading the Arabic inscription, tries to construe the verses into any alternative meaning that would absolve his reading. "Seeking another sense than was expressed" is Ariosto's exact description of the mind's last defense against unwanted knowledge: not denial, but re-translation. If the verses could somehow mean something other than what they mean, the love between Angelica and Medoro would not be what it is.

The linguistic precision of Ariosto's language — *cerca dar color altro* ("seeking to give another color") in the Italian, Rose's "another sense than was exprest" — gets at something psychologists would eventually formalize as motivated reasoning. Orlando is not lying to himself about what the text says; he is searching the space of permissible alternative readings, and Ariosto shows the search in real time. The futility is the point. No alternative reading survives. The language will not lie.

When the shepherd arrives a few stanzas later and produces the golden bracelet Angelica left — a physical object, outside the slippery territory of language — Orlando has lost his last rhetorical defense. The bracelet cannot be re-translated. This is when the final stage of his collapse begins.

The passage is also, in a quieter way, a meta-commentary on reading itself. Orlando's motivated re-translation is what every reader does at every difficult passage; the poem is asking its own readers to notice their own re-translations. It is Ariosto at his most sophisticated: the hero's epistemic failure staged in terms the reader recognizes from their own reading practice.`,
    crossReferences: [],
    tags: ["philosophical", "linguistic"],
  },

  // ── 6. Zerbino and Isabella find the armor — bridge to Canto XXIV ──
  {
    id: "of-23-zerbino-armor",
    bookId: "orlando-furioso",
    chapterNumber: 23,
    anchorText: "Who, at her hest, Astolpho's armour tied",
    anchorOccurrence: 1,
    title: "Zerbino and the armor — Orlando's legend as relic",
    quotedPassage:
      "Who, at her hest, Astolpho's armour tied.",
    passageReference: "Canto XXIII · OF XXIII.77",
    commentary: `The canto threads the beginning of the madness sequence together with the arrival of Zerbino and Isabella, who come upon Orlando's abandoned armor laid out by a stream. They do not know yet what has happened; they think Orlando has been killed, and they gather the armor to hang on a tree as a monument.

This is one of the poem's most poignant small details. Orlando is alive and running mad somewhere nearby; meanwhile the young lovers who represent the unstained chivalric ideal — Zerbino, who will be dead of Mandricardo's wound in Canto XXIV; Isabella, who will die by her own trick in XXIX — are treating his armor as a relic. The armor will indeed change hands, will be fought over by Mandricardo and Zerbino, and will become the object around which the next canto's central death unfolds.

Ariosto uses Orlando's discarded armor as a relic before the tradition he is inheriting has processed Orlando's death. In the *Chanson de Roland*, Roland dies at Roncevaux with his armor and his sword; here, in the middle of a Renaissance poem, the armor is prematurely a relic while its owner is still alive and mad. The detail gestures toward the Roncevaux future that all readers knew was shadowing the poem. Roland's armor-relic scene has been advanced; it will happen in literary memory after this canto even though Orlando himself will survive to the poem's end.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },
]
