import type { Annotation } from "../types"

// ── Idylls of the King: Gareth and Lynette (Idyll II) ──────────────
// Tennyson's 1872 idyll (11,417 words — the cycle's second-longest
// after Lancelot and Elaine), composed late, set at the cycle's
// brightest morning. The comic-romantic idyll: young knight in
// kitchen-disguise, scornful lady, four allegorical opponents, final
// unhelming of "Night" as a boy's face. Close to Malory VII.1–36,
// with the four knights allegorized into Morning-Star / Noon-Sun /
// Evening-Star / Night — Tennyson's superimposition.
//
// Density: 10 annotations, tighter register than the Opus clusters
// (spec's "Sonnet" allocation).

export const IOTK_GARETH_AND_LYNETTE: Annotation[] = [
  {
    id: "iotk-gal-opening",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "The last tall son of Lot and Bellicent",
    anchorOccurrence: 1,
    title: "The cycle's bright morning — Gareth at the spate",
    quotedPassage: "The last tall son of Lot and Bellicent, / And tallest, Gareth, in a showerful spring / Stared at the spate.",
    passageReference: "Gareth and Lynette, lines 1–3 · IotK II.1–3",
    commentary: `Tennyson wrote this idyll in 1872, late in the cycle's composition, after he had already finished the darker late-idylls (the Grail in 1869, the Passing of Arthur in 1869, the Last Tournament in 1871). The chronological irony is significant: the idyll of the cycle's brightest morning is written by a poet who already knows how the kingdom falls.

The opening is characteristically spare. *The last tall son* — Gareth is youngest of Bellicent's three sons (Gawain, Gaheris, Gareth in Malory; Tennyson adjusts). *Tallest* — the doubling of adjective establishes him bodily. *Stared at the spate* — a Scottish-inflected noun for a swollen river-rush. The showerful spring, the whirling pine, the boy watching water crash down: we are in a Northern-British register, Romantic-landscape, with a youth's unformed energy.

The idyll's tonal signature is set here — brightness, generous body, openness to the world. Every subsequent dark idyll reads against this opening. When the Round Table falls in later idylls, it falls from exactly this condition: tall sons watching spring spates, confident, unformed, in love with force.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-gal-malory-source",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "kitchen-knave",
    anchorOccurrence: 1,
    title: "Malory's Tale of Sir Gareth — the closest idyll to its source",
    quotedPassage: "\"…Or tell my name to any—no, not the King. / Then should I fail to win my lady's love / Unless I earn it by some noble deed, / As Gareth of the Orkneys, Arthur's cousin, / Arthur's kitchen-knave.\"",
    passageReference: "Gareth and Lynette, kitchen-knave motif (multiple occurrences)",
    commentary: `Of the twelve idylls, *Gareth and Lynette* is the closest to its Malory source. Malory's *Tale of Sir Gareth of Orkney* (Book VII, 36 chapters) gives Tennyson the bones almost intact: Gareth arrives at court incognito, serves a year under Kay's mockery as "Beaumains" (Fair-hands; Malory's nickname, which Tennyson mostly drops), rides out with a scornful damsel (Linet/Lynette) who mocks him throughout, defeats four knights of increasing rank, and rescues the imprisoned lady Lyonors.

Tennyson preserves the sequence. Where he diverges is at two specific points: the allegorization of the four knights (next annotation) and the ending's choice of bride (final annotation). Otherwise the idyll honors Malory as a showcase of the Round Table's humane generosity — a young knight rises through service, a scornful woman's mockery turns to respect, and the chivalric system works as advertised.

This is structurally important. The cycle needs at least one idyll where the Round Table's ideal is shown *functioning as intended*, not breaking down. *Gareth and Lynette* is that idyll. It is the idyll you can read against all the later corruption-idylls to see what the Round Table looked like when it worked.`,
    crossReferences: [
      {
        type: "source",
        description: "Malory's Tale of Sir Gareth of Orkney (Book VII, 36 chapters) — the \"Beaumains\" story. Tennyson preserves the structure closely; the departures are the allegorical four-knight sequence and the ending's choice of bride.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Sir Thomas Malory",
        passageReference: "Book VII.1–36",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-gal-camelot-vision",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "silver-misty morn",
    anchorOccurrence: 1,
    title: "Camelot seen through silver-misty morn — the city of allegory",
    quotedPassage: "\"So, when their feet were planted on the plain / That broadened toward the base of Camelot, / Far off they saw the silver-misty morn / Rolling her smoke about the Royal mount, / That rose between the forest and the field.\"",
    passageReference: "Gareth and Lynette, Camelot-approach passage",
    commentary: `Gareth's first sight of Camelot is one of the cycle's signature visual passages. Silver mist, the Royal mount, the city rising between forest and field — Tennyson gives the capital its most glamorous introduction anywhere in the idylls. A page of description follows: the city as "rich in emblem and the work / Of ancient kings who did their days in stone," with Merlin's wrought figures at the gate that seem to move.

This descriptive set-piece is the idyll's mood. Where Malory simply has Gareth arrive at Arthur's court, Tennyson gives the arrival a visionary register. Camelot is not just a place; it is an emblem-city, a civilizational artifact. Gareth sees it before he serves in it; the reader sees it before the cycle will dismantle it.

The passage is also one of the prosody panel's curated sound-passages. Read aloud, the s-sounds and l-sounds (*silver-misty morn*, *rolling her smoke*) produce the morning-haze effect by ear. The alliteration is looser than in Beowulf or *The Passing of Arthur* but characteristically Tennysonian.`,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  },

  {
    id: "iotk-gal-lynette-scorn",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "scorn of Gareth",
    anchorOccurrence: 1,
    title: "Lynette's scorn — the courtly convention honored and undermined",
    quotedPassage: "\"…for the scorn of Gareth whom he used / To harry and hustle.\"",
    passageReference: "Gareth and Lynette, Kay's continuing scorn / Lynette's initial scorn",
    commentary: `Lynette enters Arthur's hall with a request for a knight to rescue her sister Lyonors, besieged by four evil knights. Arthur grants her Gareth, who rises from the kitchen to claim his promised boon. Lynette, seeing a kitchen-boy dispatched where she had expected Lancelot, erupts: *Ay, truly of a truth, / And in a sort, being Arthur's kitchen-knave!* The scorn is instantaneous and continues throughout the outward journey — she calls him smutty, makes him ride behind her, mocks him after each victory.

The scorn-sequence is one of the cycle's oldest chivalric conventions: the tested knight vindicates himself through deeds; the scornful lady's contempt turns to respect. Malory uses it in good faith. Tennyson uses it with more self-consciousness — Lynette's scorn is overwritten, almost comic, and her eventual warming is made a little silly. The idyll knows the convention it is using.

Lynette's palette note (from the speaker legend) says her register shifts subtly from cold to warmer across the idyll. The palette captures what the writing enacts. Read attentively, every Lynette passage after a Gareth victory softens slightly; the tonal arc is visible in the prosody.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },

  {
    id: "iotk-gal-four-knights-allegory",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "Morning-Star, and Noon-Sun, and Evening-Star",
    anchorOccurrence: 1,
    title: "Morning-Star, Noon-Sun, Evening-Star, Night — Tennyson's allegorical superimposition",
    quotedPassage: "\"…Morning-Star, and Noon-Sun, and Evening-Star, / Being strong fools; and never a whit more wise / The fourth, who alway rideth armed in black, / A huge man-beast of boundless savagery.\"",
    passageReference: "Gareth and Lynette, four-knights allegory",
    commentary: `This is Tennyson's single largest departure from Malory in the idyll. Malory's four opposing knights are the Black, Green, Red, and Indigo (or Blue) Knights — straightforwardly chivalric, named by the colors of their armor, without allegorical content. Tennyson converts them into stages of the day: Morning-Star, Noon-Sun, Evening-Star, and Night. The allegory is his.

What does the scheme mean? Two readings are available:

1. **Stages of life.** Morning-Star = youth, Noon-Sun = adulthood at its height, Evening-Star = maturity-in-decline, Night = death. Gareth defeats each stage in turn, finishing with death itself — and when Night unhelms, he is a boy's face. The allegory-sequence is defeated by a joke: *death is only a blooming boy*.

2. **Stages of the day as cosmological structure.** The four become astrological or diurnal forces, and Gareth's defeat of each becomes the young knight's mastery over time itself. This is the cycle's brightest claim — that youth can survive the day's whole arc.

Both readings live in the text. The idyll is playful about its own allegory — Tennyson knows these superimposed names are over-serious, and the Night-unhelming-as-grinning-boy is the deflation of the scheme. He is simultaneously writing the allegory and mocking it.

This tonal double-work is why the idyll is so much more fun than it initially reads. Tennyson is being solemn about knighthood's ideals and comic about the overelaboration of those ideals in the same passages. Read with attention to the tonal switching; the idyll is funnier than it is usually given credit for.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  {
    id: "iotk-gal-night-unhelming",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "proven a blooming boy",
    anchorOccurrence: 1,
    title: "\"Only proven a blooming boy\" — the idyll's final comic turn",
    quotedPassage: "\"…made merry over Death, / As being after all their foolish fears / And horrors only proven a blooming boy.\"",
    passageReference: "Gareth and Lynette, closing lines",
    commentary: `The idyll's final moment, after Gareth has defeated the fourth knight — Night, the black-armored man-beast of *boundless savagery* — delivers the comic turn the whole allegorical build has been leading toward. Night unhelms. Inside the armor is a boy's face.

*Death* (the capital-D allegorical figure the reader has been led to expect) turns out to be *only proven a blooming boy*. The household makes merry; the sisters Lyonors and Lynette dance; the idyll's whole dark machinery is revealed as play.

Three moves the closing makes:

1. **The allegorical scheme is undercut.** If Night was Death, and Night is a boy, then the allegorical equation fails — death is not real, or is only a game, or is the projection of children's fears. The reader's seriousness about the four-knight sequence is wrong-footed.

2. **The cycle's brightness is placed under protection.** The closing's comic register protects the idyll's hopefulness from the darker cycle around it. *Death* is kept from the idyll by being rendered cartoon. When the later idylls make death real (Merlin, Elaine, Arthur himself), they will do it against the protection this idyll's joke has set up. Tennyson knew what he was doing.

3. **Tennyson permits himself unpublishable lightness.** This is one of the rare places in the Idylls where the Laureate sounds playful. He is usually solemn to the point of fault; here he lets the idyll end on a joke. Read carefully and it is the funniest passage in the cycle.

The closing couplet — *He that told the tale in older times / Says that Sir Gareth wedded Lyonors, / But he, that told it later, says Lynette* — completes the comic register by explicitly refusing to resolve the romantic plot. Did Gareth marry Lyonors (Malory's ending)? Or Lynette (a later variant)? The idyll shrugs. This is the only romantic closure in the Idylls that does not attempt to be authoritative about the marriage.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  {
    id: "iotk-gal-kay",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "Kay",
    anchorOccurrence: 1,
    title: "Kay the Seneschal — the court's sharp-tongued institutional voice",
    quotedPassage: "\"…Kay, the Seneschal, / Who sat with divers knights at the high board, / And saw the young man enter, loud bespake, / 'What wilt thou, brother?'\"",
    passageReference: "Gareth and Lynette, Kay's initial reception of Gareth",
    commentary: `Kay, Arthur's foster-brother and seneschal (steward of the household), is the idyll's institutional voice. He mocks Gareth upon arrival, assigns him to the kitchen, and continues to harry him during his year of service. Malory's Kay is similar; Tennyson preserves him.

Kay's function in the idyll is load-bearing. He is not simply a bully; he is the *voice of the institution* — the court's skepticism about unverified arrivals, the bureaucratic scrutiny of claims of gentility. His mockery tests Gareth; his mockery is also wrong (Gareth *is* what Kay accuses him of not being). The institution misjudges. The idyll vindicates Gareth against Kay, and in doing so vindicates genuine merit against institutional skepticism.

This is one of the idyll's quiet Victorian themes. In 1872, Victorian England was actively debating how to identify merit when inherited rank was insufficient — civil service exams, university reform, middle-class entry into the professions. Kay's mockery of the kitchen-knave who turns out to be a prince's son has contemporary resonance. The nephew-of-a-king emerging from the kitchen is a Victorian social myth as much as a chivalric one. Tennyson places it in the cycle's brightest idyll because the myth is, in 1872, still hopeful.

The palette flags Kay as *iron-gray — Arthur's sharp-tongued seneschal*. The color captures him: institutional, sharp, colorless compared to the bright knights but also indispensable. The Round Table needs its Kay to test its Garetths.`,
    crossReferences: [],
    tags: ["historical", "philosophical", "literary-influence"],
  },

  {
    id: "iotk-gal-bellicent",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "the good mother let me know thee here",
    anchorOccurrence: 1,
    title: "Bellicent and the mother's promise",
    quotedPassage: "\"…the good mother let me know thee here / And see my child.\"",
    passageReference: "Gareth and Lynette, Bellicent's early scene",
    commentary: `Bellicent, Gareth's mother (Arthur's half-sister; in Malory, Morgause — one of the Orkney sisters), appears in the idyll's opening movement to oppose and then permit her son's going to court. She wants him to stay at home; Gareth argues that he must prove himself; she extracts from him a vow that he will serve in the kitchen for a year before revealing his identity — the promise is the idyll's inciting condition.

Bellicent is a minor but important character across the cycle. She is Tennyson's main narrative device for the mystic account of Arthur's birth (in *The Coming of Arthur*, where she tells Leodogran of the infant on the ninth wave). Her palette is *dusky rose — Arthur's half-sister, keeper of the mystery of his birth*, and the color captures her role: partly courtly, partly rural-maternal, the figure who holds both the heroic-public past and the private family past.

The mother-son scene is one of the idyll's most humane moments and one of Tennyson's quietest departures from Malory. Malory's Bellicent does not extract the kitchen-vow; it is Gareth's own choice to serve anonymously. Tennyson's maternal pressure adds an emotional register — she is trying to delay her son's entry into the chivalric world she knows will claim him.

Read this small scene carefully. It is Victorian maternal sensibility inside a chivalric frame, and it gives the idyll's otherwise broad comedy a moment of small domestic depth. Bellicent asking for the year of kitchen-service is a mother stalling; Gareth granting her request is a son honoring. Tennyson knows what he is doing; the maternal-filial weight here is real.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },

  {
    id: "iotk-gal-tennyson-late-composition",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "twelvemonth and a day",
    anchorOccurrence: 1,
    title: "1872 inside the cycle — Tennyson writing late against his own late darkness",
    quotedPassage: "\"…I pledge my troth I will not speak my name / Until I come back here a twelvemonth and a day.\"",
    passageReference: "Gareth and Lynette, the twelvemonth-and-a-day vow",
    commentary: `Tennyson composed and published this idyll in 1872, several years after completing the cycle's darkest idylls (Holy Grail 1869, Passing of Arthur 1869, Last Tournament 1871). This is the cycle's latest-composed major idyll and also its brightest — a compositional paradox worth naming.

Why did Tennyson write the cycle's bright morning last, after he had already written the dark end? Three readings:

1. **Structural necessity.** The cycle needed an idyll of the Round Table working as intended, against which the later collapse would register. The dark idylls existed before the bright opening was written; Tennyson composed the brightness retrospectively, to give the cycle its architectural opening.

2. **Compositional age-inversion.** The older poet, having written the fall, wrote the founding with the tonal lightness the younger poet had not had access to. The cycle's youth is written by the cycle's oldest compositional hand; the idyll's comic register may be the register of an elder poet who can now afford to be playful about material he has already grieved over.

3. **The cycle's ideological needs shifted.** By 1872, Tennyson was responding to reviewers who had accused the cycle of being too dark, too moralizing, too narrow. Gareth and Lynette is a comic-generous answer — "here is the Round Table at its bright best, and the comedy is available to me too."

The *twelvemonth and a day* vow is the idyll's internal echo of its own composition-time. A year-and-a-day is the traditional English folk-legal period (the "year and a day" of apprenticeships, of marriage banns, of land-claim retention). Tennyson uses it here as the exact length of Gareth's kitchen-service. The idyll's temporal unit is the year Tennyson himself spent writing it — the composition-time inscribed in the narrative-time. A small structural intimacy.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  {
    id: "iotk-gal-position-in-cycle",
    bookId: "idylls-of-the-king",
    chapterNumber: 2,
    anchorText: "So large mirth lived",
    anchorOccurrence: 1,
    title: "\"So large mirth lived\" — the brightness against the dark to come",
    quotedPassage: "\"So large mirth lived and Gareth won the quest.\"",
    passageReference: "Gareth and Lynette, penultimate line",
    commentary: `The idyll's penultimate line is worth pausing on. *So large mirth lived* is the cycle's single largest claim about joy. Nowhere else does the cycle permit itself this scale of happiness — the adjective *large*, the abstract noun *mirth*, the past tense *lived*. Even the word *mirth* is rare in Tennyson; it is an archaic, Chaucerian, English-medieval word that he almost never uses.

Read this line against the closing of the Passing of Arthur — *from the great deep to the great deep he goes*. The two closings are the cycle's tonal extremes. *So large mirth lived* — young, communal, comic, present-tense completion. *From the great deep to the great deep he goes* — old, solitary, elegiac, departure.

The cycle is bracketed between these two registers. Gareth and Lynette is where the bright one comes fully into voice. Every later idyll after this one (Marriage of Geraint and later) will register as descent from the idyll's *large mirth*. When you are reading the later idylls and the mood is dark, remember this idyll — this is what the cycle's full brightness sounded like. The later darkness is measured against it.

The palette flag for Gareth is *bright morning-gold*, and the prosody toggle's curated passage for this idyll is the Camelot-approach passage (see annotation 3). Both mark the idyll as the cycle's brightness-anchor. Read it in that role: this is the idyll that tells you what the Round Table was, so that the idylls that follow can tell you what it stopped being.`,
    crossReferences: [
      {
        type: "echo",
        description: "The closing \"large mirth lived\" is the cycle's tonal opposite of \"from the great deep to the great deep he goes\" (Passing of Arthur, Idyll XII). The cycle is bracketed between these two registers: young communal comedy and old solitary elegy. Reading them against each other is reading the cycle's whole tonal arc.",
        workTitle: "Idylls of the King — The Passing of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Passing of Arthur, closing",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 12,
        targetAnchorText: "great deep to the great deep he goes",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },
]
