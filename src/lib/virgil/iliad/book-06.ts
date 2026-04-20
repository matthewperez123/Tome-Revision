import type { Annotation } from "../types"

// ── Iliad Book VI — Hector and Andromache ─────────────────────────────
// The book in which the *Iliad* most completely shows what war costs —
// not the warriors, but the cities and households they defend. Hector's
// farewell to Andromache and Astyanax at the Scaean Gate is Homer's
// answer to the question of why any of this matters.

export const ILIAD_BOOK_6: Annotation[] = [
  {
    id: "iliad-6-glaucus-diomedes",
    bookId: "the-iliad",
    chapterNumber: 6,
    anchorText: "Great Hector of the crested helm replied",
    anchorOccurrence: 1,
    title: "Hector and Andromache — the Scaean Gate",
    quotedPassage:
      "Great Hector of the crested helm replied.",
    passageReference: "Book VI, line ~ (Bryant) · Iliad VI.440ff",
    commentary: `The Hector-Andromache scene at the Scaean Gate is the *Iliad*'s most piercing domestic moment. Andromache has lost her whole family (her father Eetion and her seven brothers are all dead — killed by Achilles). Hector is now father, mother, brother, and husband to her. She begs him not to go back to the battlefield; he answers with an argument about shame that is simultaneously a confession of tenderness.

*εἰ δέ κε μὴ εἴπῃσι, κατακτενέει ἐπιελπόμενος* — if he goes, he knows he may die. But what he says is: *I would feel shame before the Trojans and the long-robed women of Trojan race if, like a coward, I shrank from war.* Then he acknowledges, almost inaudibly, that he knows Troy will fall — *yet the pain I feel for the future losses of the Trojans is not so sharp as my pain for you when some bronze-armored Achaean drags you weeping away into slavery.*

The scene's final image is the baby Astyanax, terrified by his father's crested helmet and drawing back into his nurse's arms. Hector and Andromache laugh. Hector sets the helmet down, picks up the child, and prays that he will grow to be greater than his father. Then he puts the helmet back on and goes to die.

This is the scene Simone Weil was thinking of when she called the *Iliad* the poem of force — a study of how violence disfigures everyone it touches, with the clearest evidence being the moments of tenderness it compresses into unsustainable briefness.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Virgil's Aeneas reverses the scene: Aeneas carries his father Anchises from burning Troy, leaving his wife Creusa to die. The Aeneid takes the Hector-Andromache template and mourns what survives it (Aeneas saves family) rather than what it destroys.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II, lines 707–819",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: "Creusa",
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "iliad-6-leaves",
    bookId: "the-iliad",
    chapterNumber: 6,
    anchorText: "Now from that stubborn conflict",
    anchorOccurrence: 1,
    title: "Generations of leaves — Glaucus to Diomedes",
    quotedPassage:
      "Now from that stubborn conflict of the Greeks / And Trojans had the gods withdrawn.",
    passageReference: "Book VI, lines 1–2 (Bryant) · Iliad VI.1–2",
    commentary: `Book VI opens by pulling back from the battlefield (*the gods had withdrawn*) and letting the human encounter happen without divine machinery. The meeting of Diomedes and Glaucus on the field — the Greek realizing his Trojan opponent shares guest-friendship (*xenia*) with his grandfather — produces one of the most famous similes in all Greek literature:

*As is the generation of leaves, so is the generation of men. The wind scatters the leaves to the ground, and the forest in spring brings others to bud — so one generation of men springs up and another passes away.*

Glaucus's speech (Book VI.145–211) is the *Iliad*'s most concentrated meditation on mortality. The generations-of-leaves simile will echo across Western literature — Virgil (*Aeneid* VI.309, the souls at Acheron), Shelley (*Ode to the West Wind*), Pound (*Cantos* VII). The image arrests Diomedes; he recognizes the *xenia* and exchanges armor with Glaucus in a moment of peace-within-war that the *Iliad* rarely permits.

(Homer's closing joke: Glaucus gives gold armor for bronze — "Zeus took away Glaucus's wits." The poem refuses to leave even its most solemn scene without undercutting commentary.)`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Virgil's Aeneid VI.309 — *quam multa in silvis autumni frigore primo / lapsa cadunt folia* — the countless leaves that fall in autumn, compared to the souls waiting at Acheron — is a direct reworking of Glaucus's generations-of-leaves speech.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 309–312",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: "leaves",
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },
]
