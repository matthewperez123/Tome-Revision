import type { Annotation } from "../types"

// ── Aeneid Book IV — hand-authored scholarly annotations ─────────────────
// John Dryden's 1697 heroic couplets. Anchors line-exact against
// public/content/the-aeneid/ch-3.json.
//
// Book IV is Virgil's most imitated book — the Dido tragedy. The book's
// single-night action (the hunt, the cave, the storm, the consummation),
// its long-burning middle (Rumor, Mercury's first descent, the departure
// debate), and its climactic pyre-curse-suicide sequence have been
// written-against by every European tradition from Ovid through Berlioz
// to Ursula K. Le Guin. Dante's Francesca in Inferno V is the direct
// medieval response.
//
// Density: 13 annotations.

export const AENEID_BOOK_4: Annotation[] = [
  // ── 1. The opening — Dido already wounded ──────────────────────────────
  {
    id: "aeneid-4-flame-unseen",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "She fed within her veins a flame unseen",
    anchorOccurrence: 1,
    title: "A flame unseen — the book opens on a wound",
    quotedPassage:
      "But anxious cares already seiz'd the queen: / She fed within her veins a flame unseen; / The hero's valour, acts, and birth inspire / Her soul with love, and fan the secret fire.",
    passageReference: "Book IV, lines 1–4 (Dryden) · Aeneid IV.1–5",
    commentary: `The Latin's first word of the book is *at* — "but." The conjunction is jarring. Book III has just ended with Aeneas finishing his tale at the Carthaginian banquet; Book IV begins with the word that marks a change of direction, *but*, and turns the attention from the hero who has been narrating to the queen who has been listening. The adversative is the first sign that Dido's story is about to become a tragedy fought against the Aeneid's main line.

The phrase Dryden renders as "a flame unseen" is Virgil's *caeco carpitur ignī* — "she is consumed by a blind fire." *Caecus* in Latin is literally "blind" but extends to mean "unseen, unlit, hidden." Virgil is using the word as a physician uses it: this is a fire burning inside a body without external evidence. The erotic condition Book IV will unfold is presented, from the first line, as *illness*.

The medical diction is not idle. Greek and Roman love-poetry from Sappho through Catullus had characterized love as a wound, a fever, a madness — a pathology. Virgil is inheriting that whole tradition and installing it as the premise of Book IV. By the end of the book Dido will be dead of the wound named in line 2. Virgil is telling us, quietly, that this is a medical case-history as well as a tragedy.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The direct source for the love-as-illness opening is Apollonius's Argonautica III, where Medea, watching Jason, is struck by Eros's arrow and burns with the same caecus ignis. Virgil's Dido episode is the Roman Medea — same structural move, same medical metaphor, different ending.",
        workTitle: "Argonautica",
        workAuthor: "Apollonius Rhodius",
        passageReference: "Book III (Medea falls in love with Jason)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },

  // ── 2. Anna's counsel ──────────────────────────────────────────────────
  {
    id: "aeneid-4-anna-counsel",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "My dearest Anna",
    anchorOccurrence: 1,
    title: "Anna's counsel — the sister who says yes",
    quotedPassage:
      "\"My dearest Anna, what new dreams affright / My lab'ring soul! what visions of the night / Disturb my quiet, and distract my breast / With strange ideas of our Trojan guest!\"",
    passageReference: "Book IV, lines 11–14 (Dryden) · Aeneid IV.9–30",
    commentary: `The opening scene is a conversation between sisters. Dido, having lain awake all night, tells Anna her conflict: she had sworn never to love again after her first husband Sychaeus was murdered, but Aeneas has undone the oath. Anna's reply is the book's first catastrophic speech.

Anna's counsel is not villainous — she is trying to help. She argues that Dido is young, lonely, surrounded by African enemies (Iarbas and his kin), and that marrying Aeneas will strengthen Carthage politically. Every point is reasonable in isolation. The composite argument rationalizes what Dido already wants.

Two observations:

**Anna is the enabler.** Virgil has set up the tragic structure so that the person who loves Dido most and wishes her least harm is the one who gives her permission to destroy herself. This is one of the Aeneid's signatures — the characters whose motives are pure are not thereby protected from contributing to catastrophe. *Pietas* is no guarantee against tragedy.

**The dream-and-confession framing is Greek.** Medea in Apollonius and Phaedra in Euripides both open their tragedies by confessing their forbidden love to a confidante. Virgil is using the structural template of Greek tragedy — a confession-scene followed by a divine-machinery-scene — and slotting Dido into it. By the time the book opens in earnest, Dido is already positioned as a tragic heroine whose death is structurally inevitable.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Euripides's Phaedra (Hippolytus) and Apollonius's Medea both use the confession-to-a-nurse-or-sister scene as their tragic opening. Virgil is compressing the Greek tragic template into a single reported conversation.",
        workTitle: "Hippolytus",
        workAuthor: "Euripides",
        passageReference: "lines 198–524 (Phaedra's confession to the Nurse)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 3. The wounded deer simile ─────────────────────────────────────────
  {
    id: "aeneid-4-wounded-deer",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "Wounds with a random shaft the careless hind",
    anchorOccurrence: 1,
    title: "The wounded deer — the defining simile of Book IV",
    quotedPassage:
      "The Cretan huntsman, who with care pursues / His destin'd quarry, and with winged shafts / Through woods and lawns, on Dicte's lofty brow, / Wounds with a random shaft the careless hind, / Distracted with her pain she flies the woods, / Bounds o'er the lawn, and seeks the silent floods, / With fruitless care; for still the fatal dart / Sticks in her side, and rankles in her heart.",
    passageReference: "Book IV, lines 93–100 (Dryden) · Aeneid IV.68–73",
    commentary: `The defining simile of Book IV and one of the most influential extended similes in Western literature. Dido, pierced by love, is compared to a doe shot by a Cretan huntsman. The arrow stays in her side as she runs through the forest; she cannot escape the wound because she is carrying it with her.

Three things to notice about Virgil's version:

**The hunter is unnamed.** The arrow is *ignāra* — unknowing, random. Dryden's "random shaft" is accurate. The man who shot the doe does not know what he has done, and the poem is careful about that. Aeneas is not a villain; he is a man who has wounded someone without meaning to. Virgil is painting erotic injury as a form of moral accident — one party innocent of the injury, the other dying of it.

**The wound travels.** The doe runs and the arrow runs with her. Virgil is making the spatial image do theological work: what has happened to Dido is not a place but a condition. She can move through Carthage, the palace, the forest — the arrow is still there. The Latin line *haeret laterī lētālis harundō* — "the deadly shaft sticks in her side" — is the clinical diagnosis of Book IV.

**The simile is a source of later European literature.** Dante uses it in *Inferno* XIII for the suicides; Wyatt writes a famous Tudor translation ("Whoso list to hunt, I know where is an hind") where the hunted doe becomes Anne Boleyn under Henry VIII's court; Jan van Eyck hides a deer in the corner of the Ghent Altarpiece that some iconographers read as Mary-as-Dido. The single image has migrated through Christian theology, Renaissance court poetry, and Counter-Reformation devotion. It is Virgil's most portable image, and Dido dies with the arrow still in her.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Wyatt's 1535 sonnet 'Whoso list to hunt, I know where is an hind' picks up Virgil's image and Petrarch's intervening appropriation of it (Rime 190). Wyatt's doe is Anne Boleyn; Henry VIII is the hunter; the poem's 'noli me tangere' ('do not touch me') is a New Testament echo laid over the Virgilian wound. Three traditions in one poem.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV (the deer simile)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 4. The hunt and the cave ───────────────────────────────────────────
  {
    id: "aeneid-4-cave-storm",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "One common cavern in her bosom hides",
    anchorOccurrence: 1,
    title: "The cave — a marriage staged by the gods",
    quotedPassage:
      "The queen and prince, as love or fortune guides, / One common cavern in her bosom hides. / Then first the trembling earth the signal gave, / And flashing fires enlighten all the cave; / Hell from below, and Juno from above, / And howling nymphs, were conscious of their love.",
    passageReference: "Book IV, lines 239–244 (Dryden) · Aeneid IV.160–172",
    commentary: `The machinery of the scene is that Juno and Venus, for their own conflicting purposes, have agreed to stage the consummation. Juno wants Aeneas diverted from Italy (as long as he stays with Dido, the Roman imperial project is delayed); Venus wants her son comforted and Dido bound to protect him. Their agreement produces a storm during the royal hunt; Dido and Aeneas take shelter in the same cave; what happens there is the book's pivotal event.

Virgil's description of what happens in the cave is deliberately elliptical. The Latin is only a few lines long; it names the moment but does not describe it. The crucial line is *ille diēs prīmus lētī prīmusque malōrum / causa fuit* — "that day was the first of death, and the first cause of sorrows." Dryden renders: "The first of death, and beginning of her woes." The line is devastating because the *dies* (day) is named *causa* (cause) — this is when the story turned, and Virgil marks the turning explicitly.

Two observations:

**Dido calls it marriage; the gods do not.** The Latin word Virgil gives Dido is *coniugium* (marriage); the narrator pointedly does not confirm it. Virgil is leaving the reader with a question that Dido has already answered for herself but the cosmos has not endorsed: was this a wedding, or was it a storm that threw two people into the same cave?

**The nymphs howl.** Virgil writes that on the mountain-tops the nymphs cried out. Dryden renders it straight. The howl is ambiguous — divine celebration, divine mourning, or a generic augury — and Virgil leaves it uninterpreted. The cave scene is the moral center of the book, and the most layered piece of writing in it is what Virgil chose *not* to say.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante places Dido among the lustful in Inferno V — the circle of those who let passion overrule reason. Dante knows Aeneid IV; he reads this cave scene as the decisive moral moment. His Francesca, who falls into the same circle after reading a romance together with Paolo, is Dante's own Dido — a woman undone by a story about love.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto V, lines 61–62 (Dido), 121–138 (Francesca)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 5. Fama — personified Rumor ────────────────────────────────────────
  {
    id: "aeneid-4-fama",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "Fame, the great ill, from small beginnings grows",
    anchorOccurrence: 1,
    title: "Fama — Virgil invents the personification of Rumor",
    quotedPassage:
      "Fame, the great ill, from small beginnings grows: / Swift from the first; and ev'ry moment brings / New vigour to her flights, new pinions to her wings. / Soon grows the pigmy to gigantic size; / Her feet on earth, her forehead in the skies. / Enrag'd against the gods, revengeful Earth / Produc'd her last of the Titanian birth… / Millions of opening mouths to Fame belong, / And ev'ry mouth is furnish'd with a tongue, / And round with list'ning ears the flying plague is hung.",
    passageReference: "Book IV, lines 252–272 (Dryden) · Aeneid IV.173–197",
    commentary: `This is Virgil's most famous extended personification, and it inaugurates the Western personification of Rumor / Gossip / Report. He invents the image of Fama as a monster — Earth's daughter in revenge against the Olympians — with a thousand tongues and ears, growing as she moves, beginning small and ending enormous, mixing truth with lies without discrimination. Dryden preserves the accumulative rhythm; the Latin is one of the densest pieces of set-piece description in the entire poem.

What the Fama passage *does* in the plot is deliver the news of Dido and Aeneas's affair to Iarbas, the African prince Dido had rejected. Iarbas prays to Jupiter; Jupiter sends Mercury; Mercury orders Aeneas to leave. The machinery is: an affair, a rumor, a rejected suitor's prayer, a divine command to end it. Virgil is showing that the affair's destruction is caused not by any single villain but by the ecology of speech — by what people will say once they know.

The personification has been enormously influential. Shakespeare's *Henry IV Part 2* opens with "Rumour, painted full of tongues" — a direct Virgilian descendant. Ovid's *Metamorphoses* XII gives the House of Fame, a palace with countless entrances and no door-porter, that is Virgil's creature housed. Chaucer writes *The House of Fame* from Ovid's model. Virgil's monster is the common ancestor of every later allegorical figure of public report.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Shakespeare's Henry IV Part 2 opens with the prologue 'Rumour, painted full of tongues' — the character is a direct descendant of Virgil's Fama, with the multi-tongued body translated to the Jacobean stage.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV (the Fama passage)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Ovid, Metamorphoses XII.39–63, housings Virgil's Fama in a palace with countless entrances — the 'House of Fame.' Chaucer's fourteenth-century English poem of the same title is the English-language descendant. All three are Virgil's monster elaborated.",
        workTitle: "Metamorphoses",
        workAuthor: "Ovid",
        passageReference: "Book XII, lines 39–63",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "mythological"],
  },

  // ── 6. Mercury's descent ───────────────────────────────────────────────
  {
    id: "aeneid-4-mercury-descent",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "He calls Cyllenius, and the god attends",
    anchorOccurrence: 1,
    title: "Mercury descends — the command that ends the affair",
    quotedPassage:
      "He calls Cyllenius, and the god attends, / By whom his menacing command he sends… / And, whether o'er the seas or earth he flies, / With rapid force they bear him down the skies.",
    passageReference: "Book IV, lines 326–352 (Dryden) · Aeneid IV.219–278",
    commentary: `Jupiter, stirred by Iarbas's complaint, sends Mercury to Aeneas with a direct order: leave Carthage, sail for Italy. Virgil gives Mercury the full descent-from-Olympus treatment — the winged sandals, the caduceus, the flight past Atlas, the pause in the air. The visual inventory of the messenger-god is Homeric (compare Hermes in Iliad XXIV descending to Priam), and Virgil is consciously doing the Homeric bit before he lands his un-Homeric blow.

The blow is Mercury's speech to Aeneas. Dryden gives it straight: "Forget not why you were born; heav'n ordains you to another country." Mercury accuses Aeneas of wasting his destiny on a woman's feast: "You are building the walls of *her* city; you have forgotten your own." It is the first time in the poem Aeneas is scolded by name. Up to Book IV he has been the pious hero; in Book IV he is, for a moment, a man whose *pietas* has lapsed.

This is one of the book's cruelties. Aeneas has done what any Homeric hero would be praised for: arrived safe at a foreign court, been welcomed by the queen, established himself. But the Aeneid is a *Roman* poem, and the Roman ethic will not let him stay. Mercury is the Roman ethic walking into the narrative and ending the Homeric idyll. When Aeneas tells Dido later that "Italy is not a land I have chosen" (*Italiam nōn sponte sequor*), he is telling the truth: Italy is chosen for him, the way a conscript is chosen, and the scolding from Mercury is the draft notice.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The descent of Hermes/Mercury from Olympus is a Homeric formula — Iliad XXIV (Hermes leading Priam to Achilles's tent), Odyssey V (Hermes to Calypso). Virgil uses the Homeric formula to deliver a message Homer would not have dared: forget the woman and go.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIV (Hermes's descent)",
        targetBookId: "the-iliad",
        targetChapterNumber: 24,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 7. Italiam non sponte sequor ───────────────────────────────────────
  {
    id: "aeneid-4-italiam-non-sponte",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "Eliza shall a Dardan lord obey",
    anchorOccurrence: 1,
    title: "Italiam non sponte sequor — the line the lovers fight over",
    quotedPassage:
      "\"Hence never more; and, as I never vow'd / A marriage, never was to fraud allow'd… / Italy is not a land I choose; the fates / Compel me there…\"",
    passageReference: "Book IV, lines 491–533 (Dryden) · Aeneid IV.340–361",
    commentary: `Aeneas's reply to Dido's furious reproach contains one of the most contested lines in Latin poetry: *Italiam nōn sponte sequor* — "I do not pursue Italy willingly." Dryden makes the sense clear, though his English spreads the Latin compactness across two or three lines.

The line is contested because Dido hears it as a lie. If Aeneas did not choose Italy, she reasons, then what is dragging him away from Carthage? The gods? And if the gods, why has Jupiter who promised him Rome not *also* given him permission to stay with a queen who loved him? Dido sees through the fatalist defense to what it covers: Aeneas is leaving because Aeneas is leaving, and the *fate* he is citing is an excuse.

The scholarly tradition has been fighting about whether Aeneas is lying for two thousand years. The most careful reading, probably, is that he is not lying but that what he says is not the whole truth. The gods have ordered him to leave. He has also — unstated, under the order — come to accept the order. He could have hesitated; Mercury accused him of dallying; the truth is that he has chosen to obey. *Nōn sponte* is accurate as far as it goes and unforgivable because of what it refuses to admit.

Dido's response — the speech that begins "No, thou are not sprung of goddess, no nor Dardanus was thy father, but the ragged rocks of Caucasus bore thee, and Hyrcanian tigresses suckled thee" — is the single most famous speech of invective in Latin literature, and Dryden renders it in the full high register. "False one!" she calls him. The Latin word is *perfide* — "faithless one." The epithet will haunt him through Book VI, where she sees him again as a shade and will not speak.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The charge of being 'sprung from a rock, suckled by a tigress' is Homeric (Patroclus to Achilles, Iliad XVI.33–35). Virgil is having Dido echo the Iliadic formula for emotional cruelty, and the allusion makes her more Iliadic than Aeneas at that moment — the more Homeric hero in the scene is the abandoned woman.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XVI, lines 33–35",
        targetBookId: "the-iliad",
        targetChapterNumber: 16,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },

  // ── 8. The pyre ────────────────────────────────────────────────────────
  {
    id: "aeneid-4-the-pyre",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "Erect a lofty pile, expos\u2019d in air",
    anchorOccurrence: 1,
    title: "The pyre — the staging of the suicide",
    quotedPassage:
      "\"Erect a lofty pile, expos'd in air: / Hang on the topmost part the Trojan vest, / Spoils, arms, and presents, of my faithless guest. / The nuptial bed, where I my ruin wrought, / Must be consum'd; whatever minds me of the wretch I hate, / Must share one common fate.\"",
    passageReference: "Book IV, lines 713–722 (Dryden) · Aeneid IV.495–508",
    commentary: `Dido tells Anna to build a funeral pyre in the inner courtyard and pile onto it everything Aeneas left behind — clothes, arms, the marriage bed, his sword. Anna takes it as a magic rite meant to free Dido from her love. The reader knows it is the pyre on which Dido will kill herself.

This is one of Virgil's most controlled pieces of dramatic irony. Dido tells Anna the lie she needs her sister to believe, and Anna believes it because it matches what she already wanted to be true. Everyone in Carthage participates in Dido's suicide as though it were a healing ritual. The servants gather wood, strew herbs, bring water; Dido weaves the preparations with the calm of someone who has decided. Virgil writes the ritual care explicitly. The pyre is built by the people she has ruled, for a purpose she has hidden from them.

The image of the pyre has been central to every subsequent Dido tradition. Ovid's *Heroides* VII is a letter Dido writes to Aeneas from beside the pyre. Purcell's opera *Dido and Aeneas* (1689) ends on "When I am laid in earth" — the aria Dido sings on the pyre. Berlioz's *Les Troyens* (1863) uses the same climactic staging. The pyre is the single most iconic object in post-classical Aeneid reception, and Book IV spends forty lines building it.

Note a small technical observation: the pyre is composed of *alienīs* — "other things," things belonging to others. The death is specifically a death *among the things someone else left*. Dido will kill herself lying on Aeneas's sword in Aeneas's bed covered with Aeneas's clothes. The objects are the vocabulary of her death.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Purcell's 1689 opera Dido and Aeneas ends with Dido's aria 'When I am laid in earth' — a direct theatrical descent from the Book IV pyre scene. The aria's ground bass is a slow pulsing death-knell; the libretto is Nahum Tate's compression of Virgil's IV.651–666 into English lyrics.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV (the pyre)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 9. Dido's curse — Hannibal prefigured ──────────────────────────────
  {
    id: "aeneid-4-curse",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "Rise some avenger of our Libyan blood",
    anchorOccurrence: 1,
    title: "The curse — Hannibal in the mouth of Dido",
    quotedPassage:
      "\"Now, and from hence, in ev'ry future age, / When rage excites your arms, and strength supplies the rage / Rise some avenger of our Libyan blood, / With fire and sword pursue the perjur'd brood; / Our arms, our seas, our shores, oppos'd to theirs; / And the same hate descend on all our heirs!\"",
    passageReference: "Book IV, lines 899–904 (Dryden) · Aeneid IV.622–629",
    commentary: `Dido's final speech before she kills herself is a curse aimed at Aeneas and his descendants. She calls on the gods to ensure that a war without end rises between her people and his — that Carthage and Rome will never know peace, that an avenger will arise from her ashes to pursue the Trojan line with fire and sword.

To Virgil's Roman reader in 19 BC, the curse is one of the most specific prophecies in the poem. Virgil's audience had living relatives who had fought in the Third Punic War (149–146 BC), which ended with Scipio Aemilianus razing Carthage, selling its inhabitants into slavery, and (according to tradition, probably apocryphal) salting its fields. The "avenger" Dido prophesies is Hannibal, the Carthaginian general who nearly destroyed Rome in the Second Punic War (218–201 BC). Virgil is writing a history his reader has already lived. Dido's curse, from the poem's perspective, is not a wish; it is a historical fact delivered in future tense.

This is part of what makes Book IV morally serious. Dido is not simply a tragic lover; she is the founder of a civilization that will spend three centuries trying to destroy Rome. Her death has political consequences. The Aeneid is asking its Roman audience to love a woman whose descendants were their national nightmare. The ethical demand is precise: if you want to understand what Rome became, you have to grieve for what Rome destroyed to become it. The Punic Wars are half the Roman reader's patrimony; Dido's curse says so in her dying breath.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The 'avenger' of Libyan blood is Hannibal, whose invasion of Italy in 218 BC nearly destroyed Rome. Virgil's contemporary audience had lived the Punic Wars (264–146 BC); Dido's curse, from their vantage, describes their own grandfathers' war. The Aeneid's sympathy for Dido is sympathy for the side Rome had burned to the ground.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV (the curse)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence", "mythological"],
  },

  // ── 10. The suicide ────────────────────────────────────────────────────
  {
    id: "aeneid-4-suicide",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "This off\u2019ring to th\u2019 infernal gods I bear",
    anchorOccurrence: 1,
    title: "Dido's suicide — the struggling soul",
    quotedPassage:
      "\"This off'ring to th' infernal gods I bear.\" / Thus while she spoke, she cut the fatal hair: / The struggling soul was loos'd, and life dissolv'd in air.",
    passageReference: "Book IV, lines 1007–1009 (Dryden) · Aeneid IV.693–705",
    commentary: `The end of Book IV is one of the strangest deaths in classical literature. Dido has fallen on Aeneas's sword on the pyre. She is dying slowly. Juno, looking down, pities her and sends Iris (the rainbow messenger) down from heaven to cut a lock of her hair and release her to Dis — an obscure piece of Roman religious lore Virgil is preserving. Iris descends on rainbow wings, snips the lock, and the soul slides loose.

Three observations.

**The death is not clean.** Virgil writes *diū luctāta est* — she struggled a long time. The three times she tries to raise herself on her elbow, the eyes searching, the wound gasping — Virgil refuses to spare the reader. Dryden's decorum tames this somewhat; the Latin is more physical.

**The mercy comes from Juno.** Juno has spent the whole poem being Aeneas's enemy; here, in Book IV, she is Dido's friend. Virgil's gods are not morally consistent characters; they are partisans. Juno cannot stop the death but can shorten the pain. The kindness is specific to Dido and to Juno's Carthaginian allegiance. The Roman reader is being asked to notice that the goddess most committed to destroying Rome is also, in this moment, the one character showing mortal mercy.

**The book closes on dissolution.** The Latin verb *resolvit* (loosed) describes both the lock of hair Iris cuts and the soul that follows. Virgil's word-play is deliberate — the physical cut and the metaphysical release are the same act. Book IV ends on the fine piece of thread that held a woman to her body giving way. It is one of the quietest closings in the poem, and one of the most merciless. The narrative will pick up in Book V with Aeneas looking back at Carthage from his ship and seeing, on the shore, a great fire — not yet knowing what it is.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante's suicides in Inferno XIII are lodged in trees — their bodies permanently displaced from their souls as punishment for having separated the two in life. Dante's inferno-theology of suicide is in direct response to the Aeneid's Book VI placement of Dido among the love-wrecked rather than among the self-murdered. Dante, writing later theology, separates Dido from the garden of suicides — a Christian moral judgment that he applies selectively to preserve his master's character's dignity.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Cantos V (Dido) and XIII (the suicides)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 13,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological", "literary-influence"],
  },

  // ── 11. The "burnt sacrifice" — Dido's own foundation of tragic blame ──
  {
    id: "aeneid-4-perjur-d-fleet",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "perjur\u2019d fleet",
    anchorOccurrence: 1,
    title: "Perjur'd — the word Dido uses for Aeneas",
    quotedPassage:
      "\"To follow, sink, and burn his perjur'd fleet?\"",
    passageReference: "Book IV, line 850 (Dryden) · Aeneid IV.579–590",
    commentary: `A note on a single word. Dido calls Aeneas *perfidus* — "perjured, faithless, oath-breaker." Dryden renders it as "perjur'd." The word is the ethical center of the book.

*Perfidus* is a serious Roman word. In Roman law, it meant a breaker of oaths, someone whose word could not be trusted in any contract. It was one of the strongest charges a Roman citizen could level at another. Dido's use of it is not emotional overreach; she is accusing Aeneas of a category of moral failure that Roman civic life had worked hard to define and punish. The fact that the Romans' foundational hero is, by one reading, *perfidus* is a problem their own poet raises without flinching.

The question the scene leaves open: was Aeneas actually perjured? He never formally married Dido; he made no oath he could be prosecuted for breaking. But he had taken food and shelter in her city, slept with her, accepted the hunting-spear from her hand. In the Greek and Roman tradition of *xenia* — guest-friendship — the implicit contract of hospitality was nearly as binding as a sworn oath. Breaking the implicit contract was a species of *perfidia* that fell short of legal perjury but engaged the same moral vocabulary.

Virgil is asking his Roman reader a question that did not have a clean answer in 19 BC and does not now: does a man owe less to a host than he does to a spoken oath? *Perfidus* Aeneas is the Book IV question. The Book VI encounter with Dido's shade — where she says nothing and turns away — is the answer the poem refuses to give in words.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Roman category of perfidia is the civic-legal frame for what Dido is accusing Aeneas of. The Aeneid is pointing at a real fault-line in Roman ethics: does the ideal of pietas (duty to one's destiny) ever override the complementary ideal of fides (keeping faith with specific persons)? Virgil poses the question and does not answer it.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV (Dido's accusation) ↔ Book VI (Dido's silence)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },

  // ── 12. Dido / Francesca — the Inferno V bridge ────────────────────────
  {
    id: "aeneid-4-francesca-bridge",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "call\u2019d it marriage, by that specious name",
    anchorOccurrence: 1,
    title: "Dido and Francesca — how Dante reads Book IV",
    quotedPassage:
      "The queen, whom sense of honour could not move, / No longer made a secret of her love, / But call'd it marriage, by that specious name / To veil the crime and sanctify the shame.",
    passageReference: "Book IV, lines 247–250 (Dryden) · Aeneid IV.172",
    commentary: `This annotation sits on the same anchor as the cave-storm annotation above, but its subject is different: the reception. Dante reads Book IV with more care than any other medieval reader, and Inferno V is his response.

Dante's circle of lust, Inferno V, contains the souls of those whom passion overruled. The list of named damned begins with Semiramis, Cleopatra, Helen, Paris, Tristan — figures of heroic erotic disaster — and includes Dido ("*colei che s'ancise amorosa*," "she who killed herself for love"). Dante's Virgil points her out to him. The moment is Virgil's own character, in Virgil's own voice, acknowledging her as a woman in Hell.

Then Dante encounters Francesca and Paolo, the lovers brought to adultery and murder by reading a romance of Lancelot together. Francesca's speech to Dante — "*Amor, ch'al cor gentil ratto s'apprende / prese costui*" ("Love, which is quickly caught in the gentle heart, seized this man") — is Dante's own version of the Virgilian formula that opened Book IV. The wound, the inescapable arrow, the passion that rules the body — all are carried forward from Dido to Francesca.

Dante faints at the end of Francesca's story: *e caddi come corpo morto cade* ("and I fell as a dead body falls"). The swoon is Dante's bodily response to reading Book IV. He has seen Dido in Hell; he has listened to Dido's descendant tell her story; he has understood that his master Virgil wrote the pattern both women die by. The Inferno V fainting is a reader losing consciousness at a text. It is the deepest textual-reception moment in the Commedia, and Book IV is the text.

This is why the cross-reference cluster *Aeneid IV ↔ Inferno V* is load-bearing for the Tome catalog. Dante is not merely alluding to Virgil; he is responding to a specific moral argument about love, and his response is a literary judgment that has shaped every Western reading of both poems since.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Inferno V is Dante's most extended response to Aeneid IV. Dante's Dido, Dante's Francesca, and Dante's fainting are three consecutive textual moments built on the premise that Virgil's Book IV is morally and emotionally authoritative. The Aeneid IV ↔ Inferno V cross-reference is one of the load-bearing links in the Tome catalog.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto V (the circle of lust)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 13. "I have lived" — final calm ────────────────────────────────────
  {
    id: "aeneid-4-vixi",
    bookId: "the-aeneid",
    chapterNumber: 3,
    anchorText: "thrice invokes the pow\u2019rs below the ground",
    anchorOccurrence: 1,
    title: "Vixi — the final calm before the sword",
    quotedPassage:
      "And thrice invokes the pow'rs below the ground.",
    passageReference: "Book IV, line 738 (Dryden) · Aeneid IV.653–658",
    commentary: `At the foot of the pyre, before drawing Aeneas's sword, Dido speaks what is perhaps the most composed piece of Latin oratory in the entire poem. The speech is short, seven lines of hexameter, and ends: *Vīxī, et quem dederat cursum Fortūna perēgī* — "I have lived, and I have run the course that Fortune gave me."

The verb *vīxī* — "I have lived" — uses the Latin perfect tense to stunning effect. It is not "I live" or "I have been living" but "I have lived": a sentence pronounced from the position of someone who has already died, looking back at a life completed. Dryden does not quite catch the line; the English requires a full clause where the Latin is one compressed word.

The speech is Dido's final act of self-control. She has been raging, cursing, weeping through most of Book IV; in these seven lines she is calm. She surveys what she has done — built a city, avenged her husband, achieved glory beyond that of most queens — and pronounces it a life. Then she names what she is about to do and does it. It is a Stoic suicide delivered by a woman whose tragedy has been the opposite of Stoic. Virgil is letting her end with dignity the narrative has not allowed her up to this point.

The line *vīxī* has had a long afterlife. It is one of the most-translated sentences in Latin. Dryden's English ("I have liv'd, and run the course / Which fortune gave") is one of the earlier English renderings; Fagles gives "I have lived my life, I've journeyed through the course that fortune charted for me"; Heaney (*Aeneid VI*, 2016) reaches for "I have lived my life; I have finished the course that fate assigned." The English word has no perfect tense that does the Latin work. The line is one of the short list of Latin sentences that are better in Latin than in any target language.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The formula 'vixi' becomes a standard Roman epitaph-verb — inscribed on countless tombs meaning 'I lived.' Dido speaking it before her death is Virgil writing his heroine her own tombstone in advance.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV, line 653 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
]
