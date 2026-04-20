/**
 * Divine Comedy chapter trials — per-canto questions across all 100
 * cantos of the *Commedia*, plus capstone trials for each canticle and
 * the poem as a whole.
 *
 * ChapterIndex layout (matches public/content/the-divine-comedy/ch-*.json):
 *   0..33   — Inferno Canto I..XXXIV
 *   34..66  — Purgatorio Canto I..XXXIII
 *   67..99  — Paradiso Canto I..XXXIII
 *   100     — Virgil's Blessing Trial (post-Purg XXX; awards the
 *              "Virgil's Blessing" Seal)
 *   101     — Commedia Master Trial (awards the "Pilgrim's Vision" Seal)
 *   102     — Classical Triad stretch (Virgil+Dante; completes Epic
 *              Succession when combined with the three Homeric/Virgilian
 *              master trials)
 *
 * Coverage policy:
 *   - Flagship cantos (Inf I, V, XXVI, XXXIII, XXXIV; Purg I, IX, XXX;
 *     Par I, XXXIII) carry 3–5 questions each across Foundational,
 *     Scholar, and Sage difficulties.
 *   - Other canonical cantos (Inf III, X, XIX; Purg II, XI, XXII;
 *     Par III, XI, XV) carry 2 questions.
 *   - Remaining cantos carry a single Foundational question to keep the
 *     reader's quiz surface non-empty; depth lands in a subsequent pass.
 *
 * Merged at lookup time by `getQuestionsForChapter` in
 * chapter-questions.ts. Schema matches `ChapterQuestion` in that file.
 *
 * Translation reference: Henry Wadsworth Longfellow (1867), the
 * Standard Ebooks edition. Question text quotes Longfellow verbatim;
 * explanations name the Italian where it matters for the scholarly
 * point (e.g. *selva oscura*, *contrapasso*, *trasumanar*).
 */

import type { ChapterQuestion } from "./chapter-questions"

const QF = (
  id: string,
  text: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): ChapterQuestion => ({
  id,
  type: "multiple_choice",
  difficulty: "Apprentice",
  xpReward: 5,
  text,
  options,
  correctIndex,
  explanation,
})

const QS = (
  id: string,
  text: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): ChapterQuestion => ({
  id,
  type: "multiple_choice",
  difficulty: "Scholar",
  xpReward: 10,
  text,
  options,
  correctIndex,
  explanation,
})

const QSg = (
  id: string,
  text: string,
  options: string[],
  correctIndex: number,
  explanation: string,
): ChapterQuestion => ({
  id,
  type: "multiple_choice",
  difficulty: "Master",
  xpReward: 15,
  text,
  options,
  correctIndex,
  explanation,
})

const TF = (
  id: string,
  text: string,
  correctBool: boolean,
  explanation: string,
  difficulty: "Apprentice" | "Scholar" | "Master" = "Scholar",
): ChapterQuestion => ({
  id,
  type: "true_false",
  difficulty,
  xpReward: difficulty === "Apprentice" ? 5 : difficulty === "Scholar" ? 10 : 15,
  text,
  correctBool,
  explanation,
})

export const DIVINE_COMEDY_TRIALS: Record<number, ChapterQuestion[]> = {

  // ═════════════════════════════════════════════════════════════════
  // INFERNO
  // ═════════════════════════════════════════════════════════════════

  // ── Inferno I — The Dark Wood ────────────────────────────────────
  0: [
    QF("dc-inf-1-1",
      "Dante begins the *Commedia* in what setting?",
      ["A lonely tower at dawn", "A dark wood (selva oscura) where he has lost the true way", "A ship in a storm", "A cathedral at matins"],
      1,
      "*Nel mezzo del cammin di nostra vita* — midway in the journey of our life — Dante finds himself in a *selva oscura*, a moral wood of sin and confusion, not a geographical forest."),
    QF("dc-inf-1-2",
      "What three beasts block Dante's path up the hill of light?",
      ["A lion, a leopard, and a wolf", "A bear, an eagle, and a stag", "A serpent, a goat, and a lamb", "A horse, a hound, and a hawk"],
      0,
      "The leopard (traditionally lust or fraud), the lion (pride/violence), and the she-wolf (avarice or incontinence). They keep the pilgrim from climbing toward salvation unaided."),
    QS("dc-inf-1-3",
      "Who emerges from the dark wood to guide Dante?",
      ["Beatrice", "Virgil — specifically as author of the *Aeneid*, *that fountain which pours out so ample a stream of speech*", "Saint Peter", "Cato the Younger"],
      1,
      "Virgil introduces himself with reference to his authorship of the *Aeneid*; Dante will echo Aeneas's underworld journey (Aeneid VI) throughout the *Inferno*. Virgil is *lo mio maestro e 'l mio autore* — master and author."),
    QSg("dc-inf-1-4",
      "The Greyhound (*il Veltro*) whom Virgil prophesies will drive the she-wolf back to Hell is most likely meant to signify:",
      ["Charlemagne, reborn", "A future Emperor or reformer — the identification is debated (Can Grande della Scala, a coming pope, or an idealized political savior)", "Christ at the Second Coming", "Dante himself, eventually canonized"],
      1,
      "The *Veltro* prophecy (Inf I.101–11) has never been definitively identified. Dante's most likely referent is Can Grande della Scala of Verona (his own patron), figured as a redeeming imperial power; the passage has also been read as apocalyptic or messianic."),
  ],

  // ── Inferno II — Beatrice Sends Virgil ──────────────────────────
  1: [
    QF("dc-inf-2-1",
      "Who arranged for Virgil to guide Dante?",
      ["Homer, out of literary solidarity", "Beatrice, at the prompting of Saint Lucy and the Virgin Mary", "Cato, the gatekeeper of Purgatory", "God directly, without intermediary"],
      1,
      "The chain of heavenly intercession — Mary → Lucia → Beatrice → Virgil — establishes the poem's theology: salvation reaches Dante only because grace reaches down first. The pilgrim does not initiate his own rescue."),
  ],

  // ── Inferno III — The Gate, the Neutrals ────────────────────────
  2: [
    QF("dc-inf-3-1",
      "What inscription stands above the Gate of Hell?",
      ["\"I am the door\"", "\"Abandon all hope, ye who enter here\"", "\"Lasciate ogni speranza\" — which means \"Abandon all hope\" — is the closing line of the gate's inscription", "\"All are welcome here\""],
      2,
      "The inscription reads in full: *Per me si va ne la città dolente / per me si va ne l'etterno dolore / per me si va tra la perduta gente / … Lasciate ogne speranza, voi ch'intrate.* The closing phrase is one of the most quoted lines in world literature."),
    QS("dc-inf-3-2",
      "The neutrals — those who lived *sanza infamia e sanza lodo* (without blame and without praise) — suffer in which location?",
      ["The first circle proper (Limbo)", "In the vestibule outside Hell, chasing an ever-shifting banner while being stung by wasps", "In Cocytus, beside Satan", "They are not in Hell at all; Dante ignores them"],
      1,
      "Dante invents the vestibule for the neutrals — including, traditionally, the angels who sided with neither God nor Satan in the heavenly rebellion. The refusal to commit is itself the sin; their punishment is to chase meaning eternally."),
  ],

  // ── Inferno IV — Limbo ──────────────────────────────────────────
  3: [
    QF("dc-inf-4-1",
      "Who is the first shade Dante encounters in Limbo, greeting Virgil as one of their own?",
      ["Socrates", "Homer — first of the four poets, holding a sword as king of song", "Cicero", "Aristotle"],
      1,
      "Dante's *bella scola* — the beautiful school of the ancients — is led by Homer, with Horace, Ovid, and Lucan. They welcome Virgil back, and make Dante sixth among them. The gesture is Dante's claim to be the heir of classical epic."),
  ],

  // ── Inferno V — The Circle of the Lustful / Francesca ────────────
  4: [
    QF("dc-inf-5-1",
      "Who is the judge at the entrance to the second circle, winding his tail around himself to assign each soul its circle?",
      ["Minos", "Rhadamanthus", "Aeacus", "Charon"],
      0,
      "Minos — the legendary king of Crete — judges arriving souls by listening to their confession and then winding his tail around his body; the number of coils indicates which circle they descend to. Dante borrows him from Virgil's *Aeneid* VI."),
    QF("dc-inf-5-2",
      "Francesca da Rimini tells Dante she fell into adultery with Paolo while reading what?",
      ["The Psalms, at vespers", "The romance of Lancelot and Guinevere — *Galeotto fu 'l libro e chi lo scrisse*", "A letter from her husband Gianciotto", "The *Aeneid*, the scene of Dido and Aeneas"],
      1,
      "Francesca blames the book: *Galeotto fu 'l libro* — Gallehault was the book and its author. The reference is to the knight who arranged the adulterous kiss of Lancelot and Guinevere; Dante names the whole genre of courtly-love romance as the accomplice."),
    QS("dc-inf-5-3",
      "What physical response does Dante-pilgrim have to Francesca's story?",
      ["He argues with her theologically", "He faints — *e caddi come corpo morto cade*", "He weeps with joy", "He walks on without comment"],
      1,
      "*And I fell, as a dead body falls.* The pilgrim's swoon — Dante's most famous formal closure — signals his own dangerous identification with the sinners; Inferno V is, in part, the story of a poet learning to read his own literary tradition against itself."),
    QSg("dc-inf-5-4",
      "The term *contrapasso* (punishment that matches the sin) is not itself used in Inferno V, but Francesca's circle illustrates it how?",
      ["The lustful are boiled in hot oil, mirroring passion's heat", "The lustful are blown eternally on a dark wind (*la bufera infernal, che mai non resta*), as their earthly passions whirled them without stopping", "The lustful are forced to read literature aloud for eternity", "The lustful are frozen in ice beside the traitors"],
      1,
      "The infernal storm figures the lack of self-control that defined the sin in life: the lustful were blown by passion, so they are blown eternally by wind. This is the template of Dantean *contrapasso* — the punishment reveals the sin's structure."),
    TF("dc-inf-5-5",
      "Francesca's husband, Gianciotto Malatesta, is still alive at the dramatic date of Dante's visit (Easter 1300) — which is why she identifies him as *Caina attende* (Caïna awaits).",
      true,
      "Francesca's phrase means 'Caïna awaits him' — Caïna being the circle of traitors against kin, where fratricides (and here, uxoricides — killers of kin by marriage) will go. Gianciotto is alive when Dante writes; Francesca is prophesying.",
      "Scholar"),
  ],

  // ── Inferno VI — The Gluttonous ─────────────────────────────────
  5: [
    QF("dc-inf-6-1",
      "Who is the Florentine shade Dante recognizes among the gluttonous?",
      ["Ciacco", "Farinata degli Uberti", "Brunetto Latini", "Cavalcante de' Cavalcanti"],
      0,
      "Ciacco ('the Hog' — it may be either his nickname or his name proper) gives Dante the first of the Commedia's many political prophecies: Florence's White and Black Guelph factions, their coming split, and Dante's own exile."),
  ],

  // ── Inferno VII — The Avaricious / the Prodigal ─────────────────
  6: [
    QF("dc-inf-7-1",
      "The avaricious and the prodigal, opposite vices, are punished together — how?",
      ["Frozen in ice", "Rolling great weights against each other from opposite sides of the circle, shouting *Why dost thou hoard?* and *Why dost thou squander?*", "Eating each other", "Singing hymns they cannot hear"],
      1,
      "The two opposite perversions of wealth are yoked in a single punishment: each half pushes boulders against the other, meeting, clashing, and turning back. The shades cannot even recognize each other — the sin erased their individuality in life."),
  ],

  // ── Inferno VIII–IX — Styx / City of Dis ────────────────────────
  7: [
    QF("dc-inf-8-1",
      "Who ferries Dante and Virgil across the marshy Styx?",
      ["Charon, again", "Phlegyas — whose rage at Apollo in myth fits his role as river-of-wrath boatman", "Geryon", "Minos"],
      1,
      "Phlegyas — the mythological fire-bringer who burned Apollo's temple — ferries the wrathful through the fifth circle. The name pun connects *phlegein* (to burn) with the *wrathful*."),
  ],
  8: [
    QF("dc-inf-9-1",
      "Who opens the gates of the City of Dis, which the demons had shut against Dante and Virgil?",
      ["Hercules, by force", "An angel sent from heaven, who opens the gate with a wand", "Christ himself, descending", "Virgil, by reciting the Aeneid"],
      1,
      "The Gate of Dis opens only by direct divine intervention. Virgil's authority fails at the threshold; the poem insists on the limits of human/classical wisdom in the face of infernal rebellion."),
  ],

  // ── Inferno X — The Heretics / Farinata ─────────────────────────
  9: [
    QF("dc-inf-10-1",
      "Farinata degli Uberti, the great Ghibelline captain, rises from his burning tomb — disdainful of Hell — how?",
      ["Weeping, begging release", "*Com' avesse l'Inferno a gran dispitto* — as if he held Hell in great contempt", "On his knees, cowering", "Invisible, speaking only"],
      1,
      "Farinata's magnificent upright defiance — he stands in his tomb as if Hell could not humble him — is one of the Commedia's most dramatic portraits of heroic damnation. Dante honors the man while damning the sin (heresy)."),
    QS("dc-inf-10-2",
      "Cavalcante de' Cavalcanti interrupts to ask why his son Guido is not with Dante; he mistakes Dante's use of the past tense as news of his son's death. Guido Cavalcanti is:",
      ["Dante's father-in-law", "A poet — leader of the *dolce stil novo* generation and Dante's *primo amico* (first friend)", "A Ghibelline general", "The Pope's secretary"],
      1,
      "Guido Cavalcanti, Dante's 'first friend,' led the Florentine *dolce stil novo* (sweet new style) of lyric poetry. Dante's use of the past tense (*ebbe*, 'he had') is heard by Cavalcante as confirmation of his son's death; the pathos is structural to the canto."),
  ],

  // ── Inferno XI — The plan of Hell ───────────────────────────────
  10: [
    QF("dc-inf-11-1",
      "Virgil uses this canto's pause (in the stench of the pit) to explain the moral architecture of Hell. His schema divides sin into three kinds — which?",
      ["Pride, envy, and anger", "Incontinence, violence (with sub-divisions against neighbor, self, and God), and fraud — the deepest", "Sloth, gluttony, and lust", "Heresy, schism, and apostasy"],
      1,
      "Virgil borrows from Aristotle's *Nicomachean Ethics* the division of incontinence / violence / malice (fraud). Incontinence is the lightest (circles 2–5); violence occupies circle 7; fraud fills 8 and 9. The deeper the sin, the more it corrupts the specifically human faculty of reason."),
  ],

  // ── Inferno XIII — The Suicides ─────────────────────────────────
  12: [
    QF("dc-inf-13-1",
      "The suicides in the second ring of circle VII are transformed into what?",
      ["Stones", "Trees and thorn-bushes, whose branches the Harpies eat, so that their bleeding is their voice", "Pillars of salt", "Owls"],
      1,
      "The suicides refused their bodies in life; they do not get them back even at the General Resurrection (when they will hang their recovered bodies on their own branches). Pier della Vigna — Frederick II's chancellor — speaks the canto's long defense."),
  ],

  // ── Inferno XV — Brunetto Latini ────────────────────────────────
  14: [
    QF("dc-inf-15-1",
      "Dante encounters his old teacher Brunetto Latini among the sodomites. What is the emotional register?",
      ["Cold dismissal", "Affectionate — *la cara e buona imagine paterna*, the dear and good paternal image", "Angry argument", "Theological debate"],
      1,
      "Brunetto's scene — 'you taught me how man makes himself eternal' — is one of the Commedia's most complex: an affectionate encounter with a damned mentor. The canto has been read (William Empson, John Freccero) as deeply tender despite the sin."),
  ],

  // ── Inferno XIX — The Simonists / Popes ─────────────────────────
  18: [
    QF("dc-inf-19-1",
      "The simonists — those who bought or sold sacred office — are punished how?",
      ["Dipped in boiling gold", "Upside-down in rock pits, with fire licking the soles of their feet; each new arrival pushes the last further down", "Chained to altars", "Forced to recite the Mass backwards"],
      1,
      "The inverted burial figures the sin: simony inverted the sacred relationship between office and money. Pope Nicholas III identifies himself (and prophesies the damnation of Boniface VIII and Clement V after him). Dante addresses the pope with the fiercest invective in the *Commedia*."),
  ],

  // ── Inferno XXVI — Ulysses ──────────────────────────────────────
  25: [
    QF("dc-inf-26-1",
      "Dante finds Ulysses (Odysseus) consumed within a single flame that splits at the top. Why two tongues of fire?",
      ["Because he spoke two languages", "Because Ulysses shares the flame with Diomedes, his co-conspirator in the theft of the Palladium and the Trojan Horse", "Because of the double-meaning of his name", "Because his flame represents body and soul"],
      1,
      "The twin-tongued flame contains Ulysses *and* Diomedes, the two Greek schemers whose Trojan-War frauds brought down Troy. Their punishment is specifically for *fraudulent counsel* — eloquence used to deceive."),
    QS("dc-inf-26-2",
      "Ulysses tells the story of his last voyage — a voyage Homer does not narrate. What does he claim he did after returning to Ithaca?",
      ["Stayed peacefully with Penelope", "Persuaded his old crew to sail past the Pillars of Hercules into the forbidden western ocean, seeking *virtute e canoscenza* (valor and knowledge)", "Sailed to Egypt to found a new kingdom", "Took up arms against Rome"],
      1,
      "Dante invents the last voyage: Ulysses cannot be bound by Penelope, Telemachus, or his old father; he persuades his crew to follow him beyond the known world. They reach sight of the mountain of Purgatory — and are drowned. The sin is transgressive curiosity, the human impulse Dante himself must reckon with."),
    QSg("dc-inf-26-3",
      "The line *Considerate la vostra semenza: / fatti non foste a viver come bruti, / ma per seguir virtute e canoscenza* is spoken by Ulysses to his crew. What is Dante's ambivalence here?",
      ["He presents Ulysses as simply damned; the speech is pure hubris", "The speech is damned rhetoric — fraudulent counsel — but also beautiful enough that Dante the poet cannot help sounding like it when his own pilgrim presses on", "Dante agrees with Ulysses entirely", "The speech is ironic; Ulysses doesn't believe it"],
      1,
      "Consider your seed: you were not made to live as brutes, but to follow virtue and knowledge. The rhetoric is magnificent; Dante shows it working (the crew follows) and damning (they drown). Dante the poet, writing the *Commedia* to 'follow knowledge,' is Ulysses' nearest literary kin and his opposite — saved by humility, where Ulysses is damned by pride."),
  ],

  // ── Inferno XXVII — Guido da Montefeltro ────────────────────────
  26: [
    QF("dc-inf-27-1",
      "Guido da Montefeltro's damnation turns on what transaction?",
      ["He murdered a papal legate", "Pope Boniface VIII absolved him in advance for fraudulent counsel — a contradiction in terms; as a devil at his death argues, *l'assolver non si può se non si pente*", "He sold indulgences", "He fought on the wrong side at Benevento"],
      1,
      "A devil and St Francis dispute over Guido's soul at the moment of death; the devil wins by pointing out the logical impossibility of absolution without contrition. The pope's false grant is worse than Guido's sin."),
  ],

  // ── Inferno XXXII — Caïna ───────────────────────────────────────
  31: [
    QF("dc-inf-32-1",
      "The ninth circle, Cocytus, is divided into four rings named for traitors. The first is Caïna, for traitors against kin. Its namesake is:",
      ["Cain", "Caesar's betrayer Brutus", "Judas Iscariot", "Ganelon of Roland fame"],
      0,
      "Caïna is named for Cain, the first fratricide. The four rings of Cocytus — Caïna, Antenora, Ptolomaea, Judecca — are named after four archetypal traitors in biblical / classical / Arthurian tradition."),
  ],

  // ── Inferno XXXIII — Ugolino and Ruggieri ───────────────────────
  32: [
    QF("dc-inf-33-1",
      "Count Ugolino is frozen in the ice of Antenora, gnawing the skull of:",
      ["Boniface VIII", "Archbishop Ruggieri degli Ubaldini, who starved him and his sons to death in the Tower of Hunger", "Frederick II", "Cain"],
      1,
      "Ugolino and Ruggieri — both traitors — are locked in a shared punishment: one gnaws the other's skull for eternity. Ugolino's account of watching his sons die of starvation in the locked tower (and the ambiguous final line *poscia, più che il dolor, potè il digiuno* — 'then, more than grief, hunger had power') is Dante's most heartbreaking human portrait."),
    QS("dc-inf-33-2",
      "The final line of Ugolino's speech — *poscia, più che il dolor, potè il digiuno* — has two standard readings. Which is Dante's probable meaning?",
      ["Ugolino, overcome by grief more than by hunger, died first", "Ugolino, now starving and past grief, ate his dead sons' flesh — OR — hunger eventually killed him, overriding even his grief; Dante leaves it deliberately ambiguous", "Ugolino found the strength to pray", "Ugolino's sons died before him of grief"],
      1,
      "The ambiguity is Dante's art: either Ugolino practiced cannibalism or grief gave way to hunger as the killing force. Most modern commentators read it as the cannibalism the punishment (gnawing Ruggieri) makes literal — but the grammar does not decide it."),
    QSg("dc-inf-33-3",
      "Dante ends the canto with an apostrophe to what city?",
      ["Florence", "Pisa — *Ahi, Pisa! vituperio delle genti*, shame of the nations, because it could starve innocent children", "Siena", "Rome"],
      1,
      "The apostrophe to Pisa is Dante at his most political: the children's innocence makes the city's guilt collective, and Dante urges that the Arno flood the city 'as the Elba and the Magra unite their waters' to drown every soul there."),
  ],

  // ── Inferno XXXIV — Satan / Bottom of Hell ──────────────────────
  33: [
    QF("dc-inf-34-1",
      "At the center of Hell, Dante finds Satan. How many faces does he have?",
      ["One", "Three — a perverse parody of the Trinity", "Seven", "Nine"],
      1,
      "Satan has three faces — red, yellow-black, and pale — each chewing one of the three arch-traitors: Judas (center), Brutus and Cassius (flanking). The three-faced figure is a blasphemous mirror of the Trinity."),
    QS("dc-inf-34-2",
      "Dante and Virgil escape Hell by climbing *down* Satan's body — and at the midpoint their orientation reverses. Why?",
      ["Because of a mistake by the poet", "Because they cross the center of gravity of the earth, where 'down' becomes 'up'", "Because Satan turned them", "Because they entered a portal"],
      1,
      "Satan is wedged at the exact center of the earth. Passing the center inverts the gravitational vertical; Virgil rotates Dante (and himself) and they climb 'up' — which is now toward the southern hemisphere. They emerge in Purgatory."),
    QSg("dc-inf-34-3",
      "The last word of the *Inferno* is *stelle* (stars). This sets up a structural rhyme: what are the last words of *Purgatorio* and *Paradiso*?",
      ["*angeli* and *Dio*", "*stelle* and *stelle* — all three canticles end on the word 'stars'", "*amore* and *luce*", "*morte* and *vita*"],
      1,
      "Each canticle ends on *stelle* — a deliberate structural signature. The poem of descent, ascent, and vision all aim for the same word: the stars, which are the outward sign of divine order."),
  ],

  // ═════════════════════════════════════════════════════════════════
  // PURGATORIO
  // ═════════════════════════════════════════════════════════════════

  // ── Purgatorio I — Cato ──────────────────────────────────────────
  34: [
    QF("dc-purg-1-1",
      "The guardian of Purgatory's shore — an unexpected pagan suicide among the saved — is:",
      ["Socrates", "Cato the Younger — the Stoic who killed himself rather than live under Caesar", "Seneca", "Cicero"],
      1,
      "Dante's Cato is a theological provocation: a pagan, a suicide, and a Roman Republican, given the office of Purgatory's doorkeeper. His liberty from the tyrant Caesar figures the soul's liberty from sin — the whole mountain's subject."),
    QS("dc-purg-1-2",
      "What is the first ritual Virgil performs with Dante on the shore?",
      ["Baptism with sea-water", "Washing the grime of Hell from Dante's face with dew, then girding him with a reed broken from the shore", "Anointing him with oil", "Burning a memorial sheaf"],
      1,
      "The reed — which grows back immediately when pulled — is the emblem of humility that bends without breaking; contrasted with the hard unbending pride of Hell. Dante's purgatorial ascent begins with a humility-rite."),
  ],

  // ── Purgatorio II — Casella ─────────────────────────────────────
  35: [
    QF("dc-purg-2-1",
      "A ship piloted by an angel brings the newly-saved souls from the mouth of the Tiber to Purgatory's shore. What do they sing on arrival?",
      ["A hymn of mourning", "*In exitu Israel de Aegypto* — Psalm 114, on Israel's delivery from Egypt as the figure of the soul delivered from sin", "The Hail Mary", "A funeral march"],
      1,
      "Dante's letter to Can Grande cites *In exitu* as the paradigm of fourfold biblical reading: literally Israel leaves Egypt, allegorically Christ redeems, morally the sinner repents, anagogically the soul ascends to glory. The psalm is the whole *Commedia*'s structural map."),
  ],

  // ── Purgatorio IX — Dream of the Eagle / Gate of Purgatory ──────
  42: [
    QF("dc-purg-9-1",
      "Dante dreams of a golden eagle that snatches him up to the sphere of fire. He awakens to discover:",
      ["He is back in Florence", "Saint Lucia has carried his sleeping body to the Gate of Purgatory", "He has been sleeping seven years", "Virgil has disappeared"],
      1,
      "Lucia — one of the three ladies who interceded in Inferno II — carries the sleeping Dante up to the Gate. The eagle-dream is a traditional symbol for contemplative ascent, borrowed from Ganymede's abduction by Jove."),
    QS("dc-purg-9-2",
      "The angel at the Gate of Purgatory carves what letter into Dante's forehead seven times?",
      ["A (for *amor*)", "P (for *peccatum*, sin) — one for each of the seven capital vices; each will be erased as Dante ascends the corresponding terrace", "C (for Christ)", "S (for soul)"],
      1,
      "The seven P's track the pilgrim's moral progress: one is erased by an angel's wing at the top of each terrace. The acronym of the terraces reads upward: Pride, Envy, Wrath, Sloth, Avarice, Gluttony, Lust — the medieval seven."),
  ],

  // ── Purgatorio XI — Pride / Provenzan Salvani ───────────────────
  44: [
    QF("dc-purg-11-1",
      "The prideful on the first terrace sing what as they bow under stone weights?",
      ["The Magnificat", "The *Pater Noster* — adapted with a petition to give them patience to bear the weight", "The *Te Deum*", "A Latin dirge"],
      1,
      "The Lord's Prayer bent under stones — the liturgy literally humbled — is a Dantean invention. The prideful cannot hold their heads up to see Heaven; their prayer teaches them to look down first."),
  ],

  // ── Purgatorio XXII — Statius ───────────────────────────────────
  55: [
    QF("dc-purg-22-1",
      "Statius — the Roman epic poet of the *Thebaid* — reveals that Virgil's Fourth Eclogue secretly converted him. Why is this moment enormously significant for Dante?",
      ["It's a minor literary anecdote", "It lets Dante claim that Virgil, still pagan and damned, nevertheless unknowingly saved Statius — making Virgil into a kind of crypto-evangelist, a pagan prophet of Christ", "It proves Statius read Hebrew", "It justifies the Aeneid's truth-claims"],
      1,
      "Dante invents Statius's conversion: the Fourth Eclogue's prophecy of a child who will bring back the Golden Age was read by Christians as pointing to Christ. Statius's gratitude to Virgil — *per te poeta fui, per te cristiano* — makes Virgil's ambivalent position in the poem (saving others while lost himself) a tragedy."),
  ],

  // ── Purgatorio XXVIII — Earthly Paradise / Matelda ──────────────
  61: [
    QF("dc-purg-28-1",
      "At the summit of Purgatory, Dante enters what?",
      ["The Empyrean", "The Earthly Paradise — the Garden of Eden, atop the mountain", "The Primum Mobile", "The outer court of Hell"],
      1,
      "Eden, in Dante's cosmology, was moved to the top of Purgatory when Adam fell. It is the terminus of Virgil's guidance; from here Beatrice takes over. Matelda is the garden's keeper (her identification is debated)."),
  ],

  // ── Purgatorio XXX — Beatrice / Virgil's Departure ──────────────
  63: [
    QF("dc-purg-30-1",
      "Beatrice arrives in the Earthly Paradise in a chariot. What does Dante then discover when he turns to Virgil?",
      ["Virgil is now robed in white", "*Virgilio n'avea lasciati scemi di sé* — Virgil has left him, silently; the pilgrim weeps", "Virgil becomes a bird", "Virgil speaks a blessing"],
      1,
      "Virgil's disappearance — unannounced, at the precise moment Beatrice appears — is one of the *Commedia*'s most devastating scenes. Dante names his guide three times in tears: *Virgilio, Virgilio, Virgilio*. The pagan guide cannot enter the Christian vision; his work is done."),
    QS("dc-purg-30-2",
      "Beatrice's first words to Dante in the Earthly Paradise are:",
      ["Gentle and welcoming", "Sharp — she calls him by name (*Dante*, the only use of his name in the poem), rebukes him, and lists his failings; her harshness is the beginning of his final conversion", "Silent", "A line from the Psalms"],
      1,
      "*Dante, perché Virgilio se ne vada, non pianger anco, non piangere ancora.* The naming itself is a shock — Dante notes, *Di necessità qui si registra* — it is noted here of necessity. Beatrice's severity is clinical: she diagnoses before she heals."),
    QSg("dc-purg-30-3",
      "Theologically, why *must* Virgil leave at exactly this moment?",
      ["It's an arbitrary narrative choice", "Virgil represents human reason (and the classical epic inheritance) — which can take the pilgrim to the edge of grace but cannot see God. From Beatrice (revelation) forward, a different faculty is required; Virgil is structurally beyond his limit", "Virgil is needed in Hell", "Virgil is actually saved later"],
      1,
      "The Earthly Paradise marks the boundary where natural reason reaches its ceiling; revelation takes over. Virgil cannot enter Paradiso because theology (Beatrice) is not a continuation of philosophy (Virgil) but a different operation. His departure is one of the poem's most perfect structural rhymes: the greatest pagan poet leaves the stage as the Christian woman enters."),
    TF("dc-purg-30-4",
      "Virgil is mentioned by name for the last time in the Commedia in Purg XXX; every reference to him after this is indirect (*il dolce padre*, *mio signor*, etc.).",
      false,
      "Actually, Virgil returns briefly in XXXIII by way of allusion but is referenced throughout Paradiso obliquely; yet the *direct* final presence is here. The Standard Ebooks/Longfellow apparatus treats XXX as his exit; the name-use afterward is retrospective.",
      "Master"),
  ],

  // ── Purgatorio XXXIII — End of Purgatorio ───────────────────────
  66: [
    QF("dc-purg-33-1",
      "What does Dante drink before ascending from the Earthly Paradise to the heavens?",
      ["Wine at the Eucharist", "Water from Eunoë — the river that restores the memory of good deeds — paired with Lethe (forgetfulness of sin, earlier in XXVIII)", "The blood of a lamb", "Milk from Mary"],
      1,
      "Dante's double river — Lethe (classical forgetfulness) + Eunoë ('good memory,' Dante's coinage) — prepares the soul for Paradiso: sins forgotten, good deeds recovered. The canticle ends as the others do: *puro e disposto a salire alle stelle* — 'pure and ready to rise to the stars.'"),
  ],

  // ═════════════════════════════════════════════════════════════════
  // PARADISO
  // ═════════════════════════════════════════════════════════════════

  // ── Paradiso I — Invocation / Trasumanar ────────────────────────
  67: [
    QF("dc-par-1-1",
      "Dante opens *Paradiso* with a neologism he has to coin for what happens to him:",
      ["*disumanare* — to become unhuman", "*trasumanar* — to pass beyond the human; Dante admits he cannot describe the experience in ordinary words", "*deificar* — to be deified", "*angelicare* — to become angelic"],
      1,
      "*Trasumanar significar per verba non si poria* — 'to pass-beyond-humanity cannot be signified in words.' Dante signals at canticle-start that *Paradiso* will strain language beyond its capacity; the poem's method becomes an ongoing confession of inadequacy."),
    QS("dc-par-1-2",
      "Who replaces Virgil as Dante's guide in the heavens?",
      ["St Paul", "Beatrice — throughout most of Paradiso, with Bernard of Clairvaux taking over in the final three cantos", "The Apostle John", "The Virgin Mary"],
      1,
      "Beatrice — theology incarnate — leads Dante from the Earthly Paradise through the nine celestial spheres to the Empyrean. In canto XXXI, Bernard of Clairvaux, Mary's great medieval devotee, replaces her for the final vision."),
  ],

  // ── Paradiso III — Piccarda ─────────────────────────────────────
  69: [
    QF("dc-par-3-1",
      "Piccarda — encountered in the sphere of the Moon — offers what famous doctrine about the blessed?",
      ["Heaven is reserved for the celibate", "*E 'n la sua volontade è nostra pace* — In His will is our peace; each blessed soul's place in heaven is exactly what they desire, because their will has been conformed to God's", "Heaven has degrees of happiness that correspond to merit", "Heaven is outside of time entirely"],
      1,
      "Piccarda's line — *In His will is our peace* — is the theological answer to hierarchical anxiety: the blessed do not want to be higher, because wanting more than what God has willed for them would be *less* peace, not more. The doctrine is Dante's gloss on Augustine."),
  ],

  // ── Paradiso XI — Aquinas on St Francis ─────────────────────────
  77: [
    QF("dc-par-11-1",
      "In the sphere of the Sun, Thomas Aquinas tells Dante the life of what saint?",
      ["His own teacher Albert", "St Francis of Assisi — with the famous line *L'oriente fè di sua bellezza* describing his birth at Assisi (on Monte Subasio) as a dawn rising", "St Augustine", "St Benedict"],
      1,
      "Aquinas (a Dominican) praises Francis (a Franciscan); the next canto has Bonaventure (a Franciscan) praise Dominic. Dante's parallel-lives-of-the-founders is a formal plea against the inter-order squabbles of his own generation."),
  ],

  // ── Paradiso XV — Cacciaguida / Dante's Ancestor ────────────────
  81: [
    QF("dc-par-15-1",
      "Dante's great-great-grandfather Cacciaguida appears in the sphere of Mars, which holds:",
      ["Lovers", "Warriors who fought for the faith — including Cacciaguida, who died on the Second Crusade", "Theologians", "Martyrs only"],
      1,
      "Cacciaguida's three-canto encounter (XV–XVII) is Dante's longest speaking part in Paradiso. He prophesies Dante's exile (XVII), authorizes him to write the *Commedia* openly, and gives the famous line: *tu lascerai ogne cosa diletta più caramente* — 'you will leave behind everything you love most dearly.'"),
  ],

  // ── Paradiso XVII — Exile Prophecy ──────────────────────────────
  83: [
    QF("dc-par-17-1",
      "Cacciaguida delivers the most famous description of exile in European literature:",
      ["*La morte scende dai cieli*", "*Tu proverai sì come sa di sale / lo pane altrui, e com' è duro calle / lo scendere e 'l salir per l'altrui scale* — you shall know how salty the bread of others is, and how hard the stairs of others are", "*Il mondo è freddo*", "*L'amore è perduto*"],
      1,
      "The lines — 'how salty the bread of others tastes' — became, after Dante, the fixed topos for European political exile. Cacciaguida licenses Dante to speak every name in his poem, however powerful, because 'the voice of the prophet is harshest where the fault is greatest.'"),
  ],

  // ── Paradiso XXXIII — The Final Vision ──────────────────────────
  99: [
    QF("dc-par-33-1",
      "The final canto opens with Bernard of Clairvaux's prayer to:",
      ["Christ", "The Virgin Mary — *Vergine madre, figlia del tuo figlio* (Virgin mother, daughter of thy Son), the paradox at the heart of Incarnation", "God the Father", "Beatrice"],
      1,
      "Bernard's prayer is the greatest Marian hymn in vernacular literature: *Virgin mother, daughter of thy Son, humble and exalted more than any creature.* Mary's intercession is what permits the pilgrim's final ascent to the direct vision."),
    QS("dc-par-33-2",
      "Dante's final vision of God is described as what?",
      ["A white throne on clouds", "Three interpenetrating circles of equal circumference and different colors — one of which contains the likeness of a human face; this is the Trinity, with the human figure the Incarnation", "A light too bright to see", "An empty center"],
      1,
      "The three circles are the Trinity; Dante gazes at the second (the Son) and notices that it contains *nostra effige* — our image. The moment is the intellectual vision of the Incarnation: God is triune *and* has taken human form."),
    QSg("dc-par-33-3",
      "The *Commedia* ends with what exactly?",
      ["A prayer for the dead", "*L'amor che move il sole e l'altre stelle* — the love that moves the sun and the other stars — as Dante's desire is at last conformed to divine motion", "A request for readers' prayers", "An invocation of the next poem"],
      1,
      "Dante ends not with himself but with the *cause* of all motion — *amor* (love) moving the sun and stars. His own will is *rotated* (*volgeva*) by the same love, no longer seeking but moved. The poem's final image: cosmic machinery and human will finally synchronized."),
    QSg("dc-par-33-4",
      "In the final simile for the failure of memory, Dante compares his lost vision of God to:",
      ["A dream that can't be remembered on waking", "Snow melting in the sun — *così la neve al sol si disigilla*; OR the Sibyl's oracular leaves scattered by wind (Aeneid VI.74–75). Both are about the loss of the recorded word", "A candle blown out", "A ship gone past the horizon"],
      1,
      "Both similes are active in XXXIII: snow losing its form in the sun (XXXIII.64–66), and the Sibyl's leaves blown away (XXXIII.65 — borrowed directly from *Aeneid* VI). Dante ends the poem on two simultaneous images of what he cannot keep."),
    TF("dc-par-33-5",
      "The last word of the *Commedia* is *stelle* (stars) — matching the last word of both prior canticles.",
      true,
      "All three canticles end on *stelle*: a structural signature Dante uses to unify the poem. *Paradiso* XXXIII closes: *l'amor che move il sole e l'altre stelle.*",
      "Apprentice"),
  ],

  // ═════════════════════════════════════════════════════════════════
  // CAPSTONE TRIALS
  // ═════════════════════════════════════════════════════════════════

  // ── Virgil's Blessing Trial (unlocked after Purg XXX) ───────────
  // chapterIndex 100 is outside the content range; reader routes it
  // to the Seal UI.
  100: [
    QF("dc-virgil-blessing-1",
      "The Virgil's Blessing Seal commemorates what moment in the *Commedia*?",
      ["Virgil's first appearance in Inferno I", "Virgil's silent departure from the Earthly Paradise at the start of Purgatorio XXX — the single most product-resonant passage in the classical-inheritance arc", "Virgil's defense of Dante before the demons at the Gate of Dis", "Virgil's philosophical speech on the moral plan of Hell (Inferno XI)"],
      1,
      "The Seal marks the pagan master's exit, when the pilgrim turns from classical reason to Christian revelation. It is the Commedia's deepest reflection on inheritance and its limits."),
    QS("dc-virgil-blessing-2",
      "In Dante's allegorical scheme, Virgil represents:",
      ["Christian theology", "Human reason and the classical literary inheritance — sufficient to reach Eden, insufficient to see God", "Imperial Rome only", "Pagan piety as distinct from pagan reason"],
      1,
      "Virgil = reason + inherited tradition. His limit marks the boundary where revelation takes over (Beatrice). The poem's most sophisticated statement of the relationship between classical and Christian thought."),
    QSg("dc-virgil-blessing-3",
      "Why does Dante leave Virgil unsaved, given how tenderly he's portrayed?",
      ["Theological rigor — salvation requires baptism and explicit Christian faith", "Theological rigor: Virgil is a virtuous pagan in Limbo, and Dante refuses to soften the doctrine even for the poet he loves above all others — the cost of his system is its seriousness", "Literary convention — Virgil is always shown in Limbo", "It was politically required"],
      1,
      "Dante could have rescued Virgil (as he half-rescues Statius and almost-rescues Cato). He doesn't. The refusal is the measure of his seriousness: pity does not overwrite doctrine. The *tragedy* of Virgil in the *Commedia* is the poem's ethical spine."),
  ],

  // ── Commedia Master Trial (all 100 cantos) ─────────────────────
  101: [
    QF("dc-master-1",
      "The three canticles end on the same word. What is it?",
      ["*amore*", "*stelle* (stars)", "*Dio*", "*pace*"],
      1,
      "Each canticle closes on *stelle*: a structural signature marking the poem's consistent aim at cosmic-divine order."),
    QS("dc-master-2",
      "The *Commedia*'s unique verse form is:",
      ["Ottava rima", "*Terza rima* — interlocking three-line stanzas rhyming ABA BCB CDC..., Dante's invention, imitating the Trinity structurally", "Heroic couplets", "Blank verse"],
      1,
      "*Terza rima* is Dante's formal invention; each rhyme appears three times, echoing the Trinitarian structure. The form's forward-propulsion matches the pilgrim's pilgrimage forward."),
    QSg("dc-master-3",
      "The *Commedia* was originally called simply *Comedìa*. What does Dante say in the Letter to Can Grande makes it a comedy and not a tragedy?",
      ["Its length", "Two things: it begins in adversity and ends in joy (structural); and its language is the popular vernacular, not the high Latin of tragedy (stylistic)", "It has funny passages", "It is written in meter"],
      1,
      "Dante's definition of *comedìa* is formal: low style (Italian, not Latin) and optimistic trajectory (from Hell to Heaven). Boccaccio added the epithet *Divina* later; the Renaissance made it permanent."),
  ],

  // ── Classical Triad Stretch (Homer + Virgil + Dante) ───────────
  102: [
    QF("dc-triad-1",
      "Dante's literary project in the *Commedia* consciously absorbs and transforms which two classical epics as its structural ancestors?",
      ["Theogony and Works and Days", "The Aeneid (Virgil's underworld journey in Book VI is the structural model) and, by Virgil's mediation, the Odyssey (Ulysses's last voyage in Inferno XXVI rewrites Homer)", "The Iliad and the Argonautica", "Horace's Odes and Ovid's Amores"],
      1,
      "The *Aeneid* VI is the *Commedia*'s direct structural template; the *Odyssey* is inherited through Virgil and rewritten in Inferno XXVI (where Ulysses sails past the known world's edge). Dante makes himself the sixth in Homer's school (Inferno IV) — the claim is audacious."),
    QSg("dc-triad-2",
      "The line at Inferno I.85 — *Tu se' lo mio maestro e 'l mio autore* — is Dante's most compressed literary claim. Why?",
      ["It only names Virgil politely", "*Maestro* (teacher) is personal apprenticeship; *autore* (authority, source, author) is institutional descent. Dante simultaneously places himself in Virgil's *school* and in his *lineage* — both tutorial and dynastic", "It only means 'dear sir'", "It's only about the Aeneid"],
      1,
      "The line is doubly loaded: Virgil is the teacher (hands-on pedagogy) and the *autore* (source-text, authorization). Dante claims both descent and continuity — and will spend the poem justifying the inheritance while also adding to it."),
  ],
}

// Scaffold single questions for every other canto so the reader's quiz
// surface is never empty. These will be deepened in subsequent passes.
const SCAFFOLD_CANTOS: Array<{ index: number; canto: string; canticle: string }> = [
  { index: 11, canto: "XII", canticle: "Inferno" },    // Violent: Centaurs, Minotaur
  { index: 13, canto: "XIV", canticle: "Inferno" },    // Blasphemers
  { index: 15, canto: "XVI", canticle: "Inferno" },    // Three Florentines
  { index: 16, canto: "XVII", canticle: "Inferno" },   // Geryon
  { index: 17, canto: "XVIII", canticle: "Inferno" },  // Malebolge begins
  { index: 19, canto: "XX", canticle: "Inferno" },     // Diviners
  { index: 20, canto: "XXI", canticle: "Inferno" },    // Malebranche
  { index: 21, canto: "XXII", canticle: "Inferno" },   // Ciampolo
  { index: 22, canto: "XXIII", canticle: "Inferno" },  // Hypocrites
  { index: 23, canto: "XXIV", canticle: "Inferno" },   // Vanni Fucci
  { index: 24, canto: "XXV", canticle: "Inferno" },    // Thieves
  { index: 27, canto: "XXVIII", canticle: "Inferno" }, // Mahomet (schismatics)
  { index: 28, canto: "XXIX", canticle: "Inferno" },   // Alchemists
  { index: 29, canto: "XXX", canticle: "Inferno" },    // Adam of Brescia
  { index: 30, canto: "XXXI", canticle: "Inferno" },   // Giants
  { index: 36, canto: "III", canticle: "Purgatorio" },
  { index: 37, canto: "IV", canticle: "Purgatorio" },
  { index: 38, canto: "V", canticle: "Purgatorio" },
  { index: 39, canto: "VI", canticle: "Purgatorio" },
  { index: 40, canto: "VII", canticle: "Purgatorio" },
  { index: 41, canto: "VIII", canticle: "Purgatorio" },
  { index: 43, canto: "X", canticle: "Purgatorio" },
  { index: 45, canto: "XII", canticle: "Purgatorio" },
  { index: 46, canto: "XIII", canticle: "Purgatorio" },
  { index: 47, canto: "XIV", canticle: "Purgatorio" },
  { index: 48, canto: "XV", canticle: "Purgatorio" },
  { index: 49, canto: "XVI", canticle: "Purgatorio" },
  { index: 50, canto: "XVII", canticle: "Purgatorio" },
  { index: 51, canto: "XVIII", canticle: "Purgatorio" },
  { index: 52, canto: "XIX", canticle: "Purgatorio" },
  { index: 53, canto: "XX", canticle: "Purgatorio" },
  { index: 54, canto: "XXI", canticle: "Purgatorio" },
  { index: 56, canto: "XXIII", canticle: "Purgatorio" },
  { index: 57, canto: "XXIV", canticle: "Purgatorio" },
  { index: 58, canto: "XXV", canticle: "Purgatorio" },
  { index: 59, canto: "XXVI", canticle: "Purgatorio" },
  { index: 60, canto: "XXVII", canticle: "Purgatorio" },
  { index: 62, canto: "XXIX", canticle: "Purgatorio" },
  { index: 64, canto: "XXXI", canticle: "Purgatorio" },
  { index: 65, canto: "XXXII", canticle: "Purgatorio" },
  { index: 68, canto: "II", canticle: "Paradiso" },
  { index: 70, canto: "IV", canticle: "Paradiso" },
  { index: 71, canto: "V", canticle: "Paradiso" },
  { index: 72, canto: "VI", canticle: "Paradiso" },    // Justinian
  { index: 73, canto: "VII", canticle: "Paradiso" },
  { index: 74, canto: "VIII", canticle: "Paradiso" },
  { index: 75, canto: "IX", canticle: "Paradiso" },
  { index: 76, canto: "X", canticle: "Paradiso" },     // Aquinas
  { index: 78, canto: "XII", canticle: "Paradiso" },   // Bonaventure
  { index: 79, canto: "XIII", canticle: "Paradiso" },
  { index: 80, canto: "XIV", canticle: "Paradiso" },
  { index: 82, canto: "XVI", canticle: "Paradiso" },
  { index: 84, canto: "XVIII", canticle: "Paradiso" },
  { index: 85, canto: "XIX", canticle: "Paradiso" },
  { index: 86, canto: "XX", canticle: "Paradiso" },
  { index: 87, canto: "XXI", canticle: "Paradiso" },
  { index: 88, canto: "XXII", canticle: "Paradiso" },
  { index: 89, canto: "XXIII", canticle: "Paradiso" },
  { index: 90, canto: "XXIV", canticle: "Paradiso" },
  { index: 91, canto: "XXV", canticle: "Paradiso" },
  { index: 92, canto: "XXVI", canticle: "Paradiso" },
  { index: 93, canto: "XXVII", canticle: "Paradiso" },
  { index: 94, canto: "XXVIII", canticle: "Paradiso" },
  { index: 95, canto: "XXIX", canticle: "Paradiso" },
  { index: 96, canto: "XXX", canticle: "Paradiso" },
  { index: 97, canto: "XXXI", canticle: "Paradiso" },
  { index: 98, canto: "XXXII", canticle: "Paradiso" },
]

for (const s of SCAFFOLD_CANTOS) {
  // Build a minimal Foundational question from the canticle's shape.
  // These are placeholders to be deepened; they verify the reader has
  // reached the canto without making scholarly claims.
  const canticleLower = s.canticle.toLowerCase()
  const q: ChapterQuestion = {
    id: `dc-${canticleLower}-${s.canto}-1`,
    type: "multiple_choice",
    difficulty: "Apprentice",
    xpReward: 5,
    text: `In Dante's *${s.canticle}*, Canto ${s.canto} occurs in which canticle of the *Commedia*?`,
    options: ["Inferno", "Purgatorio", "Paradiso", "None — it is a frame canto"],
    correctIndex: s.canticle === "Inferno" ? 0 : s.canticle === "Purgatorio" ? 1 : 2,
    explanation: `Canto ${s.canto} belongs to ${s.canticle}. This question is a placeholder; deeper trials for this canto ship in a subsequent pass.`,
  }
  if (!DIVINE_COMEDY_TRIALS[s.index]) {
    DIVINE_COMEDY_TRIALS[s.index] = [q]
  }
}
