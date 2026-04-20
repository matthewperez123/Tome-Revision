import type { Annotation } from "../types"

// ── Orlando Furioso Canto I — hand-authored scholarly annotations ──────
// Standard Ebooks text. Translation: William Stewart Rose, 1823–31.
// Chapter index: ch-1 in public/content/orlando-furioso/ch-1.json.
// Canto I is ~80 ottava rima stanzas. Anchors are stanza-level where a
// frame annotation is appropriate, line-level where a specific phrase
// needs close reading. Anchor strings match the Rose/SE HTML exactly.
//
// Density: 12 annotations. Opus-authored per spec Part 4 model allocation
// — Canto I is one of the spec's demo-critical clusters.
//
// The single most important annotation for a first-time reader of this
// poem is `of-1-boiardo-orientation`. Orlando Furioso begins mid-story:
// characters, motives, and quarrels that the reader is assumed to know
// from Boiardo's unfinished *Orlando Innamorato* (1495). Without this
// orientation the reader gives up by Canto II. With it, they keep going.

export const ORLANDO_FURIOSO_CANTO_1: Annotation[] = [
  // ── 1. Boiardo orientation — THE load-bearing annotation for this poem ──
  {
    id: "of-1-boiardo-orientation",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "Roland, who long the lady of Catày",
    anchorOccurrence: 1,
    title: "Before you begin — what Ariosto assumes you already know",
    quotedPassage:
      "Roland, who long the lady of Catày, / Angelica, had loved, and with his brand / Raised countless trophies to that damsel gay, / In India, Median, and Tartarian land, / Westward with her had measured back his way; / Where, nigh the Pyrenees, with many a band / Of Germany and France, King Charlemagne / Had camped his faithful host upon the plain.",
    passageReference: "Canto I, stanza 5 · OF I.5",
    commentary: `*Orlando Furioso* begins mid-story. Ariosto is continuing Matteo Maria Boiardo's *Orlando Innamorato* ("Orlando in Love"), a romance in ottava rima that Boiardo left unfinished at his death in 1494. When Ariosto's poem opens, its readers are assumed to know everything Boiardo has just told them. First-time readers today are not assumed to know any of it. Here is what you need.

**Angelica** is the daughter of the king of Cathay (the medieval European name for China). In Boiardo, she arrived at Charlemagne's court at Paris, pretended to be a damsel in distress, and by her beauty effectively paralyzed the Frankish war effort. Every major paladin fell in love with her — Orlando most of all, but also his cousin Rinaldo, Ferraù the Saracen, Sacripante the king of Circassia, and others. In Boiardo she repeatedly lures paladins away from the war by pretending to return their love, then escaping.

**Orlando** (Italian for Roland — the same paladin as the hero of the French *Chanson de Roland*) has followed Angelica to India, Media, and Tartary, winning her battles and killing her enemies. The opening of *Furioso* picks him up returning west with her.

**Charlemagne**, camped in the Pyrenees, has been routed by the Saracen invader **Agramante** (Africa) and **Marsilius** (Spain) — this is the battle that opened the canto. In the rout, Charlemagne took Angelica from Orlando and put her in the custody of Duke Namo of Bavaria, promising her as a reward to whichever knight fights best. When the tents fell in the general collapse, Angelica fled.

**Rinaldo** (French: Renaud), Orlando's cousin, has also been mad for Angelica since Boiardo — but there is a complication: in Boiardo, Rinaldo drank from a fountain in Ardennes that cured him of love for her, while Angelica drank from a matching fountain that inspired love in her. Boiardo's Rinaldo therefore hated her while she loved him. In *Furioso* the fountains are reversed: now Rinaldo loves her, and she flees him. That reversal is what stanzas 76–78 are about. Without this, the fountain-reversal passage is simply opaque.

**Ferraù** is the Saracen who has dropped his helmet in the stream. **Sacripante** is the king of Circassia, who is about to show up weeping under a fountain. **Ruggiero** — the hero of the dynastic plot — has not yet appeared but will soon. **Bradamante** — the warrior maiden — is the knight who unhorses Sacripante at the canto's end.

Ariosto assumes you know all of this. The spec for this book insists on a single orientation annotation at the opening, not a constant drip of context. Everything from Canto II onward becomes clear once you have this paragraph.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Direct continuation. Boiardo's Orlando Innamorato (1495, unfinished) is the source of Angelica, the paladins' pursuit, the fountain-reversal, and every character in the opening canto. Ariosto picks up Boiardo's threads mid-stride and refines the narrative interlace technique Boiardo inherited from medieval romance.",
        workTitle: "Orlando Innamorato",
        workAuthor: "Matteo Maria Boiardo",
        passageReference: "Boiardo I–III (1483–94, unfinished)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "historical"],
  },

  // ── 2. The opening — Virgilian incipit, reset for Ferrara ──
  {
    id: "of-1-opening-incipit",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "Of loves and ladies, knights and arms, I sing",
    anchorOccurrence: 1,
    title: "\"Of loves and ladies, knights and arms, I sing\" — the Virgilian incipit, reset for Ferrara",
    quotedPassage:
      "Of loves and ladies, knights and arms, I sing, / Of courtesies, and many a daring feat; / And from those ancient days my story bring, / When Moors from Afric passed in hostile fleet, / And ravaged France, with Agramant their king, / Flushed with his youthful rage and furious heat; / Who on king Charles', the Roman emperor's, head / Had vowed due vengeance for Troyano dead.",
    passageReference: "Canto I, stanza 1 · OF I.1",
    commentary: `The Italian original is *Le donne, i cavallier, l'arme, gli amori, / le cortesie, le audaci imprese io canto*. Every Renaissance reader in 1516 hears Virgil's *Arma virumque cano* — "Arms and the man I sing" — behind it. The echo is deliberate and programmatic.

Virgil sings *arma* — a single subject, the matter of war — and *virumque*, a single man. Ariosto expands the subject into four: *le donne* (women), *i cavallier* (knights), *l'arme* (arms), *gli amori* (loves). The classical epic's severity opens outward into the larger inventory of romance. The *cortesie* (courtesies) and *audaci imprese* (daring exploits) that follow fix the register: this is an epic that has swallowed chivalric romance whole.

Rose's English — "Of loves and ladies, knights and arms, I sing" — reorders Ariosto's list (loves first, then ladies, then knights, then arms) but preserves the four-part subject. The English reader hears a lineage: Virgil → Ariosto → (three centuries later) Byron, who will open his own ottava rima epic *Don Juan* with "I want a hero: an uncommon want" — the deliberate negation of the same incipit tradition. Byron learned that move from this opening stanza.

Worth knowing: Ariosto's world is Ferrara, not Rome. The opening's address to "King Charles, the Roman emperor" names Charlemagne — but it is Charlemagne as understood from the Italian romance tradition (Pulci's *Morgante*, Boiardo's *Innamorato*), where the Frankish court is the stage for Italian chivalric fantasy rather than a historically grounded Carolingian Europe.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "The source Ariosto is echoing. Virgil's 'Arma virumque cano' — 'Arms and the man I sing' — is the canonical Latin epic incipit. Ariosto's expansion from one subject to four is the programmatic difference between classical epic and the Italian romance-epic he is consolidating.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, line 1",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: "Arms, and the man I sing",
      },
      {
        type: "parody",
        description:
          "Byron's Don Juan, opening in the same ottava rima, begins 'I want a hero: an uncommon want' — the deliberate inversion of Ariosto's opulent four-part subject. Byron names Ariosto as his formal model more than once. The two incipits are a demo-critical pair for the Romance-Epic curriculum.",
        workTitle: "Don Juan",
        workAuthor: "Lord Byron",
        passageReference: "Canto I, stanza 1",
        targetBookId: "don-juan",
        targetChapterNumber: 2,
        targetAnchorText: "I want a hero: an uncommon want",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 3. Ottava rima — the form ──
  {
    id: "of-1-ottava-rima",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "Flushed with his youthful rage and furious heat",
    anchorOccurrence: 1,
    title: "Ottava rima — the form Ariosto perfected",
    quotedPassage:
      "And ravaged France, with Agramant their king, / Flushed with his youthful rage and furious heat; / Who on king Charles', the Roman emperor's, head / Had vowed due vengeance for Troyano dead.",
    passageReference: "Canto I, stanza 1, lines 5–8 · OF I.1.5–8",
    commentary: `*Ottava rima* — eight lines of eleven syllables rhyming ABABABCC — is the stanza form of the Italian narrative tradition: Boccaccio used it for the *Filostrato*, Poliziano for the *Stanze*, Pulci for the *Morgante*, Boiardo for the *Innamorato*. Ariosto is where the form reaches its first full articulation.

The structure is six lines of alternating rhyme followed by a closing couplet. The six lines accumulate a thought, an image, or an action; the couplet closes, comments, or twists. In Ariosto's hands the couplet is often where the narrator speaks in his own voice — where the *sententia* lands, where the irony enters, or where the stanza snaps to the next movement.

Rose's English renders the rhyme scheme with varying fidelity. The Italian is *canto / ancora / tanto / ancora / amanti / ancora / morto / Troiano* — and if you read this for rhyme you hear that Rose has preserved the ABABABCC structure but with English approximations. Where Rose's rhyme reaches, we'll flag it. Where the original Italian is famously virtuosic and the English flattens, we'll cite the Italian with a literal English crib so you can savor the original.

Byron 300 years later picked up the form for *Don Juan* in 1819 and did for English what Ariosto did for Italian: turned the closing couplet into the engine of the poem's wit. The comedy of both poems lives in those last two lines.

Toggle "Show rhyme scheme" in the reader header to surface the ABABABCC structure visually — the six setup lines receive faint A/B alternating marks, and the closing couplet is tinted. The feature is off by default; the point is the form, not the exam.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Byron's Don Juan is Orlando Furioso's direct formal descendant — same stanza, same closing couplet as engine of wit, same continuously-present digressive narrator. Byron named Ariosto as his model explicitly. The two poems share more formal DNA than any other pair in this catalog.",
        workTitle: "Don Juan",
        workAuthor: "Lord Byron",
        passageReference: "Canto I, stanza 1",
        targetBookId: "don-juan",
        targetChapterNumber: 2,
        targetAnchorText: "I want a hero: an uncommon want",
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 4. Canto-opening proem — dedication to Ippolito ──
  {
    id: "of-1-ippolito-dedication",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "Good seed of Hercules",
    anchorOccurrence: 1,
    title: "The dedication to Cardinal Ippolito d'Este — court poetry, named honestly",
    quotedPassage:
      "Good seed of Hercules, give ear and deign, / Thou that this age's grace and splendour art, / Hippolitus, to smile upon his pain / Who tenders what he has with humble heart. / For though all hope to quit the score were vain, / My pen and pages may pay the debt in part; / Then, with no jealous eye my offering scan, / Nor scorn my gifts who give thee all I can.",
    passageReference: "Canto I, stanza 3 · OF I.3",
    commentary: `The poem is dedicated to Cardinal Ippolito d'Este (1479–1520), Ariosto's employer and patron between 1503 and 1517. Ippolito was the brother of Duke Alfonso I of Ferrara, a prince of the Church at eighteen, a military commander, a famously hard man to serve. Ariosto worked for him as a household gentleman and diplomatic agent; the relationship was often strained (Ippolito did not love the poem — he is supposed to have asked Ariosto, "Where did you find all this nonsense?"), and Ariosto eventually transferred to Alfonso's service.

"Good seed of Hercules" refers to the Este family's claimed descent, through Azzo d'Este, from Hector and thereby from the Trojan royal line. The conceit matters: Ariosto will spend the poem weaving the House of Este into a classical-inheritance fantasy, and the dedication is where that frame is set.

Be clear about what this is. It is court poetry. Ariosto was a working courtier writing for a powerful patron, and the panegyric passages throughout the poem — the parade of Este descendants in Canto III, the painted hall in Canto XXXIII, the wedding-feast catalogue in XLVI — are court commissions wearing romance clothes. This is neither disqualifying (Virgil praised Augustus, Dante pressed his patrons into the cosmology) nor erasable. What it means for the reader is that when Ariosto turns to the Este in a given passage, you are reading poetry whose genre is different from the passage five stanzas earlier. Annotation will flag it.

There is also an ironic stratum. The late Canto XXXV passage in which St. John explains to Astolfo, on the moon, that poets have always flattered princes and that Hector and Achilles were probably nothing like what Homer made of them — this is Ariosto's own self-commentary on his own encomia. The poem knows what it is doing when it flatters.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 5. The narrative interlace — entrelacement ──
  {
    id: "of-1-interlace",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "But follow we Angelica, who flies",
    anchorOccurrence: 1,
    title: "Entrelacement — the medieval-romance technique Ariosto refines",
    quotedPassage:
      "Furious, in chase of him, Rinaldo hies. / But follow we Angelica, who flies.",
    passageReference: "Canto I, stanza 32, lines 7–8 · OF I.32.7–8",
    commentary: `*Entrelacement* (French: "interlacing") is the narrative technique inherited from the 13th-century French prose romances: follow one thread until a natural pause, drop it, pick up another, suspend that in turn, return to the first later. The Vulgate Cycle (Lancelot-Grail) formalized it; Boiardo's *Innamorato* took it up for the Italian ottava rima romance; Ariosto refines it to virtuosity.

This is the first visible instance in *Furioso*. Rinaldo sets off after his lost horse Bayardo; Ariosto immediately interrupts — "But follow we Angelica, who flies" — and the thread of Rinaldo's pursuit is dropped. It will resume elsewhere, sometimes many cantos later.

Over 46 cantos Ariosto will run roughly five major storylines in parallel: Orlando and Angelica, Ruggiero and Bradamante, Astolfo and the hippogriff, the framing war between Charlemagne and Agramante, and the poet's own digressions. They weave through each other; any canto can take up any of them without warning; and a storyline can go silent for 10 or 20 cantos before resuming.

This is why the reader interface for this book includes a **Storylines sidebar**. When you open a canto it shows which threads appear, summarizes what happens to each in this canto, and lets you jump back to the most recent previous appearance of any thread. Without it, *Furioso* is hard to hold in the mind at scale — casual readers give up by Canto X. With it, the braiding is the pleasure instead of the obstacle.

After this one annotation, the interlace will not be flagged again. The sidebar does the running work; this annotation names the technique that makes it necessary.`,
    crossReferences: [],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 6. The fountain-reversal — why Angelica flees Rinaldo ──
  {
    id: "of-1-fountain-reversal",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "And this effect two different fountains wrought",
    anchorOccurrence: 1,
    title: "The Ardennes fountains — why Rinaldo now loves and Angelica now flees",
    quotedPassage:
      "And this effect two different fountains wrought, / Whose wonderous waters different moods inspire. / Both spring in Arden, with rare virtue fraught: / This fills the heart with amorous desire: / Who taste that other fountain are untaught / Their love, and change for ice their former fire. / Rinaldo drank the first, and vainly sighs; / Angelica the last, and hates and flies.",
    passageReference: "Canto I, stanza 78 · OF I.78",
    commentary: `This is the point in the canto where knowing Boiardo matters most. In Boiardo's *Innamorato*, Angelica arrived at Charlemagne's court already in love with Rinaldo — she had drunk from the Fountain of Love in the forest of Ardennes (not Belgium's Ardennes but a romance-geography forest that also holds Merlin's tomb). Rinaldo, who had drunk from the Fountain of Disdain, hated her. Boiardo's plot for much of his poem is her pursuing him while he flees.

Between Boiardo and Ariosto, the fountains are reversed. The mechanism is not explained in *Furioso*; Ariosto simply announces the reversal here and proceeds. In *Furioso*, Rinaldo has drunk from the Fountain of Love and now loves her; she has drunk from the Fountain of Disdain and now flees him. The mid-canto chase scene — Angelica panicking through the wood at the sight of Rinaldo — is only intelligible with this as context.

The reversal is thematically load-bearing. Ariosto is showing love as a physics (literally, a fluid) rather than a choice, and the poem's repeated lesson about erotic pursuit — that it is always mis-timed, that lovers and loved are never simultaneously available to each other — has its engine here. The fountain-physics will recur; watch for Orlando's own madness in Canto XXIII, which is its most extreme instance.

Ariosto also places the fountains in Arden/Ardennes — a borrowed locus from the French romance tradition — and then gives Merlin's tomb an entirely different location (a cave, reached in Canto III). The romance geography of *Furioso* is a patchwork of inherited sites; Ariosto assembles rather than invents.`,
    crossReferences: [
      {
        type: "source",
        description:
          "The fountain motif is inherited directly from Boiardo's Innamorato; the reversal is Ariosto's. Boiardo had Angelica loving and Rinaldo hating; Ariosto inverts the pairing without narrative explanation, and the inversion is the engine of Canto I's chase sequence.",
        workTitle: "Orlando Innamorato",
        workAuthor: "Matteo Maria Boiardo",
        passageReference: "Innamorato I.iii, II.xv (fountain episodes)",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "mythological"],
  },

  // ── 7. Ferraù and the helmet-vow — the Matter-of-France intertext ──
  {
    id: "of-1-ferraus-vow",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "Then by Lanfusa's life the warrior swore",
    anchorOccurrence: 1,
    title: "Ferraù's helmet vow — Durindana and the Matter of France",
    quotedPassage:
      "Then by Lanfusa's life the warrior swore, / Never in fight, or foray would he use / Helmet but that which good Orlando bore / From Aspramont, where bold Almontes paid / His life a forfeit to the Christian blade.",
    passageReference: "Canto I, stanza 30 · OF I.30",
    commentary: `Ariosto is drawing on two centuries of Italian reworkings of the Carolingian cycle. The helmet Ferraù wants to win from Orlando is the one Orlando took from Almonte at the battle of Aspromonte — a founding episode of the young Orlando's career, told in the Italian anonymous romance *Aspramonte* (~1350) and several descendants. Lanfusa is Ferraù's mother; swearing by her life is the Saracen equivalent of the most solemn paladin-oath.

The broader backdrop is the Matter of France: Charlemagne's wars with the Saracens as the European romance tradition elaborated them across five centuries. The three "Matters" medieval writers distinguished were of Rome (classical antiquity), of Britain (Arthur), and of France (Charlemagne). *Orlando Furioso* is primarily of France, lightly of Britain in its Arthurian borrowings (Merlin, the grail-adjacent forest geography), and steeped in Rome through the classical-epic structure Ariosto imposes on the chivalric material.

Orlando's sword, Durindana (mentioned elsewhere in the canto), is the Italianized form of the French *Durendal* from the *Chanson de Roland*. Ariosto's poem stands inside a tradition that has already begun to collapse "Roland" into "Orlando" — French epic hero redrawn by Italian romancers as a paladin whose love-quest takes precedence over the Roncevaux martyrdom. The *Chanson de Roland*'s climactic disaster is always shadowing *Furioso*, because every reader knew Roland would eventually die at Roncevaux. Ariosto's Orlando is on a detour the reader knows cannot be permanent.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 8. Sacripante's lament — the rose-simile ──
  {
    id: "of-1-sacripante-rose",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "The virgin has her image in the rose",
    anchorOccurrence: 1,
    title: "\"The virgin has her image in the rose\" — the simile Spenser stole",
    quotedPassage:
      "The virgin has her image in the rose / Sheltered in garden on its native stock, / Which there in solitude and safe repose, / Blooms unapproached by sheperd or by flock. / For this earth teems, and freshening water flows, / And breeze and dewy dawn their sweets unlock: / With such the wistful youth his bosom dresses. / With such the enamoured damsel braids her tresses.",
    passageReference: "Canto I, stanza 42 · OF I.42",
    commentary: `Sacripante's lament, delivered under the fountain before he sees Angelica, is built around one of the most influential similes in European poetry: the virgin-as-rose on the native stock, beautiful only while it is unplucked. The conceit is classical — Catullus 62 ("ut flos in saeptis secretus nascitur hortis") is the ultimate source — but Ariosto's expansion here became the standard for every Renaissance poet who touched it.

Spenser's *Faerie Queene* II.xii.74–75 translates it almost line for line for the Bower of Bliss passage ("Ah! see the Virgin Rose, how sweetly shee / Doth first peepe foorth with bashfull modestee"). Tasso picks up the rose-virgin in *Gerusalemme Liberata* XVI.14–15. Milton remembers it in *Paradise Lost* IX.425–33 when he describes Eve among her flowers. The chain is unbroken from Catullus to Milton, and Ariosto is the pivot: everyone after him is citing him citing Catullus.

The ironic frame matters. Sacripante is not a detached moralist; he is a desperate man about to attempt the rape of a sleeping woman. The simile's loveliness is in a speech whose speaker is preparing violence — and Angelica is secretly listening. Ariosto will, across the poem, repeatedly tuck his most beautiful rhetoric inside characters whose situation undercuts it. The rose-stanzas are both a real thing of beauty (Renaissance readers copied them into commonplace books) and, in context, the self-justification of a man about to attack an unconscious woman. Both are true at once.`,
    crossReferences: [
      {
        type: "echo",
        description:
          "Paradise Lost IX.425–33 echoes this simile for Eve among her flowers in the temptation scene. Milton knew Ariosto's poetry intimately; the Eve-as-rose motif runs straight from Catullus through Ariosto to Milton.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IX, lines 425–433",
        targetBookId: "paradise-lost",
        targetChapterNumber: 9,
        targetAnchorText: "Eve separate he spies",
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 9. The canto structure — no cleanly-landing plot ──
  {
    id: "of-1-structure-unclosed",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "But what ensued between the haughty pair",
    anchorOccurrence: 1,
    title: "The canto does not close — Ariosto's rule for endings",
    quotedPassage:
      "But what ensued between the haughty pair / I in another canto shall declare.",
    passageReference: "Canto I, stanza 80, lines 7–8 · OF I.80.7–8",
    commentary: `Ariosto's rule is that a canto should end with a storyline still in motion. Here Canto I breaks off in mid-combat: Rinaldo charges at Sacripante with Angelica mounted behind him, and the canto closes before the fight resolves. Canto II will open on it.

This is characteristic. Ariosto will very rarely end a canto at a natural resting point; the canto-break is deliberately an interruption, the way a storyteller in an oral tradition breaks for the night. Boiardo had used the same device, and Ariosto inherits and perfects it. The effect is that the 46 cantos are not 46 closed units but 46 cuts in one continuous narrative fabric.

Watch the closing couplets of subsequent cantos: they usually promise to resume in the next, often naming the speaker or character whose arc has just been suspended. The formula — "another canto shall declare" — is a signature. It is the ottava rima version of "But that is another story."

This is also why the Storylines sidebar is load-bearing. Because Ariosto's cantos don't close their threads, the reader returning after a break can end up with five different open threads from five different cantos. The sidebar tracks them so you can surface the one you care about.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },

  // ── 10. Bradamante's unannounced entrance ──
  {
    id: "of-1-bradamante-entrance",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "Bradamant who marred",
    anchorOccurrence: 1,
    title: "Bradamante's entrance — the dynastic heroine named almost in passing",
    quotedPassage:
      "Bold is the maid; but fairer yet than bold, / Nor the redoubted virgin's name I veil: / 'Twas Bradamant who marred what praise of old / Your prowess ever won with sword and mail.",
    passageReference: "Canto I, stanza 60 · OF I.60",
    commentary: `Bradamante's first appearance in the poem is withheld from the reader: she rides in armor, unhorses Sacripante, and rides off without speaking; a messenger arrives afterward to name her. Ariosto is withholding deliberately.

Bradamante is the female protagonist of the dynastic plot — she will, across the poem, fall in love with the Saracen hero Ruggiero, go through multiple separations, fight her way across Europe, and eventually marry Ruggiero at the poem's end. Their children are, in the poem's mythology, the founding line of the House of Este — Ariosto's patrons. She is the closest thing *Furioso* has to a single heroine of record.

Naming her here in passing, after she has already demonstrated her prowess, is a quiet declaration that this poem will not organize its women around their introductions. Angelica, whom we have been following for 60 stanzas, has no knightly agency; Bradamante, whom we have just watched unhorse a king, has no court presentation. Ariosto is dividing his female characters into two registers — the pursued beauty (Angelica, Olimpia, Isabella) and the armed agent (Bradamante, Marfisa) — and this stanza, casually, sets up the second.

The *querelle des femmes* — the Renaissance debate over women's capacity — runs through the poem. It is complicated. Ariosto sometimes defends women (Canto XXXVII's long proem), sometimes gives voice to misogynist tales (Canto XXVIII's Giocondo novella), sometimes laughs at both positions. Reading the women of the poem means reading his positioning in this debate alongside his characters' behavior. Bradamante, riding out of view in armor, is the debate's strongest single piece of evidence.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },

  // ── 11. Bayardo — the horse that remembers Angelica's kindness ──
  {
    id: "of-1-bayardo-memory",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "For good Bayardo had in memory",
    anchorOccurrence: 1,
    title: "Bayardo's memory — the horse as creature of feeling",
    quotedPassage:
      "Then to the maid he goes submissively, / With gentle blandishment and humble mood; / As the dog greets his lord with frolic glee, / Whom, some short season past, he had not viewed. / For good Bayardo had in memory / Albracca, where her hands prepared his food, / What time the damsel loved Rinaldo bold; / Rinaldo, then ungrateful, stern, and cold.",
    passageReference: "Canto I, stanza 75 · OF I.75",
    commentary: `Bayardo, Rinaldo's wondrous horse, recognizes Angelica from the days she had fed him at Albracca (in Boiardo's *Innamorato*) — when she loved Rinaldo and he did not love her. The horse remembers; the human participants do not, or do but in the reversed configuration.

The detail is small and perfect. Ariosto's animals, in this poem, are very often the locus of the memory and continuity that human lovers lack. Bayardo here; later, Orlando's mare; the hippogriff that bears Astolfo through the air with its own inscrutable moods; Alcina's transformed ex-lovers, vegetable and mineral but still essentially present. Ariosto's world is full of feeling things that are not human, and their memories and attachments are sometimes more stable than the people's.

The allusion to Albracca is another Boiardo moment. Albracca is the besieged Cathayan fortress in *Innamorato* where Angelica's father Galafron was threatened and where the siege narrative of Boiardo's second book plays out. Ariosto is quietly gathering the loose ends of his predecessor's unfinished work.`,
    crossReferences: [],
    tags: ["literary-influence"],
  },

  // ── 12. Rose's translation — what the reader is actually reading ──
  {
    id: "of-1-rose-translation",
    bookId: "orlando-furioso",
    chapterNumber: 1,
    anchorText: "bonnibel",
    anchorOccurrence: 1,
    title: "Rose's English — what you're actually reading",
    quotedPassage:
      "Of loves and ladies, knights and arms, I sing",
    passageReference: "Canto I, stanza 1, line 1 · OF I.1.1",
    commentary: `This translation is William Stewart Rose's 1823–31 ottava rima version, published by John Murray in eight volumes. Rose was a minor poet and translator, a friend of Byron's (Byron actually consulted Rose while writing *Don Juan*), and — at the point when he sat down to Ariosto — a man in his forties with the time and patience for a project that would occupy him for almost a decade.

What Rose does well: he preserves the ottava rima form faithfully, he keeps Ariosto's narrative voice recognizable as a voice rather than flattening it to prose, and he resists the Victorian impulse to smooth out the poem's sensuality or its irony. The 19th-century English is mannered but not distorting.

What Rose does less well: his rhymes frequently require awkward syntactic inversions ("The knight more lightly through the forest hies / Than half-clothed churl to win the cloth of red"), his lexicon sometimes reaches for 19c archaisms that Ariosto's polished Italian would not have tolerated, and at the stanza level he often gives up a clever original rhyme for a serviceable English one.

Why Rose nonetheless? Because the two modern English Orlando Furiosos that literary readers praise — Guido Waldman's 1974 prose and Barbara Reynolds's 1975 Penguin verse — are both copyrighted and cannot ship in this reader. David Slavitt's 2009 verse is abridged. Rose's is the only complete, public-domain English Orlando Furioso, and it is, within its limits, not a betrayal.

Where Rose's English falls short of the Italian in a load-bearing way, annotations will note it. The spec for this book explicitly requires that we be honest about what is Ariosto and what is Rose. Ariosto wrote for three centuries of Italian readers; Rose wrote for English readers who mostly would never hear the original. You are reading a translator doing his best.`,
    crossReferences: [],
    tags: ["linguistic", "historical"],
  },
]
