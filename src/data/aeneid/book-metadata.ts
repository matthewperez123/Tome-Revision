/**
 * Aeneid book-level metadata — Roman numerals, Latin incipits, and
 * traditional one-sentence arguments for each of the twelve books.
 * Shared by the React reader (for the in-page BookHeaderBlock
 * apparatus) and the scripts/aeneid/transform-book.ts CLI (for
 * ingest-time validation / logging).
 *
 * The arguments follow the Dryden / Pope "ARGUMENT" tradition — one
 * sentence each, orienting the reader without previewing the
 * emotional payoff.
 *
 * Latin incipits are rendered verbatim (Loeb text) with a close
 * English literal; the reader surfaces Book I's Arma virumque cano
 * as the most-famous opening line in Latin poetry.
 */

export const BOOK_ROMAN_NUMERALS: Record<number, string> = {
  1: "I",   2: "II",  3: "III", 4: "IV",  5: "V",   6: "VI",
  7: "VII", 8: "VIII", 9: "IX", 10: "X",  11: "XI", 12: "XII",
}

export const BOOK_ARGUMENTS: Record<number, string> = {
  1: "Juno raises a storm that wrecks the Trojan fleet on the coast of Carthage; Venus conducts Aeneas to the city, where Queen Dido, enchanted by the gods, welcomes him to her feast.",
  2: "Aeneas tells the story of Troy's last night — the wooden horse, the death of Laocoön, the slaughter of Priam, and the escape of a small band bearing their household gods.",
  3: "The wanderings of the Trojan exiles — Thrace, Delos, Crete, the Strophades of the Harpies, Buthrotum where Andromache lives on, and Sicily, where Anchises dies.",
  4: "The love of Dido and Aeneas; Mercury, sent by Jupiter, commands Aeneas to sail; Dido, abandoned, curses him and takes her own life upon a pyre.",
  5: "The funeral games of Anchises in Sicily; Juno inspires the Trojan women to fire the ships; Palinurus the helmsman, lulled by Sleep, falls overboard.",
  6: "Guided by the Sibyl and the golden bough, Aeneas descends to the underworld, greets the shades of Dido and Anchises, and is shown the unborn souls of Rome to come.",
  7: "The Trojans land at the Tiber; King Latinus offers his daughter Lavinia in marriage; Juno rouses Allecto, and the fury of war breaks out across Italy.",
  8: "Aeneas travels upriver to the future site of Rome, where King Evander receives him; Venus has Vulcan forge a shield engraved with Rome's unborn history.",
  9: "While Aeneas is away, Turnus storms the Trojan camp; the night-raid of Nisus and Euryalus ends in their deaths; Ascanius wins his first kill.",
  10: "A council of the gods; Aeneas returns with Etruscan allies; Pallas, son of Evander, is killed by Turnus, who strips his sword-belt.",
  11: "The funeral of Pallas; an embassy of truce; the warrior-maiden Camilla leads the cavalry and falls to a javelin thrown from ambush.",
  12: "The single combat of Aeneas and Turnus; the poem closes as Aeneas, about to spare his fallen enemy, sees the belt of Pallas and drives the sword home.",
}

/** Latin incipits — first line(s) of each book in Virgil's Latin, with a close literal English. */
export const BOOK_INCIPITS: Record<number, { latin: string; english: string }> = {
  1:  { latin: "Arma virumque canō, Trōiae quī prīmus ab ōrīs…",                english: "I sing of arms and the man, who first from the shores of Troy…" },
  2:  { latin: "Conticuēre omnēs intentīque ōra tenēbant…",                       english: "All fell silent, and kept their faces intent upon him…" },
  3:  { latin: "Postquam rēs Asiae Priamīque ēvertere gentem…",                   english: "After it pleased the gods to overturn Asia and Priam's race…" },
  4:  { latin: "At rēgīna gravī iamdūdum saucia cūrā…",                            english: "But the queen, long wounded now by grievous love…" },
  5:  { latin: "Intereā medium Aenēās iam classe tenēbat…",                       english: "Meanwhile Aeneas now held his fleet upon the deep…" },
  6:  { latin: "Sīc fātur lacrimāns, classīque immittit habēnās…",                english: "So he speaks weeping, and gives his fleet free rein…" },
  7:  { latin: "Tū quoque lītoribus nostrīs, Aenēia nūtrīx…",                     english: "You also, nurse of Aeneas, to our shores gave your name…" },
  8:  { latin: "Ut bellī signum Laurentī Turnus ab arce extulit…",                english: "When Turnus raised the signal of war from the Laurentine tower…" },
  9:  { latin: "Atque ea dīversā penitus dum parte geruntur…",                    english: "And while these things are carried on in a distant quarter…" },
  10: { latin: "Panditur intereā domus omnipotentis Olympī…",                    english: "Meanwhile the house of almighty Olympus is thrown open…" },
  11: { latin: "Ōceanum intereā surgēns Aurōra relīquit…",                       english: "Meanwhile Aurora rose and left Ocean behind…" },
  12: { latin: "Turnus ut īnfrāctōs adversō Marte Latīnōs…",                     english: "When Turnus saw the Latins broken in battle…" },
}
