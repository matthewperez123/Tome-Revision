#!/usr/bin/env npx tsx
/** add-canonical-books-8.ts — Tier 2 canonical additions */
import * as fs from "fs";
import * as path from "path";
const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");
const TC: Record<string,{primary:string;secondary:string;accent:string}> = {
  Victorian:{primary:"#2D1B5E",secondary:"#1E1145",accent:"#8B5CF6"},Russian:{primary:"#5C1A1A",secondary:"#3D1010",accent:"#DC2626"},American:{primary:"#143220",secondary:"#0A1F14",accent:"#22C55E"},French:{primary:"#0A1F3D",secondary:"#061428",accent:"#EC4899"},Modernist:{primary:"#111827",secondary:"#0A0F1A",accent:"#14B8A6"},Germanic:{primary:"#1F2937",secondary:"#111827",accent:"#10B981"},"Medieval European":{primary:"#1B4332",secondary:"#0F2B20",accent:"#F59E0B"},Renaissance:{primary:"#3D1A6E",secondary:"#2A1050",accent:"#D97706"},Scandinavian:{primary:"#1E293B",secondary:"#0F172A",accent:"#38BDF8"},"Post-Colonial":{primary:"#065F46",secondary:"#034335",accent:"#10B981"},Enlightenment:{primary:"#0F2744",secondary:"#091A2E",accent:"#06B6D4"},
};
interface BC{id:string;title:string;author:string;year:number;tradition:string;era:string;genres:string[];difficulty:"Beginner"|"Intermediate"|"Advanced"|"Scholar";synopsis:string;themes:string[];country:string;language?:string;readingLanguage?:string;}
interface MJ{bookId:string;title:string;author:string;chapterCount:number;totalWordCount:number;totalMinutes:number;chapters:Array<{index:number;title:string;wordCount:number;estimatedMinutes:number}>;}
function toAId(a:string){return a.toLowerCase().replace(/\./g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function frt(m:number){const h=Math.round(m/60);return h<1?`~${m} minutes`:`~${h} hour${h!==1?"s":""}`;}

const BOOKS: BC[] = [
  { id: "barnaby-rudge", title: "Barnaby Rudge", author: "Charles Dickens", year: 1841, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Historical Fiction"], difficulty: "Intermediate", synopsis: "Dickens weaves a tale of the Gordon Riots of 1780, following a simple-minded youth and his pet raven through a London consumed by anti-Catholic mob violence, religious bigotry, and personal revenge.", themes: ["Riot", "Religion", "Injustice", "Madness", "London", "Violence"], country: "England" },
  { id: "the-murder-at-the-vicarage", title: "The Murder at the Vicarage", author: "Agatha Christie", year: 1930, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "The despised Colonel Protheroe is found dead in the vicar's study, and the quiet village of St. Mary Mead reveals an astonishing web of secrets — introducing the world to Miss Jane Marple, literature's shrewdest amateur detective.", themes: ["Murder", "Village life", "Observation", "Deception", "Justice", "Gossip"], country: "England" },
  { id: "cakes-and-ale", title: "Cakes and Ale", author: "W. Somerset Maugham", year: 1930, tradition: "Modernist", era: "Modern", genres: ["Novel", "Satire", "Comedy"], difficulty: "Intermediate", synopsis: "A writer recalls his friendship with a great novelist and the novelist's first wife — a barmaid of irresistible warmth and freedom — in Maugham's finest novel, a wicked satire on literary reputation and English hypocrisy.", themes: ["Art", "Hypocrisy", "Freedom", "Memory", "Class", "Authenticity"], country: "England" },
  { id: "the-varieties-of-religious-experience", title: "The Varieties of Religious Experience", author: "William James", year: 1902, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Philosophy", "Psychology"], difficulty: "Advanced", synopsis: "William James examines mystical states, conversion, saintliness, and the sick soul with the tools of empirical psychology, producing the most influential study of religious consciousness ever written.", themes: ["Religion", "Psychology", "Mysticism", "Consciousness", "Pragmatism", "Experience"], country: "USA" },
  { id: "home-to-harlem", title: "Home to Harlem", author: "Claude McKay", year: 1928, tradition: "American", era: "Modern", genres: ["Novel", "Harlem Renaissance"], difficulty: "Intermediate", synopsis: "A Black soldier returns from World War I to the jazz clubs, rent parties, and vibrant street life of 1920s Harlem, searching for the woman he loved for one night, in the first bestselling novel by a Black author.", themes: ["Harlem", "Race", "Jazz", "Love", "Identity", "America"], country: "Jamaica" },
  { id: "maria", title: "María", author: "Jorge Isaacs", year: 1867, tradition: "Romantic", era: "Victorian", genres: ["Novel", "Romance"], difficulty: "Intermediate", synopsis: "A young Colombian landowner falls deeply in love with his cousin María, but fate, family duty, and tropical illness conspire against them in the most famous and beloved romantic novel of 19th-century Latin America.", themes: ["Love", "Loss", "Nature", "Colombia", "Fate", "Youth"], country: "Colombia", language: "Spanish", readingLanguage: "English" },
  { id: "three-men-in-a-boat", title: "Three Men in a Boat", author: "Jerome K. Jerome", year: 1889, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Comedy", "Travel Writing"], difficulty: "Beginner", synopsis: "Three hypochondriac friends and a fox terrier embark on a Thames boating holiday, encountering every possible comic disaster in what remains the funniest English novel about doing absolutely nothing.", themes: ["Humor", "Friendship", "England", "Travel", "Leisure", "Absurdity"], country: "England" },
  { id: "jeeves-stories", title: "Jeeves Stories", author: "P. G. Wodehouse", year: 1919, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Comedy"], difficulty: "Beginner", synopsis: "The hapless Bertie Wooster stumbles from one social catastrophe to the next while his imperturbable valet Jeeves engineers elegant solutions, in the most perfectly crafted comic prose in the English language.", themes: ["Comedy", "Class", "Wit", "Friendship", "English society", "Ingenuity"], country: "England" },
  { id: "back-to-methuselah", title: "Back to Methuselah", author: "George Bernard Shaw", year: 1921, tradition: "Victorian", era: "Modern", genres: ["Drama", "Science Fiction", "Philosophy"], difficulty: "Advanced", synopsis: "Shaw's most ambitious work spans from the Garden of Eden to 31,920 AD in five linked plays arguing that humanity must evolve longer lifespans to develop the wisdom needed to govern itself.", themes: ["Evolution", "Longevity", "Politics", "Philosophy", "Progress", "Human nature"], country: "England" },
  { id: "the-story-of-doctor-dolittle", title: "The Story of Doctor Dolittle", author: "Hugh Lofting", year: 1920, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "A kindly country doctor learns to speak the languages of animals and embarks on a voyage to Africa to cure a monkey plague, in the charming origin story of literature's most beloved veterinarian.", themes: ["Animals", "Language", "Kindness", "Adventure", "Medicine", "Friendship"], country: "England" },
  { id: "swallows-and-amazons", title: "Swallows and Amazons", author: "Arthur Ransome", year: 1930, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Adventure"], difficulty: "Beginner", synopsis: "Four children sail to an island on an English lake for a summer of camping, exploring, and playing pirates — a celebration of childhood freedom and imagination that has enchanted readers for nearly a century.", themes: ["Adventure", "Childhood", "Nature", "Imagination", "Sailing", "Freedom"], country: "England" },
  { id: "the-life-of-lazarillo-de-tormes", title: "The Life of Lazarillo de Tormes", author: "Anonymous", year: 1554, tradition: "Renaissance", era: "Renaissance", genres: ["Novel", "Picaresque"], difficulty: "Intermediate", synopsis: "A street-smart orphan serves a succession of masters — a blind beggar, a miserly priest, a starving nobleman — in the anonymous Spanish novella that invented the picaresque genre and influenced every rogue's tale since.", themes: ["Survival", "Satire", "Class", "Hunger", "Wit", "Hypocrisy"], country: "Spain", language: "Spanish", readingLanguage: "English" },
  { id: "jenny", title: "Jenny", author: "Sigrid Undset", year: 1911, tradition: "Scandinavian", era: "Modern", genres: ["Novel", "Psychological Fiction"], difficulty: "Intermediate", synopsis: "A young Norwegian painter in Rome struggles with art, love, and the expectations of womanhood in an unflinching psychological portrait by the Nobel laureate who would later write Kristin Lavransdatter.", themes: ["Art", "Love", "Women's lives", "Italy", "Independence", "Tragedy"], country: "Norway", language: "Norwegian", readingLanguage: "English" },
  { id: "the-four-feathers", title: "The Four Feathers", author: "A. E. W. Mason", year: 1902, tradition: "Victorian", era: "Modern", genres: ["Novel", "Adventure", "War Fiction"], difficulty: "Beginner", synopsis: "A young officer resigns his commission on the eve of the Sudan campaign and receives four white feathers of cowardice — then spends years in disguise in the desert, performing acts of extraordinary bravery to redeem his honor.", themes: ["Courage", "Honor", "Redemption", "War", "Empire", "Love"], country: "England" },
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
    const ins="\n\n  // ── TIER 2 CANONICAL ADDITIONS (auto-generated) ────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── TIER 2 CANONICAL ADDITIONS (auto-generated) ────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`Books: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
