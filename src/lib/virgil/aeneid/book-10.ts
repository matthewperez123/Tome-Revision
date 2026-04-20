import type { Annotation } from "../types"

// ── Aeneid Book X — the death of Pallas ─────────────────────────────────
// Dryden; anchors against public/content/the-aeneid/ch-9.json.
//
// Book X begins with a divine council — the most extended divine-politics
// scene in the poem — and proceeds through Aeneas's return, the death of
// Pallas at Turnus's hand, the Arcadian grief, and the Mezentius-Lausus
// deaths. The Lausus apostrophe sits here and is surfaced as a V.
// monogram; the belt Turnus takes from Pallas is the Book XII fuse.

export const AENEID_BOOK_10: Annotation[] = [
  {
    id: "aeneid-10-divine-council",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "The gates of heav\u2019n unfold",
    anchorOccurrence: 1,
    title: "The divine council — Jove's impossible middle position",
    quotedPassage:
      "The gates of heav'n unfold: Jove summons all / The gods to council in the common hall.",
    passageReference: "Book X, lines 1–2 ff. (Dryden) · Aeneid X.1–117",
    commentary: `Book X opens with Jupiter calling the Olympians to council. Venus speaks for the Trojans; Juno speaks for the Italians. Each accuses the other of breaking the peace. Both are, in different senses, right.

Venus's argument: Aeneas is fated to found Rome; Juno has obstructed him at every turn; the current war in Italy is Juno's last stand, and the Trojan camp is under siege because Juno will not accept the settled divine order. Juno's argument: Venus has been actively helping the Trojans; the war in Italy was begun by the Trojan arrival and the broken betrothal of Turnus; the Italians are defending their own land against foreign invaders who cannot be reasoned with.

Jove's response is one of the most studied passages in the Aeneid's theology. He refuses to take sides: *rēx Iuppiter omnibus īdem* — "Jupiter is king to all alike." He declares that he will not intervene in the war; *sua cuīque exorsa labōrem / fortūnamque ferent*, "each side's own enterprises shall bring labor and fortune to it." *Fāta viam invenient* — "the Fates will find their way."

The speech is Jupiter's declaration of *divine neutrality*. But the neutrality is not benevolent; it is a withdrawal. The gods have spent the whole poem intervening; Jove here says they will stop. The war will be decided by the human beings fighting it. What follows in Book X — Pallas's death, Mezentius's death, Aeneas's continued slaughter — is explicitly framed as *what men do when the gods stop watching*. The book is Virgil's most honest theology: divine support withdrawn leaves violence to human choice.

This is a load-bearing passage for the Book XII reading. If Jove has declared neutrality in Book X, then Aeneas's decision whether to kill Turnus in Book XII is not underwritten by divine command. The responsibility is his.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad IV's opening divine council, where Zeus and Hera debate whether Troy should fall, is the template. Virgil's version inverts the outcome: where Homer's Zeus relents and allows Hera to proceed, Virgil's Jupiter steps back and refuses to direct either side.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book IV (the divine council)",
        targetBookId: "the-iliad",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological", "literary-influence"],
  },
  {
    id: "aeneid-10-aeneas-returns",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "His left young Pallas kept, fix\u2019d to his side",
    anchorOccurrence: 1,
    title: "Aeneas returns with Pallas — a young charge at his side",
    quotedPassage:
      "His left young Pallas kept, fix'd to his side, / And often of the winds inquir'd, and of the tide…",
    passageReference: "Book X, line 237 ff. (Dryden) · Aeneid X.159–165",
    commentary: `Aeneas sails back down the Tiber with his Arcadian and Etruscan allies. Pallas — the young son Evander entrusted to him in Book VIII — sits beside him at the prow. Virgil marks the image: the older foreign leader with the young local prince at his left hand, pointing out constellations, asking about tides.

The scene is one of the Aeneid's quietest before its loudest catastrophes. Virgil is depositing Pallas in the reader's affection — an enthusiastic, inexperienced boy being taken on his first campaign by a man who has sworn to his father that he will return him safely. The reader knows Pallas is going to die. The reader spends Books VIII, IX, and the first half of X liking him more and more.

This is a signature Virgilian tactic: give a character the reader loves, give him a sponsor, have the sponsor fail. Palinurus in Book V was similar. Pallas in Book X is the largest-scale version. The grief-economy of the Aeneid is long-planted.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-10-pallas-death",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "And sung his loss in poplar groves, alone",
    anchorOccurrence: 1,
    title: "Pallas killed by Turnus — the event the poem will not repair",
    quotedPassage:
      "And sung his loss in poplar groves, alone…",
    passageReference: "Book X, line 274 ff. (Dryden) · Aeneid X.439–509",
    commentary: `Pallas, fighting his first battle, is killed by Turnus. Virgil stages the duel with full Homeric weight: Pallas throws his spear, barely grazes Turnus; Turnus throws his, pierces Pallas's chest. Pallas falls. Turnus, standing over the body, boasts — *Arcades, haec* — "Arcadians, take home this news of how I fought, take this back to Evander."

Then Turnus strips the sword-belt. Virgil marks this with a prophetic aside that is one of the poem's most devastating authorial interventions: *nēscia mēns hominum fātī sortisque futūrae* — "the minds of men are ignorant of fate and their coming lot." The boast, the belt, the triumphant return — everything Turnus is doing right now will, in Book XII, be the reason Aeneas kills him. Virgil tells the reader, in this parenthesis, that the celebrating warrior is signing his own death sentence.

The death of Pallas is the Aeneid's most morally central killing. It is the event that will, in Book XII, override Aeneas's impulse to mercy. It is also the event that drives the second half of Book X — Aeneas in berserk grief killing everyone who comes near him, in a register the poem has not previously licensed. The death of Pallas is the hinge on which the Aeneid's ending turns.`,
    crossReferences: [
      {
        type: "source",
        description: "The killing-of-the-comrade template is Patroclus's death in Iliad XVI. Pallas is Virgil's Patroclus — the beloved younger warrior killed by the antagonist, whose death drives the protagonist's grief-violence. The Aeneid X ↔ Iliad XVI pairing is one of the spec's load-bearing cross-references.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XVI (the death of Patroclus)",
        targetBookId: "the-iliad",
        targetChapterNumber: 16,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description: "The sword-belt Turnus strips from Pallas here is the object Aeneas sees on Turnus's shoulder in Book XII and that triggers the final killing. The full arc: Book VIII (entrustment) → Book X (death + belt) → Book XII (belt seen, Turnus killed).",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (the belt of Pallas)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-10-aeneas-furor",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "Preventing fate directs the lance awry",
    anchorOccurrence: 1,
    title: "Aeneas in furor — the hero slips into the antagonist's mode",
    quotedPassage:
      "Preventing fate directs the lance awry…",
    passageReference: "Book X, line 477 ff. (Dryden) · Aeneid X.510–605",
    commentary: `Aeneas, learning of Pallas's death, becomes — for several hundred lines — the kind of killer the poem has usually reserved for Turnus. He refuses supplication; he kills men who are begging for their lives; he takes captives for human sacrifice at Pallas's funeral pyre (an act specifically condemned by civilized Roman ethics). Virgil names his state with the word he has attached to the enemy throughout: *furor*.

Two things to notice:

**Aeneas's furor is provoked.** He is not ordinarily this. The death of Pallas has driven him into a mode of killing Virgil normally associates with the Italian side. The poem is showing that *furor* is contagious, that it can infect even the *pius* hero when grief is strong enough.

**Aeneas's furor is not condemned.** Virgil narrates it without censure and in fact matches the Iliadic register of Achilles's grief-rage for Patroclus. The reader is asked to recognize the rage as *warranted* even as it is *morally damaging*. This is the Aeneid's most sophisticated treatment of the ethics of grief. Anger at the death of the loved is legitimate; the legitimate anger produces acts the poem cannot endorse. Neither condemnation nor endorsement fits. The reader is left holding both.

This is the passage that primes Book XII. Aeneas in *furor* in Book X is the Aeneas whose Book XII killing of Turnus is in question. The reader who gets to the end of the poem has already seen Aeneas in this mode once, and it is not cleanly rebuked.`,
    crossReferences: [
      {
        type: "source",
        description: "The grief-fury of Achilles in Iliad XX–XXI — after Patroclus dies, Achilles slaughters Trojans without mercy, refuses ransoms, and brings the river Scamander to wrath with his kills. Virgil is doing the Iliadic scene with Aeneas in the Achilles role and Pallas in the Patroclus role.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Books XX–XXI (Achilles's grief-rampage)",
        targetBookId: "the-iliad",
        targetChapterNumber: 20,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "aeneid-10-lausus-apostrophe-card",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "And here, heroic youth",
    anchorOccurrence: 1,
    title: "The Lausus apostrophe — a poet's grief for an enemy's son",
    quotedPassage:
      "\"And here, heroic youth, 'tis here I must / To thy immortal memory be just, / And sing an act so noble and so new, / Posterity will scarce believe 'tis true.\"",
    passageReference: "Book X, lines 1123–1126 (Dryden) · Aeneid X.791–832",
    commentary: `The apostrophe is already surfaced in the reader as a V. monogram; this annotation carries the scholarly context. Virgil addresses Lausus directly: *hīc mortis dūrae cāsum tuaque optima facta / sī qua fidem tantō est operī lātūra vetustās / nōn equidem nec tē, iuvenis memorande, silēbō*.

The situation: Mezentius, the despiser of the gods (*contemptor divum*), has been wounded by Aeneas. His son Lausus throws himself between Aeneas and his father to protect him. Aeneas, annoyed, kills him. Then — and here is the Aeneid's most exquisite reversal — Aeneas, with Lausus dying at his feet, *weeps*. He picks the boy up, hands him back to his Italian companions, and says nothing.

The apostrophe is Virgil stepping forward to say that he, the poet, will not let this boy's death be forgotten. The scene is one of the poem's most counterintuitive moments of sympathy — the moment where Aeneas, who has been slaughtering the Italian side for a whole book in grief for Pallas, suddenly *recognizes* in his enemy's son exactly what he has just killed: a boy fighting for his father. The mirror is exact. Aeneas carried Anchises out of Troy; Lausus dies for Mezentius.

The Aeneid at its most honest. The enemy dying at your feet is also someone's pious son. The war is being fought by both sides in the same terms.`,
    crossReferences: [
      {
        type: "allusion",
        description: "Aeneas's grief for Lausus inverts and echoes Aeneas's own pietas in Book II (carrying Anchises from Troy). The Book X scene is the Aeneid recognizing that pietas is not exclusive to its hero. The Italians practice it too; the war kills pious sons on both sides.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II (Aeneas carrying Anchises)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence", "linguistic"],
  },
  {
    id: "aeneid-10-mezentius",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "What vengeance proud Mezentius had prepar\u2019d",
    anchorOccurrence: 1,
    title: "Mezentius — contemptor divum, loving father",
    quotedPassage:
      "What vengeance proud Mezentius had prepar'd…",
    passageReference: "Book X, line 223 ff., closing at 1258 ff. (Dryden) · Aeneid X.689–908",
    commentary: `Mezentius is the Aeneid's most morally complex antagonist. He is *contemptor divum* — the despiser of the gods — an exiled Etruscan tyrant infamous for binding the living to corpses and letting them die of putrefaction. He is, in theological framing, the Aeneid's *villain* archetype.

And yet. When his son Lausus throws himself between Mezentius and Aeneas and dies, Mezentius's response is not to continue the fight. He stumbles away, calls for his horse, grieves openly, then rides back — not to win, but to die in Aeneas's presence as the only way to deserve his son's sacrifice. *My Lausus lies extended on the plain*, he says. The line is among the Aeneid's saddest.

Virgil writes the death of Mezentius with a tenderness the character has done nothing to earn. The *contemptor divum* dies a grieving father, asking Aeneas for only one favor: bury me with my son. Aeneas grants it.

This is the Aeneid's theology at its deepest. Even the villain is recuperated by *pietas toward the son*. The moral universe of the poem is not "good vs evil"; it is "the grief of pious men everywhere, on whichever side the war puts them." The Book X ending is a closing gesture of mutual mourning between hero and villain that the Book XII ending will — notoriously — not repeat for Turnus.`,
    crossReferences: [
      {
        type: "compare",
        description: "The Mezentius-Aeneas closing contrasts pointedly with the Turnus-Aeneas closing in Book XII. Both enemies die; one receives the dignity of a mourned father, the other does not. The asymmetry is part of the Book XII ending's moral difficulty.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (Turnus's death)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological", "literary-influence"],
  },
  {
    id: "aeneid-10-arcadian-horsemen",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "Th\u2019 Arcadian horsemen",
    anchorOccurrence: 1,
    title: "The Arcadians — a small allied people in Italy's war",
    quotedPassage:
      "Th' Arcadian horsemen, and Etrurian host…",
    passageReference: "Book X, line 337 ff. (Dryden) · Aeneid X.362–438",
    commentary: `Pallas leads the Arcadian cavalry at the book's midpoint. The Arcadians are an allied mountain people fighting unfamiliar ground — Virgil specifies that they are used to hills, not the rolling plain they find themselves on, and lose their formation. Pallas rides out in front, rallies them, and leads a brief *aristeia* before meeting Turnus.

The scene is a miniature of the Aeneid's whole moral universe. A small people, displaced, fighting on terrain not their own, under a young commander who is not yet ready — all of this Virgil writes with sympathy. The Arcadians are not villains; they are not even heroes in any grand sense. They are a regional tribe drawn into someone else's war because of an alliance and because a father sent his son.

When Pallas dies, the Arcadians gather his body. They will carry it back to Evander in Book XI — the journey of the corpse is one of the most affectionate Italian-pastoral sequences Virgil writes. The small-peoples-of-Italy register is essential to the Aeneid. The war that the poem ends on is being fought between and among named villages, regional tribes, specific rivers — not between abstractions.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "aeneid-10-turnus-boasts",
    bookId: "the-aeneid",
    chapterNumber: 9,
    anchorText: "O mortals, blind in fate",
    anchorOccurrence: 1,
    title: "The sword-belt stripped — the prophetic aside",
    quotedPassage:
      "In an ill hour insulting Turnus tore / Those golden spoils, and in a worse he wore. / O mortals, blind in fate, who never know / To bear high fortune, or endure the low! / The time shall come, when Turnus, but in vain, / Shall wish untouch'd the trophies of the slain; / Shall wish the fatal belt were far away, / And curse the dire remembrance of the day.",
    passageReference: "Book X, lines 696–703 (Dryden) · Aeneid X.495–505",
    commentary: `Virgil intrudes with one of the Aeneid's most quoted authorial lines: *nēscia mēns hominum fātī sortisque futūrae, / et servāre modum rēbus sublāta secundīs!* — "The minds of men are unknowing of fate and the lot to come, and they fail to keep measure when events lift them up!" Dryden glosses the sense without the epigrammatic compactness.

This is Virgil speaking in his own voice. Turnus, at the moment of his victory, strips the belt off Pallas's body and wears it as a trophy. The reader, reading Book X, is being told by the narrator: the sword-belt you just saw him strip will be the reason he dies. The aside is a prolepsis — the future revealing itself inside the present narration — and it is one of the most dramatic formal moves in the poem.

The line is also an independent Virgilian aphorism. "The mind of man is unknowing of fate" becomes a Latin proverb in subsequent centuries. It is inscribed in countless Renaissance emblem books. It is the Aeneid's most pessimistic-authorial generalization: mortals cannot see the consequences of their victories in real time; the victory contains the defeat.

This intervention is also the hinge of the poem's moral architecture. Turnus *wore the belt in triumph*. Aeneas *saw the belt on Turnus's shoulder* two books later. Virgil has told us, in 19 BC, that the ending is already set. The Book XII killing is Book X's sword-belt becoming visible again.`,
    crossReferences: [
      {
        type: "allusion",
        description: "This prolepsis is the Aeneid's most explicit authorial intervention pointing forward to Book XII. Virgil is telling the reader what the ending will turn on. The Book X authorial aside and the Book XII belt-vision are a single architectural gesture.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (the belt seen, Turnus killed)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "linguistic"],
  },
]
