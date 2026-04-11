// ── Timelines data layer ─────────────────────────────────────────────────────
// Local TypeScript data. Every TimelineAuthor has verified authorId,
// non-empty linkedBookIds, and country/continent.

// ── Types ────────────────────────────────────────────────────────────────────

export interface Timeline {
  id: string
  region: string
  tradition: string
  traditionType: "tradition" | "genre"
  accentColor: string
  sortOrder: number
  description: string
}

export interface TimelineAuthor {
  id: string
  timelineId: string
  authorName: string
  authorId: string
  publicationYear: number
  mostFamousWork: string
  authorDates: string
  linkedBookIds: string[]
  shortBio: string
  sortOrder: number
  country: string
  continent: string
}

// ── Region order ─────────────────────────────────────────────────────────────

export const REGION_ORDER = [
  "Classical Mediterranean",
  "Medieval & Renaissance Europe",
  "Early Modern & Enlightenment",
  "19th Century",
  "Modern & 20th Century",
  "Eastern",
]

// ── Timelines ────────────────────────────────────────────────────────────────

export const TIMELINES: Timeline[] = [
  // ── Classical Mediterranean ──────────────────────────────────────────────
  { id: "ancient-greek", region: "Classical Mediterranean", tradition: "Ancient Greek", traditionType: "tradition", accentColor: "#0EA5E9", sortOrder: 1, description: "The wellspring of Western literature — epic, lyric, drama, philosophy, and history." },
  { id: "roman-latin", region: "Classical Mediterranean", tradition: "Roman / Latin", traditionType: "tradition", accentColor: "#EF4444", sortOrder: 2, description: "Latin literature from the Republic through the Empire — epic, oratory, satire, and philosophy." },
  { id: "epic-poetry", region: "Classical Mediterranean", tradition: "Epic Poetry", traditionType: "genre", accentColor: "#8B6F47", sortOrder: 3, description: "The long narrative poem tradition from Gilgamesh through Milton — heroes, gods, and the fate of nations." },
  { id: "greek-tragedy", region: "Classical Mediterranean", tradition: "Greek Tragedy", traditionType: "genre", accentColor: "#3B3B3B", sortOrder: 4, description: "Athenian dramatic festivals that gave the world Oedipus, Medea, and the Oresteia." },
  { id: "hellenistic-greek", region: "Classical Mediterranean", tradition: "Hellenistic Greek", traditionType: "tradition", accentColor: "#4A90C4", sortOrder: 5, description: "Greek literature after Alexander — romance, pastoral, and the spread of Hellenic culture across the Mediterranean." },
  { id: "lyric-poetry", region: "Classical Mediterranean", tradition: "Lyric Poetry", traditionType: "genre", accentColor: "#7A6B9A", sortOrder: 6, description: "Personal, musical verse from Sappho through the Romantics — the poetry of feeling and the individual voice." },
  { id: "pastoral", region: "Classical Mediterranean", tradition: "Pastoral", traditionType: "genre", accentColor: "#8BAF6E", sortOrder: 7, description: "Idealized rural life from Theocritus through Virgil's Eclogues — shepherds, song, and the golden age." },
  { id: "greek-comedy", region: "Classical Mediterranean", tradition: "Greek Comedy", traditionType: "genre", accentColor: "#5C8A6B", sortOrder: 8, description: "Athenian comic drama from Aristophanes to Menander — satire, farce, and social commentary." },

  // ── Medieval & Renaissance Europe ────────────────────────────────────────
  { id: "medieval-latin", region: "Medieval & Renaissance Europe", tradition: "Medieval Latin", traditionType: "tradition", accentColor: "#F59E0B", sortOrder: 1, description: "Monastic and courtly writing in Latin across medieval Christendom." },
  { id: "italian", region: "Medieval & Renaissance Europe", tradition: "Italian", traditionType: "tradition", accentColor: "#6B8E4E", sortOrder: 2, description: "From Dante's vernacular revolution through Petrarch and Boccaccio to the Renaissance." },
  { id: "middle-english", region: "Medieval & Renaissance Europe", tradition: "Middle English", traditionType: "tradition", accentColor: "#5C4A3B", sortOrder: 3, description: "English literature from Chaucer to Malory — vernacular storytelling in a multilingual age." },
  { id: "elizabethan-drama", region: "Medieval & Renaissance Europe", tradition: "Elizabethan Drama", traditionType: "genre", accentColor: "#7B2D2D", sortOrder: 4, description: "The explosion of English-language theater under Elizabeth I and James I." },
  { id: "old-norse", region: "Medieval & Renaissance Europe", tradition: "Old Norse / Icelandic Saga", traditionType: "tradition", accentColor: "#4A6B8B", sortOrder: 5, description: "Sagas, eddas, and skaldic verse from Viking-age Scandinavia and medieval Iceland." },
  { id: "old-english", region: "Medieval & Renaissance Europe", tradition: "Old English", traditionType: "tradition", accentColor: "#6B5C4A", sortOrder: 6, description: "Anglo-Saxon poetry and prose — Beowulf, elegies, and the birth of English literature." },
  { id: "provencal-troubadour", region: "Medieval & Renaissance Europe", tradition: "Provençal / Troubadour", traditionType: "tradition", accentColor: "#9A6B7A", sortOrder: 7, description: "The courtly love tradition of southern France — troubadour lyrics that reshaped European poetry." },
  { id: "renaissance-italian", region: "Medieval & Renaissance Europe", tradition: "Renaissance Italian", traditionType: "tradition", accentColor: "#4E8B6B", sortOrder: 8, description: "Italian humanism and the rebirth of classical learning — Machiavelli, Castiglione, and the new man." },
  { id: "chivalric-romance", region: "Medieval & Renaissance Europe", tradition: "Chivalric Romance", traditionType: "genre", accentColor: "#8B4A6B", sortOrder: 9, description: "Arthurian legend and courtly adventure — knights, quests, and the ideal of chivalry." },
  { id: "mystery-play", region: "Medieval & Renaissance Europe", tradition: "Mystery Play", traditionType: "genre", accentColor: "#6B6B4A", sortOrder: 10, description: "Biblical cycle plays performed by medieval guilds — the origin of English drama." },

  // ── Early Modern & Enlightenment ─────────────────────────────────────────
  { id: "french", region: "Early Modern & Enlightenment", tradition: "French", traditionType: "tradition", accentColor: "#EC4899", sortOrder: 1, description: "French letters from Montaigne through the philosophes — essays, satire, and social critique." },
  { id: "german", region: "Early Modern & Enlightenment", tradition: "German", traditionType: "tradition", accentColor: "#2D3748", sortOrder: 2, description: "German literature from the Reformation through Sturm und Drang to Weimar Classicism." },
  { id: "spanish", region: "Early Modern & Enlightenment", tradition: "Spanish", traditionType: "tradition", accentColor: "#8B1A1A", sortOrder: 3, description: "The Golden Age of Spanish literature — picaresque, drama, and the birth of the modern novel." },
  { id: "essay", region: "Early Modern & Enlightenment", tradition: "Essay", traditionType: "genre", accentColor: "#6B5B47", sortOrder: 4, description: "The personal essay from Montaigne onward — a genre built on candor, curiosity, and self-examination." },
  { id: "philosophical-treatise", region: "Early Modern & Enlightenment", tradition: "Philosophical Treatise", traditionType: "genre", accentColor: "#3A3A52", sortOrder: 5, description: "Systematic works of philosophy from Descartes through Kant to the modern era." },
  { id: "dutch-golden-age", region: "Early Modern & Enlightenment", tradition: "Dutch Golden Age", traditionType: "tradition", accentColor: "#C97A1E", sortOrder: 6, description: "Literature of the Dutch Republic's cultural zenith — philosophy, travel, and mercantile humanism." },
  { id: "polish", region: "Early Modern & Enlightenment", tradition: "Polish", traditionType: "tradition", accentColor: "#8B2D4A", sortOrder: 7, description: "Polish literature from the Renaissance through the partition era — poetry, drama, and exile." },
  { id: "satire", region: "Early Modern & Enlightenment", tradition: "Satire", traditionType: "genre", accentColor: "#7A8B3B", sortOrder: 8, description: "Literature of mockery and moral correction — from Juvenal through Swift to modern irony." },
  { id: "picaresque", region: "Early Modern & Enlightenment", tradition: "Picaresque", traditionType: "genre", accentColor: "#9A7A4A", sortOrder: 9, description: "Adventures of rogues and tricksters — the anti-heroic novel tradition from Lazarillo to Tom Jones." },
  { id: "epistolary-novel", region: "Early Modern & Enlightenment", tradition: "Epistolary Novel", traditionType: "genre", accentColor: "#6B7A8B", sortOrder: 10, description: "Novels told through letters — an intimate form that dominated 18th-century fiction." },

  // ── 19th Century ─────────────────────────────────────────────────────────
  { id: "russian", region: "19th Century", tradition: "Russian", traditionType: "tradition", accentColor: "#6366F1", sortOrder: 1, description: "The golden age of Russian prose — psychological depth, moral urgency, and social panorama." },
  { id: "american", region: "19th Century", tradition: "American", traditionType: "tradition", accentColor: "#22C55E", sortOrder: 2, description: "The American Renaissance and beyond — Transcendentalism, realism, and the democratic voice." },
  { id: "british-victorian", region: "19th Century", tradition: "British Victorian", traditionType: "tradition", accentColor: "#8B5CF6", sortOrder: 3, description: "The great age of the English novel — social realism, serialization, and moral inquiry." },
  { id: "gothic-novel", region: "19th Century", tradition: "Gothic Novel", traditionType: "genre", accentColor: "#2C1B2E", sortOrder: 4, description: "Terror, the sublime, and the dark side of Romanticism — from Walpole to the Brontës." },
  { id: "romantic-poetry", region: "19th Century", tradition: "Romantic Poetry", traditionType: "genre", accentColor: "#5C7A3B", sortOrder: 5, description: "Nature, imagination, and individual feeling — the poets who remade English verse." },
  { id: "realism", region: "19th Century", tradition: "Realism", traditionType: "genre", accentColor: "#6B6B6B", sortOrder: 6, description: "Faithful representation of everyday life — the dominant mode of 19th-century fiction." },
  { id: "french-realism", region: "19th Century", tradition: "French Realism", traditionType: "tradition", accentColor: "#4A5C8B", sortOrder: 7, description: "The French masters of realistic fiction — Balzac, Flaubert, Zola, and the novel as social science." },
  { id: "german-romanticism", region: "19th Century", tradition: "German Romanticism", traditionType: "tradition", accentColor: "#5C6B3B", sortOrder: 8, description: "German idealism in literature — philosophy, nature mysticism, and the Bildungsroman tradition." },
  { id: "transcendentalism", region: "19th Century", tradition: "Transcendentalism", traditionType: "genre", accentColor: "#3B7A5C", sortOrder: 9, description: "American philosophical idealism — self-reliance, nature, and the oversoul." },
  { id: "detective-fiction", region: "19th Century", tradition: "Detective Fiction", traditionType: "genre", accentColor: "#5C4A4A", sortOrder: 10, description: "The mystery genre from Poe's Dupin through Holmes to the golden age of detective fiction." },
  { id: "bildungsroman", region: "19th Century", tradition: "Bildungsroman", traditionType: "genre", accentColor: "#7A5C3B", sortOrder: 11, description: "The coming-of-age novel — tracing a protagonist's moral and psychological growth." },

  // ── Modern & 20th Century ────────────────────────────────────────────────
  { id: "modernist", region: "Modern & 20th Century", tradition: "Modernist", traditionType: "genre", accentColor: "#14B8A6", sortOrder: 1, description: "Radical experiments in form and consciousness — stream of consciousness, fragmentation, myth." },
  { id: "existentialist", region: "Modern & 20th Century", tradition: "Existentialist", traditionType: "genre", accentColor: "#2A2A2A", sortOrder: 2, description: "Literature of freedom, absurdity, and radical choice — from Kierkegaard to Camus." },
  { id: "latin-american", region: "Modern & 20th Century", tradition: "Latin American", traditionType: "tradition", accentColor: "#C97A3B", sortOrder: 3, description: "The Boom and beyond — magical realism, political witness, and a continent finding its voice." },
  { id: "absurdist-theater", region: "Modern & 20th Century", tradition: "Absurdist Theater", traditionType: "genre", accentColor: "#8B7B3B", sortOrder: 4, description: "Drama stripped of logic and meaning — Beckett, Ionesco, and the theater of the absurd." },
  { id: "irish-modernism", region: "Modern & 20th Century", tradition: "Irish Modernism", traditionType: "tradition", accentColor: "#2D5C3B", sortOrder: 5, description: "Ireland's outsized contribution to modernist literature — Joyce, Yeats, Wilde, Beckett, Shaw." },
  { id: "harlem-renaissance", region: "Modern & 20th Century", tradition: "Harlem Renaissance", traditionType: "tradition", accentColor: "#6B4A3B", sortOrder: 6, description: "The flowering of Black American literature, art, and thought in 1920s New York." },
  { id: "southern-gothic", region: "Modern & 20th Century", tradition: "Southern Gothic", traditionType: "genre", accentColor: "#4A3B2D", sortOrder: 7, description: "The American South's dark literary tradition — grotesque, haunted, and morally complex." },
  { id: "dystopian-fiction", region: "Modern & 20th Century", tradition: "Dystopian Fiction", traditionType: "genre", accentColor: "#4A4A5C", sortOrder: 8, description: "Nightmare futures and totalitarian warnings — from Wells through Huxley to Orwell." },
  { id: "stream-of-consciousness", region: "Modern & 20th Century", tradition: "Stream of Consciousness", traditionType: "genre", accentColor: "#5C7A8B", sortOrder: 9, description: "Narrative technique that captures the flow of thought — Joyce, Woolf, Faulkner, Proust." },
  { id: "magical-realism", region: "Modern & 20th Century", tradition: "Magical Realism", traditionType: "genre", accentColor: "#D4944A", sortOrder: 10, description: "The matter-of-fact supernatural — a Latin American innovation that reshaped world fiction." },
  { id: "beat-generation", region: "Modern & 20th Century", tradition: "Beat Generation", traditionType: "genre", accentColor: "#6B5C4A", sortOrder: 11, description: "Countercultural American writing of the 1950s — spontaneous prose, jazz, and spiritual seeking." },

  // ── Eastern ──────────────────────────────────────────────────────────────
  { id: "classical-chinese", region: "Eastern", tradition: "Classical Chinese", traditionType: "tradition", accentColor: "#7B2D2D", sortOrder: 1, description: "Three millennia of poetry, philosophy, and narrative — from the Shijing to the great novels." },
  { id: "classical-japanese", region: "Eastern", tradition: "Classical Japanese", traditionType: "tradition", accentColor: "#2D3B4A", sortOrder: 2, description: "The world's first novel tradition — court diaries, mono no aware, and haiku." },
  { id: "persian", region: "Eastern", tradition: "Persian", traditionType: "tradition", accentColor: "#1E4A7A", sortOrder: 3, description: "Epic, lyric, and mystical poetry — Ferdowsi, Rumi, Hafez, and the Sufi tradition." },
  { id: "sanskrit", region: "Eastern", tradition: "Sanskrit", traditionType: "tradition", accentColor: "#C97A3B", sortOrder: 4, description: "The epics, dramas, and poetry of classical India — Valmiki, Kalidasa, and the Mahabharata." },
  { id: "tang-dynasty-poetry", region: "Eastern", tradition: "Tang Dynasty Poetry", traditionType: "genre", accentColor: "#8B4A3B", sortOrder: 5, description: "The golden age of Chinese poetry — Li Bai, Du Fu, and the art of the regulated verse." },
  { id: "heian-court-literature", region: "Eastern", tradition: "Heian Court Literature", traditionType: "genre", accentColor: "#6B5C7A", sortOrder: 6, description: "Aristocratic Japanese writing of the Heian period — Genji, The Pillow Book, and the birth of the novel." },
  { id: "edo-period", region: "Eastern", tradition: "Edo Period", traditionType: "tradition", accentColor: "#3B5C4A", sortOrder: 7, description: "Japanese literature under the Tokugawa shogunate — haiku, kabuki, and the floating world." },
  { id: "classical-arabic", region: "Eastern", tradition: "Classical Arabic", traditionType: "tradition", accentColor: "#7B5C2D", sortOrder: 8, description: "Arabic literature from the pre-Islamic odes through the Abbasid golden age." },
  { id: "urdu", region: "Eastern", tradition: "Urdu", traditionType: "tradition", accentColor: "#6B8B5C", sortOrder: 9, description: "The ghazal tradition and modern Urdu prose — Ghalib, Iqbal, and the literature of the subcontinent." },
  { id: "bengali", region: "Eastern", tradition: "Bengali", traditionType: "tradition", accentColor: "#8B6B3B", sortOrder: 10, description: "Bengali literature from the Bengal Renaissance through Tagore to modern fiction." },

]

// ── Timeline Authors ─────────────────────────────────────────────────────────
// Every entry has: authorId (verified), linkedBookIds (non-empty, verified),
// country and continent fields.

export const TIMELINE_AUTHORS: TimelineAuthor[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // ANCIENT GREEK
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ag-homer", timelineId: "ancient-greek", authorName: "Homer", authorId: "homer", publicationYear: -750, mostFamousWork: "The Iliad", authorDates: "c. 8th century BCE", linkedBookIds: ["the-iliad", "the-odyssey"], shortBio: "Legendary poet whose Iliad and Odyssey are the foundational epics of Western literature.", sortOrder: 1, country: "Greece", continent: "Europe" },
  { id: "ag-aeschylus", timelineId: "ancient-greek", authorName: "Aeschylus", authorId: "aeschylus", publicationYear: -458, mostFamousWork: "The Oresteia", authorDates: "c. 525–456 BCE", linkedBookIds: ["agamemnon", "the-eumenides", "the-libation-bearers"], shortBio: "Father of tragedy who expanded drama from one actor to two and invented the trilogy.", sortOrder: 2, country: "Greece", continent: "Europe" },
  { id: "ag-sophocles", timelineId: "ancient-greek", authorName: "Sophocles", authorId: "sophocles", publicationYear: -441, mostFamousWork: "Oedipus Rex", authorDates: "c. 496–406 BCE", linkedBookIds: ["oedipus-rex", "antigone", "electra", "philoctetes", "the-trachiniae"], shortBio: "Master dramatist who perfected tragic irony and brought a third actor to the stage.", sortOrder: 3, country: "Greece", continent: "Europe" },
  { id: "ag-herodotus", timelineId: "ancient-greek", authorName: "Herodotus", authorId: "herodotus", publicationYear: -430, mostFamousWork: "The Histories", authorDates: "c. 484–425 BCE", linkedBookIds: ["histories", "the-histories"], shortBio: "Father of History who chronicled the Persian Wars with insatiable curiosity.", sortOrder: 4, country: "Greece", continent: "Europe" },
  { id: "ag-thucydides", timelineId: "ancient-greek", authorName: "Thucydides", authorId: "thucydides", publicationYear: -411, mostFamousWork: "History of the Peloponnesian War", authorDates: "c. 460–400 BCE", linkedBookIds: ["history-of-the-peloponnesian-war"], shortBio: "Athenian general turned historian who wrote the definitive account of the Peloponnesian War.", sortOrder: 5, country: "Greece", continent: "Europe" },
  { id: "ag-plato", timelineId: "ancient-greek", authorName: "Plato", authorId: "plato", publicationYear: -380, mostFamousWork: "The Republic", authorDates: "c. 428–348 BCE", linkedBookIds: ["the-republic", "apology", "symposium"], shortBio: "Philosopher whose dialogues defined the Western intellectual tradition.", sortOrder: 6, country: "Greece", continent: "Europe" },
  { id: "ag-aristotle", timelineId: "ancient-greek", authorName: "Aristotle", authorId: "aristotle", publicationYear: -335, mostFamousWork: "Nicomachean Ethics", authorDates: "384–322 BCE", linkedBookIds: ["nicomachean-ethics"], shortBio: "Polymath who systematized logic, ethics, poetics, and natural science.", sortOrder: 7, country: "Greece", continent: "Europe" },
  { id: "ag-apollonius", timelineId: "ancient-greek", authorName: "Apollonius of Rhodes", authorId: "apollonius-of-rhodes", publicationYear: -250, mostFamousWork: "Argonautica", authorDates: "c. 295–215 BCE", linkedBookIds: ["the-argonautica"], shortBio: "Hellenistic epic poet whose Argonautica retold Jason's quest for the Golden Fleece.", sortOrder: 8, country: "Greece", continent: "Europe" },
  { id: "ag-apuleius", timelineId: "ancient-greek", authorName: "Apuleius", authorId: "apuleius", publicationYear: 170, mostFamousWork: "The Golden Ass", authorDates: "c. 124–170 CE", linkedBookIds: ["the-golden-ass"], shortBio: "Roman-African novelist whose Golden Ass is the only complete Latin novel to survive.", sortOrder: 9, country: "Algeria", continent: "Africa" },

  // ══════════════════════════════════════════════════════════════════════════
  // ROMAN / LATIN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "rl-julius-caesar", timelineId: "roman-latin", authorName: "Julius Caesar", authorId: "julius-caesar", publicationYear: -50, mostFamousWork: "Commentarii de Bello Gallico", authorDates: "100–44 BCE", linkedBookIds: ["commentaries-on-the-gallic-war", "de-bello-gallico"], shortBio: "Dictator, general, and prose stylist whose war commentaries set the standard for Latin clarity.", sortOrder: 1, country: "Italy", continent: "Europe" },
  { id: "rl-cicero", timelineId: "roman-latin", authorName: "Cicero", authorId: "cicero", publicationYear: -45, mostFamousWork: "Tusculan Disputations", authorDates: "106–43 BCE", linkedBookIds: ["tusculan-disputations"], shortBio: "Rome's greatest orator whose philosophical works shaped Latin prose for centuries.", sortOrder: 2, country: "Italy", continent: "Europe" },
  { id: "rl-virgil", timelineId: "roman-latin", authorName: "Virgil", authorId: "virgil", publicationYear: -19, mostFamousWork: "The Aeneid", authorDates: "70–19 BCE", linkedBookIds: ["the-aeneid", "the-eclogues", "the-georgics"], shortBio: "Rome's national poet whose Aeneid gave the empire its founding myth.", sortOrder: 3, country: "Italy", continent: "Europe" },
  { id: "rl-ovid", timelineId: "roman-latin", authorName: "Ovid", authorId: "ovid", publicationYear: 8, mostFamousWork: "Metamorphoses", authorDates: "43 BCE – 17 CE", linkedBookIds: ["metamorphoses"], shortBio: "Poet of transformation whose Metamorphoses became the mythology handbook of Western art.", sortOrder: 4, country: "Italy", continent: "Europe" },
  { id: "rl-seneca", timelineId: "roman-latin", authorName: "Seneca", authorId: "seneca", publicationYear: 65, mostFamousWork: "Dialogues", authorDates: "c. 4 BCE – 65 CE", linkedBookIds: ["dialogues"], shortBio: "Stoic philosopher and dramatist whose moral letters remain a guide to practical wisdom.", sortOrder: 5, country: "Italy", continent: "Europe" },
  { id: "rl-marcus-aurelius", timelineId: "roman-latin", authorName: "Marcus Aurelius", authorId: "marcus-aurelius", publicationYear: 180, mostFamousWork: "Meditations", authorDates: "121–180 CE", linkedBookIds: ["meditations"], shortBio: "Philosopher-emperor whose private journal of Stoic self-examination became an enduring guide.", sortOrder: 6, country: "Italy", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // EPIC POETRY (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ep-homer", timelineId: "epic-poetry", authorName: "Homer", authorId: "homer", publicationYear: -750, mostFamousWork: "The Iliad", authorDates: "c. 8th century BCE", linkedBookIds: ["the-iliad", "the-odyssey"], shortBio: "The archetype of the epic poet — his Iliad and Odyssey defined the genre for all who followed.", sortOrder: 1, country: "Greece", continent: "Europe" },
  { id: "ep-virgil", timelineId: "epic-poetry", authorName: "Virgil", authorId: "virgil", publicationYear: -19, mostFamousWork: "The Aeneid", authorDates: "70–19 BCE", linkedBookIds: ["the-aeneid"], shortBio: "Rome's answer to Homer — the Aeneid fused Greek epic tradition with Roman destiny.", sortOrder: 2, country: "Italy", continent: "Europe" },
  { id: "ep-dante", timelineId: "epic-poetry", authorName: "Dante Alighieri", authorId: "dante-alighieri", publicationYear: 1320, mostFamousWork: "The Divine Comedy", authorDates: "1265–1321", linkedBookIds: ["the-divine-comedy"], shortBio: "Medieval Florence's exile who journeyed through Hell, Purgatory, and Paradise.", sortOrder: 3, country: "Italy", continent: "Europe" },
  { id: "ep-spenser", timelineId: "epic-poetry", authorName: "Edmund Spenser", authorId: "edmund-spenser", publicationYear: 1590, mostFamousWork: "The Faerie Queene", authorDates: "1552–1599", linkedBookIds: ["the-faerie-queene"], shortBio: "Elizabethan poet whose allegorical Faerie Queene is the greatest English epic before Milton.", sortOrder: 4, country: "England", continent: "Europe" },
  { id: "ep-milton", timelineId: "epic-poetry", authorName: "John Milton", authorId: "john-milton", publicationYear: 1667, mostFamousWork: "Paradise Lost", authorDates: "1608–1674", linkedBookIds: ["paradise-lost"], shortBio: "Blind Puritan who retold the Fall of Man in English blank verse of sublime grandeur.", sortOrder: 5, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // GREEK TRAGEDY (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "gt-aeschylus", timelineId: "greek-tragedy", authorName: "Aeschylus", authorId: "aeschylus", publicationYear: -458, mostFamousWork: "The Oresteia", authorDates: "c. 525–456 BCE", linkedBookIds: ["agamemnon", "the-eumenides", "the-libation-bearers"], shortBio: "First great tragedian who fought at Marathon and brought cosmic justice to the stage.", sortOrder: 1, country: "Greece", continent: "Europe" },
  { id: "gt-sophocles", timelineId: "greek-tragedy", authorName: "Sophocles", authorId: "sophocles", publicationYear: -441, mostFamousWork: "Antigone", authorDates: "c. 496–406 BCE", linkedBookIds: ["oedipus-rex", "antigone"], shortBio: "Dramatist of tragic irony — Oedipus and Antigone remain archetypes of moral conflict.", sortOrder: 2, country: "Greece", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // HELLENISTIC GREEK
  // ══════════════════════════════════════════════════════════════════════════
  { id: "hg-apollonius", timelineId: "hellenistic-greek", authorName: "Apollonius of Rhodes", authorId: "apollonius-of-rhodes", publicationYear: -250, mostFamousWork: "Argonautica", authorDates: "c. 295–215 BCE", linkedBookIds: ["the-argonautica"], shortBio: "Hellenistic epic poet who retold Jason's quest in a new, psychologically complex key.", sortOrder: 1, country: "Greece", continent: "Europe" },
  { id: "hg-apuleius", timelineId: "hellenistic-greek", authorName: "Apuleius", authorId: "apuleius", publicationYear: 170, mostFamousWork: "The Golden Ass", authorDates: "c. 124–170 CE", linkedBookIds: ["the-golden-ass"], shortBio: "The only complete Latin novel to survive — a picaresque tale of magic and transformation.", sortOrder: 2, country: "Algeria", continent: "Africa" },

  // ══════════════════════════════════════════════════════════════════════════
  // PASTORAL (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "pa-virgil", timelineId: "pastoral", authorName: "Virgil", authorId: "virgil", publicationYear: -37, mostFamousWork: "The Eclogues", authorDates: "70–19 BCE", linkedBookIds: ["the-eclogues", "the-georgics"], shortBio: "Master of Latin pastoral — the Eclogues and Georgics idealized rural life for two millennia.", sortOrder: 1, country: "Italy", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // MEDIEVAL LATIN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ml-augustine", timelineId: "medieval-latin", authorName: "Augustine", authorId: "augustine", publicationYear: 426, mostFamousWork: "The City of God", authorDates: "354–430", linkedBookIds: ["the-city-of-god"], shortBio: "Bishop and theologian whose works shaped Western Christianity and invented autobiography.", sortOrder: 1, country: "Algeria", continent: "Africa" },

  // ══════════════════════════════════════════════════════════════════════════
  // ITALIAN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "it-dante", timelineId: "italian", authorName: "Dante Alighieri", authorId: "dante-alighieri", publicationYear: 1320, mostFamousWork: "The Divine Comedy", authorDates: "1265–1321", linkedBookIds: ["the-divine-comedy"], shortBio: "Exiled Florentine who wrote the supreme poem of medieval Christendom in Tuscan vernacular.", sortOrder: 1, country: "Italy", continent: "Europe" },
  { id: "it-machiavelli", timelineId: "italian", authorName: "Niccolò Machiavelli", authorId: "niccolo-machiavelli", publicationYear: 1532, mostFamousWork: "The Prince", authorDates: "1469–1527", linkedBookIds: ["the-prince"], shortBio: "Florentine diplomat whose treatise on political power gave the West a new vocabulary.", sortOrder: 2, country: "Italy", continent: "Europe" },
  { id: "it-collodi", timelineId: "italian", authorName: "Carlo Collodi", authorId: "carlo-collodi", publicationYear: 1883, mostFamousWork: "Pinocchio", authorDates: "1826–1890", linkedBookIds: ["the-adventures-of-pinocchio"], shortBio: "Creator of Pinocchio — the wooden puppet whose story became Italy's most famous children's book.", sortOrder: 3, country: "Italy", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // MIDDLE ENGLISH
  // ══════════════════════════════════════════════════════════════════════════
  { id: "me-chaucer", timelineId: "middle-english", authorName: "Geoffrey Chaucer", authorId: "geoffrey-chaucer", publicationYear: 1400, mostFamousWork: "The Canterbury Tales", authorDates: "c. 1343–1400", linkedBookIds: ["the-canterbury-tales"], shortBio: "Father of English literature — his pilgrims' tales are the first great panorama of English society.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "me-malory", timelineId: "middle-english", authorName: "Thomas Malory", authorId: "thomas-malory", publicationYear: 1485, mostFamousWork: "Le Morte d'Arthur", authorDates: "c. 1415–1471", linkedBookIds: ["le-morte-darthur"], shortBio: "Knight-prisoner who compiled the definitive English-language Arthurian romance.", sortOrder: 2, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // OLD ENGLISH
  // ══════════════════════════════════════════════════════════════════════════
  { id: "oe-beowulf", timelineId: "old-english", authorName: "The Beowulf Poet", authorId: "unknown-beowulf", publicationYear: 1000, mostFamousWork: "Beowulf", authorDates: "c. 8th–11th century", linkedBookIds: ["beowulf"], shortBio: "Anonymous Anglo-Saxon poet whose epic of monsters and heroes is the greatest Old English poem.", sortOrder: 1, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // CHIVALRIC ROMANCE (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "cr-malory", timelineId: "chivalric-romance", authorName: "Thomas Malory", authorId: "thomas-malory", publicationYear: 1485, mostFamousWork: "Le Morte d'Arthur", authorDates: "c. 1415–1471", linkedBookIds: ["le-morte-darthur"], shortBio: "Compiled the definitive English Arthurian cycle from French and English sources.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "cr-spenser", timelineId: "chivalric-romance", authorName: "Edmund Spenser", authorId: "edmund-spenser", publicationYear: 1590, mostFamousWork: "The Faerie Queene", authorDates: "1552–1599", linkedBookIds: ["the-faerie-queene"], shortBio: "Allegorical romance epic celebrating Elizabethan virtues through Arthurian-style quests.", sortOrder: 2, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // RENAISSANCE ITALIAN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ri-machiavelli", timelineId: "renaissance-italian", authorName: "Niccolò Machiavelli", authorId: "niccolo-machiavelli", publicationYear: 1532, mostFamousWork: "The Prince", authorDates: "1469–1527", linkedBookIds: ["the-prince"], shortBio: "Renaissance political theorist whose name became synonymous with cunning statecraft.", sortOrder: 1, country: "Italy", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // ELIZABETHAN DRAMA (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ed-marlowe", timelineId: "elizabethan-drama", authorName: "Christopher Marlowe", authorId: "christopher-marlowe", publicationYear: 1592, mostFamousWork: "Doctor Faustus", authorDates: "1564–1593", linkedBookIds: ["edward-ii", "the-jew-of-malta", "the-tragical-history-of-doctor-faustus"], shortBio: "Spy, poet, and dramatist who forged the mighty line of English blank verse before his murder at 29.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "ed-shakespeare", timelineId: "elizabethan-drama", authorName: "William Shakespeare", authorId: "william-shakespeare", publicationYear: 1601, mostFamousWork: "Hamlet", authorDates: "1564–1616", linkedBookIds: ["hamlet", "macbeth", "king-lear", "othello", "the-tempest", "a-midsummer-nights-dream", "romeo-and-juliet", "twelfth-night"], shortBio: "The central figure of world drama — poet, actor, and playwright whose works define the human condition.", sortOrder: 2, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // FRENCH
  // ══════════════════════════════════════════════════════════════════════════
  { id: "fr-voltaire", timelineId: "french", authorName: "Voltaire", authorId: "voltaire", publicationYear: 1759, mostFamousWork: "Candide", authorDates: "1694–1778", linkedBookIds: ["candide"], shortBio: "Philosophe and satirist whose Candide skewered optimism with devastating wit.", sortOrder: 1, country: "France", continent: "Europe" },
  { id: "fr-rousseau", timelineId: "french", authorName: "Jean-Jacques Rousseau", authorId: "jean-jacques-rousseau", publicationYear: 1762, mostFamousWork: "The Social Contract", authorDates: "1712–1778", linkedBookIds: ["the-social-contract"], shortBio: "Political philosopher whose ideas on natural freedom helped ignite the French Revolution.", sortOrder: 2, country: "France", continent: "Europe" },
  { id: "fr-hugo", timelineId: "french", authorName: "Victor Hugo", authorId: "victor-hugo", publicationYear: 1862, mostFamousWork: "Les Misérables", authorDates: "1802–1885", linkedBookIds: ["les-miserables", "notre-dame-de-paris", "toilers-of-the-sea"], shortBio: "Titan of French Romanticism whose novels championed the poor and outcast.", sortOrder: 3, country: "France", continent: "Europe" },
  { id: "fr-balzac", timelineId: "french", authorName: "Honoré de Balzac", authorId: "honor-de-balzac", publicationYear: 1835, mostFamousWork: "Père Goriot", authorDates: "1799–1850", linkedBookIds: ["father-goriot", "eugenie-grandet", "lost-illusions"], shortBio: "Titan of realism whose ninety-novel Comédie Humaine mapped post-Napoleonic France.", sortOrder: 4, country: "France", continent: "Europe" },
  { id: "fr-flaubert", timelineId: "french", authorName: "Gustave Flaubert", authorId: "gustave-flaubert", publicationYear: 1857, mostFamousWork: "Madame Bovary", authorDates: "1821–1880", linkedBookIds: ["madame-bovary", "salammbo"], shortBio: "Perfectionist stylist whose Madame Bovary established the modern novel's commitment to le mot juste.", sortOrder: 5, country: "France", continent: "Europe" },
  { id: "fr-zola", timelineId: "french", authorName: "Émile Zola", authorId: "emile-zola", publicationYear: 1885, mostFamousWork: "Germinal", authorDates: "1840–1902", linkedBookIds: ["germinal"], shortBio: "Naturalist novelist who exposed the brutality of industrial France.", sortOrder: 6, country: "France", continent: "Europe" },
  { id: "fr-dumas", timelineId: "french", authorName: "Alexandre Dumas", authorId: "alexandre-dumas", publicationYear: 1844, mostFamousWork: "The Three Musketeers", authorDates: "1802–1870", linkedBookIds: ["the-three-musketeers", "the-count-of-monte-cristo"], shortBio: "Master of swashbuckling adventure whose historical romances remain irresistible.", sortOrder: 7, country: "France", continent: "Europe" },
  { id: "fr-proust", timelineId: "french", authorName: "Marcel Proust", authorId: "marcel-proust", publicationYear: 1913, mostFamousWork: "In Search of Lost Time", authorDates: "1871–1922", linkedBookIds: ["in-search-of-lost-time"], shortBio: "Supreme novelist of memory whose seven-volume masterpiece remade the novel's relation to time.", sortOrder: 8, country: "France", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // GERMAN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ge-nietzsche", timelineId: "german", authorName: "Friedrich Nietzsche", authorId: "friedrich-nietzsche", publicationYear: 1883, mostFamousWork: "Thus Spake Zarathustra", authorDates: "1844–1900", linkedBookIds: ["thus-spake-zarathustra", "beyond-good-and-evil", "the-genealogy-of-morals"], shortBio: "Radical philosopher of the will to power, the death of God, and the Übermensch.", sortOrder: 1, country: "Germany", continent: "Europe" },
  { id: "ge-mann", timelineId: "german", authorName: "Thomas Mann", authorId: "thomas-mann", publicationYear: 1901, mostFamousWork: "Buddenbrooks", authorDates: "1875–1955", linkedBookIds: ["buddenbrooks", "the-magic-mountain"], shortBio: "Nobel laureate whose novels chronicle the decline of bourgeois Germany with ironic mastery.", sortOrder: 2, country: "Germany", continent: "Europe" },
  { id: "ge-hesse", timelineId: "german", authorName: "Hermann Hesse", authorId: "hermann-hesse", publicationYear: 1922, mostFamousWork: "Siddhartha", authorDates: "1877–1962", linkedBookIds: ["siddhartha", "steppenwolf", "demian"], shortBio: "Nobel laureate who fused Eastern philosophy with European Bildungsroman.", sortOrder: 3, country: "Germany", continent: "Europe" },
  { id: "ge-kafka", timelineId: "german", authorName: "Franz Kafka", authorId: "franz-kafka", publicationYear: 1926, mostFamousWork: "The Castle", authorDates: "1883–1924", linkedBookIds: ["the-castle"], shortBio: "Prague-born visionary of bureaucratic nightmare and existential dread.", sortOrder: 4, country: "Czechia", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // SPANISH
  // ══════════════════════════════════════════════════════════════════════════
  { id: "sp-cervantes", timelineId: "spanish", authorName: "Miguel de Cervantes", authorId: "miguel-de-cervantes", publicationYear: 1605, mostFamousWork: "Don Quixote", authorDates: "1547–1616", linkedBookIds: ["don-quixote"], shortBio: "One-armed veteran whose Don Quixote invented the modern novel.", sortOrder: 1, country: "Spain", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // ESSAY (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "es-locke", timelineId: "essay", authorName: "John Locke", authorId: "john-locke", publicationYear: 1689, mostFamousWork: "Two Treatises of Government", authorDates: "1632–1704", linkedBookIds: ["two-treatises-of-government"], shortBio: "Empiricist whose ideas on natural rights shaped liberal democracy.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "es-smith", timelineId: "essay", authorName: "Adam Smith", authorId: "adam-smith", publicationYear: 1759, mostFamousWork: "The Wealth of Nations", authorDates: "1723–1790", linkedBookIds: ["the-wealth-of-nations", "the-theory-of-moral-sentiments"], shortBio: "Father of economics whose Wealth of Nations laid the foundations of free-market theory.", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "es-paine", timelineId: "essay", authorName: "Thomas Paine", authorId: "thomas-paine", publicationYear: 1776, mostFamousWork: "Common Sense", authorDates: "1737–1809", linkedBookIds: ["the-rights-of-man", "the-age-of-reason"], shortBio: "Revolutionary pamphleteer whose Common Sense helped spark American independence.", sortOrder: 3, country: "USA", continent: "North America" },
  { id: "es-wollstonecraft", timelineId: "essay", authorName: "Mary Wollstonecraft", authorId: "mary-wollstonecraft", publicationYear: 1792, mostFamousWork: "A Vindication of the Rights of Woman", authorDates: "1759–1797", linkedBookIds: ["a-vindication-of-the-rights-of-woman"], shortBio: "Pioneer feminist whose Vindication argued for women's education and equality.", sortOrder: 4, country: "England", continent: "Europe" },
  { id: "es-mill", timelineId: "essay", authorName: "John Stuart Mill", authorId: "john-stuart-mill", publicationYear: 1859, mostFamousWork: "On Liberty", authorDates: "1806–1873", linkedBookIds: ["on-liberty", "the-subjection-of-women"], shortBio: "Utilitarian philosopher whose On Liberty remains the classic defense of individual freedom.", sortOrder: 5, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // PHILOSOPHICAL TREATISE (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "pt-hobbes", timelineId: "philosophical-treatise", authorName: "Thomas Hobbes", authorId: "thomas-hobbes", publicationYear: 1651, mostFamousWork: "Leviathan", authorDates: "1588–1679", linkedBookIds: ["leviathan"], shortBio: "Political philosopher who argued life without government is 'solitary, poor, nasty, brutish, and short.'", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "pt-locke", timelineId: "philosophical-treatise", authorName: "John Locke", authorId: "john-locke", publicationYear: 1689, mostFamousWork: "Two Treatises of Government", authorDates: "1632–1704", linkedBookIds: ["two-treatises-of-government"], shortBio: "Father of empiricism and liberalism whose ideas shaped the American founding.", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "pt-rousseau", timelineId: "philosophical-treatise", authorName: "Jean-Jacques Rousseau", authorId: "jean-jacques-rousseau", publicationYear: 1762, mostFamousWork: "The Social Contract", authorDates: "1712–1778", linkedBookIds: ["the-social-contract"], shortBio: "Argued that man is born free but everywhere in chains — ideas that fueled the French Revolution.", sortOrder: 3, country: "France", continent: "Europe" },
  { id: "pt-nietzsche", timelineId: "philosophical-treatise", authorName: "Friedrich Nietzsche", authorId: "friedrich-nietzsche", publicationYear: 1886, mostFamousWork: "Beyond Good and Evil", authorDates: "1844–1900", linkedBookIds: ["beyond-good-and-evil", "thus-spake-zarathustra"], shortBio: "Philosopher who challenged Western morality, religion, and the will to truth.", sortOrder: 4, country: "Germany", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // SATIRE (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "sa-swift", timelineId: "satire", authorName: "Jonathan Swift", authorId: "jonathan-swift", publicationYear: 1726, mostFamousWork: "Gulliver's Travels", authorDates: "1667–1745", linkedBookIds: ["gullivers-travels"], shortBio: "Anglo-Irish satirist whose Gulliver's Travels savaged human folly with savage precision.", sortOrder: 1, country: "Ireland", continent: "Europe" },
  { id: "sa-voltaire", timelineId: "satire", authorName: "Voltaire", authorId: "voltaire", publicationYear: 1759, mostFamousWork: "Candide", authorDates: "1694–1778", linkedBookIds: ["candide"], shortBio: "Philosophe whose Candide demolished optimistic philosophy with lethal comedy.", sortOrder: 2, country: "France", continent: "Europe" },
  { id: "sa-twain", timelineId: "satire", authorName: "Mark Twain", authorId: "mark-twain", publicationYear: 1884, mostFamousWork: "Adventures of Huckleberry Finn", authorDates: "1835–1910", linkedBookIds: ["the-adventures-of-huckleberry-finn", "a-connecticut-yankee-in-king-arthurs-court"], shortBio: "America's great humorist whose Mississippi tales mask a deep critique of American hypocrisy.", sortOrder: 3, country: "USA", continent: "North America" },
  { id: "sa-wilde", timelineId: "satire", authorName: "Oscar Wilde", authorId: "oscar-wilde", publicationYear: 1895, mostFamousWork: "The Importance of Being Earnest", authorDates: "1854–1900", linkedBookIds: ["the-importance-of-being-earnest", "the-picture-of-dorian-gray"], shortBio: "Aesthete and wit whose comedies and epigrams made him the most quotable writer in English.", sortOrder: 4, country: "Ireland", continent: "Europe" },
  { id: "sa-waugh", timelineId: "satire", authorName: "Evelyn Waugh", authorId: "evelyn-waugh", publicationYear: 1928, mostFamousWork: "Decline and Fall", authorDates: "1903–1966", linkedBookIds: ["decline-and-fall", "vile-bodies"], shortBio: "Catholic satirist whose early novels captured the Bright Young Things of interwar England.", sortOrder: 5, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // PICARESQUE (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "pi-defoe", timelineId: "picaresque", authorName: "Daniel Defoe", authorId: "daniel-defoe", publicationYear: 1719, mostFamousWork: "Robinson Crusoe", authorDates: "1660–1731", linkedBookIds: ["the-life-and-adventures-of-robinson-crusoe", "moll-flanders"], shortBio: "Father of the English novel whose Crusoe and Moll Flanders pioneered realistic adventure fiction.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "pi-fielding", timelineId: "picaresque", authorName: "Henry Fielding", authorId: "henry-fielding", publicationYear: 1749, mostFamousWork: "Tom Jones", authorDates: "1707–1754", linkedBookIds: ["the-history-of-tom-jones-a-foundling"], shortBio: "Novelist and magistrate whose Tom Jones is the great comic picaresque of English literature.", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "pi-cervantes", timelineId: "picaresque", authorName: "Miguel de Cervantes", authorId: "miguel-de-cervantes", publicationYear: 1615, mostFamousWork: "Don Quixote", authorDates: "1547–1616", linkedBookIds: ["don-quixote"], shortBio: "Don Quixote is the greatest picaresque — a knight-errant's comic journey through a disenchanted Spain.", sortOrder: 3, country: "Spain", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // EPISTOLARY NOVEL (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "en-richardson", timelineId: "epistolary-novel", authorName: "Samuel Richardson", authorId: "samuel-richardson", publicationYear: 1748, mostFamousWork: "Clarissa", authorDates: "1689–1761", linkedBookIds: ["clarissa"], shortBio: "Printer turned novelist whose Clarissa is the longest and greatest epistolary novel in English.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "en-sterne", timelineId: "epistolary-novel", authorName: "Laurence Sterne", authorId: "laurence-sterne", publicationYear: 1759, mostFamousWork: "Tristram Shandy", authorDates: "1713–1768", linkedBookIds: ["the-life-and-opinions-of-tristram-shandy-gentleman"], shortBio: "Anti-novelist whose Tristram Shandy subverted every convention of linear storytelling.", sortOrder: 2, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // POLISH
  // ══════════════════════════════════════════════════════════════════════════
  { id: "po-conrad", timelineId: "polish", authorName: "Joseph Conrad", authorId: "joseph-conrad", publicationYear: 1899, mostFamousWork: "Heart of Darkness", authorDates: "1857–1924", linkedBookIds: ["heart-of-darkness", "lord-jim", "nostromo", "the-secret-agent"], shortBio: "Polish-born master of English prose whose sea novels explore moral darkness and colonial guilt.", sortOrder: 1, country: "Poland", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // RUSSIAN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ru-turgenev", timelineId: "russian", authorName: "Ivan Turgenev", authorId: "ivan-turgenev", publicationYear: 1862, mostFamousWork: "Fathers and Children", authorDates: "1818–1883", linkedBookIds: ["fathers-and-children"], shortBio: "Elegant stylist who chronicled the conflict between Russian liberals and nihilists.", sortOrder: 1, country: "Russia", continent: "Europe" },
  { id: "ru-dostoevsky", timelineId: "russian", authorName: "Fyodor Dostoevsky", authorId: "fyodor-dostoevsky", publicationYear: 1866, mostFamousWork: "Crime and Punishment", authorDates: "1821–1881", linkedBookIds: ["crime-and-punishment", "the-brothers-karamazov", "the-idiot", "notes-from-underground"], shortBio: "Novelist of extremity — guilt, freedom, faith. Every modern psychological novel descends from him.", sortOrder: 2, country: "Russia", continent: "Europe" },
  { id: "ru-tolstoy", timelineId: "russian", authorName: "Leo Tolstoy", authorId: "leo-tolstoy", publicationYear: 1869, mostFamousWork: "War and Peace", authorDates: "1828–1910", linkedBookIds: ["war-and-peace", "anna-karenina", "hadji-murad", "resurrection"], shortBio: "The supreme realist novelist — War and Peace is the novel against which all others are measured.", sortOrder: 3, country: "Russia", continent: "Europe" },
  { id: "ru-kropotkin", timelineId: "russian", authorName: "Peter Kropotkin", authorId: "peter-kropotkin", publicationYear: 1902, mostFamousWork: "Mutual Aid", authorDates: "1842–1921", linkedBookIds: ["mutual-aid", "the-conquest-of-bread", "memoirs-of-a-revolutionist"], shortBio: "Anarchist prince and scientist who argued that cooperation, not competition, drives evolution.", sortOrder: 4, country: "Russia", continent: "Europe" },
  { id: "ru-chekhov", timelineId: "russian", authorName: "Anton Chekhov", authorId: "anton-chekhov", publicationYear: 1904, mostFamousWork: "The Cherry Orchard", authorDates: "1860–1904", linkedBookIds: ["the-cherry-orchard", "uncle-vanya", "three-sisters"], shortBio: "Master of the short story and the plotless play — his art of indirection changed modern drama.", sortOrder: 5, country: "Russia", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // AMERICAN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "am-cooper", timelineId: "american", authorName: "James Fenimore Cooper", authorId: "james-fenimore-cooper", publicationYear: 1826, mostFamousWork: "The Last of the Mohicans", authorDates: "1789–1851", linkedBookIds: ["the-last-of-the-mohicans"], shortBio: "First major American novelist — his Leatherstocking Tales created the frontier romance.", sortOrder: 1, country: "USA", continent: "North America" },
  { id: "am-poe", timelineId: "american", authorName: "Edgar Allan Poe", authorId: "edgar-allan-poe", publicationYear: 1838, mostFamousWork: "The Raven", authorDates: "1809–1849", linkedBookIds: ["the-narrative-of-arthur-gordon-pym-of-nantucket"], shortBio: "Inventor of the detective story and master of the macabre.", sortOrder: 2, country: "USA", continent: "North America" },
  { id: "am-douglass", timelineId: "american", authorName: "Frederick Douglass", authorId: "frederick-douglass", publicationYear: 1845, mostFamousWork: "Narrative of the Life of Frederick Douglass", authorDates: "1818–1895", linkedBookIds: ["narrative-of-the-life-of-frederick-douglass"], shortBio: "Escaped slave turned orator and abolitionist whose autobiography is a masterpiece of American prose.", sortOrder: 3, country: "USA", continent: "North America" },
  { id: "am-hawthorne", timelineId: "american", authorName: "Nathaniel Hawthorne", authorId: "nathaniel-hawthorne", publicationYear: 1850, mostFamousWork: "The Scarlet Letter", authorDates: "1804–1864", linkedBookIds: ["the-scarlet-letter", "the-house-of-the-seven-gables"], shortBio: "Dark Romantic who explored sin, guilt, and hypocrisy in Puritan New England.", sortOrder: 4, country: "USA", continent: "North America" },
  { id: "am-melville", timelineId: "american", authorName: "Herman Melville", authorId: "herman-melville", publicationYear: 1851, mostFamousWork: "Moby-Dick", authorDates: "1819–1891", linkedBookIds: ["moby-dick", "typee"], shortBio: "Sailor turned novelist whose Moby-Dick was rediscovered as the great American novel.", sortOrder: 5, country: "USA", continent: "North America" },
  { id: "am-stowe", timelineId: "american", authorName: "Harriet Beecher Stowe", authorId: "harriet-beecher-stowe", publicationYear: 1852, mostFamousWork: "Uncle Tom's Cabin", authorDates: "1811–1896", linkedBookIds: ["uncle-toms-cabin"], shortBio: "Her novel helped fuel the abolitionist movement — Lincoln reportedly called her 'the little woman who started this great war.'", sortOrder: 6, country: "USA", continent: "North America" },
  { id: "am-whitman", timelineId: "american", authorName: "Walt Whitman", authorId: "walt-whitman", publicationYear: 1855, mostFamousWork: "Leaves of Grass", authorDates: "1819–1892", linkedBookIds: ["leaves-of-grass"], shortBio: "Poet of democracy, the body, and the open road whose free verse remade American poetry.", sortOrder: 7, country: "USA", continent: "North America" },
  { id: "am-twain", timelineId: "american", authorName: "Mark Twain", authorId: "mark-twain", publicationYear: 1884, mostFamousWork: "Adventures of Huckleberry Finn", authorDates: "1835–1910", linkedBookIds: ["the-adventures-of-huckleberry-finn", "the-adventures-of-tom-sawyer"], shortBio: "America's great humorist — Hemingway said all modern American literature comes from Huck Finn.", sortOrder: 8, country: "USA", continent: "North America" },
  { id: "am-wharton", timelineId: "american", authorName: "Edith Wharton", authorId: "edith-wharton", publicationYear: 1905, mostFamousWork: "The House of Mirth", authorDates: "1862–1937", linkedBookIds: ["the-house-of-mirth", "the-age-of-innocence", "ethan-frome"], shortBio: "First woman to win the Pulitzer for fiction — chronicler of Gilded Age New York society.", sortOrder: 9, country: "USA", continent: "North America" },
  { id: "am-london", timelineId: "american", authorName: "Jack London", authorId: "jack-london", publicationYear: 1903, mostFamousWork: "The Call of the Wild", authorDates: "1876–1916", linkedBookIds: ["the-call-of-the-wild", "white-fang", "the-sea-wolf"], shortBio: "Adventure writer and socialist whose tales of survival in the wild captured the American imagination.", sortOrder: 10, country: "USA", continent: "North America" },

  // ══════════════════════════════════════════════════════════════════════════
  // BRITISH VICTORIAN
  // ══════════════════════════════════════════════════════════════════════════
  { id: "bv-dickens", timelineId: "british-victorian", authorName: "Charles Dickens", authorId: "charles-dickens", publicationYear: 1861, mostFamousWork: "Great Expectations", authorDates: "1812–1870", linkedBookIds: ["great-expectations", "a-tale-of-two-cities", "oliver-twist", "david-copperfield", "bleak-house"], shortBio: "The most popular Victorian novelist — social crusader and creator of an immortal gallery of characters.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "bv-c-bronte", timelineId: "british-victorian", authorName: "Charlotte Brontë", authorId: "charlotte-bronte", publicationYear: 1847, mostFamousWork: "Jane Eyre", authorDates: "1816–1855", linkedBookIds: ["jane-eyre"], shortBio: "Parson's daughter whose Jane Eyre gave the English novel a passionate, independent heroine.", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "bv-thackeray", timelineId: "british-victorian", authorName: "William Makepeace Thackeray", authorId: "william-makepeace-thackeray", publicationYear: 1848, mostFamousWork: "Vanity Fair", authorDates: "1811–1863", linkedBookIds: ["vanity-fair", "the-history-of-henry-esmond"], shortBio: "Dickens's great rival — Vanity Fair is the definitive satirical panorama of Regency England.", sortOrder: 3, country: "England", continent: "Europe" },
  { id: "bv-gaskell", timelineId: "british-victorian", authorName: "Elizabeth Gaskell", authorId: "elizabeth-gaskell", publicationYear: 1855, mostFamousWork: "North and South", authorDates: "1810–1865", linkedBookIds: ["north-and-south", "cranford"], shortBio: "Social novelist who bridged the industrial divide between Manchester and the rural south.", sortOrder: 4, country: "England", continent: "Europe" },
  { id: "bv-trollope", timelineId: "british-victorian", authorName: "Anthony Trollope", authorId: "anthony-trollope", publicationYear: 1857, mostFamousWork: "Barchester Towers", authorDates: "1815–1882", linkedBookIds: ["barchester-towers", "the-warden", "the-way-we-live-now"], shortBio: "Prolific chronicler of English ecclesiastical and political life across 47 novels.", sortOrder: 5, country: "England", continent: "Europe" },
  { id: "bv-eliot", timelineId: "british-victorian", authorName: "George Eliot", authorId: "george-eliot", publicationYear: 1871, mostFamousWork: "Middlemarch", authorDates: "1819–1880", linkedBookIds: ["middlemarch", "silas-marner", "the-mill-on-the-floss"], shortBio: "The greatest intellectual novelist of the Victorian age — Middlemarch is the definitive study of provincial life.", sortOrder: 6, country: "England", continent: "Europe" },
  { id: "bv-collins", timelineId: "british-victorian", authorName: "Wilkie Collins", authorId: "wilkie-collins", publicationYear: 1868, mostFamousWork: "The Moonstone", authorDates: "1824–1889", linkedBookIds: ["the-moonstone", "the-woman-in-white"], shortBio: "Father of the English detective novel — The Moonstone is the first and greatest.", sortOrder: 7, country: "England", continent: "Europe" },
  { id: "bv-hardy", timelineId: "british-victorian", authorName: "Thomas Hardy", authorId: "thomas-hardy", publicationYear: 1891, mostFamousWork: "Tess of the d'Urbervilles", authorDates: "1840–1928", linkedBookIds: ["tess-of-the-durbervilles", "far-from-the-madding-crowd", "jude-the-obscure"], shortBio: "Novelist and poet of Wessex whose tragic heroines struggle against fate and an indifferent universe.", sortOrder: 8, country: "England", continent: "Europe" },
  { id: "bv-wilde", timelineId: "british-victorian", authorName: "Oscar Wilde", authorId: "oscar-wilde", publicationYear: 1890, mostFamousWork: "The Picture of Dorian Gray", authorDates: "1854–1900", linkedBookIds: ["the-picture-of-dorian-gray", "the-importance-of-being-earnest"], shortBio: "Aesthete, wit, and martyr whose comedies and novel made him the most quotable writer in English.", sortOrder: 9, country: "Ireland", continent: "Europe" },
  { id: "bv-james", timelineId: "british-victorian", authorName: "Henry James", authorId: "henry-james", publicationYear: 1881, mostFamousWork: "The Portrait of a Lady", authorDates: "1843–1916", linkedBookIds: ["the-portrait-of-a-lady", "the-turn-of-the-screw", "the-wings-of-the-dove"], shortBio: "American-born master of psychological fiction who bridged the Victorian and Modernist novel.", sortOrder: 10, country: "USA", continent: "North America" },

  // ══════════════════════════════════════════════════════════════════════════
  // GOTHIC NOVEL (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "gn-walpole", timelineId: "gothic-novel", authorName: "Horace Walpole", authorId: "horace-walpole", publicationYear: 1764, mostFamousWork: "The Castle of Otranto", authorDates: "1717–1797", linkedBookIds: ["the-castle-of-otranto"], shortBio: "Inventor of the Gothic novel — Otranto's haunted castle launched a genre of terror.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "gn-shelley", timelineId: "gothic-novel", authorName: "Mary Shelley", authorId: "mary-shelley", publicationYear: 1818, mostFamousWork: "Frankenstein", authorDates: "1797–1851", linkedBookIds: ["frankenstein", "the-last-man"], shortBio: "Teenage prodigy whose Frankenstein fused Gothic horror with science fiction.", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "gn-e-bronte", timelineId: "gothic-novel", authorName: "Emily Brontë", authorId: "emily-bronte", publicationYear: 1847, mostFamousWork: "Wuthering Heights", authorDates: "1818–1848", linkedBookIds: ["wuthering-heights"], shortBio: "Author of a single, wild novel of passion and revenge on the Yorkshire moors.", sortOrder: 3, country: "England", continent: "Europe" },
  { id: "gn-le-fanu", timelineId: "gothic-novel", authorName: "Sheridan Le Fanu", authorId: "sheridan-le-fanu", publicationYear: 1872, mostFamousWork: "In a Glass Darkly", authorDates: "1814–1873", linkedBookIds: ["in-a-glass-darkly", "uncle-silas"], shortBio: "Irish master of supernatural fiction whose ghost stories influenced M. R. James and Bram Stoker.", sortOrder: 4, country: "Ireland", continent: "Europe" },
  { id: "gn-stoker", timelineId: "gothic-novel", authorName: "Bram Stoker", authorId: "bram-stoker", publicationYear: 1897, mostFamousWork: "Dracula", authorDates: "1847–1912", linkedBookIds: ["dracula"], shortBio: "Irish theater manager whose epistolary Dracula became the most enduring horror myth.", sortOrder: 5, country: "Ireland", continent: "Europe" },
  { id: "gn-stevenson", timelineId: "gothic-novel", authorName: "Robert Louis Stevenson", authorId: "robert-louis-stevenson", publicationYear: 1886, mostFamousWork: "Strange Case of Dr Jekyll and Mr Hyde", authorDates: "1850–1894", linkedBookIds: ["strange-case-of-dr-jekyll-and-mr-hyde", "treasure-island"], shortBio: "Scottish master of adventure and horror whose Jekyll and Hyde explored the duality of human nature.", sortOrder: 6, country: "Scotland", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // REALISM (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "re-balzac", timelineId: "realism", authorName: "Honoré de Balzac", authorId: "honor-de-balzac", publicationYear: 1835, mostFamousWork: "Père Goriot", authorDates: "1799–1850", linkedBookIds: ["father-goriot", "eugenie-grandet"], shortBio: "Titan of French realism whose Comédie Humaine mapped all of post-Napoleonic France.", sortOrder: 1, country: "France", continent: "Europe" },
  { id: "re-flaubert", timelineId: "realism", authorName: "Gustave Flaubert", authorId: "gustave-flaubert", publicationYear: 1857, mostFamousWork: "Madame Bovary", authorDates: "1821–1880", linkedBookIds: ["madame-bovary"], shortBio: "Perfectionist whose Madame Bovary established the modern novel's commitment to the exact word.", sortOrder: 2, country: "France", continent: "Europe" },
  { id: "re-eliot", timelineId: "realism", authorName: "George Eliot", authorId: "george-eliot", publicationYear: 1871, mostFamousWork: "Middlemarch", authorDates: "1819–1880", linkedBookIds: ["middlemarch"], shortBio: "Victorian realist whose Middlemarch Virginia Woolf called 'one of the few English novels for grown-ups.'", sortOrder: 3, country: "England", continent: "Europe" },
  { id: "re-zola", timelineId: "realism", authorName: "Émile Zola", authorId: "emile-zola", publicationYear: 1885, mostFamousWork: "Germinal", authorDates: "1840–1902", linkedBookIds: ["germinal"], shortBio: "Naturalist who exposed industrial brutality in his Rougon-Macquart cycle.", sortOrder: 4, country: "France", continent: "Europe" },
  { id: "re-hardy", timelineId: "realism", authorName: "Thomas Hardy", authorId: "thomas-hardy", publicationYear: 1891, mostFamousWork: "Tess of the d'Urbervilles", authorDates: "1840–1928", linkedBookIds: ["tess-of-the-durbervilles"], shortBio: "Chronicler of rural Wessex whose tragic vision challenged Victorian optimism.", sortOrder: 5, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // FRENCH REALISM
  // ══════════════════════════════════════════════════════════════════════════
  { id: "fre-balzac", timelineId: "french-realism", authorName: "Honoré de Balzac", authorId: "honor-de-balzac", publicationYear: 1835, mostFamousWork: "Père Goriot", authorDates: "1799–1850", linkedBookIds: ["father-goriot", "eugenie-grandet", "lost-illusions"], shortBio: "Titan of French realism whose Comédie Humaine mapped the social world of post-Napoleonic France.", sortOrder: 1, country: "France", continent: "Europe" },
  { id: "fre-flaubert", timelineId: "french-realism", authorName: "Gustave Flaubert", authorId: "gustave-flaubert", publicationYear: 1857, mostFamousWork: "Madame Bovary", authorDates: "1821–1880", linkedBookIds: ["madame-bovary"], shortBio: "The novelist as artist — Madame Bovary established a new standard of prose perfection.", sortOrder: 2, country: "France", continent: "Europe" },
  { id: "fre-hugo", timelineId: "french-realism", authorName: "Victor Hugo", authorId: "victor-hugo", publicationYear: 1862, mostFamousWork: "Les Misérables", authorDates: "1802–1885", linkedBookIds: ["les-miserables", "notre-dame-de-paris"], shortBio: "Romantic colossus whose Les Misérables is the supreme novel of social justice.", sortOrder: 3, country: "France", continent: "Europe" },
  { id: "fre-zola", timelineId: "french-realism", authorName: "Émile Zola", authorId: "emile-zola", publicationYear: 1885, mostFamousWork: "Germinal", authorDates: "1840–1902", linkedBookIds: ["germinal"], shortBio: "Leader of literary naturalism whose Germinal exposed the horrors of coal mining.", sortOrder: 4, country: "France", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // GERMAN ROMANTICISM
  // ══════════════════════════════════════════════════════════════════════════
  { id: "gr-nietzsche", timelineId: "german-romanticism", authorName: "Friedrich Nietzsche", authorId: "friedrich-nietzsche", publicationYear: 1883, mostFamousWork: "Thus Spake Zarathustra", authorDates: "1844–1900", linkedBookIds: ["thus-spake-zarathustra"], shortBio: "Philosopher-poet whose Zarathustra fused German Romanticism with radical iconoclasm.", sortOrder: 1, country: "Germany", continent: "Europe" },
  { id: "gr-mann", timelineId: "german-romanticism", authorName: "Thomas Mann", authorId: "thomas-mann", publicationYear: 1924, mostFamousWork: "The Magic Mountain", authorDates: "1875–1955", linkedBookIds: ["the-magic-mountain", "buddenbrooks"], shortBio: "Nobel laureate who channeled German intellectual tradition into the modern novel.", sortOrder: 2, country: "Germany", continent: "Europe" },
  { id: "gr-hesse", timelineId: "german-romanticism", authorName: "Hermann Hesse", authorId: "hermann-hesse", publicationYear: 1922, mostFamousWork: "Siddhartha", authorDates: "1877–1962", linkedBookIds: ["siddhartha", "steppenwolf"], shortBio: "Seeker who fused Eastern mysticism with the German Bildungsroman.", sortOrder: 3, country: "Germany", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // DETECTIVE FICTION (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "df-poe", timelineId: "detective-fiction", authorName: "Edgar Allan Poe", authorId: "edgar-allan-poe", publicationYear: 1841, mostFamousWork: "The Murders in the Rue Morgue", authorDates: "1809–1849", linkedBookIds: ["the-narrative-of-arthur-gordon-pym-of-nantucket"], shortBio: "Inventor of the detective story with C. Auguste Dupin — the template for all who followed.", sortOrder: 1, country: "USA", continent: "North America" },
  { id: "df-collins", timelineId: "detective-fiction", authorName: "Wilkie Collins", authorId: "wilkie-collins", publicationYear: 1868, mostFamousWork: "The Moonstone", authorDates: "1824–1889", linkedBookIds: ["the-moonstone", "the-woman-in-white"], shortBio: "Dickens's protégé whose Moonstone T. S. Eliot called 'the first and greatest of English detective novels.'", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "df-doyle", timelineId: "detective-fiction", authorName: "Arthur Conan Doyle", authorId: "arthur-conan-doyle", publicationYear: 1887, mostFamousWork: "A Study in Scarlet", authorDates: "1859–1930", linkedBookIds: ["a-study-in-scarlet", "the-hound-of-the-baskervilles", "the-adventures-of-sherlock-holmes"], shortBio: "Creator of Sherlock Holmes — the most famous detective in literature.", sortOrder: 3, country: "Scotland", continent: "Europe" },
  { id: "df-christie", timelineId: "detective-fiction", authorName: "Agatha Christie", authorId: "agatha-christie", publicationYear: 1920, mostFamousWork: "The Murder of Roger Ackroyd", authorDates: "1890–1976", linkedBookIds: ["the-murder-of-roger-ackroyd", "the-mysterious-affair-at-styles"], shortBio: "Queen of Crime — the best-selling fiction writer of all time.", sortOrder: 4, country: "England", continent: "Europe" },
  { id: "df-sayers", timelineId: "detective-fiction", authorName: "Dorothy L. Sayers", authorId: "dorothy-l-sayers", publicationYear: 1923, mostFamousWork: "Whose Body?", authorDates: "1893–1957", linkedBookIds: ["whose-body", "clouds-of-witness"], shortBio: "Scholar and novelist who raised the detective novel to literary respectability with Lord Peter Wimsey.", sortOrder: 5, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // BILDUNGSROMAN (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "bi-dickens", timelineId: "bildungsroman", authorName: "Charles Dickens", authorId: "charles-dickens", publicationYear: 1850, mostFamousWork: "David Copperfield", authorDates: "1812–1870", linkedBookIds: ["david-copperfield", "great-expectations"], shortBio: "Master of the coming-of-age novel — David Copperfield was his 'favourite child.'", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "bi-c-bronte", timelineId: "bildungsroman", authorName: "Charlotte Brontë", authorId: "charlotte-bronte", publicationYear: 1847, mostFamousWork: "Jane Eyre", authorDates: "1816–1855", linkedBookIds: ["jane-eyre"], shortBio: "Jane Eyre's journey from orphan to independent woman is the archetypal female Bildungsroman.", sortOrder: 2, country: "England", continent: "Europe" },
  { id: "bi-joyce", timelineId: "bildungsroman", authorName: "James Joyce", authorId: "james-joyce", publicationYear: 1916, mostFamousWork: "A Portrait of the Artist as a Young Man", authorDates: "1882–1941", linkedBookIds: ["a-portrait-of-the-artist-as-a-young-man"], shortBio: "Stephen Dedalus's awakening from Dublin boyhood to artistic vocation — the modernist Bildungsroman.", sortOrder: 3, country: "Ireland", continent: "Europe" },
  { id: "bi-hesse", timelineId: "bildungsroman", authorName: "Hermann Hesse", authorId: "hermann-hesse", publicationYear: 1919, mostFamousWork: "Demian", authorDates: "1877–1962", linkedBookIds: ["demian", "siddhartha"], shortBio: "Master of spiritual coming-of-age — Demian and Siddhartha chart the soul's quest for self-knowledge.", sortOrder: 4, country: "Germany", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // MODERNIST (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "mo-conrad", timelineId: "modernist", authorName: "Joseph Conrad", authorId: "joseph-conrad", publicationYear: 1899, mostFamousWork: "Heart of Darkness", authorDates: "1857–1924", linkedBookIds: ["heart-of-darkness", "lord-jim", "nostromo"], shortBio: "Polish-born master of English prose who mapped the moral darkness of imperialism.", sortOrder: 1, country: "Poland", continent: "Europe" },
  { id: "mo-proust", timelineId: "modernist", authorName: "Marcel Proust", authorId: "marcel-proust", publicationYear: 1913, mostFamousWork: "In Search of Lost Time", authorDates: "1871–1922", linkedBookIds: ["in-search-of-lost-time"], shortBio: "The supreme novelist of memory — his seven-volume masterpiece remade the novel's relation to time.", sortOrder: 2, country: "France", continent: "Europe" },
  { id: "mo-joyce", timelineId: "modernist", authorName: "James Joyce", authorId: "james-joyce", publicationYear: 1922, mostFamousWork: "Ulysses", authorDates: "1882–1941", linkedBookIds: ["ulysses", "dubliners", "a-portrait-of-the-artist-as-a-young-man"], shortBio: "Irish exile whose Ulysses exploded the novel's form and made a single Dublin day contain all life.", sortOrder: 3, country: "Ireland", continent: "Europe" },
  { id: "mo-woolf", timelineId: "modernist", authorName: "Virginia Woolf", authorId: "virginia-woolf", publicationYear: 1925, mostFamousWork: "Mrs Dalloway", authorDates: "1882–1941", linkedBookIds: ["mrs-dalloway", "to-the-lighthouse", "orlando"], shortBio: "Pioneer of stream of consciousness whose novels map the inner life with luminous precision.", sortOrder: 4, country: "England", continent: "Europe" },
  { id: "mo-kafka", timelineId: "modernist", authorName: "Franz Kafka", authorId: "franz-kafka", publicationYear: 1926, mostFamousWork: "The Castle", authorDates: "1883–1924", linkedBookIds: ["the-castle"], shortBio: "Visionary of alienation whose unfinished novels depict a world of inscrutable authority.", sortOrder: 5, country: "Czechia", continent: "Europe" },
  { id: "mo-forster", timelineId: "modernist", authorName: "E. M. Forster", authorId: "e-m-forster", publicationYear: 1924, mostFamousWork: "A Passage to India", authorDates: "1879–1970", linkedBookIds: ["a-passage-to-india", "howards-end", "a-room-with-a-view"], shortBio: "Novelist of human connection across barriers of class, nation, and culture.", sortOrder: 6, country: "England", continent: "Europe" },
  { id: "mo-hemingway", timelineId: "modernist", authorName: "Ernest Hemingway", authorId: "ernest-hemingway", publicationYear: 1926, mostFamousWork: "The Sun Also Rises", authorDates: "1899–1961", linkedBookIds: ["the-sun-also-rises", "a-farewell-to-arms"], shortBio: "Master of the terse style — his iceberg theory of prose changed American writing.", sortOrder: 7, country: "USA", continent: "North America" },
  { id: "mo-faulkner", timelineId: "modernist", authorName: "William Faulkner", authorId: "william-faulkner", publicationYear: 1929, mostFamousWork: "The Sound and the Fury", authorDates: "1897–1962", linkedBookIds: ["the-sound-and-the-fury", "as-i-lay-dying"], shortBio: "Laureate of the American South who mapped Yoknapatawpha County in stream of consciousness.", sortOrder: 8, country: "USA", continent: "North America" },
  { id: "mo-lawrence", timelineId: "modernist", authorName: "D. H. Lawrence", authorId: "d-h-lawrence", publicationYear: 1913, mostFamousWork: "Sons and Lovers", authorDates: "1885–1930", linkedBookIds: ["sons-and-lovers", "women-in-love", "the-rainbow"], shortBio: "Coal miner's son who wrote novels of passion, class, and the body with visionary intensity.", sortOrder: 9, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // EXISTENTIALIST (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "ex-dostoevsky", timelineId: "existentialist", authorName: "Fyodor Dostoevsky", authorId: "fyodor-dostoevsky", publicationYear: 1864, mostFamousWork: "Notes from Underground", authorDates: "1821–1881", linkedBookIds: ["notes-from-underground", "crime-and-punishment", "the-brothers-karamazov"], shortBio: "The Underground Man's rant became the founding text of literary existentialism.", sortOrder: 1, country: "Russia", continent: "Europe" },
  { id: "ex-kafka", timelineId: "existentialist", authorName: "Franz Kafka", authorId: "franz-kafka", publicationYear: 1926, mostFamousWork: "The Castle", authorDates: "1883–1924", linkedBookIds: ["the-castle"], shortBio: "His name became an adjective — Kafkaesque captures the bewildering absurdity of modern existence.", sortOrder: 2, country: "Czechia", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // IRISH MODERNISM
  // ══════════════════════════════════════════════════════════════════════════
  { id: "im-wilde", timelineId: "irish-modernism", authorName: "Oscar Wilde", authorId: "oscar-wilde", publicationYear: 1890, mostFamousWork: "The Picture of Dorian Gray", authorDates: "1854–1900", linkedBookIds: ["the-picture-of-dorian-gray", "the-importance-of-being-earnest"], shortBio: "Dublin-born aesthete whose brilliance lit up London before his tragic downfall.", sortOrder: 1, country: "Ireland", continent: "Europe" },
  { id: "im-shaw", timelineId: "irish-modernism", authorName: "George Bernard Shaw", authorId: "george-bernard-shaw", publicationYear: 1903, mostFamousWork: "Man and Superman", authorDates: "1856–1950", linkedBookIds: ["pygmalion", "man-and-superman", "mrs-warrens-profession"], shortBio: "Irish Nobel laureate whose witty, provocative plays reformed the English stage.", sortOrder: 2, country: "Ireland", continent: "Europe" },
  { id: "im-joyce", timelineId: "irish-modernism", authorName: "James Joyce", authorId: "james-joyce", publicationYear: 1922, mostFamousWork: "Ulysses", authorDates: "1882–1941", linkedBookIds: ["ulysses", "dubliners"], shortBio: "Ireland's most revolutionary writer — Ulysses remade the novel from Dublin exile.", sortOrder: 3, country: "Ireland", continent: "Europe" },
  { id: "im-stoker", timelineId: "irish-modernism", authorName: "Bram Stoker", authorId: "bram-stoker", publicationYear: 1897, mostFamousWork: "Dracula", authorDates: "1847–1912", linkedBookIds: ["dracula"], shortBio: "Dublin-born author whose Dracula created the modern vampire myth.", sortOrder: 4, country: "Ireland", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // HARLEM RENAISSANCE
  // ══════════════════════════════════════════════════════════════════════════
  { id: "hr-douglass", timelineId: "harlem-renaissance", authorName: "Frederick Douglass", authorId: "frederick-douglass", publicationYear: 1845, mostFamousWork: "Narrative of the Life of Frederick Douglass", authorDates: "1818–1895", linkedBookIds: ["narrative-of-the-life-of-frederick-douglass"], shortBio: "The foundational voice of Black American letters — from slavery to statecraft.", sortOrder: 1, country: "USA", continent: "North America" },
  { id: "hr-dubois", timelineId: "harlem-renaissance", authorName: "W. E. B. Du Bois", authorId: "w-e-b-du-bois", publicationYear: 1903, mostFamousWork: "The Souls of Black Folk", authorDates: "1868–1963", linkedBookIds: ["the-souls-of-black-folk", "darkwater", "dark-princess"], shortBio: "Scholar, activist, and intellectual architect of the civil rights movement.", sortOrder: 2, country: "USA", continent: "North America" },

  // ══════════════════════════════════════════════════════════════════════════
  // SOUTHERN GOTHIC (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "sg-poe", timelineId: "southern-gothic", authorName: "Edgar Allan Poe", authorId: "edgar-allan-poe", publicationYear: 1838, mostFamousWork: "The Fall of the House of Usher", authorDates: "1809–1849", linkedBookIds: ["the-narrative-of-arthur-gordon-pym-of-nantucket"], shortBio: "Virginia-raised master of the macabre who pioneered the American Gothic tradition.", sortOrder: 1, country: "USA", continent: "North America" },
  { id: "sg-faulkner", timelineId: "southern-gothic", authorName: "William Faulkner", authorId: "william-faulkner", publicationYear: 1930, mostFamousWork: "As I Lay Dying", authorDates: "1897–1962", linkedBookIds: ["the-sound-and-the-fury", "as-i-lay-dying"], shortBio: "Mississippi Nobel laureate whose Yoknapatawpha saga is the summit of Southern Gothic fiction.", sortOrder: 2, country: "USA", continent: "North America" },

  // ══════════════════════════════════════════════════════════════════════════
  // DYSTOPIAN FICTION (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "dy-wells", timelineId: "dystopian-fiction", authorName: "H. G. Wells", authorId: "h-g-wells", publicationYear: 1895, mostFamousWork: "The Time Machine", authorDates: "1866–1946", linkedBookIds: ["the-time-machine", "the-war-of-the-worlds", "the-island-of-doctor-moreau"], shortBio: "Father of science fiction whose social prophecies anticipated the 20th century's dark turns.", sortOrder: 1, country: "England", continent: "Europe" },
  { id: "dy-london", timelineId: "dystopian-fiction", authorName: "Jack London", authorId: "jack-london", publicationYear: 1908, mostFamousWork: "The Iron Heel", authorDates: "1876–1916", linkedBookIds: ["the-iron-heel"], shortBio: "Socialist adventure writer whose Iron Heel predicted fascist dystopia.", sortOrder: 2, country: "USA", continent: "North America" },
  { id: "dy-huxley", timelineId: "dystopian-fiction", authorName: "Aldous Huxley", authorId: "aldous-huxley", publicationYear: 1932, mostFamousWork: "Brave New World", authorDates: "1894–1963", linkedBookIds: ["crome-yellow", "antic-hay"], shortBio: "Visionary whose Brave New World warned of a pleasure-drugged future — eerily prescient.", sortOrder: 3, country: "England", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // STREAM OF CONSCIOUSNESS (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "sc-proust", timelineId: "stream-of-consciousness", authorName: "Marcel Proust", authorId: "marcel-proust", publicationYear: 1913, mostFamousWork: "In Search of Lost Time", authorDates: "1871–1922", linkedBookIds: ["in-search-of-lost-time"], shortBio: "Pioneer of the technique — involuntary memory and the madeleine that launched a thousand pages.", sortOrder: 1, country: "France", continent: "Europe" },
  { id: "sc-joyce", timelineId: "stream-of-consciousness", authorName: "James Joyce", authorId: "james-joyce", publicationYear: 1922, mostFamousWork: "Ulysses", authorDates: "1882–1941", linkedBookIds: ["ulysses"], shortBio: "Molly Bloom's soliloquy in Ulysses is the supreme example of stream of consciousness.", sortOrder: 2, country: "Ireland", continent: "Europe" },
  { id: "sc-woolf", timelineId: "stream-of-consciousness", authorName: "Virginia Woolf", authorId: "virginia-woolf", publicationYear: 1925, mostFamousWork: "Mrs Dalloway", authorDates: "1882–1941", linkedBookIds: ["mrs-dalloway", "to-the-lighthouse"], shortBio: "Refined the technique to luminous precision — a single day in London becomes a whole world.", sortOrder: 3, country: "England", continent: "Europe" },
  { id: "sc-faulkner", timelineId: "stream-of-consciousness", authorName: "William Faulkner", authorId: "william-faulkner", publicationYear: 1929, mostFamousWork: "The Sound and the Fury", authorDates: "1897–1962", linkedBookIds: ["the-sound-and-the-fury"], shortBio: "Benjy Compson's fragmented narration in The Sound and the Fury pushed the technique to its limit.", sortOrder: 4, country: "USA", continent: "North America" },

  // ══════════════════════════════════════════════════════════════════════════
  // TRANSCENDENTALISM (genre)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "tr-whitman", timelineId: "transcendentalism", authorName: "Walt Whitman", authorId: "walt-whitman", publicationYear: 1855, mostFamousWork: "Leaves of Grass", authorDates: "1819–1892", linkedBookIds: ["leaves-of-grass"], shortBio: "Poet who embodied Transcendentalist ideals in free verse celebrating democracy and the self.", sortOrder: 1, country: "USA", continent: "North America" },
  { id: "tr-stowe", timelineId: "transcendentalism", authorName: "Harriet Beecher Stowe", authorId: "harriet-beecher-stowe", publicationYear: 1852, mostFamousWork: "Uncle Tom's Cabin", authorDates: "1811–1896", linkedBookIds: ["uncle-toms-cabin"], shortBio: "Transcendentalist-adjacent novelist whose Uncle Tom's Cabin channeled moral idealism into social reform.", sortOrder: 2, country: "USA", continent: "North America" },

  // ══════════════════════════════════════════════════════════════════════════
  // SCANDINAVIAN (via Old Norse)
  // ══════════════════════════════════════════════════════════════════════════
  { id: "sc-ibsen", timelineId: "old-norse", authorName: "Henrik Ibsen", authorId: "henrik-ibsen", publicationYear: 1879, mostFamousWork: "A Doll's House", authorDates: "1828–1906", linkedBookIds: ["a-dolls-house", "hedda-gabler", "ghosts"], shortBio: "Father of modern drama whose plays revolutionized the theater and shocked Victorian morality.", sortOrder: 2, country: "Norway", continent: "Europe" },

  // ══════════════════════════════════════════════════════════════════════════
  // EASTERN — VERIFIED AUTHORS WITH BOOKS IN CATALOG
  // ══════════════════════════════════════════════════════════════════════════

  // Classical Chinese
  { id: "cc-sun-tzu", timelineId: "classical-chinese", authorName: "Sun Tzu", authorId: "sun-tzu", publicationYear: -500, mostFamousWork: "The Art of War", authorDates: "c. 5th century BCE", linkedBookIds: ["the-art-of-war"], shortBio: "Legendary military strategist whose Art of War shaped statecraft across East Asia and beyond.", sortOrder: 1, country: "China", continent: "Asia" },
  { id: "cc-laozi", timelineId: "classical-chinese", authorName: "Laozi", authorId: "laozi", publicationYear: -400, mostFamousWork: "Tao Te Ching", authorDates: "c. 6th century BCE (traditional)", linkedBookIds: ["tao-te-ching"], shortBio: "Legendary sage of Daoism whose eighty-one verses on the Way remain the most translated Chinese text.", sortOrder: 2, country: "China", continent: "Asia" },

  // Classical Japanese
  { id: "cj-soseki", timelineId: "classical-japanese", authorName: "Natsume Sōseki", authorId: "natsume-s-seki", publicationYear: 1906, mostFamousWork: "Kusamakura", authorDates: "1867–1916", linkedBookIds: ["kusamakura"], shortBio: "Father of modern Japanese literature whose novels probe loneliness and the cost of modernity.", sortOrder: 1, country: "Japan", continent: "Asia" },

  // Persian
  { id: "pe-khayyam", timelineId: "persian", authorName: "Omar Khayyám", authorId: "omar-khayy-m", publicationYear: 1120, mostFamousWork: "Rubáiyát", authorDates: "1048–1131", linkedBookIds: ["the-rubaiyat-of-omar-khayyam"], shortBio: "Mathematician-poet whose quatrains on fate and wine became an English sensation via FitzGerald.", sortOrder: 1, country: "Iran", continent: "Asia" },

  // Classical Arabic
  { id: "ca-gibran", timelineId: "classical-arabic", authorName: "Khalil Gibran", authorId: "khalil-gibran", publicationYear: 1923, mostFamousWork: "The Prophet", authorDates: "1883–1931", linkedBookIds: ["the-prophet", "the-madman", "the-forerunner"], shortBio: "Lebanese-American poet whose The Prophet became one of the most-read books of the 20th century.", sortOrder: 1, country: "Lebanon", continent: "Asia" },

  // Bengali
  { id: "bn-tagore", timelineId: "bengali", authorName: "Rabindranath Tagore", authorId: "rabindranath-tagore", publicationYear: 1912, mostFamousWork: "Gitanjali", authorDates: "1861–1941", linkedBookIds: ["gitanjali", "my-reminiscences"], shortBio: "First non-European Nobel laureate in Literature whose poetry, songs, and novels defined modern Bengali culture.", sortOrder: 1, country: "India", continent: "Asia" },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

export function getTimelinesByRegion(): Record<string, Timeline[]> {
  const grouped: Record<string, Timeline[]> = {}
  for (const region of REGION_ORDER) {
    grouped[region] = TIMELINES.filter((t) => t.region === region).sort(
      (a, b) => a.sortOrder - b.sortOrder,
    )
  }
  return grouped
}

export function getTimelineAuthors(timelineId: string): TimelineAuthor[] {
  return TIMELINE_AUTHORS.filter((a) => a.timelineId === timelineId).sort(
    (a, b) => a.sortOrder - b.sortOrder,
  )
}

export function getTimelineById(id: string): Timeline | undefined {
  return TIMELINES.find((t) => t.id === id)
}

export function getAllTimelineAuthors(): TimelineAuthor[] {
  return TIMELINE_AUTHORS
}
