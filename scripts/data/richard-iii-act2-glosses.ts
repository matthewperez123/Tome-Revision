/**
 * Richard III — Act II glosses.
 * No Tier-1 scenes in this act. Moderate coverage: political/legal
 * vocabulary, the formally intricate lament in 2.2, and the sanctuary
 * procedure in 2.4 (set-up for 3.1's "sanctuary children" debate).
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 2.1 — London. The palace. Edward's forced reconciliation ──────────
  GLOSSES.richard_iii_act2_scene1 = [
    { line: 3, phrase: "embassage", definition: "formal message or summons (by an ambassador)" },
    { line: 4, phrase: "Redeemer", definition: "Christ — Edward anticipates death" },
    { line: 8, phrase: "Dissemble not your hatred", definition: "do not disguise your hatred; admit it and swear it off" },
    { line: 13, phrase: "supreme King of kings", definition: "God (1 Timothy 6:15, Revelation 17:14, 19:16)" },
    { line: 14, phrase: "Confound", definition: "destroy, ruin" },
    { line: 20, phrase: "factious", definition: "in opposition; belonging to rival factions" },
    { line: 27, phrase: "unviolable", definition: "unviolable — unable to be broken" },
    { line: 29, phrase: "seal thou this league", definition: "confirm this alliance (as one seals a legal document)" },
    { line: 44, phrase: "perfect period", definition: "complete ending; perfect conclusion — 'period' in the old rhetorical sense" },
    { line: 52, phrase: "sovereign liege", definition: "royal overlord; formal address to the king" },
    { line: 66, phrase: "Lord Rivers, and, Lord Grey", definition: "Elizabeth's brother and son — named together; marked for Pomfret" },
    { line: 79, phrase: "noble duke is dead", definition: "Gloucester announces Clarence's murder to a court that believed him reprieved" },
    { line: 86, phrase: "the order was reversed", definition: "Edward had countermanded the death warrant — too late" },
    { line: 88, phrase: "winged Mercury", definition: "the fleet messenger-god — carried the first (fatal) order swiftly" },
    { line: 89, phrase: "tardy cripple", definition: "slow lame messenger — Gloucester's cruel image of the reprieve" },
    { line: 90, phrase: "too lag", definition: "too late; lagging behind" },
    { line: 94, phrase: "go current from suspicion", definition: "pass (like a current coin) unsuspected" },
    { line: 99, phrase: "forfeit", definition: "the life-forfeit; the death penalty owed" },
    { line: 102, phrase: "doom my brother’s death", definition: "pronounce my brother's death-sentence" },
    { line: 112, phrase: "Oxford had me down", definition: "the Earl of Oxford unhorsed Edward at Tewkesbury; Clarence rescued him" },
    { line: 115, phrase: "lap me", definition: "wrap me" },
    { line: 118, phrase: "brutish wrath", definition: "beastly rage" },
    { line: 121, phrase: "carters", definition: "cart-drivers; low-class workmen" },
    { line: 123, phrase: "precious image of our dear Redeemer", definition: "the human body as the image of God — Genesis 1:26–27; Edward's theological framing of murder" },
    { line: 133, phrase: "help me to my closet", definition: "help me to my private chamber — closet = small retreat-room" },
  ];

  // ── 2.2 — The palace. The "wailing queens" formal lament ──────────────
  GLOSSES.richard_iii_act2_scene2 = [
    { line: 1, phrase: "grandam", definition: "grandmother — here the Duchess of York" },
    { line: 8, phrase: "cousins", definition: "relatives generally — the Duchess addresses her grandchildren" },
    { line: 11, phrase: "lost sorrow", definition: "wasted grief — grief for one already gone can't bring them back" },
    { line: 22, phrase: "impeachments", definition: "formal accusations of treason" },
    { line: 27, phrase: "deceit should steal such gentle shapes", definition: "that treachery should borrow such gentle appearances" },
    { line: 28, phrase: "virtuous vizard", definition: "virtuous mask — vizard = visor/mask" },
    { line: 30, phrase: "from my dugs he drew not this deceit", definition: "he did not nurse this treachery from my breasts — the Duchess distances herself from Richard's evil" },
    { line: 36, phrase: "black despair", definition: "theological despair — the sin that precludes salvation (cf. 1.2.84 and the ghost scene)" },
    { line: 41, phrase: "Why grow the branches now the root is wither’d", definition: "Elizabeth's formal arboreal lament — why does life continue when its source is dead?" },
    { line: 46, phrase: "kingdom of perpetual rest", definition: "heaven; the afterlife" },
    { line: 51, phrase: "two mirrors of his princely semblance", definition: "Edward IV and Clarence — each reflecting the father York" },
    { line: 53, phrase: "one false glass", definition: "one deceiving mirror — Richard, the third son, who falsely reflects his father" },
    { line: 60, phrase: "moiety", definition: "half; portion — the Duchess claims greater grief" },
    { line: 61, phrase: "overgo thy plaints", definition: "exceed thy lamentations" },
    { line: 65, phrase: "widow-dolour", definition: "widow's sorrow — 'dolour' = pain" },
    { line: 68, phrase: "govern’d by the watery moon", definition: "ruled by the moon (which governs tides) — tears as tide-water" },
    { line: 80, phrase: "Their woes are parcell’d", definition: "their sorrows are partial; mine are whole" },
    { line: 86, phrase: "sorrow’s nurse", definition: "nurse to sorrow — the Duchess frames herself as grief's foster-mother" },
    { line: 88, phrase: "Comfort, dear mother", definition: "Dorset's rebuke — the queen's son urges Christian resignation" },
    { line: 94, phrase: "royal debt it lent you", definition: "heaven lent Edward's life and now calls in the loan" },
    { line: 109, phrase: "butt-end", definition: "the stock-end of a weapon; the last part — Richard's aside on his mother's blessing" },
    { line: 115, phrase: "harvest of his son", definition: "Buckingham's image — reaping the new king's bounty" },
    { line: 117, phrase: "splinter’d", definition: "splinted; held together with splints (the surgeon's term)" },
    { line: 120, phrase: "Ludlow", definition: "Ludlow Castle, Shropshire — Prince Edward's household was established there" },
    { line: 126, phrase: "estate is green", definition: "the state is new, unseasoned" },
    { line: 148, phrase: "index to the story", definition: "table-of-contents of the story — Buckingham's metaphor for their earlier plotting" },
    { line: 150, phrase: "my counsel’s consistory", definition: "my counsel's assembly — 'consistory' = ecclesiastical court; Richard elevates Buckingham's status" },
    { line: 151, phrase: "My oracle, my prophet", definition: "Richard's flattery of Buckingham — the religious vocabulary foreshadows 3.7's staged piety" },
  ];

  // ── 2.3 — A street. Three citizens on the news ────────────────────────
  GLOSSES.richard_iii_act2_scene3 = [
    { line: 4, phrase: "by’r lady", definition: "by Our Lady — a mild oath, invoking the Virgin Mary" },
    { line: 4, phrase: "seldom comes the better", definition: "rarely does something better follow — proverbial" },
    { line: 8, phrase: "God help the while", definition: "God help us in the meantime" },
    { line: 11, phrase: "Woe to the land that’s govern’d by a child", definition: "Ecclesiastes 10:16, 'Woe to thee, O land, when thy king is a child'" },
    { line: 13, phrase: "nonage", definition: "minority; period before legal adulthood" },
    { line: 17, phrase: "Henry the Sixth / Was crown’d in Paris but at nine months old", definition: "Henry VI was crowned infant king of both England (1422) and France (1431) — the citizen's historical analogy" },
    { line: 18, phrase: "God wot", definition: "God knows" },
    { line: 20, phrase: "politic grave counsel", definition: "wise, weighty political advice" },
    { line: 25, phrase: "emulation", definition: "rivalry, competitive ambition" },
    { line: 28, phrase: "haught", definition: "haughty; proud" },
    { line: 30, phrase: "sickly land might solace", definition: "ailing land might find comfort" },
    { line: 32, phrase: "When clouds appear, wise men put on their cloaks", definition: "the Third Citizen's proverb-cluster; Shakespeare gives the common reader the playwright's own foreshadowing" },
    { line: 35, phrase: "Untimely storms make men expect a dearth", definition: "storms out of season signal a coming famine — political weather-lore" },
    { line: 44, phrase: "boisterous storm", definition: "violent storm" },
    { line: 46, phrase: "sent for to the justices", definition: "summoned to the justices of the peace — routine citizen duty" },
  ];

  // ── 2.4 — The palace. Elizabeth flees to sanctuary ────────────────────
  GLOSSES.richard_iii_act2_scene4 = [
    { line: 1, phrase: "Northampton", definition: "town in Northamptonshire — stopping point on the route from Ludlow" },
    { line: 2, phrase: "Stony-Stratford", definition: "Stony Stratford — the nearby village where Richard in fact arrested Rivers and Grey" },
    { line: 7, phrase: "overta’en him in his growth", definition: "caught up with him in height" },
    { line: 13, phrase: "Small herbs have grace, great weeds do grow apace", definition: "small plants are graceful; weeds grow fast — Gloucester's proverb, turned against him by the clever York" },
    { line: 23, phrase: "if I had been remember’d", definition: "if I had recollected (the story)" },
    { line: 24, phrase: "flout", definition: "mocking reply; jeer" },
    { line: 28, phrase: "gnaw a crust at two hours old", definition: "the folk-tale of Richard born with teeth — transmitted by More and Holinshed, Shakespeare's source" },
    { line: 30, phrase: "biting jest", definition: "sharp joke — York's deliberate pun on 'biting' given the teeth legend" },
    { line: 35, phrase: "parlous", definition: "dangerously precocious; perilous (from 'perilous')" },
    { line: 37, phrase: "Pitchers have ears", definition: "jugs have handles ('ears') and children overhear adult talk — proverbial" },
    { line: 41, phrase: "Pomfret", definition: "Pontefract Castle, Yorkshire — notorious royal prison; site of Rivers, Grey, Vaughan's execution" },
    { line: 49, phrase: "tiger now hath seized the gentle hind", definition: "tiger seizing the doe — emblem of tyranny preying on innocence" },
    { line: 50, phrase: "jet", definition: "strut, swagger" },
    { line: 51, phrase: "aweless throne", definition: "throne that commands no awe — a child-king's weak majesty" },
    { line: 53, phrase: "as in a map", definition: "as if in a map, in miniature — Elizabeth sees the whole catastrophe laid out" },
    { line: 54, phrase: "wrangling days", definition: "quarrelsome, strife-filled times — the whole Wars of the Roses in one phrase" },
    { line: 59, phrase: "domestic broils", definition: "civil strife; quarrels at home" },
    { line: 62, phrase: "preposterous", definition: "reversed, upside-down (Latin pre-post — before-after inverted)" },
    { line: 63, phrase: "spleen", definition: "passion, ill-temper — the spleen was believed the seat of violent emotions" },
    { line: 65, phrase: "we will to sanctuary", definition: "we will take refuge in Westminster Abbey's sanctuary — church ground immune to arrest" },
    { line: 70, phrase: "seal I keep", definition: "the Great Seal of England — the Archbishop's office to keep; he surrenders it to Elizabeth" },
    { line: 71, phrase: "tender", definition: "cherish, care for" },
  ];

};
