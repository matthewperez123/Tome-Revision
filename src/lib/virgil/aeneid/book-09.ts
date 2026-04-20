import type { Annotation } from "../types"

// ── Aeneid Book IX — Nisus and Euryalus ─────────────────────────────────
// Dryden; anchors against public/content/the-aeneid/ch-8.json.
//
// While Aeneas is away seeking allies, Turnus storms the Trojan camp.
// The set-piece of the book is the night-raid of Nisus and Euryalus,
// modeled on the Doloneia of Iliad X but morally transformed. Ascanius
// wins his first kill; the Trojans hold out until the book closes with
// Aeneas's imminent return. The Fortunati ambo apostrophe is the
// emotional peak — already surfaced via V. monogram.

export const AENEID_BOOK_9: Annotation[] = [
  {
    id: "aeneid-9-camp-under-siege",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "Has left the Trojan camp without defence",
    anchorOccurrence: 1,
    title: "The camp — Aeneas absent, Turnus at the walls",
    quotedPassage:
      "\"Has left the Trojan camp without defence…\"",
    passageReference: "Book IX, line 10 ff. (Dryden) · Aeneid IX.1–24",
    commentary: `Juno sends Iris to Turnus with the news that Aeneas has gone upriver to Pallanteum. Turnus, told that the Trojan camp is leaderless, mobilizes immediately. The book's opening frame is a piece of classical military timing: the commander is away; the enemy attacks in his absence; the question is whether the second-in-command and the camp defenses can hold.

Virgil is re-using a Homeric pattern from Iliad IX–XII (Achilles withdrawn, the Greeks holding their wall under pressure) and re-functioning it with the Trojans in the defensive position Homer gives the Greeks. The role-swap is ongoing. Virgil's Trojans are Homer's Greeks-at-the-wall; Virgil's Italians are Homer's Trojans-on-the-attack. The Aeneid keeps assigning Iliadic parts to its own cast in ways that make literary sense and moral mischief.`,
    crossReferences: [
      {
        type: "source",
        description: "The Greek-wall-under-pressure from Iliad IX–XII is Virgil's model for the Trojan-camp-under-pressure. Homer's Achilles withdrawn; Virgil's Aeneas absent. The absence-of-the-hero structure is the backbone of the book.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Books IX–XII (the Greek wall)",
        targetBookId: "the-iliad",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-9-nisus-gate",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "To watch the gate was warlike Nisus\u2019 chance",
    anchorOccurrence: 1,
    title: "Nisus and Euryalus at the gate — setup for the night-raid",
    quotedPassage:
      "To watch the gate was warlike Nisus' chance. / Beside him stood Euryalus, his friend…",
    passageReference: "Book IX, lines 222–228 (Dryden) · Aeneid IX.176–180",
    commentary: `Virgil reintroduces the pair he set up in the Book V footrace. They are on guard duty at the Trojan gate during the siege. Nisus, restless, proposes that they slip out through enemy lines, find Aeneas, and bring him back. Euryalus insists on coming along.

The scene is one of Virgil's most detailed male-friendship portraits. Nisus is the older, more calculating — already thinking about what could go wrong. Euryalus is the younger, more enthusiastic, pressing for the adventure. They go to the war council; Ascanius (about the same age as Euryalus) approves the mission with pathetic eagerness and promises gifts. They slip out of the camp in the middle of the night.

Virgil prepares the catastrophe carefully. Every detail has future weight. The helmet Euryalus puts on will glint in the moonlight and give him away. The gifts Ascanius promises Euryalus's mother will turn into funeral consolation. The mission-plan is sound; the details will kill them.`,
    crossReferences: [],
    tags: ["mythological", "philosophical"],
  },
  {
    id: "aeneid-9-doloneia-model",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "So roams the nightly wolf about the fold",
    anchorOccurrence: 1,
    title: "The wolf simile — the night-raid as Doloneia",
    quotedPassage:
      "So roams the nightly wolf about the fold…",
    passageReference: "Book IX, line 66, closing at 580 ff. (Dryden) · Aeneid IX.314–458",
    commentary: `The night-raid is Virgil's explicit rewriting of the Doloneia — Iliad X, where Odysseus and Diomedes sneak into the Trojan camp at night, kill the spy Dolon, and slaughter the sleeping Thracian king Rhesus and his men. Virgil takes the Homeric template (pair of warriors at night, moonlight, sleeping enemies, ambush) and uses it twice: Nisus and Euryalus are the attackers, and they are *also* — by fate — the Rhesus figures who will be killed.

Virgil's pair slip through the sleeping Italian camp. They kill many warriors — Virgil gives us a string of small death-vignettes, each enemy captured in a brief description (the young priest of Cybele, the boy who hid under bundles, the soothsayer who mistook prophecy). The killings are quiet, efficient, and morally disturbing in a way Homer's Doloneia-killings are not. Virgil is watching his own heroes do what Homer let Odysseus and Diomedes do and is registering, in the description, that it is harder to endorse.

Then Euryalus takes a plumed helmet from one of the sleeping Italians as a trophy. The gleam of moonlight on the plume catches the eye of an approaching enemy patrol. The mission collapses from there.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad X (the Doloneia) — Odysseus and Diomedes raid the Trojan camp at night, kill the spy Dolon, and slaughter Rhesus's sleeping Thracians. Virgil's rewrite reassigns the moral valence: the sympathetic pair here is killed by the raid-turned-ambush, and the 'Rhesus' figures are Virgil's own characters.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book X (the Doloneia)",
        targetBookId: "the-iliad",
        targetChapterNumber: 10,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-9-flower-simile",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "Like a fair flow\u2019r by the keen share oppress\u2019d",
    anchorOccurrence: 1,
    title: "Euryalus dies — the flower simile",
    quotedPassage:
      "Like a fair flow'r by the keen share oppress'd; / A lab'ring ox: its head, the falling rain / Pressed down… / Or like a vernal poppy, overborne / With its own weight…",
    passageReference: "Book IX, line 582 ff. (Dryden) · Aeneid IX.433–437",
    commentary: `Euryalus, captured by the Italian patrol, is killed while Nisus watches from hiding. Virgil compares his death to a flower cut by the ploughshare and to a poppy overborne by its own weight, its head drooping. It is one of the most-quoted similes in Latin poetry.

The simile is a direct echo of two Iliadic flower-similes — Gorgythion's death in Iliad VIII (the head drooping like a garden poppy heavy with seed and spring rain) and Euphorbos in Iliad XVII (a young olive sapling broken by storm). Virgil doubles the image, combining them, and slows the line with extended physical description of the flower's slow collapse. The effect is the same as the Homeric formulas but registered for more beats — a young death depicted through a natural image that will not let the reader move on quickly.

Nisus, watching his beloved die, breaks cover. He charges the Italian patrol and is killed avenging him. Virgil writes the death of both with deliberate care — Nisus flings himself across Euryalus's body, is stabbed through the chest, and expires with his cheek against his friend's. The scene is the Aeneid's deepest male-bonded lament.`,
    crossReferences: [
      {
        type: "source",
        description: "Iliad VIII.306–308 (Gorgythion as the drooping poppy) is the source. Virgil's simile is a double citation of Homer combined and lengthened. The poppy image becomes, through Virgil, the European formula for a young death.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book VIII, lines 306–308",
        targetBookId: "the-iliad",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },
  {
    id: "aeneid-9-fortunati-pair",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "O happy friends",
    anchorOccurrence: 1,
    title: "Fortunati ambo — the poet promises immortality",
    quotedPassage:
      "\"O happy friends! for, if my verse can give / Immortal life, your fame shall ever live…\"",
    passageReference: "Book IX, lines 597–598 (Dryden) · Aeneid IX.446–449",
    commentary: `Virgil steps forward. He has been narrating in third person for a hundred lines; here he addresses Nisus and Euryalus directly. *Fortūnātī ambō! Sī quid mea carmina possunt, / nūlla diēs umquam memorī vōs eximet aevō, / dum domus Aenēae Capitōlī immōbile saxum / accolet imperiumque pater Rōmānus habēbit.* "Happy both! If my songs can do anything, no day will ever take you from mindful time, as long as the house of Aeneas inhabits the unmoved rock of the Capitol and the Roman father holds the imperium."

The apostrophe is one of the five canonical Virgilian apostrophes, already surfaced by a V. monogram in the reader. A note on its argument:

Virgil is making a *literary* promise. The fame of the two dead boys will last as long as his poem lasts — and, by rhetorical extension, as long as Rome lasts. The two things are linked. The Aeneid, in this apostrophe, is offering itself as the *medium* through which two dead youths survive. It is the poet claiming a specific civic power for his poem: immortality-through-verse, underwritten by the Roman state.

And the apostrophe has, in fact, delivered. Nisus and Euryalus are still known. The apostrophe's claim has been kept for two thousand years. The promise has outlasted the Capitoline fulfillment Virgil invoked as its condition.`,
    crossReferences: [
      {
        type: "allusion",
        description: "The Fortunati ambo is one of the Aeneid's five canonical authorial apostrophes. It is marked in the reader with a V. monogram; the apparatus-generated card for it carries the full Latin line and Virgilian-apostrophe scholarship.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IX, line 446 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },
  {
    id: "aeneid-9-ascanius-first-kill",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "Ascanius bids \u2019em be conducted in",
    anchorOccurrence: 1,
    title: "Ascanius's first kill — a boy becomes a man",
    quotedPassage:
      "Ascanius bids 'em be conducted in…",
    passageReference: "Book IX, line 307 ff. (Dryden) · Aeneid IX.590–637",
    commentary: `Ascanius, Aeneas's young son, fights in Book IX for the first time. His target is Numanus Remulus, an Italian who has been shouting insults at the Trojans from the wall — calling them eastern dandies with perfumed hair. Ascanius, stung, prays to Jupiter and shoots an arrow. Jupiter sends thunder in assent. The arrow goes through Remulus's head.

Virgil then has Apollo descend and address Ascanius directly: *macte novā virtūte, puer, sīc ītur ad astra* — "bless you for this new valor, boy; thus one goes to the stars." The god tells him to keep fighting and to stop fighting, in sequence — Ascanius is too young for war. Apollo whisks him back out of combat.

The scene is one of the book's tonally complicated moments. Ascanius's first kill is celebrated (he has inherited his father's martial ability) and curtailed (he is too young to stay in the fight). The double gesture — *macte virtute / sic itur ad astra* followed by "stop, go back" — is a piece of Roman coming-of-age ritual compressed into four divine lines. The boy is initiated and protected in the same breath.

The line *sic itur ad astra* entered the language as a motto. It is the Aeneid's optimistic formula for civic valor and is inscribed on countless war monuments.`,
    crossReferences: [],
    tags: ["historical", "mythological", "linguistic"],
  },
  {
    id: "aeneid-9-pandarus-bitias",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "Pand\u2019rus and Bitias, thunderbolts of war",
    anchorOccurrence: 1,
    title: "Pandarus and Bitias — the gate opened in error",
    quotedPassage:
      "Pand'rus and Bitias, thunderbolts of war…",
    passageReference: "Book IX, line 914 ff. (Dryden) · Aeneid IX.672–818",
    commentary: `Two giant Trojan brothers, Pandarus and Bitias, against orders throw open the gate to invite battle. Italian troops pour in; the Trojan camp is on the brink of falling. Turnus himself enters and wreaks havoc. Pandarus, realizing the catastrophe, slams the gate closed with Turnus already inside. Turnus is now alone in the Trojan camp, surrounded but deadly.

The scene is one of the poem's most effective pieces of tactical-chaos writing. A reckless gesture (opening the gate) produces a cascading disaster that the reckless parties try to contain by an equally reckless counter-gesture (closing the gate with the enemy inside). Turnus, trapped, fights his way through the camp killing Trojans. When he can fight no further, he leaps into the Tiber and swims back to his own lines.

Virgil is writing this with deliberate Homeric echo: Turnus's one-man aristeia inside the Trojan camp mirrors Hector's run at the Greek ships in Iliad XV. But Virgil's scene is also comic in places — the ridiculous Bitias falling like a tower, the oversized warriors, Turnus's near-escape by swimming. The book's tonal register is not tragic but energetic; the tragedy is reserved for Nisus and Euryalus.`,
    crossReferences: [
      {
        type: "source",
        description: "Hector's aristeia inside the Greek ships in Iliad XV is the model for Turnus's one-man rampage inside the Trojan camp. The Iliadic scene is catastrophic; Virgil's is chaotic but reversible.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XV (Hector at the ships)",
        targetBookId: "the-iliad",
        targetChapterNumber: 15,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },
  {
    id: "aeneid-9-tiger-simile",
    bookId: "the-aeneid",
    chapterNumber: 8,
    anchorText: "Like a fierce tiger pent amid the fold",
    anchorOccurrence: 1,
    title: "The tiger simile — Turnus trapped",
    quotedPassage:
      "Like a fierce tiger pent amid the fold.",
    passageReference: "Book IX, line 986 (Dryden) · Aeneid IX.730–755",
    commentary: `Virgil compares Turnus, trapped in the Trojan camp surrounded by enemies, to a tiger caught in a sheepfold. The simile is exact: an animal that has broken in to slaughter finds itself enclosed, unable to get back out, made more dangerous by the enclosure but also doomed by it. Dryden's version is spare; the Latin is more compressed.

The simile is one of Virgil's subtle ethical moves. Turnus is still the enemy, and the tiger image is not flattering. But the framing — a predator made trapped by its own momentum — is sympathetic. Turnus is not being described as a monster; he is being described as a hunter whose plan has collapsed. The predator-in-the-fold image holds terror and pity at once. Virgil writes Turnus with the sympathy the Iliad reserves for Hector — and more than that, because Virgil's Turnus is the antagonist of the poem he is in, and Virgil gives him tragic dignity anyway.

The full arc: Turnus will escape this trap (by swimming), will kill Pallas in Book X, and will die in Book XII. Each of these moments is prepared. The tiger in the fold is the mid-book image.`,
    crossReferences: [],
    tags: ["literary-influence", "philosophical"],
  },
]
