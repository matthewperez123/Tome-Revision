/**
 * Commedia glosses — single-sentence, tap-to-reveal definitions for
 * Longfellow's translation. Different from annotations:
 *
 *   - Annotations are Virgil's voice, a paragraph or two, opened in a
 *     drawer. They argue about meaning.
 *   - Glosses are dictionary-style, one sentence max, revealed on hover.
 *     They identify.
 *
 * Scope: seed set for the same demo cantos we annotated (Inferno I, V,
 * XXVI, XXXIII, XXXIV). Additional cantos get glosses in a later batch
 * via Haiku once the UX is approved.
 *
 * Phrase-matching notes:
 *   - `phrase` must appear verbatim in the rendered Longfellow text; the
 *     renderer is a whole-string `String.prototype.includes` scan, so
 *     phrasing sensitivity matters (Longfellow uses "Diomed" not
 *     "Diomede", for example).
 *   - Shorter phrases are safer across line breaks, since SE wraps each
 *     verse line in its own <span>.
 *   - A phrase that appears in multiple cantos gets a gloss entry per
 *     canto if the definition differs; identical definitions can share
 *     a single entry with the first-occurrence canto listed.
 */

export interface CommediaGloss {
  /** Flat canto index (0–99) matching the reader's chapter index. */
  flatCanto: number
  /** Exact substring to wrap in a tooltip. */
  phrase: string
  /** One-sentence definition shown on hover. */
  definition: string
}

export const COMMEDIA_GLOSSES: CommediaGloss[] = [

  // ── Inferno I (flat 0) ────────────────────────────────────────────
  { flatCanto: 0, phrase: "forest dark",
    definition: "Italian *selva oscura* — the moral, not geographic, wood of sin and confusion where Dante begins the poem." },
  { flatCanto: 0, phrase: "she-wolf",
    definition: "One of the three beasts barring Dante's path; traditionally read as avarice or incontinence, sometimes as the corrupt Church." },
  { flatCanto: 0, phrase: "Virgil",
    definition: "Publius Vergilius Maro (70–19 BCE), Roman poet of the Aeneid; Dante's guide through Hell and Purgatory, representing human reason." },
  { flatCanto: 0, phrase: "Mantua",
    definition: "Lombard city in northern Italy where Virgil was born, in 70 BCE." },
  { flatCanto: 0, phrase: "Anchises",
    definition: "Father of Aeneas; Virgil's epic recounts Aeneas carrying him out of burning Troy." },
  // Beatrice is first named in Canto II, not I — gloss there.
  { flatCanto: 1, phrase: "Beatrice",
    definition: "Beatrice Portinari, Dante's idealized beloved (d. 1290); she will take over from Virgil as his guide in Purgatorio XXX and through Paradiso." },

  // ── Inferno V (flat 4) ────────────────────────────────────────────
  { flatCanto: 4, phrase: "Minos",
    definition: "King of Crete in myth; in Dante, the grotesque judge of the damned who coils his tail around himself to assign each soul its circle." },
  { flatCanto: 4, phrase: "Semiramis",
    definition: "Legendary Assyrian queen, wife of Ninus; medieval tradition accused her of legalizing incest to cover her own lust." },
  { flatCanto: 4, phrase: "Dido",
    definition: "Queen of Carthage in Virgil's Aeneid IV, who killed herself when abandoned by Aeneas; placed among the lustful for breaking her vow to her dead husband." },
  { flatCanto: 4, phrase: "Cleopatra",
    definition: "Cleopatra VII of Egypt (69–30 BCE), lover of Julius Caesar and Mark Antony; a stock exemplar of ruinous passion in medieval lists." },
  { flatCanto: 4, phrase: "Helen",
    definition: "Helen of Troy, whose abduction by Paris triggered the Trojan War; paired here with Paris as a cause of mass death through lust." },
  { flatCanto: 4, phrase: "Tristan",
    definition: "Knight of the Round Table whose love for Iseult, his uncle's bride, became the archetypal medieval tragedy of adultery." },
  { flatCanto: 4, phrase: "Francesca",
    definition: "Francesca da Rimini (c. 1255–1285), murdered by her husband Giovanni Malatesta for her affair with his brother Paolo; the lovers speak together throughout this canto." },
  { flatCanto: 4, phrase: "Galeotto",
    definition: "Go-between in the Lancelot romance; Francesca's line *Galeotto fu 'l libro e chi lo scrisse* names the book itself as the pander of her adultery." },

  // ── Inferno XXVI (flat 25) ────────────────────────────────────────
  { flatCanto: 25, phrase: "Ulysses",
    definition: "Latin name for Odysseus, hero of Homer's Odyssey; Dante had not read Homer directly and invents a non-Homeric ending for him in this canto." },
  { flatCanto: 25, phrase: "Diomed",
    definition: "Diomedes, Greek warrior at Troy and Odysseus's partner in the theft of the Palladium and the ambush of the Wooden Horse." },
  { flatCanto: 25, phrase: "Eteocles",
    definition: "Son of Oedipus; he and his brother Polynices killed each other over the throne of Thebes, their funeral pyre famously splitting in two as if in continued hatred." },
  { flatCanto: 25, phrase: "Hercules his landmarks",
    definition: "The Pillars of Hercules — the Strait of Gibraltar, set in myth as Hercules' warning to sail no further; Ulysses' *folle volo* is the crossing of this limit." },
  { flatCanto: 25, phrase: "Deidamia",
    definition: "Daughter of King Lycomedes of Scyros; Ulysses and Diomed tricked Achilles out of hiding in her chambers to fight at Troy, abandoning her pregnant." },

  // ── Inferno XXXIII (flat 32) ──────────────────────────────────────
  { flatCanto: 32, phrase: "Count Ugolino",
    definition: "Ugolino della Gherardesca (c. 1220–1289), Pisan count locked in the Tower of Hunger with his sons and grandsons by Archbishop Ruggieri; they starved." },
  { flatCanto: 32, phrase: "Ruggieri",
    definition: "Ruggieri degli Ubaldini, Archbishop of Pisa (d. 1295), who imprisoned Ugolino and his heirs and had the tower key thrown into the Arno." },
  // Antenora is named in Canto XXXII (flat 31), not here; zone-name for
  // the circle of traitors to country.
  { flatCanto: 31, phrase: "Antenora",
    definition: "Second division of the Ninth Circle, named for the Trojan Antenor accused of betraying his city; punishes traitors to country and faction." },
  { flatCanto: 32, phrase: "Ptolomaea",
    definition: "Third division of the Ninth Circle, punishing traitors to guests; named for Ptolemy son of Abubus, who murdered his father-in-law Simon Maccabee at a banquet (1 Maccabees 16)." },
  { flatCanto: 32, phrase: "Gualandi",
    definition: "One of the three Pisan Ghibelline families (Gualandi, Sismondi, Lanfranchi) that led Ugolino's imprisonment; personified here as his 'hunting dogs.'" },
  { flatCanto: 32, phrase: "Genoese",
    definition: "Pisa's great maritime rival; in the canto's final lines, Dante curses the Genoese as a nation fit to be exterminated for producing Branca Doria." },

  // ── Inferno XXXIV (flat 33) ───────────────────────────────────────
  { flatCanto: 33, phrase: "Vexilla Regis prodeunt Inferni",
    definition: "Latin: 'The banners of the King of Hell advance.' Dante parodies a Good Friday hymn (*Vexilla Regis prodeunt*) by appending *Inferni* — 'of Hell.'" },
  { flatCanto: 33, phrase: "Dis",
    definition: "Classical name for the lord of the underworld, reused by Dante for Lucifer and for the walled lower city of Hell; from Latin *dives*, 'rich'." },
  { flatCanto: 33, phrase: "Cocytus",
    definition: "The frozen lake at the bottom of Hell in the Ninth Circle; named for the underworld river of wailing in Greek myth." },
  { flatCanto: 33, phrase: "Judas",
    definition: "Judas Iscariot, who betrayed Christ; Lucifer chews him head-first in his central mouth, the worst of all traitors." },
  { flatCanto: 33, phrase: "Brutus",
    definition: "Marcus Junius Brutus, lead assassin of Julius Caesar; Dante places him in Lucifer's second mouth for betraying the founder of the Empire." },
  { flatCanto: 33, phrase: "Cassius",
    definition: "Gaius Cassius Longinus, co-conspirator in Caesar's assassination (44 BCE); third of Lucifer's eternal victims." },
  { flatCanto: 33, phrase: "the stars",
    definition: "Italian *stelle* — the word Dante chose to end each of the three canticles, marking ascent from Hell, from Purgatory, and from Paradise." },
]

/** All glosses for a given flat canto index. */
export function getCommediaGlossesForCanto(flatIndex: number): CommediaGloss[] {
  return COMMEDIA_GLOSSES.filter(g => g.flatCanto === flatIndex)
}
