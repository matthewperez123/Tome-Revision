/**
 * Canterbury Tales — pilgrim palette and roster.
 *
 * Design rationale:
 *   - Chaucer's pilgrims are not a brigata (Decameron) but a mixed crowd of
 *     twenty-nine English travelers, socially specific and dramatically
 *     linked. The palette surfaces this dramatic identity: tale-tellers
 *     whose voices shape the work get distinct hues; the General Prologue
 *     portrait characters who do not tell surviving tales share a muted
 *     stone-gray, present for the social panorama but not for dialogic
 *     weight.
 *   - The Host (Harry Bailly) is not a tale-teller but orchestrates every
 *     link. His deep crimson is distinct from any teller; it is the voice
 *     of the frame itself.
 *   - Chaucer-the-pilgrim (teller of *Sir Thopas* and *Melibee*) has a
 *     warm amber separate from Chaucer-the-poet. Within tale-links and
 *     the author's Retractions the poet speaks through an intervention
 *     block (amber tint, author-voice marker); within the pilgrimage
 *     itself, the pilgrim has his own speaker color.
 *   - The Wife of Bath's rose is the palette's structural signature —
 *     the most distinctive voice in the work, and the passage whose
 *     annotation density rivals anything in the catalog.
 *   - The Pardoner's violet sits deliberately near the Wife of Bath's
 *     rose: these are the work's two great monologues of self-exposure,
 *     and the chromatic proximity is intentional.
 *
 * Colors are tuned for both light and dark reader themes.
 */

export type PilgrimGroup =
  | "frame"           // Harry Bailly the Host; the pilgrim-Chaucer; orchestrating voices
  | "major-tellers"   // Knight, Miller, Reeve, Wife of Bath, Friar, Summoner, Clerk,
                      // Merchant, Franklin, Pardoner, Prioress, Nun's Priest, Parson
  | "secondary-tellers" // Man of Law, Squire, Physician, Shipman, Monk, Second Nun,
                        // Canon's Yeoman, Manciple; their tales land but their voices
                        // do less dramatic work in the links
  | "non-tellers"     // Yeoman, Plowman, the Five Guildsmen, et al.;
                      // social panorama, no surviving tale

export interface CanterburyPilgrim {
  id: string
  name: string
  label: string               // marginal uppercase label for portrait blocks
  color: string               // light-theme hue
  darkColor: string           // dark-theme hue
  group: PilgrimGroup
  estate: "clergy" | "nobility" | "commons" | "frame"
  professionalSphere: string  // one-line social placement
  tellsTale: boolean
  taleChapterIndex: number | null   // index in public/content/the-canterbury-tales/
  portraitLineRange: [number, number] | null  // GP line numbers (Riverside)
  signatureNote: string       // a sentence of interpretive orientation
}

// ─── Frame voices ───────────────────────────────────────────────────────

export const PILGRIM_HOST: CanterburyPilgrim = {
  id: "harry-bailly",
  name: "The Host (Harry Bailly)",
  label: "THE HOST",
  color: "#8B1A1A",           // deep crimson
  darkColor: "#D46C6C",
  group: "frame",
  estate: "frame",
  professionalSphere: "Innkeeper of the Tabard in Southwark; self-appointed master of the pilgrims' tale-game",
  tellsTale: false,
  taleChapterIndex: null,
  portraitLineRange: [751, 858],
  signatureNote:
    "Not a tale-teller but the frame's orchestrator. Every link is his: he proposes the " +
    "game in the General Prologue, he calls tellers in order (often flouted by drunken " +
    "interruption), he interrupts Chaucer's own *Sir Thopas* for being unbearable. " +
    "His judgements are the work's pragmatic middle register.",
}

export const PILGRIM_CHAUCER: CanterburyPilgrim = {
  id: "chaucer-pilgrim",
  name: "Chaucer (the pilgrim)",
  label: "CHAUCER THE PILGRIM",
  color: "#C18B2C",           // warm amber
  darkColor: "#E3B668",
  group: "frame",
  estate: "frame",
  professionalSphere: "A naive fellow-traveler in the company; distinct from Chaucer the poet",
  tellsTale: true,
  taleChapterIndex: 17,       // Sir Thopas (ch-17); Melibee at ch-18
  portraitLineRange: null,    // self-effacing; no self-portrait in the GP
  signatureNote:
    "The double narrator's lower register. Chaucer-the-pilgrim is the naive, easily-" +
    "impressed observer who admires the Monk, praises the Friar, and — when called on " +
    "to tell a tale — offers the tail-rhyme disaster *Sir Thopas* and then the prose " +
    "sermon *Melibee*. The gap between him and the poet writing him is one of the " +
    "work's central ironies.",
}

// ─── Major tale-tellers ─────────────────────────────────────────────────

export const PILGRIM_KNIGHT: CanterburyPilgrim = {
  id: "knight",
  name: "The Knight",
  label: "THE KNIGHT",
  color: "#D4A04C",           // laurel gold
  darkColor: "#E8C278",
  group: "major-tellers",
  estate: "nobility",
  professionalSphere: "A crusading knight returning from foreign wars; the company's moral elder",
  tellsTale: true,
  taleChapterIndex: 1,
  portraitLineRange: [43, 78],
  signatureNote:
    "The company's first tale-teller, proposing a philosophical romance adapted from " +
    "Boccaccio's *Teseida*. Laurel-gold: moral gravity, Boethian seriousness, the " +
    "courtly register against which the Miller's ember-red counter will burn all the hotter.",
}

export const PILGRIM_MILLER: CanterburyPilgrim = {
  id: "miller",
  name: "The Miller (Robin)",
  label: "THE MILLER",
  color: "#DC2626",           // ember red
  darkColor: "#F06A6A",
  group: "major-tellers",
  estate: "commons",
  professionalSphere: "A rowdy miller with a red beard and a wart on his nose; a trades-cheat",
  tellsTale: true,
  taleChapterIndex: 2,
  portraitLineRange: [547, 568],
  signatureNote:
    "Drunk, loud, insisting on speaking out of turn to 'quite' the Knight. His tale is " +
    "the masterpiece of English fabliau. Ember red: the heat of interruption itself.",
}

export const PILGRIM_REEVE: CanterburyPilgrim = {
  id: "reeve",
  name: "The Reeve (Oswald)",
  label: "THE REEVE",
  color: "#B04B6A",           // dim rose
  darkColor: "#D57E97",
  group: "major-tellers",
  estate: "commons",
  professionalSphere: "An estate manager; a skilled carpenter by trade — hence his grievance",
  tellsTale: true,
  taleChapterIndex: 3,
  portraitLineRange: [589, 624],
  signatureNote:
    "Sharp, thin, embittered; resents the Miller's portrait of the carpenter John and " +
    "repays with a counter-fabliau against a miller. The dramatic link is personal. " +
    "Dim rose: the grudge-color.",
}

export const PILGRIM_COOK: CanterburyPilgrim = {
  id: "cook",
  name: "The Cook (Roger of Ware)",
  label: "THE COOK",
  color: "#9E9987",           // stone (his tale is a fragment)
  darkColor: "#C3BFAD",
  group: "secondary-tellers",
  estate: "commons",
  professionalSphere: "A London cook with a mormal (suppurating sore) on his shin",
  tellsTale: true,
  taleChapterIndex: 4,
  portraitLineRange: [379, 387],
  signatureNote:
    "His tale breaks off after a handful of lines — one of the two major incompletes. " +
    "The company moves on without him. Stone gray because the voice never fully lands.",
}

export const PILGRIM_MAN_OF_LAW: CanterburyPilgrim = {
  id: "man-of-law",
  name: "The Man of Law",
  label: "THE MAN OF LAW",
  color: "#5B7C5E",           // laurel green (secondary tier)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "commons",
  professionalSphere: "A serjeant-at-law, busy and wealthy; tells the tale of patient Constance",
  tellsTale: true,
  taleChapterIndex: 5,
  portraitLineRange: [309, 330],
  signatureNote:
    "Rime royal, a high-register romance of a suffering Christian princess — the same " +
    "stanza form and register as the Prioress's and Clerk's tales. A serious voice from " +
    "a worldly professional.",
}

export const PILGRIM_WIFE_OF_BATH: CanterburyPilgrim = {
  id: "wife-of-bath",
  name: "The Wife of Bath (Alisoun)",
  label: "THE WIFE OF BATH",
  color: "#BE185D",           // rose
  darkColor: "#E2548F",
  group: "major-tellers",
  estate: "commons",
  professionalSphere: "A cloth-weaver from near Bath; five husbands, much travel, formidable rhetoric",
  tellsTale: true,
  taleChapterIndex: 6,
  portraitLineRange: [445, 476],
  signatureNote:
    "The single most distinctive voice in the work. Her Prologue (nearly 900 lines of " +
    "autobiographical virtuosic rhetoric) dwarfs most of the tales. The rose is the " +
    "palette's structural signature — the moment Chaucer most fully becomes a poet of " +
    "character-as-voice.",
}

export const PILGRIM_FRIAR: CanterburyPilgrim = {
  id: "friar",
  name: "The Friar (Huberd)",
  label: "THE FRIAR",
  color: "#EA580C",           // terracotta
  darkColor: "#F59B62",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A limiter (licensed mendicant), eloquent, corrupt, genteel in company",
  tellsTale: true,
  taleChapterIndex: 7,
  portraitLineRange: [208, 269],
  signatureNote:
    "Corrupt and eloquent. His tale satirizes a summoner; the Summoner's tale returns " +
    "the favor with compound interest. Terracotta: warm, smooth, false.",
}

export const PILGRIM_SUMMONER: CanterburyPilgrim = {
  id: "summoner",
  name: "The Summoner",
  label: "THE SUMMONER",
  color: "#8A5A2B",           // smoky amber
  darkColor: "#B28458",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A summoner to ecclesiastical court; pustular face, drunken, corrupt",
  tellsTale: true,
  taleChapterIndex: 8,
  portraitLineRange: [623, 668],
  signatureNote:
    "The Friar's satirical opposite; tale and counter-tale are a single dramatic unit. " +
    "Smoky amber — heat that has gone sour.",
}

export const PILGRIM_CLERK: CanterburyPilgrim = {
  id: "clerk",
  name: "The Clerk of Oxenford",
  label: "THE CLERK",
  color: "#4F46E5",           // deep indigo
  darkColor: "#8B84F1",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A poor Oxford scholar of logic; lean horse, leaner person, twenty books at his bed's head",
  tellsTale: true,
  taleChapterIndex: 9,
  portraitLineRange: [285, 308],
  signatureNote:
    "Tells the Griselda tale adapted from Petrarch's Latin translation of Boccaccio's " +
    "*Decameron* X.10 — the catalog's load-bearing Italian-English cross-reference. " +
    "Deep indigo: the scholar's cold patience, answering the Wife of Bath.",
}

export const PILGRIM_MERCHANT: CanterburyPilgrim = {
  id: "merchant",
  name: "The Merchant",
  label: "THE MERCHANT",
  color: "#4A516B",           // dim indigo-gray
  darkColor: "#7A8299",
  group: "major-tellers",
  estate: "commons",
  professionalSphere: "A merchant of wool and exchange; bitter about his own marriage",
  tellsTale: true,
  taleChapterIndex: 10,
  portraitLineRange: [272, 284],
  signatureNote:
    "Bitter, disillusioned. His January-and-May tale is one of the most savage " +
    "fabliaux in the canon. Dim indigo-gray: warmth withdrawn.",
}

export const PILGRIM_SQUIRE: CanterburyPilgrim = {
  id: "squire",
  name: "The Squire",
  label: "THE SQUIRE",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "nobility",
  professionalSphere: "The Knight's young son; courtly, lovesick, curly-haired",
  tellsTale: true,
  taleChapterIndex: 11,
  portraitLineRange: [79, 100],
  signatureNote:
    "A young courtier's oriental romance, breaking off unfinished. The second major " +
    "incomplete. The Franklin breaks in at the end, admiringly, and takes the floor.",
}

export const PILGRIM_FRANKLIN: CanterburyPilgrim = {
  id: "franklin",
  name: "The Franklin",
  label: "THE FRANKLIN",
  color: "#D4A85C",           // warm gold
  darkColor: "#E7C684",
  group: "major-tellers",
  estate: "commons",
  professionalSphere: "A wealthy landowner; white-bearded, generous, a connoisseur of table",
  tellsTale: true,
  taleChapterIndex: 12,
  portraitLineRange: [333, 362],
  signatureNote:
    "Warm gold. His Breton-lay tale — and its famous closing question, 'Which was the " +
    "moste fre?' — is where some readers locate Chaucer's most affirmative ethical vision, " +
    "though the tale's framing is never uncomplicated.",
}

export const PILGRIM_PHYSICIAN: CanterburyPilgrim = {
  id: "physician",
  name: "The Physician",
  label: "THE DOCTOR OF PHYSIC",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "commons",
  professionalSphere: "A physician; rich from the plague, fond of gold as cordial",
  tellsTale: true,
  taleChapterIndex: 13,
  portraitLineRange: [411, 444],
  signatureNote:
    "Tells the Virginia tale (from Livy via the *Roman de la Rose*) — a father who " +
    "kills his own daughter rather than surrender her to a corrupt judge. Unblinking.",
}

export const PILGRIM_PARDONER: CanterburyPilgrim = {
  id: "pardoner",
  name: "The Pardoner",
  label: "THE PARDONER",
  color: "#7C3AED",           // violet
  darkColor: "#A47AF2",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A pardoner (seller of indulgences and relics); the General Prologue " +
    "describes him with sexually ambiguous coding ('I trowe he were a geldyng or a mare')",
  tellsTale: true,
  taleChapterIndex: 14,
  portraitLineRange: [669, 714],
  signatureNote:
    "The work's most disturbing figure and most self-aware orator. His Prologue is a " +
    "confessional self-exposure; his Tale is the devastatingly effective story of three " +
    "rioters and Death. Violet: deliberately close to the Wife of Bath's rose — the two " +
    "great monologues of self-exposure.",
}

export const PILGRIM_SHIPMAN: CanterburyPilgrim = {
  id: "shipman",
  name: "The Shipman",
  label: "THE SHIPMAN",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "commons",
  professionalSphere: "A sailor from Dartmouth; drowns opponents without compunction",
  tellsTale: true,
  taleChapterIndex: 15,
  portraitLineRange: [388, 410],
  signatureNote:
    "A merchant-wife fabliau with a direct *Decameron* (VIII.1) analogue. " +
    "The wife-as-merchandise logic played to laconic perfection.",
}

export const PILGRIM_PRIORESS: CanterburyPilgrim = {
  id: "prioress",
  name: "The Prioress (Madame Eglantine)",
  label: "THE PRIORESS",
  color: "#E6C3C1",           // pale rose-gold
  darkColor: "#F0D8D6",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A prioress of a nunnery; too-courtly manners, little dogs, a brooch " +
    "inscribed 'Amor vincit omnia'",
  tellsTale: true,
  taleChapterIndex: 16,
  portraitLineRange: [118, 162],
  signatureNote:
    "Pious, mannered; in Chaucer's framing, chillingly blind to the antisemitic violence " +
    "of the tale she tells. Pale rose-gold: a surface sweetness the content betrays.",
}

export const PILGRIM_MONK: CanterburyPilgrim = {
  id: "monk",
  name: "The Monk",
  label: "THE MONK",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "clergy",
  professionalSphere: "A well-fed, hunt-loving prelate; worldly and unrepentant about it",
  tellsTale: true,
  taleChapterIndex: 19,
  portraitLineRange: [165, 207],
  signatureNote:
    "Tells a catalogue of *de casibus* tragedies — seventeen falls of the great, each a " +
    "short eight-line stanza. The Knight interrupts, saying he cannot bear it.",
}

export const PILGRIM_NUNS_PRIEST: CanterburyPilgrim = {
  id: "nuns-priest",
  name: "The Nun's Priest",
  label: "THE NUN'S PRIEST",
  color: "#0D9488",           // mediterranean teal
  darkColor: "#40B3A5",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A chaplain attending the Prioress; not described in the General Prologue",
  tellsTale: true,
  taleChapterIndex: 20,
  portraitLineRange: null,
  signatureNote:
    "Chaucer's mock-epic master: Chanticleer the rooster, Pertelote the hen, the fox, " +
    "and the whole weight of classical allusion and scholastic philosophy deployed " +
    "on a barnyard. Teal: cool, clear-eyed, amused.",
}

export const PILGRIM_SECOND_NUN: CanterburyPilgrim = {
  id: "second-nun",
  name: "The Second Nun",
  label: "THE SECOND NUN",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "clergy",
  professionalSphere: "An unnamed nun accompanying the Prioress; tells the martyrdom of St. Cecilia",
  tellsTale: true,
  taleChapterIndex: 21,
  portraitLineRange: null,
  signatureNote:
    "A saint's life in rime royal, adapted from the *Legenda Aurea*. The company's " +
    "hagiographical anchor, without irony.",
}

export const PILGRIM_CANONS_YEOMAN: CanterburyPilgrim = {
  id: "canons-yeoman",
  name: "The Canon's Yeoman",
  label: "THE CANON'S YEOMAN",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "commons",
  professionalSphere: "A servant to an alchemist-canon; joins the company mid-pilgrimage, " +
    "then betrays his master's false science",
  tellsTale: true,
  taleChapterIndex: 22,
  portraitLineRange: null,    // arrives later, no GP portrait
  signatureNote:
    "Not among the original company — he overtakes the pilgrims mid-journey and, once " +
    "his master flees in shame, tells a devastating insider's tale of alchemical fraud.",
}

export const PILGRIM_MANCIPLE: CanterburyPilgrim = {
  id: "manciple",
  name: "The Manciple",
  label: "THE MANCIPLE",
  color: "#5B7C5E",           // laurel green (secondary)
  darkColor: "#8DAB90",
  group: "secondary-tellers",
  estate: "commons",
  professionalSphere: "A provisioner for a legal inn; shrewd, cheats his lettered employers",
  tellsTale: true,
  taleChapterIndex: 23,
  portraitLineRange: [569, 586],
  signatureNote:
    "Tells an Ovidian tale of Phoebus, his wife, and a telling crow — a story about " +
    "the risk of speaking truth. Comes after a drunken Cook has collapsed in the road.",
}

export const PILGRIM_PARSON: CanterburyPilgrim = {
  id: "parson",
  name: "The Parson",
  label: "THE PARSON",
  color: "#E9DCB0",           // warm white-gold
  darkColor: "#F1E8C7",
  group: "major-tellers",
  estate: "clergy",
  professionalSphere: "A poor country parson; the only wholly admirable ecclesiastical figure in the work",
  tellsTale: true,
  taleChapterIndex: 24,
  portraitLineRange: [477, 528],
  signatureNote:
    "The book's moral conscience. His tale — a long prose treatise on the Seven Deadly " +
    "Sins — is the formal counterweight to every tale before it: the pilgrimage ends " +
    "with a sermon, not another story. Warm white-gold: the austere light.",
}

// ─── Non-telling pilgrims (General Prologue portraits only) ────────────

const NON_TELLER_COLOR = "#9E9987"
const NON_TELLER_DARK = "#C3BFAD"

function nonTeller(
  id: string,
  name: string,
  label: string,
  estate: CanterburyPilgrim["estate"],
  professionalSphere: string,
  portraitLineRange: [number, number],
  signatureNote: string,
): CanterburyPilgrim {
  return {
    id,
    name,
    label,
    color: NON_TELLER_COLOR,
    darkColor: NON_TELLER_DARK,
    group: "non-tellers",
    estate,
    professionalSphere,
    tellsTale: false,
    taleChapterIndex: null,
    portraitLineRange,
    signatureNote,
  }
}

export const PILGRIM_YEOMAN = nonTeller(
  "yeoman", "The Yeoman", "THE YEOMAN", "commons",
  "An attendant to the Knight and Squire; forester, archer, woodsman",
  [101, 117],
  "Green-clad, carrying a peacock-fletched arrow sheaf. The only member of the Knight's " +
  "party besides his son. No tale.",
)

export const PILGRIM_MERCHANTS_GUILDSMEN = nonTeller(
  "five-guildsmen", "The Five Guildsmen", "THE GUILDSMEN", "commons",
  "A haberdasher, a carpenter, a weaver, a dyer, and a tapicer; bourgeois aspirants with expensive knives",
  [361, 378],
  "The rising middle class in a single civic livery. Socially specific, economically ambitious; " +
  "none tells a tale, their Cook (their hired cook for the road) tries and fails.",
)

export const PILGRIM_PLOWMAN = nonTeller(
  "plowman", "The Plowman", "THE PLOWMAN", "commons",
  "The Parson's brother; a peasant who works the land and loves his neighbor",
  [529, 541],
  "The Parson's brother and his moral twin. Pairs with the Parson as the two unimpeachable " +
  "figures among Chaucer's 29 pilgrims. No tale.",
)

// ─── The full roster ──────────────────────────────────────────────────

export const CANTERBURY_PILGRIMS: CanterburyPilgrim[] = [
  PILGRIM_HOST,
  PILGRIM_CHAUCER,
  PILGRIM_KNIGHT,
  PILGRIM_SQUIRE,
  PILGRIM_YEOMAN,
  PILGRIM_PRIORESS,
  PILGRIM_SECOND_NUN,
  PILGRIM_NUNS_PRIEST,
  PILGRIM_MONK,
  PILGRIM_FRIAR,
  PILGRIM_MERCHANT,
  PILGRIM_CLERK,
  PILGRIM_MAN_OF_LAW,
  PILGRIM_FRANKLIN,
  PILGRIM_MERCHANTS_GUILDSMEN,
  PILGRIM_COOK,
  PILGRIM_SHIPMAN,
  PILGRIM_PHYSICIAN,
  PILGRIM_WIFE_OF_BATH,
  PILGRIM_PARSON,
  PILGRIM_PLOWMAN,
  PILGRIM_MANCIPLE,
  PILGRIM_REEVE,
  PILGRIM_SUMMONER,
  PILGRIM_PARDONER,
  PILGRIM_CANONS_YEOMAN,
]

export function pilgrimById(id: string): CanterburyPilgrim | undefined {
  return CANTERBURY_PILGRIMS.find((p) => p.id === id)
}

/** Return the pilgrim who tells the given chapter's tale, if any. */
export function pilgrimForChapter(chapterIndex: number): CanterburyPilgrim | undefined {
  // Chapter 18 (Melibee) is Chaucer-the-pilgrim's second tale; not his "primary"
  // taleChapterIndex, but still his voice.
  if (chapterIndex === 18) return PILGRIM_CHAUCER
  return CANTERBURY_PILGRIMS.find((p) => p.taleChapterIndex === chapterIndex)
}
