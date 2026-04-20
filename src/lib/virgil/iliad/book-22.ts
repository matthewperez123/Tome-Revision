import type { Annotation } from "../types"

// ── Iliad Book XXII — The Death of Hector ─────────────────────────────
// The book every reader remembers: Hector alone outside the walls of
// Troy, Achilles running him down, the three circuits of the city, the
// duel, the dragging of the body. Everything the *Iliad* has been
// building — the consequences of Book I's quarrel and Book XVI's loan
// of armor — resolves here.

export const ILIAD_BOOK_22: Annotation[] = [
  {
    id: "iliad-22-hector-alone",
    bookId: "the-iliad",
    chapterNumber: 22,
    anchorText: "Thus were they driven within the city walls",
    anchorOccurrence: 1,
    title: "Hector outside the gate — the choice not to retreat",
    quotedPassage:
      "Thus were they driven within the city walls / Like frighted fawns.",
    passageReference: "Book XXII, lines 1–2 (Bryant) · Iliad XXII.1–2",
    commentary: `Book XXII opens with all the Trojans inside the walls except one. Hector remains outside at the Scaean Gate, waiting for Achilles. Priam and Hecuba, his parents, plead with him from the battlements to come inside; Priam strips off his white hair, Hecuba bares her breast and cries that she nursed him with this milk. Hector knows that if Troy falls, his parents and wife and son will die. He knows, as well, that he has already been responsible for the deaths of many Trojans by failing to pull back sooner.

What the book dramatizes at this moment is not courage or cowardice but *shame* — *nemesis* — the inability to return inside the walls and face the reproach of his own people. *Polydamas will reproach me,* Hector tells himself, *for not bringing the army in earlier.* Hector's Book VI speech had insisted on shame as the warrior's reason; Book XXII is that speech coming due.

Achilles approaches. Hector, in the instant before Achilles reaches him, runs. The three circuits of Troy — Achilles chasing Hector around the walls — are one of Homer's most startling sequences. The greatest Trojan warrior *flees*. The poem does not condemn him for it; the poem shows that the structure of terror is not optional.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "iliad-22-duel",
    bookId: "the-iliad",
    chapterNumber: 22,
    anchorText: "While Hector said to his illustrious foe",
    anchorOccurrence: 1,
    title: "Hector's last words — the dying prophecy",
    quotedPassage:
      "While Hector said to his illustrious foe.",
    passageReference: "Book XXII, line ~ (Bryant) · Iliad XXII.356ff",
    commentary: `Athena, disguised as Hector's brother Deiphobus, tricks Hector into turning to fight. The duel is brief; Achilles's spear pierces Hector's throat in the one place the borrowed armor (once Achilles's own) does not cover. Hector begs for ritual burial — *let my body be returned to my parents for the rites of fire.* Achilles refuses with the fiercest speech in the *Iliad*: *I could wish my rage and fury would drive me to cut your raw flesh and eat it, for what you have done.*

Hector's dying words are a prophecy: *remember me when Paris and Apollo kill you at the Scaean Gate.* Achilles responds: *Die. I will accept my doom whenever Zeus sends it.* This is the moment the *Iliad* treats Achilles's own death as settled: the greatest Greek warrior accepts that killing Hector means his own death follows soon. Homer will not narrate Achilles's death — we hear of it only in the *Odyssey* — but Hector's dying mouth has already foretold it.

Then the dragging begins. Achilles pierces Hector's heels, binds him to the chariot, and drags the body in the dust back to the Greek camp. The poem's most offended moment is also its most formally deliberate: the *Iliad* lingers on the dust and the dragging long past what the narrative requires, because the *disfiguring* of the body is the last stage of Achilles's wrath.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Virgil's Turnus in the final book of the Aeneid is killed by Aeneas in a scene that deliberately mirrors Achilles-Hector — down to Turnus's dying plea (send my body back to my father) and Aeneas's wrath-driven refusal. Virgil rewrites the scene to make his hero more troubled, but the structural inheritance is exact.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, lines 919–952",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: "Turnus",
      },
    ],
    tags: ["literary-influence"],
  },
]
