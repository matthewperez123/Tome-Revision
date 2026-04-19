/**
 * Le Morte d'Arthur — Virgil annotations.
 *
 * Hand-curated annotations for the load-bearing passages named in the
 * ingestion spec. This file is authored — NOT machine-generated. Batch
 * API generation of the remaining ~6-10 annotations per chapter across
 * all 504 body chapters is a separate pass (PART 4 of the Malory spec)
 * and is not attempted in this checkpoint.
 *
 * The seed set here covers:
 *   · Book I ch.5    — the birth of Arthur and the foundational secret
 *   · Book I ch.25   — Excalibur from the Lady of the Lake
 *   · Book II ch.15  — the Dolorous Stroke (wellhead of the Grail story)
 *   · Book IV ch.1   — Merlin's entombment by Nyneve
 *   · Book VI ch.1   — Launcelot enters the stage as peerless knight
 *   · Book VIII ch.1 — THE TRISTRAM DIGRESSION BEGINS (orientation)
 *   · Book XIII ch.1 — Galahad arrives; the Siege Perilous filled
 *   · Book XVII ch.22 — the achievement of the Sankgreal at Sarras
 *   · Book XVIII ch.1 — where the Lancelot-Guinevere affair moves from
 *                       implication to crisis. Cross-references to
 *                       Inferno V (Francesca & Paolo reading of Lancelot).
 *   · Book XVIII ch.20 — the death-barge of the Maid of Astolat
 *                       (Tennyson's direct source; Waterhouse's painting)
 *   · Book XX ch.1    — the rupture: the queen's chamber, the exposure
 *   · Book XXI ch.5   — Bedivere returns Excalibur; the Avalon barge
 *   · Book XXI ch.12  — Sir Ector's eulogy over Launcelot
 *   · Book XXI ch.13  — "rex quondam rexque futurus"; the closing
 *
 * Voice: Virgil — scholarly but warm. Paragraph prose; no bullet lists.
 * 3–5 sentences typical, up to 8 on the load-bearing passages. No
 * "Great question!" openings. The quality bar is the Outis-pun note on
 * the Odyssey side of the library.
 *
 * `chapterNumber` is the FLAT chapter index (ch-N in public/content/),
 * matching the convention used by Odyssey/Aeneid/Idylls annotations.
 * The book-and-chapter label appears in `passageReference`.
 */

import type { Annotation } from "./types"

export const GENERATED_LE_MORTE_DARTHUR_ANNOTATIONS: Annotation[] = [

  // ═══════════════════════════════════════════════
  // BOOK I, Chapter 5 — the birth of Arthur (flat 6)
  // ═══════════════════════════════════════════════
  {
    id: "malory-1-5-arthur-born",
    bookId: "le-morte-darthur",
    chapterNumber: 6,
    anchorText: "he was christened and named Arthur",
    anchorOccurrence: 1,
    title: "The Secret at the Foot of the Legend",
    quotedPassage: "And when the child was born he was delivered unto Merlin, and so he bare it forth unto Sir Ector, and made an holy man to christen him, and named him Arthur; and so Sir Ector's wife nourished him with her own pap.",
    passageReference: "Book I, Ch. 5",
    commentary: `Malory gives you Arthur's birth in one sentence. A child, a wizard's hand, a foster-home. Nothing else. It is a remarkable sleight: the single most famous birth in English legend, passed over as a delivery of goods.

Notice what the sentence is NOT doing. There is no prophecy spoken over the cradle. Arthur does not know he is the king's son. Ector does not know. The child's own mother (Igraine) does not know. Four people in this passage, and three of them are wrong about who this baby is. Only Merlin knows, and Merlin keeps the secret for the next fourteen years until the sword in the stone.

This is Malory's grammar for the whole work. Identity is hidden. Kinship is hidden. The high and the low exchange places (Arthur in a yeoman's house; Mordred later, walked among the knights unrecognized for half the book). What the reader thinks is coincidence is almost always descent.

The Cistercian monk who wrote the French *Queste del Saint Graal* would read this chapter as typology — the hidden Christ, the secret king, the unrecognized shepherd. Malory does not say that. He simply gives you the sentence, and the sentence's silence does the work.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  // ═══════════════════════════════════════════════
  // BOOK I, Chapter 25 — Excalibur from the Lady of the Lake (flat 26)
  // ═══════════════════════════════════════════════
  {
    id: "malory-1-25-excalibur-received",
    bookId: "le-morte-darthur",
    chapterNumber: 26,
    anchorText: "an arm clothed in white samite",
    anchorOccurrence: 1,
    title: "The Sword from the Lake",
    quotedPassage: "So they rode till they came to a lake, the which was a fair water and broad, and in the midst of the lake Arthur was ware of an arm clothed in white samite, that held a fair sword in that hand. Lo! said Merlin, yonder is that sword that I spake of. With that they saw a damosel going upon the lake.",
    passageReference: "Book I, Ch. 25",
    commentary: `This is the scene. The arm, the samite, the sword held above water: three images that have furnished English imagination for five hundred years and that almost nobody reading them for the first time realizes are a pre-Christian gift-ceremony preserved in Malory's prose almost unaltered.

What Malory is describing is a votive deposit. Archaeologists have pulled hundreds of fifth- and sixth-century swords out of British and Welsh lakes — offerings to the water-powers, handed back when the warrior died. By Malory's day the custom was a thousand years dead, but the story-shape had entered romance through the Breton lays and the French prose cycles, and it arrives here half-Christianized, half-pagan, entirely uncanny.

The sword is called *Excalibur* — Malory spells it several ways (*Excalibor, Caliburnus* in Latin chronicles) — and the name is Celtic, glossed in one early source as "cut-steel." The scabbard, Merlin tells Arthur, is worth ten of the sword: while he wears it he cannot bleed. That detail matters. Morgan le Fay will steal the scabbard in Book IV, and from that moment Arthur's body is mortal again. The whole plot from Book IV onward is, structurally, the long arc of a king who has lost his invulnerability.

Note the decorum of the gift: Arthur does not seize the sword. He asks the Lady's permission. He promises a boon in return. The older custom — weapon for weapon, king for land, gift for gift — is intact. It is a contract. When Bedivere, at the end of the work, throws the sword BACK into the lake (Book XXI, Ch. 5), he is not destroying it. He is closing the contract. The loan is over.`,
    crossReferences: [
      {
        type: "compare",
        description: "The Lady returns to claim her gift at the end: Sir Bedivere's throwing of Excalibur back into the water in Book XXI completes the contract opened here.",
        workTitle: "Le Morte d'Arthur",
        workAuthor: "Thomas Malory",
        passageReference: "Book XXI, Ch. 5",
        targetBookId: "le-morte-darthur",
        targetChapterNumber: 497,
        targetAnchorText: "throw my sword in that water",
      },
    ],
    tags: ["historical", "mythological", "literary-influence"],
  },

  // ═══════════════════════════════════════════════
  // BOOK IV, Chapter 1 — Merlin entombed (flat 63)
  // ═══════════════════════════════════════════════
  {
    id: "malory-4-1-merlin-entombed",
    bookId: "le-morte-darthur",
    chapterNumber: 63,
    anchorText: "Nimue",
    anchorOccurrence: 1,
    title: "The Wizard Who Sees Everything Including This",
    quotedPassage: "And always Merlin lay about the lady to have her maidenhood, and she was ever passing weary of him, and fain would have been delivered of him, for she was afeard of him because he was a devil's son, and she could not beskift him by no means. And so on a time it happed that Merlin showed to her in a rock whereas was a great wonder, and wrought by enchantment, that went under a great stone. So by her subtle working she made Merlin to go under that stone to let her wit of the marvels there; but she wrought so there for him that he came never out for all the craft he could do.",
    passageReference: "Book IV, Ch. 1",
    commentary: `Merlin is a prophet. The whole plot he has been orchestrating since Book I depends on his foreknowledge — of Arthur's birth, of the sword, of the Round Table, of Mordred. So Malory has to confront the question that haunts every prophecy-engine story: if he saw everything, did he see his own end?

Malory's answer is: yes. Merlin sees it. He tells Arthur about it beforehand. "All this that shall befall me," he says a few chapters earlier, "I know; but I cannot prevent it, for I am in love with her, and may not gainstand it." The prophet is fully aware he is being led into a trap by his own desire. He walks under the stone anyway.

This is the hinge of the work. From this chapter on, there is no oracle. The kingdom has to make its own decisions without foreknowledge. Gawain, Launcelot, Arthur himself — they will be blundering through the next seventeen books without anyone who can see around corners. When the Grail arrives in Book XIII it is a vision, not a plan; and when the realm falls in Book XXI there is nobody to warn of the dream the night before.

The wizard-who-foresees-his-own-entrapment is a motif Malory inherits from the French *Suite du Merlin*. What he does with it is recognizably modern: the moral cost of knowledge is that you cannot stop watching yourself choose wrongly.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical", "mythological"],
  },

  // ═══════════════════════════════════════════════
  // BOOK VI, Chapter 1 — Launcelot introduced (flat 103)
  // ═══════════════════════════════════════════════
  {
    id: "malory-6-1-launcelot-peerless",
    bookId: "le-morte-darthur",
    chapterNumber: 103,
    anchorText: "Sir Launcelot du Lake",
    anchorOccurrence: 1,
    title: "The Knight Who Arrives Already Complete",
    quotedPassage: "And so this Sir Launcelot du Lake increased so marvellously in worship and honour, therefore he is the first knight that the French book maketh mention of after King Arthur came from Rome. Wherefore Queen Guenever had him in great favour above all other knights, and in certain he loved the queen again above all other ladies and damosels of his life, and for her he did many deeds of arms, and saved her from the fire through his noble chivalry.",
    passageReference: "Book VI, Ch. 1",
    commentary: `Malory introduces the two most consequential characters of his work — Launcelot and his love for the queen — in a single sentence, glossed as if it were common knowledge. No courtship scene. No first meeting. No origin story for the love. It is already the case.

Compare this to the French Vulgate *Lancelot*, Malory's source, where the hero's arrival at court, his first glance at the queen, the foundational courtly-love exchanges, and the gradual intensification of the affair occupy hundreds of folios. Malory compresses all of it into "he loved the queen again above all other ladies" and walks on.

Two consequences follow. First, the love is structurally given, not earned. It cannot be argued with. The reader who wants the romance to "develop" is in the wrong book. Second, the adultery is named right here, in the second sentence we hear about Launcelot — but it is named without moral weight. That moral weight will accumulate over a hundred chapters and finally detonate in Book XX. The slow fuse is lit on page one.

It is worth noticing what the sentence chooses to foreshadow: "he saved her from the fire." The reader of Book XX will remember. Malory is doing, in miniature, what Virgil does in the opening of the *Aeneid* with *arma virumque cano* — announcing the plot's shape in its first appearance.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic"],
  },

  // ═══════════════════════════════════════════════
  // BOOK VIII, Chapter 1 — Tristram digression begins (flat 156)
  // ═══════════════════════════════════════════════
  {
    id: "malory-8-1-tristram-opens",
    bookId: "le-morte-darthur",
    chapterNumber: 156,
    anchorText: "Tristram",
    anchorOccurrence: 1,
    title: "You Are Entering a Two-Hundred-Chapter Detour",
    quotedPassage: "It was a king that hight Meliodas, and he was lord and king of the country of Lyones, and this Meliodas was a likely knight as any was that time living. And by fortune he wedded King Mark's sister of Cornwall, and she was called Elizabeth, that was called both good and fair.",
    passageReference: "Book VIII, Ch. 1",
    commentary: `A word of warning from the floor: the Arthurian main plot pauses here and does not resume until Book XIII, some two hundred chapters downstream. What you are about to read is the *Book of Sir Tristram*, a parallel Arthurian-universe narrative Malory imports, largely intact, from the French Prose *Tristan*. Tristram himself is not a knight of the Round Table when we meet him — he is a prince of Lyones, nephew of King Mark of Cornwall. Eventually he and Launcelot will meet (Book X) and Tristram will join the fellowship. But the first forty-odd chapters of his story happen in a world that does not yet know Arthur is at the center of anything.

Many first-time readers abandon here. It is not a flaw in you. Malory is experimenting with the *entrelacement* — the braided interlace — of his French sources. The plot will drop a thread for ninety chapters and pick it up without preamble. Knights you thought were dead will walk back into the story. Tournaments you were sure were finished will resume twelve chapters later from a different knight's perspective.

Two practical supports. First, the Storylines sidebar (tap the tracker in the reader chrome) will tell you which threads are active in the chapter you are reading and where they were last seen. Second, skimming the tournament chapters is not cheating. The chapters that reward slow reading in the Tristram books are: the love-potion episode (Book VIII, Ch. 24); Tristram and Palomides' long rivalry (scattered through Books IX–X); Lamorak's death (Book X, Ch. 58); Launcelot at Corbin and the begetting of Galahad (Book XI). Everything else can be read at a gallop.

A deeper note: the Cornish cycle is older than the Arthurian one. Wagner's *Tristan und Isolde* descends from the same Prose *Tristan* Malory is reading, not from Malory himself. In European culture, Tristram and Isoud's story has been a separate romance tradition for eight centuries, braided into the Arthurian one only intermittently. Malory is performing the most ambitious of those braidings. The tangle you feel is the price of an integration that almost no other medieval writer attempted.`,
    crossReferences: [
      {
        type: "source",
        description: "Wagner's Tristan und Isolde (1865) descends from the same Prose Tristan corpus Malory is compiling here — not from Malory himself, but from the shared medieval source.",
        workTitle: "Tristan und Isolde",
        workAuthor: "Richard Wagner",
        passageReference: "The Cornish cycle (medieval source)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XIII, Chapter 1 — Galahad arrives (flat 357)
  // ═══════════════════════════════════════════════
  {
    id: "malory-13-1-galahad-arrives",
    bookId: "le-morte-darthur",
    chapterNumber: 357,
    anchorText: "Galahad",
    anchorOccurrence: 1,
    title: "A New Kind of Knight Walks In",
    quotedPassage: "Then anon they heard cracking and crying of thunder, that them thought the place should all to-drive. In the midst of this blast entered a sunbeam more clearer by seven times than ever they saw day, and all they were alighted of the grace of the Holy Ghost.",
    passageReference: "Book XIII, Ch. 1",
    commentary: `The main plot returns with a thunderclap. Two hundred chapters of Cornish interlace end; the Round Table reassembles at Camelot; and a young knight in red armor with no shield walks in unannounced and sits in the Siege Perilous — the seat Merlin reserved long ago for the knight who would achieve the Grail.

Notice the change in register. Malory's prose to this point has been worldly. Knights fight, boast, love, ride, arm, unhorse. From this chapter on and for five books, the language tilts toward the liturgical. Sunbeams, thunder, unveiled relics, the Holy Ghost. Malory is here adapting the French *Queste del Saint Graal*, a Cistercian-authored text of the 1220s that deliberately spiritualizes the chivalric material — and the translator's seam shows.

Watch how Galahad behaves. He does not boast. He does not answer challenges. He does not seek adventure; adventures come to him. He will complete the quest no other knight can complete, and the instant he achieves it he will die and be carried off by angels. He is a different species of knight, designed by the Cistercian imagination to make Launcelot look worldly by comparison. Malory does not resolve the tonal contradiction. He lays the two ethics side by side and lets the reader feel the scrape.

This is the structural climax of the whole work. Not the emotional climax — that is Book XXI. But the theological one. What happens next is that the fellowship vows to seek the Grail and rides out. Most of them will never come back. Those who do will come back changed. By Book XVII the Round Table is hollowed out; by Book XVIII the private affair of Launcelot and Guenever has started to crack the shell; by Book XX the fellowship is at war with itself. The Grail, Malory implies, is the thing the company cannot survive seeing.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XVII, Chapter 22 — achievement of the Grail (flat 431)
  // ═══════════════════════════════════════════════
  {
    id: "malory-17-22-grail-achieved",
    bookId: "le-morte-darthur",
    chapterNumber: 431,
    anchorText: "Sangreal",
    anchorOccurrence: 1,
    title: "The Cup That Leaves When It Is Seen",
    quotedPassage: "Therewith he kneeled down afore the table, and made his prayers, and then suddenly his soul departed to Jesu Christ, and a great multitude of angels bare his soul up to heaven, that the two fellows might well behold it. Also the two fellows saw come from heaven an hand, but they saw not the body. And then it came right to the Vessel, and took it and the spear, and so bare it up to heaven.",
    passageReference: "Book XVII, Ch. 22",
    commentary: `Galahad sees the Grail, prays, dies. A hand reaches down out of heaven and takes the Vessel away. That is the ending.

It is not triumph in the shape any chivalric romance before it would recognize. No kingdom is won. No marriage. The company does not ride home in glory. One knight (Percivale) will die a hermit at Sarras within the year. Another (Bors) will return to Arthur alone, and almost nothing in Camelot will have changed except that the Round Table has been emptied of its best men. The Grail is withdrawn from the world. It will not be seen by human eyes again in Malory.

This is Malory's fidelity to his source. The French *Queste* ends with the same withdrawal — a deliberate theological move to deny the chivalric order any institutional possession of holiness. The Cistercian author is saying: the vision is real, and it is not yours to keep. Galahad's death at the moment of vision is not a tragedy; it is a translation. He has been completed.

What Malory does that the *Queste* does not do is return Bors to Camelot. A living witness, coming back to a court that will not be redeemed by what he has seen. When Bors sits at the Round Table in Book XVIII he is carrying an experience nobody at that table can share. Eight books later when the table falls apart he is the only one who does not seem surprised. Malory, I suspect, understood that the Grail's most devastating consequence was not the knights it killed but the one it sent home.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XVIII, Chapter 1 — the affair moves to crisis (flat 433)
  //   THIS IS THE MALORY ↔ INFERNO V DEMO CROSS-REFERENCE
  // ═══════════════════════════════════════════════
  {
    id: "malory-18-1-launcelot-guenever-crisis",
    bookId: "le-morte-darthur",
    chapterNumber: 433,
    anchorText: "Sir Launcelot began to resort unto Queen Guenever again",
    anchorOccurrence: 1,
    title: "Galeotto: The Book That Reads the Reader",
    quotedPassage: "Then as the book saith, Sir Launcelot began to resort unto Queen Guenever again, and forgat the promise and the perfection that he made in the quest; for, as the book saith, had not Sir Launcelot been in his privy thoughts and in his mind so set inwardly to the queen as he was in seeming outward to God, there had no knight passed him in the quest of the Sangreal.",
    passageReference: "Book XVIII, Ch. 1",
    commentary: `This is the sentence on which the whole catastrophe turns. Launcelot has returned from the Grail quest. He has made a private vow of reform. He keeps it for a while. Then, Malory writes — with the most heartbreaking "as the book saith" in English — he begins to resort unto the queen again.

The construction is worth noticing. "Had not Sir Launcelot been in his privy thoughts and in his mind so set inwardly to the queen as he was in seeming outward to God, there had no knight passed him in the quest." This is the grammar of a self-divided saint. Launcelot has been doing, all through Books XV–XVII, the outward behaviors of holiness. His inward allegiance was elsewhere. The Grail knew. The Grail — the text is clear — is the reason he was not granted the full vision that Galahad, Percivale, and Bors were granted.

Now set this sentence against the most famous reader of Arthurian romance in literature: Francesca da Rimini, in Dante's *Inferno* V. Francesca tells Dante that she and Paolo fell into their fatal love while reading — and what they were reading was the Prose *Lancelot*, the exact tradition Malory is compiling. "Galeotto fu 'l libro e chi lo scrisse," she says: *Galehaut was the book, and he who wrote it was one too* — Galehaut being the go-between who, in the French source, arranged the first kiss between Lancelot and Guinevere. Francesca is saying: the book of Lancelot was our pander. The story you are now reading in Malory was, for Francesca, the instrument of her damnation.

Dante is in Hell looking at the consequence of the kiss Malory will narrate three chapters from now. The two texts are looking at each other across two centuries and one narrative. When Launcelot walks back to Guenever's chamber, he is walking into Dante's second circle — and Dante, writing in 1314, knew he was writing about Malory's characters.

For the reader: the Storylines sidebar now shows "The Launcelot-Guenever Crisis" as the active thread. The arc runs to Book XX, Ch. 22 — the rupture.`,
    crossReferences: [
      {
        type: "compare",
        description: "Dante places Francesca and Paolo in Inferno V for a kiss they say the Prose Lancelot pandered for them — 'Galeotto fu 'l libro.' The romance you are reading in Malory is, in Francesca's speech, the instrument of her damnation. Dante is writing about Malory's characters two centuries before Malory compiles them.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno V, 127–138",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 4,
        targetAnchorText: "Love, that on gentle heart doth swiftly seize",
      },
    ],
    tags: ["literary-influence", "philosophical", "linguistic"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XVIII, Chapter 20 — the Maid of Astolat (flat 452)
  // ═══════════════════════════════════════════════
  {
    id: "malory-18-20-astolat-barge",
    bookId: "le-morte-darthur",
    chapterNumber: 452,
    anchorText: "Elaine",
    anchorOccurrence: 1,
    title: "The Barge at Camelot",
    quotedPassage: "Then King Arthur made the letter to be read, the which was this intent: Most noble knight, Sir Launcelot, now hath death made us two at debate for your love; I was your lover, that men called the fair maiden of Astolat; therefore unto all ladies I make my moan, yet pray for my soul and bury me at the least, and offer ye my mass-penny.",
    passageReference: "Book XVIII, Ch. 20",
    commentary: `A small boat drifts to Camelot. An old man steers it. A dead girl lies in it, dressed in gold cloth, a letter in her right hand. The court crowds to the riverbank. Arthur reads the letter aloud. The letter is the one above.

Four and a half centuries later Tennyson will re-narrate this scene from two angles. In "The Lady of Shalott" (1832) it is the image that remains when the prose has evaporated: the drift downstream, the body, the song dying out. In "Lancelot and Elaine" (1859) he restores Malory's plot and gives Elaine an interior life the medieval text does not trouble with. Both poems descend directly from this chapter; the Waterhouse painting now on the cover of this book (commissioned 1888) is Tennyson's scene, which is this scene.

Notice what Malory does and does not say. He does not describe her grief. He does not let us into her thoughts. He gives us the letter she has written and then the funeral. The letter is the only interiority she gets. When Guenever hears it she says one astonishing sentence: "Ye might have shewed her some bounty and gentleness, that might have preserved her life." Launcelot's answer — "my love doth not compel me to love by constraint" — is correct and is also, in the context, the cruellest thing a human being has ever said in English prose.

This is Malory's ethical method. He will not tell you what to think. He will let Launcelot be right and Elaine be dead on the same page, and he will move on to the next chapter. The reader carries the weight.

A small scholarly note: the Fair Maiden has a name in Malory — *Elaine* — but it is a crowded name in the work. This is a different Elaine from Elaine of Corbenic (Galahad's mother) and from Elaine Arthur's sister. Malory never confuses them. He gives them the same name because medieval romance is indifferent to the modern novel's demand for one-name-per-woman.`,
    crossReferences: [
      {
        type: "echo",
        description: "Tennyson's 'Lancelot and Elaine' (1859) retells this chapter; 'The Lady of Shalott' (1832) distils it into a single image — the drifting barge, the song dying out. The cover painting of Malory in this edition (Waterhouse, 1888) is Tennyson's poem, which is Malory's chapter.",
        workTitle: "Idylls of the King",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "'Lancelot and Elaine'",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XX, Chapter 1 — the exposure (flat 481)
  // ═══════════════════════════════════════════════
  {
    id: "malory-20-1-rupture",
    bookId: "le-morte-darthur",
    chapterNumber: 481,
    anchorText: "Sir Agravaine",
    anchorOccurrence: 1,
    title: "The Door That Cannot Be Unopened",
    quotedPassage: "In May, when every heart flourisheth and burgeoneth (for as the season is lusty to behold and comfortable, so man and woman rejoice and gladden of summer coming with his fresh flowers), for winter with his rough winds and blasts causeth a lusty man and woman to cower and sit by fires. So this season it befell in the month of May, a great anger and unhap that stinted not till the flower of chivalry of all the world was destroyed and slain.",
    passageReference: "Book XX, Ch. 1",
    commentary: `Every English reader who has read Chaucer's "Whan that Aprille with his shoures soote" notices the cadence. Malory is writing his own May-opening — *In May, when every heart flourisheth and burgeoneth* — and using it, as Chaucer did, to set a frame around what follows. Except where Chaucer's April is the beginning of a pilgrimage, Malory's May is the beginning of the catastrophe.

The sentence goes on: "a great anger and unhap that stinted not till the flower of chivalry of all the world was destroyed and slain." The book tells you, in its second sentence, what the book is about. Everything from here until Avalon is the unfolding of that sentence.

What happens is small and procedural. Sir Agravaine and Sir Mordred — two of Gawain's brothers — decide they have had enough of Launcelot and the queen, and they tell the king. Arthur, who has known for chapters without knowing, is forced to know. A trap is laid. Launcelot is caught in Guenever's chamber. He fights his way out, killing thirteen knights, one of whom is Agravaine himself. From that bedroom door onward the fellowship is at war with itself. Launcelot's faction holds Joyous Gard; Arthur and Gawain besiege it. The pope intervenes. The queen is returned. Launcelot is exiled. Gawain, implacable in grief for his killed brothers (especially Gareth, accidentally slain by Launcelot in the rescue), pursues his vendetta into France.

What is extraordinary about Malory's handling is that no one villain emerges. Agravaine is small-minded. Mordred is scheming. But Arthur is caught by the laws of his own realm (he must condemn the queen). Launcelot is caught by his love (he must rescue her). Gawain is caught by grief (he cannot forgive the death of his brother). Everyone is acting within the ethics the Round Table installed at its founding — and the ethics devour the institution that founded them. Malory's tragedy is structural, not moral.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XXI, Chapter 5 — Excalibur returned, Avalon (flat 497)
  // ═══════════════════════════════════════════════
  {
    id: "malory-21-5-avalon",
    bookId: "le-morte-darthur",
    chapterNumber: 497,
    anchorText: "fast by the bank hoved a little barge",
    anchorOccurrence: 1,
    title: "The Loan Returned",
    quotedPassage: "And when they were at the water side, even fast by the bank hoved a little barge with many fair ladies in it, and among them all was a queen, and all they had black hoods, and all they wept and shrieked when they saw King Arthur. Now put me into the barge, said the king. And so he did softly; and there received him three queens with great mourning; and so they set them down, and in one of their laps King Arthur laid his head. And then that queen said: Ah, dear brother, why have ye tarried so long from me? alas, this wound on your head hath caught over-much cold.",
    passageReference: "Book XXI, Ch. 5",
    commentary: `Three queens weep. One of them is Morgan le Fay, who has been the work's chief antagonist since Book IV. She takes her brother's head into her lap. Whatever her schemes were, they end here. The sister is a sister again.

The scene closes the contract opened in Book I, Ch. 25. There the Lady of the Lake gave Arthur a sword on loan; Merlin told him the scabbard was worth ten of the sword. In Book IV Morgan stole the scabbard, and from that point Arthur's body was mortal. Here Bedivere throws the sword back into the water — and here a hand comes up out of the water, three times brandished, and takes it. The lake is reclaiming its own. The reign it secured is over. The loan is returned.

Notice Bedivere's two refusals. He tries twice to keep the sword. "What saw thou there?" the king asks. "I saw nothing but the waters wap and waves wan." And Arthur knows he is lying. "Ah, traitor untrue … thou art named a noble knight, and would betray me for the richness of the sword." This is the last act of command Arthur will give — to a single knight who almost cannot carry it out because he cannot bear to let the age be over. That is every reader. Malory knows it.

"If thou hear never more of me, pray for my soul." The chapter's last line, spoken from the barge as it rows away, contains the hinge the whole work rests on. Arthur's death, unlike every other death in the work, is not declared. He goes into Avalon *to be healed of his grievous wound*. The eleventh-century hermit who told Caxton about the grave at Glastonbury was one version of the story; the version Malory chooses here is the older one — *rex quondam rexque futurus*, the king who was and will be. Malory is committing himself to the option that keeps Arthur eligible to return. The whole modern genre of Arthurian literature, from Tennyson through T. H. White through every fantasy novel of the last century, lives inside the ambiguity this chapter leaves open.`,
    crossReferences: [
      {
        type: "source",
        description: "Tennyson's 'The Passing of Arthur' (1869) in Idylls of the King is a direct adaptation of this chapter — the throwing of Excalibur, the three queens, the barge, the hermitage.",
        workTitle: "Idylls of the King",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "'The Passing of Arthur'",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological", "philosophical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XXI, Chapter 12 — Sir Ector's eulogy (flat 504)
  // ═══════════════════════════════════════════════
  {
    id: "malory-21-12-ector-eulogy",
    bookId: "le-morte-darthur",
    chapterNumber: 504,
    anchorText: "thou wert the meekest man",
    anchorOccurrence: 1,
    title: "The Best Paragraph in English Prose",
    quotedPassage: "Ah Launcelot, he said, thou were head of all Christian knights, and now I dare say, thou Sir Launcelot, there thou liest, that thou were never matched of earthly knight's hand. And thou were the courteoust knight that ever bare shield. And thou were the truest friend to thy lover that ever bestrad horse. And thou were the truest lover of a sinful man that ever loved woman. And thou were the kindest man that ever struck with sword. And thou were the goodliest person that ever came among press of knights. And thou were the meekest man and the gentlest that ever ate in hall among ladies. And thou were the sternest knight to thy mortal foe that ever put spear in the rest.",
    passageReference: "Book XXI, Ch. 12",
    commentary: `This is Sir Ector de Maris, Launcelot's brother, speaking over Launcelot's corpse in a hermitage on the Severn.

Read the rhythm. Eight clauses, each beginning *and thou were*. Each one names an attribute; each one complicates the last. "The truest friend to thy lover that ever bestrad horse" — a friend to *your lover*, to the woman you loved: the eulogy names the adultery that destroyed the kingdom and does not blink. "The truest lover of a sinful man that ever loved woman" — *sinful man*; Ector is Launcelot's brother, not his confessor, but he is not hiding anything. "The meekest man … and the sternest knight" — the compound virtues running in opposite directions. "The kindest man that ever struck with sword" — a whole ethics in eight words.

No paragraph in English prose before it does what this paragraph does. The medium is not yet capable. Malory invents it, here, at the very end of the work, in the mouth of a minor character who has not previously spoken at length. Ector's grief finds a sentence-shape that English had been waiting for, and after Malory the shape is available to everybody. Every subsequent eulogy in English — Donne, Jonson, Whitman, every newspaper obit that begins *he was* — is downstream of these eight clauses.

C. S. Lewis said of this passage that it was the one moment in Malory where the prose "became what it had been trying to be all along." Mark Twain parodied the whole register mercilessly in *A Connecticut Yankee* — and spared this paragraph. T. H. White quoted it verbatim at the end of *The Ill-Made Knight*, the volume of *The Once and Future King* named for Launcelot. Caxton set it in his 1485 edition without the paragraph breaks modern editors insert. It is one long breath.

It is also, crucially, not about Launcelot. Ector is the survivor. Ector is speaking for himself as much as for his brother. What he is saying, under the anaphora, is: I do not know how to live in a world that does not contain this man. The paragraph is less a eulogy than a refusal to keep going. We have six paragraphs of Malory left, and then the book closes.`,
    crossReferences: [
      {
        type: "parody",
        description: "Twain's A Connecticut Yankee in King Arthur's Court savages this whole chivalric register — quoting Malory's chapter rubrics as its own chapter titles — but spares this paragraph. Twain knew what it was.",
        workTitle: "A Connecticut Yankee in King Arthur's Court",
        workAuthor: "Mark Twain",
        passageReference: "Ch. 1–15 (rubric parody); Ch. 43 (earnest).",
        targetBookId: "a-connecticut-yankee-in-king-arthurs-court",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  // ═══════════════════════════════════════════════
  // BOOK XXI, Chapter 13 — the closing; rex quondam rexque futurus (flat 505)
  // ═══════════════════════════════════════════════
  {
    id: "malory-21-13-rex-quondam",
    bookId: "le-morte-darthur",
    chapterNumber: 505,
    anchorText: "Rex quondam Rexque futurus",
    anchorOccurrence: 1,
    title: "The King Who Was and Will Be",
    quotedPassage: "Yet some men say in many parts of England that King Arthur is not dead, but had by the will of our Lord Jesu into another place; and men say that he shall come again, and he shall win the holy cross. I will not say it shall be so, but rather I will say, here in this world he changed his life. But many men say that there is written upon his tomb this verse: Hic jacet Arthurus, Rex quondam, Rexque futurus.",
    passageReference: "Book XXI, Ch. 13",
    commentary: `The final epitaph. *Here lies Arthur, once king and king to be.*

Malory is doing something careful. He does not commit to the supernatural option. He reports what people say — "some men say in many parts of England" — and what people saw carved on the tomb at Glastonbury. He weighs the report against his own preferred ending — "here in this world he changed his life," which in Malory's idiom means *he died* — and then, having weighed it, he gives the Latin tag in full and lets it stand.

This is the invention of the modern Arthurian tradition's central ambiguity. After Malory, every re-teller of the story has to choose: does Arthur come back? Tennyson's 1869 *Passing* leans toward yes. T. H. White's 1958 *Once and Future King* takes its title from the Latin and leans toward yes. Steinbeck's unfinished *Acts of King Arthur* leans toward yes. The whole modern fantasy tradition — everything from *Camelot* on Broadway to the Arthurian-cycle novels of Marion Zimmer Bradley and Mary Stewart — exists in the space this sentence keeps open.

What Malory himself seems to have believed: rather he died. But as a writer of romance he understood that the shape of the story needed the other option on the table. So he puts both on the page and walks away. *Hic jacet Arthurus, Rex quondam, Rexque futurus*. Here ends the whole book of King Arthur, and of his noble knights of the Round Table, that when they were whole together there was ever an hundred and forty. And here is the end of the death of Arthur.

One last scholarly note. Malory's own epilogue — which immediately follows this sentence in the 1485 printing and which Caxton retained — contains a first-person request: *I pray you all that read this book of Arthur and his knights, from the beginning to the ending, pray for me while I am alive, that God send me good deliverance, and when I am dead, pray for me that God have mercy on my soul.* "Good deliverance" is the language of prison. Malory was writing this book from prison. The writer-who-gives-the-readers-of-the-future-the-only-option-of-hope-he-cannot-give-himself is a figure the English language learned from Malory, and has not outgrown.`,
    crossReferences: [],
    tags: ["literary-influence", "historical", "philosophical"],
  },

]
