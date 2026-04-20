import type { Annotation } from "../types"

// Book X: Aeolus, the Lestrigonians, and Circè.

export const ODYSSEY_BOOK_10: Annotation[] = [
  {
    id: "odyssey-10-aeolus-bag",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "He gave, in which he had compressed and bound",
    anchorOccurrence: 1,
    title: "Aeolus's Bag",
    quotedPassage:
      "He gave me a great ox-skin bag, / In which were all the winds that howl and roar.",
    passageReference: "Book X (Bryant)",
    commentary: `Aeolus gives Odysseus a leather bag containing all the winds except the west wind that would blow them home. The crewmen, ten days into calm sailing and nine lines from Ithaca, assume the bag holds gold and open it while their captain sleeps. Storm erupts. They are driven back across the whole Mediterranean.

This is the cruelest episode of the wanderings. Ithaca is so close that Odysseus can see the firelight on the coast. Then it is gone. The crew's curiosity — the exact quality Odysseus exhibited at the Cyclops's cave — costs them years.

Homer is also writing a parable about leadership: Odysseus, exhausted, fell asleep. A captain who cannot trust his crew with a closed bag cannot leave its care to them. The hero's mistake is not the same as the crew's; it is smaller but also hero-shaped. He delegated what he should have held.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Aeolus bag is structurally the same story as the Cattle of Helios (Book XII) — a warned-against limit; a crew that cannot resist; a catastrophic cost. The pattern is Homer's signature.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "odyssey-10-lestrigonians",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "And cries of those who perished and the crash",
    anchorOccurrence: 1,
    title: "The Lestrigonians",
    quotedPassage:
      "The Lestrigonians, those huge cannibals.",
    passageReference: "Book X (Bryant)",
    commentary: `The Lestrigonians destroy eleven of Odysseus's twelve ships — the greatest single-day loss in the wanderings. They spear the sailors like fish and carry them home to feast. Only Odysseus's ship escapes because he, uncharacteristically, anchored outside the harbor while sending scouts in.

Homer's math is unsparing. Odysseus left Troy with twelve ships and a full crew. After Cicones, Cyclops, and Lestrigonians, he has one ship and a reduced crew. By the time he reaches Ithaca in Book XIII he will be alone. The wanderings are not adventures — they are a steady erasure of the Trojan veteran's world.

This book and this episode also explain why Odysseus is, structurally, such a cautious man by Book XIII. He is the sole survivor of serial catastrophes. His caution on Ithaca — the disguise, the slow recognitions, the tests of Penelope — is not narrative trick; it is how a sole survivor moves.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Aeneas in Aeneid III also loses companions at ports of call, but Virgil distributes the losses in a steadier rhythm. Homer concentrates Odysseus's losses into a single horrifying day.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book III",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-10-circe-pigs",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "She led them in and seated them on thrones.",
    anchorOccurrence: 1,
    title: "Circe Makes Them Swine",
    quotedPassage:
      "She changed them into swine / In bristles, snout, and shape, but still they kept / The human mind.",
    passageReference: "Book X (Bryant)",
    commentary: `Circe turns Eurylochus's men into pigs — bristles, snout, body, but "still they kept the human mind." The horror is specifically the preservation of the mind inside the animal shape. They are conscious of what they have become.

The transformation is also a metaphor. Men at the unguarded feast — weeping at the taste of the drugged cheese and wine — are being shown what over-indulgence actually looks like. The suitors will be sketched in this hue in Books XVII–XX. Homer's pigs in Circe's sty are a warning about the Ithacan feast-hall.

The pigs-with-human-minds figure has gone on to shape every later moral transformation fable — Apuleius's Golden Ass, the witch in Spenser's Faerie Queene, C.S. Lewis's Narnia. The Circe episode is the ancient source for the idea that vice is a shape a person wears.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Apuleius's Golden Ass (2nd century CE) inherits Circe's transformation logic and makes the donkey-shape the whole novel. The bestiary of moral transformation begins with Homer.",
        workTitle: "The Golden Ass",
        workAuthor: "Apuleius",
        passageReference: "c. 180 CE",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-10-moly",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "To dig it up; the gods find nothing hard.",
    anchorOccurrence: 1,
    title: "Moly — The Plant Only Gods Can Dig",
    quotedPassage:
      "The gods call moly. Hard it were / For man to pull it from the soil.",
    passageReference: "Book X (Bryant)",
    commentary: `Hermes gives Odysseus *moly* — a magical plant with a black root and a milky flower. "Difficult for men to dig up, but the gods can do all things." The plant renders Circe's potion harmless.

Moly is the Odyssey's first piece of explicit magic that the hero carries. (The raft was craft, not magic; Ino's veil was a gift, but a limited one.) Moly is a pharmacological shield against a pharmacological attack. The poem's magic has a rough symmetry: Circe's drugs vs. moly, Calypso's immortality-offer vs. Hermes's message, the Sirens's song vs. the wax.

Milton made much of moly in Comus (1634) — his attendant spirit identifies moly with virtue itself, an allegorical herb preserving the chaste soul from Circe-like temptation. Homer's plant became Christian ethics.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Milton's Comus (1634) allegorizes moly as Christian virtue. The plant Hermes gives Odysseus becomes the poetic figure for a chastity that cannot be overpowered by vice.",
        workTitle: "A Masque Presented at Ludlow Castle (Comus)",
        workAuthor: "John Milton",
        passageReference: "1634",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-10-circe-bed",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "We marvelled greatly; long we questioned him,",
    anchorOccurrence: 1,
    title: "Circe's Bed",
    quotedPassage:
      "Sworn the great oath.",
    passageReference: "Book X (Bryant)",
    commentary: `Odysseus makes Circe swear an oath before he consents to sleep with her. The oath is a legal act: she may not use her magic against him when he is vulnerable. He turns a potentially catastrophic intimacy into a negotiated contract.

Homer's hero is always drafting agreements. With Polyphemus he tried a guest-host compact (it failed); with Ino he accepted the loan of a veil (with promised return); with Aeolus he received a sealed bag (to be returned, in a sense, unused); with Circe he insists on sworn restraint before the bed. Odysseus's diplomacy extends even into the bedroom. It is one of the ways the Odyssey revises Iliadic manhood — through contract rather than combat.

He stays a year. The poem does not condemn him; it also does not celebrate. Homer simply records the delay. *Nostos* is slow.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare Odysseus with Circe (negotiated restraint) to Odysseus with Calypso (simple captivity). The contract with Circe is why he leaves intact; the absence of one with Calypso is why he spends seven years weeping.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book V",
        targetBookId: "the-odyssey",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "odyssey-10-elpenor-fall",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "Elpenor was the youngest of our band,",
    anchorOccurrence: 1,
    title: "Elpenor Falls from the Roof",
    quotedPassage:
      "Elpenor, the youngest of my band, / And not remarkable for sense or courage.",
    passageReference: "Book X, closing (Bryant)",
    commentary: `Elpenor, drunk, falls from Circe's roof and breaks his neck. No one notices until the ship is preparing to leave for Hades. Homer gives him four lines of memorial and a specifically non-heroic description — not remarkable for sense or courage.

This death is Homer's meditation on ordinary mortality inside an epic. Patroclus and Hector die gloriously, at the center of their narratives. Elpenor dies because he drank too much and fell off a roof. And yet he becomes the first shade Odysseus meets in Book XI, and his pleading for burial is one of the most moving passages in Homer.

The Odyssey's quiet generosity extends even to its fools.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Elpenor reappears as the first shade in Book XI, asking for burial. Homer uses the death nobody noticed to frame the underworld descent — the poem's most democratic gesture toward the dead.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XI, lines ~63–100",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },
  {
    id: "odyssey-10-going-to-hades",
    bookId: "the-odyssey",
    chapterNumber: 10,
    anchorText: "And my own luckless slumber. Yet, my friends,",
    anchorOccurrence: 1,
    title: "Circe's Instructions for Hades",
    quotedPassage:
      "Return, brave friend, but not yet home.",
    passageReference: "Book X, closing speech (Bryant)",
    commentary: `Circe tells Odysseus he must go to Hades to consult Tiresias before returning home. The requirement is unmotivated by plot — Tiresias tells him little about his nostos that Circe herself couldn't have told him. Homer includes the Nekyia because it is structurally necessary, not because it is narratively compelled.

The descent is the oldest pattern in ancient literature — Gilgamesh, Orpheus, Inanna, then Aeneas, Dante, Milton. The katabasis sits at the center of every long poem about a hero's return to meaning because the hero must see what being human ultimately is before he can return to it. Odysseus must see the dead before he can belong among the living again.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The requirement of a katabasis to precede nostos becomes one of epic's oldest rules. Aeneid VI is Virgil's direct imitation, Dante's entire Inferno is the next elaboration, and every modern heroic-journey narrative still owes Circe's instruction its shape.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
]
