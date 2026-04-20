import type { Annotation } from "../types"

// ── Paradise Lost Book VIII — Adam's first consciousness, astronomy
// debate, creation of Eve, marriage theology, Raphael's warning. 10 ann.

export const PARADISE_LOST_BOOK_8: Annotation[] = [
  {
    id: "pl-8-adam-first-consciousness",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "For Man to tell how human life began",
    anchorOccurrence: 1,
    title: "Adam's first consciousness — Lucretian origin-scene",
    quotedPassage:
      "\"For Man to tell how human life began / Is hard; for who himself beginning knew?\"",
    passageReference: "Book VIII, lines 250–251 · PL VIII.250–51",
    commentary: `Adam narrates his own awakening. The opening line registers the philosophical difficulty: he has no prior memory, no infancy, no education — he wakes up fully grown, already conscious, already able to speak. Milton is describing a state no human reader has experienced and asking his verse to make it imaginable.

The template is Lucretius, *De Rerum Natura* V.925–987 — Lucretius's account of the first humans. But Milton inverts: Lucretius's first humans are brutes, Milton's first human is immediately rational, immediately articulate, immediately capable of self-reflection. Adam's first act (VIII.261ff) is to *look up at the sun* and infer the existence of a maker. The inference from evidence is built into the original human faculty.

The whole 180-line narrative (VIII.250–499) is one of the most philosophically dense first-person passages in the poem. Read slowly — the content is Augustine on memory, Descartes on cogito, and Lucretius on the state of nature, all running in Milton's blank verse at once.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Lucretius, De Rerum Natura V.925–987 — the origin of the human species as a brute emergence from matter. Milton reworks the Lucretian origin-scene into an account of the first rational being, fully conscious from the moment of awakening.",
        workTitle: "On the Nature of Things",
        workAuthor: "Lucretius",
        passageReference: "Book V, lines 925–987",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "pl-8-astronomy-debate",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "When I behold this goodly frame",
    anchorOccurrence: 1,
    title: "The astronomy debate — Ptolemy or Copernicus?",
    quotedPassage:
      "When I behold this goodly frame, this World / Of Heaven and Earth consisting, and compute / Their magnitudes…",
    passageReference: "Book VIII, lines 15–17 · PL VIII.15–17",
    commentary: `Adam asks Raphael whether the stars really move around the Earth or whether the Earth moves. Milton's handling of the question (VIII.15–178) is the most famous piece of Renaissance cosmology-in-verse. Raphael lays out both the Ptolemaic (geocentric) and the Copernican (heliocentric) systems, notes the arguments for each, and refuses to commit: *the great Architect / Did wisely to conceal, and not divulge / His secrets* (VIII.72–74).

The point is not scientific but ethical. Raphael's counsel is "*be lowly wise*" (VIII.173) — direct your knowledge toward what concerns you. The astronomy debate is a staged lesson in intellectual modesty: the new cosmology is allowed into Eden as a hypothesis but not as a theology. Milton, who knew enough Copernican astronomy to represent it fairly, refuses to let the poem endorse either system.

This is the deliberate counter-move to the Galileo simile of Book I. There Milton flashes a modernist image; here he formally suspends the question. The poem contains both moves, in tension.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Book I's Galileo simile (I.284–91) flashes a modern-astronomical image. Book VIII's astronomy debate (VIII.15–178) formally suspends the question of which system is true. Read the two passages together as Milton's double stance: modern imagery, deliberately old-school cosmology.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 284–291",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Tuscan artist",
      },
    ],
    tags: ["historical", "philosophical"],
  },
  {
    id: "pl-8-adam-naming",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "I named them, as they passed",
    anchorOccurrence: 1,
    title: "Adam naming the animals — language as insight",
    quotedPassage:
      "I named them, as they passed, and understood / Their nature; with such knowledge God endued / My sudden apprehension.",
    passageReference: "Book VIII, lines 352–354 · PL VIII.352–54",
    commentary: `Adam's naming of the animals (Genesis 2:19–20). Milton's gloss is crucial: naming is not mere labeling but insight. Adam *understands their nature* as he names them; the language is a direct mode of knowing. This is the Renaissance tradition of the *Adamic language* — the prelapsarian naming that perfectly corresponded to the thing named — in the form Bacon and others theorized and the Royal Society dreamed of recovering.

After the Fall (and after Babel), language becomes conventional: words no longer mirror their referents, and translation becomes possible. Adam's naming is the moment before that disjunction. The Tome gloss system — tap-to-reveal definitions — is in some sense the post-lapsarian descendant of the kind of knowledge Adam has directly.`,
    crossReferences: [],
    tags: ["linguistic", "philosophical"],
  },
  {
    id: "pl-8-eve-created",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "loveliness, Sole partner",
    anchorOccurrence: 1,
    title: "The creation of Eve — Adam's side, Adam's rib",
    quotedPassage:
      "Under his forming hands a Creature grew, / Manlike, but different sex; so lovely fair, / That what seemed fair in all the World seemed now / Mean…",
    passageReference: "Book VIII, lines 470–473 · PL VIII.470–73",
    commentary: `Adam, put into a trance, watches (as in a vision) the creation of Eve from his rib. Milton handles the Genesis scene carefully: Adam's vision of her making is itself the beginning of their relationship, since he knows her origin as intimately as she does.

Milton's striking choice is to have Adam describe Eve's beauty *before* he speaks to her. The aesthetic recognition precedes the ethical. When Eve flees from him on first sight (VIII.500–10) — her first autonomous act — the narrative registers both her beauty as the subject of Adam's gaze and her subjectivity as her own. Milton is giving Eve a point of view from the start.

The classical template is Odysseus's first sight of Nausicaa (Odyssey VI.149ff), but Milton is also inheriting the Song of Songs' vocabulary for the beloved. The synthesis is new.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "pl-8-eve-retreats",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "She turned",
    anchorOccurrence: 1,
    title: "Eve turns away — her first independent act",
    quotedPassage:
      "She heard me thus, and, though divinely brought, / Yet innocence, and virgin modesty, / Her virtue, and the conscience of her worth… / I followed her.",
    passageReference: "Book VIII, lines 500–509 · PL VIII.500–09",
    commentary: `Eve's first free action is to turn away from Adam. Milton names the reasons: *innocence*, *virgin modesty*, *the conscience of her worth* — three distinct motivations, each a form of self-possession. The retreat is brief, and it ends in the marriage; but the retreat is there, on the record, as the moment Eve's agency enters the poem.

This matters because it prevents the standard misreading of Eve as created solely for Adam's convenience. The poem's first narrative of her is a narrative of her self-possession. She goes back to him by choice, and the choice is the foundation of the marriage.

Milton's gendered theology (Eve as "*for God in him*," IV.299) has to be read against this scene. The subordination is a structural claim; the drama consistently portrays Eve as a subject with her own ground. The tension is not resolved in the poem, and it should not be resolved in reading.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-8-adams-passion",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "here passion first I felt",
    anchorOccurrence: 1,
    title: "Adam's confession of passion to Raphael",
    quotedPassage:
      "Here passion first I felt, / Commotion strange! in all enjoyments else / Superior and unmoved…",
    passageReference: "Book VIII, lines 530–532 · PL VIII.530–32",
    commentary: `Adam's private confession. He has felt *passion* for the first time in her presence, and the word is marked: the passions are, in classical and Christian ethical tradition, the irrational movements of the soul requiring the guidance of reason. Adam reports that Eve's presence has, unprecedentedly, compromised his rational sovereignty.

Raphael's reply (VIII.567–605) is paternal and severe: *what transports thee so*? Passion is not evil in itself, but *subjection* to passion is dangerous. Love must be governed by reason, or it becomes a snare. The warning lands awkwardly — Adam's passion is not yet uncontrolled, and the warning itself may be a contribution to the subsequent trouble.

This is the conversation Adam will remember in Book IX when Eve proposes separate labor, and in Book IX.997ff when he takes the fruit *because he cannot bear to lose her*. Raphael has named the risk; Adam will take it anyway.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Adam's choice to eat the fruit in IX.997ff (\"no no, I feel / The link of Nature draw me\") is the payoff of this passion. Read the two passages together.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IX, lines 997–1016",
        targetBookId: "paradise-lost",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical"],
  },
  {
    id: "pl-8-angels-blush",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "To whom the Angel, with contracted brow",
    anchorOccurrence: 1,
    title: "Raphael's warning — \"be strenuous in love\"",
    quotedPassage:
      "\"Accuse not Nature, she hath done her part; / Do thou but thine…\"",
    passageReference: "Book VIII, lines 561–562 · PL VIII.561–62",
    commentary: `Raphael's reply. *Accuse not Nature* — the reply is Stoic in structure (Epictetus, Marcus Aurelius): the thing given is good, the fault is in the receiver's management. Adam is counseled to recognize Eve's beauty *and* to keep the hierarchy of faculties intact: reason above passion, spirit above body, not vice versa.

Milton's angel then blushes (VIII.618–19, "*glowed / Celestial rosy red*") when Adam asks whether angels love — a famous moment in which angelic embodiment is registered as a real physiology. Milton's monism again: angels have material reality; their passion is *refined*, not *absent*; the hierarchy of substance does not exclude love at any level.

The blush is one of the poem's most-quoted oddities. It is there because Milton's metaphysics requires it.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "pl-8-angelic-love",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "Celestial rosy red",
    anchorOccurrence: 1,
    title: "Angelic blush — \"Love's proper hue\"",
    quotedPassage:
      "To whom the Angel, with a smile that glowed / Celestial rosy red, Love's proper hue…",
    passageReference: "Book VIII, lines 618–619 · PL VIII.618–19",
    commentary: `The moment that generated centuries of commentary. Raphael blushes at Adam's question about angelic love. Milton's gloss — *Love's proper hue* — signals that love, even at the angelic level, has a characteristic color and that color is capable of physical manifestation.

What follows (VIII.620–29) is Milton's most heterodox paragraph: angels love each other bodily, "*Union of pure with pure / Desiring*," without the obstruction of flesh that human bodies impose. The passage describes angelic eros as more total than human — because the substance of angels is less dense, the union can be more complete.

This is again monism applied: if angels are material, they can love materially; if angelic material is more refined, the love is more refined. Traditional Christian theology had denied angels any erotic dimension at all. Milton restores it, in a spectacularly beautiful paragraph that most readers skim past without registering the heterodoxy.`,
    crossReferences: [],
    tags: ["philosophical", "historical"],
  },
  {
    id: "pl-8-raphael-leaves",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "Thus saying, he arose",
    anchorOccurrence: 1,
    title: "Raphael leaves at evening — the end of instruction",
    quotedPassage:
      "Thus saying, he arose; whom Adam thus / Followed with benediction: \"Since to part, / Go, heavenly guest…\"",
    passageReference: "Book VIII, lines 644–646 · PL VIII.644–46",
    commentary: `Raphael departs. The full curriculum has been delivered — the war in Heaven as cautionary example (VI), the Creation as frame (VII), the astronomy and marriage instruction (VIII). Adam blesses him and watches him ascend back to Heaven.

Milton is closing the act of angelic pedagogy. What follows in Book IX is the test Raphael's visit was meant to prepare for. The structural point is sharp: Book IX begins with the narrator's famous "*No more of talk*" — the transition from conversation to consequence. The genre has shifted from pastoral dialogue to tragedy.

The pattern is Homeric: the divine visitor comes, instructs, departs; the protagonist is now on their own. Hermes to Calypso, Mercury to Aeneas, now Raphael to Adam. The epic form of the *messenger scene* is complete.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "pl-8-be-strong",
    bookId: "paradise-lost",
    chapterNumber: 7,
    anchorText: "Stand fast",
    anchorOccurrence: 1,
    title: "Raphael's farewell — \"stand fast; to stand or fall\"",
    quotedPassage:
      "Stand fast; to stand or fall / Free in thine own arbitrement it lies. / Perfect within, no outward aid require; / And all temptations to transgress repel.",
    passageReference: "Book VIII, lines 640–643 · PL VIII.640–43",
    commentary: `Raphael's parting words. *Free in thine own arbitrement* — in your own choosing — is the single clearest statement of Miltonic free will in the poem. The angel has named the stake: Adam and Eve's obedience is not an accomplishment God will protect; it is a choice they must keep making.

The phrase *perfect within, no outward aid require* is ambiguous. On one reading it means the human pair have been given everything they need for the test; on another it means they must not expect further angelic intervention. Both are true. The instruction phase is over, and what remains is application.

The reader should carry this warning into Book IX. When Satan appears in the garden, Adam and Eve are *alone* for the test; the angelic hosts are withdrawn. Milton has been explicit about the design.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
]
