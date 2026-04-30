/**
 * Trial bank — The Iliad, Books I–III.
 *
 * Keyed to the chapter indices used in `src/data/chapters.ts`, where index 0
 * is the Preface and Books I/II/III sit at indices 1, 2, 3. Each chapter
 * carries 15+ text-grounded questions split across Apprentice / Scholar /
 * Master tiers and across all six required types.
 *
 * Translation reference: Pope / Bryant / Lattimore tradition. Specific
 * line numbers cite Greek book.line where possible.
 */

import type { ChapterQuestion } from "@/lib/chapter-questions"

// ─────────────────────────────────────────────────────────────────────────────
// Book I — The Contention of Achilles and Agamemnon
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_I: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "iliad-bk1-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Why does Apollo send a plague upon the Greek camp at the opening of Book I?",
    options: [
      "Agamemnon refused the ransom of his priest Chryses for the priest’s daughter Chryseis",
      "Achilles desecrated Apollo’s altar at Chryse",
      "The Greeks failed to sacrifice before sailing from Aulis",
      "Calchas concealed an oracle from the army",
    ],
    correctIndex: 0,
    explanation:
      "Chryses comes to the ships bearing Apollo’s fillet and offers ransom for his daughter. Agamemnon drives him off harshly, and the priest prays to Apollo, who then shoots his arrows of plague into the camp for nine days.",
    citation: "Iliad I.11–52",
  },
  {
    id: "iliad-bk1-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "When Agamemnon is forced to give back Chryseis, what does he take from Achilles to compensate himself?",
    options: ["A bronze tripod", "The captive woman Briseis", "Achilles’ chariot horses", "Achilles’ share of the wine ration"],
    correctIndex: 1,
    explanation:
      "Agamemnon declares he will not be the only Greek without a prize and sends his heralds Talthybius and Eurybates to take Briseis from Achilles’ tent — the slight that triggers the entire poem.",
    citation: "Iliad I.318–348",
  },
  {
    id: "iliad-bk1-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "The Iliad opens by invoking the goddess to sing of the ____ of Achilles, son of Peleus.",
    correctText: "rage",
    acceptedVariants: ["wrath", "anger", "mēnis", "menis"],
    explanation:
      "The Greek opens with mēnis — rendered rage, wrath, or anger. The whole poem unfolds from this single noun, and every English translator has to choose how to weight it.",
    citation: "Iliad I.1",
  },
  {
    id: "iliad-bk1-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "“Goddess, sing the ruinous wrath of Peleus’ son Achilles.”",
    identificationSubject: "book",
    options: ["The Odyssey", "The Iliad", "The Aeneid", "Paradise Lost"],
    correctIndex: 1,
    explanation:
      "The first line of the Iliad and, by tradition, the first line of European literature. The proem announces wrath and the suffering it brings as the poem’s subject.",
    citation: "Iliad I.1–7",
  },
  {
    id: "iliad-bk1-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Achilles obeys when Agamemnon’s heralds come for Briseis.",
    correctBool: true,
    tfReasons: [
      "He hands her over without violence, but warns the heralds that Agamemnon will pay dearly.",
      "He refuses, and the heralds are forced to fight Patroclus for her.",
      "He accepts a substitute war prize and keeps Briseis.",
      "He kills the heralds on the spot.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Achilles tells Patroclus to bring Briseis out and gives her up peacefully — but he weeps on the shore afterward and calls his mother Thetis from the sea to set in motion his prayer that the Greeks suffer.",
    citation: "Iliad I.345–357",
  },
  {
    id: "iliad-bk1-app-order-1",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order these events of Book I.",
    options: [
      "Apollo sends a plague upon the Greeks",
      "Achilles calls an assembly to learn the cause",
      "Agamemnon agrees to return Chryseis but takes Briseis",
      "Thetis ascends to Olympus and pleads with Zeus",
    ],
    correctOrder: [
      "Apollo sends a plague upon the Greeks",
      "Achilles calls an assembly to learn the cause",
      "Agamemnon agrees to return Chryseis but takes Briseis",
      "Thetis ascends to Olympus and pleads with Zeus",
    ],
    explanation:
      "The plague forces the assembly; Calchas names the cause; Agamemnon yields Chryseis but seizes Briseis; Achilles withdraws and Thetis travels to Olympus to win Zeus’s nod.",
    citation: "Iliad I.43–530",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "iliad-bk1-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Why does Calchas hesitate before naming the cause of Apollo’s plague?",
    options: [
      "He fears the Trojans have spies in the camp",
      "He fears the wrath of a king more powerful than the man he must accuse",
      "He distrusts the omen and wishes to consult Zeus first",
      "He cannot speak in public without Nestor’s permission",
    ],
    correctIndex: 1,
    explanation:
      "Calchas asks Achilles for protection because, he says, when a king is angered with a lesser man, even if the king swallows his anger that day he holds it in his heart until he can satisfy it. Only with Achilles’ pledge does he name Agamemnon.",
    citation: "Iliad I.74–91",
  },
  {
    id: "iliad-bk1-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "When Achilles is about to draw his sword on Agamemnon, who restrains him, and how?",
    options: [
      "Nestor, by recalling old battles in which Achilles fought beside him",
      "Athena, sent by Hera, who seizes Achilles by the hair visible only to him",
      "Patroclus, who steps between them and pleads with both kings",
      "Odysseus, by reminding Achilles of his oath at Aulis",
    ],
    correctIndex: 1,
    explanation:
      "Hera sends Athena down. She comes up behind Achilles, grasps his golden hair, and is seen by him alone. She promises threefold gifts later if he restrains himself now, and he obeys, sheathing the sword.",
    citation: "Iliad I.193–222",
  },
  {
    id: "iliad-bk1-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Achilles swears his great oath of withdrawal upon a ____ — a piece of wood that, once cut from its tree, can never bear leaves again.",
    correctText: "sceptre",
    acceptedVariants: ["scepter", "staff"],
    explanation:
      "He swears by the sceptre carried by the Achaean kings: as it can never sprout again, so the Greeks will one day long for Achilles and Agamemnon will be unable to help them.",
    citation: "Iliad I.234–246",
  },
  {
    id: "iliad-bk1-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "She rises from the grey sea at her son’s call, sits beside him on the shore, and promises to carry his prayer to Olympus.",
    identificationSubject: "character",
    options: ["Hera", "Thetis", "Athena", "Aphrodite"],
    correctIndex: 1,
    explanation:
      "Thetis, the sea-nymph mother of Achilles, comes up out of the foam like a mist when he weeps on the shore. She agrees to plead with Zeus, and she does so on the twelfth day after the gods return from the Aethiopians.",
    citation: "Iliad I.357–427",
  },
  {
    id: "iliad-bk1-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each figure in Book I to the role they play.",
    matchingLeft: ["Chryses", "Calchas", "Thetis", "Hephaestus"],
    matchingRight: [
      "Priest of Apollo whose ransom is refused",
      "Seer who names Agamemnon as the cause of the plague",
      "Mother of Achilles who appeals to Zeus",
      "Smith god who restores peace at the gods’ feast",
    ],
    correctPairs: {
      Chryses: "Priest of Apollo whose ransom is refused",
      Calchas: "Seer who names Agamemnon as the cause of the plague",
      Thetis: "Mother of Achilles who appeals to Zeus",
      Hephaestus: "Smith god who restores peace at the gods’ feast",
    },
    explanation:
      "The four hinges of Book I: the priest whose grievance starts the action, the seer who diagnoses it, the divine mother who escalates it, and the lame god whose comic limping defuses the quarrel on Olympus that mirrors the human one.",
    citation: "Iliad I",
  },
  {
    id: "iliad-bk1-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Hera supports Agamemnon throughout the quarrel and resists Thetis’s appeal.",
    correctBool: false,
    tfReasons: [
      "Hera quarrels with Zeus precisely because he has bowed to Thetis, suspecting he will let the Greeks suffer for Achilles’ sake.",
      "Hera takes no notice of the dispute and remains aloof during Book I.",
      "Hera secretly aids Thetis and plots with her against Zeus.",
      "Hera intervenes on Agamemnon’s behalf and orders Athena to seize Achilles.",
    ],
    tfCorrectReason: 0,
    explanation:
      "After Zeus nods to Thetis, Hera confronts him on Olympus and accuses him of plotting in secret with the sea-goddess. Hera does send Athena, but earlier — to restrain Achilles, not to help Agamemnon.",
    citation: "Iliad I.531–611",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "iliad-bk1-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "What signal does Zeus give to confirm his promise to Thetis?",
    options: [
      "He hurls a bolt of lightning across the cloudless sky",
      "He nods his head, shaking the dark brows and ambrosial locks of his immortal head",
      "He sends an eagle to fly past Thetis’s right hand",
      "He sends Iris with a sealed token",
    ],
    correctIndex: 1,
    explanation:
      "The famous nod — the sign that even the gods cannot revoke. The shaking of the ambrosial locks makes great Olympus tremble, and it was this gesture, by tradition, that Phidias represented in his lost statue at Olympia.",
    citation: "Iliad I.524–530",
  },
  {
    id: "iliad-bk1-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "When Thetis reminds Zeus of an old debt she is owed, what was the favor she once did him?",
    options: [
      "She bore him a son in secret",
      "She freed him by summoning Briareus when the other gods had bound him",
      "She hid him from Cronos as an infant on Crete",
      "She returned a stolen thunderbolt to his hand",
    ],
    correctIndex: 1,
    explanation:
      "Thetis reminds Zeus that when Hera, Poseidon, and Athena once tried to bind him, she fetched the hundred-handed Briareus to Olympus, whose presence was enough to stop the rebellion. The debt is the lever she uses for Achilles.",
    citation: "Iliad I.396–406",
  },
  {
    id: "iliad-bk1-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "When the Olympian quarrel ends, ____ takes up the wine-cup and limps about the hall serving the gods, and unquenchable laughter rises among the blessed.",
    correctText: "Hephaestus",
    acceptedVariants: ["hephaistos"],
    explanation:
      "The lame smith god parodies the cup-bearing of beautiful Hebe and Ganymede; the gods’ laughter at his limping is the deliberately comic counterpoint to the human anger that has just torn the camp at Troy.",
    citation: "Iliad I.595–600",
  },
  {
    id: "iliad-bk1-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "“For if even now Olympian Zeus grant us not to sack the well-built town of Troy.” The line is spoken in council by an old hero who appeals to his memories of fighting beside the Lapithae.",
    identificationSubject: "speaker",
    options: ["Odysseus", "Diomedes", "Nestor", "Idomeneus"],
    correctIndex: 2,
    explanation:
      "Nestor’s speech of mediation in the assembly. He invokes the heroes of his youth — the Lapiths and Centaurs — to claim authority, and urges Achilles and Agamemnon to give way to one another. They do not.",
    citation: "Iliad I.247–284",
  },
  {
    id: "iliad-bk1-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Achilles’ withdrawal from battle is meant to force Agamemnon to apologize publicly.",
    correctBool: false,
    tfReasons: [
      "He prays through Thetis that the Trojans win until the Greeks long for him — the goal is collective suffering that vindicates his honour, not a private apology.",
      "His goal is a private apology from Agamemnon, with no harm to the army.",
      "He withdraws only to retrieve fresh armour from Phthia.",
      "He withdraws because Calchas tells him to.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The prayer is for the Achaeans to be hemmed in along the ships and slaughtered until Agamemnon recognizes how he has dishonoured the best of the Achaeans. The plot of the entire poem is the working out of this prayer.",
    citation: "Iliad I.407–412",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Book II — The Trial of the Army, and Catalogue of the Forces
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_II: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "iliad-bk2-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "In what shape does the deceitful Dream sent by Zeus appear to Agamemnon?",
    options: [
      "Achilles, as if reconciled",
      "Nestor, the elder counsellor whom Agamemnon honours most",
      "Calchas, with a fresh oracle",
      "An owl with golden eyes",
    ],
    correctIndex: 1,
    explanation:
      "Zeus sends the Dream in the likeness of Nestor, son of Neleus, because Agamemnon is more likely to believe the wisest of the elders. The dream tells him to arm the Greeks: Troy can be taken at once.",
    citation: "Iliad II.16–34",
  },
  {
    id: "iliad-bk2-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What strategy does Agamemnon adopt before announcing the planned attack?",
    options: [
      "He proposes a sacrifice to Athena and Hera",
      "He tests the army by ordering them to launch the ships and sail home",
      "He distributes new armour from his ships",
      "He sends scouts toward the Trojan walls",
    ],
    correctIndex: 1,
    explanation:
      "Agamemnon’s plan to test the morale of the troops backfires spectacularly: when he proposes flight, the men race for the ships and have to be turned back by Odysseus, prompted by Athena.",
    citation: "Iliad II.110–154",
  },
  {
    id: "iliad-bk2-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "____ stops the rout to the ships by going man to man with persuasion or, when needed, the sceptre.",
    correctText: "Odysseus",
    explanation:
      "Athena finds Odysseus and orders him to halt the rush. He flatters the kings and beats the commoners with Agamemnon’s own sceptre, restoring the assembly.",
    citation: "Iliad II.169–210",
  },
  {
    id: "iliad-bk2-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Bandy-legged, hunch-shouldered, bald on top, he is the only commoner given a speech in the Iliad and is silenced by a blow from the sceptre.",
    identificationSubject: "character",
    options: ["Polydamas", "Thersites", "Eurybates", "Talthybius"],
    correctIndex: 1,
    explanation:
      "Thersites — the poem’s lone non-aristocratic voice — accuses Agamemnon of greed and is beaten down by Odysseus to the army’s laughter, reinforcing the heroic-aristocratic frame of the epic.",
    citation: "Iliad II.211–277",
  },
  {
    id: "iliad-bk2-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Book II includes a long catalogue of the Greek contingents and their leaders.",
    correctBool: true,
    tfReasons: [
      "The Catalogue of Ships lists the Greek squadrons by region and leader, then the Trojan order is given in shorter form.",
      "There is no catalogue in Book II; the catalogue belongs to Book III.",
      "Book II contains only a catalogue of Trojan allies.",
      "Book II catalogues the Greek leaders’ wives.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Catalogue of Ships is the most famous formal set-piece of the Iliad after the Shield of Achilles. The Trojan catalogue follows in a more compressed form at the book’s close.",
    citation: "Iliad II.484–877",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "iliad-bk2-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Before the Catalogue of Ships, the narrator invokes the Muses with what specific reasoning?",
    options: [
      "He fears for the safety of his patron",
      "He cannot remember every name without divine help, since he is mortal and only heard rumour",
      "He wishes to make the song longer for his audience",
      "He has been threatened by a rival bard",
    ],
    correctIndex: 1,
    explanation:
      "The proem to the Catalogue is the Iliad’s most explicit statement of the bard’s dependence on the Muses: he says he could not name the multitude of leaders had he ten tongues and ten mouths, since they are present and know all things while mortals only hear report.",
    citation: "Iliad II.484–493",
  },
  {
    id: "iliad-bk2-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Which omen is recalled in Book II to remind the army of how long the war must last?",
    options: [
      "An eagle that dropped a serpent at Aulis",
      "A serpent that swallowed nine sparrows at Aulis and was turned to stone",
      "A meteor seen on the night of the embarkation",
      "Twin lions that ate Trojan oxen",
    ],
    correctIndex: 1,
    explanation:
      "Odysseus reminds the army of the omen at Aulis when a snake devoured eight chicks and the mother sparrow — nine birds — and was then turned to stone. Calchas read it as nine years of war and the city taken in the tenth.",
    citation: "Iliad II.299–332",
  },
  {
    id: "iliad-bk2-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Nestor advises Agamemnon to draw up the army by ____ and clans, so kinsmen will fight beside kinsmen.",
    correctText: "tribes",
    acceptedVariants: ["phyle", "phylai"],
    explanation:
      "Nestor’s tactical counsel: order the troops kata phyla kai kata phretras — by tribes and clans — so that the brave will be visible and shame and pride will hold the line.",
    citation: "Iliad II.362–366",
  },
  {
    id: "iliad-bk2-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "“The hosts went forth as when fire ravages the boundless forest on a mountain’s peak.”",
    identificationSubject: "book",
    options: ["The Aeneid", "The Iliad", "The Odyssey", "Paradise Lost"],
    correctIndex: 1,
    explanation:
      "One of the chained similes that opens the marshalling of the army in Book II — fire on the mountains, then geese and cranes, then flies in a milking-pail. The technique is canonical Homeric: a single image stretched and substituted to magnify scale.",
    citation: "Iliad II.455–483",
  },
  {
    id: "iliad-bk2-sch-order-1",
    type: "ordering",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Order these moments from the assembly in Book II.",
    options: [
      "Agamemnon proposes returning home as a test",
      "The Greeks rush for the ships",
      "Odysseus, prompted by Athena, halts the rout",
      "Thersites is silenced",
    ],
    correctOrder: [
      "Agamemnon proposes returning home as a test",
      "The Greeks rush for the ships",
      "Odysseus, prompted by Athena, halts the rout",
      "Thersites is silenced",
    ],
    explanation:
      "The whole sequence is one collapse and recovery: Agamemnon’s mistaken test, the panic, Odysseus’s street-by-street persuasion, and the comic-aristocratic finale of beating Thersites.",
    citation: "Iliad II.110–277",
  },
  {
    id: "iliad-bk2-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "The Catalogue of Ships is organized alphabetically by leader.",
    correctBool: false,
    tfReasons: [
      "It is organized geographically, moving across the regions of mainland Greece and the islands.",
      "It is organized alphabetically by the name of each commander.",
      "It is organized by the size of each contingent, largest first.",
      "It is organized chronologically by when each contingent joined the war.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The Catalogue tours the political map of late-Mycenaean Greece — Boeotia, Phocis, Locris, and so on — listing for each region its towns, leaders, and number of ships. Its geography has been studied as a near-archaeological document.",
    citation: "Iliad II.494–759",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "iliad-bk2-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Which contingent in the Catalogue of Ships is named without its leader, because that leader is sulking by his ships?",
    options: [
      "The Locrians under Ajax the Lesser",
      "The Cretans under Idomeneus",
      "The Myrmidons of Achilles",
      "The Cephallenians of Odysseus",
    ],
    correctIndex: 2,
    explanation:
      "The Catalogue lists the fifty ships of the Myrmidons but explicitly notes that Achilles is not at their head — he lies among the ships, angry over Briseis. The detail keeps the wrath visible even in the formal set-piece.",
    citation: "Iliad II.681–694",
  },
  {
    id: "iliad-bk2-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "Why does the false Dream succeed in deceiving Agamemnon, despite the obvious risk that a god might lie?",
    options: [
      "Because Agamemnon does not consult Calchas",
      "Because the Dream wears the form of Nestor and quotes Hera and Athena as supporters",
      "Because Zeus has bound Agamemnon by oath at Aulis",
      "Because Athena confirms the Dream privately",
    ],
    correctIndex: 1,
    explanation:
      "The Dream takes the form of the most respected counsellor and represents itself as the unanimous will of the Olympians. Agamemnon’s flaw is not stupidity but a credulity built on the assumption that a divine messenger appearing as Nestor cannot be a lie — exactly the assumption Zeus exploits.",
    citation: "Iliad II.16–47",
  },
  {
    id: "iliad-bk2-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "The Trojan host is led to the field by ____, son of Priam, marshaling allies who speak many tongues.",
    correctText: "Hector",
    explanation:
      "The Trojan catalogue is shorter than the Greek and emphasises the polyglot nature of the allies — a recurring contrast with the (relatively) more uniform Achaeans, ordered by Hector under the gates.",
    citation: "Iliad II.816–877",
  },
  {
    id: "iliad-bk2-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "He boasts in the Catalogue of having horses faster than any others, but his armour is of bronze and he has no claim to be the equal of Achilles.",
    identificationSubject: "character",
    options: ["Diomedes", "Eumelus", "Idomeneus", "Menelaus"],
    correctIndex: 1,
    explanation:
      "The Catalogue notes that Eumelus, son of Admetus, has the swiftest horses — but a parenthesis at once concedes that Achilles’ horses, divine and immortal, are faster still while their master remains in his tent.",
    citation: "Iliad II.763–770",
  },
  {
    id: "iliad-bk2-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "Thersites’ speech repeats arguments very close to those Achilles made against Agamemnon in Book I.",
    correctBool: true,
    tfReasons: [
      "He attacks Agamemnon’s greed and the unequal distribution of plunder, but is shamed for being lowborn — a deliberate framing that lets the same critique be voiced and dismissed.",
      "His speech is unrelated to Achilles’ — he criticises the gods only.",
      "He defends Agamemnon against Achilles.",
      "He calls for the Greeks to surrender to the Trojans.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Thersites is the same complaint in a form the poem refuses to honour: the substance overlaps with Achilles’ Book I attack, but Homer assigns the rhetoric to a despised body and lets Odysseus beat him into silence. The episode disciplines the audience’s response to social criticism.",
    citation: "Iliad I.149–171, II.225–242",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Book III — Single Combat of Menelaus and Paris
// ─────────────────────────────────────────────────────────────────────────────

const BOOK_III: ChapterQuestion[] = [
  // ── Apprentice ─────────────────────────────────────────────────────
  {
    id: "iliad-bk3-app-mcq-1",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "How does Paris first present himself to the assembled armies in Book III?",
    options: [
      "Hidden among the rear ranks of the Trojans",
      "Striding out as a champion in panther skin, bow on shoulder, two spears in hand",
      "On a chariot with Helen at his side",
      "In golden armour given by Aphrodite",
    ],
    correctIndex: 1,
    explanation:
      "Paris steps before the Trojan ranks like a hero — but the moment Menelaus leaps down from his chariot to meet him, Paris draws back into the line in fear, prompting Hector’s scathing rebuke.",
    citation: "Iliad III.15–37",
  },
  {
    id: "iliad-bk3-app-mcq-2",
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "What single combat is finally arranged to settle the war?",
    options: [
      "Paris versus Menelaus, with Helen and the treasures going to the winner",
      "Hector versus Achilles, in the field before both armies",
      "Aeneas versus Diomedes",
      "Priam versus Agamemnon",
    ],
    correctIndex: 0,
    explanation:
      "On Hector’s urging, the two who began the conflict, Paris and Menelaus, will fight in the open. The winner takes Helen and her possessions, and the war ends with friendship sworn between Greeks and Trojans.",
    citation: "Iliad III.67–94",
  },
  {
    id: "iliad-bk3-app-fill-1",
    type: "fill_blank",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "From the wall of Troy, Helen names the Greek leaders to king ____, in the scene known as the Teichoscopia.",
    correctText: "Priam",
    explanation:
      "The Teichoscopia — the View from the Walls — is Helen’s identification of the major Greek heroes for Priam: Agamemnon, Odysseus, Ajax, Idomeneus. It is the poem’s formal introduction of the Greek leaders to its in-text Trojan audience.",
    citation: "Iliad III.161–244",
  },
  {
    id: "iliad-bk3-app-ident-1",
    type: "identification",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Helen describes him: shorter by a head than Agamemnon, broader in the shoulders, ranging the ranks like a thick-fleeced ram among ewes.",
    identificationSubject: "character",
    options: ["Idomeneus", "Odysseus", "Ajax", "Diomedes"],
    correctIndex: 1,
    explanation:
      "The famous portrait of Odysseus from the wall: shorter than Agamemnon but with broader chest and shoulders, the “ram” simile fixed in Greek memory long after the Iliad.",
    citation: "Iliad III.193–198",
  },
  {
    id: "iliad-bk3-app-tfr-1",
    type: "tf_with_reason",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "The single combat between Paris and Menelaus ends with Menelaus killing Paris on the field.",
    correctBool: false,
    tfReasons: [
      "Menelaus is dragging Paris off by the helmet strap when Aphrodite breaks the strap and spirits Paris away in a mist.",
      "Menelaus kills Paris with a spear-thrust to the throat.",
      "Paris flees on his own and is killed by Hector for cowardice.",
      "The duel is suspended when Zeus throws a thunderbolt between the fighters.",
    ],
    tfCorrectReason: 0,
    explanation:
      "Menelaus has the advantage and is hauling Paris back toward the Greek lines by the helmet when the chinstrap breaks in his hand — Aphrodite has snapped it — and she carries Paris away in a cloud, depositing him in his own bedchamber.",
    citation: "Iliad III.369–382",
  },
  {
    id: "iliad-bk3-app-order-1",
    type: "ordering",
    difficulty: "Apprentice",
    xpReward: 5,
    text: "Order these events of Book III.",
    options: [
      "Paris proposes single combat after Hector’s rebuke",
      "Helen names the Greek leaders to Priam from the wall",
      "Menelaus’s helmet strap breaks and Aphrodite saves Paris",
      "Helen confronts Aphrodite and is forced to Paris’s bed",
    ],
    correctOrder: [
      "Paris proposes single combat after Hector’s rebuke",
      "Helen names the Greek leaders to Priam from the wall",
      "Menelaus’s helmet strap breaks and Aphrodite saves Paris",
      "Helen confronts Aphrodite and is forced to Paris’s bed",
    ],
    explanation:
      "The book is a tight chain: Hector shames Paris into the duel; the Teichoscopia frames the combatants; Aphrodite snatches her favourite away; the goddess then drags Helen back to him.",
    citation: "Iliad III",
  },

  // ── Scholar ────────────────────────────────────────────────────────
  {
    id: "iliad-bk3-sch-mcq-1",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "How does Hector publicly shame Paris before proposing the duel?",
    options: [
      "He calls him an evil-Paris, fair in form, woman-mad, beguiler — better unborn than living to be a Trojan reproach",
      "He accuses him of stealing weapons from the temple of Apollo",
      "He demands he sail back to Sparta alone",
      "He challenges him to a chariot race in front of the army",
    ],
    correctIndex: 0,
    explanation:
      "Hector’s rebuke — Dysparis, eidos ariste, gynaimanes, eperopeuta — names the gap between Paris’s beauty and his courage. The shame, more than strategy, drives Paris to suggest the duel.",
    citation: "Iliad III.38–57",
  },
  {
    id: "iliad-bk3-sch-mcq-2",
    type: "multiple_choice",
    difficulty: "Scholar",
    xpReward: 10,
    text: "What does Priam do during the truce to swear the oaths over the slain lambs?",
    options: [
      "He sends Hector down in his place",
      "He himself drives down from Troy to swear with Agamemnon and then returns to the city, unable to watch his son fight",
      "He stays on the wall and sends a herald with his sceptre",
      "He refuses the oath and walks back inside the gates",
    ],
    correctIndex: 1,
    explanation:
      "Priam comes down from the city, joins Agamemnon in cutting throats and swearing by Zeus, then returns to Troy. He says he cannot bear to watch his son fight Menelaus with his own eyes.",
    citation: "Iliad III.245–313",
  },
  {
    id: "iliad-bk3-sch-fill-1",
    type: "fill_blank",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Helen first appears in the Iliad weaving on a great ____, embroidering the battles of the Trojans and bronze-clad Achaeans being fought for her sake.",
    correctText: "loom",
    acceptedVariants: ["web", "tapestry"],
    explanation:
      "The image is famously self-referential: Helen at her loom is weaving the Iliad. Iris finds her so before summoning her to the wall, where she will speak the war into being for Priam.",
    citation: "Iliad III.125–128",
  },
  {
    id: "iliad-bk3-sch-ident-1",
    type: "identification",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Speaking on the wall, this elder says of Helen that no one could blame the Trojans and Greeks for suffering long for such a woman, terribly like the immortal goddesses to look upon.",
    identificationSubject: "speaker",
    options: ["Hector", "Priam", "An anonymous old Trojan elder", "Aeneas"],
    correctIndex: 2,
    explanation:
      "The line is given to one of the gathered old men of Troy on the Scaean Gates. Priam himself absolves Helen of blame in a softer key. The elders’ judgement is the poem’s most-quoted assessment of Helen’s beauty.",
    citation: "Iliad III.146–160",
  },
  {
    id: "iliad-bk3-sch-match-1",
    type: "matching",
    difficulty: "Scholar",
    xpReward: 10,
    text: "Match each Greek leader to the description Helen gives of him from the wall.",
    matchingLeft: ["Agamemnon", "Odysseus", "Ajax (the Greater)", "Idomeneus"],
    matchingRight: [
      "Both a good king and a strong spearman, marshaller of the host",
      "Shorter by a head than the others, broad in chest, like a ram among ewes",
      "Bulwark of the Achaeans, towering over the rest",
      "An older Cretan whose long-haired comrades stand round him",
    ],
    correctPairs: {
      Agamemnon: "Both a good king and a strong spearman, marshaller of the host",
      Odysseus: "Shorter by a head than the others, broad in chest, like a ram among ewes",
      "Ajax (the Greater)": "Bulwark of the Achaeans, towering over the rest",
      Idomeneus: "An older Cretan whose long-haired comrades stand round him",
    },
    explanation:
      "Helen’s capsule portraits in the Teichoscopia became a fixed stock for later representations. Each phrase is the line by which the poem first sketches the leader for its audience.",
    citation: "Iliad III.161–244",
  },
  {
    id: "iliad-bk3-sch-tfr-1",
    type: "tf_with_reason",
    difficulty: "Scholar",
    xpReward: 10,
    text: "When Aphrodite summons Helen back to Paris’s bedchamber, Helen goes willingly and gladly.",
    correctBool: false,
    tfReasons: [
      "She refuses, mocks Paris, and is finally cowed by Aphrodite’s threat to abandon her to the hatred of Trojans and Greeks alike.",
      "She runs to him at once, eager to comfort him.",
      "She demands that Hector judge between them first.",
      "She agrees only after Priam orders her to.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The most striking moment of Helen’s characterisation in the poem: she sees through the goddess’s disguise, refuses, and is forced into compliance by an explicit threat. The whole scene undermines any easy reading of Helen as merely complicit.",
    citation: "Iliad III.383–420",
  },

  // ── Master ─────────────────────────────────────────────────────────
  {
    id: "iliad-bk3-mas-mcq-1",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "How does Helen rebuke Paris when Aphrodite has set them in the bedchamber?",
    options: [
      "She praises his courage and tends his wounds in silence",
      "She wishes he had died before the duel, and reminds him that Menelaus was the better man",
      "She demands Aphrodite return her to the Greek camp",
      "She offers to fight Menelaus herself",
    ],
    correctIndex: 1,
    explanation:
      "Helen tells Paris she wishes he had been killed by the better man and is openly contemptuous. Paris parries by inviting her to bed, claiming desire is stronger now than even on the night they first lay together. The asymmetry is the point.",
    citation: "Iliad III.428–448",
  },
  {
    id: "iliad-bk3-mas-mcq-2",
    type: "multiple_choice",
    difficulty: "Master",
    xpReward: 15,
    text: "How does Book III end?",
    options: [
      "With Achilles being summoned back to fight",
      "With Agamemnon proclaiming Menelaus the victor and demanding the return of Helen and the treasures",
      "With Hector and Paris reconciling on the wall",
      "With the gods quarrelling over the outcome on Olympus",
    ],
    correctIndex: 1,
    explanation:
      "Menelaus alive, Paris vanished, the duel by its own terms a Greek victory: Agamemnon stands up among the host and calls on the Trojans to honour the oath. The unanswered demand is what ends the truce in Book IV.",
    citation: "Iliad III.456–461",
  },
  {
    id: "iliad-bk3-mas-fill-1",
    type: "fill_blank",
    difficulty: "Master",
    xpReward: 15,
    text: "Disguised as an old wool-spinner from Sparta, ____ summons Helen down from the wall to where Paris waits.",
    correctText: "Aphrodite",
    explanation:
      "The disguise sharpens Helen’s anger: the goddess takes the form of a domestic favourite from her old life. Helen recognises her at once by neck and breasts and gleaming eyes, and answers her with one of the boldest speeches a mortal makes to a god in Homer.",
    citation: "Iliad III.383–394",
  },
  {
    id: "iliad-bk3-mas-ident-1",
    type: "identification",
    difficulty: "Master",
    xpReward: 15,
    text: "She is named “the white-armed,” a fixed epithet that recurs whenever the poem turns to her domestic frame.",
    identificationSubject: "character",
    options: ["Andromache", "Hera", "Helen", "Hecuba"],
    correctIndex: 2,
    explanation:
      "“White-armed Helen” — leukōlenos Helenē — is the epithet attached to her in the bedchamber scene and elsewhere. The fixed epithet is a tool of oral composition; here it underlines a domestic, indoor Helen against the warring outdoors.",
    citation: "Iliad III.121, III.423",
  },
  {
    id: "iliad-bk3-mas-tfr-1",
    type: "tf_with_reason",
    difficulty: "Master",
    xpReward: 15,
    text: "The duel in Book III, if its terms had held, would have ended the entire war by itself.",
    correctBool: true,
    tfReasons: [
      "The sworn terms make Helen and treasure go to the victor and friendship sworn between sides — only Pandarus’s arrow in Book IV breaks the truce.",
      "The terms applied only to a single day of fighting, not the war as a whole.",
      "The duel was always understood by both sides as a token gesture.",
      "Zeus had already promised the Trojans victory, voiding the terms.",
    ],
    tfCorrectReason: 0,
    explanation:
      "The whole architecture of Book III is the war’s logical end: the original quarrel resolved by the original couple. The poem keeps that hypothetical visible by letting it almost succeed and then having a god — through Pandarus — break the truce in Book IV.",
    citation: "Iliad III.67–94, IV.86–147",
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Keyed by chapter index in `chapters.ts`. The Iliad reader stores Book I at
 * index 1 (chapter 0 is the Preface), so the chapter offset of +1 matters.
 */
export const ILIAD_I_III_TRIALS: Record<number, ChapterQuestion[]> = {
  1: BOOK_I,
  2: BOOK_II,
  3: BOOK_III,
}
