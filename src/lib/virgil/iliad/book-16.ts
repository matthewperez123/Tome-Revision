import type { Annotation } from "../types"

// ── Iliad Book XVI — The Death of Patroclus ────────────────────────────
// The pivot-book of the poem. Achilles lets Patroclus put on his armor
// and lead the Myrmidons; Patroclus kills Sarpedon, breaks Troy's line,
// reaches the walls, and is killed by Hector. The Iliad's entire second
// half flows from this one borrowed-armor decision.

export const ILIAD_BOOK_16: Annotation[] = [
  {
    id: "iliad-16-patroclus-weeping",
    bookId: "the-iliad",
    chapterNumber: 16,
    anchorText: "Patroclus stood beside his friend",
    anchorOccurrence: 1,
    title: "Patroclus weeping — Achilles's bitter metaphor",
    quotedPassage:
      "Meanwhile Patroclus stood beside his friend / The shepherd of the people, Peleus' son, / And shed hot tears, as when a fountain sheds / Dark water down a craggy precipice.",
    passageReference: "Book XVI, lines ~2–5 (Bryant) · Iliad XVI.2–5",
    commentary: `The book opens on Patroclus weeping — and Achilles, still sulking in his hut after his quarrel with Agamemnon, responds with a strikingly cruel taunt: *Why do you weep, Patroclus, like a little girl running after her mother and plucking at her gown and holding her back?* The simile is meant to shame. But Patroclus's grief — for the Greek line collapsing, for Ajax overwhelmed at the ships — is the grief Achilles himself cannot permit himself to feel while his wrath is still intact.

Patroclus's request — let me put on your armor and lead the Myrmidons out; the sight alone may turn the Trojans — is the turning point of the poem. Achilles agrees, but with a fatal condition: *push the Trojans back from the ships, but do not follow them to the walls of Troy.* We know, even before Patroclus rides out, that the condition will be broken.

The scholia on Book XVI call this *patrokleia* — "the deed of Patroclus." Patroclus is the *Iliad*'s clearest exemplar of the secondary hero, whose love for the primary hero licenses his death: Patroclus in the armor of Achilles dies because the armor invites Hector to kill him. The *patrokleia* becomes a template: Virgil's Nisus and Euryalus, Milton's Abdiel, every pair in the tradition where one loves another into battle.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Virgil's Nisus and Euryalus in Aeneid IX reprise the Patroclus-Achilles relationship: the younger warrior's love for the elder drives him into mortal danger, and the poem mourns them in the same register Homer mourns Patroclus.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IX, lines 178–499",
        targetBookId: "the-aeneid",
        targetChapterNumber: 8,
        targetAnchorText: "Nisus",
      },
    ],
    tags: ["literary-influence"],
  },
  {
    id: "iliad-16-sarpedon",
    bookId: "the-iliad",
    chapterNumber: 16,
    anchorText: "Thus with loud tumult fled the Trojan horse",
    anchorOccurrence: 1,
    title: "Zeus and Sarpedon — the divine grief",
    quotedPassage:
      "Thus with loud tumult fled the Trojan horse.",
    passageReference: "Book XVI, line ~ (Bryant) · Iliad XVI.426ff",
    commentary: `Patroclus kills Sarpedon, son of Zeus, mid-book. Zeus watches from Olympus and for a moment considers rescuing his son from the fated death — he asks Hera if he should *snatch Sarpedon alive out of the tearful battle and put him living in the rich land of Lycia.* Hera's answer is the *Iliad*'s most severe theological statement: *If you save your son from death, every other god will want to save his own. All your mortal sons will be snatched away from their fates, and the order of the world will unravel.*

Zeus accepts her argument. Sarpedon dies. Zeus weeps *tears of blood* onto the battlefield. The passage is one of the earliest texts in European literature where a god's love for a human is explicitly constrained by the structure of death itself — the universe, on this reading, has made even divine attachment subordinate to mortality.

Sarpedon's speech to Glaucus earlier (XII.310–328) has become the most quoted philosophical passage in the *Iliad*: *My friend, if the two of us by escaping from this war could live forever, ageless and immortal, I would not myself fight in the forefront — but since the countless fates of death stand over us in any case, let us go forward and either give glory to another or win it ourselves.* This is the *Iliad*'s most distilled formula for aristocratic warrior ethics.`,
    crossReferences: [],
    tags: ["philosophical", "mythological"],
  },
]
