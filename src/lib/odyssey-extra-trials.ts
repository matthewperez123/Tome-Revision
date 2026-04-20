/**
 * Additional Odyssey chapter trials — Books V through XXIV (chapterIndex
 * 5..24) plus the "Master Trial" (chapterIndex 25) that awards the
 * Nostos seal. These are merged at lookup time by `getQuestionsForChapter`
 * in chapter-questions.ts to avoid bloating that already-huge file.
 *
 * Schema matches `ChapterQuestion` in chapter-questions.ts.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const ODYSSEY_EXTRA_TRIALS: Record<number, ChapterQuestion[]> = {
  // ── Book V ───────────────────────────────────────────────────────────
  5: [
    {
      id: "odyssey-5-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "How does Odysseus first appear to the reader in Book V?",
      options: [
        "Drinking wine at a feast on Calypso's island",
        "Weeping on the shore, looking out to sea",
        "Fighting a sea monster with his bare hands",
        "Speaking confidently with Hermes about his escape plan",
      ],
      correctIndex: 1,
      explanation:
        "After four books of absence, Odysseus is finally introduced — sitting on the beach, weeping, unable to return home. The paralysis is the Odyssey's foundational image of its hero: the polytropos of Book I, seen first as a man undone by homesickness.",
    },
    {
      id: "odyssey-5-2",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Odysseus's refusal of Calypso's offer of immortality is the Odyssey's deepest ethical choice — he chooses mortality, an aging wife, and Ithaca over eternal life.",
      correctBool: true,
      explanation:
        "Calypso offers to make Odysseus exempt from age and death; he refuses, preferring a mortal return to Penelope. The choice reshapes the Iliadic code (which exalted glory over long life) into something humbler and deeper — the good life is the lived life, ended in one's own house.",
    },
    {
      id: "odyssey-5-3",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "What image does Homer use to compare Odysseus's hands being torn from the rocks by a receding wave?",
      options: [
        "A lion wounded by a spear",
        "An octopus pulled from its hole with pebbles clinging to its suckers",
        "A ship split by lightning",
        "A fallen warrior stripped of armor",
      ],
      correctIndex: 1,
      explanation:
        "The octopus simile in Book V is one of the most startlingly physical images in ancient literature. Homer has clearly looked at octopuses. The reader feels the hero's injury through the small marine creature's — the Odyssey's similes observe rather than idealize.",
    },
  ],

  // ── Book VI ──────────────────────────────────────────────────────────
  6: [
    {
      id: "odyssey-6-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Who finds the naked, shipwrecked Odysseus at the river mouth?",
      options: [
        "The Phaeacian king Alcinoüs, hunting in the hills",
        "A chorus of sea-nymphs who bring him ashore",
        "Nausicaä, the Phaeacian princess, playing ball with her maids",
        "Demodocus, the blind bard, drawn by divine prompting",
      ],
      correctIndex: 2,
      explanation:
        "Athena sends Nausicaä to the river to wash clothes in preparation for her wedding. When a stray ball wakes Odysseus from his thicket, the meeting is set. Nausicaä's poise — she alone of her maids does not flee the naked stranger — is one of Homer's finest character-portraits.",
    },
    {
      id: "odyssey-6-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "When Odysseus emerges from the thicket, Homer compares him to a hungry mountain lion. What is distinctive about this simile compared to its Iliad counterparts?",
      options: [
        "It is longer and more detailed than any Iliadic lion-simile",
        "The lion is set up for violence but the hero turns to diplomacy instead",
        "It is the first Homeric simile to feature a female lion",
        "The lion fails and runs away, unlike Iliadic lions",
      ],
      correctIndex: 1,
      explanation:
        "The Iliad's lion-similes introduce a kill. The Odyssey's Book VI simile sets up combat and pivots to speech: Odysseus does NOT attack Nausicaä's maids. He has the lion's hunger but speaks. The difference is the Odyssey's new ethic in miniature.",
    },
    {
      id: "odyssey-6-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Nausicaä ultimately marries Odysseus, and the two sail back to Ithaca together.",
      correctBool: false,
      explanation:
        "Nausicaä clearly hopes for the match, and her father Alcinoüs will even offer it. Odysseus graciously deflects throughout. The poem stages a temptation — the small Nausicaä-love set beside the vast Calypso-immortality — and lets the hero decline both for Penelope.",
    },
  ],

  // ── Book VII ─────────────────────────────────────────────────────────
  7: [
    {
      id: "odyssey-7-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Following Nausicaä's instruction, whom does Odysseus supplicate first upon entering the palace of the Phaeacians?",
      options: [
        "King Alcinoüs, grasping his knees at the threshold",
        "Queen Arete, clasping her knees at the hearth",
        "The blind bard Demodocus, asking for a song",
        "The household gods at the altar of Zeus Xenios",
      ],
      correctIndex: 1,
      explanation:
        "The social oddity of the Phaeacian court is that Queen Arete is addressed before her husband the king. Nausicaä specifically instructs Odysseus to clasp the queen's knees. The moment is Homer's one explicit matriarchal detail.",
    },
    {
      id: "odyssey-7-2",
      type: "passage_id",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Alcinoüs's palace features golden dogs forged by a god standing guard at the door. Which god is the artificer?",
      options: ["Apollo", "Hermes", "Hephaestus", "Poseidon"],
      correctIndex: 2,
      explanation:
        "Hephaestus (Bryant: Vulcan) — the smith-god — forged the gold and silver dogs. The Odyssey's Phaeacian court is Homer's imaginative limit of material magnificence and the headwaters of every Western paradise-description from Virgil's Elysium to Dante's Earthly Paradise.",
    },
    {
      id: "odyssey-7-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Alcinoüs demands Odysseus reveal his name as soon as he arrives at the palace.",
      correctBool: false,
      explanation:
        "Alcinoüs asks NO questions about identity until Odysseus has been fed, clothed, and seated. Proper xenia waits. This is the deliberate contrast with Polyphemus (Book IX), who asks the name before offering food. The Odyssey keeps a careful ledger of who waits and who doesn't.",
    },
  ],

  // ── Book VIII ────────────────────────────────────────────────────────
  8: [
    {
      id: "odyssey-8-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Demodocus, the Phaeacian bard, sings three songs in Book VIII. What does the first song recount?",
      options: [
        "The abduction of Helen and the first muster of Greek ships",
        "A quarrel between Odysseus and Achilles at a Trojan feast",
        "The adultery of Ares and Aphrodite caught in Hephaestus's net",
        "The fall of Troy through the trick of the wooden horse",
      ],
      correctIndex: 1,
      explanation:
        "Demodocus's first song tells of a quarrel between Odysseus and Achilles — an episode we know from no other source. Homer tells us in passing that the Trojan cycle was larger than the two poems that survive. Odysseus weeps at the song.",
    },
    {
      id: "odyssey-8-2",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 25,
      text: "Homer compares Odysseus weeping at Demodocus's song to a woman weeping over her husband killed before a besieged city. Why is this simile ethically extraordinary?",
      options: [
        "It is the only feminine simile in either Homeric poem",
        "Odysseus — the sacker of cities — is compared to the wife of his own victims",
        "It appears out of metrical sequence in the Greek text",
        "It is later censored from many Byzantine manuscripts",
      ],
      correctIndex: 1,
      explanation:
        "The comparison inverts tenor and vehicle morally. The hero who has sacked cities is likened to the women whose husbands he helped kill. Homer is saying that conquest and bereavement feel the same at the end. Simone Weil's essay 'The Iliad, or the Poem of Force' hinges on moments like this.",
    },
    {
      id: "odyssey-8-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Odysseus names himself to the Phaeacian court at the start of Book VIII.",
      correctBool: false,
      explanation:
        "Odysseus does not name himself until Book IX, after Demodocus's three songs have repeatedly made him weep. The eight-book delay of the self-naming is the Odyssey's deepest piece of narrative patience.",
    },
  ],

  // ── Book IX ──────────────────────────────────────────────────────────
  9: [
    {
      id: "odyssey-9-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "When Odysseus first enters the Cyclops's cave with twelve crewmen, what do they ask him to do?",
      options: [
        "Kill the Cyclops immediately while he is out with his sheep",
        "Take some cheeses and drive off the lambs and kids before the Cyclops returns",
        "Hide in the back of the cave and wait until dark",
        "Pray to Zeus for protection before exploring further",
      ],
      correctIndex: 1,
      explanation:
        "The men urge Odysseus to loot the cheeses, take the lambs and kids, and return to the ships. Odysseus refuses — he wants to meet the owner of the cave. The refusal costs six crewmen their lives. Homer is unsparing about his hero's curiosity as a flaw as well as a virtue.",
    },
    {
      id: "odyssey-9-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "What name does Odysseus give the Cyclops when asked?",
      options: ["Ulysses of Ithaca", "The sacker of cities", "Noman (Outis)", "Son of Laertes"],
      correctIndex: 2,
      explanation:
        "Odysseus names himself *Outis* — 'Noman.' The pun plays on Greek *mētis* (cunning, Odysseus's defining virtue). When the blinded Cyclops cries out to his neighbors that 'Noman has attacked me!' they mishear and leave him alone. The wordplay saves the expedition.",
    },
    {
      id: "odyssey-9-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "After escaping under the rams, Odysseus shouts his real name back at the blinded Cyclops from the ship.",
      correctBool: true,
      explanation:
        "Odysseus cannot help himself — he shouts his name, his father's name, and his homeland back at Polyphemus from the departing ship. Polyphemus prays to Poseidon for vengeance. This single act of pride extends Odysseus's homecoming by ten years.",
    },
  ],

  // ── Book X ───────────────────────────────────────────────────────────
  10: [
    {
      id: "odyssey-10-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "What does Aeolus, keeper of the winds, give Odysseus?",
      options: [
        "A magic cloak that makes its wearer invisible",
        "A leather bag containing all the winds except the west wind",
        "A bronze sword forged by Hephaestus",
        "A golden compass pointing always toward Ithaca",
      ],
      correctIndex: 1,
      explanation:
        "Aeolus packs all the adverse winds in an ox-hide bag, releasing only the west wind to blow Odysseus home. After ten days of smooth sailing the crew — suspecting gold — open the bag and release the storm-winds, blowing them back across the Mediterranean.",
    },
    {
      id: "odyssey-10-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "What magical plant does Hermes give Odysseus as protection against Circe's drugs?",
      options: ["Lotus", "Asphodel", "Moly", "Nepenthe"],
      correctIndex: 2,
      explanation:
        "Moly — black root, milky flower, 'hard for mortals to pull up but the gods can do all things.' It neutralizes Circe's potion. Milton would later allegorize moly as chastity itself in 'Comus' (1634).",
    },
    {
      id: "odyssey-10-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Circe tells Odysseus he must first travel to the land of the dead and consult the shade of Tiresias before he can return home.",
      correctBool: true,
      explanation:
        "Circe's instructions require a Nekyia (descent to Hades) before any return. The requirement is narratively unmotivated but structurally essential — every long poem about a hero's return features a katabasis before it's done (Aeneid VI, Inferno, Paradise Lost).",
    },
  ],

  // ── Book XI ──────────────────────────────────────────────────────────
  11: [
    {
      id: "odyssey-11-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Who is the first shade to speak with Odysseus in the Nekyia?",
      options: [
        "Tiresias, the blind Theban seer",
        "Anticlea, Odysseus's mother",
        "Elpenor, the drunken crewman left unburied on Circe's roof",
        "Agamemnon, recently murdered by his wife",
      ],
      correctIndex: 2,
      explanation:
        "Elpenor approaches first — unburied after his fall from Circe's roof (Book X). He pleads with Odysseus to return and bury him properly with his oar planted as a grave-marker. Odysseus keeps the promise in Book XII.",
    },
    {
      id: "odyssey-11-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Achilles, in his famous Book XI reversal, tells Odysseus that he would prefer WHICH mortal life to his glorious death?",
      options: [
        "King of a small peaceful island with his son beside him",
        "A hired farmhand working for a landless man",
        "A wealthy merchant sailing the safe coastlines",
        "A temple priest of Apollo at Delphi",
      ],
      correctIndex: 1,
      explanation:
        "Achilles's reversal in the Nekyia overturns the Iliad's heroic code. He would rather be alive as a penniless hired hand than king of all the dead. Homer uses the Iliad's own greatest hero to revise the Iliad's implicit ethics — glory is not worth death.",
    },
    {
      id: "odyssey-11-3",
      type: "passage_id",
      difficulty: "Sage",
      xpReward: 25,
      text: "Odysseus tries three times to embrace the shade of his mother Anticlea. What happens?",
      options: [
        "She embraces him and tells him of Penelope's fidelity",
        "Three times she slips through his arms like a shadow or dream",
        "She pushes him away, angered by his long absence",
        "She turns into a white bird and flies back into Hades",
      ],
      correctIndex: 1,
      explanation:
        "Three grasps, three empty embraces. The triple-failed-embrace is the Odyssey's most widely-imitated gesture — Virgil reproduces it exactly for Aeneas and Anchises in Aeneid VI, and Dante stages it again in Purgatorio II. Homer's three makes the grief real.",
    },
  ],

  // ── Book XII ─────────────────────────────────────────────────────────
  12: [
    {
      id: "odyssey-12-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "How does Odysseus protect himself and his crew from the Sirens?",
      options: [
        "By sailing a wide circle around their island",
        "By plugging all crewmen's ears with wax; he alone hears, bound to the mast",
        "By offering a sacrifice of a goat to appease them",
        "By racing past with oars — the Sirens cannot sing at speeds above a certain wind",
      ],
      correctIndex: 1,
      explanation:
        "Wax in the crew's ears; Odysseus bound to the mast so he alone can hear the song without leaping into the sea. The scene is the Odyssey's self-conscious image of surviving temptation — specifically, the temptation of kleos (the Sirens sing specifically about Troy).",
    },
    {
      id: "odyssey-12-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "What does Circe tell Odysseus to do when he must pass between Scylla and Charybdis?",
      options: [
        "Stop the ship and wait for Athena's sign",
        "Sail closer to Scylla — better to lose six men than the whole ship",
        "Sacrifice a ram at Charybdis's edge before crossing",
        "Tie all crewmen to the oar-benches and sleep through the passage",
      ],
      correctIndex: 1,
      explanation:
        "Circe counsels the lesser evil — Scylla will eat six men; Charybdis would drown everyone. Odysseus steers near Scylla and does NOT warn his crew about her six heads; Homer uses the angler-simile to register the brutality of the captain's silence.",
    },
    {
      id: "odyssey-12-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Odysseus is the only member of his original crew who survives the wanderings.",
      correctBool: true,
      explanation:
        "Twelve ships left Troy; one survives the Lestrigonians. That last ship is destroyed by Zeus's thunderbolt after the crew slaughters Helios's cattle in Book XII. Only Odysseus, who had refused to eat the cattle, survives — clinging to a plank for nine days until he washes up on Calypso's island.",
    },
  ],

  // ── Book XIII ────────────────────────────────────────────────────────
  13: [
    {
      id: "odyssey-13-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "How does Odysseus arrive back on Ithaca?",
      options: [
        "He swims the final stretch after his raft breaks up",
        "A Phaeacian ship carries him home while he sleeps",
        "He disguises himself and hires passage on a merchant ship",
        "Hermes transports him in an instant",
      ],
      correctIndex: 1,
      explanation:
        "The Phaeacian magical ships deliver the sleeping Odysseus to Ithaca, leaving him on the beach with his gifts. Poseidon then punishes the Phaeacians by turning their ship to stone on its return — their generosity is too much for the jealous sea-god.",
    },
    {
      id: "odyssey-13-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "When Athena (disguised as a shepherd) meets Odysseus on the Ithacan shore and asks who he is, what does Odysseus do?",
      options: [
        "Immediately reveals his true identity",
        "Tells an elaborate Cretan lie — a whole invented autobiography",
        "Refuses to answer and draws his sword",
        "Claims to be a Phaeacian merchant in transit",
      ],
      correctIndex: 1,
      explanation:
        "Odysseus launches into the first of his famous Cretan lies. Athena laughs at it and drops her disguise: 'Cunning would he be that could out-scheme you — even a god.' The shared affection for well-made fiction is their welcome home to each other.",
    },
    {
      id: "odyssey-13-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Athena disguises Odysseus as an aged beggar before he approaches his own palace.",
      correctBool: true,
      explanation:
        "Wrinkled skin, bald head, bleary eyes, filthy rags. The disguise is physical — Odysseus inhabits this body for nine books. Only Eurycleia's hand on the scar and Penelope's bed-test pierce it.",
    },
  ],

  // ── Book XIV ─────────────────────────────────────────────────────────
  14: [
    {
      id: "odyssey-14-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Who welcomes the disguised Odysseus with perfect xenia when he first arrives on Ithaca?",
      options: [
        "Telemachus, who recognizes him at once",
        "Laertes, working alone in the fields",
        "Eumaeus, the swineherd, in his hut",
        "Mentes, the Taphian king who had visited Telemachus",
      ],
      correctIndex: 2,
      explanation:
        "Eumaeus — a slave, the household's lowest-ranking loyal retainer — gives the disguised Odysseus a bed of skins and the best piglet. His xenia is the Odyssey's positive benchmark against which the suitors' contempt will be measured.",
    },
    {
      id: "odyssey-14-2",
      type: "true_false",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Homer breaks his narrative grammar to address Eumaeus directly in the second person, a gesture he extends to almost no other character in either epic.",
      correctBool: true,
      explanation:
        "Homer says, 'And you, Eumaeus, answered him...' The second-person apostrophe is a mark of the poet's personal favor — reserved for Patroclus in the Iliad and Eumaeus in the Odyssey. Commentators have debated the reason for centuries.",
    },
    {
      id: "odyssey-14-3",
      type: "passage_id",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Eumaeus refuses to believe the disguised Odysseus's hints that Odysseus is near. Why?",
      options: [
        "Because he has heard too many false stories from beggars trying to earn meals",
        "Because he secretly supports the suitors",
        "Because an oracle told him Odysseus would never return",
        "Because he is testing the stranger's insistence",
      ],
      correctIndex: 0,
      explanation:
        "Eumaeus's exhaustion with hopeful lies is one of the Odyssey's most devastating character-details. The faithful servant has stopped expecting his master's return — he serves out of loyalty, not hope. The later revelation (Book XVI) will be the more moving for it.",
    },
  ],

  // ── Book XV ──────────────────────────────────────────────────────────
  15: [
    {
      id: "odyssey-15-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Athena appears to Telemachus at Sparta with what urgent message?",
      options: [
        "To return home immediately, avoiding the suitors' ambush",
        "To sail first to Troy to find his father's bones",
        "To seek shelter with Nestor and wait for news",
        "To marry Hermione and stay at Sparta",
      ],
      correctIndex: 0,
      explanation:
        "Athena warns Telemachus that the suitors have laid an ambush at Asteris, an island in the straits, to kill him on his return. She gives him a specific route for evasion. The double-plot of Odyssey is converging: father and son will meet in Book XVI.",
    },
    {
      id: "odyssey-15-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Telemachus receives the fugitive seer Theoclymenus aboard his ship at Pylos. Why is Theoclymenus fleeing?",
      options: [
        "He has predicted the suitors' deaths and fears their wrath",
        "He has killed a kinsman in Argos and is seeking refuge",
        "He has been exiled for preaching against the Olympian gods",
        "He has stolen a sacred tripod from Delphi",
      ],
      correctIndex: 1,
      explanation:
        "Theoclymenus has killed a kinsman and is fleeing. The Odyssey's xenia-code is absolute: Telemachus grants him passage and hospitality despite the crime. The sanctity of the supplicant does not depend on the supplicant's innocence. Theoclymenus later prophesies the suitors' doom in Book XX.",
    },
    {
      id: "odyssey-15-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Eumaeus was born a prince on the island of Syrie and stolen by Phoenician slavers as a child.",
      correctBool: true,
      explanation:
        "Eumaeus tells his own story in Book XV — kidnapped from his royal father by a treacherous Phoenician slave-woman working with sailors. The backstory is one of Homer's most remarkable: the Odyssey notices that loyal slaves were once someone, and holds the fact up to the reader.",
    },
  ],

  // ── Book XVI ─────────────────────────────────────────────────────────
  16: [
    {
      id: "odyssey-16-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Where does the reunion of Odysseus and Telemachus take place?",
      options: [
        "In the throne room of the palace",
        "In Eumaeus's hut on the upland farm",
        "On the beach where Telemachus lands",
        "At Laertes's country estate",
      ],
      correctIndex: 1,
      explanation:
        "Athena draws Eumaeus out of the hut on an errand; she restores Odysseus to his true form; father and son weep like eagles whose young have been stolen. The quiet, domestic setting — the swineherd's hut — underscores the Odyssey's preference for household over hall.",
    },
    {
      id: "odyssey-16-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Telemachus asks no proof of identity from the stranger claiming to be his father. Why is this remarkable?",
      options: [
        "Because he has never seen his father in adulthood",
        "Because every subsequent recognition in the poem requires a token (scar, bed, trees) and his alone does not",
        "Both of the above",
        "Because he has been told by Mentor that his father is dead",
      ],
      correctIndex: 2,
      explanation:
        "Telemachus accepts the declaration on faith. Homer gives the first recognition the simplest form — son's trust. All later recognitions (Eurycleia/scar, Penelope/bed, Laertes/trees) require proof. The sequence's pattern is deliberate.",
    },
    {
      id: "odyssey-16-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Odysseus instructs Telemachus to tell Penelope of his return immediately upon returning to the palace.",
      correctBool: false,
      explanation:
        "Odysseus commands secrecy — even from Penelope. She cannot conceal what she doesn't know; the disguise holds only while the household believes it. The command will last for seven more books, until the bed-test in XXIII.",
    },
  ],

  // ── Book XVII ────────────────────────────────────────────────────────
  17: [
    {
      id: "odyssey-17-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Which animal recognizes the disguised Odysseus when he finally approaches his own palace?",
      options: [
        "Argos, his old hunting dog, now dying on a dung heap",
        "A stray kitten from the kitchen",
        "A caged hawk in the courtyard",
        "The ox that pulls the plow outside",
      ],
      correctIndex: 0,
      explanation:
        "Argos — raised by young Odysseus as a puppy twenty years ago — recognizes his master through the disguise. He wags his tail, drops his ears, and dies. The three-line passage is one of the most widely-translated moments in Western literature.",
    },
    {
      id: "odyssey-17-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "How does Odysseus respond when Antinoüs hurls a stool at him in the hall?",
      options: [
        "He draws his sword and attacks Antinoüs",
        "He stands still like a rock, taking the blow without retaliation",
        "He prays aloud to Zeus for immediate vengeance",
        "He reveals himself to the suitors on the spot",
      ],
      correctIndex: 1,
      explanation:
        "Odysseus absorbs the blow without moving. The restraint is volcanic — the patience the hero is cultivating for Book XXII. Homer notes that the other suitors murmur in disapproval — 'a stranger might be a god' — but none intervene.",
    },
    {
      id: "odyssey-17-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Penelope asks Eumaeus to bring the mysterious beggar to her so she can question him about Odysseus.",
      correctBool: true,
      explanation:
        "By the book's end, Penelope has learned of the beggar's claims and asks for a private audience. The meeting (Book XIX) will be the longest private dialogue in the poem.",
    },
  ],

  // ── Book XVIII ───────────────────────────────────────────────────────
  18: [
    {
      id: "odyssey-18-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Who challenges the disguised Odysseus to a fistfight in the palace hall?",
      options: ["The suitor Antinoüs", "The beggar Irus", "The goatherd Melanthius", "A Phoenician merchant"],
      correctIndex: 1,
      explanation:
        "Irus — the palace's regular panhandler — challenges the new beggar. The suitors arrange the fight for their amusement. Odysseus lands one controlled blow, breaking Irus's jaw, deliberately NOT killing him (that would show his hand).",
    },
    {
      id: "odyssey-18-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Odysseus delivers a philosophical warning-speech to Amphinomus, one of the gentler suitors. What is the speech's core claim?",
      options: [
        "That the gods have promised Odysseus's return by oracle",
        "That no creature on earth is feebler than man, and the wise leave when they are warned",
        "That Penelope will kill herself rather than remarry",
        "That the suitors' fathers will rise against them",
      ],
      correctIndex: 1,
      explanation:
        "The speech anticipates Solon's warning to Croesus ('call no man happy before his death') and Stoic ethics by centuries. Amphinomus is troubled but does not leave; he will die in Book XXII. Homer marks the moment of moral warning so the later death can register as earned.",
    },
    {
      id: "odyssey-18-3",
      type: "true_false",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Penelope appears in the hall and extracts valuable gifts from each suitor, stripping their wealth before the slaughter.",
      correctBool: true,
      explanation:
        "Athena inspires Penelope to descend to the hall. The suitors compete to give her robes, jewels, golden brooches — a king's ransom in gifts for the delay. Odysseus smiles, watching: his wife is stripping the enemy's treasury before the battle.",
    },
  ],

  // ── Book XIX ─────────────────────────────────────────────────────────
  19: [
    {
      id: "odyssey-19-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "What physical token does Eurycleia find that confirms the beggar's identity as Odysseus?",
      options: [
        "A tattoo of a dolphin on his shoulder",
        "A distinctive scar on his thigh from a boyhood boar-hunt",
        "A ring bearing the family crest on his finger",
        "The mark of Athena's blessing behind his ear",
      ],
      correctIndex: 1,
      explanation:
        "The scar — acquired on a boar-hunt at Mount Parnassus as a teenager — is the recognition-token. Erich Auerbach opens *Mimesis* (1946) with the scar-discovery scene as his founding example of Homeric narrative style: all foreground, no shadow, the scar-flashback interrupting the urgent moment.",
    },
    {
      id: "odyssey-19-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Penelope tells the beggar her dream of an eagle killing twenty geese. What does she claim about dreams in general?",
      options: [
        "All dreams are sent by Zeus and must be heeded",
        "Dreams come through two gates — horn for true visions, ivory for deceptive ones",
        "Only dreams of a deceased parent can be trusted",
        "Dreams are useless and should be ignored",
      ],
      correctIndex: 1,
      explanation:
        "The gates of horn and ivory are Homer's (and Western literature's) oldest distinction between true and false dreams. Virgil cites it in Aeneid VI; Penelope uses it to hold her hope in check. Her intellectual self-skepticism is one of Homer's most remarkable portraits.",
    },
    {
      id: "odyssey-19-3",
      type: "true_false",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Odysseus threatens to kill Eurycleia if she reveals his identity to Penelope.",
      correctBool: true,
      explanation:
        "At the moment of recognition, Odysseus seizes the nurse's throat and threatens her. The coldness of the gesture marks the stakes of the disguise — any leak means the death of everyone loyal in the house. Homer refuses to sentimentalize.",
    },
  ],

  // ── Book XX ──────────────────────────────────────────────────────────
  20: [
    {
      id: "odyssey-20-1",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Unable to sleep the night before the slaughter, Odysseus addresses his own heart. What does he tell it?",
      options: [
        "'Strike now — the gods are with you!'",
        "'Endure, my heart. You endured worse in the Cyclops's cave.'",
        "'Rest — there is nothing more you can do.'",
        "'Call upon Athena; she will speak the word.'",
      ],
      correctIndex: 1,
      explanation:
        "Plato cites this exact line (Republic IV.441b) as evidence that the soul has distinct rational and spirited parts. Odysseus commanding himself to endure is Western philosophy's founding example of self-reflective moral psychology.",
    },
    {
      id: "odyssey-20-2",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 25,
      text: "The seer Theoclymenus suddenly sees the suitors as they will look in hours. What is the vision?",
      options: [
        "They are drinking wine that tastes of blood",
        "Their faces are stained with tears; walls drip blood; darkness shrouds their knees",
        "Eagles circle above the hall, watching for the kill",
        "Their bodies appear as shades already in Hades",
      ],
      correctIndex: 1,
      explanation:
        "Theoclymenus's hallucinatory vision is one of the most harrowing prophetic passages in ancient literature. The suitors laugh at him; he walks out. The trope of bloody-walls prophecy descends through Aeschylus's Cassandra to Shakespeare's Lady Macbeth.",
    },
    {
      id: "odyssey-20-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "The suitors end Book XX with uncontrolled, god-sent laughter — meat in their mouths dripping blood, tears in their eyes.",
      correctBool: true,
      explanation:
        "Athena sends hysterical, uncontrollable laughter through the hall. The possession is Homer's last signal that the suitors are already broken before the slaughter begins — divine madness has taken them by the time Book XXII opens.",
    },
  ],

  // ── Book XXI ─────────────────────────────────────────────────────────
  21: [
    {
      id: "odyssey-21-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "What is the contest Penelope sets for her suitors?",
      options: [
        "Wrestle Odysseus's champion warrior to a draw",
        "String Odysseus's great bow and shoot an arrow through twelve axe-heads",
        "Compose a song worthy of the bard Demodocus",
        "Win a horse-race around the island of Ithaca",
      ],
      correctIndex: 1,
      explanation:
        "Penelope announces the contest at the end of Book XIX. Whoever can string Odysseus's old bow and shoot an arrow through the socket-rings of twelve axe-heads will marry her. No suitor has ever strung the bow. Only Odysseus could — and will.",
    },
    {
      id: "odyssey-21-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "When Odysseus strings the bow, Homer compares him to what?",
      options: [
        "A warrior pulling a spear from the earth",
        "A bard effortlessly stringing a lyre",
        "A blacksmith hammering bronze at the forge",
        "A farmer bending the yoke of his plow",
      ],
      correctIndex: 1,
      explanation:
        "The bard simile at the climax of Book XXI identifies the returning king with the performing poet. Jorge Luis Borges called it 'perhaps the most perfect simile in literature' — fusing violence and craft, bow and lyre, slaughter and song.",
    },
    {
      id: "odyssey-21-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Before the contest, Odysseus reveals his true identity to the swineherd Eumaeus and the cowherd Philoetius.",
      correctBool: true,
      explanation:
        "Mid-contest, Odysseus slips outside with the two loyal herdsmen and shows them his scar. Their recognition is the fastest in the poem — no formal token exchange, just his face. Homer gives the quickest reunion to the servants, the slowest to the wife.",
    },
  ],

  // ── Book XXII ────────────────────────────────────────────────────────
  22: [
    {
      id: "odyssey-22-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Who is the first suitor Odysseus kills?",
      options: ["Eurymachus", "Antinoüs", "Amphinomus", "Ctesippus"],
      correctIndex: 1,
      explanation:
        "Antinoüs — the loudest and most aggressive of the suitors — takes the first arrow, through the throat, as he lifts his wine-cup. Homer's moral rule: 'loudest goes first.'",
    },
    {
      id: "odyssey-22-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Eurymachus offers Odysseus restitution — twenty oxen from each remaining suitor — to spare their lives. What is Odysseus's response?",
      options: [
        "He accepts and requires each suitor to swear an oath",
        "He refuses: 'not for all your wealth would I stay my hand'",
        "He defers to Telemachus for the decision",
        "He demands Eurymachus be killed first as restitution",
      ],
      correctIndex: 1,
      explanation:
        "Odysseus refuses the negotiation. Compare Achilles accepting Priam's ransom in Iliad XXIV. Homer stages both scenes — and has his Odyssey-hero refuse where his Iliad-hero accepted. The difference defines the two poems' moral worlds.",
    },
    {
      id: "odyssey-22-3",
      type: "true_false",
      difficulty: "Scholar",
      xpReward: 15,
      text: "After the slaughter, Eurycleia cries out in triumph. Odysseus rebukes her, saying 'rejoice not over men slain.'",
      correctBool: true,
      explanation:
        "Odysseus shushes the nurse's triumphant cry. It is one of the Odyssey's most remarkable ethical beats — the victor restraining the faithful observer. Compare Achilles dragging Hector's corpse: the opposite temperament.",
    },
  ],

  // ── Book XXIII ───────────────────────────────────────────────────────
  23: [
    {
      id: "odyssey-23-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "How does Penelope test the stranger claiming to be her husband?",
      options: [
        "Asking him to repeat the names of their children",
        "Ordering Eurycleia to move their bed out of the chamber",
        "Showing him a tapestry only Odysseus would recognize",
        "Asking him to describe the courtyard's olive tree",
      ],
      correctIndex: 1,
      explanation:
        "She orders the bed to be moved. Odysseus — the only person who knows the bed was built around a living olive tree still rooted in the ground, impossible to move — erupts in protest. The recognition is through his outrage at the impossible request.",
    },
    {
      id: "odyssey-23-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "What is Penelope's criterion for recognizing her husband?",
      options: [
        "His face, unchanged by twenty years",
        "The testimony of Eurycleia",
        "'Signs known only to the two of us'",
        "His ability to string the bow",
      ],
      correctIndex: 2,
      explanation:
        "Penelope tells Telemachus: if this is truly Odysseus, we have signs between us known only to ourselves. Her criterion is shared private knowledge — not appearance, not testimony, not any public proof. Identity, for Penelope, is intimacy.",
    },
    {
      id: "odyssey-23-3",
      type: "true_false",
      difficulty: "Foundational",
      xpReward: 5,
      text: "Athena prolongs the night at Odysseus's request so that the reunited husband and wife can have a full night together.",
      correctBool: true,
      explanation:
        "Athena holds Dawn back in her Ocean-chambers so the reunion can be complete. Homer's divine machinery bends time for the one night of the poem that most needs it.",
    },
  ],

  // ── Book XXIV ────────────────────────────────────────────────────────
  24: [
    {
      id: "odyssey-24-1",
      type: "multiple_choice",
      difficulty: "Foundational",
      xpReward: 5,
      text: "How does Odysseus prove his identity to his father Laertes in the orchard?",
      options: [
        "By naming his boyhood tutor",
        "By listing the fruit trees Laertes gave him as a boy — thirteen pears, ten apples, forty figs",
        "By showing the scar on his thigh again",
        "By reciting his entire genealogy from Autolycus",
      ],
      correctIndex: 1,
      explanation:
        "The final recognition-token in the poem is a catalog of fruit trees. Homer ends the four-scene recognition sequence (faith, scar, bed, trees) with the most rural and domestic proof. Inheritance is not abstract kingdom but specific orchard.",
    },
    {
      id: "odyssey-24-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 15,
      text: "How does the Odyssey end?",
      options: [
        "With a funeral pyre for the slain suitors",
        "With Odysseus and Penelope embracing in the bed",
        "With an Athena-mediated covenant between Odysseus and the suitors' kin, preventing civil war",
        "With Odysseus leaving Ithaca again for Tiresias's prophesied inland voyage",
      ],
      correctIndex: 2,
      explanation:
        "The vendetta cycle is stopped by Athena, who throws a terror-spear at Eupeithes and mediates an oath of reconciliation. The Odyssey's civic conclusion — law replacing blood-feud — prefigures the Oresteia's court-of-the-Eumenides ending three centuries later.",
    },
    {
      id: "odyssey-24-3",
      type: "true_false",
      difficulty: "Scholar",
      xpReward: 15,
      text: "Ancient Alexandrian scholars argued that the 'real' Odyssey ended at Book XXIII, with the reunion in bed, and that Book XXIV is a later addition.",
      correctBool: true,
      explanation:
        "Aristarchus of Samothrace (2nd century BCE) cut Book XXIV from his edition. Modern editors keep it. The double ending — private reunion (XXIII) + civic reconciliation (XXIV) — has always felt textually strange, but is probably Homer's own twofold closure.",
    },
  ],

  // ── Master Trial (chapterIndex 25) — awards the Nostos seal ──────────
  25: [
    {
      id: "odyssey-master-1",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The Odyssey opens with Zeus addressing the gods about Aegisthus, who killed Agamemnon and was killed in turn by Orestes. What is the thematic purpose of this opening?",
      options: [
        "To establish Agamemnon as the poem's moral villain",
        "To frame the whole poem as a meditation on mortals who bring suffering on themselves by ignoring divine warnings",
        "To justify Odysseus's prolonged absence from Ithaca",
        "To explain why Orestes is absent from the wanderings",
      ],
      correctIndex: 1,
      explanation:
        "Zeus's Book I parable is the poem's ethical frame. It will be structurally realized across all twenty-four books — the crew opening Aeolus's bag, the crew eating Helios's cattle, Polyphemus cursing, the suitors dismissing omens. Every disaster is a warning ignored.",
    },
    {
      id: "odyssey-master-2",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "What are the four formal recognition scenes of the Odyssey, in order?",
      options: [
        "Athena, Nausicaä, Penelope, Laertes",
        "Telemachus, Eurycleia, Penelope, Laertes",
        "Eumaeus, Eurycleia, Philoetius, Penelope",
        "Argos, Eumaeus, Penelope, Laertes",
      ],
      correctIndex: 1,
      explanation:
        "Telemachus in XVI (by declaration), Eurycleia in XIX (by scar), Penelope in XXIII (by bed), Laertes in XXIV (by fruit trees). Homer designs the sequence as an ascending chain of tokens — faith, body, intimacy, land.",
    },
    {
      id: "odyssey-master-3",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "Which of Odysseus's companions survives the wanderings to return home with him?",
      options: ["Eurylochus alone", "Elpenor alone", "None — Odysseus is the sole survivor", "Three men and a boy"],
      correctIndex: 2,
      explanation:
        "Twelve ships and hundreds of men sail from Troy. The Lestrigonians destroy eleven ships; the remaining crew is picked apart by Scylla, Helios, and Zeus's thunderbolt. When Odysseus finally reaches Ithaca, he is alone. Books II-XII trace a steady erasure of the Trojan veteran's world.",
    },
    {
      id: "odyssey-master-4",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The shade of Achilles tells Odysseus in Book XI that he would rather be a penniless farmhand than 'king among the dead.' Why is this remark so important?",
      options: [
        "It proves Achilles lied in the Iliad about preferring glory",
        "It overturns the Iliad's heroic code — life outweighs kleos — using the Iliad's own greatest hero as the voice of revision",
        "It is a joke meant to amuse Odysseus, not a serious statement",
        "It warns Odysseus that Hades is a place of moral inversion",
      ],
      correctIndex: 1,
      explanation:
        "Achilles's reversal uses the Iliad's most glorious hero to rewrite its own ethics. The Odyssey's Book XI is the most sophisticated sequel-maneuver in ancient literature: not contradicting the earlier poem, but placing it inside a larger moral frame.",
    },
    {
      id: "odyssey-master-5",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "What is the structural function of the Phaeacian court (Books VII–XIII) in the Odyssey?",
      options: [
        "A test the hero must pass to reach Ithaca",
        "An audience for Odysseus's autobiographical apologoi, and a transitional utopia between the wanderings and the return",
        "A rival kingdom Odysseus must conquer before continuing",
        "A place of mourning where Odysseus grieves his dead crew",
      ],
      correctIndex: 1,
      explanation:
        "The Phaeacians' court frames the apologoi (Books IX–XII as Odysseus's told story), receives the hero, and delivers him home. Homer's utopia sits structurally between two worlds. The Phaeacians are punished for their generosity (Poseidon turns their ship to stone) — a warning that perfect hospitality cannot survive in the ordinary world.",
    },
    {
      id: "odyssey-master-6",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "What makes Odysseus's bed in Book XXIII impossible to move?",
      options: [
        "It is too heavy for any mortal to lift",
        "It is built around a living olive tree still rooted in the ground",
        "It is secured to the floor with iron bolts",
        "Athena has placed an invisibility enchantment on it",
      ],
      correctIndex: 1,
      explanation:
        "Odysseus built the bedchamber around a living olive tree, carving one of the four posts from its trunk. The bed cannot be moved without destroying the tree — and the secret is known only to husband and wife. Penelope's test turns on this one piece of shared intimate knowledge.",
    },
    {
      id: "odyssey-master-7",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The three great temptations to forget home in the Odyssey are the Lotus-Eaters, Circe's pig-transformation, and —",
      options: [
        "The Sirens's song",
        "Calypso's offer of immortality",
        "Nausicaä's silent affection",
        "The riches of Alcinoüs's palace",
      ],
      correctIndex: 1,
      explanation:
        "Calypso's immortality-offer is the greatest of the three, placed (chronologically) last; Circe's pigs the middle; the Lotus-Eaters the briefest and first. Each temptation is a different way the wanderings suggest Odysseus should stop being a returnee. He refuses all three.",
    },
    {
      id: "odyssey-master-8",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The epithet *polytropos* — opening the first line of the Odyssey — most literally means:",
      options: [
        "'Of many wounds' / 'many-suffered'",
        "'Of many turns' — physical journeys AND mental turnings",
        "'Many-worded' / 'great orator'",
        "'Much-pitied' / 'much-grieved'",
      ],
      correctIndex: 1,
      explanation:
        "The Greek word fuses the turns of the road with the turns of the mind. Bryant renders it 'sagacious,' Butler 'ingenious,' Fagles 'the man of twists and turns.' No single English word captures both senses at once. The epithet itself is Homer's first statement about the poem's double subject: journey and character.",
    },
    {
      id: "odyssey-master-9",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "Which recognition scene does NOT require a physical token?",
      options: [
        "Telemachus (Book XVI)",
        "Eurycleia (Book XIX)",
        "Penelope (Book XXIII)",
        "Laertes (Book XXIV)",
      ],
      correctIndex: 0,
      explanation:
        "Telemachus accepts the declaration on faith, without scar, bed, tree-list, or any proof. The other three require tokens. The father-son recognition is the only faith-recognition in the poem.",
    },
    {
      id: "odyssey-master-10",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "When Odysseus shouts his real name back at the blinded Polyphemus from the departing ship, what is the consequence?",
      options: [
        "The Cyclops begs for forgiveness",
        "Poseidon hears and curses Odysseus's homecoming for ten years",
        "The ship is destroyed immediately by Poseidon's waves",
        "Athena appears and rebukes him for his pride",
      ],
      correctIndex: 1,
      explanation:
        "Polyphemus's prayer to Poseidon (his father) triggers the Cyclops-curse. The curse specifically asks that Odysseus never reach home — or that he return alone, late, in another man's ship. The wanderings from Book X onward are the interest compounding on this single act of pride.",
    },
    {
      id: "odyssey-master-11",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The 'weeping-woman' simile in Book VIII compares Odysseus to —",
      options: [
        "His own mother Anticlea weeping in Hades",
        "A captive widow being dragged from a sacked city, her dead husband behind her",
        "Penelope crying over an empty loom",
        "Nausicaä weeping when she must part from him",
      ],
      correctIndex: 1,
      explanation:
        "The tenor (Odysseus weeping at Troy-songs) and vehicle (a captive widow) are morally inverted. The sacker of cities is compared to the wives of his own victims. Simone Weil's 1940 essay on the Iliad's poetic force depends on this kind of Homeric moment.",
    },
    {
      id: "odyssey-master-12",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The 'Cretan lies' are:",
      options: [
        "Penelope's false stories to the suitors about Odysseus's whereabouts",
        "Four elaborate false autobiographies Odysseus tells on Ithaca under disguise",
        "Prophecies from the oracle at Crete",
        "Tales Eumaeus tells about his own origin",
      ],
      correctIndex: 1,
      explanation:
        "Odysseus delivers elaborate fake Cretan identities to Athena (XIII), Eumaeus (XIV), Penelope (XIX), and Laertes (XXIV). Each lie has the concrete texture of truth. Homer's study of strategic narrative disclosure is at the heart of the hero's ethics of mētis.",
    },
    {
      id: "odyssey-master-13",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "Dante's Inferno XXVI places Ulysses in the eighth circle of Hell for 'false counsel.' What specific act is Dante condemning?",
      options: [
        "The slaughter of the suitors",
        "The refusal of Calypso's immortality",
        "The cunning that gave Odysseus the Trojan horse, and the pride that spoke his own name to the Cyclops",
        "The secret return to Ithaca disguised as a beggar",
      ],
      correctIndex: 2,
      explanation:
        "Dante's invented post-Ithacan voyage (Ulysses sailing past Gibraltar) is punishment for the very cunning Homer celebrated — the 'false counsel' of the Trojan horse, the naming at the Cyclops's cave. Dante reads these as transgressions Homer let stand. The cross-reference is one of the deepest in Western literature.",
    },
    {
      id: "odyssey-master-14",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "The poem ends on the word —",
      options: ["'homecoming'", "'covenant'", "'peace'", "'kleos'"],
      correctIndex: 1,
      explanation:
        "The Odyssey ends with Athena mediating a sworn agreement (*horkia pista*, covenant) between Odysseus and the suitors' kin, preventing civil war. Homer's last word is institutional — oath replaces blood-feud. The Odyssey is among other things a poem about how vendetta cycles end.",
    },
    {
      id: "odyssey-master-15",
      type: "multiple_choice",
      difficulty: "Sage",
      xpReward: 50,
      text: "Tiresias's prophecy in Book XI predicts that after killing the suitors, Odysseus must —",
      options: [
        "Sacrifice three bulls to Poseidon at Ithaca and rule in peace",
        "Carry an oar inland until someone mistakes it for a winnowing-fan, then sacrifice to Poseidon there",
        "Sail to Egypt to consult Proteus",
        "Remain on Ithaca for the rest of his days",
      ],
      correctIndex: 1,
      explanation:
        "The oar-inland prophecy is the Odyssey's most haunting open ending. The poem closes but the hero's life continues in a future voyage not shown. Dante in Inferno XXVI invents one catastrophic version; Tennyson in 'Ulysses' (1833) writes the lyric of the same restlessness. Homer simply leaves it unresolved.",
    },
  ],
}
