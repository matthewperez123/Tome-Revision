import type { Annotation } from "../types"

// ── The Faerie Queene — Letter to Sir Walter Raleigh (1589, prefixed to
// the 1590 edition) — hand-authored scholarly annotations. ────────────
//
// Standard Ebooks text (selectively modernized from the 1590 quarto).
// Chapter index: ch-1 in public/content/the-faerie-queene/ch-1.json.
// The Letter is ~1,500 words of prose — short, dense, and the door to
// the whole poem.
//
// Density: 8 annotations. Opus-grade per spec Part 4 model allocation
// — this cluster is explicitly called out as the demo-critical paratext
// introduction. The cluster is designed to function as a mini-introduction
// to Spenser: a first-time reader who reads the Letter with these
// annotations should have what they need to begin Book I canto i with
// eyes open to the allegorical mode, the Aristotelian frame, the
// Gloriana/Elizabeth identification, and the literary lineage.
//
// The load-bearing annotation for a first-time reader of this poem is
// `fq-letter-dark-conceit`. Spenser opens by naming his method a
// "continued allegory, or dark conceit," and everything that follows —
// the twelve-virtues plan, Arthur-as-Magnificence, Gloriana-as-Elizabeth
// — is downstream of that commitment. Readers who miss "dark conceit"
// have nowhere to put the allegory they immediately encounter in
// Error's wood.
//
// All cross-references are to books actually in the Tome catalog
// (The Iliad, The Odyssey, The Aeneid, Orlando Furioso, Paradise Lost).
// Tasso's Gerusalemme Liberata is not yet in the catalog; annotations
// that reference Tasso describe but do not cross-link.

export const FAERIE_QUEENE_LETTER_TO_RALEGH: Annotation[] = [
  // ── 1. "Dark conceit" — the mode-defining term ──────────────────────
  {
    id: "fq-letter-dark-conceit",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "a continued allegory, or dark conceit",
    anchorOccurrence: 1,
    title: "\"A continued allegory, or dark conceit\" — the mode of the whole poem",
    quotedPassage:
      "knowing how doubtfully all allegories may be construed, and this book of mine, which I have entitled the Faerie Queene, being a continued allegory, or dark conceit, I have thought good, as well for avoiding of jealous opinions and misconstructions, as also for your better light in reading thereof, (being so by you commanded,) to discover unto you the general intention and meaning, which in the whole course thereof I have fashioned",
    passageReference: "Letter to Raleigh, opening",
    commentary: `Spenser's very first self-description of the poem names the thing that will challenge every modern reader: *continued allegory*. Not allegory that appears in set-piece passages — as in Virgil's underworld or Dante's three-beast prologue — but allegory that runs *unbroken* under the surface of the narrative, canto by canto, for six complete books and two more. Every knight, every lady, every monster, every landscape is simultaneously a person in a story and a figure for a virtue, vice, theological concept, or historical personage. Often several of those at once.

*Dark conceit* is the Elizabethan technical term for what we would call a sustained allegorical conception. "Conceit" here has its 16th-century meaning — a designed idea, a thought-structure — not our modern sense of vanity. "Dark" means *veiled*, *requiring interpretation*. The term is neutral and formal; Spenser is naming his method, not apologizing for it.

The Letter itself is Spenser's concession to the difficulty: Raleigh has asked for a key, and Spenser is providing one — *one* key, the top-level intention of the whole. He is explicit that he will not unpack "particular purposes, or by accidents." The reader is expected to work.

A modern reader can approach this in two ways. One: *collapse* the allegory to its literal story, and let the quest-narrative pull you forward — Redcrosse rides, fights monsters, falls, is redeemed; Guyon traverses temptations; Britomart seeks Artegall. This is how the poem reads as an adventure. Two: *hold open the double reading*, and let each figure mean both itself and its allegorical load at once. This is how the poem reads as scripture, ethics, political commentary, and theology — simultaneously.

Neither reading cancels the other. Spenser's method requires both. The annotations throughout this edition — particularly the "allegory notes" that surface multiple simultaneous readings — are designed to keep that doubleness intact rather than reducing either side to code.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dante's Divine Comedy is the closest ancestor of sustained allegory in the Christian tradition — but Dante's allegory is intermittent and typically declared (the three beasts, the gate-inscriptions, Beatrice's explanations). Spenser writes allegory that runs continuously and unglossed. He is doing in English what Dante did in Italian, but without Virgil as in-text guide.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno I (the three beasts)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Milton, writing Paradise Lost seventy years later, deliberately avoids Spenser's continued-allegory mode — his Sin and Death are set-piece allegorical figures inside an otherwise non-allegorical cosmic narrative. The two Protestant epics choose opposite settlements with the allegorical tradition; the contrast is one of the demo-critical payoffs of reading them in sequence.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book II (Sin and Death allegory)",
        targetBookId: "paradise-lost",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 2. The pedagogical aim ──────────────────────────────────────────
  {
    id: "fq-letter-fashion-a-gentleman",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "to fashion a gentleman or noble person in virtuous and gentle discipline",
    anchorOccurrence: 1,
    title: "\"To fashion a gentleman or noble person\" — the pedagogical aim",
    quotedPassage:
      "The general end therefore of all the book is to fashion a gentleman or noble person in virtuous and gentle discipline. Which for that I conceived should be most plausible and pleasing, being coloured with an historical fiction, the which the most part of men delight to read, rather for variety of matter than for profit of the ensample, I chose the history of King Arthur",
    passageReference: "Letter to Raleigh, §2",
    commentary: `This is Spenser's statement of the poem's purpose, and it is worth lingering on every word.

"Fashion" — in 1589, this is an active verb in the craft sense: to *shape*, to *form*, as one fashions metal or clay. Stephen Greenblatt's influential 1980 book *Renaissance Self-Fashioning* took its title from this sentence; the thought is that the Renaissance gentleman is made, not born — and made partly by reading the right books. *The Faerie Queene* is that kind of book, self-consciously.

"Gentleman or noble person" — note the double. The poem is addressed to the lesser and greater aristocracy of Elizabethan England, the readers who would frequent Raleigh's (or Leicester's, or Sidney's) circles. Not the commoner; not the crown. The pedagogy targets a specific class.

"Virtuous and gentle discipline" — the two adjectives carry distinct weight. *Virtuous* is moral philosophy (Aristotle is about to be named). *Gentle* is a term of social class but also of character — the gentle-born are expected to display gentleness, which in Spenser's vocabulary approaches something like refined moral sensibility, related to but not identical with courtesy (which Book VI will separately allegorize).

"Historical fiction" and "variety of matter" — Spenser concedes, candidly, that readers will pick up a romance for its narrative pleasures more readily than they will pick up a moral treatise. He is, in effect, *smuggling* virtue-formation inside adventure. The Letter's frankness on this point is one of its most useful features for the first-time reader: Spenser is not pretending the allegory is the main attraction. He wants you to read for Britomart's combats and then find, as you do, that Chastity has been working on you.

"I chose the history of King Arthur" — Spenser next names Arthur (not yet king in the poem's fictional time; we meet him as the questing prince) as the figure who unifies all twelve projected books. This is the Arthur of Malory and of Geoffrey of Monmouth's *Historia Regum Britanniae*, the Arthur who was already the foundation-myth of British monarchy. By choosing Arthur, Spenser is claiming the poem for Elizabethan England specifically — British matter, not Italian or Trojan.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Sir Philip Sidney's Apology for Poetry (1595), published six years after Spenser's Letter, argues the same thesis Spenser practices — that poetry teaches virtue more effectively than philosophy because it *delights* first. The two documents belong together as the central English Protestant statement of poetry's moral purpose.",
        workTitle: "An Apology for Poetry",
        workAuthor: "Sir Philip Sidney",
        passageReference: "composed c. 1580, published 1595",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 3. The classical-romance lineage: Homer → Virgil → Ariosto → Tasso ──
  {
    id: "fq-letter-literary-lineage",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "first Homer, who in the persons of Agamemnon and Ulysses",
    anchorOccurrence: 1,
    title: "Homer, Virgil, Ariosto, Tasso — the lineage Spenser claims",
    quotedPassage:
      "In which I have followed all the antique poets historical; first Homer, who in the persons of Agamemnon and Ulysses hath ensampled a good governor and a virtuous man, the one in his Ilias, the other in his Odysseis: then Virgil, whose like intention was to do in the person of Aeneas: after him Ariosto comprised them both in his Orlando: and lately Tasso dissevered them again, and formed both parts in two persons, namely, that part which they in philosophy call Ethice, or virtues of a private man, coloured in his Rinaldo: the other named Politice in his Godfredo.",
    passageReference: "Letter to Raleigh, §2",
    commentary: `This is Spenser's explicit self-placement in the European epic tradition, and it is the single most useful passage in the Letter for a reader who wants to see *what he thinks he is doing*.

The scheme he outlines: every great epic, Spenser claims, has taken an exemplary hero and used him to teach a virtue.
- **Homer** takes two heroes for two different exemplary functions — Agamemnon (*good governor*, in the Iliad) and Odysseus (*virtuous private man*, in the Odyssey).
- **Virgil** combines them into Aeneas — simultaneously public founder and private man of virtue.
- **Ariosto** in *Orlando Furioso* similarly combines them — Spenser reads Orlando as a composite hero.
- **Tasso**, just recently, in *Gerusalemme Liberata* (1581), has split them again — Rinaldo for *private* virtue (ethics), Godfrey for *public* virtue (politics).

Then comes Spenser's own placement: *The Faerie Queene* will be an Aristotelian refinement of the scheme. Arthur (before he is king) stands for Magnificence, which is the *total* of all virtues and therefore the public-private unity; twelve other knights each exemplify one private virtue (the "twelve private moral virtues" per Aristotle's Nicomachean Ethics). If the twelve private-virtue books succeed, he tells Raleigh, he will write twelve *political* virtue books after them — an unwritten second half that will never come.

Note what Spenser *conceals* here. His most immediate models are not Homer, Virgil, Ariosto, and Tasso in equal measure — they are Ariosto and Virgil, in that order. Ariosto gave him the interlaced romance structure, the allegorical enchantresses (Alcina → Acrasia, Duessa), and the dynastic warrior maiden (Bradamante → Britomart). Virgil gave him the underworld descents (reworked into Mammon's cave and Archimago's, II.vii and I.i), the prophecy-of-Britain echoing Anchises' parade (III.iii), and the imperial-founding frame. Homer is an ideological placeholder (the *antique poets historical*) rather than a working source. Spenser is claiming the classical line to secure the poem's prestige; the Italian line is where he actually reads and adapts.

The Tasso reference dates the Letter precisely — Tasso's *Gerusalemme Liberata* was published in 1581, Spenser is writing 1589, and the claim that Tasso has "lately" (recently) split the scheme is literally accurate.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Iliad — which Spenser reads (through Elizabethan intermediaries, probably not the Greek direct) as the portrait of Agamemnon as governor. The reading is Renaissance rather than modern; we tend to read the Iliad as about Achilles's wrath more than Agamemnon's governance.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "books I–XXIV",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Homer's Odyssey — Spenser's exemplar of the virtuous private man. This reading has more 20th-century traction; Odysseus's resourcefulness, endurance, and homecoming are traditionally the model of private virtue.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "books I–XXIV",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Virgil's Aeneid — the combined public-and-private virtue in a single hero. Spenser's Arthur-as-Magnificence mirrors Aeneas structurally, and Virgil's dynastic prophecy in Aeneid VI directly shapes Britomart's vision of the British descent in Faerie Queene III.iii.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI (parade of Romans)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Ariosto's Orlando Furioso — the most immediate and operationally important source. The interlaced romance structure, the enchantresses, the dynastic warrior-maiden, and the genre of allegorical chivalric epic all descend directly from Ariosto. Spenser is writing the English Ariosto, as Milton will write the English Virgil.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "cantos I–XLVI",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 4. Twelve Aristotelian virtues ──────────────────────────────────
  {
    id: "fq-letter-twelve-virtues",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "the twelve private moral virtues, as Aristotle hath devised",
    anchorOccurrence: 1,
    title: "The twelve private moral virtues — and the problem of the list",
    quotedPassage:
      "I labour to portrait in Arthur, before he was king, the image of a brave knight, perfected in the twelve private moral virtues, as Aristotle hath devised; the which is the purpose of these first twelve books",
    passageReference: "Letter to Raleigh, §2",
    commentary: `Spenser announces a twelve-virtue scheme derived from Aristotle's *Nicomachean Ethics*. He names "the twelve private moral virtues, as Aristotle hath devised" — as though this were a settled canonical list. It is not.

Aristotle in the Nicomachean Ethics does not actually give a numbered list of twelve private virtues. His ethics operates on the doctrine of the mean — each virtue as a midpoint between two vices — and in Books II–V he discusses roughly eleven virtues (courage, temperance, liberality, magnificence, magnanimity, proper ambition, gentleness, truthfulness, wittiness, friendliness, justice), plus a set of intellectual virtues in Book VI. You can count them to twelve only by selective inclusion.

Spenser seems to have treated Aristotle's ethics as a reservoir of virtue-categories from which he would select twelve, one per book. The six books he completed give us *Holiness*, *Temperance*, *Chastity*, *Friendship*, *Justice*, *Courtesy*. Three of those map tightly to Aristotle (Temperance, Justice, Friendship). Three do not — Holiness is a Christian virtue unknown to the Nicomachean Ethics; Chastity is a Renaissance-Christian virtue cast from Aristotelian temperance; Courtesy is a chivalric virtue that Aristotle did not treat. In practice, Spenser's "Aristotelian" list is a Christianized chivalric ethic with Aristotelian terminology applied for prestige.

The unwritten six — had Spenser finished — would likely have included virtues like constancy (the Mutabilitie Cantos take up this theme), magnanimity (embodied already by Arthur), and possibly fortitude, liberality, magnificence-proper, and truth. We do not know; the projected twelve-book plan remained, by Spenser's death in 1599, a six-book poem plus two cantos of a seventh.

The reader's practical upshot: *Do not try to read Book I as a lesson on Aristotelian holiness*. Holiness in Book I is a Protestant Christian virtue, not an Aristotelian one. The Aristotelian frame is a structural conceit Spenser leans on; the actual moral content of the books is Spenser's own synthesis of classical, Christian, and chivalric ethics.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aristotle's Nicomachean Ethics — Spenser's named source for the twelve-virtue frame. A reader wanting to see what Spenser actually inherits from Aristotle (the doctrine of the mean, the notion of virtue as habit, magnanimity as the crown of virtues) should consult books II, IV, and IX especially.",
        workTitle: "Nicomachean Ethics",
        workAuthor: "Aristotle",
        passageReference: "Books II–VI",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 5. Gloriana = Elizabeth — the load-bearing identification ───────
  {
    id: "fq-letter-gloriana-elizabeth",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "In that Fairy Queen I mean glory in my general intention, but in my particular I conceive the most excellent and glorious person of our sovereign the Queen",
    anchorOccurrence: 1,
    title: "Gloriana is Elizabeth — and the doubleness of royal address",
    quotedPassage:
      "In that Fairy Queen I mean glory in my general intention, but in my particular I conceive the most excellent and glorious person of our sovereign the Queen, and her kingdom in Faery Land. And yet, in some places else, I do otherwise shadow her. For considering she beareth two persons, the one of a most royal Queen or Empress, the other of a most virtuous and beautiful lady, this latter part in some places I do express in Belphoebe, fashioning her name according to your own excellent conceit of Cynthia",
    passageReference: "Letter to Raleigh, §3",
    commentary: `This is the single most politically consequential sentence in the Letter, and it is worth reading three times.

Spenser here makes explicit what a 1590 reader would have intuited at once: the Faerie Queene, Gloriana, is Elizabeth I. Faery Land is Elizabeth's kingdom. The poem is dedicated to her — her portrait is on the frontispiece of the 1590 edition, and the poem's entire imaginative world is built as a compliment to her.

But notice the *mechanism* Spenser describes. He is not identifying Gloriana with Elizabeth as a one-to-one key. He is saying Elizabeth "beareth two persons" — the public majesty and the private virtue — and that Spenser *splits* her across multiple figures to address each aspect separately. Gloriana is Elizabeth as *glory* (her general intention). Belphoebe is Elizabeth as *virtuous and beautiful lady* (her private virtue). He hints that further figures elsewhere "shadow her" in still other aspects — Mercilla in Book V (Elizabeth as merciful justice), perhaps Britomart in some readings, Cynthia in Mutabilitie.

The term Spenser deploys to license this splitting — *two persons* — is the Tudor political-theological doctrine of the *king's two bodies*. Elizabeth, as sovereign, is simultaneously a *mortal body natural* (the virtuous lady) and an *immortal body politic* (Queen, Empress, the state's sacred office). Each of those bodies has its own figuration in the allegory. The doctrine was explicit in Elizabethan legal reasoning (Edmund Plowden's *Reports*, c. 1571) and Spenser assumes his reader knows it.

The "conceit of Cynthia" attributed here to Raleigh himself is a direct tip of the hat: Raleigh wrote (fragments survive; the complete work is lost) a poem called *The Ocean to Cynthia* in which Elizabeth appears as the moon-goddess Cynthia, Raleigh himself as the Ocean. Spenser is deferring to Raleigh's own image of the queen. This is courtly negotiation visible in real time — Spenser naming a collaborator-at-court and thanking him for an image he is about to borrow.

The political risk of this identification cannot be overstated. Spenser is an English colonial official in Ireland writing a 36,000-line allegorical compliment to his sovereign; every word is, in principle, legible back to the court. Book V's thinly-veiled trial of Mary Queen of Scots (as Duessa) before Mercilla (Elizabeth) — the most delicate political passage in the poem — reads back to this Letter's cautious admission that Elizabeth is *shadowed* across multiple figures, and that Spenser reserves the right to distribute her. The Queen read the poem; James VI of Scotland, Mary's son, read Book V and complained to her about it. Political allegory in 1590 had consequences.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Armada Portrait of Elizabeth (1588) — the iconographic counterpart of the Gloriana allegory. The portrait's globe-under-hand and defeated Spanish fleet articulate the public Elizabeth that Gloriana embodies; the same composite of majesty and virtue the Letter describes as needing two persons. The cover of this edition of The Faerie Queene uses the Armada Portrait deliberately.",
        workTitle: "The Armada Portrait",
        workAuthor: "anonymous (attributed variously to George Gower / Nicholas Hilliard circle)",
        passageReference: "1588; multiple contemporary versions extant",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },

  // ── 6. Arthur as Magnificence ───────────────────────────────────────
  {
    id: "fq-letter-arthur-magnificence",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "in the person of Prince Arthur I set forth Magnificence in particular",
    anchorOccurrence: 1,
    title: "Arthur as Magnificence — the virtue that contains all other virtues",
    quotedPassage:
      "So in the person of Prince Arthur I set forth Magnificence in particular; which virtue, for that (according to Aristotle and the rest) it is the perfection of all the rest, and containeth in it them all, therefore in the whole course I mention the deeds of Arthur appliable to the virtue, which I write of in that book.",
    passageReference: "Letter to Raleigh, §3",
    commentary: `This is the architectural claim of the whole twelve-book plan. Arthur is Magnificence; Magnificence is Aristotle's *megalopsychia* (Latin *magnanimitas*); and Spenser treats it as the *total* virtue — the sum that contains all the parts. Each of the twelve projected books centers on a knight who embodies *one* virtue; Arthur appears across all twelve at the crucial moment, and his deeds in each book are "appliable to the virtue which I write of in that book."

Why Magnificence and not another totalizing virtue? In Aristotle (Nicomachean Ethics IV.3), *megalopsychia* — usually translated "magnanimity" or "greatness of soul" — is the virtue of the person who knows they are worthy of great things and acts accordingly. It is a virtue that *presupposes* all the others: one can only be magnanimous if one is already temperate, just, courageous, and so on. The magnanimous person is not a better individual virtue-holder but a person in whom all the virtues cohere into a single integrated character. Aristotle calls it *kosmos tis ton areton* — "a sort of adornment of the virtues."

In medieval Latin scholastic tradition (Aquinas, who systematized Aristotle for Christian readers), *magnanimitas* is often rendered in English as *magnificence* — and this is the term Spenser takes. His Arthur is the Christian-Aristotelian *magnanimus*: the knight who, already possessed of all partial virtues, arrives at each knight's crisis and completes what they cannot complete alone.

The structural payoff of this choice: Arthur's appearances across the books are the moments at which the poem's partial-virtue-knights are shown to need something beyond their own virtue. Redcrosse cannot escape Orgoglio alone; Arthur must rescue him (I.viii). Guyon, exhausted from the Cave of Mammon, is defended by Arthur (II.viii). Britomart, pursuing Busirane, is joined by Arthur only after she has succeeded — acknowledging the virtue that holds her own. The pattern is consistent: the partial virtue encounters its limit, and Magnificence (Arthur, the whole) arrives to complete it.

This is why Arthur in the poem is always *before he was king*. The crowned Arthur of the Arthurian legend is Magnificence fulfilled in office. Spenser's Arthur is Magnificence *as education*, *in formation* — which is the same formal move Spenser makes with the whole poem: virtue is taught *in formation*, fashioned, not fixed.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aristotle, Nicomachean Ethics IV.3 — on megalopsychia/magnanimitas. The medieval Christian-Aristotelian synthesis (Aquinas) rechristens the virtue magnificentia; Spenser takes the Christian scholastic term.",
        workTitle: "Nicomachean Ethics",
        workAuthor: "Aristotle",
        passageReference: "IV.3",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 7. "Thrusteth into the middest" — in medias res rationale ──────
  {
    id: "fq-letter-in-medias-res",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "a Poet thrusteth into the middest, even where it most concerneth him",
    anchorOccurrence: 1,
    title: "\"A Poet thrusteth into the middest\" — why Book I opens where it does",
    quotedPassage:
      "But, because the beginning of the whole work seemeth abrupt, and as depending upon other antecedents, it needs that ye know the occasion of these three knights several adventures. For the method of a poet historical is not such, as of an historiographer. For an historiographer discourseth of affairs orderly as they were done, accounting as well the times as the actions; but a Poet thrusteth into the middest, even where it most concerneth him, and there recoursing to the things forepast, and divining of things to come, maketh a pleasing analysis of all.",
    passageReference: "Letter to Raleigh, §4",
    commentary: `Spenser is here defending his poem's *in medias res* opening — the technique of starting the story in the middle of events, inherited from Homer, theorized by Horace, and practiced by Virgil and Ariosto. Book I opens with Redcrosse already on his quest; we do not know who sent him, what he is seeking, or how he came to be riding with Una. Only in this Letter does Spenser explain the background.

The distinction between *historiographer* and *poet historical* is Horace's (*Ars Poetica* 147–149) and Aristotle's (Poetics, ch. 23) refracted through Renaissance poetic theory (Sidney, Minturno, Castelvetro). The *historiographer* tells events in the order they occurred; the *poet* picks up where the story is most dramatically charged and moves outward from that point, back-filling the past and foreshadowing the future as the moment requires.

Spenser then offers, in the remainder of the Letter, the *historiographical* version of what the poem's *poetic* opening omits: Gloriana keeps her annual feast of twelve days, on each of which a knight is assigned a quest. Book I is the *first* day's quest (Redcrosse and the dragon). Book II is the *second* (Guyon and Acrasia). Book III is the *third* (Britomart and Amoret) — though with a twist, because Britomart is already riding before Gloriana's feast begins, having been sent on her own prior quest. The first three books' frames are supplied here. For the second three (published 1596), Spenser gives no analogous key; the annual feast frame simply disappears from the poem.

Note what Spenser *never does*: he never actually writes Book XII, the climactic framing book. In his twelve-book plan, Book XII would be the annual feast itself, the narrative from which every other book's adventure departs. Spenser died after six books. The frame that would have held the whole thing together was always a future-tense promise.

The practical reading advice is this: *do not worry about the frame*. The Letter's framing narrative is a scaffold Spenser meant to build on but did not. Read Book I canto i — Redcrosse riding with Una — as a complete beginning in its own right. The poem does not require the twelve-day feast to function; the knights' quests are self-contained.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Horace's Ars Poetica defines in medias res as the poet's proper method. Spenser is following poetic-theory orthodoxy here; every Renaissance reader with grammar-school Latin would recognize the distinction he is drawing.",
        workTitle: "Ars Poetica",
        workAuthor: "Horace",
        passageReference: "lines 147–149",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Ariosto similarly begins Orlando Furioso in medias res — continuing Boiardo's unfinished Orlando Innamorato — and presumes his readers know the preceding story. Spenser's practice is Ariostan: start where the poem can catch fire, provide the background outside the poem for readers who need it.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto I",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 8. The never-delivered twelve-day feast frame ───────────────────
  {
    id: "fq-letter-twelve-day-feast",
    bookId: "the-faerie-queene",
    chapterNumber: 1,
    anchorText: "the Fairy Queen kept her annual feast",
    anchorOccurrence: 1,
    title: "The twelve-day feast — the frame Spenser never wrote",
    quotedPassage:
      "The beginning therefore of my history, if it were to be told by an historiographer, should be the twelfth book, which is the last; where I devise that the Fairy Queen kept her annual feast XII days; upon which XII several days, the occasions of the XII several adventures happened, which being undertaken by XII several knights, are in these XII books severally handled and discoursed.",
    passageReference: "Letter to Raleigh, §4",
    commentary: `Here Spenser gives the architecture of the whole poem he did not live to write. The plan:

- Gloriana holds an annual feast at her court of Cleopolis. It lasts *twelve days*.
- On each of the twelve days, a knight is sent out on an adventure (a distressed lady arrives, a quest is set, etc.).
- The twelve books of *The Faerie Queene* are the twelve adventures, one per day.
- Book XII — the *last* book of the poem, but *chronologically first* in the story — would narrate the feast itself, supplying the frame from which all other books launch.

It is a structure of almost cosmological symmetry. Twelve is the number of months in the year, signs of the zodiac, apostles, tribes of Israel; Spenser is laying a calendrical-sacred numerology over his allegorical-ethical architecture. The feast as framing device descends from the *Decameron* (Boccaccio's ten-day plague frame) and the *Canterbury Tales* (Chaucer's pilgrimage frame) — Spenser is building a late-Elizabethan version of the medieval tale-collection frame narrative, adapted to epic.

He then sketches the three opening quests: Redcrosse the "tall clownish young man" who asks for the first adventure (Book I's dragon-quest), Guyon dispatched to avenge Amavia (Book II), Britomart already on her own prior quest when the feast opens (Book III is her book, but she begins riding earlier). This is the level of detail Spenser gives his reader of the unwritten Book XII.

What Spenser published in 1590 is three books. What he published in 1596 is three more. Book VII, the Mutabilitie Cantos, published posthumously in 1609, is two cantos of a seventh book. Books VIII–XII never existed. The twelve-day feast was always a structural promise that the poem held out but did not fulfill. In a sense, the unfinished shape is the poem's truest shape — Spenser's late turn in the Mutabilitie Cantos toward *constancy under change* reads back onto the whole project as acknowledgment that no structure of twelves will hold.

A modern reader's question — "will I understand the poem if Book XII is missing?" — has a clear answer: yes. The individual books are self-contained quest-narratives. The missing frame is not required to read any individual book; it is required only to read the whole as a single formal object, which the poem, as it exists, is not.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Boccaccio's Decameron (c. 1353) uses a ten-day plague frame within which ten stories are told each day. Chaucer's Canterbury Tales (late 14c) uses a pilgrimage frame. Spenser's unwritten twelve-day feast frame is an extension of this medieval-Renaissance tale-collection architecture into epic scale.",
        workTitle: "The Canterbury Tales",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "General Prologue",
        targetBookId: "the-canterbury-tales",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "The Mutabilitie Cantos (Book VII, published 1609) end with two \"unperfite\" closing stanzas in which Spenser prays for the \"Sabbaoths sight\" of eternal rest — his last surviving verse. The contrast between the Letter's twelve-book confidence (1589) and the Mutabilitie fragment's exhausted prayer (written c. 1598) is the unwritten history of the poem's own ambition.",
        workTitle: "The Faerie Queene",
        workAuthor: "Edmund Spenser",
        passageReference: "Mutabilitie Canto VIII (fragment)",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },
]
