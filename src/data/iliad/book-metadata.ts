/**
 * Iliad book-level metadata — Greek-letter designations, Roman
 * numerals, and traditional one-line arguments for each of the 24
 * books. Shared by the React reader (for the in-page header
 * apparatus) and the scripts/iliad/transform-book.ts CLI (for
 * ingest-time validation / logging).
 *
 * The arguments are hand-written summaries in the tradition of
 * Pope's "ARGUMENT" headers — one sentence each, orienting the
 * reader to the book's narrative arc without previewing the
 * emotional payoff. They are not paraphrases of Bryant's chapter
 * titles (which the reader already sees in the H1).
 */

export const BOOK_GREEK_LETTERS: Record<number, string> = {
  1: "Α",  2: "Β",  3: "Γ",  4: "Δ",  5: "Ε",  6: "Ζ",
  7: "Η",  8: "Θ",  9: "Ι", 10: "Κ", 11: "Λ", 12: "Μ",
  13: "Ν", 14: "Ξ", 15: "Ο", 16: "Π", 17: "Ρ", 18: "Σ",
  19: "Τ", 20: "Υ", 21: "Φ", 22: "Χ", 23: "Ψ", 24: "Ω",
}

export const BOOK_ROMAN_NUMERALS: Record<number, string> = {
  1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
  7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII",
  13: "XIII", 14: "XIV", 15: "XV", 16: "XVI", 17: "XVII", 18: "XVIII",
  19: "XIX", 20: "XX", 21: "XXI", 22: "XXII", 23: "XXIII", 24: "XXIV",
}

export const BOOK_ARGUMENTS: Record<number, string> = {
  1: "Apollo sends a plague; Agamemnon seizes Briseis; Achilles, withdrawing in wrath, has his mother Thetis obtain from Zeus the promise of Greek defeat.",
  2: "Zeus sends a false dream; the Greeks nearly flee; the armies assemble and are numbered in the Catalogue of Ships.",
  3: "Paris and Menelaus duel for Helen; Aphrodite rescues Paris; the oath of combat is broken.",
  4: "Pandarus wounds Menelaus; the truce collapses; Agamemnon reviews the Greek ranks as battle is joined.",
  5: "The aristeia of Diomedes — who, under Athena's hand, wounds Aphrodite and Ares.",
  6: "Hector returns to Troy; the exchange of armor between Glaucus and Diomedes; Hector's farewell to Andromache and Astyanax.",
  7: "Ajax and Hector duel to a draw; the Greeks build a wall and trench around their ships.",
  8: "Zeus forbids divine intervention; the Greeks are driven back to their ships as night falls.",
  9: "Agamemnon relents and sends an embassy — Odysseus, Phoenix, Ajax — to Achilles, who refuses reconciliation.",
  10: "The night raid of Odysseus and Diomedes; the ambush and killing of the Trojan spy Dolon and the Thracian Rhesus.",
  11: "The aristeia of Agamemnon; Greek leaders are wounded; Achilles, watching, sends Patroclus to inquire.",
  12: "The Trojans storm the Greek wall; Hector breaks through the gate with a massive stone.",
  13: "Poseidon, defying Zeus's ban, rallies the Greeks; fighting at the ships.",
  14: "The deception of Zeus — Hera seduces him to sleep; Poseidon drives the Trojans back.",
  15: "Zeus wakes, reasserts his will; Apollo rouses Hector; the Trojans reach the ships and begin to burn them.",
  16: "Patroclus, wearing Achilles's armor, routs the Trojans, kills Sarpedon, and is killed by Hector with Apollo's aid.",
  17: "The battle over Patroclus's body; Menelaus and Ajax defend it; Hector strips Achilles's armor.",
  18: "Achilles learns of Patroclus's death; Thetis bears his grief to Hephaestus, who forges a new shield.",
  19: "Achilles is reconciled with Agamemnon and, refusing food, arms for battle; his horse Xanthus prophesies his death.",
  20: "Zeus releases the gods into the fight; Achilles, confronting Aeneas, is diverted by Poseidon.",
  21: "Achilles fights the river Scamander, choked with Trojan dead; the gods duel among themselves.",
  22: "Hector, alone outside the gates, flees and is overtaken; Achilles kills him and drags his body around Troy.",
  23: "The funeral of Patroclus; the sacrifice of twelve Trojan youths; the funeral games.",
  24: "Priam, led by Hermes, ransoms Hector's body; their shared grief; Hector's funeral in Troy.",
}
