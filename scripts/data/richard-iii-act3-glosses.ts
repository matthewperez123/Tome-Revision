/**
 * Richard III — Act III glosses.
 * 3.7 is Tier-1 (the staged-reluctance scene containing "Two props of
 * virtue for a Christian prince"). 3.1–3.6 get moderate coverage:
 * sanctuary politics, the Hastings arc, and the Pomfret execution.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 3.1 — London. The streets. The prince arrives; York joins him ────
  GLOSSES.richard_iii_act3_scene1 = [
    { line: 1, phrase: "your chamber", definition: "London, ceremonially called 'the king's chamber' — Camera Regis, a title of honour" },
    { line: 4, phrase: "crosses", definition: "hardships, troubles (literal crosses borne on the way)" },
    { line: 11, phrase: "jumpeth with the heart", definition: "matches, corresponds to the heart" },
    { line: 22, phrase: "slug", definition: "sluggish fellow; lazy person" },
    { line: 31, phrase: "indirect and peevish", definition: "perverse and willful" },
    { line: 36, phrase: "pluck him perforce", definition: "seize him by force" },
    { line: 39, phrase: "obdurate", definition: "hardened, unyielding" },
    { line: 41, phrase: "infringe the holy privilege / Of blessed sanctuary", definition: "violate the sacred right of sanctuary — church ground that barred civil arrest" },
    { line: 44, phrase: "senseless-obstinate", definition: "stubbornly stupid" },
    { line: 56, phrase: "sanctuary children", definition: "Buckingham's novelty — a coinage for his argument that children can't claim sanctuary; theologically dubious" },
    { line: 69, phrase: "Julius Caesar build that place", definition: "the White Tower — tradition attributed its foundations to Caesar; actually built by William the Conqueror" },
    { line: 71, phrase: "re-edified", definition: "rebuilt; re-built upon" },
    { line: 78, phrase: "general all-ending day", definition: "the Day of Judgement; doomsday" },
    { line: 79, phrase: "So wise so young, they say, do never live long", definition: "proverbial; Gloucester's aside, telegraphing the boy's fate" },
    { line: 81, phrase: "without characters", definition: "without written letters — fame lives in memory, not just script" },
    { line: 82, phrase: "formal vice, Iniquity", definition: "the Vice-figure 'Iniquity' of the old morality plays — moral abstraction turned stage character. Gloucester names his dramatic ancestry" },
    { line: 83, phrase: "moralize two meanings in one word", definition: "make one word bear double meaning — the Vice's signature equivocation" },
    { line: 94, phrase: "Short summers lightly have a forward spring", definition: "brief summers are apt to have an early spring — proverbial; precocity portends early death" },
    { line: 97, phrase: "dread lord", definition: "lord to be feared; standard address to a king" },
    { line: 103, phrase: "idle weeds are fast in growth", definition: "York throws Gloucester's own proverb back at him — cf. 2.4.13" },
    { line: 129, phrase: "like an ape", definition: "York's punning insult about being carried on shoulders — an ape on a fool's back was a common fool-figure" },
    { line: 131, phrase: "sharp-provided wit", definition: "readily-furnished, quick intelligence" },
    { line: 142, phrase: "Clarence’ angry ghost", definition: "the boy anticipates his uncle Clarence's vengeful spirit — more telegraph of coming Tower deaths" },
    { line: 147, phrase: "Sennet", definition: "stage direction — a ceremonial fanfare of trumpets" },
    { line: 148, phrase: "prating", definition: "chattering, talkative" },
    { line: 150, phrase: "opprobriously", definition: "with reproach; scornfully" },
    { line: 151, phrase: "parlous", definition: "dangerously precocious" },
    { line: 176, phrase: "divided councils", definition: "two separate meetings held at once — Richard's tactic to sift Hastings' loyalty" },
    { line: 179, phrase: "ancient knot of dangerous adversaries", definition: "long-standing group of enemies — Rivers, Grey, Vaughan" },
    { line: 180, phrase: "let blood at Pomfret-castle", definition: "bled (killed) at Pomfret — surgical/medical euphemism for execution" },
    { line: 189, phrase: "complots", definition: "conspiracies, secret plots" },
    { line: 190, phrase: "Chop off his head", definition: "Gloucester's notorious casual sentence on Hastings — the line's brutality is the point" },
    { line: 192, phrase: "earldom of Hereford", definition: "Buckingham's promised reward — historically claimed by Buckingham through a maternal line" },
    { line: 197, phrase: "digest our complots", definition: "work out, arrange our plots — 'digest' = organize (from rhetoric)" },
  ];

  // ── 3.2 — Before Lord Hastings' house. Stanley's warning ──────────────
  GLOSSES.richard_iii_act3_scene2 = [
    { line: 8, phrase: "boar had razed his helm", definition: "the boar had torn off his helmet — Stanley's dream; the boar is Richard's heraldic badge, so the dream is a warning of decapitation" },
    { line: 11, phrase: "rue at the other", definition: "regret at the other (council)" },
    { line: 22, phrase: "shallow, wanting instance", definition: "superficial, without evidence" },
    { line: 23, phrase: "fond", definition: "foolish" },
    { line: 25, phrase: "fly the boar before the boar pursues", definition: "flee the boar before it hunts you — to run is to invite pursuit; Hastings' fatal rationalization" },
    { line: 34, phrase: "tottering state", definition: "unsteady political condition" },
    { line: 35, phrase: "reeling world", definition: "dizzy, drunken-staggering world" },
    { line: 37, phrase: "garland of the realm", definition: "the crown (garland = circular ornament for the head)" },
    { line: 43, phrase: "forward / Upon his party", definition: "eager on his side" },
    { line: 51, phrase: "bar my master’s heirs in true descent", definition: "block the legitimate succession of my king's heirs — Hastings' refusal point, his death-warrant" },
    { line: 60, phrase: "unprepared", definition: "in theological terms: unshriven, not absolved — a grave spiritual danger" },
    { line: 65, phrase: "dear / To princely Richard", definition: "dear (beloved) to princely Richard — dramatic irony: Hastings believes he is" },
    { line: 68, phrase: "his head upon the bridge", definition: "his head mounted on London Bridge, the traditional display for traitors — Catesby's grim pun (Hastings thinks it means 'high regard')" },
    { line: 71, phrase: "holy rood", definition: "holy cross; common oath" },
    { line: 80, phrase: "jocund", definition: "cheerful, merry" },
    { line: 83, phrase: "sudden stab of rancour", definition: "unexpected stroke of malice" },
    { line: 86, phrase: "Wot you what", definition: "do you know what; listen" },
    { line: 93, phrase: "Pursuivant", definition: "junior heraldic officer; low-ranking court attendant" },
    { line: 102, phrase: "Gramercy", definition: "many thanks (from French grand merci)" },
    { line: 105, phrase: "Sir John", definition: "courtesy title for a priest — 'Sir' prefixed to the first name of a clergyman" },
    { line: 106, phrase: "last exercise", definition: "last sermon (an 'exercise' was a homiletic or devotional lesson)" },
    { line: 110, phrase: "shriving work", definition: "work of confession; spiritual preparation for death — Buckingham's black joke" },
    { line: 117, phrase: "supper too", definition: "and the supper of death — Buckingham's aside menaces what Hastings thinks is a joke" },
  ];

  // ── 3.3 — Pomfret. The execution of Rivers, Grey, Vaughan ─────────────
  GLOSSES.richard_iii_act3_scene3 = [
    { line: 6, phrase: "knot you are of damned blood-suckers", definition: "a clique of damned blood-suckers — Grey's final condemnation of Richard's agents" },
    { line: 8, phrase: "Dispatch", definition: "hurry; get it done (here, the execution)" },
    { line: 9, phrase: "Pomfret, Pomfret", definition: "Rivers' apostrophe to Pontefract Castle — repeated vocative as lament-form" },
    { line: 11, phrase: "guilty closure", definition: "guilty enclosure, walls stained with guilt" },
    { line: 12, phrase: "Richard the second here was hack’d to death", definition: "Richard II was murdered at Pomfret in 1400 — Shakespeare's own earlier play's closing event; the dynasty's founding crime repeating" },
    { line: 15, phrase: "Margaret’s curse is fall’n upon our heads", definition: "Margaret's 1.3 prophecy comes true — first confirmation of the curse-structure" },
    { line: 23, phrase: "hour of death is expiate", definition: "the time for death is fulfilled; our hour is up" },
  ];

  // ── 3.4 — The Tower of London. Hastings arrested ──────────────────────
  GLOSSES.richard_iii_act3_scene4 = [
    { line: 2, phrase: "determine of the coronation", definition: "settle the date and details of the coronation" },
    { line: 5, phrase: "nomination", definition: "the naming of the day" },
    { line: 8, phrase: "most inward", definition: "most intimate, closest" },
    { line: 17, phrase: "sounded him", definition: "probed his opinion" },
    { line: 27, phrase: "come upon your cue", definition: "arrived on your cue (theatrical metaphor — Buckingham treats the room as a stage)" },
    { line: 33, phrase: "strawberries in your garden", definition: "Ely's Holborn strawberries — the infamous abrupt transition; Richard uses the request to exit briefly and return transformed" },
    { line: 39, phrase: "testy gentleman so hot", definition: "irritable gentleman so inflamed" },
    { line: 49, phrase: "cheerfully and smooth", definition: "brightly and pleasantly" },
    { line: 50, phrase: "conceit", definition: "idea, notion" },
    { line: 54, phrase: "by his face straight shall you know his heart", definition: "Hastings' fatal misjudgement — one of the play's grimmest dramatic ironies" },
    { line: 61, phrase: "conspire my death with devilish plots", definition: "plot my death with devilish schemes — Richard's manufactured accusation" },
    { line: 62, phrase: "damned witchcraft", definition: "accursed sorcery — witchcraft was a capital offence under 1563 and 1604 statutes" },
    { line: 70, phrase: "blasted sapling, wither’d up", definition: "struck young-tree, shriveled — Richard holds up his already-deformed arm as 'evidence' of witchcraft" },
    { line: 72, phrase: "harlot strumpet Shore", definition: "Jane Shore, labelled doubly; the charge is cynically fabricated" },
    { line: 77, phrase: "Off with his head", definition: "the scene's most famous line; summary execution by royal fiat" },
    { line: 85, phrase: "foot-cloth horse", definition: "a horse with a trailing cloth of state — a noble's ceremonial mount" },
    { line: 88, phrase: "want the priest", definition: "now I need the priest (for last rites) — Hastings in retrospect" },
    { line: 96, phrase: "short shrift", definition: "brief confession before death — origin of the modern idiom" },
    { line: 97, phrase: "momentary grace of mortal men", definition: "the fleeting favour of men — versus the grace of God" },
    { line: 100, phrase: "drunken sailor on a mast", definition: "a sailor perched on a masthead — ready to tumble with any motion" },
    { line: 103, phrase: "bootless to exclaim", definition: "useless to cry out" },
  ];

  // ── 3.5 — The Tower walls. Staged alarm for the Mayor ─────────────────
  GLOSSES.richard_iii_act3_scene5 = [
    { line: 1, phrase: "quake, and change thy colour", definition: "tremble and change colour — Richard's stage-direction to Buckingham's performance" },
    { line: 5, phrase: "counterfeit the deep tragedian", definition: "imitate the accomplished tragic actor — Buckingham names the scene's mode as acting" },
    { line: 7, phrase: "Tremble and start at wagging of a straw", definition: "the actor's technique: react to the least stimulus" },
    { line: 8, phrase: "Intending deep suspicion", definition: "projecting grave suspicion" },
    { line: 11, phrase: "grace my stratagems", definition: "ornament my schemes" },
    { line: 21, phrase: "dangerous and unsuspected Hastings", definition: "dangerous-but-unsuspected — the state's official slander" },
    { line: 26, phrase: "history of all her secret thoughts", definition: "Richard's bravura hypocrisy: he loved Hastings so that he recorded all his thoughts there" },
    { line: 30, phrase: "attainder of suspect", definition: "legal taint of suspicion — 'attainder' = the corruption of blood following a treason conviction" },
    { line: 31, phrase: "covert’st shelter’d traitor", definition: "most secretly sheltered traitor" },
    { line: 39, phrase: "Turks or infidels", definition: "the two Elizabethan bywords for lawless unbelievers — Richard claims Christian legality" },
    { line: 66, phrase: "carping censures", definition: "fault-finding criticism" },
    { line: 73, phrase: "bastardy of Edward’s children", definition: "the official claim that Edward IV's sons are illegitimate — the legal pretext for Richard's accession" },
    { line: 94, phrase: "play the orator", definition: "perform as public speaker — Buckingham's theatrical self-consciousness continues" },
    { line: 97, phrase: "Baynard’s Castle", definition: "Richard's other London residence, on the Thames — site of the 3.7 staged-reluctance scene" },
    { line: 101, phrase: "Doctor Shaw", definition: "Ralph Shaw, cleric who preached the Edward-was-a-bastard sermon at Paul's Cross; historical figure" },
    { line: 102, phrase: "Friar Penker", definition: "John Penker, provincial of the Augustinian friars; another propagandist cleric" },
    { line: 105, phrase: "brats of Clarence", definition: "Clarence's children — Margaret Pole and Edward, Earl of Warwick; Richard has them confined" },
  ];

  // ── 3.6 — A street. The scrivener's indictment ────────────────────────
  GLOSSES.richard_iii_act3_scene6 = [
    { line: 1, phrase: "indictment", definition: "formal written accusation" },
    { line: 2, phrase: "set hand fairly is engross’d", definition: "in a formal hand carefully inscribed — legal scribal vocabulary" },
    { line: 3, phrase: "read over in Paul’s", definition: "read aloud at St Paul's Cross — the public site for royal proclamations" },
    { line: 7, phrase: "precedent", definition: "the rough draft from which the fair copy was made" },
    { line: 10, phrase: "palpable device", definition: "obvious trick — the scrivener names the fraud: the indictment was prepared before Hastings was arrested" },
    { line: 13, phrase: "come to nought", definition: "come to nothing; end badly" },
  ];

  // ── 3.7 — Baynard's Castle. The staged reluctance (Tier-1) ────────────
  GLOSSES.richard_iii_act3_scene7 = [
    { line: 3, phrase: "mum and speak not a word", definition: "silent — the citizens' refusal to acclaim Richard is a political disaster Buckingham must spin" },
    { line: 5, phrase: "contract with Lady Lucy", definition: "Elizabeth Lucy, Edward IV's mistress, claimed by some to have been pre-contracted to him — the pretext for the 'bastardy' charge against Edward's marriage" },
    { line: 6, phrase: "contract by deputy in France", definition: "Edward's diplomatic marriage-contract to Bona of Savoy, never consummated" },
    { line: 8, phrase: "enforcement of the city wives", definition: "Edward's forcing of London citizens' wives — the charge of sexual predation" },
    { line: 9, phrase: "his own bastardy", definition: "the claim that Edward IV himself was illegitimate — gossip revived from the Duke of York's long absences in France; Buckingham repeats it, slandering Richard's own mother" },
    { line: 12, phrase: "lineaments", definition: "features, physical likeness" },
    { line: 13, phrase: "right idea of your father", definition: "the true image of your father — Buckingham flatters Richard's resemblance to Richard Duke of York" },
    { line: 15, phrase: "victories in Scotland", definition: "Richard's 1482 Scottish campaign, which took Berwick — his actual military record" },
    { line: 25, phrase: "dumb statuas", definition: "mute statues — 'statuas' is an old Latinate plural" },
    { line: 30, phrase: "recorder", definition: "senior legal officer of the City of London" },
    { line: 46, phrase: "intend some fear", definition: "feign some fear — the stage direction in the dialogue" },
    { line: 47, phrase: "prayer-book in your hand", definition: "a prayer-book as prop — Buckingham's explicit stage-managing of the 'pious Richard' tableau" },
    { line: 49, phrase: "build a holy descant", definition: "construct a pious elaboration — 'descant' = rhetorical flourish, from the musical term for counterpoint" },
    { line: 51, phrase: "Play the maid’s part, still answer nay, and take it", definition: "act the reluctant maiden — keep saying no but accept. Buckingham's frankest line: the king's pretended refusal is scripted seduction" },
    { line: 55, phrase: "leads", definition: "the lead-covered roof; upper level" },
    { line: 69, phrase: "lolling on a lewd day-bed", definition: "lounging on a lascivious couch — Buckingham's specific contrast with Edward IV's libertinism" },
    { line: 71, phrase: "brace of courtezans", definition: "a pair of prostitutes" },
    { line: 72, phrase: "two deep divines", definition: "two profound theologians — the prop clergymen" },
    { line: 89, phrase: "at their beads", definition: "at their prayer-beads (the rosary)" },
    { line: 92, phrase: "Two props of virtue for a Christian prince", definition: "two pillars of virtue for a Christian prince — Buckingham's staged acclamation of Richard between the two bishops; the bravura peak of the scene's hypocrisy" },
    { line: 95, phrase: "True ornaments to know a holy man", definition: "the real signs by which a holy man is recognized — Buckingham sells the tableau to the Mayor" },
    { line: 114, phrase: "supreme seat", definition: "the throne of England" },
    { line: 115, phrase: "scepter’d office", definition: "sceptred kingship" },
    { line: 116, phrase: "due of birth", definition: "inheritance by birthright" },
    { line: 118, phrase: "blemished stock", definition: "corrupted lineage — a new euphemism for Edward's 'illegitimate' children" },
    { line: 123, phrase: "royal stock graft with ignoble plants", definition: "royal tree grafted with base shoots — horticultural image for dynastic adulteration" },
    { line: 125, phrase: "blind forgetfulness and dark oblivion", definition: "oblivion doubled — the complete erasure of the Yorkist line" },
    { line: 126, phrase: "recure", definition: "remedy, cure" },
    { line: 130, phrase: "lowly factor for another’s gain", definition: "mere agent for another's benefit — Buckingham insists Richard must be king in his own right, not regent" },
    { line: 132, phrase: "empery", definition: "sovereign rule" },
    { line: 142, phrase: "golden yoke of sovereignty", definition: "kingship as a heavy, ornamented burden" },
    { line: 149, phrase: "Definitively thus I answer", definition: "formally, this is my answer — Richard's legalistic feint" },
    { line: 158, phrase: "bark to brook no mighty sea", definition: "small boat unfit for the great sea — Richard's humility-performance" },
    { line: 175, phrase: "first he was contract to Lady Lucy", definition: "Buckingham presses the pre-contract claim — legally devastating to Edward IV's marriage's validity" },
    { line: 178, phrase: "Bona, sister to the King of France", definition: "Bona of Savoy — the diplomatic marriage Warwick had been negotiating when Edward secretly wed Elizabeth Woodville" },
    { line: 180, phrase: "care-crazed mother of a many children", definition: "care-worn mother of several children — Buckingham's dismissive portrait of Elizabeth Woodville" },
    { line: 182, phrase: "afternoon of her best days", definition: "late middle age — past her prime" },
    { line: 185, phrase: "base declension and loathed bigamy", definition: "shameful descent and hateful bigamy — the charge that Edward's two 'marriages' made him a bigamist" },
    { line: 207, phrase: "effeminate remorse", definition: "womanly compassion — Elizabethan gender-coding of mercy as 'soft'" },
    { line: 220, phrase: "not made of stones", definition: "not stony-hearted — Richard's yielding-formula" },
    { line: 221, phrase: "penetrable to your kind entreats", definition: "pierceable by your kind pleas — the language of seductive yielding applied to politics" },
    { line: 226, phrase: "Long live Richard, England’s royal king", definition: "the formal acclamation — Buckingham supplies the line the citizens would not" },
  ];

};
