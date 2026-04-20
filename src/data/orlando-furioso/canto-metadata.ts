/**
 * Orlando Furioso — per-canto metadata used by the reader's header chrome.
 *
 * Ariosto's poem is 46 cantos of ottava rima (ABABABCC), preceded in the
 * Tome reader by a prose editor's introduction. The chapter indices in
 * public/content/orlando-furioso/ are:
 *   ch-0  = Introduction (editor's front matter)
 *   ch-1  = Canto I
 *   ...
 *   ch-46 = Canto XLVI
 *
 * Each canto gets:
 *   - a Roman numeral (Ariosto's own numbering)
 *   - a one-sentence scholarly argument (the interlaced-storyline shape,
 *     no reveals beyond what a 19c edition's table-of-contents summary
 *     would have named)
 *   - an opening line, drawn from Rose's 1823–31 English verse — used as
 *     a subtle epigraph under the Roman numeral.
 *
 * Because Rose's text is the only public-domain English Orlando Furioso,
 * the reader's front-matter carries a translation-caveat block. That
 * belongs in the Introduction chapter chrome, not here.
 */

export const ORLANDO_FURIOSO_CANTO_COUNT = 46

/** Maps ch-N index → canto number (1–46), or null for front matter. */
export function cantoNumberForChapter(chapterIndex: number): number | null {
  // ch-0 = Introduction, ch-1 = Canto I, ch-N = Canto N.
  if (chapterIndex < 1) return null
  if (chapterIndex > ORLANDO_FURIOSO_CANTO_COUNT) return null
  return chapterIndex
}

export const ROMAN: Record<number, string> = {
  1:  "I",    2:  "II",   3:  "III",  4:  "IV",   5:  "V",
  6:  "VI",   7:  "VII",  8:  "VIII", 9:  "IX",   10: "X",
  11: "XI",   12: "XII",  13: "XIII", 14: "XIV",  15: "XV",
  16: "XVI",  17: "XVII", 18: "XVIII",19: "XIX",  20: "XX",
  21: "XXI",  22: "XXII", 23: "XXIII",24: "XXIV", 25: "XXV",
  26: "XXVI", 27: "XXVII",28: "XXVIII",29: "XXIX",30: "XXX",
  31: "XXXI", 32: "XXXII",33: "XXXIII",34: "XXXIV",35: "XXXV",
  36: "XXXVI",37: "XXXVII",38:"XXXVIII",39: "XXXIX",40: "XL",
  41: "XLI",  42: "XLII", 43: "XLIII",44: "XLIV", 45: "XLV",
  46: "XLVI",
}

/**
 * One-sentence canto arguments — first-pass scholarly summaries modeled on
 * Harington (1591) and early Italian prose arguments. Intent: tell the
 * reader which storyline(s) each canto advances, so a reader returning
 * after a gap can re-orient quickly. Works in tandem with the Storyline
 * Tracker (src/data/orlando-furioso/storylines.ts).
 */
export const CANTO_ARGUMENTS: Record<number, string> = {
  1:  "Angelica flees Rinaldo; Ferraù fishes vainly for his lost helmet and is shamed by Argalìa's ghost; Sacripante, weeping beside her sleeping form, is unhorsed by an unknown knight who proves to be Bradamante.",
  2:  "Rinaldo and Sacripante clash over Angelica; a hermit's spirit sends Rinaldo to Paris by false report; Bradamante seeks Ruggiero and is thrown by a pagan into an enchanted cave.",
  3:  "In Merlin's tomb the prophetess Melissa unrolls for Bradamante the parade of the House of Este — Ariosto's direct imitation of Anchises' parade in Aeneid VI.",
  4:  "Bradamante rides to Atlante's iron castle where Ruggiero is captive; she breaks the enchantment; the hippogriff carries Ruggiero away to Alcina's island.",
  5:  "At the Scottish court Rinaldo hears the tale of Ginevra and Ariodante — love accused, honor defended — and champions the slandered princess.",
  6:  "Ruggiero arrives at Alcina's island; the myrtle that was once the knight Astolfo warns him; the sorceress's first appearance, all gold and seduction.",
  7:  "Alcina's feast, bed, and apparent paradise; Melissa arrives with Atlante's ring and strips the illusion — Alcina's true, withered, ancient face revealed.",
  8:  "Ruggiero flees to Logistilla's realm; Rinaldo sails to England for aid; Angelica, captured by a hermit, is bound naked to the rock of Ebuda to feed the orc.",
  9:  "Orlando, sleepless with love, deserts Charlemagne's camp in disguise and rides into the world in search of Angelica; he rescues Olimpia from Cimosco's guns — Ariosto's lament for firearms.",
  10: "Olimpia's husband abandons her on a desert island; Ruggiero on the hippogriff rescues Angelica from the orc, unbinds her from the rock, and is deceived by the ring's invisibility.",
  11: "Ruggiero loses Angelica, who vanishes with the ring; Orlando kills the orc at Ebuda and recovers Olimpia; the Saracen siege of Paris presses on.",
  12: "Atlante's palace of illusion traps Ruggiero, Orlando, Ferraù, Sacripante, and others — each knight pursues his own phantom down endless corridors; Angelica, invisible, looks on.",
  13: "Orlando rescues Isabella from a cave of brigands; Bradamante, still seeking Ruggiero, is given the history of her House and the names of its future women.",
  14: "Agramante musters his Saracen host before Paris and counts his losses; Mandricardo enters the poem seeking revenge; Rodomonte rages at the walls of Paris.",
  15: "Astolfo rides the hippogriff from Logistilla's kingdom across Asia and Africa toward Europe; at Damietta he is given the magic horn and the book of spells.",
  16: "The siege of Paris turns on Rodomonte, who breaks the walls single-handed and butchers the defenders inside the city — the poem's most concentrated martial horror.",
  17: "Within the burning Paris, Rodomonte fights as a wolf among sheep; Charlemagne rallies the paladins; Grifone arrives in Damascus and is dishonored.",
  18: "Rodomonte, wounded and cheated of victory, quits Paris in a rage; the pagan women Doralice and Marfisa enter the braid; Cloridano and Medoro steal out by night to bury their lord.",
  19: "Medoro, wounded recovering Dardinello's corpse, is nursed by Angelica — who falls in love with the common Saracen soldier and marries him in a forest chapel. Orlando's catastrophe is seeded.",
  20: "Marfisa and her companions land among the Amazons of the Femine Homicide, whose law compels combat and bed; the Saracen embassies sent from Agramante collapse in personal feud.",
  21: "The knight Filandro's tale — a woman's vengeance worked through a man's mistaken blade — a dark novella inside the chivalric frame.",
  22: "Astolfo, returning westward, finds Atlante's palace of illusion and destroys it with his horn; Ruggiero and Bradamante finally meet again and ride off together.",
  23: "ORLANDO'S MADNESS BEGINS. In the forest chapel where Angelica and Medoro were married, Orlando reads their names carved into the trees; the proof destroys him; he strips his armor and runs mad.",
  24: "Orlando raging naked across the countryside; Zerbino and Isabella find his armor by a stream and mourn; Zerbino is slain by Mandricardo; Isabella rides on with the corpse.",
  25: "Ruggiero and Marfisa discover at last that they are brother and sister, children of Ruggiero of Risa and the pagan woman he loved; the dynastic shape of the poem tightens.",
  26: "Under an allegorical fountain in the forest the knights read the carving of coming battles; the matter of Merlin's prophecy is renewed.",
  27: "In the Saracen camp the feuds over Doralice, Frontino, and Durindana ripen; Rodomonte withdraws in a jealous fury and swears vengeance on all women.",
  28: "Rodomonte hears the innkeeper's tale of Giocondo and Astolfo — two cuckolded kings who traveled the world and found no faithful woman — Ariosto's most notorious misogynist digression, given in a character's voice and answered by its outcome.",
  29: "Rodomonte, still woman-hating, tries to force the widowed Isabella, who tricks him into beheading her rather than surrender — her sacrifice makes him build a bridge-tower memorial to her.",
  30: "Orlando's madness rampages through Spain and across the Strait to Africa; Mandricardo and Ruggiero duel for Hector's arms; the pagan knighthood devours itself.",
  31: "Rinaldo, at last returning with English levies to Paris, is reconciled to his estranged brothers and sisters; Brandimarte arrives from Africa.",
  32: "Bradamante, believing Ruggiero has forsaken her for Marfisa, dons her armor and rides out to die; the misunderstanding that drives the rest of the dynastic plot.",
  33: "Astolfo, flown to Ethiopia on the hippogriff, lifts the curse from the blind Prester John; the English paladin is now the poem's agent of cosmic repair.",
  34: "Astolfo descends into the mouth of Hell for the tale of Lydia and the damned, then ascends the mountain of the Earthly Paradise — the threshold of the moon journey.",
  35: "ST. JOHN THE EVANGELIST receives Astolfo on the moon, shows him the valley of things lost on earth — vows, prayers, gifts to princes, old lovers' sighs, and Orlando's wits in a phial — and lectures him on the truth beneath poets' flattery.",
  36: "Bradamante and Marfisa meet at last and fight; the truth of Ruggiero's loyalty and of Marfisa's kinship to him is spoken over a grave.",
  37: "The widow Ullania and her queens seek redress from the tyrant Marganorre, whose hatred of women Bradamante, Marfisa, and Ruggiero overthrow in a single day's fighting.",
  38: "The envoys return; Charlemagne and Agramante agree to end the general war by single combat between chosen champions — a device to force the poem toward resolution.",
  39: "Astolfo, now returned from the moon with Orlando's wits stoppered in a phial, meets his mad cousin; the wits are restored; Orlando is himself again, with nothing to show Angelica for seven months of madness.",
  40: "The siege of Biserta — Astolfo, Orlando, and the Christian fleet carry the war into Africa; Agramante's capital falls.",
  41: "A storm at sea scatters Ruggiero's ship; cast up on a hermit's island, he is at last baptized — the conversion the dynastic plot has required from the beginning.",
  42: "Rinaldo, carried to the mantuan court of a jealous knight, is shown the golden cup of wife-testing and refuses to drink; the frame novella of cuckoldry is now interrogated from within.",
  43: "A merchant's tale of adultery answers the cup; Rinaldo's slow boat down the Po past the villas of Ariosto's own Ferrarese patrons — the most openly autobiographical canto.",
  44: "The armies converge on Lampedusa for the three-on-three combat — Orlando, Oliver, and Brandimarte for the Christians; Agramante, Sobrino, and Gradasso for the Saracens; Ruggiero and Bradamante's betrothal is set.",
  45: "On Lampedusa the three-on-three is fought; Brandimarte dies; Orlando kills Agramante; Christian victory closes the war of the poem.",
  46: "The court of Charlemagne celebrates Ruggiero and Bradamante's wedding; at the feast Rodomonte rides in and challenges Ruggiero to single combat; Ruggiero kills him. The poem ends as Rodomonte's furious soul, complaining, flies to the shades — Ariosto's deliberate imitation of the final lines of the Aeneid.",
}

/**
 * Opening lines — first line of Rose's English stanza 1 in each canto.
 * Used under the Roman numeral as a subtle epigraph, per the Don Juan
 * pattern. Populated for the demo-critical cantos in this first pass;
 * remaining cantos fall back to the opening of the proem which is
 * extractable from ch-N.json at render-time.
 */
export const CANTO_OPENINGS: Record<number, string> = {
  1:  "Of loves and ladies, knights and arms, I sing",
  2:  "O foul Injustice! that dost oft'nest prove",
  3:  "Who shall, O Phoebus! give me words that might",
  6:  "Most wretched is the man of evil mind",
  7:  "He who beyond his country's narrow sphere",
  8:  "Oh! how my soul with sore misgiving grieves",
  23: "With deep attention that good shepherd heard",
  24: "Who in the toils of love himself doth bind",
  33: "Of old, in Thunor's ire, Lycaon's race",
  34: "O hungry, fierce, and rav'nous Harpy-brood",
  35: "Who, lady, shall to that far region soar",
  39: "The sorrows of Orlando were so sore",
  46: "If'er, my lord, I saw your gracious face",
}

/**
 * Optional structural notes — prose arguments, interpolated novellas,
 * allegorical passages. The Introduction (ch-0) is editorial, not
 * Ariostan; ch-1 onward is the poem proper.
 */
export const CANTO_STRUCTURAL_NOTES: Partial<Record<number, string>> = {
  6:
    "Alcina's island — the Circe/Calypso/Dido inheritance compressed into a single sorceress. " +
    "The myrtle-that-was-Astolfo (VI.33–53) is the allegorical key: pleasure turns its lovers into unspeaking vegetable matter.",
  7:
    "Alcina's true face revealed (VII.73) — the most-imitated passage in the poem. " +
    "Direct source for Spenser's Duessa in Faerie Queene I.viii.",
  18:
    "The Cloridano–Medoro episode (XVIII.165–192, carried into XIX) is Ariosto's direct imitation of the Nisus and Euryalus episode of Aeneid IX. " +
    "Wire the classical cross-reference at first render of the night-sortie.",
  23:
    "THE STRUCTURAL CENTER OF THE POEM. Orlando's madness begins here. " +
    "The carving-of-names scene (XXIII.102–136) is among the most-cited moments in European verse romance.",
  34:
    "Astolfo's descent into Hell begins the moon sequence. " +
    "The ascent (XXXIV–XXXV) inverts the classical katabasis — Astolfo rises where Odysseus and Aeneas descend.",
  35:
    "The valley of things lost on the moon — Orlando's wits among them, but also vows, prayers, gifts to princes, alms given for show, and old lovers' sighs. " +
    "St. John's lecture on poets' flattery (XXXV.26–30) is Ariosto's meta-commentary on his own encomia of the Este.",
  46:
    "The poem ends with the death of Rodomonte, deliberately imitating the death of Turnus that closes the Aeneid. " +
    "The last stanza's final line echoes Aeneid XII.952: 'vitaque cum gemitu fugit indignata sub umbras.' " +
    "Wire the closing cross-reference at render time.",
}

export const FRONT_MATTER_CHAPTERS: Record<number, { title: string; note: string }> = {
  0: {
    title: "Introduction",
    note:
      "A 19c editor's introduction to the Rose translation. Discusses Ariosto's Ferrara, the poem's " +
      "composition over three editions (1516, 1521, 1532), its reception, and the limits of any English version. " +
      "Rose's 1823–31 verse is the only public-domain English Orlando Furioso — readers should know that " +
      "Waldman's prose and Reynolds's verse (both mid-20c) are more faithful but copyrighted, and that any English " +
      "Orlando is a compromise with Ariosto's ottava rima.",
  },
}
