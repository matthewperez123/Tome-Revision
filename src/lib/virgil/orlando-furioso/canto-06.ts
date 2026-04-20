import type { Annotation } from "../types"

// ── Orlando Furioso Canto VI — Opus-authored annotations ──────────────
// The demo-critical Alcina sequence opens here. Ruggiero arrives on the
// hippogriff at the sorceress's island; the myrtle that was once the
// English paladin Astolfo warns him from a tree. The full set-piece
// closes in Canto VII with Alcina's revealed ugliness (VII.73).
//
// Density: 6 annotations. Per spec Part 4, Cantos VI–VIII are one of
// the demo-critical Opus clusters.

export const ORLANDO_FURIOSO_CANTO_6: Annotation[] = [
  // ── 1. Alcina's island — the Circe/Calypso/Dido inheritance ──
  {
    id: "of-6-alcina-island",
    bookId: "orlando-furioso",
    chapterNumber: 6,
    anchorText: "Puissant Alcina owned the house and land",
    anchorOccurrence: 1,
    title: "Alcina — the Circe/Calypso/Dido tradition compressed into one sorceress",
    quotedPassage:
      "Puissant Alcina owned the house and land.",
    passageReference: "Canto VI · OF VI.42",
    commentary: `Alcina is the poem's first major allegorical set-piece, and in her Ariosto collapses three foundational classical figures into a single sorceress. From Homer's Circe she takes the transformation of lovers into beasts and plants (the myrtle Ruggiero is about to encounter is an earlier paladin turned into a tree). From Calypso she takes the seductive island that detains the hero from his proper destiny. From Virgil's Dido she takes the civilized queen whose court becomes a snare for a dynastic founder who must be torn away.

The allegorical register is moral rather than theological. Alcina is concupiscence — desire pursued for its own sake, which eventually reveals itself as ancient, ugly, and unloved. Her sister Logistilla (introduced in Canto X) is the counter-figure: reason, the realm to which Ruggiero must escape. The three sisters — Alcina, Morgana, and Logistilla — are Ariosto's allegorical division of the soul's erotic and rational faculties.

The whole sequence is Ariosto's most sustained imitation of classical-epic sorcery. Spenser took it up for the Bower of Bliss (*Faerie Queene* II.xii); Milton remembers it for the Circe of *Comus* and for the deceptive paradise of Eden as a place where desire turns ambiguous. Annotation tracks the chain at VII.73 where the revelation of Alcina's true face becomes the direct source for Spenser's Duessa.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Circe in Odyssey X is the deepest source: the sorceress who transforms lovers into animals. Ariosto's myrtle-transformed Astolfo is the direct Circean figure in Orlando Furioso.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book X, Circe episode",
        targetBookId: "the-odyssey",
        targetChapterNumber: 10,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Virgil's Dido in Aeneid I and IV is the other direct ancestor — the civilized queen whose court detains the hero from his dynastic mission. Ariosto grafts Dido's psychological sophistication onto Circe's magical framework.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV (Dido)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 2. The myrtle that was Astolfo ──
  {
    id: "of-6-astolfo-myrtle",
    bookId: "orlando-furioso",
    chapterNumber: 6,
    anchorText: "A peer of France, Astolpho was my name",
    anchorOccurrence: 1,
    title: "Astolfo as myrtle — the allegorical warning, lifted from Virgil",
    quotedPassage:
      "A peer of France, Astolpho was my name.",
    passageReference: "Canto VI · OF VI.33–53",
    commentary: `Astolfo, the English paladin, is introduced as a tree — a myrtle on Alcina's shore, speaking through the bark to warn Ruggiero not to trust the sorceress. The device is borrowed directly from Aeneid III, where Polydorus speaks from the bleeding myrtle-shoots growing over his murdered body. Ariosto takes Virgil's brief, horrifying scene and converts it to romance: the transformed shrub is not a murdered prince but a seduced knight, and the warning is not about sacrilege but about erotic entrapment.

This first appearance of Astolfo is crucial structural setup. He will be rescued from the tree by Melissa and the ring in Canto VIII, receive the hippogriff and the magic horn in XV, destroy Atlante's palace of illusion in XXII, cure Prester John's blindness in XXXIII, and in XXXIV–XXXV ascend to the moon to recover Orlando's wits. The paladin who gets turned into a tree in Canto VI is the same one who rides to the moon thirty cantos later; Ariosto is quietly establishing the most tonally distinctive figure in his cast.

The myrtle-warning is also the poem's first moment of explicit allegorical signaling. Before this, the reader has been in romance's pleasure-mode. Here Ariosto briefly breaks the narrative spell to say: what you are about to read is not just adventure; it means something. He will not do this often — most of the poem is narrative pleasure that happens to be allegorically suggestive — but he does it here, at the hinge where Ruggiero enters Alcina's island.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Aeneid III.22–68: Aeneas lands on the Thracian shore and pulls up myrtle shoots whose roots drip blood; the murdered Polydorus speaks from beneath them. Ariosto reuses the device with a romance inflection — no blood, no murder, just the voice of the transformed lover warning the next arrival.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book III, lines 22–68 (Polydorus and the myrtle)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 3. The canto's proem on secret sin ──
  {
    id: "of-6-proem-secret-sin",
    bookId: "orlando-furioso",
    chapterNumber: 6,
    anchorText: "Wretched that evil man who lives in trust",
    anchorOccurrence: 1,
    title: "The proem — on hidden wrongdoing that betrays itself",
    quotedPassage:
      "Wretched that evil man who lives in trust / His secret sin is safe in his possession! / Since, if nought else, the air, the very dust / In which the crime is buried, makes confession",
    passageReference: "Canto VI, stanza 1 · OF VI.1",
    commentary: `Ariosto opens Canto VI with a three-stanza proem on moral concealment — the idea that hidden wrongdoing eventually betrays itself through some surfacing trace. The stanzas are tonally stern and classical; then, characteristically, the narrator drops the moral register and returns to the narrative in progress (Polinesso's plotting from Canto V, which will resolve under this proem's logic).

This is one of Ariosto's most systematically classical proems. The idea that *conscia virtus* and buried guilt inevitably surface has its roots in Horace, Seneca, and the medieval penitential tradition. Ariosto is marking the Polinesso plot as a moral case rather than a romance puzzle, then moving on.

It is also a deliberate tonal counterweight to what the canto will become. Canto VI's second half is Alcina's seduction — pleasure at its most luxurious. Opening on the Horatian sterner register and then descending into sorceress-island paradise is the canto's deliberate whiplash. Ariosto's canto-openings often function this way: a framing key, then the poem moves elsewhere.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 4. Ruggiero on the hippogriff — the classical-epic tradition of marvel-beasts ──
  {
    id: "of-6-hippogriff",
    bookId: "orlando-furioso",
    chapterNumber: 6,
    anchorText: "Through the whole air, Rogero had not found",
    anchorOccurrence: 1,
    title: "The hippogriff — Ariosto's invention, and what it's for",
    quotedPassage:
      "Through the whole air, Rogero had not found.",
    passageReference: "Canto VI · OF VI.17",
    commentary: `The hippogriff — half-eagle, half-horse — is Ariosto's original contribution to romance-epic bestiary, not an inherited figure. Virgil mentions *jungentur iam grypes equis* ("griffins will be yoked with horses") as a proverbial impossibility in Eclogue VIII; Ariosto takes the proverb literally and names the offspring. The beast enters the poem in Canto IV when Atlante uses it to carry Ruggiero away from Bradamante's reach.

Functionally, the hippogriff is Ariosto's solution to a structural problem. Romance needs the ability to get characters across oceans quickly — to move them from Pyrenees France to Chinese Cathay to African Biserta to the moon — without slowing the narrative to real-world travel times. Homer used the wind; Virgil used the gods; Boiardo used magical horses on the ground. Ariosto invents aerial travel. The hippogriff becomes the poem's pacing device: it arrives whenever Ariosto needs a character relocated at narrative speed.

Astolfo will receive the hippogriff in Canto IV (taking it from Atlante's abandoned estate) and will ride it to every corner of the world and eventually to the moon. It is not subtle symbolism — the English paladin gets the airborne marvel-beast, the one piece of the romance bestiary that has no classical precedent. Ariosto is quietly marking Astolfo as the character for whom the usual romance physics does not apply.`,
    crossReferences: [],
    tags: ["literary-influence", "mythological"],
  },

  // ── 5. Alcina's shore — the locus amoenus tradition ──
  {
    id: "of-6-locus-amoenus",
    bookId: "orlando-furioso",
    chapterNumber: 6,
    anchorText: "Myrtle and palm, with interwoven spray",
    anchorOccurrence: 1,
    title: "The locus amoenus — Alcina's island as classical pleasure-landscape",
    quotedPassage:
      "Myrtle and palm, with interwoven spray.",
    passageReference: "Canto VI · OF VI.20–22",
    commentary: `The description of Alcina's shore — myrtle and palm, singing birds, flowers, soft grass, gentle water — is a classical *locus amoenus* ("pleasant place"), the Latin rhetorical topos for an idealized natural setting. Homer's Calypso's cave (Odyssey V), Virgil's Elysium (Aeneid VI), Ovid's various nymph-haunts, and the medieval Roman de la Rose tradition are all behind this passage. Ariosto is assembling every available component: the vocabulary is entirely conventional and the reader is meant to recognize it as such.

The convention's function is ambiguous by design. A locus amoenus can be the setting for legitimate pastoral pleasure or for seductive danger; Ariosto's readers, knowing the landscape, know they should not yet decide which this is. The myrtle that will shortly speak resolves the ambiguity toward danger — but only after several stanzas of genuine natural beauty that is not cancelled out by the revelation. Ariosto's poem keeps this double register: the pleasures are real AND the dangers are real, and neither negates the other.

The same double register runs through the entire Alcina sequence, the Logistilla counter-sequence, and ultimately the moon cantos. Ariosto does not moralize his pleasures into admission-only-on-conviction zones; he lets them stand as pleasures that happen to have consequences.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Calypso's cave in Odyssey V is the foundational locus amoenus of European epic. Homer describes the trees, the four fountains, the meadow of violets — every later locus amoenus is in dialogue with that passage, and Ariosto's Alcina-shore is no exception.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book V (Calypso's cave)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 6. Logistilla introduced ──
  {
    id: "of-6-logistilla",
    bookId: "orlando-furioso",
    chapterNumber: 6,
    anchorText: "Would Logistilla (such her name) command",
    anchorOccurrence: 1,
    title: "Logistilla — reason as the poem's counter-sorceress",
    quotedPassage:
      "Would Logistilla (such her name) command.",
    passageReference: "Canto VI · OF VI.43",
    commentary: `Logistilla is introduced here only by name, through Astolfo's bark-speech; she will not appear in person until Canto X, after Ruggiero has escaped Alcina. Ariosto's allegorical scheme has three sisters — Alcina (concupiscence), Morgana (avarice or worldly ambition, mentioned but less developed), and Logistilla (reason / wisdom). Alcina and Morgana are illegitimate children of their father; Logistilla is the only legitimate sister, and the island rightfully belongs to her.

The name *Logistilla* is Ariosto's Italianization of Greek *logismós* — rational calculation, judgment. The medieval Italian habit of Grecianizing allegorical names (Ariosto also Italianizes Circe → nothing, but keeps the figure; Alcina herself may be from *halkyon*, the kingfisher-goddess) makes Logistilla's etymology programmatic. She is not "Reason" in the cold Enlightenment sense; she is the kind of rational judgment that is itself a form of beauty and takes pleasure in its own right exercise.

Her realm, described in Canto X, is not austere. It is a different kind of pleasure-landscape — one that confers lasting benefit rather than enchanted intoxication. Ariosto's allegorical point is that reason and pleasure are not opposed but that unreasoning pleasure is a counterfeit of the real thing. This is a deeply humanist Renaissance argument — closer to Ficino than to the medieval ascetic tradition — and it is what separates Orlando Furioso from the more monitory romance tradition it inherits.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
]
