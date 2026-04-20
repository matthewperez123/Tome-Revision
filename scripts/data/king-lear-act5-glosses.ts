/**
 * King Lear — Act V glosses. 5.3 (Tier 1) carries "Howl, howl, howl,
 * howl!", the dead Cordelia, and the final couplet with its textual
 * crux (Edgar vs. Albany).
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 5.1 — The British camp near Dover (78 lines) ────────────────────
  GLOSSES.king_lear_act5_scene1 = [
    { line: 1, phrase: "know", definition: "ascertain" },
    { line: 5, phrase: "constant pleasure", definition: "fixed intention" },
    { line: 10, phrase: "full-flowing stomach", definition: "overflowing anger" },
    { line: 15, phrase: "ground-rid", definition: "run aground" },
    { line: 25, phrase: "conceive", definition: "imagine" },
    { line: 30, phrase: "self-reproving", definition: "Albany's scruple — he's uneasy about this war" },
    { line: 35, phrase: "domestic and particular broils", definition: "private quarrels — Albany distinguishes public from private cause" },
    { line: 42, phrase: "the ancient of war", definition: "the veteran officers" },
    { line: 50, phrase: "jealous", definition: "suspicious" },
    { line: 55, phrase: "his countenance", definition: "his countenance / authority" },
    { line: 60, phrase: "Both? one? or neither?", definition: "Edmund's cool calculation between Goneril and Regan" },
    { line: 65, phrase: "carry out my side", definition: "carry out my purpose" },
    { line: 70, phrase: "state / Stands", definition: "my fortunes depend on this" },
  ];

  // ── 5.2 — A field between the two camps (13 lines) ──────────────────
  GLOSSES.king_lear_act5_scene2 = [
    { line: 2, phrase: "the father", definition: "Gloucester, led by Edgar" },
    { line: 6, phrase: "ripeness is all", definition: "Edgar's line — maturity / readiness to die is everything; echo of Hamlet's 'readiness is all'" },
    { line: 10, phrase: "ta’en", definition: "taken (captured)" },
  ];

  // ── 5.3 — The British camp (380 lines) — TIER 1, ≥30 glosses ────────
  GLOSSES.king_lear_act5_scene3 = [
    { line: 1, phrase: "Some officers take them away", definition: "Edmund's order to take Lear and Cordelia into custody" },
    { line: 9, phrase: "birds i’ the cage", definition: "Lear's tender image of his coming imprisonment with Cordelia — love as enclosure, not loss" },
    { line: 10, phrase: "When thou dost ask me blessing, I’ll kneel down / And ask of thee forgiveness", definition: "Lear's complete inversion of patriarchal hierarchy — father to daughter on his knees" },
    { line: 15, phrase: "gilded butterflies", definition: "gaudy courtiers — Lear and Cordelia will laugh at them from the cage" },
    { line: 18, phrase: "great ones / That ebb and flow by the moon", definition: "the fickle powerful whose fortunes wax and wane" },
    { line: 20, phrase: "mystery of things", definition: "the secret of existence — Lear imagines he and Cordelia will see to its depth" },
    { line: 22, phrase: "packs and sects of great ones", definition: "political factions" },
    { line: 28, phrase: "starve first", definition: "Lear's ferocity — they will resist enforced separation" },
    { line: 30, phrase: "he that parts us", definition: "whoever tries to separate us — Lear's promise to resist" },
    { line: 50, phrase: "Know thou this", definition: "Edmund gives secret orders to hang Cordelia" },
    { line: 55, phrase: "as the time is", definition: "as circumstances require" },
    { line: 60, phrase: "valiant strain", definition: "Albany commends Edmund's battlefield conduct — unaware of his treacheries" },
    { line: 120, phrase: "toad-spotted", definition: "stained like a toad's back — Albany's heraldic-grotesque insult for Goneril" },
    { line: 135, phrase: "Hold, sir", definition: "Edgar, in full armor, answers the challenge and fights Edmund" },
    { line: 185, phrase: "bloody proclamation", definition: "the wanted-poster for Edgar — now overturned" },
    { line: 200, phrase: "List a brief tale", definition: "Edgar narrates his and Gloucester's sufferings" },
    { line: 210, phrase: "Burst smilingly", definition: "Gloucester's heart 'burst smilingly' when Edgar revealed himself — grief and joy together" },
    { line: 225, phrase: "lawful", definition: "Edmund's illegitimacy — now conceding that 'lawful' offspring had the advantage" },
    { line: 240, phrase: "some good I mean to do", definition: "Edmund's dying wish — revoke the order to kill Cordelia" },
    { line: 250, phrase: "token of reprieve", definition: "proof to stop the execution" },
    { line: 255, phrase: "Run, run", definition: "Albany's desperate command" },
    { line: 256, phrase: "fordid herself", definition: "killed herself — Edmund's report of Goneril's suicide" },
    { line: 257, phrase: "Howl, howl, howl, howl!", definition: "Lear entering with Cordelia's body — four repetitions of a single word; commonly called the most devastating line in Shakespeare" },
    { line: 258, phrase: "men of stones", definition: "Lear's rebuke of everyone present — if they had any heart they would cry the vault of heaven apart" },
    { line: 259, phrase: "heaven’s vault should crack", definition: "the sky should shatter from grief" },
    { line: 260, phrase: "She’s gone for ever!", definition: "Lear's immediate statement of the truth he will spend the rest of the scene refusing" },
    { line: 263, phrase: "feather stirs", definition: "Lear hopes for a sign of breath — puts a feather at Cordelia's mouth" },
    { line: 270, phrase: "poor fool", definition: "Lear's term of endearment for Cordelia — 'fool' as beloved, NOT a reference to the Fool of the earlier acts" },
    { line: 275, phrase: "Why should a dog, a horse, a rat, have life, / And thou no breath at all?", definition: "the most famous theological protest in the play — the bare injustice of Cordelia's death against animal survival" },
    { line: 278, phrase: "Thou’lt come no more", definition: "Lear's incantation against hope" },
    { line: 279, phrase: "Never, never, never, never, never", definition: "Lear's fivefold 'never' — the inverse of the fourfold 'Howl'; two numerical extremes bracketing his collapse" },
    { line: 281, phrase: "Pray you, undo this button", definition: "Lear's dying request — his collar is choking him; the smallness of the gesture is what makes it unbearable" },
    { line: 283, phrase: "Look there, look there!", definition: "Lear dies believing he sees Cordelia alive — the play's final ambiguity about death and perception" },
    { line: 295, phrase: "rack of this tough world", definition: "the instrument of torture — the world stretching him to breaking" },
    { line: 310, phrase: "The weight of this sad time we must obey; / Speak what we feel, not what we ought to say", definition: "the play's closing couplet — in some editions spoken by Edgar (who becomes king), in others by Albany (who steps aside); the speaker-attribution is a textual crux that shapes interpretation" },
    { line: 312, phrase: "oldest hath borne most", definition: "the old suffered most" },
    { line: 313, phrase: "we that are young / Shall never see so much, nor live so long", definition: "the final line — the survivors will never endure what has passed, nor match the elders in years" },
  ];
};
