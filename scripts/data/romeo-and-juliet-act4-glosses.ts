/**
 * Romeo and Juliet — Act IV glosses.
 * 4.1: Friar's plan. 4.3: Juliet's potion soliloquy.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 4.1 — Friar Laurence's cell (127 lines) ─────────────────────────
  GLOSSES.romeo_and_juliet_act4_scene1 = [
    { line: 3, phrase: "slack his haste", definition: "slow him down" },
    { line: 7, phrase: "minded", definition: "thought of; considered" },
    { line: 11, phrase: "inundation of her tears", definition: "flood of weeping" },
    { line: 12, phrase: "society", definition: "company" },
    { line: 17, phrase: "now do you know the reason of this haste", definition: "Paris asserts the wedding is Capulet's remedy for Juliet's grief" },
    { line: 19, phrase: "I would I knew not why it should be slow’d", definition: "I wish I didn't know reason to delay" },
    { line: 22, phrase: "Happily met", definition: "well met" },
    { line: 34, phrase: "I will confess to you that I love him", definition: "Juliet tells Paris she loves someone — but the Friar is her audience" },
    { line: 38, phrase: "to my face", definition: "directly in my presence" },
    { line: 46, phrase: "entreat the time alone", definition: "beg some private time" },
    { line: 50, phrase: "shield", definition: "forbid" },
    { line: 57, phrase: "compass of my wits", definition: "past the reach of my intellect — the Friar's despair" },
    { line: 59, phrase: "prorogue it", definition: "postpone it" },
    { line: 62, phrase: "presently", definition: "at once" },
    { line: 65, phrase: "slay them both", definition: "kill both obstacles — Juliet rejects living with Paris" },
    { line: 68, phrase: "arbitrating", definition: "deciding; arbitrating between" },
    { line: 75, phrase: "thievish ways", definition: "roads full of robbers" },
    { line: 76, phrase: "serpents", definition: "she would brave any horror to avoid marrying Paris" },
    { line: 77, phrase: "roaring bears", definition: "wild bears — any monster rather than Paris" },
    { line: 78, phrase: "charnel-house", definition: "a building where human bones and corpses are stored" },
    { line: 81, phrase: "reeky shanks", definition: "stinking leg-bones" },
    { line: 82, phrase: "yellow chapless skulls", definition: "bare jaw-less skulls — decayed yellow remains" },
    { line: 84, phrase: "new-made grave", definition: "fresh burial-pit" },
    { line: 93, phrase: "vial", definition: "small flask — for the sleeping-draught" },
    { line: 95, phrase: "humour", definition: "fluid; effect in the body" },
    { line: 96, phrase: "cold and drowsy humour", definition: "the draught's description — it will mimic death" },
    { line: 106, phrase: "borrow’d likeness", definition: "the counterfeit face of a corpse" },
    { line: 108, phrase: "two and forty hours", definition: "forty-two hours — the Friar's cardinal time-estimate" },
    { line: 112, phrase: "bier", definition: "the frame on which a coffin is carried" },
    { line: 113, phrase: "ancient vault", definition: "the old family burial chamber — the Capulet tomb" },
    { line: 116, phrase: "against thou shalt awake", definition: "in preparation for when you wake" },
    { line: 119, phrase: "Mantua", definition: "the city of Romeo's exile — about twenty-five miles from Verona" },
    { line: 121, phrase: "inconstant toy", definition: "changeable whim — let no whim stop you" },
    { line: 126, phrase: "prosperous", definition: "successful" },
  ];

  // ── 4.2 — Hall in Capulet's house (46 lines) ────────────────────────
  GLOSSES.romeo_and_juliet_act4_scene2 = [
    { line: 2, phrase: "cunning cooks", definition: "expert kitchen staff — for the wedding feast" },
    { line: 6, phrase: "lick his fingers", definition: "proverbial test of a good cook — the cook who tastes his own work" },
    { line: 14, phrase: "peevish", definition: "willful; cross" },
    { line: 15, phrase: "harlotry", definition: "wayward wench — not a literal charge" },
    { line: 17, phrase: "Pardon, I beseech you!", definition: "Juliet feigns repentance" },
    { line: 24, phrase: "become", definition: "befit" },
    { line: 31, phrase: "Send for the county", definition: "summon Paris" },
    { line: 36, phrase: "reverend", definition: "respected holy Father — the Friar" },
    { line: 42, phrase: "short", definition: "short-notice" },
    { line: 44, phrase: "deck up her", definition: "dress her in wedding attire" },
  ];

  // ── 4.3 — Juliet's chamber (59 lines) — POTION SOLILOQUY ────────────
  GLOSSES.romeo_and_juliet_act4_scene3 = [
    { line: 2, phrase: "orisons", definition: "prayers" },
    { line: 5, phrase: "cross", definition: "crossed; contrary" },
    { line: 7, phrase: "behoveful", definition: "needful; fitting" },
    { line: 8, phrase: "our state", definition: "our ceremonial occasion" },
    { line: 14, phrase: "My dismal scene I needs must act alone", definition: "I must play my grim scene without help — Juliet's theatrical consciousness" },
    { line: 17, phrase: "faint cold fear", definition: "cold, weak terror" },
    { line: 18, phrase: "almost freezes up the heat of life", definition: "nearly stops my blood's warmth — the physiology of fear" },
    { line: 24, phrase: "mixture", definition: "the Friar's potion" },
    { line: 25, phrase: "minister’d to have me dead", definition: "given to me that I might die — Juliet's first suspicion" },
    { line: 26, phrase: "dishonour’d", definition: "disgraced — by having married Romeo in secret" },
    { line: 29, phrase: "a holy man", definition: "Juliet reasons the Friar is too righteous to poison her" },
    { line: 33, phrase: "stifled", definition: "suffocated" },
    { line: 34, phrase: "strangled ere my Romeo comes", definition: "Juliet imagines suffocation in the sealed vault" },
    { line: 37, phrase: "conceit of death", definition: "the mere thought of death" },
    { line: 39, phrase: "vault", definition: "burial-chamber" },
    { line: 40, phrase: "receptacle", definition: "container; the tomb as receptacle of the dead" },
    { line: 42, phrase: "buried ancestors", definition: "Juliet catalogues the Capulet dead she'll lie among" },
    { line: 43, phrase: "green in earth", definition: "newly laid in the ground" },
    { line: 45, phrase: "shrieks", definition: "cries of the dead; folk belief in spirits' wailing" },
    { line: 47, phrase: "mandrakes", definition: "the mandrake root was said to scream when uprooted, killing the hearer" },
    { line: 50, phrase: "environed with all these hideous fears", definition: "surrounded by all these horrors" },
    { line: 52, phrase: "great kinsman’s bone", definition: "Tybalt's bone — his body will be nearby, only days old" },
    { line: 54, phrase: "O, look! methinks I see my cousin’s ghost", definition: "Juliet's hallucination just before she drinks" },
    { line: 55, phrase: "seeking out Romeo", definition: "Tybalt's ghost pursuing Romeo — Juliet's imagined revenge-drama" },
    { line: 58, phrase: "I drink to thee", definition: "her toast is to Romeo — sacrament of the bridal night" },
  ];

  // ── 4.4 — Hall in Capulet's house (24 lines) ────────────────────────
  GLOSSES.romeo_and_juliet_act4_scene4 = [
    { line: 1, phrase: "quinces", definition: "aromatic fruit used in jams and marmalade — wedding-feast spice" },
    { line: 2, phrase: "pastry", definition: "the kitchen where baking is done" },
    { line: 3, phrase: "second cock hath crow’d", definition: "3 a.m. — the second cockcrow" },
    { line: 4, phrase: "curfew-bell", definition: "evening bell-ringing that rang again at dawn" },
    { line: 5, phrase: "baked meats", definition: "meat pies for the wedding breakfast" },
    { line: 6, phrase: "cot-quean", definition: "a man who meddles in household work — Lady Capulet teases her husband" },
    { line: 8, phrase: "watching", definition: "staying up all night" },
    { line: 10, phrase: "mouse-hunt", definition: "chaser of women — Lady Capulet's sly jab at her husband's younger-day rakishness" },
    { line: 13, phrase: "jealous hood", definition: "jealousy personified in a hood — affectionate teasing" },
    { line: 17, phrase: "Mass", definition: "by the Mass — oath" },
  ];

  // ── 4.5 — Juliet's chamber (135 lines) — the 'corpse' discovered ────
  GLOSSES.romeo_and_juliet_act4_scene5 = [
    { line: 1, phrase: "slug-a-bed", definition: "sluggard; lazy sleeper — the Nurse's affectionate scold" },
    { line: 5, phrase: "pennyworths", definition: "small amounts" },
    { line: 9, phrase: "fright you up", definition: "startle you awake" },
    { line: 14, phrase: "down again", definition: "dressed in her day clothes — but dead" },
    { line: 21, phrase: "aqua-vitae", definition: "brandy; strong spirits" },
    { line: 24, phrase: "Alack the day", definition: "alas for this day" },
    { line: 33, phrase: "heaven", definition: "the Nurse's diagnosis — death as heavenly theft" },
    { line: 41, phrase: "Out, alas!", definition: "oh, alas — exclamation of grief" },
    { line: 45, phrase: "Death lies on her like an untimely frost", definition: "Capulet's elegiac image — frost killing the fairest spring-flower" },
    { line: 50, phrase: "O lamentable day", definition: "lamentable formula repeated many times — the mourners' ritual chorus" },
    { line: 68, phrase: "Confusion’s cure", definition: "the remedy for this devastation" },
    { line: 86, phrase: "ordained festival", definition: "the planned wedding" },
    { line: 86, phrase: "black funeral", definition: "the wedding is now a funeral" },
    { line: 90, phrase: "dirges", definition: "mournful hymns" },
    { line: 92, phrase: "buried corse", definition: "buried corpse" },
    { line: 103, phrase: "put up", definition: "put away — the musicians' instruments are no longer needed" },
    { line: 120, phrase: "silver sound", definition: "sweet-toned — a common epithet for music" },
    { line: 130, phrase: "Jack", definition: "rogue; knave — a musicians' jest" },
  ];
};
