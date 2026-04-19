// ── Virgil Annotation Library ──
// Hand-written scholarly annotations for The Odyssey and The Divine Comedy.
// Odyssey quotes are from William Cullen Bryant's 1871 blank-verse
// translation (the same edition used for the Iliad in this library, so
// character colors and Bryant name-conventions align across both epics).
// The earlier Butler-prose anchors were migrated via
// scripts/odyssey/anchor-migration.json — see that file for the old→new
// mapping. Commedia quotes are from Longfellow's 1867 verse translation
// (imported from `./commedia-annotations` to keep the per-work lists
// reviewable). When the real backend ships, this file becomes a thin
// wrapper around a Supabase query.

import type { Annotation } from "./types"
import { COMMEDIA_ANNOTATIONS } from "./commedia-annotations"
import { GENERATED_ODYSSEY_ANNOTATIONS } from "./odyssey-annotations"
import { GENERATED_AENEID_ANNOTATIONS } from "./aeneid-annotations"
import { GENERATED_PARADISE_LOST_ANNOTATIONS } from "./paradise-lost-annotations"
import { GENERATED_DON_JUAN_ANNOTATIONS } from "./don-juan-annotations"
import { GENERATED_ORLANDO_FURIOSO_ANNOTATIONS } from "./orlando-furioso-annotations"
import { GENERATED_FAERIE_QUEENE_ANNOTATIONS } from "./faerie-queene-annotations"
import { GENERATED_BEOWULF_ANNOTATIONS } from "./beowulf-annotations"
import { GENERATED_IDYLLS_OF_THE_KING_ANNOTATIONS } from "./idylls-of-the-king-annotations"
import { GENERATED_CANTERBURY_TALES_ANNOTATIONS } from "./canterbury-tales-annotations"
import { DECAMERON_ANNOTATIONS } from "./decameron-annotations"
import { GENERATED_LE_MORTE_DARTHUR_ANNOTATIONS } from "./le-morte-darthur-annotations"

const CORE_ANNOTATIONS: Annotation[] = [

  // ═══════════════════════════════════════════════
  // THE ODYSSEY — BOOK I
  // ═══════════════════════════════════════════════

  {
    id: "odyssey-1-invocation",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "Tell me, O Muse, of that sagacious man",
    anchorOccurrence: 1,
    title: "The Invocation",
    quotedPassage: "Tell me, O Muse, of that sagacious man / Who, having overthrown the sacred town / Of Ilium, wandered far and visited / The capitals of many nations, learned / The customs of their dwellers, and endured / Great suffering on the deep.",
    passageReference: "Book I, lines 1–6 (Bryant)",
    commentary: `The word Bryant translates as "sagacious" is *polytropos* in the Greek — literally "of many turns." It is the first thing Homer tells us about Odysseus, before his name, before Troy, before anything. That is a choice.

Some translators render *polytropos* as "much-wandering," making it about the journey. Others choose "many-minded" or "of many devices," making it about character. Butler reached for "ingenious"; Bryant, writing blank verse, goes with "sagacious." Homer, I think, means more than any one word — the turns of the road and the turns of the mind are the same thing in this poem.

Compare this to the Iliad's opening: "Sing, O goddess, the anger of Achilles." Achilles is defined by one emotion. Odysseus is defined by multiplicity. What does that tell you about what kind of hero Homer is building here?`,
    crossReferences: [
      {
        type: "echo",
        description: "Virgil opens the Aeneid with a deliberate echo: 'Arms and the man I sing.' Where Homer invokes multiplicity, Virgil invokes duty. The contrast defines two civilizations.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, line 1",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  {
    id: "odyssey-1-xenia-athena",
    bookId: "the-odyssey",
    chapterNumber: 1,
    anchorText: "Telemachus the godlike was the first",
    anchorOccurrence: 1,
    title: "Proper Xenia",
    quotedPassage: "Telemachus the godlike was the first / To see the goddess as he sat among / The crowd of suitors, sad at heart, and thought / Of his illustrious father.",
    passageReference: "Book I, lines ~140–145 (Bryant)",
    commentary: `Telemachus receives Athena (disguised as Mentes) with impeccable *xenia* — the sacred Greek code of hospitality. He rises, takes her hand, seats her at the best chair, offers food before asking her name. This is exactly how a guest should be treated in Homer's world.

Hold this scene in mind when you reach Book IX. Polyphemus will do the precise opposite: he asks Odysseus's name before offering food, then eats his guests. Homer is not being subtle. The Cyclops episode is a systematic inversion of every rule of hospitality that Telemachus demonstrates here.

The suitors, too, are violating *xenia* — they are guests who have overstayed, consuming the host's wealth. They sit between Telemachus's proper hospitality and the Cyclops's monstrous perversion of it. Where on that spectrum would you place them?`,
    crossReferences: [
      {
        type: "compare",
        description: "The Cyclops cave scene in Book IX systematically inverts every element of the hospitality Telemachus shows here — a deliberate structural contrast.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: "My men begged me",
      },
    ],
    tags: ["historical", "mythological"],
  },

  // ═══════════════════════════════════════════════
  // THE ODYSSEY — BOOK IX (The Cyclops Episode)
  // ═══════════════════════════════════════════════

  {
    id: "odyssey-9-cave-entry",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "Begged me with many pressing words to take",
    anchorOccurrence: 1,
    title: "The Fatal Curiosity",
    quotedPassage: "My companions then / Begged me with many pressing words to take / Part of the cheeses, and, returning, drive / The kids and lambs on board, and sail away. / I yielded not — 'twere better had I yielded — / But wished to see the owner of the cave.",
    passageReference: "Book IX, lines ~250–258 (Bryant)",
    commentary: `Odysseus's men have the right instinct — take what you can and leave before the owner returns. It is the practical move, the safe move. But Odysseus cannot help himself. He wants to know.

This is the same curiosity that defines him throughout the poem — the same impulse that will make him listen to the Sirens, the same need to understand that makes him *polytropos*, "much-turning." But here it will cost him six men, eaten alive.

Homer is remarkably honest about his hero. The quality that makes Odysseus extraordinary — his relentless need to know — is also the quality that gets people killed. Notice, too, that Odysseus is narrating this to the Phaeacians. He knows how the story ends. He knows his curiosity cost lives. And he tells it without softening it.

Is this a flaw, or is Homer saying that curiosity always has a price?`,
    crossReferences: [
      {
        type: "echo",
        description: "In Aeneid Book III, Aeneas encounters the same Polyphemus — but from the outside, warned by one of Odysseus's abandoned men. Virgil rewrites the scene as a lesson learned from Homer's hero's mistake.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book III, lines 588–691",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "odyssey-9-guest-gift",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "And Noman am I called by all my friends",
    anchorOccurrence: 1,
    title: "The Perversion of Xenia",
    quotedPassage: "And Noman am I called by all my friends. ... Noman will I eat / Last of them all; the rest shall be devoured / Before him. This shall be thy stranger's gift.",
    passageReference: "Book IX, lines ~428–444 (Bryant)",
    commentary: `This is Homer's darkest joke. The Cyclops promises Odysseus a "guest-gift" — *xeinion* in Greek, the sacred offering a host gives a guest. In proper *xenia*, this might be a golden cup, a cloak, a weapon. Polyphemus's gift is to be eaten last. Bryant renders Homer's *Outis* as "Noman" rather than Butler's "Nobody" — the pun on *mētis* (cunning) is the same either way, and the scholium below still holds.

The perversion runs deep. Throughout the Odyssey, hospitality is the moral compass. Telemachus receives Athena with perfect *xenia* in Book I. Menelaus and Nestor host Telemachus generously in Books III and IV. The Phaeacians shower Odysseus with gifts. Against all of these, Polyphemus stands as the anti-host — the creature who consumes his guests rather than feeding them.

Homer is doing something more than telling a monster story. He is defining civilization itself by what it is not. The Cyclopes have no laws, no assemblies, no agriculture. They are the negative image of Greek society. And the worst thing about them, worse than their size or strength, is that they do not honor guests.

What does it say about Homer's worldview that the worst sin is not violence but inhospitality?`,
    crossReferences: [
      {
        type: "compare",
        description: "Compare to the lavish hospitality of the Phaeacians in Books VI–VIII — Homer's ideal civilization, the mirror image of the Cyclopes.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books VI–VIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "mythological"],
  },

  {
    id: "odyssey-9-nobody-pun",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "Men know me. I will tell thee",
    anchorOccurrence: 1,
    title: "The Outis Pun",
    quotedPassage: "Thou hast inquired, O Cyclops, by what name / Men know me. I will tell thee ... My father and my mother gave it me, / And Noman am I called by all my friends.",
    passageReference: "Book IX, lines ~423–428 (Bryant)",
    commentary: `The Greek here is Οὖτις — *Outis* — meaning "no one." But Homer is playing a deeper game than simple wordplay. There is a near-homophone in Greek, μή τις (*mē tis*), which also means "no one" but uses a different negative particle. And μῆτις (*mētis*), with a long vowel, is the word for cunning intelligence — the very quality Odysseus is famous for. So when Odysseus says his name is Outis, he is also, in a sense, naming himself Mētis: cunning itself.

What I find haunting is that this is the high-water mark of his self-control. A few hundred lines later, sailing away, he cannot resist shouting his real name back at the blinded Cyclops. He gives back the identity he just hid — and Poseidon hears him, and the journey home stretches on for ten more years.

Does Homer admire the cunning, or is he warning us about what cunning costs when pride breaks its silence?`,
    crossReferences: [
      {
        type: "allusion",
        description: "James Joyce makes the Outis pun the structural joke of Ulysses Episode 12 (Cyclops), where the unnamed narrator is, literally, 'nobody' — and the antisemitic 'Citizen' is the modern Polyphemus.",
        workTitle: "Ulysses",
        workAuthor: "James Joyce",
        passageReference: "Episode 12 (Cyclops)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "source",
        description: "Dante places Ulysses in the eighth circle of Hell for this very episode — the 'false counsel' of his cunning. Read Inferno Canto XXVI as Dante's verdict on the moment we are reading now.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno, Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,   // flat canto index for Inferno XXVI
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  {
    id: "odyssey-9-blinding",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "To lift the stake, and with its point bore out",
    anchorOccurrence: 1,
    title: "The Blinding",
    quotedPassage: "I bade my comrades now decide by lot / Which of them all should dare, along with me, / To lift the stake, and with its point bore out / The Cyclops's eye.",
    passageReference: "Book IX, lines ~381–385 (Bryant)",
    commentary: `The blinding is simultaneously an act of survival, an act of cunning, and an act of sacrilege. Polyphemus is Poseidon's son, and Odysseus does not know that yet — or if he does, he does not care.

Notice "heaven inspired them." Even in this brutal act, Homer attributes the courage to the gods. The Greeks did not separate human will from divine influence the way we do. Odysseus is both agent and instrument — he acts, and the gods act through him.

The olive-wood stake is also symbolically loaded. The olive tree is Athena's gift to Athens, her sacred tree. Odysseus uses Athena's tree to defeat Poseidon's son. The divine politics are embedded in the very props of the scene. Homer's audience would have heard this resonance instantly.

Does the violence here trouble you, or does it feel justified by what Polyphemus has done?`,
    crossReferences: [
      {
        type: "source",
        description: "Dante's Ulysses does not mention the blinding — he skips to the hubris of the journey beyond. The omission is telling. Dante is not interested in Odysseus the survivor. He condemns Odysseus the seeker.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno, Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,   // flat canto index for Inferno XXVI
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  {
    id: "odyssey-9-hubris",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "Ulysses, the destroyer of walled towns",
    anchorOccurrence: 1,
    title: "The Name Revealed",
    quotedPassage: "Cyclops, if any of the sons of men / Ask how thy eye was put out, tell them thus: / Ulysses, the destroyer of walled towns, / The son of old Laertes, whose abode / Is Ithaca, inflicted this on thee.",
    passageReference: "Book IX, lines ~592–597 (Bryant)",
    commentary: `Odysseus has won. He is on his ship, sailing away from the island. The Nobody trick worked perfectly. And then he ruins it — he shouts his real name across the water to a blinded, enraged son of Poseidon.

Why? Because being Nobody is intolerable to him. The anonymity that saved his life is worse, to Odysseus, than the danger of being known. He needs the Cyclops to know who defeated him. He needs the story to have his name in it.

This is the moment that triggers Poseidon's curse and extends the journey by years. Every storm, every shipwreck, every lost companion after this point traces back to these four lines. Homer is brutally clear: the hero's greatest strength — his intelligence — is inseparable from his greatest weakness — his pride.

Do you think Homer forgives him for this? Or is the rest of the poem the punishment?`,
    crossReferences: [
      {
        type: "source",
        description: "This is the moment Dante condemns. In Inferno XXVI, Ulysses burns in the flame of false counselors — not for the blinding, but for the cunning that led to it, and the pride that undid it.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno, Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,   // flat canto index for Inferno XXVI
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  {
    id: "odyssey-9-poseidon-prayer",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "Hear, dark-haired Neptune",
    anchorOccurrence: 1,
    title: "The Curse",
    quotedPassage: "Hear, dark-haired Neptune, who dost swathe the earth! / If I indeed am thine, and thou dost own / Thyself my father, grant that never more / Ulysses, the destroyer of walled towns, / Son of Laertes, dwelling in his home / At Ithaca, may reach his native shore.",
    passageReference: "Book IX, lines ~625–632 (Bryant)",
    commentary: `Polyphemus's prayer to Poseidon is the engine that drives the rest of the poem. Without this curse, Odysseus might have sailed home in weeks. With it, the journey stretches into years of suffering.

The prayer is remarkably specific — not "destroy him" but "may he never reach home." The curse is about *nostos*, the homecoming, which is the entire subject of the Odyssey. Polyphemus does not want Odysseus dead. He wants him wandering forever. The punishment fits the crime: Odysseus took the Cyclops's sight; the Cyclops tries to take Odysseus's destination.

And Poseidon grants it — not fully, but enough. Homer's gods do not override fate, but they can make the path harder. The entire middle third of the poem — Scylla, Charybdis, the Sirens, Calypso's island — is the consequence of this one prayer.

Compare this to the curses in Greek tragedy. How does Polyphemus's prayer differ from, say, the curse on the House of Atreus?`,
    crossReferences: [
      {
        type: "compare",
        description: "Greek tragedy is built on inherited curses — the House of Atreus, the line of Oedipus. Homer's curse is simpler and more personal: one father praying for revenge on one man.",
        workTitle: "Oedipus Rex",
        workAuthor: "Sophocles",
        passageReference: "The inherited curse of Laius",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },

  {
    id: "odyssey-9-rams",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "The rams were plump and beautiful",
    anchorOccurrence: 1,
    title: "The Escape Under the Rams",
    quotedPassage: "The rams were plump and beautiful, and large / With thick dark fleeces. These I silently / Bound, three together, with the pliant twigs / On which the lawless monster used to sleep. / The middle ram bore one of us; on each side / Walked his two fellows, sheltering thus my friend.",
    passageReference: "Book IX, lines ~497–505 (Bryant)",
    commentary: `This is *mētis* at its peak — cunning intelligence working with physical materials. Odysseus does not overpower the Cyclops, does not fight his way out, does not call on divine intervention. He uses the Cyclops's own rams, the Cyclops's own withies, the Cyclops's own blindness, to escape.

The detail of tying three rams together is practical brilliance. A single ram could not bear a man's weight. Three abreast, with the man underneath the middle one, can. Odysseus has been thinking about this — measuring, planning, even while his men were being eaten.

There is something almost procedural about the description. Homer lingers on the mechanics because the mechanics are the point. This is not a scene about bravery. It is a scene about engineering. Odysseus is, in a sense, the first hacker — someone who exploits the rules of a system rather than breaking them.

The escape-under-animals motif appears in folklore across many cultures. What does it suggest about the relationship between human intelligence and the animal world?`,
    crossReferences: [
      {
        type: "compare",
        description: "The motif of hiding beneath animals to escape danger appears in Norse mythology, in Grimm's fairy tales, and in the Hebrew Bible (Jacob disguising himself with goatskin). Homer may be drawing on a very old story pattern.",
        workTitle: "Folk and myth parallels",
        workAuthor: "Various",
        passageReference: "Cross-cultural motif",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical"],
  },

  {
    id: "odyssey-9-cyclops-primitive",
    bookId: "the-odyssey",
    chapterNumber: 9,
    anchorText: "Plant not, nor plough the fields",
    anchorOccurrence: 1,
    title: "The Un-Civilized",
    quotedPassage: "They plant not, nor plough the fields, but all things spring / For them untended — barley, wheat, and vines / Yielding large clusters filled with wine ... No councils and no judgments are with them. / On lofty mountains and in hollow caves / They dwell, and each one governs, unconcerned / About the rest, his children and his wife.",
    passageReference: "Book IX, lines ~133–150 (Bryant)",
    commentary: `Homer is doing anthropology here — not telling a monster story, but describing what a society without civilization looks like. The Cyclopes lack three things: law (*themis*), assembly (*agora*), and agriculture. They eat what grows wild, live in caves, and have no communal life.

This is not neutral description. Homer is defining the Greek polis by its negative image. Everything the Cyclopes lack — deliberation, shared governance, cultivated land, reciprocal obligation — is what makes a society human in Homer's view. The Cyclops is not a monster because he is large. He is a monster because he is *alone*.

Hesiod's *Works and Days* describes a golden age of primitive plenty, where humans lived without labor and in peace. Homer's Cyclopes have the plenty but none of the peace. The comparison suggests that abundance without justice is not paradise but barbarism.

Is Homer arguing that civilization requires constraint? That freedom without law produces monsters?`,
    crossReferences: [
      {
        type: "compare",
        description: "Hesiod's account of the five ages of humanity in Works and Days provides a different view of pre-civilized life — nostalgic rather than horrified.",
        workTitle: "Works and Days",
        workAuthor: "Hesiod",
        passageReference: "Lines 109–201",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },

  // ═══════════════════════════════════════════════
  // THE ODYSSEY — BOOK XXIII
  // ═══════════════════════════════════════════════

  {
    id: "odyssey-23-bed",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "Whether my bed remains as then it was",
    anchorOccurrence: 1,
    title: "The Great Rooted Bed",
    quotedPassage: "Now, O wife, I cannot know / Whether my bed remains as then it was, / Or whether someone from the root has hewn / The olive-trunk and moved the bed away.",
    passageReference: "Book XXIII, lines ~244–247 (Bryant)",
    commentary: `Penelope's test is extraordinary. She tells a servant to move the bed. Odysseus erupts — who could move it? He built it himself, around a living olive tree. The bed is rooted in the earth. It cannot be moved without destroying it.

The bed is the metaphor that holds the poem together. It is marriage — rooted, immovable, built around something living. It is Ithaca — the fixed point that gives the wandering its meaning. It is identity — the thing about Odysseus that cannot be faked or stolen.

And Penelope is the one who knows this. She matches his cunning with her own. She does not ask him to prove himself through strength or combat. She asks him to prove himself through intimacy — through the knowledge that only a husband would have.

Do you think this is the real homecoming — not the arrival at Ithaca, but this moment of mutual recognition?`,
    crossReferences: [
      {
        type: "compare",
        description: "The olive tree reappears as a symbol of rootedness and civilization throughout Greek literature. Athena's gift of the olive to Athens is the foundational myth of the city.",
        workTitle: "Greek mythological tradition",
        workAuthor: "Various",
        passageReference: "Athena's contest with Poseidon",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },

  {
    id: "odyssey-23-reunion",
    bookId: "the-odyssey",
    chapterNumber: 23,
    anchorText: "Was melted as she heard her lord recount",
    anchorOccurrence: 1,
    title: "The Reunion",
    quotedPassage: "He spake, and her knees faltered and her heart / Was melted as she heard her lord recount / The tokens all so truly; and she wept, / And ran to him, and flung her arms around / His neck, and kissed his forehead.",
    passageReference: "Book XXIII, lines ~248–253 (Bryant)",
    commentary: `Homer has spent twenty-three books building to this moment, and when it arrives, he gives it one sentence. No speeches. No dramatic declarations. Just a woman running to her husband and putting her arms around his neck.

After all the elaborate cunning, all the disguises and tricks and tests — the reunion is physical, immediate, and wordless. Homer seems to be saying: this is what all the cleverness was for. Not glory, not revenge, not the slaughter of the suitors. This.

The Iliad ends with a funeral. The Odyssey ends with an embrace. I think that says everything about the difference between the two poems.

Does this ending satisfy you? Or do you want more from it — more words, more explanation, more ceremony?`,
    crossReferences: [
      {
        type: "compare",
        description: "Compare to the reunion of Aeneas and Anchises in the underworld — Aeneid Book VI. Virgil's reunion is shadowed by prophecy and duty. Homer's is pure presence.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ═══════════════════════════════════════════════
  // THE DIVINE COMEDY — linking back to Odyssey
  // ═══════════════════════════════════════════════

  {
    id: "inferno-26-ulysses",
    bookId: "the-inferno",
    chapterNumber: 26,
    anchorText: "Within that flame Ulysses suffers",
    anchorOccurrence: 1,
    title: "Dante's Ulysses",
    quotedPassage: "Within that flame Ulysses suffers, with Diomede, the wrath of God for the ambush of the horse.",
    passageReference: "Inferno, Canto XXVI",
    commentary: `Dante places Odysseus — whom he calls Ulisse — in the eighth circle of Hell among the fraudulent counselors. The punishment is to burn inside a tongue-shaped flame, forever. The tongue that deceived now is the fire that consumes.

But Dante does something unexpected. He does not condemn Ulysses for the Cyclops trick or the Trojan Horse. He invents an entirely new sin: Ulysses, Dante says, did not return to Ithaca at all. Instead, he sailed past the Pillars of Hercules into the unknown Atlantic and was destroyed.

This is Dante's rewriting of Homer's hero. Homer's Odysseus chose home. Dante's cannot stop seeking. The curiosity that Homer treated with ambivalence, Dante condemns absolutely. The question that links the two poems across two thousand years: is the desire to know a virtue or a transgression?

Read the Cyclops episode in Book IX of the Odyssey and ask yourself which poet you agree with.`,
    crossReferences: [
      {
        type: "source",
        description: "Homer's Odyssey Book IX is the source text Dante is responding to. The Outis pun, the hubris of revealing his name — Dante condemns the intelligence that Homer celebrates.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: "My name is Nobody",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
]

// ── Exported functions ──

// Unified registry: Odyssey/Inferno-link core + Commedia seed set.
const ALL_ANNOTATIONS: Annotation[] = [
  ...CORE_ANNOTATIONS,
  ...COMMEDIA_ANNOTATIONS,
  ...GENERATED_ODYSSEY_ANNOTATIONS,
  ...GENERATED_AENEID_ANNOTATIONS,
  ...GENERATED_PARADISE_LOST_ANNOTATIONS,
  ...GENERATED_DON_JUAN_ANNOTATIONS,
  ...GENERATED_ORLANDO_FURIOSO_ANNOTATIONS,
  ...GENERATED_FAERIE_QUEENE_ANNOTATIONS,
  ...GENERATED_BEOWULF_ANNOTATIONS,
  ...GENERATED_IDYLLS_OF_THE_KING_ANNOTATIONS,
  ...GENERATED_CANTERBURY_TALES_ANNOTATIONS,
  ...DECAMERON_ANNOTATIONS,
  ...GENERATED_LE_MORTE_DARTHUR_ANNOTATIONS,
]

export function getAnnotationsForChapter(bookId: string, chapterNumber: number): Annotation[] {
  return ALL_ANNOTATIONS.filter(
    (a) => a.bookId === bookId && a.chapterNumber === chapterNumber
  )
}

export function getAnnotation(annotationId: string): Annotation | null {
  return ALL_ANNOTATIONS.find((a) => a.id === annotationId) ?? null
}

export function getAllAnnotations(): Annotation[] {
  return ALL_ANNOTATIONS
}
