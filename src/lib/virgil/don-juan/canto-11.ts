import type { Annotation } from "../types"

// ── Don Juan Canto XI — hand-authored scholarly annotations ─────────────
// ch-12 in public/content/don-juan/ch-12.json. Canto XI (90 stanzas):
// Juan's first weeks in London. Byron's most sustained philosophical
// digressions on fame, vanity, and the transience of reputation —
// including the famous "ubi sunt" stanza on the disappearance of the
// fashionable names of his youth.

export const DON_JUAN_CANTO_11: Annotation[] = [
  {
    id: "dj-11-berkeley",
    bookId: "don-juan",
    chapterNumber: 12,
    anchorText: "Bishop Berkeley",
    anchorOccurrence: 1,
    title: "\"Bishop Berkeley said there was no matter\" — the canto's metaphysical opening",
    quotedPassage:
      "When Bishop Berkeley said \"there was no matter,\" / And proved it — 'twas no matter what he said: / They say his system 'tis in vain to batter, / Too subtle for the airiest human head; / And yet who can believe it?",
    passageReference: "Canto XI, stanza 1 · DJ XI.1",
    commentary: `George Berkeley (1685–1753), Anglo-Irish philosopher and Bishop of Cloyne, is the target: his *Treatise Concerning the Principles of Human Knowledge* (1710) argued that matter has no independent existence and that what we call the physical world is a construction of divine perception. Berkeley is the founding figure of philosophical idealism in English, and Byron opens Canto XI by making the joke that is the usual British common-sense rejoinder — "who can believe it?"

The pun in "and proved it — 'twas no matter what he said" is doing the philosophical work. *Matter* has two meanings: physical substance (which Berkeley denied) and importance (which Byron denies, satirically, of Berkeley's argument). The double sense collapses the whole idealist project into a comic throwaway. But Byron does not dismiss Berkeley entirely; stanza 2 and 3 go on to treat the *sublime discovery* of universal egotism — that if all is mental, then all is self — with something like philosophical interest. Byron the sceptic is never quite dismissive; he keeps the possibility alive.

The Berkeley opening prepares the reader for Canto XI's central project: a sustained meditation on the vanity of human things, cast in specifically philosophical rather than narrative terms. Juan in London is the pretext; Byron's philosophical digression is the matter.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
  {
    id: "dj-11-sublime-discovery",
    bookId: "don-juan",
    chapterNumber: 12,
    anchorText: "sublime discovery",
    anchorOccurrence: 1,
    title: "\"A sublime discovery — universal egotism\"",
    quotedPassage:
      "What a sublime discovery 'twas to make the / Universe universal egotism, / That all's ideal — all ourselves!",
    passageReference: "Canto XI, stanza 2 · DJ XI.2",
    commentary: `Byron's compression of Berkeley into three words — *universal egotism* — is the canto's signature move. If Berkeley is right and the world is only perception, then the world is nothing but the self; philosophical idealism collapses into solipsism, and the human subject is left alone in a universe that consists entirely of its own mental activity.

This is Byron giving serious philosophical content to a position he ultimately rejects. The tone is ironic — *sublime discovery* is sarcastic — but the formulation is sharp. Byron is showing that he understands the logical consequences of Berkeley's idealism, and the consequence is, for Byron, literary gold: a universe of solitary minds, each constructing its own world, unable to verify the existence of any other. The philosophical position will be pressed further by Schopenhauer a generation later and by existentialism a century later; Byron is getting there early, in verse, in 1822.

The Canto XI philosophical digression is Byron at his most unguardedly intellectual. He is not a systematic philosopher, but he reads philosophy, argues with it, and — crucially — stages its consequences through the figure of the narrator, who lives in this universe-of-one. The rest of the canto (the fashionable names now forgotten, the Regency London that has passed) illustrates the universal-egotism thesis in its everyday form: everyone lives in a private mental city, and the city changes every season, and nothing outside the mind stays.`,
    crossReferences: [],
    tags: ["philosophical"],
  },
  {
    id: "dj-11-ubi-sunt",
    bookId: "don-juan",
    chapterNumber: 12,
    anchorText: "a year hence",
    anchorOccurrence: 1,
    title: "\"But ask him what he thinks of it a year hence\" — the ubi sunt register",
    quotedPassage:
      "London's first appearance — / But ask him what he thinks of it a year hence!",
    passageReference: "Canto XI, stanza 22 · DJ XI.22",
    commentary: `The stanza pivots Juan's arrival in London (as of the preceding Canto X) into the reflective register that dominates Canto XI. "What he thinks of it a year hence" is the Byronic version of the medieval Latin *ubi sunt* topos — "where are they now?" — the elegiac mode that asks after the named figures of a previous generation and reports their disappearance.

Canto XI's middle stanzas work through a specific British *ubi sunt*: what has happened to the fashionable names of Byron's own London, the London he left in April 1816 and has not seen in 1822 when writing this? The names come quickly — Whitbread, Romilly, Perceval, Curran, George III, Castlereagh — some dead, some disgraced, some simply out of the papers. The stanzas are read as a roll-call of the Regency's vanished political and social class, and the emotional weight is real: these are Byron's own generation, the public men he grew up and partly entered political life under, and the canto mourns them as collectively extinct. London has moved on, which is the whole point — the city changes every season, the names change every year, and the *a year hence* of the line is threat and promise both.

The canto is one of the earliest fully articulated examples of a specifically urban Romantic melancholy: the city as the mind's pursuit of a lost past that was itself, when present, not so satisfactory. Baudelaire reads Canto XI in the 1850s and writes *Tableaux Parisiens* in the register he learns here. Eliot reads both and writes *The Waste Land*.`,
    crossReferences: [],
    tags: ["philosophical", "literary-influence"],
  },
]
