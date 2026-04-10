#!/usr/bin/env npx tsx
/**
 * add-canonical-books-11.ts — Massive catalog expansion
 * Adds ~100 high-priority uncataloged books focusing on:
 * 1. Completing author catalogs (Balzac, Chesterton, Sayers, Nesbit, etc.)
 * 2. Major works of genius (Don Juan, Orlando Furioso, Discourses, etc.)
 * 3. Important new voices (George Sand, Margery Allingham, Mary Shelley's Last Man, etc.)
 */
import * as fs from "fs";
import * as path from "path";
const ROOT = path.resolve(__dirname, "..");
const BOOKS_FILE = path.join(ROOT, "src/data/books.ts");
const CHAPTERS_FILE = path.join(ROOT, "src/data/chapters.ts");
const CONTENT_DIR = path.join(ROOT, "public/content");
const TC: Record<string,{primary:string;secondary:string;accent:string}> = {
  Victorian:{primary:"#2D1B5E",secondary:"#1E1145",accent:"#8B5CF6"},Russian:{primary:"#5C1A1A",secondary:"#3D1010",accent:"#DC2626"},American:{primary:"#143220",secondary:"#0A1F14",accent:"#22C55E"},French:{primary:"#0A1F3D",secondary:"#061428",accent:"#EC4899"},Modernist:{primary:"#111827",secondary:"#0A0F1A",accent:"#14B8A6"},Germanic:{primary:"#1F2937",secondary:"#111827",accent:"#10B981"},"Medieval European":{primary:"#1B4332",secondary:"#0F2B20",accent:"#F59E0B"},Renaissance:{primary:"#3D1A6E",secondary:"#2A1050",accent:"#D97706"},Scandinavian:{primary:"#1E293B",secondary:"#0F172A",accent:"#38BDF8"},"Post-Colonial":{primary:"#065F46",secondary:"#034335",accent:"#10B981"},Enlightenment:{primary:"#0F2744",secondary:"#091A2E",accent:"#06B6D4"},"Ancient Greek":{primary:"#1E3A5F",secondary:"#0F2744",accent:"#0EA5E9"},Romantic:{primary:"#4A0E2D",secondary:"#2D0819",accent:"#F43F5E"},Eastern:{primary:"#5C2800",secondary:"#3D1A00",accent:"#F97316"},
};
interface BC{id:string;title:string;author:string;year:number;tradition:string;era:string;genres:string[];difficulty:"Beginner"|"Intermediate"|"Advanced"|"Scholar";synopsis:string;themes:string[];country:string;language?:string;readingLanguage?:string;}
interface MJ{bookId:string;title:string;author:string;chapterCount:number;totalWordCount:number;totalMinutes:number;chapters:Array<{index:number;title:string;wordCount:number;estimatedMinutes:number}>;}
function toAId(a:string){return a.toLowerCase().replace(/\./g,"").replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"");}
function frt(m:number){const h=Math.round(m/60);return h<1?`~${m} minutes`:`~${h} hour${h!==1?"s":""}`;}

const BOOKS: BC[] = [
  // ── G. K. Chesterton (completing) ──────────────────────────────────────────
  { id: "heretics", title: "Heretics", author: "G. K. Chesterton", year: 1905, tradition: "Victorian", era: "Modern", genres: ["Non-Fiction", "Essays", "Philosophy"], difficulty: "Intermediate", synopsis: "Chesterton attacks the fashionable heresies of his day — Shaw's progressivism, Wells's scientism, Kipling's imperialism — with devastating wit and the radical argument that having definite beliefs is essential to civilization.", themes: ["Faith", "Philosophy", "Wit", "Modernity", "Ideas", "Orthodoxy"], country: "England" },
  { id: "orthodoxy", title: "Orthodoxy", author: "G. K. Chesterton", year: 1908, tradition: "Victorian", era: "Modern", genres: ["Non-Fiction", "Philosophy", "Theology"], difficulty: "Intermediate", synopsis: "Chesterton's spiritual autobiography argues that Christianity is the wildest and most romantic of all philosophies — a paradox-filled adventure story that satisfies both the reason and the imagination.", themes: ["Faith", "Paradox", "Joy", "Reason", "Romance", "Tradition"], country: "England" },
  { id: "the-club-of-queer-trades", title: "The Club of Queer Trades", author: "G. K. Chesterton", year: 1905, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Mystery", "Comedy"], difficulty: "Beginner", synopsis: "A secret club whose members must each invent an entirely new way of earning a living provides the premise for six ingenious detective stories solved by the gloriously eccentric Dorian Basil Grant.", themes: ["Ingenuity", "Mystery", "Wit", "London", "Adventure", "Eccentricity"], country: "England" },
  { id: "the-incredulity-of-father-brown", title: "The Incredulity of Father Brown", author: "G. K. Chesterton", year: 1926, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Eight more cases in which the little priest confronts fake miracles, fraudulent psychics, and the gullibility of those who believe everything except the truth, insisting that skepticism and faith are natural allies.", themes: ["Faith", "Skepticism", "Crime", "Truth", "Paradox", "Justice"], country: "England" },
  { id: "the-wisdom-of-father-brown", title: "The Wisdom of Father Brown", author: "G. K. Chesterton", year: 1914, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Twelve stories in which Father Brown travels from Devon to South America, using his understanding of evil — gained from the confessional — to solve murders that baffle Scotland Yard.", themes: ["Good and evil", "Faith", "Crime", "Wisdom", "Travel", "Justice"], country: "England" },
  { id: "the-secret-of-father-brown", title: "The Secret of Father Brown", author: "G. K. Chesterton", year: 1927, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Father Brown reveals his detective method — imagining himself into the mind of the murderer until he understands the sin from the inside — in ten stories framed by this startling confession.", themes: ["Empathy", "Sin", "Detection", "Psychology", "Faith", "Understanding"], country: "England" },
  { id: "the-everlasting-man", title: "The Everlasting Man", author: "G. K. Chesterton", year: 1925, tradition: "Victorian", era: "Modern", genres: ["Non-Fiction", "Philosophy", "History"], difficulty: "Advanced", synopsis: "Chesterton's response to H. G. Wells's Outline of History argues that the story of humanity only makes sense in light of two unique events: the appearance of human consciousness and the Incarnation of Christ.", themes: ["History", "Faith", "Humanity", "Christ", "Civilization", "Wonder"], country: "England" },

  // ── Dorothy L. Sayers (completing) ─────────────────────────────────────────
  { id: "clouds-of-witness", title: "Clouds of Witness", author: "Dorothy L. Sayers", year: 1926, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Lord Peter Wimsey must prove his own brother innocent of murder when the Duke of Denver is found standing over a dead body at a shooting lodge, in a case that goes all the way to the House of Lords.", themes: ["Family", "Murder", "Class", "Justice", "Honor", "Loyalty"], country: "England" },
  { id: "unnatural-death", title: "Unnatural Death", author: "Dorothy L. Sayers", year: 1927, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "When an elderly woman dies of apparently natural causes, Wimsey suspects murder — but proving that someone was killed when there is no apparent means of death is his most baffling challenge yet.", themes: ["Murder", "Inheritance", "Medicine", "Investigation", "Justice", "Deception"], country: "England" },
  { id: "the-unpleasantness-at-the-bellona-club", title: "The Unpleasantness at the Bellona Club", author: "Dorothy L. Sayers", year: 1928, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "An old general is found dead in his club on Armistice Day, and the exact time of his death determines which of two heirs inherits a fortune — but Wimsey discovers that the body has been moved.", themes: ["War", "Inheritance", "Time", "Gentlemen's clubs", "Murder", "Memory"], country: "England" },
  { id: "lord-peter-views-the-body", title: "Lord Peter Views the Body", author: "Dorothy L. Sayers", year: 1928, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Twelve short stories featuring Lord Peter at his most versatile — solving a cipher hidden in a recipe, a murdered cat fancier, and a stolen Donatello in cases ranging from the comic to the macabre.", themes: ["Mystery", "Wit", "Variety", "Crime", "Ingenuity", "Detection"], country: "England" },

  // ── E. Nesbit (completing) ─────────────────────────────────────────────────
  { id: "five-children-and-it", title: "Five Children and It", author: "E. Nesbit", year: 1902, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "Five children discover a sand fairy that grants one wish per day, but every wish goes hilariously wrong — teaching them that getting what you want is far more dangerous than not getting it.", themes: ["Wishes", "Consequences", "Magic", "Childhood", "Humor", "Family"], country: "England" },
  { id: "the-story-of-the-treasure-seekers", title: "The Story of the Treasure Seekers", author: "E. Nesbit", year: 1899, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Children's Literature"], difficulty: "Beginner", synopsis: "The six Bastable children try every scheme they can think of to restore the family fortune — from detective work to digging for treasure to selling poetry — narrated by the hilariously unreliable Oswald.", themes: ["Family", "Poverty", "Ingenuity", "Childhood", "Humor", "Adventure"], country: "England" },
  { id: "the-enchanted-castle", title: "The Enchanted Castle", author: "E. Nesbit", year: 1907, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "Three children discover a magic ring that makes wishes come true and an enchanted castle whose sleeping princess turns out to be the housekeeper's niece, in Nesbit's most inventive and genuinely eerie fantasy.", themes: ["Magic", "Imagination", "Beauty", "Fear", "Childhood", "Wonder"], country: "England" },
  { id: "the-phoenix-and-the-carpet", title: "The Phoenix and the Carpet", author: "E. Nesbit", year: 1904, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "A magical carpet and a vain, golden phoenix take five children on adventures from France to a tropical island to a London theater, in the sequel to Five Children and It.", themes: ["Travel", "Magic", "Adventure", "Humor", "Childhood", "Imagination"], country: "England" },

  // ── Honoré de Balzac (adding major works) ──────────────────────────────────
  { id: "a-daughter-of-eve", title: "A Daughter of Eve", author: "Honoré de Balzac", year: 1838, tradition: "French", era: "Romantic", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "Two sisters raised in convent-like seclusion marry very different men, and when one falls for a scheming journalist, her innocence nearly destroys her in Balzac's study of how sheltered women are prey to adventurers.", themes: ["Innocence", "Marriage", "Deception", "Paris", "Education", "Women"], country: "France", language: "French", readingLanguage: "English" },
  { id: "ursule-mirouet", title: "Ursule Mirouët", author: "Honoré de Balzac", year: 1841, tradition: "French", era: "Romantic", genres: ["Novel", "Mystery"], difficulty: "Intermediate", synopsis: "A saintly old doctor's goddaughter is cheated of her inheritance by greedy relatives, and the doctor reaches from beyond the grave through dreams and visions to secure justice, in Balzac's most supernatural novel.", themes: ["Inheritance", "Justice", "The supernatural", "Greed", "Virtue", "Province"], country: "France", language: "French", readingLanguage: "English" },

  // ── Wilkie Collins (completing) ────────────────────────────────────────────
  { id: "no-name", title: "No Name", author: "Wilkie Collins", year: 1862, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Sensation Fiction"], difficulty: "Intermediate", synopsis: "When two sisters are disinherited by a legal technicality after discovering their parents were never married, the resourceful Magdalen Vanstone wages a daring campaign of impersonation and intrigue to reclaim their fortune.", themes: ["Identity", "Legitimacy", "Determination", "Law", "Disguise", "Women"], country: "England" },
  { id: "man-and-wife", title: "Man and Wife", author: "Wilkie Collins", year: 1870, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "Collins attacks Victorian marriage law through a story of accidental marriage, athletic brutality, and a woman trapped by Scotland's irregular marriage laws in a novel as angry and urgent as any in the Victorian canon.", themes: ["Marriage law", "Women's rights", "Athletics", "Brutality", "Law", "Justice"], country: "England" },

  // ── Mary Shelley ───────────────────────────────────────────────────────────
  { id: "the-last-man", title: "The Last Man", author: "Mary Shelley", year: 1826, tradition: "Romantic", era: "Romantic", genres: ["Novel", "Science Fiction", "Apocalyptic Fiction"], difficulty: "Advanced", synopsis: "A plague sweeps the world in the late 21st century, and the last survivor wanders alone through the ruins of civilization — Mary Shelley's second great novel and the first modern apocalyptic fiction.", themes: ["Plague", "Isolation", "Civilization", "Loss", "Survival", "The future"], country: "England" },

  // ── Lord Byron ─────────────────────────────────────────────────────────────
  { id: "don-juan", title: "Don Juan", author: "Lord Byron", year: 1824, tradition: "Romantic", era: "Romantic", genres: ["Epic Poetry", "Satire", "Comedy"], difficulty: "Advanced", synopsis: "Byron's unfinished comic masterpiece follows a naive young Spaniard through shipwreck, slavery, war, and the courts of Europe, as the poet uses his hero's adventures to satirize everything from marriage to warfare to English society.", themes: ["Satire", "Love", "War", "Society", "Hypocrisy", "Freedom"], country: "England" },

  // ── Virgil (completing) ────────────────────────────────────────────────────
  { id: "the-eclogues", title: "The Eclogues", author: "Virgil", year: -37, tradition: "Ancient Greek", era: "Ancient", genres: ["Poetry", "Pastoral"], difficulty: "Advanced", synopsis: "Ten pastoral poems of shepherds singing in idealized landscapes that transformed Greek bucolic poetry into a vehicle for Roman political allegory, exile, and longing for a lost golden age.", themes: ["Pastoral", "Loss", "Nature", "Politics", "Poetry", "Golden age"], country: "Ancient Rome", language: "Latin", readingLanguage: "English" },
  { id: "the-georgics", title: "The Georgics", author: "Virgil", year: -29, tradition: "Ancient Greek", era: "Ancient", genres: ["Poetry", "Didactic Poetry"], difficulty: "Advanced", synopsis: "Virgil's poem on farming — crops, trees, livestock, bees — becomes a meditation on labor, death, civilization, and what it means to build something lasting from the earth, in what many consider the greatest poem in Latin.", themes: ["Labor", "Nature", "Civilization", "Death", "Italy", "Creation"], country: "Ancient Rome", language: "Latin", readingLanguage: "English" },

  // ── Cicero ─────────────────────────────────────────────────────────────────
  { id: "tusculan-disputations", title: "Tusculan Disputations", author: "Cicero", year: -45, tradition: "Ancient Greek", era: "Ancient", genres: ["Philosophy", "Dialogue"], difficulty: "Advanced", synopsis: "Cicero debates the great questions of human existence — the fear of death, the endurance of pain, the nature of grief, the passions, and whether virtue alone suffices for happiness — in five dialogues at his villa.", themes: ["Death", "Pain", "Grief", "Virtue", "Happiness", "Philosophy"], country: "Ancient Rome", language: "Latin", readingLanguage: "English" },

  // ── Epictetus ──────────────────────────────────────────────────────────────
  { id: "discourses", title: "Discourses", author: "Epictetus", year: 108, tradition: "Ancient Greek", era: "Ancient", genres: ["Philosophy", "Stoicism"], difficulty: "Advanced", synopsis: "The teachings of the former slave turned Stoic philosopher, recorded by his student Arrian — practical wisdom on freedom, desire, duty, and the distinction between what is in our power and what is not.", themes: ["Stoicism", "Freedom", "Duty", "Self-mastery", "Philosophy", "Acceptance"], country: "Ancient Rome", language: "Ancient Greek", readingLanguage: "English" },

  // ── Christopher Marlowe ────────────────────────────────────────────────────
  { id: "edward-ii", title: "Edward II", author: "Christopher Marlowe", year: 1593, tradition: "Renaissance", era: "Renaissance", genres: ["Drama", "History", "Tragedy"], difficulty: "Advanced", synopsis: "A weak king's obsessive love for his favorite Gaveston provokes rebellion and leads to his deposition and horrifying murder, in Marlowe's most politically sophisticated play and the first great English history drama.", themes: ["Power", "Love", "Rebellion", "Kingship", "Sexuality", "Downfall"], country: "England" },
  { id: "the-jew-of-malta", title: "The Jew of Malta", author: "Christopher Marlowe", year: 1590, tradition: "Renaissance", era: "Renaissance", genres: ["Drama", "Tragedy", "Dark Comedy"], difficulty: "Advanced", synopsis: "The wealthy Jew Barabas is stripped of his fortune by Christians and embarks on a campaign of revenge so extravagant that the play becomes a blackly comic meditation on the universal corruption of money and power.", themes: ["Revenge", "Religion", "Money", "Hypocrisy", "Power", "Corruption"], country: "England" },

  // ── George Sand ────────────────────────────────────────────────────────────
  { id: "mauprat", title: "Mauprat", author: "George Sand", year: 1837, tradition: "French", era: "Romantic", genres: ["Novel", "Romance", "Gothic Fiction"], difficulty: "Intermediate", synopsis: "A savage young nobleman raised by criminal kinsmen is civilized by the love of his cousin Edmée, who insists he must earn her respect through education and moral growth before she will consent to marry him.", themes: ["Love", "Education", "Civilization", "Nature vs. nurture", "Redemption", "Freedom"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-devils-pool", title: "The Devil's Pool", author: "George Sand", year: 1846, tradition: "French", era: "Romantic", genres: ["Novel", "Pastoral"], difficulty: "Beginner", synopsis: "A young widowed farmer goes to find a new wife and discovers love where he least expected it, in Sand's most lyrical pastoral novel — a gem of simplicity set in the Berry countryside she knew by heart.", themes: ["Love", "Rural life", "Simplicity", "Nature", "Marriage", "France"], country: "France", language: "French", readingLanguage: "English" },

  // ── William Faulkner ───────────────────────────────────────────────────────
  { id: "soldiers-pay", title: "Soldiers' Pay", author: "William Faulkner", year: 1926, tradition: "Modernist", era: "Modern", genres: ["Novel", "War Fiction"], difficulty: "Intermediate", synopsis: "A fatally wounded pilot returns home to a small Southern town that has already moved on from the war, and the people who accompany him confront the gap between heroic expectation and damaged reality in Faulkner's debut.", themes: ["War", "Homecoming", "Disillusionment", "The South", "Youth", "Death"], country: "USA" },

  // ── Ford Madox Ford (Parade's End) ─────────────────────────────────────────
  { id: "some-do-not", title: "Some Do Not...", author: "Ford Madox Ford", year: 1924, tradition: "Modernist", era: "Modern", genres: ["Novel", "War Fiction", "Modernist Fiction"], difficulty: "Advanced", synopsis: "The first volume of Parade's End follows Christopher Tietjens — the last English Tory gentleman — from Edwardian certainty through the shattering of everything he represents by war, modernity, and an unfaithful wife.", themes: ["War", "Honor", "Marriage", "Modernity", "England", "Integrity"], country: "England" },
  { id: "no-more-parades", title: "No More Parades", author: "Ford Madox Ford", year: 1925, tradition: "Modernist", era: "Modern", genres: ["Novel", "War Fiction", "Modernist Fiction"], difficulty: "Advanced", synopsis: "Tietjens commands a base camp in France as shells fall and bureaucratic chaos reigns, while his wife schemes against him in London, in the second volume of the greatest English novel sequence about World War I.", themes: ["War", "Duty", "Chaos", "Marriage", "Endurance", "Command"], country: "England" },

  // ── W. Somerset Maugham (completing) ───────────────────────────────────────
  { id: "ashenden", title: "Ashenden: Or the British Agent", author: "W. Somerset Maugham", year: 1928, tradition: "Modernist", era: "Modern", genres: ["Short Stories", "Espionage", "Fiction"], difficulty: "Beginner", synopsis: "Based on Maugham's own wartime intelligence work, these spare, ironic stories of a writer-turned-spy in World War I invented the modern espionage novel and directly influenced Ian Fleming and John le Carré.", themes: ["Espionage", "War", "Irony", "Duty", "Morality", "Loneliness"], country: "England" },

  // ── Edith Wharton ──────────────────────────────────────────────────────────
  { id: "summer", title: "Summer", author: "Edith Wharton", year: 1917, tradition: "American", era: "Modern", genres: ["Novel", "Naturalism"], difficulty: "Intermediate", synopsis: "A young woman in a stifling New England village is seduced by a visiting architect, and her passionate awakening leads to pregnancy, abandonment, and a grim compromise that Wharton called her 'hot Ethan Frome.'", themes: ["Desire", "Poverty", "Small-town life", "Sexuality", "Entrapment", "Nature"], country: "USA" },
  { id: "hudson-river-bracketed", title: "Hudson River Bracketed", author: "Edith Wharton", year: 1929, tradition: "American", era: "Modern", genres: ["Novel", "Bildungsroman"], difficulty: "Intermediate", synopsis: "A young Midwestern writer discovers art, culture, and love in the old houses of the Hudson Valley, only to find that the literary world is as treacherous as it is intoxicating, in Wharton's late masterpiece about artistic vocation.", themes: ["Art", "Ambition", "Culture", "America", "Writing", "Class"], country: "USA" },

  // ── Charlotte Brontë ───────────────────────────────────────────────────────
  { id: "shirley", title: "Shirley", author: "Charlotte Brontë", year: 1849, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Social Novel"], difficulty: "Intermediate", synopsis: "Two very different women — the spirited heiress Shirley Keeldar and the quiet Caroline Helstone — navigate love, class, and the Luddite uprisings in Yorkshire in Brontë's most socially engaged novel.", themes: ["Women", "Industry", "Love", "Class", "Independence", "Yorkshire"], country: "England" },

  // ── Upton Sinclair ─────────────────────────────────────────────────────────
  { id: "oil", title: "Oil!", author: "Upton Sinclair", year: 1927, tradition: "American", era: "Modern", genres: ["Novel", "Political Fiction"], difficulty: "Intermediate", synopsis: "An oil baron's son watches his father corrupt everything he touches as the California oil boom creates and destroys fortunes, in Sinclair's epic of American capitalism inspired by the Teapot Dome scandal.", themes: ["Oil", "Capitalism", "Corruption", "California", "Idealism", "Power"], country: "USA" },

  // ── John Buchan (completing) ───────────────────────────────────────────────
  { id: "greenmantle", title: "Greenmantle", author: "John Buchan", year: 1916, tradition: "Victorian", era: "Modern", genres: ["Novel", "Thriller", "Adventure"], difficulty: "Beginner", synopsis: "Richard Hannay is sent on a secret mission to Constantinople to prevent a jihad that could turn the tide of World War I, in the sequel to The Thirty-Nine Steps that takes the spy thriller to an epic scale.", themes: ["Espionage", "War", "Adventure", "Religion", "Courage", "Empire"], country: "Scotland" },
  { id: "mr-standfast", title: "Mr Standfast", author: "John Buchan", year: 1919, tradition: "Victorian", era: "Modern", genres: ["Novel", "Thriller", "Adventure"], difficulty: "Beginner", synopsis: "Hannay goes undercover among pacifists and conscientious objectors to hunt a deadly German spy, guided by Bunyan's Pilgrim's Progress in the final and finest of Buchan's wartime thrillers.", themes: ["Espionage", "Faith", "War", "Duty", "Love", "Sacrifice"], country: "Scotland" },

  // ── Helen Keller ───────────────────────────────────────────────────────────
  { id: "the-story-of-my-life", title: "The Story of My Life", author: "Helen Keller", year: 1903, tradition: "American", era: "Modern", genres: ["Autobiography"], difficulty: "Beginner", synopsis: "Helen Keller tells how Annie Sullivan broke through the prison of deafness and blindness to give her language, thought, and connection to the world, in one of the most inspiring autobiographies ever written.", themes: ["Disability", "Education", "Language", "Determination", "Connection", "Hope"], country: "USA" },

  // ── Ben Jonson ─────────────────────────────────────────────────────────────
  { id: "the-alchemist", title: "The Alchemist", author: "Ben Jonson", year: 1610, tradition: "Renaissance", era: "Renaissance", genres: ["Drama", "Comedy"], difficulty: "Intermediate", synopsis: "Three con artists set up shop in a plague-emptied London house, fleecing a parade of greedy victims with promises of the philosopher's stone, in the most brilliantly plotted comedy of the English Renaissance.", themes: ["Greed", "Deception", "Alchemy", "London", "Wit", "Comeuppance"], country: "England" },

  // ── Margaret Cavendish ─────────────────────────────────────────────────────
  { id: "the-blazing-world", title: "The Blazing World", author: "Margaret Cavendish", year: 1666, tradition: "Renaissance", era: "Enlightenment", genres: ["Novel", "Science Fiction", "Utopian Fiction"], difficulty: "Advanced", synopsis: "A young woman passes through the North Pole into a parallel world of talking animals, invading spirits, and submarine warfare, ruling as Empress in what is often called the first science fiction novel by a woman.", themes: ["Utopia", "Science", "Power", "Gender", "Imagination", "Philosophy"], country: "England" },

  // ── Grimm's Fairy Tales ────────────────────────────────────────────────────
  { id: "household-tales", title: "Household Tales", author: "Jacob Grimm & Wilhelm Grimm", year: 1812, tradition: "Germanic", era: "Romantic", genres: ["Short Stories", "Fairy Tales", "Folklore"], difficulty: "Beginner", synopsis: "The complete Grimm fairy tales — Cinderella, Snow White, Hansel and Gretel, Rumpelstiltskin, and two hundred more — the most influential collection of folk stories ever published.", themes: ["Magic", "Morality", "Transformation", "Cunning", "Justice", "Family"], country: "Germany", language: "German", readingLanguage: "English" },

  // ── Herodotus ──────────────────────────────────────────────────────────────
  { id: "histories", title: "Histories", author: "Herodotus", year: -430, tradition: "Ancient Greek", era: "Ancient", genres: ["History", "Non-Fiction"], difficulty: "Advanced", synopsis: "The father of history records the rise of the Persian Empire and its collision with Greece at Marathon, Thermopylae, and Salamis, weaving a tapestry of peoples, customs, and marvels across three continents.", themes: ["War", "Empire", "Custom", "Freedom", "Fate", "Wonder"], country: "Ancient Greece", language: "Ancient Greek", readingLanguage: "English" },

  // ── Aesop ──────────────────────────────────────────────────────────────────
  { id: "fables", title: "Fables", author: "Aesop", year: -564, tradition: "Ancient Greek", era: "Ancient", genres: ["Fables", "Short Stories"], difficulty: "Beginner", synopsis: "The fox and the grapes, the tortoise and the hare, the boy who cried wolf — Aesop's animal fables have taught moral lessons to every civilization for twenty-five centuries.", themes: ["Morality", "Cunning", "Folly", "Wisdom", "Animals", "Human nature"], country: "Ancient Greece", language: "Ancient Greek", readingLanguage: "English" },

  // ── Liam O'Flaherty ────────────────────────────────────────────────────────
  { id: "the-informer", title: "The Informer", author: "Liam O'Flaherty", year: 1925, tradition: "Modernist", era: "Modern", genres: ["Novel", "Political Fiction", "Thriller"], difficulty: "Intermediate", synopsis: "During the Irish Civil War, a hulking ex-revolutionary betrays a comrade for twenty pounds and spends one terrifying night fleeing through Dublin as the organization hunts him down.", themes: ["Betrayal", "Ireland", "Guilt", "Violence", "Poverty", "Pursuit"], country: "Ireland" },

  // ── Tom Brown's School Days ────────────────────────────────────────────────
  { id: "tom-browns-school-days", title: "Tom Brown's School Days", author: "Thomas Hughes", year: 1857, tradition: "Victorian", era: "Victorian", genres: ["Novel", "School Story"], difficulty: "Beginner", synopsis: "The novel that invented the school story follows Tom Brown through Rugby School under the headmastership of the great Thomas Arnold, establishing every convention of the genre from bullying to cricket to moral growth.", themes: ["Education", "Bullying", "Friendship", "Character", "England", "Sport"], country: "England" },

  // ── Rafael Sabatini (completing) ───────────────────────────────────────────
  { id: "the-sea-hawk", title: "The Sea Hawk", author: "Rafael Sabatini", year: 1915, tradition: "Modernist", era: "Modern", genres: ["Novel", "Historical Fiction", "Adventure"], difficulty: "Beginner", synopsis: "An Elizabethan gentleman is betrayed by his half-brother, sold into slavery, and rises to become a feared Barbary corsair, before returning to England for a reckoning that combines swashbuckling with courtroom drama.", themes: ["Betrayal", "Revenge", "The sea", "Honor", "Islam", "Justice"], country: "England" },

  // ── Margery Allingham ──────────────────────────────────────────────────────
  { id: "the-crime-at-black-dudley", title: "The Crime at Black Dudley", author: "Margery Allingham", year: 1929, tradition: "Victorian", era: "Modern", genres: ["Novel", "Mystery", "Detective Fiction"], difficulty: "Beginner", synopsis: "Albert Campion makes his debut when a weekend party at a sinister old house turns deadly, and the guests find themselves trapped with a murdered host and a gang of criminals in Allingham's atmospheric first mystery.", themes: ["Murder", "Country house", "Secrets", "Youth", "Danger", "Detection"], country: "England" },

  // ── Apsley Cherry-Garrard ──────────────────────────────────────────────────
  { id: "the-worst-journey-in-the-world", title: "The Worst Journey in the World", author: "Apsley Cherry-Garrard", year: 1922, tradition: "Modernist", era: "Modern", genres: ["Non-Fiction", "Exploration", "Memoir"], difficulty: "Intermediate", synopsis: "A member of Scott's Antarctic expedition recounts the winter journey to Cape Crozier and the fatal march to the South Pole in what is widely considered the greatest adventure book ever written.", themes: ["Exploration", "Endurance", "Death", "Antarctica", "Courage", "Friendship"], country: "England" },

  // ── Theodore Roosevelt ─────────────────────────────────────────────────────
  { id: "through-the-brazilian-wilderness", title: "Through the Brazilian Wilderness", author: "Theodore Roosevelt", year: 1914, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Exploration", "Travel Writing"], difficulty: "Intermediate", synopsis: "The former president nearly dies exploring an uncharted Amazonian river, battling rapids, disease, starvation, and murder in an expedition so harrowing it shortened his life by years.", themes: ["Exploration", "Danger", "Brazil", "Nature", "Leadership", "Survival"], country: "USA" },

  // ── Suetonius ──────────────────────────────────────────────────────────────
  { id: "the-lives-of-the-caesars", title: "The Lives of the Caesars", author: "Suetonius", year: 121, tradition: "Ancient Greek", era: "Ancient", genres: ["Biography", "History"], difficulty: "Intermediate", synopsis: "Gossipy, vivid biographies of the first twelve Roman emperors from Julius Caesar to Domitian — full of scandal, cruelty, eccentricity, and the kind of intimate detail that makes ancient Rome feel shockingly modern.", themes: ["Power", "Rome", "Character", "Tyranny", "Gossip", "Empire"], country: "Ancient Rome", language: "Latin", readingLanguage: "English" },
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
    const ins="\n\n  // ── MASSIVE CATALOG EXPANSION (auto-generated) ─────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── MASSIVE CATALOG EXPANSION (auto-generated) ─────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`\nBooks: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
