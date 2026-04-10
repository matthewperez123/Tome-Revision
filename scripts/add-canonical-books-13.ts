#!/usr/bin/env npx tsx
/** add-canonical-books-13.ts — Continuing the expansion */
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
  // ── Samuel Pepys ───────────────────────────────────────────────────────────
  { id: "the-diary", title: "The Diary of Samuel Pepys", author: "Samuel Pepys", year: 1669, tradition: "Enlightenment", era: "Enlightenment", genres: ["Diary", "Autobiography", "History"], difficulty: "Advanced", synopsis: "The most famous diary in the English language records a decade of Restoration London — the Great Plague, the Great Fire, naval battles, theater, food, and sexual adventures — with an intimacy that makes the 17th century feel like yesterday.", themes: ["London", "Daily life", "History", "Plague", "Fire", "Human nature"], country: "England" },

  // ── Henryk Sienkiewicz (completing trilogy) ─────────────────────────────────
  { id: "the-deluge", title: "The Deluge", author: "Henryk Sienkiewicz", year: 1886, tradition: "Romantic", era: "Victorian", genres: ["Novel", "Historical Fiction", "Epic"], difficulty: "Advanced", synopsis: "The second volume of the Trilogy follows a passionate, headstrong knight through the Swedish invasion of 1655, as Poland faces annihilation and one man's redemption mirrors his nation's survival.", themes: ["War", "Redemption", "Poland", "Honor", "Love", "Patriotism"], country: "Poland", language: "Polish", readingLanguage: "English" },
  { id: "pan-michael", title: "Pan Michael", author: "Henryk Sienkiewicz", year: 1888, tradition: "Romantic", era: "Victorian", genres: ["Novel", "Historical Fiction", "Epic"], difficulty: "Advanced", synopsis: "The final volume of the Trilogy follows the greatest swordsman in Poland as he defends the eastern frontier against the Ottoman invasion, concluding the Nobel laureate's vast canvas of 17th-century Polish heroism.", themes: ["War", "Duty", "Love", "Poland", "Sacrifice", "Honor"], country: "Poland", language: "Polish", readingLanguage: "English" },

  // ── Theodore Roosevelt ─────────────────────────────────────────────────────
  { id: "an-autobiography", title: "An Autobiography", author: "Theodore Roosevelt", year: 1913, tradition: "American", era: "Modern", genres: ["Autobiography"], difficulty: "Beginner", synopsis: "The cowboy president tells his own story — from sickly asthmatic child to rancher, police commissioner, Rough Rider, governor, and the youngest President in history — with the unstoppable energy that defined his era.", themes: ["Leadership", "Adventure", "America", "Reform", "Courage", "Nature"], country: "USA" },
  { id: "the-rough-riders", title: "The Rough Riders", author: "Theodore Roosevelt", year: 1899, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Military History", "Memoir"], difficulty: "Beginner", synopsis: "Roosevelt's vivid account of leading a volunteer cavalry regiment up San Juan Hill in the Spanish-American War — part military history, part adventure story, all Roosevelt.", themes: ["War", "Leadership", "Cuba", "Courage", "America", "Adventure"], country: "USA" },

  // ── Margaret Oliphant (major Victorian novelist) ───────────────────────────
  { id: "miss-marjoribanks", title: "Miss Marjoribanks", author: "Margaret Oliphant", year: 1866, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel", "Comedy"], difficulty: "Intermediate", synopsis: "Lucilla Marjoribanks returns from school determined to be a genius of social management in her provincial town, and her comic campaign to reorganize society around herself is the sharpest portrait of female ambition in Victorian fiction.", themes: ["Ambition", "Society", "Women", "Provincial life", "Comedy", "Power"], country: "England" },
  { id: "hester", title: "Hester", author: "Margaret Oliphant", year: 1883, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "A brilliant young woman chafes against the limitations placed on her by both the banking family she depends on and the lover who cannot match her intelligence, in Oliphant's angriest novel about wasted female potential.", themes: ["Women", "Finance", "Ambition", "Intelligence", "Frustration", "Class"], country: "England" },
  { id: "salem-chapel", title: "Salem Chapel", author: "Margaret Oliphant", year: 1863, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "A young Dissenting minister struggles with a congregation that wants sermons, not intellect, while his mother and sister are entangled in a melodrama of seduction and murder that threatens to destroy them all.", themes: ["Religion", "Class", "Scandal", "Ministry", "Family", "Respectability"], country: "England" },

  // ── Benjamin Disraeli ──────────────────────────────────────────────────────
  { id: "sybil", title: "Sybil, or The Two Nations", author: "Benjamin Disraeli", year: 1845, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Political Fiction", "Social Novel"], difficulty: "Intermediate", synopsis: "The future Prime Minister depicts England as two nations — the rich and the poor — through a love story set against the Chartist movement, making the most powerful political argument for social reform in Victorian fiction.", themes: ["Class", "Poverty", "Reform", "England", "Love", "Industry"], country: "England" },

  // ── Ernest Shackleton ──────────────────────────────────────────────────────
  { id: "south", title: "South", author: "Ernest Shackleton", year: 1919, tradition: "Victorian", era: "Modern", genres: ["Non-Fiction", "Exploration", "Adventure"], difficulty: "Beginner", synopsis: "Shackleton's own account of the Endurance expedition — the ship crushed by Antarctic ice, the months on the floe, the open boat journey to South Georgia, and the rescue of every single man — the greatest survival story ever told.", themes: ["Survival", "Leadership", "Antarctica", "Endurance", "Courage", "Teamwork"], country: "England" },

  // ── Wilkie Collins ─────────────────────────────────────────────────────────
  { id: "the-dead-secret", title: "The Dead Secret", author: "Wilkie Collins", year: 1857, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Mystery", "Sensation Fiction"], difficulty: "Intermediate", synopsis: "A dying woman's confession is hidden in a disused room of a Cornish mansion, and the secret it contains — about birth, identity, and legitimacy — haunts the next generation until a blind wife forces the truth into the open.", themes: ["Secrets", "Birth", "Identity", "Cornwall", "Blindness", "Truth"], country: "England" },

  // ── D. H. Lawrence ─────────────────────────────────────────────────────────
  { id: "the-lost-girl", title: "The Lost Girl", author: "D. H. Lawrence", year: 1920, tradition: "Modernist", era: "Modern", genres: ["Novel"], difficulty: "Intermediate", synopsis: "A respectable Midlands girl breaks free from provincial England by joining a troupe of traveling performers and marrying an Italian peasant, following passion to a harsh Abruzzi village in Lawrence's most picaresque novel.", themes: ["Freedom", "Passion", "Class", "Italy", "Convention", "Escape"], country: "England" },

  // ── Arthur Machen ──────────────────────────────────────────────────────────
  { id: "the-hill-of-dreams", title: "The Hill of Dreams", author: "Arthur Machen", year: 1907, tradition: "Victorian", era: "Modern", genres: ["Novel", "Fantasy", "Decadent Fiction"], difficulty: "Advanced", synopsis: "A young writer in rural Wales is consumed by visions of Roman Britain and pagan ecstasy, retreating into an inner world of increasing beauty and terror until reality and dream become indistinguishable.", themes: ["Art", "Vision", "Madness", "Wales", "Paganism", "Beauty"], country: "Wales" },
  { id: "the-three-impostors", title: "The Three Impostors", author: "Arthur Machen", year: 1895, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Horror", "Weird Fiction"], difficulty: "Advanced", synopsis: "Three strangers tell increasingly horrifying stories as part of an occult conspiracy in 1890s London, in the novel that Lovecraft called one of the masterpieces of weird fiction.", themes: ["The occult", "Horror", "London", "Deception", "Evil", "Transformation"], country: "Wales" },

  // ── August Strindberg ──────────────────────────────────────────────────────
  { id: "the-red-room", title: "The Red Room", author: "August Strindberg", year: 1879, tradition: "Scandinavian", era: "Victorian", genres: ["Novel", "Satire", "Social Novel"], difficulty: "Intermediate", synopsis: "A young idealist navigates the corruption of Stockholm's artistic, journalistic, and political establishments in Sweden's first modern novel — a biting social satire that launched Strindberg's career.", themes: ["Idealism", "Corruption", "Art", "Stockholm", "Satire", "Youth"], country: "Sweden", language: "Swedish", readingLanguage: "English" },

  // ── Lewis Carroll (completing) ─────────────────────────────────────────────
  { id: "sylvie-and-bruno", title: "Sylvie and Bruno", author: "Lewis Carroll", year: 1889, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Fantasy", "Children's Literature"], difficulty: "Advanced", synopsis: "Carroll's final novel weaves between a Victorian drawing room and a fairy kingdom, mixing social satire, mathematical puzzles, and dreamlike fantasy in his most ambitious and strangest work.", themes: ["Dreams", "Fantasy", "Logic", "Society", "Love", "Nonsense"], country: "England" },

  // ── Samuel Butler (completing) ─────────────────────────────────────────────
  { id: "erewhon-revisited", title: "Erewhon Revisited", author: "Samuel Butler", year: 1901, tradition: "Victorian", era: "Modern", genres: ["Novel", "Satire", "Utopian Fiction"], difficulty: "Advanced", synopsis: "The traveler returns to Erewhon twenty years later to find that his departure by balloon has been transformed into a religion, and his attempt to debunk the myth of his own divinity becomes Butler's sharpest satire on organized faith.", themes: ["Religion", "Satire", "Myth", "Truth", "Civilization", "Return"], country: "England" },

  // ── Trilby (George du Maurier) ─────────────────────────────────────────────
  { id: "trilby", title: "Trilby", author: "George du Maurier", year: 1894, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Gothic Fiction", "Romance"], difficulty: "Beginner", synopsis: "A tone-deaf artists' model in Bohemian Paris is hypnotized by the sinister Svengali into becoming the greatest singer in Europe, in the novel that gave English the word 'svengali' and was the bestselling book of the 1890s.", themes: ["Hypnosis", "Art", "Paris", "Evil", "Music", "Control"], country: "England" },

  // ── Upton Sinclair ─────────────────────────────────────────────────────────
  { id: "king-coal", title: "King Coal", author: "Upton Sinclair", year: 1917, tradition: "American", era: "Modern", genres: ["Novel", "Political Fiction"], difficulty: "Intermediate", synopsis: "A college student goes undercover in a Colorado coal mine and witnesses the brutal exploitation, deadly working conditions, and corporate violence that Sinclair based on the Ludlow Massacre.", themes: ["Labor", "Class", "Mining", "Injustice", "Courage", "Reform"], country: "USA" },

  // ── James Hogg ─────────────────────────────────────────────────────────────
  { id: "the-private-memoirs-and-confessions-of-a-justified-sinner", title: "The Private Memoirs and Confessions of a Justified Sinner", author: "James Hogg", year: 1824, tradition: "Romantic", era: "Romantic", genres: ["Novel", "Gothic Fiction", "Psychological Fiction"], difficulty: "Advanced", synopsis: "A Scottish Calvinist, convinced he is predestined for salvation, falls under the influence of a mysterious doppelgänger who urges him to commit murder, in the most psychologically disturbing novel of the Romantic era.", themes: ["Predestination", "Evil", "Doppelgänger", "Religion", "Madness", "Scotland"], country: "Scotland" },

  // ── William Morris (fantasy pioneer) ───────────────────────────────────────
  { id: "the-well-at-the-worlds-end", title: "The Well at the World's End", author: "William Morris", year: 1896, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Fantasy", "Romance"], difficulty: "Advanced", synopsis: "A prince rides out from his father's kingdom seeking the magical Well at the World's End, journeying through enchanted forests, captive towers, and desert wastes in the fantasy novel that directly inspired Tolkien's Lord of the Rings.", themes: ["Quest", "Magic", "Love", "Medieval", "Adventure", "Immortality"], country: "England" },
  { id: "the-wood-beyond-the-world", title: "The Wood Beyond the World", author: "William Morris", year: 1894, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Fantasy"], difficulty: "Intermediate", synopsis: "A merchant's son enters a mysterious land beyond the known world, encountering a sorceress, her captive maiden, and her monstrous servant in the novel C. S. Lewis called the first modern fantasy.", themes: ["Fantasy", "Love", "Magic", "Quest", "Good vs. evil", "The unknown"], country: "England" },

  // ── Sheridan Le Fanu (completing) ──────────────────────────────────────────
  { id: "the-wyvern-mystery", title: "The Wyvern Mystery", author: "Sheridan Le Fanu", year: 1869, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Gothic Fiction", "Mystery"], difficulty: "Intermediate", synopsis: "A young wife discovers that her husband's family estate harbors deadly secrets and a murderous relative, as Le Fanu creates an atmosphere of mounting dread in the Yorkshire countryside.", themes: ["Gothic", "Secrets", "Marriage", "Danger", "Isolation", "Yorkshire"], country: "Ireland" },

  // ── Bertrand Russell ───────────────────────────────────────────────────────
  { id: "roads-to-freedom", title: "Roads to Freedom", author: "Bertrand Russell", year: 1918, tradition: "Modernist", era: "Modern", genres: ["Non-Fiction", "Political Philosophy"], difficulty: "Intermediate", synopsis: "The Nobel laureate examines socialism, anarchism, and syndicalism with characteristic clarity and fairness, seeking a path to political freedom that balances individual liberty with economic justice.", themes: ["Socialism", "Anarchism", "Freedom", "Justice", "Politics", "Reason"], country: "England" },

  // ── Hadrian the Seventh ────────────────────────────────────────────────────
  { id: "hadrian-the-seventh", title: "Hadrian the Seventh", author: "Frederick Rolfe", year: 1904, tradition: "Victorian", era: "Modern", genres: ["Novel", "Fantasy", "Satire"], difficulty: "Advanced", synopsis: "A bitter, impoverished Englishman is unexpectedly elected Pope and proceeds to reform the Church with ruthless logic and personal holiness, in the most extraordinary wish-fulfillment fantasy in English literature.", themes: ["Religion", "Power", "Reform", "Fantasy", "Genius", "Isolation"], country: "England" },

  // ── Earl Derr Biggers (Charlie Chan) ───────────────────────────────────────
  { id: "the-house-without-a-key", title: "The House Without a Key", author: "Earl Derr Biggers", year: 1925, tradition: "American", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "A Boston gentleman arrives in Honolulu just as murder strikes at a beachfront mansion, and the wise Chinese-Hawaiian detective Charlie Chan makes his debut, solving the case with patience, wit, and cultural insight.", themes: ["Murder", "Hawaii", "Culture", "Detection", "Wisdom", "Paradise"], country: "USA" },

  // ── George Sand ────────────────────────────────────────────────────────────
  { id: "the-man-of-destiny", title: "The Man of Destiny", author: "George Bernard Shaw", year: 1897, tradition: "Victorian", era: "Victorian", genres: ["Drama", "Comedy", "Historical Fiction"], difficulty: "Beginner", synopsis: "A one-act comedy in which the young Napoleon Bonaparte and a mysterious lady match wits over a stolen dispatch, in Shaw's most charming and compact theatrical gem.", themes: ["Napoleon", "Wit", "Power", "Gender", "Destiny", "Comedy"], country: "England" },

  // ── Practical Mysticism ────────────────────────────────────────────────────
  { id: "practical-mysticism", title: "Practical Mysticism", author: "Evelyn Underhill", year: 1914, tradition: "Victorian", era: "Modern", genres: ["Non-Fiction", "Spirituality", "Philosophy"], difficulty: "Intermediate", synopsis: "Underhill argues that mystical consciousness is not reserved for saints but is a practical capacity available to everyone, in the most accessible introduction to contemplative experience ever written.", themes: ["Mysticism", "Consciousness", "Spirituality", "Perception", "Practice", "Reality"], country: "England" },

  // ── The Haunted Bookshop ───────────────────────────────────────────────────
  { id: "the-haunted-bookshop", title: "The Haunted Bookshop", author: "Christopher Morley", year: 1919, tradition: "American", era: "Modern", genres: ["Novel", "Mystery", "Comedy"], difficulty: "Beginner", synopsis: "A Brooklyn bookseller who believes books are the most powerful weapons in the world discovers an actual conspiracy hidden among his shelves, in a charming mystery that is also a love letter to reading.", themes: ["Books", "Reading", "Mystery", "Brooklyn", "Love", "Ideas"], country: "USA" },

  // ── Jules Verne (more) ─────────────────────────────────────────────────────
  { id: "the-giant-raft", title: "The Giant Raft", author: "Jules Verne", year: 1881, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure"], difficulty: "Beginner", synopsis: "A family descends the Amazon on an enormous raft made of an entire forest, while a cryptogram holds the key to an innocent man's life and a villain lurks among the passengers.", themes: ["Amazon", "Adventure", "Cryptography", "Justice", "The river", "Brazil"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-survivors-of-the-chancellor", title: "The Survivors of the Chancellor", author: "Jules Verne", year: 1875, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure", "Survival Fiction"], difficulty: "Beginner", synopsis: "When a cargo ship catches fire in the mid-Atlantic, the survivors cling to a makeshift raft as thirst, starvation, madness, and cannibalism test the limits of human endurance in Verne's darkest novel.", themes: ["Survival", "The sea", "Human nature", "Desperation", "Cannibalism", "Hope"], country: "France", language: "French", readingLanguage: "English" },
  { id: "dick-sands-the-boy-captain", title: "Dick Sands, the Boy Captain", author: "Jules Verne", year: 1878, tradition: "French", era: "Victorian", genres: ["Novel", "Adventure"], difficulty: "Beginner", synopsis: "A fifteen-year-old takes command of a whaling ship when the crew is killed, but a treacherous cook secretly steers them to the coast of Africa, where they are captured by slave traders.", themes: ["Slavery", "Courage", "Africa", "Betrayal", "Youth", "The sea"], country: "France", language: "French", readingLanguage: "English" },
  { id: "facing-the-flag", title: "Facing the Flag", author: "Jules Verne", year: 1896, tradition: "French", era: "Victorian", genres: ["Novel", "Science Fiction", "Thriller"], difficulty: "Beginner", synopsis: "A mad inventor creates a superweapon and is kidnapped by pirates who plan to hold the world to ransom, in Verne's prescient thriller about weapons of mass destruction and scientific responsibility.", themes: ["Weapons", "Science", "Patriotism", "Madness", "Responsibility", "Piracy"], country: "France", language: "French", readingLanguage: "English" },

  // ── Edgar Rice Burroughs (core Tarzan + Mars) ──────────────────────────────
  { id: "the-return-of-tarzan", title: "The Return of Tarzan", author: "Edgar Rice Burroughs", year: 1913, tradition: "American", era: "Modern", genres: ["Novel", "Adventure"], difficulty: "Beginner", synopsis: "Tarzan travels from Paris to the Sahara to the lost city of Opar as he searches for his place between civilization and the jungle, in the first sequel that established the Tarzan franchise.", themes: ["Civilization vs. nature", "Adventure", "Love", "Africa", "Identity", "Lost cities"], country: "USA" },
  { id: "the-gods-of-mars", title: "The Gods of Mars", author: "Edgar Rice Burroughs", year: 1913, tradition: "American", era: "Modern", genres: ["Novel", "Science Fiction", "Adventure"], difficulty: "Beginner", synopsis: "John Carter returns to Mars to discover that the planet's paradise afterlife is a lie maintained by false gods, and must fight his way through the Valley Dor to save Dejah Thoris from sacrifice.", themes: ["Adventure", "Religion", "Mars", "Deception", "Love", "Heroism"], country: "USA" },
  { id: "at-the-earths-core", title: "At the Earth's Core", author: "Edgar Rice Burroughs", year: 1914, tradition: "American", era: "Modern", genres: ["Novel", "Science Fiction", "Adventure"], difficulty: "Beginner", synopsis: "A mechanical burrowing machine penetrates to the hollow interior of the Earth, where a young man discovers Pellucidar — a savage world of dinosaurs, intelligent reptiles, and Stone Age humans lit by an inner sun.", themes: ["Adventure", "Hollow Earth", "Dinosaurs", "Survival", "Love", "Discovery"], country: "USA" },

  // ── Johanna Spyri ──────────────────────────────────────────────────────────
  { id: "cornelli", title: "Cornelli", author: "Johanna Spyri", year: 1890, tradition: "Germanic", era: "Victorian", genres: ["Novel", "Children's Literature"], difficulty: "Beginner", synopsis: "A spirited Swiss girl is made miserable by her critical cousins until kindness and friendship restore her confidence, from the author of Heidi — a gentle story of childhood resilience.", themes: ["Childhood", "Kindness", "Switzerland", "Friendship", "Resilience", "Family"], country: "Switzerland", language: "German", readingLanguage: "English" },

  // ── H. Rider Haggard ───────────────────────────────────────────────────────
  { id: "cleopatra", title: "Cleopatra", author: "H. Rider Haggard", year: 1889, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Historical Fiction", "Adventure"], difficulty: "Intermediate", synopsis: "An Egyptian priest swears to overthrow Cleopatra and restore the old religion, but falls in love with the queen he has vowed to destroy, in Haggard's most ambitious historical novel.", themes: ["Egypt", "Power", "Religion", "Love", "Duty", "Betrayal"], country: "England" },
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
    const ins="\n\n  // ── EVEN MORE CANONICAL WORKS (auto-generated) ─────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── EVEN MORE CANONICAL WORKS (auto-generated) ─────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`\nBooks: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
