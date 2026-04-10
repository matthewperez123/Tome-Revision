#!/usr/bin/env npx tsx
/** add-canonical-books-10.ts — Newly downloaded SE books */
import * as fs from "fs";
import * as path from "path";
const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");
const TC: Record<string,{primary:string;secondary:string;accent:string}> = {
  Victorian:{primary:"#2D1B5E",secondary:"#1E1145",accent:"#8B5CF6"},Russian:{primary:"#5C1A1A",secondary:"#3D1010",accent:"#DC2626"},American:{primary:"#143220",secondary:"#0A1F14",accent:"#22C55E"},French:{primary:"#0A1F3D",secondary:"#061428",accent:"#EC4899"},Modernist:{primary:"#111827",secondary:"#0A0F1A",accent:"#14B8A6"},Romantic:{primary:"#4A0E2D",secondary:"#2D0819",accent:"#F43F5E"},Scandinavian:{primary:"#1E293B",secondary:"#0F172A",accent:"#38BDF8"},
};
interface BC{id:string;title:string;author:string;year:number;tradition:string;era:string;genres:string[];difficulty:"Beginner"|"Intermediate"|"Advanced"|"Scholar";synopsis:string;themes:string[];country:string;language?:string;readingLanguage?:string;}
interface MJ{bookId:string;title:string;author:string;chapterCount:number;totalWordCount:number;totalMinutes:number;chapters:Array<{index:number;title:string;wordCount:number;estimatedMinutes:number}>;}
function toAId(a:string){return a.toLowerCase().replace(/\./g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function frt(m:number){const h=Math.round(m/60);return h<1?`~${m} minutes`:`~${h} hour${h!==1?"s":""}`;}

const BOOKS: BC[] = [
  { id: "ivanhoe", title: "Ivanhoe", author: "Walter Scott", year: 1819, tradition: "Romantic", era: "Romantic", genres: ["Novel", "Historical Fiction", "Romance"], difficulty: "Intermediate", synopsis: "A disinherited Saxon knight fights in tournaments, rescues a Jewish maiden, and joins Robin Hood's outlaws during the reign of Richard the Lionheart, in the novel that invented the medieval historical romance.", themes: ["Chivalry", "England", "Race", "Honor", "Justice", "History"], country: "Scotland" },
  { id: "our-mutual-friend", title: "Our Mutual Friend", author: "Charles Dickens", year: 1865, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel", "Mystery"], difficulty: "Advanced", synopsis: "Dickens's last completed novel weaves money, murder, and the Thames into a vast tapestry of Victorian London, where a dust heap fortune, a faked death, and a network of schemers reveal that everything can be bought and sold.", themes: ["Money", "Death", "London", "Identity", "Class", "Redemption"], country: "England" },
  { id: "uncle-vanya", title: "Uncle Vanya", author: "Anton Chekhov", year: 1899, tradition: "Russian", era: "Victorian", genres: ["Drama", "Tragedy"], difficulty: "Intermediate", synopsis: "A provincial estate manager realizes he has wasted his life supporting a mediocre professor, and his anguish explodes into a botched shooting and a devastating final scene of resigned endurance.", themes: ["Wasted life", "Provincialism", "Love", "Work", "Despair", "Endurance"], country: "Russia", language: "Russian", readingLanguage: "English" },
  { id: "strong-poison", title: "Strong Poison", author: "Dorothy L. Sayers", year: 1930, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Lord Peter Wimsey falls in love with mystery novelist Harriet Vane at her murder trial and has thirty days to prove her innocent before the jury reconvenes — beginning the greatest love story in detective fiction.", themes: ["Murder", "Love", "Justice", "Poison", "Independence", "Wit"], country: "England" },
  { id: "right-ho-jeeves", title: "Right Ho, Jeeves", author: "P. G. Wodehouse", year: 1934, tradition: "Victorian", era: "Modern", genres: ["Novel", "Comedy"], difficulty: "Beginner", synopsis: "Bertie Wooster attempts to sort out the romantic tangles of his friends without Jeeves's help, creating a catastrophic chain of misunderstandings at a country house that only the immortal valet can untangle.", themes: ["Comedy", "Friendship", "Romance", "Wit", "English society", "Incompetence"], country: "England" },
  { id: "poor-folk", title: "Poor Folk", author: "Fyodor Dostoevsky", year: 1846, tradition: "Russian", era: "Victorian", genres: ["Novel", "Epistolary Fiction"], difficulty: "Intermediate", synopsis: "Dostoevsky's debut novel tells the story of a poor copying clerk and his young protégée through their letters, revealing the desperate dignity of poverty in a work that made the young author famous overnight.", themes: ["Poverty", "Dignity", "Love", "Letters", "St. Petersburg", "Compassion"], country: "Russia", language: "Russian", readingLanguage: "English" },
  { id: "the-painted-veil", title: "The Painted Veil", author: "W. Somerset Maugham", year: 1925, tradition: "Modernist", era: "Modern", genres: ["Novel", "Psychological Fiction"], difficulty: "Intermediate", synopsis: "A bacteriologist takes his unfaithful wife to a cholera-ravaged Chinese town as punishment, and the confrontation with death and genuine suffering transforms them both in Maugham's most morally complex novel.", themes: ["Infidelity", "Redemption", "China", "Death", "Love", "Suffering"], country: "England" },
  { id: "the-house-at-pooh-corner", title: "The House at Pooh Corner", author: "A. A. Milne", year: 1928, tradition: "Victorian", era: "Modern", genres: ["Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "Pooh, Piglet, and friends welcome the bouncing Tigger to the Hundred Acre Wood and have further gentle adventures, ending with Christopher Robin's farewell to childhood in one of the most moving passages in English literature.", themes: ["Childhood", "Friendship", "Farewell", "Imagination", "Nature", "Innocence"], country: "England" },
  { id: "the-white-company", title: "The White Company", author: "Arthur Conan Doyle", year: 1891, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Historical Fiction", "Adventure"], difficulty: "Beginner", synopsis: "A young man leaves his abbey to join a company of English archers in the Hundred Years' War, travelling through medieval England, France, and Spain in Doyle's love letter to the age of chivalry.", themes: ["Chivalry", "War", "Adventure", "Medieval", "Honor", "Faith"], country: "England" },
  { id: "the-blacker-the-berry", title: "The Blacker the Berry", author: "Wallace Thurman", year: 1929, tradition: "American", era: "Modern", genres: ["Novel", "Harlem Renaissance"], difficulty: "Intermediate", synopsis: "A dark-skinned Black woman navigates colorism within her own community, from Idaho to Harlem, in the Harlem Renaissance's most unflinching exploration of intraracial prejudice.", themes: ["Colorism", "Race", "Identity", "Harlem", "Self-acceptance", "Prejudice"], country: "USA" },
  { id: "waverley", title: "Waverley", author: "Walter Scott", year: 1814, tradition: "Romantic", era: "Romantic", genres: ["Novel", "Historical Fiction"], difficulty: "Advanced", synopsis: "A young English officer is drawn into the Jacobite Rising of 1745 and torn between loyalty to the Crown and the romantic allure of the Highland cause, in the novel that invented historical fiction.", themes: ["History", "Scotland", "Loyalty", "Romance", "War", "Identity"], country: "Scotland" },
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
    const ins="\n\n  // ── NEW SE DOWNLOADS (auto-generated) ───────────────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── NEW SE DOWNLOADS (auto-generated) ───────────────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`Books: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
