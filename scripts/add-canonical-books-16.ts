#!/usr/bin/env npx tsx
/** add-canonical-books-16.ts — Major new SE downloads */
import * as fs from "fs";
import * as path from "path";
const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");
const TC: Record<string,{primary:string;secondary:string;accent:string}> = {Victorian:{primary:"#2D1B5E",secondary:"#1E1145",accent:"#8B5CF6"},Russian:{primary:"#5C1A1A",secondary:"#3D1010",accent:"#DC2626"},American:{primary:"#143220",secondary:"#0A1F14",accent:"#22C55E"},French:{primary:"#0A1F3D",secondary:"#061428",accent:"#EC4899"},Modernist:{primary:"#111827",secondary:"#0A0F1A",accent:"#14B8A6"},Germanic:{primary:"#1F2937",secondary:"#111827",accent:"#10B981"},"Medieval European":{primary:"#1B4332",secondary:"#0F2B20",accent:"#F59E0B"},Renaissance:{primary:"#3D1A6E",secondary:"#2A1050",accent:"#D97706"},Scandinavian:{primary:"#1E293B",secondary:"#0F172A",accent:"#38BDF8"},"Post-Colonial":{primary:"#065F46",secondary:"#034335",accent:"#10B981"},Enlightenment:{primary:"#0F2744",secondary:"#091A2E",accent:"#06B6D4"},"Ancient Greek":{primary:"#1E3A5F",secondary:"#0F2744",accent:"#0EA5E9"},Romantic:{primary:"#4A0E2D",secondary:"#2D0819",accent:"#F43F5E"},Eastern:{primary:"#5C2800",secondary:"#3D1A00",accent:"#F97316"},};
interface BC{id:string;title:string;author:string;year:number;tradition:string;era:string;genres:string[];difficulty:"Beginner"|"Intermediate"|"Advanced"|"Scholar";synopsis:string;themes:string[];country:string;language?:string;readingLanguage?:string;}
interface MJ{bookId:string;title:string;author:string;chapterCount:number;totalWordCount:number;totalMinutes:number;chapters:Array<{index:number;title:string;wordCount:number;estimatedMinutes:number}>;}
function toAId(a:string){return a.toLowerCase().replace(/\./g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function frt(m:number){const h=Math.round(m/60);return h<1?`~${m} minutes`:`~${h} hour${h!==1?"s":""}`;}

const BOOKS: BC[] = [
  { id: "metropolis", title: "Metropolis", author: "Thea von Harbou", year: 1925, tradition: "Germanic", era: "Modern", genres: ["Novel", "Science Fiction", "Dystopian Fiction"], difficulty: "Intermediate", synopsis: "In a vast future city where workers toil underground to power the lives of the elite above, a young aristocrat discovers the human cost of utopia and a mad scientist creates a robot that threatens to destroy everything — the novel behind Fritz Lang's legendary film.", themes: ["Class", "Technology", "Dystopia", "Labor", "Love", "Revolution"], country: "Germany", language: "German", readingLanguage: "English" },
  { id: "herland", title: "Herland", author: "Charlotte Perkins Gilman", year: 1915, tradition: "American", era: "Modern", genres: ["Novel", "Utopian Fiction", "Feminist Fiction"], difficulty: "Beginner", synopsis: "Three male explorers discover a hidden country populated entirely by women who have created a peaceful, rational civilization through parthenogenesis — a feminist utopia that exposes the absurdity of patriarchal assumptions.", themes: ["Feminism", "Utopia", "Gender", "Society", "Motherhood", "Education"], country: "USA" },
  { id: "the-devils-dictionary", title: "The Devil's Dictionary", author: "Ambrose Bierce", year: 1911, tradition: "American", era: "Modern", genres: ["Satire", "Reference", "Humor"], difficulty: "Beginner", synopsis: "The most cynical book in American literature redefines the English language with savage wit: 'Admiration: Our polite recognition of another's resemblance to ourselves.' Every entry is a barbed epigram that still draws blood.", themes: ["Satire", "Language", "Cynicism", "Wit", "Human nature", "Definitions"], country: "USA" },
  { id: "the-theory-of-the-leisure-class", title: "The Theory of the Leisure Class", author: "Thorstein Veblen", year: 1899, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Economics", "Sociology"], difficulty: "Advanced", synopsis: "Veblen coins 'conspicuous consumption' and 'conspicuous leisure' to analyze how the wealthy display their status, in a devastating sociological study that reads like satire but was entirely serious.", themes: ["Class", "Consumption", "Status", "Economics", "Waste", "Culture"], country: "USA" },
  { id: "the-lives-and-opinions-of-eminent-philosophers", title: "The Lives and Opinions of Eminent Philosophers", author: "Diogenes Laërtius", year: 230, tradition: "Ancient Greek", era: "Ancient", genres: ["Biography", "Philosophy", "History"], difficulty: "Advanced", synopsis: "The gossipy, encyclopedic biography of eighty-two Greek philosophers from Thales to Epicurus — our primary source for much of ancient philosophy, full of anecdotes, paradoxes, and the kind of detail that makes dead thinkers come alive.", themes: ["Philosophy", "Biography", "Greece", "Wisdom", "Anecdote", "Ideas"], country: "Ancient Greece", language: "Ancient Greek", readingLanguage: "English" },
  { id: "r-u-r", title: "R.U.R.", author: "Karel Čapek", year: 1920, tradition: "Modernist", era: "Modern", genres: ["Drama", "Science Fiction"], difficulty: "Intermediate", synopsis: "The play that gave the world the word 'robot' — a factory produces artificial workers who eventually revolt and exterminate humanity, in a prophetic Czech drama about technology, labor, and what it means to be human.", themes: ["Robots", "Labor", "Revolution", "Humanity", "Technology", "Creation"], country: "Czech Republic", language: "Czech", readingLanguage: "English" },
  { id: "the-secret-history", title: "The Secret History", author: "Procopius", year: 550, tradition: "Ancient Greek", era: "Medieval", genres: ["History", "Exposé"], difficulty: "Intermediate", synopsis: "The Byzantine court historian's secret manuscript savages Emperor Justinian and Empress Theodora with accusations of demonic possession, sexual depravity, and tyranny — the most scandalous tell-all of the ancient world.", themes: ["Power", "Corruption", "Byzantium", "Scandal", "Tyranny", "Secrecy"], country: "Greece", language: "Ancient Greek", readingLanguage: "English" },
  { id: "confessions-of-an-english-opium-eater", title: "Confessions of an English Opium-Eater", author: "Thomas De Quincey", year: 1821, tradition: "Romantic", era: "Romantic", genres: ["Autobiography", "Memoir"], difficulty: "Advanced", synopsis: "De Quincey's rhapsodic, hallucinatory account of opium addiction — its pleasures and its pains — created the modern drug memoir and influenced Poe, Baudelaire, and the entire tradition of psychedelic literature.", themes: ["Addiction", "Dreams", "Pain", "Pleasure", "Memory", "Poverty"], country: "England" },
  { id: "the-wonderful-adventures-of-nils", title: "The Wonderful Adventures of Nils", author: "Selma Lagerlöf", year: 1906, tradition: "Scandinavian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "A naughty boy is shrunk to the size of a thumb and flies across Sweden on the back of a goose, learning geography, natural history, and compassion on a magical journey written by the first woman to win the Nobel Prize in Literature.", themes: ["Sweden", "Nature", "Transformation", "Geography", "Compassion", "Adventure"], country: "Sweden", language: "Swedish", readingLanguage: "English" },
  { id: "saint-joan", title: "Saint Joan", author: "George Bernard Shaw", year: 1923, tradition: "Victorian", era: "Modern", genres: ["Drama", "Historical Fiction"], difficulty: "Intermediate", synopsis: "Shaw portrays Joan of Arc as the first Protestant and the first nationalist, a practical genius destroyed by the institutional forces she threatened — his most serious play and the one that won him the Nobel Prize.", themes: ["Faith", "War", "Martyrdom", "Institution vs. individual", "Nationalism", "Genius"], country: "England" },
  { id: "old-indian-legends", title: "Old Indian Legends", author: "Zitkála-Šá", year: 1901, tradition: "American", era: "Modern", genres: ["Short Stories", "Folklore", "Native American Literature"], difficulty: "Beginner", synopsis: "A Yankton Dakota writer retells the legends of Iktomi the trickster, the prairie animals, and the old ways of her people, preserving Sioux oral tradition in written English for the first time from a Native perspective.", themes: ["Native America", "Folklore", "Trickster", "Nature", "Tradition", "Identity"], country: "USA" },
  { id: "bulfinchs-mythology", title: "Bulfinch's Mythology", author: "Thomas Bulfinch", year: 1855, tradition: "American", era: "Victorian", genres: ["Non-Fiction", "Mythology", "Reference"], difficulty: "Beginner", synopsis: "The most popular retelling of Greek, Roman, and Arthurian mythology in English — the book that has introduced millions of readers to Zeus, Achilles, Thor, and King Arthur for over 150 years.", themes: ["Mythology", "Greece", "Rome", "Heroes", "Gods", "Legend"], country: "USA" },
  { id: "john-browns-body", title: "John Brown's Body", author: "Stephen Vincent Benét", year: 1928, tradition: "American", era: "Modern", genres: ["Epic Poetry", "Historical Fiction"], difficulty: "Advanced", synopsis: "The American Civil War told in epic verse — from John Brown's raid to Appomattox — through the eyes of soldiers, slaves, and civilians North and South, in the Pulitzer Prize-winning poem that is America's Iliad.", themes: ["Civil War", "America", "Slavery", "War", "Freedom", "Sacrifice"], country: "USA" },
  { id: "democracy-and-social-ethics", title: "Democracy and Social Ethics", author: "Jane Addams", year: 1902, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Social Criticism", "Philosophy"], difficulty: "Intermediate", synopsis: "The founder of Hull House argues that democracy requires not just political rights but genuine social engagement across class lines, in the book that established social work as a profession and a philosophy.", themes: ["Democracy", "Ethics", "Social work", "Class", "Community", "Justice"], country: "USA" },
];

function main() {
  let bc = fs.readFileSync(BOOKS_FILE, "utf-8");
  let cc = fs.readFileSync(CHAPTERS_FILE, "utf-8");
  const ebi = new Set<string>(); let m: RegExpExecArray|null;
  const br = /id:\s*"([^"]+)"/g; while((m=br.exec(bc))!==null) ebi.add(m[1]);
  const eci = new Set<string>(); const cr = /id:\s*"([^"]+)"/g; while((m=cr.exec(cc))!==null) eci.add(m[1]);
  let ba=0,ca=0,bs=0; const nbe:string[]=[],nce:string[]=[];
  for(const c of BOOKS){
    if(ebi.has(c.id)){bs++;continue;}
    const mp=path.join(CONTENT_DIR,c.id,"meta.json");
    if(!fs.existsSync(mp)){console.log("SKIP: "+c.id);bs++;continue;}
    const meta:MJ=JSON.parse(fs.readFileSync(mp,"utf-8"));
    const co=TC[c.tradition]||TC["Victorian"];const ai=toAId(c.author);const rt=frt(meta.totalMinutes);
    let e=`  {\n    id: "${c.id}",\n    title: "${c.title.replace(/"/g,'\\"')}",\n`;
    e+=`    author: "${c.author.replace(/"/g,'\\"')}",\n    authorId: "${ai}",\n    year: ${c.year},\n`;
    if(c.language) e+=`    language: "${c.language}",\n`;
    if(c.readingLanguage) e+=`    readingLanguage: "${c.readingLanguage}",\n`;
    e+=`    tradition: "${c.tradition}",\n    era: "${c.era}",\n`;
    e+=`    genres: [${c.genres.map(g=>`"${g}"`).join(", ")}],\n`;
    e+=`    difficulty: "${c.difficulty}",\n    chapters: ${meta.chapterCount},\n`;
    e+=`    estimatedReadingTime: "${rt}",\n    wordCount: ${meta.totalWordCount},\n`;
    e+=`    synopsis: "${c.synopsis.replace(/"/g,'\\"')}",\n`;
    e+=`    themes: [${c.themes.map(t=>`"${t}"`).join(", ")}],\n`;
    e+=`    country: "${c.country}",\n`;
    e+=`    coverColors: { primary: "${co.primary}", secondary: "${co.secondary}", accent: "${co.accent}" },\n`;
    e+=`    featured: false,\n    source: "standard-ebooks",\n  }`;
    nbe.push(e);ba++;
    for(const ch of meta.chapters){
      const ci=`${c.id}-ch-${ch.index}`;if(eci.has(ci))continue;
      let ce=`  {\n    id: "${ci}",\n    bookId: "${c.id}",\n    number: ${ch.index},\n`;
      ce+=`    title: "${ch.title.replace(/"/g,'\\"')}",\n    wordCount: ${ch.wordCount},\n`;
      ce+=`    estimatedMinutes: ${ch.estimatedMinutes},\n    summary: "",\n    quizAvailable: false,\n  }`;
      nce.push(ce);ca++;
    }
  }
  if(nbe.length>0){
    const ins="\n\n  // ── MAJOR NEW SE DOWNLOADS (auto-generated) ────────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── MAJOR NEW SE DOWNLOADS (auto-generated) ────────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`\nBooks: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
