#!/usr/bin/env npx tsx
/** add-canonical-books-7.ts — Tier 1 + Tier 2 canonical additions */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

const TRADITION_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  Victorian: { primary: "#2D1B5E", secondary: "#1E1145", accent: "#8B5CF6" },
  Russian: { primary: "#5C1A1A", secondary: "#3D1010", accent: "#DC2626" },
  American: { primary: "#143220", secondary: "#0A1F14", accent: "#22C55E" },
  French: { primary: "#0A1F3D", secondary: "#061428", accent: "#EC4899" },
  Modernist: { primary: "#111827", secondary: "#0A0F1A", accent: "#14B8A6" },
  Germanic: { primary: "#1F2937", secondary: "#111827", accent: "#10B981" },
  "Medieval European": { primary: "#1B4332", secondary: "#0F2B20", accent: "#F59E0B" },
  Renaissance: { primary: "#3D1A6E", secondary: "#2A1050", accent: "#D97706" },
  Scandinavian: { primary: "#1E293B", secondary: "#0F172A", accent: "#38BDF8" },
  "Post-Colonial": { primary: "#065F46", secondary: "#034335", accent: "#10B981" },
  Enlightenment: { primary: "#0F2744", secondary: "#091A2E", accent: "#06B6D4" },
};

interface BookConfig {
  id: string; title: string; author: string; year: number; tradition: string; era: string;
  genres: string[]; difficulty: "Beginner" | "Intermediate" | "Advanced" | "Scholar";
  synopsis: string; themes: string[]; country: string; language?: string; readingLanguage?: string;
}
interface MetaJson {
  bookId: string; title: string; author: string; chapterCount: number;
  totalWordCount: number; totalMinutes: number;
  chapters: Array<{ index: number; title: string; wordCount: number; estimatedMinutes: number }>;
}
function toAuthorId(a: string): string { return a.toLowerCase().replace(/\./g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,""); }
function formatReadingTime(m: number): string { const h=Math.round(m/60); return h<1?`~${m} minutes`:`~${h} hour${h!==1?"s":""}`; }

const BOOK_CONFIGS: BookConfig[] = [
  // ── TIER 1 ─────────────────────────────────────────────────────────────────
  {
    id: "the-maltese-falcon",
    title: "The Maltese Falcon",
    author: "Dashiell Hammett",
    year: 1930,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Mystery", "Hard-Boiled Fiction"],
    difficulty: "Beginner",
    synopsis: "San Francisco detective Sam Spade takes on a case involving a jewel-encrusted falcon, three ruthless treasure hunters, and the beautiful liar who hired him, in the novel that invented hard-boiled detective fiction.",
    themes: ["Deception", "Greed", "Masculinity", "Loyalty", "Crime", "Honor"],
    country: "USA",
  },
  {
    id: "as-i-lay-dying",
    title: "As I Lay Dying",
    author: "William Faulkner",
    year: 1930,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Modernist Fiction"],
    difficulty: "Advanced",
    synopsis: "Fifteen narrators recount the Bundren family's grotesque, heroic journey to bury their mother in her hometown, each voice revealing a different fragment of truth in Faulkner's darkly comic masterpiece.",
    themes: ["Death", "Family", "Duty", "Madness", "The South", "Perspective"],
    country: "USA",
  },
  {
    id: "the-magic-mountain",
    title: "The Magic Mountain",
    author: "Thomas Mann",
    year: 1924,
    tradition: "Germanic",
    era: "Modern",
    genres: ["Novel", "Philosophical Fiction"],
    difficulty: "Scholar",
    synopsis: "A young engineer visits a Swiss tuberculosis sanatorium for three weeks and stays seven years, as the mountain becomes a vast allegory of European civilization debating its own fate on the eve of World War I.",
    themes: ["Time", "Disease", "Ideas", "Death", "Love", "Europe"],
    country: "Germany",
    language: "German",
    readingLanguage: "English",
  },
  {
    id: "the-castle",
    title: "The Castle",
    author: "Franz Kafka",
    year: 1926,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Absurdist Fiction"],
    difficulty: "Advanced",
    synopsis: "A land surveyor arrives in a village controlled by an inaccessible castle and spends the rest of his life trying to gain entry, in Kafka's most sustained exploration of bureaucratic futility and the impossibility of belonging.",
    themes: ["Bureaucracy", "Alienation", "Authority", "Futility", "Identity", "Belonging"],
    country: "Czech Republic",
    language: "German",
    readingLanguage: "English",
  },
  {
    id: "demian",
    title: "Demian",
    author: "Hermann Hesse",
    year: 1919,
    tradition: "Germanic",
    era: "Modern",
    genres: ["Novel", "Bildungsroman", "Philosophical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A young man's spiritual awakening leads him from bourgeois comfort through doubt, temptation, and war toward a vision of selfhood guided by the enigmatic Max Demian, who teaches him that the way to God passes through the devil.",
    themes: ["Self-discovery", "Good and evil", "Individuation", "Youth", "Spirituality", "War"],
    country: "Germany",
    language: "German",
    readingLanguage: "English",
  },
  {
    id: "the-house-of-the-dead",
    title: "The House of the Dead",
    author: "Fyodor Dostoevsky",
    year: 1862,
    tradition: "Russian",
    era: "Victorian",
    genres: ["Novel", "Autobiographical Fiction", "Prison Literature"],
    difficulty: "Intermediate",
    synopsis: "Based on Dostoevsky's own four years in a Siberian prison camp, this unflinching account of convict life reveals the full spectrum of human nature under extreme conditions — cruelty, resilience, dignity, and unexpected grace.",
    themes: ["Prison", "Suffering", "Human nature", "Russia", "Redemption", "Freedom"],
    country: "Russia",
    language: "Russian",
    readingLanguage: "English",
  },
  {
    id: "sir-gawain-and-the-green-knight",
    title: "Sir Gawain and the Green Knight",
    author: "Anonymous",
    year: 1400,
    tradition: "Medieval European",
    era: "Medieval",
    genres: ["Poetry", "Romance", "Allegory"],
    difficulty: "Advanced",
    synopsis: "A monstrous green knight challenges King Arthur's court, and Sir Gawain must travel to meet his fate a year later, testing his honor, courage, and honesty in the greatest poem of medieval English after Chaucer.",
    themes: ["Honor", "Temptation", "Courage", "Nature", "Chivalry", "Mortality"],
    country: "England",
    language: "Middle English",
    readingLanguage: "English",
  },
  {
    id: "vile-bodies",
    title: "Vile Bodies",
    author: "Evelyn Waugh",
    year: 1930,
    tradition: "Modernist",
    era: "Modern",
    genres: ["Novel", "Satire", "Comedy"],
    difficulty: "Intermediate",
    synopsis: "The Bright Young Things of 1920s London race through parties, scandals, and romantic disasters at breakneck speed, as Waugh's razor wit reveals a generation dancing on the edge of catastrophe.",
    themes: ["Youth", "Decadence", "Satire", "Society", "War", "Meaninglessness"],
    country: "England",
  },
  {
    id: "the-counterfeiters",
    title: "The Counterfeiters",
    author: "André Gide",
    year: 1925,
    tradition: "French",
    era: "Modern",
    genres: ["Novel", "Metafiction"],
    difficulty: "Advanced",
    synopsis: "A novelist writing a novel called The Counterfeiters watches as adolescents, criminals, and hypocrites circulate through Parisian society like fake coins, in the most radical French metafiction before the nouveau roman.",
    themes: ["Authenticity", "Art", "Youth", "Morality", "Self-deception", "Freedom"],
    country: "France",
    language: "French",
    readingLanguage: "English",
  },
  {
    id: "the-lusiads",
    title: "The Lusiads",
    author: "Luís de Camões",
    year: 1572,
    tradition: "Renaissance",
    era: "Renaissance",
    genres: ["Epic Poetry", "Historical Fiction"],
    difficulty: "Advanced",
    synopsis: "Portugal's national epic follows Vasco da Gama's voyage to India, blending historical navigation with classical mythology to celebrate Portuguese exploration and create the last great Renaissance epic.",
    themes: ["Exploration", "Empire", "Heroism", "Fate", "Portugal", "The sea"],
    country: "Portugal",
    language: "Portuguese",
    readingLanguage: "English",
  },
];

function main() {
  let booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  let chaptersContent = fs.readFileSync(CHAPTERS_FILE, "utf-8");
  const existingBookIds = new Set<string>();
  let match: RegExpExecArray | null;
  const bookIdRegex = /id:\s*"([^"]+)"/g;
  while ((match = bookIdRegex.exec(booksContent)) !== null) existingBookIds.add(match[1]);
  const existingChapterIds = new Set<string>();
  const chapterIdRegex = /id:\s*"([^"]+)"/g;
  while ((match = chapterIdRegex.exec(chaptersContent)) !== null) existingChapterIds.add(match[1]);

  let booksAdded = 0, chaptersAdded = 0, booksSkipped = 0;
  const newBookEntries: string[] = [], newChapterEntries: string[] = [];

  for (const config of BOOK_CONFIGS) {
    if (existingBookIds.has(config.id)) { console.log(`  SKIP: ${config.id}`); booksSkipped++; continue; }
    const metaPath = path.join(CONTENT_DIR, config.id, "meta.json");
    if (!fs.existsSync(metaPath)) { console.log(`  SKIP: ${config.id} (no content)`); booksSkipped++; continue; }
    const meta: MetaJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const colors = TRADITION_COLORS[config.tradition] || TRADITION_COLORS["Victorian"];
    const authorId = toAuthorId(config.author);
    const readingTime = formatReadingTime(meta.totalMinutes);

    let e = `  {\n    id: "${config.id}",\n    title: "${config.title.replace(/"/g, '\\"')}",\n`;
    e += `    author: "${config.author.replace(/"/g, '\\"')}",\n    authorId: "${authorId}",\n    year: ${config.year},\n`;
    if (config.language) e += `    language: "${config.language}",\n`;
    if (config.readingLanguage) e += `    readingLanguage: "${config.readingLanguage}",\n`;
    e += `    tradition: "${config.tradition}",\n    era: "${config.era}",\n`;
    e += `    genres: [${config.genres.map(g => `"${g}"`).join(", ")}],\n`;
    e += `    difficulty: "${config.difficulty}",\n    chapters: ${meta.chapterCount},\n`;
    e += `    estimatedReadingTime: "${readingTime}",\n    wordCount: ${meta.totalWordCount},\n`;
    e += `    synopsis: "${config.synopsis.replace(/"/g, '\\"')}",\n`;
    e += `    themes: [${config.themes.map(t => `"${t}"`).join(", ")}],\n`;
    e += `    country: "${config.country}",\n`;
    e += `    coverColors: { primary: "${colors.primary}", secondary: "${colors.secondary}", accent: "${colors.accent}" },\n`;
    e += `    featured: false,\n    source: "standard-ebooks",\n  }`;
    newBookEntries.push(e); booksAdded++;

    for (const ch of meta.chapters) {
      const chId = `${config.id}-ch-${ch.index}`;
      if (existingChapterIds.has(chId)) continue;
      let ce = `  {\n    id: "${chId}",\n    bookId: "${config.id}",\n    number: ${ch.index},\n`;
      ce += `    title: "${ch.title.replace(/"/g, '\\"')}",\n    wordCount: ${ch.wordCount},\n`;
      ce += `    estimatedMinutes: ${ch.estimatedMinutes},\n    summary: "",\n    quizAvailable: false,\n  }`;
      newChapterEntries.push(ce); chaptersAdded++;
    }
  }

  if (newBookEntries.length > 0) {
    const ins = "\n\n  // ── TIER 1 CANONICAL MASTERPIECES (auto-generated) ─────────────────────────\n\n" + newBookEntries.join(",\n") + ",";
    const idx = booksContent.lastIndexOf("];");
    booksContent = booksContent.slice(0, idx) + ins + "\n" + booksContent.slice(idx);
    fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
  }
  if (newChapterEntries.length > 0) {
    const ins = "\n\n  // ── TIER 1 CANONICAL MASTERPIECES (auto-generated) ─────────────────────────\n\n" + newChapterEntries.join(",\n") + ",";
    const idx = chaptersContent.lastIndexOf("]");
    chaptersContent = chaptersContent.slice(0, idx) + ins + "\n" + chaptersContent.slice(idx);
    fs.writeFileSync(CHAPTERS_FILE, chaptersContent, "utf-8");
  }

  console.log(`\n  Books added: ${booksAdded}, Skipped: ${booksSkipped}, Chapters: ${chaptersAdded}`);
}
main();
