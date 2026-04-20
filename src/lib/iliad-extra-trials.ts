/**
 * Iliad extra trials — Books V through XXIV (chapterIndex 5..24) plus
 * the "Iliad Master Trial" (chapterIndex 25) that awards the *Mēnis*
 * (Wrath) Seal. The QUESTION_BANK in chapter-questions.ts already
 * covers Books I–IV (chapterIndex 0..4); this file supplements.
 *
 * Merged at lookup time by `getQuestionsForChapter` in
 * chapter-questions.ts via a require() at the end of the dispatcher.
 *
 * Schema matches `ChapterQuestion` in chapter-questions.ts. Every
 * question carries Apprentice difficulty by default; Scholar and
 * Master variants are added for the most-taught books (V Diomedes, VI
 * Hector/Andromache, IX Embassy, XVI Patroclus, XVIII Shield, XXII
 * Hector's death, XXIV Priam).
 *
 * Translation reference: William Cullen Bryant's 1870 blank verse
 * (Standard Ebooks edition). Quoted phrasing from Bryant verbatim.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const ILIAD_EXTRA_TRIALS: Record<number, ChapterQuestion[]> = {

  // ── Book V — Aristeia of Diomedes ────────────────────────────────
  5: [
    {
      id: "iliad-5-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book V is the *aristeia* (best-day-of-combat) of which Greek hero?",
      options: ["Ajax", "Diomedes — who with Athena's help wounds two gods (Aphrodite and Ares) in a single day", "Agamemnon", "Patroclus"],
      correctIndex: 1,
      explanation:
        "Book V is the most sustained battlefield sequence in the Iliad devoted to one hero. Athena removes the mist from Diomedes's eyes so he can distinguish gods from men; he wounds Aphrodite when she tries to rescue her son Aeneas and wounds Ares directly. The passage sets the template for every later aristeia in epic.",
    },
    {
      id: "iliad-5-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Diomedes wounds Aphrodite on the hand as she attempts to carry her son off the battlefield. Who is the son?",
      options: ["Paris", "Aeneas — the future hero of Virgil's Aeneid; Book V contains the earliest epic appearance of the character Virgil will build an entire poem around", "Helen's son", "Glaucus"],
      correctIndex: 1,
      explanation:
        "Aphrodite's rescue of Aeneas is one of the Iliad's most important small scenes for the later tradition: it preserves Aeneas for his eventual exile and founding of Rome. Virgil's Aeneid begins after Troy falls and Aeneas, saved again (this time by Venus shielding his family from the flames), flees to Italy.",
    },
  ],

  // ── Book VI — Hector and Andromache ──────────────────────────────
  6: [
    {
      id: "iliad-6-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book VI's Scaean Gate scene includes which striking domestic moment?",
      options: ["A battle", "The baby Astyanax, frightened by his father Hector's crested helmet, draws back into his nurse's arms; Hector sets the helmet down, takes the child, and prays he will grow greater than his father", "A council of gods", "A funeral"],
      correctIndex: 1,
      explanation:
        "The scene between Hector, Andromache, and Astyanax at the Scaean Gate is the Iliad's most piercing domestic portrait: the warrior's helmet (the instrument of his death) terrifies his own child. Simone Weil reads it as the poem's definitive statement of what violence does to tenderness.",
    },
    {
      id: "iliad-6-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Glaucus's *generations of leaves* simile (*as is the generation of leaves, so is the generation of men*) becomes what in the later epic tradition?",
      options: ["Ignored", "A cross-canonical topos — Virgil reworks it in Aeneid VI (the souls at Acheron compared to falling leaves); Dante alludes in Inferno III; Milton echoes in Paradise Lost I (the fallen angels thick as autumn leaves in Vallombrosa)", "A minor phrase", "Deleted in translation"],
      correctIndex: 1,
      explanation:
        "Glaucus's simile generates one of the most consistent thematic chains in European epic — every poet in the tradition reworks the image of falling leaves for the mortality of human generations. The Vallombrosa simile in Paradise Lost I.302 is the most famous English instance.",
    },
  ],

  // ── Book VII — Duel of Hector and Ajax ───────────────────────────
  7: [
    {
      id: "iliad-7-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book VII centers on a duel between Hector and which Greek hero, broken off at nightfall with both combatants exchanging gifts?",
      options: ["Diomedes", "Ajax — the greater Ajax son of Telamon; the exchange of gifts after the undecided duel becomes famously ironic when Ajax later dies by Hector's sword and Hector is dragged by Achilles using Ajax's belt", "Odysseus", "Patroclus"],
      correctIndex: 1,
      explanation:
        "The Hector-Ajax duel and gift exchange is one of the Iliad's most richly ironic set-pieces: the gifts pass between hands that will later kill each other. Sophocles's tragedy *Ajax* turns on exactly this belt-sword chain.",
    },
  ],

  // ── Book VIII — Zeus Tilts the Scales ────────────────────────────
  8: [
    {
      id: "iliad-8-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "In Book VIII Zeus acts on Thetis's plea from Book I and tilts the battle against the Greeks — using what image?",
      options: ["A thunderbolt", "A golden scale with two fates weighed in it — the Trojans' side rises, the Greeks' sinks", "A chariot", "A lightning flash"],
      correctIndex: 1,
      explanation:
        "Zeus's golden balance — the *Dios talanta* — becomes one of the Iliad's recurring metaphors for fate. Milton reworks the image in Paradise Lost IV, where a heavenly scale appears to decide the duel between Satan and Gabriel.",
    },
  ],

  // ── Book IX — The Embassy to Achilles ────────────────────────────
  9: [
    {
      id: "iliad-9-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "In Book IX, Agamemnon sends an embassy (Odysseus, Phoenix, Ajax) to Achilles with what offer?",
      options: ["Nothing at all", "Full restitution of Briseis, great gifts (tripods, horses, slaves), and one of Agamemnon's own daughters in marriage — Achilles refuses every offer", "A duel", "Only an apology"],
      correctIndex: 1,
      explanation:
        "The lavish Book IX offer — which Agamemnon *should* have made in Book I — is refused by Achilles with increasingly radical arguments. His final answer is the Iliad's most philosophically extended speech: honor is not commensurable with material compensation, and he will not be bought back into a war he has been publicly shamed out of.",
    },
    {
      id: "iliad-9-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Achilles's speech in Book IX includes the poem's most famous meditation on fate — he reveals his mother told him he has two possible deaths. What are they?",
      options: ["Quick and slow", "A long, quiet, inglorious life at home in Phthia — or a short glorious life at Troy; his acceptance of the short life is the Iliad's defining existential commitment", "Happy and sad", "Rich and poor"],
      correctIndex: 1,
      explanation:
        "Achilles's *dichtha* (two-fold) fate — the choice between *nostos* (homecoming) and *kleos* (glory) — becomes the template for every later epic hero's decision. Aeneas inherits a version (Italy vs. Carthage), Dante inherits another (the pilgrimage vs. worldly power).",
    },
  ],

  // ── Book X — Doloneia (Dolon) ────────────────────────────────────
  10: [
    {
      id: "iliad-10-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book X (sometimes called the *Doloneia*) tells of a night raid by whom?",
      options: ["Hector alone", "Odysseus and Diomedes — they capture and interrogate the Trojan spy Dolon, then massacre the sleeping Thracian camp led by Rhesus. Ancient and modern editors have sometimes questioned the book's authenticity as separate from the main Iliad", "Ajax and Patroclus", "Paris and Helen"],
      correctIndex: 1,
      explanation:
        "The Doloneia is the Iliad's most violent and most morally uncomfortable book — a clandestine night raid with zero Homeric heroism, culminating in the slaughter of men in their sleep. Some ancient scholars thought it was a later addition; modern editors generally keep it in, as its presence is attested from earliest manuscripts.",
    },
  ],

  // ── Book XI — Nestor's Long Speech / Agamemnon's Aristeia ───────
  11: [
    {
      id: "iliad-11-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XI features Agamemnon's aristeia — and what important plot-trigger?",
      options: ["Ajax falls", "Nestor tells Patroclus a long story about his own youth, and urges Patroclus to persuade Achilles to return — or at least to let Patroclus borrow his armor; the seed of Book XVI is planted here", "Hector dies", "The Greek camp burns"],
      correctIndex: 1,
      explanation:
        "Nestor's speech to Patroclus in Book XI is the structural hinge that connects the first third and the middle of the poem: the armor-borrowing idea originates here, at Nestor's prompting. Patroclus's fate is effectively set five books before it happens.",
    },
  ],

  // ── Book XII — The Wall ─────────────────────────────────────────
  12: [
    {
      id: "iliad-12-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XII shows Hector breaching what?",
      options: ["The Trojan walls", "The Greek wall built around the ships — he smashes through the gate with a huge stone, and the Trojans pour across; this is the moment the Greek army is in imminent existential danger", "A ship", "A horse"],
      correctIndex: 1,
      explanation:
        "The breach of the Greek wall — with Hector hurling the stone — is one of the Iliad's most charged moments of reversal. Homer comments that the wall will be washed away entirely by the gods' rivers after the war, anticipating Troy's total disappearance.",
    },
  ],

  // ── Book XIII ─────────────────────────────────────────────────
  13: [
    {
      id: "iliad-13-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XIII shows which god intervening on the Greek side, disguised as Calchas?",
      options: ["Athena", "Poseidon (Neptune) — he rallies the failing Greek line in disguise while Zeus's attention is elsewhere; the divine-political intrigue runs parallel to the battlefield throughout", "Hephaestus", "Hermes"],
      correctIndex: 1,
      explanation:
        "Poseidon's disguised intervention opens Book XIII — a reminder that even Zeus's explicit command to leave the battle alone can be circumvented by a god who takes a human form. Homer's theology is pragmatic about divine rule-breaking.",
    },
  ],

  // ── Book XIV — Deception of Zeus ─────────────────────────────
  14: [
    {
      id: "iliad-14-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XIV's comic highlight is:",
      options: ["A duel", "The *Deception of Zeus* (*Dios apatē*) — Hera borrows Aphrodite's seductive girdle, tricks Zeus into sleeping with her on Mount Ida, and gives Poseidon free hand to help the Greeks", "A funeral", "A speech"],
      correctIndex: 1,
      explanation:
        "The Deception of Zeus is the Iliad at its most playful — a scene of divine sexual politics inserted into the middle of the war's worst crisis. The contrast is part of Homer's method: the gods' self-indulgent comedy runs alongside the humans' suffering without apology.",
    },
  ],

  // ── Book XV ────────────────────────────────────────────────
  15: [
    {
      id: "iliad-15-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Zeus wakes up in Book XV and discovers Hera's trick. What does he do?",
      options: ["Laughs", "Orders all gods off the battlefield; Apollo restores Hector to full strength, and the Trojans reach the Greek ships — one of which Hector actually sets fire to", "Forgives Hera", "Joins the Greeks"],
      correctIndex: 1,
      explanation:
        "Zeus's re-assertion of control restores the plan he outlined in Book I: the Greeks must be driven back until Achilles returns. The burning of the first ship is the crisis that will push Patroclus past his restraint in Book XVI.",
    },
  ],

  // ── Book XVI — Death of Patroclus ────────────────────────────
  16: [
    {
      id: "iliad-16-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Patroclus dies in Book XVI by whose hand?",
      options: ["Aeneas", "Hector — but only after Apollo strikes Patroclus first, stunning him and stripping off Achilles's armor; Euphorbus wounds him; Hector merely delivers the killing blow. The three-part killing is a statement about the limits of Patroclus's presumption", "Paris", "Sarpedon"],
      correctIndex: 1,
      explanation:
        "The three-killer structure — god, minor warrior, great warrior — is Homer's way of distributing the weight of Patroclus's death. Apollo, Euphorbus, and Hector together take down the man in Achilles's armor; no single human could do it.",
    },
    {
      id: "iliad-16-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Patroclus's dying prophecy to Hector is:",
      options: ["That he will be forgotten", "That Hector himself will die soon at the hands of Achilles — the same prophetic threshold-of-death clarity Hector will give Achilles in Book XXII", "That Troy will fall", "That Zeus will weep"],
      correctIndex: 1,
      explanation:
        "The dying Patroclus's prophecy begins a chain that the Iliad completes in Book XXII (Hector's dying prophecy to Achilles). Homer gives each great death a prophetic farewell — a moment of momentary clairvoyance that becomes one of the poem's most-imitated conventions.",
    },
  ],

  // ── Book XVII — Fight Over Patroclus's Body ─────────────────
  17: [
    {
      id: "iliad-17-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XVII is occupied entirely with what?",
      options: ["A funeral", "The battle over Patroclus's body — Menelaus and the two Ajaxes defend it; the Trojans strip the armor (Achilles's own, now Hector's trophy). The book is the Iliad's most sustained study of the honor owed to a corpse", "A council", "A truce"],
      correctIndex: 1,
      explanation:
        "The struggle over Patroclus's body fills an entire book because the recovery of the corpse is itself a major part of the death. The Iliad's theology of honor extends past the moment of killing into what happens to the body — a theme that will culminate in Book XXIV.",
    },
  ],

  // ── Book XVIII — Shield of Achilles ──────────────────────────
  18: [
    {
      id: "iliad-18-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XVIII contains the famous description of Achilles's new shield — made by whom?",
      options: ["Athena", "Hephaestus (Vulcan) — the divine smith forges new armor for Achilles at Thetis's request; the shield's elaborate description is the first *ecphrasis* (description of a work of visual art) in Western literature", "Thetis", "Ares"],
      correctIndex: 1,
      explanation:
        "The Shield of Achilles is the founding text of the *ecphrasis* tradition — a poem's detailed description of a visual image, often implying a whole world view. Virgil's Shield of Aeneas, Dante's Purgatorio X marble reliefs, Keats's Grecian Urn, Auden's 'The Shield of Achilles' — all trace back here.",
    },
    {
      id: "iliad-18-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "What is depicted on the shield besides warfare?",
      options: ["Only battle scenes", "A complete picture of human civilization — two cities (one at war, one at peace with weddings and a lawsuit), plowing, harvest, vintage, herding, a dance — surrounded at the rim by the Ocean stream; war is only one panel among many", "Only gods", "Only stars"],
      correctIndex: 1,
      explanation:
        "The Shield's comprehensive design is one of the Iliad's broadest statements: Hephaestus makes Achilles carry the whole of human life into battle. W. H. Auden's 1952 poem 'The Shield of Achilles' rewrites the image for the twentieth century, noting that the city-at-peace has disappeared from it.",
    },
  ],

  // ── Book XIX — Reconciliation / Achilles Returns ─────────────
  19: [
    {
      id: "iliad-19-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "In Book XIX, Achilles is reconciled with Agamemnon. What curious extra character does Homer make speak at length?",
      options: ["His mother", "Achilles's horse Xanthus — Hera gives him the power of speech to warn Achilles of his coming death; the horse is then silenced by the Furies", "His squire", "A priest"],
      correctIndex: 1,
      explanation:
        "Xanthus's one speech — the only speaking horse in Homer — delivers the Iliad's clearest statement that Achilles is about to die. The moment is brief, strange, and mostly ignored by Achilles, who already knows. It prefigures Balaam's ass in the Bible.",
    },
  ],

  // ── Book XX — Theomachy ─────────────────────────────────────
  20: [
    {
      id: "iliad-20-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XX's signature scene is:",
      options: ["A funeral", "The *theomachy* — Zeus releases all gods to fight each other on the battlefield, taking sides (Hera, Athena, Poseidon, Hermes, Hephaestus vs. Apollo, Ares, Artemis, Aphrodite, Leto, Xanthus); the divine chaos runs alongside the human action", "A trial", "A banquet"],
      correctIndex: 1,
      explanation:
        "The theomachy is the Iliad at its most baroque. The gods' fights are partly comic (Athena knocks Ares down with a boundary stone; Hera boxes Artemis's ears) and partly grand (Poseidon against Apollo refuses to fight out of embarrassment for their ancestral grudge). It clears the way for Achilles's final aristeia.",
    },
  ],

  // ── Book XXI — Achilles vs. the River ────────────────────────
  21: [
    {
      id: "iliad-21-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "In Book XXI, Achilles slaughters Trojans so relentlessly that what rises against him?",
      options: ["A wall", "The river Scamander itself — the river-god floods his banks to drown Achilles for choking its waters with corpses; Hephaestus's fire must drive the river back. The natural world physically revolts against Achilles's wrath", "Hector", "A mountain"],
      correctIndex: 1,
      explanation:
        "The river Scamander's flood is the Iliad's most astonishing image of excess: Achilles's killing has passed human scale and the landscape itself must intervene. Milton's Leviathan and Blake's Orc owe something to the scene.",
    },
  ],

  // ── Book XXII — Death of Hector ──────────────────────────────
  22: [
    {
      id: "iliad-22-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Before the duel, Hector runs around the walls of Troy three times pursued by Achilles. Why doesn't Hector stop?",
      options: ["He can't", "He knows that if he stops fighting he will die — the pursuit is the Iliad's most concentrated picture of fear in a warrior; Homer doesn't blame him for running", "He doesn't care", "He's lost"],
      correctIndex: 1,
      explanation:
        "Hector's flight is one of the Iliad's most unusual scenes: the bravest Trojan running from the bravest Greek. Homer's refusal to condemn the fear — he describes it matter-of-factly — is part of the poem's unsentimental honesty about courage.",
    },
    {
      id: "iliad-22-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Athena deceives Hector into standing to fight by taking the form of whom?",
      options: ["Paris", "Hector's brother Deiphobus — Athena appears at Hector's side seemingly to support him; when Hector throws his spear at Achilles and then turns for a second spear from Deiphobus, the figure is gone. The trick is divine and absolute", "Priam", "Aeneas"],
      correctIndex: 1,
      explanation:
        "Athena's impersonation of Deiphobus is the Iliad's clearest picture of divine collaboration against a particular human: the gods decide Hector's time has come and arrange the sequence of fear, flight, deception, and duel that delivers him to Achilles.",
    },
  ],

  // ── Book XXIII — Funeral Games for Patroclus ────────────────
  23: [
    {
      id: "iliad-23-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book XXIII contains funeral games for Patroclus — with what notable feature?",
      options: ["Only running", "A full suite of athletic contests (chariot race, boxing, wrestling, foot-race, spear-throwing, archery, single-combat) that anticipates the Olympics and becomes the template for every epic set of funeral games (Virgil Book V, Beowulf's Beowulf-Breca swim, etc.)", "A parade", "A feast only"],
      correctIndex: 1,
      explanation:
        "The funeral games for Patroclus are the founding catalog of athletic competition in Western literature. Virgil's Book V (funeral games for Anchises) is the most direct descendant; Malory's Pentecost tournaments owe something to the tradition.",
    },
  ],

  // ── Book XXIV — Priam Ransoms Hector ─────────────────────────
  24: [
    {
      id: "iliad-24-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Iliad's final scene is:",
      options: ["The fall of Troy", "Priam and Achilles weeping together in Achilles's tent — Priam for Hector, Achilles for Patroclus and for his own father Peleus whom he will never see again; they eat a shared meal and Hector's body is returned", "Achilles's death", "A Greek victory"],
      correctIndex: 1,
      explanation:
        "The Iliad does not end at Troy's fall. It ends with recognition: the Trojan king and the Greek hero acknowledging they share the condition of bereaved mortality. This is the poem's theological statement — the condition of loss is what the warriors have in common, not the condition of victory.",
    },
    {
      id: "iliad-24-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Who guides Priam into the Greek camp?",
      options: ["Athena", "Hermes (Mercury / Argeiphontes / *Argicide*) — disguised as a young Greek, he conducts the old king past every watchman invisibly; this is Hermes in his role as *psychopompos*, the guide of travelers between worlds", "Apollo", "Iris"],
      correctIndex: 1,
      explanation:
        "Hermes's role as guide of the grieving king prefigures his later role as *psychopompos* — the conductor of souls to the underworld. Priam's journey to Achilles is structurally a descent into the realm of the dead; Hermes guides him as he will one day guide the souls themselves.",
    },
    {
      id: "iliad-24-3",
      type: "multiple_choice",
      difficulty: "Master",
      xpReward: 15,
      text: "The Iliad's final scene is often compared to which later scene from the European epic tradition?",
      options: ["A random battle", "Dante's Inferno V (Francesca) — both scenes present a speaker whose grief or passion produces a swoon in the listener, forcing the listener into temporary identification with the sorrow. But Homer's scene ends in recognition and shared meal; Dante's ends in Dante falling as a dead body falls", "A purgatorial climb", "A divine ascent"],
      correctIndex: 1,
      explanation:
        "The Priam-Achilles meeting and the Francesca-Dante encounter are the two canonical scenes in the tradition where pity overwhelms the listener. Homer's ends in communion (shared weeping, shared meal); Dante's ends in the pilgrim's collapse. The difference is the whole difference between pagan-epic and Christian-epic ethics.",
    },
  ],

  // ── Master Trial (chapterIndex 25) — the "Mēnis" Seal ───────
  25: [
    {
      id: "iliad-master-1",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Iliad's twenty-four books form what larger-scale arc?",
      options: ["A chronological war history", "A ring-composition anchored at the openings and closings: Book I (Chryseis returned, plague begins, Achilles's wrath) mirrors Book XXIV (Hector's body returned, shared meal, wrath dissolved); Book II (ships catalog) mirrors Book XXIII (funeral games); the middle books are the poem's war-interior", "A series of duels", "A complete siege narrative"],
      correctIndex: 1,
      explanation:
        "The Iliad's ring-composition — the end mirrors the beginning — is a reading widely accepted since the 20th-century oral-formulaic scholars (Parry, Lord). The poem's twenty-four-book arc begins and ends with a body being returned to its father; the plot is the interior space between those symmetric acts of restoration.",
    },
    {
      id: "iliad-master-2",
      type: "multiple_choice",
      difficulty: "Master",
      xpReward: 15,
      text: "Simone Weil's 1940 essay *The Iliad, or the Poem of Force* argues the poem's central insight is:",
      options: ["War is good", "That *force* turns whatever it touches into a *thing* — it equalizes victor and victim; the Iliad's genius is in showing no one wields force without being shaped by it; the poem's true subject is the universal degradation that force visits on everyone, Trojan and Greek alike", "Gods determine fate", "Heroes are rewarded"],
      correctIndex: 1,
      explanation:
        "Weil's essay, written under Nazi occupation in 1940 and published in 1945, is the most-cited 20th-century reading of the Iliad. Her central claim — that the poem's subject is not victory but the degrading effect of violence on all participants — has shaped modern reception decisively.",
    },
  ],
}
