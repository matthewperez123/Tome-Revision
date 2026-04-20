/**
 * King Lear — second supplementary gloss pass. Adds further coverage to
 * scenes with room for more, especially mid-act prose and the Tier-1
 * set-pieces.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {
  const append = (id: string, extra: SeedGloss[]) => {
    GLOSSES[id] = [...(GLOSSES[id] ?? []), ...extra];
  };

  // 1.1 — more Lear/Kent/France vocabulary
  append("king_lear_act1_scene1", [
    { line: 30, phrase: "fast intent", definition: "firm intention" },
    { line: 35, phrase: "shake all cares and business from our age", definition: "shed all responsibilities of old age" },
    { line: 42, phrase: "Conferring them on younger strengths", definition: "transferring duties to younger bodies" },
    { line: 67, phrase: "bounds", definition: "borders; limits of territory" },
    { line: 100, phrase: "obey", definition: "Cordelia's dutiful language" },
    { line: 130, phrase: "confirming", definition: "ratifying" },
    { line: 165, phrase: "lower’d", definition: "sunk; disgraced" },
    { line: 175, phrase: "On thine allegiance", definition: "by your oath of fealty — Lear's formal appeal" },
    { line: 205, phrase: "best object", definition: "the person most cherished" },
    { line: 225, phrase: "avouch it", definition: "declare it openly" },
    { line: 265, phrase: "unpriz’d, precious", definition: "unvalued but valuable — France's paradox on Cordelia" },
    { line: 295, phrase: "The best and soundest of his time hath been but rash", definition: "even his best years were impulsive — Goneril's retrospective diagnosis" },
    { line: 305, phrase: "imperfections of long-engraffed condition", definition: "flaws of a character deeply grafted in" },
  ]);

  // 1.4 — more
  append("king_lear_act1_scene4", [
    { line: 40, phrase: "diligence", definition: "dutiful attention" },
    { line: 55, phrase: "so wag", definition: "let things proceed" },
    { line: 62, phrase: "bandy looks", definition: "trade glances in rivalry" },
    { line: 75, phrase: "football", definition: "Kent trips Oswald — football was a rough game of commoners" },
    { line: 125, phrase: "Ladybird", definition: "sweet — the Fool's pet name inverted" },
    { line: 170, phrase: "the name, and all the additions", definition: "the title and its perquisites" },
    { line: 200, phrase: "Detested kite", definition: "hated bird of prey — Lear on Goneril" },
    { line: 240, phrase: "Torments", definition: "afflictions" },
    { line: 250, phrase: "cadent", definition: "falling" },
    { line: 270, phrase: "the untented woundings of a father’s curse", definition: "a father's curse as unhealable wounds" },
    { line: 290, phrase: "pierce every sense about thee", definition: "penetrate every nerve" },
  ]);

  // 3.4 — more Poor Tom
  append("king_lear_act3_scene4", [
    { line: 45, phrase: "Bless thy five wits", definition: "the five faculties — common sense, imagination, fantasy, estimation, memory" },
    { line: 60, phrase: "star-blasting", definition: "astral poisoning" },
    { line: 68, phrase: "the foul fiend haunts poor Tom", definition: "Tom's constant refrain — demonic harassment" },
    { line: 100, phrase: "prince of darkness", definition: "the devil, but Tom figures him as a gentleman" },
    { line: 115, phrase: "silkworm", definition: "a creature producing silk — Lear on what a bare man owes a silkworm for his clothes" },
    { line: 125, phrase: "sophisticated", definition: "made complex by civilisation — Lear contrasting clothed man with bare man" },
    { line: 135, phrase: "Come, unbutton here", definition: "Lear tearing at his own clothes — prefigures his final 'undo this button'" },
    { line: 145, phrase: "rustic", definition: "country; of the uncivilised" },
  ]);

  // 3.7 — more blinding
  append("king_lear_act3_scene7", [
    { line: 15, phrase: "presently", definition: "immediately" },
    { line: 20, phrase: "Pinion him", definition: "bind his arms — bracketing Gloucester before the torture" },
    { line: 34, phrase: "Naughty lady", definition: "wicked woman — Gloucester to Regan; 'naughty' is Jacobean severe, not modern mild" },
    { line: 50, phrase: "host", definition: "one who owes the duty of hospitality — the very category Cornwall and Regan are violating" },
    { line: 60, phrase: "buoy’d up", definition: "risen up to cover" },
    { line: 78, phrase: "flax and whites of eggs", definition: "folk remedy for eye-injury; Regan's contemptuous dismissal of treatment" },
    { line: 95, phrase: "jelly", definition: "the eye reduced to biological substrate — the line's shock" },
    { line: 105, phrase: "Untimely comes this hurt", definition: "Cornwall, wounded, recognises his injury" },
  ]);

  // 4.6 — more Dover
  append("king_lear_act4_scene6", [
    { line: 35, phrase: "a worthier way", definition: "a more honorable course" },
    { line: 45, phrase: "Feathers", definition: "light things — Edgar's lie that Gloucester's fall was cushioned" },
    { line: 60, phrase: "gossamer", definition: "cobweb" },
    { line: 73, phrase: "Ten masts at each make not the altitude", definition: "ten ships' masts stacked wouldn't reach the cliff's height" },
    { line: 85, phrase: "bourn", definition: "boundary; cliff-edge" },
    { line: 95, phrase: "beguile", definition: "cheat" },
    { line: 107, phrase: "press-money", definition: "recruiting pay" },
    { line: 115, phrase: "stout", definition: "brave" },
    { line: 128, phrase: "bird", definition: "Lear's pun-memory — the archer's target-bird" },
    { line: 150, phrase: "trick of that voice", definition: "mannerism — Lear recognising Gloucester by voice" },
    { line: 165, phrase: "What was thy cause?", definition: "what offense have you committed? — Lear's mock-court on the heath" },
    { line: 175, phrase: "fitchew", definition: "polecat; prostitute — Lear's misogynist rant turning zoological" },
    { line: 185, phrase: "soiled horse", definition: "pastured and ready-to-bolt horse — Lear's sexual figure" },
    { line: 200, phrase: "Look with thine ears", definition: "listen — Lear's synaesthetic command" },
    { line: 225, phrase: "obscured course", definition: "hidden path" },
  ]);

  // 5.3 — more closing
  append("king_lear_act5_scene3", [
    { line: 22, phrase: "God's spies", definition: "Lear's name for himself and Cordelia — eavesdroppers on divine purposes" },
    { line: 38, phrase: "starve first", definition: "Lear's ferocity — they will resist by starvation before separation" },
    { line: 65, phrase: "plume", definition: "feather — a formality of honor" },
    { line: 95, phrase: "Sir, you have shown today your valiant strain", definition: "Albany complimenting Edmund's fighting — unaware of treachery" },
    { line: 115, phrase: "false to thy gods", definition: "perjured — Edgar's charges against Edmund" },
    { line: 125, phrase: "trumpet blow him to his master's flag", definition: "a herald's summons" },
    { line: 140, phrase: "noble vessel", definition: "the armored Edgar" },
    { line: 148, phrase: "protest", definition: "formal declaration" },
    { line: 195, phrase: "exchange charity", definition: "forgive and be forgiven — Edgar to the dying Edmund" },
    { line: 218, phrase: "wretchedness", definition: "misery; degraded state" },
    { line: 230, phrase: "puissant", definition: "powerful" },
    { line: 240, phrase: "a swoon", definition: "fainting — Gloucester's heart bursting smilingly as he heard his son's story" },
    { line: 268, phrase: "fordid", definition: "destroyed; killed" },
    { line: 305, phrase: "bliss or pain", definition: "heaven or hell" },
    { line: 312, phrase: "Is this the promis'd end?", definition: "Kent asks if the apocalypse has come — the play's only line pointing openly to the Book of Revelation" },
    { line: 313, phrase: "image of that horror", definition: "Edgar: this is only a picture of the promised end, not the end itself" },
  ]);
};
