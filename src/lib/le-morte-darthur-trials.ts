/**
 * Le Morte d'Arthur chapter trials — book-level trials keyed to the
 * first-chapter index of each of Caxton's 21 books, plus flagship-scene
 * trials and a capstone.
 *
 * Why book-level? Malory (Caxton 1485) is 507 chapters of continuous
 * prose narrative; per-chapter trials would dilute to uselessness. The
 * book-level structure — where each Caxton book concludes a coherent
 * arc — is the natural quiz granularity.
 *
 * ChapterIndex entries (matches public/content/le-morte-darthur/ch-*.json):
 *
 *    2 — Book I (Arthur's conception, Uther's death, Sword in Stone)
 *   29 — Book II (Balin & Balan — the Dolorous Stroke)
 *   48 — Book III (Arthur's marriage; Round Table oath at Pentecost)
 *   63 — Book IV (Arthur's Roman campaign opening; Morgan and Accolon)
 *   91 — Book V (Arthur vs. Roman Emperor Lucius)
 *  103 — Book VI (Launcelot's first quests — introducing him fully)
 *  121 — Book VII (Gareth Beaumains — the Kitchen Knight)
 *  156 — Book VIII (Tristram begins — La Beale Isoud)
 *  197 — Book IX (Tristram continues)
 *  241 — Book X (Tristram and La Beale Isoud — the longest book)
 *  329 — Book XI (Launcelot, Galahad conceived)
 *  343 — Book XII (Launcelot's madness and recovery)
 *  357 — Book XIII (Grail Quest begins — Galahad at Pentecost)
 *  377 — Book XIV (Percival in the Grail Quest)
 *  387 — Book XV (Launcelot in the Grail Quest)
 *  393 — Book XVI (Bors in the Grail Quest)
 *  410 — Book XVII (Galahad achieves the Grail)
 *  433 — Book XVIII (Launcelot and Guinevere — the Fair Maid of Astolat)
 *  458 — Book XIX (Poisoned apple; Mellyagaunt; knight of the cart)
 *  471 — Book XX (War with Launcelot; collapse of the Round Table)
 *  493 — Book XXI (Final battle; Arthur to Avalon; Mordred's death)
 *
 *  507 — Malory Master Trial ("Once and Future King" Seal)
 *  508 — Arthurian Tradition stretch (combines with Tennyson's Idylls
 *        and Spenser's Faerie Queene for the "Matter of Britain" Seal)
 *
 * Plus flagship single-scene trials at specific chapter indices within
 * those books (Sword in the Stone; the death of Arthur and the hurling
 * of Excalibur).
 *
 * Merged at lookup time by `getQuestionsForChapter` in
 * chapter-questions.ts. Schema matches `ChapterQuestion` there.
 *
 * Translation reference: Caxton's 1485 print (Standard Ebooks edition).
 * Middle English preserved where reading bears it; some modernization
 * in headers. Question text quotes Caxton verbatim when quoting.
 */

import type { ChapterQuestion } from "./chapter-questions"

export const LE_MORTE_DARTHUR_TRIALS: Record<number, ChapterQuestion[]> = {

  // ── Book I — Arthur's conception, Sword in the Stone ──────────
  2: [
    {
      id: "lm-1-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Arthur is begotten by Uther Pendragon on Igraine by what means?",
      options: [
        "A straightforward marriage",
        "Merlin magically transforms Uther to look like Igraine's husband (the Duke of Cornwall) on the night the Duke is killed in battle",
        "A political alliance",
        "Adoption by Merlin",
      ],
      correctIndex: 1,
      explanation:
        "Uther's magical impersonation — arranged by Merlin in exchange for Arthur's fostering — is the founding trickery of the Arthurian world. The stain of the conception (adultery-by-magic) shadows the kingship throughout.",
    },
    {
      id: "lm-1-2",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Sword in the Stone is set up how?",
      options: [
        "On a battlefield",
        "In a churchyard in London, with an anvil on top of the stone, inscribed *Whoso pulleth out this sword of this stone and anvil is rightwise king born of all England*",
        "At a lake",
        "On a mountaintop",
      ],
      correctIndex: 1,
      explanation:
        "The sword-and-anvil-in-stone scene is Malory's most famous moment. The inscription makes the test a public, legible sign of divine choice. Arthur, brought as squire to his foster-brother Kay's first tournament, pulls the sword — not knowing its meaning.",
    },
    {
      id: "lm-1-3",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Sword in the Stone is *not* Excalibur. Where does Arthur get Excalibur?",
      options: [
        "He finds it in a tomb",
        "From the Lady of the Lake — a hand reaches up from a lake holding the sword aloft, and Merlin tells Arthur to ask for it",
        "It's a gift from Guinevere",
        "It falls from heaven",
      ],
      correctIndex: 1,
      explanation:
        "The Sword in the Stone legitimizes Arthur's kingship; Excalibur (with its scabbard) comes later, from the Lady of the Lake. The two swords have often been confused in retellings. Excalibur's scabbard, not its blade, is its real magic — it prevents the wearer from losing blood in battle.",
    },
    {
      id: "lm-1-4",
      type: "true_false",
      difficulty: "Master",
      xpReward: 15,
      text: "Malory composed Le Morte d'Arthur while in prison; Caxton published it in 1485 shortly after Malory's death — making it both the last major English prose work completed before the age of print and the first English classic to exist only in printed form.",
      correctBool: true,
      explanation:
        "Malory's epilogue dates the work to 1469–70; Caxton's preface records the manuscript's reception and printing in 1485. No manuscript survives complete; the Winchester Manuscript (discovered 1934) differs from Caxton's edition and has reshaped the text's modern editorial history (Vinaver's three-volume *Works* of 1947).",
    },
  ],

  // ── Book II — Balin and Balan / the Dolorous Stroke ────────────
  29: [
    {
      id: "lm-2-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Balin, the 'Knight with Two Swords,' is the hero of Book II. What tragic act does he perform that has consequences for the entire Arthurian world?",
      options: [
        "He refuses the Grail",
        "He strikes the Dolorous Stroke — wounding King Pellam with the Spear of Longinus and laying waste three kingdoms — because of which the Grail Quest later becomes necessary",
        "He kills Arthur",
        "He marries Guinevere",
      ],
      correctIndex: 1,
      explanation:
        "The Dolorous Stroke — Balin's use of the sacred Spear of Longinus as a weapon of defense — wounds the Grail King (Pellam / the Maimed King) and wastes the surrounding lands. The wound is the precondition of the Grail Quest: the Fisher King must be healed. T. S. Eliot makes use of this in *The Waste Land*.",
    },
    {
      id: "lm-2-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Balin's story ends with what fatal irony?",
      options: [
        "He becomes king",
        "He and his brother Balan meet without recognizing each other and kill each other in combat — the Arthurian romance's starkest statement of mutual destruction",
        "He finds peace",
        "He marries a princess",
      ],
      correctIndex: 1,
      explanation:
        "The brothers' mutual unrecognized combat is one of Malory's sharpest scenes. The elegy is Malory's too: *And then came Balan the sorrowfullest of all knights, saying: O Balin my brother, thou hast slain me and I thee.* The episode anticipates Arthur and Mordred.",
    },
  ],

  // ── Book III — Marriage, Round Table Oath ──────────────────────
  48: [
    {
      id: "lm-3-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Arthur marries Guinevere and receives what as her wedding gift (from her father Leodegrance)?",
      options: [
        "A golden crown",
        "The Round Table — with room for 150 knights (or 100 in some manuscripts)",
        "The Holy Grail",
        "A fleet of ships",
      ],
      correctIndex: 1,
      explanation:
        "The Round Table is Leodegrance's wedding gift; Arthur populates it with knights, and Merlin institutes the annual renewal of the oath at Pentecost. The Table's circularity is its political meaning: no head, no precedence — a court of equals.",
    },
    {
      id: "lm-3-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The Pentecost oath requires Arthur's knights to do which of the following?",
      options: [
        "Only fight Saxons",
        "Never do outrage, refuse no mercy to those that ask it, give succor to ladies — and, most unusually for the period, never take up a cause for love nor for worldly goods (*always to flee treason, and to give mercy unto him that asketh mercy*)",
        "Only protect the Church",
        "Always obey their king",
      ],
      correctIndex: 1,
      explanation:
        "The Pentecost oath is the ethical charter of Malory's Arthurian world. Its combination of martial restraint, courtly protection, and self-discipline becomes the template for chivalric order — and its unraveling (Book XX) is the tragedy of the whole work.",
    },
  ],

  // ── Book IV — Morgan, Accolon ─────────────────────────────────
  63: [
    {
      id: "lm-4-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Morgan le Fay, Arthur's half-sister, tries to have Arthur killed by whom?",
      options: [
        "Mordred",
        "Sir Accolon — her lover — to whom she has given Excalibur and its scabbard, hoping he will kill Arthur in a tournament",
        "Launcelot",
        "Kay",
      ],
      correctIndex: 1,
      explanation:
        "Morgan's plot is one of the Malory's great set-pieces of political villainy within the royal family. Arthur and Accolon fight without recognition; Arthur's (unmagicked) sword shatters while Accolon wields Excalibur. The Lady of the Lake's intervention restores the true sword to Arthur's hand.",
    },
  ],

  // ── Book V — War with Roman Emperor Lucius ────────────────────
  91: [
    {
      id: "lm-5-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book V stages Arthur's war against:",
      options: [
        "The Saxons",
        "The Roman Emperor Lucius — Arthur refuses Rome's tribute, invades the continent, and (in Caxton's text) conquers as far as Rome itself",
        "King Ryons",
        "Morgan's forces",
      ],
      correctIndex: 1,
      explanation:
        "Book V adapts the old chronicle-tradition of Arthur as a second Alexander — continental conqueror, contender for world-empire. The Alliterative *Morte Arthure* (Malory's main source here) is one of the finest Middle English poems; Malory compresses its scope into continuous prose.",
    },
  ],

  // ── Book VI — Launcelot's Early Quests ────────────────────────
  103: [
    {
      id: "lm-6-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Launcelot is introduced fully in Book VI. What is his defining relationship from the start?",
      options: [
        "With Arthur",
        "With Queen Guinevere — Launcelot is her knight; every quest he undertakes is in her name, and his tragedy is already implicit in his praise",
        "With his father",
        "With the Grail",
      ],
      correctIndex: 1,
      explanation:
        "Launcelot's courtly service to Guinevere is made explicit from his first appearance; Malory never pretends the love is anything but erotic. The tragedy is set up as structural: the best knight is already bound to the queen, not the king.",
    },
  ],

  // ── Book VII — Gareth Beaumains ───────────────────────────────
  121: [
    {
      id: "lm-7-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Gareth (Gawain's younger brother) arrives at court anonymously and is nicknamed *Beaumains* — 'fair-hands' — by Kay the Seneschal. Why?",
      options: [
        "Because he's a good fighter",
        "Because he asks Arthur for nothing but meat and drink for a year, and Kay mocks him by calling him 'fair-hands' — a chamber-servant name. Gareth's whole tale is about proving his birth by deed",
        "Because of his weapons",
        "Because of his gold",
      ],
      correctIndex: 1,
      explanation:
        "Gareth's incognito year in the kitchen is Malory's clearest dramatization of the chivalric claim that *gentilesse* shows in action, not lineage — even though the tale eventually reveals the high-born truth. Kay's mockery is one of Malory's best-remembered character-bits.",
    },
  ],

  // ── Book VIII — Tristram begins ───────────────────────────────
  156: [
    {
      id: "lm-8-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Tristram is sent to Ireland to escort La Beale Isoud back to be the bride of:",
      options: [
        "His father",
        "King Mark of Cornwall — Tristram's uncle. On the sea voyage, Tristram and Isoud drink a love potion intended for Isoud and Mark, and fall hopelessly in love",
        "King Arthur",
        "Launcelot",
      ],
      correctIndex: 1,
      explanation:
        "The Tristram-Isoud love potion is the archetype of the adulterous courtly-love plot. Malory's Tristram books (VIII–X, nearly half the total work) transplant the continental Tristan-tradition into the English Arthurian matter, rewriting the standalone romance as part of the Round Table cycle.",
    },
  ],

  // ── Book IX — Tristram continues ──────────────────────────────
  197: [
    {
      id: "lm-9-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Tristram books (VIII–X) collectively function how in the structure of Le Morte d'Arthur?",
      options: [
        "As a brief digression",
        "As a massive sustained parallel to the Launcelot-Guinevere plot — Mark / Isoud / Tristram running alongside Arthur / Guinevere / Launcelot, with the two plots periodically crossing",
        "As a prequel",
        "As a comic interlude",
      ],
      correctIndex: 1,
      explanation:
        "Malory's great structural bet is that the Tristram cycle (imported from French sources) can be subordinated to the main Arthurian plot by making it a formal parallel. Tristram-Isoud and Launcelot-Guinevere function as mirror adulteries; the difference is that Isoud is genuinely loved by Mark's honor and Launcelot by Arthur's.",
    },
  ],

  // ── Book X — Longest Book (Tristram) ──────────────────────────
  241: [
    {
      id: "lm-10-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Book X is the longest of Malory's 21 books. Its scope includes:",
      options: [
        "Only combat",
        "Dozens of tournament scenes, Tristram's madness, his marriage to Isoud of the White Hands (confusingly not his Isoud), knight-errant episodes beyond count — a sprawl that many readers find challenging",
        "A single battle",
        "Only Launcelot's deeds",
      ],
      correctIndex: 1,
      explanation:
        "Book X's length has been a point of editorial anxiety since Caxton. Vinaver's 1947 *Works* edition reorganized Malory into eight tales, treating Tristram as a standalone tale, arguing against the single-unified-book reading. Which reading one prefers (Caxton's 21-book unity or Vinaver's tales-cycle) remains a major editorial choice.",
    },
  ],

  // ── Book XI — Galahad Conceived ───────────────────────────────
  329: [
    {
      id: "lm-11-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Elaine (daughter of King Pelles) conceives Galahad by Launcelot how?",
      options: [
        "A straightforward union",
        "She tricks him — using enchantment to appear as Guinevere — so that the son of the best knight must be born of deception, echoing Arthur's own conception",
        "Launcelot knows and agrees",
        "It happens in a dream",
      ],
      correctIndex: 1,
      explanation:
        "Galahad's deceptive conception is a deliberate Malorian echo of Arthur's: the best knight, like the best king, must be begotten by magical impersonation. The theological structure holds the two conceptions in parallel and suggests both are necessary for their respective achievements (kingship / Grail).",
    },
  ],

  // ── Book XII — Launcelot's Madness ────────────────────────────
  343: [
    {
      id: "lm-12-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Launcelot descends into madness in Book XII. What causes it?",
      options: [
        "Battle wounds",
        "Guinevere discovering that Launcelot has (unknowingly, through Elaine's trick) begotten Galahad — and rejecting him; Launcelot flees the court in his bare shirt, mad, and wanders for two years",
        "A spell from Morgan",
        "A curse from Merlin",
      ],
      correctIndex: 1,
      explanation:
        "The madness is one of Malory's most physically concrete scenes: Launcelot leaping from a window in his shirt, running into the forest, being mistaken for a wild man and made a court fool. It dramatizes how thoroughly Guinevere owns his identity — without her, he becomes unrecognizable even to himself.",
    },
  ],

  // ── Book XIII — Grail Quest Begins ────────────────────────────
  357: [
    {
      id: "lm-13-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Grail Quest opens at Pentecost with Galahad's arrival at Camelot. What empty seat does he fill?",
      options: [
        "Launcelot's",
        "The Siege Perilous — the seat at the Round Table reserved for the knight who will achieve the Grail; it kills any other who sits in it",
        "Arthur's",
        "Kay's",
      ],
      correctIndex: 1,
      explanation:
        "Galahad's arrival and his occupation of the Siege Perilous makes explicit the theological character of the Quest. The Grail appears in the hall, covered, and its ensuing vanishing sends every knight swearing an oath to seek it — the oath that will break the Round Table.",
    },
    {
      id: "lm-13-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Arthur's reaction to the Grail Quest oath is:",
      options: [
        "Enthusiasm",
        "Deep grief — he weeps, seeing that the oath will disperse his court and that many of his knights will not return; the Grail Quest is, from the King's perspective, already a loss",
        "Indifference",
        "Agreement",
      ],
      correctIndex: 1,
      explanation:
        "Arthur's tears on the Grail-Quest oath are one of Malory's subtle touches: the King perceives the political consequence of the theological ambition. The court will not survive the quest, whatever its spiritual outcome. Malory keeps both assessments active simultaneously.",
    },
  ],

  // ── Book XIV — Percival in the Quest ──────────────────────────
  377: [
    {
      id: "lm-14-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Percival's Grail adventures include which iconic scene?",
      options: [
        "A dragon-fight",
        "A temptation by a beautiful lady who turns out to be a demon — the recognition happens when Percival notices his cross, and the 'lady' melts away",
        "A sea voyage",
        "A tournament",
      ],
      correctIndex: 1,
      explanation:
        "Percival's temptation on the island is a direct carry-over from the Vulgate *Queste del Saint Graal*. The recognition-by-cross trope becomes a Grail-Quest topos; Malory preserves its brevity and intensity.",
    },
  ],

  // ── Book XV — Launcelot in the Quest ──────────────────────────
  387: [
    {
      id: "lm-15-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Launcelot's Grail adventures are distinguished by what?",
      options: [
        "Complete success",
        "Repeated partial success and partial failure — his sinful love of Guinevere prevents the full vision; he receives a glimpse but not the achievement",
        "Total withdrawal",
        "No participation",
      ],
      correctIndex: 1,
      explanation:
        "Launcelot's Grail chapters are the most affecting in the Quest because the best secular knight cannot achieve the spiritual goal. Malory makes this a specifically theological tragedy: the sin of adulterous love is not negated by its being refined into courtly devotion.",
    },
  ],

  // ── Book XVI — Bors in the Quest ──────────────────────────────
  393: [
    {
      id: "lm-16-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Bors completes the Grail Quest alongside Galahad and Percival because:",
      options: [
        "He is fastest",
        "He has committed only one sexual sin in his whole life — making him the 'almost-chaste' knight, the one whose ordinary virtue can still see the Grail",
        "He knows Merlin",
        "Arthur asked him",
      ],
      correctIndex: 1,
      explanation:
        "The Grail Quest's theology stratifies: Galahad (perfect purity, full vision), Percival (near-perfect, full vision), Bors (one flaw, partial but present). Launcelot is next down (major flaw, glimpse). Bors is Malory's most human Grail-achiever and the only one who returns alive to Camelot.",
    },
  ],

  // ── Book XVII — Galahad Achieves the Grail ────────────────────
  410: [
    {
      id: "lm-17-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Galahad achieves the Grail at Sarras. What happens to him immediately afterwards?",
      options: [
        "He returns to Camelot",
        "He dies — his final prayer is to be released from the body; angels carry his soul to heaven, and the Grail is taken up out of the world",
        "He becomes king",
        "He marries",
      ],
      correctIndex: 1,
      explanation:
        "Galahad's death at the moment of his success — the Grail achieved, the body now superfluous — is the Quest's final theological statement. The Grail's withdrawal from the world (it is not to be a permanent possession) means the Quest cannot be repeated. Camelot will have to live without it.",
    },
  ],

  // ── Book XVIII — Fair Maid of Astolat ─────────────────────────
  433: [
    {
      id: "lm-18-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Elaine of Astolat (*the Fair Maid of Astolat*) falls in love with Launcelot. What does she do when he cannot return her love?",
      options: [
        "Marries another knight",
        "Dies of grief — her body is placed in a boat that floats to Camelot with a letter in her hand explaining her love; Tennyson's *Lady of Shalott* descends from this scene",
        "Enters a convent",
        "Returns home",
      ],
      correctIndex: 1,
      explanation:
        "The Fair Maid's death-by-love and the funeral boat are among Malory's most affecting scenes, and among the most consequential for later English literature: Tennyson, Waterhouse, and the Pre-Raphaelites all return to it. Malory's tone is somehow both severe and tender.",
    },
  ],

  // ── Book XIX — Poisoned Apple / Knight of the Cart ────────────
  458: [
    {
      id: "lm-19-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The 'knight of the cart' scene involves Launcelot rescuing Guinevere from Meliagaunce — by riding in what conveyance?",
      options: [
        "A horse",
        "A cart — a shameful vehicle only used for criminals and peasants; Launcelot's acceptance of dishonor for Guinevere's sake is the ethical test of the scene",
        "A boat",
        "A chariot",
      ],
      correctIndex: 1,
      explanation:
        "The 'knight of the cart' trope — from Chrétien de Troyes's *Charrette* — becomes in Malory a test of courtly love's seriousness. Launcelot's hesitation of two steps before mounting the cart is the most famous moment in Chrétien; Malory compresses it into prose while keeping its ethical weight.",
    },
  ],

  // ── Book XX — Collapse of the Round Table ─────────────────────
  471: [
    {
      id: "lm-20-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The Round Table collapses in Book XX when:",
      options: [
        "A plague strikes",
        "Agravain and Mordred publicly expose Launcelot's adultery with Guinevere, forcing Arthur to act; the resulting war against Launcelot splits the knighthood and creates the opening Mordred exploits",
        "Arthur dies first",
        "The Grail is lost",
      ],
      correctIndex: 1,
      explanation:
        "The engine of the catastrophe is the public naming of what the court has long known privately. Malory stages this as political necessity rather than moral outrage: once named, the adultery cannot coexist with the legal order; Arthur has no choice but to try Guinevere and wage war on Launcelot.",
    },
    {
      id: "lm-20-2",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Launcelot kills Gareth and Gaheris during the rescue of Guinevere from the stake. Why does this matter so much?",
      options: [
        "They are unarmed",
        "Gareth (especially) was Launcelot's devoted admirer — he loved Launcelot above all other knights — and Gawain's grief at his brother's death turns Gawain into Launcelot's implacable enemy, preventing any possible reconciliation",
        "They had sworn fealty",
        "The king ordered it",
      ],
      correctIndex: 1,
      explanation:
        "The accidental kill of Gareth (and Gaheris) is the single irreparable event. Had it not occurred, Launcelot's rescue of Guinevere might have been forgivable; with it, Gawain's undying wrath keeps Arthur at war with Launcelot even when the king wavers. The war against Launcelot is what leaves Britain undefended against Mordred.",
    },
  ],

  // ── Book XXI — Death of Arthur ────────────────────────────────
  493: [
    {
      id: "lm-21-1",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "The final battle is fought against:",
      options: [
        "The Roman Empire",
        "Mordred — Arthur's son-nephew (begotten on his half-sister Morgause), who has seized the throne in Arthur's absence and tried to marry Guinevere",
        "Launcelot",
        "The Saxons",
      ],
      correctIndex: 1,
      explanation:
        "Mordred's rebellion closes the loop that opened with Arthur's own illegitimate conception. The work's tragic architecture is symmetrical: magical impersonation begets Arthur; incestuous rape begets Mordred; Mordred kills Arthur. Malory inherits this from the French *Mort Artu* but stages it with particular starkness.",
    },
    {
      id: "lm-21-2",
      type: "multiple_choice",
      difficulty: "Apprentice",
      xpReward: 5,
      text: "Before dying, Arthur commands Bedivere (the only surviving knight) to:",
      options: [
        "Go to Rome",
        "Throw Excalibur into the lake — which Bedivere tries to disobey twice, but on the third attempt the sword is caught by a hand rising from the water",
        "Kill Mordred",
        "Fetch Guinevere",
      ],
      correctIndex: 1,
      explanation:
        "The hurling of Excalibur scene (via Bedivere's twofold disobedience and third-time compliance) is one of Malory's most formally perfect. The arm emerges, brandishes the sword three times, and sinks — the ritual undoing of the original gift from the Lady of the Lake. The symmetry is the scene's meaning.",
    },
    {
      id: "lm-21-3",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "Arthur is carried away on a barge to:",
      options: [
        "Glastonbury, for burial",
        "Avalon — whose ambiguous status (literal island? allegorical otherworld? land of the dead? place of waiting and healing?) supports the *rex quondam rexque futurus* epitaph: 'the once and future king'",
        "Camelot",
        "France",
      ],
      correctIndex: 1,
      explanation:
        "Avalon's ambiguity — is it burial, waiting, or other-world transit? — is exactly Malory's restraint. He gives us both readings: the Glastonbury chapel-burial tradition *and* the return-prophecy. The epitaph *HIC IACET ARTHURUS REX QUONDAM REXQUE FUTURUS* resolves nothing; the 'once and future king' is preserved.",
    },
    {
      id: "lm-21-4",
      type: "true_false",
      difficulty: "Master",
      xpReward: 15,
      text: "Malory ends Le Morte d'Arthur with the deaths of Launcelot and Guinevere (in religious retirement) — not with Arthur's Avalon voyage — making the last mood not martial but penitential.",
      correctBool: true,
      explanation:
        "The final chapters follow Launcelot (priesthood) and Guinevere (nunnery) to their respective deaths in religion. Launcelot's burial scene — the archbishop's vision of angels raising him up — is the work's last image. Malory's ending is not battle-glory but renunciation, making *Le Morte d'Arthur* a penitent text despite its title.",
    },
  ],

  // ── Malory Master Trial ───────────────────────────────────────
  507: [
    {
      id: "lm-master-1",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The fundamental structural question in reading Malory — *is* Le Morte d'Arthur a single book or a collection of tales? — turns on which editorial choice?",
      options: [
        "Whether the title is accurate",
        "Caxton's 1485 edition divides into 21 books with numbered chapters; Vinaver's 1947 *Works* edition (based on the 1934-discovered Winchester Manuscript) divides into 8 tales and argues the tales were independent. Every modern edition takes one side or the other of this structural argument",
        "The length of each book",
        "Whether it is English",
      ],
      correctIndex: 1,
      explanation:
        "Caxton (continuous romance) vs. Vinaver (cycle of tales) is the live editorial argument. Norton Critical Editions typically use Vinaver's text with Caxton's book/chapter numbering for reference; teaching editions vary. The text in the Codex reader preserves Caxton's 21-book structure but surfaces Vinaver's tale-level articulation where possible.",
    },
    {
      id: "lm-master-2",
      type: "multiple_choice",
      difficulty: "Master",
      xpReward: 15,
      text: "Cross-reference: the Inferno V Francesca passage contains the famous line *Galeotto fu 'l libro e chi lo scrisse* — 'Gallehault was the book and its author.' Who is Galehault / Galeotto in the Arthurian tradition?",
      options: [
        "Arthur's uncle",
        "The Knight of the Cart; his name in French romance is that of the intermediary who arranges the first kiss between Launcelot and Guinevere, making the *Prose Lancelot* the original 'go-between' book. Dante uses his name as the shorthand for the whole genre of courtly-love romance that facilitates sin",
        "A wizard",
        "Mordred's father",
      ],
      correctIndex: 1,
      explanation:
        "The Dante-Malory cross-reference is the whole *Matter of Britain* in a single name: Galeotto / Galehault is the Arthurian go-between who made the Launcelot-Guinevere kiss happen, and his name becomes Italian slang for any erotic enabler. Inferno V names the romance-genre itself as the accomplice in Paolo and Francesca's sin. Malory has to reckon with the tradition Dante has already judged.",
    },
  ],

  // ── Arthurian Tradition Stretch ───────────────────────────────
  508: [
    {
      id: "lm-matter-1",
      type: "multiple_choice",
      difficulty: "Scholar",
      xpReward: 10,
      text: "The 'Matter of Britain' (Arthurian) joins the 'Matter of France' (Charlemagne / Roland) and the 'Matter of Rome' (Troy / Alexander / classical antiquity) as the three great cycles of medieval European romance. In the Codex catalog, the Matter of Britain is represented by which works?",
      options: [
        "Only Malory",
        "Malory's Le Morte d'Arthur (Caxton 1485) and Tennyson's Idylls of the King (1859–85) — Tennyson's Victorian reimagining consciously uses Malory as its primary source",
        "Only Tennyson",
        "None of the above",
      ],
      correctIndex: 1,
      explanation:
        "Tennyson's *Idylls* rework Malory's material for the Victorian era with notable editorial choices: the erotic frankness of Malory is muted, the Christian themes heightened, and the tragedy given a more explicitly moral coloring (Guinevere's 'guilt' is more emphatic). Reading Malory and Tennyson in sequence is reading the same story through two completely different moral vocabularies.",
    },
    {
      id: "lm-matter-2",
      type: "multiple_choice",
      difficulty: "Master",
      xpReward: 15,
      text: "Spenser's Faerie Queene (1590/1596) contributes to the Matter of Britain how?",
      options: [
        "It doesn't",
        "Spenser sets his Faerie Queene (Gloriana) as the allegorical descendant of Arthur's line, and weaves Arthur as a prince-in-training into every book. The poem's Tudor genealogy (Book II canto X) leads directly from Brutus-of-Troy through Arthur to Elizabeth; Spenser is reclaiming the Arthurian cycle as Tudor dynastic myth",
        "It retells only Tristram",
        "It is only philosophy",
      ],
      correctIndex: 1,
      explanation:
        "The Tudor appropriation of the Arthurian line — Henry VII named his first son Arthur with exactly this in mind — runs through Spenser and peaks in the Faerie Queene. The Arthur of the Faerie Queene is not the tragic king of Malory; he is the allegorical sovereign-in-training whose virtue will return in his descendant Elizabeth. Spenser depoliticizes the tragedy by incorporating Arthur into the genealogical myth.",
    },
  ],
}
