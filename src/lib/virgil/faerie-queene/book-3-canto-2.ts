import type { Annotation } from "../types"

// ── The Faerie Queene — Book III · Canto II ───────────────────────────
// Britomart's mirror vision — the scene in which the warrior-maiden of
// Chastity falls in love with Artegall by seeing him in her father's
// magic mirror. Hand-authored scholarly annotations; Standard Ebooks
// text (selectively modernized from the 1590 quarto). Chapter index
// post-canto-split: ch-27 in public/content/the-faerie-queene/.
//
// Density: 12 annotations. Opus-grade per spec Part 4 — Book III canto
// ii is one of the ten named Opus clusters, called out in the spec as:
// "One of the most remarkable scenes in the poem ... Britomart falls
// in love with Artegall, whom she has never met, by seeing him in a
// magic mirror."
//
// This canto is also the palette-continuity payoff point for the
// Orlando Furioso ↔ Faerie Queene cluster: Britomart ← Bradamante,
// both warrior-maidens of dynastic romance, their palettes deliberately
// adjacent (see src/data/faerie-queene/speakers.ts:BRITOMART_BRADAMANTE_
// CONTINUITY and src/data/orlando-furioso/speakers.ts:Bradamante).
// The mirror-vision scene directly inverts Ariosto's Merlin-cave scene
// (Orlando Furioso III): where Bradamante is SHOWN her genealogical
// descendants, Britomart is SHOWN the man she will marry. The two
// scenes are formally parallel and doctrinally inverted — providence
// versus personal destiny, dynastic future versus romantic object.
//
// Covers, in order: (1) The opening women-warriors proem and its
// classical catalogue; (2) Merlin's mirror as predestination-emblem;
// (3) Britomart's encounter with the mirror; (4) The naming of
// Artegall; (5) Petrarchan love-as-illness; (6) Glauce the nurse and
// her literary genealogy; (7) The Bradamante-Merlin inheritance made
// explicit; (8) Britomart as structural hermaphrodite; (9) The
// inversion of the romance gaze (woman-views-man rather than man-
// views-woman); (10) The dynastic-providence theology; (11) Cross-
// references to Romeo's Nurse and the Shakespearean inheritance of
// Glauce; (12) The canto as the hinge-point for the whole interlaced
// Book III–IV narrative.

export const FAERIE_QUEENE_BOOK_3_CANTO_2: Annotation[] = [
  // ── 1. The opening proem — women warriors ─────────────────────────
  {
    id: "fq-3-2-proem-women-warriors",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "Here have I cause in men just blame to find",
    anchorOccurrence: 1,
    title: "\"Here have I cause in men just blame to find\" — Spenser defends women warriors",
    quotedPassage:
      "Here have I cause in men just blame to find, / That in their proper praise too partiall bee, / And not indifferent to woman kind, / To whom no share in armes and chevalree / They doe impart, ne maken memoree / Of their brave gestes and prowesse martiall",
    passageReference: "Book III canto ii, proem stanza 1",
    commentary: `Spenser opens Book III canto ii with a direct polemical defense of women warriors — and this is worth attention both as an argument and as a structural signal about what Book III is doing.

The argument: male writers, Spenser says, have been *partial* (= biased) in their praise — they have given no share "in armes and chevalree" to women, and have made "no memoree" (no record, no commemoration) of women's martial deeds. The stanza's register is explicitly corrective. The proem's next stanza goes on to list classical and British examples: Camilla the Volscian warrior-maiden of Aeneid VII–XI; Penthesilea the Amazon queen; Bonduca (Boudicca/Boadicea) the British queen who led the revolt against Rome in 60–61 CE. Spenser is reading the received martial-epic tradition *against its own grain*, insisting on a women's-military lineage the male-authored tradition had suppressed.

This is unusual enough in 1590 to require the proem. Milton's Paradise Lost, seventy-seven years later, will not contain a comparable stanza. Most Renaissance epic, when it incorporates a female warrior, does so as an exotic exception — Virgil's Camilla is marginal in the Aeneid, Ariosto's Bradamante and Marfisa are exceptional figures. Spenser is making the unusual structural move: placing the warrior maiden *at the center* of a book. Book III's titular knight is Britomart. Book III's argument is Chastity, and chastity is allegorized in the figure of a woman who fights better than the male knights around her.

The proem signals that a reader who approaches Britomart expecting a damsel-in-distress will have to recalibrate. The woman in Britomart's armor is the active subject of the book — she rescues Amoret, she breaks the Busirane-enchantment, she will in Book IV continue to drive the interlaced narrative. The male paladins (Guyon, Scudamour) will reappear in Book III as figures Britomart outranks in combat. Book III is the book in which Spenser's inheritance from Ariosto — specifically, Bradamante — is made central rather than marginal.

One practical reading note: Spenser's proems are to be read carefully. They announce the doctrinal frame under which the following canto's narrative should be interpreted. Skipping the proem to get to the narrative, which a first-time reader is tempted to do, loses the interpretive key.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid VII.803–817, XI.498–592 — Camilla the Volscian warrior-maiden. Virgil's most sustained treatment of a female fighter; Spenser names her in the proem stanza that follows this one as a warrant for his own Britomart.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XI, lines 498–592",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "The Iliad's Penthesileia (absent from the poem we have but canonical in the epic cycle fragment Aethiopis) — the Amazon queen who comes to Troy after Hector's death and is killed by Achilles. Spenser treats her as an emblem of the female-warrior tradition he argues the male epic tradition has been 'partiall' in remembering.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Epic Cycle / Aethiopis (fragmentary)",
        targetBookId: "the-iliad",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  // ── 2. Merlin's glassy globe ──────────────────────────────────────
  {
    id: "fq-3-2-merlin-glassy-globe",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "The great Magitien Merlin had deviz'd",
    anchorOccurrence: 1,
    title: "Merlin's glassy globe — predestination-emblem and providence-instrument",
    quotedPassage:
      "The great Magitien Merlin had deviz'd, / By his deepe science and hell-dreaded might, / A looking-glasse, right wondrously aguiz'd, / Whose vertues through the wyde worlde soone were solemniz'd. / It vertue had to shew in perfect sight / What ever thing was in the world contaynd, / Betwixt the lowest earth and hevens hight, / So that it to the looker appertaynd",
    passageReference: "Book III canto ii, stanzas 18–19",
    commentary: `Merlin's mirror is a theologically loaded device. It shows only "what ever thing … so that it to the looker appertaynd" — that is, it shows the viewer the specific thing in the world that *pertains to their destiny*. It is not a general oracle; it is personally addressed to each viewer. What Britomart sees is, by this logic, what providence intends for her.

This is Renaissance Christian providentialism in dense compression. The mirror displays not what the viewer desires, not what the viewer chooses to see, but what *concerns* the viewer — a semi-technical vocabulary from scholastic theology in which *providence* (God's ordering of the world) reveals to each soul the particular vocation, marriage, or mission that pertains to them. Merlin's mirror is a providential instrument with magical apparatus; the magic is machinery, but the *showing* is theological.

Note what the mirror does NOT do. It does not show the future in general. It does not show all possible outcomes. It does not show what would happen if Britomart chose differently. It shows the single thing that pertains to her — Artegall, the man she will pursue for the remaining Books III, IV, and V, and marry. The absence of alternative futures is the absence of genuine contingency; the mirror's disclosure is simultaneously a disclosure and a binding.

Ariosto's version of this scene — Bradamante in Merlin's cave in Orlando Furioso III — works on the same theology but a different object. Ariosto's mirror-equivalent shows Bradamante her *dynastic descendants*, the House of Este, down through the generations to Ariosto's patrons. Spenser's mirror shows Britomart *the one man she will marry*. Ariosto makes the content *collective* (a lineage); Spenser makes it *individual* (a person). The difference registers a cultural shift from 1516 Ferrara (where the patron-dynastic frame is what makes the poem payable) to 1590 Elizabethan England (where the cult-of-Elizabeth single-person frame has reshaped what providence discloses).`,
    crossReferences: [
      {
        type: "source",
        description:
          "Orlando Furioso Canto III — Bradamante descends to Merlin's tomb with Melissa; Merlin's ghost speaks; Bradamante sees the procession of her descendants, the House of Este, down to Ariosto's patrons. The direct formal source for Spenser's mirror-vision scene. Spenser converts Ariosto's dynastic-procession-of-descendants into a single-person mirror-vision of Artegall.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto III, stanzas 9–62",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Virgil's Aeneid VI — Anchises shows Aeneas the parade of future Romans in the underworld. The classical source for both Ariosto's Merlin-scene and Spenser's (at one remove via Ariosto). All three scenes are providential-disclosure scenes: the hero is shown the future that concerns them. Spenser is at the third station of a tradition whose first station is Virgilian.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 752–892",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 3. The mirror given to King Ryence ────────────────────────────
  {
    id: "fq-3-2-king-ryence",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "gave unto king Ryence for his gard",
    anchorOccurrence: 1,
    title: "King Ryence — the Arthurian frame made explicit",
    quotedPassage:
      "Such was the glassy globe that Merlin made, / And gave unto king Ryence for his gard, / That never foes his kingdome might invade, / But he it knew at home before he hard / Tidings thereof, and so them still debar'd.",
    passageReference: "Book III canto ii, stanza 21",
    commentary: `Britomart's father Ryence is not an invented Faery Land king — he is a figure from the Arthurian tradition. In Malory's *Le Morte D'Arthur* (completed c. 1469, printed 1485), King Rience (Ryons, Ryence, Rhyence) is a Welsh king from the British north whom Arthur's forces defeat in an early campaign; Ryence's most famous detail in Malory is that he has made himself a mantle trimmed with the beards of kings he has conquered, and demands Arthur's beard to complete it.

Spenser picks up the Arthurian king and rewrites him for his own purposes. In Spenser, Ryence is the father of Britomart and a keeper of Merlin's mirror. The shift is from villain-figure (Malory's Ryence is an enemy of Arthur) to unmarked-father (Spenser's Ryence is just Britomart's father). The reduction-to-unmarked is a common Spenserian move with Arthurian source-material: he uses the tradition's prop furniture without carrying along all of its narrative baggage.

The Arthurian framing matters because it confirms that Book III is happening *before* Prince Arthur is King Arthur, in the timeframe that will eventually become the British-legendary past. Britomart, in Book III canto iii, will receive a prophecy from Merlin that her descendants will be the line of British kings including (ultimately) Elizabeth herself. The mirror-vision of Artegall sets up the dynastic marriage that Spenser's whole Book III–V arc is building toward.

Note also: Merlin gives the mirror to Ryence for *strategic intelligence* (advance warning of foreign invasion). The mirror's first use is military. That it ends up showing Britomart her future husband is a secondary — but providentially primary — use. Spenser likes this structural joke: the tool given for one purpose serves a deeper purpose its inventor did not anticipate.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Malory's Le Morte D'Arthur Book I (The Tale of King Arthur), chapters on King Rience of North Wales. Spenser's King Ryence is the same figure, repurposed from enemy-king to father-figure. The Arthurian legendarium is the reservoir from which Spenser draws furniture for Book III's British-past setting.",
        workTitle: "Le Morte D'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book I, chapters 26–27; Book II",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  // ── 4. Britomart approaches the mirror ────────────────────────────
  {
    id: "fq-3-2-britomart-at-mirror",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "Britomart Into her fathers closet to repayre",
    anchorOccurrence: 1,
    title: "Into the father's closet — the scene of the vision",
    quotedPassage:
      "It fortuned, one day, when Britomart / Was in her fathers closet to repayre; / For nothing he from her reserv'd apart, / Being his onely daughter and his heyre",
    passageReference: "Book III canto ii, stanzas 22–24",
    commentary: `The set-up of the vision is quiet, almost domestic. Britomart is a young woman in her father's house. One day she happens to be in her father's "closet" — meaning private chamber, study, inner sanctum (the word's 1590 sense is closer to our "study" than to our closet-for-clothes). She is there because her father hides nothing from her; she is his only daughter and heir; she has free run of his private space.

The domesticity of this moment is important. Britomart does not approach the mirror as a seeker would approach an oracle. She is not asking the mirror a question; she is not requesting disclosure. She happens to be in her father's study, her eye falls on the mirror that is kept there among his state-treasures, and — curious as a young person would be — she gazes into it. The vision that follows is unsought. It finds her.

This is the difference between Britomart and Bradamante. Bradamante in Orlando Furioso III is explicitly led by Melissa into Merlin's tomb for a prophecy; the vision is ceremonial, sought, prepared-for. Britomart's vision happens in domestic privacy, unpreparedly. Spenser is staging the moment of predestinated disclosure as something that *comes to* the person rather than something the person *goes to*. The theological note (providence addresses you in your daily round, not only in consecrated spaces) is characteristic of Reformed Christian thought; it is also a good narrative choice.

The phrase "being his onely daughter and his heyre" carries additional weight for Book III's dynastic framework. Britomart is *her father's heir* — she inherits his kingdom. That her inheritance includes the mirror (he reserves nothing from her) and that the mirror shows her Artegall means the future of her father's line runs through her *marriage to the man in the mirror*. The dynastic frame is thick even in the quiet domestic moment. What looks like a young woman's private gaze into a mirror is also the disclosure of the British dynasty's future through her.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare Pyrrha's mirror-reflection in Ovid's Metamorphoses I (after the flood, Pyrrha and Deucalion cast stones that become humans, mirror-like re-generation). Compare also Narcissus's pool in Metamorphoses III. Spenser's mirror is not quite either — it neither reflects the self nor is the site of self-mistaken-for-other. But the Ovidian mirror-tradition is the Renaissance background against which Spenser writes.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book III.339–510 (Narcissus)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 5. Artegall named ─────────────────────────────────────────────
  {
    id: "fq-3-2-artegall-named",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "Arthegall he hight",
    anchorOccurrence: 1,
    title: "\"Arthegall he hight\" — the name the mirror discloses",
    quotedPassage:
      "\"Lives none this day that may with him compare / In truth of honour, in all noble dart, / Ne any but thy selfe, thou vertuous Mayd, / Ne other borne in arms, that it shall beare; / For so it is by destinie arayd, / Whom he shall seeke to wreake, and Arthegall he hight.\" / The worde gone out she backe againe would call",
    passageReference: "Book III canto ii, stanza 41",
    commentary: `The moment of naming is handled with a small Spenserian joke. Glauce — who is in the middle of comforting Britomart — speaks the name *Arthegall* and then "the worde gone out she backe againe would call." That is: having said the name, she wishes she could unsay it. The speech act is irrevocable; the name, once out, binds.

The spelling here — *Arthegall* with the -th- — is the Spenserian form. (*Artegall* without the -h- is the more common modern scholarly spelling.) The name is a compound: *Arth-* is Celtic for "bear," as in King Arthur (whose name shares the root); *-egall* is related to *equal* or *egall*. Thus *Arthegall* = "Bear-equal" or "Equal-in-arms-to-Arthur." Spenser is signaling, in the etymology alone, that this man will be Arthur's equal — a figure of justice (Book V will make him the Knight of Justice) equivalent to Arthur the figure of Magnificence. Britomart is being shown not just her future husband but a figure of quasi-Arthurian stature.

The revelation has a particular shape: Britomart has seen *a face* in the mirror in the previous stanzas — she has seen what the man looks like, seen his armor, seen his bearing. She has not been told his name. Her love is a love for the *image*. Now, after she has fallen in love with the unnamed image, the nurse Glauce supplies the name. The sequence — see-face, fall-in-love, learn-name — matters. The love is not a knowledge-based commitment; it is an image-based commitment that only later receives a name to attach to.

This sequence is the Petrarchan sonnet tradition's structure of love. Petrarch sees Laura in Avignon in 1327; he falls in love with her image; only later does the poetry attach names, genealogies, doctrinal frameworks. Spenser gives Britomart the same temporal sequence. Book III will go on to examine the whole tradition of love-as-image — in the Garden of Adonis (III.vi), in the House of Busirane (III.xi–xii) — and the mirror-vision here is the tradition's founding moment for this book.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Petrarch's Canzoniere — the foundational Renaissance love-poetry tradition. Laura is first seen, then loved, then named, then endlessly elaborated in song. Spenser's Britomart-sees-Artegall sequence is structured on this Petrarchan template. Book III's whole apparatus of love-as-image inherits from Petrarch via the Italian sonnet tradition.",
        workTitle: "Canzoniere",
        workAuthor: "Francesco Petrarca",
        passageReference: "Canzoniere 3 (the first sight of Laura, 6 April 1327)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 6. Petrarchan love-as-illness ─────────────────────────────────
  {
    id: "fq-3-2-love-as-illness",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "Ah! Nurse, what needeth thee to eke my payne?",
    anchorOccurrence: 1,
    title: "Britomart sick with love — Petrarchan pathology in Spenserian stanza",
    quotedPassage:
      "'Ah! Nurse, what needeth thee to eke my payne? / Is not enough that I alone doe dye, / But it must doubled be with death of twayne? / For nought for me but death there doth remayne.' / 'O daughter deare!' (said she) 'despeire no whit'",
    passageReference: "Book III canto ii, stanzas 31–32",
    commentary: `Britomart, after the mirror-vision, falls ill. She cannot eat, cannot sleep, wastes away, grows pale — a constellation of symptoms that, in the 1590 medical-literary idiom, is *love-sickness*.

The specifics are Petrarchan, and the Petrarchan love-sickness tradition is the living medical theory of love in Renaissance Europe. Love enters through the eye (Britomart sees the man in the mirror); the image lodges in the heart; the heart's "spirits" become disturbed; the body wastes from the inside; the sufferer cannot say what is wrong because the cause is invisible. Petrarch's Canzoniere catalogues the symptoms across hundreds of sonnets; Marsilio Ficino's *De amore* (1484) gives the medical-philosophical theory; Renaissance physicians from Valleriola to Jacques Ferrand have dissertations on love-as-disease.

Spenser's stanza gives the full clinical picture. The reader who has no Petrarchan-medical background sees a young woman suffering. The reader who does is meant to recognize that Britomart's condition has a *name* — *amor hereos*, heroic love, or lovesickness — and that Renaissance medical tradition prescribed specific remedies: distraction, travel, bloodletting, conversation. Glauce, the nurse, is going to propose *travel* as Britomart's remedy. The romance quest — Britomart setting out in armor to find Artegall — is partly, in Spenser's framework, a medical prescription.

This is not incidental to Book III. The whole book's action is launched because Britomart is *love-sick*, and movement is the prescribed cure. The interlaced quest-romance form of Book III — Britomart travels, encounters adventures, meets other knights — is structurally the *itinerary of a lovesickness cure*. A reader who registers this frame sees Book III as a kind of narrative prescription being filled.

The alexandrine close of stanza 31 — "For nought for me but death there doth remayne" — is one of the book's most affecting lines. A fifteen-year-old girl (Britomart's age is never given; she reads as young) believes she is dying of love. The affecting ninth line drops the hexameter's weight on her private despair, and Spenser's formal signature makes the private moment feel inevitable rather than decorative.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Petrarch's Canzoniere 35 ('Solo e pensoso'), 132 ('S'amor non è'), 134 ('Pace non trovo'), and many others describe the clinical picture of lovesickness: pallor, fever, sleeplessness, wasting, mental distraction. The constellation of symptoms Spenser gives Britomart is directly Petrarchan.",
        workTitle: "Canzoniere",
        workAuthor: "Francesco Petrarca",
        passageReference: "Canzoniere 35, 132, 134",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Marsilio Ficino's De amore (1484, a commentary on Plato's Symposium) provides the medical-philosophical theory of love-sickness that Spenser's Britomart-suffering stanza assumes. Love enters through the eye, spirits become disturbed, body wastes — the 1590 reader would have known the theory as common educated knowledge.",
        workTitle: "De amore",
        workAuthor: "Marsilio Ficino",
        passageReference: "1484",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ── 7. Glauce the nurse ───────────────────────────────────────────
  {
    id: "fq-3-2-glauce-nurse",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "whose name was Glaucè hight",
    anchorOccurrence: 1,
    title: "Glauce — the nurse as literary type",
    quotedPassage:
      "Her ancient nurse, whose name was Glaucè hight, / Feelmg her leape out or her loathed nest",
    passageReference: "Book III canto ii, stanza 30",
    commentary: `Glauce belongs to a well-defined Western literary type: the *confidante-nurse*, the older woman who knows the young heroine's secret, comforts her, and helps plot the remedy. The type goes back to Euripides (the Nurse in *Hippolytus*, the Nurse in *Medea*), runs through Virgil (Dido's nurse Barce in Aeneid IV), and passes forward to Chaucer (Criseyde's niece / confidante Antigone), Shakespeare (the Nurse in *Romeo and Juliet*, c. 1595, written *after* Spenser), and continental romance.

The name *Glauce* is Greek — *Glaukē*, "gleaming, silvery-gray" — the name Euripides gives to one of the minor figures in *Medea* (Medea's rival) and to several nurse-figures in tragic cliché. Spenser is reaching for the name-aura of the Greek confidante-nurse tradition. The Glauce he writes is a mix of the type's components: she is old ("ancient"), familiar enough with Britomart to feel her leap from bed in a nightmare, and competent to diagnose love-sickness and propose a cure.

What Glauce does in this canto matters because it sets up everything Book III does. She:
1. Comforts Britomart through the acute phase of lovesickness (stanzas 30–40)
2. Extracts the confession and supplies the name Artegall (stanza 41)
3. Consults Merlin on Britomart's behalf in canto iii (the most important prophecy of the whole poem)
4. Dresses Britomart in knight's armor to enable her quest (canto iii)

She is, in short, the *enabler* of the book's entire narrative. Without Glauce, Britomart stays in her father's castle and wastes away. With her, Britomart rides out as a knight and the book happens. Spenser's decision to locate so much agency in the confidante-nurse role is striking; the older literary tradition tends to let the nurse comfort but keeps the action with the male lover or the principal heroine's own will. Spenser's Glauce is closer to a plot-engine than to a supporting character.

Shakespeare's Nurse in Romeo and Juliet is, on best scholarly reading, working *from* this Spenserian tradition (Shakespeare had read The Faerie Queene closely; his Sonnets and several plays show the influence). The Glauce → Nurse line is one of the quieter but demonstrable inheritances from Spenser into Shakespeare.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Shakespeare's Nurse in Romeo and Juliet (c. 1595) is a direct descendant of the Spenserian Glauce — older woman, confidante to the young heroine, bawdy comic timing alternating with affection, morally ambiguous but dramatically essential. Shakespeare had read The Faerie Queene; the Nurse is one of the places the inheritance shows most clearly.",
        workTitle: "Romeo and Juliet",
        workAuthor: "William Shakespeare",
        passageReference: "Act I scene iii onward",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Euripides' Hippolytus and Medea both feature the nurse-confidante type — the older woman who carries the heroine's secret, negotiates her suffering, and propels the plot. The Greek archetype runs through Virgil's Barce (Dido's nurse) to Spenser's Glauce.",
        workTitle: "Hippolytus",
        workAuthor: "Euripides",
        passageReference: "Hippolytus lines 170–500",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 8. Britomart as structural hermaphrodite ──────────────────────
  {
    id: "fq-3-2-britomart-hermaphrodite",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "proper praise",
    anchorOccurrence: 1,
    title: "Britomart the warrior-in-love — the structural paradox",
    quotedPassage:
      "That in their proper praise too partiall bee",
    passageReference: "Book III canto ii, proem",
    commentary: `Book III canto ii stages a structural paradox that runs through Britomart's whole arc in Books III, IV, and V: she is the active subject of the romance-quest narrative, but the narrative she pursues is the love-plot of a knight-falls-for-woman. She occupies both positions at once.

Put simply: in traditional chivalric romance, Knight sees Lady → Knight falls in love → Knight quests to win Lady → Knight fights obstacles → Knight rescues Lady → Marriage. Britomart occupies the Knight position (she is the figure armored in armor, riding, fighting) but her object of love is *another knight*, Artegall. The love-object is male; the lover is female; the romance's gendered positions have been rotated 90 degrees.

This is the structural "hermaphrodite" (to use the Renaissance term; Spenser himself uses related imagery in IV.x.41 when he describes the reunion of Amoret and Scudamour as a "hermaphrodite" figure of married love). Britomart is a *hermaphroditic* figure in the plot-position sense — she does what in other romances only a male knight does, while being unambiguously a woman. The canto-ii mirror-vision is where the paradox is set up: a young woman sees a man in a mirror and then *arms herself and rides out to find him*, which is the chivalric hero's quest-frame applied to the lady's erotic aim.

One thing the 1590 reader would have noticed and a modern reader might miss: this is not transgressive gender-bending in the modern activist sense. Renaissance readers had a category for the *virago* — the woman-with-manly-courage — and its most famous exemplars (Joan of Arc, Deborah in the Bible, Judith, the Amazons, Camilla, Bradamante) were celebrated figures. Elizabeth I herself was routinely described with masculine vocabulary (her Tilbury speech: "I know I have the body of a weak and feeble woman, but I have the heart and stomach of a king"). Britomart is a virago in the inherited tradition — entirely legible to Spenser's first readers.

What IS specifically Spenser's contribution is the *mirror-vision origin*. Virago figures in most traditions are warriors who happen also to have loves; Britomart is a warrior *because* she has a love, and the love is an image in a mirror. Her military-romantic-quest arc is entirely generated by the mirror-scene of canto ii. The rest of the poem's thirty-plus cantos of Britomart-narrative unfold from this single moment.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Ariosto's Bradamante and Marfisa are the immediate models for Britomart-as-virago: female knights in Orlando Furioso who fight alongside Charlemagne's paladins, with full chivalric equipment. Bradamante loves Ruggiero and pursues him (as Britomart loves Artegall); Marfisa has no love-plot. Spenser's Britomart compresses both Ariostan figures.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Bradamante: Cantos II–IV, XX–XXIII, XXXII–XLVI; Marfisa: Cantos XVIII–XXV",
        targetBookId: "orlando-furioso",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ── 9. The inversion of the romance gaze ──────────────────────────
  {
    id: "fq-3-2-inverted-gaze",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "For nothing he from her reserv'd apart",
    anchorOccurrence: 1,
    title: "The inverted gaze — a woman views a man, a man views himself viewed",
    quotedPassage:
      "It fortuned, one day, when Britomart / Was in her fathers closet to repayre; / For nothing he from her reserv'd apart, / Being his onely daughter and his heyre: / Where when she had espyde that mirrhour fayre",
    passageReference: "Book III canto ii, stanza 22",
    commentary: `Almost all canonical Western love-narrative places a male gaze at the origin. The man sees the woman; the woman is seen; the narrative's action flows from his attachment to what he has seen. Dante sees Beatrice, Petrarch sees Laura, Troilus sees Criseyde, Romeo sees Juliet, Aeneas sees Dido — the structural move is nearly universal.

Spenser's canto ii inverts this. *Britomart sees Artegall*. The woman is the viewer; the man, though not present, is the viewed. Britomart's falling-in-love is the active gaze; Artegall (who is not in the scene, not informed of Britomart's existence) is the passive object. Spenser has taken the originating scene of Western romance and rotated the gender positions.

A modern feminist critical tradition (following Laura Mulvey's 1975 essay on the male gaze in cinema, but with appropriate attention to Renaissance specificity in writers like Rosemary Kegl and Louis Montrose) has read this scene as Spenser's most direct encounter with the gendered politics of the gaze in sixteenth-century England. A full analysis is beyond an annotation's scope; what the annotation can do is flag that *this* is the inversion, that Spenser has chosen it, and that it is structurally load-bearing for the whole Book III–V Britomart arc.

A practical reading consequence: throughout Books III, IV, and V, when Britomart encounters men, the scene often involves her *looking at* them with a loving or evaluative gaze — Artegall in person in IV.vi, Scudamour and the paralysed Amoret she rescues in III.xii, the various knights she encounters. The gaze-direction is consistently Britomart-to-men rather than men-to-Britomart. Once you notice it, you cannot unnotice it. Spenser is writing a long arc in which the female protagonist is the viewer and the male figures are viewed.

The theology underneath is also worth holding: in Merlin's mirror, the "gaze" is providentially addressed. Britomart does not choose whom to view; the mirror shows her the man who *pertains to* her. The inversion of the gaze, in this frame, is not a human choice (Britomart deciding to look at men as men look at women) but a providential arrangement — her looking is God's disclosing. Gender politics and Christian providentialism sit at the same table in this canto.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dante's Vita Nuova III — Dante sees the nine-year-old Beatrice; the scene is the founding moment of Dante's erotic-spiritual life. The gender-standard direction (man sees woman, is transformed by seeing) is the template Spenser inverts with Britomart. The two scenes read together illuminate each other: Dante's template is the tradition Spenser is rotating.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Vita Nuova III (not in Commedia proper, but by the same author)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 10. Bradamante palette continuity made explicit ────────────────
  {
    id: "fq-3-2-bradamante-continuity",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "The great Magitien Merlin",
    anchorOccurrence: 1,
    title: "Britomart ← Bradamante — the Orlando Furioso inheritance",
    quotedPassage:
      "The great Magitien Merlin had deviz'd, / By his deepe science and hell-dreaded might, / A looking-glasse",
    passageReference: "Book III canto ii, stanza 18",
    commentary: `This canto is the pivot of the Orlando Furioso ↔ Faerie Queene relationship. Ariosto's Bradamante is the specific model for Britomart, and Merlin's mirror in Spenser is the specific counterpart of Merlin's cave in Ariosto.

**Character continuity:** Bradamante (Orlando Furioso, Cantos II–IV, XX–XXIII, XXXII–XLVI) is Charlemagne's niece, Rinaldo's sister, a peerless female warrior who falls in love with the Saracen Ruggiero, converts him, and marries him — producing the dynastic line that becomes the Este family, Ariosto's patrons. Britomart (Faerie Queene III–V) is a British princess, a peerless female warrior who falls in love with Artegall, pursues him, eventually marries him — producing the dynastic line of British kings that issues, eventually, in Elizabeth. The biographical architecture is the same: *peerless female warrior + dynastic destined marriage = the founding of a royal line*.

**Scene continuity:** Merlin's tomb in Orlando Furioso III / Merlin's mirror in Faerie Queene III.ii. In Ariosto, Melissa leads Bradamante into Merlin's tomb; Merlin's ghost speaks; Bradamante sees the procession of her future descendants. In Spenser, Britomart finds Merlin's mirror in her father's closet; the mirror shows her the face of Artegall; the nurse Glauce supplies the name. Both scenes are providential disclosure of the heroine's dynastic future. The two texts even name the same mage.

**Palette continuity:** The reader moving through the Great Epics library chronologically — Orlando Furioso (1516) → Faerie Queene (1590) — encounters Bradamante first in her silver-rose speaker palette (#A8A0B4 in the light theme) and then encounters Britomart in a blue-shifted silver-rose palette (#9A92B0) with a martial rose-gold accent (#D6A86A). The visual resemblance is deliberate and documented at src/data/faerie-queene/speakers.ts. Britomart is cooler, more explicitly martial than Bradamante; the palette is family-resemblance, not copy. The reader's eye catches the inheritance before the text explicitly flags it.

This is the single most demonstrable visual-narrative inheritance the Great Epics library offers. If you read these two canto-openings back to back — Orlando Furioso III and Faerie Queene III.ii — with palette coloring enabled, you will *see* the lineage in a way that text alone does not convey.

The differences between the two are also instructive. Ariosto's Bradamante is married into a converted Saracen line; Spenser's Britomart is wholly British. Ariosto's dynastic frame is Italian-courtly (the Este of Ferrara); Spenser's is English-Protestant-imperial (the Tudor line). Ariosto is celebrating a living patron-dynasty; Spenser is celebrating a sovereign. The inheritance is not slavish; it is adaptive.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Orlando Furioso Canto III (Bradamante in Merlin's tomb with Melissa; the parade of Este descendants) — the direct formal source for this entire Spenserian canto. Scene structure, character type, dynastic frame, and even the mage named (Merlin) are inherited directly. The palette continuity between Bradamante and Britomart is the visual signature of this textual inheritance.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto III",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 11. The dynastic framework beneath the mirror ──────────────────
  {
    id: "fq-3-2-dynastic-frame",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "Being his onely daughter and his hayre",
    anchorOccurrence: 1,
    title: "The Tudor-dynastic stakes of the vision",
    quotedPassage:
      "Being his onely daughter and his hayre",
    passageReference: "Book III canto ii, stanza 22 line 4",
    commentary: `Book III canto ii sets in motion a dynastic-genealogical arc that runs through the remainder of the poem and points out of it to Elizabeth I herself.

The argument, as Spenser builds it across Book III canto iii (Merlin's prophecy to Britomart through Glauce) and Book V: Britomart is destined to marry Artegall. Their union will produce a line of British kings. That line will run through the whole British legendary-historical past — through Arthur, through the Saxon and Norman successions, through the medieval English monarchy — and will arrive, at the far end of the descent, at *Elizabeth I*. Britomart is, in the poem's imaginative genealogy, the Tudor founder-mother. Artegall is the Tudor founder-father. Their union is the poem's celebration of the dynasty that employs its author.

This is Spenser's most ambitious providential-political claim, and it is enormous. Elizabeth is Gloriana (established in the Letter to Ralegh and Book I canto i). But Elizabeth is also, by this genealogical line, the *descendant* of the warrior-maiden Britomart whose love-story the poem tells. The poem celebrates Elizabeth from two directions at once: as the sovereign to whom the whole poem is addressed, and as the biological-imaginative descendant of its central heroine.

The mirror-vision in canto ii is the scene that sets all this in motion. If Britomart does not see Artegall in the mirror, she does not quest; if she does not quest, she does not marry; if she does not marry, the dynastic line does not form; if the line does not form, there is no Elizabeth. The gaze into Merlin's glassy globe is, structurally, the Tudor dynasty's *origin scene* in Spenser's imagination.

A modern reader is not required to take the genealogical claim seriously (the British kings of the Arthurian past are legendary rather than historical). But one is required to register that Spenser took it *poetically* seriously — as a framework for celebrating the living sovereign's place at the end of a long providential line. Book III canto ii's mirror-vision is the frame's first disclosure.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book III canto iii (Merlin's prophecy to Britomart) — the explicit payoff of this canto's set-up. Merlin, through Glauce, reveals the dynastic line descending from Britomart and Artegall down to Elizabeth. Canto ii is the set-up for canto iii's full disclosure. Read in sequence: Britomart sees Artegall (ii) → Britomart and Glauce consult Merlin (iii) → Merlin's prophecy of the British descent (iii).",
        workTitle: "The Faerie Queene (Book III canto iii)",
        workAuthor: "Edmund Spenser",
        passageReference: "Book III canto iii",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 28,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },

  // ── 12. The canto as narrative hinge ──────────────────────────────
  {
    id: "fq-3-2-narrative-hinge",
    bookId: "the-faerie-queene",
    chapterNumber: 27,
    anchorText: "despeire no whit",
    anchorOccurrence: 1,
    title: "Canto ii as the hinge — Book III, Book IV, Book V all open here",
    quotedPassage:
      "'O daughter deare!' (said she) 'despeire no whit; / For never sore but might a salve obtaine'",
    passageReference: "Book III canto ii, stanza 32",
    commentary: `A closing annotation on the structural weight of canto ii in the whole six-book architecture.

The events of Book III canto ii set in motion, by direct or indirect causation, almost every major narrative strand of the remaining four books:

**Book III:**
- Britomart, recovered from lovesickness, arms herself and rides out (canto iii)
- Britomart meets Florimell, encounters Malecasta (cantos iv), meets Paridell and Hellenore (canto x)
- Britomart's final rescue of Amoret from Busirane (cantos xi–xii)

**Book IV:**
- Britomart reunited with Amoret; her friendship-plot (cantos i–vi)
- Britomart actually fighting Artegall without recognizing him (canto vi)
- The revelation of Britomart's identity and Artegall's recognition of his prophesied love (canto vi — this scene is one of Book IV's quiet high points)
- Britomart and Artegall betrothed (canto vi end)

**Book V:**
- Artegall, Britomart's betrothed, goes on his own quest for Justice
- The Radigund sequence (cantos iv–vii) where Artegall is captured by the Amazon; Britomart rescues him
- The dynastic-political completion of the Artegall arc

*All* of this is downstream from canto ii. Britomart sees Artegall in the mirror; forty canto-equivalents of narrative follow. Critics have sometimes called this canto the "hinge" of the whole poem — the moment at which the six-book structure becomes, not a series of independent quests, but a single interconnected dynastic-erotic arc bearing the poem's deepest political meaning. The Letter to Ralegh told us each book would center on a virtue; canto ii reveals that the virtues are connected by a love-plot running through three of them.

A reader who invests in Britomart at this canto will be rewarded for the next forty cantos. A reader who skims canto ii will find Books IV–V harder to read, because they assume the emotional-dynastic stakes that canto ii establishes. Like the Letter to Ralegh, this canto is door-furniture: it lets you into the rest of the house.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book IV canto vi — Britomart and Artegall's combat, her identity revealed, their betrothal. The payoff scene for the mirror-vision Britomart experienced in canto ii. The scene is one of Book IV's finest; reading it benefits enormously from having read canto ii attentively.",
        workTitle: "The Faerie Queene (Book IV canto vi)",
        workAuthor: "Edmund Spenser",
        passageReference: "Book IV canto vi",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 43,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
]
