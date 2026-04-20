import type { Annotation } from "../types"

// ── Idylls of the King: The Passing of Arthur (Idyll XII) ──────────
// Tennyson's closing idyll (469 lines, 1869), incorporating and
// extending his 1833 "Morte d'Arthur" — his very first Arthurian
// poem, written when he was 24. The cycle's bookend: the poet spent
// fifty-two years writing toward his own earliest vision.
//
// Density: 11 annotations. Primary categories:
//   - Spec Part 4 Category 17: bookend structure, mist-battle,
//     Bedivere/Excalibur, Avalon departure, circular return of "old
//     order changeth."
//   - Spec Part 8 cross-reference cluster: Aeneid closing-parallel
//     (tone-difference: Virgil ends in violence, Tennyson in
//     transfiguration) and Paradise Lost "world was all before them"
//     lighter echo.
//
// Anchors are line-exact against `public/content/idylls-of-the-king/
// ch-12.json` after scripts/idylls/transform-book.ts (data-iotk-line).

export const IOTK_PASSING_OF_ARTHUR: Annotation[] = [
  // ── 1. The bookend structure — 1833 inside 1869 ─────────────────
  {
    id: "iotk-poa-bookend",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "That story",
    anchorOccurrence: 1,
    title: "\"That story which the bold Sir Bedivere\" — the 1833-in-1869 bookend",
    quotedPassage:
      "That story which the bold Sir Bedivere, / First made and latest left of all the knights, / Told, when the man was no more than a voice / In the white winter of his age, to those / With whom he dwelt, new faces, other minds.",
    passageReference: "Passing of Arthur, lines 1–5 · IotK XII.1–5",
    commentary: `The opening lines introduce the retrospective frame: Bedivere, surviving into old age, tells "that story" to a new generation. Bedivere has become *no more than a voice*, his own life dissolved into the story he tells about his lost king. *New faces, other minds* — the audience is entirely post-Arthurian; the last witness speaks to strangers.

This opening is 1869 writing (Tennyson added it to introduce the 1833 "Morte d'Arthur" when incorporating the older poem into the cycle). What follows — from approximately line 170 through line 440 — is the 1833 poem, preserved nearly verbatim. The idyll is therefore *structurally layered*: a 1869 framing opens, the 1833 poem runs nearly unchanged for 270 lines, a 1869 closing completes.

Three structural consequences:

1. **The cycle's closing is also its oldest material.** "The Passing of Arthur" contains passages Tennyson wrote when he was 24 (in 1833), and lines he wrote when he was 60 (in 1869), in the same idyll. The poet is in conversation with his younger self. The 1869 frame is the older Tennyson honoring and extending the work of the younger Tennyson. This is one of the most remarkable compositional facts in Victorian poetry.

2. **The idyll therefore has three tonal registers.** The 1869 opening (these five lines): remote, historical, Bedivere as legendary voice. The 1833 core (the casting of Excalibur, the barge, the passing): direct, mythic, richly pictorial. The 1869 closing: philosophical, circular (the return of *the old order changeth*). Reading the idyll attentively, one can hear the three layers. The 1833 material is the most sensuously immediate; the 1869 frames pull back into historical distance.

3. **The cycle's final argument is about time's own recursion.** Tennyson *spent 52 years writing toward his own earliest vision.* The cycle, whose stated frame is *the old order changeth*, enacts that change at the level of its own composition: the old order (young Tennyson's 1833 poem) is preserved, wrapped, and completed by the new order (older Tennyson's cycle). What changes is what is framed around it. The poem is, structurally, what the poem argues.

Bedivere as the framing consciousness is apt. He is the "bold" (*First made*) and the "latest left" — the first knight made a knight and the last knight surviving. He is the witness-of-everything, the thread across the cycle's whole action. That he is the idyll's interior-narrator is structurally fitting; he has seen what the others did not see, because he lived through what the others did not.

The phrase *no more than a voice / In the white winter of his age* is one of Tennyson's most affecting. Bedivere, at the end, is voice alone — the story has become more real than the teller — and he speaks in *the white winter of his age*, the double metaphor (winter / whiteness) naming both his physical condition (old, white-haired) and his temporal position (the season beyond the cycle's harvest).`,
    crossReferences: [],
    tags: ["literary-influence", "historical", "linguistic"],
  },

  // ── 2. The mist battle ──────────────────────────────────────────
  {
    id: "iotk-poa-mist-battle",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "death-white mist",
    anchorOccurrence: 1,
    title: "The mist battle — Tennyson's obscured ending",
    quotedPassage:
      "\"A death-white mist slept over sand and sea: / Whereof the chill, to him who breathed it, drew / Down with his blood, till all his heart was cold / With formless fear; and even on Arthur fell / Confusion, since he saw not whom he fought.\"",
    passageReference: "Passing of Arthur, lines 95–120 (approx.) · IotK XII.95–120",
    commentary: `The last battle — the fight in which Arthur mortally wounds Modred and receives his own death-wound — is, in Tennyson, fought in a thick white mist on the western coast. The mist obscures the combatants; Arthur cannot see whom he is fighting. *Even on Arthur fell / Confusion, since he saw not whom he fought.*

This is Tennyson's most important structural choice in the closing battle. Malory's last battle (XXI.3–4) is visually clear: named warriors, specific wounds, identifiable deaths. Tennyson replaces this with the mist — obscurity, formless fear, confusion — and the effect is to strip the battle of its chivalric legibility. What happens in the mist is not *this man killed that man*; it is *a kingdom ends*.

The mist is doing three things:

1. **Historical indistinctness.** The last battle of Arthur happens at the edge of legend, where specific historical facts become uncertain. Tennyson gives this uncertainty a meteorological image: the mist is literally the condition under which the story dissolves into myth. Who killed Modred, exactly? We cannot see. What happened to Arthur? We cannot see.

2. **Moral indistinctness.** In a mist, you cannot tell friend from foe. Arthur in the mist kills Modred, his own sister's son, his kingdom's traitor — but Modred is also (in the chivalric frame the cycle has been using) a knight. The mist makes the moral shape of the ending ambiguous: Arthur is at once defending the realm and killing a kinsman; the ending does not resolve which frame is primary.

3. **The tonal signature of the whole cycle's closing.** The cycle does not end in chivalric triumph or tragic clarity; it ends in something more like *dissolution*. The mist, the death-white sea, the formless fear — these are the atmospherics of a world dissolving. Tennyson is closing the cycle not with a defined endpoint but with an obscured one. The kingdom does not *fall*; it *dissolves*.

The phrase *death-white mist* is a signature Tennyson image. The color-word *death-white* (rather than simply *white*) does all the work: the mist is not neutral weather; it is already marked with the death that will happen inside it. The adjective slightly precedes the noun (*death-white*), the unusual compound making the reader parse "white-that-is-already-death's-color," which is the tonal shape of the whole passage.

Prosodically, the passage's pentameter is slow — long vowels, medial caesurae, heavy consonants at line-ends — and the *confusion* it reaches by line 120 is a prosodic condition as much as a narrative one. The sound works with the image. Tennyson is painting a mist by ear, again.`,
    crossReferences: [],
    tags: ["literary-influence", "linguistic", "mythological"],
  },

  // ── 3. Bedivere's three throws ──────────────────────────────────
  {
    id: "iotk-poa-excalibur",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "fling him far into the middle mere",
    anchorOccurrence: 1,
    title: "\"Fling him far into the middle mere\" — Excalibur returned",
    quotedPassage:
      "\"Therefore, said the King, / Take thou Excalibur, my sword, and fling him / Far into the middle mere: watch what thou seest, / And lightly bring me word. / … / So to the barge they came. There those three Queens / Put forth their hands, and took the King, and wept.\"",
    passageReference: "Passing of Arthur, lines 195–330 (approx.) · IotK XII.195–330",
    commentary: `This is the 1833 core of the idyll — material Tennyson wrote when he was 24, preserved nearly unchanged when he built the cycle around it in 1869. The casting of Excalibur, Bedivere's three attempts (two of which fail because he cannot bring himself to throw away so fine a sword), the final hand-rising-from-the-lake, the return of the weapon to its source.

The passage is among the most famous in all of English poetry. It has been anthologized independently as "Morte d'Arthur" for 190 years; it has been illustrated (by Doré and others); it has been adapted, parodied, quoted, and re-written countless times. Tennyson's handling of the sword-scene is so dominant that for many English readers *this is the Arthurian sword-scene*, more than Malory's.

Three aspects of the writing deserve specific notice:

1. **The sword's description.** The two failed throws give Tennyson occasion to describe the sword in superlative detail — the jeweled hilt, the diamond-studded guard, the "sparkling morning stars" of its gems. Bedivere cannot throw it away because the sword is *too fine* to throw away; the description is the reader's own temptation embedded in Bedivere's failure. The sword is beautiful; the loss of the sword is real.

2. **The arm in the lake.** *And the arm / Rose up from out the bosom of the lake / Clothed in white samite, mystic, wonderful, / And caught him by the hilt, and brandished him / Three times, and drew him under in the mere.* The image is one of the most striking in Victorian verse — arm-from-water, white samite, three brandishes, the going-under. Tennyson is writing in the mythic register, without irony, making an unambiguously magical moment feel inevitable.

3. **The barge of the three Queens.** *There those three Queens / Put forth their hands, and took the King, and wept.* Malory names the Three Queens — Morgan le Fay, the Queen of Northgalis, the Queen of the Wastelands. Tennyson leaves them unnamed. The anonymity is deliberate: Tennyson's Queens are mythic-general rather than narratively specific. The effect is to lift the passage out of Malory's particular mythography into a more universal register.

The continuity with Idyll I is now closed. The sword Merlin gave Arthur in *The Coming of Arthur* (*Take thou and strike! the time to cast away / Is yet far-off*) is here cast away. The cycle is structurally circular: the gift at the beginning is returned at the end, and the arm that catches the sword is the same arm that gave it. Tennyson's cycle is, in this sense, a single long breath — in at the beginning, out at the end — with the sword as the breath itself.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The casting-back of Excalibur completes the phrase from Idyll I's Excalibur-receiving scene: \"Take thou and strike! the time to cast away / Is yet far-off.\" The first idyll promised the cast-away; the twelfth performs it. The cycle's architectural ring is closed here.",
        workTitle: "Idylls of the King — The Coming of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Coming of Arthur, lines 300–305 (approx.)",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 1,
        targetAnchorText: "Take thou and strike",
      },
    ],
    tags: ["mythological", "literary-influence", "linguistic"],
  },

  // ── 4. Bedivere's recognition ──────────────────────────────────
  {
    id: "iotk-poa-bedivere-farewell",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "Comfort thyself",
    anchorOccurrence: 1,
    title: "\"Comfort thyself: what comfort is in me?\" — Arthur's farewell to Bedivere",
    quotedPassage:
      "\"And slowly answered Arthur from the barge: / 'The old order changeth, yielding place to new, / And God fulfils himself in many ways, / Lest one good custom should corrupt the world. / Comfort thyself: what comfort is in me? / I have lived my life, and that which I have done / May He within himself make pure! but thou, / If thou shouldst never see my face again, / Pray for my soul. More things are wrought by prayer / Than this world dreams of.'\"",
    passageReference: "Passing of Arthur, lines 408–420 (approx.) · IotK XII.408–20",
    commentary: `Arthur's farewell to Bedivere contains the cycle's most-quoted single couplet: *More things are wrought by prayer / Than this world dreams of*. The couplet is one of the most absorbed lines of Victorian poetry into general English — quoted in sermons, inscribed on tombstones, used as epigraph to countless works.

But the passage's more architecturally load-bearing line is *The old order changeth, yielding place to new* — the return, at Arthur's death, of the line he spoke at his coronation. (See the annotation on this line in "The Coming of Arthur," Idyll I.) Said by the rising king, it was triumphal — the new order displacing the old; said by the dying king, it is elegiac — his own order now yielding. Same line; different speaker-condition; different meaning.

This is the cycle's most important structural move. The doubled line means the cycle's philosophical argument has been *change itself*. What matters is not the order (Arthur's Round Table) but the fact of change (orders displacing orders, in history's continual unfolding). Tennyson, through Arthur, is articulating a view of history that is specifically post-Romantic, specifically Victorian — change as providential, as necessary, as the medium through which *God fulfils himself in many ways*. *One good custom should corrupt the world* is the aphorism's moral: no single order, no matter how fine, should persist forever, because stasis in a good custom is itself a corruption.

The logic is Hegelian. History moves dialectically; each order is a moment in a larger process; what matters is the process, not the moment. Tennyson probably did not know Hegel directly, but the intellectual atmosphere of 1830s–60s England was saturated with dialectical-historical thinking (via Carlyle, Coleridge's lectures, the German Romantic influence generally), and the thinking is available in the formula.

*Comfort thyself: what comfort is in me?* The immediate register is personal, not philosophical. Arthur is dying; Bedivere is grieving; the question is what comfort the dying king can give to the grieving knight. Arthur's answer is honest: he has no comfort to give from himself. What comfort there is must come from prayer — from the larger frame that outlasts Arthur's specific death.

This is also the passage's theological moment. *More things are wrought by prayer / Than this world dreams of* is a Victorian-Christian formulation that holds open the possibility of religious intervention without specifying a creed. Tennyson's characteristic theological register: prayer is real, is efficacious, is *more* than the world (the world of ordinary reason) understands — without specifying to whom one prays or what prayer accomplishes. The formula is *positive ambiguity*, offered in extremis. It is the register of In Memoriam extended into the Idylls' final moment.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The return of \"The old order changeth\" from Coming of Arthur (I.408) completes the cycle's architectural circle. Said by the rising king, triumphal; said by the dying king, elegiac. Same line; different meaning. The whole cycle is bracketed between the two utterances.",
        workTitle: "Idylls of the King — The Coming of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Coming of Arthur, lines 408–410",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 1,
        targetAnchorText: "The old order changeth",
      },
    ],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ── 5. The Avalon departure ────────────────────────────────────
  {
    id: "iotk-poa-great-deep",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "great deep to the great deep he goes",
    anchorOccurrence: 1,
    title: "\"From the great deep to the great deep he goes\" — the cycle's signature close",
    quotedPassage:
      "\"But now farewell. I am going a long way / With these thou seest—if indeed I go— / (For all my mind is clouded with a doubt) / To the island-valley of Avilion; / … / Where I will heal me of my grievous wound.\" / … / And on the mere the wailing died away. / But when that moan had past for evermore, / The stately ship of Arthur was drawn up / Into the sky; and from the great deep to the great deep he goes.",
    passageReference: "Passing of Arthur, lines 420–445 (approx.) · IotK XII.420–45",
    commentary: `*From the great deep to the great deep he goes* is the cycle's most-quoted line after *the old order changeth*. It is the signature close of the whole work — the phrase with which Arthur departs from the narrative, and with which the cycle's frame closes.

Parse the phrase. *Great deep* (first occurrence) — the ocean, the sea, the cosmic waters, the depth out of which Arthur came (cf. Bellicent's account of the mythic infant-on-the-wave in Idyll I). *Great deep* (second occurrence, though functionally the same) — the depth into which Arthur goes. The repetition is the point: Arthur returns to his origin. *From… to… he goes* — the movement itself, across the repeated term, is the passing.

Three readings are available:

1. **Mythic reading.** Arthur, who came from the great deep (the infant on the ninth wave), returns to the great deep (the Avalon barge on the sea). His life is a round trip between two appearances of the same primordial waters. This is the most straightforwardly Tennysonian reading, and it completes the cycle's ring-form.

2. **Theological reading.** The great deep is also the biblical deep (*tehom* in Hebrew, the primordial waters of Genesis 1:2). Arthur comes from God's waters and returns to them. His passage is not annihilation; it is reunion with his source. This is the reading Victorian Christian readers gave, and Tennyson permits it.

3. **Philosophical reading.** The great deep is the unknowable. Arthur comes from it and returns to it; what he is in himself is not distinct from the deep. His death is the moment at which the individual form dissolves back into the undifferentiated source. This is closer to a Neoplatonic or Schopenhauerian reading, which some twentieth-century critics have suggested.

Tennyson does not choose among the three. The phrase is deliberately available for all of them, and this ambiguity is the source of its power. It is the cycle's final theological move: a numinous image, intensely resonant, refused to any specific creedal specification.

The prosody completes the effect. Long open vowels — *great deep*, *great deep*, *goes* — slow the line almost to standstill. The internal rhyme (*deep / deep*) and the doubled phrase (*great deep to the great deep*) produce a soundscape that does not advance; it hovers. This is not a line you *read through*; it is a line you *stop at*. Tennyson has written a closing that refuses to close — the line does not move the reader forward; it holds the reader in its music.

Bedivere watches the ship pass. The idyll's actual closing (see the next annotation) returns to Bedivere on the shore. The phrase *from the great deep to the great deep he goes* is what Bedivere sees. It is therefore also the frame the cycle ends inside: the last witness on the shore, saying (or seeing) what he cannot quite name. The truth of Arthur's passing is what is seen from outside it, not what Arthur himself experiences.

Note also the parenthesis earlier in the speech: *(For all my mind is clouded with a doubt)*. Arthur himself is not sure if he is going to Avalon or dying. The line is extraordinary — a king in his final moment confessing that his mind is *clouded with a doubt*. Tennyson inserts this half-line into an otherwise triumphal passing, and it refuses the reader the easy consolation of certainty. The mist-battle's obscurity extends into the afterlife.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "\"From the great deep\" returns the infant-on-the-ninth-wave image from Bellicent's account in Coming of Arthur (I.370–90). Arthur comes from the great deep; Arthur returns to the great deep. The cycle's ring is closed, not at the level of plot only, but at the level of image.",
        workTitle: "Idylls of the King — The Coming of Arthur",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "Coming of Arthur, lines 380–390",
        targetBookId: "idylls-of-the-king",
        targetChapterNumber: 1,
        targetAnchorText: "naked babe",
      },
      {
        type: "allusion",
        description:
          "The \"great deep\" is also the biblical \"tehom\" (Genesis 1:2, \"darkness was upon the face of the deep\"). Arthur's return to the great deep is legible, within the Christian frame the cycle maintains, as return to God's primordial waters.",
        workTitle: "Genesis (King James Bible)",
        workAuthor: "Hebrew Bible",
        passageReference: "1:2",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical", "literary-influence"],
  },

  // ── 6. The Aeneid cross-reference ──────────────────────────────
  {
    id: "iotk-poa-aeneid-parallel",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "new sun",
    anchorOccurrence: 1,
    title: "The Aeneid cross-reference — two epic closings, two moral worlds",
    quotedPassage:
      "\"Thereat once more he moved about, and clomb / Even to the highest he could climb, and saw, / Straining his eyes beneath an arch of hand, / Or thought he saw, the speck that bare the King, / Down that long water opening on the deep / Somewhere far off, pass on and on, and go / From less to less and vanish into light. / And the new sun rose bringing the new year.\"",
    passageReference: "Passing of Arthur, lines 458–469 · IotK XII.458–69 (closing lines)",
    commentary: `The cycle's closing lines — Bedivere climbs to a height, watches the ship go *from less to less and vanish into light*, and the new sun rises bringing the new year. The Aeneid cross-reference the spec calls for lives here, and is worth setting up explicitly.

**The Aeneid's ending:** The closing of the Aeneid (Book XII, lines 950+) has Aeneas standing over the fallen Turnus, whom he is about to kill. Turnus begs for mercy; Aeneas almost grants it; then he sees that Turnus is wearing the sword-belt of Pallas (the young friend Turnus had killed earlier), and in a burst of rage Aeneas plunges his sword into Turnus's chest. The last three lines of the Aeneid are Turnus's death: *hoc dicens ferrum adverso sub pectore condit / fervidus; ast illi solvuntur frigore membra / vitaque cum gemitu fugit indignata sub umbras* — "So saying, he buried the sword hotly in the chest beneath. Then Turnus's limbs are loosed in death; his life, with a groan, flees indignant into the shades below." The Aeneid ends in a murder, and the murdered one's shade goes to Hades *indignata* — resentful, protesting — the Latin's last word before the poem closes.

**Tennyson's ending:** The Idylls ends with a ship vanishing *into light*, the new sun rising, the new year beginning. *From less to less and vanish into light* — the dying/departing king is seen, diminishing, until he becomes light itself. The new sun rises. The new year starts. The cycle closes in transfiguration — moving from death into luminosity, from one year into the next, from one order into the new order that replaces it.

**The tone-difference is the argument.** Virgil closes his epic in violent injustice — the indignant shade, the rage-killing, the unsettled moral question of whether Aeneas was right to kill. Tennyson closes his cycle in serene transfiguration — the ship vanishing into light, the new year rising, the sense of completion despite loss. The difference is not accidental. Tennyson writes the cycle's closing as explicitly *against* Virgil's closing. Where Virgil stages violence without resolution, Tennyson stages loss-with-transfiguration.

This is not to say Tennyson is simply consoling where Virgil is unflinching. The closing's consolation is earned, not cheap. The cycle has staged Guinevere's fall, Merlin's silencing, Lancelot's division, the Grail's cost, Pelleas's disillusion, the court's corruption, and now Arthur's death in a mist-obscured battle with his own sister's son. The transfiguration at the close is in the teeth of all of this, not in denial of it. Tennyson has earned the light by rendering the dark.

The 1,900-year trajectory from Virgil to Tennyson runs between these two closings. Virgil's Roman-civic poem ends in the knowledge that civilization is founded on violence that remains unresolved. Tennyson's Victorian-medievalist poem ends in the knowledge that civilizations end but new ones rise, that loss and renewal are the same process. The difference is the difference between ancient fatalism and Victorian providentialism — between civilization as a wound and civilization as a cycle.

Both readings are true to their moment. Virgil's closing is right about Rome, which built itself on the unresolved violence of civil war. Tennyson's closing is right about Victorian England, which inherited and built on medieval-Christian frameworks of renewal. Both closings are what their epics had to close with.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Aeneid's ending — Aeneas killing Turnus, Turnus's indignant shade fleeing to Hades — is the deliberate point of contrast for the Idylls' closing. Virgil closes his epic in violent injustice; Tennyson closes his in serene transfiguration. The two closings, read against each other, stage the 1,900-year trajectory from Roman civic violence to Victorian providential renewal. The cycle's closing is explicitly against Virgil's; the difference is one of epic's biggest moral statements.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, lines 950–952 (closing)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: "vitaque cum gemitu fugit indignata sub umbras",
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ── 7. Paradise Lost echo — world was all before them ──────────
  {
    id: "iotk-poa-paradise-lost-echo",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "the new sun",
    anchorOccurrence: 1,
    title: "A lighter echo — Paradise Lost's \"world was all before them\"",
    quotedPassage:
      "\"And the new sun rose bringing the new year.\"",
    passageReference: "Passing of Arthur, line 469 (closing line) · IotK XII.469",
    commentary: `A briefer cross-reference, per spec Part 8: the Idylls' final line has a lighter resonance with Milton's closing of Paradise Lost (Book XII, last two lines): *The world was all before them, where to choose / Their place of rest, and Providence their guide.*

Both are epic closings that face forward into unknown futures. Milton's Adam and Eve, expelled from Paradise, walk forward into the world with *Providence their guide*; Tennyson's new sun rises bringing the new year, after Arthur's vanishing. Both closings give up the completed-epic-action in favor of what is *coming next*. Both use simple, unmomentous language — *world before them*, *new sun*, *new year* — to enormous cumulative effect.

The difference is perspective. Milton closes with his protagonists — Adam and Eve walking out of Paradise; the closing is their point of view. Tennyson closes with the witness — Bedivere on the shore; the closing is what remains after Arthur has gone. Milton's closing is prospective (characters moving forward into life); Tennyson's closing is retrospective-turning-into-prospective (the witness watching the departure, then the new sun rising for him too).

Both closings also share the Victorian-Christian frame of *Providence* / *new year*. Milton's Providence explicitly; Tennyson's new year implicitly. The rising sun is a Christian commonplace of resurrection and renewal, placed at the end of an epic that has spent twelve books showing a world breaking. The commonplace is made resonant by what has preceded it. This is the closing's structural move: spend 12,000 lines on failure; end in five words of renewal.

The cross-reference is lighter than the Aeneid one because the resonance is of a different kind. The Aeneid's closing is Tennyson's deliberate structural opposite; Milton's closing is Tennyson's deliberate kindred closing. Both belong in the cycle's cross-reference cluster for the closing passage.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Milton's Paradise Lost closes (Book XII, lines 646–649) with Adam and Eve leaving Paradise: \"The world was all before them, where to choose / Their place of rest, and Providence their guide. / They hand in hand with wandering steps and slow / Through Eden took their solitary way.\" Tennyson's closing inherits Milton's pattern: simple closing language facing forward after the completed epic action. Both closings use Providence/renewal against the prior weight of loss.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book XII, lines 646–649 (closing)",
        targetBookId: "paradise-lost",
        targetChapterNumber: 11,
        targetAnchorText: "The world was all before them",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 8. Modred and the traitor ──────────────────────────────────
  {
    id: "iotk-poa-modred",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "Modred",
    anchorOccurrence: 1,
    title: "Modred the traitor — the cycle's final antagonist",
    quotedPassage:
      "\"…Modred, unharmed, / The traitor of his house, / Has tainted the pure line of great King Arthur, / Has seduced Queen Guinevere, (so some say,) / Has turned the knights against their King.\"",
    passageReference: "Passing of Arthur, lines 42–70 (approx.) · IotK XII.42–70",
    commentary: `Modred — Arthur's illegitimate son by his half-sister (Malory specifies Morgause, Bellicent's sister; Tennyson elides the genealogy), now a nephew/son-figure whose treason unmakes the realm — is the cycle's most purely villainous character. The palette flags him as *cold iron and venom-green — colorless-malevolent*, and the idyll confirms the flattening.

Modred has existed in the Idylls' background throughout the cycle — glimpsed in Vivien's insinuations, mentioned by name in late idylls — but the closing idyll is where he becomes the active antagonist. His role is specific: he has seduced away the court's loyalty while Arthur was west; he has (in some accounts) seduced Guinevere; he now meets Arthur in the last battle.

Three things to notice about Tennyson's handling of Modred:

1. **The genealogical ambiguity is deliberate.** Malory specifies that Modred is Arthur's son by his half-sister Morgause — an incestuous conception at the beginning of Arthur's reign that returns to unmake it at the end. Tennyson elides most of this. Modred is *the traitor of his house* — the house's traitor, with the exact genealogical relation left vague. Tennyson is performing the same Victorian-moral cleanup on Modred's origin as he did earlier on Arthur's (making Arthur's parentage mystic rather than adulterous). The incestuous origin of the final traitor would have been too much for the Dedication's moral frame to contain.

2. **Modred is not given interior life.** Unlike Guinevere, Lancelot, Merlin, or even Vivien, Modred is not psychologized. He is a villain in the flat moral sense — his motives are opacity; his actions are corrupt; the cycle does not try to understand him. This is one of Tennyson's most purely didactic moves, and one of the cycle's weakest character-handlings. The flattening is less egregious than Vivien's (where the critical consensus has been strongest), but Modred is more schematic than the cycle's better antagonists.

3. **Modred's rumored seduction of Guinevere is held at a distance.** The parenthetical *(so some say,)* is important. Tennyson leaves uncertain whether Guinevere has been seduced away from Arthur by Modred or whether this is mere rumor. In Malory, Modred's attempt to seize Guinevere is direct and attempted. Tennyson keeps the rumor available (for the plot) without confirming it (for the moral). The Guinevere idyll's psychological treatment has required a Guinevere whose only adultery was with Lancelot; Modred must not be given a second adultery.

Modred's death in the mist is the moment of the cycle's final violence. The mist obscures the killing; Arthur is *confused*; the blow is struck without being clearly seen. Tennyson is keeping even the final moment of the cycle's action visually uncertain. What the reader knows is only that the kingdom's last enemy is dead and that Arthur is mortally wounded. The cycle's closing violence is morally necessary but narratively obscured.`,
    crossReferences: [],
    tags: ["literary-influence", "historical", "mythological"],
  },

  // ── 9. The three queens on the barge ────────────────────────────
  {
    id: "iotk-poa-three-queens",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "three Queens",
    anchorOccurrence: 1,
    title: "The three Queens — water-pearl and silver",
    quotedPassage:
      "\"Then saw they how there hove a dusky barge, / Dark as a funeral scarf from stem to stern, / Beneath them; and descending they were ware / That all the decks were dense with stately forms / Black-stoled, black-hooded, like a dream—by these / Three Queens with crowns of gold—and from them rose / A cry that shivered to the tingling stars, / And, as it were one voice, an agony / Of lamentation, like a wind, that shrills / All night in a waste land, where no one comes, / Or hath come, since the making of the world.\"",
    passageReference: "Passing of Arthur, lines 360–385 (approx.) · IotK XII.360–85",
    commentary: `The Three Queens on the Avalon barge — Tennyson's most numinous image, and one of his most deliberate mythographic choices.

Malory names the Three Queens: Morgan le Fay (Arthur's half-sister and frequent adversary), the Queen of Northgalis, and the Queen of the Wastelands. Each is a specific figure with a specific history in Malory's text. Tennyson leaves them *unnamed*. They are simply *three Queens with crowns of gold*, in black stoles and hoods, who raise a cry *like a wind, that shrills / All night in a waste land*. The anonymity is the point.

Why? Three reasons:

1. **Universalizing the mythic.** Tennyson is moving the passing of Arthur out of Malory's specific Arthurian mythography into a more general elegiac register. The three unnamed Queens become the numinous feminine at the world's end — any mourning women, all mourning women, the archetype rather than the instance. This lifts the closing into a mythic space larger than any specific Arthurian tradition.

2. **Compatibility with religious ambiguity.** Specific names (Morgan le Fay) would have pulled the passage into explicit pagan-magical Arthurianism — Morgan as the fey, the witch, the enchantress. Anonymous Queens permit a more universal-symbolic reading: the weeping women at a great man's death belong to many traditions (the Marys at the crucifixion, the lamenting women of classical elegy, the female mourners of many cultures). Tennyson's anonymity opens the passage to multiple registers.

3. **The palette precision.** The spec flags this passage's palette as *water-pearl and silver — the numinous-feminine that surrounds Arthur's beginning and end*. The Queens' blackness, the barge's funeral darkness, are literal; but what the reader registers is the pallor of the composed scene, the silver cry, the pearl-like tones of the mourning. Tennyson uses dark-register surfaces (black-stole, black-hood) against a silver-pearl tonal ground, and the effect is numinous rather than simply gloomy.

The Queens' cry — *like a wind, that shrills / All night in a waste land, where no one comes, / Or hath come, since the making of the world* — is another of the idyll's signature sonic passages. The image places the cry at the earth's beginning, at the unmade-original-wasteland that predates civilization. Arthur's death is therefore not only the end of his kingdom; it is the sound of the earth's original mourning, from the making of the world.

Note also the echo to the Coming of Arthur: Bellicent's account of the mythic birth has the infant Arthur borne on a wave *from the great deep*, received by Merlin on the shore. The barge-arrival and barge-departure are symmetric. The numinous feminine (Merlin is absent now; the Queens replace him as the receiving figures) completes the circle at the end that the mystic birth opened.`,
    crossReferences: [],
    tags: ["mythological", "literary-influence"],
  },

  // ── 10. The cycle's closing argument ────────────────────────────
  {
    id: "iotk-poa-cycle-argument",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "once more",
    anchorOccurrence: 2,
    title: "The cycle's closing argument — civilization as cycle, not completion",
    quotedPassage:
      "(Idyll-level reading note on the cycle's closing argument)",
    passageReference: "Passing of Arthur (whole idyll as close)",
    commentary: `An idyll-level annotation stepping back to name what the whole cycle has, in closing, argued.

Reading the Idylls from Dedication through "To the Queen," what is the cumulative position? The annotations across the clusters have identified specific moves, but the closing idyll is where the cycle's argument becomes visible as a whole. Three summary claims:

1. **Civilization is cyclical, not linear.** The cycle does not argue that Arthur's kingdom *failed* in a final sense; it argues that Arthur's kingdom *ended*, as all orders end, yielding place to the new. The doubled "old order changeth" — at the beginning as triumph, at the end as elegy — is the cycle's philosophical signature. Victorian England, reading the cycle, was invited to see itself as one of many orders, not as history's final destination. This is Tennyson's mature historical vision, distinct from the more triumphal Victorian narratives of permanent progress.

2. **Moral order depends on human fragility that breaks it.** The cycle's stated frame (Arthur as ideal, Guinevere as the flesh that unmakes him) is not the whole of what the cycle says. What the cycle actually shows — across the Lancelot-and-Elaine soliloquy, the Grail idyll's ambivalence, Guinevere's interior monologue — is that the ideal itself depends on human conditions that make its achievement tragic. Ideals are not impossible; they are costly. The cycle is not a naïve celebration of virtue or a cynical rejection of it; it is a meditation on the price virtue exacts.

3. **Faith survives doubt without resolving it.** Particularly in the Grail idyll and the closing "great deep" formulation, the cycle holds faith open without specifying its content. This is a post-1850 Victorian religious position — the "In Memoriam" position, the faith-of-honest-doubt. Tennyson's closing refuses both the pious reading ("Arthur goes to heaven") and the secular reading ("Arthur is dead"). He offers instead the vanishing-into-light, the great deep to the great deep, the new sun. Meaning is preserved; content is suspended.

These three claims are the cycle's argument. They are not the Dedication's stated moral reading. The stated reading (Arthur = soul, Guinevere = flesh, etc.) is *part* of what the cycle argues — Tennyson believed it — but the cycle's practice exceeds its stated frame in exactly the three directions named above.

For a modern reader finishing the cycle: what has been earned? A layered vision of civilization-in-history, a psychological-realist treatment of moral failure, a theological register adequate to doubt without surrendering to it. The cycle is not the naïve Victorian-medievalism it is sometimes dismissed as. It is a serious, complicated, in places uncomfortable, in places beautiful piece of thinking about how civilizations rise and fall and about the cost of the ideals they depend on.

Read back through the cycle with this closing in mind, and you will find the earlier idylls anticipating the closing's argument. Merlin and Vivien (the sage silenced by rumor); Pelleas and Ettarre (youthful ideal meeting corrupt reality); the Holy Grail (faith in an age of doubt); Guinevere (the ideal and its human cost). Each idyll is a chapter in the larger argument the closing names. *The old order changeth.* The cycle is about what that means, and what it costs, and what survives.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence", "historical"],
  },

  // ── 11. The 1833 Morte d'Arthur ─────────────────────────────────
  {
    id: "iotk-poa-1833-morte",
    bookId: "idylls-of-the-king",
    chapterNumber: 12,
    anchorText: "shatter'd column",
    anchorOccurrence: 1,
    title: "The 1833 \"Morte d'Arthur\" — Tennyson's 52-year writing arc",
    quotedPassage:
      "\"So like a shatter'd column lay the King; / Not like that Arthur who, with lance in rest, / From spur to plume a star of tournament, / Shot thro' the lists at Camelot, and charged / Before the eyes of ladies and of kings.\"",
    passageReference: "Passing of Arthur, lines 235–245 (approx.) · IotK XII.235–45 (1833 material)",
    commentary: `This passage is from the 1833 "Morte d'Arthur" — Tennyson's first Arthurian poem, written when he was 24, published in the 1842 Moxon volume that made him nationally famous. In 1869, when he built "The Passing of Arthur" to close the cycle, he incorporated the 1833 poem nearly unchanged. These lines are from the older material.

Read the lines. The wounded King, *a shatter'd column*, is placed in contrast to his younger self — the Arthur who *shot thro' the lists at Camelot, and charged / Before the eyes of ladies and of kings*. The passage is the 24-year-old Tennyson imagining what it would look like to see the world-famous hero reduced to broken marble.

What does it mean that this passage survives into the 1869 cycle?

1. **Tennyson's 52-year identification with the scene.** The poet spent more than half a century writing about Arthur's death. When he was 24, he wrote this image — the shattered column, the contrast between active youth and ruined age — because it was what the death of a great figure looked like to him. When he was 60 and building the cycle, he did not revise it. The image still held. One of the Idylls' most striking compositional facts is that Tennyson, aging, preserved the work of his younger self.

2. **The 1833 register is more sensuously direct.** Reading the 1833 passages alongside the 1869 framings (annotation 1), the reader can feel the tonal difference. The 1833 Tennyson writes more closely to the image — *a star of tournament*, *shot thro' the lists*, *the eyes of ladies and of kings*. The language is young, emphatic, vividly visual. The 1869 framing, by contrast, is more distanced, historical, philosophical. The cycle holds both voices.

3. **The image itself is archaeological.** *A shatter'd column* is a ruin-image, drawn from the Romantic-era fascination with classical ruins (the broken columns of Greece and Rome, inspiring Byron's Childe Harold, Shelley's Ozymandias, Keats's Grecian Urn). Tennyson is placing Arthur in that iconography — Arthur's body as an antique ruin, the last survival of a civilization. The figure makes the king-as-civilization equation visible at the level of the body itself.

For a reader wanting to understand Tennyson's compositional development, read the 1833 "Morte d'Arthur" separately (it is available as an independent poem), and then read it embedded in the cycle here. The two readings are different. As a standalone, the 1833 poem is a self-contained elegy. As incorporated in the cycle, it is the closing of a fifty-year working-out. The incorporation is among the most deliberate acts of poetic self-editing in Victorian literature.

A note on the compositional method. Tennyson's letters and Hallam Tennyson's Memoir confirm the incorporation: the 1833 poem was, with minor revisions, taken into the 1869 "Passing of Arthur." Tennyson was not cannibalizing himself; he was completing a frame he had begun half a century earlier. The poet in 1833 wrote the center; the poet in 1869 wrote the edges.

*The old order changeth.* The cycle closes on the same line it opened with — but the closing also closes on lines Tennyson wrote in his youth, preserved into his age. The poem's architecture is the poet's own life-arc, and the life-arc is the poem's structure.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Tennyson's 1833 \"Morte d'Arthur\" (published 1842 in the Moxon volume, not in catalog) is Tennyson's first Arthurian poem and the compositional core of \"The Passing of Arthur.\" The older poem is incorporated nearly verbatim; the 1869 cycle builds its closing idyll around it. The poet spent fifty-two years writing toward his own earliest vision.",
        workTitle: "Morte d'Arthur (1833)",
        workAuthor: "Alfred, Lord Tennyson",
        passageReference: "1833, published in Poems (1842), Moxon volume",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence", "linguistic"],
  },
]
