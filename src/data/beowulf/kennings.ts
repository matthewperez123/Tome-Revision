/**
 * Beowulf kennings index — the compressed metaphorical compounds that
 * saturate Old English heroic poetry. Hall's 1892 translation preserves
 * many kennings literally ("whale-road", "ring-giver", "bone-house"),
 * which makes them discoverable by simple string match.
 *
 * Each entry is a scholarly gloss. First-occurrence tagging is performed
 * by scripts/beowulf/transform-kennings.ts, which scans the line-anchored
 * HTML for the `hallForm` strings and wraps the first match in a
 * <span data-beowulf-kenning="id">...</span> wrapper; the reader renders
 * a hover gloss via the BeowulfEnhancements component.
 *
 * The pedagogical goal (per spec): the reader encounters "whale-road"
 * and learns what it means — we do NOT pre-translate in the main text.
 *
 * Sources for OE forms: Klaeber (Beowulf and the Fight at Finnsburg,
 * 4th ed., 2014); Bosworth-Toller Anglo-Saxon Dictionary.
 */

export type KenningCategory =
  | "sea"
  | "battle"
  | "body"
  | "lord"
  | "sword"
  | "warrior"
  | "ship"
  | "treasure"
  | "hall"
  | "beast"
  | "god"
  | "time"
  | "other"

export interface Kenning {
  id: string
  /** The form as it appears in Hall's translation. Used for tagging. */
  hallForm: string
  /** Alternate surface spellings Hall uses (some compounds split, some vary). */
  alternateForms?: string[]
  /** The Old English compound (with macrons where standard). */
  oldEnglish: string
  /** The literal reading of the compound ("whale's road"). */
  literal: string
  /** What the kenning actually refers to. */
  meaning: string
  /** Thematic category. */
  category: KenningCategory
  /** Extended gloss, two-to-three sentences, shown on tap. */
  note?: string
}

/**
 * 80 high-frequency Beowulf kennings. Selection weighted toward forms
 * a modern reader will actually encounter in Hall's text, with emphasis
 * on the classic six categories (sea, battle, body, lord, sword, warrior).
 */
export const BEOWULF_KENNINGS: Kenning[] = [
  // ── The Sea (~9) ─────────────────────────────────────────────────────
  { id: "whale-road", hallForm: "whale-road", oldEnglish: "hronrād", literal: "whale's road", meaning: "the sea", category: "sea",
    note: "The most famous Old English kenning. Hronrād figures the sea as a highway for the largest creature the poet's culture knew — an early image of the sea as route and not barrier." },
  { id: "swan-road", hallForm: "swan-road", oldEnglish: "swanrād", literal: "swan's road", meaning: "the sea", category: "sea" },
  { id: "sail-road", hallForm: "sail-road", oldEnglish: "seglrād", literal: "sail's road", meaning: "the sea", category: "sea" },
  { id: "gannets-bath", hallForm: "gannets’-bath", alternateForms: ["gannet's bath", "gannets' bath"], oldEnglish: "ganotes bæð", literal: "gannet's bath", meaning: "the sea", category: "sea" },
  { id: "sea-streams", hallForm: "sea-streams", oldEnglish: "sǣstrēamas", literal: "sea-streams", meaning: "the ocean currents", category: "sea" },
  { id: "water-road", hallForm: "water-road", oldEnglish: "wæter-weg", literal: "water-road", meaning: "the sea", category: "sea" },
  { id: "water-way", hallForm: "water-ways", alternateForms: ["water-way"], oldEnglish: "wæter-weg", literal: "water-way", meaning: "the sea", category: "sea" },
  { id: "foam-necked", hallForm: "foamy-necked", alternateForms: ["foam-necked"], oldEnglish: "fāmigheals", literal: "foam-necked", meaning: "the ship, with a neck of foam at the prow", category: "ship" },
  { id: "sea-path", hallForm: "sea-path", oldEnglish: "sǣ-lād", literal: "sea-way", meaning: "a voyage across the sea", category: "sea" },

  // ── Ships (~5) ───────────────────────────────────────────────────────
  { id: "wave-floater", hallForm: "wave-floater", oldEnglish: "ȳþ-lida", literal: "wave-traveller", meaning: "a ship", category: "ship" },
  { id: "sea-wood", hallForm: "sea-wood", oldEnglish: "sǣ-wudu", literal: "sea-wood", meaning: "a ship (a wooden thing that rides the sea)", category: "ship" },
  { id: "ring-stemmed", hallForm: "ring-stemmèd", alternateForms: ["ring-stemmed"], oldEnglish: "hring-stefna", literal: "ring-prowed", meaning: "a ship with a curved prow", category: "ship" },
  { id: "foamy-bark", hallForm: "foamy bark", oldEnglish: "fāmig bāt", literal: "foaming ship", meaning: "a ship moving at speed", category: "ship" },
  { id: "bark-of-atheling", hallForm: "Bark of the atheling", oldEnglish: "æþelinges fær", literal: "nobleman's ship", meaning: "Scyld's funeral ship", category: "ship" },

  // ── Warriors and battle (~15) ────────────────────────────────────────
  { id: "shield-warrior", hallForm: "shield-warrior", oldEnglish: "lind-wiga", literal: "linden-fighter", meaning: "a warrior (identified by his shield, made of linden-wood)", category: "warrior" },
  { id: "spear-warrior", hallForm: "spear-warrior", oldEnglish: "gār-wiga", literal: "spear-fighter", meaning: "a warrior", category: "warrior" },
  { id: "battle-friend", hallForm: "battle-friend", oldEnglish: "heaðu-wine", literal: "battle-friend", meaning: "a sword (your friend in battle)", category: "sword" },
  { id: "ring-warrior", hallForm: "ring-warrior", oldEnglish: "hring-ðegn", literal: "ring-thane", meaning: "a retainer, one who receives gold rings from his lord", category: "warrior" },
  { id: "war-gear", hallForm: "war-gear", oldEnglish: "gūð-gewǣde", literal: "war-garment", meaning: "armor", category: "battle" },
  { id: "battle-gear", hallForm: "battle-gear", oldEnglish: "beadu-gewǣde", literal: "battle-clothing", meaning: "armor", category: "battle" },
  { id: "war-shirt", hallForm: "war-shirt", oldEnglish: "heaðu-serc", literal: "battle-shirt", meaning: "a mail-coat", category: "battle" },
  { id: "battle-sark", hallForm: "battle-sark", alternateForms: ["battle-sarks"], oldEnglish: "beado-serc", literal: "battle-shirt", meaning: "a mail-coat", category: "battle" },
  { id: "linden-wood", hallForm: "linden-wood", alternateForms: ["linden"], oldEnglish: "lind", literal: "linden (tree)", meaning: "a shield (made of linden-wood)", category: "battle" },
  { id: "helm-bearer", hallForm: "helm-bearer", oldEnglish: "helm-berend", literal: "helmet-bearer", meaning: "a warrior", category: "warrior" },
  { id: "war-friend", hallForm: "war-friend", oldEnglish: "wīg-wine", literal: "war-friend", meaning: "a sword (comrade in combat)", category: "sword" },
  { id: "shield-bearer", hallForm: "shield-bearer", oldEnglish: "bord-hæbbend", literal: "board-bearer", meaning: "a warrior", category: "warrior" },
  { id: "war-wolf", hallForm: "war-wolf", oldEnglish: "here-wulf", literal: "army-wolf", meaning: "a fierce warrior", category: "warrior" },
  { id: "battle-bill", hallForm: "battle-bill", oldEnglish: "hilde-bill", literal: "battle-blade", meaning: "a sword", category: "sword" },
  { id: "battle-board", hallForm: "battle-board", oldEnglish: "beadu-bord", literal: "battle-plank", meaning: "a shield", category: "battle" },

  // ── Swords (~9) ──────────────────────────────────────────────────────
  { id: "war-sword", hallForm: "war-sword", oldEnglish: "heaðu-sweord", literal: "battle-sword", meaning: "a sword named for its use in war", category: "sword" },
  { id: "bill", hallForm: "bill", oldEnglish: "bill", literal: "blade", meaning: "a sword — Hall's favored short form, used at many peak moments", category: "sword",
    note: "Hall uses 'bill' for sword more than any other word. In Old English, bill is the everyday word for the blade — blunt, unadorned, martial." },
  { id: "blade", hallForm: "blade", oldEnglish: "ord", literal: "edge", meaning: "a sword", category: "sword" },
  { id: "giant-sword", hallForm: "giant-sword", oldEnglish: "eoten-sweord", literal: "giant's sword", meaning: "the ancient weapon from the mere that kills Grendel's mother", category: "sword",
    note: "An actual plot object: the sword on the wall of the underwater hall, forged by giants before the Flood. Beowulf uses it to behead the mother; the blade melts in the hot blood." },
  { id: "byrnie", hallForm: "byrnie", alternateForms: ["byrnies"], oldEnglish: "byrne", literal: "mail-coat", meaning: "chain-mail armor", category: "battle" },
  { id: "battle-sark", hallForm: "battle-sark", alternateForms: ["battle-sarks"], oldEnglish: "beado-serc", literal: "battle-shirt", meaning: "a mail-coat", category: "battle" },
  { id: "war-shield", hallForm: "war-shield", oldEnglish: "wīg-bord", literal: "battle-board", meaning: "a shield carried into battle", category: "battle" },
  { id: "helm-bearer", hallForm: "Helm-bearer", alternateForms: ["helm-bearer"], oldEnglish: "helm-berend", literal: "helmet-bearer", meaning: "a warrior", category: "warrior" },

  // ── The body (~6) ────────────────────────────────────────────────────
  { id: "bone-house", hallForm: "bone-house", oldEnglish: "bān-hūs", literal: "bone-house", meaning: "the body (as dwelling of the soul)", category: "body",
    note: "The body as the soul's temporary shelter. A Christian overlay on older Germanic material: the bone-house is rented, not owned." },
  { id: "life-house", hallForm: "life-house", oldEnglish: "līf-hūs", literal: "life-house", meaning: "the body", category: "body" },
  { id: "bone-cave", hallForm: "bone-cave", oldEnglish: "bān-cofa", literal: "bone-chamber", meaning: "the body", category: "body" },
  { id: "bone-locker", hallForm: "bone-locker", oldEnglish: "bān-loca", literal: "bone-enclosure", meaning: "the body", category: "body" },
  { id: "breast-hoard", hallForm: "breast-hoard", oldEnglish: "brēost-hord", literal: "breast-treasure", meaning: "the innermost thoughts, the heart's secret contents", category: "body",
    note: "The mind and emotions figured as a treasury guarded inside the chest. A kenning that anticipates the Christian idea of the heart-as-vault." },
  { id: "word-hoard", hallForm: "word-hoard", oldEnglish: "word-hord", literal: "word-treasury", meaning: "one's vocabulary or stock of speech, to be unlocked in discourse", category: "body" },

  // ── Lords and rulership (~10) ────────────────────────────────────────
  { id: "ring-giver", hallForm: "ring-giver", oldEnglish: "bēag-gyfa", literal: "ring-giver", meaning: "a lord (who distributes gold rings to his retainers)", category: "lord",
    note: "The central social metaphor of the Germanic hall: the lord's virtue is measured by his generosity. Ring-gifts seal the comitatus bond between lord and thane." },
  { id: "gold-friend", hallForm: "gold-friend", oldEnglish: "gold-wine", literal: "gold-friend", meaning: "a generous lord", category: "lord" },
  { id: "gold-lord", hallForm: "gold-lord", oldEnglish: "gold-hlāford", literal: "gold-lord", meaning: "a generous lord", category: "lord" },
  { id: "folk-king", hallForm: "folk-king", oldEnglish: "folc-cyning", literal: "people's king", meaning: "a king (ruling by the people's consent)", category: "lord" },
  { id: "earl-friend", hallForm: "earl-friend", oldEnglish: "eorl-wine", literal: "noble-friend", meaning: "a lord of the warrior-aristocracy", category: "lord" },
  { id: "helm-of-peoples", hallForm: "helm of peoples", alternateForms: ["helm of the people"], oldEnglish: "folces helm", literal: "people's protector", meaning: "a king (the head/helmet of his people)", category: "lord" },
  { id: "scylding", hallForm: "Scylding", alternateForms: ["Scyldings", "shielding"], oldEnglish: "Scylding", literal: "descendant of Scyld", meaning: "a Dane of the royal Scylding line; by extension, a Dane", category: "lord" },
  { id: "lord-of-heroes", hallForm: "lord of heroes", oldEnglish: "hæleð-hlāford", literal: "lord of warriors", meaning: "a king", category: "lord" },
  { id: "war-lord", hallForm: "war-lord", oldEnglish: "hilde-frēa", literal: "battle-lord", meaning: "a king in war", category: "lord" },
  { id: "treasure-ward", hallForm: "treasure-ward", oldEnglish: "sinc-weard", literal: "treasure-guardian", meaning: "a lord (who guards the hoard he redistributes)", category: "lord" },

  // ── Hall and treasure (~8) ───────────────────────────────────────────
  { id: "mead-bench", hallForm: "mead-bench", alternateForms: ["mead-benches"], oldEnglish: "medu-benc", literal: "mead-bench", meaning: "the bench in the mead-hall (by metonymy, the community of drinkers)", category: "hall" },
  { id: "mead-hall", hallForm: "mead-hall", oldEnglish: "medu-heall", literal: "mead-hall", meaning: "the lord's great hall where retainers feast and sleep", category: "hall" },
  { id: "gold-hall", hallForm: "gold-hall", oldEnglish: "gold-sele", literal: "gold-hall", meaning: "a lord's hall, resplendent with gifted gold", category: "hall" },
  { id: "wine-hall", hallForm: "wine-hall", oldEnglish: "wīn-sele", literal: "wine-hall", meaning: "the mead-hall", category: "hall" },
  { id: "guest-hall", hallForm: "guest-hall", oldEnglish: "gæst-sele", literal: "guest-hall", meaning: "a hall that welcomes strangers", category: "hall" },
  { id: "ring-hall", hallForm: "ring-hall", oldEnglish: "hring-sele", literal: "ring-hall", meaning: "a hall where the lord distributes rings", category: "hall" },
  { id: "earth-hall", hallForm: "earth-hall", oldEnglish: "eorð-sele", literal: "earth-hall", meaning: "the dragon's barrow; a burial-mound", category: "treasure" },
  { id: "gold-hoard", hallForm: "gold-hoard", oldEnglish: "gold-hord", literal: "gold-treasury", meaning: "buried or guarded treasure, especially the dragon's hoard", category: "treasure" },

  // ── Dragon, beast, and monster (~6) ──────────────────────────────────
  { id: "hoard-guard", hallForm: "hoard-ward", alternateForms: ["hoard-warden", "Hoard-ward"], oldEnglish: "hord-weard", literal: "hoard-guardian", meaning: "the dragon (the creature defined by its watch over treasure)", category: "beast" },
  { id: "air-goer", hallForm: "air-goer", oldEnglish: "lyft-floga", literal: "air-flyer", meaning: "the dragon, who moves through the sky", category: "beast" },
  { id: "fire-drake", hallForm: "fire-drake", oldEnglish: "fȳr-draca", literal: "fire-dragon", meaning: "the barrow-wyrm of the poem's final third", category: "beast" },
  { id: "earth-dragon", hallForm: "earth-dragon", alternateForms: ["earth-drake"], oldEnglish: "eorð-draca", literal: "earth-dragon", meaning: "the barrow-wyrm, who lives underground", category: "beast" },
  { id: "night-fiend", hallForm: "night-fiend", alternateForms: ["night-goer", "night-comer"], oldEnglish: "niht-gengel", literal: "night-creature", meaning: "Grendel, prowling in darkness", category: "beast" },
  { id: "march-stepper", hallForm: "march-stepper", alternateForms: ["mark-stepper", "border-walker"], oldEnglish: "mearc-stapa", literal: "march-walker", meaning: "Grendel, a creature of the borderlands and wastes", category: "beast" },

  // ── God, time, and fate (~6) ─────────────────────────────────────────
  { id: "all-father", hallForm: "All-Father", oldEnglish: "al-fæder", literal: "All-Father", meaning: "God the Father (Christian overlay on Woden-vocabulary)", category: "god" },
  { id: "wielder-of-glory", hallForm: "Wielder of Glory", oldEnglish: "Wuldres Wealdend", literal: "Glory's Wielder", meaning: "God, as giver and withdrawer of honor", category: "god" },
  { id: "all-ruler", hallForm: "All-Ruler", oldEnglish: "ealwealda", literal: "All-Ruler", meaning: "God", category: "god" },
  { id: "all-wielder", hallForm: "All-Wielder", oldEnglish: "Ealwealdend", literal: "All-Wielder", meaning: "God", category: "god" },
  { id: "welkin", hallForm: "welkin", oldEnglish: "wolcen", literal: "clouds", meaning: "the sky", category: "time" },
  { id: "sky-candle", hallForm: "heaven's candle", alternateForms: ["sky-candle"], oldEnglish: "heofones candel", literal: "heaven's candle", meaning: "the sun", category: "time" },

  // ── People and kinship (~6) ──────────────────────────────────────────
  { id: "kin-of-men", hallForm: "kin of men", alternateForms: ["kinsman"], oldEnglish: "ælda cynn", literal: "men's kindred", meaning: "humankind", category: "other" },
  { id: "earth-dwellers", hallForm: "earth-dwellers", oldEnglish: "eorð-būend", literal: "earth-dwellers", meaning: "human beings", category: "other" },
  { id: "sons-of-men", hallForm: "sons of men", oldEnglish: "ylda bearn", literal: "children of elders", meaning: "humans", category: "other" },
  { id: "atheling", hallForm: "atheling", alternateForms: ["athelings"], oldEnglish: "æþeling", literal: "nobleman", meaning: "a prince of royal blood", category: "other" },
  { id: "scop", hallForm: "scop", oldEnglish: "scop", literal: "poet/singer", meaning: "the court poet who composes in the alliterative mode", category: "other" },
  { id: "thane", hallForm: "thane", alternateForms: ["thanes"], oldEnglish: "þegn", literal: "retainer", meaning: "a warrior bound to a lord in the comitatus relationship", category: "other" },
]

export const BEOWULF_KENNINGS_BY_ID = new Map(
  BEOWULF_KENNINGS.map((k) => [k.id, k])
)

export function kenningCategoryLabel(c: KenningCategory): string {
  const labels: Record<KenningCategory, string> = {
    sea: "The sea",
    ship: "Ships",
    battle: "Battle and armor",
    body: "The body",
    lord: "Lord and rulership",
    sword: "Swords",
    warrior: "Warriors",
    hall: "The mead-hall",
    treasure: "Treasure and hoard",
    beast: "Monsters",
    god: "God",
    time: "Time and sky",
    other: "Other",
  }
  return labels[c] ?? c
}
