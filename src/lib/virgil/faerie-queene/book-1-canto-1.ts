import type { Annotation } from "../types"

// ── The Faerie Queene — Book I · Canto I ──────────────────────────────
// Hand-authored scholarly annotations. Standard Ebooks text (selectively
// modernized from the 1590 quarto). Chapter index post-canto-split:
// ch-2 in public/content/the-faerie-queene/ch-2.json.
//
// Density: 13 annotations. Opus-grade per spec Part 4 model allocation —
// Book I canto i (the poem's opening) is the first of the ten named Opus
// clusters. The cluster introduces, in this order: (1) Spenser's self-
// positioning against Virgil and Ariosto in the proem; (2) the Spenserian
// stanza as form; (3) the untested-virtue opening; (4) the St. George /
// Everyman allegorical doubleness; (5) Una as true-Church; (6) the Wood
// of Error and its Chaucerian catalogue; (7) Error's Protestant-polemical
// body; (8) Archimago and the sorcerer-hypocrite.
//
// A reader who works this cluster through should have what they need to
// keep the rest of Book I running without continuous annotation — the
// poem's double-register (literal adventure + sustained allegory) is
// established once and can then operate in the reader's hands alone.
//
// Cross-references cluster heavily into Orlando Furioso (Ariosto's
// warrior-maiden → Britomart, Ariosto's enchantress → Duessa, Ariosto's
// opening → Spenser's), Paradise Lost (Milton's Satan in disguise → the
// Archimago tradition, Milton's allegorical Sin → the Error progenitor),
// Aeneid (the opening "Ille ego" → Spenser's Virgilian self-positioning),
// and the Bible (Revelation 12–13 → the woman-and-dragon frame; Ephesians
// 6:10–17 → the Pauline armor).

export const FAERIE_QUEENE_BOOK_1_CANTO_1: Annotation[] = [
  // ── 1. The proem — Virgilian self-positioning ──────────────────────
  {
    id: "fq-1-1-proem-virgilian",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "Lo! I, the man whose Muse whylome did maske",
    anchorOccurrence: 1,
    title: "\"Lo! I, the man\" — Spenser positions himself against Virgil",
    quotedPassage:
      "Lo! I, the man whose Muse whylome did maske, / As time her taught, in lowly Shephards weeds, / Am now enforst, a farre unfitter taske, / For trumpets sterne to chaunge mine Oaten reeds, / And sing of Knights and Ladies gentle deeds",
    passageReference: "Book I, proem, stanza 1",
    commentary: `Every Renaissance reader in 1590 hears Virgil behind this opening. The lines that traditionally preceded the *Aeneid* — attributed to Virgil by Donatus and Servius, transmitted in countless Renaissance editions — are *Ille ego qui quondam gracili modulatus avena / carmen, et egressus silvis vicina coegi / ut quamvis avido parerent arva colono, / gratum opus agricolis; at nunc horrentia Martis / arma virumque cano*: "Lo, I who once tuned my song on a slender reed, then coming forth from the woods compelled the neighboring fields to obey the farmer, however greedy — a work welcome to husbandmen; but now the bristling arms of Mars and the man I sing."

The frame is poet-career progression: pastoral → georgic → epic. Virgil, in this traditional reading, had written the *Eclogues* (pastoral, the shepherd's reeds), then the *Georgics* (agricultural, the fields), and was now rising to the *Aeneid* (epic, arms and the man). Spenser is announcing that he has written the *Shepheardes Calender* (1579, pastoral, his lowly Shepherd's weeds) and is now — by the same Virgilian escalation — rising to epic.

The Ariostan shadow is audible too. *Orlando Furioso* opens *Le donne, i cavallier, l'arme, gli amori, / le cortesie, le audaci imprese io canto* — "Of ladies, knights, arms, loves, courtesies, daring deeds I sing." Spenser's "sing of Knights and Ladies gentle deeds" directly echoes Ariosto's *i cavallier, l'arme, gli amori*. The poet places himself in both lines: Virgilian moral epic *and* Italian chivalric romance-epic. The whole *Faerie Queene* will work out the inheritance from both.

The word *whylome* — "formerly, in times past" — is a Spenserian archaism (deliberately Chaucerian; used by Chaucer in the *Knight's Tale*, opening: "Whilom, as olde stories tellen us…"). Its presence in the poem's first line is programmatic: Spenser is signaling that he writes in an antique tongue, a Middle-English register imitated by a 1590 poet to secure moral weight the present tongue cannot carry.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid — the Ille ego incipit Spenser echoes. Renaissance editions of Virgil typically printed these four lines as the poem's opening before Arma virumque cano. The poet-career progression (pastoral → georgic → epic) is the frame Spenser claims.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "opening (Ille ego) + I.1 (Arma virumque cano)",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: "Arms, and the man I sing",
      },
      {
        type: "echo",
        description:
          "Ariosto's Orlando Furioso opens 'Le donne, i cavallier, l'arme, gli amori' — the four-part subject Spenser hears and condenses into 'Knights and Ladies gentle deeds.' The Italian chivalric-romance line runs directly through Spenser to Milton.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto I, stanza 1",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 1,
        targetAnchorText: "Of loves and ladies, knights and arms, I sing",
      },
      {
        type: "compare",
        description:
          "Milton will perform the same Virgilian self-positioning in reverse 77 years later — Paradise Lost opens without pastoral apology, announcing a subject 'above heroic' that requires 'no middle flight' (Book I.14). Spenser claims succession to Virgil; Milton claims supersession.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book I.1–26",
        targetBookId: "paradise-lost",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "linguistic"],
  },

  // ── 2. The invocation — Muse, Cupid, Mars, Elizabeth ───────────────
  {
    id: "fq-1-1-invocation",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "Helpe then, O holy Virgin! chiefe of nyne",
    anchorOccurrence: 1,
    title: "The four-part invocation — Muse, Cupid, Mars, Elizabeth",
    quotedPassage:
      "Helpe then, O holy Virgin! chiefe of nyne, / Thy weaker Novice to performe thy will; / Lay forth out of thine everlasting scryne / The antique rolles, which there lye hidden still, / Of Faerie knights, and fayrest Tanaquill",
    passageReference: "Book I, proem, stanza 2",
    commentary: `Spenser's proem builds in four stages — proem stanzas 1–4 invoke, in order, a Muse, Cupid, Mars, and Elizabeth. The pattern inherits from Virgil (Aeneid I's Muse-invocation) and Ariosto (Orlando Furioso's dedication to Ippolito d'Este) but the specific quadruple is Spenser's: epic proper plus the two divinities that govern the poem's twin registers (erotic / martial) plus the sovereign to whom the poem is addressed.

"Chief of nine" — the chief of the nine Muses is Calliope, Muse of epic poetry. Spenser does not name her explicitly; the scriptural-sounding *holy Virgin* calls attention to a characteristic Spenserian move, Christianizing pagan mythology. Calliope-as-Virgin borrows the register of Marian devotion while preserving the classical Muse's function. Spenser does this repeatedly: his classical machinery is always lightly baptized.

"Tanaquill" — an obscure name that repays unpacking. Tanaquil was the Etruscan queen of Rome, wife of Tarquinius Priscus, famed in Livy for her prophetic wisdom and for securing the throne for her husband and later for Servius Tullius. In *The Faerie Queene* it is Spenser's recondite name for Gloriana-Britomart's line: at III.iii.49 Merlin prophesies that Britomart's descendants will include "a royall virgin" (Elizabeth) through whose line "Tanaquill" (used as a praise-name) reaches her crown. The Letter to Ralegh confirms the identification. A first-time reader can hear: the Muse is asked to unroll the antique scrolls of Faerie knights, and of one supreme Queen behind them all.

"Scryne" is a shrine or reliquary — a container for sacred scrolls. The Protestant Spenser invokes, consciously, the vocabulary of Catholic relic-cult: the *relics* here are pagan-romance rolls of ancient story, and the *shrine* is the Muse's memory. The palace-theology of the Protestant reformer is being cross-wired with the furniture of the medieval religious imagination. That cross-wiring is the poem in miniature.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid opens with a Muse-invocation (I.8–11: 'Musa, mihi causas memora'). Spenser's four-stanza invocation is an extended version of the Virgilian formula, adapted to Christian allegory.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book I, lines 8–11",
        targetBookId: "the-aeneid",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 3. The Spenserian stanza — the form itself ─────────────────────
  {
    id: "fq-1-1-spenserian-stanza",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "A gentle knight was pricking on the plaine",
    anchorOccurrence: 1,
    title: "The Spenserian stanza — nine lines, ABABBCBCC, with the alexandrine closing",
    quotedPassage:
      "A gentle knight was pricking on the plaine, / Ycladd in mightie armes and silver shielde, / Wherein old dints of deepe woundes did remaine. / The cruell markes of many a bloodie fielde; / Yet armes till that time did he never wield. / His angry steede did chide his foming bitt, / As much disdayning to the curbe to yield. / Full jolly knight he seemd, and faire did sitt, / As one for knightly giusts and fierce encounters fitt.",
    passageReference: "Book I canto i, stanza 1 (first narrative stanza)",
    commentary: `This is the first stanza of narrative in *The Faerie Queene* — and the first-ever Spenserian stanza. Spenser invented the form here, in 1590. No English poem before this moment has nine-line stanzas rhyming ABABBCBCC with the closing line an alexandrine.

The structure, by eye: eight lines of iambic pentameter (five feet per line, ten syllables) followed by a ninth line of iambic hexameter (six feet, twelve syllables). Count this stanza: lines 1–8 read at pentameter ("A gentle knight was pricking on the plaine" — five stresses), and line 9 expands ("As one for knightly giusts and fierce encounters fitt" — six stresses, the alexandrine). The extra foot gives the closing line an extended, summative breath; it typically completes, deflates, or amplifies the preceding eight.

The rhyme — ABABBCBCC — interlocks the stanza more tightly than the ottava rima (ABABABCC) it derives from. Ariosto's stanza uses three A-rhymes and three B-rhymes before the closing CC couplet; Spenser uses two A-rhymes, four B-rhymes (overlapping the two tercets), and three C-rhymes (overlapping the closing couplet with the b-rhyme's final). The form is audibly *slower* than Ariosto's. The weight settles.

Why did he invent it? The form supplies what Spenser needs: the breath of a long poetic line (the closing alexandrine lets each stanza conclude with fuller rhetorical weight), the interlocked rhyme of continental romance (extending Ariosto's tighter Italian form), and enough space within the stanza for the slow amplification of allegorical meaning. A Spenserian stanza can hold a moral emblem whole.

Optionally, enable the "Highlight alexandrines" toggle in the reader header to surface the ninth-line signature visually. The form is the point; once you hear it, every stanza's closing line becomes an event.

The archaism *ycladd* — a past-participial *y-* prefix (from Old English *ge-*) attached to *clad* — is pure Chaucer. Chaucer uses the same construction constantly ("Ful wel she soong the service dyvyne, / Entuned in hir nose ful semely, / And Frenssh she spak ful faire and fetisly"). Spenser writes in 1590 as if he were writing in 1390. The double time-shift is the poem's atmosphere.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Ottava rima (ABABABCC) — the Italian form Spenser is modifying. Ariosto's Orlando Furioso and Byron's Don Juan both use it. Where ottava rima closes on a 2-line couplet that snaps, Spenser's Spenserian stanza closes on a single alexandrine that expands. Two genuinely different rhythmic settlements.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Canto I, stanza 1",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Chaucer's Knight's Tale and Troilus and Criseyde — the stock of archaic vocabulary Spenser draws on. Spenser's y-participles, his whylome, his ycladd, his eke are Chaucerian borrowings meant to signal antique moral gravity.",
        workTitle: "The Canterbury Tales",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "Knight's Tale, passim",
        targetBookId: "the-canterbury-tales",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["linguistic", "literary-influence"],
  },

  // ── 4. The old armor — Pauline, Everyman, untested ─────────────────
  {
    id: "fq-1-1-armor-pauline",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "Ycladd in mightie armes and silver shielde",
    anchorOccurrence: 1,
    title: "Armor with \"old dints of deepe woundes\" — Pauline, Everyman, untested",
    quotedPassage:
      "Ycladd in mightie armes and silver shielde, / Wherein old dints of deepe woundes did remaine. / The cruell markes of many a bloodie fielde; / Yet armes till that time did he never wield.",
    passageReference: "Book I canto i, stanza 1, lines 2–5",
    commentary: `Spenser establishes, in four lines, the single most load-bearing emblem of the whole book: a young knight wearing battle-scarred armor that he himself has never wielded.

The Pauline reading is primary. In Ephesians 6:10–17 Paul exhorts Christians to put on "the whole armour of God": the breastplate of righteousness, the shield of faith, the helmet of salvation, the sword of the spirit. The armor does not belong to any single Christian; it belongs to the faith, and every Christian who takes it up wears a set of equipment that has been used before. The *old dints* are the marks of every Christian who has worn this armor and fought in it. Redcrosse, untested, nonetheless puts on equipment that already remembers many fights.

This is also the Everyman frame. Book I is not only Redcrosse's story — it is the Christian-soul's story, told through him, in which the reader's own pilgrimage is figured. The armor is never *merely* his; it is always also *yours, the reader's, when you begin.*

And the old dints foreshadow. Every fall that Redcrosse suffers in Book I — the deceptive dream at the end of canto i, the Fidessa/Duessa seduction in canto ii, the House of Pride in canto iv, the fall to Orgoglio in canto vii, the temptation of Despair in canto ix — corresponds to a fall every previous Christian who wore this armor has already suffered. The knight is new; the pattern of his falls is not. That recognition is what gives Book I its gravity.

A smaller but honest note: *Ycladd* — the y-prefixed past participle — is Spenser signaling at once. The second line of the narrative carries a deliberate Chaucerian archaism. The poem is announcing that it is old-speech, old-moral, old-story. The Old-English *ge-*clad is the morphology; the visible commitment is to a pre-Reformation moral-literary inheritance being reassembled in a post-Reformation Protestant epic.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Ephesians 6:10–17 — 'Put on the whole armour of God.' The breastplate of righteousness, shield of faith, helmet of salvation, sword of the spirit. Spenser's arms-never-wielded-but-dented figures exactly Paul's armor: received by every Christian, worn-by-many before any particular wearer.",
        workTitle: "The Bible (Ephesians)",
        workAuthor: "St. Paul",
        passageReference: "Ephesians 6:10–17",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 5. The bloody Cross — Redcrosse as St. George + Everyman ───────
  {
    id: "fq-1-1-bloody-cross",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "And on his brest a bloodie Crosse he bore",
    anchorOccurrence: 1,
    title: "\"A bloodie Crosse\" — St. George, England, every Christian",
    quotedPassage:
      "And on his brest a bloodie Crosse he bore, / The deare remembrance of his dying Lord, / For whose sweete sake that glorious badge he wore, / And dead, as living, ever him ador'd",
    passageReference: "Book I canto i, stanza 2",
    commentary: `The red cross on the knight's breast is operating at four registers simultaneously, and Spenser intends all four to be present.

**The private devotion.** He wears the red cross because he remembers his dying Lord (Christ) and adores him — the simplest and most personal level. Before the allegory builds, the cross is first his private confession of faith.

**The heraldic identity.** The red cross on white (Argent a Cross Gules) is the heraldic device of St. George, patron saint of England. The cross of St. George is the flag of England in 1590, as it is in 2026 — it is the national symbol that flew at Agincourt, at Bosworth, and at the defeat of the Armada two years before this poem was published. Readers recognize their country's banner on its hero's breast.

**The typological St. George.** The knight's quest, we will learn at canto xii, is to kill a dragon besieging Una's parents' kingdom. The dragon of Book I canto xi–xii is identified with the dragon of Revelation 20. Redcrosse, killing the Revelation-dragon, is St. George killing the dragon who besieged the princess — the national-legendary form of the cosmic-apocalyptic act. Book I's whole arc is the allegorical-typological identification of the Christian soul with St. George with England with the Church Militant.

**The Everyman.** Any Christian reader who wears a cross — literally or metaphorically — wears what this knight wears. The private devotion (register 1) loops back: Redcrosse's cross is also *yours*.

These four registers are not alternatives. Spenser's sustained allegory (the "dark conceit" of the Letter to Ralegh) means all four are present at once. A reading that picks one and drops the others — e.g., "this is only about England" or "this is only about the Christian soul" — misrepresents the doubleness (here, quadrupleness) the poem actually operates in.`,
    crossReferences: [
      {
        type: "typological",
        description:
          "Revelation 20 — the angel with the key of the bottomless pit casts the dragon down and binds him. The dragon-fight of Book I canto xi–xii pays off this opening emblem; St. George's dragon IS the dragon of Revelation, and Redcrosse's arc IS the Christian apocalyptic frame.",
        workTitle: "The Bible (Revelation)",
        workAuthor: "St. John the Divine",
        passageReference: "Revelation 20:1–3",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "historical", "philosophical"],
  },

  // ── 6. Gloriana named ──────────────────────────────────────────────
  {
    id: "fq-1-1-gloriana-named",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "That greatest Gloriana to him gave",
    anchorOccurrence: 1,
    title: "Gloriana — the Queene who is not seen",
    quotedPassage:
      "Upon a great adventure he was bond, / That greatest Gloriana to him gave, / That greatest Glorious Queene of Faerie lond, / To winne him worshippe, and her grace to have, / Which of all earthly things he most did crave",
    passageReference: "Book I canto i, stanza 3",
    commentary: `Gloriana is named in the poem's fourth narrative stanza — and is not seen. That will be true throughout the completed six books. Gloriana is referred to, promised, implied, remembered, but never directly shown; the poem's title figure is in the blind spot of every scene she sets in motion.

This is deliberate structural theology. In the Letter to Ralegh, Spenser specifies that Gloriana holds an annual feast at which she dispatches twelve knights on twelve quests — and that he will write the twelve books that tell the twelve quests, with Book XII, the *feast itself*, reserved as the climactic final book. He never wrote Book XII. Gloriana stays offstage because the book that would have staged her was never completed.

But that formal lack is also a working theology. Gloriana in the Letter to Ralegh is Elizabeth I-as-glory; the sovereign as the *general intention* of the poem's address. The reader does not see her directly in the poem because one does not see an English subject's sovereign directly either — one sees her portraits, her processes, her courtiers, her proclamations, her sent-out knights. Spenser builds a poem whose sovereign is always present in effect and never present in person. That reproduces Elizabethan experience of Elizabeth exactly.

The phrase "her grace to have, / Which of all earthly things he most did crave" is worth hearing. The knight's motive is not heroism, not doctrine, not glory — it is *her grace*. The lover-of-Gloriana is the soldier-of-Christ here, the two dedications fused. Love for the Queene and love for the Lord are presented as one act. That is the Elizabethan-Protestant devotional-political ideal the whole poem serves.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Beatrice in the Divine Comedy is similarly always ahead of Dante — seen, then lost, then seen only in refracted glimpses until Paradiso. Both poems structure a quest around a woman-figure who is partly sovereign, partly beloved, partly the soul's theological object.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Purgatorio XXX–XXXIII; Paradiso passim",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 7. Una's first appearance ──────────────────────────────────────
  {
    id: "fq-1-1-una-first-appearance",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "A lovely Lady rode him faire beside",
    anchorOccurrence: 1,
    title: "Una unnamed — on a lowly ass, with a white lamb",
    quotedPassage:
      "A lovely Lady rode him faire beside, / Upon a lowly Asse more white than snow, / Yet she much whiter; but the same did hide / Under a vele, that wimpled was full low; / And over all a black stole she did throw",
    passageReference: "Book I canto i, stanzas 4–5",
    commentary: `Spenser gives Una four stanzas before he names her — and he never names her in canto i. The lady who will become, in the whole Book I, the figure of the true Church, is introduced here by emblem rather than title. A reader is meant to decode her from her appurtenances.

**The lowly ass.** Christ's entry into Jerusalem is "sitting on an ass, and a colt the foal of an ass" (Matthew 21:5, fulfilling Zechariah 9:9). The ass is the humility-mount, the anti-warhorse. Una rides a meek animal; the man beside her, Redcrosse, rides an "angry steede" whose chafing at the bit she does not share. The two mounts contrast directly — martial pride and evangelical humility side by side.

**Whiter than snow.** The lady is whiter than the snow-white ass. *Whiter than snow* is Psalm 51:7's baptismal image: "wash me, and I shall be whiter than snow." Una's whiteness is not cosmetic; it is sacramental. She is purity because she has been washed.

**The veil and black stole.** Her radiance is hidden. The veil (wimple) covers her face; the black stole covers her body. The true Church, in Protestant allegorical reading, is often *hidden* in this world — persecuted, unrecognized, wearing the weeds of mourning while her true radiance is unseen. The black stole also gestures at mourning for her captive parents (the dragon-besieged kingdom the knight rides to save).

**The milkwhite lamb** (two stanzas later: "in her line, a milkewhite lambe she lad"). The lamb is Christ — Revelation 14:1's "Lamb on Mount Zion," Revelation 21:9's "bride, the Lamb's wife." Una leads the Lamb because the true Church is the Lamb's bride; she travels with Christ because she is his espoused.

Strict pair. Una's four-stanza introduction establishes the palette for the whole book. Every later figure — Duessa especially — is contrasted against this opening emblem. The first impression is: white-and-hidden, mounted humbly, leading the Lamb. Hold that image; it is the rule against which every Book I deception is measured.`,
    crossReferences: [
      {
        type: "typological",
        description:
          "The woman clothed with the sun of Revelation 12 — 'a woman clothed with the sun, and the moon under her feet' — besieged by the dragon. Una + Lamb + dragon-besieged kingdom IS Revelation 12's apocalyptic frame transposed into chivalric romance.",
        workTitle: "The Bible (Revelation)",
        workAuthor: "St. John the Divine",
        passageReference: "Revelation 12:1–6",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "philosophical"],
  },

  // ── 8. The Wandring Wood and the tree-catalogue ────────────────────
  {
    id: "fq-1-1-wandring-wood",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "the wandring wood, this Errours den",
    anchorOccurrence: 1,
    title: "The Wandring Wood — Dante's selva oscura reset for Protestant allegory",
    quotedPassage:
      "'Fly, fly!' (quoth then / The fearefull Dwarfe,) 'this is no place for living men.' / But full of fire and greedy hardiment, / The youthfull knight could not for ought be staide; / But forth unto the darksome hole he went, / And looked in: his glistring armor made / A little glooming light, much like a shade; / By which he saw the ugly monster plaine, / Halfe like a serpent horribly displaide, / But th'other halfe did womans shape retaine",
    passageReference: "Book I canto i, stanzas 12–14",
    commentary: `Spenser's Wandring Wood is one of the most deliberate literary allusions in the poem. It is Dante's *selva oscura* — the dark wood of *Inferno* I — reset for Protestant England.

Dante opens the *Commedia*: *Nel mezzo del cammin di nostra vita / mi ritrovai per una selva oscura, / ché la diritta via era smarrita* — "In the middle of the journey of our life I came to myself in a dark wood, for the straight way was lost." The poet is lost; a Virgil arrives; the journey is organized by a guide.

Spenser repeats the wood — but the resolution is radically different. There is no Virgil in Faery Land. Redcrosse enters the wood and must *himself* fight and kill its resident monster. Protestant pedagogy replaces Catholic guidance: the Christian soul, armed with the Pauline armor, confronts Error without intermediary. The knight's dwarf tries to warn him; he doesn't listen. This is Spenser's first lesson: the knight of Holiness must learn to read for himself.

The tree-catalogue just before the cave (stanzas 8–9: "The sayling Pine, the Cedar proud and tall, / The vine-prop Elme, the Poplar never dry, / The builder Oake, sole King of Forrests all, / The Aspine good for staves, the Cypresse funerall…") is Spenser's inheritance of a Chaucerian convention — Chaucer lists thirteen trees in the *Parliament of Fowls*. In both poets the catalogue is a *seduction*: the beauty of the list, each tree with its attribute and use, pulls the knight deeper into the wood. The pleasure of cataloguing *is the mechanism of error*. Aesthetic variety stands in for the moral confusion of paths; the knight is lost not because the wood is ugly but because its variety is charming.

The lesson here, condensed into the stanza before the monster: "Fly, fly!" The dwarf knows. Holiness does not yet. Before any doctrinal falsehood, the first error is the aesthetic one — preferring variety to the straight way.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Dante's Inferno opens in a selva oscura. Spenser is directly echoing — same figure of moral disorientation as a dark wood — but resolves it radically differently: no Virgil-guide, the Protestant knight fights the allegorical monster alone. The rhyme is exact and the theological correction is pointed.",
        workTitle: "The Divine Comedy",
        workAuthor: "Dante Alighieri",
        passageReference: "Inferno I.1–3",
        targetBookId: "the-divine-comedy",
        targetChapterNumber: 1,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Chaucer's tree-catalogue in the Parliament of Fowls (lines 176–182: thirteen trees named with their attributes) is the direct model for Spenser's twelve-tree Wandring Wood catalogue. Spenser copies the convention and the rhythm; he turns it from courtly ornament into moral trap.",
        workTitle: "Parliament of Fowls",
        workAuthor: "Geoffrey Chaucer",
        passageReference: "lines 176–182",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["literary-influence", "philosophical"],
  },

  // ── 9. Error — the serpent-woman ───────────────────────────────────
  {
    id: "fq-1-1-error-monster",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "the ugly monster plaine, Halfe like a serpent horribly displaide",
    anchorOccurrence: 1,
    title: "Error — half serpent, half woman, the first monster of the poem",
    quotedPassage:
      "By which he saw the ugly monster plaine, / Halfe like a serpent horribly displaide, / But th'other halfe did womans shape retaine, / Most lothsom, filthie, foule, and full of vile disdaine",
    passageReference: "Book I canto i, stanza 14",
    commentary: `Spenser's first monster is a composite — half serpent, half woman — and the composite is itself the allegorical point.

The classical sources are several and merged. The Hydra (Lerna's many-headed serpent killed by Hercules) contributes the serpentine lower half and the brood-of-young that will emerge in the next stanzas. Echidna — "the snake who is half a nymph, with glancing eyes and fair cheeks, but the other half is a monstrous snake" (Hesiod, *Theogony* 297–300) — is the direct classical source for the half-woman/half-serpent design. Ovid's *Metamorphoses* contributes the hybrid-body principle as allegorical method.

The theological source is biblical. Genesis 3's serpent in the garden — the tempter who first deceives Eve — is the Christian antitype for every allegorical serpent in medieval Christian iconography. And Revelation 12's "great red dragon" and Revelation 17's "great whore" sitting on the dragon-beast combine in late-medieval and Reformation iconography into the composite *Whore-of-Babylon* figure — woman on serpent, woman as serpent — that Protestant polemicists routinely used as the type of the corrupt Church.

Spenser's Error, therefore, is:
- The Hydra of classical heroism (Redcrosse-as-Hercules, a chivalric tradition)
- Eve's serpent of Christian narrative (the source of all error)
- The Whore of Babylon of Protestant polemic (the Roman Church read typologically)

The next few stanzas will confirm the third register unmistakably — she vomits *bookes and papers*. That detail does not belong to the classical Hydra or to Eve's serpent. It belongs to the Reformation reading in which error is made of *writing*, and the Roman Church is the author of that error. Hold the hybrid form of this first monster in mind; it is Spenser's template for every false-appearance figure in the poem. Duessa beneath her beauty will have something of the same body.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Hesiod's Theogony 297–300 describes Echidna, the half-nymph half-serpent — Spenser's direct classical source for the hybrid design. Ovid's Metamorphoses contributes the broader principle of allegorical hybridity.",
        workTitle: "Theogony",
        workAuthor: "Hesiod",
        passageReference: "lines 297–300",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Milton's Sin, in Paradise Lost II.648ff, is half-beautiful-woman, half-serpent, with a brood of hounds howling inside her womb. The design is unmistakably Spenser's Error — Milton read the Wandring Wood stanzas closely and adapted the hybrid figure as his own allegorical Sin at Hell-gate.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book II.648ff",
        targetBookId: "paradise-lost",
        targetChapterNumber: 2,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },

  // ── 10. Error vomits books — the Reformation frame ─────────────────
  {
    id: "fq-1-1-error-vomits-books",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "Her vomit full of bookes and papers was",
    anchorOccurrence: 1,
    title: "Error vomits books — the Reformation reading made explicit",
    quotedPassage:
      "Her vomit full of bookes and papers was, / With loathly frogs and toades, which eyes did lacke, / And creeping sought way in the weedy gras",
    passageReference: "Book I canto i, stanza 20",
    commentary: `This is the detail that pins the allegorical register. Error's emitted matter is *books and papers*, along with the unclean creatures of plague and pollution. No classical Hydra vomits books. The detail belongs specifically to the Protestant-Reformation reading of Error as the Roman Catholic Church, its theology, and its Counter-Reformation polemic.

The context in 1590: Elizabethan England is twenty-two years into Elizabeth's settlement. The Marian persecutions (1553–58) and the English refugees who fled to Geneva have shaped an English Protestant self-understanding that identifies Catholic theology with *error flowing from Rome in the form of printed matter*. The Geneva Bible (1560) and John Foxe's *Acts and Monuments* (1563, revised 1570) — the "Book of Martyrs" — are the defining Elizabethan Protestant texts, and both are explicitly countering the *books and papers* of Rome. Spenser's line-by-line theology is Foxean.

The "loathly frogs and toades" borrow from Revelation 16:13: "I saw three unclean spirits like frogs come out of the mouth of the dragon, and out of the mouth of the beast, and out of the mouth of the false prophet." The frogs-of-the-apocalypse converge with the books-of-Rome into a single allegorical image: Error's body is excreting, *now*, the matter that Revelation prophesied would issue from the beast's mouth in the last days.

A contemporary Elizabethan reader would have no difficulty with this identification. It is not a subtle allegory; it is polemically direct. The more *interesting* reading is how Spenser handles the polemic. Error is not caricatured. She is a real monster, dangerous, the knight nearly dies in her coils — Protestantism here takes its theological enemy *seriously*, which is precisely why it must be killed and not ignored. A polemic that insisted error was silly would not require the struggle Redcrosse must wage. Spenser's respect for the strength of what he opposes is the sign of his polemical seriousness.

A modern reader can hold the theology at a critical distance. One is not required to agree with Spenser's Protestant identifications to read the allegory working at the level Spenser intended. The polemic *is* the allegory here; reading around it collapses the poem.`,
    crossReferences: [
      {
        type: "source",
        description:
          "Revelation 16:13 — unclean spirits 'like frogs' issuing from dragon, beast, and false prophet. Spenser's frogs-and-toads beside the books are Revelation's apocalyptic signs; the allegorical identification of Rome-as-beast with the Whore of Babylon is the standard Protestant-polemical reading of the 1580s, codified in Foxe's Book of Martyrs.",
        workTitle: "The Bible (Revelation)",
        workAuthor: "St. John the Divine",
        passageReference: "Revelation 16:13",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "philosophical"],
  },

  // ── 11. Error's brood — self-destroying heresy ─────────────────────
  {
    id: "fq-1-1-error-brood",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "A thousand yong ones, which she dayly fed",
    anchorOccurrence: 1,
    title: "Error's brood — heresy devouring itself",
    quotedPassage:
      "Of her there bred / A thousand yong ones, which she dayly fed, / Sucking upon her poisnous dugs; each one / Of sundrie shapes, yet all ill favored: / Soone as that uncouth light upon them shone, / Into her mouth they crept, and suddain all were gone.",
    passageReference: "Book I canto i, stanza 15",
    commentary: `Error's brood flees the light back into her mouth, and later — after the knight beheads their mother — devour her body. The allegorical figure is double: *heresy's offspring are too numerous to be killed one by one, but they consume themselves when the source is cut*.

Scripturally: Revelation 12's "great red dragon" has seven heads; the image of multi-headed / proliferating evil is standard apocalyptic. Jesus's "brood of vipers" (Matthew 3:7, 12:34, 23:33) is the rhetorical tradition Spenser inherits — applied by John the Baptist and Jesus to the religious leaders who were, in Protestant polemical reading, the prototype of the corrupt Catholic Church. The brood is the inheritors of their mother's error.

Structurally: Spenser gives the reader a quiet lesson about allegorical combat. Redcrosse cannot kill a thousand young serpents one by one; the numbers are prohibitive. But he does not *need* to. When he kills the mother, the brood consume her. The allegorical point: kill the source — the root theological error — and its descendants will destroy themselves in the absence of renewal.

There is, deliberately, something horrible in the image of the young devouring the mother — and Spenser is unflinching about it. Heresy is like this, he is saying; it feeds on what it comes from; it destroys its own origin when its origin ceases to nourish it. A polemic about Protestant anti-Catholic identification becomes, at this moment, something slightly more general: every false doctrine survives by being fed, and when the feeding stops, its derivatives do not persist; they consume their own ground. That is not a comforting image of theological victory; it is a slightly terrifying one.

Also — and honestly — Spenser is relishing this in the way Elizabethan polemicists relished graphic anti-Roman imagery. The Foxean rhetorical tradition routinely described Catholic theology in terms of blood, corruption, unclean bodies, consuming offspring. Spenser inherits that rhetorical register. A modern reader has to register it as period rhetoric and not flinch from it; the flinching that erases it also erases Spenser's Reformation.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Jesus's 'generation of vipers' / 'brood of vipers' rhetoric (Matthew 3:7; 12:34; 23:33) frames Error's brood as the inheritors of theological corruption. Spenser writes in a rhetorical tradition that reads the Roman Church as the continuation of that brood.",
        workTitle: "The Bible (Matthew)",
        workAuthor: "St. Matthew",
        passageReference: "Matthew 3:7; 12:34; 23:33",
        targetBookId: null,
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["philosophical", "historical"],
  },

  // ── 12. Archimago — hypocrisy, the sorcerer-hermit ─────────────────
  {
    id: "fq-1-1-archimago-introduced",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "Archimago",
    anchorOccurrence: 1,
    title: "Archimago — the sorcerer whose piety is disguise",
    quotedPassage:
      "At length they chaunst to meet upon the way / An aged Sire, in long blacke weedes yclad, / His feete all bare, his beard all hoarie gray, / And by his belt his booke he hanging had; / Sober he seemde, and very sagely sad […] \"Hether\" (quoth he,) \"me Archimago sent, He that the stubborne Sprites can wisely tame\"",
    passageReference: "Book I canto i, stanzas 29–34",
    commentary: `Error was the first monster — the first *doctrinal* enemy. Archimago is the second — and the first *deceptive* enemy. The distinction matters. Error is monstrous, visibly wrong, fightable. Archimago is a hermit, a pious old man with bare feet and a book at his belt, and nothing about his appearance warns of what he is.

Spenser has just written a sequence in which the knight killed a half-serpent monster that vomited books. Now the poet turns and places, in Redcrosse's path, a man with a book at his belt — the same book-prop, now in a human hand, now belonging to a character who tells the knight he is *heading to pray*.

The name *Archimago* — Greek *archi-* ("chief, arch-") + *magos* ("magician, sorcerer") — is transparent to any Renaissance humanist reader. He is the chief of enchanters. The etymology is Spenser's unsubtle warning to *his* reader; it is emphatically not available to Redcrosse inside the poem. The knight, unschooled in Greek etymology, sees a holy hermit. The reader, who knows Greek, sees a chief-magician. This is Spenser's most explicit teaching about how to *read* his poem: the knight's perception is not yours, and you know more than he does.

The theological register is specifically Protestant. Archimago represents, allegorically, *hypocrisy* — the Catholic friar-monk-confessor figure who appears holy (the traditional religious habit, the beads, the book of hours) and is at a deeper level an agent of theological corruption. The bare feet signal mendicant monasticism; the hoary beard signals ascetic age; the book signals supposed learning. All three traits are marks of Catholic religious authority that the Protestant allegorist is *deliberately* attaching to the sorcerer. A Catholic reader of 1590 would be insulted; a Protestant reader would be instructed.

What Archimago is going to do, in the next thirty stanzas, is manufacture a false dream for Redcrosse — sending an imp to Morpheus to fetch a seductive phantasm of Una, then staging a false Una in the knight's bed. The deception is a pattern Milton will directly inherit: in Paradise Lost IV, Satan will whisper in the ear of the sleeping Eve, manufacturing a dream of paradisal temptation. The scenes are formally parallel, and Milton's borrowing is acknowledged rather than concealed. The shape-shifting, dream-fabricating, ascetic-disguised sorcerer tradition runs from the Archimago tradition to Milton's Satan directly.`,
    crossReferences: [
      {
        type: "compare",
        description:
          "Milton's Satan in Paradise Lost IV adopts multiple disguises (cormorant, toad, angelic visitor) to reach Eve. The Archimago model — the shape-shifting enchanter who approaches the sleeping Christian with manufactured dreams — is directly inherited. Milton names Archimago's shape-shifting as a source when he says Satan 'could gain access by disguises not to be suspected.'",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV.799–809; I.563ff",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
      {
        type: "source",
        description:
          "Ariosto's Atlante — the sorcerer-illusionist of Orlando Furioso who builds an iron castle of illusion to protect Ruggiero — is the immediate formal source for the allegorical-sorcerer tradition Spenser inherits. The difference: Atlante is benevolent-deluded (he wants to save Ruggiero from his prophesied death); Archimago is malicious-doctrinal. Spenser Christianizes Ariosto's sorcerer-figure.",
        workTitle: "Orlando Furioso",
        workAuthor: "Ludovico Ariosto",
        passageReference: "Cantos II–IV, XII, XXII",
        targetBookId: "orlando-furioso",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence", "historical"],
  },

  // ── 13. The false dream — hell's agency in hypocrisy's service ─────
  {
    id: "fq-1-1-false-dream-pluto",
    bookId: "the-faerie-queene",
    chapterNumber: 2,
    anchorText: "blacke Plutoes griesly Dame",
    anchorOccurrence: 1,
    title: "The false dream — Archimago summons from the classical underworld",
    quotedPassage:
      "He bade awake blacke Plutoes griesly Dame; / And cursed heven; and spake reprochful shame / Of highest God, the Lord of life and light; / A bold bad man, that dar'd to call by name / Great Gorgon, Prince of darknes and dead night, / At which Cocytus quakes, and Styx is put to flight.",
    passageReference: "Book I canto i, stanza 37",
    commentary: `Archimago's means of manufacturing the false dream reaches into the classical underworld — and Spenser's language here is worth close attention because it is where the Christian-allegorical and the pagan-mythological machinery fuse most tightly in canto i.

*Blacke Pluto's griesly Dame* — Proserpina, queen of the classical underworld. *Great Gorgon, Prince of darknes* — a peculiar formulation; Gorgon in classical tradition is the Medusa-figure, not a prince. Spenser uses the name Gorgon ambiguously as a demon-prince, possibly with Demogorgon in view (the primal underworld figure Boccaccio reifies in *Genealogia Deorum*). *Cocytus* is the Lamentation river of Hades; *Styx*, the hate-river. Spenser is using the full toolkit of classical-underworld vocabulary.

But the theology is not classical. The *blasphemies* — "cursed heven, and spake reproachful shame / Of highest God" — place Archimago's sorcery in a specifically Christian-demonic frame. The classical machinery is retained (the names Proserpina, Pluto, Styx, Cocytus) but the moral frame is Christian: Archimago is in league with *hell*, and the names of hell can be either classical or scriptural because, in the Spenserian theological synthesis, pagan hell *is* Christian hell, and classical demonology *is* Christian demonology under different names.

This fusion is Renaissance Christian humanism in compressed form. The classical is not rejected; it is absorbed. Proserpina is a Christian demon wearing her pagan name. This is also the method of Milton, writing 70 years later — Paradise Lost's fallen angels have names like Moloch, Chemos, Belial (biblical) and Mammon (biblical) but also descend from explicitly classical-mythological imagery; Milton weaves biblical and classical demonology into a single fallen-angel machinery Spenser has already perfected here.

The direct model for the sorcerer-summons-dream sequence is Aeneid IV, where Juno and Iris conspire to send a dream-vision to Dido. Spenser's scene is that sequence reworked with Archimago in the role of a human-agent sorcerer and hell-in-place of heavenly machinery. Virgil's comparable scene is the technical template; the moral theology is inverted (Virgil's Juno is acting in error-of-passion; Spenser's Archimago is acting in deliberate malice).`,
    crossReferences: [
      {
        type: "source",
        description:
          "Virgil's Aeneid IV contains the template dream-manufacturing scene — Iris dispatched to release Dido's hair to Proserpina. Spenser adapts the machinery: a sorcerer rather than a goddess, hell rather than Olympus, malice rather than compassion, but the shape of dream-manufacturing-by-supernatural-agent is Virgilian.",
        workTitle: "The Aeneid",
        workAuthor: "Virgil",
        passageReference: "Book IV.693–705",
        targetBookId: "the-aeneid",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
      {
        type: "compare",
        description:
          "Milton's Paradise Lost IV: Satan at Eve's ear, manufacturing a dream of the forbidden fruit ('Squat like a toad, close at the ear of Eve, / Assaying by his devilish art to reach / The organs of her fancy'). Milton's direct formal descendant of Archimago's dream-fabrication — same mechanics, same target (the sleeping innocent), same theological polemic against dream-deception.",
        workTitle: "Paradise Lost",
        workAuthor: "John Milton",
        passageReference: "Book IV.799–809",
        targetBookId: "paradise-lost",
        targetChapterNumber: 4,
        targetAnchorText: null,
      },
    ],
    tags: ["mythological", "literary-influence"],
  },
]
