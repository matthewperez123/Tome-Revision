/**
 * Faerie Queene glosses — single-sentence tap-to-reveal definitions for
 * Spenser's 1596 second edition (Standard Ebooks, regularized spelling
 * retained where it does not impair reading). Follows the Paradise Lost /
 * Aeneid pattern:
 *
 *   - Annotations argue about meaning (paragraph, in a drawer).
 *   - Glosses identify (one sentence, on hover/tap).
 *
 * Coverage priorities:
 *
 *   1. Spenser's deliberate archaisms — *eftsoones*, *algate*, *sithens*,
 *      *yfere*, *whilom*, *ycleped*, *hight* — already felt old to his
 *      1590s readers; Spenser revives them to feel "like Chaucer."
 *   2. Allegorical proper names whose names encode their virtue or vice
 *      (Una = oneness/truth; Duessa = duplicity; Archimago = arch-imager;
 *      Sansfoy = without-faith; Orgoglio = Italian pride; Britomart =
 *      British Mars; etc.). The *meaning* of the name is the plot.
 *   3. Heraldic and armorial terminology (sable, gules, or, argent,
 *      trenchant, pauldron, habergeon) — Spenser is saturated with
 *      tournament vocabulary.
 *   4. Classical figures read through a Christianized-Neoplatonic lens
 *      (Proserpine as well as Demogorgon as well as Mammon — cross-book).
 *   5. Elizabethan court allegory markers — Belphoebe / Gloriana / the
 *      Faerie Queene all refer to the same historical Elizabeth.
 *
 * Phrase-matching: `phrase` must appear verbatim in the rendered HTML.
 * Spenser's orthography is preserved in the Standard Ebooks edition, so
 * "eftsoones" not "eftsoons", "yfere" not "yfere", "chevalrous" not
 * "chivalrous". Single-word proper names and archaisms match most
 * reliably across stanza line-breaks.
 *
 * `chapterIndex === -1` is a cross-canto gloss — first occurrence per
 * chapter is decorated by the reader.
 *
 * Phrase-matching caution: Book-boundary files (ch-*.book.json) and the
 * Letter to Ralegh (ch-0) use different surrounding markup from canto
 * files (ch-2 onward). Glosses for canto-only diction should scope to
 * the relevant canto's chapterIndex; cross-book archaisms use -1.
 */

export interface FaerieQueeneGloss {
  /** Chapter index in public/content/the-faerie-queene/ — or -1 for cross-book. */
  chapterIndex: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const FAERIE_QUEENE_GLOSSES: FaerieQueeneGloss[] = [

  // ── Cross-book: Spenserian archaisms ─────────────────────────────────
  { chapterIndex: -1, phrase: "eftsoones",
    definition: "Soon after, immediately afterwards — Spenser's favorite narrative connective, deliberately archaic in 1590 (already obsolete in standard English)." },
  { chapterIndex: -1, phrase: "sithens",
    definition: "Since, seeing that — a causal conjunction Spenser revives from Middle English; modern form is *since*." },
  { chapterIndex: -1, phrase: "algate",
    definition: "In any case, nevertheless, by all means — an archaic adverb meaning 'by every way' (all + gate, 'way')." },
  { chapterIndex: -1, phrase: "whilom",
    definition: "Formerly, once upon a time — the fairy-tale tense-marker Spenser uses for legendary backstory." },
  { chapterIndex: -1, phrase: "ycleped",
    definition: "Named, called — past participle of Old English *cleopian* 'to call', with the archaic y- prefix; Spenser uses it to invoke Chaucerian register." },
  { chapterIndex: -1, phrase: "hight",
    definition: "Is called, was named — an Old English passive preserved in Spenser and Shakespeare; from *hatan* 'to be named'." },
  { chapterIndex: -1, phrase: "yfere",
    definition: "Together, in company — archaic; from Old English *gefēra* 'companion'." },
  { chapterIndex: -1, phrase: "wight",
    definition: "A creature or person — from Old English *wiht*; neutral in register but consistently archaic in Spenser's usage." },
  { chapterIndex: -1, phrase: "carle",
    definition: "A peasant, churl, or rustic man — from Old Norse *karl* 'man'; Spenser uses it with a touch of condescension or menace." },
  { chapterIndex: -1, phrase: "swain",
    definition: "A young man, usually of country stock; a rustic lover in pastoral convention — Spenser inherits the pastoral register from the *Shepheardes Calender*." },
  { chapterIndex: -1, phrase: "losel",
    definition: "A worthless person, a wastrel — a contemptuous term Spenser applies to cowards, rogues, and the spiritually lazy." },
  { chapterIndex: -1, phrase: "caitiff",
    definition: "A despicable wretch, a coward — from Latin *captivus* (captive); in Spenser's register, a term of moral contempt." },
  { chapterIndex: -1, phrase: "paynim",
    definition: "A pagan (especially a Muslim, in the crusade-romance tradition); from Old French *paienisme*. Spenser uses it for the Saracen knights (Sansfoy, Sansloy, Sansjoy)." },
  { chapterIndex: -1, phrase: "weetlesse",
    definition: "Unwitting, unaware — Spenser's coinage built on Middle English *weet* ('know'); the plot-engine of romance deception turns on knights who are *weetlesse*." },
  { chapterIndex: -1, phrase: "welke",
    definition: "To wane, grow dim, or fade — Old English *wealcan*; Spenser uses it of the sun's setting and of beauty declining." },
  { chapterIndex: -1, phrase: "withouten",
    definition: "Without — the archaic *-en* ending gives the word a deliberately older, poetic register." },
  { chapterIndex: -1, phrase: "emprize",
    definition: "A chivalric enterprise or knightly quest; from Old French *emprise*. Spenser's standard register for the central action of each knight's book." },
  { chapterIndex: -1, phrase: "chevalrous",
    definition: "Chivalrous, knightly — Spenser's spelling preserves the French-derived *cheval* root more visibly than the later *chivalrous*." },

  // ── Cross-book: heraldic & armorial vocabulary ──────────────────────
  { chapterIndex: -1, phrase: "sable",
    definition: "In heraldry, black; by extension any deep black. Spenser uses it for ominous armor and for Night personified." },
  { chapterIndex: -1, phrase: "argent",
    definition: "In heraldry, silver or white; the tincture of Red Cross Knight's field, on which his blood-red cross lies (and of Britomart's armor)." },
  { chapterIndex: -1, phrase: "gules",
    definition: "In heraldry, red; Red Cross Knight's cross is gules on argent — the conventional emblem of St George and, by extension, of England." },
  { chapterIndex: -1, phrase: "launce",
    definition: "A lance — Spenser's spelling keeps the Anglo-French form; the knight's primary tournament weapon." },
  { chapterIndex: -1, phrase: "habergeon",
    definition: "A sleeveless coat of mail, shorter than a hauberk; Spenser's register for well-defended but not fully armored combatants." },
  { chapterIndex: -1, phrase: "trenchant",
    definition: "Cutting, keen-edged (of a blade); from Old French *trenchant*, present participle of *trenchier* 'to cut'." },
  { chapterIndex: -1, phrase: "baldricke",
    definition: "A sword-belt worn diagonally over one shoulder; in Spenser a mark of knightly rank or ceremonial weapon-carry." },
  { chapterIndex: -1, phrase: "palfrey",
    definition: "A saddle-horse, usually a lady's mount — distinct from the warhorse (*destrier*). Una rides a milk-white palfrey in Book I." },
  { chapterIndex: -1, phrase: "destrier",
    definition: "A knight's warhorse, bred and trained for the joust — larger and more aggressive than the palfrey." },
  { chapterIndex: -1, phrase: "targe",
    definition: "A small round or oval shield; distinct from the full-body *shield*. Spenser uses the pair (targe/shield) to distinguish light-skirmish from tournament combat." },

  // ── Cross-book: personified abstractions / allegorical figures ──────
  { chapterIndex: -1, phrase: "Faerie Queene",
    definition: "Gloriana, the sovereign of Faerie-Land, whose twelve knights each embody one virtue. Her historical double is Queen Elizabeth; the identification is set out in the Letter to Ralegh." },
  { chapterIndex: -1, phrase: "Gloriana",
    definition: "Name of the Faerie Queene in her glory-aspect; Spenser's allegorical compliment to Elizabeth I. Her knights each personify a Aristotelian virtue." },
  { chapterIndex: -1, phrase: "Belphoebe",
    definition: "The huntress-princess of Book III, sister to Amoret; Spenser's figure for Elizabeth I in her virgin-queen aspect, paralleling Gloriana's regal aspect. From Italian *bel* (beautiful) + Phoebe (Diana)." },
  { chapterIndex: -1, phrase: "Una",
    definition: "Book I's central lady, daughter of the king and queen of Eden; her name is Latin *una* 'one', the allegorical figure of Truth — which, like God, is one." },
  { chapterIndex: -1, phrase: "Duessa",
    definition: "The antagonist-witch of Books I, II, IV, and V; her name is Italian *due* 'two', the figure of Duplicity — the false church / double-tongued appearance. Unmasked as hideous when stripped." },
  { chapterIndex: -1, phrase: "Archimago",
    definition: "The arch-illusionist-magician; name from Greek *archi-* 'chief' + Italian *imago* 'image'. The figure of hypocrisy, of false religion manufacturing deceptive appearances." },
  { chapterIndex: -1, phrase: "Orgoglio",
    definition: "Italian for 'pride' — the giant of Book I, canto VII; the earth-born personification of spiritual pride that captures Red Cross Knight after he drinks from the enchanted stream." },
  { chapterIndex: -1, phrase: "Britomart",
    definition: "The lady-knight hero of Book III (Chastity); a Spenserian compound of *Britain* + *Mars*. Descends from Bradamante in Ariosto's *Orlando Furioso*; her quest is for Artegall, her foretold husband." },
  { chapterIndex: -1, phrase: "Artegall",
    definition: "The knight of Justice, hero of Book V; Britomart's foretold husband. Name built on *art-* (excellence) + *equal*, the defining attribute of justice." },
  { chapterIndex: -1, phrase: "Calidore",
    definition: "The knight of Courtesy, hero of Book VI; name from Greek *kalos* (beautiful) + *dōron* (gift) — the gift of beauty / gracefulness in social bearing." },
  { chapterIndex: -1, phrase: "Guyon",
    definition: "The knight of Temperance, hero of Book II; the name recalls several medieval romances but its etymology is deliberately opaque. Distinguished by refusing both the siren's draught and Mammon's gold." },
  { chapterIndex: -1, phrase: "Redcrosse",
    definition: "Saint George, knight of Holiness, hero of Book I; his red-cross-on-white shield is the traditional emblem of Saint George and of the English army." },
  { chapterIndex: -1, phrase: "Red Cross Knight",
    definition: "The hero of Book I (Holiness); his cross-emblem identifies him with Saint George. He defeats the Dragon (Sin) and is betrothed to Una (Truth)." },
  { chapterIndex: -1, phrase: "Florimell",
    definition: "The lady of Book III/IV whose perfect beauty triggers universal pursuit; her name blends *flor* (flower) + *miel* (honey). Her snowy-false double, produced by a witch, drives the plot of Book IV." },
  { chapterIndex: -1, phrase: "Amoret",
    definition: "Twin sister of Belphoebe, wife of Scudamour; her name from Latin *amor* (love). Her rescue from Busirane in Book III, canto XII is one of Spenser's great set-pieces of allegorical reading." },
  { chapterIndex: -1, phrase: "Busirane",
    definition: "The enchanter-magician who imprisons Amoret; his name recalls Ovid's Egyptian tyrant Busiris. The figure of predatory, objectifying male lust dressed up as courtly love." },

  // ── Cross-book: Saracen knights (Books I–II) ────────────────────────
  { chapterIndex: -1, phrase: "Sansfoy",
    definition: "French *sans foi* — 'without faith'. One of three pagan brothers in Book I; his appearance on the plot reflects a specific lapse from Christian belief." },
  { chapterIndex: -1, phrase: "Sansloy",
    definition: "French *sans loi* — 'without law'. Second of the pagan brothers; the lawless appetite opposed to Una's moral order." },
  { chapterIndex: -1, phrase: "Sansjoy",
    definition: "French *sans joie* — 'without joy'. Third of the pagan brothers; the sterile bitterness of envy. His fight with Redcrosse in canto V is a Virgilian *single combat* with classical-underworld overtones." },

  // ── Cross-book: classical / mythological ────────────────────────────
  { chapterIndex: -1, phrase: "Proserpine",
    definition: "Queen of the Underworld, wife of Pluto (Hades); Spenser uses her in Mammon's Cave (Book II.vii) and in the Garden of Adonis (Book III.vi) as twin figures of the chthonic cycle." },
  { chapterIndex: -1, phrase: "Demogorgon",
    definition: "A primordial, terror-inducing deity of late-classical myth (Boccaccio revived him); Spenser invokes him in the deepest recesses of Faerie-Land's underworld as the power beyond Pluto." },
  { chapterIndex: -1, phrase: "Mulciber",
    definition: "A Latin by-name of Vulcan, god of fire and the forge (the 'softener' of metals). Spenser borrows the name for the smith of hell in his catalog of underworld craftsmen." },
  { chapterIndex: -1, phrase: "Morpheus",
    definition: "The god of dreams in Ovid (*Metamorphoses* XI); Archimago summons him in Book I canto I to fabricate the false dream that begins Red Cross Knight's deception." },
  { chapterIndex: -1, phrase: "Diana",
    definition: "Roman goddess of the hunt and of virgin chastity; Belphoebe's patron deity and allegorical template (canto III.v)." },

  // ── Book I (cantos 0 Forward, 2–10; chapterIndex values match ch-*.json) ──
  { chapterIndex: 2, phrase: "gentle knight",
    definition: "A knight of noble birth and chivalric training; *gentle* in 1590 carried both social (*gentilis* — of rank) and moral (courteous, restrained) meaning." },
  { chapterIndex: 2, phrase: "silver shield",
    definition: "Una's shield-device (not Redcrosse's, whose is argent with a gules cross); Spenser's signal that Una travels armed as a knight's companion, not as a damsel-in-distress." },
  { chapterIndex: 3, phrase: "Errour",
    definition: "The monstrous half-woman, half-serpent of Book I canto I — the first enemy Redcrosse faces; her body vomits books, papers, and froggy offspring, a picture of heresy multiplying." },

  // ── Book III (cantos surrounding Britomart / Amoret / Florimell) ────
  { chapterIndex: 28, phrase: "Bradamante",
    definition: "The lady-knight of Ariosto's *Orlando Furioso*; Spenser's Britomart is her direct descendant, and Book III's opening cantos explicitly acknowledge the borrowing." },

  // ── Mutabilitie Cantos (posthumous 1609; Book VII in Standard Ebooks) ──
  { chapterIndex: -1, phrase: "Mutabilitie",
    definition: "The Titaness of change and instability; in the two posthumous cantos (Book VII) she mounts an appeal against Jove and the celestial order, arguing that all creation is her domain." },
  { chapterIndex: -1, phrase: "Dame Nature",
    definition: "The judge at Mutabilitie's trial; her verdict — that all things change yet all things persist in their kinds — is Spenser's final metaphysical statement, a Christianized Neoplatonic reconciliation." },

  // ── Cross-book: Elizabethan court / Reformation markers ─────────────
  { chapterIndex: -1, phrase: "Faerie Land",
    definition: "Spenser's Britain-adjacent otherworld, the setting for the whole poem; not an escape from England but a morally legible version of it (see Letter to Ralegh)." },
  { chapterIndex: -1, phrase: "Tanaquill",
    definition: "A by-name for Gloriana / the Faerie Queene, drawn from Roman legend (the prophetic queen-wife of Tarquinius Priscus). Spenser uses it to compliment Elizabeth's political foresight." },
  { chapterIndex: -1, phrase: "Tudor",
    definition: "The royal house to which Elizabeth I belonged; Spenser's genealogy of the Faerie-Land kings (Book II canto X) is designed to run into her line by prophecy." },
]

/** Per-chapter filter used by the reader overlay; includes cross-book entries. */
export function getFaerieQueeneGlossesForChapter(
  chapterIndex: number,
): FaerieQueeneGloss[] {
  return FAERIE_QUEENE_GLOSSES.filter(
    (g) => g.chapterIndex === chapterIndex || g.chapterIndex === -1,
  )
}
