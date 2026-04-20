import type { Annotation } from "../types"

// ── Aeneid Book III — the wanderings ────────────────────────────────────
// Dryden translation; anchors line-exact against public/content/the-aeneid/ch-2.json.
//
// Aeneas continues his tale to Dido: the years between Troy's fall and
// his arrival at Carthage. Structurally this is Virgil's Odyssey IX–XII —
// the episodic travel-book, each landfall a new peril. Virgil compresses
// Homer's sequence (Thrace, Delos, Crete, the Harpies, Buthrotum, Mount
// Etna/Polyphemus, Sicily) and layers in specifically Roman-theological
// material (false starts, prophetic women, the death of Anchises).

export const AENEID_BOOK_3: Annotation[] = [
  {
    id: "aeneid-3-polydorus",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "How Helenus reviv\u2019d the Trojan name",
    anchorOccurrence: 1,
    title: "The wanderings — structural overview",
    quotedPassage:
      "How Helenus reviv'd the Trojan name…",
    passageReference: "Book III, line 381 (Dryden) · Aeneid III.1 ff.",
    commentary: `Book III is Virgil's Odyssean book — episodic travel through the eastern Mediterranean. The structural homage is explicit (a shipwrecked hero narrating his wanderings to a host), but Virgil uses the form to carry Roman theology rather than Greek adventure. Each landfall adds a piece of the prophecy of Italy: Apollo at Delos says *antiquam exquīrite mātrem* ("seek your ancient mother"); the Penates speak in a dream and specify *Hesperia*; Helenus at Buthrotum gives the fullest forecast of the Italian arrival. The book's function is to establish, across several failed starts, that Italy specifically — not Crete, not Sicily, not Epirus — is the destined place. Misreadings of the prophecy (Anchises thinks it means Crete) are cleared up by subsequent revelations. The Aeneid is building a theology of *progressive* prophecy, where divine will discloses itself piecemeal and mortals must stay attentive through the corrections.`,
    crossReferences: [
      {
        type: "source",
        description: "The template is Odyssey IX–XII — Odysseus narrating his own travels to the Phaeacians. Virgil borrows the frame and converts the moral register from Greek adventure to Roman destiny.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books IX–XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-3-delos-oracle",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "Of sacred Delos, and the god implore",
    anchorOccurrence: 1,
    title: "Delos and Apollo's oracle — the first misreading",
    quotedPassage:
      "Of sacred Delos, and the god implore…",
    passageReference: "Book III, line 198 ff. (Dryden) · Aeneid III.84–120",
    commentary: `Apollo, through his oracle at Delos, tells the Trojans to "seek their ancient mother" — the land their forebears came from. Anchises interprets this to mean Crete (Teucer, a proto-Trojan ancestor, came from there). They sail to Crete, found a town, are struck by plague, and realize the oracle meant something else. The Penates appear to Aeneas in a dream and specify: *Hesperia* — Italy, where Dardanus (their other ancestor) was born.

Two observations:

**The oracle is accurate but requires re-interpretation.** Virgil's gods speak truly; mortals misread. The pattern will recur throughout the poem — Aeneas must continually correct his own understanding of what the divine will is asking of him. The Aeneid's theology includes the interpretive gap.

**Anchises is the one who gets it wrong.** The pious father — the symbol of reverent authority — misreads Apollo. Virgil is quietly registering that *pietas* does not guarantee correct reading; it is a posture of willingness, not a faculty of certainty. The lesson will matter at the end of Book VI (the gates of sleep) and the end of the poem (the killing of Turnus) — both moments where the reader and the hero are working from incomplete interpretation.`,
    crossReferences: [],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "aeneid-3-harpies",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "The dire abode where the foul Harpies reign",
    anchorOccurrence: 1,
    title: "The Harpies — Celaeno's dark prophecy",
    quotedPassage:
      "The dire abode where the foul Harpies reign…",
    passageReference: "Book III, line 277 ff. (Dryden) · Aeneid III.209–267",
    commentary: `On the Strophades, the Trojans are attacked by the Harpies — bird-women who foul their banquet. Celaeno, leader of the Harpies, prophesies that the Trojans will reach Italy but will be so hungry they will "eat their tables." The prophecy is meant as a curse; Virgil later resolves it as a benign omen (in Book VII, the Trojans eat the bread that has served as their improvised plates, thus "eating their tables," and Aeneas laughs in relief).

The Harpies scene is Virgil's most grotesque bestiary-moment, and it sits in deliberate contrast to the episodic gentleness of the Buthrotum scene that follows. Virgil is establishing the book's rhythm: frightening encounter, then a period of welcome, then another frightening encounter. The Odyssey's episodic structure is being mapped onto a Trojan-Italian eschatology.`,
    crossReferences: [
      {
        type: "source",
        description: "Apollonius's Argonautica II has the Harpies tormenting the blind prophet Phineus. Virgil adapts the creature-type and gives it a prophetic role Apollonius does not.",
        workTitle: "Argonautica",
        workAuthor: "Apollonius Rhodius",
        passageReference: "Book II, lines 178–300",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "aeneid-3-andromache",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "Such things as these Cassandra did relate",
    anchorOccurrence: 1,
    title: "Andromache at Buthrotum — Troy in miniature",
    quotedPassage:
      "Such things as these Cassandra did relate… / Andromache, now married to Helenus…",
    passageReference: "Book III, lines 244, 381 ff. (Dryden) · Aeneid III.294–355",
    commentary: `The Trojans land at Buthrotum in Epirus and find, to their astonishment, a miniature Troy: Andromache (Hector's widow) married to Helenus (Priam's son), ruling a small kingdom they have modeled on their lost city. The streets are named after Trojan streets. A replica of the Simois river runs through the grounds. Andromache is making offerings at an empty tomb for Hector.

This is one of the Aeneid's most emotionally precise scenes. The Trojans could stay here — join their own people in an already-rebuilt Troy — and they cannot. Italy is the destination; this is a *substitute*, not a home. Virgil writes the impossibility of the substitute with unflinching care: Andromache, weeping, asks Aeneas if his son still lives, if his mother is well, if he still remembers his dead wife Creusa. The questions are ordinary, and they are heartbreaking because they come from a woman who has been reduced to grieving-in-place while history has moved on without her.

The theological point is that the diaspora cannot be cured by nostalgia-replica. Troy is over; the only way forward is forward. Andromache's Buthrotum is the poem's most vivid portrait of what it costs to resist that truth.`,
    crossReferences: [
      {
        type: "echo",
        description: "Andromache in Iliad VI — the farewell with Hector, the child Astyanax on the walls — is the backstory this scene is trading on. The woman Virgil's reader first met in Homer is now, twenty books later in the literary tradition, still mourning the same husband.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book VI (Andromache's farewell)",
        targetBookId: "the-iliad",
        targetChapterNumber: 6,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },
  {
    id: "aeneid-3-helenus-prophecy",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "A land there is, Hesperia call\u2019d of old",
    anchorOccurrence: 1,
    title: "Helenus's prophecy — the fullest roadmap",
    quotedPassage:
      "A land there is, Hesperia call'd of old…",
    passageReference: "Book III, line 221 ff. (Dryden) · Aeneid III.374–462",
    commentary: `Helenus, the Trojan seer now ruling at Buthrotum, gives Aeneas the most detailed prophecy in the poem before the one Anchises will deliver in Elysium. He names the landmarks: the white sow with thirty piglets (the portent of Alba Longa), the long way around Sicily (avoiding Scylla and Charybdis), the Sibyl at Cumae, the descent to Anchises. He tells Aeneas that the journey will be longer than he thinks.

Helenus's speech is the practical-roadmap version of divine prophecy — specific places, specific signs, specific warnings. It contrasts with Apollo's gnomic Delos-utterance and with the Penates' dream. Virgil is varying the register of prophecy deliberately: oracles, dreams, seers, and (eventually) fathers in Elysium all convey overlapping information in different modes. The pattern is the Aeneid's way of showing that revelation is *cumulative* — no single channel is sufficient.`,
    crossReferences: [],
    tags: ["mythological", "literary-influence"],
  },
  {
    id: "aeneid-3-polyphemus",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "Left me forsaken in the Cyclops\u2019 den",
    anchorOccurrence: 1,
    title: "Achaemenides and Polyphemus — an Odyssean cameo",
    quotedPassage:
      "Left me forsaken in the Cyclops' den.",
    passageReference: "Book III, line 809 ff. (Dryden) · Aeneid III.588–691",
    commentary: `The Trojans land in Sicily near Mount Etna and encounter Achaemenides, a Greek whom Odysseus left behind when fleeing the Cyclops's cave. The scene is Virgil's most direct Odyssean lift — he reaches across Homer's Book IX and picks up a literal survivor of that adventure, inserting him into the Aeneid's narrative. Achaemenides begs the Trojans (his former enemies) to take him with them; they do.

The scene does two things:
- It places Aeneas in Odysseus's literal footprints on the same island, with the same monster visible on the horizon. The Cyclops, blinded but still alive, stumbles through the surf.
- It has a Trojan extend mercy to a Greek — a gesture the Aeneid is interested in. Aeneas chooses *humanity* over *inherited enmity*.

The Achaemenides incident is Virgil showing that the Trojan-Greek polarity of the Iliad is being dissolved by the kind of civilization Aeneas is founding. Rome will be a people that absorbs former enemies. That is stated in practice in this small scene eight books before Jove formalizes it in Book XII.`,
    crossReferences: [
      {
        type: "source",
        description: "Odyssey IX.181–566 is the Polyphemus episode — Odysseus blinding the Cyclops with a stake and escaping under the belly of a ram. Virgil's Achaemenides is a Greek sailor Odysseus accidentally abandoned, rescued by the Trojans. The scene is Virgil's most literal Homeric interpolation.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book IX (Polyphemus)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-3-etna",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "Mount Aetna thence we spy",
    anchorOccurrence: 1,
    title: "Etna — Virgil's set-piece description",
    quotedPassage:
      "For shipwrecks fear'd. Mount Aetna thence we spy, / Known by the smoky flames which cloud the sky.",
    passageReference: "Book III, lines 727–728 ff. (Dryden) · Aeneid III.570–587",
    commentary: `The description of Mount Etna is one of Virgil's set-piece nature paintings — the volcanic eruption described with geological precision: the columns of smoke, the internal heat, the enchained Titan (Enceladus, per local myth) turning in his sleep and breathing out flame. Lucretius had given volcanoes a rationalist natural-philosophy account; Virgil restores the mythological frame but keeps Lucretian detail.

The scene is also Virgil establishing that the Aeneid's Italy is *volcanically specific* — this is a real landscape Virgil's Roman reader can identify. Etna on the horizon, the Cyclops limping through the surf, the smoke-column above the mountain — the textures anchor the Odyssean-allegorical travel in a landscape the reader could visit. It is Virgil's ongoing technique of locating myth in terrain.`,
    crossReferences: [
      {
        type: "source",
        description: "Lucretius, De Rerum Natura VI.639–702, gives Etna a full rationalist account — underground caverns, wind, pressure. Virgil writes in the wake of Lucretius and restores the mythological register without losing the physical precision.",
        workTitle: "De Rerum Natura",
        workAuthor: "Lucretius",
        passageReference: "Book VI (the Etna passage)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence"],
  },
  {
    id: "aeneid-3-anchises-death",
    bookId: "the-aeneid",
    chapterNumber: 2,
    anchorText: "Which Drepanum\u2019s unhappy port receiv\u2019d",
    anchorOccurrence: 1,
    title: "The death of Anchises — Book III ends in unnoticed grief",
    quotedPassage:
      "Which Drepanum's unhappy port receiv'd.",
    passageReference: "Book III, line 930 ff. (Dryden) · Aeneid III.708–715",
    commentary: `Book III ends with the quietest of its catastrophes. At Drepanum in Sicily, Anchises dies. Virgil marks this in three lines. There is no death-bed scene, no prophecy, no ceremony — the man who has been the steady moral center of the book simply dies, and the narrative moves on.

The under-description is deliberate. Aeneas is telling this story to Dido. He has spent Books II and III recounting loss after loss — the fall of his city, the disappearance of his wife, the wanderings of his people — and Anchises's death is the last private grief he lays before her. The compression is the sound of a man's voice breaking.

And then the frame closes. Book III ends the tale; Book IV will open with Dido's "flame unseen" in her veins. Aeneas has just finished telling her the story of everyone he has lost; her response is to fall in love with him. The book-break is one of the most pointed transitions in the poem.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The death of Anchises here sets up the descent to meet him in Book VI — Aeneas will spend the next three books missing him, and the Elysium reunion is the answer to this silent Book-III closing line.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI (the Elysian reunion)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },
]
