// ─────────────────────────────────────────────
// Tradition & Thematic Collection Achievements
// ─────────────────────────────────────────────
// Per-tradition chains (tiered when 10+ canonical books)
// and cross-tradition thematic achievements.
// All bookIds verified against data_canon_books.json traditions.

import type { Achievement } from '@/types/achievement'

// ══════════════════════════════════════════════
// BOOK ID CONSTANTS (must be declared before use)
// ══════════════════════════════════════════════

const VICTORIAN_BOOK_IDS = [
  'jane-eyre', 'wuthering-heights', 'great-expectations', 'a-tale-of-two-cities',
  'the-picture-of-dorian-gray', 'the-importance-of-being-earnest', 'a-dolls-house',
  'emma', 'sense-and-sensibility', 'persuasion', 'mansfield-park', 'northanger-abbey',
  'the-turn-of-the-screw', 'the-portrait-of-a-lady', 'david-copperfield',
  'oliver-twist', 'a-christmas-carol', 'bleak-house', 'hard-times',
  'the-strange-case-of-dr-jekyll-and-mr-hyde', 'treasure-island',
  'the-hound-of-the-baskervilles', 'a-study-in-scarlet', 'the-sign-of-the-four',
  'the-time-machine', 'the-war-of-the-worlds', 'the-invisible-man',
  'the-jungle-book', 'kim', 'middlemarch', 'the-mill-on-the-floss',
  'silas-marner', 'tess-of-the-durbervilles', 'far-from-the-madding-crowd',
  'the-mayor-of-casterbridge', 'the-moonstone', 'the-woman-in-white',
  'vanity-fair', 'north-and-south', 'the-scarlet-pimpernel', 'dracula',
  'dombey-and-son', 'flatland', 'peter-and-wendy',
  'alices-adventures-in-wonderland', 'through-the-looking-glass',
  'the-wind-in-the-willows', 'the-secret-garden', 'anne-of-green-gables',
  'black-beauty', 'arms-and-the-man', 'candida', 'barchester-towers',
  'idylls-of-the-king', 'daniel-deronda', 'jude-the-obscure', 'kidnapped',
  'king-solomons-mines', 'castle-rackrent', 'mary-olivier-a-life',
  'the-old-english-baron', 'the-documents-in-the-case', 'aspects-of-the-novel',
  'culture-and-anarchy', 'the-conscious-lovers', 'the-night-land',
  'the-purple-cloud', 'last-and-first-men', 'the-king-of-elflands-daughter',
  'hudibras',
]

const AMERICAN_BOOK_IDS = [
  'moby-dick', 'the-scarlet-letter', 'little-women', 'walden',
  'the-great-gatsby', 'the-call-of-the-wild', 'the-adventures-of-tom-sawyer',
  'the-adventures-of-huckleberry-finn', 'the-age-of-innocence', 'ethan-frome',
  'main-street', 'arrowsmith', 'babbitt', 'the-sun-also-rises',
  'this-side-of-paradise', 'the-beautiful-and-damned', 'look-homeward-angel',
  'the-sound-and-the-fury', 'the-prince-and-the-pauper',
  'a-connecticut-yankee-in-king-arthurs-court', 'the-wonderful-wizard-of-oz',
  'uncle-toms-cabin', 'narrative-of-the-life-of-frederick-douglass',
  'the-souls-of-black-folk', 'up-from-slavery', 'twelve-years-a-slave',
  'the-autobiography-of-benjamin-franklin', 'leaves-of-grass',
  'the-house-of-mirth', 'my-antonia', 'o-pioneers', 'the-awakening',
  'the-maltese-falcon',
  'incidents-in-the-life-of-a-slave-girl', 'death-comes-for-the-archbishop',
  'dodsworth', 'elmer-gantry', 'gentlemen-prefer-blondes', 'mcteague',
  'looking-backward', 'democracy-and-education', 'progress-and-poverty',
  'black-no-more',
]

const MODERNIST_BOOK_IDS = [
  'ulysses', 'mrs-dalloway', 'heart-of-darkness', 'to-the-lighthouse',
  'a-room-with-a-view', 'howards-end', 'sons-and-lovers', 'women-in-love',
  'the-rainbow', 'the-good-soldier', 'lord-jim', 'the-secret-agent',
  'nostromo', 'a-passage-to-india', 'a-farewell-to-arms',
  'a-portrait-of-the-artist-as-a-young-man', 'jacobs-room', 'dubliners',
  'cane', 'lady-chatterleys-lover', 'manhattan-transfer', 'as-i-lay-dying',
  'the-castle', 'vile-bodies', 'heartbreak-house',
]

const RENAISSANCE_BOOK_IDS = [
  'hamlet', 'macbeth', 'othello', 'the-tempest', 'don-quixote', 'the-prince',
  'paradise-lost', 'romeo-and-juliet', 'king-lear', 'a-midsummer-nights-dream',
  'julius-caesar', 'the-merchant-of-venice', 'the-taming-of-the-shrew',
  'twelfth-night', 'as-you-like-it', 'much-ado-about-nothing',
  'antony-and-cleopatra', 'henry-iv-part-i', 'henry-iv-part-ii', 'henry-v',
  'coriolanus', 'measure-for-measure', 'discourses-on-livy', 'the-lusiads',
]

const RUSSIAN_BOOK_IDS = [
  'war-and-peace', 'anna-karenina', 'crime-and-punishment',
  'the-brothers-karamazov', 'eugene-onegin', 'the-cherry-orchard',
  'notes-from-underground', 'the-idiot', 'resurrection', 'dead-souls',
  'fathers-and-children', 'a-confession', 'hadji-murad', 'demons',
  'the-house-of-the-dead', 'a-house-of-gentlefolk', 'on-the-eve',
  'the-seagull', 'the-inspector-general',
]

const FRENCH_BOOK_IDS = [
  'madame-bovary', 'germinal', 'the-three-musketeers',
  'the-phantom-of-the-opera', 'around-the-world-in-eighty-days',
  'journey-to-the-center-of-the-earth', 'eugenie-grandet', 'father-goriot',
  'in-search-of-lost-time', 'dangerous-liaisons', 'the-counterfeiters',
  'after-the-divorce', 'clerambault', 'germinie-lacerteux', 'fantomas',
  'english-as-she-is-spoke', 'the-crowd', 'what-is-property',
]

const ANCIENT_GREEK_BOOK_IDS = [
  'the-iliad', 'the-odyssey', 'oedipus-rex', 'antigone', 'the-republic',
  'symposium', 'apology', 'nicomachean-ethics', 'the-histories',
  'history-of-the-peloponnesian-war', 'ajax', 'dialogues', 'agamemnon',
]

// ══════════════════════════════════════════════
// TRADITION CHAINS
// ══════════════════════════════════════════════

// ── Victorian (71 books) ─ tiered at 10/25/50/71 ─

const victorian: Achievement[] = [
  {
    id: 'victorian-i',
    slug: 'gaslit-apprentice',
    name: 'Gaslit Apprentice',
    description: 'Read 10 Victorian tradition books. The fog begins to lift.',
    sealDesignKey: 'key',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 10,
      from: { bookIds: VICTORIAN_BOOK_IDS },
    },
    chain: { next: 'victorian-ii' },
  },
  {
    id: 'victorian-ii',
    slug: 'parlour-scholar',
    name: 'Parlour Scholar',
    description: 'Read 25 Victorian tradition books. You could fill a lending library.',
    sealDesignKey: 'key',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-count',
      count: 25,
      from: { bookIds: VICTORIAN_BOOK_IDS },
    },
    chain: { previous: 'victorian-i', next: 'victorian-iii' },
  },
  {
    id: 'victorian-iii',
    slug: 'the-great-exhibition',
    name: 'The Great Exhibition',
    description: 'Read 50 Victorian tradition books. An era displayed in full.',
    sealDesignKey: 'key',
    category: 'tradition-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-count',
      count: 50,
      from: { bookIds: VICTORIAN_BOOK_IDS },
    },
    chain: { previous: 'victorian-ii', next: 'victorian-iv' },
  },
  {
    id: 'victorian-iv',
    slug: 'queen-of-the-circulating-library',
    name: 'Queen of the Circulating Library',
    description: 'Complete all 71 Victorian tradition books. An entire age conquered.',
    sealDesignKey: 'crown',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: VICTORIAN_BOOK_IDS,
    },
    chain: { previous: 'victorian-iii' },
  },
]

// ── American (43 books) ─ tiered at 10/20/43 ─

const american: Achievement[] = [
  {
    id: 'american-i',
    slug: 'new-world-reader',
    name: 'New World Reader',
    description: 'Read 10 American tradition books. The frontier calls.',
    sealDesignKey: 'torch',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 10,
      from: { bookIds: AMERICAN_BOOK_IDS },
    },
    chain: { next: 'american-ii' },
  },
  {
    id: 'american-ii',
    slug: 'the-american-dream',
    name: 'The American Dream',
    description: 'Read 20 American tradition books. Coast to coast in pages.',
    sealDesignKey: 'torch',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-count',
      count: 20,
      from: { bookIds: AMERICAN_BOOK_IDS },
    },
    chain: { previous: 'american-i', next: 'american-iii' },
  },
  {
    id: 'american-iii',
    slug: 'e-pluribus-unum',
    name: 'E Pluribus Unum',
    description: 'Complete all 43 American tradition books. From many voices, one literature.',
    sealDesignKey: 'torch',
    category: 'tradition-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: AMERICAN_BOOK_IDS,
    },
    chain: { previous: 'american-ii' },
  },
]

// ── Modernist (25 books) ─ tiered at 10/25 ──

const modernist: Achievement[] = [
  {
    id: 'modernist-i',
    slug: 'stream-of-consciousness',
    name: 'Stream of Consciousness',
    description: 'Read 10 Modernist tradition books. The old forms crack and reform.',
    sealDesignKey: 'lightning',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 10,
      from: { bookIds: MODERNIST_BOOK_IDS },
    },
    chain: { next: 'modernist-ii' },
  },
  {
    id: 'modernist-ii',
    slug: 'make-it-new',
    name: 'Make It New',
    description: 'Complete all 25 Modernist tradition books. The centre cannot hold — but you have.',
    sealDesignKey: 'lightning',
    category: 'tradition-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: MODERNIST_BOOK_IDS,
    },
    chain: { previous: 'modernist-i' },
  },
]

// ── Renaissance (24 books) ─ tiered at 8/16/24 ─

const renaissance: Achievement[] = [
  {
    id: 'renaissance-i',
    slug: 'the-new-learning',
    name: 'The New Learning',
    description: 'Read 8 Renaissance tradition books. A rebirth of letters.',
    sealDesignKey: 'quill',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 8,
      from: { bookIds: RENAISSANCE_BOOK_IDS },
    },
    chain: { next: 'renaissance-ii' },
  },
  {
    id: 'renaissance-ii',
    slug: 'the-universal-man',
    name: 'The Universal Man',
    description: 'Read 16 Renaissance tradition books. A mind well-furnished.',
    sealDesignKey: 'quill',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-count',
      count: 16,
      from: { bookIds: RENAISSANCE_BOOK_IDS },
    },
    chain: { previous: 'renaissance-i', next: 'renaissance-iii' },
  },
  {
    id: 'renaissance-iii',
    slug: 'the-complete-renaissance',
    name: 'The Complete Renaissance',
    description: 'Complete all 24 Renaissance tradition books. The light shines fully.',
    sealDesignKey: 'sun',
    category: 'tradition-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: RENAISSANCE_BOOK_IDS,
    },
    chain: { previous: 'renaissance-ii' },
  },
]

// ── Russian (19 books) ─ tiered at 8/19 ─────

const russian: Achievement[] = [
  {
    id: 'russian-i',
    slug: 'the-first-snow',
    name: 'The First Snow',
    description: 'Read 8 Russian tradition books. The steppe opens before you.',
    sealDesignKey: 'cross',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 8,
      from: { bookIds: RUSSIAN_BOOK_IDS },
    },
    chain: { next: 'russian-ii' },
  },
  {
    id: 'russian-ii',
    slug: 'the-motherland-of-letters',
    name: 'The Motherland of Letters',
    description: 'Complete all 19 Russian tradition books. From Pushkin to Chekhov.',
    sealDesignKey: 'cross',
    category: 'tradition-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: RUSSIAN_BOOK_IDS,
    },
    chain: { previous: 'russian-i' },
  },
]

// ── French (18 books) ─ tiered at 8/18 ──────

const french: Achievement[] = [
  {
    id: 'french-i',
    slug: 'les-belles-lettres',
    name: 'Les Belles-Lettres',
    description: 'Read 8 French tradition books. Parisian salons open their doors.',
    sealDesignKey: 'feather',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 8,
      from: { bookIds: FRENCH_BOOK_IDS },
    },
    chain: { next: 'french-ii' },
  },
  {
    id: 'french-ii',
    slug: 'la-grande-tradition',
    name: 'La Grande Tradition',
    description: 'Complete all 18 French tradition books. Vive la littérature!',
    sealDesignKey: 'feather',
    category: 'tradition-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: FRENCH_BOOK_IDS,
    },
    chain: { previous: 'french-i' },
  },
]

// ── Ancient Greek (13 books) ─ tiered at 5/13 ─

const ancientGreek: Achievement[] = [
  {
    id: 'ancient-greek-i',
    slug: 'the-agora-awaits',
    name: 'The Agora Awaits',
    description: 'Read 5 Ancient Greek tradition books. The olive groves whisper.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 5,
      from: { bookIds: ANCIENT_GREEK_BOOK_IDS },
    },
    chain: { next: 'ancient-greek-ii' },
  },
  {
    id: 'ancient-greek-ii',
    slug: 'crown-of-laurels',
    name: 'Crown of Laurels',
    description: 'Complete all 13 Ancient Greek tradition books. Worthy of the Olympic wreath.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ANCIENT_GREEK_BOOK_IDS,
    },
    chain: { previous: 'ancient-greek-i' },
  },
]

// ── Smaller Traditions (single achievements) ─

const smallerTraditions: Achievement[] = [
  // Enlightenment (10)
  {
    id: 'enlightenment-complete',
    slug: 'the-age-of-reason',
    name: 'The Age of Reason',
    description: 'Complete all 10 Enlightenment tradition books. Sapere aude!',
    sealDesignKey: 'torch',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'candide', 'gullivers-travels', 'the-social-contract',
        'discourse-on-method', 'the-wealth-of-nations',
        'a-vindication-of-the-rights-of-woman',
        'an-enquiry-concerning-human-understanding', 'clarissa',
        'evelina', 'leviathan',
      ],
    },
  },
  // Germanic (9)
  {
    id: 'germanic-complete',
    slug: 'the-wanderjahre',
    name: 'The Wanderjahre',
    description: 'Complete all 9 Germanic tradition books. From Hesse to Nietzsche.',
    sealDesignKey: 'mountain',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'siddhartha', 'all-quiet-on-the-western-front', 'beyond-good-and-evil',
        'buddenbrooks', 'demian', 'the-magic-mountain',
        'the-adventurous-simplicissimus', 'pan-tadeusz', 'the-swiss-family-robinson',
      ],
    },
  },
  // Romantic (5)
  {
    id: 'romantic-complete',
    slug: 'the-sublime-and-beautiful',
    name: 'The Sublime and Beautiful',
    description: 'Complete all 5 Romantic tradition books. Nature and passion reign.',
    sealDesignKey: 'rose',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'pride-and-prejudice', 'frankenstein', 'les-miserables',
        'the-count-of-monte-cristo', 'lyrical-ballads',
      ],
    },
  },
  // Medieval European (6)
  {
    id: 'medieval-complete',
    slug: 'the-pilgrims-road',
    name: 'The Pilgrim\'s Road',
    description: 'Complete all 6 Medieval European tradition books. The old roads still lead to Canterbury.',
    sealDesignKey: 'cross',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-divine-comedy', 'the-canterbury-tales', 'beowulf',
        'the-decameron', 'le-morte-darthur', 'sir-gawain-and-the-green-knight',
      ],
    },
  },
  // Roman (3)
  {
    id: 'roman-complete',
    slug: 'spqr',
    name: 'S.P.Q.R.',
    description: 'Complete all 3 Roman tradition books. The eternal city lives in letters.',
    sealDesignKey: 'column',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-aeneid', 'metamorphoses', 'meditations'],
    },
  },
  // Eastern (4)
  {
    id: 'eastern-complete',
    slug: 'the-ten-thousand-things',
    name: 'The Ten Thousand Things',
    description: 'Complete all 4 Eastern tradition books. The Way that can be named is not the eternal Way.',
    sealDesignKey: 'sun',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-art-of-war', 'tao-te-ching', 'gitanjali', 'kusamakura'],
    },
  },
  // Scandinavian (3: ghosts, hedda-gabler, the-pilgrim-kamanita)
  {
    id: 'scandinavian-complete',
    slug: 'the-northern-light',
    name: 'The Northern Light',
    description: 'Complete all 3 Scandinavian tradition books. The midnight sun reveals all.',
    sealDesignKey: 'star',
    category: 'tradition-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['ghosts', 'hedda-gabler', 'the-pilgrim-kamanita'],
    },
  },
  // Ancient (1)
  {
    id: 'ancient-complete',
    slug: 'the-consolation',
    name: 'The Consolation',
    description: 'Complete The Consolation of Philosophy by Boethius.',
    sealDesignKey: 'scales',
    category: 'tradition-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-book',
      bookId: 'the-consolation-of-philosophy',
    },
  },
]

// ══════════════════════════════════════════════
// CROSS-TRADITION THEMATIC ACHIEVEMENTS
// ══════════════════════════════════════════════

const thematic: Achievement[] = [
  // All Drama/Plays
  {
    id: 'drama-mastery',
    slug: 'the-fourth-wall',
    name: 'The Fourth Wall',
    description: 'Complete all dramatic works in the canon. The curtain falls, the applause begins.',
    sealDesignKey: 'mask',
    category: 'form-mastery',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        // Tragedy genre
        'oedipus-rex', 'antigone', 'hamlet', 'macbeth', 'othello',
        'romeo-and-juliet', 'king-lear', 'julius-caesar',
        'antony-and-cleopatra', 'coriolanus', 'agamemnon',
        // Comedy genre
        'the-importance-of-being-earnest', 'a-midsummer-nights-dream',
        'the-merchant-of-venice', 'the-taming-of-the-shrew', 'twelfth-night',
        'as-you-like-it', 'much-ado-about-nothing', 'arms-and-the-man', 'candida',
        // Drama genre
        'a-dolls-house', 'the-cherry-orchard', 'ghosts', 'hedda-gabler',
        'the-seagull', 'ajax', 'the-inspector-general', 'the-conscious-lovers',
        'heartbreak-house', 'measure-for-measure',
        // History Play genre
        'henry-iv-part-i', 'henry-iv-part-ii', 'henry-v',
        // Romance (The Tempest is a play)
        'the-tempest',
      ],
    },
  },
  // All Philosophy
  {
    id: 'philosophy-mastery',
    slug: 'the-examined-life',
    name: 'The Examined Life',
    description: 'Complete all philosophy works in the canon. Wisdom itself is your reward.',
    sealDesignKey: 'scales',
    category: 'form-mastery',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-republic', 'symposium', 'apology', 'nicomachean-ethics',
        'tao-te-ching', 'discourse-on-method', 'meditations',
        'a-vindication-of-the-rights-of-woman',
        'an-enquiry-concerning-human-understanding', 'beyond-good-and-evil',
        'the-consolation-of-philosophy', 'democracy-and-education',
        'dialogues',
      ],
    },
  },
  // Children's Literature
  {
    id: 'childrens-lit',
    slug: 'the-nursery-shelf',
    name: 'The Nursery Shelf',
    description: 'Complete all children\'s literature in the canon. The enchantment never fades.',
    sealDesignKey: 'star',
    category: 'form-mastery',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-wind-in-the-willows', 'the-secret-garden', 'anne-of-green-gables',
        'heidi', 'alices-adventures-in-wonderland', 'through-the-looking-glass',
        'peter-and-wendy', 'the-wonderful-wizard-of-oz', 'the-jungle-book',
      ],
    },
  },
  // Mystery/Detective
  {
    id: 'mystery-mastery',
    slug: 'the-locked-room',
    name: 'The Locked Room',
    description: 'Complete all mystery and detective works in the canon. Every puzzle has a solution.',
    sealDesignKey: 'eye',
    category: 'form-mastery',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-hound-of-the-baskervilles', 'a-study-in-scarlet',
        'the-sign-of-the-four', 'the-moonstone',
        'the-maltese-falcon', 'the-documents-in-the-case',
      ],
    },
  },
  // Science Fiction
  {
    id: 'scifi-mastery',
    slug: 'the-shape-of-things-to-come',
    name: 'The Shape of Things to Come',
    description: 'Complete all science fiction works in the canon. The future was always here.',
    sealDesignKey: 'globe',
    category: 'form-mastery',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-time-machine', 'the-war-of-the-worlds', 'the-invisible-man',
        'journey-to-the-center-of-the-earth',
      ],
    },
  },
  // Epic Poetry
  {
    id: 'epic-mastery',
    slug: 'the-bards-mantle',
    name: 'The Bard\'s Mantle',
    description: 'Complete all epic poetry in the canon. Sing of arms, of heroes, of gods.',
    sealDesignKey: 'lyre',
    category: 'form-mastery',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-iliad', 'the-odyssey', 'the-aeneid', 'the-divine-comedy',
        'paradise-lost', 'beowulf', 'the-lusiads', 'pan-tadeusz',
      ],
    },
  },
]

// ── Aggregate Export ─────────────────────────

export const THEMATIC_COLLECTION_ACHIEVEMENTS: Achievement[] = [
  ...victorian,
  ...american,
  ...modernist,
  ...renaissance,
  ...russian,
  ...french,
  ...ancientGreek,
  ...smallerTraditions,
  ...thematic,
]
