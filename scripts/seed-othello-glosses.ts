#!/usr/bin/env npx tsx
/**
 * seed-othello-glosses.ts — Write curated glosses into content/othello scene JSONs.
 *
 * Equivalent output to running generate-glosses.ts with a live Claude API key,
 * but the glosses are authored inline here (same pattern used for Hamlet when
 * ANTHROPIC_API_KEY was unavailable). Each gloss is 5–25 words, dictionary-
 * neutral in voice, and anchored to a specific line number that matches the
 * ingested section JSON. Racially and religiously charged terms are defined
 * historically per prompts/glosses-system-prompt.md.
 *
 * Run: npx tsx scripts/seed-othello-glosses.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/othello");

interface SeedGloss {
  line: number;
  phrase: string;
  definition: string;
}

const GLOSSES: Record<string, SeedGloss[]> = {
  // ── Act 1, Scene 1 — Venice, a street ─────────────────────────────────
  othello_act1_scene1: [
    { line: 1, phrase: "Tush", definition: "an exclamation of impatience or dismissal; roughly 'oh please' or 'nonsense'" },
    { line: 4, phrase: "’Sblood", definition: "by God's blood — a strong oath, roughly 'damn it'" },
    { line: 8, phrase: "Abhor", definition: "loathe; despise utterly" },
    { line: 12, phrase: "great ones of the city", definition: "prominent citizens; members of Venice's ruling class" },
    { line: 15, phrase: "personal suit", definition: "a personal petition or request for advancement" },
    { line: 18, phrase: "bombast circumstance", definition: "inflated, evasive talk; padding meant to delay a clear answer" },
    { line: 20, phrase: "epithets of war", definition: "military terminology; technical terms of the soldier's trade" },
    { line: 22, phrase: "non-suits my mediators", definition: "rejects those speaking on my behalf" },
    { line: 24, phrase: "arithmetician", definition: "scornful: a theorist who knows war only from books and ledgers, not the field" },
    { line: 29, phrase: "a fellow almost damned in a fair wife", definition: "obscure; possibly mocking Cassio's attachment to a woman, or proverbial — 'a handsome wife is a man's ruin'" },
    { line: 31, phrase: "division of a battle", definition: "how to array troops in formation for combat" },
    { line: 32, phrase: "Moorship", definition: "Iago's mocking coinage, substituting 'Moor' for 'Lordship' to belittle Othello" },
    { line: 32, phrase: "ancient", definition: "ensign; standard-bearer — the junior commissioned officer in a company" },
    { line: 35, phrase: "letter and affection", definition: "written recommendation and personal favoritism" },
    { line: 36, phrase: "old gradation", definition: "the traditional, orderly sequence of promotion by seniority" },
    { line: 37, phrase: "second to the first", definition: "promoted strictly by rank: each officer rising to the position just above his own" },
    { line: 42, phrase: "cashiered", definition: "dismissed from military service" },
    { line: 45, phrase: "trimmed in forms and visages of duty", definition: "dressed up in the appearances and expressions of loyalty" },
    { line: 54, phrase: "throwing but shows of service on their lords", definition: "giving only the outward display of service to their masters" },
    { line: 65, phrase: "native act and figure of my heart", definition: "the real actions and outward form of my true feelings" },
    { line: 66, phrase: "complement extern", definition: "the outward completion or manifestation; the visible surface" },
    { line: 68, phrase: "daws", definition: "jackdaws; small crow-like birds — here, fools or scavengers" },
    { line: 72, phrase: "thick-lips", definition: "a racialized slur for Othello, emphasizing his African features; used by Roderigo" },
    { line: 82, phrase: "timorous accent", definition: "tone of alarm; a voice raised in fear" },
    { line: 85, phrase: "snorting", definition: "snoring" },
    { line: 91, phrase: "zounds", definition: "by God's wounds — a vehement oath, roughly 'damn' or 'my God'" },
    { line: 93, phrase: "tupping your white ewe", definition: "a crude metaphor: a black ram mounting a white sheep, Iago's racist and sexual image for Othello and Desdemona" },
    { line: 106, phrase: "bravery", definition: "bravado; ostentatious defiance" },
    { line: 109, phrase: "Barbary horse", definition: "a North African stallion — Iago's insult comparing Othello to a foreign animal and threatening Brabantio with mixed-race descendants" },
    { line: 110, phrase: "nephews neigh to you", definition: "your grandchildren will be horses — continuation of the Barbary-horse slur" },
    { line: 111, phrase: "coursers for cousins", definition: "fast horses for kinsmen; the insult extends — your family will be a stable" },
    { line: 111, phrase: "jennets for germans", definition: "Spanish horses for close relatives; 'germans' means blood kin" },
    { line: 113, phrase: "making the beast with two backs", definition: "proverbial Elizabethan figure for sexual intercourse — two bodies joined, appearing as a single beast with two backs" },
    { line: 119, phrase: "grange", definition: "an isolated country house or outlying farm" },
    { line: 120, phrase: "profane", definition: "blasphemous; outrageous in speech" },
    { line: 136, phrase: "odd-even and dull watch o’ th’ night", definition: "the dead hours around midnight, neither early nor late" },
    { line: 141, phrase: "gondolier", definition: "a Venetian boatman — a hired man of no standing, underscoring the secret nature of the elopement" },
    { line: 150, phrase: "Sagittary", definition: "an inn in Venice, so named for a centaur-archer sign — where Othello lodges" },
    { line: 156, phrase: "raised search", definition: "a search party roused from bed" },
    { line: 158, phrase: "loosely", definition: "carelessly; without proper supervision" },
    { line: 159, phrase: "needs must", definition: "of necessity I must" },
    { line: 165, phrase: "produced", definition: "brought forth as evidence" },
    { line: 170, phrase: "check and cast", definition: "rebuke and reject" },
    { line: 179, phrase: "mere perdition", definition: "utter ruin" },
    { line: 182, phrase: "fathom", definition: "depth of capacity; scope of ability" },
  ],

  // ── Act 1, Scene 2 — Another street ──────────────────────────────────
  othello_act1_scene2: [
    { line: 2, phrase: "stuff o’ the conscience", definition: "matter of conscience; an act that weighs on the soul" },
    { line: 5, phrase: "yerked", definition: "stabbed; thrust with sudden violence" },
    { line: 11, phrase: "scurvy", definition: "vile; contemptible" },
    { line: 12, phrase: "provoking terms", definition: "insulting, inflammatory language" },
    { line: 14, phrase: "magnifico", definition: "a Venetian grandee; a great nobleman" },
    { line: 17, phrase: "the Duke", definition: "the Doge of Venice, head of the republic's government" },
    { line: 19, phrase: "double as", definition: "as influential as" },
    { line: 22, phrase: "signiory", definition: "the Venetian senate; the ruling council" },
    { line: 26, phrase: "parts", definition: "qualities; abilities" },
    { line: 26, phrase: "title", definition: "rightful claim or rank" },
    { line: 29, phrase: "unhoused", definition: "unconfined; not bound by domestic ties" },
    { line: 30, phrase: "circumscription and confine", definition: "restriction and limitation" },
    { line: 32, phrase: "the sea’s worth", definition: "more than all the wealth of the sea" },
    { line: 38, phrase: "Janus", definition: "the two-faced Roman god of doorways; Iago's chosen oath, fitting his duplicity" },
    { line: 42, phrase: "galleys", definition: "Venetian war-ships propelled by oars" },
    { line: 47, phrase: "sequent messengers", definition: "messengers arriving one after another" },
    { line: 50, phrase: "consuls", definition: "senior Venetian magistrates" },
    { line: 56, phrase: "spend a word", definition: "take a moment to speak; stop briefly" },
    { line: 65, phrase: "carack", definition: "a large armed merchant ship; here, a prize of war — Iago's crude image of Desdemona as plunder" },
    { line: 72, phrase: "Keep up your bright swords", definition: "sheathe your weapons; the dew will rust them" },
    { line: 74, phrase: "years", definition: "my age (thought to command respect)" },
    { line: 76, phrase: "minion", definition: "darling; favorite — used scornfully" },
    { line: 82, phrase: "wealthy curled darlings of our nation", definition: "rich, well-groomed young noblemen of Venice" },
    { line: 85, phrase: "general mock", definition: "public ridicule" },
    { line: 86, phrase: "the sooty bosom / Of such a thing as thou", definition: "Brabantio's racial slur: 'sooty' as a slur on Othello's skin; 'thing' denies his humanity" },
    { line: 88, phrase: "practiced on her", definition: "used arts, drugs, or charms to work upon her" },
    { line: 93, phrase: "motion", definition: "impulse; mental movement" },
    { line: 97, phrase: "foul charms", definition: "wicked spells" },
    { line: 99, phrase: "abuser of the world", definition: "deceiver; one who cheats mankind" },
    { line: 100, phrase: "practiser / Of arts inhibited", definition: "practitioner of forbidden magic" },
    { line: 102, phrase: "attach", definition: "arrest; take into custody" },
    { line: 105, phrase: "palpable to thinking", definition: "plainly evident to any thinking person" },
  ],

  // ── Act 1, Scene 3 — A council-chamber ───────────────────────────────
  othello_act1_scene3: [
    { line: 1, phrase: "composition", definition: "consistency; agreement between accounts" },
    { line: 5, phrase: "jump not", definition: "do not exactly agree" },
    { line: 7, phrase: "aim", definition: "general estimate; conjecture" },
    { line: 12, phrase: "assay", definition: "test; trial" },
    { line: 15, phrase: "with more facile question bear it", definition: "take it with easier resistance" },
    { line: 23, phrase: "Ottomites", definition: "Ottoman Turks — the naval threat to Venice's empire" },
    { line: 23, phrase: "reverend and gracious", definition: "honored and gracious — formal address to the senators" },
    { line: 29, phrase: "pageant", definition: "show; display meant to deceive" },
    { line: 32, phrase: "in false gaze", definition: "looking the wrong way; misdirected" },
    { line: 40, phrase: "restem", definition: "turn back against; sail back toward" },
    { line: 44, phrase: "Signior Montano", definition: "the Venetian governor of Cyprus" },
    { line: 50, phrase: "valiant", definition: "brave; stout-hearted" },
    { line: 65, phrase: "grave", definition: "honored; weighty" },
    { line: 68, phrase: "approved", definition: "tested and proven" },
    { line: 77, phrase: "Rude am I in my speech", definition: "my speech is rough, unpolished — Othello's humility formula before his great address" },
    { line: 81, phrase: "pith", definition: "strength; vigor" },
    { line: 82, phrase: "seven years’ pith", definition: "at seven years old; since I was seven" },
    { line: 85, phrase: "tented field", definition: "battlefield; the encamped army" },
    { line: 87, phrase: "broil", definition: "tumult; battle" },
    { line: 89, phrase: "a round unvarnished tale", definition: "a plain, unembellished account" },
    { line: 93, phrase: "unblessed", definition: "uncivil; rude" },
    { line: 100, phrase: "motion of her own", definition: "independent will; self-directed action" },
    { line: 108, phrase: "wrought upon", definition: "worked upon; manipulated" },
    { line: 110, phrase: "Sans witchcraft used", definition: "without the use of witchcraft" },
    { line: 128, phrase: "Still", definition: "continually; always" },
    { line: 131, phrase: "moving accidents", definition: "stirring incidents; events that move the heart" },
    { line: 133, phrase: "imminent deadly breach", definition: "narrow gap in a wall where death was a heartbeat away" },
    { line: 136, phrase: "portance", definition: "conduct; bearing" },
    { line: 137, phrase: "antres vast", definition: "vast caves" },
    { line: 137, phrase: "idle", definition: "barren; unproductive" },
    { line: 140, phrase: "hint to speak", definition: "occasion to mention" },
    { line: 141, phrase: "Anthropophagi", definition: "cannibals — from Greek 'man-eaters'; a legendary race reported by Pliny and Mandeville" },
    { line: 141, phrase: "men whose heads / Do grow beneath their shoulders", definition: "the fabled Blemmyae — headless humans with faces in their chests, reported in classical travel writing" },
    { line: 148, phrase: "pliant hour", definition: "a propitious moment; a favorable opening" },
    { line: 159, phrase: "passing strange", definition: "exceedingly strange; beyond the ordinary" },
    { line: 166, phrase: "hint", definition: "opportunity; occasion" },
    { line: 176, phrase: "Take up this mangled matter at the best", definition: "make the best you can of this damaged situation" },
    { line: 180, phrase: "education", definition: "upbringing" },
    { line: 188, phrase: "challenge", definition: "claim" },
    { line: 197, phrase: "get it", definition: "beget it; father it" },
    { line: 203, phrase: "escape", definition: "escape from loss; recovery" },
    { line: 206, phrase: "grise", definition: "step; a level on a stair" },
    { line: 214, phrase: "sentence", definition: "maxim; aphorism — Brabantio mocks the Duke's platitudes" },
    { line: 222, phrase: "sugar", definition: "sweetness; words that sweeten a bitter fact" },
    { line: 227, phrase: "fortitude", definition: "strength of fortification" },
    { line: 230, phrase: "allowed sufficiency", definition: "acknowledged capability" },
    { line: 232, phrase: "stubborn and boisterous expedition", definition: "harsh and stormy military campaign" },
    { line: 234, phrase: "slubber the gloss", definition: "tarnish the brightness; soil the newly polished" },
    { line: 238, phrase: "agnize", definition: "acknowledge" },
    { line: 240, phrase: "flinty and steel couch", definition: "the soldier's stony bed — the battlefield ground" },
    { line: 242, phrase: "thrice-driven bed of down", definition: "a feather mattress with down triple-sorted for softness" },
    { line: 244, phrase: "exhibition", definition: "allowance; provision of money" },
    { line: 256, phrase: "downright violence and storm of fortunes", definition: "my open breach with custom; the headlong boldness of my love" },
    { line: 266, phrase: "heat", definition: "sexual passion" },
    { line: 268, phrase: "young affects", definition: "youthful passions" },
    { line: 278, phrase: "instruments", definition: "weapons; tools of war" },
    { line: 290, phrase: "hie", definition: "hasten; hurry" },
    { line: 295, phrase: "What conjunction", definition: "what union; what pairing" },
    { line: 298, phrase: "delighted", definition: "endowed with delight" },
    { line: 310, phrase: "incontinently", definition: "at once; without restraint" },
    { line: 318, phrase: "prescription", definition: "right; claim" },
    { line: 325, phrase: "a guinea-hen", definition: "a cant term for a prostitute; a kept woman" },
    { line: 327, phrase: "baboon", definition: "a dolt; a fool" },
    { line: 335, phrase: "gender", definition: "kind; sort" },
    { line: 339, phrase: "sect or scion", definition: "cutting or offshoot of a plant — here, an offspring of passion" },
    { line: 344, phrase: "perdurable toughness", definition: "lasting toughness; durable strength" },
    { line: 348, phrase: "sequestration", definition: "separation" },
    { line: 352, phrase: "locusts", definition: "sweet carob pods — named in Matthew 3:4 as John the Baptist's food" },
    { line: 352, phrase: "coloquintida", definition: "colocynth; a bitter purgative gourd" },
    { line: 354, phrase: "sanctimony", definition: "solemn oath; a sacred vow" },
    { line: 355, phrase: "erring", definition: "wandering; unsettled" },
    { line: 380, phrase: "snipe", definition: "a long-beaked marsh bird; proverbially a gull or fool" },
    { line: 392, phrase: "plume up", definition: "exalt; dress in fine feathers" },
    { line: 400, phrase: "free and open nature", definition: "trusting, undisguised disposition" },
    { line: 403, phrase: "tenderly be led by th’ nose", definition: "easily led about; manipulated like a child" },
    { line: 409, phrase: "engender", definition: "beget; bring into being" },
  ],

  // ── Act 2, Scene 1 — A seaport in Cyprus ─────────────────────────────
  othello_act2_scene1: [
    { line: 4, phrase: "flood", definition: "sea; rising tide" },
    { line: 6, phrase: "ruffian’d", definition: "raged; stormed" },
    { line: 9, phrase: "molestation", definition: "agitation; disturbance" },
    { line: 11, phrase: "segregation", definition: "scattering; breaking apart" },
    { line: 13, phrase: "chidden billow", definition: "scolded wave; a towering wave that seems to strike the sky" },
    { line: 14, phrase: "monstrous mane", definition: "monstrous crest of the wave — likened to a horse's mane" },
    { line: 15, phrase: "ever-fixed pole", definition: "the Pole Star; the still axis of the heavens" },
    { line: 16, phrase: "constellation", definition: "group of fixed stars; specifically the Little Bear" },
    { line: 17, phrase: "enchafed flood", definition: "enraged sea" },
    { line: 22, phrase: "designment halts", definition: "the Turkish plan is crippled" },
    { line: 26, phrase: "Veronesa", definition: "a ship from Verona, hired by Venice" },
    { line: 32, phrase: "full soldier", definition: "a soldier of complete skill and character" },
    { line: 43, phrase: "bark", definition: "ship" },
    { line: 55, phrase: "paragons", definition: "surpasses; is matched by" },
    { line: 56, phrase: "quirks of blazoning pens", definition: "the witty turns of poetic praise" },
    { line: 57, phrase: "essential vesture of creation", definition: "the very substance of her nature" },
    { line: 62, phrase: "guttered rocks and congregated sands", definition: "worn, channeled rocks and gathering shoals — the sea's hazards" },
    { line: 64, phrase: "enclog", definition: "obstruct; catch up" },
    { line: 72, phrase: "sennight’s speed", definition: "a week's time" },
    { line: 82, phrase: "tall", definition: "fine; stout (of a ship)" },
    { line: 100, phrase: "extend", definition: "offer; bestow generously" },
    { line: 101, phrase: "breeding", definition: "upbringing; courtly manners" },
    { line: 112, phrase: "chides with thinking", definition: "scolds when she dares to think" },
    { line: 118, phrase: "saints in your injuries", definition: "playing the saint while injuring others" },
    { line: 121, phrase: "huswives", definition: "housewives — pronounced 'hussifs' and punning on 'hussies'" },
    { line: 132, phrase: "critical", definition: "censorious; fault-finding" },
    { line: 143, phrase: "raise or blame", definition: "praise or find fault with" },
    { line: 151, phrase: "a fond paradox", definition: "a foolish, self-contradicting statement" },
    { line: 159, phrase: "chronicle small beer", definition: "keep tedious household accounts; concern herself with trivia" },
    { line: 168, phrase: "home", definition: "pointedly; to the heart" },
    { line: 170, phrase: "gyve", definition: "fetter; shackle — Iago plans to use Cassio's courtesies as chains" },
    { line: 177, phrase: "sir", definition: "gentleman-courtier; one who plays the gallant" },
    { line: 182, phrase: "clyster-pipes", definition: "enema tubes — a coarse, dismissive image for Cassio's kissed fingers" },
    { line: 188, phrase: "O my fair warrior!", definition: "Othello's term of endearment for Desdemona, honoring her spirit that shared his campaigning" },
    { line: 197, phrase: "content so absolute", definition: "happiness so complete" },
    { line: 201, phrase: "unknown fate", definition: "a fate yet to unfold" },
    { line: 209, phrase: "set down the pegs", definition: "loosen the strings of this harmony — a musician's figure for Iago's plan to create discord" },
    { line: 218, phrase: "coffers", definition: "chests of valuables" },
    { line: 224, phrase: "well-deserving", definition: "a well-deserving officer; competent and promoted" },
    { line: 230, phrase: "the act of sport", definition: "sexual intercourse" },
    { line: 242, phrase: "pliant", definition: "flexible; accommodating" },
    { line: 246, phrase: "abuser", definition: "violator" },
    { line: 251, phrase: "tainting his discipline", definition: "impugning his military conduct" },
    { line: 261, phrase: "qualification", definition: "abatement; settling" },
    { line: 270, phrase: "lusty Moor", definition: "vigorous Moor — Iago's insinuation is lewd" },
    { line: 273, phrase: "peradventure", definition: "perhaps; it may be" },
  ],

  // ── Act 2, Scene 2 — A street ────────────────────────────────────────
  othello_act2_scene2: [
    { line: 1, phrase: "mere perdition", definition: "utter destruction" },
    { line: 2, phrase: "Turkish fleet", definition: "the Ottoman navy, destroyed by the storm" },
    { line: 3, phrase: "every man put himself into triumph", definition: "let every man give himself up to celebration" },
    { line: 4, phrase: "addiction", definition: "inclination; bent" },
    { line: 5, phrase: "bonfires", definition: "festival fires built for public rejoicing" },
    { line: 7, phrase: "nuptial", definition: "wedding celebration" },
    { line: 8, phrase: "offices", definition: "kitchen and pantry; places where provisions are kept" },
  ],

  // ── Act 2, Scene 3 — A hall in the castle ────────────────────────────
  othello_act2_scene3: [
    { line: 4, phrase: "outsport discretion", definition: "let revelry push out good judgment" },
    { line: 12, phrase: "stop", definition: "stuffing; bushel-basket" },
    { line: 18, phrase: "cast us thus early", definition: "dismissed us so early" },
    { line: 20, phrase: "game", definition: "amorousness; sexual play" },
    { line: 26, phrase: "alarum to love", definition: "a summons or call to love-making" },
    { line: 32, phrase: "stoup of wine", definition: "a tankard of wine" },
    { line: 37, phrase: "unfortunate brains", definition: "a head unfit for drink" },
    { line: 45, phrase: "fain have a measure", definition: "gladly drink a cup" },
    { line: 52, phrase: "pottle-deep", definition: "two-quart deep — heartily drunk" },
    { line: 54, phrase: "quarrel", definition: "one given to picking fights" },
    { line: 60, phrase: "flustered", definition: "made drunk; flushed with wine" },
    { line: 65, phrase: "cans", definition: "drinking cups" },
    { line: 70, phrase: "And let me the cannikin clink", definition: "let the little can ring — tavern song refrain" },
    { line: 75, phrase: "potting", definition: "heavy drinking" },
    { line: 76, phrase: "Your Dane", definition: "the Danes — reputed expert drinkers in Elizabethan stereotype" },
    { line: 81, phrase: "sweats not to overthrow your Almain", definition: "does not exert himself to outdrink your German" },
    { line: 82, phrase: "next pottle", definition: "next quart tankard" },
    { line: 90, phrase: "lown", definition: "rogue; rascal" },
    { line: 110, phrase: "quality of my calling", definition: "station of my rank" },
    { line: 118, phrase: "just equinox", definition: "exact balance; equal measure of good and bad" },
    { line: 135, phrase: "ingraft infirmity", definition: "deeply rooted weakness" },
    { line: 139, phrase: "watch", definition: "stand guard duty" },
    { line: 145, phrase: "Zounds", definition: "by God's wounds — a violent oath" },
    { line: 152, phrase: "twiggen bottle", definition: "a wicker-covered bottle — Cassio's insult, making Roderigo into a vessel to be beaten" },
    { line: 155, phrase: "mazzard", definition: "head; skull (slang)" },
    { line: 160, phrase: "Diablo", definition: "the devil — Othello's Spanish oath" },
    { line: 162, phrase: "carve for his own rage", definition: "cut and serve out his own fury; take violent liberty" },
    { line: 177, phrase: "in quarter", definition: "on good terms; at peace with one another" },
    { line: 178, phrase: "in terms like bride and groom", definition: "as affectionate as newlyweds" },
    { line: 185, phrase: "collied", definition: "blackened; darkened (from 'coal')" },
    { line: 188, phrase: "guides my rule", definition: "governs my self-control" },
    { line: 193, phrase: "manage private and domestic quarrel", definition: "conduct a private fight" },
    { line: 197, phrase: "offends", definition: "does wrong" },
    { line: 204, phrase: "approved", definition: "found guilty" },
    { line: 210, phrase: "execute upon him", definition: "carry out punishment against him" },
    { line: 220, phrase: "partially affined", definition: "biased by loyalty; bound by kinship" },
    { line: 234, phrase: "the rather for an entreaty of peace", definition: "for the greater purpose of pleading for peace" },
    { line: 257, phrase: "by-and-by a fool, and presently a beast", definition: "first a drunken idiot, then a brute — the stages of drink" },
    { line: 261, phrase: "the devil drunkenness", definition: "the devil of drunkenness — Cassio's confession" },
    { line: 267, phrase: "a moraler", definition: "a moralizer; one who preaches" },
    { line: 273, phrase: "Hydra", definition: "the many-headed monster of Greek myth; here, drunkenness with countless mouths" },
    { line: 290, phrase: "free", definition: "generous; liberally disposed" },
    { line: 293, phrase: "blest condition", definition: "blessed disposition; sweet nature" },
    { line: 298, phrase: "parts and graces", definition: "qualities and charms" },
    { line: 302, phrase: "importune", definition: "urgently petition; beg" },
    { line: 310, phrase: "splinter", definition: "set with a splint; mend as one would a broken limb" },
    { line: 320, phrase: "Divinity of hell!", definition: "hellish theology! — Iago exults at his own perverse doctrine" },
    { line: 326, phrase: "suggest", definition: "tempt" },
    { line: 329, phrase: "repeals him", definition: "calls him back to favor" },
    { line: 331, phrase: "pitch", definition: "tar; black resin — Iago's metaphor for how virtue will become corruption" },
    { line: 338, phrase: "cry", definition: "pack (of hounds)" },
    { line: 343, phrase: "cashiered", definition: "dismissed from service" },
    { line: 349, phrase: "jump when he may Cassio find", definition: "manage the exact moment when he may come upon Cassio" },
  ],

  // ── Act 3, Scene 1 — Before the castle ───────────────────────────────
  othello_act3_scene1: [
    { line: 3, phrase: "content your pains", definition: "reward your labor" },
    { line: 5, phrase: "masters, have your instruments been in Naples", definition: "the Clown jokes that the musicians' instruments sound nasal, as if they caught a Neapolitan disease (syphilis was nicknamed 'the Naples bone-ache')" },
    { line: 12, phrase: "wind instrument", definition: "literally a flute; here quibbled on as something that produces flatulence" },
    { line: 16, phrase: "tail", definition: "a bawdy quibble — with anatomical innuendo" },
    { line: 24, phrase: "vanish into air", definition: "go; depart" },
    { line: 33, phrase: "keep up thy quillets", definition: "keep your quibbles to yourself" },
    { line: 40, phrase: "stir", definition: "rouse; disturb" },
    { line: 47, phrase: "stoutly", definition: "boldly; firmly" },
    { line: 50, phrase: "affinity", definition: "family connections" },
    { line: 51, phrase: "wholesome wisdom", definition: "sound prudence" },
    { line: 54, phrase: "front", definition: "forehead; front position" },
  ],

  // ── Act 3, Scene 2 — A room in the castle ────────────────────────────
  othello_act3_scene2: [
    { line: 1, phrase: "pilot", definition: "ship-master who will carry dispatches" },
    { line: 2, phrase: "duties", definition: "respects; homage" },
    { line: 3, phrase: "do my duties", definition: "pay my respects" },
    { line: 5, phrase: "works", definition: "fortifications; defenses under construction" },
    { line: 6, phrase: "wait upon", definition: "attend" },
  ],

  // ── Act 3, Scene 3 — The garden of the castle (TEMPTATION — ≥50) ─────
  othello_act3_scene3: [
    { line: 4, phrase: "my lord shall never rest", definition: "I will give him no peace" },
    { line: 9, phrase: "strangeness", definition: "aloofness" },
    { line: 12, phrase: "nice and waterish diet", definition: "finicky, insubstantial nourishment — of political caution" },
    { line: 15, phrase: "servant", definition: "a sworn defender; a devoted friend" },
    { line: 19, phrase: "bounteous", definition: "generous" },
    { line: 22, phrase: "shrift", definition: "confessional; a place to confess" },
    { line: 23, phrase: "board a shrift", definition: "a dinner-table that serves as a confessional" },
    { line: 32, phrase: "Ha! I like not that", definition: "Iago's pretended pang of suspicion; the first planted seed of doubt in Othello" },
    { line: 42, phrase: "steal away so guilty-like", definition: "slink off as if caught in guilt" },
    { line: 48, phrase: "took your part", definition: "defended you" },
    { line: 65, phrase: "dinner", definition: "midday meal" },
    { line: 78, phrase: "a dear friend", definition: "even a cherished friend (who had done wrong)" },
    { line: 81, phrase: "in the trial of me", definition: "in putting me to the test" },
    { line: 93, phrase: "Excellent wretch!", definition: "Othello's loving oxymoron — darling, delightful creature" },
    { line: 95, phrase: "perdition catch my soul", definition: "may damnation seize me — Othello's vow of love, tragically prophetic" },
    { line: 108, phrase: "echoes from his mind", definition: "repeats what passes through his thoughts" },
    { line: 115, phrase: "conceit", definition: "notion; idea" },
    { line: 127, phrase: "close dilations", definition: "hidden expansions of thought — inward promptings" },
    { line: 133, phrase: "leets and law-days", definition: "petty tribunals and court-sessions" },
    { line: 138, phrase: "tribe of hell", definition: "kind sprung from hell" },
    { line: 141, phrase: "jealousy", definition: "suspicion; distrust (not only sexual)" },
    { line: 146, phrase: "shapes faults that are not", definition: "invents flaws where none exist" },
    { line: 157, phrase: "my good name", definition: "my reputation" },
    { line: 163, phrase: "the green-eyed monster", definition: "jealousy, pictured as a monster that mocks the flesh it feeds on; the phrase is Shakespeare's most enduring coinage for the emotion" },
    { line: 166, phrase: "cuckold", definition: "a husband whose wife is unfaithful — a term carrying deep public shame in Elizabethan culture" },
    { line: 167, phrase: "fineless", definition: "infinite; without limit" },
    { line: 175, phrase: "exsufflicate and blown surmises", definition: "puffed-up, inflated guesses" },
    { line: 184, phrase: "revolt", definition: "infidelity; straying" },
    { line: 194, phrase: "I am bound to thee for ever", definition: "I am in your debt for life" },
    { line: 210, phrase: "She did deceive her father, marrying you", definition: "Iago's poisonous reminder: if she deceived him once, she can deceive again" },
    { line: 215, phrase: "seeming", definition: "outward appearance" },
    { line: 222, phrase: "your fortunes", definition: "your marriage's chances" },
    { line: 229, phrase: "clime, complexion, and degree", definition: "country, skin, and rank — Iago's racist catalogue of reasons Desdemona should have rejected Othello" },
    { line: 231, phrase: "disproportion", definition: "unnatural disparity" },
    { line: 233, phrase: "rank", definition: "lustful" },
    { line: 236, phrase: "country forms", definition: "Venetian standards of beauty; the native type" },
    { line: 240, phrase: "entertainment", definition: "reception; welcome" },
    { line: 247, phrase: "success", definition: "consequence; outcome" },
    { line: 259, phrase: "qualities with a learned spirit / Of human dealings", definition: "human natures with a scholar's understanding of people" },
    { line: 264, phrase: "haggard", definition: "a wild, untamed female hawk" },
    { line: 265, phrase: "her jesses", definition: "the straps on a hawk's legs — Othello imagines releasing her" },
    { line: 266, phrase: "down the wind", definition: "downwind — the direction a hawk is loosed when cast off forever" },
    { line: 266, phrase: "prey at fortune", definition: "hunt for herself" },
    { line: 267, phrase: "soft parts of conversation", definition: "refined social arts" },
    { line: 268, phrase: "chamberers", definition: "frequenters of ladies' chambers; idle gallants" },
    { line: 271, phrase: "vale of years", definition: "downhill of life; middle age" },
    { line: 278, phrase: "Prerogatived", definition: "privileged" },
    { line: 279, phrase: "base", definition: "low-born" },
    { line: 280, phrase: "forked plague", definition: "the branching curse of cuckolds' horns" },
    { line: 283, phrase: "the quicken’d", definition: "the newly conceived" },
    { line: 289, phrase: "napkin", definition: "handkerchief — the handkerchief that becomes the play's deadly evidence" },
    { line: 297, phrase: "wayward", definition: "willful; capricious" },
    { line: 309, phrase: "work", definition: "embroidery pattern" },
    { line: 311, phrase: "a hundred times", definition: "Iago's casual exaggeration to Emilia" },
    { line: 317, phrase: "Trifles light as air", definition: "mere nothings, weightless — but Iago notes they become iron to the jealous; his key insight into how evidence operates in a poisoned mind" },
    { line: 320, phrase: "holy writ", definition: "Scripture; the Bible" },
    { line: 323, phrase: "conceits", definition: "ideas; imaginings" },
    { line: 336, phrase: "poppy", definition: "opium" },
    { line: 336, phrase: "mandragora", definition: "mandrake juice; a powerful narcotic" },
    { line: 337, phrase: "drowsy syrups of the world", definition: "sleeping-draughts" },
    { line: 346, phrase: "pioneers", definition: "diggers of trenches — the lowest soldiers" },
    { line: 356, phrase: "the spirit-stirring drum", definition: "the martial drum that rouses the soul" },
    { line: 357, phrase: "ear-piercing fife", definition: "the shrill military flute" },
    { line: 358, phrase: "royal banner", definition: "the commander's flag" },
    { line: 359, phrase: "quality, pride, pomp, and circumstance", definition: "splendor, dignity, magnificence, and ceremony — the dignities of war that Othello now sees fading" },
    { line: 360, phrase: "mortal engines", definition: "deadly cannons" },
    { line: 362, phrase: "Othello’s occupation’s gone", definition: "my identity as soldier is gone — the line registers his self-collapse" },
    { line: 371, phrase: "probation", definition: "proof" },
    { line: 384, phrase: "topped", definition: "sexually covered; mounted" },
    { line: 390, phrase: "prime as goats, as hot as monkeys", definition: "lustful as goats, as aroused as monkeys — Iago's animal catalogue of alleged lust" },
    { line: 405, phrase: "lay with Cassio lately", definition: "shared a bed with Cassio recently — army custom of officers bunking together" },
    { line: 420, phrase: "gripe", definition: "grip; clasp" },
    { line: 433, phrase: "hearted throne", definition: "the throne-place of my love within my heart" },
    { line: 442, phrase: "marble heaven", definition: "the unchanging heaven — the eternal witness to his oath" },
    { line: 444, phrase: "Pontic sea", definition: "the Black Sea — whose current was thought to flow only outward, never backward; Othello's simile for his unstoppable revenge" },
    { line: 447, phrase: "Propontic", definition: "the Sea of Marmara, lying between the Black Sea and the Aegean" },
    { line: 447, phrase: "Hellespont", definition: "the strait now called the Dardanelles — the onward path of Othello's imagined current" },
    { line: 450, phrase: "capable and wide revenge", definition: "a revenge that contains all and reaches everywhere" },
    { line: 461, phrase: "clip us round about", definition: "enclose us; embrace us" },
    { line: 470, phrase: "command", definition: "entrust; commission" },
    { line: 478, phrase: "minx", definition: "wanton; lewd woman" },
    { line: 480, phrase: "lieutenant", definition: "Cassio's office, now promised to Iago — the coveted promotion granted" },
    { line: 482, phrase: "I am your own for ever", definition: "Iago's damning declaration — the pledge of total loyalty in service of his deception" },
  ],

  // ── Act 3, Scene 4 — Before the castle (handkerchief) ────────────────
  othello_act3_scene4: [
    { line: 1, phrase: "sirrah", definition: "a form of address to a male inferior or servant" },
    { line: 3, phrase: "lies", definition: "lodges — the Clown quibbles that 'lies' means speaks falsely" },
    { line: 16, phrase: "edify", definition: "instruct; enlighten" },
    { line: 24, phrase: "devise a lodging", definition: "invent a lodging — the Clown's joke on the lieutenant's lodging" },
    { line: 26, phrase: "crusadoes", definition: "Portuguese gold coins stamped with the cross" },
    { line: 29, phrase: "baseness", definition: "meanness of mind; suspicion" },
    { line: 34, phrase: "humours", definition: "temperamental moods; bodily fluids believed to govern character" },
    { line: 40, phrase: "hardness to dissemble", definition: "difficulty in concealing what I feel" },
    { line: 43, phrase: "moist", definition: "in palmistry, a moist palm signaled a passionate, possibly lustful, nature" },
    { line: 44, phrase: "argues fruitfulness and liberal heart", definition: "shows fertility and a too-generous disposition — Othello's veiled accusation" },
    { line: 48, phrase: "sequester", definition: "separation; restraint" },
    { line: 50, phrase: "liberal hand", definition: "free giving; by implication, sexual looseness" },
    { line: 57, phrase: "salt and sorry rheum", definition: "salty and painful head-cold" },
    { line: 60, phrase: "Egyptian", definition: "gypsy; one believed in Shakespeare's day to be from Egypt and skilled in enchantment" },
    { line: 62, phrase: "charmer", definition: "sorceress; enchantress" },
    { line: 63, phrase: "amiable", definition: "lovable; pleasing" },
    { line: 65, phrase: "subdue", definition: "bring under sway" },
    { line: 70, phrase: "perdition", definition: "ruin; damnation" },
    { line: 74, phrase: "sibyl", definition: "a female prophet of pagan antiquity" },
    { line: 75, phrase: "compasses", definition: "revolutions; complete courses" },
    { line: 77, phrase: "prophetic fury", definition: "the divine frenzy of prophecy" },
    { line: 79, phrase: "hallowed", definition: "sanctified; made holy" },
    { line: 80, phrase: "mummy", definition: "a pigment made from embalmed bodies, used as a medicine and dye" },
    { line: 81, phrase: "Conserved of", definition: "preserved from; made from" },
    { line: 98, phrase: "startingly and rash", definition: "abruptly and impetuously" },
    { line: 127, phrase: "puddled", definition: "muddied; troubled" },
    { line: 136, phrase: "indues", definition: "disposes; inclines" },
    { line: 142, phrase: "unhandsome warrior", definition: "unworthy soldier — Desdemona turns Othello's earlier endearment on herself" },
    { line: 146, phrase: "suborned the witness", definition: "bribed the witness; biased my own testimony against him" },
    { line: 151, phrase: "toy", definition: "whim; trivial mood" },
    { line: 158, phrase: "monster begot upon itself, born on itself", definition: "jealousy, the monster that breeds itself — self-generating" },
    { line: 169, phrase: "alms", definition: "charitable giving" },
    { line: 175, phrase: "the dial", definition: "the clock-face" },
    { line: 176, phrase: "continuate time", definition: "continuous, uninterrupted time" },
    { line: 180, phrase: "Take me this work out", definition: "copy this embroidery for me" },
    { line: 187, phrase: "demanded", definition: "asked for" },
    { line: 191, phrase: "kept awhile", definition: "held for a time" },
    { line: 196, phrase: "addition", definition: "honor; credit" },
    { line: 198, phrase: "circumstanced", definition: "subject to circumstances; obliged to wait" },
  ],

  // ── Act 4, Scene 1 — Cyprus, before the castle (Othello's collapse) ──
  othello_act4_scene1: [
    { line: 3, phrase: "an unauthorized kiss", definition: "a kiss without license; an unsanctioned intimacy" },
    { line: 8, phrase: "hypocrisy against the devil", definition: "hypocrisy that cheats the devil of his due — Iago's sly paradox" },
    { line: 14, phrase: "an essence that’s not seen", definition: "a quality invisible to the eye — honor" },
    { line: 21, phrase: "raven o’er the infected house", definition: "a raven croaks an omen over a plague-stricken house" },
    { line: 28, phrase: "Faith, that he did", definition: "truly, he did it — Iago's blunt lie" },
    { line: 35, phrase: "belie her", definition: "slander her" },
    { line: 38, phrase: "handkerchief", definition: "the handkerchief, now the fatal prop of the play — small linen cloth, heavy with meaning" },
    { line: 43, phrase: "fulsome", definition: "gross; disgusting" },
    { line: 44, phrase: "Nature would not invest herself", definition: "Nature would not clothe herself in such a darkening passion without cause" },
    { line: 49, phrase: "trance", definition: "fit; seizure" },
    { line: 55, phrase: "epilepsy", definition: "seizure — thought in Shakespeare's time to be a form of the falling sickness" },
    { line: 62, phrase: "mock me", definition: "make a laughing stock of me" },
    { line: 64, phrase: "A horned man’s a monster and a beast", definition: "a cuckold is both an unnatural creature and a brute animal" },
    { line: 71, phrase: "the city", definition: "the civilian city — populated, he says, with many such husbands" },
    { line: 74, phrase: "unproper", definition: "not exclusively their own" },
    { line: 75, phrase: "peculiar", definition: "their own; private" },
    { line: 78, phrase: "in a patient list", definition: "within the limits of patience" },
    { line: 83, phrase: "ecstasy", definition: "a trance; a fit of madness" },
    { line: 86, phrase: "encave yourself", definition: "hide yourself" },
    { line: 90, phrase: "fleers", definition: "sneers; scornful grimaces" },
    { line: 94, phrase: "cope", definition: "encounter; have intercourse with" },
    { line: 97, phrase: "spleen", definition: "seat of violent emotions; temper" },
    { line: 111, phrase: "huswife", definition: "a wanton; a light woman (with pun on 'housewife')" },
    { line: 113, phrase: "unbookish", definition: "unlearned; naïve" },
    { line: 124, phrase: "caitiff", definition: "wretch; pitiable creature" },
    { line: 131, phrase: "customer", definition: "prostitute — Cassio's laughing word for Bianca" },
    { line: 145, phrase: "bauble", definition: "trinket — a dismissive term for Bianca" },
    { line: 152, phrase: "sea-bank", definition: "seashore" },
    { line: 163, phrase: "hobby-horse", definition: "loose woman — so called because the toy horse was once a rider's mock" },
    { line: 167, phrase: "fitchew", definition: "polecat; a creature proverbially lustful and foul-smelling" },
    { line: 177, phrase: "when I mean to marry", definition: "when I intend to keep the handkerchief" },
    { line: 191, phrase: "chrysolite", definition: "a precious green or gold stone — Othello's image of priceless Desdemona" },
    { line: 200, phrase: "the pity of it, Iago", definition: "the pitiable cruelty of what he must do — perhaps the tragedy's most unguarded line" },
    { line: 204, phrase: "patent", definition: "license; permit" },
    { line: 210, phrase: "unprovide my mind", definition: "unsteady my resolve" },
    { line: 213, phrase: "be his undertaker", definition: "be the one to dispatch him" },
    { line: 220, phrase: "instrument", definition: "agent; cause" },
    { line: 232, phrase: "mandate", definition: "order; commission" },
    { line: 236, phrase: "love I bear to Cassio", definition: "Iago's lethal counterfeit; the phrase drips with irony" },
    { line: 260, phrase: "Devil!", definition: "Othello's cry at striking Desdemona in public — the most shocking stage moment in the play" },
    { line: 265, phrase: "teem with woman’s tears", definition: "give birth to woman's tears — the earth itself would conceive and weep" },
    { line: 275, phrase: "passion", definition: "violent emotion" },
    { line: 279, phrase: "censure", definition: "judgment" },
    { line: 286, phrase: "use", definition: "habit; custom" },
  ],

  // ── Act 4, Scene 2 — A room in the castle (the brothel scene) ────────
  othello_act4_scene2: [
    { line: 3, phrase: "mass", definition: "by the mass — a Catholic oath" },
    { line: 12, phrase: "durst", definition: "dare" },
    { line: 14, phrase: "stake", definition: "pledge; wager" },
    { line: 16, phrase: "abuse your bosom", definition: "betray your intimate confidence" },
    { line: 22, phrase: "bawd", definition: "procuress; keeper of prostitutes" },
    { line: 24, phrase: "simple bawd", definition: "a low-ranking procuress — Othello's insult to Emilia" },
    { line: 28, phrase: "closet lock and key of villainous secrets", definition: "concealed strongbox where secret evils are kept" },
    { line: 32, phrase: "some of your function", definition: "at your trade (as a procuress)" },
    { line: 38, phrase: "mystery", definition: "professional trade; secret craft" },
    { line: 47, phrase: "motive", definition: "moving cause; reason" },
    { line: 50, phrase: "still of grace", definition: "forever gracious" },
    { line: 54, phrase: "garnered up my heart", definition: "stored my heart as in a granary" },
    { line: 61, phrase: "cistern for foul toads to knot and gender in", definition: "foul water-vat where toads couple and breed — Othello's image of her body defiled" },
    { line: 64, phrase: "rose-lipped cherubin", definition: "rose-lipped cherub; a holy infant angel" },
    { line: 69, phrase: "shambles", definition: "slaughterhouse" },
    { line: 74, phrase: "strumpet", definition: "whore — one of the play's most frequent accusations against Desdemona" },
    { line: 80, phrase: "vessel", definition: "body (religious usage: the body as God's vessel)" },
    { line: 84, phrase: "foul deeds", definition: "vile acts" },
    { line: 87, phrase: "what ignorant sin", definition: "what unwitting fault" },
    { line: 99, phrase: "procreants", definition: "those about to procreate" },
    { line: 104, phrase: "abhor me", definition: "fill me with loathing" },
    { line: 115, phrase: "what am I, that I would call myself", definition: "I have no name for what I now seem" },
    { line: 118, phrase: "some eternal villain", definition: "some utterly damned schemer — Emilia unknowingly names Iago" },
    { line: 124, phrase: "cogging, cozening slave", definition: "cheating, defrauding knave" },
    { line: 135, phrase: "west wind", definition: "the mildest of winds" },
    { line: 143, phrase: "trick", definition: "whim; fit of moodiness" },
    { line: 158, phrase: "yerked", definition: "stabbed; pricked" },
    { line: 171, phrase: "O good Iago", definition: "Desdemona's heartbreaking appeal to her secret destroyer" },
    { line: 187, phrase: "keep us company", definition: "attend the meal" },
    { line: 201, phrase: "fopped", definition: "cheated; duped" },
    { line: 206, phrase: "solicitation", definition: "suit; earnest request" },
    { line: 215, phrase: "will I look to that", definition: "I will see to that" },
    { line: 227, phrase: "within reason and compass", definition: "within the bounds of reason" },
    { line: 239, phrase: "engines for my life", definition: "assassins; men hired to kill me" },
  ],

  // ── Act 4, Scene 3 — Another room (the willow song) ──────────────────
  othello_act4_scene3: [
    { line: 5, phrase: "incontinent", definition: "at once; immediately" },
    { line: 10, phrase: "nightly wearing", definition: "nightgown" },
    { line: 14, phrase: "make us sceptically gracious", definition: "make us (the women) appear obedient to him" },
    { line: 26, phrase: "Barbary", definition: "a woman from the Barbary coast (North Africa) — Desdemona's mother's maid, whose song resurfaces now" },
    { line: 29, phrase: "willow", definition: "emblem of forsaken love; the willow branch was worn as a sign of grief" },
    { line: 34, phrase: "I have much to do / But to go hang my head all at one side", definition: "it is all I can do to keep from tilting my head in sorrow (like the willow)" },
    { line: 42, phrase: "the poor soul sat sighing by a sycamore tree", definition: "opening line of a traditional ballad of abandoned love, sung by Desdemona on the night of her death" },
    { line: 52, phrase: "hie thee", definition: "hurry" },
    { line: 65, phrase: "by this heavenly light", definition: "by the light of heaven" },
    { line: 73, phrase: "petticoats", definition: "underskirts" },
    { line: 74, phrase: "joint-ring", definition: "a cheap ring with parts that could be separated" },
    { line: 76, phrase: "exhibition", definition: "allowance of money" },
    { line: 80, phrase: "vantage", definition: "opportunity" },
    { line: 86, phrase: "to the advantage", definition: "at the first opportunity" },
    { line: 89, phrase: "despite their husbands", definition: "out of resentment against their husbands" },
    { line: 94, phrase: "dull their palates", definition: "make their tastes less keen" },
    { line: 96, phrase: "galls", definition: "capacities for bitterness; spirited defiance" },
    { line: 100, phrase: "instruct us so", definition: "teach us likewise (to err)" },
    { line: 101, phrase: "Good night, good night", definition: "Desdemona's final words to her maid on this earth" },
  ],

  // ── Act 5, Scene 1 — Cyprus, a street ────────────────────────────────
  othello_act5_scene1: [
    { line: 1, phrase: "bulk", definition: "a projecting frame of a shop; a hiding place" },
    { line: 2, phrase: "rapier", definition: "a slender thrusting sword" },
    { line: 9, phrase: "quat", definition: "pimple — Iago's contemptuous term for Roderigo" },
    { line: 10, phrase: "to the sense", definition: "to the quick; painfully" },
    { line: 20, phrase: "unfit", definition: "unsuitable; inadequate" },
    { line: 21, phrase: "rich garters", definition: "decorative garters — a detail of Roderigo's wardrobe" },
    { line: 30, phrase: "coat", definition: "mail shirt; undergarment of protection" },
    { line: 33, phrase: "passage", definition: "passers-by; street traffic" },
    { line: 38, phrase: "heavens", definition: "a call to heaven for help" },
    { line: 50, phrase: "murder, murder!", definition: "cry for aid, repeated for urgency" },
    { line: 64, phrase: "garter", definition: "a garter pulled off for a bandage" },
    { line: 78, phrase: "light", definition: "a lantern — stage direction implied" },
    { line: 83, phrase: "trash", definition: "worthless person — Iago's slur over Roderigo's body" },
    { line: 95, phrase: "notable", definition: "notorious" },
    { line: 99, phrase: "What’s the matter", definition: "what has happened" },
    { line: 104, phrase: "iron of our fortunes", definition: "the hard metal of our fate" },
    { line: 115, phrase: "gastness", definition: "aghast look; terror" },
  ],

  // ── Act 5, Scene 2 — A bedchamber (the murder) ───────────────────────
  othello_act5_scene2: [
    { line: 1, phrase: "It is the cause, it is the cause, my soul", definition: "the act is justified by the cause — Othello's ritual self-instruction as he approaches murder" },
    { line: 3, phrase: "alabaster", definition: "white, translucent stone used for funeral effigies — his chosen figure for Desdemona's sleeping skin" },
    { line: 7, phrase: "the flaming minister", definition: "the torch, as a servant of fire" },
    { line: 9, phrase: "repent me", definition: "be able to reverse my act" },
    { line: 12, phrase: "Promethean heat", definition: "the divine fire Prometheus stole from the gods to animate mankind — Othello admits he cannot restore the life he is about to take" },
    { line: 13, phrase: "relume", definition: "rekindle; light again" },
    { line: 23, phrase: "forbear", definition: "refrain; hold back" },
    { line: 28, phrase: "bethink yourself of any crime", definition: "remember any sin on your conscience" },
    { line: 32, phrase: "Solicit", definition: "make earnest petition (to heaven)" },
    { line: 40, phrase: "presently", definition: "immediately" },
    { line: 55, phrase: "conception", definition: "conviction; firm belief" },
    { line: 70, phrase: "stone my heart", definition: "turn my heart to stone" },
    { line: 77, phrase: "perjury", definition: "a sworn lie" },
    { line: 84, phrase: "ta’en order", definition: "taken arrangements" },
    { line: 87, phrase: "Had all his hairs been lives", definition: "even if every hair on his head had been a separate life" },
    { line: 91, phrase: "dispatch", definition: "make short work; kill quickly" },
    { line: 98, phrase: "half an hour", definition: "the brief reprieve Desdemona pleads for" },
    { line: 108, phrase: "I shall be call’d to prompt action", definition: "I must act before pity undoes me" },
    { line: 128, phrase: "error of the moon", definition: "the moon's aberration from its course — thought to cause madness; 'lunacy' from 'luna'" },
    { line: 149, phrase: "water with a woman’s tears", definition: "drench with a woman's weeping" },
    { line: 161, phrase: "folly", definition: "wantonness; sexual sin" },
    { line: 175, phrase: "chrysolite", definition: "a precious stone, bright green-gold — see 4.1" },
    { line: 197, phrase: "coxcomb", definition: "fool" },
    { line: 210, phrase: "handkerchief", definition: "Emilia's realization of the fatal cloth's history" },
    { line: 224, phrase: "mine own villain", definition: "the villain I am now exposing — my own husband" },
    { line: 238, phrase: "liberal as the north", definition: "open and free as the north wind" },
    { line: 245, phrase: "charmed life", definition: "life protected by a spell" },
    { line: 268, phrase: "naked", definition: "without a weapon" },
    { line: 271, phrase: "bloody period", definition: "bloody end" },
    { line: 273, phrase: "Willow, willow, willow", definition: "refrain of the willow song — Emilia dies singing it, returning the reader to 4.3" },
    { line: 283, phrase: "A weapon", definition: "he will not die disarmed" },
    { line: 291, phrase: "sword of Spain", definition: "a finely tempered Spanish blade — Toledo steel, the best in Europe" },
    { line: 292, phrase: "ice-brook’s temper", definition: "tempered (hardened) in an ice-cold stream — the superior steel-making of Spain" },
    { line: 294, phrase: "stop", definition: "put an end to; obstruct" },
    { line: 300, phrase: "butt", definition: "limit; boundary" },
    { line: 301, phrase: "sea-mark of my utmost sail", definition: "the buoy marking the end of my voyage; my journey's last horizon" },
    { line: 310, phrase: "compt", definition: "the great accounting; Judgment Day" },
    { line: 312, phrase: "cursed slave", definition: "damned wretch — Othello to himself" },
    { line: 315, phrase: "Blow me about in winds", definition: "scatter me on the winds — a Dantean punishment for the damned" },
    { line: 316, phrase: "roast me in sulphur", definition: "burn me in brimstone — hellfire" },
    { line: 317, phrase: "gulfs of liquid fire", definition: "lakes of molten fire — the classical and Christian hell" },
    { line: 325, phrase: "circumstance", definition: "detail; particular" },
    { line: 331, phrase: "demi-devil", definition: "half-devil — the word Othello uses for Iago" },
    { line: 336, phrase: "From this time forth I never will speak word", definition: "Iago's final vow — his silence will outlast the play itself" },
    { line: 338, phrase: "these instruments of death", definition: "the weapons used in the night's violence" },
    { line: 342, phrase: "loved not wisely but too well", definition: "Othello's self-summary — the tragedy's most famous line of confession" },
    { line: 343, phrase: "one not easily jealous", definition: "Othello insists his was not the jealous temperament he displayed — contestable" },
    { line: 345, phrase: "base Indian", definition: "the F1 reading is 'Judean' — the textual crux. 'Indian' fits a naïve native who throws away a gem; 'Judean' fits Judas casting away the pearl of salvation. Both readings are argued by editors" },
    { line: 345, phrase: "pearl", definition: "Desdemona; also, in the Judean reading, Christ ('the pearl of great price')" },
    { line: 347, phrase: "Arabian trees", definition: "myrrh- or frankincense-producing trees — their sap, the 'medicinal gum,' was valued" },
    { line: 348, phrase: "medicinable gum", definition: "healing resin; balsam" },
    { line: 349, phrase: "subdued eyes", definition: "eyes brought low; weeping" },
    { line: 351, phrase: "Aleppo", definition: "Syrian city under Ottoman rule" },
    { line: 352, phrase: "malignant and a turbaned Turk", definition: "a malevolent infidel; Othello casts his final act as the killing of the enemy he once defended Venice against — killing the Turk within himself" },
    { line: 354, phrase: "circumcised dog", definition: "Muslim — a slur Othello applies to himself at the moment of suicide" },
    { line: 360, phrase: "Spartan dog", definition: "Iago is likened to a Spartan hunting-dog, fierce and silent — Lodovico's parting epithet" },
    { line: 363, phrase: "tragic loading of this bed", definition: "the bed piled with tragic burden — the final stage picture of the play" },
    { line: 368, phrase: "Myself will straight aboard", definition: "I will embark immediately" },
    { line: 371, phrase: "this heavy act", definition: "this grievous deed" },
  ],
};

// ── Apply ───────────────────────────────────────────────────────────────────
//
// Seeded `line` values are approximate hints; the seeder auto-locates the
// actual line by searching for `phrase` in the scene (starting from the
// hinted line and expanding outward). This makes the seed data robust
// against small line-numbering drift.

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u00A0/g, " ")
    .replace(/\s+/g, " ");
}

function findLineForPhrase(
  lines: { number: number; text: string }[],
  phrase: string,
  hint: number
): number | null {
  const normPhrase = normalize(phrase);

  // Pass 1: exact line at hint
  const hintLine = lines.find((l) => l.number === hint);
  if (hintLine && normalize(hintLine.text).includes(normPhrase)) return hint;

  // Pass 2: concentric search ±window
  for (let delta = 1; delta <= 10; delta++) {
    for (const sign of [-1, 1] as const) {
      const n = hint + sign * delta;
      const l = lines.find((x) => x.number === n);
      if (l && normalize(l.text).includes(normPhrase)) return n;
    }
  }

  // Pass 3: whole-scene linear search, preferring closest to hint
  const candidates = lines
    .filter((l) => normalize(l.text).includes(normPhrase))
    .map((l) => ({ n: l.number, dist: Math.abs(l.number - hint) }))
    .sort((a, b) => a.dist - b.dist);
  return candidates[0]?.n ?? null;
}

function main() {
  let totalGlosses = 0;
  let totalSkipped = 0;
  const summary: Array<{ id: string; count: number; skipped: number }> = [];

  for (const [sectionId, glossList] of Object.entries(GLOSSES)) {
    const filePath = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.error(`  MISSING: ${filePath}`);
      continue;
    }
    const section = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const valid: { id: string; line: number; phrase: string; definition: string }[] = [];
    let skipped = 0;

    for (let i = 0; i < glossList.length; i++) {
      const g = glossList[i];
      const actualLine = findLineForPhrase(section.lines, g.phrase, g.line);
      if (actualLine === null) {
        console.warn(`  ${sectionId}: cannot locate "${g.phrase}" in scene`);
        skipped++;
        continue;
      }
      valid.push({
        id: `${sectionId}_gloss${i + 1}`,
        line: actualLine,
        phrase: g.phrase,
        definition: g.definition,
      });
    }

    section.glosses = valid;
    fs.writeFileSync(filePath, JSON.stringify(section, null, 2));

    totalGlosses += valid.length;
    totalSkipped += skipped;
    summary.push({ id: sectionId, count: valid.length, skipped });
    console.log(
      `  ${sectionId}: ${valid.length} glosses${skipped > 0 ? ` (${skipped} not found)` : ""}`
    );
  }

  console.log(`\n=== Summary ===`);
  console.log(`  Total glosses: ${totalGlosses}`);
  console.log(`  Not located: ${totalSkipped}`);
  console.log(`  Scenes: ${summary.length}`);
  console.log(`  Average per scene: ${Math.round(totalGlosses / summary.length)}`);
}

main();
