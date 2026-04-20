/**
 * King Lear — supplementary glosses that APPEND to the per-act arrays
 * populated by the base data modules. Loaded after the per-act files, so
 * these entries simply extend coverage without reshaping the seeds.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {
  const append = (id: string, extra: SeedGloss[]) => {
    GLOSSES[id] = [...(GLOSSES[id] ?? []), ...extra];
  };

  // ── 1.2 — Gloucester's castle (bonus) ────────────────────────────────
  append("king_lear_act1_scene2", [
    { line: 35, phrase: "Come, sir, despatch", definition: "hurry — Gloucester's impatient demand" },
    { line: 50, phrase: "to no further pretence of danger", definition: "no further apparent danger — Edmund pretending to protect Edgar" },
    { line: 55, phrase: "run a certain course", definition: "take a predictable path" },
    { line: 75, phrase: "auricular assurance", definition: "evidence of the ears; firsthand hearing" },
    { line: 90, phrase: "These late eclipses", definition: "recent eclipses — the 1605 eclipses Gloucester reads as portents" },
    { line: 95, phrase: "portend no good", definition: "forecast misfortune" },
    { line: 100, phrase: "mutinies", definition: "civil disorders; uprisings" },
    { line: 101, phrase: "discord", definition: "disharmony; conflict" },
    { line: 115, phrase: "evil-eyed", definition: "malicious; giving the evil eye" },
    { line: 118, phrase: "diffidences", definition: "distrusts" },
    { line: 125, phrase: "natural", definition: "literal-biological (as opposed to legitimate) — Edmund's pun on his status" },
    { line: 128, phrase: "fi, fa, fa, la", definition: "nonsense syllables — a scrap of song Edmund sings to mask his thought" },
    { line: 132, phrase: "pat", definition: "on cue; just in time" },
    { line: 135, phrase: "a catastrophe of the old comedy", definition: "a comic denouement — Edmund treating his deception as theatrical" },
    { line: 138, phrase: "my cue", definition: "my role's line — theatrical metaphor for his cold planning" },
  ]);

  // ── 1.3 — Albany's palace (bonus) ────────────────────────────────────
  append("king_lear_act1_scene3", [
    { line: 4, phrase: "his fool", definition: "the Fool — Lear's licensed jester" },
    { line: 10, phrase: "to-night", definition: "tonight" },
    { line: 18, phrase: "abused", definition: "wronged; mistreated" },
    { line: 20, phrase: "prate", definition: "chatter; babble" },
    { line: 24, phrase: "old fools are babes again", definition: "proverb — the old become children a second time" },
    { line: 25, phrase: "check as flatteries", definition: "rebukes as the flatteries they really are" },
    { line: 27, phrase: "old men are twice children", definition: "Goneril's cold proverb of second childhood" },
  ]);

  // ── 1.5 — Court before Albany's palace (bonus) ───────────────────────
  append("king_lear_act1_scene5", [
    { line: 5, phrase: "demand out of the letter", definition: "any question Regan might ask based on my letter" },
    { line: 8, phrase: "forestall", definition: "beat there before us" },
    { line: 14, phrase: "set the world on", definition: "begin at" },
    { line: 18, phrase: "crab's a crab", definition: "a crab-apple's always a crab-apple — the Fool's riddle about Regan resembling Goneril" },
    { line: 25, phrase: "snail has a house", definition: "the Fool's riddle — the snail keeps its shell; Lear gave his away" },
    { line: 32, phrase: "seven stars", definition: "the Pleiades — the Fool's riddle (why seven? because they are not eight)" },
    { line: 37, phrase: "she that's a maid now", definition: "the Fool's final parting jest — a maid who laughs at Lear's departure won't be a maid long" },
  ]);

  // ── 2.1 — Gloucester's castle (bonus) ────────────────────────────────
  append("king_lear_act2_scene1", [
    { line: 8, phrase: "ear-kissing", definition: "whispered secretly" },
    { line: 18, phrase: "toward", definition: "in prospect; coming" },
    { line: 28, phrase: "briefness and fortune", definition: "speed and luck" },
    { line: 40, phrase: "Beggar!", definition: "Edmund's cry to alert Gloucester of Edgar's 'flight'" },
    { line: 42, phrase: "Fly, brother", definition: "Edmund pretending concern for Edgar" },
    { line: 46, phrase: "my quarrel", definition: "my supposed dispute with Edgar" },
    { line: 50, phrase: "maidens’ hearts", definition: "sworn inviolable trust — Edgar 'swore by'" },
    { line: 53, phrase: "thunder-master", definition: "Jupiter" },
    { line: 62, phrase: "My lord, I know not how much you may be bolden’d", definition: "Edmund's false reluctance to speak" },
    { line: 67, phrase: "loath’d villain", definition: "detested scoundrel — Edmund's self-described pose" },
    { line: 75, phrase: "dispatch", definition: "kill" },
    { line: 85, phrase: "ports I’ll bar", definition: "I'll block the harbors" },
    { line: 95, phrase: "o’ the coast", definition: "over the country" },
    { line: 100, phrase: "capable of my land", definition: "able to inherit — the play's second moment of a child supplanting the heir" },
    { line: 110, phrase: "prize", definition: "reward" },
    { line: 115, phrase: "worthy arch and patron", definition: "Edmund's flattery of Cornwall" },
    { line: 120, phrase: "childlike", definition: "filial; proper to a son" },
  ]);

  // ── 2.2 — Before Gloucester's castle (bonus) ─────────────────────────
  append("king_lear_act2_scene2", [
    { line: 3, phrase: "i’ the mire", definition: "in the mud" },
    { line: 5, phrase: "Lipsbury pinfold", definition: "invented proverbial enclosure — Kent's 'I'd beat you in any arena'" },
    { line: 10, phrase: "cullionly", definition: "base; rascally" },
    { line: 30, phrase: "sop o’ the moonshine", definition: "a bread-sop soaked in moonlight — Kent will beat Oswald into such a piece" },
    { line: 35, phrase: "carbonado", definition: "a meat slashed for grilling — Kent threatens to cut Oswald's shanks that way" },
    { line: 45, phrase: "if I had thee in Lipsbury pinfold", definition: "Kent's threat of a total beating anywhere he could corner Oswald" },
    { line: 50, phrase: "bepiss’d", definition: "soiled with urine — Kent's full-spectrum insults" },
    { line: 60, phrase: "prank", definition: "mischief" },
    { line: 70, phrase: "Smile you my speeches", definition: "do you smile at my words (Oswald smirks; Kent rages)" },
    { line: 78, phrase: "Ajax is their fool", definition: "Kent's reference — compared to these villains, the Homeric Ajax looks foolish" },
    { line: 85, phrase: "the common pattern", definition: "typical currency" },
    { line: 92, phrase: "plain knaves", definition: "open scoundrels — Kent preferring blunt knavery to courtly deceit" },
    { line: 100, phrase: "honest knave", definition: "bluntly honest servant" },
    { line: 110, phrase: "Phoebus’ front", definition: "the sun-god's brow — Kent mocking Cornwall's pompous oath by dialect" },
    { line: 122, phrase: "camelot", definition: "a place name in the North — Kent's deliberately obscure location" },
    { line: 133, phrase: "reverence", definition: "respect due to age — the kind Kent's stocking insults" },
    { line: 145, phrase: "slack of former services", definition: "servants not serving the king as before" },
    { line: 155, phrase: "weary", definition: "exhausted" },
  ]);

  // ── 2.3 — A wood (bonus) ─────────────────────────────────────────────
  append("king_lear_act2_scene3", [
    { line: 5, phrase: "proclaim’d", definition: "publicly declared an outlaw" },
    { line: 7, phrase: "escape", definition: "flee" },
    { line: 8, phrase: "no port is free", definition: "every harbor is watched — no exit from Britain" },
    { line: 10, phrase: "attending", definition: "awaiting — hunters looking for Edgar" },
    { line: 12, phrase: "preserve", definition: "protect" },
    { line: 16, phrase: "elf", definition: "tangle into elf-locks — matted hair as if by fairies" },
    { line: 18, phrase: "elf all my hair in knots", definition: "tangle hair into mats — a Bedlam-beggar trait" },
    { line: 19, phrase: "object", definition: "sight; appearance" },
  ]);

  // ── 2.4 — Before Gloucester's castle (bonus) ─────────────────────────
  append("king_lear_act2_scene4", [
    { line: 1, phrase: "strange", definition: "unexpected" },
    { line: 15, phrase: "hands tied by the head", definition: "the Fool's riddle begins — animals tied at various parts" },
    { line: 20, phrase: "nether-stocks", definition: "lower stockings — the Fool's pun on Kent in the stocks" },
    { line: 30, phrase: "Fortune, that arrant whore", definition: "fortune personified as a strumpet — the Fool's satirical theology" },
    { line: 42, phrase: "chok’d", definition: "cut off in mid-word" },
    { line: 48, phrase: "meiny", definition: "household retinue" },
    { line: 65, phrase: "her gall", definition: "her bile — seat of bitterness" },
    { line: 70, phrase: "mumbling", definition: "muttering" },
    { line: 85, phrase: "blanket my loins", definition: "I will wear a blanket for modesty, Lear's reduction imagined" },
    { line: 105, phrase: "o’erfraught", definition: "over-freighted; over-loaded" },
    { line: 115, phrase: "naughty", definition: "wicked — stronger in Jacobean usage than its modern sense" },
    { line: 125, phrase: "fetches", definition: "pretexts; excuses" },
    { line: 140, phrase: "images of revolt", definition: "rebel appearances" },
    { line: 150, phrase: "No flesh but mine", definition: "no kin but me" },
    { line: 165, phrase: "taking", definition: "pestilence; blasting influence" },
    { line: 175, phrase: "nimble lightnings", definition: "quick flashes" },
    { line: 185, phrase: "fen-suck’d fogs", definition: "marsh-bred miasmas — seen as disease agents" },
    { line: 195, phrase: "blast", definition: "sear with disease" },
    { line: 210, phrase: "tender-hefted", definition: "gently constituted" },
    { line: 220, phrase: "oppose the bolt", definition: "stand against the thunderbolt — hostile resistance" },
    { line: 235, phrase: "scant my sizes", definition: "cut back my allowances — Lear on Regan's imagined future meanness" },
    { line: 245, phrase: "abated", definition: "reduced" },
    { line: 260, phrase: "offices of nature", definition: "natural kinship duties" },
    { line: 275, phrase: "reason not the need", definition: "do not calculate necessity — Lear's protest" },
    { line: 285, phrase: "superfluous", definition: "having more than necessity requires — Lear's claim about human dignity" },
    { line: 295, phrase: "patience", definition: "endurance — the virtue Lear cannot muster" },
    { line: 305, phrase: "unnatural hags", definition: "Lear's final name for his daughters" },
    { line: 318, phrase: "Shut up your doors", definition: "Regan's command — the castle closes against the storm and Lear with it" },
  ]);

  // ── 3.1 — A heath (bonus) ────────────────────────────────────────────
  append("king_lear_act3_scene1", [
    { line: 3, phrase: "tears his white hair", definition: "Lear ripping his own hair in the storm" },
    { line: 10, phrase: "to-and-fro-conflicting wind and rain", definition: "the storm battering from all sides" },
    { line: 22, phrase: "servants", definition: "spies among the servants" },
    { line: 28, phrase: "speculations", definition: "intelligence-gatherers" },
    { line: 38, phrase: "scatter’d kingdom", definition: "the fragmented realm" },
    { line: 42, phrase: "Wise in our negligence", definition: "clever in their secret plans" },
    { line: 44, phrase: "power", definition: "military force" },
    { line: 50, phrase: "ring", definition: "signal-ring" },
    { line: 53, phrase: "your pain", definition: "your trouble" },
  ]);

  // ── 3.2 — Storm still (bonus) ────────────────────────────────────────
  append("king_lear_act3_scene2", [
    { line: 10, phrase: "rumble thy bellyful", definition: "Lear's derisive license to the storm — growl all you want" },
    { line: 13, phrase: "tax not you, you elements", definition: "I don't accuse the elements — they are innocent" },
    { line: 18, phrase: "subscription", definition: "vassal allegiance — the storm owes him nothing" },
    { line: 25, phrase: "servile ministers", definition: "slavish lackeys" },
    { line: 30, phrase: "high-engender’d battles", definition: "armies bred in the heavens" },
    { line: 35, phrase: "marry", definition: "indeed — oath" },
    { line: 42, phrase: "wise man", definition: "the Fool's proverb: the truly prudent do not enter weather like this without a hat" },
    { line: 50, phrase: "undivulged crimes", definition: "hidden sins" },
    { line: 52, phrase: "Unwhipp’d of justice", definition: "unscourged by law" },
    { line: 56, phrase: "seeming", definition: "appearance" },
    { line: 62, phrase: "piece of man", definition: "fragment of humanity" },
    { line: 70, phrase: "heart", definition: "courage" },
    { line: 76, phrase: "poor fool and knave", definition: "the Fool — Lear's first kindness on the heath" },
    { line: 78, phrase: "art of our necessities", definition: "the craft of making do with what we have" },
    { line: 84, phrase: "usurers tell their gold", definition: "the Fool's mock-prophecy: when rich men count coins publicly" },
  ]);

  // ── 3.3 — Gloucester's castle (bonus) ────────────────────────────────
  append("king_lear_act3_scene3", [
    { line: 5, phrase: "their own houses", definition: "Cornwall and Regan occupying Gloucester's castle" },
    { line: 9, phrase: "a worse matter than that", definition: "Gloucester's veiled reference to the French invasion" },
    { line: 14, phrase: "footed", definition: "landed — France has come ashore" },
    { line: 17, phrase: "These injuries the king now bears", definition: "Lear's present sufferings, which Gloucester intends to relieve" },
    { line: 20, phrase: "privily", definition: "privately — Gloucester's secret succor to Lear" },
  ]);

  // ── 3.4 — Poor Tom (bonus) ───────────────────────────────────────────
  append("king_lear_act3_scene4", [
    { line: 4, phrase: "tyranny", definition: "oppression — Kent on the storm" },
    { line: 15, phrase: "cub-drawn bear", definition: "nursing mother-bear milked dry by cubs — a desperate hungry animal" },
    { line: 22, phrase: "mouth should tear this hand", definition: "as if the mouth bit the hand that fed it — Lear's filial grief as anatomy" },
    { line: 30, phrase: "I’ll punish home", definition: "I'll pursue justice all the way — then immediately forswears" },
    { line: 48, phrase: "Bless thee from whirlwinds", definition: "Poor Tom's mock-blessing against weather" },
    { line: 55, phrase: "star-blasting", definition: "malign astral influence causing disease" },
    { line: 58, phrase: "taking", definition: "pestilence" },
    { line: 63, phrase: "set ratsbane by his porridge", definition: "Poor Tom's imagined suicide-method — rat poison in food" },
    { line: 75, phrase: "pew", definition: "stall; raised bench" },
    { line: 80, phrase: "Alow, alow, loo, loo!", definition: "hunting-cry nonsense in Tom's jargon" },
    { line: 88, phrase: "Avaunt", definition: "begone" },
    { line: 90, phrase: "through the sharp hawthorn", definition: "Poor Tom's description of the demon-lashed journey" },
    { line: 100, phrase: "rats", definition: "Poor Tom's catalogue of food-swallowed vermin — 'eats the swimming frog, the toad...'" },
    { line: 110, phrase: "three suits", definition: "three changes of clothes — the worldly minimum for a gentleman" },
    { line: 120, phrase: "mop and mow", definition: "grimace and pull faces" },
    { line: 135, phrase: "Nero is an angler", definition: "Poor Tom's apocryphal tag — the Roman emperor fishing in the lake of hell" },
    { line: 142, phrase: "prince of darkness is a gentleman", definition: "Poor Tom's mock-heraldry — the devil has manners" },
    { line: 150, phrase: "Pillicock sat on Pillicock-hill", definition: "a nonsense rhyme — child's jingle with sexual pun" },
  ]);

  // ── 3.5 — Gloucester's castle (bonus) ────────────────────────────────
  append("king_lear_act3_scene5", [
    { line: 3, phrase: "nature thus gives way to loyalty", definition: "Edmund's formula — family feeling surrendered to political allegiance" },
    { line: 8, phrase: "approves him", definition: "confirms him" },
    { line: 12, phrase: "an intelligent party", definition: "a conscious agent; an informed accomplice" },
    { line: 16, phrase: "becomes your father", definition: "turns out to be (because of) your father" },
    { line: 18, phrase: "True or false", definition: "whatever the fact of the matter" },
  ]);

  // ── 3.6 — Mock trial (bonus, Q1-only) ────────────────────────────────
  append("king_lear_act3_scene6", [
    { line: 5, phrase: "Frateretto", definition: "demon from Harsnett's 1603 Declaration — another named devil" },
    { line: 8, phrase: "fiend", definition: "Poor Tom's demon" },
    { line: 15, phrase: "madam, I", definition: "Poor Tom begins in the voice of someone being sued" },
    { line: 25, phrase: "justicer", definition: "judge — formal trial vocabulary applied to a farmhouse bench" },
    { line: 30, phrase: "commission", definition: "court deputation" },
    { line: 42, phrase: "corruption", definition: "bribery — Lear's accusation against his own hallucinated court" },
    { line: 48, phrase: "grumble me", definition: "complain to me — Lear urging the imagined Goneril to reply" },
    { line: 55, phrase: "false justicer", definition: "bad judge — Lear's rage when Regan 'escapes'" },
    { line: 65, phrase: "bobtail tike", definition: "mongrel with a docked tail — insults of Tom's demon-repertoire" },
    { line: 72, phrase: "trundle-tail", definition: "another mongrel variety" },
    { line: 85, phrase: "litter", definition: "stretcher" },
    { line: 95, phrase: "lose to-morrow by too early a rising", definition: "the Fool's farewell — Lear's decline will outrun any remedy" },
    { line: 102, phrase: "sir", definition: "Kent addressing the Fool directly" },
  ]);

  // ── 3.7 — Blinding (bonus) ───────────────────────────────────────────
  append("king_lear_act3_scene7", [
    { line: 3, phrase: "hot questrists after him", definition: "eager hunters pursuing Lear" },
    { line: 8, phrase: "traitor", definition: "Cornwall's label for Gloucester" },
    { line: 18, phrase: "unnatural", definition: "against kinship — the play's governing term for the sisters' behavior inverted against Gloucester here" },
    { line: 28, phrase: "lunatic king", definition: "Regan dismissing Lear" },
    { line: 45, phrase: "course", definition: "a bear-baiting term — the chained victim's 'course' against dogs" },
    { line: 50, phrase: "wolvish visage", definition: "wolfish appearance — Gloucester of the sisters" },
    { line: 56, phrase: "the sea, with such a storm", definition: "Gloucester's account of Lear's condition in the storm" },
    { line: 62, phrase: "all cruels", definition: "all cruelties personified" },
    { line: 68, phrase: "In hell-black night", definition: "in the darkness of hell" },
    { line: 80, phrase: "sh’d have buoy’d up", definition: "would have risen to drown the stars" },
    { line: 90, phrase: "if wolves had at thy gate howl’d", definition: "even wolves would have shown more mercy" },
    { line: 95, phrase: "winged vengeance", definition: "swift divine retribution" },
    { line: 105, phrase: "Villain", definition: "insult — Cornwall calls the servant a peasant" },
    { line: 110, phrase: "Villain, thou shalt never see", definition: "Cornwall's grim promise before the second eye" },
  ]);

  // ── 4.1 — The heath (bonus) ──────────────────────────────────────────
  append("king_lear_act4_scene1", [
    { line: 2, phrase: "to be contemn’d", definition: "to be openly despised" },
    { line: 5, phrase: "still contemn’d and flatter’d", definition: "caught between contempt and flattery" },
    { line: 8, phrase: "lamentable change", definition: "pitiful reversal" },
    { line: 13, phrase: "esperance", definition: "hope" },
    { line: 20, phrase: "worser welcome", definition: "worse reception" },
    { line: 28, phrase: "abused father", definition: "wronged father (Gloucester)" },
    { line: 33, phrase: "How now, my lord?", definition: "the Old Man's greeting to Gloucester" },
    { line: 42, phrase: "he that will think to live", definition: "he who wants to go on living" },
    { line: 47, phrase: "way is a daily pilgrimage", definition: "every step is a hard journey" },
    { line: 55, phrase: "ancient love", definition: "old tenant-loyalty" },
    { line: 62, phrase: "in nothing am I chang’d", definition: "I'm still what I was — the Old Man's loyalty declared" },
    { line: 68, phrase: "worse", definition: "even worse now than at first" },
    { line: 75, phrase: "fie, foh, and fum", definition: "Tom's giant-killer fragment again" },
    { line: 80, phrase: "purse", definition: "Gloucester's gift to Tom" },
    { line: 82, phrase: "wretch", definition: "piteous creature" },
    { line: 87, phrase: "the superfluous and lust-dieted man", definition: "the overrich — Gloucester's echo of Lear's 3.4 speech" },
  ]);

  // ── 4.2 — Before Albany's palace (bonus) ─────────────────────────────
  append("king_lear_act4_scene2", [
    { line: 8, phrase: "militant", definition: "warlike" },
    { line: 12, phrase: "What he should most despise", definition: "what most deserves contempt" },
    { line: 18, phrase: "monster", definition: "unnatural creature" },
    { line: 22, phrase: "musters", definition: "musters of troops" },
    { line: 28, phrase: "turn the head", definition: "change the outcome" },
    { line: 35, phrase: "O, the difference of man and man!", definition: "Goneril's contempt for Albany vs. Edmund" },
    { line: 40, phrase: "wear this", definition: "a token Goneril gives Edmund — possibly a ring or chain" },
    { line: 45, phrase: "My fool usurps my body", definition: "my fool of a husband possesses me — Goneril's bitter line about Albany" },
    { line: 56, phrase: "self-cover’d thing", definition: "creature covered by (her own) fiendishness disguised as woman" },
    { line: 62, phrase: "Bemonster not thy feature", definition: "do not distort your face into a fiend's" },
    { line: 70, phrase: "vile", definition: "base; degraded" },
    { line: 82, phrase: "I shall answer", definition: "I will have the satisfaction of responding" },
    { line: 95, phrase: "mortal arbitrement", definition: "fatal arbitration — the duel Edmund has set up" },
    { line: 100, phrase: "slaughterer", definition: "butcher" },
  ]);

  // ── 4.3 — French camp (bonus, Q1-heavy) ──────────────────────────────
  append("king_lear_act4_scene3", [
    { line: 2, phrase: "imperfect", definition: "unfinished; partial — the French campaign Kent cannot describe in full" },
    { line: 9, phrase: "passion", definition: "grief" },
    { line: 12, phrase: "trill’d", definition: "trickled" },
    { line: 15, phrase: "A sight most pitiful", definition: "the Gentleman's emphasis on Cordelia's composed grief" },
    { line: 22, phrase: "best of me", definition: "my better self — Cordelia's perfect emotional balance" },
    { line: 28, phrase: "moisten’d", definition: "wetted with tears" },
    { line: 32, phrase: "heav’d the name of father", definition: "spoke 'father' with a sigh" },
    { line: 36, phrase: "sovereign shame", definition: "overpowering shame — what Lear feels" },
    { line: 40, phrase: "detriment", definition: "harm" },
    { line: 45, phrase: "casualties", definition: "circumstances" },
  ]);

  // ── 4.4 — The same. A tent (bonus) ───────────────────────────────────
  append("king_lear_act4_scene4", [
    { line: 7, phrase: "rank fumiter", definition: "luxuriant fumitory — a weed in the wreath on Lear's head" },
    { line: 10, phrase: "high-grown field", definition: "tall crops" },
    { line: 13, phrase: "century", definition: "company of a hundred soldiers" },
    { line: 16, phrase: "bereaved sense", definition: "lost reason" },
    { line: 19, phrase: "provoke", definition: "summon; call forth" },
    { line: 24, phrase: "outward worth", definition: "external greatness — Cordelia's army is not for gain but for Lear" },
    { line: 29, phrase: "blown ambition", definition: "bloated ambition" },
  ]);

  // ── 4.5 — Gloucester's castle (bonus) ────────────────────────────────
  append("king_lear_act4_scene5", [
    { line: 6, phrase: "ignorant", definition: "kept in the dark" },
    { line: 10, phrase: "some note", definition: "some message" },
    { line: 17, phrase: "take part", definition: "interest myself" },
    { line: 25, phrase: "becomes a lady", definition: "befits a noblewoman" },
    { line: 32, phrase: "straining fasten’d", definition: "fixed — Regan on Edmund's amorous looks toward Goneril" },
    { line: 38, phrase: "dismiss", definition: "send away" },
  ]);

  // ── 4.6 — Dover cliff (bonus) ────────────────────────────────────────
  append("king_lear_act4_scene6", [
    { line: 3, phrase: "horrible steep", definition: "terrifyingly sheer" },
    { line: 8, phrase: "the sea", definition: "the sound Edgar pretends Gloucester hears below" },
    { line: 22, phrase: "commit yourself", definition: "commend yourself (to death)" },
    { line: 30, phrase: "a worthier way", definition: "a more honorable course" },
    { line: 50, phrase: "beaconed", definition: "signalled; shone from" },
    { line: 65, phrase: "enrag’d humour", definition: "madness; fit of rage" },
    { line: 76, phrase: "enamel’d", definition: "sparkling; iridescent — the grass" },
    { line: 85, phrase: "sworn", definition: "vowed" },
    { line: 90, phrase: "coining", definition: "minting; royalty's privilege" },
    { line: 98, phrase: "press-money", definition: "advance pay to conscripts" },
    { line: 110, phrase: "aqua vitae", definition: "distilled spirits" },
    { line: 130, phrase: "winking", definition: "blinking" },
    { line: 140, phrase: "inch", definition: "part; scrap" },
    { line: 150, phrase: "shun", definition: "avoid" },
    { line: 160, phrase: "small gilded fly", definition: "shimmering insect — Lear's emblem of universal lust" },
    { line: 170, phrase: "riotous appetite", definition: "wild lust" },
    { line: 178, phrase: "civet", definition: "perfume from the civet-cat — Lear wanting to mask imagined sexual smell" },
    { line: 195, phrase: "squiny", definition: "squint" },
    { line: 205, phrase: "case of eyes", definition: "pair of eyes — Lear's anatomical figure" },
    { line: 215, phrase: "simpering dame", definition: "coy woman — Lear's misogynist rant" },
    { line: 230, phrase: "matter and impertinency", definition: "substance and nonsense mixed — Edgar's characterisation" },
    { line: 240, phrase: "patience", definition: "endurance — Lear's vocabulary as he calms" },
    { line: 250, phrase: "pass", definition: "go on; live" },
  ]);

  // ── 4.7 — Lear wakes (bonus) ─────────────────────────────────────────
  append("king_lear_act4_scene7", [
    { line: 6, phrase: "meet", definition: "fit; proper" },
    { line: 12, phrase: "untun’d and jarring senses", definition: "Lear's mental discord as musical disharmony" },
    { line: 16, phrase: "child-changed father", definition: "father transformed by his children's cruelty" },
    { line: 22, phrase: "arrayed", definition: "clothed" },
    { line: 28, phrase: "Kind and dear princess", definition: "Doctor's address to Cordelia" },
    { line: 34, phrase: "restoration", definition: "cure" },
    { line: 40, phrase: "violent harm", definition: "the bodily abuse Lear suffered" },
    { line: 46, phrase: "perdu", definition: "lost sentinel — a soldier on a hopeless post" },
    { line: 50, phrase: "mutual cunning", definition: "shared craft; collaborative deception" },
    { line: 62, phrase: "fond", definition: "foolish; doting" },
    { line: 70, phrase: "fourscore and upward", definition: "eighty or more years old — Lear's reported age" },
    { line: 76, phrase: "I know not what to say", definition: "Lear finding no speech" },
    { line: 82, phrase: "abused", definition: "mistreated" },
    { line: 88, phrase: "forget and forgive", definition: "his only plea — the play's most disarming phrase" },
    { line: 94, phrase: "kingdom", definition: "realm — Lear does not remember what he did with it" },
    { line: 100, phrase: "rage is gone", definition: "the Doctor's reassurance — Lear's fury has spent itself" },
  ]);

  // ── 5.1 — British camp (bonus) ───────────────────────────────────────
  append("king_lear_act5_scene1", [
    { line: 3, phrase: "his purpose chang’d", definition: "his plan altered" },
    { line: 8, phrase: "forfended", definition: "forbidden" },
    { line: 14, phrase: "Fear not", definition: "don't worry" },
    { line: 20, phrase: "familiar", definition: "customary; proper" },
    { line: 26, phrase: "cause", definition: "reason; concern" },
    { line: 32, phrase: "I never shall endure her", definition: "Regan about Goneril — the rivalry explicit" },
    { line: 38, phrase: "Sir, you are one o’ the number", definition: "Edmund inviting Albany into the council" },
    { line: 45, phrase: "jealous", definition: "suspicious — Edmund's coolness about Goneril and Regan" },
    { line: 52, phrase: "enemy's grace", definition: "favor from the enemy" },
  ]);

  // ── 5.2 — A field between the two camps (bonus) ──────────────────────
  append("king_lear_act5_scene2", [
    { line: 3, phrase: "colours", definition: "banners; flag" },
    { line: 8, phrase: "coming hither", definition: "birth" },
    { line: 11, phrase: "Ta’en", definition: "taken prisoner — Lear and Cordelia captured" },
  ]);

  // ── 5.3 — The play's catastrophe (bonus) ─────────────────────────────
  append("king_lear_act5_scene3", [
    { line: 2, phrase: "good guard", definition: "strict custody" },
    { line: 12, phrase: "kneel down", definition: "Lear reversing the filial gesture" },
    { line: 20, phrase: "gilded butterflies", definition: "gaudy court hangers-on" },
    { line: 28, phrase: "sacrifices", definition: "the 'sacrifices' upon which the gods cast incense — Lear imagines their imprisonment as sacred" },
    { line: 40, phrase: "He that parts us", definition: "Lear's promise — whoever separates us must fire them out like foxes" },
    { line: 48, phrase: "great thing of us forgot", definition: "a great matter we forgot" },
    { line: 58, phrase: "censure", definition: "judgment — Albany's on Edmund" },
    { line: 70, phrase: "compeer", definition: "equal; co-regent" },
    { line: 80, phrase: "base", definition: "low-born" },
    { line: 92, phrase: "Sister, sister!", definition: "Goneril and Regan's rivalry erupting into open quarrel" },
    { line: 100, phrase: "toad-spotted traitor", definition: "Albany on Goneril — heraldic-grotesque insult" },
    { line: 110, phrase: "trumpet speak", definition: "formal call for the duel" },
    { line: 120, phrase: "within the lists", definition: "within the dueling enclosure" },
    { line: 140, phrase: "noble vessel", definition: "a noble body (Edgar in armor)" },
    { line: 155, phrase: "false to thy gods", definition: "the charges Edgar reads against Edmund" },
    { line: 170, phrase: "what safe and nicely I might well delay", definition: "what I might prudently refuse" },
    { line: 190, phrase: "exchange charity", definition: "let us be reconciled" },
    { line: 205, phrase: "father’s sorrows", definition: "Gloucester's grief-filled discovery" },
    { line: 220, phrase: "tell thee on", definition: "continue to tell you" },
    { line: 235, phrase: "the bloody proclamation to escape", definition: "to flee the wanted-poster" },
    { line: 248, phrase: "wife", definition: "Goneril — poison confession" },
    { line: 260, phrase: "The judgment of the heavens", definition: "Albany's invocation of divine justice on the sisters" },
    { line: 272, phrase: "No, no, no life!", definition: "Lear's cry over Cordelia" },
  ]);
};
