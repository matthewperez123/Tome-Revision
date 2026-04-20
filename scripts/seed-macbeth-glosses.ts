#!/usr/bin/env npx tsx
/**
 * seed-macbeth-glosses.ts — Write curated glosses into content/macbeth scene JSONs.
 *
 * Same pattern as seed-othello-glosses.ts. Each gloss is authored inline,
 * dictionary-neutral, 5–25 words. Line hints are approximate; the seeder
 * auto-locates the real line by searching the scene for the phrase.
 *
 * Key Macbeth-specific handling per prompt addendum:
 *   - "weird" = wyrd/fate (NOT modern "strange")
 *   - "equivocator" includes Jesuit/Henry Garnet/Gunpowder Plot context
 *   - "Hecate" as Greek goddess, "Bellona" as Roman war goddess
 *
 * Run: npx tsx scripts/seed-macbeth-glosses.ts
 */

import * as fs from "fs";
import * as path from "path";

const ROOT = path.resolve(__dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content/macbeth");

interface SeedGloss { line: number; phrase: string; definition: string; }

const GLOSSES: Record<string, SeedGloss[]> = {

  // ── 1.1 — A desert place (13 lines) ─────────────────────────────────
  macbeth_act1_scene1: [
    { line: 1, phrase: "hurlyburly", definition: "tumult; uproar — the chaos of battle" },
    { line: 3, phrase: "ere", definition: "before" },
    { line: 6, phrase: "heath", definition: "open, uncultivated moorland, typical of the Scottish highlands" },
    { line: 8, phrase: "Graymalkin", definition: "the First Witch's grey cat, her familiar spirit" },
    { line: 9, phrase: "Paddock", definition: "the Second Witch's familiar, a toad" },
    { line: 9, phrase: "Anon", definition: "at once; coming shortly" },
    { line: 10, phrase: "Fair is foul, and foul is fair", definition: "the play's central paradox: moral categories will invert; appearances will deceive" },
    { line: 11, phrase: "Hover through the fog and filthy air", definition: "the witches supernaturally pass through the thick air; the line establishes the play's atmosphere of metaphysical disorder" },
  ],

  // ── 1.2 — A camp near Forres (76 lines) ─────────────────────────────
  macbeth_act1_scene2: [
    { line: 1, phrase: "sergeant", definition: "here, a senior soldier; a wounded officer" },
    { line: 3, phrase: "’Gainst my captivity", definition: "against my being captured" },
    { line: 6, phrase: "broil", definition: "battle; tumult" },
    { line: 8, phrase: "Doubtful it stood", definition: "the battle's outcome was uncertain" },
    { line: 9, phrase: "choke their art", definition: "defeat each other's skill" },
    { line: 11, phrase: "villainies of nature", definition: "his natural wickedness" },
    { line: 12, phrase: "kerns and gallowglasses", definition: "light-armed Irish foot soldiers and heavy-armed mercenaries" },
    { line: 13, phrase: "quarrel", definition: "cause; conflict" },
    { line: 14, phrase: "Fortune, on his damned quarrel smiling", definition: "Lady Luck favoring his evil cause" },
    { line: 15, phrase: "whore", definition: "fickle; unfaithful — Fortune figured as faithless" },
    { line: 16, phrase: "disdaining", definition: "scorning" },
    { line: 17, phrase: "steel", definition: "sword" },
    { line: 18, phrase: "minion", definition: "darling; favorite" },
    { line: 19, phrase: "brandished", definition: "waved in the air" },
    { line: 20, phrase: "unseam’d him from the nave to the chaps", definition: "split him open from the navel to the jaws — graphic battle-image for Macbeth's ferocity" },
    { line: 20, phrase: "chaps", definition: "jaws" },
    { line: 20, phrase: "nave", definition: "navel" },
    { line: 23, phrase: "As whence the sun ’gins his reflection", definition: "just as in the direction the sun rises" },
    { line: 26, phrase: "So from that spring whence comfort seem’d to come", definition: "from the source that seemed to bring relief" },
    { line: 34, phrase: "Bellona’s bridegroom", definition: "Macbeth figured as the husband of Bellona, Roman goddess of war — high praise" },
    { line: 34, phrase: "Bellona", definition: "Roman goddess of war" },
    { line: 35, phrase: "lapp’d in proof", definition: "encased in tested armor" },
    { line: 36, phrase: "self-comparisons", definition: "equal matching; meeting him blow for blow" },
    { line: 38, phrase: "lavish", definition: "insolent; unrestrained" },
    { line: 48, phrase: "craves composition", definition: "begs for terms of peace" },
    { line: 50, phrase: "Saint Colme’s Inch", definition: "Inchcolm, an island in the Firth of Forth used as a burial ground" },
    { line: 51, phrase: "dollars", definition: "anachronistic term for Scottish coinage" },
    { line: 53, phrase: "Thane of Cawdor", definition: "Scottish nobleman; Cawdor is a region in the Highlands — Thane is below an earl in rank" },
    { line: 54, phrase: "bosom interest", definition: "most trusted intimate; inner circle" },
    { line: 56, phrase: "What he hath lost noble Macbeth hath won", definition: "the title Macbeth is about to inherit — and the ambition that comes with it" },
  ],

  // ── 1.3 — A heath near Forres (168 lines) — TIER 1 ──────────────────
  macbeth_act1_scene3: [
    { line: 2, phrase: "Killing swine", definition: "witches were traditionally believed to curse livestock" },
    { line: 6, phrase: "Aroint thee, witch", definition: "be gone; away with you — dialectal curse" },
    { line: 6, phrase: "rump-fed ronyon", definition: "fat-arsed scabby creature — Elizabethan insult for a low woman" },
    { line: 7, phrase: "Aleppo", definition: "a Syrian city; a major trading post on the silk road" },
    { line: 7, phrase: "Tiger", definition: "name of a real Elizabethan merchant ship" },
    { line: 8, phrase: "sieve", definition: "witches were proverbially said to sail in sieves" },
    { line: 9, phrase: "rat without a tail", definition: "another traditional witch-transformation" },
    { line: 12, phrase: "blow", definition: "strike; afflict" },
    { line: 14, phrase: "pilot’s thumb", definition: "a witch's charm ingredient — body parts of the drowned were thought to carry magical power" },
    { line: 15, phrase: "wreck’d", definition: "shipwrecked" },
    { line: 16, phrase: "A drum", definition: "offstage sound announcing Macbeth's approach" },
    { line: 19, phrase: "weird sisters", definition: "from Old English 'wyrd,' meaning fate — NOT the modern sense of 'strange'; these are the Fates, agents of destiny" },
    { line: 19, phrase: "Weird", definition: "from Old English 'wyrd,' meaning fate or destiny; NOT the modern sense of 'odd'" },
    { line: 23, phrase: "Posters of the sea and land", definition: "swift travelers by sea and land" },
    { line: 32, phrase: "So foul and fair a day", definition: "an echo of the Witches' paradox from 1.1 — Macbeth speaks their language unawares" },
    { line: 33, phrase: "Forres", definition: "a town in northeastern Scotland; Duncan's court" },
    { line: 38, phrase: "choppy", definition: "chapped; weather-beaten" },
    { line: 41, phrase: "beards", definition: "the witches have beards — the common early-modern image of the witch's ambiguous sex" },
    { line: 45, phrase: "shalt be King hereafter", definition: "the Third Witch's prophecy that sets the tragedy in motion" },
    { line: 48, phrase: "start", definition: "flinch; react with shock" },
    { line: 48, phrase: "fear", definition: "startling fear — Banquo notes Macbeth's guilty-looking reaction" },
    { line: 51, phrase: "rapt withal", definition: "absorbed, captivated by it" },
    { line: 56, phrase: "seeds of time", definition: "the future events still hidden" },
    { line: 60, phrase: "corporal", definition: "bodily; having physical form" },
    { line: 65, phrase: "insane root", definition: "henbane or hemlock — a plant said to cause madness if eaten" },
    { line: 68, phrase: "Speak, then, to me", definition: "Banquo's bold demand — he is unafraid of the Sisters" },
    { line: 79, phrase: "Thane of Glamis", definition: "Macbeth's hereditary title; a Highland estate" },
    { line: 80, phrase: "Sinel", definition: "Macbeth's father" },
    { line: 84, phrase: "owe", definition: "own; possess" },
    { line: 85, phrase: "this strange intelligence", definition: "this supernatural information" },
    { line: 88, phrase: "blasted heath", definition: "barren, struck moor — the witches' natural habitat" },
    { line: 105, phrase: "insane root", definition: "plant that causes madness; hemlock or henbane" },
    { line: 108, phrase: "earnest", definition: "down payment; pledge of future payment" },
    { line: 115, phrase: "post with post", definition: "messenger upon messenger" },
    { line: 125, phrase: "line", definition: "reinforce; support" },
    { line: 126, phrase: "Silenced", definition: "have been cut off by his death" },
    { line: 130, phrase: "borrow’d robes", definition: "clothes that do not belong to you — a key metaphor in the play for usurped titles" },
    { line: 135, phrase: "Cousins", definition: "a common term for any kinsman" },
    { line: 140, phrase: "earnest of success", definition: "proof of the prophecy's partial fulfillment" },
    { line: 142, phrase: "yield them all", definition: "grant everything" },
    { line: 144, phrase: "horrid image", definition: "horrifying mental picture — of murder" },
    { line: 146, phrase: "seated heart knock at my ribs", definition: "his heart pounds against his ribcage — the physical manifestation of guilty imagining" },
    { line: 148, phrase: "single state of man", definition: "unified being; integrated self" },
    { line: 149, phrase: "function", definition: "normal operation" },
    { line: 151, phrase: "surmise", definition: "speculation; imagined possibility" },
    { line: 155, phrase: "If chance will have me king, why, chance may crown me, / Without my stir", definition: "Macbeth's first moment of self-persuasion — the fatalism that will crack" },
    { line: 160, phrase: "rapt", definition: "lost in thought; absorbed" },
    { line: 167, phrase: "The interim having weigh’d it", definition: "once we've had time to consider it" },
  ],

  // ── 1.4 — Forres. The palace (57 lines) ─────────────────────────────
  macbeth_act1_scene4: [
    { line: 3, phrase: "commissions", definition: "those commanded to perform the execution" },
    { line: 7, phrase: "studied in his death", definition: "rehearsed his execution like a lesson" },
    { line: 9, phrase: "owed", definition: "owned" },
    { line: 12, phrase: "There’s no art / To find the mind’s construction in the face", definition: "you cannot read the mind from the face — Duncan's fatal truth, spoken of the first Cawdor" },
    { line: 15, phrase: "absolute trust", definition: "complete confidence — which he now places in Macbeth" },
    { line: 20, phrase: "More is thy due than more than all can pay", definition: "you deserve more than I can ever repay" },
    { line: 27, phrase: "Prince of Cumberland", definition: "the formal title for the heir to the Scottish throne — a roadblock Macbeth now sees" },
    { line: 33, phrase: "Wanting your leave and honour", definition: "waiting only for your royal permission and praise" },
    { line: 39, phrase: "Inverness", definition: "a town in the Scottish Highlands; Macbeth's castle" },
    { line: 48, phrase: "stars, hide your fires", definition: "Macbeth's first dark prayer — asking the heavens to conceal his intentions" },
    { line: 50, phrase: "black and deep desires", definition: "murderous ambitions he is beginning to admit to himself" },
    { line: 51, phrase: "wink at the hand", definition: "close (my eye) to what the hand does — separation of moral conscience from murderous action" },
    { line: 52, phrase: "yet let that be", definition: "yet let (the deed) still happen" },
  ],

  // ── 1.5 — Inverness. Macbeth's castle (68 lines) — TIER 1 ───────────
  macbeth_act1_scene5: [
    { line: 3, phrase: "perfectest report", definition: "the most reliable information" },
    { line: 4, phrase: "mortal knowledge", definition: "human understanding" },
    { line: 6, phrase: "missives", definition: "messengers" },
    { line: 8, phrase: "coming on of time", definition: "the future that is approaching" },
    { line: 12, phrase: "deliver thee", definition: "report to you" },
    { line: 16, phrase: "milk of human kindness", definition: "Lady Macbeth's famous phrase: the gentle, nurturing compassion that makes one human — and that she thinks disqualifies Macbeth from murder" },
    { line: 18, phrase: "illness should attend it", definition: "the evil that must accompany ambition" },
    { line: 20, phrase: "holily", definition: "in a holy, scrupulous manner" },
    { line: 23, phrase: "metaphysical aid", definition: "supernatural help — 'metaphysical' here means 'beyond the physical,' NOT the modern philosophical sense" },
    { line: 23, phrase: "metaphysical", definition: "supernatural; beyond the physical — 'metaphysical' in the Elizabethan sense, NOT today's philosophical usage" },
    { line: 24, phrase: "doth seem / To have thee crown’d withal", definition: "seems to have you destined to be crowned" },
    { line: 27, phrase: "raven", definition: "bird of ill omen, announcing death" },
    { line: 31, phrase: "unsex me here", definition: "strip me of my femininity — Lady Macbeth's plea to be made capable of murder; the speech imagines womanhood itself as a barrier to cruelty" },
    { line: 32, phrase: "Stop up the access and passage to remorse", definition: "block every channel through which conscience might enter" },
    { line: 33, phrase: "compunctious visitings of nature", definition: "natural stirrings of remorse or pity — the instinctive human recoil from cruelty" },
    { line: 34, phrase: "compunctious", definition: "of pity, conscience, or remorse" },
    { line: 35, phrase: "fell purpose", definition: "cruel, deadly intent" },
    { line: 35, phrase: "fell", definition: "cruel; deadly" },
    { line: 36, phrase: "keep peace between / The effect and it", definition: "to stop (conscience) from interfering between the intent and the deed" },
    { line: 37, phrase: "take my milk for gall", definition: "replace my mother's milk with bile — reversing nurture into poison" },
    { line: 38, phrase: "sightless substances", definition: "invisible beings; unseen spirits that attend on murder" },
    { line: 39, phrase: "murth’ring ministers", definition: "agents of murder; the demonic assistants Lady Macbeth summons" },
    { line: 40, phrase: "wait on nature’s mischief", definition: "attend on natural disasters or moral wrongs" },
    { line: 41, phrase: "dunnest smoke of hell", definition: "darkest smoke of hell — Lady M's prayer for concealing darkness" },
    { line: 42, phrase: "pall thee", definition: "cover yourself; dress yourself as if in a funeral shroud" },
    { line: 43, phrase: "blanket of the dark", definition: "the covering of darkness — the night figured as a bed-blanket hiding sin" },
    { line: 55, phrase: "transported me beyond / This ignorant present", definition: "carried me past the ignorant now (into knowledge of the future)" },
    { line: 60, phrase: "beguile the time", definition: "deceive everyone looking; make the hours pass without suspicion" },
    { line: 63, phrase: "serpent under’t", definition: "Lady Macbeth's key instruction to Macbeth on deception — look harmless, be poisonous" },
    { line: 66, phrase: "solely sovereign sway", definition: "absolute royal power" },
  ],

  // ── 1.6 — Before Macbeth's castle (37 lines) ────────────────────────
  macbeth_act1_scene6: [
    { line: 2, phrase: "recommends itself", definition: "commends itself; presents itself favorably" },
    { line: 4, phrase: "martlet", definition: "house martin (swallow) — a bird said to nest only in holy places" },
    { line: 5, phrase: "approve", definition: "confirm" },
    { line: 6, phrase: "mansionry", definition: "nesting-place; dwelling" },
    { line: 7, phrase: "jutty, frieze, / Buttress", definition: "architectural features — a projecting wall, sculpted band, supporting pier" },
    { line: 8, phrase: "coign of vantage", definition: "a corner providing a vantage point" },
    { line: 9, phrase: "pendent bed and procreant cradle", definition: "hanging nest and nursery — where the martlet breeds" },
    { line: 10, phrase: "haunt", definition: "frequent; inhabit" },
    { line: 20, phrase: "hermits", definition: "praying men — religious figures who pray for their benefactors" },
    { line: 29, phrase: "coursed him at the heels", definition: "pursued him close behind" },
    { line: 30, phrase: "purveyor", definition: "an officer sent ahead to prepare for a royal arrival" },
  ],

  // ── 1.7 — Macbeth's castle (91 lines) — TIER 1 ──────────────────────
  macbeth_act1_scene7: [
    { line: 1, phrase: "If it were done when ’tis done", definition: "if the act were finished and over when it is finished — Macbeth's attempt to wish away the consequences" },
    { line: 2, phrase: "trammel up the consequence", definition: "catch and hold the consequences in a net" },
    { line: 3, phrase: "his surcease", definition: "his cessation, his stopping — i.e., Duncan's death" },
    { line: 3, phrase: "surcease", definition: "cessation; end" },
    { line: 4, phrase: "But this blow / Might be the be-all and the end-all here", definition: "if the single blow could finish it entirely — the phrase is Shakespeare's coinage" },
    { line: 5, phrase: "upon this bank and shoal of time", definition: "on this narrow strip of mortal time" },
    { line: 6, phrase: "jump the life to come", definition: "skip over what might happen in the next life (i.e., ignore damnation)" },
    { line: 8, phrase: "even-handed justice", definition: "impartial justice — that returns evil to its doer" },
    { line: 10, phrase: "Commends the ingredients of our poison’d chalice", definition: "serves us the poison we prepared for others" },
    { line: 12, phrase: "double trust", definition: "a twofold bond — as kinsman and subject, and as host" },
    { line: 14, phrase: "Strong both against the deed", definition: "twin restraints against committing the murder" },
    { line: 17, phrase: "borne his faculties so meek", definition: "exercised his powers so gently" },
    { line: 18, phrase: "clear in his great office", definition: "unstained, pure in his royal duties" },
    { line: 19, phrase: "his virtues / Will plead like angels, trumpet-tongued", definition: "Duncan's virtues will speak out against his murder with angelic eloquence" },
    { line: 21, phrase: "taking-off", definition: "removal; assassination" },
    { line: 22, phrase: "naked new-born babe", definition: "the famous image of helpless innocence; part of Macbeth's speech Cleanth Brooks reads as the play's central emblem" },
    { line: 23, phrase: "Striding the blast", definition: "riding the storm wind" },
    { line: 24, phrase: "cherubins", definition: "cherubs — angelic figures on horseback" },
    { line: 25, phrase: "sightless couriers of the air", definition: "invisible messengers of the wind" },
    { line: 26, phrase: "Shall blow the horrid deed in every eye", definition: "will blow news of the murder into every eye like pollen" },
    { line: 28, phrase: "spur", definition: "motivation; goad" },
    { line: 29, phrase: "vaulting ambition", definition: "ambition that tries to leap too high — Macbeth's famous self-diagnosis" },
    { line: 30, phrase: "o’erleaps itself", definition: "leaps too far and falls on the other side" },
    { line: 36, phrase: "bought / Golden opinions", definition: "earned golden praise and honor" },
    { line: 38, phrase: "worn now in their newest gloss", definition: "enjoyed at their brightest moment — another clothing-image" },
    { line: 41, phrase: "green and pale", definition: "sickly; hungover" },
    { line: 43, phrase: "Art thou afeard / To be the same in thine own act and valour", definition: "Lady Macbeth's attack: will you be coward in deed what you were hero in thought?" },
    { line: 44, phrase: "afeard", definition: "afraid" },
    { line: 45, phrase: "ornament of life", definition: "the crown; the highest honor" },
    { line: 47, phrase: "coward in thine own esteem", definition: "a coward in your own self-judgment" },
    { line: 45, phrase: "poor cat i’ the adage", definition: "reference to a proverb: a cat wanted fish but feared wetting its paws — accusation of pathetic indecision" },
    { line: 48, phrase: "adage", definition: "old proverb" },
    { line: 51, phrase: "break this enterprise to me", definition: "first broached this scheme to me" },
    { line: 53, phrase: "nor time nor place / Did then adhere", definition: "neither the time nor the place then suited" },
    { line: 57, phrase: "dash’d the brains out", definition: "Lady Macbeth's shocking boast: she would have killed her own nursing child rather than break an oath like his" },
    { line: 62, phrase: "screw your courage to the sticking-place", definition: "tune your courage like a crossbow string to its fastening peg — i.e., hold your nerve firmly" },
    { line: 63, phrase: "sticking-place", definition: "the notch on a crossbow holding the drawn string taut" },
    { line: 65, phrase: "chamberlains", definition: "personal attendants of the king" },
    { line: 66, phrase: "wine and wassail", definition: "wine and festive drinking" },
    { line: 66, phrase: "wassail", definition: "festive drinking" },
    { line: 67, phrase: "convince", definition: "overpower" },
    { line: 68, phrase: "receipt", definition: "recipient; vessel" },
    { line: 69, phrase: "limbeck", definition: "alembic — a distilling vessel; brain figured as an alchemist's still" },
    { line: 71, phrase: "swinish sleep", definition: "pig-like drunken slumber" },
    { line: 73, phrase: "spongy officers", definition: "the drunken chamberlains, soaked like sponges" },
    { line: 78, phrase: "bend up / Each corporal agent", definition: "tense every bodily power, as one bends a bow" },
    { line: 80, phrase: "mock the time with fairest show", definition: "deceive the world with the fairest appearance — the serpent-under-flower doctrine again" },
  ],

  // ── 2.1 — Court of Macbeth's castle (70 lines) — TIER 1 ─────────────
  macbeth_act2_scene1: [
    { line: 2, phrase: "She goes down at twelve", definition: "the moon sets at midnight" },
    { line: 5, phrase: "husbandry in heaven", definition: "economy in heaven — the stars have been 'saved' like candles" },
    { line: 6, phrase: "heavy summons", definition: "a sleepiness as weighty as an arrest warrant" },
    { line: 8, phrase: "cursed thoughts", definition: "sinful thoughts that come in sleep" },
    { line: 12, phrase: "largess to your offices", definition: "generous gifts to the household staff" },
    { line: 13, phrase: "withal", definition: "with it" },
    { line: 14, phrase: "most kind hostess", definition: "Duncan's courtesy, expressed moments before his murder — the dramatic irony is unbearable" },
    { line: 18, phrase: "franchised", definition: "free; unfettered" },
    { line: 19, phrase: "clear", definition: "unstained; pure" },
    { line: 25, phrase: "take the present time", definition: "take this current moment" },
    { line: 33, phrase: "Is this a dagger which I see before me", definition: "Macbeth's famous vision — the air forms a dagger pointing toward Duncan's chamber; the reality of the weapon is the play's core epistemological question" },
    { line: 34, phrase: "handle toward my hand", definition: "the handle turned toward my grasp" },
    { line: 36, phrase: "fatal vision", definition: "a vision that announces death; a prophecy" },
    { line: 38, phrase: "A dagger of the mind", definition: "the dagger may be a product of his own mind — Macbeth's self-interrogation" },
    { line: 39, phrase: "false creation", definition: "a deceptive fabrication" },
    { line: 40, phrase: "heat-oppressed brain", definition: "a brain overheated by anxious thought — fever was believed to cause hallucinations" },
    { line: 46, phrase: "gouts of blood", definition: "drops of blood; the dagger begins to appear bloodied" },
    { line: 46, phrase: "gouts", definition: "drops; large splashes" },
    { line: 49, phrase: "informs", definition: "takes sensory shape; forms itself visibly" },
    { line: 50, phrase: "one half-world", definition: "the half of the globe currently in night" },
    { line: 51, phrase: "wicked dreams abuse / The curtain’d sleep", definition: "evil dreams torment sleepers behind their bed-curtains" },
    { line: 52, phrase: "Witchcraft celebrates / Pale Hecate’s offerings", definition: "witchcraft performs its rites to the goddess Hecate" },
    { line: 52, phrase: "Hecate", definition: "Greek goddess of witchcraft, crossroads, and the moon; patron of the Weird Sisters" },
    { line: 54, phrase: "withered Murder", definition: "Murder personified as a thin, shrunken figure" },
    { line: 55, phrase: "Alarum’d by his sentinel, the wolf", definition: "woken by his own watchdog, the wolf — whose howl signals the hour" },
    { line: 56, phrase: "stealthy pace", definition: "silent, creeping step" },
    { line: 57, phrase: "Tarquin’s ravishing strides", definition: "like Tarquin, the Roman rapist of Lucrece — silent advance toward a bed" },
    { line: 58, phrase: "sure and firm-set earth", definition: "solid ground — Macbeth begs it not to report his steps" },
    { line: 60, phrase: "very stones prate of my whereabout", definition: "the stones may tell tales of where I am" },
    { line: 63, phrase: "knell", definition: "funeral bell — the signal Lady Macbeth will ring" },
  ],

  // ── 2.2 — The same (85 lines) — TIER 1 ──────────────────────────────
  macbeth_act2_scene2: [
    { line: 1, phrase: "quench’d them hath given me fire", definition: "the same drink that drugged the grooms has emboldened her" },
    { line: 2, phrase: "bellman", definition: "night-watchman whose bell rang at executions; here the owl cries as the bellman of death" },
    { line: 3, phrase: "fatal bellman", definition: "the owl whose cry foretells death" },
    { line: 5, phrase: "grooms", definition: "attendants at Duncan's chamber" },
    { line: 6, phrase: "possets", definition: "warm drinks of milk curdled with wine — here drugged" },
    { line: 7, phrase: "mock their charge with snores", definition: "neglect their guard-duty by snoring" },
    { line: 11, phrase: "Had he not resembled / My father as he slept", definition: "Lady Macbeth's sudden hesitation — the only crack in her resolve" },
    { line: 12, phrase: "I had done’t", definition: "I would have done it myself" },
    { line: 22, phrase: "sorry sight", definition: "painful, regrettable sight — Macbeth's bloodied hands" },
    { line: 25, phrase: "one cried, ‘God bless us!’", definition: "an involuntary blessing — and Macbeth could not reply 'Amen'" },
    { line: 30, phrase: "‘Amen’ stuck in my throat", definition: "the word of blessing refused to come — the first sign of Macbeth's spiritual ruin" },
    { line: 35, phrase: "Sleep no more", definition: "the accusing voice; 'sleep' becomes one of the play's central image-systems, denied from Macbeth onward" },
    { line: 36, phrase: "Macbeth does murder sleep", definition: "the voice's indictment — Macbeth has killed not only Duncan but sleep itself, innocence, rest" },
    { line: 36, phrase: "knits up the ravell’d sleave of care", definition: "mends the tangled threads of worry — sleep as a knitting figure" },
    { line: 36, phrase: "ravell’d sleave", definition: "tangled skein of silk" },
    { line: 37, phrase: "sore labour’s bath", definition: "the nightly washing-away of the day's toil" },
    { line: 38, phrase: "Balm of hurt minds", definition: "salve for troubled minds — sleep as medicinal ointment" },
    { line: 39, phrase: "great nature’s second course", definition: "sleep figured as the main dish of nature's feast" },
    { line: 40, phrase: "Chief nourisher in life’s feast", definition: "the most important sustenance in the banquet of life" },
    { line: 47, phrase: "Glamis hath murder’d sleep", definition: "the titles sum the man up: each of his ranks has committed a crime against rest" },
    { line: 54, phrase: "unbend your noble strength", definition: "slacken your strong resolve — she is bracing him" },
    { line: 58, phrase: "Infirm of purpose", definition: "weak in resolve — her most cutting insult" },
    { line: 59, phrase: "’Tis the eye of childhood / That fears a painted devil", definition: "only children are frightened by pictures of devils — a dismissal of his fear" },
    { line: 61, phrase: "gild the faces", definition: "smear with gold — here, blood; a grim pun" },
    { line: 62, phrase: "must seem their guilt", definition: "must look like evidence of their crime" },
    { line: 67, phrase: "What hands are here!", definition: "Macbeth sees his hands as if they are someone else's — alienation from his own body" },
    { line: 68, phrase: "Pluck out mine eyes", definition: "these hands will tear out my eyes when I see them" },
    { line: 69, phrase: "great Neptune’s ocean", definition: "all the oceans of the sea-god Neptune" },
    { line: 62, phrase: "multitudinous seas in incarnadine", definition: "turn the innumerable seas blood-red; 'incarnadine' is to make flesh-colored or blood-red" },
    { line: 70, phrase: "incarnadine", definition: "to turn blood-red; to make flesh-colored (from Latin 'caro,' flesh)" },
    { line: 71, phrase: "Making the green one red", definition: "turning the green sea to a single sheet of red" },
    { line: 76, phrase: "A little water clears us of this deed", definition: "Lady Macbeth's blithe answer; the sleepwalking scene in 5.1 will refute it" },
    { line: 82, phrase: "Wake Duncan with thy knocking", definition: "I wish the knocking could wake him — Macbeth's first moment of open remorse" },
  ],

  // ── 2.3 — The Porter scene (157 lines) ──────────────────────────────
  macbeth_act2_scene3: [
    { line: 1, phrase: "Here’s a knocking indeed!", definition: "the Porter's famous opening of the comic relief scene after the murder" },
    { line: 1, phrase: "porter of hell-gate", definition: "the Porter imagines himself as the gatekeeper of hell — casting Macbeth's castle as a literal infernal site" },
    { line: 3, phrase: "Beelzebub", definition: "chief of demons; a name for Satan" },
    { line: 3, phrase: "farmer, that hanged himself on the expectation of plenty", definition: "a farmer who hoarded grain expecting famine, hanged himself when the harvest turned good — period jokes about unscrupulous grain speculators" },
    { line: 4, phrase: "napkins enow", definition: "enough handkerchiefs (to wipe the hell-sweat)" },
    { line: 6, phrase: "equivocator", definition: "a liar by mental reservation — direct allusion to the Jesuit Henry Garnet, executed 1606 for the Gunpowder Plot; his 'Treatise of Equivocation' taught that swearing to God while reserving mental truths was not technically perjury. Shakespeare's audience would have known the reference" },
    { line: 7, phrase: "swear in both the scales against either scale", definition: "swear truly on one side of the balance and truly against it on the other — the equivocator's doctrine" },
    { line: 8, phrase: "could not equivocate to heaven", definition: "his double-tongued rhetoric didn't fool God" },
    { line: 10, phrase: "English tailor come hither, for stealing out of a French hose", definition: "a tailor who skimmed fabric from tight French trousers — a period joke about petty theft" },
    { line: 14, phrase: "I had thought to have let in some of all professions", definition: "the Porter's catalogue of the damned: farmer, equivocator, tailor — representative sinners of the time" },
    { line: 16, phrase: "second cock", definition: "the second cockcrow, around 3 a.m." },
    { line: 20, phrase: "provoker of three things", definition: "drink, which provokes (1) nose-painting, (2) sleep, (3) urine; and (4) lechery" },
    { line: 22, phrase: "nose-painting", definition: "redness of the nose from drunkenness" },
    { line: 25, phrase: "lechery, it provokes, and unprovokes", definition: "drink inflames desire but prevents performance — the Porter's bawdy physiology lesson" },
    { line: 27, phrase: "equivocates him in a sleep", definition: "puts him to sleep before he can consummate — an equivocation against lechery" },
    { line: 30, phrase: "gave thee the lie", definition: "tripped you up; knocked you down" },
    { line: 50, phrase: "timely", definition: "in good time; early" },
    { line: 55, phrase: "limited service", definition: "appointed duty" },
    { line: 62, phrase: "unruly night", definition: "a night of storms and omens" },
    { line: 65, phrase: "lamentings heard i’ the air", definition: "cries in the air — supernatural omens" },
    { line: 66, phrase: "obscure bird", definition: "the owl, bird of darkness" },
    { line: 67, phrase: "Clamour’d the livelong night", definition: "shouted all night long" },
    { line: 69, phrase: "feverous", definition: "feverish; shaking" },
    { line: 72, phrase: "O horror, horror, horror!", definition: "Macduff's cry upon finding Duncan — the triple repetition echoes the Weird Sisters' tripling" },
    { line: 76, phrase: "Lord’s anointed temple", definition: "the king's body as a consecrated holy place — regicide as sacrilege" },
    { line: 83, phrase: "new Gorgon", definition: "a new Medusa — a sight that turns viewers to stone" },
    { line: 90, phrase: "Shake off this downy sleep, death’s counterfeit", definition: "wake up; sleep is the forgery of death" },
    { line: 93, phrase: "The great doom’s image", definition: "a preview of the Last Judgment" },
    { line: 97, phrase: "Our royal master’s murder’d", definition: "the state crime named aloud" },
    { line: 109, phrase: "expedition of my violent love", definition: "the speed with which my love for Duncan overcame my judgment" },
    { line: 116, phrase: "breech’d with gore", definition: "covered up to the haft with blood — the daggers Macbeth plants on the grooms" },
    { line: 125, phrase: "auger-hole", definition: "a tiny crack; a place too small to hide in — Donalbain's image for the danger all around" },
    { line: 135, phrase: "near in blood", definition: "close kin to Duncan (and thus in danger)" },
    { line: 140, phrase: "There’s daggers in men’s smiles", definition: "Donalbain's wisdom: trust no man's face" },
  ],

  // ── 2.4 — Outside Macbeth's castle (50 lines) ───────────────────────
  macbeth_act2_scene4: [
    { line: 3, phrase: "volume of which time", definition: "sweep of history I've lived through" },
    { line: 4, phrase: "trifled former knowings", definition: "made what I knew before seem trivial" },
    { line: 6, phrase: "travelling lamp", definition: "the sun, figured as a traveling lantern" },
    { line: 8, phrase: "predominance", definition: "astrological dominance (of dark over light)" },
    { line: 10, phrase: "entomb", definition: "bury; swallow in darkness" },
    { line: 11, phrase: "towering in her pride of place", definition: "at the peak of her flight — a falcon image" },
    { line: 13, phrase: "A falcon... / Was by a mousing owl hawk’d at and kill’d", definition: "a noble falcon killed by a lowly mouse-eating owl — nature's hierarchy inverted, a portent of regicide" },
    { line: 14, phrase: "mousing owl", definition: "an owl that normally hunts mice — far below a falcon in the natural order" },
    { line: 15, phrase: "minions of their race", definition: "the finest of their breed — Duncan's horses" },
    { line: 18, phrase: "Turn’d wild in nature, broke their stalls", definition: "went mad, broke out of their stables" },
    { line: 20, phrase: "eat each other", definition: "Duncan's horses ate each other — the most monstrous of the portents" },
    { line: 27, phrase: "’gainst nature", definition: "unnatural" },
    { line: 32, phrase: "Scone", definition: "the traditional site of Scottish coronations" },
    { line: 36, phrase: "Fife", definition: "a region of eastern Scotland; Macduff's home" },
  ],

  // ── 3.1 — Forres. The palace (153 lines) ────────────────────────────
  macbeth_act3_scene1: [
    { line: 1, phrase: "Thou hast it now", definition: "Banquo's opening — Macbeth has received everything the Witches promised" },
    { line: 2, phrase: "play’dst most foully for’t", definition: "you cheated to get it" },
    { line: 3, phrase: "stand in thy posterity", definition: "remain in your descendants" },
    { line: 4, phrase: "root and father / Of many kings", definition: "Banquo to be ancestor of the future royal line — James I's lineage" },
    { line: 16, phrase: "all-thing unbecoming", definition: "wholly improper" },
    { line: 25, phrase: "Fail not our feast", definition: "don't miss the banquet — Macbeth's forced hospitality" },
    { line: 32, phrase: "twain", definition: "two" },
    { line: 37, phrase: "Our bloody cousins are bestow’d / In England and in Ireland", definition: "Duncan's sons are spread between England and Ireland" },
    { line: 45, phrase: "To be thus is nothing", definition: "to be king is worthless" },
    { line: 48, phrase: "royalty of nature", definition: "the regal nobility of Banquo's inherent character" },
    { line: 49, phrase: "dauntless temper", definition: "fearless disposition" },
    { line: 51, phrase: "My Genius is rebuked", definition: "my guardian spirit is made to feel inferior — a Plutarchan parallel with Antony before Octavius" },
    { line: 52, phrase: "Genius", definition: "attendant guardian spirit — a classical Roman concept" },
    { line: 54, phrase: "fruitless crown", definition: "a crown that will produce no heirs of his blood" },
    { line: 55, phrase: "barren sceptre", definition: "a royal rule that will leave no lineage" },
    { line: 56, phrase: "unlineal", definition: "not of his direct descent" },
    { line: 57, phrase: "No son of mine succeeding", definition: "Macbeth's deepest wound — Banquo's sons will reign, not his" },
    { line: 60, phrase: "fil’d my mind", definition: "defiled, stained my mind" },
    { line: 62, phrase: "eternal jewel / Given to the common enemy of man", definition: "given my immortal soul to the devil" },
    { line: 63, phrase: "common enemy of man", definition: "the devil" },
    { line: 76, phrase: "Fate", definition: "the Weird Sisters, now called the Fates" },
    { line: 102, phrase: "Shoughs, water-rugs, and demi-wolves", definition: "shaggy lap-dogs, rough water-dogs, and half-wolves — Macbeth's catalogue of the lowest dog breeds, shaming the murderers" },
    { line: 112, phrase: "mortal consequences", definition: "decisions that touch on death" },
    { line: 130, phrase: "common eye", definition: "public observation" },
    { line: 140, phrase: "Fleance", definition: "Banquo's son — the boy who must die with him for the prophecy to fail" },
    { line: 142, phrase: "absence", definition: "the murderers' understood term: death, removal" },
  ],

  // ── 3.2 — The palace (56 lines) ─────────────────────────────────────
  macbeth_act3_scene2: [
    { line: 6, phrase: "content", definition: "peace; happiness" },
    { line: 8, phrase: "in doubtful joy", definition: "in troubled happiness — a better condition than she now has" },
    { line: 13, phrase: "scorch’d the snake, not kill’d it", definition: "wounded but not destroyed the enemy — Banquo figured as a slashed but surviving snake" },
    { line: 14, phrase: "close", definition: "close up; heal" },
    { line: 16, phrase: "frame of things disjoint", definition: "let the whole universe fall apart" },
    { line: 17, phrase: "both the worlds suffer", definition: "let heaven and earth collapse" },
    { line: 22, phrase: "these terrible dreams / That shake us nightly", definition: "the insomnia and nightmares that torment him after Duncan's death" },
    { line: 23, phrase: "on the torture of the mind", definition: "on the rack of mental anguish" },
    { line: 27, phrase: "Gentle my lord", definition: "gentle husband" },
    { line: 29, phrase: "bend up each corporal agent", definition: "brace every bodily faculty — repeating 1.7's phrase but now in fear" },
    { line: 41, phrase: "O, full of scorpions is my mind", definition: "Macbeth's image for his poisoned thoughts" },
    { line: 46, phrase: "rooky wood", definition: "the wood where rooks gather for the night; 'rooky' also means misty/dark" },
    { line: 50, phrase: "night’s black agents", definition: "creatures that act under darkness" },
    { line: 53, phrase: "Things bad begun make strong themselves by ill", definition: "evil deeds can only be defended with more evil — Macbeth's self-doctrine" },
  ],

  // ── 3.3 — A park near the palace (32 lines) ─────────────────────────
  macbeth_act3_scene3: [
    { line: 4, phrase: "he delivers / Our offices", definition: "he hands down our instructions correctly" },
    { line: 5, phrase: "stand with us", definition: "agree with us" },
    { line: 9, phrase: "lated traveller", definition: "a late traveler caught by nightfall" },
    { line: 18, phrase: "Fly, good Fleance, fly, fly, fly!", definition: "Banquo's dying command — and the prophecy's preservation; Fleance's escape means the Stuart line will eventually reach the throne" },
    { line: 22, phrase: "Best half of our affair", definition: "the more important part of our task — killing Fleance — is lost" },
  ],

  // ── 3.4 — Hall in the palace / banquet scene (166 lines) ────────────
  macbeth_act3_scene4: [
    { line: 1, phrase: "degrees", definition: "ranks; seating order by rank" },
    { line: 3, phrase: "large in mirth", definition: "generously cheerful" },
    { line: 10, phrase: "encounter thee", definition: "meet you halfway" },
    { line: 12, phrase: "state", definition: "throne; chair of state" },
    { line: 19, phrase: "There’s blood upon thy face", definition: "Macbeth sees the murderer still bloodied from Banquo's killing" },
    { line: 27, phrase: "Whole as the marble, founded as the rock", definition: "whole as marble, firmly set as rock — Macbeth's fantasy of stability if Banquo had been killed" },
    { line: 30, phrase: "cabin’d, cribb’d, confin’d", definition: "penned, caged, trapped — three near-synonyms that intensify the claustrophobia" },
    { line: 34, phrase: "worm", definition: "young serpent — Fleance, who will grow" },
    { line: 42, phrase: "The feast is sold", definition: "a feast without welcome is a purchased meal — Lady Macbeth urging him to play the host" },
    { line: 49, phrase: "Were the graced person of our Banquo present", definition: "Macbeth's public lie — as the ghost enters and sits in his chair" },
    { line: 51, phrase: "challenge for unkindness", definition: "accuse of unfriendliness" },
    { line: 60, phrase: "Thou canst not say I did it", definition: "do not accuse me of your murder — to the ghost only he sees" },
    { line: 61, phrase: "never shake / Thy gory locks at me", definition: "don't wag your bloody hair at me" },
    { line: 67, phrase: "the air-drawn dagger", definition: "the dagger of 2.1 — Lady Macbeth reminds him of his earlier hallucination" },
    { line: 72, phrase: "flaws and starts", definition: "sudden fits and outbursts" },
    { line: 76, phrase: "ornaments", definition: "the social decorations that make a banquet — conversation, courtesy" },
    { line: 84, phrase: "Avaunt! and quit my sight!", definition: "be gone and leave my presence — Macbeth to the ghost" },
    { line: 85, phrase: "speculation", definition: "seeing sight; vision" },
    { line: 91, phrase: "Hyrcan tiger", definition: "tiger from Hyrcania, a region of ancient Persia known for fierce beasts" },
    { line: 100, phrase: "question enrages him", definition: "questioning him will only provoke him further — Lady Macbeth dismissing the guests" },
    { line: 104, phrase: "Stand not upon the order of your going", definition: "don't bother with formal departing order — just leave" },
    { line: 112, phrase: "blood will have blood", definition: "murder will be answered with murder — the play's law of revenge" },
    { line: 114, phrase: "Stones have been known to move and trees to speak", definition: "even nature will testify; the earth will not let murder stay hidden" },
    { line: 115, phrase: "Augurs", definition: "ancient Roman priests who foretold events from bird-flight" },
    { line: 116, phrase: "maggot-pies and choughs and rooks", definition: "magpies, jackdaws, and rooks — birds proverbially used in divination" },
    { line: 124, phrase: "Macduff denies his person", definition: "Macduff refuses to come to the banquet" },
    { line: 128, phrase: "betimes", definition: "early" },
    { line: 129, phrase: "weird sisters", definition: "the Fates; once more, 'weird' = wyrd/fate, NOT strange" },
    { line: 133, phrase: "in blood / Stepp’d in so far", definition: "Macbeth's famous admission: I have waded so deep in blood that going back would be as tedious as going on" },
    { line: 135, phrase: "returning were as tedious as go o’er", definition: "retreating would be as difficult as advancing" },
    { line: 139, phrase: "young in deed", definition: "beginner in evil action" },
    { line: 142, phrase: "season of all natures, sleep", definition: "seasoning of all living things — sleep; denied to Macbeth" },
  ],

  // ── 3.5 — A Heath / Hecate scene (36 lines) — authorship note ───────
  macbeth_act3_scene5: [
    { line: 2, phrase: "Hecate", definition: "Greek goddess of witchcraft and the moon; the Weird Sisters' mistress" },
    { line: 2, phrase: "angerly", definition: "angrily" },
    { line: 7, phrase: "riddles and affairs of death", definition: "mysteries and dealings concerning death" },
    { line: 11, phrase: "close contriver of all harms", definition: "the secret mastermind of all evils" },
    { line: 15, phrase: "wayward son", definition: "Macbeth, the willful human client of the Witches" },
    { line: 24, phrase: "pit of Acheron", definition: "the pit of the underworld river Acheron, in Greek myth the river of woe" },
    { line: 24, phrase: "Acheron", definition: "a river of the Greek underworld; river of woe" },
    { line: 26, phrase: "vaporous drop", definition: "a drop of charmed vapor caught from the moon" },
    { line: 28, phrase: "profound", definition: "deep-lying; pregnant with meaning" },
    { line: 30, phrase: "artificial sprites", definition: "fabricated spirits — conjured apparitions" },
    { line: 32, phrase: "security", definition: "overconfidence; false safety — the great enemy of the tragic protagonist" },
  ],

  // ── 3.6 — Forres. The palace (53 lines) ─────────────────────────────
  macbeth_act3_scene6: [
    { line: 2, phrase: "hit your thoughts", definition: "guessed what you were thinking" },
    { line: 3, phrase: "borne all things well", definition: "handled everything smoothly" },
    { line: 5, phrase: "monstrous", definition: "unnatural; abominable" },
    { line: 8, phrase: "damned fact", definition: "wicked deed" },
    { line: 13, phrase: "two delinquents", definition: "the grooms, framed as assassins" },
    { line: 20, phrase: "tyrant", definition: "the play's first direct application of the word to Macbeth — a political charge" },
    { line: 24, phrase: "due of birth", definition: "what is his by birthright" },
    { line: 27, phrase: "Edward the Confessor", definition: "saintly English king (r. 1042–1066) who welcomed Scottish exiles" },
    { line: 29, phrase: "holy king", definition: "Edward, venerated for his piety" },
    { line: 38, phrase: "sundry blessings hang about his throne", definition: "many blessings surround Edward's rule" },
    { line: 43, phrase: "ratify the work", definition: "legitimize the cause — Northumberland's support" },
    { line: 49, phrase: "cloudy messenger", definition: "surly messenger returning with bad news" },
  ],

  // ── 4.1 — A cavern (167 lines) — show of eight kings ────────────────
  macbeth_act4_scene1: [
    { line: 1, phrase: "Thrice the brinded cat hath mew’d", definition: "three times the streaked cat has cried — triple iterations are magical" },
    { line: 1, phrase: "brinded", definition: "streaked; tabby-patterned" },
    { line: 2, phrase: "hedge-pig", definition: "hedgehog" },
    { line: 3, phrase: "Harpier", definition: "the Third Witch's familiar — possibly a harpy" },
    { line: 4, phrase: "charm", definition: "enchantment; spell" },
    { line: 5, phrase: "Round about the cauldron go", definition: "the famous incantation chorus" },
    { line: 7, phrase: "Sweltered venom sleeping got", definition: "the venom that seeped out in sleep from a poisonous toad" },
    { line: 8, phrase: "Double, double toil and trouble", definition: "doubled labor, doubled trouble — the signature Witches' refrain" },
    { line: 12, phrase: "Fillet of a fenny snake", definition: "slice of a marsh-snake" },
    { line: 12, phrase: "fenny", definition: "marshy; swamp-dwelling" },
    { line: 14, phrase: "Eye of newt, and toe of frog, / Wool of bat, and tongue of dog", definition: "the catalogue of ingredients — folk-names for herbs (eye of newt = mustard seed) AND authentic animal parts; the ambiguity is deliberate" },
    { line: 15, phrase: "Adder’s fork", definition: "the forked tongue of an adder" },
    { line: 15, phrase: "blind-worm’s sting", definition: "slow-worm's supposed sting — a harmless reptile believed venomous" },
    { line: 17, phrase: "howlet’s wing", definition: "young owl's wing" },
    { line: 22, phrase: "Witches’ mummy", definition: "flesh of a dead witch, preserved" },
    { line: 23, phrase: "maw and gulf / Of the ravin’d salt-sea shark", definition: "throat and stomach of a ravening sea-shark" },
    { line: 26, phrase: "Liver of blaspheming Jew", definition: "the catalogue turns to religiously charged human-body ingredients — one of the period's ugliest moments of casual anti-Semitism, reflecting Elizabethan prejudice" },
    { line: 27, phrase: "Gall of goat", definition: "bile of a goat" },
    { line: 28, phrase: "yew", definition: "the churchyard tree; sacred to death, poisonous" },
    { line: 29, phrase: "slips of yew / Sliver’d in the moon’s eclipse", definition: "slips of yew cut during a lunar eclipse — a time of maximum magical potency" },
    { line: 32, phrase: "drab", definition: "prostitute" },
    { line: 36, phrase: "tiger’s chaudron", definition: "tiger's entrails" },
    { line: 44, phrase: "black and midnight hags", definition: "Macbeth's address to the Witches — racially and morally loaded term" },
    { line: 50, phrase: "yesty waves", definition: "foaming, yeasty waves — of the sea" },
    { line: 50, phrase: "yesty", definition: "yeasty; frothing" },
    { line: 54, phrase: "germens tumble", definition: "the seeds of life fall into confusion — let creation itself be destroyed" },
    { line: 54, phrase: "germens", definition: "seeds; germs of life" },
    { line: 60, phrase: "Nine farrow", definition: "a sow's nine piglets" },
    { line: 68, phrase: "secret, black, and midnight hags", definition: "repeated epithet emphasizing the Witches' darkness" },
    { line: 69, phrase: "art", definition: "magic" },
    { line: 72, phrase: "be bloody, bold, and resolute", definition: "the First Apparition's instruction — partial truth that will betray him" },
    { line: 75, phrase: "Birnam wood", definition: "a forest near Dunsinane; the Third Apparition's prophecy that it will 'come to Dunsinane' seems impossible — until Malcolm's soldiers carry branches" },
    { line: 72, phrase: "none of woman born", definition: "the Second Apparition's crucial prophecy — later betrayed by Macduff, 'from his mother's womb untimely ripp’d' (Caesarean birth)" },
    { line: 90, phrase: "impress the forest", definition: "conscript a tree" },
    { line: 110, phrase: "show of eight kings", definition: "the procession of Banquo's descendants — direct flattery of James I, who claimed descent from Banquo; the eighth held a mirror that in original performance reflected James himself" },
    { line: 112, phrase: "sear my eyeballs", definition: "scorch my eyes — the sight is unbearable to Macbeth" },
    { line: 119, phrase: "twofold balls and treble sceptres", definition: "double coronation orbs and triple sceptres — direct reference to James's multiple crowns (England, Scotland, and the claim to France)" },
    { line: 124, phrase: "blood-bolter’d Banquo", definition: "Banquo with his hair matted with blood — Scottish dialect" },
  ],

  // ── 4.2 — Fife. Macduff's castle (91 lines) ─────────────────────────
  macbeth_act4_scene2: [
    { line: 3, phrase: "patience", definition: "endurance; acceptance" },
    { line: 7, phrase: "title", definition: "legitimate claim (as a husband)" },
    { line: 14, phrase: "wisdom leaves us", definition: "abandons us" },
    { line: 22, phrase: "cousin", definition: "kinsman — Ross to Lady Macduff" },
    { line: 28, phrase: "Sirrah", definition: "address to a child or social inferior" },
    { line: 30, phrase: "How wilt thou live?", definition: "Lady Macduff's cruel teasing of her son about losing his father" },
    { line: 34, phrase: "the pitfall, nor the gin", definition: "the trap, nor the snare — bird-hunting images" },
    { line: 35, phrase: "gin", definition: "snare; trap" },
    { line: 58, phrase: "Every one that does so is a traitor, and must be hanged", definition: "the son's deadpan logic about swearing oaths — shocking innocence" },
    { line: 66, phrase: "this murderous shaft that’s shot", definition: "the assassination arrow already in flight — Rosse's warning metaphor" },
    { line: 78, phrase: "fell cruelty", definition: "deadly cruelty — the same 'fell' used by Lady Macbeth in 1.5" },
    { line: 80, phrase: "womanly defence", definition: "the plea of the defenseless" },
    { line: 83, phrase: "shag-hair’d villain", definition: "shaggy-haired cutthroat — the murderer attacks her son first" },
  ],

  // ── 4.3 — England. Before the King's palace (278 lines) ─────────────
  macbeth_act4_scene3: [
    { line: 3, phrase: "mortal sword", definition: "deadly weapon" },
    { line: 5, phrase: "Bestride our down-fall’n birthdom", definition: "stand astride our fallen homeland — defend it" },
    { line: 5, phrase: "birthdom", definition: "birthplace; native land" },
    { line: 6, phrase: "new widows howl, new orphans cry", definition: "the daily cost of Macbeth's tyranny" },
    { line: 12, phrase: "redress", definition: "remedy; put right" },
    { line: 18, phrase: "honest", definition: "faithful; true" },
    { line: 22, phrase: "rawness", definition: "exposed vulnerability — Malcolm questions why Macduff left his family unprotected" },
    { line: 30, phrase: "affeer’d", definition: "confirmed; ratified" },
    { line: 35, phrase: "I have lost my hopes", definition: "Macduff's despair that Malcolm mistrusts him" },
    { line: 40, phrase: "Let not my jealousies be your dishonors", definition: "don't take my suspicions as insults" },
    { line: 44, phrase: "Fare thee well, lord", definition: "Macduff preparing to leave in disgust" },
    { line: 50, phrase: "sheath’d their swords", definition: "put away their weapons" },
    { line: 53, phrase: "grafted", definition: "ingrained; implanted" },
    { line: 57, phrase: "confineless harms", definition: "boundless evils" },
    { line: 59, phrase: "grant him bloody", definition: "admit that he is bloody — Malcolm's argument that he himself has worse vices than Macbeth (a test of Macduff's loyalty)" },
    { line: 61, phrase: "Luxurious, avaricious, false, deceitful", definition: "lustful, greedy, lying, deceptive — Malcolm's false self-portrait" },
    { line: 67, phrase: "cistern of my lust", definition: "my lust's reservoir — Malcolm's hyperbolic self-accusation" },
    { line: 70, phrase: "cold in pleasure", definition: "cold in sensual appetite" },
    { line: 76, phrase: "Boundless intemperance / In nature is a tyranny", definition: "unrestrained appetite in a ruler is tyranny" },
    { line: 80, phrase: "sudden", definition: "violent; headlong" },
    { line: 85, phrase: "stanchless avarice", definition: "unstoppable greed" },
    { line: 88, phrase: "summer-seeming lust", definition: "the lust of summer — youthful and passing" },
    { line: 92, phrase: "Of your mere own", definition: "from your own estates alone" },
    { line: 100, phrase: "king-becoming graces", definition: "the virtues proper to a king" },
    { line: 101, phrase: "Justice, verity, temp’rance, stableness", definition: "Malcolm's list of royal virtues" },
    { line: 110, phrase: "Uproar the universal peace", definition: "throw the world's peace into chaos" },
    { line: 112, phrase: "Fit to govern! / No, not to live!", definition: "Macduff's explosion — not even fit to live" },
    { line: 122, phrase: "black scruples", definition: "dark doubts" },
    { line: 125, phrase: "reconciled my thoughts", definition: "brought my thinking into harmony" },
    { line: 129, phrase: "Unknown to woman", definition: "never slept with a woman" },
    { line: 138, phrase: "Old Siward", definition: "the English earl leading the forces against Macbeth" },
    { line: 140, phrase: "warranted quarrel", definition: "legitimate cause" },
    { line: 150, phrase: "King's evil", definition: "scrofula — a disease believed curable by the touch of a legitimate king; Edward the Confessor's power proved his divine right, implicitly opposed to Macbeth's illegitimacy" },
    { line: 155, phrase: "mere despair", definition: "utter hopelessness" },
    { line: 160, phrase: "Hanging a golden stamp about their necks", definition: "hanging the 'angel' coin on threads — the ritual of royal touch-healing" },
    { line: 175, phrase: "cap’d to", definition: "greeted with doffed hats" },
    { line: 180, phrase: "fee-grief", definition: "a private, personal grief" },
    { line: 190, phrase: "all my pretty ones", definition: "Macduff's cry over his murdered children — one of Shakespeare's most piercing lines" },
    { line: 194, phrase: "dam", definition: "mother bird (or animal)" },
    { line: 198, phrase: "He has no children", definition: "famously ambiguous: said of Malcolm (who cannot understand) or of Macbeth (no retribution by death of sons possible)" },
    { line: 207, phrase: "Naught that I am", definition: "wretch that I am" },
    { line: 210, phrase: "whet-stone", definition: "grindstone — Malcolm urging Macduff to sharpen his sword on his grief" },
    { line: 218, phrase: "Dispute it like a man", definition: "endure it with a man's fortitude — Malcolm's bracing advice" },
    { line: 220, phrase: "feel it as a man", definition: "Macduff's famous reply — grief demands a man's feeling, not a man's stoicism" },
    { line: 235, phrase: "Our lack is nothing but our leave", definition: "we lack nothing but permission to depart" },
  ],

  // ── 5.1 — Sleepwalking scene (64 lines) — TIER 1 ────────────────────
  macbeth_act5_scene1: [
    { line: 1, phrase: "watched", definition: "stayed awake; kept vigil" },
    { line: 6, phrase: "perturbation in nature", definition: "disturbance of the natural order" },
    { line: 7, phrase: "benefit of sleep", definition: "restorative effect of sleep" },
    { line: 8, phrase: "effects of watching", definition: "actions of a waking person" },
    { line: 17, phrase: "guise", definition: "appearance; manner" },
    { line: 21, phrase: "taper", definition: "candle" },
    { line: 22, phrase: "open sense", definition: "eyes open but unseeing" },
    { line: 26, phrase: "accustomed action", definition: "habitual motion — her obsessive hand-washing" },
    { line: 33, phrase: "One: two: why, then, ’tis time to do’t", definition: "the striking of a clock — the hour of Duncan's murder relived" },
    { line: 34, phrase: "Hell is murky", definition: "Lady Macbeth's reversal — the same woman who mocked Macbeth's fear of hell now sees into it" },
    { line: 36, phrase: "afeard", definition: "afraid" },
    { line: 38, phrase: "who would have thought the old man to have had so much blood in him", definition: "the appalled wonder of 2.2 returning in her disordered sleep" },
    { line: 42, phrase: "Thane of Fife", definition: "Macduff" },
    { line: 45, phrase: "No more o’ that", definition: "stop — the subjects she cannot bear to remember" },
    { line: 49, phrase: "Out, damned spot! out, I say!", definition: "the sleepwalking scene's central line; the stain she dismissed in 2.2 cannot be washed out — the water cannot clear her of the deed" },
    { line: 49, phrase: "damned spot", definition: "the bloodstain she cannot remove; the moral mark now physically visible to her alone" },
    { line: 52, phrase: "Fie, my lord, fie", definition: "for shame, my lord — her voice from 2.2" },
    { line: 35, phrase: "all the perfumes of Arabia", definition: "Arabia's famed spices cannot sweeten her little hand — the finest luxuries of the Renaissance world inadequate to the stain of regicide" },
    { line: 59, phrase: "sigh", definition: "audible sigh escaping her" },
    { line: 62, phrase: "dignity of the whole body", definition: "the nobility of her whole person" },
    { line: 65, phrase: "Unnatural deeds do breed unnatural troubles", definition: "the Doctor's diagnosis: unnatural crimes produce unnatural consequences (sleepwalking, insomnia, madness)" },
    { line: 66, phrase: "infected minds / To their deaf pillows will discharge their secrets", definition: "guilty minds will confess their secrets to unlistening pillows" },
    { line: 68, phrase: "divine", definition: "a priest — not a physician, but a confessor, is what she needs" },
  ],

  // ── 5.2 — The country near Dunsinane (37 lines) ─────────────────────
  macbeth_act5_scene2: [
    { line: 3, phrase: "Near Birnam wood / Shall we well meet them", definition: "the English forces and Scottish rebels converging" },
    { line: 6, phrase: "unrough youths", definition: "boys too young for beards — soldiers fighting for the first time" },
    { line: 9, phrase: "Great Dunsinane", definition: "the hill-fortress in Perthshire, Macbeth's stronghold" },
    { line: 10, phrase: "minutely revolts", definition: "minute-by-minute defections" },
    { line: 11, phrase: "upbraid his faith-breach", definition: "reproach him for his broken faith" },
    { line: 12, phrase: "Now does he feel his title / Hang loose about him, like a giant’s robe / Upon a dwarfish thief", definition: "the clothing image returns — Macbeth's royal title fits him badly; he has stolen a giant's robe and cannot fill it" },
    { line: 13, phrase: "giant’s robe / Upon a dwarfish thief", definition: "Macbeth's illegitimate kingship figured as oversized stolen clothing — Cleanth Brooks's 'cloak of manliness'" },
    { line: 20, phrase: "medicine of the sickly weal", definition: "medicine for the ailing state — Malcolm as the remedy for the body politic" },
    { line: 20, phrase: "sickly weal", definition: "sick commonwealth; diseased state" },
    { line: 23, phrase: "dew the sovereign flower", definition: "water the royal (Malcolm), the flower of sovereignty" },
  ],

  // ── 5.3 — Dunsinane. A room in the castle (68 lines) ────────────────
  macbeth_act5_scene3: [
    { line: 1, phrase: "flying", definition: "fleeing" },
    { line: 2, phrase: "taint with fear", definition: "be tainted by fear" },
    { line: 8, phrase: "cream-fac’d loon", definition: "pale-faced fool" },
    { line: 9, phrase: "goose look", definition: "cowardly, silly expression" },
    { line: 10, phrase: "lily-liver’d", definition: "cowardly — a coward's liver was thought to be pale" },
    { line: 11, phrase: "linen cheeks", definition: "cheeks white as linen" },
    { line: 19, phrase: "push / Will cheer me ever, or disseat me now", definition: "this assault will either raise me up or unseat me forever" },
    { line: 22, phrase: "way of life / Is fall’n into the sear, the yellow leaf", definition: "Macbeth's autumnal self-image — his life has entered the sere (withered) season" },
    { line: 22, phrase: "sear, the yellow leaf", definition: "dry, yellowed leaf — the late autumn of a life" },
    { line: 24, phrase: "honour, love, obedience, troops of friends", definition: "the things old age should command — denied to him" },
    { line: 26, phrase: "mouth-honour", definition: "lip-service; hollow, formal praise" },
    { line: 30, phrase: "skirr the country round", definition: "scour the countryside" },
    { line: 36, phrase: "thick-coming fancies", definition: "crowding visions; hallucinations" },
    { line: 40, phrase: "Canst thou not minister to a mind diseas’d", definition: "can you not treat a sick mind? — Macbeth's plea for Lady Macbeth's cure" },
    { line: 41, phrase: "rooted sorrow", definition: "deeply planted grief" },
    { line: 42, phrase: "written troubles of the brain", definition: "the inscribed anxieties in the mind" },
    { line: 44, phrase: "antidote", definition: "remedy" },
    { line: 45, phrase: "sweet oblivious antidote", definition: "a drug to bring sweet forgetfulness" },
    { line: 46, phrase: "Cleanse the stuff’d bosom", definition: "purify the clogged heart" },
    { line: 48, phrase: "Throw physic to the dogs", definition: "throw medicine to the dogs — I'll have none of it" },
    { line: 50, phrase: "cast / The water of my land", definition: "diagnose the health of my kingdom, as a doctor examines urine" },
  ],

  // ── 5.4 — Country near Birnam wood (27 lines) ───────────────────────
  macbeth_act5_scene4: [
    { line: 4, phrase: "chambers", definition: "private rooms — where Scots will sleep safely once Macbeth is deposed" },
    { line: 6, phrase: "Let every soldier hew him down a bough", definition: "Malcolm's masterstroke — each soldier cuts a branch to disguise the army's numbers; Birnam wood will literally come to Dunsinane" },
    { line: 7, phrase: "bear’t before him", definition: "carry it in front of him" },
    { line: 9, phrase: "discovery", definition: "observation; reconnaissance" },
    { line: 16, phrase: "setting down before’t", definition: "beginning a siege" },
    { line: 19, phrase: "rate", definition: "reason" },
    { line: 21, phrase: "Let our just censures / Attend the true event", definition: "reserve judgment until the outcome is known" },
  ],

  // ── 5.5 — Tomorrow speech (54 lines) — TIER 1 ───────────────────────
  macbeth_act5_scene5: [
    { line: 1, phrase: "banners on the outward walls", definition: "battle flags displayed defiantly on the castle's outer walls" },
    { line: 3, phrase: "laugh a siege to scorn", definition: "mock any siege; defy it" },
    { line: 4, phrase: "ague", definition: "fever — starvation and sickness will destroy the besiegers" },
    { line: 8, phrase: "A cry of women within", definition: "offstage wailing — the women lamenting Lady Macbeth's death" },
    { line: 10, phrase: "cool’d / To hear a night-shriek", definition: "would have turned cold at a night-cry" },
    { line: 13, phrase: "supp’d full with horrors", definition: "Macbeth's most chilling self-diagnosis: I have had my fill of horrors — they cannot move me anymore" },
    { line: 14, phrase: "Direness, familiar to my slaughterous thoughts", definition: "dreadful things have become familiar to my murderous mind" },
    { line: 15, phrase: "The queen, my lord, is dead", definition: "Seyton's terse announcement — Lady Macbeth's death delivered as a bureaucratic report" },
    { line: 16, phrase: "She should have died hereafter", definition: "she should have died some time later — Macbeth's flat, disordered response; the phrase is deliberately unanchored" },
    { line: 17, phrase: "time for such a word", definition: "a proper occasion for (announcing) such a thing" },
    { line: 18, phrase: "To-morrow, and to-morrow, and to-morrow", definition: "the play's nihilist anthem; time as mechanical repetition, drained of meaning" },
    { line: 19, phrase: "petty pace", definition: "a small, trivial pace — life figured as a minor stride across time" },
    { line: 20, phrase: "last syllable of recorded time", definition: "the very end of all history" },
    { line: 21, phrase: "all our yesterdays", definition: "every past day" },
    { line: 22, phrase: "dusty death", definition: "the extinction of death — reducing the body to dust" },
    { line: 22, phrase: "brief candle", definition: "life as a short-burning candle — a classic emblem" },
    { line: 23, phrase: "walking shadow", definition: "life as a mere shadow that walks — insubstantial, mimic of reality" },
    { line: 23, phrase: "poor player", definition: "unskilled actor; pathetic performer" },
    { line: 24, phrase: "struts and frets his hour upon the stage", definition: "swaggers and worries for his brief stage time — life as a bad theatrical performance" },
    { line: 26, phrase: "a tale / Told by an idiot, full of sound and fury", definition: "life as a noisy, meaningless narration — from which Faulkner took his novel title" },
    { line: 27, phrase: "Signifying nothing", definition: "meaning nothing at all — the speech's most famous phrase; the end of meaning itself" },
    { line: 32, phrase: "The wood began to move", definition: "Birnam wood advancing to Dunsinane — the prophecy beginning to fulfill" },
    { line: 33, phrase: "Liar and slave!", definition: "Macbeth refuses the messenger's report — still in denial" },
    { line: 38, phrase: "cling thee", definition: "shrivel; waste you away (from starvation)" },
    { line: 41, phrase: "the equivocation of the fiend", definition: "the devil's double-speaking — the Witches' prophecy was literal but misleading" },
    { line: 42, phrase: "lies like truth", definition: "falsehood that has the appearance of truth" },
    { line: 45, phrase: "I ’gin to be aweary of the sun", definition: "I begin to grow weary of daylight itself" },
    { line: 46, phrase: "wish the estate o’ the world were now undone", definition: "wish the ordered state of the world undone — the Witches' 1.1 paradox completing itself" },
    { line: 49, phrase: "alarum-bell", definition: "the bell that rings the call to arms" },
    { line: 49, phrase: "wrack", definition: "destruction; ruin" },
    { line: 50, phrase: "harness", definition: "armor" },
  ],

  // ── 5.6 — Before the castle (11 lines) ──────────────────────────────
  macbeth_act5_scene6: [
    { line: 1, phrase: "leafy screens", definition: "the branches cut from Birnam wood, now used as camouflage" },
    { line: 4, phrase: "battle", definition: "division of the army" },
    { line: 7, phrase: "order of battle", definition: "arrangement of troops" },
    { line: 9, phrase: "harbingers of blood", definition: "announcers of the coming slaughter" },
  ],

  // ── 5.7 — Another part of the field (35 lines) ──────────────────────
  macbeth_act5_scene7: [
    { line: 1, phrase: "They have tied me to a stake", definition: "Macbeth figuring himself as a bear tied to a stake — a reference to bear-baiting, a popular Elizabethan entertainment" },
    { line: 2, phrase: "bear-like", definition: "like a tethered bear — forced to fight" },
    { line: 4, phrase: "none of woman born", definition: "repeated prophecy — still taken literally" },
    { line: 10, phrase: "Young Siward", definition: "the English general's son — his first and last battle" },
    { line: 18, phrase: "kerns", definition: "Irish foot-soldiers; here, hired mercenaries Macbeth leads" },
    { line: 22, phrase: "Let me find him, fortune!", definition: "Macduff's prayer — fortune lead him to Macbeth" },
    { line: 25, phrase: "my wife and children’s ghosts", definition: "the murdered family Macduff will avenge" },
  ],

  // ── 5.8 — Another part of the field (86 lines) ──────────────────────
  macbeth_act5_scene8: [
    { line: 2, phrase: "Roman fool", definition: "a Stoic suicide in the classical manner — Macbeth rejects suicide" },
    { line: 3, phrase: "die / On mine own sword", definition: "fall on my sword (to avoid capture) — but he refuses" },
    { line: 8, phrase: "terms can give thee out", definition: "words can describe you" },
    { line: 10, phrase: "my soul is too much charged / With blood of thine already", definition: "Macbeth's conscience over killing Macduff's family" },
    { line: 12, phrase: "have at thee", definition: "formal challenge — here I come at you" },
    { line: 15, phrase: "intrenchant air", definition: "air that cannot be cut — Macbeth's bravado about his charmed life" },
    { line: 16, phrase: "impress", definition: "mark; wound" },
    { line: 17, phrase: "vulnerable crests", definition: "heads that can be hurt (i.e., other men)" },
    { line: 18, phrase: "I bear a charmed life", definition: "Macbeth's still-confident boast — about to be shattered" },
    { line: 19, phrase: "must not yield to one of woman born", definition: "Macbeth's final clutch at the Second Apparition's prophecy" },
    { line: 20, phrase: "Despair thy charm", definition: "Macduff's revelation — give up believing in the charm" },
    { line: 21, phrase: "angel whom thou still hast served", definition: "the dark angel (devil) Macbeth has served — called to give him the truth" },
    { line: 22, phrase: "Macduff was from his mother’s womb / Untimely ripp’d", definition: "Caesarean birth — Macduff was not born in the ordinary sense; the Witches' equivocation is sprung" },
    { line: 23, phrase: "untimely ripp’d", definition: "cut out before birth (by Caesarean section)" },
    { line: 28, phrase: "juggling fiends", definition: "the Witches — deceitful devils who play with words" },
    { line: 29, phrase: "palter with us in a double sense", definition: "deceive us with double meanings" },
    { line: 30, phrase: "keep the word of promise to our ear, / And break it to our hope", definition: "keep promises literally while violating their spirit — equivocation again" },
    { line: 35, phrase: "yield, coward", definition: "surrender, coward — Macduff's dare" },
    { line: 38, phrase: "baited with the rabble’s curse", definition: "tormented by the mob's hatred" },
    { line: 40, phrase: "Before my body / I throw my warlike shield", definition: "Macbeth's last flash of his old courage" },
    { line: 41, phrase: "Lay on, Macduff", definition: "strike — Macbeth's final command to his killer" },
    { line: 42, phrase: "And damn’d be him that first cries, ‘Hold, enough!", definition: "cursed be the first to surrender — Macbeth dies with a soldier's oath" },
    { line: 55, phrase: "free hearts", definition: "liberated; uncompromised" },
    { line: 56, phrase: "thanks to each and all", definition: "Malcolm's first royal address" },
    { line: 58, phrase: "Thanes and kinsmen, / Henceforth be earls", definition: "Malcolm's creation of Scotland's first earldoms — a historical innovation" },
    { line: 60, phrase: "honour nam’d", definition: "first named with such an honor" },
    { line: 65, phrase: "What’s more to do, / Which would be planted newly with the time", definition: "whatever else must be done as a new era begins" },
    { line: 68, phrase: "ministers / Of this dead butcher and his fiend-like queen", definition: "Macduff's final epithets for Macbeth and Lady Macbeth — butcher and fiend-like" },
    { line: 70, phrase: "Who, as ’tis thought, by self and violent hands / Took off her life", definition: "Lady Macbeth's suicide, reported rather than seen" },
    { line: 72, phrase: "by the grace of Grace", definition: "by the grace of God — the new reign will be godly" },
    { line: 75, phrase: "Scone", definition: "the coronation-site of Scottish kings — the new reign begins where 2.4 left off" },
  ],
};

// ── Auto-locator (same pattern as Othello) ──────────────────────────────────

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
  const hintLine = lines.find((l) => l.number === hint);
  if (hintLine && normalize(hintLine.text).includes(normPhrase)) return hint;
  for (let delta = 1; delta <= 12; delta++) {
    for (const sign of [-1, 1] as const) {
      const n = hint + sign * delta;
      const l = lines.find((x) => x.number === n);
      if (l && normalize(l.text).includes(normPhrase)) return n;
    }
  }
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
        console.warn(`  ${sectionId}: cannot locate "${g.phrase}"`);
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
