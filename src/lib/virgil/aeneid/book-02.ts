import type { Annotation } from "../types"

// ── Aeneid Book II — hand-authored scholarly annotations ─────────────────
// John Dryden's 1697 heroic couplets. Anchors line-exact against
// public/content/the-aeneid/ch-1.json.
//
// Book II is Aeneas's own narrative to Dido at the Carthaginian banquet:
// the last night of Troy — the wooden horse, the death of Laocoön, Sinon's
// treachery, the serpent simile, the murder of Priam by Pyrrhus at the
// altar, the apparition of Hector, the ghost of Creusa, and Aeneas's
// escape carrying Anchises on his shoulders and leading Ascanius by the
// hand. It is the poem's single most influential book on later European
// literature — Shakespeare's Hamlet stages a recitation of this book in
// II.ii; Raphael painted it; half of Western painting's "fall of Troy"
// scenes come from here.
//
// Density: 13 annotations (target 12–16).

export const AENEID_BOOK_2: Annotation[] = [
  // ── 1. The opening — Aeneas takes the microphone ───────────────────────
  {
    id: "aeneid-2-conticuere-omnes",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "All were attentive to the godlike man",
    anchorOccurrence: 1,
    title: "Conticuere omnes — the hall falls silent",
    quotedPassage:
      "All were attentive to the godlike man, / When from his lofty couch he thus began: / \"Great queen, what you command me to relate / Renews the sad remembrance of our fate…\"",
    passageReference: "Book II, lines 1–4 (Dryden) · Aeneid II.1–6",
    commentary: `The Latin opens *Conticuēre omnēs intentīque ōra tenēbant* — "all fell silent and kept their faces intent on him" — and it is one of the most hushed transitions in the poem. Aeneas has just been asked, at the end of Book I, to tell the story of Troy. Books II and III are his first-person narrative to Dido across the banquet. Virgil is using the Odyssean device of the hero-narrator, but with a moral twist the Odyssey does not have: this tale, told by this man, to this woman, in this city, is the instrument of Dido's destruction. She falls further into love with every line.

The Latin *conticuēre* is a perfect tense — "they fell silent," not "they were silent" — and Virgil is marking the *moment* the hall stopped talking to listen. The transition is part of the poem's self-conscious theatrical staging; Aeneas is visibly taking center stage, and the whole Book II "curtain" is the opening of a tragic play inside the epic.

Shakespeare uses exactly this device in *Hamlet*. The Player's speech in II.ii is Hamlet calling for this book: "Aeneas' tale to Dido; and thereabout of it especially, where he speaks of Priam's slaughter" — that is, the Pyrrhus / Priam scene from Aeneid II.533 ff. The Player then performs a version of this very passage, in lurid baroque iambics. Shakespeare is not alluding to Virgil — he is staging Virgil. The cross-reference in the Hamlet annotation set is the same passage, walked from the other side.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Hamlet II.ii stages this exact narrative — Aeneas telling Dido the fall of Troy, with a special focus on Priam's murder. The Player's speech in Shakespeare is an explicit baroque performance of Aeneid II. The connection is not subtextual; Hamlet names the book by title.",
        workTitle: "Hamlet",
        workAuthor: "William Shakespeare",
        passageReference: "Act II, Scene 2 (the Player's speech)",
        targetBookId: "hamlet",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "The structural template is Odyssey IX — Odysseus at the Phaeacian court begins to narrate his wanderings. Same device, opposite moral stakes. In Homer the tale is about the teller's return home; in Virgil the tale destroys the listener.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX (Odysseus's preface)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 2. The wooden horse — monstrum of ambiguous shape ──────────────────
  {
    id: "aeneid-2-wooden-horse",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Which like a steed of monstrous height appear\u2019d",
    anchorOccurrence: 1,
    title: "The wooden horse — monstrum that reshapes Troy",
    quotedPassage:
      "By destiny compell'd, and in despair, / The Greeks grew weary of the tedious war, / And by Minerva's aid a fabric rear'd, / Which like a steed of monstrous height appear'd: / The sides were plank'd with pine…",
    passageReference: "Book II, lines 17–22 (Dryden) · Aeneid II.13–20",
    commentary: `Virgil's Latin calls the horse a *mōnstrum* — an omen, a prodigy, a thing whose appearance is a message from the gods. Dryden's "steed of monstrous height" catches the word but flattens its theological weight. In Roman religion, a *mōnstrum* is a sign requiring interpretation: it *shows* (monstrat) that the divine will is bending. The horse is not merely a large wooden object but a portent the Trojans will misread.

Two things to notice about Virgil's technique:

**The horse never speaks, but it has a plot-shape.** Virgil describes it being built, being brought to the gates, being debated, being dragged inside, and being opened — across some three hundred lines, more than a third of the book. The object is given a narrative arc like a character.

**Inside the horse are named warriors.** Virgil lists them: Thessandrus, Sthenelus, Ulysses, Acamas, Thoas, Neoptolemus, Machaon, Menelaus, Epeus. This is not incidental — it is a small anti-Catalogue-of-Ships, a dark Homeric gesture. In the Iliad, the catalogue of heroes is a paean to human assembly. In the Aeneid, the catalogue is the roster of men hiding in a belly.

The image of the horse is so powerful it has migrated into the language (a "Trojan horse" is any deceptive gift). It is also the origin of a technical term in cybersecurity: programs that conceal malicious functionality inside benign-looking code are still, twenty-one centuries later, called Trojan horses.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The phrase 'Trojan horse' has become a figure of speech for any deceptive offering — from Cold War intelligence to modern malware. Virgil is the most influential Roman poet on the English language; this single image may be his single most durable contribution to everyday English.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II (the wooden horse)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "linguistic", "literary-influence"],
  },

  // ── 3. Laocoön — "timeo Danaos et dona ferentes" ───────────────────────
  {
    id: "aeneid-2-laocoon-warning",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Laocoon",
    anchorOccurrence: 1,
    title: "Laocoön's warning — timeo Danaos et dona ferentes",
    quotedPassage:
      "Laocoon, follow'd by a num'rous crowd, / Ran from the fort, and cried, from far, aloud: / 'O wretched countrymen! what fury reigns? / What more than madness has possess'd your brains? / Think you the Grecians from your coasts are gone? / And are Ulysses' arts no better known? / This hollow fabric either must inclose, / Within its blind recess, our secret foes; / Or 'tis an engine rais'd above the town, / T' o'erlook the walls, and then to batter down. / Somewhat is sure design'd, by fraud or force; / Trust not their presents, nor admit the horse.'",
    passageReference: "Book II, lines 52–63 (Dryden) · Aeneid II.40–49",
    commentary: `Laocoön, Trojan priest of Neptune, hurls a spear into the wooden horse's flank and speaks the four most quoted words of the entire Aeneid: *Timeō Danaōs et dōna ferentēs* — "I fear the Greeks, even when they bring gifts." Dryden softens it across three lines; the Latin is a single compressed warning-formula.

This is the line that has entered every European language as a proverb. "Beware of Greeks bearing gifts" is the English calque; the Latin is still quoted directly in scholarly and legal prose. It is Virgil's purest aphorism — a single hexameter that fits the mouth and keeps meaning across two thousand years.

The tragedy is that Laocoön is right. He is also doomed: in the lines that follow, two serpents come out of the sea and kill him and his two sons in front of the watching Trojans, who — taking the deaths as a divine sign *against* Laocoön — bring the horse into the city. The single character in the poem who reads the situation correctly is silenced by the gods themselves. Virgil is staging a theological problem: the truth-teller is killed, the gullible majority is destroyed, and the divine machinery that kills the truth-teller is not explained. The Aeneid's underlying question — whether the gods are just — is asked here and never cleanly answered.

The Laocoön group in the Vatican Museums (first century BC, attributed to Hagesandros, Athanodoros, and Polydoros of Rhodes) is an ancient sculptural treatment of this scene; Winckelmann's 1755 essay on it founded modern art history. Lessing's 1766 essay *Laokoon* used the group to distinguish poetry (a temporal art) from sculpture (a spatial one). The scene has been load-bearing for Western aesthetics for two millennia.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The line 'Timeo Danaos et dona ferentes' is quoted everywhere — Cicero, Dante, Shakespeare, the Federalist Papers, and every modern discussion of diplomacy-as-deception. The Hellenistic Laocoön statue (Vatican Museums) and Lessing's 1766 essay on it made the scene foundational to European art theory.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II, line 49 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "historical"],
  },

  // ── 4. Sinon — perjury as plot-engine ──────────────────────────────────
  {
    id: "aeneid-2-sinon",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Sinon is my name",
    anchorOccurrence: 1,
    title: "Sinon — the lie that opens the city",
    quotedPassage:
      "\"Greece is my country, Sinon is my name. / I own, since fortune has unsinn'd my state, / But cannot, if she would, make me untrue of faith… Me, then a boy, my father, poor and bare / Of other means, committed to the care / Of Palamedes…\"",
    passageReference: "Book II, lines 100–131 (Dryden) · Aeneid II.57–198",
    commentary: `Sinon is one of the most psychologically detailed portraits of a liar in classical literature. He is captured by Trojan shepherds, brought bound before Priam, and over two hundred lines spins a story that explains why the wooden horse is a genuine offering and why the Greeks have really sailed home. His confession, his tears, his false grievances against Ulysses — every beat is calibrated to persuade. Dryden catches the performance-quality: Sinon is acting, and Virgil's reader sees through the act while the Trojans do not.

Dante places Sinon in the tenth bolgia of Inferno XXX among the falsifiers — specifically among the *falsatori di parole*, counterfeiters of speech. He is paired with Potiphar's wife (the false accuser of Joseph), and Dante's Virgil explicitly identifies him ("Sinon il Greco") from across the pit. Dante is saying: the character his own master invented is in Hell, and he recognizes him by name. It is the Aeneid's perjurer being judged in the Commedia's court.

The textual interest is that Sinon is Virgil's near-entirely new invention. He has a bare mention in the lost *Epic Cycle*, but the portrait of the performance-liar — crying on cue, calibrating each protestation, deploying Ulysses as a villain to win Trojan sympathy — is Virgilian. Every subsequent portrait of a plausible liar in Western literature has this scene somewhere in its lineage.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante places Sinon among the falsifiers in Inferno XXX, specifically among the counterfeiters of speech, where he quarrels with Master Adam (a counterfeiter of coin). Dante's Virgil names him. The moment is Dante showing Dante that his master's inventions are real enough to be morally accountable.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto XXX, lines 98–129",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 30,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 5. The serpents — Laocoön killed ───────────────────────────────────
  {
    id: "aeneid-2-serpents",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Two serpents, rank\u2019d abreast, the seas divide",
    anchorOccurrence: 1,
    title: "The serpents — divine sign that kills the truth-teller",
    quotedPassage:
      "Two serpents, rank'd abreast, the seas divide, / And smoothly sweep along the swelling tide. / Their flaming crests above the waves they show; / Their bellies seem to burn the seas below; / Their speckled tails advance to steer their course, / And on the sounding shore the flying billows force. / And now the strand, and now the plain they held; / Their ardent eyes with bloody streaks were fill'd…",
    passageReference: "Book II, lines 270–289 (Dryden) · Aeneid II.203–227",
    commentary: `The serpents come out of the sea like a military formation and make for Laocoön's two sons first, then the father himself. Virgil's Latin is physically specific — the dripping jaws, the serpentine muscle, the blood coming out as Laocoön's bronze-wreathed head is crushed. Dryden's Augustan register tames the scene; the original is ferocious.

Two observations about the scene's function:

**It is a theological knot.** Neptune is Laocoön's own god (he is his priest), and the serpents come from Neptune's sea. Is Neptune punishing Laocoön for speaking truly? Some ancient readers (Hyginus, pseudo-Apollodorus) said the punishment was for Laocoön's violation of priestly chastity; Virgil says nothing of the sort. The serpents kill the truth-teller, the Trojans misread the omen, the city falls. The universe of the Aeneid contains more moral chaos than a simple patriotic reading can accommodate.

**It is the book's first extended simile-grade set-piece of terror.** Virgil's description is the model for every serpent in Western literature — Milton's serpent in Paradise Lost (which swallows Satan and talks Eve out of obedience), Keats's Lamia, the sea-serpent imagery in Moby-Dick. The sculptural Laocoön in the Vatican is a different register of the same moment: the scream, the muscled bodies, the children already dying.

Note a quiet pattern. Virgil has opened Book II with an omen of destruction (Laocoön's death) that is *misread*, and he will end the book with a prophecy of salvation (Creusa's shade) that is *read correctly but acted on with grief*. The Trojans fall because of what they fail to see; Aeneas survives because of what he is willing to hear. The poem is already sketching its theory of reading.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Milton's serpent in Paradise Lost IX — the body Satan enters to tempt Eve — is a Virgilian serpent dressed in Genesis clothing. Milton models the physical description on this passage and on the broader Book II bestiary.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IX, lines 494–531",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 6. Hector's ghost — "fuimus Troes" ─────────────────────────────────
  {
    id: "aeneid-2-hectors-ghost",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "When Hector\u2019s ghost before my sight appears",
    anchorOccurrence: 1,
    title: "Hector's ghost — Troy's greatest hero sends Aeneas away",
    quotedPassage:
      "When Hector's ghost before my sight appears: / A bloody shroud he seem'd, and bath'd in tears; / Such as he was, when, by Pelides slain, / Thessalian coursers dragg'd him o'er the plain. / Swoln were his feet, as when the thongs were thrust / Thro' the bor'd holes; his body black with dust; / Unlike that Hector who return'd from toils / Of war, triumphant, in Aeacian spoils… / 'O light of Trojans, and support of Troy, / Thy father's champion, and thy country's joy! / O, long expected by thy friends! from whence / Art thou so late return'd for our defence?'",
    passageReference: "Book II, lines 352–399 (Dryden) · Aeneid II.268–295",
    commentary: `On the night Troy falls, Aeneas is dreaming. Hector appears to him — not triumphant, but mutilated: dust-blackened, the thongs still through the swollen feet where Achilles dragged him behind his chariot. The image is painful on purpose. Virgil is reaching back across the Iliad and picking the *worst* moment of Hector's Homeric afterlife — the Book XXII degradation — and bringing it into Aeneas's dream.

Hector's message is: Troy is lost. Don't fight. Take the household gods and flee.

This is a crucial pivot-moment in the theology of the Aeneid. Hector in the Iliad fought to the last breath for Troy. Hector in the Aeneid tells the Trojans to give up the city and found a new one. The heroic ethic of the Iliad — die fighting where you stand — is being handed off to a different ethic: *pietas* as survival for the sake of the future. Virgil is explicitly writing a Roman replacement for the Greek warrior-code, and he has the greatest of the Iliadic Trojans authorize the replacement in a dream.

The Latin line *fuīmus Trōēs; fuit Īlium et ingēns glōria Teucrōrum* — "we were Trojans; Ilium was, and the great glory of the Teucrians" — which Panthus speaks later in this same book, is the compressed version of Hector's message: Troy is past tense now. The perfect-tense *fuit* is the sentence turning under the reader. The future of "Troy" will be a different city, in Italy, with a different name, and the Aeneid is the passage of the name into the new city's ground.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The Iliad's Book XXII — Achilles killing Hector and dragging the body — is the memory Virgil is drawing on for Hector's physical appearance here. The Aeneid's Hector is Homer's Hector at his most degraded.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXII, lines 395–404 (the dragging)",
        targetBookId: "the-iliad",
        targetChapterNumber: 22,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 7. The city falls — the tree simile ────────────────────────────────
  {
    id: "aeneid-2-city-falls",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Troy is no more",
    anchorOccurrence: 1,
    title: "Troy is no more — a civilization in past tense",
    quotedPassage:
      "'Troy is no more, and Ilium was a town! / The fatal day, th' appointed hour, is come, / When wrathful Jove's irrevocable doom / Transfers the Trojan state to Grecian hands. / The fire consumes the town, the foe commands…'",
    passageReference: "Book II, lines 436–444 (Dryden) · Aeneid II.324–327",
    commentary: `Panthus, priest of Apollo, tells Aeneas the news on the night of the sack. The Latin *fuīmus Trōēs; fuit Īlium et ingēns glōria Teucrōrum* — "we were Trojans; Ilium was, and the great glory of the Teucrians" — uses the perfect tense *fuimus* and *fuit* to a devastating effect no English rendering quite captures. In Latin the perfect tense names a completed past: not "we are no longer" but "we have been, and are no more." An entire civilization referred to in a tense that puts it in a closed archive.

This is one of the most quoted lines from the poem in later Latin literature. Juvenal uses it; Augustine uses it; the sentence becomes a formula for any civilization writing its own obituary. Gibbon quotes it in *The Decline and Fall of the Roman Empire*, and part of what makes that citation bite is the irony: Virgil wrote the line about Troy for a Roman audience confident Rome would last; Gibbon reads it to describe Rome itself turning into the past.

The tree simile that follows in the Latin (Aeneid II.626–631 — "as when on mountain-tops the husbandmen, with emulous strokes, strive to hew down an ancient ash-tree…") compares the fall of the city to a great tree felled by woodcutters: the axe-strokes, the tree's slow groan, the gradual leaning and then the catastrophic fall. Virgil has compressed the death of a city into a physical image a farmer can recognize. Dryden renders the simile in verse that honors the sound of the Latin; it remains one of the most quoted moments of this book.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Gibbon's Decline and Fall of the Roman Empire takes the Latin fuimus-formula as its template. Virgil writing about Troy is the template for every later historian writing Rome's own obituary. The perfect tense is Western civilization's way of saying 'we were.'",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II, line 325 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "historical", "literary-influence"],
  },

  // ── 8. The wolf simile — warriors as predators ─────────────────────────
  {
    id: "aeneid-2-wolf-simile",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "As hungry wolves",
    anchorOccurrence: 1,
    title: "As hungry wolves — the Trojan band as desperate predators",
    quotedPassage:
      "\"As hungry wolves, with raging appetite, / Scour thro' the fields, nor fear the stormy night— / Their whelps at home expect the promis'd food, / And long to temper their dry chaps in blood— / So rush'd we forth at once; resolv'd to die, / Resolv'd, in death, the last extremes to try.\"",
    passageReference: "Book II, lines 479–484 (Dryden) · Aeneid II.355–360",
    commentary: `One of Book II's defining similes. Aeneas and his band — Coroebus, Rhipeus, Dymas, Iphitus, Pelias — rush into the burning streets of Troy, and Virgil compares them to wolves hunting in a storm, their pups waiting for the carcasses. The simile does heavy moral work. These are not conquering heroes; they are starving beasts. Their courage is explicitly desperate, not noble.

Virgil is adapting a Homeric formula (wolves as warriors — Iliad XVI.156 ff., where Achilles's Myrmidons are compared to blood-drinking wolves), but reassigning it. In Homer the simile makes warriors fearsome. In Virgil the simile makes the Trojans' last stand *pathetic* — in the precise etymological sense of pitiable. The wolf-pups waiting for food are the turn. The warriors are fighting, not for victory (there is no victory available), but so that something at home can eat.

The scene that follows — Coroebus putting on a dead Greek's armor, the Trojans killing confused Greeks in the dark, then being killed in turn by their own side who take them for Greeks — is Virgil's painful stylization of urban warfare: nobody knows whom they are fighting, everyone is dying, the moral lines have collapsed. This is one of the most influential scenes for every subsequent fall-of-a-city narrative (Milton's fall of Satan's host, Tasso's siege of Jerusalem, every cinematic Trojan War).`,
    crossReferences: [
      {
        type: "source",
        description:
          "Iliad XVI.156–163 — the Myrmidons compared to wolves fresh from a kill, blood on their jaws. Virgil takes Homer's simile and turns its moral value inside out: where Homer's wolves are terrifying predators, Virgil's are desperate ones.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XVI, lines 156–163",
        targetBookId: "the-iliad",
        targetChapterNumber: 16,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 9. Pyrrhus as serpent — the snake that sheds its skin ──────────────
  {
    id: "aeneid-2-pyrrhus-serpent",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Then Thoas, Athamas, and Pyrrhus haste",
    anchorOccurrence: 1,
    title: "Pyrrhus — the serpent-simile and the son's shadow",
    quotedPassage:
      "Then Thoas, Athamas, and Pyrrhus haste…",
    passageReference: "Book II, lines 342 ff. (Dryden) · Aeneid II.469–475",
    commentary: `Pyrrhus, also called Neoptolemus, is Achilles's son, brought to Troy from Scyros after his father's death. Virgil's Pyrrhus enters Book II in one of the book's most famous similes: he is compared to a serpent that has fed on poisonous herbs underground all winter and emerges in the spring, shedding its skin, flame-tongued, coiling upward. The simile places him at the door of Priam's palace.

Two things to notice about the simile:

**It is calibrated ugly.** Pyrrhus is not a hero. He is a toxic thing crawling out of the earth. Virgil is taking Achilles — the Iliad's central tragic hero — and writing his son as a serpent. This is part of the Aeneid's long moral answer to the Iliad: the heroic ethos produces heirs who inherit only the violence, not the honor. Pyrrhus is what Achilles becomes in the next generation.

**It is a technical flex.** The simile runs several lines, and Virgil packs into it every sense the serpent has to offer — the stench, the venom, the sloughed skin, the molten brightness, the forked tongue. It is Virgil doing what he has already proved he can do (the Neptune-and-the-statesman simile of Book I) but with the moral valence inverted. In Book I politics ennobled nature; in Book II nature degrades the hero.

The serpent will also soon kill Priam at the altar — a scene the Book II annotation on Priam unpacks separately.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "In the Iliad, Achilles's wrath is human and resolvable. In the Aeneid, his son's wrath is serpentine and unresolvable. The generational inheritance is the sour residue of Homeric heroism; Virgil's implicit question is whether the martial ethos itself is worth passing on.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Books XIX–XXIV (Achilles's trajectory)",
        targetBookId: "the-iliad",
        targetChapterNumber: 19,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 10. Priam's death — the killing at the altar ───────────────────────
  {
    id: "aeneid-2-priam-altar",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "Behold! Polites, one of Priam\u2019s sons",
    anchorOccurrence: 1,
    title: "Priam killed at the altar — the tragedy's nadir",
    quotedPassage:
      "Behold! Polites, one of Priam's sons, / Pursued by Pyrrhus, there for safety runs. / Thro' swords and foes, amaz'd and hurt, he flies / Thro' empty courts and open galleries. / Him Pyrrhus, urging with his lance, pursues, / And often reaches, and his thrusts renews. / The youth, transfix'd, with lamentable cries, / Expires before his wretched parent's eyes.",
    passageReference: "Book II, lines 718–745 (Dryden) · Aeneid II.526–558",
    commentary: `The killing of Priam is the emotional nadir of Book II and one of the most painted scenes in Western art. Pyrrhus chases Priam's son Polites into the palace courtyard and kills him at the feet of the king and queen. Priam, an old man in armor he can barely wear, throws a feeble spear that falls short. Pyrrhus drags him by the hair to the altar — where Priam has been praying — and kills him on it. Virgil is explicit about the gesture: Pyrrhus's hand in Priam's hair, the sword into the throat, the blood running onto the sacrificial altar.

The scene is the one Hamlet calls for. When Hamlet tests the Players in II.ii of *Hamlet*, he asks specifically for "Priam's slaughter" — and the Player performs a baroque English version of Aeneid II.526–558. The speech is full of deliberate archaisms and Virgilian diction: "Th' unnerved father falls… And, like a neutral to his will and matter, / Did nothing." Shakespeare is staging Virgil on the Elizabethan stage, and Hamlet's identification with the scene (the son who cannot act to avenge the father) is the play's self-diagnosis.

Virgil ends the passage on Priam's decapitated corpse: *iacet ingēns lītore truncus, / āvulsumque umerīs caput et sine nōmine corpus* — "a great headless trunk lies on the shore, a body nameless." Dryden renders: "A headless carcass, and a nameless thing." The last noun is Priam. The king of Troy ends the scene as a *thing*. It is the book's largest-scale moral observation: civilizations fall not in abstract defeat but in the loss of the names of their rulers.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Hamlet II.ii stages this scene directly. Hamlet asks for 'Priam's slaughter'; the Player delivers a baroque English version of Aeneid II.526–558. Shakespeare uses the scene as a mirror for Hamlet's own paralysis: the son who cannot act while his father is wronged.",
        workTitle: "Hamlet",
        workAuthor: "William Shakespeare",
        passageReference: "Act II, Scene 2 (the Player's speech, Priam's death)",
        targetBookId: "hamlet",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological", "historical"],
  },

  // ── 11. Helen — the scene of doubtful authorship ───────────────────────
  {
    id: "aeneid-2-helen-scene",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "The graceless Helen in the porch I spied",
    anchorOccurrence: 1,
    title: "The Helen scene — disputed lines, real weight",
    quotedPassage:
      "The graceless Helen in the porch I spied / Of Vesta's temple; there she lurk'd alone; / Muffled she sate, and, what she could, unknown: / But, by the flames that cast their blaze around, / That common bane of Greece and Troy I found.",
    passageReference: "Book II, lines 775–780 (Dryden) · Aeneid II.567–588 (disputed)",
    commentary: `Aeneas, fleeing the burning palace, sees Helen cowering in the temple of Vesta and is seized with the impulse to kill her. Venus appears to him and stops him, pointing out that Troy's fall is the work of the gods, not one woman. The scene is psychologically rich: a man losing his city, meeting the proximate cause, and being morally instructed that she is not really the cause.

**The textual puzzle**: these lines (Aeneid II.567–588 in the Latin) are not in every manuscript. Servius in the fourth century noted that "they say this passage was removed by [Virgil's literary executors] Tucca and Varius." Many modern editions bracket them or omit them entirely. The reasons for suspicion: Virgil elsewhere has Deiphobus (Helen's post-Paris Trojan husband) tell a different story in Book VI, implying Helen actively betrayed Troy on the last night; this scene has her hiding in Vesta's temple, frightened and alone. The two versions of Helen are hard to reconcile.

Dryden includes the passage. Most Renaissance and early modern translators did. Modern editors (Austin 1964, Horsfall 2008) tend to treat it as probably authentic but unrevised — Virgil left the Aeneid unfinished at his death, and some inconsistencies were never cleaned up.

The reader-facing point is that the passage is *psychologically* important whether or not Virgil meant it to appear. Aeneas's impulse to kill a woman in a temple is the book's most honest moment about what rage does to a decent person. Venus stopping him is her first act of moral (not just plot) intervention. Remove the scene and Aeneas flees the city without being tested on this question. Keep it and he is tested and restrained. The editorial tradition has correctly judged that the Aeneid needs the scene, even if Virgil might have revised it.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Deiphobus in Aeneid VI.509–534 tells Aeneas a different version: Helen on Troy's last night giving signals to the Greek fleet. The two Helens — hiding in the temple vs. actively signaling the ships — are the Aeneid's most visible internal inconsistency, and the basis for the textual debate about whether Aeneid II.567–588 belongs.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI (Deiphobus's shade)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },

  // ── 12. Anchises on Aeneas's shoulders — the image of pietas ───────────
  {
    id: "aeneid-2-anchises-shoulders",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "And load my shoulders with a willing freight",
    anchorOccurrence: 1,
    title: "Aeneas carries Anchises — pietas as a tableau",
    quotedPassage:
      "\"And load my shoulders with a willing freight. / Whate'er befalls, your life shall be my care; / One death, or one deliv'rance, we will share. / My hand shall lead our little son; and you, / My faithful consort, shall our steps pursue. / Next, you, my servants, heed my strict commands.\"",
    passageReference: "Book II, lines 963–972 (Dryden) · Aeneid II.707–729",
    commentary: `The physical image that *is* the Aeneid. Aeneas picks up his aged father Anchises on his shoulders, takes his young son Ascanius by the hand, and walks out of the burning city. His wife Creusa follows at a distance and will be lost in the crowd. Three generations in a single tableau — the past carried by the present, the future led by the hand.

This is *pietas* as a picture. Greek and Roman sculpture depicted it constantly (Bernini's Villa Borghese group of 1618–19 is the most famous; Raphael drew it; it appears on coins). The image is iconic because the argument is so clean: Aeneas does not save his ancestral gold, the household silver, or his political power. He saves his father, his son, and the household gods (the Penates). What he carries out of Troy is the minimum unit of continuity — a bloodline and a cult.

The Latin sums up the argument in Anchises's line: *tū, genitor, cape sacra manū patriōsque Penātīs; / mē, bellō e tantō dīgressum et caede recentī, / attrectāre nefās* — "you, father, take the sacred objects in your hand; I cannot touch them yet, with fresh blood on me from battle." Aeneas cannot hold the household gods because he is ritually polluted by combat; Anchises, the older man, must carry the gods while Aeneas carries Anchises. The three-layer arrangement — father carries gods, son carries father, grandson walks alongside — is the three-generation structure of Roman lineage made visible.

*Pietas* is the epithet the whole Aeneid applies to Aeneas. This scene is what the epithet means. Every later classical or neoclassical painting of "the pious Aeneas" is a gloss on this moment.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Bernini's Aeneas and Anchises (Villa Borghese, 1618–19) is the canonical sculptural treatment. Raphael drew it; Barocci painted it; the Dutch Golden Age reproduced it on engravings. The visual tradition is as load-bearing for the image of pietas as the text itself.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II (the flight from Troy)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ── 13. Creusa's shade — the promise of Italy ──────────────────────────
  {
    id: "aeneid-2-creusa-shade",
    bookId: "the-aeneid",
    chapterNumber: 1,
    anchorText: "I yield to Fate, unwillingly retire",
    anchorOccurrence: 1,
    title: "Creusa's ghost — prophecy and the first disappearance",
    quotedPassage:
      "\"I yield to Fate, unwillingly retire, / And, loaded, up the hill convey my sire.\"",
    passageReference: "Book II, lines 1093–1094 (Dryden) · Aeneid II.776–794",
    commentary: `Aeneas realizes in the crowd outside the city that Creusa, his wife, is missing. He rushes back into the burning streets and searches. She appears to him as a shade, calms him, and delivers a prophecy: he will reach a land in the west called Hesperia where the Tiber flows, and there he will marry a royal woman and found a kingdom. Then she slips away. He tries to embrace her three times; three times she passes through his arms "like winds, or empty dreams that fly the day."

Two observations.

**The prophecy is authoritative.** Creusa is the first of a chain of prophetic women in the Aeneid (Creusa here, Andromache in III, the Sibyl in VI, Cassandra referenced throughout). Her prediction of the Tiber and the royal wife is accurate — these are the major events of Books VII–XII. Virgil uses dead women as reliable narrators; the pattern is specific and becomes one of the poem's quiet signatures.

**The three-fold embrace is Virgil's formula.** The image of Aeneas groping at a shade who slides through his hands will recur, almost verbatim, in Book VI when he tries to embrace Anchises. The repetition is deliberate — Aeneas keeps losing the people who anchored him. Virgil has built a grief-signature out of Homer's single image from Odyssey XI (Odysseus and his mother Anticlea). See the Book VI annotation on the Anchises embrace for the full chain of inheritance.

The end of Book II, in narrative, leaves Aeneas at dawn on the mountain above burning Troy, with Anchises, Ascanius, the household gods, and a small band of refugees. The city his family belonged to for generations is on fire below him. Creusa is dead. He is a widower with an old father and a young son, and he is about to become responsible for everyone still alive. Book II ends there. It is one of the steepest emotional drops in classical epic.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The three-fold embrace is from Odyssey XI.204–208 (Odysseus and Anticlea). Virgil uses it twice in the Aeneid — here and in Book VI (Anchises). The repetition builds a grief-formula across his own poem.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI, lines 204–208",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description:
          "Creusa's prophecy is the first full statement of the westward destination the Aeneid is tracking toward. The Tiber, Latium, a royal marriage — all the Books VII–XII material is announced here, by a dead woman, at the end of Book II.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Books VII–XII (the Italian war and the marriage)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
]
