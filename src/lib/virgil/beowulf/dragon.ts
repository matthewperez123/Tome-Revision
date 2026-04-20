import type { Annotation } from "../types"

// ── Beowulf Opus Cluster E — Dragon fight + death + lament (Fitts XXXII–XLIII)
// The poem's elegiac last third — where Tolkien's reading of Beowulf as a
// meditation on mortality, the failure of the heroic code, and the doom of
// a people does its heaviest work. Anchors across ch-33 (XXXII) to ch-44
// (XLIII). This is the poem's climactic movement and carries the densest
// Opus-tier annotation per spec.

export const BEOWULF_DRAGON: Annotation[] = [
  {
    id: "beowulf-32-thief-rouses",
    bookId: "beowulf",
    chapterNumber: 33,
    anchorText: "He sought of himself who sorely did harm him",
    anchorOccurrence: 1,
    title: "The thief, the cup, the dragon: how the last movement begins",
    quotedPassage: "…the servant of one of / The sons of the heroes hate-blows evaded, / Seeking for shelter and the sin-driven warrior / Took refuge within there.",
    passageReference: "Fitt XXXII",
    commentary: `Fifty years have passed in two sentences. Beowulf, once the young Geat who came across the sea to Heorot, is now an old king of his own people. The last third of the poem is a different register entirely — elegiac rather than heroic, wintry where the first two-thirds were bright.

The dragon's awakening is set in motion by the smallest possible human action. An unnamed runaway slave (Hall's "servant of one of / The sons of the heroes"), fleeing his master, stumbles into the dragon's barrow and, possibly panicking, takes a single cup from the hoard. The dragon, who has guarded this treasure for three hundred years, smells the intrusion when it wakes. Then — the poet is unsparing — it flies out in rage and begins to burn the kingdom.

A cup. A fleeing slave. The whole elegiac final third of the poem is triggered by an incident that in another kind of poem would not even be a footnote. This is deliberate: the Beowulf-poet is arguing that the hero's end is not brought on by a villain of proportionate stature. It is brought on by accident, by a small wrong done by a frightened nobody. The monster who ends Beowulf is not a moral enemy; it is *time* in dragon-shape.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "beowulf-33-dragon-burns-kingdom",
    bookId: "beowulf",
    chapterNumber: 34,
    anchorText: "The stranger began then to vomit forth fire",
    anchorOccurrence: 1,
    title: "The dragon: ember, hoard, doom",
    quotedPassage: "The stranger began then to vomit forth fire, / To burn the great manor; the blaze then glimmered / For anguish to earlmen…",
    passageReference: "Fitt XXXIII",
    commentary: `The dragon is different in kind from Grendel and his mother. Grendel was descended from Cain — *morally* descended from the human tradition of sin. The dragon is not descended from anything. It is a force: ember-colored, hoard-warm, ancient, and utterly without the Cain-genealogy that gave Grendel his strange half-interiority. The dragon does not grieve. It does not envy. It simply guards, and when guarded gold is touched, it burns.

The Old English names for the creature concentrate this: *draca* (dragon), *wyrm* (serpent-worm), *fyrdraca* (fire-dragon), *hordweard* (hoard-guardian), *lyftfloga* (air-flyer), *uhtfloga* (dawn-flier), *ēðbegēate* — "easily-reached death." It is named by what it is and what it does; it has no lineage. The monsters in Beowulf trace a descent: Grendel inherited Cain's curse, his mother inherited his grief, the dragon inherits *nothing*. It is the first of its kind in the Western dragon-tradition that will run through Norse legend, through St. George, through Tolkien's Smaug, who is the most direct literary descendant of this particular dragon.

What the dragon kills is Beowulf, yes — but also the Geatish people. The messenger's prophecy near the end of the poem makes clear: with Beowulf dead, the kingdom has no protector, and the old feuds with Franks and Swedes will return to finish them. The dragon is not just a creature the hero must fight. It is the shape the end of a kingdom takes.`,
    crossReferences: [],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "beowulf-36-wiglaf-loyalty",
    bookId: "beowulf",
    chapterNumber: 37,
    anchorText: "Wiglaf",
    anchorOccurrence: 1,
    title: "Wiglaf: one thane out of twelve",
    quotedPassage: "The son of Weohstan was Wiglaf entitled, / Shield-warrior precious, prince of the Scylfings…",
    passageReference: "Fitt XXXVI",
    commentary: `Beowulf has brought twelve picked thanes to the dragon fight. When the dragon begins to prevail, eleven of them flee into the woods. One, Wiglaf, stays. He is the youngest, inexperienced, new to battle. The moment of his staying is one of the poem's most devastating.

Wiglaf's interior monologue — he remembers the gifts his lord gave him, the mead-hall promises, the *comitatus* bond — is shown in full. The bond between lord and thane is the fundamental social fact of Germanic warrior culture: the thane swears to die with his lord if necessary; the lord, in return, gives gold, honor, and protection. Eleven thanes just broke the bond. Wiglaf keeps it. Not out of bravery (the poet makes clear he is afraid) but out of the clear-eyed recognition that to flee is to cease to be what his vow made him.

Tolkien wrote about this moment in *The Homecoming of Beorhtnoth* — a topic the spec explicitly mentions. He thought the ethic of *comitatus* was what made the Germanic heroic tradition worth preserving into Christian times. Wiglaf is the poem's clearest embodiment of that ethic. He is also its inheritor: at the poem's close, dying Beowulf names him heir, and the palette the poem gives him — pale gold with iron — is a deliberate descendant-color of Beowulf's own.`,
    crossReferences: [
      {
        type: "compare",
        description: "Milton's Abdiel in Paradise Lost (Book V) is the later Christian poetic version of Wiglaf: the one loyal retainer who refuses to desert his lord when the rest defect. Milton knew the pattern from his own reading of Anglo-Saxon material.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book V",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical", "literary-influence"],
  },
  {
    id: "beowulf-37-fatal-wound",
    bookId: "beowulf",
    chapterNumber: 38,
    anchorText: "The Weder-lord cut the worm in the middle",
    anchorOccurrence: 1,
    title: "The fatal wound: Beowulf and Wiglaf together",
    quotedPassage: "The Weder-lord cut the worm in the middle. / They had felled the enemy (life drove out then / Puissant prowess), the pair had destroyed him…",
    passageReference: "Fitt XXXVII",
    commentary: `The dragon is killed by the two of them — Wiglaf stabbing it low in the neck, Beowulf cutting its body in half with his war-knife. The victory is joint; the poem is insistent on this. Beowulf alone, facing the dragon as he had faced Grendel, would have died having failed. With Wiglaf beside him, he dies *having won*. The comitatus bond is what makes the victory possible. The heroic individual cannot close the last fight without the loyal thane.

But Beowulf takes a poisoned wound from the dragon's teeth in his neck. The wound begins to swell and burn; the poet tells us the king feels the venom spreading in his body and knows his death-hour is come. What follows is one of the longest, quietest dying speeches in medieval literature. Beowulf asks Wiglaf to bring out some of the hoard-gold so he can see it before he dies. He arranges his funeral. He names Wiglaf successor.

Tolkien's controversial reading — the concept of *ofermōd*, "over-heart," a kind of heroic pride-unto-overreaching — is that Beowulf should not have fought the dragon alone and that his decision to do so was flawed. Not every reader accepts Tolkien's reading; some see the fight as entirely necessary, a king's duty to his people. But the question the poem's last movement asks is unavoidable: at what point does the heroic virtue become the heroic vice?`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "beowulf-38-cursed-hoard",
    bookId: "beowulf",
    chapterNumber: 39,
    anchorText: "Wealth can easily",
    anchorOccurrence: 1,
    title: "The cursed hoard: gold that undid the hero",
    quotedPassage: "Wealth can easily, / Gold on the sea-bottom, turn into vanity / Every one of earthmen, avail him who will!",
    passageReference: "Fitt XXXVIII",
    commentary: `Wiglaf, obeying his dying lord, goes into the barrow to bring out some of the hoard for Beowulf to see. Inside he finds the treasure heaped on the floor — cups, arm-bracelets, helmets — all rust-eaten, all cursed. The poet tells us the hoard was cursed by the last survivor of an ancient race, who — before he died the last of his line — laid a spell on the treasure so that it would destroy any later man who claimed it. Beowulf is the later man.

The poem's attitude to gold is complicated in exactly this moment. Throughout the hall-scenes the gift of gold has been the central social fact of the comitatus — a ring-giver is the highest praise for a lord. Now, at the end, the poet reveals gold's other face: it is accursed when hoarded, venomous when reclaimed. The treasure Wiglaf carries out to the dying king is both the material proof of his victory and the instrument of his destruction.

When Beowulf dies, the Geats bury the hoard with him. They do not distribute it. They do not ring-give it. They bury all of it, accursed, in the barrow. This is unprecedented in the poem's world — in every earlier scene, gold flows from lord to thane, and hoarded gold is monstrous. The buried hoard at the poem's end is the poem's explicit image of a world where the old circulation has stopped. The ring-giver is dead; the rings go back into the earth.`,
    crossReferences: [],
    tags: ["philosophical", "mythological", "historical"],
  },
  {
    id: "beowulf-38-beowulfs-death",
    bookId: "beowulf",
    chapterNumber: 39,
    anchorText: "Beowulf’s Death",
    anchorOccurrence: 1,
    title: "Beowulf's last words, and the end of the heroic line",
    quotedPassage: "…treasure-gems many / Victorious saw, when the seat he came near to, / Gold-treasure sparkling spread on the bottom…",
    passageReference: "Fitt XXXVIII",
    commentary: `Beowulf's death is one of the longest in medieval literature. He sees the gold Wiglaf has brought out, speaks his last words, names Wiglaf his heir and the guardian of the people, and dies. The poet gives us the specific detail of his body cooling where he sits propped against the wall of the barrow.

His final speech is not a boast. It is a reckoning. He says he has ruled his people fifty winters and that he does not know a neighboring king who dares face him; he has held his oath; he has kept the old treaties; and he has not sworn false oaths, nor sought out quarrels, nor killed his kin. This last — *I have not killed my kin* — is a specific phrase. Kin-slaying is, in the poem's ethical frame, the worst act a human can commit. It is what Cain did, and the shadow of Cain has lain over the poem since Grendel first appeared. Beowulf, in his last hour, names himself *not* in Cain's lineage. It is the ethical opposite of what he has killed.

Then he asks Wiglaf to build him a funeral-mound on the headland, high enough for sailors to see from far out at sea, and to name it Beowulf's Barrow. The hero's last wish is not for the hoard or the kingdom but for a visible memorial — *lof*, glory, the kind of reputation that survives death. The poem ends with this wish being honored.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "beowulf-41-messengers-prophecy",
    bookId: "beowulf",
    chapterNumber: 42,
    anchorText: "Messenger",
    anchorOccurrence: 1,
    title: "The messenger's prophecy: the doom of the Geats",
    quotedPassage: "The Messenger's Retrospect…",
    passageReference: "Fitt XLI",
    commentary: `An unnamed messenger rides to the Geatish camp to announce Beowulf's death, and his speech becomes the poem's explicit prophecy of the end of the Geatish people. With Beowulf gone, the messenger says, the old feuds with the Franks (from Hygelac's disastrous raid) and with the Swedes (from the Ongentheow generation's battles) will return. The Geats have no protector. Their neighbors will not forget. Their kingdom is ending.

This is the moment the poem's meditation on mortality expands beyond one hero's death to a whole people's. The poet has been threading the Geatish-Swedish wars digressions through the second half of the poem precisely to prepare this: we have heard about the feuds, seen how each was barely contained in Beowulf's lifetime, watched the kin-lines stretched thin through the king-lists. The messenger's speech makes explicit what the poem has been implying: the hero and the kingdom die together, and there is no external providence that will save either one.

Against this the poet sets the ring-composition's older funeral — Scyld's at the poem's opening, a hero mourned but the Danish line secure. Beowulf's funeral does not close like that. It closes into doom. This is why Tolkien called the poem an *elegy* rather than a heroic poem. What it grieves at the end is not only a man. It is a people.`,
    crossReferences: [],
    tags: ["historical", "philosophical", "literary-influence"],
  },
  {
    id: "beowulf-43-funeral-lament",
    bookId: "beowulf",
    chapterNumber: 44,
    anchorText: "The folk of the Geatmen got him then ready",
    anchorOccurrence: 1,
    title: "The burning of Beowulf: the poem closes as it began",
    quotedPassage: "The folk of the Geatmen got him then ready / A pile on the earth strong for the burning, / Behung with helmets, hero-knights' targets, / And bright-shining burnies…",
    passageReference: "Fitt XLIII",
    commentary: `The poem's last image is a funeral-pyre at Hronesness, the Whale's Cape, on the Geatish coast. The pyre is heaped with armor — helmets, shields, mail-shirts — as the dead king had asked. The Geats kindle it. The smoke rises dark against the sky. A "Geatish woman" — unnamed, possibly widowed — sings a lament: she foresees the invasions to come, the captivity of women, the slaughter of the kingdom. This is one of the few female voices the poem gives us, and it is a voice of prophecy.

Then twelve warriors ride their horses around the barrow in a funeral circuit, speaking in turn the praise of their fallen king. The Old English word for their speech is *mǣlan* — a formal, measured telling. Each of them says of Beowulf what Beowulf most wanted said: that he was a *lof-geornost* — "most eager for glory" — and also *mann-dǣdum*, which Hall renders as "in his manners most gracious." The last word of the poem, in the Old English, is *lof-geornost* — "most eager for praise." The hero's last human legacy is the word that describes the virtue for which he died.

The poem has begun with Scyld's funeral at sea and ends with Beowulf's on the cape. Between the two funerals it has run the whole length of a life and a kingdom. This is ring composition executed at the scale of an entire epic. The closing image — smoke, weeping, riders circling a barrow, a widow's lament — is the single most enduring funeral-scene in English literature, and every later English treatment of a fallen hero has it somewhere in its DNA. Tennyson's Arthur, Tolkien's Théoden, the last scenes of so many Anglo-Saxon-descended stories: the barrow-fire is here.`,
    crossReferences: [
      {
        type: "echo",
        description: "Tennyson's passing of Arthur in Idylls of the King consciously echoes Beowulf's funeral: a dying king, a loyal last retainer, a barrow at the sea, the people's coming doom. Tennyson had read Beowulf in Kemble's edition.",
        workTitle: "Idylls of the King",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "The Passing of Arthur",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },
]
