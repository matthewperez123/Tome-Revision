/**
 * The Faerie Queene speaker palette — Spenser's late-Elizabethan allegorical epic.
 *
 * Design rationale:
 *   - The Spenser-narrator (the courtly poet's own voice — reverent toward
 *     Elizabeth, deliberately archaic, continuous across six books) sits at
 *     a deep Elizabethan crimson warmed by gold. Distinct from Ariosto's
 *     Ferrara-red (hotter, ironic) and Byron's ink-blue (cool, skeptical);
 *     the register here should feel *tapestried* — a royal progress, not a
 *     mead-hall, not a Regency salon.
 *
 *   - Britomart carries forward the silver-rose register of Bradamante
 *     (Orlando Furioso), but blue-shifted (cooler, more martial than
 *     Bradamante's warmer silver-rose) with a warm rose-gold flare used
 *     when she takes narrative precedence — unhorsing Guyon, speaking in
 *     her own voice, the mirror-vision of Artegall. Readers moving through
 *     the Great Epics library chronologically (Orlando Furioso → Faerie
 *     Queene) should *feel* the inheritance without confusing the two.
 *
 *   - Duessa operates the palette-shift mechanic reused from Alcina: she
 *     appears in iridescent rose (beautiful, alluring) through Book I
 *     canto i–vii; after her unmasking in I.viii, the palette reveals the
 *     ash underneath. The reader's registration of her color should tip.
 *
 *   - Gloriana is barely seen in the poem. Her palette is pure radiant
 *     gold — always *offstage-radiant*, a color for a figure who is
 *     praised, promised, never reached.
 *
 *   - Una and Duessa are designed as a strict pair: Una pure white with
 *     pale-gold and a subtle Marian blue undertone; Duessa iridescent
 *     rose shifting to ash. The pair encodes Spenser's Protestant
 *     theology — the true Church against the Roman Church — and the
 *     palette decision should be legible as a pair even before the
 *     reader has processed the allegory.
 *
 *   - Talus, Artegall's iron executioner, is pure iron-gray. The palette
 *     is deliberately *implacable* and *mechanical* — one of Spenser's
 *     most controversial inventions, and the color should not soften it.
 *
 *   - Prince Arthur — the recurring figure across all six books,
 *     representing Magnificence (the crown of all virtues) — carries
 *     imperial gold and indigo. He rescues each titular knight at some
 *     crucial moment; the palette should feel *totalizing*.
 *
 *   - Mutabilitie, the Titaness of the Mutabilitie Cantos, uses the
 *     explicit "shifting" treatment — the palette cycles through several
 *     hues rather than settling, which is the character's allegorical
 *     claim.
 *
 * Colors are tuned for both light and dark reader themes.
 */

export interface FaerieQueeneSpeaker {
  id: string
  name: string
  color: string      // light-theme color
  darkColor: string  // dark-theme color
  /** Optional secondary color used after an allegorical "unmasking" (Duessa) or
   *  when the speaker takes a distinctive register (Britomart's martial flare,
   *  Redcrosse's post-canonization gold). The reader component may blend or
   *  switch on narrative context. */
  accentColor?: string
  accentDarkColor?: string
  group:
    | "narrator"
    | "sovereign"           // Gloriana, Elizabeth-under-allegory
    | "knights-titular"     // the six books' titular knights
    | "knights-recurring"   // Arthur, Timias, Satyrane
    | "women-truth"         // Una, Britomart, Belphoebe, Amoret, Florimell
    | "women-false"         // Duessa, Acrasia, Radigund, Malecasta
    | "vices"               // Orgoglio, Despair, Busirane, the Blatant Beast
    | "sorcery"             // Archimago, Merlin, Proteus
    | "allegory-virtues"    // Fidelia, Speranza, Charissa, Alma, Mercilla
    | "titans"              // Mutabilitie, Nature, Jove (Mutabilitie Cantos)
    | "classical"           // classical gods in passing
  note?: string
}

export const FAERIE_QUEENE_SPEAKERS: FaerieQueeneSpeaker[] = [
  // ── Narrator ───────────────────────────────────────────────────────
  {
    id: "Spenser",
    name: "Edmund Spenser",
    color: "#9A2540",       // deep Elizabethan crimson, gold-warmed
    darkColor: "#D8A05A",   // burnished gold — crimson reads muddy on dark
    group: "narrator",
    note:
      "The poet's continuous voice — archaizing Chaucer at 190 years' remove, " +
      "courtly and reverent toward the queen, the tapestry-maker across all six " +
      "books and the Mutabilitie Cantos. Distinct from Ariosto's Ferrara-red " +
      "(hotter, ironic) and Byron's ink-blue (cool, Regency-skeptical).",
  },

  // ── Sovereign ──────────────────────────────────────────────────────
  {
    id: "Gloriana",
    name: "Gloriana, the Faerie Queene",
    color: "#D4A24C",       // pure radiant gold
    darkColor: "#F2C878",
    group: "sovereign",
    note:
      "The queen at the center of the poem, barely seen, always deferred — " +
      "the color should feel *offstage-radiant*, a gold that readers register " +
      "more in absence than in presence. Elizabeth I under allegorical veil.",
  },
  {
    id: "Elizabeth",
    name: "Elizabeth I (under allegory)",
    color: "#C9A24A",       // imperial gold, slightly cooler than Gloriana
    darkColor: "#E6C56F",
    group: "sovereign",
    note:
      "Elizabeth appears across the poem in several aspects — Gloriana (public " +
      "majesty), Belphoebe (virgin-huntress chastity), Mercilla (just sovereign, " +
      "Book V). This palette belongs to her as the historical sovereign the " +
      "poem addresses, shared visually with but distinct from Gloriana.",
  },

  // ── Knights titular (Book I–VI) ────────────────────────────────────
  {
    id: "Redcrosse",
    name: "Redcrosse Knight / St. George",
    color: "#B73B3B",       // ember-red (shield, Cross, dedication)
    darkColor: "#E06868",
    accentColor: "#D4A24C", // post-canonization gold, Book I canto xii onward
    accentDarkColor: "#F2C878",
    group: "knights-titular",
    note:
      "Holiness's knight. Ember-red with white cross through most of Book I; " +
      "transfigures to gold after his canonization at the book's end. The " +
      "accent color should be applied on and after I.xii.",
  },
  {
    id: "Guyon",
    name: "Sir Guyon",
    color: "#5E6B78",       // steel, restrained
    darkColor: "#8E9AA5",
    accentColor: "#A88D3F", // restrained gold
    accentDarkColor: "#C8AB5C",
    group: "knights-titular",
    note:
      "Temperance's knight — measured, controlled. Steel with restrained gold; " +
      "the palette should feel *governed* rather than radiant. Contrast to " +
      "Redcrosse's ember-red.",
  },
  {
    id: "Britomart",
    name: "Britomart",
    color: "#9A92B0",       // cooler silver — blue-shifted from Bradamante
    darkColor: "#C6BFD4",
    accentColor: "#D6A86A", // warm rose-gold martial flare
    accentDarkColor: "#E8BE85",
    group: "knights-titular",
    note:
      "Chastity's knight — warrior maiden in quest of her foreordained husband " +
      "Artegall. Direct descendant of Bradamante (Orlando Furioso); palette is " +
      "deliberately adjacent to Bradamante's silver-rose (#A8A0B4) but blue-" +
      "shifted — cooler, more martial, less courtly. The accent rose-gold is " +
      "her distinguishing register, used when she takes narrative precedence " +
      "(unhorsing Guyon III.i, mirror-vision III.ii, Busirane's house III.xii). " +
      "This continuity is one of the demonstrable visual-narrative payoffs the " +
      "Great Epics library offers.",
  },
  {
    id: "Cambel",
    name: "Sir Cambel",
    color: "#7A6C4E",       // bronze-olive
    darkColor: "#A59572",
    group: "knights-titular",
    note:
      "Friendship's co-titular knight (Book IV, with Triamond). Bronze with " +
      "olive undertone — the friendship-virtue's palette is cooperative rather " +
      "than solitary, so Cambel and Triamond are tuned to harmonize.",
  },
  {
    id: "Triamond",
    name: "Triamond",
    color: "#8A7A56",
    darkColor: "#B5A584",
    group: "knights-titular",
    note:
      "Friendship's co-titular knight (Book IV). Bronze-olive, harmonizing " +
      "with Cambel's palette — the two colors should read as a *pair*.",
  },
  {
    id: "Artegall",
    name: "Sir Artegall",
    color: "#7D5A2E",       // bronze
    darkColor: "#B08756",
    accentColor: "#5E6B78", // steel cross-reference to Guyon's temperance
    accentDarkColor: "#8E9AA5",
    group: "knights-titular",
    note:
      "Justice's knight — just, sometimes harshly so, Britomart's prophesied " +
      "husband. Bronze with steel. The steel accent cross-links him to Guyon " +
      "(temperance) — Spenser's justice is a form of disciplined restraint, " +
      "not fury.",
  },
  {
    id: "Calidore",
    name: "Sir Calidore",
    color: "#A88D3F",       // warm gold
    darkColor: "#C8AB5C",
    accentColor: "#5F7A4E", // pastoral green
    accentDarkColor: "#89A876",
    group: "knights-titular",
    note:
      "Courtesy's knight — the most sociable, least martial of the six. Warm " +
      "gold with pastoral green; the most genial palette in the knight rota. " +
      "Book VI's pastoral register calls for the green accent in the Acidale " +
      "and Pastorella sequences.",
  },

  // ── Knights recurring ──────────────────────────────────────────────
  {
    id: "Arthur",
    name: "Prince Arthur",
    color: "#B8913A",       // imperial gold
    darkColor: "#E0B868",
    accentColor: "#2D3A6E", // indigo
    accentDarkColor: "#5B6BA3",
    group: "knights-recurring",
    note:
      "Magnificence — the crown of all virtues, the figure who rescues each " +
      "titular knight at a crucial moment. Imperial gold + indigo; the palette " +
      "should feel *totalizing* rather than partial, because Arthur represents " +
      "the whole toward which each partial virtue aspires.",
  },
  {
    id: "Timias",
    name: "Timias",
    color: "#8E7A52",       // muted gold — Arthur's squire, lesser-gold
    darkColor: "#BBA480",
    group: "knights-recurring",
    note:
      "Arthur's squire, widely read as a figure for Sir Walter Ralegh. Muted " +
      "gold — deliberately the *shadow* of Arthur's imperial gold, as a squire " +
      "is the shadow of his knight.",
  },
  {
    id: "Satyrane",
    name: "Sir Satyrane",
    color: "#6E5436",       // earth-brown, wild
    darkColor: "#9A7D5A",
    group: "knights-recurring",
    note:
      "Son of a satyr and a human woman — wild virtue, pre-civilized. Appears " +
      "across Books I, III, IV. Earth-brown — distinguished from the refined " +
      "bronze of Artegall; this is the *wild* register.",
  },

  // ── Women of truth, chastity, beauty ───────────────────────────────
  {
    id: "Una",
    name: "Una",
    color: "#EFE8D6",       // warm white with pale gold
    darkColor: "#F5EFDF",
    accentColor: "#5F7D9F", // subtle Marian blue undertone
    accentDarkColor: "#8BA7C4",
    group: "women-truth",
    note:
      "True faith, the one true Church, truth itself — Redcrosse's constant " +
      "companion through Book I, the figure who keeps faith when the knight " +
      "falls. White + pale gold + subtle Marian blue; must read unambiguously " +
      "radiant without becoming saccharine. Strict visual pair with Duessa.",
  },
  {
    id: "Belphoebe",
    name: "Belphoebe",
    color: "#A6B07A",       // forest green-gold, virgin-huntress
    darkColor: "#C6CEA0",
    accentColor: "#C9A24A", // Elizabeth-gold undertone (she is Elizabeth-as-virgin)
    accentDarkColor: "#E6C56F",
    group: "women-truth",
    note:
      "Elizabeth in her aspect of virgin-ruler — the huntress of Book III onward. " +
      "Forest green-gold with the queen's gold undertone; the two palettes " +
      "(Elizabeth, Belphoebe) share a hue family, signaling the allegorical " +
      "identity.",
  },
  {
    id: "Amoret",
    name: "Amoret",
    color: "#D6A8B4",       // soft rose — married love
    darkColor: "#E8C4CC",
    group: "women-truth",
    note:
      "Belphoebe's twin, figure of married love (versus Belphoebe's virgin " +
      "chastity). Soft rose — tender, not seductive; contrast to Duessa's " +
      "iridescent rose, which reads *alluring* rather than tender.",
  },
  {
    id: "Florimell",
    name: "Florimell",
    color: "#E8D58C",       // pale yellow-gold, fugitive beauty
    darkColor: "#F1E2A8",
    group: "women-truth",
    note:
      "Beauty in flight — perpetually fleeing through Books III–IV. Pale yellow-" +
      "gold, deliberately lighter and more *moving* than the more grounded gold " +
      "of Gloriana or Belphoebe. Compares to Ariosto's Angelica in pale-gold-" +
      "in-flight register.",
  },
  {
    id: "Una-Lion",
    name: "Una's Lion",
    color: "#B07A3A",       // tawny lion-gold
    darkColor: "#D8A35E",
    group: "women-truth",
    note:
      "The lion who defends Una in Book I canto iii — often read as Reformation " +
      "England defending true faith. Rendered as a speaker-adjacent presence " +
      "because Spenser grants him agency and moral registration.",
  },

  // ── Women of falsehood, enchantment ────────────────────────────────
  {
    id: "Duessa",
    name: "Duessa",
    color: "#C88A9A",       // iridescent rose — seductive appearance
    darkColor: "#D8A0AE",
    accentColor: "#7A6E68", // ash — revealed after I.viii
    accentDarkColor: "#A8A098",
    group: "women-false",
    note:
      "Falsehood, the Roman Church, the Whore of Babylon of Revelation, Mary " +
      "Queen of Scots (in Book V). Iridescent rose through I.i–vii; the " +
      "palette *shifts to ash* at her unmasking in I.viii, and remains ashen " +
      "on every subsequent appearance across the poem. The reader's " +
      "registration tips the same way the allegory does. Parallels Alcina " +
      "(Orlando Furioso) mechanically.",
  },
  {
    id: "Acrasia",
    name: "Acrasia",
    color: "#D68AA2",       // iridescent rose + crimson, seductive
    darkColor: "#E6A6BC",
    accentColor: "#8A1E3A",
    accentDarkColor: "#B24A6A",
    group: "women-false",
    note:
      "The Bower of Bliss sorceress (Book II canto xii) — figure of " +
      "concupiscence. Companion palette to Duessa and Alcina; should feel " +
      "*seductive and dangerous*, not ashen like post-reveal Duessa. The " +
      "crimson accent carries her erotic register.",
  },
  {
    id: "Radigund",
    name: "Radigund",
    color: "#8E4A5A",       // hot rose with iron undertone — Amazon tyrant
    darkColor: "#B06E7E",
    group: "women-false",
    note:
      "The Amazon queen (Book V) who captures and feminizes Artegall. One of " +
      "Spenser's most politically troubling passages; the palette should not " +
      "soften her — hot rose with iron, aggressive not alluring.",
  },
  {
    id: "Malecasta",
    name: "Malecasta",
    color: "#D6556E",       // hot rose — unchastity
    darkColor: "#E87A8F",
    group: "women-false",
    note:
      "The \"lewdly loving\" lady of Castle Joyous (III.i) — unchastity. Hot " +
      "rose, saturation-forward — the anti-Britomart.",
  },
  {
    id: "Hellenore",
    name: "Hellenore",
    color: "#B86E82",
    darkColor: "#D48BA0",
    group: "women-false",
    note:
      "Malbecco's wife who runs off with Paridell (III.x) — the Helen-of-Troy " +
      "echo is deliberate in the name. Lower-key hot rose.",
  },
  {
    id: "Lucifera",
    name: "Lucifera",
    color: "#D4A24C",       // golden — but false-golden, pride's glittering
    darkColor: "#EABE78",
    accentColor: "#3E2E58", // violet-black undertone of pride
    accentDarkColor: "#6A5A82",
    group: "women-false",
    note:
      "Queen of the House of Pride (I.iv). Shares Gloriana's gold — the visual " +
      "trap is deliberate; Lucifera is what Gloriana-worship could *become* if " +
      "corrupted. The violet-black undertone is pride's shadow.",
  },

  // ── Vices, monsters, false-knights ─────────────────────────────────
  {
    id: "Orgoglio",
    name: "Orgoglio",
    color: "#2A1F26",       // obsidian with blood undertone
    darkColor: "#5E4A52",
    accentColor: "#8A1E3A",
    accentDarkColor: "#B24A6A",
    group: "vices",
    note:
      "Pride personified as a giant (I.vii–viii). Obsidian with blood — giant, " +
      "brutal, earthbound. Contrast to Lucifera's *courtly* pride.",
  },
  {
    id: "Despair",
    name: "Despair",
    color: "#6E6A68",       // ash-gray with ember
    darkColor: "#A09A96",
    accentColor: "#8E4A2E",
    accentDarkColor: "#B8735A",
    group: "vices",
    note:
      "The figure in the cave (I.ix) whose rhetoric nearly persuades Redcrosse " +
      "to suicide — one of the greatest set-pieces in English poetry, direct " +
      "source for Bunyan's Giant Despair. Ash-gray with ember; the palette " +
      "should feel *extinguishing*.",
  },
  {
    id: "Busirane",
    name: "Busirane",
    color: "#3E2A4E",       // muted violet-black, enchantment
    darkColor: "#6E5A82",
    group: "vices",
    note:
      "The enchanter of Book III canto xi–xii — the darkest erotic-captivity " +
      "sequence in the poem. Muted violet-black; echoes Archimago's sorcerer-" +
      "purple but blacker, more poetic-bondage than religious-hypocrisy.",
  },
  {
    id: "BlatantBeast",
    name: "The Blatant Beast",
    color: "#7A8A4E",       // sickly green — calumny
    darkColor: "#A5B278",
    group: "vices",
    note:
      "Book VI's antagonist — slander personified, the beast of a hundred " +
      "tongues. Sickly green, *bilious*. Escapes at the poem's end; the escape " +
      "is a tonal choice the palette should honor.",
  },
  {
    id: "Error",
    name: "Error",
    color: "#4A3E2E",       // murky brown-green, Error's wood
    darkColor: "#7D6E56",
    group: "vices",
    note:
      "The dragon-monster of I.i who vomits books and papers — anti-Protestant " +
      "allegory of Roman Church error. Murky brown-green, the color of " +
      "stagnant forest water.",
  },
  {
    id: "Grantorto",
    name: "Grantorto",
    color: "#5A1818",       // tyrant blood-red
    darkColor: "#8A3434",
    group: "vices",
    note:
      "Book V antagonist — widely read as Spain / Philip II under thin " +
      "allegorical cover. Tyrant blood-red.",
  },
  {
    id: "Duessa-V",
    name: "Duessa (Book V, under Mary Queen of Scots allegory)",
    color: "#7A6E68",       // ash — post-unmasking register
    darkColor: "#A8A098",
    group: "vices",
    note:
      "Duessa's Book V re-appearance as Mary Queen of Scots on trial before " +
      "Mercilla (= Elizabeth). Retains the post-unmasking ash palette from " +
      "Book I, now with explicit historical-allegorical weight.",
  },

  // ── Sorcery ────────────────────────────────────────────────────────
  {
    id: "Archimago",
    name: "Archimago",
    color: "#4E3A6E",       // muted violet with black edge
    darkColor: "#7A6AA0",
    group: "sorcery",
    note:
      "The shape-shifting sorcerer — hypocrisy personified, mimicking holiness. " +
      "Violet with black edge; the sorcerer-register, distinct from Busirane's " +
      "blacker poetic-bondage violet.",
  },
  {
    id: "Merlin",
    name: "Merlin",
    color: "#7C6EA8",       // deep prophetic violet
    darkColor: "#B4A8D6",
    group: "sorcery",
    note:
      "The prophetic violet reused from Orlando Furioso's Merlin (and Virgil's " +
      "Anchises) — the *prophetic-genealogy* register, reinforced by Britomart's " +
      "vision of her British descendants in III.iii. Cross-catalog visual rhyme.",
  },
  {
    id: "Proteus",
    name: "Proteus",
    color: "#3E6A7A",       // sea-blue-green, shape-shifting
    darkColor: "#6B96A6",
    group: "sorcery",
    note:
      "The shape-shifter of the sea (III.viii, IV.xi–xii). Sea-blue-green; " +
      "his palette shifts subtly by stanza in the way Mutabilitie's does, but " +
      "within a tighter sea-hue range.",
  },

  // ── Allegorical virtues (inhabitants of the allegorical houses) ────
  {
    id: "Fidelia",
    name: "Fidelia (Faith)",
    color: "#EFE8D6",       // shares Una's white-gold
    darkColor: "#F5EFDF",
    group: "allegory-virtues",
    note:
      "Faith, House of Holiness (I.x). Matches Una's register — Spenser doubles " +
      "the true-faith palette deliberately; it should read as *the same color-" +
      "family as Una*.",
  },
  {
    id: "Speranza",
    name: "Speranza (Hope)",
    color: "#9FB8D4",       // dawn blue
    darkColor: "#BCD0E3",
    group: "allegory-virtues",
    note:
      "Hope, House of Holiness. Dawn blue — the color of anchored expectation.",
  },
  {
    id: "Charissa",
    name: "Charissa (Charity)",
    color: "#D6956E",       // warm coral
    darkColor: "#E6B08E",
    group: "allegory-virtues",
    note:
      "Charity, House of Holiness. Warm coral — *nursing* warmth, the color of " +
      "the mother-with-children image Spenser gives her.",
  },
  {
    id: "Alma",
    name: "Alma",
    color: "#D4C78E",       // pale gold — the soul/body allegory
    darkColor: "#E8DEAF",
    group: "allegory-virtues",
    note:
      "Lady of the House of Alma (II.ix) — the allegorical body/mind. Pale " +
      "warm gold; the palette should feel *habitable* rather than radiant, " +
      "because the house is literally the allegorical human body.",
  },
  {
    id: "Mercilla",
    name: "Mercilla",
    color: "#C9A24A",       // imperial gold — Elizabeth as just sovereign
    darkColor: "#E6C56F",
    group: "allegory-virtues",
    note:
      "The sovereign who tries Duessa in Book V canto ix — Elizabeth in her " +
      "aspect of merciful justice. Shares Elizabeth's imperial gold; the three " +
      "Elizabeth-aspects (Gloriana / Belphoebe / Mercilla) are visually " +
      "networked by gold-family hues.",
  },
  {
    id: "Palmer",
    name: "The Palmer",
    color: "#8A8A76",       // silver-gray with olive
    darkColor: "#B0B098",
    group: "allegory-virtues",
    note:
      "Guyon's guide, figure of Reason (Book II). Silver-gray with olive; " +
      "*wise, patient*, deliberately not flashy — the reason-palette.",
  },
  {
    id: "Talus",
    name: "Talus",
    color: "#6E6E72",       // pure iron-gray
    darkColor: "#9A9AA0",
    group: "allegory-virtues",
    note:
      "Artegall's iron-man executioner (Book V) — Spenser's most controversial " +
      "figure, the mechanical enforcer of justice. Pure iron-gray; the palette " +
      "must feel *implacable* and *mechanical*, offering no human warmth. Do " +
      "not soften.",
  },

  // ── Titans (Mutabilitie Cantos) ────────────────────────────────────
  {
    id: "Mutabilitie",
    name: "Mutabilitie",
    color: "#A864A0",       // base iridescent violet-rose
    darkColor: "#C48BBE",
    accentColor: "#6AA8C4", // alternate cyan (the shifting)
    accentDarkColor: "#8BC1D9",
    group: "titans",
    note:
      "The Titaness of the Mutabilitie Cantos — claimant of rule over all " +
      "creation. *Shifting* palette: the base color cycles among violet-rose, " +
      "cyan, gold, green (seasons/elements) rather than settling. The shifting " +
      "IS the character's allegorical claim — the reader component must honor " +
      "this rather than lock a single hue.",
  },
  {
    id: "Nature",
    name: "Dame Nature",
    color: "#F0EBE0",       // white, prismatic
    darkColor: "#F5F0E7",
    group: "titans",
    note:
      "The figure who judges Mutabilitie on Arlo Hill (canto vii). Spenser " +
      "describes her as radiantly veiled — white with prismatic undertone. The " +
      "palette must read as *superior to Mutabilitie's shifting* rather than " +
      "another shift.",
  },
  {
    id: "Jove",
    name: "Jove",
    color: "#C4923A",       // thunderer-gold, classical
    darkColor: "#E0B068",
    group: "titans",
    note:
      "The challenged king of the gods in the Mutabilitie Cantos. Classical " +
      "thunderer-gold; Spenser plays him more bureaucratic than majestic, and " +
      "the palette should be grand but not untouchable.",
  },
  {
    id: "Cynthia",
    name: "Cynthia",
    color: "#B8C8D4",       // moon-silver
    darkColor: "#D4E0EC",
    group: "titans",
    note:
      "The moon-goddess whose throne Mutabilitie storms in canto vi — also an " +
      "Elizabeth-figure (Ralegh's Cynthia cycle is contemporary). Moon-silver.",
  },
]

/** Legend ordering for the in-reader palette panel. */
export const FAERIE_QUEENE_LEGEND_GROUPS: { heading: string; ids: string[] }[] = [
  { heading: "Narrator",           ids: ["Spenser"] },
  { heading: "Sovereign",          ids: ["Gloriana", "Elizabeth"] },
  { heading: "Titular knights",    ids: ["Redcrosse", "Guyon", "Britomart", "Cambel", "Triamond", "Artegall", "Calidore"] },
  { heading: "Recurring knights",  ids: ["Arthur", "Timias", "Satyrane"] },
  { heading: "Women of truth",     ids: ["Una", "Belphoebe", "Amoret", "Florimell", "Una-Lion"] },
  { heading: "Women of falsehood", ids: ["Duessa", "Acrasia", "Radigund", "Malecasta", "Hellenore", "Lucifera", "Duessa-V"] },
  { heading: "Vices & monsters",   ids: ["Orgoglio", "Despair", "Busirane", "BlatantBeast", "Error", "Grantorto"] },
  { heading: "Sorcery",            ids: ["Archimago", "Merlin", "Proteus"] },
  { heading: "Allegorical figures", ids: ["Fidelia", "Speranza", "Charissa", "Alma", "Mercilla", "Palmer", "Talus"] },
  { heading: "Mutabilitie Cantos", ids: ["Mutabilitie", "Nature", "Jove", "Cynthia"] },
]

/** Quick lookup by id. */
export const SPEAKER_BY_ID: Record<string, FaerieQueeneSpeaker> =
  Object.fromEntries(FAERIE_QUEENE_SPEAKERS.map((s) => [s.id, s]))

/**
 * Cross-catalog palette continuity — Britomart inherits from Bradamante.
 * This is the single strongest demonstrable visual-narrative payoff the
 * Great Epics library offers; see the cross-reference cluster Faerie
 * Queene ↔ Orlando Furioso for the textual side.
 */
export const BRITOMART_BRADAMANTE_CONTINUITY = {
  bradamante: { color: "#A8A0B4", darkColor: "#D4CCD8", source: "orlando-furioso/speakers.ts" },
  britomart:  { color: "#9A92B0", darkColor: "#C6BFD4", accent: "#D6A86A", accentDark: "#E8BE85" },
  note:
    "Both silver-with-warm-undertone. Britomart is *blue-shifted* (cooler) " +
    "and adds a rose-gold martial-flare accent absent from Bradamante. The " +
    "family resemblance is deliberate and legible; the distinction honors " +
    "Spenser's more explicitly armored, more consistently interior warrior-" +
    "maiden versus Ariosto's more courtly version of the type.",
} as const
