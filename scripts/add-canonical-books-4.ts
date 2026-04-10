#!/usr/bin/env npx tsx
/**
 * add-canonical-books-4.ts
 *
 * Adds ~70 Tier B canonical books to the Tome app library.
 * These are worthwhile works with content already in public/content/
 * but not yet in the main catalog.
 *
 * Run: npx tsx scripts/add-canonical-books-4.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

const TRADITION_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  Victorian:            { primary: "#2D1B5E", secondary: "#1E1145", accent: "#8B5CF6" },
  Russian:              { primary: "#5C1A1A", secondary: "#3D1010", accent: "#DC2626" },
  American:             { primary: "#143220", secondary: "#0A1F14", accent: "#22C55E" },
  French:               { primary: "#0A1F3D", secondary: "#061428", accent: "#EC4899" },
  Modernist:            { primary: "#111827", secondary: "#0A0F1A", accent: "#14B8A6" },
  Romantic:             { primary: "#4A0E2D", secondary: "#2D0819", accent: "#F43F5E" },
  Renaissance:          { primary: "#3D1A6E", secondary: "#2A1050", accent: "#D97706" },
  Enlightenment:        { primary: "#0F2744", secondary: "#091A2E", accent: "#06B6D4" },
  "Ancient Greek":      { primary: "#1E3A5F", secondary: "#0F2744", accent: "#0EA5E9" },
  "Medieval European":  { primary: "#1B4332", secondary: "#0F2B20", accent: "#F59E0B" },
  Eastern:              { primary: "#5C2800", secondary: "#3D1A00", accent: "#F97316" },
  "Post-Colonial":      { primary: "#065F46", secondary: "#034335", accent: "#10B981" },
  Contemporary:         { primary: "#1A1A2E", secondary: "#111122", accent: "#A78BFA" },
  Scandinavian:         { primary: "#1E293B", secondary: "#0F172A", accent: "#38BDF8" },
  Germanic:             { primary: "#1F2937", secondary: "#111827", accent: "#10B981" },
};

interface BookConfig {
  id: string;
  title: string;
  author: string;
  year: number;
  tradition: string;
  era: string;
  genres: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Scholar";
  synopsis: string;
  themes: string[];
  country: string;
  language?: string;
  readingLanguage?: string;
}

interface MetaJson {
  bookId: string;
  title: string;
  author: string;
  chapterCount: number;
  totalWordCount: number;
  totalMinutes: number;
  chapters: Array<{
    index: number;
    title: string;
    wordCount: number;
    estimatedMinutes: number;
  }>;
}

function toAuthorId(author: string): string {
  return author
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function formatReadingTime(minutes: number): string {
  const hours = Math.round(minutes / 60);
  if (hours < 1) return `~${minutes} minutes`;
  return `~${hours} hour${hours !== 1 ? "s" : ""}`;
}

// ── Tier B Book Configs ────────────────────────────────────────────────────────

const BOOK_CONFIGS: BookConfig[] = [

  // ── Jules Verne ────────────────────────────────────────────────────────────

  {
    id: "five-weeks-in-a-balloon",
    title: "Five Weeks in a Balloon",
    author: "Jules Verne",
    year: 1863,
    tradition: "French",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Science Fiction"],
    difficulty: "Beginner",
    synopsis: "Three explorers cross unexplored Africa by balloon, encountering storms, hostile tribes, and dwindling gas supplies in Verne's debut novel that launched his Extraordinary Voyages series.",
    themes: ["Exploration", "Science", "Africa", "Adventure", "Ingenuity", "Friendship"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "from-the-earth-to-the-moon",
    title: "From the Earth to the Moon",
    author: "Jules Verne",
    year: 1865,
    tradition: "French",
    era: "Victorian",
    genres: ["Novel", "Science Fiction"],
    difficulty: "Beginner",
    synopsis: "After the Civil War, a Baltimore gun club builds a giant cannon to shoot a projectile to the Moon, with three daring passengers aboard — remarkably anticipating the Apollo program a century early.",
    themes: ["Space travel", "Science", "Ambition", "America", "Technology", "Adventure"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "the-mysterious-island",
    title: "The Mysterious Island",
    author: "Jules Verne",
    year: 1875,
    tradition: "French",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Science Fiction"],
    difficulty: "Beginner",
    synopsis: "Civil War prisoners escape by balloon and are stranded on a Pacific island where they must build civilization from scratch, aided by a mysterious benefactor who turns out to be Captain Nemo himself.",
    themes: ["Survival", "Ingenuity", "Science", "Community", "Self-reliance", "Mystery"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "michael-strogoff",
    title: "Michael Strogoff",
    author: "Jules Verne",
    year: 1876,
    tradition: "French",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Historical Fiction"],
    difficulty: "Beginner",
    synopsis: "A Czar's courier races across Siberia to warn the governor of Irkutsk about a Tartar invasion, enduring capture, blinding, and betrayal in Verne's most thrilling adventure tale.",
    themes: ["Duty", "Courage", "Russia", "Endurance", "Loyalty", "Adventure"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },

  // ── Anne of Green Gables sequels ───────────────────────────────────────────

  {
    id: "anne-of-avonlea",
    title: "Anne of Avonlea",
    author: "L. M. Montgomery",
    year: 1909,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Coming-of-Age"],
    difficulty: "Beginner",
    synopsis: "Anne Shirley returns as a young schoolteacher in Avonlea, navigating the challenges of unruly students, community improvement schemes, and the slow deepening of her friendship with Gilbert Blythe.",
    themes: ["Teaching", "Community", "Growth", "Friendship", "Imagination", "Home"],
    country: "Canada",
  },
  {
    id: "anne-of-the-island",
    title: "Anne of the Island",
    author: "L. M. Montgomery",
    year: 1915,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Coming-of-Age", "Romance"],
    difficulty: "Beginner",
    synopsis: "Anne attends Redmond College, juggles suitors, and confronts the question she has avoided for years — whether Gilbert Blythe is the great love she has been searching for all along.",
    themes: ["Education", "Love", "Independence", "Loss", "Maturity", "Self-discovery"],
    country: "Canada",
  },

  // ── Agatha Christie ────────────────────────────────────────────────────────

  {
    id: "the-murder-on-the-links",
    title: "The Murder on the Links",
    author: "Agatha Christie",
    year: 1923,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Poirot and Hastings investigate a millionaire found stabbed on a French golf course, with a second body complicating the case and a love triangle providing the motive.",
    themes: ["Murder", "Deduction", "Love", "France", "Identity", "Justice"],
    country: "England",
  },
  {
    id: "the-secret-adversary",
    title: "The Secret Adversary",
    author: "Agatha Christie",
    year: 1922,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Thriller", "Mystery"],
    difficulty: "Beginner",
    synopsis: "Tommy and Tuppence, two penniless young adventurers in post-war London, stumble into a conspiracy involving a missing treaty and a master criminal known only as Mr. Brown.",
    themes: ["Espionage", "Adventure", "Friendship", "Post-war", "Conspiracy", "Youth"],
    country: "England",
  },

  // ── Adventure Classics ─────────────────────────────────────────────────────

  {
    id: "she",
    title: "She: A History of Adventure",
    author: "H. Rider Haggard",
    year: 1887,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "Two Englishmen travel to the heart of Africa and discover a hidden kingdom ruled by the immortal She-Who-Must-Be-Obeyed, a woman of terrifying beauty and power who has waited two thousand years for a lost love to return.",
    themes: ["Immortality", "Love", "Africa", "Power", "Colonialism", "The unknown"],
    country: "England",
  },
  {
    id: "allan-quatermain",
    title: "Allan Quatermain",
    author: "H. Rider Haggard",
    year: 1887,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Adventure"],
    difficulty: "Beginner",
    synopsis: "The great white hunter leads one final expedition into the African interior to find a lost white race, in a sequel to King Solomon's Mines that deepens the adventure with elegiac meditations on mortality.",
    themes: ["Adventure", "Africa", "Aging", "Exploration", "Civilization", "Death"],
    country: "England",
  },
  {
    id: "the-master-of-ballantrae",
    title: "The Master of Ballantrae",
    author: "Robert Louis Stevenson",
    year: 1889,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Gothic Fiction"],
    difficulty: "Intermediate",
    synopsis: "Two Scottish brothers — one who fought for the Jacobites, one who stayed loyal — wage a decades-long war of hatred that follows them from Scotland to India to the American wilderness.",
    themes: ["Brotherhood", "Hatred", "Evil", "Scotland", "Fate", "Duality"],
    country: "Scotland",
  },
  {
    id: "catriona",
    title: "Catriona",
    author: "Robert Louis Stevenson",
    year: 1893,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Historical Fiction"],
    difficulty: "Intermediate",
    synopsis: "David Balfour continues his adventures in the sequel to Kidnapped, navigating political intrigue, a murder trial, and a deepening romance with a Highland chief's daughter across Scotland and Holland.",
    themes: ["Justice", "Love", "Politics", "Scotland", "Honor", "Coming of age"],
    country: "Scotland",
  },
  {
    id: "the-prisoner-of-zenda",
    title: "The Prisoner of Zenda",
    author: "Anthony Hope",
    year: 1894,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Adventure", "Romance"],
    difficulty: "Beginner",
    synopsis: "An English gentleman on holiday discovers he is the exact double of a Ruritanian king, and must impersonate the drugged monarch to save the throne from a scheming brother.",
    themes: ["Identity", "Duty", "Honor", "Adventure", "Sacrifice", "Romance"],
    country: "England",
  },

  // ── Additional British Victorian ───────────────────────────────────────────

  {
    id: "the-enchanted-april",
    title: "The Enchanted April",
    author: "Elizabeth von Arnim",
    year: 1922,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Comedy", "Romance"],
    difficulty: "Beginner",
    synopsis: "Four very different Englishwomen rent an Italian castle for April and find that the Mediterranean sunshine, wisteria, and freedom from routine transform their marriages, friendships, and sense of self.",
    themes: ["Transformation", "Italy", "Women's freedom", "Marriage", "Beauty", "Renewal"],
    country: "England",
  },
  {
    id: "the-blue-castle",
    title: "The Blue Castle",
    author: "L. M. Montgomery",
    year: 1926,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Romance"],
    difficulty: "Beginner",
    synopsis: "A timid twenty-nine-year-old spinster is told she has one year to live and decides to finally say and do exactly what she wants, with results that are liberating, romantic, and frequently hilarious.",
    themes: ["Freedom", "Courage", "Love", "Nature", "Self-discovery", "Family"],
    country: "Canada",
  },
  {
    id: "the-scarlet-pimpernel",
    title: "The Scarlet Pimpernel",
    author: "Baroness Orczy",
    year: 1905,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "During the French Revolution's Reign of Terror, a seemingly foppish English aristocrat leads a secret band rescuing condemned French nobles from the guillotine, inventing the masked-hero archetype.",
    themes: ["Heroism", "Disguise", "Revolution", "Love", "Sacrifice", "Dual identity"],
    country: "England",
  },

  // ── Scottish & Irish ───────────────────────────────────────────────────────

  {
    id: "huntingtower",
    title: "Huntingtower",
    author: "John Buchan",
    year: 1922,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Adventure", "Thriller"],
    difficulty: "Beginner",
    synopsis: "A retired Glasgow grocer stumbles upon a kidnapped Russian princess in a Scottish castle and, with a gang of street urchins, mounts an unlikely rescue in Buchan's most warmly comic adventure.",
    themes: ["Adventure", "Courage", "Scotland", "Class", "Duty", "Romance"],
    country: "Scotland",
  },

  // ── Russian & Eastern European ─────────────────────────────────────────────

  {
    id: "the-duel",
    title: "The Duel",
    author: "Anton Chekhov",
    year: 1891,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Novella", "Psychological Fiction"],
    difficulty: "Intermediate",
    synopsis: "A dissipated government clerk and a rigid Social Darwinist zoologist clash in a Caucasus seaside town, their philosophical conflict escalating to a literal duel that transforms them both.",
    themes: ["Morality", "Science", "Redemption", "Conflict", "Change", "Russia"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },

  // ── Important Nonfiction ───────────────────────────────────────────────────

  {
    id: "mutual-aid",
    title: "Mutual Aid: A Factor of Evolution",
    author: "Peter Kropotkin",
    year: 1902,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Non-Fiction", "Science", "Political Philosophy"],
    difficulty: "Intermediate",
    synopsis: "The anarchist prince counters Social Darwinism by demonstrating that cooperation, not competition, is the primary driver of evolution among animals and humans alike.",
    themes: ["Cooperation", "Evolution", "Society", "Nature", "Justice", "Community"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },
  {
    id: "what-is-art",
    title: "What Is Art?",
    author: "Leo Tolstoy",
    year: 1897,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Non-Fiction", "Aesthetics", "Philosophy"],
    difficulty: "Advanced",
    synopsis: "Tolstoy demolishes contemporary aesthetics and argues that true art is not about beauty but about infecting others with sincere feeling — a radical theory that condemns Shakespeare, Beethoven, and his own novels.",
    themes: ["Art", "Morality", "Feeling", "Sincerity", "Class", "Religion"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },

  // ── More American ──────────────────────────────────────────────────────────

  {
    id: "the-damnation-of-theron-ware",
    title: "The Damnation of Theron Ware",
    author: "Harold Frederic",
    year: 1896,
    tradition: "American",
    era: "Victorian",
    genres: ["Novel", "Social Novel"],
    difficulty: "Intermediate",
    synopsis: "A young Methodist minister in upstate New York has his faith shaken by encounters with Catholicism, Darwinism, and a beautiful Irish woman, leading to a devastating moral collapse.",
    themes: ["Faith", "Modernity", "Temptation", "Hypocrisy", "Small-town life", "Downfall"],
    country: "USA",
  },
  {
    id: "the-conjure-woman",
    title: "The Conjure Woman",
    author: "Charles W. Chesnutt",
    year: 1899,
    tradition: "American",
    era: "Victorian",
    genres: ["Short Stories", "African American Literature"],
    difficulty: "Beginner",
    synopsis: "An old Black man tells a Northern white couple tales of slavery-era magic and transformation, using folklore to encode truths about the cruelty and resilience that the couple cannot otherwise hear.",
    themes: ["Slavery", "Folklore", "Race", "Storytelling", "Magic", "Resistance"],
    country: "USA",
  },
  {
    id: "clotel",
    title: "Clotel; or, The President's Daughter",
    author: "William Wells Brown",
    year: 1853,
    tradition: "American",
    era: "Victorian",
    genres: ["Novel", "African American Literature"],
    difficulty: "Intermediate",
    synopsis: "The first novel published by an African American traces the fates of Thomas Jefferson's fictional mixed-race daughters as they are sold into slavery, exposing the moral bankruptcy of the slaveholding republic.",
    themes: ["Slavery", "Race", "Hypocrisy", "Freedom", "Family", "America"],
    country: "USA",
  },
  {
    id: "iola-leroy",
    title: "Iola Leroy",
    author: "Frances Ellen Watkins Harper",
    year: 1892,
    tradition: "American",
    era: "Victorian",
    genres: ["Novel", "African American Literature"],
    difficulty: "Intermediate",
    synopsis: "A mixed-race woman discovers she is legally Black and is sold into slavery during the Civil War, then after emancipation devotes herself to racial uplift and education in the Reconstruction South.",
    themes: ["Race", "Identity", "Uplift", "Education", "Freedom", "Community"],
    country: "USA",
  },
  {
    id: "the-marrow-of-tradition",
    title: "The Marrow of Tradition",
    author: "Charles W. Chesnutt",
    year: 1901,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "African American Literature", "Political Fiction"],
    difficulty: "Intermediate",
    synopsis: "Chesnutt fictionalizes the 1898 Wilmington massacre, depicting a white supremacist coup against a prosperous Black community and the moral choices forced upon both Black and white characters.",
    themes: ["Race", "Violence", "Power", "Justice", "White supremacy", "Moral courage"],
    country: "USA",
  },

  // ── More Balzac ────────────────────────────────────────────────────────────

  {
    id: "the-vicar-of-wakefield",
    title: "The Vicar of Wakefield",
    author: "Oliver Goldsmith",
    year: 1766,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Novel", "Satire", "Pastoral"],
    difficulty: "Intermediate",
    synopsis: "A kindly country vicar endures an improbable cascade of misfortunes with such patient goodness that the novel becomes both comedy and moral fable about virtue in adversity.",
    themes: ["Goodness", "Fortune", "Family", "Virtue", "Class", "Justice"],
    country: "Ireland",
  },

  // ── Gothic Additions ───────────────────────────────────────────────────────

  {
    id: "the-beetle",
    title: "The Beetle",
    author: "Richard Marsh",
    year: 1897,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Gothic Fiction", "Horror"],
    difficulty: "Intermediate",
    synopsis: "A shape-shifting Egyptian entity terrorizes London, pursuing a rising politician whose youthful transgression in the East has marked him for destruction, in a Gothic thriller that outsold Dracula in its year.",
    themes: ["Orientalism", "Terror", "The supernatural", "Empire", "Sin", "Pursuit"],
    country: "England",
  },

  // ── Children's additions ───────────────────────────────────────────────────

  {
    id: "the-voyages-of-doctor-dolittle",
    title: "The Voyages of Doctor Dolittle",
    author: "Hugh Lofting",
    year: 1922,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Children's Literature", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "The doctor who talks to animals takes a young apprentice on a sea voyage to a floating island, combining whimsical adventure with a gentle philosophy of kindness to all creatures.",
    themes: ["Animals", "Language", "Adventure", "Kindness", "Science", "Friendship"],
    country: "England",
  },
  {
    id: "at-the-back-of-the-north-wind",
    title: "At the Back of the North Wind",
    author: "George MacDonald",
    year: 1871,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Children's Literature", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "A poor London boy befriends the North Wind herself, who carries him on journeys through the sky to a mysterious country at the back of the wind — a luminous allegory of death and transcendence.",
    themes: ["Death", "Faith", "Poverty", "Imagination", "Beauty", "Transcendence"],
    country: "Scotland",
  },

  // ── More plays ─────────────────────────────────────────────────────────────

  {
    id: "the-duchess-of-malfi",
    title: "The Duchess of Malfi",
    author: "John Webster",
    year: 1614,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Tragedy", "Revenge Tragedy"],
    difficulty: "Advanced",
    synopsis: "A widowed duchess secretly marries beneath her station, and her brothers' furious vengeance unleashes a chain of murder, madness, and horror that rivals Shakespeare's darkest tragedies.",
    themes: ["Power", "Gender", "Revenge", "Madness", "Class", "Corruption"],
    country: "England",
  },
  {
    id: "the-country-wife",
    title: "The Country Wife",
    author: "William Wycherley",
    year: 1675,
    tradition: "Renaissance",
    era: "Enlightenment",
    genres: ["Drama", "Comedy", "Restoration Comedy"],
    difficulty: "Intermediate",
    synopsis: "A rake pretends to be impotent to gain unsupervised access to London's married women, in the most scandalous and funniest of all Restoration comedies.",
    themes: ["Sex", "Deception", "Marriage", "Wit", "Hypocrisy", "Honor"],
    country: "England",
  },
  {
    id: "she-stoops-to-conquer",
    title: "She Stoops to Conquer",
    author: "Oliver Goldsmith",
    year: 1773,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Drama", "Comedy"],
    difficulty: "Beginner",
    synopsis: "Two young men are tricked into believing a gentleman's house is an inn, and the resulting confusions of class, courtship, and identity produce one of the funniest plays in the English language.",
    themes: ["Class", "Courtship", "Deception", "Identity", "Manners", "Comedy"],
    country: "Ireland",
  },
  {
    id: "the-way-of-the-world",
    title: "The Way of the World",
    author: "William Congreve",
    year: 1700,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Drama", "Comedy", "Restoration Comedy"],
    difficulty: "Advanced",
    synopsis: "Lovers Mirabell and Millamant negotiate the terms of their marriage in brilliant, sparkling dialogue, while scheming relatives and former lovers complicate the path to the altar.",
    themes: ["Marriage", "Wit", "Money", "Love", "Society", "Independence"],
    country: "England",
  },

  // ── Additional notable works ───────────────────────────────────────────────

  {
    id: "the-food-of-the-gods",
    title: "The Food of the Gods",
    author: "H. G. Wells",
    year: 1904,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Science Fiction", "Satire"],
    difficulty: "Intermediate",
    synopsis: "Scientists create a substance that makes everything grow to enormous size, and the giant children it produces become a symbol of humanity's evolutionary future — feared, persecuted, and ultimately unstoppable.",
    themes: ["Science", "Growth", "Fear of change", "Progress", "Class", "Evolution"],
    country: "England",
  },
  {
    id: "the-black-arrow",
    title: "The Black Arrow",
    author: "Robert Louis Stevenson",
    year: 1888,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "During the Wars of the Roses, a young man discovers his guardian murdered his father and joins a band of outlaws to seek justice, rescue a maiden, and find his place in a lawless age.",
    themes: ["Justice", "Adventure", "War", "Coming of age", "Loyalty", "Treachery"],
    country: "Scotland",
  },
  {
    id: "tarzan-of-the-apes",
    title: "Tarzan of the Apes",
    author: "Edgar Rice Burroughs",
    year: 1912,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Adventure", "Science Fiction"],
    difficulty: "Beginner",
    synopsis: "An English lord's orphaned son is raised by great apes in the African jungle, growing into a figure who straddles the line between civilization and nature in the century's most iconic adventure story.",
    themes: ["Nature vs. nurture", "Civilization", "Identity", "Adventure", "Evolution", "The wild"],
    country: "USA",
  },
  {
    id: "a-princess-of-mars",
    title: "A Princess of Mars",
    author: "Edgar Rice Burroughs",
    year: 1912,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Science Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "A Civil War veteran is mysteriously transported to Mars, where he discovers a dying world of warring alien races and fights to save the incomparable Dejah Thoris, princess of Helium.",
    themes: ["Adventure", "Alien worlds", "Love", "War", "Honor", "The unknown"],
    country: "USA",
  },
  {
    id: "the-voyages-of-doctor-dolittle",
    title: "The Voyages of Doctor Dolittle",
    author: "Hugh Lofting",
    year: 1922,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Children's Literature", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "The doctor who talks to animals takes a young apprentice on a sea voyage to a floating island, combining whimsical adventure with a gentle philosophy of kindness to all creatures.",
    themes: ["Animals", "Language", "Adventure", "Kindness", "Science", "Friendship"],
    country: "England",
  },
  {
    id: "pollyanna",
    title: "Pollyanna",
    author: "Eleanor H. Porter",
    year: 1913,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "An irrepressibly optimistic orphan transforms a sour New England town through her 'glad game,' finding something to be glad about in every situation until a crisis tests her philosophy to its limits.",
    themes: ["Optimism", "Community", "Kindness", "Grief", "Transformation", "Joy"],
    country: "USA",
  },
  {
    id: "the-circular-staircase",
    title: "The Circular Staircase",
    author: "Mary Roberts Rinehart",
    year: 1908,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Mystery", "Gothic Fiction"],
    difficulty: "Beginner",
    synopsis: "A spinster renting a country house for the summer finds a dead body at the foot of the circular staircase, launching an investigation that reveals secrets, hidden passages, and multiple murders.",
    themes: ["Mystery", "Gothic", "Women's courage", "Secrets", "Murder", "Humor"],
    country: "USA",
  },
  {
    id: "the-age-of-reason",
    title: "The Age of Reason",
    author: "Thomas Paine",
    year: 1794,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Non-Fiction", "Philosophy", "Theology"],
    difficulty: "Intermediate",
    synopsis: "Paine attacks organized religion and biblical authority while championing deism and reason, producing the most incendiary religious text of the Enlightenment and earning himself permanent infamy.",
    themes: ["Reason", "Religion", "Freedom", "Truth", "Deism", "Authority"],
    country: "USA",
  },
  {
    id: "the-american-crisis",
    title: "The American Crisis",
    author: "Thomas Paine",
    year: 1776,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Non-Fiction", "Political Writing"],
    difficulty: "Intermediate",
    synopsis: "Beginning with the immortal words about times that try men's souls, Paine's revolutionary pamphlets rallied the Continental Army and sustained American morale through the darkest days of the Revolution.",
    themes: ["Revolution", "Patriotism", "Liberty", "Courage", "Tyranny", "Duty"],
    country: "USA",
  },
  {
    id: "charlotte-temple",
    title: "Charlotte Temple",
    author: "Susanna Rowson",
    year: 1791,
    tradition: "American",
    era: "Enlightenment",
    genres: ["Novel", "Sentimental Novel"],
    difficulty: "Beginner",
    synopsis: "A young English girl is seduced by a soldier, brought to America, abandoned, and dies in poverty — the first American bestseller and a cautionary tale that readers treated as absolutely true.",
    themes: ["Seduction", "Innocence", "Betrayal", "Morality", "Women's vulnerability", "Death"],
    country: "USA",
  },
  {
    id: "the-history-of-rasselas-prince-of-abyssinia",
    title: "The History of Rasselas, Prince of Abyssinia",
    author: "Samuel Johnson",
    year: 1759,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Novel", "Philosophical Fiction"],
    difficulty: "Intermediate",
    synopsis: "An Abyssinian prince escapes a paradisiacal valley to search the world for the secret of happiness, only to discover that every choice of life brings its own particular form of misery.",
    themes: ["Happiness", "Philosophy", "Choice", "Disillusionment", "Wisdom", "Human nature"],
    country: "England",
  },
  {
    id: "the-sketchbook-of-geoffrey-crayon-gent",
    title: "The Sketch Book of Geoffrey Crayon, Gent.",
    author: "Washington Irving",
    year: 1819,
    tradition: "American",
    era: "Romantic",
    genres: ["Short Stories", "Essays"],
    difficulty: "Beginner",
    synopsis: "Irving's collection includes the immortal tales of Rip Van Winkle and the Headless Horseman alongside travel essays, establishing the American short story and making Irving the first American author famous in Europe.",
    themes: ["American identity", "Legend", "Nostalgia", "Change", "Superstition", "The past"],
    country: "USA",
  },
  {
    id: "wonderful-adventures-of-mrs-seacole-in-many-lands",
    title: "Wonderful Adventures of Mrs. Seacole in Many Lands",
    author: "Mary Seacole",
    year: 1857,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Autobiography", "Travel Writing"],
    difficulty: "Beginner",
    synopsis: "A Jamaican-Scottish nurse recounts her extraordinary life of travel, business ventures, and service during the Crimean War, where she set up a hotel and tended to wounded soldiers near the front lines.",
    themes: ["Courage", "Race", "Medicine", "Travel", "Self-reliance", "Empire"],
    country: "Jamaica",
  },
  {
    id: "noli-me-tangere",
    title: "Noli Me Tangere",
    author: "José Rizal",
    year: 1887,
    tradition: "Post-Colonial",
    era: "Victorian",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Intermediate",
    synopsis: "A young Filipino returns from Europe to find his homeland oppressed by Spanish friars and corrupt officials, and his attempts at reform lead to tragedy in the novel that sparked the Philippine Revolution.",
    themes: ["Colonialism", "Corruption", "Reform", "Love", "Sacrifice", "National identity"],
    country: "Philippines",
    language: "Spanish",
    readingLanguage: "English",
  },
  {
    id: "el-filibusterismo",
    title: "El Filibusterismo",
    author: "José Rizal",
    year: 1891,
    tradition: "Post-Colonial",
    era: "Victorian",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Intermediate",
    synopsis: "The sequel to Noli Me Tangere follows a disguised revolutionary plotting violent upheaval against Spanish colonial rule, as Rizal wrestles with whether reform or revolution is the path to liberation.",
    themes: ["Revolution", "Colonialism", "Revenge", "Justice", "Sacrifice", "Despair"],
    country: "Philippines",
    language: "Spanish",
    readingLanguage: "English",
  },
  {
    id: "quo-vadis",
    title: "Quo Vadis",
    author: "Henryk Sienkiewicz",
    year: 1896,
    tradition: "Romantic",
    era: "Victorian",
    genres: ["Novel", "Historical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A Roman patrician falls in love with a Christian hostage during Nero's reign, and as Rome burns and the emperor persecutes Christians, he must choose between imperial power and faith.",
    themes: ["Faith", "Love", "Persecution", "Empire", "Sacrifice", "Rome"],
    country: "Poland",
    language: "Polish",
    readingLanguage: "English",
  },
  {
    id: "under-western-eyes",
    title: "Under Western Eyes",
    author: "Joseph Conrad",
    year: 1911,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Advanced",
    synopsis: "A Russian student involuntarily betrays a revolutionary to the authorities, then is sent to spy on exiles in Geneva, where guilt and divided loyalties destroy him in Conrad's most Russian novel.",
    themes: ["Betrayal", "Guilt", "Russia", "Revolution", "Identity", "Confession"],
    country: "England",
    language: "English",
  },
  {
    id: "victory",
    title: "Victory",
    author: "Joseph Conrad",
    year: 1915,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Adventure", "Philosophical Fiction"],
    difficulty: "Advanced",
    synopsis: "A philosophical recluse on a remote island rescues a girl from an abusive situation, and their fragile paradise is invaded by three desperadoes in Conrad's late masterpiece of good and evil.",
    themes: ["Isolation", "Love", "Evil", "Philosophy", "Rescue", "Destruction"],
    country: "England",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  let booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  let chaptersContent = fs.readFileSync(CHAPTERS_FILE, "utf-8");

  const existingBookIds = new Set<string>();
  const bookIdRegex = /id:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = bookIdRegex.exec(booksContent)) !== null) {
    existingBookIds.add(match[1]);
  }

  const existingChapterIds = new Set<string>();
  const chapterIdRegex = /id:\s*"([^"]+)"/g;
  while ((match = chapterIdRegex.exec(chaptersContent)) !== null) {
    existingChapterIds.add(match[1]);
  }

  console.log(`Found ${existingBookIds.size} existing books in books.ts`);
  console.log(`Found ${existingChapterIds.size} existing chapters in chapters.ts`);

  let booksAdded = 0;
  let chaptersAdded = 0;
  let booksSkipped = 0;

  const newBookEntries: string[] = [];
  const newChapterEntries: string[] = [];

  for (const config of BOOK_CONFIGS) {
    if (existingBookIds.has(config.id)) {
      console.log(`  SKIP: ${config.id} (already exists)`);
      booksSkipped++;
      continue;
    }

    const metaPath = path.join(CONTENT_DIR, config.id, "meta.json");
    if (!fs.existsSync(metaPath)) {
      console.log(`  SKIP: ${config.id} (no meta.json found)`);
      booksSkipped++;
      continue;
    }

    const meta: MetaJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const colors = TRADITION_COLORS[config.tradition] || TRADITION_COLORS["Victorian"];
    const authorId = toAuthorId(config.author);
    const readingTime = formatReadingTime(meta.totalMinutes);

    let bookEntry = `  {\n`;
    bookEntry += `    id: "${config.id}",\n`;
    bookEntry += `    title: "${config.title.replace(/"/g, '\\"')}",\n`;
    bookEntry += `    author: "${config.author.replace(/"/g, '\\"')}",\n`;
    bookEntry += `    authorId: "${authorId}",\n`;
    bookEntry += `    year: ${config.year},\n`;
    if (config.language) {
      bookEntry += `    language: "${config.language}",\n`;
    }
    if (config.readingLanguage) {
      bookEntry += `    readingLanguage: "${config.readingLanguage}",\n`;
    }
    bookEntry += `    tradition: "${config.tradition}",\n`;
    bookEntry += `    era: "${config.era}",\n`;
    bookEntry += `    genres: [${config.genres.map(g => `"${g}"`).join(", ")}],\n`;
    bookEntry += `    difficulty: "${config.difficulty}",\n`;
    bookEntry += `    chapters: ${meta.chapterCount},\n`;
    bookEntry += `    estimatedReadingTime: "${readingTime}",\n`;
    bookEntry += `    wordCount: ${meta.totalWordCount},\n`;
    bookEntry += `    synopsis: "${config.synopsis.replace(/"/g, '\\"')}",\n`;
    bookEntry += `    themes: [${config.themes.map(t => `"${t}"`).join(", ")}],\n`;
    bookEntry += `    country: "${config.country}",\n`;
    bookEntry += `    coverColors: { primary: "${colors.primary}", secondary: "${colors.secondary}", accent: "${colors.accent}" },\n`;
    bookEntry += `    featured: false,\n`;
    bookEntry += `    source: "standard-ebooks",\n`;
    bookEntry += `  }`;

    newBookEntries.push(bookEntry);
    booksAdded++;

    for (const ch of meta.chapters) {
      const chapterId = `${config.id}-ch-${ch.index}`;
      if (existingChapterIds.has(chapterId)) continue;

      let chapterEntry = `  {\n`;
      chapterEntry += `    id: "${chapterId}",\n`;
      chapterEntry += `    bookId: "${config.id}",\n`;
      chapterEntry += `    number: ${ch.index},\n`;
      chapterEntry += `    title: "${ch.title.replace(/"/g, '\\"')}",\n`;
      chapterEntry += `    wordCount: ${ch.wordCount},\n`;
      chapterEntry += `    estimatedMinutes: ${ch.estimatedMinutes},\n`;
      chapterEntry += `    summary: "",\n`;
      chapterEntry += `    quizAvailable: false,\n`;
      chapterEntry += `  }`;

      newChapterEntries.push(chapterEntry);
      chaptersAdded++;
    }
  }

  if (newBookEntries.length > 0) {
    const booksInsert = "\n\n  // ── TIER B CANONICAL ADDITIONS (auto-generated) ────────────────────────────\n\n" +
      newBookEntries.join(",\n") + ",";
    const booksCloseIdx = booksContent.lastIndexOf("];");
    if (booksCloseIdx === -1) {
      console.error("ERROR: Could not find closing `];` in books.ts");
      process.exit(1);
    }
    booksContent = booksContent.slice(0, booksCloseIdx) + booksInsert + "\n" + booksContent.slice(booksCloseIdx);
    fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
    console.log(`\nWrote ${booksAdded} new books to books.ts`);
  }

  if (newChapterEntries.length > 0) {
    const chaptersInsert = "\n\n  // ── TIER B CANONICAL ADDITIONS (auto-generated) ────────────────────────────\n\n" +
      newChapterEntries.join(",\n") + ",";
    const chaptersCloseIdx = chaptersContent.lastIndexOf("]");
    if (chaptersCloseIdx === -1) {
      console.error("ERROR: Could not find closing `]` in chapters.ts");
      process.exit(1);
    }
    chaptersContent = chaptersContent.slice(0, chaptersCloseIdx) + chaptersInsert + "\n" + chaptersContent.slice(chaptersCloseIdx);
    fs.writeFileSync(CHAPTERS_FILE, chaptersContent, "utf-8");
    console.log(`Wrote ${chaptersAdded} new chapters to chapters.ts`);
  }

  console.log("\n══════════════════════════════════════════════════════");
  console.log(`  TIER B CANONICAL BOOKS SUMMARY`);
  console.log(`  Books added:   ${booksAdded}`);
  console.log(`  Books skipped: ${booksSkipped}`);
  console.log(`  Chapters added: ${chaptersAdded}`);
  console.log("══════════════════════════════════════════════════════\n");
}

main();
