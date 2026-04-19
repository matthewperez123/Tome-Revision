/**
 * Canterbury Tales — Ellesmere fragment structure.
 *
 * The Tales survive as ten textual fragments (I–X). Within each fragment,
 * tales link via prologues and end-links — the order is fixed, because the
 * characters explicitly reference one another. *Between* fragments, the
 * order is disputed. Ellesmere (Huntington Library MS EL 26 C 9, c. 1405)
 * is the canonical editorial base; the Riverside Chaucer and nearly every
 * teaching edition follow Ellesmere. Tome does too.
 *
 * This file maps the ten fragments onto the 25 chapters in
 * public/content/the-canterbury-tales/ and adds the dramatic-link notes
 * that make the Ellesmere arrangement legible.
 *
 * The existing chapter ingestion does NOT yet carve out the inter-tale
 * links (Miller's Prologue, Reeve's Prologue, etc.) as separate units;
 * they are currently bundled into each tale's chapter. A later pipeline
 * pass will extract them to TaleLinkBlocks and re-number, at which point
 * this file's `taleChapterIndex` values shift. The fragment structure
 * itself is stable against that change.
 *
 * The Retractions (Chaucer's own disowning of the bawdy tales at the end)
 * is NOT currently present as a separate chapter in public/content/. It
 * is a small piece of trailing prose that Standard Ebooks bundles into
 * the Parson's Tale file or as back matter. See PART 1.3 of the ingestion
 * spec — surfacing the Retractions as its own AuthorInterventionBlock is
 * a follow-up task.
 */

export type FragmentId =
  | "fragment-i"
  | "fragment-ii"
  | "fragment-iii"
  | "fragment-iv"
  | "fragment-v"
  | "fragment-vi"
  | "fragment-vii"
  | "fragment-viii"
  | "fragment-ix"
  | "fragment-x"

export interface FragmentMember {
  chapterIndex: number            // index into public/content/the-canterbury-tales/
  kind: "prologue" | "tale" | "link" | "retraction"
  dramaticLink?: string           // one-sentence motivation ("tells this to 'quite' the Knight")
}

export interface EllesmereFragment {
  id: FragmentId
  roman: string                   // "I", "II", ... "X"
  name: string                    // "Fragment I: The Pilgrimage Begins"
  subtitle: string                // "General Prologue + Knight, Miller, Reeve, Cook"
  groupingTag?: "marriage-group" | "religious-tales" | "opening" | "closing"
  summary: string                 // a paragraph of orientation
  members: FragmentMember[]
}

/**
 * Fragment → tales mapping. The taleChapterIndex values correspond to the
 * current 25-chapter flat structure in public/content/the-canterbury-tales/:
 *
 *   0  The Prologue                     (= General Prologue + proposed game)
 *   1  The Knight's Tale
 *   2  The Miller's Tale
 *   3  The Reeve's Tale
 *   4  The Cook's Tale (fragment)
 *   5  The Man of Law's Tale
 *   6  The Wife of Bath's Tale          (includes her long Prologue)
 *   7  The Friar's Tale
 *   8  The Sompnour's [Summoner's] Tale
 *   9  The Clerk's Tale
 *   10 The Merchant's Tale
 *   11 The Squire's Tale (unfinished)
 *   12 The Franklin's Tale
 *   13 The Doctor's [Physician's] Tale
 *   14 The Pardoner's Tale              (includes his self-exposing Prologue)
 *   15 The Shipman's Tale
 *   16 The Prioress's Tale
 *   17 Chaucer's Tale of Sir Thopas
 *   18 Chaucer's Tale of Meliboeus
 *   19 The Monk's Tale
 *   20 The Nun's Priest's Tale
 *   21 The Second Nun's Tale
 *   22 The Canon's Yeoman's Tale
 *   23 The Manciple's Tale
 *   24 The Parson's Tale
 *
 * The General Prologue (ch-0) sits "inside" Fragment I in all scholarly
 * editions — it is the opening of the fragment that contains the Knight,
 * Miller, Reeve, and Cook. Tome labels it as Fragment I's opening.
 */

export const CANTERBURY_FRAGMENTS: EllesmereFragment[] = [
  {
    id: "fragment-i",
    roman: "I",
    name: "Fragment I",
    subtitle: "The Pilgrimage Begins — General Prologue + Knight, Miller, Reeve, Cook",
    groupingTag: "opening",
    summary:
      "The work's longest and most architecturally finished fragment. The General " +
      "Prologue sets the pilgrimage at the Tabard Inn and introduces the 29 pilgrims " +
      "in a sequence of dense character portraits. The Host proposes the tale-game. " +
      "The Knight tells first (courtly romance adapted from Boccaccio's *Teseida*). " +
      "The drunken Miller interrupts to 'quite' the Knight with a fabliau. The Reeve, " +
      "a carpenter grievously mocked in the Miller's Tale, retaliates with a " +
      "counter-fabliau. The Cook starts his tale and the text breaks off.",
    members: [
      { chapterIndex: 0, kind: "prologue",
        dramaticLink: "The General Prologue: Chaucer introduces the pilgrims and the Host proposes the tale-telling game." },
      { chapterIndex: 1, kind: "tale",
        dramaticLink: "The Knight tells first by drawing the shortest straw — a philosophical romance in heroic couplets." },
      { chapterIndex: 2, kind: "tale",
        dramaticLink: "The drunken Miller insists on speaking next, out of turn, to 'quite' (repay, top) the Knight's courtly tale with a fabliau counter." },
      { chapterIndex: 3, kind: "tale",
        dramaticLink: "The Reeve, himself a carpenter, takes offense at the Miller's carpenter-cuckold and retaliates with a fabliau of his own." },
      { chapterIndex: 4, kind: "tale",
        dramaticLink: "The Cook begins — and the manuscript breaks off after a few dozen lines. One of two major incompletes." },
    ],
  },
  {
    id: "fragment-ii",
    roman: "II",
    name: "Fragment II",
    subtitle: "The Man of Law's Tale",
    summary:
      "A short, self-contained fragment. The Man of Law tells a rime-royal romance of " +
      "patient Constance, a Christian princess repeatedly cast away on open sea. The " +
      "epilogue (in some manuscripts) points forward to either the Shipman or the " +
      "Summoner, so fragment placement here matters — Ellesmere places it as the " +
      "second fragment.",
    members: [
      { chapterIndex: 5, kind: "tale",
        dramaticLink: "The Man of Law, chided by the Host for his delay, offers a 'thrifty' tale — the high-register Constance romance." },
    ],
  },
  {
    id: "fragment-iii",
    roman: "III",
    name: "Fragment III",
    subtitle: "The Marriage Group Opens — Wife of Bath, Friar, Summoner",
    groupingTag: "marriage-group",
    summary:
      "One of the work's dramatic peaks. The Wife of Bath's Prologue — nearly 900 lines " +
      "of autobiographical rhetoric — is longer than most of the tales and reshapes " +
      "everything after it. The Friar and the Summoner, seated by each other and hating " +
      "each other, trade tales savagely satirizing the other's profession. Fragment III " +
      "is the first of the so-called Marriage Group (Kittredge's 1912 grouping of " +
      "fragments III–V as a sustained debate on marriage).",
    members: [
      { chapterIndex: 6, kind: "tale",
        dramaticLink: "The Wife of Bath, with the longest prologue in the book, proposes 'sovereignty' as the solution to marriage — and answers by a tale where a knight learns the same lesson." },
      { chapterIndex: 7, kind: "tale",
        dramaticLink: "The Friar, seated opposite the Summoner and loathing him, tells a tale satirizing summoners." },
      { chapterIndex: 8, kind: "tale",
        dramaticLink: "The Summoner, incensed, tells a tale satirizing a friar — the dramatic link's compound-interest return." },
    ],
  },
  {
    id: "fragment-iv",
    roman: "IV",
    name: "Fragment IV",
    subtitle: "The Marriage Group Continues — Clerk, Merchant",
    groupingTag: "marriage-group",
    summary:
      "The Clerk's rime-royal tale of Griselda is Chaucer's direct adaptation of Petrarch's " +
      "Latin translation of Boccaccio's *Decameron* X.10 — the load-bearing cross-reference " +
      "between the two framed medieval tale-collections in Tome's catalog. The Merchant " +
      "follows with a savage January-and-May fabliau — a bitter response to the Clerk's " +
      "patient-wife exemplum, colored by the Merchant's own broken marriage.",
    members: [
      { chapterIndex: 9, kind: "tale",
        dramaticLink: "The Clerk of Oxenford, asked to tell a cheerful tale, answers the Wife of Bath with Griselda — the Petrarchan-Boccaccian exemplum of wifely patience." },
      { chapterIndex: 10, kind: "tale",
        dramaticLink: "The Merchant, whose own marriage (by his Prologue's admission) is miserable, follows the Clerk's patient Griselda with the savage fabliau of January, his blind old husband, and May." },
    ],
  },
  {
    id: "fragment-v",
    roman: "V",
    name: "Fragment V",
    subtitle: "The Marriage Group Closes — Squire, Franklin",
    groupingTag: "marriage-group",
    summary:
      "The Squire's oriental romance breaks off unfinished — the second major incomplete. " +
      "The Franklin interrupts admiringly, takes the floor, and tells a Breton-lay in " +
      "which the question of 'sovereignty' in marriage (Wife of Bath's theme) is " +
      "answered by mutual generosity. The closing question — 'Which was the moste fre?' " +
      "— is where some readers find Chaucer's most affirmative ethical vision.",
    members: [
      { chapterIndex: 11, kind: "tale",
        dramaticLink: "The Squire begins a long oriental romance about King Cambuscan — which breaks off, unfinished, mid-episode." },
      { chapterIndex: 12, kind: "tale",
        dramaticLink: "The Franklin interrupts the Squire admiringly, then tells a Breton-lay answering the marriage debate through mutual generosity." },
    ],
  },
  {
    id: "fragment-vi",
    roman: "VI",
    name: "Fragment VI",
    subtitle: "The Physician and the Pardoner",
    summary:
      "A short, tonally coherent fragment. The Physician's Virginia tale (from Livy) and " +
      "the Pardoner's self-exposing Prologue and Tale are both meditations on death — " +
      "one a father's pre-emptive killing of a daughter to save her from a corrupt judge, " +
      "the other three rioters who set out to kill Death and find him. Fragment VI is " +
      "the Pardoner's fragment: the self-exposure is one of the most sophisticated " +
      "oratorical performances in English pre-modern literature.",
    members: [
      { chapterIndex: 13, kind: "tale",
        dramaticLink: "The Physician tells the tale of Virginia, a father killing his daughter to save her honor — from Livy via the *Roman de la Rose*." },
      { chapterIndex: 14, kind: "tale",
        dramaticLink: "The Pardoner, asked by the Host for a merry tale, instead exposes his own corruption at length and then delivers the greatest sermon-tale in the book." },
    ],
  },
  {
    id: "fragment-vii",
    roman: "VII",
    name: "Fragment VII",
    subtitle: "The Long Central Fragment — Shipman, Prioress, Thopas, Melibee, Monk, Nun's Priest",
    groupingTag: "religious-tales",
    summary:
      "The work's longest fragment: six tales in varied registers that move between bawdy " +
      "fabliau (Shipman), miracle of the Virgin (Prioress, a brutally antisemitic blood-libel " +
      "tale — see the editorial note on that tale), Chaucer-the-pilgrim's failed tail-rhyme " +
      "parody (*Sir Thopas*, interrupted by the Host), Chaucer-the-pilgrim's long prose " +
      "sermon (*Melibee*), the Monk's catalogue of *de casibus* tragedies, and the Nun's " +
      "Priest's mock-epic masterpiece of Chanticleer. The formal variety is itself " +
      "the fragment's argument: storytelling in every register, back-to-back.",
    members: [
      { chapterIndex: 15, kind: "tale",
        dramaticLink: "The Shipman tells a fabliau of a merchant, his wife, and a sly monk — an analogue of *Decameron* VIII.1." },
      { chapterIndex: 16, kind: "tale",
        dramaticLink: "The Prioress offers a 'miracle of the Virgin' — a brutal antisemitic blood-libel tale. See the editorial note on this tale; Tome presents it as written and annotates the history honestly." },
      { chapterIndex: 17, kind: "tale",
        dramaticLink: "Chaucer-the-pilgrim, called upon by the Host, delivers the tail-rhyme parody *Sir Thopas* — which the Host interrupts for being unbearable." },
      { chapterIndex: 18, kind: "tale",
        dramaticLink: "Chaucer-the-pilgrim, corrected, offers instead a long prose treatise of moral counsel — *Melibee*, the pilgrim's second and successful attempt." },
      { chapterIndex: 19, kind: "tale",
        dramaticLink: "The Monk delivers a catalogue of seventeen *de casibus* tragedies in eight-line stanzas — until the Knight interrupts, unable to bear any more." },
      { chapterIndex: 20, kind: "tale",
        dramaticLink: "The Nun's Priest answers with the mock-epic glory of Chanticleer the rooster — the tonal counterweight that redeems the fragment." },
    ],
  },
  {
    id: "fragment-viii",
    roman: "VIII",
    name: "Fragment VIII",
    subtitle: "The Second Nun and the Canon's Yeoman",
    groupingTag: "religious-tales",
    summary:
      "The Second Nun's rime-royal life of St. Cecilia (adapted from the *Legenda Aurea*) " +
      "is the company's hagiographical anchor. Mid-fragment, a Canon and his Yeoman " +
      "overtake the pilgrims on the road; the Canon flees in shame when his alchemical " +
      "frauds are about to be exposed; the Yeoman stays behind and tells a devastating " +
      "insider's account of alchemical deception.",
    members: [
      { chapterIndex: 21, kind: "tale",
        dramaticLink: "The Second Nun tells the martyrdom of St. Cecilia — a rime-royal saint's life in the *Legenda Aurea* tradition." },
      { chapterIndex: 22, kind: "tale",
        dramaticLink: "Mid-journey, the Canon's Yeoman arrives and — after his master flees — exposes the whole seven-year fraud of alchemy from the inside." },
    ],
  },
  {
    id: "fragment-ix",
    roman: "IX",
    name: "Fragment IX",
    subtitle: "The Manciple's Tale",
    summary:
      "A brief, tonally strange fragment. The Cook has fallen drunk from his horse; the " +
      "Manciple takes his place and tells an Ovidian tale of Phoebus, his wife, and a " +
      "truth-telling crow — a meditation on the risk of speaking truth that lands " +
      "ambiguously against the Parson's plain-speaking prose sermon that follows.",
    members: [
      { chapterIndex: 23, kind: "tale",
        dramaticLink: "The drunken Cook has fallen off his horse; the Manciple steps in, telling an Ovidian tale about the risk of speaking truth." },
    ],
  },
  {
    id: "fragment-x",
    roman: "X",
    name: "Fragment X",
    subtitle: "The Parson's Tale and the Retractions",
    groupingTag: "closing",
    summary:
      "The pilgrimage ends not with another story but with a sermon. The Parson delivers " +
      "a long prose treatise on the Seven Deadly Sins — deliberate formal counterweight " +
      "to every tale before it. The work closes with Chaucer's *Retractions*, his own " +
      "disowning of the bawdy tales — possibly late piety, possibly ironic, a critical " +
      "question. Either way, it is the honest last word.",
    members: [
      { chapterIndex: 24, kind: "tale",
        dramaticLink: "The Parson offers not a tale but a sermon — a prose treatise on the Seven Deadly Sins that closes the pilgrimage." },
      { chapterIndex: 25, kind: "retraction",
        dramaticLink: "Chaucer's own closing — a prose Retraction in which the poet asks God's mercy for his bawdy tales and names them one by one. The honest last word of the work as he left it." },
    ],
  },
]

/** Return the fragment containing a given chapter. */
export function fragmentForChapter(chapterIndex: number): EllesmereFragment | undefined {
  return CANTERBURY_FRAGMENTS.find((f) =>
    f.members.some((m) => m.chapterIndex === chapterIndex),
  )
}

/** Return the dramatic-link note for a given chapter, if one is defined. */
export function dramaticLinkForChapter(chapterIndex: number): string | undefined {
  for (const frag of CANTERBURY_FRAGMENTS) {
    for (const m of frag.members) {
      if (m.chapterIndex === chapterIndex) return m.dramaticLink
    }
  }
  return undefined
}

/** Flat list of {chapterIndex, fragment} for the Pilgrim Progress Map. */
export function progressMapEntries(): Array<{
  chapterIndex: number
  fragment: EllesmereFragment
  member: FragmentMember
}> {
  const out: Array<{ chapterIndex: number; fragment: EllesmereFragment; member: FragmentMember }> = []
  for (const fragment of CANTERBURY_FRAGMENTS) {
    for (const member of fragment.members) {
      out.push({ chapterIndex: member.chapterIndex, fragment, member })
    }
  }
  return out.sort((a, b) => a.chapterIndex - b.chapterIndex)
}
