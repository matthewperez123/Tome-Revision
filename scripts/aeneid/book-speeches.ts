/**
 * Aeneid Book-by-book ordered speech tables.
 *
 * Each entry is `{ speaker, opens }` — where `opens` is the exact opening
 * phrase of the speech as it appears in Dryden's HTML (after we normalize
 * smart quotes and em-dashes to ASCII). The ordering MUST match the order
 * of speeches in the chapter text; the transform walks lines top-to-bottom
 * and assigns each matching line to the next unassigned entry.
 *
 * Book I is hand-curated as the reference / pause-point demo. Books II–XII
 * begin as the auto-extracted draft from book-speeches-generated.json and
 * will be hand-corrected book-by-book; the extractor reports attribution
 * ambiguity per book so reviewers know where to focus.
 *
 * Speaker names are CANONICAL. For gods this means ROMAN form (Juno,
 * Venus, Jove, Vulcan, Neptune, Mercury, Mars), because the Aeneid is a
 * Roman poem and the reader should see the gods as Virgil names them.
 * Greek-form aliases (Hera, Aphrodite, Zeus) are resolved at runtime via
 * the alias table in src/lib/virgil/aeneid-speakers.ts.
 */

import generated from "./book-speeches-generated.json"

export interface Speech {
  /** Canonical speaker name (Roman for gods). */
  speaker: string
  /** Opening substring of the speech, used to locate the line. */
  opens: string
}

// ── Book I: The Storm and the Carthaginian Welcome — hand-curated ────────
//
// Dryden's 753-line Book I contains 29 discrete speech openings. The
// extractor misattributed ~12 of them (mostly because Dryden buries
// attribution in "said she / quoth he / thus replied" that sit on the
// far side of a curly-quote boundary, or because two consecutive lines
// start quoted speeches by different speakers). Hand-corrections below.

const BOOK_1: Speech[] = [
  // Juno's opening soliloquy (I.37 ff.) — "her fury vent"
  { speaker: "Juno", opens: "Then am I vanquish'd" },
  { speaker: "Juno", opens: "And must the Trojans reign in Italy" },
  // Juno to Aeolus (I.65 ff.) — "the tenor of her suit"
  { speaker: "Juno", opens: "O Aeolus" },
  // Aeolus's reply (I.76 ff.)
  { speaker: "Aeolus", opens: "'Tis yours" },
  // Aeneas in the storm (I.94 ff.) — "lifted hands and eyes"
  { speaker: "Aeneas", opens: "Thrice and four times happy those" },
  { speaker: "Aeneas", opens: "That under Ilian walls before their parents died" },
  // Neptune rebukes the winds (I.132 ff.) — "thus rebuk'd"
  { speaker: "Neptune", opens: "Audacious winds" },
  // Aeneas comforting his crew on the Libyan shore (I.198 ff.)
  { speaker: "Aeneas", opens: "Endure" },
  // Venus's appeal to Jupiter (I.229 ff.) — "her heav'nly sire bespoke"
  { speaker: "Venus", opens: "O King of Gods and Men" },
  // Jove's reply (I.254 ff.)
  { speaker: "Jove", opens: "Daughter" },
  // Venus disguised as huntress accosts Aeneas & Achates (I.321 ff.)
  { speaker: "Venus", opens: "Ho, strangers! have you lately seen" },
  { speaker: "Venus", opens: "One of my sisters" },
  // Aeneas replies to the huntress (I.326 ff.)
  { speaker: "Aeneas", opens: "None of your sisters have we heard or seen" },
  // Venus (disguised) demurs & begins Dido's backstory (I.335 ff.)
  { speaker: "Venus", opens: "I dare not" },
  { speaker: "Venus", opens: "assume the name" },
  // Aeneas's response (I.372 ff.)
  { speaker: "Aeneas", opens: "Could you with patience hear" },
  // Venus (still disguised) interrupts & sends him on to Carthage (I.387 ff.)
  { speaker: "Venus", opens: "Whoe'er you are" },
  // Aeneas recognizes her as she vanishes (I.407 ff.)
  { speaker: "Aeneas", opens: "Ah! whither do you fly?" },
  // Aeneas approaches the rising walls of Carthage (I.437 ff.)
  { speaker: "Aeneas", opens: "Thrice happy you" },
  // Aeneas before the temple-murals of Troy (I.459 ff.) — "weeping said"
  { speaker: "Aeneas", opens: "O friend" },
  // Ilioneus's speech to Dido (I.522 ff.)
  { speaker: "Ilioneus", opens: "O Queen" },
  // Dido's welcome (I.562 ff.)
  { speaker: "Dido", opens: "Trojans" },
  // Venus meets Aeneas in her cloud (I.615 ff.)
  { speaker: "Venus", opens: "From whence" },
  // Aeneas reveals himself to Dido (I.595 ff., after cloud parts)
  { speaker: "Aeneas", opens: "He whom you seek am I" },
  // Dido's reply (I.615 ff.)
  { speaker: "Dido", opens: "What fate" },
  // Venus to Cupid, plotting Dido's enchantment (I.657 ff.)
  { speaker: "Venus", opens: "My son" },
  // Dido's libation-prayer at the banquet (I.731 ff.)
  { speaker: "Dido", opens: "O hospitable Jove" },
  // Dido asks Aeneas for the tale of Troy (I.753)
  { speaker: "Dido", opens: "Relate at large" },
  { speaker: "Dido", opens: "The Grecian stratagems" },
]

// ── Books II–XII: auto-extracted draft ────────────────────────────────────
// Load the machine-generated table and overlay Book I's hand-curation.

const generatedRecord = generated as unknown as Record<string, Speech[]>

export const BOOK_SPEECHES: Record<number, Speech[]> = {
  1: BOOK_1,
  2:  generatedRecord["2"]  ?? [],
  3:  generatedRecord["3"]  ?? [],
  4:  generatedRecord["4"]  ?? [],
  5:  generatedRecord["5"]  ?? [],
  6:  generatedRecord["6"]  ?? [],
  7:  generatedRecord["7"]  ?? [],
  8:  generatedRecord["8"]  ?? [],
  9:  generatedRecord["9"]  ?? [],
  10: generatedRecord["10"] ?? [],
  11: generatedRecord["11"] ?? [],
  12: generatedRecord["12"] ?? [],
}
