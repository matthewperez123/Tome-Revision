/**
 * Trial bank — The Odyssey, Books I–III.
 *
 * Keyed to the chapter indices in `src/data/chapters.ts`. Index 0 is the
 * Preface; Books I, II, III sit at indices 1, 2, 3, with the in-data titles
 * “Athena Inspires the Prince,” “Telemachus Sets Sail,” and the visit to
 * Pylos in Book III.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

// ─────────────────────────────────────────────────────────────────────────────
// Book I — Athena Inspires the Prince
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_I: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "odyssey-bk1-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "On Olympus at the start of Book I, which god is absent — and so cannot oppose Athena’s plea for Odysseus?",
    options: ["Poseidon, who has gone to feast among the Aethiopians", "Apollo, who is in Lycia", "Hephaestus, who is at his forge", "Hermes, who is delivering a message in Egypt"],
    correctIndex: 0,
    explanation:
      "Poseidon is feasting among the Aethiopians — the god whose anger has kept Odysseus from home is conveniently elsewhere when the rest of the Olympians decide to act.",
    citation: "Odyssey I.22–27",
  },
  {
    id: "odyssey-bk1-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What disguise does Athena adopt when she descends to Ithaca to rouse Telemachus?",
    options: [
      "An old beggar at the gates",
      "Mentes, a Taphian guest-friend of the family",
      "A young slave-girl in Penelope’s household",
      "An eagle perched at the palace door",
    ],
    correctIndex: 1,
    explanation:
      "Athena takes the form of Mentes, lord of the Taphians and an old guest-friend of Odysseus, so the visit reads as a courtesy call but lets her speak with authority to Telemachus.",
    citation: "Odyssey I.105–112",
  },
  {
    id: "odyssey-bk1-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Tell me, ____, of that man of many turns, who wandered far after the sack of Troy.",
    correctText: "Muse",
    acceptedVariants: ["O Muse", "muse", "goddess"],
    explanation:
      "The Odyssey’s opening: Andra moi ennepe, Mousa, polytropon… The invocation of the Muse is the first formal act of every Greek epic; here she is asked specifically to sing the “man of many turns.”",
    citation: "Odyssey I.1",
  },
  {
    id: "odyssey-bk1-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "She sits in the hall weaving and unweaving her web by night, holding the suitors at bay until her husband returns.",
    identificationSubject: "character",
    options: ["Helen", "Penelope", "Eurycleia", "Calypso"],
    correctIndex: 1,
    explanation:
      "Penelope’s ruse with the shroud of Laertes — promising to choose a suitor when it is finished, then unweaving it each night — is reported in Book I and again in Book II as the most famous act of cunning that meets Odysseus’s.",
    citation: "Odyssey II.93–110 (recounted from I)",
  },
  {
    id: "odyssey-bk1-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "When Athena/Mentes counsels Telemachus, she encourages him simply to wait at home until news comes of his father.",
    correctBool: false,
    tfReasons: [
      "She tells him to call the suitors to assembly, then sail to Pylos and Sparta to seek news of Odysseus.",
      "She tells him to remain in the palace and never leave Ithaca.",
      "She tells him to challenge the suitors to single combat.",
      "She tells him to sail directly to Troy.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Athena’s programme for Telemachus has two stages: an open denunciation of the suitors before the assembly, and a sea-journey to gather news from Nestor and Menelaus. The Telemachy is the fulfilment of this programme.",
    citation: "Odyssey I.269–305",
  },
  {
    id: "odyssey-bk1-app-order-1",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order these events of Book I.",
    options: [
      "The gods on Olympus discuss Odysseus while Poseidon is away",
      "Athena descends to Ithaca disguised as Mentes",
      "Telemachus rebukes the suitors in his own hall",
      "Penelope is sent up to her chamber to weep over Odysseus’s memory",
    ],
    correctOrder: [
      "The gods on Olympus discuss Odysseus while Poseidon is away",
      "Athena descends to Ithaca disguised as Mentes",
      "Telemachus rebukes the suitors in his own hall",
      "Penelope is sent up to her chamber to weep over Odysseus’s memory",
    ],
    explanation:
      "The book’s arc moves from divine assembly to mortal household, ending with Telemachus standing up — for the first time — to send his mother above and assert authority in the hall.",
    citation: "Odyssey I",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "odyssey-bk1-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What argument does Zeus open with on Olympus in Book I, framing the Odyssey’s theology?",
    options: [
      "That the gods owe Odysseus a debt of honour",
      "That mortals blame the gods for their own folly, citing the case of Aegisthus",
      "That fate cannot be altered by any prayer",
      "That Poseidon has a stronger claim than Athena",
    ],
    correctIndex: 1,
    explanation:
      "Zeus’s opening speech complains that mortals charge the gods with their own ills, even though they suffer beyond their share by their own recklessness. He cites Aegisthus, who was warned by Hermes and yet murdered Agamemnon. The frame casts the Odyssey as a poem about responsibility.",
    citation: "Odyssey I.32–43",
  },
  {
    id: "odyssey-bk1-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why does the bard Phemius sing of the Greek homecomings rather than another subject in the suitors’ hall?",
    options: [
      "He is commanded by the suitors to do so",
      "He is constrained, and Penelope finds the song unbearable; Telemachus defends his right to sing the newest song",
      "He sings of his own free will, hoping to honour Odysseus",
      "He is paid by Antinous to sing of the Greek heroes",
    ],
    correctIndex: 1,
    explanation:
      "Phemius sings under duress; Penelope comes down and asks him to choose another subject. Telemachus answers — his first independent speech in the poem — that the newest song always pleases the listeners and that bards are not to blame for the doom Zeus assigns.",
    citation: "Odyssey I.325–359",
  },
  {
    id: "odyssey-bk1-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Athena gives Telemachus a programme: convene the assembly, then sail to ____ to question Nestor, and on to Sparta.",
    correctText: "Pylos",
    explanation:
      "The Telemachy maps onto two visits — Nestor’s court at Pylos in Book III, and Menelaus’s at Sparta in Book IV. Each is a court the audience already knows from the Iliadic tradition.",
    citation: "Odyssey I.281–286",
  },
  {
    id: "odyssey-bk1-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“Polytropon” — the man of many turns or shifts. The epithet that opens the Odyssey is canonically applied to whom?",
    identificationSubject: "character",
    options: ["Telemachus", "Nestor", "Odysseus", "Menelaus"],
    correctIndex: 2,
    explanation:
      "Polytropos — “of many turns” — is Odysseus’s defining epithet, naming both his physical wanderings and his mental versatility. It is the second word of the poem.",
    citation: "Odyssey I.1",
  },
  {
    id: "odyssey-bk1-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each figure mentioned or appearing in Book I to their place.",
    matchingLeft: ["Odysseus", "Aegisthus", "Telemachus", "Phemius"],
    matchingRight: [
      "Detained on Calypso’s island",
      "Slain by Orestes for the murder of Agamemnon",
      "Roused on Ithaca by Athena/Mentes",
      "Bard who sings the Achaeans’ homecoming under duress",
    ],
    correctPairs: {
      Odysseus: "Detained on Calypso’s island",
      Aegisthus: "Slain by Orestes for the murder of Agamemnon",
      Telemachus: "Roused on Ithaca by Athena/Mentes",
      Phemius: "Bard who sings the Achaeans’ homecoming under duress",
    },
    explanation:
      "Book I sketches in miniature the entire tone of the poem: the absent hero, the cautionary parallel from the house of Atreus, the awakening of the heir, and the bard performing his self-conscious work in the great hall.",
    citation: "Odyssey I",
  },
  {
    id: "odyssey-bk1-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The Aegisthus story is invoked at the start of the Odyssey as a positive model that Telemachus should imitate.",
    correctBool: true,
    tfReasons: [
      "It is a doubled exemplum — Aegisthus warned and ignoring the warning is the negative model, Orestes’ vengeance is the positive — and Athena tells Telemachus he must be like Orestes.",
      "It is invoked only as a warning of fate.",
      "It is irrelevant to Telemachus’s situation.",
      "It is invoked as a comic foil to the suitors’ behaviour.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Orestes parallel is structural: the absent father, the suitor-usurper, the heir who must act. Athena explicitly cites Orestes to Telemachus and asks if he means to win like fame in his own hall.",
    citation: "Odyssey I.32–43, I.298–302",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "odyssey-bk1-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What does Telemachus say to his mother when he sends her up from the great hall to her chamber?",
    options: [
      "That tales are the men’s concern, and speech is the business of him as master of the house",
      "That her grief shames him before the suitors",
      "That the bard must be silenced by women, not by him",
      "That she should call her maids to bar the doors",
    ],
    correctIndex: 0,
    explanation:
      "“Speech is for men,” he says — using language pointedly close to what Hector says to Andromache in the Iliad. The line marks Telemachus’s first claim of adult male authority in his father’s house.",
    citation: "Odyssey I.356–359",
  },
  {
    id: "odyssey-bk1-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Athena promises Telemachus, through Mentes, an oracular sign of his father. What does she say?",
    options: [
      "That Odysseus has already been killed",
      "That Odysseus is alive on a sea-girt isle, held by savage men, and will not long be from his home",
      "That Odysseus will return only after Telemachus has slain the suitors",
      "That Odysseus has remarried abroad",
    ],
    correctIndex: 1,
    explanation:
      "She tells him Odysseus is alive on an island where rough men hold him; he will not long be away. The promise is sufficient to launch the Telemachy and to seed what will become the Calypso book.",
    citation: "Odyssey I.196–205",
  },
  {
    id: "odyssey-bk1-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The Odyssey’s second word — chosen as the formal epithet for Odysseus — is ____, “of many turns.”",
    correctText: "polytropon",
    acceptedVariants: ["polytropos", "πολύτροπον"],
    explanation:
      "Polytropon is grammatically accusative because it agrees with andra in line one. The word has been variously translated — Lattimore’s “the man of many ways,” Fagles’s “the man of twists and turns,” Wilson’s “a complicated man.”",
    citation: "Odyssey I.1",
  },
  {
    id: "odyssey-bk1-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "He is named first among the suitors who taunt Telemachus and is most aggressive in pressing the suit.",
    identificationSubject: "character",
    options: ["Eurymachus", "Antinous", "Amphinomus", "Ctesippus"],
    correctIndex: 1,
    explanation:
      "Antinous is the chief of the suitors and their loudest voice. He emerges at once in Book I and II as the figure most responsible for what will happen to them in Book XXII, when Odysseus shoots him first as he raises his cup.",
    citation: "Odyssey I.383–404, II.84–128",
  },
  {
    id: "odyssey-bk1-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The opening assembly on Olympus is a poetic doublet of the assembly Odysseus will later refuse to convene himself.",
    correctBool: false,
    tfReasons: [
      "It is paired structurally with the Ithacan assembly Telemachus convenes in Book II — the divine and human assemblies frame the Telemachy.",
      "It is paired with the catalogue of ships in the Iliad.",
      "It is paired with the meeting in the underworld in Book XI.",
      "It is paired with Odysseus’s recognition by Eurycleia in Book XIX.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Olympian assembly in I and the Ithacan assembly in II are the architectural twin opening of the Telemachy: a council above answered by a council below. Reading them as a pair is one of the oldest commonplaces of the poem’s formal study.",
    citation: "Odyssey I.26–95, II.6–259",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Book II — Telemachus Sets Sail
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_II: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "odyssey-bk2-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What is the first thing Telemachus does in Book II?",
    options: [
      "He sails for Pylos at dawn",
      "He summons an Ithacan assembly — the first held there since Odysseus left",
      "He confronts Penelope in private",
      "He hides his father’s armour from the suitors",
    ],
    correctIndex: 1,
    explanation:
      "Telemachus calls the assembly. The text underscores that no assembly has been held on Ithaca since Odysseus’s departure — a sign of the political vacuum the suitors exploit.",
    citation: "Odyssey II.6–14",
  },
  {
    id: "odyssey-bk2-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What omen flies overhead during the Ithacan assembly?",
    options: [
      "An owl, sent by Athena",
      "Two eagles that battle each other and tear at one another’s necks before flying off to the right",
      "A dove pierced by an arrow",
      "A flock of crows over the harbour",
    ],
    correctIndex: 1,
    explanation:
      "Zeus sends two eagles. The seer Halitherses interprets them as Odysseus near at hand and a great destruction coming on the suitors. The suitor Eurymachus mocks him, but the omen sets the moral plot of revenge.",
    citation: "Odyssey II.146–176",
  },
  {
    id: "odyssey-bk2-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Penelope’s famous trick is the loom: by day she weaves a shroud for ____, by night she unweaves what she wove.",
    correctText: "Laertes",
    explanation:
      "The shroud she promises to finish before choosing a suitor is for Odysseus’s old father Laertes — a piece of household duty that makes the deception unimpeachable.",
    citation: "Odyssey II.93–110",
  },
  {
    id: "odyssey-bk2-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He is the suitors’ harshest leader, who throws the seer’s prophecy back in his face and demands Penelope choose a husband.",
    identificationSubject: "character",
    options: ["Antinous", "Eurymachus", "Amphinomus", "Leiodes"],
    correctIndex: 0,
    explanation:
      "Antinous insists Telemachus send his mother home to her father so that Icarius will give her in marriage. He is the suitors’ public face and Telemachus’s sharpest antagonist throughout the early books.",
    citation: "Odyssey II.84–128",
  },
  {
    id: "odyssey-bk2-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Telemachus secures a ship and sails for Pylos by day, openly, with the suitors’ blessing.",
    correctBool: false,
    tfReasons: [
      "He sails by night, in secret, with Athena disguised as Mentor; the suitors do not yet know he has gone.",
      "He refuses the ship Athena provides and waits for Odysseus.",
      "He sails openly with Antinous as escort.",
      "He goes by foot across the island to a different harbour.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Athena/Mentor borrows a ship and crew, Eurycleia is sworn to silence, and Telemachus departs by night so that the suitors will not block the voyage. Their later plot to ambush him at sea is the consequence.",
    citation: "Odyssey II.382–434",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "odyssey-bk2-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why is the suitors’ behaviour an offence even by Homeric custom?",
    options: [
      "They have not provided their own dowries",
      "They are courting the wife of an absent husband while consuming his estate, instead of bringing gifts to her father’s house",
      "They refuse to share their plunder",
      "They are foreigners",
    ],
    correctIndex: 1,
    explanation:
      "Proper courting in the Homeric world goes to the bride’s father with gifts. The suitors invert this — they live at Odysseus’s expense, eating his herds, and pressure his wife in his own hall.",
    citation: "Odyssey II.49–79, II.115–128",
  },
  {
    id: "odyssey-bk2-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Whom does Athena disguise herself as to recruit the crew for Telemachus?",
    options: [
      "Mentes the Taphian, again",
      "Mentor, an Ithacan elder entrusted by Odysseus with his household",
      "Eurycleia, the old nurse",
      "Phemius, the bard",
    ],
    correctIndex: 1,
    explanation:
      "Mentor was the man Odysseus left in charge of his house when he sailed to Troy. Athena now uses his form, both to assemble a crew and later to walk down to the ship at Telemachus’s side.",
    citation: "Odyssey II.267–280",
  },
  {
    id: "odyssey-bk2-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "When Telemachus departs by night, the old nurse ____ swears not to tell Penelope until twelve days have passed.",
    correctText: "Eurycleia",
    explanation:
      "Eurycleia stocks the ship with wine and barley meal and is sworn to twelve days’ silence. The motif of the nurse’s loyalty pays off later in Book XIX, when she alone recognises Odysseus’s scar.",
    citation: "Odyssey II.345–381",
  },
  {
    id: "odyssey-bk2-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "He reads the omen of two eagles correctly and warns the suitors of doom; the suitor Eurymachus mocks him.",
    identificationSubject: "character",
    options: ["Halitherses", "Mentor", "Mentes", "Aigyptios"],
    correctIndex: 0,
    explanation:
      "Halitherses son of Mastor — the Ithacan seer — interprets the eagles. He had also predicted at Odysseus’s departure that the king would return after twenty years.",
    citation: "Odyssey II.157–176",
  },
  {
    id: "odyssey-bk2-sch-order-1",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order the events of the Ithacan assembly in Book II.",
    options: [
      "Aigyptios opens the assembly, having lost a son to the Cyclops",
      "Telemachus accuses the suitors of devouring his estate",
      "Two eagles fly overhead and Halitherses interprets the sign",
      "Eurymachus dismisses the seer and refuses to leave the palace",
    ],
    correctOrder: [
      "Aigyptios opens the assembly, having lost a son to the Cyclops",
      "Telemachus accuses the suitors of devouring his estate",
      "Two eagles fly overhead and Halitherses interprets the sign",
      "Eurymachus dismisses the seer and refuses to leave the palace",
    ],
    explanation:
      "The Book II assembly opens with Aigyptios — whose mention of his lost son foreshadows the Cyclops episode — and ends in deadlock when the suitors deny the omen. The scene establishes the moral cause of the slaughter to come.",
    citation: "Odyssey II.6–259",
  },
  {
    id: "odyssey-bk2-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Penelope is aware of Telemachus’s departure for Pylos as it happens.",
    correctBool: false,
    tfReasons: [
      "She is kept in the dark; Eurycleia is sworn to silence so that Penelope will not waste her cheek with weeping.",
      "She personally sees him off at the harbour.",
      "Antinous tells her at once, hoping for her gratitude.",
      "She has commanded the journey.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Telemachus tells Eurycleia explicitly to keep the secret so that his mother does not grieve until he is gone. Penelope only learns of the journey later, when the maid Medon tells her.",
    citation: "Odyssey II.373–376, IV.675–697",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "odyssey-bk2-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why is Aigyptios — the first speaker at the Ithacan assembly — a poetically charged choice for Homer?",
    options: [
      "Because he is the eldest, by custom",
      "Because his son Antiphus has been eaten by the Cyclops, foreshadowing the very story Odysseus will tell in Book IX",
      "Because he was the herald who carried the news of Troy’s fall",
      "Because he is the father of one of the suitors",
    ],
    correctIndex: 1,
    explanation:
      "Aigyptios mourns four sons; one is among the suitors, and one — Antiphus — has been eaten by the Cyclops. The detail seeds the later Apologos: the audience hears the shadow of Odysseus’s wanderings inside the assembly that decides his son’s journey.",
    citation: "Odyssey II.15–24",
  },
  {
    id: "odyssey-bk2-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What does the sceptre Telemachus hands back to a herald symbolise in the assembly?",
    options: [
      "His desire to abdicate kingship",
      "The right to speak — passed from man to man so that he who holds it speaks unimpeded",
      "A formal accusation of murder",
      "A summons to the gods",
    ],
    correctIndex: 1,
    explanation:
      "The sceptre in the Homeric assembly — the same object Achilles swears by in Iliad I — confers the right to speak. Telemachus throws it down and weeps; the gesture marks both his rage and the weight of speaking in full assembly for the first time.",
    citation: "Odyssey II.37–81",
  },
  {
    id: "odyssey-bk2-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Athena, in Mentor’s shape, walks beside Telemachus down to the ____, where the crew waits to launch by night.",
    correctText: "ship",
    acceptedVariants: ["black ship"],
    explanation:
      "“Black ship” is the standard Homeric formula. The night-sailing under a goddess in disguise is the formal beginning of the Telemachy proper, the journey that occupies Books III–IV.",
    citation: "Odyssey II.413–434",
  },
  {
    id: "odyssey-bk2-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“Mentor — old friend, may you find a place at the lord’s side, you whom Odysseus charged with all his household.”",
    identificationSubject: "speaker",
    options: ["Telemachus", "Aigyptios", "Halitherses", "Eurycleia"],
    correctIndex: 2,
    explanation:
      "Halitherses defends both Mentor’s authority and Telemachus’s right to act. The line names the trust Odysseus placed in Mentor — and in the figure (Athena) now wearing that name.",
    citation: "Odyssey II.225–241",
  },
  {
    id: "odyssey-bk2-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The Telemachy serves no narrative purpose beyond filling time before Odysseus appears.",
    correctBool: false,
    tfReasons: [
      "It establishes the moral case against the suitors and trains Telemachus through Nestor and Menelaus, so that the slaughter in Book XXII reads as just retribution.",
      "It is filler, with no thematic load.",
      "It exists only to introduce minor characters.",
      "It is a digression by a later interpolator.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Telemachy stages the moral and political case against the suitors before Odysseus comes home. Without it, the killing in XXII would feel like vengeance alone; with it, it reads as the law-restoring close of an argument begun in this book’s assembly.",
    citation: "Odyssey II–IV",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Book III — At Pylos: Nestor’s Sacrifice
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_III: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "odyssey-bk3-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Whose court does Telemachus visit first?",
    options: ["Nestor at Pylos", "Menelaus at Sparta", "Idomeneus at Crete", "Alcinous at Scheria"],
    correctIndex: 0,
    explanation:
      "Pylos first, then Sparta. Telemachus and Athena/Mentor land in Pylos during a great public sacrifice to Poseidon and are welcomed by Nestor and his sons.",
    citation: "Odyssey III.4–67",
  },
  {
    id: "odyssey-bk3-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What ritual is in progress when Telemachus arrives on the beach at Pylos?",
    options: [
      "A festival of Apollo with archery contests",
      "A great sacrifice of black bulls to Poseidon",
      "Funeral games for a Pylian king",
      "A hecatomb to Zeus",
    ],
    correctIndex: 1,
    explanation:
      "Nine companies, each with nine bulls, are sacrificing to Poseidon — the same god whose anger plagues Odysseus, ironising Telemachus’s reception. The detail also lets Athena/Mentor sit down at the feast as guests.",
    citation: "Odyssey III.4–9",
  },
  {
    id: "odyssey-bk3-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Nestor recounts the homeward voyage: the seer ____ alone among the leaders gives prudent advice but is ignored.",
    correctText: "Calchas",
    acceptedVariants: ["Nestor"],
    explanation:
      "Nestor narrates the quarrel between Agamemnon and Menelaus over when to sail; the seer Calchas had urged sacrifices to appease Athena’s anger, but Agamemnon dismissed the counsel. (If you answered “Nestor,” credit also: Nestor casts himself as the wise voice nobody heeded.)",
    citation: "Odyssey III.130–161",
  },
  {
    id: "odyssey-bk3-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "He is repeatedly named “the Gerenian horseman,” famed for his counsel and the long memory of his speeches.",
    identificationSubject: "character",
    options: ["Idomeneus", "Nestor", "Menelaus", "Pisistratus"],
    correctIndex: 1,
    explanation:
      "Nestor’s formula — Gerēnios hippota Nestor — recurs across both Iliad and Odyssey. The Pylos visit lets him do at length what Iliad I and II hinted at: hold the floor with stories of an older world.",
    citation: "Odyssey III.68, III.102",
  },
  {
    id: "odyssey-bk3-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Telemachus stays the night at Pylos rather than sleeping on his ship.",
    correctBool: true,
    tfReasons: [
      "Nestor insists on hosting him; Athena/Mentor returns to the ship, and Telemachus sleeps in a guest bed beside Nestor’s son Pisistratus.",
      "He sleeps on the ship to be ready to sail at first light.",
      "He sleeps on the temple porch as a suppliant.",
      "He returns to Ithaca that same night.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Nestor declares it would be a dishonour to send a guest of his own house back to a hard ship for the night. He sets Telemachus up in the polished portico beside Pisistratus — the friend who will accompany him on to Sparta.",
    citation: "Odyssey III.345–403",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "odyssey-bk3-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What does Nestor say about Aegisthus and Orestes when Telemachus presses for news of his father?",
    options: [
      "That Orestes acted shamefully and should have spared Aegisthus",
      "That Orestes won great glory by killing Aegisthus, and that Telemachus, tall and handsome, should likewise be brave",
      "That Aegisthus deserved to live for his guile",
      "That the case is too painful to discuss",
    ],
    correctIndex: 1,
    explanation:
      "Nestor reuses the Orestes paradigm Athena introduced in Book I: Orestes’ vengeance is held up as the model for Telemachus, here reinforced by the older man’s authority.",
    citation: "Odyssey III.193–200, III.306–316",
  },
  {
    id: "odyssey-bk3-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why does Athena leave Telemachus at the end of Book III rather than continuing as Mentor?",
    options: [
      "She is summoned to Olympus by Zeus",
      "She turns into a sea-eagle in front of the company, revealing her divinity to Nestor’s household",
      "She vanishes silently when no one is watching",
      "She is replaced by Hermes",
    ],
    correctIndex: 1,
    explanation:
      "Her departure as a vulture — phēnē — is a public theophany that astonishes Nestor and confirms Telemachus’s divine backing. Nestor at once promises a heifer with gilded horns to Athena.",
    citation: "Odyssey III.371–384",
  },
  {
    id: "odyssey-bk3-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Nestor sends his son ____ as Telemachus’s companion on the road to Sparta.",
    correctText: "Pisistratus",
    acceptedVariants: ["Peisistratos", "peisistratus"],
    explanation:
      "Pisistratus, Nestor’s youngest son, makes the chariot journey to Menelaus with Telemachus. The friendship is the only true peer-friendship Telemachus forms in the Telemachy.",
    citation: "Odyssey III.482–485",
  },
  {
    id: "odyssey-bk3-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“Whoever calls upon thee with a true heart, the gods give him strength.”",
    identificationSubject: "speaker",
    options: ["Athena (as Mentor)", "Nestor", "Pisistratus", "Telemachus"],
    correctIndex: 0,
    explanation:
      "Athena, still in Mentor’s form, encourages Telemachus before they enter Nestor’s feast: the gods help those who address them sincerely. The line is also the poem’s instruction to its hearers in how to read it.",
    citation: "Odyssey III.43–55",
  },
  {
    id: "odyssey-bk3-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each homecoming Nestor describes to its outcome.",
    matchingLeft: ["Nestor himself", "Menelaus", "Agamemnon", "Odysseus"],
    matchingRight: [
      "Sailed straight home with a fair wind to Pylos",
      "Was driven to Egypt and returned only after long delay",
      "Murdered by Aegisthus on his return",
      "Whereabouts unknown, no news to give",
    ],
    correctPairs: {
      "Nestor himself": "Sailed straight home with a fair wind to Pylos",
      Menelaus: "Was driven to Egypt and returned only after long delay",
      Agamemnon: "Murdered by Aegisthus on his return",
      Odysseus: "Whereabouts unknown, no news to give",
    },
    explanation:
      "Book III lays out the spectrum of nostoi — successful, delayed, catastrophic, suspended — that the Odyssey will play against. Telemachus’s journey is, structurally, an attempt to find Odysseus on this map.",
    citation: "Odyssey III.130–328",
  },
  {
    id: "odyssey-bk3-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Nestor gives Telemachus a definite report of Odysseus’s fate.",
    correctBool: false,
    tfReasons: [
      "He has no news of Odysseus and refers Telemachus on to Menelaus, who has wandered farther.",
      "He confirms Odysseus is dead.",
      "He confirms Odysseus is alive on Calypso’s island.",
      "He claims to have seen Odysseus in Pylos a year before.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The visit produces no answer about Odysseus — only a long meditation on other homecomings. The lack itself sends Telemachus on to Sparta, where Menelaus will eventually report what Proteus told him: Odysseus is alive, held by Calypso.",
    citation: "Odyssey III.184–192, IV.555–560",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "odyssey-bk3-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "How is the Pylos episode used to characterise Telemachus’s growth?",
    options: [
      "Through his refusal to speak to Nestor at all",
      "Through Athena’s prompt — “you will think of words yourself, and a god will put others into your mind” — and Telemachus’s gradual willingness to address kings as a guest and a man",
      "Through his single combat with Pisistratus",
      "Through his refusal of food in Nestor’s hall",
    ],
    correctIndex: 1,
    explanation:
      "Athena’s nudge marks Telemachus’s entry into adult speech. Through Books III and IV he moves from dependency on her cues to addressing Menelaus on his own initiative — the small but decisive interior arc of the Telemachy.",
    citation: "Odyssey III.21–28",
  },
  {
    id: "odyssey-bk3-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Nestor’s narrative form in Book III is best described as which of the following?",
    options: [
      "A single linear account of the Trojan return",
      "A digressive web of homecoming stories framed by the moral that the gods favour the prudent",
      "A sustained allegory",
      "A formal eulogy for Agamemnon",
    ],
    correctIndex: 1,
    explanation:
      "Nestor’s storytelling is digressive by design: stories within stories, all turning on the moral that the imprudent — Agamemnon, Aegisthus — pay for their folly. The form anticipates Odysseus’s own embedded narrative in Books IX–XII.",
    citation: "Odyssey III.130–328",
  },
  {
    id: "odyssey-bk3-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "After the bird-departure of Athena, Nestor at once promises to sacrifice a heifer with horns covered in ____.",
    correctText: "gold",
    explanation:
      "The famous gilded-horns sacrifice, performed at the start of Book III’s closing rite, gives a vivid scene of late-Mycenaean wealth and a ritual response to the goddess’s self-revelation.",
    citation: "Odyssey III.430–438",
  },
  {
    id: "odyssey-bk3-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "He is the Pylian who washes Telemachus and anoints him before the feast — the youngest son of Nestor by the lovely Polycaste.",
    identificationSubject: "character",
    options: ["Pisistratus", "Antilochus", "Thrasymedes", "Telemachus is bathed by Polycaste herself"],
    correctIndex: 3,
    explanation:
      "Polycaste, Nestor’s daughter, bathes Telemachus and anoints him with oil — one of the rare named female figures in the Telemachy and a marker of Pylos’s deliberate gentility.",
    citation: "Odyssey III.464–469",
  },
  {
    id: "odyssey-bk3-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Book III treats Pylian piety as exemplary — Nestor’s court is the morally well-ordered counterpart to Ithaca.",
    correctBool: true,
    tfReasons: [
      "Pylos is the model of right religion and hospitality: a public sacrifice receives the strangers, the household orders its own affairs, and the gods are honoured at every meal — exactly what Ithaca lacks.",
      "Pylos is presented as morally inferior to Ithaca.",
      "Pylos is shown as religiously corrupt and impious.",
      "Pylos is irrelevant to Ithaca’s situation.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The contrast is structural: a kingdom in order, sacrificing properly, opening its hall to a guest, set against the disorder Telemachus has just left behind. The Telemachy teaches by comparison.",
    citation: "Odyssey III",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

export const ODYSSEY_I_III_TRIALS: Record<number, ChapterQuestion[]> = {
  1: BOOK_I,
  2: BOOK_II,
  3: BOOK_III,
}
