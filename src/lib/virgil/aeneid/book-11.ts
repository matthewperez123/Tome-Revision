import type { Annotation } from "../types"

// ── Aeneid Book XI — Camilla ────────────────────────────────────────────
// Dryden; anchors against public/content/the-aeneid/ch-10.json.
//
// Book XI is structurally the calmest of the war-books: funeral for
// Pallas, an embassy of truce, a long debate in the Latin senate, and
// then — in the book's tonal center — the aristeia and death of Camilla,
// the warrior-maiden introduced in Book VII. The book also sets up the
// final single combat of Book XII.

export const AENEID_BOOK_11: Annotation[] = [
  {
    id: "aeneid-11-pallas-funeral",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "Peace with the manes of great Pallas dwell",
    anchorOccurrence: 1,
    title: "Pallas's funeral cortege — the price of Book X",
    quotedPassage:
      "Peace with the manes of great Pallas dwell!",
    passageReference: "Book XI, line 145 ff. (Dryden) · Aeneid XI.29–99",
    commentary: `Book XI opens with the funeral of Pallas. A thousand men escort the bier; Aeneas walks beside it; the Arcadian cavalry leads; the young dead king's horse trails behind, weeping (Virgil gives the horse visible tears — *it lacrimans* — one of the quietest images of grief in the poem). The cortege travels from the camp to Evander's Pallanteum up the Tiber.

The scene is structural. Virgil is taking the time — eighty lines — to let the grief of Book X register before the war resumes. It is also deliberately anti-Iliadic: Homer's Patroclus gets a funeral at Troy among his comrades; Virgil's Pallas gets a funeral that *returns him* to his father's grieving city. The geography of the grief is different. Pallas is going home dead, and the poem makes us feel every mile.

Evander's lament, when he receives the body, is one of the Aeneid's most anguished speeches. He wishes he had died in Pallas's place. He blames himself for letting the boy go. He curses Turnus and binds Aeneas to vengeance. The vengeance-oath is the fuse for Book XII.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-11-truce",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "A truce, with olive branches in their hand",
    anchorOccurrence: 1,
    title: "The truce — Italians ask to bury their dead",
    quotedPassage:
      "A truce, with olive branches in their hand…",
    passageReference: "Book XI, line 150 ff. (Dryden) · Aeneid XI.100–138",
    commentary: `An Italian embassy arrives, asking Aeneas for a twelve-day truce to collect and bury their dead. Aeneas grants it immediately, and in a short speech expresses grief that the war is happening at all: he came to Italy hoping for a home, not a war; Turnus is the cause of the war, not he; if Turnus will meet him in single combat, everyone else can stop dying.

The scene is Aeneas at his most *pius*. He honors enemy dead. He offers the closing move — single combat — that would save Italian lives. He is exactly the civic-minded foreign leader Virgil's ideology wants him to be. For a moment, the poem's moral frame is unambiguous: Aeneas is reasonable, Turnus is the obstacle, the whole war could end with one duel.

Book XI is in part the Aeneid's argument for its own hero. The Book XII ending has to be read against this Book XI middle, where Aeneas's behavior is model-Roman. The reader needs to remember: before the killing of Turnus, there was this *pietas* — a willingness to grieve enemy dead and to stop the slaughter with a single duel. If Aeneas's Book XII final act reads as *furor*, it is *against* the Book XI demonstration of *pietas*.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad XXIV — Priam comes to Achilles under truce to ransom Hector's body. Virgil's scene is a structural echo: enemies meeting to bury their dead. The Homeric scene ends in reconciliation; Virgil's truce expires without reconciliation and war resumes.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIV (the ransom)",
        targetBookId: "the-iliad",
        targetChapterNumber: 24,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-11-drances-debate",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "And care employ\u2019d, their embassy is lost",
    anchorOccurrence: 1,
    title: "The Latin senate — Drances against Turnus",
    quotedPassage:
      "And care employ'd, their embassy is lost…",
    passageReference: "Book XI, lines 350 ff. (Dryden) · Aeneid XI.213–444",
    commentary: `The Italian embassy returns to Latinus's city with the news of the truce and of Aeneas's offer of single combat. The senate debates. The loudest speaker against Turnus is Drances — an older aristocrat, respected but long known as Turnus's rhetorical enemy. He argues for making peace with Aeneas and giving Lavinia to him as originally planned. Turnus replies with contempt, calling Drances a coward who speaks because he cannot fight.

The debate is Virgil's most sustained piece of political rhetoric in the poem. It is also, structurally, the last moment when Book XII's ending could have been avoided. If the Latin senate had voted for peace, Aeneas would not have faced Turnus in single combat; the war would have ended on the truce terms. The senate does not vote for peace — the news arrives that Aeneas and his Trojans have resumed the march on the city — and the debate is cut off.

The Drances-Turnus exchange is studied by rhetoric students as a specimen of competing debate-styles: Drances the elderly moderate (attacked as a coward for speaking reason), Turnus the young firebrand (attacked as reckless for refusing reason). Virgil does not take sides cleanly. Drances's peace is possible; Turnus's honor is also legible. Neither speaker is wrong; neither is completely right. The debate is the Aeneid's portrait of civic deliberation failing to stop the war it could have stopped.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },
  {
    id: "aeneid-11-camilla-arrives",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "Whose common suit Camilla thus commends",
    anchorOccurrence: 1,
    title: "Camilla arrives — the warrior-maiden takes command",
    quotedPassage:
      "Whose common suit Camilla thus commends…",
    passageReference: "Book XI, line 758 ff. (Dryden) · Aeneid XI.498–519",
    commentary: `Camilla, the Volscian warrior-maiden introduced at the end of Book VII, takes command of the Italian cavalry. Virgil describes her leading a thousand horsemen into battle against the advancing Trojans and Etruscans. She will dominate the rest of the book until her death.

Her military style is specific: she fights on horseback, carries a double-headed battle-axe, and is described shooting arrows while turning — the Parthian shot, a technique the Romans associated with Eastern steppe peoples. She is, in effect, a cavalry commander written onto an Italian plain.

Camilla is one of Virgil's most influential inventions. There are partial classical precedents (the Amazons, especially Penthesilea in the lost *Aethiopis*), but Virgil's Camilla is more developed than any of them. Her backstory (told by Diana later in the book: exiled as an infant, raised in the forest by her father who dedicated her to Diana, nourished on wild mare's milk), her personality (chaste, skilled, proud), and her death (by a treacherous arrow-shot) form a complete character-arc. The warrior-maiden as a type in Western European literature — Britomart in Spenser, Clorinda in Tasso, Bradamante in Ariosto, a lineage that reaches to the modern fantasy tradition — has Camilla as its prototype.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Spenser's Britomart (Faerie Queene III), Tasso's Clorinda (Gerusalemme Liberata), Ariosto's Bradamante (Orlando Furioso), and countless modern inheritors are partly descended from Camilla. The type-specimen is here.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XI (Camilla)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-11-metabus",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "Her father Metabus",
    anchorOccurrence: 1,
    title: "Camilla's backstory — Metabus at the river",
    quotedPassage:
      "Her father Metabus, when forc'd away…",
    passageReference: "Book XI, line 815 ff. (Dryden) · Aeneid XI.535–596",
    commentary: `Diana, watching Camilla ride into what Diana knows will be her last battle, tells the nymph Opis the story of Camilla's infancy. Metabus, an exiled Volscian tyrant, was fleeing pursuers with the infant Camilla when he reached a swollen river. He tied the baby to his spear, prayed to Diana to receive her as a votary, and hurled the spear across the river. Then he swam across himself, retrieved her, and raised her in the forest on wild mare's milk — dedicating her to Diana.

The scene is Virgil at his most compact-mythological. Five small beats — exile, river, tied baby, spear-cast, forest childhood — form a complete origin story. The image of a father throwing his infant across a river tied to a spear has been almost as influential as Camilla herself, appearing in medieval religious art as a type-scene for child-rescue.

The backstory also prepares Camilla's death. Diana tells Opis that Camilla's vow to Diana is the reason Camilla has the speed and skill she has, and that Camilla's death — which Diana cannot prevent — will require vengeance. Opis is instructed to kill whoever kills Camilla. That vengeance will close the book.`,
    crossReferences: [],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "aeneid-11-camilla-aristeia",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "As strike the sense, and all replies are vain",
    anchorOccurrence: 1,
    title: "Camilla's aristeia — hunt and be hunted",
    quotedPassage:
      "As strike the sense, and all replies are vain… / So many valiant heroes bite the ground.",
    passageReference: "Book XI, lines 520–528 ff. (Dryden) · Aeneid XI.648–835",
    commentary: `Camilla's extended battle sequence is the book's main action — 200+ lines of named kills, cavalry exchanges, and single-combats won. She kills Eunaeus, Liris, Pagasus, Tanais, Butes, Orsilochus, Aunus (the treacherous Ligurian who tries to trick her and is unhorsed), and others. Virgil catalogues each death-scene briefly; the pattern is Homeric but Virgil's register is more precise, each small portrait glimpsed in the act of dying.

The *aristeia* is also the book's most specific portrait of cavalry warfare in the Aeneid. Horsemanship, the Parthian shot, the wheel-and-return, the pursuit — Virgil is interested in the military particulars. The Aeneid in general prefers formal single-combats on foot (the Iliadic register); Book XI is the book that gets the horses right.

Camilla's limitation is set up carefully. She is obsessed with a Trojan priest of Cybele, Chloreus, who rides in gold-decorated armor on a caparisoned horse. She pursues him across the field, *femineō praedae et spoliōrum ardēbat amōre* — "burning with a feminine love of plunder and spoils." Virgil's phrasing is pointed: Camilla, at the critical moment, behaves in a way the poem names *feminine* (the only time it does so about her). The distraction is fatal.`,
    crossReferences: [],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-11-chloreus",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "Chloreus, the priest of Cybele",
    anchorOccurrence: 1,
    title: "Chloreus — the Trojan priest who is the bait",
    quotedPassage:
      "Chloreus, the priest of Cybele, from far…",
    passageReference: "Book XI, line 1131 ff. (Dryden) · Aeneid XI.768–782",
    commentary: `Chloreus is a minor Trojan priest of Cybele (the Phrygian mother-goddess, whose cult was adopted into Rome in 205 BC). Virgil dresses him lavishly — saffron robes, gold-decorated Phrygian bow, purple cloak with gold clasps, a horse barded with bronze scales. He is described as riding at the edge of the Trojan formation.

Camilla pursues him. Every detail of his ornament — every gold fitting, every scale of the horse-armor — is named. Virgil makes the reader SEE what Camilla is seeing, so that Camilla's blindness to the field around her is registered as optical: she is fascinated by the glittering object in the middle distance.

This is Virgil's most morally specific account of how great warriors die. Not from weakness of arms, not from lack of courage — from *attention captured by the wrong thing*. The lesson is Stoic (Epictetus could have written it) but the image is Virgilian: the gold-armored priest as the wrong fixation, the warrior-maiden concentrating on the wrong part of the battlefield, the archer Arruns closing from the other side unseen.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-11-arruns-kills-camilla",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "As with an engine\u2019s force",
    anchorOccurrence: 1,
    title: "Camilla dies — the treacherous javelin",
    quotedPassage:
      "As with an engine's force, or lightning's blast: / So swelling surges, with a thund'ring roar…",
    passageReference: "Book XI, lines 919–929 (Dryden) · Aeneid XI.778–835",
    commentary: `Arruns, a Trojan who has been stalking Camilla, throws a javelin while she is focused on Chloreus. The javelin enters her breast. Her companions rally to her; she hands command over to Acca and tells Turnus to break off from the ambush he is preparing and come to the rescue. She dies.

Virgil marks her death with a version of the same line he will use for Turnus in Book XII: *vītaque cum gemitū fugit indignāta sub umbrās* — "and her life, with a groan, fled indignant to the shades" (Aeneid XI.831, same line as XII.952). The repetition is deliberate. Camilla's and Turnus's deaths are given the same closing formula. Virgil is telling the reader, by the shared line, that the two deaths belong to the same moral category: warriors from the losing side, killed on their own ground, departing indignant that the war ended the way it did.

Arruns flees from the field, celebrating; Diana's nymph Opis tracks him and kills him with an arrow. The vengeance is instant. Virgil closes Camilla's arc with the narrative moral balanced.

The death of Camilla is the Aeneid's single most-painted scene in medieval and Renaissance iconography. She is the warrior-maiden the tradition returned to — dying on the battlefield, her companions clustered around her, a commander in her last breath passing command to her lieutenant. The type-scene is Virgilian.`,
    crossReferences: [
      {
        type: "echo",
        description: "The closing line used for both Camilla here and Turnus in Book XII (vitaque cum gemitu fugit indignata sub umbras) is Virgil's most formally revealing repetition. The same sentence for the same kind of death: a tragic enemy leaving the world unreconciled.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, line 952 (the last line of the poem)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic", "mythological"],
  },
  {
    id: "aeneid-11-acca-message",
    bookId: "the-aeneid",
    chapterNumber: 10,
    anchorText: "Acca, \u2019tis past! he swims before my sight",
    anchorOccurrence: 1,
    title: "Acca's message — Turnus brought out of ambush",
    quotedPassage:
      "\"Acca, 'tis past! he swims before my sight…\"",
    passageReference: "Book XI, line 1197 ff. (Dryden) · Aeneid XI.820–895",
    commentary: `Camilla's lieutenant Acca rides to find Turnus, who has been concealed in an ambush along Aeneas's line of march. The ambush would have caught Aeneas in a defile; if Turnus had stayed there until Aeneas reached the narrow pass, Book XII might never have happened. Camilla's death pulls Turnus out of the ambush to reinforce the collapsed cavalry.

When Turnus leaves his hiding place to respond to Acca's news, Aeneas passes through the defile unscathed and reaches the open ground. The strategic opportunity for the Italian side is wasted. Turnus's grief at Camilla's death, which makes him leave the ambush, also ensures that the war can only be settled now in the open, in single combat.

This is the tactical pivot to Book XII. Virgil is registering that Camilla's death, besides being tragic in its own right, is the event that determines how the war will end. Had Turnus stayed in the ambush, Aeneas might have died in a defile. Camilla's death saves Aeneas, loses Turnus, and produces the final duel. The architectural care with which Virgil engineers his endings is visible here: every major death is also a strategic turn.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The Book XI end is the tactical setup for Book XII. Turnus leaves the ambush out of grief; Aeneas passes unhindered; the single combat becomes inevitable. The Aeneid is a novel about how contingencies produce inevitabilities.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (the single combat)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
]
