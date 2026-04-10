#!/usr/bin/env npx tsx
/**
 * add-canonical-books-5.ts — Adds newly downloaded Standard Ebooks titles.
 */
import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");

const TRADITION_COLORS: Record<string, { primary: string; secondary: string; accent: string }> = {
  Victorian: { primary: "#2D1B5E", secondary: "#1E1145", accent: "#8B5CF6" },
  American: { primary: "#143220", secondary: "#0A1F14", accent: "#22C55E" },
  Modernist: { primary: "#111827", secondary: "#0A0F1A", accent: "#14B8A6" },
  Enlightenment: { primary: "#0F2744", secondary: "#091A2E", accent: "#06B6D4" },
  "Ancient Greek": { primary: "#1E3A5F", secondary: "#0F2744", accent: "#0EA5E9" },
  Renaissance: { primary: "#3D1A6E", secondary: "#2A1050", accent: "#D97706" },
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

function toAuthorId(author: string): string {
  return author.toLowerCase().replace(/\./g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function formatReadingTime(minutes: number): string {
  const hours = Math.round(minutes / 60);
  if (hours < 1) return `~${minutes} minutes`;
  return `~${hours} hour${hours !== 1 ? "s" : ""}`;
}

const BOOK_CONFIGS: BookConfig[] = [
  {
    id: "the-consolation-of-philosophy",
    title: "The Consolation of Philosophy",
    author: "Boethius",
    year: 524,
    tradition: "Ancient Greek",
    era: "Medieval",
    genres: ["Philosophy", "Dialogue", "Poetry"],
    difficulty: "Advanced",
    synopsis: "Awaiting execution, the Roman statesman Boethius converses with Lady Philosophy about fate, free will, and happiness — a work that shaped a thousand years of Western thought.",
    themes: ["Fortune", "Philosophy", "Consolation", "Fate", "Free will", "Happiness"],
    country: "Roman Empire",
    language: "Latin",
    readingLanguage: "English",
  },
  {
    id: "thoreau-essays",
    title: "Essays",
    author: "Henry David Thoreau",
    year: 1849,
    tradition: "American",
    era: "Romantic",
    genres: ["Essays", "Philosophy"],
    difficulty: "Intermediate",
    synopsis: "Thoreau's collected essays including Civil Disobedience, Walking, and Life Without Principle — foundational texts of American individualism and the philosophy of nonviolent resistance.",
    themes: ["Civil disobedience", "Nature", "Individualism", "Simplicity", "Freedom", "Conscience"],
    country: "USA",
  },
  {
    id: "the-education-of-henry-adams",
    title: "The Education of Henry Adams",
    author: "Henry Adams",
    year: 1918,
    tradition: "American",
    era: "Modern",
    genres: ["Autobiography", "Philosophy"],
    difficulty: "Advanced",
    synopsis: "The descendant of two presidents writes his own education in the third person, tracing his bewilderment before the accelerating forces of modernity from the Civil War to the dynamo.",
    themes: ["Education", "Modernity", "Power", "History", "American identity", "Change"],
    country: "USA",
  },
  {
    id: "sister-carrie",
    title: "Sister Carrie",
    author: "Theodore Dreiser",
    year: 1900,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Naturalism"],
    difficulty: "Intermediate",
    synopsis: "A young country girl comes to Chicago, becomes a kept woman, then an actress, while the man who supported her descends into poverty — a groundbreaking naturalist portrait of desire and urban America.",
    themes: ["Desire", "Urban life", "Class", "Materialism", "Fate", "Success"],
    country: "USA",
  },
  {
    id: "an-american-tragedy",
    title: "An American Tragedy",
    author: "Theodore Dreiser",
    year: 1925,
    tradition: "American",
    era: "Modern",
    genres: ["Novel", "Naturalism", "Crime Fiction"],
    difficulty: "Advanced",
    synopsis: "A poor young man's desperate ambition leads him to murder the pregnant girlfriend who stands between him and the wealthy society he craves, in Dreiser's devastating anatomy of the American Dream.",
    themes: ["Ambition", "Class", "Murder", "The American Dream", "Justice", "Determinism"],
    country: "USA",
  },
];

function main() {
  let booksContent = fs.readFileSync(BOOKS_FILE, "utf-8");
  let chaptersContent = fs.readFileSync(CHAPTERS_FILE, "utf-8");

  const existingBookIds = new Set<string>();
  const bookIdRegex = /id:\s*"([^"]+)"/g;
  let match: RegExpExecArray | null;
  while ((match = bookIdRegex.exec(booksContent)) !== null) existingBookIds.add(match[1]);

  const existingChapterIds = new Set<string>();
  const chapterIdRegex = /id:\s*"([^"]+)"/g;
  while ((match = chapterIdRegex.exec(chaptersContent)) !== null) existingChapterIds.add(match[1]);

  let booksAdded = 0, chaptersAdded = 0, booksSkipped = 0;
  const newBookEntries: string[] = [];
  const newChapterEntries: string[] = [];

  for (const config of BOOK_CONFIGS) {
    if (existingBookIds.has(config.id)) { booksSkipped++; continue; }
    const metaPath = path.join(CONTENT_DIR, config.id, "meta.json");
    if (!fs.existsSync(metaPath)) { console.log(`  SKIP: ${config.id} (no content)`); booksSkipped++; continue; }

    const meta: MetaJson = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    const colors = TRADITION_COLORS[config.tradition] || TRADITION_COLORS["Victorian"];
    const authorId = toAuthorId(config.author);
    const readingTime = formatReadingTime(meta.totalMinutes);

    let e = `  {\n    id: "${config.id}",\n    title: "${config.title.replace(/"/g, '\\"')}",\n`;
    e += `    author: "${config.author}",\n    authorId: "${authorId}",\n    year: ${config.year},\n`;
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
    newBookEntries.push(e);
    booksAdded++;

    for (const ch of meta.chapters) {
      const chId = `${config.id}-ch-${ch.index}`;
      if (existingChapterIds.has(chId)) continue;
      let ce = `  {\n    id: "${chId}",\n    bookId: "${config.id}",\n    number: ${ch.index},\n`;
      ce += `    title: "${ch.title.replace(/"/g, '\\"')}",\n    wordCount: ${ch.wordCount},\n`;
      ce += `    estimatedMinutes: ${ch.estimatedMinutes},\n    summary: "",\n    quizAvailable: false,\n  }`;
      newChapterEntries.push(ce);
      chaptersAdded++;
    }
  }

  if (newBookEntries.length > 0) {
    const ins = "\n\n  // ── STANDARD EBOOKS DOWNLOADS (auto-generated) ─────────────────────────────\n\n" + newBookEntries.join(",\n") + ",";
    const idx = booksContent.lastIndexOf("];");
    booksContent = booksContent.slice(0, idx) + ins + "\n" + booksContent.slice(idx);
    fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
  }
  if (newChapterEntries.length > 0) {
    const ins = "\n\n  // ── STANDARD EBOOKS DOWNLOADS (auto-generated) ─────────────────────────────\n\n" + newChapterEntries.join(",\n") + ",";
    const idx = chaptersContent.lastIndexOf("]");
    chaptersContent = chaptersContent.slice(0, idx) + ins + "\n" + chaptersContent.slice(idx);
    fs.writeFileSync(CHAPTERS_FILE, chaptersContent, "utf-8");
  }

  console.log(`\n  Books added: ${booksAdded}, Skipped: ${booksSkipped}, Chapters: ${chaptersAdded}`);
}

main();
