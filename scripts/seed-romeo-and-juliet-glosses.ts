#!/usr/bin/env npx tsx
/**
 * seed-romeo-and-juliet-glosses.ts — Inline glosses for Romeo and Juliet.
 * Dictionary-neutral, 5–25 words each. Line hints are approximate; the
 * seeder auto-locates phrases within ±12 lines and then falls back to a
 * scene-wide search.
 *
 * Key R&J-specific handling per brief:
 *   - "wherefore" (2.2) must say "why" and explicitly flag that it does
 *     NOT mean "where"
 *   - "star-cross'd" captures both fate and astrological register
 *   - Queen Mab speech (1.4) densely glossed; Mercutio's wit throughout
 *   - Sonnets (Prologue, Act 2 Chorus, 1.5) glossed at sonnet-vocabulary
 *
 * Run: npx tsx scripts/seed-romeo-and-juliet-glosses.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/romeo-and-juliet");

interface SeedGloss { line: number; phrase: string; definition: string; }

const GLOSSES: Record<string, SeedGloss[]> = {

  // ── Prologue — CHORUS sonnet (14 lines) ─────────────────────────────
  romeo_and_juliet_prologue: [
    { line: 1, phrase: "dignity", definition: "social rank; noble status" },
    { line: 3, phrase: "ancient grudge", definition: "long-standing feud — the hostility predates the play" },
    { line: 3, phrase: "mutiny", definition: "civil strife; public disorder — not military rebellion" },
    { line: 4, phrase: "civil blood makes civil hands unclean", definition: "the blood of citizens stains the hands of fellow citizens — kinsmen killing kinsmen" },
    { line: 5, phrase: "forth the fatal loins", definition: "from the doomed reproductive line — the lovers are fated from conception" },
    { line: 6, phrase: "star-cross’d", definition: "fated by the stars to misfortune — Elizabethans believed the stars at birth determined destiny" },
    { line: 7, phrase: "misadventured", definition: "unfortunate; ill-fated" },
    { line: 7, phrase: "piteous overthrows", definition: "pitiable ruin; tragic downfalls" },
    { line: 8, phrase: "bury their parents’ strife", definition: "their deaths end the feud — only the children's death could stop the parents' quarrel" },
    { line: 9, phrase: "death-mark’d", definition: "marked for death; doomed" },
    { line: 11, phrase: "nought", definition: "nothing" },
    { line: 12, phrase: "two hours’ traffic", definition: "two hours' business — the play's running time on the Elizabethan stage" },
    { line: 13, phrase: "patient ears attend", definition: "listen patiently" },
    { line: 14, phrase: "What here shall miss, our toil shall strive to mend", definition: "what the prologue fails to convey, our performance will try to supply" },
  ],

  // ── 1.1 — Verona. A public place (234 lines) ────────────────────────
  romeo_and_juliet_act1_scene1: [
    { line: 1, phrase: "carry coals", definition: "endure insult; do menial work — to 'carry coals' was proverbially demeaning" },
    { line: 2, phrase: "colliers", definition: "coal-carriers — also slang for cheats or dirty fellows" },
    { line: 3, phrase: "choler", definition: "anger; one of the four humors, the hot bile" },
    { line: 4, phrase: "collar", definition: "the hangman's noose — Sampson's pun on choler/collier/collar" },
    { line: 6, phrase: "moved", definition: "provoked to anger" },
    { line: 8, phrase: "take the wall", definition: "claim the cleaner inner-street position, forcing others into the gutter — a gesture of dominance" },
    { line: 13, phrase: "weakest goes to the wall", definition: "the weak are pushed aside — proverb turned on its head by Sampson" },
    { line: 16, phrase: "maidenheads", definition: "virginities — Sampson's crude sexual bragging" },
    { line: 22, phrase: "poor-John", definition: "dried, salted hake — a cheap food associated with impotence" },
    { line: 29, phrase: "bucklers", definition: "small round shields used with short swords" },
    { line: 30, phrase: "marry", definition: "mild oath, from 'by the Virgin Mary' — roughly 'indeed'" },
    { line: 38, phrase: "bite my thumb", definition: "an insulting gesture made by flicking the thumbnail from behind the upper teeth" },
    { line: 52, phrase: "quarrel", definition: "a cause for fighting; a pretext" },
    { line: 60, phrase: "swashing blow", definition: "a slashing, swaggering sword-stroke" },
    { line: 62, phrase: "heartless hinds", definition: "cowardly peasants — 'hinds' = servants, with a pun on 'female deer'" },
    { line: 71, phrase: "villain", definition: "base-born man; peasant — not yet the modern sense of 'criminal'" },
    { line: 79, phrase: "long sword", definition: "an old-fashioned heavy weapon; the elder Capulet calls for one contemptuously, age-inappropriate" },
    { line: 85, phrase: "Profaners", definition: "defilers; those who desecrate sacred things" },
    { line: 87, phrase: "neighbour-stained steel", definition: "swords stained with neighbors' blood" },
    { line: 94, phrase: "mistemper’d", definition: "ill-tempered; used in anger (also: poorly forged)" },
    { line: 95, phrase: "moved prince", definition: "angered prince" },
    { line: 97, phrase: "airy word", definition: "trivial comment; mere breath" },
    { line: 98, phrase: "Verona’s ancient citizens", definition: "the elder townsmen of Verona" },
    { line: 100, phrase: "grave beseeming ornaments", definition: "dignified ceremonial garments of old age" },
    { line: 103, phrase: "forfeit", definition: "pay the penalty" },
    { line: 109, phrase: "Free-town", definition: "Villafranca, Escalus's judgment-seat near Verona" },
    { line: 116, phrase: "abroach", definition: "started; set in motion (like tapping a wine-cask)" },
    { line: 125, phrase: "withal", definition: "with it; therewith" },
    { line: 127, phrase: "fray", definition: "fight; brawl" },
    { line: 137, phrase: "drave", definition: "drove (archaic past tense)" },
    { line: 144, phrase: "humour", definition: "mood; temperament governed by the four bodily humors" },
    { line: 146, phrase: "sycamore", definition: "the name puns on 'sick-amour' — sick love" },
    { line: 154, phrase: "covert", definition: "hiding-place; thicket" },
    { line: 156, phrase: "Aurora", definition: "Roman goddess of the dawn" },
    { line: 157, phrase: "heavy son", definition: "sad son — 'heavy' means melancholy" },
    { line: 161, phrase: "portentous", definition: "ominous; warning of evil" },
    { line: 174, phrase: "shrift", definition: "confession" },
    { line: 176, phrase: "Out of her favour", definition: "unloved by her; out of the favor of the lady he loves" },
    { line: 178, phrase: "Alas, that love, so gentle in his view", definition: "Romeo begins his Petrarchan-lover complaint, heaping paradoxes on Cupid" },
    { line: 181, phrase: "muffled", definition: "blindfolded — Cupid was traditionally depicted blind" },
    { line: 183, phrase: "brawling love", definition: "quarrelsome love — the first of Romeo's stacked oxymorons" },
    { line: 184, phrase: "loving hate", definition: "hateful love — the play's central oxymoronic pairing" },
    { line: 185, phrase: "Mis-shapen chaos", definition: "formless disorder — from which creation was said to proceed" },
    { line: 186, phrase: "Feather of lead", definition: "weightless heaviness — impossible image" },
    { line: 186, phrase: "bright smoke", definition: "visible emptiness — paradox" },
    { line: 187, phrase: "cold fire", definition: "passionless flame — Petrarchan cliché" },
    { line: 187, phrase: "sick health", definition: "unhealthy well-being — oxymoron" },
    { line: 188, phrase: "Still-waking sleep", definition: "wakeful sleep; restless unconsciousness" },
    { line: 195, phrase: "propagate", definition: "increase; multiply" },
    { line: 201, phrase: "fume of sighs", definition: "vapor of sighs — love-sickness was thought to produce literal breath-clouds" },
    { line: 205, phrase: "discreet", definition: "prudent; judicious" },
    { line: 207, phrase: "soft", definition: "wait; stop — exclamation of interruption" },
    { line: 216, phrase: "In sadness", definition: "in earnest; seriously" },
    { line: 220, phrase: "aim’d so near", definition: "guessed so close to the truth" },
    { line: 221, phrase: "in love", definition: "actually in love" },
    { line: 222, phrase: "A right good mark-man", definition: "a good archer — continuing the Cupid-as-archer image" },
    { line: 223, phrase: "fair mark", definition: "attractive target" },
    { line: 224, phrase: "A right fair mark", definition: "a very beautiful target" },
    { line: 227, phrase: "Dian’s wit", definition: "the wisdom of Diana — Roman goddess of the moon, hunt, and chastity" },
    { line: 228, phrase: "strong proof of chastity well arm’d", definition: "heavily armored by virginity; immune to desire" },
    { line: 229, phrase: "childish bow", definition: "Cupid's boyish weapon — dismissed by Rosaline's chastity" },
    { line: 231, phrase: "encounter of assailing eyes", definition: "the seductive gaze of suitors" },
    { line: 232, phrase: "siege of loving terms", definition: "courtship as military campaign — a Petrarchan commonplace" },
    { line: 233, phrase: "ope", definition: "open" },
    { line: 235, phrase: "rich in beauty", definition: "only poor in that all her beauty will die with her — Rosaline has vowed chastity" },
    { line: 239, phrase: "sparing", definition: "self-denying; abstinent" },
    { line: 243, phrase: "forsworn to love", definition: "sworn off love" },
    { line: 200, phrase: "Adding to clouds more clouds", definition: "Romeo's sighs swell the clouds; Petrarchan weather-metaphor" },
    { line: 221, phrase: "in sadness", definition: "in earnest; seriously (Benvolio pressing Romeo)" },
    { line: 240, phrase: "posterity", definition: "descendants; future generations — Rosaline will leave no heir" },
  ],

  // ── 1.2 — A street (97 lines) ───────────────────────────────────────
  romeo_and_juliet_act1_scene2: [
    { line: 1, phrase: "bound", definition: "obligated by the Prince's order to keep the peace" },
    { line: 5, phrase: "reckoning", definition: "reputation; esteem" },
    { line: 8, phrase: "my child is yet a stranger in the world", definition: "Juliet is still a child; Capulet's first mention of her youth" },
    { line: 9, phrase: "fourteen years", definition: "Juliet is not yet fourteen — Capulet's stated age is historically plausible for Elizabethan noble betrothal but marks her as very young" },
    { line: 13, phrase: "marr’d", definition: "ruined; spoiled by early marriage and child-bearing" },
    { line: 14, phrase: "Earth hath swallow’d all my hopes but she", definition: "Capulet has lost his other children; Juliet is his only heir" },
    { line: 16, phrase: "hopeful lady of my earth", definition: "heir to my estate; my hope on earth — with a Latin pun on 'terra' / landed property" },
    { line: 27, phrase: "inherit", definition: "take possession of; enjoy" },
    { line: 32, phrase: "sirrah", definition: "form of address to inferiors, rougher than 'sir'" },
    { line: 38, phrase: "stay", definition: "wait" },
    { line: 41, phrase: "find those persons out", definition: "find and invite these guests" },
    { line: 42, phrase: "meddle with his yard", definition: "bawdy punning — cobbler tools (last/yard) confused with tailor tools" },
    { line: 46, phrase: "in good time", definition: "at just the right moment" },
    { line: 54, phrase: "holp", definition: "helped (archaic past tense)" },
    { line: 57, phrase: "plantain leaf", definition: "a common herb used to stop bleeding and draw out poison" },
    { line: 63, phrase: "tormented", definition: "tortured — stretched on the rack" },
    { line: 76, phrase: "Rest you merry", definition: "farewell; may you stay in good cheer" },
    { line: 83, phrase: "crush a cup of wine", definition: "drink a cup of wine — casual invitation" },
    { line: 87, phrase: "well-apparell’d April", definition: "spring freshly dressed; Shakespeare's personification of April" },
    { line: 89, phrase: "female buds", definition: "fresh young women" },
    { line: 90, phrase: "number more", definition: "one beauty more" },
    { line: 94, phrase: "unattainted", definition: "impartial; unbiased" },
    { line: 95, phrase: "poise", definition: "weigh; compare" },
    { line: 96, phrase: "crystal scales", definition: "the balance of the eyes — seeing other beauties will reset his judgment" },
  ],

  // ── 1.3 — A room in Capulet's house (108 lines) — THE AGE SCENE ─────
  romeo_and_juliet_act1_scene3: [
    { line: 5, phrase: "give leave", definition: "allow us privacy; leave us" },
    { line: 14, phrase: "she’s not fourteen", definition: "Juliet is explicitly under fourteen — the play makes her extreme youth textually unavoidable" },
    { line: 17, phrase: "Lammas-tide", definition: "August 1st, a harvest festival — Juliet's birthday falls two weeks before, on July 31" },
    { line: 22, phrase: "Lammas Eve at night", definition: "July 31 — Juliet's fourteenth birthday is still two weeks away" },
    { line: 25, phrase: "Susan and she—God rest all Christian souls!", definition: "the Nurse had a daughter Susan, who died; her grief fuels her bond to Juliet" },
    { line: 28, phrase: "eleven years", definition: "the Nurse nursed Juliet — timeline hint for the Nurse's intimate bond" },
    { line: 30, phrase: "wormwood", definition: "a bitter herb applied to the nipple to repel a nursing child" },
    { line: 31, phrase: "dug", definition: "nipple; teat" },
    { line: 35, phrase: "tetchy", definition: "peevish; fretful" },
    { line: 37, phrase: "dove-house", definition: "dovecote; pigeon-house" },
    { line: 41, phrase: "trudge", definition: "walk with weary effort" },
    { line: 42, phrase: "rood", definition: "cross of Christ — mild oath" },
    { line: 52, phrase: "Jule", definition: "Juliet's baby-name" },
    { line: 60, phrase: "stinted", definition: "stopped; ceased" },
    { line: 65, phrase: "God mark thee to his grace", definition: "God take you into his favor — blessing" },
    { line: 67, phrase: "wast the prettiest babe", definition: "the Nurse's memory of Juliet as an infant" },
    { line: 74, phrase: "holidam", definition: "holy relic or lady — mild oath" },
    { line: 80, phrase: "stint", definition: "cease" },
    { line: 90, phrase: "disposition", definition: "inclination; mood" },
    { line: 92, phrase: "an honour", definition: "a great honor — Lady Capulet's word for marriage" },
    { line: 99, phrase: "a man of wax", definition: "a figure as perfectly moulded as a wax sculpture — flawless" },
    { line: 101, phrase: "flower", definition: "the finest example" },
    { line: 103, phrase: "read o’er the volume of young Paris’ face", definition: "Lady Capulet sustains a conceit of Paris as a book to be read" },
    { line: 104, phrase: "married lineament", definition: "well-matched feature" },
    { line: 105, phrase: "one another lends content", definition: "each feature complements the next" },
    { line: 107, phrase: "unbound", definition: "unbound as a book — also a pun on unmarried" },
    { line: 108, phrase: "fish lives in the sea", definition: "proverbial — fish naturally belongs in water, as a man in his proper element" },
  ],

  // ── 1.4 — A street (120 lines) — QUEEN MAB ≥35 glosses ──────────────
  romeo_and_juliet_act1_scene4: [
    { line: 1, phrase: "speech", definition: "the conventional prologue maskers recited before entering a feast" },
    { line: 3, phrase: "The date is out of such prolixity", definition: "such long-windedness is out of fashion" },
    { line: 4, phrase: "Cupid hoodwink’d with a scarf", definition: "Cupid blindfolded — the traditional masque costume" },
    { line: 5, phrase: "Tartar’s painted bow of lath", definition: "a curved wooden toy bow in Tartar style — a stage-prop Cupid" },
    { line: 6, phrase: "crow-keeper", definition: "a scarecrow; a boy paid to frighten birds — clumsy, unimpressive" },
    { line: 7, phrase: "without-book prologue", definition: "memorized introduction; recited by rote" },
    { line: 10, phrase: "measure us by what they will", definition: "judge us as they please" },
    { line: 10, phrase: "measure them a measure", definition: "dance with them (pun: 'measure' as judgment and as stately dance)" },
    { line: 11, phrase: "ambling", definition: "light-footed dancing" },
    { line: 12, phrase: "heavy", definition: "sad; melancholy — weighted" },
    { line: 15, phrase: "soul of lead", definition: "dead-weight spirit; grief as gravity" },
    { line: 17, phrase: "Cupid’s wings", definition: "the winged god of love's means of flight" },
    { line: 19, phrase: "sore enpierced with his shaft", definition: "painfully stuck with Cupid's arrow" },
    { line: 21, phrase: "bound a pitch", definition: "spring above a certain height" },
    { line: 29, phrase: "case to put my visage in", definition: "a mask to cover my face" },
    { line: 30, phrase: "visor for a visor", definition: "a mask for a mask — Mercutio's self-mocking joke about his looks" },
    { line: 31, phrase: "quote deformities", definition: "note defects" },
    { line: 32, phrase: "beetle brows", definition: "heavy, jutting eyebrows — on the mask" },
    { line: 34, phrase: "betake him to his legs", definition: "start dancing" },
    { line: 35, phrase: "wantons light of heart", definition: "cheerful, frivolous people" },
    { line: 36, phrase: "senseless rushes", definition: "the rushes strewn on the floor — inanimate, unfeeling" },
    { line: 37, phrase: "grandsire phrase", definition: "old man's saying — about sitting out the dance" },
    { line: 38, phrase: "candle-holder", definition: "spectator — proverbially the candle-holder watches the game" },
    { line: 39, phrase: "The game was ne’er so fair, and I am done", definition: "proverb: when you are losing, quit while you are ahead" },
    { line: 40, phrase: "dun’s the mouse", definition: "be quiet; keep still (proverb — dun-colored mice hide at night)" },
    { line: 41, phrase: "draw thee from the mire", definition: "pull you out of the mud — from the game of 'dun is in the mire' where players pull a log free" },
    { line: 42, phrase: "sir-reverence", definition: "saving your presence — apology for the crude word coming next" },
    { line: 43, phrase: "burn daylight", definition: "waste time — burning a candle in daylight is wasteful" },
    { line: 47, phrase: "five wits", definition: "the five mental faculties: common wit, imagination, fantasy, estimation, memory" },
    { line: 53, phrase: "Queen Mab", definition: "fairy queen of dreams in English folklore — the midwife who delivers dreams to sleepers" },
    { line: 54, phrase: "fairies’ midwife", definition: "the fairy who brings dreams to birth; also the fairies' own midwife" },
    { line: 55, phrase: "agate-stone", definition: "a small gem set in a finger-ring — Mab is that small" },
    { line: 56, phrase: "alderman", definition: "a city councilor; high-ranking burgher" },
    { line: 57, phrase: "atomies", definition: "tiny creatures; motes — the smallest imaginable beings" },
    { line: 58, phrase: "Athwart", definition: "across" },
    { line: 59, phrase: "spinners’ legs", definition: "daddy-long-legs; spiders' legs" },
    { line: 61, phrase: "traces", definition: "harness straps that attach animals to a carriage" },
    { line: 62, phrase: "moonshine’s watery beams", definition: "the pale light of the moon, imagined as strap-material" },
    { line: 63, phrase: "film", definition: "gossamer; cobweb thread" },
    { line: 64, phrase: "waggoner", definition: "driver of a cart" },
    { line: 66, phrase: "Prick’d from the lazy finger of a maid", definition: "from a lazy girl's idle finger — tiny worms were believed to breed in the fingers of the slothful" },
    { line: 67, phrase: "hazel-nut", definition: "the size of Mab's coach" },
    { line: 68, phrase: "joiner squirrel", definition: "squirrel-carpenter — as if the squirrel had crafted the shell" },
    { line: 69, phrase: "Time out o’ mind", definition: "from time immemorial" },
    { line: 72, phrase: "court’sies", definition: "curtsies; formal bows made at court" },
    { line: 75, phrase: "angry Mab with blisters plagues", definition: "Mab punishes women with cold sores — folk-etiology of herpes" },
    { line: 76, phrase: "sweetmeats tainted", definition: "breath fouled by candy — folk belief that blisters came from bad breath" },
    { line: 77, phrase: "courtier’s nose", definition: "the courtier sniffing for favor — about to 'smell out' an opportunity" },
    { line: 78, phrase: "smelling out a suit", definition: "detecting a legal case or patronage opportunity — courtiers' livelihood" },
    { line: 79, phrase: "tithe-pig’s tail", definition: "tail of a pig given as church tribute — tickles the parson into dreaming of more tithes" },
    { line: 80, phrase: "parson", definition: "priest of a parish" },
    { line: 81, phrase: "benefice", definition: "a church living; salaried parish post" },
    { line: 84, phrase: "breaches", definition: "gaps blown in enemy walls" },
    { line: 84, phrase: "ambuscadoes", definition: "ambushes (Spanish military term)" },
    { line: 84, phrase: "Spanish blades", definition: "Toledo swords — finest Renaissance steel" },
    { line: 85, phrase: "healths five-fathom deep", definition: "deep drinks drunk as toasts; five-fathom = 30 feet, hyperbolic" },
    { line: 85, phrase: "anon", definition: "at once; suddenly" },
    { line: 86, phrase: "Drums in his ear", definition: "a military drum imagined in his dream" },
    { line: 89, phrase: "plats the manes of horses", definition: "braids horses' manes — the folk-belief that fairies caused the tangles" },
    { line: 90, phrase: "elf-locks", definition: "tangled mats of hair — the marks left by fairy mischief" },
    { line: 91, phrase: "misfortune bodes", definition: "predicts bad luck" },
    { line: 92, phrase: "hag", definition: "old witch — Mab in her darker aspect" },
    { line: 93, phrase: "presses them", definition: "lies on top of them — the incubus myth; Mab causes nocturnal emission" },
    { line: 94, phrase: "good carriage", definition: "good bearing — with a bawdy pun on sexual bearing / capacity to bear a child" },
    { line: 96, phrase: "Thou talk’st of nothing", definition: "you're speaking of nothing — Romeo interrupts Mercutio's runaway flight" },
    { line: 97, phrase: "idle brain", definition: "daydreaming mind; unoccupied thought" },
    { line: 98, phrase: "vain fantasy", definition: "empty imagination" },
    { line: 100, phrase: "inconstant", definition: "changeable; fickle" },
    { line: 103, phrase: "dew-dropping south", definition: "the south wind, bringer of rain and dew" },
    { line: 104, phrase: "blows us from ourselves", definition: "distracts us; carries us away from our purpose" },
    { line: 106, phrase: "my mind misgives", definition: "I have a foreboding; I fear" },
    { line: 107, phrase: "consequence yet hanging in the stars", definition: "some destiny written in the stars, still pending" },
    { line: 109, phrase: "expire the term", definition: "bring to an end the appointed time" },
    { line: 111, phrase: "untimely death", definition: "premature death" },
    { line: 112, phrase: "He, that hath the steerage of my course", definition: "God, the pilot of my life" },
  ],

  // ── 1.5 — A hall in Capulet's house (151 lines) — TIER 1 ────────────
  romeo_and_juliet_act1_scene5: [
    { line: 1, phrase: "trencher", definition: "wooden serving-board" },
    { line: 6, phrase: "joint-stools", definition: "benches made by a joiner; common seating" },
    { line: 6, phrase: "court-cupboard", definition: "sideboard for displaying plate" },
    { line: 7, phrase: "marchpane", definition: "marzipan — almond paste confection" },
    { line: 20, phrase: "unplagued with corns", definition: "unbothered by foot-sores — unafflicted" },
    { line: 25, phrase: "makes dainty", definition: "demurs; pretends reluctance" },
    { line: 32, phrase: "pentecost", definition: "seventh Sunday after Easter — about fifty days" },
    { line: 41, phrase: "crow", definition: "a black bird — Juliet stands out among the dark Capulets" },
    { line: 43, phrase: "Ethiope’s ear", definition: "an Ethiopian's ear — Juliet's brilliance is like a white jewel against dark skin" },
    { line: 44, phrase: "snowy dove trooping with crows", definition: "white dove among black crows — Juliet as visible purity" },
    { line: 49, phrase: "Forswear it, sight", definition: "deny it, my eyes — the first sight of Juliet erases Rosaline" },
    { line: 54, phrase: "rapier", definition: "long, slender thrusting sword" },
    { line: 58, phrase: "antic face", definition: "grotesque mask" },
    { line: 59, phrase: "fleer", definition: "mock; sneer" },
    { line: 60, phrase: "stock and honour of my kin", definition: "the lineage and reputation of my family" },
    { line: 61, phrase: "hold it not a sin", definition: "Tybalt's rage-as-religion — murder-as-piety" },
    { line: 66, phrase: "a villain that is hither come in spite", definition: "a scoundrel who has come here with malicious intent" },
    { line: 73, phrase: "portly", definition: "dignified; well-mannered" },
    { line: 79, phrase: "disparagement", definition: "insult; dishonor" },
    { line: 82, phrase: "ill-beseeming semblance", definition: "ill-suited appearance" },
    { line: 87, phrase: "God shall mend my soul", definition: "mild oath" },
    { line: 89, phrase: "If I profane with my unworthiest hand", definition: "Romeo begins the shared sonnet — pilgrim-at-shrine imagery — a formal sonnet begins here" },
    { line: 89, phrase: "profane", definition: "defile; treat as unsacred" },
    { line: 90, phrase: "holy shrine", definition: "Juliet's hand, imagined as a saint's relic" },
    { line: 90, phrase: "gentle fine", definition: "gentle penalty" },
    { line: 91, phrase: "two blushing pilgrims", definition: "Romeo's lips imagined as pilgrims approaching a shrine" },
    { line: 93, phrase: "Good pilgrim", definition: "Juliet picks up Romeo's conceit — the shared sonnet continues line-for-line" },
    { line: 94, phrase: "mannerly devotion", definition: "proper reverence" },
    { line: 96, phrase: "palmers", definition: "pilgrims who carried palm-leaves as sign of pilgrimage to Jerusalem" },
    { line: 96, phrase: "palm to palm", definition: "hands pressed in greeting, also in prayer" },
    { line: 98, phrase: "lips that they must use in prayer", definition: "Juliet turns Romeo's metaphor back on him — saints' lips pray, not kiss" },
    { line: 99, phrase: "dear saint", definition: "addressing Juliet as a holy figure" },
    { line: 100, phrase: "faith turn to despair", definition: "theological pun — unanswered prayer damns the pilgrim" },
    { line: 101, phrase: "Saints do not move", definition: "statues of saints don't step toward worshippers — Juliet agrees to be kissed only in a formal sense" },
    { line: 102, phrase: "prayer’s effect", definition: "the result granted to prayer — here, a kiss" },
    { line: 103, phrase: "sin is purged", definition: "sin absolved — sealed by the sonnet's kiss" },
    { line: 107, phrase: "by the book", definition: "according to the rules; methodically — Juliet's wry verdict on Romeo's style" },
    { line: 120, phrase: "chinks", definition: "coin; cash — Juliet is Capulet's sole heir" },
    { line: 122, phrase: "my foe’s debt", definition: "an obligation to my enemy" },
    { line: 126, phrase: "trifling foolish banquet", definition: "light refreshment — modest supper offered before parting" },
    { line: 133, phrase: "Prodigious", definition: "ominous; foreboding" },
    { line: 141, phrase: "loathed enemy", definition: "hated foe" },
    { line: 144, phrase: "Prodigious birth of love", definition: "monstrous beginning of love — born from enmity" },
    { line: 145, phrase: "Too early seen unknown", definition: "seen too soon, before knowing who; known too late, after loving" },
  ],
};

// ── Seeder ─────────────────────────────────────────────────────────────
// The actual write-to-disk logic is below. Glosses for Acts 2-5 are
// appended to GLOSSES via additional modules loaded at the bottom so that
// this file stays readable. Each additional module mutates the GLOSSES
// record in place.

require("./data/romeo-and-juliet-act2-glosses")(GLOSSES);
require("./data/romeo-and-juliet-act3-glosses")(GLOSSES);
require("./data/romeo-and-juliet-act4-glosses")(GLOSSES);
require("./data/romeo-and-juliet-act5-glosses")(GLOSSES);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\u2018\u2019\u02BC]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014\u2015]/g, "-")
    .replace(/\u00A0/g, " ")
    // treat hyphens and word-joining dashes as spaces so "poor-John" matches
    // "poor John" and "plantain-leaf" matches "plantain leaf", etc.
    .replace(/[-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function findLineForPhrase(
  lines: { number: number; text: string }[],
  phrase: string,
  hint: number,
  stageDirs?: { after_line: number; text: string }[]
): number | null {
  // Strip explicit line-break markers from the phrase — lets us gloss
  // phrases that cross line boundaries (e.g. "through all thy veins / shall run")
  const normPhrase = normalize(phrase.replace(/\s*\/\s*/g, " "));
  const hintLine = lines.find((l) => l.number === hint);
  if (hintLine && normalize(hintLine.text).includes(normPhrase)) return hint;
  for (let delta = 1; delta <= 20; delta++) {
    for (const sign of [-1, 1] as const) {
      const n = hint + sign * delta;
      const l = lines.find((x) => x.number === n);
      if (l && normalize(l.text).includes(normPhrase)) return n;
    }
  }
  // Scene-wide single-line search
  const singleLine = lines
    .filter((l) => normalize(l.text).includes(normPhrase))
    .map((l) => ({ n: l.number, dist: Math.abs(l.number - hint) }))
    .sort((a, b) => a.dist - b.dist);
  if (singleLine[0]) return singleLine[0].n;
  // Sliding 2-line window: concatenate consecutive pairs and re-check.
  for (let i = 0; i < lines.length - 1; i++) {
    const joined = normalize(lines[i].text + " " + lines[i + 1].text);
    if (joined.includes(normPhrase)) return lines[i].number;
  }
  // Stage-direction match — glosses attach to the line the direction
  // follows (e.g. "Enter SAMPSON and GREGORY" targets L0/1).
  if (stageDirs) {
    const sd = stageDirs.find((sd) => normalize(sd.text).includes(normPhrase));
    if (sd) {
      // Anchor to the next line of dialogue (after_line + 1) so the gloss
      // has a line it can render against; fall back to line 1 if none.
      const anchor = lines.find((l) => l.number === sd.after_line + 1)?.number;
      return anchor ?? (lines[0]?.number ?? null);
    }
  }
  // Fuzzy word-window fallback: if every ≥4-char word in the phrase
  // appears inside a ±5-line window around the hint, attach to the hint.
  const words = normPhrase.split(" ").filter((w) => w.length >= 4);
  if (words.length > 0) {
    const windowStart = Math.max(1, hint - 5);
    const windowEnd = hint + 5;
    const windowText = lines
      .filter((l) => l.number >= windowStart && l.number <= windowEnd)
      .map((l) => normalize(l.text))
      .join(" ");
    if (words.every((w) => windowText.includes(w))) {
      // Point to the line (within the window) that contains the most phrase words.
      const best = lines
        .filter((l) => l.number >= windowStart && l.number <= windowEnd)
        .map((l) => {
          const text = normalize(l.text);
          const count = words.filter((w) => text.includes(w)).length;
          return { n: l.number, count };
        })
        .sort((a, b) => b.count - a.count)[0];
      return best?.n ?? hint;
    }
  }
  return null;
}

function main() {
  const sectionIds = Object.keys(GLOSSES);
  let totalGlosses = 0;
  let totalSkipped = 0;
  const summary: { id: string; count: number; skipped: number }[] = [];

  console.log(`=== Seeding Romeo and Juliet glosses (${sectionIds.length} sections) ===\n`);

  for (const sectionId of sectionIds) {
    const filePath = path.join(CONTENT_DIR, `${sectionId}.json`);
    if (!fs.existsSync(filePath)) {
      console.warn(`  MISSING FILE: ${sectionId}.json — skipping`);
      continue;
    }
    const section = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    const glossList = GLOSSES[sectionId];
    const valid: { id: string; line: number; phrase: string; definition: string }[] = [];
    let skipped = 0;

    for (let i = 0; i < glossList.length; i++) {
      const g = glossList[i];
      const actualLine = findLineForPhrase(section.lines, g.phrase, g.line, section.stage_directions);
      if (actualLine === null) {
        console.warn(`  ${sectionId}: cannot locate "${g.phrase}" near L${g.line}`);
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
  console.log(`  Not located:   ${totalSkipped}`);
  console.log(`  Sections:      ${summary.length}`);
  console.log(`  Average:       ${Math.round(totalGlosses / summary.length)} per section`);
}

main();
