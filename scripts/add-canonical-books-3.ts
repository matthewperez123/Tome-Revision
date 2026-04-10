#!/usr/bin/env npx tsx
/**
 * add-canonical-books-3.ts
 *
 * Adds ~130 Tier A canonical books to the Tome app library.
 * These are works with content already downloaded in public/content/
 * but missing from the main catalog in books.ts.
 *
 * Run: npx tsx scripts/add-canonical-books-3.ts
 */

import * as fs from "fs";
import * as path from "path";

// ── Paths ──────────────────────────────────────────────────────────────────────

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

// ── Tradition → Cover Colors ───────────────────────────────────────────────────

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

// ── Book Config Interface ──────────────────────────────────────────────────────

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

// ── Meta.json shape ────────────────────────────────────────────────────────────

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

// ── Helper: author → authorId ──────────────────────────────────────────────────

function toAuthorId(author: string): string {
  return author
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── Helper: format reading time ────────────────────────────────────────────────

function formatReadingTime(minutes: number): string {
  const hours = Math.round(minutes / 60);
  if (hours < 1) return `~${minutes} minutes`;
  return `~${hours} hour${hours !== 1 ? "s" : ""}`;
}

// ── Tier A Book Configs ────────────────────────────────────────────────────────

const BOOK_CONFIGS: BookConfig[] = [

  // ── Shakespeare (remaining plays) ──────────────────────────────────────────

  {
    id: "alls-well-that-ends-well",
    title: "All's Well That Ends Well",
    author: "William Shakespeare",
    year: 1605,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Comedy", "Problem Play"],
    difficulty: "Intermediate",
    synopsis: "A young woman of low birth cures the King of France and claims a reluctant nobleman as her husband, only to face his contempt and desertion before winning him back through wit and perseverance.",
    themes: ["Class", "Merit", "Gender", "Desire", "Deception", "Honor"],
    country: "England",
  },
  {
    id: "cymbeline",
    title: "Cymbeline",
    author: "William Shakespeare",
    year: 1611,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Romance", "Tragicomedy"],
    difficulty: "Advanced",
    synopsis: "In ancient Britain, a princess secretly marries beneath her station, triggering a chain of jealousy, exile, war, and mistaken identity before an improbable reunion restores all.",
    themes: ["Fidelity", "Jealousy", "Forgiveness", "Identity", "Empire", "Reconciliation"],
    country: "England",
  },
  {
    id: "henry-vi-part-i",
    title: "Henry VI, Part 1",
    author: "William Shakespeare",
    year: 1591,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "History"],
    difficulty: "Intermediate",
    synopsis: "The young Henry VI inherits a fractured kingdom as English lords quarrel and Joan of Arc rallies French resistance, beginning the long slide toward civil war.",
    themes: ["Power", "War", "Legitimacy", "Faction", "Nationalism", "Youth"],
    country: "England",
  },
  {
    id: "henry-vi-part-ii",
    title: "Henry VI, Part 2",
    author: "William Shakespeare",
    year: 1591,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "History"],
    difficulty: "Intermediate",
    synopsis: "Court intrigue intensifies as ambitious nobles plot against the pious but weak King Henry, culminating in Jack Cade's populist rebellion and the outbreak of the Wars of the Roses.",
    themes: ["Ambition", "Rebellion", "Justice", "Class conflict", "Treachery", "Weakness"],
    country: "England",
  },
  {
    id: "henry-vi-part-iii",
    title: "Henry VI, Part 3",
    author: "William Shakespeare",
    year: 1592,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "History"],
    difficulty: "Intermediate",
    synopsis: "England descends into full civil war as York and Lancaster trade the crown in a brutal cycle of revenge, ending with the rise of the ruthless Richard of Gloucester.",
    themes: ["Civil war", "Revenge", "Kingship", "Violence", "Loyalty", "Tyranny"],
    country: "England",
  },
  {
    id: "henry-viii",
    title: "Henry VIII",
    author: "William Shakespeare",
    year: 1613,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "History"],
    difficulty: "Intermediate",
    synopsis: "The fall of Cardinal Wolsey, the trial of Queen Katherine, and the birth of the future Elizabeth I unfold at the Tudor court in Shakespeare's last history play.",
    themes: ["Power", "Divorce", "Religion", "Court politics", "Fortune", "Legacy"],
    country: "England",
  },
  {
    id: "king-john",
    title: "King John",
    author: "William Shakespeare",
    year: 1596,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "History"],
    difficulty: "Intermediate",
    synopsis: "King John defends his contested throne against French invasion and papal interference, while the bastard Faulconbridge provides a sardonic commentary on political cynicism.",
    themes: ["Legitimacy", "Sovereignty", "War", "Papal authority", "Patriotism", "Pragmatism"],
    country: "England",
  },
  {
    id: "loves-labours-lost",
    title: "Love's Labour's Lost",
    author: "William Shakespeare",
    year: 1597,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Comedy"],
    difficulty: "Intermediate",
    synopsis: "Four young noblemen swear off women to devote themselves to study, only to fall hopelessly in love with four visiting ladies who refuse to let them off so easily.",
    themes: ["Love", "Wit", "Vanity", "Language", "Oath-breaking", "Courtship"],
    country: "England",
  },
  {
    id: "pericles",
    title: "Pericles, Prince of Tyre",
    author: "William Shakespeare",
    year: 1608,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Romance"],
    difficulty: "Advanced",
    synopsis: "Prince Pericles endures shipwreck, loss, and years of wandering across the Mediterranean before a miraculous reunion with the wife and daughter he believed dead.",
    themes: ["Fortune", "Patience", "Reunion", "The sea", "Virtue", "Providence"],
    country: "England",
  },
  {
    id: "the-comedy-of-errors",
    title: "The Comedy of Errors",
    author: "William Shakespeare",
    year: 1594,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Comedy", "Farce"],
    difficulty: "Beginner",
    synopsis: "Two sets of identical twins, separated at birth, converge on the same city and trigger a day of escalating confusion, mistaken identity, and slapstick before the family is finally reunited.",
    themes: ["Identity", "Family", "Confusion", "Commerce", "Marriage", "Reunion"],
    country: "England",
  },
  {
    id: "the-merry-wives-of-windsor",
    title: "The Merry Wives of Windsor",
    author: "William Shakespeare",
    year: 1597,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Comedy"],
    difficulty: "Beginner",
    synopsis: "The roguish Falstaff tries to seduce two married women for their money, but the wives discover his identical love letters and conspire to humiliate him in a series of escalating pranks.",
    themes: ["Wit", "Marriage", "Class", "Deception", "Community", "Comeuppance"],
    country: "England",
  },
  {
    id: "the-two-gentlemen-of-verona",
    title: "The Two Gentlemen of Verona",
    author: "William Shakespeare",
    year: 1593,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Comedy", "Romance"],
    difficulty: "Beginner",
    synopsis: "Two best friends travel to Milan where one betrays the other by pursuing his beloved, testing whether friendship or romantic love carries the greater claim.",
    themes: ["Friendship", "Betrayal", "Love", "Loyalty", "Forgiveness", "Constancy"],
    country: "England",
  },
  {
    id: "the-two-noble-kinsmen",
    title: "The Two Noble Kinsmen",
    author: "William Shakespeare",
    year: 1613,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Romance", "Tragicomedy"],
    difficulty: "Advanced",
    synopsis: "Imprisoned cousins Palamon and Arcite fall in love with the same woman and their unbreakable bond shatters into a rivalry settled only by combat and the gods' inscrutable will.",
    themes: ["Friendship", "Rivalry", "Fate", "Love", "Honor", "Sacrifice"],
    country: "England",
  },
  {
    id: "timon-of-athens",
    title: "Timon of Athens",
    author: "William Shakespeare",
    year: 1607,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Tragedy"],
    difficulty: "Advanced",
    synopsis: "A generous Athenian nobleman lavishes his wealth on false friends, and when bankruptcy reveals their ingratitude he retreats to the wilderness as a raging misanthrope.",
    themes: ["Generosity", "Ingratitude", "Misanthropy", "Wealth", "Friendship", "Corruption"],
    country: "England",
  },
  {
    id: "titus-andronicus",
    title: "Titus Andronicus",
    author: "William Shakespeare",
    year: 1593,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Tragedy", "Revenge Tragedy"],
    difficulty: "Advanced",
    synopsis: "A Roman general's triumph turns to horror as political enemies systematically destroy his family, driving him to increasingly savage acts of revenge in Shakespeare's bloodiest play.",
    themes: ["Revenge", "Violence", "Justice", "Empire", "Grief", "Barbarity"],
    country: "England",
  },
  {
    id: "troilus-and-cressida",
    title: "Troilus and Cressida",
    author: "William Shakespeare",
    year: 1602,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Drama", "Tragedy", "Problem Play"],
    difficulty: "Advanced",
    synopsis: "Set during the Trojan War, young lovers Troilus and Cressida are separated by a prisoner exchange, and her infidelity mirrors the futility and cynicism of the war itself.",
    themes: ["War", "Disillusionment", "Infidelity", "Honor", "Time", "Value"],
    country: "England",
  },

  // ── Sherlock Holmes & Conan Doyle ──────────────────────────────────────────

  {
    id: "the-adventures-of-sherlock-holmes",
    title: "The Adventures of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    year: 1892,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Twelve tales of deduction in which Holmes and Watson confront blackmail, theft, and murder across fog-bound London and the English countryside, establishing the detective story as a literary form.",
    themes: ["Deduction", "Justice", "Observation", "Crime", "Victorian society", "Friendship"],
    country: "England",
  },
  {
    id: "the-memoirs-of-sherlock-holmes",
    title: "The Memoirs of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    year: 1894,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Eleven more cases culminate in Holmes's fateful encounter with Professor Moriarty at Reichenbach Falls, where Watson believes he has lost his friend forever.",
    themes: ["Deduction", "Rivalry", "Sacrifice", "Crime", "Friendship", "Mortality"],
    country: "England",
  },
  {
    id: "the-return-of-sherlock-holmes",
    title: "The Return of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    year: 1905,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Holmes reappears alive after Reichenbach and resumes his partnership with Watson in thirteen cases that reveal an ageing detective still unmatched in his powers of observation.",
    themes: ["Resurrection", "Deduction", "Justice", "Crime", "Loyalty", "Aging"],
    country: "England",
  },
  {
    id: "the-casebook-of-sherlock-holmes",
    title: "The Casebook of Sherlock Holmes",
    author: "Arthur Conan Doyle",
    year: 1927,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "The final twelve Holmes stories range from the macabre to the comic, as the great detective confronts vampires, lion's manes, and retired colourmen in his twilight cases.",
    themes: ["Deduction", "Crime", "Science", "Aging", "Justice", "The uncanny"],
    country: "England",
  },
  {
    id: "his-last-bow",
    title: "His Last Bow",
    author: "Arthur Conan Doyle",
    year: 1917,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Eight stories including Holmes's final recorded case — a wartime espionage mission on the eve of World War I that draws the retired detective back into service for king and country.",
    themes: ["Espionage", "Patriotism", "Deduction", "War", "Duty", "Retirement"],
    country: "England",
  },
  {
    id: "the-valley-of-fear",
    title: "The Valley of Fear",
    author: "Arthur Conan Doyle",
    year: 1915,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "A coded warning leads Holmes to a moated manor house where a man has been shot, and the investigation reaches back to a secret society terrorizing a Pennsylvania mining valley.",
    themes: ["Secret societies", "Deduction", "Violence", "Identity", "Justice", "Fear"],
    country: "England",
  },
  {
    id: "the-lost-world",
    title: "The Lost World",
    author: "Arthur Conan Doyle",
    year: 1912,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Science Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "The bombastic Professor Challenger leads an expedition to a South American plateau where dinosaurs and ape-men still survive, in the adventure novel that launched a genre.",
    themes: ["Exploration", "Evolution", "Adventure", "Science", "Masculinity", "The unknown"],
    country: "England",
  },

  // ── Trollope (Barsetshire & Palliser) ──────────────────────────────────────

  {
    id: "the-warden",
    title: "The Warden",
    author: "Anthony Trollope",
    year: 1855,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Satire"],
    difficulty: "Intermediate",
    synopsis: "A gentle clergyman's comfortable sinecure becomes a cause célèbre when a reformer and the press attack the charitable trust he administers, forcing him to choose between conscience and security.",
    themes: ["Conscience", "Reform", "The Church", "Media", "Duty", "Integrity"],
    country: "England",
  },
  {
    id: "doctor-thorne",
    title: "Doctor Thorne",
    author: "Anthony Trollope",
    year: 1858,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Romance"],
    difficulty: "Intermediate",
    synopsis: "A country doctor's niece of uncertain parentage falls in love with the heir of a debt-ridden estate, and only a hidden inheritance can bridge the gulf of class that separates them.",
    themes: ["Class", "Inheritance", "Love", "Respectability", "Money", "Family secrets"],
    country: "England",
  },
  {
    id: "framley-parsonage",
    title: "Framley Parsonage",
    author: "Anthony Trollope",
    year: 1861,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel"],
    difficulty: "Intermediate",
    synopsis: "A young clergyman compromises himself by guaranteeing a friend's debts while his sister navigates the marriage market of Barsetshire, in Trollope's most warmly human chronicle of clerical life.",
    themes: ["Debt", "Ambition", "Marriage", "Clergy", "Friendship", "Respectability"],
    country: "England",
  },
  {
    id: "the-small-house-at-allington",
    title: "The Small House at Allington",
    author: "Anthony Trollope",
    year: 1864,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Romance"],
    difficulty: "Intermediate",
    synopsis: "Lily Dale gives her heart completely to a charming civil servant who jilts her for a wealthier match, and her refusal to love again becomes one of Victorian fiction's most debated decisions.",
    themes: ["Heartbreak", "Constancy", "Class", "Marriage", "Pride", "Social climbing"],
    country: "England",
  },
  {
    id: "the-last-chronicle-of-barset",
    title: "The Last Chronicle of Barset",
    author: "Anthony Trollope",
    year: 1867,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel"],
    difficulty: "Advanced",
    synopsis: "The proud, impoverished Reverend Crawley stands accused of theft in Trollope's masterpiece — a vast, deeply humane portrait of an entire community grappling with justice, charity, and the limits of sympathy.",
    themes: ["Pride", "Poverty", "Justice", "Community", "Clergy", "Compassion"],
    country: "England",
  },
  {
    id: "can-you-forgive-her",
    title: "Can You Forgive Her?",
    author: "Anthony Trollope",
    year: 1865,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Political Fiction"],
    difficulty: "Advanced",
    synopsis: "Three women face parallel choices between safe respectability and dangerous passion, launching Trollope's Palliser series and its decades-long exploration of marriage, money, and political ambition.",
    themes: ["Choice", "Marriage", "Independence", "Politics", "Respectability", "Passion"],
    country: "England",
  },
  {
    id: "phineas-finn",
    title: "Phineas Finn",
    author: "Anthony Trollope",
    year: 1869,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Intermediate",
    synopsis: "A charming young Irishman enters Parliament and navigates the treacherous intersection of political ambition and romantic entanglement in the drawing rooms and division lobbies of Westminster.",
    themes: ["Ambition", "Politics", "Love", "Class", "Ireland", "Compromise"],
    country: "England",
  },
  {
    id: "the-eustace-diamonds",
    title: "The Eustace Diamonds",
    author: "Anthony Trollope",
    year: 1873,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Satire"],
    difficulty: "Intermediate",
    synopsis: "The beautiful, scheming Lizzie Eustace clings to a diamond necklace she has no right to keep, and the legal and social battle over the jewels exposes the greed beneath Victorian propriety.",
    themes: ["Greed", "Deception", "Law", "Marriage", "Society", "Appearances"],
    country: "England",
  },
  {
    id: "phineas-redux",
    title: "Phineas Redux",
    author: "Anthony Trollope",
    year: 1874,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Advanced",
    synopsis: "Phineas Finn returns to Parliament only to face a murder charge, a duel, and the devastating personal costs of political life in Trollope's darkest and most psychologically penetrating Palliser novel.",
    themes: ["Injustice", "Politics", "Isolation", "Reputation", "Resilience", "Public opinion"],
    country: "England",
  },
  {
    id: "the-prime-minister",
    title: "The Prime Minister",
    author: "Anthony Trollope",
    year: 1876,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Political Fiction"],
    difficulty: "Advanced",
    synopsis: "Plantagenet Palliser becomes Prime Minister of a shaky coalition while his wife's social ambitions and a dangerous adventurer's schemes threaten to bring down the government and their marriage.",
    themes: ["Leadership", "Marriage", "Ambition", "Compromise", "Power", "Integrity"],
    country: "England",
  },
  {
    id: "the-dukes-children",
    title: "The Duke's Children",
    author: "Anthony Trollope",
    year: 1880,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Political Fiction", "Social Novel"],
    difficulty: "Intermediate",
    synopsis: "The widowed Duke of Omnium struggles to control his three children's romantic choices, learning that the class prejudices he enforces are the very ones his own life has disproved.",
    themes: ["Parenthood", "Class", "Change", "Love", "Grief", "Generational conflict"],
    country: "England",
  },

  // ── Greek & Roman Classics ─────────────────────────────────────────────────

  {
    id: "electra",
    title: "Electra",
    author: "Sophocles",
    year: -410,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Drama", "Tragedy"],
    difficulty: "Intermediate",
    synopsis: "Electra waits years for her brother Orestes to return and avenge their father Agamemnon's murder, her grief hardening into a rage that questions whether justice and vengeance can ever be separated.",
    themes: ["Revenge", "Grief", "Justice", "Family", "Duty", "Obsession"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },
  {
    id: "oedipus-at-colonus",
    title: "Oedipus at Colonus",
    author: "Sophocles",
    year: -401,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Drama", "Tragedy"],
    difficulty: "Advanced",
    synopsis: "The blind, exiled Oedipus arrives at Colonus near Athens, where his suffering transforms into a mysterious sacred power and he finds, at last, a death that redeems rather than destroys.",
    themes: ["Exile", "Redemption", "Sacred ground", "Old age", "Fate", "Grace"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },
  {
    id: "philoctetes",
    title: "Philoctetes",
    author: "Sophocles",
    year: -409,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Drama", "Tragedy"],
    difficulty: "Intermediate",
    synopsis: "The Greeks need a wounded hero's magic bow to win at Troy, but the young Neoptolemus must choose between Odysseus's cunning manipulation and honest compassion for the man they abandoned.",
    themes: ["Honesty", "Manipulation", "Suffering", "Honor", "Compassion", "War"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },
  {
    id: "the-trachiniae",
    title: "The Trachiniae",
    author: "Sophocles",
    year: -440,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Drama", "Tragedy"],
    difficulty: "Intermediate",
    synopsis: "Deianira sends her husband Heracles a robe she believes will restore his love, but the garment is poisoned and her well-intentioned act destroys both the greatest hero and herself.",
    themes: ["Love", "Jealousy", "Fate", "Good intentions", "Heroism", "Destruction"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },
  {
    id: "the-libation-bearers",
    title: "The Libation Bearers",
    author: "Aeschylus",
    year: -458,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Drama", "Tragedy"],
    difficulty: "Advanced",
    synopsis: "Orestes returns to Argos and, urged by his sister Electra and Apollo's command, murders his mother Clytemnestra to avenge his father — only to be hounded by the Furies for the matricide.",
    themes: ["Vengeance", "Matricide", "Divine command", "Guilt", "Justice", "Family curse"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },
  {
    id: "the-eumenides",
    title: "The Eumenides",
    author: "Aeschylus",
    year: -458,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Drama", "Tragedy"],
    difficulty: "Advanced",
    synopsis: "The Furies pursue Orestes to Athens where Athena establishes a jury trial to judge his matricide, transforming blood vengeance into civic justice in the climax of the Oresteia trilogy.",
    themes: ["Justice", "Mercy", "Civilization", "Law", "Transformation", "Democracy"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },
  {
    id: "the-golden-ass",
    title: "The Golden Ass",
    author: "Apuleius",
    year: 170,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Novel", "Satire", "Fantasy"],
    difficulty: "Intermediate",
    synopsis: "A young man's curiosity about magic transforms him into a donkey, and his picaresque adventures through the Roman world culminate in a mystical encounter with the goddess Isis that restores his humanity.",
    themes: ["Curiosity", "Transformation", "Religion", "Satire", "Redemption", "Magic"],
    country: "Roman Empire",
    language: "Latin",
    readingLanguage: "English",
  },
  {
    id: "the-argonautica",
    title: "The Argonautica",
    author: "Apollonius of Rhodes",
    year: -250,
    tradition: "Ancient Greek",
    era: "Ancient",
    genres: ["Epic Poetry", "Mythology", "Adventure"],
    difficulty: "Advanced",
    synopsis: "Jason and the Argonauts sail to Colchis to seize the Golden Fleece, and the sorceress Medea's terrible, passionate love for Jason becomes the poem's dark emotional center.",
    themes: ["Quest", "Love", "Heroism", "Magic", "Betrayal", "The sea"],
    country: "Ancient Greece",
    language: "Ancient Greek",
    readingLanguage: "English",
  },

  // ── Oscar Wilde (remaining plays) ──────────────────────────────────────────

  {
    id: "an-ideal-husband",
    title: "An Ideal Husband",
    author: "Oscar Wilde",
    year: 1895,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Drama", "Comedy", "Social Satire"],
    difficulty: "Beginner",
    synopsis: "A rising politician's youthful corruption is discovered by a scheming blackmailer, and only his wife's willingness to accept imperfection can save both his career and their marriage.",
    themes: ["Hypocrisy", "Forgiveness", "Morality", "Politics", "Marriage", "Appearances"],
    country: "England",
  },
  {
    id: "lady-windermeres-fan",
    title: "Lady Windermere's Fan",
    author: "Oscar Wilde",
    year: 1892,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Drama", "Comedy", "Social Satire"],
    difficulty: "Beginner",
    synopsis: "A young wife suspects her husband of keeping a disreputable older woman, but the truth about the mysterious Mrs. Erlynne proves far more complex and sacrificial than mere scandal.",
    themes: ["Motherhood", "Sacrifice", "Reputation", "Morality", "Secrecy", "Society"],
    country: "England",
  },
  {
    id: "a-woman-of-no-importance",
    title: "A Woman of No Importance",
    author: "Oscar Wilde",
    year: 1893,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Drama", "Comedy", "Social Satire"],
    difficulty: "Beginner",
    synopsis: "At an English country-house party, a young man discovers that the powerful lord offering him a career is the father who abandoned his mother, forcing a reckoning with Victorian double standards.",
    themes: ["Illegitimacy", "Hypocrisy", "Motherhood", "Power", "Gender", "Forgiveness"],
    country: "England",
  },

  // ── George Bernard Shaw ────────────────────────────────────────────────────

  {
    id: "major-barbara",
    title: "Major Barbara",
    author: "George Bernard Shaw",
    year: 1905,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Drama", "Comedy", "Social Criticism"],
    difficulty: "Intermediate",
    synopsis: "A Salvation Army officer confronts her father, a fabulously wealthy arms manufacturer, and is forced to question whether poverty or munitions is the greater evil.",
    themes: ["Poverty", "Wealth", "Religion", "War", "Idealism", "Capitalism"],
    country: "England",
  },
  {
    id: "man-and-superman",
    title: "Man and Superman",
    author: "George Bernard Shaw",
    year: 1903,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Drama", "Comedy", "Philosophy"],
    difficulty: "Advanced",
    synopsis: "A philosophical comedy in which a confirmed bachelor flees a determined young woman across Europe, interrupted by a dream-debate in Hell about the Life Force, evolution, and the purpose of humanity.",
    themes: ["Evolution", "Gender", "Philosophy", "Will", "Marriage", "Progress"],
    country: "England",
  },
  {
    id: "mrs-warrens-profession",
    title: "Mrs. Warren's Profession",
    author: "George Bernard Shaw",
    year: 1893,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Drama", "Social Criticism"],
    difficulty: "Intermediate",
    synopsis: "A Cambridge-educated daughter discovers that her mother's wealth comes from managing brothels, sparking a fierce debate about whether society or the individual bears responsibility for prostitution.",
    themes: ["Prostitution", "Capitalism", "Hypocrisy", "Independence", "Morality", "Class"],
    country: "England",
  },
  {
    id: "the-doctors-dilemma",
    title: "The Doctor's Dilemma",
    author: "George Bernard Shaw",
    year: 1906,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Drama", "Satire", "Tragicomedy"],
    difficulty: "Intermediate",
    synopsis: "A physician with a limited supply of a life-saving treatment must choose between saving a worthy colleague and a brilliant but morally dubious artist, exposing the ethical chaos of the medical profession.",
    themes: ["Medical ethics", "Art vs. morality", "Professional vanity", "Life", "Death", "Value"],
    country: "England",
  },
  {
    id: "you-never-can-tell",
    title: "You Never Can Tell",
    author: "George Bernard Shaw",
    year: 1897,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Drama", "Comedy"],
    difficulty: "Beginner",
    synopsis: "A progressive mother returns to England with her children and encounters the estranged father, setting off a comedy of generational conflict, modern manners, and the unpredictability of the heart.",
    themes: ["Family", "Modernity", "Feminism", "Love", "Convention", "Surprise"],
    country: "England",
  },

  // ── H.G. Wells ─────────────────────────────────────────────────────────────

  {
    id: "the-island-of-doctor-moreau",
    title: "The Island of Doctor Moreau",
    author: "H. G. Wells",
    year: 1896,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Science Fiction", "Horror"],
    difficulty: "Intermediate",
    synopsis: "A shipwrecked man discovers an island where a vivisectionist transforms animals into tortured human-like creatures, raising terrifying questions about the boundaries between beast and man.",
    themes: ["Science", "Ethics", "Humanity", "Pain", "Evolution", "Playing God"],
    country: "England",
  },
  {
    id: "the-first-men-in-the-moon",
    title: "The First Men in the Moon",
    author: "H. G. Wells",
    year: 1901,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Science Fiction"],
    difficulty: "Beginner",
    synopsis: "An eccentric scientist invents an anti-gravity substance and travels to the Moon with a bankrupt businessman, where they discover an alien insect civilization living beneath the lunar surface.",
    themes: ["Exploration", "Colonialism", "Science", "Capitalism", "Alien civilization", "Freedom"],
    country: "England",
  },
  {
    id: "kipps",
    title: "Kipps",
    author: "H. G. Wells",
    year: 1905,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Social Comedy"],
    difficulty: "Beginner",
    synopsis: "A draper's apprentice inherits a fortune and struggles to navigate upper-class society, discovering that money cannot buy the social graces or happiness he desperately seeks.",
    themes: ["Class", "Money", "Education", "Social mobility", "Authenticity", "Love"],
    country: "England",
  },
  {
    id: "the-history-of-mr-polly",
    title: "The History of Mr Polly",
    author: "H. G. Wells",
    year: 1910,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Social Comedy"],
    difficulty: "Beginner",
    synopsis: "A dyspeptic shopkeeper trapped in a loveless marriage fakes his own death and escapes to a country inn, finding the simple happiness that respectability had always denied him.",
    themes: ["Escape", "Freedom", "Mediocrity", "Marriage", "Self-reinvention", "Happiness"],
    country: "England",
  },
  {
    id: "tono-bungay",
    title: "Tono-Bungay",
    author: "H. G. Wells",
    year: 1909,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Social Satire", "Science Fiction"],
    difficulty: "Intermediate",
    synopsis: "A young man chronicles his uncle's meteoric rise and crash selling a worthless patent medicine, painting a sweeping portrait of Edwardian England's class system, commerce, and decay.",
    themes: ["Capitalism", "Class", "Fraud", "Science", "Empire", "Modernity"],
    country: "England",
  },

  // ── Gothic & Horror ────────────────────────────────────────────────────────

  {
    id: "the-castle-of-otranto",
    title: "The Castle of Otranto",
    author: "Horace Walpole",
    year: 1764,
    tradition: "Romantic",
    era: "Enlightenment",
    genres: ["Novel", "Gothic Fiction"],
    difficulty: "Intermediate",
    synopsis: "A tyrant's plans to secure his dynasty are thwarted by supernatural events in a haunted castle — the novel that invented Gothic fiction and changed the course of English literature.",
    themes: ["Usurpation", "The supernatural", "Tyranny", "Inheritance", "Terror", "Prophecy"],
    country: "England",
  },
  {
    id: "at-the-mountains-of-madness",
    title: "At the Mountains of Madness",
    author: "H. P. Lovecraft",
    year: 1936,
    tradition: "American",
    era: "Modern",
    genres: ["Novella", "Horror", "Science Fiction"],
    difficulty: "Intermediate",
    synopsis: "An Antarctic expedition discovers the ruins of a city built by alien beings millions of years ago, and the deeper they explore, the more they realize that something far worse than the cold still lurks within.",
    themes: ["Cosmic horror", "Exploration", "Forbidden knowledge", "Evolution", "Madness", "The unknown"],
    country: "USA",
  },
  {
    id: "the-case-of-charles-dexter-ward",
    title: "The Case of Charles Dexter Ward",
    author: "H. P. Lovecraft",
    year: 1941,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Horror", "Gothic Fiction"],
    difficulty: "Intermediate",
    synopsis: "A young antiquarian's obsession with his ancestor — a colonial-era necromancer — leads to a terrible resurrection and the slow erasure of his own identity by the evil he has summoned.",
    themes: ["Ancestry", "Forbidden knowledge", "Identity", "Necromancy", "Madness", "History"],
    country: "USA",
  },
  {
    id: "the-king-in-yellow",
    title: "The King in Yellow",
    author: "Robert W. Chambers",
    year: 1895,
    tradition: "American",
    era: "Victorian",
    genres: ["Short Stories", "Horror", "Weird Fiction"],
    difficulty: "Intermediate",
    synopsis: "A forbidden play called The King in Yellow drives all who read it to madness, and these interconnected stories of artists, soldiers, and dreamers trace its devastating influence across Paris and beyond.",
    themes: ["Madness", "Art", "Forbidden knowledge", "Decadence", "The supernatural", "Beauty"],
    country: "USA",
  },
  {
    id: "in-a-glass-darkly",
    title: "In a Glass Darkly",
    author: "Sheridan Le Fanu",
    year: 1872,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Short Stories", "Horror", "Gothic Fiction"],
    difficulty: "Intermediate",
    synopsis: "Five tales of the supernatural investigated by the occult detective Dr. Hesselius, including the vampire novella Carmilla, which predates Dracula by twenty-five years and remains more unsettling.",
    themes: ["The supernatural", "Psychological horror", "Desire", "Death", "Isolation", "The uncanny"],
    country: "Ireland",
  },
  {
    id: "melmoth-the-wanderer",
    title: "Melmoth the Wanderer",
    author: "Charles Maturin",
    year: 1820,
    tradition: "Romantic",
    era: "Romantic",
    genres: ["Novel", "Gothic Fiction"],
    difficulty: "Scholar",
    synopsis: "A man who sold his soul for 150 extra years of life wanders the earth seeking someone desperate enough to take over his bargain, in the most ambitious and terrifying of all Gothic novels.",
    themes: ["Damnation", "Desperation", "Religion", "Suffering", "Temptation", "Eternity"],
    country: "Ireland",
  },
  {
    id: "uncle-silas",
    title: "Uncle Silas",
    author: "Sheridan Le Fanu",
    year: 1864,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Gothic Fiction", "Mystery"],
    difficulty: "Intermediate",
    synopsis: "A young heiress is placed under the guardianship of her sinister uncle, and the creeping menace of his decaying mansion conceals a plot against her life and inheritance.",
    themes: ["Inheritance", "Menace", "Innocence", "Evil", "Isolation", "Trust"],
    country: "Ireland",
  },

  // ── American Literature ────────────────────────────────────────────────────

  {
    id: "the-last-of-the-mohicans",
    title: "The Last of the Mohicans",
    author: "James Fenimore Cooper",
    year: 1826,
    tradition: "American",
    era: "Romantic",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Intermediate",
    synopsis: "During the French and Indian War, the scout Hawkeye and the Mohican chief Chingachgook guide two sisters through the wilderness, where colonial warfare is destroying the Native world forever.",
    themes: ["Frontier", "Race", "Civilization", "Wilderness", "Honor", "Vanishing cultures"],
    country: "USA",
  },
  {
    id: "the-blithedale-romance",
    title: "The Blithedale Romance",
    author: "Nathaniel Hawthorne",
    year: 1852,
    tradition: "American",
    era: "Romantic",
    genres: ["Novel", "Satire"],
    difficulty: "Intermediate",
    synopsis: "A narrator joins a utopian farming community where idealism curdles into jealousy, manipulation, and tragedy as four people become entangled in a web of love and ideology.",
    themes: ["Utopianism", "Disillusionment", "Love", "Manipulation", "Community", "Hypocrisy"],
    country: "USA",
  },
  {
    id: "the-house-of-the-seven-gables",
    title: "The House of the Seven Gables",
    author: "Nathaniel Hawthorne",
    year: 1851,
    tradition: "American",
    era: "Romantic",
    genres: ["Novel", "Gothic Fiction"],
    difficulty: "Intermediate",
    synopsis: "A decaying mansion embodies the sins of the Pyncheon family across generations, as an old curse, a hidden deed, and the return of a long-lost cousin converge to break the cycle of guilt.",
    themes: ["Ancestral sin", "Decay", "Redemption", "Greed", "The past", "Justice"],
    country: "USA",
  },
  {
    id: "the-narrative-of-arthur-gordon-pym-of-nantucket",
    title: "The Narrative of Arthur Gordon Pym of Nantucket",
    author: "Edgar Allan Poe",
    year: 1838,
    tradition: "American",
    era: "Romantic",
    genres: ["Novel", "Adventure", "Horror"],
    difficulty: "Intermediate",
    synopsis: "A young stowaway's sea voyage escalates from mutiny to shipwreck to cannibalism to a hallucinatory Antarctic journey toward a vast white figure at the edge of the world.",
    themes: ["Adventure", "The unknown", "Survival", "Race", "Madness", "The Antarctic"],
    country: "USA",
  },
  {
    id: "the-innocents-abroad",
    title: "The Innocents Abroad",
    author: "Mark Twain",
    year: 1869,
    tradition: "American",
    era: "Victorian",
    genres: ["Travel Writing", "Humor", "Non-Fiction"],
    difficulty: "Beginner",
    synopsis: "Twain joins a group of American tourists on a steamship voyage through Europe and the Holy Land, deflating Old World pretensions with irreverent wit that made him a national voice.",
    themes: ["Travel", "Cultural clash", "Humor", "Religion", "Pretension", "American identity"],
    country: "USA",
  },
  {
    id: "roughing-it",
    title: "Roughing It",
    author: "Mark Twain",
    year: 1872,
    tradition: "American",
    era: "Victorian",
    genres: ["Memoir", "Humor", "Travel Writing"],
    difficulty: "Beginner",
    synopsis: "Twain recounts his years in the American West — mining for silver, befriending outlaws, nearly starving in the Nevada desert — in a rollicking memoir that mythologizes the frontier.",
    themes: ["The frontier", "Adventure", "Humor", "Failure", "American identity", "The West"],
    country: "USA",
  },
  {
    id: "martin-eden",
    title: "Martin Eden",
    author: "Jack London",
    year: 1909,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Autobiographical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A self-educated sailor fights his way into the literary world only to discover that success brings not fulfillment but a devastating recognition of the emptiness of the society he struggled to join.",
    themes: ["Class", "Ambition", "Disillusionment", "Art", "Individualism", "Suicide"],
    country: "USA",
  },
  {
    id: "the-iron-heel",
    title: "The Iron Heel",
    author: "Jack London",
    year: 1908,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Political Fiction", "Science Fiction"],
    difficulty: "Intermediate",
    synopsis: "A socialist revolutionary's manuscript, discovered centuries later, describes the rise of a corporate oligarchy in America and the brutal suppression of the working class that followed.",
    themes: ["Oligarchy", "Revolution", "Class warfare", "Prophecy", "Capitalism", "Resistance"],
    country: "USA",
  },
  {
    id: "the-virginian",
    title: "The Virginian",
    author: "Owen Wister",
    year: 1902,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Western"],
    difficulty: "Beginner",
    synopsis: "A nameless cowboy in 1880s Wyoming embodies frontier honor and justice as he rises from ranch hand to respected figure, in the novel that established every convention of the Western genre.",
    themes: ["Honor", "The frontier", "Justice", "Masculinity", "Civilization", "Love"],
    country: "USA",
  },
  {
    id: "spoon-river-anthology",
    title: "Spoon River Anthology",
    author: "Edgar Lee Masters",
    year: 1915,
    tradition: "American",
    era: "Modern",
    genres: ["Poetry", "Epitaph"],
    difficulty: "Beginner",
    synopsis: "The dead of a small Illinois town speak from their graves, revealing the secrets, regrets, and hidden connections that defined their lives in a collective portrait of American small-town existence.",
    themes: ["Small-town life", "Secrets", "Death", "Hypocrisy", "Regret", "Community"],
    country: "USA",
  },
  {
    id: "alice-adams",
    title: "Alice Adams",
    author: "Booth Tarkington",
    year: 1921,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Social Novel"],
    difficulty: "Beginner",
    synopsis: "A young woman in a small Midwestern city desperately tries to climb the social ladder, her pretensions and lies slowly unraveling as reality closes in on her romantic and social ambitions.",
    themes: ["Class", "Pretension", "Ambition", "Small-town life", "Self-deception", "Dignity"],
    country: "USA",
  },

  // ── British Modernist & 20th Century ───────────────────────────────────────

  {
    id: "crome-yellow",
    title: "Crome Yellow",
    author: "Aldous Huxley",
    year: 1921,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Satire", "Comedy"],
    difficulty: "Intermediate",
    synopsis: "A young poet visits a country house where the eccentric inhabitants represent every intellectual fad of the age, in Huxley's sparkling debut that satirizes the post-war generation's pretensions.",
    themes: ["Intellectualism", "Satire", "Youth", "Art", "Society", "Disillusionment"],
    country: "England",
  },
  {
    id: "antic-hay",
    title: "Antic Hay",
    author: "Aldous Huxley",
    year: 1923,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Satire"],
    difficulty: "Intermediate",
    synopsis: "A schoolteacher quits his job to invent pneumatic trousers, joining a circle of restless, brilliant 1920s Londoners searching for meaning through art, love, and increasingly frantic amusement.",
    themes: ["Ennui", "Modernity", "Meaninglessness", "Art", "Sex", "Restlessness"],
    country: "England",
  },
  {
    id: "those-barren-leaves",
    title: "Those Barren Leaves",
    author: "Aldous Huxley",
    year: 1925,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Satire"],
    difficulty: "Advanced",
    synopsis: "An English hostess gathers artists and intellectuals at her Italian palazzo, where their conversations about love, art, and philosophy expose the gap between ideas and lived experience.",
    themes: ["Art", "Philosophy", "Love", "Intellectualism", "Italy", "Emptiness"],
    country: "England",
  },
  {
    id: "decline-and-fall",
    title: "Decline and Fall",
    author: "Evelyn Waugh",
    year: 1928,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Satire", "Comedy"],
    difficulty: "Beginner",
    synopsis: "An innocent theology student is expelled from Oxford, becomes a schoolmaster at a terrible Welsh school, and falls into a picaresque spiral of crime, prison, and high society that devastates everyone except him.",
    themes: ["Innocence", "Satire", "Class", "Education", "Fortune", "Absurdity"],
    country: "England",
  },
  {
    id: "the-good-companions",
    title: "The Good Companions",
    author: "J. B. Priestley",
    year: 1929,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Picaresque"],
    difficulty: "Beginner",
    synopsis: "Three very different people escape their stifling lives and join a struggling concert party touring provincial England, finding friendship and purpose on the road.",
    themes: ["Escape", "Friendship", "Theater", "England", "Adventure", "Community"],
    country: "England",
  },
  {
    id: "lolly-willowes",
    title: "Lolly Willowes",
    author: "Sylvia Townsend Warner",
    year: 1926,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Fantasy", "Feminist Fiction"],
    difficulty: "Intermediate",
    synopsis: "A dutiful spinster aunt escapes decades of servitude to her family by moving to a remote village and making a pact with the Devil, in a sly feminist fable about women's freedom.",
    themes: ["Freedom", "Feminism", "Witchcraft", "Domesticity", "Nature", "Rebellion"],
    country: "England",
  },
  {
    id: "lady-into-fox",
    title: "Lady into Fox",
    author: "David Garnett",
    year: 1922,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novella", "Fantasy", "Fable"],
    difficulty: "Beginner",
    synopsis: "A Victorian gentleman's wife spontaneously transforms into a fox, and his desperate attempts to maintain their marriage as she grows increasingly wild become a parable of love and nature.",
    themes: ["Transformation", "Love", "Nature vs. civilization", "Marriage", "Loss", "Wildness"],
    country: "England",
  },
  {
    id: "the-man-who-was-thursday",
    title: "The Man Who Was Thursday",
    author: "G. K. Chesterton",
    year: 1908,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Thriller", "Philosophical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A poet-detective infiltrates a secret anarchist council only to discover that nothing and no one is what they seem, in a metaphysical thriller that transforms a spy story into a meditation on the nature of evil and creation.",
    themes: ["Anarchy", "Order", "Identity", "God", "Deception", "Nightmare"],
    country: "England",
  },
  {
    id: "the-napoleon-of-notting-hill",
    title: "The Napoleon of Notting Hill",
    author: "G. K. Chesterton",
    year: 1904,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Political Satire", "Fantasy"],
    difficulty: "Intermediate",
    synopsis: "In a future London governed by a randomly chosen king, a prankster monarch's joke restoring medieval local patriotism is taken seriously by one passionate man, sparking a small war with huge implications.",
    themes: ["Patriotism", "Absurdity", "Idealism", "Democracy", "Humor", "The local"],
    country: "England",
  },

  // ── French Literature ──────────────────────────────────────────────────────

  {
    id: "twenty-years-after",
    title: "Twenty Years After",
    author: "Alexandre Dumas",
    year: 1845,
    tradition: "French",
    era: "Romantic",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Intermediate",
    synopsis: "The four musketeers reunite twenty years later during the turmoil of the Fronde, now on opposite sides politically, and must navigate civil war, the execution of Charles I, and the rise of Mazarin.",
    themes: ["Loyalty", "Aging", "Politics", "Friendship", "Change", "Honor"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "the-vicomte-de-bragelonne",
    title: "The Vicomte de Bragelonne",
    author: "Alexandre Dumas",
    year: 1850,
    tradition: "French",
    era: "Romantic",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Advanced",
    synopsis: "The final musketeer saga encompasses the Man in the Iron Mask, Louis XIV's assumption of power, and the deaths of the great companions, closing the most beloved adventure cycle in literature.",
    themes: ["Kingship", "Identity", "Duty", "Mortality", "Friendship", "Power"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "lost-illusions",
    title: "Lost Illusions",
    author: "Honoré de Balzac",
    year: 1843,
    tradition: "French",
    era: "Romantic",
    genres: ["Novel", "Social Novel"],
    difficulty: "Advanced",
    synopsis: "A young provincial poet comes to Paris dreaming of literary glory, but the machinery of journalism, publishing, and society grinds his ideals to dust in Balzac's most devastating social panorama.",
    themes: ["Ambition", "Disillusionment", "Media", "Money", "Art", "Corruption"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "toilers-of-the-sea",
    title: "Toilers of the Sea",
    author: "Victor Hugo",
    year: 1866,
    tradition: "French",
    era: "Romantic",
    genres: ["Novel", "Adventure", "Romance"],
    difficulty: "Advanced",
    synopsis: "A solitary fisherman battles the sea itself to salvage a shipwrecked engine and win the woman he loves, only to discover that his heroic sacrifice will bring him no reward.",
    themes: ["The sea", "Labor", "Sacrifice", "Love", "Nature", "Solitude"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "penguin-island",
    title: "Penguin Island",
    author: "Anatole France",
    year: 1908,
    tradition: "French",
    era: "Modern",
    genres: ["Novel", "Satire", "Allegory"],
    difficulty: "Advanced",
    synopsis: "A nearsighted saint accidentally baptizes a colony of penguins, and their transformation into humans allows France to satirize the entire history of civilization, from feudalism to the Dreyfus Affair.",
    themes: ["Satire", "History", "Religion", "War", "Civilization", "Absurdity"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },

  // ── Children's & YA Classics ───────────────────────────────────────────────

  {
    id: "a-little-princess",
    title: "A Little Princess",
    author: "Frances Hodgson Burnett",
    year: 1905,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "A wealthy girl at a London boarding school loses everything when her father dies, but maintains her dignity and imagination through poverty and cruelty until a miraculous reversal of fortune.",
    themes: ["Imagination", "Resilience", "Kindness", "Class", "Storytelling", "Dignity"],
    country: "England",
  },
  {
    id: "winnie-the-pooh",
    title: "Winnie-the-Pooh",
    author: "A. A. Milne",
    year: 1926,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Children's Literature", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "A bear of very little brain and his friends in the Hundred Acre Wood have gentle adventures involving honey, heffalumps, and the everyday crises of childhood, creating the most beloved animal characters in English literature.",
    themes: ["Friendship", "Innocence", "Imagination", "Childhood", "Nature", "Simplicity"],
    country: "England",
  },
  {
    id: "bambi",
    title: "Bambi",
    author: "Felix Salten",
    year: 1923,
    tradition: "Germanic",
    era: "Modern",
    genres: ["Novel", "Children's Literature", "Allegory"],
    difficulty: "Beginner",
    synopsis: "A young deer grows up in the forest, learning about danger, death, and the mysterious power of Man, in an allegorical novel far darker and more philosophical than its famous adaptation suggests.",
    themes: ["Nature", "Coming of age", "Death", "Survival", "Man vs. nature", "Solitude"],
    country: "Austria",
    language: "German",
    readingLanguage: "English",
  },
  {
    id: "just-so-stories",
    title: "Just So Stories",
    author: "Rudyard Kipling",
    year: 1902,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Short Stories", "Children's Literature", "Fable"],
    difficulty: "Beginner",
    synopsis: "Whimsical origin tales explain how the leopard got its spots, how the elephant got its trunk, and other natural marvels, told in the hypnotic rhythmic prose Kipling invented for his daughter.",
    themes: ["Origins", "Nature", "Curiosity", "Storytelling", "Humor", "Imagination"],
    country: "England",
  },
  {
    id: "little-lord-fauntleroy",
    title: "Little Lord Fauntleroy",
    author: "Frances Hodgson Burnett",
    year: 1886,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "A cheerful American boy discovers he is heir to an English earldom and wins over his bitter, aristocratic grandfather through sheer goodness of heart, in the novel that made Burnett famous.",
    themes: ["Innocence", "Class", "Family", "Kindness", "Transatlantic culture", "Aristocracy"],
    country: "England",
  },
  {
    id: "the-adventures-of-pinocchio",
    title: "The Adventures of Pinocchio",
    author: "Carlo Collodi",
    year: 1883,
    tradition: "Romantic",
    era: "Victorian",
    genres: ["Novel", "Children's Literature", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "A wooden puppet brought to life is disobedient, reckless, and easily deceived, suffering increasingly dire consequences until he learns compassion and earns the right to become a real boy.",
    themes: ["Obedience", "Transformation", "Consequences", "Childhood", "Morality", "Love"],
    country: "Italy",
    language: "Italian",
    readingLanguage: "English",
  },
  {
    id: "the-railway-children",
    title: "The Railway Children",
    author: "E. Nesbit",
    year: 1906,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Children's Literature"],
    difficulty: "Beginner",
    synopsis: "Three children move to the Yorkshire countryside after their father's mysterious disappearance and befriend the railway workers and passengers who help them through hardship to a joyful reunion.",
    themes: ["Family", "Resilience", "Community", "Injustice", "Childhood", "Kindness"],
    country: "England",
  },
  {
    id: "the-princess-and-the-goblin",
    title: "The Princess and the Goblin",
    author: "George MacDonald",
    year: 1872,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Children's Literature", "Fantasy"],
    difficulty: "Beginner",
    synopsis: "A young princess discovers a mysterious great-grandmother spinning in a tower room, and with a miner boy's help must thwart an invasion by the goblins who live beneath the mountains.",
    themes: ["Courage", "Faith", "Good vs. evil", "Imagination", "Friendship", "The underground"],
    country: "Scotland",
  },

  // ── Detective/Mystery ──────────────────────────────────────────────────────

  {
    id: "the-mysterious-affair-at-styles",
    title: "The Mysterious Affair at Styles",
    author: "Agatha Christie",
    year: 1920,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Belgian detective Hercule Poirot investigates the poisoning of a wealthy woman at an English country estate in the novel that introduced literature's most famous detective.",
    themes: ["Murder", "Deduction", "Poison", "Inheritance", "Deception", "Justice"],
    country: "England",
  },
  {
    id: "poirot-investigates",
    title: "Poirot Investigates",
    author: "Agatha Christie",
    year: 1924,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Eleven cases challenge Poirot's grey cells, from a jewel theft at a grand Egyptian hotel to a kidnapped prime minister, in the first collection of the detective's short adventures.",
    themes: ["Deduction", "Crime", "Wit", "Justice", "Observation", "Psychology"],
    country: "England",
  },
  {
    id: "the-innocence-of-father-brown",
    title: "The Innocence of Father Brown",
    author: "G. K. Chesterton",
    year: 1911,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Short Stories", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "A small, shabby Catholic priest solves crimes through his understanding of human evil rather than forensic science, outwitting master criminals with intuition, theology, and an umbrella.",
    themes: ["Good and evil", "Faith", "Reason", "Crime", "Humility", "Paradox"],
    country: "England",
  },
  {
    id: "whose-body",
    title: "Whose Body?",
    author: "Dorothy L. Sayers",
    year: 1923,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Lord Peter Wimsey investigates a naked body found in a bathtub and a missing financier, in the debut novel that established the wittiest and most human of all golden-age detectives.",
    themes: ["Murder", "Identity", "Class", "Wit", "Justice", "Trauma"],
    country: "England",
  },
  {
    id: "the-man-in-the-queue",
    title: "The Man in the Queue",
    author: "Josephine Tey",
    year: 1929,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Mystery", "Detective Fiction"],
    difficulty: "Beginner",
    synopsis: "Inspector Grant of Scotland Yard investigates a man stabbed while waiting in a theater queue, and the trail leads from London's West End to the Scottish Highlands.",
    themes: ["Murder", "Identity", "Pursuit", "Intuition", "Justice", "Scotland"],
    country: "England",
  },
  {
    id: "the-red-house-mystery",
    title: "The Red House Mystery",
    author: "A. A. Milne",
    year: 1922,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Mystery"],
    difficulty: "Beginner",
    synopsis: "A guest at a country house arrives just as a shot rings out from the study, and he and a friend conduct their own investigation with cheerful amateur enthusiasm that masks real danger.",
    themes: ["Murder", "Amateur detection", "Friendship", "Country life", "Deception", "Games"],
    country: "England",
  },

  // ── Important Non-Fiction & Memoir ─────────────────────────────────────────

  {
    id: "the-interesting-narrative-of-the-life-of-olaudah-equiano",
    title: "The Interesting Narrative of the Life of Olaudah Equiano",
    author: "Olaudah Equiano",
    year: 1789,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Autobiography", "Slave Narrative"],
    difficulty: "Intermediate",
    synopsis: "Kidnapped from West Africa as a child, Equiano recounts his enslavement, his education, his purchase of his own freedom, and his advocacy for abolition in one of the most important autobiographies ever written.",
    themes: ["Slavery", "Freedom", "Identity", "Faith", "Commerce", "Human dignity"],
    country: "England",
  },
  {
    id: "running-a-thousand-miles-for-freedom",
    title: "Running a Thousand Miles for Freedom",
    author: "William Craft",
    year: 1860,
    tradition: "American",
    era: "Victorian",
    genres: ["Autobiography", "Slave Narrative"],
    difficulty: "Beginner",
    synopsis: "A light-skinned enslaved woman disguises herself as a white male slaveholder and her husband poses as her servant, traveling openly by train and steamboat from Georgia to freedom in Philadelphia.",
    themes: ["Slavery", "Disguise", "Courage", "Race", "Freedom", "Marriage"],
    country: "USA",
  },
  {
    id: "how-the-other-half-lives",
    title: "How the Other Half Lives",
    author: "Jacob Riis",
    year: 1890,
    tradition: "American",
    era: "Victorian",
    genres: ["Non-Fiction", "Journalism", "Social Reform"],
    difficulty: "Intermediate",
    synopsis: "A pioneering photojournalist documents the squalor of New York City's tenement slums, shocking the nation into reform and establishing investigative journalism as a force for social change.",
    themes: ["Poverty", "Immigration", "Reform", "Urban life", "Photography", "Justice"],
    country: "USA",
  },
  {
    id: "personal-memoirs-of-ulysses-s-grant",
    title: "Personal Memoirs of Ulysses S. Grant",
    author: "Ulysses S. Grant",
    year: 1885,
    tradition: "American",
    era: "Victorian",
    genres: ["Autobiography", "Military History"],
    difficulty: "Intermediate",
    synopsis: "The dying general writes with extraordinary clarity about the Mexican and Civil Wars, producing a military memoir that Mark Twain compared to Caesar's Commentaries for its directness and honesty.",
    themes: ["War", "Leadership", "Honor", "Mortality", "Strategy", "American history"],
    country: "USA",
  },
  {
    id: "seven-pillars-of-wisdom",
    title: "Seven Pillars of Wisdom",
    author: "T. E. Lawrence",
    year: 1926,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Autobiography", "Military History"],
    difficulty: "Advanced",
    synopsis: "Lawrence of Arabia's epic account of leading the Arab Revolt against the Ottoman Empire, blending guerrilla warfare, desert landscapes, and agonized self-examination into a modernist masterpiece of memoir.",
    themes: ["War", "Identity", "Colonialism", "Desert", "Leadership", "Guilt"],
    country: "England",
  },
  {
    id: "ten-days-that-shook-the-world",
    title: "Ten Days That Shook the World",
    author: "John Reed",
    year: 1919,
    tradition: "American",
    era: "Modern",
    genres: ["Non-Fiction", "Journalism", "History"],
    difficulty: "Intermediate",
    synopsis: "An American journalist provides a breathless eyewitness account of the Bolshevik Revolution, capturing the chaos, speeches, and street battles of the ten days that transformed world history.",
    themes: ["Revolution", "History", "Ideology", "Journalism", "Power", "The masses"],
    country: "USA",
  },
  {
    id: "a-voice-from-the-south",
    title: "A Voice from the South",
    author: "Anna Julia Cooper",
    year: 1892,
    tradition: "American",
    era: "Victorian",
    genres: ["Non-Fiction", "Essays", "Feminist Theory"],
    difficulty: "Intermediate",
    synopsis: "A Black feminist intellectual argues that the advancement of African American women is essential to the progress of the entire race and nation, in a visionary collection that anticipates intersectional thought by a century.",
    themes: ["Race", "Gender", "Education", "Feminism", "Progress", "The South"],
    country: "USA",
  },
  {
    id: "darkwater",
    title: "Darkwater",
    author: "W. E. B. Du Bois",
    year: 1920,
    tradition: "American",
    era: "Modern",
    genres: ["Non-Fiction", "Essays", "Autobiography"],
    difficulty: "Advanced",
    synopsis: "Du Bois blends autobiography, essays, fiction, and poetry to anatomize global white supremacy, extending his analysis from America to the colonized world in a radical companion to The Souls of Black Folk.",
    themes: ["Race", "Colonialism", "Democracy", "Labor", "Gender", "Global justice"],
    country: "USA",
  },
  {
    id: "the-conquest-of-bread",
    title: "The Conquest of Bread",
    author: "Peter Kropotkin",
    year: 1892,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Non-Fiction", "Political Philosophy"],
    difficulty: "Intermediate",
    synopsis: "The anarchist prince argues that mutual aid, not competition, drives human progress, and lays out a practical vision of a society organized around voluntary cooperation and the abolition of private property.",
    themes: ["Anarchism", "Cooperation", "Equality", "Labor", "Revolution", "Community"],
    country: "Russia",
    language: "French",
    readingLanguage: "English",
  },

  // ── Other Notable Works ────────────────────────────────────────────────────

  {
    id: "ben-hur",
    title: "Ben-Hur: A Tale of the Christ",
    author: "Lew Wallace",
    year: 1880,
    tradition: "American",
    era: "Victorian",
    genres: ["Novel", "Historical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A Jewish prince is betrayed by his Roman friend, enslaved, and battles his way back to vengeance through galley warfare and chariot racing against the backdrop of Christ's ministry.",
    themes: ["Revenge", "Redemption", "Faith", "Friendship", "Empire", "Justice"],
    country: "USA",
  },
  {
    id: "scaramouche",
    title: "Scaramouche",
    author: "Rafael Sabatini",
    year: 1921,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "A young lawyer in revolutionary France reinvents himself as a comedian, a fencing master, and a politician to avenge a murdered friend, in the swashbuckler that opens with one of literature's great first lines.",
    themes: ["Revolution", "Identity", "Revenge", "Justice", "Theater", "Swordsmanship"],
    country: "England",
  },
  {
    id: "captain-blood",
    title: "Captain Blood",
    author: "Rafael Sabatini",
    year: 1922,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Historical Fiction", "Adventure"],
    difficulty: "Beginner",
    synopsis: "An Irish doctor is unjustly enslaved in the Caribbean and escapes to become the most honorable pirate in the Spanish Main, blending swashbuckling adventure with a love story and political intrigue.",
    themes: ["Injustice", "Honor", "Freedom", "Adventure", "Love", "The sea"],
    country: "England",
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
  {
    id: "the-riddle-of-the-sands",
    title: "The Riddle of the Sands",
    author: "Erskine Childers",
    year: 1903,
    tradition: "Victorian",
    era: "Modern",
    genres: ["Novel", "Thriller", "Espionage"],
    difficulty: "Intermediate",
    synopsis: "Two young Englishmen sailing in the Frisian Islands stumble upon a German plot to invade Britain, in the novel that invented the modern spy thriller and actually changed British naval policy.",
    themes: ["Espionage", "Patriotism", "Sailing", "Germany", "Preparedness", "Adventure"],
    country: "England",
  },
  {
    id: "the-mark-of-zorro",
    title: "The Mark of Zorro",
    author: "Johnston McCulley",
    year: 1919,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Adventure", "Swashbuckler"],
    difficulty: "Beginner",
    synopsis: "A seemingly lazy young nobleman in Spanish California leads a double life as the masked swordsman Zorro, defending the oppressed against a corrupt governor in the story that launched a legend.",
    themes: ["Justice", "Dual identity", "Oppression", "Heroism", "Romance", "Rebellion"],
    country: "USA",
  },
  {
    id: "cranford",
    title: "Cranford",
    author: "Elizabeth Gaskell",
    year: 1853,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Comedy"],
    difficulty: "Beginner",
    synopsis: "The ladies of a small English town navigate financial crises, romantic hopes, and social rituals with a genteel determination that masks deep wells of courage, loyalty, and love.",
    themes: ["Community", "Gentility", "Women's lives", "Change", "Friendship", "Class"],
    country: "England",
  },
  {
    id: "a-journal-of-the-plague-year",
    title: "A Journal of the Plague Year",
    author: "Daniel Defoe",
    year: 1722,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Novel", "Historical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A London saddler narrates the Great Plague of 1665 with the vivid, documentary detail of a survivor, recording the terror, the quarantines, and the human behavior that pandemic reveals.",
    themes: ["Plague", "Survival", "Fear", "Community", "Faith", "Urban life"],
    country: "England",
  },
  {
    id: "the-vicar-of-wakefield",
    title: "The Vicar of Wakefield",
    author: "Oliver Goldsmith",
    year: 1766,
    tradition: "Enlightenment",
    era: "Enlightenment",
    genres: ["Novel", "Satire", "Pastoral"],
    difficulty: "Intermediate",
    synopsis: "A kindly country vicar endures an improbable cascade of misfortunes — financial ruin, seduction, imprisonment — with such patient goodness that the novel becomes both comedy and moral fable.",
    themes: ["Goodness", "Fortune", "Family", "Virtue", "Class", "Justice"],
    country: "Ireland",
  },
  {
    id: "erewhon",
    title: "Erewhon",
    author: "Samuel Butler",
    year: 1872,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Satire", "Utopian Fiction"],
    difficulty: "Advanced",
    synopsis: "A traveler discovers a hidden civilization where machines have been banned, illness is a crime, and crime is treated as illness, in a satirical inversion of Victorian England's deepest assumptions.",
    themes: ["Satire", "Machines", "Morality", "Civilization", "Evolution", "Hypocrisy"],
    country: "England",
  },
  {
    id: "news-from-nowhere",
    title: "News from Nowhere",
    author: "William Morris",
    year: 1890,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Utopian Fiction"],
    difficulty: "Intermediate",
    synopsis: "A Victorian socialist falls asleep and wakes in a future England where capitalism has been replaced by a pastoral, artisanal society of beauty and fellowship — Morris's vision of paradise on earth.",
    themes: ["Utopia", "Socialism", "Art", "Labor", "Nature", "Community"],
    country: "England",
  },
  {
    id: "lorna-doone",
    title: "Lorna Doone",
    author: "R. D. Blackmore",
    year: 1869,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Historical Fiction", "Romance"],
    difficulty: "Intermediate",
    synopsis: "A yeoman farmer in 17th-century Exmoor falls in love with the daughter of the notorious Doone outlaws, and their romance entangles with the Monmouth Rebellion in a beloved English pastoral epic.",
    themes: ["Love", "Class", "Vengeance", "Landscape", "Loyalty", "Justice"],
    country: "England",
  },

  // ── Additional Dickens ─────────────────────────────────────────────────────

  {
    id: "little-dorrit",
    title: "Little Dorrit",
    author: "Charles Dickens",
    year: 1857,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel"],
    difficulty: "Advanced",
    synopsis: "A woman born in debtors' prison and the man who loves her navigate a labyrinth of government bureaucracy, financial speculation, and family secrets in Dickens's most architecturally ambitious novel.",
    themes: ["Imprisonment", "Bureaucracy", "Money", "Love", "Society", "Freedom"],
    country: "England",
  },
  {
    id: "nicholas-nickleby",
    title: "Nicholas Nickleby",
    author: "Charles Dickens",
    year: 1839,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Novel", "Comedy"],
    difficulty: "Intermediate",
    synopsis: "A young man rescues a disabled boy from a brutal Yorkshire school and fights his scheming uncle's plots against his family, joining a theatrical troupe along the way.",
    themes: ["Education", "Family", "Cruelty", "Kindness", "Justice", "Theater"],
    country: "England",
  },
  {
    id: "the-old-curiosity-shop",
    title: "The Old Curiosity Shop",
    author: "Charles Dickens",
    year: 1841,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Sentimental Novel"],
    difficulty: "Intermediate",
    synopsis: "Little Nell and her gambling-addicted grandfather flee through the English countryside pursued by the monstrous dwarf Quilp, in the novel whose heroine's fate made all of England weep.",
    themes: ["Innocence", "Greed", "Mortality", "Poverty", "Goodness", "Pursuit"],
    country: "England",
  },
  {
    id: "martin-chuzzlewit",
    title: "Martin Chuzzlewit",
    author: "Charles Dickens",
    year: 1844,
    tradition: "Victorian",
    era: "Victorian",
    genres: ["Novel", "Social Satire", "Comedy"],
    difficulty: "Intermediate",
    synopsis: "The Chuzzlewit family tears itself apart over an inheritance while young Martin travels to America and encounters the villainous hypocrite Pecksniff and the unforgettable nurse Mrs. Gamp.",
    themes: ["Selfishness", "Hypocrisy", "Family", "America", "Money", "Self-knowledge"],
    country: "England",
  },
];

// ── Main ───────────────────────────────────────────────────────────────────────

function main() {
  // Read existing files
  let booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  let chaptersContent = fs.readFileSync(CHAPTERS_FILE, "utf-8");

  // Extract existing book IDs from books.ts
  const existingBookIds = new Set<string>();
  const bookIdRegex = /id:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = bookIdRegex.exec(booksContent)) !== null) {
    existingBookIds.add(match[1]);
  }

  // Extract existing chapter IDs from chapters.ts
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
    // Skip if book already exists
    if (existingBookIds.has(config.id)) {
      console.log(`  SKIP: ${config.id} (already exists)`);
      booksSkipped++;
      continue;
    }

    // Read meta.json for chapter data
    const metaPath = path.join(CONTENT_DIR, config.id, "meta.json");
    if (!fs.existsSync(metaPath)) {
      console.log(`  SKIP: ${config.id} (no meta.json found at ${metaPath})`);
      booksSkipped++;
      continue;
    }

    const meta: MetaJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));

    // Get cover colors from tradition
    const colors = TRADITION_COLORS[config.tradition] || TRADITION_COLORS["Victorian"];

    // Build book entry
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

    // Build chapter entries
    for (const ch of meta.chapters) {
      const chapterId = `${config.id}-ch-${ch.index}`;
      if (existingChapterIds.has(chapterId)) {
        continue;
      }

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

  // Append new book entries before the final `];`
  if (newBookEntries.length > 0) {
    const booksInsert = "\n\n  // ── TIER A CANONICAL ADDITIONS (auto-generated) ────────────────────────────\n\n" +
      newBookEntries.join(",\n") + ",";

    // Find the last `];` in books.ts and insert before it
    const booksCloseIdx = booksContent.lastIndexOf("];");
    if (booksCloseIdx === -1) {
      console.error("ERROR: Could not find closing `];` in books.ts");
      process.exit(1);
    }
    booksContent = booksContent.slice(0, booksCloseIdx) + booksInsert + "\n" + booksContent.slice(booksCloseIdx);
    fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
    console.log(`\nWrote ${booksAdded} new books to books.ts`);
  }

  // Append new chapter entries before the final `]`
  if (newChapterEntries.length > 0) {
    const chaptersInsert = "\n\n  // ── TIER A CANONICAL ADDITIONS (auto-generated) ────────────────────────────\n\n" +
      newChapterEntries.join(",\n") + ",";

    // Find the last `]` in chapters.ts and insert before it
    const chaptersCloseIdx = chaptersContent.lastIndexOf("]");
    if (chaptersCloseIdx === -1) {
      console.error("ERROR: Could not find closing `]` in chapters.ts");
      process.exit(1);
    }
    chaptersContent = chaptersContent.slice(0, chaptersCloseIdx) + chaptersInsert + "\n" + chaptersContent.slice(chaptersCloseIdx);
    fs.writeFileSync(CHAPTERS_FILE, chaptersContent, "utf-8");
    console.log(`Wrote ${chaptersAdded} new chapters to chapters.ts`);
  }

  // Summary
  console.log("\n══════════════════════════════════════════════════════");
  console.log(`  TIER A CANONICAL BOOKS SUMMARY`);
  console.log(`  Books added:   ${booksAdded}`);
  console.log(`  Books skipped: ${booksSkipped} (already existed or no content)`);
  console.log(`  Chapters added: ${chaptersAdded}`);
  console.log("══════════════════════════════════════════════════════\n");
}

main();
