// ─────────────────────────────────────────────
// Series & Character Collection Achievements
// ─────────────────────────────────────────────
// Hand-curated groupings for character series and connected
// works spanning the canonical catalog.
// All bookIds verified against data_canon_books.json.

import type { Achievement } from '@/types/achievement'

export const SERIES_COLLECTION_ACHIEVEMENTS: Achievement[] = [
  // ── Theban Plays (Sophocles) ─────────────────
  {
    id: 'theban-plays',
    slug: 'fate-of-the-labdacids',
    name: 'Fate of the Labdacids',
    description: 'Complete the Theban plays of Sophocles: Oedipus Rex, Antigone, and Ajax.',
    flavorText: 'What is destined for me, let it come.',
    sealDesignKey: 'column',
    category: 'series-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['oedipus-rex', 'antigone', 'ajax'],
    },
  },

  // ── Homeric Epics ────────────────────────────
  {
    id: 'homeric-epics',
    slug: 'the-wine-dark-sea',
    name: 'The Wine-Dark Sea',
    description: 'Complete both Homeric epics: The Iliad and The Odyssey.',
    flavorText: 'Tell me, O Muse, of that ingenious hero...',
    sealDesignKey: 'ship',
    category: 'series-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-iliad', 'the-odyssey'],
    },
  },

  // ── Nostos (Odyssey completion seal) ─────────
  // Awarded for completing the full Odyssey — the recognized homecoming
  // plot that the Greek word *nostos* names. Paired with the Master Trial
  // at chapterIndex 25 in chapter-questions.ts / odyssey-extra-trials.ts.
  {
    id: 'odyssey-nostos',
    slug: 'nostos',
    name: 'Nostos',
    description: "Complete the Odyssey's full twenty-four-book return — Calypso to the covenant.",
    flavorText: 'And now I am returned.',
    sealDesignKey: 'ship',
    category: 'single-book',
    rarity: 'rare',
    wisdomReward: 500,
    unlockCondition: { type: 'complete-book', bookId: 'the-odyssey' },
  },

  // ── Both Homers (paired-epic seal) ───────────
  // Named explicitly for the Iliad/Odyssey pairing — a higher-register
  // alias of "The Wine-Dark Sea" reserved for readers who have read both
  // and also passed the Odyssey Master Trial (Nostos).
  {
    id: 'both-homers',
    slug: 'both-homers',
    name: 'Both Homers',
    description: 'Complete the Iliad, the Odyssey, and the Odyssey Master Trial. The wrath and the return, in sequence.',
    flavorText: 'One poem ends with a funeral. The other ends with an embrace.',
    sealDesignKey: 'ship',
    category: 'series-complete',
    rarity: 'epic',
    wisdomReward: 1000,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-iliad', 'the-odyssey'],
    },
    chain: { previous: 'odyssey-nostos' },
  },

  // ── Epic Succession (three-epic seal) ────────
  // Awarded on completion of Iliad, Odyssey, and Aeneid — the canonical
  // three-epic succession Virgil constructs on Homer's shoulders.
  // Designed to stub-out; unlocks automatically when all three are read.
  {
    id: 'epic-succession',
    slug: 'epic-succession',
    name: 'Epic Succession',
    description: 'Complete the three-epic tradition: the Iliad, the Odyssey, and the Aeneid. Homer to Virgil, across seven centuries.',
    flavorText: 'Arms and the man I sing — inherited from the Muse who sang of wrath, then of return.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-iliad', 'the-odyssey', 'the-aeneid'],
    },
    chain: { previous: 'both-homers' },
  },

  // ── Pius Aeneas (Aeneid Master Trial seal) ───
  // Awarded on passing the 15-question Aeneid Master Trial (chapter
  // index 12). Paired with `the-aeneid-completed` and the thematic
  // Aeneid Master Trial arc. The unlock condition here is reading the
  // Aeneid in full; passing the Master Trial is validated by the
  // trial engine.
  {
    id: 'pius-aeneas',
    slug: 'pius-aeneas',
    name: 'Pius Aeneas',
    description: 'Complete the Aeneid and pass the Aeneid Master Trial — a fifteen-question synthesis of Juno\'s wrath, the fall of Troy, Dido, the descent to Anchises, Pallas, and Turnus.',
    flavorText: 'Sum pius Aeneas — "I am the pious Aeneas."',
    sealDesignKey: 'column',
    category: 'special',
    rarity: 'epic',
    wisdomReward: 900,
    unlockCondition: { type: 'complete-book', bookId: 'the-aeneid' },
  },

  // ── Dante's Virgil (stretch-goal seal) ───────
  // Awarded on completion of the Aeneid AND the Commedia — the
  // spec's stretch-goal trial ("Virgil's Authority Trial") is
  // scaffolded but questions not built in this ingestion. The seal
  // itself unlocks on the book-pair completion so the catalog pages
  // can point at it without the trial existing yet.
  {
    id: 'dantes-virgil',
    slug: 'dantes-virgil',
    name: "Dante's Virgil",
    description: 'Complete the Aeneid and the Divine Comedy — the full inheritance. The Latin poet becoming his own character in the Italian poem.',
    flavorText: 'Or se\' tu quel Virgilio e quella fonte / che spandi di parlar sì largo fiume?',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-aeneid', 'the-divine-comedy'],
    },
    chain: { previous: 'epic-succession' },
  },

  // ── Justify the Ways (Paradise Lost Master Trial seal) ───────
  // Awarded on completion of Paradise Lost and the fifteen-question
  // Master Trial (chapter index 12 in paradise-lost-trials.ts). The
  // seal's name comes from Milton's own stated purpose in the first
  // invocation: 'That, to the height of this great argument, / I may
  // assert Eternal Providence, / And justify the ways of God to men.'
  {
    id: 'justify-the-ways',
    slug: 'justify-the-ways',
    name: 'Justify the Ways',
    description: 'Complete Paradise Lost and pass its Master Trial — a fifteen-question synthesis of the fall of the angels, the council in Hell, the Creation, Eden, the Fall, the expulsion, and Michael\'s prophetic vision.',
    flavorText: 'That, to the height of this great argument, / I may… justify the ways of God to men.',
    sealDesignKey: 'flame',
    category: 'special',
    rarity: 'epic',
    wisdomReward: 900,
    unlockCondition: { type: 'complete-book', bookId: 'paradise-lost' },
  },

  // ── The Two Christian Epics (stretch, scaffold) ───────────────
  // Awarded on completion of BOTH Paradise Lost and the Divine
  // Comedy — the two great Christian epics of the European tradition.
  // The stretch trial (chapterIndex 13 in paradise-lost-trials.ts)
  // scaffolds three questions as a demonstration; the full question
  // set is deferred per spec Part 6.
  {
    id: 'two-christian-epics',
    slug: 'two-christian-epics',
    name: 'The Two Christian Epics',
    description: 'Complete both Paradise Lost and the Divine Comedy — the two great Christian epics that close and extend the classical line. Dante writes the vision; Milton writes the loss.',
    flavorText: 'The same Satan, differently frozen; the same Eve, differently named.',
    sealDesignKey: 'flame',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['paradise-lost', 'the-divine-comedy'],
    },
    chain: { previous: 'justify-the-ways' },
  },

  // ── Epic Succession Complete (stretch, scaffold) ──────────────
  // Awarded on completion of the full classical-to-Christian line:
  // Iliad + Odyssey + Aeneid + Paradise Lost. This extends the
  // existing 'epic-succession' three-epic seal to the four-epic
  // arc that Milton himself named in his Book IX invocation as
  // the tradition against which his poem should be measured.
  {
    id: 'epic-succession-complete',
    slug: 'epic-succession-complete',
    name: 'Epic Succession Complete',
    description: 'Complete the full classical-to-Christian epic line: Iliad, Odyssey, Aeneid, and Paradise Lost. Homer to Virgil to Milton — across twenty-six centuries.',
    flavorText: 'Argument not less but more heroic than the wrath of stern Achilles.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 2000,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-iliad', 'the-odyssey', 'the-aeneid', 'paradise-lost'],
    },
    chain: { previous: 'epic-succession' },
  },

  // ── Old Order Changeth (Idylls of the King Master Trial seal) ─────
  // Awarded on completion of Idylls of the King and the fifteen-
  // question Master Trial (chapterIndex 16 in idylls-of-the-king-
  // trials.ts). The seal's name is the cycle's signature line,
  // doubled at the opening (Arthur rising) and closing (Arthur
  // dying) — the cycle's philosophical argument about historical
  // change rendered in a single sentence.
  {
    id: 'old-order-changeth',
    slug: 'old-order-changeth',
    name: 'The Old Order Changeth',
    description: 'Complete Idylls of the King and pass its Master Trial — a fifteen-question synthesis of the cycle\'s twelve idylls, the Malory and Mabinogion sources, the Victorian moral frame, and the doubled closing line that brackets Tennyson\'s whole work.',
    flavorText: 'The old order changeth, yielding place to new, / And God fulfils himself in many ways, / Lest one good custom should corrupt the world.',
    sealDesignKey: 'flame',
    category: 'special',
    rarity: 'epic',
    wisdomReward: 900,
    unlockCondition: { type: 'complete-book', bookId: 'idylls-of-the-king' },
  },

  // ── Matter of Britain (stretch, scaffold) ─────────────────────────
  // Awarded on completion of the Arthurian cycle: Idylls of the King
  // + Le Morte d'Arthur (future catalog addition) + The Mabinogion
  // (future catalog addition). Scaffolded for when Malory enters;
  // currently only the Idylls portion is unlockable.
  {
    id: 'matter-of-britain',
    slug: 'matter-of-britain',
    name: 'The Matter of Britain',
    description: 'Complete the full Arthurian cycle in the Tome catalog — Tennyson\'s Idylls of the King and (forthcoming) Malory\'s Le Morte d\'Arthur and the Welsh Mabinogion. The three sources from which the Arthurian tradition in English is built.',
    flavorText: 'Through twelve great battles, he made a realm and reigned.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 1800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['idylls-of-the-king'],
    },
    chain: { previous: 'old-order-changeth' },
  },

  // ── Englisc — the Anglophone Epic Line ────────────────────────────
  // Awarded on completion of the full English-language epic arc:
  // Beowulf + Faerie Queene + Paradise Lost + Don Juan + Idylls of
  // the King. Roughly 900 years of English epic composition, from
  // ca. 1000 through 1885. The seal-name "Englisc" is the Old English
  // word for English speech. Originally scaffolded in beowulf-trials;
  // the fifth book (Idylls) completes the five-epic arc.
  {
    id: 'englisc',
    slug: 'englisc',
    name: 'Englisc',
    description: 'Complete the full Anglophone Epic Line: Beowulf, The Faerie Queene, Paradise Lost, Don Juan, and Idylls of the King. Five epics across 900 years of English composition — from the Old English mead-hall through Victorian moral-allegorical cycle.',
    flavorText: 'From the first Englisc song to the last Victorian idyll — the English tongue in its epic registers.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 2500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['beowulf', 'the-faerie-queene', 'paradise-lost', 'don-juan', 'idylls-of-the-king'],
    },
  },

  // ── Shakespeare Tragedies ────────────────────
  {
    id: 'shakespeare-tragedies',
    slug: 'the-blood-upon-the-stage',
    name: 'The Blood Upon the Stage',
    description: 'Complete all Shakespeare tragedies in the canon. From Hamlet to Coriolanus, the stage runs red.',
    flavorText: 'The rest is silence.',
    sealDesignKey: 'skull',
    category: 'series-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'hamlet', 'macbeth', 'othello', 'king-lear', 'romeo-and-juliet',
        'julius-caesar', 'antony-and-cleopatra', 'coriolanus',
      ],
    },
  },

  // ── Shakespeare Comedies ─────────────────────
  {
    id: 'shakespeare-comedies',
    slug: 'what-fools-these-mortals-be',
    name: 'What Fools These Mortals Be',
    description: 'Complete all Shakespeare comedies in the canon. Love, mischief, and mistaken identity.',
    flavorText: 'If music be the food of love, play on.',
    sealDesignKey: 'mask',
    category: 'series-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'a-midsummer-nights-dream', 'the-merchant-of-venice',
        'the-taming-of-the-shrew', 'twelfth-night', 'as-you-like-it',
        'much-ado-about-nothing', 'the-tempest',
      ],
    },
  },

  // ── Shakespeare Histories ────────────────────
  {
    id: 'shakespeare-histories',
    slug: 'the-hollow-crown',
    name: 'The Hollow Crown',
    description: 'Complete the Henriad: Henry IV Parts I & II and Henry V.',
    flavorText: 'Uneasy lies the head that wears a crown.',
    sealDesignKey: 'crown',
    category: 'series-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['henry-iv-part-i', 'henry-iv-part-ii', 'henry-v'],
    },
  },

  // ── Sherlock Holmes ──────────────────────────
  {
    id: 'sherlock-holmes',
    slug: 'the-game-is-afoot',
    name: 'The Game Is Afoot',
    description: 'Complete all Sherlock Holmes novels: The Hound, A Study in Scarlet, and The Sign of the Four.',
    flavorText: 'The world is full of obvious things which nobody observes.',
    sealDesignKey: 'eye',
    category: 'series-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-hound-of-the-baskervilles', 'a-study-in-scarlet', 'the-sign-of-the-four'],
    },
  },

  // ── Brontë Sisters ───────────────────────────
  {
    id: 'bronte-sisters',
    slug: 'the-moors-in-the-blood',
    name: 'The Moors in the Blood',
    description: 'Complete the works of all three Brontë sisters: Charlotte, Emily, and Anne.',
    flavorText: 'I am no bird; and no net ensnares me.',
    sealDesignKey: 'raven',
    category: 'series-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['jane-eyre', 'wuthering-heights', 'agnes-grey'],
    },
  },

  // ── Russian Soul ─────────────────────────────
  {
    id: 'russian-soul-collection',
    slug: 'the-russian-soul',
    name: 'The Russian Soul',
    description: 'Complete all 19 Russian tradition books in the canon. From Pushkin to Chekhov, the soul endures.',
    flavorText: 'The darker the night, the brighter the stars.',
    sealDesignKey: 'cross',
    category: 'series-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'war-and-peace', 'anna-karenina', 'crime-and-punishment',
        'the-brothers-karamazov', 'eugene-onegin', 'the-cherry-orchard',
        'notes-from-underground', 'the-idiot', 'resurrection',
        'dead-souls', 'fathers-and-children', 'a-confession',
        'hadji-murad', 'demons', 'the-house-of-the-dead',
        'a-house-of-gentlefolk', 'on-the-eve', 'the-seagull',
        'the-inspector-general',
      ],
    },
  },

  // ── Plato Dialogues ──────────────────────────
  {
    id: 'plato-dialogues',
    slug: 'the-symposium-of-truth',
    name: 'The Symposium of Truth',
    description: 'Complete all three Platonic dialogues: The Republic, Symposium, and Apology.',
    flavorText: 'I know that I know nothing.',
    sealDesignKey: 'scales',
    category: 'series-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-republic', 'symposium', 'apology'],
    },
  },

  // ── Gothic Novels ────────────────────────────
  {
    id: 'gothic-novels',
    slug: 'the-castle-on-the-moor',
    name: 'The Castle on the Moor',
    description: 'Complete the Gothic canon: from Frankenstein to the Phantom, shadows lurk in every passage.',
    flavorText: 'There are darknesses in life, and there are lights.',
    sealDesignKey: 'skull',
    category: 'series-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'frankenstein', 'dracula', 'the-picture-of-dorian-gray',
        'the-strange-case-of-dr-jekyll-and-mr-hyde', 'northanger-abbey',
        'the-turn-of-the-screw', 'the-phantom-of-the-opera',
      ],
    },
  },
]
