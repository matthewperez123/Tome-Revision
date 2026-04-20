import type { Annotation } from "../types"

// ── Iliad Book XXIV — Priam Ransoms Hector ────────────────────────────
// The final book, and the *Iliad*'s greatest scene: an old enemy king
// kisses the hands that killed his son, and the hero whose wrath opened
// the poem at last lets another grief match his own. Homer ends not
// with the fall of Troy but with a single meal, shared in a tent, at
// night, by Priam and Achilles.

export const ILIAD_BOOK_24: Annotation[] = [
  {
    id: "iliad-24-achilles-grief",
    bookId: "the-iliad",
    chapterNumber: 24,
    anchorText: "But still Achilles wept",
    anchorOccurrence: 1,
    title: "Achilles's persistent grief — wrath turned inward",
    quotedPassage:
      "But still Achilles wept, / Remembering his dear friend.",
    passageReference: "Book XXIV, lines ~3–4 (Bryant) · Iliad XXIV.3–4",
    commentary: `The *Iliad* began (Book I) with Achilles's wrath against Agamemnon; it rose again (Book XVIII) as wrath against Hector; now, after Hector is dead, the wrath has nowhere to go. Book XXIV opens with Achilles unable to sleep — he lies on the shore, then gets up, then drags Hector's body around Patroclus's tomb again — because grief has no place to arrive. The wrath that drove the poem has consumed even its target and still not subsided.

The gods on Olympus watch Achilles disfigure the body for eleven days and decide to intervene. Apollo argues (in a speech that quietly accuses Achilles's whole way of life) that *Achilles has destroyed pity in himself — he is like a lion, pure violence with no shame.* Zeus sends Thetis to her son with a command: accept ransom for the body.

The scene that follows — Priam entering the Greek camp at night, guided by Hermes — is the *Iliad*'s most astonishing reversal. The old enemy king kneels before his son's killer and kisses Achilles's hands. Achilles is stunned at the sight. They weep together: Priam for Hector, Achilles for Patroclus and for his own father Peleus whom he will never see again. They eat together. The poem ends a few days later with Hector's funeral.

Homer's final image of the greatest warrior is a man serving food to a bereaved father — the poem's clearest statement that recognition of shared mortality, not conquest, is the only resolution available.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Dante's Inferno XXVI ends with Ulysses's last voyage — pride pursuing beyond the known world. The Iliad XXIV is the counter-image: the hero drawn back into shared humanity by grief. Dante knew both scenes and read them against each other.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno Canto XXVI",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 25,
        targetAnchorText: "Ulysses",
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "iliad-24-priam-kneels",
    bookId: "the-iliad",
    chapterNumber: 24,
    anchorText: "The herald Argicide",
    anchorOccurrence: 1,
    title: "Priam in Achilles's tent — the kiss of the hands",
    quotedPassage:
      "The herald Argicide.",
    passageReference: "Book XXIV, line ~ (Bryant) · Iliad XXIV.460ff",
    commentary: `Hermes (the *Argeiphontes*, "slayer of Argus," here rendered by Bryant as *Argicide*) leads Priam through the Greek lines — invisible, at night, past every watchman. Priam enters Achilles's tent alone. What he does before speaking is unprecedented in the poem: *he took the hands of Achilles, terrible, man-slaying, that had killed so many of his sons, and kissed them.*

Priam's speech to Achilles is the *Iliad*'s greatest rhetorical composition: *Remember your father, godlike Achilles, who is of my own age, and on the threshold of sad old age. He too, perhaps, is oppressed by neighbors round about, and there is no one to defend him from evil and ruin. But he, hearing that you are still alive, rejoices in his heart, and hopes every day to see his dear son returning from Troy. But I am utterly unfortunate — I had sons in Troy, fifty of them, nineteen born of one mother, the rest from slave women. Most of them Ares has killed. Hector, who was the one left to defend the city, you have now killed fighting for his country. I have come to the Greek ships to ransom his body, bringing you untold ransom. Have reverence for the gods, Achilles, and pity on me, remembering your own father. Far more pitiable am I than he: I have endured what no other mortal man on earth has endured — I have put to my lips the hands of the man who killed my son.*

Achilles takes the old man's hand and pushes him gently away. Then they both weep. *They remembered — Priam his son-slayer Hector, lying at Achilles's feet, and Achilles wept for his own father, and again for Patroclus. The sound of their mourning filled the hut.*

This is the *Iliad*'s theological center. The poem refuses to end at the duel or the funeral; it ends here, with enemies recognizing their shared condition as bereaved. What recognition can do in the poem is small — Priam will still lose Troy, Achilles will still die — but it is what the poem takes twenty-four books to earn.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
]
