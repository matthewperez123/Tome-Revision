// ── Tome Author Country Mapping ──
// Maps all 169 unique book authors to ISO 3166-1 alpha-3 country codes,
// provides continent groupings, and one-line bios for the Explore map feature.

export interface AuthorCountryData {
  name: string
  country: string // ISO 3166-1 alpha-3 (e.g., "GBR", "FRA", "USA")
  birthYear?: number
  deathYear?: number
  oneLine: string // one-sentence bio
}

// ── All authors keyed by name as it appears in books.ts ──────────────────────

export const AUTHOR_COUNTRIES: Record<string, AuthorCountryData> = {
  // ── ANCIENT GREECE ─────────────────────────────────────────────────────────
  Homer: {
    name: "Homer",
    country: "GRC",
    birthYear: -800,
    deathYear: -701,
    oneLine:
      "Legendary Greek bard whose Iliad and Odyssey launched Western literature.",
  },
  Aeschylus: {
    name: "Aeschylus",
    country: "GRC",
    birthYear: -525,
    deathYear: -456,
    oneLine:
      "Father of tragedy who fought at Marathon and gave Athens its dramatic voice.",
  },
  Sophocles: {
    name: "Sophocles",
    country: "GRC",
    birthYear: -496,
    deathYear: -406,
    oneLine:
      "Athenian tragedian who perfected dramatic irony in Oedipus Rex.",
  },
  Euripides: {
    name: "Euripides",
    country: "GRC",
    birthYear: -480,
    deathYear: -406,
    oneLine:
      "Radical tragedian who gave voice to women, slaves, and the psychologically tormented.",
  },
  Herodotus: {
    name: "Herodotus",
    country: "GRC",
    birthYear: -484,
    deathYear: -425,
    oneLine:
      "Father of History who chronicled the Persian Wars with insatiable curiosity.",
  },
  Thucydides: {
    name: "Thucydides",
    country: "GRC",
    birthYear: -460,
    deathYear: -400,
    oneLine:
      "Athenian general turned historian who wrote the definitive account of the Peloponnesian War.",
  },
  Plato: {
    name: "Plato",
    country: "GRC",
    birthYear: -428,
    deathYear: -348,
    oneLine:
      "Philosopher who founded the Academy and explored justice, beauty, and the immortal soul through dramatic dialogues.",
  },
  Aristotle: {
    name: "Aristotle",
    country: "GRC",
    birthYear: -384,
    deathYear: -322,
    oneLine:
      "Polymath who systematized logic, ethics, politics, and poetics for two millennia of Western thought.",
  },

  // ── ANCIENT ROME / ITALY ──────────────────────────────────────────────────
  Virgil: {
    name: "Virgil",
    country: "ITA",
    birthYear: -70,
    deathYear: -19,
    oneLine:
      "Roman poet whose Aeneid gave an empire its founding myth and Dante his guide through Hell.",
  },
  Ovid: {
    name: "Ovid",
    country: "ITA",
    birthYear: -43,
    deathYear: 18,
    oneLine:
      "Exiled Roman poet whose Metamorphoses became the mythological sourcebook of Western art.",
  },
  "Marcus Aurelius": {
    name: "Marcus Aurelius",
    country: "ITA",
    birthYear: 121,
    deathYear: 180,
    oneLine:
      "Philosopher-emperor whose private Meditations became the bedrock text of Stoic ethics.",
  },
  Seneca: {
    name: "Seneca",
    country: "ITA",
    birthYear: -4,
    deathYear: 65,
    oneLine:
      "Stoic philosopher and dramatist who counseled emperors and faced death with equanimity.",
  },
  "Julius Caesar": {
    name: "Julius Caesar",
    country: "ITA",
    birthYear: -100,
    deathYear: -44,
    oneLine:
      "Roman dictator whose crisp military commentaries set a standard for political prose.",
  },

  // ── MEDIEVAL / RENAISSANCE ITALY ──────────────────────────────────────────
  "Dante Alighieri": {
    name: "Dante Alighieri",
    country: "ITA",
    birthYear: 1265,
    deathYear: 1321,
    oneLine:
      "Exiled Florentine who mapped Hell, Purgatory, and Paradise in the Divine Comedy and forged literary Italian.",
  },
  "Giovanni Boccaccio": {
    name: "Giovanni Boccaccio",
    country: "ITA",
    birthYear: 1313,
    deathYear: 1375,
    oneLine:
      "Italian storyteller whose Decameron gave Europe its finest collection of bawdy and brilliant tales.",
  },
  "Niccolò Machiavelli": {
    name: "Niccolò Machiavelli",
    country: "ITA",
    birthYear: 1469,
    deathYear: 1527,
    oneLine:
      "Florentine diplomat who stripped politics of pious illusion in The Prince.",
  },
  "Luigi Pirandello": {
    name: "Luigi Pirandello",
    country: "ITA",
    birthYear: 1867,
    deathYear: 1936,
    oneLine:
      "Nobel-winning Sicilian playwright who shattered the boundary between actor and character.",
  },

  // ── GREAT BRITAIN ─────────────────────────────────────────────────────────
  "Geoffrey Chaucer": {
    name: "Geoffrey Chaucer",
    country: "GBR",
    birthYear: 1343,
    deathYear: 1400,
    oneLine:
      "Father of English poetry who voiced every stratum of medieval society in The Canterbury Tales.",
  },
  "Thomas Malory": {
    name: "Thomas Malory",
    country: "GBR",
    birthYear: 1415,
    deathYear: 1471,
    oneLine:
      "Knight-prisoner who compiled the Arthurian legends into Le Morte d'Arthur.",
  },
  "Edmund Spenser": {
    name: "Edmund Spenser",
    country: "GBR",
    birthYear: 1552,
    deathYear: 1599,
    oneLine:
      "Elizabethan poet whose Faerie Queene wove allegory, chivalry, and Protestant virtue into epic verse.",
  },
  "Christopher Marlowe": {
    name: "Christopher Marlowe",
    country: "GBR",
    birthYear: 1564,
    deathYear: 1593,
    oneLine:
      "Daring Elizabethan dramatist whose Doctor Faustus traded a soul for knowledge and power.",
  },
  "William Shakespeare": {
    name: "William Shakespeare",
    country: "GBR",
    birthYear: 1564,
    deathYear: 1616,
    oneLine:
      "Playwright of unmatched range who invented modern English dramatic character.",
  },
  "John Milton": {
    name: "John Milton",
    country: "GBR",
    birthYear: 1608,
    deathYear: 1674,
    oneLine:
      "Blind republican poet who dictated Paradise Lost and gave Satan his grandest voice.",
  },
  "John Bunyan": {
    name: "John Bunyan",
    country: "GBR",
    birthYear: 1628,
    deathYear: 1688,
    oneLine:
      "Imprisoned tinker whose Pilgrim's Progress became the most widely read allegory in English.",
  },
  "Daniel Defoe": {
    name: "Daniel Defoe",
    country: "GBR",
    birthYear: 1660,
    deathYear: 1731,
    oneLine:
      "Journalist and adventurer who launched the English novel with Robinson Crusoe.",
  },
  "Samuel Richardson": {
    name: "Samuel Richardson",
    country: "GBR",
    birthYear: 1689,
    deathYear: 1761,
    oneLine:
      "Printer who pioneered the epistolary novel and made readers weep over Pamela and Clarissa.",
  },
  "Henry Fielding": {
    name: "Henry Fielding",
    country: "GBR",
    birthYear: 1707,
    deathYear: 1754,
    oneLine:
      "Comic novelist and magistrate who gave English fiction its earthy, picaresque spirit in Tom Jones.",
  },
  "Laurence Sterne": {
    name: "Laurence Sterne",
    country: "GBR",
    birthYear: 1713,
    deathYear: 1768,
    oneLine:
      "Eccentric clergyman whose Tristram Shandy broke every rule of narrative two centuries before postmodernism.",
  },
  "Fanny Burney": {
    name: "Fanny Burney",
    country: "GBR",
    birthYear: 1752,
    deathYear: 1840,
    oneLine:
      "Diarist and novelist whose Evelina mapped the comic perils of a young woman entering society.",
  },
  "William Wordsworth": {
    name: "William Wordsworth",
    country: "GBR",
    birthYear: 1770,
    deathYear: 1850,
    oneLine:
      "Lake District poet who made common speech and natural feeling the foundation of Romantic verse.",
  },
  "Jane Austen": {
    name: "Jane Austen",
    country: "GBR",
    birthYear: 1775,
    deathYear: 1817,
    oneLine:
      "Master ironist who dissected love, class, and self-deception within the drawing rooms of Regency England.",
  },
  "Mary Shelley": {
    name: "Mary Shelley",
    country: "GBR",
    birthYear: 1797,
    deathYear: 1851,
    oneLine:
      "Teenage visionary who invented science fiction with Frankenstein and its question of creator responsibility.",
  },
  "Mary Wollstonecraft": {
    name: "Mary Wollstonecraft",
    country: "GBR",
    birthYear: 1759,
    deathYear: 1797,
    oneLine:
      "Radical thinker who argued for women's intellectual equality in A Vindication of the Rights of Woman.",
  },
  "Charles Dickens": {
    name: "Charles Dickens",
    country: "GBR",
    birthYear: 1812,
    deathYear: 1870,
    oneLine:
      "Victorian titan who populated London with unforgettable characters and fueled social reform through fiction.",
  },
  "Charlotte Brontë": {
    name: "Charlotte Brontë",
    country: "GBR",
    birthYear: 1816,
    deathYear: 1855,
    oneLine:
      "Yorkshire novelist whose Jane Eyre gave the English novel its fiercest female voice.",
  },
  "Emily Brontë": {
    name: "Emily Brontë",
    country: "GBR",
    birthYear: 1818,
    deathYear: 1848,
    oneLine:
      "Reclusive genius whose Wuthering Heights unleashed a wild, elemental passion onto the English moors.",
  },
  "Anne Brontë": {
    name: "Anne Brontë",
    country: "GBR",
    birthYear: 1820,
    deathYear: 1849,
    oneLine:
      "Youngest Brontë sister whose Tenant of Wildfell Hall confronted domestic abuse with quiet courage.",
  },
  "Elizabeth Gaskell": {
    name: "Elizabeth Gaskell",
    country: "GBR",
    birthYear: 1810,
    deathYear: 1865,
    oneLine:
      "Industrial-era novelist who bridged the worlds of factory workers and the genteel in North and South.",
  },
  "Anthony Trollope": {
    name: "Anthony Trollope",
    country: "GBR",
    birthYear: 1815,
    deathYear: 1882,
    oneLine:
      "Prolific postal clerk turned novelist who mapped Victorian England's clergy and politics across dozens of books.",
  },
  "George Eliot": {
    name: "George Eliot",
    country: "GBR",
    birthYear: 1819,
    deathYear: 1880,
    oneLine:
      "Pen name of Mary Ann Evans, whose Middlemarch is the supreme realist novel in English.",
  },
  "Wilkie Collins": {
    name: "Wilkie Collins",
    country: "GBR",
    birthYear: 1824,
    deathYear: 1889,
    oneLine:
      "Pioneer of the detective novel whose Woman in White and Moonstone kept Victorian readers spellbound.",
  },
  "William Makepeace Thackeray": {
    name: "William Makepeace Thackeray",
    country: "GBR",
    birthYear: 1811,
    deathYear: 1863,
    oneLine:
      "Satirist of Victorian vanity whose Vanity Fair skewered social climbing without a single hero.",
  },
  "Lewis Carroll": {
    name: "Lewis Carroll",
    country: "GBR",
    birthYear: 1832,
    deathYear: 1898,
    oneLine:
      "Oxford mathematician who sent Alice down a rabbit hole into the most inventive nonsense in English.",
  },
  "Thomas Hardy": {
    name: "Thomas Hardy",
    country: "GBR",
    birthYear: 1840,
    deathYear: 1928,
    oneLine:
      "Wessex novelist and poet who pitted human desire against an indifferent, crushing fate.",
  },
  "Robert Louis Stevenson": {
    name: "Robert Louis Stevenson",
    country: "GBR",
    birthYear: 1850,
    deathYear: 1894,
    oneLine:
      "Scottish storyteller who split the self into Jekyll and Hyde and sent Jim Hawkins after treasure.",
  },
  "Rudyard Kipling": {
    name: "Rudyard Kipling",
    country: "GBR",
    birthYear: 1865,
    deathYear: 1936,
    oneLine:
      "India-born Nobel laureate whose Jungle Book and Kim gave the British Empire its most vivid fictions.",
  },
  "H. G. Wells": {
    name: "H. G. Wells",
    country: "GBR",
    birthYear: 1866,
    deathYear: 1946,
    oneLine:
      "Visionary who invented time travel, alien invasion, and invisible men for the modern scientific imagination.",
  },
  "Arthur Conan Doyle": {
    name: "Arthur Conan Doyle",
    country: "GBR",
    birthYear: 1859,
    deathYear: 1930,
    oneLine:
      "Edinburgh physician who created Sherlock Holmes, the most famous detective in literary history.",
  },
  "H. Rider Haggard": {
    name: "H. Rider Haggard",
    country: "GBR",
    birthYear: 1856,
    deathYear: 1925,
    oneLine:
      "Adventure novelist whose King Solomon's Mines opened the lost-world genre.",
  },
  "Kenneth Grahame": {
    name: "Kenneth Grahame",
    country: "GBR",
    birthYear: 1859,
    deathYear: 1932,
    oneLine:
      "Bank of England secretary who conjured the idyllic riverbank world of The Wind in the Willows.",
  },
  "J. M. Barrie": {
    name: "J. M. Barrie",
    country: "GBR",
    birthYear: 1860,
    deathYear: 1937,
    oneLine:
      "Scottish playwright who gave the world Peter Pan and the dream of never growing up.",
  },
  "E. M. Forster": {
    name: "E. M. Forster",
    country: "GBR",
    birthYear: 1879,
    deathYear: 1970,
    oneLine:
      "Edwardian novelist who commanded his readers to only connect across class and culture.",
  },
  "Virginia Woolf": {
    name: "Virginia Woolf",
    country: "GBR",
    birthYear: 1882,
    deathYear: 1941,
    oneLine:
      "Bloomsbury modernist who dissolved the solid Victorian novel into streams of luminous consciousness.",
  },
  "D. H. Lawrence": {
    name: "D. H. Lawrence",
    country: "GBR",
    birthYear: 1885,
    deathYear: 1930,
    oneLine:
      "Coal miner's son who wrote with volcanic intensity about desire, class, and the instinctual self.",
  },
  "Agatha Christie": {
    name: "Agatha Christie",
    country: "GBR",
    birthYear: 1890,
    deathYear: 1976,
    oneLine:
      "Queen of Crime whose ingenious puzzles made her the best-selling novelist of all time.",
  },
  "Aldous Huxley": {
    name: "Aldous Huxley",
    country: "GBR",
    birthYear: 1894,
    deathYear: 1963,
    oneLine:
      "Visionary satirist who imagined a pleasure-drugged dystopia in Brave New World.",
  },
  "John Galsworthy": {
    name: "John Galsworthy",
    country: "GBR",
    birthYear: 1867,
    deathYear: 1933,
    oneLine:
      "Nobel laureate who chronicled the Forsyte family as a mirror of English property and propriety.",
  },
  "Ford Madox Ford": {
    name: "Ford Madox Ford",
    country: "GBR",
    birthYear: 1873,
    deathYear: 1939,
    oneLine:
      "Edwardian editor and novelist whose The Good Soldier perfected the unreliable narrator.",
  },
  "W. Somerset Maugham": {
    name: "W. Somerset Maugham",
    country: "GBR",
    birthYear: 1874,
    deathYear: 1965,
    oneLine:
      "Globe-trotting storyteller whose Of Human Bondage drew on a lifetime of sharp-eyed observation.",
  },
  "Alfred, Lord Tennyson": {
    name: "Alfred, Lord Tennyson",
    country: "GBR",
    birthYear: 1809,
    deathYear: 1892,
    oneLine:
      "Victorian Poet Laureate who gave grief, duty, and empire their most musical English verses.",
  },
  "Ann Radcliffe": {
    name: "Ann Radcliffe",
    country: "GBR",
    birthYear: 1764,
    deathYear: 1823,
    oneLine:
      "Gothic pioneer whose atmospheric romances of terror made her the highest-paid novelist of the 1790s.",
  },
  "M. G. Lewis": {
    name: "M. G. Lewis",
    country: "GBR",
    birthYear: 1775,
    deathYear: 1818,
    oneLine:
      "Scandalous Gothic novelist whose The Monk shocked Regency England with its lurid horrors.",
  },
  "Maria Edgeworth": {
    name: "Maria Edgeworth",
    country: "GBR",
    birthYear: 1768,
    deathYear: 1849,
    oneLine:
      "Anglo-Irish novelist whose Castle Rackrent pioneered the regional and historical novel.",
  },
  "Anna Sewell": {
    name: "Anna Sewell",
    country: "GBR",
    birthYear: 1820,
    deathYear: 1878,
    oneLine:
      "Author of Black Beauty, the novel that changed how the English-speaking world treated horses.",
  },
  "Frances Hodgson Burnett": {
    name: "Frances Hodgson Burnett",
    country: "GBR",
    birthYear: 1849,
    deathYear: 1924,
    oneLine:
      "Anglo-American storyteller whose Secret Garden and Little Lord Fauntleroy enchanted generations of children.",
  },
  "John Buchan": {
    name: "John Buchan",
    country: "GBR",
    birthYear: 1875,
    deathYear: 1940,
    oneLine:
      "Scottish statesman and thriller writer who created Richard Hannay in The Thirty-Nine Steps.",
  },
  "Radclyffe Hall": {
    name: "Radclyffe Hall",
    country: "GBR",
    birthYear: 1880,
    deathYear: 1943,
    oneLine:
      "Novelist whose banned Well of Loneliness became a landmark of LGBTQ literary history.",
  },
  "Richard Brinsley Sheridan": {
    name: "Richard Brinsley Sheridan",
    country: "GBR",
    birthYear: 1751,
    deathYear: 1816,
    oneLine:
      "Anglo-Irish playwright and politician whose School for Scandal lampooned Georgian high society.",
  },

  // ── IRELAND ───────────────────────────────────────────────────────────────
  "Oscar Wilde": {
    name: "Oscar Wilde",
    country: "IRL",
    birthYear: 1854,
    deathYear: 1900,
    oneLine:
      "Dublin wit who turned paradox into art and paid for transgression with ruin.",
  },
  "George Bernard Shaw": {
    name: "George Bernard Shaw",
    country: "IRL",
    birthYear: 1856,
    deathYear: 1950,
    oneLine:
      "Irish polemicist and Nobel laureate who made the stage a platform for intellectual combat.",
  },
  "Jonathan Swift": {
    name: "Jonathan Swift",
    country: "IRL",
    birthYear: 1667,
    deathYear: 1745,
    oneLine:
      "Dean of St Patrick's whose savage satire in Gulliver's Travels exposed the absurdity of human pretension.",
  },
  "Bram Stoker": {
    name: "Bram Stoker",
    country: "IRL",
    birthYear: 1847,
    deathYear: 1912,
    oneLine:
      "Dublin-born theater manager who unleashed Count Dracula on the modern imagination.",
  },
  "James Joyce": {
    name: "James Joyce",
    country: "IRL",
    birthYear: 1882,
    deathYear: 1941,
    oneLine:
      "Self-exiled Dubliner who reinvented the novel with Ulysses and mapped an entire city in a single day.",
  },

  // ── FRANCE ────────────────────────────────────────────────────────────────
  Voltaire: {
    name: "Voltaire",
    country: "FRA",
    birthYear: 1694,
    deathYear: 1778,
    oneLine:
      "Enlightenment titan who wielded satire against intolerance and told us to cultivate our gardens.",
  },
  "Jean-Jacques Rousseau": {
    name: "Jean-Jacques Rousseau",
    country: "FRA",
    birthYear: 1712,
    deathYear: 1778,
    oneLine:
      "Genevan philosopher who argued that civilization corrupts and the social contract liberates.",
  },
  "Pierre Choderlos de Laclos": {
    name: "Pierre Choderlos de Laclos",
    country: "FRA",
    birthYear: 1741,
    deathYear: 1803,
    oneLine:
      "Artillery officer whose Dangerous Liaisons dissected aristocratic seduction as psychological warfare.",
  },
  Stendhal: {
    name: "Stendhal",
    country: "FRA",
    birthYear: 1783,
    deathYear: 1842,
    oneLine:
      "Napoleonic veteran whose The Red and the Black pioneered the psychological novel of ambition.",
  },
  "Honoré de Balzac": {
    name: "Honoré de Balzac",
    country: "FRA",
    birthYear: 1799,
    deathYear: 1850,
    oneLine:
      "Tireless novelist who catalogued all of French society in the vast Human Comedy.",
  },
  "Victor Hugo": {
    name: "Victor Hugo",
    country: "FRA",
    birthYear: 1802,
    deathYear: 1885,
    oneLine:
      "Romantic colossus whose Les Misérables and Hunchback gave literature its grandest moral panoramas.",
  },
  "Alexandre Dumas": {
    name: "Alexandre Dumas",
    country: "FRA",
    birthYear: 1802,
    deathYear: 1870,
    oneLine:
      "Swashbuckling storyteller who gave the world the Three Musketeers and the Count of Monte Cristo.",
  },
  "Gustave Flaubert": {
    name: "Gustave Flaubert",
    country: "FRA",
    birthYear: 1821,
    deathYear: 1880,
    oneLine:
      "Perfectionist stylist whose Madame Bovary put the modern novel under a merciless microscope.",
  },
  "Jules Verne": {
    name: "Jules Verne",
    country: "FRA",
    birthYear: 1828,
    deathYear: 1905,
    oneLine:
      "Father of science fiction who sent readers around the world, to the moon, and twenty thousand leagues under the sea.",
  },
  "Émile Zola": {
    name: "Émile Zola",
    country: "FRA",
    birthYear: 1840,
    deathYear: 1902,
    oneLine:
      "Naturalist novelist who exposed industrial France's brutality and championed Dreyfus with a single accusation.",
  },
  "Marcel Proust": {
    name: "Marcel Proust",
    country: "FRA",
    birthYear: 1871,
    deathYear: 1922,
    oneLine:
      "Cork-lined recluse who recovered lost time in the longest and most luminous novel ever written.",
  },
  "Gaston Leroux": {
    name: "Gaston Leroux",
    country: "FRA",
    birthYear: 1868,
    deathYear: 1927,
    oneLine:
      "French journalist and mystery writer who haunted the Paris Opera with the Phantom.",
  },
  "René Descartes": {
    name: "René Descartes",
    country: "FRA",
    birthYear: 1596,
    deathYear: 1650,
    oneLine:
      "Philosopher who doubted everything until he found certainty in thought itself.",
  },

  // ── RUSSIA ────────────────────────────────────────────────────────────────
  "Alexander Pushkin": {
    name: "Alexander Pushkin",
    country: "RUS",
    birthYear: 1799,
    deathYear: 1837,
    oneLine:
      "Russia's national poet who forged the modern Russian literary language and died in a duel at 37.",
  },
  "Nikolai Gogol": {
    name: "Nikolai Gogol",
    country: "RUS",
    birthYear: 1809,
    deathYear: 1852,
    oneLine:
      "Ukrainian-born satirist whose Dead Souls and grotesque tales founded Russian prose fiction.",
  },
  "Ivan Turgenev": {
    name: "Ivan Turgenev",
    country: "RUS",
    birthYear: 1818,
    deathYear: 1883,
    oneLine:
      "Elegiac novelist who gave Russian literature Fathers and Sons and the concept of the nihilist.",
  },
  "Fyodor Dostoevsky": {
    name: "Fyodor Dostoevsky",
    country: "RUS",
    birthYear: 1821,
    deathYear: 1881,
    oneLine:
      "Russian novelist who mapped the moral extremes of the soul from Siberian exile to spiritual revelation.",
  },
  "Leo Tolstoy": {
    name: "Leo Tolstoy",
    country: "RUS",
    birthYear: 1828,
    deathYear: 1910,
    oneLine:
      "Count turned prophet whose War and Peace and Anna Karenina are the twin summits of the realist novel.",
  },
  "Anton Chekhov": {
    name: "Anton Chekhov",
    country: "RUS",
    birthYear: 1860,
    deathYear: 1904,
    oneLine:
      "Physician and master of the short story who revolutionized modern drama with understated sadness.",
  },
  "Yevgeny Zamyatin": {
    name: "Yevgeny Zamyatin",
    country: "RUS",
    birthYear: 1884,
    deathYear: 1937,
    oneLine:
      "Soviet dissident whose dystopian We inspired both Brave New World and Nineteen Eighty-Four.",
  },

  // ── UNITED STATES ─────────────────────────────────────────────────────────
  "Benjamin Franklin": {
    name: "Benjamin Franklin",
    country: "USA",
    birthYear: 1706,
    deathYear: 1790,
    oneLine:
      "Founding father, inventor, and sage whose Autobiography defined the American self-made ideal.",
  },
  "Alexander Hamilton": {
    name: "Alexander Hamilton",
    country: "USA",
    birthYear: 1755,
    deathYear: 1804,
    oneLine:
      "Founding father and first Treasury Secretary who co-authored The Federalist Papers.",
  },
  "Thomas Paine": {
    name: "Thomas Paine",
    country: "USA",
    birthYear: 1737,
    deathYear: 1809,
    oneLine:
      "Revolutionary pamphleteer whose Common Sense ignited American independence.",
  },
  "Nathaniel Hawthorne": {
    name: "Nathaniel Hawthorne",
    country: "USA",
    birthYear: 1804,
    deathYear: 1864,
    oneLine:
      "Puritan descendant who probed guilt, sin, and hypocrisy in The Scarlet Letter.",
  },
  "Herman Melville": {
    name: "Herman Melville",
    country: "USA",
    birthYear: 1819,
    deathYear: 1891,
    oneLine:
      "Whale-ship sailor turned metaphysical novelist whose Moby-Dick was rediscovered as an American masterpiece.",
  },
  "Walt Whitman": {
    name: "Walt Whitman",
    country: "USA",
    birthYear: 1819,
    deathYear: 1892,
    oneLine:
      "Bardic poet who sang the body electric and contained multitudes in Leaves of Grass.",
  },
  "Henry David Thoreau": {
    name: "Henry David Thoreau",
    country: "USA",
    birthYear: 1817,
    deathYear: 1862,
    oneLine:
      "Walden hermit and abolitionist who taught the world civil disobedience through deliberate living.",
  },
  "Frederick Douglass": {
    name: "Frederick Douglass",
    country: "USA",
    birthYear: 1818,
    deathYear: 1895,
    oneLine:
      "Escaped slave turned orator whose Narrative became the most powerful indictment of American bondage.",
  },
  "Harriet Beecher Stowe": {
    name: "Harriet Beecher Stowe",
    country: "USA",
    birthYear: 1811,
    deathYear: 1896,
    oneLine:
      "Abolitionist novelist whose Uncle Tom's Cabin inflamed the conscience of a nation on the brink of civil war.",
  },
  "Harriet Jacobs": {
    name: "Harriet Jacobs",
    country: "USA",
    birthYear: 1813,
    deathYear: 1897,
    oneLine:
      "Formerly enslaved author whose Incidents in the Life of a Slave Girl exposed the sexual violence of bondage.",
  },
  "Solomon Northup": {
    name: "Solomon Northup",
    country: "USA",
    birthYear: 1807,
    deathYear: 1863,
    oneLine:
      "Free Black man kidnapped into slavery whose Twelve Years a Slave testified to an unimaginable ordeal.",
  },
  "Louisa May Alcott": {
    name: "Louisa May Alcott",
    country: "USA",
    birthYear: 1832,
    deathYear: 1888,
    oneLine:
      "Civil War nurse whose Little Women gave American girlhood its most beloved literary family.",
  },
  "Mark Twain": {
    name: "Mark Twain",
    country: "USA",
    birthYear: 1835,
    deathYear: 1910,
    oneLine:
      "Mississippi riverman who invented the American voice in Huckleberry Finn and made a nation laugh at itself.",
  },
  "Henry James": {
    name: "Henry James",
    country: "USA",
    birthYear: 1843,
    deathYear: 1916,
    oneLine:
      "Transatlantic master who refined the novel of consciousness to an art of exquisite ambiguity.",
  },
  "Kate Chopin": {
    name: "Kate Chopin",
    country: "USA",
    birthYear: 1850,
    deathYear: 1904,
    oneLine:
      "Louisiana writer whose The Awakening scandalized America with its portrait of female desire and autonomy.",
  },
  "Stephen Crane": {
    name: "Stephen Crane",
    country: "USA",
    birthYear: 1871,
    deathYear: 1900,
    oneLine:
      "Young naturalist who wrote The Red Badge of Courage without ever seeing battle and died at 28.",
  },
  "Edith Wharton": {
    name: "Edith Wharton",
    country: "USA",
    birthYear: 1862,
    deathYear: 1937,
    oneLine:
      "First woman to win the Pulitzer for Fiction, who laid bare the gilded cages of New York high society.",
  },
  "Jack London": {
    name: "Jack London",
    country: "USA",
    birthYear: 1876,
    deathYear: 1916,
    oneLine:
      "Adventurer and socialist whose Call of the Wild gave voice to primal instinct in the frozen north.",
  },
  "L. Frank Baum": {
    name: "L. Frank Baum",
    country: "USA",
    birthYear: 1856,
    deathYear: 1919,
    oneLine:
      "American fabulist who swept Dorothy to Oz and built the first great American fairy tale.",
  },
  "Upton Sinclair": {
    name: "Upton Sinclair",
    country: "USA",
    birthYear: 1878,
    deathYear: 1968,
    oneLine:
      "Muckraking novelist whose The Jungle aimed at America's heart and hit its stomach.",
  },
  "Frank Norris": {
    name: "Frank Norris",
    country: "USA",
    birthYear: 1870,
    deathYear: 1902,
    oneLine:
      "Naturalist novelist who exposed greed and railroad power in McTeague and The Octopus.",
  },
  "Booker T. Washington": {
    name: "Booker T. Washington",
    country: "USA",
    birthYear: 1856,
    deathYear: 1915,
    oneLine:
      "Born into slavery, he rose to lead Tuskegee Institute and wrote the influential Up from Slavery.",
  },
  "W. E. B. Du Bois": {
    name: "W. E. B. Du Bois",
    country: "USA",
    birthYear: 1868,
    deathYear: 1963,
    oneLine:
      "Scholar and activist whose The Souls of Black Folk defined the struggle for racial justice in America.",
  },
  "James Weldon Johnson": {
    name: "James Weldon Johnson",
    country: "USA",
    birthYear: 1871,
    deathYear: 1938,
    oneLine:
      "Harlem Renaissance polymath whose Autobiography of an Ex-Colored Man explored racial passing.",
  },
  "Willa Cather": {
    name: "Willa Cather",
    country: "USA",
    birthYear: 1873,
    deathYear: 1947,
    oneLine:
      "Prairie novelist who celebrated the immigrant spirit and the vast silence of the American plains.",
  },
  "Robert Frost": {
    name: "Robert Frost",
    country: "USA",
    birthYear: 1874,
    deathYear: 1963,
    oneLine:
      "New England poet who hid existential depths beneath deceptively simple roads and stone walls.",
  },
  "Gertrude Stein": {
    name: "Gertrude Stein",
    country: "USA",
    birthYear: 1874,
    deathYear: 1946,
    oneLine:
      "Parisian expatriate whose radical repetitions and verbal experiments remade the possibilities of English prose.",
  },
  "Sinclair Lewis": {
    name: "Sinclair Lewis",
    country: "USA",
    birthYear: 1885,
    deathYear: 1951,
    oneLine:
      "First American Nobel laureate in literature, who satirized small-town conformity in Main Street and Babbitt.",
  },
  "Eugene O'Neill": {
    name: "Eugene O'Neill",
    country: "USA",
    birthYear: 1888,
    deathYear: 1953,
    oneLine:
      "Nobel-winning playwright who dragged American drama into tragic seriousness with Long Day's Journey Into Night.",
  },
  "Anita Loos": {
    name: "Anita Loos",
    country: "USA",
    birthYear: 1889,
    deathYear: 1981,
    oneLine:
      "Hollywood screenwriter whose Gentlemen Prefer Blondes proved that comic fiction could be devastatingly smart.",
  },
  "Nella Larsen": {
    name: "Nella Larsen",
    country: "USA",
    birthYear: 1891,
    deathYear: 1964,
    oneLine:
      "Harlem Renaissance novelist whose Passing explored the dangerous fluidity of racial identity.",
  },
  "Jean Toomer": {
    name: "Jean Toomer",
    country: "USA",
    birthYear: 1894,
    deathYear: 1967,
    oneLine:
      "Harlem Renaissance innovator whose Cane fused poetry, prose, and drama into a portrait of Black Southern life.",
  },
  "F. Scott Fitzgerald": {
    name: "F. Scott Fitzgerald",
    country: "USA",
    birthYear: 1896,
    deathYear: 1940,
    oneLine:
      "Jazz Age chronicler who distilled the American Dream's promise and poison into The Great Gatsby.",
  },
  "William Faulkner": {
    name: "William Faulkner",
    country: "USA",
    birthYear: 1897,
    deathYear: 1962,
    oneLine:
      "Southern Nobel laureate who fractured time and voice to unearth Yoknapatawpha County's buried sins.",
  },
  "Ernest Hemingway": {
    name: "Ernest Hemingway",
    country: "USA",
    birthYear: 1899,
    deathYear: 1961,
    oneLine:
      "War correspondent who stripped English prose to the bone and defined courage as grace under pressure.",
  },
  "Dashiell Hammett": {
    name: "Dashiell Hammett",
    country: "USA",
    birthYear: 1894,
    deathYear: 1961,
    oneLine:
      "Ex-Pinkerton detective who invented hard-boiled crime fiction with The Maltese Falcon.",
  },
  "Thomas Wolfe": {
    name: "Thomas Wolfe",
    country: "USA",
    birthYear: 1900,
    deathYear: 1938,
    oneLine:
      "Torrential Southern novelist who poured autobiographical longing into Look Homeward, Angel.",
  },
  "John Dos Passos": {
    name: "John Dos Passos",
    country: "USA",
    birthYear: 1896,
    deathYear: 1970,
    oneLine:
      "Modernist innovator whose U.S.A. trilogy spliced newsreels, biography, and fiction into a panorama of American life.",
  },
  "Booth Tarkington": {
    name: "Booth Tarkington",
    country: "USA",
    birthYear: 1869,
    deathYear: 1946,
    oneLine:
      "Two-time Pulitzer winner who chronicled the rise and fall of Midwestern American families.",
  },
  "Edna Ferber": {
    name: "Edna Ferber",
    country: "USA",
    birthYear: 1885,
    deathYear: 1968,
    oneLine:
      "Pulitzer-winning novelist whose So Big and Show Boat captured the sweep of American ambition.",
  },
  "Edward Bellamy": {
    name: "Edward Bellamy",
    country: "USA",
    birthYear: 1850,
    deathYear: 1898,
    oneLine:
      "Utopian novelist whose Looking Backward imagined a socialist paradise in the year 2000.",
  },
  "Samuel Butler": {
    name: "Samuel Butler",
    country: "GBR",
    birthYear: 1835,
    deathYear: 1902,
    oneLine:
      "Victorian iconoclast whose satirical Erewhon turned English values upside down.",
  },
  "William James": {
    name: "William James",
    country: "USA",
    birthYear: 1842,
    deathYear: 1910,
    oneLine:
      "Philosopher and psychologist who founded pragmatism and mapped the varieties of religious experience.",
  },
  "Edwin A. Abbott": {
    name: "Edwin A. Abbott",
    country: "GBR",
    birthYear: 1838,
    deathYear: 1926,
    oneLine:
      "Victorian schoolmaster who satirized social hierarchy through geometry in Flatland.",
  },

  // ── GERMANY ───────────────────────────────────────────────────────────────
  "J. W. von Goethe": {
    name: "J. W. von Goethe",
    country: "DEU",
    birthYear: 1749,
    deathYear: 1832,
    oneLine:
      "Germany's supreme man of letters whose Faust dramatized the restless Western will to know everything.",
  },
  "Friedrich Nietzsche": {
    name: "Friedrich Nietzsche",
    country: "DEU",
    birthYear: 1844,
    deathYear: 1900,
    oneLine:
      "Philosopher who declared God dead, championed the will to power, and wrote with aphoristic brilliance.",
  },
  "Thomas Mann": {
    name: "Thomas Mann",
    country: "DEU",
    birthYear: 1875,
    deathYear: 1955,
    oneLine:
      "Nobel laureate who diagnosed European civilization's sickness in The Magic Mountain and Buddenbrooks.",
  },
  "Erich Maria Remarque": {
    name: "Erich Maria Remarque",
    country: "DEU",
    birthYear: 1898,
    deathYear: 1970,
    oneLine:
      "World War I veteran whose All Quiet on the Western Front became the definitive anti-war novel.",
  },
  "Karl Marx": {
    name: "Karl Marx",
    country: "DEU",
    birthYear: 1818,
    deathYear: 1883,
    oneLine:
      "Revolutionary philosopher whose Capital and Communist Manifesto reshaped the political landscape of the modern world.",
  },

  // ── AUSTRIA / CZECH ───────────────────────────────────────────────────────
  "Hermann Hesse": {
    name: "Hermann Hesse",
    country: "DEU",
    birthYear: 1877,
    deathYear: 1962,
    oneLine:
      "German-Swiss Nobel laureate who sent Siddhartha and Steppenwolf on journeys of spiritual self-discovery.",
  },
  "Ludwig Wittgenstein": {
    name: "Ludwig Wittgenstein",
    country: "AUT",
    birthYear: 1889,
    deathYear: 1951,
    oneLine:
      "Austrian philosopher who redefined the limits of language and thought in the Tractatus.",
  },
  "Franz Kafka": {
    name: "Franz Kafka",
    country: "CZE",
    birthYear: 1883,
    deathYear: 1924,
    oneLine:
      "Prague insurance clerk who turned modern bureaucratic dread into indelible literary nightmares.",
  },
  "Baroness Orczy": {
    name: "Baroness Orczy",
    country: "HUN",
    birthYear: 1865,
    deathYear: 1947,
    oneLine:
      "Hungarian-British novelist who created the Scarlet Pimpernel, the original masked avenger.",
  },

  // ── SPAIN ─────────────────────────────────────────────────────────────────
  "Miguel de Cervantes": {
    name: "Miguel de Cervantes",
    country: "ESP",
    birthYear: 1547,
    deathYear: 1616,
    oneLine:
      "One-armed soldier who invented the modern novel with Don Quixote's impossible quest.",
  },

  // ── SCANDINAVIA ───────────────────────────────────────────────────────────
  "Henrik Ibsen": {
    name: "Henrik Ibsen",
    country: "NOR",
    birthYear: 1828,
    deathYear: 1906,
    oneLine:
      "Father of modern drama who tore the masks off bourgeois respectability in A Doll's House.",
  },
  "August Strindberg": {
    name: "August Strindberg",
    country: "SWE",
    birthYear: 1849,
    deathYear: 1912,
    oneLine:
      "Swedish dramatist whose Miss Julie and The Father laid bare the war between the sexes.",
  },

  // ── FINLAND ───────────────────────────────────────────────────────────────
  "Elias Lönnrot": {
    name: "Elias Lönnrot",
    country: "FIN",
    birthYear: 1802,
    deathYear: 1884,
    oneLine:
      "Finnish physician who compiled the Kalevala from oral folk poetry and gave Finland its national epic.",
  },

  // ── SWITZERLAND ───────────────────────────────────────────────────────────
  "Johanna Spyri": {
    name: "Johanna Spyri",
    country: "CHE",
    birthYear: 1827,
    deathYear: 1901,
    oneLine:
      "Swiss author whose Heidi carried the Alpine spirit into children's literature worldwide.",
  },

  // ── POLAND / UKRAINE (Joseph Conrad) ──────────────────────────────────────
  "Joseph Conrad": {
    name: "Joseph Conrad",
    country: "POL",
    birthYear: 1857,
    deathYear: 1924,
    oneLine:
      "Polish-born mariner who mastered English prose and sailed into the heart of moral darkness.",
  },

  // ── INDIA ─────────────────────────────────────────────────────────────────
  "Rabindranath Tagore": {
    name: "Rabindranath Tagore",
    country: "IND",
    birthYear: 1861,
    deathYear: 1941,
    oneLine:
      "Bengali polymath and first non-European Nobel laureate in literature, who composed India's national anthem.",
  },
  "Mahatma Gandhi": {
    name: "Mahatma Gandhi",
    country: "IND",
    birthYear: 1869,
    deathYear: 1948,
    oneLine:
      "Leader of Indian independence whose autobiography charted his experiments with truth and nonviolent resistance.",
  },

  // ── CHINA ─────────────────────────────────────────────────────────────────
  "Sun Tzu": {
    name: "Sun Tzu",
    country: "CHN",
    birthYear: -544,
    deathYear: -496,
    oneLine:
      "Ancient Chinese strategist whose Art of War remains the world's most influential treatise on conflict.",
  },
  Laozi: {
    name: "Laozi",
    country: "CHN",
    birthYear: -601,
    deathYear: -531,
    oneLine:
      "Legendary sage whose Tao Te Ching distilled the Way into 81 chapters of paradox and wisdom.",
  },

  // ── JAPAN ─────────────────────────────────────────────────────────────────
  "Natsume Sōseki": {
    name: "Natsume Sōseki",
    country: "JPN",
    birthYear: 1867,
    deathYear: 1916,
    oneLine:
      "Father of modern Japanese fiction who explored loneliness and moral crisis in Meiji-era Tokyo.",
  },

  // ── PERSIA / IRAN ─────────────────────────────────────────────────────────
  "Omar Khayyám": {
    name: "Omar Khayyám",
    country: "IRN",
    birthYear: 1048,
    deathYear: 1131,
    oneLine:
      "Persian polymath whose Rubáiyát celebrated wine, impermanence, and the fleeting beauty of existence.",
  },

  // ── LEBANON ───────────────────────────────────────────────────────────────
  "Khalil Gibran": {
    name: "Khalil Gibran",
    country: "LBN",
    birthYear: 1883,
    deathYear: 1931,
    oneLine:
      "Lebanese-American poet whose The Prophet distilled love, freedom, and sorrow into luminous parables.",
  },

  // ── SCOTLAND (separate cultural identity, but GBR) ────────────────────────
  "Adam Smith": {
    name: "Adam Smith",
    country: "GBR",
    birthYear: 1723,
    deathYear: 1790,
    oneLine:
      "Scottish philosopher whose Wealth of Nations laid the intellectual foundations of modern economics.",
  },
  "David Hume": {
    name: "David Hume",
    country: "GBR",
    birthYear: 1711,
    deathYear: 1776,
    oneLine:
      "Scottish empiricist who questioned causation, miracles, and the very foundations of human knowledge.",
  },

  // ── ENGLAND — PHILOSOPHY / POLITICAL THOUGHT ──────────────────────────────
  "John Locke": {
    name: "John Locke",
    country: "GBR",
    birthYear: 1632,
    deathYear: 1704,
    oneLine:
      "Philosopher of liberty whose Two Treatises of Government shaped constitutional democracy.",
  },
  "Thomas Hobbes": {
    name: "Thomas Hobbes",
    country: "GBR",
    birthYear: 1588,
    deathYear: 1679,
    oneLine:
      "Political philosopher who saw the state of nature as war and the Leviathan as humanity's only refuge.",
  },
  "John Stuart Mill": {
    name: "John Stuart Mill",
    country: "GBR",
    birthYear: 1806,
    deathYear: 1873,
    oneLine:
      "Utilitarian philosopher who championed individual liberty and the greatest happiness principle.",
  },
  "John Maynard Keynes": {
    name: "John Maynard Keynes",
    country: "GBR",
    birthYear: 1883,
    deathYear: 1946,
    oneLine:
      "Economist who revolutionized fiscal policy and argued governments should spend their way out of depression.",
  },
  "Charles Darwin": {
    name: "Charles Darwin",
    country: "GBR",
    birthYear: 1809,
    deathYear: 1882,
    oneLine:
      "Naturalist whose On the Origin of Species revealed evolution by natural selection and transformed biology.",
  },
  "Bertrand Russell": {
    name: "Bertrand Russell",
    country: "GBR",
    birthYear: 1872,
    deathYear: 1970,
    oneLine:
      "Nobel-winning philosopher and pacifist who pursued mathematical logic and political justice with equal rigor.",
  },
  "Edward Gibbon": {
    name: "Edward Gibbon",
    country: "GBR",
    birthYear: 1737,
    deathYear: 1794,
    oneLine:
      "Historian whose Decline and Fall of the Roman Empire set the standard for monumental narrative history.",
  },

  // ── CANADA ────────────────────────────────────────────────────────────────
  "L. M. Montgomery": {
    name: "L. M. Montgomery",
    country: "CAN",
    birthYear: 1874,
    deathYear: 1942,
    oneLine:
      "Prince Edward Island storyteller who gave the world the irrepressible Anne of Green Gables.",
  },

  // ── ANONYMOUS / UNKNOWN ───────────────────────────────────────────────────
  Anonymous: {
    name: "Anonymous",
    country: "ZZZ",
    oneLine:
      "Works of unknown or collective authorship spanning many centuries and cultures.",
  },
  Unknown: {
    name: "Unknown",
    country: "ZZZ",
    oneLine:
      "Author identity lost to time; the work endures beyond its maker.",
  },

  // ── TIER 1 + TIER 2 AUTHORS ────────────────────────────────────────────────

  "André Gide": {
    name: "André Gide",
    country: "FRA",
    birthYear: 1869,
    deathYear: 1951,
    oneLine: "Nobel laureate whose Counterfeiters pioneered metafiction and challenged every moral convention.",
  },
  "Luís de Camões": {
    name: "Luís de Camões",
    country: "PRT",
    birthYear: 1524,
    deathYear: 1580,
    oneLine: "Portugal's national poet whose Lusiads is the last great Renaissance epic.",
  },
  "A. E. W. Mason": {
    name: "A. E. W. Mason",
    country: "GBR",
    birthYear: 1865,
    deathYear: 1948,
    oneLine: "Adventure novelist whose Four Feathers is the definitive story of cowardice and redemption.",
  },
  "Claude McKay": {
    name: "Claude McKay",
    country: "JAM",
    birthYear: 1889,
    deathYear: 1948,
    oneLine: "Jamaican-American poet and novelist who launched the Harlem Renaissance with Home to Harlem.",
  },
  "Jorge Isaacs": {
    name: "Jorge Isaacs",
    country: "COL",
    birthYear: 1837,
    deathYear: 1895,
    oneLine: "Colombian author of María, the most celebrated romantic novel of 19th-century Latin America.",
  },
  "Jerome K. Jerome": {
    name: "Jerome K. Jerome",
    country: "GBR",
    birthYear: 1859,
    deathYear: 1927,
    oneLine: "Author of Three Men in a Boat, the funniest English novel about doing absolutely nothing.",
  },
  "P. G. Wodehouse": {
    name: "P. G. Wodehouse",
    country: "GBR",
    birthYear: 1881,
    deathYear: 1975,
    oneLine: "Creator of Jeeves and Wooster who wrote the most perfectly crafted comic prose in English.",
  },
  "Arthur Ransome": {
    name: "Arthur Ransome",
    country: "GBR",
    birthYear: 1884,
    deathYear: 1967,
    oneLine: "Author of Swallows and Amazons who created the gold standard of children's adventure fiction.",
  },
  "Sigrid Undset": {
    name: "Sigrid Undset",
    country: "NOR",
    birthYear: 1882,
    deathYear: 1949,
    oneLine: "Nobel laureate whose Jenny and Kristin Lavransdatter are masterpieces of Scandinavian fiction.",
  },
  // ── NEW SE DOWNLOAD AUTHORS ────────────────────────────────────────────────

  "Walter Scott": {
    name: "Walter Scott",
    country: "GBR",
    birthYear: 1771,
    deathYear: 1832,
    oneLine: "Scottish novelist who invented historical fiction with Waverley and Ivanhoe.",
  },
  "Wallace Thurman": {
    name: "Wallace Thurman",
    country: "USA",
    birthYear: 1902,
    deathYear: 1934,
    oneLine: "Harlem Renaissance novelist whose Blacker the Berry confronted colorism within the Black community.",
  },

  // ── RECENTLY ADDED AUTHORS ─────────────────────────────────────────────────

  "Augustine of Hippo": {
    name: "Augustine of Hippo",
    country: "DZA",
    birthYear: 354,
    deathYear: 430,
    oneLine: "Bishop and theologian whose City of God and Confessions shaped Western Christianity and philosophy.",
  },
  "Henry Adams": {
    name: "Henry Adams",
    country: "USA",
    birthYear: 1838,
    deathYear: 1918,
    oneLine: "Descendant of presidents who wrote The Education of Henry Adams, a masterpiece of American autobiography.",
  },
  "Theodore Dreiser": {
    name: "Theodore Dreiser",
    country: "USA",
    birthYear: 1871,
    deathYear: 1945,
    oneLine: "Father of American literary naturalism whose Sister Carrie and An American Tragedy anatomized desire and ambition.",
  },

  // ── AUSTRALIAN AUTHORS ──────────────────────────────────────────────────────

  "Miles Franklin": {
    name: "Miles Franklin",
    country: "AUS",
    birthYear: 1879,
    deathYear: 1954,
    oneLine: "Australian feminist novelist whose My Brilliant Career defined the independent bush heroine.",
  },
  "Henry Lawson": {
    name: "Henry Lawson",
    country: "AUS",
    birthYear: 1867,
    deathYear: 1922,
    oneLine: "Australia's greatest short story writer, chronicler of bush life and the outback spirit.",
  },
  "Henry Handel Richardson": {
    name: "Henry Handel Richardson",
    country: "AUS",
    birthYear: 1870,
    deathYear: 1946,
    oneLine: "Australian novelist whose Getting of Wisdom explored the cruelties of colonial education.",
  },
  "Banjo Paterson": {
    name: "Banjo Paterson",
    country: "AUS",
    birthYear: 1864,
    deathYear: 1941,
    oneLine: "Australia's beloved bush poet who wrote Waltzing Matilda and The Man from Snowy River.",
  },

  // ── ADDITIONAL AUTHORS (Tier A + B additions) ─────────────────────────────

  "A. A. Milne": {
    name: "A. A. Milne",
    country: "GBR",
    birthYear: 1882,
    deathYear: 1956,
    oneLine: "Creator of Winnie-the-Pooh and the most beloved animal characters in English literature.",
  },
  "Anatole France": {
    name: "Anatole France",
    country: "FRA",
    birthYear: 1844,
    deathYear: 1924,
    oneLine: "Nobel laureate whose satirical novels and allegories skewered French civilization with devastating wit.",
  },
  "Anna Julia Cooper": {
    name: "Anna Julia Cooper",
    country: "USA",
    birthYear: 1858,
    deathYear: 1964,
    oneLine: "Black feminist intellectual whose A Voice from the South anticipated intersectional thought by a century.",
  },
  "Anthony Hope": {
    name: "Anthony Hope",
    country: "GBR",
    birthYear: 1863,
    deathYear: 1933,
    oneLine: "Creator of Ruritania and the swashbuckling adventure romance The Prisoner of Zenda.",
  },
  "Apollonius of Rhodes": {
    name: "Apollonius of Rhodes",
    country: "GRC",
    birthYear: -295,
    deathYear: -215,
    oneLine: "Head of the Library of Alexandria who composed the Argonautica, making romantic love an epic subject.",
  },
  "Apuleius": {
    name: "Apuleius",
    country: "DZA",
    birthYear: 124,
    deathYear: 170,
    oneLine: "North African author of The Golden Ass, the only complete Latin novel to survive antiquity.",
  },
  "Carlo Collodi": {
    name: "Carlo Collodi",
    country: "ITA",
    birthYear: 1826,
    deathYear: 1890,
    oneLine: "Florentine journalist who created Pinocchio, one of the most translated characters in world literature.",
  },
  "Charles Maturin": {
    name: "Charles Maturin",
    country: "IRL",
    birthYear: 1780,
    deathYear: 1824,
    oneLine: "Irish clergyman who wrote Melmoth the Wanderer, the most ambitious and terrifying Gothic novel.",
  },
  "Charles W. Chesnutt": {
    name: "Charles W. Chesnutt",
    country: "USA",
    birthYear: 1858,
    deathYear: 1932,
    oneLine: "Pioneer of African American fiction who used folklore and realism to expose racial injustice.",
  },
  "David Garnett": {
    name: "David Garnett",
    country: "GBR",
    birthYear: 1892,
    deathYear: 1981,
    oneLine: "Bloomsbury writer whose Lady into Fox won the 1922 James Tait Black Prize for its surreal fable of love.",
  },
  "Dorothy L. Sayers": {
    name: "Dorothy L. Sayers",
    country: "GBR",
    birthYear: 1893,
    deathYear: 1957,
    oneLine: "Creator of Lord Peter Wimsey and translator of Dante who elevated detective fiction into literature.",
  },
  "E. Nesbit": {
    name: "E. Nesbit",
    country: "GBR",
    birthYear: 1858,
    deathYear: 1924,
    oneLine: "Fabian socialist who invented the modern children's adventure novel with The Railway Children.",
  },
  "Edgar Allan Poe": {
    name: "Edgar Allan Poe",
    country: "USA",
    birthYear: 1809,
    deathYear: 1849,
    oneLine: "Inventor of the detective story and master of the macabre whose tales defined American Gothic.",
  },
  "Edgar Lee Masters": {
    name: "Edgar Lee Masters",
    country: "USA",
    birthYear: 1868,
    deathYear: 1950,
    oneLine: "Poet whose Spoon River Anthology gave voice to the dead of small-town America.",
  },
  "Edgar Rice Burroughs": {
    name: "Edgar Rice Burroughs",
    country: "USA",
    birthYear: 1875,
    deathYear: 1950,
    oneLine: "Creator of Tarzan and John Carter of Mars, defining adventure fiction for the 20th century.",
  },
  "Eleanor H. Porter": {
    name: "Eleanor H. Porter",
    country: "USA",
    birthYear: 1868,
    deathYear: 1920,
    oneLine: "Author of Pollyanna, whose 'glad game' entered the language as a byword for irrepressible optimism.",
  },
  "Elizabeth von Arnim": {
    name: "Elizabeth von Arnim",
    country: "GBR",
    birthYear: 1866,
    deathYear: 1941,
    oneLine: "Author of The Enchanted April, a novel of feminine liberation set in an Italian castle.",
  },
  "Erskine Childers": {
    name: "Erskine Childers",
    country: "IRL",
    birthYear: 1870,
    deathYear: 1922,
    oneLine: "Author of The Riddle of the Sands, the novel that invented the modern spy thriller.",
  },
  "Evelyn Waugh": {
    name: "Evelyn Waugh",
    country: "GBR",
    birthYear: 1903,
    deathYear: 1966,
    oneLine: "Satirist whose Decline and Fall and Brideshead Revisited dissected English society with savage precision.",
  },
  "Felix Salten": {
    name: "Felix Salten",
    country: "AUT",
    birthYear: 1869,
    deathYear: 1945,
    oneLine: "Austrian author of Bambi, a philosophical allegory far darker than its famous Disney adaptation.",
  },
  "Frances Ellen Watkins Harper": {
    name: "Frances Ellen Watkins Harper",
    country: "USA",
    birthYear: 1825,
    deathYear: 1911,
    oneLine: "Abolitionist poet and novelist whose Iola Leroy championed racial uplift and education.",
  },
  "G. K. Chesterton": {
    name: "G. K. Chesterton",
    country: "GBR",
    birthYear: 1874,
    deathYear: 1936,
    oneLine: "Paradoxist who created Father Brown and The Man Who Was Thursday, blending mystery with metaphysics.",
  },
  "George MacDonald": {
    name: "George MacDonald",
    country: "GBR",
    birthYear: 1824,
    deathYear: 1905,
    oneLine: "Scottish fantasist whose fairy tales directly inspired C. S. Lewis and J. R. R. Tolkien.",
  },
  "H. P. Lovecraft": {
    name: "H. P. Lovecraft",
    country: "USA",
    birthYear: 1890,
    deathYear: 1937,
    oneLine: "Creator of cosmic horror whose Cthulhu Mythos became one of modern fiction's most influential mythologies.",
  },
  "Harold Frederic": {
    name: "Harold Frederic",
    country: "USA",
    birthYear: 1856,
    deathYear: 1898,
    oneLine: "Journalist and novelist whose Damnation of Theron Ware chronicled a minister's moral collapse.",
  },
  "Henryk Sienkiewicz": {
    name: "Henryk Sienkiewicz",
    country: "POL",
    birthYear: 1846,
    deathYear: 1916,
    oneLine: "Nobel laureate who wrote Quo Vadis, the epic of early Christianity under Nero's Rome.",
  },
  "Horace Walpole": {
    name: "Horace Walpole",
    country: "GBR",
    birthYear: 1717,
    deathYear: 1797,
    oneLine: "Inventor of the Gothic novel with The Castle of Otranto, who also coined the word serendipity.",
  },
  "Hugh Lofting": {
    name: "Hugh Lofting",
    country: "GBR",
    birthYear: 1886,
    deathYear: 1947,
    oneLine: "Creator of Doctor Dolittle, the veterinarian who talks to animals.",
  },
  "J. B. Priestley": {
    name: "J. B. Priestley",
    country: "GBR",
    birthYear: 1894,
    deathYear: 1984,
    oneLine: "Yorkshire novelist and playwright whose Good Companions celebrated the spirit of provincial England.",
  },
  "Jacob Riis": {
    name: "Jacob Riis",
    country: "USA",
    birthYear: 1849,
    deathYear: 1914,
    oneLine: "Danish-American photojournalist who exposed New York's slums in How the Other Half Lives.",
  },
  "James Fenimore Cooper": {
    name: "James Fenimore Cooper",
    country: "USA",
    birthYear: 1789,
    deathYear: 1851,
    oneLine: "America's first major novelist who created the literary mythology of the frontier.",
  },
  "John Reed": {
    name: "John Reed",
    country: "USA",
    birthYear: 1887,
    deathYear: 1920,
    oneLine: "Journalist whose Ten Days That Shook the World is the classic eyewitness account of the Russian Revolution.",
  },
  "John Webster": {
    name: "John Webster",
    country: "GBR",
    birthYear: 1580,
    deathYear: 1634,
    oneLine: "Jacobean dramatist whose Duchess of Malfi rivals Shakespeare's darkest tragedies.",
  },
  "Johnston McCulley": {
    name: "Johnston McCulley",
    country: "USA",
    birthYear: 1883,
    deathYear: 1958,
    oneLine: "Creator of Zorro, the masked swordsman who became a global icon of swashbuckling justice.",
  },
  "Josephine Tey": {
    name: "Josephine Tey",
    country: "GBR",
    birthYear: 1896,
    deathYear: 1952,
    oneLine: "Scottish mystery writer whose Daughter of Time is regularly voted the greatest detective novel ever written.",
  },
  "José Rizal": {
    name: "José Rizal",
    country: "PHL",
    birthYear: 1861,
    deathYear: 1896,
    oneLine: "Filipino national hero whose novels Noli Me Tangere and El Filibusterismo sparked a revolution.",
  },
  "Lew Wallace": {
    name: "Lew Wallace",
    country: "USA",
    birthYear: 1827,
    deathYear: 1905,
    oneLine: "Civil War general who wrote Ben-Hur, the best-selling American novel of the 19th century.",
  },
  "Mary Roberts Rinehart": {
    name: "Mary Roberts Rinehart",
    country: "USA",
    birthYear: 1876,
    deathYear: 1958,
    oneLine: "Pioneer of the 'Had-I-But-Known' mystery school with The Circular Staircase.",
  },
  "Mary Seacole": {
    name: "Mary Seacole",
    country: "JAM",
    birthYear: 1805,
    deathYear: 1881,
    oneLine: "Jamaican-Scottish nurse who served in the Crimean War and wrote a pioneering autobiography.",
  },
  "Olaudah Equiano": {
    name: "Olaudah Equiano",
    country: "GBR",
    birthYear: 1745,
    deathYear: 1797,
    oneLine: "Formerly enslaved author whose Interesting Narrative helped fuel the abolition of the British slave trade.",
  },
  "Oliver Goldsmith": {
    name: "Oliver Goldsmith",
    country: "IRL",
    birthYear: 1728,
    deathYear: 1774,
    oneLine: "Irish writer who excelled in every form — novel, play, poem — with gentle wit and humane comedy.",
  },
  "Owen Wister": {
    name: "Owen Wister",
    country: "USA",
    birthYear: 1860,
    deathYear: 1938,
    oneLine: "Author of The Virginian, the novel that established every convention of the Western genre.",
  },
  "Peter Kropotkin": {
    name: "Peter Kropotkin",
    country: "RUS",
    birthYear: 1842,
    deathYear: 1921,
    oneLine: "Anarchist prince who argued that cooperation, not competition, drives evolution and human progress.",
  },
  "R. D. Blackmore": {
    name: "R. D. Blackmore",
    country: "GBR",
    birthYear: 1825,
    deathYear: 1900,
    oneLine: "Author of Lorna Doone, the beloved pastoral romance of 17th-century Exmoor.",
  },
  "Rafael Sabatini": {
    name: "Rafael Sabatini",
    country: "GBR",
    birthYear: 1875,
    deathYear: 1950,
    oneLine: "Italian-English novelist who wrote Scaramouche and Captain Blood, masterpieces of swashbuckling adventure.",
  },
  "Richard Marsh": {
    name: "Richard Marsh",
    country: "GBR",
    birthYear: 1857,
    deathYear: 1915,
    oneLine: "Author of The Beetle, a Gothic thriller that outsold Dracula in its year of publication.",
  },
  "Robert W. Chambers": {
    name: "Robert W. Chambers",
    country: "USA",
    birthYear: 1865,
    deathYear: 1933,
    oneLine: "Author of The King in Yellow, weird fiction stories that influenced Lovecraft and modern horror.",
  },
  "Samuel Johnson": {
    name: "Samuel Johnson",
    country: "GBR",
    birthYear: 1709,
    deathYear: 1784,
    oneLine: "Lexicographer, essayist, and wit who dominated 18th-century English letters.",
  },
  "Sheridan Le Fanu": {
    name: "Sheridan Le Fanu",
    country: "IRL",
    birthYear: 1814,
    deathYear: 1873,
    oneLine: "Master of Victorian supernatural fiction whose Carmilla predates Dracula by twenty-five years.",
  },
  "Susanna Rowson": {
    name: "Susanna Rowson",
    country: "USA",
    birthYear: 1762,
    deathYear: 1824,
    oneLine: "Author of Charlotte Temple, the first American bestseller.",
  },
  "Sylvia Townsend Warner": {
    name: "Sylvia Townsend Warner",
    country: "GBR",
    birthYear: 1893,
    deathYear: 1978,
    oneLine: "Author of Lolly Willowes, a sly feminist fable about a spinster who makes a pact with the Devil.",
  },
  "T. E. Lawrence": {
    name: "T. E. Lawrence",
    country: "GBR",
    birthYear: 1888,
    deathYear: 1935,
    oneLine: "Lawrence of Arabia, whose Seven Pillars of Wisdom is a modernist masterpiece of memoir.",
  },
  "Ulysses S. Grant": {
    name: "Ulysses S. Grant",
    country: "USA",
    birthYear: 1822,
    deathYear: 1885,
    oneLine: "Civil War general and president whose Personal Memoirs are the finest military memoir in English.",
  },
  "Washington Irving": {
    name: "Washington Irving",
    country: "USA",
    birthYear: 1783,
    deathYear: 1859,
    oneLine: "First internationally famous American author, creator of Rip Van Winkle and the Headless Horseman.",
  },
  "William Congreve": {
    name: "William Congreve",
    country: "GBR",
    birthYear: 1670,
    deathYear: 1729,
    oneLine: "Restoration dramatist whose Way of the World contains the wittiest dialogue in English comedy.",
  },
  "William Craft": {
    name: "William Craft",
    country: "USA",
    birthYear: 1824,
    deathYear: 1900,
    oneLine: "Escaped slave who with his wife Ellen made one of the most daring escapes in American history.",
  },
  "William Morris": {
    name: "William Morris",
    country: "GBR",
    birthYear: 1834,
    deathYear: 1896,
    oneLine: "Artist, designer, and socialist visionary whose News from Nowhere imagined a utopian England.",
  },
  "William Wells Brown": {
    name: "William Wells Brown",
    country: "USA",
    birthYear: 1814,
    deathYear: 1884,
    oneLine: "First African American to publish a novel, Clotel, about Thomas Jefferson's fictional mixed-race daughters.",
  },
  "William Wycherley": {
    name: "William Wycherley",
    country: "GBR",
    birthYear: 1641,
    deathYear: 1716,
    oneLine: "Restoration dramatist whose Country Wife is the most scandalous and funniest comedy of its era.",
  },
}

// ── ISO 3166-1 alpha-3 → Display Name ───────────────────────────────────────

export const COUNTRY_NAMES: Record<string, string> = {
  GRC: "Greece",
  ITA: "Italy",
  GBR: "United Kingdom",
  IRL: "Ireland",
  FRA: "France",
  RUS: "Russia",
  USA: "United States",
  DEU: "Germany",
  AUT: "Austria",
  CZE: "Czech Republic",
  HUN: "Hungary",
  ESP: "Spain",
  NOR: "Norway",
  SWE: "Sweden",
  FIN: "Finland",
  CHE: "Switzerland",
  POL: "Poland",
  IND: "India",
  CHN: "China",
  JPN: "Japan",
  IRN: "Iran",
  LBN: "Lebanon",
  CAN: "Canada",
  PRT: "Portugal",
  AUS: "Australia",
  NZL: "New Zealand",
  DZA: "Algeria",
  NGA: "Nigeria",
  ZAF: "South Africa",
  KEN: "Kenya",
  GHA: "Ghana",
  EGY: "Egypt",
  SEN: "Senegal",
  JAM: "Jamaica",
  PHL: "Philippines",
  BRA: "Brazil",
  ARG: "Argentina",
  COL: "Colombia",
  CHL: "Chile",
  PER: "Peru",
  ZZZ: "Unknown",
}

// ── Continent → ISO3 country codes ──────────────────────────────────────────

export const CONTINENT_COUNTRIES: Record<string, string[]> = {
  Europe: [
    "GRC",
    "ITA",
    "GBR",
    "IRL",
    "FRA",
    "RUS",
    "DEU",
    "AUT",
    "CZE",
    "HUN",
    "ESP",
    "NOR",
    "SWE",
    "FIN",
    "CHE",
    "POL",
    "PRT",
  ],
  "North America": ["USA", "CAN", "JAM"],
  Asia: ["IND", "CHN", "JPN", "IRN", "LBN", "RUS", "PHL"],
  Africa: ["DZA", "NGA", "ZAF", "KEN", "GHA", "EGY", "SEN"],
  Oceania: ["AUS", "NZL"],
  "South America": ["BRA", "ARG", "COL", "CHL", "PER"],
}

// ── Helper Functions ────────────────────────────────────────────────────────

/** Get all authors mapped to a given ISO-3 country code. */
export function getAuthorsByCountry(iso3: string): AuthorCountryData[] {
  return Object.values(AUTHOR_COUNTRIES).filter((a) => a.country === iso3)
}

/** Get the list of ISO-3 country codes that have at least one author. */
export function getCountriesWithAuthors(): string[] {
  const codes = new Set(
    Object.values(AUTHOR_COUNTRIES).map((a) => a.country)
  )
  codes.delete("ZZZ") // exclude unknown
  return Array.from(codes)
}

/** Look up which continent a country belongs to. */
export function getContinentForCountry(iso3: string): string {
  for (const [continent, countries] of Object.entries(CONTINENT_COUNTRIES)) {
    if (countries.includes(iso3)) return continent
  }
  return "Unknown"
}
