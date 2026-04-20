// ─────────────────────────────────────────────
// Author Collection Achievements
// ─────────────────────────────────────────────
// One achievement (or tiered chain) per author with multiple
// canonical books. Tiered chains for authors with 5+ books.
//
// Tier thresholds for prolific authors:
//   5+ books  → tiered chain with chain.previous/chain.next
//   3-4 books → single completion (rare, 700 wisdom)
//   2 books   → single completion (uncommon, 400 wisdom)

import type { Achievement } from '@/types/achievement'

// ── Shakespeare (19 books) ─ tiered chain ────

const shakespeare: Achievement[] = [
  {
    id: 'shakespeare-apprentice',
    slug: 'apprentice-of-the-globe',
    name: 'Apprentice of the Globe',
    description: 'Read 5 works by William Shakespeare and step onto the stage.',
    flavorText: 'All the world\'s a stage...',
    sealDesignKey: 'mask',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 5,
      from: {
        bookIds: [
          'hamlet', 'macbeth', 'othello', 'the-tempest', 'romeo-and-juliet',
          'king-lear', 'a-midsummer-nights-dream', 'julius-caesar',
          'the-merchant-of-venice', 'the-taming-of-the-shrew', 'twelfth-night',
          'as-you-like-it', 'much-ado-about-nothing', 'antony-and-cleopatra',
          'henry-iv-part-i', 'henry-iv-part-ii', 'henry-v', 'coriolanus',
          'measure-for-measure',
        ],
      },
    },
    chain: { next: 'shakespeare-player' },
  },
  {
    id: 'shakespeare-player',
    slug: 'player-of-the-globe',
    name: 'Player of the Globe',
    description: 'Read 10 works by William Shakespeare. The play\'s the thing.',
    flavorText: 'We know what we are, but know not what we may be.',
    sealDesignKey: 'mask',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-count',
      count: 10,
      from: {
        bookIds: [
          'hamlet', 'macbeth', 'othello', 'the-tempest', 'romeo-and-juliet',
          'king-lear', 'a-midsummer-nights-dream', 'julius-caesar',
          'the-merchant-of-venice', 'the-taming-of-the-shrew', 'twelfth-night',
          'as-you-like-it', 'much-ado-about-nothing', 'antony-and-cleopatra',
          'henry-iv-part-i', 'henry-iv-part-ii', 'henry-v', 'coriolanus',
          'measure-for-measure',
        ],
      },
    },
    chain: { previous: 'shakespeare-apprentice', next: 'shakespeare-master' },
  },
  {
    id: 'shakespeare-master',
    slug: 'master-of-the-globe',
    name: 'Master of the Globe',
    description: 'Complete all 19 Shakespeare works in the canon. The rest is silence.',
    flavorText: 'Our revels now are ended.',
    sealDesignKey: 'mask',
    category: 'author-complete',
    rarity: 'legendary',
    wisdomReward: 1500,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'hamlet', 'macbeth', 'othello', 'the-tempest', 'romeo-and-juliet',
        'king-lear', 'a-midsummer-nights-dream', 'julius-caesar',
        'the-merchant-of-venice', 'the-taming-of-the-shrew', 'twelfth-night',
        'as-you-like-it', 'much-ado-about-nothing', 'antony-and-cleopatra',
        'henry-iv-part-i', 'henry-iv-part-ii', 'henry-v', 'coriolanus',
        'measure-for-measure',
      ],
    },
    chain: { previous: 'shakespeare-player' },
  },
]

// ── Dickens (8 books) ─ tiered chain ─────────

const dickens: Achievement[] = [
  {
    id: 'dickens-reader',
    slug: 'the-fog-of-london',
    name: 'The Fog of London',
    description: 'Read 3 works by Charles Dickens and wander into the gaslit streets.',
    flavorText: 'It was the best of times...',
    sealDesignKey: 'key',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 3,
      from: {
        bookIds: [
          'great-expectations', 'a-tale-of-two-cities', 'david-copperfield',
          'oliver-twist', 'a-christmas-carol', 'bleak-house', 'hard-times',
          'dombey-and-son',
        ],
      },
    },
    chain: { next: 'dickens-devotee' },
  },
  {
    id: 'dickens-devotee',
    slug: 'master-of-the-serial',
    name: 'Master of the Serial',
    description: 'Read all 8 Dickens works. You have earned every weekly instalment.',
    flavorText: 'Please, sir, I want some more.',
    sealDesignKey: 'key',
    category: 'author-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'great-expectations', 'a-tale-of-two-cities', 'david-copperfield',
        'oliver-twist', 'a-christmas-carol', 'bleak-house', 'hard-times',
        'dombey-and-son',
      ],
    },
    chain: { previous: 'dickens-reader' },
  },
]

// ── Austen (6 books) ─ tiered chain ─────────

const austen: Achievement[] = [
  {
    id: 'austen-acquaintance',
    slug: 'first-impressions',
    name: 'First Impressions',
    description: 'Read 3 Jane Austen novels and take a turn about the room.',
    flavorText: 'A lady\'s imagination is very rapid.',
    sealDesignKey: 'rose',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 3,
      from: {
        bookIds: [
          'pride-and-prejudice', 'emma', 'sense-and-sensibility',
          'persuasion', 'mansfield-park', 'northanger-abbey',
        ],
      },
    },
    chain: { next: 'austen-intimate' },
  },
  {
    id: 'austen-intimate',
    slug: 'the-whole-of-hertfordshire',
    name: 'The Whole of Hertfordshire',
    description: 'Complete all 6 Austen novels. Every neighbourhood has its share of beauty.',
    flavorText: 'There is no charm equal to tenderness of heart.',
    sealDesignKey: 'rose',
    category: 'author-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'pride-and-prejudice', 'emma', 'sense-and-sensibility',
        'persuasion', 'mansfield-park', 'northanger-abbey',
      ],
    },
    chain: { previous: 'austen-acquaintance' },
  },
]

// ── Dostoevsky (6 books) ─ tiered chain ──────

const dostoevsky: Achievement[] = [
  {
    id: 'dostoevsky-seeker',
    slug: 'from-the-underground',
    name: 'From the Underground',
    description: 'Read 3 Dostoevsky works and descend into the depths of the soul.',
    flavorText: 'I am a sick man... I am a spiteful man.',
    sealDesignKey: 'skull',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 3,
      from: {
        bookIds: [
          'crime-and-punishment', 'the-brothers-karamazov',
          'notes-from-underground', 'the-idiot', 'demons',
          'the-house-of-the-dead',
        ],
      },
    },
    chain: { next: 'dostoevsky-confessor' },
  },
  {
    id: 'dostoevsky-confessor',
    slug: 'the-grand-inquisitor',
    name: 'The Grand Inquisitor',
    description: 'Complete all 6 Dostoevsky works. Beauty will save the world.',
    flavorText: 'The soul is healed by being with children.',
    sealDesignKey: 'skull',
    category: 'author-complete',
    rarity: 'epic',
    wisdomReward: 800,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'crime-and-punishment', 'the-brothers-karamazov',
        'notes-from-underground', 'the-idiot', 'demons',
        'the-house-of-the-dead',
      ],
    },
    chain: { previous: 'dostoevsky-seeker' },
  },
]

// ── Tolstoy (5 books) ─ tiered chain ─────────

const tolstoy: Achievement[] = [
  {
    id: 'tolstoy-pilgrim',
    slug: 'the-hedgehog-and-the-fox',
    name: 'The Hedgehog and the Fox',
    description: 'Read 3 Tolstoy works and glimpse the vast Russian landscape.',
    flavorText: 'If you want to be happy, be.',
    sealDesignKey: 'mountain',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 3,
      from: {
        bookIds: [
          'war-and-peace', 'anna-karenina', 'resurrection',
          'a-confession', 'hadji-murad',
        ],
      },
    },
    chain: { next: 'tolstoy-sage' },
  },
  {
    id: 'tolstoy-sage',
    slug: 'yasnaya-polyana',
    name: 'Yasnaya Polyana',
    description: 'Complete all 5 Tolstoy works. All great literature asks the same question.',
    flavorText: 'Everyone thinks of changing the world, but no one thinks of changing himself.',
    sealDesignKey: 'mountain',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'war-and-peace', 'anna-karenina', 'resurrection',
        'a-confession', 'hadji-murad',
      ],
    },
    chain: { previous: 'tolstoy-pilgrim' },
  },
]

// ── Sinclair Lewis (5 books) ─ tiered chain ──

const sinclairLewis: Achievement[] = [
  {
    id: 'lewis-observer',
    slug: 'the-main-street-observer',
    name: 'The Main Street Observer',
    description: 'Read 3 Sinclair Lewis novels and survey the American middle class.',
    flavorText: 'He who has seen one cathedral has seen all.',
    sealDesignKey: 'eye',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-count',
      count: 3,
      from: {
        bookIds: ['main-street', 'arrowsmith', 'babbitt', 'dodsworth', 'elmer-gantry'],
      },
    },
    chain: { next: 'lewis-satirist' },
  },
  {
    id: 'lewis-satirist',
    slug: 'it-cant-happen-here',
    name: 'It Can\'t Happen Here',
    description: 'Complete all 5 Sinclair Lewis novels. America\'s first Nobel satirist.',
    sealDesignKey: 'eye',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['main-street', 'arrowsmith', 'babbitt', 'dodsworth', 'elmer-gantry'],
    },
    chain: { previous: 'lewis-observer' },
  },
]

// ── 3-4 Book Authors (rare, 700 wisdom) ──────

const threeToFourBookAuthors: Achievement[] = [
  // Mark Twain (4)
  {
    id: 'twain-complete',
    slug: 'the-mississippi-pilot',
    name: 'The Mississippi Pilot',
    description: 'Complete all 4 Twain works. The reports of literature\'s death are greatly exaggerated.',
    flavorText: 'The secret of getting ahead is getting started.',
    sealDesignKey: 'ship',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'the-adventures-of-tom-sawyer', 'the-adventures-of-huckleberry-finn',
        'the-prince-and-the-pauper', 'a-connecticut-yankee-in-king-arthurs-court',
      ],
    },
  },
  // Joseph Conrad (4)
  {
    id: 'conrad-complete',
    slug: 'the-heart-of-the-sea',
    name: 'The Heart of the Sea',
    description: 'Complete all 4 Conrad works. Into the darkness, and back again.',
    flavorText: 'We live as we dream — alone.',
    sealDesignKey: 'compass',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['heart-of-darkness', 'lord-jim', 'the-secret-agent', 'nostromo'],
    },
  },
  // E. M. Forster (4)
  {
    id: 'forster-complete',
    slug: 'only-connect',
    name: 'Only Connect',
    description: 'Complete all 4 Forster works. The prose and the passion shall meet.',
    flavorText: 'Only connect the prose and the passion.',
    sealDesignKey: 'chain',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['a-room-with-a-view', 'howards-end', 'a-passage-to-india', 'aspects-of-the-novel'],
    },
  },
  // D. H. Lawrence (4)
  {
    id: 'lawrence-complete',
    slug: 'the-rainbow-seeker',
    name: 'The Rainbow Seeker',
    description: 'Complete all 4 D.H. Lawrence works. The blood knows what the mind forgets.',
    flavorText: 'Ours is essentially a tragic age, so we refuse to take it tragically.',
    sealDesignKey: 'flame',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['sons-and-lovers', 'women-in-love', 'the-rainbow', 'lady-chatterleys-lover'],
    },
  },
  // George Eliot (4)
  {
    id: 'eliot-complete',
    slug: 'the-web-of-affinities',
    name: 'The Web of Affinities',
    description: 'Complete all 4 George Eliot works. The finest of Victorian tapestries.',
    flavorText: 'It is never too late to be what you might have been.',
    sealDesignKey: 'book',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['middlemarch', 'the-mill-on-the-floss', 'silas-marner', 'daniel-deronda'],
    },
  },
  // Thomas Hardy (4)
  {
    id: 'hardy-complete',
    slug: 'wessex-wanderer',
    name: 'Wessex Wanderer',
    description: 'Complete all 4 Hardy works. The landscape endures what the heart cannot.',
    flavorText: 'Time changes everything except something within us which is always surprised by change.',
    sealDesignKey: 'tree',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: [
        'tess-of-the-durbervilles', 'far-from-the-madding-crowd',
        'the-mayor-of-casterbridge', 'jude-the-obscure',
      ],
    },
  },
  // Sophocles (3)
  {
    id: 'sophocles-complete',
    slug: 'the-mask-of-thebes',
    name: 'The Mask of Thebes',
    description: 'Complete all 3 Sophocles works. The chorus falls silent at last.',
    flavorText: 'Count no man happy until he is dead.',
    sealDesignKey: 'mask',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['oedipus-rex', 'antigone', 'ajax'],
    },
  },
  // Plato (3)
  {
    id: 'plato-complete',
    slug: 'beyond-the-cave',
    name: 'Beyond the Cave',
    description: 'Complete all 3 Plato works. You have stepped into the sunlight.',
    flavorText: 'The unexamined life is not worth living.',
    sealDesignKey: 'column',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-republic', 'symposium', 'apology'],
    },
  },
  // F. Scott Fitzgerald (3)
  {
    id: 'fitzgerald-complete',
    slug: 'the-green-light',
    name: 'The Green Light',
    description: 'Complete all 3 Fitzgerald works. So we beat on, boats against the current.',
    flavorText: 'There are all kinds of love in this world, but never the same love twice.',
    sealDesignKey: 'star',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-great-gatsby', 'this-side-of-paradise', 'the-beautiful-and-damned'],
    },
  },
  // James Joyce (3)
  {
    id: 'joyce-complete',
    slug: 'dear-dirty-dublin',
    name: 'Dear Dirty Dublin',
    description: 'Complete all 3 Joyce works. The conscience of a race, forged in silence.',
    flavorText: 'In the particular is contained the universal.',
    sealDesignKey: 'key',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['ulysses', 'a-portrait-of-the-artist-as-a-young-man', 'dubliners'],
    },
  },
  // Virginia Woolf (3)
  {
    id: 'woolf-complete',
    slug: 'the-waves-within',
    name: 'The Waves Within',
    description: 'Complete all 3 Woolf works. A room of one\'s own, and the consciousness to fill it.',
    flavorText: 'One cannot think well, love well, sleep well, if one has not dined well.',
    sealDesignKey: 'wave',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['mrs-dalloway', 'to-the-lighthouse', 'jacobs-room'],
    },
  },
  // Henrik Ibsen (3)
  {
    id: 'ibsen-complete',
    slug: 'the-door-slams-shut',
    name: 'The Door Slams Shut',
    description: 'Complete all 3 Ibsen works. The drawing room will never be the same.',
    flavorText: 'The strongest man in the world is he who stands most alone.',
    sealDesignKey: 'mask',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['a-dolls-house', 'ghosts', 'hedda-gabler'],
    },
  },
  // Robert Louis Stevenson (3)
  {
    id: 'stevenson-complete',
    slug: 'the-dual-nature',
    name: 'The Dual Nature',
    description: 'Complete all 3 Stevenson works. X marks the spot on every map.',
    flavorText: 'To travel hopefully is a better thing than to arrive.',
    sealDesignKey: 'compass',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-strange-case-of-dr-jekyll-and-mr-hyde', 'treasure-island', 'kidnapped'],
    },
  },
  // Arthur Conan Doyle (3)
  {
    id: 'conan-doyle-complete',
    slug: 'elementary-my-dear',
    name: 'Elementary, My Dear',
    description: 'Complete all 3 Conan Doyle works. The game is always afoot.',
    flavorText: 'When you have eliminated the impossible, whatever remains must be the truth.',
    sealDesignKey: 'eye',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-hound-of-the-baskervilles', 'a-study-in-scarlet', 'the-sign-of-the-four'],
    },
  },
  // H. G. Wells (3)
  {
    id: 'wells-complete',
    slug: 'the-time-traveller',
    name: 'The Time Traveller',
    description: 'Complete all 3 Wells works. The future belongs to those who read it.',
    flavorText: 'If we don\'t end war, war will end us.',
    sealDesignKey: 'hourglass',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-time-machine', 'the-war-of-the-worlds', 'the-invisible-man'],
    },
  },
  // Edith Wharton (3)
  {
    id: 'wharton-complete',
    slug: 'the-gilded-cage',
    name: 'The Gilded Cage',
    description: 'Complete all 3 Wharton works. Old New York yields its secrets reluctantly.',
    flavorText: 'There are two ways of spreading light: to be the candle or the mirror.',
    sealDesignKey: 'crown',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-age-of-innocence', 'ethan-frome', 'the-house-of-mirth'],
    },
  },
  // Ivan Turgenev (3)
  {
    id: 'turgenev-complete',
    slug: 'the-russian-spring',
    name: 'The Russian Spring',
    description: 'Complete all 3 Turgenev works. Father and son, old and new, forever entwined.',
    flavorText: 'We sit in the mud and reach for the stars.',
    sealDesignKey: 'feather',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['fathers-and-children', 'a-house-of-gentlefolk', 'on-the-eve'],
    },
  },
  // Willa Cather (3)
  {
    id: 'cather-complete',
    slug: 'the-prairie-voice',
    name: 'The Prairie Voice',
    description: 'Complete all 3 Cather works. The land belongs to the future.',
    flavorText: 'The end is nothing; the road is all.',
    sealDesignKey: 'mountain',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['my-antonia', 'o-pioneers', 'death-comes-for-the-archbishop'],
    },
  },
  // George Bernard Shaw (3)
  {
    id: 'shaw-complete',
    slug: 'the-fabian-wit',
    name: 'The Fabian Wit',
    description: 'Complete all 3 Shaw works. The reasonable man adapts; the unreasonable one changes the world.',
    sealDesignKey: 'lightning',
    category: 'author-complete',
    rarity: 'rare',
    wisdomReward: 700,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['arms-and-the-man', 'candida', 'heartbreak-house'],
    },
  },
]

// ── 2-Book Authors (uncommon, 400 wisdom) ────

const twoBookAuthors: Achievement[] = [
  // Homer (2)
  {
    id: 'homer-complete',
    slug: 'singer-of-tales',
    name: 'Singer of Tales',
    description: 'Complete both Homeric epics. The wine-dark sea stretches before you.',
    flavorText: 'Sing, O Muse...',
    sealDesignKey: 'lyre',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-iliad', 'the-odyssey'],
    },
  },
  // Oscar Wilde (2)
  {
    id: 'wilde-complete',
    slug: 'the-art-of-being',
    name: 'The Art of Being',
    description: 'Complete both Wilde works. To live is the rarest thing in the world.',
    flavorText: 'Be yourself; everyone else is already taken.',
    sealDesignKey: 'rose',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-picture-of-dorian-gray', 'the-importance-of-being-earnest'],
    },
  },
  // Henry James (2)
  {
    id: 'henry-james-complete',
    slug: 'the-figure-in-the-carpet',
    name: 'The Figure in the Carpet',
    description: 'Complete both Henry James works. The pattern reveals itself at last.',
    sealDesignKey: 'eye',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-turn-of-the-screw', 'the-portrait-of-a-lady'],
    },
  },
  // Wilkie Collins (2)
  {
    id: 'collins-complete',
    slug: 'the-sensation-seeker',
    name: 'The Sensation Seeker',
    description: 'Complete both Collins works. The moonlight catches every secret.',
    sealDesignKey: 'moon',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-moonstone', 'the-woman-in-white'],
    },
  },
  // Rudyard Kipling (2)
  {
    id: 'kipling-complete',
    slug: 'the-law-of-the-jungle',
    name: 'The Law of the Jungle',
    description: 'Complete both Kipling works. The strength of the wolf is the pack.',
    sealDesignKey: 'tree',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-jungle-book', 'kim'],
    },
  },
  // Hermann Hesse (2)
  {
    id: 'hesse-complete',
    slug: 'the-river-crossing',
    name: 'The River Crossing',
    description: 'Complete both Hesse works. The river has taught you to listen.',
    sealDesignKey: 'wave',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['siddhartha', 'demian'],
    },
  },
  // Alexandre Dumas (2)
  {
    id: 'dumas-complete',
    slug: 'all-for-one',
    name: 'All for One',
    description: 'Complete both Dumas works. Revenge and honour — the twin engines of adventure.',
    sealDesignKey: 'sword',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-count-of-monte-cristo', 'the-three-musketeers'],
    },
  },
  // Jules Verne (2)
  {
    id: 'verne-complete',
    slug: 'the-extraordinary-voyager',
    name: 'The Extraordinary Voyager',
    description: 'Complete both Verne works. Science and imagination unite.',
    sealDesignKey: 'globe',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['around-the-world-in-eighty-days', 'journey-to-the-center-of-the-earth'],
    },
  },
  // Lewis Carroll (2)
  {
    id: 'carroll-complete',
    slug: 'through-the-looking-glass-and-back',
    name: 'Through the Looking-Glass and Back',
    description: 'Complete both Carroll works. Curiouser and curiouser!',
    sealDesignKey: 'key',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['alices-adventures-in-wonderland', 'through-the-looking-glass'],
    },
  },
  // Ernest Hemingway (2)
  {
    id: 'hemingway-complete',
    slug: 'the-iceberg-beneath',
    name: 'The Iceberg Beneath',
    description: 'Complete both Hemingway works. Dignity in motion, economy in word.',
    sealDesignKey: 'sun',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-sun-also-rises', 'a-farewell-to-arms'],
    },
  },
  // William Faulkner (2)
  {
    id: 'faulkner-complete',
    slug: 'yoknapatawpha-county',
    name: 'Yoknapatawpha County',
    description: 'Complete both Faulkner works. The past is never dead.',
    sealDesignKey: 'tree',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-sound-and-the-fury', 'as-i-lay-dying'],
    },
  },
  // Nikolai Gogol (2)
  {
    id: 'gogol-complete',
    slug: 'the-overcoat-of-russian-letters',
    name: 'The Overcoat of Russian Letters',
    description: 'Complete both Gogol works. We all came out from under Gogol\'s overcoat.',
    sealDesignKey: 'raven',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['dead-souls', 'the-inspector-general'],
    },
  },
  // Anton Chekhov (2)
  {
    id: 'chekhov-complete',
    slug: 'the-gun-on-the-wall',
    name: 'The Gun on the Wall',
    description: 'Complete both Chekhov works. If a gun hangs on the wall, it must go off.',
    sealDesignKey: 'feather',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-cherry-orchard', 'the-seagull'],
    },
  },
  // Thomas Mann (2)
  {
    id: 'mann-complete',
    slug: 'the-enchanted-mountain',
    name: 'The Enchanted Mountain',
    description: 'Complete both Mann works. Time dissolves among the summits.',
    sealDesignKey: 'mountain',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['buddenbrooks', 'the-magic-mountain'],
    },
  },
  // Honoré de Balzac (2)
  {
    id: 'balzac-complete',
    slug: 'the-human-comedy',
    name: 'The Human Comedy',
    description: 'Complete both Balzac works. All of Paris in a single binding.',
    sealDesignKey: 'quill',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['eugenie-grandet', 'father-goriot'],
    },
  },
  // Niccolò Machiavelli (2)
  {
    id: 'machiavelli-complete',
    slug: 'the-florentine-strategist',
    name: 'The Florentine Strategist',
    description: 'Complete both Machiavelli works. Fortune favours the bold.',
    sealDesignKey: 'crown',
    category: 'author-complete',
    rarity: 'uncommon',
    wisdomReward: 400,
    unlockCondition: {
      type: 'complete-all',
      bookIds: ['the-prince', 'discourses-on-livy'],
    },
  },
]

export const AUTHOR_COLLECTION_ACHIEVEMENTS: Achievement[] = [
  ...shakespeare,
  ...dickens,
  ...austen,
  ...dostoevsky,
  ...tolstoy,
  ...sinclairLewis,
  ...threeToFourBookAuthors,
  ...twoBookAuthors,
]
