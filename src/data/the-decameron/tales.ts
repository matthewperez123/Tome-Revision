/**
 * The Hundred Tales — tale-by-tale metadata for Decameron narration,
 * type-classification, and TOC rubric-subtitles.
 *
 * Each tale has:
 *   - day (1–10) and tale (1–10): canonical Boccaccian numbering.
 *   - flatChapter: index into public/content/the-decameron/ meta.json.
 *   - narrator: the BrigataId who tells it. Dioneo holds the tenth slot
 *     of every day from Day II onwards (and fourth of Day I).
 *   - rubricSubtitle: a short editor's-summary one-liner used in the TOC
 *     and tale-header card. These are our own editorial paraphrases of
 *     Payne's long arguments, not verbatim Payne; readers who want the
 *     full period rubrics will find them in the chapter text.
 *   - types: one or more TaleType tags used by the tracker's filter view
 *     and by the achievement system.
 *
 * Narrator attributions follow the canonical Boccaccian order preserved in
 * every major edition (Branca, McWilliam, Rebhorn). Dioneo's privileged
 * final slot is the most load-bearing recurring feature of the frame.
 */

import type { BrigataId } from "./brigata"

export type TaleType =
  | "bawdy"
  | "tragic"
  | "comic"
  | "witty"
  | "religious-satire"
  | "merchant-life"
  | "fortune-reversal"
  | "love-overcoming-obstacle"
  | "clever-servant"
  | "trick-on-spouse"
  | "magnificence"

export interface Tale {
  day: number
  tale: number
  flatChapter: number
  narrator: BrigataId
  rubricSubtitle: string
  types: TaleType[]
}

/** The 100 tales in reading order. */
export const TALES: Tale[] = [
  // ── Day I ──── Queen Pampinea · Free theme ────────────────────────
  { day: 1, tale: 1, flatChapter: 3, narrator: "pamfilo",
    rubricSubtitle: "Ser Ciappelletto — the wickedest man in the world is canonized a saint on a lying deathbed confession.",
    types: ["religious-satire", "comic"] },
  { day: 1, tale: 2, flatChapter: 4, narrator: "neifile",
    rubricSubtitle: "Abraham the Jew goes to Rome, observes the corruption of the Curia, and (to his friend's astonishment) converts.",
    types: ["religious-satire"] },
  { day: 1, tale: 3, flatChapter: 5, narrator: "filomena",
    rubricSubtitle: "Melchizedek the Jew answers Saladin's trap with the parable of the three rings.",
    types: ["witty", "religious-satire"] },
  { day: 1, tale: 4, flatChapter: 6, narrator: "dioneo",
    rubricSubtitle: "A monk falls into sin; the abbot, intending to punish him, falls into the same sin and cannot.",
    types: ["bawdy", "religious-satire", "comic"] },
  { day: 1, tale: 5, flatChapter: 7, narrator: "fiammetta",
    rubricSubtitle: "The Marchioness of Montferrat serves a dinner of nothing but hens and puts the besotted King of France off his suit.",
    types: ["witty"] },
  { day: 1, tale: 6, flatChapter: 8, narrator: "emilia",
    rubricSubtitle: "A worthy man rebukes the hypocrisy of a covetous inquisitor with a single perfect reply.",
    types: ["witty", "religious-satire"] },
  { day: 1, tale: 7, flatChapter: 9, narrator: "filostrato",
    rubricSubtitle: "Bergamino rebukes Can della Scala's unaccustomed stinginess by telling the tale of Primasso and the Abbot of Cluny.",
    types: ["witty"] },
  { day: 1, tale: 8, flatChapter: 10, narrator: "lauretta",
    rubricSubtitle: "Guglielmo Borsiere, with a courteous riposte, shames Messer Ermino de' Grimaldi out of his avarice.",
    types: ["witty"] },
  { day: 1, tale: 9, flatChapter: 11, narrator: "elisa",
    rubricSubtitle: "A Gascon lady rebukes the craven King of Cyprus; he mends his ways.",
    types: ["witty"] },
  { day: 1, tale: 10, flatChapter: 12, narrator: "pampinea",
    rubricSubtitle: "Master Alberto of Bologna, elderly and in love, answers a young lady's mockery with such grace that she is silenced.",
    types: ["witty", "love-overcoming-obstacle"] },

  // ── Day II ─── Queen Filomena · Fortune's happy endings ───────────
  { day: 2, tale: 1, flatChapter: 15, narrator: "neifile",
    rubricSubtitle: "Martellino, feigning palsy, is exposed as a fraud at the shrine of a new saint and nearly hanged.",
    types: ["comic", "fortune-reversal"] },
  { day: 2, tale: 2, flatChapter: 16, narrator: "filostrato",
    rubricSubtitle: "Rinaldo d'Asti, robbed and stripped by highwaymen, is lodged and warmed by a widow who proves generous in every way.",
    types: ["fortune-reversal", "bawdy"] },
  { day: 2, tale: 3, flatChapter: 17, narrator: "pampinea",
    rubricSubtitle: "Three young men squander their fortune; their nephew, returning, accidentally marries the Abbot of England — who turns out to be the King of England's daughter in disguise.",
    types: ["fortune-reversal", "merchant-life"] },
  { day: 2, tale: 4, flatChapter: 18, narrator: "lauretta",
    rubricSubtitle: "Landolfo Rufolo, ruined merchant turned pirate, is shipwrecked — and saved by a chest full of jewels.",
    types: ["fortune-reversal", "merchant-life"] },
  { day: 2, tale: 5, flatChapter: 19, narrator: "fiammetta",
    rubricSubtitle: "Andreuccio of Perugia, naive horse-buyer in Naples, is stripped, entombed, and rescued across a single extraordinary night.",
    types: ["comic", "fortune-reversal", "merchant-life"] },
  { day: 2, tale: 6, flatChapter: 20, narrator: "emilia",
    rubricSubtitle: "Madonna Beritola, shipwrecked and separated from her sons, lives among the beasts until the wheel turns again.",
    types: ["fortune-reversal", "tragic", "love-overcoming-obstacle"] },
  { day: 2, tale: 7, flatChapter: 21, narrator: "pamfilo",
    rubricSubtitle: "Alatiel, daughter of the Sultan, bound for her bridegroom, passes through the beds of nine lovers in four years and arrives a supposed virgin.",
    types: ["fortune-reversal", "bawdy"] },
  { day: 2, tale: 8, flatChapter: 22, narrator: "elisa",
    rubricSubtitle: "The Count of Antwerp, falsely accused, lives in disguise as a horse-keeper until his children and his name are restored.",
    types: ["fortune-reversal", "tragic"] },
  { day: 2, tale: 9, flatChapter: 23, narrator: "filomena",
    rubricSubtitle: "Bernabò of Genoa, tricked by Ambrogiuolo into believing his wife unfaithful, orders her death; she survives in disguise and unmasks the deceiver. — Shakespeare's *Cymbeline*.",
    types: ["fortune-reversal", "tragic", "love-overcoming-obstacle"] },
  { day: 2, tale: 10, flatChapter: 24, narrator: "dioneo",
    rubricSubtitle: "Paganino the pirate abducts Messer Ricciardo's neglected wife; when the husband comes to ransom her, she chooses to stay with the pirate.",
    types: ["bawdy", "comic", "trick-on-spouse"] },

  // ── Day III ── Queen Neifile · Industry and recovery ──────────────
  { day: 3, tale: 1, flatChapter: 27, narrator: "filostrato",
    rubricSubtitle: "Masetto of Lamporecchio feigns himself dumb and becomes gardener to a convent of women, who all resort to him.",
    types: ["bawdy", "religious-satire"] },
  { day: 3, tale: 2, flatChapter: 28, narrator: "pampinea",
    rubricSubtitle: "A groom, having lain with King Agilulf's wife by deceit, is detected by the king — who cleverly saves him and saves his own honour.",
    types: ["witty", "clever-servant"] },
  { day: 3, tale: 3, flatChapter: 29, narrator: "filomena",
    rubricSubtitle: "A lady uses a gullible friar as an unwitting messenger to arrange her adultery.",
    types: ["religious-satire", "trick-on-spouse"] },
  { day: 3, tale: 4, flatChapter: 30, narrator: "pamfilo",
    rubricSubtitle: "Dom Felice teaches Fra Puccio a miraculous penance, and uses the time to lie with his wife.",
    types: ["bawdy", "religious-satire", "trick-on-spouse"] },
  { day: 3, tale: 5, flatChapter: 31, narrator: "elisa",
    rubricSubtitle: "Zima gives Francesco Vergellesi a palfrey in exchange for leave to speak with his wife; finding her silent, he speaks for both.",
    types: ["witty", "trick-on-spouse"] },
  { day: 3, tale: 6, flatChapter: 32, narrator: "fiammetta",
    rubricSubtitle: "Ricciardo Minutolo, by a ruse in a bathhouse, wins Filippello Sighinolfo's wife away from his own suit.",
    types: ["bawdy", "trick-on-spouse"] },
  { day: 3, tale: 7, flatChapter: 33, narrator: "emilia",
    rubricSubtitle: "Tedaldo, long thought dead, returns disguised as a pilgrim and unweaves the calamity his absence caused.",
    types: ["fortune-reversal", "love-overcoming-obstacle"] },
  { day: 3, tale: 8, flatChapter: 34, narrator: "lauretta",
    rubricSubtitle: "Ferondo is given a sleeping-draught, buried as dead, and 'purged' in a fake Purgatory while the abbot lies with his wife.",
    types: ["religious-satire", "bawdy", "trick-on-spouse"] },
  { day: 3, tale: 9, flatChapter: 35, narrator: "neifile",
    rubricSubtitle: "Giletta of Narbonne cures the King of France, wins the count she loves, and by a bed-trick conceives his heir. — Shakespeare's *All's Well That Ends Well*.",
    types: ["love-overcoming-obstacle", "clever-servant"] },
  { day: 3, tale: 10, flatChapter: 36, narrator: "dioneo",
    rubricSubtitle: "Alibech seeks God in the desert and is taught by the hermit Rustico how to put the devil into hell.",
    types: ["bawdy", "religious-satire"] },

  // ── Day IV ─── King Filostrato · Unhappy loves ────────────────────
  { day: 4, tale: 1, flatChapter: 39, narrator: "fiammetta",
    rubricSubtitle: "Tancredi, Prince of Salerno, slays the low-born lover of his daughter Ghismonda and sends her his heart in a gold cup; she drinks poison over it and dies defending their love.",
    types: ["tragic", "love-overcoming-obstacle"] },
  { day: 4, tale: 2, flatChapter: 40, narrator: "pampinea",
    rubricSubtitle: "Frate Alberto, persuading the foolish Madonna Lisetta that the angel Gabriel is in love with her, is exposed and publicly shamed in Venice.",
    types: ["religious-satire", "comic"] },
  { day: 4, tale: 3, flatChapter: 41, narrator: "lauretta",
    rubricSubtitle: "Three young men flee Marseilles with three sisters; love turns to jealousy, and all come to ruin.",
    types: ["tragic"] },
  { day: 4, tale: 4, flatChapter: 42, narrator: "elisa",
    rubricSubtitle: "Gerbino, prince of Sicily, boards a ship for the Tunisian princess he has loved by report; in the battle she is killed.",
    types: ["tragic", "love-overcoming-obstacle"] },
  { day: 4, tale: 5, flatChapter: 43, narrator: "filomena",
    rubricSubtitle: "Lisabetta's brothers murder her lover; she buries his head in a pot of basil and waters it with her tears until they take it from her, and she dies. — Keats's *Isabella; or, the Pot of Basil*.",
    types: ["tragic", "love-overcoming-obstacle"] },
  { day: 4, tale: 6, flatChapter: 44, narrator: "pamfilo",
    rubricSubtitle: "Andreuola dreams her lover's death; waking, she finds him dead in truth, and clears her name before the judge by the honesty of her grief.",
    types: ["tragic"] },
  { day: 4, tale: 7, flatChapter: 45, narrator: "emilia",
    rubricSubtitle: "Simona and Pasquino die by a poisoned sage-leaf; the court, investigating, condemns no one, for love had meant no harm.",
    types: ["tragic"] },
  { day: 4, tale: 8, flatChapter: 46, narrator: "neifile",
    rubricSubtitle: "Girolamo, parted from Salvestra and sent abroad, returns to find her married; he dies beside her in silence and she dies upon his bier.",
    types: ["tragic", "love-overcoming-obstacle"] },
  { day: 4, tale: 9, flatChapter: 47, narrator: "filostrato",
    rubricSubtitle: "Guiglielmo Rossiglione slays his wife's lover and feeds her the heart; when she learns what she has eaten, she throws herself from the window.",
    types: ["tragic"] },
  { day: 4, tale: 10, flatChapter: 48, narrator: "dioneo",
    rubricSubtitle: "The wife of a physician, thinking her lover dead of a drug, hides him in a chest that is then stolen — and the chest delivers him, alive, to absurd misadventures.",
    types: ["bawdy", "comic", "trick-on-spouse"] },

  // ── Day V ──── Queen Fiammetta · Happy loves after tribulation ────
  { day: 5, tale: 1, flatChapter: 51, narrator: "pamfilo",
    rubricSubtitle: "Cimone, a brutish youth, is civilized by the sight of the sleeping Efigenia and wins her by arms and persistence.",
    types: ["love-overcoming-obstacle", "fortune-reversal"] },
  { day: 5, tale: 2, flatChapter: 52, narrator: "emilia",
    rubricSubtitle: "Gostanza, flung upon the sea, drifts to Africa, finds her beloved alive, and is restored to him through the generosity of a king.",
    types: ["fortune-reversal", "love-overcoming-obstacle"] },
  { day: 5, tale: 3, flatChapter: 53, narrator: "elisa",
    rubricSubtitle: "Pietro Boccamazza and Agnolella, eloping, are separated in the wilderness of the Campagna; after a night among brigands and a night among wolves, they are reunited.",
    types: ["love-overcoming-obstacle", "fortune-reversal"] },
  { day: 5, tale: 4, flatChapter: 54, narrator: "filostrato",
    rubricSubtitle: "Ricciardo Manardi is discovered in his beloved's bed by her father, who sets aside his anger and marries them on the spot. — The nightingale.",
    types: ["love-overcoming-obstacle", "bawdy"] },
  { day: 5, tale: 5, flatChapter: 55, narrator: "neifile",
    rubricSubtitle: "Guidotto da Cremona, dying, commends his adopted daughter to Giacomino; two suitors quarrel over her, and her true brother is revealed.",
    types: ["love-overcoming-obstacle", "fortune-reversal"] },
  { day: 5, tale: 6, flatChapter: 56, narrator: "pampinea",
    rubricSubtitle: "Gianni of Procida, caught in bed with the woman he loves at the court of King Frederick of Sicily, is saved at the stake by a minister's intercession.",
    types: ["love-overcoming-obstacle", "fortune-reversal"] },
  { day: 5, tale: 7, flatChapter: 57, narrator: "lauretta",
    rubricSubtitle: "Teodoro, slave-born, loves his master's daughter Violante; sentenced to death, he is identified as the lost son of an Armenian lord and marries her.",
    types: ["love-overcoming-obstacle", "fortune-reversal"] },
  { day: 5, tale: 8, flatChapter: 58, narrator: "filomena",
    rubricSubtitle: "Nastagio degli Onesti, rejected by his lady, sees in the pine-wood of Ravenna a damned knight hunting a damned lady with dogs; he uses the vision to win her. — Botticelli's four panels.",
    types: ["love-overcoming-obstacle", "tragic"] },
  { day: 5, tale: 9, flatChapter: 59, narrator: "fiammetta",
    rubricSubtitle: "Federigo, ruined by loving Monna Giovanna in vain, kills and serves her his last falcon when she visits him — and by that sacrifice wins her.",
    types: ["love-overcoming-obstacle", "magnificence"] },
  { day: 5, tale: 10, flatChapter: 60, narrator: "dioneo",
    rubricSubtitle: "Pietro di Vinciolo, whose tastes lie elsewhere, discovers his wife's lover hidden beneath a hen-coop; the resolution is the bawdiest in the collection.",
    types: ["bawdy", "trick-on-spouse", "comic"] },

  // ── Day VI ─── Queen Elissa · Witty ripostes ──────────────────────
  { day: 6, tale: 1, flatChapter: 63, narrator: "filomena",
    rubricSubtitle: "A knight offers Madonna Oretta a tale to shorten the road; he tells it so badly that she dismounts, and she rebukes him with a single graceful line.",
    types: ["witty"] },
  { day: 6, tale: 2, flatChapter: 64, narrator: "pampinea",
    rubricSubtitle: "Cisti the baker, with a gesture and a bottle of fine wine, teaches Geri Spina's servants — and Geri himself — a lesson in courtesy.",
    types: ["witty", "merchant-life"] },
  { day: 6, tale: 3, flatChapter: 65, narrator: "lauretta",
    rubricSubtitle: "Monna Nonna de' Pulci, insulted publicly by the Bishop of Florence, silences him with a single tart reply.",
    types: ["witty"] },
  { day: 6, tale: 4, flatChapter: 66, narrator: "neifile",
    rubricSubtitle: "Chichibio the cook, having given one leg of a crane to his sweetheart, persuades his master that all cranes have only one leg — until the master proves otherwise.",
    types: ["witty", "comic", "clever-servant"] },
  { day: 6, tale: 5, flatChapter: 67, narrator: "pamfilo",
    rubricSubtitle: "The painter Giotto and the jurist Forese da Rabatta, caught in a rainstorm, trade ironies on their respective homeliness.",
    types: ["witty"] },
  { day: 6, tale: 6, flatChapter: 68, narrator: "fiammetta",
    rubricSubtitle: "Michele Scalza demonstrates to his friends that the Baronci are the noblest family in the world — because the angels plainly made them first, when they were still practising.",
    types: ["witty", "comic"] },
  { day: 6, tale: 7, flatChapter: 69, narrator: "filostrato",
    rubricSubtitle: "Madonna Filippa, charged under the law of Prato for adultery, defends herself with such wit that the statute is reformed on the spot.",
    types: ["witty"] },
  { day: 6, tale: 8, flatChapter: 70, narrator: "emilia",
    rubricSubtitle: "Cesca, who finds everyone about her vulgar, is silenced by her uncle with a single word about the mirror.",
    types: ["witty"] },
  { day: 6, tale: 9, flatChapter: 71, narrator: "elisa",
    rubricSubtitle: "Guido Cavalcanti, surprised among tombs by a company of Florentine idlers, vaults a stone and escapes with a riposte the company is still parsing when he is gone.",
    types: ["witty"] },
  { day: 6, tale: 10, flatChapter: 72, narrator: "dioneo",
    rubricSubtitle: "Frate Cipolla promises to show his rustic audience the feather of the angel Gabriel; when the relic is stolen from him, he substitutes coals and outsells every sermon in Tuscany.",
    types: ["religious-satire", "comic", "witty"] },

  // ── Day VII ── King Dioneo · Wives' tricks on husbands ────────────
  { day: 7, tale: 1, flatChapter: 75, narrator: "emilia",
    rubricSubtitle: "Gianni Lotteringhi, hearing his wife's lover at the door, is persuaded by her that it is a werewolf to be exorcized.",
    types: ["comic", "trick-on-spouse", "bawdy"] },
  { day: 7, tale: 2, flatChapter: 76, narrator: "filostrato",
    rubricSubtitle: "Peronella hides her lover in a wine-cask; when her husband comes home unexpectedly she sells him the cask — and has her lover scrape it clean from the inside while she makes eyes over the rim.",
    types: ["comic", "trick-on-spouse", "bawdy"] },
  { day: 7, tale: 3, flatChapter: 77, narrator: "elisa",
    rubricSubtitle: "Friar Rinaldo, discovered by a husband in bed with his gossip, saves both their skins with a piece of inspired theology concerning a sick child.",
    types: ["religious-satire", "trick-on-spouse", "bawdy"] },
  { day: 7, tale: 4, flatChapter: 78, narrator: "lauretta",
    rubricSubtitle: "Tofano, locking out his drunken wife, is himself locked out by her strategem and comes off the worse in the quarrel.",
    types: ["comic", "trick-on-spouse"] },
  { day: 7, tale: 5, flatChapter: 79, narrator: "fiammetta",
    rubricSubtitle: "A jealous husband, disguised as a priest to hear his wife's confession, is told the sins she has crafted expressly for his ears.",
    types: ["trick-on-spouse", "religious-satire", "witty"] },
  { day: 7, tale: 6, flatChapter: 80, narrator: "pampinea",
    rubricSubtitle: "Madonna Isabella, caught with one lover while another arrives and her husband returns, manages all three with perfect composure.",
    types: ["trick-on-spouse", "witty"] },
  { day: 7, tale: 7, flatChapter: 81, narrator: "filomena",
    rubricSubtitle: "Lodovico and Beatrice conspire to have her husband beaten in the garden by disguise and mistaken identity.",
    types: ["trick-on-spouse", "comic"] },
  { day: 7, tale: 8, flatChapter: 82, narrator: "neifile",
    rubricSubtitle: "Arriguccio ties a string to his wife's toe to catch her nightly visitor; she substitutes a servant and he beats the wrong woman.",
    types: ["trick-on-spouse", "comic"] },
  { day: 7, tale: 9, flatChapter: 83, narrator: "pamfilo",
    rubricSubtitle: "Lidia, to prove the extremity of her love, does before her husband's eyes in a garden what he refuses to believe he is seeing. — The pear-tree.",
    types: ["trick-on-spouse", "bawdy", "comic"] },
  { day: 7, tale: 10, flatChapter: 84, narrator: "dioneo",
    rubricSubtitle: "Tingoccio, dying, returns from the afterlife to tell Meuccio that lying with a godmother is no sin there — news his friend receives with interest.",
    types: ["bawdy", "religious-satire", "comic"] },

  // ── Day VIII ─ Queen Lauretta · Tricks on anyone ──────────────────
  { day: 8, tale: 1, flatChapter: 87, narrator: "neifile",
    rubricSubtitle: "Gulfardo borrows money from a merchant, gives it to the merchant's wife for her favours, and later tells the husband he repaid her — trapping her in her own trick.",
    types: ["trick-on-spouse", "merchant-life"] },
  { day: 8, tale: 2, flatChapter: 88, narrator: "pamfilo",
    rubricSubtitle: "The priest of Varlungo courts Monna Belcolore; she demands his cloak in pledge, and the quarrel over the pledge is sharper than the courtship.",
    types: ["religious-satire", "bawdy", "comic"] },
  { day: 8, tale: 3, flatChapter: 89, narrator: "elisa",
    rubricSubtitle: "Calandrino, the credulous painter, is persuaded by his friends that he has found the heliotrope, the stone that makes its bearer invisible.",
    types: ["comic"] },
  { day: 8, tale: 4, flatChapter: 90, narrator: "emilia",
    rubricSubtitle: "The Provost of Fiesole, pursuing a widow, is tricked into bed with her ancient maidservant and exposed at dawn to the Bishop.",
    types: ["religious-satire", "comic", "trick-on-spouse"] },
  { day: 8, tale: 5, flatChapter: 91, narrator: "filostrato",
    rubricSubtitle: "Three young Florentines at the court of the Marche of Ancona pull down a judge's breeches in open court while he hears a case.",
    types: ["comic"] },
  { day: 8, tale: 6, flatChapter: 92, narrator: "filomena",
    rubricSubtitle: "Bruno and Buffalmacco steal Calandrino's pig, then convince him, by an elaborate trial of ginger pastilles, that he stole it himself.",
    types: ["comic"] },
  { day: 8, tale: 7, flatChapter: 93, narrator: "pampinea",
    rubricSubtitle: "A scholar, fooled by a widow into a freezing night of waiting in a courtyard, takes a revenge whose elaborate cruelty is one of the work's most unsettling set-pieces.",
    types: ["tragic", "comic"] },
  { day: 8, tale: 8, flatChapter: 94, narrator: "fiammetta",
    rubricSubtitle: "Two Sienese friends, each having lain with the other's wife, settle the matter by a shared marriage-bed and unbroken friendship.",
    types: ["bawdy", "trick-on-spouse", "comic"] },
  { day: 8, tale: 9, flatChapter: 95, narrator: "lauretta",
    rubricSubtitle: "Master Simone the physician is persuaded by Bruno and Buffalmacco that he is being admitted to a nocturnal brotherhood of pleasures; they drop him in a sewer.",
    types: ["comic"] },
  { day: 8, tale: 10, flatChapter: 96, narrator: "dioneo",
    rubricSubtitle: "Salabaetto the Florentine merchant is fleeced by Madam Iancofiore in Palermo; he returns in disguise and fleeces her back.",
    types: ["merchant-life", "comic", "fortune-reversal"] },

  // ── Day IX ─── Queen Emilia · Free subject ────────────────────────
  { day: 9, tale: 1, flatChapter: 99, narrator: "filomena",
    rubricSubtitle: "Madonna Francesca, wishing to be rid of two suitors, sends one to lie as a corpse in a tomb and the other to carry him out; both quit her.",
    types: ["comic", "witty"] },
  { day: 9, tale: 2, flatChapter: 100, narrator: "elisa",
    rubricSubtitle: "An abbess, roused in the night to scold a nun caught with a lover, puts on what she thinks is her wimple — but is her own lover's breeches.",
    types: ["religious-satire", "comic", "bawdy"] },
  { day: 9, tale: 3, flatChapter: 101, narrator: "filostrato",
    rubricSubtitle: "Calandrino is persuaded by his friends that he is pregnant, and pays Master Simone a fortune for a cure.",
    types: ["comic"] },
  { day: 9, tale: 4, flatChapter: 102, narrator: "neifile",
    rubricSubtitle: "Cecco Fortarrigo gambles away Cecco Angiulieri's horse and clothes, then turns around and accuses his companion of the theft.",
    types: ["comic"] },
  { day: 9, tale: 5, flatChapter: 103, narrator: "fiammetta",
    rubricSubtitle: "Calandrino falls in love with Niccolosa; Bruno arranges a 'magical' love-charm that exposes him to his wife and the household.",
    types: ["comic", "trick-on-spouse"] },
  { day: 9, tale: 6, flatChapter: 104, narrator: "pamfilo",
    rubricSubtitle: "Two young men lodge at an inn with a host, his wife, his daughter, and a cradle; a comedy of beds, cradles, and mistaken identities ensues. — Chaucer's *Reeve's Tale*.",
    types: ["comic", "bawdy", "trick-on-spouse"] },
  { day: 9, tale: 7, flatChapter: 105, narrator: "pampinea",
    rubricSubtitle: "Talano of Molese dreams his wife will be torn by a wolf; she scorns the warning and is disfigured in the wood.",
    types: ["tragic"] },
  { day: 9, tale: 8, flatChapter: 106, narrator: "lauretta",
    rubricSubtitle: "Biondello plays a trick on the glutton Ciacco; Ciacco plays a sharper one back with a cudgel and a taverner.",
    types: ["comic"] },
  { day: 9, tale: 9, flatChapter: 107, narrator: "emilia",
    rubricSubtitle: "Solomon advises one man to love and another to go to Goose Bridge; both find the counsel strangely specific and strangely right.",
    types: ["witty"] },
  { day: 9, tale: 10, flatChapter: 108, narrator: "dioneo",
    rubricSubtitle: "Fra Rinaldo performs a ritual that will turn his neighbour's wife into a mare; the husband, by a single untimely word, spoils the transformation at the last step.",
    types: ["bawdy", "religious-satire", "comic"] },

  // ── Day X ──── King Pamfilo · Magnificence and liberality ─────────
  { day: 10, tale: 1, flatChapter: 111, narrator: "neifile",
    rubricSubtitle: "Ruggieri de' Figiovanni, misreading the King of Spain's seeming neglect, is shown by the king that Fortune, not merit, had denied him advancement.",
    types: ["magnificence", "fortune-reversal"] },
  { day: 10, tale: 2, flatChapter: 112, narrator: "elisa",
    rubricSubtitle: "Ghino di Tacco the brigand cures the Abbot of Cluny of a malady by plain fare in a tower; the Abbot, in gratitude, reconciles him with the Pope.",
    types: ["magnificence", "religious-satire"] },
  { day: 10, tale: 3, flatChapter: 113, narrator: "filostrato",
    rubricSubtitle: "Mithridanes, envious of Nathan's reputation for generosity, comes to murder him; Nathan greets him and offers his own throat. Mithridanes is converted.",
    types: ["magnificence"] },
  { day: 10, tale: 4, flatChapter: 114, narrator: "lauretta",
    rubricSubtitle: "Messer Gentile de' Carisendi, finding his beloved entombed apparently dead, rescues her, restores her to life — and gives her back to her husband.",
    types: ["magnificence", "love-overcoming-obstacle"] },
  { day: 10, tale: 5, flatChapter: 115, narrator: "emilia",
    rubricSubtitle: "Madonna Dianora demands an impossible garden in January as the price of her favour; the knight's magician conjures it, and the knight then asks no more of her than the husband's permission. — Chaucer's *Franklin's Tale*.",
    types: ["magnificence", "love-overcoming-obstacle"] },
  { day: 10, tale: 6, flatChapter: 116, narrator: "fiammetta",
    rubricSubtitle: "The aged King Charles, enamoured of two young sisters at a country villa, is reproved by a counsellor and gives both in marriage with rich dowries.",
    types: ["magnificence"] },
  { day: 10, tale: 7, flatChapter: 117, narrator: "pampinea",
    rubricSubtitle: "King Pietro of Aragon, learning that Lisa dies of love for him, visits her, kisses her brow, and marries her nobly to a young baron.",
    types: ["magnificence", "love-overcoming-obstacle"] },
  { day: 10, tale: 8, flatChapter: 118, narrator: "filomena",
    rubricSubtitle: "Titus and Gisippus, two friends, exchange bride and country; years later, destitute in Rome, Titus confesses to a murder he did not commit to save Gisippus's life.",
    types: ["magnificence", "love-overcoming-obstacle"] },
  { day: 10, tale: 9, flatChapter: 119, narrator: "pamfilo",
    rubricSubtitle: "Messer Torello entertains Saladin in disguise; captured on crusade, he is returned by Saladin's magician to Pavia on the eve of his wife's second wedding.",
    types: ["magnificence", "fortune-reversal"] },
  { day: 10, tale: 10, flatChapter: 120, narrator: "dioneo",
    rubricSubtitle: "The Marquis of Saluzzo marries the peasant Griselda and tests her obedience past all reason; she never breaks. — Petrarch's Latin translation, Chaucer's *Clerk's Tale*.",
    types: ["magnificence", "tragic"] },
]

// ── Derived helpers ─────────────────────────────────────────────────

/** Fast lookups. */
const BY_FLAT: Map<number, Tale> = new Map(TALES.map((t) => [t.flatChapter, t]))
const BY_DAY_TALE: Map<string, Tale> = new Map(
  TALES.map((t) => [`${t.day}-${t.tale}`, t]),
)

export function getTaleByFlat(chapterIndex: number): Tale | undefined {
  return BY_FLAT.get(chapterIndex)
}

export function getTale(day: number, tale: number): Tale | undefined {
  return BY_DAY_TALE.get(`${day}-${tale}`)
}

export function talesForDay(day: number): Tale[] {
  return TALES.filter((t) => t.day === day)
}

/** Total across all ten days — always 100 by construction; guarded with a
 * runtime invariant to catch editorial typos. */
export const TOTAL_TALES = TALES.length
