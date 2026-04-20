import type { Annotation } from "../types"

// ── Beowulf Opus Cluster D — Hrothgar's Sermon (Fitt XXVI) ─────────────
// The aged king's wisdom-speech after the second monster-fight, widely
// considered the poem's moral centerpiece. The "sermon" is not a Christian
// sermon, strictly: it is Germanic wisdom literature with Christian glosses
// overlaying it. The passage is load-bearing for the whole poem's second
// half. Anchors against public/content/beowulf/ch-27.json.

export const BEOWULF_HROTHGARS_SERMON: Annotation[] = [
  {
    id: "beowulf-26-sermon-opening",
    bookId: "beowulf",
    chapterNumber: 27,
    anchorText: "Then bruised in his bosom he with bitter-toothed missile",
    anchorOccurrence: 1,
    title: "Hrothgar's sermon: the poem's moral centerpiece",
    quotedPassage: "Then bruised in his bosom he with bitter-toothed missile / Is hurt 'neath his helmet: from harmful pollution / He is powerless wholly…",
    passageReference: "Fitt XXVI",
    commentary: `Hrothgar, having just examined the hilt of the giants' sword and read the runes of the pre-Flood story engraved on it, is seized with a long speech to Beowulf — eighty lines in the Old English, perhaps the longest uninterrupted utterance in the poem by any character. Modern editors and translators call it "Hrothgar's sermon," though the word is loose: it is not Christian homily in the Augustinian sense. It is *Germanic wisdom literature*, with Christian glosses layered in where the Beowulf-poet could not resist.

The speech's argument in outline: God gives success and power to a chosen man; the man, flourishing, forgets that the gift can be withdrawn; the pride-worm (*sē weard*, the "guardian" of the soul) sleeps; an inner missile — "bitter-toothed" — wounds the heart; the man dies unblessed. The example Hrothgar cites is Heremod, the Danish king who ruined his people through cruelty and died exiled. The warning is directed at Beowulf, who has just won the greatest victory of his life and whom Hrothgar has treated like a son.

This is the poem telling its hero, at the peak of his success, that *success is precisely the danger*. Heroic victory does not secure the self; it loosens the guard. Keep the sermon in mind when, fifty years later, Beowulf decides to fight the dragon alone.`,
    crossReferences: [
      {
        type: "compare",
        description: "Hrothgar's warning against the complacency of victory is the Germanic-heroic version of the wisdom Milton will give Adam at the end of Paradise Lost: the heroic self must still guard itself against its own success.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book XII",
        targetBookId: "paradise-lost",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical", "literary-influence"],
  },
  {
    id: "beowulf-26-heremod",
    bookId: "beowulf",
    chapterNumber: 27,
    anchorText: "Beware of arrogance",
    anchorOccurrence: 1,
    title: "Heremod: the king who should not have been",
    quotedPassage: "…Heremod the chieftain, haughty of spirit…",
    passageReference: "Fitt XXVI",
    commentary: `Heremod is one of the poem's recurring negative exempla — a Danish king from the deep past who *had* the gifts God gave him (strength, a people, a hall) and squandered them through cruelty. The poet mentions him at several places in the poem, always in contrast to a virtuous king: earlier, in Fitt XIV, a scop compares Beowulf *favorably* to Heremod; now Hrothgar invokes him as a warning.

The force of the Heremod reference in the sermon is this: Hrothgar is telling Beowulf, *I have told this story at your victory feast and I am now telling it at your departure, because the possibility it names is always live*. A hero who has just torn the arm off Grendel, descended into the underwater mere, killed Grendel's mother, and returned with the giants' hilt can imagine nothing failing. He is exactly the kind of man to whom Heremod's story happens.

The structure is a key one in Germanic wisdom literature: *exemplum + counter-exemplum*. Sigemund the virtuous dragon-slayer was held up at the feast; Heremod the ruined king is held up at the sermon. The same speaker (the scop first, Hrothgar now) names both at the same hero. This is Old English moral pedagogy: a life is not a straight line; it is two paths, and a hero is asked to choose, even at the height of success.`,
    crossReferences: [],
    tags: ["historical", "literary-influence", "philosophical"],
  },
  {
    id: "beowulf-26-christian-overlay",
    bookId: "beowulf",
    chapterNumber: 27,
    anchorText: "Wielder of Glory",
    anchorOccurrence: 1,
    title: "Christian overlay on Germanic wisdom",
    quotedPassage: "…the soul's defender / Sleepeth too soundly, sunk in late sorrows…",
    passageReference: "Fitt XXVI",
    commentary: `The sermon's architecture is Germanic wisdom — a type of moral poetry that existed in the Anglo-Saxon tradition before Christianity and is attested in shorter OE poems like *The Wanderer* and *The Seafarer*. But the Christian overlay in Hrothgar's speech is explicit: he names God as the giver of power, he calls the soul's *weard* (guardian) the figure that falls asleep, and the "bitter-toothed missile" that wounds the heart is, in the patristic tradition the Beowulf-poet likely knew, the devil's arrow — *sagitta diaboli*.

Scholars have argued for a hundred years about whether the Christian frame is a later monastic interpolation or intrinsic to the poet's original composition. The dominant modern view (after Tolkien, and after decades of work by scholars like Klaeber and Fulk) is that the layering is *original*. The poet is a Christian writing about pre-Christian ancestors, and he refuses to either make them converts or strip his own frame. The result is the sermon's strange doubled texture: the vocabulary of monastic devotion (guardian of the soul, God's gift) attached to a pattern of thought (success loosens vigilance; pride precedes ruin) that the Germanic wisdom tradition had worked out independently before the missionaries arrived.

This is not a defect. This is what makes Hrothgar's voice scholarly readers have spent a century trying to describe: an aged Germanic king speaking in the register of Anglo-Saxon monastic moral poetry about pre-Christian kings whose fates the speaker knows by heart.`,
    crossReferences: [],
    tags: ["philosophical", "historical", "literary-influence"],
  },
]
