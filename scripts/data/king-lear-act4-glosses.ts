/**
 * King Lear — Act IV glosses. 4.6 Dover cliff (Tier 1) is the largest
 * concentration; "As flies to wanton boys" lives in 4.1.
 */

interface SeedGloss { line: number; phrase: string; definition: string; }

module.exports = function (GLOSSES: Record<string, SeedGloss[]>) {

  // ── 4.1 — The heath (85 lines) ──────────────────────────────────────
  GLOSSES.king_lear_act4_scene1 = [
    { line: 1, phrase: "contemn’d", definition: "despised" },
    { line: 4, phrase: "dejected thing of fortune", definition: "object abased by fortune" },
    { line: 6, phrase: "laughter", definition: "a subject for laughter — darkly ironic" },
    { line: 10, phrase: "reels", definition: "staggers" },
    { line: 18, phrase: "my old heart is crack’d, is crack’d", definition: "Gloucester's doubled phrase — grief repeated as fracture" },
    { line: 21, phrase: "Our means secure us", definition: "our comforts make us careless" },
    { line: 24, phrase: "Ang’ring itself", definition: "vexing itself" },
    { line: 30, phrase: "worse", definition: "we are not at the worst / as long as we can say / 'This is the worst'" },
    { line: 36, phrase: "As flies to wanton boys are we to the gods; / They kill us for their sport", definition: "Gloucester's most famous line — the play's theological centerpiece; the gods treat humans as cruel boys treat insects" },
    { line: 37, phrase: "wanton", definition: "wanton in the old sense — undisciplined, cruel-playful" },
    { line: 45, phrase: "ancient love", definition: "long-standing affection" },
    { line: 52, phrase: "Get thee away", definition: "Gloucester's command — concerned for Tom's safety" },
    { line: 56, phrase: "Flibbertigibbet", definition: "demon from Harsnett's 1603 Declaration — recurs here from 3.4" },
    { line: 58, phrase: "Obidicut", definition: "demon from Harsnett's 1603 Declaration — a devil of lust" },
    { line: 59, phrase: "Hobbididance", definition: "demon from Harsnett's 1603 Declaration — one of the four 'princes' Poor Tom invokes" },
    { line: 60, phrase: "Mahu", definition: "demon from Harsnett's 1603 Declaration — recurs from 3.4" },
    { line: 60, phrase: "Modo", definition: "demon from Harsnett's 1603 Declaration — recurs from 3.4" },
    { line: 70, phrase: "lust-dieted", definition: "lust-fed — the luxurious who live on desire" },
    { line: 71, phrase: "slaves your ordinance", definition: "enslaves God's ordained order" },
    { line: 72, phrase: "superfluous and lust-dieted man", definition: "the over-fed rich — Gloucester's echo of Lear's 3.4 speech" },
    { line: 76, phrase: "Distribution should undo excess", definition: "wealth-sharing should erase excess — Gloucester's second echo of Lear" },
  ];

  // ── 4.2 — Before Albany's palace (110 lines) ────────────────────────
  GLOSSES.king_lear_act4_scene2 = [
    { line: 2, phrase: "mild husband", definition: "gentle husband — Goneril's contempt for Albany" },
    { line: 3, phrase: "cowish", definition: "cowardly" },
    { line: 8, phrase: "militant", definition: "martial; warlike" },
    { line: 20, phrase: "conduct", definition: "escort" },
    { line: 25, phrase: "a woman’s services", definition: "wifely duties" },
    { line: 30, phrase: "mistress’s command", definition: "Goneril's authority over Edmund" },
    { line: 40, phrase: "disposition", definition: "temperament" },
    { line: 48, phrase: "head-lugg’d bear", definition: "bear led by the head — a dangerous animal" },
    { line: 50, phrase: "most barbarous, most degenerate", definition: "Albany's formula for Goneril's unnaturalness" },
    { line: 55, phrase: "visible spirits", definition: "embodied heavenly powers" },
    { line: 58, phrase: "vile offences", definition: "loathsome crimes" },
    { line: 62, phrase: "deep monsters of the deep", definition: "Albany: humanity will turn cannibal" },
    { line: 70, phrase: "moral fool", definition: "Goneril's jibe at Albany's moralizing" },
    { line: 75, phrase: "changed and self-cover’d", definition: "transformed and disguised — Goneril has put on a fiend's skin over her own" },
    { line: 80, phrase: "howl’st", definition: "howlest; shriekest — Albany's verdict" },
    { line: 88, phrase: "Slaughter-man", definition: "butcher; killer" },
    { line: 95, phrase: "the king is dead", definition: "false rumor of Cornwall's death — he has in fact been killed by the Servant's sword in 3.7" },
    { line: 105, phrase: "enormity", definition: "monstrous wickedness" },
  ];

  // ── 4.3 — The French camp near Dover (58 lines) — Q1-HEAVY SCENE ────
  GLOSSES.king_lear_act4_scene3 = [
    { line: 3, phrase: "imperfect in the state", definition: "ill-informed about politics" },
    { line: 6, phrase: "France", definition: "the French king" },
    { line: 7, phrase: "piercing letters", definition: "emotionally wounding news" },
    { line: 14, phrase: "dropped", definition: "let fall — tears" },
    { line: 17, phrase: "trill’d", definition: "trickled" },
    { line: 19, phrase: "rarity", definition: "extraordinary thing" },
    { line: 22, phrase: "happy smilets", definition: "pleasant little smiles" },
    { line: 28, phrase: "all the rubies", definition: "jewels — Cordelia's tears outshine rubies" },
    { line: 32, phrase: "heaved", definition: "sighed" },
    { line: 35, phrase: "clamour moisten’d", definition: "her grief wet with tears" },
    { line: 40, phrase: "stars", definition: "fate — the stars govern character, Kent says" },
    { line: 45, phrase: "Albany and Cornwall’s powers", definition: "the British forces" },
    { line: 50, phrase: "sovereign shame", definition: "Lear's governing emotion — shame" },
    { line: 53, phrase: "unkindness", definition: "against nature — Kent's understatement for what the sisters have done" },
    { line: 56, phrase: "dear cause", definition: "important matter" },
  ];

  // ── 4.4 — The same. A tent (32 lines) ───────────────────────────────
  GLOSSES.king_lear_act4_scene4 = [
    { line: 1, phrase: "Alack", definition: "alas" },
    { line: 3, phrase: "fumiter", definition: "fumitory — a weed-like plant" },
    { line: 4, phrase: "hardokes", definition: "hard-heads / knapweeds — another common weed" },
    { line: 4, phrase: "hemlock", definition: "poisonous herb — traditional symbol of death" },
    { line: 5, phrase: "cuckoo-flowers", definition: "lady's smock; fool's parsley — flowers associated with cuckoldry" },
    { line: 5, phrase: "Darnel", definition: "a weed-grass" },
    { line: 6, phrase: "idle weeds", definition: "worthless plants — the crown of weeds Lear now wears in his madness" },
    { line: 11, phrase: "simples operative", definition: "medicinal herbs" },
    { line: 15, phrase: "our foster-nurse of nature", definition: "sleep as mother-nature's nurse" },
    { line: 22, phrase: "husband’s powers", definition: "the French king's forces" },
    { line: 26, phrase: "our aged father’s right", definition: "Cordelia's pledge — she fights for Lear's restoration, not conquest" },
  ];

  // ── 4.5 — Gloucester's castle (44 lines) ────────────────────────────
  GLOSSES.king_lear_act4_scene5 = [
    { line: 2, phrase: "sister’s", definition: "Goneril's" },
    { line: 10, phrase: "nighted life", definition: "Gloucester's blind life" },
    { line: 15, phrase: "ignorant of the packet", definition: "unaware of the message" },
    { line: 20, phrase: "sister’s letter", definition: "Goneril's letter to Edmund — love-note" },
    { line: 25, phrase: "widow", definition: "Regan is now widowed (Cornwall is dead)" },
    { line: 30, phrase: "conjunct", definition: "joined; paired — Regan asserts her claim to Edmund over Goneril" },
  ];

  // ── 4.6 — Fields near Dover (262 lines) — DOVER CLIFF — TIER 1, ≥35 ─
  GLOSSES.king_lear_act4_scene6 = [
    { line: 1, phrase: "up the hill", definition: "Gloucester believes he's climbing toward the cliff — Edgar is leading him on level ground, reshaping reality by voice" },
    { line: 11, phrase: "dizzy", definition: "vertiginous — Edgar's described cliff makes even the reader dizzy" },
    { line: 13, phrase: "choughs", definition: "red-legged Cornish crows — the cliff-birds Edgar describes" },
    { line: 14, phrase: "midway air", definition: "halfway between top and bottom — the birds look small as beetles" },
    { line: 15, phrase: "gross as beetles", definition: "as big as beetles — the birds diminished by distance" },
    { line: 16, phrase: "samphire", definition: "a cliff-growing herb (Crithmum maritimum) — collected by men dangling on ropes, the figure makes vertigo" },
    { line: 17, phrase: "dreadful trade", definition: "the terrifying occupation of the samphire-gatherer" },
    { line: 18, phrase: "yon tall anchoring bark", definition: "that tall ship at anchor, now looking small" },
    { line: 19, phrase: "cock", definition: "cock-boat — small boat, reduced to a speck by distance" },
    { line: 20, phrase: "unnumber’d idle pebbles", definition: "countless restless stones — of the beach" },
    { line: 22, phrase: "I’ll look no more", definition: "Edgar breaks off his cliff-description, feigning vertigo" },
    { line: 33, phrase: "great affliction", definition: "Gloucester's grief — justification of his intended suicide" },
    { line: 34, phrase: "opposeless wills", definition: "the unopposable will (of the gods)" },
    { line: 37, phrase: "snuff", definition: "the stub of a candle — Gloucester's life reduced to this" },
    { line: 40, phrase: "worser spirit", definition: "evil impulse" },
    { line: 45, phrase: "Gone, sir, farewell", definition: "Gloucester's farewell as he falls forward — onto flat ground, though he doesn't know it" },
    { line: 55, phrase: "how far down to the gulf", definition: "how far did he fall" },
    { line: 60, phrase: "ten masts at each make not the altitude", definition: "ten ships' masts stacked would not reach the height — Edgar's lie reinforced" },
    { line: 68, phrase: "gossamer", definition: "fine spider-silk — which normally floats down; Gloucester should have shattered by now" },
    { line: 70, phrase: "Thy life’s a miracle", definition: "you still have your life — Edgar's therapeutic theater" },
    { line: 72, phrase: "summit", definition: "cliff-top — Gloucester is persuaded he fell from there" },
    { line: 75, phrase: "bourn", definition: "edge; boundary (of the cliff)" },
    { line: 79, phrase: "shrill-gorg’d", definition: "shrill-throated — the lark far above" },
    { line: 80, phrase: "henceforth I’ll bear / Affliction", definition: "Gloucester's new stoicism — Edgar has walked him through suicide and out the other side" },
    { line: 85, phrase: "Some fiend", definition: "Gloucester thinks a demon led him to the cliff — Edgar lets this stand" },
    { line: 86, phrase: "the clearest gods", definition: "the most glorious / just divinities — Edgar's retroactive theology" },
    { line: 89, phrase: "side-piercing sight", definition: "heart-piercing view — Edgar on seeing Lear enter in flower-crown" },
    { line: 93, phrase: "king himself", definition: "Lear enters mad, crowned with weeds" },
    { line: 100, phrase: "coining", definition: "minting coins — Lear's royal prerogative even in madness" },
    { line: 107, phrase: "press-money", definition: "advance pay given to press-ganged soldiers" },
    { line: 110, phrase: "Nature’s above art in that respect", definition: "Lear's line — nature exceeds art" },
    { line: 117, phrase: "bills", definition: "halberds — pole weapons" },
    { line: 120, phrase: "aqua vitae", definition: "strong spirits; brandy" },
    { line: 122, phrase: "clout", definition: "cloth target" },
    { line: 124, phrase: "hewgh", definition: "whizzing sound of an arrow — Lear sound-effects his own bowshot" },
    { line: 128, phrase: "rarity of nature", definition: "strange, singular creature" },
    { line: 135, phrase: "chink", definition: "crack; coin-slot" },
    { line: 140, phrase: "winks at the quirks", definition: "overlooks the quirks" },
    { line: 142, phrase: "Goneril, with a white beard!", definition: "Lear sees Gloucester and mis-recognizes him as a white-bearded Goneril — time and gender collapse in madness" },
    { line: 145, phrase: "They flattered me like a dog", definition: "Lear's bitter recognition of earlier flattery" },
    { line: 153, phrase: "Ay, every inch a king", definition: "Lear reasserting his majesty, even stripped of it" },
    { line: 158, phrase: "adultery", definition: "Lear's launched tirade against sexuality itself" },
    { line: 163, phrase: "Die for adultery!", definition: "Lear's sentence, instantly revoked — 'No: / The wren goes to't...'" },
    { line: 166, phrase: "wren", definition: "the tiniest bird — Lear's emblem for universal lust" },
    { line: 167, phrase: "small gilded fly", definition: "the shimmering insect — lusty in Lear's estimation" },
    { line: 170, phrase: "let copulation thrive", definition: "Lear's raging sanction of sexual license — dark irony" },
    { line: 175, phrase: "Down from the waist they are Centaurs", definition: "Lear: women are divine above, beast below — Ovidian/satirical misogyny at its peak" },
    { line: 181, phrase: "Give me an ounce of civet", definition: "Lear wants perfume to clear his imagination of female genitalia" },
    { line: 183, phrase: "apothecary", definition: "druggist" },
    { line: 188, phrase: "Let me wipe it first", definition: "Lear wipes Gloucester's hand, not noticing the blindness — profound pathos" },
    { line: 190, phrase: "squiny", definition: "squint at; look askance" },
    { line: 193, phrase: "mark but the penning of it", definition: "Lear asks Gloucester to read his non-existent challenge" },
    { line: 196, phrase: "Were all the letters suns", definition: "even if letters blazed like suns — Gloucester cannot see" },
    { line: 204, phrase: "A man may see how this world goes with no eyes", definition: "Lear's paradox of moral sight after physical blindness" },
    { line: 210, phrase: "This great stage of fools", definition: "Lear's most famous theatrum mundi line — the world as a stage populated by fools" },
    { line: 212, phrase: "When we are born, we cry that we are come / To this great stage of fools", definition: "Lear's full statement — birth itself is grief; the world is a theater of folly" },
    { line: 218, phrase: "I know thee well enough", definition: "Lear finally recognizing Gloucester — by speech, not sight" },
    { line: 225, phrase: "reason in madness", definition: "Edgar's aside — 'O, matter and impertinency mix'd! / Reason in madness!' — the play's key formulation of Lear's insight through derangement" },
    { line: 240, phrase: "Pass", definition: "live; pass through life" },
    { line: 250, phrase: "I am your boy", definition: "Edgar's self-effacement before the newly reconciled Lear" },
    { line: 258, phrase: "A sovereign shame so elbows him", definition: "Kent's report — shame so possesses Lear" },
  ];

  // ── 4.7 — A tent in the French camp (106 lines) — Lear wakes ────────
  GLOSSES.king_lear_act4_scene7 = [
    { line: 2, phrase: "O thou good Kent", definition: "Cordelia's thanks to the disguised Kent" },
    { line: 8, phrase: "meet to be known", definition: "fit to be revealed" },
    { line: 15, phrase: "untuned and jarring senses", definition: "Lear's mental discord figured as musical disharmony" },
    { line: 20, phrase: "child-changed father", definition: "a father transformed by his children's cruelty" },
    { line: 30, phrase: "temples", definition: "the sides of the head" },
    { line: 33, phrase: "warring winds", definition: "the storm — recalled" },
    { line: 40, phrase: "Had challeng’d pity of them", definition: "would have won pity from the elements themselves" },
    { line: 43, phrase: "poor perdu", definition: "forlorn sentinel — soldier on a lost post" },
    { line: 50, phrase: "I know not what to say", definition: "Lear, waking, cannot place himself" },
    { line: 55, phrase: "wheel of fire", definition: "Lear's vision of his punishment — the pagan/Christian image of a soul's eternal torment" },
    { line: 62, phrase: "mock me not", definition: "Lear cannot believe Cordelia is real" },
    { line: 65, phrase: "O, look upon me, sir", definition: "Cordelia's restraint — she lets Lear find her at his own pace" },
    { line: 70, phrase: "Pray you now, forget and forgive", definition: "Lear's most wounded line of self-knowledge" },
    { line: 80, phrase: "To match this deed", definition: "to match this outrage (the sisters')" },
  ];
};
