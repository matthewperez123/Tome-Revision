/**
 * Beowulf chapter trials — per-fitt questions plus the "Hall-Friend"
 * Master Trial (from Old English *heall-gefēra*, "hall-companion").
 *
 *   chapterIndex 0..1   — preface + introduction (front matter, no trials)
 *   chapterIndex 2..44  — Fitts I..XLIII (Hall's numbering)
 *   chapterIndex 45     — Master Trial ("Hall-Friend" Seal)
 *   chapterIndex 46     — Germanic Root stretch (scaffold, future)
 *   chapterIndex 47     — Englisc stretch (Anglophone epic line, future)
 *
 * Per spec Part 6: ~one Trial per 3–4 fitts (grouping shorter fitts),
 * 3–5 questions each. ~12 Trials total covering 43 fitts. The Master
 * Trial has 12 questions synthesizing the poem's major interpretive
 * threads (monster fights, heroic code, Christian frame, tribal context,
 * ring composition, dragon-fight reading).
 *
 * Merged at lookup time by getQuestionsForChapter() in chapter-questions.ts.
 * Schema matches ChapterQuestion.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const BEOWULF_TRIALS: Record<number, ChapterQuestion[]> = {
  // ── Fitts I–III: Opening, Grendel's arrival (chapters 2–4) ──────────
  2: [
    { id: "beo-1-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "The first word of the poem in Hall's translation is 'Lo!' — translating what Old English word?",
      options: ["*Hwæt*", "*Wæs*", "*Þā*", "*Gē*"],
      correctIndex: 0,
      explanation: "*Hwæt!* is the poem's opening — traditionally rendered 'Lo!' or 'Listen!' or (Heaney) 'So.' It is the scop's call to attention, the mead-hall opening of performance." },
    { id: "beo-1-2", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "In which single manuscript does the poem survive?",
      options: ["Ellesmere MS", "Vercelli Book", "Cotton Vitellius A.xv", "Exeter Book"],
      correctIndex: 2,
      explanation: "Cotton Vitellius A.xv (British Library) — copied out ca. 1000 CE, partially scorched in the 1731 Cotton Library fire, and the poem's only surviving witness." },
    { id: "beo-1-3", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Beowulf was widely read as literature before J.R.R. Tolkien's 1936 lecture.",
      correctBool: false,
      explanation: "Before 1936 the poem was treated as philological material — studied for Old English vocabulary and case endings. Tolkien's *Beowulf: The Monsters and the Critics* argued the monsters are the poem, and rescued it as literature." },
  ],

  // ── Fitts IV–VII: Beowulf arrives at Heorot (chapters 5–8) ─────────
  5: [
    { id: "beo-4-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "Beowulf's lord, to whom he is nephew and thane, is:",
      options: ["Hrothgar", "Hygelac", "Ecgtheow", "Heardred"],
      correctIndex: 1,
      explanation: "Hygelac is king of the Geats and Beowulf's uncle; Ecgtheow is Beowulf's father; Hrothgar is the aged Danish king Beowulf has come to help; Heardred is Hygelac's son (later briefly king)." },
    { id: "beo-4-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "In a Germanic mead-hall, what is a 'thyle' (Hall's Unferth)?",
      options: ["A monster-slayer", "A priest or monk", "A formal court orator / counselor, a kind of ritual challenger", "A young prince in training"],
      correctIndex: 2,
      explanation: "The *thyle* was a codified court role — the formal orator whose duty included ritual challenge (flyting) of newcomers. Unferth's taunting of Beowulf is not mere insult but a recognized cultural practice." },
  ],

  // ── Fitts VIII–XI: Feast, flyting, Beowulf's vow (chapters 9–12) ───
  9: [
    { id: "beo-8-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "At the feast before the Grendel fight, Beowulf vows to:",
      options: ["Cut off Grendel's head before morning", "Fight Grendel without a sword", "Give away all the gold he has earned in Denmark", "Never return to Geatland"],
      correctIndex: 1,
      explanation: "Because Grendel uses no weapons, Beowulf's boast binds him to meet the monster bare-handed. In Germanic warrior culture the boast is contractual, not rhetorical — breaking it would be dishonor." },
    { id: "beo-8-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Unferth's flyting of Beowulf is purely a personal insult that the poem condemns.",
      correctBool: false,
      explanation: "Flyting is a formal warrior-culture ritual — a recognized status-test of newcomers. Unferth later reconciles and gives Beowulf his heirloom sword Hrunting. The exchange is competitive but not dishonorable." },
  ],

  // ── Fitts XII–XV: The Grendel fight (chapters 13–16) ───────────────
  13: [
    { id: "beo-12-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "How does Beowulf kill Grendel?",
      options: ["Cuts off his head with Hrunting", "Stabs him in the heart with a spear", "Tears the arm from his shoulder; Grendel flees to die in the mere", "Drowns him in the mead-hall fire"],
      correctIndex: 2,
      explanation: "Beowulf wrenches Grendel's arm off at the shoulder; Grendel escapes mortally wounded but dies later in his mother's lair. The actual kill is off-stage — a pointed narrative choice." },
    { id: "beo-12-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Grendel is explicitly descended from which biblical figure?",
      options: ["Lucifer", "Nimrod", "Cain", "Esau"],
      correctIndex: 2,
      explanation: "The poem names Grendel's line from Cain, the first murderer. This Christian-biblical genealogy transforms him from generic monster into a *cursed exile* carrying his ancestor's mark — Tolkien's reading turns on this detail." },
  ],

  // ── Fitts XVI–XIX: Celebration, Finnsburg lay (chapters 17–20) ─────
  17: [
    { id: "beo-16-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "The 'Finnsburg Episode' is:",
      options: ["A historical raid Beowulf joined", "An embedded lay sung by the scop at Hrothgar's victory feast", "The battle where Hygelac died", "Grendel's origin story"],
      correctIndex: 1,
      explanation: "The Finnsburg lay is an embedded narrative — a separate older heroic tale about a feud between Danes and Frisians, sung by the scop at Heorot. A different (PD) poem, *The Fight at Finnsburg*, preserves fragments of the same material." },
    { id: "beo-16-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The digressions in Beowulf (Finnsburg, Sigemund, Heremod, Freawaru-Ingeld) are unrelated asides disrupting the main narrative.",
      correctBool: false,
      explanation: "Tolkien's revisionist reading — now canonical — is that the digressions *are* structurally central. They provide historical depth, moral counter-exempla, and foreshadowing. The poem is built on digression, not despite it." },
  ],

  // ── Fitts XX–XXIV: Grendel's mother & the mere (chapters 21–25) ────
  21: [
    { id: "beo-20-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "Grendel's mother kills only Aeschere because:",
      options: ["She is too weak to kill more than one", "She is operating under the feud-law of wergild — one life for one life", "She mistakes him for Beowulf", "The Danes drive her off"],
      correctIndex: 1,
      explanation: "Her vengeance is *legal* by Germanic standards — one killing paid in return for her son. The poem's horror here is that feud-law, not monstrosity, drives the raid. Tolkien called her the more formidable adversary." },
    { id: "beo-20-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "What happens to the ancient giants' sword after Beowulf uses it?",
      options: ["He carries it home as a trophy", "Hrothgar keeps it to hang in Heorot", "The blade melts in Grendel's venomous blood; Beowulf returns with only the hilt", "It is reforged and becomes Naegling"],
      correctIndex: 2,
      explanation: "After killing Grendel's mother and beheading Grendel's corpse, the blade dissolves in the monstrous blood like an ice-dagger in thaw — one of the poem's great concrete images. The runic hilt is carried to Hrothgar." },
    { id: "beo-20-3", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The sword Hrunting, lent to Beowulf by Unferth, fails him against Grendel's mother.",
      correctBool: true,
      explanation: "It is Hrunting's first failure ever — the poem's first sign that inherited heroic virtue is not sufficient for the depths. The moment prefigures the end: no heirloom weapon closes the dragon fight either." },
  ],

  // ── Fitts XXV–XXVIII: Hrothgar's sermon & return (chapters 26–29) ──
  27: [
    { id: "beo-26-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "Hrothgar's long speech to Beowulf (Fitt XXVI), widely called 'Hrothgar's sermon', warns him especially against:",
      options: ["Leaving Hrothgar's court too soon", "The complacency that follows heroic success", "Trusting women in the hall", "Fighting dragons"],
      correctIndex: 1,
      explanation: "The sermon's central argument: success loosens vigilance; the 'soul's guardian' sleeps; pride enters; the man falls. Heremod is the negative exemplum. The warning is about *now* — at the peak of Beowulf's victories — because that is when the danger is greatest." },
    { id: "beo-26-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "Hrothgar's sermon is a straightforward Christian homily.",
      correctBool: false,
      explanation: "It layers Christian monastic diction (God the giver, the soul's guardian, the bitter arrow) onto pre-existing Germanic wisdom-literature patterns. The Old English *Wanderer* and *Seafarer* show the same structure operating before Christian glosses were added." },
  ],

  // ── Fitts XXIX–XXXI: Return to Geatland (chapters 30–32) ───────────
  30: [
    { id: "beo-29-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "On returning to Geatland, Beowulf retells his adventures to Hygelac at court. What new material does he introduce?",
      options: ["A confession of having run from the mere-fight", "The Freawaru-Ingeld prophecy — the foreseen re-eruption of the Heathobard feud", "A different version of the Grendel fight blaming Unferth", "A marriage proposal to Hygd"],
      correctIndex: 1,
      explanation: "The retrospective adds new material: Beowulf foretells that Freawaru's marriage to Ingeld (a peace-weaving offer from Hrothgar) will fail when an old Heathobard sees his father's killer's son wearing the paternal sword. The feud is older than the diplomacy." },
  ],

  // ── Fitts XXXII–XXXV: The dragon appears (chapters 33–36) ──────────
  33: [
    { id: "beo-32-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "What rouses the dragon from its 300-year sleep on the hoard?",
      options: ["Beowulf invades the barrow", "A fleeing slave takes a single golden cup", "Lightning strikes the barrow", "Wiglaf fails a test"],
      correctIndex: 1,
      explanation: "The dragon's wrath is triggered by the *smallest* possible human action — a frightened runaway slave stealing one cup. The poem's doom comes not from a moral adversary but from accident. Time in dragon-shape does the killing." },
    { id: "beo-32-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The dragon, like Grendel, is descended from Cain.",
      correctBool: false,
      explanation: "Grendel and his mother carry Cain's curse; the dragon has no genealogy at all. It is a *force* rather than a cursed creature — ember, hoard-warm, implacable. The poem's evolving monstrosity moves from inherited evil to impersonal fate." },
  ],

  // ── Fitts XXXVI–XXXIX: The dragon fight (chapters 37–40) ──────────
  37: [
    { id: "beo-36-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "How many of Beowulf's twelve picked thanes stay beside him at the dragon fight?",
      options: ["All twelve", "Six", "One (Wiglaf)", "None"],
      correctIndex: 2,
      explanation: "Eleven flee into the woods. Only Wiglaf — the youngest, inexperienced, new to battle — remembers the comitatus bond and runs into the flame to stand with his lord. Tolkien thought this scene the emotional center of the Germanic heroic tradition." },
    { id: "beo-36-2", type: "multiple_choice", difficulty: "Scholar", xpReward: 10,
      text: "Tolkien's controversial term for the heroic pride that may have driven Beowulf to fight the dragon alone is:",
      options: ["*Wyrd*", "*Ofermōd*", "*Dugud*", "*Lof*"],
      correctIndex: 1,
      explanation: "*Ofermōd* — literally 'over-heart,' often translated as 'overweening pride' or 'excess courage.' Tolkien argued (controversially) that Beowulf should not have fought alone, and that his choice was flawed. Not all scholars accept the reading." },
  ],

  // ── Fitts XL–XLIII: Death, funeral, lament (chapters 41–44) ────────
  41: [
    { id: "beo-40-1", type: "multiple_choice", difficulty: "Foundational", xpReward: 5,
      text: "The Geats do what with the dragon's hoard?",
      options: ["Distribute it among the thanes as Beowulf's last gift", "Send it back to the king who originally buried it", "Bury all of it, accursed, in Beowulf's barrow", "Use it to ransom captives from the Swedes"],
      correctIndex: 2,
      explanation: "Unprecedented in the poem's world — gold has circulated lord-to-thane throughout. The buried hoard at the close is the poem's explicit image of a broken economy: the ring-giver is dead, and the rings go back into the earth." },
    { id: "beo-40-2", type: "true_false", difficulty: "Scholar", xpReward: 10,
      text: "The poem ends with a funeral that deliberately echoes its opening funeral of Scyld Scefing.",
      correctBool: true,
      explanation: "Ring composition: Scyld's ship-burial at the start, Beowulf's pyre at the close. The two funerals frame the entire epic and invite the reader to compare the Danish line's founding (mysterious origin, heroic glory) with the Geatish line's ending (grief, prophesied doom)." },
    { id: "beo-40-3", type: "passage_id", difficulty: "Sage", xpReward: 25,
      text: "In his last speech, Beowulf specifically claims that he has not:",
      options: ["Fled from a battle", "Killed his own kin", "Lied under oath", "Refused gold to a deserving warrior"],
      correctIndex: 1,
      explanation: "Kin-slaying is the poem's worst act (it is what Cain did). Beowulf names himself *not* of Cain's lineage in his dying reckoning — ethically the exact opposite of the creatures he has spent his life killing." },
  ],

  // ── Master Trial: 'Hall-Friend' Seal ───────────────────────────────
  45: [
    { id: "beo-master-1", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "Which manuscript tradition does Beowulf survive in, and what nearly destroyed it?",
      options: ["Vercelli Book; a flood in 1640", "Cotton Vitellius A.xv; the 1731 Cotton Library fire", "Exeter Book; Viking raid 897", "Ellesmere MS; the Great Fire of London 1666"],
      correctIndex: 1,
      explanation: "One manuscript, one fire. Cotton Vitellius A.xv was scorched in the 1731 blaze at Ashburnham House; earlier transcripts preserve what the vellum has since flaked away." },
    { id: "beo-master-2", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "J.R.R. Tolkien's 1936 British Academy lecture argued that:",
      options: ["The monsters are regrettable folklore intrusions on serious history", "Beowulf should be rewritten in modern English verse", "The monsters are the poem's true subject — a meditation on mortality", "The manuscript is a forgery"],
      correctIndex: 2,
      explanation: "*Beowulf: The Monsters and the Critics* reversed a century of scholarship. The monsters *are* the poem; Beowulf confronts three figures of what must undo a hero. This reading is now canonical." },
    { id: "beo-master-3", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "Which term names the bond between a Germanic warrior-lord and his retainers?",
      options: ["*Wyrd*", "*Comitatus*", "*Lof*", "*Wergild*"],
      correctIndex: 1,
      explanation: "*Comitatus*: the thanes swear to die with their lord, the lord gives gold and protection. Wiglaf's staying at the dragon fight, against eleven thanes who flee, is the poem's clearest embodiment." },
    { id: "beo-master-4", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "The giants' sword Beowulf finds in Grendel's mother's lair:",
      options: ["Is the heirloom Hrunting returned to its owner", "Kills the mother, then the blade melts in Grendel's venomous blood", "Is cursed and destroys any warrior who wields it", "Is forged on the spot by Wayland the Smith"],
      correctIndex: 1,
      explanation: "Pre-Flood giant-forged; lifted only because Beowulf has the strength of thirty in his grip; dissolves in Grendel's venom after beheading his corpse. Only the runic hilt returns to the surface." },
    { id: "beo-master-5", type: "true_false", difficulty: "Sage", xpReward: 50,
      text: "The poem's first and last scenes are both funerals.",
      correctBool: true,
      explanation: "Scyld Scefing's ship-burial opens the poem; Beowulf's pyre on Hronesness closes it. Ring composition at epic scale — the poem brackets an entire heroic career between graves." },
    { id: "beo-master-6", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "Grendel is described as descended from:",
      options: ["Nimrod", "Cain", "Lucifer", "Esau"],
      correctIndex: 1,
      explanation: "Cain — the biblical first murderer. His curse is inherited; Grendel's monstrosity is not appetite alone but the exile's specific grief. This is why Tolkien says the poem grants Grendel an inner life the Greek monsters never have." },
    { id: "beo-master-7", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "A 'kenning' is:",
      options: ["A formal vow spoken at a feast", "A compressed metaphorical compound — two nouns forming a third meaning", "A legal settlement of a blood-feud", "A kind of Old English rhyme pattern"],
      correctIndex: 1,
      explanation: "*Whale-road* = sea; *bone-house* = body; *ring-giver* = lord. Not decoration — the kenning is how the Old English poet thinks. Hall's translation preserves many literally." },
    { id: "beo-master-8", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "The Beowulf-poet's characters are pre-Christian pagans, but the poet is Christian. This creates:",
      options: ["A theological error that modern editors correct", "A deliberate stylistic tension the poem never fully resolves", "A translator's interpolation that can be stripped out", "Contradictions only apparent in Old English"],
      correctIndex: 1,
      explanation: "The Christian frame on pagan material is the poem's signature layering. Scholarship has gone back and forth for over a century on whether it is coherent or additive; the modern consensus is that the layering is *original* and constitutive." },
    { id: "beo-master-9", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "What triggers the dragon's three-hundred-year rage at the poem's opening of Fitt XXXII?",
      options: ["Beowulf desecrating the barrow", "A fleeing slave taking a single golden cup", "Wiglaf's unsworn vow", "The death of Hygelac"],
      correctIndex: 1,
      explanation: "The hero's end is triggered by the *smallest* human action. Not a moral adversary — a frightened nobody. Time in dragon-shape, not villainy, ends him." },
    { id: "beo-master-10", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "The poem's most formidable adversary, per Tolkien, is:",
      options: ["Grendel", "Grendel's mother", "The dragon", "Unferth"],
      correctIndex: 1,
      explanation: "Tolkien argued Grendel's mother is the more formidable of the two Grendels — precisely because her violence is not monstrous but *lawful* (one life for one in the wergild code). She is the Germanic feud-world meeting an implacable avenger." },
    { id: "beo-master-11", type: "multiple_choice", difficulty: "Sage", xpReward: 50,
      text: "The messenger's prophecy at the poem's close says that, with Beowulf dead:",
      options: ["The Geats will divide the hoard and prosper", "The Franks and Swedes will return to ruin the kingdom", "Heorot will burn", "Wiglaf will rule for sixty years"],
      correctIndex: 1,
      explanation: "The Geatish kingdom dies with its king. The old feuds — contained only by Beowulf's reputation — return. Tolkien called the poem an *elegy*; this moment is why." },
    { id: "beo-master-12", type: "fill_blank", difficulty: "Sage", xpReward: 50,
      text: "The last word of the Old English text praises Beowulf as most eager for ______.",
      correctText: "glory",
      explanation: "*Lof-geornost* — 'most eager for praise/glory.' The hero's last human legacy is the word for the virtue he spent his life pursuing: the reputation that survives death." },
  ],
}
