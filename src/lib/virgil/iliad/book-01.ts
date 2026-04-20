import type { Annotation } from "../types"

// ── Iliad Book I — hand-authored scholarly annotations ─────────────────
// William Cullen Bryant's 1870 blank-verse translation (Standard Ebooks).
// Anchors are line-exact against the transformed HTML in
// public/content/the-iliad/ch-1.json (data-iliad-line="N").
//
// Book I: the quarrel between Agamemnon and Achilles — the plague,
// Chryseis, Briseis, Achilles's withdrawal, Thetis's plea to Zeus, the
// divine-marital quarrel on Olympus. Everything the *Iliad* does is set
// in motion here.

export const ILIAD_BOOK_1: Annotation[] = [
  {
    id: "iliad-1-wrath",
    bookId: "the-iliad",
    chapterNumber: 1,
    anchorText: "Sing the wrath of Peleus' son",
    anchorOccurrence: 1,
    title: "The invocation — *mēnin aeide*",
    quotedPassage:
      "O Goddess! Sing the wrath of Peleus' son, / Achilles; sing the deadly wrath that brought / Woes numberless upon the Greeks.",
    passageReference: "Book I, lines 1–3 (Bryant) · Iliad I.1–3",
    commentary: `The *Iliad* begins not with a hero, a city, or a war, but with a feeling: *mēnin aeide*, "sing the wrath." The first word of the poem names its true subject — Achilles's wrath — and the entire twenty-four books are the unfolding of what one man's anger costs. War is the material; grief and rage are the subject.

Bryant's "Sing the wrath of Peleus' son" preserves the Greek word order exactly (Wrath—sing—of-Peleus's-son), putting *wrath* first in English as in Greek. This is unusual: Pope ("Achilles' wrath, to Greece the direful spring"), Chapman ("Achilles' baneful wrath resound"), Fagles ("Rage — Goddess, sing the rage"), and Lombardo ("Rage: Sing, Goddess") all take different routes. Every translator registers the same choice: whether to preserve Homer's shock of opening with an abstract noun.

Virgil will answer this at the beginning of the *Aeneid* — *Arma virumque canō*, "Arms and the man I sing" — compressing both the *Iliad*'s *arma* (wrath, weapons, war) and the *Odyssey*'s *virum* (the man who returns) into his first three words. Dante's *Inferno* I.85 will answer Virgil by calling him *lo mio maestro e 'l mio autore*. The whole European epic line takes its departure from this opening.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's *Arma virumque cano* — Arms and the man I sing — begins the *Aeneid* with a deliberate double-claim that fuses the Iliad's martial subject and the Odyssey's wandering hero. The inversion (Iliad material first, Odyssey second) is Virgil's structural signature.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, line 1",
        targetBookId: "the-aeneid",
        targetChapterNumber: 0,
        targetAnchorText: "Arms, and the man I sing",
      },
      {
        type: "source",
        description:
          "Milton's *Of Man's first disobedience* reworks the Homeric-Virgilian opening by putting *man* first and displacing war to the poem's interior (the War in Heaven of Book VI). The inversion is the whole argument of *Paradise Lost*.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 1–2",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Of Man's first disobedience",
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },
  {
    id: "iliad-1-chryses",
    bookId: "the-iliad",
    chapterNumber: 1,
    anchorText: "Chryses the priest",
    anchorOccurrence: 1,
    title: "Chryses's priestly supplication",
    quotedPassage:
      "Chryses the priest, who to the Grecian fleet / Came to redeem his daughter, offering / Uncounted ransom. In his hand he bore / The fillets of Apollo, archer-god.",
    passageReference: "Book I, lines 15–18 (Bryant) · Iliad I.11–21",
    commentary: `The plague that runs through the Greek camp at the start of Book I is caused, the poem insists, by a specific human wrong: Agamemnon has dishonored a priest. Chryses, father of Chryseis (the slave Agamemnon keeps), comes bearing the *stemma* (priestly fillets) of Apollo wound on a golden staff — the visible sign of protected office. Agamemnon's dismissal of the old man is a legal violation, not merely a personal rudeness.

Apollo's arrows kill mules, dogs, and men in that order — which is the order of sacrificial value inverted. The god attacks the community's infrastructure first (pack animals), then the hunt (dogs), then the humans. The plague runs nine days before Achilles, not Agamemnon, calls the assembly; the king's absence from his own crisis is already a character-portrait.

The whole *Iliad* is built on this pattern: rulers fail in honor, the community pays, and the greatest warrior must decide what honor actually requires of him. Book I's crisis of priestly honor is the *Iliad* in miniature.`,
    crossReferences: [],
    tags: ["historical", "mythological"],
  },
  {
    id: "iliad-1-briseis",
    bookId: "the-iliad",
    chapterNumber: 1,
    anchorText: "Atrides, king of men",
    anchorOccurrence: 1,
    title: "Agamemnon takes Briseis — the insult of honor",
    quotedPassage:
      "When the two chiefs, Atrides, king of men, / And great Achilles, parted first as foes.",
    passageReference: "Book I, lines 7–8 (Bryant) · Iliad I.6–7",
    commentary: `Agamemnon's seizure of Briseis — Achilles's war-prize, given him by the army — is the action that drives the *Iliad*. It is not romantic jealousy: Briseis is a *geras*, a tangible token of public honor awarded for bravery. Taking her back is a public stripping of the best warrior's standing before the entire army. Every man present understands what has happened.

Achilles's response — withdrawing himself and his Myrmidons from battle — is not tantrum but an act of legal-political protest. The Iliad's interest is in the consequences: without its best warrior, the Greek line collapses, Hector reaches the ships, Patroclus dies in Achilles's armor, and Achilles returns to battle with a different (and more terrible) kind of wrath.

The Briseis episode became the touchstone scene for every subsequent epic treatment of the relationship between a warrior and his commander. Shakespeare's *Troilus and Cressida* reduces it to cynicism; modern versions (Malouf's *Ransom*, Miller's *Song of Achilles*) read it through various lenses. Homer's original is terse: the wrong is done, the wrong is public, and everyone must now live with it.`,
    crossReferences: [],
    tags: ["literary-influence", "historical"],
  },
  {
    id: "iliad-1-thetis",
    bookId: "the-iliad",
    chapterNumber: 1,
    anchorText: "Latona's son",
    anchorOccurrence: 1,
    title: "Apollo's wrath and the divine machinery",
    quotedPassage:
      "Latona's son / And Jove's. Incensed against the king, he bade / A deadly pestilence appear among / The army, and the men were perishing.",
    passageReference: "Book I, lines 10–13 (Bryant) · Iliad I.9–12",
    commentary: `Homer's *theological* method in the *Iliad* is to double every event: there is a human cause *and* a divine cause, and both are true. Agamemnon insults Chryses; Apollo (Latona's son — *Leto* in Greek — is Apollo's mother) sends the plague. The plague is neither simply natural nor simply divine; it is the visible sign of a wrong that has both earthly and heavenly consequences.

This layered causation is Homer's gift to the entire epic tradition. Virgil's Juno-Aeolus storm in Book I of the *Aeneid* is a direct replication; Milton's machinery in *Paradise Lost* — Satan's journey, God's decrees — works on the same principle. The question is not "is it the gods or is it human choice?" but "how do the two layers refract each other?"

The poem is honest about the disproportion: Apollo's plague takes ten days to begin to be addressed, and the assembly is called not by the king (who caused it) but by Achilles (who has public standing without formal authority). Book I is a study in how communities recover from rulers' errors.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Virgil reworks Homer's Apollo-plague scene as Juno's Book I storm against the Trojans — the same double-causation logic (divine wrath + specific human history producing a natural disaster). The Aeneid's opening is Homer filtered through Roman theology.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 50–98",
        targetBookId: "the-aeneid",
        targetChapterNumber: 0,
        targetAnchorText: "haughty Juno's unrelenting hate",
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
]
