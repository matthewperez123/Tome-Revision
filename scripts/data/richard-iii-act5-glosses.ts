/**
 * Richard III — Act V glosses.
 * Tier-1: 5.3 (ghost scene / "thousand several tongues"), 5.4 ("A horse!").
 * 5.1 (Buckingham's execution — the All-Souls' Day speech) and 5.5
 * (Richmond's closing Tudor-Myth speech) are non-Tier-1 but
 * structurally critical; both get solid coverage.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 5.1 — Salisbury. Buckingham led to execution ──────────────────────
  GLOSSES.richard_iii_act5_scene1 = [
    { line: 5, phrase: "miscarried", definition: "perished, died (not 'failed')" },
    { line: 6, phrase: "underhand corrupted foul injustice", definition: "secretly corrupted, foul injustice — Buckingham's indictment of Richard's regime" },
    { line: 9, phrase: "mock my destruction", definition: "laugh at my downfall — Buckingham invokes his victims as spectators" },
    { line: 10, phrase: "All-Souls’ day", definition: "2 November — the feast commemorating all the faithful departed; historically Buckingham's actual execution date, 1483" },
    { line: 12, phrase: "All-Souls’ day is my body’s doomsday", definition: "the day of the dead is the day of my death — Buckingham's theological pun" },
    { line: 14, phrase: "wish’d might fall on me", definition: "wished might befall me — Buckingham's remembered self-curse (cf. 2.1.32–40) now returning" },
    { line: 19, phrase: "determined respite of my wrongs", definition: "the appointed reckoning for my crimes — 'respite' = delay before payment due" },
    { line: 20, phrase: "high All-Seer", definition: "God; the all-seeing judge" },
    { line: 21, phrase: "feigned prayer", definition: "pretended prayer — Buckingham's false 2.1 reconciliation oath" },
    { line: 22, phrase: "given in earnest what I begg’d in jest", definition: "granted seriously what I begged playfully — the god of 2.1's oath takes him at his word" },
    { line: 25, phrase: "Margaret’s curse is fallen upon my head", definition: "second confirmation of Margaret's 1.3 prophecies (cf. Grey at 3.3.15)" },
    { line: 27, phrase: "Margaret was a prophetess", definition: "quoting Margaret's own words back to her — Buckingham completes her curse's structure" },
    { line: 29, phrase: "Wrong hath but wrong", definition: "wrong is paid only with wrong — Buckingham's closing moral arithmetic" },
  ];

  // ── 5.2 — Plain near Tamworth. Richmond's rallying speech ─────────────
  GLOSSES.richard_iii_act5_scene2 = [
    { line: 2, phrase: "yoke of tyranny", definition: "oppressive rule — Richmond's opening framing of Richard" },
    { line: 3, phrase: "bowels of the land", definition: "heartland; inner regions" },
    { line: 7, phrase: "usurping boar", definition: "Richard as heraldic boar — 'usurping' frames him as illegitimate king" },
    { line: 9, phrase: "Swills your warm blood like wash", definition: "drinks your blood like pig-swill ('wash' = kitchen slops fed to pigs)" },
    { line: 10, phrase: "embowell’d bosoms", definition: "disembowelled chests" },
    { line: 12, phrase: "Leicester", definition: "Leicester — Richard's base before Bosworth; historically where his remains were rediscovered in 2012" },
    { line: 13, phrase: "Tamworth", definition: "Richmond's staging point, Staffordshire — one day's march from Bosworth" },
    { line: 16, phrase: "one bloody trial of sharp war", definition: "a single decisive battle" },
    { line: 17, phrase: "Every man’s conscience is a thousand swords", definition: "Oxford's inversion of Richard's 5.3.190 'thousand several tongues' — good conscience arms the army" },
    { line: 23, phrase: "swallow’s wings", definition: "proverbial image of speed" },
    { line: 24, phrase: "Kings it makes gods, and meaner creatures kings", definition: "hope makes kings divine and common men royal" },
  ];

  // ── 5.3 — Bosworth Field. Tents, ghosts, dawn (Tier-1) ────────────────
  GLOSSES.richard_iii_act5_scene3 = [
    { line: 1, phrase: "Bosworth field", definition: "Bosworth Field, Leicestershire — 22 August 1485; last battle of the Wars of the Roses. Richard's death site" },
    { line: 5, phrase: "must have knocks", definition: "must trade blows — Richard's blunt soldier-talk" },
    { line: 11, phrase: "battalion trebles that account", definition: "our force is three times theirs — historically Richard had ~10,000 to Richmond's ~5,000" },
    { line: 12, phrase: "king’s name is a tower of strength", definition: "the very title of king gives might — proverbial; cf. Proverbs 18:10" },
    { line: 16, phrase: "men of sound direction", definition: "men of reliable judgement" },
    { line: 19, phrase: "weary sun hath made a golden set", definition: "the tired sun has set in gold — Richmond's portent-reading, favourable" },
    { line: 20, phrase: "fiery car", definition: "the sun as a fiery chariot — classical image (Apollo/Phaethon)" },
    { line: 22, phrase: "Sir William Brandon, you shall bear my standard", definition: "Brandon was Richmond's standard-bearer — historically killed by Richard in single combat on the field" },
    { line: 25, phrase: "Limit each leader to his several charge", definition: "assign each commander his specific duty" },
    { line: 35, phrase: "colours", definition: "military banners — identifying a regiment" },
    { line: 50, phrase: "beaver", definition: "the movable front-piece of a helmet" },
    { line: 55, phrase: "Stir with the lark", definition: "rise at dawn — proverbial" },
    { line: 60, phrase: "blind cave of eternal night", definition: "the grave — death as a dark cave" },
    { line: 62, phrase: "white Surrey", definition: "Richard's warhorse, named for its pale colouring and origin (the county of Surrey)" },
    { line: 63, phrase: "staves", definition: "spears or lances" },
    { line: 67, phrase: "cock-shut time", definition: "dusk; the time when poultry are shut up — a rural time-marker" },
    { line: 70, phrase: "alacrity of spirit", definition: "briskness, quickness of mind — Richard notes his own dwindling" },
    { line: 80, phrase: "by attorney, bless thee from thy mother", definition: "by proxy, give you your mother's blessing — Margaret Beaufort in absentia" },
    { line: 83, phrase: "flaky darkness breaks within the east", definition: "dawn breaks in flakes (the first grey streaks) in the east" },
    { line: 86, phrase: "arbitrement", definition: "arbitration, decision — the battle as formal legal judgement" },
    { line: 87, phrase: "mortal-staring war", definition: "war that stares with deadly eyes" },
    { line: 102, phrase: "leaden slumber peise me down", definition: "heavy sleep weigh me down — 'peise' = weigh" },
    { line: 107, phrase: "bruising irons of wrath", definition: "bruising weapons of God's wrath — Richmond asks God to arm his soldiers" },
    { line: 110, phrase: "ministers of chastisement", definition: "agents of punishment" },
    { line: 113, phrase: "windows of mine eyes", definition: "eyelids — the 'windows' through which the soul looks out (cf. 1.2.12)" },
    { line: 115, phrase: "Let me sit heavy on thy soul", definition: "let me weigh on your conscience — the refrain each ghost delivers, with variations" },
    { line: 117, phrase: "At Tewksbury", definition: "the 1471 battle where Richard killed Prince Edward of Lancaster — the play's recurrent crime-reference" },
    { line: 117, phrase: "despair, therefore, and die", definition: "each ghost's theological curse — despair (the sin against the Holy Spirit) = damnation without repentance" },
    { line: 123, phrase: "Think on the Tower and me", definition: "Henry VI's murder at the Tower, 1471 — dramatized in 3 Henry VI 5.6" },
    { line: 129, phrase: "wash’d to death with fulsome wine", definition: "drowned in cloying wine — Clarence's malmsey-butt death (1.4.135)" },
    { line: 137, phrase: "Rivers, that died at Pomfret", definition: "Rivers names his own death-site (cf. 3.3)" },
    { line: 148, phrase: "cousins smother’d in the Tower", definition: "the two young princes — cousins (kin) to Richmond through both York and Lancaster lines" },
    { line: 149, phrase: "Let us be lead within thy bosom", definition: "let us be lead within your breast — leaden weight, not lead as in metal direction" },
    { line: 153, phrase: "boar’s annoy", definition: "the boar's harm — 'annoy' = injury" },
    { line: 158, phrase: "perturbations", definition: "troublings, disturbances" },
    { line: 169, phrase: "Fainting, despair; despairing, yield thy breath", definition: "as you faint, despair; as you despair, die — Buckingham's curse-chain" },
    { line: 170, phrase: "died for hope ere I could lend thee aid", definition: "Buckingham died hoping to aid Richmond, before he could act" },
    { line: 174, phrase: "Give me another horse", definition: "Richard waking from the ghost-dream — his first disoriented command anticipates 5.4" },
    { line: 175, phrase: "Soft", definition: "hold; wait — an interjection meaning 'stop and think'" },
    { line: 177, phrase: "lights burn blue", definition: "candles burn blue — the folk-sign of ghostly presence or death" },
    { line: 180, phrase: "Richard loves Richard; that is, I am I", definition: "the speech's famous solipsistic tautology — Richard's selfhood disintegrating into empty equation" },
    { line: 188, phrase: "I am a villain: yet I lie, I am not", definition: "Richard's logical impasse: he is a villain AND he denies it — the self-division the ghosts have produced" },
    { line: 190, phrase: "conscience hath a thousand several tongues", definition: "my conscience has a thousand distinct tongues — each a separate accusation. The clearest moment of interiority the play grants Richard" },
    { line: 196, phrase: "Throng to the bar", definition: "crowd to the court-bar — Richard's sins as plaintiffs" },
    { line: 197, phrase: "I shall despair", definition: "theological despair (cf. 1.2.84; the ghosts' curse achieved) — Richard recognizes his damnation" },
    { line: 207, phrase: "buckle on their armour", definition: "strap on their armor for battle" },
    { line: 211, phrase: "afraid of shadows", definition: "afraid of unreal things — Ratcliff's dismissal" },
    { line: 215, phrase: "Armed in proof", definition: "armed in tested (proven) armor" },
    { line: 217, phrase: "eaves-dropper", definition: "one who listens under the eaves of a house — here Richard as spy on his own camp" },
    { line: 225, phrase: "cried on victory", definition: "cried out for victory (to be granted to Richmond)" },
    { line: 226, phrase: "jocund", definition: "cheerful, merry" },
    { line: 248, phrase: "foe vaunts in the field", definition: "the enemy boasts on the battlefield — 'vaunts' = boasts loudly" },
    { line: 249, phrase: "caparison my horse", definition: "put the caparison (ornamental cloth and armor) on my horse" },
    { line: 253, phrase: "foreward", definition: "vanguard; front division of an army" },
    { line: 260, phrase: "puissance", definition: "military might; force" },
    { line: 261, phrase: "Saint George to boot", definition: "St George (England's patron saint) in addition — war-cry" },
    { line: 263, phrase: "Jockey of Norfolk", definition: "the mocking placard mounted on Norfolk's tent — 'Jockey' = familiar form of 'John', i.e. Duke John of Norfolk" },
    { line: 265, phrase: "Dickon thy master is bought and sold", definition: "'Dickon' = familiar for 'Richard'; the couplet is historical, cited by Holinshed" },
    { line: 269, phrase: "Conscience is but a word that cowards use", definition: "Richard's notorious dismissal of conscience — his public counter to the 'thousand tongues' soliloquy's private recognition" },
    { line: 272, phrase: "pell-mell", definition: "in confused, headlong fashion" },
    { line: 273, phrase: "If not to heaven, then hand in hand to hell", definition: "Richard's battle-motto — the most morally naked line in the play" },
    { line: 281, phrase: "spleen of fiery dragons", definition: "fierce passion of dragons — the spleen was the seat of fury" },
  ];

  // ── 5.4 — Another part of the field. "A horse!" (Tier-1) ──────────────
  GLOSSES.richard_iii_act5_scene4 = [
    { line: 2, phrase: "enacts more wonders than a man", definition: "performs more marvels than a (mere) man can — Catesby's superhuman image of Richard at bay" },
    { line: 3, phrase: "Daring an opposite", definition: "daringly facing an opponent" },
    { line: 5, phrase: "Seeking for Richmond in the throat of death", definition: "hunting Richmond in the very jaws of death — Richard seeks single combat" },
    { line: 7, phrase: "A horse! a horse! my kingdom for a horse!", definition: "the play's most famous line — spoken in desperate literal need, NOT comic bluster; Richard has been unhorsed and is offering his entire realm for a mount to continue fighting. He dies moments later" },
    { line: 9, phrase: "set my life upon a cast", definition: "gambled my life on a throw of the dice — 'cast' = die-throw" },
    { line: 10, phrase: "stand the hazard of the die", definition: "accept the risk of the dice — Richard's gaming-table heroism at the point of death" },
    { line: 11, phrase: "six Richmonds in the field", definition: "six decoys dressed as Richmond — a common medieval battle tactic to protect a commander" },
    { line: 13, phrase: "A horse! a horse! my kingdom for a horse!", definition: "repeated for emphasis — the line's desperation mounting; Richard goes to his death" },
  ];

  // ── 5.5 — Another part of the field. Richmond's victory speech ────────
  GLOSSES.richard_iii_act5_scene5 = [
    { line: 2, phrase: "bloody dog is dead", definition: "Richmond's flat acclamation of Richard's death — 'bloody dog' aligns with Margaret's cur-imagery (4.4)" },
    { line: 3, phrase: "acquit thee", definition: "discharged yourself (honourably)" },
    { line: 4, phrase: "long-usurped royalty", definition: "crown long usurped (by Richard) — Stanley/Derby's phrasing legitimizes the Tudor claim" },
    { line: 5, phrase: "dead temples of this bloody wretch", definition: "the dead brow of this bloody wretch — the crown physically taken from Richard's corpse on the field, per tradition" },
    { line: 9, phrase: "young George Stanley living", definition: "Richmond's first question after victory — the hostage boy Derby left behind at 4.5" },
    { line: 13, phrase: "John Duke of Norfolk", definition: "the highest-ranking casualty on Richard's side — historically killed at Bosworth" },
    { line: 14, phrase: "Sir Robert Brakenbury", definition: "the Tower's constable — killed at Bosworth on Richard's side" },
    { line: 15, phrase: "Inter their bodies as becomes their births", definition: "bury them according to their social rank — Richmond's first act of royal clemency" },
    { line: 16, phrase: "Proclaim a pardon", definition: "announce a pardon — the classic royal act of mercy at the start of a reign" },
    { line: 18, phrase: "as we have ta’en the sacrament", definition: "Richmond had sworn at Rennes Cathedral (1483) to marry Elizabeth of York — a sacramentally-sworn vow" },
    { line: 19, phrase: "unite the white rose and the red", definition: "unite the white rose (York) and the red rose (Lancaster) — the Tudor rose, literally the grafted heraldic emblem of Henry VII's reign; the canonical end-of-play image of reconciliation" },
    { line: 20, phrase: "Smile heaven upon this fair conjunction", definition: "Richmond asks God to bless the dynastic marriage — 'conjunction' = astrological alignment, also marital joining" },
    { line: 23, phrase: "England hath long been mad, and scarr’d herself", definition: "England has been self-wounding in civil madness — Richmond diagnoses the Wars of the Roses as pathology" },
    { line: 24, phrase: "brother blindly shed the brother’s blood", definition: "the civil-war horror: kin-against-kin violence" },
    { line: 27, phrase: "divided York and Lancaster", definition: "the two houses whose feud is the Wars of the Roses — named explicitly at the play's close" },
    { line: 29, phrase: "Richmond and Elizabeth", definition: "Henry VII and Elizabeth of York — married January 1486, founding the Tudor dynasty" },
    { line: 30, phrase: "true succeeders of each royal house", definition: "legitimate heirs of each house — the political theology that legitimizes the union" },
    { line: 31, phrase: "By God’s fair ordinance", definition: "by God's just decree — Richmond frames the marriage as providential" },
    { line: 33, phrase: "Enrich the time to come with smooth-faced peace", definition: "fill the future with placid peace — the Tudor political promise" },
    { line: 35, phrase: "Abate the edge of traitors", definition: "blunt the edge of traitors' weapons — a prayer against future rebellion" },
    { line: 36, phrase: "reduce these bloody days again", definition: "bring back these bloody days — 'reduce' in old sense = lead back" },
    { line: 38, phrase: "taste this land’s increase", definition: "enjoy this land's growth, its prosperity" },
    { line: 40, phrase: "civil wounds are stopp’d", definition: "civil-war wounds are staunched — surgical image for political healing" },
    { line: 41, phrase: "she may long live here", definition: "may Peace long live here — Peace personified as female, and as the new Tudor order" },
  ];

};
