/**
 * Canterbury Tales — editorial notes.
 *
 * Short, reader-facing notes rendered on the book detail page and
 * (eventually) as unlockable front-matter pieces in the reader.
 * These are Tome's editorial interventions — honest framing for
 * difficult material, practical guidance for a Middle English text,
 * and an orienting map of what the work is and is not.
 *
 * The full 1200-word Editorial Introduction from PART 9.1 of the
 * ingestion spec is still to be authored as its own front-matter
 * chapter (pending a negative-index chapter structure or an
 * unlockable-panel system in the reader).
 */

export interface EditorialNote {
  id: string
  title: string
  /** Plain prose; rendered with paragraph breaks at \n\n. */
  body: string
  /** Sort order on the book detail page. */
  order: number
}

export const CANTERBURY_TALES_EDITORIAL_NOTES: EditorialNote[] = [
  {
    id: "editorial-introduction",
    order: 0,
    title: "Editorial Introduction",
    body:
      "The *Canterbury Tales* is the foundational work of English literary vernacular. Composed between roughly 1387 and the poet's death in 1400, and unfinished at that death, it is the single most influential book ever written in the English language — every English poet after it, from Spenser and Shakespeare through Dryden, Pope, Keats, Browning, Tennyson, and Eliot, has read Chaucer closely and written against his example.\n\n" +
      "On the surface, the premise is simple. Twenty-nine pilgrims gather at the Tabard Inn in Southwark, on the south bank of the Thames, on a spring evening. They are bound for the shrine of St. Thomas Becket at Canterbury, about sixty miles southeast. The innkeeper — Harry Bailly, the Host — proposes that the company pass the road-time by telling stories, two apiece on the way out and two on the way back, with the best tale winning the prize of a company dinner at his own cost when they return. The pilgrims agree, and the next morning they set out. The rest of the work is what happens on the road.\n\n" +
      "What is remarkable is who the pilgrims are. They are not the aristocratic, interchangeable knights and ladies of earlier French and English romance. They are socially specific — a crusading knight and his squire son, a prioress with a too-courtly French, a robust miller with a wart on his nose, a wealthy cloth-maker from near Bath with five husbands behind her, a corrupt pardoner who sells indulgences, a poor Oxford scholar with twenty books at his bed's head, a country parson whom Chaucer honestly admires, a shipman who drowns his opponents without compunction. Chaucer introduces them one by one in the General Prologue with a density of characterization no English writer before him had attempted. Each portrait is about twenty to forty lines; each is devastatingly specific; each sets up the tale that pilgrim will later tell.\n\n" +
      "The tales themselves are formal variety's own argument. A crusading Knight tells a high philosophical romance adapted from Boccaccio; a drunken Miller insists on telling next, out of turn, to 'quite' the Knight with a fabliau of a cuckolded Oxford carpenter; a Reeve, himself a carpenter by trade and so insulted by the Miller's fabliau, retaliates with a counter-fabliau about a crooked miller; and so on. The Wife of Bath delivers nearly nine hundred lines of autobiographical Prologue defending her five marriages against a patristic tradition that condemned any second marriage; the Clerk answers her with a rime-royal exemplum of the patient Griselda, adapted from Petrarch's Latin translation of Boccaccio's *Decameron* X.10; the Merchant follows with a savage fabliau of an old man and a young wife; the Pardoner tells the greatest sermon-tale in English literature after frankly telling the other pilgrims that his preaching is for money. The tales are in every register that fourteenth-century English had available: heroic couplets (which Chaucer is in effect inventing for English), rime royal, tail-rhyme, the Monk's eight-line stanza, and — in the two prose tales, *Melibee* and the Parson's closing treatise on the Seven Deadly Sins — plain prose.\n\n" +
      "The work is unfinished. The Cook's Tale and the Squire's Tale break off mid-episode; Chaucer never returned to them. Of the projected one-hundred-and-twenty-tale schedule, only twenty-four were written, and not every pilgrim gets a turn. At the end the Parson delivers a long prose sermon that refuses to be a tale, and the work closes with Chaucer's own brief Retraction asking God's mercy for the bawdy tales he has written. Whether the Retraction is sincere late piety, an ironic sealing of the narrative frame, or both at once, is one of the enduring questions of medieval English criticism.\n\n" +
      "The text Tome uses is David Laing Purves's regularized Middle English, as served by Standard Ebooks. Purves was a mid-nineteenth-century editor who regularized Chaucer's spelling without losing the underlying vocabulary and grammar. Modern readers encounter 'When that Aprilis, with his showers swoot' rather than 'Whan that Aprille with his shoures soote,' but the diction is still substantively Chaucer's. Expect false friends — *nice* means foolish; *silly* means blessed; *corage* means heart or desire; *queynte* means strange (with a bawdy pun Chaucer exploits deliberately). Expect the Y-prefix past participle, preserved from Old English: *y-clad*, *y-been*, *y-taught*. Expect the pronounced final -e that Chaucer's metre requires: *shoures soote* reads as four syllables, not three. If you read aloud for the first fifty lines, the ear adjusts. The gloss apparatus throughout the text — dotted underlines you can tap or hover for a one-sentence definition — is the accessibility layer, and you should use it without apology.\n\n" +
      "How to read the work: start with the General Prologue, which frames everything. After that, you do not need to read in order. Good first tales are the Wife of Bath's Prologue (nearly nine hundred lines of the most distinctive voice in pre-modern English literature), the Miller's Tale (the fabliau masterpiece), the Pardoner's Prologue and Tale (the sermon-tale and the morally brilliant, morally disturbing voice delivering it), and the Nun's Priest's Tale (mock-epic in a barnyard, the lightest tonal register). The reader chrome on each chapter shows the fragment number, the teller's identity and signature color, the verse form, and a one-sentence dramatic-link explaining why the present tale follows the previous one. Use that chrome — the Ellesmere arrangement is argumentative, and the tales repay being read as moves in the argument.\n\n" +
      "Two of the tales carry editorial notes. The Prioress's Tale is a blood-libel story; Tome presents it as Chaucer wrote it and annotates the history honestly, and readers should read it with open eyes. The bawdy tales — the Miller's, Reeve's, Merchant's, Summoner's, Shipman's — are structural to Chaucer's social panorama, not incidental; readers who prefer to skip them will miss the work's central argumentative motion, but the non-fabliau tales of each fragment stand on their own.\n\n" +
      "The catalog places Chaucer at a specific vertex. Dante's *Divine Comedy* and Boccaccio's *Decameron* sit on the other two corners of the late-medieval triangle. The Clerk's Tale of Griselda is Chaucer's direct translation of Boccaccio's *Decameron* X.10 via Petrarch's Latin, and the cross-reference between the two tales — wired in this edition in both directions — is the catalog's clearest demonstration of how Italian vernacular literature crossed the Alps into English. Read the two tales back-to-back. The difference in their closings — Dioneo's ambivalent coda in Boccaccio, Chaucer's full ironic Envoy in the Clerk — is one of the most illuminating parallel passages in European literature.",
  },
  {
    id: "note-on-middle-english",
    order: 1,
    title: "A Note on Middle English",
    body:
      "The Canterbury Tales is the first book in Tome's catalogue whose source text is not in modern or early-modern English. Chaucer wrote c. 1387–1400 in the London English of his day — a language a century older than Malory's, two centuries older than Shakespeare's. The Standard Ebooks edition uses David Laing Purves's 1870 regularized Middle English: spelling is partly normalized, some lexical difficulty is softened, but the vocabulary and syntax are fundamentally Chaucer's.\n\n" +
      "Expect false friends. *Nice* means foolish. *Silly* means blessed. *Corage* means heart, desire. *Queynte* means strange or curious (with a bawdy pun Chaucer exploits). Expect the *y-* prefix marking the past participle: *y-clad* (clad), *y-taught* (taught), *y-been* (been). Expect the pronounced final -e that Chaucer's meter requires: *shoures soote* reads as four syllables, not three.\n\n" +
      "The gloss apparatus is the accessibility layer. Difficult words carry a dotted underline; tap or hover to reveal a one-sentence definition. The glosses are dense by the standard of Tome's other books; Middle English requires it.\n\n" +
      "Give yourself fifty lines. The ear adjusts. Read aloud if you can — the metre wants it, and the vocabulary clarifies itself through rhythm.",
  },
  {
    id: "on-the-prioress-tale",
    order: 2,
    title: "On the Prioress's Tale",
    body:
      "The Prioress's Tale is a blood-libel story: a Christian schoolboy murdered by the Jews of an Asian city for singing a hymn to the Virgin. The tale participates in a medieval narrative tradition that was repeatedly weaponized in the real world — accusations of ritual child-murder by Jewish communities drove expulsions, forced conversions, and pogroms across medieval and early-modern Europe. England itself had legally expelled its Jewish population in 1290, about a century before Chaucer wrote.\n\n" +
      "Tome presents the tale as Chaucer wrote it and annotates the history honestly. We do not remove the tale, soften its content, or pretend that its beauty as rime-royal verse (and it is some of Chaucer's loveliest stanza-work) redeems what it is doing.\n\n" +
      "Chaucer's own framing of the tale — the gentle mockery of the Prioress's too-courtly manners and sentimental piety in her General Prologue portrait — is part of what the tale offers the reader. Most modern criticism reads the tale as revealing the distance between the Prioress's piety and its antisemitic substrate, though some scholars have argued that Chaucer himself shared the tale's view. Both readings require the reader to look steadily at the violence the tale narrates and enacts. Read it with open eyes.",
  },
  {
    id: "on-the-bawdy-tales",
    order: 3,
    title: "On the Bawdy Tales",
    body:
      "Several of the Canterbury Tales are fabliaux — the medieval genre of bawdy comedic tale — and contain direct sexual humor, cuckoldry, scatology, and sometimes graphic physical comedy. These are the Miller's, Reeve's, Merchant's, Summoner's, and Shipman's Tales.\n\n" +
      "The content is load-bearing, not incidental. Chaucer's social panorama pivots on the contrast between courtly romance (the Knight, the Squire, the Franklin's Breton-lay) and fabliau (the Miller and Reeve quiting each other in back-to-back counter-tales), and the Ellesmere fragment order organizes the juxtaposition deliberately. Readers who skip the bawdy tales miss the work's central argumentative motion.\n\n" +
      "If you prefer to skip, the non-fabliau tales of each fragment stand on their own. The Prologue to each fabliau will cue you in advance.",
  },
  {
    id: "how-to-read",
    order: 4,
    title: "How to Read It",
    body:
      "You do not need to read in order. The General Prologue first — the twenty-two pilgrim portraits are the foundation for everything that follows. After that, browse by pilgrim or by mood.\n\n" +
      "Good first experiences: the Wife of Bath's Prologue (the most distinctive voice in pre-modern English literature), the Miller's Tale (the fabliau masterpiece), the Pardoner's Prologue and Tale (the sermon-tale and its morally brilliant, morally disturbing teller), the Nun's Priest's Tale (mock-epic in a barnyard, the lightest tonal register).\n\n" +
      "The narrative tracker at the top of each chapter shows the fragment, the teller's signature color, and a one-sentence dramatic-link explaining why this tale follows the previous one. The formal indicator names the verse form — heroic couplets, rime royal, tail-rhyme, the Monk's stanza, or prose. The pilgrimage's formal variety is itself the work's argument.\n\n" +
      "The work is unfinished. The Cook's and Squire's Tales break off mid-sentence; the Retractions at the end are Chaucer's own disowning of the bawdy tales he has just written. All of this is part of the honest shape of what he left.",
  },
]
