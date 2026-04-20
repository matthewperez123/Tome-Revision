import type { Annotation } from "../types"

// ── Beowulf Opus Cluster B — The Grendel Fight (Fitts XII–XIII) ────────
// Anchors line-exact against public/content/beowulf/ch-13.json and ch-14.
// Covers: Grendel's approach to Heorot, the door bursting open, Beowulf's
// unarmed combat, the arm torn from the socket, Grendel's flight to the
// fen. Per spec, this is one of the five Opus clusters; Tolkien's reading
// of the fight as a *meditation on the monstrous inside the hall* is the
// interpretive spine.

export const BEOWULF_GRENDEL_FIGHT: Annotation[] = [
  {
    id: "beowulf-12-grendel-approaches",
    bookId: "beowulf",
    chapterNumber: 13,
    anchorText: "’Neath the cloudy cliffs came from the moor",
    anchorOccurrence: 1,
    title: "Grendel's approach: three sentences, each a camera-cut nearer",
    quotedPassage: "'Neath the cloudy cliffs came from the moor then Grendel going, / God's anger bare he.",
    passageReference: "Fitt XII, opening lines",
    commentary: `One of the most famous passages in Old English. In the original the poet uses a repeated verse-paragraph structure: *Com on wanre niht / scriðan sceadugenga* — "In the dim night / came gliding the shadow-goer." The poet gives Grendel's approach in three sentences, and each sentence jumps the camera closer:

  1. *From the moors, under the cloudy cliffs* — he is still far off, a figure out on the landscape.
  2. *He went under welkin* — he is now near the hall, walking under the sky.
  3. *Then came to the building the warrior marching* — he is at the door.

This is the first great sustained horror sequence in English literature, and it still works. Read it aloud. The meter slows the reader's approach to match Grendel's own. The poet is not hurrying. He wants you to feel the distance close.

"God's anger bare he" — the poet editorializes: Grendel goes under God's anger. But notice the grammatical ambiguity of the Old English: it can mean *God is angry at him* (Grendel carries divine condemnation) or *he bears God's anger toward others* (he is God's scourge upon the Danes). Most scholars read the first; a minority read the second; the poet may not have chosen. Both are in the line.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },
  {
    id: "beowulf-12-door-bursts",
    bookId: "beowulf",
    chapterNumber: 13,
    anchorText: "The door quickly opened",
    anchorOccurrence: 1,
    title: "The door of Heorot: a small detail that carries the whole terror",
    quotedPassage: "The door quickly opened / On fire-hinges fastened, when his fingers had touched it; / The fell one had flung then — his fury so bitter — / Open the entrance.",
    passageReference: "Fitt XII",
    commentary: `An under-appreciated line. The door of Heorot — the great mead-hall, the symbol of civilization and human fellowship — is *fire-hinged*, probably iron bands hammered by the best Danish smith. It is meant to be unbreakable. Grendel touches it and it bursts open.

The poet does not say this to mean the monster is strong. He says it to mean that *the civilized hall's best defenses are nothing* against what is coming for it from outside the light. Every hall-image in the poem — the mead-benches, the song, the feasting — is about a small warm circle of humanity against a huge cold dark. Heorot is the greatest hall ever built in the Germanic imagination. And its door, iron-banded, opens at a touch.

This is Tolkien's point about the monsters as the poem's spine. Grendel is not a problem Beowulf can solve permanently. He is the shape of the dark pressing on the door from outside. Kill this Grendel and his mother will come; kill her and the dragon waits fifty years on. Hall-doors fail. That is the poem's argument.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "beowulf-12-unarmed-combat",
    bookId: "beowulf",
    chapterNumber: 13,
    anchorText: "Higelac",
    anchorOccurrence: 1,
    title: "Why Beowulf fights bare-handed",
    quotedPassage: "Higelac's hardy henchman and kinsman / Held him by the hand; hateful to other / Was each one if living.",
    passageReference: "Fitt XIII",
    commentary: `Beowulf has sworn, at the feast before the fight, to meet Grendel without a sword — "weapons of victory / Swords and suchlike he had sworn to dispense with" — because Grendel himself uses no weapons, and Beowulf's *boast* (the formal pre-combat vow that is not empty talk but contractual commitment in Germanic warrior culture) binds him. The phrase *weapons of victory* is a kenning for swords; the poet is honoring both Beowulf's word and the sword he refuses to draw.

The result is the most celebrated hand-to-hand combat in European literature: two beings gripping each other in the dark hall, the mead-benches splintering, the building itself shuddering so hard the poet says even the gold-covered decorations almost tore loose from the walls. No weapons, no strategy. Just grip.

Beowulf wins because, crucially, he has the stronger hold. The poet later tells us he had the strength of thirty men in his hand-grip. Grendel, who has never met a man he could not escape from, cannot escape. Realizing this — that he is trapped, that he is going to die — is the moment the poem enters the strange sympathy of Grendel's interiority. The fight's victor is not in doubt; what is in doubt is the moral temperature of the victory.`,
    crossReferences: [],
    tags: ["philosophical", "mythological"],
  },
  {
    id: "beowulf-13-arm-torn",
    bookId: "beowulf",
    chapterNumber: 14,
    anchorText: "The direful demon",
    anchorOccurrence: 1,
    title: "The arm torn from the socket — trophy and proof",
    quotedPassage: "A body-wound suffered / The direful demon…",
    passageReference: "Fitt XIII",
    commentary: `The specific detail of the fight's end is surgical. Beowulf does not kill Grendel in the hall. He wrenches the monster's arm off at the shoulder; Grendel breaks free, mortally wounded but not dead, and flees into the fen to die later in his mother's lair.

The arm will be hung from the rafters of Heorot as a trophy the next day — one of the poem's most visceral images. It is a piece of the monster that proves what was done. It is also (this matters) the physical token of Beowulf's boast: the sword he did not use is the sword Grendel did not escape.

Scholars note that the Old English word for the wound, *sinweorc*, literally means "sinew-work" — the tearing of tendon from bone. The poet does not dress the violence up. Beowulf's victory is brute, specific, physical. And Grendel's death is off-stage: he crawls home to die. What kind of hero-poem, a modern reader might ask, leaves the kill itself off-camera? A poem for which, as we will see clearly in the Grendel-mother sequence, killing the monster is never the point.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "beowulf-13-heorot-exultation",
    bookId: "beowulf",
    chapterNumber: 14,
    anchorText: "earlmen’s defender",
    anchorOccurrence: 1,
    title: "The hall-thanes wake to a new world, briefly",
    quotedPassage: "For no cause whatever would the earlmen's defender / Leave in life-joys the loathsome newcomer, / He deemed his existence utterly useless / To men under heaven.",
    passageReference: "Fitt XIII, opening",
    commentary: `Morning in Heorot. Hrothgar's thanes wake to find the monster that has hunted them for twelve years has been driven off, mortally wounded. They follow the blood-trail to the edge of the mere, where the water is still churning — the pool of Grendel's ancestors — and see it boiling with gore. Grendel is dying down there somewhere.

The celebration that follows is real but, on a second reading, deeply ironic. The Danes believe their suffering is over. The reader, or the Old English listener who knew the oral tradition, understands that Grendel's *mother* is down there too, and she is both older and worse than he was. The joy in Heorot this morning lasts, in story-time, about twenty-four hours.

The Old English *gūðrinc monig* — "many a war-warrior" — that Hall renders as "Many a noble / Of Beowulf brandished his battle-sword old" begins the morning's formal celebration. Next, the scop will improvise a song comparing Beowulf to Sigemund the dragon-slayer and contrasting him with Heremod, the failed king. That will be the first of the embedded lays whose whole *point* is to tell us what kind of glory lasts and what kind fails. Even in the Danes' best morning, the poem is quietly remembering how things end.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
]
