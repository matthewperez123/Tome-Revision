import type { Annotation } from "../types"

// ── Orlando Furioso Canto VII — Opus-authored annotations ─────────────
// The sorceress's revelation — arguably the most-imitated single moment
// in the poem. Alcina's true, ancient, repulsive face is unveiled by
// Melissa's magic ring. The passage is the direct source for Spenser's
// Duessa (Faerie Queene I.viii) and the general Renaissance tradition
// of revealed-false-beauty.
//
// Density: 5 annotations. Opus cluster per spec Part 4.

export const ORLANDO_FURIOSO_CANTO_7: Annotation[] = [
  // ── 1. Alcina's first full appearance — Petrarchan portrait ──
  {
    id: "of-7-alcina-portrait",
    bookId: "orlando-furioso",
    chapterNumber: 7,
    anchorText: "To meet the Child, Alcina, fair of hue",
    anchorOccurrence: 1,
    title: "Alcina seen — the Petrarchan catalogue, deliberately perfect",
    quotedPassage:
      "To meet the Child, Alcina, fair of hue.",
    passageReference: "Canto VII · OF VII.11–16",
    commentary: `Ariosto spends six stanzas on Alcina's beauty, stanza by stanza: the golden hair, the rose-and-milk complexion, the ebony-arched brows, the eyes, the nose, the mouth, the teeth, the breast, the hands. The catalogue is the standard Petrarchan blazon — the style of amatory description that dominated Italian (and after Wyatt and Surrey, English) love-poetry from 1350 to roughly 1600. Every feature is conventionally perfect. Every metaphor is stock.

The perfection is the trap. Ariosto writes these stanzas as pure Petrarchan pastiche — so pure that readers steeped in the tradition feel the rhetorical excess as excess. Alcina is *too* beautiful, and too conventionally beautiful, in a way that real beauty cannot sustain. The stanzas are a literary performance that a character from outside Ariosto's fictional world (say, Ruggiero with the ring on) would see through immediately.

Ruggiero does not have the ring at this point. He sees exactly what Ariosto has described. The reader sees two things at once: the described beauty and the artifice of the description. The unveiling sixty stanzas later in VII.73 is not a surprise; it is the fulfilment of a rhetorical trap the poem has been setting since the first stanza of Alcina's introduction.

Spenser will pick up exactly this move for Duessa: first the beauty described in high Petrarchan register; then the revealed hag. The move passes through Tasso and into Milton's Satan — who is 'not less than Archangel ruined' before the reader catches the ruin. Ariosto is the hinge of the whole tradition.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The Petrarchan blazon Ariosto pastiches here goes back to Petrarch's Canzoniere and Poliziano's Stanze. Every Renaissance-romance beauty is described in this register; Ariosto's innovation is using the register to set up its own collapse.",
        workTitle: "Canzoniere",
        workAuthor: "Petrarch",
        passageReference: "passim",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 2. Melissa and the ring — the counter-magic ──
  {
    id: "of-7-melissa-ring",
    bookId: "orlando-furioso",
    chapterNumber: 7,
    anchorText: "Thanks to the ring, whose more than mortal aid",
    anchorOccurrence: 1,
    title: "Melissa's ring — sight as the allegorical weapon",
    quotedPassage:
      "Thanks to the ring, whose more than mortal aid.",
    passageReference: "Canto VII · OF VII.48–66",
    commentary: `Melissa, Merlin's priestess and Bradamante's ally since Canto III, arrives on Alcina's island disguised as Atlante to give Ruggiero the magic ring. The ring has two powers: it makes the wearer invisible, and it dissolves all enchantments when placed in the mouth. The second is the one that matters here: when Ruggiero slips the ring on, Alcina's illusion collapses and he sees the sorceress as she is.

Ariosto's allegorical economy is unusually clean in this sequence. The weapon against concupiscence is not force or prayer; it is *sight* — the rational faculty that perceives things as they are rather than as desire has painted them. Logistilla, the counter-sorceress, is reason; Melissa is the agent who delivers reason's instrument. When the ring enters Ruggiero's hand, the allegorical circuit closes.

The ring has a long romance-tradition genealogy. It descends from Angelica's ring in Boiardo (originally given to her father by a magician), passes through various hands, and ends up here with Melissa. Ariosto inherits the object but reinterprets its purpose: in Boiardo it was a rescue device (Angelica uses it to become invisible); in Ariosto it becomes an allegorical instrument of disenchantment. Same object, different allegorical load — which is typical of how Ariosto works on his inherited material.`,
    crossReferences: [],
    tags: ["mythological", "literary-influence"],
  },

  // ── 3. VII.73 — the revelation itself ──
  {
    id: "of-7-alcina-revealed",
    bookId: "orlando-furioso",
    chapterNumber: 7,
    anchorText: "Pale, lean, and wrinkled was the face, and white",
    anchorOccurrence: 1,
    title: "VII.73 — the unveiling; the source of Spenser's Duessa",
    quotedPassage:
      "Pale, lean, and wrinkled was the face, and white.",
    passageReference: "Canto VII, stanza 73 · OF VII.73",
    commentary: `This is the passage. The Petrarchan catalogue of Canto VII's opening is reversed, feature by feature: the golden hair is now sparse white; the rose complexion is sallow; the teeth are gone; the breast is withered. Alcina is described as *older than the Sibyl of Cumae*, older than the oldest woman conceivable — Ariosto's way of saying that what Ruggiero had been seeing was an illusion papered over unimaginable age and corruption.

The stanza is the most-imitated single moment in Orlando Furioso. Its direct descendants in English:
- **Spenser, *Faerie Queene* I.viii.46–49**: Duessa stripped of her magical garments and exposed as hideous. The sequence is Spenserian in surface but structurally Ariosto: the false beauty that held the knight in thrall is dispelled by a direct revelation, and the revelation is physical — skin, teeth, smell.
- **Tasso, *Gerusalemme Liberata* XVI** (Armida's garden-revelation — though Tasso handles the beauty differently).
- **Milton, *Paradise Lost* IV.800–809**: Satan at Eve's ear, exposed by Ithuriel's spear — not a beauty-unveiling but a rhetorical descendant of the magical-disenchantment move.

What makes the Ariosto passage structurally innovative, and still the most efficient version, is the stanza-by-stanza inversion. Where the opening catalogue built upward (golden hair, then roses, then brows, then eyes), the revelation inverts: the same sequence but the opposite term at each point. Spenser will imitate the technique exactly. Milton learned it from both of them.

A Renaissance detail worth knowing: this passage was anthologized in Italian commonplace books through the 1500s as a model of the disenchantment trope, and read alongside classical disenchantments (Circe in Homer, the witch Canidia in Horace). Ariosto's scene became the received European form.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Faerie Queene I.viii.46–49 — Duessa's stripping and exposure — is the direct English descendant of VII.73. Spenser inherits the feature-by-feature revelation technique and the moral weight: the false beauty was a disguise for corruption, and its unveiling is the knight's liberation.",
        workTitle: "The Faerie Queene",
        workAuthor: "Edmund Spenser",
        passageReference: "Book I, Canto viii, stanzas 46–49",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Paradise Lost IV.800–809 — Satan exposed by Ithuriel's spear — is a rhetorical descendant of the same magical-disenchantment tradition. Milton knew both Ariosto and Spenser; the exposure as instantaneous, physical, and humiliating is the tradition's signature.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV, lines 800–809",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 4. The foil — "A hag so old and hideous is not found" ──
  {
    id: "of-7-hag",
    bookId: "orlando-furioso",
    chapterNumber: 7,
    anchorText: "A hag so old and hideous is not found",
    anchorOccurrence: 1,
    title: "The hyperbole — Ariosto's comic register for moral horror",
    quotedPassage:
      "A hag so old and hideous is not found.",
    passageReference: "Canto VII · OF VII.73",
    commentary: `The line is hyperbolic in a specifically Ariostan way — the hyperbole IS the tonal device. A Dante or a Milton would describe Alcina's corruption in gravely measured language; Ariosto reaches for comic excess ("no one older and more hideous anywhere") because his allegorical point has a comedy attached to it.

The comedy is that Alcina's seduction was always preposterous. A reader could have seen through it at any point. The magical ring is not a deep mystery; it is what the narrator has been pretending not to have — a common-sense perspective. The revelation's tone says: of course this is what she was; were you pretending otherwise? Ariosto's irony is directed at the reader as much as at Ruggiero.

This tonal choice is what separates Ariosto from Spenser. Spenser's Duessa-revelation is solemn — it is the dark revelation that Una has been waiting for. Ariosto's Alcina-revelation is both serious and comic at once, and this doubling is characteristic of the poem as a whole. Reading Ariosto straight, as if it were all Spenser or all Dante, loses the register that Ariosto inhabits; reading him as pure comedy misses the moral weight.

Byron will inherit this exact tonal doubling three hundred years later for Don Juan. The Haidée episode is both tragic and comic; the Wellington attack in IX is both fierce and funny. The tonal technique is Ariosto's.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Byron inherits exactly this tonal doubling in Don Juan: the simultaneous comic and tragic register. The Haidée-episode and the Wellington satire both operate in this Ariostan key — neither pure pathos nor pure mockery.",
        workTitle: "Don Juan",
        workAuthor: "Lord Byron",
        passageReference: "Canto IV (Haidée's death); Canto IX (Wellington attack)",
        targetBookId: "don-juan",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 5. Escape and passage to Logistilla ──
  {
    id: "of-7-escape-logistilla",
    bookId: "orlando-furioso",
    chapterNumber: 7,
    anchorText: "She, not like old Atlantes, rendered blind",
    anchorOccurrence: 1,
    title: "Passage to Logistilla — Ruggiero between the sisters",
    quotedPassage:
      "She, not like old Atlantes, rendered blind.",
    passageReference: "Canto VII · OF VII.77",
    commentary: `Melissa's parting instruction to Ruggiero is to travel on to Logistilla's realm — the counter-sorceress sister — for proper moral re-tempering. The instruction is allegorically precise: mere escape from concupiscence is not sufficient; the hero must be actively re-formed in reason's territory before returning to the world. Alcina's island cannot be simply fled; it must be replaced with Logistilla's, which will happen in Canto X.

Ariosto draws a contrast here between Melissa (who has delivered Ruggiero with the ring) and Atlante (who has tried to protect Ruggiero by imprisoning him). Both are well-intentioned sorcerers; both want Ruggiero preserved. But Atlante's approach is paternalistic imprisonment — the iron castle of Canto IV, the palace of illusion he will build in Canto XII — while Melissa's is informed liberation, giving Ruggiero the instrument to see for himself.

The contrast is deep allegorical architecture. Atlante stands for a certain kind of protective love that is, in the end, a prison; Melissa stands for a liberating love that entails risk. The poem will return to this contrast. When Astolfo finally destroys the palace of illusion in XXII, he is destroying a structure Atlante built out of love and fear combined — and Melissa, who has been the agent of un-deception throughout, has a hand in that destruction too.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
]
