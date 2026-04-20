import type { Annotation } from "../types"

// ── Aeneid Book XII — hand-authored scholarly annotations ───────────────
// John Dryden's 1697 heroic couplets. Anchors line-exact against
// public/content/the-aeneid/ch-11.json.
//
// Book XII is the Aeneid's climactic book — Turnus and Aeneas meeting in
// the duel that ends the poem. Virgil writes it as a deliberate rewriting
// of Iliad XXII (Achilles v. Hector); the formal echoes are constant and
// precise. The book contains Juno's settlement with Jove (she accepts
// Rome's founding on the condition that the Trojans lose their name), the
// nightmare-simile (Virgil's most famous image for paralyzed dread), the
// Pallas-belt reversal, and the killing of Turnus — the Aeneid's final
// image, which scholarly tradition has debated for two thousand years.
//
// Density: 13 annotations. The penultimate annotation is dedicated to the
// live scholarly debate about the killing of Turnus; the spec is explicit
// that we must honor the ambiguity without flattening in either direction.

export const AENEID_BOOK_12: Annotation[] = [
  // ── 1. The opening — Turnus as the doomed Iliadic warrior ──────────────
  {
    id: "aeneid-12-turnus-stand",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "When Turnus saw the Latins leave the field",
    anchorOccurrence: 1,
    title: "Turnus alone — the doomed hero's last stand",
    quotedPassage:
      "When Turnus saw the Latins leave the field, / Their armies broken, and their courage quell'd, / Himself become the mark of public spite, / His honour question'd for the promis'd fight…",
    passageReference: "Book XII, lines 1–4 (Dryden) · Aeneid XII.1–9",
    commentary: `Book XII opens on Turnus alone. His Rutulian allies have broken; the Latin army is collapsing; the war his side has been fighting for eleven books is clearly lost. Virgil positions him as the Iliadic warrior in the Iliadic pose — the doomed hero who chooses single combat because the alternative (continued slaughter of his people) has become unbearable.

The structural echo is with Hector in Iliad XXII.25 ff. Hector stays outside the walls of Troy after his army has retreated; he waits for Achilles. His parents beg him to come inside; he refuses. He is going to die and he knows it. Virgil's Turnus is doing the same thing in Italy twelve books later. The Aeneid is the Iliad being rewritten with the moral sympathies reassigned.

The reassignment is careful. Homer's Achilles is the poem's grieved-for hero; Homer's Hector is the tragic enemy. Virgil's Aeneas is the poem's destined hero; Virgil's Turnus is the tragic enemy. Same structural roles, inherited explicitly. But Virgil makes Turnus a more attractive loser than Hector was an attractive enemy — Turnus is young, betrothed to Lavinia, defending his homeland against an invader. The Iliadic asymmetry has been complicated. By the end of Book XII, the reader has been set up to grieve Turnus's death more than the Iliad allows its reader to grieve Hector's.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The single combat of Aeneas and Turnus is a deliberate rewriting of Iliad XXII (Achilles v. Hector). Virgil's Book XII structures itself on the Iliad's twenty-second book at the level of scene, speech, and simile. The Aeneid XII ↔ Iliad XXII cross-reference is the single most demonstrable literary-inheritance moment in the catalog.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXII (Hector's last stand)",
        targetBookId: "the-iliad",
        targetChapterNumber: 22,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 2. Turnus and Lavinia — the unglimpsed cause ───────────────────────
  {
    id: "aeneid-12-lavinia",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "Laurentum more than one Lavinia sees",
    anchorOccurrence: 1,
    title: "Lavinia — the cause who does not speak",
    quotedPassage:
      "Laurentum more than one Lavinia sees…",
    passageReference: "Book XII, line 38 (Dryden) · Aeneid XII.64–69",
    commentary: `Lavinia, the princess for whose marriage the war is being fought, is one of the strangest presences in the Aeneid. She appears in the poem only four times, speaks no dialogue at all, and is the entire casus belli. When Virgil does show her, he frames her in a simile — blushing when Turnus sees her — with no reported thought or speech. Dryden preserves the restraint; the Latin is even more reticent.

This silence is deliberate and has attracted modern feminist attention. Ursula K. Le Guin's 2008 novel *Lavinia* is a full-length response to the absence: it retells the Aeneid in Lavinia's voice, the voice the poem never gave her. Le Guin's argument, spoken by her Lavinia, is that Virgil knew he had left her silent and was uneasy about it: "He knew he had not given me enough."

Virgil's restraint can be read two ways.

**The political reading**: Lavinia is not a character because the poem is about the founding of a male line. She is a dynastic instrument, and Virgil portrays her honestly as that.
**The critical reading**: Virgil is registering — by the absence — that the war he is valorizing is being fought over a person who has no voice in the choice. The silence is itself a commentary on the Iliad-sized violence it takes to move a woman between two men's houses.

Both readings hold. The fact that a first-century poet named the absence so precisely — and that a twenty-first-century novelist could write a 300-page book filling it — tells us that Virgil knew what he was doing.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Ursula K. Le Guin's novel Lavinia (2008) is the most substantial modern response to the Aeneid from a specifically feminist frame. Le Guin retells the poem's second half from Lavinia's perspective, giving speech to the character Virgil deliberately left silent.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII (Lavinia's blush)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 3. Juturna and the broken truce ────────────────────────────────────
  {
    id: "aeneid-12-juturna",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "With anxious pleasure when Juturna view\u2019d",
    anchorOccurrence: 1,
    title: "Juturna — the nymph-sister who will not let him die",
    quotedPassage:
      "With anxious pleasure when Juturna view'd / The doubtful battle from afar renew'd… / She shoots into the press, and stops his chariot…",
    passageReference: "Book XII, lines 336–369 (Dryden) · Aeneid XII.222–310",
    commentary: `Juturna is Turnus's sister, promoted by Jupiter to divine status as a water-nymph. In Book XII, Juno sends her down to delay Turnus's death as long as the Fates will allow — a desperate rearguard action by a goddess who knows she has already lost the war. Juturna takes the form of Turnus's charioteer Metiscus, grabs the reins, and drives him around the battlefield keeping him away from Aeneas.

What she accomplishes is limited but specific: she breaks the truce that would have settled the war by single combat; she extends Turnus's life by a few hundred lines of verse; she postpones the foregone conclusion.

The scene is quietly one of the poem's saddest. Juturna is a minor goddess acting from love for her brother against the absolute command of Fate. Virgil gives her a farewell soliloquy later in the book (XII.872–886) where she laments her immortality — she has to watch Turnus die and cannot follow him. The *inability to die* becomes a tragedy. It is Virgil's rare extended treatment of the grief of the gods themselves.

The Homeric source is Thetis in Iliad XVIII, mourning Achilles as though he were already dead. But Virgil's Juturna is unilaterally active where Thetis is ceremonial; Juturna intervenes repeatedly to keep Turnus alive against Jove's express will. It is the Aeneid's most extended instance of a lesser god *resisting* the greater plan — and her resistance fails.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Thetis mourning Achilles before his death (Iliad XVIII.35–72) is the tonal template, but Juturna's active intervention to save Turnus has no Homeric precedent. Virgil invents the character-type: the immortal sibling who cannot stop the killing but can delay it.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XVIII (Thetis's lament)",
        targetBookId: "the-iliad",
        targetChapterNumber: 18,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 4. The single combat announced ─────────────────────────────────────
  {
    id: "aeneid-12-single-combat",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "And to my single virtue trust the war",
    anchorOccurrence: 1,
    title: "The single combat — an agreement the gods will break",
    quotedPassage:
      "\"Renew the truce; the solemn rites prepare, / And to my single virtue trust the war.\"",
    passageReference: "Book XII, lines 24–25 (Dryden) · Aeneid XII.19–45",
    commentary: `Turnus proposes single combat with Aeneas as the only way to end the war. Latinus tries to dissuade him; Turnus refuses; the Trojan and Italian forces draw up in formation as spectators. The arrangement is formally Homeric (Paris and Menelaus duel in Iliad III for Helen) but Virgil gives it full ritual gravity — oaths sworn on sacrificial animals, altars built, priestly language.

The agreement will not hold. Juno sends Juturna, Juturna provokes the Italian ally Tolumnius into hurling a javelin, the javelin kills a Trojan, and the battle breaks out again. The oaths are violated by divine interference. Virgil is making a specific theological observation: the formal mechanisms of peace (the oath, the sacrifice, the duel) cannot hold against a goddess who does not want them to hold. The Aeneid's universe is one in which civic ritual is fragile under the weight of divine partisanship.

This is the book's structural hinge. The war was *supposed* to end by Book XII's single combat. Because Juno breaks the truce, the war continues, Aeneas is wounded, chaos expands, and when the single combat finally happens it happens in a changed moral atmosphere — not as an agreed-upon settlement but as Turnus cornered by an enraged Aeneas after a day of avoidable slaughter. Juno's delay is what poisons the ending.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Iliad III — Paris and Menelaus duel before the walls of Troy to settle the war. The formal structure (oath, combat, expected resolution) is Virgil's template. The Homeric version ends with Aphrodite whisking Paris out of the duel; Virgil's version ends with Juno arranging that the duel not happen at all.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book III (Paris v. Menelaus)",
        targetBookId: "the-iliad",
        targetChapterNumber: 3,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "philosophical"],
  },

  // ── 5. The Boreas storm simile ─────────────────────────────────────────
  {
    id: "aeneid-12-boreas-simile",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "As when loud Boreas",
    anchorOccurrence: 1,
    title: "Boreas and the storm — Turnus at full destructive power",
    quotedPassage:
      "As when loud Boreas, with his blust'ring train, / Stoops from above, incumbent on the main, / Where-e'er he flies, he drives the rack before, / And rolls the billows on th' Aegean shore: / So, where resistless Turnus takes his course, / The scatter'd squadrons bend before his force…",
    passageReference: "Book XII, lines 542–547 (Dryden) · Aeneid XII.451–460",
    commentary: `Virgil's longest Turnus-simile and one of Book XII's set pieces. Turnus at his martial height is compared to the north wind Boreas driving storm-clouds across the Aegean — the full Homeric elevation of the warrior to cosmological scale. The simile is meant to establish Turnus as fully equal to Aeneas in martial power before the book deflates him.

Note what the simile does *not* do. It does not make Turnus pious, thoughtful, or civically useful. Boreas is impersonal destructive force; the image valorizes violence without asking what the violence is *for*. Virgil is careful about this. Turnus's virtues in Book XII are all Iliadic — courage, physical beauty, raw ability — and none of them are Virgilian. *Pietas* is not in his vocabulary. Aeneas has been called *pius* throughout the poem; Turnus has never once been called *pius*, and he is never called it here.

This is part of the setup for the poem's ending. When Aeneas and Turnus finally fight, the poem has framed them as two different orders of hero — the old Iliadic warrior-ethos and the new Roman *pietas*-ethos. The killing that ends the book is the newer ethos ending the older one, and whether that ending is a triumph or a catastrophe is what the Book XII closing annotations have to address.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The warrior-as-storm-wind simile is Homeric (Iliad XII.40 — Hector 'like a rushing storm-wind,' and elsewhere). Virgil preserves the Homeric elevation but leaves out the Homeric attention to whose side the warrior is on. Turnus is destructive force; the simile does not tell us whether that force is just.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XII (Hector's attack)",
        targetBookId: "the-iliad",
        targetChapterNumber: 12,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 6. Juno's surrender — the condition of peace ───────────────────────
  {
    id: "aeneid-12-juno-surrender",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "Meantime imperial Jove to Juno spoke",
    anchorOccurrence: 1,
    title: "Juno's settlement — Rome may be founded, but not under Troy's name",
    quotedPassage:
      "\"Because your dread decree too well I knew, / From Turnus and from earth unwilling I withdrew…\" / \"This let me beg (and this no fates withstand) / Both for myself and for your father's land, / That, when the nuptial bed shall bind the peace, / (Which I, since you ordain, consent to bless,) / The laws of either nation be the same; / But let the Latins still retain their name, / Speak the same language which they spoke before, / Wear the same habits which their grandsires wore. / Call them not Trojans: perish the renown / And name of Troy, with that detested town.\"",
    passageReference: "Book XII, lines 1145–1202 (Dryden) · Aeneid XII.791–842",
    commentary: `The theological climax of the whole poem. Jupiter, watching Juno sustain Turnus in combat against the Fates' settled order, calls her to account. Juno replies that she has already conceded the war is over — she withdrew Juturna reluctantly, she accepts the Trojan victory. But she has one condition. The Latins must keep their name, their language, and their customs. The Trojans who have won the war must *vanish into the Latins they conquered*. Rome can be founded; Troy cannot survive it.

Jupiter agrees. *Sermōnem Ausonium patrium mōrēsque tenēbunt* — "they shall keep the Ausonian tongue and their ancestral customs." The Trojans, Jupiter promises, "will forget from whence they came."

This is one of the Aeneid's quietest and strangest resolutions. Juno has fought twelve books against the founding of Rome. When she finally surrenders, her surrender is conditional, and the condition is that the civilization founded will not *be Trojan*. The Trojans will be absorbed; the Italians will keep their identity. Rome is the outcome; but by Juno's surrender-terms, Rome is really just *Italy with new genes*. The Trojan inheritance that the whole poem has been a vessel for — the household gods, the Penates, the name of Troy — is partially dissolved into the Latin settlement.

Modern scholars read this as one of the poem's most sophisticated political acts. Virgil is writing under Augustus, whose house (the Julian gens) claimed descent from Aeneas via Iulus/Ascanius. To say that Trojans "become" Latins is to honor the Augustan propagandic claim while also registering that Rome is Italian in its deeper identity — a compromise between the imperial mythology and the local pride of actual Italians. Virgil is threading a political needle with theological thread.

The settlement also means Juno's *memor ira* (unforgetting wrath) from Book I is not resolved — it is absorbed. She does not forgive; she accepts a peace on terms. The Aeneid does not end on reconciliation; it ends on negotiated coexistence, which is not the same thing.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "The Juno settlement is the theological hinge back to the Book I annotation on saevae memorem Iunonis iram. Book I named Juno's wrath as the poem's engine; Book XII shows that wrath accommodated rather than removed. The circular argument is one of Virgil's most careful pieces of structural engineering.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I (saevae Iunonis ira) ↔ Book XII (the settlement)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 0,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical", "mythological"],
  },

  // ── 7. The nightmare simile ────────────────────────────────────────────
  {
    id: "aeneid-12-nightmare-simile",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "Once more he pauses",
    anchorOccurrence: 1,
    title: "The nightmare simile — cannot run, cannot speak",
    quotedPassage:
      "Once more he pauses, and looks out again, / And seeks the goddess-charioteer in vain. / Trembling he views the thund'ring chief advance, / And brandishing aloft the deadly lance: / Amaz'd he cow'rs beneath his conqu'ring foe, / Forgets to ward, and waits the coming blow. / As when in dreams the struggling tread of feet, / We seem, but cannot their full course complete; / Our tongue cleaves to the palate, we would cry, / But our fix'd voice forsakes us in th' essay…",
    passageReference: "Book XII, lines 1325–1343 (Dryden) · Aeneid XII.903–914",
    commentary: `The most-imitated psychological simile in European literature. Turnus, outmatched by the divine armor Aeneas now wears, tries to run. His legs will not obey him. Virgil compares him to a sleeper in a nightmare: trying to run, feet won't move; trying to cry out, tongue cleaves to the palate. Dryden captures both halves — the paralysis and the silence.

This is one of the very few moments in classical epic where the narrator reaches directly into the interior experience of terror. The Iliadic dying-warrior scene is usually external — wounds, limbs, the shade fleeing to Hades. Virgil's Turnus is interior: his body will not do what he tells it to do. The simile has been studied by every generation of readers because it is *psychologically precise* in a way classical heroism usually refuses to be. Turnus is not being physically overmatched; he is being mentally paralyzed. The nightmare is real.

The simile also does crucial moral work. By shifting from exterior combat to interior dread, Virgil makes Turnus sympathetic in the final moment. Hector in Iliad XXII runs around the walls of Troy three times in Homer; Virgil's Turnus does not run — he *cannot*. The inability is the pathos. Every reader who has ever tried to run in a dream is, for these ten lines, identified with the enemy Aeneas is about to kill.

This is the simile that ruins any simple reading of the Aeneid's ending. Virgil has placed an unforgettable interior image of paralysis thirty lines before the killing. The reader who gets to the sword-stroke has already been *inside Turnus's head*. Whatever happens next is happening to someone the reader has shared consciousness with.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The dream-paralysis simile has been quoted and imitated in every subsequent European literary tradition. Coleridge cites it in a letter; Keats's 'Hyperion' fragment reaches for it; Auden's 'The Quest' poems work from Virgil's interiorized terror. It is one of the few ancient passages that survives as a formal tool modern writers still use.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, lines 908–914 (Latin)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic", "philosophical"],
  },

  // ── 8. Turnus's plea — "If mercy may be shown" ─────────────────────────
  {
    id: "aeneid-12-turnus-plea",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "Yet think, O think, if mercy may be shown",
    anchorOccurrence: 1,
    title: "Turnus pleads — the moral hinge",
    quotedPassage:
      "\"Yet think, O think, if mercy may be shown— / Thou hadst a father once, and hast a son; / Pity my sire, now sinking to the grave; / And, for Anchises' sake, old Daunus save! / Or, if thy vow'd revenge pursue my death, / Give to my friends my body void of breath! / The Latian chiefs have seen me beg my life; / Thine is the conquest, thine the royal wife: / Against a yielded man, 'tis mean ignoble strife.\"",
    passageReference: "Book XII, lines 1351–1359 (Dryden) · Aeneid XII.930–938",
    commentary: `Turnus, speared and on his knees, speaks his last speech. It is the moral hinge of the poem. He pleads two things:

**First, pity for his father Daunus.** Turnus invokes Aeneas's love for Anchises, knowing Aeneas carries his father on his back out of Troy in Book II and descends to Elysium to find him in Book VI. The *pietas* that has been Aeneas's signature virtue is precisely what Turnus is asking him to extend — spare me, he is saying, because your own father would have wanted you to.

**Second, honorable surrender.** Turnus acknowledges defeat. "Thine is the conquest, thine the royal wife." He is giving up Lavinia, giving up the war, giving up his pride. The ethical frame is explicit: a yielded man should not be killed. This is a Homeric frame (compare Lycaon's surrender to Achilles in Iliad XXI, which ends with Achilles killing him anyway) but invoked here to the Roman-ethos hero.

The speech is calibrated to work. Virgil gives Turnus the best possible argument he could give. He names Anchises specifically. He offers the surrender that Roman military ethics technically required a commander to accept. He is asking for the Roman virtue, from the Roman hero, in the language the Roman reader recognizes. The book is building the moment of mercy at which Aeneas might have proven his *pietas* fully — sparing an enemy, founding Rome on an act of clemency rather than an act of vengeance.

And then Virgil takes the mercy away. The next anchor is what Aeneas sees on Turnus's shoulder — the sword-belt Turnus stripped from Pallas's corpse in Book X — and the mercy ends.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Lycaon's plea to Achilles in Iliad XXI.74–96 is the Homeric template. Lycaon begs for his life; Achilles refuses, noting that Patroclus died and so did many better men. Turnus's plea is structurally the same; Aeneas's refusal is morally worse, because Turnus's surrender is honorable and Turnus's offer of terms is accepted.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXI (Lycaon's plea)",
        targetBookId: "the-iliad",
        targetChapterNumber: 21,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 9. The belt of Pallas — the trigger ────────────────────────────────
  {
    id: "aeneid-12-pallas-belt",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "From dying Pallas, and in triumph wore",
    anchorOccurrence: 1,
    title: "The belt — Pallas seen on Turnus's shoulder",
    quotedPassage:
      "In deep suspense the Trojan seem'd to stand, / And, just prepar'd to strike, repress'd his hand. / He roll'd his eyes, and ev'ry moment felt / His manly soul with more compassion melt; / When, casting down a casual glance, he spied / The golden belt that glitter'd on his side, / The fatal spoils which haughty Turnus tore / From dying Pallas, and in triumph wore.",
    passageReference: "Book XII, lines 1360–1367 (Dryden) · Aeneid XII.938–947",
    commentary: `The moral pivot of the whole poem. Aeneas is about to spare Turnus. Dryden writes his hesitation plainly: "his manly soul with more compassion melt." The Latin has the same motion — *cunctantem* (hesitating), *iam iamque magis* (more and more) he was being moved toward mercy. For a moment the Aeneid is about to end on clemency.

Then Aeneas sees the sword-belt. In Book X, Turnus had killed Pallas — Evander's young son, entrusted to Aeneas's care — and stripped the belt from the corpse, wearing it since as a trophy. Pallas was dear to Aeneas; his death in Book X is one of the poem's private catastrophes. The belt on Turnus's shoulder is the sight that reverses the hesitation.

Virgil is very precise about what Aeneas sees and what it does. *Saevī monumenta dolōris* — "reminders of savage grief." The Latin word *saevī* (savage, cruel) is the same word used to describe Juno's wrath in Book I (*saevae Iunonis*). The grief that now rises in Aeneas is the same register — accumulated, remembered, vindictive — that has driven the poem's antagonist. In this moment Aeneas is Juno.

Then Aeneas's speech: "Shalt thou, who wearest the spoils of my friend, escape? *Pallas, Pallas immolates thee with this blow* — Pallas takes vengeance from thy criminal blood." The Latin — *Pallās tē hōc vulnere, Pallās / immolat et poenam scelerātō ex sanguine sūmit* — is explicit. Aeneas is not killing Turnus in his own name. He is killing him in Pallas's name, as a sacrificial victim (*immolat* is the sacrificial verb). The killing is framed as a religious act — an offering to a dead friend — rather than as a political or judicial decision.

Whether Virgil endorses this reframing or exposes it is the question the whole Book XII ending turns on.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Pallas's death in Book X and Turnus stripping his belt is the event on which the whole Book XII ending pivots. Virgil has been setting up this moment for two books — the belt as memento is a long narrative fuse.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book X (Pallas's death, lines 479–506 Latin)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 9,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "mythological", "literary-influence"],
  },

  // ── 10. The killing of Turnus — the single most debated ending ─────────
  {
    id: "aeneid-12-killing-turnus",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "Deep in his bosom drove the shining sword",
    anchorOccurrence: 1,
    title: "The killing — the scholarly debate honored",
    quotedPassage:
      "He rais'd his arm aloft, and, at the word, / Deep in his bosom drove the shining sword. / The streaming blood distain'd his arms around; / And the disdainful soul came rushing through the wound.",
    passageReference: "Book XII, lines 1374–1377 (Dryden) · Aeneid XII.950–952",
    commentary: `The Aeneid ends on this sword-stroke. There is no coda, no settlement-scene, no glimpse of the peace Anchises promised in Book VI. The final line — *vītaque cum gemitū fugit indignāta sub umbrās* — is among the most debated sentences in Latin literature. Dryden's rendering ("And the disdainful soul came rushing through the wound") catches *indignāta* as "disdainful"; the Latin is sharper.

**The question the scholarly tradition has been fighting about for two millennia**: how are we supposed to read this ending?

**The "Augustan" / "optimist" reading** (Galinsky, Hardie, earlier scholars): Aeneas is punishing a defiant enemy for killing his adopted son; *pietas* demands the execution. The killing is an act of Roman justice — the poem's *debellāre superbōs* ("subdue the proud") at Book VI.853 is being applied. Rome is founded on this necessary violence. The ending is severe but not tragic.

**The "Harvard" / "pessimist" reading** (Parry, Putnam, Lyne, from the 1960s onward): Aeneas is not acting *pius* — he is acting out the *furor* (rage) that the poem has been condemning for twelve books. He refuses the mercy Turnus has earned by honorable surrender; he kills in a friend's name rather than his own; the final word *indignāta* ("in indignation" / "unreconciled") belongs to Turnus's departing soul, not to Aeneas's triumph. The poem ends on an ethical failure by its own hero. Rome is founded on an act the poem has taught us to condemn.

**The "two voices" reading** (Parry 1963, expanded in much subsequent work): both readings are in the text simultaneously. The poem contains a public voice (the Augustan) and a private voice (the anti-Augustan), and the reader hears both. The killing is justified by the public ethic and indicted by the private one. Virgil refuses to resolve.

The spec for this ingestion explicitly asks us not to flatten. The honest annotation — and the one I want to make — is that after two thousand years of Aeneid criticism no dominant consensus exists. Servius in the fourth century did not settle it. Dante, who revered Virgil, placed him in Limbo rather than Paradise in part because the Aeneid's ethic was not Christian enough. T. S. Eliot, in 1944, called Virgil "our classic" and defended the ending as severe *pietas*. W. H. Auden, in 1959, called the ending Virgil's "secondary epic" moment — the moment the poet sold his soul to the regime. The argument is live.

What the Tome reader should take away is that the killing is *designed* to be hard. Virgil has set up every possible reason to spare Turnus (the nightmare simile, the plea, the invocation of Anchises), then has the belt arrive to reverse the mercy. The reversal is engineered, not accidental. Virgil wants the reader to feel the exact ethical weight of the sword going in. Whether you then conclude the poem is endorsing or criticizing the stroke is the poem asking you a question, not telling you the answer.

One more formal note. *Vītaque cum gemitū fugit indignāta sub umbrās* — "and life, with a groan, fled indignant to the shades" — is the line. It is almost identical to a line Virgil used in Book XI (at Aeneid XI.831) to describe the death of Camilla. Camilla, another enemy, dies with *the same line*. The repetition is deliberate. Virgil has written the ending of his poem in a formula he has already used, for another young warrior, also killed by the winning side. The formula is his way of marking that this death is not unique — it is the universal death of the defeated. The Aeneid ends on a formula for every death every conquered people will suffer at Rome's hands from Camilla's Volsci through Carthage and onward.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The Harvard school's pessimist reading begins with Adam Parry's 1963 essay 'The Two Voices of Virgil's Aeneid' and continues through Michael Putnam's Poetry of the Aeneid (1965), W. R. Johnson's Darkness Visible (1976), and R. O. A. M. Lyne's Further Voices in Vergil's Aeneid (1987). The optimist counter-tradition is represented by Karl Galinsky's Augustan Culture (1996) and Philip Hardie's Virgil's Aeneid: Cosmos and Imperium (1986). Both traditions are live; do not choose for the reader.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book XII, line 952 (Latin) — vitaque cum gemitu fugit indignata sub umbras",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "The Iliad ends on Book XXIV's funeral of Hector — Priam ransoms his son's body; Achilles weeps; the poem closes on a scene of recognition and shared grief between enemies. The Aeneid does NOT end that way. The killing is not followed by a reconciliation scene. The comparison is central: the Iliad ends on empathy across the killing; the Aeneid ends on the killing itself, with no epilogue.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXIV (Priam and Achilles)",
        targetBookId: "the-iliad",
        targetChapterNumber: 24,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },

  // ── 11. Indignata — the last word ──────────────────────────────────────
  {
    id: "aeneid-12-indignata",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "disdainful soul",
    anchorOccurrence: 1,
    title: "Indignata — the word Virgil chose for his last image",
    quotedPassage:
      "The streaming blood distain'd his arms around; / And the disdainful soul came rushing through the wound.",
    passageReference: "Book XII, line 1377 (Dryden) · Aeneid XII.952",
    commentary: `A note on Virgil's final Latin word: *indignāta*. Dryden gives us "disdainful"; the Latin is a participle with a more precise meaning — "having been made indignant," "refusing to accept what has happened."

The word is *not* neutral. Virgil could have written *maesta* (sorrowful) or *tristis* (sad) or a dozen other adjectives that would have made Turnus's death a simple matter of pathos. He chose *indignāta* — a word that implies active unreconciledness. Turnus's soul is not just leaving the body; it is going out *furious*.

The word is also Turnus's final act of agency. He has begged, been refused, been killed, and his soul is still, even at the moment of dissolution, registering that what has happened was wrong. Virgil closes the poem on the victim's refusal to accept the killing that was done to him. This is a remarkable editorial choice for a poem that has been — in large part — an imperial commission.

Comparative note: Homer's Hector in Iliad XXII.362–363 dies similarly: his soul flies to Hades *androtēta kai hēbēn* — "mourning his lost youth and manhood." The *indignāta* is Virgil's Roman-Latin answer to Homer's Greek. Both poems end their tragic enemy's death on an interior state not of peace but of grief-at-the-loss. But Homer follows Hector's death with a funeral scene and reconciliation; Virgil follows Turnus's death with *nothing*. The *indignāta* is the last interior state in the poem.

This matters for any reading of the ending. The final word is not Aeneas's; it is Turnus's. The poem's Augustan hero has the sword; the poem's enemy has the last word. Virgil closes on the defeated consciousness, not on the victor's celebration. For anyone trying to read the Aeneid as straightforward imperial endorsement, this last word is a problem. *Indignāta* was Virgil's choice, and he did not soften it.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The Latin echoes and answers Iliad XXII.362–363 (Hector's soul, 'mourning his lost youth and manhood'). Homer ends his scene with the soul's interior state; Virgil ends his WHOLE POEM there. The narrowing of frame is the Aeneid's signature move — Homer's last word was his poem's next-to-last scene; Virgil's last word IS his last word.",
        workTitle: "The Iliad",
        workAuthor: "Homer",
        passageReference: "Book XXII, lines 362–363",
        targetBookId: "the-iliad",
        targetChapterNumber: 22,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "philosophical"],
  },

  // ── 12. No coda — the missing epilogue ─────────────────────────────────
  {
    id: "aeneid-12-missing-coda",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "The streaming blood distain\u2019d his arms around",
    anchorOccurrence: 1,
    title: "The missing epilogue — why the Aeneid ends here",
    quotedPassage:
      "The streaming blood distain'd his arms around; / And the disdainful soul came rushing through the wound.",
    passageReference: "Book XII, lines 1376–1377 (Dryden) · Aeneid XII.952 (last line)",
    commentary: `The Aeneid ends on this line. There is no Book XIII. Some scholars have argued the poem is unfinished — Virgil died in 19 BC having asked (probably apocryphally) for the manuscript to be burned; Augustus's literary executors Tucca and Varius published it with some light editing. Perhaps a Book XIII was planned, covering Lavinia's marriage, Aeneas's kingship, the founding of Lavinium.

The weight of scholarly opinion is that the ending is intentional. Virgil is not missing a final chapter; he has chosen to end on the killing, with no reconciliation, no marriage, no city. Compare what the poem has foreshadowed and does not deliver:
- The wedding of Aeneas and Lavinia (promised throughout Books VII–XII) — not shown.
- The founding of Lavinium (promised in Book I by Jove, Book VI by Anchises) — not shown.
- Aeneas's death and reception among the gods (implied as the telos of his life) — not shown.
- Any reconciliation of Lavinia with her mother Amata (who has just committed suicide) — not shown.

The poem is rich with future events promised in futures that the poem then refuses to narrate. The structural choice to end on the sword-stroke is Virgil placing the weight of the entire future Rome's foundation on an act of violence that the reader has just been taught to question.

A single comparative observation. The Odyssey also ends on a sudden, political settlement (Athena stops the civil war on Ithaca in Book XXIV with a direct command). But Homer shows the settlement; the poem ends on peace. Virgil has Aeneas's stroke, and then silence. Whatever peace follows is in a future the poem does not choose to write.

This is not a technical oversight. It is Virgil's deepest editorial argument about his own poem.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "The Odyssey ends on Book XXIV's settlement — Athena commands peace, Odysseus consents, the civil disturbance on Ithaca ends. Homer's poem closes on a reconciliation scene. The Aeneid refuses the equivalent move. The contrast is load-bearing: Homer ends on peace, Virgil ends on the wound.",
        workTitle: "The Odyssey",
        workAuthor: "Homer",
        passageReference: "Book XXIV (the settlement)",
        targetBookId: "the-odyssey",
        targetChapterNumber: 24,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "literary-influence"],
  },

  // ── 13. Dante, Eliot, Heaney — how Book XII has been read ──────────────
  {
    id: "aeneid-12-reception-history",
    bookId: "the-aeneid",
    chapterNumber: 11,
    anchorText: "'Tis Pallas, Pallas gives this deadly blow",
    anchorOccurrence: 1,
    title: "How later poets have read this killing",
    quotedPassage:
      "\"'Tis Pallas, Pallas gives this deadly blow.\"",
    passageReference: "Book XII, line 1373 (Dryden) · Aeneid XII.948",
    commentary: `A short annotation on reception. Three important readings of the Book XII ending from the European tradition:

**Dante (c. 1308–1320).** Dante places Virgil in Limbo in Inferno IV — the highest circle of Hell, the place for virtuous pagans who lacked the revelation of Christ. Limbo is a mild punishment but a permanent one. The placement is Dante's considered judgment on the Aeneid. Virgil's ethical vision, as magnificent as Dante found it, could not accomplish salvation as Dante understood it. The Book XII ending — violence as resolution, no forgiveness scene — is part of what Dante was responding to. Dante's own *Commedia* will end on *universal* reconciliation (the Empyrean, the Rose, the vision of God), a direct counter-response to the Aeneid's refusal to grant reconciliation to Turnus.

**T. S. Eliot (1944).** In "What Is a Classic?" Eliot defends the Aeneid as the exemplary classic of European civilization. His reading of the ending is severe *pietas*: Aeneas kills because he must, because the founding of Rome requires it, because *pietas* is precisely the willingness to do the hard thing for the future. Eliot's frame is mid-twentieth-century Christian humanism; he finds the Aeneid more morally mature than the Iliad precisely because it treats violence as regrettable rather than glorious. The ending is not a failure but an austere victory.

**Seamus Heaney (2016).** In his posthumous *Aeneid VI* translation, Heaney translates only Book VI — the descent to Anchises — and leaves the rest of the poem aside. The choice is itself a commentary. Heaney came from Northern Ireland at the end of the Troubles and was acutely alive to civil violence as a founding condition. His refusal to translate Book XII (he had translated the opening sections earlier and stopped) is a modern Irish poet declining to render in his own language an ending he could not endorse. The book's last scene is so loaded that one of the twentieth century's finest translators of classical verse chose to leave it alone.

The reception history — Dante declining salvation to Virgil, Eliot naming the severity as the virtue, Heaney refusing to render the ending into his own idiom — is itself a kind of argument. Book XII is not a settled text. It has been the site of two thousand years of European ethical self-examination, and it will go on being one.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Dante places Virgil in Limbo (Inferno IV) — his highest non-saved rank. The placement is Dante's considered ethical response to the Aeneid's ending. Virgil gets Limbo, not Paradise, in part because his poem's ethic of founding-through-violence is not reconcilable with Dante's Christian ethic of universal reconciliation. The Inferno IV placement is a reading of Aeneid XII.",
        workTitle: "Inferno",
        workAuthor: "Dante",
        passageReference: "Canto IV (Limbo)",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical", "historical"],
  },
]
