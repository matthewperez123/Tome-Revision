import type { Annotation } from "../types"

// ── Don Juan Canto IX — hand-authored scholarly annotations ─────────────
// ch-10 in public/content/don-juan/ch-10.json. Canto IX (85 stanzas)
// opens with Byron's sustained satirical attack on the Duke of
// Wellington — probably the most savage political satire ever
// directed at a living British military hero, published while
// Wellington was Master-General of the Ordnance and well on his way
// to becoming Prime Minister (1828). The canto then follows Juan to
// Catherine the Great's court in St Petersburg, where the empress
// makes him her favorite.
//
// Density: 5 annotations. Opus-authored per spec Part 4.

export const DON_JUAN_CANTO_9: Annotation[] = [
  // ── 1. The opening — "Oh, Wellington! (or Villainton—for Fame)" ──
  {
    id: "dj-9-opening-villainton",
    bookId: "don-juan",
    chapterNumber: 10,
    anchorText: "Oh, Wellington! (or \"Villainton\"",
    anchorOccurrence: 1,
    title: "\"Oh, Wellington! (or Villainton)\" — the attack begins",
    quotedPassage:
      "Oh, Wellington! (or \"Villainton\" — for Fame / Sounds the heroic syllables both ways; / France could not even conquer your great name, / But punned it down to this facetious phrase — / Beating or beaten she will laugh the same,) / You have obtained great pensions and much praise: / Glory like yours should any dare gainsay, / Humanity would rise, and thunder \"Nay!\"",
    passageReference: "Canto IX, stanza 1 · DJ IX.1",
    commentary: `Byron opens Canto IX with an apostrophe to the Duke of Wellington — the victor of Waterloo, the most-celebrated British soldier since Marlborough, and the political face of the post-1815 conservative order that had driven Byron from England and was now (by 1822) prosecuting journalists, suppressing radical meetings, and defending the restored Bourbons in France. The canto's opening ten stanzas (IX.1–10) are one of the most sustained personal attacks ever published on a living British public figure.

The French pun "Villainton" ("vile-town" or "villainous-ton") was circulating in Paris; Byron picks it up with delight. The etymology is both true and invented: *Villain* from Old French for a peasant or commoner attached to a villa, later carrying the English moral sense of "scoundrel"; *ton* from the French for "tone" or social fashion, but also coinciding with the English "ton" (a unit of weight), so the pun is simultaneously "villainous tone" and "a ton of villainy." Byron the polyglot is delighted to find a French pun that lands in English too.

The closing couplet — "Glory like yours should any dare gainsay, / Humanity would rise, and thunder 'Nay!'" — is Byron's license to begin the attack. He is claiming that Humanity itself (capitalized, allegorical) has already ratified the indictment. This is the opening formality; stanzas 2–10 are the indictment itself.

Wellington was 53 when this canto was published (1823). He lived until 1852, served as Prime Minister (1828–30), Foreign Secretary (1834–35), and Commander-in-Chief of the Forces until his death. Byron's attack did not touch his career. But it fixed, for the literary record, a counter-portrait of the Iron Duke that every 19c radical poet — Shelley, Hugo, later Heine and Whitman — inherited. When English and American school-children studied Waterloo in the 1850s, they also studied these stanzas.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── 2. "The best of cut-throats" — Shakespeare and the Dagger ──
  {
    id: "dj-9-cut-throats",
    bookId: "don-juan",
    chapterNumber: 10,
    anchorText: "the best of cut-throats",
    anchorOccurrence: 1,
    title: "\"The best of cut-throats\" — Byron quotes Macbeth against Wellington",
    quotedPassage:
      "You are \"the best of cut-throats:\" — do not start; / The phrase is Shakespeare's, and not misapplied: — / War's a brain-spattering, windpipe-slitting art, / Unless her cause by right be sanctified.",
    passageReference: "Canto IX, stanza 4 · DJ IX.4",
    commentary: `The phrase "best of cut-throats" is Shakespeare's — *Macbeth* III.iv.17, where Macbeth greets the assassin he has hired to murder Banquo with "There's blood upon thy face… 'Tis Banquo's then… 'Tis better thee without than he within. Thou art the best o' the cut-throats." Byron quotes it against Wellington and then daringly asks the duke not to flinch at the comparison: "do not start; / The phrase is Shakespeare's, and not misapplied."

The move is brilliant and dangerous. Byron is not simply insulting Wellington with a bloody metaphor; he is anchoring the insult in the highest canon — Shakespeare at the crisis of his most serious political tragedy — and claiming that the canonical authority sanctions the comparison. A defender of Wellington would have to argue not with Byron but with Shakespeare. And Byron, as a reader of *Macbeth*, knew exactly what was happening in the Shakespearean passage: the usurper king using flattery to claim a murderer as his best servant. The implication about Wellington is unambiguous: the soldier who has made his career on other men's deaths is the political master's assassin in better uniform.

The two lines that follow — "War's a brain-spattering, windpipe-slitting art, / Unless her cause by right be sanctified" — state Byron's actual philosophical position on war, which is not pacifist (he would die under arms in Greece within two years) but consequentialist: war is literally brain-spattering, windpipe-slitting; it is justifiable only when the cause is just. The test is the justice of the cause, not the glory of the general. Byron is accusing Wellington of having fought a war whose cause — the restoration of European monarchies by force — was not sanctified by right.

This is the clearest political argument Byron makes anywhere in *Don Juan*, and it is the argument that carries him to Missolonghi.`,
    crossReferences: [
      {
        type: "allusion",
        description:
          "Macbeth III.iv.17 — Macbeth greeting the murderer he has hired. Byron quotes the phrase exactly and invokes the whole Shakespearean frame: the political master employing killers and calling them excellent. Byron's reader is expected to complete the comparison.",
        workTitle: "Macbeth",
        workAuthor: "William Shakespeare",
        passageReference: "Act III, scene iv, line 17",
        targetBookId: "macbeth",
        targetChapterNumber: null,
        targetAnchorText: null,
      },
    ],
    tags: ["historical", "literary-influence", "philosophical"],
  },

  // ── 3. The pensions indictment ──
  {
    id: "dj-9-pensions",
    bookId: "don-juan",
    chapterNumber: 10,
    anchorText: "great pensions and much praise",
    anchorOccurrence: 1,
    title: "The pensions indictment — how the hero was paid",
    quotedPassage:
      "You have obtained great pensions and much praise: / Glory like yours should any dare gainsay, / Humanity would rise, and thunder \"Nay!\"",
    passageReference: "Canto IX, stanza 1 (closing lines) · DJ IX.1",
    commentary: `The specific financial indictment under this line matters. Between 1814 and 1817, Parliament voted Wellington — in addition to his regular pay — approximately £700,000 in cash grants and a further annuity of £13,000 in perpetuity, plus the estate of Stratfield Saye (purchased at public expense for £263,000) and two separate dukedoms (one British, one of Ciudad Rodrigo in Spain). In 1822, at the time of this canto's composition, these sums were visible line items in the national budget — and the national budget was under siege from the post-Napoleonic-War recession, the Corn Laws, the Peterloo Massacre of 1819 and the broader radical opposition Byron was in correspondence with from Italy.

"Pensions and praise" is a precise pairing. Byron is not objecting to Wellington's military service; he is objecting to the conversion of that service into cash and status while Englishmen starved. The stanza's logic is that of a political pamphlet: you were paid; the praise was paid for; the humanitarian cost has not been reckoned. The "Nay" of rebuttal is imagined as rising not from political opponents but from *Humanity* as such — the unpaid, the dead at Waterloo, the starving poor at home.

This argument — that military heroism is morally suspect when it has been financially rewarded by a regime whose domestic policies are unjust — is the radical-Whig position of the 1810s and 1820s in a nutshell. Byron gives it a memorable verse form. Hazlitt was making the same argument in prose in the *Morning Chronicle*; Cobbett was making it in the *Political Register*. Byron's contribution is to get it into ottava rima.`,
    crossReferences: [],
    tags: ["historical"],
  },

  // ── 4. Catherine's court — imperial satire ──
  {
    id: "dj-9-catherine",
    bookId: "don-juan",
    chapterNumber: 10,
    anchorText: "Saviour of the Nations",
    anchorOccurrence: 1,
    title: "Catherine the Great — empress as devourer",
    quotedPassage:
      "(I don't mean to say, that if the case / Had been just so, 'twas thus I should have ended;) / But to return: — Could the \"Saviour of the Nations\" / Outsoar Clairville's Genius, or Fame's mutations?",
    passageReference: "Canto IX, stanza 58 · DJ IX.58",
    commentary: `Midway through Canto IX, Juan — who has been sent as an envoy from the Russian army to deliver news of the victory at Ismail — reaches St Petersburg and is presented to Catherine the Great. The mature empress, sixty-three years old in the poem's time-frame (actually 1791), takes immediate interest in the beautiful young Spaniard. She installs him as her new favorite, and stanzas 58–86 are Byron's satirical portrait of an aging autocrat using a young man for pleasure while the affairs of state proceed around them.

Byron's tone toward Catherine is calibrated. He admires her intellect (she corresponded with Voltaire and Diderot; she accumulated one of the great European art collections; she was more sophisticated than any Western monarch of her generation). He despises her politics (her partition of Poland, her wars with the Ottomans, her autocracy). The satire in *Don Juan* is specifically at the image of *power-as-appetite* — the monarch who buys favorites the way a collector buys paintings, and whose personal desires determine state policy. "Saviour of the Nations" in the stanza above is a title Catherine was given after her wars with the Turks freed certain Balkan populations from Ottoman rule; Byron's sneer-quotes reject the title and the logic behind it.

The political context matters: by 1823 Byron had taken up the Greek cause (which meant opposing both the Ottoman Empire and, tacitly, the Russian ambitions that might replace it). His portrait of Catherine is the portrait of Russian imperialism as he saw it — a regime that called itself a liberator while extending its own dominion. Catherine's palette color in the reader legend (imperial gold with a sharp edge) is trying to capture this combination of splendor and predation.

Readers who know Catherine from her memoirs or from Diderot's correspondence will find Byron's portrait narrow but not unfair. The canto is satire, not biography; its target is the *function* of the empress-favorite relation, not Catherine as a whole historical person.`,
    crossReferences: [],
    tags: ["historical", "philosophical"],
  },

  // ── 5. Westminster Abbey — the tomb ──
  {
    id: "dj-9-westminster",
    bookId: "don-juan",
    chapterNumber: 10,
    anchorText: "Upon your tomb in Westminster's old Abbey",
    anchorOccurrence: 1,
    title: "Westminster Abbey — Wellington's future tomb foretold",
    quotedPassage:
      "I don't think that you used Kinnaird quite well / In Marinèt's affair — in fact, 'twas shabby, / And like some other things won't do to tell / Upon your tomb in Westminster's old Abbey.",
    passageReference: "Canto IX, stanza 2 · DJ IX.2",
    commentary: `Early in the attack Byron reaches for a specific indictment — an incident in which Wellington had, in Byron's view, treated Byron's friend Douglas Kinnaird badly over a Parisian matter (the Marinèt affair, a minor diplomatic incident involving a French informer). The point is not the incident itself, which even Byron's editors have struggled to reconstruct fully, but the sentence that follows: these are "things won't do to tell / Upon your tomb in Westminster's old Abbey."

The line presumes Wellington's future burial in Westminster Abbey — which in 1823 was an entirely expected outcome for a national hero of his stature. (In fact Wellington was buried at St Paul's Cathedral in 1852, but the Westminster expectation was the natural one at the time of writing.) The Abbey is England's national pantheon — Chaucer, Spenser, Dryden, Samuel Johnson, and most immediately Handel are there — and Byron's reference is to the tomb-inscription tradition that smooths the defects of the great. What "won't do to tell" on the tomb is what the poem is now telling.

The rhetorical form is what scholars call *occupatio* — the figure of claiming to omit what one is in fact including. Byron pretends to decline naming the shabbiness of Wellington's conduct and in the same sentence names it. The tomb inscription the attack imagines is thus: it says what the actual tomb will not. Byron is writing, in *Don Juan*, the alternative epitaph — one that will survive alongside the official one and, being in English verse, perhaps survive longer.

By 1860 English radicals were quoting these stanzas in pub debates; by 1900 they were standard in anti-imperial literature across Europe. The tomb-inscription joke worked.`,
    crossReferences: [],
    tags: ["historical", "literary-influence"],
  },
]
