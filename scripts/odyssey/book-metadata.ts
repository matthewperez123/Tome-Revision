/**
 * Odyssey Book-by-book metadata — Roman numerals, Greek letters, and
 * a one-line traditional "argument" per book. Mirrors scripts/iliad/
 * book-speeches.ts's BOOK_ARGUMENTS / BOOK_GREEK_LETTERS / BOOK_ROMAN_NUMERALS
 * shape so the downstream React header component can render either epic
 * from a uniform shape.
 *
 * Greek letter convention: the 24 books of Homer are traditionally
 * indexed by the 24 letters of the classical Greek alphabet. The
 * Iliad uses capitals (Α, Β, Γ…); the Odyssey uses lower-case
 * (α, β, γ…). This is the standard Alexandrian convention preserved
 * in every modern scholarly edition.
 */

export const BOOK_ROMAN_NUMERALS: Record<number, string> = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
  9: "IX",
  10: "X",
  11: "XI",
  12: "XII",
  13: "XIII",
  14: "XIV",
  15: "XV",
  16: "XVI",
  17: "XVII",
  18: "XVIII",
  19: "XIX",
  20: "XX",
  21: "XXI",
  22: "XXII",
  23: "XXIII",
  24: "XXIV",
}

export const BOOK_GREEK_LETTERS: Record<number, { lower: string; name: string }> = {
  1:  { lower: "α", name: "alpha" },
  2:  { lower: "β", name: "beta" },
  3:  { lower: "γ", name: "gamma" },
  4:  { lower: "δ", name: "delta" },
  5:  { lower: "ε", name: "epsilon" },
  6:  { lower: "ζ", name: "zeta" },
  7:  { lower: "η", name: "eta" },
  8:  { lower: "θ", name: "theta" },
  9:  { lower: "ι", name: "iota" },
  10: { lower: "κ", name: "kappa" },
  11: { lower: "λ", name: "lambda" },
  12: { lower: "μ", name: "mu" },
  13: { lower: "ν", name: "nu" },
  14: { lower: "ξ", name: "xi" },
  15: { lower: "ο", name: "omicron" },
  16: { lower: "π", name: "pi" },
  17: { lower: "ρ", name: "rho" },
  18: { lower: "σ", name: "sigma" },
  19: { lower: "τ", name: "tau" },
  20: { lower: "υ", name: "upsilon" },
  21: { lower: "φ", name: "phi" },
  22: { lower: "χ", name: "chi" },
  23: { lower: "ψ", name: "psi" },
  24: { lower: "ω", name: "omega" },
}

/**
 * Traditional one-line "argument" per book — drawn from Alexander Pope's
 * 1725–26 Odyssey arguments, lightly modernized. These capture the book's
 * main action in a single sentence; the reader sees them under the book
 * title, matching the Iliad header convention.
 */
export const BOOK_ARGUMENTS: Record<number, string> = {
  1:  "Athena, in the guise of Mentes, stirs Telemachus to seek news of his father and to confront the suitors.",
  2:  "Telemachus summons the Ithacan assembly, denounces the suitors, and, aided by Athena, sets sail for Pylos by night.",
  3:  "At Pylos, Nestor receives Telemachus and recounts the returns of the Greek chiefs; Telemachus departs for Sparta.",
  4:  "Menelaus and Helen entertain Telemachus at Sparta and reveal that Odysseus lives, held by Calypso. The suitors plot Telemachus's murder.",
  5:  "By Zeus's decree, Hermes commands Calypso to release Odysseus. He builds a raft, is wrecked by Poseidon, and gains the Phaeacian shore.",
  6:  "Athena sends Nausicaä to the river where the shipwrecked Odysseus sleeps; she clothes and conducts him toward the Phaeacian city.",
  7:  "Odysseus enters the palace of Alcinoüs, is welcomed by the king and queen Arete, and promised passage home.",
  8:  "The Phaeacians hold games and a feast; the bard Demodocus sings of Troy, and Odysseus weeps and reveals his name.",
  9:  "Odysseus recounts his wanderings: the Cicones, the Lotus-Eaters, and the blinding of the Cyclops Polyphemus.",
  10: "The tale continues: Aeolus and the bag of winds, the Laestrygonian cannibals, and the enchantress Circe who is subdued by Hermes's herb.",
  11: "The Nekyia: Odysseus descends to the land of the dead and converses with the prophet Tiresias, his mother Anticlea, and the shades of Agamemnon, Achilles, and Ajax.",
  12: "The Sirens, Scylla and Charybdis, and the fatal cattle of Helios. Odysseus alone survives, washed to Calypso's isle.",
  13: "The Phaeacians carry Odysseus home to Ithaca while he sleeps; Athena meets him on the shore and disguises him as an aged beggar.",
  14: "The swineherd Eumaeus receives the disguised Odysseus with perfect xenia and tells the tale of his master's house.",
  15: "Athena recalls Telemachus from Sparta; father and son draw toward their reunion. The backstory of Eumaeus is told.",
  16: "In the swineherd's hut Odysseus reveals himself to Telemachus, and they plan the destruction of the suitors.",
  17: "Odysseus enters his own palace as a beggar; his old dog Argos recognizes him and dies. The suitor Antinoüs strikes him.",
  18: "The beggar Irus challenges Odysseus and is beaten. Penelope appears before the suitors and extracts gifts from them.",
  19: "Odysseus converses with Penelope; the old nurse Eurycleia, washing his feet, recognizes the scar on his thigh and is silenced.",
  20: "The night before the reckoning: omens, Odysseus's restless vigil, and the last insolent banquet of the suitors.",
  21: "Penelope sets the contest of the bow. The suitors fail; Odysseus, still disguised, strings it and shoots through the axe-heads.",
  22: "The slaughter of the suitors. With Telemachus, Eumaeus, and the cowherd Philoetius, Odysseus purges his hall.",
  23: "Penelope tests Odysseus with the secret of their olive-wood bed; recognition and reunion of husband and wife.",
  24: "The shades of the suitors descend to Hades; Odysseus reveals himself to Laertes; the vengeance of the suitors' kin is quelled by Athena, and peace returns to Ithaca.",
}
