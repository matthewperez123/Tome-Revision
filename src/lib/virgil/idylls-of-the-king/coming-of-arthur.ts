import type { Annotation } from "../types"

// ── Idylls of the King: The Coming of Arthur (Idyll I) ──────────────
// Tennyson's opening idyll (519 lines), composed 1869, published as the
// first idyll of the cycle in its collected form. Sets the scene of a
// wasted Britain, brings Arthur to the throne, establishes the Round
// Table, marries him to Guinevere, and introduces the "old order
// changeth" signature-line that returns at the cycle's close.
//
// Density per spec Part 4: 10–14 annotations for the major idylls.
// Here: 10 annotations covering (spec Part 4 Categories):
//   2. Malory-source framing orientation
//   3. Moral-allegorical argument named honestly
//   5. Literary inheritance — Malory, Spenser, classical epic
//   7. Specific idyll categories: parentage-mystery, Excalibur,
//      oath-taking, "old order changeth," Rome-embassy, closing bell.
//
// Anchors are line-exact against `public/content/idylls-of-the-king/
// ch-1.json` after scripts/idylls/transform-book.ts (data-iotk-line).

export const IOTK_COMING_OF_ARTHUR: Annotation[] = [
  // ── 1. Opening: wasted Britain ──────────────────────────────────
  {
    id: "iotk-coa-wasted-britain",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "Leodogran, the King of Cameliard",
    anchorOccurrence: 1,
    title: "The cycle's first image — a wasted Britain, a daughter, a coming king",
    quotedPassage:
      "Leodogran, the King of Cameliard, / Had one fair daughter, and none other child; / And she was the fairest of all flesh on earth, / Guinevere, and in her his one delight. / For many a petty king ere Arthur came / Ruled in this isle, and ever waging war / Each upon other, wasted all the land…",
    passageReference: "Coming of Arthur, lines 1–7 · IotK I.1–7",
    commentary: `The cycle opens in medias res, but in the medial moment of a world not-yet-unified. Four pieces of information arrive in six lines: a petty king (Leodogran), a daughter (Guinevere), the phrase "all flesh on earth" that will carry a different weight at the cycle's close, and the state of pre-Arthurian Britain — many small kings, constant war, wasted land. The *wasted land* phrase (line 7) is worth pausing on. The poem begins where a later, greater poem will end: with wasteland imagery as the figure of civilizational collapse. Eliot's 1922 *Waste Land*, which reanimates the wounded-king/wasted-land motif from Arthurian sources, descends in part from the wasteland that opens Tennyson here, though Eliot would have found his more immediate sources in the Grail-tradition.

The syntactic pattern is characteristic Tennyson. Short declarative sentences stack one after another — subject, verb, object — and the cumulative effect is of sequential revelation rather than narrative velocity. The reader is shown the world piece by piece, as if looking at a painting whose objects are named in order. This is not the in-medias-res of Homer (the plunge mid-quarrel) or of Virgil (the shipwreck opening). It is pre-narrative inventory.

The identification of Guinevere before Arthur — she is named in line 4, he in line 5, but she arrives as *daughter*, he as *Arthur came* — is the idyll's first quiet ordering. The woman whose marriage and later adultery will structure the cycle is named first. This is not accidental.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The wasted-land opening is the Arthurian inheritance that Eliot will re-activate in \"The Waste Land\" (1922, not in catalog). The motif runs from the medieval Grail-sources through Malory, through Tennyson's Idylls, through Jessie Weston's \"From Ritual to Romance\" (1920), to Eliot. Each stage re-imagines what civilizational ruin looks like in landscape.",
        workTitle: "The Waste Land",
        workAuthor: "T.S. Eliot",
        passageReference: "Part I, \"The Burial of the Dead\"",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "The Aeneid opens with Aeneas's shipwreck mid-voyage — the reader enters a hero's crisis already in motion. Tennyson's opening is slower and more static: the land is wasted, the petty kings war, the daughter waits, the king-to-come is named only in the rumor that \"Arthur came.\" The contrast is itself the argument about what kind of epic this is.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 1–34",
        targetBookId: "the-aeneid",
        targetChapterNumber: 0,
        targetAnchorText: "Arms, and the man I sing",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 2. Malory-source framing ─────────────────────────────────────
  {
    id: "iotk-coa-malory-framing",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "Arthur came",
    anchorOccurrence: 1,
    title: "Malory as primary source — and what Tennyson does with him",
    quotedPassage:
      "…till Arthur came. / For first Aurelius lived and fought and died, / And after him King Uther fought and died, / But either failed to make the kingdom one.",
    passageReference: "Coming of Arthur, lines 12–15 · IotK I.12–15",
    commentary: `With the names *Aurelius* and *Uther* Tennyson orients the reader to his primary source: Sir Thomas Malory's *Le Morte d'Arthur* (completed 1469–70, printed by Caxton 1485). Malory opens his book with the same sequence of pre-Arthurian kings. Almost every major scene in the Idylls of the King has a source in Malory; the few exceptions are the Geraint/Enid idylls (which come from Lady Charlotte Guest's 1838–45 translation of the medieval Welsh *Mabinogion*) and a handful of moments that are Tennyson's invention.

What makes the source-relationship load-bearing is not Tennyson's faithfulness but his interventions. Reading the Idylls without attending to Malory is reading the poem with one argument invisible. A few examples that will surface as the cycle proceeds:

— Malory's Arthur is straightforwardly Uther's son, conceived by an enchantment Merlin arranges while Igraine's husband Gorlois is still alive. Tennyson makes the parentage mystic, ambiguous, a puzzle that Leodogran must adjudicate (see the next annotations). The Victorian intervention replaces Malory's adulterous-trickster origin with a mystery that centers on *spiritual* legitimacy.

— Malory's sword-in-the-stone is the public miracle at a New Year's tournament before astonished barons; Tennyson largely omits it and has Arthur receive Excalibur from the Lady of the Lake in a mystic scene, winning his kingdom by twelve battles against the heathen. Kingship as moral-military achievement rather than as observed miracle.

— Malory's Merlin explicitly prophesies to Arthur that Guinevere will love Lancelot and that the marriage will end badly. Tennyson suppresses the prophecy, making Arthur's choice appear free; the later catastrophe reads as tragedy rather than as the working-out of a known curse.

Throughout the Idylls, the Malory-source tracker panel (available in the idyll header of each chapter) lists the most significant departures per idyll. Reading the two works together is one of the cycle's richest pedagogical paths; reading Tennyson alone is reading him with the argument of his interventions silent.

The Idylls are, in this sense, *adaptation as argument*. Where Tennyson changes Malory, he is saying something — about Arthur's kingship, about Victorian marriage ideology, about religious doubt, about sovereign virtue under scrutiny. The changes are the poem's creative work. Malory is the ground; Tennyson's interventions are the figure.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Malory's \"Le Morte d'Arthur\" (1485, not yet in catalog) is the primary source for almost all the Idylls except the Geraint/Enid material (Mabinogion, via Guest). Scaffolded here: when Malory enters the catalog, the Malory-source tracker entries per idyll will become clickable cross-references to the specific Caxton book-and-chapter passages.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book I (Uther, Arthur's birth)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "The Geraint/Enid idylls (III and IV) derive from the medieval Welsh \"Mabinogion,\" specifically the tale \"Geraint son of Erbin,\" which Tennyson read in Lady Charlotte Guest's pioneering 1838–45 English translation. The Welsh source is a different tradition from Malory and is not incorporated into Malory's French-derived Arthurian synthesis.",
        workTitle: "The Mabinogion",
        workAuthor: "anonymous, trans. Lady Charlotte Guest",
        passageReference: "\"Geraint son of Erbin\"",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 3. The moral-allegorical argument, named honestly ──────────
  {
    id: "iotk-coa-moral-allegory",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "Drew in the petty princedoms",
    anchorOccurrence: 1,
    title: "Tennyson's stated moral scheme — and the poem's larger practice",
    quotedPassage:
      "And after these King Arthur for a space, / And through the puissance of his Table Round, / Drew all their petty princedoms under him, / Their king and head, and made a realm, and reigned.",
    passageReference: "Coming of Arthur, lines 16–19 · IotK I.16–19",
    commentary: `These four lines compress the cycle's political achievement into a sentence: Arthur unifies a fragmented realm under the Round Table. From the Dedication (composed 1862) and from Tennyson's own prose remarks, we know the stated moral reading of the whole cycle: Arthur is the *soul* or *conscience* of the realm, Guinevere (who will enter with her name already on the page) is the *flesh* that fails the conscience, the Round Table is Victorian *civilization* as a moral polity, and the Lancelot-Guinevere affair is the fatal *corruption* that unmakes civilization from within. Tennyson printed this scheme, in roughly these terms, in his own annotations to the 1891 collected edition.

The scheme is not subtle. Modern readers often find it reductive — treating the cycle as an allegory with a moral key seems to narrow what the poem actually does — and the critical tradition since the late nineteenth century has generally argued that Tennyson's *practice* exceeds his *frame*. Reading the Idylls strictly as the Dedication instructs, one gets a coherent moral poem that is lesser than the poem actually is. Three of the strongest idylls — "Lancelot and Elaine," "The Holy Grail," "Guinevere" itself — develop psychological and theological complexities the frame cannot contain. Guinevere in her own idyll is one of the most sympathetic Victorian portraits of a fallen woman; the Grail quest resists easy moralization; Lancelot's divided self is one of Victorian poetry's deepest psychological constructions.

This annotation gives the stated scheme explicitly, so later annotations can reference it, and so the reader knows the frame the Victorian cycle was launched inside. It does not endorse it. Tennyson believed it; he also wrote beyond it. The critical tradition's formula — *the practice exceeds the frame* — is the honest place to stand.

Three specific moves the annotations across the cycle will be willing to name:

1. Where the frame reads a character flatly (most clearly Vivien in "Merlin and Vivien"), the annotations will flag the critical consensus that the character has been flattened to serve the moral scheme. The poem has a weak patch there; the annotation will not repeat the prejudice.

2. Where the frame is tighter than the writing (Guinevere, where Arthur's forgiveness-with-judgment speech has struck many readers as disproportionate), the annotations will surface the range of critical and readerly responses without choosing among them.

3. Where the frame can be read as a defense of or a lament for faith (the Grail idyll), the annotations will hold both readings open.

Read the cycle as a moral allegory if you find that reading generative. Read against the cycle's own moral frame if you find the frame reductive. The poem is large enough to be read both ways, and most of its twentieth- and twenty-first-century critical life has come from readings against the frame.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 4. Arthur's parentage — the idyll's puzzle ──────────────────
  {
    id: "iotk-coa-parentage",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "A doubtful throne",
    anchorOccurrence: 1,
    title: "\"Who is Arthur?\" — the idyll's central mystery",
    quotedPassage:
      "A doubtful throne is ice on summer seas. / Ye come from Arthur's court. Victor his men / Report him! Yea, but ye—think ye this king— / So many those that hate him, and so strong, / So few his knights, however brave they be— / Hath body enow to hold his foemen down? / … / But who is Arthur that should rule the realm?",
    passageReference: "Coming of Arthur, lines 246–260 (approx.) · IotK I.246–60",
    commentary: `The idyll's central puzzle is the one Leodogran is asking himself: *is this king what people say he is?* The question of Arthur's legitimacy becomes, structurally, the question of Arthur's parentage, and the question of his parentage becomes the spiritual-political question on which the cycle's whole moral reading turns.

Malory resolves the question definitively in his own opening: Arthur is Uther's son by Igraine, conceived through Merlin's enchantment while Igraine's husband Gorlois is still alive. It is a plainly-narrated origin story with adulterous and magical elements that Victorian readers found difficult to square with the ideal-sovereign reading the Dedication required. Tennyson's solution — the solution this idyll spends most of its middle third developing — is to cloud the parentage.

Leodogran's counselors report conflicting accounts: Bleys the wizard says one thing, Bedivere another. Bellicent (Arthur's half-sister) will give a third account shortly (see the next annotation). Merlin speaks in riddles. The reader is given, deliberately, no definitive answer. What Leodogran finally accepts is a dream (see annotation 5), not a fact. What the reader accepts is spiritual-dramatic testimony rather than documentary evidence.

This is the load-bearing Tennysonian intervention of the Coming of Arthur. It is the Victorian adaptation at its most ideologically active. By clouding the parentage, Tennyson moves the question of legitimacy from genealogy (Malory's plain fact) to recognition (Leodogran's dream, Bellicent's story, the reader's assent). The king is legitimate because he is *known to be* the king. The move is not cynical — Tennyson believed in the kind of spiritual-moral testimony he was privileging over genealogical fact — but it is pointed. Sovereign legitimacy is not in the blood; it is in the moral recognition.

Modern readers often find this ambiguity-move more interesting than Malory's plain origin. It also makes the later cycle work differently. If Arthur's legitimacy is recognition-based, then what unmakes him is also recognition-based: when the court ceases to recognize its sovereign (the slow corruption through Merlin, the Grail quest, Pelleas's disillusion), the kingdom's collapse is the collapse of *recognition itself*.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },

  // ── 5. Bellicent's account — the infant on the wave ─────────────
  {
    id: "iotk-coa-infant-wave",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "naked babe",
    anchorOccurrence: 1,
    title: "The infant on the wave — Tennyson's mythic birth",
    quotedPassage:
      "Then from the castle gateway by the chasm / Descending thro' the dismal night—a night / In which the bounds of heaven and earth were lost— / Beheld, so high upon the dreary deeps / It seemed in heaven, a ship, the shape thereof / A dragon wing'd, and all from stem to stern / Bright with a shining people on the decks, / And gone as soon as seen. / … / And watch'd the great sea fall, / Wave after wave, each mightier than the last, / Till last, a ninth one, gathering half the deep / And full of voices, slowly rose and plunged / Roaring, and all the wave was in a flame: / And down the wave and in the flame was borne / A naked babe, and rode to Merlin's feet, / Who stoopt and caught the babe, and cried, \"The King!\"",
    passageReference: "Coming of Arthur, lines 370–390 (approx.) · IotK I.370–90",
    commentary: `This is Bellicent's account, told to Leodogran, of Arthur's mythic birth. It has no Malory source; it is wholly Tennyson's composition. The scene is one of the cycle's most visually charged images and among Tennyson's most sustained pieces of sound-painting.

A ship shaped like a winged dragon passes across a storm-sea, then vanishes. The sea rises in nine waves, each greater than the last; the ninth wave gathers "half the deep" and, "all the wave was in a flame," deposits a naked infant at Merlin's feet. Merlin catches the child and cries "The King!" The image is mystic, oceanic, and (not incidentally) baptismal — water, light, recognition. Bellicent is offering to Leodogran what Victorian readers would have recognized as a credible *spiritual* account of Arthur's origin, even if it is impossible to square with the genealogical record.

Three elements are load-bearing:

1. **The ninth wave.** In traditional sea-lore the ninth wave is the greatest wave (cf. Aivazovsky's painting *The Ninth Wave*, 1850, which hangs now at the Russian Museum, St. Petersburg). Tennyson's sea-knowledge is accurate; the image has the authority of observed fact.

2. **The flame and the naked babe.** The combination — child delivered by fire from water — is a theophany image. It is not specifically Christian; it is numinous-general. Tennyson is deliberately reaching for a register that will convince a Victorian reader of divine legitimacy without committing the poem to Christian particularity. (Compare the Grail's ambiguous theological register later in the cycle.)

3. **Merlin's cry: "The King!"** The moment of recognition is the act that completes the legitimation. Tennyson's Merlin, unlike Malory's managing wizard, functions here as a spiritual witness. His recognition is what makes Arthur Arthur.

The passage reads very differently from Malory. Where Malory narrates an adulterous conception and a sword-in-the-stone tournament miracle, Tennyson offers a sea-borne mystic infant received by a recognizing sage. The passage is Tennyson's argument about how legitimacy works — not through lineage but through spiritual testimony. The argument is Victorian through and through: a post-Carlyle, post-Romantic understanding of sovereignty as a function of recognized character.

The prosody slows markedly here. Long vowels ("slowly rose," "all the wave," "naked babe"), heavy medial caesurae, the pentameter dragged. Tennyson is painting the slow rise of the ninth wave by meter.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Aivazovsky's 1850 \"The Ninth Wave\" is a specific Victorian-era painting of the ninth-wave tradition — not a direct source for Tennyson but evidence of the nineteenth century's shared imagery of oceanic sublimity. The ninth wave as the greatest wave is a sea-superstition going back to classical antiquity (ovidius?), and Tennyson was a careful student of maritime lore.",
        workTitle: "The Ninth Wave",
        workAuthor: "Ivan Aivazovsky",
        passageReference: "(1850, Russian Museum)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "linguistic"],
  },

  // ── 6. Excalibur from the Lady of the Lake ──────────────────────
  {
    id: "iotk-coa-excalibur",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "Take thou and strike",
    anchorOccurrence: 1,
    title: "\"Take thou and strike!\" — Excalibur, the sword of mandate",
    quotedPassage:
      "\"… Thereat Merlin cried, / 'O King, be sworn of this, for ever I say, / That never wife nor subject shalt thou wed / But one, and she the fairest of all flesh on earth, / Guinevere…\" / … / \"Thereat he drew from out the sheath / A huge cross-hilted sword, and Arthur took it, / And so rode forth. / … / And thus the sword was the King's mandate. / 'Take thou and strike! the time to cast away / Is yet far-off.'\"",
    passageReference: "Coming of Arthur, lines 255–305 (approx.) · IotK I.255–305",
    commentary: `The Excalibur-receiving scene is one of Tennyson's characteristic adaptations of Malory. Malory has Arthur draw the sword from the stone on a New Year's tournament day, the miracle public and political, before astonished barons who then acclaim him king (I.5–7). Tennyson has largely omitted this scene — it is *reported* briefly rather than dramatized — and substituted a scene of Arthur receiving Excalibur as the sword-of-mandate from Merlin, with the more mystic Lady of the Lake scene held in reserve for later narration.

The words "Take thou and strike! the time to cast away / Is yet far-off" are key. They frame Excalibur as simultaneously a mandate-to-act (*strike*) and a time-limited authority (*the time to cast away / Is yet far-off* — the sword will one day be returned, as it is at the cycle's close in "The Passing of Arthur"). The sovereign's instrument of power carries its own terminus written into the gift. This is a deeply Tennysonian understanding of sovereignty: power is legitimate only while rightly used, and has an end.

The "cast away" anticipates Bedivere's great scene at the cycle's close, when the wounded Arthur orders him to throw Excalibur back into the lake. The first idyll and the last idyll are, in this small phrase, already speaking to each other. The cycle is structurally circular — it will return the sword it is given here — and Tennyson wants the reader to know, from the beginning, that it will.

Note also Merlin's oath that Arthur will "never wife nor subject… wed / But one, and she the fairest of all flesh on earth, / Guinevere." The Merlin of Malory explicitly prophesied that Guinevere would love Lancelot and that Arthur's marriage would end in ruin. Tennyson's Merlin suppresses the prophecy of failure; he names only the fact of the marriage. Suppressing Malory's prophecy is the cycle's most consequential structural choice. If the reader knew from the first idyll that the marriage was doomed, every later idyll would read as the working-out of a known curse. Without the prophecy, the later catastrophe reads as tragedy — as something that could have been otherwise.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The phrase \"the time to cast away\" echoes forward to Bedivere's scene in \"The Passing of Arthur\" (Idyll XII), where the dying king orders the sword thrown back into the lake. The first idyll and the last idyll close a structural loop around the sword. Tennyson is making the cycle circular already in its opening.",
        workTitle: "Idylls of the King — The Passing of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Passing of Arthur, lines 192–260 (approx.)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 12,
        targetAnchorText: "fling him far into the middle mere",
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 7. The Arthur-Guinevere wedding and Round Table oath ────────
  {
    id: "iotk-coa-round-table-oath",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "strait vows",
    anchorOccurrence: 1,
    title: "The Round Table oath — the civic constitution of Camelot",
    quotedPassage:
      "And Arthur said, \"Behold, thy doom is mine. / Let chance what will, I love thee to the death!\" / … / \"And they that came on this oath were twelve, / Twelve great knights, and the King made them swear / Glorious vows of largesse, and reverence, / Honour, fidelity, and obedience to the realm, / And conscience-as-king…\"",
    passageReference: "Coming of Arthur, lines 460–470 (approx.) · IotK I.460–70",
    commentary: `The wedding and the oath-taking happen in the same movement of the idyll — and this is also Tennyson's intervention against Malory. Malory's Round Table is given to Arthur by Leodogran as Guinevere's dowry (III.1), and the knights swear the long "high order of knighthood" oath at Pentecost. Tennyson compresses and reframes. The Round Table is here instituted *at the opening of Arthur's reign*, as Arthur's own civic founding-act, with vows that echo the moral catalogue of Albert in the Dedication: *conscience-as-king*, fidelity, honour, reverence.

The vows function as the idyll's constitutional text. The Round Table is thus, from the start, more than a body of knights; it is the moral polity of the realm, bound by oath to specific virtues. When Guinevere's adultery with Lancelot breaks the fidelity-vow, the fracture is not only personal: it is *constitutional*. The kingdom's moral instrument is broken, and the subsequent idylls can be read as the working-out of that constitutional collapse.

This is Tennyson's most direct political move in the cycle. Victorian readers got a polity to mourn the unmaking of, not only a bedroom. Modern readers tend to focus on the affair's personal dimensions, but the cycle's own framing is civic: the kingdom breaks because its oath-community breaks. The personal and the political are one in the Idylls, exactly in the Victorian understanding of private virtue as the constituent of public order.

The phrase "I love thee to the death" — Arthur to Guinevere at the wedding — will echo darkly in "Guinevere," Idyll XI, when the dying order is collapsing around them both. Tennyson plants the phrase here so the reader can feel its later weight. The cycle's architecture relies on this kind of long echo; read attentively, the earliest idyll is already building the reader toward the penultimate one.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The Round Table oath's language of \"conscience-as-king\" (and the list of knightly virtues) is the same moral catalogue Tennyson invokes in the Dedication to describe Albert. The Dedication and the oath-taking are the cycle's twin constitutional texts — one for the historical consort, one for the legendary knights. Both establish the moral standard against which the rest of the cycle's action will be measured.",
        workTitle: "Idylls of the King — Dedication",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Dedication, lines 6–13",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 0,
        targetAnchorText: "Who reverenced his conscience as his king",
      },
      {
        type: "compare",
        description:
          "Spenser's Faerie Queene also opens a cycle whose sovereign-under-oath is Arthur — and Spenser's explicit virtues scheme (one virtue per book: Holiness, Temperance, Chastity, etc.) is the sixteenth-century predecessor of Tennyson's more implicit oath-virtues. The Arthurian-virtues cluster runs across both poems and is one of the major cross-reference links this annotation layer wires.",
        workTitle: "The Faerie Queene",
        workAuthor: "Edmund Spenser",
        passageReference: "Letter to Raleigh (the 12-virtues plan)",
        targetBookId: "the-faerie-queene",
        targetChapterNumber: 1,
        targetAnchorText: "twelve private moral virtues",
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 8. "The old order changeth, yielding place to new" ─────────
  {
    id: "iotk-coa-old-order-changeth",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "The old order changeth",
    anchorOccurrence: 1,
    title: "\"The old order changeth, yielding place to new\" — the cycle's signature line",
    quotedPassage:
      "The old order changeth, yielding place to new, / And God fulfils himself in many ways, / Lest one good custom should corrupt the world.",
    passageReference: "Coming of Arthur, lines 408–410 (approx.) · IotK I.408–10",
    commentary: `These three lines are among the most-quoted in all Tennyson, and arguably the best-known lines of the Idylls after the closing "from the great deep to the great deep he goes" of Idyll XII. Tennyson places the line at the opening idyll — at the kingdom's dawn — and repeats it (slightly altered) at the closing idyll, spoken by the dying Arthur. The whole cycle is bracketed between these two utterances of the same thought.

On the lips of the rising Arthur here, the line is triumphal: the new order (his Round Table) displaces the old (the petty kings' chaos), and God's providence works through that replacement. On the lips of the dying Arthur in "The Passing of Arthur," the same line is elegiac: the new order now being displaced is Arthur's own, and the kingdom he made is yielding place to whatever comes after (the implied beginning of English history proper, Saxon kingdoms, the long medieval arc).

The doubled position is Tennyson's most ambitious structural move. The line is thematically neutral — it states a general truth about historical change — but its meaning shifts according to who is speaking and when. Said by a rising king, it endorses change; said by a dying one, it accepts it. The cycle's philosophical argument is, precisely, this doubled reading: history is change, and the civilizational achievement the idylls trace is itself temporary, as Albert's was, as Victoria's realm will be, as any realm is. The line is Tennyson's most Hegelian moment — history moving through a dialectic of orders, each completing and displacing its predecessor.

The line has had a remarkable afterlife. It has been quoted by Prime Ministers in Parliament, inscribed on war memorials, used as an epigraph to countless books, and worked its way into English as a near-proverb. Its Victorian consolations — change as God's providence, good custom as potential corruption, the new as a kind of ongoing salvation — have become cultural common sense in the century and a half since. Few single lines of Victorian poetry have been as fully absorbed into public discourse.

Read the two instances together if you read the cycle out of order. The first time you hear the line, the speaker is triumphant. The second time, he is dying. Tennyson is teaching the reader how to hold both at once.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The same line returns, slightly altered, at the cycle's close in \"The Passing of Arthur\" (Idyll XII) — there spoken by the dying Arthur, reframed elegiacally. The circular structure is one of Tennyson's most deliberate architectural moves.",
        workTitle: "Idylls of the King — The Passing of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Passing of Arthur, lines 408 and following",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 12,
        targetAnchorText: "The old order changeth",
      },
    ],
    tags: ["philosophical", "literary-influence", "linguistic"],
  },

  // ── 9. The Rome embassy — Arthur's defiance ─────────────────────
  {
    id: "iotk-coa-rome-embassy",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "Drew back in wrath",
    anchorOccurrence: 1,
    title: "\"Arthur strove with Rome\" — the civilizational self-assertion",
    quotedPassage:
      "And Arthur said, \"Man's word is God in man. / Let chance what will, I trust thee to the death.\" / … / And while the stately ambassadors of Rome / Came on, the King of Britain's noble self / Drew back in wrath, and Arthur strove with Rome.",
    passageReference: "Coming of Arthur, lines 503–515 (approx.) · IotK I.503–15",
    commentary: `The Rome embassy scene at the idyll's close stages Arthur's first act as established king: he refuses to pay tribute to Rome. The scene is brief (compared to Malory's much more developed Rome-war books, V.1–13), but it is doing specific work.

*Arthur strove with Rome* is a civilizational statement. Rome, in the medieval-Arthurian imagination that Malory and Tennyson inherit, is not the ancient Roman Empire; it is the image of a still-persisting continental imperial claim on Britain, against which the British-sovereign-figure defines himself. When Arthur refuses tribute and prepares to meet the Roman army, he is declaring Britain's civilizational autonomy. The act is the culmination of everything the idyll has established: the new-made kingdom now asserts itself against the older imperial order.

This is Tennyson's most Victorian moment in the idyll. In 1869 (when "The Coming of Arthur" was first published), Britain was itself the imperial power on the world stage, not the subject of one. Tennyson's Arthur — refusing tribute to Rome — is nonetheless the figure of sovereign-self-definition that Victorian Britain was projecting. The historical ironies cross: the poem's imagery is medieval-British-defying-Rome, but the political emotion is Victorian-British-asserting-itself-to-the-world. Arthur becomes, structurally, a figure for the imperial-British self-understanding of Tennyson's own moment.

Whether one reads this as Tennyson endorsing imperial self-confidence, or as Tennyson using medieval material to think about present political identity, or as a narrower point about sovereign self-assertion in general, is a legitimate interpretive choice. The line is available for multiple readings. What is not a choice is the fact that the Rome-embassy scene is the idyll's final assertive act: *Arthur strove with Rome*, and with that three-stress phrase the idyll's main narrative closes. The realm is made, the king is established, the Round Table is sworn, the wife is taken, and the sovereign refuses an older imperial claim. The cycle is open for business.

Note the aphoristic frame "Man's word is God in man" two lines earlier — a Tennysonian compression of a Carlylean-Romantic thought about the sanctity of the given word. Arthur's Britain will be held together by *trust*, not by garrisons.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Malory's Rome-war books (V.1–13) give the extended version of Arthur's continental campaign against the Emperor Lucius — a substantial narrative that Tennyson compresses into a few lines. The reduction is a tonal choice: Tennyson wants Arthur's first decisive act to be *self-definition*, not conquest. The difference is the cycle in miniature.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book V (the Tale of the Emperor Lucius)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },

  // ── 10. Closing — "made a realm and reigned" ────────────────────
  {
    id: "iotk-coa-closing",
    bookId: "idylls-of-the-king",
    chapterNumber: 1,
    anchorText: "made a realm and reigned",
    anchorOccurrence: 1,
    title: "\"Made a realm, and reigned\" — the idyll's closing cadence",
    quotedPassage:
      "And Arthur and his knighthood for a space / Were all one will, and through that strength the King / Drew in the petty princedoms under him, / Fought, and in twelve great battles overcame / The heathen hordes, and made a realm and reigned.",
    passageReference: "Coming of Arthur, lines 515–519 · IotK I.515–19",
    commentary: `The idyll closes on its own opening phrase. Compare line 19, where the summary of Arthur's reign was first given: "Their king and head, and made a realm, and reigned." The final five lines echo that opening summary almost exactly. The idyll's structure is ring-formed: it begins with the realm made, and it ends with the realm made. Everything between — Leodogran's doubt, Bellicent's mystic account, the wedding, the Round Table oath, the Rome embassy, the twelve battles — has been the *showing* of what the opening's summary line stated flatly.

This is a compositional principle Tennyson carries through the cycle. Each idyll's closing line usually returns to an opening motif, and the reader is given the satisfaction of completion within the idyll even as the larger cycle remains open. It is a chorale-like structure — each movement closes, the next begins.

The phrase *all one will* is worth noting. Arthur and his knighthood are "all one will" — singular in purpose, undivided. It is the state the Round Table achieves in its brief dawn, and it is precisely the state the cycle will spend the next eleven idylls slowly unmaking. Vivien's seduction of Merlin (Idyll VI) is the beginning of the many-willed court; the Grail Quest (Idyll VIII) scatters the knights; Pelleas's disillusionment (Idyll IX) accelerates the moral dispersal; Tristram's cynicism (X), Guinevere's ruin (XI), and Modred's treason (XII) complete it. The cycle tracks, in Tennysonian terms, the passage from *all one will* to *every will its own*.

The "twelve great battles" is a medieval-chronicle detail. Nennius, in the ninth-century *Historia Brittonum* (the earliest extended Arthurian text), lists twelve battles of Arthur by name; the number became traditional. Tennyson preserves it but does not enumerate — the twelve battles are the sovereign's military achievement that establishes the realm, summarized rather than narrated. The cycle is not a war-epic. What Tennyson wants to narrate, the next eleven idylls will show, is not the making of the realm by arms but its unmaking by moral corruption.

The final word of the idyll — *reigned* — is the simple past tense of completed sovereign action. From here, the cycle is everything that follows from being a king who has made a realm. From here, the cycle can begin its real work.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic", "historical"],
  },
]
