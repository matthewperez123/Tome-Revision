#!/usr/bin/env npx tsx
/** add-canonical-books-9.ts — Complete author catalogs from already-downloaded content */
import * as fs from "fs";
import * as path from "path";
const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");
const TC: Record<string,{primary:string;secondary:string;accent:string}> = {
  Victorian:{primary:"#2D1B5E",secondary:"#1E1145",accent:"#8B5CF6"},Russian:{primary:"#5C1A1A",secondary:"#3D1010",accent:"#DC2626"},American:{primary:"#143220",secondary:"#0A1F14",accent:"#22C55E"},French:{primary:"#0A1F3D",secondary:"#061428",accent:"#EC4899"},Modernist:{primary:"#111827",secondary:"#0A0F1A",accent:"#14B8A6"},Germanic:{primary:"#1F2937",secondary:"#111827",accent:"#10B981"},"Medieval European":{primary:"#1B4332",secondary:"#0F2B20",accent:"#F59E0B"},Renaissance:{primary:"#3D1A6E",secondary:"#2A1050",accent:"#D97706"},Scandinavian:{primary:"#1E293B",secondary:"#0F172A",accent:"#38BDF8"},"Post-Colonial":{primary:"#065F46",secondary:"#034335",accent:"#10B981"},Enlightenment:{primary:"#0F2744",secondary:"#091A2E",accent:"#06B6D4"},"Ancient Greek":{primary:"#1E3A5F",secondary:"#0F2744",accent:"#0EA5E9"},Romantic:{primary:"#4A0E2D",secondary:"#2D0819",accent:"#F43F5E"},
};
interface BC{id:string;title:string;author:string;year:number;tradition:string;era:string;genres:string[];difficulty:"Beginner"|"Intermediate"|"Advanced"|"Scholar";synopsis:string;themes:string[];country:string;language?:string;readingLanguage?:string;}
interface MJ{bookId:string;title:string;author:string;chapterCount:number;totalWordCount:number;totalMinutes:number;chapters:Array<{index:number;title:string;wordCount:number;estimatedMinutes:number}>;}
function toAId(a:string){return a.toLowerCase().replace(/\./g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function frt(m:number){const h=Math.round(m/60);return h<1?`~${m} minutes`:`~${h} hour${h!==1?"s":""}`;}

const BOOKS: BC[] = [
  // ── Anthony Trollope (completing catalog) ──────────────────────────────────
  { id: "cousin-henry", title: "Cousin Henry", author: "Anthony Trollope", year: 1879, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "A weak-willed heir discovers a will that disinherits him hidden in a book, and his agonizing moral paralysis over whether to reveal or destroy it becomes a devastating portrait of cowardice.", themes: ["Conscience", "Inheritance", "Cowardice", "Law", "Duty", "Wales"], country: "England" },
  { id: "he-knew-he-was-right", title: "He Knew He Was Right", author: "Anthony Trollope", year: 1869, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Psychological Fiction"], difficulty: "Advanced", synopsis: "A husband's irrational jealousy over his wife's innocent friendship with an older man escalates into obsession, madness, and ruin in Trollope's most psychologically intense novel.", themes: ["Jealousy", "Marriage", "Obsession", "Madness", "Pride", "Stubbornness"], country: "England" },
  { id: "orley-farm", title: "Orley Farm", author: "Anthony Trollope", year: 1862, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Legal Fiction"], difficulty: "Intermediate", synopsis: "Twenty years after inheriting a farm through a suspicious codicil, Lady Mason faces a new trial for forgery, and the community must reckon with the gap between legal truth and moral sympathy.", themes: ["Forgery", "Justice", "Sympathy", "Law", "Motherhood", "Respectability"], country: "England" },
  { id: "rachel-ray", title: "Rachel Ray", author: "Anthony Trollope", year: 1863, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Romance"], difficulty: "Beginner", synopsis: "A young woman's romance with a brewer's son is opposed by her puritanical sister and the local evangelical clergyman, in Trollope's sunniest and most accessible love story.", themes: ["Love", "Religion", "Class", "Small-town life", "Independence", "Family"], country: "England" },
  { id: "the-american-senator", title: "The American Senator", author: "Anthony Trollope", year: 1877, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Satire"], difficulty: "Intermediate", synopsis: "An American senator visits England and is baffled by its class system, while the locals pursue fox hunting, matchmaking, and land disputes with the passion of people who cannot see their own absurdity.", themes: ["Class", "America vs. England", "Hunting", "Marriage", "Satire", "Land"], country: "England" },
  { id: "the-claverings", title: "The Claverings", author: "Anthony Trollope", year: 1867, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Romance"], difficulty: "Intermediate", synopsis: "A young man is torn between the sensible girl he has promised to marry and the dazzling widow who rejected him years ago, in a novel of romantic indecision with typically Trollopian sympathy for human weakness.", themes: ["Love", "Indecision", "Duty", "Wealth", "Class", "Second chances"], country: "England" },

  // ── Agatha Christie (completing catalog) ───────────────────────────────────
  { id: "the-big-four", title: "The Big Four", author: "Agatha Christie", year: 1927, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Thriller"], difficulty: "Beginner", synopsis: "Poirot faces his most dangerous adversaries — a shadowy international conspiracy of four criminal masterminds bent on world domination, in Christie's most thriller-like adventure.", themes: ["Conspiracy", "Espionage", "Deduction", "Global threat", "Friendship", "Danger"], country: "England" },
  { id: "the-man-in-the-brown-suit", title: "The Man in the Brown Suit", author: "Agatha Christie", year: 1924, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Adventure"], difficulty: "Beginner", synopsis: "A plucky young woman witnesses a suspicious death at a London tube station and follows the trail to South Africa, where diamonds, revolutionaries, and romance await.", themes: ["Adventure", "Mystery", "Africa", "Romance", "Courage", "Identity"], country: "England" },
  { id: "the-mystery-of-the-blue-train", title: "The Mystery of the Blue Train", author: "Agatha Christie", year: 1928, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery"], difficulty: "Beginner", synopsis: "A wealthy American heiress is found murdered aboard the luxurious Blue Train from Paris to the Riviera, her famous rubies missing, and Poirot must untangle a web of jealousy and greed.", themes: ["Murder", "Jewels", "Travel", "Jealousy", "Deduction", "Wealth"], country: "England" },
  { id: "the-secret-of-chimneys", title: "The Secret of Chimneys", author: "Agatha Christie", year: 1925, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Thriller"], difficulty: "Beginner", synopsis: "A murder at a grand English country house entangles a reluctant adventurer with Balkan politics, stolen jewels, and a secret that could topple a European monarchy.", themes: ["Murder", "Politics", "Adventure", "Country house", "Secrets", "Europe"], country: "England" },
  { id: "the-seven-dials-mystery", title: "The Seven Dials Mystery", author: "Agatha Christie", year: 1929, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Thriller"], difficulty: "Beginner", synopsis: "After a practical joke at a country house party ends in death, a young socialite investigates a secret society called the Seven Dials and stumbles into a conspiracy far more dangerous than she imagined.", themes: ["Mystery", "Secret societies", "Youth", "Adventure", "Espionage", "Country house"], country: "England" },

  // ── Jules Verne (completing catalog) ───────────────────────────────────────
  { id: "in-search-of-the-castaways", title: "In Search of the Castaways", author: "Jules Verne", year: 1868, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure"], difficulty: "Beginner", synopsis: "The children of a missing sea captain convince Lord Glenarvan to mount a rescue expedition that circles the globe along the 37th parallel, encountering earthquakes, floods, and cannibals.", themes: ["Adventure", "Rescue", "Exploration", "Determination", "Geography", "The sea"], country: "France", language: "French", readingLanguage: "English" },
  { id: "round-the-moon", title: "Round the Moon", author: "Jules Verne", year: 1870, tradition: "French", era: "Victorian", genres: ["Novel", "Science Fiction"], difficulty: "Beginner", synopsis: "The three passengers fired at the Moon in From the Earth to the Moon orbit the lunar surface, observe its craters and seas, and must find a way home in this thrilling sequel.", themes: ["Space", "Science", "Adventure", "Survival", "The Moon", "Ingenuity"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-adventures-of-captain-hatteras", title: "The Adventures of Captain Hatteras", author: "Jules Verne", year: 1866, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure"], difficulty: "Beginner", synopsis: "An obsessive English captain drives his crew through Arctic ice toward the North Pole, his monomania rivaling Ahab's as the expedition pushes beyond the limits of endurance and sanity.", themes: ["Obsession", "Arctic", "Exploration", "Endurance", "Leadership", "Madness"], country: "France", language: "French", readingLanguage: "English" },
  { id: "an-antarctic-mystery", title: "An Antarctic Mystery", author: "Jules Verne", year: 1897, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure", "Mystery"], difficulty: "Intermediate", synopsis: "Verne writes a sequel to Edgar Allan Poe's Arthur Gordon Pym, following an expedition into Antarctic waters to discover the fate of Poe's lost narrator in a daring blend of science and the supernatural.", themes: ["Antarctic", "Mystery", "Adventure", "Poe", "The unknown", "Science"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-fur-country", title: "The Fur Country", author: "Jules Verne", year: 1873, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure"], difficulty: "Beginner", synopsis: "A Hudson's Bay Company expedition builds a fort on the Arctic coast, only to discover their land is an ice island drifting into the Pacific, in a gripping survival tale of ingenuity against nature.", themes: ["Survival", "Arctic", "Nature", "Ingenuity", "Community", "Isolation"], country: "France", language: "French", readingLanguage: "English" },

  // ── Jack London (completing catalog) ───────────────────────────────────────
  { id: "before-adam", title: "Before Adam", author: "Jack London", year: 1907, tradition: "American", era: "Modern", genres: ["Novel", "Prehistoric Fiction"], difficulty: "Beginner", synopsis: "A modern man dreams himself back into the body of a prehistoric ancestor, experiencing the terrors and wonders of early human existence through race memory in London's most imaginative novel.", themes: ["Evolution", "Prehistory", "Dreams", "Survival", "Nature", "Memory"], country: "USA" },
  { id: "the-son-of-the-wolf", title: "The Son of the Wolf", author: "Jack London", year: 1900, tradition: "American", era: "Modern", genres: ["Short Stories", "Adventure"], difficulty: "Beginner", synopsis: "London's first published book collects tales of the Klondike Gold Rush — frostbite, starvation, courage, and the primal contest between civilization and the white silence of the North.", themes: ["The Klondike", "Survival", "Nature", "Courage", "The North", "Frontier"], country: "USA" },
  { id: "lost-face", title: "Lost Face", author: "Jack London", year: 1910, tradition: "American", era: "Modern", genres: ["Short Stories", "Adventure"], difficulty: "Beginner", synopsis: "Seven tales of the far North and the South Seas, including the title story of a fur trader who outwits his Native American captors with a bluff worthy of Scheherazade.", themes: ["Adventure", "Cunning", "Survival", "The North", "Death", "Courage"], country: "USA" },

  // ── Oscar Wilde (completing catalog) ───────────────────────────────────────
  { id: "childrens-stories", title: "Children's Stories", author: "Oscar Wilde", year: 1888, tradition: "Victorian", era: "Victorian", genres: ["Short Stories", "Fairy Tales", "Children's Literature"], difficulty: "Beginner", synopsis: "Wilde's fairy tales — including The Happy Prince, The Selfish Giant, and The Nightingale and the Rose — combine the beauty of Andersen with a distinctly Wildean wit and moral complexity.", themes: ["Sacrifice", "Beauty", "Love", "Selfishness", "Generosity", "Death"], country: "England" },
  { id: "lord-arthur-saviles-crime-and-other-stories", title: "Lord Arthur Savile's Crime and Other Stories", author: "Oscar Wilde", year: 1891, tradition: "Victorian", era: "Victorian", genres: ["Short Stories", "Comedy", "Gothic Fiction"], difficulty: "Beginner", synopsis: "A collection of Wilde's wittiest and most inventive stories, from a nobleman who must commit murder before his wedding to a ghost who cannot frighten the brash American family occupying his ancestral home.", themes: ["Wit", "Fate", "Society", "The supernatural", "Irony", "Comedy"], country: "England" },

  // ── Mark Twain (completing catalog) ────────────────────────────────────────
  { id: "personal-recollections-of-joan-of-arc", title: "Personal Recollections of Joan of Arc", author: "Mark Twain", year: 1896, tradition: "American", era: "Victorian", genres: ["Novel", "Historical Fiction"], difficulty: "Intermediate", synopsis: "Twain considered this his finest work — a reverent, deeply felt account of Joan of Arc's life told by her fictional secretary, abandoning satire for a sincere portrait of heroism and martyrdom.", themes: ["Heroism", "Faith", "War", "Martyrdom", "France", "Innocence"], country: "USA" },
  { id: "the-autobiography-of-mark-twain", title: "The Autobiography of Mark Twain", author: "Mark Twain", year: 1924, tradition: "American", era: "Modern", genres: ["Autobiography", "Humor"], difficulty: "Beginner", synopsis: "Twain dictated his memoirs in the freewheeling, digressive style of a man talking to himself, producing a self-portrait as funny, cantankerous, and humane as anything he ever wrote.", themes: ["Memory", "Humor", "America", "Fame", "Loss", "Truth"], country: "USA" },

  // ── George Bernard Shaw (completing catalog) ───────────────────────────────
  { id: "short-plays", title: "Short Plays", author: "George Bernard Shaw", year: 1909, tradition: "Victorian", era: "Modern", genres: ["Drama", "Comedy", "One-Act Plays"], difficulty: "Beginner", synopsis: "A collection of Shaw's shorter dramatic works including playlets, sketches, and one-act comedies that distill his wit and social criticism into concentrated theatrical gems.", themes: ["Satire", "Society", "Wit", "Class", "Morality", "Theater"], country: "England" },

  // ── H.G. Wells (completing catalog) ────────────────────────────────────────
  { id: "the-world-set-free", title: "The World Set Free", author: "H. G. Wells", year: 1914, tradition: "Victorian", era: "Modern", genres: ["Novel", "Science Fiction"], difficulty: "Intermediate", synopsis: "Wells predicts atomic weapons and nuclear war with eerie prescience, then imagines humanity rebuilding a utopian world government from the ashes — the novel that inspired Leo Szilard to conceive the nuclear chain reaction.", themes: ["Atomic energy", "War", "Utopia", "Science", "Progress", "Destruction"], country: "England" },
  { id: "the-wonderful-visit", title: "The Wonderful Visit", author: "H. G. Wells", year: 1895, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Fantasy", "Satire"], difficulty: "Beginner", synopsis: "An angel falls to earth in a Sussex village and its innocent wonder exposes the pettiness, cruelty, and hypocrisy of respectable English society in Wells's gentlest satire.", themes: ["Innocence", "Society", "Satire", "Wonder", "Cruelty", "Beauty"], country: "England" },

  // ── Leo Tolstoy ────────────────────────────────────────────────────────────
  { id: "the-power-of-darkness", title: "The Power of Darkness", author: "Leo Tolstoy", year: 1886, tradition: "Russian", era: "Victorian", genres: ["Drama", "Tragedy"], difficulty: "Intermediate", synopsis: "A peasant murders an old man to marry his wife, and the cycle of sin deepens as adultery, infanticide, and moral corruption consume an entire village in Tolstoy's darkest and most powerful play.", themes: ["Sin", "Guilt", "Peasant life", "Murder", "Redemption", "Darkness"], country: "Russia", language: "Russian", readingLanguage: "English" },

  // ── Joseph Conrad ──────────────────────────────────────────────────────────
  { id: "a-personal-record", title: "A Personal Record", author: "Joseph Conrad", year: 1912, tradition: "Modernist", era: "Modern", genres: ["Autobiography", "Memoir"], difficulty: "Intermediate", synopsis: "Conrad recalls his transformation from a Polish boy dreaming of the sea to a British master mariner who became one of the greatest English prose stylists, in an autobiography as elusive and searching as his fiction.", themes: ["Identity", "The sea", "Writing", "Memory", "Poland", "England"], country: "England" },
  { id: "the-mirror-of-the-sea", title: "The Mirror of the Sea", author: "Joseph Conrad", year: 1906, tradition: "Modernist", era: "Modern", genres: ["Non-Fiction", "Memoir", "Maritime Writing"], difficulty: "Intermediate", synopsis: "Conrad's meditations on seamanship, ships, harbors, and the relationship between human beings and the ocean — the most beautiful prose ever written about the sea by the man who knew it best.", themes: ["The sea", "Ships", "Craft", "Memory", "Beauty", "Danger"], country: "England" },

  // ── Robert Louis Stevenson ─────────────────────────────────────────────────
  { id: "prince-otto", title: "Prince Otto", author: "Robert Louis Stevenson", year: 1885, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Romance", "Political Fiction"], difficulty: "Intermediate", synopsis: "The amiable but ineffectual prince of a tiny German state must confront conspirators, his own inadequacy, and the superior political intelligence of his wife in Stevenson's most Ruritanian romance.", themes: ["Leadership", "Marriage", "Politics", "Inadequacy", "Romance", "Duty"], country: "Scotland" },
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
    const ins="\n\n  // ── AUTHOR CATALOG COMPLETIONS (auto-generated) ────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── AUTHOR CATALOG COMPLETIONS (auto-generated) ────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`Books: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
