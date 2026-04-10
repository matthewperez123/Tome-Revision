#!/usr/bin/env npx tsx
/** add-canonical-books-12.ts — More canonical works + completing catalogs */
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
  // ── George MacDonald (completing fantasy canon) ────────────────────────────
  { id: "phantastes", title: "Phantastes", author: "George MacDonald", year: 1858, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Fantasy"], difficulty: "Intermediate", synopsis: "A young man wanders through a dreamlike fairy land where beauty and terror interweave, in the fantasy novel that C. S. Lewis said 'baptized my imagination' and launched the tradition that leads to Tolkien and beyond.", themes: ["Imagination", "Beauty", "Death", "Fairy tale", "Quest", "Transformation"], country: "Scotland" },
  { id: "lilith", title: "Lilith", author: "George MacDonald", year: 1895, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Fantasy", "Allegory"], difficulty: "Advanced", synopsis: "A librarian discovers a mirror that opens into other dimensions, encountering the ancient Lilith and a world where sleeping and waking, life and death blur in MacDonald's darkest and most visionary fantasy.", themes: ["Death", "Redemption", "Dreams", "Evil", "Salvation", "Mystery"], country: "Scotland" },

  // ── William Makepeace Thackeray (completing) ───────────────────────────────
  { id: "the-history-of-henry-esmond", title: "The History of Henry Esmond", author: "William Makepeace Thackeray", year: 1852, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Historical Fiction"], difficulty: "Advanced", synopsis: "A young man of uncertain birth navigates the political intrigues of Queen Anne's England, from the Battle of Blenheim to the Jacobite conspiracy, in Thackeray's most carefully crafted novel and a masterpiece of historical recreation.", themes: ["Honor", "Love", "History", "Legitimacy", "Politics", "Loyalty"], country: "England" },
  { id: "the-luck-of-barry-lyndon", title: "The Luck of Barry Lyndon", author: "William Makepeace Thackeray", year: 1844, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Picaresque", "Satire"], difficulty: "Intermediate", synopsis: "An Irish adventurer lies, cheats, and bullies his way across 18th-century Europe, narrating his own rise and fall with a self-deceiving vanity that makes him simultaneously hilarious and appalling — the basis for Kubrick's film.", themes: ["Self-deception", "Ambition", "Class", "Ireland", "Fortune", "Satire"], country: "England" },

  // ── Thomas Hardy (completing) ──────────────────────────────────────────────
  { id: "a-pair-of-blue-eyes", title: "A Pair of Blue Eyes", author: "Thomas Hardy", year: 1873, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Romance"], difficulty: "Intermediate", synopsis: "A young woman in Cornwall is courted by two very different men, and Hardy uses the dramatic Cornish cliffs as the setting for a love triangle that anticipates the fatalism and natural grandeur of his later masterpieces.", themes: ["Love", "Cornwall", "Class", "Fate", "Nature", "Choice"], country: "England" },

  // ── Ann Radcliffe ──────────────────────────────────────────────────────────
  { id: "a-sicilian-romance", title: "A Sicilian Romance", author: "Ann Radcliffe", year: 1790, tradition: "Romantic", era: "Enlightenment", genres: ["Novel", "Gothic Fiction"], difficulty: "Intermediate", synopsis: "Two sisters discover that their supposedly dead mother is imprisoned in a hidden wing of their Sicilian castle, as Radcliffe perfects the Gothic formula of threatened heroines, tyrannical fathers, and sublime Mediterranean landscapes.", themes: ["Gothic", "Imprisonment", "Family secrets", "Terror", "Landscape", "Escape"], country: "England" },

  // ── Émile Zola (completing) ────────────────────────────────────────────────
  { id: "his-masterpiece", title: "His Masterpiece", author: "Émile Zola", year: 1886, tradition: "French", era: "Victorian", genres: ["Novel", "Künstlerroman"], difficulty: "Advanced", synopsis: "A painter based partly on Cézanne struggles to create a revolutionary masterwork that will transform art, but genius and madness prove inseparable as his obsessive vision destroys everything around him.", themes: ["Art", "Obsession", "Genius", "Paris", "Failure", "Impressionism"], country: "France", language: "French", readingLanguage: "English" },

  // ── Khalil Gibran (completing) ─────────────────────────────────────────────
  { id: "the-madman", title: "The Madman", author: "Khalil Gibran", year: 1918, tradition: "Eastern", era: "Modern", genres: ["Poetry", "Parables", "Philosophy"], difficulty: "Beginner", synopsis: "Gibran's first English-language book: short parables, poems, and prose poems in which a madman speaks truths that the sane cannot hear — the prelude to The Prophet's mystical wisdom.", themes: ["Wisdom", "Madness", "Truth", "God", "Freedom", "Parable"], country: "Lebanon" },
  { id: "the-forerunner", title: "The Forerunner", author: "Khalil Gibran", year: 1920, tradition: "Eastern", era: "Modern", genres: ["Poetry", "Parables", "Philosophy"], difficulty: "Beginner", synopsis: "Poetic parables and allegories that bridge Eastern mysticism and Western modernism, preparing the way for The Prophet with meditations on love, death, art, and the divine.", themes: ["Wisdom", "Love", "Death", "Art", "Spirituality", "Prophecy"], country: "Lebanon" },

  // ── Louisa May Alcott ──────────────────────────────────────────────────────
  { id: "behind-a-mask", title: "Behind a Mask", author: "Louisa May Alcott", year: 1866, tradition: "American", era: "Victorian", genres: ["Novella", "Sensation Fiction", "Thriller"], difficulty: "Beginner", synopsis: "A seemingly demure governess is actually a ruthless manipulator who schemes her way into a wealthy family's fortune — one of Alcott's pseudonymous thrillers, revealing the dark underside of the Little Women author.", themes: ["Deception", "Ambition", "Class", "Gender", "Performance", "Manipulation"], country: "USA" },

  // ── James Joyce ────────────────────────────────────────────────────────────
  { id: "exiles", title: "Exiles", author: "James Joyce", year: 1918, tradition: "Modernist", era: "Modern", genres: ["Drama"], difficulty: "Advanced", synopsis: "Joyce's only play explores a writer's return to Dublin and the triangular sexual tension between him, his common-law wife, and a journalist friend, in a Ibsen-influenced drama of radical honesty about desire and freedom.", themes: ["Exile", "Desire", "Freedom", "Jealousy", "Dublin", "Honesty"], country: "Ireland" },

  // ── E. Nesbit (completing) ─────────────────────────────────────────────────
  { id: "the-story-of-the-amulet", title: "The Story of the Amulet", author: "E. Nesbit", year: 1906, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "The five children from Five Children and It reunite with the Psammead and use a magical amulet to travel through time to ancient Egypt, Babylon, Atlantis, and a socialist utopian future.", themes: ["Time travel", "History", "Magic", "Adventure", "Childhood", "Utopia"], country: "England" },
  { id: "the-house-of-arden", title: "The House of Arden", author: "E. Nesbit", year: 1908, tradition: "Victorian", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "Two children inherit a ruined castle and travel back through English history guided by a magical white mole, meeting Guy Fawkes, Cromwell's soldiers, and smugglers in search of a hidden family treasure.", themes: ["History", "Family", "Magic", "England", "Adventure", "Heritage"], country: "England" },

  // ── Arsène Lupin (Maurice Leblanc) ─────────────────────────────────────────
  { id: "the-extraordinary-adventures-of-arsene-lupin-gentleman-burglar", title: "The Extraordinary Adventures of Arsène Lupin, Gentleman-Burglar", author: "Maurice Leblanc", year: 1907, tradition: "French", era: "Modern", genres: ["Short Stories", "Mystery", "Crime Fiction"], difficulty: "Beginner", synopsis: "The first collection of stories featuring the gentleman-thief who outwits police, aristocrats, and even Sherlock Holmes with charm, audacity, and an irresistible sense of theater.", themes: ["Theft", "Wit", "Disguise", "Justice", "Adventure", "Paris"], country: "France", language: "French", readingLanguage: "English" },
  { id: "arsene-lupin-versus-herlock-sholmes", title: "Arsène Lupin versus Herlock Sholmes", author: "Maurice Leblanc", year: 1908, tradition: "French", era: "Modern", genres: ["Novel", "Mystery", "Crime Fiction"], difficulty: "Beginner", synopsis: "The gentleman-burglar faces off against an English detective who bears a suspicious resemblance to a certain resident of Baker Street, in a duel of wits across Paris and the English Channel.", themes: ["Rivalry", "Wit", "Detection", "Disguise", "Paris", "London"], country: "France", language: "French", readingLanguage: "English" },
  { id: "the-hollow-needle", title: "The Hollow Needle", author: "Maurice Leblanc", year: 1909, tradition: "French", era: "Modern", genres: ["Novel", "Mystery", "Adventure"], difficulty: "Beginner", synopsis: "A teenage detective challenges Lupin over a secret hidden in a hollow needle on the Normandy coast — a secret involving the lost treasures of the kings of France, in the best of all the Lupin novels.", themes: ["Treasure", "Mystery", "Youth", "France", "History", "Adventure"], country: "France", language: "French", readingLanguage: "English" },

  // ── Scarlet Pimpernel series (Baroness Orczy) ──────────────────────────────
  { id: "el-dorado", title: "El Dorado", author: "Baroness Orczy", year: 1913, tradition: "Victorian", era: "Modern", genres: ["Novel", "Historical Fiction", "Adventure"], difficulty: "Beginner", synopsis: "The Scarlet Pimpernel undertakes his most dangerous mission — to rescue the young Dauphin of France from the Temple prison and the clutches of Robespierre's revolutionary government.", themes: ["Heroism", "Revolution", "Rescue", "France", "Sacrifice", "Disguise"], country: "England" },
  { id: "the-elusive-pimpernel", title: "The Elusive Pimpernel", author: "Baroness Orczy", year: 1908, tradition: "Victorian", era: "Modern", genres: ["Novel", "Historical Fiction", "Adventure"], difficulty: "Beginner", synopsis: "Chauvelin devises a cunning trap to capture the Pimpernel by using his wife Marguerite as bait, forcing the masked hero into the heart of revolutionary Paris for his most daring escape.", themes: ["Cat and mouse", "Love", "Revolution", "Disguise", "Courage", "France"], country: "England" },

  // ── L. Frank Baum (Oz series) ──────────────────────────────────────────────
  { id: "the-marvelous-land-of-oz", title: "The Marvelous Land of Oz", author: "L. Frank Baum", year: 1904, tradition: "American", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "A boy named Tip escapes from a witch with a pumpkin-headed man and a wooden sawhorse, journeying to the Emerald City where an army of girls has overthrown the Scarecrow in the first Oz sequel.", themes: ["Adventure", "Magic", "Gender", "Freedom", "Friendship", "Oz"], country: "USA" },
  { id: "ozma-of-oz", title: "Ozma of Oz", author: "L. Frank Baum", year: 1907, tradition: "American", era: "Modern", genres: ["Novel", "Children's Literature", "Fantasy"], difficulty: "Beginner", synopsis: "Dorothy is shipwrecked near a magical land ruled by a mechanical king, and she must outwit the sinister Nome King to rescue a captive royal family with help from a clockwork man and a talking hen.", themes: ["Adventure", "Courage", "Magic", "Friendship", "Oz", "Ingenuity"], country: "USA" },

  // ── Guy de Maupassant ──────────────────────────────────────────────────────
  { id: "pierre-and-jean", title: "Pierre and Jean", author: "Guy de Maupassant", year: 1888, tradition: "French", era: "Victorian", genres: ["Novel", "Psychological Fiction"], difficulty: "Intermediate", synopsis: "When a family friend leaves his fortune to the younger brother, the elder suspects their mother's infidelity, and his investigation destroys the family's happiness in Maupassant's finest novel and a masterpiece of psychological realism.", themes: ["Jealousy", "Family secrets", "Legitimacy", "Psychology", "The sea", "Bourgeois life"], country: "France", language: "French", readingLanguage: "English" },

  // ── Walter Pater ───────────────────────────────────────────────────────────
  { id: "marius-the-epicurean", title: "Marius the Epicurean", author: "Walter Pater", year: 1885, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Philosophical Fiction"], difficulty: "Scholar", synopsis: "A young Roman in the age of Marcus Aurelius moves through Epicureanism, Stoicism, and finally Christianity, as Pater creates a philosophical novel of extraordinary prose beauty that influenced Wilde, Yeats, and the Aesthetic movement.", themes: ["Philosophy", "Beauty", "Rome", "Religion", "Art", "The good life"], country: "England" },

  // ── Siegfried Sassoon ──────────────────────────────────────────────────────
  { id: "memoirs-of-a-foxhunting-man", title: "Memoirs of a Fox-Hunting Man", author: "Siegfried Sassoon", year: 1928, tradition: "Modernist", era: "Modern", genres: ["Novel", "Autobiographical Fiction", "War Fiction"], difficulty: "Intermediate", synopsis: "A young English gentleman's idyllic prewar life of cricket, hunting, and country houses is shattered by the trenches of World War I, in Sassoon's thinly veiled autobiography that moves from pastoral innocence to wartime horror.", themes: ["War", "England", "Innocence", "Loss", "Country life", "Memory"], country: "England" },

  // ── Mary Wollstonecraft ────────────────────────────────────────────────────
  { id: "letters-written-during-a-short-residence-in-sweden-norway-and-denmark", title: "Letters from Sweden, Norway, and Denmark", author: "Mary Wollstonecraft", year: 1796, tradition: "Romantic", era: "Enlightenment", genres: ["Travel Writing", "Letters"], difficulty: "Intermediate", synopsis: "Wollstonecraft travels through Scandinavia on a secret business mission, writing letters of extraordinary emotional and intellectual power that Godwin said made him fall in love with her.", themes: ["Travel", "Emotion", "Independence", "Nature", "Reason", "Solitude"], country: "England" },

  // ── John Muir ──────────────────────────────────────────────────────────────
  { id: "my-first-summer-in-the-sierra", title: "My First Summer in the Sierra", author: "John Muir", year: 1911, tradition: "American", era: "Modern", genres: ["Non-Fiction", "Nature Writing"], difficulty: "Beginner", synopsis: "Muir's ecstatic journal of his first summer in Yosemite — the book that launched the American conservation movement and established nature writing as a literary art, written with the joy of a man seeing paradise for the first time.", themes: ["Nature", "Yosemite", "Conservation", "Joy", "Wilderness", "Wonder"], country: "USA" },

  // ── Rabindranath Tagore ────────────────────────────────────────────────────
  { id: "my-reminiscences", title: "My Reminiscences", author: "Rabindranath Tagore", year: 1917, tradition: "Eastern", era: "Modern", genres: ["Autobiography"], difficulty: "Beginner", synopsis: "The Nobel laureate recalls his childhood in a great Bengali family, his awakening to poetry and music, and the spiritual vision that would make him India's most celebrated writer.", themes: ["Childhood", "India", "Poetry", "Spirituality", "Family", "Art"], country: "India" },

  // ── Robert Frost ───────────────────────────────────────────────────────────
  { id: "north-of-boston", title: "North of Boston", author: "Robert Frost", year: 1914, tradition: "American", era: "Modern", genres: ["Poetry"], difficulty: "Intermediate", synopsis: "Frost's second collection contains his greatest dramatic monologues and dialogues — Mending Wall, The Death of the Hired Man, After Apple-Picking — poems that sound like New England speech and read like philosophy.", themes: ["Rural life", "New England", "Death", "Neighbors", "Work", "Nature"], country: "USA" },

  // ── Geronimo ───────────────────────────────────────────────────────────────
  { id: "geronimos-story-of-his-life", title: "Geronimo's Story of His Life", author: "Geronimo", year: 1906, tradition: "American", era: "Modern", genres: ["Autobiography"], difficulty: "Beginner", synopsis: "The legendary Apache leader dictates his life story — from his childhood and warrior training through decades of resistance against Mexican and American forces — the only autobiography by a major Native American war chief.", themes: ["Resistance", "Native America", "War", "Freedom", "Culture", "Injustice"], country: "USA" },

  // ── Hope Mirrlees ──────────────────────────────────────────────────────────
  { id: "lud-in-the-mist", title: "Lud-in-the-Mist", author: "Hope Mirrlees", year: 1926, tradition: "Modernist", era: "Modern", genres: ["Novel", "Fantasy"], difficulty: "Intermediate", synopsis: "A respectable merchant mayor discovers that the banned fairy fruit is being smuggled into his prosaic trading town, and his investigation leads him to confront the magic he and his entire society have spent generations denying.", themes: ["Magic", "Respectability", "Denial", "Fantasy", "Law", "Wonder"], country: "England" },

  // ── M.E. Braddon ───────────────────────────────────────────────────────────
  { id: "lady-audleys-secret", title: "Lady Audley's Secret", author: "M. E. Braddon", year: 1862, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Sensation Fiction", "Mystery"], difficulty: "Beginner", synopsis: "A beautiful, golden-haired young wife hides a terrible secret, and her nephew-in-law's amateur investigation uncovers a trail of assumed identities, arson, and attempted murder in the greatest sensation novel of the Victorian era.", themes: ["Secrets", "Identity", "Madness", "Marriage", "Detection", "Gender"], country: "England" },

  // ── Ford Madox Ford (completing Parade's End) ──────────────────────────────
  { id: "a-man-could-stand-up", title: "A Man Could Stand Up—", author: "Ford Madox Ford", year: 1926, tradition: "Modernist", era: "Modern", genres: ["Novel", "War Fiction", "Modernist Fiction"], difficulty: "Advanced", synopsis: "On Armistice Day, Valentine Wannop remembers and Tietjens endures as the third volume of Parade's End weaves between the trenches and the home front in Ford's most technically daring narrative experiment.", themes: ["War", "Memory", "Freedom", "Love", "Armistice", "Relief"], country: "England" },
  { id: "the-last-post", title: "The Last Post", author: "Ford Madox Ford", year: 1928, tradition: "Modernist", era: "Modern", genres: ["Novel", "Modernist Fiction"], difficulty: "Advanced", synopsis: "The final volume of Parade's End follows Tietjens's wounded brother Mark through one day of silent vigil, tying together the threads of war, love, and the end of an entire way of English life.", themes: ["Aftermath", "Silence", "England", "Love", "Death", "Memory"], country: "England" },

  // ── John Buchan (completing) ───────────────────────────────────────────────
  { id: "the-three-hostages", title: "The Three Hostages", author: "John Buchan", year: 1924, tradition: "Victorian", era: "Modern", genres: ["Novel", "Thriller"], difficulty: "Beginner", synopsis: "Hannay confronts a master hypnotist who has kidnapped three hostages as pawns in a criminal conspiracy, in Buchan's most psychologically complex thriller — a postwar meditation on the vulnerability of the civilized mind.", themes: ["Hypnosis", "Crime", "Psychology", "Postwar", "Evil", "Rescue"], country: "Scotland" },

  // ── Zane Grey ──────────────────────────────────────────────────────────────
  { id: "riders-of-the-purple-sage", title: "Riders of the Purple Sage", author: "Zane Grey", year: 1912, tradition: "American", era: "Modern", genres: ["Novel", "Western"], difficulty: "Beginner", synopsis: "A mysterious gunman arrives in a Utah canyon to rescue a Mormon woman from a forced marriage, in the best-selling Western novel of all time — a story of individual freedom against institutional tyranny set in a landscape of overwhelming beauty.", themes: ["Freedom", "The West", "Religion", "Love", "Landscape", "Justice"], country: "USA" },

  // ── E.F. Benson ────────────────────────────────────────────────────────────
  { id: "ghost-stories", title: "Ghost Stories", author: "E. F. Benson", year: 1927, tradition: "Victorian", era: "Modern", genres: ["Short Stories", "Horror", "Ghost Stories"], difficulty: "Beginner", synopsis: "Benson's finest supernatural tales — including the unforgettable horrors of caterpillar-infested beds, face-stealing mirrors, and things that lurk in ancient gardens — rank with M. R. James as the best ghost stories in English.", themes: ["The supernatural", "Terror", "English life", "The uncanny", "Death", "Gardens"], country: "England" },

  // ── Peter Kropotkin ────────────────────────────────────────────────────────
  { id: "memoirs-of-a-revolutionist", title: "Memoirs of a Revolutionist", author: "Peter Kropotkin", year: 1899, tradition: "Russian", era: "Victorian", genres: ["Autobiography"], difficulty: "Intermediate", synopsis: "The anarchist prince recounts his extraordinary life — from the Russian imperial court through Siberian exploration, scientific discovery, imprisonment, and escape to become the world's most famous revolutionary thinker.", themes: ["Revolution", "Russia", "Science", "Prison", "Escape", "Idealism"], country: "Russia", language: "Russian", readingLanguage: "English" },

  // ── Booth Tarkington ───────────────────────────────────────────────────────
  { id: "the-turmoil", title: "The Turmoil", author: "Booth Tarkington", year: 1915, tradition: "American", era: "Modern", genres: ["Novel", "Social Novel"], difficulty: "Beginner", synopsis: "A sensitive young man clashes with his self-made industrialist father in a booming Midwestern city, as the old genteel culture is overwhelmed by the smoke, noise, and money of modern capitalism.", themes: ["Industrialism", "Family", "Art vs. commerce", "Growth", "America", "Change"], country: "USA" },

  // ── Julius Caesar ──────────────────────────────────────────────────────────
  { id: "commentaries-on-the-gallic-war", title: "Commentaries on the Gallic War", author: "Julius Caesar", year: -50, tradition: "Ancient Greek", era: "Ancient", genres: ["History", "Military History"], difficulty: "Intermediate", synopsis: "Caesar's own account of his eight-year conquest of Gaul — written in the third person with deceptive clarity and simplicity — is both a masterpiece of military narrative and a supreme exercise in political self-promotion.", themes: ["War", "Empire", "Strategy", "Leadership", "Rome", "Gaul"], country: "Ancient Rome", language: "Latin", readingLanguage: "English" },

  // ── Marie de France ────────────────────────────────────────────────────────
  { id: "lais", title: "Lais", author: "Marie de France", year: 1175, tradition: "Medieval European", era: "Medieval", genres: ["Poetry", "Romance"], difficulty: "Intermediate", synopsis: "Twelve narrative poems of love, magic, and adventure by medieval literature's most important woman author — tales of fairy lovers, werewolves, and doomed passion that influenced Chaucer and the entire romance tradition.", themes: ["Love", "Magic", "Chivalry", "Women", "Fate", "Adventure"], country: "France", language: "Old French", readingLanguage: "English" },

  // ── Orlando Furioso ────────────────────────────────────────────────────────
  { id: "orlando-furioso", title: "Orlando Furioso", author: "Ludovico Ariosto", year: 1532, tradition: "Renaissance", era: "Renaissance", genres: ["Epic Poetry", "Romance", "Fantasy"], difficulty: "Scholar", synopsis: "The greatest Italian Renaissance poem follows the knight Orlando as he goes mad for love of Angelica, while Charlemagne's paladins battle the Saracens in an epic that blends war, magic, romance, and comedy on a cosmic scale.", themes: ["Madness", "Love", "War", "Magic", "Heroism", "Comedy"], country: "Italy", language: "Italian", readingLanguage: "English" },

  // ── Henryk Sienkiewicz (Trilogy) ───────────────────────────────────────────
  { id: "with-fire-and-sword", title: "With Fire and Sword", author: "Henryk Sienkiewicz", year: 1884, tradition: "Romantic", era: "Victorian", genres: ["Novel", "Historical Fiction", "Epic"], difficulty: "Advanced", synopsis: "The first volume of Sienkiewicz's Trilogy follows a young nobleman through the Cossack uprising of 1648, a vast panorama of love, war, and Polish patriotism that won the Nobel laureate his nation's devotion.", themes: ["War", "Poland", "Love", "Honor", "History", "Patriotism"], country: "Poland", language: "Polish", readingLanguage: "English" },

  // ── Etsu Inagaki Sugimoto ──────────────────────────────────────────────────
  { id: "a-daughter-of-the-samurai", title: "A Daughter of the Samurai", author: "Etsu Inagaki Sugimoto", year: 1925, tradition: "Eastern", era: "Modern", genres: ["Autobiography", "Memoir"], difficulty: "Beginner", synopsis: "A Japanese woman raised in a samurai family during the Meiji Restoration moves to America and navigates between two radically different cultures, providing an intimate window into Japan's transformation from feudalism to modernity.", themes: ["Japan", "Culture clash", "Tradition", "Modernity", "Women", "Identity"], country: "Japan" },

  // ── L.M. Montgomery (completing) ───────────────────────────────────────────
  { id: "emily-of-new-moon", title: "Emily of New Moon", author: "L. M. Montgomery", year: 1923, tradition: "Victorian", era: "Modern", genres: ["Novel", "Coming-of-Age"], difficulty: "Beginner", synopsis: "An orphaned girl with the 'flash' of creative vision goes to live with her stern aunts and discovers her vocation as a writer, in Montgomery's most autobiographical and darkly passionate novel.", themes: ["Writing", "Orphanhood", "Imagination", "Growth", "Family", "Canada"], country: "Canada" },

  // ── Elizabeth von Arnim ────────────────────────────────────────────────────
  { id: "elizabeth-and-her-german-garden", title: "Elizabeth and Her German Garden", author: "Elizabeth von Arnim", year: 1898, tradition: "Victorian", era: "Victorian", genres: ["Novel", "Diary Fiction", "Comedy"], difficulty: "Beginner", synopsis: "A witty Englishwoman married to a Prussian count records her battle to create a beautiful garden against the resistance of her husband, servants, and the German climate, in a bestseller that charmed the Edwardian world.", themes: ["Gardens", "Marriage", "Independence", "Nature", "Humor", "Germany"], country: "England" },

  // ── John Steinbeck ─────────────────────────────────────────────────────────
  { id: "cup-of-gold", title: "Cup of Gold", author: "John Steinbeck", year: 1929, tradition: "American", era: "Modern", genres: ["Novel", "Historical Fiction", "Adventure"], difficulty: "Intermediate", synopsis: "Steinbeck's debut novel fictionalizes the life of the pirate Henry Morgan, from his Welsh childhood through the sacking of Panama, as a young man pursues glory and discovers that all cups of gold are empty once drained.", themes: ["Ambition", "Disillusionment", "Adventure", "The sea", "Power", "Dreams"], country: "USA" },
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
    const ins="\n\n  // ── MORE CANONICAL WORKS (auto-generated) ──────────────────────────────────\n\n"+nbe.join(",\n")+",";
    const idx=bc.lastIndexOf("];");bc=bc.slice(0,idx)+ins+"\n"+bc.slice(idx);fs.writeFileSync(BOOKS_FILE,bc,"utf-8");
  }
  if(nce.length>0){
    const ins="\n\n  // ── MORE CANONICAL WORKS (auto-generated) ──────────────────────────────────\n\n"+nce.join(",\n")+",";
    const idx=cc.lastIndexOf("]");cc=cc.slice(0,idx)+ins+"\n"+cc.slice(idx);fs.writeFileSync(CHAPTERS_FILE,cc,"utf-8");
  }
  console.log(`\nBooks: ${ba}, Skipped: ${bs}, Chapters: ${ca}`);
}
main();
