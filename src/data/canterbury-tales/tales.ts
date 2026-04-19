/**
 * Canterbury Tales — per-tale metadata.
 *
 * For each of the 25 chapters (General Prologue + 24 tales), this file
 * stores:
 *   - the verse form (heroic couplets, rime royal, tail-rhyme, prose,
 *     or the Monk's eight-line stanza)
 *   - a one-sentence scholarly argument (what the tale is about, non-spoiling
 *     in the "19th-century table of contents" register)
 *   - the teller's pilgrim id (for color/label lookups)
 *   - critical flags: isIncomplete (Cook, Squire), contentNote (Prioress's
 *     antisemitism, bawdy fabliaux)
 *   - the fragment id
 *
 * Used by the reader's header chrome, the form indicator, the Pilgrim
 * Progress Map, and the fragment-level front-matter.
 */

import { CANTERBURY_FRAGMENTS, type FragmentId } from "./fragments"

export type VerseForm =
  | "heroic-couplets"    // iambic pentameter rhymed AA BB CC — Chaucer's invention for English
  | "rime-royal"         // seven-line stanza ababbcc, high register (Man of Law, Clerk, Prioress, Second Nun)
  | "tail-rhyme"         // aabccb — the parody form of *Sir Thopas*
  | "monks-stanza"       // eight-line stanza ababbcbc — the Monk's *de casibus* tragedies
  | "prose"              // *Melibee* and the Parson's Tale
  | "mixed"              // General Prologue opening is couplet but contains a rime-royal-ish passage; reserved

export interface TaleMetadata {
  chapterIndex: number
  title: string
  fragmentId: FragmentId
  fragmentRoman: string
  verseForm: VerseForm
  verseFormNote: string          // one-sentence explanation ("rime royal — seven-line stanza ababbcc — ...")
  tellerId: string | null        // pilgrim id, or null for General Prologue narration
  argument: string               // one-sentence scholarly argument
  isIncomplete: boolean
  contentNote?: "antisemitism" | "bawdy-fabliau" | "violence" | "sexual-coding"
  portraitReference?: [number, number]  // GP line range for the teller's portrait, if applicable
}

const FORM_NOTES: Record<VerseForm, string> = {
  "heroic-couplets":
    "Heroic couplets — iambic pentameter rhymed in pairs (AA BB CC …). Chaucer's invention " +
    "for English narrative verse; the form every later English narrative poet inherits.",
  "rime-royal":
    "Rime royal — a seven-line stanza rhymed ababbcc in iambic pentameter. A high-register " +
    "form Chaucer borrows from Boccaccio and reserves for tales of tragic or hagiographic seriousness.",
  "tail-rhyme":
    "Tail-rhyme — short-lined stanzas with a recurring 'tail' rhyme (aabccb and variants). " +
    "A popular form in fourteenth-century English romance; Chaucer uses it here only for parody.",
  "monks-stanza":
    "An eight-line stanza rhymed ababbcbc in iambic pentameter — Chaucer's own innovation, " +
    "reserved for the Monk's catalogue of *de casibus* tragedies.",
  prose:
    "Prose — deliberately distinguished from the surrounding verse. The pilgrimage's two " +
    "prose tales (Chaucer's *Melibee* and the Parson's sermon) stand against everything " +
    "around them.",
  mixed:
    "Mixed verse forms within the chapter.",
}

function lookupFragmentRoman(chapterIndex: number): { fragmentId: FragmentId; roman: string } {
  for (const frag of CANTERBURY_FRAGMENTS) {
    if (frag.members.some((m) => m.chapterIndex === chapterIndex)) {
      return { fragmentId: frag.id, roman: frag.roman }
    }
  }
  throw new Error(`Chapter ${chapterIndex} not assigned to any fragment`)
}

const raw: Array<Omit<TaleMetadata, "fragmentId" | "fragmentRoman" | "verseFormNote">> = [
  {
    chapterIndex: 0,
    title: "The General Prologue",
    verseForm: "heroic-couplets",
    tellerId: null,
    argument:
      "Chaucer-the-pilgrim, lodging at the Tabard Inn in Southwark on the eve of his " +
      "pilgrimage to Canterbury, meets twenty-nine other pilgrims bound on the same road, " +
      "introduces each in a descriptive portrait, and agrees to the Host's proposal that " +
      "the company will tell tales along the way.",
    isIncomplete: false,
  },
  {
    chapterIndex: 1,
    title: "The Knight's Tale",
    verseForm: "heroic-couplets",
    tellerId: "knight",
    argument:
      "Two Theban knights, Palamon and Arcite, taken captive by Theseus of Athens, both " +
      "fall in love with Theseus's sister-in-law Emily, and Theseus arranges a great " +
      "tournament to settle the matter; Arcite wins and dies, and Palamon marries Emily. " +
      "Adapted from Boccaccio's *Teseida*.",
    isIncomplete: false,
    portraitReference: [43, 78],
  },
  {
    chapterIndex: 2,
    title: "The Miller's Tale",
    verseForm: "heroic-couplets",
    tellerId: "miller",
    argument:
      "A clerk lodging with an Oxford carpenter seduces the carpenter's young wife by " +
      "persuading the credulous husband that a second Flood is coming — with a misdirected " +
      "kiss, a branding iron, and the word 'water!' for the punchline. The masterpiece " +
      "of English fabliau.",
    isIncomplete: false,
    contentNote: "bawdy-fabliau",
    portraitReference: [547, 568],
  },
  {
    chapterIndex: 3,
    title: "The Reeve's Tale",
    verseForm: "heroic-couplets",
    tellerId: "reeve",
    argument:
      "Two Cambridge students, robbed in broad daylight by a dishonest miller, take their " +
      "revenge by night on the miller's wife and daughter — a counter-fabliau to the " +
      "Miller's, told in retaliation for the Miller's portrait of a cuckolded carpenter.",
    isIncomplete: false,
    contentNote: "bawdy-fabliau",
    portraitReference: [589, 624],
  },
  {
    chapterIndex: 4,
    title: "The Cook's Tale",
    verseForm: "heroic-couplets",
    tellerId: "cook",
    argument:
      "A London apprentice's dissolute life in brothels and taverns — the tale breaks off " +
      "after fewer than sixty lines and has never been continued.",
    isIncomplete: true,
    portraitReference: [379, 387],
  },
  {
    chapterIndex: 5,
    title: "The Man of Law's Tale",
    verseForm: "rime-royal",
    tellerId: "man-of-law",
    argument:
      "Constance, a Christian princess of Rome, is repeatedly cast away on open sea and " +
      "repeatedly delivered by God's providence — married and widowed in Syria and again " +
      "in Northumbria before finally being restored to Rome. From Trivet via Gower.",
    isIncomplete: false,
    portraitReference: [309, 330],
  },
  {
    chapterIndex: 6,
    title: "The Wife of Bath's Prologue and Tale",
    verseForm: "heroic-couplets",
    tellerId: "wife-of-bath",
    argument:
      "The Wife of Bath, in a long autobiographical Prologue, narrates her five marriages " +
      "and defends a theory of wifely sovereignty; then tells an Arthurian tale in which " +
      "a knight-rapist learns the same lesson from a loathly lady who becomes beautiful " +
      "once he grants her the governance of her own person.",
    isIncomplete: false,
    portraitReference: [445, 476],
  },
  {
    chapterIndex: 7,
    title: "The Friar's Tale",
    verseForm: "heroic-couplets",
    tellerId: "friar",
    argument:
      "A corrupt summoner swears brotherhood with a yeoman who turns out to be a devil — " +
      "and is carried off to Hell when he curses an old woman and refuses to retract.",
    isIncomplete: false,
    portraitReference: [208, 269],
  },
  {
    chapterIndex: 8,
    title: "The Summoner's Tale",
    verseForm: "heroic-couplets",
    tellerId: "summoner",
    argument:
      "A greedy limiter (friar) extracts a final gift from a sick man — and receives " +
      "instead a spectacular and humiliating fart, which he must then divide equally among " +
      "his brethren, a problem solved by a squire at the manor.",
    isIncomplete: false,
    contentNote: "bawdy-fabliau",
    portraitReference: [623, 668],
  },
  {
    chapterIndex: 9,
    title: "The Clerk's Tale",
    verseForm: "rime-royal",
    tellerId: "clerk",
    argument:
      "The marquis Walter tests the patience of his low-born wife Griselda by pretending " +
      "to murder their two children and finally to cast her off for a younger bride — a " +
      "test she endures without complaint. Adapted from Petrarch's Latin translation of " +
      "Boccaccio's *Decameron* X.10.",
    isIncomplete: false,
    portraitReference: [285, 308],
  },
  {
    chapterIndex: 10,
    title: "The Merchant's Tale",
    verseForm: "heroic-couplets",
    tellerId: "merchant",
    argument:
      "The old knight January marries the young May; struck blind, he is cuckolded in a " +
      "pear tree by his squire Damian in a scene restored to his sight only to be denied " +
      "by a preposterous lie.",
    isIncomplete: false,
    contentNote: "bawdy-fabliau",
    portraitReference: [272, 284],
  },
  {
    chapterIndex: 11,
    title: "The Squire's Tale",
    verseForm: "heroic-couplets",
    tellerId: "squire",
    argument:
      "At the court of Cambuscan, a strange knight delivers four magical gifts — a brazen " +
      "horse, a mirror, a ring, and a sword — and the tale begins to unfold the stories " +
      "of the king's daughter Canacee and a grieving falcon. It breaks off unfinished.",
    isIncomplete: true,
    portraitReference: [79, 100],
  },
  {
    chapterIndex: 12,
    title: "The Franklin's Tale",
    verseForm: "heroic-couplets",
    tellerId: "franklin",
    argument:
      "The knight Arveragus and his wife Dorigen agree to a marriage of mutual sovereignty; " +
      "Dorigen, pressed by the squire Aurelius, rashly promises her love if he can remove " +
      "the black rocks from the Breton coast — and a magician does. Generosity cascades " +
      "from the resulting crisis. A Breton lay.",
    isIncomplete: false,
    portraitReference: [333, 362],
  },
  {
    chapterIndex: 13,
    title: "The Physician's Tale",
    verseForm: "heroic-couplets",
    tellerId: "physician",
    argument:
      "The corrupt judge Apius conspires with a churl to claim the beautiful Virginia as " +
      "a runaway slave; her father Virginius kills her rather than surrender her to the " +
      "judge. From Livy via the *Roman de la Rose*.",
    isIncomplete: false,
    contentNote: "violence",
    portraitReference: [411, 444],
  },
  {
    chapterIndex: 14,
    title: "The Pardoner's Prologue and Tale",
    verseForm: "heroic-couplets",
    tellerId: "pardoner",
    argument:
      "The Pardoner, in an extraordinary confessional Prologue, admits that his preaching " +
      "is for gain rather than for souls; then delivers a masterpiece of that preaching — " +
      "three rioters who set out to kill Death and find him instead in the form of a " +
      "hoard of gold. Text: *Radix malorum est cupiditas*.",
    isIncomplete: false,
    contentNote: "sexual-coding",
    portraitReference: [669, 714],
  },
  {
    chapterIndex: 15,
    title: "The Shipman's Tale",
    verseForm: "heroic-couplets",
    tellerId: "shipman",
    argument:
      "A merchant's wife exchanges sexual favors with a monk for a hundred francs to pay " +
      "her debts; the monk borrows the money from the merchant and pays the wife with it, " +
      "so the husband funds his own cuckolding. A direct analogue of *Decameron* VIII.1.",
    isIncomplete: false,
    contentNote: "bawdy-fabliau",
    portraitReference: [388, 410],
  },
  {
    chapterIndex: 16,
    title: "The Prioress's Tale",
    verseForm: "rime-royal",
    tellerId: "prioress",
    argument:
      "A Christian schoolboy, murdered by Jews for singing a Marian hymn, continues to " +
      "sing after death through miraculous intervention of the Virgin. A 'miracle of the " +
      "Virgin' of a recognizable medieval type — and a brutal blood-libel tale. See the " +
      "editorial note on this tale for Tome's posture; annotations frame honestly.",
    isIncomplete: false,
    contentNote: "antisemitism",
    portraitReference: [118, 162],
  },
  {
    chapterIndex: 17,
    title: "The Tale of Sir Thopas",
    verseForm: "tail-rhyme",
    tellerId: "chaucer-pilgrim",
    argument:
      "Chaucer-the-pilgrim, called on for a tale, delivers a jangling tail-rhyme parody of " +
      "bad chivalric romance — which the Host interrupts mid-stanza, saying the doggerel " +
      "is not worth a turd and calling for something in prose.",
    isIncomplete: false,  // deliberately cut off by the Host, not abandoned by Chaucer
  },
  {
    chapterIndex: 18,
    title: "The Tale of Melibee",
    verseForm: "prose",
    tellerId: "chaucer-pilgrim",
    argument:
      "A long prose allegory — Chaucer-the-pilgrim's second, successful attempt — in which " +
      "the wealthy Melibee, whose house has been attacked, is counseled to mercy and " +
      "reconciliation rather than revenge by his wife Prudence. Adapted from Renaud de " +
      "Louens's French version of Albertano of Brescia.",
    isIncomplete: false,
  },
  {
    chapterIndex: 19,
    title: "The Monk's Tale",
    verseForm: "monks-stanza",
    tellerId: "monk",
    argument:
      "Seventeen short *de casibus* tragedies — falls of great men from fortune, from " +
      "Lucifer and Adam through Nero and Caesar to contemporary kings — until the Knight " +
      "interrupts the Monk, saying he cannot bear any more disasters.",
    isIncomplete: false,
    portraitReference: [165, 207],
  },
  {
    chapterIndex: 20,
    title: "The Nun's Priest's Tale",
    verseForm: "heroic-couplets",
    tellerId: "nuns-priest",
    argument:
      "The rooster Chanticleer, warned of his death by a prophetic dream, is nonetheless " +
      "seized by the fox Russel — and saved only when he tricks the fox into opening his " +
      "mouth to boast. A mock-epic masterpiece built from classical allusion, scholastic " +
      "philosophy, oneiromancy, and the barnyard.",
    isIncomplete: false,
  },
  {
    chapterIndex: 21,
    title: "The Second Nun's Tale",
    verseForm: "rime-royal",
    tellerId: "second-nun",
    argument:
      "The martyrdom of St. Cecilia — Roman virgin, convert of her husband and his brother, " +
      "ultimately beheaded by the prefect Almachius — from Jacobus de Voragine's " +
      "*Legenda Aurea*.",
    isIncomplete: false,
  },
  {
    chapterIndex: 22,
    title: "The Canon's Yeoman's Tale",
    verseForm: "heroic-couplets",
    tellerId: "canons-yeoman",
    argument:
      "After an unnamed Canon has joined the company and then fled in shame, his Yeoman " +
      "exposes at length the fraud of alchemical 'multiplication' — the whole seven-year " +
      "work of converting base metal to gold — from the inside.",
    isIncomplete: false,
  },
  {
    chapterIndex: 23,
    title: "The Manciple's Tale",
    verseForm: "heroic-couplets",
    tellerId: "manciple",
    argument:
      "Phoebus Apollo keeps a white crow who can speak; the crow reports the infidelity of " +
      "Phoebus's wife; Phoebus in grief kills the wife, then in rage turns the crow black " +
      "forever. A meditation, from Ovid's *Metamorphoses*, on the risk of speaking truth.",
    isIncomplete: false,
    portraitReference: [569, 586],
  },
  {
    chapterIndex: 24,
    title: "The Parson's Tale",
    verseForm: "prose",
    tellerId: "parson",
    argument:
      "The Parson, refusing to tell 'a fable' as the pilgrimage closes, offers instead a " +
      "long prose treatise on penitence organized around the Seven Deadly Sins. The formal " +
      "counterweight to every tale before it: the pilgrimage ends with a sermon, not another " +
      "story.",
    isIncomplete: false,
    portraitReference: [477, 528],
  },
  {
    chapterIndex: 25,
    title: "Chaucer's Retractions",
    verseForm: "prose",
    tellerId: "chaucer-pilgrim",
    argument:
      "The work as Chaucer left it ends with his own disowning — a short prose Retraction " +
      "asking God's mercy for the 'translations and enditings of worldly vanities,' naming " +
      "his bawdy tales one by one. A critical crux: sincere late piety, ironic frame-close, " +
      "or both at once. Compare Boccaccio's *Author's Conclusion* at the end of the Decameron: " +
      "Boccaccio defends his bawdy tales; Chaucer retracts.",
    isIncomplete: false,
  },
]

export const CANTERBURY_TALES_METADATA: TaleMetadata[] = raw.map((t) => {
  const { fragmentId, roman } = lookupFragmentRoman(t.chapterIndex)
  return {
    ...t,
    fragmentId,
    fragmentRoman: roman,
    verseFormNote: FORM_NOTES[t.verseForm],
  }
})

export function taleMetadata(chapterIndex: number): TaleMetadata | undefined {
  return CANTERBURY_TALES_METADATA.find((t) => t.chapterIndex === chapterIndex)
}
