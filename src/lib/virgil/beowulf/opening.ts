import type { Annotation } from "../types"

// ── Beowulf Opus Cluster A — Opening (Fitts I–III) ─────────────────────
// Hall's 1892 translation via Standard Ebooks. Anchors line-exact against
// public/content/beowulf/ch-2.json (Fitt I), ch-3 (II), ch-4 (III). Covers:
// the manuscript story, Hall's translation, Tolkien's 1936 intervention,
// the Scyld Scefing prologue and ring composition, the Creation song in
// Heorot, Grendel as descendant of Cain, and the kennings/alliteration
// primer. These annotations anchor the whole reading; every later
// annotation assumes the reader has these.

export const BEOWULF_OPENING: Annotation[] = [
  {
    id: "beowulf-1-manuscript",
    bookId: "beowulf",
    chapterNumber: 2,
    anchorText: "Lo! the Spear-Danes’ glory",
    anchorOccurrence: 1,
    title: "A poem that almost did not survive",
    quotedPassage: "Lo! the Spear-Danes' glory through splendid achievements / The folk-kings' former fame we have heard of.",
    passageReference: "Fitt I, lines 1–2",
    commentary: `Every word of Beowulf you read is text from a single manuscript. It is called Cotton Vitellius A.xv — the catalogue-mark of Sir Robert Cotton's 17th-century library — and it was copied out by two anonymous scribes around the year 1000 CE, roughly three centuries after some poet (whose name we will never know) composed the poem.

In October 1731 the Cotton Library caught fire. The manuscript was scorched on the edges; Beowulf survived. The earliest transcripts were made before further crumbling — our modern editions piece those transcripts back together where the vellum has since flaked away. Without that fire's partial mercy, we would have no English epic older than Chaucer. One manuscript. One fire. One survival.

When Hall translates "we have heard of" he is preserving the Old English phrase *we… frunon* — the poem begins by claiming an oral tradition older than itself. It was performed aloud in mead-halls for we do not know how long before anyone wrote it down. The manuscript is the late artifact; the poem is the old thing.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "beowulf-1-hall-translation",
    bookId: "beowulf",
    chapterNumber: 2,
    anchorText: "How princes displayed then their prowess-in-battle",
    anchorOccurrence: 1,
    title: "Why this translation, and what it keeps",
    quotedPassage: "How princes displayed then their prowess-in-battle.",
    passageReference: "Fitt I, line 3",
    commentary: `This is John Lesslie Hall's 1892 alliterative-verse translation. Hall chose, instead of modernizing Beowulf into blank verse (which is what most Victorian translators did), to keep the form of the original: four stresses per line, a strong mid-line pause (the caesura), and alliteration binding the line together. "Princes…prowess" and "displayed…prowess-in-battle" carry that binding here.

The trade-off is archaism. Hall reaches for words like *prowess*, *atheling*, *welkin*, *mead-bench* — words that smell of the medieval. Seamus Heaney's 1999 translation (which we cannot legally print because it is still in copyright) reads plainer and more modern; it wins on accessibility. But Hall wins on *form*, which is the whole reason to read this poem in verse at all. Alliterative verse is not decoration: it is the engine. Every time you feel a line click — *Spear-Danes' / splendid*, *folk-kings' / former / fame* — that click is what the Beowulf-poet was doing in Old English, only harder and more musically.

Toggle "Highlight alliteration" above to see the pattern Hall is trying to hold onto.`,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "beowulf-1-tolkien-frame",
    bookId: "beowulf",
    chapterNumber: 2,
    anchorText: "Oft Scyld the Scefing",
    anchorOccurrence: 1,
    title: "Why we read this now: Tolkien, 1936",
    quotedPassage: "Oft Scyld the Scefing from scathers in numbers / From many a people their mead-benches tore.",
    passageReference: "Fitt I, lines 4–5",
    commentary: `Before 1936, Beowulf was not taught as literature. It was taught as philological material — a document in which to study Old English vocabulary, case endings, dialect differences. Scholars treated the monster-fights as regrettable folklore that the Christian poet had been forced to dramatize because the audience wanted dragons.

In November 1936 J. R. R. Tolkien delivered a lecture to the British Academy called *Beowulf: The Monsters and the Critics*. He argued, to a room of scholars who had assumed the opposite for a hundred years, that the monsters **are the poem**. The Beowulf-poet was not decorating history with supernatural embarrassments; he was writing a meditation on mortality and the failure of the heroic code, and the monsters are the shape that meditation takes. Grendel, his mother, and the dragon are three figures of what must ultimately undo a hero: the monstrous inside the hall, the monstrous beneath the water, the monstrous rising from the earth as old age comes.

You are reading, today, a poem whose *status* as literature is younger than most novels on this shelf. Tolkien's argument won, and it is now the dominant reading. Keep him in mind. When we reach Grendel you will feel what he meant.`,
    crossReferences: [
      {
        type: "compare",
        description: "Milton's Satan, like Grendel, is descended from the Christian tradition of Cain-cursed evil — two cursed exile-figures the modern reader can now see as first cousins in the same inherited imagination.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "beowulf-1-scyld-ring-composition",
    bookId: "beowulf",
    chapterNumber: 2,
    anchorText: "Scyld then departed",
    anchorOccurrence: 1,
    title: "The first funeral: Scyld and ring composition",
    quotedPassage: "Scyld then departed to the All-Father's keeping / Warlike to wend him; away then they bare him / To the flood of the current…",
    passageReference: "Fitt I, lines ~27–29",
    commentary: `The poem opens with a funeral. Scyld Scefing, founder of the Danish royal line, arrived as an unknown foundling in a ship; at the end of his life, they bear him to the sea and push him out in another ship, loaded with treasure, toward whatever destination the tide chooses. The origin is a mystery and the end is a mystery and the life in between is one of unambiguous heroic glory.

Remember this. The poem is going to end with another funeral — Beowulf's, at line 3182 in the standard numbering, near the end of Fitt XLIII. That funeral will echo this one deliberately. The treasure is different (Beowulf's is cursed, the Geats bury rather than float it), the mood is different (grief rather than fame), but the *frame* is the same. Critics call this "ring composition": the poem is bracketed by funerals, and the whole story — the rise of a hero, the monsters he fights, the long failure of age — sits between them.

Most epics begin *in medias res* and end at victory. Beowulf begins and ends at graves. That is already the argument.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "beowulf-2-creation-song",
    bookId: "beowulf",
    chapterNumber: 3,
    anchorText: "joyance",
    anchorOccurrence: 1,
    title: "Heorot, and the scop's song of Creation",
    quotedPassage: "The hall with its gables / Saw Heorot towering, timber-constructed… / The gleeman sang clearly in Heorot.",
    passageReference: "Fitt II, lines ~78–90",
    commentary: `Hrothgar builds the mead-hall Heorot and names it "hart" — for the stag-antlers on its gables. Inside, a court poet (a *scop*) improvises a song for the drinking warriors. What he sings is Genesis: the making of the earth, the bright sun, the decking of the land with leaves, the creation of every living thing. It is one of the strangest moments in the poem.

The scop is singing a Christian creation story — but the characters listening to him are pre-Christian Germanic pagans. The *poet* is Christian; his characters are not; the poem never fully resolves the dissonance. This is the famous "Christian frame on pagan material" question, and scholarship has argued about it for more than a century. There is no settled answer. What we know is that the poet refuses to either Christianize his characters retroactively or strip out the Christian language; he holds both at once, and the tension between them is the poem's characteristic weather.

What will happen next is not accidental. The Creation song reaches the ears of a creature out in the dark who, we are about to learn, is *descended from Cain* — the first murderer of the Creation story the scop is singing. What Grendel hears is, in a sense, the song of his own damnation. The moral architecture is surgical.`,
    crossReferences: [
      {
        type: "source",
        description: "The Creation song's direct source is Genesis 1, the passage that the monastic culture of the manuscript's scribes would have recited daily in the Divine Office.",
        workTitle: "Genesis",
        workAuthor: "Biblical",
        passageReference: "Genesis 1",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical", "historical"],
  },
  {
    id: "beowulf-3-grendel-cain",
    bookId: "beowulf",
    chapterNumber: 4,
    anchorText: "Grendel",
    anchorOccurrence: 1,
    title: "Grendel: the shadow of Cain",
    quotedPassage: "When the sun was sunken, he set out to visit / The lofty hall-building, how the Ring-Danes had used it / For beds and benches…",
    passageReference: "Fitt III, lines 1–3",
    commentary: `The poem names Grendel for the first time and immediately gives him a genealogy: he is descended from Cain, the biblical first murderer. This one detail changes how to read him. Grendel is not a generic monster in the Greek sense (like the Cyclops, who is simply other). He is an *exile* — cursed, banished, carrying his ancestor's mark. The Old English word the poet uses for him several times is *wer-gæst*, which is hard to translate: something like "man-spirit" — suggesting Grendel is, horribly, not purely beast.

Tolkien's reading, now the canonical one, is this: Grendel is terrible because he is *adjacent* to humanity. He has inherited a kind of grief and a kind of envy. He hates the hall's light and music because he was cut out of the family of fellowship by his ancestor's murder of Abel. Notice, later in this fitt and through his death, that the poem will grant him a strange interiority — *he came on the mist-banks grieving*, a nine-line passage that is not sparing in its attention to the monster's inner life.

This is not a reason to feel sorry for him; the poem does not want pity. It is a reason to take him seriously. Grendel is the first image in English literature of evil as a cursed thing that the hall's light cannot reach.`,
    crossReferences: [
      {
        type: "source",
        description: "Genesis 4 — the Cain-and-Abel story is the scriptural anchor for Grendel's descent. The poet's readers in the monastic scriptorium would have known it cold.",
        workTitle: "Genesis",
        workAuthor: "Biblical",
        passageReference: "Genesis 4",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description: "Milton's Satan (Paradise Lost I) is the later Christian-poetic development of the same figure: the exiled, envying creature who cannot bear the sight of Eden's joy. Beowulf's Grendel is Satan's genealogical cousin.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV, lines 365–410",
        targetBookId: "paradise-lost",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },
  {
    id: "beowulf-1-kennings-primer",
    bookId: "beowulf",
    chapterNumber: 2,
    anchorText: "mead-benches",
    anchorOccurrence: 1,
    title: "Kennings: the compressed metaphors of the Old English poet",
    quotedPassage: "From many a people their mead-benches tore.",
    passageReference: "Fitt I, line 5",
    commentary: `"Mead-benches" is not quite a metaphor and not quite a plain noun — it is a *kenning*, the signature device of Old English heroic poetry. Kennings are compressed metaphorical compounds: two nouns slammed together to produce a third meaning neither of them quite carries alone. *Whale-road* means the sea. *Ring-giver* means the lord. *Bone-house* means the body. *Battle-light* means the sword.

They are not ornament. The kenning is how the Old English poet *thinks*. A sword is never just a sword in a kenning-rich line: it is the flash of light that precedes the blow, or the friend that goes with you into combat, or the heirloom handed down through three generations. Each kenning carries a whole cultural attitude compressed into a compound word. Modern English still has kennings fossilized in it: *werewolf* (man-wolf), *lord* (from *hlāford*, "loaf-guardian"), *world* (from *wer-eald*, "man-age").

Hall preserves many of them literally. Hover any underlined word in this reader to see the Old English compound, the literal meaning, and what it actually refers to. There are roughly eighty kennings indexed in this edition — a reading of Beowulf in which you *learn the kenning system as you go* is the intended experience.`,
    crossReferences: [],
    tags: ["linguistic"],
  },
]
