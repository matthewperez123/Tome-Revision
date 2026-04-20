import type { Annotation } from "../types"

// ── Aeneid Book I — hand-authored scholarly annotations ─────────────────
// John Dryden's 1697 heroic couplets (Standard Ebooks edition). Anchors
// are line-exact against the transformed HTML in
// public/content/the-aeneid/ch-0.json (data-aeneid-line="N").
//
// Book I covers: the poem's invocation and plot-frame (Juno's wrath),
// the storm and Neptune's rebuke, Aeneas's shipwrecked lament, Venus's
// appeal to Jove and Jove's prophecy of Rome, the meeting with Venus
// disguised as a huntress on the Libyan shore, the cloud-enveloped walk
// into rising Carthage, Dido's reception, and Venus's plot to have
// Cupid (in Ascanius's shape) kindle Dido's love at the banquet.
//
// Density target per the Aeneid spec: 12–16 annotations per book (higher
// than Iliad/Odyssey because Virgil is more allusive and more politically
// specific). This set is 14.

export const AENEID_BOOK_1: Annotation[] = [
  // ── 1. Arma virumque cano — the opening ─────────────────────────────────
  {
    id: "aeneid-1-arma-virumque",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Arms, and the man I sing",
    anchorOccurrence: 1,
    title: "Arma virumque cano — the opening",
    quotedPassage:
      "Arms, and the man I sing, who, forc'd by fate, / And haughty Juno's unrelenting hate, / Expell'd and exil'd, left the Trojan shore.",
    passageReference: "Book I, lines 1–3 (Dryden) · Aeneid I.1–3",
    commentary: `The most famous opening in Latin poetry. *Arma virumque canō* — "Arms and the man I sing" — is Virgil consciously naming his double project in his first three words. *Arma* is the Iliad (war, weapons, the siege of a city); *virum* is the Odyssey (a single man and his wanderings). Virgil is announcing, on word one, that he is going to write both Homeric poems at once, and that the order is reversed: Aeneas's Odyssey (Books I–VI) comes before his Iliad (Books VII–XII). The compressed double-claim is itself the literary program.

Dryden's "Arms, and the man I sing" preserves the Latin word order exactly — *arma* first, *virum* second, *canō* last — at a cost of sounding slightly archaic in English. Conington's prose flattens it ("Of arms I sing, and of the man..."); Fagles in 2006 reverted to Dryden's order ("Wars and a man I sing..."); Heaney in *Aeneid VI* (2016) chose "I sing of arms and a man." Every translator registers the same small decision: do you move the verb earlier to read as English, or keep *canō* last to preserve Virgil's self-conscious first-word weight on the thing being sung?

The annotation worth carrying forward: this is the line from which every later epic measures itself. Milton opens *Paradise Lost* with a deliberate answering move — "Of man's first disobedience..." — where *man* is now first and *arma* absent. The whole argument of Milton's poem is encoded in that word-order.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Virgil's opening deliberately inverts Homer. The Odyssey begins 'Tell me, O Muse, of that sagacious man' — the wandering hero is first. The Iliad begins 'Sing, goddess, the anger of Achilles' — the martial subject is first. Virgil fuses the two into Arma virumque — war and man in a single breath.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book I, line 1",
        targetBookId: "the-odyssey",
        targetChapterNumber: 1,
        targetAnchorText: "Tell me, O Muse, of that sagacious man",
      },
      {
        type: "echo",
        description:
          "Milton's answer to Virgil — 'Of Man's first disobedience' — rearranges the same double-claim. Where Virgil gives arms priority of subject, Milton gives man priority and displaces war to the poem's interior (the War in Heaven of Book VI). The inversion is the whole argument.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I, lines 1–2",
        targetBookId: "paradise-lost",
        targetChapterNumber: 0,
        targetAnchorText: "Of Man’s first disobedience",
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 2. Saevae memorem Iunonis ob iram — Juno's wrath as plot-engine ────
  {
    id: "aeneid-1-iunonis-iram",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "haughty Juno\u2019s unrelenting hate",
    anchorOccurrence: 1,
    title: "Saevae memorem Iunonis ob iram — Juno's unforgetting wrath",
    quotedPassage:
      "Arms, and the man I sing, who, forc'd by fate, / And haughty Juno's unrelenting hate, / Expell'd and exil'd, left the Trojan shore.",
    passageReference: "Book I, line 2 (Dryden) · Aeneid I.4",
    commentary: `The Latin — *saevae memorem Iūnōnis ob īram* — is line 4 of the poem: "because of cruel Juno's unforgetting wrath." *Memor* ("remembering") is the load-bearing word. Juno's anger is not an impulse; it is an accumulated, curated archive of grievances, and Virgil names this as the cause that drives twelve books of plot. The Judgment of Paris, the Trojan-descended Romans who will one day destroy her Carthage, the rape of Ganymede — every slight is on the ledger.

The structural echo is with the Iliad's first word, *mēnis* (wrath) — but Achilles's wrath resolves in twenty-four books. Juno's wrath does not resolve. The poem closes in Book XII with Jove negotiating her surrender, and she accepts only on the condition that the Trojans relinquish their name and language — a partial victory for her *memor* anger even as Rome is allowed to be founded. The wrath does not end; it is absorbed.

Dryden's "haughty" is a little weaker than the Latin *saeva* ("savage, cruel, merciless"). The English of his period had no clean word for a theological rage that is also administratively vindictive — the quality Virgil captures is Juno as wounded queen AND Juno as persistent prosecutor. Modern translators reach for "savage" (Fagles), "relentless" (Mandelbaum), "unforgetting" (Fitzgerald).`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Iliad opens with wrath as its first word (μῆνις) and Achilles as its subject. Virgil opens with arms and man, and relegates wrath to line 4 — but gives it to a goddess rather than a mortal, and makes it unforgetting rather than resolvable. The moral machinery is restructured even as the Homeric form is reused.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I, line 1",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Juno's grievances are catalogued in Book I.25–28 (Dryden: 'the Judgment of Paris', 'Ganymede'). This annotation is the first touch-point; the fuller unpacking of memor iram is in the Book XII annotation on Jove's settlement with Juno, where her wrath is absorbed rather than resolved.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (the poem's close)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 11,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 3. Pius Aeneas (first-occurrence) ──────────────────────────────────
  {
    id: "aeneid-1-pius-aeneas",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "pious prince",
    anchorOccurrence: 1,
    title: "Pius Aeneas — the untranslatable epithet",
    quotedPassage:
      "When now the pious prince, with weary pace, / Was just arriv'd upon the fatal place...",
    passageReference: "Book I, ~line 146 (Dryden) · Aeneid I.220 ff.",
    commentary: `The first occurrence of the epithet *pius* for Aeneas, which will recur roughly twenty times across the twelve books. Dryden renders it "pious," but the English word is too narrow. *Pietas* in Latin fuses four obligations into one virtue: duty to the gods, duty to parents (above all the father), duty to country, and duty to the unborn future (the line one is founding). Aeneas carrying Anchises on his shoulders out of burning Troy while leading Ascanius by the hand is the physical emblem of *pietas*: past, present, and future generations in one figure.

This is Virgil's single deepest departure from Homer. The Iliad names Achilles *swift-footed* — a physical quality, neutral. Virgil names Aeneas *pius* — a moral quality, freighted with civic meaning. The epithet is the poem's thesis in two syllables.

The trouble the poem poses is that *pietas* is costly. Aeneas's *pietas* means he cannot stay with Dido; *pietas* is what will make him (in Book XII) kill Turnus rather than spare him. Virgil's last book leaves the question deliberately open: is *pietas* compatible with the mercy the poem has taught the reader to want? The annotation on Book XII addresses this directly. For now, the first-occurrence marker is the promise: the epithet the reader will hear twenty times is a word whose meaning the poem will, by its final page, have complicated to the point of discomfort.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Compare Achilles's epithet system in the Iliad — 'swift-footed,' 'son of Peleus,' 'godlike.' The Homeric epithets describe; the Virgilian epithet prescribes. This shift from description to moral characterization is the single clearest marker of the Aeneid's Roman (rather than Greek) literary DNA.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book I (swift-footed Achilles)",
        targetBookId: "the-iliad",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description:
          "The Book II scene of Aeneas carrying Anchises from Troy while holding Ascanius's hand is pietas as a three-generational tableau — the Aeneid's definitive image of its own titular virtue.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book II, lines 707–729 (Dryden) — the flight from Troy",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence", "philosophical"],
  },

  // ── 4. Aeolus and the opening storm — divine machinery ─────────────────
  {
    id: "aeneid-1-aeolus-storm",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "O Aeolus",
    anchorOccurrence: 1,
    title: "The bribery of Aeolus — Juno sets the plot in motion",
    quotedPassage:
      "\"O Aeolus! for to thee the King of Heav'n / The pow'r of tempests and of winds has giv'n; / Thy force alone their fury can restrain, / And smooth the waves, or swell the troubled main...\"",
    passageReference: "Book I, lines ~65 (Dryden) · Aeneid I.65–80",
    commentary: `Juno's speech to Aeolus is the Aeneid's first piece of divine machinery and a deliberate reworking of the Homeric scene in Odyssey X where Aeolus gives Odysseus the bag of winds. The structural inversion is typical of Virgil's method: in Homer, Aeolus is a generous host who *helps* the hero; in Virgil, Aeolus is a bribed functionary who *attacks* the hero. Same god, same winds, opposite moral valence.

The bribe itself is worth noting. Juno offers Aeolus the nymph Deiopea as a wife. The economy of the scene is transactional — a goddess offering divine favors to a minor god to shipwreck a fleet. Virgil is showing us a universe in which even the lesser gods have become brokers, and the high Homeric ethos of *xenia* (guest-friendship) has been displaced by a more Roman kind of divine clientela. This is the Aeneid's theological skepticism operating at the level of plot detail.

Neptune's rebuke ten lines later — "*Quos ego—!*" in the Latin, which Virgil leaves as an unfinished threat — is the poem's first glimpse of a god who is not on Juno's payroll. The fact that Jupiter himself does not intervene until much later (he speaks only at I.254, after Venus has pleaded) tells the reader that in the Aeneid the supreme god is absent-ist by design. Fate is the real sovereign; the gods are its subcontractors.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Homer's Aeolus (Odyssey X) gives Odysseus a bag of contrary winds as a gift. Virgil borrows the setting and inverts the moral: his Aeolus is bribed by Juno to unleash the winds against Aeneas. The rework is a micro-thesis for Virgil's whole method — Homeric forms, re-moralized.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book X, lines 1–108 (Bryant)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 10,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 5. Neptune calms the sea — the first extended simile ───────────────
  {
    id: "aeneid-1-first-simile",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Audacious winds",
    anchorOccurrence: 1,
    title: "Neptune's rebuke and the simile of the statesman",
    quotedPassage:
      "\"Audacious winds! from whence / This bold attempt, this rebel insolence? / Is it for you to ravage seas and land, / Unauthoriz'd by my supreme command?\"",
    passageReference: "Book I, lines ~132 (Dryden) · Aeneid I.142–156",
    commentary: `The simile that follows Neptune's rebuke — where the calming of the sea is compared to a respected elder statesman calming an angry mob — is the Aeneid's first extended simile, and its direction is telling. Homeric similes almost always compare human action to natural phenomena (warriors like lions, crowds like bees). Virgil reverses the polarity: the natural event (the ocean) is compared to a *political* one (a civic tumult quieted by auctoritas).

Virgil wrote this during the early years of the Augustan settlement, when the Roman civil wars were a recent trauma. The image of the calming statesman is not abstract — it is the Augustan political program stated in simile form. Nature is described by politics; the universe is ordered on Augustus's model. This is the kind of detail for which Virgil has been called, accurately, both a great poet and a great political propagandist — the two are not separable in him.

Later Roman epic (Lucan, Statius) reacts to this simile by reversing it again: their politics are described through unnatural, demonic natural events. The inheritance is continuous and the argument continuous with it.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "In Homer, similes cross from human action to nature. In Virgil, the first simile crosses from nature to politics. This single inversion marks the whole difference between the Greek epic tradition and the Roman.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book II, lines 87–93 (the Greek army like bees)",
        targetBookId: "the-iliad",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 6. Infelix Dido (first mention) ─────────────────────────────────────
  {
    id: "aeneid-1-infelix-dido-first",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Unhappy Dido",
    anchorOccurrence: 1,
    title: "Infelix Dido — the tragic formula prepared",
    quotedPassage:
      "Unhappy Dido! with what stinging thought...",
    passageReference: "Book I, ~line 1004 (Dryden) · Aeneid I toward close",
    commentary: `The first occurrence in the poem of the formula *infelix Dido* — "unhappy Dido," "ill-fated Dido." *Infelix* is the same word Virgil uses for the doomed and the marked-for-death elsewhere in the poem (the *infelix* Palinurus, the *infelix* Creusa). Its application to Dido from Book I forward is Virgil telling the reader, even before Book IV opens, where her story will end.

This is the Virgilian technique of *prolepsis* — narrative foreknowledge seeded into a character's epithet. Homer does something adjacent with Achilles (he calls him *short-lived* in Book I), but Virgil multiplies it and braids it into the poem's texture. When Aeneas sees Dido's shade in Elysium in Book VI, the reader has been hearing *infelix* Dido for five books; the weight is accumulated.

The annotation in Book IV will address the full Dido arc, including the scholarly debate about whether Virgil's sympathy for Dido undermines or deepens his Augustan project. For now: mark the word. Every time Dido is called unhappy in the next three books, it is the same word, and it means she is going to die.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The Book IV annotation on Dido's pyre scene carries the full weight of the infelix formula — by then, the reader has heard it multiple times and Virgil has earned the crushing effect of its final delivery.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Dante, in Inferno V, encounters Dido among the souls the lust has wrecked — and the placement is his direct response to having read Aeneid IV and VI. Dante's Virgil is the Virgil of this poem, remembering his own heroine.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto V, lines 61–62",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 7. Jove's prophecy — the Roman political program ───────────────────
  {
    id: "aeneid-1-jove-prophecy",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Daughter, dismiss thy fears",
    anchorOccurrence: 1,
    title: "Jove's prophecy — the Roman imperium announced",
    quotedPassage:
      "\"Daughter, dismiss thy fears; to thy desire / The fates of thine are fix'd, and stand entire. / Thou shalt behold thy wish'd Lavinian walls; / And, ripe for heav'n, when fate Aeneas calls...\"",
    passageReference: "Book I, lines ~254 (Dryden) · Aeneid I.257–296",
    commentary: `Jove's speech to Venus is the poem's first full statement of the Augustan political program, and a key piece of evidence for reading the Aeneid as (among other things) a foundation myth for the Principate. The prophecy runs from Aeneas through Ascanius through Romulus through Julius Caesar to Augustus himself, and it ends with the gates of war closed and the Furies bound within — a vision of the pax Augusta as the end of history.

Two careful readings are necessary. The enthusiastic reading takes Virgil at his word: the Aeneid is a poem of Roman destiny, written in good faith under Augustus's patronage, and Jove's prophecy is its climactic statement. The skeptical reading notices that the prophecy is delivered to *Venus*, the god with a personal stake in the outcome, while the events of the poem — the storm, the sack of Troy, the death of Dido, the killing of Turnus — continually register the cost paid for what Jove promises. The poem contains both readings and does not resolve them, which is why it has been readable as imperial propaganda by every empire from Charlemagne's to the British and readable as a critique of empire by poets like Auden, Heaney, and Le Guin.

A note on the line "Rome's everlasting empire": the word in the Latin is *imperium sine fine* — "empire without end." Virgil was writing under a regime that had just discovered it was possible to formalize one-man rule in perpetuity and was working out what that meant morally. The phrase cuts both ways.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Jove's parade of unborn Roman heroes here is condensed; the fuller version is Anchises's parade in Book VI, which Virgil returns to with more resolution and more ambivalence (the shade of Marcellus, dead at nineteen, ends it).",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book VI, lines 752–892 (Anchises's parade of heroes)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
      {
        type: "echo",
        description:
          "Milton answers Jove's prophecy in Paradise Lost XII, when the Archangel Michael shows Adam the history to come. Virgil's imperial teleology becomes Milton's Christian one; both poets borrow the form from each other's opposite.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book XII (Michael's prophecy)",
        targetBookId: "paradise-lost",
        targetChapterNumber: 11,
        targetAnchorText: "Nimrod",
      },
    ],
    tags: ["historical", "literary-influence", "philosophical"],
  },

  // ── 8. The cloud — Aeneas's walk into Carthage ─────────────────────────
  {
    id: "aeneid-1-cloud-scene",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Thrice happy you",
    anchorOccurrence: 1,
    title: "The cloud, the murals, and a hero made invisible",
    quotedPassage:
      "\"Thrice happy you, whose walls already rise!\" / Aeneas said, and view'd, with lifted eyes, / Their lofty tow'rs... / Amaz'd, he stands, nor more with wonder fill'd, / Than when the mother-goddess gave the shield.",
    passageReference: "Book I, lines ~437 (Dryden) · Aeneid I.437 ff.",
    commentary: `Venus wraps Aeneas and Achates in a cloud so they can walk through Carthage unseen while the city is still rising. It is one of the Aeneid's quietest but most psychologically precise scenes. Aeneas, the shipwrecked refugee, watches the Carthaginians labor — "Thrice happy you, whose walls already rise!" — and envies them. The hero destined to found Rome envies the Carthaginians for already having what he has been promised but does not yet possess.

Then he reaches the temple of Juno and sees, painted on its walls, the fall of Troy. He is a fugitive from those events. He sees himself depicted. The passage contains the line *sunt lacrimae rerum* ("there are tears in things" — Aeneid I.462), one of the most translated lines in Latin literature, and one Dryden characteristically expands out of recognition ("With what a sigh he view'd... / Our known disasters fill ev'ry place").

The scene's argument is this: Aeneas encounters the Trojan war not as a participant but as an image — the way the reader encounters the Iliad. This is metatextual Virgil at his most self-aware. The hero is invited to read his own poem's backstory as decoration on a wall in a foreign temple, and his response is to weep. The scene asks the reader to consider what it means for suffering to become, with enough time, beautiful.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Odyssey has a parallel scene in Book VIII where Odysseus weeps while the bard Demodocus sings the fall of Troy at the Phaeacian court. Homer's version is about the pain of hearing one's own story; Virgil's is about the pain of SEEING it, rendered as public art. Both are founding moments for the literary idea of self-recognition through narrative.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book VIII, lines 84–105 (Bryant)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 8,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 9. Sunt lacrimae rerum ──────────────────────────────────────────────
  {
    id: "aeneid-1-sunt-lacrimae-rerum",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Our known disasters fill ev\u2019n foreign lands",
    anchorOccurrence: 1,
    title: "Sunt lacrimae rerum — the untranslatable line",
    quotedPassage:
      "\"O friend! ev'n here / The monuments of Trojan woes appear! / Our known disasters fill ev'ry place: / See there, where old unhappy Priam stands! / Ev'n the mute walls relate the warrior's fame, / And Trojan griefs the Tyrians' pity claim.\"",
    passageReference: "Book I, lines ~459 (Dryden) · Aeneid I.462",
    commentary: `The Latin is three words: *sunt lacrimae rerum*. Literally: "there are tears of things." More loosely: "there are tears in the nature of things." More loosely still: "the world is a world of tears."

No English translator has ever been satisfied. A partial register of the attempts:

- Dryden (1697): "Ev'n the mute walls relate the warrior's fame, / And Trojan griefs the Tyrians' pity claim." (dispersed across two lines — Dryden paraphrases the sense because no compact English will carry it)
- Fagles (2006): "The world is a world of tears, and the burdens of mortality touch the heart."
- Fitzgerald (1983): "They weep here / For how the world goes, and our life that passes / Touches their hearts."
- Mandelbaum (1971): "The very tears of things…"
- Heaney (2016): "These are tears of things and the burden of mortality strikes the heart."

The trouble is that *rerum* — genitive plural of *res* — can mean "of things," "of affairs," "of the world," "of the situation," or simply "of it all." Virgil uses the ambiguity: the tears belong simultaneously to the things depicted on the walls, to the walls themselves, and to the viewer whose tears respond. Three griefs are compressed into one word, and English grammar cannot accommodate the compression.

The line is delivered as Aeneas stands in the temple of Juno in Carthage looking at murals of the Trojan War. Note the irony that will echo: he is weeping in *Juno's* temple — the goddess whose hatred destroyed Troy and wrecked his fleet. Her temple, in Dido's city, in the place where she has found (for a moment) sanctuary, is where he finds the most honest statement in the poem of what it has cost to be alive.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Tennyson wrote, of these words, 'the word tantum; sunt lacrimae rerum, et mentem mortalia tangunt, went ringing in my ears when I left the hall.' The line is one of the most quoted in Western literature, second perhaps only to Horace's 'dulce et decorum est pro patria mori.'",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, line 462 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },

  // ── 10. Dido's entrance — the first view of the queen ──────────────────
  {
    id: "aeneid-1-dido-entrance",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Trojans, dismiss your fears",
    anchorOccurrence: 1,
    title: "Dido's welcome — the queen before the tragedy",
    quotedPassage:
      "\"Trojans, dismiss your fears; my cruel fate, / And doubts attending an unsettled state, / Force me to guard my coast from foreign foes... / Who has not heard the story of your woes, / The name and fortune of your native place, / The fame and valour of the Phrygian race?\"",
    passageReference: "Book I, lines ~562 (Dryden) · Aeneid I.562–578",
    commentary: `Dido's first speech establishes her before Book IV will undo her. Three things to notice.

First, her authority. Dido addresses Ilioneus's embassy as a sovereign — a Phoenician queen who has already founded a city, administered its justice, and received ambassadors. Virgil will spend two books making us love her and then Book IV destroying her, and the tragic weight depends on this first glimpse: she is, at this moment, exactly the kind of ruler Aeneas is trying to become. She is already what his destiny is promising him.

Second, her own backstory as a refugee. She alludes ("my cruel fate, and doubts attending an unsettled state") to her flight from Tyre, her brother Pygmalion's murder of her husband Sychaeus, her founding of Carthage in exile. She and Aeneas are the same kind of figure — the ruler of a displaced people trying to build a city. The parallel is Virgil's, and he draws it explicitly.

Third, the hinge: "Who has not heard the story of your woes...?" In Latin, this is where the rest of the Aeneid first audibly gathers — Dido is about to ask Aeneas to tell her his story, which will fill Books II and III entirely. The narrative structure is Odyssean (a shipwrecked hero at a queen's court narrating his travels); the moral weight is about to be Virgilian (Dido's hospitality will become her destruction).

The annotation on Book IV completes the arc. For now: notice that the queen Virgil will destroy is a ruler of Aeneas's own type, generous on the Homeric model, and already marked (in line 712) *infelix*.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The structural template is Odyssey VI–VIII — Nausicaa and Alcinous receive the shipwrecked Odysseus, who narrates his wanderings at the Phaeacian feast. Virgil fuses Nausicaa (the princess who sees the hero from the shore) and Arete (the queen who admits him to the hall) into a single figure, Dido, and gives her tragic agency neither of the Homeric women had.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books VI–VIII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 7,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 11. Venus's conspiracy with Cupid ──────────────────────────────────
  {
    id: "aeneid-1-venus-cupid",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "My son",
    anchorOccurrence: 1,
    title: "Venus plots — the engineering of Dido's love",
    quotedPassage:
      "\"My son, my strength, whose mighty pow'r alone / Controls the Thund'rer on his awful throne, / To thee thy much-afflicted mother flies, / And on thy succour and thy faith relies... / Thou know'st, my son, how Jove's revengeful wife, / By force and fraud, attempts thy brother's life; / And often hast thou mourn'd with me his pains.\"",
    passageReference: "Book I, lines ~657 (Dryden) · Aeneid I.657–690",
    commentary: `Venus summons Cupid and asks him to take Ascanius's form at the banquet so that Dido, embracing the child, will be kindled with love for the father. Two observations, neither comfortable.

The first is that Dido's love is engineered, not chosen. The divine machinery is explicit: Cupid's enchantment is the cause, and it is Venus — Aeneas's own mother, supposedly his protector — who does the engineering. The Book IV tragedy is already being set up by the person most morally implicated in Aeneas's fate.

The second is the logic of the move. Venus's stated reason is fear that Juno will turn the Tyrians against Aeneas; binding Dido in love is insurance. But the love she engineers will destroy Dido — an enemy of Juno that Juno herself has been trying to protect, since Carthage is Juno's favored city. The scene is a small masterpiece of divine moral complication. Two goddesses are working at cross-purposes, neither good, neither evil, each protecting her own faction, and the cost of their competition falls entirely on the mortal woman between them.

This is the Aeneid's theology in miniature. The gods are not malevolent exactly; they are competitive, partial, and mortals pay for it. Virgil is writing a universe very different from the neat moral economies of later Christian epic — and, interestingly, somewhat different even from Homer's. Homer's gods can be capricious but are rarely as *businesslike* as these. The Aeneid registers divine power as a kind of structural cause, neither benevolent nor reformable, that makes human suffering inevitable.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The machinery of divine love — a god engineering a mortal's passion for plot-reasons — recurs in Apollonius Rhodius's Argonautica (Medea's love for Jason) and is almost certainly the direct source Virgil is reworking. The Carthaginian Dido episode is Virgil writing his own Apollonius.",
        workTitle: "Argonautica",
        workAuthor: "Apollonius Rhodius",
        passageReference: "Book III, lines 275–298 (Eros's arrow)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 12. Dido's libation — hospitality and tragic foreshadowing ────────
  {
    id: "aeneid-1-hospitable-jove",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "O hospitable Jove",
    anchorOccurrence: 1,
    title: "Dido's prayer to Jove Xenios — the doomed feast",
    quotedPassage:
      "\"O hospitable Jove! we thus invoke, / With solemn rites, thy sacred name and pow'r; / Bless to both nations this auspicious hour! / So may the Trojan and the Tyrian line / In lasting concord from this day combine.\"",
    passageReference: "Book I, lines ~731 (Dryden) · Aeneid I.731 ff.",
    commentary: `Dido's banquet-prayer is to Jupiter *Hospitalis* — Jove as guarantor of guest-right. The prayer is offered in good faith: she is invoking the oldest Homeric ethical institution, *xenia*, the reciprocal obligation between host and guest. At this moment she is doing everything a Greek or Trojan ideal of hospitality would require, and Virgil lets her do it unironically.

But Cupid is on the couch beside her, wearing the face of Ascanius. Her prayer is spoken through an enchantment she has not consented to. Virgil is showing us a sacred speech-act (a prayer to Jove Xenios) rendered unreliable by divine interference. The religious form survives; the religious reality has been hollowed out by the gods themselves.

This is Virgil at his quietest and most devastating. Dido's line "bless to both nations this auspicious hour" will be ironic in Book IV (Aeneas abandons her, Carthage and Rome become mortal enemies, the Punic Wars are three centuries of answering the broken promise) and historical-apocalyptic across the whole poem (Hannibal, Scipio, the salting of Carthage's fields in 146 BC). The scene is the first moment in the poem where a character speaks in earnest about a future that the reader knows will curdle. The Aeneid does this move often. Register it here for the first time.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The broken guest-right here will echo forward to Book IV's curse — Dido, abandoned, prays Rome and Carthage will be eternal enemies. The Punic Wars (264–146 BC) are Virgil's historical audience reading this scene with full knowledge of how the xenia was violated in the end.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV, Dido's curse",
        targetBookId: "the-aeneid",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical", "philosophical"],
  },

  // ── 13. Dido asks for the tale of Troy — Books II–III cued ─────────────
  {
    id: "aeneid-1-relate-at-large",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "Relate at large",
    anchorOccurrence: 1,
    title: "The pivot to Books II–III — Dido asks for the story of Troy",
    quotedPassage:
      "\"Relate at large, my godlike guest,\" she said, / \"The Grecian stratagems, the town betray'd: / The fatal issue of so long a war, / Your flight, your wand'rings, and your woes, declare...\"",
    passageReference: "Book I, lines ~753 (Dryden) · Aeneid I.753 ff. (end of book)",
    commentary: `The last thirty lines of Book I hand Aeneas the microphone. Dido, already in love, asks him to tell the story of Troy's fall and his wanderings. Books II and III — the fall of Troy and the Odyssean travels — are Aeneas's first-person narrative to her, delivered across the banquet table.

This is a formal Homeric device. Odysseus at the Phaeacian court does the same thing in Odyssey IX–XII (his own Trojan stories and wanderings, to Alcinous and Arete). Virgil is explicitly modeling his structure on Homer's: a shipwrecked hero at a foreign court, telling his story.

But the audience is different. Odysseus tells the Phaeacians, who will deliver him safely home the next morning and are narratively unharmed by the telling. Aeneas tells Dido, whose falling in love with the man delivering the story is what will kill her. The tale itself becomes part of the instrument of her destruction — Dido falls deeper into love every night as Aeneas speaks. The frame is the same as Homer's; the moral charge is opposite.

Virgil is also making a formal signal here. Books II and III are THE most Odyssean part of the Aeneid (the man telling his wanderings at a banquet); Books IV, V, VI will pivot into something only Virgil can write. Book I ends with this handoff, and Books II–III are both an homage and a setup: the Homeric hero narrates his Iliad and his Odyssey in the first person, and it undoes the queen who is listening.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The direct structural source is Odyssey IX–XII, where Odysseus narrates his wanderings (Cicones, Lotus-eaters, Cyclops, Aeolus, Laestrygonians, Circe, the Nekyia, Sirens, Scylla/Charybdis, Helios) to the Phaeacian court across a single evening. Virgil uses the same device to cover Troy's fall (Book II) and the Trojan exile's wanderings (Book III) across Dido's banquet.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Books IX–XII",
        targetBookId: "the-odyssey",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
      {
        type: "allusion",
        description:
          "Shakespeare's Hamlet asks the Player for exactly this passage — 'Aeneas' tale to Dido, and thereabout of it especially where he speaks of Priam's slaughter' (Hamlet II.ii). The Player's speech in Hamlet is Shakespeare writing his own Aeneid Book II, registered as a baroque-age set piece.",
        workTitle: "Hamlet",
        workAuthor: "William Shakespeare",
        passageReference: "Act II, Scene 2 (the Player's speech)",
        targetBookId: "hamlet",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 14. Dido and the founding of Carthage — historical frame ───────────
  {
    id: "aeneid-1-carthage-founding",
    bookId: "the-aeneid",
    chapterNumber: 0,
    anchorText: "To found an empire in these new abodes",
    anchorOccurrence: 1,
    title: "Two founding-in-exile queens — Dido and Rome's negative image",
    quotedPassage:
      "\"O Queen! indulg'd by favour of the gods / To found an empire in these new abodes, / To build a town, with statutes to restrain / The wild inhabitants beneath thy reign...\"",
    passageReference: "Book I, lines ~522 (Dryden) · Aeneid I.522 ff. (Ilioneus's speech)",
    commentary: `Ilioneus, leading the Trojan embassy, compliments Dido on having done exactly what Aeneas is struggling to do: to arrive in a foreign land as a refugee and found a city there. Virgil is drawing the parallel unmistakably. Carthage and Rome, in this poem, are twinned projects — both founded by exiled royals of a displaced people, both under the patronage of a protective goddess (Dido by Juno, Aeneas by Venus), both civilizing their new territory with law.

The Aeneid's reader in 19 BC would have heard this parallel with a particular charge. Carthage had been destroyed by Rome in 146 BC — 127 years before Virgil finished the poem — and its fields had been salted. The site where Dido is welcoming the Trojans in the poem's narrative present was, for Virgil's contemporary reader, literal ruins. Augustus was at this very time considering its refoundation as a Roman colony (which he eventually ordered).

So the scene is not only tragic (Dido will die in four books, Carthage will be destroyed in three centuries); it is also specifically *Roman* in a way that casts ambivalence on the poem's imperial project. Rome was built on the destruction of its twin, and Virgil knows it. The sympathy he gives Dido is not despite the imperial frame but *constitutive* of it: to understand what Rome became, the reader is required to grieve for what Rome destroyed. This is what makes the Aeneid different from a simple panegyric — and what lets it survive, still read, long after its imperial project collapsed.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Trojan/Carthaginian parallel is pressed again in Book IV (Dido's curse inaugurates the Punic enmity) and in Book VI (Anchises's prophecy of Marius, Sulla, and the civil wars that follow Rome's Punic victories). Dido's city is the Aeneid's shadow-Rome throughout.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Books IV and VI",
        targetBookId: "the-aeneid",
        targetChapterNumber: 5,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "mythological", "literary-influence"],
  },
]
