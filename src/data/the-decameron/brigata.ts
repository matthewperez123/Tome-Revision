/**
 * The Brigata — the ten young Florentines who flee plague-struck Florence
 * to a countryside villa and tell the hundred tales of the Decameron.
 *
 * Seven women and three men, aged (as Boccaccio's Proem to Day I has it)
 * between eighteen and twenty-eight. Boccaccio assigns each a name whose
 * etymology encodes the narrator's role in the work. The reader who
 * follows the frame closely comes to know the ten as distinct voices; the
 * purpose of the signature color palette below is to make that
 * recognition visual — every tale header, every attribution, every entry
 * in the narrator tracker uses its narrator's color consistently across
 * all 122 chapters.
 *
 * Palette notes: the ten hues are spread across indigo–rose–gold–teal–
 * violet so no two narrators collide at a glance; saturation and
 * luminance pick up each narrator's textual temperament (Dioneo hottest
 * in violet, Filostrato darkest in crimson, Neifile palest in rose-gold).
 * Boccaccio-as-author (Proem, Day IV Introduction, Author's Conclusion)
 * is rendered as a separate "voice-out-of-frame" in warm amber, not as
 * one of the ten.
 */

export type BrigataId =
  | "pampinea"
  | "filomena"
  | "neifile"
  | "filostrato"
  | "fiammetta"
  | "elisa"
  | "dioneo"
  | "lauretta"
  | "emilia"
  | "pamfilo"

/** The Author's voice, used for the Proem, Day IV Introduction, and Conclusion. */
export const AUTHOR_VOICE_ID = "boccaccio-author" as const
export type AuthorVoiceId = typeof AUTHOR_VOICE_ID

export type VoiceId = BrigataId | AuthorVoiceId

export interface BrigataMember {
  id: BrigataId
  name: string
  /** Seven women, three men. */
  gender: "F" | "M"
  /** Hex signature color used everywhere this narrator appears. */
  color: string
  /** A slightly darker variant for dark-mode text contrast. */
  colorDark: string
  /** Etymology of the name in Boccaccio's Italian. */
  etymology: string
  /** One-line editorial description used on the Brigata page and tracker. */
  oneLiner: string
  /** Days this narrator rules (0-indexed days 1–10 as 1–10). */
  rulesDay: number | null
  /** Longer voice description used on the Brigata Who's Who page. */
  voiceNote: string
}

export const BRIGATA: Record<BrigataId, BrigataMember> = {
  pampinea: {
    id: "pampinea",
    name: "Pampinea",
    gender: "F",
    color: "#B8860B",
    colorDark: "#D4A04C",
    etymology: "from Latin *pampineus* — 'flourishing, vine-clad'; the vigorous one.",
    oneLiner: "The eldest of the seven ladies and the company's first queen; she is the organizer and instigator whose resolve in Santa Maria Novella gets the brigata out of plague-Florence and into the hills.",
    rulesDay: 1,
    voiceNote: "Pampinea opens the whole work — not Boccaccio. Her speech in the plague-struck church of Santa Maria Novella is the founding act of the frame; without her, the Decameron does not happen. She rules Day I (free theme) and closes that day with the tale of Master Alberto of Bologna in love, a study of dignified desire that sets the collection's emotional temperature. Her voice is measured, rhetorical, senior.",
  },
  filomena: {
    id: "filomena",
    name: "Filomena",
    gender: "F",
    color: "#BE185D",
    colorDark: "#EC4899",
    etymology: "from Greek — 'lover of song'; Boccaccio had used the name for the dedicatee of his earlier *Filostrato*.",
    oneLiner: "The lady who proposes that a king or queen be elected each day to govern; she rules Day II and tells the story of Bernabò of Genoa — the tale Shakespeare would later turn into *Cymbeline*.",
    rulesDay: 2,
    voiceNote: "Filomena's structural contribution is to convert Pampinea's spontaneous escape into ordered form — she is the one who insists the company be governed. As queen of Day II she sets the theme of Fortune's reversals ending well: a theme of pattern, of things that come round. Her voice favors the well-made story.",
  },
  neifile: {
    id: "neifile",
    name: "Neifile",
    gender: "F",
    color: "#F472B6",
    colorDark: "#FBCFE8",
    etymology: "Italian *neofila* — 'new in love'; the one most recently wounded.",
    oneLiner: "The youngest and most modest of the seven; queen of Day III (industry and recovery). She tells the tale of Giletta of Narbonne which becomes the plot of Shakespeare's *All's Well That Ends Well*.",
    rulesDay: 3,
    voiceNote: "Neifile blushes more than the others and Boccaccio makes a point of her youth. The tales she tells are not innocent, though — III.9 (Giletta) is a bed-trick tale, and VIII.1 is a merchant's fraud. The tension between her demure surface and the tales she willingly tells is part of Boccaccio's design: modesty and desire are not opposites in the Decameron.",
  },
  filostrato: {
    id: "filostrato",
    name: "Filostrato",
    gender: "M",
    color: "#8B1A1A",
    colorDark: "#DC2626",
    etymology: "from Greek — 'vanquished by love' (the name Boccaccio had given the hero of his own *Filostrato*, an earlier verse romance of Troilus).",
    oneLiner: "The melancholy lover of the three men; king of Day IV, for which he dictates the darkest theme of all — love stories ending in tragedy.",
    rulesDay: 4,
    voiceNote: "When Filostrato takes the crown on the evening of Day III, he announces that the next day's tales will end unhappily: he wants his own pain mirrored in every voice of the company. Day IV is the result, and it is the work's emotional low point. His tragic-lover identity is programmatic — he always tells the tale the day's theme most demands, never the one most surprising. The only narrator who arrives with an agenda.",
  },
  fiammetta: {
    id: "fiammetta",
    name: "Fiammetta",
    gender: "F",
    color: "#DC2626",
    colorDark: "#F87171",
    etymology: "Italian — 'little flame'; Boccaccio's pseudonym for a woman he had loved, the addressee of several earlier works.",
    oneLiner: "Boccaccio's own beloved under the name he gave her elsewhere; queen of Day V (love tales ending well). She tells Tancredi and Ghismonda (IV.1) and Federigo's Falcon (V.9), two of the work's four or five greatest tales.",
    rulesDay: 5,
    voiceNote: "Fiammetta is the only narrator who is already a character in Boccaccio's earlier books — the *Elegia di Madonna Fiammetta*, the *Filocolo*, the *Amorosa visione* — and the autobiographical weight is felt every time she speaks. She reigns on Day V, answering Filostrato's tragic day with a day of reconciliation and survival. Her signature tale is Ghismonda's defense of natural love (IV.1), one of the most eloquent speeches given to any woman in medieval European literature.",
  },
  elisa: {
    id: "elisa",
    name: "Elisa",
    gender: "F",
    color: "#0D9488",
    colorDark: "#14B8A6",
    etymology: "the Phoenician name of Dido, queen of Carthage — the spurned lover who burns herself in Virgil's *Aeneid* IV.",
    oneLiner: "Named for Dido; queen of Day VI (witty ripostes). Her tales often turn on the sting of a wounded word. (Payne spells her 'Elisa'; scholarly editions use 'Elissa'.)",
    rulesDay: 6,
    voiceNote: "Elisa is the sharpest of the seven. The name connects her to tragic love (Virgil's Dido — Elissa was Dido's other name) but her day — the short sixth — is the lightest: ten tales of quick wit, every one turning on a single ready reply. She tells the brief and beautiful VI.9 (Guido Cavalcanti's riposte in the cemetery), the tale that honors the Florentine poet whose father sits in Dante's *Inferno* X. (Payne spells her 'Elisa'; scholarly editions use 'Elissa'.)",
  },
  dioneo: {
    id: "dioneo",
    name: "Dioneo",
    gender: "M",
    color: "#7C3AED",
    colorDark: "#A78BFA",
    etymology: "from *Dione*, mother of Venus — the sensualist, the Venerean.",
    oneLiner: "The libertine and most formally virtuoso narrator; from Day II onward he wins the exclusive privilege of telling the tenth and final tale of every day, and of exemption from the day's theme. The only narrator who always gets the last word.",
    rulesDay: 7,
    voiceNote: "Dioneo is the Decameron's genius. On the first day he tells the fourth tale, the bawdy story of the young monk and the abbot. After that he petitions for — and receives — the privilege of always telling the tenth tale and of being exempt from the day's stated theme. His ten tales include the most technically dazzling and most morally provocative in the collection: Alibech and Rustico (III.10), the wine-cask farce (VII.2), Salabaetto (VIII.10), and finally Griselda (X.10), the famously unsettling last tale of the entire work. He rules Day VII himself — the day of wives' tricks on husbands.",
  },
  lauretta: {
    id: "lauretta",
    name: "Lauretta",
    gender: "F",
    color: "#65A30D",
    colorDark: "#A3E635",
    etymology: "'Little Laura' — a glance at Petrarch, who was Boccaccio's older contemporary and dear friend, and whose own *Canzoniere* sang to a Laura.",
    oneLiner: "Queen of Day VIII (tricks anyone plays on anyone); the narrator most associated with song. She sings ballads at the close of several days.",
    rulesDay: 8,
    voiceNote: "Lauretta's name is homage to Petrarch, whom Boccaccio revered and visited. She is the singer of the brigata — she performs song after song at day-close — and her tales tend toward beautiful arrangement rather than shock. Day VIII's theme under her crown is deliberately loose, an invitation for anyone to trick anyone: the result includes the Calandrino tales and the Scholar's Revenge, some of the most savage comedy in the book.",
  },
  emilia: {
    id: "emilia",
    name: "Emilia",
    gender: "F",
    color: "#EA580C",
    colorDark: "#FB923C",
    etymology: "from Latin *Aemilia* — an old Roman gens name; warm, earthy, a name without literary baggage.",
    oneLiner: "Queen of Day IX (free subject, second time); the narrator most at home in this world — bodies, farms, priests, bread.",
    rulesDay: 9,
    voiceNote: "Emilia is the pragmatist of the seven. Her tales tend to be rooted in material life — labourers, priests, merchants — and she is one of the warmest voices. Boccaccio uses her to sing several of the day-closing ballads. On her day (IX) the theme is free, as it had been on Pampinea's Day I; the two free days frame the work's more-structured middle and are a good place to watch the brigata's mood relax.",
  },
  pamfilo: {
    id: "pamfilo",
    name: "Pamfilo",
    gender: "M",
    color: "#4F46E5",
    colorDark: "#818CF8",
    etymology: "from Greek — 'all-loving'; the name Boccaccio gave the unfaithful lover in his earlier *Elegia di Madonna Fiammetta*.",
    oneLiner: "King of Day X (magnificence and liberality), the day of exemplary greatness. He opens the whole collection with the tale of Ser Ciappelletto (I.1) and closes the frame's ordered tales by handing the tenth slot of Day X to Dioneo.",
    rulesDay: 10,
    voiceNote: "Pamfilo rules the final day and sets its noble theme: tales of magnificent or liberal deeds. He himself opens the entire sequence of tales at Day I.1 with Ciappelletto, the wickedest man in the world falsely canonized — and he closes his own Day X with the ninth tale, Saladin and Torello, before yielding to Dioneo's Griselda. The arc from the false saint of I.1 to the Saladin of X.9 is Pamfilo's alone. (Payne's spelling; 'Panfilo' is the modern scholarly form.)",
  },
}

/** Convenience: ordered list of the ten, in the order they first appear in
 * the brigata roll-call of Day I's Introduction (Pampinea first, Dioneo
 * last — one of many structural ironies of his later eminence). */
export const BRIGATA_ORDER: BrigataId[] = [
  "pampinea",
  "fiammetta",
  "filomena",
  "emilia",
  "lauretta",
  "neifile",
  "elisa",
  "pamfilo",
  "filostrato",
  "dioneo",
]

export function getBrigata(id: BrigataId): BrigataMember {
  return BRIGATA[id]
}

/** Resolve a narrator color for a given voice id, including Boccaccio-as-author. */
export function getVoiceColor(id: VoiceId, dark = false): string {
  if (id === AUTHOR_VOICE_ID) return dark ? "#F59E0B" : "#B45309" // amber
  return dark ? BRIGATA[id].colorDark : BRIGATA[id].color
}

/** Human-readable label for a voice, used in attribution and the tracker. */
export function getVoiceLabel(id: VoiceId): string {
  if (id === AUTHOR_VOICE_ID) return "Boccaccio (author's voice)"
  return BRIGATA[id].name
}
