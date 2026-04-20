/**
 * Idylls of the King glosses — tap-to-reveal definitions for Tennyson's
 * 1891 Macmillan collected Idylls (12 idylls + Dedication + "To the
 * Queen"). Follows the Paradise Lost / Aeneid / Commedia pattern:
 *
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify (one sentence, on hover/tap).
 *
 * Coverage per spec Part 5 (25–35 per idyll — moderate):
 *
 *   - Arthurian proper names (knights, ladies, castles, places).
 *   - Arthurian objects and concepts (Excalibur, Round Table, Grail).
 *   - Mabinogion/Welsh proper names (Geraint, Enid, Yniol).
 *   - Victorian proper names and references (Albert, Victoria).
 *   - Biblical references (light gloss, with citation).
 *   - Classical references (Homer, Virgil when invoked).
 *   - Ecclesiastical vocabulary (relics, masses, vows, tonsures).
 *   - Archaisms and Tennysonian diction.
 *   - Floral and natural vocabulary (where the specific name matters).
 *
 * Density is lighter than Spenser or Milton because Tennyson's English
 * is more modern; most of the gloss load is Arthurian proper names.
 *
 * Phrase-matching notes: `phrase` must appear verbatim in the HTML.
 * Curly apostrophes/quotes and em-dashes are normalized by the reader
 * component. A phrase that appears in more than one chapter uses
 * `chapterIndex: -1` (cross-chapter); matches whichever chapter is
 * rendered.
 */

export interface IdyllsOfTheKingGloss {
  /** Zero-indexed chapter (ch-0 = Dedication). -1 = cross-chapter. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const IDYLLS_OF_THE_KING_GLOSSES: IdyllsOfTheKingGloss[] = [
  // ═══ CROSS-CHAPTER: Arthurian proper names — the court ═══════════
  { chapterIndex: -1, phrase: "Camelot",
    definition: "Arthur's capital, the seat of the Round Table. Location unspecified in Malory and Tennyson; sometimes identified with Winchester, Caerleon, or Tintagel in the earlier chronicle tradition." },
  { chapterIndex: -1, phrase: "Caerleon",
    definition: "Roman-British town on the river Usk in south Wales; in some Arthurian traditions the site of Arthur's court as an alternative to Camelot. Tennyson uses both." },
  { chapterIndex: -1, phrase: "Round Table",
    definition: "Arthur's order of chivalry, named for the round table at which the knights sat so no one place was above another. Tennyson's Round Table is also the moral-political constitution of the realm, sworn in mutual oath." },
  { chapterIndex: -1, phrase: "Table Round",
    definition: "Variant of Round Table; Tennyson uses both forms. The inversion is medieval-chivalric syntax (adjective-after-noun) preserved from Malory." },
  { chapterIndex: -1, phrase: "Lancelot",
    definition: "Lancelot du Lac — the greatest knight of the Round Table, raised by the Lady of the Lake, Arthur's closest friend, and secretly the lover of Queen Guinevere. The central figure of the cycle's adultery-plot." },
  { chapterIndex: -1, phrase: "Guinevere",
    definition: "Arthur's queen, daughter of Leodogran of Cameliard. Her adultery with Lancelot is the cycle's central moral catastrophe; she ends as abbess at Almesbury." },
  { chapterIndex: -1, phrase: "Arthur",
    definition: "The king of the British Isles, founder of the Round Table, husband of Guinevere. Tennyson writes him as the cycle's moral-ideal figure — explicitly paired with Prince Albert in the Dedication." },
  { chapterIndex: -1, phrase: "Merlin",
    definition: "The sage-magician of Arthur's court; advisor, prophet, king-maker. Tennyson's Merlin is old and weary; he is sealed in a hollow oak by Vivien in Idyll VI." },
  { chapterIndex: -1, phrase: "Modred",
    definition: "Arthur's illegitimate son by his half-sister (elided in Tennyson); the cycle's principal traitor. He seizes the kingdom in Arthur's absence and is killed by Arthur at the last battle, giving Arthur his mortal wound." },
  { chapterIndex: -1, phrase: "Bedivere",
    definition: "Arthur's last surviving knight, who throws Excalibur back into the lake after the last battle. The retrospective-narrator frame of \"The Passing of Arthur\" has Bedivere recounting the king's death to a later generation." },
  { chapterIndex: -1, phrase: "Gawain",
    definition: "Arthur's nephew, son of King Lot and Bellicent; senior knight of the Round Table. In Idyll IX he betrays Pelleas by sleeping with Ettarre whom he was sent to woo on Pelleas's behalf." },
  { chapterIndex: -1, phrase: "Kay",
    definition: "Arthur's foster-brother and seneschal (steward of the household); the court's sharp-tongued institutional voice. Mocks Gareth on arrival in Idyll II." },
  { chapterIndex: -1, phrase: "Galahad",
    definition: "The spotless Grail-knight, son of Lancelot; the only knight who achieves the Grail fully. In Tennyson's Idyll VIII he is translated alive into the sky in a chariot of fire." },
  { chapterIndex: -1, phrase: "Percivale",
    definition: "One of the three successful Grail-knights (with Galahad and Bors); narrator of Idyll VIII as a retired monk at Almesbury. Called \"The Pure\" by the court." },
  { chapterIndex: -1, phrase: "Bors",
    definition: "One of the successful Grail-knights; the practical, humble knight who sees the Grail three times in a cloud. Reappears in Idyll XI as one of the knights loyal to Arthur at the kingdom's fall." },

  // ═══ CROSS-CHAPTER: secondary figures ════════════════════════════
  { chapterIndex: -1, phrase: "Bellicent",
    definition: "Arthur's half-sister; mother of Gawain, Gaheris, and Gareth. In \"The Coming of Arthur\" she gives Leodogran the mystic account of Arthur's birth (the infant on the ninth wave)." },
  { chapterIndex: -1, phrase: "Leodogran",
    definition: "King of Cameliard, father of Guinevere. His deliberation over whether to give his daughter to Arthur (\"The Coming of Arthur\") turns on Arthur's ambiguous parentage." },
  { chapterIndex: -1, phrase: "Vivien",
    definition: "Tennyson's villain-enchantress, largely his own creation from Malory's ambiguous lake-woman Nimuë. She seduces Merlin, sowing court-rumor against the Round Table; the critical consensus is that her character is the cycle's weakest." },
  { chapterIndex: -1, phrase: "Elaine",
    definition: "Elaine of Astolat, the Lily Maid; tragic young woman who falls in love with Lancelot and dies of his refusal. Her body is sent down the Thames on a funeral barge to Camelot (Idyll VII). Not to be confused with Elaine the mother of Galahad (elsewhere in Malory)." },
  { chapterIndex: -1, phrase: "Geraint",
    definition: "Geraint son of Erbin — tributary prince of Devon, knight of the Round Table; the Mabinogion-sourced protagonist of Idylls III and IV." },
  { chapterIndex: -1, phrase: "Enid",
    definition: "Daughter of Yniol, dispossessed lord of a ruined hall; Geraint's wife. The Welsh Mabinogion figure Tennyson renders as Victorian patient-wife type." },
  { chapterIndex: -1, phrase: "Lyonors",
    definition: "Lynette's sister, besieged lady whom Gareth is dispatched to rescue in Idyll II. Malory's name; in one variant tradition Gareth marries her rather than Lynette." },
  { chapterIndex: -1, phrase: "Lynette",
    definition: "The scornful lady who leads Gareth to rescue her sister Lyonors; her scorn turns to love across the journey. In some variants she marries Gareth herself." },
  { chapterIndex: -1, phrase: "Ettarre",
    definition: "Cruel lady who scorns Pelleas and takes his betraying friend Gawain as lover (Idyll IX). The cycle's figure of feminine cruelty, complementary to Vivien." },
  { chapterIndex: -1, phrase: "Pelleas",
    definition: "Young knight of Idyll IX whose disillusionment turns the cycle toward its dark ending. In Malory his tragedy is reversed by the lake-lady Nimuë; Tennyson omits the rescue." },
  { chapterIndex: -1, phrase: "Tristram",
    definition: "Great knight whose long-running adulterous love for Isolt (wife of his uncle Mark of Cornwall) is the cycle's distorted mirror of the Lancelot-Guinevere affair. Killed by Mark in Idyll X." },
  { chapterIndex: -1, phrase: "Dagonet",
    definition: "Arthur's fool. In Idyll X he is made mock-knight by Gawain in jest; his sobbed line to Arthur at the idyll's close (\"I shall never make thee smile again\") is the cycle's darkest moment of court-collapse." },
  { chapterIndex: -1, phrase: "Nudd",
    definition: "Father of Edyrn, the defeated knight of Idyll III. Welsh-mythological name (Nudd of the Silver Hand); Tennyson retains it from the Mabinogion source." },

  // ═══ CROSS-CHAPTER: Arthurian objects ════════════════════════════
  { chapterIndex: -1, phrase: "Excalibur",
    definition: "Arthur's sword, given to him by the Lady of the Lake. Tennyson's version largely omits Malory's sword-in-the-stone; Excalibur is the sword of mandate. It is thrown back into the lake at Arthur's passing (Idyll XII)." },
  { chapterIndex: -1, phrase: "Holy Grail",
    definition: "In Malory the cup of the Last Supper, which caught Christ's blood at the Crucifixion. Tennyson renders it more ambiguously — a luminous veiled figure for religious faith in an age of doubt (Idyll VIII). See also Sangreal." },
  { chapterIndex: -1, phrase: "samite",
    definition: "A heavy silk fabric interwoven with gold or silver threads, used in medieval liturgical vestments. The Lady of the Lake's arm rises from the water \"clothed in white samite\" at Excalibur's return." },

  // ═══ CROSS-CHAPTER: places ═══════════════════════════════════════
  { chapterIndex: -1, phrase: "Cameliard",
    definition: "Leodogran's kingdom, of uncertain geography in Arthurian tradition — generally imagined as a petty-kingdom of southern Britain. Possibly derives from a distortion of \"Cornwall\" or of a Welsh name." },
  { chapterIndex: -1, phrase: "Astolat",
    definition: "Elaine's home, a small castle on the Thames en route to Camelot; site of the Diamond Jousts in Idyll VII. Sometimes identified with Guildford in Surrey." },
  { chapterIndex: -1, phrase: "Almesbury",
    definition: "Site of the nunnery to which Guinevere flees after her adultery becomes public. Actual English place: Amesbury in Wiltshire, near Stonehenge. Idyll XI's whole action is set here." },
  { chapterIndex: -1, phrase: "Tintagel",
    definition: "Cornish coastal castle; in Arthurian tradition variously the place of Arthur's conception (Malory) and King Mark's court (where Tristram and Isolt meet). Real coastal site with Romano-British remains." },
  { chapterIndex: -1, phrase: "Lyonnesse",
    definition: "Legendary western land said to have sunk beneath the sea between Cornwall and the Isles of Scilly; in Arthurian romance, Tristram's birthplace. Tennyson uses the name for its distant-maritime resonance." },
  { chapterIndex: -1, phrase: "Broceliande",
    definition: "Legendary enchanted forest of Brittany, traditional site of Merlin's imprisonment by Vivien (Idyll VI). Partially identified with the modern Paimpont forest in Brittany." },

  // ═══ CROSS-CHAPTER: ecclesiastical vocabulary ════════════════════
  { chapterIndex: -1, phrase: "vow",
    definition: "A solemn promise, especially one made to God or the Church (monastic vows, the Round Table oath, crusading vows). Central to medieval chivalric and religious life." },
  { chapterIndex: -1, phrase: "cell",
    definition: "A monk or nun's small private chamber, or by extension any solitary religious dwelling." },
  { chapterIndex: -1, phrase: "cloister",
    definition: "The covered walkway of a monastery; by extension, the monastic life itself." },
  { chapterIndex: -1, phrase: "novice",
    definition: "A newcomer to a religious order who has not yet taken final vows; typically a young woman or man in a probationary period. The novice in Idyll XI sits with Guinevere at Almesbury." },
  { chapterIndex: -1, phrase: "nun",
    definition: "A woman in religious orders, living under vows of poverty, chastity, and obedience within a monastic community." },
  { chapterIndex: -1, phrase: "Abbess",
    definition: "The female superior of a monastery of nuns; in medieval Europe, a position of considerable temporal as well as spiritual authority." },
  { chapterIndex: -1, phrase: "mass",
    definition: "The central liturgy of the Western Church, the Eucharistic service commemorating Christ's last supper and sacrifice." },
  { chapterIndex: -1, phrase: "hermit",
    definition: "A solitary religious, living apart from monastic community in personal devotion. Common figure in Arthurian romance as counselor to questing knights." },
  { chapterIndex: -1, phrase: "penance",
    definition: "Spiritual discipline (prayer, fasting, almsgiving) imposed by a confessor or chosen by a penitent as satisfaction for sin." },

  // ═══ CROSS-CHAPTER: archaisms and Tennysonian diction ════════════
  { chapterIndex: -1, phrase: "whilome",
    definition: "Archaic English for \"formerly, once upon a time, in the past\"; Tennyson uses it to signal medieval-chivalric register." },
  { chapterIndex: -1, phrase: "thither",
    definition: "Archaic English for \"to that place\" (vs. \"here\" and \"there\"); thither/hither/whither are the archaic directional triad." },
  { chapterIndex: -1, phrase: "hither",
    definition: "Archaic English for \"to this place.\" Pairs with thither (to there) and whither (where)." },
  { chapterIndex: -1, phrase: "whither",
    definition: "Archaic English interrogative: \"to where?\" Pairs with whence (from where) and hither/thither (to here/there)." },
  { chapterIndex: -1, phrase: "whence",
    definition: "Archaic English for \"from where?\" or \"from which place.\"" },
  { chapterIndex: -1, phrase: "thence",
    definition: "Archaic English for \"from that place\"; pairs with whence and hence." },
  { chapterIndex: -1, phrase: "beseech",
    definition: "Archaic English: to earnestly implore, to beg. Higher formal register than modern \"ask.\"" },
  { chapterIndex: -1, phrase: "spake",
    definition: "Archaic past tense of \"speak\" (modern \"spoke\"). Tennyson uses it freely for medieval-chivalric register." },
  { chapterIndex: -1, phrase: "thee",
    definition: "Archaic English second-person singular pronoun, object case (\"you\"); pairs with thou (subject) and thine (possessive). Used in Tennyson for formal/intimate register." },
  { chapterIndex: -1, phrase: "thou",
    definition: "Archaic English second-person singular pronoun, subject case (\"you\"); pairs with thee (object) and thine (possessive)." },
  { chapterIndex: -1, phrase: "thine",
    definition: "Archaic English second-person singular possessive pronoun (\"yours\")." },
  { chapterIndex: -1, phrase: "ye",
    definition: "Archaic English second-person plural pronoun (modern \"you\"); also occurs as a medieval-Yorkshire variant of \"the\" in Tennyson's manuscripts." },

  // ═══ CROSS-CHAPTER: natural and floral vocabulary ════════════════
  { chapterIndex: -1, phrase: "hern",
    definition: "Archaic English for heron; a long-legged wading bird of marshes and rivers. Used by Tennyson for pastoral-wilderness landscapes." },
  { chapterIndex: -1, phrase: "lily",
    definition: "White lily; in Christian iconography the emblem of purity, associated with the Virgin Mary and with virginal women. Elaine is the \"Lily Maid of Astolat.\"" },

  // ═══ Dedication (ch-0) ════════════════════════════════════════════
  { chapterIndex: 0, phrase: "His Memory",
    definition: "Prince Albert's memory. The Dedication was composed in the winter of 1861–62, following Albert's death on 14 December 1861, and addressed to the widowed Queen Victoria." },
  { chapterIndex: 0, phrase: "Albert",
    definition: "Prince Albert of Saxe-Coburg-Gotha (1819–1861), Prince Consort of Queen Victoria. His sudden death prompted the Dedication; Tennyson frames Arthur as Albert's legendary analogue." },
  { chapterIndex: 0, phrase: "woman's-heart",
    definition: "Tennyson's direct apostrophe to Queen Victoria — he addresses her as widow-woman before addressing her as sovereign. The phrase begins the Dedication's closing turn to the living queen." },
  { chapterIndex: 0, phrase: "household name",
    definition: "A name familiar within a family's household, used daily; by extension a name universally recognized. The Dedication's phrase for Albert's intimate place in the British public imagination." },

  // ═══ The Coming of Arthur (ch-1) ══════════════════════════════════
  { chapterIndex: 1, phrase: "Aurelius",
    definition: "Aurelius Ambrosius, one of the pre-Arthurian British kings named in the medieval chronicle tradition (Nennius, Geoffrey of Monmouth). Tennyson lists him as one of the rulers who \"failed to make the kingdom one\" before Arthur." },
  { chapterIndex: 1, phrase: "Uther",
    definition: "Uther Pendragon, Arthur's father in Malory and the chronicle tradition. Tennyson mentions him but renders Arthur's parentage mystically ambiguous rather than directly inherited from Uther." },
  { chapterIndex: 1, phrase: "Urien",
    definition: "A historical early British king of the Rheged kingdom (sixth century); incorporated into Arthurian tradition as an ally of Arthur. Tennyson names him among Leodogran's counselors." },
  { chapterIndex: 1, phrase: "Bleys",
    definition: "Merlin's master in one branch of Arthurian tradition; here, a rival sage cited in Leodogran's deliberation on Arthur's legitimacy." },
  { chapterIndex: 1, phrase: "puissance",
    definition: "Power, might, strength; archaic-chivalric diction. \"Through the puissance of his Table Round.\"" },
  { chapterIndex: 1, phrase: "sceptre",
    definition: "The ceremonial staff of sovereign authority, carried by monarchs on formal occasions. Symbol of royal rule." },
  { chapterIndex: 1, phrase: "realm",
    definition: "Kingdom; domain of a sovereign. A formal word for state." },
  { chapterIndex: 1, phrase: "tribute",
    definition: "Periodic payment owed by a subordinate ruler to a superior (from Latin *tributum*). Arthur's refusal of tribute to Rome is the idyll's final action." },
  { chapterIndex: 1, phrase: "Rome",
    definition: "In medieval-Arthurian tradition, not the ancient Roman Empire but its persisting continental imperial claim. Arthur's refusal of Rome's tribute is the idyll's assertion of British sovereign autonomy." },
  { chapterIndex: 1, phrase: "heathen",
    definition: "A non-Christian, particularly pagan Saxon invaders in the Arthurian period. The \"heathen hordes\" Arthur defeats in his twelve great battles." },
  { chapterIndex: 1, phrase: "ninth",
    definition: "In traditional sea-lore, the ninth wave is the greatest wave in any series. Tennyson preserves this belief in Bellicent's account of the infant Arthur borne on the ninth wave to Merlin's feet." },
  { chapterIndex: 1, phrase: "Devon",
    definition: "County in south-western England; Geraint's home territory in Idylls III–IV. Tennyson uses it for its specifically south-west-British (Welsh/Brythonic) associations." },

  // ═══ Gareth and Lynette (ch-2) ════════════════════════════════════
  { chapterIndex: 2, phrase: "spate",
    definition: "A sudden flood or torrent, especially in a river after heavy rain. Scottish and Northern-English word that Tennyson uses for the opening image of Gareth watching the swollen spring river." },
  { chapterIndex: 2, phrase: "kitchen-knave",
    definition: "A menial servant of the royal kitchen. Gareth serves a year anonymously in this role before revealing his princely identity." },
  { chapterIndex: 2, phrase: "kitchen-vassalage",
    definition: "The condition of being enrolled as a kitchen-servant; vassalage being medieval tenure of service in exchange for protection or support." },
  { chapterIndex: 2, phrase: "carcanet",
    definition: "An ornamental necklace, especially one set with jewels. Medieval-English word; Tennyson uses it for the tournament-prize regalia." },
  { chapterIndex: 2, phrase: "Morning-Star",
    definition: "The first of Gareth's four allegorical opponents; the planet Venus seen at dawn. Tennyson's superimposed allegory transforms Malory's Black Knight into a cosmological figure of early life." },
  { chapterIndex: 2, phrase: "Noon-Sun",
    definition: "The second allegorical opponent in Gareth's quest; the sun at midday, figure of life at its height. Tennyson's name for Malory's Green Knight." },
  { chapterIndex: 2, phrase: "Evening-Star",
    definition: "The third allegorical opponent; the planet Venus seen at evening, figure of life in its late-afternoon phase. Tennyson's name for Malory's Red Knight." },
  { chapterIndex: 2, phrase: "emblem",
    definition: "A heraldic or symbolic figure; a sign of identity or meaning. Camelot is \"rich in emblem and the work of ancient kings.\"" },

  // ═══ The Marriage of Geraint (ch-3) ══════════════════════════════
  { chapterIndex: 3, phrase: "sparrow-hawk",
    definition: "A small predator bird; here the prize in the annual tournament, won three years running by Edyrn's haughty lady. Central set-piece of the Mabinogion source." },
  { chapterIndex: 3, phrase: "cedarn",
    definition: "Made of cedar wood; from Latin *cedrus*. Tennyson uses the archaic form in the cedarn cabinet where Enid keeps her faded silk." },
  { chapterIndex: 3, phrase: "Edyrn",
    definition: "Edyrn son of Nudd, the cruel knight defeated by Geraint at the sparrow-hawk tournament. One of the cycle's rare redemption-arcs: he repents and enters the Round Table as a reformed knight." },
  { chapterIndex: 3, phrase: "Limours",
    definition: "Yniol's nephew, who has dispossessed him of his lands. Becomes a minor antagonist in Idyll IV." },
  { chapterIndex: 3, phrase: "Yniol",
    definition: "Enid's father, dispossessed lord of a ruined hall. Welsh/Mabinogion name; Tennyson retains it from Lady Charlotte Guest's translation." },

  // ═══ Geraint and Enid (ch-4) ═════════════════════════════════════
  { chapterIndex: 4, phrase: "purblind",
    definition: "Partly blind, nearly sightless; by extension morally or intellectually blind to obvious truths. The idyll's opening line names humanity \"the purblind race.\"" },
  { chapterIndex: 4, phrase: "bandit-haunted",
    definition: "Frequented by bandits; infested with highway robbers. Tennyson's compound adjective for the wild hinterlands Enid and Geraint traverse." },
  { chapterIndex: 4, phrase: "Doorm",
    definition: "Earl Doorm, the \"Bull\" — the brutal landlord whose hall becomes the site of Enid's trial and Geraint's revelatory waking. Killed by Geraint with a single blow." },
  { chapterIndex: 4, phrase: "effeminate",
    definition: "Victorian usage: softened by domestic ease, lacking in masculine vigor. Geraint's self-accusation before the trial-ride; the period-gendered anxiety the idyll's misunderstanding turns on." },

  // ═══ Balin and Balan (ch-5) ══════════════════════════════════════
  { chapterIndex: 5, phrase: "Pellam",
    definition: "A tributary king whose failed tribute sets the idyll in motion; in Malory he is the wounded Grail-king of Corbenic, though Tennyson does not develop the Grail-king dimension." },
  { chapterIndex: 5, phrase: "Balan",
    definition: "Balin's brother-knight; the two die at each other's hands in the idyll's climax, unknowing. Inherited from Malory II.18–19." },
  { chapterIndex: 5, phrase: "Balin",
    definition: "Knight known as \"Balin the Savage\" after Arthur's giving him the name as warning. His violent temperament returns after Vivien's poisonous rumor shakes his reform; he dies fighting his own brother." },
  { chapterIndex: 5, phrase: "crown-royal",
    definition: "Guinevere's personal heraldic emblem — a crown. Balin bears it on his shield as a token of his reform-pattern." },

  // ═══ Merlin and Vivien (ch-6) ════════════════════════════════════
  { chapterIndex: 6, phrase: "wily",
    definition: "Crafty, cunning, deceitful. Tennyson's opening adjective for Vivien, signaling the idyll's editorial frame from the first line." },
  { chapterIndex: 6, phrase: "charm",
    definition: "A magical spell; here specifically the binding-charm Merlin teaches Vivien, which she then uses against him to seal him in the hollow oak." },
  { chapterIndex: 6, phrase: "Mark",
    definition: "King Mark of Cornwall, Isolt's husband and Tristram's uncle; one of the cycle's shadow-figures. In Idyll X he murders Tristram on his return to Isolt." },
  { chapterIndex: 6, phrase: "Ivied",
    definition: "Covered with ivy; overgrown with the climbing plant that attaches to old stonework. The hollow oak that becomes Merlin's prison \"looked a tower of ivied masonwork.\"" },

  // ═══ Lancelot and Elaine (ch-7) ══════════════════════════════════
  { chapterIndex: 7, phrase: "loveable",
    definition: "Worthy of being loved; lovable. Tennyson's spelling (archaic -able form) in the idyll's opening triple-naming of Elaine." },
  { chapterIndex: 7, phrase: "Lily Maid",
    definition: "Elaine's traditional epithet. The lily is her emblem — purity, virginal youth, tragic beauty. \"Elaine, the lily maid of Astolat.\"" },
  { chapterIndex: 7, phrase: "Diamond",
    definition: "The nine-year tournament-prize, won each year by Lancelot, which he gives to Guinevere. Tennyson's invention; Malory has a single tournament, not nine." },
  { chapterIndex: 7, phrase: "Lavaine",
    definition: "Elaine's brother, who accompanies Lancelot to the Diamond Jousts. Loyal attendant." },
  { chapterIndex: 7, phrase: "Torre",
    definition: "Elaine's older brother (mentioned as \"Sir Torre\"). Minor knight of the Round Table." },

  // ═══ The Holy Grail (ch-8) ═══════════════════════════════════════
  { chapterIndex: 8, phrase: "Ambrosius",
    definition: "The monk to whom Percivale recounts the Grail Quest. Tennyson's invention; the name echoes Saint Ambrose of Milan (340–397), one of the Four Doctors of the Western Church." },
  { chapterIndex: 8, phrase: "Sangreal",
    definition: "Archaic French for \"Holy Grail\" (sang + real, \"royal blood,\" folk-etymologized from Old French san greal, \"holy grail\"). Malory's standard term." },
  { chapterIndex: 8, phrase: "maid",
    definition: "A young unmarried woman; in religious register, a nun or holy virgin. Tennyson uses it for both senses in the idyll." },
  { chapterIndex: 8, phrase: "quest",
    definition: "An adventure of moral-religious significance, especially the Grail Quest. Central chivalric concept: knights depart the court to pursue a specific visionary or moral goal." },

  // ═══ Pelleas and Ettarre (ch-9) ══════════════════════════════════
  { chapterIndex: 9, phrase: "isles",
    definition: "Small islands; Pelleas is \"lord of many a barren isle\" before arriving at court. Likely references the western Atlantic isles of Scotland or Wales." },
  { chapterIndex: 9, phrase: "golden circlet",
    definition: "A circular ornamental band of gold, worn as a minor crown or tournament-prize. The prize Pelleas wins for Ettarre, alongside the knightly sword." },

  // ═══ The Last Tournament (ch-10) ══════════════════════════════════
  { chapterIndex: 10, phrase: "mock-knight",
    definition: "A knight in jest, not in truth; Dagonet's honorific given by Gawain as practical joke. The term signals the court's degraded chivalric register." },
  { chapterIndex: 10, phrase: "Isolt",
    definition: "Tristram's lover, wife of King Mark. Two Isolts appear in Tristan tradition (of Ireland and of Brittany); Tennyson focuses on Isolt of Cornwall (of Ireland, Mark's queen)." },
  { chapterIndex: 10, phrase: "Brittany",
    definition: "The Breton peninsula of north-western France, the Celtic region from which much Arthurian material originally derives. Tristram's second wife is a Breton princess." },
  { chapterIndex: 10, phrase: "carcanet",
    definition: "An ornamental necklace set with jewels. The ruby carcanet is the prize Tristram has won in the tournament." },

  // ═══ Guinevere (ch-11) ════════════════════════════════════════════
  { chapterIndex: 11, phrase: "Holy House",
    definition: "The nunnery; any religious community. Almesbury is the \"holy house\" where Guinevere takes refuge." },
  { chapterIndex: 11, phrase: "Table Round",
    definition: "The Round Table. Arthur's oath-community, which he established at the opening of his reign and whose dissolution Guinevere's adultery has occasioned." },
  { chapterIndex: 11, phrase: "dole",
    definition: "Alms distributed to the poor by religious institutions; a charitable gift. Arthur directs Guinevere to \"distribute dole\" in her nunnery life." },
  { chapterIndex: 11, phrase: "almsdeed",
    definition: "An act of charity, a work of mercy. Compound of \"alms\" + \"deed.\" Arthur's prescription for Guinevere's penitential life." },

  // ═══ The Passing of Arthur (ch-12) ════════════════════════════════
  { chapterIndex: 12, phrase: "Avilion",
    definition: "The island of Avalon, the Arthurian afterworld. Traditionally located in the western sea; in Malory, the \"vale of Avilion.\" Arthur is borne there on the barge at his passing." },
  { chapterIndex: 12, phrase: "mere",
    definition: "A lake; Old English word preserved in English place-names (Windermere, etc.). The \"middle mere\" where Excalibur is flung at the idyll's core." },
  { chapterIndex: 12, phrase: "Queens",
    definition: "The Three Queens on the black barge who bear the dying Arthur to Avalon. Malory names them (Morgan le Fay, Queen of Northgalis, Queen of the Wastelands); Tennyson leaves them unnamed." },
  { chapterIndex: 12, phrase: "Jesu",
    definition: "Archaic vocative form of Jesus (from Latin *Jesu*). Used in medieval and early-modern English religious utterance." },
  { chapterIndex: 12, phrase: "cuirass",
    definition: "Armored plate covering chest and back; part of the knight's defensive gear. Medieval-French word from Latin *coriaceum*, \"leathern.\"" },

  // ═══ To the Queen (ch-13) ═════════════════════════════════════════
  { chapterIndex: 13, phrase: "Prince",
    definition: "The Prince of Wales (the future Edward VII), whose near-fatal illness (December 1871) and recovery (February 1872) prompted the coda's \"rememberable day.\"" },
  { chapterIndex: 13, phrase: "Hougoumont",
    definition: "Fortified farmhouse on the Waterloo battlefield (1815), defended by British forces in one of the decisive actions of the Napoleonic Wars. Tennyson's reference names the British military tradition the coda invokes." },
  { chapterIndex: 13, phrase: "Manchu",
    definition: "Referring to the Qing dynasty of China (the Manchu were the founding ethnic group). Tennyson's period-specific reference to Chinese imperial power, reflecting Victorian racial-imperial anxieties about Asian rising powers." },
  { chapterIndex: 13, phrase: "Malleor",
    definition: "Tennyson's spelling of Malory (Sir Thomas Malory, author of *Le Morte d'Arthur*, 1485). Tennyson acknowledges his primary source in the coda itself." },
  { chapterIndex: 13, phrase: "Geoffrey",
    definition: "Geoffrey of Monmouth (ca. 1095–1155), Welsh cleric whose *Historia Regum Britanniae* (History of the Kings of Britain, ca. 1136) was the foundational Latin-chronicle source of the Arthurian tradition." },
  { chapterIndex: 13, phrase: "cromlech",
    definition: "A megalithic monument of standing stones, typical of prehistoric Britain (e.g., Stonehenge). Tennyson's reference to the legendary-archaeological landscape Arthur inhabits in the popular imagination." },
]

export function getIdyllsOfTheKingGlossesForChapter(
  chapterIndex: number,
): IdyllsOfTheKingGloss[] {
  return IDYLLS_OF_THE_KING_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
