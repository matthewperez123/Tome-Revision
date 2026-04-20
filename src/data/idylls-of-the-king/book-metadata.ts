/**
 * Idylls of the King — per-idyll scholarly metadata.
 *
 * The cycle's 14 structural units: Dedication + 12 idylls + To the Queen.
 * Idylls are indexed 1–12 in canonical reading order (chapterIndex 1..12);
 * the Dedication is chapterIndex 0; "To the Queen" is chapterIndex 13.
 *
 * The `emotionalRegister` field powers the cycle-arc sidebar (Part 3C):
 * a reader opening any idyll can see where it sits on the downward curve
 * from hope-and-establishment to catastrophe.
 *
 * Composition dates are Tennyson's publication chronology; note that the
 * idylls were written out of the order in which they are read. This is
 * pedagogically load-bearing — surfaced both here and in annotations.
 */

export interface IdyllMetadata {
  chapterIndex: number
  title: string
  roman?: string           // idyll number in Roman, only for idylls 1–12
  argument: string         // one-sentence scholarly argument
  emotionalRegister: string // one-line for cycle-arc sidebar
  compositionYear: number   // year first published in something like final form
  opening: string          // first 2–4 lines, for header epigraph
}

export const IDYLL_METADATA: Record<number, IdyllMetadata> = {
  0: {
    chapterIndex: 0,
    title: "Dedication",
    argument:
      "Tennyson's 1862 dedication to the memory of Prince Albert, framing Arthur as a figure of ideal sovereignty and Albert as his modern analogue; the poem's explicit moral-political frame.",
    emotionalRegister: "Elegy — the frame that names the loss.",
    compositionYear: 1862,
    opening:
      "These to His Memory—since he held them dear, / Perchance as finding there unconsciously / Some image of himself—I dedicate, / I dedicate, I consecrate with tears— / These Idylls.",
  },
  1: {
    chapterIndex: 1,
    title: "The Coming of Arthur",
    roman: "I",
    argument:
      "Arthur arrives to unify a wasted Britain, takes Guinevere to wife, and establishes the Round Table; his mysterious parentage is the idyll's central puzzle.",
    emotionalRegister: "Hope — the kingdom's dawn, the old order changing.",
    compositionYear: 1869,
    opening:
      "Leodogran, the King of Cameliard, / Had one fair daughter, and none other child; / And she was the fairest of all flesh on earth, / Guinevere, and in her his one delight.",
  },
  2: {
    chapterIndex: 2,
    title: "Gareth and Lynette",
    roman: "II",
    argument:
      "Gareth, youngest of Bellicent's sons, comes to Camelot in disguise as a scullion, serves a year in the kitchens, then rides out with the scornful Lynette to rescue her sister from four allegorical knights.",
    emotionalRegister: "Hope — the bright morning of Camelot, comic and generous.",
    compositionYear: 1872,
    opening:
      "The last tall son of Lot and Bellicent, / And tallest, Gareth, in a showerful spring / Stared at the spate.",
  },
  3: {
    chapterIndex: 3,
    title: "The Marriage of Geraint",
    roman: "III",
    argument:
      "Geraint weds Enid, dispossessed daughter of Yniol, after defeating Edyrn at the sparrow-hawk tournament; the first half of a two-part Welsh-sourced marriage story drawn from the Mabinogion.",
    emotionalRegister: "Stability — an earnest marriage, briefly uncomplicated.",
    compositionYear: 1859,
    opening:
      "The brave Geraint, a knight of Arthur's court, / A tributary prince of Devon, one / Of that great Order of the Table Round, / Had married Enid, Yniol's only child.",
  },
  4: {
    chapterIndex: 4,
    title: "Geraint and Enid",
    roman: "IV",
    argument:
      "Geraint, misled by overheard words, suspects Enid of infidelity; the couple ride out on a trial whose suffering reveals her steadfastness. Victorian marriage ideology overlaid on the Mabinogion's older, more ambiguous material.",
    emotionalRegister: "Strain — suspicion and suffering, patience vindicated.",
    compositionYear: 1859,
    opening:
      "O purblind race of miserable men, / How many among us at this very hour / Do forge a life-long trouble for ourselves, / By taking true for false, or false for true.",
  },
  5: {
    chapterIndex: 5,
    title: "Balin and Balan",
    roman: "V",
    argument:
      "Two brother-knights die at each other's hands, each unrecognizing; Balin's fatal encounter with Vivien and a chance rumor of Guinevere's adultery sets the moral catastrophe in motion. Added late (1885) to thicken the corruption sequence.",
    emotionalRegister: "Darkening — rumor and error; brother kills brother.",
    compositionYear: 1885,
    opening:
      "Pellam the King, who held and lost with Lot / In that first war, and had his realm restored / But rendered tributary, failed of late / To send his tribute.",
  },
  6: {
    chapterIndex: 6,
    title: "Merlin and Vivien",
    roman: "VI",
    argument:
      "Vivien pursues and beguiles Merlin into revealing the charm that binds him; the sage is sealed in an oak forever, and the kingdom loses its prophetic counsel. Critically the cycle's weakest idyll in character-handling; structurally its decisive break.",
    emotionalRegister: "Corruption — the sage is silenced; the kingdom loses its sight.",
    compositionYear: 1859,
    opening:
      "A storm was coming, but the winds were still, / And in the wild woods of Broceliande, / Before an oak, so hollow, huge and old / It looked a tower of ivied masonwork, / At Merlin's feet the wily Vivien lay.",
  },
  7: {
    chapterIndex: 7,
    title: "Lancelot and Elaine",
    roman: "VII",
    argument:
      "Lancelot, in disguise at the Diamond Joust, wins all nine diamonds for Guinevere and wounds himself nearly to death; Elaine of Astolat, the lily maid, tends him, confesses her love, and dies of grief when he returns to the queen. Her body is borne on a funeral barge down to Camelot.",
    emotionalRegister: "Tragedy — love that divides; Lancelot's own self against himself.",
    compositionYear: 1859,
    opening:
      "Elaine the fair, Elaine the loveable, / Elaine, the lily maid of Astolat, / High in her chamber up a tower to the east / Guarded the sacred shield of Lancelot.",
  },
  8: {
    chapterIndex: 8,
    title: "The Holy Grail",
    roman: "VIII",
    argument:
      "Percivale, now a monk, narrates the Grail Quest: Galahad's visionary success, the partial successes of Bors and Percivale, the failure of Lancelot and the others. Tennyson's most religiously charged idyll, read variously as a defense of faith or a document of its failure in an age of doubt.",
    emotionalRegister: "Vision and failure — the Grail calls; most do not follow.",
    compositionYear: 1869,
    opening:
      "From noiseful arms, and acts of prowess done / In tournament or tilt, Sir Percivale, / Whom Arthur and his knighthood called The Pure, / Had passed into the silent life of prayer, / Praise, fast, and alms.",
  },
  9: {
    chapterIndex: 9,
    title: "Pelleas and Ettarre",
    roman: "IX",
    argument:
      "The young knight Pelleas comes to Camelot expecting the ideal and falls in love with the cruel Ettarre; his disillusionment, and Gawain's betrayal of his trust, mark the tonal turning of the cycle into despair.",
    emotionalRegister: "Disillusion — the young ideal encounters the real court.",
    compositionYear: 1869,
    opening:
      "King Arthur made new knights to fill the gap / Left by the Holy Quest; and as he sat / In hall at old Caerleon, the high doors / Were softly sundered, and through these a youth, / Pelleas, and the sweet smell of the fields / Past, and the sunshine came along with him.",
  },
  10: {
    chapterIndex: 10,
    title: "The Last Tournament",
    roman: "X",
    argument:
      "The Tournament of the Dead Innocence, held in a cold autumnal rain, is won cynically by Tristram; Arthur rides out, and Dagonet the fool laughs bitterly at the ruin. Tennyson's most sustained sound-painting of despair.",
    emotionalRegister: "Autumn — rain, despair, the court no longer believes.",
    compositionYear: 1871,
    opening:
      "Dagonet, the fool, whom Gawain in his mood / Had made mock-knight of Arthur's Table Round, / At Camelot, high above the yellowing woods, / Danced like a withered leaf before the hall.",
  },
  11: {
    chapterIndex: 11,
    title: "Guinevere",
    roman: "XI",
    argument:
      "Guinevere, fled to the nunnery at Almesbury, is confronted by Arthur; his long speech of forgiveness-with-judgment is the cycle's most morally difficult passage. One of the great Victorian portraits of fallen womanhood — sympathetic in practice, even where the frame is punitive.",
    emotionalRegister: "Ruin — the queen in the nunnery, the king at her door.",
    compositionYear: 1859,
    opening:
      "Queen Guinevere had fled the court, and sat / There in the holy house at Almesbury / Weeping, none with her save a little maid, / A novice.",
  },
  12: {
    chapterIndex: 12,
    title: "The Passing of Arthur",
    roman: "XII",
    argument:
      "Arthur, mortally wounded at the last battle in the western mist, orders Bedivere to cast Excalibur back into the lake and is borne away by the Three Queens to Avalon. Incorporates and extends Tennyson's 1833 'Morte d'Arthur' — the cycle's bookend.",
    emotionalRegister: "Transfiguration — from the great deep to the great deep he goes.",
    compositionYear: 1869,
    opening:
      "That story which the bold Sir Bedivere, / First made and latest left of all the knights, / Told, when the man was no more than a voice / In the white winter of his age, to those / With whom he dwelt, new faces, other minds.",
  },
  13: {
    chapterIndex: 13,
    title: "To the Queen",
    argument:
      "Tennyson's 1872 closing address to Victoria after the darker completed form of the Idylls — a defense of the poem against charges that its moral is mere allegory, and a prayer for the realm.",
    emotionalRegister: "Coda — the poet addresses the living Queen from the ruins of the old.",
    compositionYear: 1872,
    opening:
      "O loyal to the royal in thyself, / And loyal to thy land, as this to thee— / Bear witness, that rememberable day.",
  },
}

/** The canonical reading order — 14 indices. */
export const READING_ORDER: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13]

/** Display labels for the two non-idyll framing units. */
export const FRAMING_UNITS = new Set([0, 13])
