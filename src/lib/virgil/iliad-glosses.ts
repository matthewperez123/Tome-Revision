/**
 * Iliad glosses — single-sentence tap-to-reveal definitions for William
 * Cullen Bryant's 1870 blank-verse translation (Standard Ebooks).
 *
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify (one sentence, on hover/tap).
 *
 * Coverage priorities:
 *
 *   1. Divine names — Greek and Roman — since Bryant uses both
 *      interchangeably (*Jove* for Zeus, *Latona* for Leto, *Phoebus*
 *      for Apollo). Readers of the Odyssey or Aeneid arriving here need
 *      identification.
 *   2. Major Greek and Trojan heroes — Achilles, Hector, Agamemnon,
 *      Menelaus, Odysseus/Ulysses, Ajax, Diomedes, Priam, Paris,
 *      Sarpedon, Patroclus, Nestor — with their epithets where
 *      characteristic.
 *   3. Place names — Troy / Ilion, the Scamander, the Hellespont, Argos,
 *      Sparta, Pylos, Phthia, Lycia, Thrace.
 *   4. Battlefield and ritual vocabulary — *xenia*, *geras*, *mēnis*,
 *      greave, spear, aegis, Panoply.
 *   5. Bryant-specific archaisms — *puissant*, *doughty*, *smote* — and
 *      19th-century formalisms.
 *
 * Phrase-matching: `phrase` must appear verbatim in the rendered HTML.
 * Bryant's text uses smooth 19th-century English; curly apostrophes are
 * normalized by the reader, so plain ASCII anchors work in most cases.
 * Short proper-name phrases match most reliably across verse-line breaks.
 *
 * `chapterIndex === -1` is a cross-book gloss — first occurrence per
 * chapter is decorated by the reader.
 */

export interface IliadGloss {
  /** Chapter index in public/content/the-iliad/ — 0=Preface, 1=Book I, ..., 24=Book XXIV. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const ILIAD_GLOSSES: IliadGloss[] = [

  // ── Cross-book: divine names ─────────────────────────────────────
  { chapterIndex: -1, phrase: "Jove",
    definition: "Roman name Bryant uses for Zeus — king of the gods, father of Sarpedon and (in some traditions) of Helen; his decree determines the Trojan War's outcome." },
  { chapterIndex: -1, phrase: "Juno",
    definition: "Roman name for Hera, wife of Zeus, patron of Argos and Mycenae — her hatred of Troy (from the Judgment of Paris) drives the Greek cause." },
  { chapterIndex: -1, phrase: "Minerva",
    definition: "Roman name for Athena — goddess of wisdom and strategic warfare; Achilles's and Odysseus's divine sponsor, she restrains Achilles in Book I and guides the Greek council." },
  { chapterIndex: -1, phrase: "Phoebus",
    definition: "Epithet of Apollo (*Phoibos*, 'radiant') — the god of prophecy, plague, and the bow; patron of Troy, whose arrows kill at a distance (he strikes down the Greek camp in Book I, Patroclus in Book XVI)." },
  { chapterIndex: -1, phrase: "Latona",
    definition: "Roman name for Leto, mother of Apollo and Artemis by Zeus — when Bryant says *Latona's son*, he means Apollo." },
  { chapterIndex: -1, phrase: "Mars",
    definition: "Roman name for Ares, god of brutal war — sided with Troy but is wounded by Diomedes with Athena's help in Book V." },
  { chapterIndex: -1, phrase: "Venus",
    definition: "Roman name for Aphrodite, goddess of erotic love — mother of Aeneas by Anchises, patron of Paris and the Trojans." },
  { chapterIndex: -1, phrase: "Neptune",
    definition: "Roman name for Poseidon, god of the sea and earthquakes — sided with the Greeks, held a grudge against Troy from Laomedon's cheat over the walls." },
  { chapterIndex: -1, phrase: "Vulcan",
    definition: "Roman name for Hephaestus, the divine smith — lame, crippled at birth by Hera; forges Achilles's new armor in Book XVIII." },
  { chapterIndex: -1, phrase: "Mercury",
    definition: "Roman name for Hermes, messenger of the gods — guides Priam through the Greek camp in Book XXIV." },
  { chapterIndex: -1, phrase: "Diana",
    definition: "Roman name for Artemis, Apollo's sister — patron of the hunt and of chastity; sided with Troy as Apollo's twin." },
  { chapterIndex: -1, phrase: "Thetis",
    definition: "Sea-nymph mother of Achilles, forced to marry the mortal Peleus — her plea to Zeus in Book I drives the plot of the first half of the poem." },
  { chapterIndex: -1, phrase: "Iris",
    definition: "Goddess of the rainbow, messenger of the gods — Bryant uses her name when Zeus sends a swift female divine errand (contrast: Hermes for the grave diplomatic mission in Book XXIV)." },

  // ── Cross-book: major Greek heroes ───────────────────────────────
  { chapterIndex: -1, phrase: "Peleus' son",
    definition: "Achilles — son of the mortal Peleus and the sea-nymph Thetis; the greatest warrior of the Greek side." },
  { chapterIndex: -1, phrase: "Atrides",
    definition: "Son of Atreus — usually Agamemnon (rarely Menelaus); Bryant uses the patronymic as a formal name for the commander of the Greek host." },
  { chapterIndex: -1, phrase: "Ulysses",
    definition: "Roman name for Odysseus, king of Ithaca — the cleverest of the Greek commanders, whose tongue is as effective as his sword. Hero of the Odyssey." },
  { chapterIndex: -1, phrase: "Ajax",
    definition: "Called the 'Greater Ajax' (son of Telamon) to distinguish from the Locrian Ajax — the largest warrior on the Greek side, a wall-like defender of the ships in Book XV." },
  { chapterIndex: -1, phrase: "Diomedes",
    definition: "King of Argos, son of Tydeus — the Greek hero of Book V ('the aristeia of Diomedes'), who wounds both Aphrodite and Ares with Athena's help." },
  { chapterIndex: -1, phrase: "Nestor",
    definition: "Aged king of Pylos — counselor to the Greek command, given to nostalgic battle speeches; his authority rests on age rather than arms." },
  { chapterIndex: -1, phrase: "Menelaus",
    definition: "King of Sparta, Agamemnon's brother — husband of Helen whose abduction (or elopement) precipitated the war." },
  { chapterIndex: -1, phrase: "Patroclus",
    definition: "Achilles's companion, foster-brother, and dearest friend; his death in Book XVI drives Achilles back into battle." },
  { chapterIndex: -1, phrase: "Myrmidons",
    definition: "Achilles's personal contingent from Phthia — the name (*myrmex*, ant) suggests disciplined collective action; Patroclus leads them out in Book XVI." },

  // ── Cross-book: Trojans ─────────────────────────────────────────
  { chapterIndex: -1, phrase: "Hector",
    definition: "Eldest son of Priam and Hecuba — the chief Trojan warrior and the city's defender; husband of Andromache, father of Astyanax." },
  { chapterIndex: -1, phrase: "Priam",
    definition: "King of Troy, father of Hector and Paris (and fifty other sons) — his night visit to Achilles's tent in Book XXIV is the poem's climactic scene." },
  { chapterIndex: -1, phrase: "Paris",
    definition: "Son of Priam, brother of Hector; abducted Helen from Sparta (or received her as the Judgment of Paris's prize). Known also as *Alexander* in some passages." },
  { chapterIndex: -1, phrase: "Helen",
    definition: "Wife of Menelaus, carried away to Troy by Paris — nominal cause of the war. Bryant's Helen is more self-aware than the cliché; her laments acknowledge her own role." },
  { chapterIndex: -1, phrase: "Andromache",
    definition: "Hector's wife, daughter of the Eetion Achilles has killed; her farewell at the Scaean Gate in Book VI is the Iliad's most piercing domestic scene." },
  { chapterIndex: -1, phrase: "Astyanax",
    definition: "Infant son of Hector and Andromache — whose name means 'city-lord'; he is frightened of his father's helmet-crest in Book VI." },
  { chapterIndex: -1, phrase: "Aeneas",
    definition: "Son of Anchises and Aphrodite — a Trojan warrior of the royal house; he survives Troy's fall and becomes the hero of Virgil's Aeneid." },
  { chapterIndex: -1, phrase: "Sarpedon",
    definition: "Son of Zeus, king of the Lycians fighting for Troy — his death in Book XVI by Patroclus's spear triggers Zeus's tears of blood." },
  { chapterIndex: -1, phrase: "Glaucus",
    definition: "Lycian warrior, Sarpedon's friend — the scene of his exchange of armor with Diomedes in Book VI contains the famous *generations of leaves* simile." },
  { chapterIndex: -1, phrase: "Hecuba",
    definition: "Queen of Troy, wife of Priam, mother of Hector and Paris — her laments over Hector's body are among the Iliad's most anguished speeches." },
  { chapterIndex: -1, phrase: "Cassandra",
    definition: "Daughter of Priam, gifted with prophecy by Apollo but cursed to be disbelieved — appears briefly to recognize Priam's return with Hector's body." },

  // ── Cross-book: place names ──────────────────────────────────────
  { chapterIndex: -1, phrase: "Troy",
    definition: "Also called Ilion (*Ilios*) — the great Trojan city, whose ten-year siege is the subject of the Iliad. The historical site is modern Hisarlık in northwest Turkey." },
  { chapterIndex: -1, phrase: "Argos",
    definition: "City in the northeast Peloponnese, the kingdom of Diomedes; by extension (*Argives*), a common Homeric name for the Greeks generally." },
  { chapterIndex: -1, phrase: "Argives",
    definition: "The Greeks — strictly the people of Argos, used Homerically as one of three common collective names (with *Achaeans* and *Danaans*)." },
  { chapterIndex: -1, phrase: "Achaean",
    definition: "Greek (from the region of Achaea in the northern Peloponnese) — Homer's most common collective term for the Greek invaders." },
  { chapterIndex: -1, phrase: "Danaan",
    definition: "Greek — a third Homeric collective name, from Danaus the legendary Greek ancestor. Use of all three names (Argives, Achaeans, Danaans) is one of Homer's formulaic resources." },
  { chapterIndex: -1, phrase: "Phthia",
    definition: "Achilles's home region in southern Thessaly — the kingdom he left to join the war and longs to return to (and will, only as a corpse, after his death at Troy)." },
  { chapterIndex: -1, phrase: "Pylos",
    definition: "Nestor's kingdom in the southwest Peloponnese — visited by Telemachus in Odyssey III looking for news of Odysseus." },
  { chapterIndex: -1, phrase: "Ithaca",
    definition: "Odysseus's small mountainous kingdom in the Ionian sea — setting of the Odyssey's homecoming. In the Iliad, merely identified as his home; he has been away ten years when the war begins to end." },
  { chapterIndex: -1, phrase: "Lycia",
    definition: "Region of southwest Anatolia (modern Turkey) — home of Sarpedon and Glaucus, Trojan allies." },
  { chapterIndex: -1, phrase: "Olympus",
    definition: "Mountain in northern Thessaly, home of the twelve Olympian gods — whose debates about the war run parallel to the human action throughout the poem." },
  { chapterIndex: -1, phrase: "Hellespont",
    definition: "The strait (modern Dardanelles) separating Europe from Asia, just north of Troy — where the Greek ships are beached for the duration of the siege." },
  { chapterIndex: -1, phrase: "Scamander",
    definition: "River flowing past Troy (also called *Xanthus* when spoken of as a god); it floods in Book XXI, rising in rage against Achilles for choking its waters with Trojan corpses." },

  // ── Cross-book: battlefield and ritual vocabulary ────────────────
  { chapterIndex: -1, phrase: "wrath",
    definition: "Bryant's translation of Greek *mēnis* — a particular word reserved for cosmic-level anger (of gods, and of heroes acting beyond ordinary human scale); the first word of the Iliad names Achilles's wrath as its subject." },
  { chapterIndex: -1, phrase: "fillets",
    definition: "Woolen bands wound around a priestly staff or garland — the visible sign of ritual protection; Chryses carries Apollo's fillets in Book I as a mark of his priestly office." },
  { chapterIndex: -1, phrase: "greave",
    definition: "Armor covering the front of the shin from ankle to knee — Homeric heroes are formulaically called *euknēmides* (well-greaved)." },
  { chapterIndex: -1, phrase: "aegis",
    definition: "The magical goatskin shield carried by Zeus and lent to Athena — fringed with snakes, bearing the Gorgon's head; a sign of divine terror that puts armies to flight." },
  { chapterIndex: -1, phrase: "corselet",
    definition: "Body armor — a rigid breastplate and back-plate joined at the sides, worn over a linen underlayer; Bryant uses *corselet* where modern translations use *cuirass* or *breastplate*." },
  { chapterIndex: -1, phrase: "libation",
    definition: "Ritual pouring of wine (or other liquid) onto the ground or into a fire as an offering to a god — the standard opening gesture of any formal prayer or feast." },
  { chapterIndex: -1, phrase: "hecatomb",
    definition: "A sacrifice of a hundred oxen — by Homer's time, any large public sacrifice; distinguished from the ordinary domestic sacrifice by its civic scale." },
  { chapterIndex: -1, phrase: "shades",
    definition: "The insubstantial souls of the dead — Homer's dead are *eidōla*, images; they can be seen and spoken to but not embraced. The full Homeric account of the afterlife is in Odyssey XI." },

  // ── Cross-book: Bryant's archaisms ───────────────────────────────
  { chapterIndex: -1, phrase: "puissant",
    definition: "Powerful, mighty — a Bryant-era poeticism from Old French *poissant*; applied to warriors' arms and to divinities' authority." },
  { chapterIndex: -1, phrase: "doughty",
    definition: "Valiant, formidable — a Middle English survival Bryant uses as a slightly elevated synonym for 'brave'." },
  { chapterIndex: -1, phrase: "smote",
    definition: "Past tense of *smite* — to strike with great force; Bryant's standard battlefield verb for a decisive blow." },

  // ── Book I specific ────────────────────────────────────────────
  { chapterIndex: 1, phrase: "Chryses",
    definition: "Priest of Apollo at the town of Chryse near Troy — father of Chryseis; his daughter's seizure and his priestly supplication in Book I trigger the plague." },
  { chapterIndex: 1, phrase: "Chryseis",
    definition: "Daughter of Chryses, taken as Agamemnon's war-prize — returned to her father after Apollo's plague; her return forces Agamemnon to claim Briseis in her place." },
  { chapterIndex: 1, phrase: "Briseis",
    definition: "Achilles's war-prize (a *geras* given to him by the army) — Agamemnon's seizure of her in Book I is the public insult that triggers Achilles's withdrawal." },
  { chapterIndex: 1, phrase: "Calchas",
    definition: "Greek seer attached to the army — reveals that Apollo's plague is punishment for Agamemnon's treatment of Chryses." },

  // ── Book VI specific ────────────────────────────────────────────
  { chapterIndex: 6, phrase: "Scaean",
    definition: "The Scaean Gate — the western gate of Troy facing the Greek ships; site of Hector's farewell to Andromache in Book VI and of Achilles's death (foretold) in Book XXII." },

  // ── Book XVI specific ──────────────────────────────────────────
  { chapterIndex: 16, phrase: "Automedon",
    definition: "Achilles's charioteer; after Patroclus's death, he continues driving the Myrmidon chariot." },

  // ── Book XXII specific ─────────────────────────────────────────
  { chapterIndex: 22, phrase: "Deiphobus",
    definition: "Son of Priam, brother of Hector — the form Athena takes in Book XXII to trick Hector into standing to fight Achilles." },

  // ── Book XXIV specific ─────────────────────────────────────────
  { chapterIndex: 24, phrase: "Argicide",
    definition: "Epithet of Hermes (Greek *Argeiphontes*, 'slayer of Argus')  — refers to Hermes's killing of the hundred-eyed Argus who guarded Io; Bryant uses it as a formal title in Book XXIV's ransom scene." },
]

/** Per-chapter filter used by the reader overlay; includes cross-book entries. */
export function getIliadGlossesForChapter(chapterIndex: number): IliadGloss[] {
  return ILIAD_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
