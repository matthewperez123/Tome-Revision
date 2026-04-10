#!/usr/bin/env npx tsx
/** add-canonical-books-6.ts — Australian + African + additional global books */
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
  "Post-Colonial": { primary: "#065F46", secondary: "#034335", accent: "#10B981" },
  "Ancient Greek": { primary: "#1E3A5F", secondary: "#0F2744", accent: "#0EA5E9" },
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
  // ── Australian Literature ──────────────────────────────────────────────────
  {
    id: "my-brilliant-career",
    title: "My Brilliant Career",
    author: "Miles Franklin",
    year: 1901,
    tradition: "Post-Colonial",
    era: "Modern",
    genres: ["Novel", "Coming-of-Age", "Feminist Fiction"],
    difficulty: "Beginner",
    synopsis: "A spirited young woman on a struggling Australian bush farm dreams of a life beyond domesticity, rejecting a wealthy suitor to pursue independence in this pioneering Australian feminist novel.",
    themes: ["Independence", "Australia", "Gender", "Rural life", "Ambition", "Identity"],
    country: "Australia",
  },
  {
    id: "while-the-billy-boils",
    title: "While the Billy Boils",
    author: "Henry Lawson",
    year: 1896,
    tradition: "Post-Colonial",
    era: "Victorian",
    genres: ["Short Stories", "Bush Literature"],
    difficulty: "Beginner",
    synopsis: "Stories of drovers, shearers, and bush workers in the Australian outback, capturing the laconic humor, mateship, and harsh beauty of colonial life with unflinching realism.",
    themes: ["The outback", "Mateship", "Hardship", "Humor", "Bush life", "Australia"],
    country: "Australia",
  },
  {
    id: "the-getting-of-wisdom",
    title: "The Getting of Wisdom",
    author: "Henry Handel Richardson",
    year: 1910,
    tradition: "Post-Colonial",
    era: "Modern",
    genres: ["Novel", "Coming-of-Age", "Autobiographical Fiction"],
    difficulty: "Intermediate",
    synopsis: "A clever, imaginative girl from the bush navigates the snobberies and cruelties of a Melbourne boarding school, learning that wisdom comes at the cost of innocence.",
    themes: ["Education", "Class", "Australia", "Coming of age", "Conformity", "Truth"],
    country: "Australia",
  },
  {
    id: "an-outback-marriage",
    title: "An Outback Marriage",
    author: "Banjo Paterson",
    year: 1906,
    tradition: "Post-Colonial",
    era: "Modern",
    genres: ["Novel", "Adventure", "Bush Literature"],
    difficulty: "Beginner",
    synopsis: "A tale of love, inheritance disputes, and station life in the Australian outback by the poet who wrote Waltzing Matilda and The Man from Snowy River.",
    themes: ["The outback", "Love", "Inheritance", "Adventure", "Australia", "Bush life"],
    country: "Australia",
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
    const ins = "\n\n  // ── AUSTRALIAN & GLOBAL ADDITIONS (auto-generated) ─────────────────────────\n\n" + newBookEntries.join(",\n") + ",";
    const idx = booksContent.lastIndexOf("];");
    booksContent = booksContent.slice(0, idx) + ins + "\n" + booksContent.slice(idx);
    fs.writeFileSync(BOOKS_FILE, booksContent, "utf-8");
  }
  if (newChapterEntries.length > 0) {
    const ins = "\n\n  // ── AUSTRALIAN & GLOBAL ADDITIONS (auto-generated) ─────────────────────────\n\n" + newChapterEntries.join(",\n") + ",";
    const idx = chaptersContent.lastIndexOf("]");
    chaptersContent = chaptersContent.slice(0, idx) + ins + "\n" + chaptersContent.slice(idx);
    fs.writeFileSync(CHAPTERS_FILE, chaptersContent, "utf-8");
  }

  console.log(`  Books added: ${booksAdded}, Skipped: ${booksSkipped}, Chapters: ${chaptersAdded}`);
}
main();
