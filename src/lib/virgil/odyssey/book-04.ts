import type { Annotation } from "../types"

// Book IV: Conference of Telemachus and Menelaus. The second model of
// xenia, the most unsettling marriage in Homer, and the poem's first
// extended glimpse of what could have been.

export const ODYSSEY_BOOK_4: Annotation[] = [
  {
    id: "odyssey-4-sparta-arrival",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "Fulfilled it by the marriage. He was now",
    anchorOccurrence: 1,
    title: "Sparta at a Double Wedding",
    quotedPassage:
      "A double marriage-feast Atrides held.",
    passageReference: "Book IV, opening (Bryant)",
    commentary: `Telemachus arrives at Sparta during a double wedding — Menelaus's daughter Hermione and his illegitimate son Megapenthes are both being married off. The timing is extraordinary. Homer wants us to see Menelaus's palace at its most publicly domestic moment.

This is also the Odyssey's first sustained image of what a postwar household CAN look like when the war-hero returns alive. Menelaus got his wife back; Agamemnon did not. Odysseus's story will land somewhere in between. The three Atreidae outcomes structure the poem: murdered (Agamemnon), reunited with a terrible story (Menelaus), still returning (Odysseus).`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Menelaus/Helen household is the middle term in the Odyssey's three-Atreides comparison — between Agamemnon's catastrophe (told repeatedly in I, III, XI, XXIV) and Odysseus's still-pending return.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books I, III, XI, XXIV",
        targetBookId: "the-odyssey",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-4-helen-enters",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "Her high-roofed chamber, where the air was sweet",
    anchorOccurrence: 1,
    title: "Helen Enters",
    quotedPassage:
      "Helen came from her high-roofed fragrant chamber, / Like Dian of the golden shafts.",
    passageReference: "Book IV (Bryant)",
    commentary: `Homer's Helen is one of literature's strangest women. The Iliad allowed her to speak of herself with piercing self-judgment ("dog that I am"). The Odyssey, a decade later, shows her at Sparta, composed, hostess of a double wedding, casually drugging the wine with nepenthe to keep her husband's guests from weeping.

Her entrance here — "like Dian of the golden shafts" — is Homer quoting himself. The same simile described her on the walls of Troy. The point is that Helen has not changed. She is still the woman whose beauty caused a ten-year war; now she is serving them drinks.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Helen's Spartan self-possession survives in every later literary incarnation — from Euripides's bitter Helen to Marlowe's 'face that launched a thousand ships' to H.D.'s Helen in Egypt. The Odyssey's steady-eyed Helen is the hardest portrait.",
        workTitle: "Doctor Faustus",
        workAuthor: "Christopher Marlowe",
        passageReference: "Act V, Scene 1",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "odyssey-4-nepenthe",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "Mingled a drug, an antidote to grief",
    anchorOccurrence: 1,
    title: "Nepenthe",
    quotedPassage:
      "A drug of potent virtue, to dispel / The sense of pain and anger.",
    passageReference: "Book IV (Bryant)",
    commentary: `*Nepenthes pharmakon* — the drug that drives away sorrow. Helen learned the receipt in Egypt. She drops it into the wine while Telemachus and Menelaus weep for the dead of Troy.

The ethical ambiguity is sharp. Is this a kindness — relief from grief — or an evasion, a numbing away of the pain the poem itself has been asking us to feel? Plato will later attack Homer precisely for this kind of consolation-poetry. Helen's nepenthe is the first artful anesthesia in Western literature, administered by the woman whose beauty caused the grief in the first place.

Edgar Allan Poe turned nepenthe into a Romantic keyword; Baudelaire and De Quincey followed him; the word enters English pharmacology as a term for opiates. Helen's single act in Book IV shapes a two-thousand-year conversation about what poetry is for.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Poe's 'The Raven' (1845) makes nepenthe a Romantic keyword: 'Respite—respite and nepenthe from thy memories of Lenore!'",
        workTitle: "The Raven",
        workAuthor: "Edgar Allan Poe",
        passageReference: "1845",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-4-wooden-horse",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "The wooden horse, about to bring to Troy",
    anchorOccurrence: 1,
    title: "Helen at the Trojan Horse",
    quotedPassage:
      "Ulysses bade us sit within the horse, / And thou [Helen] didst come and touch the hollow wood.",
    passageReference: "Book IV (Bryant)",
    commentary: `Menelaus tells a story on Helen — at her own table. She walked around the Trojan horse calling out the wives' voices of each Greek hidden inside, trying to trick them into answering. Odysseus clamped his hand over Anticlus's mouth to keep him silent. Helen almost lost the war for the Greeks at the last possible moment.

The story sits beside the one Helen has just told (about Odysseus entering Troy as a beggar-spy, which she alone recognized). Homer deliberately lets us hear both. Helen's loyalty throughout the war was a moving target, and Menelaus — astonishingly — is allowed to say so at the wedding feast. The Spartan marriage survives by being able to tell both stories at the same table.

Dante will put Helen in the circle of the lustful with Paris (Inferno V). Homer is more ambivalent, and more honest.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid II — the Trojan horse night — draws directly on this book. Sinon's deception, Laocoön's warning, the city's credulity: Virgil is working with the Odyssey's source material to rewrite the fall of Troy from the losers' perspective.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II",
        targetBookId: "the-aeneid",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "odyssey-4-proteus",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "To the great Proteus, Ancient of the Deep.",
    anchorOccurrence: 1,
    title: "Wrestling Proteus",
    quotedPassage:
      "The ancient of the deep, unerring Proteus, / The immortal Egyptian.",
    passageReference: "Book IV (Bryant)",
    commentary: `Menelaus's adventure at Pharos is a tiny displaced Odyssey inside Book IV — a man stranded on an island, instructed by a goddess-daughter (Eidothea), told to ambush a shape-shifting sea-god, given cryptic prophecies about his friends' returns.

Proteus turns into a lion, a serpent, a leopard, a boar, running water, a great tree. The hero must hold on through every transformation to get the truth. This is Homer's image of knowledge itself — you don't ask it questions; you wrestle it, and it tells you only when it cannot change anymore.

James Joyce names his third Ulysses episode "Proteus" (Stephen Dedalus on the Sandymount strand, thinking about shape-shifting perception) for exactly this reason.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Joyce's Ulysses Episode 3 ('Proteus') takes Menelaus's wrestling of the shape-shifter as the model for Stephen's pre-lunch walk along Sandymount, thinking about change, form, and the untrustworthy senses.",
        workTitle: "Ulysses",
        workAuthor: "James Joyce",
        passageReference: "Episode 3 (Proteus)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "odyssey-4-agamemnon-death",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "To Troy. Deiphobus, the godlike chief,",
    anchorOccurrence: 1,
    title: "Agamemnon Felled Like an Ox",
    quotedPassage:
      "Unhappy chief, felled like an ox at crib.",
    passageReference: "Book IV (Bryant)",
    commentary: `Proteus tells Menelaus about Agamemnon's murder. The detail — *felled like an ox at the manger* — is horrific because it domesticates the violence. Agamemnon, sacker of Troy, is killed the way livestock is killed, at a feast, by a host.

Homer returns to this detail in Book XI (Agamemnon's own shade tells the story), and again in XXIV. The repetition is structural. Every time Odysseus's return feels delayed, Agamemnon's fate is invoked to remind the reader what a *bad* return looks like. Ithaca is a minefield of Agamemnon-possibilities — the wife who might be Clytemnestra, the suitor who might be Aegisthus — and the suspense of the middle books lives on this analogy.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The ox-at-manger simile recurs in Aeschylus's Agamemnon, where Clytemnestra boasts of the killing with the same brutally domestic imagery.",
        workTitle: "Agamemnon",
        workAuthor: "Aeschylus",
        passageReference: "Lines 1388–1392",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical"],
  },
  {
    id: "odyssey-4-suitors-plot",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "And slew him at the board as men might slay",
    anchorOccurrence: 1,
    title: "The Ambush at Asteris",
    quotedPassage:
      "We will lay an ambush for him.",
    passageReference: "Book IV, later (Bryant)",
    commentary: `While Telemachus is drinking wine in Sparta, the suitors decide to kill him on his way home. They will hide a ship at the island of Asteris, in the straits between Ithaca and Samos, and intercept him at sea.

Homer shifts scene with surgical timing: Telemachus abroad is safe; Telemachus on the water is marked for death. The plot will be frustrated in Book XV by Athena's direct intervention, but the threat hangs over the whole middle of the poem. Every time we return to Ithaca before Book XVI, the suitors are waiting for news of Telemachus's death.

This is the Odyssey's one genuine thriller plot — a son hunted while a disguised father approaches. Few narrative structures built since have had its patience.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Asteris ambush is the narrative kernel that the Telemachus/Odysseus parallel plot is built around. It makes the Telemachy not just a Bildungsroman but a thriller.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books XV–XVI",
        targetBookId: "the-odyssey",
        targetChapterNumber: 15,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "odyssey-4-penelope-fears",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "When, midst a crowd of men, he sees with dread",
    anchorOccurrence: 1,
    title: "Penelope as a Besieged Lion",
    quotedPassage:
      "As is a lion in a crowd of men, / Beset with fear.",
    passageReference: "Book IV, closing (Bryant)",
    commentary: `Penelope learns (from Medon) both that her son has sailed without her knowledge and that the suitors are planning to kill him. She collapses onto her threshold. Homer compares her to a lion surrounded by hunters — a remarkable simile for a woman at home in grief.

The Iliad reserves lion-similes for warriors on the killing-field; the Odyssey gives one to a queen frightened for her child. Homer's heroic vocabulary is being redirected. Penelope's stillness, her weeping, her refusal of food and sleep — these are heroic behaviors in the poem's new moral grammar.

A goddess-sent dream (her sister Iphthime) consoles her at the book's end. The dream ambiguously declines to tell her whether Odysseus lives. Penelope wakes consoled but unenlightened — the poem's default condition.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Iliad's lion-similes are almost entirely martial (Achilles, Hector, Agamemnon). The Odyssey redeploys the image to a domestic scene — evidence of how the sequel reshapes the earlier poem's heroic vocabulary for new ends.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Books V, XI, XVII",
        targetBookId: "the-iliad",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "odyssey-4-helen-prophecy",
    bookId: "the-odyssey",
    chapterNumber: 4,
    anchorText: "Is it yet known what lineage these men claim\uFEFF—",
    anchorOccurrence: 1,
    title: "Helen Reads the Omen",
    quotedPassage:
      "As in his own house now the eagle stooped ... / So shall Ulysses ... visit vengeance on the guilty crew.",
    passageReference: "Book IV (Bryant)",
    commentary: `A last moment from Sparta: an eagle carries off a domestic goose. Helen — who earlier served drugged wine to deaden grief — now reads the omen correctly: Odysseus will come home and kill the suitors.

Helen as prophet. It is a startling note. The woman who caused the Trojan War is also, apparently, a reader of birds. Homer insists on her complexity until the end. She is neither rescued innocent nor irredeemable villain; she is someone who has seen too much, absorbed too many languages (Egyptian drugs, Trojan nights, Spartan court), and can occasionally tell the truth faster than anyone else in the room.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Cassandra, in the Oresteia, is the tragic version of Helen the seer — compelled to speak truths no one will believe. Helen's Odyssey-IV augury is her Cassandra-moment, and the Spartan court actually listens.",
        workTitle: "Agamemnon",
        workAuthor: "Aeschylus",
        passageReference: "Cassandra's scene",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },
]
