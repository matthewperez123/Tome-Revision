#!/usr/bin/env npx tsx
/** add-canonical-books-14.ts — Final massive expansion */
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
  // ── Major Classics ─────────────────────────────────────────────────────────
  { id: "utopia", title: "Utopia", author: "Thomas More", year: 1516, tradition: "Renaissance", era: "Renaissance", genres: ["Novel", "Political Philosophy", "Utopian Fiction"], difficulty: "Intermediate", synopsis: "A traveler describes an ideal island society where property is communal, education universal, and religious tolerance the law — the book that gave us the word 'utopia' and launched five centuries of imagining better worlds.", themes: ["Utopia", "Politics", "Property", "Education", "Justice", "Satire"], country: "England", language: "Latin", readingLanguage: "English" },
  { id: "the-imitation-of-christ", title: "The Imitation of Christ", author: "Thomas à Kempis", year: 1427, tradition: "Medieval European", era: "Medieval", genres: ["Devotional", "Philosophy", "Spirituality"], difficulty: "Intermediate", synopsis: "The most widely read Christian devotional work after the Bible, offering guidance on the spiritual life through humility, detachment from worldly things, and the imitation of Christ's example.", themes: ["Faith", "Humility", "Devotion", "Spiritual life", "Detachment", "Christ"], country: "Germany", language: "Latin", readingLanguage: "English" },
  { id: "the-book-of-tea", title: "The Book of Tea", author: "Okakura Kakuzō", year: 1906, tradition: "Eastern", era: "Modern", genres: ["Non-Fiction", "Philosophy", "Art"], difficulty: "Beginner", synopsis: "A Japanese art scholar explains the philosophy of the tea ceremony as a way of understanding Japanese aesthetics, Zen Buddhism, and the art of living — a bridge between Eastern and Western sensibility.", themes: ["Tea", "Aesthetics", "Japan", "Zen", "Beauty", "Simplicity"], country: "Japan" },
  { id: "the-mystery-of-the-yellow-room", title: "The Mystery of the Yellow Room", author: "Gaston Leroux", year: 1907, tradition: "French", era: "Modern", genres: ["Novel", "Mystery", "Locked Room Mystery"], difficulty: "Beginner", synopsis: "A woman is attacked in a hermetically sealed room with no way in or out — the impossible crime that launched the locked-room mystery genre, by the author of Phantom of the Opera.", themes: ["Mystery", "Impossible crime", "Logic", "Detection", "Paris", "Ingenuity"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-black-tulip", title: "The Black Tulip", author: "Alexandre Dumas", year: 1850, tradition: "French", era: "Romantic", genres: ["Novel", "Historical Fiction", "Romance"], difficulty: "Beginner", synopsis: "During the political turmoil of 17th-century Holland, a young botanist is imprisoned on false charges while desperately trying to grow the world's first black tulip — and falls in love with his jailer's daughter.", themes: ["Love", "Botany", "Injustice", "Holland", "Obsession", "Beauty"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-revolt-of-the-angels", title: "The Revolt of the Angels", author: "Anatole France", year: 1914, tradition: "French", era: "Modern", genres: ["Novel", "Satire", "Fantasy"], difficulty: "Intermediate", synopsis: "Guardian angels in Paris decide to rebel against God, but their revolution is complicated by the pleasures of human life — wine, love, and philosophy — in Anatole France's most wickedly funny satire.", themes: ["Religion", "Satire", "Angels", "Paris", "Philosophy", "Rebellion"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-autobiography-of-john-stuart-mill", title: "The Autobiography of John Stuart Mill", author: "John Stuart Mill", year: 1873, tradition: "Victorian", era: "Victorian", genres: ["Autobiography"], difficulty: "Intermediate", synopsis: "Mill recounts his extraordinary education (Greek at three, logic at twelve), his devastating mental crisis at twenty, and his intellectual partnership with Harriet Taylor in one of the great Victorian autobiographies.", themes: ["Education", "Crisis", "Recovery", "Intellect", "Love", "Liberty"], country: "England" },
  { id: "nightmare-abbey", title: "Nightmare Abbey", author: "Thomas Love Peacock", year: 1818, tradition: "Romantic", era: "Romantic", genres: ["Novel", "Satire", "Comedy"], difficulty: "Intermediate", synopsis: "A gloomy young man torn between two women and addicted to German Romanticism and revolutionary politics provides Peacock with a perfect target for satire — the characters are thinly veiled portraits of Shelley, Byron, and Coleridge.", themes: ["Romanticism", "Satire", "Love", "Gloom", "Philosophy", "Comedy"], country: "England" },
  { id: "vathek", title: "Vathek", author: "William Beckford", year: 1786, tradition: "Romantic", era: "Enlightenment", genres: ["Novel", "Gothic Fiction", "Oriental Fantasy"], difficulty: "Intermediate", synopsis: "An Arabian caliph sells his soul for supernatural power and journeys to the subterranean palace of Eblis, in the first great Oriental Gothic novel — written by a twenty-one-year-old millionaire in a single sitting.", themes: ["Damnation", "Power", "The Orient", "Excess", "Beauty", "Horror"], country: "England" },
  { id: "ragged-dick", title: "Ragged Dick", author: "Horatio Alger Jr.", year: 1868, tradition: "American", era: "Victorian", genres: ["Novel", "Children's Literature"], difficulty: "Beginner", synopsis: "A New York bootblack rises from poverty through honesty, hard work, and luck in the novel that defined the American rags-to-riches myth and sold millions of copies to young readers for half a century.", themes: ["Self-improvement", "Poverty", "New York", "Honesty", "The American Dream", "Youth"], country: "USA" },
  { id: "the-water-babies", title: "The Water-Babies", author: "Charles Kingsley", year: 1863, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "A chimney sweep drowns and is transformed into a water-baby in an underwater fairy tale that combines Victorian social criticism with wild fantasy, satire on evolution, and genuine moral imagination.", themes: ["Transformation", "Social justice", "Fantasy", "Evolution", "Childhood", "Water"], country: "England" },
  { id: "whats-wrong-with-the-world", title: "What's Wrong with the World", author: "G. K. Chesterton", year: 1910, tradition: "Victorian", era: "Modern", genres: ["Non-Fiction", "Social Criticism", "Philosophy"], difficulty: "Intermediate", synopsis: "Chesterton diagnoses modernity's central error — starting from what we can do rather than what we should want — and argues that the family, private property, and human dignity are the foundations of a just society.", themes: ["Society", "Family", "Property", "Modernity", "Justice", "Common sense"], country: "England" },

  // ── Graham Greene's debut ──────────────────────────────────────────────────
  { id: "the-man-within", title: "The Man Within", author: "Graham Greene", year: 1929, tradition: "Modernist", era: "Modern", genres: ["Novel", "Thriller"], difficulty: "Intermediate", synopsis: "A young smuggler betrays his gang and takes refuge with a courageous woman, but cannot escape his own cowardice in Graham Greene's first published novel — already showing the Catholic moral imagination that would define his career.", themes: ["Betrayal", "Cowardice", "Courage", "Guilt", "Love", "Moral struggle"], country: "England" },

  // ── Alexandre Dumas ────────────────────────────────────────────────────────
  { id: "the-black-tulip", title: "The Black Tulip", author: "Alexandre Dumas", year: 1850, tradition: "French", era: "Romantic", genres: ["Novel", "Historical Fiction", "Romance"], difficulty: "Beginner", synopsis: "A tulip grower in 17th-century Holland is falsely imprisoned during political upheaval and must grow the elusive black tulip from his cell, aided by his jailer's beautiful daughter.", themes: ["Botany", "Love", "Injustice", "Holland", "Obsession", "Perseverance"], country: "France", language: "French", readingLanguage: "English" },

  // ── Winston Churchill ──────────────────────────────────────────────────────
  { id: "savrola", title: "Savrola", author: "Winston Churchill", year: 1900, tradition: "Victorian", era: "Modern", genres: ["Novel", "Political Fiction"], difficulty: "Beginner", synopsis: "Churchill's only novel follows a charismatic revolutionary in a fictional Mediterranean republic, revealing the future Prime Minister's early fascination with the psychology of leadership and the romance of political struggle.", themes: ["Revolution", "Leadership", "Love", "Politics", "Courage", "Oratory"], country: "England" },

  // ── Wired Love (early tech romance) ────────────────────────────────────────
  { id: "wired-love", title: "Wired Love", author: "Ella Cheever Thayer", year: 1879, tradition: "American", era: "Victorian", genres: ["Novel", "Romance", "Comedy"], difficulty: "Beginner", synopsis: "Two telegraph operators fall in love over the wire without meeting, then must navigate the comic complications of meeting in person — the first novel about online romance, written 120 years before the internet.", themes: ["Technology", "Romance", "Communication", "Identity", "Humor", "Modernity"], country: "USA" },

  // ── Dashiell Hammett (completing) ──────────────────────────────────────────
  { id: "the-dain-curse", title: "The Dain Curse", author: "Dashiell Hammett", year: 1929, tradition: "American", era: "Modern", genres: ["Novel", "Mystery", "Hard-Boiled Fiction"], difficulty: "Intermediate", synopsis: "The Continental Op investigates a family curse that seems to bring murder, madness, and morphine addiction to everyone it touches, in Hammett's most baroque and atmospheric detective novel.", themes: ["Curse", "Addiction", "Murder", "Detection", "San Francisco", "Madness"], country: "USA" },

  // ── Pollyanna sequel ───────────────────────────────────────────────────────
  { id: "pollyanna-grows-up", title: "Pollyanna Grows Up", author: "Eleanor H. Porter", year: 1915, tradition: "American", era: "Modern", genres: ["Novel", "Children's Literature"], difficulty: "Beginner", synopsis: "Pollyanna returns as a young woman navigating Boston society, romance, and the challenge of maintaining her optimism in the face of adult problems that the glad game cannot simply solve.", themes: ["Optimism", "Growth", "Love", "Society", "Maturity", "Kindness"], country: "USA" },

  // ── Black Hawk ─────────────────────────────────────────────────────────────
  { id: "the-autobiography-of-ma-ka-tai-me-she-kia-kiak-or-black-hawk", title: "Autobiography of Black Hawk", author: "Black Hawk", year: 1833, tradition: "American", era: "Romantic", genres: ["Autobiography"], difficulty: "Beginner", synopsis: "The Sauk war chief dictates his life story — from peaceful childhood through the dispossession of his people to the devastating Black Hawk War — the first autobiography by a Native American leader.", themes: ["Native America", "Dispossession", "War", "Leadership", "Justice", "Memory"], country: "USA" },

  // ── The Land of Little Rain ────────────────────────────────────────────────
  { id: "the-land-of-little-rain", title: "The Land of Little Rain", author: "Mary Austin", year: 1903, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Nature Writing"], difficulty: "Beginner", synopsis: "Austin's prose poems about the California desert — its plants, animals, water, and indigenous peoples — established the American Southwest as a literary landscape and influenced a century of nature writing.", themes: ["Desert", "Nature", "California", "Water", "Indigenous people", "Beauty"], country: "USA" },

  // ── Margaret Oliphant (completing) ─────────────────────────────────────────
  { id: "the-perpetual-curate", title: "The Perpetual Curate", author: "Margaret Oliphant", year: 1864, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "Three brothers choose different religious paths — Anglican, Catholic, Dissenting — while the youngest faces scandal and suspicion in Oliphant's most intricate Carlingford chronicle.", themes: ["Religion", "Family", "Scandal", "Provincial life", "Duty", "Faith"], country: "England" },

  // ── Parnassus on Wheels ────────────────────────────────────────────────────
  { id: "parnassus-on-wheels", title: "Parnassus on Wheels", author: "Christopher Morley", year: 1917, tradition: "American", era: "Modern", genres: ["Novel", "Comedy"], difficulty: "Beginner", synopsis: "A farmer's sister impulsively buys a traveling bookshop and drives it through the New England countryside, discovering love, literature, and independence in one of the most charming novels about the joy of books.", themes: ["Books", "Independence", "Love", "Adventure", "Rural life", "Joy"], country: "USA" },

  // ── The Little White Bird (Peter Pan origin) ───────────────────────────────
  { id: "the-little-white-bird", title: "The Little White Bird", author: "J. M. Barrie", year: 1902, tradition: "Victorian", era: "Modern", genres: ["Novel", "Fantasy"], difficulty: "Intermediate", synopsis: "The novel that first introduced Peter Pan — a lonely bachelor tells fairy tales about Kensington Gardens to a small boy, and in the central chapters, Peter Pan appears as a baby who flies away to live with the birds.", themes: ["Childhood", "Fantasy", "Loneliness", "London", "Imagination", "Peter Pan"], country: "Scotland" },

  // ── Oliver La Farge ────────────────────────────────────────────────────────
  { id: "laughing-boy", title: "Laughing Boy", author: "Oliver La Farge", year: 1929, tradition: "American", era: "Modern", genres: ["Novel", "Romance"], difficulty: "Intermediate", synopsis: "A Navajo silversmith falls in love with a woman caught between traditional and white worlds, in the Pulitzer Prize-winning novel that was the first serious literary portrayal of Native American life from a sympathetic perspective.", themes: ["Native America", "Love", "Tradition", "Cultural conflict", "Beauty", "Loss"], country: "USA" },

  // ── Noël Coward ────────────────────────────────────────────────────────────
  { id: "the-vortex", title: "The Vortex", author: "Noël Coward", year: 1924, tradition: "Modernist", era: "Modern", genres: ["Drama"], difficulty: "Beginner", synopsis: "A young man addicted to drugs confronts his mother about her string of younger lovers in the play that made Coward famous at twenty-four and scandalized London with its frank treatment of addiction and sexuality.", themes: ["Addiction", "Motherhood", "Decadence", "Youth", "Confrontation", "Society"], country: "England" },

  // ── Langston Hughes & Zora Neale Hurston ───────────────────────────────────
  { id: "the-mule-bone", title: "Mule Bone", author: "Langston Hughes & Zora Neale Hurston", year: 1930, tradition: "American", era: "Modern", genres: ["Drama", "Comedy"], difficulty: "Beginner", synopsis: "Two best friends in an all-Black Florida town fight over the same woman, and the dispute escalates to a church trial in this folk comedy by two giants of the Harlem Renaissance — lost for sixty years before its rediscovery.", themes: ["Friendship", "Love", "Community", "Folk humor", "Black life", "Rivalry"], country: "USA" },

  // ── Ford Madox Ford (completing) ───────────────────────────────────────────
  { id: "the-fifth-queen", title: "The Fifth Queen", author: "Ford Madox Ford", year: 1906, tradition: "Modernist", era: "Modern", genres: ["Novel", "Historical Fiction"], difficulty: "Advanced", synopsis: "Katherine Howard arrives at Henry VIII's corrupt court and her intelligence, Catholic faith, and beauty attract the king, in Ford's magnificent Tudor trilogy that Joseph Conrad called the finest historical novels in English.", themes: ["Power", "Religion", "Tudor", "Love", "Corruption", "Integrity"], country: "England" },

  // ── John Locke ─────────────────────────────────────────────────────────────
  { id: "some-thoughts-concerning-education", title: "Some Thoughts Concerning Education", author: "John Locke", year: 1693, tradition: "Enlightenment", era: "Enlightenment", genres: ["Non-Fiction", "Education", "Philosophy"], difficulty: "Intermediate", synopsis: "Locke argues that a child's mind is a blank slate and that education through reason, habit, and example rather than rote learning and punishment is the key to forming a virtuous, rational citizen.", themes: ["Education", "Childhood", "Reason", "Virtue", "Method", "Liberty"], country: "England" },

  // ── John Stuart Mill ───────────────────────────────────────────────────────
  { id: "the-autobiography-of-john-stuart-mill", title: "Autobiography", author: "John Stuart Mill", year: 1873, tradition: "Victorian", era: "Victorian", genres: ["Autobiography"], difficulty: "Intermediate", synopsis: "The philosopher recounts his astonishing education, his mental crisis, his recovery through Wordsworth's poetry, and his transformative relationship with Harriet Taylor.", themes: ["Education", "Crisis", "Philosophy", "Love", "Recovery", "Intellect"], country: "England" },

  // ── Unto This Last (Ruskin) ────────────────────────────────────────────────
  { id: "unto-this-last", title: "Unto This Last", author: "John Ruskin", year: 1860, tradition: "Victorian", era: "Victorian", genres: ["Non-Fiction", "Economics", "Social Criticism"], difficulty: "Advanced", synopsis: "Ruskin attacks classical economics with moral fury, arguing that wealth without justice is worthless and that an economy should be judged by the quality of life it produces — the book Gandhi called life-changing.", themes: ["Economics", "Justice", "Morality", "Labor", "Wealth", "Society"], country: "England" },

  // ── Ralph Waldo Emerson ────────────────────────────────────────────────────
  { id: "representative-men", title: "Representative Men", author: "Ralph Waldo Emerson", year: 1850, tradition: "American", era: "Victorian", genres: ["Non-Fiction", "Essays", "Biography"], difficulty: "Intermediate", synopsis: "Emerson profiles six great men — Plato, Swedenborg, Montaigne, Shakespeare, Napoleon, Goethe — as embodiments of universal human qualities, creating a philosophy of genius that influenced Nietzsche and William James.", themes: ["Genius", "Greatness", "Philosophy", "History", "Character", "Ideas"], country: "USA" },
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
    if(!fs.existsSync(mp)){console.log("SKIP: "+c.id+" (no content)");bs++;continue;}
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
    const ins="\n\n  // ── FINAL EXPANSION (auto-generated) ────────────────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── FINAL EXPANSION (auto-generated) ────────────────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`\nBooks: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
