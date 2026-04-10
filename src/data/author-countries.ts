// ── Tome Author Country Mapping ──
// Maps all book authors to ISO 3166-1 alpha-3 country codes,
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
  // ── Auto-generated from books.ts ────────────────────────────────────────
  "A. N. Afanasyev": {
    name: "A. N. Afanasyev",
    country: "RUS",
    oneLine: "Russian folklorist known for Russian Folktales.",
  },
  "A. P. Herbert": {
    name: "A. P. Herbert",
    country: "GBR",
    oneLine: "English novelist known for The House by the River.",
  },
  "A. W. Tozer": {
    name: "A. W. Tozer",
    country: "GBR",
    oneLine: "English novelist known for The Pursuit of God.",
  },
  "Ada Elizabeth Chesterton": {
    name: "Ada Elizabeth Chesterton",
    country: "GBR",
    oneLine: "English social critic known for In Darkest London.",
  },
  "Adam Mickiewicz": {
    name: "Adam Mickiewicz",
    country: "POL",
    oneLine: "Polish epic poet known for Pan Tadeusz.",
  },
  Aesop: {
    name: "Aesop",
    country: "GRC",
    oneLine: "ancient Greek writer known for Fables.",
  },
  "Akutagawa Ryūnosuke": {
    name: "Akutagawa Ryūnosuke",
    country: "JPN",
    oneLine: "Japanese short story writer known for Short Fiction.",
  },
  "Alain-René Lesage": {
    name: "Alain-René Lesage",
    country: "FRA",
    oneLine: "French novelist known for Gil Blas.",
  },
  "Aleksandr Kuprin": {
    name: "Aleksandr Kuprin",
    country: "RUS",
    oneLine: "Russian short story writer known for Short Fiction.",
  },
  "Alexander Berkman": {
    name: "Alexander Berkman",
    country: "RUS",
    oneLine: "Russian memoirist known for The Bolshevik Myth.",
  },
  "Algernon Blackwood": {
    name: "Algernon Blackwood",
    country: "GBR",
    oneLine: "English short story writer known for John Silence Stories.",
  },
  "Ambrose Bierce": {
    name: "Ambrose Bierce",
    country: "USA",
    oneLine: "American satirist whose works include Poetry and The Devil's Dictionary.",
  },
  "Ameen Rihani": {
    name: "Ameen Rihani",
    country: "LBN",
    oneLine: "Lebanese poet known for Poetry.",
  },
  "Andre Norton": {
    name: "Andre Norton",
    country: "GBR",
    oneLine: "English novelist whose works include Key Out of Time and Plague Ship.",
  },
  "Anna Katharine Green": {
    name: "Anna Katharine Green",
    country: "USA",
    oneLine: "American mystery writer whose works include The Leavenworth Case and A Strange Disappearance.",
  },
  "Anthony Berkeley": {
    name: "Anthony Berkeley",
    country: "GBR",
    oneLine: "English novelist whose works include The Layton Court Mystery and The Poisoned Chocolates Case.",
  },
  "Apsley Cherry-Garrard": {
    name: "Apsley Cherry-Garrard",
    country: "GBR",
    oneLine: "English writer known for The Worst Journey in the World.",
  },
  "Arnold Bennett": {
    name: "Arnold Bennett",
    country: "GBR",
    oneLine: "English novelist whose works include Anna of the Five Towns and The Old Wives' Tale.",
  },
  "Arthur Machen": {
    name: "Arthur Machen",
    country: "GBR",
    oneLine: "Wales novelist whose works include The Three Impostors and The Secret Glory.",
  },
  "Arthur W. Pinero": {
    name: "Arthur W. Pinero",
    country: "GBR",
    oneLine: "English novelist known for The Second Mrs. Tanqueray.",
  },
  "Barbara Newhall Follett": {
    name: "Barbara Newhall Follett",
    country: "USA",
    oneLine: "American novelist known for The House Without Windows.",
  },
  "Barry Goldwater": {
    name: "Barry Goldwater",
    country: "USA",
    oneLine: "American writer known for The Conscience of a Conservative.",
  },
  "Beatrix Potter": {
    name: "Beatrix Potter",
    country: "GBR",
    oneLine: "English short story writer known for Short Fiction.",
  },
  "Ben Jonson": {
    name: "Ben Jonson",
    country: "GBR",
    oneLine: "English dramatist known for The Alchemist.",
  },
  "Benito Pérez Galdós": {
    name: "Benito Pérez Galdós",
    country: "ESP",
    oneLine: "Spanish novelist known for Trafalgar.",
  },
  "Benjamin Disraeli": {
    name: "Benjamin Disraeli",
    country: "GBR",
    oneLine: "English novelist known for Sybil, or The Two Nations.",
  },
  "Bertha von Suttner": {
    name: "Bertha von Suttner",
    country: "AUT",
    oneLine: "Austrian novelist known for Lay Down Your Arms.",
  },
  "Black Hawk": {
    name: "Black Hawk",
    country: "USA",
    oneLine: "American memoirist known for Autobiography of Black Hawk.",
  },
  Boethius: {
    name: "Boethius",
    country: "ITA",
    birthYear: 477,
    deathYear: 524,
    oneLine: "Roman senator and philosopher whose Consolation of Philosophy shaped medieval thought.",
  },
  "C. E. Montague": {
    name: "C. E. Montague",
    country: "GBR",
    oneLine: "English war writer known for Disenchantment.",
  },
  "C. S. Forester": {
    name: "C. S. Forester",
    country: "GBR",
    oneLine: "English novelist whose works include Payment Deferred and Brown on Resolution.",
  },
  "C. S. Lewis": {
    name: "C. S. Lewis",
    country: "GBR",
    oneLine: "English novelist whose works include Poetry and Poetry.",
  },
  "Calvin Coolidge": {
    name: "Calvin Coolidge",
    country: "GBR",
    oneLine: "English novelist known for The Autobiography of Calvin Coolidge.",
  },
  "Carey Rockwell": {
    name: "Carey Rockwell",
    country: "USA",
    oneLine: "American science fiction writer known for Stand by for Mars!.",
  },
  "Carolyn Keene": {
    name: "Carolyn Keene",
    country: "USA",
    oneLine: "American mystery writer whose works include The Secret of the Old Clock and The Hidden Staircase.",
  },
  "Carolyn Wells": {
    name: "Carolyn Wells",
    country: "USA",
    oneLine: "American novelist known for The Clue.",
  },
  "Charles Beaumont": {
    name: "Charles Beaumont",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Charles Kingsley": {
    name: "Charles Kingsley",
    country: "GBR",
    oneLine: "English novelist known for The Water-Babies.",
  },
  "Charlotte Perkins Gilman": {
    name: "Charlotte Perkins Gilman",
    country: "USA",
    oneLine: "American novelist whose works include Women and Economics and Herland.",
  },
  "Christopher Morley": {
    name: "Christopher Morley",
    country: "USA",
    oneLine: "American novelist whose works include Parnassus on Wheels and The Haunted Bookshop.",
  },
  "Cicely Hamilton": {
    name: "Cicely Hamilton",
    country: "GBR",
    oneLine: "English novelist known for Theodore Savage.",
  },
  Cicero: {
    name: "Cicero",
    country: "ITA",
    oneLine: "Roman philosopher known for Tusculan Disputations.",
  },
  "Clara Reeve": {
    name: "Clara Reeve",
    country: "GBR",
    oneLine: "English novelist known for The Old English Baron.",
  },
  "Clark Ashton Smith": {
    name: "Clark Ashton Smith",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Clifford D. Simak": {
    name: "Clifford D. Simak",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Compton Mackenzie": {
    name: "Compton Mackenzie",
    country: "GBR",
    oneLine: "English novelist known for Sinister Street.",
  },
  "Constance Holme": {
    name: "Constance Holme",
    country: "GBR",
    oneLine: "English novelist known for The Splendid Fairing.",
  },
  "Cordwainer Smith": {
    name: "Cordwainer Smith",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Daisy Ashford": {
    name: "Daisy Ashford",
    country: "GBR",
    oneLine: "English novelist known for The Young Visiters.",
  },
  "Daphne du Maurier": {
    name: "Daphne du Maurier",
    country: "GBR",
    oneLine: "English short story writer known for Short Fiction.",
  },
  "David Lindsay": {
    name: "David Lindsay",
    country: "GBR",
    oneLine: "Scottish novelist known for A Voyage to Arcturus.",
  },
  "Denis Diderot": {
    name: "Denis Diderot",
    country: "FRA",
    oneLine: "French novelist known for The Indiscreet Jewels.",
  },
  "Diogenes Laërtius": {
    name: "Diogenes Laërtius",
    country: "GRC",
    oneLine: "ancient Greek biographer known for The Lives and Opinions of Eminent Philosophers.",
  },
  "Dorothy Canfield Fisher": {
    name: "Dorothy Canfield Fisher",
    country: "USA",
    oneLine: "American novelist whose works include Understood Betsy and The Homemaker.",
  },
  "Dorothy Day": {
    name: "Dorothy Day",
    country: "USA",
    oneLine: "American novelist known for The Eleventh Virgin.",
  },
  "Dorothy L. Sayers and Robert Eustace": {
    name: "Dorothy L. Sayers and Robert Eustace",
    country: "GBR",
    oneLine: "English novelist known for The Documents in the Case.",
  },
  "Dorothy M. Richardson": {
    name: "Dorothy M. Richardson",
    country: "GBR",
    oneLine: "English novelist whose works include Pointed Roofs and Backwater.",
  },
  "E. C. Bentley": {
    name: "E. C. Bentley",
    country: "GBR",
    oneLine: "English novelist known for Trent's Last Case.",
  },
  "E. E. Cummings": {
    name: "E. E. Cummings",
    country: "USA",
    oneLine: "American novelist known for The Enormous Room.",
  },
  "E. E. Smith": {
    name: "E. E. Smith",
    country: "USA",
    oneLine: "American novelist known for The Skylark of Space.",
  },
  "E. F. Benson": {
    name: "E. F. Benson",
    country: "GBR",
    oneLine: "English short story writer known for Ghost Stories.",
  },
  "E. F. Knight": {
    name: "E. F. Knight",
    country: "GBR",
    oneLine: "English adventure novelist known for The Cruise of the Alerte.",
  },
  "E. H. Young": {
    name: "E. H. Young",
    country: "GBR",
    oneLine: "English novelist known for Miss Mole.",
  },
  "E. Pauline Johnson": {
    name: "E. Pauline Johnson",
    country: "CAN",
    oneLine: "Canadian novelist known for Legends of Vancouver.",
  },
  "E. Phillips Oppenheim": {
    name: "E. Phillips Oppenheim",
    country: "GBR",
    oneLine: "English novelist known for The Great Impersonation.",
  },
  "E. R. Eddison": {
    name: "E. R. Eddison",
    country: "GBR",
    oneLine: "English novelist known for The Worm Ouroboros.",
  },
  "E. T. A. Hoffmann": {
    name: "E. T. A. Hoffmann",
    country: "DEU",
    oneLine: "German novelist known for Master Flea.",
  },
  "E. W. Hornung": {
    name: "E. W. Hornung",
    country: "GBR",
    oneLine: "English novelist whose works include The Amateur Cracksman and The Black Mask.",
  },
  "Earl Derr Biggers": {
    name: "Earl Derr Biggers",
    country: "USA",
    oneLine: "American novelist whose works include The House Without a Key and The Chinese Parrot.",
  },
  "Edgar Saltus": {
    name: "Edgar Saltus",
    country: "USA",
    oneLine: "American novelist known for The Truth About Tristrem Varick.",
  },
  "Edgar Wallace": {
    name: "Edgar Wallace",
    country: "GBR",
    oneLine: "English mystery writer whose works include The Four Just Men and The Council of Justice.",
  },
  "Edmond de Goncourt and Jules de Goncourt": {
    name: "Edmond de Goncourt and Jules de Goncourt",
    country: "FRA",
    oneLine: "French novelist known for Germinie Lacerteux.",
  },
  "Edward Bulwer-Lytton": {
    name: "Edward Bulwer-Lytton",
    country: "GBR",
    oneLine: "English novelist known for The Coming Race.",
  },
  "Edward Eggleston": {
    name: "Edward Eggleston",
    country: "USA",
    oneLine: "American novelist known for The Hoosier Schoolmaster.",
  },
  "Edward Lear": {
    name: "Edward Lear",
    country: "GBR",
    oneLine: "English novelist known for Nonsense Books.",
  },
  "Edward Payson Roe": {
    name: "Edward Payson Roe",
    country: "USA",
    oneLine: "American novelist known for Driven Back to Eden.",
  },
  "Edward Thomas": {
    name: "Edward Thomas",
    country: "GBR",
    oneLine: "English poet known for Poetry.",
  },
  "Edward Whymper": {
    name: "Edward Whymper",
    country: "GBR",
    oneLine: "English novelist known for Scrambles Amongst the Alps.",
  },
  "Elizabeth Barrett Browning": {
    name: "Elizabeth Barrett Browning",
    country: "GBR",
    oneLine: "English novelist known for Sonnets from the Portuguese.",
  },
  "Ella Cheever Thayer": {
    name: "Ella Cheever Thayer",
    country: "USA",
    oneLine: "American novelist known for Wired Love.",
  },
  "Ellery Queen": {
    name: "Ellery Queen",
    country: "USA",
    oneLine: "American novelist known for The Roman Hat Mystery.",
  },
  "Émile Gaboriau": {
    name: "Émile Gaboriau",
    country: "FRA",
    oneLine: "French novelist whose works include The Lerouge Case and File No. 113.",
  },
  "Emma Goldman": {
    name: "Emma Goldman",
    country: "USA",
    oneLine: "American novelist known for My Disillusionment in Russia.",
  },
  Epictetus: {
    name: "Epictetus",
    country: "ITA",
    oneLine: "Roman philosopher known for Discourses.",
  },
  "Ernest Bramah": {
    name: "Ernest Bramah",
    country: "GBR",
    oneLine: "English fantasy writer known for Kai Lung's Golden Hours.",
  },
  "Ernest Poole": {
    name: "Ernest Poole",
    country: "USA",
    oneLine: "American novelist known for His Family.",
  },
  "Ernest Shackleton": {
    name: "Ernest Shackleton",
    country: "GBR",
    oneLine: "English writer known for South.",
  },
  "Ernest Thompson Seton": {
    name: "Ernest Thompson Seton",
    country: "CAN",
    oneLine: "Canadian nature writer known for Wild Animals I Have Known.",
  },
  "Ethel Voynich": {
    name: "Ethel Voynich",
    country: "GBR",
    oneLine: "English novelist known for The Gadfly.",
  },
  "Etsu Inagaki Sugimoto": {
    name: "Etsu Inagaki Sugimoto",
    country: "JPN",
    oneLine: "Japanese memoirist known for A Daughter of the Samurai.",
  },
  "Evelyn Underhill": {
    name: "Evelyn Underhill",
    country: "GBR",
    oneLine: "English writer known for Practical Mysticism.",
  },
  "Fergus Hume": {
    name: "Fergus Hume",
    country: "AUS",
    oneLine: "Australian novelist known for The Mystery of a Hansom Cab.",
  },
  "Fernando Pessoa": {
    name: "Fernando Pessoa",
    country: "PRT",
    oneLine: "Portuguese poet known for Poetry.",
  },
  "Fitz Hugh Ludlow": {
    name: "Fitz Hugh Ludlow",
    country: "USA",
    oneLine: "American novelist known for The Hasheesh Eater.",
  },
  "Frances Noyes Hart": {
    name: "Frances Noyes Hart",
    country: "USA",
    oneLine: "American mystery writer known for The Bellamy Trial.",
  },
  "Francis La Flesche": {
    name: "Francis La Flesche",
    country: "USA",
    oneLine: "American novelist known for The Middle Five.",
  },
  "Frank Hamilton Cushing": {
    name: "Frank Hamilton Cushing",
    country: "USA",
    oneLine: "American folklorist known for Zuni Folktales.",
  },
  "Franklin W. Dixon": {
    name: "Franklin W. Dixon",
    country: "GBR",
    oneLine: "English novelist whose works include Hunting for Hidden Gold and The House on the Cliff.",
  },
  "Frédéric Mistral": {
    name: "Frédéric Mistral",
    country: "FRA",
    oneLine: "French novelist known for Mirèio.",
  },
  "Frederick Rolfe": {
    name: "Frederick Rolfe",
    country: "GBR",
    oneLine: "English novelist known for Hadrian the Seventh.",
  },
  "Frederik Pohl": {
    name: "Frederik Pohl",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Freeman Wills Crofts": {
    name: "Freeman Wills Crofts",
    country: "IRL",
    oneLine: "Irish mystery writer whose works include The Cask and The Ponson Case.",
  },
  "Friedrich Spielhagen": {
    name: "Friedrich Spielhagen",
    country: "DEU",
    oneLine: "German novelist known for The Breaking of the Storm.",
  },
  "Fritz Leiber": {
    name: "Fritz Leiber",
    country: "USA",
    oneLine: "American science fiction writer whose works include Short Fiction and The Big Time.",
  },
  "Fyodor Sologub": {
    name: "Fyodor Sologub",
    country: "RUS",
    oneLine: "Russian novelist whose works include The Little Demon and Short Fiction.",
  },
  "G. D. H. Cole": {
    name: "G. D. H. Cole",
    country: "GBR",
    oneLine: "English mystery writer known for The Brooklyn Murders.",
  },
  "G. E. Moore": {
    name: "G. E. Moore",
    country: "GBR",
    oneLine: "English philosopher known for Principia Ethica.",
  },
  "Gene Stratton-Porter": {
    name: "Gene Stratton-Porter",
    country: "USA",
    oneLine: "American novelist known for Freckles.",
  },
  "Geoffrey Dennis": {
    name: "Geoffrey Dennis",
    country: "GBR",
    oneLine: "English novelist known for The End of the World.",
  },
  "George Barr McCutcheon": {
    name: "George Barr McCutcheon",
    country: "USA",
    oneLine: "American novelist known for Brewster's Millions.",
  },
  "George Borrow": {
    name: "George Borrow",
    country: "GBR",
    oneLine: "English novelist known for Lavengro.",
  },
  "George Dilnot": {
    name: "George Dilnot",
    country: "GBR",
    oneLine: "English mystery writer known for The Lazy Detective.",
  },
  "George du Maurier": {
    name: "George du Maurier",
    country: "GBR",
    oneLine: "English novelist known for Trilby.",
  },
  "George Gissing": {
    name: "George Gissing",
    country: "GBR",
    oneLine: "English novelist whose works include New Grub Street and The Private Papers of Henry Ryecroft.",
  },
  "George Grey": {
    name: "George Grey",
    country: "NZL",
    oneLine: "New Zealand writer known for Polynesian Mythology.",
  },
  "George S. Schuyler": {
    name: "George S. Schuyler",
    country: "USA",
    oneLine: "American novelist known for Black No More.",
  },
  "George Sand": {
    name: "George Sand",
    country: "FRA",
    oneLine: "French novelist whose works include Mauprat and The Devil's Pool.",
  },
  "George William Russell": {
    name: "George William Russell",
    country: "IRL",
    oneLine: "Irish writer known for The National Being.",
  },
  "Georgette Heyer": {
    name: "Georgette Heyer",
    country: "GBR",
    oneLine: "English historical novelist whose works include The Black Moth and These Old Shades.",
  },
  "Georgia Douglas Johnson": {
    name: "Georgia Douglas Johnson",
    country: "USA",
    oneLine: "American poet known for Poetry.",
  },
  Geronimo: {
    name: "Geronimo",
    country: "USA",
    oneLine: "American memoirist known for Geronimo's Story of His Life.",
  },
  "Godfrey R. Benson": {
    name: "Godfrey R. Benson",
    country: "GBR",
    oneLine: "English essayist known for Tracks in the Snow.",
  },
  "Graham Greene": {
    name: "Graham Greene",
    country: "GBR",
    oneLine: "English novelist known for The Man Within.",
  },
  "Grazia Deledda": {
    name: "Grazia Deledda",
    country: "ITA",
    oneLine: "Italian novelist known for After the Divorce.",
  },
  "Gustave Le Bon": {
    name: "Gustave Le Bon",
    country: "FRA",
    oneLine: "French writer known for The Crowd.",
  },
  "Guy de Maupassant": {
    name: "Guy de Maupassant",
    country: "FRA",
    oneLine: "French novelist whose works include Short Fiction and Pierre and Jean.",
  },
  "H. Beam Piper": {
    name: "H. Beam Piper",
    country: "GBR",
    oneLine: "English novelist whose works include Four-Day Planet and Little Fuzzy.",
  },
  "H. C. McNeile": {
    name: "H. C. McNeile",
    country: "GBR",
    oneLine: "English novelist known for Bulldog Drummond.",
  },
  "H. de Vere Stacpoole": {
    name: "H. de Vere Stacpoole",
    country: "GBR",
    oneLine: "English novelist known for The Blue Lagoon.",
  },
  "Hans Jakob Christoffel von Grimmelshausen": {
    name: "Hans Jakob Christoffel von Grimmelshausen",
    country: "DEU",
    oneLine: "German novelist known for The Adventurous Simplicissimus.",
  },
  "Harriet E. Wilson": {
    name: "Harriet E. Wilson",
    country: "USA",
    oneLine: "American novelist known for Our Nig.",
  },
  "Harry Harrison": {
    name: "Harry Harrison",
    country: "USA",
    oneLine: "American novelist whose works include The Stainless Steel Rat and Planet of the Damned.",
  },
  "Helen Herron Taft": {
    name: "Helen Herron Taft",
    country: "USA",
    oneLine: "American memoirist known for Recollections of Full Years.",
  },
  "Helen Keller": {
    name: "Helen Keller",
    country: "USA",
    oneLine: "American memoirist known for The Story of My Life.",
  },
  "Henry Blake Fuller": {
    name: "Henry Blake Fuller",
    country: "USA",
    oneLine: "American novelist known for Bertram Cope's Year.",
  },
  "Henry George": {
    name: "Henry George",
    country: "USA",
    oneLine: "American writer known for Progress and Poverty.",
  },
  "Henry Kuttner": {
    name: "Henry Kuttner",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Henry van Dyke Jr.": {
    name: "Henry van Dyke Jr.",
    country: "USA",
    oneLine: "American poet known for Poetry.",
  },
  "Hilaire Belloc": {
    name: "Hilaire Belloc",
    country: "GBR",
    oneLine: "English writer known for The Cruise of the Nona.",
  },
  "Hjalmar Söderberg": {
    name: "Hjalmar Söderberg",
    country: "SWE",
    oneLine: "Swedish short story writer known for Short Fiction.",
  },
  "Hope Mirrlees": {
    name: "Hope Mirrlees",
    country: "GBR",
    oneLine: "English novelist known for Lud-in-the-Mist.",
  },
  "Horatio Alger Jr.": {
    name: "Horatio Alger Jr.",
    country: "USA",
    oneLine: "American novelist known for Ragged Dick.",
  },
  "Isaac Asimov": {
    name: "Isaac Asimov",
    country: "USA",
    oneLine: "American short story writer known for Short Science Fiction.",
  },
  "Israel Zangwill": {
    name: "Israel Zangwill",
    country: "GBR",
    oneLine: "English novelist known for The Big Bow Mystery.",
  },
  "Ivan Bunin": {
    name: "Ivan Bunin",
    country: "RUS",
    oneLine: "Russian short story writer known for Short Fiction.",
  },
  "Ivy Compton-Burnett": {
    name: "Ivy Compton-Burnett",
    country: "GBR",
    oneLine: "English novelist known for Pastors and Masters.",
  },
  "J. J. Connington": {
    name: "J. J. Connington",
    country: "GBR",
    oneLine: "English novelist whose works include Murder in the Maze and Mystery at Lynden Sands.",
  },
  "J. M. Synge": {
    name: "J. M. Synge",
    country: "IRL",
    oneLine: "Irish novelist whose works include Short Plays and The Playboy of the Western World.",
  },
  "J. P. Jacobsen": {
    name: "J. P. Jacobsen",
    country: "DNK",
    oneLine: "Danish novelist known for Niels Lyhne.",
  },
  "J. Sheridan Le Fanu": {
    name: "J. Sheridan Le Fanu",
    country: "IRL",
    oneLine: "Irish writer whose works include Short Fiction and The Room in the Dragon Volant.",
  },
  "J. Storer Clouston": {
    name: "J. Storer Clouston",
    country: "GBR",
    oneLine: "Scottish novelist known for The Spy in Black.",
  },
  "J.-K. Huysmans": {
    name: "J.-K. Huysmans",
    country: "FRA",
    oneLine: "French novelist known for Là-Bas.",
  },
  "Jacob Grimm & Wilhelm Grimm": {
    name: "Jacob Grimm & Wilhelm Grimm",
    country: "DEU",
    oneLine: "German short story writer known for Household Tales.",
  },
  "James Branch Cabell": {
    name: "James Branch Cabell",
    country: "USA",
    oneLine: "American novelist whose works include Jurgen and Figures of Earth.",
  },
  "James Hogg": {
    name: "James Hogg",
    country: "GBR",
    oneLine: "Scottish novelist known for The Private Memoirs and Confessions of a Justified Sinner.",
  },
  "James Stephens": {
    name: "James Stephens",
    country: "IRL",
    oneLine: "Irish novelist whose works include The Crock of Gold and Irish Fairy Tales.",
  },
  "Jane Addams": {
    name: "Jane Addams",
    country: "USA",
    oneLine: "American writer whose works include Democracy and Social Ethics and Twenty Years at Hull House.",
  },
  "Jean Grave": {
    name: "Jean Grave",
    country: "FRA",
    oneLine: "French writer known for Moribund Society and Anarchy.",
  },
  "Jessie Redmon Fauset": {
    name: "Jessie Redmon Fauset",
    country: "USA",
    oneLine: "American novelist whose works include There Is Confusion and Plum Bun.",
  },
  "Joel Barlow": {
    name: "Joel Barlow",
    country: "USA",
    oneLine: "American epic poet known for The Columbiad.",
  },
  "Johann David Wyss": {
    name: "Johann David Wyss",
    country: "CHE",
    oneLine: "Swiss novelist known for The Swiss Family Robinson.",
  },
  "John A. Lomax": {
    name: "John A. Lomax",
    country: "USA",
    oneLine: "American poet known for Songs of the Cattle Trail and Cow Camp.",
  },
  "John Cowper Powys": {
    name: "John Cowper Powys",
    country: "GBR",
    oneLine: "English novelist known for Wolf Solent.",
  },
  "John Dewey": {
    name: "John Dewey",
    country: "USA",
    oneLine: "American philosopher whose works include Democracy and Education and Human Nature and Conduct.",
  },
  "John Henry Newman": {
    name: "John Henry Newman",
    country: "GBR",
    oneLine: "English novelist known for Verses on Various Occasions.",
  },
  "John Meade Falkner": {
    name: "John Meade Falkner",
    country: "GBR",
    oneLine: "English novelist whose works include Moonfleet and The Nebuly Coat.",
  },
  "John Muir": {
    name: "John Muir",
    country: "USA",
    oneLine: "American writer known for My First Summer in the Sierra.",
  },
  "John Ruskin": {
    name: "John Ruskin",
    country: "GBR",
    oneLine: "English writer known for Unto This Last.",
  },
  "John Steinbeck": {
    name: "John Steinbeck",
    country: "USA",
    oneLine: "American novelist known for Cup of Gold.",
  },
  "John W. Campbell": {
    name: "John W. Campbell",
    country: "GBR",
    oneLine: "English novelist whose works include Invaders from the Infinite and Islands of Space.",
  },
  "Jonas Lie": {
    name: "Jonas Lie",
    country: "NOR",
    oneLine: "Norwegian short story writer known for Short Fiction.",
  },
  "Joseph Conrad and Ford Madox Ford": {
    name: "Joseph Conrad and Ford Madox Ford",
    country: "GBR",
    oneLine: "English novelist whose works include The Inheritors and Romance.",
  },
  "Joseph Jacobs": {
    name: "Joseph Jacobs",
    country: "GBR",
    oneLine: "English folklorist known for Indian Fairy Tales.",
  },
  "Josiah Henson": {
    name: "Josiah Henson",
    country: "USA",
    oneLine: "American novelist known for Father Henson's Story of His Own Life.",
  },
  "Julia Peterkin": {
    name: "Julia Peterkin",
    country: "USA",
    oneLine: "American novelist known for Scarlet Sister Mary.",
  },
  "Karel Čapek": {
    name: "Karel Čapek",
    country: "CZE",
    oneLine: "Czech dramatist whose works include R.U.R. and The Absolute at Large.",
  },
  "Karl Gjellerup": {
    name: "Karl Gjellerup",
    country: "DNK",
    oneLine: "Danish novelist known for The Pilgrim Kamanita.",
  },
  "Katharine Susannah Prichard": {
    name: "Katharine Susannah Prichard",
    country: "AUS",
    oneLine: "Australian novelist known for The Black Opal.",
  },
  "Knut Hamsun": {
    name: "Knut Hamsun",
    country: "NOR",
    oneLine: "Norwegian novelist whose works include Hunger and Growth of the Soil.",
  },
  "L. T. Hobhouse": {
    name: "L. T. Hobhouse",
    country: "GBR",
    oneLine: "English writer known for Liberalism.",
  },
  "Lady Gregory & W. B. Yeats": {
    name: "Lady Gregory & W. B. Yeats",
    country: "GBR",
    oneLine: "English novelist known for The Unicorn from the Stars.",
  },
  "Langston Hughes": {
    name: "Langston Hughes",
    country: "USA",
    oneLine: "American novelist whose works include Poetry and Not Without Laughter.",
  },
  "Langston Hughes & Zora Neale Hurston": {
    name: "Langston Hughes & Zora Neale Hurston",
    country: "USA",
    oneLine: "American dramatist known for Mule Bone.",
  },
  "Leonid Andreyev": {
    name: "Leonid Andreyev",
    country: "RUS",
    oneLine: "Russian novelist whose works include Short Fiction and He Who Gets Slapped.",
  },
  "Lewis Mumford": {
    name: "Lewis Mumford",
    country: "USA",
    oneLine: "American novelist whose works include The Story of Utopias and Sticks and Stones.",
  },
  "Liam O'Flaherty": {
    name: "Liam O'Flaherty",
    country: "IRL",
    oneLine: "Irish novelist known for The Informer.",
  },
  "Lloyd C. Douglas": {
    name: "Lloyd C. Douglas",
    country: "USA",
    oneLine: "American novelist known for Magnificent Obsession.",
  },
  "Lord Byron": {
    name: "Lord Byron",
    country: "GBR",
    oneLine: "English epic poet known for Don Juan.",
  },
  "Lord Dunsany": {
    name: "Lord Dunsany",
    country: "IRL",
    oneLine: "Irish novelist whose works include The King of Elfland's Daughter and The Charwoman's Shadow.",
  },
  "Louis Bromfield": {
    name: "Louis Bromfield",
    country: "USA",
    oneLine: "American novelist known for Early Autumn.",
  },
  "Louis H. Sullivan": {
    name: "Louis H. Sullivan",
    country: "USA",
    oneLine: "American memoirist known for The Autobiography of an Idea.",
  },
  "Louis Hémon": {
    name: "Louis Hémon",
    country: "CAN",
    oneLine: "Canadian novelist known for Maria Chapdelaine.",
  },
  "Louis Joseph Vance": {
    name: "Louis Joseph Vance",
    country: "USA",
    oneLine: "American novelist known for The Lone Wolf.",
  },
  "Ludovico Ariosto": {
    name: "Ludovico Ariosto",
    country: "ITA",
    oneLine: "Italian epic poet known for Orlando Furioso.",
  },
  "Lysander Spooner": {
    name: "Lysander Spooner",
    country: "GBR",
    oneLine: "English novelist known for No Treason.",
  },
  "Lytton Strachey": {
    name: "Lytton Strachey",
    country: "GBR",
    oneLine: "English novelist whose works include Eminent Victorians and Queen Victoria.",
  },
  "M. E. Braddon": {
    name: "M. E. Braddon",
    country: "GBR",
    oneLine: "English novelist whose works include The Trail of the Serpent and Lady Audley's Secret.",
  },
  "M. P. Shiel": {
    name: "M. P. Shiel",
    country: "GBR",
    oneLine: "English novelist known for The Purple Cloud.",
  },
  "M. R. James": {
    name: "M. R. James",
    country: "GBR",
    oneLine: "English short story writer known for Short Fiction.",
  },
  "Mack Reynolds": {
    name: "Mack Reynolds",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Manly Wade Wellman": {
    name: "Manly Wade Wellman",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Margaret Ayer Barnes": {
    name: "Margaret Ayer Barnes",
    country: "USA",
    oneLine: "American novelist known for Years of Grace.",
  },
  "Margaret Cavendish": {
    name: "Margaret Cavendish",
    country: "GBR",
    oneLine: "English novelist known for The Blazing World.",
  },
  "Margaret Oliphant": {
    name: "Margaret Oliphant",
    country: "GBR",
    oneLine: "English novelist whose works include Salem Chapel and The Perpetual Curate.",
  },
  "Margaret Wilson": {
    name: "Margaret Wilson",
    country: "USA",
    oneLine: "American novelist known for The Able McLaughlins.",
  },
  "Margery Allingham": {
    name: "Margery Allingham",
    country: "GBR",
    oneLine: "English novelist known for The Crime at Black Dudley.",
  },
  "Maria Bochkareva": {
    name: "Maria Bochkareva",
    country: "RUS",
    oneLine: "Russian memoirist known for Yashka.",
  },
  "Marie Belloc Lowndes": {
    name: "Marie Belloc Lowndes",
    country: "GBR",
    oneLine: "English novelist known for The Lodger.",
  },
  "Marie de France": {
    name: "Marie de France",
    country: "FRA",
    oneLine: "French poet known for Lais.",
  },
  "Mark Rutherford": {
    name: "Mark Rutherford",
    country: "GBR",
    oneLine: "English novelist known for The Autobiography of Mark Rutherford.",
  },
  "Marmaduke Pickthall": {
    name: "Marmaduke Pickthall",
    country: "GBR",
    oneLine: "English novelist known for Veiled Women.",
  },
  "Martin Andersen Nexø": {
    name: "Martin Andersen Nexø",
    country: "DNK",
    oneLine: "Danish novelist known for Pelle the Conqueror.",
  },
  "Mary Austin": {
    name: "Mary Austin",
    country: "USA",
    oneLine: "American writer known for The Land of Little Rain.",
  },
  "Mary Parker Follett": {
    name: "Mary Parker Follett",
    country: "USA",
    oneLine: "American writer known for The New State.",
  },
  "Mary Weston Fordham": {
    name: "Mary Weston Fordham",
    country: "USA",
    oneLine: "American poet known for Magnolia Leaves.",
  },
  "Matthew Arnold": {
    name: "Matthew Arnold",
    country: "GBR",
    oneLine: "English essayist whose works include Poetry and Culture and Anarchy.",
  },
  "Matthew Henson": {
    name: "Matthew Henson",
    country: "USA",
    oneLine: "American novelist known for A Negro Explorer at the North Pole.",
  },
  "Maurice Leblanc": {
    name: "Maurice Leblanc",
    country: "FRA",
    oneLine: "French novelist whose works include 813 and Memoirs of Arsène Lupin.",
  },
  "Max Beerbohm": {
    name: "Max Beerbohm",
    country: "GBR",
    oneLine: "English novelist known for Zuleika Dobson.",
  },
  "May Sinclair": {
    name: "May Sinclair",
    country: "GBR",
    oneLine: "English novelist known for Mary Olivier: A Life.",
  },
  "Metta Victor": {
    name: "Metta Victor",
    country: "USA",
    oneLine: "American mystery writer known for The Dead Letter.",
  },
  "Michael Arlen": {
    name: "Michael Arlen",
    country: "GBR",
    oneLine: "English novelist known for The Green Hat.",
  },
  "Mignon G. Eberhart": {
    name: "Mignon G. Eberhart",
    country: "USA",
    oneLine: "American mystery writer known for The Patient in Room 18.",
  },
  "Mikhail Artsybashev": {
    name: "Mikhail Artsybashev",
    country: "RUS",
    oneLine: "Russian novelist known for Sanine.",
  },
  "Mina Loy": {
    name: "Mina Loy",
    country: "GBR",
    oneLine: "English poet known for Poetry.",
  },
  Molière: {
    name: "Molière",
    country: "FRA",
    oneLine: "French novelist known for Tartuffe.",
  },
  "Nikolay Chernyshevsky": {
    name: "Nikolay Chernyshevsky",
    country: "RUS",
    oneLine: "Russian novelist known for What Is to Be Done?.",
  },
  "Noël Coward": {
    name: "Noël Coward",
    country: "GBR",
    oneLine: "English dramatist known for The Vortex.",
  },
  "Norbert Jacques": {
    name: "Norbert Jacques",
    country: "LUX",
    birthYear: 1880,
    deathYear: 1954,
    oneLine: "Luxembourgish author who created the villainous Dr. Mabuse.",
  },
  "O. Henry": {
    name: "O. Henry",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Octave Mirbeau": {
    name: "Octave Mirbeau",
    country: "FRA",
    oneLine: "French novelist known for Calvary.",
  },
  "Okakura Kakuzō": {
    name: "Okakura Kakuzō",
    country: "JPN",
    oneLine: "Japanese writer known for The Book of Tea.",
  },
  "Olaf Stapledon": {
    name: "Olaf Stapledon",
    country: "GBR",
    oneLine: "English novelist known for Last and First Men.",
  },
  "Oliver La Farge": {
    name: "Oliver La Farge",
    country: "USA",
    oneLine: "American novelist known for Laughing Boy.",
  },
  "Owen Johnson": {
    name: "Owen Johnson",
    country: "USA",
    oneLine: "American novelist known for Stover at Yale.",
  },
  "P. T. Barnum": {
    name: "P. T. Barnum",
    country: "GBR",
    oneLine: "English novelist whose works include Struggles and Triumphs: Or, Forty Years’ Recollections and The Art of Money Getting: Or, Golden Rules for Making Money.",
  },
  "Paul Dukes": {
    name: "Paul Dukes",
    country: "GBR",
    oneLine: "English memoirist known for Red Dusk and the Morrow.",
  },
  "Paul Laurence Dunbar": {
    name: "Paul Laurence Dunbar",
    country: "USA",
    oneLine: "American novelist whose works include The Uncalled and The Sport of the Gods.",
  },
  "Pearl S. Buck": {
    name: "Pearl S. Buck",
    country: "USA",
    oneLine: "American novelist known for The Mother.",
  },
  "Pedro Carolino": {
    name: "Pedro Carolino",
    country: "PRT",
    oneLine: "Portuguese writer known for English as She Is Spoke.",
  },
  "Percy Marks": {
    name: "Percy Marks",
    country: "USA",
    oneLine: "American novelist known for The Plastic Age.",
  },
  "Philip Francis Nowlan": {
    name: "Philip Francis Nowlan",
    country: "GBR",
    oneLine: "English novelist whose works include Armageddon 2419 A.D. and The Airlords of Han.",
  },
  "Philip Gibbs": {
    name: "Philip Gibbs",
    country: "GBR",
    oneLine: "English war writer known for Now It Can Be Told.",
  },
  "Philip K. Dick": {
    name: "Philip K. Dick",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Philip MacDonald": {
    name: "Philip MacDonald",
    country: "GBR",
    oneLine: "English mystery writer known for The Rasp.",
  },
  "Philip Wylie": {
    name: "Philip Wylie",
    country: "USA",
    oneLine: "American novelist known for Gladiator.",
  },
  "Phillis Wheatley": {
    name: "Phillis Wheatley",
    country: "USA",
    oneLine: "American novelist known for Poems on Various Subjects, Religious and Moral.",
  },
  "Pierre Souvestre and Marcel Allain": {
    name: "Pierre Souvestre and Marcel Allain",
    country: "FRA",
    oneLine: "French novelist known for Fantômas.",
  },
  "Pierre-Joseph Proudhon": {
    name: "Pierre-Joseph Proudhon",
    country: "FRA",
    oneLine: "French political philosopher known for What Is Property?.",
  },
  Pindar: {
    name: "Pindar",
    country: "GRC",
    oneLine: "ancient Greek poet known for Victory Odes.",
  },
  "Poul Anderson": {
    name: "Poul Anderson",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  Procopius: {
    name: "Procopius",
    country: "GRC",
    oneLine: "Greece historian known for The Secret History.",
  },
  "R. A. Lafferty": {
    name: "R. A. Lafferty",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "R. Austin Freeman": {
    name: "R. Austin Freeman",
    country: "GBR",
    oneLine: "English novelist whose works include The Red Thumb Mark and The Eye of Osiris.",
  },
  "R. H. Tawney": {
    name: "R. H. Tawney",
    country: "GBR",
    oneLine: "English writer whose works include The Acquisitive Society and Religion and the Rise of Capitalism.",
  },
  "R. M. Ballantyne": {
    name: "R. M. Ballantyne",
    country: "GBR",
    oneLine: "Scottish adventure novelist known for The Coral Island.",
  },
  "Ralph Waldo Emerson": {
    name: "Ralph Waldo Emerson",
    country: "USA",
    oneLine: "American writer known for Representative Men.",
  },
  "Ray Bradbury": {
    name: "Ray Bradbury",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Richard F. Burton": {
    name: "Richard F. Burton",
    country: "GBR",
    oneLine: "English folklorist known for Vikram and the Vampire.",
  },
  "Richard Henry Dana Jr.": {
    name: "Richard Henry Dana Jr.",
    country: "USA",
    oneLine: "American novelist known for Two Years Before the Mast.",
  },
  "Richard Hughes": {
    name: "Richard Hughes",
    country: "GBR",
    oneLine: "English novelist known for A High Wind in Jamaica.",
  },
  "Richard Jefferies": {
    name: "Richard Jefferies",
    country: "GBR",
    oneLine: "English novelist whose works include World's End and After London.",
  },
  "Richard Steele": {
    name: "Richard Steele",
    country: "GBR",
    oneLine: "English dramatist known for The Conscious Lovers.",
  },
  "Richmal Crompton": {
    name: "Richmal Crompton",
    country: "GBR",
    oneLine: "English novelist known for Just William.",
  },
  "Ring Lardner": {
    name: "Ring Lardner",
    country: "USA",
    oneLine: "American writer whose works include Jack Keefe Stories and My Four Weeks in France.",
  },
  "Robert Derby Holmes": {
    name: "Robert Derby Holmes",
    country: "USA",
    oneLine: "American memoirist known for A Yankee in the Trenches.",
  },
  "Robert E. Howard": {
    name: "Robert E. Howard",
    country: "USA",
    oneLine: "American short story writer known for Conan Stories.",
  },
  "Robert Sheckley": {
    name: "Robert Sheckley",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Robert W. Service": {
    name: "Robert W. Service",
    country: "CAN",
    oneLine: "Canadian novelist known for Songs of a Sourdough.",
  },
  "Rolf Boldrewood": {
    name: "Rolf Boldrewood",
    country: "AUS",
    oneLine: "Australian novelist known for Robbery Under Arms.",
  },
  "Romain Rolland": {
    name: "Romain Rolland",
    country: "FRA",
    oneLine: "French novelist whose works include Jean-Christophe and Clerambault.",
  },
  "Ronald A. Knox": {
    name: "Ronald A. Knox",
    country: "GBR",
    oneLine: "English mystery writer whose works include The Viaduct Murder and The Three Taps.",
  },
  "Rose Macaulay": {
    name: "Rose Macaulay",
    country: "GBR",
    oneLine: "English novelist known for Dangerous Ages.",
  },
  "Rose Wilder Lane": {
    name: "Rose Wilder Lane",
    country: "USA",
    oneLine: "American novelist known for Diverging Roads.",
  },
  "Roswitha of Gandersheim": {
    name: "Roswitha of Gandersheim",
    country: "DEU",
    oneLine: "German dramatist known for Plays.",
  },
  "Rufus King": {
    name: "Rufus King",
    country: "USA",
    oneLine: "American mystery writer known for Murder by the Clock.",
  },
  "Russell Thorndike": {
    name: "Russell Thorndike",
    country: "GBR",
    oneLine: "English novelist known for Doctor Syn: A Smuggler Tale of the Romney Marsh.",
  },
  "S. Fowler Wright": {
    name: "S. Fowler Wright",
    country: "GBR",
    oneLine: "English novelist known for The World Below.",
  },
  "S. M. Mitra": {
    name: "S. M. Mitra",
    country: "IND",
    oneLine: "Indian folklorist known for Hindu Tales from the Sanskrit.",
  },
  "S. S. Van Dine": {
    name: "S. S. Van Dine",
    country: "USA",
    oneLine: "American novelist whose works include The Benson Murder Case and The Canary Murder Case.",
  },
  Saki: {
    name: "Saki",
    country: "GBR",
    oneLine: "English short story writer known for Short Fiction.",
  },
  "Samuel Pepys": {
    name: "Samuel Pepys",
    country: "GBR",
    oneLine: "English diarist known for The Diary of Samuel Pepys.",
  },
  "Samuel R. Delany": {
    name: "Samuel R. Delany",
    country: "USA",
    oneLine: "American novelist known for The Jewels of Aptor.",
  },
  "Sarah Orne Jewett": {
    name: "Sarah Orne Jewett",
    country: "USA",
    oneLine: "American novelist known for The Country of the Pointed Firs.",
  },
  "Selma Lagerlöf": {
    name: "Selma Lagerlöf",
    country: "SWE",
    oneLine: "Swedish novelist whose works include The Story of Gösta Berling and Short Fiction.",
  },
  "Sherwood Anderson": {
    name: "Sherwood Anderson",
    country: "USA",
    oneLine: "American short story writer known for Winesburg, Ohio.",
  },
  "Siegfried Sassoon": {
    name: "Siegfried Sassoon",
    country: "GBR",
    oneLine: "English novelist known for Memoirs of a Fox-Hunting Man.",
  },
  "Stella Benson": {
    name: "Stella Benson",
    country: "GBR",
    oneLine: "English novelist known for The Faraway Bride.",
  },
  "Stephen Leacock": {
    name: "Stephen Leacock",
    country: "CAN",
    oneLine: "Canadian novelist known for Sunshine Sketches of a Little Town.",
  },
  "Stephen Vincent Benét": {
    name: "Stephen Vincent Benét",
    country: "USA",
    oneLine: "American epic poet known for John Brown's Body.",
  },
  Suetonius: {
    name: "Suetonius",
    country: "ITA",
    oneLine: "Roman biographer known for The Lives of the Caesars.",
  },
  "Tanizaki Jun'ichirō": {
    name: "Tanizaki Jun'ichirō",
    country: "JPN",
    oneLine: "Japanese short story writer known for Short Fiction.",
  },
  "Taras Shevchenko": {
    name: "Taras Shevchenko",
    country: "UKR",
    oneLine: "Ukrainian poet known for Poetry.",
  },
  "Thea von Harbou": {
    name: "Thea von Harbou",
    country: "DEU",
    oneLine: "German novelist known for Metropolis.",
  },
  "Theodore Roosevelt": {
    name: "Theodore Roosevelt",
    country: "USA",
    oneLine: "American writer whose works include The Rough Riders and An Autobiography.",
  },
  Thiruvalluvar: {
    name: "Thiruvalluvar",
    country: "IND",
    oneLine: "Indian novelist known for The Kural.",
  },
  "Thomas à Kempis": {
    name: "Thomas à Kempis",
    country: "DEU",
    oneLine: "German writer known for The Imitation of Christ.",
  },
  "Thomas Bulfinch": {
    name: "Thomas Bulfinch",
    country: "USA",
    oneLine: "American writer known for Bulfinch's Mythology.",
  },
  "Thomas Carlyle": {
    name: "Thomas Carlyle",
    country: "GBR",
    oneLine: "Scottish novelist known for Sartor Resartus.",
  },
  "Thomas De Quincey": {
    name: "Thomas De Quincey",
    country: "GBR",
    oneLine: "English memoirist known for Confessions of an English Opium-Eater.",
  },
  "Thomas Gray": {
    name: "Thomas Gray",
    country: "GBR",
    oneLine: "English poet known for Poetry.",
  },
  "Thomas Hughes": {
    name: "Thomas Hughes",
    country: "GBR",
    oneLine: "English novelist known for Tom Brown's School Days.",
  },
  "Thomas Love Peacock": {
    name: "Thomas Love Peacock",
    country: "GBR",
    oneLine: "English novelist known for Nightmare Abbey.",
  },
  "Thomas More": {
    name: "Thomas More",
    country: "GBR",
    oneLine: "English novelist known for Utopia.",
  },
  "Thornton W. Burgess": {
    name: "Thornton W. Burgess",
    country: "GBR",
    oneLine: "English novelist whose works include Green Forest Stories and Green Meadow Stories.",
  },
  "Thornton Wilder": {
    name: "Thornton Wilder",
    country: "USA",
    oneLine: "American novelist known for The Bridge of San Luis Rey.",
  },
  "Thorstein Veblen": {
    name: "Thorstein Veblen",
    country: "USA",
    oneLine: "American writer known for The Theory of the Leisure Class.",
  },
  "Tom Taylor": {
    name: "Tom Taylor",
    country: "GBR",
    oneLine: "English dramatist known for Our American Cousin.",
  },
  "Vladimir Korolenko": {
    name: "Vladimir Korolenko",
    country: "RUS",
    oneLine: "Russian short story writer known for Short Fiction.",
  },
  "Voltairine de Cleyre": {
    name: "Voltairine de Cleyre",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "W. B. Yeats": {
    name: "W. B. Yeats",
    country: "IRL",
    oneLine: "Irish poet known for Poetry.",
  },
  "W. H. Hudson": {
    name: "W. H. Hudson",
    country: "GBR",
    oneLine: "English novelist known for The Purple Land.",
  },
  "W. N. P. Barbellion": {
    name: "W. N. P. Barbellion",
    country: "GBR",
    oneLine: "English novelist known for The Journal of a Disappointed Man.",
  },
  "W. R. Burnett": {
    name: "W. R. Burnett",
    country: "USA",
    oneLine: "American novelist known for Little Caesar.",
  },
  "Walter Bagehot": {
    name: "Walter Bagehot",
    country: "GBR",
    oneLine: "English writer known for The English Constitution.",
  },
  "Walter de la Mare": {
    name: "Walter de la Mare",
    country: "GBR",
    oneLine: "English novelist whose works include The Return and Memoirs of a Midget.",
  },
  "Walter M. Miller Jr.": {
    name: "Walter M. Miller Jr.",
    country: "USA",
    oneLine: "American short story writer known for Short Fiction.",
  },
  "Walter Noble Burns": {
    name: "Walter Noble Burns",
    country: "USA",
    oneLine: "American writer known for Tombstone.",
  },
  "Walter Pater": {
    name: "Walter Pater",
    country: "GBR",
    oneLine: "English novelist known for Marius the Epicurean.",
  },
  "Walter S. Masterman": {
    name: "Walter S. Masterman",
    country: "GBR",
    oneLine: "English mystery writer known for The Wrong Letter.",
  },
  "William Beckford": {
    name: "William Beckford",
    country: "GBR",
    oneLine: "English novelist known for Vathek.",
  },
  "William Carlos Williams": {
    name: "William Carlos Williams",
    country: "USA",
    oneLine: "American poet known for Poetry.",
  },
  "William Dean Howells": {
    name: "William Dean Howells",
    country: "USA",
    oneLine: "American novelist whose works include The Rise of Silas Lapham and Indian Summer.",
  },
  "William F. Cody": {
    name: "William F. Cody",
    country: "USA",
    oneLine: "American memoirist known for The Life of Buffalo Bill.",
  },
  "William Gerhardie": {
    name: "William Gerhardie",
    country: "GBR",
    oneLine: "English novelist known for Futility.",
  },
  "William Hazlitt": {
    name: "William Hazlitt",
    country: "GBR",
    oneLine: "English novelist known for Table-Talk.",
  },
  "William Hope Hodgson": {
    name: "William Hope Hodgson",
    country: "GBR",
    oneLine: "English novelist known for The Night Land.",
  },
  "Winston Churchill": {
    name: "Winston Churchill",
    country: "GBR",
    oneLine: "English novelist known for Savrola.",
  },
  "Władysław Reymont": {
    name: "Władysław Reymont",
    country: "POL",
    oneLine: "Polish novelist known for The Peasants.",
  },
  "Woodrow Wilson": {
    name: "Woodrow Wilson",
    country: "USA",
    oneLine: "American writer known for The New Freedom.",
  },
  "Zane Grey": {
    name: "Zane Grey",
    country: "USA",
    oneLine: "American novelist whose works include Betty Zane and Riders of the Purple Sage.",
  },
  "Zeami Motokiyo": {
    name: "Zeami Motokiyo",
    country: "JPN",
    oneLine: "Japanese dramatist known for Plays.",
  },
  "Zitkála-Šá": {
    name: "Zitkála-Šá",
    country: "USA",
    oneLine: "American short story writer whose works include Old Indian Legends and American Indian Stories.",
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
  DNK: "Denmark",
  LUX: "Luxembourg",
  UKR: "Ukraine",
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
    "DNK",
    "LUX",
    "UKR",
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