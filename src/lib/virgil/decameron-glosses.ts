/**
 * Decameron glosses — single-sentence, tap-to-reveal definitions for
 * John Payne's 1886 translation. Payne chose a deliberately archaic,
 * Latinate register — the Victorian counterpart to Urquhart's Rabelais
 * or Burton's Arabian Nights — and most of the reader friction is
 * lexical, not conceptual. These glosses identify; annotations argue.
 *
 * Scope: seed set targeting ~150 entries covering (a) Payne's recurring
 * archaisms (*wit, fain, quoth, eke, sith, meseemeth, anon, whilom,
 * natheless, iwis*…), (b) Italian terms Payne leaves untranslated
 * (*messer, monna, ser, brigata, podestà, contado*…), and (c) historical
 * or legal terms readers may not meet elsewhere (*podestà, florin,
 * gonfalonier*). A handful are scoped to specific flat-chapter indices
 * where they first appear; most are repertoire-wide and fire on every
 * chapter where the phrase is present.
 *
 * Phrase-matching is a verbatim substring scan over the rendered
 * chapter HTML, so phrasing sensitivity matters. Payne tends to use
 * spelling that Victorians preserved from earlier English — "hath",
 * "doth", "thou" forms — and some of these are common enough not to
 * need glossing. We gloss only what readers halt on.
 */

export interface DecameronGloss {
  /** If set, only fires on this flat chapter index. If null, fires on
   *  every chapter of the Decameron. */
  flatChapter: number | null
  /** Exact substring to wrap in a tooltip, case-sensitive. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const DECAMERON_GLOSSES: DecameronGloss[] = [

  // ── Repertoire-wide archaisms (fire on every chapter) ─────────────

  // Archaic English verbs and adverbs Payne uses throughout.
  { flatChapter: null, phrase: "meseemeth",
    definition: "It seems to me — an archaic impersonal construction Payne uses often for Boccaccio's *mi pare*." },
  { flatChapter: null, phrase: "methinketh",
    definition: "It seems to me — variant of *meseemeth*, preserving the middle-English construction." },
  { flatChapter: null, phrase: "methinks",
    definition: "It seems to me — the shorter and more familiar cousin of *methinketh*." },
  { flatChapter: null, phrase: "whilom",
    definition: "Formerly, once upon a time, in days gone by." },
  { flatChapter: null, phrase: "anon",
    definition: "At once, immediately, shortly; also — in narrative — 'next' or 'soon after'." },
  { flatChapter: null, phrase: "natheless",
    definition: "Nevertheless, nonetheless." },
  { flatChapter: null, phrase: "nathless",
    definition: "Nevertheless (shorter variant of *natheless*)." },
  { flatChapter: null, phrase: "albeit",
    definition: "Although — literally 'all-be-it'." },
  { flatChapter: null, phrase: "certes",
    definition: "Certainly, assuredly — from Old French *certes*." },
  { flatChapter: null, phrase: "iwis",
    definition: "Certainly, indeed — a middle-English survival Payne preserves for the archaic register." },
  { flatChapter: null, phrase: "perchance",
    definition: "Perhaps; by chance." },
  { flatChapter: null, phrase: "verily",
    definition: "Truly, indeed." },
  { flatChapter: null, phrase: "quoth",
    definition: "Said — invariably past tense, and placed before the speaker (as in 'quoth he')." },
  { flatChapter: null, phrase: "fain",
    definition: "Gladly, willingly; or, as a verb, 'would like to'." },
  { flatChapter: null, phrase: "lief",
    definition: "Gladly, willingly — usually in the comparative: 'as lief', 'liefer'." },
  { flatChapter: null, phrase: "liefer",
    definition: "More gladly, sooner — comparative of *lief*." },
  { flatChapter: null, phrase: "eke",
    definition: "Also, moreover — the middle-English cousin of German *auch*." },
  { flatChapter: null, phrase: "sith",
    definition: "Since; seeing that." },
  { flatChapter: null, phrase: "belike",
    definition: "Probably, likely — used to soften a guess." },
  { flatChapter: null, phrase: "apace",
    definition: "Quickly, at a pace." },
  { flatChapter: null, phrase: "privily",
    definition: "Secretly, in private." },
  { flatChapter: null, phrase: "enow",
    definition: "Enough — an older spelling Payne preserves for rhythm." },
  { flatChapter: null, phrase: "withal",
    definition: "Moreover; along with this; also — often placed at the end of a clause." },
  { flatChapter: null, phrase: "wont",
    definition: "Accustomed (adjective) or habit (noun): 'he was wont to rise early'." },
  { flatChapter: null, phrase: "trow",
    definition: "To believe, to suppose, to suspect." },
  { flatChapter: null, phrase: "wis",
    definition: "To know, or 'I know' — an older form Payne uses in emphatic asides." },
  { flatChapter: null, phrase: "sooth",
    definition: "Truth — surviving in 'forsooth', 'soothsayer'." },
  { flatChapter: null, phrase: "forsooth",
    definition: "In truth, truly — often used to introduce a pointed remark." },
  { flatChapter: null, phrase: "hight",
    definition: "Named, called — a passive survival from Old English *hatan*." },
  { flatChapter: null, phrase: "gramercy",
    definition: "Many thanks — from Old French *grand merci*." },
  { flatChapter: null, phrase: "pardie",
    definition: "A mild oath — 'by God', from French *par Dieu*." },
  { flatChapter: null, phrase: "prithee",
    definition: "I pray thee — a contraction used to soften a request." },
  { flatChapter: null, phrase: "anent",
    definition: "Concerning, with respect to, about." },
  { flatChapter: null, phrase: "mickle",
    definition: "Much, great — an older form preserved in Scottish English." },
  { flatChapter: null, phrase: "bounden",
    definition: "Bound, obliged — past participle of *bind* in an older construction." },
  { flatChapter: null, phrase: "leman",
    definition: "A lover or sweetheart — usually the secret or unsanctioned kind." },
  { flatChapter: null, phrase: "wight",
    definition: "A creature or person — Payne uses it neutrally, not ironically." },
  { flatChapter: null, phrase: "bruit",
    definition: "A rumor or public report — from Old French *bruit*, 'noise'." },
  { flatChapter: null, phrase: "dight",
    definition: "Arrayed, dressed, prepared — past participle of the archaic verb *dight*." },
  { flatChapter: null, phrase: "erst",
    definition: "Formerly, at first — preserved in 'erstwhile'." },
  { flatChapter: null, phrase: "erstwhile",
    definition: "Formerly, in past times." },
  { flatChapter: null, phrase: "comfits",
    definition: "Sweets, confections — typically candied fruit or spiced sugar." },
  { flatChapter: null, phrase: "chirurgeon",
    definition: "Surgeon — from Greek via French, before the term was simplified." },
  { flatChapter: null, phrase: "gabardine",
    definition: "A long loose cloak, especially one worn by Jews or pilgrims in medieval Italy." },
  { flatChapter: null, phrase: "sirrah",
    definition: "A form of address to someone of lower rank, often impatient or contemptuous." },
  { flatChapter: null, phrase: "flouted",
    definition: "Mocked, scorned openly — stronger than modern 'ignored'." },
  { flatChapter: null, phrase: "swoon",
    definition: "To faint — a complete loss of consciousness, typically from emotion." },
  { flatChapter: null, phrase: "boon",
    definition: "A favor or request — especially one begged as a gift." },
  { flatChapter: null, phrase: "privity",
    definition: "Private knowledge, especially of a secret arrangement." },
  { flatChapter: null, phrase: "peradventure",
    definition: "Perhaps, maybe — more formal than *perchance*." },
  { flatChapter: null, phrase: "ofttimes",
    definition: "Often — a literary compression of 'oft times'." },
  { flatChapter: null, phrase: "aforetimes",
    definition: "In former times, in days past." },
  { flatChapter: null, phrase: "aforetime",
    definition: "Formerly, previously — singular of *aforetimes*." },
  { flatChapter: null, phrase: "thither",
    definition: "To that place — the directional counterpart of 'there'." },
  { flatChapter: null, phrase: "whither",
    definition: "To what place, to where — directional counterpart of 'where'." },
  { flatChapter: null, phrase: "hither",
    definition: "To this place — directional counterpart of 'here'." },
  { flatChapter: null, phrase: "betimes",
    definition: "Early, in good time." },
  { flatChapter: null, phrase: "ensue",
    definition: "To follow as a consequence — from Old French *ensivre*, 'to follow'." },
  { flatChapter: null, phrase: "eschew",
    definition: "To shun, to avoid deliberately." },
  { flatChapter: null, phrase: "travail",
    definition: "Hard labor, painful effort, sometimes with a hint of childbirth's original meaning." },
  { flatChapter: null, phrase: "enjoin",
    definition: "To command, to order — especially under moral or religious authority." },

  // ── Italian-in-Payne: civic and social honorifics ─────────────────

  { flatChapter: null, phrase: "messer",
    definition: "Italian 'Sir' — the honorific for knights, lawyers, and gentlemen; derived from medieval Latin *meus senior*." },
  { flatChapter: null, phrase: "Messer",
    definition: "Italian 'Sir' — the honorific for knights, lawyers, and gentlemen; derived from medieval Latin *meus senior*." },
  { flatChapter: null, phrase: "monna",
    definition: "Italian 'Mrs.' or 'Madam' — a contraction of *madonna*, used for married women of substance." },
  { flatChapter: null, phrase: "Monna",
    definition: "Italian 'Mrs.' or 'Madam' — a contraction of *madonna*, used for married women of substance." },
  { flatChapter: null, phrase: "Madonna",
    definition: "Italian 'My lady' — more formal than *Monna*; reserved for noblewomen and for the Virgin Mary." },
  { flatChapter: null, phrase: "Ser ",
    definition: "Italian abbreviated honorific — shorter and slightly humbler than Messer; typical for notaries, merchants, and clergymen (Ser Ciappelletto, Ser Cepparello)." },
  { flatChapter: null, phrase: "signor",
    definition: "Italian 'lord' — a general honorific, less specific than *messer* or *ser*." },
  { flatChapter: null, phrase: "signora",
    definition: "Italian 'lady' — counterpart to *signor*, general honorific." },
  { flatChapter: null, phrase: "brigata",
    definition: "Italian 'the company' — what the ten storytellers call themselves: a band, a troupe, a small society bound by a shared purpose." },
  { flatChapter: null, phrase: "novella",
    definition: "Italian for a short tale — literally 'a little new thing'; the word from which our 'novel' and 'novella' derive." },
  { flatChapter: null, phrase: "novelle",
    definition: "Plural of *novella* — the individual tales of the Decameron." },
  { flatChapter: null, phrase: "giornata",
    definition: "Italian 'day' — used both for the twenty-four hours and for a day's set of ten tales." },

  // ── Italian-in-Payne: office, law, currency, geography ────────────

  { flatChapter: null, phrase: "podestà",
    definition: "The chief magistrate of a medieval Italian commune — an outside nobleman hired to judge impartially for a fixed term." },
  { flatChapter: null, phrase: "contado",
    definition: "The rural district and villages under the jurisdiction of a city — a Florentine lived either in the *città* or in the *contado*." },
  { flatChapter: null, phrase: "florin",
    definition: "Florence's gold coin, first struck 1252; the dollar of late-medieval Europe — stable, respected, and minted for a merchant republic." },
  { flatChapter: null, phrase: "florins",
    definition: "Florence's gold coin, first struck 1252 — the stable currency of the medieval Mediterranean merchant world." },
  { flatChapter: null, phrase: "ducat",
    definition: "Venice's gold coin, modeled on the Florentine florin; the second great trade currency of late-medieval Italy." },
  { flatChapter: null, phrase: "ducats",
    definition: "Venice's gold coin, the second great trade currency of late-medieval Italy, modeled on the Florentine florin." },
  { flatChapter: null, phrase: "gonfalonier",
    definition: "The standard-bearer of a Florentine quarter or, at the city level, the Gonfalonier of Justice — the chief executive of the republic." },
  { flatChapter: null, phrase: "Signoria",
    definition: "Florence's governing council of eight priors plus the Gonfalonier of Justice — the executive of the merchant republic." },
  { flatChapter: null, phrase: "Guelph",
    definition: "The pro-papal faction in medieval Italian politics — in Boccaccio's Florence, the dominant party, itself later split into Black and White Guelphs." },
  { flatChapter: null, phrase: "Ghibelline",
    definition: "The pro-imperial faction in medieval Italian politics — opposed to the Guelphs; exiled from Florence after 1266." },
  { flatChapter: null, phrase: "Minorite",
    definition: "A Franciscan friar — from the order's self-description *Fratres Minores*, 'Lesser Brothers'." },
  { flatChapter: null, phrase: "Inquisitor",
    definition: "A cleric, usually Dominican, appointed by the papacy to investigate heresy; a figure of dread — and, in Boccaccio, of anticlerical satire." },
  { flatChapter: null, phrase: "indulgence",
    definition: "A partial remission of the temporal punishment for sin — a frequent Decameron target when sold rather than given." },

  // ── First-appearance (chapter-scoped) glosses ─────────────────────

  // Proem / Plague Introduction
  { flatChapter: 0, phrase: "of low estate",
    definition: "Of humble birth — Boccaccio, son of a Certaldo merchant and an unknown mother, deflects attention from his own class with this formula." },
  { flatChapter: 121, phrase: "Prince Galahalt",
    definition: "The Decameron's subtitle — Payne's English for Boccaccio's 'Prencipe Galeotto'. Galehaut / Galeotto is the go-between whose name Francesca gives the book that tempted her to adultery in Dante's Inferno V ('Galeotto fu 'l libro'); Boccaccio claims the very role Dante damned." },
  { flatChapter: 2, phrase: "pestilence",
    definition: "The Black Death — the bubonic plague pandemic of 1347–51 that killed a third of Europe and perhaps half of Florence; Boccaccio was an eyewitness." },
  { flatChapter: 2, phrase: "Santa Maria Novella",
    definition: "The great Dominican basilica in Florence, built 1279–1357; the historical meeting place Boccaccio gives the brigata." },
  { flatChapter: 2, phrase: "humours",
    definition: "In medieval medicine, the four bodily fluids (blood, phlegm, yellow bile, black bile) whose imbalance was held to cause disease — the plague was widely blamed on humoral corruption." },
  { flatChapter: 2, phrase: "miasma",
    definition: "Corrupted air — the medieval theory that plague was spread by foul vapors rising from swamps, unburied dead, and bodily corruption." },

  // Day 1 Tale 1 — Ser Ciappelletto
  { flatChapter: 3, phrase: "Ser Cepparello",
    definition: "Nickname-turned-formal-name for Ciapperello da Prato, a real notary active in Florence in the late thirteenth century; 'Ciappelletto' is a Burgundian diminutive his French clients gave him." },
  { flatChapter: 3, phrase: "usurer",
    definition: "A money-lender at interest — a profession formally condemned by the Church, but central to the Florentine economy and to many Decameron plots." },
  { flatChapter: 3, phrase: "extreme unction",
    definition: "The Catholic sacrament of anointing the dying; receiving it validly required true confession — the whole machinery Ciappelletto will exploit." },

  // Day 1 Tale 3 — Melchizedek
  { flatChapter: 5, phrase: "Saladin",
    definition: "Ṣalāḥ ad-Dīn Yūsuf ibn Ayyūb (1137–93), sultan of Egypt and Syria, recapturer of Jerusalem (1187); for medieval Europeans the exemplar of the noble Muslim ruler — he appears again in X.9." },
  { flatChapter: 5, phrase: "Melchizedek",
    definition: "A Jewish moneylender in Saladin's Alexandria; the name is biblical (Genesis 14), given to a priest-king who blesses Abraham — Boccaccio chooses it deliberately." },

  // Day 1 Tale 5 — Marchioness of Montferrat
  { flatChapter: 7, phrase: "Marchioness of Montferrat",
    definition: "The wife of a historical marquis of Montferrat (in Piedmont); Boccaccio draws on a stock legend of a crusading king's attempted visit." },

  // Day 2 Tale 5 — Andreuccio
  { flatChapter: 19, phrase: "Andreuccio",
    definition: "A young Perugian horse-dealer, the comic protagonist of Boccaccio's most admired single tale — the picaresque Naples night." },

  // Day 4 Introduction — Author Intervention
  { flatChapter: 38, phrase: "Guido Cavalcanti",
    definition: "Florentine poet (c. 1250–1300), Dante's 'first friend' and a leading light of the *dolce stil novo*; Boccaccio cites him in the Day IV self-defense as an elder he admires — and tells a tale of him at VI.9." },

  // Day 4 Tale 1 — Ghismonda
  { flatChapter: 39, phrase: "Tancredi",
    definition: "Prince of Salerno — the southern Italian city that had been a Norman kingdom; in Boccaccio's hands he is the tyrannical father whose jealousy will destroy his own daughter." },
  { flatChapter: 39, phrase: "Guiscardo",
    definition: "Tancredi's valet and Ghismonda's lover; the low-born beloved whose death drives Ghismonda's famous speech defending natural over class-based love." },

  // Day 4 Tale 5 — Lisabetta's basil
  { flatChapter: 43, phrase: "Lisabetta",
    definition: "A young Messinese woman whose brothers murder her lover Lorenzo; she buries his head in a pot of basil. The tale becomes Keats's *Isabella; or, the Pot of Basil* (1818)." },

  // Day 5 Tale 8 — Nastagio
  { flatChapter: 58, phrase: "Nastagio degli Onesti",
    definition: "A young nobleman of Ravenna whose vision in a pine-wood converts his beloved; Botticelli's four 1483 panels of this tale are the Decameron's best-known painted afterlife." },

  // Day 5 Tale 9 — Federigo's Falcon
  { flatChapter: 59, phrase: "Federigo",
    definition: "Federigo degli Alberighi, the ruined nobleman who kills his last falcon to feed the woman he has loved in vain — the protagonist of Boccaccio's most perfectly constructed short tale." },
  { flatChapter: 59, phrase: "Monna Giovanna",
    definition: "The widow Federigo has loved unrequitedly; her choice at the tale's end to marry him, despite his poverty, is the Decameron's purest ethical resolution." },

  // Day 6 Tale 9 — Guido Cavalcanti (Elissa)
  { flatChapter: 71, phrase: "Orto San Michele",
    definition: "A Florentine grain market — later replaced by the church of Orsanmichele — that Boccaccio uses as the geographic hinge of Cavalcanti's witty retort." },

  // Day 10 Tale 10 — Griselda
  { flatChapter: 120, phrase: "Saluzzo",
    definition: "A small marquisate in the Piedmontese foothills; the setting of the Griselda tale, chosen for its rustic remoteness from the Italian urban world." },
  { flatChapter: 120, phrase: "Gualtieri",
    definition: "Walter, Marquis of Saluzzo — the nobleman who tests his peasant wife Griselda to the limit of cruelty. Petrarch Latinized the tale; Chaucer Englished it as the Clerk's Tale." },
  { flatChapter: 120, phrase: "Griselda",
    definition: "A peasant's daughter who becomes Marchioness of Saluzzo and endures an endless series of tests of obedience without breaking; the figure who has provoked the longest reception-history debate in the Decameron." },

  // Author's Conclusion
  { flatChapter: 121, phrase: "no gainsaying it",
    definition: "Payne's turn of phrase for 'there is no denying it'; Boccaccio's defense frequently adopts a mock-legal posture." },
]
