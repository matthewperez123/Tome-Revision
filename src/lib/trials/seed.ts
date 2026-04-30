/**
 * Trial seed pool showcasing all six required Trial question types across
 * the existing canon (Shakespeare, Dante, Homer, Virgil, Milton, Marcus
 * Aurelius). These are demo-ready examples; per-chapter Trial banks live
 * in `lib/chapter-questions.ts` and the per-book `*-trials.ts` siblings.
 *
 * Mapping from prompt vocabulary to the codebase's existing names:
 *   prompt          → codebase
 *   ───────────────────────────────────────
 *   mcq             → multiple_choice (existing)
 *   fillBlank       → fill_blank (existing)
 *   identification  → identification (NEW)
 *   matching        → matching (existing)
 *   ordering        → ordering (existing)
 *   tfWithReason    → tf_with_reason (NEW)
 *
 * Difficulty tiers map likewise: novice → Apprentice · adept → Scholar ·
 * master → Master.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

/** Multiple-choice — 6 examples drawn from the canon. */
export const MCQ_SEED: ChapterQuestion[] = [
  {
    id: "seed-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "In the opening of the Iliad, who quarrels with Achilles and seizes Briseis as compensation?",
    options: ["Hector", "Agamemnon", "Odysseus", "Priam"],
    correctIndex: 1,
    explanation:
      "Agamemnon, forced to return Chryseis to her father, takes Briseis from Achilles. The slight is the proximate cause of the wrath that drives the entire poem.",
    citation: "Iliad I",
  },
  {
    id: "seed-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Whom does Beatrice send to guide Dante through Hell?",
    options: ["Saint Lucy", "Statius", "Virgil", "Cato"],
    correctIndex: 2,
    explanation:
      "Beatrice descends from Paradise to summon Virgil, who meets Dante in the dark wood at the start of Inferno I.",
    citation: "Inferno I, Inferno II",
  },
  {
    id: "seed-mcq-3",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Milton calls Satan’s council in Pandemonium with what aim?",
    options: [
      "To plot a direct assault on Heaven",
      "To divide Hell into provinces",
      "To debate whether to seek revenge by war or by guile",
      "To choose a successor in case Satan falls again",
    ],
    correctIndex: 2,
    explanation:
      "Book II opens with the great debate. Moloch urges open war; Belial counsels inaction; Mammon proposes settling Hell; Beelzebub revives Satan’s plan to corrupt the new world by guile.",
    citation: "Paradise Lost II",
  },
  {
    id: "seed-mcq-4",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Who does Hamlet first encounter on the battlements at Elsinore?",
    options: [
      "His mother Gertrude",
      "Claudius",
      "The Ghost of his father",
      "Ophelia",
    ],
    correctIndex: 2,
    explanation:
      "The Ghost appears in I.iv and demands revenge in I.v, setting the play in motion.",
    citation: "Hamlet I.iv–v",
  },
  {
    id: "seed-mcq-5",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Aeneas, having escaped Troy, lands first in which kingdom in Aeneid I?",
    options: ["Italy", "Sicily", "Carthage", "Crete"],
    correctIndex: 2,
    explanation:
      "A storm sent by Juno drives Aeneas to the shores of Carthage, where he meets Dido and recounts the fall of Troy.",
    citation: "Aeneid I",
  },
  {
    id: "seed-mcq-6",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Marcus Aurelius opens Book II of the Meditations with what daily exercise?",
    options: [
      "A prayer to the Olympian gods",
      "A reminder of those he will meet who behave badly",
      "A list of philosophical errors to avoid",
      "A roll of his ancestors",
    ],
    correctIndex: 1,
    explanation:
      "Begin each day, he writes, by telling yourself you will encounter ingratitude, insolence, and ill-will — and that none of it can harm a mind that holds to its own.",
    citation: "Meditations II.1",
  },
]

/** Fill-in-the-blank — 6 examples. */
export const FILL_BLANK_SEED: ChapterQuestion[] = [
  {
    id: "seed-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Sing, O goddess, the ____ of Achilles, son of Peleus.",
    correctText: "rage",
    acceptedVariants: ["wrath", "anger"],
    explanation:
      "The opening word in Greek is mēnis — usually rendered as rage, wrath, or anger. The whole poem unfolds from this single noun.",
    citation: "Iliad I.1",
  },
  {
    id: "seed-fill-2",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Midway upon the journey of our life I found myself within a forest ____.",
    correctText: "dark",
    explanation:
      "Inferno I opens with the dark wood — selva oscura — the figure of Dante’s spiritual disorientation at the poem’s threshold.",
    citation: "Inferno I.1–3",
  },
  {
    id: "seed-fill-3",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "To be, or not to be, that is the ____.",
    correctText: "question",
    explanation:
      "The most-quoted line in English drama opens Hamlet’s third soliloquy in III.i.",
    citation: "Hamlet III.i",
  },
  {
    id: "seed-fill-4",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Of ____ first disobedience, and the fruit of that forbidden tree.",
    correctText: "Man's",
    acceptedVariants: ["man's", "man"],
    explanation:
      "Milton’s opening invocation in Paradise Lost I, asking the Heavenly Muse to sing of Adam’s fall.",
    citation: "Paradise Lost I.1",
  },
  {
    id: "seed-fill-5",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Tell me, O ____, of that ingenious hero who travelled far and wide.",
    correctText: "muse",
    explanation:
      "The Odyssey opens with an invocation of the Muse — the same gesture Homer uses to open the Iliad, and which Virgil and Milton later inherit.",
    citation: "Odyssey I.1",
  },
  {
    id: "seed-fill-6",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "I sing of ____ and the man, who first from the shores of Troy came an exile of fate.",
    correctText: "arms",
    explanation:
      "Virgil’s arma virumque cano — the opening of the Aeneid, deliberately echoing both the martial Iliad and the wandering Odyssey.",
    citation: "Aeneid I.1",
  },
]

/** Identification — 6 examples. */
export const IDENTIFICATION_SEED: ChapterQuestion[] = [
  {
    id: "seed-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“To be, or not to be, that is the question.”",
    identificationSubject: "speaker",
    options: ["Macbeth", "Hamlet", "Othello", "Lear"],
    correctIndex: 1,
    explanation:
      "Hamlet’s third soliloquy in III.i. The line opens his most sustained meditation on action and consequence.",
    citation: "Hamlet III.i",
  },
  {
    id: "seed-ident-2",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Sing, O goddess, the rage of Achilles son of Peleus.”",
    identificationSubject: "book",
    options: ["The Aeneid", "The Iliad", "The Odyssey", "Paradise Lost"],
    correctIndex: 1,
    explanation:
      "The opening line of the Iliad — by tradition the first line of European literature.",
    citation: "Iliad I.1",
  },
  {
    id: "seed-ident-3",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "She descends from Paradise to send Virgil as a guide to a poet lost in the dark wood.",
    identificationSubject: "character",
    options: ["Mary", "Beatrice", "Saint Lucy", "Persephone"],
    correctIndex: 1,
    explanation:
      "Beatrice, in Inferno II, sets the chain of intercessions that brings Virgil to Dante.",
    citation: "Inferno II",
  },
  {
    id: "seed-ident-4",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“The mind is its own place, and in itself can make a heaven of hell, a hell of heaven.”",
    identificationSubject: "speaker",
    options: ["Adam", "Beelzebub", "Satan", "God the Father"],
    correctIndex: 2,
    explanation:
      "Satan rallies his fallen host in Book I of Paradise Lost. The line is famously double-edged — both defiant and self-condemning.",
    citation: "Paradise Lost I.254–255",
  },
  {
    id: "seed-ident-5",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "He weeps in his tent for the slight done him by Agamemnon, refusing to fight.",
    identificationSubject: "character",
    options: ["Patroclus", "Achilles", "Ajax", "Diomedes"],
    correctIndex: 1,
    explanation:
      "Iliad I — Achilles withdraws to his ships and prays through his mother Thetis for the Achaeans to suffer until they recognize his worth.",
    citation: "Iliad I",
  },
  {
    id: "seed-ident-6",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“I sing of arms and the man, who first from the shores of Troy came, an exile of fate.”",
    identificationSubject: "book",
    options: ["The Iliad", "The Odyssey", "The Aeneid", "Metamorphoses"],
    correctIndex: 2,
    explanation:
      "Virgil’s arma virumque cano. The line announces the Aeneid’s double inheritance from the Iliad (arms) and the Odyssey (the man).",
    citation: "Aeneid I.1",
  },
]

/** Matching — 6 examples. */
export const MATCHING_SEED: ChapterQuestion[] = [
  {
    id: "seed-match-1",
    type: "matching",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Match each character to the work in which they appear.",
    matchingLeft: ["Achilles", "Beatrice", "Satan", "Aeneas"],
    matchingRight: [
      "The Iliad",
      "The Divine Comedy",
      "Paradise Lost",
      "The Aeneid",
    ],
    correctPairs: {
      Achilles: "The Iliad",
      Beatrice: "The Divine Comedy",
      Satan: "Paradise Lost",
      Aeneas: "The Aeneid",
    },
    explanation:
      "Each of these is a defining figure of the work paired with it — the central protagonist or, in Satan’s case, the most consequential agent.",
  },
  {
    id: "seed-match-2",
    type: "matching",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Match each Shakespeare protagonist to the play they belong to.",
    matchingLeft: ["Hamlet", "Macbeth", "Lear", "Othello"],
    matchingRight: ["Hamlet", "Macbeth", "King Lear", "Othello"],
    correctPairs: {
      Hamlet: "Hamlet",
      Macbeth: "Macbeth",
      Lear: "King Lear",
      Othello: "Othello",
    },
    explanation:
      "Each of the four great tragedies takes its title from its protagonist.",
  },
  {
    id: "seed-match-3",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match the speaker to the line.",
    matchingLeft: [
      "Hamlet",
      "Satan (Milton)",
      "Achilles",
      "Aeneas",
    ],
    matchingRight: [
      "“To be, or not to be.”",
      "“The mind is its own place.”",
      "“Sing, goddess, the wrath.”",
      "“I sing of arms and the man.”",
    ],
    correctPairs: {
      Hamlet: "“To be, or not to be.”",
      "Satan (Milton)": "“The mind is its own place.”",
      Achilles: "“Sing, goddess, the wrath.”",
      Aeneas: "“I sing of arms and the man.”",
    },
    explanation:
      "These are not strictly the speakers of every line — the Iliad and Aeneid lines belong to the narrators invoking their muses — but each line is the signature opening associated with the figure beside it.",
  },
  {
    id: "seed-match-4",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each guide to the figure they accompany.",
    matchingLeft: ["Virgil", "Tiresias", "Athena", "Mentor"],
    matchingRight: ["Dante", "Odysseus (in Hades)", "Odysseus", "Telemachus"],
    correctPairs: {
      Virgil: "Dante",
      Tiresias: "Odysseus (in Hades)",
      Athena: "Odysseus",
      Mentor: "Telemachus",
    },
    explanation:
      "Guides and patrons are a recurring structural device — Dante inherits the convention from Homer through Virgil.",
  },
  {
    id: "seed-match-5",
    type: "matching",
    difficulty: "Master",
    xpReward: 15,
    text: "Match each work to the era it most strongly inaugurates.",
    matchingLeft: [
      "The Iliad",
      "The Aeneid",
      "Inferno",
      "Paradise Lost",
    ],
    matchingRight: [
      "Archaic Greek epic",
      "Augustan Rome",
      "Trecento Italian vernacular",
      "Restoration English epic",
    ],
    correctPairs: {
      "The Iliad": "Archaic Greek epic",
      "The Aeneid": "Augustan Rome",
      Inferno: "Trecento Italian vernacular",
      "Paradise Lost": "Restoration English epic",
    },
    explanation:
      "Each work either stands at the head of its tradition or marks its high point — and each subsequent epic is built in conversation with those above it.",
  },
  {
    id: "seed-match-6",
    type: "matching",
    difficulty: "Master",
    xpReward: 15,
    text: "Match each underworld traveller to the soul they speak with.",
    matchingLeft: ["Aeneas", "Odysseus", "Dante", "Orpheus"],
    matchingRight: ["Anchises", "Achilles", "Francesca", "Eurydice"],
    correctPairs: {
      Aeneas: "Anchises",
      Odysseus: "Achilles",
      Dante: "Francesca",
      Orpheus: "Eurydice",
    },
    explanation:
      "Each is a famous moment of katabasis — descent — and each shows the genre’s preoccupation with what the dead can teach the living.",
  },
]

/** Ordering — 6 examples. */
export const ORDERING_SEED: ChapterQuestion[] = [
  {
    id: "seed-order-1",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order the first four circles of Dante’s Hell, descending.",
    options: [
      "Limbo",
      "The Lustful",
      "The Gluttonous",
      "The Hoarders and Wasters",
    ],
    correctOrder: [
      "Limbo",
      "The Lustful",
      "The Gluttonous",
      "The Hoarders and Wasters",
    ],
    explanation:
      "Inferno I–VII move from Limbo (the unbaptized virtuous) through the Lustful, the Gluttonous, and the Hoarders and Wasters in the fourth circle.",
    citation: "Inferno I–VII",
  },
  {
    id: "seed-order-2",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order these events from the opening of the Iliad.",
    options: [
      "Apollo sends a plague upon the Greeks",
      "Achilles calls an assembly",
      "Agamemnon takes Briseis",
      "Achilles withdraws and prays to Thetis",
    ],
    correctOrder: [
      "Apollo sends a plague upon the Greeks",
      "Achilles calls an assembly",
      "Agamemnon takes Briseis",
      "Achilles withdraws and prays to Thetis",
    ],
    explanation:
      "The plague provokes the assembly; the assembly forces Agamemnon to give back Chryseis; Agamemnon then takes Briseis from Achilles, who withdraws.",
    citation: "Iliad I",
  },
  {
    id: "seed-order-3",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order the first three books of Paradise Lost.",
    options: [
      "Satan in Hell rallying the fallen",
      "The council of devils in Pandemonium",
      "The Father and Son in Heaven discussing the Fall",
    ],
    correctOrder: [
      "Satan in Hell rallying the fallen",
      "The council of devils in Pandemonium",
      "The Father and Son in Heaven discussing the Fall",
    ],
    explanation:
      "Book I opens in Hell, Book II is the council, Book III moves the camera to Heaven before returning to Satan’s journey through Chaos.",
    citation: "Paradise Lost I–III",
  },
  {
    id: "seed-order-4",
    type: "ordering",
    difficulty: "Master",
    xpReward: 15,
    text: "Order these epic openings chronologically (composition).",
    options: [
      "The Iliad",
      "The Aeneid",
      "Inferno",
      "Paradise Lost",
    ],
    correctOrder: [
      "The Iliad",
      "The Aeneid",
      "Inferno",
      "Paradise Lost",
    ],
    explanation:
      "Homer (8th c. BCE) → Virgil (1st c. BCE) → Dante (early 14th c.) → Milton (1667). Each later poet writes with the earlier ones explicitly in view.",
  },
  {
    id: "seed-order-5",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order the acts in which these Hamlet events occur.",
    options: [
      "The Ghost appears on the battlements",
      "The play within the play",
      "Hamlet kills Polonius",
      "The graveyard scene",
    ],
    correctOrder: [
      "The Ghost appears on the battlements",
      "The play within the play",
      "Hamlet kills Polonius",
      "The graveyard scene",
    ],
    explanation:
      "Battlements I.iv–v · play within a play III.ii · Polonius killed III.iv · graveyard V.i.",
    citation: "Hamlet I–V",
  },
  {
    id: "seed-order-6",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order Odysseus’s movements at the start of the Odyssey.",
    options: [
      "On Calypso’s island",
      "Released by the gods’ council on Olympus",
      "Wrecked on the shore of the Phaeacians",
      "Welcomed at the court of Alcinous",
    ],
    correctOrder: [
      "On Calypso’s island",
      "Released by the gods’ council on Olympus",
      "Wrecked on the shore of the Phaeacians",
      "Welcomed at the court of Alcinous",
    ],
    explanation:
      "The narrative present of the Odyssey begins with Athena pleading for Odysseus on Olympus; he is released from Calypso, wrecked, and brought to Alcinous, where he begins to recount his earlier wanderings.",
    citation: "Odyssey I, V–VII",
  },
]

/** True/False with reason — 6 examples. */
export const TF_WITH_REASON_SEED: ChapterQuestion[] = [
  {
    id: "seed-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "The Iliad covers the entire ten-year span of the Trojan War.",
    correctBool: false,
    tfReasons: [
      "It covers only a few weeks in the war’s tenth year, beginning with Achilles’s wrath.",
      "It begins with the launching of the thousand ships and ends with the wooden horse.",
      "It is set entirely after the war and follows the Greeks home.",
      "It tells the story from Hector’s point of view across all ten years.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The poem opens in the war’s tenth year and ends with the funeral of Hector. The fall of Troy itself comes later, partly in the Odyssey and the Aeneid.",
    citation: "Iliad I, XXIV",
  },
  {
    id: "seed-tfr-2",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Beatrice is Dante’s guide through Hell.",
    correctBool: false,
    tfReasons: [
      "Beatrice guides him only through Paradise; Virgil leads him through Hell and Purgatory.",
      "Beatrice guides him through Hell, then leaves at the gates of Heaven.",
      "Dante has no guide in the Inferno; Beatrice and Virgil appear later.",
      "Beatrice and Virgil share the role of guide through Hell.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Virgil is the guide through Inferno and Purgatorio. Beatrice takes over for the ascent through Paradiso.",
    citation: "Inferno I–II, Paradiso I",
  },
  {
    id: "seed-tfr-3",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Milton intends Satan as the heroic protagonist of Paradise Lost.",
    correctBool: false,
    tfReasons: [
      "Satan is rhetorically magnificent in the early books, but the poem’s argument is the fall of Man, with Adam at its centre.",
      "Milton consistently presents Satan as undivided in heroism throughout all twelve books.",
      "Milton intends only God the Father as the protagonist.",
      "Adam appears so briefly that he cannot be considered the protagonist.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Satan dominates Books I–II by design; the poem’s stated subject is Man’s first disobedience, and its long second half follows Adam and Eve.",
    citation: "Paradise Lost I.1–6, IX–X",
  },
  {
    id: "seed-tfr-4",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Hamlet’s “To be, or not to be” soliloquy occurs in Act I.",
    correctBool: false,
    tfReasons: [
      "It occurs in Act III, scene i — after the Ghost’s charge and before the play within the play.",
      "It opens the play before any other dialogue.",
      "It occurs in the graveyard in Act V.",
      "It is spoken by Horatio, not Hamlet.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The soliloquy is positioned at the play’s structural midpoint, after Hamlet has been charged by the Ghost and before he confronts Ophelia.",
    citation: "Hamlet III.i",
  },
  {
    id: "seed-tfr-5",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The Aeneid ends with the marriage of Aeneas and Lavinia.",
    correctBool: false,
    tfReasons: [
      "It ends abruptly with the killing of Turnus; the marriage is foretold but not narrated.",
      "It ends with Aeneas’s death in old age.",
      "It ends with the founding of Rome by Romulus.",
      "It ends with Aeneas refusing to settle in Italy.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Virgil leaves the Aeneid on the controversial killing of Turnus in Book XII. The marriage to Lavinia and the long-prophesied future of Rome are deferred beyond the poem’s last line.",
    citation: "Aeneid XII",
  },
  {
    id: "seed-tfr-6",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The Meditations were written by Marcus Aurelius for publication.",
    correctBool: false,
    tfReasons: [
      "They are private notebooks in Greek, never intended for an audience beyond himself.",
      "They were dictated to a secretary as a public address to the Senate.",
      "They were composed as letters to his successor Commodus.",
      "They were issued as an edict to the Roman legions.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The work survives almost by accident. Its conversational quality — “to himself” is the manuscript title — is the result of its unintended publication.",
    citation: "Meditations (manuscript title: Ta eis heauton)",
  },
]

export const TRIAL_SEED_BY_TYPE = {
  multiple_choice: MCQ_SEED,
  fill_blank: FILL_BLANK_SEED,
  identification: IDENTIFICATION_SEED,
  matching: MATCHING_SEED,
  ordering: ORDERING_SEED,
  tf_with_reason: TF_WITH_REASON_SEED,
} as const
