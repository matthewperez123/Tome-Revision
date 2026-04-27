export interface PaintingCard {
  slug: string
  title: string
  author: string
  painting: string
  artist: string
  cover: string | null
}

// Row 1 — Epic, Mythic, Dramatic (scrolls LEFT)
export const ROW_1: PaintingCard[] = [
  { slug: "the-odyssey", title: "The Odyssey", author: "Homer", painting: "Ulysses and the Sirens", artist: "Waterhouse, 1891", cover: "/paintings/ulysses-and-the-sirens.jpg" },
  { slug: "the-iliad", title: "The Iliad", author: "Homer", painting: "A Reading from Homer", artist: "Alma-Tadema, 1885", cover: "/paintings/reading-from-homer.jpg" },
  { slug: "the-divine-comedy", title: "The Divine Comedy", author: "Dante", painting: "The Barque of Dante", artist: "Delacroix, 1822", cover: "/paintings/barque-of-dante.jpg" },
  { slug: "the-aeneid", title: "The Aeneid", author: "Virgil", painting: "Aeneas Presenting Cupid to Dido", artist: "Tiepolo, c.1757", cover: "/paintings/aeneid-tiepolo.jpg" },
  { slug: "paradise-lost", title: "Paradise Lost", author: "John Milton", painting: "Pandemonium", artist: "Martin, 1841", cover: "/paintings/pandemonium.jpg" },
  { slug: "beowulf", title: "Beowulf", author: "Anonymous", painting: "The Nightmare", artist: "Fuseli, 1781", cover: "/paintings/the-nightmare.jpg" },
  { slug: "the-metamorphoses", title: "The Metamorphoses", author: "Ovid", painting: "Bacchus and Ariadne", artist: "Titian, 1523", cover: "/paintings/bacchus-and-ariadne.jpg" },
  { slug: "hamlet", title: "Hamlet", author: "Shakespeare", painting: "Ophelia", artist: "Millais, 1852", cover: "/paintings/ophelia.jpg" },
  { slug: "macbeth", title: "Macbeth", author: "Shakespeare", painting: "Macbeth", artist: "Martin, 1820", cover: "/paintings/macbeth-john-martin.jpg" },
  { slug: "romeo-and-juliet", title: "Romeo and Juliet", author: "Shakespeare", painting: "Romeo and Juliet", artist: "Dicksee, 1884", cover: "/paintings/romeo-and-juliet-dicksee.jpg" },
  { slug: "oedipus-rex", title: "Oedipus Rex", author: "Sophocles", painting: "Echo and Narcissus", artist: "Waterhouse, 1903", cover: "/paintings/echo-and-narcissus.jpg" },
  { slug: "the-republic", title: "The Republic", author: "Plato", painting: "The Death of Socrates", artist: "David, 1787", cover: "/paintings/death-of-socrates.jpg" },
  { slug: "the-art-of-war", title: "The Art of War", author: "Sun Tzu", painting: "The Great Wave off Kanagawa", artist: "Hokusai, c.1831", cover: "/paintings/great-wave.jpg" },
  { slug: "don-quixote", title: "Don Quixote", author: "Cervantes", painting: "Don Quixote and Sancho Panza", artist: "Dor\u00e9, 1863", cover: "/paintings/don-quixote-dore.jpg" },
  { slug: "the-epic-of-gilgamesh", title: "The Epic of Gilgamesh", author: "Anonymous", painting: "The Great Day of His Wrath", artist: "Martin, 1851", cover: "/paintings/destruction-course-of-empire.jpg" },
  { slug: "prometheus-bound", title: "Prometheus Bound", author: "Aeschylus", painting: "The Raft of the Medusa", artist: "G\u00e9ricault, 1819", cover: "/paintings/raft-of-the-medusa.jpg" },
  { slug: "the-rime-of-the-ancient-mariner", title: "The Rime of the Ancient Mariner", author: "Coleridge", painting: "The Slave Ship", artist: "Turner, 1840", cover: "/paintings/slave-ship.jpg" },
  { slug: "moby-dick", title: "Moby-Dick", author: "Herman Melville", painting: "The Ninth Wave", artist: "Aivazovsky, 1850", cover: "/paintings/ninth-wave.jpg" },
  { slug: "frankenstein", title: "Frankenstein", author: "Mary Shelley", painting: "Wanderer Above the Sea of Fog", artist: "Friedrich, c.1818", cover: "/paintings/wanderer-above-sea-of-fog.jpg" },
  { slug: "les-miserables", title: "Les Mis\u00e9rables", author: "Victor Hugo", painting: "Liberty Leading the People", artist: "Delacroix, 1830", cover: "/paintings/liberty-leading-the-people.jpg" },
  { slug: "the-gallic-wars", title: "Commentaries on the Gallic War", author: "Julius Caesar", painting: "Vercingetorix Before Caesar", artist: "Royer, 1899", cover: "/paintings/gallic-wars-vercingetorix.jpg" },
]

// Row 2 — Intimate, Psychological, Modern (scrolls RIGHT)
export const ROW_2: PaintingCard[] = [
  { slug: "pride-and-prejudice", title: "Pride and Prejudice", author: "Jane Austen", painting: "Madame X", artist: "Sargent, 1884", cover: "/paintings/madame-x.jpg" },
  { slug: "jane-eyre", title: "Jane Eyre", author: "Charlotte Bront\u00eb", painting: "Abbey in the Oakwood", artist: "Friedrich, 1810", cover: "/paintings/abbey-in-oakwood.jpg" },
  { slug: "wuthering-heights", title: "Wuthering Heights", author: "Emily Bront\u00eb", painting: "The Monk by the Sea", artist: "Friedrich, 1810", cover: "/paintings/monk-by-the-sea.jpg" },
  { slug: "crime-and-punishment", title: "Crime and Punishment", author: "Dostoevsky", painting: "Portrait of Dostoevsky", artist: "Perov, 1872", cover: "/paintings/portrait-of-dostoevsky.jpg" },
  { slug: "anna-karenina", title: "Anna Karenina", author: "Leo Tolstoy", painting: "Lady of Shalott", artist: "Waterhouse, 1888", cover: "/paintings/lady-of-shalott.jpg" },
  { slug: "war-and-peace", title: "War and Peace", author: "Leo Tolstoy", painting: "Napoleon's Retreat from Moscow", artist: "Vereshchagin, 1897", cover: "/paintings/napoleons-retreat.jpg" },
  { slug: "the-brothers-karamazov", title: "The Brothers Karamazov", author: "Dostoevsky", painting: "Return of the Prodigal Son", artist: "Rembrandt, c.1669", cover: "/paintings/return-of-prodigal-son.jpg" },
  { slug: "the-count-of-monte-cristo", title: "The Count of Monte Cristo", author: "Alexandre Dumas", painting: "Isle of the Dead", artist: "B\u00f6cklin, 1880", cover: "/paintings/isle-of-the-dead.jpg" },
  { slug: "madame-bovary", title: "Madame Bovary", author: "Gustave Flaubert", painting: "Birth of Venus", artist: "Botticelli, c.1485", cover: "/paintings/birth-of-venus.jpg" },
  { slug: "great-expectations", title: "Great Expectations", author: "Charles Dickens", painting: "Rain, Steam and Speed", artist: "Turner, 1844", cover: "/paintings/rain-steam-speed.jpg" },
  { slug: "a-tale-of-two-cities", title: "A Tale of Two Cities", author: "Charles Dickens", painting: "Napoleon Crossing the Alps", artist: "David, 1801", cover: "/paintings/napoleon-crossing-the-alps.jpg" },
  { slug: "the-picture-of-dorian-gray", title: "The Picture of Dorian Gray", author: "Oscar Wilde", painting: "The Ambassadors", artist: "Holbein, 1533", cover: "/paintings/ambassadors.jpg" },
  { slug: "meditations", title: "Meditations", author: "Marcus Aurelius", painting: "The Philosopher in Meditation", artist: "Rembrandt, 1632", cover: "/paintings/philosopher-in-meditation.jpg" },
  { slug: "walden", title: "Walden", author: "Thoreau", painting: "The Oxbow", artist: "Cole, 1836", cover: "/paintings/the-oxbow.jpg" },
  { slug: "the-scarlet-letter", title: "The Scarlet Letter", author: "Nathaniel Hawthorne", painting: "Oath of the Horatii", artist: "David, 1784", cover: "/paintings/oath-of-the-horatii.jpg" },
  { slug: "the-great-gatsby", title: "The Great Gatsby", author: "F. Scott Fitzgerald", painting: "Nocturne in Blue and Gold", artist: "Whistler, c.1872", cover: "/paintings/nocturne-blue-gold.jpg" },
  { slug: "heart-of-darkness", title: "Heart of Darkness", author: "Joseph Conrad", painting: "The Fighting Temeraire", artist: "Turner, 1839", cover: "/paintings/fighting-temeraire.jpg" },
  { slug: "dracula", title: "Dracula", author: "Bram Stoker", painting: "The Sea of Ice", artist: "Friedrich, 1824", cover: "/paintings/sea-of-ice.jpg" },
  { slug: "the-scarlet-pimpernel", title: "The Scarlet Pimpernel", author: "Baroness Orczy", painting: "Madame X", artist: "Sargent, 1884", cover: "/paintings/madame-x.jpg" },
  { slug: "the-school-of-athens", title: "Nicomachean Ethics", author: "Aristotle", painting: "The School of Athens", artist: "Raphael, 1511", cover: "/paintings/school-of-athens.jpg" },
  { slug: "heart-of-the-andes", title: "Leaves of Grass", author: "Walt Whitman", painting: "Heart of the Andes", artist: "Church, 1859", cover: "/paintings/heart-of-the-andes.jpg" },
]
